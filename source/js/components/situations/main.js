define(['jquery', 'velocity', 'settings'], function ($, Velocity,  settings) {
	var Situations = function (element) {
		var instance = this;
		instance.element = element;
		instance.$element = $(element);

		instance.minHeight;
		instance.maxHeight;
		instance.nocontentHeight;

		instance.$showmore = instance.$element.find('.js-section__cta-more');
		instance.showrows = instance.$element.data('showrows');

		instance.easing = settings.animationEasing;
		instance.speed = settings.animationSpeed;

		instance.init();

	};

	Situations.prototype.init = function() {
		var instance = this;

		// Hide the show more icon if there are too few items
		if(instance.$element.children('.row').length <= instance.showrows) {
			instance.$showmore.hide();
		}

		// Get the nocontent height of the container and store it
		instance.nocontentHeight = instance.getNocontentHeight();

		// Get the initial height of the container and set it explicitly
		instance.minHeight = instance.$element.outerHeight();
		instance.$element.css('height', instance.minHeight);

		// Reset height on subitems but keep them hidden
		instance.$element.find('.situation__container').removeClass('situation__container--hide');
		instance.$element.find('.situation__container').slice(instance.showrows).addClass('situation__container--fade');

		// Get the max height of the container and store it
		instance.maxHeight = instance.getHeight() + instance.nocontentHeight;

		instance.$showmore.on('click', function(e) {
			e.preventDefault();
			$(this).toggleClass('section__cta-more--active');
			$('.situation__container', $('.row:gt(' + (instance.showrows - 1) + ')', instance.$element )).toggleClass('situation__container--fade');
			
			instance.$element.toggleClass('is-closed');
			if(instance.$element.hasClass('is-closed')) {
				instance.$element.velocity({'height': instance.maxHeight}, instance.speed, instance.easing);
			}
			else {
				instance.$element.velocity({'height': instance.minHeight}, instance.speed, instance.easing);
			}
			
		});
	};

	Situations.prototype.getNocontentHeight = function() {
		var instance = this;
		var height = 0;
		var numberOfRows = instance.showrows;
		var rows = instance.$element.find('.situation__container');

		height = instance.$element.outerHeight();
		rows = rows.slice(0, numberOfRows);

		rows.each(function(){
			height -= $(this).outerHeight();
		});

		return height;
	};

	Situations.prototype.getHeight = function(numberOfRows) {
		var instance = this;
		var height = 0;
		var rows = instance.$element.find('.situation__container');
		
		if (numberOfRows) {
			rows = rows.slice(0, numberOfRows);
		}
		rows.each(function(){
			height += $(this).outerHeight();
		});

		return height;
	};

	return Situations;
});