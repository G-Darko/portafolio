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
 *
 * Ownership: the drone belongs to the Exordia world (NyxheimWorld). It
 * starts on mount / first gesture and stops on unmount or when an era
 * travel starts (`stopAmbient`) — the module singleton survives
 * client-side navigation, so without an explicit stop it would keep
 * playing the Exordia drone in the HUD/LEGACY eras.
 */
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let started = false;
let enabled = true;
let hasInteracted = false;
let visibilityWired = false;
let stopTimer: number | null = null;

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
 * Record a real user gesture (pointer/key). The drone is only built
 * after one: browsers create the AudioContext suspended before that.
 * Called by NyxheimWorld's first-gesture handler and by EraTravel
 * (the click that starts a travel is a gesture too).
 */
export function noteAmbientGesture() {
  hasInteracted = true;
}

/** Has the user interacted with the page yet (see noteAmbientGesture). */
export function hasAmbientInteracted() {
  return hasInteracted;
}

/**
 * Start the drone. Call only from a user gesture (or from a gesture
 * handler): before that the AudioContext stays suspended by the browser
 * and this is a silent no-op. If sound is muted, remember the intent and
 * start as soon as it is enabled again. Returning to Exordia reuses the
 * context built on the earlier visit instead of building a new one.
 */
export function startAmbient(soundOn: boolean) {
  if (typeof window === "undefined") return;
  enabled = soundOn;
  // A pending stop (travel away, then back within ~1.5 s) is cancelled:
  // the drone comes back instead of suspending under the new era.
  if (stopTimer !== null) {
    window.clearTimeout(stopTimer);
    stopTimer = null;
  }
  if (started) {
    if (enabled) resume();
    return;
  }
  if (!enabled) return;
  // Never build a fresh context before the first real gesture; reusing
  // an existing one (returning to Exordia) is fine — the user already
  // interacted with the page by then.
  if (!ctx && !hasInteracted) return;
  if (!ctx) {
    if (!build()) return;
    wireVisibility();
  }
  started = true;
  void ctx?.resume();
  fadeTo(MASTER_LEVEL);
}

/**
 * Stop the drone (leaving Exordia): linear fade to silence, then suspend
 * the context so the oscillators stop rendering. The context is kept so
 * a return to Exordia resumes it instead of building a new one, and
 * `started` is reset so the drone can start cleanly again.
 */
export function stopAmbient() {
  if (!started || !ctx || !master) return;
  started = false;
  const now = ctx.currentTime;
  master.gain.cancelScheduledValues(now);
  master.gain.setValueAtTime(master.gain.value, now);
  master.gain.linearRampToValueAtTime(0, now + 1.2);
  if (stopTimer !== null) window.clearTimeout(stopTimer);
  stopTimer = window.setTimeout(() => {
    stopTimer = null;
    suspend();
  }, 1500);
}

/** The settings sound switch: mute fades the drone out, unmute fades it in.
    It only ever touches a RUNNING drone: starting is NyxheimWorld's job
    (mount / first gesture), so toggling sound in another era can never
    wake the Exordia drone up there. */
export function setAmbientEnabled(soundOn: boolean) {
  enabled = soundOn;
  if (!started) return;
  if (soundOn) {
    resume();
    fadeTo(MASTER_LEVEL);
  } else {
    fadeTo(0);
  }
}
