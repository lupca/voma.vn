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

interface MockElement {
  tagName: string;
  id: string;
  href: string;
  attributes: Record<string, string>;
  parentElement: MockElement | null;
  classList: {
    contains: (cls: string) => boolean;
    add: (cls: string) => void;
  };
  getAttribute: (name: string) => string | null;
  setAttribute: (name: string, val: string) => void;
  closest: (selector: string) => MockElement | null;
  children: MockElement[];
  appendChild: (child: MockElement) => MockElement;
  querySelectorAll: (selector: string) => MockElement[];
}

function createMockElement(
  tag: string,
  attrs: Record<string, string> = {},
  parent: MockElement | null = null
): MockElement {
  const children: MockElement[] = [];
  const classListSet = new Set((attrs.class || "").split(/\s+/).filter(Boolean));
  const elem: MockElement = {
    tagName: tag.toUpperCase(),
    id: attrs.id || "",
    href: attrs.href || "",
    attributes: { ...attrs },
    parentElement: parent,
    classList: {
      contains: (cls: string) => classListSet.has(cls),
      add: (cls: string) => classListSet.add(cls),
    },
    getAttribute(name: string) {
      if (name === "href") return elem.href;
      if (name === "id") return elem.id;
      return elem.attributes[name] ?? null;
    },
    setAttribute(name: string, val: string) {
      elem.attributes[name] = val;
      if (name === "href") elem.href = val;
      if (name === "id") elem.id = val;
    },
    closest(selector: string) {
      const parts = selector.split(",").map((s) => s.trim().toUpperCase());
      let cur: MockElement | null = elem;
      while (cur) {
        if (parts.includes(cur.tagName)) return cur;
        cur = cur.parentElement;
      }
      return null;
    },
    children,
    appendChild(child: MockElement) {
      child.parentElement = elem;
      children.push(child);
      return child;
    },
    querySelectorAll(selector: string): MockElement[] {
      const results: MockElement[] = [];
      function walk(node: MockElement) {
        for (const ch of node.children) {
          if (selector === "main > section") {
            if (node.tagName === "MAIN" && ch.tagName === "SECTION") {
              results.push(ch);
            }
          } else if (selector.includes('a[href*="app.voma.vn"]')) {
            if (ch.tagName === "A" && ch.href.includes("app.voma.vn")) {
              results.push(ch);
            }
          }
          walk(ch);
        }
      }
      walk(elem);
      return results;
    },
  };
  return elem;
}

