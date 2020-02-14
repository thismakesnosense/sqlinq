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

async function selectTable() {
    let answer = await inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "Please select a table",
            choices: [
                "department",
                "employee",
                "role",
                "Exit",
            ]

        });
    if (answer.action === 'Exit') {
        process.exit(1);
    }
    return answer.action;
}


async function getInquirerQuestionsByTable(table) {
    let addQuestions = [];
    return new Promise((resolve, reject) => {
        connection.query(`DESCRIBE ${table}`, [], function (err, res) {
            res.forEach(row => {
                if (row.Field !== 'id') {
                    addQuestions.push({
                        type: "input",
                        name: row.Field,
                        message: "What is the value for " + row.Field + "?",
                    })
                }
            });
            resolve(addQuestions);
        })
    });

}


function viewSearch() {
    selectTable().then(table => {
        connection.query("Select * From " + table, [], function (err, res) {
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
                        updateSearch(res,table);
                    } else {
                        addSearch(table);
                    }
                })
        });
    });

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


function addSearch(tableName) {
    /* If we don't have a table name, ask for it*/
    if (typeof tableName === 'undefined') {
        selectTable().then(table => {
            getInquirerQuestionsByTable(table).then(questions => {
                addRecord(table,questions)
            })
        });
    } else {
        getInquirerQuestionsByTable(tableName).then(questions => {
            addRecord(tableName,questions)
        })
    }
}
function addRecord(table,questions){
    inquirer.prompt(questions).then(function(answers){
        let insert = `INSERT INTO ${table} SET `;
        let values = [];
        Object.keys(answers).forEach(key => {
            values.push(answers[key]);
            insert += key + ` = ?, `;
        });
        connection.query(insert.substring(0, insert.length-2),values,function(err,res){
            runSearch();
        })
    })
}
