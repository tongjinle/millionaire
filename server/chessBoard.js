var Ground = require('./ground');

var ChessBoard = (function() {
	function cls() {
		this.boxList = [];

		this._createBoard();
	}



	var handle = cls.prototype;

	handle._createBoard = function() {
		var map = require('./mapData')['default'];
		map.forEach(function(data, i) {
			var box = this._createBox(data);
			this.boxList.push(box);
		}.bind(this));
	};

	handle._createBox = function(data) {
		var dict = {
			'ground': function(data) {
				var name = data.name;
				var price = data.price;
				var group = data.group;
				var box = new Ground(name, price, group);
				return box;
			}
		};
		var box = dict[data.type](data);
		return box;
	};


	return cls;
})();



module.exports = ChessBoard;