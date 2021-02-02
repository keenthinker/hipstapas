const { password } = require('hipstapas.core')
const { firstItemIfArrayHasLengthOne, executeIfConditionIsMet, evaluateBooleanQueryParameter } = require('../modules/utils');

module.exports = (req, res) => {
    let resultsCount = 1;
    let lengthMin = 16;
    let lengthMax = 32;
    let alphabetSmall = true;
    let alphabetCapital = true;
    let alphabetNumber = true;
    let alphabetSpecial = true;

    if (req.query) {
      if (req.query !== undefined && JSON.stringify(req.query) !== '{}') {
        executeIfConditionIsMet(req.query.lengthMin, () => lengthMin = Number(req.query.lengthMin));
        executeIfConditionIsMet(req.query.lengthMax, ()=> lengthMax = Number(req.query.lengthMax));
        executeIfConditionIsMet(req.query.resultsCount, () => resultsCount = Number(req.query.resultsCount));
        executeIfConditionIsMet(req.query.alphabetSmall, () => alphabetSmall = evaluateBooleanQueryParameter(req.query.alphabetSmall));
        executeIfConditionIsMet(req.query.alphabetCapital, () => alphabetCapital = evaluateBooleanQueryParameter(req.query.alphabetCapital));
        executeIfConditionIsMet(req.query.alphabetNumber, () => alphabetNumber = evaluateBooleanQueryParameter(req.query.alphabetNumber));
        executeIfConditionIsMet(req.query.alphabetSpecial, () => alphabetSpecial = evaluateBooleanQueryParameter(req.query.alphabetSpecial));
      }
    }

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Id, Content-Type, Accept');
    const options = { 
      lengthMin: lengthMin, 
      lengthMax: lengthMax,
      resultsCount: resultsCount,
      alphabetSmall: alphabetSmall,
      alphabetCapital: alphabetCapital,
      alphabetNumber: alphabetNumber,
      alphabetSpecial: alphabetSpecial
     };
    const r = password(options);
     const httpCode = r.success ? 200 /* OK */ : 400 /* Error */;
     const message = r.success ? firstItemIfArrayHasLengthOne(r.result) : r.error;
     res.status(httpCode).send(message);
  }