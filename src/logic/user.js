(function() {
    var cls = function(name, role) {
        this.name = name;
        this.role = role;
        this.index = 0;
        this.money = CONFIG.USER_MONEY;
        this.groundIndexList = [];


        this.isDead = false;
    };

    var handler = cls.prototype;



    this.User = cls;


}).call(this);