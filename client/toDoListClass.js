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

ToDoList.prototype.sortAccordingToDueDate = function() {

 	var returnedList = [];

 	var placeAtRightPlaceInList = function(list, value) {

 	 	if (list.length === 0) {
 	 	 	list.push(value);
 	 	 	return;
 	 	}

 	 	if (!list[0].getDueDate().isBefore(value.getDueDate())) {
 	 	 	list.splice(0, 0, value);
 	 	 	return;
 	 	}

 	 	for (j = 0; j < list.length - 1; j++) {

 	 	 	if (list[j].getDueDate().isBefore(value.getDueDate()) && !list[j + 1].getDueDate().isBefore(value.getDueDate())) {
 	 	 	 	list.splice(j, 0, value);
 	 	 	 	return;
 	 	 	}
 	 	}
 	 	list.push(value);
 	 	return;
 	}

 	for (i = 0; i < this.list.length; i++) {
 	 	placeAtRightPlaceInList(returnedList, this.list[i]);
 	}

 	var returnedToDoList = new ToDoList();
 	returnedToDoList.list = returnedList;
 	return returnedToDoList;
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
 	returnedToDoList.list = returnedList;
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
