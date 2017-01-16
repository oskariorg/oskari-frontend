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
        remove : function(key) {
            this.cache[key] = null;
        },
        put : function(key, value) {
            this.cache[key] = value;
        },
        get : function(key) {
            return this.cache[key];
        },
        /**
         * Adds a callback to a response queue.
         * When multiple calls are made to same resource we only want to send one request,
         *  queue the callbacks and call all of them when we have a response.
         * @param {String}   key      id for the queue
         * @param {Function} callback function to add to the queue
         * @return {Boolean} true if this was not the first queued callback.
         *                        True means that request is already in progress and we shouldn't start another,
         *                         but wait for the response.
         */
        addToQueue : function (key, callback) {
            var queueKey = 'queue_' + key;
            var queue = this.get(queueKey);
            if(!queue) {
                queue = [];
            }
            queue.push(callback);
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
        respondToQueue : function(key, err, response) {
            if(!err) {
                this.put(key, response);
            }
            var queueKey = 'queue_' + key;
            var callbacks = this.get(queueKey);
            callbacks.forEach(function(cb) {
                cb(err, response);
            });
            this.put(queueKey, null);
        },
        /**
         * Tries to find response from cache.
         * Returns true if cached response was found, callback-function was called and no further processing is needed.
         * @param  {String}   cacheKey id for the cache
         * @param  {Function} callback callback to call if there is a cached value
         * @return {Boolean}  True if cached response was found, callback-function was called and no further processing is needed.
         */
        tryCachedVersion : function(cacheKey, callback) {
            var cached = this.get(cacheKey);
            if(cached) {
                callback(null, cached);
                return true;
            }
            return false;
        }
    });
