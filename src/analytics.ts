export const UTM_STORAGE_KEY = "voma_utm_params";

export const SECTION_LABEL: Record<string, string> = {
  header: "Header",
  hero: "Hero",
  "giai-phap": "Giải pháp",
  "san-pham": "Sản phẩm",
  demo: "Video",
  "trien-khai": "Triển khai",
  "ve-voma": "Về VOMA",
  "hoi-dap": "Hỏi đáp",
  "lien-he": "Liên hệ",
  footer: "Footer",
};

export interface AnalyticsEvent {
  event: string;
  params: Record<string, string>;
}

let isInitialized = false;

export function resetAnalyticsStateForTesting(): void {
  isInitialized = false;
}

export function extractUtmParams(search: string): Record<string, string> {
  if (!search) return {};
  const query = search.startsWith("?") ? search.slice(1) : search;
  const params = new URLSearchParams(query);
  const utms: Record<string, string> = {};
  for (const [key, val] of params.entries()) {
    if (key.startsWith("utm_") && val.trim().length > 0) {
      utms[key] = val;
    }
  }
  return utms;
}

export function syncUtmStorage(win: Window): Record<string, string> {
  try {
    const fromUrl = extractUtmParams(win.location ? win.location.search : "");
    if (Object.keys(fromUrl).length > 0) {
      if (win.sessionStorage) {
        win.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fromUrl));
      }
      return fromUrl;
    }
    if (win.sessionStorage) {
      const saved = win.sessionStorage.getItem(UTM_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && typeof parsed === "object") {
          return parsed as Record<string, string>;
        }
      }
    }
  } catch {
    // Ignore storage errors (sandboxed iframe or private browsing)
  }
  return {};
}

export function withUtm(urlStr: string, utms: Record<string, string>): string {
  const keys = Object.keys(utms);
  if (!urlStr || keys.length === 0) return urlStr;
  try {
    const isAbsolute = /^https?:\/\//i.test(urlStr);
    const parsed = new URL(urlStr, "https://voma.vn");
    for (const key of keys) {
      parsed.searchParams.set(key, utms[key]);
    }
    if (isAbsolute) {
      return parsed.toString();
    }
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    return urlStr;
  }
}

export function updateAppLinks(doc: Document, utms: Record<string, string>): void {
  if (Object.keys(utms).length === 0) return;
  const links = doc.querySelectorAll<HTMLAnchorElement>('a[href*="app.voma.vn"]');
  links.forEach((link) => {
    link.href = withUtm(link.href, utms);
  });
}

export function getSectionLabel(element: Element | null): string {
  if (!element) return "Trang chủ";
  const container = element.closest("header, footer, section");
  if (!container) return "Trang chủ";
  const tag = container.tagName.toLowerCase();
  if (tag === "header") return SECTION_LABEL.header;
  if (tag === "footer") return SECTION_LABEL.footer;
  if (container.id && SECTION_LABEL[container.id]) {
    return SECTION_LABEL[container.id];
  }
  if (container.classList && container.classList.contains("hero")) {
    return SECTION_LABEL.hero;
  }
  return "Trang chủ";
}

export function classifyClick(
  href: string,
  sectionLabel: string = "Trang chủ"
): AnalyticsEvent | null {
  if (!href) return null;
  const trimmed = href.trim();
  if (trimmed.startsWith("mailto:")) {
    return {
      event: "generate_lead",
      params: { method: "email", label: sectionLabel },
    };
  }
  if (trimmed.startsWith("tel:")) {
    return {
      event: "generate_lead",
      params: { method: "phone", label: sectionLabel },
    };
  }
  try {
    const url = new URL(trimmed, "https://voma.vn");
    if (url.hostname === "app.voma.vn") {
      return {
        event: "sign_up_click",
        params: { label: sectionLabel },
      };
    }
    if (url.hostname === "docs.voma.vn") {
      return {
        event: "view_docs",
        params: { label: sectionLabel },
      };
    }
  } catch {
    // Ignore URL parse failure
  }
  return null;
}

export function trackEvent(
  win: Window,
  eventName: string,
  params: Record<string, string>
): void {
  if (typeof win.gtag === "function") win.gtag("event", eventName, params);
}

export function initAnalytics(
  measurementId?: string,
  win: Window = typeof window !== "undefined" ? window : ({} as Window)
): void {
  if (isInitialized) return;
  isInitialized = true;

  if (!win || !win.document) return;

  const utms = syncUtmStorage(win);
  updateAppLinks(win.document, utms);

  if (!measurementId || !measurementId.trim()) {
    return;
  }

  const cleanId = measurementId.trim();

  win.dataLayer = win.dataLayer || [];
  win.gtag =
    win.gtag ||
    function () {
      win.dataLayer!.push(arguments);
    };

  win.gtag("js", new Date());
  // beacon transport so click events survive same-tab navigation to app/docs
  win.gtag("config", cleanId, { transport_type: "beacon" });

  const script = win.document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(cleanId)}`;
  win.document.head.appendChild(script);

  const onLinkClick = (event: MouseEvent) => {
    // Chrome fires 'auxclick' (not 'click') for the middle button; ignore other aux buttons.
    if (event.type === "auxclick" && event.button !== 1) return;
    const anchor = (event.target as Element | null)?.closest("a");
    if (!anchor) return;
    const href = anchor.getAttribute("href") || "";
    const sectionLabel = getSectionLabel(anchor);
    const classified = classifyClick(href, sectionLabel);
    if (classified) {
      if (classified.event === "sign_up_click" && Object.keys(utms).length > 0) {
        anchor.href = withUtm(anchor.href, utms);
      }
      trackEvent(win, classified.event, classified.params);
      // gtag batches hits ~5s; a same-tab navigation to app/docs would drop them.
      // GA4 flushes its queue on pagehide, so fire it now (hit goes out as a keepalive POST).
      // ponytail: relies on gtag.js internals (verified on the wire); other pagehide listeners also run.
      // Drop it if GA stops flushing on pagehide; transport_type beacon is the fallback.
      if (classified.event === "sign_up_click" || classified.event === "view_docs") {
        win.dispatchEvent?.(new Event("pagehide"));
      }
    }
  };
  win.document.addEventListener("click", onLinkClick);
  win.document.addEventListener("auxclick", onLinkClick);

  let videoTracked = false;
  win.document.addEventListener(
    "play",
    (event: Event) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        target.tagName &&
        target.tagName.toLowerCase() === "video"
      ) {
        if (!videoTracked) {
          videoTracked = true;
          trackEvent(win, "view_video", { label: "Video" });
        }
      }
    },
    true
  );

  if (typeof win.IntersectionObserver === "function") {
    const seenSections = new Set<Element>();
    const observer = new win.IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !seenSections.has(entry.target)) {
            seenSections.add(entry.target);
            trackEvent(win, "section_view", { label: getSectionLabel(entry.target) });
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.2 }
    );

    win.document
      .querySelectorAll("main > section")
      .forEach((sec) => observer.observe(sec));
  }
}
