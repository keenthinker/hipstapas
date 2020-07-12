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

module.exports = (req, res) => {
    let resultsCount = 1;
    // query validation
    if (req.query !== undefined && JSON.stringify(req.query) !== '{}') {
        var validateResultsCount = validate(req.query.resultsCount, Number, {
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

        if (!validateResultsCount.success) {
            res.status(200).send(validateResultsCount.error);
            return;
        }
    }
    
    let results = generateUuids(resultsCount);
    res.status(200).send(results.length == 1 ? results[0] : results);
}