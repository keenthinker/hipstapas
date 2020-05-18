function randomNumber(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; 
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
    upperBound = randomNumber(lowerBound, maxLength + 1);
  }
  else if ((minLength > 0) && (maxLength <= 0))
  {
    lowerBound = minLength;
    upperBound = randomNumber(minLength, randomUpperBound);
  }
  else
  {
    lowerBound = randomNumber(minLength, maxLength + 1);
    var max = Math.max(lowerBound, maxLength + 1);
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
    res.status(200).send(generate({ 
      lengthMin: lmin, 
      lengthMax: lmax,
      resultsCount: 1
     }));
  }