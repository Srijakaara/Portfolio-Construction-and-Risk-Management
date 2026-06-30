/**
 * Single shared visual contract for every filter-bar control (search input,
 * native selects) across queue/triage pages. Workbench and Auditor must both
 * import this — never redeclare it locally, or the two pages will drift.
 */
export const INPUT_CLASS =
  "h-9 rounded border hairline bg-white px-3 text-sm text-slate-700 outline-none focus:border-[#c7cdf9] focus:ring-4 focus:ring-[#eef2ff]"
