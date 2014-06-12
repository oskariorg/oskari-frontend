/**
 * @class Oskari.mapframework.sandbox.Sandbox
 *
 * Sandbox is the component providing bundles ways to get information about the status of the system
 * and communicate to other bundles using requests and events. Sandbox is created at the same time as
 * Oskari.mapframework.core.Core. Module init/start/stop methods get reference to sandbox through
 * the Oskari Module protocol.
 */
Oskari.clazz.define('Oskari.mapframework.sandbox.Sandbox',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.mapframework.core.Core} core
     */

    function (core) {

        this._core = core;

        /*
         * All registered listeners in map key: event name value:
         * array of modules who are interested in this type of event
         */
        this._listeners = [];

        /* array of all registered modules */
        this._modules = [];
        this._modulesByName = {};
        this._statefuls = {};

        /* as of 2012-09-24 debug by default false */
        this.debugRequests = false;
        this.debugEvents = false;
        this.requestEventLog = [];
        this.requestEventStack = [];

        // TODO: move to some conf?
        /* as of 2012-09-24 debug by default false */
        this.gatherDebugRequests = false;
        this.maxGatheredRequestsAndEvents = 4096;
        this.requestAndEventGather = [];
        this._eventLoopGuard = 0;

        this._user = null;
        this._ajaxUrl = null;
    }, {

        /**
         * @method disableDebug
         * Disables debug messaging and sequence diagram gathering
         * if( core is set ) also core debug will be disabled
         */
        disableDebug: function () {
            this.debugRequests = false;
            this.debugEvents = false;
            this.gatherDebugRequests = false;
            if (this._core) {
                this._core.disableDebug();
            }
        },

        /** 
         * @method enableDebug
         * Enables debug messaging and sequence diagram gathering (by default not enabled)
         * if( core is set ) also core debug will be enabled
         */
        enableDebug: function () {
            this.debugRequests = true;
            this.debugEvents = true;
            this.gatherDebugRequests = true;
            if (this._core) {
                this._core.enableDebug();
            }

        },

        /**
         * @method printDebug
         * Utility method for printing debug messages to browser console
         * @param {String} text - message to print
         */
        printDebug: function (text) {
            this._core.printDebug(text);
        },

        /**
         * @method printWarn
         * Utility method for printing warn messages to browser console
         * @param {String} text
         */
        printWarn: function (text) {
            /* forward warning to core */
            this._core.printWarn(text);
        },
        /**
         * @method setUser
         *
         * Creates Oskari.mapframework.domain.User from the given data as current
         * user
         * @param {Object} userData
         *     JSON presentation of user
         */
        setUser: function (userData) {
            this._user = Oskari.clazz.create('Oskari.mapframework.domain.User', userData);
        },
        /**
         * @method getUser
         * Returns current user. See #setUser
         *
         * @return {Oskari.mapframework.domain.User} user
         */
        getUser: function () {
            if (!this._user) {
                // init user
                this.setUser();
            }
            return this._user;
        },

        /**
         * @method setAjaxUrl
         * Sets a global Url that is used to communicate with the server
         * @param {String} pUrl
         */
        setAjaxUrl: function (pUrl) {
            this._ajaxUrl = pUrl;
        },
        /**
         * @method getAjaxUrl
         * Returns global ajax url for the application. See #setAjaxUrl
         * @return {String}
         */
        getAjaxUrl: function () {
            return this._ajaxUrl;
        },


        /**
         * @method registerService
         * Registers given service to Oskari system
         *
         * @param {Oskari.mapframework.service.Service}
         *            service service to register
         */
        registerService: function (service) {
            this._core.registerService(service);
        },
        /**
         * Method for asking a registered service
         *
         * @param {String}
         *            serviceQName that identifies the service in the core
         * @return {Oskari.mapframework.service.Service}
         */
        getService: function (type) {
            return this._core.getService(type);
        },
        /**
         * @method registerAsStateful
         * Registers given bundle instance to sandbox as stateful
         *
         * @param {String}
         *            pBundleId bundle instance id to which the state will be mapped
         * to
         * @param {Oskari.bundle.BundleInstance}
         *            pInstance reference to actual bundle instance
         */
        registerAsStateful: function (pBundleId, pInstance) {
            this._statefuls[pBundleId] = pInstance;
        },
        /**
         * @method unregisterStateful
         * Unregisters given bundle instance from stateful bundles in sandbox
         *
         * @param {String}
         *            pBundleId bundle instance id which to unregister
         */
        unregisterStateful: function (pBundleId) {
            this._statefuls[pBundleId] = null;
            delete this._statefuls[pBundleId];
        },
        /**
         * @method getStatefulComponents
         * Returns an object that has references to stateful components (see
         * #registerAsStateful).
         * The objects propertynames match the instance id and property value is
         * reference to the stateful component.
         * @return {Object}
         */
        getStatefulComponents: function () {
            return this._statefuls;
        },

        /**
         * @method register
         * Registers given module to sandbox and calls the modules init() method
         *
         * @param {Oskari.mapframework.module.Module}
         *            module
         */
        register: function (module) {
            this._modules.push(module);
            this._modulesByName[module.getName()] = module;
            return module.init(this);
        },

        /**
         * @method unregister
         * Unregisters given module from sandbox
         *
         * @param {Oskari.mapframework.module.Module}
         *            module
         */
        unregister: function (module) {
            var me = this,
                remainingModules = [],
                m;
            for (m = 0; m < me._modules.length; m++) {
                if (module === me._modules[m]) {
                    continue;
                }
                remainingModules.push(me._modules[m]);
            }
            me._modules = remainingModules;
            me._modulesByName[module.getName()] = undefined;
            delete me._modulesByName[module.getName()];
        },

        /**
         * @method registerForEventByName
         * Registers given module to listen to given event
         *
         * @param {Oskari.mapframework.module.Module} module
         * @param {String} eventName
         */
        registerForEventByName: function (module, eventName) {

            this._core.printDebug("#*#*#* Sandbox is registering module '" + module.getName() + "' to event '" + eventName + "'");
            var oldListeners = this._listeners[eventName];
            if (oldListeners === null || oldListeners === undefined) {
                oldListeners = [];
                this._listeners[eventName] = oldListeners;
            }

            oldListeners.push(module);
            this._core.printDebug("There are currently " + oldListeners.length + " listeners for event '" + eventName + "'");
        },

        /**
         * @method unregisterFromEventByName
         * Unregisters given module from listening to given event
         *
         * @param {Oskari.mapframework.module.Module} module
         * @param {String} eventName
         */
        unregisterFromEventByName: function (module, eventName) {
            this._core.printDebug("Sandbox is unregistering module '" + module.getName() + "' from event '" + eventName + "'");
            var oldListeners = this._listeners[eventName],
                deleteIndex = -1,
                d;
            if (oldListeners === null || oldListeners === undefined) {
                // no listeners
                this._core.printDebug("Module does not listen to that event, skipping.");
                return;
            }

            for (d = 0; d < oldListeners.length; d++) {
                if (oldListeners[d] === module) {
                    deleteIndex = d;
                    break;
                }
            }
            if (deleteIndex > -1) {
                oldListeners.splice(deleteIndex, 1);
                this._core.printDebug("Module unregistered successfully from event");
            } else {
                this._core.printDebug("Module does not listen to that event, skipping.");
            }
        },

        /**
         * @method getRequestBuilder
         *
         * Access to request builder that creates requests by name
         * rather than by class name
         * @param {String} name request name that we are creating
         * @return {Function} builder function for given request
         */
        getRequestBuilder: function (name) {
            return this._core.getRequestBuilder(name);
        },

        /**
         * @method getEventBuilder
         *
         * Access to event builder that creates events by name
         *
         * @param {String} name request name that we are creating
         * @return {Function} builder function for given event
         */
        getEventBuilder: function (name) {
            return this._core.getEventBuilder(name);
        },

        /**
         * @method request
         * Registered modules can request work to be done using this method
         *
         * @param {Oskari.mapframework.module.Module/String} creator
         *            that created request. This can be either actual
         *            module or the name of the module. Both are
         *            accepted.
         * @param {Oskari.mapframework.request.Request} request
         *            request to be performed
         */
        request: function (creator, request) {
            var creatorName = null,
                creatorComponent,
                rv = null;
            if (creator.getName !== null && creator.getName !== undefined) {
                creatorName = creator.getName();
            } else {
                creatorName = creator;
            }
            creatorComponent = this.findRegisteredModuleInstance(creatorName);

            if (creatorComponent === null || creatorComponent === undefined) {
                throw "Attempt to create request with unknown component '" + creator + "' as creator";
            }

            this._core.setObjectCreator(request, creatorName);

            this.printDebug("Module '" + creatorName + "' is requesting for '" + this.getObjectName(request) + "'...");

            if (this.gatherDebugRequests) {
                this._pushRequestAndEventGather(creatorName + "->Sandbox: ", this.getObjectName(request));
            }

            this._debugPushRequest(creatorName, request);
            rv = this._core.processRequest(request);
            this._debugPopRequest();

            return rv;
        },

        /**
         * @method requestByName
         * Registered modules can request work to be done using this method.
         *
         * This is a utility to work with request names instead of constructing
         * request objects
         *
         * @param {Oskari.mapframework.module.Module/String} creator
         *            that created request. This can be either actual
         *            module or the name of the module. Both are
         *            accepted.
         * @param {String} requestName (this is NOT the request class name)
         * @param {Array} requestArgs (optional)
         * @return {Boolean} Returns true, if request was handled, false otherwise
         */
        requestByName: function (creator, requestName, requestArgs) {

            this.printDebug("#!#!#! --------------> requestByName " + requestName);
            var requestBuilder = this.getRequestBuilder(requestName);
            var request = requestBuilder.apply(this, requestArgs || []);
            return this.request(creator, request);
        },

        /**
         * @property postMasterComponent
         * @static
         * Used as request/event sender if creator cannot be determined
         */
        postMasterComponent: "postmaster",

        /**
         * @method postRequestByName
         *
         * This posts a request for processing. As the method doesn't require
         * a registered bundle to be the sender of the request
         * #postMasterComponent property will be used as creator
         *
         * NOTE! This is asynchronous - by design.
         *
         * This attempts to loose some stack frames as well as provide
         * some yield time for the browser.
         *
         * @param {String} requestName (this is NOT the request class name)
         * @param {Array} requestArgs (optional)
         */
        postRequestByName: function (requestName, requestArgs) {
            var me = this,
                requestBuilder = me.getRequestBuilder(requestName);
            if (!requestBuilder) {
                return;
            }
            window.setTimeout(function () {

                var request = requestBuilder.apply(me, requestArgs || []),
                    creatorComponent = this.postMasterComponent,
                    rv = null;
                me._core.setObjectCreator(request, creatorComponent);

                if (me.gatherDebugRequests) {
                    me._pushRequestAndEventGather(creatorComponent + "->Sandbox: ", me.getObjectName(request));
                }

                if (this.debugRequests) {
                    me._debugPushRequest(creatorComponent, request);
                }

                rv = me._core.processRequest(request);

                if (this.debugRequests) {
                    me._debugPopRequest();
                }

            }, 0);

        },

        /**
         * @method _findModulesInterestedIn
         * Internal method for finding modules that are interested
         * in given event
         * @private
         * @param {Oskari.mapframework.event.Event} event
         * @return {Oskari.mapframework.module.Module[]} modules listening to the event
         */
        _findModulesInterestedIn: function (event) {
            var eventName = event.getName(),
                currentListeners = this._listeners[eventName];
            if (!currentListeners) {
                return [];
            }
            return currentListeners;
        },

        /**
         * @method notifyAll
         * Finds out registered modules that are interested in given event and
         * notifies them
         *
         * @param {Oskari.mapframework.event.Event} event - event to send
         * @param {Boolean} retainEvent true to not send event but only print debug which modules are listening, usually left undefined (optional)
         */
        notifyAll: function (event, retainEvent) {
            var eventName;
            if (!retainEvent) {

                eventName = event.getName();
                this._core.printDebug("Sandbox received notifyall for event '" + eventName + "'");
            }

            var modules = this._findModulesInterestedIn(event),
                i,
                module;
            if (!retainEvent) {
                this._core.printDebug("Found " + modules.length + " interested modules");
            }
            for (i = 0; i < modules.length; i++) {
                module = modules[i];
                if (!retainEvent) {
                    this._core.printDebug("Notifying module '" + module.getName() + "'.");

                    if (this.gatherDebugRequests) {
                        this._pushRequestAndEventGather("Sandbox->" + module.getName() + ":", eventName);
                    }
                }

                this._debugPushEvent(this.getObjectCreator(event), module, event);
                module.onEvent(event);
                this._debugPopEvent();
            }

            // finally clean event memory
            if (!retainEvent) {
                // FIXME only properties should be deleted
                delete event;
            }
        },

        /**
         * @method findRegisteredModuleInstance
         * Returns module with given name if it is registered to sandbox
         *
         * @param {String} name for the module
         * @return {Oskari.mapframework.module.Module} registered module or null if not found
         */
        findRegisteredModuleInstance: function (name) {
            return this._modulesByName[name];
        },

        /**
         * @method getRequestParameter
         * Returns a request parameter from query string
         * http://javablog.info/2008/04/17/url-request-parameters-using-javascript/
         * @param {String} name - parameter name
         * @return {String} value for the parameter or null if not found
         */
        getRequestParameter: function (name) {
            return this._core.getRequestParameter(name);
        },


        /**
         * @method getBrowserWindowSize
         * Returns an object with properties width and height as the window size in pixels
         * @return {Object} object with properties width and height as the window size in pixels
         */
        getBrowserWindowSize: function () {
            // FIXME get rid of jQuery.browser and make this code sane... height isn't used for anything?
            if (jQuery.browser.opera && window.innerHeight !== null && window.innerHeight !== undefined) {
                var height = window.innerHeight;
            }
            var width = jQuery(window).width();

            var size = {};
            size.height = jQuery(window).height();
            size.width = width;

            this.printDebug("Got browser window size is: width: " + size.width + " px, height:" + size.height + " px.");

            return size;
        },

        /**
         * @method getObjectName
         * Returns Oskari event/request name from the event/request object
         * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} obj
         * @return {String} name
         */
        getObjectName: function (obj) {
            return this._core.getObjectName(obj);
        },
        /**
         * @method getObjectCreator
         * Returns Oskari event/request creator from the event/request object
         * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} obj
         * @return {String} creator
         */
        getObjectCreator: function (obj) {
            return this._core.getObjectCreator(obj);
        },
        /**
         * @method setObjectCreator
         * Sets a creator to Oskari event/request object
         * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} obj
         * @param {String} creator
         */
        setObjectCreator: function (obj, creator) {
            return this._core.setObjectCreator(obj, creator);
        },
        /**
         * @method copyObjectCreatorToFrom
         * Copies creator from objFrom to objTo
         * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} objTo
         * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} objFrom
         */
        copyObjectCreatorToFrom: function (objTo, objFrom) {
            return this._core.copyObjectCreatorToFrom(objTo, objFrom);
        },

        /**
         * @method addRequestHandler
         * Registers a request handler for requests with the given name
         * NOTE: only one request handler can be registered/request
         * @param {String} requestName - name of the request
         * @param {Oskari.mapframework.core.RequestHandler} handlerClsInstance request handler
         */
        addRequestHandler: function (requestName, handlerClsInstance) {
            return this._core.addRequestHandler(requestName, handlerClsInstance);
        },

        /**
         * @method removeRequestHandler
         * Unregisters a request handler for requests with the given name
         * NOTE: only one request handler can be registered/request
         * @param {String} requestName - name of the request
         * @param {Oskari.mapframework.core.RequestHandler} handlerClsInstance request handler
         */
        removeRequestHandler: function (requestName, handlerInstance) {
            return this._core.removeRequestHandler(requestName, handlerInstance);
        },

        /**
         * @method _debugPushRequest
         * @private
         * Adds request to list so we can show a debugging diagram with
         * popUpSeqDiagram() method
         *
         * @param {String} creator name for the component sending the request
         * @param {Oskari.mapframework.request.Request} req - request that was sent
         */
        _debugPushRequest: function (creator, req) {
            if (!this.debugRequests) {
                return;
            }
            var reqLog = {
                from: creator,
                reqName: req.getName()
            };
            this.requestEventStack.push(reqLog);
            this.requestEventLog.push(reqLog);
            if (this.requestEventLog.length > 64) {
                this.requestEventLog.shift();
            }
        },
        /**
         * @method _debugPopRequest
         * @private
         * Pops the request from the debugging stack
         */
        _debugPopRequest: function () {
            if (!this.debugRequests) {
                return;
            }
            this.requestEventStack.pop();
        },

        /**
         * @method _debugPushEvent
         * @private
         * Adds event to list so we can show a debugging diagram with
         * popUpSeqDiagram() method
         *
         * @param {String} creator - name for the component sending the event
         * @param {Oskari.mapframework.module.Module} target - module that is receiving the event
         * @param {Oskari.mapframework.event.Event} evt - event that was sent
         */
        _debugPushEvent: function (creator, target, evt) {
            if (!this.debugEvents) {
                return;
            }
            this._eventLoopGuard++;

            if (this._eventLoopGuard > 64) {
                throw "Events Looped?";
            }

            var evtLog = {
                from: creator,
                to: target.getName(),
                evtName: evt.getName()
            };
            this.requestEventStack.push(evtLog);
            this.requestEventLog.push(evtLog);
            if (this.requestEventLog.length > 64) {
                this.requestEventLog.shift();
            }
        },

        /**
         * @method _debugPopRequest
         * @private
         * Pops the event from the debugging stack
         */
        _debugPopEvent: function () {
            if (!this.debugEvents) {
                return;
            }
            this._eventLoopGuard--;
            this.requestEventStack.pop();
        },

        /**
         * @method _pushRequestAndEventGather
         * @private
         * Adds request/event to list so we can show a debugging diagram with
         * popUpSeqDiagram() method
         *
         * @param {String} name for the component sending the request
         * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} req - request that was sent
         */
        _pushRequestAndEventGather: function (name, request) {
            var module = {};
            module.name = name;
            module.request = request;
            this.requestAndEventGather.push(module);
            if (this.requestAndEventGather.length > this.maxGatheredRequestsAndEvents) {
                this.requestAndEventGather.shift();
            }
        },
        /**
         * @method popUpSeqDiagram
         * Opens a new window containing a sequence diagram of requests and events that has been sent
         * for debugging purposes. Uses request/event creator to be set so to get usable diagram, requests
         * should be sent from registered modules (instead of postRequestByName()).
         *
         * Use #enableDebug() to enable data gathering.
         *
         * Uses www.websequencediagrams.com to create the diagram.
         */
        popUpSeqDiagram: function () {
            var seq_html = '<html><head></head><body><div class="wsd" wsd_style="modern-blue"><pre>',
                seq_commands = '',
                openedWindow,
                x;
            for (x in this.requestAndEventGather) {
                if (this.requestAndEventGather.hasOwnProperty(x)) {
                    seq_commands += this.requestAndEventGather[x].name + this.requestAndEventGather[x].request + "\n";
                }
            }
            if (seq_commands !== '') {
                seq_html += seq_commands + '</pre></div><script type="text/javascript" src="http://www.websequencediagrams.com/service.js"></script></body></html>';
                openedWindow = window.open();
                openedWindow.document.write(seq_html);
                this.requestAndEventGather = [];
            } else {
                alert('No requests in queue');
            }
        },
        /**
         * @method getLocalizedProperty
         * @param property Property
         * @param lang Optional language
         */
        getLocalizedProperty: function (property, lang) {
            var ret,
                supportedLocales,
                i,
                language = lang || Oskari.getLang();
            if (property === null || property === undefined) {
                return null;
            }
            if (typeof property === 'object') {
                // property value is an object, so it's prolly localized
                ret = property[language];
                if (ret === null) {
                    supportedLocales = Oskari.getSupportedLocales();
                    for (i = 0; i < supportedLocales.length; i += 1) {
                        ret = property[supportedLocales[i]];
                        if (ret) {
                            // We found the property in _some_ language...
                            break;
                        }
                    }
                    // TODO (needs supportedLocales)
                    // try default lang
                    // try any lang?
                }
                return ret;
            }
            // property is not localized
            return property;
        }
    });
