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
        // this.createChance();  
        this.createMenu();
        this.createUserInfo();
        // this.chess=new Chess();
        // this.setChessPosition();
        // this.addChild(this.chess);
        this.round();
    },
    accept: gameSceneRender,
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

    parseActionList: gameSceneParseActionList,

    ai: gameSceneAi,
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
            var ch = new Chess(us.name);
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
                var s = new TrainBox(data.trainname, data.name, data.group);
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
    // stepCount为行走步数
    // 如果stepCount为负数，则意味着反向走动
    move: function(ch, startIndex, stepCount, next) {
        console.log("stepCount", stepCount);
        var boxLen = this.boxList.length;
        var posiList = [];
        // direction 正方向->1 反方向->0
        var direction = stepCount > 0 ? 1 : 0;
        for (var i = 0; i < Math.abs(stepCount); i++) {
            posiList.push((i + 1) * (direction ? 1 : -1));
        }
        posiList = posiList
            .map(function(i) {
                return ((startIndex + i) + boxLen) % boxLen;
            });
        console.log(this.currUser.name, posiList);
        posiList = posiList
            .map(function(i) {
                return this.posiDict[i];
            }.bind(this));

        console.log(posiList);
        // posiList.each(function(index){
        //         posiList
        //     });
        // for (var i = 0; i < stepCount; i++) {
        //     var index = (startIndex + i + 1) % 40;
        //     posiList.push(this.posiDict[index]);
        // }
        var moveActList = posiList.map(function(posi) {
            return cc.moveTo(CONFIG.USER_SPEED / 1000, cc.p(posi));

        });
        moveActList.push(cc.callFunc(next));
        console.log(posiList);
        ch.runAction(cc.sequence(moveActList));
    }



});