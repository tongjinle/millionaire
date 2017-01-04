var Ground = (function() {
	function cls(name, price, group) {
		this.type = 'ground';
		this.name = name;
		this.price = price;
		this.group = group;

		this.level = 0;
		this.pay = this.price;
		this.owner = undefined;
	}



	var handle = cls.prototype;

	handle.getBuildPrice = function() {
		return 500 * (this.level + 1);
	};

	// pay level isAll
	handle.cost = function(isAll) {
		return this.pay * (this.level + 1) * (isAll ? 2 : 1);
	};


	return cls;
})();

module.exports = Ground;