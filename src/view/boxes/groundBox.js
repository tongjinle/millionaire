var GroundBox = cc.Sprite.extend({
    ctor: function(name,cityname,price,group,groupcolor,level) {
        this._super();

        this.name = name;
        this.cityname = cityname;
        this.price = 0;
        this.group = group;

        this.width = CONFIG.SMALLBOX_SIZE;
        this.height = CONFIG.BIGBOX_SIZE;

        this._createBg(groupcolor);
        this._createOwnerLogo();
        this._createHousebuild();
        this._createMoney();
        this.updatePrice(price);

    },
    setOwnerLogo:function(name){
        this.ownerLogo.texture = "chess_"+name+".png";
    },
    _createOwnerLogo:function(){
        var s = this.ownerLogo = new cc.Sprite();
        s.width = 50;
        s.height = 50;
        s.setScaleX(.6);
        s.setScaleY(.6);
        s.x = this.width / 2;
        s.y = this.height / 2 + s.height;
        this.addChild(s);
    },
    setHousebuild:function(level){
        this.housebuild.texture = "home"+level+".png";
    },
    _createHousebuild:function(){
        var s = this.housebuild = new cc.Sprite();
        s.width = 50;
        s.height = 50;
        s.setScaleX(.5);
        s.setScaleY(.5);
        s.x = this.width / 2;
        s.y = this.height / 3.8;
        this.addChild(s);
    }, 
    updatePrice:function(pay) {
    
        this.price=pay;
        console.log(this.price);
        this.txt_money.string= Math.floor(pay);

    }, 
    _createBg: function(groupcolor,pay) {
        var dn = new cc.DrawNode();
        var ltp = cc.p(0, 20);
        var rbp = cc.p(60, 0);

        // var groupcolor = mapColorData[this.group] ? mapColorData[this.group].toUpperCase() : mapColorData['default'].toUpperCase();
        dn.drawRect(ltp, rbp, cc.color[groupcolor.toUpperCase()]);
        dn.y =this.height / 1.2;

        this.addChild(dn);
        var db = new cc.DrawNode();
        var lt = cc.p(0, 100);
        var rb = cc.p(60, 0);
        db.drawRect(lt, rb, cc.color(190, 216, 120));
        this.addChild(db);

     

        var txt = new cc.LabelTTF('' + this.cityname + '', '', 18);
        txt.color = cc.color(0, 0, 0);
        txt.x = this.width / 2;
        txt.y = this.height / 1.35;
        this.addChild(txt);

        // var pricetxt = new cc.LabelTTF('' + this.price+ '', '', 18);
        // pricetxt.color = cc.color(255, 0, 0);
        // pricetxt.x = this.width / 2;
        // pricetxt.y = this.height / 1.7;
        // this.addChild(pricetxt);
    },
    _createMoney: function() {
        // var txt_money = this.txt_money = new cc.LabelTTF('', '', 14);
        // txt_money.color = cc.color(255, 255, 255);
        // txt_money.x = 100;
        // txt_money.y = 25;
        // this.addChild(txt_money);

        var pricetxt = this.txt_money=new cc.LabelTTF('', '', 18);
        pricetxt.color = cc.color(255, 0, 0);
        pricetxt.x = this.width / 2;
        pricetxt.y = this.height / 1.7;
        this.addChild(pricetxt);

    }



});