define(function(){

	'use strict';
	
	(function() {
		/**
		 * 设定基本命名空间
		 * @namespace model
		 */
		var model = window.model || {};
	
		/*设定基本构架*/
		model = {
			_INSTALL: function(){
				window.model = model;
			},
			base: {}, //基础层，所有的基础函数库，如cookie等
			ui: {},   //前端显示层，用来重构和回流DOM，前端的特效显示处理
			app:{}    //应用层，挂载一些应用的通用类。
		};
		
		model._INSTALL();
	}(window));
	
	/**
	 * 基础函数库
	 * @class model.base 基础函数库
	 */
	model.base = {
		
		/**
		 * 判断是否是数组
		 * @method model.base.isArray
		 * @param {Object} 数组对象
		 * @return {Boolean}
		 */
		isArray: function(o){
			return o ? jQuery.isArray(o) : false;
		},
		
		/**
		 * 判断是否是对象
		 * @method model.base.isObject
		 * @param {Object} 字符串对象
		 * @return {Boolean}
		 */
		isObject: function(o){
			return o ? Object.prototype.toString.call(o) === "[object Object]" : false;
		},
		
		/**
		 * 判断是否是函数
		 * @method model.base.isFunction
		 * @param {Function} Function对象
		 * @return {Boolean}
		 */
		isFunction: function(o){
			return o ? Object.prototype.toString.call(o) === "[object Function]" : false;
		}
	};
	
	
	
	/**
	 * 前端显示层，用来重构和回流DOM，前端的特效显示处理
	 * @class model.ui 前端显示层
	 */
	model.ui = {
		/**
		 * 需要ui元素需要绝对定位的容器
		 * @method model.ui.wrap
		 * @return {Object} ui元素jquery对象
		 */
		wrap: function(){
			if(!$('#l-ui-wrap').length){
				$('body').append('<div id="l-ui-wrap"></div>');
			}
			return $('#l-ui-wrap');
		},
		
		/**
		 * 设置遮罩
		 * @method model.ui.lock
		 * @return {Object} 遮罩元素jquery对象
		 */
		lock: function(){
			var win      = $(window),
				body     = $('body'),
				lock     = $('.l-ui-lock'),
				_setSize = function(){
					if( !lock.length ){
						lock = body
								.append('<div class="l-ui-lock fn-hide"></div>')
								.find('.l-ui-lock')
					}
				};
				
			_setSize();
			lock.fadeIn();

			return lock;
		},
		
		/**
		 * 删除遮罩
		 * @method model.ui.unlock
		 */
		unlock: function(){
			$('html').removeClass('html-noScroll');
			$('.l-ui-lock').fadeOut();
		}
	};	
	
	return model;
});