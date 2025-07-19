import { Howl } from "howler";

const sounds = {
  click: new Howl({ src: ["/audio/click.mp3"], volume: 0.4 }),
  success: new Howl({ src: ["/audio/success.mp3"], volume: 0.4 }),
  fail: new Howl({ src: ["/audio/fail.mp3"], volume: 0.4 }),
};

export function playSfx(
  name: "click" | "success" | "fail",
  muted = false
) {
  if (muted) return;
  sounds[name].play();
}