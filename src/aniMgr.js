(function() {
    var cls = function() {
        this._aniQueue = [];
        this.isRunning = false;
    };

    var handler = cls.prototype;

    handler.push = function(fn) {
        var queue = this._aniQueue;
        queue.push(fn);
        this._run();
    };

    handler._run = function() {
        var queue = this._aniQueue;

        if (!queue.length) {
            this.isRunning = false;
            return;
        }

        if (this.isRunning) {
            return;
        }

        this.isRunning = true;
        var curr = queue.shift();
        var delay = 400;
        curr(function() {
            this.isRunning = false;
            setTimeout(this._run.bind(this), delay);
        }.bind(this));
    }

    this.AniMgr = cls;

}).call(this);