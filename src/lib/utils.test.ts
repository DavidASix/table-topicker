import { describe, it, expect } from "vitest";

describe("Basic Math", () => {
  it("should add two numbers correctly", () => {
    expect(1 + 1).toBe(2);
  });

  it("should subtract two numbers correctly", () => {
    expect(5 - 3).toBe(2);
  });

  it("should multiply two numbers correctly", () => {
    expect(3 * 4).toBe(12);
  });
});
