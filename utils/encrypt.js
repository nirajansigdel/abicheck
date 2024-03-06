const encryptAES = (password) => {
  let encryptedPassword = "";
  for (let i = 0; i < password.length; i++) {
    const charCode = password.charCodeAt(i);
    // Shift each character by a fixed amount
    const shiftedCharCode = charCode + 1; // For example, shifting by 1
    // Additional process: Convert shifted char code to hexadecimal
    const encryptedCharCode = shiftedCharCode.toString(16);
    encryptedPassword += encryptedCharCode;
  }
  return encryptedPassword;
};

const decryptAES = (encryptedPassword) => {
  let decryptedPassword = "";
  for (let i = 0; i < encryptedPassword.length; i += 2) {
    const hexCode = encryptedPassword.substr(i, 2);
    // Reverse the additional process: Convert hexadecimal back to decimal
    const shiftedCharCode = parseInt(hexCode, 16);
    // Reverse the shift applied during encryption
    const decryptedCharCode = shiftedCharCode - 1; // Shifting back by 1
    decryptedPassword += String.fromCharCode(decryptedCharCode);
  }
  return decryptedPassword;
};

module.exports = { encryptAES, decryptAES };
