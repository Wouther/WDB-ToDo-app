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


var findToDoItemByID = function (idparam) {
  for (i = 0; i < todos.length; i++) {
    if (String(todos[i].id) === idparam) {
      return todos[i];
    }
  }
  return null;
}

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
    var newToDoItem = new toDoItem.ToDoItem();
    newToDoItem.id = generateID.generateID();
    todos.push(newToDoItem);
    //This is transmitted back to the client
    res.status = '200';
 	 	res.json(newToDoItem);
 	 	console.log("added new todo");
});

app.get("/removetodo", function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
      if (query["id"] !== undefined) {
        var index = todos.indexOf(query['id']);
        todos.splice(index, 1);
        console.log("Removed toDO with id: " + query['id']);
        res.status = '200';
        res.end
      } else {
        console.log("Missing id parameter");
        res.status = '400';
        res.end
      }
});

app.get("/changetodo", function(req, res) {
 	var url_parts = url.parse(req.url, true);
 	var query = url_parts.query;
  console.log(query);
  if (query["id"] !== undefined) {
    console.log(query["id"]);
    var currToDo = findToDoItemByID(query["id"]);
    console.log(currToDo);

    //Change something for each parameter specified
    for (var k in query){

      if (k === 'id') {
        continue;
      } else if (k === 'dueDate' || k === 'completionDate') { // Do something special for date changes: parse it first using moment
        currToDo[k] = moment.utc(query[k]);
      } else {
        currToDo[k] = query[k];
      }
      }
  console.log("changed todo with id:  " + query["id"]);

} else {
  console.log("Missing id parameter");
  res.status = '400';
  res.end
}
});
