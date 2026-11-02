# VVN-001 QA report: GA4 (gtag.js) on voma.vn

Evidence for task VVN-001 (goal c919898b). The source is unchanged since b6ea987; this round adds only this file.
Everything below was run on 2026-11-02 in the task worktree at HEAD b6ea987.

## 1. Parallel-edit check (r:99765081)

```
$ git fetch --all --prune --verbose
POST git-upload-pack (181 bytes)
From https://github.com/lupca/voma.vn
 = [up to date]      agmx-run/3301c7ca-913d-41de-8f3e-b197b727fc3b -> origin/agmx-run/3301c7ca-913d-41de-8f3e-b197b727fc3b
 = [up to date]      agmx-run/3675c7d3-9651-4865-b869-11c89d7a832a -> origin/agmx-run/3675c7d3-9651-4865-b869-11c89d7a832a
 = [up to date]      agmx-run/60d6efa9-0c70-4cee-bdbd-36f3e8655e41 -> origin/agmx-run/60d6efa9-0c70-4cee-bdbd-36f3e8655e41
 = [up to date]      agmx-run/ef5c7ff9-97f6-4741-8d65-fa031ea7a66c -> origin/agmx-run/ef5c7ff9-97f6-4741-8d65-fa031ea7a66c
 = [up to date]      agmx-run/ffaf6802-ad9a-443e-bd27-a55a44f91ee5 -> origin/agmx-run/ffaf6802-ad9a-443e-bd27-a55a44f91ee5
 = [up to date]      main       -> origin/main
exit=0

$ git rev-parse HEAD origin/main
b6ea987b582d774eab1b98c4c8f28f3722e28477
20b30ec083143c1c86e824920a0f77968db28f41

$ git log --oneline HEAD..origin/main -- src/main.tsx src/App.tsx package.json
(no output: main has no commits that are not on this branch)

$ git log --oneline 20b30ec..origin/main
(no output: origin/main is still 20b30ec, the base of this branch)
```

## 2. Checks

```
$ npm run lint

> voma-homepage@0.0.0 lint
> tsc --noEmit
exit=0

$ npm test
ok 1 - guard 1: no-ID no-op adds no script and no dataLayer
ok 2 - guard 2: utm append carries utm_* and is identity without them
ok 3 - guard 3: PII-free payload never leaks email, phone, mailto, or tel in params
ok 4 - section labels match expected specification map
ok 5 - getSectionLabel derives label from closest container
ok 6 - config uses beacon transport so clicks survive navigation
ok 7 - click handler sends label from section map, rewrites app href, no href in params
ok 8 - updateAppLinks only rewrites with utm and leaves link alone without
ok 9 - view_video fires once per page view
ok 10 - section_view covers hero (no id) and fires once per section
ok 11 - app/docs click sends hit then flushes via pagehide, in that order; navigation is not blocked
ok 12 - auxclick: middle button is tracked, right/other aux buttons are not
# tests 12
# pass 12
# fail 0
exit=0

$ npm run build      # VITE_GA_MEASUREMENT_ID unset
✓ built in 1.28s
Prerendered homepage HTML for visitors and crawlers.
SEO checks passed: rendered content, canonical, metadata, schema and crawl assets.
exit=0
```

## 3. dist/index.html before/after

Before means a build of 20b30ec (`git archive 20b30ec` into /tmp/vvn001-base, using the same node_modules) with the ID unset.

```
$ diff /tmp/index.before.html dist/index.html        # this branch, ID unset
89c89
<     <script type="module" crossorigin src="/assets/index-DfANjn6p.js"></script>
---
>     <script type="module" crossorigin src="/assets/index-iZXpV4IG.js"></script>
exit=1 (only the bundle hash line differs)

$ diff /tmp/index.before.html /tmp/index.withid.html  # this branch, VITE_GA_MEASUREMENT_ID=G-TEST123
89c89
<     <script type="module" crossorigin src="/assets/index-DfANjn6p.js"></script>
---
>     <script type="module" crossorigin src="/assets/index-7w_i5U-Z.js"></script>
exit=1 (only the bundle hash line differs; gtag.js is injected at runtime by src/main.tsx, not in the prerendered HTML)

$ grep -rn "G-5YGBCGBLVG" src index.html
(no output, exit=1: the real ID is not hardcoded)
```

