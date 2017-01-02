/**
 * @class Oskari.mapframework.core.Core
 *
 * This is the Oskari core. Bundles can register modules and services here for other bundles to reference.
 * Requests and events are forwarded through the core to handlers.
 * TODO: Move handlers (and events as well as requests) to handler bundles with
 * registrable handlers
 */
(function(Oskari) {
    var log = Oskari.log('Core');

    Oskari.clazz.define('Oskari.mapframework.core.Core',

    /**
     * @method create called automatically on construction
     * @static
     */
    function () {

        // Currently Highlighted maplayers
        this._mapLayersHighlighted = [];

        // Are we currently printing debug (as of 2012-09-24 debug by default false)
        this._debug = false;
    }, {

        /**
         * @method init
         * Inits Oskari core so bundles can reference components/services through sandbox
         */
        init: function () {
            log.debug('Initializing core...');

            this.handleMapLinkParams();

            log.debug('Modules started. Core ready.');
        },
        handleMapLinkParams: function() {
            log.debug('Checking if map is started with link...');
            var reqParam = Oskari.util.getRequestParam;
            var coord = reqParam('coord'),
                zoomLevel = reqParam('zoomLevel'),
                mapLayers = reqParam('mapLayers'),
                markerVisible = reqParam('showMarker'),
                markerVisibleOption2 = reqParam('isCenterMarker'),
                keepLayersOrder = reqParam('keepLayersOrder', true);

            if (coord === null || zoomLevel === null) {
                // not a link
                return;
            }

            var splittedCoord;

            /*
             * Coordinates can be splitted either with new "_" or
             * old "%20"
             */
            if (coord.indexOf('_') >= 0) {
                splittedCoord = coord.split('_');
            } else {
                splittedCoord = coord.split('%20');
            }

            var longitude = splittedCoord[0],
                latitude = splittedCoord[1];
            if (longitude === null || latitude === null) {
                log.debug('Could not parse link location. Skipping.');
                return;
            }
            log.debug('This is startup by link, moving map...');
            Oskari.getSandbox().getMap().moveTo(longitude, latitude, zoomLevel);
        },

        /**
         * @method dispatch
         * Dispatches given event to sandbox
         *
         * @param {Oskari.mapframework.event.Event}
         *            event - event to dispatch
         */
        dispatch: function (event) {
            // TODO: to be removed.
            Oskari.getSandbox().notifyAll(event);
        },
        getLayerService : function() {
            // TODO: to be removed.
            return Oskari.getSandbox().getService('Oskari.mapframework.service.MapLayerService');
        },
        getMapState : function() {
            // TODO: to be removed.
            return Oskari.getSandbox().getMap();
        },

        /**
         * @property defaultRequestHandlers
         * @static
         * Default Request handlers
         * Core still handles some Requests sent by bundles.
         * TODO: Request handling should be moved to apropriate bundles.
         * NOTE: only one request handler can be registered/request
         */
        defaultRequestHandlers: {
            'RearrangeSelectedMapLayerRequest': function (request) {
                this.getMapState().moveLayer(request.getMapLayerId(), request.getToPosition(), request._creator);
                return true;
            },
            'ChangeMapLayerOpacityRequest': function (request) {
                this._handleChangeMapLayerOpacityRequest(request);
                return true;
            },
            'ChangeMapLayerStyleRequest': function (request) {
                this._handleChangeMapLayerStyleRequest(request);
                return true;
            }
        },

        /**
         * @method processRequest
         * Forwards requests to corresponding request handlers.
         * If request doesn't have handler, prints warning to console.
         * @param {Oskari.mapframework.request.Request} request to forward
         * @return {Boolean} Returns true, if request was handled, false otherwise
         */
        processRequest: function (request) {
            var requestName = request.getName(),
                handlerFunc = this.__getRequestHandlerFunction(requestName);

            if (handlerFunc) {
                return handlerFunc(this, request);
            } else {
                log.warn('!!!');
                log.warn('  There is no handler for');
                log.warn('  \'' + request.getName() + '\'');
                return false;
            }
        },
        /**
         * Determine handler for request form either internal (core) handlers or handlers 
         * registered by bundles. 
         * Wraps the functions to apply the correct scope and same parameters for each type.
         * 
         * @param  {String} requestName   name of the request to handle
         * @return {function}             function to call for handling request
         */
        __getRequestHandlerFunction : function(requestName) {
            var handlerFunc = this.defaultRequestHandlers[requestName],
                handlerClsInstance;
            if (handlerFunc) {
                // found from core handlers
                return function(core, request) {
                    handlerFunc.apply(core, [request]);
                };
            } else {
                // handlers registered by bundle
                handlerClsInstance = Oskari.getSandbox().requestHandler(requestName);
                if (handlerClsInstance && handlerClsInstance.handleRequest) {
                    return function(core, request) {
                        handlerClsInstance.handleRequest.apply(handlerClsInstance, [core, request]);
                    };
                }
            }
            return undefined;
        },


        /**
         * @method disableDebug
         * Disables debug logging
         */
        disableDebug: function () {
            this._debug = false;
        },

        /**
         * @method enableDebug
         * Enables debug logging
         */
        enableDebug: function () {
            this._debug = true;
        },

        /**
         * @method getObjectName
         * Returns Oskari event/request name from the event/request object
         * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} obj
         * @return {String} name
         */
        getObjectName: function (obj) {
            return obj.__name;
        },
        /**
         * @method getObjectCreator
         * Returns Oskari event/request creator from the event/request object
         * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} obj
         * @return {String} creator
         */
        getObjectCreator: function (obj) {
            return obj._creator;
        },
        /**
         * @method setObjectCreator
         * Sets a creator to Oskari event/request object
         * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} obj
         * @param {String} creator
         */
        setObjectCreator: function (obj, creator) {
            obj._creator = creator;
        },
        /**
         * @method copyObjectCreatorToFrom
         * Copies creator from objFrom to objTo
         * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} objTo
         * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} objFrom
         */
        copyObjectCreatorToFrom: function (objTo, objFrom) {
            objTo._creator = objFrom._creator;
        }
    });
}(Oskari));