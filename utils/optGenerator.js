const crypto = require('crypto');

const generateOTP =()=> {
  // Generate a random number between 0 and 999999 (inclusive)
  const randomNum = crypto.randomInt(0, 1000000);
  const token = String(randomNum).padStart(6, '0');
  
  return token;
}

module.exports= {generateOTP}