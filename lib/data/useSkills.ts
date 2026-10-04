"use client";

import { useEffect, useState } from "react";
import { SKILLS_API_URL, buildSkills, parseApiSkills, type Skill } from "./skills";

/** Set NEXT_PUBLIC_SKILLS_REFRESH=false to only use the build-time snapshot. */
const LIVE_REFRESH = process.env.NEXT_PUBLIC_SKILLS_REFRESH !== "false";
const TIMEOUT_MS = 6000;

let liveSkills: Skill[] | null = null;
let liveRequest: Promise<Skill[] | null> | null = null;

function fetchLiveSkills(): Promise<Skill[] | null> {
  liveRequest ??= fetch(SKILLS_API_URL, { signal: AbortSignal.timeout(TIMEOUT_MS) })
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => {
      const skills = parseApiSkills(data);
      if (skills.length === 0) return null;
      liveSkills = skills;
      return skills;
    })
    .catch(() => null);
  return liveRequest;
}

/** Build-time skills, refreshed once per page load from the API when reachable. */
export function useSkills(): Skill[] {
  const [skills, setSkills] = useState<Skill[]>(() => liveSkills ?? buildSkills);

  useEffect(() => {
    if (!LIVE_REFRESH || liveSkills) return;
    let active = true;
    fetchLiveSkills().then((live) => {
      if (active && live) setSkills(live);
    });
    return () => {
      active = false;
    };
  }, []);

  return skills;
}
