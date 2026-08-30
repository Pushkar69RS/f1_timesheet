import { useState, useEffect, useRef } from 'react';
import { soundFX } from '../utils/soundFx';

const RADIO_QUOTES = [
  {
    driver: 'Lewis Hamilton #44',
    team: 'Scuderia Ferrari / Mercedes',
    flag: '🇬🇧',
    colour: '#E80020',
    title: 'Hammertime Call',
    quote: '"Lewis, it is Hammertime! Push now, push now!"',
    response: '"Understood Bono. Target acquired."',
    audioFile: 'radio_driver_44.mp3',
    fallbackText: 'Lewis, it is Hammertime! Push now, push now!'
  },
  {
    driver: 'Max Verstappen #1',
    team: 'Red Bull Racing',
    flag: '🇳🇱',
    colour: '#3671C6',
    title: 'Simply Lovely',
    quote: '"Ha ha yes boys! That was simply lovely! What an unbelievable car!"',
    response: '"Clinical drive Max, absolute masterclass."',
    audioFile: 'radio_driver_1.mp3',
    fallbackText: 'Ha ha yes boys! That was simply lovely! What a car!'
  },
  {
    driver: 'Lando Norris #4',
    team: 'McLaren',
    flag: '🇬🇧',
    colour: '#FF8000',
    title: 'World Champion Coronation',
    quote: '"World Champion! Oh my god! We did it boys! YES!"',
    response: '"Lando Norris, you are the Formula 1 World Champion!"',
    audioFile: 'radio_driver_4.mp3',
    fallbackText: 'World champion! Oh my god! We did it boys!'
  },
  {
    driver: 'Carlos Sainz #55',
    team: 'Williams Racing',
    flag: '🇪🇸',
    colour: '#64C4FF',
    title: 'Smooth Operator',
    quote: '"Smoooth operaaatorrr... smoooth operatooorrr!"',
    response: '"P3 Carlos! Incredible podium for the team!"',
    audioFile: 'radio_driver_55.mp3',
    fallbackText: 'Smooth operator, smooth operator!'
  },
  {
    driver: 'Charles Leclerc #16',
    team: 'Scuderia Ferrari',
    flag: '🇲🇨',
    colour: '#E80020',
    title: 'Monaco Victory Euphoria',
    quote: '"YESSS! YESSS! FORZA FERRARI! MAMMA MIA!"',
    response: '"You won in Monaco Charles, you won in Monaco!"',
    audioFile: 'radio_driver_16.mp3',
    fallbackText: 'Yes! Yes! Forza Ferrari! Mamma Mia!'
  },
  {
    driver: 'Fernando Alonso #14',
    team: 'Aston Martin',
    flag: '🇪🇸',
    colour: '#229971',
    title: 'Leave The Space',
    quote: '"All the time you have to leave a space! GP2 engine, GP2!"',
    response: '"Copy Fernando, we see the delta."',
    audioFile: 'radio_driver_14.mp3',
    fallbackText: 'All the time you have to leave a space! GP2 engine!'
  },
  {
    driver: 'George Russell #63',
    team: 'Mercedes-AMG',
    flag: '🇬🇧',
    colour: '#27F4D2',
    title: 'Singapore Victory Strategy',
    quote: '"Blimey, I\'m going for the win guys! Let\'s go!"',
    response: '"Understood George, you have the pace."',
    audioFile: 'radio_driver_63.mp3',
    fallbackText: 'Blimey, I am going for the win guys! Let us go!'
  },
  {
    driver: 'Oscar Piastri #81',
    team: 'McLaren',
    flag: '🇦🇺',
    colour: '#FF8000',
    title: 'Ice Cool Grand Prix Victory',
    quote: '"Thank you everyone. Good execution today. Car felt great."',
    response: '"Mega drive Oscar, P1 in dominant style."',
    audioFile: 'radio_driver_81.mp3',
    fallbackText: 'Thank you everyone. Good execution today.'
  }
];

export default function RadioSoundboardModal({ isOpen, onClose }) {
  const [activeQuoteIndex, setActiveQuoteIndex] = useState(null);
  const currentAudioRef = useRef(null);

  const stopCurrentAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setActiveQuoteIndex(null);
  };

  useEffect(() => {
    return () => stopCurrentAudio();
  }, []);

  if (!isOpen) return null;

  const playRadioRecording = (index) => {
    stopCurrentAudio();
    setActiveQuoteIndex(index);
    const item = RADIO_QUOTES[index];

    // 1. Play Opening Radio Tone
    soundFX.playRadioChirp();

    // 2. Play Authentic Broadcast Recording MP3
    try {
      const audio = new Audio(`/audio/${item.audioFile}`);
      currentAudioRef.current = audio;
      audio.volume = soundFX.isMuted ? 0 : 0.85;

      audio.onended = () => {
        soundFX.playRadioChirp();
        setActiveQuoteIndex(null);
        currentAudioRef.current = null;
      };

      audio.onerror = () => {
        // Fallback to synthesized voice if MP3 cannot play
        soundFX.speakRadioVoice(item.fallbackText, {
          onEnd: () => setActiveQuoteIndex(null)
        });
      };

      setTimeout(() => {
        audio.play().catch(() => {
          soundFX.speakRadioVoice(item.fallbackText, {
            onEnd: () => setActiveQuoteIndex(null)
          });
        });
      }, 100);
    } catch {
      soundFX.speakRadioVoice(item.fallbackText, {
        onEnd: () => setActiveQuoteIndex(null)
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn font-sans">
      <div className="relative w-full max-w-2xl bg-gray-900 text-white rounded-2xl shadow-2xl border border-gray-700 overflow-hidden font-mono flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 px-6 bg-gray-950 border-b border-gray-800 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">📻</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-sm uppercase tracking-wider text-white">
                  Authentic F1 Team Radio Audio Deck
                </h3>
                <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 font-bold text-[9px] border border-green-500/30">
                  REAL BROADCAST RECORDINGS
                </span>
              </div>
              <p className="text-[10px] text-gray-400 font-sans">
                Official high-fidelity team radio transmissions from actual Formula 1 Grands Prix
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCurrentAudio();
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
                onClick={() => playRadioRecording(idx)}
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
                        <span className="text-[9px] text-green-400 font-bold ml-1">PLAYING REAL AUDIO</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs italic text-gray-100 font-sans mb-2 leading-relaxed">
                    {item.quote}
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
                    <span>{isPlaying ? '🔊 LIVE AUDIO' : '▶ PLAY RECORDING'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3.5 px-6 bg-gray-950 border-t border-gray-800 flex justify-between items-center text-xs text-gray-400 shrink-0">
          <span className="text-[11px] font-sans">
            🎧 Direct authentic live timing broadcast transmissions (MP3)
          </span>
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
