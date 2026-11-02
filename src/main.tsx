import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import App from "./App.tsx";
import { initAnalytics } from "./analytics.ts";
import "./index.css";

initAnalytics(import.meta.env.VITE_GA_MEASUREMENT_ID, window);

const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
  </StrictMode>
);
if (root.hasChildNodes()) hydrateRoot(root, app);
else createRoot(root).render(app);
