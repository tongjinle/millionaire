var Chess = cc.Sprite.extend({
	ctor:function(user){
                this.name = user.name;
                this.user = user;
	       this._super("chess_"+user.name+".png");
	}
});


