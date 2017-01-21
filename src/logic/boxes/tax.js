(function() {
    var cls = function() {
        this.type = BoxType.tax;
    };

    var handler = cls.prototype;

    handler.pay = function(userMoney){
    	return userMoney * CONFIG.TAX_RATE;
    };


    this.Tax = cls;


}).call(this);