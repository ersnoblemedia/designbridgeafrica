"use client";

export interface TelemetryEvent {
  id: string;
  timestamp: string;
  type: "error" | "unhandledrejection" | "warning" | "info" | "event";
  message: string;
  stack?: string;
  source?: string;
  lineno?: number;
  colno?: number;
  metadata?: Record<string, any>;
}

// In-Memory list of events, synced to localStorage for session survivability
let telemetryLogs: TelemetryEvent[] = [];
let listeners: ((events: TelemetryEvent[]) => void)[] = [];

// Base Config
const SENTRY_DSN_KEY = "NEXT_PUBLIC_SENTRY_DSN";

export const getSentryDSN = (): string | null => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_SENTRY_DSN || (window as any).__SENTRY_DSN__ || null;
  }
  return process.env.NEXT_PUBLIC_SENTRY_DSN || null;
};

// Sync logs from storage on load
if (typeof window !== "undefined") {
  try {
    const raw = localStorage.getItem("designbridge_telemetry");
    if (raw) {
      telemetryLogs = JSON.parse(raw);
    }
  } catch (err) {
    console.warn("Failed to restore telemetry log cache:", err);
  }
}

const persistAndNotify = () => {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("designbridge_telemetry", JSON.stringify(telemetryLogs.slice(-100))); // Cap at 100 for safety
    } catch (err) {
      console.warn("Telemetry storage limit:", err);
    }
  }
  listeners.forEach((listener) => listener([...telemetryLogs]));
};

// Main Sentry / Error Injection Core
export const Telemetry = {
  subscribe(listener: (events: TelemetryEvent[]) => void) {
    listeners.push(listener);
    listener([...telemetryLogs]);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  },

  getLogs(): TelemetryEvent[] {
    return [...telemetryLogs];
  },

  clearLogs() {
    telemetryLogs = [];
    persistAndNotify();
  },

  log(event: Omit<TelemetryEvent, "id" | "timestamp">) {
    const newEvent: TelemetryEvent = {
      ...event,
      id: `ev_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      timestamp: new Date().toISOString(),
    };

    // Output to developer console
    if (event.type === "error" || event.type === "unhandledrejection") {
      console.error(`[SENTRY TELEMETRY INTERCEPT] 🚨`, event.message, event.stack || "");
    } else if (event.type === "warning") {
      console.warn(`[SENTRY TELEMETRY INTERCEPT] ⚠️`, event.message);
    } else {
      console.log(`[SENTRY TELEMETRY INTERCEPT] ℹ️`, event.message);
    }

    // Capture standard logs
    telemetryLogs.unshift(newEvent);
    // Limit to 100 items
    if (telemetryLogs.length > 100) {
      telemetryLogs.pop();
    }

    persistAndNotify();

    // Trigger Sentry official API ingestion mock or direct post
    this.sendToSentry(newEvent);
  },

  sendToSentry(event: TelemetryEvent) {
    const dsn = getSentryDSN();
    if (!dsn) {
      // No Sentry DSN loaded; operates in resilient sandbox mock mode
      return;
    }

    try {
      // Parse DSN credentials (e.g. https://public@sentry.io/123456)
      // Standard format: https://<key>@<host>/<project_id>
      const match = dsn.match(/https:\/\/([^@]+)@([^/]+)\/(\d+)/);
      if (!match) return;

      const [, publicKey, host, projectId] = match;
      const sentryUrl = `https://${host}/api/${projectId}/store/?sentry_key=${publicKey}&sentry_version=7`;

      fetch(sentryUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          event_id: event.id.replace("ev_", "").padEnd(32, "0").substr(0, 32),
          timestamp: event.timestamp,
          sdk: {
            name: "designbridge-africa-telemetry-sdk",
            version: "1.0.0",
          },
          level: event.type === "error" ? "error" : "info",
          transaction: typeof window !== "undefined" ? window.location.pathname : "/",
          exception: {
            values: [
              {
                type: event.type === "unhandledrejection" ? "UnhandledRejection" : "ClientRuntimeError",
                value: event.message,
                stacktrace: event.stack
                  ? {
                      frames: event.stack.split("\n").map((line) => ({
                        filename: event.source || "index.tsx",
                        function: line.trim(),
                      })),
                    }
                  : undefined,
              },
            ],
          },
          extra: event.metadata || {},
        }),
      }).catch((fetchErr) => {
        // Safe degrade silently on network restrictions or mock limits
        console.debug("Sentry ingestion delivery deferred:", fetchErr);
      });
    } catch (err) {
      console.warn("Failed Sentry delivery build:", err);
    }
  },

  // Facilitates simple UI-based test simulation triggers
  triggerSimulatedError(msg?: string) {
    const fallbackMsg = `Simulation Error triggered at ${new Date().toLocaleTimeString()} by Testing Officer. Code dimensions validated.`;
    const err = new Error(msg || fallbackMsg);
    
    // Explicit trigger simulation through Telemetry Capture
    this.log({
      type: "error",
      message: err.message,
      stack: err.stack,
      source: "SentryTelemetrySettingsView.tsx",
      metadata: {
        simulationFlag: true,
        userTriggered: true,
        environment: "AI Studio Production Sandbox Sandbox"
      }
    });
  }
};

// Subscribe to global uncaught error events automatically when instantiated
if (typeof window !== "undefined") {
  window.addEventListener("error", (event) => {
    Telemetry.log({
      type: "error",
      message: event.message || "Uncaught runtime exception captured",
      stack: event.error?.stack || "",
      source: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      metadata: {
        userAgent: navigator.userAgent,
        url: window.location.href,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
      }
    });
  });

  window.addEventListener("unhandledrejection", (event) => {
    Telemetry.log({
      type: "unhandledrejection",
      message: event.reason?.message || event.reason || "Unhandled Promise Rejection caught",
      stack: event.reason?.stack || "",
      metadata: {
        reason: String(event.reason),
        url: window.location.href,
      }
    });
  });
}
