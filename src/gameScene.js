var GameScene = cc.Scene.extend({
    ctor:function(){
        this._super();
        this.createGameMap();
        this.createChance();  
        this.createDice();
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
            if(i%10==0){
                // big
                step = CONFIG.BIGBOX_SIZE/2 + CONFIG.SMALLBOX_SIZE/2;
            }else{
                step = CONFIG.SMALLBOX_SIZE;    
            }

            if(i==10){
                posi.x-=(CONFIG.BIGBOX_SIZE/2-CONFIG.SMALLBOX_SIZE/2);
                window.ddd = s;
                console.log(ddd.getPosition(),posi);
            }else if (i==20){
                posi.y+=(CONFIG.BIGBOX_SIZE/2-CONFIG.SMALLBOX_SIZE/2);
            }else if(i==30){
                posi.x+=(CONFIG.BIGBOX_SIZE/2-CONFIG.SMALLBOX_SIZE/2);
            }
            s.setPosition(posi);
            if(row ==0 ){
                console.log(posi,'**');
                posi.x -=step;
            }
            if(row ==1 ){
                s.rotation=90;
                posi.y +=step;
            }
            if(row ==2 ){
                s.rotation=180;
                posi.x +=step;
            }
            if(row ==3 ){
                s.rotation=270;
                posi.y -=step;
            }
        }.bind(this));
    },
    createBox:function(boxData){
        var dict = {
            'startPoint':function(data){
                var s = new cc.Sprite();
                var s1=new cc.Sprite.create("start.jpg");
                var CHESS=new Chess();
                s1.setScale(0.3);
                s.width = CONFIG.BIGBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                s1.x = s.width/2;
                s1.y = s.height/2;
                CHESS.x = s.width*3;
                CHESS.y = s.height*2;
                s1.addChild(CHESS);
                s.addChild(s1);

                
                return s;
            },
            'jail':function(data){
                var s = new cc.Sprite();
                s.width = CONFIG.BIGBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                var s1=new cc.Sprite.create("jail.jpeg");
                s1.setScaleX(0.2);
                s1.setScaleY(0.3);
                s.width = CONFIG.BIGBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                s1.x = s.width/2;
                s1.y = s.height/2;
                s.addChild(s1);
                
                return s;
            },
            'hotel':function(data){
                var s = new cc.Sprite();
                s.width = CONFIG.BIGBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                var s1=new cc.Sprite.create("hotel.png");
                s1.setScale(1.6);
                s1.rotation=0;
                s1.x = s.width/2;
                s1.y = s.height/2;
                s.addChild(s1);
                return s;
            },
            'Hospital':function(data){
                var s = new cc.Sprite();
                s.width = CONFIG.BIGBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;

                var s1=new cc.Sprite.create("hospital.jpg");
                s1.setScale(0.12);
                s1.rotation=0;
                s1.x = s.width/2;
                s1.y = s.height/2;
                s.addChild(s1);
                return s;
            },
            'tax':function(data){
                var s = new cc.Sprite();

                var s1=new cc.Sprite.create("coin.png");
                var s2=new cc.Sprite.create();
                var CHESS=new Chess();
                s1.setScaleX(0.05);
                s1.setScaleY(0.05);
                s2.setScaleX(0.32);
                s2.setScaleY(0.32);
                s.width = CONFIG.SMALLBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                s1.x = s.width/2;
                s1.y = s.height/2.8;
                s2.x = s.width/1.7;
                s2.y = s.height/2.6;


                var db = new cc.DrawNode();
                var lt = cc.p(0,120 );
                var rb = cc.p(60, 0);
                db.drawRect(lt, rb, cc.color(190,216,120));
                s.addChild(db);
                var txt = new cc.LabelTTF('Tax','',18);
                txt.color = cc.color(0,0,0);
                txt.x = s.width/2;
                txt.y = s.height/1.4;
                db.addChild(s1);
                db.addChild(s2);
                s.addChild(txt);



                s1.runAction(
                    cc.spawn(cc.rotateBy(3, 360, 360), 
                    cc.sequence(cc.scaleTo(0.05, 0.05), 
                    cc.scaleTo(0.07, 0.07))).repeatForever());
   

                
                // todo
                return s;
            },
            'ground':function(data){
                var s = new cc.Sprite();
                s.width = CONFIG.SMALLBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;
                window.tjl =s;

                var dn = new cc.DrawNode();
                var ltp = cc.p(0,20 );
                var rbp = cc.p(60, 0);

                var groupcolor = mapColorData[data.group]
                    ?mapColorData[data.group].toUpperCase()
                    : mapColorData['default'].toUpperCase();
                dn.drawRect(ltp, rbp, cc.color[groupcolor]);
                dn.y=s.height/1.2;

                s.addChild(dn);
                var db = new cc.DrawNode();
                var lt = cc.p(0,100 );
                var rb = cc.p(60, 0);
                db.drawRect(lt, rb, cc.color(190,216,120));
                s.addChild(db);




                var txt = new cc.LabelTTF(''+data.cityname+'','',18);
                txt.color = cc.color(0,0,0);
                txt.x = s.width/2;
                txt.y = s.height/1.8;
                s.addChild(txt);

                var pricetxt = new cc.LabelTTF(''+data.price+'','',18);
                pricetxt.color = cc.color(255,0,0);
                pricetxt.x = s.width/2;
                pricetxt.y = s.height/3;
                s.addChild(pricetxt);
                return s;

            },
            'chance':function(data){
                var s = new cc.Sprite();
                s.width = CONFIG.SMALLBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;

                var s1=new cc.Sprite.create("chance.png");
                s1.setScaleX(1);
                s1.setScaleY(0.5);
                s1.rotation=0;
                s1.x = s.width/2;
                s1.y = s.height/2;

                var db = new cc.DrawNode();
                var lt = cc.p(0,120 );
                var rb = cc.p(60, 0);
                db.drawRect(lt, rb, cc.color(190,216,120));
                s.addChild(db);
                db.addChild(s1);
                return s;
            },
            'train':function(data){
                var s = new cc.Sprite();
                s.width = CONFIG.SMALLBOX_SIZE;
                s.height = CONFIG.BIGBOX_SIZE;

                var s1=new cc.Sprite.create("train.jpg");
                s1.setScaleX(0.1);
                s1.setScaleY(0.15);
                s1.rotation=0;
                s1.x = s.width/2;
                s1.y = s.height/3;
                s.addChild(s1);

                var dn = new cc.DrawNode();
                var ltp = cc.p(0,20 );
                var rbp = cc.p(60, 0);
                dn.drawRect(ltp, rbp, cc.color(164,35,25));
                dn.y=s.height/1.2;
                s.addChild(dn);

                var txt = new cc.LabelTTF(''+data.trainname+'','',18);
                txt.color = cc.color(255,0,0);
                txt.x = s.width/2;
                txt.y = s.height/1.4;
                s.addChild(txt);
                // todo
                return s;
            },
        };

        var s = dict[boxData.type].bind(this)(boxData);
        this.addChild(s);
        return s;
    },
    createChance:function(){

                var chance = new cc.Sprite();
                var s1=new cc.Sprite.create("chance.jpg");
                s1.setScale(0.2);
                chance.x = 250;
                chance.y = 400;
                chance.addChild(s1);
                this.addChild(chance);

                var self=this;
                cc.eventManager.addListener({
                    event:cc.EventListener.MOUSE,
                    onMouseDown:function(event){
                        var pos=event.getLocation();

                        if(self.checkChancePos(pos)){

                            var chanceBox = new cc.Sprite();
                            chanceBox.x=160;
                            chanceBox.y=300;
                            var dn = new cc.DrawNode();
                            var ltp = cc.p(0,200 );
                            var rbp = cc.p(200, 0);
                            dn.drawRect(ltp, rbp, cc.color(164,35,25,150));
                            chanceBox.addChild(dn);
                            var txt = new cc.LabelTTF('前进三步','',30);
                            txt.color = cc.color(255,255,255);
                            txt.x = 100;
                            txt.y = 100;
                            dn.addChild(txt);

                            self.addChild(chanceBox);

                            self.schedule(function(){
                                 chanceBox.setVisible(false);
                            },2,1,0);

                        }
                    }
                },this);


                return chance;
    },
    createDice:function(){
                var dice = new cc.Sprite();
                var s1=new cc.Sprite.create("dicebg.jpg");
                s1.setScale(0.45);
                s1.x = 550;
                s1.y = 400;
                dice.addChild(s1);
                this.addChild(dice);


                var self=this;
                cc.eventManager.addListener({
                    event:cc.EventListener.MOUSE,
                    onMouseDown:function(event){
                        var pos=event.getLocation();

                        if(self.checkPos(pos)){
                            self.schedule(function(){
                            var n=Math.ceil(Math.random()*6);
                            console.log(n);
                            s1=new cc.Sprite.create("dice"+n+".jpg"); 
                            s1.setScale(0.6);

                            s1.x = 550;
                            s1.y = 400;
                            dice.addChild(s1);
                            },0.05,10,0);
                        }
                    }
                },this);
                return dice;
    },
    checkPos:function(pos) {
        return ((pos.x>=480&&pos.x<=600)&&
        (pos.y>=350&&pos.y<=460))
    },
    checkChancePos:function(pos) {
        return (
            (pos.x>=CONFIG.BIGBOX_SIZE+CONFIG.SMALLBOX_SIZE*2&&pos.x<=CONFIG.BIGBOX_SIZE+CONFIG.SMALLBOX_SIZE*3)&&(pos.y>=0&&pos.y<=CONFIG.BIGBOX_SIZE)||
            (pos.x>=20&&pos.x<=CONFIG.BIGBOX_SIZE)&&(pos.y>=CONFIG.BIGBOX_SIZE+CONFIG.SMALLBOX_SIZE*6&&pos.y<=CONFIG.BIGBOX_SIZE+CONFIG.SMALLBOX_SIZE*7)||
            (pos.x>=CONFIG.BIGBOX_SIZE+CONFIG.SMALLBOX_SIZE*6&&pos.x<=CONFIG.BIGBOX_SIZE+CONFIG.SMALLBOX_SIZE*7)&&(pos.y>=CONFIG.BIGBOX_SIZE+CONFIG.SMALLBOX_SIZE*9&&pos.y<=CONFIG.BIGBOX_SIZE*2+CONFIG.SMALLBOX_SIZE*9)||
            (pos.x>=CONFIG.BIGBOX_SIZE+CONFIG.SMALLBOX_SIZE*9)&&(pos.y>=CONFIG.BIGBOX_SIZE+CONFIG.SMALLBOX_SIZE*2&&pos.y<=CONFIG.BIGBOX_SIZE+CONFIG.SMALLBOX_SIZE*3)
        )
    }

});