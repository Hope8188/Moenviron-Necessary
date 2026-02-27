import { createRoot } from 'react-dom/client';
import App from "./App.tsx";
import "./index.css";

interface ErrorPayload {
  type: string;
  error: {
    message: string;
    stack?: string;
    filename?: string;
    lineno?: number;
    colno?: number;
    source: string;
  };
  timestamp: number;
}

if (typeof window !== "undefined") {
  const sendToParent = (data: ErrorPayload) => {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(data, "*");
      }
    } catch {
      // Silently fail if postMessage is not available
    }
  };

  window.addEventListener("error", (event) => {
    sendToParent({
      type: "ERROR_CAPTURED",
      error: {
        message: event.message,
        stack: event.error?.stack,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        source: "window.onerror",
      },
      timestamp: Date.now(),
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason as { message?: string; stack?: string } | string | null;
    const message =
      typeof reason === "object" && reason?.message
        ? String(reason.message)
        : String(reason);
    const stack = typeof reason === "object" ? reason?.stack : undefined;

    sendToParent({
      type: "ERROR_CAPTURED",
      error: {
        message,
        stack,
        filename: undefined,
        lineno: undefined,
        colno: undefined,
        source: "unhandledrejection",
      },
      timestamp: Date.now(),
    });
  });
}

console.log("Mounting React app...");
createRoot(document.getElementById("root")!).render(<App />);
