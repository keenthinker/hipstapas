import { randomNumber } from '../modules/random.js';
import { validate, evaluateValidation, validateResultObject } from '../modules/validator.js';

function generateRandomNumbers(min, max, noDuplicates, sort, resultsCount) {
    let randomNumbers = [];

    if (noDuplicates) {
        let previousRandomNumbers = new Map();
        let i = 0;
    
        while (i < resultsCount) {
            let roll = randomNumber(min, max);
            if (!previousRandomNumbers.has(roll)) {
                previousRandomNumbers.set(roll, roll);
                i++;
            }
        }
        randomNumbers = Array.from(previousRandomNumbers.keys());
    } else {
        for (let count = 0; count < resultsCount; count++) {
            randomNumbers.push(randomNumber(min, max));
        }
    }

    return sort ? randomNumbers.sort((a, b) => a - b) : randomNumbers;
}

function validateAndGenerateRandomNumbers(minParameter, maxParameter, noDuplicatesParameter, sortParameter, resultsCountParameter)
{
    let resultsCount = 1;
    let min = 1;
    let max = 1048576;
    let noDuplicates = false;
    let sort = false;

    let validateResultsCount = validate(resultsCountParameter, Number, {
        rules: [
                {
                    "check": function (v) { return Number.isInteger(v); },
                    "message": "Only numbers between 1 and 100 are allowed as values for the query parameter \"resultsCount\". Example: https://hipstapas.dev/api/random?resultsCount=10"  
                },
                {
                    "check": function (v) { return v >= 1 && v <= 100; },
                    "message": "Query parameter value must be between 1 and 100. Example: https://hipstapas.dev/api/random?resultsCount=10"
                }
            ]
    }, (r) => resultsCount = r);

    let validateMin = validate(minParameter, Number, {
        rules: [
                {
                    "check": function (v) { return Number.isInteger(v); },
                    "message": `Only numbers between ${min} and ${max} are allowed as values for the query parameter \"min\". Example: https://hipstapas.dev/api/random?min=10`
                },
                {
                    "check": function (v) { return v >= min && v <= max; },
                    "message": `Query parameter value must be between ${min} and ${max}. Example: https://hipstapas.dev/api/random?min=10`
                }
            ]
    }, (r) => min = r);

    let validateMax = validate(maxParameter, Number, {
        rules: [
                {
                    "check": function (v) { return Number.isInteger(v); },
                    "message": `Only numbers between ${min} and ${max} are allowed as values for the query parameter \"max\". Example: https://hipstapas.dev/api/random?max=10`
                },
                {
                    "check": function (v) { return v >= min && v <= max; },
                    "message": `Query parameter value must be between ${min} and ${max}. Example: https://hipstapas.dev/api/random?max=10`
                }
            ]
    }, (r) => max = r);

    let validateNoDuplicates = validate(noDuplicatesParameter, String, {
        rules: [
                {
                    "check": function (v) { return (v.toLowerCase() == "true") || (v.toLowerCase() == "false"); },
                    "message": "Query parameter value should be either 'true' or 'false'. Example: https://hipstapas.dev/api/random?noDuplicates=true"
                }
            ]
    }, (r) => noDuplicates = r.toLowerCase() === "true");

    let validateSort = validate(sortParameter, String, {
        rules: [
                {
                    "check": function (v) { return (v.toLowerCase() == "true") || (v.toLowerCase() == "false"); },
                    "message": "Query parameter value should be either 'true' or 'false'. Example: https://hipstapas.dev/api/random?sort=true"
                }
            ]
    }, (r) => sort = r.toLowerCase() === "true");

    let validateResults = evaluateValidation([ validateResultsCount, validateMin, validateMax, validateNoDuplicates, validateSort ]);
    var results = [];
    if (noDuplicates && (max < resultsCount)) {
        validateResults = validateResultObject(false, "No duplicates is not possible, when max < results count")
    }

    if (validateResults.success) {
        results = generateRandomNumbers(min, max, noDuplicates, sort, resultsCount);
    }

    return {
        "success": validateResults.success,
        "error": validateResults.error,
        "results": results
    };
}


module.exports = (req, res) => {
    const httpCodeError = 400;
    const httpCodeOk = 200; 

    let r = {};
    let min = 1;
    let max = 1048576;
    let resultsCount = 1;
    let noDuplicates = false;
    let sort = false;

    if (req.query !== undefined && JSON.stringify(req.query) !== '{}') {
        min = req.query.min;
        max = req.query.max;
        resultsCount = req.query.resultsCount;
        noDuplicates = req.query.noDuplicates;
        sort = req.query.sort;
    }

    r = validateAndGenerateRandomNumbers(min, max, noDuplicates, sort, resultsCount);
    if (!r.success) {
        res.status(httpCodeError).send(r.error);
        return;
    }

    res.status(httpCodeOk).send(r.results.length == 1 ? r.results[0] : r.results);
}