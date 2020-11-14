import { randomNumber } from '../modules/random.js';
import { validate, evaluateValidation } from '../modules/validator.js';
import { wordlistLargeMap } from '../modules/wordlistLarge.js';
import { generationResult } from '../modules/utils.js';

function generateWordlist(rolls) {
    // generate words the EFF way: https://www.eff.org/de/dice
    let words = [];
    let previousRolls = new Map();
    var i = 0;

    while (i < rolls) {
        var roll1 = randomNumber(1, 6);
        var roll2 = randomNumber(1, 6);
        var roll3 = randomNumber(1, 6);
        var roll4 = randomNumber(1, 6);
        var roll5 = randomNumber(1, 6);
        // Just to be sure there are no duplicates,
        // check that every new roll does not match previous ones! 
        let roll = `${roll1}${roll2}${roll3}${roll4}${roll5}`;
        if (!previousRolls.has(roll)) {
            previousRolls.set(roll, roll);
            words.push(wordlistLargeMap.get(roll));
            i++;
        }
    }
    
    return words.join(' ');
}

function generateWordlists(resultsCount, rolls) {
    let wordlists = []
    for (let count = 0; count < resultsCount; count++) {
        wordlists.push(generateWordlist(rolls));
    }
    
    return wordlists;
}

function validateAndGenerateWordlists(resultsCountParameter, wordsParameter) {
    const minWordsCount = 1;
    const maxWordsCount = 50;

    let resultsCount = 1;
    let words = 6;  // generate 6 words by (EFF) default

    var validateWordsCount = validate(wordsParameter, Number, {
        rules: [
                {
                    "check": function (v) { return Number.isInteger(v); },
                    "message": `Only numbers between ${minWordsCount} and ${maxWordsCount} are allowed as values for the query paramter "words". Example: https://hipstapas.dev/api/wordlist?words=10`  
                },
                {
                    "check": function (v) { return v >= minWordsCount && v <= maxWordsCount; },
                    "message": `Query parameter value must be between ${minWordsCount} and ${maxWordsCount}. Example: https://hipstapas.dev/api/wordlist?words=10`
                }
            ]
        }, (r) => words = r);

    var validateResultsCount = validate(resultsCountParameter, Number, {
        rules: [
                {
                    "check": function (v) { return Number.isInteger(v); },
                    "message": "Only numbers between 1 and 100 are allowed as values for the query parameter \"resultsCount\". Example: https://hipstapas.dev/api/wordlist?resultsCount=10"  
                },
                {
                    "check": function (v) { return v >= 1 && v <= 100; },
                    "message": "Query parameter value must be between 1 and 100. Example: https://hipstapas.dev/api/wordlist?resultsCount=10"
                }
            ]
    }, (r) => resultsCount = r);

    const validateResults = evaluateValidation([ validateResultsCount, validateWordsCount ]);
    var results = [];
    if (validateResults.success) {
        results = generateWordlists(resultsCount, words);
    }

    return generationResult(validateResults.success, results, validateResults.error);
}

module.exports = (req, res) => {
    let resultsCount = 1;
    // generate 6 words by (EFF) default
    let words = 6;

    if (req.query !== undefined && JSON.stringify(req.query) !== '{}') {
        words = req.query.words;
        resultsCount = req.query.resultsCount;
    }

    const r = validateAndGenerateWordlists(resultsCount, words);
    const httpCode = r.success ? 200 /* OK */ : 400 /* Error */;
    const message = r.success ? r.result : r.error;
    res.status(httpCode).send(message);
}