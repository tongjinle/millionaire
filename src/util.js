(function() {
	var util = this.util = this.util || {};

	util.random = function(min, max) {
		return min + Math.floor(Math.random() * (max - min));
	};

	util.randomInList = function(arr) {
		return arr[this.random(0, arr.length - 1)];
	};
}).call(this);