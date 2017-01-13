var boxSprite=cc.Sprite.extend({
	onEnter:function(){
		this._super();
	},
	onExit:function(){
		cc.log("onExit");
	}
	addTouchEventListenser:function(){
		this.touchListener=cc.EventListener.TOUCH_ONE_BY_ONE;
		swallowTouches:true,
		onTouchBegan:function(touch,event){
			var pos=touch.getLocation();
			var target=event.getCurrentTarget();
			if(cc.rectContainPoint(target.getBoundingBox(),pos)){
			return true;
		}
		return false;
		}
		cc.eventManager.addListener(this.touchListener,this);
	}
	createDisappearAction:function(){
		var frames=[];
		for(var i=0;i<Box._letterList.length,i++){
			var frame=cc.spriteFrameCache.getSpriteFrame(Box._letterList);
			frames.push(frame);
		}
	}
});