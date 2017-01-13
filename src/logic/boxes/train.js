(function() {
    var cls = function(name,price,group) {
        this.type = BoxType.train;

        this.name = name;
        this.price = price;
        this.group = group;
    };

    var handler = cls.prototype;

    handler.pay = function(groupCount){
        return this.price * Math.ceil(Math.random()*10) * groupCount;
    };


    this.Train = cls;


}).call(this);