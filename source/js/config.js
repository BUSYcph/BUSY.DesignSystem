require.config({

	waitSeconds: 45,
	paths: {
		'loader': 'common/loader',
		'facade': 'common/facade',
		'mediator': 'common/mediator',
		'settings': 'common/settings',
		'utils': 'common/utils',

		'requirejs': 'vendor/requirejs/require',
		'text': 'vendor/requirejs/text',

		'jquery': 'vendor/jquery/jquery-3.1.1.min',
		'jquery-private': 'vendor/jquery/jquery.private',

		'fastclick': 'vendor/fastclick/fastclick',
		'scrollspy': 'vendor/scrollspy/jquery-scrollspy.min',

		'typeahead': 'vendor/typeahead/typeahead.jquery',
		'bloodhound': 'vendor/typeahead/bloodhound',

		'googleMaps': 'https://maps.googleapis.com/maps/api/js?key=AIzaSyBPLKvM9R05Wqu5oZ0yXGrsuDKXD3M4K5U',

		'moment': 'vendor/moment/moment',
		
		'velocity': 'vendor/velocity/velocity'
	},

	shim: {
		'fastclick': {
			exports: 'Fastclick'
		},
		'scrollspy': {
			deps: ['jquery']
		},
		'typeahead': {
			deps: ['jquery'],
			exports: 'typeahead'
		},
		'bloodhound': {
			deps: ['jquery'],
			exports: 'Bloodhound'
		},
		'velocity': {
			deps: [ 'jquery' ]
		}
	},

	map: {
		// '*' means all modules will get 'jquery-private'
		// for their 'jquery' dependency.
		'*': {
			'jquery': 'jquery-private'
		},

		// 'jquery-private' wants the real jQuery module though.
		'jquery-private': {
			'jquery': 'jquery'
		}
	}
});

// startup the facade and its component loader
require(['facade', 'loader'], function (facade) {
	facade.publish('loader:refresh');
});