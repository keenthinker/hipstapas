const { wordlist } = require('hipstapas.core')
const { firstItemIfArrayHasLengthOne, executeIfConditionIsMet } = require('../modules/utils');

module.exports = (req, res) => {
    let resultsCount = 1;
    // generate 6 words by (EFF) default
    let words = 6;

    if (req.query !== undefined && JSON.stringify(req.query) !== '{}') {
        executeIfConditionIsMet(req.query.words, () => words = Number(req.query.words));
        executeIfConditionIsMet(req.query.resultsCount, () => resultsCount = Number(req.query.resultsCount));
    }

    const options = {
        words: words,
        resultsCount: resultsCount
    };
    const r = wordlist(options);
    const httpCode = r.success ? 200 /* OK */ : 400 /* Error */;
    const message = r.success ? firstItemIfArrayHasLengthOne(r.result) : r.error;
    res.status(httpCode).send(message);
}