# Scroll Frame Animation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vite + React app where scrolling smoothly scrubs a full-bleed 240-frame Eagle image sequence with no zoom and no other UI.

**Architecture:** Tall scroll page drives progress `0→1`. A fixed full-viewport canvas draws preloaded frames. Target frame index comes from scroll; a rAF loop lerps toward it and draws with cover-fit math (scale to fill, crop edges — no animated zoom).

**Tech Stack:** Vite, React 19, TypeScript, Vitest (for pure math helpers)

## Global Constraints

- 240 frames at `1280×720` from `assets/frames/ezgif-frame-XXX.jpg`
- End-to-edge viewport coverage; no zoom in/out across the sequence
- No additional elements or components on screen (canvas + scroll shell only)
- Cover fill only — never letterbox; never animate scale
- Scroll height ≈ 350vh

---

## File Structure

| File | Responsibility |
|------|----------------|
| `package.json`, `vite.config.ts`, `tsconfig*.json`, `index.html` | Vite + React + Vitest scaffold |
| `public/frames/*.jpg` | Static frame assets served at `/frames/...` |
| `src/scrollMath.ts` | Pure helpers: frame path, progress→index, cover rect, lerp |
| `src/scrollMath.test.ts` | Unit tests for helpers |
| `src/scrollSequence.ts` | Preload, rAF lerp loop, canvas draw |
| `src/App.tsx` | Scroll shell + single canvas |
| `src/main.tsx` | React mount |
| `src/index.css` | Reset, fixed canvas, 350vh scroll |

---

### Task 1: Scaffold Vite + React and copy frames

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/vite-env.d.ts`
- Create: `public/frames/` (copy from `assets/frames/`)

**Interfaces:**
- Consumes: none
- Produces: runnable `npm run dev`; frames at `/frames/ezgif-frame-001.jpg` … `240`

- [ ] **Step 1: Create Vite React-TS project files**

`package.json`:

```json
{
  "name": "the-eagle",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react": "^4.3.4",
    "typescript": "~5.7.2",
    "vite": "^6.0.0",
    "vitest": "^3.0.0"
  }
}
```

`vite.config.ts`:

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
  },
});
```

`index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>The Eagle</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

`tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

`tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

`tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

`src/vite-env.d.ts`:

```ts
/// <reference types="vite/client" />
```

`src/main.tsx` (temporary stub until Task 3):

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div />
  </StrictMode>
);
```

- [ ] **Step 2: Copy frames into public**

```powershell
New-Item -ItemType Directory -Force -Path "public\frames" | Out-Null
Copy-Item "assets\frames\*.jpg" "public\frames\" -Force
(Get-ChildItem "public\frames\*.jpg").Count
```

Expected: `240`

- [ ] **Step 3: Install and verify dev server starts**

```powershell
npm install
npm run build
```

Expected: build succeeds (empty root div is fine).

- [ ] **Step 4: Commit** (only if user asked for commits; otherwise skip)

```bash
git add package.json vite.config.ts tsconfig.json tsconfig.app.json tsconfig.node.json index.html src public/frames
git commit -m "chore: scaffold Vite React app and add frame assets"
```

---

### Task 2: Scroll math helpers + tests

**Files:**
- Create: `src/scrollMath.ts`
- Create: `src/scrollMath.test.ts`

**Interfaces:**
- Consumes: none
- Produces:
  - `FRAME_COUNT = 240`
  - `framePath(index: number): string` → `/frames/ezgif-frame-NNN.jpg` (1-based, zero-padded 3)
  - `progressToFrameIndex(progress: number, frameCount: number): number` → integer `0..frameCount-1`
  - `lerp(current: number, target: number, alpha: number): number`
  - `coverRect(srcW: number, srcH: number, dstW: number, dstH: number): { sx: number; sy: number; sw: number; sh: number; dx: number; dy: number; dw: number; dh: number }` — source crop + dest full canvas (cover)

- [ ] **Step 1: Write failing tests**

`src/scrollMath.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import {
  FRAME_COUNT,
  coverRect,
  framePath,
  lerp,
  progressToFrameIndex,
} from "./scrollMath";

