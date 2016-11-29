/*
 Just some fake template data to play with, later this should of course be replaced by real stuff from the database
*/

var toDoItem1 = new ToDoItem();
var toDoItem2 = new ToDoItem();
var toDoItem3 = new ToDoItem();

toDoItem1.setTitle("Title of first to do item");
toDoItem1.setPriority(false);
toDoItem1.setDueDate("29/11/16 12:00");
toDoItem1.setDescription("THIS IS a description for item 1\ asdasdasdasdasasd11111\n 111111111111111111");

toDoItem2.setTitle("Title of second to do item");
toDoItem2.setPriority(true);
toDoItem2.setDueDate("1/1/2017 14:00");
toDoItem2.setDescription("THIS IS a description for item 2\ asdasdasdasdasasd11111\n 2222222222222");

toDoItem3.setTitle("Title of third to do item");
toDoItem3.setPriority(false);
toDoItem3.setDueDate("2/1/2017 12:00");
toDoItem3.setDescription("THIS IS a description for item 3\ asdasdasdasdasasd333333\n 33333333");


var toDoList = new ToDoList();
toDoList.add(toDoItem1);
toDoList.add(toDoItem2);
toDoList.add(toDoItem3);
