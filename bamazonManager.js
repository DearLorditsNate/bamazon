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
  connection.connect(function(err) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          type: "list",
          choices: [
            "View Products for Sale",
            "View Low Inventory",
            "Add to Inventory",
            "Add New Product"
          ],
          message: "Select an operation.",
          name: "choice"
        }
      ])
      .then(answer => {
          query(answer.choice)
      });
  });
}

function query(choice) {
  connection.query(
    "SELECT item_id, product_name, price, stock_quantity FROM products",
    function(err, res) {
      if (err) throw err;
      actions(choice, res);
    }
  );
}

function actions(answer, res) {
    switch(answer) {
        case "View Products for Sale":
            viewProducts();
            break;
        case "View Low Inventory":
            viewLowInv();
            break;
        case "Add to Inventory":
            addInv(res);
            break;
        case "Add New Product":
            addProduct();
            break;
        default:
            console.log("err");
    }
}

function viewProducts() {
    connection.query(
      "SELECT item_id, product_name, price, stock_quantity FROM products",
      function(err, res) {
        if (err) throw err;
        console.log("\n");
        for (var i = 0; i < res.length; i++) {
          console.log(
            "ID: " +
              res[i].item_id +
              " || " +
              "Product: " +
              res[i].product_name +
              " || " +
              "Price: " +
              res[i].price + " || " + "Quantity: " + res[i].stock_quantity
          );
        }
        console.log("\n");
        connection.end();
      }
    );
}

function viewLowInv() {
    connection.query(
        "SELECT item_id, product_name, price, stock_quantity FROM products",
        function (err, res) {
            if (err) throw err;
            console.log("\n");
            for (var i = 0; i < res.length; i++) {
                if (res[i].stock_quantity < 5) {
                    console.log(
                        "ID: " +
                        res[i].item_id +
                        " || " +
                        "Product: " +
                        res[i].product_name +
                        " || " +
                        "Price: " +
                        res[i].price + " || " + "Quantity: " + res[i].stock_quantity
                    );
                }
            }
            console.log("\n");
            connection.end();
        }
    );
}

function addInv(res) {
    inquirer
      .prompt([
        {
          type: "input",
          message:
            "Enter the ID of the item you'd like to add inventory to.",
          name: "item_id",
          validate: function(value) {
            if (value <= res.length && value > 0) {
              return true;
            } else {
              return "That item ID doesn't exist! Please enter another.";
            }
          }
        },
        {
          type: "input",
          message: "How many would you like to add?",
          name: "amount"
        }
      ])
      .then(answer => {
          connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                  {
                      stock_quantity:
                          res[answer.item_id - 1].stock_quantity + parseInt(answer.amount)
                  },
                  {
                      item_id: answer.item_id
                  }
              ],
              function (err, res) {
                  console.log("\nInventory successfully added." + "\n");
                  connection.end();
              });
      });
}

function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            message: "Enter Prodcut Name:",
            name: "name"
        },
        {
            type: "input",
            message: "Enter Product Department:",
            name: "department"
        },
        {
            type: "input",
            message: "Enter Price:",
            name: "price"
        },
        {
            type: "input",
            message: "Enter Inventory Amount:",
            name: "inventory"
        }
    ]).then(answer => {
        connection.query(
            "INSERT INTO products SET ?",
            {
                product_name: answer.name,
                department_name: answer.department,
                price: parseInt(answer.price),
                stock_quantity: parseInt(answer.inventory)
            },
            function (err, res) {
                if (err) throw err;
                console.log("\nItem successfully added.\n");
                connection.end();
            });
    });
}

/*
===============================
Function Calls
===============================
*/

initialize();