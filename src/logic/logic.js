(function() {
    var cls = function() {
        this.boxList = [];
        this.userList = [];
        this.userIndex = -1;
        this.roundIndex = 0;

        this.currUser = null;

        this.createBoxList(mapData);
    };

    var handler = cls.prototype;

    // 加入玩家
    handler.createUserList = function(humanName, num) {
        var compList = [];
        for (var i = 0; i < num; i++) {
            var us;
            if (i == 0) {
                us = new User(humanName, UserRole.human);
            } else {
                var computerNameList = CONFIG.COMPUTERNAME_LIST;
                var compName;
                while (1) {
                    compName = computerNameList[Math.floor(Math.random() * computerNameList.length)];
                    if (compList.indexOf(compName) == -1) {
                        compList.push(compName);
                        break;
                    }
                }
                us = new User(compName, UserRole.com);
            }
            this.userList.push(us);
        }
    };

    // 生成格子
    handler.createBoxList = function(mapData) {
        var map = mapData;
        map.forEach(function(data, i) {
            var box = this._createBox(data);
            this.boxList.push(box);
        }.bind(this));
    };

    handler._createBox = function(data) {
        var dict = {
            'ground': function(data) {
                var name = data.name;
                var price = data.price;
                var group = data.group;
                var box = new Ground(name, price, group);
                return box;
            },
            'tax': function(data) {
                var box = new Tax();
                return box;
            },
            'startPoint': function(data) {
                var box = new StartPoint();
                return box;
            },
            'jail': function(data) {
                var box = new Jail();
                return box;
            },
            'train': function(data) {
                var name = data.name;
                var price = data.price;
                var group = data.group;
                var box = new Train(name, price, group);
                return box;
            },
            'hotel': function(data) {
                var box = new Hotel();
                return box;
            },
            'hospital': function(data) {
                var box = new Hospital();
                return box;
            },
            'chance': function() {
                var box = new Chance();
                return box;
            }
        };
        var box = dict[data.type](data);
        return box;
    }.bind(this);

    handler.findUser = function(username) {
        return this.userList.find(function(us) {
            return us.name == username;
        });
    };

    // 返回当前可以走的玩家
    handler.round = function() {
        while(1){
            this.userIndex = (this.userIndex + 1) % this.userList.length;
            this.currUser = this.userList[this.userIndex];
            
            if(!this.currUser.isDead){
                break;
            }
        }
        this.currUser.status = UserStatus.beforeDice;
        this.cancelActionList = [];
        this.currActionList = this.getActionList();
    };

    // 获取ai的动作
    // {actName:string,data:any}
    handler.ai = function(actionList) {
        var us = this.currUser;
        if (actionList.indexOf(UserAction.dice) >= 0) {
            return {
                actName: 'dice'
            };
        } else if (actionList.indexOf(UserAction.buy) >= 0) {
            var isBuy = false;
            if (us.money >= CONFIG.AI.BUY_TERMINAL) {
                isBuy = true;
            } else {
                if (Math.random() < CONFIG.AI.BUY_RACE_RATE) {
                    isBuy = true;
                }
            }
            return isBuy ? {
                actName: 'buy'
            } : null;
        } else if (actionList.indexOf(UserAction.pay) >= 0) {
            return {
                actName: 'pay'
            };
        } else if (actionList.indexOf(UserAction.build) >= 0) {
            var isBuild = false;
            if(us.money >= CONFIG.AI.BUIlD_TERMINAL) {
                isBuild = true;
            } else {
                if(Math.random() <CONFIG.AI.BUILD_RACE_RATE) {
                    isBuild = true;
                }
            }
            return isBuild ? {
                actName: 'build'
            } :null;
        } else if (actionList.indexOf(UserAction.chance) >=0) {
            return {
                actName:'chance'
            };
        }
    };
    // 获取随机点数

    var diceNumList = [4, 40, 5, 40];
    var diceNumList = [7, 10, 10, 1];
    var diceNumList = [3,40,4, 10, 10, 1];
    // 测试tax让人破产 == start ==
    var diceNumList = [1,40,1, 10, 10, 1];
    
    // 测试tax让人破产 == end ==

    var diceIndex = 0;
    handler.getDiceNum = function() {
        var len = this.userList.length;
        if (this.currUser == this.userList[0]) {
            var diceNum = diceNumList[diceIndex];
            diceIndex = (diceIndex + 1) % diceNumList.length;
            return diceNum;
        }
        return 3;
        return Math.ceil(Math.random() * 6);
    };

    // 获取当前玩家可行动作
    handler.getActionList = function() {
        var list = [];
        var us = this.currUser;

        if (us.status == UserStatus.beforeDice) {
            list.push(UserAction.dice);
        } else if (us.status == UserStatus.afterDice) {
            // buy
            // 是不是ground
            // 是否ground有owner
            // user的money够不够
            var box = this.boxList[us.index];
            if (BoxType.ground == box.type && !box.owner && us.money >= box.price) {
                list.push(UserAction.buy);
            } else if (BoxType.train == box.type && !box.owner && us.money >= box.price) {
                list.push(UserAction.buy);
            } else if (BoxType.ground == box.type && box.owner && box.owner != us) {
                list.push(UserAction.pay);
            } else if (BoxType.tax == box.type) {
                list.push(UserAction.pay);
            } else if (BoxType.train == box.type) {
                list.push(UserAction.pay);
            } else if (BoxType.ground == box.type && box.owner == us && us.money >= box.buildPrice()) {
                list.push(UserAction.build);
            } else if (BoxType.chance == box.type) {
                list.push(UserAction.chance);
            }
        }
        if (this.cancelActionList.indexOf(UserAction.all) >= 0) {
            list = [];
        } else {
            list = _.filter(list, function(act) {
                return this.cancelActionList.indexOf(act) == -1;
            }.bind(this));
        }

        return list;
    };
    // 执行一个方法
    handler.act = function(actName, data) {
        var us = this.currUser;
        var rst;
        if (actName == UserAction.dice) {
            var preIndex = us.index;
            var diceNum = this.getDiceNum();

            rst = {
                preIndex: preIndex,
                diceNum: diceNum
            };

            us.index = (us.index + diceNum) % mapData.length;

            if(this._checkStartPoint(preIndex,us.index)){
                rst.startPointReward = CONFIG.STARTPOINT_REWARD;
                us.money+=CONFIG.STARTPOINT_REWARD;
            }

            us.status = UserStatus.afterDice;
        } else if (actName == UserAction.buy) {
            var box = this.boxList[us.index];
            if (box.type == 'train') {}
            us.money -= box.price;
            box.owner = us;

            us.status = UserStatus.endRound;

        } else if (actName == UserAction.pay) {
            var ground = this.boxList[us.index];
            var money = 0 ;
            if (ground.type == 'ground') {
                var owner = ground.owner;
                var group = _.filter(this.boxList, function(bo) {
                    return bo.group == ground.group;
                });
                var isAll = _.all(group, function(bo) {
                    return bo.owner == owner;
                });
                var money = ground.pay(isAll);
                owner.money += money;
               
                rst = {
                    payType: 'ground',
                    ownername: owner.name,
                    money: money
                };
            } else if (ground.type == 'tax') {
                var money = us.money * CONFIG.TAX_RATE;
                rst = {
                    payType: 'tax',
                    money: money
                };

            } else if (ground.type == 'train') {
                var owner = ground.owner;
                var group = _.filter(this.boxList, function(bo) {
                    return bo.group == ground.group;
                });
                var groupCount = _.filter(group, function(bo) {
                    return bo.owner == owner;
                }).length;
                var money = ground.pay(groupCount);
                owner.money += money;

                rst = {
                    payType: 'train',
                    ownername: owner.name,
                    money: money
                };
            }
            // 
            var calMoneyInfo = this._calUserMoney(us, -money);
            rst .isDead = calMoneyInfo.isDead;
            rst.clearBoxIndexList = calMoneyInfo.boxIndexList;


            us.status = UserStatus.endRound;
        } else if (actName == UserAction.build) {
            var box = this.boxList[us.index];
            us.money -= box.buildPrice();
            if (box.canBuild()) {
                box.level++;
            }
            var pay=box.pay();
            rst={
                pay:pay
            }
            us.status = UserStatus.endRound;
        } else if (actName == UserAction.chance) {
            var chanceOpt = CONFIG.chances[ Math.ceil(Math.random() * CONFIG.chances.length - 1)];
            var preIndex = us.index;
            chanceObj = {
                type: chanceOpt.type,
                data: chanceOpt.getData()
            };
            var parseInfo = this._parseChance(chanceObj);

            rst = {
                type:chanceObj.type,
            };

            if(rst.type == 'move'){
                rst.preIndex = preIndex;
                rst.stepCount = chanceObj.data.stepCount;
                rst.direction = chanceObj.data.direction;
                rst.startPointReward = parseInfo.startPointReward;
            }

            // 破产检测
            if(rst.type == 'money'){
                rst.isDead = parseInfo.isDead;
                rst.clearBoxIndexList = parseInfo.clearBoxIndexList;
            }

        } else if (actName == UserAction.cancel) {
            if (!data) {
                this.cancelActionList = [UserAction.all];
            } else {
                this.cancelActionList = [data.actionName];
            }
            // us.status = UserStatus.endRound;
        }
        return rst;
    };

    handler._checkStartPoint= function(preIndex,currIndex){
        return preIndex>currIndex;
    };

    // 玩家收支(money是变化值)
    // 返回值对象的isDead为true,则表示已经破产
    // 对象的描述是对破产玩家的清算
    // 对象格式
    /*
        {
            isDead:boolean;
            boxIndexList:number[];
        }
    */
    handler._calUserMoney = function(user,money){
        user.money += money;


        user.money = Math.max(user.money,0);
        if(user.money<=0){
            var boxIndexList =[];
            // 统计破产玩家的所有资产
            this.boxList.forEach(function(bo,i){
                if(bo.owner && bo.owner == user){
                    boxIndexList.push(i);
                }
            });
            // 清空资产
            boxIndexList.forEach(function(boIndex){
                this.boxList[boIndex].owner = undefined;
            }.bind(this));

            // 玩家出局
            user.isDead = true;

            return {isDead:true,boxIndexList:boxIndexList}; 
        }
        return {isDead:false};
    };


    // 清空


    handler._parseChance = function(chance) {
        var dict = {};
        var us = this.currUser;
        dict['move'] = function(data) {
            var rst = {};
            var preIndex = us.index;
            us.index = (us.index+ (data.direction ? 1 : -1) * data.stepCount + this.boxList.length)%this.boxList.length;
            var currIndex = us.index;
            if(this._checkStartPoint(preIndex,currIndex)){
                us.money+=CONFIG.STARTPOINT_REWARD;
                rst. startPointReward=CONFIG.STARTPOINT_REWARD; 
            }
            return rst;
        };
        dict['money'] = function(data){
            var rst = {};
            var deltaMoney = (data.isGive ? 1: -1)*data.money;
            var calMoneyInfo = this._calUserMoney(us,deltaMoney);


            if(calMoneyInfo){
                rst.isDead = calMoneyInfo.isDead;
                rst.clearBoxIndexList = calMoneyInfo.boxIndexList;
            }
            return rst;
        }

        return dict[chance.type].bind(this)(chance.data);
    };

    // handler._m



    // 单例
    var ins = null;
    var getLogic = function() {
        if (!ins) {
            ins = new cls();
        }
        return ins;
    };



    this.getLogic = getLogic;



}).call(this);