(function(){
    var cls = function(){
        this.userList = [];
        this.userIndex = -1;
        this.roundIndex = 0;
    };

    var handler = cls.prototype;

    // 加入玩家
    handler.createUserList = function(humanName,num){
        for(var i=0;i<num;i++){
            var us;
            var compList = [];
            if(i==0){
                us = new User(humanName,UserRole.human);
            }else{
                var computerNameList = CONFIG.COMPUTERNAME_LIST;
                var compName;
                while(1){
                    compName = computerNameList[Math.floor(Math.random()*computerNameList.length)];
                    if(compList.indexOf(compName)==-1){
                        break;
                    }
                }
                us = new User(compName,UserRole.com);
            }
            this.userList.push(us);
        }
    };

    handler.findUser = function(username){
        return this.userList.find(function(us){
            return us.name == username;
        });
    };

    // 返回当前可以走的玩家
    handler.round = function(){
        this.userIndex = (this.userIndex+1)%this.userList.length;
        return this.userList[this.userIndex].name;
    };

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