## 4. Mutation proof (r:7f8cd4dc)

For each guarded line: sed breaks it in the real src/analytics.ts (the tests import that module), npm test turns red, `git checkout -- src/analytics.ts` restores it, and npm test turns green again. The PII guard covers four branches (email, phone, app, docs), and each branch is mutated on its own.

```
### mutation: no-ID guard removed
$ sed -i 's/if (!measurementId || !measurementId.trim()) {/if (false) {/' src/analytics.ts && git diff -U0 src/analytics.ts
-  if (!measurementId || !measurementId.trim()) {
+  if (false) {
$ npm test   # expect RED
not ok 1 - guard 1: no-ID no-op adds no script and no dataLayer
  error: |-
# pass 11
# fail 1
exit=1
$ git checkout -- src/analytics.ts && npm test   # expect GREEN
# pass 12
# fail 0
exit=0

### mutation: utm append dropped
$ sed -i 's/parsed.searchParams.set(key, utms\[key\]);/\/\/ dropped/' src/analytics.ts && git diff -U0 src/analytics.ts
-      parsed.searchParams.set(key, utms[key]);
+      // dropped
$ npm test   # expect RED
not ok 2 - guard 2: utm append carries utm_* and is identity without them
  error: 'Includes utm_source'
not ok 7 - click handler sends label from section map, rewrites app href, no href in params
  error: |-
not ok 8 - updateAppLinks only rewrites with utm and leaves link alone without
  error: |-
# pass 9
# fail 3
exit=1
$ git checkout -- src/analytics.ts && npm test   # expect GREEN
# pass 12
# fail 0
exit=0

### mutation: PII: email href in label
$ sed -i 's/params: { method: "email", label: sectionLabel }/params: { method: "email", label: trimmed }/' src/analytics.ts && git diff -U0 src/analytics.ts
-      params: { method: "email", label: sectionLabel },
+      params: { method: "email", label: trimmed },
$ npm test   # expect RED
not ok 3 - guard 3: PII-free payload never leaks email, phone, mailto, or tel in params
  error: |-
not ok 7 - click handler sends label from section map, rewrites app href, no href in params
  error: |-
# pass 10
# fail 2
exit=1
$ git checkout -- src/analytics.ts && npm test   # expect GREEN
# pass 12
# fail 0
exit=0

### mutation: PII: phone href in label
$ sed -i 's/params: { method: "phone", label: sectionLabel }/params: { method: "phone", label: trimmed }/' src/analytics.ts && git diff -U0 src/analytics.ts
-      params: { method: "phone", label: sectionLabel },
+      params: { method: "phone", label: trimmed },
$ npm test   # expect RED
not ok 3 - guard 3: PII-free payload never leaks email, phone, mailto, or tel in params
  error: |-
# pass 11
# fail 1
exit=1
$ git checkout -- src/analytics.ts && npm test   # expect GREEN
# pass 12
# fail 0
exit=0

### mutation: PII: app href in sign_up_click label
$ sed -i '/event: "sign_up_click"/{n;s/label: sectionLabel/label: trimmed/}' src/analytics.ts && git diff -U0 src/analytics.ts
-        params: { label: sectionLabel },
+        params: { label: trimmed },
$ npm test   # expect RED
not ok 3 - guard 3: PII-free payload never leaks email, phone, mailto, or tel in params
  error: |-
not ok 7 - click handler sends label from section map, rewrites app href, no href in params
  error: |-
not ok 12 - auxclick: middle button is tracked, right/other aux buttons are not
  error: |-
# pass 9
# fail 3
exit=1
$ git checkout -- src/analytics.ts && npm test   # expect GREEN
# pass 12
# fail 0
exit=0

### mutation: PII: docs href in view_docs label
$ sed -i '/event: "view_docs"/{n;s/label: sectionLabel/label: trimmed/}' src/analytics.ts && git diff -U0 src/analytics.ts
-        params: { label: sectionLabel },
+        params: { label: trimmed },
$ npm test   # expect RED
not ok 3 - guard 3: PII-free payload never leaks email, phone, mailto, or tel in params
  error: |-
not ok 7 - click handler sends label from section map, rewrites app href, no href in params
  error: |-
# pass 10
# fail 2
exit=1
$ git checkout -- src/analytics.ts && npm test   # expect GREEN
# pass 12
# fail 0
exit=0
```

