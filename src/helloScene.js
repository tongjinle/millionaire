var HelloScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        var size = cc.director.getWinSize();
        var sprite = cc.Sprite.create("HelloWorld.png");
        sprite.setPosition(size.width / 2, size.height / 2);
        sprite.setScale(0.8);
        this.addChild(sprite, 0);

        // var label = cc.LabelTTF.create("Hello World", "Arial", 40);
        // label.setPosition(size.width / 2, size.height / 2);
        // this.addChild(label, 1);


        this.duration = 0;
        this._boxList = [];

        this.scheduleUpdate();
    },
    update:function(dt){
        this.duration += dt;
        if(this.duration>0.5){
            this.createBox();
            this.duration = 0;
        }

        // 所有的box要掉下来
        this.allBoxDrop(dt);
    },
    createBox:function(){
        var bo = new Box();
        var winWidth = cc.director.getWinSize().width;
        var winHeight = cc.director.getWinSize().height;
        bo.x = Math.random()*(winWidth - bo.width) +bo.width/2;
        bo.y = winHeight - bo.height/2;
        this.addChild(bo);
        this._boxList.push(bo);
    },
    allBoxDrop:function(dt){
        this._boxList.forEach(function(bo,i){
            var dist = dt * bo.speed;
            bo.move(dist);
        });
    }

});