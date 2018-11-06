/**
 * [轮播]
 * @author linkun 2018-02-13
 * @param  {[object]} target [绑定元素]
 * @param  {[string]} type [轮播类型]
 * @param  {[autoPlayTime]} int [自动滚动间隙时间]
 */
/*exp:
Slide({
    target:document.getElementById('slide'),
    type:'slide-x',
    autoPlayTime:3000
});
*/
define(function(){
    var Slide = function(options){
        if(!(this instanceof Slide)) return new Slide(options);
        this.target         = options.target || document.getElementById('slide');//目标对象
        this.type           = options.type || 'silde';//轮播类型
        this.showArrow      = options.showArrow || true;//是否显示箭头
        this.arrowWidth     = options.arrowWidth || 1200;//显示箭头的box宽度
        this.autoPlayTime   = options.autoPlayTime || 2000;//自动轮播时间
        this.$lists         = this.target.getElementsByTagName('li');//li doms
        this.$ctrls         = this.target.getElementsByTagName('i');//i doms
        this.len            = this.$lists.length;//数量
        this.index          = 0;
        this.init();
    };
    Slide.prototype = {
        init:function(){
            this.render();
            this.slide();
        },
        //配置html
        render:function(){
            var _this   = this,
                btn     = '<span class="pointer">';
            _this.addClass(_this.$lists[0],'selected');
            switch(_this.type){
                case 'slide-x':
                    _this.addClass(_this.target,'slide-x');
                    break;
                case 'slide-z':
                    _this.addClass(_this.target,'slide-z');
                    break;
            }
            //配置圆点
            for(var i = 0; i < _this.len; i++){
                if(i === 0){
                    btn += '<i class="selected"></i>';
                }else{
                    btn += '<i></i>';
                }
            }
            btn += '</span>';
            _this.target.innerHTML += btn;
            //显示箭头
            if(_this.showArrow){
                _this.target.innerHTML += '<a style="margin-left:'+ (-_this.arrowWidth / 2) +'px" href="javascript:;" class="slide-arrow left-arrow" id="left-arrow">‹</a><a style="margin-left:'+ (this.arrowWidth / 2 - 30) +'px" href="javascript:;" class="slide-arrow right-arrow" id="right-arrow">›</a>';
            }
        },
        //轮播动画
        slide:function(){
            var _this = this,
                timer = '';
            //左边箭头
            document.getElementById('left-arrow').addEventListener('click',function(){
                var resultIndex = _this.index == 0 ? _this.len - 1 : _this.index - 1;
                _this.reset(_this,resultIndex);
                _this.index = resultIndex;
            },false);
            //右边箭头
            document.getElementById('right-arrow').addEventListener('click',function(){
                resultIndex = _this.index == _this.len - 1 ? resultIndex = 0 : _this.index + 1;
                _this.reset(_this,resultIndex);
                _this.index = resultIndex;
            },false);
            //选中滑动 事件委托
            document.querySelector('.pointer').onclick = function(ev){
                var ev = ev || window.event;
                var target = ev.target || ev.srcElement;
                if(target.nodeName.toLocaleLowerCase() == 'i'){
                    var nodeIndex = Array.prototype.indexOf.call(_this.$ctrls,target);
                    _this.reset(_this,nodeIndex);
                    _this.index = nodeIndex;
                }
            }
            //自动滚动
            if(this.hasOwnProperty('autoPlayTime')){
                timer = setInterval(function(){
                    _this.index = _this.index == _this.len - 1 ?  0 : ++_this.index;
                    _this.reset(_this,_this.index);
                },_this.autoPlayTime);
            }
            this.target.addEventListener('mouseover',function(){
                clearInterval(timer);
            });
            this.target.addEventListener('mouseout',function(){
                timer = setInterval(function(){
                    _this.index = _this.index == _this.len - 1 ?  0 : ++_this.index;
                    _this.reset(_this,_this.index);
                },_this.autoPlayTime);
            });
        },
        //重置焦点样式
        reset:function(_this,index){
            _this.delClass(document.querySelector('li.selected'),"selected");
            _this.delClass(document.querySelector('i.selected'),"selected");
            _this.addClass(_this.$lists[index],"selected");
            _this.addClass(_this.$ctrls[index],"selected");
        },
        hasClass:function(object,clsname){
            var clsname = clsname.replace(".","");
            var sCls = " "+(object.className)+" ";
            return (sCls.indexOf(" "+clsname+" ") != -1) ? true : false;
        },
        toClass:function(str){
            var str = str.toString();
            str = str.replace(/(^\s*)|(\s*$)/g,"");
            str = str.replace(/\s{2,}/g," ");
            return str;
        },
        addClass:function(object,clsname){
            var clsname = clsname.replace(".","");
            if(!this.hasClass(object,clsname)){
                object.className = this.toClass(object.className+(" "+clsname));
            }
        },
        delClass:function(object,clsname){
            var clsname = clsname.replace(".","");
            if(this.hasClass(object,clsname)){
                object.className = this.toClass(object.className.replace(new RegExp("(?:^|\\s)"+clsname+"(?=\\s|$)","g")," "));
            }
        }
    }; 
    return Slide;
});