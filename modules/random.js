/**
 * hipstapas.dev own random function using Node.js crypto module for generating 
 * cryptographically strong pseudo-random data in order to generate 'good' random numbers.
 * https://nodejs.org/api/crypto.html#crypto_crypto_randombytes_size_callback 
 */

const crypto = require('crypto');

/**
 * Returns a random integer within the range defined by min and max
 * @param {!number} min 
 * @param {!number} max 
 * @returns {!number} Random integer between min and max
 */
function randomNumber(min, max) {  
  const maxDecimal = 281474976710656;   // 2^48
  const maxBytes = 6; 
  let randomBytesBuffer = crypto.randomBytes(maxBytes);  // 6 bytes * 8 bits = 48 
  let randomBytes = parseInt(randomBytesBuffer.toString('hex'), 16);
  let randomNumberInRange = Math.floor(randomBytes / maxDecimal * (max - min + 1) + min);
  return randomNumberInRange;
}

/**
 * Take a character at a random position from the specified input string
 * @param {string} alphabet
 * @returns {string} random character (actually a string with the length of one) from the specified input string
 */
function randomCharacter(alphabet) {
  let position = randomNumber(0, alphabet.length);
  return alphabet[position];
}

module.exports = { randomNumber, randomCharacter };