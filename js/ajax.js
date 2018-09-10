var Ajax = function(){
    function request(url,opt){
        var async   = opt.async !== false,
            method  = opt.method    || 'GET',
            encode  = opt.encode    || 'UTF-8',
            data    = opt.data      || null,
            method  = method.toUpperCase(); 
        if(data && typeof data == 'object'){//对象转换成字符串键值对
            data = serialize(data);
        }
        if(method == 'GET' && data){
            url += (url.indexOf('?') == -1 ? '?' : '&') + data;
            data = null;
        }
        return new Promise(function(resolve,reject){
            var xhr = window.XMLHttpRequest ? new XMLHttpRequest() : new ActiveXObject('Microsoft.XMLHTTP');
            xhr.onreadystatechange = function(){
                var readyState = this.readyState;
                if(readyState == 4){
                    var status = this.status;
                    if(status >= 200 && status < 300){
                        resolve(JSON.parse(this.response));
                    }else{
                        reject(JSON.parse(this.response));
                    }
                } 
            };
            xhr.open(method,url,async);
            if(method == 'POST'){
                xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded;charset=' + encode);
            }
            xhr.setRequestHeader('If-Modified-Since', '0');   
            xhr.setRequestHeader('Cache-Control', 'no-cache');  
            xhr.send(data);
        });
    }
    function serialize(obj){
        var a = [];
        for(var k in obj){
            var val = obj[k];
            if(val.constructor == Array){
                for(var i = 0,len = val.length;i<len;i++){
                    a.push(k + '[]=' + encodeURIComponent(val[i]));
                }
            }else{
                a.push(k + '=' + encodeURIComponent(val));
            }
        }
        return a.join('&');
    }
    return {request:request};
}();