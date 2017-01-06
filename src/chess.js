var Chess = cc.Sprite.extend({
	ctor:function(){
		this._super();
	    this.width = this.height =30;

        
        var head=new cc.Sprite.create("head.png");
        head.setScale(0.4);
        
        this.addChild(head,5);
        
	},

});


