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
function(core) {

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
    disableDebug : function() {
        this.debugRequests = false;
        this.debugEvents = false;
        this.gatherDebugRequests = false;
        if( this._core ) {
        	this._core.disableDebug();
        }
    },
    
    /** 
     * @method enableDebug
     * Enables debug messaging and sequence diagram gathering (by default not enabled)
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
     * @method printDebug
     * Utility method for printing debug messages to browser console
     * @param {String} text - message to print
     */
    printDebug : function(text) {
        this._core.printDebug(text);
    },

    /**
     * @method printWarn
     * Utility method for printing warn messages to browser console
     * @param {String} text
     */
    printWarn : function(text) {
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
    setUser : function(userData) {
        this._user = Oskari.clazz.create('Oskari.mapframework.domain.User', userData);
    },
    /**
     * @method getUser
     * Returns current user. See #setUser
     * 
     * @return {Oskari.mapframework.domain.User} user
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
     * Sets a global Url that is used to communicate with the server
     * @param {String} pUrl
     */
    setAjaxUrl : function(pUrl) {
        this._ajaxUrl = pUrl;
    },
    /**
     * @method getAjaxUrl
     * Returns global ajax url for the application. See #setAjaxUrl
     * @return {String}
     */
    getAjaxUrl : function() {
        return this._ajaxUrl;
    },


    /**
     * @method registerService
     * Registers given service to Oskari system
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
     * @param {String}
     *            serviceQName that identifies the service in the core
     * @return {Oskari.mapframework.service.Service}
     */
    getService : function(type) {
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
    registerAsStateful : function(pBundleId, pInstance) {
        this._statefuls[pBundleId] = pInstance;
    },
    /**
     * @method unregisterStateful
     * Unregisters given bundle instance from stateful bundles in sandbox
     *
     * @param {String}
     *            pBundleId bundle instance id which to unregister
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
     * @return {Object}
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
        return module.init(this);
    },

    /**
     * @method unregister
     * Unregisters given module from sandbox
     *
     * @param {Oskari.mapframework.module.Module}
     *            module
     */
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
        delete this._modulesByName[module.getName()];
    },

    /**
     * @method registerForEventByName
     * Registers given module to listen to given event
     *
     * @param {Oskari.mapframework.module.Module} module
     * @param {String} eventName
     */
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
     * @method unregisterFromEventByName
     * Unregisters given module from listening to given event
     *
     * @param {Oskari.mapframework.module.Module} module
     * @param {String} eventName
     */
    unregisterFromEventByName : function(module, eventName) {
        this._core.printDebug("Sandbox is unregistering module '" + module.getName() + "' from event '" + eventName + "'");
        var oldListeners = this._listeners[eventName];
        if (oldListeners == null) {
            // no listeners
            this._core.printDebug("Module does not listen to that event, skipping.");
            return;
        }

        var deleteIndex = -1;
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
     * @method getRequestBuilder
     *
     * Access to request builder that creates requests by name
     * rather than by class name
     * @param {String} name request name that we are creating
     * @return {Function} builder function for given request
     */
    getRequestBuilder : function(name) {
        return this._core.getRequestBuilder(name);
    },

    /**
     * @method getRequestBuilder
     *
     * Access to event builder that creates events by name
     * 
     * @param {String} name request name that we are creating
     * @return {Function} builder function for given event
     */
    getEventBuilder : function(name) {
        return this._core.getEventBuilder(name);
    },


    _debugPushRequest : function(creator, req) {
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
    _debugPopRequest : function() {
        if (!this.debugRequests)
            return;
        this.requestEventStack.pop();
    },

    _debugPushEvent : function(creator, target, evt) {
        if (!this.debugEvents)
            return;
        this._eventLoopGuard++;

        if (this._eventLoopGuard > 64)
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
    _debugPopEvent : function() {
        if (!this.debugEvents)
            return;
        this._eventLoopGuard--;

        this.requestEventStack.pop();
    },

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

        this._debugPushRequest(creatorComponent, request);
        rv = this._core.processRequest(request);
        this._debugPopRequest();

        return rv;
    },

	/**
	 * @method requestByName
	 * Modules can request work to be done using this method.
	 *
	 * This is a utility to work with request names instead of constructing
	 * request objects 
	 * 
	 * @param {Oskari.mapframework.module.Module/String} creator
     *            that created request. This can be either actual
     *            module or the name of the module. Both are
     *            accepted.
     * @param {String} requestName (this is NOT the class name)
     * @param {Array} requestArgs REQUIRED though patched for backwards compatibility
     * 
	 */
    requestByName : function(creator, requestName, requestArgs) {

        this.printDebug("#!#!#! --------------> requestByName " + requestName);
        var requestBuilder = this.getRequestBuilder(requestName);
        var request = requestBuilder.apply(this, requestArgs||[]);

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

        this._debugPushRequest(creatorComponent, request);
        rv = this._core.processRequest(request);
        this._debugPopRequest();

        return rv;
    },

	/**
	 * @property postMasterComponent
	 * @static
	 */
	postMasterComponent : "postmaster",
	
    /**
     * @method postRequestByName
     * 
     * This posts a request for processing. 
     * 
     * NOTE! This is asynchronous - by design.
     * 
	 *
     * This attempts to loose some stack frames as well as provide
     * some yield time for the browser. 
     * 
     * @param {String} requestName (this is NOT the class name)
     * @param {Array} requestArgs REQUIRED though patched for backwards compatibility
     */
    postRequestByName : function(requestName, requestArgs) {
        var me = this;
        var requestBuilder = me.getRequestBuilder(requestName);
        if(!requestBuilder) {
            return;
        }
        window.setTimeout(function() {
            
            var request = requestBuilder.apply(me, requestArgs||[]);
            var creatorComponent = this.postMasterComponent;
            me._core.setObjectCreator(request, creatorComponent);

            if (me.gatherDebugRequests) {
                me.pushRequestAndEventGather(creatorComponent + "->Sandbox: ", me.getObjectName(request));
            }
            var rv = null;

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

                this._debugPushEvent(this.getObjectCreator(event), module, event);
                module.onEvent(event);
                this._debugPopEvent();
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
     * @method findRegisteredModuleInstance
     * Returns module with given name that is registered to sandbox
     *
     * @param {String} name for the module
     * @return {Oskari.mapframework.module.Module}
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
     * @method findRegisteredModule
     * Returns module with given name that is registered to sandbox
     * //TODO: this is just weird, plaease check AND REMOVE!
     *
     * @param {String} name for the module
     * @return {Oskari.mapframework.module.Module}
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
     * Get browser window size.
     */
    getBrowserWindowSize : function() {
        // var height = jQuery(window).height();
        if (jQuery.browser.opera && window.innerHeight != null) {
            var height = window.innerHeight;
        }
        var width = jQuery(window).width();

        var size = {};
        size.height = jQuery(window).height();
        // height;
        size.width = width;

        this.printDebug("Got browser window size is: width: " + size.width + " px, height:" + size.height + " px.");

        return size;
    },

    /**
     * method previously known as jQuery
     */
    domSelector : function(arg) {
        return jQuery(arg);
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
