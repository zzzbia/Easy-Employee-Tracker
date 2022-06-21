const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const { createDepartment } = require("./scripts/departments");

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
		});
};
function viewEmployees() {
	let query =
		"SELECT emp_no AS 'Employee ID', first_name AS 'First Name', last_name AS 'Last Name' FROM employees Limit 100";

	db.query(query, (err, res) => {
		if (err) throw err;

		console.table(res);

		promptQuestions();
	});
}

function viewDepartments() {
	db.query("SELECT * FROM department", (err, res) => {});
}

function viewRoles() {
	// let query = "SELECT * FROM titles GROUP BY Title";
	let query =
		"SELECT emp_no AS 'Employee ID', title AS 'Roles' FROM titles GROUP BY title";
	db.query(query, (err, res) => {
		if (err) throw err;
		console.table(res);

		promptQuestions();
	});
}

promptQuestions();
