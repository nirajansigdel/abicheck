const crypto = require("crypto");
const key = "4e7d9f6a67cfb22a0b4c43d8e7c3e0a8";

const encryptAES = (text) => {
  const iv = crypto.randomBytes(16);
  // Generate a random IV (Initialization Vector)
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return {
    iv: iv.toString("hex"),
    encryptedData: encrypted,
  };
};

const decryptAES = (encryptedData, iv) => {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(key),
    Buffer.from(iv, "hex")
  );
  let decrypted = decipher.update(encryptedData, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};

module.exports = { encryptAES, decryptAES };
