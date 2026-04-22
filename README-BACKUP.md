# Atlas Musterseite — BACKUP 19.04.2026

**NICHT LÖSCHEN. NICHT ÜBERSCHREIBEN.**

Vollständiges Backup des Produktions-Deployments von atlas-musterseite.vercel.app
(= atlas.artgerecht-bauen.com) vom 19.04.2026.

## Deployment-Info
- Vercel Deployment: `dpl_8hrhoP44HyeNsnZxRx2U2qk1EyCD`
- Vercel Projekt: `atlas-musterseite` (prj_fuFQLYIHbsnaYvVa9WN3z2zkhgfn)
- Domains: atlas.artgerecht-bauen.com, atlas-musterseite.vercel.app

## Dateien
- `src/index.html` — Startseite mit Map, Suche, Arten-Grid, Erklärungen
- `src/foerderung.html` — KfW, BAFA, BEG Förderung
- `src/oekopunkte.html` — Ökopunkte-System Erklärung
- `src/qng-siegel.html` — QNG Qualitätssiegel
- `src/arten/_template.html` — Arten-Steckbrief Template (45 Arten)
- `src/gemeinde/boeblingen.html` — Musterseite Böblingen (Detail)
- `src/vercel.json` — Routing-Config (Slug-Rewrites)

## Wiederherstellung
```bash
# Vercel CLI:
vercel deploy --prod
# Oder: Deployment dpl_8hrhoP44HyeNsnZxRx2U2qk1EyCD in Vercel Dashboard promoten
```
