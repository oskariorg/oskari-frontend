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
                debugger;
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
            
            RPC_API.isReady = function() {
                return ready;
            };

            RPC_API.onReady = function(cb) {
                if(typeof cb !== 'function') {
                    // not a function
                    return;
                }

                if(ready) {
                // if ready before adding the listener -> call callback immediately
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

            /**
             * @public @method handleEvent
             *
             * @param {string}   event   Event name
             * @param {function} success Callback function
             * @param {function} error   Error handler
             *
             */
            RPC_API.handleEvent = function (event, success, error) {
                var register = !!success;
                if (register) {
                    // Bind event so we react to receiving it
                    channel.bind(
                        event,
                        function (trans, data) {
                            success(data);
                        }
                    );
                } else {
                    channel.unbind(event);
                }
                // Listen to event
                channel.call({
                    method: 'handleEvent',
                    params: [event, register],
                    success: function () {return undefined; },
                    error: error || defaultErrorHandler
                });
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
                    success: function () {return undefined; },
                    error: error || defaultErrorHandler
                });
            };

            // connect and setup allowed functions
            var __bindFunctionCall = function(name) {
                /**
                 * Any of the allowed functions
                 * @param {function} success Callback function
                 * @param {function} error   Error handler
                 */
                RPC_API[name] = function (success, error) {
                    channel.call({
                        method: name,
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
