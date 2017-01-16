var TrainBox = cc.Sprite.extend({  
    ctor: function(trainname,name,group) {  
        this._super();  
        this.name = name;
        this.trainname=trainname;
        this.group = group;
        this.width = CONFIG.SMALLBOX_SIZE;
        this.height = CONFIG.BIGBOX_SIZE;
        this._createBg();
        this._createOwnerLogo();

    },  
    setOwnerLogo:function(name){
        this.ownerLogo.texture = "chess_"+name+".png";
    },
    _createOwnerLogo:function(){
        var s = this.ownerLogo = new cc.Sprite();
        s.width = 50;
        s.height = 50;
        s.setScaleX(.6);
        s.setScaleY(.6);
        s.x = this.width / 2;
        s.y = this.height / 2 + s.height;
        this.addChild(s);
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