import {
  FRAME_COUNT,
  coverRect,
  damp,
  framePath,
  progressToFrameFloat,
} from "./scrollMath";

/** Higher = locks to scroll sooner (less floaty drift). */
const SMOOTH_SPEED = 22;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

export function createScrollSequence(canvas: HTMLCanvasElement): {
  destroy: () => void;
} {
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) {
    return { destroy() {} };
  }
  const ctx = context;

  let frames: HTMLImageElement[] = [];
  let displayIndex = 0;
  let rafId = 0;
  let destroyed = false;
  let lastTime = performance.now();

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function scrollProgress(): number {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return 0;
    return window.scrollY / max;
  }

  function paintFrame(img: HTMLImageElement, w: number, h: number) {
    const r = coverRect(img.naturalWidth, img.naturalHeight, w, h);
    ctx.drawImage(img, r.sx, r.sy, r.sw, r.sh, r.dx, r.dy, r.dw, r.dh);
  }

  function draw() {
    if (!frames.length) return;
    const w = window.innerWidth;
    const h = window.innerHeight;
    const maxIndex = frames.length - 1;
    const clamped = Math.min(maxIndex, Math.max(0, displayIndex));
    const i0 = Math.floor(clamped);
    const i1 = Math.min(maxIndex, i0 + 1);
    const blend = clamped - i0;

    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);
    paintFrame(frames[i0], w, h);

    if (blend > 0.001 && i1 !== i0) {
      ctx.globalAlpha = blend;
      paintFrame(frames[i1], w, h);
      ctx.globalAlpha = 1;
    }
  }

  function tick(now: number) {
    if (destroyed) return;
    const dt = Math.min(0.05, (now - lastTime) / 1000);
    lastTime = now;

    const target = progressToFrameFloat(scrollProgress(), FRAME_COUNT);
    displayIndex = damp(displayIndex, target, SMOOTH_SPEED, dt);
    if (Math.abs(displayIndex - target) < 0.001) {
      displayIndex = target;
    }

    draw();
    rafId = requestAnimationFrame(tick);
  }

  resize();
  window.addEventListener("resize", resize);

  void Promise.all(
    Array.from({ length: FRAME_COUNT }, (_, i) => loadImage(framePath(i)))
  ).then((loaded) => {
    if (destroyed) return;
    frames = loaded;
    displayIndex = progressToFrameFloat(scrollProgress(), FRAME_COUNT);
    lastTime = performance.now();
    rafId = requestAnimationFrame(tick);
  });

  return {
    destroy() {
      destroyed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    },
  };
}
