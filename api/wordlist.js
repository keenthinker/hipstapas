import { randomNumber } from '../modules/random.js';
import { wordlist1Map } from '../modules/wordlist1.js';

module.exports = (req, res) => {
    var words = [];
    var rolls = new Map();
    var i = 0;
    while (i < 5) {
        var roll1 = randomNumber(1, 6);
        var roll2 = randomNumber(1, 6);
        var roll3 = randomNumber(1, 6);
        var roll4 = randomNumber(1, 6);
        // Just to be sure there are no duplicates,
        // check that every new roll does not match previous ones! 
        let roll = `${roll1}${roll2}${roll3}${roll4}`;
        if (!rolls.has(roll)) {
            rolls.set(roll, roll);
            words.push(wordlist1Map.get(roll));
            i++;
        }
    }
    res.status(200).send(words.join(' '));
}