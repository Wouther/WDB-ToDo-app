//Constructor
var ToDoItem = function() {
 	this.id = generateID();
 	this.title = "Untitled";
 	this.creationDate = moment();

    // Set default due date
 	this.dueDate = moment(); // current date/time
 	this.dueDate.add(7, 'days'); // set default due date to be in 1 week.

 	this.priority = false;
 	this.description = "";

    // Set default reminder
 	this.reminderDate = this.dueDate.subtract(1, 'hours'); // set default reminder one hour before due

 	this.completed = false;
 	this.completionDate = null;

    this.owner = 1; // TODO by definition always owned by self when created. replace this with own user id when logging is implemented
    this.assignee = null; // Not assigned to anyone by default
};

ToDoItem.prototype.equals = function(otherToDo) {

 	if (typeof(otherToDo) !== "object") {
 	 	return false;
 	}

  for (var k in this){
    if (this.hasOwnProperty(k)) {
      //Special case for moment comparison
      if (moment.isMoment(this[k])) {

        if (!this[k].isSame(otherToDo[k])) {
          console.log("date not the same:" + otherToDo[k])
          return false;
        }

      } else {
        if (this[k] !== otherToDo[k]) {
          //console.log(this[k]);
          //console.log(otherToDo[k]);
          console.log( k + " not the same:" + otherToDo[k])
          console.log(this[k]);
          console.log(otherToDo[k]);
          return false;
        }
      }
    }
}
 	return true;
}

ToDoItem.prototype.getId = function() {
 	return this.id;
}

