define(['jquery', 'facade'], function($, facade) {
	var MapSearch = function(element) {
		var instance = this;
		instance.element = element;
		instance.$element = $(element);

		instance.$locationBtn = $('.js-map-searchLocation');
		instance.$searchBtn= $('.js-map-searchButton');
		instance.$searchQuery = $('.js-map-searchQuery input');
		instance.$searchRadius = $('.js-map-searchRadius select');

		instance.isLinked = instance.$element.data('linktopage') ? true : false;
		instance.isLinkedUrl = instance.$element.data('linktopage');

		instance.mustGetAddress = location.search.indexOf('getAddress') > -1;
		instance.mustGetLocation = location.search.indexOf('getLocation') > -1;

		instance.init();
	};

	MapSearch.prototype.init = function() {
		var instance = this;

		instance.$locationBtn.on('click', function(){
			instance.getLocation();
		});

		instance.$searchQuery.on('keyup', function(event){
			if (event.which === 13 || event.keyCode === 13) {
				instance.getAddress();
				return false;
			}
			return true;
		});

		instance.$searchBtn.on('click', function(){
			instance.getAddress();
		});

		if(instance.mustGetAddress) {
			instance.$searchQuery.val(decodeURI(location.search.split('=')[1]));
			instance.getAddress();
		}

		if(instance.mustGetLocation) {
			instance.$searchRadius.val(location.search.split('=')[1]);
			instance.getLocation();
		}

	};
	

	MapSearch.prototype.getLocation = function() {
		var instance = this;
		var searchRadius = instance.$searchRadius.val();
		
		if(instance.isLinked) {
			location.href = instance.isLinkedUrl + '?getLocation=' + searchRadius;
		}
		else {
			facade.publish('map:getLocation', searchRadius);
		}
	};

	MapSearch.prototype.getAddress = function() {
		var instance = this;
		var searchQuery = instance.$searchQuery.val();
		var searchRadius = instance.$searchRadius.val();
		
		if(instance.isLinked) {
			location.href = instance.isLinkedUrl + '?getAddress=' + searchQuery;
		}
		else {
			facade.publish('map:getAddress', searchQuery, searchRadius);
		}

	};

	return MapSearch;
});