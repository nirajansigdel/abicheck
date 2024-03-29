const tokenUtil = require("../utils/optGenerator");
const mailSender = require("../utils/sendEmail");
const connector = require("../Configure/db");

const createToken = async (req, res) => {
  const { walletId } = req.body;
  const createdDate = new Date().toISOString().slice(0, 19).replace("T", " ");

  const tokenData = {
    WalletId: walletId,
    token: tokenUtil.generateOTP(),
    CreationDate: createdDate,
    CreationTime: createdDate,
    ExpiryTime: createdDate,
  };

  const sql = "SELECT * FROM token where WalletId=?";
  connector.connection.query(
    sql,
    [walletId],
    async (error, results, fields) => {
      if (error) {
        console.error("Error creating token: " + error.message);
        //   return res.status(500).json({ message: "Error creating token user" });
      }
      console.log(results);
      if (results.length === 0) {
        // User with the given walletId does not exist
        const sqlQuery = "INSERT INTO token SET ?";
        connector.connection.query(
          sqlQuery,
          tokenData,
          async (error, results, fields) => {
            if (error) {
              console.error("Error creating token: " + error.message);
              //   return res.status(500).json({ message: "Error creating token user" });
            }
            console.log({ results });
            if (results) {
              const sqlSelectQuery = "SELECT * FROM token WHERE WalletId=?";
              connector.connection.query(
                sqlSelectQuery,
                [walletId],
                async (selectError, selectResults, selectFields) => {
                  if (selectError) {
                    console.error(
                      "Error fetching updated record: " + selectError.message
                    );
                    // Handle select error
                  } else {
                    // Use the updated record from selectResults
                    const updatedRecord = selectResults[0]; // Assuming walletId is unique
                    const isSent = await mailSender.sendEmail(
                      walletId,
                      "Token",
                      `Here is your token:${updatedRecord.Token} `
                    );
                  }
                }
              );
            }
          }
        );
      }

      // User found, now check if password matches
      if (results.length > 0) {
        try {
          const sqlQuery = "UPDATE token SET Token=? where WalletId=?";
          connector.connection.query(
            sqlQuery,
            [tokenUtil.generateOTP(), walletId],
            async (error, results, fields) => {
              if (error) {
                console.error("Error creating token: " + error.message);
                //   return res.status(500).json({ message: "Error creating token user" });
              }
              if (results) {
                const sqlSelectQuery = "SELECT * FROM token WHERE WalletId=?";
                connector.connection.query(
                  sqlSelectQuery,
                  [walletId],
                  async (selectError, selectResults, selectFields) => {
                    if (selectError) {
                      console.error(
                        "Error fetching updated record: " + selectError.message
                      );
                      // Handle select error
                    } else {
                      // Use the updated record from selectResults
                      const updatedRecord = selectResults[0]; // Assuming walletId is unique
                      const isSent = await mailSender.sendEmail(
                        walletId,
                        "Token",
                        `Here is your token:${updatedRecord.Token} `
                      );
                    }
                  }
                );
              }
            }
          );
        } catch (error) {
          console.log({ error });
        }
      }
    }
  );
};

const validateToken = (req, res) => {
  const { token, walletId } = req.body;
  const sqlQuery = "SELECT * FROM token where WalletId=? AND Token=?";
  const query = "UPDATE rds.authentication SET isOtpValid=? where email=?";
  let isValid = false;

  connector.connection.query(
    sqlQuery,
    [walletId, token],
    async (error, results, fields) => {
      if (error) {
        console.error("Error while validating token: " + error.message);
        return res.status(500).json({ message: "Error creating token user" });
      }
      console.log({ results });
      if (results.length === 0) {
        // User with the given walletId does not exist
        isValid = false;
        connector.connection.query(
          query,
          [isValid, walletId],
          async (error, results, fields) => {
            if (error) {
              console.error(error);
            }
          }
        );
        return res.status(400).json({ message: "Token does not exist" });
      }
      if (results.length > 0) {
        isValid = true;
        connector.connection.query(
          query,
          [isValid, walletId],
          async (error, results, fields) => {
            if (error) {
              console.error(error);
            }
          }
        );
        return res.status(200).json({ message: "Valid token" });
      }
    }
  );
};
module.exports = { createToken, validateToken };
