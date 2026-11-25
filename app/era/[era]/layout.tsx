import { FULL_NAME, JOB_TITLE } from "@/lib/seo";
import { getEra } from "@/lib/eras";
import EraShell from "@/components/eras/EraShell";

/**
 * Layout for the explicit era routes (`/era/<era>/...`, Ronda 7).
 * Each era renders its own shell; the page slot only exists so the
 * static export can emit shareable HTML (same pattern as the root
 * `(hud)/layout.tsx`).
 *
 * The shell itself lives in `EraShell` (client component): a server
 * layout that branches on `params.era` is preserved across client-side
 * navigations within this segment and does not re-render when the param
 * changes, so `/era/legacy/` → `/era/hud/` left `<LegacyEraApp />`
 * (and its sticky header) mounted. `EraShell` reads the era from
 * `useParams()` and remounts per era instead.
 */
export default async function EraLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ era: string }>;
}) {
  const { era } = await params;
  const def = getEra(era);
  if (!def) {
    return <>{children}</>;
  }

  return (
    <>
      <h1 className="sr-only">
        {FULL_NAME} | {JOB_TITLE}
      </h1>
      <EraShell era={def.id} />
      <div hidden aria-hidden>
        {children}
      </div>
    </>
  );
}
