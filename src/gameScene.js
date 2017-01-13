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
        this.createGameMap(mapData, mapColorData);
        this.createDice();
        this.createChessList();
        // this.createChance();  
        this.createMenu();
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
                this.move(ch, diceNum,cb);
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
            next && next();
        };

        // 取消
        dict['cancel'] = function(data, next) {
            if (data.type == 'buy') {
                this.lg.act('cancel', {
                    actionName: 'buy'
                });
                this.menu.toggle(false);
            }
            next && next();
        };

        this.aniMgr.push(function(cb){
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
        if (us.role == UserRole.com) {
            this.AI();
            return;
        }

        // 如果没有任何可以操作的action,就施放行动权限
        if (!actionList.length) {
            this.round();
            return;
        }

        this.dice.canDice = false;
        // 可以dice
        dict[UserAction.dice] = function() {
            this.dice.canDice = true;
        };

        // 可以buy
        dict[UserAction.buy] = function() {
            // todo 
            // show panel

            var menu = this.menu;
            this.aniMgr.push(function(cb){
                menu.toggle(true, 'buy');
                cb();
            });
                


        };


        actionList.forEach(function(act) {
            dict[act].bind(this)();
        }.bind(this));


    },
    AI: function(user) {
        var user = this.lg.currUser;
        console.log('AI:' + user.name + '\'s round ...');
        var interval = [1000, 2500];
        var delay = Math.floor(Math.random() * (interval[1] - interval[0])) + interval[0];
        setTimeout(function() {
            this.dice.act();

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
                var s = new cc.Sprite();
                var s1 = new cc.Sprite.create("start.jpg");

                s1.setScale(0.3);
                s.width = CONFIG.BIGBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                s1.x = s.width / 2;
                s1.y = s.height / 2;

                s.addChild(s1);


                return s;
            },
            'jail': function(data) {
                var s = new cc.Sprite();
                s.width = CONFIG.BIGBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                var s1 = new cc.Sprite.create("jail.jpeg");
                s1.setScaleX(0.2);
                s1.setScaleY(0.3);
                s.width = CONFIG.BIGBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                s1.x = s.width / 2;
                s1.y = s.height / 2;
                s.addChild(s1);

                return s;
            },
            'hotel': function(data) {
                var s = new cc.Sprite();
                s.width = CONFIG.BIGBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                var s1 = new cc.Sprite.create("hotel.png");
                s1.setScale(1.6);
                s1.rotation = 0;
                s1.x = s.width / 2;
                s1.y = s.height / 2;
                s.addChild(s1);
                return s;
            },
            'hospital': function(data) {
                var s = new cc.Sprite();
                s.width = CONFIG.BIGBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;

                var s1 = new cc.Sprite.create("hospital.jpg");
                s1.setScale(0.12);
                s1.rotation = 0;
                s1.x = s.width / 2;
                s1.y = s.height / 2;
                s.addChild(s1);
                return s;
            },
            'tax': function(data) {
                var s = new cc.Sprite();

                var s1 = new cc.Sprite.create("coin.png");
                var s2 = new cc.Sprite.create();
                s1.setScaleX(0.05);
                s1.setScaleY(0.05);
                s2.setScaleX(0.32);
                s2.setScaleY(0.32);
                s.width = CONFIG.SMALLBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                s1.x = s.width / 2;
                s1.y = s.height / 2.8;
                s2.x = s.width / 1.7;
                s2.y = s.height / 2.6;


                var db = new cc.DrawNode();
                var lt = cc.p(0, 120);
                var rb = cc.p(60, 0);
                db.drawRect(lt, rb, cc.color(190, 216, 120));
                s.addChild(db);
                var txt = new cc.LabelTTF('Tax', '', 18);
                txt.color = cc.color(0, 0, 0);
                txt.x = s.width / 2;
                txt.y = s.height / 1.4;
                db.addChild(s1);
                db.addChild(s2);
                s.addChild(txt);



                s1.runAction(
                    cc.spawn(cc.rotateBy(3, 360, 360),
                        cc.sequence(cc.scaleTo(0.05, 0.05),
                            cc.scaleTo(0.07, 0.07))).repeatForever());



                // todo
                return s;
            },
            'ground': function(data) {
                var s = new cc.Sprite();
                s.width = CONFIG.SMALLBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                window.tjl = s;

                var dn = new cc.DrawNode();
                var ltp = cc.p(0, 20);
                var rbp = cc.p(60, 0);

                var groupcolor = mapColorData[data.group] ? mapColorData[data.group].toUpperCase() : mapColorData['default'].toUpperCase();
                dn.drawRect(ltp, rbp, cc.color[groupcolor]);
                dn.y = s.height / 1.2;

                s.addChild(dn);
                var db = new cc.DrawNode();
                var lt = cc.p(0, 100);
                var rb = cc.p(60, 0);
                db.drawRect(lt, rb, cc.color(190, 216, 120));
                s.addChild(db);



                var txt = new cc.LabelTTF('' + data.cityname + '', '', 18);
                txt.color = cc.color(0, 0, 0);
                txt.x = s.width / 2;
                txt.y = s.height / 1.8;
                s.addChild(txt);

                var pricetxt = new cc.LabelTTF('' + data.price + '', '', 18);
                pricetxt.color = cc.color(255, 0, 0);
                pricetxt.x = s.width / 2;
                pricetxt.y = s.height / 3;
                s.addChild(pricetxt);
                return s;

            },
            'chance': function(data) {
                var s = new cc.Sprite();
                s.width = CONFIG.SMALLBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;

                var s1 = new cc.Sprite.create("chance.png");
                s1.setScaleX(1);
                s1.setScaleY(0.5);
                s1.rotation = 0;
                s1.x = s.width / 2;
                s1.y = s.height / 2;

                var db = new cc.DrawNode();
                var lt = cc.p(0, 120);
                var rb = cc.p(60, 0);
                db.drawRect(lt, rb, cc.color(190, 216, 120));
                s.addChild(db);
                db.addChild(s1);
                return s;
            },
            'train': function(data) {
                var s = new cc.Sprite();
                s.width = CONFIG.SMALLBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;

                var s1 = new cc.Sprite.create("train.jpg");
                s1.setScaleX(0.1);
                s1.setScaleY(0.15);
                s1.rotation = 0;
                s1.x = s.width / 2;
                s1.y = s.height / 3;
                s.addChild(s1);

                var dn = new cc.DrawNode();
                var ltp = cc.p(0, 20);
                var rbp = cc.p(60, 0);
                dn.drawRect(ltp, rbp, cc.color(164, 35, 25));
                dn.y = s.height / 1.2;
                s.addChild(dn);

                var txt = new cc.LabelTTF('' + data.trainname + '', '', 18);
                txt.color = cc.color(255, 0, 0);
                txt.x = s.width / 2;
                txt.y = s.height / 1.4;
                s.addChild(txt);
                // todo
                return s;
            },
        };

        var s = dict[boxData.type].bind(this)(boxData);

        this.addChild(s);
        return s;
    },
    createChance: function() {

        var chance = new cc.Sprite();
        var s1 = new cc.Sprite.create("chance.jpg");
        s1.setScale(0.2);
        chance.x = 250;
        chance.y = 400;
        chance.addChild(s1);
        this.addChild(chance);

        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: function(event) {
                var pos = event.getLocation();

                if (self.checkChancePos(pos)) {

                    var chanceBox = new cc.Sprite();
                    chanceBox.x = 160;
                    chanceBox.y = 300;
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

                    self.addChild(chanceBox);

                    self.schedule(function() {
                        chanceBox.setVisible(false);
                    }, 2, 1, 0);

                }
            }
        }, this);


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
    checkPos: function(pos) {
        return ((pos.x >= 480 && pos.x <= 600) &&
            (pos.y >= 350 && pos.y <= 460))
    },
    move: function(ch, stepCount,next) {
        console.log("stepCount", stepCount);
        var posiList = [];
        for (var i = 0; i < stepCount; i++) {
            var index = (ch.user.index + i + 1) % 40;
            posiList.push(this.posiDict[index]);
        }
        var moveActList = posiList.map(function(posi) {
            return cc.moveTo(0.2, cc.p(posi));

        });
        moveActList.push(cc.callFunc(next));
        console.log(posiList);
        ch.runAction(cc.sequence(moveActList));
    }



});