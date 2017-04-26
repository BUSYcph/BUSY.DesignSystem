define(['require', 'utils/storage/cookie/all', 'utils/storage/cookie/delete', 'utils/storage/cookie/exists', 'utils/storage/cookie/get', 'utils/storage/cookie/set'], function (require) {
	var _all = require('utils/storage/cookie/all');
	var _delete = require('utils/storage/cookie/delete');
	var _exists = require('utils/storage/cookie/exists');
	var _get = require('utils/storage/cookie/get');
	var _set = require('utils/storage/cookie/set');

	return {
		all: _all.all,
		delete: _delete.delete,
		exists: _exists.exists,
		get: _get.get,
		set: _set.set
	};
});
