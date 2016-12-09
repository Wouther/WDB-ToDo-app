module.exports = {
 	findId: function(token, userlist) {
    for (i = 0; i < userlist.length; i++) {
      if (token === userlist[i].token) {
        return userlist[i].id;
      }
    }
 	},
  findIndex: function(token, userlist) {
    for (i = 0; i < userlist.length; i++) {
      if (token === userlist[i].token) {
        return i;
      }
    }
  }
};
