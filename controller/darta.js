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
        async (error, result) => {
          if (error) {
            console.error(error);
            return res.status(500).json({ message: "Database error" });
          }

          if (result) {
            return res
              .status(200)
              .json({ message: "Insert successfully", data: result.insertId });
          }
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
          return res.status(400).json({
            message: "User is Already in accept status try something diffrent!",
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
            return res.status(200).json({
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

const getDartaByEmail = async (req, res) => {
  const { email } = req.params;
  if (!email) {
    return res.status(400).json({ message: "Missing Fields" });
  }

  const query = "SELECT * FROM darta WHERE EMAIL=?";
  databaseConnector.connection.query(query, [email], async (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Database error" });
    }

    if (result && result.length <= 0) {
      return res.status(400).json({ message: "Data not found" });
    }

    return res.status(200).json({ data: result });
  });
};

const getDartaById = async (req, res) => {
  const { id } = req.params;
  const query = "SELECT * FROM darta WHERE id=?";
  databaseConnector.connection.query(query, [id], async (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).json({ message: "Database error" });
    }
    if (result.length > 0) {
      return res.status(200).json({ data: result[0] });
    }
    return res.status(200).json({ data: result });
  });
};
const getUnverifiedData = async (req, res) => {
  try {
    const sql = "SELECT * FROM darta where is_verified = 0";

    databaseConnector.connection.query(sql, (error, results) => {
      if (error) {
        console.error("Error in getAllDarta:", error);
        return res.status(500).json({ message: "Database error" });
      }

      return res.status(200).json(results);
    });
  } catch (error) {
    console.error("Error in getAllDarta:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const putVerifyDarta = async (req, res) => {
  const { isFormVerified, isDocVerified, isPaymentVerified, emailId } =
    req.body;
  const sqlQuery =
    "UPDATE darta SET isFormVerified=?, isDocVerified=?, isPaymentVerified=? where Email=?";
  try {
    databaseConnector.connection.query(
      sqlQuery,
      [isFormVerified, isDocVerified, isPaymentVerified, emailId],
      async (error, results) => {
        if (error) {
          return res.status(500).json({ message: "Database error" });
        }
        if (results) {
          postNotification({
            isVerified: isFormVerified,
            type: "Form",
            email: emailId,
          });
          postNotification({
            isVerified: isDocVerified,
            type: "Document",
            email: emailId,
          });
          postNotification({
            isVerified: isPaymentVerified,
            type: "Payment",
            email: emailId,
          });
          if (isDocVerified && isFormVerified && isPaymentVerified)
            await putIsDartaVerify({ emailId: emailId, isVerify: true });

          return res.status(200).json(results);
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const putDiscardVerify = async (req, res) => {
  const { isFormVerified, isDocVerified, isPaymentVerified, remarks, emailId } =
    req.body;
  const sqlQuery =
    "UPDATE darta SET isFormVerified=?, isDocVerified=?, isPaymentVerified=?, rejection_message=? where Email=?";

  try {
    databaseConnector.connection.query(
      sqlQuery,
      [isFormVerified, isDocVerified, isPaymentVerified, remarks, emailId],
      async (error, results) => {
        if (error) {
          return res.status(500).json({ message: "Database error" });
        }
        if (results) {
          await putIsDartaVerify({ emailId: emailId, isVerify: false });
          await postNotification({
            isVerified: isFormVerified,
            type: "Form",
            email: emailId,
          });
          await postNotification({
            isVerified: isDocVerified,
            type: "Document",
            email: emailId,
          });
          await postNotification({
            isVerified: isPaymentVerified,
            type: "Payment",
            email: emailId,
          });
          return res.status(200).json({ message: "Successfully updated" });
        }
      }
    );
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const downloadVerifiedDarta = async (req, res) => {
  const isVerify = req.params.isVerify === "true";
  const query = "SELECT * FROM darta where is_verified =?"; // Replace 'your_table' with your table name
  databaseConnector.connection.query(
    query,
    [isVerify],
    (error, results, fields) => {
      if (error) {
        console.error("Error executing query: " + error.stack);
        return res.status(500).send("Error fetching data from database");
      }

      // Format data as CSV
      const fieldNames = fields.map((field) => field.name);

      // Format data as CSV
      const csvData = [
        fieldNames.join(","), // Include field names as the first row
        ...results.map((row) =>
          fieldNames.map((fieldName) => row[fieldName]).join(",")
        ),
      ].join("\n");
      // Set response headers for file download
      res.setHeader("Content-disposition", "attachment; filename=data.csv");
      res.set("Content-Type", "text/csv");

      // Send CSV data as response
      res.status(200).send(csvData);
    }
  );
};

const putIsDartaVerify = async (data, res) => {
  const { emailId, isVerify } = data;

  const sqlQuery = "UPDATE darta SET is_verified=? where Email=?";

  databaseConnector.connection.query(
    sqlQuery,
    [isVerify, emailId],
    (errors, results, fields) => {
      if (errors) {
        return false;
      }
      if (results) {
        return true;
      }
    }
  );
};

const isDupEmail = async (req, res) => {
  const { email } = req.params;
  const sqlQuery = "SELECT * FROM darta WHERE EMAIL=?";
  databaseConnector.connection.query(sqlQuery, [email], (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Database Error" });
    }
    if (result.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }
    return res.status(200).json({ message: "Valid Fields" });
  });
};

const isDupName = async (req, res) => {
  const { name } = req.params;
  const sqlQuery = "SELECT * FROM darta WHERE Name=?";
  databaseConnector.connection.query(sqlQuery, [name], (error, result) => {
    if (error) {
      return res.status(500).json({ message: "Database Error" });
    }
    if (result.length > 0) {
      return res.status(400).json({ message: "Name already exists" });
    }
    return res.status(200).json({ message: "Valid Fields" });
  });
};

const postNotification = async (data) => {
  const { isVerified, type, email } = data;
  const message = isVerified
    ? `${type} is verified for ${email}`
    : `${type} is not verified ${email}`;

  const insertData = {
    accept_reject_messages: message,
    email: email,
  };

  const query =
    "INSERT INTO rds.accept_reject_messages (accept_reject_message, email) VALUES (?, ?)";

  try {
    databaseConnector.connection.query(
      query,
      [message, email],
      async (errors, results, fields) => {
        if (errors) {
          return false;
          // reject(error);
        }
        if (results) {
          return true;
          // resolve(true);
        }
      }
    );
  } catch (error) {
    console.log({ error });
  }
};

const getNotificationsById = async (req, res) => {
  const { email } = req.params;
  const query = "SELECT * from accept_reject_messages WHERE email=? ";
  databaseConnector.connection.query(query, [email], (errors, results) => {
    if (errors) {
      return res.status(500).json({ message: "Database error" });
    }
    if (results.length > 0) {
      return res.status(200).json({ data: results });
    }
  });
};
module.exports = {
  Darta,
  getAllDarta,
  deleteDarta,
  registrationDarta,
  verifyDarta,
  getDartaDetails,
  getAcceptRejectMessage,
  getDartaByEmail,
  getUnverifiedData,
  putVerifyDarta,
  putDiscardVerify,
  downloadVerifiedDarta,
  putIsDartaVerify,
  isDupName,
  isDupEmail,
  getDartaById,
  getNotificationsById,
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
