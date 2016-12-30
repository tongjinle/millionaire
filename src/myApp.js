cc.game.onStart = function() {
    cc.loader.resPath = RES_PATH;
    // var designSize = cc.size(480, 800);
    // var screenSize = cc.view.getFrameSize();

    // if(!cc.sys.isNative && screenSize.height < 800){
    //     designSize = cc.size(320, 480);
    // }
    // cc.view.setDesignResolutionSize(designSize.width, designSize.height, cc.ResolutionPolicy.SHOW_ALL);

    //load resources
    cc.LoaderScene.preload(RES, function() {
        
        cc.director.runScene(new HelloScene());
    }, this);
};
cc.game.run("gameCanvas");