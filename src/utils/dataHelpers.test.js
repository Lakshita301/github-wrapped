import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  buildHeatmapData,
  buildLanguageData,
  buildInsights,
} from "./dataHelpers";

// Freeze "now" so the tests give the same result on any day
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-03-15T12:00:00Z"));
});

afterEach(() => {
  vi.useRealTimers();
});

describe("buildHeatmapData", () => {
  it("returns 90 entries by default", () => {
    expect(buildHeatmapData([])).toHaveLength(90);
  });

  it("ends today", () => {
    const result = buildHeatmapData([]);
    expect(result.at(-1).date).toBe("2026-03-15");
  });

  it("respects a custom number of days", () => {
    const result = buildHeatmapData([], 7);
    expect(result).toHaveLength(7);
    expect(result[0].date).toBe("2026-03-09");
  });

  it("counts events on the right day", () => {
    const events = [
      { created_at: "2026-03-15T08:00:00Z" },
      { created_at: "2026-03-15T09:30:00Z" },
      { created_at: "2026-03-14T23:00:00Z" },
    ];
    const result = buildHeatmapData(events, 3);
    const byDate = Object.fromEntries(result.map((d) => [d.date, d.count]));

    expect(byDate["2026-03-15"]).toBe(2);
    expect(byDate["2026-03-14"]).toBe(1);
  });

  it("fills days without activity with zero", () => {
    const result = buildHeatmapData([], 3);
    expect(result.every((d) => d.count === 0)).toBe(true);
  });
});

describe("buildLanguageData", () => {
  it("converts bytes to rounded percentages, largest first", () => {
    const result = buildLanguageData({ Python: 20000, JavaScript: 80000 });
    expect(result.map((l) => l.name)).toEqual(["JavaScript", "Python"]);
    expect(result.map((l) => l.pct)).toEqual([80, 20]);
  });

  it("returns an empty array when there is no data", () => {
    expect(buildLanguageData({})).toEqual([]);
  });

  it("keeps only the top 8 languages", () => {
    const many = {};
    for (let i = 0; i < 10; i++) many[`Lang${i}`] = 1000;
    expect(buildLanguageData(many)).toHaveLength(8);
  });
});

describe("buildInsights", () => {
  const user = { followers: 10, following: 2 };
  const push = (day) => ({
    type: "PushEvent",
    created_at: `2026-03-${day}T10:00:00Z`,
  });

  it("sums stars and forks but ignores forked repos", () => {
    const repos = [
      { fork: false, stargazers_count: 5, forks_count: 1 },
      { fork: false, stargazers_count: 3, forks_count: 2 },
      { fork: true, stargazers_count: 100, forks_count: 50 },
    ];
    const result = buildInsights(user, repos, []);

    expect(result.totalStars).toBe(8);
    expect(result.totalForks).toBe(3);
    expect(result.totalRepos).toBe(2);
  });

  it("counts only push events as pushes", () => {
    const events = [
      push("15"),
      { type: "WatchEvent", created_at: "2026-03-15T10:00:00Z" },
    ];
    expect(buildInsights(user, [], events).pushes).toBe(1);
  });

  it("counts consecutive active days as a streak", () => {
    // 15, 14, 13 are consecutive; 11 is after a gap on the 12th
    const events = [push("15"), push("14"), push("13"), push("11")];
    expect(buildInsights(user, [], events).streak).toBe(3);
  });

  it("has no streak if there was no activity today", () => {
    expect(buildInsights(user, [], [push("14")]).streak).toBe(0);
  });

  it("passes followers and following through", () => {
    const result = buildInsights(user, [], []);
    expect(result.followers).toBe(10);
    expect(result.following).toBe(2);
  });
});