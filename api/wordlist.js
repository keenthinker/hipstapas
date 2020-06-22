import { randomNumber } from '../modules/random.js';
import { wordlist1Map } from '../modules/wordlist1.js';

module.exports = (req, res) => {
    var words = [];
    for (var i = 0; i < 5; i++) {
        var pos1 = randomNumber(1, 6);
        var pos2 = randomNumber(1, 6);
        var pos3 = randomNumber(1, 6);
        var pos4 = randomNumber(1, 6);
        // TODO just to be sure there are no duplicates - check every new pos that it does not match previous ones! 
        let pos = `${pos1}${pos2}${pos3}${pos4}`;
        words.push(wordlist1Map.get(pos));
    }
    res.status(200).send(words.join(' '));
}