/**
 * @class Oskari.statistics.statsgrid.Cache
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.Cache',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {
        this.cache = {};
    }, {
        remove: function (key) {
            this.cache[key] = null;
        },
        put: function (key, value) {
            this.cache[key] = value;
        },
        get: function (key) {
            return this.cache[key];
        },
        getKeysStartingWith: function (prefix) {
            return Object.keys(this.cache).filter((key) => {
                return key.indexOf(prefix) === 0;
            });
        },
        flushKeysStartingWith: function (prefix) {
            this.getKeysStartingWith(prefix).forEach((key) => {
                this.remove(key);
            });
        },
        /**
         * Adds a callback to a response queue.
         * When multiple calls are made to same resource we only want to send one request,
         *  queue the callbacks and call all of them when we have a response.
         * @param {String}   key      id for the queue
         * @return {Boolean} true if this was not the first queued callback.
         *                        True means that request is already in progress and we shouldn't start another,
         *                         but wait for the response.
         */
        addToQueue: function (key) {
            const queueKey = 'queue_' + key;
            let queue = this.get(queueKey);
            if (!queue) {
                queue = [];
            }
            queue.push(key);
            this.put(queueKey, queue);
            // if not first > request already in progress
            return queue.length > 1;
        },
        /**
         * Finds a queue with the given key and calls the functions that are in the queue with the err and response param values.
         * Clears the queue after so functions are only called once.
         * Also caches the response if it's not an error
         * @param  {String} key      id for the queue
         * @param  {String} err      Error message when there is one
         * @param  {Object} response pretty much anything that needs to be passed to the callbacks as result
         */
        respondToQueue: function (key, err, response) {
            if (!err) {
                this.put(key, response);
            }
            const queueKey = 'queue_' + key;
            // FIXME: this doesn't make sense anymore.
            // Previously it was used to call functions registered on addToQueue(), but the callback are no longer used so this is kind of a weird function
            this.put(queueKey, null);
        },
        /**
         * Tries to find response from cache.
         * @param  {String}   cacheKey id for the cache
         * @return {any|Boolean}  Cached value if cached response was found, false if not.
         */
        tryCachedVersion: function (cacheKey) {
            const cached = this.get(cacheKey);
            if (cached) {
                return cached;
            }
            return false;
        }
    });
