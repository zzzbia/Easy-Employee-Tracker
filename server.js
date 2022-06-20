const express = require("express");
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const db = mysql.createConnection(
	{
		host: "localhost",
		user: "root",
		password: "12345",
		database: "employee_db",
	},
	console.log("connected to the employee_db database")
);
