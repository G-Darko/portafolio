let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export function ensureAudioContext(): Promise<AudioContext> {
  const ctx = getCtx();
  if (ctx.state === "suspended") {
    return ctx.resume().then(() => ctx);
  }
  return Promise.resolve(ctx);
}

function playOscillator(
  freq: number,
  type: OscillatorType,
  duration: number,
  gainVal = 0.08
) {
  const ctx = getCtx();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  gain.gain.setValueAtTime(gainVal, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + duration);
}

export function playBootupChime() {
  ensureAudioContext().then(() => {
    playOscillator(523.25, "sine", 0.3, 0.1);
    playOscillator(659.25, "sine", 0.3, 0.1);
    playOscillator(783.99, "sine", 0.6, 0.1);
  });
}

export function playHUDClick() {
  ensureAudioContext().then(() => {
    playOscillator(1100, "sine", 0.08, 0.05);
  });
}

export function playWindowOpen() {
  ensureAudioContext().then(() => {
    playOscillator(600, "triangle", 0.15, 0.06);
    playOscillator(800, "triangle", 0.2, 0.04);
  });
}

export function playSecretUnlocked() {
  ensureAudioContext().then(() => {
    const ctx = getCtx();
    [523, 659, 784, 1047].forEach((f, i) => {
      setTimeout(() => playOscillator(f, "square", 0.15, 0.06), i * 80);
    });
    setTimeout(() => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.4);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    }, 350);
  });
}

export function playQTESuccess() {
  ensureAudioContext().then(() => {
    playOscillator(880, "square", 0.1, 0.08);
    setTimeout(() => playOscillator(1320, "square", 0.3, 0.08), 60);
  });
}

export function playQTEMiss() {
  ensureAudioContext().then(() => {
    playOscillator(200, "sawtooth", 0.3, 0.06);
  });
}

export function playGlitchEffect() {
  ensureAudioContext().then(() => {
    const ctx = getCtx();
    const bufferSize = ctx.sampleRate * 0.3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 0.5 - 0.25;
    }
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    const gain = ctx.createGain();
    gain.gain.value = 0.06;
    source.connect(gain);
    gain.connect(ctx.destination);
    source.start();
  });
}

export function playKonamiJingle() {
  ensureAudioContext().then(() => {
    [262, 294, 330, 349, 392, 440, 494, 523].forEach((f, i) => {
      setTimeout(() => playOscillator(f, "square", 0.12, 0.06), i * 70);
    });
  });
}
