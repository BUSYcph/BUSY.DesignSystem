define(function () {
	return {
		/*
		===================================
		Getting the list of all cookies
		Usage: PT.Utils.Storage.Cookie.All()
		Description: Returns an array of all readable cookies from this location.
		===================================
		*/
		all: function () {
			var aKeys = document.cookie.replace(/((?:^|\s*;)[^\=]+)(?=;|$)|^\s*|\s*(?:\=[^;]*)?(?:\1|$)/g, '')
				.split(/\s*(?:\=[^;]*)?;\s*/);
			for (var nIdx = 0; nIdx < aKeys.length; nIdx++) {
				aKeys[nIdx] = unescape(aKeys[nIdx]);
			}
			return aKeys;
		}
	};
});
