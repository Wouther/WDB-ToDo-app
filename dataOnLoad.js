/*
 Just some fake template data to play with, later this should of course be replaced by real stuff from the database
*/

var toDoItem1 = new ToDoItem();
var toDoItem2 = new ToDoItem();
var toDoItem3 = new ToDoItem();

toDoItem1.setTitle("Title of first to do item");
toDoItem1.setPriority(false);
toDoItem1.setDueDateYear(2016);
toDoItem1.setDueDateMonth(12);
toDoItem1.setDueDateDateOfMonth(2);
toDoItem1.setDescription("THIS IS a description for item 1\ asdasdasdasdasasd11111\n 111111111111111111");

toDoItem2.setTitle("Title of second to do item");
toDoItem2.setPriority(true);
toDoItem2.setDueDateYear(2017);
toDoItem2.setDueDateMonth(1);
toDoItem2.setDueDateDateOfMonth(3);
toDoItem2.setDescription("THIS IS a description for item 2\ asdasdasdasdasasd11111\n 2222222222222");

toDoItem3.setTitle("Title of third to do item");
toDoItem3.setPriority(false);
toDoItem3.setDueDateYear(2018);
toDoItem3.setDueDateMonth(2);
toDoItem3.setDueDateDateOfMonth(20);
toDoItem3.setDescription("THIS IS a description for item 3\ asdasdasdasdasasd333333\n 33333333");


var toDoList = new ToDoList();
toDoList.add(toDoItem1);
toDoList.add(toDoItem2);
toDoList.add(toDoItem3);