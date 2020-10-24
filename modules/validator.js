function validateResultObject(validationStatus, errorMessage) {
  return {
    "success": validationStatus,
    "error": errorMessage
  };
}

function evaluateValidation(validationResults) {
  for(let i = 0; i < validationResults.length; i++) {
      if (!validationResults[i].success) {
          return validateResultObject(false, validationResults[i].error);
      }
  }
  return validateResultObject(true, "");
}

/**
 * Validates the specified input using the validation rules. 
 * Every validation rule is applied to the input value. 
 * If a check fails, the validation breaks and the specified for the current check error message is returned.
 * @param {*} input value to be checked
 * @param {*} converter converter function applied to the specified input value
 * @param {*} validationRules object containing an array of validation rules and corresponding error messages
 * { 
 *      rules: [ 
 *              { "check": function, "message": string }, 
 *              { "check": function, "message": string } 
 *             ] 
 * }
 * @param {*} callback callback method called before return
 */
function validate(input, converter, validationRules, callback) {
    // check if parameter is set
    if (input) {
      let validationOk = false;
      let errorMessage = "";
      let value = converter(input);
      for (let i = 0; i < validationRules.rules.length; i++) {
        let rule = validationRules.rules[i];
        validationOk = rule.check(value);
        if (!validationOk) {
          errorMessage = rule.message;
          break;
        } 
      }
      callback(value);
      return validateResultObject(validationOk,errorMessage);
    }
    // if parameter is not set, then pass
    return validateResultObject(true, "");
  }

module.exports = { validate, validateResultObject, evaluateValidation };