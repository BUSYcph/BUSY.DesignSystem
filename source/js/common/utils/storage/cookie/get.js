define(function () {
	return {
		/*
		===================================
		Getting a cookie
		Usage: PT.Utils.Storage.Cookie.Get(name)
		Description: Read a cookie. If the cookie doesn't exist a null value will be returned.
		===================================
		*/
		get: function (sKey) {
			return unescape(document.cookie.replace(new RegExp('(?:(?:^|.*;)\\s*' + escape(sKey)
				.replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\=\\s*([^;]*).*$)|^.*$'), '$1')) || null;
		}
	};
});
