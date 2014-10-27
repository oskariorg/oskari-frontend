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
            var channel = Channel.build({
                window: target.contentWindow,
                origin: origin,
                scope: 'Oskari'
            });
            return {

                /**
                 * @public @method destroy
                 *
                 *
                 */
                destroy: function () {
                    channel.destroy();
                },

                /**
                 * @public @method getMapPosition
                 *
                 * @param {function} success Callback function
                 * @param {function} error   Error handler
                 *
                 */
                getMapPosition: function (success, error) {
                    channel.call({
                        method: 'getMapPosition',
                        success: success,
                        error: error
                    });
                },

                /**
                 * @public @method getSupportedEvents
                 *
                 * @param {function} success Callback function
                 * @param {function} error   Error handler
                 *
                 */
                getSupportedEvents: function (success, error) {
                    channel.call({
                        method: 'getSupportedEvents',
                        success: success,
                        error: error
                    });
                },

                /**
                 * @public @method getSupportedRequests
                 *
                 * @param {function} success Callback function
                 * @param {function} error   Error handler
                 *
                 */
                getSupportedRequests: function (success, error) {
                    channel.call({
                        method: 'getSupportedRequests',
                        success: success,
                        error: error
                    });
                },

                /**
                 * @public @method handleEvent
                 *
                 * @param {string}   event   Event name
                 * @param {function} success Callback function
                 * @param {function} error   Error handler
                 *
                 */
                handleEvent: function (event, success, error) {
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
                        error: error
                    });
                },

                /**
                 * @public @method postRequest
                 *
                 * @param {string}   request Request name
                 * @param {[]}       params  Request params
                 * @param {function} error   Error handler
                 *
                 */
                postRequest: function (request, params, error) {
                    channel.call({
                        method: 'postRequest',
                        params: [request, params],
                        success: function () {return undefined; },
                        error: error
                    });
                }
            };
        }
    };
}());
