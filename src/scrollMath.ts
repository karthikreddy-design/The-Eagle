export const FRAME_COUNT = 240;

export function framePath(index: number): string {
  const n = String(index + 1).padStart(3, "0");
  return `/frames/ezgif-frame-${n}.jpg`;
}

export function progressToFrameIndex(
  progress: number,
  frameCount: number
): number {
  return Math.round(progressToFrameFloat(progress, frameCount));
}

/** Continuous frame position for smooth scrubbing (0 … frameCount-1). */
export function progressToFrameFloat(
  progress: number,
  frameCount: number
): number {
  const p = Math.min(1, Math.max(0, progress));
  return p * (frameCount - 1);
}

/** Frame-rate independent approach toward target. Higher speed = snappier. */
export function damp(
  current: number,
  target: number,
  speed: number,
  dt: number
): number {
  return current + (target - current) * (1 - Math.exp(-speed * dt));
}

export function coverRect(
  srcW: number,
  srcH: number,
  dstW: number,
  dstH: number
): {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
  dx: number;
  dy: number;
  dw: number;
  dh: number;
} {
  const srcAspect = srcW / srcH;
  const dstAspect = dstW / dstH;

  let sx = 0;
  let sy = 0;
  let sw = srcW;
  let sh = srcH;

  if (srcAspect > dstAspect) {
    sw = srcH * dstAspect;
    sx = (srcW - sw) / 2;
  } else {
    sh = srcW / dstAspect;
    sy = (srcH - sh) / 2;
  }

  return { sx, sy, sw, sh, dx: 0, dy: 0, dw: dstW, dh: dstH };
}
