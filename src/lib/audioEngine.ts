// 8-bit Retro Audio Engine using Web Audio API

let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext => {
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
};

// Resume audio context on user interaction
export const initAudio = async () => {
  const ctx = getAudioContext();
  if (ctx.state === 'suspended') {
    await ctx.resume();
  }
};

// Generate 8-bit square wave tone
const playTone = (
  frequency: number,
  duration: number,
  volume: number = 0.1,
  type: OscillatorType = 'square'
) => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);

  gainNode.gain.setValueAtTime(volume, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + duration);
};

// Footstep sound - quick low pitch blip
export const playFootstep = () => {
  const frequencies = [80, 100, 90, 110];
  const freq = frequencies[Math.floor(Math.random() * frequencies.length)];
  playTone(freq, 0.05, 0.08, 'square');
};

// Stalker growl - menacing low frequency rumble
export const playStalkerGrowl = () => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(60, ctx.currentTime);
  oscillator.frequency.linearRampToValueAtTime(40, ctx.currentTime + 0.3);

  gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.4);
};

// Victory fanfare - ascending triumphant notes
export const playVictoryFanfare = () => {
  const notes = [262, 330, 392, 523, 659, 784];
  notes.forEach((freq, i) => {
    setTimeout(() => {
      playTone(freq, 0.2, 0.12, 'square');
    }, i * 100);
  });
};

// Game over sound - descending sad tones
export const playGameOver = () => {
  const notes = [392, 330, 262, 196];
  notes.forEach((freq, i) => {
    setTimeout(() => {
      playTone(freq, 0.3, 0.1, 'square');
    }, i * 150);
  });
};

// Bomb explosion - noise burst
export const playExplosion = () => {
  const ctx = getAudioContext();
  const bufferSize = ctx.sampleRate * 0.3;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  }

  const noise = ctx.createBufferSource();
  const gainNode = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1000, ctx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.3);

  noise.buffer = buffer;
  gainNode.gain.setValueAtTime(0.3, ctx.currentTime);

  noise.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  noise.start(ctx.currentTime);
};

// Pickup sound - quick ascending blip
export const playPickup = () => {
  playTone(440, 0.05, 0.1);
  setTimeout(() => playTone(660, 0.05, 0.1), 50);
  setTimeout(() => playTone(880, 0.1, 0.1), 100);
};

// Dash sound - whoosh effect
export const playDash = () => {
  const ctx = getAudioContext();
  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.type = 'sawtooth';
  oscillator.frequency.setValueAtTime(200, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.1);

  gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.15);
};

// Freeze sound - crystalline effect
export const playFreeze = () => {
  const notes = [1200, 1400, 1600, 1800];
  notes.forEach((freq, i) => {
    setTimeout(() => {
      playTone(freq, 0.15, 0.08, 'sine');
    }, i * 30);
  });
};

// Trap trigger sound
export const playTrap = () => {
  playTone(150, 0.1, 0.15);
  setTimeout(() => playTone(100, 0.2, 0.1), 100);
};

// Heartbeat effect based on danger level
let heartbeatInterval: number | null = null;

export const startHeartbeat = (dangerLevel: number) => {
  stopHeartbeat();
  
  if (dangerLevel < 0.3) return;

  const interval = Math.max(200, 800 - dangerLevel * 600);
  const volume = Math.min(0.15, dangerLevel * 0.2);

  heartbeatInterval = window.setInterval(() => {
    playTone(60, 0.1, volume, 'sine');
    setTimeout(() => playTone(50, 0.15, volume * 0.7, 'sine'), 100);
  }, interval);
};

export const stopHeartbeat = () => {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
};

// Ambient dungeon drone
let ambientOscillator: OscillatorNode | null = null;
let ambientGain: GainNode | null = null;

export const startAmbient = () => {
  if (ambientOscillator) return;

  const ctx = getAudioContext();
  ambientOscillator = ctx.createOscillator();
  ambientGain = ctx.createGain();
  const filter = ctx.createBiquadFilter();

  ambientOscillator.type = 'sawtooth';
  ambientOscillator.frequency.setValueAtTime(55, ctx.currentTime);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(200, ctx.currentTime);

  ambientGain.gain.setValueAtTime(0.03, ctx.currentTime);

  ambientOscillator.connect(filter);
  filter.connect(ambientGain);
  ambientGain.connect(ctx.destination);

  ambientOscillator.start();

  // Add subtle frequency modulation
  const lfo = ctx.createOscillator();
  const lfoGain = ctx.createGain();
  lfo.frequency.setValueAtTime(0.1, ctx.currentTime);
  lfoGain.gain.setValueAtTime(5, ctx.currentTime);
  lfo.connect(lfoGain);
  lfoGain.connect(ambientOscillator.frequency);
  lfo.start();
};

export const stopAmbient = () => {
  if (ambientOscillator) {
    ambientOscillator.stop();
    ambientOscillator = null;
  }
  if (ambientGain) {
    ambientGain = null;
  }
};

// Menu blip sound
export const playMenuSelect = () => {
  playTone(440, 0.05, 0.1);
};

export const playMenuConfirm = () => {
  playTone(523, 0.05, 0.1);
  setTimeout(() => playTone(659, 0.1, 0.1), 50);
};
