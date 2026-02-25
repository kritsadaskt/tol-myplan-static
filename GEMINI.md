# true-online-salepage — TRUE ONLINE MY Plan Sale/Lead Page

## Purpose
Static sale/landing page for TRUE ONLINE fiber internet packages (MY Plan). Customers browse internet packages, configure add-ons, then submit contact details as a lead to the backend.

## Page Flow
```
myplan/index.html  ──(ถัดไป button)──▶  myplan-summary/index.html  ──(Submit)──▶  myplan-thank-you/index.html
 configurator                         lead form                                  confirmation
      │                                   │
 $store.plan state               leadForm Alpine.data
 in sessionStorage               reads $store.plan for summary
```

## Stack
| Tool | Version | How |
|------|---------|-----|
| Tailwind CSS | v4.2.x | npm + CLI |
| Alpine.js | v3.x | CDN |
| Alpine Persist | v3.x | CDN (load BEFORE Alpine core) |
| Fetch API | native | browser built-in |

## Commands
```bash
npm run dev    # watch mode — auto-recompiles tailwind.css → styles.css
npm run build  # minified production build
```
Input:  `assets/css/tailwind.css`
Output: `assets/css/styles.css`

## API Endpoint
Defined at the **top of `assets/js/main.js`** (line 3):
```js
const API_ENDPOINT = 'https://api.example.com/leads';
```
Replace this constant when the backend is ready.

## Lead Payload Shape
```json
{
  "plan":     { "id": "plan_2", "speed": "1000/500 Mbps", "contract": 24, "price": 599 },
  "addOns":   { "mobilePack": false, "meshWifi": true, "cctv": null, "tvPack": "now_ent" },
  "total":    698,
  "customer": { "name": "...", "phone": "0812345678", "email": "..." }
}
```

## Brand Tokens (tailwind.css @theme)
| Token | Value |
|-------|-------|
| `--color-tol-red` | `#e00000` (Figma exact red) |
| `--color-flowkit-red` | `#FC5555` (legacy) |
| `--color-charcoal-grey` | `#303C46` |
| `--color-true-blue` | `#0066CC` |
| `--color-page-bg` | `#fafafa` |

## Plans Data (in main.js)
| ID | Speed | Contract | Price |
|----|-------|----------|-------|
| plan_1 | 1000/500 Mbps | 12 เดือน | 699 ฿ |
| plan_2 | 1000/500 Mbps | 24 เดือน | 599 ฿ |
| plan_3 | 500/500 Mbps  | 12 เดือน | 599 ฿ |
| plan_4 | 500/500 Mbps  | 24 เดือน | 499 ฿ |

## Add-on Prices (in main.js)
| Key | Label | Price |
|-----|-------|-------|
| mobilePack | ซิมเน็ตเต็มสปีด 20GB | 120 ฿ |
| meshWifi | Mesh WiFi | 100 ฿ |
| cctv_premium | CCTV 1 ตัว + ประกันอัคคีภัย | 179 ฿ |
| cctv_basic | CCTV 1 ตัว | 99 ฿ |
| asian_combo_plus | Asian Combo + กล่อง TrueID TV | 240 ฿ |
| asian_combo | Asian Combo | 139 ฿ |
| now_ent_plus | TrueVisions NOW ENT + กล่อง TrueID TV | 180 ฿ |
| now_ent | TrueVisions NOW ENT | 99 ฿ |

## Fonts
`Better Together` WOFF2 files copied from the existing `true-online` project:
- `assets/fonts/better-together/BetterTogether-Regular.woff2`
- `assets/fonts/better-together/BetterTogether-Medium.woff2`
- `assets/fonts/better-together/BetterTogether-Bold.woff2`

## Image Assets
Figma-exported asset URLs are embedded directly in the HTML and main.js (`ASSETS` object).
For production, download and host these under `assets/images/`.

Figma source: `https://www.figma.com/design/GJBgsrvl6LiMF9ysW2wH5h/Website-Design-2026---Dev?node-id=1210-28536`

## Alpine State Architecture
```
Alpine.store('plan')            → global, persisted in sessionStorage
  .selectedPlanId               → string | null
  .addOns                       → { mobilePack, meshWifi, cctv, tvPack }
  .selectedPlan (getter)        → plan object | null
  .addonTotal (getter)          → number
  .total (getter)               → number
  .activeAddons (getter)        → [{ label, price }]

Alpine.data('leadForm')         → confirm/index.html only
  .fields                       → { name, phone, email }
  .errors                       → {}
  .loading                      → boolean
  .apiError                     → string | null
  .validate()                   → boolean
  .submit()                     → POST → API_ENDPOINT → redirect /thank-you/

Alpine.data('summary')          → summary bar in index.html
  .open                         → boolean (collapsible detail panel)
```

## Testing URL
Use `http://localhost:5500` to test the website.

## TODO (pending)
- [ ] Replace placeholder `API_ENDPOINT` with real backend URL
- [ ] Download and host Figma image assets locally in `assets/images/`
- [ ] Add mobile Figma node URL for responsive CSS pass
- [ ] Add `<head>` meta tags: OG, canonical, favicon
