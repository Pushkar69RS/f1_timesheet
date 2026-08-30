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
        showNotice('🏎️ "LEWIS, IT\'S HAMMERTIME!" — PURPLE SECTOR OVERBOOST');
      }

      // 3. Shift + S -> "SMOOTH OPERATOR"
      if (e.shiftKey && (e.code === 'KeyS' || e.key === 'S' || e.key === 's')) {
        soundFX.playOvertakeChime();
        showNotice('📻 "SMOOOTH OPERAAATORRR..." — CARLOS SAINZ CRUISE MODE');
      }

      // 4. Shift + V -> "SIMPLY LOVELY"
      if (e.shiftKey && (e.code === 'KeyV' || e.key === 'V' || e.key === 'v')) {
        soundFX.playVictoryFanfare();
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
