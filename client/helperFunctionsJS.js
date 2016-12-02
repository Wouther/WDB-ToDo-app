
//right now this function is implemented really badly. Should probably be adjusted to the DB limitations of ID.
var counterID = 0;
var generateID = function (){

  return "abcd" + counterID++;
}
