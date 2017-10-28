


function Lottery(){
    this._initialize.apply(this, arguments);
}

Lottery.prototype = {

    _initialize: function(){

        this._setOptions();
    },

    _setOptions: function(options){

        var defaultOptions = {
            lotteryUnit:'.lottery .lottery-unit',
            nodeKey:'index',
            timer:null,
            prizeIndex:-1,
            arrLotteryUnitIndex: 0,
            currentIndex: -1,
            cycleTime:2000,
            selectNum: 5,
            currentCycleNum:0,
            cycleNum:100,
            fastSpeed:50,
            accSpeed:20,
            accEndSpeed:100
        },
        _ctx = this;

        _ctx.lotteryUnit = $(defaultOptions.lotteryUnit);
        _ctx.count = _ctx.lotteryUnit.length;
        //_ctx.selectNum = _ctx.count;
        _ctx.speed = defaultOptions.cycleTime/_ctx.cycleNum;
        _ctx.arrLotteryUnitTemp = [];
        _ctx.arrLotteryUnit = [];
        $.each(_ctx.lotteryUnit, function(key, node){
            var $node = $(node);
            _ctx.arrLotteryUnitTemp[$node.data(defaultOptions.nodeKey)] = $node;

        })
        $.each(_ctx.arrLotteryUnitTemp, function(key, node){
            if(!node) return;
            _ctx.arrLotteryUnit.push(node)
        })
        $.extend(_ctx, defaultOptions, options || {});
    },

    _init: function(){

        this.startTime = new Date().getTime();
        this.prize = false;
        this.prizeIndex = -1;
        this.currentCycleNum = 0;
        this.speed = this.cycleTime/this.cycleNum;
        this.callback = function(){};
        clearTimeout(this.timer);
    },

    select: function(){

        this.prev().removeClass("active");

        this.next().addClass("active");
    },

    prev: function(){

        return this.arrLotteryUnit[this.arrLotteryUnitIndex];
    },

    next: function(){

        if(this.currentIndex  === -1 || ++this.arrLotteryUnitIndex >= this.count){
            this.arrLotteryUnitIndex = 0;
        }
        this.currentIndex = this.arrLotteryUnit[this.arrLotteryUnitIndex].data(this.nodeKey);
        return this.arrLotteryUnit[this.arrLotteryUnitIndex];
    },

    isEnd: function(timeDifference){
        if ((this.currentCycleNum > this.cycleNum + this.selectNum &&
            timeDifference > this.cycleTime &&
            this.prizeIndex === this.currentIndex) ||
            (this.prize && this.prizeIndex === -1)) {
            this.callback&&this.callback(this.arrLotteryUnit[this.arrLotteryUnitIndex]);
            this._init();

            return false;
        }else{
            return true;
        }
    },

    roll: function(){

        this.select();

        var timeDifference = new Date().getTime() - this.startTime,
            firstNode = this.arrLotteryUnit[0],
            nextNode = this.arrLotteryUnit[this.arrLotteryUnitIndex + 1] || firstNode,
            lastNode = this.arrLotteryUnit[this.count - 1];
        ++this.currentCycleNum;

        if(this.isEnd(timeDifference)){
            if (this.currentCycleNum < this.cycleNum) {

                this.speed -= this.accSpeed;
                if(this.prize) this.currentCycleNum = this.cycleNum;

            }else{
                if (this.currentCycleNum > this.cycleNum + this.selectNum &&
                 ((this.prizeIndex === firstNode.data(this.nodeKey) && this.currentIndex === lastNode.data(this.nodeKey) )||
                  this.prizeIndex === nextNode.data(this.nodeKey) )) {
                    this.speed += this.accEndSpeed;
                }else{
                    this.speed += this.accSpeed;
                }
            }
            this.speed =  this.speed < this.fastSpeed ? this.fastSpeed :this.speed;
            this.timer = setTimeout($.proxy(this.roll, this), this.speed);
        }

        return false;
    },

    start: function(){
        this._init();
        this.roll();
    },
    stop: function(prizeIndex,callback){

        this.prize = true;
        this.cycleNum = this.count * 3;
        this.prizeIndex = prizeIndex;
        this.callback = callback;
        return false;
    }

};

var Lottery = new Lottery();
Lottery.start();
setTimeout(function(){
	Lottery.stop(7, function(index){

	});
},1000)
