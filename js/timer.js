/**
 * [倒计时]
 * @author linkun 2018-02-13
 * @param  {[int]} time [剩余秒数]
 * @param  {[string]} model [倒计时模式 hms为时分秒(默认) dhms为天时分秒 ms为分秒]
 * @param  {[int]} type [倒计时类型 1为00:00:000(默认) 2为00时00分00秒]
 * @param  {[function]} end [倒计时结束执行函数]
 * @param  {[string]} endText [倒计时结束文案]
 */
/*exp:
Timer({
	target:document.querySelector('.timer'),//使用js获取
	time:10,
	model:'hms',
	type:1
	end:end
});*/
define(function(){
	var Timer = function(options){
		if(!(this instanceof Timer)) return new Timer(options);
		this.target     = options.target || document.querySelector('.timer');
		this.time 		= options.time || 0;
		this.model 		= options.model || 'hms';
        this.type 		= options.type || 1;
        this.endText 	= options.endText || '';
        this.end 		= options.end  || '';
		this.timer 		= '';//计时器
		this.init();
	};
	Timer.prototype = {
		//初始化
		init:function(){
			this.render(this);
		    this.timer = setTimeout(this.countDown,1000,this);
		},
        //补零
		addZero:function(n){
		    var n = parseInt(n, 10);
		    return n > 0 ? n <= 9 ? ('0' + n) : (n + '') :'00';
		},
        //倒计时设置
        render:function(_this){
        	var days 	= hours = minutes = seconds = 0,
        		dSymbol = hSymbol = mSymbol = sSymbol = ':',
        		temHtml = '';
		    if (_this.time > 0){
	            minutes = _this.addZero(Math.floor((_this.time % 3600) / 60));
	            seconds = _this.addZero(Math.floor(_this.time % 60));
	            if(_this.type == 2){
					dSymbol = '天';
					hSymbol = '时';
					mSymbol = '分';
					sSymbol = '秒';
				}
	            temHtml = '<span class="minute">' + minutes + '</span><span class="symbol">'+ mSymbol +'</span><span class="second">' + seconds +'</span>';
	            if(_this.type == 2){
	            	temHtml += '<span class="symbol">秒</span>';
	            }
	            if(_this.model == 'dhms'){
	            	days = _this.addZero(Math.floor(_this.time / 86400));
	            	temHtml = '<span class="day">' + days + '</span><span class="symbol">'+ dSymbol +'</span>'+'<span class="hour">' + hours + '</span><span class="symbol">'+ hSymbol +'</span>' + temHtml;
	            }
	            else if(_this.model == 'hms'){
	            	hours = _this.addZero(Math.floor((_this.time % 86400) / 3600));
	            	temHtml = '<span class="hour">' + hours + '</span><span class="symbol">'+ hSymbol +'</span>' + temHtml;
	            }
	            clearTimeout(_this.timer);
	            _this.timer = setTimeout(_this.countDown,1000,_this);
	    	}
	    	else{
	            clearTimeout(_this.timer);
	            if(_this.end instanceof Function){
	            	//倒计时结束执行
	            	_this.end();
	            }else{
	            	temHtml = _this.endText;
	            }
	    	}
		    _this.target.innerHTML = temHtml;
        },
        //计时器
        countDown:function(_this){
        	_this.time --;
        	_this.render(_this);
        }
	};
	return Timer;
});