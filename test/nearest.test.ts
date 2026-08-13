import { describe, expect, it } from "vitest";
import {
  isOnGrid,
  nearestInScale,
  nearestMultiple,
} from "../src/util/nearest.js";

describe("nearestMultiple", () => {
  it("snaps to the nearest multiple of the base", () => {
    expect(nearestMultiple(13, 4)).toBe(12);
    expect(nearestMultiple(15, 4)).toBe(16);
    expect(nearestMultiple(8, 4)).toBe(8);
    expect(nearestMultiple(1, 4)).toBe(0);
  });

  it("breaks exact ties toward the larger multiple (half-up)", () => {
    expect(nearestMultiple(14, 4)).toBe(16); // 12 vs 16, tie → 16
    expect(nearestMultiple(2, 4)).toBe(4); // 0 vs 4, tie → 4
    expect(nearestMultiple(6, 4)).toBe(8); // 4 vs 8, tie → 8
  });

  it("throws on non-positive base", () => {
    expect(() => nearestMultiple(10, 0)).toThrow();
    expect(() => nearestMultiple(10, -4)).toThrow();
  });
});

describe("nearestInScale", () => {
  const scale = [2, 4, 8, 12, 14, 16, 320, 384];

  it("finds the closest value", () => {
    expect(nearestInScale(15.68, scale)).toBe(16);
    expect(nearestInScale(347, scale)).toBe(320);
    expect(nearestInScale(5, scale)).toBe(4); // closest, no tie
  });

  it("breaks exact ties toward the SMALLER value", () => {
    // 13 is equidistant to 12 and 14 → must pick 12 (spec: p-[13px] → p-3)
    expect(nearestInScale(13, scale)).toBe(12);
    // 6 is equidistant to 4 and 8 → 4
    expect(nearestInScale(6, scale)).toBe(4);
  });

  it("is order-independent", () => {
    expect(nearestInScale(13, [16, 12, 14, 8])).toBe(12);
  });

  it("throws on empty scale", () => {
    expect(() => nearestInScale(5, [])).toThrow();
  });
});

describe("isOnGrid", () => {
  it("treats within-0.6px of a multiple as on-grid", () => {
    expect(isOnGrid(15.68, 4)).toBe(true); // |15.68 - 16| = 0.32
    expect(isOnGrid(16, 4)).toBe(true);
    expect(isOnGrid(13, 4)).toBe(false); // |13 - 12| = 1
  });

  it("respects the tolerance boundary", () => {
    expect(isOnGrid(12.7, 4)).toBe(false); // 0.7px off → not on-grid
    expect(isOnGrid(12.5, 4)).toBe(true); // 0.5px off → on-grid
  });
});
