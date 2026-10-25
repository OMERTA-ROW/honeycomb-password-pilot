import { describe, it, expect } from "vitest";
import { summarize, fixNextQueue, changePasswordUrls, type HealthAccount } from "./health";

const list: HealthAccount[] = [
  { id: "a", site: "a.test", weak: false, breached: true, passkey: false },
  { id: "b", site: "b.test", weak: true, reuseGroup: "g", breached: false, passkey: true },
  { id: "c", site: "c.test", weak: false, reuseGroup: "g", breached: false, passkey: false },
  { id: "d", site: "d.test", weak: false, breached: false, passkey: false },
];

describe("password health", () => {
  it("counts weak, reused and breached", () => {
    expect(summarize(list)).toMatchObject({ total: 4, weak: 1, reused: 2, breached: 1 });
  });
  it("score is 100 when nothing is wrong", () => {
    expect(summarize([list[3]!]).score).toBe(100);
  });
  it("breached accounts rank first in Fix Next", () => {
    expect(fixNextQueue(list).map((a) => a.id)).toEqual(["a", "b", "c"]);
  });
  it("an account leaves the queue only once marked done", () => {
    expect(fixNextQueue(list, new Set(["a"])).map((a) => a.id)).not.toContain("a");
  });
  it("tries /.well-known/change-password first", () => {
    expect(changePasswordUrls("x.test")[0]).toBe("https://x.test/.well-known/change-password");
  });
});
