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

var createStringForDoneButton = function(todoitem, index) {
  var returnString = "";
  if (todoitem.getCompleted() === true) {
    returnString = returnString + createElementStringWithClass("button", "doneButtonList", "doneButtonList", index, "Done. Click to undo") + "<br>";
    returnString = returnString + "Completed on: " + createElementString("h4", "toDoCompletedDate", index, todoitem.getCompletionDateString());
    return returnString;
  } else {
    returnString = returnString + createElementStringWithClass("button", "doneButtonList", "doneButtonList", index, "Set as done.");
    return returnString;
  }
}

/* Returns a single to Do list item STring ready to be inserted into HTML.
*/
var returnToDoListHTML = function(todoItem, index) {
  var returnString = '<li id="listitem' + index + '">';
  returnString = returnString + createElementStringWithClass("button", "removeButton", "removeToDo", index, "Remove todo item");
  returnString = returnString + createElementString("h3", "toDoTitle", index, todoItem.getTitle());
  returnString = returnString + createElementString("h4", "toDoDueDate", index, todoItem.getDueDateString());
  returnString = returnString + createElementString("h4", "toDoPrio", index, todoItem.getPriorityString());
  returnString = returnString + createStringForDoneButton(todoItem, index);
  returnString = returnString + "</li>";
return returnString;
}

var returnOptionForDayOfTheMonth = function(day) {
  return '<option value="' + day + '">' + day + "</option>";
}
