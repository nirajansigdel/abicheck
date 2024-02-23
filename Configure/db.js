var mysql = require("mysql2");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root", // Add your actual password here
    database: "rds",
    port:"3306"
});

connection.connect(function(error) {
    if (error) throw error;
    console.log("Connected successfully");
});
 module.exports={
    connection
 } 

 