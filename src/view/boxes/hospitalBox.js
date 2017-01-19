var HospitalBox = cc.Sprite.extend({  
    ctor: function() {  
        this._super();  
        this.width = CONFIG.BIGBOX_SIZE;
        this.height = CONFIG.BIGBOX_SIZE;
        this._createBg();

    },  
    _createBg:function(){


        var s1 = new cc.Sprite.create("hospital.jpg");
        s1.setScale(0.12);
        s1.rotation = 0;
        s1.x = this.width / 2;
        s1.y = this.height / 2;
        this.addChild(s1);

    }
    });