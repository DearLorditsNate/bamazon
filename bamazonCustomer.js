/*
===============================
Initialize Packages
===============================
*/

// .env
require("dotenv").config();

// Keys
var keys = require("./keys.js");

// MySQL
var mysql = require("mysql");
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: keys.mysql.password,
    database: "bamazon"
});

// Inquirer
var inquirer = require("inquirer");

/*
===============================
Global Varialbes
===============================
*/

connection.connect(function(err) {
    if (err) throw err;
    connection.query(
        "SELECt item_id, product_name, price FROM products",
        function(err, res) {
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                console.log("ID: " + res[i].item_id + " || " + "Product: " + res[i].product_name + " || " + "Price: " + res[i].price);
            }
            connection.end();
        });
})
