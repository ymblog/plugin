/**
* dialog 弹出窗控件
*/
define(['./model'], function(model){
	var dialog = {
		init: function(options){
			var o             = options || {},
				title         = o.title || '',
				text          = o.text || '',
				type          = o.type || '',                                     //错误类型
				html 		  = o.html || '',
				ok            = o.ok || '',
				no            = o.no || '',
				isShowBtn 	  = o.isShowBtn  === undefined ? true : o.isShowBtn,
				okText        = o.okText ? o.okText : '确认',
				noText        = o.noText ? o.noText : '取消',
				width 		  = o.width ? o.width : 300,
				isMask        = o.isMask === undefined  || o.isMask,               //是否允许遮罩
				isMaskClose   = o.isMaskClose === undefined || o.isMaskClose,      //是否点击遮罩关闭
				allowClose    = o.allowClose === undefined || o.allowClose,        //允许关闭
				allowEscClose = o.allowEscClose === undefined || o.allowEscClose,  //允许esc关闭
				timer         = '',
				wrapId        = 'l-dialog-wrap';
			var box = '';
				box += '<div class="l-dialog-wrap" id="'+ wrapId +'" style="width:'+ width +'px">';
				box	+= '<div class="l-dialog-main"><div class="l-dialog-content"><div class="l-dialog-text">'+ text +'</div></div></div>'
				box += '</div>';
			//载入容器
			model.ui.wrap();
			$('#l-ui-wrap').prepend(box);
			
			var dialogWrap    = $('#' + wrapId),
				dialogMain    = dialogWrap.find('.l-dialog-main'),
				dialogContent = dialogWrap.find('.l-dialog-content');
			/*标题*/
			if( title ){
				dialogMain.prepend('<div class="l-dialog-title">'+ title +'</div>');
			}	
			
			/*类型标识*/
			if( type ){
				dialogWrap.addClass('l-dialog-'+type);
			}
		
			/*遮罩*/
			if( isMask ){
				model.ui.lock();
			}

			/*按钮*/
			var btnMain = '';
			if(isShowBtn){
				btnMain = dialogMain.append('<div class="l-dialog-btn-wrap"></div>').find('.l-dialog-btn-wrap');
			}

			$('#' + wrapId).css({
				'transform':'scale(1,1)'
			});

			/*位置*/
			var win        = $(window),
				dialogIcon = dialogWrap.find('.l-dialog-icon'),
				dialogText = dialogWrap.find('.l-dialog-text'),
				_setSize   = function(){
					dialogWrap.css({
						top: ( win.height() - dialogWrap.height() )/2,
						left: ( win.width() - dialogWrap.width() )/2
					});
				}
			
			_setSize();	
			win.resize(_setSize);
			if(isShowBtn){
				btnMain.append('<a href="javascript:;" class="ui-btn l-dialog-cancel">'+ noText +'</a><a href="javascript:;" class="ui-btn l-dialog-ok">'+ okText +'</a>');
				btnMain.find('.l-dialog-ok').click(function(){
					model.ui.dialog.close();
					if( model.base.isFunction(ok) ){
						ok();
					}
				});
				btnMain.find('.l-dialog-cancel').click(function(){
					model.ui.dialog.close();
					if( model.base.isFunction(no) ){
						no();
					}
				});
			}
			if(type === 'html'){
				dialogContent.append(html);
			}
			

			/*关闭*/
			if( allowClose ){
			
				/*添加关闭按钮*/
				dialogMain
					.prepend('<div class="l-dialog-close"><i class="icon icon-close" title="关闭"></i></div>')
					.find('.l-dialog-close')
					.click(function(){
						model.ui.dialog.close();
					});
			
				/*esc退出*/
				if( allowEscClose ){
					var _modalKey = function (e){
						e = e || event;
						var code = e.which || event.keyCode;
						if(code === 27){
							model.ui.dialog.close();
						}
					};
					
					if(document.attachEvent){
						document.attachEvent('onkeydown', _modalKey);
					}else{
						document.addEventListener('keydown', _modalKey, true);
					}
				}
			}
		},
		
		/**
		* 关闭释放
		* @member model.ui.dialog
		* @param {Object} options drag参数
		*/
		close: function(id){
			$('#l-ui-wrap').html('');
			timer&&clearTimeout(timer);
			if( !$('.l-ui-mask').length ){
				model.ui.unlock();
			}
		},
		
		/**
		* 弹窗
		* @member model.ui.dialog
		* @param {Object} options 弹窗参数
		*/
		layer:function(options){
			var _this 		= this,
				o 			= options || {},
				endFn   	= o.endFn || '',
				showTime 	= o.showTime || 2000;     
			switch(o.type){
				case 'html'://html填充
					o.title = '信息';
					break;
				case 'confirm'://确认弹窗
					o.title = '确认信息';
					break;
				default://普通的提示
					o.title = '提示';
					o.isShowBtn = false;
					timer = setTimeout(function(){
						_this.close();
						if( endFn && typeof endFn === 'function' ){
							endFn();
						}
					},showTime);
				break;
			}
			this.init(o);
			return this;
		}
	};
	model.ui.dialog = dialog;
	return dialog;
});