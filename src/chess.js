var Chess = cc.Sprite.extend({
	ctor:function(){
		this._super();
	    // this.width = this.height =30;
        // this.x = cc.winSize.width-CONFIG.BIGBOX_SIZE/2+this.width/2;
        // this.y = CONFIG.BIGBOX_SIZE/2+this.height/2;
        this.index =0;
        var head=new cc.Sprite.create("head.png");
        head.setScale(0.1);
        
        this.addChild(head,10);
        window.aaa=this;
	},

});


