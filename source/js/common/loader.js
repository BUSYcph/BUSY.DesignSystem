define(['facade', 'require'], function (facade, require) {
    var loadedMap = [],
    	dataName = 'data-component',
		reqUndef;

    /**
     * Helper function for sorting out component paths based on passed in name
     * will return a path as a string
     */
    function componentPath(name) {
        var s = name.lastIndexOf('/');
        if (s !== -1) {
            return name.substring(0, s) + '/components/' + name.substring(s + 1) + '/main';
        } else {
            return 'components/' + name + '/main';
        }
    }

    /**
     * Helper instance for housekeeping of currently instantiated components
     * by keeping house of this, we can easily tear components down, when routes
     * change, leaving no garbage behind.
     */
    reqUndef = new (function () {
        var refCount = {};

        // when new component starts up, it will register itself in here
        this.increase = function (name) {
            if (refCount[name]) { // more of the same?
                refCount[name]++;
            } else { // or first of its kind?
                refCount[name] = 1;
            }
        };

        // when components needs to be torn down, we'll leave no garbage behind and forget
        // about it completely using require.undef - http://requirejs.org/docs/api.html#undef
        this.decrease = function (name) {
            refCount[name]--;
            if (refCount[name] === 0) {
                requirejs.undef(componentPath(name));
            }
        };
    })();

    /**
     * Dictionary for possible components lifecycle states
     */
    var componentLoaderState = {
        'NEW'       : 0,
        'STARTING'  : 1,
        'STARTED'   : 2,
        'STOPPED'   : 3
    };

    /**
     * ComponentLoader constructor.
     *
     * @param {Object} opts:
            - el : DOM element that the component lives inside
            - componentName : Name of the component - translates directly to what's inside [data-component]
     * @api public
     */

    var ComponentLoader = function (opts) {
        this.el = opts.el;
        this.componentName = opts.componentName;
        this.state = componentLoaderState.NEW;
    };

    /**
     * When I change my responsibility (when I change [data-component]) I need a way to refresh my body
     *
     * @api public
     */

    ComponentLoader.prototype.refresh = function () {
        var componentName = this.el.getAttribute(dataName);

        if (componentName !== this.componentName) {
            if (this.state === componentLoaderState.STARTED) {
                this.stop();
            }
            this.componentName = this.el.getAttribute(dataName);

            this.start();
        }
    };

    /**
     * Start me up, load my logic, register me as running an involve me in communication
     *
     * @api public
     */

    ComponentLoader.prototype.start = function () {
        if (this.state === componentLoaderState.STARTING) {
            throw new Error('Error trying to start a component in placeholder where another component is pending start is not possible.');
        }

        this.state = componentLoaderState.STARTING;

        var me = this;

        reqUndef.increase(this.componentName);

        require([componentPath(this.componentName)], function (ComponentConstructor) {
            new ComponentConstructor(me.el);

            me.state = componentLoaderState.STARTED;

            resumePubsubWhenAllLoaded();
        });
    };

    /**
     * I don't want to play anymore. Stop me, erase me, forget about me and leave no trace!
     *
     * @api public
     */

    ComponentLoader.prototype.stop = function () {
        this.el.innerHTML = '';
        this.state = componentLoaderState.STOPPED;
        reqUndef.decrease(this.componentName);
    };

    /**
     * Our pubsub system doesn't do us much good unless every component has finished loading
     * so we'll resume the communication when everything is done loading
     */
	function resumePubsubWhenAllLoaded() {
		for (var i = 0; i < loadedMap.length; i++) {
			if (loadedMap[i].state !== componentLoaderState.STARTED) {
				return;
			}
		}
		facade.pubsub.resume();
	}

    /**
     * Helper for finding a specific component by its element
     */
    function findcomponentByEl(el) {
        for (var i = 0; i < loadedMap.length; i++) {
            if (loadedMap[i].el === el) {
                return loadedMap[i];
            }
        }
        return null;
    }

    /**
     * forEach for a NodeList ect.
     */
    var forEach = function (array, callback, scope) {
        for (var i = 0; i < array.length; i++) {
            callback.call(scope, i, array[i]); // passes back stuff we need
        }
    };

    /**
     * listen for whenever the loader wants to refresh and be ready for bootstrapping of components
     */
    facade.subscribe('loader:refresh', function () {
        var loader,
	    component,
	    componentList,
	    componentArray,
	    stopcomponents = loadedMap.slice(0);

        // we want to load new components - for communcation to be trustworthy, we should pause
        // all pubsub until everything has finished loading, so that no messages are lost in the
        // meantime
        facade.pubsub.pause();

        var componentList = document.querySelectorAll('[data-component]');
        forEach(componentList, function (index, componentNode) {
            // existing components should be stopped in their current form, and refreshed in their new one
            if ( ( component = findcomponentByEl(componentNode) ) ) {
                stopcomponents.splice(stopcomponents.indexOf(component), 1);
                component.refresh();
            } else {
            	// Split space separated componentlist into an array
                componentArray = componentNode.getAttribute(dataName).split(' ');

		// Loop through array of component names and load new component for each
                for (var i = 0, len = componentArray.length; i < len; i++) {

                    // spin up a new componentloader for this component
                    loader = new ComponentLoader({
                        el            : componentNode,
                        componentName : componentArray[i]
                    });

                    // start component
                    loader.start();

                    // register the component in our loadedMap
                    loadedMap.push(loader);

                }
            }
        });

        // for components that are obsolete, we should stop them and remove them from our loadedMap
        for (var n = 0; n < stopcomponents.length; n++) {
            component = stopcomponents[n];

            component.stop();
            loadedMap.splice(loadedMap.indexOf(component), 1);
        }
    });
});
