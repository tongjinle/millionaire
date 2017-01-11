(function(){
    var cls = function(name,price,group){
        this.name = name;
        this.price = price;
        this.group = group;

        this.owner = null;
        // 房子等级,最高是4级
        this.level = 0 ;

        // 最高等级
        this._maxLevel = CONFIG.GROUND_MAX_LEVEL;
    };

    var handler = cls.prototype;

    handler.pay = function(isAll){
        return this.price * (this.level+1) * (isAll?2:1);
    };

    handler.buildPrice = function(){
        return this.price;
    };

    handler.canBuild = function(){
        return this.level < this._maxLevel;
    };

    this.Ground = cls;
}).call(this);