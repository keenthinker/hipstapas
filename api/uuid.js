const { uuid } = require('hipstapas.core');
const { firstItemIfArrayHasLengthOne, executeIfConditionIsMet } = require('../modules/utils');
const { logEndpointCall } = require('../modules/faunadblogger');

module.exports = async (req, res) => {
    let resultsCount = 1;

    if (req.query !== undefined && JSON.stringify(req.query) !== '{}') {
        executeIfConditionIsMet(req.query.resultsCount, () => resultsCount = Number(req.query.resultsCount));
    }

    const options = { 
        resultsCount: resultsCount
    };
    const r = uuid(options);
    const httpCode = r.success ? 200 /* OK */ : 400 /* Error */;
    const message = r.success ? firstItemIfArrayHasLengthOne(r.result) : r.error;
    try {
        await logEndpointCall('uuid', httpCode);
    } catch (error) {
        console.log(error);  
    }
    res.status(httpCode).send(message);
}