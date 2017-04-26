define(['facade'], function(facade) {

	/**
	 * example constructor.
	 * A template for how we should structure our components
	 * 
	 * @api public
	 */

	var example = function (element) {
		this.element = element;


		facade.publish('event', function() {
			// console.log('Publishing event');
		});

		facade.subscribe('event', function() {
			// console.log('Subscribing to event');
		});

		this.initialize();
	};

	example.prototype.initialize = function () {
		//console.log('example component');
	};

	return example;
});
