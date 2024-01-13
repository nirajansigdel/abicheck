var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "", // Add your actual password here
    database: "rds"
});

connection.connect(function(error) {
    if (error) throw error;
    console.log("Connected successfully");
});
 module.exports={
    connection
 }