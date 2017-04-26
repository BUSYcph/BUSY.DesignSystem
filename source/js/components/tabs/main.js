define(['jquery'], function($) {

	var Tabs = function (element) {
		this.element = element;
		this.$element = $(element);

		this.initialize();
	};

	Tabs.prototype.initialize = function () {

		var $toggleTabs = $('.js-toggle-tabs');
		var $tab = $('.js-tab');

		$toggleTabs.click(function (e) {
			e.preventDefault();
			var tabId = $(this).attr('data-tab');

			$toggleTabs.removeClass('current');
			$tab.removeClass('current').attr('aria-hidden', 'true');

			$(this).addClass('current');
			$('#'+tabId).addClass('current').attr('aria-hidden', 'false');
		});
	};

	return Tabs;
});
