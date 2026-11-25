/**
 * Thin facade over cuelume — keeps HUD semantic play helpers stable.
 * @see https://cuelume-site.pages.dev/agents.md
 */
import {
  bind as cuelumeBind,
  play as cuelumePlay,
  setEnabled as cuelumeSetEnabled,
  setVolume as cuelumeSetVolume,
  type SoundName,
} from "cuelume";

export { type SoundName };

export function bind(root?: ParentNode) {
  cuelumeBind(root);
}

export function setEnabled(enabled: boolean) {
  cuelumeSetEnabled(enabled);
}

export function setVolume(volume: number) {
  cuelumeSetVolume(volume);
}

export function play(name?: SoundName, options?: { volume?: number }) {
  cuelumePlay(name, options);
}

export function playHUDClick() {
  play("tick");
}

export function playWindowOpen() {
  play("bloom");
}

/** A panel closes or collapses: the "droplet" dismiss cue. */
export function playPanelClose() {
  play("droplet");
}

/** Traveling between bodies/routes: the "page" navigation cue. */
export function playNavigate() {
  play("page");
}

/**
 * Time travel between eras (Ronda 7, DARK-style): `scan` rising, then a
 * synthesized WebAudio whoosh — white noise through a bandpass sweeping
 * 400→4000→300 Hz over ~0.9 s, same pattern as `lib/audio/ambient.ts`
 * (no audio files, no new dependencies) — and `arrival` on landing
 * (~1 s, when the route change is covered by the tunnel overlay).
 * Silent when sound is off: `syncHudAudioEnabled` keeps the local flag
 * in sync with `soundEnabled` in `useHUDStore` (and Cuelume's own
 * enabled flag silences the `scan`/`arrival` cues the same way).
 */
export function playTimeTravel() {
  if (!soundOn || typeof window === "undefined") return;
  play("scan");
  playWhoosh();
  window.setTimeout(() => {
    if (soundOn) play("arrival");
  }, 1000);
}

function playWhoosh() {
  try {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const duration = 0.9;
    const buffer = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * duration), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.Q.value = 1.1;
    const t0 = ctx.currentTime;
    bandpass.frequency.setValueAtTime(400, t0);
    bandpass.frequency.exponentialRampToValueAtTime(4000, t0 + duration * 0.5);
    bandpass.frequency.exponentialRampToValueAtTime(300, t0 + duration);
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, t0);
    gain.gain.linearRampToValueAtTime(0.22, t0 + duration * 0.4);
    gain.gain.linearRampToValueAtTime(0, t0 + duration);
    src.connect(bandpass);
    bandpass.connect(gain);
    gain.connect(ctx.destination);
    src.start(t0);
    src.stop(t0 + duration);
    src.onended = () => void ctx.close();
  } catch {
    // Audio is decorative: never break the transition.
  }
}

/** An action completed (copy, form sent). */
export function playSuccess() {
  play("success");
}

/** A recoverable error (form failed). */
export function playError() {
  play("error");
}

export function playBootupChime() {
  play("chime");
}

export function playQTESuccess() {
  play("success");
}

export function playQTEMiss() {
  play("error");
}

/** Init once on the client; sync mute with HUD store. */
export function initHudAudio(soundEnabled: boolean) {
  bind();
  setVolume(0.7);
  soundOn = soundEnabled;
  setEnabled(soundEnabled);
}

export function syncHudAudioEnabled(soundEnabled: boolean) {
  soundOn = soundEnabled;
  setEnabled(soundEnabled);
}

/** Local mirror of `soundEnabled` (the store imports this module, so the
    flag is synced from the store side instead of importing it back). */
let soundOn = true;
