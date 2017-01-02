var User = require('./user');

var Game = (function() {
	function cls(userList) {
		this._createChessBoard();
		this._createUserList();
		this.userList = userList;
		this.currUser = undefined;
		this.userIndex = 0;
		this.roundIndex = 0;
	}



	var handle = cls.prototype;

	handle._createChessBoard = function() {};


	/*
		userList:{username:string,logo:string}[]
	*/
	handle._createUserList = function(userList) {
		this.userList = userList.map(function(n) {
			return new User(n.username, n.logo);
		});
	}

	handle.start = function() {

		this.round();
	};

	handle.round = function() {
		while(1){
			this.currUser = this.userList[this.userIndex];
			if(currUser.isStop){
				continue;
			}
			this.userIndex++;
			if(this.userIndex == this.userList.length){
				this.roundIndex++;
				this.userIndex = 0;
			}
			break;
		}
	};

	handle.dice = function() {};

	handle.getActionList = function() {
			
	};

	handle.end = function() {};

	return cls;
})();



module.exports = Game;