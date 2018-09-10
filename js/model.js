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
		},
		
		/**
		 * cookie
		 */
		cookie: {

			/**
			 * 设置cookie
			 * @param {String} cookie的名称
			 * @param {String} cookie的值
			 * @param {String} cookie的有效期
			 * @param {String} cookie的域名
			 * @param {String} cookie存放的路径
			 * @return {Boolean}
			 */
			set: function(name, value, hour, domain, path){
				if( hour ){
					var today  = new Date(),
						expire = new Date();
					expire.setTime(today.getTime() + 36E5 * hour);
				}
				document.cookie = name + "=" + encodeURI(value) + "; " + (hour ? "expires=" + expire.toGMTString() + "; " : "") + (path ? "path=" + path + "; " : "path=/; ") + (domain ? "domain=" + domain + ";" : "");
				return true;
			},
			
			/**
			 * 获取cookie
			 * @param {String} cookie的名称
			 * @return {String} cookie的值
			 */
			get: function( name ){
				var r = new RegExp("(?:^|;+|\\s+)" + name + "=([^;]*)"),
					m = document.cookie.match(r);
					
				return unescape(decodeURI(!m ? "" : m[1]));
			},
			
			/**
			 * 删除cookie
			 * @param {String} cookie的名称
			 * @param {String} cookie的域名
			 * @param {String} cookie存放的路径
			 */
			del: function(name, domain, path){
				document.cookie = name + "=; expires=Mon, 26 Jul 1997 05:00:00 GMT; " + (path ? "path=" + path + "; " : "path=/; ") + (domain ? "domain=" + domain + ";" : "");
			}
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
		},
		
		/**
		 * 获取鼠标位置
		 * @method model.ui.mousePosition
		 * @param {Object} event事件
		 * @return {Array} 返回鼠标的x、y轴：[positionX, positionY]
		 */
		mousePosition: function(e){
			e = e || window.event;
			
			var x = e.pageX || e.clientX + document.body.scrollLeft,
				y = e.pageY || e.clientY + document.body.scrollTop;
				
			return{
				positionX : x,
				positionY : y
			};
		},
		
		/**
		 * 判断是否宽屏
		 * @method model.ui.widescreen
		 * @return {Boolean} 
		 */
		widescreen: (function(){
			return (screen.width >= 1210);
		})(),
		
		/**
		 * onselectstart 选中处理
		 * @method model.ui.onselectstart
		 * @param {Object} jquery 对象
		 */
		onselectstart: function(obj){
			if( !obj || !obj.length ){ return false; }
			if( document.onselectstart !== undefined ){
				obj[0].onselectstart = function(){return false;};
			}else{
				obj.css({'-moz-user-select':'none'});
			}
			return obj;
		}
	};	
	
	return model;
});