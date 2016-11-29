

//Set to -1 if no to do is focused
var currentActiveIndex = -1;

//REPRINTS THE todo list according to values in the JS list
var reprintToDoList = function() {
  //Remove everything that is already in the list
  $("#toDoItemList").empty();
  //Add all to do items

  for (i = 0; i < toDoList.length(); i++) {
    $("#toDoItemList").append(returnToDoListHTML(toDoList.get(i), i));
  }
}

//CHanges HTML of the detailed view to reflect the current selected TASK
//Needs fixing, currently deleting the todo also triggers this
var reprintCurrentSelectedInDetails = function(index) {

  var currToDo = toDoList.get(index);

  if (!currToDo) {
    console.log("ToDo item removed");
    return;
  }
  $("#detailsTitle").val(currToDo.getTitle());

  if (currToDo.getPriority()) {
    $("#detailsSetPriority").html("Has prio. Click to set to no prio.");
  } else {
    $("#detailsSetPriority").html("No prio. Click to set to prio.");
  }

  $("#detailsDueDate").html(currToDo.getDueDate());

  $("#detailsDescriptionText").val(currToDo.getDescription());

  //$("#detailsReminderText").html(currToDo.getReminderDate());

}

//Adds a new toDo Item
var addToDoItem = function() {
  var toAdd = new ToDoItem();
  toAdd.setTitle("Untitled");
  toDoList.add(toAdd);
  reprintCurrentSelectedInDetails(toDoList.length() - 1);
  currentActiveIndex = toDoList.length() - 1;
  reprintToDoList();
}

$(document).ready(function(){

  reprintToDoList();

//CLICKING ON REMOVE BUTTON HANDLER
//On is used instead of onclick, so that newly created DOM elements will also have these event handlers
  $("#toDoItemList").on("click", ".removeButton", function(){

    var index = returnIndexFromString($(this).attr('id'));

    //Remove this element
    toDoList.remove(index);

    //If the removed element was focused, we set the focus to -1
    if (currentActiveIndex === index) {
      currentActiveIndex = -1;
    }

    //Redraw todo list in html
    //TODO:
    //Could be replaced by only removing one single element!
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
      toDoList.get(currentActiveIndex).setTitle($(this).val());
      reprintToDoList();
    }
  });

  $("#detailsSetPriority").click(function(){
    if (currentActiveIndex !== -1) {
      toDoList.get(currentActiveIndex).togglePrio();
      reprintToDoList();
      reprintCurrentSelectedInDetails(currentActiveIndex);
    }
  });

  $("#detailsDescriptionText").change(function() {
    if (currentActiveIndex !== -1) {
      toDoList.get(currentActiveIndex).setDescription($(this).val());
    }
  });


  $("#sortPriority").click(function(){
    toDoList = toDoList.sortAccordingToPrio();
    reprintToDoList();
  });








});
