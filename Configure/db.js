var mysql = require("mysql2");

var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "P@ssw0rd", // Add your actual password here
    database: "db_darta_system",
    port:"3306"
});

connection.connect(function(error) {
    if (error) throw error;
    console.log("Connected successfully");
});
 module.exports={
    connection
 } 

 