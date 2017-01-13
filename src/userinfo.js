// var UserInfo = cc.Sprite.extend({
//     onEnter: function() {
//         this._super();
//         this.width = 400;
//         this.height = 150;
//         var userList = getLogic().userList;
//         this._createUserList(userList);


//     },
//     _createUserList: function(userList) {
//         var list = new cc.Sprite();
//         this.addChild(list);
//         // 底色
//         var listbackground = new cc.Sprite();
//         var dn = new cc.DrawNode();
//         var ltp = cc.p(0, this.height);
//         var rbp = cc.p(this.width, 0);
//         dn.drawRect(ltp, rbp, cc.color(0, 0, 0, 150));
//         listbackground.addChild(dn);
//         this.addChild(listbackground);
//         if (userList.length >0) {
//             var p1 = this._personBg(cc.color(242, 32, 180, 150), 0, this.height / 2, userList[0].name.toUpperCase(),userList[0].money);
//             dn.addChild(p1);
//             if (userList.length >1 ) {
//                 var p2 = this._personBg(cc.color(0, 255, 48, 150), 0, 0, userList[1].name.toUpperCase(),userList[1].money);
//                 dn.addChild(p2);
//                 if (userList.length >2) {
//                     var p3 = this._personBg(cc.color(0, 150, 150, 150), this.width / 2, this.height / 2, userList[2].name.toUpperCase(),userList[2].money);
//                     dn.addChild(p3);
//                     if (userList.length >3) {
//                         var p4 = this._personBg(cc.color(100, 31, 0, 150), this.width / 2,0,userList[3].name.toUpperCase(),userList[3].money);
//                         dn.addChild(p4);

//                     }
//                 }

//             }
//         }
//     },
//     _personBg: function(color, Xwidth, Yheigth, username,usermoney) {
//         var bg = new cc.DrawNode();
//         bg.x = Xwidth;
//         bg.y = Yheigth;
//         var ltp = cc.p(0, this.height / 2);
//         var rbp = cc.p(this.width / 2, 0);
//         bg.drawRect(ltp, rbp, color);

//         var txt_title = new cc.LabelTTF('用户名：', '', 14);
//         txt_title.color = cc.color(255, 255, 255);
//         txt_title.x = 50;
//         txt_title.y = 50;

//         var txt_name = new cc.LabelTTF(username, '', 14);
//         txt_name.color = cc.color(255, 255, 255);

//         txt_name.x = 116;
//         txt_name.y = 50;
//         var txt_money = new cc.LabelTTF('金　额：' + usermoney + '　元', '', 14);
//         txt_money.color = cc.color(255, 255, 255);
//         txt_money.x = 85;
//         txt_money.y = 25;
//         bg.addChild(txt_title);
//         bg.addChild(txt_name);
//         bg.addChild(txt_money);
//         return bg;
//     },
// });

var UserInfo = cc.Sprite.extend({
    ctor: function(username, money,color) {
        this._super();
        this.width = 200;
        this.height = 75;

        this.name = username;

        this._createBg(color);
        this._createUserName(username);
        this._createMoney();
        this.setMoney(money);
    },

    setMoney: function(money) {
        this.txt_money.string = '　　　' + money + '　元';
    },
    _createBg: function(color) {
        var bg = new cc.DrawNode();
        var ltp = cc.p(0, this.height);
        var rbp = cc.p(this.width , 0);
        bg.drawRect(ltp, rbp, color);
        console.log('bg:',bg.x,bg.y,bg.anchorX,bg.anchorY)
        this.addChild(bg);
    },

    _createUserName: function(username) {
        var txt_title = new cc.Sprite('chess_'+username+'.png');
        txt_title.x = 50;
        txt_title.y = 35;
        var txt_name = new cc.LabelTTF(username, '', 14);
        txt_name.color = cc.color(255, 255, 255);
        txt_name.x = 120;
        txt_name.y = 50;

        this.addChild(txt_title);
        this.addChild(txt_name);
    },
    _createMoney: function() {
        var txt_money = this.txt_money = new cc.LabelTTF('', '', 14);
        txt_money.color = cc.color(255, 255, 255);
        txt_money.x = 100;
        txt_money.y = 25;
        this.addChild(txt_money);


    }

});