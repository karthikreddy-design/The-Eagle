import { describe, expect, it } from "vitest";
import {
  FRAME_COUNT,
  coverRect,
  damp,
  framePath,
  progressToFrameFloat,
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

describe("progressToFrameFloat", () => {
  it("returns continuous positions", () => {
    expect(progressToFrameFloat(0.5, FRAME_COUNT)).toBeCloseTo(
      (FRAME_COUNT - 1) / 2,
      5
    );
  });
});

describe("damp", () => {
  it("moves toward target", () => {
    const next = damp(0, 10, 20, 1 / 60);
    expect(next).toBeGreaterThan(0);
    expect(next).toBeLessThan(10);
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
