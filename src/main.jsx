import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// Clear the former appearance preference without touching account or workspace data.
document.documentElement.classList.remove("dark");
document.documentElement.style.colorScheme = "only light";
try {
  localStorage.removeItem("hospoHubTheme");
} catch { /* Storage is optional. The site always uses its light appearance. */ }

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><App /></React.StrictMode>,
);
