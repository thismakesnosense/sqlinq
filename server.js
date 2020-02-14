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
                    addSearch();
                    break;

                case "Exit":
                    process.exit(1);
                    break;


            }
        });
}
async function selectTable(){
    let answer = await inquirer
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

        });
    if(answer.action === 'Exit'){
        process.exit(1);
    }
    return answer.action;
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
        .then(function (answer) {
            if (answer.action === "Exit") {
                process.exit(1);
            }
            connection.query("Select * From " + answer.action, [], function (err, res) {
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
                    .then(function (choice) {
                        if (choice.newstep === "exit") {
                            process.exit(1);
                        }
                        if (choice.newstep === "update") {
                            updateSearch(res, answer.action);
                        } else {
                            addSearch(res, answer.action);
                        }
                    })
            });

        })
}

function updateSearch(tableData, tableName) {
    let questions = [];
    let newValues = [];
    let choices = [];
    tableData.forEach((Element) => {
        let name = "";
        Object.keys(Element).forEach(key => {
            name += key + ": " + Element[key] + " ";
            if (key != "id") {
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
    );
    questions = questions.concat(newValues);

    inquirer
        .prompt(questions).then(function (answers) {

        let updatestring = "";
        let i = 0;
        Object.keys(answers).forEach((value, key) => {
            updatestring += (i > 0 ? ", " : "") + value + " = '" + answers[value] + "' ";
            i++;
        });
        let queryString = "Update " + tableName + " set " + updatestring + "where id = " + answers.id;
        console.log(queryString);

        connection.query(queryString);


    }).then(function () {
        runSearch();
    });
}

const departmentquestion = [
    {
        type: "input",
        name: "inputname",
        message: "What name would you like to add?",

    }
];
const employeequestion = [
    {
        type: "input",
        name: "firstname",
        message: "What first name would you like to add?",

    },
    {
        type: "input",
        name: "lastname",
        message: "What last name would you like to add?",
    },
    {
        type: "input",
        name: "role_id",
        message: "What role id would you like to add?",
    },
    {
        type: "input",
        name: "manager_id",
        message: "What manager id would you like to add?",
    }

];
const rolequestion = [
    {
        type: "input",
        name: "title",
        message: "What title would you like to add?",
    },
    {
        type: "input",
        name: "salary",
        message: "What salary would you like to add?",
    },
    {
        type: "input",
        name: "department_id",
        message: "What department id would you like to add?",
    }

];

function addSearch(tableData, tableName) {
    let questions = [{
        type: "list",
        name: "tableNamez",
        message: "What table to you want to update?",
        choices: ["department", "employee", "role",]
    }];


    inquirer
        .prompt(questions).then(function (answers) {

        let updatestring = "";
        switch (answers.tableNamez) {
            case "department":
                askquestions(departmentquestion).then(function (response) {
                    updatestring = `(name) VALUES (${response.inputname})`;
                });

                break;
            case "employee":
                askquestions(employeequestion).then(function (response) {
                    updatestring = `(first_name, last_name, role_id, manager_id) VALUES (${response.firstname, response.lastname, response.role_id, response.manager_id})`;
                });

                break;
            case "role":
                askquestions(rolequestion).then(function (response) {
                    updatestring = `(title, salary, department_id) VALUES (${response.title, response.salary, response.department_id})`;
                });

        }


        let queryString = "Insert INTO " + answers.tableName + updatestring;
        console.log(queryString);

        connection.query(queryString);


    }).then(function () {
        runSearch();
    });
}

function askquestions(specquestions) {
    inquirer
        .prompt(specquestions).then(function () {

    })

}