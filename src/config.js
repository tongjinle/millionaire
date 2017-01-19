(function() {
    var config = this.CONFIG = this.CONFIG || {};

    config.BIGBOX_SIZE = 120;
    config.SMALLBOX_SIZE = 60;



    // 电脑随机名字
    config.COMPUTERNAME_LIST = ['tom', 'jack', 'alphaGo', 'DEEPZEN'];


    // 玩家初始money
    config.USER_MONEY = 1000;
    config.USER_SPEED = 50;

    // 税率
    config.TAX_RATE = .2;

    // ground
    config.GROUND_MAX_LEVEL = 5;


    // startPoint的奖励
    config.STARTPOINT_REWARD = 2000;



    // AI
    config.AI = {};

    // 机器人buy的警戒money值
    config.AI.BUY_TERMINAL = 2000;
    // 机器人buy的冒险几率
    config.AI.BUY_RACE_RATE = .3;
    // 机器人buy的警戒money值
    config.AI.BUIlD_TERMINAL = 1500;
    // 机器人buy的冒险几率
    config.AI.BUILD_RACE_RATE = .4;

}).call(this);