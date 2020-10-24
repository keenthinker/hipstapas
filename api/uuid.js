const { v4: uuidv4 } = require('uuid');
import { validate } from '../modules/validator.js';

function generateUuids(resultsCount)
{
    let uuids = [];
    for (let count = 0; count < resultsCount; count++) {
        uuids.push(uuidv4());
    }

    return uuids;
}

function validateAndGenerateUuids(resultsCountParameter) {
    let resultsCount = 1;
    let validateResultsCount = validate(resultsCountParameter, Number, {
        rules: [
                {
                    "check": function (v) { return Number.isInteger(v); },
                    "message": "Only numbers between 1 and 100 are allowed as values for the query parameter \"resultsCount\". Example: https://hipstapas.dev/api/uuid?resultsCount=10"  
                },
                {
                    "check": function (v) { return v >= 1 && v <= 100; },
                    "message": "Query parameter value must be between 1 and 100. Example: https://hipstapas.dev/api/uuid?resultsCount=10"
                }
            ]
    }, (r) => resultsCount = r);

    var results = [];
    if (validateResultsCount.success) {
        results = generateUuids(resultsCount);
    }

    // object {  ruleValidationStatus; ruleValidationError; generationResult }
    return {
        "success": validateResultsCount.success,
        "error": validateResultsCount.error,
        "results": results
    };
}

module.exports = (req, res) => {
    let r = {};
    let resultsCount = 1;

    if (req.query !== undefined && JSON.stringify(req.query) !== '{}') {
        resultsCount = req.query.resultsCount;
    }

    r = validateAndGenerateUuids(resultsCount);
    if (!r.success) {
        res.status(200).send(r.error);
        return;
    }
    
    res.status(200).send(r.results.length == 1 ? r.results[0] : r.results);
}