var mysql = require("mysql2");

var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Suz26srs77@MySQL", // Add your actual password here
  database: "rds",
  port: "3306",
});

connection.connect(function (error) {
  if (error) throw error;
  console.log("Connected successfully");
});
module.exports = {
  connection,
};
