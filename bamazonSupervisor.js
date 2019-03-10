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
Function Declarations
===============================
*/

function initialize() {
    connection.connect(function (err) {
        if (err) throw err;
        inquirer
          .prompt([
            {
              type: "list",
              choices: [
                "View Product Sales by Department",
                "Create New Department"
              ],
              message: "Select an operation.",
              name: "choice"
            }
          ])
          .then(answer => {
            query(answer.choice);
          });
    });
}

function query(choice) {
    connection.query(
        "SELECT item_id, product_name, price, stock_quantity FROM products",
        function (err, res) {
            if (err) throw err;
            actions(choice, res);
        }
    );
}

function actions(answer, res) {
    switch (answer) {
        case "View Product Sales by Department":
            viewSales();
            break;
        case "Create New Department":
            createDept();
            break;
        default:
            console.log("err");
    }
}

function viewSales() {

}

function createDept() {
    
}

/*
===============================
Function Calls
===============================
*/

initialize();