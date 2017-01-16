var TrainBox = cc.Sprite.extend({  
    ctor: function(trainname) {  
        this._super();  
        this.trainname=trainname;
        this.width = CONFIG.SMALLBOX_SIZE;
        this.height = CONFIG.BIGBOX_SIZE;
        this._createBg();

    },  
    _createBg:function(){


        var s1 = new cc.Sprite.create("train.jpg");
        s1.setScaleX(0.1);
        s1.setScaleY(0.15);
        s1.rotation = 0;
        s1.x = this.width / 2;
        s1.y = this.height / 3;
        this.addChild(s1);

        var dn = new cc.DrawNode();
        var ltp = cc.p(0, 20);
        var rbp = cc.p(60, 0);
        dn.drawRect(ltp, rbp, cc.color(164, 35, 25));
        dn.y = this.height / 1.2;
        this.addChild(dn);

        var txt = new cc.LabelTTF('' + this.trainname + '', '', 18);
        txt.color = cc.color(255, 0, 0);
        txt.x = this.width / 2;
        txt.y = this.height / 1.4;
        this.addChild(txt);

    }
    });