// View all deparments
function viewAllDepartments() {
	db.allDepartments()
		.then(([rows]) => {
			let departments = rows;
			console.log("\n");
			console.table(departments);
		})
		.then(() => runPrompts());
}

// Add a department
function createDepartment() {
	prompt([
		{
			name: "name",
			message: "What is the name of the department?",
		},
	]).then((res) => {
		let name = res;
		db.addDepartment(name)
			.then(() => console.log(`Added ${name.name} to the database`))
			.then(() => runPrompts());
	});
}
module.exports = { viewAllDepartments, createDepartment };
