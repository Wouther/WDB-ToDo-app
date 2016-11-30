
//Constructor
var ToDoItem = function() {
  this.id = "";
  this.title = "";
  this.creationDate = moment();
  this.dueDate = moment();
  //Set default due date to be in 1 week.
  this.dueDate.add(7, 'days');
  this.priority = false;
  this.description = "";
  this.reminder = "";
  this.completed = false;
  this.completionDate = null;
};

//Getters and setters

ToDoItem.prototype.equals = function(otherToDo) {

  if (typeof(otherToDo) !== "object") {
    return false;
  }

  if (this.id === otherToDo.id) {
    return true;
  }
  return false;
}

ToDoItem.prototype.setAsCompleted = function(date) {
  this.completionDate = date;
  this.completed = true;
}

ToDoItem.prototype.removeCompleted = function() {
  //Remove the completedDate if it is present
  if (this.completionDate) {
      this.completionDate = null;
  }

  this.completed = false;
}

ToDoItem.prototype.getTitle = function() {
  return this.title;
}

ToDoItem.prototype.setTitle = function(title) {
  this.title = title;
}

ToDoItem.prototype.getDueDate = function() {
  return this.dueDate;
}

ToDoItem.prototype.getDueDateString = function() {
  return this.dueDate.format();
}

ToDoItem.prototype.setDueDate = function(date) {
  this.dueDate = date;
}

ToDoItem.prototype.setDueDateHours = function(hours) {
  this.dueDate.hour(hours);
}

ToDoItem.prototype.setDueDateMinutes = function(minutes) {
  this.dueDate.minutes(minutes);
}

ToDoItem.prototype.setDueDateYear = function(year) {
  this.dueDate.year(year);
}

ToDoItem.prototype.setDueDateMonth = function(month) {
  this.dueDate.month(month);
}

ToDoItem.prototype.setDueDateDateOfMonth = function(day) {
  this.dueDate.date(day);
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

ToDoItem.prototype.togglePrio = function() {
  this.priority = !this.priority;
}

ToDoItem.prototype.getPriorityString = function() {
  if (this.priority === true) {
    return "Prio";
  }
  return "No prio";
}
