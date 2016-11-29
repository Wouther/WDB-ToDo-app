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
