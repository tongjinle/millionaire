var arr=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

var Box = cc.Sprite.extend({
	ctor:function(){
		this._super();

		this.speed = 100;
		this.letter = this._getRndLetter();
		var label = cc.LabelTTF.create(this.letter, "Arial", 20);
		this.addChild(label, 1);
	},
	move:function(dist){
		this.y -= dist;
	},
	_getRndLetter:function(){
		var num=Math.ceil(Math.random()*arr.length-1);
		arr.splice(num,1);
		console.log(arr);
		if(arr.length==0){
			arr=["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
		}
		return arr[num];
	}

});