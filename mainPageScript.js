

//Set to -1 if no to do is focused
var currentActiveIndex = -1;

//REPRINTS THE todo list according to values in the ToDoList object
var reprintToDoList = function() {
  //Remove everything that is already in the list
  $("#toDoItemList").empty();
  //Add all to do items

  for (i = 0; i < shownToDoList.length(); i++) {
    $("#toDoItemList").append(returnToDoListHTML(shownToDoList.get(i), i));
  }
}

//CHanges HTML of the detailed view to reflect the current selected todo
//Needs fixing, currently deleting the todo also triggers this (?)
var reprintCurrentSelectedInDetails = function(index) {

  var currToDo = shownToDoList.get(index);

  if (!currToDo) {
    return;
  }
  $("#detailsTitle").val(currToDo.getTitle());

  if (currToDo.getPriority()) {
    $("#detailsSetPriority").html("Has prio. Click to set to no prio.");
  } else {
    $("#detailsSetPriority").html("No prio. Click to set to prio.");
  }

  //$("#detailsDueDate").html(currToDo.getDueDate());
  $("#detailsDueDateYear").val(currToDo.getDueDate().year());
  resetOptionsDueDate();
  $("#detailsDueDateMonth").val(currToDo.getDueDate().month() + 1);
  $("#detailsDueDateDay").val(currToDo.getDueDate().date());

  $("#detailsDescriptionText").val(currToDo.getDescription());

  //$("#detailsReminderText").html(currToDo.getReminderDate());
}

//Adds a new toDo Item
var addToDoItem = function() {
  var toAdd = new ToDoItem();
  toAdd.setTitle("Untitled");
  shownToDoList.add(toAdd);
  reprintCurrentSelectedInDetails(shownToDoList.length() - 1);
  currentActiveIndex = shownToDoList.length() - 1;
  reprintToDoList();
}

//Changes a todo title
var changeToDoTitle = function(value) {
  shownToDoList.get(currentActiveIndex).setTitle(value);
  //TODO: other stuff, HTTP PUT request(?)
}

var resetOptionsDueDate = function() {
  if (currentActiveIndex === -1) {
    return;
  }

  var currToDo = shownToDoList.get(currentActiveIndex);
  var numberOfDays = currToDo.getDueDate().daysInMonth();

  //Empty the dropdown menu
  $("#detailsDueDateDay").empty();
  //Add all to do items

  for (i = 1; i < numberOfDays + 1; i++) {
    $("#detailsDueDateDay").append(returnOptionForDayOfTheMonth(i));
  }

}

//Changes a todo due date/ month
var changeDueDateYear = function(value) {
  shownToDoList.get(currentActiveIndex).setDueDateYear(value);
  //Change options for days of the month
  resetOptionsDueDate();
  $("#detailsDueDateMonth").val(shownToDoList.get(currentActiveIndex).getDueDate().month() + 1);
  $("#detailsDueDateDay").val(shownToDoList.get(currentActiveIndex).getDueDate().date());
  //TODO: other stuff, HTTP PUT request(?)
}

//Changes a todo due date/ month
var changeDueDateMonth = function(value) {
  shownToDoList.get(currentActiveIndex).setDueDateMonth(value - 1);
  resetOptionsDueDate();
  $("#detailsDueDateDay").val(shownToDoList.get(currentActiveIndex).getDueDate().date());
  //TODO: other stuff, HTTP PUT request(?)
}

//Changes a todo due date/ month
var changeDueDateDateOfMonth = function(value) {
  shownToDoList.get(currentActiveIndex).setDueDateDateOfMonth(value);
  //TODO: other stuff, HTTP PUT request(?)
}

//Executed when document has finished loading
$(document).ready(function(){

//Print the initial list
  reprintToDoList();

//CLICKING ON REMOVE BUTTON HANDLER
//On is used instead of onclick, so that newly created DOM elements will also have these event handlers
  $("#toDoItemList").on("click", ".removeButton", function(){

    var index = returnIndexFromString($(this).attr('id'));

    //Remove this element
    shownToDoList.remove(index);

    //If the removed element was focused in the detailed view, we set the focus to -1
    if (currentActiveIndex === index) {
      currentActiveIndex = -1;
    }

    //Redraw todo list in html
    //TODO: Could be replaced by only removing one single element!
    reprintToDoList();

  });

  //CLICKING ON A TASK DISPLAYS DETAILS IN HTML BELOW (LATER RIGHT SIDE)
  $("#toDoItemList").on("click", "li", function(){

    var index = returnIndexFromString($(this).attr('id'));
    currentActiveIndex = index;
    reprintCurrentSelectedInDetails(index);
    //Redraw description in html?
  });

  $("#addToDo").click(function(){
      addToDoItem();
  });

  $("#detailsTitle").change(function() {
    if (currentActiveIndex !== -1) {
      var changedValue = $(this).val();
      changeToDoTitle(changedValue);
      reprintToDoList();
    }
  });

  $("#detailsSetPriority").click(function(){
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

  $("#sortPriority").click(function(){
    shownToDoList = shownToDoList.sortAccordingToPrio();
    reprintToDoList();
  });

  $("#sortDate").click(function(){
    shownToDoList = shownToDoList.sortAccordingToDueDate();
    reprintToDoList();
  });

  $("#detailsDueDateDay").change(function(){
    var newValue = $(this).val();
    if (currentActiveIndex !== -1) {
      changeDueDateDateOfMonth(newValue);
      reprintToDoList();
    }
  });

  $("#detailsDueDateMonth").change(function(){
    var newValue = $(this).val();
    if (currentActiveIndex !== -1) {
      changeDueDateMonth(newValue);
      reprintToDoList();
    }
  });

  $("#detailsDueDateYear").change(function(){
    var newValue = $(this).val();
    if (currentActiveIndex !== -1) {
      changeDueDateYear(newValue);
      reprintToDoList();
    }
  });


});
