# Landslide Early Warning System — Dima Hasao

A demo-ready React + Vite + Tailwind CSS dashboard for a Smart India Hackathon prototype. It represents a district control room for monitoring landslide risk in Dima Hasao district, Assam.

The current application is a **frontend-only demonstration**. It uses realistic hardcoded data, a schematic SVG map, and simulated interactions. It does not connect to live sensors, weather services, GIS data, SMS gateways, or a machine-learning model.

## What we built in this prototype

### 1. Risk map view

- District control-room layout with a responsive sidebar and mobile navigation.
- Schematic Dima Hasao map with seven mock monitoring locations:
  - Haflong
  - Maibong
  - Jatinga
  - Mahur Bond
  - Umrangso
  - Diyungbra
  - New Pangsha
- Clickable locations with risk colors:
  - Green — low
  - Yellow — moderate
  - Orange — high
  - Red — severe
- Location detail panel showing:
  - Risk score
  - Rainfall in the last 24 hours
  - Rainfall over the last 7 days
  - Slope angle
  - Road status
  - Plain-language explanation of the risk level
- Map legend and district monitoring summary cards.

### 2. Situation overview

- Summary cards for monitored villages, high/severe risk villages, blocked roads, and active alerts.
- Village status table with risk level, road status, rainfall, and update time.
- Seven-day rainfall trend chart built with Recharts.

### 3. Citizen reports

- Report form with village selection, report type, description, and photo upload.
- Local image preview after selecting a photo. The image is not uploaded to storage.
- Mock recent reports with timestamps and review statuses.
- Demo submission confirmation. It does not create a permanent database record.

### 4. Alert centre

- Mock sent alerts showing village, risk level, message, time, and delivery channels.
- App and SMS delivery indicators.
- English, Assamese, and Hindi language preview toggle.
- Offline mode demonstration with a cached-data banner.
- Offline mode is visual only; it does not currently cache or synchronize data.

## How the map is integrated

The prototype currently uses a **custom inline SVG map**, not Leaflet or another live mapping SDK. This was chosen to keep the hackathon demo simple, fast, dependency-light, and easy for a student team to edit.

The map implementation is in `MapGraphic` inside `client/pages/Index.tsx`:

- The district outline, contour lines, roads, and rivers are SVG paths.
- Each village has an `x` and `y` coordinate in the SVG `viewBox`.
- Village markers are rendered from the `villages` array in `client/mockData.js`.
- Clicking a marker updates the selected village and detail panel.
- Marker colors come from the shared `riskMeta` configuration.

This means the map is an **illustrative monitoring view**, not a GIS map. It does not currently use latitude/longitude, a geographic projection, map tiles, satellite imagery, or real district boundaries.

## Is the current data and map accurate?

Not for operational use. The prototype is accurate as a **UI demonstration of the intended workflow**, but its geography and measurements are not validated for emergency decisions.

Specifically:

- The village names are representative locations for the demo, but marker positions are schematic SVG coordinates.
- The district outline is a visual approximation and should not be used for navigation or administrative boundaries.
- Risk scores, rainfall amounts, slope angles, road statuses, alerts, and timestamps are mock values.
- The risk explanations are example text, not outputs from a validated landslide model.
- The dashboard does not receive live weather, ground movement, road closure, or citizen-report data.
- Alert delivery is represented in the interface only; no SMS or app notification is sent.

Before this system is used by officials or residents, every location, boundary, measurement, threshold, and alert workflow must be reviewed by the district disaster management authority and relevant technical experts.

## Editable mock data

All demonstration records are kept in one file so a non-technical teammate can update the demo quickly:

- `client/mockData.js`

The file contains:

- `villages` — names, mock risk levels, rainfall, slopes, roads, scores, and map coordinates.
- `rainfallTrend` — chart points for the last seven days.
- `alerts` — sent alert messages and delivery channels.
- `reports` — previously submitted citizen reports.
- `riskMeta` — labels, colors, and soft background colors for the risk scale.

No database or API setup is needed to change the prototype data.

## How to run the prototype

### Requirements

- Node.js 18 or newer
- pnpm 10 or newer (recommended)
- Git, if cloning the repository

Dependencies are managed in `package.json` and locked in `pnpm-lock.yaml`. The `require.txt` file documents the runtime requirements for this frontend project.

### Install and run locally

```bash
pnpm install
pnpm dev
```

Open the local URL shown by Vite in the terminal. The development server serves the React dashboard and Express server together.

### Production build

```bash
pnpm build
pnpm start
```

`pnpm build` creates the client and server bundles. `pnpm start` serves the production build.

### Quality checks

```bash
pnpm typecheck
pnpm test
```

## Project structure

