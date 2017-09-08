/**
 * Creates on, off, trigger functions for Oskari
 */
(function (o) {
    if (!o) {
        // can't add eventbus if no Oskari ref
        return;
    }
    if (o.on) {
        // already created on, don't run again
        return;
    }
    var log = Oskari.log('Events');

    var EventBus = function () {
        var store = o.createStore('subscribers', {
            defaultValue: function () {
                // return an array as default for any key
                return [];
            }
        });

        return {
            'on': function (event, handlerFn) {
                // only allow functions to be stored as handlers
                if (typeof handlerFn !== 'function') {
                    return false;
                }

                var list = store.subscribers(event);

                list.push(handlerFn);
                log.debug('Subscriber added for ' + event);
                return store.subscribers(event, list);
            },

            'off': function (event, handlerFn) {
                var currentSubs = store.subscribers(event);

                // remove if handlerFn found in currentSubs
                var success = false;
                for (var n = 0; n < currentSubs.length; n++) {
                    if (currentSubs[n] === handlerFn) {
                        currentSubs.splice(n, 1);
                        success = true;
                        break;
                    }
                }

                log.debug('Subscriber removed for ' + event);
                return success;
            },

            'trigger': function (event, data) {
                var currentSubs = store.subscribers(event);
                var count = 0;
                currentSubs.forEach(function (sub) {
                    try {
                        sub(data, event);
                        count++;
                    } catch (e) {
                        log.warn('Error notifying about ' + event, e);
                    }
                });

                log.debug('Triggered ' + event + ' - subscribers: ' + count);
                return count;
            }
        };
    };

    /**
     * Creates an event bus and attaches to target if parameter is given
     * @param  {Object} target optional target to attach observable functions
     * @return {Object} object with on, off and trigger functions
     */
    o.makeObservable = function (target) {
        var bus = new EventBus();
        if (!target) {
            return bus;
        }
        target.on = bus.on;
        target.off = bus.off;
        target.trigger = bus.trigger;
        return target;
    };

    // create eventbus for Oskari core
    o.makeObservable(o);
}(Oskari));
