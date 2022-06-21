// View all employees
function viewAllEmployees() {
	db.allEmployees()
		.then(([rows]) => {
			let employees = rows;
			console.log("\n");
			console.table(employees);
		})
		.then(() => runPrompts());
}

// Add an employee
function createEmployee() {
	prompt([
		{
			name: "first_name",
			message: "What's the employee's first name?",
		},
		{
			name: "last_name",
			message: "What's the employee's last name?",
		},
	]).then((res) => {
		let firstName = res.first_name;
		let lastName = res.last_name;

		db.allRoles().then(([rows]) => {
			let roles = rows;
			const roleChoices = roles.map(({ id, title }) => ({
				name: title,
				value: id,
			}));

			prompt({
				type: "list",
				name: "roleId",
				message: "What's the employee's role?",
				choices: roleChoices,
			}).then((res) => {
				let roleId = res.roleId;

				db.allEmployees().then(([rows]) => {
					let employees = rows;
					const managerChoices = employees.map(
						({ id, first_name, last_name }) => ({
							name: `${first_name} ${last_name}`,
							value: id,
						})
					);

					managerChoices.unshift({ name: "None", value: null });

					prompt({
						type: "list",
						name: "managerId",
						message: "Who's the employee's manager?",
						choices: managerChoices,
					})
						.then((res) => {
							let employee = {
								manager_id: res.managerId,
								role_id: roleId,
								first_name: firstName,
								last_name: lastName,
							};

							db.addEmployee(employee);
						})
						.then(() =>
							console.log(`Added ${firstName} ${lastName} to the database`)
						)
						.then(() => runPrompts());
				});
			});
		});
	});
}

module.exports = { viewAllEmployees, createEmployee };
