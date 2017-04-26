define(['utils/browser/url/query/all'], function(queryAll) {
	return {
		get: function(sKey, ishash) {
			var keys = (ishash) ? queryAll.all(undefined, true, undefined) : queryAll.all(undefined, false, undefined);
			return keys[sKey] || '';
		}
	};
});
