var shownToDoList = new ToDoList();
var allToDosInMemory = new ToDoList();
var allUsersInMemory = []; // json object with users, having fields 'id' and 'name'.
var thisUserInMemory = []; // json object with data of currently logged in user
var zoomLevel = 100; // Zoom value (percentage, default = 100)

//window.localStorage.setItem("token", "ashdgahs1231231212");
console.log(window.localStorage.getItem("token"));

//Return to login page if token is not valid anymore
var returnToInlog = function() {
    localStorage.removeItem("token");
    window.location = '/';
    console.log("Returned to login page, login token not recognised by server.");
}

//Set to -1 if no to do is focused, this is default on starting the page
var currentActiveIndex = -1;

//Zoom page to current zoom level
var zoomPage = function() {
    console.log("Zooming page to current zoom level (" + zoomLevel + ").");
    $("body").css({zoom: (zoomLevel / 100).toString()})
}

//Get zoom value from server (cookie) and zoom page to the new level.
var zoomGet = function() {
    // Get zoom level from cookie
    zoomLevel = parseInt(Cookies.get('zoomlevel'));
    if (isNaN(zoomLevel)) {
        zoomSet(100); // default
        return;
    }

    // Actually zoom the page
    zoomPage();
}

//Set zoom value on server (cookie) and zoom page to the new level.
var zoomSet = function(newZoomLevel) {
    // Save new zoom level locally
    if (newZoomLevel < 10) { // most zoomed out allowed
        zoomLevel = 10;
    } else if (newZoomLevel > 200) { // most zoomed in allowed
        zoomLevel = 200;
    } else {
        zoomLevel = newZoomLevel;
    }

    // Store new zoom level on cookie
    Cookies.set('zoomlevel', zoomLevel.toString());

    // Actually zoom the page
    zoomPage();
}

//Zoom relative to current zoom
var zoomSetRelative = function(zoomOffset) {
    zoomSet(zoomLevel + zoomOffset);
}

//REPRINTS THE todo list according to values in the ToDoList object
var reprintToDoList = function() {

  console.log("reprinted to do list");
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

 	//Update due and reminder date/times
    changeDueDateOnScreen(currToDo);
    changeReminderOnScreen(currToDo);

    //Update assignee
    $("#detailsAssigneeSelect").val(currToDo.getAssignee());

 	//Description
 	$("#detailsDescriptionText").val(currToDo.getDescription());

}

//Adds a new toDo Item
var addToDoItem = function() {

  $.getJSON("addtodo?" + "token="+ localStorage.getItem("token"), function(data) {
    var toAdd = getToDoItemfromServerJSON(data);
    shownToDoList.add(toAdd);
    //allToDosInMemory.add(toAdd);
    reprintCurrentSelectedInDetails(shownToDoList.length() - 1);
    currentActiveIndex = shownToDoList.length() - 1;
    reprintToDoList();
  });
}

var deleteToDoItemOnServer = function(idparam) {
  $.getJSON("removetodo?" + "token="+ localStorage.getItem("token") + "&id=" + idparam, function(data) {
    if (data.status === 200) {
      console.log("Succesfully deleted todo id:" + idparam + " on server.");
    } else {
      console.log("Error in changing todo, status code: " + data.status);
    }
  });
}

var changeToDoItemOnServer = function(params, values, id) {
  var paramstring = "";

  if (typeof(params) === "object") {
    console.log(params.length);
    paramstring = "";
    for (i = 0; i < params.length; i++) {
      paramstring = '&' + params[i] + "=" + values[i];
    }
  } else if (typeof(params) === "string"){
    paramstring = "&" + params + "=" + values;
  }

  var queryString = "changetodo?" + "token="+ localStorage.getItem("token") + "&id=" + id + paramstring;

  $.getJSON(queryString, function(data) {
    if (data.status === 200) {
      console.log("Succesfully changed todo " + params + " on server.");
    } else {
      console.log("Error in changing todo");
    }
  });
}



//Changes a todo title in the internal object.
var changeToDoTitle = function(value) {

    changeToDoItemOnServer("title", value, shownToDoList.get(currentActiveIndex).id);
 	shownToDoList.get(currentActiveIndex).setTitle(value);
 	//TODO: other stuff, HTTP PUT request(?), change stuff in database
}

