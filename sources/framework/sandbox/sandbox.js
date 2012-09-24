/**
 * @class Oskari.mapframework.sandbox.Sandbox
 *
 * Module init/start/stop methods get reference to sandbox through the Oskari
 * Module protocol.
 * TODO: documentation TBD
 */
Oskari.clazz.define('Oskari.mapframework.sandbox.Sandbox', function(core) {

    /* Core */
    this._core = core;

    /*
     * All registered listeners in map key: event name value:
     * array of modules who are interested in this type of event
     */
    this._listeners = new Array();

    /* array of all registered modules */
    this._modules = new Array();
    this._modulesByName = {};
    this._statefuls = {};

	/* as of 2012-09-24 debug by default false */
    this.debugRequests = false;
    this.debugEvents = false;
    this.requestEventLog = [];
    this.requestEventStack = [];

	/* as of 2012-09-24 debug by default false */
    this.gatherDebugRequests = false;
    this.maxGatheredRequestsAndEvents = 4096;
    // TODO: move to some conf?
    this.requestAndEventGather = [];

    this._user = null;
    this._ajaxUrl = null;
}, {
	
	/**
	 * @method disableDebug
	 * disables debug messaging and sequence diagram gathering
	 * if( core is set ) also core debug will be disabled
	 */
    disableDebug : function() {
        this.debugRequests = false;
        this.debugEvents = false;
        this.gatherDebugRequests = false;
        if( this._core ) {
        	this._core.disableDebug();
        }
    },
    
    /** @method enableDebug
     * enables debug messaging and sequence diagram gathering (by default not enabled)
     * if( core is set ) also core debug will be enabled
     */
    enableDebug : function() {
        this.debugRequests = true;
        this.debugEvents = true;
        this.gatherDebugRequests = true;
        if( this._core ) {
        	this._core.enableDebug();
        }

    },

    /**
     * Utility method for printing some debug
     */
    printDebug : function(text) {
        /* forward debugging to core */
        this._core.printDebug(text);
    },

    /**
     * @method setUser
     * @param {Object} userData
     *     JSON presentation of user
     * Creates Oskari.mapframework.domain.User from the given data as current
     * user
     */
    setUser : function(userData) {
        /* Create a user object */
        this._user = Oskari.clazz.create('Oskari.mapframework.domain.User', userData);
    },
    /**
     * @method getUser
     * @return {Oskari.mapframework.domain.User} user
     *
     * Returns current user. See #setUser
     */
    getUser : function() {
        if (!this._user) {
            // init user
            this.setUser();
        }
        return this._user;
    },

    /**
     * @method setAjaxUrl
     * @param {String} pUrl
     *     Url that is used to communicate with the server
     */
    setAjaxUrl : function(pUrl) {
        this._ajaxUrl = pUrl;
    },
    /**
     * @method getAjaxUrl
     * @return {String} user
     *
     * Returns ajax url for the application. See #setAjaxUrl
     */
    getAjaxUrl : function() {
        return this._ajaxUrl;
    },

    /**
     * Prints given warn text to console
     *
     * @param {Object}
     *            text
     */
    printWarn : function(text) {
        /* forward warning to core */
        this._core.printWarn(text);
    },

    /**
     * Method for asking localized message
     * @deprecated Use new locale system instead
     *
     * @param {Object}
     *            messageKey that should give you localized test
     */
    getText : function(messageKey, params) {
        this._core.printDebug('sandbox.getText() is deprecated - Use new locale system instead');
        return this._core.getText(messageKey, params);
    },

    /**
     * @method registerService
     * Registers given service to core
     *
     * @param {Oskari.mapframework.service.Service}
     *            service service to register
     */
    registerService : function(service) {
        this._core.registerService(service);
    },
    /**
     * Method for asking a registered service
     *
     * @param {Object}
     *            serviceQName that identifies the service in the core
     */
    getService : function(type) {
        return this._core.getService(type);
    },
    /**
     * Shows popup message with given title key and message key.
     *
     * @param title_key
     *            key for title
     * @param message_key
     *            key for actual message
     *
     * @param placeholders
     *            placeholders enable you to replace parts of
     *            message by replacing special strings inside
     *            message. placeholders are marked inside
     *            message using ##number## notation and these
     *            replacements should be given in an array for
     *            this method. For example givin calling
     *            showPopup('key', 'message', ['this is
     *            replacement 1', 'this is replacement 2']);
     *            method will replace ##0## with 'this is
     *            replacement 1' and ##1## with 'this is
     *            replacement 2'
     *
     */
    showPopupText : function(title_key, message_key, placeholders) {
        return this._core.showPopupText(title_key, message_key, placeholders);
    },
    /**
     * @method registerAsStateful
     * Registers given bundle instance to sandbox as stateful
     *
     * @param {String}
     *            pBundleId bundle instance id to which the state will be mapped
     * to
     * @param {Oskari.bundle.BundleInstance}
     *            pInstance reference to actual instance
     */
    registerAsStateful : function(pBundleId, pInstance) {
        this._statefuls[pBundleId] = pInstance;
    },
    /**
     * @method unregisterStateful
     * Unregisters given bundle instance from stateful bundles in sandbox
     *
     * @param {String}
     *            pBundleId bundle instance id to which the state will be mapped
     * to
     */
    unregisterStateful : function(pBundleId) {
        this._statefuls[pBundleId] = null;
        delete this._statefuls[pBundleId];
    },
    /**
     * @method getStatefulComponents
     * Returns an object that has references to stateful components (see
     * #registerAsStateful).
     * The objects propertynames match the instance id and property value is
     * reference to the stateful component.
     *
     */
    getStatefulComponents : function() {
        return this._statefuls;
    },

    /**
     * @method register
     * Registers given module to sandbox
     *
     * @param {Oskari.mapframework.module.Module}
     *            module
     */
    register : function(module) {
        this._modules.push(module);
        this._modulesByName[module.getName()] = module;
        this._core.registerFrameworkComponentToRuntimeEnvironment(module, module.getName());
        return module.init(this);
    },

    unregister : function(module) {
        var remainingModules = [];
        for (var m = 0; m < this._modules.length; m++) {
            if (module === this._modules[m]) {
                continue;
            }
            remainingModules.push(this._modules[m]);
        }
        this._modules = remainingModules;
        this._modulesByName[module.getName()] = undefined;

        this._core.unregisterFrameworkComponentFromRuntimeEnvironment(module, module.getName());
        // return module.deinit(this);
    },

    /**
     * Registers given module to listen to given event
     *
     * @param {Object}
     *            module
     * @param {Object}
     *            event
     */
    registerForEvent : function(module, event) {
        var eventName = event.getName();
        this._core.printDebug("Sandbox is registering module '" + module.getName() + "' to event '" + eventName + "'");
        var oldListeners = this._listeners[eventName];
        if (oldListeners == null) {
            oldListeners = new Array();
            this._listeners[eventName] = oldListeners;
        }

        oldListeners.push(module);
        this._core.printDebug("There are currently " + oldListeners.length + " listeners for event '" + eventName + "'");
        delete event;
    },
    registerForEventByName : function(module, eventName) {

        this._core.printDebug("#*#*#* Sandbox is registering module '" + module.getName() + "' to event '" + eventName + "'");
        var oldListeners = this._listeners[eventName];
        if (oldListeners == null) {
            oldListeners = new Array();
            this._listeners[eventName] = oldListeners;
        }

        oldListeners.push(module);
        this._core.printDebug("There are currently " + oldListeners.length + " listeners for event '" + eventName + "'");

    },

    /**
     * Unregisters given module from given event
     *
     * @param {Object}
     *            module
     * @param {Object}
     *            event
     */
    unregisterFromEvent : function(module, event) {
        var eventName = event.getName();
        this._core.printDebug("Sandbox is unregistering module '" + module.getName() + "' from event '" + eventName + "'");
        var oldListeners = this._listeners[eventName];
        if (oldListeners == null) {
            // return no listeners
        }

        var deleteIndex = oldListeners.indexOf(module);
        if (deleteIndex > -1) {
            oldListeners.splice(deleteIndex, 1);
            this._core.printDebug("Module unregistered successfully from event");
        } else {
            this._core.printDebug("Module does not listen to that event, skipping.");
        }
        delete event;
    },
    unregisterFromEventByName : function(module, eventName) {
        this._core.printDebug("Sandbox is unregistering module '" + module.getName() + "' from event '" + eventName + "'");
        var oldListeners = this._listeners[eventName];
        if (oldListeners == null) {
            // return no listeners
        }

        var deleteIndex = -1;
        // oldListeners.indexOf(module);
        for (var d = 0; d < oldListeners.length; d++) {
            if (oldListeners[d] == module) {
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
     * Starts all registered modules
     *
     */
    startModules : function() {

        /**
         * to avoid infinity let's store length
         * before calling out starts
         * modules may accidently lengthen  this._modules
         * during start
         */
        var modulesLength = this._modules.length;
        for (var i = 0; i < modulesLength; i++) {
            var module = this._modules[i];

            module.start(this);

        }
    },

    /**
     * @method getRequestBuilder
     * @param {String} name request name that we are creating
     *
     * access to request builder that creates requests by name
     * rather than by class name
     */
    getRequestBuilder : function(name) {
        return this._core.getRequestBuilder(name);
    },

    /**
     * access to event builder that creates events by name
     * rather than by class name
     *
     */
    getEventBuilder : function(name) {
        return this._core.getEventBuilder(name);
    },

    eventLoopGuard : 0,

    debugPushRequest : function(creator, req) {
        if (!this.debugRequests)
            return;
        var reqLog = {
            from : creator,
            reqName : req.getName()
        };
        this.requestEventStack.push(reqLog);
        this.requestEventLog.push(reqLog);
        if (this.requestEventLog.length > 64)
            this.requestEventLog.shift();
    },
    debugPopRequest : function() {
        if (!this.debugRequests)
            return;
        this.requestEventStack.pop();
    },

    debugPushEvent : function(creator, target, evt) {
        if (!this.debugEvents)
            return;
        this.eventLoopGuard++;

        if (this.eventLoopGuard > 64)
            throw "Events Looped?";

        var evtLog = {
            from : creator,
            to : target.getName(),
            evtName : evt.getName()
        };
        this.requestEventStack.push(evtLog);
        this.requestEventLog.push(evtLog);
        if (this.requestEventLog.length > 64)
            this.requestEventLog.shift();
    },
    debugPopEvent : function() {
        if (!this.debugEvents)
            return;
        this.eventLoopGuard--;

        this.requestEventStack.pop();
    },
    // TODO: document or move elsewhere
    /*doWfsLayerRelatedQueries : function(creator, mapLayer) {
    this._core.doWfsLayerRelatedQueries(creator, mapLayer);
    },*/

    /**
     * @method ajax
     * @param {String} url
     * 		URL to call
     * @param {Function} success
     * 		callback for succesful action
     * @param {Function} failure
     * 		callback for failed action
     * @param {Function} complete - NOTE! NOT IMPLEMENTED YET
     * 		callback on action completed
     * @param {String} data (optional)
     * 		data to post - NOTE! NOT IMPLEMENTED YET
     *
     * Makes an ajax request to url with given callbacks.
     * Detects available framework and uses it to make the call.
     * TODO: complete and data params not implemented
     */
    ajax : function(url, success, failure, complete, data) {
        // use ExtJS as default
        if (Ext && Ext.Ajax && Ext.Ajax.request) {
            Ext.Ajax.request({
                url : url,
                //scope : this,
                success : success,
                failure : failure
            });
        }
        // fallback #1 jQuery
        else if (jQuery && jQuery.ajax) {

            // wrapping response to an object similar to what EXTJS impl uses
            var wrapperCB = function(pResp) {
                var wrapper = {
                    responseText : pResp
                };
                success(wrapper);
            };
            // if data != null -> type = POST
            var type = "GET";
            if (data) {
                type = "POST";
            }

            jQuery.ajax({
                type : type,
                url : url,
                beforeSend : function(x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                success : wrapperCB,
                error : failure
            });

        }
        // TODO: fallback #2 Openlayers?
        else {
            alert("Couldn't make ajax call");
        }
    },

    /**
     * @method request
     * Modules can request work to be done using this method
     *
     * @param {Oskari.mapframework.module.Module/String} creator
     *            that created request. This can be either actual
     *            module or the name of the module. Both are
     *            accepted.
     * @param {Oskari.mapframework.request.Request} request
     *            request to be performed
     */
    request : function(creator, request) {
        var creatorComponent = null;
        if (creator.getName != null) {
            creatorComponent = this.findRegisteredModule(creator.getName());
        } else {
            creatorComponent = this.findRegisteredModule(creator);
        }

        if (creatorComponent == null) {
            throw "Attempt to create request with unknown component '" + creator + "' as creator";
        }

        this._core.setObjectCreator(request, creatorComponent);

        this.printDebug("Module '" + creatorComponent + "' is requesting for '" + this.getObjectName(request) + "'...");

        if (this.gatherDebugRequests) {
            this.pushRequestAndEventGather(creatorComponent + "->Sandbox: ", this.getObjectName(request));
        }

        var rv = null;

        this.debugPushRequest(creatorComponent, request);
        rv = this._core.processRequest(request);
        this.debugPopRequest();

        return rv;
    },

    requestByName : function(creator, requestName, requestArgs) {

        this.printDebug("#!#!#! --------------> requestByName " + requestName);
        var requestBuilder = this.getRequestBuilder(requestName);
        var request = requestBuilder.apply(this, requestArgs);

        var creatorComponent = null;
        if (creator.getName != null) {
            creatorComponent = this.findRegisteredModule(creator.getName());
        } else {
            creatorComponent = this.findRegisteredModule(creator);
        }

        if (creatorComponent == null) {
            throw "Attempt to create request with unknown component '" + creator + "' as creator";
        }

        this._core.setObjectCreator(request, creatorComponent);

        this.printDebug("Module '" + creatorComponent + "' is requesting for '" + this.getObjectName(request) + "'...");

        if (this.gatherDebugRequests) {
            this.pushRequestAndEventGather(creatorComponent + "->Sandbox: ", this.getObjectName(request));
        }

        var rv = null;

        this.debugPushRequest(creatorComponent, request);
        rv = this._core.processRequest(request);
        this.debugPopRequest();

        return rv;
    },

    /**
     *
     */
    postRequestByName : function(requestName, requestArgs) {
        var me = this;
        var requestBuilder = me.getRequestBuilder(requestName);
        if(!requestBuilder) {
            return;
        }
        window.setTimeout(function() {
            me.printDebug("#!#!#! POSTING --------------> requestByName " + requestName);
            var request = requestBuilder.apply(me, requestArgs);
            var creatorComponent = "postmaster";

            me._core.setObjectCreator(request, creatorComponent);

            me.printDebug("Module '" + creatorComponent + "' is POSTING a request for '" + me.getObjectName(request) + "'...");

            if (me.gatherDebugRequests) {
                me.pushRequestAndEventGather(creatorComponent + "->Sandbox: ", me.getObjectName(request));
            }
            var rv = null;

            me.debugPushRequest(creatorComponent, request);
            rv = me._core.processRequest(request);
            me.debugPopRequest();

        }, 10);

    },

    /**
     * Internal method for finding modules that are interested
     * in given event
     *
     * @param {Object}
     *            event
     * @return null if no interested parties are found, array of
     *         modules otherwise
     */
    findModulesInterestedIn : function(event) {
        var eventName = event.getName();
        var currentListeners = this._listeners[eventName];
        return currentListeners;
    },

    /**
     * Finds out modules that are interested in given event and
     * notifies them
     *
     * @param {Object}
     *            event
     */
    notifyAll : function(event, retainEvent) {

        //var module = {};
        var eventName;
        if (!retainEvent) {

            eventName = event.getName();

            this._core.printDebug("Sandbox received notifyall for event '" + eventName + "'");
            /*
             module.name = "|_Sandbox_|";
             module.request = " -> " +eventName;
             this.requestAndEventGather.push(module);
             var rowMarker = {};
             rowMarker.name = "   \\/";
             rowMarker.request = "";
             this.requestAndEventGather.push(rowMarker);
             */
        }

        var modules = this.findModulesInterestedIn(event);
        if (modules != null) {
            if (!retainEvent) {
                this._core.printDebug("Found " + modules.length + " interested modules");
            }
            for (var i = 0; i < modules.length; i++) {
                var module = modules[i];
                if (!retainEvent) {
                    this._core.printDebug("Notifying module '" + module.getName() + "'.");

                    if (this.gatherDebugRequests) {
                        this.pushRequestAndEventGather("Sandbox->" + module.getName() + ":", eventName);
                    }
                }

                this.debugPushEvent(this.getObjectCreator(event), module, event);
                module.onEvent(event);
                this.debugPopEvent();
            }
        } else {
            if (!retainEvent) {
                this._core.printDebug("No interested modules found.");
            }
        }

        /* finally clean event memory */
        if (!retainEvent)
            delete event;
    },

    /**
     * Returns registered module with given name if such exists.
     *
     * @param {Object}
     *            name
     */
    findRegisteredModuleInstance : function(name) {
        return this._modulesByName[name];

        /*for (var i = 0; i < this._modules.length; i++) {
         if (this._modules[i].getName() == name) {
         return this._modules[i];
         }
         }
         return null;*/
    },

    /**
     * Checks whether a module by given name is registered.
     *
     * @param {Object}
     *            name
     */
    findRegisteredModule : function(name) {
        return this._modulesByName[name] ? this._modulesByName[name].getName() : null;

        /*for (var i = 0; i < this._modules.length; i++) {
         if (this._modules[i].getName() == name) {
         return name;
         }
         }
         return null;*/
    },

    /**
     * Returns a request parameter
     * http://javablog.info/2008/04/17/url-request-parameters-using-javascript/
     */
    getRequestParameter : function(name) {
        return this._core.getRequestParameter(name);
    },

    /***********************************************************
     * Get language.
     */
    getLanguage : function() {
        return this._core.getLanguage();
    },

    /***********************************************************
     * Get browser window size.
     */
    getBrowserWindowSize : function() {
        return this._core.getBrowserWindowSize();
    },

    /**
     * JSON Event support
     */
    /**
     * request / event helpers
     */
    getObjectName : function(obj) {
        return this._core.getObjectName(obj);
    },
    getObjectCreator : function(obj) {
        return this._core.getObjectCreator(obj);
    },
    setObjectCreator : function(obj, creator) {
        return this._core.setObjectCreator(obj, creator);
    },
    copyObjectCreatorToFrom : function(objTo, objFrom) {
        return this._core.copyObjectCreatorToFrom(objTo, objFrom);
    },

    /**
     * one handler / request ?
     */
    addRequestHandler : function(requestName, handlerClsInstance) {
        return this._core.addRequestHandler(requestName, handlerClsInstance);
    },

    /**
     * one handler / request ?
     */
    removeRequestHandler : function(requestName, handlerInstance) {
        return this._core.removeRequestHandler(requestName, handlerInstance);
    },
    pushRequestAndEventGather : function(name, request) {
        var module = {};
        module.name = name;
        module.request = request;
        this.requestAndEventGather.push(module);
        if (this.requestAndEventGather.length > this.maxGatheredRequestsAndEvents)
            this.requestAndEventGather.shift();

    },
    popUpSeqDiagram : function() {
        var seq_html = '<html><head></head><body><div class=wsd wsd_style="modern-blue" ><pre>';
        var seq_commands = '';
        for (x in this.requestAndEventGather) {
            seq_commands += this.requestAndEventGather[x].name + this.requestAndEventGather[x].request + "\n";
        }
        if (seq_commands != '') {
            seq_html += seq_commands + '</pre></div><script type="text/javascript" src="http://www.websequencediagrams.com/service.js"></script></body>';
            var openedWindow = window.open();
            openedWindow.document.write(seq_html);
            this.requestAndEventGather = [];
        } else {
            alert('No requests in queue');
        }
    }
});
