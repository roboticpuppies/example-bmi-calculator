# README

Simple BMI Calculator API using Node.js.

Body Mass Index is a simple calculation using a person's height and weight. The formula is BMI = kg/m2 where kg is a person's weight in kilograms and m2 is their height in meters squared. A BMI of 25.0 or more is overweight, while the healthy range is 18.5 to 24.9.

## How to use
### Run on Docker Container Locally

1. You can pull already built image

    ```docker pull roboticpuppies/bmi-calculator:<tag>
    ```
    
2. Run the image

    ```docker run -p 8080:8080 roboticpuppies/bmi-calculator:<tag>
    ```
    
3. Access the app from browser

    ```localhost:8080
    ```

### Demo site
Visit https://bmi.msyaifuddin.my.id to see the result

## REST API

1. The endpoint is `/bmi/calc`
2. Pass the `weight` and `height` as query string
    
    ```example: localhost:8080/bmi/calc?weight=55&height=165
    ```

3. Example of the output (JSON)
    
    ```{"bmi":"20.2","weight":55,"height":2.72,"label":"Healthy"}
    ```

Note: Only numbers are accepted as value. If the input is not number, it will throw errors:

```{"errors":[{"value":"abc","msg":"Value is not number","param":"weight","location":"query"},{"value":"abc","msg":"Value is not number","param":"height","location":"query"}]}
```

## Logging
![Log using Papertrail](docs/1.png)


I'm using Papertrail to log the container.


## To do

* comprehensive unit tests/specs
* ~~create instructions on how to use the service~~
* ~~setup CI/CD to build, test and deploy service~~
* ~~host the service (use container)~~
* ~~set up centralized logging~~
* ~~observability tools~~