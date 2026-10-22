import raw from "./profile.generated.json";
import { parseProfile, type ApiProfile } from "./api";

/**
 * Build-time snapshot of `/api/profile` (written by `scripts/fetch-profile.mjs`, committed).
 * It is the offline fallback too: if the API is down at build time the previous snapshot stays.
 */
function load(): ApiProfile {
  const profile = parseProfile(raw);
  if (!profile) throw new Error("lib/data/profile.generated.json is not a valid /api/profile payload");
  return profile;
}

export const profileSnapshot: ApiProfile = load();
