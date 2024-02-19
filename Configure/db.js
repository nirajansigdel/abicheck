var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root", // Add your actual password here
    database: "rds",
    port:"3307"
});

connection.connect(function(error) {
    if (error) throw error;
    console.log("Connected successfully");
});
 module.exports={
    connection
 }