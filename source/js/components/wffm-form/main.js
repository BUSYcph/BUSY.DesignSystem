define(['jquery'], function($) {

	var WffmForm = function(element) {
		this.element = element;
		this.$element = $(element);

		this.initialize();
	};

	WffmForm.prototype.initialize = function() {

		// Remove WFFM standard styling
		// TODO: Remove styles in Nuget package
		//var $styles = this.$element.find('link');
		//$styles.each(function(){
		//	console.log($(this).attr('href'));
		//});
		//$styles.remove();

		// Move default text to placeholder attribute
		var $formControls = this.$element.find('.form-control');

		$formControls.each(function() {
			var $me = $(this);
			var value = $me.val();

			if (value) {
				$me.attr('placeholder', value);
				$me.val('');
				$me.closest('.form-group').addClass('has-loaded');
			}
		});

		// Checkboxes - Add a controller element for custom styling
		var $checkboxes = this.$element.find('.checkbox');

		$checkboxes.each(function(){
			var $me = $(this);
			$me.find('label').append('<div class="ctl">');
		});

		// Radiobuttons - Add a controller element for custom styling
		var $radios = this.$element.find('.radio');

		$radios.each(function(){
			var $me = $(this);
			$me.find('label').append('<div class="ctl">');
		});

		// File input - Add a class and controller element for custom styling
		var $files = this.$element.find('[type=file]');

		$files.each(function(){
			var $me = $(this);
			$me.closest('.form-group').addClass('file');
		});


	};

	return WffmForm;
});