var filterShownToDosOnTitle = function(value) {

 	//IF the searchbox is empty, we need to show all todo's again
 	if (!value) {
 	 	shownToDoList = allToDosInMemory;
 	} else { //else, filter based on string
 	 	shownToDoList = allToDosInMemory.subsetBasedOnTitle(value);
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
    changeDateOnServer("completionDate", currToDo);
    changeToDoItemOnServer("completed", currToDo.completed, currToDo.id);

    $("#toDoCompletionDate" + index).html(currToDo.getCompletionDateString());
    $("#listitem" + index).attr("data-completedStatus", currToDo.getCompletedStatusString());
 	reprintToDoList();
}

var changeDateOnServer = function(key, todo) {
console.log(key + "   " + todo[key] + "!!!");
  if (!todo[key]) { //Date should be reset to null
    changeToDoItemOnServer(key, null, todo.id);
  } else {
    changeToDoItemOnServer(key, (todo[key].utc()).format(), todo.id);
  }
}

// Updates a todo object's due date (only!) on the screen, using an in-memory object.
// Parameter 'obj' should be an instance of the toDo class.
var changeDueDateOnScreen = function(obj) {
    if (obj.getDueDate() !== null) {
        $("#detailsDueDateTime").val(obj.getDueDate().toISOString().slice(0, -1)); // HTML5 input datetime-local element accepts ISO string without trailing 'Z'
    } else {
        $("#detailsDueDateTime").val("");
    }
    $("#detailsDue").attr("data-dueStatus", obj.getDueDateStatusString());
}

// Updates a todo object's reminder (only!) on the screen, using an in-memory object.
// Parameter 'obj' should be an instance of the toDo class.
var changeReminderOnScreen = function(obj) {
    if (obj.getReminder() !== null) {
        $("#detailsReminderDateTime").val(obj.getReminder().toISOString().slice(0, -1)); // HTML5 input datetime-local element accepts ISO string without trailing 'Z'
    } else {
        $("#detailsReminderDateTime").val("");
    }
    $("#detailsReminder").attr("data-reminderStatus", obj.getReminderStatusString());
}

// Updates the assignee dropdown menu in the details view.
var setAssigneeHTML = function() {
    $("#detailsAssigneeSelect").empty(); // Remove current users in dropdown
    for (var k in allUsersInMemory) {
       var thisUserOption = document.createElement('option');
       thisUserOption.setAttribute("value", allUsersInMemory[k].id); // Set user id as value
       thisUserOption.innerHTML = allUsersInMemory[k].name; // Set user's name as text in dropdown
       $("#detailsAssigneeSelect").append(thisUserOption);
    }
}

//Executed when document has finished loading
$(document).ready(function() {
    // Get zoom level from server (cookie) and zoom page to that level
    zoomGet();

    // Get the currently logged in user's data from the server
    $.getJSON("user?" + "token=" + localStorage.getItem("token"), function(data) {
        if (data.status === 200) {
            console.log("Succesfully obtained currently logged in user's data from server.");
            thisUserInMemory = data.content[0];
            $("#username").html(thisUserInMemory.name); // Update page on screen with user's data
        } else {
            console.log("Error obtaining currently logged in user's data. Server replied with HTTP " + data.status + " with message '" + data.message + "'.");
            // TODO forward to login page
        }
    });

    // Get all users from server for assignee dropdown menu
    $.get("/users", function(req, res) {})
 	 	.done(function(res) {
            allUsersInMemory = res;
            setAssigneeHTML();
 	 	});

 	//Get all todos from server
 // 	$.get("/todos", function(req, res) {})
 // 	 	.done(function(res) {
  //
 // 	 	 	//Put the gained to do list in client memory todo list
 // 	 	 	allToDosInMemory.list = getToDoListObjectFromServerJSON(res).list;
 // 	 	 	shownToDoList.list = allToDosInMemory.list;
 // 	 	 	reprintToDoList();
 // 	 	});


 	//CLICKING ON REMOVE BUTTON HANDLER
 	//On is used instead of onclick, so that newly created DOM elements will also have these event handlers
 	$("#toDoItemList").on("click", ".removeTodo", function() {

 	 	//Get the list elemenent index
 	 	var index = returnIndexFromString($(this).attr('id'));

 	 	//remove from original list
 	 	//toDoList.removeById(shownToDoList.get(index).getId());

 	 	//Remove this element from shown list
    //allToDosInMemory.removeById(shownToDoList.get(index).id);
    deleteToDoItemOnServer(shownToDoList.get(index).id);
    allToDosInMemory.removeById(shownToDoList.get(index).id);
 	 	//shownToDoList.remove(index);



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
 	 	var index = returnIndexFromString($(this).attr('id'));
 	 	toggleDone(index);
        reprintToDoList();
 	});

 	$("#addToDo").click(function() {
 	 	console.log("Clicked add to do");
 	 	addToDoItem();
 	});

  $("#logoutButton").click(function() {

    $.getJSON("logout?token=" + localStorage.getItem("token"), function(data) {
      if (data.status === 200) {
        window.localStorage.removeItem("token");
        window.location = '/';
      } else {
        console.log(data.status);
        console.log(data.message);
      }
    });

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
      changeToDoItemOnServer("priority", shownToDoList.get(currentActiveIndex).getPriority(), shownToDoList.get(currentActiveIndex).id);
 	 	 	reprintToDoList();
 	 	 	reprintCurrentSelectedInDetails(currentActiveIndex);
 	 	}
 	});

 	$("#detailsAssigneeSelect").change(function() {
 	 	if (currentActiveIndex !== -1) {
 	 	 	shownToDoList.get(currentActiveIndex).setAssignee($(this).val());
            changeToDoItemOnServer("assignee", shownToDoList.get(currentActiveIndex).getAssignee(), shownToDoList.get(currentActiveIndex).id); // TODO implement on server
            reprintToDoList();
 	 	}
 	});

 	$("#detailsDescriptionText").change(function() {
 	 	if (currentActiveIndex !== -1) {
 	 	 	shownToDoList.get(currentActiveIndex).setDescription($(this).val());
      changeToDoItemOnServer("description", shownToDoList.get(currentActiveIndex).getDescription(), shownToDoList.get(currentActiveIndex).id);
 	 	}
 	});

 	$("#sortPriority").click(function() {
 	 	shownToDoList =  allToDosInMemory.sortAccordingToPrio();
 	 	reprintToDoList();
 	});

 	$("#sortDate").click(function() {
 	 	shownToDoList = allToDosInMemory.sortAccordingToDueDate();
 	 	reprintToDoList();
 	});

    $("#detailsDueDateTime").blur(function() {
        if (currentActiveIndex !== -1) {
            var newValue = $(this).val();
            if (newValue !== "") {
                // Convert to moment format
         	 	newValue = moment(newValue);
                if (!newValue.isValid()) {
                     return;
                }
            } else {
                // Change value back to previous since null values not allowed for due dates
                changeDueDateOnScreen(shownToDoList.get(currentActiveIndex)); // update object on screen
                return;
            }

            // Update object everywhere
            shownToDoList.get(currentActiveIndex).setDueDate(newValue); // update object in memory with new value
            changeDueDateOnScreen(shownToDoList.get(currentActiveIndex)); // update object on screen
            changeDateOnServer("dueDate", shownToDoList.get(currentActiveIndex)); // update object in database
            reprintToDoList();
 	 	}
 	});

 	$("#detailsReminderDateTime").blur(function() {
        if (currentActiveIndex !== -1) {
            var newValue = $(this).val();
            if (newValue !== "") {
                // Convert to moment format
         	 	newValue = moment(newValue);
                if (!newValue.isValid()) {
                     return;
                }

                // Check validity
                var dueValue = shownToDoList.get(currentActiveIndex).getDueDate();
                if (newValue.isAfter(dueValue)) {
                    newValue = dueValue.subtract(1, 'hours'); // reset to default reminder
                }
            } else {
                newValue = null;
            }

            // Update object everywhere
            shownToDoList.get(currentActiveIndex).setReminder(newValue); // update object in memory with new value
            changeReminderOnScreen(shownToDoList.get(currentActiveIndex)); // update object on screen
            changeDateOnServer("reminderDate", shownToDoList.get(currentActiveIndex)); // update object in database
 	 	}
 	});

 	$("#zoomOutButton").click(function() {
 	 	console.log("Clicked zoom out button");
        zoomSetRelative(-10);
 	});

 	$("#zoomInButton").click(function() {
 	 	console.log("Clicked zoom in button");
        zoomSetRelative(10);
 	});

 // 	Retrieve the list of todos from the server each 2 seconds
 	setInterval(function() {

 	 	$.getJSON("todos?token=" + localStorage.getItem("token"), function(data) {
 	 	 	//DO SOMETHING WITH THE RETRIEVED TO DOS HERE
 	 	 	//3 TYPES OF CHANGES:
 	 	 	//  todo was added on server
 	 	 	//  todo was deleted on server
 	 	 	// todo was changed on server


      if (data.status === 401) {
        console.log("received 401 unauthorized.");
        returnToInlog();
        return;
      } else if (data.status === 200) {
        var toDoListFromServer =  getToDoListObjectFromServerJSON(data.list);
        var isTheSame = allToDosInMemory.equals(toDoListFromServer);
        if (isTheSame === true) {
            //console.log("same");
        } else {
          console.log("todo list changed on server");
          shownToDoList.list = toDoListFromServer.list;
          allToDosInMemory.list = toDoListFromServer.list;
          reprintToDoList();
        }
      }


 	 	});
 	}, 2000);

});
