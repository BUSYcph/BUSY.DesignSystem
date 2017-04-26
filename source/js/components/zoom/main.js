define(['jquery'], function($) {
	var Zoom = function(element) {
		var instance = this;
		instance.element = element;
		instance.$element = $(element);

		// Start the animation when element is fx 200px inside viewport
		instance.offset = 0;

		instance.init();

	};

	Zoom.prototype.init = function() {
		var instance = this;
		var el = instance.$element;

		// Set initial visibility if outside viewport
		if (instance.isElementInViewport(el)) {
			el.closest('.section').removeClass('section--zoom');
		}

		// Listen for events and visibility change
		$(window).on('resize scroll', function() {
			if (instance.isElementPartiallyInViewport(el)) {
				el.closest('.section').removeClass('section--zoom');
				console.log('isElementPartiallyInViewport');
			}
		}); 
	};

	Zoom.prototype.isElementInViewport = function (el) {

		//special bonus for those using jQuery
		if (typeof jQuery !== 'undefined' && el instanceof jQuery) el = el[0];

		var rect = el.getBoundingClientRect();
		var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
		var windowWidth = (window.innerWidth || document.documentElement.clientWidth);

		return (
			(rect.left >= 0)
			&& (rect.top >= 0)
			&& ((rect.left + rect.width) <= windowWidth)
			&& ((rect.top + rect.height) <= windowHeight)
		);
	};

	Zoom.prototype.isElementPartiallyInViewport = function (el) {
		var instance = this;

		//special bonus for those using jQuery
		if (typeof jQuery !== 'undefined' && el instanceof jQuery) el = el[0];

		var rect = el.getBoundingClientRect();
		var windowHeight = (window.innerHeight || document.documentElement.clientHeight);
		var windowWidth = (window.innerWidth || document.documentElement.clientWidth);

		var vertInView = (rect.top <= windowHeight - instance.offset) && ((rect.top + rect.height) >= 0);
		var horInView = (rect.left <= windowWidth) && ((rect.left + rect.width) >= 0);

		return (vertInView && horInView);
	};


	return Zoom;
});