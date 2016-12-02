//run: node withexpress.js 80

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

var todos = [];
var t1 = {
 	message: "Maths homework due",
 	type: 1,
 	deadline: "12/12/2014"
};
var t2 = {
 	message: "English homework due",
 	type: 3,
 	deadline: "20/12/2014"
};

todos.push(t1);
todos.push(t2);

//Simply send the main page if the client requests the root
//Later moet hier de inlogpagina natuurlijk
app.get('/', function(req, res) {
 	res.sendFile(dirname + "/client/main.html");
});

app.get("/todos", function(req, res) {
 	res.json(todos);
});

app.get("/addtodo", function(req, res) {
 	var url_parts = url.parse(req.url, true);
 	var query = url_parts.query;
 	if (query["message"] !== undefined) {
 	 	var tx = {
 	 	 	message: query["message"],
 	 	 	type: query["type"],
 	 	 	deadline: query["deadline"]
 	 	};
 	 	todos.push(tx);
 	 	res.end("Todo added succesfully");
 	 	console.log("addded" + tx.messafge);

 	} else {
 	 	res.end("Error: missing message parameter");

 	}
});