describe("framePath", () => {
  it("pads 1-based indices to 3 digits", () => {
    expect(framePath(0)).toBe("/frames/ezgif-frame-001.jpg");
    expect(framePath(239)).toBe("/frames/ezgif-frame-240.jpg");
  });
});

describe("progressToFrameIndex", () => {
  it("maps 0 and 1 to ends", () => {
    expect(progressToFrameIndex(0, FRAME_COUNT)).toBe(0);
    expect(progressToFrameIndex(1, FRAME_COUNT)).toBe(FRAME_COUNT - 1);
  });

  it("clamps out of range", () => {
    expect(progressToFrameIndex(-0.5, FRAME_COUNT)).toBe(0);
    expect(progressToFrameIndex(1.5, FRAME_COUNT)).toBe(FRAME_COUNT - 1);
  });
});

describe("lerp", () => {
  it("moves toward target by alpha", () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
  });
});

describe("coverRect", () => {
  it("fills destination without letterboxing (16:9 into taller viewport)", () => {
    const r = coverRect(1280, 720, 1000, 1000);
    expect(r.dw).toBe(1000);
    expect(r.dh).toBe(1000);
    expect(r.dx).toBe(0);
    expect(r.dy).toBe(0);
    expect(r.sw / r.sh).toBeCloseTo(1, 5);
  });

  it("fills destination for wider viewport", () => {
    const r = coverRect(1280, 720, 2000, 500);
    expect(r.dw).toBe(2000);
    expect(r.dh).toBe(500);
    expect(r.dx).toBe(0);
    expect(r.dy).toBe(0);
  });
});
```

- [ ] **Step 2: Run tests — expect FAIL**

```powershell
npm test
```

Expected: FAIL — `scrollMath` module not found / exports missing.

- [ ] **Step 3: Implement helpers**

`src/scrollMath.ts`:

```ts
export const FRAME_COUNT = 240;

export function framePath(index: number): string {
  const n = String(index + 1).padStart(3, "0");
  return `/frames/ezgif-frame-${n}.jpg`;
}

export function progressToFrameIndex(
  progress: number,
  frameCount: number
): number {
  const p = Math.min(1, Math.max(0, progress));
  return Math.min(frameCount - 1, Math.round(p * (frameCount - 1)));
}

export function lerp(current: number, target: number, alpha: number): number {
  return current + (target - current) * alpha;
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
    // source wider than dest — crop sides
    sw = srcH * dstAspect;
    sx = (srcW - sw) / 2;
  } else {
    // source taller than dest — crop top/bottom
    sh = srcW / dstAspect;
    sy = (srcH - sh) / 2;
  }

  return { sx, sy, sw, sh, dx: 0, dy: 0, dw: dstW, dh: dstH };
}
```

- [ ] **Step 4: Run tests — expect PASS**

```powershell
npm test
```

Expected: all tests PASS.

- [ ] **Step 5: Commit** (skip unless user requested)

```bash
git add src/scrollMath.ts src/scrollMath.test.ts
git commit -m "feat: add scroll frame math helpers"
```

---

### Task 3: Sequence controller + App canvas UI

**Files:**
- Create: `src/scrollSequence.ts`
- Create: `src/App.tsx`
- Create: `src/index.css`
- Modify: `src/main.tsx`

**Interfaces:**
- Consumes: `FRAME_COUNT`, `framePath`, `progressToFrameIndex`, `lerp`, `coverRect` from `scrollMath.ts`
- Produces:
  - `createScrollSequence(canvas: HTMLCanvasElement): { destroy: () => void }`
  - App renders only: scroll spacer + canvas (no other UI)

- [ ] **Step 1: Implement sequence controller**

`src/scrollSequence.ts`:

```ts
import {
  FRAME_COUNT,
  coverRect,
  framePath,
  lerp,
  progressToFrameIndex,
} from "./scrollMath";

