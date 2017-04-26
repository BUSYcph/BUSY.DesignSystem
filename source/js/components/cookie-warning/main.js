define([
	'jquery',
	'facade',
	'utils/storage/cookie/main'
], function ($, facade, cookie) {
	var CookieWarning = function (element) {
		var instance = this;
		instance.element = element;
		instance.$element = $(element);
		instance.init(instance);
	};

	CookieWarning.prototype.init = function (instance) {
		instance.$element = $('.js-cookie-warning');
		if (cookie.get('cookie') !== '1') {
			if (instance.$element.data('cookieautohide') !== '' && instance.$element.data('cookieautohide') !== 0) {
				setTimeout(function () {
					instance.hide(instance);
				}, instance.$element.data('cookieautohide') * 1000);
			}

			$('.js-cookies-accept', instance.$element).click(function (e) {
				e.preventDefault();
				instance.accept(instance);
			});
		} else {
			instance.$element.remove();
		}
	};

	CookieWarning.prototype.hide = function (instance) {
		instance.$element.animate({
			'height': -instance.$element.outerHeight() + 'px'
		}, function () {
			instance.$element.remove();
		});
	};

	CookieWarning.prototype.accept = function (instance) {
		var expiration = (instance.$element.data('cookieexpiration') !== '') ? instance.$element.data('cookieexpiration') : Infinity;

		var expireDate = null;
		if (expiration !== Infinity) {
			expireDate = new Date();
			expireDate.setDate(expireDate.getDate() + 90);
		} else {
			expireDate = expiration;
		}
		cookie.set('cookie', '1', expireDate);
		instance.hide(instance);
	};

	return CookieWarning;
});
