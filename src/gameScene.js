var GameScene = cc.Scene.extend({
    index: 0,
    diceNum: 0,
    chess: null,
    posiDict: null,
    flag: true,
    ctor: function() {
        this._super();
        this.initLogic();
        this.posiDict = {};
        // 动画队列管理器
        this.aniMgr = new AniMgr();
        this.boxList = [];

        this.createGameMap(mapData, mapColorData);
        this.createDice();
        this.createChessList();
         this.createChance();
        this.createMenu();
        this.createUserInfo();
        // this.chess=new Chess();
        // this.setChessPosition();
        // this.addChild(this.chess);
        this.round();
    },
    // 接受来自子级的信息
    accept: function(eventName, data) {
        var dict = {};
        // 投骰子
        dict['diceNum'] = function(data, next) {
            var rst = this.lg.act(UserAction.dice);
            var diceNum = rst.diceNum;
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
                this.move(ch, diceNum, cb);
                us.index = (us.index + diceNum) % mapData.length;
            }.bind(this));


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
            if (rst.payType == 'ground'||rst.payType == 'train') {   
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
            this.lg.act('build');
            var currUser =this.lg.currUser;
            usInfo = _.find(this.userInfoList,function(usInfo) {
                return usInfo.name ==currUser.name;
            });
            usInfo.setMoney(currUser.money);
            // 房子建造
            var lgGround = this.lg.boxList[currUser.index];
            var ground = _.find(this.boxList, function(bo) {
                return bo.name == lgGround.name;
            });
            //调用一个函数
            ground.setHousebuild(lgGround.level),

            this. menu.toggle(false);
            next && next();
        }
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
    },
    // 确定当前玩家
    round: function() {
        var lg = this.lg;
        lg.round();
        var username = lg.currUser.name;

        this.reqActionList();


    },
    // 请求可以执行的操作
    reqActionList: function() {
        var actionList = this.lg.getActionList();
        this.parseActionList(actionList);
        console.log(actionList);
    },

    parseActionList: function(actionList) {
        var dict = {};
        var us = this.currUser = this.lg.findUser(this.lg.currUser.name);

        // 如果没有任何可以操作的action,就施放行动权限
        if (!actionList.length) {
            this.round();
            return;
        }

        this.dice.canDice = false;

        if (us.role == UserRole.com) {
            this.ai(actionList);
            return;
        }

        // 可以dice
        dict[UserAction.dice] = function() {
            this.dice.canDice = true;
        };

        // 可以buy
        dict[UserAction.buy] = function() {
            // todo 
            // show panel

            var menu = this.menu;
            this.aniMgr.push(function(cb) {
                menu.toggle(true, 'buy');
                cb();
            });
        };
        dict[UserAction.build] = function(){
            var menu =this.menu;
            this.aniMgr.push(function(cb) {
                menu.toggle(true, 'build');
                cb();
            });
        };
        // 需要pay
        dict[UserAction.pay] = function(data) {
            this.aniMgr.push(function(cb) {
                this.accept('pay');
                cb();
            }.bind(this));
        };
        //tax
        dict[UserAction.tax] = function(data) {
            this.aniMgr.push(function(cb) {
                this.accept('tax');
                cb();
            }.bind(this));
        };

        actionList.forEach(function(act) {
            dict[act].bind(this)();
        }.bind(this));

    },

    ai: function(actionList) {
        var user = this.lg.currUser;
        console.log('ai:' + user.name + '\'s round ...');
        var interval = [200, 500];
        var delay = Math.floor(Math.random() * (interval[1] - interval[0])) + interval[0];
        setTimeout(function() {
            // 让logic去判断ai可以执行的actionList,从而来选择一个act
            var aiAct = this.lg.ai(actionList);
            if (!aiAct) {
                this.accept('cancel');
                return;
            }
            // 根据logic的ai的act选择,来渲染gameScene
            if (aiAct.actName == 'dice') {
                this.accept('diceNum');
            } else if (aiAct.actName == 'buy') {
                this.accept('buy');
            } else if (aiAct.actName == 'pay') {
                this.accept('pay');
            } else if (aiAct.actName == 'build') {
                this.accept('build');
            }
        }.bind(this), delay);
    },
    setChessPosition: function(ch, index) {
        ch.index = index;
        ch.setPosition(this.posiDict[index]);
    },
    initLogic: function() {
        var lg = this.lg = getLogic();
        lg.createUserList('sunxiaomei', 3);
    },
    createGameMap: function(mapData, mapColorData) {
        var data = mapData;
        // 起点为右下角
        // 四个角为大格子，其余都为小格子
        var posi = {
            x: cc.winSize.width - CONFIG.BIGBOX_SIZE / 2,
            y: CONFIG.BIGBOX_SIZE / 2
        };
        data.forEach(function(d, i) {
            // 创建box的工厂
            var s = this.createBox(d);
            // 第几行,顺时针,bottom为第0行
            var row = Math.floor(i / 10);
            var step;
            // 处理转角
            if (i % 10 == 0 || i % 10 == 9) {
                // bigbox
                step = CONFIG.BIGBOX_SIZE / 2 + CONFIG.SMALLBOX_SIZE / 2;
            } else {
                step = CONFIG.SMALLBOX_SIZE;
            }
            s.setPosition(posi);

            // 缓存格子下标跟具体position的映射关系
            this.posiDict[i] = {
                x: posi.x,
                y: posi.y
            };

            // 处理下一个格子的位置
            if (row == 0) {
                console.log(posi, '**');
                posi.x -= step;
            }
            if (row == 1) {
                s.rotation = 90;
                posi.y += step;
            }
            if (row == 2) {
                s.rotation = 180;
                posi.x += step;
            }
            if (row == 3) {
                s.rotation = 270;
                posi.y -= step;
            }
        }.bind(this));


    },
    createChessList: function() {
        this.chessList = [];

        var lg = this.lg;
        lg.userList.forEach(function(us) {
            var ch = new Chess(us);
            this.addChild(ch);
            this.setChessPosition(ch, us.index);

            this.chessList.push(ch);
        }.bind(this));
    },
    createBox: function(boxData) {

        var dict = {
            'startPoint': function(data) {
                var s = new StartPointBox();
                return s;
            },
            'jail': function(data) {
                var s = new JailBox();

                return s;
            },
            'hotel': function(data) {
                var s = new HotelBox();
                return s;
            },
            'hospital': function(data) {
                var s = new HospitalBox();
                return s;
            },
            'tax': function(data) {
                var s = new TaxBox();
                // todo
                return s;
            },
            'ground': function(data) {
                var groupcolor = mapColorData[data.group];
                var s = new GroundBox(data.name, data.cityname, data.price, data.group, groupcolor);
                return s;

            },
            'chance': function(data) {
                var s = new ChanceBox();
                return s;
            },
            'train': function(data) {
                var s = new TrainBox(data.trainname,data.name,data.group);
                return s;
            },
        };

        var s = dict[boxData.type].bind(this)(boxData);
        this.boxList.push(s);
        this.addChild(s);
        return s;
    },
    createChance: function() {

        var chance = new cc.Sprite();
        var s1 = new cc.Sprite.create("chance.jpg");
        s1.setScale(0.2);
        chance.x = 285;
        chance.y = 400;
        chance.addChild(s1);
        this.addChild(chance);
        var chanceBox = new cc.Sprite();
        chanceBox.x = 200;
        chanceBox.y = 260;
        var dn = new cc.DrawNode();
        var ltp = cc.p(0, 200);
        var rbp = cc.p(200, 0);
        dn.drawRect(ltp, rbp, cc.color(164, 35, 25, 150));
        chanceBox.addChild(dn);
        var txt = new cc.LabelTTF('前进三步', '', 30);
        txt.color = cc.color(255, 255, 255);
        txt.x = 100;
        txt.y = 100;
        dn.addChild(txt);

        this.addChild(chanceBox);

        //var self = this;
        //cc.eventManager.addListener({
        //    event: cc.EventListener.MOUSE,
        //    onMouseDown: function(event) {
        //        var pos = event.getLocation();
        //
        //        if (self.checkChancePos(pos)) {
        //
        //            var chanceBox = new cc.Sprite();
        //            chanceBox.x = 160;
        //            chanceBox.y = 300;
        //            var dn = new cc.DrawNode();
        //            var ltp = cc.p(0, 200);
        //            var rbp = cc.p(200, 0);
        //            dn.drawRect(ltp, rbp, cc.color(164, 35, 25, 150));
        //            chanceBox.addChild(dn);
        //            var txt = new cc.LabelTTF('前进三步', '', 30);
        //            txt.color = cc.color(255, 255, 255);
        //            txt.x = 100;
        //            txt.y = 100;
        //            dn.addChild(txt);
        //
        //            self.addChild(chanceBox);
        //
        //            self.schedule(function() {
        //                chanceBox.setVisible(false);
        //            }, 2, 1, 0);
        //
        //        }
        //    }
        //}, this);


        return chance;
    },
    createDice: function() {
        var dice = this.dice = new Dice();
        dice.x = 550;
        dice.y = 400;
        this.addChild(dice);
        this.canDice = false;
    },
    createMenu: function() {
        var menu = this.menu = new Menu();
        this.menu.setPosition(cc.winSize.width / 2, cc.winSize.height / 2);
        this.addChild(menu);

    },
    createUserInfo: function() {
        this.userInfoList = [];
        console.log(this.lg.userList);
        var colors = [
            cc.color(242, 32, 180, 150),
            cc.color(0, 255, 48, 150),
            cc.color(0, 150, 150, 150),
            cc.color(100, 31, 0, 150)
        ];
        _.each(this.lg.userList, function(us, i) {
            var usInfo = new UserInfo(us.name, us.money, colors[i]);
            usInfo.x = (cc.winSize.width / 2 - usInfo.width / 2) + (i % 2) * usInfo.width;
            usInfo.y = 578 - Math.floor(i / 2) * usInfo.height;
            this.addChild(usInfo);

            this.userInfoList.push(usInfo);
        }.bind(this));


    },
    createowner: function() {
        var owner = this.owner = new Owner();
        owner.x = 100;
        owner.y = 100;
        this.addChild(owner);
    },
    checkPos: function(pos) {
        return ((pos.x >= 480 && pos.x <= 600) &&
            (pos.y >= 350 && pos.y <= 460))
    },
    move: function(ch, stepCount, next) {
        console.log("stepCount", stepCount);
        var posiList = [];
        for (var i = 0; i < stepCount; i++) {
            var index = (ch.user.index + i + 1) % 40;
            posiList.push(this.posiDict[index]);
        }
        var moveActList = posiList.map(function(posi) {
            return cc.moveTo(CONFIG.USER_SPEED/1000, cc.p(posi));

        });
        moveActList.push(cc.callFunc(next));
        console.log(posiList);
        ch.runAction(cc.sequence(moveActList));
    }



});