define(['jquery', 'facade', 'googleMaps'], function($, facade, Googlemaps) {
	var Map = function (element) {
		var instance = this;

		instance.element = element;
		instance.$element = $(element);
		instance.data = '';

		instance.center = instance.$element.data('center').split(',');
		instance.zoom = instance.$element.data('zoom');
		
		instance.endpoint = instance.$element.data('endpoint');
		
		instance.defaultIconId = instance.$element.data('defaulticon');
		instance.defaultProximityIconId = instance.$element.data('defaulticon');

		instance.proximity = instance.$element.data('proximity') === 'True' ? true : false;
		instance.proximityradius = parseInt(instance.$element.data('proximityradius'), 10);

		instance.$message = instance.$element.find('.js-map-message');

		// Get dictionary strings
		instance.dictionary = {
			readMore: instance.$element.find('.js-dictionary-read-more').text(),
			yourPosition: instance.$element.find('.js-dictionary-your-position').text(),
			showingRadius: instance.$element.find('.js-dictionary-showing-radius').text(),
			showingKm: instance.$element.find('.js-dictionary-showing-km').text()
		};

		// Set up configuration values
		instance.config = {};
		var config = instance.config;

		// Set the center from data-attributes. Otherwise set it in center of Denmark
		config.center = instance.center.length > 1 ? {'lat': Number(instance.center[0]), 'lng': Number(instance.center[1])} : {'lat': 56.263920, 'lng': 9.501785};
		
		// Set the zoom from data-attributes. Otherwise set it to 7
		config.zoom = instance.zoom || 7;
		
		// Set the z-indexes for shapes on the map
		config.layermap = {
			marker: 100,
			polyline: 50,
			polygon: 30,
			circle: 10
		};

		config.style = {
			fillColor: '#36839e',
			fillColorAccent: '#ffca05',
			fillOpacity: 0.35,
			strokeColor: '#36839e',
			strokeOpacity: 0.8,
			strokeWeight: 0,
			pathOpacity: 0.35,
			pathWeight: 5,
			svgPath: 'M50 0C27.9 0 9.9 18 9.9 40.1c0 2.5.2 5.1.7 7.5 0 .1.1.6.3 1.3.6 2.7 1.5 5.4 2.7 7.9C17.9 67 27.4 82.6 48.2 99.4c.5.4 1.2.6 1.8.6s1.3-.2 1.8-.6C72.6 82.6 82.1 67 86.4 56.9c1.2-2.5 2.1-5.2 2.7-7.9.2-.8.3-1.2.3-1.3.5-2.5.7-5 .7-7.5C90.1 18 72.1 0 50 0zm0 66c-14 0-25.5-11.4-25.5-25.5S36 15.1 50 15.1s25.5 11.4 25.5 25.5S64 66 50 66z'
		};

		config.icon = {
			path: config.style.svgPath,
			anchor: new google.maps.Point(50,100),
			fillColor: config.style.fillColor,
			fillOpacity: 0.9,
			scale: 0.3,
			strokeWeight: 0
		};

		config.proximityIcon = {
			path: config.style.svgPath,
			anchor: new google.maps.Point(50,100),
			fillColor: config.style.fillColorAccent,
			fillOpacity: 0.9,
			scale: 0.3,
			strokeWeight: 0
		};

		config.proximityRadius = 5;


		/*****************************
		 * getBounds() / GetCenter()
		 * 
		 * Extend Polygon and Polyline with our own getBounds and getCenter methods
		 * since they dont exist in the API
		 * 
		 * Also extend Marker with our own getCenter method.
		 * This is effectively the same as getPosition
		 * 
		 * getCenter for Polygon and Polyline are just simple approximations
		 * but we need them to determine if a certain shape is within the bounds of the map
		 */

		google.maps.Polygon.prototype.getBounds=function(){
			var bounds = new google.maps.LatLngBounds();
			// We assume the polygon only has one path and thus use .getPAth() instead of .getPaths()
			this.getPath().forEach(function(element){
				bounds.extend(element);
			});
			return bounds;
		};

		google.maps.Polygon.prototype.getCenter=function(){
			var center = this.getBounds().getCenter();
			return center;
		};

		google.maps.Polyline.prototype.getBounds=function(){
			var bounds = new google.maps.LatLngBounds();
			this.getPath().forEach(function(element){
				bounds.extend(element);
			});
			return bounds;
		};

		google.maps.Polyline.prototype.getCenter=function(){
			var center = this.getBounds().getCenter();
			return center;
		};

		google.maps.Marker.prototype.getCenter=function(){
			var center = this.getPosition();
			return center;
		};


		instance.init(instance);
	};

	Map.prototype.init = function(instance) {

		var container = instance.$element.find('.js-map-container').get(0);
		var config = instance.config;

		instance.map = new google.maps.Map(container, {
			center: new google.maps.LatLng(config.center),
			zoom: config.zoom,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			zoomControl: true,
			navigationControl: true,
			mapTypeControl: false,
			streetViewControl: false,
			navigationControlOptions: {
				style: google.maps.NavigationControlStyle.SMALL
			},
			styles: JSON.parse(Style)
		});
		
		instance.infowindow = new google.maps.InfoWindow({
			maxWidth: 240
		});

		// Listen for bounds_changed event and publish polygons in view
		// We use idle event instead since bounds_changed fires multiple times
		instance.map.addListener('idle', function() {
			instance.getVisibleShapes();
		});

		// Load data from endpoint
		if(location.hostname !== 'localhost') {
			$.ajax({
				url: instance.endpoint
			}).done(function(data) {
				instance.data = data;

				if (instance.defaultIconId) {
					var defaulticon = instance.getIcon();
					instance.config.icon.path = defaulticon.path;
					instance.config.icon.fillColor = defaulticon.color;
				}

				if (instance.defaultProximityIconId) {
					var defaultproxyicon = instance.getIcon();
					instance.config.proximityIcon.path = defaultproxyicon.path;
				}

				instance.renderJsonData(instance);
			});
		}
		
		// Prototyping
		else {
			instance.data = JSON.parse(Data);
			instance.renderJsonData(instance);
		}


		// Subscribe to events
		facade.subscribe('map:getLocation', function(searchRadius){
			instance.getGeolocation(searchRadius);
		});

		facade.subscribe('map:getAddress', function(searchQuery, searchRadius){
			instance.geoCode(searchQuery, searchRadius);
		});

		// Render initial proximity
		if (instance.proximity) {
			// config.proximityRadius = instance.proximityradius;
			// instance.renderProximity(config.center);
		}

	};


	/*****************************
	 * Reading and rendering data
	 * 
	 * Read data from our JSON file
	 * and render shapes on the map
	 * JSON file is formatted like GeoJSON but we use shapes that are not supported in GeoJSON
	 */

	Map.prototype.renderJsonData = function(instance) {
		var config = instance.config;
		var map = instance.map;
		var data = instance.data;

		// Create an array to hold all shapes in the map
		instance.shapes = [];

		// Add shapes to the map 

		for (var i = 0; i < data.customFeatures.length; i++) {
			var props = data.customFeatures[i];
			var shape;

			// Add a Marker
			if (props.geometry.type === 'Marker') {
				
				// Set custom icon if any
				var icon;

				if (props.properties.iconId) {
					var customIcon = instance.getIcon(props.properties.iconId);
					icon = {
						path: customIcon.path,
						anchor: new google.maps.Point(50,100),
						fillColor: customIcon.color,
						fillOpacity: 0.9,
						scale: 0.3,
						strokeWeight: 0
					};
				}
				shape = new google.maps.Marker({
					icon: icon || config.icon,
					map: map,
					position: new google.maps.LatLng(props.geometry.coordinates[0][0], props.geometry.coordinates[0][1]),
					props: props,
					zIndex: config.layermap.marker
				});

				icon = undefined;
			}

			// Add a Circle
			if (props.geometry.type === 'Circle') {
				shape = new google.maps.Circle({
					fillColor: config.style.fillColor,
					strokeColor: config.style.strokeColor,
					strokeWeight: config.style.strokeWeight,
					strokeOpacity: config.style.strokeOpacity,
					fillOpacity: config.style.fillOpacity,
					map: map,
					center: new google.maps.LatLng(props.geometry.coordinates[0][0], props.geometry.coordinates[0][1]),
					radius: parseInt(props.geometry.radius, 10),
					props: props,
					zIndex: config.layermap.circle
				});
			}
			
			// Add a Polyline
			if (props.geometry.type === 'Polyline') {
				shape = new google.maps.Polyline({
					strokeColor: config.style.strokeColor,
					strokeWeight: config.style.pathWeight,
					strokeOpacity: config.style.pathOpacity,
					map: map,
					path: props.geometry.coordinates.map(function(coord) {
						return new google.maps.LatLng(coord[0], coord[1]);
					}),
					props: props,
					zIndex: config.layermap.polyline
				});
			}

			// Add a Polygon
			if (props.geometry.type === 'Polygon') {
				shape = new google.maps.Polygon({
					strokeColor: config.style.strokeColor,
					strokeWeight: config.style.strokeWeight,
					strokeOpacity: config.style.strokeOpacity,
					fillOpacity: config.style.fillOpacity,
					fillColor: config.style.fillColor,
					map: map,
					path: props.geometry.coordinates.map(function(coord) {
						return new google.maps.LatLng(coord[0], coord[1]);
					}),
					props: props,
					zIndex: config.layermap.polygon
				});
			}

			// Create infoWindow
			google.maps.event.addListener(shape, 'click', function(event) {
				var shape = this;
				instance.attachInfowindow(instance, shape, event);
			});

			// Push shape object to array for later use
			instance.shapes.push(shape);

		}
	};

	/*****************************
	 * Users Proxy
	 * Map object to display the users position
	 */

	Map.prototype.renderProximity = function(LatLng) {
		var instance = this;
		var config = instance.config;
		var map = instance.map;
		
		if (!instance.proxy) {

			instance.proxy = {};

			instance.proxy.radius = new google.maps.Circle({
				strokeWeight: 0,
				fillColor:  config.style.fillColorAccent,
				fillOpacity: config.style.fillOpacity,
				map: map,
				center: LatLng,
				radius: config.proximityRadius * 1000
			});


			instance.proxy.radiusInner = new google.maps.Circle({
				strokeWeight: 0,
				fillColor:  config.style.fillColorAccent,
				fillOpacity: config.style.fillOpacity,
				map: map,
				center: LatLng,
				radius: config.proximityRadius * 100
			});

			instance.proxy.radius.props = {
				'properties': {
					'title': instance.dictionary.yourPosition,
					'text': instance.dictionary.showingRadius + ' ' + config.proximityRadius + ' ' + instance.dictionary.showingKm
				},
				'geometry': {
					'type': 'Circle'
				}
			};


			instance.proxy.position = new google.maps.Marker({
				icon: config.proximityIcon,
				map: map,
				position: LatLng
			});
			
			instance.proxy.position.props = {
				'properties': {
					'title': instance.dictionary.yourPosition,
					'text': instance.dictionary.showingRadius + ' ' + config.proximityRadius + ' ' + instance.dictionary.showingKm
				},
				'geometry': {
					'type': 'Marker'
				}
			};


		}
		else {
			instance.proxy.radius.props.properties.text = instance.dictionary.showingRadius + ' ' + config.proximityRadius + ' ' + instance.dictionary.showingKm;
			instance.proxy.position.props.properties.text = instance.dictionary.showingRadius + ' ' + config.proximityRadius + ' ' + instance.dictionary.showingKm;
		}

		var shape;

		shape = instance.proxy.radius;
		google.maps.event.addListener(shape, 'click', function(event) {
			instance.attachInfowindow(instance, shape, event);
		});

		shape = instance.proxy.position;
		google.maps.event.addListener(shape, 'click', function(event) {
			instance.attachInfowindow(instance, shape, event);
		});

		instance.proxy.radius.setRadius(config.proximityRadius * 1000);
		instance.proxy.radiusInner.setRadius(config.proximityRadius * 100);
		instance.proxy.radius.setCenter(LatLng);
		instance.proxy.radiusInner.setCenter(LatLng);
		instance.proxy.position.setPosition(LatLng);

		map.panTo(LatLng);
		map.fitBounds(instance.proxy.radius.getBounds());

		// Set visibility of proximity
		instance.proxy.radius.setVisible(instance.proximity);
		instance.proxy.radiusInner.setVisible(instance.proximity);
	};


	/*****************************
	 * Users location
	 * Geo Locating
	 */

	Map.prototype.getGeolocation = function(radius) {
		var instance = this;
		var config = instance.config;
		var options = { enableHighAccuracy: true };

		var success = function(pos) {
			var crd = pos.coords;

			/*
			console.log('Your current position is:');
			console.log(`Latitude : ${crd.latitude}`);
			console.log(`Longitude: ${crd.longitude}`);
			console.log(`More or less ${crd.accuracy} meters.`);
			*/
			
			if(radius) {
				config.proximityRadius = Number(radius);
			}

			var LatLng = new google.maps.LatLng({lat: crd.latitude, lng: crd.longitude}); 

			instance.renderProximity(LatLng);
			instance.$message.text('');
		};
		var error = function() {
			instance.$message.text('An error occurred while using Geolocation');
		};

		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(success, error, options);
		}
		else {
			instance.$message.text('Geolocation is not supported by this browser.');
		}
	};


	/*****************************
	 * Users address 
	 * Geo Coding
	 */

	Map.prototype.geoCode = function(address, radius) {
		var instance = this;
		var config = instance.config;
		var geocoder = new google.maps.Geocoder();

		if(radius) {
			config.proximityRadius = Number(radius);
		}
		
		// Geocode address and bias towards Denmark (not restricted)
		geocoder.geocode( { 'address': address, 'region': 'dk'}, function(results, status) {
			if (status === 'OK') {
				
				var LatLng = results[0].geometry.location; 
				instance.renderProximity(LatLng);
				instance.$message.text('');
			}
			else {
				instance.$message.text('Geocode was not successful for the following reason: ' + status);
			}
		});
	};

	/*****************************
	 * Info Windows
	 */

	Map.prototype.attachInfowindow = function(instance, shape, event) {
		var properties = shape.props.properties;
		var titleString = properties.title ? '<h2>' + properties.title + '</h2>' : '';
		var textString = properties.text ? '<p>' + properties.text + '</p>' : '';
		var imageString = properties.imageUrl ? '<img src="' + properties.imageUrl +'">' : '';
		var linkString = properties.link ? '<a class="button button--dark button--small" href="' + properties.link +'">' + instance.dictionary.readMore + '</a>' : '';

		instance.infowindow.setContent(titleString + textString + imageString + linkString);
			
		// If the shape is a marker use that as position for the infowindow
		// otherwise use the click event coordinates
		if (shape.props.geometry.type === 'Marker') {
			instance.infowindow.setPosition(shape.position);
			instance.infowindow.setOptions({'pixelOffset': new google.maps.Size(0,-25)});
		}
		else {
			instance.infowindow.setPosition(event.latLng);
			instance.infowindow.setOptions({'pixelOffset': new google.maps.Size(0,0)});
		}

		instance.infowindow.open(shape.get('map'));

	};


	/*****************************
	 * Get shapes in map viewport (map bounds)
	 */

	Map.prototype.getVisibleShapes = function() {
		var instance = this;
		var map = instance.map;
		var shapes = instance.shapes;
		var ids = [];

		for(var i = shapes.length, bounds = map.getBounds(); i--;) {
			if( bounds.contains(shapes[i].getCenter()) ){
				ids.push(shapes[i].props.id);
			}
		}
		facade.publish('map:setVisible', ids);
	};

	/*****************************
	 * Find icon in data
	 */

	Map.prototype.getIcon = function(id) {
		var instance = this;
		var data = instance.data;
		var icon = {};
		
		id = id || instance.defaultIconId;

		$.each(data.icons, function(i, v) {
			if (v.id === id) {
				// found it...
				icon.path = v.svgPath;
				icon.color = v.color;
				return false; // stop the loop
			}
		});	
		return icon;
	};

	return Map;
});