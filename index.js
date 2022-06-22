const mysql = require("mysql2");
const inquirer = require("inquirer");
const consoleTable = require("console.table");

const db = mysql.createConnection(
	{
		host: "127.0.0.150",
		user: "root",
		password: "12345",
		database: "employees_db",
	},
	console.log("Connected to Employees_db database")
);

db.connect((e) => {
	console.log("Welcome!");
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
					quit();
					break;
			}
		})
		.catch((err) => {
			console.log(err);
		});
};
// View all the departments (the department id and the name)
function viewDepartments() {
	let query = "SELECT * FROM department";

	db.query(query, (err, res) => {
		console.table(res);

		promptQuestions();
	});
}

function viewEmployees() {
	let query = "SELECT * FROM employee";

	db.query(query, (err, res) => {
		console.table(res);

		promptQuestions();
	});
}

// View all the employee roles (or as listed in the db, title)
function viewRoles() {
	// let query = "SELECT * FROM titles GROUP BY Title";
	//Selecting the employee number assigning it as Employee ID, title assigning it as Roles and grouping it by title
	// let query =
	// 	"SELECT emp_no AS 'Employee ID', title AS 'Roles' FROM titles GROUP BY title";
	let query =
		"SELECT role.id, role.title, role.salary, department.name AS 'Department Name' FROM role LEFT JOIN department ON role.department_id = department.id";

	db.query(query, (err, res) => {
		if (err) console.log(err);
		console.table(res);

		promptQuestions();
	});
}

function createDepartment() {
	let query = "INSERT INTO department (name) VALUES (?)";
	let params = [];
	inquirer
		.prompt([
			{
				type: "input",
				name: "dept_name",
				message: "What is the name of the new department?",
			},
		])
		.then((res) => {
			params.push(res.dept_name);
			// console.log(params);
			db.query(query, params, (err, res) => {
				if (err) console.log(err);
				console.log("Department added");
				promptQuestions();
			});
		});
}

function addEmployee() {
	//Prompting to enter the first name, last name, role id and manager id
	let query =
		"INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)";
	let params = [];

	inquirer
		.prompt([
			{
				type: "input",
				name: "first_name",
				message: "What is the employee's first name?",
			},
			{
				type: "input",
				name: "last_name",
				message: "What is the employee's last name?",
			},
		])
		.then((res) => {
			params.push(res.first_name, res.last_name);
			db.query("SELECT * FROM role", (err, res) => {
				if (err) console.log(err);
				// console.log(res);
				inquirer
					.prompt([
						{
							type: "list",
							name: "role_id",
							message: "What is the role of the new employee?",
							choices: res.map((role) => {
								return {
									name: role.title,
									value: role.id,
								};
							}),
						},
					])
					.then((res) => {
						params.push(res.role_id);
						db.query("SELECT * FROM employee", (err, res) => {
							if (err) console.log(err);
							console.log(res);
							inquirer
								.prompt([
									{
										type: "list",
										name: "manager_id",
										message: "Who is the employee's manager?",
										choices: res.map((manager) => {
											return {
												name: manager.first_name + " " + manager.last_name,
												value: manager.id,
											};
										}),
									},
								])
								.then((res) => {
									params.push(res.manager_id);
									db.query(query, params, (err, res) => {
										if (err) console.log(err);
										console.log("Employee added");
										promptQuestions();
									});
								});
						});
					});
			});
		});
}

function addRole() {
	let query =
		"INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";

	db.query("SELECT * FROM department", (err, res) => {
		if (err) console.log(err);
		console.log(res);
		inquirer
			.prompt([
				{
					type: "input",
					name: "title",
					message: "What is the name of the new role?",
				},
				{
					type: "input",
					name: "salary",
					messsage: "What is the salary of the role?",
				},
				{
					type: "list",
					name: "department_id",
					message: "What is the department of the role?",
					choices: res.map((department) => {
						return {
							name: department.name,
							value: department.id,
						};
					}),
				},
			])
			.then((res) => {
				console.log(res);
				db.query(
					query,
					[res.title, res.salary, res.department_id],
					(err, res) => {
						if (err) {
							console.log(err);
							return;
						}
						console.log("Role added");
						promptQuestions();
					}
				);
			});
	});
}

promptQuestions();

function quit() {
	process.exit();
}
