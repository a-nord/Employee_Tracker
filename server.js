// Import and require inquirer and mysql2
const inquirer = require("inquirer");
const mysql = require("mysql2");
const table = require("console.table");


// Connect to database
const db = mysql.createConnection(
	{
		host: 'localhost',
		user: 'root',
		password: 'rootroot',
		database: 'employee_tracker_db'
	},
	console.log(`Connected to the employee_tracker_db database.`)
);

// getAllEmployees, getAllRoles, getAllDepartments, addEmployee, addRole, addDepartment, updateEmployee, quit


//promt question to choose what to do from list
function loadMainPrompts() {
	inquirer.prompt(
		{
			type: "list",
			message: "Choose an option:",
			choices: [
				`View Employees`,
				`View Roles`,
				`View Departments`,
				`Add Employee`,
				`Add Role`,
				`Add Department`,
				`Update Employee Role`,
				`Quit`],
			name: "option"
		})
		.then((answer) => {
			switch (answer.option) {
				case "View Employees":
					getAllEmployees();
					break;

				case "View Roles":
					getAllRoles();
					break;

				case 'View Departments':
					getAllDepartments();
					break;

				case "Add Employee":
					addEmployee();
					break;

				case "Add Role":
					addRole();
					break;

				case "Add Department":
					addDepartment();
					break;

				case "Update Employee Role":
					updateEmployee();
					break;

				default:
					break;
			}
		})
};

//funtion to initiate the app
function init() {
	loadMainPrompts();
}
init();

//function to get all employees
function getAllEmployees() {
	let query = `SELECT * FROM employee;`;
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			return;
		}
		console.table(result);
		loadMainPrompts();
	})
};

// function to get all roles
function getAllRoles() {
	let query = `SELECT role.id, role.title, department.name AS department, role.salary
				FROM role
				JOIN department ON role.department_id = department.id;`;
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			return;
		}
		console.table(result);
		loadMainPrompts();
	})
};

// function to get all departments
function getAllDepartments() {
	let query = `SELECT * from department;`;
	db.query(query, (err, result) => {
		if (err) {
			console.log(err);
			return;
		}
		console.table(result);
		loadMainPrompts();
	})
};

//funtion to add employee
async function addEmployee() {
	const roleQuery = await db.promise().query('SELECT * FROM role')
	const roles = roleQuery[0].map((role) => {
		return {
			name: role.title,
			value: role.id
		}
	});
	const managerQuery = await db.promise().query('SELECT * FROM employee')
	const managers = managerQuery[0].map((employee) => {
		return {
			name: `${employee.first_name} ${employee.last_name}`,
			value: employee.id
		}
	});
	managers.unshift({ name: "None", value: null });
	inquirer.prompt([
		{
			type: "input",
			message: "What is the first name?",
			name: "first_name"
		},
		{
			type: "input",
			message: "What is the last name?",
			name: "last_name"
		},
		{
			type: "list",
			message: "What is the role?",
			choices: roles,
			name: "role_id"
		},
		{
			type: "list",
			message: "Who is the manager?",
			choices: managers,
			name: "manager_id"
		}]
	).then((answers) => {
		let query = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ('${answers.first_name}','${answers.last_name}','${answers.role_id}','${answers.manager_id}');`
		db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				return;
			}
			loadMainPrompts();
		})

	})
};

//funtion to add role
async function addRole() {
	const departQuery = await db.promise().query('SELECT * FROM department')
	const departments = departQuery[0].map((department) => {
		return {
			name: department.name,
			value: department.id
		}
	});
	inquirer.prompt([
		{
			type: "input",
			message: "What is the title of the role?",
			name: "title"
		},
		{
			type: "input",
			message: "What is salary of the role?",
			name: "salary"
		},
		{
			type: "list",
			message: "What department is the role in?",
			choices: departments,
			name: "department_id"
		}]
	).then((answers) => {
		let query = `INSERT INTO role (title, salary, department_id) VALUES ('${answers.title}','${answers.salary}','${answers.department_id}');`
		db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				return;
			}
			loadMainPrompts();
		})

	})
};

//funtion to add department
function addDepartment() {
	inquirer.prompt([
		{
			type: "input",
			message: "Add the department?",
			name: "name"
		}]
	).then((answers) => {
		let query = `INSERT INTO department (name) VALUES ('${answers.name}');`
		db.query(query, (err, result) => {
			if (err) {
				console.log(err);
				return;
			}
			loadMainPrompts();
		})

	})
};

//function to update roles
