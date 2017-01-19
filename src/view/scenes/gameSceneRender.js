(function() {
	// 接受来自子级的信息
	var accept = function(eventName, data) {
		var dict = {};
		// 投骰子
		dict['diceNum'] = function(data, next) {
			var rst = this.lg.act(UserAction.dice);
			var diceNum = rst.diceNum;
			var startIndex = rst.preIndex;
			var arr = [];

			// 骰子滚动的动画
			arr.push(function(cb) {
				this.dice.ani(diceNum, function() {
					setTimeout(cb, 400);
				});
			}.bind(this));

			// 棋子移动的动画
			arr.push(function(cb) {
				let us = this.currUser;
				var ch = this.chessList.find(function(ch) {
					return ch.name == us.name;
				});
				this.move(ch, startIndex, diceNum, cb);
			}.bind(this));

			if(rst.startPointReward){
				arr.push(function(cb){
					var currUser = this.lg.currUser;
					var usInfo = _.find(this.userInfoList, function(usInfo) {
						return usInfo.name == currUser.name;
					});
					usInfo.setMoney(currUser.money);
					cb();
				}.bind(this));
			}
			
			async.series(arr, function(err, data) {
				console.log('ani list complete');
				next && next();
			}.bind(this));

			// release action right
			// this.round();
		};

		// 购买ground
		dict['buy'] = function(data, next) {
			this.lg.act('buy');

			// 玩家扣钱 
			var currUser = this.lg.currUser;
			console.log(currUser);
			var usInfo = _.find(this.userInfoList, function(usInfo) {
				return usInfo.name == currUser.name;
			});
			usInfo.setMoney(currUser.money);

			// 地皮打上标记
			var lgGround = this.lg.boxList[currUser.index];
			var ground = _.find(this.boxList, function(bo) {
				return bo.name == lgGround.name;
			});
			ground.setOwnerLogo(currUser.name);

			this.menu.toggle(false);
			next && next();
		};
		dict['pay'] = function(data, next) {
			var rst = this.lg.act(UserAction.pay);
			var currUser = this.lg.currUser;
			var money = rst.money;
			var usInfo = _.find(this.userInfoList, function(usInfo) {
				return usInfo.name == currUser.name;
			});
			if (rst.payType == 'ground' || rst.payType == 'train') {
				var ownername = rst.ownername;
				var ownerUsInfo = _.find(this.userInfoList, function(usInfo) {
					return usInfo.name == ownername;
				});
				usInfo.setMoney(usInfo.money - money);
				ownerUsInfo.setMoney(ownerUsInfo.money + money);
			} else if (rst.payType == 'tax') {
				usInfo.setMoney(money);
			}

			next && next();
		};


		dict['build'] = function(data, next) {
			// 更改usInfo信息价格
			var rst = this.lg.act('build');
			var currUser = this.lg.currUser;
			usInfo = _.find(this.userInfoList, function(usInfo) {
				return usInfo.name == currUser.name;
			});
			usInfo.setMoney(currUser.money);
			// 房子建造
			var lgGround = this.lg.boxList[currUser.index];
			var ground = _.find(this.boxList, function(bo) {
				return bo.name == lgGround.name;
			});
			//调用一个函数
			ground.setHousebuild(lgGround.level),
            ground.updatePrice(rst.pay),
				this.menu.toggle(false);
			next && next();
		};



		dict['chance'] = function(data, next) {
			var rst = this.lg.act('chance');
			var dict = {};
			dict['move'] = function(data) {
				var startIndex = data.preIndex;
				var stepCount = data.stepCount * (data.direction == 1 ? 1 : -1);

				var arr = [];

				// 棋子移动的动画
				arr.push(function(cb) {
					let us = this.currUser;
					var ch = this.chessList.find(function(ch) {
						return ch.name == us.name;
					});
					this.move(ch, startIndex, stepCount, cb);
				}.bind(this));

				if(data.startPointReward){
					var currUser = this.lg.currUser;
					var usInfo = _.find(this.userInfoList, function(usInfo) {
					return usInfo.name == currUser.name;
					});
					usInfo.setMoney(currUser.money);
				}


				async.series(arr, function(err, data) {
					next && next();
				}.bind(this));
			};

			dict[rst.type].bind(this)(rst);
		};



		// 取消
		dict['cancel'] = function(data, next) {
			var cancelData;
			if (!data) {
				cancelData = null;
			} else if (data.type == 'buy') {
				this.menu.toggle(false);
				cancelData = {
					actionName: 'buy'
				}
			} else if (data.type == 'build') {
				this.menu.toggle(false);
				cancelData = {
					actionName: 'build'
				}
			}
			this.lg.act('cancel', cancelData);
			next && next();
		};

		this.aniMgr.push(function(cb) {
			dict[eventName].bind(this)(data, function() {
				// 再次请求可以执行的actionList
				this.reqActionList();
				cb();
			}.bind(this));

		}.bind(this));
	};

	this.gameSceneRender = accept;
}).call(this);