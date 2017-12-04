/**
 * @class Oskari.Sandbox
 *
 * Sandbox is the component providing bundles ways to get information about the status of the system
 * and communicate to other bundles using requests and events. Sandbox is created at the same time as
 * Oskari.mapframework.core.Core. Module init/start/stop methods get reference to sandbox through
 * the Oskari Module protocol.
 */
(function(Oskari) {
    var log;
    var services = {};
    var requestHandlers = {};
    var isDebugMode = false;

    Oskari.clazz.define('Oskari.Sandbox',

        /**
         * @method create called automatically on construction
         * @static
         *
         * @param {String} name optional name for non-default sandbox.
         */
        function (name) {
            var postFix = '' ;
            if(name !== 'sandbox') {
                postFix = '.' + name;
            }
            log = Oskari.log('Sandbox' + postFix);

            var me = this;
            /*
             * All registered listeners in map key: event name value:
             * array of modules who are interested in this type of event
             */
            me._listeners = [];

            /* array of all registered modules */
            me._modules = [];
            me._modulesByName = {};
            me._statefuls = {};

            me.requestEventLog = [];
            me.requestEventStack = [];

            // TODO: move to some conf?
            /* as of 2012-09-24 debug by default false */
            me.maxGatheredRequestsAndEvents = 4096;
            me.requestAndEventGather = [];
            me._eventLoopGuard = 0;
        }, {
            getLog : function() {
                return log;
            },
            /**
             * Returns true if anything is registered as a handler for the request.
             * @param  {String}  requestName request to check
             * @return {Boolean}             true if request is being handled.
             */
            hasHandler : function(requestName) {
                return !!requestHandlers[requestName] && !!Oskari.requestBuilder(requestName);
            },
            /**
             * Get value if no parameter is given, set value with parameter
             * @param  {Boolean} setDebug optional parameter to set the debug mode
             * @return {Boolean}          true if debug is enabled
             */
            debug: function (setDebug) {
                if(typeof setDebug === 'undefined') {
                    // getter
                    return isDebugMode;
                }
                isDebugMode = !!setDebug;
                log.enableDebug(isDebugMode);
                return isDebugMode;
            },

            /**
             * @method registerService
             * Registers given service to Oskari system
             *
             * @param {Oskari.mapframework.service.Service}
             *            service service to register
             */
            registerService: function (service) {
                services[service.getQName()] = service;
            },

            /**
             * Method for asking a registered service
             *
             * @param {String}
             *            serviceQName that identifies the service in the core
             * @return {Oskari.mapframework.service.Service}
             */
            getService: function (type) {
                return services[type];
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
                for (m = 0; m < me._modules.length; m += 1) {
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
                log.debug('#*#*#* Sandbox is registering module \'' + module.getName() + '\' to event \'' + eventName + '\'');
                var oldListeners = this._listeners[eventName];
                if (oldListeners === null || oldListeners === undefined) {
                    oldListeners = [];
                    this._listeners[eventName] = oldListeners;
                }

                oldListeners.push(module);
                log.debug('There are currently ' + oldListeners.length + ' listeners for event \'' + eventName + '\'');
            },

            /**
             * @method unregisterFromEventByName
             * Unregisters given module from listening to given event
             *
             * @param {Oskari.mapframework.module.Module} module
             * @param {String} eventName
             */
            unregisterFromEventByName: function (module, eventName) {
                log.debug('Sandbox is unregistering module \'' + module.getName() + '\' from event \'' + eventName + '\'');
                var oldListeners = this._listeners[eventName],
                    deleteIndex = -1,
                    d;
                if (oldListeners === null || oldListeners === undefined) {
                    // no listeners
                    log.debug('Module does not listen to that event, skipping.');
                    return;
                }

                for (d = 0; d < oldListeners.length; d += 1) {
                    if (oldListeners[d] === module) {
                        deleteIndex = d;
                        break;
                    }
                }
                if (deleteIndex > -1) {
                    oldListeners.splice(deleteIndex, 1);
                    log.debug('Module unregistered successfully from event');
                } else {
                    log.debug('Module does not listen to that event, skipping.');
                }
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

                if (creator === null || creator === undefined) {
                    throw new TypeError('sandbox.request(): missing creator.');
                }

                if (creator.getName !== null && creator.getName !== undefined) {
                    creatorName = creator.getName();
                } else {
                    creatorName = creator;
                }
                creatorComponent = this.findRegisteredModuleInstance(creatorName);

                if (creatorComponent === null || creatorComponent === undefined) {
                    throw 'Attempt to create request with unknown component \'' + creator + '\' as creator';
                }
                request._creator = creatorName;

                if (this.debug()) {
                    this._pushRequestAndEventGather(creatorName + '->Sandbox: ', request.getName());
                }

                this._debugPushRequest(creatorName, request);
                rv = this.processRequest(request);
                this._debugPopRequest();

                return rv;
            },
            /**
             * @method processRequest
             * Forwards requests to corresponding request handlers.
             * If request doesn't have handler, prints warning to console.
             * @param {Oskari.mapframework.request.Request} request to forward
             * @return {Boolean} Returns true, if request was handled, false otherwise
             */
            processRequest: function (request) {
                var requestName = request.getName();

                var handlerClsInstance = this.requestHandler(requestName);
                if (!handlerClsInstance || typeof handlerClsInstance.handleRequest !== 'function') {
                    log.warn('No handler for request', requestName);
                    return;
                }
                handlerClsInstance.handleRequest.apply(handlerClsInstance, [undefined, request]);
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
                log.debug(
                    '#!#!#! --------------> requestByName ' + requestName
                );
                var requestBuilder = Oskari.requestBuilder(requestName),
                    request = requestBuilder.apply(this, requestArgs || []);
                return this.request(creator, request);
            },

            /**
             * @property postMasterComponent
             * @static
             * Used as request/event sender if creator cannot be determined
             */
            postMasterComponent: 'postmaster',

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
            postRequestByName: function (requestName, requestArgs, syncDoNotUseWillBeRemoved) {
                var me = this,
                    requestBuilder = Oskari.requestBuilder(requestName);
                if (!requestBuilder || !this.hasHandler(requestName)) {
                    log.warn('Trying to post request', requestName, 'that is undefined or missing a handler. Skipping!');
                    return;
                }
                var handleReg = function () {
                    var request = requestBuilder.apply(me, requestArgs || []),
                        creatorComponent = me.postMasterComponent,
                        rv = null;

                    request._creator = creatorComponent;

                    if (me.debug()) {
                        me._pushRequestAndEventGather(
                            creatorComponent + '->Sandbox: ',
                            request.getName()
                        );
                    }

                    if (me.debug()) {
                        me._debugPushRequest(creatorComponent, request);
                    }

                    rv = me.processRequest(request);

                    if (me.debug()) {
                        me._debugPopRequest();
                    }

                };
                if(syncDoNotUseWillBeRemoved) {
                    handleReg();
                } else {
                    window.setTimeout(handleReg, 0);
                }

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
                    log.debug(
                        'Sandbox received notifyall for event \'' + eventName + '\''
                    );
                }

                var modules = this._findModulesInterestedIn(event),
                    i,
                    module;
                if (!retainEvent) {
                    log.debug(
                        'Found ' + modules.length + ' interested modules'
                    );
                }
                for (i = 0; i < modules.length; i += 1) {
                    module = modules[i];
                    if (!retainEvent) {
                        log.debug(
                            'Notifying module \'' + module.getName() + '\'.'
                        );

                        if (this.debug()) {
                            this._pushRequestAndEventGather(
                                'Sandbox->' + module.getName() + ':', eventName
                            );
                        }
                    }

                    this._debugPushEvent(
                        event._creator || 'NA',
                        module,
                        event
                    );
                    try {
                        module.onEvent(event);
                    } catch(err) {
                        log.warn('Error notifying',  module.getName(), 'about', eventName, event, err);
                    }
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
             * @return {Oskari.mapframework.module.Module} registered module or null if not found, map of modules if name is not given
             */
            findRegisteredModuleInstance: function (name) {
                if(!name) {
                    return this._modulesByName;
                }
                return this._modulesByName[name];
            },

            /**
             * @method getBrowserWindowSize
             * Returns an object with properties width and height as the window size in pixels
             * @return {Object} object with properties width and height as the window size in pixels
             */
            getBrowserWindowSize: function () {
                var width = jQuery(window).width(),
                    size = {};
                size.height = jQuery(window).height();
                size.width = width;

                log.debug(
                    'Got browser window size is: width: ' + size.width +
                    ' px, height:' + size.height + ' px.'
                );

                return size;
            },

            /**
             * @method requestHandler
             * Registers a request handler for requests with the given name and handler or returns the handler for
             * request if handler is undefined.
             *
             * NOTE: only one request handler can be registered/request
             * @param {String} requestName - name of the request
             * @param {Oskari.mapframework.core.RequestHandler} handlerClsInstance request handler
             */
            requestHandler : function(requestName, handler) {
                if(typeof handler === 'undefined') {
                    // getter
                    return requestHandlers[requestName];
                }
                if(requestHandlers[requestName] && handler !== null) {
                    log.warn('Overwriting request handler for "' + requestName + '"!!');
                }
                // setter, removal with handler value <null>
                requestHandlers[requestName] = handler;
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
                if (!this.debug()) {
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
                if (!this.debug()) {
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
                if (!this.debug()) {
                    return;
                }
                this._eventLoopGuard += 1;

                if (this._eventLoopGuard > 64) {
                    throw 'Events Looped?';
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
                if (!this.debug()) {
                    return;
                }
                this._eventLoopGuard -= 1;
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
                var seq_html =
                        '<html>' +
                        '  <head></head>' +
                        '  <body>' +
                        '    <div class="wsd" wsd_style="modern-blue">' +
                        '      <pre>',
                    seq_commands = '',
                    openedWindow,
                    x;

                for (x in this.requestAndEventGather) {
                    if (this.requestAndEventGather.hasOwnProperty(x)) {
                        seq_commands += this.requestAndEventGather[x].name + this.requestAndEventGather[x].request + '\n';
                    }
                }
                if (seq_commands !== '') {
                    seq_html +=
                        seq_commands +
                        '</pre>\n' +
                        '    </div>' +
                        '    <script type="text/javascript">' +
                        // Web Sequenced Diagrams service.js
                        ' /* This part of code getted in here: http://www.websequencediagrams.com/service.js */ '+
                        '(function()'+
                        '{'+
                            '// The script location'+
                            'var ScriptSrc = (function() {'+
                                'var src;'+
                                'var i;'+
                                'var scripts = document.getElementsByTagName("script"),'+
                                    'script = scripts[scripts.length - 1];'+
                                'if (script.getAttribute.length !== undefined) {'+
                                    'src = script.src;'+
                                '} else {'+
                                    'src = script.getAttribute("src", -1);'+
                                '}'+
                                'return src;'+
                            '}());'+
                            'function GetScriptHostname()'+
                            '{'+
                                '// Returns script protocol, hostname and port.'+
                                'var regex = /(https?:\/\/[^\/]+)/;'+
                                'var m = regex.exec(ScriptSrc);'+
                                'if ( m && m.length > 1 ) {'+
                                    'return m[1];'+
                                '} else {'+
                                    'return "error";'+
                                '}'+
                            '}'+
                            'function BitWriter()'+
                            '{'+
                                '// encodes as URL-BASE64'+
                                'this.str = "";'+
                                'this.partial = 0;'+
                                'this.partialSize = 0;'+
                                'this.table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";'+
                                'this.addBits = function( bits, size )'+
                                '{'+
                                    'this.partial = (this.partial << size) | bits;'+
                                    'this.partialSize += size;'+
                                    'while ( this.partialSize >= 6 ) {'+
                                        'this.str += this.table.charAt((this.partial >>'+
                                                                       '(this.partialSize - 6)) & 0x3f);'+
                                        'this.partialSize -= 6;'+
                                    '}'+
                                '};'+
                                'this.finish = function() {'+
                                    'if ( this.partialSize ) {'+
                                        'this.str += this.table.charAt('+
                                            '( this.partial << ( 6 - this.partialSize ) ) & 0x3f );'+
                                        'this.partialSize = 0;'+
                                        'this.partial = 0;'+
                                    '}'+
                                '};'+
                            '}'+
                            'function encodeBase64(str)'+
                            '{'+
                                'var writer = new BitWriter();'+
                                'for (var n = 0; n < str.length; n++) {'+
                                    'writer.addBits( str.charCodeAt( n ), 8 );'+
                                '}'+
                                'writer.finish();'+
                                'return writer.str;'+
                            '}'+
                            'function encodeUtf8(string) {'+
                                '// fronm http://www.webtoolkit.info/'+
                                'string = string.replace(/\r\n/g,"\n");'+
                                'var utftext = "";'+
                                'for (var n = 0; n < string.length; n++) {'+
                                    'var c = string.charCodeAt(n);'+
                                    'if (c < 128) {'+
                                        'utftext += String.fromCharCode(c);'+
                                    '}'+
                                    'else if((c > 127) && (c < 2048)) {'+
                                        'utftext += String.fromCharCode((c >> 6) | 192);'+
                                        'utftext += String.fromCharCode((c & 63) | 128);'+
                                    '}'+
                                    'else {'+
                                        'utftext += String.fromCharCode((c >> 12) | 224);'+
                                        'utftext += String.fromCharCode(((c >> 6) & 63) | 128);'+
                                        'utftext += String.fromCharCode((c & 63) | 128);'+
                                    '}'+
                                '}'+
                                'return utftext;'+
                            '}'+
                            'function encodeNumber(num)'+
                            '{'+
                                '// encodes a number in only as many bytes as required, 7 bits at a time.'+
                                '// bit 8 is used to indicate whether another byte follows.'+
                                'if ( num >= 0x3FFF ) {'+
                                    'return String.fromCharCode( 0x80 | ( (num >> 14) & 0x7f ) ) +'+
                                           'String.fromCharCode( 0x80 | ( (num >>  7) & 0x7f ) ) +'+
                                           'String.fromCharCode( num & 0x7f );'+
                                '} else if ( num >= 0x7F ) {'+
                                    'return String.fromCharCode( 0x80 | ( (num >>  7) & 0x7f ) ) +'+
                                           'String.fromCharCode( num & 0x7f );'+
                                '} else {'+
                                    'return String.fromCharCode( num );'+
                                '}'+
                            '}'+
                            'function encodeLz77( input )'+
                            '{'+
                                'var MinStringLength = 4;'+
                                'var output = "";'+
                                'var pos = 0;'+
                                'var hash = {};'+
                                '// set last pos to just after the last chunk.'+
                                'var lastPos = input.length - MinStringLength;'+
                                'for ( var i = MinStringLength; i < input.length; i++ ) {'+
                                    'var subs = input.substr(i-MinStringLength, MinStringLength);'+
                                    'if ( hash[subs] === undefined ) {'+
                                        'hash[subs] = [];'+
                                    '}'+
                                    'hash[subs].push( i-MinStringLength );'+
                                    '//document.write("subs[" + subs + "]=" + (pos - MinStringLength) + "<br>");'+
                                '}'+
                                '// loop until pos reaches the last chunk.'+
                                'while (pos < lastPos) {'+
                                    '// search start is the current position minus the window size, capped'+
                                    '// at the beginning of the string.'+
                                    'var matchLength = MinStringLength;'+
                                    'var foundMatch = false;'+
                                    'var bestMatch = {distance: 0, length: 0};'+
                                    'var prefix = input.substr(pos, MinStringLength);'+
                                    'var matches = hash[prefix];'+
                                    '// loop until the end of the matched region reaches the current'+
                                    '// position.'+
                                    '//while ((searchStart + matchLength) < pos) {'+
                                    'if ( matches !== undefined ) {'+
                                        'for ( var i = 0; i < matches.length; i++ ) {'+
                                            'var searchStart = matches[i];'+
                                            'if ( searchStart + matchLength >= pos ) {'+
                                                'break;'+
                                            '}'+
                                            'while( searchStart + matchLength < pos ) {'+
                                                '// check if string matches.'+
                                                'var isValidMatch = ('+
                                                        '(input.substr(searchStart, matchLength) == input.substr(pos, matchLength))'+
                                                        ');'+
                                                'if (isValidMatch) {'+
                                                    '// we found at least one match. try for a larger one.'+
                                                    'var realMatchLength = matchLength;'+
                                                    'matchLength++;'+
                                                    'if (foundMatch && (realMatchLength > bestMatch.length)) {'+
                                                        'bestMatch.distance = pos - searchStart - realMatchLength;'+
                                                        'bestMatch.length = realMatchLength;'+
                                                    '}'+
                                                    'foundMatch = true;'+
                                                '} else {'+
                                                    'break;'+
                                                '}'+
                                            '}'+
                                        '}'+
                                    '}'+
                                    'if (bestMatch.length) {'+
                                        'output += String.fromCharCode( 0 ) +'+
                                            'encodeNumber(bestMatch.distance) +'+
                                            'encodeNumber(bestMatch.length);'+
                                        'pos += bestMatch.length;'+
                                    '} else {'+
                                        'if (input.charCodeAt(pos) !== 0) {'+
                                            'output += input.charAt(pos);'+
                                        '} else {'+
                                            'output += String.fromCharCode( 0 ) +'+
                                                'String.fromCharCode( 0 );'+
                                        '}'+
                                        'pos++;'+
                                    '}'+
                                '}'+
                                'return output + input.slice(pos).replace(/\0/g, "\0\0");'+
                            '}'+
                            'function getText( node )'+
                            '{'+
                                'var text = "";'+
                                'for( var i = 0; i < node.childNodes.length; i++ ) {'+
                                    'var child = node.childNodes[i];'+
                                    'if ( child.nodeType == 3 ) {'+
                                        'text += child.data;'+
                                    '} else {'+
                                        'text += getText( child );'+
                                    '}'+
                                '}'+
                                'return text;'+
                            '}'+
                            'function process(divs) {'+
                                'var hostname = GetScriptHostname();'+
                                'for ( var i = 0; i < divs.length; i++ ) {'+
                                    'if ( divs[i].className == "wsd" && !divs[i].wsd_processed ) {'+
                                        'divs[i].wsd_processed = true;'+
                                        'var style = "";'+
                                        'if ( divs[i].attributes["wsd_style"] ) {'+
                                            'style = "&s=" + divs[i].attributes["wsd_style"].value;'+
                                        '}'+
                                        'var text = encodeBase64( encodeLz77( encodeUtf8( getText( divs[i] ) ) ) );'+
                                        'var str = hostname + "/cgi-bin/cdraw?" +'+
                                            '"lz=" + text + style;'+
                                        'if ( true || str.length < 2048 ) {'+
                                            'for( var j = divs[i].childNodes.length-1; j >= 0; j-- ) {'+
                                                'divs[i].removeChild( divs[i].childNodes[j] );'+
                                            '}'+
                                            'var img = document.createElement("img");'+
                                            'img.setAttribute("src", str);'+
                                            'divs[i].appendChild( img );'+
                                        '} else {'+
                                            'divs[i].insertBefore( document.createTextNode("Diagram too large for web service."), divs[i].firstChild );'+
                                        '}'+
                                    '}'+
                                '}'+
                            '}'+
                            'process( document.getElementsByTagName("div") );'+
                            'process( document.getElementsByTagName("span") );'+
                        '})();'+
                        '    </script>' +
                        '  </body>' +
                        '</html>';
                    openedWindow = window.open();
                    openedWindow.document.write(seq_html);
                    this.requestAndEventGather = [];
                } else {
                    alert('No requests in queue');
                }
            },
            /**
             * Fills in missing details for base url. Uses
             * window.location.protocol/host/port/path if needed.
             * @method createURL
             * @param  {String} baseUrl URL fragment or whole URL
             * @param  {Boolean} prepQueryString if true, makes sure the url ends with ? or & character
             * @return {String} Usable URL or null if couldn't create it.
             */
            createURL : function(baseUrl, prepQueryString) {
                if(!baseUrl) {
                    return null;
                }
                var url = this.__constructUrl(baseUrl);
                if(!!prepQueryString) {
                    url = this.__prepareQueryString(url);
                }
                return url;
            },
            /**
             * Fills in missing details for base url. Uses window.location.protocol/host/port/path if needed.
             * @method __constructUrl
             * @private
             * @param  {String} baseUrl baseUrl URL fragment or whole URL
             * @return {String} Usable URL
             */
            __constructUrl : function(baseUrl) {
                // whole url, use as is
                if(baseUrl.indexOf('://') !== -1) {
                    return baseUrl;
                }
                // starts with // -> fill in protocol
                if(baseUrl.indexOf('//') === 0) {
                    return window.location.protocol + baseUrl;
                }
                var serverUrl = window.location.protocol + '//'
                         + window.location.host;
                // starts with / -> fill in protocol + host including port
                if(baseUrl.indexOf('/') === 0) {
                    return serverUrl + baseUrl;
                }
                return serverUrl + window.location.pathname + '/' + baseUrl;
            },
            /**
             * Ensures that the given parameter has ? character and appends & to the end if
             * url-parameter doesn't end to '?' or '&' characters
             * @method __prepareQueryString
             * @private
             * @param  {String} url
             * @return {String} modified url that ends with ? or &
             */
            __prepareQueryString : function(url) {
                if(!url) {
                    return null;
                }
                if(url.indexOf('?') === -1) {
                    url = url + '?';
                }
                var lastChar = url.charAt(url.length-1);
                if(lastChar !== '&' && lastChar !== '?') {
                    url = url + '&';
                }
                return url;
            }
        }
    );
}(Oskari));