function createMockWindow(search = "") {
  const scripts: any[] = [];
  const listeners: Record<string, Function[]> = {};
  const storage: Record<string, string> = {};

  let observerCallback: Function | null = null;
  const observedElements: any[] = [];
  const unobservedElements: any[] = [];

  const head = {
    appendChild(elem: any) {
      scripts.push(elem);
      return elem;
    },
  };

  const body = createMockElement("body");
  const main = createMockElement("main", { id: "main" }, body);
  body.appendChild(main);

  const doc = {
    head,
    body,
    createElement(tag: string) {
      return createMockElement(tag);
    },
    querySelectorAll(selector: string) {
      return body.querySelectorAll(selector);
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

  class MockIntersectionObserver {
    constructor(cb: Function) {
      observerCallback = cb;
    }
    observe(el: any) {
      observedElements.push(el);
    }
    unobserve(el: any) {
      unobservedElements.push(el);
    }
    disconnect() {}
  }

  const win: any = {
    location: { search },
    document: doc,
    sessionStorage,
    addEventListener(event: string, cb: Function) {
      listeners[event] = listeners[event] || [];
      listeners[event].push(cb);
    },
    IntersectionObserver: MockIntersectionObserver,
  };

  return {
    win: win as Window,
    scripts,
    listeners,
    storage,
    body,
    main,
    getObserverCallback: () => observerCallback,
    observedElements,
    unobservedElements,
  };
}

beforeEach(() => {
  resetAnalyticsStateForTesting();
});

test("guard 1: no-ID no-op adds no script and no dataLayer", () => {
  // Empty string measurement ID
  const { win: winEmpty, scripts: scriptsEmpty } = createMockWindow();
  initAnalytics("", winEmpty);
  assert.equal(scriptsEmpty.length, 0, "No script tag added for empty ID");
  assert.equal((winEmpty as any).dataLayer, undefined, "No dataLayer created for empty ID");
  assert.equal((winEmpty as any).gtag, undefined, "No gtag function created for empty ID");

  // Undefined measurement ID
  resetAnalyticsStateForTesting();
  const { win: winUndef, scripts: scriptsUndef } = createMockWindow();
  initAnalytics(undefined, winUndef);
  assert.equal(scriptsUndef.length, 0, "No script tag added for undefined ID");
  assert.equal((winUndef as any).dataLayer, undefined, "No dataLayer created for undefined ID");

  // Whitespace-only measurement ID
  resetAnalyticsStateForTesting();
  const { win: winSpace, scripts: scriptsSpace } = createMockWindow();
  initAnalytics("   ", winSpace);
  assert.equal(scriptsSpace.length, 0, "No script tag added for whitespace ID");
  assert.equal((winSpace as any).dataLayer, undefined, "No dataLayer created for whitespace ID");

  // Valid ID creates script and dataLayer with transport_type beacon
  resetAnalyticsStateForTesting();
  const { win: winValid, scripts: scriptsValid } = createMockWindow();
  initAnalytics("G-TEST12345", winValid);
  assert.equal(scriptsValid.length, 1, "Exactly one script tag added for valid ID");
  assert.equal((scriptsValid[0] as any).async, true, "Script element must be async");
  assert.match(
    (scriptsValid[0] as any).src,
    /^https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-TEST12345$/,
    "Script src matches GA4 gtag URL"
  );
  assert.ok(Array.isArray((winValid as any).dataLayer), "dataLayer must be an array");
  assert.equal(typeof (winValid as any).gtag, "function", "gtag must be a function");

  // Check config call includes { transport_type: 'beacon' }
  const dataLayer = (winValid as any).dataLayer;
  const configCall = dataLayer.find(
    (item: any[]) => item[0] === "config" && item[1] === "G-TEST12345"
  );
  assert.ok(configCall, "gtag config called with ID");
  assert.deepEqual(
    configCall[2],
    { transport_type: "beacon" },
    "gtag config must set transport_type to beacon"
  );
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

  // updateAppLinks updates anchors
  const header = createMockElement("header");
  const appLink = createMockElement("a", { href: "https://app.voma.vn" }, header);
  header.appendChild(appLink);
  const fakeDoc = {
    querySelectorAll: () => [appLink],
  };
  updateAppLinks(fakeDoc as any, { utm_source: "fb", utm_medium: "cpc" });
  assert.ok(appLink.href.includes("utm_source=fb"), "updateAppLinks appends utm_source");
  assert.ok(appLink.href.includes("utm_medium=cpc"), "updateAppLinks appends utm_medium");

  // updateAppLinks with empty utm does not touch href
  updateAppLinks(fakeDoc as any, {});
  assert.ok(appLink.href.includes("utm_source=fb"), "empty utm preserves existing href");
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

test("click handler updates app link href and dispatches trackEvent with clean label", () => {
  const { win, listeners } = createMockWindow("?utm_source=fb&utm_medium=cpc");
  initAnalytics("G-TEST12345", win);

  const clickHandler = listeners["click"]?.[0];
  assert.equal(typeof clickHandler, "function", "Click listener registered");

  const trackedEvents: any[] = [];
  (win as any).gtag = function (action: string, eventName: string, params: any) {
    if (action === "event") {
      trackedEvents.push({ eventName, params });
    }
  };

  // 1. Click on app.voma.vn inside header
  const header = createMockElement("header");
  const appLink = createMockElement("a", { href: "https://app.voma.vn" }, header);
  header.appendChild(appLink);

  clickHandler({ target: appLink });

  assert.ok(
    appLink.href.includes("utm_source=fb"),
    "Click handler rewrites anchor href with utm params"
  );
  assert.equal(trackedEvents.length, 1);
  assert.equal(trackedEvents[0].eventName, "sign_up_click");
  assert.equal(trackedEvents[0].params.label, "Header");
  assert.notEqual(
    trackedEvents[0].params.label,
    appLink.href,
    "Label must never be the href string"
  );

  // 2. Click on docs.voma.vn inside FAQ section
  const faqSection = createMockElement("section", { id: "hoi-dap" });
  const docsLink = createMockElement("a", { href: "https://docs.voma.vn" }, faqSection);
  faqSection.appendChild(docsLink);

  clickHandler({ target: docsLink });

  assert.equal(trackedEvents.length, 2);
  assert.equal(trackedEvents[1].eventName, "view_docs");
  assert.equal(trackedEvents[1].params.label, "Hỏi đáp");
  assert.notEqual(
    trackedEvents[1].params.label,
    docsLink.href,
    "Docs label must never be the href string"
  );

  // 3. Click on mailto in contact section
  const contactSection = createMockElement("section", { id: "lien-he" });
  const mailLink = createMockElement(
    "a",
    { href: "mailto:contact@nothanagentic.vn?subject=Đăng%20ký%20demo%20VOMA" },
    contactSection
  );
  contactSection.appendChild(mailLink);

  clickHandler({ target: mailLink });

  assert.equal(trackedEvents.length, 3);
  assert.equal(trackedEvents[2].eventName, "generate_lead");
  assert.equal(trackedEvents[2].params.method, "email");
  assert.equal(trackedEvents[2].params.label, "Liên hệ");
  assert.notEqual(trackedEvents[2].params.label, mailLink.href);
  assert.doesNotMatch(JSON.stringify(trackedEvents[2].params), /@/);

  // 4. Click on tel in contact section
  const telLink = createMockElement("a", { href: "tel:0983650552" }, contactSection);
  contactSection.appendChild(telLink);

  clickHandler({ target: telLink });

  assert.equal(trackedEvents.length, 4);
  assert.equal(trackedEvents[3].eventName, "generate_lead");
  assert.equal(trackedEvents[3].params.method, "phone");
  assert.equal(trackedEvents[3].params.label, "Liên hệ");
  assert.notEqual(trackedEvents[3].params.label, telLink.href);
  assert.doesNotMatch(JSON.stringify(trackedEvents[3].params), /[0-9]/);
});

test("video play listener tracks view_video exactly once per page view", () => {
  const { win, listeners } = createMockWindow();
  initAnalytics("G-TEST12345", win);

  const playHandler = listeners["play"]?.[0];
  assert.equal(typeof playHandler, "function", "Play listener registered");

  const trackedEvents: any[] = [];
  (win as any).gtag = function (action: string, eventName: string, params: any) {
    if (action === "event") {
      trackedEvents.push({ eventName, params });
    }
  };

  const video = createMockElement("video");

  // First play triggers view_video
  playHandler({ target: video });
  assert.equal(trackedEvents.length, 1, "First play tracks view_video");
  assert.equal(trackedEvents[0].eventName, "view_video");
  assert.equal(trackedEvents[0].params.label, "Video");

  // Second play does NOT trigger view_video (once-guard)
  playHandler({ target: video });
  assert.equal(trackedEvents.length, 1, "Second play must not re-trigger view_video");

  // Play on non-video element does not trigger event
  const div = createMockElement("div");
  playHandler({ target: div });
  assert.equal(trackedEvents.length, 1, "Play on non-video does not trigger view_video");
});

test("IntersectionObserver tracks section_view for main > section including hero", () => {
  const { win, main, getObserverCallback, unobservedElements } = createMockWindow();

  // Create main > section elements matching App.tsx
  const heroSection = createMockElement("section", { class: "hero container" }, main);
  const giaiPhapSection = createMockElement("section", { class: "section container", id: "giai-phap" }, main);
  const sanPhamSection = createMockElement("section", { class: "product-section", id: "san-pham" }, main);
  const demoSection = createMockElement("section", { class: "section container tour-section", id: "demo" }, main);
  const trienKhaiSection = createMockElement("section", { class: "deployment", id: "trien-khai" }, main);
  const veVomaSection = createMockElement("section", { class: "section container about", id: "ve-voma" }, main);
  const hoiDapSection = createMockElement("section", { class: "section container faq-section", id: "hoi-dap" }, main);
  const lienHeSection = createMockElement("section", { class: "contact container", id: "lien-he" }, main);

  main.appendChild(heroSection);
  main.appendChild(giaiPhapSection);
  main.appendChild(sanPhamSection);
  main.appendChild(demoSection);
  main.appendChild(trienKhaiSection);
  main.appendChild(veVomaSection);
  main.appendChild(hoiDapSection);
  main.appendChild(lienHeSection);

  initAnalytics("G-TEST12345", win);

  const observerCb = getObserverCallback();
  assert.equal(typeof observerCb, "function", "IntersectionObserver callback registered");

  const trackedEvents: any[] = [];
  (win as any).gtag = function (action: string, eventName: string, params: any) {
    if (action === "event") {
      trackedEvents.push({ eventName, params });
    }
  };

  // Simulate Hero entering viewport (class='hero container', no id)
  observerCb!([
    { isIntersecting: true, target: heroSection },
  ]);
  assert.equal(trackedEvents.length, 1);
  assert.equal(trackedEvents[0].eventName, "section_view");
  assert.equal(trackedEvents[0].params.label, "Hero", "Hero section view uses label 'Hero'");
  assert.ok(unobservedElements.includes(heroSection), "Hero section unobserved after intersecting");

  // Re-intersection of Hero must NOT fire again
  observerCb!([
    { isIntersecting: true, target: heroSection },
  ]);
  assert.equal(trackedEvents.length, 1, "Duplicate intersection does not fire section_view");

  // Simulate remaining sections intersecting
  observerCb!([
    { isIntersecting: true, target: giaiPhapSection },
    { isIntersecting: true, target: sanPhamSection },
    { isIntersecting: true, target: demoSection },
    { isIntersecting: true, target: trienKhaiSection },
    { isIntersecting: true, target: veVomaSection },
    { isIntersecting: true, target: hoiDapSection },
    { isIntersecting: true, target: lienHeSection },
  ]);

  assert.equal(trackedEvents.length, 8);
  assert.equal(trackedEvents[1].params.label, "Giải pháp");
  assert.equal(trackedEvents[2].params.label, "Sản phẩm");
  assert.equal(trackedEvents[3].params.label, "Video");
  assert.equal(trackedEvents[4].params.label, "Triển khai");
  assert.equal(trackedEvents[5].params.label, "Về VOMA");
  assert.equal(trackedEvents[6].params.label, "Hỏi đáp");
  assert.equal(trackedEvents[7].params.label, "Liên hệ");
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

test("getSectionLabel derives label safely without leaking raw unmapped DOM ids", () => {
  assert.equal(getSectionLabel(null), "Trang chủ");

  const mockHeaderAnchor = {
    closest: (sel: string) =>
      sel.includes("header")
        ? { tagName: "HEADER", id: "", classList: { contains: () => false } }
        : null,
  };
  assert.equal(getSectionLabel(mockHeaderAnchor as any), "Header");

  const mockFaqAnchor = {
    closest: (sel: string) =>
      sel.includes("section")
        ? { tagName: "SECTION", id: "hoi-dap", classList: { contains: () => false } }
        : null,
  };
  assert.equal(getSectionLabel(mockFaqAnchor as any), "Hỏi đáp");

  const mockHeroAnchor = {
    closest: (sel: string) =>
      sel.includes("section")
        ? { tagName: "SECTION", id: "", classList: { contains: (c: string) => c === "hero" } }
        : null,
  };
  assert.equal(getSectionLabel(mockHeroAnchor as any), "Hero");

  // Unmapped id should NOT return the raw DOM id, but "Trang chủ"
  const mockUnknownAnchor = {
    closest: (sel: string) =>
      sel.includes("section")
        ? { tagName: "SECTION", id: "random-unmapped-id-12345", classList: { contains: () => false } }
        : null,
  };
  assert.equal(
    getSectionLabel(mockUnknownAnchor as any),
    "Trang chủ",
    "Unmapped section id must never return raw DOM id"
  );
});
