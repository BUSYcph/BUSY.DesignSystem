define(['jquery', 'velocity', 'settings'], function($, Velocity, settings) {

	var Accordion = function(element) {
		var instance = this;
		instance.element = element;
		instance.$element = $(element);
		instance.opened = [];

		instance.easing = settings.animationEasing;
		instance.speed = settings.animationSpeed;

		instance.offsetTop = instance.$element.offset().top;
		instance.headerHeight = $('.navigation--main').outerHeight();

		instance.init();

	};

	Accordion.prototype.init = function() {
		var instance = this;

		instance.$titles = jQuery('dt', instance.$element);

		instance.$titles.on('click', function() {
			var $me = $(this);
			var height = $me.next().find('.accordion__content').outerHeight();

			if($me.hasClass('accordion__term--is-open')) {
				$me.next().velocity({'height': 0}, instance.speed, instance.easing);
			}
			else {
				$me.next().velocity({'height': height}, instance.speed, instance.easing);
			}

			$me.toggleClass('accordion__term--is-open');

			instance.opened = [];
			instance.$element.find('.accordion__term--is-open').each(function() {
				var item = $(this).prev().attr('id');
				if (instance.opened.indexOf(item) === -1) {
					instance.opened.push(item);
				}
			});

			var opened = instance.opened.join(',').replace(new RegExp(',', 'g'), '|');
			if (history.pushState) {
				history.replaceState(null, null, '#accordion=' + opened);
			} else {
				location.hash = '#accordion=' + opened;
			}
		});
	};

	return Accordion;
});