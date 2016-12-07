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
 	}
};
