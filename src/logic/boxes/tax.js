(function() {
    var cls = function() {
        this.type = BoxType.tax;
    };

    var handler = cls.prototype;

    handler.reward = function(){
        return CONFIG.STARTPOINT_REWARD;
    };



    this.Tax = cls;


}).call(this);