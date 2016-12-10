//run: node withexpress.js 80
//Custom module imports
var moment = require('moment');
var generateID = require("./server_modules/generateID.js");
var generateToken = require("./server_modules/generateToken.js");
var toDoItem = require("./server_modules/toDoItem");
var loginItem = require("./server_modules/loggedIn");
var findFunctions = require("./server_modules/findFunctions");

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

//Simply send the main page if the client requests the root
//Later moet hier de inlogpagina natuurlijk
app.get('/', function(req, res) {
 	res.sendFile(dirname + "/client/entrypage.html");
});

//Gets list of todos from server
app.get("/todos", function(req, res) {

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var data = {};

  if (query["token"] === undefined) {
    data.status = 400;
    data.message = "Missing token parameter in query";
    res.json(data);
    res.end;
    return;
  }

  userId = findFunctions.findId(query["token"], loggedInUsers);

  if (userId === undefined) {
    data.status = 401;
    data.message = "Unauthorized";
    res.json(data);
    res.end;
  } else {
      var list = [];
      var queryString = "SELECT * FROM todoitem WHERE todoitem.owner=?";
        connection.query(queryString, userId, function(err, rows, fields) {
          if (err) throw err;
          //console.log(moment(rows[0].creationDate)._isValid);

          for (i = 0; i < rows.length; i++) {
            list.push(toDoItem.createItemFromDBEntry(rows[i]));
            //console.log(rows[i]);
          }
          data.list = list;
          data.status = 200;
          data.message = "Succes";
          res.json(data);
          res.end;
        });

  }


});

app.get("/logout", function(req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var data = {};

  if (query["token"] === undefined) {
    data.status = 400;
    data.message = "Missing token parameter in query";
    res.json(data);
    res.end;
  } else {

    var index = findFunctions.findIndex(query["token"], loggedInUsers);

    if (index === undefined) {
      console.log("Login token not found in server");
      data.status = 500;
      res.json(data);
      res.end;
      return;
    } else {
      loggedInUsers.splice(index, 1);
      data.status = 200;
      data.message = "Accepted";
      res.json(data);
      res.end;
    }

  }
});


app.get("/login", function(req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var data = {};

  if (query["token"] !== undefined) {
    if (findFunctions.tokenStillValid(query["token"], loggedInUsers)) {
      data.status = 200;
      data.message = "Unathourized"
      res.json(data);
      res.end;
    } else {
      data.status = 401;
      res.json(data);
      res.end;
    }
    return;
  }

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

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var data = {};

  if (query["token"] !== undefined) {
    var userid = findFunctions.findId(query["token"], loggedInUsers);
    var title = "Untitled";
    var description = "";

    //Create new entry
    var queryString = "INSERT INTO todoitem (title, description, owner) VALUES(?, ?, " + userid + ");"
    connection.query(queryString, [title, description], function(err, result) {
        if (err) throw err;

            var newToDoID = result.insertId;
            var queryString = "SELECT * FROM todoitem WHERE todoitem.id=?";
            connection.query(queryString, newToDoID, function(err, rows, fields) {
              if (err) throw err;
              //console.log(moment(rows[0].creationDate)._isValid);

              var newToDoItem = new toDoItem.createItemFromDBEntry(rows[0]);
              res.status = '200';
              res.json(newToDoItem);
              console.log("added new todo");
            });

        });






  }




});

app.get("/removetodo", function(req, res) {
    var url_parts = url.parse(req.url, true);
    var query = url_parts.query;
    var data = {};

    if (query["id"] !== undefined && query["token"] !== undefined) {
      var queryString = "DELETE FROM todoitem WHERE id=?;"
      connection.query(queryString, query["id"], function(err) {
          if (err) throw err;
          res.json({status : 200});
          res.end;
          return;
          });
    }

});

app.get("/changetodo", function(req, res) {
 	var url_parts = url.parse(req.url, true);
 	var query = url_parts.query;
  if (query["id"] !== undefined && query["token"] !== undefined) {
    var todoid = query["id"];
    console.log("todoid: " + todoid);
    //var userid = findFunctions.findId(query["token"], loggedInUsers);
    //Change something for each parameter specified
    for (var k in query){

      if (query[k] === "true" || query[k] === "false") {
        // query[k] = JSON.parse(query[k]);

        if (query[k] === "true") {
          query[k] = 1;
        } else {
          query[k] = 0;
        }

        var queryString = "UPDATE todoitem SET " + k + " = " + query[k] + " WHERE todoitem.id =" + todoid + ";";
        console.log(queryString);
        connection.query(queryString, function(err) {
            if (err) throw err;
        });

        console.log("changed todo value with id:  " + query["id"] + " for userid:");
        res.json({status : 200});
        res.end;
        return;


      } else if (k === 'id' || k === 'token') {
        continue;
      } else if (k === 'dueDate' || k === 'completionDate') { // Do something special for date changes: parse it first using moment

        if (query[k] === "null") {


        } else {
          query[k] = moment.utc(query[k]).format('YYYY-MM-DD HH:mm:ss');
        }

        var queryString = "UPDATE todoitem SET " + k + " = ? WHERE todoitem.id = " + todoid + ";";
        console.log(queryString);
        connection.query(queryString, query[k], function(err) {
            if (err) throw err;
        });

        console.log("changed todo value with id:  " + query["id"] + " for userid:");
        res.json({status : 200});
        res.end;
        return;

      } else {
        var queryString = "UPDATE todoitem SET " + k + " = ? WHERE todoitem.id = " + todoid + ";";
        console.log(queryString);
        connection.query(queryString, query[k], function(err) {
            if (err) throw err;
        });

        console.log("changed todo value with id:  " + query["id"] + " for userid:");
        res.json({status : 200});
        res.end;
      }
      }


} else {
  console.log("Missing id parameter");
  res.json({status : 400, message: "Missing id parameter."});
  res.end;
}
});
