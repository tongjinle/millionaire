var CONFIG = require('./config');

var User = (function() {
	function cls(username,logo) {
		this.username = username;
		this.money = CONFIG.USER_MONEY;
		this.index = 0;
		this.logo = logo;
		this.isStop = false;
	}



	var handle = cls.prototype;

	

	return cls;
})();

module.exports = User;