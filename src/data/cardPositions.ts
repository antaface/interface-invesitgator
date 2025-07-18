// REQUIRED keys — delete one and TypeScript errors out
export type CardPrefix =
  | "landing" | "intro" | "nav" | "tap" | "form"
  | "popup" | "scroll" | "anim" | "loader" | "contrast";

// Position mapping (edit values as needed)
export const cardPos: Record<CardPrefix, string> = {
  landing:  "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  intro:    "top-24 left-24",
  nav:      "top-[56px] left-1/2 -translate-x-1/2",
  tap:      "top-32 left-40",
  form:     "top-1/3 left-24",
  popup:    "bottom-12 right-12",
  scroll:   "top-1/2 right-16",
  anim:     "bottom-12 right-12",
  loader:   "bottom-12 left-12",
  contrast: "bottom-24 left-24",
};