define(['utils/browser/url/query/all'], function (queryAll) {
	return {
		fullquerystring: function () {
			var keys = queryAll.all();
			var full = '?';
			for (var p in keys) {
				if ({}.hasOwnProperty.call(keys, p)) {
					full += p + '=' + keys[p] + '&';
				}
			}
			full = full.substr(0, full.length - 1);
			return full;
		}
	};
});