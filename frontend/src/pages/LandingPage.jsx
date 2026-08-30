import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RACES_2025 = [
  { round: 1, key: '2025-01', name: 'Australian Grand Prix', location: 'Melbourne, Australia', circuit: 'Albert Park Circuit', date: 'March 14–16, 2025', flag: '🇦🇺', laps: 58, isSprint: false, winner: 'Lando Norris', winnerNum: 4, team: 'McLaren', teamColour: '#FF8000' },
  { round: 2, key: '2025-02', name: 'Chinese Grand Prix', location: 'Shanghai, China', circuit: 'Shanghai International Circuit', date: 'March 21–23, 2025', flag: '🇨🇳', laps: 56, isSprint: true, winner: 'Oscar Piastri', winnerNum: 81, team: 'McLaren', teamColour: '#FF8000' },
  { round: 3, key: '2025-03', name: 'Japanese Grand Prix', location: 'Suzuka, Japan', circuit: 'Suzuka Circuit', date: 'April 4–6, 2025', flag: '🇯🇵', laps: 53, isSprint: false, winner: 'Max Verstappen', winnerNum: 1, team: 'Red Bull Racing', teamColour: '#3671C6' },
  { round: 4, key: '2025-04', name: 'Bahrain Grand Prix', location: 'Sakhir, Bahrain', circuit: 'Bahrain International Circuit', date: 'April 11–13, 2025', flag: '🇧🇭', laps: 57, isSprint: false, winner: 'Oscar Piastri', winnerNum: 81, team: 'McLaren', teamColour: '#FF8000' },
  { round: 5, key: '2025-05', name: 'Saudi Arabian Grand Prix', location: 'Jeddah, Saudi Arabia', circuit: 'Jeddah Corniche Circuit', date: 'April 18–20, 2025', flag: '🇸🇦', laps: 50, isSprint: false, winner: 'Oscar Piastri', winnerNum: 81, team: 'McLaren', teamColour: '#FF8000' },
  { round: 6, key: '2025-06', name: 'Miami Grand Prix', location: 'Miami, USA', circuit: 'Miami International Autodrome', date: 'May 2–4, 2025', flag: '🇺🇸', laps: 57, isSprint: true, winner: 'Oscar Piastri', winnerNum: 81, team: 'McLaren', teamColour: '#FF8000' },
  { round: 7, key: '2025-07', name: 'Emilia Romagna Grand Prix', location: 'Imola, Italy', circuit: 'Autodromo Enzo e Dino Ferrari', date: 'May 16–18, 2025', flag: '🇮🇹', laps: 63, isSprint: false, winner: 'Max Verstappen', winnerNum: 1, team: 'Red Bull Racing', teamColour: '#3671C6' },
  { round: 8, key: '2025-08', name: 'Monaco Grand Prix', location: 'Monte Carlo, Monaco', circuit: 'Circuit de Monaco', date: 'May 23–25, 2025', flag: '🇲🇨', laps: 78, isSprint: false, winner: 'Lando Norris', winnerNum: 4, team: 'McLaren', teamColour: '#FF8000' },
  { round: 9, key: '2025-09', name: 'Spanish Grand Prix', location: 'Barcelona, Spain', circuit: 'Circuit de Barcelona-Catalunya', date: 'May 30–June 1, 2025', flag: '🇪🇸', laps: 66, isSprint: false, winner: 'Oscar Piastri', winnerNum: 81, team: 'McLaren', teamColour: '#FF8000' },
  { round: 10, key: '2025-10', name: 'Canadian Grand Prix', location: 'Montreal, Canada', circuit: 'Circuit Gilles-Villeneuve', date: 'June 13–15, 2025', flag: '🇨🇦', laps: 70, isSprint: false, winner: 'George Russell', winnerNum: 63, team: 'Mercedes', teamColour: '#27F4D2' },
  { round: 11, key: '2025-11', name: 'Austrian Grand Prix', location: 'Spielberg, Austria', circuit: 'Red Bull Ring', date: 'June 27–29, 2025', flag: '🇦🇹', laps: 71, isSprint: false, winner: 'Lando Norris', winnerNum: 4, team: 'McLaren', teamColour: '#FF8000' },
  { round: 12, key: '2025-12', name: 'British Grand Prix', location: 'Silverstone, Great Britain', circuit: 'Silverstone Circuit', date: 'July 4–6, 2025', flag: '🇬🇧', laps: 52, isSprint: false, winner: 'Lando Norris', winnerNum: 4, team: 'McLaren', teamColour: '#FF8000' },
  { round: 13, key: '2025-13', name: 'Belgian Grand Prix', location: 'Stavelot, Belgium', circuit: 'Circuit de Spa-Francorchamps', date: 'July 25–27, 2025', flag: '🇧🇪', laps: 44, isSprint: true, winner: 'Oscar Piastri', winnerNum: 81, team: 'McLaren', teamColour: '#FF8000' },
  { round: 14, key: '2025-14', name: 'Hungarian Grand Prix', location: 'Budapest, Hungary', circuit: 'Hungaroring', date: 'August 1–3, 2025', flag: '🇭🇺', laps: 70, isSprint: false, winner: 'Lando Norris', winnerNum: 4, team: 'McLaren', teamColour: '#FF8000' },
  { round: 15, key: '2025-15', name: 'Dutch Grand Prix', location: 'Zandvoort, Netherlands', circuit: 'Circuit Zandvoort', date: 'August 29–31, 2025', flag: '🇳🇱', laps: 72, isSprint: false, winner: 'Oscar Piastri', winnerNum: 81, team: 'McLaren', teamColour: '#FF8000' },
  { round: 16, key: '2025-16', name: 'Italian Grand Prix', location: 'Monza, Italy', circuit: 'Autodromo Nazionale Monza', date: 'September 5–7, 2025', flag: '🇮🇹', laps: 53, isSprint: false, winner: 'Max Verstappen', winnerNum: 1, team: 'Red Bull Racing', teamColour: '#3671C6' },
  { round: 17, key: '2025-17', name: 'Azerbaijan Grand Prix', location: 'Baku, Azerbaijan', circuit: 'Baku City Circuit', date: 'September 19–21, 2025', flag: '🇦🇿', laps: 51, isSprint: false, winner: 'Max Verstappen', winnerNum: 1, team: 'Red Bull Racing', teamColour: '#3671C6' },
  { round: 18, key: '2025-18', name: 'Singapore Grand Prix', location: 'Marina Bay, Singapore', circuit: 'Marina Bay Street Circuit', date: 'October 3–5, 2025', flag: '🇸🇬', laps: 62, isSprint: false, winner: 'George Russell', winnerNum: 63, team: 'Mercedes', teamColour: '#27F4D2' },
  { round: 19, key: '2025-19', name: 'United States Grand Prix', location: 'Austin, USA', circuit: 'Circuit of the Americas', date: 'October 17–19, 2025', flag: '🇺🇸', laps: 56, isSprint: true, winner: 'Max Verstappen', winnerNum: 1, team: 'Red Bull Racing', teamColour: '#3671C6' },
  { round: 20, key: '2025-20', name: 'Mexico City Grand Prix', location: 'Mexico City, Mexico', circuit: 'Autódromo Hermanos Rodríguez', date: 'October 24–26, 2025', flag: '🇲🇽', laps: 71, isSprint: false, winner: 'Lando Norris', winnerNum: 4, team: 'McLaren', teamColour: '#FF8000' },
  { round: 21, key: '2025-21', name: 'São Paulo Grand Prix', location: 'São Paulo, Brazil', circuit: 'Autódromo José Carlos Pace', date: 'November 7–9, 2025', flag: '🇧🇷', laps: 71, isSprint: true, winner: 'Lando Norris', winnerNum: 4, team: 'McLaren', teamColour: '#FF8000' },
  { round: 22, key: '2025-22', name: 'Las Vegas Grand Prix', location: 'Las Vegas, USA', circuit: 'Las Vegas Strip Circuit', date: 'November 20–22, 2025', flag: '🇺🇸', laps: 50, isSprint: false, winner: 'Max Verstappen', winnerNum: 1, team: 'Red Bull Racing', teamColour: '#3671C6' },
  { round: 23, key: '2025-23', name: 'Qatar Grand Prix', location: 'Lusail, Qatar', circuit: 'Lusail International Circuit', date: 'November 28–30, 2025', flag: '🇶🇦', laps: 57, isSprint: true, winner: 'Max Verstappen', winnerNum: 1, team: 'Red Bull Racing', teamColour: '#3671C6' },
  { round: 24, key: '2025-24', name: 'Abu Dhabi Grand Prix', location: 'Yas Marina, UAE', circuit: 'Yas Marina Circuit', date: 'December 5–7, 2025', flag: '🇦🇪', laps: 58, isSprint: false, winner: 'Max Verstappen', winnerNum: 1, team: 'Red Bull Racing', teamColour: '#3671C6', note: 'Lando Norris P3 (WDC Champion)' },
];

