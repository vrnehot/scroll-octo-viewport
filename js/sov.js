(function(window,$,und){
	var sovs = {};
	var hb = $('html,body');
	var isTouchDevice = /(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/.test(navigator.userAgent);
	var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));

	/*helpers*/
	function isReallyTouch(e){ return e.pointerType === und || e.pointerType != 'mouse'; }
	function getMousePos(e){
		var pos = {
			x:(e.pageX !== und ? e.pageX : e.touches[0].pageX)
			, y:(e.pageY !== und ? e.pageY : e.touches[0].pageY)
		};
		if(isTouch && isReallyTouch(e)){
			pos.x = e.touches[0].pageX;
			pos.y = e.touches[0].pageY;
		}
		return pos;
	}
	/*helpers*/


	function sov(opt){ console.info('Я ващет работаю'); return new fn.init(this,opt); }
	var fn = {
		init:function(root,opt){
			console.info('Сомнения ',z.root);
			var z = this;
			z.root = root;
			z.$root = $(root);
			if(opt){$.extend(z,opt);}
			var t = new Date().getTime(); while(!sovs['sov_'+t]){ t--; }
			z._id = 'sov_' + t; sovs[z._id] = z;
		}
		, getInstance:function(id){
			if(id){ return sovs[id]; }
			else{ return z; }
		}
		, scrollNow:function(top){
			var z = this;
			if(z.scrollInner){ z.$root.scrollTop(top); }
			else{ hb.scrollTop(z.start+top); }
		}
		, resizeHandler:function(){
			// change page dim
			// chane checkpoints
		}
		, wheelHandler:function(e){}
		, keyboardHandler:function(e){}
		, touchHandler:function(e){}
		, hashHandler:function(e){}
	};
	$.extend(fn.init.prototype,fn);
	$.fn.sov = sov;
})(window,jQuery);
