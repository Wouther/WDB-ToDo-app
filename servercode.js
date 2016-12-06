//run: node withexpress.js 80
//Custom module imports
var moment = require('moment');

var generateID = require("./server_modules/generateID.js");
var toDoItem = require("./server_modules/toDoItem");


// DATA STORED IN MEMORY OF SERVER: LATER THIS NEEDS TO BE LOADED FROM DATABASE

var toDoItem1 = new toDoItem.ToDoItem();
var toDoItem2 = new toDoItem.ToDoItem();
var toDoItem3 = new toDoItem.ToDoItem();

toDoItem1.title = "Title of first to do item";
toDoItem1.priority = false;
toDoItem1.dueDate = moment("14-04-1998", "DD-MM-YYYY");
toDoItem1.description = "THIS IS a description for item 1\ asdasdasdasdasasd11111\n 111111111111111111";
toDoItem1.id = generateID.generateID();

toDoItem2.title = "Title of second to do item";
toDoItem2.priority = true;
toDoItem2.dueDate = moment("14-04-2001", "DD-MM-YYYY");
toDoItem2.description = "THIS IS a description for item 2\ asdasdasdasdasasd11111\n 222222222222222222";
toDoItem2.id = generateID.generateID();

toDoItem3.title = "Title of third to do item";
toDoItem3.priority = true;
toDoItem3.dueDate = moment("14-04-2012", "DD-MM-YYYY");
toDoItem3.description = "THIS IS a description for item 3\ asdasdasdasdasasd11111\n 3333333333333333333333333";
toDoItem3.id = generateID.generateID();

var todos = [];
todos.push(toDoItem1);
todos.push(toDoItem2);
todos.push(toDoItem3);

//var toDoList = new ToDoList();
// toDoList.add(toDoItem1);
// toDoList.add(toDoItem2);
// toDoList.add(toDoItem3);

var express = require("express");
var url = require("url");
var http = require("http");
var path = require('path');
var app;

var dirname = path.dirname(require.main.filename);

var port = process.argv[2];
app = express();
app.use(express.static(dirname + "/client"));
http.createServer(app).listen(port);

//Simply send the main page if the client requests the root
//Later moet hier de inlogpagina natuurlijk
app.get('/', function(req, res) {
 	res.sendFile(dirname + "/client/main.html");
});

//Gets list of todos from server
app.get("/todos", function(req, res) {
 	res.json(todos);
});

app.get("/addtodo", function(req, res) {
 	var url_parts = url.parse(req.url, true);
 	var query = url_parts.query;
 	if (query["message"] !== undefined) {
    var newToDoItem = new ToDoItem();
    todos.push(newToDoItem);
    //This is transmitted back to the client
 	 	res.end(newToDoItem.id);
 	 	console.log("added " + tx.message);

 	} else {
 	 	res.end("Error: missing message parameter");

 	}
});
