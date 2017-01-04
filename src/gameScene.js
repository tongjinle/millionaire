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
        }.bind(this));
    },
    createBox:function(boxData){
        var dict = {
            'startPoint':function(data){
                var s = new cc.Sprite();
                s.width = CONFIG.BIGBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                var txt = new cc.LabelTTF('Start Point','',28);
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
                var txt = new cc.LabelTTF('Ground','',18);
                txt.color = cc.color(0,0,0);

                txt.x = s.width/2;
                txt.y = s.height/2;
                s.addChild(txt);
                // todo
                return s;
            }
        };

        var s = dict[boxData.type].bind(this)(boxData);
        this.addChild(s);
        return s;
    }


});