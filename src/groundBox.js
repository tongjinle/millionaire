var GroundBox = cc.Sprite.extend({
    ctor: function(name,cityname,price,group,groupcolor,level) {
        this._super();

        this.name = name;
        this.cityname = cityname;
        this.price = price;
        this.group = group;

        this.width = CONFIG.SMALLBOX_SIZE;
        this.height = CONFIG.BIGBOX_SIZE;

        this._createBg(groupcolor);
        this._createOwnerLogo();
        this._createHousebuild();
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
        s.setScaleX(.2);
        s.setScaleY(.2);
        s.x = this.width / 2;
        s.y = this.height / 2- (s.height/1.3);
        this.addChild(s);
    },    
    _createBg: function(groupcolor) {
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
        txt.y = this.height / 1.8;
        this.addChild(txt);

        var pricetxt = new cc.LabelTTF('' + this.price + '', '', 18);
        pricetxt.color = cc.color(255, 0, 0);
        pricetxt.x = this.width / 2;
        pricetxt.y = this.height / 2.6;
        this.addChild(pricetxt);
    }
});