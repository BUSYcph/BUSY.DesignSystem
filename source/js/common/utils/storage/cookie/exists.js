define(function () {
	return {
		/*
		===================================
		Testing a cookie
		Usage: PT.Utils.Storage.Cookie.Exists(name)
		Description: Check if a cookie exists. Returns a bool.
		===================================
		*/
		exists: function (sKey) {
			return (new RegExp('(?:^|;\\s*)' + escape(sKey)
					.replace(/[\-\.\+\*]/g, '\\$&') + '\\s*\\='))
				.test(document.cookie);
		}
	};
});
