/**
 * @class Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance
 * Handles modules implementing Stateful protocol to get application state
 * and uses the registered plugin to handle saving the state.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.statehandler.StateHandlerBundleInstance',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Object} config
     *      JSON config with params needed to run the bundle
     *
     */
    function () {
        this._localization = null;
        this._pluginInstances = {};
        this._startupState = null;
        this._historyPollingInterval = 1500;
        this._historyTimer = null;
        this._historyPrevious = [];
        this._historyNext = [];
        this._historyEnabled = true;

        // TODO: default view from conf?
        this._defaultViewId = 1;

        if (typeof window.viewId !== 'undefined') {
            this._currentViewId = window.viewId;
        } else {
            this._currentViewId = this._defaultViewId;
        }
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'StateHandler',
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method setSandbox
         * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function (sandbox) {
            this.sandbox = sandbox;
        },
        /**
         * @method getSandbox
         * @return {Oskari.mapframework.sandbox.Sandbox}
         */
        getSandbox: function () {
            return this.sandbox;
        },
        /**
         * @method start
         * implements BundleInstance start methdod
         */
        start: function () {
            var me = this;
            if (me.started) {
                return;
            }
            me.started = true;

            var conf = this.conf,
                sandboxName = (conf ? conf.sandbox : null) || 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                sessionLengthInMinutes = (conf ? conf.sessionLength : 0),
                p;

            me.sandbox = sandbox;
            sandbox.register(me);
            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(me, p);
                }
            }

            var ajaxUrl = sandbox.getAjaxUrl();
            //"/web/fi/kartta?p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=1&p_p_state=exclusive&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&_Portti2Map_WAR_portti2mapportlet_fi.mml.baseportlet.CMD=ajax.jsp&";
            var sessionPlugin = Oskari.clazz.create('Oskari.mapframework.bundle.statehandler.plugin.SaveViewPlugin', ajaxUrl);
            this.registerPlugin(sessionPlugin);
            this.startPlugin(sessionPlugin);

            sandbox.addRequestHandler('StateHandler.SetStateRequest', this.requestHandlers.setStateHandler);
            sandbox.addRequestHandler('StateHandler.SaveStateRequest', this.requestHandlers.saveStateHandler);

            if (this.getSandbox().getUser().isLoggedIn() && sessionLengthInMinutes > 0) {
                this.setSessionExpiring(sessionLengthInMinutes);
            }
        },

        /**
         * @method update
         *
         * implements bundle instance update method
         */
        update: function () {

        },
        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function () {
            var sandbox = this.sandbox(),
                p;
            sandbox.removeRequestHandler('StateHandler.SetStateRequest', this.requestHandlers.setStateHandler);
            sandbox.removeRequestHandler('StateHandler.SaveStateRequest', this.requestHandlers.saveStateHandler);
            // sends a request that removes button described in config
            var rb = sandbox.getRequestBuilder('MapControls.ToolButtonRequest');
            if (rb) {
                sandbox.request(this, rb(this.toolbar.config, 'remove'));
            }

            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }
            this.sandbox.unregister(this);
            this.started = false;
        },

        /**
         * @method init
         * implements Module protocol init method
         */
        init: function () {
            var sandbox = this.sandbox;
            this.requestHandlers = {
                setStateHandler: Oskari.clazz.create('Oskari.mapframework.bundle.statehandler.request.SetStateRequestHandler', sandbox, this),
                saveStateHandler: Oskari.clazz.create('Oskari.mapframework.bundle.statehandler.request.SaveStateRequestHandler', sandbox, this)
            };
            // headless
            return null;
        },
        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for current
         * language.
         * If key-parameter is not given, returns the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *      JSON object for complete data depending on localization
         *      structure and if parameter key is given
         */
        getLocalization: function (key) {
            if (!this._localization) {
                this._localization = Oskari.getLocalization(this.getName());
            }
            if (key) {
                return this._localization[key];
            }
            return this._localization;
        },

        /**
         * @method onEvent
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or discarded
         * if not.
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);

        },

        /**
         * @property {Object} eventHandlers
         * @static
         */
        eventHandlers: {
            AfterMapMoveEvent: function (event) {
                this._pushState();
            },
            AfterMapLayerAddEvent: function (event) {
                this._pushState();
            },
            AfterMapLayerRemoveEvent: function (event) {
                this._pushState();
            },
            AfterChangeMapLayerStyleEvent: function (event) {
                this._pushState();
            },
            MapLayerVisibilityChangedEvent: function (event) {
                this._pushState();
            },
            AfterAddMarkerEvent: function (event) {
                this._pushState();
            },
            AfterRemoveMarkersEvent: function (event) {
                this._pushState();
            }
        },



        /**
         * @method registerPlugin
         * @param {Oskari.mapframework.bundle.statehandler.plugin.Plugin} plugin
         *    Implementation of the stateHandler plugin protocol/interface
         *
         * Registers the plugin to be used with this state handler implementation.
         */
        registerPlugin: function (plugin) {
            plugin.setHandler(this);
            var pluginName = plugin.getName();
            this.sandbox.printDebug('[' + this.getName() + ']' + ' Registering ' + pluginName);
            this._pluginInstances[pluginName] = plugin;
        },
        /**
         * @method unregisterPlugin
         * @param {Oskari.mapframework.bundle.statehandler.plugin.Plugin} plugin
         *    Implementation of the stateHandler plugin protocol/interface
         *
         * Tears down the registration of the plugin that was previously registered
         * to this state handler implementation.
         */
        unregisterPlugin: function (plugin) {
            var pluginName = plugin.getName();
            this.sandbox.printDebug('[' + this.getName() + ']' + ' Unregistering ' + pluginName);
            this._pluginInstances[pluginName] = undefined;
            plugin.setHandler(null);
        },
        /**
         * @method startPlugin
         * @param {Oskari.mapframework.bundle.statehandler.plugin.Plugin} plugin
         *    Implementation of the stateHandler plugin protocol/interface
         *
         * Starts the plugin. Calls plugins startPlugin()-method.
         */
        startPlugin: function (plugin) {
            var pluginName = plugin.getName();

            this.sandbox.printDebug('[' + this.getName() + ']' + ' Starting ' + pluginName);
            plugin.startPlugin(this.sandbox);
        },
        /**
         * @method stopPlugin
         * @param {Oskari.mapframework.bundle.statehandler.plugin.Plugin} plugin
         *    Implementation of the stateHandler plugin protocol/interface
         *
         * Stops the plugin. Calls plugins stopPlugin()-method.
         */
        stopPlugin: function (plugin) {
            var pluginName = plugin.getName();

            this.sandbox.printDebug('[' + this.getName() + ']' + ' Starting ' + pluginName);
            plugin.stopPlugin(this.sandbox);
        },

        /**
         * @method setCurrentViewId
         * @param {Number} Current view ID
         */
        setCurrentViewId: function (currentViewId) {
            this._currentViewId = currentViewId;
        },
        /**
         * @method getCurrentViewId
         * @return Current view ID
         */
        getCurrentViewId: function () {
            return this._currentViewId;
        },

        /* state pop / push ie undo redo begins here */

        _stateComparators: [
            {
                rule: 'nohistory',
                cmp: function (prevState, nextState) {
                    if (!prevState) {
                        return true;
                    }
                }
            },
            {
                rule: 'location',
                cmp: function (prevState, nextState) {
                    if (prevState.east !== nextState.east ||
                            prevState.north !== nextState.north) {
                        return true;
                    }

                    if (prevState.zoom !== nextState.zoom) {
                        return true;
                    }
                }
            },
            {
                rule: 'layers',
                cmp: function (prevState, nextState) {
                    var me = this,
                        prevLayers = prevState.selectedLayers,
                        nextLayers = nextState.selectedLayers,
                        ln,
                        prevLayer,
                        nextLayer;
                    if (prevLayers.length !== nextLayers.length) {
                        return true;
                    }
                    for (ln = 0; ln < nextLayers.length; ln += 1) {
                        prevLayer = prevLayers[ln];
                        nextLayer = nextLayers[ln];

                        me.sandbox.printDebug('[StateHandler] comparing layer state ' + prevLayer.id + ' vs ' + nextLayer.id);


                        if (prevLayer.id !== nextLayer.id) {
                            return true;
                        }
                        if (prevLayer.opacity !== nextLayer.opacity) {
                            return true;
                        }
                        if (prevLayer.hidden !== nextLayer.hidden) {
                            return true;
                        }
                        if (prevLayer.style !== nextLayer.style) {
                            return true;
                        }
                    }

                    return false;
                }
            },
            {
                rule: 'plugins',
                cmp: function (prevState, nextState) {
                    var prevPlugin = prevState.plugins.MainMapModuleMarkersPlugin,
                        nextPlugin = nextState.plugins.MainMapModuleMarkersPlugin,
                        prevMarkers = prevPlugin ? prevPlugin.markers : [],
                        nextMarkers = nextPlugin ? nextPlugin.markers : [];

                    if ((prevPlugin && !nextPlugin) || (!prevPlugin && nextPlugin)) {
                        return true;
                    }

                    if (prevMarkers.length !== nextMarkers.length) {
                        return true;
                    }

                    return JSON.stringify(prevMarkers) !== JSON.stringify(nextMarkers);
                }
            }
            /*{
                rule: 'plugins',
                cmp: function (prevState, nextState) {
                    var me = this,
                        prevPlugins = prevState.plugins,
                        nextPlugins = nextState.plugins,
                        pluginKey,
                        prevKeys = [],
                        nextKeys = [],
                        prevPluginState,
                        nextPluginState;

                    // Only one or other has plugins, return true
                    if ( (prevPlugins && !nextPlugins) || (!prevPlugins && nextPlugins) ) {
                        return true;
                    }

                    for (pluginKey in prevPlugins) {
                        prevKeys.push(pluginKey);
                        prevPluginState = prevPlugins[pluginKey];
                        nextPluginState = nextPlugins[pluginKey];

                        // See if the plugins have the same state
                        if (JSON.stringify(prevPluginState) !== JSON.stringify(nextPluginState)) {
                            return true;
                        }
                    }

                    for (pluginKey in nextPlugins) {
                        nextKeys.push(pluginKey);
                    }

                    // See if plugin count matches (prevPlugins loop already checks if the plugins themselves match)
                    return prevKeys.length === nextKeys.length;
                }*/
        ],

        _compareState: function (prevState, nextState, returnFirst) {
            var cmpResult = {
                result: false,
                rule: null,
                rulesMatched: {}
            };

            var me = this,
                sc,
                cmp;
            for (sc = 0; sc < me._stateComparators.length; sc += 1) {
                cmp = me._stateComparators[sc];
                me.sandbox.printDebug('[StateHandler] comparing state ' + cmp.rule);
                if (cmp.cmp.apply(this, [prevState, nextState])) {
                    me.sandbox.printDebug('[StateHandler] comparing state MATCH ' + cmp.rule);
                    cmpResult.result = true;
                    cmpResult.rule = cmp.rule;
                    cmpResult.rulesMatched[cmp.rule] = cmp.rule;
                    if (returnFirst) {
                        return cmpResult;
                    }
                }
            }
            return cmpResult;
        },

        /**
         * @method logState
         * @private
         * Sends a GET request to the url in the conf with map parameters
         */
        _logState: function () {
            var me = this,
                logUrlWithLinkParams = me.conf.logUrl + '?' + me.sandbox.generateMapLinkParameters();

            jQuery.ajax({
                type: 'GET',
                url: logUrlWithLinkParams
            });
        },

        _pushState: function () {
            var me = this;
            if (me._historyEnabled) {
                var history = me._historyPrevious,
                    state = me._getMapState(),
                    prevState = history.length === 0 ? null : history[history.length - 1],
                    cmpResult = me._compareState(prevState, state, true);
                if (cmpResult.result) {
                    me.sandbox.printDebug('[StateHandler] PUSHING state');
                    state.rule = cmpResult.rule;
                    me._historyPrevious.push(state);
                    me._historyNext = [];

                    if (me.conf && me.conf.logUrl) {
                        me._logState();
                    }
                }
            }
        },

        historyMoveNext: function () {
            var sandbox = this.getSandbox();
            if (this._historyNext.length > 0) {
                var state = this._historyNext.pop();
                this._historyPrevious.push(state);

                var mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule');
                this._historyEnabled = false;

                var currentState = this._getMapState();
                this._setMapState(mapmodule, state, currentState);
                this._historyEnabled = true;
            }
        },

        historyMovePrevious: function () {
            var sandbox = this.getSandbox();
            switch (this._historyPrevious.length) {
            case 0:
                /* hard reset */
                /*this.resetState();*/
                break;
            case 1:
                /* soft reset (retains the future) */
                var nextHistory = this._historyNext;
                this.resetState();
                this._historyNext = nextHistory;
                break;
            default:
                /* pops current state */
                var cstate = this._historyPrevious.pop(); /* currentstate */
                this._historyNext.push(cstate);
                var state = this._historyPrevious[this._historyPrevious.length - 1],
                    mapmodule = sandbox.findRegisteredModuleInstance('MainMapModule'),
                    currentState = this._getMapState();
                this._historyEnabled = false;
                this._setMapState(mapmodule, state, currentState);
                this._historyEnabled = true;
                break;
            }
        },

        /**
         * @method getMapState
         * Returns bundle state as JSON
         * @return {Object}
         */
        _getMapState: function () {
            // get applications current state
            return this.getSandbox().getStatefulComponents().mapfull.getState();
        },

        _setMapState: function (mapmodule, state, currentState) {
            var sandbox = this.getSandbox(),
                cmpResult = this._compareState(currentState, state, false);

            if (cmpResult.result) {
                this.getSandbox().getStatefulComponents().mapfull.setState(state);
            }

            // FIXME: this is what start-map-with -enhancements should be doing, they are just doing it in wrong place
            sandbox.syncMapState(true);
        },
        /**
         * @method _teardownState
         * Tears down previous state so we can set a new one.
         * @private
         * @param {Oskari.mapframework.module.Module} module
         *      any registered module so we can just send out requests
         */
        _teardownState: function (module) {
            var sandbox = this.getSandbox(),
                selectedLayers = sandbox.findAllSelectedMapLayers(),
                rbRemove = sandbox.getRequestBuilder('RemoveMapLayerRequest'), // remove all current layers
                i;
            for (i = 0; i < selectedLayers.length; i += 1) {
                sandbox.request(module.getName(), rbRemove(selectedLayers[i].getId()));
            }
        }

    }, {
        protocol: ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module']
    });
