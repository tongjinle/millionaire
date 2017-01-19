(function(){
	var ai = function(actionList) {
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
            } else if (aiAct.actName == 'chance'){
                this.accept('chance');
            }
        }.bind(this), delay);
    };

    this.gameSceneAi = ai;
}).call(this);