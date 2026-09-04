# Missions surface

mode: experience
audience: recruiters and hiring managers scanning Gael's work proof
job: scan orgs, open 1–2 strong projects with media and live/repo links
proof: real missions.ts content (Black Sheep, Freelance, Academia → projects); no invented screenshots or metrics

## Direction contract

THESIS: Command lattice — orgs as selectable nodes on an ops map; selecting one opens a side brief of deep-linkable project chips into a media case; refuses equal-weight mission cards and vague progress bars.
OWN-WORLD: Hologram Workshop — near-black console, frosted panel, Holo Cyan / Ops Blue glow on focus, mono system voice + Poppins body.
STORY: Visitor scans three orgs, picks one, opens a project URL, sees real media/links.
FIRST VIEWPORT: Dual pane inside Missions panel — left OPERATIONS MAP lattice (3 org nodes), right SIDE BRIEF project list for the selected org; status as lit/unlit segment cells.
FORM: Command lattice (surface seed 042e2404, THE ROLL); raise from seven-segment readout for status cells.
FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

approvedComp: .impeccable/mocks/decision/command-lattice.png
routes: /missions/ → /missions/{org}/ → /missions/{org}/{project}/
scope: MissionsWindow + HUD routing only; Profile Contact CV Stack Orb shell untouched except mission path sync
antiGoals: no third hierarchy level; no fake metrics counters; gamification secondary to hire path
