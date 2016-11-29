

//show the to do items on the page

var currentActiveIndex;

var returnIndexFromString = function(string) {
return string.replace( /^\D+/g, ''); // replace all leading non-digits with nothing
}


var makeIDWithElementIndex = function(name, index) {
  return 'id="' + name + index + '"';
}

var makeClassString = function(className) {
  return 'class="' + className + '"';
}


var createElementString = function(type, name, index, content) {
  if (index === -1) {
    return '<' + type  + '>' + content + '</' + type + '>';
  }
  return '<' + type + ' ' + makeIDWithElementIndex(name, index) + '>' + content + '</' + type + '>';
}

var createElementStringWithClass = function(type, classToSet, name, index, content) {
  if (index === -1) {
    return '<' + type  + '>' + content + '</' + type + '>';
  }
  return '<' + type + ' ' + makeIDWithElementIndex(name, index) + " " + makeClassString(classToSet) +  '>' + content + '</' + type + '>';
}

/* Returns a single to Do list item STring
*/
var returnToDoListHTML = function(todoItem, index) {
  var returnString = '<li id="listitem' + index + '">';
  returnString = returnString + createElementStringWithClass("button", "removeButton", "removeToDo", index, "Remove todo item");
  returnString = returnString + createElementString("h3", "toDoTitle", index, todoItem.getTitle());
  returnString = returnString + createElementString("h4", "toDoDueDate", index, todoItem.getDueDate());
  returnString = returnString + createElementString("h4", "toDoPrio", index, todoItem.getPriorityString());
  returnString = returnString + "</li>";
return returnString;
}

//REPRINTS THE todo list according to values in the JS list
var reprintToDoList = function() {
  //Remove everything that is already in the list
  $("#toDoItemList").empty();
  //Add all to do items
  for (i = 0; i < toDoList.length; i++) {
    $("#toDoItemList").append(returnToDoListHTML(toDoList[i], i));
  }
}

//CHanges HTML of the detailed view to reflect the current selected TASK
//Needs fixing, currently deleting the todo also triggers this
var reprintCurrentSelected = function(index) {

  currentActiveIndex = index;
  var currToDo = toDoList[index];

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

  $("#detailsDescriptionText").html(currToDo.getDescription());

  //$("#detailsReminderText").html(currToDo.getReminderDate());

}


//Adds a new toDo Item
var addToDoItem = function() {
  var toAdd = new ToDoItem();
  toAdd.setTitle("Untitled");
  toDoList.push(toAdd);
  reprintCurrentSelected(toDoList.length - 1);
  reprintToDoList();
}



$(document).ready(function(){

  reprintToDoList();



//CLICKING ON REMOVE BUTTON HANDLER
//On is used instead of onclick, so that newly created DOM elements will also have these event handlers
  $("#toDoItemList").on("click", ".removeButton", function(){

    var index = returnIndexFromString($(this).attr('id'));

    //Remove this element
    toDoList.splice(index, 1);

    //Redraw todo list in html
    reprintToDoList();
  });

  //CLICKING ON A TASK DISPLAYS DETAILS IN HTML BELOW (LATER RIGHT SIDE)
  $("#toDoItemList").on("click", "li", function(){

    var index = returnIndexFromString($(this).attr('id'));
    reprintCurrentSelected(index);
    //Redraw description in html?
  });

  $("#addToDo").click(function(){
      addToDoItem();
  });

});
