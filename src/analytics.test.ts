import assert from "node:assert/strict";
import test, { beforeEach } from "node:test";
import {
  SECTION_LABEL,
  classifyClick,
  extractUtmParams,
  getSectionLabel,
  initAnalytics,
  resetAnalyticsStateForTesting,
  syncUtmStorage,
  withUtm,
  UTM_STORAGE_KEY,
} from "./analytics.ts";

function createMockWindow(search = "") {
  const scripts: any[] = [];
  const listeners: Record<string, Function[]> = {};
  const storage: Record<string, string> = {};

  const head = {
    appendChild(elem: any) {
      scripts.push(elem);
      return elem;
    },
  };

  const doc = {
    head,
    createElement(tag: string) {
      return { tagName: tag.toUpperCase(), async: false, src: "" };
    },
    querySelectorAll(_selector: string) {
      return [];
    },
    addEventListener(event: string, cb: Function) {
      listeners[event] = listeners[event] || [];
      listeners[event].push(cb);
    },
  };

  const sessionStorage = {
    getItem(key: string) {
      return storage[key] ?? null;
    },
    setItem(key: string, val: string) {
      storage[key] = String(val);
    },
    removeItem(key: string) {
      delete storage[key];
    },
    clear() {
      for (const k of Object.keys(storage)) delete storage[k];
    },
  };

  const win = {
    location: { search },
    document: doc,
    sessionStorage,
    addEventListener(event: string, cb: Function) {
      listeners[event] = listeners[event] || [];
      listeners[event].push(cb);
    },
    IntersectionObserver: class MockIntersectionObserver {
      observe() {}
      unobserve() {}
      disconnect() {}
    },
  };

  return { win: win as any, scripts, listeners, storage };
}

beforeEach(() => {
  resetAnalyticsStateForTesting();
});

test("guard 1: no-ID no-op adds no script and no dataLayer", () => {
  // Empty string measurement ID
  const { win: winEmpty, scripts: scriptsEmpty } = createMockWindow();
  initAnalytics("", winEmpty);
  assert.equal(scriptsEmpty.length, 0, "No script tag added for empty ID");
  assert.equal(winEmpty.dataLayer, undefined, "No dataLayer created for empty ID");
  assert.equal(winEmpty.gtag, undefined, "No gtag function created for empty ID");

  // Undefined measurement ID
  resetAnalyticsStateForTesting();
  const { win: winUndef, scripts: scriptsUndef } = createMockWindow();
  initAnalytics(undefined, winUndef);
  assert.equal(scriptsUndef.length, 0, "No script tag added for undefined ID");
  assert.equal(winUndef.dataLayer, undefined, "No dataLayer created for undefined ID");

  // Whitespace-only measurement ID
  resetAnalyticsStateForTesting();
  const { win: winSpace, scripts: scriptsSpace } = createMockWindow();
  initAnalytics("   ", winSpace);
  assert.equal(scriptsSpace.length, 0, "No script tag added for whitespace ID");
  assert.equal(winSpace.dataLayer, undefined, "No dataLayer created for whitespace ID");

  // Valid ID creates script and dataLayer
  resetAnalyticsStateForTesting();
  const { win: winValid, scripts: scriptsValid } = createMockWindow();
  initAnalytics("G-TEST12345", winValid);
  assert.equal(scriptsValid.length, 1, "Exactly one script tag added for valid ID");
  assert.equal(scriptsValid[0].async, true, "Script element must be async");
  assert.match(
    scriptsValid[0].src,
    /^https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-TEST12345$/,
    "Script src matches GA4 gtag URL"
  );
  assert.ok(Array.isArray(winValid.dataLayer), "dataLayer must be an array");
  assert.equal(typeof winValid.gtag, "function", "gtag must be a function");
});

test("guard 2: utm append carries utm_* and is identity without them", () => {
  // Identity when no UTM params
  const emptyUtm: Record<string, string> = {};
  assert.equal(
    withUtm("https://app.voma.vn", emptyUtm),
    "https://app.voma.vn",
    "Without utm_*, app.voma.vn link stays exactly https://app.voma.vn"
  );

  // Appends UTM params when present
  const utms = {
    utm_source: "fb",
    utm_medium: "cpc",
    utm_campaign: "spring2026",
  };
  const result = withUtm("https://app.voma.vn", utms);
  assert.ok(result.includes("utm_source=fb"), "Includes utm_source");
  assert.ok(result.includes("utm_medium=cpc"), "Includes utm_medium");
  assert.ok(result.includes("utm_campaign=spring2026"), "Includes utm_campaign");

  // extractUtmParams filters out non-utm keys
  const extracted = extractUtmParams("?utm_source=google&utm_medium=cpc&ignore_me=123");
  assert.deepEqual(extracted, {
    utm_source: "google",
    utm_medium: "cpc",
  });

  // syncUtmStorage persists to sessionStorage and retrieves
  const { win } = createMockWindow("?utm_source=newsletter&utm_medium=email");
  const stored = syncUtmStorage(win);
  assert.deepEqual(stored, {
    utm_source: "newsletter",
    utm_medium: "email",
  });
  assert.equal(
    win.sessionStorage.getItem(UTM_STORAGE_KEY),
    JSON.stringify({ utm_source: "newsletter", utm_medium: "email" })
  );

  // Subsequent visit without search query still retrieves from sessionStorage
  const { win: winLater } = createMockWindow("");
  winLater.sessionStorage.setItem(
    UTM_STORAGE_KEY,
    JSON.stringify({ utm_source: "newsletter", utm_medium: "email" })
  );
  const retrieved = syncUtmStorage(winLater);
  assert.deepEqual(retrieved, {
    utm_source: "newsletter",
    utm_medium: "email",
  });
});

