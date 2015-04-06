(function(window,$,und){
	var sovs = {};
	var hb,$b,$win = $(window),$doc = $(document);
	var isTouchDevice = /(iPhone|iPod|iPad|Android|playbook|silk|BlackBerry|BB10|Windows Phone|Tizen|Bada|webOS|IEMobile|Opera Mini)/.test(navigator.userAgent);
	var isFF = /firefox/i.test(navigator.userAgent);
	var isIE = /msie|trident/i.test(navigator.userAgent);
	var isTouch = (('ontouchstart' in window) || (navigator.msMaxTouchPoints > 0) || (navigator.maxTouchPoints));

	/*helpers*/
	function isReallyTouch(e){ return e.pointerType === und || e.pointerType != 'mouse'; }
	function getMousePos(e){
		var pos = {
			x:(e.pageX !== und ? e.pageX : e.touches[0].pageX)
			, y:(e.pageY !== und ? e.pageY : e.touches[0].pageY)
		};
		if(isTouch/* && isReallyTouch(e)*/){
			pos.x = e.touches[0].pageX;
			pos.y = e.touches[0].pageY;
		}
		return pos;
	}
	function getViewportSize(w){ w = w || window; if (w.innerWidth != null) return { w: w.innerWidth, h: w.innerHeight }; var d = w.document; if (document.compatMode == "CSS1Compat") return { w: d.documentElement.clientWidth, h: d.documentElement.clientHeight }; return { w: d.body.clientWidth, h: d.body.clientHeight }; }
	function getPageScroll(){ return { x:window.pageXOffset || document.documentElement.scrollLeft || 0, y:window.pageYOffset || document.documentElement.scrollTop || 0 }; }
	function adeb(text){ $('#reklama-menu').html('<span style="color:#fff;font-size: 48px;line-height:1.2">'+text+'</span>'); }
	/*helpers*/

	function ScrollOctoViewport($root,opt){
		if(!hb){hb = isFF || isIE ? $('html') : $('body');}
		if(!$b){$b = $('body');}
		var z = this;
		z.$root = $root;
		if(opt){$.extend(z,opt);}
		var t = new Date().getTime(); while(sovs['sov_'+t]){ t--; }
		z._id = 'sov_' + t; sovs[z._id] = z;

		z.$items = z.$root.find(z.items);
		z.resizeHandler();

		z.resizeInterval = setInterval(function(){z.resizeHandler();},1000);
		$win.on('resize.'+z._id,function(e){z.resizeHandler(e);});
		$win.on('scroll.'+z._id,function(e){z.inactiveHandler(e);});
		$win.on('touchmove.'+z._id+'inactive',function(e){z.inactiveHandler(e);});
		z.inactiveHandler();

		if(!isTouchDevice && !isTouch){
			$win.on('mousedown.'+z._id,function(e){
				if(e.target == document.documentElement){
					z.fixMode = true;
					t = setInterval(function(){z.scrollbarHandler();},16);
					$win.on('mouseup.'+z._id+'scrollFix',function(e){
						clearInterval(t);
						$win.off('mouseup.'+z._id+'scrollFix');
						z.fixMode = false;
						z.dontSkipSame = true;
						z.inactiveHandler();
						z.dontSkipSame = false;
					});
				}
			});
		}

		z.$root.trigger('octoScrollInit',[z]);
	}
	function sov(opt){ return new fn.init(this,opt); }
	var fn = {
		init:ScrollOctoViewport
		, getInstance:function(id){
			var z = this;
			if(id){ return sovs[id]; }
			else{ return z; }
		}
		, scrollNow:function(top){
			var z = this;
			if(z.scrollInner){ z.$root.scrollTop(top); }
			else{ hb.scrollTop(z.start+top); }
		}
		, scrollTo:function(val,cb,fake){
			var z = this;
			if(isNaN(val)){ /* itNAN =) */ return; }

			if((val == z.currentPage) && !z.dontSkipSame){ return; }
			if(val > z.currentPage){ z.currentAnimation = 1; }
			if(val < z.currentPage){ z.currentAnimation = -1; }

			var oldPage = z.currentPage;
			z.$root.trigger('octoScrollStart',[z,oldPage,val]);
			z.$items.eq(oldPage).trigger('octoScrollPageLeave',[z,z.val]);

			z.currentPage = val;

			if(fake){
				z.currentAnimation = null;
				if(z.currentPage < 0){ z.currentPage = -Infinity; z.leaveArea(); }
				if(z.currentPage > (z.$items.length - 1)){ z.currentPage = Infinity; z.leaveArea(); }
				if(z.currentPage != Infinity && z.currentPage != -Infinity){
					z.$root.trigger('octoScrollEnd',[z,oldPage,z.currentPage]);
					z.$items.eq(z.currentPage).trigger('octoScrollPageEnter',[z,oldPage]);
				}
				if(cb){cb();}
				return;
			}

			hb.clearQueue().animate({scrollTop:z.start + (val*z.sizeY)},{
				duration:z.scrollSpeed
				, complete:function(){
					z.currentAnimation = null;
					if(z.currentPage < 0){ z.currentPage = -Infinity; z.leaveArea(); }
					if(z.currentPage > (z.$items.length - 1)){ z.currentPage = Infinity; z.leaveArea(); }
					if(z.currentPage != Infinity && z.currentPage != -Infinity){
						z.$root.trigger('octoScrollEnd',[z,oldPage,z.currentPage]);
						z.$items.eq(z.currentPage).trigger('octoScrollPageEnter',[z,oldPage]);
					}
					if(cb){cb();}
				}
			});
		}
		, scrollDown:function(){
			var z = this;
			if(z.currentAnimation == 1){ return; }
			z.scrollTo(z.currentPage + 1);
		}
		, scrollUp:function(){
			var z = this;
			if(z.currentAnimation == -1){ return; }
			z.scrollTo(z.currentPage - 1);
		}
		, forceHash:function(){}
		, forceTo:function(to){
			var z = this,last = z.$items.length - 1;
			if(to >= z.end){
				z.scrollTo(last,null,true);
				z.scrollTo(last+1,null,true);
				hb.clearQueue().animate({scrollTop:to},{duration:dur || 100});
			}
			else{
				z.scrollTo(0,null,true);
				z.scrollTo(-1,null,true);
				hb.clearQueue().animate({scrollTop:to},{duration:dur || 100});
			}
		}
		, forceTop:function(dur){
			var z = this;
			z.scrollTo(0,null,true);
			z.scrollTo(-1,null,true);
			hb.clearQueue().animate({scrollTop:0},{duration:dur || 100});
		}
		, forceBottom:function(dur){
			var z = this, last = z.$items.length - 1;
			z.scrollTo(last,null,true);
			z.scrollTo(last+1,null,true);
			hb.clearQueue().animate({scrollTop:hb.height()},{duration:dur || 100});
		}
		, enterArea:function(){
			var z = this,page;
			var innah;
			z.inactive = false;
			if(isTouchDevice && isTouch){
				$win.on('touchstart.'+z._id,function(e){z.touchHandler(e.originalEvent);});
			}
			else{
				z.$root.on('wheel.'+z._id,function(e){z.wheelHandler(e);});
				z.$root.on('mousewheel.'+z._id,function(e){z.wheelHandler(e);});
				$doc.on('keydown.'+z._id,function(e){z.keyboardHandler(e);});
			}

			// начальные установки
			z.$root.trigger('octoScrollEnter',[z,z.currentPage]);
			z.scrollTo(z.getPageInViewport());

			/* задержка дабы страницы не скакали сразу после входа */
			z.pause = true; setTimeout(function(){ z.pause = false; },z.enterDelay);
		}
		, leaveArea:function(){
			var z = this;
			z.inactive = true;
			if(isTouchDevice && isTouch){ $win.off('touchstart.'+z._id); }
			else{
				z.$root.off('wheel.'+z._id);
				z.$root.off('mousewheel.'+z._id);
				$doc.off('keydown.'+z._id);
			}

			z.$root.trigger('octoScrollLeave',[z,z.currentPage]);
			z.pause = true; setTimeout(function(){ z.pause = false; },z.enterDelay);
		}
		, inArea:function(st){
			var z = this;
			return (z.start - (z.sizeY / 2) ) + 1 <= st && st < z.end - (z.sizeY / 2) ;
		}
		, inyan:function(){
			var z = this;
			if( getPageScroll().y + z.sizeY > z.end - ((z.end - z.start) / 2) ){ return Infinity; }
			else{ return -Infinity; }
		}
		, getPageInViewport:function(){
			var z = this,ps = getPageScroll();
			var tmp = parseInt((ps.y - z.start + 1) / z.sizeY);
			return tmp;
		}
		, resizeHandler:function(){
			var z = this;

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
			z.end = z.start + (z.$items.length * z.sizeY);
		}
		, wheelHandler:function(e){
			var z = this;
			console.info('mouseWheel')
			if(z.fixMode){ return; }
			e.preventDefault();
			var value = e.originalEvent.wheelDelta || -e.originalEvent.deltaY || -e.originalEvent.detail;
			var delta = Math.max(-1, Math.min(1, value)) * -1;
			if(!z.pause){
				if(delta > 0){ z.scrollDown(); }
				else{ z.scrollUp(); }
			}
		}
		, keyboardHandler:function(e){
			var z = this,ae = window.document.activeElement,keyCode = e.which,shift = e.shiftKey;
			clearTimeout(z.keyboardTimeout);
			console.info(keyCode);
			if(z.fixMode){ return; }
			if( !(/textarea|input|select/i.test(ae.tagName)) ){
				if(/40|38|32|33|34|36|35/.test(keyCode)){ e.preventDefault(); }
				setTimeout(function(){
					switch(keyCode){
						case 38:
						case 33:
							z.scrollUp();
						break;
						case 32:
							if(shift){ z.scrollUp(); break; }
						case 40:
						case 34:
							z.scrollDown();
						break;

						case 36:
							z.forceTop();
						break;

						case 35:
							z.forceBottom();
						break;
					}
				},100);
			}
		}
		, touchHandler:function(e){
			var z = this,tp;
			if(z.touchnow/* || !isReallyTouch(e)*/){ return; }
			tp = getMousePos(e);
			z.oldTouch = tp.y;
			$win.on('touchmove.'+z._id,function(e){
				e.preventDefault();
				var ttp = getMousePos(e.originalEvent);
				if(Math.abs(ttp.y - tp.y) < 100){ return; }
				var delta = Math.max(-1, Math.min(1, ttp.y - z.oldTouch)) * -1;
				if(!z.pause){
					if(delta > 0){ z.scrollDown(); }
					else{ z.scrollUp(); }
				}
			});
			$win.on('touchend.'+z._id,function(e){
				$win.off('touchmove.'+z._id);
				$win.off('touchend.'+z._id);
				z.touchnow = false;
			});
			z.touchnow = true;
		}
		, hashHandler:function(e){
			var z = this;
			if(z.fixMode){ return; }
		}
		, scrollbarHandler:function(){
			var z = this,st = getPageScroll().y, page;
			if(st < z.start && z.fixState != 'ue'){ z.scrollTo(-1,null,true); z.fixState = 'ue'; z.$root.trigger('octoScrollLeave',[z,z.currentPage]); }
			else if(st > z.end - (z.sizeY * 2) && z.fixState != 'shita'){ z.scrollTo(z.$items.length,null,true); z.fixState = 'shita'; z.$root.trigger('octoScrollLeave',[z,z.currentPage]); }
			else if(st >= z.start && st <= z.end - (z.sizeY * 2)){
				page = z.getPageInViewport();
				z.scrollTo(page,null,true);
				if(z.fixState != 'naka'){
					z.fixState = 'naka'; z.$root.trigger('octoScrollEnter',[z,z.currentPage]);
				}

			}
		}
		, inactiveHandler:function(e){
			var z = this;
			if(z.pause || z.fixMode){ return; }
			if(z.inactive){
				if(z.inArea(getPageScroll().y)){ z.enterArea(); }
				else if(z.currentPage == und){ z.currentPage = z.inyan(); }
			}
		}
		, setPage:function(page){
			var z = this;
			z.currentPage = page;
		}
	};
	var defaults = {
		scrollSpeed:700
		, enterDelay:500
		, inactive:true
	};
	$.extend(fn.init.prototype,fn);
	$.extend(fn.init.prototype,defaults);
	$.fn.sov = sov;
	window.sovs = sovs;
})(window,jQuery);
