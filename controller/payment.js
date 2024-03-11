const connector = require("../Configure/db");

const addPayment = (req, res) => {
  const { walletId, amount, package, dartaId } = req.body;

  if (!walletId || !amount || !package) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const createdDate = new Date().toISOString().slice(0, 19).replace("T", " ");
  const endDate = new Date(createdDate);
  endDate.setMonth(endDate.getMonth() + package);

  const paymentData = {
    WalletId: walletId,
    Amount: amount,
    Package: package,
    CreatedDate: createdDate,
    EndDate: endDate.toISOString().slice(0, 19).replace("T", " "),
    DartaId:dartaId
  };

  const sqlQuery = "INSERT INTO payment SET ?";

  connector.connection.query(sqlQuery, paymentData, (error, results, fields) => {
    if (error) {
      console.error("Error inserting payment: " + error.message);
      return res.status(500).json({ message: "Error inserting payment" });
    }
    console.log("Payment inserted successfully with id: ", results.insertId);
    res
      .status(200)
      .json({
        message: "Payment inserted successfully",
        paymentId: results.insertId,
      });
  });
};

const getPaymentByWalletId = async (req, res) => {
  const { emailId } = req.params;

  if (!emailId) {
    return res.status(400).json({ message: "emailId is invalid" });
  }

  connector.connection.query(
    "SELECT * FROM payment WHERE WalletId = ?",
    [emailId],
    (error, results, fields) => {
      if (error) {
        console.error("Error fetching payments: " + error.message);
        return res.status(500).json({ message: "Error fetching payments" });
      }
      res.status(200).json(results);
    }
  );
};

module.exports ={
    addPayment, getPaymentByWalletId
}