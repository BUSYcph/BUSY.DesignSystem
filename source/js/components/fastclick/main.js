define(['facade', 'fastclick'], function(facade, FastClick) {

	/**
	 * fastclick constructor.
	 *
	 * @api public
	 */

	var fastclick_loader = function (element) {
		this.element = element;

		this.initialize();
	};

	fastclick_loader.prototype.initialize = function () {
		var self = this;

		FastClick.attach(self.element);
	};

	return fastclick_loader;
});
