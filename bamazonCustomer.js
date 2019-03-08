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


/*
===============================
Function Declarations
===============================
*/

function initialize() {
    connection.connect(function (err) {
        if (err) throw err;
        connection.query(
            "SELECT item_id, product_name, price, stock_quantity FROM products",
            function (err, res) {
                if (err) throw err;
                for (var i = 0; i < res.length; i++) {
                    console.log("ID: " + res[i].item_id + " || " + "Product: " + res[i].product_name + " || " + "Price: " + res[i].price);
                }
                prompt(res);
            });
    });
}

function prompt(res) {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter the ID of the item you'd like to purchase.",
            name: "item_id",
            validate: function (value) {
                if (value <= res.length) {
                    return true;
                } else {
                    return "That item ID doesn't exist! Please enter another.";
                }
            }
        },
        {
            type: "input",
            message: "How many would you like to buy?",
            name: "amount"
        }
    ]).then(answer => {
        console.log(answer.item_id);
        console.log(answer.amount);
        console.log(res[answer.item_id - 1].stock_quantity);
        if (answer.amount > res[answer.item_id - 1].stock_quantity) {
            console.log("Insufficient Quantity! Please place another order.");
            initialize();
        } else {
            console.log("Success! Goodbye.");
            connection.end();
        }
    });
}

/*
===============================
Function Calls
===============================
*/

initialize();
