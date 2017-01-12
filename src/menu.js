var Menu = cc.Sprite.extend({
    ctor: function() {
        // this.act = 'buy' - > this.buy.sho
        this._super();
        this.Menushow();
    },
    type: null,
    act: function() {
        var rst = this.parent.accept('buy');
    },
    Menushow:function(){
        if(this.rst){
            this.createground();
        }
    },
    createground: function() {
        var ground = new cc.Sprite();
        this.addChild(ground);
        var groundBox = new cc.Sprite();
        groundBox.x = 250;
        groundBox.y = 300;
        var dn = new cc.DrawNode();
        var ltp = cc.p(0, 200);
        var rbp = cc.p(300, 0);
        dn.drawRect(ltp, rbp, cc.color(0, 0, 0, 150));
        groundBox.addChild(dn);
        var txt = new cc.LabelTTF('请选择以下操作：', '', 18);
        txt.color = cc.color(255, 255, 255);
        txt.x = 150;
        txt.y = 150;
        dn.addChild(txt);

        var dnl = new cc.DrawNode();
        var ltpl = cc.p(0, 30);
        var rbpl = cc.p(50, 0);
        dnl.x = 50;
        dnl.y = 50;
        dnl.drawRect(ltpl, rbpl, cc.color(5, 85, 152, 200));

        var txtl = new cc.LabelTTF('购买', '', 15);
        txtl.color = cc.color(255, 255, 255);
        txtl.x = 25;
        txtl.y = 15;
        dnl.addChild(txtl);

        var dnc = new cc.DrawNode();
        var ltpc = cc.p(0, 30);
        var rbpc = cc.p(50, 0);
        dnc.x = 50;
        dnc.y = 50;
        dnc.drawRect(ltpc, rbpc, cc.color(200, 20, 20, 200));

        var txtc = new cc.LabelTTF('升级', '', 15);
        txtc.color = cc.color(255, 255, 255);
        txtc.x = 25;
        txtc.y = 15;
        dnc.addChild(txtc);
        if (!this.rst) {
            dn.addChild(dnl);
        } else {
            dn.addChild(dnc);
        }

        var dnr = new cc.DrawNode();
        var ltpr = cc.p(0, 30);
        var rbpr = cc.p(50, 0);
        dnr.x = 200;
        dnr.y = 50;
        dnr.drawRect(ltpr, rbpr, cc.color(40, 220, 103, 200));
        dn.addChild(dnr);
        var txtr = new cc.LabelTTF('放弃', '', 15);
        txtr.color = cc.color(255, 255, 255);
        txtr.x = 25;
        txtr.y = 15;
        dnr.addChild(txtr);

        this.addChild(groundBox);


        return ground;
    }
});