import { useState, useEffect, useRef } from 'react';
import { soundFX } from '../utils/soundFx';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

export function useF1EasterEggs({ onOpenReactionGame, onOpenRadioSoundboard }) {
  const [safetyCarActive, setSafetyCarActive] = useState(false);
  const [easterEggMessage, setEasterEggMessage] = useState(null);
  const keySequenceRef = useRef([]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // 1. Konami Code Tracker
      const expectedKey = KONAMI_CODE[keySequenceRef.current.length];
      if (e.code === expectedKey) {
        keySequenceRef.current.push(e.code);
        if (keySequenceRef.current.length === KONAMI_CODE.length) {
          // KONAMI CODE TRIGGERED: SAFETY CAR DEPLOYED!
          keySequenceRef.current = [];
          setSafetyCarActive(prev => {
            const next = !prev;
            soundFX.playSafetyCarSiren();
            soundFX.speakRadioVoice(next ? 'Safety car deployed! Reduce pace immediately!' : 'Safety car in this lap, track clear!');
            showNotice(next ? '🚨 SAFETY CAR DEPLOYED (MAYLANDER VANTAGE ON TRACK) 🚨' : '🟢 SAFETY CAR IN THIS LAP - TRACK CLEAR');
            return next;
          });
        }
      } else {
        keySequenceRef.current = [];
        if (e.code === 'ArrowUp') {
          keySequenceRef.current.push('ArrowUp');
        }
      }

      // 2. Shift + H -> "HAMMERTIME"
      if (e.shiftKey && (e.code === 'KeyH' || e.key === 'H' || e.key === 'h')) {
        soundFX.playRadioChirp();
        try {
          const audio = new Audio('/audio/radio_driver_44.mp3');
          audio.volume = soundFX.isMuted ? 0 : 0.85;
          audio.play().catch(() => {
            soundFX.speakRadioVoice('Lewis, it is Hammertime! Push now, push now!');
          });
        } catch {
          soundFX.speakRadioVoice('Lewis, it is Hammertime! Push now, push now!');
        }
        showNotice('🏎️ "LEWIS, IT\'S HAMMERTIME!" — PURPLE SECTOR OVERBOOST');
      }

      // 3. Shift + S -> "SMOOTH OPERATOR"
      if (e.shiftKey && (e.code === 'KeyS' || e.key === 'S' || e.key === 's')) {
        soundFX.playRadioChirp();
        try {
          const audio = new Audio('/audio/radio_driver_55.mp3');
          audio.volume = soundFX.isMuted ? 0 : 0.85;
          audio.play().catch(() => {
            soundFX.speakRadioVoice('Smooth operator, smooth operator!');
          });
        } catch {
          soundFX.speakRadioVoice('Smooth operator, smooth operator!');
        }
        showNotice('📻 "SMOOOTH OPERAAATORRR..." — CARLOS SAINZ CRUISE MODE');
      }

      // 4. Shift + V -> "SIMPLY LOVELY"
      if (e.shiftKey && (e.code === 'KeyV' || e.key === 'V' || e.key === 'v')) {
        soundFX.playRadioChirp();
        try {
          const audio = new Audio('/audio/radio_driver_1.mp3');
          audio.volume = soundFX.isMuted ? 0 : 0.85;
          audio.play().catch(() => {
            soundFX.speakRadioVoice('Ha ha yes boys! That was simply lovely!');
          });
        } catch {
          soundFX.speakRadioVoice('Ha ha yes boys! That was simply lovely!');
        }
        showNotice('🏆 "SIMPLY LOVELY! HA HA YES BOYS!" — VERSTAPPEN CELEBRATION');
      }

      // 5. Shift + L -> Launch Reaction Game
      if (e.shiftKey && (e.code === 'KeyL' || e.key === 'L' || e.key === 'l')) {
        if (onOpenReactionGame) onOpenReactionGame();
      }

      // 6. Shift + R -> Open Radio Soundboard
      if (e.shiftKey && (e.code === 'KeyR' || e.key === 'R' || e.key === 'r') && !e.ctrlKey) {
        if (onOpenRadioSoundboard) onOpenRadioSoundboard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onOpenReactionGame, onOpenRadioSoundboard]);

  const showNotice = (msg) => {
    setEasterEggMessage(msg);
    setTimeout(() => {
      setEasterEggMessage(null);
    }, 4500);
  };

  return {
    safetyCarActive,
    setSafetyCarActive,
    easterEggMessage,
    dismissEasterEgg: () => setEasterEggMessage(null)
  };
}
