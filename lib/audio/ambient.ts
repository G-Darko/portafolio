/**
 * Ambient background sound for the Exordia world: a very soft spatial
 * drone synthesized live with the Web Audio API. No audio files, no new
 * dependencies — three slow sine voices through a lowpass filter, with a
 * slow LFO so it breathes instead of sitting still.
 *
 * Autoplay policy: browsers block audio until the user interacts with the
 * page, so the drone only starts after the first pointer/key gesture
 * (see `startAmbient`, wired from NyxheimWorld) and stays silent until
 * then. It shares the `soundEnabled` preference with Cuelume: muting in
 * the settings silences the drone too.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let started = false;
let enabled = true;
let hasInteracted = false;
let visibilityWired = false;

const MASTER_LEVEL = 0.045;

function build() {
  const AC: typeof AudioContext | undefined =
    typeof window !== "undefined"
      ? window.AudioContext ??
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      : undefined;
  if (!AC) return false;
  ctx = new AC();

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 320;
  filter.Q.value = 0.6;

  master = ctx.createGain();
  master.gain.value = 0;
  master.connect(filter);
  filter.connect(ctx.destination);

  // A1 + E2 + A2: a wide, calm minor chord that never resolves.
  const voices: Array<[number, number]> = [
    [55, 0.5],
    [82.41, 0.32],
    [110, 0.2],
  ];
  for (const [freq, level] of voices) {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    g.gain.value = level;
    osc.connect(g);
    g.connect(master);
    osc.start();
  }

  // Slow breathing: the filter opens and closes over ~20 s.
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.value = 0.05;
  const lfoGain = ctx.createGain();
  lfoGain.gain.value = 140;
  lfo.connect(lfoGain);
  lfoGain.connect(filter.frequency);
  lfo.start();

  return true;
}

function fadeTo(level: number) {
  if (!ctx || !master) return;
  master.gain.setTargetAtTime(level, ctx.currentTime, 1.5);
}

function suspend() {
  if (ctx && ctx.state === "running") void ctx.suspend();
}

function resume() {
  if (ctx && ctx.state === "suspended") void ctx.resume();
}

function wireVisibility() {
  if (visibilityWired || typeof document === "undefined") return;
  visibilityWired = true;
  document.addEventListener("visibilitychange", () => {
    if (!started || !enabled) return;
    if (document.hidden) suspend();
    else resume();
  });
}

/**
 * Start the drone. Call only from a user gesture (or from a gesture
 * handler): before that the AudioContext stays suspended by the browser
 * and this is a silent no-op. If sound is muted, remember the intent and
 * start as soon as it is enabled again.
 */
export function startAmbient(soundOn: boolean) {
  if (typeof window === "undefined") return;
  hasInteracted = true;
  enabled = soundOn;
  if (started) {
    if (enabled) resume();
    return;
  }
  if (!enabled) return;
  if (!build()) return;
  started = true;
  wireVisibility();
  void ctx?.resume();
  fadeTo(MASTER_LEVEL);
}

/** The settings sound switch: mute fades the drone out, unmute fades it in
    (and starts it if the user has already interacted with the page). */
export function setAmbientEnabled(soundOn: boolean) {
  enabled = soundOn;
  if (!started) {
    if (soundOn && hasInteracted) startAmbient(true);
    return;
  }
  if (soundOn) {
    resume();
    fadeTo(MASTER_LEVEL);
  } else {
    fadeTo(0);
  }
}
