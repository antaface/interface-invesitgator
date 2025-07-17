export function getBackground(sceneId: string) {
  const map: { [k: string]: string } = {
    landing:  "/backgrounds/landing.png",
    intro:    "/backgrounds/landing.png",   // intro uses the same artwork
    nav:      "/backgrounds/nav.png",
    tap:      "/backgrounds/tap.png",
    form:     "/backgrounds/form.png",
    popup:    "/backgrounds/popup.png",
    scroll:   "/backgrounds/scroll.png",
    anim:     "/backgrounds/anim.png",
    loader:   "/backgrounds/loader.png",
    contrast: "/backgrounds/contrast.png",
  };

  const key =
    Object.keys(map).find(prefix => sceneId.startsWith(prefix)) || "landing";
  return map[key];
}