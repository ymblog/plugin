define(function(){
	/**
	 * [Validate 验证表单]
	 * @param  {[object]} options [参数对象]
	 * @param  options.target [验证表单id]
	 */
	var Validate = function(options){
		if(!(this instanceof Validate)) return new Validate(options);
		this.options = options;
		this.init();
	}
	Validate.prototype = {
        //验证数据
        verify:function(str, type){
			var rule = '',
				result = true,
				str = $.trim(str);
			switch(type){
				case 'mobile'://验证手机格式
					rule = /^((\+?86)|(\(\+86\)))?(((1[3,4,5,7,8][0-9]))\d{8})$/;
					break;
				case 'chinese'://验证中文真实性
					rule = /[\u4e00-\u9fa5]/gm;
					break;
				case 'number'://验证数字
					rule = /^[0-9]*$/;
					break;
				case 'idCard'://验证身份证
					rule = /^(\d{15}|\d{17}[\dx])$/;
					break;
				case 'email': //验证邮箱
					rule = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/;
					break;
				case 'image'://验证图片的格式
					rule = /\.(gif|jpg|jpeg|png|GIF|JPG|PNG)$/;
					break;
				case 'special'://验证不能含有特殊字符
					rule = /[`|~!@#\$%\^\&\*\(\)_\+<>\?:"\{\},\.\\\/;'\[\]=、【】，。/-]/;
					if(str.match(rule)){
						return false;
					} else {
						return true
					}
					break;
			}
			if(!str.match(rule)){
				result = false;
			}
			return result;
		},

		//提交验证
		submitVerify:function(){
			var that = this;
			$(that.options.target).find('[data-validate]').each(function(){
				var _this = $(this);
				that.verifyRender(_this,_this.val(),_this.data('validate-result'));
			});
		},

		//配置验证结果
		verifyAll:function(_this){
			var	that = this,
				val = _this.val(),
				result = true,
				validates = _this.data('validate').split(';');
			for(var index = 0;index < validates.length;index ++ ){
				if(validates[index] !== 'required'){
					result = that.verify(val,validates[index]);
				}
				//一项验证错误或者最后一项
				if(!result || index === validates.length - 1){
					_this.data('validate-result',result);
					that.verifyRender(_this,val,result);
					return false;
				}
			}
		},
		
		//渲染更新dom
		verifyRender:function(_this,val,result){
			$message = _this.siblings('.ui-form-message');
			if(_this.data('validate').indexOf('required') > -1 && val == ''){
				$message.html('请输入' + _this.data('validate-text')).fadeIn(500);
				_this.addClass('l-form-error');
			}else if(!result){
				$message.html('请输入正确的' + _this.data('validate-text')).fadeIn(500);
				_this.addClass('l-form-error');
			}else{
				$message.html('');
				_this.removeClass('l-form-error');
			}	

			//复选框渲染
			if(_this.attr('type') == 'checkbox' && _this.data('validate').indexOf('required') > -1 && !_this.is(':checked')){
				$message.html('请输入' + _this.data('validate-text')).show();
				_this.addClass('l-form-error');
			}
		},

		//绑定dom
		bindHander:function(){
			var that = this;
			$(that.options.target).on('blur','[data-validate]',function(){
				that.verifyAll($(this));
			})
			.on('submit',function(){
				that.submitVerify();
				return false;
			})
			.on('change','select[data-validate],input[type="checkbox"][data-validate]', function(e) {
                that.verifyAll($(this));
                return false;
            });
		},

		//初始化
		init:function(){
			this.bindHander();
		},
	}
	return Validate;
});