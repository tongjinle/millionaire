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
                var s1=new cc.Sprite.create("xwz.jpg");
                s1.setScale(0.6);
                s.width = CONFIG.BIGBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                s1.x = s.width/2;
                s1.y = s.height/2;
                //s1.rotationX=20;
                //s1.setSkewX(45);
                //s1.setSkewY(25);
               
                

/*                s1.runAction(
                    cc.spawn(cc.rotateBy(0.6, 360, 360), 
                    cc.sequence(cc.scaleTo(0.6, 0.6), 
                    cc.scaleTo(0.6, 0.6))).repeatForever());
   
*/


            var txt = new cc.LabelTTF('Start Point','',28);
                txt.color = cc.color(0,0,0);
                txt.x = s.width/2;
                txt.y = s.height/2;
                txt.rotation= -45;
                s.addChild(s1);
                s.addChild(txt);





                
                return s;
            },
            'tax':function(data){
                var s = new cc.Sprite();

                var s1=new cc.Sprite.create("xwz.jpg");
                s1.setScaleX(0.3);
                s1.setScaleY(0.6);
                s.width = CONFIG.SMALLBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                s1.x = s.width/2;
                s1.y = s.height/2;
                var txt = new cc.LabelTTF('Tax','',18);
                txt.color = cc.color(0,0,0);

                




                txt.x = s.width/2;
                txt.y = s.height/2;
                s.addChild(s1);
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