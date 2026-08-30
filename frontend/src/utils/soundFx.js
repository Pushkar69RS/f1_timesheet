// frontend/src/utils/soundFx.js
// Native Web Audio API & Speech Synthesis for F1 Sounds and Spoken Radio Audio

class SoundFXEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.volume = 0.35;

    // Load user mute preference from localStorage
    try {
      const saved = localStorage.getItem('pacetracer_muted');
      if (saved !== null) {
        this.isMuted = JSON.parse(saved);
      }
    } catch {
      this.isMuted = false;
    }
  }

  _initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (muted && typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    try {
      localStorage.setItem('pacetracer_muted', JSON.stringify(muted));
    } catch {
      // ignore
    }
  }

  toggleMute() {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // 1. Team Radio Chirp / Beep
  playRadioChirp() {
    if (this.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1750, t);
    osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);

    gain.gain.setValueAtTime(this.volume * 0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.13);
  }

  // 2. Spoken Team Radio Voice with Radio Chirps
  speakRadioVoice(text, options = {}) {
    if (this.isMuted) return;
    this.playRadioChirp();

    if (typeof window === 'undefined' || !window.speechSynthesis) {
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    const cleanText = text.replace(/["']/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);

    utterance.pitch = options.pitch !== undefined ? options.pitch : 1.05;
    utterance.rate = options.rate !== undefined ? options.rate : 1.05;

    // Pick best English voice if available
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      if (options.lang === 'en-GB') {
        const gbVoice = voices.find(v => v.lang.includes('en-GB') || v.name.includes('UK') || v.name.includes('British'));
        if (gbVoice) utterance.voice = gbVoice;
      } else {
        const enVoice = voices.find(v => v.lang.startsWith('en'));
        if (enVoice) utterance.voice = enVoice;
      }
    }

    utterance.onend = () => {
      this.playRadioChirp();
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = () => {
      if (options.onEnd) options.onEnd();
    };

    // Small delay so opening chirp is heard clearly first
    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 140);
  }

  // 3. Five Red Lights - Light On Step Beep
  playLightOnBeep() {
    if (this.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(440, t);

    gain.gain.setValueAtTime(this.volume * 0.3, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.16);
  }

  // 4. Lights Out - Green Launch Beep
  playLightsOutBeep() {
    if (this.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(880, t);
    osc.frequency.exponentialRampToValueAtTime(1760, t + 0.25);

    gain.gain.setValueAtTime(this.volume * 0.5, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.31);
  }

  // 5. Overtake Broadcast Alert Chime
  playOvertakeChime() {
    if (this.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const notes = [587.33, 880, 1174.66]; // D5, A5, D6 arpeggio

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const noteTime = t + (i * 0.06);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(this.volume * 0.3, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.001, noteTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.26);
    });
  }

  // 6. Pit Limiter Pulsing Beep
  playPitLimiter() {
    if (this.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = t + (i * 0.12);

      osc.type = 'square';
      osc.frequency.setValueAtTime(1200, startTime);

      gain.gain.setValueAtTime(this.volume * 0.25, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.07);
    }
  }

  // 7. Chequered Flag Victory Fanfare
  playVictoryFanfare() {
    if (this.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const chords = [
      { notes: [523.25, 659.25, 783.99], time: 0, dur: 0.18 },
      { notes: [587.33, 739.99, 880.00], time: 0.2, dur: 0.18 },
      { notes: [659.25, 830.61, 987.77], time: 0.4, dur: 0.18 },
      { notes: [783.99, 987.77, 1174.66, 1567.98], time: 0.65, dur: 0.6 }
    ];

    chords.forEach(chord => {
      chord.notes.forEach(note => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = t + chord.time;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(note, noteStart);

        gain.gain.setValueAtTime(this.volume * 0.2, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + chord.dur);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + chord.dur + 0.05);
      });
    });
  }

  // 8. Safety Car Strobe Siren Chime
  playSafetyCarSiren() {
    if (this.isMuted) return;
    this._initContext();
    if (!this.ctx) return;

    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.linearRampToValueAtTime(900, t + 0.2);
    osc.frequency.linearRampToValueAtTime(600, t + 0.4);

    gain.gain.setValueAtTime(this.volume * 0.25, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(t);
    osc.stop(t + 0.46);
  }
}

export const soundFX = new SoundFXEngine();
