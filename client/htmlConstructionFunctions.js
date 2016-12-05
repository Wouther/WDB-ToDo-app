var returnIndexFromString = function(string) {
 	return string.replace(/^\D+/g, ''); // replace all leading non-digits with nothing
}

var returnOptionForDayOfTheMonth = function(day) {
 	return '<option value="' + day + '">' + day + "</option>";
}
