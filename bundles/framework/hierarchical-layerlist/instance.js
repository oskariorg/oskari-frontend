/**
 * A hierarchical layerlist for handling deeper hierarchy with layers. Combines the functionality of layerselector2 and layerselection2 bundles.
 *
 * @class Oskari.framework.bundle.hierarchical-layerlist.HierarchicalLayerlistBundleInstance
 */
Oskari.clazz.define('Oskari.framework.bundle.hierarchical-layerlist.HierarchicalLayerlistBundleInstance',
    /**
     * @method create called automatically on construction
     * @static
     */
    function() {
        this.sandbox = null;
        this.started = false;
        this.plugins = {};
        this.localization = null;
        this.notifierService = null;
        this.layerlistExtenderService = null;

        this._selectedLayerGroupId = {};
    }, {
        /**
         * @static
         * @property __name
         */
        __name: 'hierarchical-layerlist',

        /*******************************************************************************************************************************
        /* PRIVATE METHODS
        *******************************************************************************************************************************/
        /**
         * Load layers
         * @method  _loadLayers
         * @private
         */
        _loadLayers: function() {
            var me = this;
            var mapLayerService = me.sandbox.getService(
                'Oskari.mapframework.service.MapLayerService'
            );
            var successCB = function() {
                me.plugins['Oskari.userinterface.Flyout'].updateSelectedLayers();
            };
            var failureCB = function() {
                alert(me.getLocalization('errors').loadFailed);
            };
            mapLayerService.loadAllLayerGroupsAjax(successCB, failureCB);
        },

        /**
         * @static
         * @property _guidedTourDelegateTemplate
         * Delegate object given to guided tour bundle instance. Handles content & actions of guided tour popup.
         * Function "this" context is bound to bundle instance
         */
        _guidedTourDelegateTemplate: {
            priority: 20,
            show: function() {
                this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'attach', 'hierarchical-layerlist']);
            },
            hide: function() {
                this.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'close', 'hierarchical-layerlist']);
            },
            getTitle: function() {
                return this.getLocalization('guidedTour').title;
            },
            getContent: function() {
                var content = jQuery('<div></div>');
                content.append(this.getLocalization('guidedTour').message);
                return content;
            },
            getLinks: function() {
                var me = this;
                var loc = this.getLocalization('guidedTour');
                var linkTemplate = jQuery('<a href="#"></a>');
                var openLink = linkTemplate.clone();
                openLink.append(loc.openLink);
                openLink.bind('click',
                    function() {
                        me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'attach', 'hierarchical-layerlist']);
                        openLink.hide();
                        closeLink.show();
                    });
                var closeLink = linkTemplate.clone();
                closeLink.append(loc.closeLink);
                closeLink.bind('click',
                    function() {
                        me.sandbox.postRequestByName('userinterface.UpdateExtensionRequest', [null, 'close', 'hierarchical-layerlist']);
                        openLink.show();
                        closeLink.hide();
                    });
                closeLink.show();
                openLink.hide();
                return [openLink, closeLink];
            }
        },

        /**
         * @method _registerForGuidedTour
         * Registers bundle for guided tour help functionality. Waits for guided tour load if not found
         */
        _registerForGuidedTour: function() {
            var me = this;

            function sendRegister() {
                var requestBuilder = Oskari.requestBuilder('Guidedtour.AddToGuidedTourRequest');
                if (requestBuilder) {
                    var delegate = {
                        bundleName: me.getName()
                    };
                    for (var prop in me._guidedTourDelegateTemplate) {
                        if (typeof me._guidedTourDelegateTemplate[prop] === 'function') {
                            delegate[prop] = me._guidedTourDelegateTemplate[prop].bind(me); // bind methods to bundle instance
                        } else {
                            delegate[prop] = me._guidedTourDelegateTemplate[prop]; // assign values
                        }
                    }
                    me.sandbox.request(me, requestBuilder(delegate));
                }
            }

            function handler(msg) {
                if (msg.id === 'guidedtour') {
                    sendRegister();
                }
            }

            var tourInstance = me.sandbox.findRegisteredModuleInstance('GuidedTour');
            if (tourInstance) {
                sendRegister();
            } else {
                Oskari.on('bundle.start', handler);
            }
        },

        /*******************************************************************************************************************************
        /* PUBLIC METHODS
        *******************************************************************************************************************************/
        /**
         * @method getName
         * @return {String} the name for the component
         */
        getName: function() {
            return this.__name;
        },
        /**
         * @method setSandbox
         * @param {Oskari.Sandbox} sandbox
         * Sets the sandbox reference to this component
         */
        setSandbox: function(sandbox) {
            this.sandbox = sandbox;
        },
        /**
         * @method getSandbox
         * @return {Oskari.Sandbox}
         */
        getSandbox: function() {
            return this.sandbox;
        },

        /**
         * @method getLocalization
         * Returns JSON presentation of bundles localization data for current language.
         * If key-parameter is not given, returns the whole localization data.
         *
         * @param {String} key (optional) if given, returns the value for key
         * @return {String/Object} returns single localization string or
         *     JSON object for complete data depending on localization
         *     structure and if parameter key is given
         */
        getLocalization: function(key) {
            if (!this._localization) {
                this._localization = Oskari.getMsg.bind(null, this.getName());
            }
            if (key) {
                return this._localization(key);
            }
            return this._localization;
        },

        /**
         * @method start
         * implements BundleInstance protocol start method
         */
        start: function() {
            var me = this,
                conf = me.conf,
                sandboxName = conf ? conf.sandbox : 'sandbox',
                sandbox = Oskari.getSandbox(sandboxName),
                request,
                p;

            if (me.started) {
                return;
            }

            me.started = true;
            me.sandbox = sandbox;

            sandbox.register(me);

            // create the OskariEventNotifierService for handling Oskari events.
            var notifierService = Oskari.clazz.create('Oskari.framework.bundle.hierarchical-layerlist.OskariEventNotifierService');
            sandbox.registerService(notifierService);
            me.notifierService = notifierService;
            me.notifierService.eventHandlers.forEach(function(eventName){
                sandbox.registerForEventByName(me.notifierService, eventName);
            });

            // create the LayerlistExtenderService for extend layerlist functions.
            var layerlistExtenderService = Oskari.clazz.create('Oskari.framework.bundle.hierarchical-layerlist.LayerlistExtenderService');
            sandbox.registerService(layerlistExtenderService);
            me.layerlistExtenderService = layerlistExtenderService;

            var layerlistService = Oskari.clazz.create('Oskari.mapframework.service.LayerlistService');
            sandbox.registerService(layerlistService);

            //Let's extend UI
            request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(me);
            sandbox.request(me, request);

            // create and register request handlers
            var reqHandler = Oskari.clazz.create('Oskari.mapframework.bundle.layerselector2.request.ShowFilteredLayerListRequestHandler', sandbox, this);
            sandbox.addRequestHandler('ShowFilteredLayerListRequest', reqHandler);

            var reqHandlerAddLayerListFilter = Oskari.clazz.create('Oskari.mapframework.bundle.layerselector2.request.AddLayerListFilterRequestHandler', sandbox, this);
            sandbox.addRequestHandler('AddLayerListFilterRequest', reqHandlerAddLayerListFilter);

            // draw ui
            me.createUi();

            sandbox.registerAsStateful(me.mediator.bundleId, me);

            this._registerForGuidedTour();

            this._loadLayers();
        },


        /**
         * @method init
         * implements Module protocol init method - does nothing atm
         */
        init: function() {
            return null;
        },
        /**
         * @method update
         * implements BundleInstance protocol update method - does nothing atm
         */
        update: function() {
        },

        /**
         * @method stop
         * implements BundleInstance protocol stop method
         */
        stop: function() {
            var me = this,
                sandbox = me.sandbox(),
                request,
                p;

            for (p in me.eventHandlers) {
                if (me.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(me, p);
                }
            }

            request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

            sandbox.request(me, request);

            me.sandbox.unregisterStateful(me.mediator.bundleId);
            me.sandbox.unregister(me);
            me.started = false;
        },
        /**
         * @method startExtension
         * implements Oskari.userinterface.Extension protocol startExtension method
         * Creates a flyout and a tile:
         * Oskari.framework.bundle.hierarchical-layerlist.Flyout
         * Oskari.framework.bundle.hierarchical-layerlist.Tile
         */
        startExtension: function() {
            this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create(
                'Oskari.framework.bundle.hierarchical-layerlist.Flyout',
                this
            );
            this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create(
                'Oskari.framework.bundle.hierarchical-layerlist.Tile',
                this
            );
        },
        /**
         * @method stopExtension
         * implements Oskari.userinterface.Extension protocol stopExtension method
         * Clears references to flyout and tile
         */
        stopExtension: function() {
            this.plugins['Oskari.userinterface.Flyout'] = null;
            this.plugins['Oskari.userinterface.Tile'] = null;
        },
        /**
         * @method getPlugins
         * implements Oskari.userinterface.Extension protocol getPlugins method
         * @return {Object} references to flyout and tile
         */
        getPlugins: function() {
            return this.plugins;
        },
        /**
         * @method getTitle
         * @return {String} localized text for the title of the component
         */
        getTitle: function() {
            return this.getLocalization('title');
        },
        /**
         * @method getDescription
         * @return {String} localized text for the description of the component
         */
        getDescription: function() {
            return this.getLocalization('desc');
        },
        /**
         * @method createUi
         * (re)creates the UI for "all layers" functionality
         */
        createUi: function() {
            var me = this;
            me.plugins['Oskari.userinterface.Flyout'].createUi();
            me.plugins['Oskari.userinterface.Tile'].refresh();
        },

        /**
         * @method setState
         * @param {Object} state bundle state as JSON
         */
        setState: function(state) {
            this.plugins['Oskari.userinterface.Flyout'].setContentState(state);
        },

        /**
         * @method getState
         * @return {Object} bundle state as JSON
         */
        getState: function() {
            return this.plugins['Oskari.userinterface.Flyout'].getContentState();
        }
    }, {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: [
            'Oskari.bundle.BundleInstance',
            'Oskari.mapframework.module.Module',
            'Oskari.userinterface.Extension'
        ]
    }
);