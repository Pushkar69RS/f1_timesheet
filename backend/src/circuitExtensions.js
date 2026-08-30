// Comprehensive FIA Circuit Metadata: Accurate Sectors, DRS Zones, and Turn Names for all 24 2025 Grands Prix
const CIRCUIT_EXTENSIONS = {
  "Melbourne": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.28, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.28, "endPct": 0.65, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.65, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (Main Straight)", "startPct": 0.94, "endPct": 0.06, "detectionPct": 0.90 },
      { "name": "DRS 2 (St Kilda Straight)", "startPct": 0.12, "endPct": 0.24, "detectionPct": 0.08 },
      { "name": "DRS 3 (Lakeside Drive)", "startPct": 0.44, "endPct": 0.58, "detectionPct": 0.40 },
      { "name": "DRS 4 (Ross Gregory)", "startPct": 0.68, "endPct": 0.78, "detectionPct": 0.64 }
    ],
    "cornerLabels": [
      { "name": "T1 Jones", "pct": 0.06 },
      { "name": "T2 Brabham", "pct": 0.09 },
      { "name": "T3 Sports Ctr", "pct": 0.18 },
      { "name": "T6 Marina", "pct": 0.32 },
      { "name": "T9 Lakeside", "pct": 0.49 },
      { "name": "T11 Clark", "pct": 0.68 },
      { "name": "T13 Ascari", "pct": 0.82 },
      { "name": "T14 Prost", "pct": 0.88 }
    ]
  },
  "Shanghai": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.30, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.30, "endPct": 0.65, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.65, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (Main Straight)", "startPct": 0.92, "endPct": 0.04, "detectionPct": 0.88 },
      { "name": "DRS 2 (1.2km Back Straight)", "startPct": 0.68, "endPct": 0.88, "detectionPct": 0.64 }
    ],
    "cornerLabels": [
      { "name": "T1-2 Snail Curve", "pct": 0.10 },
      { "name": "T6 Hairpin", "pct": 0.32 },
      { "name": "T8-10 High Speed", "pct": 0.52 },
      { "name": "T13 Banking", "pct": 0.66 },
      { "name": "T14 Hairpin", "pct": 0.88 },
      { "name": "T16 Final Turn", "pct": 0.96 }
    ]
  },
  "Suzuka": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.32, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.32, "endPct": 0.72, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.72, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS (Pit Straight)", "startPct": 0.92, "endPct": 0.04, "detectionPct": 0.88 }
    ],
    "cornerLabels": [
      { "name": "T1-2 First Corner", "pct": 0.07 },
      { "name": "T3-6 S-Curves", "pct": 0.18 },
      { "name": "T7 Dunlop", "pct": 0.28 },
      { "name": "T8-9 Degner", "pct": 0.38 },
      { "name": "T11 Hairpin", "pct": 0.48 },
      { "name": "T13-14 Spoon", "pct": 0.65 },
      { "name": "T15 130R", "pct": 0.78 },
      { "name": "T16 Casio Triangle", "pct": 0.88 }
    ]
  },
  "Sakhir": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.28, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.28, "endPct": 0.68, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.68, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (Main Straight)", "startPct": 0.90, "endPct": 0.04, "detectionPct": 0.85 },
      { "name": "DRS 2 (Straight 2)", "startPct": 0.12, "endPct": 0.22, "detectionPct": 0.08 },
      { "name": "DRS 3 (Back Straight)", "startPct": 0.65, "endPct": 0.78, "detectionPct": 0.60 }
    ],
    "cornerLabels": [
      { "name": "T1 Michael Schumacher", "pct": 0.06 },
      { "name": "T4 Oasis", "pct": 0.22 },
      { "name": "T8 Hairpin", "pct": 0.42 },
      { "name": "T10 Tricky Left", "pct": 0.52 },
      { "name": "T11 Desert Infield", "pct": 0.60 },
      { "name": "T14-15 Final", "pct": 0.88 }
    ]
  },
  "Jeddah": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.30, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.30, "endPct": 0.70, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.70, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (Main Straight)", "startPct": 0.92, "endPct": 0.04, "detectionPct": 0.88 },
      { "name": "DRS 2 (Fast Sweep)", "startPct": 0.44, "endPct": 0.62, "detectionPct": 0.40 },
      { "name": "DRS 3 (Red Sea Straight)", "startPct": 0.72, "endPct": 0.88, "detectionPct": 0.68 }
    ],
    "cornerLabels": [
      { "name": "T1-2 Chicane", "pct": 0.07 },
      { "name": "T13 Banked Hairpin", "pct": 0.36 },
      { "name": "T16-20 High Speed", "pct": 0.55 },
      { "name": "T22 Fast Chicane", "pct": 0.68 },
      { "name": "T27 Hairpin", "pct": 0.90 }
    ]
  },
  "Miami": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.32, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.32, "endPct": 0.68, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.68, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (Main Straight)", "startPct": 0.94, "endPct": 0.05, "detectionPct": 0.90 },
      { "name": "DRS 2 (Turn 9-11)", "startPct": 0.35, "endPct": 0.48, "detectionPct": 0.30 },
      { "name": "DRS 3 (1.2km Back Straight)", "startPct": 0.72, "endPct": 0.90, "detectionPct": 0.68 }
    ],
    "cornerLabels": [
      { "name": "T1 Stadium Entrance", "pct": 0.06 },
      { "name": "T4-6 Fast S", "pct": 0.18 },
      { "name": "T7-8 Marina", "pct": 0.28 },
      { "name": "T11-12 Highway", "pct": 0.48 },
      { "name": "T14-15 Overpass Chicane", "pct": 0.62 },
      { "name": "T17 Hairpin", "pct": 0.90 }
    ]
  },
  "Imola": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.33, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.33, "endPct": 0.67, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.67, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS (Pit Straight)", "startPct": 0.90, "endPct": 0.05, "detectionPct": 0.85 }
    ],
    "cornerLabels": [
      { "name": "T2-4 Tamburello", "pct": 0.14 },
      { "name": "T5-6 Villeneuve", "pct": 0.26 },
      { "name": "T7 Tosa", "pct": 0.38 },
      { "name": "T9 Piratella", "pct": 0.48 },
      { "name": "T11-12 Acque Minerali", "pct": 0.58 },
      { "name": "T14-15 Variante Alta", "pct": 0.72 },
      { "name": "T17-18 Rivazza", "pct": 0.86 }
    ]
  },
  "Monaco": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.30, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.30, "endPct": 0.70, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.70, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS (Pit Straight)", "startPct": 0.92, "endPct": 0.04, "detectionPct": 0.86 }
    ],
    "cornerLabels": [
      { "name": "T1 Sainte Dévote", "pct": 0.07 },
      { "name": "T2 Beau Rivage", "pct": 0.14 },
      { "name": "T3 Massenet", "pct": 0.20 },
      { "name": "T4 Casino", "pct": 0.26 },
      { "name": "T5 Mirabeau Haute", "pct": 0.34 },
      { "name": "T6 Grand Hotel Hairpin", "pct": 0.40 },
      { "name": "T7 Mirabeau Bas", "pct": 0.45 },
      { "name": "T8 Portier", "pct": 0.50 },
      { "name": "T9 Tunnel", "pct": 0.58 },
      { "name": "T10-11 Chicane", "pct": 0.65 },
      { "name": "T12 Tabac", "pct": 0.72 },
      { "name": "T13-14 Swimming Pool", "pct": 0.80 },
      { "name": "T15-16 Rascasse", "pct": 0.90 }
    ]
  },
  "Barcelona": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.30, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.30, "endPct": 0.68, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.68, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (Main Straight)", "startPct": 0.90, "endPct": 0.05, "detectionPct": 0.86 },
      { "name": "DRS 2 (Back Straight)", "startPct": 0.55, "endPct": 0.66, "detectionPct": 0.50 }
    ],
    "cornerLabels": [
      { "name": "T1-2 Elf Chicane", "pct": 0.08 },
      { "name": "T3 Renault Long Right", "pct": 0.18 },
      { "name": "T4 Repsol", "pct": 0.26 },
      { "name": "T5 Seat Hairpin", "pct": 0.38 },
      { "name": "T9 Campsa", "pct": 0.52 },
      { "name": "T10 La Caixa", "pct": 0.68 },
      { "name": "T13-14 Fast Final Turn", "pct": 0.88 }
    ]
  },
  "Montreal": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.30, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.30, "endPct": 0.68, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.68, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (Main Straight)", "startPct": 0.94, "endPct": 0.04, "detectionPct": 0.90 },
      { "name": "DRS 2 (Casino Straight)", "startPct": 0.72, "endPct": 0.88, "detectionPct": 0.68 }
    ],
    "cornerLabels": [
      { "name": "T1-2 Senna S", "pct": 0.08 },
      { "name": "T6-7 Pont de la Concorde", "pct": 0.38 },
      { "name": "T8-9 Chicane", "pct": 0.52 },
      { "name": "T10 L'Epingle Hairpin", "pct": 0.68 },
      { "name": "T13-14 Wall of Champions", "pct": 0.90 }
    ]
  },
  "Spielberg": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.28, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.28, "endPct": 0.68, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.68, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (Main Straight)", "startPct": 0.90, "endPct": 0.04, "detectionPct": 0.86 },
      { "name": "DRS 2 (Uphill Straight)", "startPct": 0.10, "endPct": 0.22, "detectionPct": 0.06 },
      { "name": "DRS 3 (Downhill Straight)", "startPct": 0.28, "endPct": 0.42, "detectionPct": 0.25 }
    ],
    "cornerLabels": [
      { "name": "T1 Niki Lauda", "pct": 0.06 },
      { "name": "T3 Remus Uphill Hairpin", "pct": 0.24 },
      { "name": "T4 Schlossgold", "pct": 0.42 },
      { "name": "T6 Rauch", "pct": 0.58 },
      { "name": "T7-8 Wurth", "pct": 0.70 },
      { "name": "T9-10 Jochen Rindt", "pct": 0.88 }
    ]
  },
  "Silverstone": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.30, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.30, "endPct": 0.68, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.68, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (Wellington Straight)", "startPct": 0.18, "endPct": 0.28, "detectionPct": 0.14 },
      { "name": "DRS 2 (Hangar Straight)", "startPct": 0.70, "endPct": 0.84, "detectionPct": 0.66 }
    ],
    "cornerLabels": [
      { "name": "T1 Abbey", "pct": 0.05 },
      { "name": "T3 Village", "pct": 0.12 },
      { "name": "T4 The Loop", "pct": 0.15 },
      { "name": "T6 Brooklands", "pct": 0.30 },
      { "name": "T7 Luffield", "pct": 0.35 },
      { "name": "T8 Woodcote", "pct": 0.39 },
      { "name": "T9 Copse", "pct": 0.48 },
      { "name": "T10 Maggotts", "pct": 0.56 },
      { "name": "T11 Becketts", "pct": 0.60 },
      { "name": "T12 Chapel", "pct": 0.65 },
      { "name": "T15 Stowe", "pct": 0.85 },
      { "name": "T16 Vale", "pct": 0.90 },
      { "name": "T18 Club", "pct": 0.95 }
    ]
  },
  "Spa": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.30, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.30, "endPct": 0.70, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.70, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (Kemmel Straight)", "startPct": 0.18, "endPct": 0.28, "detectionPct": 0.12 },
      { "name": "DRS 2 (Pit Straight)", "startPct": 0.92, "endPct": 0.02, "detectionPct": 0.88 }
    ],
    "cornerLabels": [
      { "name": "T1 La Source", "pct": 0.04 },
      { "name": "T2-4 Eau Rouge / Raidillon", "pct": 0.14 },
      { "name": "T5-6 Les Combes", "pct": 0.30 },
      { "name": "T7 Malmedy", "pct": 0.35 },
      { "name": "T8-9 Rivage / Bruxelles", "pct": 0.42 },
      { "name": "T10-11 Double Gauche (Pouhon)", "pct": 0.54 },
      { "name": "T12-13 Fagnes", "pct": 0.63 },
      { "name": "T14-15 Stavelot", "pct": 0.70 },
      { "name": "T16-17 Blanchimont", "pct": 0.82 },
      { "name": "T18-19 Bus Stop Chicane", "pct": 0.92 }
    ]
  },
  "Budapest": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.30, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.30, "endPct": 0.70, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.70, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (Main Straight)", "startPct": 0.90, "endPct": 0.05, "detectionPct": 0.86 },
      { "name": "DRS 2 (Turn 1-2 Straight)", "startPct": 0.08, "endPct": 0.16, "detectionPct": 0.05 }
    ],
    "cornerLabels": [
      { "name": "T1 Downhill Hairpin", "pct": 0.06 },
      { "name": "T2-3 Downhill S", "pct": 0.16 },
      { "name": "T4 Mansell Blind Left", "pct": 0.28 },
      { "name": "T6-7 Chicane", "pct": 0.46 },
      { "name": "T11 Infield Sweeper", "pct": 0.68 },
      { "name": "T12 Right Angle", "pct": 0.78 },
      { "name": "T14 Final Hairpin", "pct": 0.92 }
    ]
  },
  "Zandvoort": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.30, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.30, "endPct": 0.68, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.68, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (Main Straight)", "startPct": 0.92, "endPct": 0.04, "detectionPct": 0.86 },
      { "name": "DRS 2 (Hugenholtz Straight)", "startPct": 0.24, "endPct": 0.34, "detectionPct": 0.20 }
    ],
    "cornerLabels": [
      { "name": "T1 Tarzan Hairpin", "pct": 0.06 },
      { "name": "T3 Hugenholtz 18° Bank", "pct": 0.20 },
      { "name": "T7 Scheivlak High Speed", "pct": 0.44 },
      { "name": "T9-10 Masters Hairpin", "pct": 0.62 },
      { "name": "T11-12 Hans Ernst Chicane", "pct": 0.74 },
      { "name": "T14 Arie Luyendyk 18° Bank", "pct": 0.90 }
    ]
  },
  "Monza": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.32, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.32, "endPct": 0.68, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.68, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (Main Straight)", "startPct": 0.88, "endPct": 0.04, "detectionPct": 0.84 },
      { "name": "DRS 2 (Serraglio Straight)", "startPct": 0.48, "endPct": 0.64, "detectionPct": 0.44 }
    ],
    "cornerLabels": [
      { "name": "T1-2 Variante del Rettifilo", "pct": 0.08 },
      { "name": "T3 Curva Grande (Biassono)", "pct": 0.20 },
      { "name": "T4-5 Variante della Roggia", "pct": 0.34 },
      { "name": "T6-7 Curva di Lesmo 1 & 2", "pct": 0.44 },
      { "name": "T8-10 Variante Ascari", "pct": 0.68 },
      { "name": "T11 Curva Parabolica (Alboreto)", "pct": 0.86 }
    ]
  },
  "Baku": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.28, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.28, "endPct": 0.68, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.68, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (2.2km Main Straight)", "startPct": 0.82, "endPct": 0.04, "detectionPct": 0.78 },
      { "name": "DRS 2 (Straight 2)", "startPct": 0.12, "endPct": 0.22, "detectionPct": 0.08 }
    ],
    "cornerLabels": [
      { "name": "T1 90° Left", "pct": 0.06 },
      { "name": "T3 90° Left", "pct": 0.22 },
      { "name": "T7-8 Castle Section Entrance", "pct": 0.42 },
      { "name": "T11 Old City Exit", "pct": 0.58 },
      { "name": "T15 Downhill Left", "pct": 0.72 },
      { "name": "T16 Final Turn onto 2.2km Straight", "pct": 0.80 }
    ]
  },
  "Singapore": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.30, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.30, "endPct": 0.68, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.68, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (Pit Straight)", "startPct": 0.92, "endPct": 0.04, "detectionPct": 0.88 },
      { "name": "DRS 2 (Raffles Blvd)", "startPct": 0.18, "endPct": 0.28, "detectionPct": 0.14 },
      { "name": "DRS 3 (Bayfront)", "startPct": 0.68, "endPct": 0.78, "detectionPct": 0.64 }
    ],
    "cornerLabels": [
      { "name": "T1-3 Sheares Chicane", "pct": 0.08 },
      { "name": "T7 Memorial", "pct": 0.32 },
      { "name": "T9 Stamford", "pct": 0.45 },
      { "name": "T10 Padang", "pct": 0.52 },
      { "name": "T14 Connaught", "pct": 0.68 },
      { "name": "T16-17 New Marina Bay Straight", "pct": 0.78 },
      { "name": "T19 Final Left", "pct": 0.92 }
    ]
  },
  "Austin": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.32, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.32, "endPct": 0.68, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.68, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (Main Straight)", "startPct": 0.90, "endPct": 0.04, "detectionPct": 0.86 },
      { "name": "DRS 2 (1.2km Back Straight)", "startPct": 0.50, "endPct": 0.66, "detectionPct": 0.46 }
    ],
    "cornerLabels": [
      { "name": "T1 Blind Uphill Crest", "pct": 0.06 },
      { "name": "T3-6 Maggotts-Style Esses", "pct": 0.18 },
      { "name": "T9-10 Hairpin Entry", "pct": 0.36 },
      { "name": "T11 Hairpin", "pct": 0.48 },
      { "name": "T12 Heavy Braking", "pct": 0.66 },
      { "name": "T13-15 Stadium Section", "pct": 0.74 },
      { "name": "T16-18 Triple Apex Multi-Right", "pct": 0.84 },
      { "name": "T19-20 Final Sweepers", "pct": 0.92 }
    ]
  },
  "Mexico City": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.30, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.30, "endPct": 0.68, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.68, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (1.3km Main Straight)", "startPct": 0.88, "endPct": 0.04, "detectionPct": 0.84 },
      { "name": "DRS 2 (Straight 2)", "startPct": 0.08, "endPct": 0.18, "detectionPct": 0.04 },
      { "name": "DRS 3 (Back Straight)", "startPct": 0.36, "endPct": 0.46, "detectionPct": 0.32 }
    ],
    "cornerLabels": [
      { "name": "T1-3 Moisés Solana Chicane", "pct": 0.08 },
      { "name": "T4-6 Lake S", "pct": 0.22 },
      { "name": "T7-11 High-Speed Esses", "pct": 0.50 },
      { "name": "T12-16 Foro Sol Baseball Stadium", "pct": 0.78 },
      { "name": "T17 Mansell Curve", "pct": 0.92 }
    ]
  },
  "Interlagos": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.28, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.28, "endPct": 0.68, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.68, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (Main Straight)", "startPct": 0.88, "endPct": 0.04, "detectionPct": 0.84 },
      { "name": "DRS 2 (Reta Oposta)", "startPct": 0.14, "endPct": 0.26, "detectionPct": 0.10 }
    ],
    "cornerLabels": [
      { "name": "T1-2 Senna S", "pct": 0.06 },
      { "name": "T3 Curva do Sol", "pct": 0.12 },
      { "name": "T4-5 Descida do Lago", "pct": 0.28 },
      { "name": "T6-7 Ferradura", "pct": 0.42 },
      { "name": "T8 Laranjinha", "pct": 0.52 },
      { "name": "T10 Bico de Pato", "pct": 0.62 },
      { "name": "T11 Mergulho", "pct": 0.72 },
      { "name": "T12 Junção", "pct": 0.82 },
      { "name": "T13-15 Arquibancadas", "pct": 0.92 }
    ]
  },
  "Las Vegas": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.30, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.30, "endPct": 0.68, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.68, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (Koval Lane)", "startPct": 0.12, "endPct": 0.24, "detectionPct": 0.08 },
      { "name": "DRS 2 (1.9km Strip Straight)", "startPct": 0.68, "endPct": 0.88, "detectionPct": 0.64 }
    ],
    "cornerLabels": [
      { "name": "T1-2 Pit Chicane", "pct": 0.06 },
      { "name": "T5-9 MSG Sphere Complex", "pct": 0.34 },
      { "name": "T12 Sands Avenue", "pct": 0.62 },
      { "name": "T14-16 Strip Chicane", "pct": 0.88 },
      { "name": "T17 Harmon Avenue", "pct": 0.95 }
    ]
  },
  "Lusail": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.30, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.30, "endPct": 0.70, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.70, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS (1.0km Main Straight)", "startPct": 0.90, "endPct": 0.04, "detectionPct": 0.86 }
    ],
    "cornerLabels": [
      { "name": "T1 Heavy Braking Right", "pct": 0.06 },
      { "name": "T2-5 Flowing Infield", "pct": 0.22 },
      { "name": "T6 Hairpin Left", "pct": 0.40 },
      { "name": "T10 Fast Sweeper", "pct": 0.62 },
      { "name": "T12-14 Triple Right Apex", "pct": 0.78 },
      { "name": "T16 Final Turn", "pct": 0.92 }
    ]
  },
  "Yas Marina": {
    "sectors": [
      { "sector": 1, "startPct": 0.00, "endPct": 0.30, "name": "Sector 1", "color": "#00D2BE" },
      { "sector": 2, "startPct": 0.30, "endPct": 0.68, "name": "Sector 2", "color": "#FFB800" },
      { "sector": 3, "startPct": 0.68, "endPct": 1.00, "name": "Sector 3", "color": "#BF5AF2" }
    ],
    "drsZonesList": [
      { "name": "DRS 1 (1.2km Back Straight)", "startPct": 0.36, "endPct": 0.48, "detectionPct": 0.32 },
      { "name": "DRS 2 (Straight 2)", "startPct": 0.54, "endPct": 0.66, "detectionPct": 0.50 }
    ],
    "cornerLabels": [
      { "name": "T1 First Left", "pct": 0.06 },
      { "name": "T5 Modified Hairpin", "pct": 0.30 },
      { "name": "T6 Chicane", "pct": 0.50 },
      { "name": "T9 Marsa Banked Turn", "pct": 0.68 },
      { "name": "T12-14 W Hotel Marina", "pct": 0.82 },
      { "name": "T15-16 Final Double Right", "pct": 0.94 }
    ]
  }
};

module.exports = { CIRCUIT_EXTENSIONS };
