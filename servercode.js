//run: node withexpress.js 80
//Custom module imports
var moment = require('moment');
var generateID = require("./server_modules/generateID.js");
var generateToken = require("./server_modules/generateToken.js");
var toDoItem = require("./server_modules/toDoItem");
var loginItem = require("./server_modules/loggedIn");
var findFunctions = require("./server_modules/findFunctions");

var loggedInUsers = [];



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

//AFKIJKVOORBEELD
var queryString = "SELECT * FROM todoitem;";
var plip = connection.query(queryString, function(err, rows, fields) {
    if (err) throw err;

    for (var i in rows) {
        //console.log('Row names: ', rows[i].title);
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

app.get('/analytics', function(req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var data = {};
  var amountOfParameters = Object.keys(query).length;

  if (amountOfParameters === 0) {
    //simply send analytics page.
    res.sendFile(dirname + "/client/analytics.html");
  } else {
    //Do something else if paremeters were added in the url

    //requested the total completed todos.
    if (query["type"] === "completedTodosTotal") {
      var queryString = "select COUNT(*) from todoitem WHERE todoitem.completed=0;";
        connection.query(queryString, function(err, rows, fields) {
          if (err) throw err;
          console.log(rows[0]);
          data.notcompleted = rows[0]['COUNT(*)'];
          queryString = "select COUNT(*) from todoitem WHERE todoitem.completed=1;";
          connection.query(queryString, function(err, rows, fields) {
            if (err) throw err;
            data.completed = rows[0]['COUNT(*)'];
            console.log(rows[0]['COUNT(*)']);
            data.status = 200;
            res.json(data);
            res.end;
          });
      });
    } else if (query["type"] === "todosPerUser") {

      var queryString = "SELECT u.username, COUNT(*) FROM user as u, todoitem as t WHERE t.owner = u.id GROUP BY u.id ORDER BY COUNT(t.id) DESC LIMIT 10;";
      connection.query(queryString, function(err, rows, fields) {
        if (err) throw err;
        data.list = rows;
        console.log(rows[0]['COUNT(*)']);
        console.log(rows.length);
        data.status = 200;
        res.json(data);
        res.end;
      });



    }
  }
});

//Gets list of todos from server
app.get("/t+o+d+o+s+", function(req, res) {

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

  if (userId === undefined) { //Did not find user among logged in users
    data.status = 401;
    data.message = "Unauthorized";
    res.json(data);
    res.end;
  } else {
      var list = [];
      var queryString = "SELECT todoitem.*, todoassignment.assigneeid, todoassignment.assigndate FROM todoitem JOIN todoassignment ON todoassignment.todoid = todoitem.id WHERE todoitem.owner = ? OR todoitem.id IN (SELECT todoid FROM todoassignment WHERE assigneeid = ?);"; // Select all todos that are owner by OR assigned to the current user.
        connection.query(queryString, [userId, userId], function(err, rows, fields) {
          if (err) throw err;


          for (i = 0; i < rows.length; i++) {
            list.push(toDoItem.createItemFromDBEntry(rows[i]));
          }
          data.list = list;
          data.status = 200;
          data.message = "Succes";
          res.json(data);
          res.end;
        });
  }
});

app.get("/l+o+g+o+u+t+", function(req, res) {
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

//Gets list of users from server (id and name only, for assignee dropdown menu)
app.get("/u+s+e+r+s+", function(req, res) {
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

//Gets info of currently logged in user from server when passed a valid token, or HTTP status 401 (Unauthorized) if not logged in.
app.get("/u+s+e+r+", function(req, res) {
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
        var queryString = "SELECT * FROM user WHERE id = ?";
        var results = {};
        connection.query(queryString, userId, function(err, rows, fields) {
            if (err) throw err;
            if (rows.length === 0) {
              console.log("Logged in with a user unknown to the database. (Huh?)");
              data.status = 401;
              res.json(data);
              res.end;
            } else {
                data.status = 200;
                data.message = "OK";
                data.content = rows;
                res.json(data);
                res.end;
            }
        });
    }
});

app.get("/l+o+g+i+n+", function(req, res) {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var data = {};

  if (query["token"] !== undefined) {
    if (findFunctions.tokenStillValid(query["token"], loggedInUsers)) {
      data.status = 200;
      data.message = "OK"
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
        queryString = "SELECT password FROM user WHERE user.id = ?;";
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
              data.message = "OK"
              data.token = user.token;
              res.json(data);
              res.end;
            }
        });
      }
  });
});


app.get('/m+a+i+n+', function(req, res) {
 	res.sendFile(dirname + "/client/main.html");
});


app.get("/a+d+d+t+o+d+o+", function(req, res) {

  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  var data = {};

  if (query["token"] !== undefined) {
    var userid = findFunctions.findId(query["token"], loggedInUsers);
    var title = "Untitled";
    var description = "";

    //Create new entry in todoitem table
    var queryString = "INSERT INTO todoitem (title, dueDate, description, owner) VALUES(?, date_add(now(), INTERVAL 1 WEEK), ? , " + userid + ");"
    console.log(queryString);
    connection.query(queryString, [title, description], function(err, result) {
        if (err) throw err;
        var newToDoID = result.insertId;

        //Create new entry in todoassignment table
        var queryString = "INSERT INTO todoassignment (todoid, assigneeid) VALUES(?, " + userid + ");" // assign to self by default
        console.log(queryString);
        connection.query(queryString, newToDoID, function(err, result) {
            if (err) throw err;

            //Return new todo item
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
    });
  }
});

app.get("/r+e+m+o+v+e+t+o+d+o+", function(req, res) {
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

app.get("/c+h+a+n+g+e+t+o+d+o+", function(req, res) {
 	var url_parts = url.parse(req.url, true);
 	var query = url_parts.query;
  if (query["id"] !== undefined && query["token"] !== undefined) {
    var todoid = query["id"];
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
        connection.query(queryString, function(err) {
            if (err) throw err;
        });

        console.log("changed todo value with id:  " + todoid + " for userid:");
        res.json({status : 200});
        res.end;
        return;


      } else if (k === 'id' || k === 'token') {
        continue;
    } else if (k === 'dueDate' || k === 'completionDate' || k == 'reminderDate') { // Do something special for date changes: parse it first using moment

        if (query[k] === "null") {

            var queryString = "UPDATE todoitem SET " + k + " = null WHERE todoitem.id = " + todoid + ";";
            console.log(queryString);
            connection.query(queryString, function(err) {
                if (err) throw err;
            });

            console.log("changed todo value with id:  " + todoid + " for userid:");
            res.json({status : 200});
            res.end;
            return;

        } else {
          query[k] = moment.utc(query[k]).format('YYYY-MM-DD HH:mm:ss');
        }

        var queryString = "UPDATE todoitem SET " + k + " = ? WHERE todoitem.id = " + todoid + ";";
        connection.query(queryString, query[k], function(err) {
            if (err) throw err;
        });

        console.log("changed todo value with id:  " + todoid + " for userid:");
        res.json({status : 200});
        res.end;
        return;

    } else if (k === 'assignee') { // Do something special for assignee changes (other table required!)
          var queryString = "UPDATE todoassignment SET assigneeid = ? WHERE todoid = " + todoid + ";";
          console.log(queryString);
          connection.query(queryString, query[k], function(err) {
              if (err) throw err;
          });

          console.log("changed assignee of todo with id:  " + todoid + " to userid:");
          res.json({status : 200});
          res.end;
      } else {
        var queryString = "UPDATE todoitem SET " + k + " = ? WHERE todoitem.id = " + todoid + ";";
        console.log(queryString);
        connection.query(queryString, query[k], function(err) {
            if (err) throw err;
        });

        console.log("changed todo value with id:  " + todoid + " for userid:");
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