ToDoItem.prototype.setId = function(newid) {
 	this.id = newid;
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

ToDoItem.prototype.getCompleted = function() {
 	return this.completed;
}

ToDoItem.prototype.getCompletedStatusString = function() {
 	if (this.completed) {
        return "true";
    }
    else {
        return "false";
    }
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
    if (this.dueDate === null) {
        return "None";
    } else {
        return this.dueDate.calendar(); // Returns as readable calendar text (e.g. "Tomorrow")
    }
}

ToDoItem.prototype.getDueDateStatusString = function() {
    if (this.dueDate === null) {
        return "none";
    }
    if (this.dueDate.isAfter(moment())) {
 	    return "due";
    }
    else {
        return "overdue";
    }
}

ToDoItem.prototype.getReminder = function() {
 	return this.reminderDate;
}

ToDoItem.prototype.getReminderString = function() {
    if (this.reminderDate === null) {
        return "None";
    } else {
 	    return this.reminderDate.calendar(); // Returns as readable calendar text (e.g. "Tomorrow")
    }
}

ToDoItem.prototype.getReminderStatusString = function() {
    if (this.reminderDate === null) {
        return "none";
    }
    if (this.reminderDate.isAfter(this.dueDate)) {
        return "invalid";
    }
    else {
        if (this.reminderDate.isBefore(moment())) {
            return "overdue";
        }
        else {
            return "due";
        }
    }
}

ToDoItem.prototype.getCompletionDateString = function() {
    if (this.completed) {
        return this.completionDate.calendar(); // Returns as readable calendar text (e.g. "Tomorrow")
    }
    else {
        return "Not completed yet.";
    }
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

ToDoItem.prototype.setDueDateDayOfMonth = function(day) {
 	this.dueDate.date(day);
}

ToDoItem.prototype.setReminder = function(date) {
 	this.reminderDate = date;
}

ToDoItem.prototype.setReminderHours = function(hours) {
 	this.reminderDate.hour(hours);
}

ToDoItem.prototype.setReminderMinutes = function(minutes) {
 	this.reminderDate.minutes(minutes);
}

ToDoItem.prototype.setReminderYear = function(year) {
 	this.reminderDate.year(year);
}

ToDoItem.prototype.setReminderMonth = function(month) {
 	this.reminderDate.month(month);
}

ToDoItem.prototype.setReminderDayOfMonth = function(day) {
 	this.reminderDate.date(day);
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
 	 	return "high";
 	}
 	return "low";
}

ToDoItem.prototype.setOwner = function(ownerId) {
 	this.owner = ownerId;
}

// Returns user id of owner
ToDoItem.prototype.getOwner = function() {
 	return this.owner;
}

ToDoItem.prototype.getOwnerName = function() {
    for (var k in allUsersInMemory) {
        if (allUsersInMemory[k].id == this.owner) {
            return allUsersInMemory[k].name;
        }
    }
    console.log("Unable to get owner name. Invalid user id '" + this.owner + "'?")
 	return "";
}

ToDoItem.prototype.setAssignee = function(assigneeId) {
    if (assigneeId == undefined) {
        this.assignee = null;
    } else {
 	  this.assignee = assigneeId;
    }
}

// Returns user id of assignee
ToDoItem.prototype.getAssignee = function() {
 	return this.assignee;
}

ToDoItem.prototype.getAssigneeName = function() {
    if (this.assignee == null) {
        return "";
    }

    for (var k in allUsersInMemory) {
        if (allUsersInMemory[k].id == this.assignee) {
            return allUsersInMemory[k].name;
        }
    }
    console.log("Unable to get assignee name. Invalid user id '" + this.assignee + "'?")
 	return "";
}

var getToDoItemfromServerJSON = function(res) {

 	var todo = new ToDoItem();
 	for (var k in res) {
    //TODO something better here:
 	if ((k === "dueDate" || k === "completionDate" || k === "reminderDate") && res[k]) {
 	 	todo[k] = moment.utc(res[k]);
 	} else {
    todo[k] = res[k];
  }
  }
 	return todo;
}

/* Returns HTML for a todo item to be inserted into the todos overview
 */
ToDoItem.prototype.getHTML = function(index) {
 	var listItem = document.createElement('li');
 	listItem.setAttribute("id", "listitem" + index);
    listItem.setAttribute("data-completedStatus", this.getCompletedStatusString());

 	var removeButton = document.createElement('button');
    removeButton.setAttribute("id", "removeToDo" + index);
 	removeButton.setAttribute("class", "icon removeTodo");

 	var toDoTitle = document.createElement('div');
    toDoTitle.setAttribute("id", "toDoTitle" + index);
    toDoTitle.setAttribute("class", "todoTitle");
 	toDoTitle.innerHTML = this.title;

    var toDoPrio = document.createElement('div');
 	toDoPrio.setAttribute("id", "toDoPrio" + index);
    toDoPrio.setAttribute("class", "icon priority");
 	toDoPrio.setAttribute("data-priority", this.getPriorityString());

 	var toDoDueDate = document.createElement('div');
    toDoDueDate.setAttribute("id", "toDoDueDate" + index);
    toDoDueDate.setAttribute("class", "dueDate");
    toDoDueDate.setAttribute("data-dueStatus", this.getDueDateStatusString());
 	toDoDueDate.innerHTML = this.getDueDateString();

 	var toDoCompletionDate = document.createElement('div');
    toDoCompletionDate.setAttribute("id", "toDoCompletionDate" + index);
    toDoCompletionDate.setAttribute("class", "completionDate");
 	toDoCompletionDate.innerHTML = this.getCompletionDateString();

 	var toDoAssignee = document.createElement('div');
    toDoAssignee.setAttribute("id", "toDoAssignee" + index);
    toDoAssignee.setAttribute("class", "assignee");
 	toDoAssignee.innerHTML = this.getAssigneeName();

 	var doneButton = document.createElement('button');
 	doneButton.setAttribute("id", "doneButtonList" + index);
 	doneButton.setAttribute("class", "icon setDone");

    var overviewSection = document.createElement('section');
    overviewSection.setAttribute("class", "overview");
 	overviewSection.appendChild(toDoTitle);
    overviewSection.appendChild(toDoPrio);
    overviewSection.appendChild(toDoDueDate);
    overviewSection.appendChild(toDoCompletionDate);
    overviewSection.appendChild(toDoAssignee);

 	listItem.appendChild(removeButton);
    listItem.appendChild(overviewSection);
 	listItem.appendChild(doneButton);

 	return listItem;
}
