define(['jquery', 'typeahead', 'bloodhound'], function($, typeahead, Bloodhound) {
	var Search = function(element) {
		var instance = this;
		instance.element = element;
		instance.$element = $(element);

		instance.init(instance);
	};

	Search.prototype.init = function(instance) {
		var url = '/bane/api/search/suggestions';

		var engine = new Bloodhound({
			datumTokenizer: function(datum) {
				return Bloodhound.tokenizers.whitespace(datum.value);
			},
			queryTokenizer: Bloodhound.tokenizers.whitespace,
			remote: {
				url: url + '?query=%QUERY',
				wildcard: '%QUERY',
				filter: function(results) {
					// Map the remote source JSON array to a JavaScript object array
					return $.map(results.Suggestions, function(result) {
						return {
							value: result
						};
					});
				}
			}
		});

		engine.initialize();

		$('input[type="text"]', instance.$element).typeahead({
			hint: true,
			highlight: true,
			minLength: 2
		}, {
			name: 'SearchResults',
			display: 'value',
			source: engine.ttAdapter()
		});

		instance.$element.on('typeahead:select', function() {
			$('button', instance.$element).click();
		});
	};


	return Search;
});