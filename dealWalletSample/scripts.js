jQuery(document).ready(function($) {
	
	// Slide object
	function Slide(name, details, url){
		this.name = name;
		this.details = details;
		this.url = url;
	}


	//viewmodel for slide ko binding
	function SlidesViewModel(){
		var self = this;
		var Slides = $('#Slides');
		
		//place holder data. Replace with initial load
		this.slides = ko.observableArray([
			new Slide("half off", "get 50% off your order of 40$ or more", "http://www.google.com"),
			new Slide("10% off", "get 10% off your order of 20$ or more", "http://www.google.com"),
			new Slide("$10 off", "get $10 off your order", "http://www.google.com")
		]);
		//Makes the input observable and automatically updated
		this.couponCode = ko.observable("");
		
		//hides then fades in a new coupon. consider adding to deal wallet
		this.showCoupon = function(elem) { 
			if (elem.nodeType === 1) $(elem).hide().fadeIn() 
		};
		//fades out a coupon. intended for use when applying a coupon to a cart.
		//consider adding to deal wallet
	    this.hideCoupon = function(elem) {
			if (elem.nodeType === 1) $(elem).fadeOut(function() { $(elem).remove(); }) 
		};
		//ajax method to check a code and add the coupon to the deal wallet.
		//todo make url a variable. uncouple on success function calls?
		this.ajaxTest = function(){
			$.get("addCoupon.php?code=" + self.couponCode(), function(data){
				if(data.error !== '' && data.error !== undefined){
					log(data.error)
				} else {			
					Slides.data('TCPCouponWallet').reScroll( function(){
						addSlide(data.name, data.details);
						Slides.data('TCPCouponWallet').resetVars("AddSlide");
					});
				}
			});
		};
		//actually adds the new slide/coupon to the array and dom
		var addSlide = function(name, details){
			self.slides.unshift(new Slide(name, details));
			Slides.data('TCPCouponWallet').resetVars("AddSlide");
		};
	};
	//initialze knockout bindings
	ko.applyBindings(new SlidesViewModel());
	
	//Initialize DealWallet
	$('#Slides').TCPCouponWallet();
	
	
	//SITE RESIZE
	//applies a size class to a target element allowing easy css dev
	//probably replace with media queries
	
	//only called at certain threshholds 
	var resizeSite = function(target, size){
		//assumes classes exist rather than waisting time checking
		//i think this is faster but if this becomes permanent test for performance
		target.removeClass("small medium large");
		target.addClass(size);
		$("#Slides").data('TCPCouponWallet').resetVars('Resize');
	};
	//called frequently so only used to check info, not to update the dom which is slow
	var content = $("#Content");
	var resizeCheck = function(){
		windowWidth = $(window).width();	
		//check width AND for presence of class to avoid unnecesary dom updates
		if(windowWidth < 1170 && !content.hasClass("small")){
			resizeSite(content, "small")
		}
		if(windowWidth >= 1170 && windowWidth< 1400 && !content.hasClass("medium")){
			resizeSite(content, "medium");
		}
		if(windowWidth >= 1400 && !content.hasClass("large")){
			resizeSite(content, "large");
		}
	}
	//called very frequently
	$(window).resize(function(){
		resizeCheck();
		$('#UpSell').html($(window).width());
	});
	resizeCheck();
});