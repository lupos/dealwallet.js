	// Slide object
	function Slide(name, details, code, expiration, code_url, applyCode, details_url, couponDetails, print_url, printCoupon, slideClass, slideClassDesc){
		this.name = name;
		this.details = details;
		this.code = code;
		this.expiration = expiration;
		this.code_url = code_url;
		this.applyCode = applyCode;
		this.details_url = details_url;
		this.couponDetails = couponDetails;
		this.print_url = print_url;
		this.printCoupon = printCoupon;
		this.slideClass = slideClass;
		this.slideClassDesc = slideClassDesc;
	}
	
	
	//viewmodel for slide ko binding
	function SlidesViewModel(){
		var self = this;
		this.slides = ko.observableArray([
			new Slide("$5 OFF", "any order of $40 or more", "Code: xxxxxxxx", "Expires: 12/31/12", "#", "apply code", "#", "see details", "#", "print", "slide"),
			new Slide("$15 off", "any order of $75 or more", "Code: xxxxxxxx", "Expires: 12/31/12", "#", "apply code", "#", "see details", "#", "print", "slide"),
			new Slide("$20 off", "any order of $100 or more", "Code: xxxxxxxx", "Expires: 12/31/12", "#", "apply code", "#", "see details", "#", "print", "slide"),
			new Slide("", "", "", "", "", "", "", "","" ,"", "slide empty", "")
		]);
		
		this.couponCode = ko.observable("");
               
                this.addCoupon = function(){
                                this.slides.unshift(new Slide("$5 off", "get $5 off your order"));
                                resetVars();
                };
                this.showCoupon = function(elem) {
                                if (elem.nodeType === 1) $(elem).hide().fadeIn()
                };
    this.hideCoupon = function(elem) {
                                if (elem.nodeType === 1) $(elem).fadeOut(function() { $(elem).remove(); })
                };
                this.ajaxTest = function(){
                                //alert(self.couponCode())
                                $.get("addCoupon.php?code=" + self.couponCode(), function(data){
                                                if(data.error !== '' && data.error !== undefined){
                                                                //alert(data.error)
                                                } else {                                                                                                 
                                                                self.slides.unshift(new Slide(data.name, data.details));
                                                                $('#Slides').data('TCPCouponWallet').resetVars("AddSlide");
                                                }
                                });
                };
};
ko.applyBindings(new SlidesViewModel());
 
 
 
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
            containerOverflow, leftOverflow, rightOverflow, prev, next, pagination, countIndicators;
       
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
                    break;
            }
        }
        plugin.prev = function(){
            if(leftOverflow < 0){
                slidesContainer.animate({left: (containerLeft + slideWidth)},300,function(){
                    plugin.resetVars('MoveSlides');
                    plugin.updatePagination();
                });
            }
        }
        plugin.next = function(){
            if(rightOverflow < 0){
                slidesContainer.animate({left: (containerLeft - slideWidth)},300,function(){
                    plugin.resetVars('MoveSlides');
                    plugin.updatePagination();         
                });
            }
        }
        var currentSlide;
        plugin.updatePagination = function(){
            countIndicators.removeClass("selected")
            currentSlide = Math.abs(leftOverflow / slideWidth);
            countIndicators.eq(currentSlide).addClass("selected");
        }

 
        // private methods
        // these methods can be called only from inside the plugin like:
        // methodName(arg1, arg2, ... argn)
        var resetVars = function() {
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
 
 
$('#Slides').TCPCouponWallet();
$('#Slides').data('TCPCouponWallet').resetVars("AddSlide");
 
 
 