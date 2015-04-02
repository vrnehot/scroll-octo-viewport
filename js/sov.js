(function(window,$,und){
	var sovs = {};
	var hb = $('html,body');
	function sov(opt){ return new fn.init(this,opt); }

	var fn = {
		init:function($root,opt){
			var z = this;
			z.$root = $root;
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
		, getMousePos:function(e){
			var pos = {
				x:
				, y:
			};

			return pos;
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
