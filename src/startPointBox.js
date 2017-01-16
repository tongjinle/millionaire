var StartPointBox = cc.Sprite.extend({  
    ctor: function() {  
        this._super();  
        this.width = CONFIG.BIGBOX_SIZE;
        this.height = CONFIG.BIGBOX_SIZE;
        this._createBg();

    },  
    _createBg:function(){
        // var this = new cc.Sprite();
        var s1 = new cc.Sprite.create("start.jpg");

        s1.setScale(0.3);
        s1.x = this.width / 2;
        s1.y = this.height / 2;

        this.addChild(s1);

    }
    });