import { readFileSync, writeFileSync } from "node:fs";
import { createElement } from "react";
import { renderToString } from "react-dom/server";
import App from "../src/App";

const file = new URL("../dist/index.html", import.meta.url);
const template = readFileSync(file, "utf8");
const marker = '<div id="root"></div>';
if (!template.includes(marker)) throw new Error("Missing prerender root");
const markup = renderToString(createElement(App));
writeFileSync(file, template.replace(marker, `<div id="root">${markup}</div>`));
console.log("Prerendered homepage HTML for visitors and crawlers.");
