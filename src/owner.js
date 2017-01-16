var Owner = cc.Sprite.extend({
    ctor: function(ground) {
        this._super();
        this.height=100;
        var boxList=getLogic().boxList;
        this._createOwner(boxList);
        console.log(boxList);

    },
    setOwner: function() {
        this.txt_money.string = '金　额：' + money + '　元';
    },
    _createOwner:function(name){
            var s1 = new cc.Sprite.create("chess_sunxiaomei.png");
            s1.setScaleX(.6);
            s1.setScaleY(.6);
            s1.rotation = 0;
            // s1.x = s.width / 2;
            // s1.y = s.height / 2+s1.height;
            this.addChild(s1);
    }
});