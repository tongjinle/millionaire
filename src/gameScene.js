var GameScene = cc.Scene.extend({
    ctor:function(){
        this._super();
        this.createGameMap();        
    },
    createGameMap:function(){
        var data = mapData;
        var posi = {
            x:cc.winSize.width-CONFIG.BIGBOX_SIZE/2,
            y:CONFIG.BIGBOX_SIZE/2
        }
        var posit={
            x:cc.winSize.width-CONFIG.BIGBOX_SIZE/2,
            y:cc.winSize.height-CONFIG.BIGBOX_SIZE/2
        }
        data.forEach(function(d,i){
            var s = this.createBox(d);
            var row = Math.floor(i/10);
            var step; 
            s.setPosition(posi);
            if(i%10==0){
                // big
                step = CONFIG.BIGBOX_SIZE/2 + CONFIG.SMALLBOX_SIZE/2;
            }else{
                step = CONFIG.SMALLBOX_SIZE;    
            }
            if(row ==0 ){
                posi.x -=step;
            }
            if(i%10==1){
                // big
                step = CONFIG.BIGBOX_SIZE/2 + CONFIG.SMALLBOX_SIZE/2;
            }else{
                step = CONFIG.SMALLBOX_SIZE;    
            }
            if(row ==1 ){
                posi.y +=step;
            }
            if(i%10==2){
                // big
                step = CONFIG.BIGBOX_SIZE/2 + CONFIG.SMALLBOX_SIZE/2;
            }else{
                step = CONFIG.SMALLBOX_SIZE;    
            }
            if(row ==2 ){
                posi.x +=step;
            }
            if(i%10==3){
                // big
                step = CONFIG.BIGBOX_SIZE/2 + CONFIG.SMALLBOX_SIZE/2;
            }else{
                step = CONFIG.SMALLBOX_SIZE;    
            }
            if(row ==3 ){
                posi.y -=step;
            }
        }.bind(this));
    },
    createBox:function(boxData){
        var dict = {
            'startPoint':function(data){
                var s = new cc.Sprite();
                s.width = CONFIG.BIGBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                var txt = new cc.LabelTTF('Start Point','',16);
                txt.color = cc.color(0,0,0);
                txt.x = s.width/2;
                txt.y = s.height/2;
                txt.rotation= -45;
                s.addChild(txt);
                
                return s;
            },
            'tax':function(data){
                var s = new cc.Sprite();
                s.width = CONFIG.SMALLBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                var txt = new cc.LabelTTF('Tax','',18);
                txt.color = cc.color(0,0,0);

                txt.x = s.width/2;
                txt.y = s.height/2;
                s.addChild(txt);
                // todo
                return s;
            },
            'ground':function(data){

                var s = new cc.Sprite();
                s.width = CONFIG.SMALLBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                var txt = new cc.LabelTTF(''+data.name+'','',18);
                txt.color = cc.color(0,0,0);

                txt.x = s.width/2;
                txt.y = s.height/2;
                s.addChild(txt);
                // todo
                return s;

            },
            'chance':function(data){
                var s = new cc.Sprite();
                s.width = CONFIG.SMALLBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                var txt = new cc.LabelTTF('chance','',18);
                txt.color = cc.color(0,0,0);

                txt.x = s.width/2;
                txt.y = s.height/2;
                s.addChild(txt);
                // todo
                return s;
            },
        };

        var s = dict[boxData.type].bind(this)(boxData);
        this.addChild(s);
        return s;
    }


});