const LERP_ALPHA = 0.18;

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
  const ctx = canvas.getContext("2d", { alpha: false });
  if (!ctx) {
    return { destroy() {} };
  }

  let frames: HTMLImageElement[] = [];
  let displayIndex = 0;
  let targetIndex = 0;
  let rafId = 0;
  let destroyed = false;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function scrollProgress(): number {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (max <= 0) return 0;
    return window.scrollY / max;
  }

  function draw() {
    if (!frames.length) return;
    const img = frames[Math.round(displayIndex)] ?? frames[0];
    const w = window.innerWidth;
    const h = window.innerHeight;
    const r = coverRect(img.naturalWidth, img.naturalHeight, w, h);
    ctx!.fillStyle = "#000";
    ctx!.fillRect(0, 0, w, h);
    ctx!.drawImage(img, r.sx, r.sy, r.sw, r.sh, r.dx, r.dy, r.dw, r.dh);
  }

  function tick() {
    if (destroyed) return;
    targetIndex = progressToFrameIndex(scrollProgress(), FRAME_COUNT);
    displayIndex = lerp(displayIndex, targetIndex, LERP_ALPHA);
    if (Math.abs(displayIndex - targetIndex) < 0.01) {
      displayIndex = targetIndex;
    }
    draw();
    rafId = requestAnimationFrame(tick);
  }

  function onScroll() {
    targetIndex = progressToFrameIndex(scrollProgress(), FRAME_COUNT);
  }

  resize();
  window.addEventListener("resize", resize);
  window.addEventListener("scroll", onScroll, { passive: true });

  void Promise.all(
    Array.from({ length: FRAME_COUNT }, (_, i) => loadImage(framePath(i)))
  ).then((loaded) => {
    if (destroyed) return;
    frames = loaded;
    displayIndex = progressToFrameIndex(scrollProgress(), FRAME_COUNT);
    targetIndex = displayIndex;
    tick();
  });

  return {
    destroy() {
      destroyed = true;
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    },
  };
}
```

- [ ] **Step 2: Implement App + CSS (visual only)**

`src/index.css`:

```css
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body,
#root {
  width: 100%;
  min-height: 100%;
  background: #000;
}

body {
  overflow-x: hidden;
}

.scroll-track {
  height: 350vh;
}

.sequence-canvas {
  position: fixed;
  inset: 0;
  width: 100%;
  height: 100%;
  display: block;
  pointer-events: none;
}
```

`src/App.tsx`:

```tsx
import { useEffect, useRef } from "react";
import { createScrollSequence } from "./scrollSequence";

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const sequence = createScrollSequence(canvas);
    return () => sequence.destroy();
  }, []);

  return (
    <>
      <div className="scroll-track" aria-hidden="true" />
      <canvas ref={canvasRef} className="sequence-canvas" />
    </>
  );
}
```

`src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
```

- [ ] **Step 3: Verify build + manual scroll check**

```powershell
npm test
npm run build
npm run dev
```

Manual check:
1. Open the local URL.
2. Viewport shows only the sequence (no text/UI).
3. Scroll top → bottom plays frames 1 → 240 smoothly.
4. Resize window — still edge-to-edge, no zoom animation.

- [ ] **Step 4: Commit** (skip unless user requested)

```bash
git add src/scrollSequence.ts src/App.tsx src/index.css src/main.tsx
git commit -m "feat: add full-bleed scroll frame sequence"
```

---

## Spec coverage (self-review)

| Spec requirement | Task |
|------------------|------|
| Vite + React | Task 1 |
| 240 frames from assets | Task 1 copy + Task 2 paths |
| Full-bleed / cover, no zoom | Task 2 `coverRect` + Task 3 draw |
| Smooth scrub | Task 3 lerp + rAF |
| No other UI | Task 3 App/CSS |
| ~350vh scroll | Task 3 `.scroll-track` |

No placeholders remaining. Types consistent across tasks.
