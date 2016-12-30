var Box = cc.Sprite.extend({
	ctor:function(){
		this._super();

		this.width = this.height = 40;

		this.speed = 10;
		this._letterList = 'abcdefghijklmnopqrstuvwxyz'.split('');
		this.letter = this._getRndLetter();

		// todo 加个字母
		var label = cc.LabelTTF.create(this.letter, "Arial", 40);
        label.setPosition(this.width / 2, this.height / 2);
        this.addChild(label, 1);

	},
	move:function(dist){
		this.y -= dist;
	},
	_getRndLetter:function(){
		

		while(1){
			if(Box._letterCount==this._letterList.length){
				break;
			}

			var rndNum = Math.floor(Math.random()*this._letterList.length);
			if(Box._letterDict[rndNum]===undefined){
				Box._letterDict[rndNum] = true;
				Box._letterCount++;
				break;
			}	
		}

		var rndLet = this._letterList[rndNum];
		return rndLet;
	},
	destroy:function(){
		Box._letterCount --;
		var num = this._letterList.indexOf(this.letter);
		delete Box._letterDict[num];

		this.parent.removeChild(this);
	}


});

Box._letterDict ={};
Box._letterCount = 0;