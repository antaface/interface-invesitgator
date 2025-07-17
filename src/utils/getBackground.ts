const base = import.meta.env.BASE_URL ?? "/";

export function getBackground(sceneId: string) {
  const map: Record<string, string> = {
    landing:  `${base}backgrounds/landing.png`,
    intro:    `${base}backgrounds/intro.png`,
    nav:      `${base}backgrounds/nav.png`,
    tap:      `${base}backgrounds/tap.png`,
    form:     `${base}backgrounds/form.png`,
    popup:    `${base}backgrounds/popup.png`,
    scroll:   `${base}backgrounds/scroll.png`,
    anim:     `${base}backgrounds/anim.png`,
    loader:   `${base}backgrounds/loader.png`,
    contrast: `${base}backgrounds/contrast.png`,
  };
  const key = Object.keys(map).find(p => sceneId.startsWith(p)) ?? "landing";
  return map[key];
}