## 5. What is live and what is not

```
$ grep -c 'id="pricing"' dist/index.html
0
$ grep -n "pricing\|Pricing" src/App.tsx src/main.tsx
(no output)
$ grep -rln "ConsultationModal\|InteractiveTaxCalculator\|PricingSection\|components/" src/App.tsx src/main.tsx
(no output)
$ grep -ic zalo src/App.tsx dist/index.html
src/App.tsx:0
dist/index.html:0
$ grep -o 'href="\(mailto\|tel\|https://app\|https://docs\)[^"]*"' dist/index.html | sort | uniq -c
      1 href="https://app.voma.vn"
      2 href="https://docs.voma.vn"
      1 href="mailto:contact@nothanagentic.vn"
      1 href="mailto:contact@nothanagentic.vn?subject=Đăng%20ký%20demo%20VOMA"
      1 href="tel:0983650552"
$ grep -o '<section[^>]*id="[^"]*"' dist/index.html
<section class="section container" id="giai-phap"
<section class="product-section" id="san-pham"
<section class="section container tour-section" id="demo"
<section class="deployment" id="trien-khai"
<section class="section container about" id="ve-voma"
<section class="section container faq-section" id="hoi-dap"
<section class="contact container" id="lien-he"
```

- **view_pricing: not instrumented.** The page has no #pricing section. PricingSection.tsx exists in src/components/, but App and main do not import it and it is not rendered.
- **use_calculator: not instrumented.** The tax calculator is not rendered. InteractiveTaxCalculator.tsx is not imported by App or main.
- **generate_lead method=form: not instrumented.** ConsultationModal is not rendered (not imported by App or main), so there is no form submit to track.
- **generate_lead method=zalo: not instrumented.** The page has no Zalo link (zalo count 0 in App.tsx and dist/index.html).
- **Live:** generate_lead email (2 mailto links, including "Đăng ký demo VOMA"), generate_lead phone (1 tel link), sign_up_click (app.voma.vn), view_docs (docs.voma.vn), view_video (the product video in #demo), and section_view for the main sections (hero plus the 7 ids above).

## 6. Browser run (local Google Chrome via playwright-core, vite preview)

Script: /tmp/vvn001-pw/run.mjs (playwright-core from the global npm install, `channel: "chrome"`, not a package.json dependency). The script intercepts /g/collect and answers 204 without forwarding to Google. It records en, ep.label, ep.method and dl from the query string and from each line of the batched POST body. It searches the raw payloads (URLs and bodies, URL-decoded) for PII. app.voma.vn and docs.voma.vn are stubbed.

Flow: the visitor lands on /?utm_source=fb&utm_medium=cpc&utm_campaign=vvn001, scrolls through every main > section, clicks the play button, pauses and plays the video again (view_video must fire only once), clicks the first mailto link and then a docs link. The visitor then returns to / in the same tab (no utm in the URL, so the link must use sessionStorage) and clicks the app link. A new tab (new session, no utm) checks the plain app link and clicks the tel link.

The tel click comes last, in its own tab, because this headless host has no tel: handler. After a tel click Chrome fires beforeunload and leaves the tab in a pending navigation, so later clicks on that tab do nothing. With mailto, which has a handler, the same sequence works. Every event was also checked on its own (tel alone gives page_view and generate_lead).

The preview server was started on port 4317 and stopped with `kill <pid>`, using the PID that `ss -ltnp` showed for that port (r:0b30a607).

### 6a. VITE_GA_MEASUREMENT_ID=G-TEST123

```
gtag script elements: [{"src":"https://www.googletagmanager.com/gtag/js?id=G-TEST123","async":true}]
app link href (utm landing): https://app.voma.vn/?utm_source=fb&utm_medium=cpc&utm_campaign=vvn001
dataLayer events before docs click: ["section_view","section_view","section_view","section_view","section_view","section_view","section_view","section_view","view_video","generate_lead"]
app link href (same session, no utm in URL): https://app.voma.vn/?utm_source=fb&utm_medium=cpc&utm_campaign=vvn001
app link href (fresh session, no utm): https://app.voma.vn

GA hosts requested: ["https://www.googletagmanager.com/gtag/js","https://www.google-analytics.com/g/collect"]
console errors: []

collect hits (en | ep.label | ep.method | dl):
  page_view |  |  | http://localhost/?utm_source=fb&utm_medium=cpc&utm_campaign=vvn001
  section_view | Hero |  | http://localhost/?utm_source=fb&utm_medium=cpc&utm_campaign=vvn001
  section_view | Giải pháp |  | http://localhost/?utm_source=fb&utm_medium=cpc&utm_campaign=vvn001
  section_view | Sản phẩm |  | http://localhost/?utm_source=fb&utm_medium=cpc&utm_campaign=vvn001
  section_view | Video |  | http://localhost/?utm_source=fb&utm_medium=cpc&utm_campaign=vvn001
  section_view | Triển khai |  | http://localhost/?utm_source=fb&utm_medium=cpc&utm_campaign=vvn001
  section_view | Về VOMA |  | http://localhost/?utm_source=fb&utm_medium=cpc&utm_campaign=vvn001
  section_view | Hỏi đáp |  | http://localhost/?utm_source=fb&utm_medium=cpc&utm_campaign=vvn001
  section_view | Liên hệ |  | http://localhost/?utm_source=fb&utm_medium=cpc&utm_campaign=vvn001
  view_video | Video |  | http://localhost/?utm_source=fb&utm_medium=cpc&utm_campaign=vvn001
  generate_lead | Liên hệ | email | http://localhost/?utm_source=fb&utm_medium=cpc&utm_campaign=vvn001
  view_docs | Hỏi đáp |  | http://localhost/?utm_source=fb&utm_medium=cpc&utm_campaign=vvn001
  page_view |  |  | http://localhost/
  section_view | Hero |  | http://localhost/
  sign_up_click | Header |  | http://localhost/
  page_view |  |  | http://localhost/
  section_view | Hero |  | http://localhost/
  generate_lead | Liên hệ | phone | http://localhost/
  section_view | Liên hệ |  | http://localhost/

page_view count: 3 (3 page loads: utm landing, same-tab reload, new tab)
payload contains "contact@nothanagentic.vn": false
payload contains "nothanagentic": false
payload contains "0983650552": false
payload contains "mailto:": false
payload contains "tel:": false
```

Results: exactly one async gtag script with id=G-TEST123. Exactly one page_view per page load (3 loads, 3 page_views; no manual page_view). The page_view dl keeps the landing utm query. Every event has its label. Payloads contain no email address, no phone number, and no mailto: or tel:. With utm on landing the app link carries the utm params, also after returning without them in the same session. Without utm it stays exactly https://app.voma.vn. No console errors.

### 6b. VITE_GA_MEASUREMENT_ID unset

```
gtag script elements: []
app link href (utm landing): https://app.voma.vn/?utm_source=fb&utm_medium=cpc&utm_campaign=vvn001
dataLayer events before docs click: []
app link href (same session, no utm in URL): https://app.voma.vn/?utm_source=fb&utm_medium=cpc&utm_campaign=vvn001
app link href (fresh session, no utm): https://app.voma.vn

GA hosts requested: []
console errors: []

collect hits (en | ep.label | ep.method | dl):

page_view count: 0 (3 page loads: utm landing, same-tab reload, new tab)
payload contains "contact@nothanagentic.vn": false
payload contains "nothanagentic": false
payload contains "0983650552": false
payload contains "mailto:": false
payload contains "tel:": false
```

Results: no gtag script, no requests to googletagmanager.com or google-analytics.com, and no console errors. The UTM carry-over to app.voma.vn still works, because it does not depend on the ID.