- `client/pages/Index.tsx` — dashboard shell, navigation, map, and all four views.
- `client/mockData.js` — editable mock villages, rainfall, alerts, and reports.
- `client/global.css` — global styles, typography, risk colors, and map styling.
- `tailwind.config.ts` — Tailwind theme configuration.
- `client/components/ui/` — reusable UI components from the starter.
- `server/` — Express server integration and example API route.
- `require.txt` — runtime requirements for the project.

## What is needed to make this an end product

### 1. Replace the schematic map with real GIS data

A production map should use one of the following approaches:

- **Leaflet with OpenStreetMap-compatible tiles** for a low-cost open-source approach.
- **Mapbox or another managed map provider** for polished maps, geocoding, and routing.
- A government-approved GIS tile service if required by the deployment environment.

The map should use verified latitude/longitude for every monitoring point and official district/village boundary GeoJSON. Risk zones can then be rendered as marker colors, circles, or shaded polygons. Road closures should come from an authoritative road-status source rather than mock strings.

### 2. Add a secure backend and database

The frontend should stop importing mock data directly and use authenticated server endpoints. A production backend would store:

- Villages, monitoring stations, boundaries, and road segments.
- Sensor readings and rainfall observations.
- Model predictions and risk-score history.
- Citizen reports and uploaded images.
- Alert history, recipients, delivery results, and acknowledgements.
- Users, departments, roles, and audit logs.

PostgreSQL with a geospatial extension such as PostGIS would be a strong fit for location and boundary queries.

### 3. Connect real data sources

Potential inputs should be evaluated and approved before integration:

- Automatic rain gauges and local weather stations.
- Official rainfall observations and forecasts.
- Digital elevation models and slope calculations.
- Soil, geology, land-cover, drainage, and historical landslide inventories.
- Satellite or remote-sensing change detection.
- Road authority closure and maintenance updates.
- Verified field reports from district teams and residents.

Each source needs timestamps, quality checks, units, ownership, and a fallback behavior when data is late or unavailable.

### 4. Build and validate the risk model

The current risk score is only a mock number. A real model should:

1. Define the prediction target, such as probability of a landslide within a location and time window.
2. Combine rainfall intensity/duration, antecedent rainfall, slope, soil/geology, drainage, land cover, and historical events.
3. Calibrate thresholds with Dima Hasao historical data and local expert review.
4. Compare predictions against verified incidents using precision, recall, false-alarm rate, missed-event rate, and lead time.
5. Show model version, confidence, input freshness, and an explainable reason for each alert.
6. Run a controlled pilot before operational deployment.

A high-risk color should never be treated as a guaranteed event. It should communicate a reviewed level of concern and recommended action.

### 5. Implement real alerts and escalation

A production alert workflow should support:

- Official approval before high/severe public alerts.
- SMS, app push notifications, email, sirens, radio, or other approved channels.
- Assamese, Hindi, and English translations reviewed by fluent speakers.
- Recipient groups by village, road, department, and role.
- Delivery receipts, retries, opt-in/opt-out rules, and escalation contacts.
- Alert expiry, cancellation, correction, and acknowledgement.

### 6. Make offline mode real

The current offline switch is only a UI demonstration. A real field-ready version should use a PWA/service worker and local storage or IndexedDB to:

- Cache the latest map and safe-to-display risk data.
- Allow citizen and field reports to be drafted without connectivity.
- Queue reports locally with a visible sync state.
- Retry synchronization safely when the connection returns.
- Avoid showing stale data without a clear timestamp and warning.

### 7. Add identity, security, and governance

The end product should include:

- Role-based access for district officials, field teams, reviewers, and administrators.
- Secure authentication and session management.
- Server-side validation for every report and alert request.
- Malware and size checks for uploaded images.
- Rate limits and abuse protection on public reports.
- Encryption in transit and at rest where required.
- Audit logs for model changes, alert approvals, and data edits.
- A data-retention policy and privacy notice for citizen submissions.

### 8. Add operational quality controls

Before launch, the team should add:

- Unit and integration tests for risk calculations, alert rules, and synchronization.
- Browser tests for the map, report submission, and alert workflows.
- Monitoring for API failures, stale sensors, failed notifications, and storage issues.
- Backups and a disaster-recovery plan.
- Accessibility testing, including keyboard navigation, color contrast, and screen-reader labels.
- Load testing for periods of heavy rainfall when many users may access the system at once.
- A support process and training materials for district operators.

## Recommended production architecture

```text
Sensors / weather / GIS / field reports
                |
        Ingestion and validation APIs
                |
       Database + geospatial storage
                |
     Risk model and alert decision service
                |
    Authenticated dashboard and mobile/PWA
                |
      SMS / push / email / public advisories
```

The current prototype covers the last dashboard layer with mock inputs. The other layers still need to be designed, implemented, tested, and approved.

## Environment variables

The current dashboard does not require external API keys. If the surrounding project tooling uses the Builder public key, configure it in `.env` as `VITE_PUBLIC_BUILDER_KEY`. Production integrations should keep private API keys on the server and never expose them in client-side code.
