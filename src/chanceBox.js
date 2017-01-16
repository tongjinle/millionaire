var ChanceBox = cc.Sprite.extend({  
    ctor: function() {  
        this._super();  
        this.width = CONFIG.SMALLBOX_SIZE;
        this.height = CONFIG.BIGBOX_SIZE;
        this._createBg();

    },  
    _createBg:function(){

        var s1 = new cc.Sprite.create("chance.png");
        s1.setScaleX(1);
        s1.setScaleY(0.5);
        s1.rotation = 0;

        s1.x = this.width / 2;
        s1.y = this.height / 2;

        var db = new cc.DrawNode();
        var lt = cc.p(0, 120);
        var rb = cc.p(60, 0);
        db.drawRect(lt, rb, cc.color(190, 216, 120));
        db.addChild(s1);
        this.addChild(db);

    }
});