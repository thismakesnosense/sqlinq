
const inquirer = require("inquirer");
const mysql = require("mysql");



// Set the port of our application
// process.env.PORT lets the port be set by Heroku
var PORT = process.env.PORT || 8080;





var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Moosemoney7!",
  database: "office_db"
});

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }

  console.log("connected as id " + connection.threadId);
  runSearch();
});

function runSearch() {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View",
        "Update",
        "Delete",
        "Exit"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View":
          viewSearch();
          break;

        case "Update":
          updateSearch();
          break;

        case "Delete":
          deleteSearch();
          break;

        case "Exit":
          exitSearch();
          break;


      }
    });
}

function viewSearch() {
  inquirer
   .prompt({
     name: "action",
     type: "list",
     message: "What table would you like to view?",
     choices: [
       "department",
       "employee",
       "role",
       "Exit",
     ]

   })
   .then(function(answer){
     if (answer.action === "Exit"){
       process.exit(1);
     }
     connection.query("Select * From ?", [answer.action], function(err, res){
       if (err) {
         console.log(err);
       }
        console.log(res);
       
     });
     
   })
}


