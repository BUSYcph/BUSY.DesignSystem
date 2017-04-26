define(['jquery', 'velocity', 'settings'], function($, Velocity, settings) {
	var ProductList = function(el) {
		
		// Classes
		this.listRow = '.js-toggle-row';
		this.listDetails = '.js-toggle-content';
		this.active = 'is-active';
		this.notActive = 'is-not-active';

		// Dom elements
		this.$el = $(el);
		this.$titles = $('.js-toggle-cta', this.$el);
		this.$allTitles = $('.js-toggle-all-cta', this.$el);
		this.$allTitlesActive = $('.js-toggle-all-cta.is-active', this.$el);

		// Event listneners
		this.$titles.on('click', this.toggleDetails.bind(this));
		this.$allTitles.on('click', this.toggleAllDetails.bind(this));

		this.easing = settings.animationEasing;
		this.speed = settings.animationSpeed;

		this.$el.find(this.listRow).each(function(){
			var me = $(this);
			me.css('height', me.outerHeight());
			me.attr('data-height', me.outerHeight());
			me.addClass('is-initialized');
		});
	};

	ProductList.prototype.toggleDetails = function(e) {
		var $item = $(e.currentTarget);
		var isActive = $item.closest(this.listRow).hasClass(this.active);

		if(isActive) {
			this.closeDetails($item);
		} else {
			this.openDetails($item);
		}
	};

	ProductList.prototype.toggleAllDetails = function(e) {
		var $btn = $(e.currentTarget);
		var isActive = $btn.hasClass(this.active);

		$btn.toggleClass(this.active);
	
		this.$titles.each(function(index, item){
			var $item = $(item);

			if(isActive) {
				this.closeDetails($item);
			} else {
				this.openDetails($item);
			}
		}.bind(this));
	};

	ProductList.prototype.openDetails = function($el) {
		var instance = this;
		var newHeight = $el.closest(this.listRow).find(this.listDetails).outerHeight() + $el.closest(this.listRow).data('height') -3;
		$el
			.addClass(this.active)
			.closest(this.listRow)
				.addClass(this.active)
				.removeClass(this.notActive)
				.velocity({'height': newHeight}, instance.speed, instance.easing)

			.find(this.listDetails)
				.addClass(this.active)
				.removeClass(this.notActive);
				//.slideDown();
	};

	ProductList.prototype.closeDetails = function($el) {
		var instance = this;
		var newHeight = $el.closest(this.listRow).data('height');
		$el
			.removeClass(this.active)
			.closest(this.listRow)
				.removeClass(this.active)
				.addClass(this.notActive)
				.velocity({'height': newHeight}, instance.speed, instance.easing)
			.find(this.listDetails)
				.removeClass(this.active)
				.addClass(this.notActive);
				//.slideUp();
				

	};

	return ProductList;
});