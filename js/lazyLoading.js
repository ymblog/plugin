/**
 * [懒加载]
 * @author linkun 2018-02-13
 */
define(function(){
	var LazyLoading = function(options){
		if(!(this instanceof LazyLoading)) return new LazyLoading(options);
		this.init();
	};
	LazyLoading.prototype = {
		init:function() {
			var self = this;
			//显示首屏图片
			self.imgLoad();
		    //滚动按需加载
		    window.addEventListener('scroll',self.throttle(self.imgLoad,500,800));
		},
		//防抖机制
		throttle:function(func, wait, mustRun){
			var timeout,
	        startTime = new Date();
		    return function() {
		        var context = this,
		            args = arguments,
		            curTime = new Date();
		        clearTimeout(timeout);
		        // 如果达到了规定的触发时间间隔，触发 handler
		        if(curTime - startTime >= mustRun){
		            func.apply(context,args);
		            startTime = curTime;
		        // 没达到触发间隔，重新设定定时器
		        }else{
		            timeout = setTimeout(func, wait);
		        }
		    };
		},
		/**
		 * [imgLoad 加载图片]
		 */
		imgLoad:function(){
			var $images = $('img.lazyload'),
				self = this,
				sHight = $(window).scrollTop();
			for (var i = 0,len = $images.length;i < len; i++) {
				var $image = $images.eq(i);
		        if($image.attr("data-lazy") && ($image.offset().top <= sHight + $(window).height())){
		        	$image.attr("src", $image.attr("data-lazy")).removeClass("lazyload");
		        }else if($image.attr("data-lazy")){
		        	break;
		        }
		    }
		}
	};
    return LazyLoading;
});