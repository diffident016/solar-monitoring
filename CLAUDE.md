# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start development server
npm run build      # Production build
npm run preview    # Preview production build
npm run lint       # ESLint (zero warnings allowed)
```

## Architecture

This is a **React + Vite** single-page application for real-time solar monitoring. There is no backend server — all data flows through **Firebase Realtime Database**.

### Data Flow

IoT sensors write to Firebase nodes → Firebase SDK listeners push updates → React state updates → ApexCharts re-render

**Firebase nodes:**
- `/NODE-01` — PV Panel 1 (voltage, current, power, temperature, timestamp)
- `/NODE-02` — PV Panel 2 (same fields)
- `/NODE-04` — AC Inverter (voltage, current, power, frequency, temperature)
- `/NODE-05` — Pyranometer (radiance in W/m²)
- `/RECORDING` — Recording control state (`recording`: 0=stopped, 1=recording, 2=saving; also `startedAt`, `endedAt`)

Firebase is initialized in `firebase.js` (root level) using `VITE_FIREBASE_*` environment variables. It exports `db`, `storage`, and `auth`.

### Component Structure

`App.jsx` → `Dashboard.jsx` (all logic lives here)

`Dashboard.jsx` is the central component managing all state and Firebase subscriptions. It uses:
- `onValue()` listeners per node, with a 5–10 second timeout to mark devices **Inactive**
- `useInterval` (custom hook in `src/components/`) for periodic chart updates every 1000ms (PV data) and 2000ms (radiance)
- `ApexCharts.exec()` called directly to append data points — charts maintain a max of 30 points
- The recording toggle writes back to `/RECORDING` in Firebase

Reusable components:
- `Chart.jsx` — line chart for PV/inverter metrics (ApexCharts, datetime x-axis, light theme)
- `RadianceChart.jsx` — variant of Chart for solar radiation (y-axis max 1000 W/m², straight curves)
- `PVPanel.jsx` — status card showing active/inactive state, voltage, current, power, temperature

### Styling

Tailwind CSS with a light theme. Custom Lato fonts (Regular, Bold, Light) are defined in `src/index.css` via `@font-face` and referenced in `tailwind.config.js` under `fontFamily`.
