import { arrayToObject, domainMatch } from '../util/RpcUtil';

/**
 * @class Oskari.mapframework.bundle.rpc.service.RpcService
 * Allows extend RPC supported funtions
 *
 */
Oskari.clazz.define('Oskari.mapframework.bundle.rpc.service.RpcService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */

    function (instance) {
        this.instance = instance;
        this.conf = this.instance.conf || {};
        this.channel = this.instance._channel;
        this._log = Oskari.log('RpcService');
        this._availableFunctions = {};
        this._allowedFunctions = this.conf.allowedfunctions || [];
        this._allowedFunctionsFromConf = Array.isArray(this.conf.allowedfunctions);
    }, {
        __name: 'Rpc.RpcService',
        __qname: 'Oskari.mapframework.bundle.rpc.service.RpcService',

        getQName: function () {
            return this.__qname;
        },

        getName: function () {
            return this.__name;
        },

        /**
         * @method init
         * Initializes the service
         */
        init: function () {
        },

        /**
         * @method addFunction
         * Add function to RPC
         *
         * @param func function that should be added
         */
        addFunction: function (func) {
            if (!func && typeof func !== 'function') {
                return;
            }

            const me = this;
            if (me._availableFunctions[func.name] != null) {
                me._log.warn('Trying add already defined RPC function (' + func.name + '), skipping.');
                return;
            }

            me._availableFunctions[func.name] = func;

            // bind functions
            me.__updateAllowedFunctions(func);
            me.__bindFunction(func);
        },

        /**
         * @public @method getAllowedFunctions
         * Get allowed functions
         *
         * @returns {Object} allowed functions
         */
        getAllowedFunctions: function () {
            return arrayToObject(this._allowedFunctions);
        },

        /**
         * @private @method __bindFunction
         * Bind allowed function to channel
         *
         * @param {Function} func
         */
        __bindFunction: function (func) {
            const me = this;

            if (!me._availableFunctions[func.name]) {
                return;
            }

            me.channel.bind(func.name, function (trans, params) {
                if (!domainMatch(trans.origin)) {
                    // eslint-disable-next-line no-throw-literal
                    throw {
                        error: 'invalid_origin',
                        message: 'Invalid origin: ' + trans.origin
                    };
                }
                params = params || [];
                params.unshift(trans);

                var value = me._availableFunctions[func.name].apply(me, params);
                if (typeof value === 'undefined') {
                    trans.delayReturn(true);
                    return;
                }
                return value;
            });
        },

        /**
         * @private @method __updateAllowedFunctions
         * Update allowed functions list
         *
         * @param {Function} func
         */
        __updateAllowedFunctions: function (func) {
            if (this._allowedFunctionsFromConf) {
                return;
            }
            this._allowedFunctions.push(func.name);
        }

    }, {
        protocol: ['Oskari.mapframework.service.Service']
    });
