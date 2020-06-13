const crypto = require('crypto');

function randomNumber(min, max) {  
  var maxDecimal = 281474976710656;   // 2^48
  var randomBytesBuffer = crypto.randomBytes(6);  // 6 bytes * 8 bits = 48 
  var randomBytes = parseInt(randomBytesBuffer.toString('hex'), 16);
  var randomNumberInRange = Math.floor(randomBytes / maxDecimal * (max - min + 1) + min);
  return randomNumberInRange;
}

function randomCharacter(alphabet) {
  let position = randomNumber(0, alphabet.length);
  return alphabet[position];
}

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

function generate(options) {
  let lmin = options.lengthMin;
  let lmax = options.lengthMax;

  let alphabetSmall = "abcdefghijklmnopqrstuvwxyz";
  let alphabetCapital = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let alphabetNumbers = "0123456789";
  let alphabetSpecial = ".,+-*/!?;:{}()[]%$&~#@|";
  let alphabet = alphabetSmall + alphabetCapital + alphabetNumbers + alphabetSpecial;

  let text = [];
  var bounds = calculateLowerAndUpperBound(lmin, lmax);
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

module.exports = (req, res) => {
    var lmin = 16;
    var lmax = 32;
    if (req.body) {
      lmin = req.body.min || 16;
      lmax = req.body.max || 32;
    }
    //res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-Id, Content-Type, Accept');
    res.status(200).send(generate({ 
      lengthMin: lmin, 
      lengthMax: lmax,
      resultsCount: 1
     }));
  }