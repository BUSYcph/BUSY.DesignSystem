define(function () {
	return {
		_part: function (url, ishash, undef) {
			var qs, index;
			if(ishash) {
				if (url === undef) {
					qs = window.location.hash.replace(/^#+/i, '');
				} else {
					var a = document.createElement('a');
					a.href = url;
					url = a;
					qs = url.hash.replace(/^#+/i, '');
				}
			} else {
				if (url === undef) {
					qs = window.location.search.substr(1);
				} else {
					index = url.indexOf('?');
					if (index === -1) {
						return {};
					}
					qs = url.substring(index + 1);
				}
			}

			return qs;
		},
		all: function (url, ishash, undef) {
			var pairs, qs,  map = {};
			qs = this._part(url, ishash, undef);
			pairs = qs.split('&');
			if (pairs === '') {
				return {};
			}
			for (var i = 0; i < pairs.length; ++i) {
				var p = pairs[i].split('=');
				if (p.length !== 2) {
					continue;
				}
				map[p[0]] = decodeURIComponent(p[1].replace(/\+/g, ' '));
			}
			return map;
		}
	};
});
