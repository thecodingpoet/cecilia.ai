import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "react-medium-image-zoom/dist/styles.css";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
