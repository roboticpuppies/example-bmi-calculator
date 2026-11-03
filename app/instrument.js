// Sentry SDK init. index.js requires this file first, before express is loaded.
const Sentry = require('@sentry/node');
const { nodeProfilingIntegration } = require('@sentry/profiling-node');

const tracing = process.env.SENTRY_TRACING_ENABLED !== 'false';

// no DSN = SDK disabled, so local runs stay quiet
Sentry.init({
    dsn: process.env.SENTRY_DSN,
    // tracesSampleRate unset = tracing off; profiling needs tracing
    tracesSampleRate: tracing ? parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE ?? '1.0') : undefined,
    integrations: tracing ? [nodeProfilingIntegration()] : [],
    profileSessionSampleRate: parseFloat(process.env.SENTRY_PROFILE_SESSION_SAMPLE_RATE ?? '1.0'),
    profileLifecycle: 'trace',
    dataCollection: {
        userInfo: false,
    },
});
