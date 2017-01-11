var Train = (function() {
	function cls(name, price, group) {
		this.type = "train";
		this.name = name;
		this.price = price;
		this.group = group;
		this.pay = this.price * Math.ceil(Math.random() * 10);
		this.owner = undefined;
	}
	var handle = cls.prototype;
	handle.cost = function(isAll) {
		return this.pay * (isAll ? 2 : 1);
	};
	return cls;
})();
module.exports = Train;