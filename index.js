// use express framework
const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

// use morgan for logging
app.use(require('morgan')('dev'));

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
    bmi = (weight/height).toPrecision(3);
    return bmi
}

// Show dummy page on root
app.get('/', (req, res) => {
    res.json({
        status: 200,
        message: "Hello there!"
    })
});

// Handle route to BMI API
app.get('/bmi/calc', [
    query('weight').isNumeric().withMessage('Value is not number'),
    query('height').isNumeric().withMessage('Value is not number')
    ], (req, res) => {

    // return error if input not valid
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    weight = parseInt(req.query.weight);
    height = parseFloat((Math.pow((req.query.height/100), 2)).toPrecision(3));

    bmiResult = calculateBMI(weight, height);
    bmiLabel = bmiCategoryLabel(bmiResult);
    res.status(200).json({
        bmi: bmiResult,
        weight: weight,
        height: height,
        label: bmiLabel
    })
});

app.listen(port, () =>{
    console.log('Listening on port ' + port);
});