var moment = require('moment');
exports.index = function(req, res) {
 	res.render('index', {
 	 	moment: moment
 	});
}

module.exports = {
 	ToDoItem: function() {
        this.id; // TODO is this okay or generate id?
 	 	this.title = "Untitled";
 	 	this.creationDate = moment();

        // Set default due date
        this.dueDate = moment(); // current date/time
 	 	//Set default due date to be in 1 week.
        this.dueDate.add(7, 'days'); // set default due date to be in 1 week.

 	 	this.priority = false;
 	 	this.description = "";

        // Set default reminder
     	this.reminderDate = this.dueDate.subtract(1, 'hours'); // set default reminder one hour before due

 	 	this.completed = false;
 	 	this.completionDate = null;

        this.owner = 1; // TODO by definition always owned by self when created. replace this with own user id when logging is implemented
        this.assignee = null; // Not assigned to anyone by default
 	},
  createItemFromDBEntry: function(dbData) {
    todoitem = {};
    todoitem.id = dbData.id;
    todoitem.title = dbData.title;
    todoitem.creationDate = moment(dbData.creationDate);
    todoitem.dueDate = moment(dbData.dueDate);
    if (dbData.priority === 1) {
        todoitem.priority = true;
    } else {
        todoitem.priority = false;
    }
    todoitem.description = dbData.description;
    todoitem.reminderDate = moment(dbData.reminderDate);
    if (dbData.completed === 1) {
        todoitem.completed = true;
    } else {
        todoitem.completed = false;
    }
    todoitem.completionDate = moment(dbData.completionDate);
    todoitem.owner = dbData.owner;
    todoitem.assignee = dbData.assigneeid;
    todoitem.assigndate = dbData.assigndate;
    return todoitem;
  },
  createDBitemFromQuery: function(query) {
    todoitem = {};
  },
  parseEntryForDB: function (entry) {

  }
};
