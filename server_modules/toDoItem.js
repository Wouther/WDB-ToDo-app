var moment = require('moment');
exports.index = function(req, res) {
 	res.render('index', {
 	 	moment: moment
 	});
}

module.exports = {
 	ToDoItem: function() {
 	 	this.title = "Untitled";
 	 	this.creationDate = moment();
 	 	this.dueDate = moment();
 	 	//Set default due date to be in 1 week.
 	 	this.dueDate.add(7, 'days');
 	 	this.priority = false;
 	 	this.description = "";
 	 	//TODO: reminder
 	 	this.hasReminder = false;
 	 	this.reminder = null;
 	 	this.completed = false;
 	 	this.completionDate = null;
 	},
  createItemFromDBEntry: function(dbData) {
    todoitem = {};
    todoitem.title = dbData.title;
    todoitem.creationDate = moment(dbData.creationDate);
    todoitem.dueDate = moment(dbData.dueDate);
    //Set default due date to be in 1 week.
    if (dbData.priority === 1) {
      todoitem.priority = true;
    } else {
      todoitem.priority = false;
    }
    todoitem.description = dbData.description;
    //TODO: reminder
    if (dbData.hasReminder === 1) {
    todoitem.hasReminder = true;
    } else {
    todoitem.hasReminder = false;
    }
    todoitem.reminder = moment(dbData.reminder);
    if (dbData.completed === 1) {
    todoitem.completed = true;
    } else {
    todoitem.completed = false;
    }
    todoitem.completionDate = moment(dbData.completionDate);
    return todoitem;
  }
};
