var Dice = cc.Sprite.extend({
    ctor: function() {
        this._super('dice1.jpg');
        this.bind();
        this.canDice = true;
    },
    canDice: null,
    bind: function() {
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: function(event) {
                if (!this.canDice) {
                    return;
                }
                if (!cc.rectIntersectsRect(this.boundingBox(), cc.rect(event.getLocationX(), event.getLocationY(), 1, 1))) {
                    return;
                }
                var diceNum = getLogic().getDiceNum();
                this.ani(diceNum, function() {
                    this.parent.accept('diceNum', diceNum);
                }.bind(this));
            }.bind(this)
        }, this);
    },
    ani: function(diceNum, next) {
        this.canDice = false;
        var delay = .2;
        var repeatCount = 5;
        var count = 0;
        this.schedule(function() {
            var rnd = Math.ceil(Math.random() * 6);
            this.texture = 'dice' + rnd + '.jpg';
            count++;
            window.aaaa = count;
            if (count == repeatCount + 1) {
                this.texture = 'dice' + diceNum + '.jpg';
                next && next();
            }
        }.bind(this), delay, repeatCount);

    },
    req: function() {}
});