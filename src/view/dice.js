var Dice = cc.Sprite.extend({
    ctor: function() {
        this._super('dice1.png');
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
                this.act();

            }.bind(this)
        }, this);
    },
    act: function() {
        var rst = this.parent.accept('diceNum');
    },
    ani: function(diceNum, next) {
        this.canDice = false;
        var delay = .2;
        var repeatCount = 5;
        var count = 0;
        this.schedule(function() {
            var rnd = Math.ceil(Math.random() * 6);
            this.texture = 'dice' + rnd + '.png';
            count++;
            if (count == repeatCount + 1) {
                // mock start
                diceNum = diceNum>6 ? 1 :diceNum;
                // mock end
                this.texture = 'dice' + diceNum + '.png';
                next && next();
            }
        }.bind(this), delay, repeatCount);

    },
    req: function() {}
});