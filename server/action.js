var CONFIG = require('./config');

var Action = (function() {
	function cls(name,params) {
		this.name = name;
		this.params = params;
		this._createActionByName();
	}

	var handle = cls.prototype;

	handle._createActionByName = function(){

	};

	return cls;
})();

module.exports = Action;
