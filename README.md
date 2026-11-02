# README

Simple BMI Calculator API using Node.js.

Body Mass Index is a simple calculation using a person's height and weight. The formula is BMI = kg/m2 where kg is a person's weight in kilograms and m2 is their height in meters squared. A BMI of 25.0 or more is overweight, while the healthy range is 18.5 to 24.9.

## How to use
### Development mode (docker compose)

Run from source with live reload (`node --watch`), no image build needed:

1. Optional: copy the env file and adjust values

    ```
    cp .env.example .env
    ```

2. Start the service

    ```
    docker compose -f docker-compose.dev.yml up
    ```

3. Access the app at `localhost:8080`. Edit code and the app restarts automatically.

### Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8080` | Listen port |
| `SENTRY_DSN` | empty | Sentry DSN. Empty = Sentry disabled |
| `SENTRY_TRACING_ENABLED` | `true` | Set `false` to disable tracing and profiling |
| `SENTRY_TRACES_SAMPLE_RATE` | `1.0` | Trace sample rate (0.0 - 1.0) |
| `SENTRY_PROFILE_SESSION_SAMPLE_RATE` | `1.0` | Profiling sample rate (0.0 - 1.0) |

## Observability

The app uses [Sentry](https://sentry.io) for error tracking, performance tracing and profiling. The SDK is initialised in `instrument.js`, which is loaded before the app (`node --import ./instrument.js index.js`).

* Set `SENTRY_DSN` to enable it. Without a DSN the SDK is disabled, so local runs send nothing.
* Tracing and profiling can be tuned or turned off with the `SENTRY_*` variables above.
* User info is not collected.

## REST API

1. The endpoint is `/bmi/calc`
2. Pass the `weight` and `height` as query string
    
    ```
    example: localhost:8080/bmi/calc?weight=55&height=165
    ```

3. Example of the output (JSON)
    
    ```
    {"bmi":"20.2","weight":55,"height":2.72,"label":"Healthy"}
    ```

Note: Only numbers are accepted as value. If the input is not number, it will throw errors:

```
{"errors":[{"value":"abc","msg":"Value is not number","param":"weight","location":"query"},{"value":"abc","msg":"Value is not number","param":"height","location":"query"}]}
```

## To do

* comprehensive unit tests/specs
* ~~create instructions on how to use the service~~
* ~~setup CI/CD to build, test and deploy service~~
* ~~host the service (use container)~~
* ~~set up centralized logging~~
* ~~observability tools~~