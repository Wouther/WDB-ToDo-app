var ToDoList = function() {
 	this.list = [];
 	this.id = null;
 	this.owner = null;
 	this.creationDate = null;
 	this.name = null;
}

ToDoList.prototype.add = function(todo) {
 	this.list.push(todo);
}

ToDoList.prototype.get = function(index) {

 	if (index > (this.list.length - 1)) {
 	 	return undefined;
 	}

 	return this.list[index];
}

ToDoList.prototype.length = function() {
 	return this.list.length;
};

ToDoList.prototype.remove = function(index) {
 	if (index > (this.list.length - 1)) {
 	 	console.log("Index out of bounds error in ToDoList get class.");
 	 	return undefined;
 	}
 	this.list.splice(index, 1);
}

var getToDoListObjectFromServerJSON = function(res) {
 	returnedTodos = new ToDoList();

 	for (i = 0; i < res.length; i++) {
 	 	returnedTodos.add(getToDoItemfromServerJSON(res[i]));
 	}
 	return returnedTodos;
}

var compareFunctionDueDate = function(a, b) {
 	 	if (a.getDueDate().isBefore(b.getDueDate())) {
 	 	 	return -1;
 	 	} else if (!a.getDueDate().isBefore(b.getDueDate())) {
 	 	 	return 1;
 	 	} else {
 	 	 	return 0;
 	 	}
 	}
 	//TODO not functional
var compareFunctionPrio = function(a, b) {
 	if (a.priority === true && b.priority === false) {
 	 	return -1;
 	} else if (a.priority === false && b.priority === true) {
 	 	return 1;
 	} else {
 	 	return 0;
 	}
}

ToDoList.prototype.sortAccordingToDueDate = function() {
 	this.list.sort(compareFunctionDueDate);
 	var listReturned = new ToDoList();
 	listReturned.list = this.list.sort(compareFunctionDueDate);
 	return listReturned;
}

ToDoList.prototype.sortAccordingToPrio = function() {

 	var withPrio = [];
 	var withoutPrio = [];

 	for (i = 0; i < this.list.length; i++) {
 	 	if (this.list[i].getPriority() === true) {
 	 	 	withPrio.push(this.list[i]);
 	 	} else {
 	 	 	withoutPrio.push(this.list[i]);
 	 	}
 	}
 	//TODO : sort the sublists according to due date?

 	var returnedList = withPrio.concat(withoutPrio);
 	var returnedToDoList = new ToDoList();
 	this.list.sort(compareFunctionPrio);
 	returnedToDoList.list = this.list;
 	return returnedToDoList;
}

//Returns the portion of the list that contains only a string in the title
ToDoList.prototype.subsetBasedOnTitle = function(string) {
 	var returnedList = new ToDoList();

 	for (i = 0; i < this.list.length; i++) {
 	 	if (this.get(i).getTitle().search(string) !== -1) {
 	 	 	returnedList.add(this.get(i));
 	 	}
 	}

 	return returnedList;
}

ToDoList.prototype.removeById = function(idparam) {
 	for (i = 0; i < this.list.length; i++) {
 	 	if (this.get(i).getId() === idparam) {
 	 	 	this.remove(i);
 	 	 	return;
 	 	}
 	}
}
