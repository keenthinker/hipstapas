const { random } = require('hipstapas.core')
const { firstItemIfArrayHasLengthOne, executeIfConditionIsMet, evaluateBooleanQueryParameter } = require('../modules/utils');
const { logEndpointCall } = require('../modules/faunadblogger');

module.exports = async (req, res) => {
    let min = 1;
    let max = 1048576;
    let resultsCount = 1;
    let noDuplicates = false;
    let sort = false;

    if (req.query !== undefined && JSON.stringify(req.query) !== '{}') {
        executeIfConditionIsMet(req.query.min, () => min = Number(req.query.min));
        executeIfConditionIsMet(req.query.max, () => max = Number(req.query.max));
        executeIfConditionIsMet(req.query.noDuplicates, () => noDuplicates = evaluateBooleanQueryParameter(req.query.noDuplicates));
        executeIfConditionIsMet(req.query.sort, () => sort = evaluateBooleanQueryParameter(req.query.sort));
        executeIfConditionIsMet(req.query.resultsCount, () => resultsCount = Number(req.query.resultsCount));
    }

    const options = {
        min: min, 
        max: max, 
        noDuplicates: noDuplicates, 
        sort: sort, 
        resultsCount: resultsCount
    }
    const r = random(options);
    const httpCode = r.success ? 200 /* OK */ : 400 /* Error */;
    const message = r.success ? firstItemIfArrayHasLengthOne(r.result) : r.error;
    try {
        await logEndpointCall('random', httpCode);
    } catch (error) {
        console.log(error);  
    }
    res.status(httpCode).send(message);
}