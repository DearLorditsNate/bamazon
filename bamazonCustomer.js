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

// cli-table3
var Table = require("cli-table3");

var table = new Table({
    head: ["Product ID", "Product", "Price"]
    , colWidths: [15, 25, 18]
});

/*
===============================
Function Declarations
===============================
*/

function initialize() {
    connection.connect(function (err) {
        if (err) throw err;
        query();
    });
}

function query() {
    connection.query(
        "SELECT item_id, product_name, price, stock_quantity, product_sales FROM products",
        function (err, res) {
            if (err) throw err;
            console.log("\n");
            for (var i = 0; i < res.length; i++) {
                table.push([
                    res[i].item_id,
                    res[i].product_name,
                    res[i].price
                ]);
            }
            console.log(table.toString());
            console.log("\n");
            welcome(res);
        });
}

function updateDatabase(response, answer) {
    connection.query(
      "UPDATE products SET ?, ? WHERE ?",
      [
          {
              stock_quantity:
                  response[answer.item_id - 1].stock_quantity - answer.amount
          },
          {
              product_sales: response[answer.item_id - 1].product_sales + (response[answer.item_id - 1].price * answer.amount)
          },
          {
              item_id: answer.item_id
          }
      ],
      function(err, res) {
          console.log("Your total cost was: $" + (response[answer.item_id - 1].price * answer.amount) + "\n");
      });
}

function welcome(res) {
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
        if (answer.amount > res[answer.item_id - 1].stock_quantity) {
            console.log("Insufficient Quantity! Please place another order.");
            query();
        } else {
            updateDatabase(res, answer);
            connection.end();
            console.log("\nThanks for shopping at Bamazon!");
        }
    });
}

/*
===============================
Function Calls
===============================
*/

initialize();