test("guard 3: PII-free payload never leaks email, phone, mailto, or tel in params", () => {
  // mailto click
  const mailEvent = classifyClick(
    "mailto:contact@nothanagentic.vn?subject=Đăng%20ký%20demo%20VOMA",
    "Liên hệ"
  );
  assert.ok(mailEvent);
  assert.equal(mailEvent.event, "generate_lead");
  assert.equal(mailEvent.params.method, "email");
  assert.equal(mailEvent.params.label, "Liên hệ");

  const mailParamsString = JSON.stringify(mailEvent.params);
  assert.doesNotMatch(mailParamsString, /@/, "Payload must not contain '@'");
  assert.doesNotMatch(mailParamsString, /nothanagentic/, "Payload must not contain domain");
  assert.doesNotMatch(mailParamsString, /contact/, "Payload must not contain email user");
  assert.doesNotMatch(mailParamsString, /mailto:/i, "Payload must not contain 'mailto:'");

  // tel click
  const telEvent = classifyClick("tel:0983650552", "Liên hệ");
  assert.ok(telEvent);
  assert.equal(telEvent.event, "generate_lead");
  assert.equal(telEvent.params.method, "phone");
  assert.equal(telEvent.params.label, "Liên hệ");

  const telParamsString = JSON.stringify(telEvent.params);
  assert.doesNotMatch(telParamsString, /[0-9]/, "Payload must not contain phone digits");
  assert.doesNotMatch(telParamsString, /tel:/i, "Payload must not contain 'tel:'");

  // zalo click
  const zaloEvent = classifyClick("https://zalo.me/0983650552", "Liên hệ");
  assert.ok(zaloEvent);
  assert.equal(zaloEvent.event, "generate_lead");
  assert.equal(telEvent.params.method, "phone");
  assert.equal(zaloEvent.params.method, "zalo");
  const zaloParamsString = JSON.stringify(zaloEvent.params);
  assert.doesNotMatch(zaloParamsString, /[0-9]/, "Zalo payload must not contain phone digits");

  // app.voma.vn click
  const appEvent = classifyClick("https://app.voma.vn", "Header");
  assert.ok(appEvent);
  assert.equal(appEvent.event, "sign_up_click");
  assert.equal(appEvent.params.label, "Header");
  assert.doesNotMatch(JSON.stringify(appEvent.params), /app\.voma\.vn/, "Payload must not contain href");

  // docs.voma.vn click
  const docsEvent = classifyClick("https://docs.voma.vn", "Hỏi đáp");
  assert.ok(docsEvent);
  assert.equal(docsEvent.event, "view_docs");
  assert.equal(docsEvent.params.label, "Hỏi đáp");
  assert.doesNotMatch(JSON.stringify(docsEvent.params), /docs\.voma\.vn/, "Payload must not contain href");
});

test("section labels match expected specification map", () => {
  assert.equal(SECTION_LABEL["header"], "Header");
  assert.equal(SECTION_LABEL["hero"], "Hero");
  assert.equal(SECTION_LABEL["giai-phap"], "Giải pháp");
  assert.equal(SECTION_LABEL["san-pham"], "Sản phẩm");
  assert.equal(SECTION_LABEL["demo"], "Video");
  assert.equal(SECTION_LABEL["trien-khai"], "Triển khai");
  assert.equal(SECTION_LABEL["ve-voma"], "Về VOMA");
  assert.equal(SECTION_LABEL["hoi-dap"], "Hỏi đáp");
  assert.equal(SECTION_LABEL["lien-he"], "Liên hệ");
  assert.equal(SECTION_LABEL["footer"], "Footer");
});

test("getSectionLabel derives label from closest container", () => {
  assert.equal(getSectionLabel(null), "Trang chủ");

  const mockHeaderAnchor = {
    closest: (sel: string) => (sel.includes("header") ? { tagName: "HEADER", id: "", classList: { contains: () => false } } : null),
  };
  assert.equal(getSectionLabel(mockHeaderAnchor as any), "Header");

  const mockFaqAnchor = {
    closest: (sel: string) => (sel.includes("section") ? { tagName: "SECTION", id: "hoi-dap", classList: { contains: () => false } } : null),
  };
  assert.equal(getSectionLabel(mockFaqAnchor as any), "Hỏi đáp");

  const mockHeroAnchor = {
    closest: (sel: string) => (sel.includes("section") ? { tagName: "SECTION", id: "", classList: { contains: (c: string) => c === "hero" } } : null),
  };
  assert.equal(getSectionLabel(mockHeroAnchor as any), "Hero");
});
