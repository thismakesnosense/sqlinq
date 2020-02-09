
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
        
        "Add",
        "Exit"
      ]
    })
    .then(function (answer) {
      switch (answer.action) {
        case "View":
          viewSearch();
          break;


        case "Add":
          AddSearch();
          break;

        case "Exit":
          process.exit(1);
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
     connection.query("Select * From " + answer.action,[], function(err, res){
       if (err) {
         console.log(err);
       }
        console.table(res);
       inquirer
       .prompt({
         name: "newstep",
         type: "list",
         message: "What would you like to do now?",
         choices: [
          "add",
          "update",
          "exit",
         ]
       })
       .then(function(choice){
         if (choice.newstep === "exit"){
           process.exit(1);
         }
         if (choice.newstep === "update"){
           updateSearch(res, answer.action); 
         }
       })
     });
     
   })
};

function updateSearch(tableData, tableName){
  let questions = [];
  let newValues = [];
  let choices = []; 
  tableData.forEach((Element) => {
    let name = "";
    Object.keys(Element).forEach(key => {
     name += key + ": " + Element[key] + " "; 
     if (key != "id"){
      newValues.push({
        name: key,
        type: "input",
        message: `Whats the new value for ${key}`,
        default: Element[key]
 
      })
     }
     
    });
    choices.push({
      name: name, 
      value: Element.id
    });
  });
  questions.push(
    {
      name: "id",
      type: "list",
      message: `What ${tableName} would you like to update?`,
      choices: choices,
  
      
    }
  )
  questions = questions.concat(newValues);
  
  inquirer
  .prompt(questions).then(function(answers){
    
    let updatestring = "";
    let i = 0;
    Object.keys(answers).forEach((value, key) => {
      updatestring += (i>0?", ":"") + value + " = '" + answers[value] + "' ";
      i++; 
    })
    let queryString = "Update " + tableName + " set " + updatestring + "where id = " + answers.id;
    console.log(queryString)
    
    connection.query(queryString);
    
    
    
  }).then(function(){
    runSearch();
  });
};


// function AddSearch() {
//   inquirer
//    .prompt({
//      name: "action2",
//      type: "list",
//      message: "What table would you like to add too?",
//      choices: [
//        "department",
//        "employee",
//        "role",
//        "Exit",
//      ]

//    })
//    .then(function(answerx){
//      if (answerx.action2 === "Exit"){
//        process.exit(1);
//      }
//      connection.query("Select * From " + answerx.action2,[], function(err, res){
//        if (err) {
//          console.log(err);
//        }
//         console.table(res);
//        inquirer
//        .prompt({
//          name: "newstep2",
//          type: "list",
//          message: "What would you like to do now?",
//          choices: [
//           "view",
//           "update",
//           "exit",
//          ]
//        })
//        .then(function(choice){
//          if (choice.newstep2 === "exit"){
//            process.exit(1);
//          }
//          if (choice.newstep2 === "view"){
//            viewSearch(); 
//          }
//        })
//      });
     
//    })
// };
