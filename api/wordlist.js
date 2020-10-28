import { randomNumber } from '../modules/random.js';
import { validate } from '../modules/validator.js';
import { wordlistLargeMap } from '../modules/wordlistLarge.js';

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

module.exports = (req, res) => {
    const httpCodeError = 400;
    const httpCodeOk = 200; 

    const minWordsCount = 1;
    const maxWordsCount = 50;

    let resultsCount = 1;
    // generate 6 words by (EFF) default
    let rolls = 6;
    // query validation
    if (req.query !== undefined && JSON.stringify(req.query) !== '{}') {

        var validateWordsCount = validate(req.query.words, Number, {
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
            }, (r) => rolls = r);

        var validateResultsCount = validate(req.query.resultsCount, Number, {
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

        if (!validateWordsCount.success) {
            res.status(httpCodeError).send(validateWordsCount.error);
            return;
        }

        if (!validateResultsCount.success) {
            res.status(httpCodeError).send(validateResultsCount.error);
            return;
        }
    }

    let results = generateWordlists(resultsCount, rolls);
    res.status(httpCodeOk).send(results.length == 1 ? results[0] : results);
}