# PaceTracer 🏎️ — 2026 Formula 1 Telemetry & Circuit Replay Platform

[![CI Pipeline](https://github.com/scipr/pacetracer/actions/workflows/ci.yml/badge.svg)](https://github.com/scipr/pacetracer/actions)
[![Node.js](https://img.shields.io/badge/Node.js-v18%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5-purple.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-38B2AC.svg)](https://tailwindcss.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED.svg)](https://www.docker.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

> **PaceTracer** is a full-stack, broadcast-grade Formula 1 Telemetry & Race Replay platform simulating the **2026 FIA Formula 1 World Championship** regulation era. Built with **Node.js, Express, WebSockets, HTML5 Canvas, React 18, and Tailwind CSS**, it delivers 60 FPS track telemetry, authentic FIA circuit sector timing, live race control incident feeds, head-to-head driver telemetry comparisons, and instant Grand Prix switching across all 24 rounds of the 2026 calendar.

---

## 📸 Screenshots Showcase

| **2026 Telemetry Dashboard (Bahrain GP)** | **2026 Landing Page & Specs** |
| :---: | :---: |
| ![Bahrain GP Telemetry Dashboard](screenshots/03_dashboard_bahrain_gp.png) | ![Landing Page Hero](screenshots/01_landing_page_hero.png) |

| **24-Round 2026 Calendar Grid** | **Silverstone Circuit Replay** |
| :---: | :---: |
| ![2026 F1 Calendar](screenshots/02_landing_page_calendar.png) | ![Silverstone Circuit Replay](screenshots/04_dashboard_silverstone_gp.png) |

---

## 🌟 Key Features

### 📡 Real-Time WebSocket Telemetry Engine (50ms Broadcast Ticks)
- **Event-Driven Timeline Synchronization**: Ingests and normalizes multi-endpoint timing data into a chronological high-frequency event stream.
- **Bi-Directional Playback Controls**: Scrub anywhere along the Grand Prix (0%–100%) with instant state reconstruction and variable playback speeds (**0.25x**, **0.5x**, **1.0x**, **2.0x**, **4.0x**).
- **Synchronized Lap Tracking**: Continuous leader-lap tracking ensures zero delay at lights out (starts on Lap 1 immediately) and reliable lap progress.

### 🗺️ Calibrated FIA Circuit Maps (Catmull-Rom Spline Ribbon)
- **Dense Spline Interpolation**: Pre-computes 300 parametric points per circuit, locking cars 100% to the racing line with realistic lateral overtaking offsets.
- **Official Sector Transponders**: Accurate Sector 1 (Cyan `#00D2BE`), Sector 2 (Amber `#FFB800`), and Sector 3 (Purple `#BF5AF2`) timing split lines.
- **Interactive Map Overlays**: Canvas toggles for **Official Turn Numbers** (e.g. *T1 Copse*, *T10 Maggotts*, *T15 Stowe*) and **DRS Activation Zones**.
- **Interactive Tooltip Cards**: Hover or click on any car marker to inspect real-time position, current tyre compound, and lap times.

### ⚔️ Head-to-Head Driver Telemetry Comparison
- Side-by-side comparison modal for any 2 drivers on the grid:
  - **Pace Delta Analysis**: Real-time fastest lap delta indicator.
  - **Sector Delta Matrix**: Side-by-side S1, S2, S3 breakdown.
  - **Stint & Tyre Strategy**: Compound comparison, tyre wear, and pit stop counts.

### 📻 Race Control Live Incident Feed & Weather Widget
- **Dynamic Incident Feed**: Real-time ticker logging fastest laps (🟣), pit stops (🟠), VSC/Safety Cars (🟡), and lead changes (👑).
- **Live Circuit Weather Radar**: Ambient and track temperature, rain risk %, wind speed, and weather condition badges.

### 🏎️ 2026 Grid & Official Driver Headshots
- Official Formula 1 media CDN portrait headshots for all 20 drivers.
- Complete 2026 constructor lineup including the **Audi F1 Team** (Hülkenberg & Bortoleto), **Scuderia Ferrari** (Hamilton & Leclerc), and **Williams** (Sainz & Albon).

### 🌓 Full Light & Dark Theme Switcher
- **Cyber F1 Dark Mode**: High-contrast neon radar styling (`#07090E`, `#111622`).
- **Broadcast Light Mode**: Clean FIA timing tower aesthetic (`#F3F4F6`, `#FFFFFF`).

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                         REACT FRONTEND                           │
│  ┌───────────────────────┐             ┌──────────────────────┐  │
│  │   TimesheetTable      │             │    TrackMap Canvas   │  │
│  │ (Timing, Gaps, Tyres) │             │ (60 FPS Spline Lerp) │  │
│  └───────────▲───────────┘             └──────────▲───────────┘  │
│              │                                    │              │
│  ┌───────────┴────────────────────────────────────┴───────────┐  │
│  │            Dashboard.jsx (WebSocket Client)                │  │
│  │  - WeatherWidget    - RaceControlFeed   - CompareModal     │  │
│  └───────────────────────────────▲────────────────────────────┘  │
└──────────────────────────────────┼───────────────────────────────┘
                                   │  WebSocket Snapshot Stream (50ms)
                                   │  JSON Control Actions (Play/Seek)
┌──────────────────────────────────▼───────────────────────────────┐
│                        NODE.JS BACKEND                           │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │           server.js (Express HTTP API + WS Server)         │  │
│  └───────────────────────────────▲────────────────────────────┘  │
│                                  │                               │
│  ┌───────────────────────────────┴────────────────────────────┐  │
│  │                      ReplayEngine.js                       │  │
│  │  - Event queue processing & timeline interpolation         │  │
│  │  - State snapshot manager & 2026 Grand Prix generator      │  │
│  └───────────▲────────────────────────────────────▲───────────┘  │
│              │                                    │              │
│  ┌───────────┴───────────┐             ┌──────────┴───────────┐  │
│  │      season2026.js    │             │    circuitData.js    │  │
│  │ (24-Round 2026 Data)  │             │ (FIA Track Geometry) │  │
│  └───────────────────────┘             └──────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher

### Local Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/pacetracer.git
   cd pacetracer
   ```

2. **Install dependencies**:
   ```bash
   # Install Backend
   cd backend
   npm install

   # Install Frontend
   cd ../frontend
   npm install
   ```

3. **Start the application**:
   ```bash
   # Terminal 1: Start Backend (Port 3001)
   cd backend
   node src/server.js

   # Terminal 2: Start Frontend (Port 5173)
   cd frontend
   npm run dev
   ```

4. Open your browser and navigate to **[http://localhost:5173](http://localhost:5173)**.

---

## 🧪 Testing & Verification

```bash
# Backend test suite (11 unit tests)
cd backend
npm test

# Frontend ESLint & production build
cd ../frontend
npm run lint
npm run build
```

---

## 🐳 Docker Deployment

Run the complete multi-container setup via Docker Compose:

```bash
docker-compose up --build
```
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3001`

---

## 📄 License
ISC License &copy; 2026 PaceTracer.
