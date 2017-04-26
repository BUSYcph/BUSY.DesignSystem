define(['utils/storage/cookie/exists'], function (cookieExists) {
	return {
		/*
		===================================
		Removing a cookie
		Usage: PT.Utils.Storage.Cookie.Delete(name[, path])
		Description: Delete a cookie.
		Parameters:
			name
				the name of the cookie to remove (string).
			path (optional)
				e.g., '/', '/mydir'; if not specified, defaults to the current path of the current document location (string or null).
		===================================
		*/
		delete: function (sKey, sPath) {
			if (!sKey || !cookieExists.exists(sKey)) {
				return false;
			}
			document.cookie = escape(sKey) + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT' + (sPath ? '; path=' + sPath : '');
			return true;
		}
	};
});
