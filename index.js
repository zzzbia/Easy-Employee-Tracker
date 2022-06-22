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
//Sorting the departments by department id in ascending order
function viewDepartments() {
	let query = "SELECT * FROM department ORDER BY id ASC";

	db.query(query, (err, res) => {
		console.table(res);

		promptQuestions();
	});
}
// View all the employees (as listed in the db, first name, last name, title, department, Salary and their manager)
function viewEmployees() {
	let query =
		"SELECT employee.id AS Id, employee.first_name AS 'First Name', employee.last_name AS 'Last Name', role.title AS Title, department.name AS Department, role.salary AS Salary, CONCAT(manager.first_name, ' ', manager.last_name) AS Manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id";

	db.query(query, (err, res) => {
		console.table(res);

		promptQuestions();
	});
}

// View all the employee roles function (ID, Title, Salary, Department)
function viewRoles() {
	//Selecting the employee number assigning it as Employee ID, title, Salary, Department Name from Roles and joining with the Deparment Table ID to get the Department Name
	let query =
		"SELECT role.id AS Id, role.title AS Title, role.salary AS Salary, department.name AS 'Department Name' FROM role LEFT JOIN department ON role.department_id = department.id";

	db.query(query, (err, res) => {
		if (err) console.log(err);
		console.table(res);

		promptQuestions();
	});
}
// Adding a Department and asking for the name of the department
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
// Adding an Employee and asking for the name of the employee, the role id, and the manager id
function addEmployee() {
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
							// console.log(res);
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
//Adding a Role and asking for the title, salary, and department id of the role
function addRole() {
	let query =
		"INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)";

	db.query("SELECT * FROM department", (err, res) => {
		if (err) console.log(err);
		// console.log(res);
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
// Updating an Employee's role by the role id and the employee id
function updateEmployeeRole() {
	let query = "UPDATE employee SET role_id = ? WHERE id = ?";
	let employeeId;

	db.query("SELECT * FROM employee", (err, res) => {
		if (err) console.log(err);
		// console.log(res);
		inquirer
			.prompt([
				{
					type: "list",
					name: "employee_id",
					message: "Which employee's role do you want to update?",
					choices: res.map((employee) => {
						return {
							name: employee.first_name + " " + employee.last_name,
							value: employee.id,
						};
					}),
				},
			])
			.then((res) => {
				employeeId = res.employee_id;
			})
			.then(() => {
				db.query("SELECT * FROM role", (err, res) => {
					if (err) console.log(err);
					// console.log(res);
					inquirer
						.prompt([
							{
								type: "list",
								name: "role_id",
								message: "Which role do you want to assign to the employee?",
								choices: res.map((role) => {
									return {
										name: role.title,
										value: role.id,
									};
								}),
							},
						])
						.then((res) => {
							db.query(query, [res.role_id, employeeId], (err, res) => {
								if (err) console.log(err);
								console.log("Employee role updated");
								promptQuestions();
							});
						});
				});
			});
	});
}

promptQuestions();

function quit() {
	process.exit();
}
