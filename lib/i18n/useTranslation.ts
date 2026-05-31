import { useLocaleStore } from "@/lib/store/useLocaleStore";
import { translations } from "./translations";

export function useTranslation() {
  const { locale } = useLocaleStore();
  const t = translations[locale];
  return { t, locale };
}
