

$(document).ready(function() {

$("#loginButton").click(function() {

  console.log("clicked login button");

  var username = $("#userNameField").val();
  var password = $("#passwordField").val();

  $.getJSON("login?" + "username=" + username + "&password=" + password , function(data) {
    if (data.status === 200) {
      console.log(data.token);
      window.localStorage.setItem("token", data.token);
      window.location = '/main';
    } else {
      //HANDLING FOR WRONG LOGIN INFORMATION
    }
  });
});


$("#loginform").submit(function(event) {
  /* stop form from submitting normally */
  event.preventDefault();
});


});
