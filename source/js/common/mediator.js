// mediator
// -------------------------
// The mediator pattern is best introduced with a simple analogy - think of your typical airport traffic control.
// The tower handles what planes can take off and land because all communications are done from the planes to the
// control tower, rather than from plane-to-plane. A centralized controller is key to the success of this system
// and that's really what a mediator is.

// http://addyosmani.com/largescalejavascript/#mediatorpattern

define(function () {
    var mediator = (function () {

        var isPaused = false;
        var queue = [];

        /**
         * anything that consumes this mediator should have the ability to subscribe
         * to something through a certain channel
         *
         * @api public
         */

        var subscribe = function (channel, fn, context) {
            if (!mediator.channels[channel]) {
                mediator.channels[channel] = [];
            }

            mediator.channels[channel].push({ context: context || this, callback: fn });

            return this;
        };

        /**
         * anything that consumes this mediator should have the ability to unsubscribe
         * from existing subscriptions
         *
         * @api public
         */

        var unsubscribe = function (channel, fn, context) {
            if (!mediator.channels[channel]) {
                return;
            }

            if (fn) {
                for (var i = 0, l = mediator.channels[channel].length; i < l; i++) {
                    if (mediator.channels[channel][i].context === context || this &&
                        mediator.channels[channel][i].callback === fn) {
                        mediator.channels[channel].splice(i, 1);
                    }
                }
            } else {
                delete mediator.channels[channel];
            }

            return this;
        };

        /**
         * Well.... duh
         */

        var pause = function () {
            isPaused = true;
        };

        /**
         * when resumed we will process the queue
         */
        var resume = function () {
            isPaused = false;

            for (var i = 0; i < queue.length; i++) {
                 publish.apply(publish, queue[i]);
             }

             queue = [];
         };

         /**
         * anything that consumes this mediator should have the ability to publish
         * to a certain channel
         *
         * @api public
         */

         var publish = function (channel) {
            // if we're paused we won't publish, but rather add to the queue
            if (isPaused) {
                queue.push(Array.prototype.slice.apply(arguments));
                return;
            }

            // we can't publish to a channel that doesn't exist
            if (!mediator.channels[channel]) {
                return false;
            }

            // handle any arguments passed along
            var args = Array.prototype.slice.call(arguments, 1);

            // and publish to all subscribers
            for (var i = 0, l = mediator.channels[channel].length; i < l; i++) {
                var subscription = mediator.channels[channel][i];
                subscription.callback.apply(subscription.context, args);
            }

            return this;
        };

        // return public methods for cosumers of mediator
        return {
            channels: {},
            publish: publish,
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            pause: pause,
            resume: resume,
            // neat installer feature, so we can easily install mediator onto objects
            installTo: function (obj) {
                obj.subscribe = subscribe;
                obj.unsubscribe = unsubscribe;
                obj.publish = publish;
                obj.pubsub = {
                    pause: pause,
                    resume: resume
                };
            }
        };
    }());

    return mediator;
});
