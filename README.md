# bamazon

A Node.js and MySQL CLI app that allows for interaction with a virtual store through three different Node.js interfaces: Customer, Manager, and Supervisor

**Customer Features:**
* View products for sale
* Purchase products
    * Updates MySQL inventory numbers

**Manager Features:**
* View products and inventory
* View products with low inventory (less than 5 items)
* Add inventory
    * Updates MySQL inventory numbers
* Add product
    * Updates all columns in MySQL

**Supervisor Features:**
* View sales by department
    * MySQL joins tables and calculates net profit on the fly
* Add department
    * Creates a new department in MySQL that products can be added to

## Workflow

### Video Demo
[Bamazon Demo](https://youtu.be/Ru-dd_VgaQU)