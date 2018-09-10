define(function(){
	/**
	 * [Upload 上传附件]
	 * @param  {[object]} options [参数对象]
	 * @param  options.target [验证表单id]
	 */
	var upload = {};//参数设置
	var Upload = function(options){
		if(!(this instanceof Upload)) return new Upload(options);
		upload 					= options;
		upload.target 			= upload.target || "input[type='file']";//上传控件
		upload.url 				= upload.url || '';//请求接口url
		upload.type 			= upload.type || '';//上传附件的类型
		upload.isShowProgress 	= upload.isShowProgress || false;//是否显示上传进度
		upload.maxSize 			= upload.maxSize || 500;//附件上传限制大小 单位kb
		this.init();
	}
	Upload.prototype = {
		//绑定dom
		bindEvent:function(){
			$(upload.target).on('change', function(){
				var _this 		= this;
					file 		= _this.files[0],
					size 		= Math.round(file.size / 1024 * 100) / 100,//单位kb
					formData 	= new FormData(),
					reader 		= new FileReader();
				//验证
				if(!file){
					return false;
                }
                if(size > upload.maxSize){
                	alert('上传的文件超出限制的大小');//替换弹窗提示
                	return false;
                }
                //验证文件的类型 todo
                var names 	= file.name.split('.'),
					fileType = names[names.length -1];
                if(upload.type&&fileType.indexOf(upload.type) < 0){
                	alert('上传的文件只能是' + upload.type);//替换弹窗提示
                    return false;
	            }

                //放入表单文档流
                formData.append(upload.name,file);
	            reader.onload = function(e){
                    // 实例化一个AJAX对象
                    var xhr = new XMLHttpRequest();
                    xhr.open("POST",upload.url,true);
                    // 发送表单数据
                    xhr.send(formData);
                    xhr.onreadystatechange = function(){
                      	if (xhr.readyState == 4 && xhr.status == 200){
                            var data = xhr.responseText;
                            if(upload.success instanceof Function){
								upload.success(JSON.parse(data));
                            }
                        }else{
                        	alert('上传出错');//替换弹窗提示
                        }
                    };

                    //显示进度条
                    if(isShowProgress){
						xhr.addEventListener('progress',function(e){
				            if (e.lengthComputable) {
								var percent = Math.floor(e.loaded / e.total * 100);
								if(percent <= 100) {
									$(".upload-progress").attr('value',percent);
									$(".progress-info").html('已上传：'+percent+'%');
								}
				              	if(percent >= 100) {
				                	$(".progress-info").html('文件上传完毕');
				              	}
				            }
				        }, false);
                    }
			    }
			});
		},

		//初始化
		init:function(){
			this.bindEvent();
		}
	}
	return Upload;
});