import { describe, it, expect, afterEach, vi } from "vitest";
import handler from "../api/github.js";

function mockRes() {
  const res = { statusCode: null, body: null, headers: {} };
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (body) => {
    res.body = body;
    return res;
  };
  res.send = (body) => {
    res.body = body;
    return res;
  };
  res.setHeader = (key, value) => {
    res.headers[key] = value;
  };
  return res;
}

afterEach(() => {
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("GitHub proxy", () => {
  it("rejects a request with no path", async () => {
    const res = mockRes();
    await handler({ query: {} }, res);
    expect(res.statusCode).toBe(400);
  });

  it("rejects paths that are not on the allowlist", async () => {
    const res = mockRes();
    await handler({ query: { path: "/orgs/vercel" } }, res);
    expect(res.statusCode).toBe(400);
  });

  it("rejects attempts to redirect to another host", async () => {
    const res = mockRes();
    await handler({ query: { path: "//evil.com/users/torvalds" } }, res);
    expect(res.statusCode).toBe(400);
  });

  it("forwards allowed paths with the server-side token and cache header", async () => {
    vi.stubEnv("GITHUB_TOKEN", "secret");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      text: async () => '{"login":"torvalds"}',
    });
    vi.stubGlobal("fetch", fetchMock);

    const res = mockRes();
    await handler({ query: { path: "/users/torvalds" } }, res);

    const [url, options] = fetchMock.mock.calls[0];
    expect(url.href).toBe("https://api.github.com/users/torvalds");
    expect(options.headers.Authorization).toBe("Bearer secret");
    expect(res.statusCode).toBe(200);
    expect(res.headers["Cache-Control"]).toContain("s-maxage=300");
  });

  it("does not cache error responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        text: async () => '{"message":"Not Found"}',
      })
    );

    const res = mockRes();
    await handler({ query: { path: "/users/nobody" } }, res);

    expect(res.statusCode).toBe(404);
    expect(res.headers["Cache-Control"]).toBeUndefined();
  });

  it("returns 502 when GitHub can't be reached", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    const res = mockRes();
    await handler({ query: { path: "/users/torvalds" } }, res);

    expect(res.statusCode).toBe(502);
  });
});