const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const db = mysql.createConnection(
	{
		host: "127.0.0.150",
		user: "root",
		password: "12345",
		database: "employees",
	},
	console.log("Connected to database")
);

db.connect((e) => {
	if (e) throw e;
	console.log("connected to the employee database");
});

const promptQuestions = () => {
	inquirer
		.prompt([
			{
				type: "list",
				name: "choices",
				message: "What would you like to do?",
				choices: [
					{
						name: "View all Departments",
						value: "VIEW_DEPARTMENTS",
					},
					{
						name: "View all Employees",
						value: "VIEW_EMPLOYEES",
					},
					{
						name: "View all Roles",
						value: "VIEW_ROLES",
					},
					{
						name: "Add a Department",
						value: "ADD_DEPARTMENT",
					},
					{
						name: "Add an Employee",
						value: "ADD_EMPLOYEE",
					},
					{
						name: "Add a Role",
						value: "ADD_ROLE",
					},
					{
						name: "Update an Employee's Role",
						value: "UPDATE_EMPLOYEE_ROLE",
					},
					{
						name: "Exit",
						value: "EXIT",
					},
				],
			},
		])
		.then((res) => {
			let choices = res.choices;
			switch (choices) {
				case "VIEW_DEPARTMENTS":
					viewDepartments();
					break;
				case "VIEW_EMPLOYEES":
					viewEmployees();
					break;
				case "VIEW_ROLES":
					viewRoles();
					break;
				case "ADD_DEPARTMENT":
					createDepartment();
					break;
				case "ADD_EMPLOYEE":
					addEmployee();
					break;
				case "ADD_ROLE":
					addRole();
					break;
				case "UPDATE_EMPLOYEE_ROLE":
					updateEmployeeRole();
					break;
				case "EXIT":
					connection.end();
					break;
			}
		})
		.catch((err) => {
			console.log(err);
		});
};
function viewEmployees() {
	let query =
		"SELECT emp_no AS 'Employee ID', first_name AS 'First Name', last_name AS 'Last Name' FROM employees Limit 100";
	// let query = "SELECT * FROM employees";

	db.query(query, (err, res) => {
		if (err) throw err;

		console.table(res);

		promptQuestions();
	});
}

function viewDepartments() {
	let query = "SELECT dept_no AS ID, dept_name AS DEPARTMENTS FROM departments";
	// let query = "SELECT * FROM departments";

	db.query(query, (err, res) => {
		if (err) throw err;
		console.table(res);

		promptQuestions();
	});
}

function createDepartment() {}

function addEmployee() {}

function addRole() {}

function updateEmployeeRole(employeeId, role) {}

// View all the employee roles (or as listed in the db, title)
function viewRoles() {
	// let query = "SELECT * FROM titles GROUP BY Title";
	//Selecting the employee number assigning it as Employee ID, title assigning it as Roles and grouping it by title
	// let query =
	// 	"SELECT emp_no AS 'Employee ID', title AS 'Roles' FROM titles GROUP BY title";
	let query = "SELECT * FROM titles";
	db.query(query, (err, res) => {
		if (err) throw err;
		console.table(res);

		promptQuestions();
	});
}

promptQuestions();
