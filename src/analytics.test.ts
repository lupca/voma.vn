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
  updateAppLinks,
  withUtm,
  UTM_STORAGE_KEY,
} from "./analytics.ts";

function createMockWindow(search = "", qsa: Record<string, any[]> = {}) {
  const gtagCalls: any[][] = [];
  const scripts: any[] = [];
  const observers: any[] = [];
  const observed: any[] = [];
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
    querySelectorAll(selector: string) {
      return (qsa[selector] ?? []) as any[];
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
      cb: Function;
      constructor(cb: Function) {
        this.cb = cb;
        observers.push(this);
      }
      observe(el: any) {
        observed.push(el);
      }
      unobserve() {}
      disconnect() {}
    },
  };

  return { win: win as any, scripts, listeners, storage, gtagCalls, observers, observed };
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

// Init with a fake ID and capture every ("event", name, params) call.
function initWithCapture(search = "", qsa: Record<string, any[]> = {}) {
  const m = createMockWindow(search, qsa);
  initAnalytics("G-TEST", m.win);
  const events: { name: string; params: any }[] = [];
  m.win.gtag = (cmd: string, name: string, params: any) => {
    if (cmd === "event") events.push({ name, params });
  };
  return { ...m, events };
}

function anchor(href: string, sectionContainer: any) {
  const a: any = {
    href,
    getAttribute: () => href,
    closest: (sel: string) => (sel === "a" ? a : sectionContainer),
  };
  return a;
}

const sec = (id: string, cls = "") => {
  const el: any = {
    tagName: "SECTION",
    id,
    classList: { contains: (c: string) => c === cls },
    closest: () => el,
  };
  return el;
};

test("config uses beacon transport so clicks survive navigation", () => {
  const m = createMockWindow();
  initAnalytics("G-TEST", m.win);
  const cfg = m.win.dataLayer.filter((a: any) => a[0] === "config");
  assert.equal(cfg.length, 1);
  assert.equal(cfg[0][2].transport_type, "beacon");
});

test("click handler sends label from section map, rewrites app href, no href in params", () => {
  const { listeners, events } = initWithCapture("?utm_source=fb");
  const click = listeners["click"][0];
  const app = anchor("https://app.voma.vn/", sec("hoi-dap"));
  click({ target: app });
  assert.equal(app.href, "https://app.voma.vn/?utm_source=fb");
  const docs = anchor("https://docs.voma.vn/", sec("hoi-dap"));
  click({ target: docs });
  const mail = anchor("mailto:contact@nothanagentic.vn", sec("lien-he"));
  click({ target: mail });
  assert.deepEqual(events, [
    { name: "sign_up_click", params: { label: "Hỏi đáp" } },
    { name: "view_docs", params: { label: "Hỏi đáp" } },
    { name: "generate_lead", params: { method: "email", label: "Liên hệ" } },
  ]);
});

test("updateAppLinks only rewrites with utm and leaves link alone without", () => {
  const link: any = { href: "https://app.voma.vn/" };
  const { win } = createMockWindow("?utm_source=fb", { 'a[href*="app.voma.vn"]': [] });
  (win.document.querySelectorAll as any) = () => [link];
  link.href = "https://app.voma.vn/";
  updateAppLinks(win.document, { utm_source: "fb" });
  assert.equal(link.href, "https://app.voma.vn/?utm_source=fb");
  link.href = "https://app.voma.vn/";
  updateAppLinks(win.document, {});
  assert.equal(link.href, "https://app.voma.vn/");
});

test("view_video fires once per page view", () => {
  const { listeners, events } = initWithCapture();
  const play = listeners["play"][0];
  play({ target: { tagName: "VIDEO" } });
  play({ target: { tagName: "VIDEO" } });
  play({ target: { tagName: "AUDIO" } });
  assert.deepEqual(events, [{ name: "view_video", params: { label: "Video" } }]);
});

test("section_view covers hero (no id) and fires once per section", () => {
  const hero = sec("", "hero");
  const faq = sec("hoi-dap");
  const { observers, observed, events } = initWithCapture("", { "main > section": [hero, faq] });
  assert.deepEqual(observed, [hero, faq]);
  const cb = observers[0].cb;
  cb([{ isIntersecting: true, target: hero }, { isIntersecting: false, target: faq }]);
  cb([{ isIntersecting: true, target: hero }, { isIntersecting: true, target: faq }]);
  assert.deepEqual(events.map((e) => e.params.label), ["Hero", "Hỏi đáp"]);
  assert.ok(events.every((e) => e.name === "section_view"));
});

test("app/docs click sends hit then flushes via pagehide, in that order; navigation is not blocked", () => {
  const m = createMockWindow();
  initAnalytics("G-TEST", m.win);
  const order: string[] = [];
  m.win.gtag = (_c: string, n: string) => order.push(n);
  m.win.dispatchEvent = (e: Event) => order.push(e.type);
  const click = m.listeners["click"][0];
  let prevented = 0;
  const pd = () => prevented++;
  click({ target: anchor("https://docs.voma.vn/", sec("hoi-dap")), button: 0, preventDefault: pd });
  click({ target: anchor("https://app.voma.vn/", sec("hoi-dap")), button: 0, preventDefault: pd });
  click({ target: anchor("mailto:a@b.vn", sec("lien-he")), button: 0, preventDefault: pd });
  assert.deepEqual(order, ["view_docs", "pagehide", "sign_up_click", "pagehide", "generate_lead"]);
  assert.equal(prevented, 0);
});
