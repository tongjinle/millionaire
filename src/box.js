var Box = cc.Sprite.extend({
	ctor:function(){
		this._super();

		this.speed = 2;
		this.letter = this._getRndLetter();

		
		// todo 加个字母
	},
	move:function(dist){
		this.y -= dist;
	},
	_getRndLetter:function(){
		return 'A';
	}

});