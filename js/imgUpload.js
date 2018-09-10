/**
 * [图片上传]
 * @author linkun 2018-02-13
 * @param  {[object]} target [绑定元素]
 * @param  {[int]} maxSize [最大上传大小]
 * @param  {[function]} success [成功回调函数]
 * @return {[object]}    [图片url和blob对象]
 */
/*exp:
ImgUpload({
    target:$('#upload'),
    success:function(data){
    }
}*/
define(function(){
    var ImgUpload = function(options){
        if(!(this instanceof ImgUpload)) return new ImgUpload(options);
        this.target     = options.target  || "input[type='file']";
        this.maxSize    = options.maxSize || 500;
        this.success    = options.success || '';
        this.init();
    };
    ImgUpload.prototype = {
        //初始化
        init:function(){
            this.eventChange();
        },
        //绑定上传
        eventChange:function(){
            var compressSize = 300 * 1024,//超过300k进行压缩
                _this = this;
            $(this.target).on('change', function(){
                var file = this.files[0],
                    reader = new FileReader();
                //验证
                if(!file){
                    return false;
                }else if(file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/gif') {
                    alert('请上传有效的图片文件!');//替换弹窗提示
                    return false;
                }else if(Math.round(file.size / 1024 * 100) / 100 > _this.maxSize){
                    alert('上传的文件超出限制的大小!');//替换弹窗提示
                    return false;
                }
                //获取到base64的图片
                reader.readAsDataURL(file);
                reader.onload = function(e){
                    var result  =　this.result,
                        data    = {};
                    //大于300k图片进行压缩
                    if(result.length >= compressSize){
                        var img = new Image();
                        img.src = result;
                        img.onload = function(){
                            var src = this.compress(img,0.8,100);
                            data.src = src;
                            data.uploadSrc = _this.dataURLtoBlob(src);
                            if(_this.success instanceof Function){
                                _this.success(data);
                            }
                        }
                    }else{
                        data.src = result;
                        data.uploadSrc = _this.dataURLtoBlob(result);
                        if(_this.success instanceof Function){
                            _this.success(data);
                        }
                    }
                }
            });
        },
        /**
         * [compress 压缩图片]
         * @param  {[dom]} sourceImg [图片dom]
         * @param  {[int]0-1} scale     [缩小的尺寸比例]
         * @param  {[int]0-100} quality   [清晰质量]
         * @return {[object]}           [图片源]
         */
        compress:function(sourceImg,scale,quality){
            var area = sourceImg.width * sourceImg.height,//源图片的总大小
                height = sourceImg.height * scale,
                width = sourceImg.width * scale,
                compressCvs = document.createElement('canvas');//压缩的图片画布
            //压缩的图片配置宽高
            compressCvs.width = width;
            compressCvs.height = height;
            var compressCtx = compressCvs.getContext("2d");
            //解决ios 图片大于2000000像素无法用drawImage的bug
            if(area > 2000000 && navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)){
                //瓦片绘制
                var smallCvs = document.createElement("canvas"),
                    smallCtx = smallCvs.getContext("2d"),
                    count = Math.ceil(area / 1000000),//分割的数量
                    cvsWidth = width / count,//每个小canvas的宽度
                    picWidth = sourceImg.width / count;//分割成小图片的宽度
                smallCvs.height = compressCvs.height;
                smallCvs.width =  width / count;
                //拼凑成大的canvas
                for(var i = 0;i < count;i ++){
                    smallCtx.drawImage(sourceImg,i*picWidth,0,picWidth,sourceImg.height,0,0,cvsWidth,height);
                    compressCtx.drawImage(smallCvs,i*cvsWidth,0,cvsWidth,height);
                }
            }else{
                compressCtx.drawImage(sourceImg,0,0,sourceImg.width,sourceImg.height,0,0,width,height);
            }
            //将canvas转换成base64
            return compressCvs.toDataURL('image/jpeg',quality/100);
        },
        //base64转化成Blob对象
        dataURLtoBlob:function(dataurl) {
            var arr = dataurl.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
            while(n--){
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new Blob([u8arr], {type:mime});
        }
    };
    return ImgUpload;
});