var UserInfo = cc.Sprite.extend({
    ctor: function(username, money,color) {
        this._super();
        this.width = 200;
        this.height = 75;

        this.name = username;
        this.money = 0;

        this._createBg(color);
        this._createUserName(username);
        this._createMoney();
        this.setMoney(money);
    },

    setMoney: function(money) {
        this.money =money;
        this.txt_money.string = '　　　' + Math.floor(money) + '　元';
    },
    _createBg: function(color) {
        if(this._bg){
            this.removeChild(this._bg);
        }
        var bg = this._bg = new cc.DrawNode();
        var ltp = cc.p(0, this.height);
        var rbp = cc.p(this.width , 0);
        bg.drawRect(ltp, rbp, color);
        console.log('bg:',bg.x,bg.y,bg.anchorX,bg.anchorY)
        this.addChild(bg,0);
    },

    _createUserName: function(username) {
        var txt_title = new cc.Sprite('chess_'+username+'.png');
        txt_title.x = 50;
        txt_title.y = 35;
        var txt_name = new cc.LabelTTF(username, '', 14);
        txt_name.color = cc.color(255, 255, 255);
        txt_name.x = 120;
        txt_name.y = 50;

        this.addChild(txt_title,1);
        this.addChild(txt_name,1);
    },
    _createMoney: function() {
        var txt_money = this.txt_money = new cc.LabelTTF('', '', 14);
        txt_money.color = cc.color(255, 255, 255);
        txt_money.x = 100;
        txt_money.y = 25;
        this.addChild(txt_money,1);


    },

    gameover:function(){
       this._createBg(cc.color.GRAY);

    }

});