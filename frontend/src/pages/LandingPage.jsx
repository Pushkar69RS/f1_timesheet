import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const races2025 = [
    { round: 1, date: 'March 16', name: 'Australian Grand Prix', location: 'Melbourne', circuit: 'Albert Park Circuit', flag: '🇦🇺' },
    { round: 2, date: 'March 23', name: 'Chinese Grand Prix', location: 'Shanghai', circuit: 'Shanghai International Circuit', flag: '🇨🇳' },
    { round: 3, date: 'April 6', name: 'Japanese Grand Prix', location: 'Suzuka', circuit: 'Suzuka Circuit', flag: '🇯🇵' },
    { round: 4, date: 'April 13', name: 'Bahrain Grand Prix', location: 'Sakhir', circuit: 'Bahrain International Circuit', flag: '🇧🇭' },
    { round: 5, date: 'April 20', name: 'Saudi Arabian Grand Prix', location: 'Jeddah', circuit: 'Jeddah Corniche Circuit', flag: '🇸🇦' },
    { round: 6, date: 'May 4', name: 'Miami Grand Prix', location: 'Miami', circuit: 'Miami International Autodrome', flag: '🇺🇸' },
    { round: 7, date: 'May 18', name: 'Emilia Romagna Grand Prix', location: 'Imola', circuit: 'Autodromo Enzo e Dino Ferrari', flag: '🇮🇹' },
    { round: 8, date: 'May 25', name: 'Monaco Grand Prix', location: 'Monaco', circuit: 'Circuit de Monaco', flag: '🇲🇨' },
    { round: 9, date: 'June 1', name: 'Spanish Grand Prix', location: 'Barcelona', circuit: 'Circuit de Barcelona-Catalunya', flag: '🇪🇸' },
    { round: 10, date: 'June 15', name: 'Canadian Grand Prix', location: 'Montreal', circuit: 'Circuit Gilles Villeneuve', flag: '🇨🇦' },
    { round: 11, date: 'June 29', name: 'Austrian Grand Prix', location: 'Spielberg', circuit: 'Red Bull Ring', flag: '🇦🇹' },
    { round: 12, date: 'July 6', name: 'British Grand Prix', location: 'Silverstone', circuit: 'Silverstone Circuit', flag: '🇬🇧' },
    { round: 13, date: 'July 27', name: 'Belgian Grand Prix', location: 'Spa-Francorchamps', circuit: 'Circuit de Spa-Francorchamps', flag: '🇧🇪' },
    { round: 14, date: 'August 3', name: 'Hungarian Grand Prix', location: 'Budapest', circuit: 'Hungaroring', flag: '🇭🇺' },
    { round: 15, date: 'August 31', name: 'Dutch Grand Prix', location: 'Zandvoort', circuit: 'Circuit Zandvoort', flag: '🇳🇱' },
    { round: 16, date: 'September 7', name: 'Italian Grand Prix', location: 'Monza', circuit: 'Autodromo Nazionale di Monza', flag: '🇮🇹' },
    { round: 17, date: 'September 21', name: 'Azerbaijan Grand Prix', location: 'Baku', circuit: 'Baku City Circuit', flag: '🇦🇿' },
    { round: 18, date: 'October 5', name: 'Singapore Grand Prix', location: 'Singapore', circuit: 'Marina Bay Street Circuit', flag: '🇸🇬' },
    { round: 19, date: 'October 19', name: 'United States Grand Prix', location: 'Austin', circuit: 'Circuit of the Americas', flag: '🇺🇸' },
    { round: 20, date: 'October 26', name: 'Mexico City Grand Prix', location: 'Mexico City', circuit: 'Autódromo Hermanos Rodríguez', flag: '🇲🇽' },
    { round: 21, date: 'November 9', name: 'São Paulo Grand Prix', location: 'São Paulo', circuit: 'Autódromo José Carlos Pace', flag: '🇧🇷' },
    { round: 22, date: 'November 22', name: 'Las Vegas Grand Prix', location: 'Las Vegas', circuit: 'Las Vegas Street Circuit', flag: '🇺🇸' },
    { round: 23, date: 'November 30', name: 'Qatar Grand Prix', location: 'Lusail', circuit: 'Lusail International Circuit', flag: '🇶🇦' },
    { round: 24, date: 'December 7', name: 'Abu Dhabi Grand Prix', location: 'Yas Island', circuit: 'Yas Marina Circuit', flag: '🇦🇪' },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="fixed top-0 left-0 right-0 z-50 bg-black bg-opacity-95 backdrop-blur-sm border-b border-gray-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img src="/assets/f1-logo.webp" alt="F1 Logo" className="h-10 w-auto" />
            <h1 className="text-2xl font-bold tracking-wider">
              <span className="text-[#E10600]">PACE</span>TRACER
            </h1>
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2 bg-[#E10600] hover:bg-[#B00500] text-white font-bold rounded transition-all duration-300 transform hover:scale-105"
          >
            LAUNCH DASHBOARD
          </button>
        </div>
      </header>

      <section className="relative h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-[#E10600] opacity-90"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,.03) 2px, rgba(255,255,255,.03) 4px)',
          backgroundSize: '100% 4px'
        }}></div>

        <div className="relative z-10 text-center px-6 max-w-6xl">
          <div className="mb-8 flex justify-center">
            <img
              src="/assets/car.png"
              alt="F1 Car"
              className="w-64 md:w-96 h-auto animate-pulse"
              style={{ filter: 'drop-shadow(0 0 30px rgba(225, 6, 0, 0.5))' }}
            />
          </div>
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter">
            <span className="text-[#E10600]">PACE</span>TRACER
          </h1>
          <p className="text-2xl md:text-4xl font-light mb-4 text-gray-300">
            Real-Time F1 Race Analysis
          </p>
          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
            Relive every moment with historical race data replay. Experience Formula 1 timing like never before.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-12 py-4 bg-[#E10600] hover:bg-[#B00500] text-white text-xl font-bold rounded-lg transition-all duration-300 transform hover:scale-105 shadow-2xl"
          >
            ENTER TIMING DASHBOARD
          </button>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-black to-gray-900">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            THE ULTIMATE <span className="text-[#E10600]">PRIZE</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 text-lg">Championship Glory</p>

          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-2xl">
              <div className="flex justify-center mb-6">
                <svg className="w-24 h-24 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  <path d="M12 6L10 10H8L11 13L10 16H14L13 13L16 10H14L12 6Z" fill="#FFD700"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#E10600]">World Drivers' Championship</h3>
              <p className="text-gray-400 leading-relaxed">
                The most coveted individual trophy in motorsport. Awarded annually to the driver who accumulates the most championship points throughout the season. A testament to skill, consistency, and determination.
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg p-8 text-center transform hover:scale-105 transition-all duration-300 shadow-2xl">
              <div className="flex justify-center mb-6">
                <svg className="w-24 h-24 text-silver-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 3H18V5H20C21.11 5 22 5.89 22 7V11C22 12.11 21.11 13 20 13H19.82C19.4 14.92 17.84 16.39 15.97 16.77L17 21H7L8.03 16.77C6.16 16.39 4.6 14.92 4.18 13H4C2.89 13 2 12.11 2 11V7C2 5.89 2.89 5 4 5H6V3M8 5H16V9.68C16 11.5 14.5 13 12.68 13H11.32C9.5 13 8 11.5 8 9.68V5M4 7V11H6V7H4M18 7V11H20V7H18Z" fill="#C0C0C0"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold mb-4 text-[#E10600]">World Constructors' Championship</h3>
              <p className="text-gray-400 leading-relaxed">
                The pinnacle of team achievement in Formula 1. Awarded to the constructor who scores the most combined points from both drivers. A measure of engineering excellence and teamwork.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-black">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            2025 FIA FORMULA ONE <span className="text-[#E10600]">WORLD CHAMPIONSHIP</span>
          </h2>
          <p className="text-center text-gray-400 mb-16 text-lg">24 races across 5 continents</p>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
            {races2025.map((race) => (
              <div
                key={race.round}
                className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-lg p-6 hover:border-[#E10600] transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="text-[#E10600] font-bold text-sm mb-1">ROUND {race.round}</div>
                    <div className="text-gray-400 text-sm">{race.date}</div>
                  </div>
                  <div className="text-4xl">{race.flag}</div>
                </div>
                <h3 className="text-xl font-bold mb-2">{race.name}</h3>
                <p className="text-gray-400 text-sm mb-1">{race.location}</p>
                <p className="text-gray-500 text-xs">{race.circuit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-t from-black to-gray-900">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ABOUT <span className="text-[#E10600]">PACETRACER</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-12 leading-relaxed">
            PaceTracer is a sophisticated race timing replay system that brings historical F1 races back to life.
            Experience real-time timing data, track positions, sector analysis, and comprehensive race statistics
            powered by the OpenF1 API. Relive legendary races with professional-grade timing technology.
          </p>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="text-4xl mb-3">⏱️</div>
              <h4 className="font-bold mb-2">Live Timing</h4>
              <p className="text-gray-500 text-sm">Real-time lap times and sectors</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🗺️</div>
              <h4 className="font-bold mb-2">Track Map</h4>
              <p className="text-gray-500 text-sm">Visual position tracking</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">📊</div>
              <h4 className="font-bold mb-2">Sector Analysis</h4>
              <p className="text-gray-500 text-sm">Detailed timing breakdowns</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-3">🔄</div>
              <h4 className="font-bold mb-2">Race Replay</h4>
              <p className="text-gray-500 text-sm">Controllable playback speeds</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black border-t border-gray-800 py-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-gray-500 text-sm mb-2">
            Data provided by OpenF1 API
          </p>
          <p className="text-gray-600 text-xs">
            PaceTracer &copy; 2024 | Built for F1 enthusiasts
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
