(function(){
    var cls = function(){};

    var handler = cls.prototype;

    handler.getDiceNum = function(){
        return Math.ceil(Math.random()*6);
    };

    var ins = null;
    var getLogic = function(){
        if(!ins){
            ins = new cls();
        }
        return ins;
    };
    


    this.getLogic = getLogic;





}).call(this);