const connector = require("../Configure/db");
const { createToken } = require("./token");
const {decryptAES, encryptAES} = require("../utils/encrypt")

const addNewUser = async (req, res) => {
  const { walletId, password } = req.body;
  if (!walletId || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const walletData = {
    WalletId: walletId,
    Password:JSON.stringify(encryptAES(password)),
  };

  const sqlQuery = "INSERT INTO wallet SET ?";

  connector.connection.query(sqlQuery, walletData, (error, results, fields) => {
    if (error) {
      console.error("Error inserting wallet: " + error.message);
      return res.status(500).json({ message: error.message });
    }
    console.log("User inserted successfully with id: ", results.insertId);
    res.status(200).json({
      message: "User inserted successfully",
    });
  });
};

const isWalletUserExist = async (req, res) => {
  const { walletId, password } = req.body;
  if (!walletId || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const sqlQuery = "SELECT * FROM wallet WHERE walletId=?";

  connector.connection.query(
    sqlQuery,
    [walletId],
    async (error, results, fields) => {
      if (error) {
        console.error("Error querying wallet: " + error.message);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (results.length === 0) {
        // User with the given walletId does not exist
        return res.status(400).json({ message: "User does not exist" });
      }

      // User found, now check if password matches
      const user = results[0]; // Assuming walletId is unique
      const parsePassword= JSON.parse(user.Password)
      const decryptedPass= decryptAES(parsePassword.encryptedData,parsePassword.iv )
      if (decryptedPass !== password) {
        // Password does not match
        return res.status(401).json({ message: "Incorrect password" });
      }

      try {
        // Call createToken and wait for it to complete
        await createToken(req, res);
        // Send response after createToken is completed
        return res
          .status(200)
          .json({ message: "User exists and password is correct" });
      } catch (error) {
        // Handle errors from createToken
        console.error("Error creating token: " + error.message);
        return res.status(500).json({ message: "Error creating token" });
      }
    }
  );
};
module.exports = { addNewUser, isWalletUserExist };
