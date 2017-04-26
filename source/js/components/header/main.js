define(['jquery', 'scrollspy'], function($) {

	/**
	 * Header constructor.
	 *
	 * @api public
	 */

	var Header = function (element) {
		this.element = element;

		this.initialize();
	};

	Header.prototype.initialize = function () {

		var $header = $('.js-header');
		var $toggle = $('.js-header-toggle');
		var $body = $('html, body');
		var offset = $header.find('.navigation--main').height();

		$('.js-header-navigation').scrollspy({
			min: offset, // Offset should be the height of the navbar. In this case 365px
			max: $(document).height(),
			onEnter: function () {
				$header.addClass('is-sticky');
				$header.addClass('to-sticky');
				$header.removeClass('to-normal');
			},
			onLeave: function () {
				$header.removeClass('is-sticky');
				$header.removeClass('to-sticky');
				$header.addClass('to-normal');
			}
		});

		$toggle.on('click', function () {
			$header.toggleClass('is-open');
			$body.toggleClass('is-locked');
		});

	};

	return Header;
});
