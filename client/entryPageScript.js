

$(document).ready(function() {

  //Try logging in with token if it is in browser
  var token =  localStorage.getItem("token");

  if (token !== undefined) {
    $.getJSON("login?" + "token=" + token, function(data) {
      if (data.status === 200) {
        window.location = '/main';
      } else {
        localStorage.removeItem("token");
      }
    });
  }

$("#loginButton").click(function() {

  console.log("clicked login button");

  var username = $("#userNameField").val();
  var password = $("#passwordField").val();

  $.getJSON("login?" + "username=" + username + "&password=" + password , function(data) {
    if (data.status === 200) {
      console.log(data.token);
      window.localStorage.setItem("token", data.token);
      window.location = '/main?token=' + data.token;
    } else if (data.status === 401){
      console.log("Username not known by server.");
    } else if (data.status === 403) {
      console.log("Wrong password");
    }
  });
});


$("#loginform").submit(function(event) {
  /* stop form from submitting normally */
  event.preventDefault();
});


});
