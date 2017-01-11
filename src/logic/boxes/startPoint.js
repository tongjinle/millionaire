(function() {
    var cls = function() {
        this.type = BoxType.startPoint;
    };

    var handler = cls.prototype;

    handler.reward = function(){
        return CONFIG.STARTPOINT_REWARD;
    };



    this.StartPoint = cls;


}).call(this);