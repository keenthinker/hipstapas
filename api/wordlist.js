import { randomNumber } from '../modules/random.js';
import { wordlistLargeMap } from '../modules/wordlistLarge.js';

module.exports = (req, res) => {

    const minWordsCount = 1;
    const maxWordsCount = 50;

    let rolls = 6;
    // query validation
    console.log(req.query);
    if (req.query !== undefined && JSON.stringify(req.query) !== '{}') {
        if (req.query.words) {
            let wordsCount = Number(req.query.words);
            if (Number.isInteger(wordsCount)){
                if (wordsCount >= minWordsCount && wordsCount <= maxWordsCount) {
                    rolls = wordsCount;
                } else {
                    res.status(200).send(`Query parameter value must be between ${minWordsCount} and ${maxWordsCount}. Example: https://hipstapas.dev/api/wordlist?words=10`);
                    return;
                }
            } else {
                res.status(200).send(`Only numbers between ${minWordsCount} and ${maxWordsCount} are allowed as values for the query paramter "words". Example: https://hipstapas.dev/api/wordlist?words=10`);
                return;
            }
        } else {
            res.status(200).send(`Required query parameter "words" set to a number between ${minWordsCount} and ${maxWordsCount} is missing. Example: https://hipstapas.dev/api/wordlist?words=10`);
            return;
        }
    }
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

    res.status(200).send(words.join(' '));
}