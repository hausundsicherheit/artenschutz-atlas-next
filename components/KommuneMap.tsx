'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  latitude: number | null | undefined;
  longitude: number | null | undefined;
  kommunenName: string;
  plz?: string | null;
  bundesland?: string | null;
};

type ObsCounts = {
  total: number;
  byGroup: Record<string, number>;
  pgCount: number; // Schutzgebiete-Count (heuristisch)
};

declare global {
  interface Window {
    L?: any;
    __leafletLoading?: Promise<void>;
  }
}

const LEAFLET_CSS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
const LEAFLET_JS = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';

function loadLeaflet(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.L) return Promise.resolve();
  if (window.__leafletLoading) return window.__leafletLoading;

  window.__leafletLoading = new Promise((resolve, reject) => {
    if (!document.querySelector(`link[href="${LEAFLET_CSS}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = LEAFLET_CSS;
      document.head.appendChild(link);
    }
    const script = document.createElement('script');
    script.src = LEAFLET_JS;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Leaflet failed'));
    document.head.appendChild(script);
  });
  return window.__leafletLoading;
}

// iNaturalist-Tiergruppe → Farbe
const GROUP_COLORS: Record<string, string> = {
  Aves: '#1e3d28',          // Vögel — moss-dark
  Mammalia: '#b85444',       // Säuger (inkl. Fledermäuse) — clay
  Reptilia: '#d97706',       // Reptilien — amber
  Amphibia: '#2563eb',       // Amphibien — blue
  Insecta: '#a16207',        // Insekten — yellow-brown
  Arachnida: '#7c2d12',      // Spinnen — dark brown
  default: '#6b756e',
};
const GROUP_LABELS: Record<string, string> = {
  Aves: 'Vögel',
  Mammalia: 'Säuger',
  Reptilia: 'Reptilien',
  Amphibia: 'Amphibien',
  Insecta: 'Insekten',
  Arachnida: 'Spinnen',
};

export default function KommuneMap({
  latitude,
  longitude,
  kommunenName,
  plz,
  bundesland,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [counts, setCounts] = useState<ObsCounts | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!latitude || !longitude || !mapRef.current) return;
    let cancelled = false;

    loadLeaflet().then(async () => {
      if (cancelled || !mapRef.current || !window.L) return;
      const L = window.L;

      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }

      const map = L.map(mapRef.current, {
        center: [latitude, longitude],
        zoom: 11,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      });
      mapInstance.current = map;

      // Layer 1: OSM Basis
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap',
        maxZoom: 18,
      }).addTo(map);

      // Layer 2: BfN-Schutzgebiete (FFH, NSG, Vogelschutz) als WMS
      // Quelle: geodienste.bfn.de — offizielle Schutzgebiete Deutschland
      try {
        L.tileLayer.wms('https://geodienste.bfn.de/ogc/wms/schutzgebiet', {
          layers: 'Naturschutzgebiete,Fauna_Flora_Habitat_Gebiete,Vogelschutzgebiete',
          format: 'image/png',
          transparent: true,
          version: '1.3.0',
          attribution: '© BfN-Schutzgebiete',
          opacity: 0.5,
        }).addTo(map);
      } catch (e) {
        console.warn('BfN WMS layer failed', e);
      }

      // Stadtmitte-Marker (Clay)
      const cityIcon = L.divIcon({
        className: 'kommune-marker-city',
        html: `<div style="
          position:relative;width:30px;height:30px;
          background:#b85444;
          border:3px solid white;
          border-radius:50% 50% 50% 0;
          transform:rotate(-45deg);
          box-shadow:0 2px 6px rgba(0,0,0,.25);
        "><div style="
          position:absolute;top:7px;left:10px;
          width:10px;height:10px;
          background:white;border-radius:50%;
        "></div></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
      });
      L.marker([latitude, longitude], { icon: cityIcon })
        .addTo(map)
        .bindPopup(`<div style="font-family:Inter,sans-serif;font-size:13px;">
          <div style="font-family:Fraunces,serif;font-size:15px;color:#1e3d28;margin-bottom:2px;">
            ${kommunenName}
          </div>
          <div style="color:#5a6b5c;">${plz || ''} ${bundesland ? '· ' + bundesland : ''}</div>
        </div>`);

      // Layer 3: iNaturalist Beobachtungen (alle Tiere) im 8km-Umkreis, letzten 5 Jahre
      try {
        const fiveYearsAgo = new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000)
          .toISOString().split('T')[0];
        // Taxa: Aves(3), Mammalia(40151), Reptilia(26036), Amphibia(20978), Insecta(47158), Arachnida(47119)
        const url = `https://api.inaturalist.org/v1/observations?` +
          `lat=${latitude}&lng=${longitude}&radius=8` +
          `&iconic_taxa=Aves,Mammalia,Reptilia,Amphibia,Insecta,Arachnida` +
          `&d1=${fiveYearsAgo}&quality_grade=research&photos=true` +
          `&per_page=200&order_by=observed_on&order=desc`;
        const r = await fetch(url, { signal: AbortSignal.timeout(15000) });
        if (!r.ok) throw new Error('iNat API ' + r.status);
        const data = await r.json();
        const obs = data.results || [];
        if (cancelled) return;

        // Cluster nach Tiergruppe (vereinfacht ohne MarkerClusterer-Plugin)
        const byGroup: Record<string, number> = {};
        const clusterLayer = L.layerGroup().addTo(map);
        for (const o of obs) {
          if (!o.geojson?.coordinates) continue;
          const [lng, lat] = o.geojson.coordinates;
          const taxon = o.taxon?.iconic_taxon_name || 'default';
          const color = GROUP_COLORS[taxon] || GROUP_COLORS.default;
          byGroup[taxon] = (byGroup[taxon] || 0) + 1;

          const dot = L.circleMarker([lat, lng], {
            radius: 5,
            fillColor: color,
            color: 'white',
            weight: 1.5,
            opacity: 1,
            fillOpacity: 0.85,
          }).addTo(clusterLayer);

          const taxonName = o.taxon?.preferred_common_name || o.taxon?.name || 'Unbekannt';
          const date = o.observed_on ? new Date(o.observed_on).toLocaleDateString('de-DE') : '';
          const photo = o.photos?.[0]?.url?.replace('square', 'small');
          dot.bindPopup(`<div style="font-family:Inter,sans-serif;font-size:12.5px;min-width:160px;">
            ${photo ? `<img src="${photo}" alt="" style="width:100%;height:90px;object-fit:cover;border-radius:4px;margin-bottom:6px;">` : ''}
            <div style="font-family:Fraunces,serif;font-size:14px;color:#1e3d28;line-height:1.2;">${taxonName}</div>
            <div style="color:#5a6b5c;margin-top:2px;">${GROUP_LABELS[taxon] || taxon}${date ? ' · ' + date : ''}</div>
          </div>`);
        }

        if (!cancelled) {
          setCounts({ total: obs.length, byGroup, pgCount: 0 });
          setLoading(false);
        }
      } catch (err) {
        console.warn('iNat fetch failed', err);
        if (!cancelled) setLoading(false);
      }
    }).catch((err) => {
      console.error('Map init failed', err);
      if (!cancelled) setLoading(false);
    });

    return () => {
      cancelled = true;
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [latitude, longitude, kommunenName, plz, bundesland]);

  if (!latitude || !longitude) {
    return (
      <div className="bg-cream/60 border border-border rounded-xl p-5 text-center text-[13px] text-text-muted">
        Geokoordinaten für {kommunenName} nicht verfügbar
      </div>
    );
  }

  // Top-2 Gruppen für Mini-Stats unten
  const topGroups = counts
    ? Object.entries(counts.byGroup).sort(([, a], [, b]) => b - a).slice(0, 2)
    : [];

  return (
    <div className="bg-white rounded-2xl shadow-card border border-border overflow-hidden">
      <div className="px-4 pt-3.5 pb-2 border-b border-border bg-cream/30 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-clay font-semibold">Karte</div>
          <div className="font-serif text-[15px] text-ink leading-tight">{kommunenName}</div>
        </div>
        {counts && counts.total > 0 && (
          <div className="text-right">
            <div className="font-serif text-[18px] text-moss-dark leading-none">{counts.total}</div>
            <div className="text-[10px] uppercase tracking-wider text-text-dim mt-0.5">Beobacht.</div>
          </div>
        )}
      </div>

      <div
        ref={mapRef}
        className="w-full"
        style={{ height: '320px', minHeight: '320px', backgroundColor: '#f5efe5' }}
      />

      <div className="px-4 py-3 border-t border-border">
        {loading && (
          <div className="text-[12px] text-text-muted flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-moss-light rounded-full animate-pulse"></span>
            Lade Beobachtungen & Schutzgebiete…
          </div>
        )}
        {!loading && counts && (
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-3 flex-wrap text-[11.5px]">
              <span className="inline-flex items-center gap-1.5 text-text-muted">
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: GROUP_COLORS.Aves }}></span>Vögel
              </span>
              <span className="inline-flex items-center gap-1.5 text-text-muted">
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: GROUP_COLORS.Mammalia }}></span>Säuger
              </span>
              <span className="inline-flex items-center gap-1.5 text-text-muted">
                <span className="inline-block w-2.5 h-2.5 rounded-full" style={{ backgroundColor: GROUP_COLORS.Insecta }}></span>Insekten
              </span>
              <span className="inline-flex items-center gap-1.5 text-text-muted">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-400/45 border border-orange-500"></span>Schutzgebiete
              </span>
            </div>
          </div>
        )}
        {!loading && (!counts || counts.total === 0) && (
          <div className="text-[12px] text-text-muted">
            Keine Forschungsklasse-Beobachtungen im 8 km-Umkreis (letzte 5 Jahre).
          </div>
        )}
        <div className="text-[10px] text-text-dim mt-2">
          Daten: iNaturalist · BfN-Schutzgebiete · OSM
        </div>
      </div>
    </div>
  );
}
