import { randomNumber, randomCharacter } from '../modules/random.js';

/**
 * Validates and calculates the upper and the lower bound for the generator function 
 * regarding the specified min and max values
 * @param {!number} lmin 
 * @param {!number} lmax
 * @return {{ lower: !number, upper: !number }} 
 */
function calculateLowerAndUpperBound(lmin, lmax) {
  let randomUpperBound = 251;
  
  let lowerBound = 0;
  let upperBound = 0;
  let minLength = lmin;
  // force min length to be always smaller or equal to max length.
  let maxLength = Math.max(minLength, lmax);
  // 
  if ((minLength <= 0) && (maxLength <= 0))
  {
    lowerBound = randomNumber(1, randomUpperBound);
    upperBound = Math.max(lowerBound, randomNumber(1, randomUpperBound));
  }
  else if ((minLength <= 0) && (maxLength > 0))
  {
    lowerBound = randomNumber(1, maxLength);
    upperBound = randomNumber(lowerBound, maxLength);
  }
  else if ((minLength > 0) && (maxLength <= 0))
  {
    lowerBound = minLength;
    upperBound = randomNumber(minLength, randomUpperBound);
  }
  else
  {
    lowerBound = randomNumber(minLength, maxLength);
    var max = Math.max(lowerBound, maxLength);
    upperBound = randomNumber(lowerBound, max);
  }

  return { "lower": lowerBound, "upper": upperBound };
}

function generatePhrase(alphabet, lengthMin, lengthMax) {
  let text = [];
  var bounds = calculateLowerAndUpperBound(lengthMin, lengthMax);
  let lowerBound = bounds.lower;
  for (let i = 0; i < lowerBound; i++) {
    text.push(randomCharacter(alphabet));
  }
  while (lowerBound < bounds.upper) {
    text.push(randomCharacter(alphabet));
    lowerBound++;
  }
  return text.join('');
}

/**
 * Generates a random string considering the specified options
 * @param {Object} options 
 */
function generate(options) {
  let lengthMin = options.lengthMin;
  let lengthMax = options.lengthMax;
  let resultsCount = options.resultsCount;

  let alphabetSmall = "abcdefghijklmnopqrstuvwxyz";
  let alphabetCapital = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let alphabetNumbers = "0123456789";
  let alphabetSpecial = ".,+-*/!?;:{}()[]%$&~#@|";
  let alphabet = alphabetSmall + alphabetCapital + alphabetNumbers + alphabetSpecial;

  let passPhrases = [];
  for (let count = 0; count < resultsCount; count++) {
    passPhrases.push(generatePhrase(alphabet, lengthMin, lengthMax));
  }

  return passPhrases;
}

function validate(v, vr, cb) {
  // check if parameter is set
  if (v) {
    let validationOk = false;
    let errorMessage = "";
    let value = Number(v);
    for (let i = 0; i < vr.rules.length; i++) {
      let rm = vr.rules[i];
      validationOk = rm.check(value);
      if (!validationOk) {
        errorMessage = rm.message;
        break;
      } 
    }
    cb(value);
    return {
      "success": validationOk,
      "error": errorMessage
    };
  }
  // if parameter is not set, then pass
  return {
    "success": true,
    "error": ""
  };
}

module.exports = (req, res) => {
    let resultsCount = 1;
    let lengthMin = 16;
    let lengthMax = 32;
    // if (req.body) {
    //   lengthMin = req.body.lengthMin || 16;
    //   lengthMax = req.body.lengthMax || 32;
    //   resultsCount = req.body.resultsCount || 1;
    // }
    // query validation - todo: use npm jsonschema
    if (req.query) {
      if (req.query !== undefined && JSON.stringify(req.query) !== '{}') {
        //console.log(req.query);
        var validateLengthMin = validate(req.query.lengthMin, {
          rules: [
            {
              "check": function (v) { return Number.isInteger(v); },
              "message": "Only numbers between 1 and 2048 are allowed as values for the query parameter \"lengthMin\". Example: https://hipstapas.dev/api/?lengthMin=10"  
            },
            {
              "check": function (v) { return v >= 1 && v <= 2048; },
              "message": "Query parameter value must be between 1 and 2048. Example: https://hipstapas.dev/api/?lengthMin=10"
            }
          ]
        }, (r) => lengthMin = r);

        var validateLengthMax = validate(req.query.lengthMax, {
          rules: [
            {
              "check": function (v) { return Number.isInteger(v); },
              "message": "Only numbers between 1 and 2048 are allowed as values for the query parameter \"lengthMax\". Example: https://hipstapas.dev/api/?lengthMax=10"  
            },
            {
              "check": function (v) { return v >= 1 && v <= 2048; },
              "message": "Query parameter value must be between 1 and 2048. Example: https://hipstapas.dev/api/?lengthMax=10"
            }
          ]
        }, (r) => lengthMax = r);

        var validateResultsCount = validate(req.query.resultsCount, {
          rules: [
            {
              "check": function (v) { return Number.isInteger(v); },
              "message": "Only numbers between 1 and 100 are allowed as values for the query parameter \"resultsCount\". Example: https://hipstapas.dev/api/?resultsCount=10"  
            },
            {
              "check": function (v) { return v >= 1 && v <= 100; },
              "message": "Query parameter value must be between 1 and 100. Example: https://hipstapas.dev/api/?resultsCount=10"
            }
          ]
        }, (r) => resultsCount = r);

        if (!validateLengthMin.success) {
          res.status(200).send(validateLengthMin.error);
          return;
        }

        if (!validateLengthMax.success) {
          res.status(200).send(validateLengthMax.error);
          return;
        }

        if (!validateResultsCount.success) {
          res.status(200).send(validateResultsCount.error);
          return;
        }
      }
    }
    //res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Id, Content-Type, Accept');
    let results = generate({ 
      lengthMin: lengthMin, 
      lengthMax: lengthMax,
      resultsCount: resultsCount
     });
    res.status(200).send(results.length == 1 ? results[0] : results);
  }