define(function() {
	return {
		set: function(params, url) {
			var qs = '';
			var address = url || document.location.origin + document.location.pathname;
			for (var key in params) {
				if ({}.hasOwnProperty.call(params, key)) {
					var value = params[key];
					qs += encodeURIComponent(key) + '=' + encodeURIComponent(value) + '&';
				}
			}
			if (qs.length > 0) {
				qs = qs.substring(0, qs.length - 1);
				url = address + '?' + qs;
			}
			return url;
		}
	};
});