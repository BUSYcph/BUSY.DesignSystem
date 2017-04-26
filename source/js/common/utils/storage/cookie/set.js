define(function () {
	return {
		/*
		===================================
		Writing a cookie
		Usage: PT.Utils.Storage.Cookie.Get(name, value[, end[, path[, domain[, secure]]]])
		Description: Create/overwrite a cookie.
		Parameters:
			name (required)
				The name of the cookie to create/overwrite (string).
			value (required)
				The value of the cookie (string).
			end (optional)
				The max-age in seconds (e.g. 31536e3 for a year, Infinity for a never-expires cookie) or the expires date in GMTString format or as Date object; if not specified it will expire at the end of session (number – finite or Infinity – string, Date object or null).
			path (optional)
				E.g., "/", "/mydir"; if not specified, defaults to the current path of the current document location (string or null).
			domain (optional)
				E.g., "example.com", ".example.com" (includes all subdomains) or "subdomain.example.com"; if not specified, defaults to the host portion of the current document location (string or null).
			secure (optional)
				The cookie will be transmitted only over secure protocol as https (boolean or null).
		===================================
		*/
		set: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
			if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/i.test(sKey)) {
				return false;
			}
			var sExpires = '';
			if (vEnd) {
				switch (vEnd.constructor) {
				case Number:
					sExpires = vEnd === Infinity ? '; expires=Fri, 31 Dec 9999 23:59:59 GMT' : '; max-age=' + vEnd;
					break;
				case String:
					sExpires = '; expires=' + vEnd;
					break;
				case Date:
					sExpires = '; expires=' + vEnd.toGMTString();
					break;
				}
			}
			document.cookie = escape(sKey) + '=' + escape(sValue) + sExpires + (sDomain ? '; domain=' + sDomain : '') + (sPath ? '; path=' + sPath : '') + (bSecure ? '; secure' : '');
			return true;
		}
	};
});
