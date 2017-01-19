(function() {
    var parseAction =  function(actionList) {
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

        // 可以build
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

        // chance
        dict[UserAction.chance] = function(data){
           // var menu =this.menu;
           //  this.aniMgr.push(function(cb) {
           //      menu.toggle(true, 'build');
           //      cb();
           //  });
              this.aniMgr.push(function(cb) {
                this.accept('chance');
                cb();
            }.bind(this));
        }

        actionList.forEach(function(act) {
            dict[act].bind(this)();
        }.bind(this));

    };

    this.gameSceneParseActionList = parseAction;

}).call(this);