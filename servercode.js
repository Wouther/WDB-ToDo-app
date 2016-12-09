//run: node withexpress.js 80
//Custom module imports
var moment = require('moment');
var generateID = require("./server_modules/generateID.js");
var generateToken = require("./server_modules/generateToken.js");
var toDoItem = require("./server_modules/toDoItem");
var loginItem = require("./server_modules/loggedIn");

// DATA STORED IN MEMORY OF SERVER: LATER THIS NEEDS TO BE LOADED FROM DATABASE

var toDoItem1 = new toDoItem.ToDoItem();
var toDoItem2 = new toDoItem.ToDoItem();
var toDoItem3 = new toDoItem.ToDoItem();
var toDoItem4 = new toDoItem.ToDoItem();

toDoItem1.title = "Send postcard for niece's birthday";
toDoItem1.priority = true;
toDoItem1.dueDate = moment();
toDoItem1.dueDate.add(3, 'days');
toDoItem1.description = "Niece Alice's birthday is coming up soon! I should not forget to send the postcard I've written.";
toDoItem1.id = generateID.generateID();

toDoItem2.title = "Pick up meds from pharmacy";
toDoItem2.priority = true;
toDoItem2.dueDate = moment();
toDoItem2.dueDate.add(7, 'days');
toDoItem2.description = "The doctor's receipt is in the second top drawer of the small cabinet.";
toDoItem2.id = generateID.generateID();

toDoItem3.title = "Water the plants";
toDoItem3.priority = false;
toDoItem3.dueDate = moment();
toDoItem3.dueDate.add(5, 'days');
toDoItem3.description = "The plants should be watered once a week. Also, when I have done this, I should set a new todo to water them next time.";
toDoItem3.id = generateID.generateID();

toDoItem4.title = "Pick up the treats for Mr. Winston";
toDoItem4.priority = false;
toDoItem4.dueDate = moment();
toDoItem4.dueDate.add(1, 'days');
toDoItem4.description = "I odered some special treats for Mr. WInston at the animal store. The friendly young man in the store said they would arrive in 2 weeks. So this is when I should pikc them up";
toDoItem4.id = generateID.generateID();

var todos = [];
var loggedInUsers = [];
todos.push(toDoItem1);
todos.push(toDoItem2);
todos.push(toDoItem3);
todos.push(toDoItem4);


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

var mysql = require('mysql');
var express = require("express");
var url = require("url");
var http = require("http");
var path = require('path');
var app;

//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//############################# SQL code #############################################
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

var connection = mysql.createConnection( {
	host : 'localhost',
	port : 3306,
user: 'todouser',
password: 'plip',
database: 'todoown'
});
connection.connect(function(err) {
});

var queryString = "SELECT * FROM todoitem;";
var plip = connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;

    for (var i in rows) {
        console.log('Row names: ', rows[i].title);
    }
});


//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%
//############################# HTTP SERVING code ####################################
//%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%

var dirname = path.dirname(require.main.filename);

var port = process.argv[2];
app = express();
app.use(express.static(dirname + "/client"));
http.createServer(app).listen(port);

//Send the entry page if the client requests the root
//TODO: send main page instead if already logged in
app.get('/', function(req, res) {
 	res.sendFile(dirname + "/client/entrypage.html");
});

//Gets list of todos from server
app.get("/todos", function(req, res) {
 	res.json(todos);
});

//Gets list of users from server (id and name only, for assignee dropdown menu)
app.get("/users", function(req, res) {
    var queryString = "SELECT id,name FROM user";
    var results = {};
    connection.query(queryString, function(err, rows, fields) {
        if (err) throw err;
        if (rows.length === 0) {
          console.log("No users in database.");
          data.status = 401;
          res.json(data);
          res.end;
        } else {
            res.json(rows);
        }
    });
});

app.get("/login", function(req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var data = {};

  var queryString = "SELECT id FROM user WHERE user.username=?";
  var results = {};
  connection.query(queryString, query["username"], function(err, rows, fields) {
      if (err) throw err;
      if (rows.length === 0) {
        console.log("Received login request with unknown username");
        data.status = 401;
        res.json(data);
        res.end;
      } else { //retrieve password from db and compare
        results.id = rows[0].id;
        queryString = "SELECT password FROM user WHERE user.id = ?;"
        connection.query(queryString, results.id, function(err, rows, fields) {
            if (err) throw err;

            if (rows.length !== 1) {
              console.log("Invalid password retrieved from DB for known user");
              data.status = 500;
              res.json(data);
              res.end;
            }

            results.password = rows[0].password;

            if (results.password !== query["password"]) {
              console.log("wrong password for known user");
              data.status = 403;
              res.json(data);
              res.end;
            } else {
              console.log("received valid login request");

              //Add user to the internal server's client list
              var user = new loginItem.loggedInUser();
              user.id = results.id;

              user.token = generateToken.generateToken();
              console.log("Generated token for new user: " + user.token);
              loggedInUsers.push(user);
              console.log("Users currently logged in: " + loggedInUsers.length);

              data.status = 200;
              data.token = user.token;
              res.json(data);
            }

        });



      }
  });






});


app.get('/main', function(req, res) {
 	res.sendFile(dirname + "/client/main.html");
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
    var data = {};
      if (query["id"] !== undefined) {
        //TODO add handling of not known id

        var index = todos.map(function(e) { return e.id; }).indexOf(query['id']);

        if (index === -1) {
          console.log("Client tried to remove a todo with id which was not found, returned 404 to client.");
          data.status = "404";
          res.json(data);
          res.end;

        } else {
          todos.splice(index, 1);
          console.log("Removed toDO with id: " + query['id']);
          data.status = "200";
          res.json(data);
          res.end;
          console.log("Length of current to do list: " + todos.length);
        }

      } else {
        console.log("Missing id parameter, responded with 400 to client.");
        data.status = "400";
        res.json(data);
        res.end;
      }
});

app.get("/changetodo", function(req, res) {
 	var url_parts = url.parse(req.url, true);
 	var query = url_parts.query;
  if (query["id"] !== undefined) {
    var currToDo = findToDoItemByID(query["id"]);
    //Change something for each parameter specified
    for (var k in query){

      if (query[k] === "true" || query[k] === "false") {
        query[k] = JSON.parse(query[k]);
      }

      if (k === 'id') {
        continue;
      } else if (k === 'dueDate' || k === 'completionDate') { // Do something special for date changes: parse it first using moment
        //console.log(query[k])
        if (query[k] === "null") {
          //console.log("date is null");
          currToDo[k] = null;
        } else {
          currToDo[k] = moment.utc(query[k]);
        }
      } else {
        currToDo[k] = query[k];
      }
      }
  console.log("changed todo value with id:  " + query["id"]);
  res.json({status : 200});
  res.end;

} else {
  console.log("Missing id parameter");
  res.json({status : 400, message: "Missing id parameter."});
  res.end;
}
});
