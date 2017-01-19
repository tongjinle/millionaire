var TaxBox = cc.Sprite.extend({  
    ctor: function() {  
        this._super();  
        this.width = CONFIG.SMALLBOX_SIZE;
        this.height = CONFIG.BIGBOX_SIZE;
        this._createBg();

    },  
    _createBg:function(){

        var s1 = new cc.Sprite.create("coin.png");
        var s2 = new cc.Sprite.create();
        s1.setScaleX(0.05);
        s1.setScaleY(0.05);
        s2.setScaleX(0.32);
        s2.setScaleY(0.32);

        s1.x = this.width / 2;
        s1.y = this.height / 2.8;
        s2.x = this.width / 1.7;
        s2.y = this.height / 2.6;


        var db = new cc.DrawNode();
        var lt = cc.p(0, 120);
        var rb = cc.p(60, 0);
        db.drawRect(lt, rb, cc.color(190, 216, 120));
        this.addChild(db);
        var txt = new cc.LabelTTF('Tax', '', 18);
        txt.color = cc.color(0, 0, 0);
        txt.x = this.width / 2;
        txt.y = this.height / 1.4;
        db.addChild(s1);
        db.addChild(s2);
        this.addChild(txt);



        s1.runAction(
            cc.spawn(cc.rotateBy(3, 360, 360),
                cc.sequence(cc.scaleTo(0.05, 0.05),
                    cc.scaleTo(0.07, 0.07))).repeatForever());

    }
    });