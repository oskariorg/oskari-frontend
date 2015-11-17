/**
 * Oskari RPC client
 * Version: 1.1.0
 *
 * Changes to 1.0.0:
 * - added onReady callback to detect when we have a successful connection
 * - removed hardcoded RPC-functions that might be disabled on Oskari instance
 * - functions are now generated based on what's available in the Oskari platform the client connects to. 
        This means you can be sure the map is listening if the client has it (after onReady-triggers).
 * - added default errorhandler to make it clear when an error happens. Used when custom errorhandler is not specified.
 * - added enableDebug(blnEnabled) to log some more info to console when enabled.
 * - Changed handleEvent to enable multiple listeners.
 * - handleEvent can no longer be used to unregister listener.
 * - Added unregisterEventHandler() for unregistering listeners (previously done with handleEvent without giving listener function).
 * - Added log() for debug logging without the need to check if window.console.log() exists
 * - function-calls can now have parameters as first argument array to allow multiple (treated as a success callback instead if type is function)
 * 
 * @return {Object}  reference to postMessage channel implementation
 */
;var OskariRPC = (function () {
    'use strict';
    return {
        connect: function (target, origin) {
            if (Channel === null || Channel === undefined) {
                throw new Error('JSChannel not found.');
            }
            if (target === null || target === undefined) {
                throw new TypeError('Missing target element.');
            }
            if (!target.contentWindow) {
                throw new TypeError('Target is missing contentWindow.');
            }
            if (origin === null || origin === undefined) {
                throw new TypeError('Missing origin.');
            }
            if (origin.indexOf('http') !== 0) {
                throw new TypeError('Invalid origin: ' + origin + '.');
            }
            var ready = false;
            var readyCallbacks = [];
            var isDebug = false;
            var defaultErrorHandler = function() {
                if(isDebug && window.console && window.console.log) {
                    console.log('Error', arguments);
                }
                throw new Error('RPC call failed!');
            };
            var RPC_API = {};

            /**
             * API 
             * @param  {[type]} blnEnabled [description]
             * @return {[type]}            [description]
             */
            RPC_API.enableDebug = function(blnEnabled) {
                isDebug = !!blnEnabled;
            };

            RPC_API.log = function() {
                if(window.console && window.console.log) {
                    window.console.log.apply(window.console, arguments);
                }
            };
            
            RPC_API.isReady = function() {
                return ready;
            };

            RPC_API.onReady = function(cb) {
                if(typeof cb !== 'function') {
                    // not a function
                    return;
                }

                if(ready) {
                    // if ready before adding the listener
                    // -> don't store reference/trigger callback immediately
                    cb();
                }
                else {
                    // otherwise save reference so we can call it when done
                    readyCallbacks.push(cb);
                }
            };

            RPC_API.destroy = function () {
                channel.destroy();
            };

            var eventHandlers = {};
            /**
             * @public @method handleEvent
             *
             * @param {string}   eventName   Event name
             * @param {function} success Callback function
             */
            RPC_API.handleEvent = function (eventName, handler) {
                if(!eventName) {
                    throw new Error('Event name not specified');
                }
                if(typeof handler !== 'function') {
                    throw new Error('Handler is not a function');
                }
                if(!eventHandlers[eventName]) {
                    eventHandlers[eventName] = [];
                }
                eventHandlers[eventName].push(handler);
                if(eventHandlers[eventName].length !== 1) {
                    // not the first one so we are already listening to the event
                    return;
                }

                // first one, bind listening to it
                channel.bind(eventName, function (trans, data) {
                    // loop eventHandlers[eventName] and call handlers
                    var handlers = eventHandlers[eventName];
                    for(var i = 0; i < handlers.length; ++i) {
                        handlers[i](data);
                    }
                });

                // Listen to event
                channel.call({
                    method: 'handleEvent',
                    params: [eventName, true],
                    success: function () { return undefined; },
                    error: defaultErrorHandler
                });
            };

            RPC_API.unregisterEventHandler = function (eventName, handler) {
                if(!eventName) {
                    throw new Error('Event name not specified');
                }
                var handlers = eventHandlers[eventName];
                if(!handlers || !handlers.length) {
                    if(window.console && window.console.log) {
                        console.log('Trying to unregister listener, but there are none for event: ' + eventName);
                    }
                    return;
                }
                var remainingHandlers = [];
                for(var i = 0; i < handlers.length; ++i) {
                    if(handlers[i] !== handler) {
                        remainingHandlers.push(handlers[i]);
                    }
                }
                eventHandlers[eventName] = remainingHandlers;
                // if last handler -> 
                if(!remainingHandlers.length) {
                    channel.unbind(eventName);
                    // unregister listening to event
                    channel.call({
                        method: 'handleEvent',
                        params: [eventName, false],
                        success: function () { return undefined; },
                        error: defaultErrorHandler
                    }); 
                }
            };

            /**
             * @public @method postRequest
             *
             * @param {string}   request Request name
             * @param {Any[]}       params  Request params
             * @param {function} error   Error handler
             *
             */
            RPC_API.postRequest = function (request, params, error) {
                channel.call({
                    method: 'postRequest',
                    params: [request, params],
                    success: function () { return undefined; },
                    error: error || defaultErrorHandler
                });
            };

            // connect and setup allowed functions
            var __bindFunctionCall = function(name) {
                /**
                 * Any of the allowed functions. Arguments are shifted if params is a function so there's no need to give an empty params array.
                 * @param {Array} params optional array of parameters for the function. Treated as success callback if a function instead.
                 * @param {function} success Callback function
                 * @param {function} error   Error handler
                 */
                RPC_API[name] = function (params, success, error) {
                    if(typeof params === 'function') {
                        error = success;
                        success = params;
                        params = [];
                    }
                    channel.call({
                        method: name,
                        params: params,
                        success: success,
                        error: error || defaultErrorHandler
                    });
                };
            };
            var channel = Channel.build({
                window: target.contentWindow,
                origin: origin,
                scope: 'Oskari',
                onReady : function() {
                    channel.call({
                        method: 'getSupportedFunctions',
                        success: function(funcnames) {
                            // setup allowed functions to RPC_API
                            for(var name in funcnames) {
                                if(!funcnames.hasOwnProperty(name)) {
                                    continue;
                                }
                                __bindFunctionCall(name);
                            }
                            // setup ready flag
                            ready = true;
                            // call onReady listeners
                            for(var i = 0; i < readyCallbacks.length; ++i) {
                                readyCallbacks[i]();
                            }
                        },
                        error: function() {
                            // communicate failure
                            throw new Error("Couldn't setup allowed functions");
                        }
                    });
                }
            });
            return RPC_API;
        }
    };
}());
