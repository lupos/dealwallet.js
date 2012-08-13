(function($) {
    $.TCPCouponWallet = function(element, options) {
        // plugin's default options
        var defaults = {
            slideName: '.slide'
        }
        var plugin = this;
        plugin.settings = {}

        var $element = $(element), // reference to the jQuery version of DOM element
             element = element;    // reference to the actual DOM element

		var slidesContainer, slides, slideWidth, containerWidth, containerLeft,
			containerOverflow, leftOverflow, rightOverflow, prev, next, pagination, countIndicators, currentSlide;
		
        // the "constructor" method that gets called when the object is created
        plugin.init = function() {
			plugin.settings = $.extend({}, defaults, options);
			
			//setup slides
			slidesContainer = $element.find("#SlidesContainer");
			slides = $element.find(plugin.settings.slideName);
			slideWidth = slides.outerWidth( true );
			containerWidth = slideWidth * slides.length;
			slidesContainer.width(containerWidth);
			containerLeft = parseInt(slidesContainer.css("left"));
			containerOverflow = ($element.width() - slidesContainer.width());
			leftOverflow = containerLeft;
			rightOverflow = containerOverflow - leftOverflow;
			
			//setup prev/next buttons
			prev = $element.parent().find(".prev");
			next = $element.parent().find(".next");
			prev.on("click", function(){
				plugin.prev();
			});
			next.on("click", function(){
				plugin.next();
			});
			//initialize show hide button
			plugin.showHideButtons();
			
			
			//setup pagination
			pagination = $(".dealWalletCounter");
			countIndicators = pagination.children();
			
			plugin.updatePagination();
        }

        // public methods
        // plugin.methodName(arg1, arg2, ... argn) from inside the plugin
        // element.data('pluginName').publicMethod(arg1, arg2, ... argn) from outside
        plugin.resetVars = function(group) {	
			switch (group){
				case 'MoveSlides':
					containerLeft = parseInt(slidesContainer.css("left"));					
				case 'AddSlide':
					slides = $element.find(plugin.settings.slideName);
					containerWidth = slideWidth * slides.length;
					countIndicators = pagination.children();
					plugin.updatePagination();
				case 'RemoveSlide':
					slides = $element.find(plugin.settings.slideName);
					containerWidth = slideWidth * slides.length;
					countIndicators = pagination.children();
				case 'Resize' :
					containerLeft = parseInt(slidesContainer.css("left"));
					
				default:
					slidesContainer.width(containerWidth);
					containerOverflow = ($element.width() - slidesContainer.width());
					leftOverflow = containerLeft;
					rightOverflow = containerOverflow - leftOverflow;
					
					plugin.showHideButtons();
				break;
			};
        };
		//shift coupons 1 step to the left
		plugin.prev = function(){
						log(leftOverflow);
			if(leftOverflow < 0){
				slidesContainer.animate({left: (containerLeft + slideWidth)},300,function(){
					plugin.resetVars('MoveSlides');
					plugin.updatePagination();
				});
			};
		};
		//shift coupons 1 step to the right
		plugin.next = function(){
						log(leftOverflow);
			if(rightOverflow < 0){
				slidesContainer.animate({left: (containerLeft - slideWidth)},300,function(){
					plugin.resetVars('MoveSlides');
					plugin.updatePagination();
				});
			}
		};
		//call after all changes to reset the pagination widget
		plugin.updatePagination = function(){
			countIndicators.removeClass("selected")
			currentSlide = Math.abs(leftOverflow / slideWidth);
			countIndicators.eq(currentSlide).addClass("selected");
		};
		//show/hide the prev & next buttons when they are (not) needed.
		plugin.showHideButtons = function(){
			if(rightOverflow == 0){
				next.hide();
			} else {
				next.show();
			}
			if(leftOverflow == 0){
				prev.hide();
			} else {
				prev.show();
			}
		};
		
		//slides coupon display back to begin so the user can see the added coupon appear
		//accepts a call back so the "show" animation doesn't begin untill it is on screen
		var duration = 0;
		plugin.reScroll = function(callback){
			if(leftOverflow != 0){
				duration = 300;
			} else {
				duration = 0;
			};
			slidesContainer.width(slidesContainer.width + slideWidth).animate({'left':0},{duration:duration,complete:function(){
				if($.isFunction(callback)){
					callback.call(this);
				};
			}});
		};


        // private methods
        // these methods can be called only from inside the plugin like:
        // methodName(arg1, arg2, ... argn)
        var placeHolder = function() {
			//code goes here
        }
        plugin.init();
    }
    $.fn.TCPCouponWallet = function(options) {
        return this.each(function() {
            if (undefined == $(this).data('TCPCouponWallet')) {
                var plugin = new $.TCPCouponWallet(this, options);
                $(this).data('TCPCouponWallet', plugin);
            }
        });
    }
})(jQuery);