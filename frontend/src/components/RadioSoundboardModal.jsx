import { useState } from 'react';
import { soundFX } from '../utils/soundFx';

const RADIO_QUOTES = [
  {
    driver: 'Lewis Hamilton #44',
    team: 'Ferrari',
    flag: '🇬🇧',
    colour: '#E80020',
    title: 'Hammertime Call',
    quote: '"Lewis, it\'s Hammertime! Push now, push now!"',
    response: '"Understood Bono. Target acquired."'
  },
  {
    driver: 'Max Verstappen #1',
    team: 'Red Bull Racing',
    flag: '🇳🇱',
    colour: '#3671C6',
    title: 'Simply Lovely',
    quote: '"Ha ha yes boys! That was simply lovely! What an unbelievable car!"',
    response: '"Clinical drive Max, absolute masterclass."'
  },
  {
    driver: 'Lando Norris #4',
    team: 'McLaren',
    flag: '🇬🇧',
    colour: '#FF8000',
    title: 'World Champion Coronation',
    quote: '"WORLD CHAMPION! OH MY GOD! WE DID IT BOYS! YESSS!"',
    response: '"Lando Norris, you are the Formula 1 World Champion!"'
  },
  {
    driver: 'Carlos Sainz #55',
    team: 'Williams',
    flag: '🇪🇸',
    colour: '#64C4FF',
    title: 'Smooth Operator',
    quote: '"Smoooth operaaatorrr... smoooth operatooorrr!"',
    response: '"P3 Carlos! Incredible podium for the team!"'
  },
  {
    driver: 'Charles Leclerc #16',
    team: 'Ferrari',
    flag: '🇲🇨',
    colour: '#E80020',
    title: 'Monaco Victory Euphoria',
    quote: '"YESSS! YESSS! FORZA FERRARI! MAMMA MIA!"',
    response: '"You won in Monaco Charles, you won in Monaco!"'
  },
  {
    driver: 'Fernando Alonso #14',
    team: 'Aston Martin',
    flag: '🇪🇸',
    colour: '#229971',
    title: 'Leave The Space',
    quote: '"All the time you have to leave a space! GP2 engine, GP2! Arrgh!"',
    response: '"Copy Fernando, we see the delta."'
  },
  {
    driver: 'Kimi Räikkönen (Classic)',
    team: 'Lotus / Ferrari',
    flag: '🇫🇮',
    colour: '#FFB800',
    title: 'Leave Me Alone',
    quote: '"Just leave me alone, I know what to do!"',
    response: '"Understood Kimi, standing by."'
  },
  {
    driver: 'Oscar Piastri #81',
    team: 'McLaren',
    flag: '🇦🇺',
    colour: '#FF8000',
    title: 'Ice Cool Victory',
    quote: '"Thank you everyone. Good execution today. Car felt great."',
    response: '"Mega drive Oscar, P1 in dominant style."'
  }
];

export default function RadioSoundboardModal({ isOpen, onClose }) {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(null);

  if (!isOpen) return null;

  const playRadioQuote = (index) => {
    setActiveQuoteIndex(index);
    soundFX.playRadioChirp();

    setTimeout(() => {
      soundFX.playRadioChirp();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-2xl bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700 overflow-hidden font-mono flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 px-6 bg-gray-950 border-b border-gray-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📻</span>
            <div>
              <h3 className="font-black text-sm uppercase tracking-wider text-white">
                F1 Team Radio Comms Deck & Soundboard
              </h3>
              <p className="text-[10px] text-gray-400 font-sans">Listen to authentic radio chirps and legendary team radio soundbites</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white font-bold text-lg px-2 py-0.5 rounded-lg hover:bg-gray-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Quotes Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {RADIO_QUOTES.map((item, idx) => {
            const isPlaying = activeQuoteIndex === idx;

            return (
              <div
                key={item.title}
                onClick={() => playRadioQuote(idx)}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                  isPlaying
                    ? 'bg-red-950/40 border-red-500 shadow-lg shadow-red-500/20 scale-[1.02]'
                    : 'bg-gray-950/80 border-gray-800 hover:border-gray-700 hover:bg-gray-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{item.flag}</span>
                      <span className="font-black text-xs text-white">{item.driver}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.colour }} />
                      <span className="text-[10px] text-gray-400 font-sans">{item.team}</span>
                    </div>
                  </div>

                  <h4 className="text-xs font-black text-amber-400 mb-1.5">{item.title}</h4>
                  <p className="text-xs italic text-gray-200 font-sans mb-2">{item.quote}</p>
                </div>

                <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-gray-400 font-sans truncate max-w-[170px]">{item.response}</span>
                  <button className="px-2 py-1 rounded bg-red-600/20 text-red-400 font-bold border border-red-500/30 flex items-center gap-1">
                    <span>{isPlaying ? '🔊 PLAYING' : '▶ TRANSMIT'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 px-6 bg-gray-950 border-t border-gray-800 flex justify-between items-center text-xs text-gray-400 shrink-0">
          <span className="text-[11px] font-sans">Synthesized via HTML5 Web Audio API with zero external downloads</span>
          <button
            onClick={() => soundFX.playRadioChirp()}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <span>*BEEP* Test Radio Chirp</span>
          </button>
        </div>
      </div>
    </div>
  );
}
