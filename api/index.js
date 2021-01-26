import { randomNumber, randomCharacter } from '../modules/random.js';
import { validate, evaluateValidation } from '../modules/validator.js';
import { generationResult } from '../modules/utils.js';

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
  let includeAlphabetSmall = options.alphabetSmall;
  let includeAlphabetCapital = options.alphabetCapital;
  let includeAlphabetNumber = options.alphabetNumber;
  let includeAlphabetSpecial = options.alphabetSpecial;

  const alphabetSmall = "abcdefghijklmnopqrstuvwxyz";
  const alphabetCapital = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const alphabetNumber = "0123456789";
  const alphabetSpecial = ".,+-*/!?;:{}()[]%$&~#@|";

  let alphabet = "";
  
  if (includeAlphabetSmall) {
    alphabet += alphabetSmall;
  }
  if (includeAlphabetCapital) {
    alphabet += alphabetCapital;
  }
  if (includeAlphabetNumber) {
    alphabet += alphabetNumber;
  }
  if (includeAlphabetSpecial) {
    alphabet += alphabetSpecial;
  }

  let passPhrases = [];
  for (let count = 0; count < resultsCount; count++) {
    passPhrases.push(generatePhrase(alphabet, lengthMin, lengthMax));
  }

  return passPhrases;
}

function validateAndGeneratePassphrases(optionsParameter) {
  let resultsCount = 1;
  let lengthMin = 16;
  let lengthMax = 32;
  let alphabetSmall = true;
  let alphabetCapital = true;
  let alphabetNumber = true;
  let alphabetSpecial = true;

  var validateLengthMin = validate(optionsParameter.lengthMin, Number, {
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

  var validateLengthMax = validate(optionsParameter.lengthMax, Number, {
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

  var validateResultsCount = validate(optionsParameter.resultsCount, Number, {
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

  var validateAlphabetSmall = validate(optionsParameter.alphabetSmall, String, {
    rules: [
      {
        "check": function (v) { return (v.toLowerCase() == "true") || (v.toLowerCase() == "false"); },
        "message": "Query parameter value should be either 'true' or 'false'. Example: https://hipstapas.dev/api/?alphabetSmall=true"  
      }
    ]
  }, (r) => alphabetSmall = r.toLowerCase() === "true");

  var validateAlphabetCapital = validate(optionsParameter.alphabetCapital, String, {
    rules: [
      {
        "check": function (v) { return (v.toLowerCase() == "true") || (v.toLowerCase() == "false"); },
        "message": "Query parameter value should be either 'true' or 'false'. Example: https://hipstapas.dev/api/?alphabetCapital=true"  
      }
    ]
  }, (r) => alphabetCapital = r.toLowerCase() === "true");

  var validateAlphabetNumber = validate(optionsParameter.alphabetNumber, String, {
    rules: [
      {
        "check": function (v) { return (v.toLowerCase() == "true") || (v.toLowerCase() == "false"); },
        "message": "Query parameter value should be either 'true' or 'false'. Example: https://hipstapas.dev/api/?alphabetNumber=true"  
      }
    ]
  }, (r) => alphabetNumber = r.toLowerCase() === "true");

  var validateAlphabetSpecial = validate(optionsParameter.alphabetSpecial, String, {
    rules: [
      {
        "check": function (v) { return (v.toLowerCase() == "true") || (v.toLowerCase() == "false"); },
        "message": "Query parameter value should be either 'true' or 'false'. Example: https://hipstapas.dev/api/?alphabetSpecial=true"  
      }
    ]
  }, (r) => alphabetSpecial = r.toLowerCase() === "true");

  const validateResults = evaluateValidation([validateLengthMin, validateLengthMax, validateResultsCount, validateAlphabetSmall, validateAlphabetCapital, validateAlphabetNumber, validateAlphabetSpecial]);
  var results = [];
  if (validateResults.success) {
    results = generate({ 
      lengthMin: lengthMin, 
      lengthMax: lengthMax,
      resultsCount: resultsCount,
      alphabetSmall: alphabetSmall,
      alphabetCapital: alphabetCapital,
      alphabetNumber: alphabetNumber,
      alphabetSpecial: alphabetSpecial
     });
  }

  return generationResult(validateResults.success, results, validateResults.error);
}

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
        resultsCount = req.query.resultsCount;
        lengthMin = req.query.lengthMin;
        lengthMax = req.query.lengthMax;
        alphabetSmall = req.query.alphabetSmall;
        alphabetCapital = req.query.alphabetCapital;
        alphabetNumber = req.query.alphabetNumber;
        alphabetSpecial = req.query.alphabetSpecial;
      }
    }
    //res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Id, Content-Type, Accept');
    const r = validateAndGeneratePassphrases({ 
      lengthMin: lengthMin, 
      lengthMax: lengthMax,
      resultsCount: resultsCount,
      alphabetSmall: alphabetSmall,
      alphabetCapital: alphabetCapital,
      alphabetNumber: alphabetNumber,
      alphabetSpecial: alphabetSpecial
     });
     const httpCode = r.success ? 200 /* OK */ : 400 /* Error */;
     const message = r.success ? r.result : r.error;
     res.status(httpCode).send(message);
  }