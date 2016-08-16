# Oskari.statistics.statsgrid.Cache

Used as an internal cache and queue for data retrieval from server.

## Functions

### put(key, value)

Saves the value to a key

### get(key)

Returns the value for a key

### tryCachedVersion(cacheKey, callback)

Tries to find response from cache.
Returns true if cached response was found, callback-function was called and no further processing is needed.
@param  {String}   cacheKey id for the cache
@param  {Function} callback callback to call if there is a cached value
@return {Boolean}  True if cached response was found, callback-function was called and no further processing is needed.

### addToQueue(key, callback)

Adds a callback to a response queue.
When multiple calls are made to same resource we only want to send one request, queue the callbacks and call all of them when we have a response.
@param {String}   key      id for the queue
@param {Function} callback function to add to the queue
@return {Boolean} true if this was not the first queued callback. True means that request is already in progress and we shouldn't start another, but wait for the response.

### respondToQueue(key, err, response)

Finds a queue with the given key and calls the functions that are in the queue with the err and response param values.
Clears the queue after so functions are only called once.
Also caches the response if it's not an error
@param  {String} key      id for the queue
@param  {String} err      Error message when there is one
@param  {Object} response pretty much anything that needs to be passed to the callbacks as result
