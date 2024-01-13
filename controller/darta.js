
const databaseConnector = require("../Configure/db");

const Darta = async (req, res) => {
  const { name, type, pan, email, phone, address, date, document } = req.body;
  
  try {
    if (!name || !type || !pan || !email || !phone || !address || !date || !document) {
      return res.status(400).json({ message: "Fields cannot be empty" });
    }

    const sql = "INSERT INTO darta (name, type, pan, address, Phone, Email, document, date) VALUES (?,?,?,?,?,?,?,?)";

    databaseConnector.connection.query(sql, [name, type, pan, address, phone, email, document, date], (error, result) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Database error" });
      }

      return res.status(200).json({ message: "Insert successfully" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

///select the data

// backend/controllers/dartaController.js
const getAllDarta = async (req, res) => {
  try {
    const sql = "SELECT * FROM darta";

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



module.exports = {
  Darta,getAllDarta
};
