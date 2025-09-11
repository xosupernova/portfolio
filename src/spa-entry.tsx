// SPA entrypoint for static Cloudflare Pages deployment.
// Mounts the TanStack Router app client-side (no SSR shell HTML wrapping).

import * as Sentry from '@sentry/react';
import { RouterProvider } from '@tanstack/react-router';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { createRouter } from './router';
// Ensure base styles (normally injected via head on SSR) are loaded.
import './styles/app.css';

const router = createRouter();

// Feature flags (string envs)
const enableSentry = (import.meta.env.VITE_ENABLE_SENTRY || 'false') === 'true';
const enableReplay = (import.meta.env.VITE_ENABLE_SENTRY_REPLAY || 'false') === 'true';
// Initialize Sentry lazily to avoid interfering with early user interaction
const dsn = import.meta.env.VITE_SENTRY_DSN as string | undefined;
if (enableSentry && dsn) {
  // Use idle callback where available, fallback to timeout
  const init = () => {
    const env = (import.meta.env.VITE_APP_ENV || 'production') as string;
    // Baseline sample rates (lower in production for cost control)
    const baseTraceRate = env === 'production' ? 0.05 : 0.3;
    const baseErrorReplayRate = 1.0;
    const baseSessionReplayRate = enableReplay ? (env === 'production' ? 0.02 : 0.1) : 0.0;
    Sentry.init({
      dsn,
      integrations: [
        Sentry.browserTracingIntegration(),
        ...(enableReplay ? [Sentry.replayIntegration()] : []),
      ],
      // Simple static rates; for granular control use tracesSampler
      tracesSampleRate: baseTraceRate,
      replaysSessionSampleRate: baseSessionReplayRate,
      replaysOnErrorSampleRate: enableReplay ? baseErrorReplayRate : 0.0,
      release: import.meta.env.VITE_COMMIT_SHA || undefined,
      environment: env,
      // Advanced filtering: drop noisy known benign errors
      beforeSend(event, hint) {
        const msg = event.message || hint?.originalException?.toString() || '';
        if (/ResizeObserver loop limit exceeded/i.test(msg)) return null;
        if (/NetworkError when attempting to fetch resource/i.test(msg)) return null;
        return event;
      },
      // Dynamic trace sampling example for future expansion
      tracesSampler(samplingContext) {
        const url = samplingContext?.location?.href || '';
        if (/\/api\//.test(url)) return baseTraceRate * 0.5; // lower for API heavy pages
        if (/contact/i.test(url)) return Math.min(baseTraceRate * 2, 1);
        return baseTraceRate;
      },
    });
  };
  if ('requestIdleCallback' in window) {
      interface IdleCB {
        (callback: (deadline: { didTimeout: boolean; timeRemaining(): number }) => void, opts?: { timeout: number }): number;
      }
      (window as unknown as { requestIdleCallback: IdleCB }).requestIdleCallback(init, { timeout: 3000 });
  } else {
    setTimeout(init, 0);
  }
}

function AppRoot() {
  return <RouterProvider router={router} />;
}

function mount() {
  const root = document.getElementById('root');
  if (!root) {
    console.error('Failed to find #root element to mount app');
    return;
  }
  const disableStrict = (import.meta.env.VITE_DISABLE_STRICT_MODE || 'false') === 'true';
  const tree = disableStrict ? <AppRoot /> : (
    <React.StrictMode>
      <AppRoot />
    </React.StrictMode>
  );
  ReactDOM.createRoot(root).render(tree);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mount);
} else {
  mount();
}
