var Chess = cc.Sprite.extend({
	ctor: function(username) {
		this.name = username;
		this._super("chess_" + this.name + ".png");
	}
});