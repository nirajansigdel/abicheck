const databaseConnector = require("../Configure/db");

const Darta = async (req, res) => {
  const { name, type, pan, email, phone, address, date, document } = req.body;

  try {
    if (!name || !type || !email || !phone || !address || !date || !document) {
      return res.status(400).json({ message: "Fields cannot be empty" });
    }

    const sql =
      "INSERT INTO darta (name, type, address, Phone, Email, document, date) VALUES (?,?,?,?,?,?,?)";

    databaseConnector.connection.query(
      sql,
      [name, type, pan, address, phone, email, document, date],
      (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Database error" });
        }

        return res.status(200).json({ message: "Insert successfully" });
      }
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// /select the data

// backend/controllers/dartaController.js
const getAllDarta = async (req, res) => {
  try {
    const sql = "SELECT * FROM rds.darta where created_by is null";

    databaseConnector.connection.query(sql, (error, results) => {
      if (error) {
        console.error("Error in getAllDarta:", error);
        return res.status(500).json({ message: "Database error" });
      }

      console.log("Results:", results); // Log results here

      return res.status(200).json(results);
    });
  } catch (error) {
    console.error("Error in getAllDarta:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deleteDarta = async (req, res) => {
  try {
    const { idea } = req.body; // Assuming you pass the idea value in the request body

    if (!idea) {
      return res
        .status(400)
        .json({ message: "Missing required parameter: idea" });
    }

    const sql = "DELETE FROM darta WHERE id = ?";

    databaseConnector.connection.query(sql, [id], (error, results) => {
      if (error) {
        console.error("Error in deleteDarta:", error);
        return res.status(500).json({ message: "Database error" });
      }

      if (results.affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "No matching row found for deletion" });
      }

      console.log("Deleted successfully:", results);

      return res.status(200).json({ message: "Row deleted successfully" });
    });
  } catch (error) {
    console.error("Error in deleteDarta:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const registrationDarta = async (req, res) => {
  const { name, type, email, phone, address, date, document } = req.body;

  try {
    if (!name || !type || !email || !phone || !address || !date || !document) {
      return res.status(400).json({ message: "Fields cannot be empty" });
    }

    // Validation .....

    let validateQuery = `SELECT phone, is_verified FROM rds.darta WHERE Phone = "${req.body.phone}"`;

    databaseConnector.connection.query(validateQuery, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Database error" });
      }

      if (result.length > 0) {
        return res.status(400).json({ message: "User already registered!" });
      }

      const sql =
        "INSERT INTO darta (name, type, address, Phone, Email, document, date) VALUES (?,?,?,?,?,?,?)";

      databaseConnector.connection.query(
        sql,
        [name, type, address, phone, email, document, date],
        (error, result) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: "Database error" });
          }

          return res.status(200).json({ message: "Insert successfully" });
        }
      );
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const verifyDarta = async (req, res) => {
  try {
    if (!req.body.mobileNumber || !req.body.status) {
      return res.status(400).json({ message: "Fields cannot be empty!" });
    }

    // Validation .....

    let validateQuery = `SELECT * FROM rds.darta WHERE Phone = ${req.body.mobileNumber}`;

    databaseConnector.connection.query(validateQuery, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Database error" });
      }

      if (result && result.length > 0 && req.body.status == 1) {
        if (result[0].is_verified == 1) {
          return res
            .status(400)
            .json({
              message:
                "User is Already in accept status try something diffrent!",
            });
        }
      }

      if (result && result.length <= 0) {
        return res.status(400).json({ message: "User not registered yet!" });
      }

      let sql = `UPDATE rds.darta SET is_verified = "${req.body.status}" , created_by= "${req.body.mobileNumber}", rejection_message = "Congratulations your company has been rejistred sucessfully!" WHERE Phone = ${req.body.mobileNumber}`;

      if (req.body.status == 0) {
        sql = `UPDATE rds.darta SET is_verified = "${req.body.status}",rejection_message = "${req.body.rejectionMessage}",created_by= "${req.body.mobileNumber}"  WHERE Phone = "${req.body.mobileNumber}"`;
      }

      databaseConnector.connection.query(sql, (error, result) => {
        if (error) {
          console.error(error);
          return res.status(500).json({ message: "Database error" });
        }

        if (
          req &&
          req.body &&
          req.body.status == 0 &&
          result.affectedRows > 0
        ) {
          // todo

          let acceptRejectMessage = `${req.body.rejectionMessage}`;
          let mobileNumber = req.body.mobileNumber;

          const logSql =
            "INSERT INTO rds.accept_reject_messages (accept_reject_message,mobile) VALUES (?,?)";

          databaseConnector.connection.query(
            logSql,
            [acceptRejectMessage, mobileNumber],
            (error, result) => {
              if (error) {
                console.error(error);
                return res.status(500).json({ message: "Database error" });
              }
            }
          );

          if (result && result.affectedRows > 0) {
            return res
              .status(200)
              .json({
                message: "Rejected successfully",
                responseData: JSON.stringify(req.body),
              });
          }
        } else if (
          req &&
          req.body &&
          req.body.status == 1 &&
          result.affectedRows > 0
        ) {
          // todo

          let acceptRejectMessage =
            "Congratulations your company has been rejistred sucessfully!";
          let mobileNumber = req.body.mobileNumber;

          const logSql =
            "INSERT INTO rds.accept_reject_messages (accept_reject_message,mobile) VALUES (?,?)";

          databaseConnector.connection.query(
            logSql,
            [acceptRejectMessage, mobileNumber],
            (error, result) => {
              if (error) {
                console.error(error);
                return res.status(500).json({ message: "Database error" });
              }
            }
          );
          return res.status(200).json({ message: "Verified successfully" });
        }
      });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getDartaDetails = async (req, res) => {
  try {
    let queryDetails = `SELECT * FROM rds.darta WHERE is_verified = 1`;

    databaseConnector.connection.query(queryDetails, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Database error" });
      }

      if (result && result.length <= 0) {
        return res.status(400).json({ message: "Data not found" });
      }

      return res
        .status(200)
        .json({ message: "Data successfully Fetched", dataResults: result });
    });
  } catch (error) {
    console.log(`Error occured from get darta details ${error}`);
  }
};

const getAcceptRejectMessage = async (req, res) => {
  try {
    let queryDetails = `SELECT * FROM rds.accept_reject_messages WHERE mobile = "${req.body.mobileNumber}"`;

    databaseConnector.connection.query(queryDetails, (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Database error" });
      }

      if (result && result.length <= 0) {
        return res.status(400).json({ message: "Data not found" });
      }

      return res.status(200).json({ data: result });
    });
  } catch (error) {
    console.log(`Error occured from get darta details ${error}`);
  }
};

module.exports = {
  Darta,
  getAllDarta,
  deleteDarta,
  registrationDarta,
  verifyDarta,
  getDartaDetails,
  getAcceptRejectMessage,
};

/*
    
 CREATE TABLE rds.darta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) ,
    type VARCHAR(255) ,
    address VARCHAR(255) ,
    Phone VARCHAR(255) ,
    Email VARCHAR(255) ,
    document TEXT ,
    date VARCHAR(255),
    is_verified TINYINT DEFAULT 0
);


ALTER TABLE rds.darta
ADD COLUMN rejection_message TEXT,
ADD COLUMN created_by VARCHAR(255);


CREATE TABLE rds.accept_reject_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    accept_reject_message TEXT,
    mobile VARCHAR(255)
);



);
*/
