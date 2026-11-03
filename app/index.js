// Sentry must load before express so its instrumentation can patch it
require('./instrument');

// use express framework
const express = require('express');
const Sentry = require('@sentry/node');
const app = express();

// Lambda Web Functions set AWS_LAMBDA_HTTP_ENDPOINT (host:port) and route requests only there.
// Locally the variable is unset, so listen on all interfaces on PORT (default 8080).
const [host, port] = (process.env.AWS_LAMBDA_HTTP_ENDPOINT || `0.0.0.0:${process.env.PORT || 8080}`).split(':');

// Request logs. Production: one JSON line per request for CloudWatch Logs Insights.
// Client IP and user agent are not logged.
const morgan = require('morgan');
app.use(process.env.NODE_ENV === 'production'
    ? morgan((tokens, req, res) => JSON.stringify({
        requestId: req.headers['lambda-web-request-id'],
        method: tokens.method(req, res),
        path: tokens.url(req, res),
        status: Number(tokens.status(req, res)),
        durationMs: Number(tokens['response-time'](req, res)),
    }))
    : morgan('dev'));

// use express validator
const { query, validationResult } = require('express-validator');

// function to decide bmi label
function bmiCategoryLabel(bmiResult){
    if(bmiResult >= 25.0){
        return "Overweight"
    }
    else if(bmiResult <= 18.4) {
        return "Underweight"
    }
    else {
        return "Healthy"
    }
}

// function to actually calculate bmi
function calculateBMI(weight, height) {
    const bmi = (weight/height).toPrecision(3);
    return bmi
}

// Show dummy page on root
app.get('/', (req, res) => {
    res.json({
        status: 200,
        message: "Hello there!"
    })
});

// Health check for uptime monitors
app.get('/healthz', (req, res) => {
    res.json({ status: 'ok' });
});

// Version 1 of the API, mounted at /v1
const v1 = express.Router();

v1.get('/bmi/calc', [
    // isString rejects repeated params (?weight=1&weight=2); bounds reject 0, negatives, absurd values
    query('weight').isString().bail().isFloat({ min: 1, max: 700 }).withMessage('Weight must be a number between 1 and 700 (kg)'),
    query('height').isString().bail().isFloat({ min: 30, max: 300 }).withMessage('Height must be a number between 30 and 300 (cm)')
    ], (req, res) => {

    // return error if input not valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const weight = parseInt(req.query.weight);
    const height = parseFloat((Math.pow((req.query.height/100), 2)).toPrecision(3));

    const bmiResult = calculateBMI(weight, height);
    const bmiLabel = bmiCategoryLabel(bmiResult);
    res.status(200).json({
        bmi: bmiResult,
        weight: weight,
        height: height,
        label: bmiLabel
    })
});

app.use('/v1', v1);

const server = app.listen(Number(port), host, () => {
    console.log(`Listening on ${host}:${port}`);
});

// Graceful shutdown. Lambda sends SIGTERM before it removes an environment and kills
// the process 1 second later. Stop accepting connections, flush pending Sentry events, exit.
process.on('SIGTERM', async () => {
    console.log('SIGTERM received, shutting down');
    server.close();
    await Sentry.close(800);
    process.exit(0);
});
