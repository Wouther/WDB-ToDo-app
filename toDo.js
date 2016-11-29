
//Constructor
var ToDoItem = function() {
  this.title = "";
  this.dueDate = "";
  this.priority = false;
  this.description = "";
  this.reminder = "";
};

//Getters and setters
ToDoItem.prototype.getTitle = function() {
  return this.title;
}

ToDoItem.prototype.setTitle = function(title) {
  this.title = title;
}

ToDoItem.prototype.getDueDate = function() {
  return this.dueDate;
}

ToDoItem.prototype.setDueDate = function(date) {
  this.dueDate = date;
}

ToDoItem.prototype.getPriority = function() {
  return this.priority;
}

ToDoItem.prototype.setPriority = function(prio) {

  if (prio !== true && prio !== false) {
    console.log("wrong input for changing the priority");
    return;
  }

  this.priority = prio;
}

ToDoItem.prototype.getDescription = function() {
  return this.description;
}

ToDoItem.prototype.setDescription = function(desc) {
  this.description = desc;
}

ToDoItem.prototype.getPriorityString = function() {
  if (this.priority === true) {
    return "Prio";
  }
  return "No prio";
}

blankToDo = new ToDoItem();
blankToDo.setTitle("Your title here");
blankToDo.setDueDate("30/11/16 12:00");
blankToDo.setPriority(false);
blankToDo.setDescription("");
