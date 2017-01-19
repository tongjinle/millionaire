(function() {

	var config = this.CONFIG = this.CONFIG || {};

	config.chances = [
		// 移动机会卡
		{
			type: 'move',
			getData: function() {
				// var interval = [1, 3];
				// var dires = [0, 1];
				var interval = [5];
				var dires = [1];
				var stepCount = util.randomInList(interval);
				// 1是前进 0是后退
				var direction = util.randomInList(dires);
				return {
					stepCount: stepCount,
					direction: direction
				};
			}
		},
		// 停留或则再一次行动
		// {
		// 	type: 'round',
		// 	getData: function() {
		// 		var count = 1;
		// 		var isStop = util.randomInList([0,1]);
		// 		return {
		// 			count: count,
		// 			// 0是停留 1是再得一次dice的机会
		// 			isStop: isStop
		// 		};
		// 	}
		// },
		{
			type:'money',
			getData:function(){
				var money = util.randomInList([500,1000,2000]);;
				var isGive = util.randomInList([0,1]);
				return{
					money:money,
					isGive:isGive
				};
			}
		}
	].slice(1,2);

}).call(this);