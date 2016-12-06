var shownToDoList = new ToDoList();
var allToDosInMemory = new ToDoList();

//Set to -1 if no to do is focused, this is default on starting the page
var currentActiveIndex = -1;

//REPRINTS THE todo list according to values in the ToDoList object
var reprintToDoList = function() {
 	//Remove everything that is already in the list
 	$("#toDoItemList").empty();
 	//Add all to do items from internal object
 	for (i = 0; i < shownToDoList.list.length; i++) {
 	 	$("#toDoItemList").append(shownToDoList.get(i).getHTML(i));
 	}
}

//CHanges HTML of the detailed view to reflect the current selected todo
//Needs fixing, currently deleting the todo also triggers this (?)
// however, I believe it works a it is supposed to now.
var reprintCurrentSelectedInDetails = function(index) {

 	var currToDo = shownToDoList.get(index);

 	if (!currToDo) {
 	 	return;
 	}
 	$("#detailsTitle").val(currToDo.getTitle());

    $("#detailsSetPriority").attr("data-priority", currToDo.getPriorityString());

 	//Update duedate dropdown values
    $("#detailsDueDate").val(currToDo.getDueDate().format("YYYY-MM-DD")); // Format for HTML5 date input element
//    $("#detailsReminderDateTime").val(currToDo.getDueDate().toISOString().slice(0, -1)); // HTML5 input datetime-local element accepts ISO string without trailing 'Z'

 	//Description
 	$("#detailsDescriptionText").val(currToDo.getDescription());

}

//Adds a new toDo Item
var addToDoItem = function() {
 	var toAdd = new ToDoItem();
 	toAdd.setTitle("Untitled");
 	shownToDoList.add(toAdd);
 	toDoList.add(toAdd);
 	reprintCurrentSelectedInDetails(shownToDoList.length() - 1);
 	currentActiveIndex = shownToDoList.length() - 1;
 	reprintToDoList();
}

//Changes a todo title in the internal object.
var changeToDoTitle = function(value) {
 	shownToDoList.get(currentActiveIndex).setTitle(value);
 	//TODO: other stuff, HTTP PUT request(?), change stuff in database
}

var filterShownToDosOnTitle = function(value) {

 	//IF the searchbox is empty, we need to show all todo's again
 	if (!value) {
 	 	shownToDoList = jQuery.extend(true, {}, toDoList);
 	} else { //else, filter based on string
 	 	shownToDoList = toDoList.subsetBasedOnTitle(value);
 	}

 	reprintToDoList();
 	currentActiveIndex = -1;
}

var toggleDone = function(index) {
 	var currToDo = shownToDoList.get(index);
 	if (!currToDo.getCompleted()) {
 	 	currToDo.setAsCompleted(moment());
 	} else {
 	 	currToDo.removeCompleted();
 	}
 	reprintToDoList();
}

// Changes a todo due date in the internal object and on the page.
// Parameter 'value' should be formatted as 'YYYY-MM-DD'.
var changeDueDate = function(value) {
    $("#detailsDueDate").val(value);
 	//TODO: other stuff, HTTP PUT request(?)
}

//Executed when document has finished loading
$(document).ready(function() {

 	//Get all todos from server
 	var getToDoList = $.get("/todos", function(req, res) {})
 	 	.done(function(res) {

 	 	 	//Put the gained to do list in client memory todo list
 	 	 	allToDosInMemory.list = getToDoListObjectFromServerJSON(res).list;
 	 	 	shownToDoList.list = allToDosInMemory.list;
 	 	 	reprintToDoList();
 	 	});

 	//Print the initial list


 	//CLICKING ON REMOVE BUTTON HANDLER
 	//On is used instead of onclick, so that newly created DOM elements will also have these event handlers
 	$("#toDoItemList").on("click", ".removeButton", function() {

 	 	//Get the list elemenent index
 	 	var index = returnIndexFromString($(this).attr('id'));

 	 	//remove from original list
 	 	toDoList.removeById(shownToDoList.get(index).getId());

 	 	//Remove this element from shown list
 	 	shownToDoList.remove(index);

 	 	//If the removed element was focused in the detailed view, we set the focus to -1
 	 	if (currentActiveIndex === index) {
 	 	 	currentActiveIndex = -1;
 	 	}

 	 	//Redraw todo list in html
 	 	//TODO: Could be replaced by only removing one single element! But that is not trivial,
 	 	//because then the ID's of all the elements after the removed one also need to be changed.
 	 	reprintToDoList();

 	});

 	//CLICKING ON A TASK DISPLAYS DETAILS IN HTML BELOW (LATER RIGHT SIDE)
 	//Current click event set on the li, list item, in the future: a div?
 	$("#toDoItemList").on("click", "li", function() {

 	 	var index = returnIndexFromString($(this).attr('id'));
 	 	currentActiveIndex = index;
 	 	reprintCurrentSelectedInDetails(index);
 	 	//Redraw description in html?
 	});

 	$("#toDoItemList").on("click", ".setDone", function() {
 	 	console.log("kom ik hier");
 	 	var index = returnIndexFromString($(this).attr('id'));
 	 	toggleDone(index);
 	});

 	$("#addToDo").click(function() {
 	 	console.log("Clicked add to do");
 	 	addToDoItem();
 	});

 	$("#searchField").change(function() {
 	 	var newValue = $(this).val();
 	 	filterShownToDosOnTitle(newValue);
 	});

 	$("#detailsTitle").change(function() {
 	 	if (currentActiveIndex !== -1) {
 	 	 	var changedValue = $(this).val();
 	 	 	changeToDoTitle(changedValue);
 	 	 	reprintToDoList();
 	 	}
 	});

 	$("#detailsSetPriority").click(function() {
 	 	if (currentActiveIndex !== -1) {
 	 	 	shownToDoList.get(currentActiveIndex).togglePrio();
 	 	 	reprintToDoList();
 	 	 	reprintCurrentSelectedInDetails(currentActiveIndex);
 	 	}
 	});

 	$("#detailsDescriptionText").change(function() {
 	 	if (currentActiveIndex !== -1) {
 	 	 	shownToDoList.get(currentActiveIndex).setDescription($(this).val());
 	 	}
 	});

 	$("#sortPriority").click(function() {
 	 	shownToDoList = shownToDoList.sortAccordingToPrio();
 	 	reprintToDoList();
 	});

 	$("#sortDate").click(function() {
 	 	shownToDoList = shownToDoList.sortAccordingToDueDate();
 	 	reprintToDoList();
 	});

 	$("#detailsDueDate").change(function() {
 	 	var newValue = moment($(this).val(), "YYYY-MM-DD");
 	 	if (currentActiveIndex !== -1) {
            shownToDoList.get(currentActiveIndex).setDueDate(newValue);
 	 	 	changeDueDate(newValue.format("YYYY-MM-DD"));
 	 	 	reprintToDoList();
 	 	}
 	});

 	//Retrieve the list of todos from the server each 2 seconds
 	setInterval(function() {
 	 	//console.log("Fetching the todo list from the server.");
 	 	$.getJSON("todos", function(data) {
 	 	 	//DO SOMETHING WITH THE RETRIEVED TO DOS HERE
 	 	 	//3 TYPES OF CHANGES:
 	 	 	//  todo was added on server
 	 	 	//  todo was deleted on server
 	 	 	// todo was changed on server
 	 	 	//console.log(data);
 	 	});
 	}, 2000);

});
