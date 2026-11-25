import { Briefcase, GraduationCap, type LucideIcon } from "lucide-react";
import SheepIcon from "@/components/icons/SheepIcon";
import type { MissionIcon } from "@/lib/data/missions";

/** Icon per mission (`icon` field of the API missions). */
export const missionIconMap: Record<MissionIcon, LucideIcon | typeof SheepIcon> = {
  Sheep: SheepIcon,
  Briefcase,
  GraduationCap,
};
