(function(window,$,und){
	var sovs = {};
	var hb,$b,$win = $(window);
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
	function getViewportSize(w){ w = w || window; if (w.innerWidth != null) return { w: w.innerWidth, h: w.innerHeight }; var d = w.document; if (document.compatMode == "CSS1Compat") return { w: d.documentElement.clientWidth, h: d.documentElement.clientHeight }; return { w: d.body.clientWidth, h: d.body.clientHeight }; }
	/*helpers*/

	function ScrollOctoViewport($root,opt){
		if(!hb){hb = $('html,body');}
		if(!$b){$b = $('body');}
		var z = this;
		z.$root = $root;
		if(opt){$.extend(z,opt);}
		var t = new Date().getTime(); while(sovs['sov_'+t]){ t--; }
		z._id = 'sov_' + t; sovs[z._id] = z;

		z.$items = z.$root.find(z.items);
		z.resizeHandler();

		hb.on('resize.'+z._id,function(e){z.resizeHandler(e);});
	}
	function sov(opt){ return new fn.init(this,opt); }
	var fn = {
		init:ScrollOctoViewport
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
			var z = this,vp = getViewportSize();

			z.sizeX = $win.innerWidth();
			z.sizeY = $win.innerHeight();

			z.$items.each(function(){
				this.style.width = z.sizeX + 'px';
				this.style.height = z.sizeY + 'px';
				this.style.padding = 0 + 'px';
				this.style.margin = 0 + 'px';
				this.style.border = 'none';
			});

			z.start = z.$root.offset().top;
			// change page dim
			// change checkpoints
		}
		, wheelHandler:function(e){}
		, keyboardHandler:function(e){}
		, touchHandler:function(e){}
		, hashHandler:function(e){}
	};
	$.extend(fn.init.prototype,fn);
	$.fn.sov = sov;
})(window,jQuery);
