define(['utils/browser/url/query/fullquerystring'], function (query) {
	return {
		protocol: function () {
			return window.location.protocol;
		},
		host: function () {
			return window.location.host;
		},
		path: function () {
			return window.location.pathname;
		},
		fullurl: function () {
			return this.protocol() + '//' + this.host() + ((this.path() !== '/') ? this.path() : '') + query.fullquerystring();
		},
		isExternal: function (url) {
			if(typeof(url) === 'undefined')
				return;
			var checkDomain = function (url) {
				if (url.indexOf('//') === 0) {
					url = location.protocol + url;
				}
				return url.toLowerCase().replace(/([a-z])?:\/\//, '$1').split('/')[0];
			};

			return ( ( url.indexOf(':') > -1 || url.indexOf('//') > -1 ) && checkDomain(location.href) !== checkDomain(url) );
		}
	};
});
