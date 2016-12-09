var moment = require('moment');
exports.index = function(req, res) {
 	res.render('index', {
 	 	moment: moment
 	});
}

module.exports = {
 	loggedInUser: function() {
    this.id = null;
    this.token = null;
    //Set expirationtime in 1 day
    this.expirationTime = moment();
    this.expirationTime.add(1, 'days');
 	}
};
