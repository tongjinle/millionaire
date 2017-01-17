var Menu = cc.Sprite.extend({
    onEnter: function() {
        // this.act = 'buy' - > this.buy.sho
        this._super();
        this.width = 300;
        this.height = 200;
        this._createground();
        this.toggle(false); // this.Menushow();
    },
    toggle: function(isShow, type) {
        this.visible = isShow;
        this.type = type;
        this._buyBtn.visible = type == 'buy';
        this._buildBtn.visible = !this._buyBtn.visible;
    },
    type: null,
    act: function() {
        var rst = this.parent.accept('buy');
    },
    Menushow: function() {
        if (this.rst) {
            this.createground();
        }
    },
    _createground: function() {
        var ground = new cc.Sprite();
        this.addChild(ground);

        // 底色
        var groundBox = new cc.Sprite();
        // groundBox.x = 250;
        // groundBox.y = 300;
        var dn = new cc.DrawNode();
        var ltp = cc.p(0, this.height);
        var rbp = cc.p(this.width, 0);
        dn.drawRect(ltp, rbp, cc.color(0, 0, 0, 150));
        var txt = new cc.LabelTTF('请选择以下操作：', '', 18);
        txt.color = cc.color(255, 255, 255);
        txt.x = 150;
        txt.y = 150;
        dn.addChild(txt);
        groundBox.addChild(dn);

        // 购买按钮
        var buyBtn = this._buyBtn = this._createBtn('购买', cc.p(50, 50), cc.color(5, 85, 152, 200), function() {
            if ('buy' != this.type) {
                return;
            }
            console.log('buy....');
            this.parent.accept('buy');
        }.bind(this));
        dn.addChild(buyBtn);


        // 升级房屋
        var buildBtn = this._buildBtn = this._createBtn('升级', cc.p(50, 50), cc.color(200, 20, 20, 200), function() {
            if ('build' != this.type) {
                return;
            }
            console.log('build....');
            this.parent.accept('build');
        }.bind(this));
        dn.addChild(buildBtn);

        // 放弃
        var cancelBtn = this._createBtn('放弃', cc.p(200, 50), cc.color(40, 220, 103, 200), function() { 
            if(!this._buildBtn.visible){
                this.parent.accept('cancel', { type: 'buy'});
            }else {
                this.parent.accept('cancel', {type: 'build'});
            }
        }.bind(this));
        dn.addChild(cancelBtn);

        this.addChild(groundBox);


        return ground;
    },
    _createBtn: function(text, posi, color, trigger) {
        var btn = new cc.DrawNode();
        var width = 50;
        var height = 30;
        btn.width = width;
        btn.height = height;

        var ltpc = cc.p(0, height);
        var rbpc = cc.p(width, 0);
        btn.x = posi.x;
        btn.y = posi.y;
        btn.drawRect(ltpc, rbpc, color);
        console.log(ltpc, rbpc);

        var txtc = new cc.LabelTTF(text, '', 15);
        txtc.color = cc.color(255, 255, 255);
        txtc.x = width / 2;
        txtc.y = height / 2;
        btn.addChild(txtc);

        // trigger
        // todo 
        cc.eventManager.addListener({
            event: cc.EventListener.MOUSE,
            onMouseDown: function(event) {
                if (!this.visible) {
                    return;
                }
                var worldPosi = btn.convertToWorldSpace();
                var btnRect = cc.rect(worldPosi.x, worldPosi.y, btn.width, btn.height);
                if (!cc.rectIntersectsRect(btnRect, cc.rect(event.getLocationX(), event.getLocationY(), 1, 1))) {
                    return;
                }
                trigger();

            }.bind(this)
        }, this);

        return btn;
    }
});