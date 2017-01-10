var GameScene = cc.Scene.extend({
    index: 0,
    diceNum: 0,
    chess: null,
    posiDict: null,

    ctor: function() {
        this._super();
        this.initLogic();
        this.posiDict = {};
        this.createGameMap(mapData, mapColorData);
        this.createDice();
        this.createChessList();
        // this.createChance();  
        // this.createground();
        // this.chess=new Chess();
        // this.setChessPosition();
        // this.addChild(this.chess);
        this.round();
    },
    // 接受来自子级的信息
    accept: function(eventName, data) {
        var dict = {};

        dict['diceNum'] = function(data) {
            let us = this.currUser;
            var ch = this.chessList.find(function(ch) {
                return ch.name == us.name;
            });
            this.move(ch, data);
            us.index = (us.index + data) % mapData.length;

            // release action right
            this.round();
        };

        dict[eventName].bind(this)(data);
    },
    // 确定当前玩家
    round: function() {
        var username = this.lg.round();
        var us = this.currUser = this.lg.findUser(username);
        if (us.role == UserRole.human) {
            this.dice.canDice = true;
        } else {
            this.dice.canDice = false;
            this.AI(us);
        }
    },
    AI: function(user) {
        console.log('AI:'+user.name+'\'s round ...');
        var interval = [1000,2500];
        var delay = Math.floor(Math.random()*(interval[1]-interval[0]))+interval[0];
        setTimeout(function(){
            this.dice.act();
            
        }.bind(this),delay);
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
            'Hospital': function(data) {
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
    createground: function() {

        var ground = new cc.Sprite();
        this.addChild(ground);

        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: function(event) {
                var pos = event.getLocation();

                if (self.checkChancePos(pos)) {

                    var groundBox = new cc.Sprite();
                    groundBox.x = 250;
                    groundBox.y = 300;
                    var dn = new cc.DrawNode();
                    var ltp = cc.p(0, 200);
                    var rbp = cc.p(300, 0);
                    dn.drawRect(ltp, rbp, cc.color(0, 0, 0, 150));
                    groundBox.addChild(dn);
                    var txt = new cc.LabelTTF('请选择以下操作：', '', 18);
                    txt.color = cc.color(255, 255, 255);
                    txt.x = 150;
                    txt.y = 150;
                    dn.addChild(txt);

                    var dnl = new cc.DrawNode();
                    var ltpl = cc.p(0, 30);
                    var rbpl = cc.p(50, 0);
                    dnl.x = 50;
                    dnl.y = 50;
                    dnl.drawRect(ltpl, rbpl, cc.color(5, 85, 152, 200));
                    dn.addChild(dnl);
                    var txtl = new cc.LabelTTF('购买', '', 15);
                    txtl.color = cc.color(255, 255, 255);
                    txtl.x = 25;
                    txtl.y = 15;
                    dnl.addChild(txtl);

                    var dnc = new cc.DrawNode();
                    var ltpc = cc.p(0, 30);
                    var rbpc = cc.p(50, 0);
                    dnc.x = 125;
                    dnc.y = 50;
                    dnc.drawRect(ltpc, rbpc, cc.color(200, 20, 20, 200));
                    dn.addChild(dnc);
                    var txtc = new cc.LabelTTF('升级', '', 15);
                    txtc.color = cc.color(255, 255, 255);
                    txtc.x = 25;
                    txtc.y = 15;
                    dnc.addChild(txtc);

                    var dnr = new cc.DrawNode();
                    var ltpr = cc.p(0, 30);
                    var rbpr = cc.p(50, 0);
                    dnr.x = 200;
                    dnr.y = 50;
                    dnr.drawRect(ltpr, rbpr, cc.color(40, 220, 103, 200));
                    dn.addChild(dnr);
                    var txtr = new cc.LabelTTF('放弃', '', 15);
                    txtr.color = cc.color(255, 255, 255);
                    txtr.x = 25;
                    txtr.y = 15;
                    dnr.addChild(txtr);

                    self.addChild(groundBox);


                }
            }
        }, this);


        return ground;
    },
    checkPos: function(pos) {
        return ((pos.x >= 480 && pos.x <= 600) &&
            (pos.y >= 350 && pos.y <= 460))
    },
    checkChancePos: function(pos) {
        return (
            (pos.x >= CONFIG.BIGBOX_SIZE + CONFIG.SMALLBOX_SIZE * 2 && pos.x <= CONFIG.BIGBOX_SIZE + CONFIG.SMALLBOX_SIZE * 3) && (pos.y >= 0 && pos.y <= CONFIG.BIGBOX_SIZE) ||
            (pos.x >= 20 && pos.x <= CONFIG.BIGBOX_SIZE) && (pos.y >= CONFIG.BIGBOX_SIZE + CONFIG.SMALLBOX_SIZE * 6 && pos.y <= CONFIG.BIGBOX_SIZE + CONFIG.SMALLBOX_SIZE * 7) ||
            (pos.x >= CONFIG.BIGBOX_SIZE + CONFIG.SMALLBOX_SIZE * 6 && pos.x <= CONFIG.BIGBOX_SIZE + CONFIG.SMALLBOX_SIZE * 7) && (pos.y >= CONFIG.BIGBOX_SIZE + CONFIG.SMALLBOX_SIZE * 9 && pos.y <= CONFIG.BIGBOX_SIZE * 2 + CONFIG.SMALLBOX_SIZE * 9) ||
            (pos.x >= CONFIG.BIGBOX_SIZE + CONFIG.SMALLBOX_SIZE * 9) && (pos.y >= CONFIG.BIGBOX_SIZE + CONFIG.SMALLBOX_SIZE * 2 && pos.y <= CONFIG.BIGBOX_SIZE + CONFIG.SMALLBOX_SIZE * 3)
        )
    },
    move: function(ch, stepCount) {
        var posiList = [];
        for (var i = 0; i < stepCount; i++) {
            var index = (ch.user.index + i + 1) % 40;
            posiList.push(this.posiDict[index]);
        }
        var moveActList = posiList.map(function(posi) {
            return cc.moveTo(0.2, cc.p(posi));

        });
        console.log(posiList);
        ch.runAction(cc.sequence(moveActList));
    }

});