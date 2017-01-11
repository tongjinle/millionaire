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
    handler.createBoxList = function(mapData){
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
            'tax':function(data){
                var box = new Tax();
                return box;
            },
            'startPoint':function(data){
                var box = new StartPoint();
                return box;
            },
            'jail':function(data){
                var box = new Jail();
                return box;
            },
            'train':function(data){
                var box = new Train();
                return box;
            },
            'hotel':function(data){
                var box = new Hotel();
                return box;
            },
            'hospital':function(data){
                var box = new Hospital();
                return box;
            },
            'chance':function(){
                var box = new Chance();
                return box;
            }
        };
        var box =  dict[data.type](data);
        return box;
    }.bind(this);

    handler.findUser = function(username) {
        return this.userList.find(function(us) {
            return us.name == username;
        });
    };

    // 返回当前可以走的玩家
    handler.round = function() {
        this.userIndex = (this.userIndex + 1) % this.userList.length;
        this.currUser = this.userList[this.userIndex];
        this.currActionList = this.getActionList();
    };


    // 获取随机点数
    handler.getDiceNum = function() {
        return Math.ceil(Math.random() * 6);
    };

    // 获取当前玩家可行动作
    handler.getActionList = function() {
        var list = [];
        var us = this.currUser;
        list.push(UserAction.dice);

        return list;
        // buy
        // 是不是ground
        // 是否ground有owner
        // user的money够不够
        var box = this.boxList[this.currUser.index];
        if (BoxType.ground == box.type && !box.owner && this.currUser.money >= box.price) {
            list.push(UserAction.buy);
        }
    };

    var ins = null;
    var getLogic = function() {
        if (!ins) {
            ins = new cls();
        }
        return ins;
    };



    this.getLogic = getLogic;



}).call(this);