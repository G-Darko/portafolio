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
  setEnabled(soundEnabled);
}

export function syncHudAudioEnabled(soundEnabled: boolean) {
  setEnabled(soundEnabled);
}