const TEAMS_2025 = [
  { name: 'Ferrari', colour: '#E80020', engine: 'Ferrari 1.6L V6 Turbo Hybrid', drivers: ['Lewis Hamilton #44', 'Charles Leclerc #16'], badge: 'SF' },
  { name: 'McLaren', colour: '#FF8000', engine: 'Mercedes-AMG', drivers: ['Lando Norris #4', 'Oscar Piastri #81'], badge: 'MCL' },
  { name: 'Red Bull Racing', colour: '#3671C6', engine: 'Honda RBPT', drivers: ['Max Verstappen #1', 'Liam Lawson #30'], badge: 'RBR' },
  { name: 'Mercedes-AMG', colour: '#27F4D2', engine: 'Mercedes-AMG', drivers: ['George Russell #63', 'Kimi Antonelli #12'], badge: 'MERC' },
  { name: 'Aston Martin', colour: '#229971', engine: 'Mercedes-AMG', drivers: ['Fernando Alonso #14', 'Lance Stroll #18'], badge: 'AMR' },
  { name: 'Williams Racing', colour: '#64C4FF', engine: 'Mercedes-AMG', drivers: ['Carlos Sainz #55', 'Alexander Albon #23'], badge: 'WIL' },
  { name: 'Stake F1 Team Sauber', colour: '#52E252', engine: 'Ferrari Hybrid', drivers: ['Nico Hülkenberg #27', 'Gabriel Bortoleto #5'], badge: 'SAUBER' },
  { name: 'BWT Alpine', colour: '#0093CC', engine: 'Renault E-Tech', drivers: ['Pierre Gasly #10', 'Jack Doohan #7 / Colapinto #43'], badge: 'ALP' },
  { name: 'MoneyGram Haas', colour: '#B6BABD', engine: 'Ferrari Hybrid', drivers: ['Esteban Ocon #31', 'Oliver Bearman #87'], badge: 'HAAS' },
  { name: 'Visa Cash App RB', colour: '#6692FF', engine: 'Honda RBPT', drivers: ['Yuki Tsunoda #22', 'Isack Hadjar #6'], badge: 'VCARB' },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [selectedRace, setSelectedRace] = useState(RACES_2025[23]); // Default to Abu Dhabi Finale
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setDarkMode(JSON.parse(savedMode));
    } else {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', true);
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', false);
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const handleLaunchRace = (raceKey) => {
    const targetKey = raceKey || '2025-24';
    fetch(`http://${window.location.hostname}:3001/api/load-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session_key: targetKey }),
    })
      .finally(() => {
        navigate(`/dashboard?session=${targetKey}`);
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#07090E] text-gray-900 dark:text-white selection:bg-red-600 selection:text-white font-sans antialiased overflow-x-hidden transition-colors duration-300">
      {/* Background Neon Telemetry Grid & Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-[32rem] h-[32rem] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(#94A3B8_1px,transparent_1px)] dark:bg-[radial-gradient(#1E293B_1px,transparent_1px)] [background-size:24px_24px] opacity-20" />
      </div>

      {/* Navigation Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#07090E]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800/80 transition-colors">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-black text-white text-lg italic shadow-lg shadow-red-600/40">
              F1
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-gray-900 dark:text-white">
                <span className="text-[#E10600]">PACE</span>TRACER
              </span>
              <span className="ml-2 text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800/50">
                2025 SEASON
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2 px-3 rounded-lg bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 text-xs font-bold transition-colors border border-gray-200 dark:border-gray-800"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
            <button
              onClick={() => handleLaunchRace(selectedRace.key)}
              className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-[#E10600] hover:from-red-500 hover:to-red-600 text-white font-black text-xs uppercase tracking-wider rounded-lg transition-all shadow-lg shadow-red-600/30 hover:scale-105 active:scale-95 flex items-center gap-2"
            >
              <span>Launch Telemetry</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column - Hero Copy */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-gray-900/90 border border-gray-200 dark:border-gray-800 text-xs font-mono text-gray-700 dark:text-gray-300 w-fit shadow-md">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>FIA FORMULA 1 WORLD CHAMPIONSHIP 2025</span>
            </div>

            <h1 className="text-5xl lg:text-6xl font-black tracking-tight text-gray-900 dark:text-white leading-tight">
              Real-Time <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500">2025 Telemetry</span> & Circuit Replay
            </h1>

            <p className="text-gray-600 dark:text-gray-400 text-base lg:text-lg leading-relaxed max-w-2xl">
              Experience the historic 2025 Formula 1 season featuring Lewis Hamilton in Scuderia Ferrari scarlet, Carlos Sainz at Williams, Kimi Antonelli at Mercedes, and Gabriel Bortoleto at Stake Sauber. Replay all 24 Grands Prix with 60 FPS track coordinates, live gaps, and 100% verified real-world FIA race classifications.
            </p>

            {/* Feature Highlights Badges */}
            <div className="grid grid-cols-3 gap-3 pt-2 font-mono">
              <div className="p-3.5 rounded-xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800/80 shadow-sm">
                <span className="text-2xl font-black text-gray-900 dark:text-white block">24</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">2025 Rounds</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800/80 shadow-sm">
                <span className="text-2xl font-black text-[#00D2BE] block">60 FPS</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Canvas Radar</span>
              </div>
              <div className="p-3.5 rounded-xl bg-white dark:bg-gray-900/80 border border-gray-200 dark:border-gray-800/80 shadow-sm">
                <span className="text-2xl font-black text-[#FFB800] block">6 Sprints</span>
                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">Sprint Rounds</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => handleLaunchRace(selectedRace.key)}
                className="px-8 py-4 bg-gradient-to-r from-red-600 to-[#E10600] hover:from-red-500 hover:to-red-600 text-white font-black text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-red-600/40 hover:scale-105 active:scale-95 flex items-center gap-3"
              >
                <span>ENTER 2025 DASHBOARD</span>
                <span className="text-lg">🏎️</span>
              </button>
              <a
                href="#calendar-section"
                className="px-6 py-4 bg-white dark:bg-gray-900/90 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-300 hover:text-black dark:hover:text-white font-bold text-sm rounded-xl transition-colors border border-gray-200 dark:border-gray-800 flex items-center gap-2 shadow-sm"
              >
                <span>Explore 2025 Calendar</span>
                <span>↓</span>
              </a>
            </div>
          </div>

          {/* Right Column - 2025 Technical Regulations Mockup */}
          <div className="lg:col-span-5 relative">
            <div className="relative p-6 rounded-2xl bg-white dark:bg-gradient-to-b dark:from-gray-900/90 dark:to-gray-950/95 border border-gray-200 dark:border-gray-800 shadow-2xl transition-colors">
              {/* Telemetry Header Bar */}
              <div className="flex justify-between items-center pb-4 mb-4 border-b border-gray-200 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-xs font-mono font-bold text-gray-800 dark:text-gray-300">2025 F1 CAR SPECIFICATIONS</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-100 dark:bg-red-600/20 text-red-600 dark:text-red-400 font-bold border border-red-200 dark:border-red-600/30">
                  GROUND EFFECT ERA
                </span>
              </div>

              {/* Holographic Regulation Specs */}
              <div className="space-y-3.5 text-xs font-mono">
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800/80 flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Powertrain:</span>
                  <span className="font-bold text-gray-900 dark:text-white">1.6L V6 Turbo Hybrid (MGU-K + MGU-H)</span>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800/80 flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Aerodynamics:</span>
                  <span className="font-bold text-[#00D2BE]">Venturi Underfloor Ground Effect & DRS</span>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800/80 flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">Min. Car Weight:</span>
                  <span className="font-bold text-green-600 dark:text-green-400">798 kg (with driver)</span>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800/80 flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">2025 World Champion:</span>
                  <span className="font-bold text-[#FF8000]">Lando Norris (423 PTS)</span>
                </div>
                <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800/80 flex justify-between items-center">
                  <span className="text-gray-500 dark:text-gray-400">2025 Constructors Champion:</span>
                  <span className="font-bold text-[#FF8000]">McLaren-Mercedes (800+ PTS)</span>
                </div>
              </div>

              {/* Quick Launch Active Grand Prix */}
              <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-gray-500 uppercase block">Selected Session</span>
                  <span className="text-xs font-bold text-gray-900 dark:text-white">{selectedRace.name}</span>
                </div>
                <button
                  onClick={() => handleLaunchRace(selectedRace.key)}
                  className="px-3.5 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg transition-all shadow-md flex items-center gap-1.5"
                >
                  <span>Simulate Race</span>
                  <span>▶</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2025 Teams & Drivers Grid */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-14 border-t border-gray-200 dark:border-gray-800/80">
        <div className="mb-8 flex flex-wrap justify-between items-end gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-red-600 dark:text-red-500 uppercase tracking-widest block mb-1">
              2025 Grid
            </span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">Constructors & Drivers</h2>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">10 Teams | 20 Drivers</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {TEAMS_2025.map(team => (
            <div
              key={team.name}
              className="p-4 rounded-xl bg-white dark:bg-gray-900/60 border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:scale-[1.02] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-2.5 h-6 rounded-sm" style={{ backgroundColor: team.colour }} />
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 font-bold">
                    {team.badge}
                  </span>
                </div>
                <h3 className="font-black text-sm text-gray-900 dark:text-white mb-0.5">{team.name}</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-3">{team.engine}</p>
              </div>
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800/60 text-[11px] font-mono text-gray-700 dark:text-gray-300 space-y-1">
                {team.drivers.map(d => (
                  <div key={d} className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: team.colour }} />
                    <span>{d}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2025 Race Calendar (24 Rounds) */}
      <section id="calendar-section" className="relative z-10 max-w-7xl mx-auto px-6 py-14 border-t border-gray-200 dark:border-gray-800/80">
        <div className="mb-8 flex flex-wrap justify-between items-end gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-red-600 dark:text-red-500 uppercase tracking-widest block mb-1">
              Official Schedule & Winners
            </span>
            <h2 className="text-3xl font-black text-gray-900 dark:text-white">2025 FIA Formula 1 Race Calendar</h2>
          </div>
          <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">24 Rounds Worldwide | 6 Sprints</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {RACES_2025.map(race => {
            const isSelected = selectedRace.key === race.key;
            return (
              <div
                key={race.key}
                onClick={() => setSelectedRace(race)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-red-50 dark:bg-red-950/30 border-red-500 shadow-md shadow-red-500/10 scale-[1.02]'
                    : 'bg-white dark:bg-gray-900/60 border-gray-200 dark:border-gray-800/90 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/80'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">{race.flag}</span>
                    <div className="flex items-center gap-1.5">
                      {race.isSprint && (
                        <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-500 dark:text-amber-400 font-black border border-amber-500/30">
                          ⚡ SPRINT
                        </span>
                      )}
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold">
                        R{race.round}
                      </span>
                    </div>
                  </div>
                  <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-0.5">{race.name}</h3>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mb-1">{race.circuit}</p>
                  <p className="text-[10px] text-red-600 dark:text-red-400 font-mono font-semibold mb-2">{race.date}</p>

                  {/* Official Winner Badge */}
                  <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-950/80 border border-gray-200 dark:border-gray-800/80 flex items-center justify-between text-[11px] font-mono">
                    <span className="text-gray-500 dark:text-gray-400 text-[10px]">Winner:</span>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: race.teamColour }} />
                      <span className="font-bold text-gray-900 dark:text-white">
                        {race.winner} <span className="text-gray-500 text-[10px]">#{race.winnerNum}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-gray-100 dark:border-gray-800/60 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-gray-500">{race.laps} Laps</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLaunchRace(race.key);
                    }}
                    className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] rounded transition-colors shadow-sm"
                  >
                    Simulate ▶
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 dark:border-gray-800/80 py-10 bg-white dark:bg-[#04060A] text-center text-xs text-gray-500 font-mono transition-colors">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-gray-900 dark:text-white tracking-wider">
              <span className="text-[#E10600]">PACE</span>TRACER
            </span>
            <span>&copy; 2025 FIA Formula 1 World Championship Telemetry</span>
          </div>
          <span>Engineered with React 18, Canvas 2D Vector Radar & Node.js WebSockets</span>
        </div>
      </footer>
    </div>
  );
}
