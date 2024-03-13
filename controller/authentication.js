const databaseconnector = require("../Configure/db");
const { encryptAES, decryptAES } = require("../utils/encrypt");
const { createToken } = require("./token");

//==========================Regsitration section============================

const Registration = async (req, res) => {
  const { email, password, role } = req.body;
  try {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format." });
    }

    // Password validation
    const passwordRegex = /^(?=.*\d)(?=.*[A-Z])(?=.*\W)(?!.*\s).*$/;
    if (!password || !passwordRegex.test(password)) {
      return res.status(400).json({
        message:
          "Password should contain at least one digit, one uppercase letter, and one special character.",
      });
    }

    // Set default role to "user" if not provided
    const userRole = role || "user";

    const sql =
      "INSERT INTO authentication (email, password, role) VALUES (?, ?, ?)";
    databaseconnector.connection.query(
      sql,
      [email, encryptAES(password), userRole],
      async (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Database error" });
        }
        try {
          const req = { body: { walletId: email } };
          await createToken(req, res);
        } catch (error) {}

        return res.status(200).json({ message: "Registration successfully" });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//==========================login section============================

const Login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const query = "SELECT * FROM authentication WHERE email=?";
    databaseconnector.connection.query(query, [email], (error, result) => {
      if (error) {
        return res.status(500).json({ message: "Database connection error" });
      }
      if (result.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }

      const user = result[0];
      if (decryptAES(user.password) !== password) {
        return res.status(401).json({ message: "Password invalid" });
      }

      if (!user.isOtpValid)
        return res.status(401).json({ message: "Token not validated" });

      // Include the user role in the response
      res.status(200).json({ message: "Login successfully", userDetail: user });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const reVerifyUserToken = async (req, res) => {
  const { email } = req.params;
  console.log({ email });
  try {
    const query = "SELECT * FROM authentication WHERE email=?";
    databaseconnector.connection.query(
      query,
      [email],
      async (error, result) => {
        if (error) {
          return res.status(500).json({ message: "Database connection error" });
        }
        if (result.length === 0) {
          return res.status(401).json({ message: "User not Registered" });
        }
        const user = result[0];

        if (!user.isOtpValid) {
          const req = { body: { walletId: email } };
          await createToken(req, res);
        }
        // Include the user role in the response
        res.status(200).json({ message: "Token Sent", userDetail: user });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  Login,
  Registration,
  reVerifyUserToken,
};
