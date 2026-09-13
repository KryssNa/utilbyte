import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://04077a71ec7a935b36a7fa9049f38c98@o4510702312292352.ingest.us.sentry.io/4510702314913792",
  defaultIntegrations: false,
  tracesSampleRate: 0,
  enableLogs: false,
  sendDefaultPii: false,
  beforeSend: () => null,
});

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
