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
    // Sets MySQL mode to allow GROUP_BY to function properly
    connection.query(
      "SET sql_mode = (SELECT REPLACE(@@sql_mode, 'ONLY_FULL_GROUP_BY', ''));"),
      function (err, res) {
        connection.end();
      }
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
        actions(answer.choice);
      });
  });
}

// function query(choice) {
//     connection.query(
//       "SELECT * FROM products JOIN departments ON products.department_name = departments.department_name",
//       function(err, res) {
//         if (err) throw err;
//         console.log(res);
//         // actions(choice, res);
//       }
//     );
// }

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
  connection.query(
    "SELECT departments.*, SUM(product_sales) AS sales, (SUM(product_sales) - departments.over_head_costs) AS total_profit FROM products RIGHT JOIN departments ON products.department_name = departments.department_name GROUP BY departments.department_name ORDER BY total_profit DESC;",
    function(err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        if (res[i].sales === null) {
          res[i].sales = 0;
        }
        if (res[i].total_profit === null) {
          res[i].total_profit = 0;
        }
        console.log("Department ID: " + res[i].department_id + " || " + "Department Name: " + res[i].department_name + " || " + "Over Head Costs: " + res[i].over_head_costs + " || " + "Product Sales: " + res[i].sales + " || " + "Total Profit: " + res[i].total_profit);
      }
      connection.end();
    });
}

function createDept() {

}

/*
===============================
Function Calls
===============================
*/

initialize();