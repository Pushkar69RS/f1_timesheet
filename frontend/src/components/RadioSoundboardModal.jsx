import { useState, useEffect } from 'react';
import { soundFX } from '../utils/soundFx';

const RADIO_QUOTES = [
  {
    driver: 'Lewis Hamilton #44',
    team: 'Scuderia Ferrari',
    flag: '🇬🇧',
    colour: '#E80020',
    title: 'Hammertime Call',
    quote: 'Lewis, it is Hammertime! Push now, push now!',
    response: 'Understood Bono. Target acquired.',
    pitch: 0.95,
    rate: 1.1,
    lang: 'en-GB'
  },
  {
    driver: 'Max Verstappen #1',
    team: 'Red Bull Racing',
    flag: '🇳🇱',
    colour: '#3671C6',
    title: 'Simply Lovely',
    quote: 'Ha ha yes boys! That was simply lovely! What an unbelievable car!',
    response: 'Clinical drive Max, absolute masterclass.',
    pitch: 1.1,
    rate: 1.15,
    lang: 'en-US'
  },
  {
    driver: 'Lando Norris #4',
    team: 'McLaren',
    flag: '🇬🇧',
    colour: '#FF8000',
    title: 'World Champion Coronation',
    quote: 'World champion! Oh my god! We did it boys! Yes!',
    response: 'Lando Norris, you are the Formula 1 World Champion!',
    pitch: 1.2,
    rate: 1.15,
    lang: 'en-GB'
  },
  {
    driver: 'Carlos Sainz #55',
    team: 'Williams Racing',
    flag: '🇪🇸',
    colour: '#64C4FF',
    title: 'Smooth Operator',
    quote: 'Smooth operator, smooth operator!',
    response: 'P3 Carlos! Incredible podium for the team!',
    pitch: 1.0,
    rate: 0.95,
    lang: 'en-US'
  },
  {
    driver: 'Charles Leclerc #16',
    team: 'Scuderia Ferrari',
    flag: '🇲🇨',
    colour: '#E80020',
    title: 'Monaco Victory Euphoria',
    quote: 'Yes! Yes! Forza Ferrari! Mamma Mia!',
    response: 'You won in Monaco Charles, you won in Monaco!',
    pitch: 1.15,
    rate: 1.2,
    lang: 'en-US'
  },
  {
    driver: 'Fernando Alonso #14',
    team: 'Aston Martin',
    flag: '🇪🇸',
    colour: '#229971',
    title: 'Leave The Space',
    quote: 'All the time you have to leave a space! GP2 engine, GP2!',
    response: 'Copy Fernando, we see the delta.',
    pitch: 0.9,
    rate: 1.1,
    lang: 'en-US'
  },
  {
    driver: 'Kimi Räikkönen (Classic)',
    team: 'Lotus / Ferrari',
    flag: '🇫🇮',
    colour: '#FFB800',
    title: 'Leave Me Alone',
    quote: 'Just leave me alone, I know what to do!',
    response: 'Understood Kimi, standing by.',
    pitch: 0.8,
    rate: 0.9,
    lang: 'en-US'
  },
  {
    driver: 'Oscar Piastri #81',
    team: 'McLaren',
    flag: '🇦🇺',
    colour: '#FF8000',
    title: 'Ice Cool Victory',
    quote: 'Thank you everyone. Good execution today. Car felt great.',
    response: 'Mega drive Oscar, P1 in dominant style.',
    pitch: 1.0,
    rate: 1.0,
    lang: 'en-GB'
  }
];

export default function RadioSoundboardModal({ isOpen, onClose }) {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(null);

  // Stop any ongoing voice when modal is closed
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  if (!isOpen) return null;

  const playRadioQuote = (index) => {
    setActiveQuoteIndex(index);
    const item = RADIO_QUOTES[index];

    soundFX.speakRadioVoice(item.quote, {
      pitch: item.pitch,
      rate: item.rate,
      lang: item.lang,
      onEnd: () => {
        setActiveQuoteIndex(null);
      }
    });
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
                F1 Team Radio Comms Deck & Voice Soundboard
              </h3>
              <p className="text-[10px] text-gray-400 font-sans">
                Click any channel to transmit live spoken team radio audio over the comms!
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.speechSynthesis) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
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
                    ? 'bg-red-950/40 border-red-500 shadow-xl shadow-red-500/25 scale-[1.02]'
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

                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-black text-amber-400">{item.title}</h4>
                    {isPlaying && (
                      <div className="flex items-center gap-1">
                        <span className="w-1 h-3 bg-green-400 animate-pulse rounded-full" />
                        <span className="w-1 h-4 bg-green-400 animate-pulse delay-75 rounded-full" />
                        <span className="w-1 h-2 bg-green-400 animate-pulse delay-150 rounded-full" />
                        <span className="text-[9px] text-green-400 font-bold ml-1">TRANSMITTING</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs italic text-gray-100 font-sans mb-2 leading-relaxed">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-gray-400 font-sans truncate max-w-[170px]">{item.response}</span>
                  <button
                    className={`px-2.5 py-1 rounded font-bold border flex items-center gap-1.5 transition-colors ${
                      isPlaying
                        ? 'bg-green-600/20 text-green-400 border-green-500/40 animate-pulse'
                        : 'bg-red-600/20 text-red-400 border-red-500/30 hover:bg-red-600/30'
                    }`}
                  >
                    <span>{isPlaying ? '🔊 ON AIR' : '▶ TRANSMIT'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 px-6 bg-gray-950 border-t border-gray-800 flex justify-between items-center text-xs text-gray-400 shrink-0">
          <span className="text-[11px] font-sans">
            🔊 Powered by Speech Synthesis & Web Audio radio walkie-talkie filters
          </span>
          <button
            onClick={() => soundFX.playRadioChirp()}
            className="px-3 py-1 bg-gray-800 hover:bg-gray-700 text-white rounded font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <span>*BEEP* Test Radio Tone</span>
          </button>
        </div>
      </div>
    </div>
  );
}
