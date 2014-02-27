
require.config({
  baseUrl: "/Oskari/", // the base is set to requirejs lib to help requiring 3rd party libs
  paths: { // some path shortcuts to ease declarations
    oskari: "src/oskari/oskari",
    "oskari-with-app": "src/oskari/oskari-with-app",
    "oskari-with-loader": "src/oskari/oskari-with-loader",
    jquery: "http://code.jquery.com/jquery-1.9.1",
    "jquery-migrate": "libraries/jquery/jquery-migrate-1.2.1-modified",
    css: "libraries/requirejs/lib/css",
    json: "libraries/requirejs/lib/json",
    domReady: "libraries/requirejs/lib/domReady",
    text: "libraries/requirejs/lib/text",
    i18n: "libraries/requirejs/lib/i18n",
    normalize: "libraries/requirejs/lib/normalize"
  },
  map: {
    // '*' means all modules will get 'jquery-private'
    // for their 'jquery' dependency.
    "*": {
      "oskari": "oskari-with-app",
      "jquery": "jquery-migrate",
      "leaflet": "src/oskari/map-leaflet/module",
      "mapfull": "src/leaflet/mapfull/module",
      "mapmodule-plugin": "src/leaflet/mapmodule-plugin/module",
      "divmanazer": "src/framework/divmanazer/module",
      "toolbar": "src/framework/toolbar/module",
      "statehandler": "src/framework/statehandler/module",
      "infobox": "src/framework/infobox/module",
      "search": "src/framework/search/module",
      "layerselector2": "src/framework/layerselector2/module",
      "layerselection2": "src/framework/layerselection2/module",
      "personaldata": "src/framework/personaldata/module",
      "maplegend": "src/framework/maplegend/module",
      "userguide": "src/framework/userguide/module",
      "backendstatus": "src/framework/backendstatus/module",
      "postprocessor": "src/framework/postprocessor/module",
      "publisher": "src/framework/publisher/module",
      "guidedtour": "src/framework/guidedtour/module",
      "mapstats": "src/framework/mapstats/module",
      "mapwfs": "src/framework/mapwfs/module",
      "statsgrid": "src/statistics/statsgrid/module",
      "promote": "src/framework/promote/module"
    },

    // 'jquery-private' wants the real jQuery module
    // though. If this line was not here, there would
    // be an unresolvable cyclic dependency.
    "jquery-migrate": {
      "jquery": "jquery"
    }
  },
  shim: {
    "oskari": {
      exports: "Oskari"
    }
  },
  config: {
    i18n: {
      locale: language
    }
  },
  waitSeconds: 30
});
define("mainConfig", function(){});

// Wrap jquery migrate not to leak into global space.
// Note, we user jQuery 1.7.1 in the global space, but in the required space jQuery 1.9.1 with the migrate plugin

// Upgrade the migrate plugin by replacing the content for the define function, with the exception of the last row,
// which returns the noConflict jQuery object.

define('jquery-migrate',['jquery'], function (jQuery) {

    /*!
     * jQuery Migrate - v1.2.1 - 2013-05-08
     * https://github.com/jquery/jquery-migrate
     * Copyright 2005, 2013 jQuery Foundation, Inc. and other contributors; Licensed MIT
     */
    (function( jQuery, window, undefined ) {
    // See http://bugs.jquery.com/ticket/13335
    // 


    var warnedAbout = {};

    // List of warnings already given; public read only
    jQuery.migrateWarnings = [];

    // Set to true to prevent console output; migrateWarnings still maintained
    // jQuery.migrateMute = false;

    // Show a message on the console so devs know we're active
    if ( !jQuery.migrateMute && window.console && window.console.log ) {
        window.console.log("JQMIGRATE: Logging is active");
    }

    // Set to false to disable traces that appear with warnings
    if ( jQuery.migrateTrace === undefined ) {
        jQuery.migrateTrace = true;
    }

    // Forget any warnings we've already given; public
    jQuery.migrateReset = function() {
        warnedAbout = {};
        jQuery.migrateWarnings.length = 0;
    };

    function migrateWarn( msg) {
        var console = window.console;
        if ( !warnedAbout[ msg ] ) {
            warnedAbout[ msg ] = true;
            jQuery.migrateWarnings.push( msg );
            if ( console && console.warn && !jQuery.migrateMute ) {
                console.warn( "JQMIGRATE: " + msg );
                if ( jQuery.migrateTrace && console.trace ) {
                    console.trace();
                }
            }
        }
    }

    function migrateWarnProp( obj, prop, value, msg ) {
        if ( Object.defineProperty ) {
            // On ES5 browsers (non-oldIE), warn if the code tries to get prop;
            // allow property to be overwritten in case some other plugin wants it
            try {
                Object.defineProperty( obj, prop, {
                    configurable: true,
                    enumerable: true,
                    get: function() {
                        migrateWarn( msg );
                        return value;
                    },
                    set: function( newValue ) {
                        migrateWarn( msg );
                        value = newValue;
                    }
                });
                return;
            } catch( err ) {
                // IE8 is a dope about Object.defineProperty, can't warn there
            }
        }

        // Non-ES5 (or broken) browser; just set the property
        jQuery._definePropertyBroken = true;
        obj[ prop ] = value;
    }

    if ( document.compatMode === "BackCompat" ) {
        // jQuery has never supported or tested Quirks Mode
        migrateWarn( "jQuery is not compatible with Quirks Mode" );
    }


    var attrFn = jQuery( "<input/>", { size: 1 } ).attr("size") && jQuery.attrFn,
        oldAttr = jQuery.attr,
        valueAttrGet = jQuery.attrHooks.value && jQuery.attrHooks.value.get ||
            function() { return null; },
        valueAttrSet = jQuery.attrHooks.value && jQuery.attrHooks.value.set ||
            function() { return undefined; },
        rnoType = /^(?:input|button)$/i,
        rnoAttrNodeType = /^[238]$/,
        rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i,
        ruseDefault = /^(?:checked|selected)$/i;

    // jQuery.attrFn
    migrateWarnProp( jQuery, "attrFn", attrFn || {}, "jQuery.attrFn is deprecated" );

    jQuery.attr = function( elem, name, value, pass ) {
        var lowerName = name.toLowerCase(),
            nType = elem && elem.nodeType;

        if ( pass ) {
            // Since pass is used internally, we only warn for new jQuery
            // versions where there isn't a pass arg in the formal params
            if ( oldAttr.length < 4 ) {
                migrateWarn("jQuery.fn.attr( props, pass ) is deprecated");
            }
            if ( elem && !rnoAttrNodeType.test( nType ) &&
                (attrFn ? name in attrFn : jQuery.isFunction(jQuery.fn[name])) ) {
                return jQuery( elem )[ name ]( value );
            }
        }

        // Warn if user tries to set `type`, since it breaks on IE 6/7/8; by checking
        // for disconnected elements we don't warn on $( "<button>", { type: "button" } ).
        if ( name === "type" && value !== undefined && rnoType.test( elem.nodeName ) && elem.parentNode ) {
            migrateWarn("Can't change the 'type' of an input or button in IE 6/7/8");
        }

        // Restore boolHook for boolean property/attribute synchronization
        if ( !jQuery.attrHooks[ lowerName ] && rboolean.test( lowerName ) ) {
            jQuery.attrHooks[ lowerName ] = {
                get: function( elem, name ) {
                    // Align boolean attributes with corresponding properties
                    // Fall back to attribute presence where some booleans are not supported
                    var attrNode,
                        property = jQuery.prop( elem, name );
                    return property === true || typeof property !== "boolean" &&
                        ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ?

                        name.toLowerCase() :
                        undefined;
                },
                set: function( elem, value, name ) {
                    var propName;
                    if ( value === false ) {
                        // Remove boolean attributes when set to false
                        jQuery.removeAttr( elem, name );
                    } else {
                        // value is true since we know at this point it's type boolean and not false
                        // Set boolean attributes to the same name and set the DOM property
                        propName = jQuery.propFix[ name ] || name;
                        if ( propName in elem ) {
                            // Only set the IDL specifically if it already exists on the element
                            elem[ propName ] = true;
                        }

                        elem.setAttribute( name, name.toLowerCase() );
                    }
                    return name;
                }
            };

            // Warn only for attributes that can remain distinct from their properties post-1.9
            if ( ruseDefault.test( lowerName ) ) {
                migrateWarn( "jQuery.fn.attr('" + lowerName + "') may use property instead of attribute" );
            }
        }

        return oldAttr.call( jQuery, elem, name, value );
    };

    // attrHooks: value
    jQuery.attrHooks.value = {
        get: function( elem, name ) {
            var nodeName = ( elem.nodeName || "" ).toLowerCase();
            if ( nodeName === "button" ) {
                return valueAttrGet.apply( this, arguments );
            }
            if ( nodeName !== "input" && nodeName !== "option" ) {
                migrateWarn("jQuery.fn.attr('value') no longer gets properties");
            }
            return name in elem ?
                elem.value :
                null;
        },
        set: function( elem, value ) {
            var nodeName = ( elem.nodeName || "" ).toLowerCase();
            if ( nodeName === "button" ) {
                return valueAttrSet.apply( this, arguments );
            }
            if ( nodeName !== "input" && nodeName !== "option" ) {
                migrateWarn("jQuery.fn.attr('value', val) no longer sets properties");
            }
            // Does not return so that setAttribute is also used
            elem.value = value;
        }
    };


    var matched, browser,
        oldInit = jQuery.fn.init,
        oldParseJSON = jQuery.parseJSON,
        // Note: XSS check is done below after string is trimmed
        rquickExpr = /^([^<]*)(<[\w\W]+>)([^>]*)$/;

    // $(html) "looks like html" rule change
    jQuery.fn.init = function( selector, context, rootjQuery ) {
        var match;

        if ( selector && typeof selector === "string" && !jQuery.isPlainObject( context ) &&
                (match = rquickExpr.exec( jQuery.trim( selector ) )) && match[ 0 ] ) {
            // This is an HTML string according to the "old" rules; is it still?
            if ( selector.charAt( 0 ) !== "<" ) {
                migrateWarn("$(html) HTML strings must start with '<' character");
            }
            if ( match[ 3 ] ) {
                migrateWarn("$(html) HTML text after last tag is ignored");
            }
            // Consistently reject any HTML-like string starting with a hash (#9521)
            // Note that this may break jQuery 1.6.x code that otherwise would work.
            if ( match[ 0 ].charAt( 0 ) === "#" ) {
                migrateWarn("HTML string cannot start with a '#' character");
                jQuery.error("JQMIGRATE: Invalid selector string (XSS)");
            }
            // Now process using loose rules; let pre-1.8 play too
            if ( context && context.context ) {
                // jQuery object as context; parseHTML expects a DOM object
                context = context.context;
            }
            if ( jQuery.parseHTML ) {
                return oldInit.call( this, jQuery.parseHTML( match[ 2 ], context, true ),
                        context, rootjQuery );
            }
        }
        return oldInit.apply( this, arguments );
    };
    jQuery.fn.init.prototype = jQuery.fn;

    // Let $.parseJSON(falsy_value) return null
    jQuery.parseJSON = function( json ) {
        if ( !json && json !== null ) {
            migrateWarn("jQuery.parseJSON requires a valid JSON string");
            return null;
        }
        return oldParseJSON.apply( this, arguments );
    };

    jQuery.uaMatch = function( ua ) {
        ua = ua.toLowerCase();

        var match = /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
            /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
            /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
            /(msie) ([\w.]+)/.exec( ua ) ||
            ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
            [];

        return {
            browser: match[ 1 ] || "",
            version: match[ 2 ] || "0"
        };
    };

    // Don't clobber any existing jQuery.browser in case it's different
    if ( !jQuery.browser ) {
        matched = jQuery.uaMatch( navigator.userAgent );
        browser = {};

        if ( matched.browser ) {
            browser[ matched.browser ] = true;
            browser.version = matched.version;
        }

        // Chrome is Webkit, but Webkit is also Safari.
        if ( browser.chrome ) {
            browser.webkit = true;
        } else if ( browser.webkit ) {
            browser.safari = true;
        }

        jQuery.browser = browser;
    }

    // Warn if the code tries to get jQuery.browser
    migrateWarnProp( jQuery, "browser", jQuery.browser, "jQuery.browser is deprecated" );

    jQuery.sub = function() {
        function jQuerySub( selector, context ) {
            return new jQuerySub.fn.init( selector, context );
        }
        jQuery.extend( true, jQuerySub, this );
        jQuerySub.superclass = this;
        jQuerySub.fn = jQuerySub.prototype = this();
        jQuerySub.fn.constructor = jQuerySub;
        jQuerySub.sub = this.sub;
        jQuerySub.fn.init = function init( selector, context ) {
            if ( context && context instanceof jQuery && !(context instanceof jQuerySub) ) {
                context = jQuerySub( context );
            }

            return jQuery.fn.init.call( this, selector, context, rootjQuerySub );
        };
        jQuerySub.fn.init.prototype = jQuerySub.fn;
        var rootjQuerySub = jQuerySub(document);
        migrateWarn( "jQuery.sub() is deprecated" );
        return jQuerySub;
    };


    // Ensure that $.ajax gets the new parseJSON defined in core.js
    jQuery.ajaxSetup({
        converters: {
            "text json": jQuery.parseJSON
        }
    });


    var oldFnData = jQuery.fn.data;

    jQuery.fn.data = function( name ) {
        var ret, evt,
            elem = this[0];

        // Handles 1.7 which has this behavior and 1.8 which doesn't
        if ( elem && name === "events" && arguments.length === 1 ) {
            ret = jQuery.data( elem, name );
            evt = jQuery._data( elem, name );
            if ( ( ret === undefined || ret === evt ) && evt !== undefined ) {
                migrateWarn("Use of jQuery.fn.data('events') is deprecated");
                return evt;
            }
        }
        return oldFnData.apply( this, arguments );
    };


    var rscriptType = /\/(java|ecma)script/i,
        oldSelf = jQuery.fn.andSelf || jQuery.fn.addBack;

    jQuery.fn.andSelf = function() {
        migrateWarn("jQuery.fn.andSelf() replaced by jQuery.fn.addBack()");
        return oldSelf.apply( this, arguments );
    };

    // Since jQuery.clean is used internally on older versions, we only shim if it's missing
    if ( !jQuery.clean ) {
        jQuery.clean = function( elems, context, fragment, scripts ) {
            // Set context per 1.8 logic
            context = context || document;
            context = !context.nodeType && context[0] || context;
            context = context.ownerDocument || context;

            migrateWarn("jQuery.clean() is deprecated");

            var i, elem, handleScript, jsTags,
                ret = [];

            jQuery.merge( ret, jQuery.buildFragment( elems, context ).childNodes );

            // Complex logic lifted directly from jQuery 1.8
            if ( fragment ) {
                // Special handling of each script element
                handleScript = function( elem ) {
                    // Check if we consider it executable
                    if ( !elem.type || rscriptType.test( elem.type ) ) {
                        // Detach the script and store it in the scripts array (if provided) or the fragment
                        // Return truthy to indicate that it has been handled
                        return scripts ?
                            scripts.push( elem.parentNode ? elem.parentNode.removeChild( elem ) : elem ) :
                            fragment.appendChild( elem );
                    }
                };

                for ( i = 0; (elem = ret[i]) != null; i++ ) {
                    // Check if we're done after handling an executable script
                    if ( !( jQuery.nodeName( elem, "script" ) && handleScript( elem ) ) ) {
                        // Append to fragment and handle embedded scripts
                        fragment.appendChild( elem );
                        if ( typeof elem.getElementsByTagName !== "undefined" ) {
                            // handleScript alters the DOM, so use jQuery.merge to ensure snapshot iteration
                            jsTags = jQuery.grep( jQuery.merge( [], elem.getElementsByTagName("script") ), handleScript );

                            // Splice the scripts into ret after their former ancestor and advance our index beyond them
                            ret.splice.apply( ret, [i + 1, 0].concat( jsTags ) );
                            i += jsTags.length;
                        }
                    }
                }
            }

            return ret;
        };
    }

    var eventAdd = jQuery.event.add,
        eventRemove = jQuery.event.remove,
        eventTrigger = jQuery.event.trigger,
        oldToggle = jQuery.fn.toggle,
        oldLive = jQuery.fn.live,
        oldDie = jQuery.fn.die,
        ajaxEvents = "ajaxStart|ajaxStop|ajaxSend|ajaxComplete|ajaxError|ajaxSuccess",
        rajaxEvent = new RegExp( "\\b(?:" + ajaxEvents + ")\\b" ),
        rhoverHack = /(?:^|\s)hover(\.\S+|)\b/,
        hoverHack = function( events ) {
            if ( typeof( events ) !== "string" || jQuery.event.special.hover ) {
                return events;
            }
            if ( rhoverHack.test( events ) ) {
                migrateWarn("'hover' pseudo-event is deprecated, use 'mouseenter mouseleave'");
            }
            return events && events.replace( rhoverHack, "mouseenter$1 mouseleave$1" );
        };

    // Event props removed in 1.9, put them back if needed; no practical way to warn them
    if ( jQuery.event.props && jQuery.event.props[ 0 ] !== "attrChange" ) {
        jQuery.event.props.unshift( "attrChange", "attrName", "relatedNode", "srcElement" );
    }

    // Undocumented jQuery.event.handle was "deprecated" in jQuery 1.7
    if ( jQuery.event.dispatch ) {
        migrateWarnProp( jQuery.event, "handle", jQuery.event.dispatch, "jQuery.event.handle is undocumented and deprecated" );
    }

    // Support for 'hover' pseudo-event and ajax event warnings
    jQuery.event.add = function( elem, types, handler, data, selector ){
        if ( elem !== document && rajaxEvent.test( types ) ) {
            migrateWarn( "AJAX events should be attached to document: " + types );
        }
        eventAdd.call( this, elem, hoverHack( types || "" ), handler, data, selector );
    };
    jQuery.event.remove = function( elem, types, handler, selector, mappedTypes ){
        eventRemove.call( this, elem, hoverHack( types ) || "", handler, selector, mappedTypes );
    };

    jQuery.fn.error = function() {
        var args = Array.prototype.slice.call( arguments, 0);
        migrateWarn("jQuery.fn.error() is deprecated");
        args.splice( 0, 0, "error" );
        if ( arguments.length ) {
            return this.bind.apply( this, args );
        }
        // error event should not bubble to window, although it does pre-1.7
        this.triggerHandler.apply( this, args );
        return this;
    };

    jQuery.fn.toggle = function( fn, fn2 ) {

        // Don't mess with animation or css toggles
        if ( !jQuery.isFunction( fn ) || !jQuery.isFunction( fn2 ) ) {
            return oldToggle.apply( this, arguments );
        }
        migrateWarn("jQuery.fn.toggle(handler, handler...) is deprecated");

        // Save reference to arguments for access in closure
        var args = arguments,
            guid = fn.guid || jQuery.guid++,
            i = 0,
            toggler = function( event ) {
                // Figure out which function to execute
                var lastToggle = ( jQuery._data( this, "lastToggle" + fn.guid ) || 0 ) % i;
                jQuery._data( this, "lastToggle" + fn.guid, lastToggle + 1 );

                // Make sure that clicks stop
                event.preventDefault();

                // and execute the function
                return args[ lastToggle ].apply( this, arguments ) || false;
            };

        // link all the functions, so any of them can unbind this click handler
        toggler.guid = guid;
        while ( i < args.length ) {
            args[ i++ ].guid = guid;
        }

        return this.click( toggler );
    };

    jQuery.fn.live = function( types, data, fn ) {
        migrateWarn("jQuery.fn.live() is deprecated");
        if ( oldLive ) {
            return oldLive.apply( this, arguments );
        }
        jQuery( this.context ).on( types, this.selector, data, fn );
        return this;
    };

    jQuery.fn.die = function( types, fn ) {
        migrateWarn("jQuery.fn.die() is deprecated");
        if ( oldDie ) {
            return oldDie.apply( this, arguments );
        }
        jQuery( this.context ).off( types, this.selector || "**", fn );
        return this;
    };

    // Turn global events into document-triggered events
    jQuery.event.trigger = function( event, data, elem, onlyHandlers  ){
        if ( !elem && !rajaxEvent.test( event ) ) {
            migrateWarn( "Global events are undocumented and deprecated" );
        }
        return eventTrigger.call( this,  event, data, elem || document, onlyHandlers  );
    };
    jQuery.each( ajaxEvents.split("|"),
        function( _, name ) {
            jQuery.event.special[ name ] = {
                setup: function() {
                    var elem = this;

                    // The document needs no shimming; must be !== for oldIE
                    if ( elem !== document ) {
                        jQuery.event.add( document, name + "." + jQuery.guid, function() {
                            jQuery.event.trigger( name, null, elem, true );
                        });
                        jQuery._data( this, name, jQuery.guid++ );
                    }
                    return false;
                },
                teardown: function() {
                    if ( this !== document ) {
                        jQuery.event.remove( document, name + "." + jQuery._data( this, name ) );
                    }
                    return false;
                }
            };
        }
    );


    })( jQuery, window );

    // The migrate plugin has been added to the jQuery object, now return it as noConflict to allow usage of older jQuery and newer using require
    return jQuery.noConflict( true );
});
/* 
 * 
 * Oskari 2.0 class system 
 * 
 * This module implements Oskari clazz system and bundle management.
 * 
 * Supports class definintion, inheritance, method categories,
 * class metadata, class implementation in separate files.
 *
 * Supports async loading with class stubs and post definition
 * inheritance and method category changes.
 * 
 * Concepts bundle and bundle instance are used to compose
 * application from a set of extension modules.
 * 
 * This is free software.
 *
 */
(function() {
    var global = this; // in non-strict mode this will refer to the global "window" object
    var isDebug = false;
    var isConsole = window.console != null && window.console.debug;

    var logMsg = function(msg) {
        if (!isDebug) {
            return;
        }

        if (!isConsole) {
            return;
        }
        window.console.debug(msg);

    }
    /**
     * @class Oskari.bundle_locale
     * 
     * a localisation registry 
     * 
     */
    var bundle_locale = function() {
        this.lang = null;
        this.localizations = {};

    };

    bundle_locale.prototype = {
        setLocalization : function(lang, key, value) {
            if (!this.localizations[lang])
                this.localizations[lang] = {};
            this.localizations[lang][key] = value;
        },
        setLang : function(lang) {
            this.lang = lang;
        },
        getLang : function() {
            return this.lang;
        },
        getLocalization : function(key) {
            return this.localizations[this.lang][key];
        }
    };

    /**
     * singleton localisation registry instance
     */
    var blocale = new bundle_locale();

    /*
     * 'dev' adds ?ts=<instTs> parameter to js loads 'default' does not add
     * 'static' assumes srcs are already loaded <any-other> is assumed as a
     * request to load built js packs using this path pattern .../<bundles-path>/<bundle-name>/build/<any-ohther>.js
     */
    var supportBundleAsync = false;
    var mode = 'default';
    // 'static' / 'dynamic'

    var _preloaded = true;
    function preloaded() {
        return _preloaded;
    }

    var o2clazzsystem = function() {
        this.packages = {};
        this.protocols = {};
        this.inheritance = {};
        this.aspects = {};
        this.clazzcache = {};
        this.globals = {};
    };

    o2clazzsystem.prototype = {

        purge : function() {

        },

        protocol : function() {
            var args = arguments;
            if (args.length == 0)
                throw "missing arguments";

            // var cdef = args[0];

            return this.protocols[args[0]];

        },

        /* lookup pdefsp */
        pdefsp : function(cdef) {
            var pdefsp = this.clazzcache[cdef];

            var bp = null, pp = null, sp = null;
            if (!pdefsp) {
                var parts = cdef.split('.'), bp = parts[0], pp = parts[1], sp = parts.slice(2).join('.');

                var pdef = this.packages[pp];
                if (!pdef) {
                    pdef = {};
                    this.packages[pp] = pdef;
                }
                pdefsp = pdef[sp];
                this.clazzcache[cdef] = pdefsp;

            }
            return pdefsp;
        },

        /**
         * @method metadata
         *
         * Returns metadata for the class
         *
         * @param classname
         *            the name of the class as string
         */
        metadata : function() {
            var args = arguments;
            if (args.length == 0)
                throw "missing arguments";

            var cdef = args[0], pdefsp = this.pdefsp(cdef);

            if (!pdefsp)
                throw "clazz " + cdef + " does not exist";

            return pdefsp._metadata;

        },
        /**
         * @method updateMetadata
         * @private
         *
         * Updates and binds class metadata
         */
        "updateMetadata" : function(bp, pp, sp, pdefsp, classMeta) {
            if (!pdefsp._metadata)
                pdefsp._metadata = {};

            pdefsp._metadata['meta'] = classMeta;

            var protocols = classMeta['protocol'];
            if (protocols) {
                for (var p = 0; p < protocols.length; p++) {
                    var pt = protocols[p];

                    if (!this.protocols[pt]) {
                        this.protocols[pt] = {};
                    }

                    var cn = bp + "." + pp + "." + sp;

                    this.protocols[pt][cn] = pdefsp;
                }
            }

        },
        _super : function() {
            var supCat = arguments[0];
            var supMet = arguments[1];
            var me = this;
            return function() {
                return me['_']._superCategory[supCat][supMet].apply(me, arguments);
            }
        },
        /**
         * @method define
         *
         * Creates a class definition
         * @param {String}
         *            classname the name of the class to be defined
         * @param {Function}
         *            constructor constructor function for the class
         * @param {Object}
         *            prototype a property object containing methods and
         *            definitions for the class prototype
         * @param {Object}
         *            metadata optional metadata for the class
         */
        define : function() {
            var args = arguments;
            if (args.length == 0)
                throw "missing arguments";

            var cdef = args[0];
            var parts = cdef.split('.');

            /*
             * bp base part pp package part sp rest
             */
            var bp = parts[0], pp = parts[1], sp = parts.slice(2).join('.');

            var pdef = this.packages[pp];
            if (!pdef) {
                pdef = {};
                this.packages[pp] = pdef;
            }

            var pdefsp = pdef[sp];

            if (pdefsp) {
                // update constrcutor
                if (args[1]) {
                    pdefsp._constructor = args[1];
                }

                // update prototype
                var catFuncs = args[2], prot = pdefsp._class.prototype;

                for (p in catFuncs) {
                    var pi = catFuncs[p];

                    prot[p] = pi;
                }
                var catName = cdef;
                if (catFuncs) {
                    pdefsp._category[catName] = catFuncs;
                }
                if (args.length > 3) {

                    var extnds = args[3].extend;
                    for (var e = 0; extnds && e < extnds.length; e++) {
                        var superClazz = this.lookup(extnds[e]);
                        if (!superClazz._composition.subClazz)
                            superClazz._composition.subClazz = {};
                        superClazz._composition.subClazz[extnds[e]] = pdefsp;
                        pdefsp._composition.superClazz = superClazz;
                    }

                    this.updateMetadata(bp, pp, sp, pdefsp, args[3]);
                }

                this.pullDown(pdefsp);
                this.pushDown(pdefsp);

                return pdefsp;
            }

            var cd = function() {
            };
            var compo = {
                clazzName : cdef,
                superClazz : null,
                subClazz : null
            };
            cd.prototype = {
            };
            //args[2];
            pdefsp = {
                _class : cd,
                _constructor : args[1],
                _category : {},
                _composition : compo
            };
            cd.prototype['_'] = pdefsp;
            cd.prototype['_super'] = this['_super'];

            // update prototype
            var catFuncs = args[2];
            var prot = cd.prototype;

            for (p in catFuncs) {
                var pi = catFuncs[p];

                prot[p] = pi;
            }
            var catName = cdef;
            if (catFuncs) {
                pdefsp._category[catName] = catFuncs;
            }

            this.inheritance[cdef] = compo;
            pdef[sp] = pdefsp;

            if (args.length > 3) {

                var extnds = args[3].extend;
                for (var e = 0; extnds && e < extnds.length; e++) {
                    var superClazz = this.lookup(extnds[e]);
                    if (!superClazz._composition.subClazz)
                        superClazz._composition.subClazz = {};
                    superClazz._composition.subClazz[cdef] = pdefsp;
                    pdefsp._composition.superClazz = superClazz;
                }

                this.updateMetadata(bp, pp, sp, pdefsp, args[3]);
            }
            this.pullDown(pdefsp);
            this.pushDown(pdefsp);

            return pdefsp;
        },
        /**
         * @method category
         *
         * adds some logical group of methods to class prototype
         *
         * Oskari.clazz.category('Oskari.mapframework.request.common.ActivateOpenlayersMapControlRequest',
         * 'map-layer-funcs',{ "xxx": function() {} });
         */
        category : function() {
            var args = arguments;
            if (args.length == 0)
                throw "missing arguments";

            var cdef = args[0], parts = cdef.split('.'), bp = parts[0], pp = parts[1], sp = parts.slice(2).join('.');

            var pdef = this.packages[pp];
            if (!pdef) {
                pdef = {};
                this.packages[pp] = pdef;
            }
            var pdefsp = pdef[sp];

            if (!pdefsp) {
                var cd = function() {
                };
                var compo = {
                    clazzName : cdef,
                    superClazz : null,
                    subClazz : null
                };
                cd.prototype = {
                };
                pdefsp = {
                    _class : cd,
                    _constructor : args[1],
                    _category : {},
                    _composition : compo
                };
                cd.prototype['_'] = pdefsp;
                cd.prototype['_super'] = this['_super'];
                this.inheritance[cdef] = compo;
                pdef[sp] = pdefsp;

            }

            var catName = args[1], catFuncs = args[2], prot = pdefsp._class.prototype;

            for (p in catFuncs) {
                var pi = catFuncs[p];

                prot[p] = pi;
            }

            if (catFuncs) {
                pdefsp._category[catName] = catFuncs;
            }

            this.pullDown(pdefsp);
            this.pushDown(pdefsp);

            return pdefsp;
        },

        /**
         * looup and create stub
         */
        lookup : function() {
            var args = arguments;
            if (args.length == 0)
                throw "missing arguments";

            var cdef = args[0], parts = cdef.split('.'), bp = parts[0], pp = parts[1], sp = parts.slice(2).join('.');

            var pdef = this.packages[pp];
            if (!pdef) {
                pdef = {};
                this.packages[pp] = pdef;
            }
            var pdefsp = pdef[sp];

            if (!pdefsp) {
                var cd = function() {
                };
                cd.prototype = {};
                var compo = {
                    clazzName : cdef,
                    superClazz : null,
                    subClazz : null
                };
                pdefsp = {
                    _class : cd,
                    _constructor : args[1],
                    _category : {},
                    _composition : compo
                };
                this.inheritance[cdef] = compo;
                pdef[sp] = pdefsp;

            }

            return pdefsp;
        },
        extend : function() {
            var args = arguments;
            var superClazz = this.lookup(args[1]);
            var subClazz = this.lookup(args[0]);
            if (!superClazz._composition.subClazz)
                superClazz._composition.subClazz = {};
            superClazz._composition.subClazz[args[0]] = subClazz;
            subClazz._composition.superClazz = superClazz;
            this.pullDown(subClazz);
            return subClazz;
        },
        composition : function() {
            var cdef = arguments[0];

            var pdefsp = this.pdefsp(cdef);
            return pdefsp;
        },
        /**
         * @method pushDown
         *
         * force each derived class to pullDown
         * some overhead here if complex hierarchies are
         * implemented
         *
         */
        pushDown : function(pdefsp) {
            /* !self */
            if (!pdefsp._composition.subClazz) {
                return;
            }
            for (var sub in pdefsp._composition.subClazz) {
                var pdefsub = pdefsp._composition.subClazz[sub];
                this.pullDown(pdefsub);
                this.pushDown(pdefsub);
            }
            return pdefsp;
        },
        /**
         * @method pullDown
         *
         * EACH class is responsible for it's entire hierarchy
         * no intermediate results are being consolidated
         *
         */
        pullDown : function(pdefsp) {
            if (!pdefsp._composition.superClazz) {
                return;
            }

            var clazzHierarchy = [];
            clazzHierarchy.push(pdefsp);

            var funcs = {};
            var spr = pdefsp;
            while (true) {
                spr = spr._composition.superClazz;
                if (!spr) {
                    break;
                }
                clazzHierarchy.push(spr);
            }

            var prot = pdefsp._class.prototype;
            var constructors = [];
            var superClazzMethodCats = {};
            for (var s = clazzHierarchy.length - 1; s >= 0; s--) {
                var cn = clazzHierarchy[s]._composition.clazzName;

                var ctor = clazzHierarchy[s]._constructor;
                constructors.push(ctor);

                var superClazzMetCat = {};
                for (var c in clazzHierarchy[s]._category ) {

                    var catName = cn + "#" + c;
                    var catFuncs = clazzHierarchy[s]._category[c];
                    for (p in catFuncs) {
                        var pi = catFuncs[p];
                        prot[p] = pi;
                        superClazzMetCat[p] = pi;
                    }
                }
                superClazzMethodCats[cn] = superClazzMetCat;
            }
            pdefsp._constructors = constructors;
            pdefsp._superCategory = superClazzMethodCats;

            return pdefsp;
        },

        slicer : Array.prototype.slice,

        create : function() {
            var args = arguments;
            if (args.length == 0)
                throw "missing arguments";
            var instargs = this.slicer.apply(arguments, [1]), cdef = args[0], pdefsp = this.pdefsp(cdef);
            if (!pdefsp)
                throw "clazz " + cdef + " does not exist";

            var inst = new pdefsp._class(), ctors = pdefsp._constructors;
            if (ctors) {
                for (var c = 0; c < ctors.length; c++) {
                    ctors[c].apply(inst, instargs);
                }
            } else {
                pdefsp._constructor.apply(inst, instargs);
            }
            return inst;
        },

        createWithPdefsp : function() {
            var args = arguments;
            if (args.length == 0)
                throw "missing arguments";
            var instargs = arguments[1], pdefsp = args[0];
            if (!pdefsp)
                throw "clazz does not exist";

            var inst = new pdefsp._class(), ctors = pdefsp._constructors;
            if (ctors) {
                for (var c = 0; c < ctors.length; c++) {
                    ctors[c].apply(inst, instargs);
                }
            } else {
                pdefsp._constructor.apply(inst, instargs);
            }
            return inst;
        },

        construct : function() {
            var args = arguments;
            if (args.length != 2)
                throw "missing arguments";

            var cdef = args[0], instprops = args[1], pdefsp = this.pdefsp(cdef);

            if (!pdefsp)
                throw "clazz " + cdef + " does not exist";

            var inst = new pdefsp._class(), ctors = pdefsp._constructors;
            if (ctors) {
                for (var c = 0; c < ctors.length; c++) {
                    ctors[c].apply(inst, instargs);
                }
            } else {
                pdefsp._constructor.apply(inst, instargs);
            }
            return inst;
        },
        /**
         * @builder
         *
         * Implements Oskari frameworks support for cached class instance
         * builders
         * @param classname
         */
        builder : function() {
            var args = arguments;
            if (args.length == 0)
                throw "missing arguments";

            var cdef = args[0], pdefsp = this.pdefsp(cdef);

            if (!pdefsp)
                throw "clazz " + cdef + " does not exist";

            if (pdefsp._builder)
                return pdefsp._builder;

            pdefsp._builder = function() {
                var instargs = arguments, inst = new pdefsp._class(), ctors = pdefsp._constructors;
                if (ctors) {
                    for (var c = 0; c < ctors.length; c++) {
                        ctors[c].apply(inst, instargs);
                    }
                } else {
                    pdefsp._constructor.apply(inst, instargs);
                }
                return inst;
            };
            return pdefsp._builder;

        },
        /**
         * @builder
         *
         * Implements Oskari frameworks support for cached class instance
         * builders
         * @param classname
         */
        builderFromPdefsp : function() {
            var args = arguments;
            if (args.length == 0)
                throw "missing arguments";

            var pdefsp = args[0];

            if (!pdefsp)
                throw "clazz does not exist";

            if (pdefsp._builder)
                return pdefsp._builder;

            pdefsp._builder = function() {
                var instargs = arguments, inst = new pdefsp._class(), ctors = pdefsp._constructors;
                if (ctors) {
                    for (var c = 0; c < ctors.length; c++) {
                        ctors[c].apply(inst, instargs);
                    }
                } else {
                    pdefsp._constructor.apply(inst, instargs);
                }
                return inst;
            };
            return pdefsp._builder;

        },
        global : function() {
            if (arguments.length == 0)
                return this.globals;
            var name = arguments[0];
            if (arguments.length == 2) {
                this.globals[name] = arguments[1];
            }
            return this.globals[name];

        }
    };

	/*
	 * singleton instance of the clazz system 
	 * 
	 */
    var clazz_singleton = new o2clazzsystem();
    var cs = clazz_singleton;

    /**
     * @class Oskari.bundle_mediator
     *
     * A mediator class to support bundle to/from bundle manager communication
     * and initialisation as well as bundle state management
     *
     */
    var bundle_mediator = function(opts) {
        this.manager = null;

        for (p in opts) {
            this[p] = opts[p];
        }
        ;
    };
    bundle_mediator.prototype = {
        /**
         * @method setState
         * @param state
         * @returns
         */
        "setState" : function(state) {
            this.state = state;
            this.manager.postChange(this.bundle, this.instance, this.state);
            return this.state;
        },
        /**
         * @method getState
         * @returns
         */
        "getState" : function() {

            return this.state;
        }
    };

    /**
     * @class Oskari.bundle_trigger
     */
    var bundle_trigger = function(btc, cb, info) {
        this.config = btc;
        this.callback = cb;
        this.fired = false;
        this.info = info;
    };
    bundle_trigger.prototype = {
        /**
         * @method execute
         *
         * executes a trigger callback based on bundle state
         */
        "execute" : function(manager, b, bi, info) {

            var me = this;
            if (me.fired) {
                //manager.log("trigger already fired " + info || this.info);
                return;
            }

            for (p in me.config["Import-Bundle"]) {
                var srcState = manager.stateForBundleSources[p];
                if (!srcState || srcState.state != 1) {
                    manager.log("trigger not fired due " + p + " for " + info || this.info);
                    return;
                }
            }
            me.fired = true;
            manager.log("posting trigger");
            var cb = this.callback;

            window.setTimeout(function() {
                cb(manager);
            }, 0);
        }
    };

	/**
	 * @class Oskari.BundleManager
	 * 
	 * instance of this class is used to create bundles, bundle instances
	 * and manage instance lifecycle.
	 * 
	 * Bundles are identified by 'bundle identifier'.
	 *  
	 */
    cs.define('Oskari.BundleManager', function() {
        this.serial = 0;
        this.impls = {};
        this.sources = {};
        this.instances = {};
        this.bundles = {};
        this.stateForBundleDefinitions = {};
        this.stateForBundleSources = {};
        this.stateForBundles = {};
        this.stateForBundleInstances = {};
        this.triggers = [];
        this.loaderStateListeners = [];
    }, {
        purge : function() {
            for (var p in this.sources ) {
                delete this.sources[p];
            }
            for (var p in this.stateForBundleDefinitions ) {
                delete this.stateForBundleDefinitions[p].loader;
            }
            for (var p in this.stateForBundleSources ) {
                delete this.stateForBundleSources[p].loader;
            }
        },
        /**
         * @
         */
        notifyLoaderStateChanged : function(bl, finished) {
            if (this.loaderStateListeners.length == 0)
                return;
            for (var l = 0; l < this.loaderStateListeners.length; l++) {
                var cb = this.loaderStateListeners[l];
                cb(bl, finished);
            }
        },
        registerLoaderStateListener : function(cb) {
            this.loaderStateListeners.push(cb);
        },
        /**
         * @method alert
         * @param what
         *
         * a loggin and debugging function
         */
        alert : function(what) {
            logMsg(what);
        },
        /**
         * @method log a loggin and debuggin function
         *
         */
        log : function(what) {
            logMsg(what);

        },
        /**
         * @method self
         * @returns {bundle_manager}
         */
        self : function() {
            return this;
        },

        /* ! NOTE ! implid and bundleid ARE NOT TO BE CONFUSED WITH FACADE'S INSTANCEID OR instances arrays indexes */
        /* ! NOTE ! implid AND bundleid AS WELL AS bnldImpl are most likely always the same value */

        /**
         * @method install
         * @param implid
         *            bundle implementation identifier
         * @param bp
         *            bundle registration function
         * @param srcs
         *            source files
         *
         *
         */
        install : function(implid, bp, srcs, metadata) {
            // installs bundle
            // DOES not INSTANTIATE only register bp as function
            // declares any additional sources required

            var me = this;
            var bundleImpl = implid;
            var defState = me.stateForBundleDefinitions[bundleImpl];
            if (defState) {
                defState.state = 1;
                me.log("SETTING STATE FOR BUNDLEDEF " + bundleImpl + " existing state to " + defState.state);
            } else {
                defState = {
                    state : 1
                };

                me.stateForBundleDefinitions[bundleImpl] = defState;
                me.log("SETTING STATE FOR BUNDLEDEF " + bundleImpl + " NEW state to " + defState.state);
            }
            defState.metadata = metadata;

            me.impls[bundleImpl] = bp;
            me.sources[bundleImpl] = srcs;

            var srcState = me.stateForBundleSources[bundleImpl];
            if (srcState) {
                if (srcState.state == -1) {
                    me.log("triggering loadBundleSources for " + bundleImpl + " at loadBundleDefinition");
                    window.setTimeout(function() {
                        me.loadBundleSources(bundleImpl);
                    }, 0);
                } else {
                    me.log("source state for " + bundleImpl + " at loadBundleDefinition is " + srcState.state);
                }
            }
            me.postChange(null, null, "bundle_definition_loaded");
        },
        /**
         * @method installBundleClass
         * @param implid
         * @param bp
         * @param srcs
         *
         * Installs a bundle defined as Oskari native Class
         */
        installBundleClass : function(implid, clazzName) {

            var classmeta = cs.metadata(clazzName);
            var bp = cs.builder(clazzName);
            var srcs = classmeta.meta.source;
            var bundleMetadata = classmeta.meta.bundle;

            this.install(implid, bp, srcs, bundleMetadata);

        },
        /**
         * @method installBundlePdefs
         * @param implid
         * @param bp
         * @param srcs
         *
         * Installs a bundle defined as Oskari native Class
         */
        installBundlePdefsp : function(implid, pdefsp) {

            var bp = cs.builderFromPdefsp(pdefsp);
            var bundleMetadata = pdefsp._metadata;
            var srcs = {};

            this.install(implid, bp, srcs, bundleMetadata);

        },
        /**
         * @method impl
         * @param implid
         * @returns bundle implemenation
         *
         */
        impl : function(implid) {
            return this.impls[implid];
        },

        /**
         * @method postChange
         * @private
         * @param b
         * @param bi
         * @param info
         *
         * posts a notification to bundles and bundle instances
         *
         */
        postChange : function(b, bi, info) {
            // self
            var me = this;
            me.update(b, bi, info);

            // bundles
            for (bid in me.bundles) {
                var o = me.bundles[bid];
                o.update(me, b, bi, info);

            }
            // and instances
            for (i in me.instances) {
                var o = me.instances[i];
                if (!o)
                    continue;
                o.update(me, b, bi, info);
            }

        },
        /**
         * @method createBundle
         * @param implid
         * @param bundleid
         * @param env
         * @returns
         *
         * Creates a Bundle (NOTE NOT an instance of bundle)
         * implid, bundleid most likely same value
         */
        createBundle : function(implid, bundleid) {
            var bundlImpl = implid;
            var me = this;
            var defState = me.stateForBundleDefinitions[bundlImpl];
            if (!defState) {
                throw "INVALID_STATE: for createBundle / " + "definition not loaded " + implid + "/" + bundleid;
            }

            var bp = this.impls[implid];
            if (!bp) {
                alert("this.impls[" + implid + "] is null!");
                return;
            }
            var b = bp(defState);

            this.bundles[bundleid] = b;
            this.stateForBundles[bundleid] = {
                state : true,
                bundlImpl : bundlImpl
            };

            this.postChange(b, null, "bundle_created");

            return b;
        },

        /**
         * @method update
         * @param bundleid
         * @returns
         *
         * fires any pending bundle or bundle instance triggers
         *
         */
        update : function(b, bi, info) {

            var me = this;
            me.log("update called with info " + info);

            for (var n = 0; n < me.triggers.length; n++) {
                var t = me.triggers[n];
                t.execute(me);
            }
        },
        /**
         * @method bundle
         * @param bundleid
         * @returns bundle
         */
        bundle : function(bundleid) {
            return this.bundles[bundleid];
        },
        /**
         * @method destroyBundle
         * @param bundleid
         *
         * NYI. Shall DESTROY bundle definition
         */
        destroyBundle : function(bundleid) {
        },

        uninstall : function(implid) {
            var bp = this.impls[implid];
            return bp;
        },
        /**
         * creates a bundle instance for previously installed and created bundle
         */
        createInstance : function(bundleid) {

            var me = this;
            if (!me.stateForBundles[bundleid] || !me.stateForBundles[bundleid].state) {
                throw "INVALID_STATE: for createInstance / " + "definition not loaded " + bundleid;
            }

            var s = "" + (++this.serial);

            var b = this.bundles[bundleid];
            var bi = b["create"]();

            bi.mediator = new bundle_mediator({
                "bundleId" : bundleid,
                "instanceid" : s,
                "state" : "initial",
                "bundle" : b,
                "instance" : bi,
                "manager" : this,
                "clazz" : cs,
                "requestMediator" : {}
            });

            this.instances[s] = bi;
            this.stateForBundleInstances[s] = {
                state : true,
                bundleid : bundleid
            };

            this.postChange(b, bi, "instance_created");
            return bi;
        },
        /**
         * @method instance
         * @param instanceid
         * @returns bundle instance
         */
        instance : function(instanceid) {

            return this.instances[instanceid];
        },
        /**
         * @method destroyInstance
         * @param instanceid
         * @returns
         *
         * destroys and unregisters bundle instance
         */
        destroyInstance : function(instanceid) {

            var bi = this.instances[instanceid];
            var mediator = bi.mediator;
            mediator.bundle = null;
            mediator.manager = null;
            mediator.clazz = null;

            bi.mediator = null;

            this.instances[instanceid] = null;
            bi = null;

            return bi;
        },
        /**
         * @method on
         * @param config
         * @param callback
         *
         * trigger registration
         */
        on : function(cfg, cb, info) {
            this.triggers.push(new bundle_trigger(cfg, cb, info));
        }
    });

	
	/* 
	 * 
	 * @class Oskari.BundleFacade
	 *  
	 * This provides (did provided more in versions 1.x) some 
	 * helper functions to enhance Oskari.BundleManager
	 * 
	 * This adds bundle instance lookup with 'bundle instance identifier' aka bundleinstancename.  
	 * 
	 */ 
    cs.define('Oskari.BundleFacade', function(bm) {
        this.manager = bm;

        this.bundles = {};
        this.bundleInstances = {};
        /* keyed by identifier */
        this.appSetup = null;

        this.bundlePath = "";

        /**
         * @property appConfig
         * application configuration (state) for instances
         * this is injected to instances before 'start' is called
         *
         */
        this.appConfig = {};
    }, {

        /**
         * @method getBundleInstanceByName
         *
         * returns bundle_instance by bundleinstancename defined in player json
         */
        getBundleInstanceByName : function(bundleinstancename) {
            var me = this;
            return me.bundleInstances[bundleinstancename];
        },
        /**
         * @method getBundleInstanceConfigurationByName
         *
         * returns configuration for instance by bundleinstancename
         */
        getBundleInstanceConfigurationByName : function(bundleinstancename) {
            var me = this;
            return me.appConfig[bundleinstancename];
        },

        setConfiguration : function(config) {
            this.appConfig = config;
        },
        getConfiguration : function() {
            return this.appConfig;
        }
    });

    /**
     *
     */

    /**
     * singleton instance of Oskari.BundleManager manages lifecycle for bundles and bundle instances.
     * 
     */
    var bm = cs.create('Oskari.BundleManager');
    bm.clazz = cs;

    /**
     * @class Oskari.BundleFacade
     * 
     * pluggable DOM manager. This is the no-op default implementation. 
     *  
     */
    var fcd = cs.create('Oskari.BundleFacade', bm);
    var ga = cs.global;

    cs.define('Oskari.DomManager', function(dollar) {
        this.$ = dollar;
    }, {
        getEl : function(selector) {
            return this.$(selector);
        },
        getElForPart : function(part) {
            throw "N/A";
        },
        setElForPart : function(part, el) {
            throw "N/A";
        },
        setElParts : function(partsMap) {
            throw "N/A";
        },
        getElParts : function() {
            throw "N/A";
        },
        pushLayout : function(s) {
            throw "N/A";
        },
        popLayout : function(s) {
            throw "N/A";
        },
        getLayout : function() {
            throw "N/A";
        }
    });

    var domMgr = cs.create('Oskari.DomManager');

    /* o2 clazz module  */
    var o2anonclass = 0;
    var o2anoncategory = 0;
    var o2anonbundle = 0;

    /* this is Oskari 2 modulespec prototype which provides a leaner API  */
   
   /* @class Oskari.ClazzWrapper 
    *
    * Wraps class instance of which is returned from oskari 2.0 api
    * Returned class instance may be used to chain class definition calls.
    */
    cs.define('Oskari.ClazzWrapper', function(clazzInfo, clazzName) {
        this.cs = cs;
        this.clazzInfo = clazzInfo;
        this.clazzName = clazzName;

    }, {

        slicer : Array.prototype.slice,
        
        /* @method category 
         * adds a set of methods to class 
         */
        category : function(protoProps, traitsName) {
            var clazzInfo = cs.category(this.clazzName, traitsName || ( ['__', (++o2anoncategory)].join('_')), protoProps);
            this.clazzInfo = clazzInfo;
            return this;
        },
        /* @method methods
         * adds a set of methods to class - alias to category
         */
        methods : function(protoProps, traitsName) {
            var clazzInfo = cs.category(this.clazzName, traitsName || ( ['__', (++o2anoncategory)].join('_')), protoProps);
            this.clazzInfo = clazzInfo;
            return this;
        },
        
        /* @method extend
         * adds inheritance from  a base class
         * base class can be declared later but must be defined before instantiation 
         */          
        extend: function(extendDefinition) {

            var t = typeof extendDefinition;

            if (t === "string") {
                var clazzInfo = cs.extend(this.clazzName, extendDefinition.length ? extendDefinition : [extendDefinition]);
                this.clazzInfo = clazzInfo;
            } else if (t === "object" && extendDefinition.length) {
                /* derive from given classes */
                var clazzInfo = cs.extend(this.clazzName, extendDefinition.length ? extendDefinition : [extendDefinition]);
                this.clazzInfo = clazzInfo;
            } else {
                /* derive a class from 'this' and apply category to derived class */
                /* used to implement Oskari.Flyout.extend({ funcadelic: function() {} }); kind of adhoc inheritance */
                var cls = Oskari.cls();
                cls.extend(this.clazzName);
                if (extendDefinition) cls.category(extendDefinition);
                return cls;
            }

            return this;
        },
        /* @method create
         * creates an instance of this class
         */
        create : function() {
            return cs.createWithPdefsp(this.clazzInfo, arguments);
        },
        
        /*
         * @method returns the class name  
         */
        name : function() {
            return this.clazzName;
        },
        
        /*
         * @method returns class metadata
         */
        metadata : function() {
            return cs.metadata(this.clazzName);
        },
        
        /*
         * @method events
         * adds a set of event handlers to class
         */
        events : function(events) {
            var orgmodspec = this;
            orgmodspec.category({
                eventHandlers : events,
                onEvent : function(event) {
                    var handler = this.eventHandlers[event.getName()];
                    if (!handler) {
                        return;
                    }

                    return handler.apply(this, [event]);
                }
            }, '___events');
            return orgmodspec;
        },
        requests : function(requests) {
            var orgmodspec = this;
            orgmodspec.category({
                requestHandlers : requests,
                onRequest : function(request) {
                    var handler = this.requestHandlers[request.getName()];
                    if (!handler) {
                        return;
                    }

                    return handler.apply(this, [request]);
                }
            }, '___requests');
            return orgmodspec;
        },
        builder : function() {
            return cs.builderFromPdefsp(this.clazzInfo);
        }
        
        
    });

    /**
     * @static
     * @property Oskari
     * 
     * Oskari main entry objects 
     */
    var o2main = {
        VERSION : "2.0.0",
        bundle_manager : bm, /* */
        bundle_facade : fcd,
        bundle_locale : blocale,
        app : fcd, /* */
        clazz : cs,

        /**
         * @method Oskari.$
         */
        "$" : function() {
            ;
            return ga.apply(cs, arguments);
        },
        /** @static
         *  @property Oskari.clazzadapter
         *  prototype for a class namespace adapter class
         */
        //clazzadapter : clazzadapter,

        run : function(func) {
            func();
        },
        /**
         * @static
         * @method Oskari.setLoaderMode
         */
        setLoaderMode : function(m) {
            mode = m;
        },
        getLoaderMode : function() {
            return mode;
        },
        setDebugMode : function(d) {
            isDebug = d;
        },
        setSupportBundleAsync : function(a) {
            supportBundleAsync = a;
        },
        getSupportBundleAsync : function() {
            return supportBundleAsync;
        },
        setBundleBasePath : function(bp) {
            basePathForBundles = bp;
        },
        getBundleBasePath : function() {
            return basePathForBundles;
        },
        setPreloaded : function(usep) {
            _preloaded = usep;
        },
        getPreloaded : function() {
            return _preloaded;
        },
        /**
         * @static
         * @method Oskari.registerLocalization
         */
        registerLocalization : function(props) {
            if (props.length) {
                for (var p = 0; p < props.length; p++) {
                    var pp = props[p];
                    blocale.setLocalization(pp.lang, pp.key, pp.value);
                }
            } else {
                return blocale.setLocalization(props.lang, props.key, props.value);
            }
        },
        /**
         * @static
         * @method Oskari.getLocalization
         */
        getLocalization : function(key) {
            return blocale.getLocalization(key);
        },
        /**
         * @static
         * @method Oskari.getLang
         */
        getLang : function() {
            return blocale.getLang();
        },
        /**
         * @static
         * @method Oskari.setLang
         */
        setLang : function(lang) {
            return blocale.setLang(lang);
        },
        /**
         * @static
         * @method Oskari.purge
         */
        purge : function() {
            bm.purge();
            cs.purge("Oskari");
        },
        /**
         * @static
         * @method Oskari.getDomManager
         */
        getDomManager : function() {
            return domMgr;
        },
        /**
         * @static
         * @method Oskari.setDomManager
         */
        setDomManager : function(dm) {
            domMgr = dm;
        },
        /**
         * @static
         * @method getSandbox
         */
        getSandbox : function(sandboxName) {
            return ga.apply(cs, [sandboxName || 'sandbox'])
        },
        /**
         * @static
         * @method setSandbox
         */
        setSandbox : function(sandboxName, sandbox) {
            return ga.apply(cs, [sandboxName || 'sandbox', sandbox])
        },

        /**
         * @static
         * @method registerMimeTypeToPlugin
         * @param mimeType mimetype to be mapped
         * @param pluginMapFunc requirejs plugin
         */
        registerMimeTypeToPlugin : function(mimeType, plugin) {
            blMimeTypeToPlugin[mimeType] = plugin;
        },

        /* entry point to new class API see Oskari.ClazzWrapper above */
        cls : function(clazzName, ctor, protoProps, metas) {

            var clazzInfo = undefined;

            if (clazzName == undefined) {
                clazzName = ['Oskari', '_', (++o2anonclass)].join('.');
            } else {
                clazzInfo = cs.lookup(clazzName);
            }

            if (clazzInfo && clazzInfo._constructor && !ctor) {
                // lookup
            } else {
                clazzInfo = cs.define(clazzName, ctor ||
                function() {
                }, protoProps, metas || {});
            }

            return cs.create('Oskari.ClazzWrapper', clazzInfo, clazzName);

        },

        /* o2 helper to access sandbox */
        sandbox : function(sandboxName) {

            var sandboxref = {
                sandbox : ga.apply(cs, [sandboxName || 'sandbox'])
            };

            sandboxref.on = function(instance) {
                var me = this;
                if (instance.eventHandlers) {
                    for (p in instance.eventHandlers) {
                        me.sandbox.registerForEventByName(instance, p);
                    }
                }
                if (instance.requestHandlers) {
                    for (r in instance.requestHandlers ) {
                        me.sandbox.addRequestHandler(r, reqHandlers[r]);
                    }
                }
            }, sandboxref.off = function(instance) {
                if (instance.eventHandlers) {
                    for (p in instance.eventHandlers) {
                        me.sandbox.unregisterFromEventByName(instance, p);
                    }
                }
                if (instance.requestHandlers) {
                    for (r in instance.requestHandlers ) {
                        me.sandbox.removeRequestHandler(r, reqHandlers[r]);
                    }
                }
            }, sandboxref.slicer = Array.prototype.slice, sandboxref.notify = function(eventName) {
                var me = this;
                var sandbox = me.sandbox;
                var builder = me.sandbox.getEventBuilder(eventName);
                var args = me.slicer.apply(arguments, [1]);
                var eventObj = eventBuilder.apply(eventBuilder, args);
                return sandbox.notifyAll(eventObj);
            };

            return sandboxref;

        },

        /* o2 helper to register localisation */
        loc : function() {
            return o2main.registerLocalization.apply(o2main, arguments);
        },

        setConfiguration : function(conf) {
            return fcd.setConfiguration(conf);
        },
        getConfiguration : function() {
            return fcd.getConfiguration();
        }
    };
    
    
    

    /* o2 api for event class */
    o2main.eventCls = function(eventName, constructor, protoProps) {
        var clazzName = ['Oskari', 'event', 'registry', eventName].join('.');
        var rv = o2main.cls(clazzName, constructor, protoProps, {
            protocol : ['Oskari.mapframework.event.Event']
        });

        rv.category({
            getName : function() {
                return eventName;
            }
        }, '___event');

        rv.eventName = eventName;

        return rv;
    };

    /* o2 api for request class */
    o2main.requestCls = function(requestName, constructor, protoProps) {
        var clazzName = ['Oskari', 'request', 'registry', requestName].join('.');
        var rv = o2main.cls(clazzName, constructor, protoProps, {
            protocol : ['Oskari.mapframework.request.Request']
        });

        rv.category({
            getName : function() {
                return requestName;
            }
        }, '___request');

        rv.requestName = requestName;

        return rv;
    };
    
    
    o2main._baseClassFor = {
    	'bundle' : "Oskari.mapframework.bundle.extension.ExtensionBundle"
    };
    

    /* o2 api for bundle classes */
   
    /* @static @method Oskari.bundleCls 
     * 
     */
    o2main.bundleCls = function(bnldId, clazzName) {

        if (!bnldId) {
            bnldId = ( ['__', (++o2anonbundle)].join('_'));
        }

        var rv = o2main.cls(clazzName, function() {
        }, {
            update : function() {
            }
        }, {
            "protocol" : ["Oskari.bundle.Bundle", this._baseClassFor.bundle],
            "manifest" : {
                "Bundle-Identifier" : bnldId
            }
        });
        bm.installBundlePdefsp(bnldId, rv.clazzInfo);

        rv.___bundleIdentifier = bnldId;
        rv.loc = function(props) {
            props.key = this.___bundleIdentifier;
            o2main.registerLocalization(props);
            return rv;
        }, rv.start = function(instanceid) {
            var bundleid = this.___bundleIdentifier;

            if (!fcd.bundles[bundleid]) {
                var b = bm.createBundle(bundleid, bundleid);
                fcd.bundles[bundleid] = b;
            }

            var bi = bm.createInstance(bundleid);
            fcd.bundleInstances[bundleid] = bi;

            var configProps = fcd.getBundleInstanceConfigurationByName(bundleid);
            if (configProps) {
                for (ip in configProps) {
                    bi[ip] = configProps[ip];
                }
            }
            bi.start();

            return bi;
        }, rv.stop = function() {
            var bundleid = this.___bundleIdentifier;
            var bi = fcd.bundleInstances[bundleid];
            return bi.stop();
        };

        return rv;
    },

    ga.apply(cs, ['Oskari', o2main]);

    global.Oskari = o2main;

    define('src/oskari/oskari',['exports'], function(exports) {

        exports.Oskari = o2main;
        return o2main;
    });
})();

/**
 * @class Oskari.mapframework.core.Core
 * 
 * This is the Oskari core. Bundles can register modules and services here for other bundles to reference.
 * Requests and events are forwarded through the core to handlers.
 * TODO: Move handlers (and events as well as requests) to handler bundles with
 * registrable handlers
 */
Oskari.clazz.define('Oskari.mapframework.core.Core',

/**
 * @method create called automatically on construction
 * @static
 */
function() {

    // Currently selected layers, array of MapLayer objects
    this._selectedLayers = new Array();

    // Currently Highlighted maplayers
    this._mapLayersHighlighted = new Array();

    // map domain object
    this._map = null;

    // Sandbox that handles communication
    this._sandbox = Oskari.clazz.create('Oskari.mapframework.sandbox.Sandbox', this);
    
    // bw comp support - this should be removed 
    if( !Oskari.$("sandbox" ) ) {
    	Oskari.$("sandbox", this._sandbox);
    }

    // array of services available
    this._services = [];
    this._servicesByQName = {};

    // Are we currently printing debug (as of 2012-09-24 debug by default false)
    this._debug = false;

    // is Ctrl key down
    this._ctrlKeyDown = false;

    // Allow multiple highlight layers
    this._allowMultipleHighlightLayers = false;

    this._availableRequestsByName = {};
    this._availableEventsByName = {};
    
    /**
     * @property externalHandlerCls
     * External Request handlers that bundles have registered are stored here
     * NOTE: only one request handler can be registered/request
     * NOTE: was static but moved to instance to enable multi sandbox configurations
     */
    this.externalHandlerCls = {

    };
},
{

    /**
     * @method init
     * Inits Oskari core so bundles can reference components/services through sandbox
     *
     * @param {Oskari.mapframework.service.Service[]} services
     *            array of services that are available
     * @param {Oskari.mapframework.enhancement.Enhancement[]} enhancements
     *            array of enhancements that should be executed before starting map
     */
    init : function(services, enhancements) {
        this.printDebug("Initializing core...");

        var sandbox = this._sandbox;

        // Store variables for later use
        this._services = services;
        // Register services
        if (services) {
            for (var s = 0; s < services.length; s++) {
                this.registerService(services[s]);
            }
        }

        // build up domain
        this.printDebug("Sandbox ready, building up domain...");
        this._map = Oskari.clazz.create('Oskari.mapframework.domain.Map');

        // run all enhancements
        this.enhancements = enhancements;
        this._doEnhancements(this.enhancements);

        this.printDebug("Modules started. Core ready.");
    },

    /**
     * @method dispatch
     * Dispatches given event to sandbox
     *
     * @param {Oskari.mapframework.event.Event}
     *            event - event to dispatch
     */
    dispatch : function(event) {
        this._sandbox.notifyAll(event);
    },

    /**
     * @property defaultRequestHandlers
     * @static
     * Default Request handlers
     * Core still handles some Requests sent by bundles. 
     * TODO: Request handling should be moved to apropriate bundles.
     * NOTE: only one request handler can be registered/request
     */
    defaultRequestHandlers : {
        'AddMapLayerRequest' : function(request) {
            this._handleAddMapLayerRequest(request);
            return true;
        },
        'RemoveMapLayerRequest' : function(request) {
            this._handleRemoveMapLayerRequest(request);
            return true;
        },
        'ShowMapLayerInfoRequest' : function(request) {
            this._handleShowMapLayerInfoRequest(request);
            return true;
        },
        'RearrangeSelectedMapLayerRequest' : function(request) {
            this._handleRearrangeSelectedMapLayerRequest(request);
            return true;
        },
        'ChangeMapLayerOpacityRequest' : function(request) {
            this._handleChangeMapLayerOpacityRequest(request);
            return true;
        },
        'ChangeMapLayerStyleRequest' : function(request) {
            this._handleChangeMapLayerStyleRequest(request);
            return true;
        },
        'HighlightMapLayerRequest' : function(request) {
            this._handleHighlightMapLayerRequest(request);
            return true;
        },
        'HighlightWFSFeatureRequest' : function(request) {
            this.handleHighlightWFSFeatureRequest(request);
            return true;
        },
        'HideMapMarkerRequest' : function(request) {
            this._handleHideMapMarkerRequest(request);
            return true;
        },
        'DimMapLayerRequest' : function(request) {
            this._handleDimMapLayerRequest(request.getMapLayerId());
            return true;
        },
        'CtrlKeyDownRequest' : function(request) {
            this._handleCtrlKeyDownRequest();
            return true;
        },
        'CtrlKeyUpRequest' : function(request) {
            this._handleCtrlKeyUpRequest();
            return true;
        },
        '__default' : function(request) {

            this.printWarn("!!!");
            this.printWarn("  There is no handler for");
            this.printWarn("  '" + request.getName() + "'");
            return false;
        }
    },

    /**
     * @method processRequest
     * Forwards requests to corresponding request handlers. 
     * @param {Oskari.mapframework.request.Request} request to forward
     * @return {Boolean} Returns true, if request was handled, false otherwise
     */
    processRequest : function(request) {

        var requestName = request.getName();
        var handlerFunc = this.defaultRequestHandlers[requestName];
        if (handlerFunc) {
            rv = handlerFunc.apply(this, [request]);
        } else {
            var handlerClsInstance = this.externalHandlerCls[requestName];
            if (handlerClsInstance) {
                 // protocol: Oskari.mapframework.core.RequestHandler.handleRequest(core)
                rv = handlerClsInstance.handleRequest(this, request);
            } else {
                handlerFunc = this.defaultRequestHandlers['__default'];
                rv = handlerFunc.apply(this, [request]);
            }

        }
        delete request;

        return rv;
    },

    

    /**
     * @method addRequestHandler
     * Registers a request handler for requests with the given name 
     * NOTE: only one request handler can be registered/request
     * @param {String} requestName - name of the request
     * @param {Oskari.mapframework.core.RequestHandler} handlerClsInstance request handler
     */
    addRequestHandler : function(requestName, handlerClsInstance) {
        this.externalHandlerCls[requestName] = handlerClsInstance;
    },

    /**
     * @method removeRequestHandler
     * Unregisters a request handler for requests with the given name 
     * NOTE: only one request handler can be registered/request
     * @param {String} requestName - name of the request
     * @param {Oskari.mapframework.core.RequestHandler} handlerClsInstance request handler
     */
    removeRequestHandler : function(requestName, handlerInstance) {
        if (this.externalHandlerCls[requestName] === handlerInstance)
            this.externalHandlerCls[requestName] = null;
    },

    /**
     * @method _getQNameForRequest
     * Maps the request name to the corresponding request class name
     * @param {String} name - name of the request
     * @return {String} request class name matching the given request name
     * @private
     */
    _getQNameForRequest : function(name) {
        var qname = this._availableRequestsByName[name];
        if (!qname) {
            this.printDebug("#!#!# ! Updating request metadata...");
            var allRequests = Oskari.clazz.protocol('Oskari.mapframework.request.Request');
            for (p in allRequests) {
                var pdefsp = allRequests[p];
                var reqname = pdefsp._class.prototype.getName();
                this._availableRequestsByName[reqname] = p;
            }
            this.printDebug("#!#!# ! Finished Updating request metadata...");
            qname = this._availableRequestsByName[name];
        }

        return qname;
    },

    /**
     * @method getRequestBuilder
     * Gets a builder method for the request by request name
     * @param {String} name - name of the request
     * @return {Function} builder method for given request name or undefined if not found
     */
    getRequestBuilder : function(requestName) {
        var qname = this._getQNameForRequest(requestName);
        if (!qname) {
            return undefined;
        }
        return Oskari.clazz.builder(qname);
    },

    /**
     * @method _getQNameForEvent
     * Maps the event name to the corresponding event class name
     * @param {String} name - name of the event
     * @return {String} event class name matching the given event name
     * @private
     */
    _getQNameForEvent : function(name) {
        var qname = this._availableEventsByName[name];
        if (!qname) {
            this.printDebug("#!#!# ! Updating event metadata...");

            var allRequests = Oskari.clazz.protocol('Oskari.mapframework.event.Event');

            for (p in allRequests) {
                var pdefsp = allRequests[p];
                var reqname = pdefsp._class.prototype.getName();
                this._availableEventsByName[reqname] = p;
            }
            this.printDebug("#!#!# ! Finished Updating event metadata...");
            qname = this._availableEventsByName[name];
        }

        return qname;
    },

    /**
     * @method getEventBuilder
     * Gets a builder method for the event by event name
     * @param {String} eventName - name of the event
     * @return {Function} builder method for given event name or undefined if not found
     */
    getEventBuilder : function(eventName) {
        var qname = this._getQNameForEvent(eventName);
        if (!qname) {
            return undefined;
        }
        return Oskari.clazz.builder(qname);
    },

    /**
     * @method disableDebug
     * Disables debug logging
     */
    disableDebug : function() {
        this._debug = false;
    },
    
     /**
     * @method enableDebug
     * Enables debug logging
     */
    enableDebug : function() {
        this._debug = true;
    },

    /**
     * @method printDebug
     * Prints given text to browser console
     *
     * @param {String} text message
     */
    printDebug : function(text) {
        if (this._debug && window.console != null) {
            if (window.console.debug != null) {
                console.debug(text);
            } else if (window.console.log != null) {
                console.log(text);
            }
        }
    },

    /**
     * Prints given warn text to browser console
     *
     * @param {String} text
     */
    printWarn : function(text) {
        if (window.console != null) {
            console.warn(text);
        }
    },

    /**
     * @method registerService
     * Registers given service to Oskari so bundles can get reference to it from sandbox
     *
     * @param {Oskari.mapframework.service.Service}
     *            service service to register
     */
    registerService : function(service) {
        this._servicesByQName[service.getQName()] = service;
        //this.registerFrameworkComponentToRuntimeEnvironment(service, service.getName());
    },

    /**
     * @method getService
     * Returns a registered service with given name
     *
     * @param {String} name
     * @return {Oskari.mapframework.service.Service}
     *            service or undefined if not found
     */
    getService : function(type) {
        return this._servicesByQName[type];
    },

    /**
     * @method getMap
     * Returns map domain object
     *
     * @return {Oskari.mapframework.domain.Map}
     */
    getMap : function() {
        return this._map;
    },

    /**
     * @method getSandbox
     * Returns reference to sandbox
     *
     * @return {Oskari.mapframework.sandbox.Sandbox}
     */
    getSandbox : function() {
        return this._sandbox;
    },

    /**
     * @method getRequestParameter
     * Returns a request parameter from query string
     * http://javablog.info/2008/04/17/url-request-parameters-using-javascript/
     * @param {String} name - parameter name
     * @return {String} value for the parameter or null if not found
     */
    getRequestParameter : function(name) {
        name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
        var regexS = "[\\?&]" + name + "=([^&#]*)";
        var regex = new RegExp(regexS);
        var results = regex.exec(window.location.href);
        if (results == null) {
            return null;
        } else {
            return results[1];
        }
    },

    /**
     * @method getObjectName
     * Returns Oskari event/request name from the event/request object
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} obj
     * @return {String} name
     */
    getObjectName : function(obj) {
        return obj["__name"];
    },
    /**
     * @method getObjectCreator
     * Returns Oskari event/request creator from the event/request object
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} obj
     * @return {String} creator
     */
    getObjectCreator : function(obj) {
        return obj["_creator"];
    },
    /**
     * @method setObjectCreator
     * Sets a creator to Oskari event/request object
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} obj
     * @param {String} creator
     */
    setObjectCreator : function(obj, creator) {
        obj["_creator"] = creator;
    },
    /**
     * @method copyObjectCreatorToFrom
     * Copies creator from objFrom to objTo
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} objTo
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} objFrom
     */
    copyObjectCreatorToFrom : function(objTo, objFrom) {
        objTo["_creator"] = objFrom["_creator"];
    }
});

define("src/oskari/base/core/core", function(){});

/**
 * @class Oskari.mapframework.core.Core.enhancementMethods
 *
 * This category class adds enhancement methods to Oskari core as they were in
 * the class itself.
 */
Oskari.clazz.category(
'Oskari.mapframework.core.Core', 'enhancement-methods',
{
    /**
     * @method _doEnhancements
     * Runs all given enhancements (calls enhance method)
     *
     * @param {Oskari.mapframework.enhancement.Enhancement[]} enhancements array of enhancements to run
     * @private
     */
    _doEnhancements : function(enhancements) {
        for (var i = 0; i < enhancements.length; i++) {
            enhancements[i].enhance(this);
        }
    }
}); 
define("src/oskari/base/core/core-enhancement-methods", function(){});

/**
 * @class Oskari.mapframework.core.Core.keyListenerMethods
 *
 * This category class adds key listener methods to Oskari core as they were in
 * the class itself.
 */
Oskari.clazz.category('Oskari.mapframework.core.Core', 'feature-key-listener-methods', {
    
    /**
     * @method handleCtrlKeyDownRequest
     * Sets flag to show that CTRL key is pressed down
     * @private
     */
    _handleCtrlKeyDownRequest : function() {
        this._ctrlKeyDown = true;
    },
    /**
     * @method handleCtrlKeyUpRequest
     * Sets flag to show that CTRL key is released
     * @private
     */
    _handleCtrlKeyUpRequest : function() {
        this._ctrlKeyDown = false;
    },
    /**
     * @method isCtrlKeyDown
     * Returns true if CTRL key is down
     * @return {Boolean} true if CTRL key is down
     */
    isCtrlKeyDown : function() {
        return this._ctrlKeyDown;
    }
});

define("src/oskari/base/core/core-key-listener-methods", function(){});

/**
 * @class Oskari.mapframework.core.Core.mapLayerMethods
 *
 * This category class adds map layers related methods to Oskari core as they were in
 * the class itself.
 */
Oskari.clazz.category('Oskari.mapframework.core.Core', 'map-layer-methods', {

    /**
     * @method isLayerAlreadySelected
     * Checks if the layer matching the id is added to map
     *
     * @param {String} id of the layer to check
     * @return {Boolean} true if the layer is added to map
     */
    isLayerAlreadySelected : function(id) {
        var mapLayerService = this.getService('Oskari.mapframework.service.MapLayerService');
        var layer = mapLayerService.findMapLayer(id, this._selectedLayers);
        //var layer = this.findMapLayer(id, this._selectedLayers);
        return (layer != null);
    },

    /**
     * @method findMapLayerFromSelectedMapLayers
     * Returns the layer domain object matching the id if it is added to map
     *
     * @param {String} id of the layer to get
     * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} 
     *  layer domain object if found matching id or null if not found
     */
    findMapLayerFromSelectedMapLayers : function(id) {
        var mapLayerService = this.getService('Oskari.mapframework.service.MapLayerService');
        var layer = mapLayerService.findMapLayer(id, this._selectedLayers);
        return layer;
    },
    /**
     * @method isMapLayerAlreadyHighlighted
     * Checks if the layer matching the id is "highlighted". Highlighted wfslayer responds to map
     * clicks by highlighting a clicked feature.
     *
     * @param {String} id of the layer to check
     * @return {Boolean} true if the layer is highlighted
     */
    isMapLayerAlreadyHighlighted : function(id) {
        var mapLayerService = this.getService('Oskari.mapframework.service.MapLayerService');
        var layer = mapLayerService.findMapLayer(id, this._mapLayersHighlighted);
        if (layer == null) {
            this.printDebug("[core-map-layer-methods] " + id + " is not yet highlighted.");
        }
        return (layer != null);
    },
    /**
     * @method findMapLayerFromAllAvailable
     * Finds map layer from all available. Uses Oskari.mapframework.service.MapLayerService.
     *
     * @param {String} id of the layer to get
     * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} 
     *  layer domain object if found matching id or null if not found
     */
    findMapLayerFromAllAvailable : function(id) {

        var mapLayerService = this.getService('Oskari.mapframework.service.MapLayerService');
        var layer = mapLayerService.findMapLayer(id);
        if (layer == null) {
            this.printDebug("Cannot find map layer with id '" + id + "' from all available. " + 
                "Check that current user has VIEW permissions to that layer.");
        }
        return layer;
    },
    /**
     * @method getAllSelectedLayers
     * Returns all currently selected map layers
     * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
     */
    getAllSelectedLayers : function() {
        return this._selectedLayers;
    },
    /**
     * @method getAllHighlightedMapLayers
     * Returns all currently highlighted map layers
     * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
     */
    getAllHighlightedMapLayers : function() {
        return this._mapLayersHighlighted;
    },
    /**
     * @method allowMultipleHighlightLayers
     * Allow multiple layers to be highlighted at once
     *
     * @param {Boolean} allow - true to allow, false to restrict to one highlight at a time
     */
    allowMultipleHighlightLayers : function(allow) {
        this._allowMultipleHighlightLayers = allow;
    },
    /**
     * @method handleAddMapLayerRequest
     * Handles AddMapLayerRequests, adds the map layer to selected layers and sends out
     * an AfterMapLayerAddEvent to signal that a map layer has been selected.
     *
     * @param {Oskari.mapframework.request.common.AddMapLayerRequest} request
     * @private
     */
    _handleAddMapLayerRequest : function(request) {

        var id = request.getMapLayerId();
        var keepLayersOrder = request.getKeepLayersOrder();
        var isBaseMap = request.isBasemap();

        this.printDebug("Trying to add map layer with id '" + id + "' AS " + ( isBaseMap ? " BASE " : " NORMAL " ));
        if (this.isLayerAlreadySelected(id)) {
            this.printDebug("Attempt to select already selected layer '" + id + "'");
            return;
        }

        var mapLayer = this.findMapLayerFromAllAvailable(id);
        if (!mapLayer) {
            // not found, ignore
            this.printDebug("Attempt to select layer that is not available '" + id + "'");
            return;
        }

        if (isBaseMap == true) {
            mapLayer.setType("BASE_LAYER");
        }

        // if we need keep layers order, i.e. when map is accessed by link
        if (keepLayersOrder != null && keepLayersOrder) {
            this._selectedLayers.push(mapLayer);
        }
        // else we not need keep layers order (basemaps come
        // first in array, other maps come last)
        else {
            if (mapLayer.isBaseLayer() || isBaseMap == true) {
                var oldSelectedLayers = this._selectedLayers;
                var newSelectedLayers = new Array();
                newSelectedLayers.push(mapLayer);
                for (var i = 0; i < oldSelectedLayers.length; i++) {
                    newSelectedLayers.push(oldSelectedLayers[i]);
                }
                delete this._selectedLayers;
                this._selectedLayers = newSelectedLayers;
            } else {
                this._selectedLayers.push(mapLayer);
            }
        }

        var event = this.getEventBuilder('AfterMapLayerAddEvent')(mapLayer, keepLayersOrder, isBaseMap);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    /**
     * @method _handleRemoveMapLayerRequest
     * Handles RemoveMapLayerRequests, removes the map layer from selected layers and sends out
     * an AfterMapLayerRemoveEvent to signal that a map layer has been removed from selected.
     *
     * @param {Oskari.mapframework.request.common.RemoveMapLayerRequest} request
     * @private
     */
    _handleRemoveMapLayerRequest : function(request) {
        var id = request.getMapLayerId();
        this.printDebug("Trying to remove map layer with id '" + id + "'");
        if (!this.isLayerAlreadySelected(id)) {
            this.printDebug("Attempt to remove layer '" + id + "' that is not selected.");
            return;
        }

        var mapLayer = this.findMapLayerFromAllAvailable(id);
        var index = -1;
        for (var n = 0; n < this._selectedLayers.length; n++) {
            if (this._selectedLayers[n] === mapLayer) {
                index = n;
                break;
            }
        }
        this._selectedLayers.splice(index, 1);

        if (this.isMapLayerAlreadyHighlighted(id)) {
            // remove it from highlighted list
            this.printDebug("Maplayer is also highlighted, removing it from highlight list.");
            this._handleDimMapLayerRequest(id);
        }

        // finally notify sandbox
        var event = this.getEventBuilder('AfterMapLayerRemoveEvent')(mapLayer);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    
    
    /**
     * @method _handleShowMapLayerInfoRequest
     * Handles ShowMapLayerInfoRequest, sends out an AfterShowMapLayerInfoEvent
     *
     * @param {Oskari.mapframework.request.common.ShowMapLayerInfoRequest} request
     * @private
     */
    _handleShowMapLayerInfoRequest : function(request) {
        var mapLayer = this.findMapLayerFromAllAvailable(request.getMapLayerId());
        var event = this.getEventBuilder('AfterShowMapLayerInfoEvent')(mapLayer);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    /**
     * @method _handleShowMapLayerInfoRequest
     * Handles ShowMapLayerInfoRequest, sorts selected layers array so
     * that layer with given id is positioned into given index
     * and all the rest are pushed one step further. Sends out an AfterRearrangeSelectedMapLayerEvent
     *
     * @param {Oskari.mapframework.request.common.RearrangeSelectedMapLayerRequest} request
     * @private
     */
    _handleRearrangeSelectedMapLayerRequest : function(request) {
        var requestToPosition = request.getToPosition();
        var requestMapLayerId = request.getMapLayerId();
        var modifiedLayer = null;
        var oldPosition = 0;
        if (requestMapLayerId != null && requestToPosition != null) {
            modifiedLayer = this.findMapLayerFromSelectedMapLayers(requestMapLayerId);

            var newSelectedLayers = new Array();
            var itemsAdded = 0;
            var lastHandledIndex = 0;

            // loop through layers so that we have enough elements before new position
            for (var i = 0; itemsAdded < requestToPosition; i++) {
                lastHandledIndex++;

                var layer = this._selectedLayers[i];

                if (layer.getId() == requestMapLayerId) {
                    oldPosition = i;
                    continue;
                }

                newSelectedLayers.push(layer);
                itemsAdded++;
            }

            // now we got start of the array ready. Next add modified one.
            newSelectedLayers.push(modifiedLayer);

            // Finally add rest to array
            for (var i = lastHandledIndex; i < this._selectedLayers.length; i++) {
                var layer = this._selectedLayers[i];

                if (layer.getId() == requestMapLayerId) {
                    oldPosition = i;
                    continue;
                }
                newSelectedLayers.push(layer);
            }

            // clear carbage
            delete this._selectedLayers;
            this._selectedLayers = newSelectedLayers;
        }

        // notify listeners
        var event = this.getEventBuilder('AfterRearrangeSelectedMapLayerEvent')(modifiedLayer, oldPosition, requestToPosition);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    
    /**
     * @method _handleChangeMapLayerOpacityRequest
     * Handles ChangeMapLayerOpacityRequest, sends out an AfterChangeMapLayerOpacityEvent
     *
     * @param {Oskari.mapframework.request.common.ChangeMapLayerOpacityRequest} request
     * @private
     */
    _handleChangeMapLayerOpacityRequest : function(request) {
        var layer = this.findMapLayerFromSelectedMapLayers(request.getMapLayerId());
        if (!layer) {
            return;
        }
        layer.setOpacity(request.getOpacity());

        var event = this.getEventBuilder('AfterChangeMapLayerOpacityEvent')(layer);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    /**
     * @method _handleChangeMapLayerStyleRequest
     * Handles ChangeMapLayerStyleRequest, sends out an AfterChangeMapLayerStyleEvent
     *
     * @param {Oskari.mapframework.request.common.ChangeMapLayerStyleRequest} request
     * @private
     */
    _handleChangeMapLayerStyleRequest : function(request) {
        var layer = this.findMapLayerFromSelectedMapLayers(request.getMapLayerId());
        if (!layer) {
            return;
        }
        // Check for magic string
        if (request.getStyle() != "!default!") {
            layer.selectStyle(request.getStyle());
            var event = this.getEventBuilder('AfterChangeMapLayerStyleEvent')(layer);
            this.copyObjectCreatorToFrom(event, request);
            this.dispatch(event);
        }
    },
    /**
     * @method _removeHighLightedMapLayer
     * Removes layer with given id from highlighted layers. 
     * If id is not given -> removes all layers from highlighted layers
     * @param {String} id of the layer to remove or leave undefined to remove all
     * @private
     */
    _removeHighLightedMapLayer : function(id) {
        var highlightedMapLayers = this.getAllHighlightedMapLayers();
        for (var i = 0; i < highlightedMapLayers.length; i++) {
            var mapLayer = highlightedMapLayers[i];
            if (!id || mapLayer.getId() == id) {
                highlightedMapLayers.splice(i);
                // Notify that dim has occured
                var event = this.getEventBuilder('AfterDimMapLayerEvent')(mapLayer);
                this.dispatch(event);
                return;
            }
        }
    },
    /**
     * @method _handleHighlightMapLayerRequest
     * Handles HighlightMapLayerRequest, sends out an AfterHighlightMapLayerEvent.
     * Highlighted wfslayer responds to map clicks by highlighting a clicked feature.
     *
     * @param {Oskari.mapframework.request.common.HighlightMapLayerRequest} request
     * @private
     */
    _handleHighlightMapLayerRequest : function(request) {
        var creator = this.getObjectCreator(request);

        var id = request.getMapLayerId();
        this.printDebug("[core-map-layer-methods] Trying to highlight map " + "layer with id '" + id + "'");
        if (this.isMapLayerAlreadyHighlighted(id)) {
            this.printWarn("[core-map-layer-methods] Attempt to highlight " + "already highlighted wms feature info " + "map layer '" + id + "'");
            return;
        }

        if (this._allowMultipleHighlightLayers == true) {
            this._removeHighLightedMapLayer(id);
        } else {
            this._removeHighLightedMapLayer();
        }

        var mapLayer = this.findMapLayerFromSelectedMapLayers(id);
        if (!mapLayer) {
            return;
        }
        this._mapLayersHighlighted.push(mapLayer);
        this.printDebug("[core-map-layer-methods] Adding " + mapLayer + " (" + mapLayer.getId() + ") to highlighted list.");

        // finally notify sandbox
        var event = this.getEventBuilder('AfterHighlightMapLayerEvent')(mapLayer);
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    },
    /**
     * @method _handleDimMapLayerRequest
     * Handles DimMapLayerRequest, sends out an AfterDimMapLayerEvent.
     * Highlighted wfslayer responds to map clicks by highlighting a clicked feature. 
     * This removes the layer from highlighted list
     *
     * @param {Oskari.mapframework.request.common.DimMapLayerRequest} request
     * @private
     */
    _handleDimMapLayerRequest : function(layerId) {

        if (this._allowMultipleHighlightLayers == true) {
            this._removeHighLightedMapLayer(layerId);
        } else {
            this._removeHighLightedMapLayer();
        }

        var mapLayer = this.findMapLayerFromAllAvailable(layerId);
        if (!mapLayer) {
            return;
        }

        var event = this.getEventBuilder('AfterDimMapLayerEvent')(mapLayer);
        this.dispatch(event);
    }
});

define("src/oskari/base/core/core-map-layer-methods", function(){});

/**
 * @class Oskari.mapframework.core.Core.mapMethods
 *
 * This category class adds map related methods to Oskari core as they were in
 * the class itself.
 */
Oskari.clazz.category('Oskari.mapframework.core.Core', 'map-methods', {

    /**
     * @method _handleHideMapMarkerRequest
     * Sends out a AfterHideMapMarkerEvent to hide the marker
     * TODO: this should be refactored so that markers plugin keeps track of markers and 
     * handles the HideMapMarkerRequest directly!
     * @deprecated
     * @param {Oskari.mapframework.request.common.HideMapMarkerRequest} request
     * @private 
     */
    _handleHideMapMarkerRequest : function(request) {
        /* Set marker state to domain */
        this._map.setMarkerVisible(false);

        var event = this.getEventBuilder(
        'AfterHideMapMarkerEvent')();
        this.copyObjectCreatorToFrom(event, request);
        this.dispatch(event);
    }
});

define("src/oskari/base/core/core-map-methods", function(){});

define('src/oskari/base/core/module',["src/oskari/oskari",
	"./core",
	"./core-enhancement-methods",
	"./core-key-listener-methods",
	"./core-map-layer-methods",
	"./core-map-methods"

], function(Oskari) {
	Oskari.bundleCls('core-base');
	Oskari.bundleCls('core-map');
});
/**
 * @class Oskari.mapframework.event.Event
 *
 * Superclass for all Oskari events.
 * Consider this as an abstract class and only use it by extending.
 * 
 * Events are used to tell the rest of the application that something happened.
 * They can be sent and listened to freely. If you want to tell another part of 
 * the application to do something, use an implementation of
 * Oskari.mapframework.request.Request instead.
 * 
 * Code snippet example to creating and sending out an event:
 * <pre>
 * // get a builder method for the requested event type.
 * var eventBuilder = sandbox.getEventBuilder('FeaturesAvailableEvent');
 * // create the event with the builder method
 * var event = eventBuilder(...event init params...);
 * // send the request to the application
 * sandbox.notifyAll(event);
 * </pre>
 * 
 * Code for listening to events in Oskari.mapframework.module.Module implementations:
 * <pre>
 *  // module init
 *  init: function(sandbox) {
 *       // register for listening events in module init
 *       for(var p in this.eventHandlers ) {
 *           sandbox.registerForEventByName(this, p);
 *       } 	
 *  },
 *  // declare eventhandlers for the module
 *  eventHandlers : {
 *       'FeaturesAvailableEvent' : function(event) {
 *           alert('I got a ' + event.getName());
 *   	}
 *  },
 *  // interface method to handle any events if they have handlers in this module
 *  onEvent : function(event) {
 *       var handler = this.eventHandlers[event.getName()];
 *       if(!handler) {
 *           return;
 *       }
 *       return handler.apply(this, [event]);
 *  }
 * </pre>
 */
Oskari.clazz.define('Oskari.mapframework.event.Event',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function() {
    throw "mapframework.event.Event should not be used";
    /** @property{String} _name event name */
    this._name = null;
    /** @property{String} _creator name for the functionality/bundle/module triggering the
     * event */
    this._creator = null;
}, {
    /**
     * @method getName
     * Interface method for all events, should return event name
     * @return {String} event name
     * @throws always override this
     */
    getName : function() {
        throw "Running default implementation of Event.getName(). implement your own!";
    },
    /**
     * @method setCreator
     * @param {String} creator name for the functionality/bundle/module triggering
     * the event
     */
    setCreator : function(creator) {
        this._creator = creator;
    },
    /**
     * @method getCreator
     * @return {String} name for the functionality/bundle/module triggering the
     * event
     */
    getCreator : function() {
        return this._creator;
    }
});

define("src/oskari/base/event/event", function(){});

/**
 * @class Oskari.mapframework.event.common.FeaturesAvailableEvent
 *
 * Used to add/replace features on a
 * Oskari.mapframework.domain.VectorLayer
 * See Oskari.mapframework.mapmodule.VectorLayerPlugin
 */
Oskari.clazz.define('Oskari.mapframework.event.common.FeaturesAvailableEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Oskari.mapframework.domain.VectorLayer}
 *            mapLayer highlighted/selected maplayer
 * @param {Mixed}
 *            features featuredata in #getMimeType format
 * @param {String}
 *            mimeType see
 * #Oskari.mapframework.mapmodule.VectorLayerPlugin.registerVectorFormats()
 * @param {String}
 *            projCode srs projection code
 * @param {String}
 *            op operation to perform
 */
function(mapLayer, features, mimeType, projCode, op) {
    this._creator = null;
    this._features = features;
    this._op = op;
    this._mapLayer = mapLayer;
    this._mimeType = mimeType;
    this._projCode = projCode;
}, {
    /** @static @property __name event name */
    __name : "FeaturesAvailableEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getFeatures
     * @return {Mixed} featuredata in #getMimeType format
     */
    getFeatures : function() {
        return this._features;
    },
    /**
     * @method getOp
     * @return {String} operation to perform
     */
    getOp : function() {
        return this._op;
    },
    /**
     * @method getMapLayer
     * @return {Oskari.mapframework.domain.VectorLayer}
     * selected maplayer
     */
    getMapLayer : function() {
        return this._mapLayer;
    },
    /**
     * @method getMimeType
     * @return {String} see
     * Oskari.mapframework.mapmodule.VectorLayerPlugin.registerVectorFormats()
     */
    getMimeType : function() {
        return this._mimeType;
    },
    /**
     * @method getProjCode
     * @return {String} srs projection code
     */
    getProjCode : function() {
        return this._projCode;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */;
define("src/oskari/base/event/common/features-available-event", function(){});

/**
 * @class Oskari.mapframework.event.common.AfterMapLayerAddEvent
 *
 * Notifies application bundles that a map layer has been added to selected
 * layers.
 * Triggers on Oskari.mapframework.request.common.AddMapLayerRequest
 * Opposite of Oskari.mapframework.event.common.AfterMapLayerRemoveEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterMapLayerAddEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *            mapLayer added map layer (matching one in MapLayerService)
 * @param {Boolean}
 *            keepLayersOrder should order of layers be reserved (optional,
 * defaults to false)
 * @param {Boolean}
 *            isBasemap (optional, defaults to false) 
 */
function(mapLayer, keepLayersOrder, isBasemap) {
    this._creator = null;
    this._mapLayer = mapLayer;
    this._keepLayersOrder = keepLayersOrder;

    if(isBasemap) {
        this._isBasemap = isBasemap;
    } else {
        this._isBasemap = false;
    }
}, {
    /** @static @property __name event name */
    __name : "AfterMapLayerAddEvent",

    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayer
     * @return
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     *            added map layer (matching one in MapLayerService)
     */
    getMapLayer : function() {
        return this._mapLayer;
    },
    /**
     * @method getKeepLayersOrder
     * @return {Boolean} boolean true if we should keep the layer order
     */
    getKeepLayersOrder : function() {
        return this._keepLayersOrder;
    },
    /**
     * @method isBasemap
     * @return {Boolean} boolean true if this is a basemap
     */
    isBasemap : function() {
        return this._isBasemap;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */;
define("src/oskari/base/event/common/after-map-layer-add-event", function(){});

/**
 * @class Oskari.mapframework.event.common.AfterMapLayerRemoveEvent
 *
 * Notifies application bundles that a map layer has been removed from selected
 * layers.
 * Triggers on Oskari.mapframework.request.common.RemoveMapLayerRequest
 * Opposite of Oskari.mapframework.event.common.AfterMapLayerAddEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterMapLayerRemoveEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *            mapLayer removed map layer (matching one in MapLayerService)
 */
function(mapLayer) {
    this._creator = null;
    this._mapLayer = mapLayer;
}, {
    /** @static @property __name event name */
    __name : "AfterMapLayerRemoveEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayer
     * @return
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     *            added map layer (matching one in MapLayerService)
     */
    getMapLayer : function() {
        return this._mapLayer;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */;
define("src/oskari/base/event/common/after-map-layer-remove-event", function(){});

/**
 * @class Oskari.mapframework.event.common.AfterMapMoveEvent
 *
 * Notifies application bundles that a map has moved.
 * See Oskari.mapframework.request.common.MapMoveRequest
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterMapMoveEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Number} centerX
 *            longitude
 * @param {Number} centerY
 *            latitude
 * @param {Number} zoom
 *            map zoomlevel (0-12)
 * @param {Boolean} marker
 *            this should be removed, always sent as false
 * @param {Number} scale
 *            map scale
 */
function(centerX, centerY, zoom, marker, scale) {
    this._creator = null;

    this._centerX = centerX;
    this._centerY = centerY;
    this._zoom = zoom;
    this._marker = marker;
    this._scale = scale;
}, {
    /** @static @property __name event name */
    __name : "AfterMapMoveEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getCreator
     * @return {String} identifier for the event sender
     */
    getCreator : function() {
        return this._creator;
    },
    /**
     * @method getCenterX
     * @return {Number} longitude
     */
    getCenterX : function() {
        return this._centerX;
    },
    /**
     * @method getCenterY
     * @return {Number} latitude
     */
    getCenterY : function() {
        return this._centerY;
    },
    /**
     * @method getZoom
     * @return {Number} zoomlevel (0-12)
     */
    getZoom : function() {
        return this._zoom;
    },
    /**
     * @method getMarker
     * @return {Boolean} this should be removed, always set to false
     * @deprecated use Oskari.mapframework.sandbox.Sandbox.getMap() ->
     * Oskari.mapframework.domain.Map.isMarkerVisible()
     */
    getMarker : function() {
        return this._marker;
    },
    /**
     * @method getScale
     * @return {Number} map scale
     */
    getScale : function() {
        return this._scale;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */;
define("src/oskari/base/event/common/after-map-move-event", function(){});

/**
 * @class Oskari.mapframework.event.common.MapMoveStartEvent
 *
 * Notifies application bundles that a map has began moving (is being dragged).
 * Oskari.mapframework.event.common.AfterMapMoveEvent is sent when dragging is
 * finished.
 */
Oskari.clazz.define('Oskari.mapframework.event.common.MapMoveStartEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Number} x
 *            longitude on drag start
 * @param {Number} y
 *            latitude on drag start
 */
function(x, y) {
    this._creator = null;
    this._x = x;

    this._y = y;

}, {

    /** @static @property __name event name */
    __name : "MapMoveStartEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getX
     * @return {Number} longitude on drag start
     */
    getX : function() {
        return this._x;
    },
    /**
     * @method getY
     * @return {Number} latitude on drag start
     */
    getY : function() {
        return this._y;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */;
define("src/oskari/base/event/common/after-map-move-start-event", function(){});

/**
 * @class Oskari.mapframework.event.common.AfterShowMapLayerInfoEvent
 * 
 * Triggers on Oskari.mapframework.request.common.ShowMapLayerInfoRequest.
 * Populates the layer reference matching the id in request.
 * FIXME: propably unnecessary step, this could be completed with using only the
 * request
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterShowMapLayerInfoEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *            mapLayer highlighted/selected maplayer
 */
function(mapLayer) {
    this._creator = null;
    this._mapLayer = mapLayer;
}, {
    /** @static @property __name event name */
    __name : "AfterShowMapLayerInfoEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayer
     * @return
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     * selected maplayer
     */
    getMapLayer : function() {
        return this._mapLayer;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */;
define("src/oskari/base/event/common/after-show-map-layer-info-event", function(){});

/**
 * @class Oskari.mapframework.event.common.AfterHideMapMarkerEvent
 *
 * Triggers on Oskari.mapframework.request.common.HideMapMarkerRequest
 * FIXME: propably an unnecessary step that could be handled with the request
 * directly
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterHideMapMarkerEvent',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
}, {
    /** @static @property __name event name */
    __name : "AfterHideMapMarkerEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
define("src/oskari/base/event/common/after-hide-map-marker-event", function(){});

/**
 * @class Oskari.mapframework.event.common.MouseHoverEvent
 *
 * Notification about mouse hovering over the map
 */
Oskari.clazz.define('Oskari.mapframework.event.common.MouseHoverEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Number}
 *            lon longitude on mouse location
 * @param {Number}
 *            lat latitude on mouse location
 */
function(lon, lat,isPaused) {
    this._creator = null;

    this._lon = lon;

    this._lat = lat;
    
    this._paused = isPaused;

}, {
    /** @static @property __name event name */
    __name : "MouseHoverEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getLon
     * @return {Number} longitude on mouse location
     */
    getLon : function() {
        return this._lon;
    },
    /**
     * @method getLon
     * @return {Number} latitude on mouse location
     */
    getLat : function() {
        return this._lat;
    },
    /**
     * @method set
     * 
     * Update mouse location on event
     * 
     * @param {Number}
     *            lon longitude on mouse location
     * @param {Number}
     *            lat latitude on mouse location
     */
    set : function(lon, lat,isPaused,pageX,pageY,isPaused) {

        this._lon = lon;
        this._lat = lat;
        this._paused = isPaused;
        this._pageX = pageX;
        this._pageY = pageY;
        this._paused = isPaused;
    },
    
    isPaused : function() {
    	return this._paused;
    },
    
    getPageX: function() {
    	return this._pageX;
    },
    getPageY: function() {
    	return this._pageY;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */;
define("src/oskari/base/event/common/mouse-hover-event", function(){});

/**
 * @class Oskari.mapframework.event.common.MapLayerEvent
 *
 * Notifies application bundles that a map layers data(e.g. name) has changed or
 * that a layer has been added to/removed from Oskari.mapframework.service.MapLayerService
 */
Oskari.clazz.define('Oskari.mapframework.event.common.MapLayerEvent',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            layerId id for the changed layer (data available in
 * Oskari.mapframework.service.MapLayerService)
 * @param {String}
 *            operation one of #operations
 */
function(layerId, operation) {
    this._creator = null;
    this._layerId = layerId;
    if(!this.operations[operation]) {
        throw "Unknown operation '" + operation + "'";
    }
    this._operation = operation;
}, {
    /** @static @property __name event name */
    __name : "MapLayerEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getLayerId
     * @return {String}  id for the changed layer (data available in
     * Oskari.mapframework.service.MapLayerService)
     */
    getLayerId : function() {
        return this._layerId;
    },
    /**
     * @method getOperation
     * @return {String} one of #operations
     */
    getOperation : function() {
        return this._operation;
    },
    /**
     * @property {Object} operations identifiers to tell what has happened
     * @static
     */
    operations : {
        /** @static @property {String} operations.add layer has been added */
        'add' : 'add',
        /** @static @property {String} operations.remove layer has been removed
         */
        'remove' : 'remove',
        /** @static @property {String} operations.sticky layer switch off state is changed
         * (e.g. name) */
        'sticky' : 'sticky',
         /** @static @property {String} operations.update layer has been updated
         * (e.g. name) */
        'update' : 'update'
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */;
define("src/oskari/base/event/common/MapLayerEvent", function(){});

/**
 * @class Oskari.mapframework.event.common.AfterRearrangeSelectedMapLayerEvent
 * 
 * Used to notify that maplayer order has been changed in Oskari core.
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterRearrangeSelectedMapLayerEvent', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *            movedMapLayer moved map layer (matching one in MapLayerService)
 * @param {Number} fromPosition
 *            previous position
 * @param {Number} toPosition
 *            new position
 */
function(movedMapLayer, fromPosition, toPosition) {
    this._creator = null;
    this._movedMapLayer = movedMapLayer;
    this._fromPosition = fromPosition;
    this._toPosition = toPosition;
}, {
    /** @static @property __name event name */
    __name : "AfterRearrangeSelectedMapLayerEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMovedMapLayer
     * @return
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     *            moved map layer (matching one in MapLayerService)
     */
    getMovedMapLayer : function() {
        return this._movedMapLayer;
    },
    /**
     * @method getFromPosition
     * @return  {Number} previous position
     */
    getFromPosition : function() {
        return this._fromPosition;
    },
    /**
     * @method getToPosition
     * @return  {Number} new position
     */
    getToPosition : function() {
        return this._toPosition;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */;
define("src/oskari/base/event/common/after-rearrange-selected-map-layer-event", function(){});

/**
 * @class Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent
 *
 * Triggers when a
 * Oskari.mapframework.request.common.ChangeMapLayerOpacityRequest is received.
 * The event includes the maplayer with the modified opacity.
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterChangeMapLayerOpacityEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *            mapLayer 
 */
function(mapLayer) {
    this._mapLayer = mapLayer;
}, {
    /** @static @property __name event name */
    __name : "AfterChangeMapLayerOpacityEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayer
     * @return
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     * changed maplayer
     */
    getMapLayer : function() {
        return this._mapLayer;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});
define("src/oskari/base/event/common/after-change-map-layer-opacity-event", function(){});

/**
 * @class Oskari.mapframework.event.common.AfterChangeMapLayerStyleEvent
 *
 * Triggers when a
 * Oskari.mapframework.request.common.ChangeMapLayerStyleRequest is received.
 * The event includes the maplayer with the modified style.
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterChangeMapLayerStyleEvent', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *            mapLayer 
 */
function(mapLayer) {
    this._mapLayer = mapLayer;
}, {
    /** @static @property __name event name */
    __name : "AfterChangeMapLayerStyleEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },

    /**
     * @method getMapLayer
     * @return
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     * changed maplayer
     */
    getMapLayer : function() {
        return this._mapLayer;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

define("src/oskari/base/event/common/after-change-map-layer-style-event", function(){});

/**
 * @class Oskari.mapframework.event.common.AfterHighlightMapLayerEvent
 *
 * Triggers when a given map layer has been requested to be
 * "highlighted" on map. This means f.ex. a WMS layer GetFeatureInfo clicks needs
 * to be enabled, WFS layers featuretype grid should be shown and selection clicks
 * on map enabled.
 * Opposite of Oskari.mapframework.event.common.AfterDimMapLayerEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterHighlightMapLayerEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *            mapLayer highlighted/selected maplayer
 */
function(mapLayer) {
    this._creator = null;
    this._mapLayer = mapLayer;
}, {
    /** @static @property __name event name */
    __name : "AfterHighlightMapLayerEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayer
     * @return
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     * highlighted/selected maplayer
     */
    getMapLayer : function() {
        return this._mapLayer;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */;
define("src/oskari/base/event/common/after-highlight-map-layer-event", function(){});

/**
 * @class Oskari.mapframework.event.common.AfterDimMapLayerEvent
 *
 * Triggers when a given "highlighted" map layer has been requested to be
 * "dimmed" on map. This means f.ex. a WMS layer GetFeatureInfo clicks needs to
 * be disabled, WFS layers featuretype grid should be hidden and selection clicks
 * on map disabled.
 * Opposite of Oskari.mapframework.event.common.AfterHighlightMapLayerEvent
 */
Oskari.clazz.define('Oskari.mapframework.event.common.AfterDimMapLayerEvent',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param
 * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
 *            mapLayer dimmed maplayer
 */
function(mapLayer) {
    this._creator = null;
    this._mapLayer = mapLayer;
}, {
    /** @static @property __name event name */
    __name : "AfterDimMapLayerEvent",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayer
     * @return
     * {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer}
     * dimmed maplayer
     */
    getMapLayer : function() {
        return this._mapLayer;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.event.Event']
});

/* Inheritance */;
define("src/oskari/base/event/common/after-dim-map-layer-event", function(){});

define('src/oskari/base/event/module',[
	"src/oskari/oskari",
	"./event",
	"./common/features-available-event",
	"./common/after-map-layer-add-event",
	"./common/after-map-layer-remove-event",
	"./common/after-map-move-event",
	"./common/after-map-move-start-event",
	"./common/after-show-map-layer-info-event",
	"./common/after-hide-map-marker-event",
	"./common/mouse-hover-event",
	"./common/MapLayerEvent",
	"./common/after-rearrange-selected-map-layer-event",
	"./common/after-change-map-layer-opacity-event",
	"./common/after-change-map-layer-style-event",
	"./common/after-highlight-map-layer-event",
	"./common/after-dim-map-layer-event"
],
function(Oskari) {
	Oskari.bundleCls('event-base');
	Oskari.bundleCls('event-map');
	Oskari.bundleCls('event-map-layer');
});
/**
 * @class Oskari.mapframework.domain.AbstractLayer
 *
 * Superclass for layer objects copy pasted from wmslayer. Need to check
 * if something should be moved back to wmslayer. Nothing else currently uses this.
 */
Oskari.clazz.define('Oskari.mapframework.domain.AbstractLayer',

/**
 * @method create called automatically on construction
 * @static
 */

function(params, options) {
	/* Internal id for this map layer */
	this._id = null;

	/* Name of this layer */
	this._name = null;

	/* Description for layer */
	this._description = null;

	/* either NORMAL_LAYER, GROUP_LAYER or BASE_LAYER */
	this._type = null;

	/* either WMS, WMTS, WFS or VECTOR */
	this._layerType = "";

	/* optional params */
	this._params = params || {};

	/* optional options */
	this._options = options || {};

	/* modules can "tag" the layers with this for easier reference */
	this._metaType = null;

	/* Max scale for layer */
	this._maxScale = null;

	/* Min scale for layer */
	this._minScale = null;

	/* is layer visible */
	this._visible = null;

	/* opacity from 0 to 100 */
	this._opacity = null;

	/* visible layer switch off enable/disable */
	this._isSticky = null;

	this._inspireName = null;
	this._organizationName = null;
	this._dataUrl = null;
	this._orderNumber = null;

	/*
	 * Array of sublayers. Notice that only type BASE_LAYER can
	 * have sublayers.
	 */
	this._subLayers = [];

	/* Array of styles that this layer supports */
	this._styles = [];

	/* Currently selected style */
	this._currentStyle = null;

	/* Legend image location */
	this._legendImage = null;

	/* is it possible to ask for feature info */
	this._featureInfoEnabled = null;

	/* is this layer queryable (GetFeatureInfo) boolean */
	this._queryable = null;

	this._queryFormat = null;

	// f.ex. permissions.publish
	this._permissions = {};

	// if given, tells where the layer has content
	// array of Openlayers.Geometry[] objects if already processed from _geometryWKT
	this._geometry = [];
	// wellknown text for polygon geometry
	this._geometryWKT = null;

    // Tools array for layer specific functions 
	this._tools = [];
	
	/* link to metadata service */
	this._metadataIdentifier = null;

	this._backendStatus = null;
}, {
	/**
	 * @method setId
	 * @param {String} id
	 *          unique identifier for map layer used to reference the layer internally
	 * (e.g. MapLayerService)
	 */
	setId : function(id) {
		this._id = id;
	},
	/**
	 * @method getId
	 * @return {String}
	 *          unique identifier for map layer used to reference the layer internally
	 * (e.g. MapLayerService)
	 */
	getId : function() {
		return this._id;
	},
	/**
	 * @method setQueryFormat
	 * @param {String} queryFormat
	 *          f.ex. 'text/html'
	 */
	setQueryFormat : function(queryFormat) {
		this._queryFormat = queryFormat;
	},
	/**
	 * @method getQueryFormat
	 * f.ex. 'text/html'
	 * @return {String}
	 */
	getQueryFormat : function() {
		return this._queryFormat;
	},
	/**
	 * @method setName
	 * @param {String} name
	 *          name for the maplayer that is shown in UI
	 */
	setName : function(name) {
		this._name = name;
	},
	/**
	 * @method getName
	 * @return {String} maplayer UI name
	 */
	getName : function() {
		return this._name;
	},
	/**
	 * @method setType
	 * @param {String} type
	 *          layer type (e.g. NORMAL, BASE, GROUP)
	 *
	 * Not as type WMS or Vector but base or normal layer.
	 * See #setAsBaseLayer(), #setAsGroupLayer() and #setAsNormalLayer()
	 */
	setType : function(type) {
		this._type = type;
	},
	/**
	 * @method getType
	 * @return {String} maplayer type (BASE/NORMAL)
	 */
	getType : function() {
		return this._type;
	},
	/**
	 * @method setDataUrl
	 * @param {String} param
	 *          URL string used to show more info about the layer
	 */
	setDataUrl : function(param) {
		this._dataUrl = param;
	},
	/**
	 * @method getDataUrl
	 * @return {String} URL string used to show more info about the layer
	 */
	getDataUrl : function() {
		return this._dataUrl;
	},
	/**
	 * @method setOrganizationName
	 * @param {String} param
	 *          organization name under which the layer is listed in UI
	 */
	setOrganizationName : function(param) {
		this._organizationName = param;
	},
	/**
	 * @method getOrganizationName
	 * @return {String} organization name under which the layer is listed in UI
	 */
	getOrganizationName : function() {
		return this._organizationName;
	},
	/**
	 * @method setInspireName
	 * @param {String} param
	 *          inspire theme name under which the layer is listed in UI
	 */
	setInspireName : function(param) {
		this._inspireName = param;
	},
	/**
	 * @method getInspireName
	 * @return {String} inspire theme name under which the layer is listed in UI
	 */
	getInspireName : function() {
		return this._inspireName;
	},
	/**
	 * @method setFeatureInfoEnabled
	 * @return {Boolean} featureInfoEnabled true to enable feature info functionality
	 */
	setFeatureInfoEnabled : function(featureInfoEnabled) {
		this._featureInfoEnabled = featureInfoEnabled;
	},
	/**
	 * @method isFeatureInfoEnabled
	 * @return {Boolean} true if feature info functionality should be enabled
	 */
	isFeatureInfoEnabled : function() {
		if (this._featureInfoEnabled === true) {
			return true;
		}
		return false;
	},
	/**
	 * @method setDescription
	 * @param {String} description
	 *          map layer description text
	 */
	setDescription : function(description) {
		this._description = description;
	},
	/**
	 * @method getDescription
	 * @return {String} map layer description text
	 */
	getDescription : function() {
		return this._description;
	},
	/**
	 * @method addSubLayer
	 * @param {Oskari.mapframework.domain.WmsLayer} map layer
	 *          actual sub map layer that is used for a given scale range (only for
	 * base & group layers)
	 *
	 * If layer has sublayers, it is basically a "metalayer" for maplayer ui
	 * purposes and actual map images to show are done with sublayers
	 */
	addSubLayer : function(layer) {
		this._subLayers.push(layer);
	},
	/**
	 * @method getSubLayers
	 * @return {Oskari.mapframework.domain.WmsLayer[]} array of sub map layers
	 *
	 * If layer has sublayers, it is basically a "metalayer" for maplayer ui
	 * purposes and actual map images to show are done with sublayers
	 */
	getSubLayers : function() {
		return this._subLayers;
	},
	/**
	 * @method setMaxScale
	 * @param {Number} maxScale
	 *          largest scale when the layer is shown (otherwise not shown in map and
	 * "greyed out"/disabled in ui)
	 */
	setMaxScale : function(maxScale) {
		this._maxScale = maxScale;
	},
	/**
	 * @method getMaxScale
	 * @return {Number}
	 *          largest scale when the layer is shown (otherwise not shown in map and
	 * "greyed out"/disabled in ui)
	 */
	getMaxScale : function() {
		return this._maxScale;
	},
	/**
	 * @method setMinScale
	 * @param {Number} minScale
	 *          smallest scale when the layer is shown (otherwise not shown in map and
	 * "greyed out"/disabled in ui)
	 */
	setMinScale : function(minScale) {
		this._minScale = minScale;
	},
	/**
	 * @method getMinScale
	 * @return {Number}
	 *          smallest scale when the layer is shown (otherwise not shown in map and
	 * "greyed out"/disabled in ui)
	 */
	getMinScale : function() {
		return this._minScale;
	},
	/**
	 * @method setOrderNumber
	 * @param {Number} orderNumber
	 */
	setOrderNumber : function(orderNumber) {
		this._orderNumber = orderNumber;
	},
	/**
	 * @method getOrderNumber
	 * @return {Number} orderNumber
	 */
	getOrderNumber : function() {
		return this._orderNumber;
	},
	/**
	 * @method isVisible
	 * @return {Boolean} true if this is should be shown
	 */
	isVisible : function() {
		return this._visible === true;
	},
	/**
	 * @method setVisible
	 * @param {Boolean} visible true if this is should be shown
	 */
	setVisible : function(visible) {
		this._visible = visible;
	},
	/**
	 * @method setOpacity
	 * @param {Number} opacity
	 *          0-100 in percents
	 */
	setOpacity : function(opacity) {
		this._opacity = opacity;
	},
	/**
	 * @method getOpacity
	 * @return {Number} opacity
	 *          0-100 in percents
	 */
	getOpacity : function() {
		return this._opacity;
	},
	/**
	 * @method setGeometryWKT
	 * Set geometry as wellknown text
	 * @param {String} value
	 *          WKT geometry
	 */
	setGeometryWKT : function(value) {
		this._geometryWKT = value;
	},
	/**
	 * @method getGeometryWKT
	 * Get geometry as wellknown text
	 * @return {String} WKT geometry
	 */
	getGeometryWKT : function() {
		return this._geometryWKT;
	},
	/**
	 * @method setGeometry
	 * @param {OpenLayers.Geometry.Geometry[]} value
	 *          array of WKT geometries or actual OpenLayer geometries
	 */
	setGeometry : function(value) {
		this._geometry = value;
	},
	/**
	 * @method getGeometry
	 * @return {OpenLayers.Geometry.Geometry[]}
	 *          array of WKT geometries or actual OpenLayer geometries
	 */
	getGeometry : function() {
		return this._geometry;
	},
	/**
	 * @method addPermission
	 * @param {String} action
	 *          action key that we want to add permission setting for
	 * @param {String} permission
	 *          actual permission setting for action
	 */
	addPermission : function(action, permission) {
		this._permissions[action] = permission;
	},
	/**
	 * @method removePermission
	 * @param {String} action
	 *          action key from which permission setting should be removed
	 */
	removePermission : function(action) {
		this._permissions[action] = null;
		delete this._permissions[action];
	},
	/**
	 * @method getPermission
	 * @param {String} action
	 *          action key for which permission we want
	 * @return {String} permission setting for given action
	 */
	getPermission : function(action) {
		return this._permissions[action];
	},
	/**
	 * @method getMetadataIdentifier
	 * Gets the identifier (uuid style) for getting layers metadata
	 * @return {String}
	 */
	getMetadataIdentifier : function() {
		return this._metadataIdentifier;
	},
	/**
	 * @method setMetadataIdentifier
	 * Sets the identifier (uuid style) for getting layers metadata
	 * @param {String} metadataid
	 */
	setMetadataIdentifier : function(metadataid) {
		this._metadataIdentifier = metadataid;
	},
	/**
	 * @method getBackendStatus
	 * Status text for layer operatibility (f.ex. 'DOWN')
	 * @return {String}
	 */
	getBackendStatus : function() {
		return this._backendStatus;
	},
	/**
	 * @method setBackendStatus
	 * Status text for layer operatibility (f.ex. 'DOWN')
	 * @param {String} backendStatus
	 */
	setBackendStatus : function(backendStatus) {
		this._backendStatus = backendStatus;
	},
	/**
	 * @method setMetaType
	 * @param {String} type used to group layers by f.ex. functionality.
	 * Layers can be fetched based on metatype f.ex. 'myplaces'
	 */
	setMetaType : function(type) {
		this._metaType = type;
	},
	/**
	 * @method getMetaType
	 * @return {String} type used to group layers by f.ex. functionality.
	 * Layers can be fetched based on metatype f.ex. 'myplaces'
	 */
	getMetaType : function() {
		return this._metaType;
	},
	/**
	 * @method addStyle
	 * @param {Oskari.mapframework.domain.Style} style
	 * adds style to layer
	 */
	addStyle : function(style) {
		this._styles.push(style);
	},
	/**
	 * @method getStyles
	 * @return {Oskari.mapframework.domain.Style[]}
	 * Gets layer styles
	 */
	getStyles : function() {
		return this._styles;
	},
	/**
	 * @method selectStyle
	 * @param {String} styleName
	 * Selects a #Oskari.mapframework.domain.Style with given name as #getCurrentStyle.
	 * If style is not found, assigns an empty #Oskari.mapframework.domain.Style to #getCurrentStyle
	 */
	selectStyle : function(styleName) {
		var style = null;
		// Layer have styles
		if (this._styles.length > 0) {
			// There is default style defined
			if (styleName !== "") {
				for (var i = 0; i < this._styles.length; i++) {
					style = this._styles[i];
					if (style.getName() == styleName) {
						this._currentStyle = style;
						if (style.getLegend() != "") {
							this._legendImage = style.getLegend();
						}
						return;
					}
				}
			}
			// There is not default style defined
			else {
				//var style =
				// Oskari.clazz.create('Oskari.mapframework.domain.Style');
				// Layer have more than one style, set first
				// founded style to default
				// Because of layer style error this if clause
				// must compare at there is more than one style.
				if (this._styles.length > 1) {
					this._currentStyle = this._styles[0];
				}
				// Layer have not styles, add empty style to
				// default
				else {
					style = Oskari.clazz.create('Oskari.mapframework.domain.Style');
					style.setName("");
					style.setTitle("");
					style.setLegend("");
					this._currentStyle = style;
				}

				return;
			}
		}
		// Layer have not styles
		else {
			style = Oskari.clazz.create('Oskari.mapframework.domain.Style');
			style.setName("");
			style.setTitle("");
			style.setLegend("");
			this._currentStyle = style;
			return;
		}
	},
	/**
	 * @method getCurrentStyle
	 * @return {Oskari.mapframework.domain.Style} current style
	 */
	getCurrentStyle : function() {
		return this._currentStyle;
	},
	/**
	 * @method getTools
	 * @return {Oskari.mapframework.domain.Tool[]}
	 * Get layer tools
	 */
	getTools : function() {
		return this._tools;
	},
	/**
	 * @method setTools
	 * @params {Oskari.mapframework.domain.Tool[]}
	 * Set layer tools
	 */
	setTools : function(tools) {
		this._tools = tools;
	},
	/**
	 * @method addTool
	 * @params {Oskari.mapframework.domain.Tool}
	 * adds layer tool to tools
	 */
	addTool : function(tool) {
		this._tools.push(tool);
	},
	
	/**
	 * @method getTool
	 * @return {Oskari.mapframework.domain.Tool}
	 * adds layer tool to tools
	 */
	getTool : function(toolName) {
		
		var tool = null;
		// Layer have tools
		if (this._tools.length > 0 ) {
			// 
			if (toolName !== "") {
				for (var i = 0; i < this._tools.length; i++) {
					tool = this._tools[i];
					if (tool.getName() == toolName) {
						return tool;
					}
				}
			}
		}
		return tool;
	},  
	/**
	 * @method setLegendImage
	 * @return {String} legendImage URL to a legend image
	 */
	setLegendImage : function(legendImage) {
		this._legendImage = legendImage;
	},
	/**
	 * @method getLegendImage
	 * @return {String} URL to a legend image
	 */
	getLegendImage : function() {
		return this._legendImage;
	},
	/**
	 * @method getLegendImage
	 * @return {Boolean} true if layer has a legendimage or its styles have legend images
	 */
	hasLegendImage : function() {

		if (this._legendImage) {
			return true;
		} else {
			for (var i = 0; i < this._styles.length; ++i) {
				if (this._styles[i].getLegend()) {
					return true;
				}
			}
		}
		return false;
	},
	/**
	 * @method setSticky
	 * True if layer switch off is disable
	 * @param {Boolean} isSticky
	 */
	setSticky : function(isSticky) {
		this._isSticky = isSticky;
	},
	/**
	 * @method isSticky
	 * True if layer switch off is disable
	 */
	isSticky : function() {
		return this._isSticky;
	},
	/**
	 * @method setQueryable
	 * True if we should call GFI on the layer
	 * @param {Boolean} queryable
	 */
	setQueryable : function(queryable) {
		this._queryable = queryable;
	},
	/**
	 * @method getQueryable
	 * True if we should call GFI on the layer
	 * @param {Boolean} queryable
	 */
	getQueryable : function() {
		return this._queryable;
	},
	/**
	 * @method setAsBaseLayer
	 * sets layer type to BASE_LAYER
	 */
	setAsBaseLayer : function() {
		this._type = "BASE_LAYER";
	},
	/**
	 * @method setAsNormalLayer
	 * sets layer type to NORMAL_LAYER
	 */
	setAsNormalLayer : function() {
		this._type = "NORMAL_LAYER";
	},
	/**
	 * @method setAsGroupLayer
	 * Sets layer type to GROUP_LAYER
	 */
	setAsGroupLayer : function() {
		this._type = "GROUP_LAYER";
	},
	/**
	 * @method isGroupLayer
	 * @return {Boolean} true if this is a group layer (=has sublayers)
	 */
	isGroupLayer : function() {
		return this._type === "GROUP_LAYER";
	},
	/**
	 * @method isBaseLayer
	 * @return {Boolean} true if this is a base layer (=has sublayers)
	 */
	isBaseLayer : function() {
		return this._type === "BASE_LAYER";
	},
	/**
	 * @method isInScale
	 * @param {Number} scale scale to compare to
	 * @return {Boolean} true if given scale is between this layers min/max scales. Always return true for base-layers.
	 */
	isInScale : function(scale) {
		var _return = this.isBaseLayer();
		if (!scale) {
			var sandbox = Oskari.$().sandbox;
			scale = sandbox.getMap().getScale();
		}

		// Check layer scales only normal layers
		if (!this.isBaseLayer()) {
			if ((scale > this.getMaxScale() || !this.getMaxScale()) && (scale < this.getMinScale()) || !this.getMinScale()) {
				_return = true;
			}
		}
		return _return;
	},
	/**
	 * @method getLayerType
	 * @return {String} layer type in lower case
	 */
	getLayerType : function() {
		return this._layerType.toLowerCase();
	},
	/**
	 * @method isLayerOfType
	 * @param {String} flavour layer type to check against. A bit misleading since setType is base/group/normal, this is used to check if the layer is a WMS layer.
	 * @return {Boolean} true if flavour is the specified layer type
	 */
	isLayerOfType : function(flavour) {
		return flavour && flavour.toLowerCase() === this.getLayerType();
	},
	/**
	 * @method getIconClassname
	 * @return {String} layer icon classname used in the CSS style.
	 */
	getIconClassname : function() {
		if (this.isBaseLayer()) {
			return 'layer-base';
		} else if (this.isGroupLayer()) {
			return 'layer-group';
		} else {
			return 'layer-' + this.getLayerType();
		}
	},
	/**
	 * @method getParams
	 * @return {Object} optional layer parameters for OpenLayers, empty object if no parameters were passed in construction
	 */
	getParams : function() {
		return this._params;
	},
	/**
	 * @method getOptions
	 * @return {Object} optional layer options for OpenLayers, empty object if no options were passed in construction
	 */
	getOptions : function() {
		return this._options;
	}
}); 
define("src/oskari/base/domain/AbstractLayer", function(){});

/**
 * @class Oskari.mapframework.domain.WmsLayer
 *
 * MapLayer of type WMS
 */
Oskari.clazz.define('Oskari.mapframework.domain.WmsLayer', 

/**
 * @method create called automatically on construction
 * @static
 */
function() {

    /* Name of wms layer */
    this._wmsLayerName = null;

    /* Array of wms urls for this layer */
    this._wmsUrls = [];

    /* Layer Type */
    this._layerType = "WMS";
}, {
    /**
     * @method addWmsUrl
     * @param {String} wmsUrl
     * Apppends the url to layer array of wms image urls
     */
    addWmsUrl : function(wmsUrl) {
        this._wmsUrls.push(wmsUrl);
    },
    /**
     * @method getWmsUrls
     * @return {String[]} 
     * Gets array of layer wms image urls
     */
    getWmsUrls : function() {
        return this._wmsUrls;
    },
    /**
     * @method setWmsName
     * @param {String} wmsName used to identify service f.ex. in GetFeatureInfo queries.
     */
    setWmsName : function(wmsName) {
        this._wmsName = wmsName;
    },
    /**
     * @method getWmsName
     * @return {String} wmsName used to identify service f.ex. in GetFeatureInfo queries.
     */
    getWmsName : function() {
        return this._wmsName;
    }
}, {
    "extend" : ["Oskari.mapframework.domain.AbstractLayer"]
});

define("src/oskari/base/domain/wmslayer", function(){});

/**
 * @class Oskari.mapframework.domain.VectorLayer
 *
 * MapLayer of type Vector
 */
Oskari.clazz.define('Oskari.mapframework.domain.VectorLayer',

/**
 * @method create called automatically on construction
 * @static
 */

function() { /* style definition for this layer */
    this._sldspec = null;

    /* Layer Type */
    this._layerType = "VECTOR";
}, {

    /**
     * @method setStyledLayerDescriptor
     * @param {Object} sld
     *
     * TODO: check type for param
     */
    setStyledLayerDescriptor: function(sld) {
        this._sldspec = sld;
    },
    /**
     * @method getStyledLayerDescriptor
     * @return {Object} sld
     *
     * TODO: check type for return value
     */
    getStyledLayerDescriptor: function() {
        return this._sldspec;
    }
}, {
    "extend": ["Oskari.mapframework.domain.AbstractLayer"]
});
define("src/oskari/base/domain/vectorlayer", function(){});

/**
 * @class Oskari.mapframework.domain.Map
 *
 * Represents the values of the map implementation (openlayers)
 * Map module updates this domain object before sending out MapMoveEvents using
 * the set methods.
 * Set methods dont control the map in anyway so this is not the
 * way to control the map. This is only to get map values without openlayers
 * dependency.
 */
Oskari.clazz.define('Oskari.mapframework.domain.Map',

/** 
 * @method create called automatically on construction
 * @static
 */
function() {

    // @property {Number} _centerX map longitude (float)
    this._centerX = null;

    // @property {Number} _centerY map latitude (float)
    this._centerY = null;

    // @property {Number} _zoom map zoom level (0-12)
    this._zoom = null;

    // @property {Number} _scale map scale (float)
    this._scale = null;

    // @property {OpenLayers.Bounds} _bbox map bounding box
    this._bbox = null;

    // @property {Boolean} true if marker is being shown
    this._markerVisible = null;

    // @property {Number} width map window width
    this.width = null;

    // @property {Number} height  map window height
    this.height = null;

    // @property {Number} resolution current map resolution (float)
    this.resolution = null;
    
    // @property {OpenLayers.Bounds} current map extent { left: NaN, top: NaN, right: NaN, bottom: NaN }
    this.extent = null;
    
    // @property {OpenLayers.Bounds} maximumExtent configured for the map { left: NaN, top: NaN, right: NaN, bottom: NaN }
    this.maxExtent = null;

    // @property {Boolean} _isMoving true when map is being dragged 
    this._isMoving = false;

    // @property {String} _projectionCode SRS projection code, defaults to 'EPSG:3067'
    this._projectionCode = "EPSG:3067";
}, {
    /**
     * @method moveTo
     * Sets new center and zoomlevel for map domain (NOTE: DOESN'T ACTUALLY MOVE
     * THE MAP)
     *
     * @param {Number}
     *            x
     * @param {Number}
     *            y
     * @param {Number}
     *            zoom map zoomlevel
     */
    moveTo : function(x, y, zoom) {
        this._centerX = Math.floor(x);
        this._centerY = Math.floor(y);
        this._zoom = zoom;
    },
    /**
     * @method setMoving
     * Sets true if map is moving currently
     *
     * @param {Boolean}
     *            movingBln true if map is being moved currently
     */
    setMoving : function(movingBln) {
        this._isMoving = movingBln;
    },
    /**
     * @method isMoving
     * True if map is moving currently (is being dragged)
     *
     * @return {Boolean}
     *            true if map is being moved currently
     */
    isMoving : function() {
        return this._isMoving;
    },
    /**
     * @method getX
     * Map center coordinate - longitude
     *
     * @return {Number}
     *            map center x
     */
    getX : function() {
        return this._centerX;
    },
    /**
     * @method getY
     * Map center coordinate - latitude
     *
     * @return {Number}
     *            map center y
     */
    getY : function() {
        return this._centerY;
    },
    /**
     * @method getZoom
     * Map center zoom level (0-12)
     *
     * @return {Number}
     *            map zoom level
     */
    getZoom : function() {
        return this._zoom;
    },
    /**
     * @method setScale
     * Scale in map implementation (openlayers)
     *
     * @param {Number} scale
     *            map scale(float)
     */
    setScale : function(scale) {
        this._scale = scale;
    },
    /**
     * @method getScale
     * Scale in map implementation (openlayers)
     *
     * @return {Number}
     *            map scale (float)
     */
    getScale : function() {
        return this._scale;
    },
    /**
     * @method setBbox
     * Bounding box in map implementation (openlayers)
     *
     * @param {OpenLayers.Bounds} bbox
     *            bounding box
     */
    setBbox : function(bbox) {
        this._bbox = bbox;
    },
    /**
     * @method getBbox
     * Bounding box in map implementation (openlayers)
     *
     * @return {OpenLayers.Bounds}
     *            bounding box
     */
    getBbox : function() {
        return this._bbox;
    },
    /**
     * @method setMarkerVisible
     * true if marker is shown on map
     *
     * @param {Boolean} markerVisible
     *            true if marker is shown on map
     */
    setMarkerVisible : function(markerVisible) {
        this._markerVisible = markerVisible;
    },
    /**
     * @method isMarkerVisible
     * true if marker is shown on map
     *
     * @return {Boolean}
     *            true if marker is shown on map
     */
    isMarkerVisible : function() {
        if(this._markerVisible == true) {
            return true;
        }
        return false;
    },
    /**
     * @method setWidth
     * width of map window
     *
     * @param {Number} width
     *            width
     */
    setWidth : function(width) {
        this.width = width;
    },
    /**
     * @method getWidth
     * width of map window
     *
     * @return {Number}
     *            width
     */
    getWidth : function() {
        return this.width;
    },
    /**
     * @method setHeight
     * height of map window
     *
     * @param {Number} height
     *            height
     */
    setHeight : function(height) {
        this.height = height;
    },
    /**
     * @method getHeight
     * height of map window
     *
     * @return {Number}
     *            height
     */
    getHeight : function() {
        return this.height;
    },
    /**
     * @method setResolution
     * resolution in map implementation (openlayers)
     *
     * @param {Number} r
     *            resolution (float)
     */
    setResolution : function(r) {
        this.resolution = r;
    },
    /**
     * @method getResolution
     * resolution in map implementation (openlayers)
     *
     * @return {Number}
     *            resolution (float)
     */
    getResolution : function() {
        return this.resolution;
    },
    /**
     * @method setExtent
     * Extent in map implementation (openlayers)
     *
     * @param {OpenLayers.Bounds} e
     *            extent
     */
    setExtent : function(e) {
        this.extent = e;
        /* e is this kind of oject  { left: l, top: t, right: r, bottom: b }*/;
    },
    /**
     * @method getExtent
     * Extent in map implementation (openlayers)
     *
     * @return {OpenLayers.Bounds}
     *            extent
     */
    getExtent : function() {
        return this.extent;
    },
    /**
     * @method setMaxExtent
     * Max Extent in map implementation (openlayers)
     *
     * @param {OpenLayers.Bounds} me
     *            max extent
     */
    setMaxExtent : function(me) {
        this.maxExtent = me;
        /* me is this kind of oject { left: l, top: t, right: r, bottom: b }*/;
    },
    /**
     * @method getMaxExtent
     * Max Extent in map implementation (openlayers)
     *
     * @return {OpenLayers.Bounds}
     *            max extent
     */
    getMaxExtent : function() {
        return this.maxExtent;
    },
    /**
     * @method setSrsName
     * SRS projection code in map implementation (openlayers)
     *
     * @param {String} projection
     *            _projectionCode SRS projection code
     */
    setSrsName : function(projectionCode) {
        this._projectionCode = projectionCode;
    },
    /**
     * @method getSrsName
     * SRS projection code in map implementation (openlayers)
     *
     * @return {String} 
     *            _projectionCode SRS projection code
     */
    getSrsName : function() {
        return this._projectionCode;
    }
});

define("src/oskari/base/domain/map", function(){});

/**
 * @class Oskari.mapframework.domain.Style
 *
 * Map Layer Style
 */
Oskari.clazz.define('Oskari.mapframework.domain.Style',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._name = null;
    this._title = null;
    this._legend = null;
}, {

    /**
     * @method setName
     * Sets name for the style
     *
     * @param {String} name
     *            style name
     */
    setName : function(name) {
        this._name = name
    },
    /**
     * @method getName
     * Gets name for the style
     *
     * @return {String} style name
     */
    getName : function() {
        return this._name;
    },
    /**
     * @method setTitle
     * Sets title for the style
     *
     * @param {String} title
     *            style title
     */
    setTitle : function(title) {
        this._title = title;
    },
    /**
     * @method getTitle
     * Gets title for the style
     *
     * @return {String} style title
     */
    getTitle : function() {
        return this._title;
    },
    /**
     * @method setLegend
     * Sets legendimage URL for the style
     *
     * @param {String} legend
     *            style legend
     */
    setLegend : function(legend) {
        this._legend = legend;
    },
    /**
     * @method getLegend
     * Gets legendimage URL for the style
     *
     * @return {String} style legend
     */
    getLegend : function() {
        return this._legend;
    }
});

define("src/oskari/base/domain/style", function(){});

/**
 * @class Oskari.mapframework.domain.Tool
 *
 * Map Layer Tool
 */
Oskari.clazz.define('Oskari.mapframework.domain.Tool',

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._name = null;
    this._title = null;
    this._tooltip = null;
    this._iconCls = null;
    this._callback = null;
}, {

    /**
     * @method setName
     * Sets name for the tool
     *
     * @param {String} name
     *            style name
     */
    setName : function(name) {
        this._name = name
    },
    /**
     * @method getName
     * Gets name for the tool
     *
     * @return {String} style name
     */
    getName : function() {
        return this._name;
    },
    /**
     * @method setTitle
     * Sets title for the tool
     *
     * @param {String} title
     *            tool title
     */
    setTitle : function(title) {
        this._title = title;
    },
    /**
     * @method getTitle
     * Gets title for the tool
     *
     * @return {String} tool title
     */
    getTitle : function() {
        return this._title;
    },
    /**
     * @method setTooltip
     * Set tooltip for tool
     *
     * @param {String} tooltip text
     */
    setTooltip : function(tooltip) {
        this._tooltip = tooltip;
    },
    /**
     * @method getTooltip
     * Get tooltip text
     *
     * @return {String} tooltip text
     */
    getTooltip : function() {
        return this._tooltip;
    },
    /**
     * @method setIconCls
     * Set optional icon name (e.g. icon-close)
     *
     * @param {String} icon name
     */
    setIconCls : function(iconCls) {
        this._iconCls = iconCls;
    },
    /**
     * @method getIconCls
     * Get optional icon name
     *
     * @return {String} icon name
     */
    getIconCls : function() {
        return this._iconCls;
    },
    /**
     * @method setCallback
     * Sets callback definition for tool
     *
     * @param {function} callback code
     *            
     */
    setCallback : function(callback) {
        this._callback = callback
    },
    /**
     * @method getCallback
     * Get callback code for tool
     *
     * @return {function} callback definition
     */
    getCallback : function() {
        return this._callback;
    }
});

define("src/oskari/base/domain/tool", function(){});

/**
 * @class Oskari.mapframework.domain.User
 *
 * Contains information about a logged in user.
 * If #isLoggedIn returns true, other methods should return info about user. 
 * Otherwise the user isn't logged in and no data is available.
 */
Oskari.clazz.define('Oskari.mapframework.domain.User', 

/**
 * @method create called automatically on construction
 * @static
 * 
 * Initial data on construction with 
 * Oskari.clazz.create('Oskari.mapframework.domain.User', (here))
 * 
 * @param {Object} userData
 *            json data about the user. If undefined -> user not logged in. 
 * 			  Should have atleast name and uuid for a logged in user.
 */
function(userData) {
	
	this._loggedIn = false;
	if(userData) {
		this._firstName = userData.firstName;
		this._lastName = userData.lastName;
		this._nickName = userData.nickName;
		this._loginName = userData.loginName;
		this._uuid = userData.userUUID;
		if(userData.userUUID) {
			this._loggedIn = true;
		}
	}
}, {
    /**
     * @method getName
     * Full name for the user
     *
     * @return {String}
     *            name
     */
	getName : function() {
		return this._firstName + " " + this._lastName;
	},
    /**
     * @method getFirstName
     * First name for the user
     *
     * @return {String}
     *            first name
     */
	getFirstName : function() {
		return this._firstName;
	},
    /**
     * @method getLastName
     * Last name for the user
     *
     * @return {String}
     *            last name
     */
	getLastName : function() {
		return this._lastName;
	},
    /**
     * @method getNickName
     * Nickname for the user
     *
     * @return {String}
     *            nickname
     */
	getNickName : function() {
		return this._nickName;
	},
    /**
     * @method getLoginName
     * Loginname for the user
     *
     * @return {String}
     *            loginName
     */
	getLoginName : function() {
		return this._loginName;
	},
    /**
     * @method getUuid
     * Uuid for the user
     *
     * @return {String}
     *            uuid
     */
	getUuid : function() {
		return this._uuid;
	},
    /**
     * @method isLoggedIn
     * Returns true if user is logged in
     *
     * @return {Boolean}
     */
	isLoggedIn : function() {
		return this._loggedIn;
	}
});
define("src/oskari/base/domain/user", function(){});

define('src/oskari/base/domain/module',["src/oskari/oskari",
	"./AbstractLayer",
	"./wmslayer",
	"./vectorlayer",
	"./map",
	"./style",
	"./tool",
	"./user"
], function(Oskari) {
	Oskari.bundleCls('domain');
});
/**
 * @class Oskari.mapframework.request.Request
 *
 * Superclass for all Oskari requests.
 * Consider this as an abstract class and only use it by extending.
 * 
 * Requests are used to tell another part of the application to do something.
 * They can only be sent from registered Oskari.mapframework.module.Module 
 * implementations (see Oskari.mapframework.sandbox.Sandbox.register()). 
 * If you want to tell the rest of the application that something happened, 
 * use an implementation of Oskari.mapframework.event.Event instead.
 * 
 * Code snippet example to creating and sending out a request:
 * <pre>
 * // get a builder method for the requested request type.
 * var requestBuilder = sandbox.getRequestBuilder('MapMoveRequest');
 * // create the request with the builder method
 * var request = requestBuilder(longitude, latitude);
 * // send the request to the application
 * sandbox.request('MyModule', request);
 * </pre>
 * 
 * In the above sandbox is reference to Oskari.mapframework.sandbox.Sandbox.
 * 
 * Requests are listened to with classes implementing the 
 * Oskari.mapframework.core.RequestHandler protocol. 
 * There can only be one RequestHandler for a given request. 
 * Also if the core is handling a request 
 * (Oskari.mapframework.core.Core.defaultRequestHandlers) the handler 
 * cannot be overridden at the moment.
 */
Oskari.clazz.define('Oskari.mapframework.request.Request',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function() {
    /** @property _creator name for the functionality/bundle/module sending the
     * request */
    this._creator = null;
    throw "mapframework.request.Request should not be used";
}, {
    /**
     * @method getName
     * Interface method for all request, should return request name
     * @return {String} request name
     * @throws always override this
     */
    getName : function() {
        throw "Running default implementation of Request.getName(). implement your own!";
    },
    /**
     * @method setCreator
     * @param {String} creator name for the functionality/bundle/module sending
     * the request
     */
    setCreator : function(creator) {
        this._creator = creator;
    },
    /**
     * @method getCreator
     * @return {String} name for the functionality/bundle/module sending the
     * request
     */
    getCreator : function() {
        return this._creator;
    }
});

define("src/oskari/base/request/request", function(){});

/**
 * @class Oskari.mapframework.request.common.AddMapLayerRequest
 *
 * Requests for given map layer to be added on map. Opposite of 
 * Oskari.mapframework.request.common.RemoveMapLayerRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.AddMapLayerRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of the map layer (matching one in Oskari.mapframework.service.MapLayerService)
 * @param {Boolean}
 *            keepLayersOrder should order of layers be reserved (optional,
 * defaults to false)
 * @param {Boolean}
 *            isBasemap (optional, defaults to false)
 * @param {Boolean}
 *            isExternal (optional, not used in paikkatietoikkuna)
 */
function(mapLayerId, keepLayersOrder, isBasemap, isExternal) {

    this._creator = null;
    this._mapLayerId = mapLayerId;
    this._keepLayersOrder = (keepLayersOrder == true);
    this._isExternal = (isExternal == true);
    this._isBasemap = (isBasemap == true);
}, {
    /** @static @property __name request name */
    __name : "AddMapLayerRequest",

    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayerId
     * @return {String} id for map layer used in Oskari.mapframework.service.MapLayerService
     */
    getMapLayerId : function() {
        return this._mapLayerId;
    },
    /**
     * @method getKeepLayersOrder
     * @return {Boolean} boolean true if we should keep the layer order
     */
    getKeepLayersOrder : function() {
        return this._keepLayersOrder;
    },
    /**
     * @method isBasemap
     * @return {Boolean} boolean true if this is a basemap
     */
    isBasemap : function() {
        return this._isBasemap;
    },
    /**
     * @method isExternal
     * @return {Boolean} true if this is an externally added layer (not found in
     * MapLayerService?)
     */
    isExternal : function() {
        return this._isExternal;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
define("src/oskari/base/request/common/add-map-layer-request", function(){});

/**
 * @class Oskari.mapframework.request.common.RemoveMapLayerRequest
 *
 * Requests for given map layer to be removed on map. Triggers a 
 * Oskari.mapframework.event.common.AfterMapLayerRemoveEvent.
 * Opposite of Oskari.mapframework.request.common.AddMapLayerRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.RemoveMapLayerRequest', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of the map layer (matching one in Oskari.mapframework.service.MapLayerService)
 */
function(mapLayerId) {
    this._creator = null;
    this._mapLayerId = mapLayerId;
}, {
    /** @static @property __name request name */
    __name : "RemoveMapLayerRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayerId
     * @return {String} id for map layer used in Oskari.mapframework.service.MapLayerService
     */
    getMapLayerId : function() {
        return this._mapLayerId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
define("src/oskari/base/request/common/remove-map-layer-request", function(){});

/**
 * @class Oskari.mapframework.request.common.MapMoveRequest
 *
 * Requests for the map to move to given location and zoom level/bounds. 
 * Map sends out Oskari.mapframework.event.common.AfterMapMoveEvent after it has 
 * processed the request and the map has been moved. 
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.MapMoveRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {Number} centerX
 *            longitude
 * @param {Number} centerY
 *            latitude
 * @param {Number/OpenLayers.Bounds} zoom (optional)
 *            zoomlevel (0-12) or OpenLayers.Bounds to zoom to. If not given the map zoom level stays as it was.
 * @param {Boolean} marker
 *            true if map should add a marker to this location (optional, defaults to false)
 */
function(centerX, centerY, zoom, marker, srsName) {
    this._creator = null;

    this._centerX = centerX;

    this._centerY = centerY;

    this._zoom = zoom;

    this._marker = marker;

    this._projectionCode = srsName;

}, {
    /** @static @property {String} __name request name */
    __name : "MapMoveRequest",

    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getCenterX
     * @return {Number} longitude
     */
    getCenterX : function() {
        return this._centerX;
    },
    /**
     * @method getCenterY
     * @return {Number} latitude
     */
    getCenterY : function() {
        return this._centerY;
    },
    /**
     * @method getZoom
     * @return {Number/OpenLayers.Bounds} zoomlevel (0-12) or OpenLayers.Bounds
     * to zoom to
     */
    getZoom : function() {
        return this._zoom;
    },
    /**
     * @method getMarker
     * @return {Boolean} true if map should add a marker to this location
     */
    getMarker : function() {
        return this._marker;
    },
    /**
     * @method getSrsName
     * @return {String} _projectionCode SRS projection code, defaults to 'EPSG:3067'
     */
    getSrsName : function() {
        return this._projectionCode;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
define("src/oskari/base/request/common/map-move-request", function(){});

/**
 * @class Oskari.mapframework.request.common.ShowMapLayerInfoRequest
 *
 * Requests for additional information for the given map layer to be shown in the UI.
 * (In practice the legend image for the requested layer is shown by 
 * Oskari.mapframework.ui.module.searchservice.MetadataModule).
 * Triggers a Oskari.mapframework.event.common.AfterShowMapLayerInfoEvent
 * 
 * TODO: the request could be handled directly without the event
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.ShowMapLayerInfoRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of the map layer (matching one in Oskari.mapframework.service.MapLayerService)
 */
function(mapLayerId) {
    this._creator = null;
    this._mapLayerId = mapLayerId;
}, {
    /** @static @property __name request name */
    __name : "ShowMapLayerInfoRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayerId
     * @return {String} id for map layer used in Oskari.mapframework.service.MapLayerService
     */
    getMapLayerId : function() {
        return this._mapLayerId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
define("src/oskari/base/request/common/show-map-layer-info-request", function(){});

/**
 * @class Oskari.mapframework.request.common.HideMapMarkerRequest
 *
 * Request for any markers shown on map to be hidden
 */
Oskari.clazz.define('Oskari.mapframework.request.common.HideMapMarkerRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this._creator = null;
}, {
    /** @static @property __name request name */
    __name : "HideMapMarkerRequest",
    /**
     * @method getName
     * @return {String} event name
     */
    getName : function() {
        return this.__name;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
define("src/oskari/base/request/common/hide-map-marker-request", function(){});

/**
 * @class Oskari.mapframework.request.common.CtrlKeyDownRequest
 *
 * Requests for core to handle ctrl button key press.
 * Opposite of Oskari.mapframework.request.common.CtrlKeyUpRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.CtrlKeyDownRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
}, {
    /** @static @property __name request name */
    __name : "CtrlKeyDownRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
define("src/oskari/base/request/common/ctrl-key-down-request", function(){});

/**
 * @class Oskari.mapframework.request.common.CtrlKeyUpRequest
 *
 * Requests for core to handle ctrl button key release
 * Opposite of Oskari.mapframework.request.common.CtrlKeyDownRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.CtrlKeyUpRequest',
/**
 * @method create called automatically on construction
 * @static
 */
function() {
}, {
    /** @static @property __name request name */
    __name : "CtrlKeyUpRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
define("src/oskari/base/request/common/ctrl-key-up-request", function(){});

/**
 * @class Oskari.mapframework.request.common.RearrangeSelectedMapLayerRequest
 *
 * Requests that the given maplayer is moved to a new position in the selected maplayers stack.
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.RearrangeSelectedMapLayerRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of map layer used in
 * Oskari.mapframework.service.MapLayerService
 * @param {Number} toPosition
 *            new position index for the layer
 */
function(mapLayerId, toPosition) {
    this._mapLayerId = mapLayerId;
    this._toPosition = toPosition;
}, {
    /** @static @property __name request name */
    __name : "RearrangeSelectedMapLayerRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },

    /**
     * @method getMapLayerId
     * id for map layer used in
     * Oskari.mapframework.service.MapLayerService
     * @return {String} 
     */
    getMapLayerId : function() {
        return this._mapLayerId;
    },

    /**
     * @method getToPosition
     * New position index for the layer
     * @return {Number}
     */
    getToPosition : function() {
        return this._toPosition;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
}); 
define("src/oskari/base/request/common/rearrange-selected-map-layer-request", function(){});

/**
 * @class Oskari.mapframework.request.common.ChangeMapLayerOpacityRequest
 * Requests opacity change for maplayer with given id
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.ChangeMapLayerOpacityRequest',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id for maplayer to be modified (Oskari.mapframework.service.MapLayerService)
 * @param {Number}
 *            opacity (0-100)
 */
function(mapLayerId, opacity) {
    this._creator = null;
    this._mapLayerId = mapLayerId;

    this._opacity = opacity;

}, {
    /** @static @property __name request name */
    __name : "ChangeMapLayerOpacityRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getOpacity
     * @return {Number} from 0 to 100 (0 = invisible)
     */
    getOpacity : function() {
        return this._opacity;
    },
    /**
     * @method getMapLayerId
     * @return {String} id for map layer used in Oskari.mapframework.service.MapLayerService
     */
    getMapLayerId : function() {
        return this._mapLayerId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
define("src/oskari/base/request/common/change-map-layer-opacity-request", function(){});

/**
 * @class Oskari.mapframework.request.common.ChangeMapLayerStyleRequest
 *
 * Changes style map layer with given id
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.ChangeMapLayerStyleRequest',
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of map layer used in
 * Oskari.mapframework.service.MapLayerService
 * @param {String}
 *            style name of the new style that should be selected from map layer
 */
function(mapLayerId, style) {
    this._creator = null;
    this._mapLayerId = mapLayerId;

    this._style = style;
}, {
    /** @static @property __name request name */
    __name : "ChangeMapLayerStyleRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getStyle
     * @return {String} requested style name
     */
    getStyle : function() {
        return this._style;
    },
    /**
     * @method getMapLayerId
     * @return {String} id for map layer used in
     * Oskari.mapframework.service.MapLayerService
     */
    getMapLayerId : function() {
        return this._mapLayerId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
define("src/oskari/base/request/common/change-map-layer-style-request", function(){});

/**
 * @class Oskari.mapframework.request.common.HighlightMapLayerRequest
 *
 * Requests for given map layer to be "highlighted" on map.
 * This means f.ex. a WMS layer to enable GetFeatureInfo clicks,
 * WFS layers to show featuretype grid and enable selection clicks on map
 * Opposite of Oskari.mapframework.request.common.DimMapLayerRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.HighlightMapLayerRequest', 
/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of the map layer (matching one in Oskari.mapframework.service.MapLayerService)
 */
function(mapLayerId) {
    this._creator = null;
    this._mapLayerId = mapLayerId;
}, {
    /** @static @property __name request name */
    __name : "HighlightMapLayerRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayerId
     * @return {String} id for map layer used in Oskari.mapframework.service.MapLayerService
     */
    getMapLayerId : function() {
        return this._mapLayerId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
define("src/oskari/base/request/common/highlight-map-layer-request", function(){});

/**
 * @class Oskari.mapframework.request.common.DimMapLayerRequest
 *
 * Requests for given "highlighted" map layer to be "dimmed" on map.
 * This means f.ex. a WMS layer to disable GetFeatureInfo clicks,
 * WFS layers to hide featuretype grid and disable selection clicks on map
 * Opposite of Oskari.mapframework.request.common.HighlightMapLayerRequest
 * 
 * Requests are build and sent through Oskari.mapframework.sandbox.Sandbox.
 * Oskari.mapframework.request.Request superclass documents how to send one.
 */
Oskari.clazz.define('Oskari.mapframework.request.common.DimMapLayerRequest', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            mapLayerId id of the map layer (matching one in Oskari.mapframework.service.MapLayerService)
 */
function(mapLayerId) {
    this._creator = null;
    this._mapLayerId = mapLayerId;
}, {
    /** @static @property __name request name */
    __name : "DimMapLayerRequest",
    /**
     * @method getName
     * @return {String} request name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getMapLayerId
     * @return {String} id for map layer used in Oskari.mapframework.service.MapLayerService
     */
    getMapLayerId : function() {
        return this._mapLayerId;
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.request.Request']
});
define("src/oskari/base/request/common/dim-map-layer-request", function(){});

define('src/oskari/base/request/module',[
	"src/oskari/oskari", 
	"./request",
	"./common/add-map-layer-request",
	"./common/remove-map-layer-request",
	"./common/map-move-request",
	"./common/show-map-layer-info-request",
	"./common/hide-map-marker-request",
	"./common/ctrl-key-down-request",
	"./common/ctrl-key-up-request",
	"./common/rearrange-selected-map-layer-request",
	"./common/change-map-layer-opacity-request",
	"./common/change-map-layer-style-request",
	"./common/highlight-map-layer-request",
	"./common/dim-map-layer-request"
],function(Oskari) {
	Oskari.bundleCls('request-base');
	Oskari.bundleCls('request-map');
	Oskari.bundleCls('request-map-layer');
});

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
     * Registers given module to sandbox and calls the modules init() method
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
        var oldListeners = this._listeners[eventName],
            deleteIndex = -1,
            d;
        if (oldListeners == null) {
            // no listeners
            this._core.printDebug("Module does not listen to that event, skipping.");
            return;
        }

        for (d = 0; d < oldListeners.length; d++) {
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
     * @method getEventBuilder
     *
     * Access to event builder that creates events by name
     * 
     * @param {String} name request name that we are creating
     * @return {Function} builder function for given event
     */
    getEventBuilder : function(name) {
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
    request : function(creator, request) {
        var creatorName = null,
            creatorComponent,
            rv = null;
        if (creator.getName != null) {
            creatorName = creator.getName();
        } else {
            creatorName = creator;
        }
        creatorComponent = this.findRegisteredModuleInstance(creatorName);

        if (creatorComponent == null) {
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
    requestByName : function(creator, requestName, requestArgs) {

        this.printDebug("#!#!#! --------------> requestByName " + requestName);
        var requestBuilder = this.getRequestBuilder(requestName);
        var request = requestBuilder.apply(this, requestArgs||[]);
        return this.request(creator, request);
    },

	/**
	 * @property postMasterComponent
	 * @static
	 * Used as request/event sender if creator cannot be determined
	 */
	postMasterComponent : "postmaster",
	
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
    postRequestByName : function(requestName, requestArgs) {
        var me = this,
            requestBuilder = me.getRequestBuilder(requestName);
        if(!requestBuilder) {
            return;
        }
        window.setTimeout(function() {
            
            var request = requestBuilder.apply(me, requestArgs||[]),
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
    _findModulesInterestedIn : function(event) {
        var eventName = event.getName(),
            currentListeners = this._listeners[eventName];
        if(!currentListeners) {
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
    notifyAll : function(event, retainEvent) {

        var eventName;
        if (!retainEvent) {

            eventName = event.getName();
            this._core.printDebug("Sandbox received notifyall for event '" + eventName + "'");
        }

        var modules = this._findModulesInterestedIn(event);
        if (!retainEvent) {
            this._core.printDebug("Found " + modules.length + " interested modules");
        }
        for (var i = 0; i < modules.length; i++) {
            var module = modules[i];
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
    findRegisteredModuleInstance : function(name) {
        return this._modulesByName[name];
    },

    /**
     * @method getRequestParameter
     * Returns a request parameter from query string
     * http://javablog.info/2008/04/17/url-request-parameters-using-javascript/
     * @param {String} name - parameter name
     * @return {String} value for the parameter or null if not found
     */
    getRequestParameter : function(name) {
        return this._core.getRequestParameter(name);
    },


    /**
     * @method getBrowserWindowSize
     * Returns an object with properties width and height as the window size in pixels
     * @return {Object} object with properties width and height as the window size in pixels
     */
    getBrowserWindowSize : function() {
        // FIXME get rid of jQuery.browser and make this code sane... height isn't used for anything?
        if (jQuery.browser.opera && window.innerHeight != null) {
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
    getObjectName : function(obj) {
        return this._core.getObjectName(obj);
    },
    /**
     * @method getObjectCreator
     * Returns Oskari event/request creator from the event/request object
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} obj
     * @return {String} creator
     */
    getObjectCreator : function(obj) {
        return this._core.getObjectCreator(obj);
    },
    /**
     * @method setObjectCreator
     * Sets a creator to Oskari event/request object
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} obj
     * @param {String} creator
     */
    setObjectCreator : function(obj, creator) {
        return this._core.setObjectCreator(obj, creator);
    },
    /**
     * @method copyObjectCreatorToFrom
     * Copies creator from objFrom to objTo
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} objTo
     * @param {Oskari.mapframework.request.Request/Oskari.mapframework.event.Event} objFrom
     */
    copyObjectCreatorToFrom : function(objTo, objFrom) {
        return this._core.copyObjectCreatorToFrom(objTo, objFrom);
    },

    /**
     * @method addRequestHandler
     * Registers a request handler for requests with the given name 
     * NOTE: only one request handler can be registered/request
     * @param {String} requestName - name of the request
     * @param {Oskari.mapframework.core.RequestHandler} handlerClsInstance request handler
     */
    addRequestHandler : function(requestName, handlerClsInstance) {
        return this._core.addRequestHandler(requestName, handlerClsInstance);
    },

    /**
     * @method removeRequestHandler
     * Unregisters a request handler for requests with the given name 
     * NOTE: only one request handler can be registered/request
     * @param {String} requestName - name of the request
     * @param {Oskari.mapframework.core.RequestHandler} handlerClsInstance request handler
     */
    removeRequestHandler : function(requestName, handlerInstance) {
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
    _debugPushRequest : function(creator, req) {
        if (!this.debugRequests) {
            return;
        }
        var reqLog = {
            from : creator,
            reqName : req.getName()
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
    _debugPopRequest : function() {
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
    _debugPushEvent : function(creator, target, evt) {
        if (!this.debugEvents) {
            return;
        }
        this._eventLoopGuard++;

        if (this._eventLoopGuard > 64) {
            throw "Events Looped?";
        }

        var evtLog = {
            from : creator,
            to : target.getName(),
            evtName : evt.getName()
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
    _debugPopEvent : function() {
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
    _pushRequestAndEventGather : function(name, request) {
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
    popUpSeqDiagram : function() {
        var seq_html = '<html><head></head><body><div class="wsd" wsd_style="modern-blue"><pre>',
            seq_commands = '',
            openedWindow;
        for (x in this.requestAndEventGather) {
            seq_commands += this.requestAndEventGather[x].name + this.requestAndEventGather[x].request + "\n";
        }
        if (seq_commands != '') {
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
     */
    getLocalizedProperty : function (property) {
        var ret;
        if (property === null || typeof property === 'undefined') {
            return null;
        }
        if (typeof property === 'object') {
            // property value is an object, so it's prolly localized
            ret = property[Oskari.getLang()];
            if (ret === null) {
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

define("src/oskari/base/sandbox/sandbox", function(){});

/**
 * @class Oskari.mapframework.sandbox.Sandbox.keyListenerMethods
 *
 * This category class adds key listener methods to Oskari sandbox as they were in
 * the class itself.
 */
Oskari.clazz.category('Oskari.mapframework.sandbox.Sandbox', 'key-listener-methods', {
    
    /**
     * @method isCtrlKeyDown
     * Returns true if CTRL key is down
     * @return {Boolean} true if CTRL key is down
     */
    isCtrlKeyDown : function() {
        return this._core.isCtrlKeyDown();
    }
}); 
define("src/oskari/base/sandbox/sandbox-key-listener-methods", function(){});

/**
 * @class Oskari.mapframework.sandbox.Sandbox.mapLayerMethods
 *
 * This category class adds map layers related methods to Oskari sandbox as they
 * were in the class itself.
 */
Oskari.clazz.category('Oskari.mapframework.sandbox.Sandbox', 'map-layer-methods', {
    
    /**
     * @method findMapLayerFromAllAvailable
     * Finds map layer from all available. Uses Oskari.mapframework.service.MapLayerService.
     *
     * @param {String} id of the layer to get
     * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} 
     *  layer domain object if found matching id or null if not found
     */
    findMapLayerFromAllAvailable : function(id) {
        var layer = this._core.findMapLayerFromAllAvailable(id);
        return layer;
    },

    /**
     * @method findAllSelectedMapLayers
     * Returns all currently selected map layers
     * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
     */
    findAllSelectedMapLayers : function() {
        var layersList = this._core.getAllSelectedLayers();
        // copy the array so changing it wont change the core data
        return layersList.slice(0);
    },

    /**
     * @method findMapLayerFromSelectedMapLayers
     * Returns the layer domain object matching the id if it is added to map
     *
     * @param {String} id of the layer to get
     * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} 
     *  layer domain object if found matching id or null if not found
     */
    findMapLayerFromSelectedMapLayers : function(layerId) {
        var layer = this._core.findMapLayerFromSelectedMapLayers(layerId);
        return layer;
    },

    /**
     * @method isLayerAlreadySelected
     * Checks if the layer matching the id is added to map
     *
     * @param {String} id of the layer to check
     * @return {Boolean} true if the layer is added to map
     */
    isLayerAlreadySelected : function(id) {
        return this._core.isLayerAlreadySelected(id);
    },

    /**
     * @method findAllHighlightedLayers
     * Returns all currently highlighted map layers
     * @return {Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Mixed}
     */
    findAllHighlightedLayers : function() {
        var layer = this._core.getAllHighlightedMapLayers();
        return layer;
    },

    /**
     * @method isMapLayerHighLighted
     * Checks if the layer matching the id is highlighted on the map
     *
     * @param {String} id of the layer to check
     * @return {Boolean} true if the layer is highlighted
     */
    isMapLayerHighLighted : function(id) {
        var highlighted = this.findAllHighlightedLayers();
        for (var i = 0; i < highlighted.length; i++) {
            if (highlighted[i].getId() == id) {
                return true;
            }
        }
        return false;
    },

    /**
     * @method allowMultipleHighlightLayers
     * Allow multiple layers to be highlighted at once
     *
     * @param {Boolean} allow - true to allow, false to restrict to one highlight at a time
     */
    allowMultipleHighlightLayers : function(allow) {
        this._core.allowMultipleHighlightLayers(allow);
    }
});

define("src/oskari/base/sandbox/sandbox-map-layer-methods", function(){});

/**
 * @class Oskari.mapframework.sandbox.Sandbox.mapMethods
 *
 * This category class adds map related methods to Oskari sandbox as they were in
 * the class itself.
 */
Oskari.clazz.category('Oskari.mapframework.sandbox.Sandbox', 'map-methods', {
    
    /**
     * @method getMap
     * Returns map domain object
     *
     * @return {Oskari.mapframework.domain.Map}
     */
    getMap : function() {
        return this._core.getMap();
    },

    /** 
     * 
     * @method syncMapState
     * Convenience method to send out a map move request with the values on
     * {Oskari.mapframework.domain.Map} domain object (see #getMap()).
     *
     * @param {Boolean} blnInitialMove (optional)
     * 			If true, will clear the map history after moving. Defaults to false.
     * @param {Oskari.mapframework.ui.module.common.MapModule} mapModule
     * (optional)
     * 			Refreshes the map state so that the added layers are shown correctly
     */
    syncMapState : function(blnInitialMove, mapModule) {
        var mapDomain = this._core.getMap();
        var zoom = mapDomain.getZoom();
        var marker = mapDomain.isMarkerVisible();
        if (blnInitialMove === true && zoom == 12) {
            // workaround, openlayers needs to be nudged a bit to actually draw
            // the map images if we enter at zoomlevel 12
            // so if zoom == 12 -> send a dummy request to get openlayers working
            // correctly
            // TODO: find out why OL needs this
            this._core.processRequest(this._core.getRequestBuilder('MapMoveRequest')(mapDomain.getX(), mapDomain.getY(), 0, false));
        }

        this._core.processRequest(this._core.getRequestBuilder('MapMoveRequest')(mapDomain.getX(), mapDomain.getY(), zoom, marker));
        if (blnInitialMove === true) {
            // clear history
            this._core.processRequest(this._core.getRequestBuilder('ClearHistoryRequest')());
        }
    },

    /**
     * @method generateMapLinkParameters
     * Generates query string for an URL that has the maps state with coordinates, zoom and selected map layers
     * 
     * Options syntax/supported fields:  {
     *     marker : <boolean, default false>,
     *     forceCache : <boolean, default true>,
     *     noSavedState : <boolean, default true>
     * } 
     * 
     * @param {Object} options - overrides default parameter values (optional) 
     * @return {String}
     */
    generateMapLinkParameters : function(options) {
        var mapFullComponent = this.getStatefulComponents()['mapfull'];
        if (!mapFullComponent) {
            return;
        }
        var state = mapFullComponent.getState();
        var link = 'zoomLevel=' + state['zoom'] + '&coord=' + state['east'] + '_' + state['north'] + '&mapLayers=';

        var layers = '';

        for (var i = 0; i < state['selectedLayers'].length; i++) {
            if (!state['selectedLayers'][i].hidden) {
                if (layers != '') {
                    layers += ',';
                }
                layers += state['selectedLayers'][i].id + '+' + state['selectedLayers'][i].opacity
                if (state['selectedLayers'][i].style) {
                    layers += '+' + state['selectedLayers'][i].style;
                } else {
                    layers += '+';
                }
            }
        }
        link += layers;
        if(options) {
            if(options.marker == true) {
                link += '&showMarker=true';
            }
            else {
                link += '&showMarker=false';
            }
            if(options.forceCache == false) {
                link += '&forceCache=false';
            }
            else {
                link += '&forceCache=true';
            }
            if(options.noSavedState == false) {
                link += '&noSavedState=false';
            }
            else {
                link += '&noSavedState=true';
            }
        }
        else {
            link += '&showMarker=false&forceCache=true&noSavedState=true';
        }
        return link;
    }
});

define("src/oskari/base/sandbox/sandbox-map-methods", function(){});

/**
 * @class Oskari.mapframework.sandbox.Sandbox.abstractionMethods
 *
 * This category class adds abstraction methods to Oskari sandbox as they were in
 * the class itself.
 */
Oskari.clazz.category('Oskari.mapframework.sandbox.Sandbox', 'abstraction-methods',
{
    /**
     * @method domSelector
     * Abstraction method for DOM selector f.ex. jQuery
     * @param {Object} argument for the concrete domSelector f. ex. jQuery
     * @return {Object} concrete domSelector return value
     */
    domSelector : function(arg) {
        return jQuery(arg);
    },
    /**
     * @method ajax
     * 
     * Abstraction method for ajax calls f.ex. jQuery.ajax
     * Makes an ajax request to url with given callbacks.
     * Detects available framework and uses it to make the call.
     * TODO: complete and data params not implemented
     * @deprecated implementation will propably change
     * 
     * @param {String} url
     *      URL to call
     * @param {Function} success
     *      callback for succesful action
     * @param {Function} failure
     *      callback for failed action
     * @param {Object} data (optional)
     *      data to post
     * @param {Function} complete - NOTE! NOT IMPLEMENTED YET
     *      callback on action completed (optional)
     */
    ajax : function(url, success, failure, data, complete) {
        // default to jQuery
        if (jQuery && jQuery.ajax) {
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
                data : data,
                success : success,
                error : failure
            });

        }
        // TODO: fallback to Openlayers?
        else {
            failure();
        }
    },
	
	/**
	 * @method getDefer
	 * Abstraction method for getting a defer object from Q 
	 * or undefined Q is not available.
	 * @return {Object} Q defer or undefined if Q is not available
	 */
	getDefer : function() {
		// Use Q if available
		if (window.Q && window.Q.defer) {
			return window.Q.defer();
		} else {
			return undefined;
		}
	}
});

define("src/oskari/base/sandbox/sandbox-abstraction-methods", function(){});

define('src/oskari/base/sandbox/module',[
	"src/oskari/oskari",
	"./sandbox",
	"./sandbox-key-listener-methods",
	"./sandbox-map-layer-methods",
	"./sandbox-map-methods",
	"./sandbox-abstraction-methods"
], function(Oskari) {
	Oskari.bundleCls('sandbox-base');
	Oskari.bundleCls('sandbox-map');
});
/**
 * @class Oskari.mapframework.service.Service
 * Superclass for all Oskari services.
 * Consider this as an abstract class and only use it by extending.
 */
Oskari.clazz.define('Oskari.mapframework.service.Service', 
/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function() {
    throw "mapframework.service.Service should not be used";
}, {
    /**
     * @method getName
     * @return {String}
     */
    getName : function() {
        throw "Running default implementation of Service.getName(). implement your own!";
    }
});

define("src/oskari/base/service/service", function(){});

/**
 * @class Oskari.mapframework.service.MapLayerService
 *
 * Handles everything MapLayer related.
 * Sends out Oskari.mapframework.event.common.MapLayerEvent
 * to notify application components when data is changed.
 */
Oskari.clazz.define('Oskari.mapframework.service.MapLayerService',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {String}
     *            mapLayerUrl ajax URL for map layer operations (not used atm)
     * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
     *          reference to application sandbox
     */
    function(mapLayerUrl, sandbox) {

        this._mapLayerUrl = mapLayerUrl;
        this._sandbox = sandbox;
        this._allLayersAjaxLoaded = false;
        this._loadedLayersList = [];
        // used to detect duplicate ids since looping through the list is slow
        this._reservedLayerIds = {};
        // used to keep sticky layer ids
        this._stickyLayerIds = [];
        // used to list unsupported layers to enable once layer type is supported
        this._unsupportedLayers = {};

        /**
         * @property typeMapping
         * Mapping from map-layer json "type" parameter to a class in Oskari
         * - registering these to instance instead of clazz
         */
        this.typeMapping = {
            wmslayer: 'Oskari.mapframework.domain.WmsLayer',
            vectorlayer: 'Oskari.mapframework.domain.VectorLayer'
        },

        /**
         * @property modelBuilderMapping
         * Mapping of types to classes implementing
         *   'Oskari.mapframework.service.MapLayerServiceModelBuilder'
         * - registering these to instance instead of clazz
         */
        this.modelBuilderMapping = {

        };

    }, {
        /** @static @property __qname fully qualified name for service */
        __qname: "Oskari.mapframework.service.MapLayerService",
        /**
         * @method getQName
         * @return {String} fully qualified name for service
         */
        getQName: function() {
            return this.__qname;
        },
        /** @static @property __name service name */
        __name: "MapLayerService",
        /**
         * @method getName
         * @return {String} service name
         */
        getName: function() {
            return this.__name;
        },
        /**
         * @method addLayer
         * Adds the layer to them Oskari system so it can be added to the map etc.
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layerModel
         *            parsed layer model to be added (must be of type declared in #typeMapping)
         * @param {Boolean} suppressEvent (optional)
         *            true to not send event (should only be used on initial load to avoid unnecessary events)
         * @throws error if layer with the same id already exists
         */
        addLayer: function(layerModel, suppressEvent) {

            // throws exception if the id is reserved to existing maplayer
            // we need to check again here
            this.checkForDuplicateId(layerModel.getId(), layerModel.getName());

            this._reservedLayerIds[layerModel.getId()] = true;
            // everything ok, lets add the layer
            this._loadedLayersList.push(layerModel);

            if (suppressEvent !== true) {
                // notify components of added layer if not suppressed
                var event = this._sandbox.getEventBuilder('MapLayerEvent')(layerModel.getId(), 'add');
                this._sandbox.notifyAll(event);
            }
        },
        /**
         * @method addSubLayer
         * Adds the layer to parent layer's sublayer list
         * @param {String} parentLayerId the id of the parent layer to which we're adding the layerModel.
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layerModel
         *            parsed layer model to be added (must be of type declared in #typeMapping)
         * @param {Boolean} suppressEvent (optional)
         *            true to not send event (should only be used on initial load to avoid unnecessary events)
         */
        addSubLayer: function(parentLayerId, layerModel, suppressEvent) {
            var parentLayer = this.findMapLayer(parentLayerId),
                subLayers,
                len,
                i;

            if (parentLayer && (parentLayer.isBaseLayer() || parentLayer.isGroupLayer())) {
                subLayers = parentLayer.getSubLayers();

                for (i = 0, len = subLayers.length; i < len; ++i) {
                    if (subLayers[i].getId() === layerModel.getId()) {
                        return false;
                    }
                }

                subLayers.push(layerModel);

                if (suppressEvent !== true) {
                    // notify components of added layer if not suppressed
                    var evt = this._sandbox.getEventBuilder('MapLayerEvent')(layerModel.getId(), 'add');
                    this._sandbox.notifyAll(evt);
                }
            }
        },
        /**
         * @method removeLayer
         * Removes the layer from internal layerlist and
         * sends out a MapLayerEvent if it was found & removed
         * @param {String} layerId
         *            id for the layer to be removed
         * @param {Boolean} suppressEvent (optional)
         *            true to not send event (should only be used on test cases to avoid unnecessary events)
         */
        removeLayer: function(layerId, suppressEvent) {
            var layer = null;
            for (var i = 0; i < this._loadedLayersList.length; i++) {
                if (this._loadedLayersList[i].getId() == layerId) {
                    layer = this._loadedLayersList[i];
                    this._loadedLayersList.splice(i, 1);
                    break;
                }
            }
            if (layer && suppressEvent !== true) {
                // notify components of layer removal
                var evt = this._sandbox.getEventBuilder('MapLayerEvent')(layer.getId(), 'remove');
                this._sandbox.notifyAll(evt);
            }
            this._reservedLayerIds[layerId] = false;
            // TODO: notify if layer not found?
        },
        /**
         * @method removeSubLayer
         * Removes the layer from parent layer's sublayers and
         * sends out a MapLayerEvent if it was found & removed
         * @param {String} parentLayerId
         * @param {String} layerId
         *            id for the layer to be removed
         * @param {Boolean} suppressEvent (optional)
         *            true to not send event (should only be used on test cases to avoid unnecessary events)
         */
        removeSubLayer: function(parentLayerId, layerId, suppressEvent) {
            var parentLayer = this.findMapLayer(parentLayerId),
                subLayers,
                subLayer,
                len,
                i;

            if (parentLayer && (parentLayer.isBaseLayer() || parentLayer.isGroupLayer())) {
                subLayers = parentLayer.getSubLayers();

                for (i = 0, len = subLayers.length; i < len; ++i) {
                    if (subLayers[i].getId() === layerId) {
                        subLayer = subLayers[i];
                        subLayers.splice(i, 1);
                        break;
                    }
                }

                if (subLayer && suppressEvent !== true) {
                    // notify components of added layer if not suppressed
                    var event = this._sandbox.getEventBuilder('MapLayerEvent')(subLayer.getId(), 'remove');
                    this._sandbox.notifyAll(event);
                }
            }
        },
        /**
         * @method updateLayer
         * Updates layer in internal layerlist and
         * sends out a MapLayerEvent if it was found & modified
         *
         * @param {String} layerId
         *            id for the layer to be updated
         * @param {Object} newLayerConf
         *            json conf for the layer. NOTE! Only updates name for now
         */
        updateLayer: function(layerId, newLayerConf) {
            var layer = this.findMapLayer(layerId);
            if (layer) {

                if (newLayerConf.dataUrl) {
                    layer.setDataUrl(newLayerConf.dataUrl);
                }

                if (newLayerConf.legendImage) {
                    layer.setLegendImage(newLayerConf.legendImage);
                }

                if (newLayerConf.minScale) {
                    layer.setMinScale(newLayerConf.minScale);
                }

                if (newLayerConf.maxScale) {
                    layer.setMaxSclae(newLayerConf.maxScale);
                }

                if (newLayerConf.name) {
                    layer.setName(newLayerConf.name);
                }

                if (newLayerConf.type) {
                    layer.setType(newLayerConf.type);
                }

                if (newLayerConf.wmsName) {
                    layer.setWmsName(newLayerConf.wmsName);
                }

                if (newLayerConf.wmsUrl) {
                    layer.setWmsUrls(newLayerConf.wmsUrl.split(','));
                }

                for (i in newLayerConf.admin) {
                    if (newLayerConf.admin.hasOwnProperty(i)) {
                        if (newLayerConf.admin[i]) {
                            layer.admin[i] = newLayerConf.admin[i];
                        }
                    }
                }

                // notify components of layer update
                var evt = this._sandbox.getEventBuilder('MapLayerEvent')(layer.getId(), 'update');
                this._sandbox.notifyAll(evt);
            }
            // TODO: notify if layer not found?
        },
        /**
         * @method makeLayerSticky
         * Set layer visibility swicth off disable
         *
         * @param {String} layerId
         *            id for the layer to be set
         * @param {boolean} if true, set layer swicth off disable
         *
         */
        makeLayerSticky: function(layerId, isSticky) {
            var layer = this.findMapLayer(layerId);
            // Get id for postprocess after map layer load
            this._stickyLayerIds.push(layerId);
            if (layer) {
                layer.setSticky(isSticky);
                // notify components of layer update
                var evt = this._sandbox.getEventBuilder('MapLayerEvent')(layer.getId(), 'sticky');
                this._sandbox.notifyAll(evt);
            }
            // TODO: notify if layer not found?
        },
        /**
         * @method loadAllLayersAjax
         * Loads layers JSON using the ajax URL given on #create()
         * and parses it to internal layer objects by calling #createMapLayer() and #addLayer()
         * @param {Function} callbackSuccess method to be called when layers have been loaded succesfully
         * @param {Function} callbackFailure method to be called when something went wrong
         */
        loadAllLayersAjax: function(callbackSuccess, callbackFailure) {
            var me = this;
            // Used to bypass browsers' cache especially in IE, which seems to cause
            // problems with displaying publishing permissions in some situations.
            var timeStamp = new Date().getTime();

            jQuery.ajax({
                type: "GET",
                dataType: 'json',
                beforeSend: function(x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType("application/j-son;charset=UTF-8");
                    }
                },
                url: this._mapLayerUrl + '&timestamp=' + timeStamp + '&',
                success: function(pResp) {
                    me._loadAllLayersAjaxCallBack(pResp, callbackSuccess);
                },
                error: function(jqXHR, textStatus) {
                    if (callbackFailure && jqXHR.status != 0) {
                        callbackFailure();
                    }
                }
            });
        },
        /**
         * @method _loadAllLayersAjaxCallBack
         * Internal callback method for ajax loading in #loadAllLayersAjax()
         * @param {Object} pResp ajax response in JSON format
         * @param {Function} callbackSuccess method to be called when layers have been loaded succesfully
         * @private
         */
        _loadAllLayersAjaxCallBack: function(pResp, callbackSuccess) {
            var allLayers = pResp.layers,
                i,
                mapLayer,
                existingLayer,
                exSubLayers,
                mapSubLayers,
                subI,
                existingSubLayer;


            for (i = 0; i < allLayers.length; i++) {

                mapLayer = this.createMapLayer(allLayers[i]);

                if (mapLayer && this._reservedLayerIds[mapLayer.getId()] !== true) {
                    this.addLayer(mapLayer, true);
                } else if (mapLayer) {
                    // Set additional data to an existing layer.
                    existingLayer = this.findMapLayer(mapLayer.getId());

                    if (allLayers[i].admin !== null && allLayers[i].admin !== undefined) {
                        existingLayer.admin = allLayers[i].admin;
                    }
                    if (allLayers[i].names) {
                        existingLayer.names = allLayers[i].names;
                    }

                    if (existingLayer.getSubLayers() !== null && existingLayer.getSubLayers() !== undefined) { // Set additional data to an sublayers

                        exSubLayers = existingLayer.getSubLayers();
                        mapSubLayers = mapLayer.getSubLayers();

                        for (subI = 0; subI < exSubLayers.length; subI++) {

                            existingSubLayer = exSubLayers[subI];
                            if (exSubLayers[subI].admin !== null && exSubLayers[subI].admin !== undefined) {
                                existingSubLayer.admin = mapSubLayers[subI].admin;
                            }
                            if (exSubLayers[subI].names) {
                                existingSubLayer.names = mapSubLayers[subI].names;
                            }
                        }
                    }
                }
            }
            // notify components of added layer if not suppressed
            this._allLayersAjaxLoaded = true;
            var evt = this._sandbox.getEventBuilder('MapLayerEvent')(null, 'add');
            this._sandbox.notifyAll(evt);
            this._resetStickyLayers();
            if (callbackSuccess) {
                callbackSuccess();
            }
        },

        /**
         * @method isAllLayersLoaded
         * @return {Boolean}
         */
        isAllLayersLoaded: function() {
            return this._allLayersAjaxLoaded;
        },

        /**
         * @method getAllLayers
         * Returns an array of layers added to the service for example via #addLayer()
         * @return {Mixed[]/Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Object[]}
         */
        getAllLayers: function() {
            return this._loadedLayersList;
        },
        /**
         * @method getAllLayersByMetaType
         * Returns an array of layers added to the service that have the given metatype (layer.getMetaType() === type).
         *
         * @param {String} type
         *            metatype to filter the layers with
         * @return {Mixed[]/Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Object[]}
         */
        getAllLayersByMetaType: function(type) {
            var list = [];
            for (var i = 0; i < this._loadedLayersList.length; ++i) {
                var layer = this._loadedLayersList[i];
                if (layer.getMetaType && layer.getMetaType() === type) {
                    list.push(layer);
                }
            }
            return list;
        },
        /**
         * @method getLayersOfType
         * Returns an array of layers added to the service that are of given type (layer.isLayerOfType(type)).
         *
         * @param {String} type
         *            type to filter the layers with
         * @return {Mixed[]/Oskari.mapframework.domain.WmsLayer[]/Oskari.mapframework.domain.WfsLayer[]/Oskari.mapframework.domain.VectorLayer[]/Object[]}
         */
        getLayersOfType: function(type) {
            var list = [],
                i,
                layer;
            for (i = 0; i < this._loadedLayersList.length; ++i) {
                layer = this._loadedLayersList[i];
                if (layer.isLayerOfType(type)) {
                    list.push(layer);
                }
            }
            return list;
        },
        /**
         * @method registerLayerModel
         *      Register an external layer model type (to be used by extension bundles).
         * Adds a new type to #typeMapping
         *
         * @param {String} type
         *            Mapping from map-layer json "type" parameter to a class as in #typeMapping
         * @param {String} modelName
         *            layer model name (like 'Oskari.mapframework.domain.WmsLayer')
         * @param {Function} loadLayerCallback
         *            method to be called when stored unsupported layers have been loaded
         */
        registerLayerModel: function(type, modelName, loadLayerCallback) {
            this.typeMapping[type] = modelName;

            if (loadLayerCallback) {
                var unloadedMapLayers = this._unsupportedLayers[type];
                delete this._unsupportedLayers[type];
                if (unloadedMapLayers) {
                    this._loadAllLayersAjaxCallBack({"layers": unloadedMapLayers}, loadLayerCallback)
                }
            }
        },
        /**
         * @method unregisterLayerModel
         *      Unregister an external layer model type (to be used by well behaving extension bundles).
         * Removes type from #typeMapping
         *
         * @param {String} type
         *            Mapping from map-layer json "type" parameter to a class as in #typeMapping
         */
        unregisterLayerModel: function(type) {
            this.typeMapping[type] = undefined;
        },

        /**
         * @method registerLayerModelBuilder
         *      Register a handler for an external layer model type (to be used by extension bundles).
         * Adds a new type to #modelBuilderMapping
         *
         * @param {String} type
         *            Mapping from map-layer json "type" parameter to a class as in #typeMapping
         * @param {Oskari.mapframework.service.MapLayerServiceModelBuilder} specHandlerClsInstance
         *            layer model handler instance
         */
        registerLayerModelBuilder: function(type, specHandlerClsInstance) {
            this._sandbox.printDebug("[MapLayerService] registering handler for type " + type);
            this.modelBuilderMapping[type] = specHandlerClsInstance;
        },
        /**
         * @method unregisterLayerModel
         *      Unregister handler for an external layer model type (to be used by well behaving extension bundles).
         * Removes handler from #modelBuilderMapping
         *
         * @param {String} type
         *            Mapping from map-layer json "type" parameter to a class as in #typeMapping
         */
        unregisterLayerModelBuilder: function(type) {
            this.modelBuilderMapping[type] = undefined;
        },
        /**
         * @method createMapLayer
         *
         * Parses the given JSON Object to a MapLayer Object. The JSON must have unique id attribute
         * and type attribute that matches a type in #typeMapping. TypeMappings can be added by bundles,
         * but they also need to register a handler for the new type with #registerLayerModelBuilder().
         *
         * @param {Object} mapLayerJson JSON presentation of a maplayer
         * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layerModel
         *            parsed layer model that can be added with #addLayer() (must be of type declared in #typeMapping)
         * @throws Error if json layer type is not declared in #typeMapping
         */
        createMapLayer: function(mapLayerJson) {

            var mapLayer = null;
            if (mapLayerJson.type == 'base') {
                // base map layer, create base map and its sublayers
                mapLayer = this._createGroupMapLayer(mapLayerJson, true);
            } else if (mapLayerJson.type == 'groupMap') {
                mapLayer = this._createGroupMapLayer(mapLayerJson, false);
            } else {
                // create map layer
                mapLayer = this._createActualMapLayer(mapLayerJson);
            }

            // Set additional data
            if (mapLayer && mapLayerJson.admin !== null && mapLayerJson.admin !== undefined) {
                mapLayer.admin = mapLayerJson.admin;
            }
            if (mapLayer && mapLayerJson.names !== null && mapLayerJson.names !== undefined) {
                mapLayer.names = mapLayerJson.names;
            }

            if (mapLayer && this._stickyLayerIds[mapLayer.getId()]) {
                mapLayer.setSticky(true);
            }

            return mapLayer;
        },
        /**
         * @method _createGroupMapLayer
         * @private
         *
         * Parses the given JSON Object to a Oskari.mapframework.domain.WmsLayer with sublayers.
         * Called internally from #createMapLayer().
         * Sublayers are parsed as normal maplayers with #_createActualMapLayer().
         *
         * @param {Object} mapLayerJson JSON presentation of a maplayer with sublayers
         * @param {Boolean} isBase true for baselayer (positioned in bottom on UI), false for a group layer (like base layer but is positioned like normal layers in UI)
         * @return {Oskari.mapframework.domain.WmsLayer} layerModel
         *            parsed layer model that can be added with #addLayer(). Only supports WMS layers for now.
         */
        _createGroupMapLayer: function(baseMapJson, isBase) {

            var baseLayer = Oskari.clazz.create('Oskari.mapframework.domain.WmsLayer');
            if (isBase) {
                baseLayer.setAsBaseLayer();
            } else {
                baseLayer.setAsGroupLayer();
            }

            baseLayer.setVisible(true);

            baseLayer.setId(baseMapJson.id);
            baseLayer.setName(baseMapJson.name);

            baseLayer.setMaxScale(baseMapJson.maxScale);
            baseLayer.setMinScale(baseMapJson.minScale);

            baseLayer.setDataUrl(baseMapJson.dataUrl);
            baseLayer.setMetadataIdentifier(baseMapJson.dataUrl_uuid);
            if (!baseLayer.getMetadataIdentifier() && baseLayer.getDataUrl()) {
                var tempPartsForMetadata = baseLayer.getDataUrl().split("uuid=");
                if (tempPartsForMetadata.length == 2) {
                    baseLayer.setMetadataIdentifier(tempPartsForMetadata[1]);
                }
            }

            if (baseMapJson.orgName) {
                baseLayer.setOrganizationName(baseMapJson.orgName);
            } else {
                baseLayer.setOrganizationName("");
            }

            if (baseMapJson.inspire) {
                baseLayer.setInspireName(baseMapJson.inspire);
            } else {
                baseLayer.setInspireName("");
            }
            baseLayer.setLegendImage(baseMapJson.legendImage);
            baseLayer.setDescription(baseMapJson.info);

            baseLayer.setQueryable(false);

            if (baseMapJson.permissions) {
                for (var perm in baseMapJson.permissions) {
                    if (baseMapJson.permissions.hasOwnProperty(perm)) {
                        baseLayer.addPermission(perm, baseMapJson.permissions[perm]);
                    }
                }
            }

            if (baseMapJson.subLayer) {
                for (var i = 0; i < baseMapJson.subLayer.length; i++) {
                    // Notice that we are adding layers to baselayers sublayers array
                    var subLayer = this._createActualMapLayer(baseMapJson.subLayer[i]);

                    if (subLayer) {
                        subLayer.admin = baseMapJson.subLayer[i].admin || {};
                        baseLayer.getSubLayers().push(subLayer);
                    }
                }
            }

            // Opacity
            if (baseMapJson.opacity != null) {
                baseLayer.setOpacity(baseMapJson.opacity);
            } else if (baseLayer.getSubLayers().length > 0) {
                var subLayerOpacity = baseLayer.getSubLayers()[0].getOpacity();
                if (subLayerOpacity != null) {
                    baseLayer.setOpacity(subLayerOpacity);
                } else {
                    baseLayer.setOpacity(100);
                }
            } else {
                baseLayer.setOpacity(100);
            }

            return baseLayer;
        },
        /**
         * Creates an empty domain object instance for given type. Passes params and options to constructor.
         * Given type should match a key in typeMapping, otherwise [null] is returned
         *
         * @method createLayerTypeInstance
         *
         * @param {String} type type of the layer (should match something on the typeMapping)
         * @param {Object} params object for constructor (optional)
         * @param {Object} options object for constructor (optional)
         * @return {Oskari.mapframework.domain.AbstractLayer} empty layer model for the layer type
         */
        createLayerTypeInstance: function(type, params, options) {
            var clazz = this.typeMapping[type];
            if (!clazz) {
                return null;
            }
            return Oskari.clazz.create(clazz, params, options);
        },
        /**
         * @method _createActualMapLayer
         * @private
         *
         * Parses the given JSON Object to a MapLayer Object.
         * Called internally from #createMapLayer() and #_createGroupMapLayer().
         *
         * @param {Object} mapLayerJson JSON presentation of a single maplayer
         * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layerModel
         *            parsed layer model that can be added with #addLayer()
         */
        _createActualMapLayer: function(mapLayerJson) {
            if (!mapLayerJson) {
                // sandbox.printDebug
                /*
                 * console.log("[LayersService] " + "Trying to create mapLayer
                 * without " + "backing JSON data - id: " +mapLayerId);
                 */
                return null;
            }

            var layer = this.createLayerTypeInstance(mapLayerJson.type, mapLayerJson.params, mapLayerJson.options),
                perm;
            if (!layer) {
                // add unsupported layer to array for later retrieval
                if (this._unsupportedLayers[mapLayerJson.type]) {
                    this._unsupportedLayers[mapLayerJson.type].push(mapLayerJson);
                } else {
                    this._unsupportedLayers[mapLayerJson.type] = [mapLayerJson];
                }
                return;
            }

            //these may be implemented as jsonHandler
            if (mapLayerJson.type == 'wmslayer') {
                this._populateWmsMapLayerAdditionalData(layer, mapLayerJson);
            } else if (mapLayerJson.type == 'vectorlayer') {
                layer.setStyledLayerDescriptor(mapLayerJson.styledLayerDescriptor);
            }

            if (mapLayerJson.metaType && layer.setMetaType) {
                layer.setMetaType(mapLayerJson.metaType);
            }

            // set common map layer data
            layer.setAsNormalLayer();
            layer.setId(mapLayerJson.id);
            layer.setName(mapLayerJson.name);

            if (mapLayerJson.opacity != null) {
                layer.setOpacity(mapLayerJson.opacity);
            } else {
                layer.setOpacity(100);
            }
            layer.setMaxScale(mapLayerJson.maxScale);
            layer.setMinScale(mapLayerJson.minScale);
            layer.setDescription(mapLayerJson.subtitle);
            layer.setQueryable(mapLayerJson.isQueryable === "true" ||
                mapLayerJson.isQueryable === true);

            // metadata 
            layer.setDataUrl(mapLayerJson.dataUrl);
            layer.setMetadataIdentifier(mapLayerJson.dataUrl_uuid);
            if (!layer.getMetadataIdentifier() && layer.getDataUrl()) {
                var tempPartsForMetadata = layer.getDataUrl().split("uuid=");
                if (tempPartsForMetadata.length === 2) {
                    layer.setMetadataIdentifier(tempPartsForMetadata[1]);
                }
            }

            // backendstatus 
            if (mapLayerJson.backendStatus && layer.setBackendStatus) {
                layer.setBackendStatus(mapLayerJson.backendStatus);
            }

            // for grouping: organisation and inspire 
            if (mapLayerJson.orgName) {
                layer.setOrganizationName(mapLayerJson.orgName);
            } else {
                layer.setOrganizationName("");
            }

            if (mapLayerJson.inspire) {
                layer.setInspireName(mapLayerJson.inspire);
            } else {
                layer.setInspireName("");
            }
            layer.setVisible(true);

            // extent  
            if (mapLayerJson.geom && layer.setGeometryWKT) {
                layer.setGeometryWKT(mapLayerJson.geom);
            }

            // permissions
            if (mapLayerJson.permissions) {
                for (var perm in mapLayerJson.permissions) {
                    if (mapLayerJson.permissions.hasOwnProperty(perm)) {
                        layer.addPermission(perm, mapLayerJson.permissions[perm]);
                    }
                }
            }

            if (mapLayerJson.url) {
                layer.addLayerUrl(mapLayerJson.url);
            }

            if (mapLayerJson.localization) {
                // overrides name/desc/inspire/organization if defined!!
                layer.setLocalization(mapLayerJson.localization);
            }

            var builder = this.modelBuilderMapping[mapLayerJson.type];
            if (builder) {
                builder.parseLayerData(layer, mapLayerJson, this);
            }

            return layer;
        },
        /**
         * @method _populateWmsMapLayerAdditionalData
         *
         * Parses WMS specific data from JSON to a Oskari.mapframework.domain.WmsLayer Object
         *
         * @private
         * @param {Oskari.mapframework.domain.WmsLayer} layer
         * @param {Object} jsonLayer JSON presentation for a WMS layer
         * @return {Oskari.mapframework.domain.WmsLayer} returns the same layer object with populated values for convenience
         */
        _populateWmsMapLayerAdditionalData: function(layer, jsonLayer) {
            layer.setWmsName(jsonLayer.wmsName);
            if (jsonLayer.wmsUrl) {
                var wmsUrls = jsonLayer.wmsUrl.split(",");
                for (var i = 0; i < wmsUrls.length; i++) {
                    layer.addWmsUrl(wmsUrls[i]);
                }
            }
            // default to enabled, only check if it is disabled
            layer.setFeatureInfoEnabled(jsonLayer.gfi !== 'disabled');
            return this._populateStyles(layer, jsonLayer);
        },
        /**
         * @method _populateStyles
         *
         * Parses styles attribute from JSON and adds them as a
         * Oskari.mapframework.domain.Style to the layer Object.
         * If no styles attribute is present, adds an empty
         * dummy style and sets that as current style.
         *
         * @private
         * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} layerModel
         * @param {Object} jsonLayer JSON presentation for the maplayer
         * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} returns the same layer object with populated styles for convenience
         */
        _populateStyles: function(layer, jsonLayer, defaultStyle) {

            var styleBuilder = Oskari.clazz.builder('Oskari.mapframework.domain.Style');

            if (jsonLayer.styles) {
                // has styles
                for (var i = 0; i < jsonLayer.styles.length; i++) {

                    var styleJson = jsonLayer.styles;
                    // TODO: can be removed if impl now returns
                    // an array always so loop works properly
                    var blnMultipleStyles = !(isNaN(i));
                    if (blnMultipleStyles) {
                        styleJson = jsonLayer.styles[i];
                    }

                    var style = styleBuilder();
                    style.setName(styleJson.name);
                    style.setTitle(styleJson.title);
                    style.setLegend(styleJson.legend);
                    layer.addStyle(style);

                    // only add the style once if not an array
                    if (!blnMultipleStyles) {
                        break;
                    }
                }

                // set the default style
                layer.selectStyle(jsonLayer.style);
            }

            // Create empty style that works as default if none available
            if (layer.getStyles().length == 0) {
                if (defaultStyle) {
                    layer.addStyle(defaultStyle);
                    layer.selectStyle(defaultStyle.getName());
                } else {
                    var style = styleBuilder();
                    style.setName("");
                    style.setTitle("");
                    style.setLegend("");
                    layer.addStyle(style);
                    layer.selectStyle("");
                }
            }

            layer.setLegendImage(jsonLayer.legendImage);

            if (jsonLayer.formats && jsonLayer.formats.value) {
                layer.setQueryFormat(jsonLayer.formats.value);
            }

            return layer;
        },
        /**
         * @method checkForDuplicateId
         * Checks that the layer we are trying to create will actually have unique
         * id inside domain. This is a must if we want our core domain logic to
         * work.
         *
         * @param {String}
         *            id we want to check against already added layers
         * @param {String}
         *            name (optional) only used for error message
         * @throws Error if layer with the given id was found
         */
        checkForDuplicateId: function(id, name) {

            if (this._reservedLayerIds[id] === true) {
                var foundLayer = this.findMapLayer(id);
                throw "Trying to add map layer with id '" + id + " (" + name + ")' but that id is already reserved for '" + foundLayer.getName() + "'";
            }
        },
        /**
         * @method _resetStickyLayers
         * Reset sticky layers
         *
         */
        _resetStickyLayers: function() {

            for (var i in this._stickyLayerIds) {
                var layerId = this._stickyLayerIds[i];
                this.makeLayerSticky(layerId, true);
            }
        },
        /**
         * @method findMapLayer
         * Tries to find maplayer with given id from given map layer array. Uses
         * recursion to loop through all layers and its sublayers
         *
         * @param {String}
         *            id layer id we want to find
         * @param {Array}
         *            layerList (optional) array of maplayer objects, defaults to all layers
         * @return {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object}
         *  layerModel if found matching id or null if not found
         */
        findMapLayer: function(id, layerList) {
            if (!layerList) {
                layerList = this._loadedLayersList;
            }
            for (var i = 0; i < layerList.length; i++) {
                var layer = layerList[i];
                if (layer.getId() == id) {
                    return layer;
                }

            }
            // didnt find layer from base level, try sublayers
            for (var i = 0; i < layerList.length; i++) {
                var layer = layerList[i];
                // recurse to sublayers
                var subLayers = layer.getSubLayers();
                var subLayer = this.findMapLayer(id, subLayers);
                if (subLayer != null) {
                    return subLayer;
                }
            }

            return null;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.mapframework.service.Service']
    });
define("src/oskari/base/service/map-layer-service", function(){});

define('src/oskari/base/service/module',[
	"src/oskari/oskari",
	"./service",
	"./map-layer-service"
], function(Oskari) {
	Oskari.bundleCls('service-base');
	Oskari.bundleCls('service-map');
});
define('src/oskari/base/module',[
	"src/oskari/oskari",
	"./core/module",
	"./event/module",
	"./domain/module",
	"./request/module",
	"./sandbox/module",
	"./service/module"
], function(Oskari) {});
define('libraries/jquery/jquery-ui-1.9.1.custom-modified',["jquery"], function(jQuery) {
	/*! jQuery UI - v1.9.1 - 2012-11-09
	 * http://jqueryui.com
	 * Includes: jquery.ui.core.js, jquery.ui.widget.js, jquery.ui.mouse.js, jquery.ui.position.js, jquery.ui.draggable.js, jquery.ui.droppable.js, jquery.ui.resizable.js, jquery.ui.selectable.js, jquery.ui.sortable.js, jquery.ui.slider.js, jquery.ui.tooltip.js
	 * Copyright (c) 2012 jQuery Foundation and other contributors Licensed MIT */

	(function($, undefined) {

		var uuid = 0,
			runiqueId = /^ui-id-\d+$/;

		// prevent duplicate loading
		// this is only a problem because we proxy existing functions
		// and we don't want to double proxy them
		$.ui = $.ui || {};
		if ($.ui.version) {
			return;
		}

		$.extend($.ui, {
			version: "1.9.1",

			keyCode: {
				BACKSPACE: 8,
				COMMA: 188,
				DELETE: 46,
				DOWN: 40,
				END: 35,
				ENTER: 13,
				ESCAPE: 27,
				HOME: 36,
				LEFT: 37,
				NUMPAD_ADD: 107,
				NUMPAD_DECIMAL: 110,
				NUMPAD_DIVIDE: 111,
				NUMPAD_ENTER: 108,
				NUMPAD_MULTIPLY: 106,
				NUMPAD_SUBTRACT: 109,
				PAGE_DOWN: 34,
				PAGE_UP: 33,
				PERIOD: 190,
				RIGHT: 39,
				SPACE: 32,
				TAB: 9,
				UP: 38
			}
		});

		// plugins
		$.fn.extend({
			_focus: $.fn.focus,
			focus: function(delay, fn) {
				return typeof delay === "number" ?
					this.each(function() {
						var elem = this;
						setTimeout(function() {
							$(elem).focus();
							if (fn) {
								fn.call(elem);
							}
						}, delay);
					}) :
					this._focus.apply(this, arguments);
			},

			scrollParent: function() {
				var scrollParent;
				if (($.ui.ie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
					scrollParent = this.parents().filter(function() {
						return (/(relative|absolute|fixed)/).test($.css(this, 'position')) && (/(auto|scroll)/).test($.css(this, 'overflow') + $.css(this, 'overflow-y') + $.css(this, 'overflow-x'));
					}).eq(0);
				} else {
					scrollParent = this.parents().filter(function() {
						return (/(auto|scroll)/).test($.css(this, 'overflow') + $.css(this, 'overflow-y') + $.css(this, 'overflow-x'));
					}).eq(0);
				}

				return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
			},

			zIndex: function(zIndex) {
				if (zIndex !== undefined) {
					return this.css("zIndex", zIndex);
				}

				if (this.length) {
					var elem = $(this[0]),
						position, value;
					while (elem.length && elem[0] !== document) {
						// Ignore z-index if position is set to a value where z-index is ignored by the browser
						// This makes behavior of this function consistent across browsers
						// WebKit always returns auto if the element is positioned
						position = elem.css("position");
						if (position === "absolute" || position === "relative" || position === "fixed") {
							// IE returns 0 when zIndex is not specified
							// other browsers return a string
							// we ignore the case of nested elements with an explicit value of 0
							// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
							value = parseInt(elem.css("zIndex"), 10);
							if (!isNaN(value) && value !== 0) {
								return value;
							}
						}
						elem = elem.parent();
					}
				}

				return 0;
			},

			uniqueId: function() {
				return this.each(function() {
					if (!this.id) {
						this.id = "ui-id-" + (++uuid);
					}
				});
			},

			removeUniqueId: function() {
				return this.each(function() {
					if (runiqueId.test(this.id)) {
						$(this).removeAttr("id");
					}
				});
			}
		});

		// support: jQuery <1.8
		if (!$("<a>").outerWidth(1).jquery) {
			$.each(["Width", "Height"], function(i, name) {
				var side = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"],
					type = name.toLowerCase(),
					orig = {
						innerWidth: $.fn.innerWidth,
						innerHeight: $.fn.innerHeight,
						outerWidth: $.fn.outerWidth,
						outerHeight: $.fn.outerHeight
					};

				function reduce(elem, size, border, margin) {
					$.each(side, function() {
						size -= parseFloat($.css(elem, "padding" + this)) || 0;
						if (border) {
							size -= parseFloat($.css(elem, "border" + this + "Width")) || 0;
						}
						if (margin) {
							size -= parseFloat($.css(elem, "margin" + this)) || 0;
						}
					});
					return size;
				}

				$.fn["inner" + name] = function(size) {
					if (size === undefined) {
						return orig["inner" + name].call(this);
					}

					return this.each(function() {
						$(this).css(type, reduce(this, size) + "px");
					});
				};

				$.fn["outer" + name] = function(size, margin) {
					if (typeof size !== "number") {
						return orig["outer" + name].call(this, size);
					}

					return this.each(function() {
						$(this).css(type, reduce(this, size, true, margin) + "px");
					});
				};
			});
		}

		// selectors

		function focusable(element, isTabIndexNotNaN) {
			var map, mapName, img,
				nodeName = element.nodeName.toLowerCase();
			if ("area" === nodeName) {
				map = element.parentNode;
				mapName = map.name;
				if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
					return false;
				}
				img = $("img[usemap=#" + mapName + "]")[0];
				return !!img && visible(img);
			}
			return (/input|select|textarea|button|object/.test(nodeName) ? !element.disabled :
				"a" === nodeName ?
				element.href || isTabIndexNotNaN :
				isTabIndexNotNaN) &&
			// the element and all of its ancestors must be visible
			visible(element);
		}

		function visible(element) {
			return $.expr.filters.visible(element) && !$(element).parents().andSelf().filter(function() {
				return $.css(this, "visibility") === "hidden";
			}).length;
		}

		$.extend($.expr[":"], {
			data: $.expr.createPseudo ? $.expr.createPseudo(function(dataName) {
				return function(elem) {
					return !!$.data(elem, dataName);
				};
			}) :
			// support: jQuery <1.8

			function(elem, i, match) {
				return !!$.data(elem, match[3]);
			},

			focusable: function(element) {
				return focusable(element, !isNaN($.attr(element, "tabindex")));
			},

			tabbable: function(element) {
				var tabIndex = $.attr(element, "tabindex"),
					isTabIndexNaN = isNaN(tabIndex);
				return (isTabIndexNaN || tabIndex >= 0) && focusable(element, !isTabIndexNaN);
			}
		});

		// support
		$(function() {
			var body = document.body,
				div = body.appendChild(div = document.createElement("div"));

			// access offsetHeight before setting the style to prevent a layout bug
			// in IE 9 which causes the element to continue to take up space even
			// after it is removed from the DOM (#8026)
			div.offsetHeight;

			$.extend(div.style, {
				minHeight: "100px",
				height: "auto",
				padding: 0,
				borderWidth: 0
			});

			$.support.minHeight = div.offsetHeight === 100;
			$.support.selectstart = "onselectstart" in div;

			// set display to none to avoid a layout bug in IE
			// http://dev.jquery.com/ticket/4014
			body.removeChild(div).style.display = "none";
		});



		// deprecated

		(function() {
			var uaMatch = /msie ([\w.]+)/.exec(navigator.userAgent.toLowerCase()) || [];
			$.ui.ie = uaMatch.length ? true : false;
			$.ui.ie6 = parseFloat(uaMatch[1], 10) === 6;
		})();

		$.fn.extend({
			disableSelection: function() {
				return this.bind(($.support.selectstart ? "selectstart" : "mousedown") +
					".ui-disableSelection", function(event) {
						event.preventDefault();
					});
			},

			enableSelection: function() {
				return this.unbind(".ui-disableSelection");
			}
		});

		$.extend($.ui, {
			// $.ui.plugin is deprecated.  Use the proxy pattern instead.
			plugin: {
				add: function(module, option, set) {
					var i,
						proto = $.ui[module].prototype;
					for (i in set) {
						proto.plugins[i] = proto.plugins[i] || [];
						proto.plugins[i].push([option, set[i]]);
					}
				},
				call: function(instance, name, args) {
					var i,
						set = instance.plugins[name];
					if (!set || !instance.element[0].parentNode || instance.element[0].parentNode.nodeType === 11) {
						return;
					}

					for (i = 0; i < set.length; i++) {
						if (instance.options[set[i][0]]) {
							set[i][1].apply(instance.element, args);
						}
					}
				}
			},

			contains: $.contains,

			// only used by resizable
			hasScroll: function(el, a) {

				//If overflow is hidden, the element might have extra content, but the user wants to hide it
				if ($(el).css("overflow") === "hidden") {
					return false;
				}

				var scroll = (a && a === "left") ? "scrollLeft" : "scrollTop",
					has = false;

				if (el[scroll] > 0) {
					return true;
				}

				// TODO: determine which cases actually cause this to happen
				// if the element doesn't have the scroll set, see if it's possible to
				// set the scroll
				el[scroll] = 1;
				has = (el[scroll] > 0);
				el[scroll] = 0;
				return has;
			},

			// these are odd functions, fix the API or move into individual plugins
			isOverAxis: function(x, reference, size) {
				//Determines when x coordinate is over "b" element axis
				return (x > reference) && (x < (reference + size));
			},
			isOver: function(y, x, top, left, height, width) {
				//Determines when x, y coordinates is over "b" element
				return $.ui.isOverAxis(y, top, height) && $.ui.isOverAxis(x, left, width);
			}
		});

	})(jQuery);
	(function($, undefined) {

		var uuid = 0,
			slice = Array.prototype.slice,
			_cleanData = $.cleanData;
		$.cleanData = function(elems) {
			for (var i = 0, elem;
				(elem = elems[i]) != null; i++) {
				try {
					$(elem).triggerHandler("remove");
					// http://bugs.jquery.com/ticket/8235
				} catch (e) {}
			}
			_cleanData(elems);
		};

		$.widget = function(name, base, prototype) {
			var fullName, existingConstructor, constructor, basePrototype,
				namespace = name.split(".")[0];

			name = name.split(".")[1];
			fullName = namespace + "-" + name;

			if (!prototype) {
				prototype = base;
				base = $.Widget;
			}

			// create selector for plugin
			$.expr[":"][fullName.toLowerCase()] = function(elem) {
				return !!$.data(elem, fullName);
			};

			$[namespace] = $[namespace] || {};
			existingConstructor = $[namespace][name];
			constructor = $[namespace][name] = function(options, element) {
				// allow instantiation without "new" keyword
				if (!this._createWidget) {
					return new constructor(options, element);
				}

				// allow instantiation without initializing for simple inheritance
				// must use "new" keyword (the code above always passes args)
				if (arguments.length) {
					this._createWidget(options, element);
				}
			};
			// extend with the existing constructor to carry over any static properties
			$.extend(constructor, existingConstructor, {
				version: prototype.version,
				// copy the object used to create the prototype in case we need to
				// redefine the widget later
				_proto: $.extend({}, prototype),
				// track widgets that inherit from this widget in case this widget is
				// redefined after a widget inherits from it
				_childConstructors: []
			});

			basePrototype = new base();
			// we need to make the options hash a property directly on the new instance
			// otherwise we'll modify the options hash on the prototype that we're
			// inheriting from
			basePrototype.options = $.widget.extend({}, basePrototype.options);
			$.each(prototype, function(prop, value) {
				if ($.isFunction(value)) {
					prototype[prop] = (function() {
						var _super = function() {
							return base.prototype[prop].apply(this, arguments);
						},
							_superApply = function(args) {
								return base.prototype[prop].apply(this, args);
							};
						return function() {
							var __super = this._super,
								__superApply = this._superApply,
								returnValue;

							this._super = _super;
							this._superApply = _superApply;

							returnValue = value.apply(this, arguments);

							this._super = __super;
							this._superApply = __superApply;

							return returnValue;
						};
					})();
				}
			});
			constructor.prototype = $.widget.extend(basePrototype, {
				// TODO: remove support for widgetEventPrefix
				// always use the name + a colon as the prefix, e.g., draggable:start
				// don't prefix for widgets that aren't DOM-based
				widgetEventPrefix: basePrototype.widgetEventPrefix || name
			}, prototype, {
				constructor: constructor,
				namespace: namespace,
				widgetName: name,
				// TODO remove widgetBaseClass, see #8155
				widgetBaseClass: fullName,
				widgetFullName: fullName
			});

			// If this widget is being redefined then we need to find all widgets that
			// are inheriting from it and redefine all of them so that they inherit from
			// the new version of this widget. We're essentially trying to replace one
			// level in the prototype chain.
			if (existingConstructor) {
				$.each(existingConstructor._childConstructors, function(i, child) {
					var childPrototype = child.prototype;

					// redefine the child widget using the same prototype that was
					// originally used, but inherit from the new version of the base
					$.widget(childPrototype.namespace + "." + childPrototype.widgetName, constructor, child._proto);
				});
				// remove the list of existing child constructors from the old constructor
				// so the old child constructors can be garbage collected
				delete existingConstructor._childConstructors;
			} else {
				base._childConstructors.push(constructor);
			}

			$.widget.bridge(name, constructor);
		};

		$.widget.extend = function(target) {
			var input = slice.call(arguments, 1),
				inputIndex = 0,
				inputLength = input.length,
				key,
				value;
			for (; inputIndex < inputLength; inputIndex++) {
				for (key in input[inputIndex]) {
					value = input[inputIndex][key];
					if (input[inputIndex].hasOwnProperty(key) && value !== undefined) {
						// Clone objects
						if ($.isPlainObject(value)) {
							target[key] = $.isPlainObject(target[key]) ?
								$.widget.extend({}, target[key], value) :
							// Don't extend strings, arrays, etc. with objects
							$.widget.extend({}, value);
							// Copy everything else by reference
						} else {
							target[key] = value;
						}
					}
				}
			}
			return target;
		};

		$.widget.bridge = function(name, object) {
			var fullName = object.prototype.widgetFullName;
			$.fn[name] = function(options) {
				var isMethodCall = typeof options === "string",
					args = slice.call(arguments, 1),
					returnValue = this;

				// allow multiple hashes to be passed on init
				options = !isMethodCall && args.length ?
					$.widget.extend.apply(null, [options].concat(args)) :
					options;

				if (isMethodCall) {
					this.each(function() {
						var methodValue,
							instance = $.data(this, fullName);
						if (!instance) {
							return $.error("cannot call methods on " + name + " prior to initialization; " +
								"attempted to call method '" + options + "'");
						}
						if (!$.isFunction(instance[options]) || options.charAt(0) === "_") {
							return $.error("no such method '" + options + "' for " + name + " widget instance");
						}
						methodValue = instance[options].apply(instance, args);
						if (methodValue !== instance && methodValue !== undefined) {
							returnValue = methodValue && methodValue.jquery ?
								returnValue.pushStack(methodValue.get()) :
								methodValue;
							return false;
						}
					});
				} else {
					this.each(function() {
						var instance = $.data(this, fullName);
						if (instance) {
							instance.option(options || {})._init();
						} else {
							new object(options, this);
						}
					});
				}

				return returnValue;
			};
		};

		$.Widget = function( /* options, element */ ) {};
		$.Widget._childConstructors = [];

		$.Widget.prototype = {
			widgetName: "widget",
			widgetEventPrefix: "",
			defaultElement: "<div>",
			options: {
				disabled: false,

				// callbacks
				create: null
			},
			_createWidget: function(options, element) {
				element = $(element || this.defaultElement || this)[0];
				this.element = $(element);
				this.uuid = uuid++;
				this.eventNamespace = "." + this.widgetName + this.uuid;
				this.options = $.widget.extend({},
					this.options,
					this._getCreateOptions(),
					options);

				this.bindings = $();
				this.hoverable = $();
				this.focusable = $();

				if (element !== this) {
					// 1.9 BC for #7810
					// TODO remove dual storage
					$.data(element, this.widgetName, this);
					$.data(element, this.widgetFullName, this);
					this._on(this.element, {
						remove: function(event) {
							if (event.target === element) {
								this.destroy();
							}
						}
					});
					this.document = $(element.style ?
						// element within the document
						element.ownerDocument :
						// element is window or document
						element.document || element);
					this.window = $(this.document[0].defaultView || this.document[0].parentWindow);
				}

				this._create();
				this._trigger("create", null, this._getCreateEventData());
				this._init();
			},
			_getCreateOptions: $.noop,
			_getCreateEventData: $.noop,
			_create: $.noop,
			_init: $.noop,

			destroy: function() {
				this._destroy();
				// we can probably remove the unbind calls in 2.0
				// all event bindings should go through this._on()
				this.element
					.unbind(this.eventNamespace)
				// 1.9 BC for #7810
				// TODO remove dual storage
				.removeData(this.widgetName)
					.removeData(this.widgetFullName)
				// support: jquery <1.6.3
				// http://bugs.jquery.com/ticket/9413
				.removeData($.camelCase(this.widgetFullName));
				this.widget()
					.unbind(this.eventNamespace)
					.removeAttr("aria-disabled")
					.removeClass(
						this.widgetFullName + "-disabled " +
						"ui-state-disabled");

				// clean up events and states
				this.bindings.unbind(this.eventNamespace);
				this.hoverable.removeClass("ui-state-hover");
				this.focusable.removeClass("ui-state-focus");
			},
			_destroy: $.noop,

			widget: function() {
				return this.element;
			},

			option: function(key, value) {
				var options = key,
					parts,
					curOption,
					i;

				if (arguments.length === 0) {
					// don't return a reference to the internal hash
					return $.widget.extend({}, this.options);
				}

				if (typeof key === "string") {
					// handle nested keys, e.g., "foo.bar" => { foo: { bar: ___ } }
					options = {};
					parts = key.split(".");
					key = parts.shift();
					if (parts.length) {
						curOption = options[key] = $.widget.extend({}, this.options[key]);
						for (i = 0; i < parts.length - 1; i++) {
							curOption[parts[i]] = curOption[parts[i]] || {};
							curOption = curOption[parts[i]];
						}
						key = parts.pop();
						if (value === undefined) {
							return curOption[key] === undefined ? null : curOption[key];
						}
						curOption[key] = value;
					} else {
						if (value === undefined) {
							return this.options[key] === undefined ? null : this.options[key];
						}
						options[key] = value;
					}
				}

				this._setOptions(options);

				return this;
			},
			_setOptions: function(options) {
				var key;

				for (key in options) {
					this._setOption(key, options[key]);
				}

				return this;
			},
			_setOption: function(key, value) {
				this.options[key] = value;

				if (key === "disabled") {
					this.widget()
						.toggleClass(this.widgetFullName + "-disabled ui-state-disabled", !! value)
						.attr("aria-disabled", value);
					this.hoverable.removeClass("ui-state-hover");
					this.focusable.removeClass("ui-state-focus");
				}

				return this;
			},

			enable: function() {
				return this._setOption("disabled", false);
			},
			disable: function() {
				return this._setOption("disabled", true);
			},

			_on: function(element, handlers) {
				var delegateElement,
					instance = this;
				// no element argument, shuffle and use this.element
				if (!handlers) {
					handlers = element;
					element = this.element;
					delegateElement = this.widget();
				} else {
					// accept selectors, DOM elements
					element = delegateElement = $(element);
					this.bindings = this.bindings.add(element);
				}

				$.each(handlers, function(event, handler) {
					function handlerProxy() {
						// allow widgets to customize the disabled handling
						// - disabled as an array instead of boolean
						// - disabled class as method for disabling individual parts
						if (instance.options.disabled === true ||
							$(this).hasClass("ui-state-disabled")) {
							return;
						}
						return (typeof handler === "string" ? instance[handler] : handler)
							.apply(instance, arguments);
					}

					// copy the guid so direct unbinding works
					if (typeof handler !== "string") {
						handlerProxy.guid = handler.guid =
							handler.guid || handlerProxy.guid || $.guid++;
					}

					var match = event.match(/^(\w+)\s*(.*)$/),
						eventName = match[1] + instance.eventNamespace,
						selector = match[2];
					if (selector) {
						delegateElement.delegate(selector, eventName, handlerProxy);
					} else {
						element.bind(eventName, handlerProxy);
					}
				});
			},

			_off: function(element, eventName) {
				eventName = (eventName || "").split(" ").join(this.eventNamespace + " ") + this.eventNamespace;
				element.unbind(eventName).undelegate(eventName);
			},

			_delay: function(handler, delay) {
				function handlerProxy() {
					return (typeof handler === "string" ? instance[handler] : handler)
						.apply(instance, arguments);
				}
				var instance = this;
				return setTimeout(handlerProxy, delay || 0);
			},

			_hoverable: function(element) {
				this.hoverable = this.hoverable.add(element);
				this._on(element, {
					mouseenter: function(event) {
						$(event.currentTarget).addClass("ui-state-hover");
					},
					mouseleave: function(event) {
						$(event.currentTarget).removeClass("ui-state-hover");
					}
				});
			},

			_focusable: function(element) {
				this.focusable = this.focusable.add(element);
				this._on(element, {
					focusin: function(event) {
						$(event.currentTarget).addClass("ui-state-focus");
					},
					focusout: function(event) {
						$(event.currentTarget).removeClass("ui-state-focus");
					}
				});
			},

			_trigger: function(type, event, data) {
				var prop, orig,
					callback = this.options[type];

				data = data || {};
				event = $.Event(event);
				event.type = (type === this.widgetEventPrefix ?
					type :
					this.widgetEventPrefix + type).toLowerCase();
				// the original event may come from any element
				// so we need to reset the target on the new event
				event.target = this.element[0];

				// copy original event properties over to the new event
				orig = event.originalEvent;
				if (orig) {
					for (prop in orig) {
						if (!(prop in event)) {
							event[prop] = orig[prop];
						}
					}
				}

				this.element.trigger(event, data);
				return !($.isFunction(callback) &&
					callback.apply(this.element[0], [event].concat(data)) === false ||
					event.isDefaultPrevented());
			}
		};

		$.each({
			show: "fadeIn",
			hide: "fadeOut"
		}, function(method, defaultEffect) {
			$.Widget.prototype["_" + method] = function(element, options, callback) {
				if (typeof options === "string") {
					options = {
						effect: options
					};
				}
				var hasOptions,
					effectName = !options ?
						method :
						options === true || typeof options === "number" ?
						defaultEffect :
						options.effect || defaultEffect;
				options = options || {};
				if (typeof options === "number") {
					options = {
						duration: options
					};
				}
				hasOptions = !$.isEmptyObject(options);
				options.complete = callback;
				if (options.delay) {
					element.delay(options.delay);
				}
				if (hasOptions && $.effects && ($.effects.effect[effectName] || $.uiBackCompat !== false && $.effects[effectName])) {
					element[method](options);
				} else if (effectName !== method && element[effectName]) {
					element[effectName](options.duration, options.easing, callback);
				} else {
					element.queue(function(next) {
						$(this)[method]();
						if (callback) {
							callback.call(element[0]);
						}
						next();
					});
				}
			};
		});

		// DEPRECATED
		if ($.uiBackCompat !== false) {
			$.Widget.prototype._getCreateOptions = function() {
				return $.metadata && $.metadata.get(this.element[0])[this.widgetName];
			};
		}

	})(jQuery);
	(function($, undefined) {

		var mouseHandled = false;
		$(document).mouseup(function(e) {
			mouseHandled = false;
		});

		$.widget("ui.mouse", {
			version: "1.9.1",
			options: {
				cancel: 'input,textarea,button,select,option',
				distance: 1,
				delay: 0
			},
			_mouseInit: function() {
				var that = this;

				this.element
					.bind('mousedown.' + this.widgetName, function(event) {
						return that._mouseDown(event);
					})
					.bind('click.' + this.widgetName, function(event) {
						if (true === $.data(event.target, that.widgetName + '.preventClickEvent')) {
							$.removeData(event.target, that.widgetName + '.preventClickEvent');
							event.stopImmediatePropagation();
							return false;
						}
					});

				this.started = false;
			},

			// TODO: make sure destroying one instance of mouse doesn't mess with
			// other instances of mouse
			_mouseDestroy: function() {
				this.element.unbind('.' + this.widgetName);
				if (this._mouseMoveDelegate) {
					$(document)
						.unbind('mousemove.' + this.widgetName, this._mouseMoveDelegate)
						.unbind('mouseup.' + this.widgetName, this._mouseUpDelegate);
				}
			},

			_mouseDown: function(event) {
				// don't let more than one widget handle mouseStart
				if (mouseHandled) {
					return;
				}

				// we may have missed mouseup (out of window)
				(this._mouseStarted && this._mouseUp(event));

				this._mouseDownEvent = event;

				var that = this,
					btnIsLeft = (event.which === 1),
					// event.target.nodeName works around a bug in IE 8 with
					// disabled inputs (#7620)
					elIsCancel = (typeof this.options.cancel === "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
				if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
					return true;
				}

				this.mouseDelayMet = !this.options.delay;
				if (!this.mouseDelayMet) {
					this._mouseDelayTimer = setTimeout(function() {
						that.mouseDelayMet = true;
					}, this.options.delay);
				}

				if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
					this._mouseStarted = (this._mouseStart(event) !== false);
					if (!this._mouseStarted) {
						event.preventDefault();
						return true;
					}
				}

				// Click event may never have fired (Gecko & Opera)
				if (true === $.data(event.target, this.widgetName + '.preventClickEvent')) {
					$.removeData(event.target, this.widgetName + '.preventClickEvent');
				}

				// these delegates are required to keep context
				this._mouseMoveDelegate = function(event) {
					return that._mouseMove(event);
				};
				this._mouseUpDelegate = function(event) {
					return that._mouseUp(event);
				};
				$(document)
					.bind('mousemove.' + this.widgetName, this._mouseMoveDelegate)
					.bind('mouseup.' + this.widgetName, this._mouseUpDelegate);

				event.preventDefault();

				mouseHandled = true;
				return true;
			},

			_mouseMove: function(event) {
				// IE mouseup check - mouseup happened when mouse was out of window
				if ($.ui.ie && !(document.documentMode >= 9) && !event.button) {
					return this._mouseUp(event);
				}

				if (this._mouseStarted) {
					this._mouseDrag(event);
					return event.preventDefault();
				}

				if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
					this._mouseStarted =
						(this._mouseStart(this._mouseDownEvent, event) !== false);
					(this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
				}

				return !this._mouseStarted;
			},

			_mouseUp: function(event) {
				$(document)
					.unbind('mousemove.' + this.widgetName, this._mouseMoveDelegate)
					.unbind('mouseup.' + this.widgetName, this._mouseUpDelegate);

				if (this._mouseStarted) {
					this._mouseStarted = false;

					if (event.target === this._mouseDownEvent.target) {
						$.data(event.target, this.widgetName + '.preventClickEvent', true);
					}

					this._mouseStop(event);
				}

				return false;
			},

			_mouseDistanceMet: function(event) {
				return (Math.max(
					Math.abs(this._mouseDownEvent.pageX - event.pageX),
					Math.abs(this._mouseDownEvent.pageY - event.pageY)
				) >= this.options.distance);
			},

			_mouseDelayMet: function(event) {
				return this.mouseDelayMet;
			},

			// These are placeholder methods, to be overriden by extending plugin
			_mouseStart: function(event) {},
			_mouseDrag: function(event) {},
			_mouseStop: function(event) {},
			_mouseCapture: function(event) {
				return true;
			}
		});

	})(jQuery);
	(function($, undefined) {

		$.ui = $.ui || {};

		var cachedScrollbarWidth,
			max = Math.max,
			abs = Math.abs,
			round = Math.round,
			rhorizontal = /left|center|right/,
			rvertical = /top|center|bottom/,
			roffset = /[\+\-]\d+%?/,
			rposition = /^\w+/,
			rpercent = /%$/,
			_position = $.fn.position;

		function getOffsets(offsets, width, height) {
			return [
				parseInt(offsets[0], 10) * (rpercent.test(offsets[0]) ? width / 100 : 1),
				parseInt(offsets[1], 10) * (rpercent.test(offsets[1]) ? height / 100 : 1)
			];
		}

		function parseCss(element, property) {
			return parseInt($.css(element, property), 10) || 0;
		}

		$.position = {
			scrollbarWidth: function() {
				if (cachedScrollbarWidth !== undefined) {
					return cachedScrollbarWidth;
				}
				var w1, w2,
					div = $("<div style='display:block;width:50px;height:50px;overflow:hidden;'><div style='height:100px;width:auto;'></div></div>"),
					innerDiv = div.children()[0];

				$("body").append(div);
				w1 = innerDiv.offsetWidth;
				div.css("overflow", "scroll");

				w2 = innerDiv.offsetWidth;

				if (w1 === w2) {
					w2 = div[0].clientWidth;
				}

				div.remove();

				return (cachedScrollbarWidth = w1 - w2);
			},
			getScrollInfo: function(within) {
				var overflowX = within.isWindow ? "" : within.element.css("overflow-x"),
					overflowY = within.isWindow ? "" : within.element.css("overflow-y"),
					hasOverflowX = overflowX === "scroll" ||
						(overflowX === "auto" && within.width < within.element[0].scrollWidth),
					hasOverflowY = overflowY === "scroll" ||
						(overflowY === "auto" && within.height < within.element[0].scrollHeight);
				return {
					width: hasOverflowX ? $.position.scrollbarWidth() : 0,
					height: hasOverflowY ? $.position.scrollbarWidth() : 0
				};
			},
			getWithinInfo: function(element) {
				var withinElement = $(element || window),
					isWindow = $.isWindow(withinElement[0]);
				return {
					element: withinElement,
					isWindow: isWindow,
					offset: withinElement.offset() || {
						left: 0,
						top: 0
					},
					scrollLeft: withinElement.scrollLeft(),
					scrollTop: withinElement.scrollTop(),
					width: isWindow ? withinElement.width() : withinElement.outerWidth(),
					height: isWindow ? withinElement.height() : withinElement.outerHeight()
				};
			}
		};

		$.fn.position = function(options) {
			if (!options || !options.of) {
				return _position.apply(this, arguments);
			}

			// make a copy, we don't want to modify arguments
			options = $.extend({}, options);

			var atOffset, targetWidth, targetHeight, targetOffset, basePosition,
				target = $(options.of),
				within = $.position.getWithinInfo(options.within),
				scrollInfo = $.position.getScrollInfo(within),
				targetElem = target[0],
				collision = (options.collision || "flip").split(" "),
				offsets = {};

			if (targetElem.nodeType === 9) {
				targetWidth = target.width();
				targetHeight = target.height();
				targetOffset = {
					top: 0,
					left: 0
				};
			} else if ($.isWindow(targetElem)) {
				targetWidth = target.width();
				targetHeight = target.height();
				targetOffset = {
					top: target.scrollTop(),
					left: target.scrollLeft()
				};
			} else if (targetElem.preventDefault) {
				// force left top to allow flipping
				options.at = "left top";
				targetWidth = targetHeight = 0;
				targetOffset = {
					top: targetElem.pageY,
					left: targetElem.pageX
				};
			} else {
				targetWidth = target.outerWidth();
				targetHeight = target.outerHeight();
				targetOffset = target.offset();
			}
			// clone to reuse original targetOffset later
			basePosition = $.extend({}, targetOffset);

			// force my and at to have valid horizontal and vertical positions
			// if a value is missing or invalid, it will be converted to center
			$.each(["my", "at"], function() {
				var pos = (options[this] || "").split(" "),
					horizontalOffset,
					verticalOffset;

				if (pos.length === 1) {
					pos = rhorizontal.test(pos[0]) ?
						pos.concat(["center"]) :
						rvertical.test(pos[0]) ?
						["center"].concat(pos) :
						["center", "center"];
				}
				pos[0] = rhorizontal.test(pos[0]) ? pos[0] : "center";
				pos[1] = rvertical.test(pos[1]) ? pos[1] : "center";

				// calculate offsets
				horizontalOffset = roffset.exec(pos[0]);
				verticalOffset = roffset.exec(pos[1]);
				offsets[this] = [
					horizontalOffset ? horizontalOffset[0] : 0,
					verticalOffset ? verticalOffset[0] : 0
				];

				// reduce to just the positions without the offsets
				options[this] = [
					rposition.exec(pos[0])[0],
					rposition.exec(pos[1])[0]
				];
			});

			// normalize collision option
			if (collision.length === 1) {
				collision[1] = collision[0];
			}

			if (options.at[0] === "right") {
				basePosition.left += targetWidth;
			} else if (options.at[0] === "center") {
				basePosition.left += targetWidth / 2;
			}

			if (options.at[1] === "bottom") {
				basePosition.top += targetHeight;
			} else if (options.at[1] === "center") {
				basePosition.top += targetHeight / 2;
			}

			atOffset = getOffsets(offsets.at, targetWidth, targetHeight);
			basePosition.left += atOffset[0];
			basePosition.top += atOffset[1];

			return this.each(function() {
				var collisionPosition, using,
					elem = $(this),
					elemWidth = elem.outerWidth(),
					elemHeight = elem.outerHeight(),
					marginLeft = parseCss(this, "marginLeft"),
					marginTop = parseCss(this, "marginTop"),
					collisionWidth = elemWidth + marginLeft + parseCss(this, "marginRight") + scrollInfo.width,
					collisionHeight = elemHeight + marginTop + parseCss(this, "marginBottom") + scrollInfo.height,
					position = $.extend({}, basePosition),
					myOffset = getOffsets(offsets.my, elem.outerWidth(), elem.outerHeight());

				if (options.my[0] === "right") {
					position.left -= elemWidth;
				} else if (options.my[0] === "center") {
					position.left -= elemWidth / 2;
				}

				if (options.my[1] === "bottom") {
					position.top -= elemHeight;
				} else if (options.my[1] === "center") {
					position.top -= elemHeight / 2;
				}

				position.left += myOffset[0];
				position.top += myOffset[1];

				// if the browser doesn't support fractions, then round for consistent results
				if (!$.support.offsetFractions) {
					position.left = round(position.left);
					position.top = round(position.top);
				}

				collisionPosition = {
					marginLeft: marginLeft,
					marginTop: marginTop
				};

				$.each(["left", "top"], function(i, dir) {
					if ($.ui.position[collision[i]]) {
						$.ui.position[collision[i]][dir](position, {
							targetWidth: targetWidth,
							targetHeight: targetHeight,
							elemWidth: elemWidth,
							elemHeight: elemHeight,
							collisionPosition: collisionPosition,
							collisionWidth: collisionWidth,
							collisionHeight: collisionHeight,
							offset: [atOffset[0] + myOffset[0], atOffset[1] + myOffset[1]],
							my: options.my,
							at: options.at,
							within: within,
							elem: elem
						});
					}
				});

				if ($.fn.bgiframe) {
					elem.bgiframe();
				}

				if (options.using) {
					// adds feedback as second argument to using callback, if present
					using = function(props) {
						var left = targetOffset.left - position.left,
							right = left + targetWidth - elemWidth,
							top = targetOffset.top - position.top,
							bottom = top + targetHeight - elemHeight,
							feedback = {
								target: {
									element: target,
									left: targetOffset.left,
									top: targetOffset.top,
									width: targetWidth,
									height: targetHeight
								},
								element: {
									element: elem,
									left: position.left,
									top: position.top,
									width: elemWidth,
									height: elemHeight
								},
								horizontal: right < 0 ? "left" : left > 0 ? "right" : "center",
								vertical: bottom < 0 ? "top" : top > 0 ? "bottom" : "middle"
							};
						if (targetWidth < elemWidth && abs(left + right) < targetWidth) {
							feedback.horizontal = "center";
						}
						if (targetHeight < elemHeight && abs(top + bottom) < targetHeight) {
							feedback.vertical = "middle";
						}
						if (max(abs(left), abs(right)) > max(abs(top), abs(bottom))) {
							feedback.important = "horizontal";
						} else {
							feedback.important = "vertical";
						}
						options.using.call(this, props, feedback);
					};
				}

				elem.offset($.extend(position, {
					using: using
				}));
			});
		};

		$.ui.position = {
			fit: {
				left: function(position, data) {
					var within = data.within,
						withinOffset = within.isWindow ? within.scrollLeft : within.offset.left,
						outerWidth = within.width,
						collisionPosLeft = position.left - data.collisionPosition.marginLeft,
						overLeft = withinOffset - collisionPosLeft,
						overRight = collisionPosLeft + data.collisionWidth - outerWidth - withinOffset,
						newOverRight;

					// element is wider than within
					if (data.collisionWidth > outerWidth) {
						// element is initially over the left side of within
						if (overLeft > 0 && overRight <= 0) {
							newOverRight = position.left + overLeft + data.collisionWidth - outerWidth - withinOffset;
							position.left += overLeft - newOverRight;
							// element is initially over right side of within
						} else if (overRight > 0 && overLeft <= 0) {
							position.left = withinOffset;
							// element is initially over both left and right sides of within
						} else {
							if (overLeft > overRight) {
								position.left = withinOffset + outerWidth - data.collisionWidth;
							} else {
								position.left = withinOffset;
							}
						}
						// too far left -> align with left edge
					} else if (overLeft > 0) {
						position.left += overLeft;
						// too far right -> align with right edge
					} else if (overRight > 0) {
						position.left -= overRight;
						// adjust based on position and margin
					} else {
						position.left = max(position.left - collisionPosLeft, position.left);
					}
				},
				top: function(position, data) {
					var within = data.within,
						withinOffset = within.isWindow ? within.scrollTop : within.offset.top,
						outerHeight = data.within.height,
						collisionPosTop = position.top - data.collisionPosition.marginTop,
						overTop = withinOffset - collisionPosTop,
						overBottom = collisionPosTop + data.collisionHeight - outerHeight - withinOffset,
						newOverBottom;

					// element is taller than within
					if (data.collisionHeight > outerHeight) {
						// element is initially over the top of within
						if (overTop > 0 && overBottom <= 0) {
							newOverBottom = position.top + overTop + data.collisionHeight - outerHeight - withinOffset;
							position.top += overTop - newOverBottom;
							// element is initially over bottom of within
						} else if (overBottom > 0 && overTop <= 0) {
							position.top = withinOffset;
							// element is initially over both top and bottom of within
						} else {
							if (overTop > overBottom) {
								position.top = withinOffset + outerHeight - data.collisionHeight;
							} else {
								position.top = withinOffset;
							}
						}
						// too far up -> align with top
					} else if (overTop > 0) {
						position.top += overTop;
						// too far down -> align with bottom edge
					} else if (overBottom > 0) {
						position.top -= overBottom;
						// adjust based on position and margin
					} else {
						position.top = max(position.top - collisionPosTop, position.top);
					}
				}
			},
			flip: {
				left: function(position, data) {
					var within = data.within,
						withinOffset = within.offset.left + within.scrollLeft,
						outerWidth = within.width,
						offsetLeft = within.isWindow ? within.scrollLeft : within.offset.left,
						collisionPosLeft = position.left - data.collisionPosition.marginLeft,
						overLeft = collisionPosLeft - offsetLeft,
						overRight = collisionPosLeft + data.collisionWidth - outerWidth - offsetLeft,
						myOffset = data.my[0] === "left" ? -data.elemWidth :
							data.my[0] === "right" ?
							data.elemWidth :
							0,
						atOffset = data.at[0] === "left" ?
							data.targetWidth :
							data.at[0] === "right" ? -data.targetWidth :
							0,
						offset = -2 * data.offset[0],
						newOverRight,
						newOverLeft;

					if (overLeft < 0) {
						newOverRight = position.left + myOffset + atOffset + offset + data.collisionWidth - outerWidth - withinOffset;
						if (newOverRight < 0 || newOverRight < abs(overLeft)) {
							position.left += myOffset + atOffset + offset;
						}
					} else if (overRight > 0) {
						newOverLeft = position.left - data.collisionPosition.marginLeft + myOffset + atOffset + offset - offsetLeft;
						if (newOverLeft > 0 || abs(newOverLeft) < overRight) {
							position.left += myOffset + atOffset + offset;
						}
					}
				},
				top: function(position, data) {
					var within = data.within,
						withinOffset = within.offset.top + within.scrollTop,
						outerHeight = within.height,
						offsetTop = within.isWindow ? within.scrollTop : within.offset.top,
						collisionPosTop = position.top - data.collisionPosition.marginTop,
						overTop = collisionPosTop - offsetTop,
						overBottom = collisionPosTop + data.collisionHeight - outerHeight - offsetTop,
						top = data.my[1] === "top",
						myOffset = top ? -data.elemHeight :
							data.my[1] === "bottom" ?
							data.elemHeight :
							0,
						atOffset = data.at[1] === "top" ?
							data.targetHeight :
							data.at[1] === "bottom" ? -data.targetHeight :
							0,
						offset = -2 * data.offset[1],
						newOverTop,
						newOverBottom;
					if (overTop < 0) {
						newOverBottom = position.top + myOffset + atOffset + offset + data.collisionHeight - outerHeight - withinOffset;
						if ((position.top + myOffset + atOffset + offset) > overTop && (newOverBottom < 0 || newOverBottom < abs(overTop))) {
							position.top += myOffset + atOffset + offset;
						}
					} else if (overBottom > 0) {
						newOverTop = position.top - data.collisionPosition.marginTop + myOffset + atOffset + offset - offsetTop;
						if ((position.top + myOffset + atOffset + offset) > overBottom && (newOverTop > 0 || abs(newOverTop) < overBottom)) {
							position.top += myOffset + atOffset + offset;
						}
					}
				}
			},
			flipfit: {
				left: function() {
					$.ui.position.flip.left.apply(this, arguments);
					$.ui.position.fit.left.apply(this, arguments);
				},
				top: function() {
					$.ui.position.flip.top.apply(this, arguments);
					$.ui.position.fit.top.apply(this, arguments);
				}
			}
		};

		// fraction support test
		(function() {
			var testElement, testElementParent, testElementStyle, offsetLeft, i,
				body = document.getElementsByTagName("body")[0],
				div = document.createElement("div");

			//Create a "fake body" for testing based on method used in jQuery.support
			testElement = document.createElement(body ? "div" : "body");
			testElementStyle = {
				visibility: "hidden",
				width: 0,
				height: 0,
				border: 0,
				margin: 0,
				background: "none"
			};
			if (body) {
				$.extend(testElementStyle, {
					position: "absolute",
					left: "-1000px",
					top: "-1000px"
				});
			}
			for (i in testElementStyle) {
				testElement.style[i] = testElementStyle[i];
			}
			testElement.appendChild(div);
			testElementParent = body || document.documentElement;
			testElementParent.insertBefore(testElement, testElementParent.firstChild);

			div.style.cssText = "position: absolute; left: 10.7432222px;";

			offsetLeft = $(div).offset().left;
			$.support.offsetFractions = offsetLeft > 10 && offsetLeft < 11;

			testElement.innerHTML = "";
			testElementParent.removeChild(testElement);
		})();

		// DEPRECATED
		if ($.uiBackCompat !== false) {
			// offset option
			(function($) {
				var _position = $.fn.position;
				$.fn.position = function(options) {
					if (!options || !options.offset) {
						return _position.call(this, options);
					}
					var offset = options.offset.split(" "),
						at = options.at.split(" ");
					if (offset.length === 1) {
						offset[1] = offset[0];
					}
					if (/^\d/.test(offset[0])) {
						offset[0] = "+" + offset[0];
					}
					if (/^\d/.test(offset[1])) {
						offset[1] = "+" + offset[1];
					}
					if (at.length === 1) {
						if (/left|center|right/.test(at[0])) {
							at[1] = "center";
						} else {
							at[1] = at[0];
							at[0] = "center";
						}
					}
					return _position.call(this, $.extend(options, {
						at: at[0] + offset[0] + " " + at[1] + offset[1],
						offset: undefined
					}));
				};
			}(jQuery));
		}

	}(jQuery));
	(function($, undefined) {

		$.widget("ui.draggable", $.ui.mouse, {
			version: "1.9.1",
			widgetEventPrefix: "drag",
			options: {
				addClasses: true,
				appendTo: "parent",
				axis: false,
				connectToSortable: false,
				containment: false,
				cursor: "auto",
				cursorAt: false,
				grid: false,
				handle: false,
				helper: "original",
				iframeFix: false,
				opacity: false,
				refreshPositions: false,
				revert: false,
				revertDuration: 500,
				scope: "default",
				scroll: true,
				scrollSensitivity: 20,
				scrollSpeed: 20,
				snap: false,
				snapMode: "both",
				snapTolerance: 20,
				stack: false,
				zIndex: false
			},
			_create: function() {

				if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
					this.element[0].style.position = 'relative';

				(this.options.addClasses && this.element.addClass("ui-draggable"));
				(this.options.disabled && this.element.addClass("ui-draggable-disabled"));

				this._mouseInit();

			},

			_destroy: function() {
				this.element.removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled");
				this._mouseDestroy();
			},

			_mouseCapture: function(event) {

				var o = this.options;

				// among others, prevent a drag on a resizable-handle
				if (this.helper || o.disabled || $(event.target).is('.ui-resizable-handle'))
					return false;

				//Quit if we're not on a valid handle
				this.handle = this._getHandle(event);
				if (!this.handle)
					return false;

				$(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
					$('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>')
						.css({
							width: this.offsetWidth + "px",
							height: this.offsetHeight + "px",
							position: "absolute",
							opacity: "0.001",
							zIndex: 1000
						})
						.css($(this).offset())
						.appendTo("body");
				});

				return true;

			},

			_mouseStart: function(event) {

				var o = this.options;

				//Create and append the visible helper
				this.helper = this._createHelper(event);

				this.helper.addClass("ui-draggable-dragging");

				//Cache the helper size
				this._cacheHelperProportions();

				//If ddmanager is used for droppables, set the global draggable
				if ($.ui.ddmanager)
					$.ui.ddmanager.current = this;

				/*
				 * - Position generation -
				 * This block generates everything position related - it's the core of draggables.
				 */

				//Cache the margins of the original element
				this._cacheMargins();

				//Store the helper's css position
				this.cssPosition = this.helper.css("position");
				this.scrollParent = this.helper.scrollParent();

				//The element's absolute position on the page minus margins
				this.offset = this.positionAbs = this.element.offset();
				this.offset = {
					top: this.offset.top - this.margins.top,
					left: this.offset.left - this.margins.left
				};

				$.extend(this.offset, {
					click: { //Where the click happened, relative to the element
						left: event.pageX - this.offset.left,
						top: event.pageY - this.offset.top
					},
					parent: this._getParentOffset(),
					relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
				});

				//Generate the original position
				this.originalPosition = this.position = this._generatePosition(event);
				this.originalPageX = event.pageX;
				this.originalPageY = event.pageY;

				//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
				(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

				//Set a containment if given in the options
				if (o.containment)
					this._setContainment();

				//Trigger event + callbacks
				if (this._trigger("start", event) === false) {
					this._clear();
					return false;
				}

				//Recache the helper size
				this._cacheHelperProportions();

				//Prepare the droppable offsets
				if ($.ui.ddmanager && !o.dropBehaviour)
					$.ui.ddmanager.prepareOffsets(this, event);


				this._mouseDrag(event, true); //Execute the drag once - this causes the helper not to be visible before getting its correct position

				//If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
				if ($.ui.ddmanager) $.ui.ddmanager.dragStart(this, event);

				return true;
			},

			_mouseDrag: function(event, noPropagation) {

				//Compute the helpers position
				this.position = this._generatePosition(event);
				this.positionAbs = this._convertPositionTo("absolute");

				//Call plugins and callbacks and use the resulting position if something is returned
				if (!noPropagation) {
					var ui = this._uiHash();
					if (this._trigger('drag', event, ui) === false) {
						this._mouseUp({});
						return false;
					}
					this.position = ui.position;
				}

				if (!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left + 'px';
				if (!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top + 'px';
				if ($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

				return false;
			},

			_mouseStop: function(event) {

				//If we are using droppables, inform the manager about the drop
				var dropped = false;
				if ($.ui.ddmanager && !this.options.dropBehaviour)
					dropped = $.ui.ddmanager.drop(this, event);

				//if a drop comes from outside (a sortable)
				if (this.dropped) {
					dropped = this.dropped;
					this.dropped = false;
				}

				//if the original element is no longer in the DOM don't bother to continue (see #8269)
				var element = this.element[0],
					elementInDom = false;
				while (element && (element = element.parentNode)) {
					if (element == document) {
						elementInDom = true;
					}
				}
				if (!elementInDom && this.options.helper === "original")
					return false;

				if ((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
					var that = this;
					$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
						if (that._trigger("stop", event) !== false) {
							that._clear();
						}
					});
				} else {
					if (this._trigger("stop", event) !== false) {
						this._clear();
					}
				}

				return false;
			},

			_mouseUp: function(event) {
				//Remove frame helpers
				$("div.ui-draggable-iframeFix").each(function() {
					this.parentNode.removeChild(this);
				});

				//If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
				if ($.ui.ddmanager) $.ui.ddmanager.dragStop(this, event);

				return $.ui.mouse.prototype._mouseUp.call(this, event);
			},

			cancel: function() {

				if (this.helper.is(".ui-draggable-dragging")) {
					this._mouseUp({});
				} else {
					this._clear();
				}

				return this;

			},

			_getHandle: function(event) {

				var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
				$(this.options.handle, this.element)
					.find("*")
					.andSelf()
					.each(function() {
						if (this == event.target) handle = true;
					});

				return handle;

			},

			_createHelper: function(event) {

				var o = this.options;
				var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone().removeAttr('id') : this.element);

				if (!helper.parents('body').length)
					helper.appendTo((o.appendTo == 'parent' ? this.element[0].parentNode : o.appendTo));

				if (helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position")))
					helper.css("position", "absolute");

				return helper;

			},

			_adjustOffsetFromHelper: function(obj) {
				if (typeof obj == 'string') {
					obj = obj.split(' ');
				}
				if ($.isArray(obj)) {
					obj = {
						left: +obj[0],
						top: +obj[1] || 0
					};
				}
				if ('left' in obj) {
					this.offset.click.left = obj.left + this.margins.left;
				}
				if ('right' in obj) {
					this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
				}
				if ('top' in obj) {
					this.offset.click.top = obj.top + this.margins.top;
				}
				if ('bottom' in obj) {
					this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
				}
			},

			_getParentOffset: function() {

				//Get the offsetParent and cache its position
				this.offsetParent = this.helper.offsetParent();
				var po = this.offsetParent.offset();

				// This is a special case where we need to modify a offset calculated on start, since the following happened:
				// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
				// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
				//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
				if (this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
					po.left += this.scrollParent.scrollLeft();
					po.top += this.scrollParent.scrollTop();
				}

				if ((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
					|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.ui.ie)) //Ugly IE fix
					po = {
						top: 0,
						left: 0
					};

				return {
					top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
					left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
				};

			},

			_getRelativeOffset: function() {

				if (this.cssPosition == "relative") {
					var p = this.element.position();
					return {
						top: p.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
						left: p.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
					};
				} else {
					return {
						top: 0,
						left: 0
					};
				}

			},

			_cacheMargins: function() {
				this.margins = {
					left: (parseInt(this.element.css("marginLeft"), 10) || 0),
					top: (parseInt(this.element.css("marginTop"), 10) || 0),
					right: (parseInt(this.element.css("marginRight"), 10) || 0),
					bottom: (parseInt(this.element.css("marginBottom"), 10) || 0)
				};
			},

			_cacheHelperProportions: function() {
				this.helperProportions = {
					width: this.helper.outerWidth(),
					height: this.helper.outerHeight()
				};
			},

			_setContainment: function() {

				var o = this.options;
				if (o.containment == 'parent') o.containment = this.helper[0].parentNode;
				if (o.containment == 'document' || o.containment == 'window') this.containment = [
					o.containment == 'document' ? 0 : $(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left,
					o.containment == 'document' ? 0 : $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, (o.containment == 'document' ? 0 : $(window).scrollLeft()) + $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left, (o.containment == 'document' ? 0 : $(window).scrollTop()) + ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
				];

				if (!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
					var c = $(o.containment);
					var ce = c[0];
					if (!ce) return;
					var co = c.offset();
					var over = ($(ce).css("overflow") != 'hidden');

					this.containment = [
						(parseInt($(ce).css("borderLeftWidth"), 10) || 0) + (parseInt($(ce).css("paddingLeft"), 10) || 0), (parseInt($(ce).css("borderTopWidth"), 10) || 0) + (parseInt($(ce).css("paddingTop"), 10) || 0), (over ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"), 10) || 0) - (parseInt($(ce).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (over ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"), 10) || 0) - (parseInt($(ce).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom
					];
					this.relative_container = c;

				} else if (o.containment.constructor == Array) {
					this.containment = o.containment;
				}

			},

			_convertPositionTo: function(d, pos) {

				if (!pos) pos = this.position;
				var mod = d == "absolute" ? 1 : -1;
				var o = this.options,
					scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
					scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

				return {
					top: (
						pos.top // The absolute mouse position
						+ this.offset.relative.top * mod // Only for relative positioned nodes: Relative offset from element to offset parent
						+ this.offset.parent.top * mod // The offsetParent's offset without borders (offset + border)
						- ((this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : (scrollIsRootNode ? 0 : scroll.scrollTop())) * mod)
					),
					left: (
						pos.left // The absolute mouse position
						+ this.offset.relative.left * mod // Only for relative positioned nodes: Relative offset from element to offset parent
						+ this.offset.parent.left * mod // The offsetParent's offset without borders (offset + border)
						- ((this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft()) * mod)
					)
				};

			},

			_generatePosition: function(event) {

				var o = this.options,
					scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
					scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
				var pageX = event.pageX;
				var pageY = event.pageY;

				/*
				 * - Position constraining -
				 * Constrain the position to a mix of grid, containment.
				 */

				if (this.originalPosition) { //If we are not dragging yet, we won't check for options
					var containment;
					if (this.containment) {
						if (this.relative_container) {
							var co = this.relative_container.offset();
							containment = [this.containment[0] + co.left,
								this.containment[1] + co.top,
								this.containment[2] + co.left,
								this.containment[3] + co.top
							];
						} else {
							containment = this.containment;
						}

						if (event.pageX - this.offset.click.left < containment[0]) pageX = containment[0] + this.offset.click.left;
						if (event.pageY - this.offset.click.top < containment[1]) pageY = containment[1] + this.offset.click.top;
						if (event.pageX - this.offset.click.left > containment[2]) pageX = containment[2] + this.offset.click.left;
						if (event.pageY - this.offset.click.top > containment[3]) pageY = containment[3] + this.offset.click.top;
					}

					if (o.grid) {
						//Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
						var top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
						pageY = containment ? (!(top - this.offset.click.top < containment[1] || top - this.offset.click.top > containment[3]) ? top : (!(top - this.offset.click.top < containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

						var left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
						pageX = containment ? (!(left - this.offset.click.left < containment[0] || left - this.offset.click.left > containment[2]) ? left : (!(left - this.offset.click.left < containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
					}

				}

				return {
					top: (
						pageY // The absolute mouse position
						- this.offset.click.top // Click offset (relative to the element)
						- this.offset.relative.top // Only for relative positioned nodes: Relative offset from element to offset parent
						- this.offset.parent.top // The offsetParent's offset without borders (offset + border)
						+ ((this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : (scrollIsRootNode ? 0 : scroll.scrollTop())))
					),
					left: (
						pageX // The absolute mouse position
						- this.offset.click.left // Click offset (relative to the element)
						- this.offset.relative.left // Only for relative positioned nodes: Relative offset from element to offset parent
						- this.offset.parent.left // The offsetParent's offset without borders (offset + border)
						+ ((this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft()))
					)
				};

			},

			_clear: function() {
				this.helper.removeClass("ui-draggable-dragging");
				if (this.helper[0] != this.element[0] && !this.cancelHelperRemoval) this.helper.remove();
				//if($.ui.ddmanager) $.ui.ddmanager.current = null;
				this.helper = null;
				this.cancelHelperRemoval = false;
			},

			// From now on bulk stuff - mainly helpers

			_trigger: function(type, event, ui) {
				ui = ui || this._uiHash();
				$.ui.plugin.call(this, type, [event, ui]);
				if (type == "drag") this.positionAbs = this._convertPositionTo("absolute"); //The absolute position has to be recalculated after plugins
				return $.Widget.prototype._trigger.call(this, type, event, ui);
			},

			plugins: {},

			_uiHash: function(event) {
				return {
					helper: this.helper,
					position: this.position,
					originalPosition: this.originalPosition,
					offset: this.positionAbs
				};
			}

		});

		$.ui.plugin.add("draggable", "connectToSortable", {
			start: function(event, ui) {

				var inst = $(this).data("draggable"),
					o = inst.options,
					uiSortable = $.extend({}, ui, {
						item: inst.element
					});
				inst.sortables = [];
				$(o.connectToSortable).each(function() {
					var sortable = $.data(this, 'sortable');
					if (sortable && !sortable.options.disabled) {
						inst.sortables.push({
							instance: sortable,
							shouldRevert: sortable.options.revert
						});
						sortable.refreshPositions(); // Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
						sortable._trigger("activate", event, uiSortable);
					}
				});

			},
			stop: function(event, ui) {

				//If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
				var inst = $(this).data("draggable"),
					uiSortable = $.extend({}, ui, {
						item: inst.element
					});

				$.each(inst.sortables, function() {
					if (this.instance.isOver) {

						this.instance.isOver = 0;

						inst.cancelHelperRemoval = true; //Don't remove the helper in the draggable instance
						this.instance.cancelHelperRemoval = false; //Remove it in the sortable instance (so sortable plugins like revert still work)

						//The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: 'valid/invalid'
						if (this.shouldRevert) this.instance.options.revert = true;

						//Trigger the stop of the sortable
						this.instance._mouseStop(event);

						this.instance.options.helper = this.instance.options._helper;

						//If the helper has been the original item, restore properties in the sortable
						if (inst.options.helper == 'original')
							this.instance.currentItem.css({
								top: 'auto',
								left: 'auto'
							});

					} else {
						this.instance.cancelHelperRemoval = false; //Remove the helper in the sortable instance
						this.instance._trigger("deactivate", event, uiSortable);
					}

				});

			},
			drag: function(event, ui) {

				var inst = $(this).data("draggable"),
					that = this;

				var checkPos = function(o) {
					var dyClick = this.offset.click.top,
						dxClick = this.offset.click.left;
					var helperTop = this.positionAbs.top,
						helperLeft = this.positionAbs.left;
					var itemHeight = o.height,
						itemWidth = o.width;
					var itemTop = o.top,
						itemLeft = o.left;

					return $.ui.isOver(helperTop + dyClick, helperLeft + dxClick, itemTop, itemLeft, itemHeight, itemWidth);
				};

				$.each(inst.sortables, function(i) {

					var innermostIntersecting = false;
					var thisSortable = this;
					//Copy over some variables to allow calling the sortable's native _intersectsWith
					this.instance.positionAbs = inst.positionAbs;
					this.instance.helperProportions = inst.helperProportions;
					this.instance.offset.click = inst.offset.click;

					if (this.instance._intersectsWith(this.instance.containerCache)) {
						innermostIntersecting = true;
						$.each(inst.sortables, function() {
							this.instance.positionAbs = inst.positionAbs;
							this.instance.helperProportions = inst.helperProportions;
							this.instance.offset.click = inst.offset.click;
							if (this != thisSortable && this.instance._intersectsWith(this.instance.containerCache) && $.ui.contains(thisSortable.instance.element[0], this.instance.element[0]))
								innermostIntersecting = false;
							return innermostIntersecting;
						});
					}


					if (innermostIntersecting) {
						//If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
						if (!this.instance.isOver) {

							this.instance.isOver = 1;
							//Now we fake the start of dragging for the sortable instance,
							//by cloning the list group item, appending it to the sortable and using it as inst.currentItem
							//We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
							this.instance.currentItem = $(that).clone().removeAttr('id').appendTo(this.instance.element).data("sortable-item", true);
							this.instance.options._helper = this.instance.options.helper; //Store helper option to later restore it
							this.instance.options.helper = function() {
								return ui.helper[0];
							};

							event.target = this.instance.currentItem[0];
							this.instance._mouseCapture(event, true);
							this.instance._mouseStart(event, true, true);

							//Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
							this.instance.offset.click.top = inst.offset.click.top;
							this.instance.offset.click.left = inst.offset.click.left;
							this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
							this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

							inst._trigger("toSortable", event);
							inst.dropped = this.instance.element; //draggable revert needs that
							//hack so receive/update callbacks work (mostly)
							inst.currentItem = inst.element;
							this.instance.fromOutside = inst;

						}

						//Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
						if (this.instance.currentItem) this.instance._mouseDrag(event);

					} else {

						//If it doesn't intersect with the sortable, and it intersected before,
						//we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
						if (this.instance.isOver) {

							this.instance.isOver = 0;
							this.instance.cancelHelperRemoval = true;

							//Prevent reverting on this forced stop
							this.instance.options.revert = false;

							// The out event needs to be triggered independently
							this.instance._trigger('out', event, this.instance._uiHash(this.instance));

							this.instance._mouseStop(event, true);
							this.instance.options.helper = this.instance.options._helper;

							//Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
							this.instance.currentItem.remove();
							if (this.instance.placeholder) this.instance.placeholder.remove();

							inst._trigger("fromSortable", event);
							inst.dropped = false; //draggable revert needs that
						}

					};

				});

			}
		});

		$.ui.plugin.add("draggable", "cursor", {
			start: function(event, ui) {
				var t = $('body'),
					o = $(this).data('draggable').options;
				if (t.css("cursor")) o._cursor = t.css("cursor");
				t.css("cursor", o.cursor);
			},
			stop: function(event, ui) {
				var o = $(this).data('draggable').options;
				if (o._cursor) $('body').css("cursor", o._cursor);
			}
		});

		$.ui.plugin.add("draggable", "opacity", {
			start: function(event, ui) {
				var t = $(ui.helper),
					o = $(this).data('draggable').options;
				if (t.css("opacity")) o._opacity = t.css("opacity");
				t.css('opacity', o.opacity);
			},
			stop: function(event, ui) {
				var o = $(this).data('draggable').options;
				if (o._opacity) $(ui.helper).css('opacity', o._opacity);
			}
		});

		$.ui.plugin.add("draggable", "scroll", {
			start: function(event, ui) {
				var i = $(this).data("draggable");
				if (i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') i.overflowOffset = i.scrollParent.offset();
			},
			drag: function(event, ui) {

				var i = $(this).data("draggable"),
					o = i.options,
					scrolled = false;

				if (i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {

					if (!o.axis || o.axis != 'x') {
						if ((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
							i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
						else if (event.pageY - i.overflowOffset.top < o.scrollSensitivity)
							i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
					}

					if (!o.axis || o.axis != 'y') {
						if ((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
							i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
						else if (event.pageX - i.overflowOffset.left < o.scrollSensitivity)
							i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
					}

				} else {

					if (!o.axis || o.axis != 'x') {
						if (event.pageY - $(document).scrollTop() < o.scrollSensitivity)
							scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
						else if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
							scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
					}

					if (!o.axis || o.axis != 'y') {
						if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
							scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
						else if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
							scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
					}

				}

				if (scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
					$.ui.ddmanager.prepareOffsets(i, event);

			}
		});

		$.ui.plugin.add("draggable", "snap", {
			start: function(event, ui) {

				var i = $(this).data("draggable"),
					o = i.options;
				i.snapElements = [];

				$(o.snap.constructor != String ? (o.snap.items || ':data(draggable)') : o.snap).each(function() {
					var $t = $(this);
					var $o = $t.offset();
					if (this != i.element[0]) i.snapElements.push({
						item: this,
						width: $t.outerWidth(),
						height: $t.outerHeight(),
						top: $o.top,
						left: $o.left
					});
				});

			},
			drag: function(event, ui) {

				var inst = $(this).data("draggable"),
					o = inst.options;
				var d = o.snapTolerance;

				var x1 = ui.offset.left,
					x2 = x1 + inst.helperProportions.width,
					y1 = ui.offset.top,
					y2 = y1 + inst.helperProportions.height;

				for (var i = inst.snapElements.length - 1; i >= 0; i--) {

					var l = inst.snapElements[i].left,
						r = l + inst.snapElements[i].width,
						t = inst.snapElements[i].top,
						b = t + inst.snapElements[i].height;

					//Yes, I know, this is insane ;)
					if (!((l - d < x1 && x1 < r + d && t - d < y1 && y1 < b + d) || (l - d < x1 && x1 < r + d && t - d < y2 && y2 < b + d) || (l - d < x2 && x2 < r + d && t - d < y1 && y1 < b + d) || (l - d < x2 && x2 < r + d && t - d < y2 && y2 < b + d))) {
						if (inst.snapElements[i].snapping)(inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), {
							snapItem: inst.snapElements[i].item
						})));
						inst.snapElements[i].snapping = false;
						continue;
					}

					if (o.snapMode != 'inner') {
						var ts = Math.abs(t - y2) <= d;
						var bs = Math.abs(b - y1) <= d;
						var ls = Math.abs(l - x2) <= d;
						var rs = Math.abs(r - x1) <= d;
						if (ts) ui.position.top = inst._convertPositionTo("relative", {
							top: t - inst.helperProportions.height,
							left: 0
						}).top - inst.margins.top;
						if (bs) ui.position.top = inst._convertPositionTo("relative", {
							top: b,
							left: 0
						}).top - inst.margins.top;
						if (ls) ui.position.left = inst._convertPositionTo("relative", {
							top: 0,
							left: l - inst.helperProportions.width
						}).left - inst.margins.left;
						if (rs) ui.position.left = inst._convertPositionTo("relative", {
							top: 0,
							left: r
						}).left - inst.margins.left;
					}

					var first = (ts || bs || ls || rs);

					if (o.snapMode != 'outer') {
						var ts = Math.abs(t - y1) <= d;
						var bs = Math.abs(b - y2) <= d;
						var ls = Math.abs(l - x1) <= d;
						var rs = Math.abs(r - x2) <= d;
						if (ts) ui.position.top = inst._convertPositionTo("relative", {
							top: t,
							left: 0
						}).top - inst.margins.top;
						if (bs) ui.position.top = inst._convertPositionTo("relative", {
							top: b - inst.helperProportions.height,
							left: 0
						}).top - inst.margins.top;
						if (ls) ui.position.left = inst._convertPositionTo("relative", {
							top: 0,
							left: l
						}).left - inst.margins.left;
						if (rs) ui.position.left = inst._convertPositionTo("relative", {
							top: 0,
							left: r - inst.helperProportions.width
						}).left - inst.margins.left;
					}

					if (!inst.snapElements[i].snapping && (ts || bs || ls || rs || first))
						(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), {
							snapItem: inst.snapElements[i].item
						})));
					inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

				};

			}
		});

		$.ui.plugin.add("draggable", "stack", {
			start: function(event, ui) {

				var o = $(this).data("draggable").options;

				var group = $.makeArray($(o.stack)).sort(function(a, b) {
					return (parseInt($(a).css("zIndex"), 10) || 0) - (parseInt($(b).css("zIndex"), 10) || 0);
				});
				if (!group.length) {
					return;
				}

				var min = parseInt(group[0].style.zIndex) || 0;
				$(group).each(function(i) {
					this.style.zIndex = min + i;
				});

				this[0].style.zIndex = min + group.length;

			}
		});

		$.ui.plugin.add("draggable", "zIndex", {
			start: function(event, ui) {
				var t = $(ui.helper),
					o = $(this).data("draggable").options;
				if (t.css("zIndex")) o._zIndex = t.css("zIndex");
				t.css('zIndex', o.zIndex);
			},
			stop: function(event, ui) {
				var o = $(this).data("draggable").options;
				if (o._zIndex) $(ui.helper).css('zIndex', o._zIndex);
			}
		});

	})(jQuery);
	(function($, undefined) {

		$.widget("ui.droppable", {
			version: "1.9.1",
			widgetEventPrefix: "drop",
			options: {
				accept: '*',
				activeClass: false,
				addClasses: true,
				greedy: false,
				hoverClass: false,
				scope: 'default',
				tolerance: 'intersect'
			},
			_create: function() {

				var o = this.options,
					accept = o.accept;
				this.isover = 0;
				this.isout = 1;

				this.accept = $.isFunction(accept) ? accept : function(d) {
					return d.is(accept);
				};

				//Store the droppable's proportions
				this.proportions = {
					width: this.element[0].offsetWidth,
					height: this.element[0].offsetHeight
				};

				// Add the reference and positions to the manager
				$.ui.ddmanager.droppables[o.scope] = $.ui.ddmanager.droppables[o.scope] || [];
				$.ui.ddmanager.droppables[o.scope].push(this);

				(o.addClasses && this.element.addClass("ui-droppable"));

			},

			_destroy: function() {
				var drop = $.ui.ddmanager.droppables[this.options.scope];
				for (var i = 0; i < drop.length; i++)
					if (drop[i] == this)
						drop.splice(i, 1);

				this.element.removeClass("ui-droppable ui-droppable-disabled");
			},

			_setOption: function(key, value) {

				if (key == 'accept') {
					this.accept = $.isFunction(value) ? value : function(d) {
						return d.is(value);
					};
				}
				$.Widget.prototype._setOption.apply(this, arguments);
			},

			_activate: function(event) {
				var draggable = $.ui.ddmanager.current;
				if (this.options.activeClass) this.element.addClass(this.options.activeClass);
				(draggable && this._trigger('activate', event, this.ui(draggable)));
			},

			_deactivate: function(event) {
				var draggable = $.ui.ddmanager.current;
				if (this.options.activeClass) this.element.removeClass(this.options.activeClass);
				(draggable && this._trigger('deactivate', event, this.ui(draggable)));
			},

			_over: function(event) {

				var draggable = $.ui.ddmanager.current;
				if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

				if (this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {
					if (this.options.hoverClass) this.element.addClass(this.options.hoverClass);
					this._trigger('over', event, this.ui(draggable));
				}

			},

			_out: function(event) {

				var draggable = $.ui.ddmanager.current;
				if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return; // Bail if draggable and droppable are same element

				if (this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {
					if (this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
					this._trigger('out', event, this.ui(draggable));
				}

			},

			_drop: function(event, custom) {

				var draggable = custom || $.ui.ddmanager.current;
				if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0]) return false; // Bail if draggable and droppable are same element

				var childrenIntersection = false;
				this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function() {
					var inst = $.data(this, 'droppable');
					if (
						inst.options.greedy && !inst.options.disabled && inst.options.scope == draggable.options.scope && inst.accept.call(inst.element[0], (draggable.currentItem || draggable.element)) && $.ui.intersect(draggable, $.extend(inst, {
							offset: inst.element.offset()
						}), inst.options.tolerance)
					) {
						childrenIntersection = true;
						return false;
					}
				});
				if (childrenIntersection) return false;

				if (this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {
					if (this.options.activeClass) this.element.removeClass(this.options.activeClass);
					if (this.options.hoverClass) this.element.removeClass(this.options.hoverClass);
					this._trigger('drop', event, this.ui(draggable));
					return this.element;
				}

				return false;

			},

			ui: function(c) {
				return {
					draggable: (c.currentItem || c.element),
					helper: c.helper,
					position: c.position,
					offset: c.positionAbs
				};
			}

		});

		$.ui.intersect = function(draggable, droppable, toleranceMode) {

			if (!droppable.offset) return false;

			var x1 = (draggable.positionAbs || draggable.position.absolute).left,
				x2 = x1 + draggable.helperProportions.width,
				y1 = (draggable.positionAbs || draggable.position.absolute).top,
				y2 = y1 + draggable.helperProportions.height;
			var l = droppable.offset.left,
				r = l + droppable.proportions.width,
				t = droppable.offset.top,
				b = t + droppable.proportions.height;

			switch (toleranceMode) {
				case 'fit':
					return (l <= x1 && x2 <= r && t <= y1 && y2 <= b);
					break;
				case 'intersect':
					return (l < x1 + (draggable.helperProportions.width / 2) // Right Half
						&& x2 - (draggable.helperProportions.width / 2) < r // Left Half
						&& t < y1 + (draggable.helperProportions.height / 2) // Bottom Half
						&& y2 - (draggable.helperProportions.height / 2) < b); // Top Half
					break;
				case 'pointer':
					var draggableLeft = ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left),
						draggableTop = ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top),
						isOver = $.ui.isOver(draggableTop, draggableLeft, t, l, droppable.proportions.height, droppable.proportions.width);
					return isOver;
					break;
				case 'touch':
					return (
						(y1 >= t && y1 <= b) || // Top edge touching
						(y2 >= t && y2 <= b) || // Bottom edge touching
						(y1 < t && y2 > b) // Surrounded vertically
					) && (
						(x1 >= l && x1 <= r) || // Left edge touching
						(x2 >= l && x2 <= r) || // Right edge touching
						(x1 < l && x2 > r) // Surrounded horizontally
					);
					break;
				default:
					return false;
					break;
			}

		};

		/*
	This manager tracks offsets of draggables and droppables
*/
		$.ui.ddmanager = {
			current: null,
			droppables: {
				'default': []
			},
			prepareOffsets: function(t, event) {

				var m = $.ui.ddmanager.droppables[t.options.scope] || [];
				var type = event ? event.type : null; // workaround for #2317
				var list = (t.currentItem || t.element).find(":data(droppable)").andSelf();

				droppablesLoop: for (var i = 0; i < m.length; i++) {

					if (m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0], (t.currentItem || t.element)))) continue; //No disabled and non-accepted
					for (var j = 0; j < list.length; j++) {
						if (list[j] == m[i].element[0]) {
							m[i].proportions.height = 0;
							continue droppablesLoop;
						}
					}; //Filter out elements in the current dragged item
					m[i].visible = m[i].element.css("display") != "none";
					if (!m[i].visible) continue; //If the element is not visible, continue

					if (type == "mousedown") m[i]._activate.call(m[i], event); //Activate the droppable if used directly from draggables

					m[i].offset = m[i].element.offset();
					m[i].proportions = {
						width: m[i].element[0].offsetWidth,
						height: m[i].element[0].offsetHeight
					};

				}

			},
			drop: function(draggable, event) {

				var dropped = false;
				$.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {

					if (!this.options) return;
					if (!this.options.disabled && this.visible && $.ui.intersect(draggable, this, this.options.tolerance))
						dropped = this._drop.call(this, event) || dropped;

					if (!this.options.disabled && this.visible && this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {
						this.isout = 1;
						this.isover = 0;
						this._deactivate.call(this, event);
					}

				});
				return dropped;

			},
			dragStart: function(draggable, event) {
				//Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)
				draggable.element.parentsUntil("body").bind("scroll.droppable", function() {
					if (!draggable.options.refreshPositions) $.ui.ddmanager.prepareOffsets(draggable, event);
				});
			},
			drag: function(draggable, event) {

				//If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
				if (draggable.options.refreshPositions) $.ui.ddmanager.prepareOffsets(draggable, event);

				//Run through all droppables and check their positions based on specific tolerance options
				$.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {

					if (this.options.disabled || this.greedyChild || !this.visible) return;
					var intersects = $.ui.intersect(draggable, this, this.options.tolerance);

					var c = !intersects && this.isover == 1 ? 'isout' : (intersects && this.isover == 0 ? 'isover' : null);
					if (!c) return;

					var parentInstance;
					if (this.options.greedy) {
						// find droppable parents with same scope
						var scope = this.options.scope;
						var parent = this.element.parents(':data(droppable)').filter(function() {
							return $.data(this, 'droppable').options.scope === scope;
						});

						if (parent.length) {
							parentInstance = $.data(parent[0], 'droppable');
							parentInstance.greedyChild = (c == 'isover' ? 1 : 0);
						}
					}

					// we just moved into a greedy child
					if (parentInstance && c == 'isover') {
						parentInstance['isover'] = 0;
						parentInstance['isout'] = 1;
						parentInstance._out.call(parentInstance, event);
					}

					this[c] = 1;
					this[c == 'isout' ? 'isover' : 'isout'] = 0;
					this[c == "isover" ? "_over" : "_out"].call(this, event);

					// we just moved out of a greedy child
					if (parentInstance && c == 'isout') {
						parentInstance['isout'] = 0;
						parentInstance['isover'] = 1;
						parentInstance._over.call(parentInstance, event);
					}
				});

			},
			dragStop: function(draggable, event) {
				draggable.element.parentsUntil("body").unbind("scroll.droppable");
				//Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)
				if (!draggable.options.refreshPositions) $.ui.ddmanager.prepareOffsets(draggable, event);
			}
		};

	})(jQuery);
	(function($, undefined) {

		$.widget("ui.resizable", $.ui.mouse, {
			version: "1.9.1",
			widgetEventPrefix: "resize",
			options: {
				alsoResize: false,
				animate: false,
				animateDuration: "slow",
				animateEasing: "swing",
				aspectRatio: false,
				autoHide: false,
				containment: false,
				ghost: false,
				grid: false,
				handles: "e,s,se",
				helper: false,
				maxHeight: null,
				maxWidth: null,
				minHeight: 10,
				minWidth: 10,
				zIndex: 1000
			},
			_create: function() {

				var that = this,
					o = this.options;
				this.element.addClass("ui-resizable");

				$.extend(this, {
					_aspectRatio: !! (o.aspectRatio),
					aspectRatio: o.aspectRatio,
					originalElement: this.element,
					_proportionallyResizeElements: [],
					_helper: o.helper || o.ghost || o.animate ? o.helper || 'ui-resizable-helper' : null
				});

				//Wrap the element if it cannot hold child nodes
				if (this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i)) {

					//Create a wrapper element and set the wrapper to the new current internal element
					this.element.wrap(
						$('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({
							position: this.element.css('position'),
							width: this.element.outerWidth(),
							height: this.element.outerHeight(),
							top: this.element.css('top'),
							left: this.element.css('left')
						})
					);

					//Overwrite the original this.element
					this.element = this.element.parent().data(
						"resizable", this.element.data('resizable')
					);

					this.elementIsWrapper = true;

					//Move margins to the wrapper
					this.element.css({
						marginLeft: this.originalElement.css("marginLeft"),
						marginTop: this.originalElement.css("marginTop"),
						marginRight: this.originalElement.css("marginRight"),
						marginBottom: this.originalElement.css("marginBottom")
					});
					this.originalElement.css({
						marginLeft: 0,
						marginTop: 0,
						marginRight: 0,
						marginBottom: 0
					});

					//Prevent Safari textarea resize
					this.originalResizeStyle = this.originalElement.css('resize');
					this.originalElement.css('resize', 'none');

					//Push the actual element to our proportionallyResize internal array
					this._proportionallyResizeElements.push(this.originalElement.css({
						position: 'static',
						zoom: 1,
						display: 'block'
					}));

					// avoid IE jump (hard set the margin)
					this.originalElement.css({
						margin: this.originalElement.css('margin')
					});

					// fix handlers offset
					this._proportionallyResize();

				}

				this.handles = o.handles || (!$('.ui-resizable-handle', this.element).length ? "e,s,se" : {
					n: '.ui-resizable-n',
					e: '.ui-resizable-e',
					s: '.ui-resizable-s',
					w: '.ui-resizable-w',
					se: '.ui-resizable-se',
					sw: '.ui-resizable-sw',
					ne: '.ui-resizable-ne',
					nw: '.ui-resizable-nw'
				});
				if (this.handles.constructor == String) {

					if (this.handles == 'all') this.handles = 'n,e,s,w,se,sw,ne,nw';
					var n = this.handles.split(",");
					this.handles = {};

					for (var i = 0; i < n.length; i++) {

						var handle = $.trim(n[i]),
							hname = 'ui-resizable-' + handle;
						var axis = $('<div class="ui-resizable-handle ' + hname + '"></div>');

						// Apply zIndex to all handles - see #7960
						axis.css({
							zIndex: o.zIndex
						});

						//TODO : What's going on here?
						if ('se' == handle) {
							axis.addClass('ui-icon ui-icon-gripsmall-diagonal-se');
						};

						//Insert into internal handles object and append to element
						this.handles[handle] = '.ui-resizable-' + handle;
						this.element.append(axis);
					}

				}

				this._renderAxis = function(target) {

					target = target || this.element;

					for (var i in this.handles) {

						if (this.handles[i].constructor == String)
							this.handles[i] = $(this.handles[i], this.element).show();

						//Apply pad to wrapper element, needed to fix axis position (textarea, inputs, scrolls)
						if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {

							var axis = $(this.handles[i], this.element),
								padWrapper = 0;

							//Checking the correct pad and border
							padWrapper = /sw|ne|nw|se|n|s/.test(i) ? axis.outerHeight() : axis.outerWidth();

							//The padding type i have to apply...
							var padPos = ['padding',
								/ne|nw|n/.test(i) ? 'Top' :
								/se|sw|s/.test(i) ? 'Bottom' :
								/^e$/.test(i) ? 'Right' : 'Left'
							].join("");

							target.css(padPos, padWrapper);

							this._proportionallyResize();

						}

						//TODO: What's that good for? There's not anything to be executed left
						if (!$(this.handles[i]).length)
							continue;

					}
				};

				//TODO: make renderAxis a prototype function
				this._renderAxis(this.element);

				this._handles = $('.ui-resizable-handle', this.element)
					.disableSelection();

				//Matching axis name
				this._handles.mouseover(function() {
					if (!that.resizing) {
						if (this.className)
							var axis = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
						//Axis, default = se
						that.axis = axis && axis[1] ? axis[1] : 'se';
					}
				});

				//If we want to auto hide the elements
				if (o.autoHide) {
					this._handles.hide();
					$(this.element)
						.addClass("ui-resizable-autohide")
						.mouseenter(function() {
							if (o.disabled) return;
							$(this).removeClass("ui-resizable-autohide");
							that._handles.show();
						})
						.mouseleave(function() {
							if (o.disabled) return;
							if (!that.resizing) {
								$(this).addClass("ui-resizable-autohide");
								that._handles.hide();
							}
						});
				}

				//Initialize the mouse interaction
				this._mouseInit();

			},

			_destroy: function() {

				this._mouseDestroy();

				var _destroy = function(exp) {
					$(exp).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing")
						.removeData("resizable").removeData("ui-resizable").unbind(".resizable").find('.ui-resizable-handle').remove();
				};

				//TODO: Unwrap at same DOM position
				if (this.elementIsWrapper) {
					_destroy(this.element);
					var wrapper = this.element;
					this.originalElement.css({
						position: wrapper.css('position'),
						width: wrapper.outerWidth(),
						height: wrapper.outerHeight(),
						top: wrapper.css('top'),
						left: wrapper.css('left')
					}).insertAfter(wrapper);
					wrapper.remove();
				}

				this.originalElement.css('resize', this.originalResizeStyle);
				_destroy(this.originalElement);

				return this;
			},

			_mouseCapture: function(event) {
				var handle = false;
				for (var i in this.handles) {
					if ($(this.handles[i])[0] == event.target) {
						handle = true;
					}
				}

				return !this.options.disabled && handle;
			},

			_mouseStart: function(event) {

				var o = this.options,
					iniPos = this.element.position(),
					el = this.element;

				this.resizing = true;
				this.documentScroll = {
					top: $(document).scrollTop(),
					left: $(document).scrollLeft()
				};

				// bugfix for http://dev.jquery.com/ticket/1749
				if (el.is('.ui-draggable') || (/absolute/).test(el.css('position'))) {
					el.css({
						position: 'absolute',
						top: iniPos.top,
						left: iniPos.left
					});
				}

				this._renderProxy();

				var curleft = num(this.helper.css('left')),
					curtop = num(this.helper.css('top'));

				if (o.containment) {
					curleft += $(o.containment).scrollLeft() || 0;
					curtop += $(o.containment).scrollTop() || 0;
				}

				//Store needed variables
				this.offset = this.helper.offset();
				this.position = {
					left: curleft,
					top: curtop
				};
				this.size = this._helper ? {
					width: el.outerWidth(),
					height: el.outerHeight()
				} : {
					width: el.width(),
					height: el.height()
				};
				this.originalSize = this._helper ? {
					width: el.outerWidth(),
					height: el.outerHeight()
				} : {
					width: el.width(),
					height: el.height()
				};
				this.originalPosition = {
					left: curleft,
					top: curtop
				};
				this.sizeDiff = {
					width: el.outerWidth() - el.width(),
					height: el.outerHeight() - el.height()
				};
				this.originalMousePosition = {
					left: event.pageX,
					top: event.pageY
				};

				//Aspect Ratio
				this.aspectRatio = (typeof o.aspectRatio == 'number') ? o.aspectRatio : ((this.originalSize.width / this.originalSize.height) || 1);

				var cursor = $('.ui-resizable-' + this.axis).css('cursor');
				$('body').css('cursor', cursor == 'auto' ? this.axis + '-resize' : cursor);

				el.addClass("ui-resizable-resizing");
				this._propagate("start", event);
				return true;
			},

			_mouseDrag: function(event) {

				//Increase performance, avoid regex
				var el = this.helper,
					o = this.options,
					props = {},
					that = this,
					smp = this.originalMousePosition,
					a = this.axis;

				var dx = (event.pageX - smp.left) || 0,
					dy = (event.pageY - smp.top) || 0;
				var trigger = this._change[a];
				if (!trigger) return false;

				// Calculate the attrs that will be change
				var data = trigger.apply(this, [event, dx, dy]);

				// Put this in the mouseDrag handler since the user can start pressing shift while resizing
				this._updateVirtualBoundaries(event.shiftKey);
				if (this._aspectRatio || event.shiftKey)
					data = this._updateRatio(data, event);

				data = this._respectSize(data, event);

				// plugins callbacks need to be called first
				this._propagate("resize", event);

				el.css({
					top: this.position.top + "px",
					left: this.position.left + "px",
					width: this.size.width + "px",
					height: this.size.height + "px"
				});

				if (!this._helper && this._proportionallyResizeElements.length)
					this._proportionallyResize();

				this._updateCache(data);

				// calling the user callback at the end
				this._trigger('resize', event, this.ui());

				return false;
			},

			_mouseStop: function(event) {

				this.resizing = false;
				var o = this.options,
					that = this;

				if (this._helper) {
					var pr = this._proportionallyResizeElements,
						ista = pr.length && (/textarea/i).test(pr[0].nodeName),
						soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : that.sizeDiff.height,
						soffsetw = ista ? 0 : that.sizeDiff.width;

					var s = {
						width: (that.helper.width() - soffsetw),
						height: (that.helper.height() - soffseth)
					},
						left = (parseInt(that.element.css('left'), 10) + (that.position.left - that.originalPosition.left)) || null,
						top = (parseInt(that.element.css('top'), 10) + (that.position.top - that.originalPosition.top)) || null;

					if (!o.animate)
						this.element.css($.extend(s, {
							top: top,
							left: left
						}));

					that.helper.height(that.size.height);
					that.helper.width(that.size.width);

					if (this._helper && !o.animate) this._proportionallyResize();
				}

				$('body').css('cursor', 'auto');

				this.element.removeClass("ui-resizable-resizing");

				this._propagate("stop", event);

				if (this._helper) this.helper.remove();
				return false;

			},

			_updateVirtualBoundaries: function(forceAspectRatio) {
				var o = this.options,
					pMinWidth, pMaxWidth, pMinHeight, pMaxHeight, b;

				b = {
					minWidth: isNumber(o.minWidth) ? o.minWidth : 0,
					maxWidth: isNumber(o.maxWidth) ? o.maxWidth : Infinity,
					minHeight: isNumber(o.minHeight) ? o.minHeight : 0,
					maxHeight: isNumber(o.maxHeight) ? o.maxHeight : Infinity
				};

				if (this._aspectRatio || forceAspectRatio) {
					// We want to create an enclosing box whose aspect ration is the requested one
					// First, compute the "projected" size for each dimension based on the aspect ratio and other dimension
					pMinWidth = b.minHeight * this.aspectRatio;
					pMinHeight = b.minWidth / this.aspectRatio;
					pMaxWidth = b.maxHeight * this.aspectRatio;
					pMaxHeight = b.maxWidth / this.aspectRatio;

					if (pMinWidth > b.minWidth) b.minWidth = pMinWidth;
					if (pMinHeight > b.minHeight) b.minHeight = pMinHeight;
					if (pMaxWidth < b.maxWidth) b.maxWidth = pMaxWidth;
					if (pMaxHeight < b.maxHeight) b.maxHeight = pMaxHeight;
				}
				this._vBoundaries = b;
			},

			_updateCache: function(data) {
				var o = this.options;
				this.offset = this.helper.offset();
				if (isNumber(data.left)) this.position.left = data.left;
				if (isNumber(data.top)) this.position.top = data.top;
				if (isNumber(data.height)) this.size.height = data.height;
				if (isNumber(data.width)) this.size.width = data.width;
			},

			_updateRatio: function(data, event) {

				var o = this.options,
					cpos = this.position,
					csize = this.size,
					a = this.axis;

				if (isNumber(data.height)) data.width = (data.height * this.aspectRatio);
				else if (isNumber(data.width)) data.height = (data.width / this.aspectRatio);

				if (a == 'sw') {
					data.left = cpos.left + (csize.width - data.width);
					data.top = null;
				}
				if (a == 'nw') {
					data.top = cpos.top + (csize.height - data.height);
					data.left = cpos.left + (csize.width - data.width);
				}

				return data;
			},

			_respectSize: function(data, event) {

				var el = this.helper,
					o = this._vBoundaries,
					pRatio = this._aspectRatio || event.shiftKey,
					a = this.axis,
					ismaxw = isNumber(data.width) && o.maxWidth && (o.maxWidth < data.width),
					ismaxh = isNumber(data.height) && o.maxHeight && (o.maxHeight < data.height),
					isminw = isNumber(data.width) && o.minWidth && (o.minWidth > data.width),
					isminh = isNumber(data.height) && o.minHeight && (o.minHeight > data.height);

				if (isminw) data.width = o.minWidth;
				if (isminh) data.height = o.minHeight;
				if (ismaxw) data.width = o.maxWidth;
				if (ismaxh) data.height = o.maxHeight;

				var dw = this.originalPosition.left + this.originalSize.width,
					dh = this.position.top + this.size.height;
				var cw = /sw|nw|w/.test(a),
					ch = /nw|ne|n/.test(a);

				if (isminw && cw) data.left = dw - o.minWidth;
				if (ismaxw && cw) data.left = dw - o.maxWidth;
				if (isminh && ch) data.top = dh - o.minHeight;
				if (ismaxh && ch) data.top = dh - o.maxHeight;

				// fixing jump error on top/left - bug #2330
				var isNotwh = !data.width && !data.height;
				if (isNotwh && !data.left && data.top) data.top = null;
				else if (isNotwh && !data.top && data.left) data.left = null;

				return data;
			},

			_proportionallyResize: function() {

				var o = this.options;
				if (!this._proportionallyResizeElements.length) return;
				var element = this.helper || this.element;

				for (var i = 0; i < this._proportionallyResizeElements.length; i++) {

					var prel = this._proportionallyResizeElements[i];

					if (!this.borderDif) {
						var b = [prel.css('borderTopWidth'), prel.css('borderRightWidth'), prel.css('borderBottomWidth'), prel.css('borderLeftWidth')],
							p = [prel.css('paddingTop'), prel.css('paddingRight'), prel.css('paddingBottom'), prel.css('paddingLeft')];

						this.borderDif = $.map(b, function(v, i) {
							var border = parseInt(v, 10) || 0,
								padding = parseInt(p[i], 10) || 0;
							return border + padding;
						});
					}

					prel.css({
						height: (element.height() - this.borderDif[0] - this.borderDif[2]) || 0,
						width: (element.width() - this.borderDif[1] - this.borderDif[3]) || 0
					});

				};

			},

			_renderProxy: function() {

				var el = this.element,
					o = this.options;
				this.elementOffset = el.offset();

				if (this._helper) {

					this.helper = this.helper || $('<div style="overflow:hidden;"></div>');

					// fix ie6 offset TODO: This seems broken
					var ie6offset = ($.ui.ie6 ? 1 : 0),
						pxyoffset = ($.ui.ie6 ? 2 : -1);

					this.helper.addClass(this._helper).css({
						width: this.element.outerWidth() + pxyoffset,
						height: this.element.outerHeight() + pxyoffset,
						position: 'absolute',
						left: this.elementOffset.left - ie6offset + 'px',
						top: this.elementOffset.top - ie6offset + 'px',
						zIndex: ++o.zIndex //TODO: Don't modify option
					});

					this.helper
						.appendTo("body")
						.disableSelection();

				} else {
					this.helper = this.element;
				}

			},

			_change: {
				e: function(event, dx, dy) {
					return {
						width: this.originalSize.width + dx
					};
				},
				w: function(event, dx, dy) {
					var o = this.options,
						cs = this.originalSize,
						sp = this.originalPosition;
					return {
						left: sp.left + dx,
						width: cs.width - dx
					};
				},
				n: function(event, dx, dy) {
					var o = this.options,
						cs = this.originalSize,
						sp = this.originalPosition;
					return {
						top: sp.top + dy,
						height: cs.height - dy
					};
				},
				s: function(event, dx, dy) {
					return {
						height: this.originalSize.height + dy
					};
				},
				se: function(event, dx, dy) {
					return $.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
				},
				sw: function(event, dx, dy) {
					return $.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
				},
				ne: function(event, dx, dy) {
					return $.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [event, dx, dy]));
				},
				nw: function(event, dx, dy) {
					return $.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [event, dx, dy]));
				}
			},

			_propagate: function(n, event) {
				$.ui.plugin.call(this, n, [event, this.ui()]);
				(n != "resize" && this._trigger(n, event, this.ui()));
			},

			plugins: {},

			ui: function() {
				return {
					originalElement: this.originalElement,
					element: this.element,
					helper: this.helper,
					position: this.position,
					size: this.size,
					originalSize: this.originalSize,
					originalPosition: this.originalPosition
				};
			}

		});

		/*
		 * Resizable Extensions
		 */

		$.ui.plugin.add("resizable", "alsoResize", {

			start: function(event, ui) {
				var that = $(this).data("resizable"),
					o = that.options;

				var _store = function(exp) {
					$(exp).each(function() {
						var el = $(this);
						el.data("resizable-alsoresize", {
							width: parseInt(el.width(), 10),
							height: parseInt(el.height(), 10),
							left: parseInt(el.css('left'), 10),
							top: parseInt(el.css('top'), 10)
						});
					});
				};

				if (typeof(o.alsoResize) == 'object' && !o.alsoResize.parentNode) {
					if (o.alsoResize.length) {
						o.alsoResize = o.alsoResize[0];
						_store(o.alsoResize);
					} else {
						$.each(o.alsoResize, function(exp) {
							_store(exp);
						});
					}
				} else {
					_store(o.alsoResize);
				}
			},

			resize: function(event, ui) {
				var that = $(this).data("resizable"),
					o = that.options,
					os = that.originalSize,
					op = that.originalPosition;

				var delta = {
					height: (that.size.height - os.height) || 0,
					width: (that.size.width - os.width) || 0,
					top: (that.position.top - op.top) || 0,
					left: (that.position.left - op.left) || 0
				},

					_alsoResize = function(exp, c) {
						$(exp).each(function() {
							var el = $(this),
								start = $(this).data("resizable-alsoresize"),
								style = {},
								css = c && c.length ? c : el.parents(ui.originalElement[0]).length ? ['width', 'height'] : ['width', 'height', 'top', 'left'];

							$.each(css, function(i, prop) {
								var sum = (start[prop] || 0) + (delta[prop] || 0);
								if (sum && sum >= 0)
									style[prop] = sum || null;
							});

							el.css(style);
						});
					};

				if (typeof(o.alsoResize) == 'object' && !o.alsoResize.nodeType) {
					$.each(o.alsoResize, function(exp, c) {
						_alsoResize(exp, c);
					});
				} else {
					_alsoResize(o.alsoResize);
				}
			},

			stop: function(event, ui) {
				$(this).removeData("resizable-alsoresize");
			}
		});

		$.ui.plugin.add("resizable", "animate", {

			stop: function(event, ui) {
				var that = $(this).data("resizable"),
					o = that.options;

				var pr = that._proportionallyResizeElements,
					ista = pr.length && (/textarea/i).test(pr[0].nodeName),
					soffseth = ista && $.ui.hasScroll(pr[0], 'left') /* TODO - jump height */ ? 0 : that.sizeDiff.height,
					soffsetw = ista ? 0 : that.sizeDiff.width;

				var style = {
					width: (that.size.width - soffsetw),
					height: (that.size.height - soffseth)
				},
					left = (parseInt(that.element.css('left'), 10) + (that.position.left - that.originalPosition.left)) || null,
					top = (parseInt(that.element.css('top'), 10) + (that.position.top - that.originalPosition.top)) || null;

				that.element.animate(
					$.extend(style, top && left ? {
						top: top,
						left: left
					} : {}), {
						duration: o.animateDuration,
						easing: o.animateEasing,
						step: function() {

							var data = {
								width: parseInt(that.element.css('width'), 10),
								height: parseInt(that.element.css('height'), 10),
								top: parseInt(that.element.css('top'), 10),
								left: parseInt(that.element.css('left'), 10)
							};

							if (pr && pr.length) $(pr[0]).css({
								width: data.width,
								height: data.height
							});

							// propagating resize, and updating values for each animation step
							that._updateCache(data);
							that._propagate("resize", event);

						}
					}
				);
			}

		});

		$.ui.plugin.add("resizable", "containment", {

			start: function(event, ui) {
				var that = $(this).data("resizable"),
					o = that.options,
					el = that.element;
				var oc = o.containment,
					ce = (oc instanceof $) ? oc.get(0) : (/parent/.test(oc)) ? el.parent().get(0) : oc;
				if (!ce) return;

				that.containerElement = $(ce);

				if (/document/.test(oc) || oc == document) {
					that.containerOffset = {
						left: 0,
						top: 0
					};
					that.containerPosition = {
						left: 0,
						top: 0
					};

					that.parentData = {
						element: $(document),
						left: 0,
						top: 0,
						width: $(document).width(),
						height: $(document).height() || document.body.parentNode.scrollHeight
					};
				}

				// i'm a node, so compute top, left, right, bottom
				else {
					var element = $(ce),
						p = [];
					$(["Top", "Right", "Left", "Bottom"]).each(function(i, name) {
						p[i] = num(element.css("padding" + name));
					});

					that.containerOffset = element.offset();
					that.containerPosition = element.position();
					that.containerSize = {
						height: (element.innerHeight() - p[3]),
						width: (element.innerWidth() - p[1])
					};

					var co = that.containerOffset,
						ch = that.containerSize.height,
						cw = that.containerSize.width,
						width = ($.ui.hasScroll(ce, "left") ? ce.scrollWidth : cw),
						height = ($.ui.hasScroll(ce) ? ce.scrollHeight : ch);

					that.parentData = {
						element: ce,
						left: co.left,
						top: co.top,
						width: width,
						height: height
					};
				}
			},

			resize: function(event, ui) {
				var that = $(this).data("resizable"),
					o = that.options,
					ps = that.containerSize,
					co = that.containerOffset,
					cs = that.size,
					cp = that.position,
					pRatio = that._aspectRatio || event.shiftKey,
					cop = {
						top: 0,
						left: 0
					}, ce = that.containerElement;

				if (ce[0] != document && (/static/).test(ce.css('position'))) cop = co;

				if (cp.left < (that._helper ? co.left : 0)) {
					that.size.width = that.size.width + (that._helper ? (that.position.left - co.left) : (that.position.left - cop.left));
					if (pRatio) that.size.height = that.size.width / that.aspectRatio;
					that.position.left = o.helper ? co.left : 0;
				}

				if (cp.top < (that._helper ? co.top : 0)) {
					that.size.height = that.size.height + (that._helper ? (that.position.top - co.top) : that.position.top);
					if (pRatio) that.size.width = that.size.height * that.aspectRatio;
					that.position.top = that._helper ? co.top : 0;
				}

				that.offset.left = that.parentData.left + that.position.left;
				that.offset.top = that.parentData.top + that.position.top;

				var woset = Math.abs((that._helper ? that.offset.left - cop.left : (that.offset.left - cop.left)) + that.sizeDiff.width),
					hoset = Math.abs((that._helper ? that.offset.top - cop.top : (that.offset.top - co.top)) + that.sizeDiff.height);

				var isParent = that.containerElement.get(0) == that.element.parent().get(0),
					isOffsetRelative = /relative|absolute/.test(that.containerElement.css('position'));

				if (isParent && isOffsetRelative) woset -= that.parentData.left;

				if (woset + that.size.width >= that.parentData.width) {
					that.size.width = that.parentData.width - woset;
					if (pRatio) that.size.height = that.size.width / that.aspectRatio;
				}

				if (hoset + that.size.height >= that.parentData.height) {
					that.size.height = that.parentData.height - hoset;
					if (pRatio) that.size.width = that.size.height * that.aspectRatio;
				}
			},

			stop: function(event, ui) {
				var that = $(this).data("resizable"),
					o = that.options,
					cp = that.position,
					co = that.containerOffset,
					cop = that.containerPosition,
					ce = that.containerElement;

				var helper = $(that.helper),
					ho = helper.offset(),
					w = helper.outerWidth() - that.sizeDiff.width,
					h = helper.outerHeight() - that.sizeDiff.height;

				if (that._helper && !o.animate && (/relative/).test(ce.css('position')))
					$(this).css({
						left: ho.left - cop.left - co.left,
						width: w,
						height: h
					});

				if (that._helper && !o.animate && (/static/).test(ce.css('position')))
					$(this).css({
						left: ho.left - cop.left - co.left,
						width: w,
						height: h
					});

			}
		});

		$.ui.plugin.add("resizable", "ghost", {

			start: function(event, ui) {

				var that = $(this).data("resizable"),
					o = that.options,
					cs = that.size;

				that.ghost = that.originalElement.clone();
				that.ghost
					.css({
						opacity: .25,
						display: 'block',
						position: 'relative',
						height: cs.height,
						width: cs.width,
						margin: 0,
						left: 0,
						top: 0
					})
					.addClass('ui-resizable-ghost')
					.addClass(typeof o.ghost == 'string' ? o.ghost : '');

				that.ghost.appendTo(that.helper);

			},

			resize: function(event, ui) {
				var that = $(this).data("resizable"),
					o = that.options;
				if (that.ghost) that.ghost.css({
					position: 'relative',
					height: that.size.height,
					width: that.size.width
				});
			},

			stop: function(event, ui) {
				var that = $(this).data("resizable"),
					o = that.options;
				if (that.ghost && that.helper) that.helper.get(0).removeChild(that.ghost.get(0));
			}

		});

		$.ui.plugin.add("resizable", "grid", {

			resize: function(event, ui) {
				var that = $(this).data("resizable"),
					o = that.options,
					cs = that.size,
					os = that.originalSize,
					op = that.originalPosition,
					a = that.axis,
					ratio = o._aspectRatio || event.shiftKey;
				o.grid = typeof o.grid == "number" ? [o.grid, o.grid] : o.grid;
				var ox = Math.round((cs.width - os.width) / (o.grid[0] || 1)) * (o.grid[0] || 1),
					oy = Math.round((cs.height - os.height) / (o.grid[1] || 1)) * (o.grid[1] || 1);

				if (/^(se|s|e)$/.test(a)) {
					that.size.width = os.width + ox;
					that.size.height = os.height + oy;
				} else if (/^(ne)$/.test(a)) {
					that.size.width = os.width + ox;
					that.size.height = os.height + oy;
					that.position.top = op.top - oy;
				} else if (/^(sw)$/.test(a)) {
					that.size.width = os.width + ox;
					that.size.height = os.height + oy;
					that.position.left = op.left - ox;
				} else {
					that.size.width = os.width + ox;
					that.size.height = os.height + oy;
					that.position.top = op.top - oy;
					that.position.left = op.left - ox;
				}
			}

		});

		var num = function(v) {
			return parseInt(v, 10) || 0;
		};

		var isNumber = function(value) {
			return !isNaN(parseInt(value, 10));
		};

	})(jQuery);
	(function($, undefined) {

		$.widget("ui.selectable", $.ui.mouse, {
			version: "1.9.1",
			options: {
				appendTo: 'body',
				autoRefresh: true,
				distance: 0,
				filter: '*',
				tolerance: 'touch'
			},
			_create: function() {
				var that = this;

				this.element.addClass("ui-selectable");

				this.dragged = false;

				// cache selectee children based on filter
				var selectees;
				this.refresh = function() {
					selectees = $(that.options.filter, that.element[0]);
					selectees.addClass("ui-selectee");
					selectees.each(function() {
						var $this = $(this);
						var pos = $this.offset();
						$.data(this, "selectable-item", {
							element: this,
							$element: $this,
							left: pos.left,
							top: pos.top,
							right: pos.left + $this.outerWidth(),
							bottom: pos.top + $this.outerHeight(),
							startselected: false,
							selected: $this.hasClass('ui-selected'),
							selecting: $this.hasClass('ui-selecting'),
							unselecting: $this.hasClass('ui-unselecting')
						});
					});
				};
				this.refresh();

				this.selectees = selectees.addClass("ui-selectee");

				this._mouseInit();

				this.helper = $("<div class='ui-selectable-helper'></div>");
			},

			_destroy: function() {
				this.selectees
					.removeClass("ui-selectee")
					.removeData("selectable-item");
				this.element
					.removeClass("ui-selectable ui-selectable-disabled");
				this._mouseDestroy();
			},

			_mouseStart: function(event) {
				var that = this;

				this.opos = [event.pageX, event.pageY];

				if (this.options.disabled)
					return;

				var options = this.options;

				this.selectees = $(options.filter, this.element[0]);

				this._trigger("start", event);

				$(options.appendTo).append(this.helper);
				// position helper (lasso)
				this.helper.css({
					"left": event.clientX,
					"top": event.clientY,
					"width": 0,
					"height": 0
				});

				if (options.autoRefresh) {
					this.refresh();
				}

				this.selectees.filter('.ui-selected').each(function() {
					var selectee = $.data(this, "selectable-item");
					selectee.startselected = true;
					if (!event.metaKey && !event.ctrlKey) {
						selectee.$element.removeClass('ui-selected');
						selectee.selected = false;
						selectee.$element.addClass('ui-unselecting');
						selectee.unselecting = true;
						// selectable UNSELECTING callback
						that._trigger("unselecting", event, {
							unselecting: selectee.element
						});
					}
				});

				$(event.target).parents().andSelf().each(function() {
					var selectee = $.data(this, "selectable-item");
					if (selectee) {
						var doSelect = (!event.metaKey && !event.ctrlKey) || !selectee.$element.hasClass('ui-selected');
						selectee.$element
							.removeClass(doSelect ? "ui-unselecting" : "ui-selected")
							.addClass(doSelect ? "ui-selecting" : "ui-unselecting");
						selectee.unselecting = !doSelect;
						selectee.selecting = doSelect;
						selectee.selected = doSelect;
						// selectable (UN)SELECTING callback
						if (doSelect) {
							that._trigger("selecting", event, {
								selecting: selectee.element
							});
						} else {
							that._trigger("unselecting", event, {
								unselecting: selectee.element
							});
						}
						return false;
					}
				});

			},

			_mouseDrag: function(event) {
				var that = this;
				this.dragged = true;

				if (this.options.disabled)
					return;

				var options = this.options;

				var x1 = this.opos[0],
					y1 = this.opos[1],
					x2 = event.pageX,
					y2 = event.pageY;
				if (x1 > x2) {
					var tmp = x2;
					x2 = x1;
					x1 = tmp;
				}
				if (y1 > y2) {
					var tmp = y2;
					y2 = y1;
					y1 = tmp;
				}
				this.helper.css({
					left: x1,
					top: y1,
					width: x2 - x1,
					height: y2 - y1
				});

				this.selectees.each(function() {
					var selectee = $.data(this, "selectable-item");
					//prevent helper from being selected if appendTo: selectable
					if (!selectee || selectee.element == that.element[0])
						return;
					var hit = false;
					if (options.tolerance == 'touch') {
						hit = (!(selectee.left > x2 || selectee.right < x1 || selectee.top > y2 || selectee.bottom < y1));
					} else if (options.tolerance == 'fit') {
						hit = (selectee.left > x1 && selectee.right < x2 && selectee.top > y1 && selectee.bottom < y2);
					}

					if (hit) {
						// SELECT
						if (selectee.selected) {
							selectee.$element.removeClass('ui-selected');
							selectee.selected = false;
						}
						if (selectee.unselecting) {
							selectee.$element.removeClass('ui-unselecting');
							selectee.unselecting = false;
						}
						if (!selectee.selecting) {
							selectee.$element.addClass('ui-selecting');
							selectee.selecting = true;
							// selectable SELECTING callback
							that._trigger("selecting", event, {
								selecting: selectee.element
							});
						}
					} else {
						// UNSELECT
						if (selectee.selecting) {
							if ((event.metaKey || event.ctrlKey) && selectee.startselected) {
								selectee.$element.removeClass('ui-selecting');
								selectee.selecting = false;
								selectee.$element.addClass('ui-selected');
								selectee.selected = true;
							} else {
								selectee.$element.removeClass('ui-selecting');
								selectee.selecting = false;
								if (selectee.startselected) {
									selectee.$element.addClass('ui-unselecting');
									selectee.unselecting = true;
								}
								// selectable UNSELECTING callback
								that._trigger("unselecting", event, {
									unselecting: selectee.element
								});
							}
						}
						if (selectee.selected) {
							if (!event.metaKey && !event.ctrlKey && !selectee.startselected) {
								selectee.$element.removeClass('ui-selected');
								selectee.selected = false;

								selectee.$element.addClass('ui-unselecting');
								selectee.unselecting = true;
								// selectable UNSELECTING callback
								that._trigger("unselecting", event, {
									unselecting: selectee.element
								});
							}
						}
					}
				});

				return false;
			},

			_mouseStop: function(event) {
				var that = this;

				this.dragged = false;

				var options = this.options;

				$('.ui-unselecting', this.element[0]).each(function() {
					var selectee = $.data(this, "selectable-item");
					selectee.$element.removeClass('ui-unselecting');
					selectee.unselecting = false;
					selectee.startselected = false;
					that._trigger("unselected", event, {
						unselected: selectee.element
					});
				});
				$('.ui-selecting', this.element[0]).each(function() {
					var selectee = $.data(this, "selectable-item");
					selectee.$element.removeClass('ui-selecting').addClass('ui-selected');
					selectee.selecting = false;
					selectee.selected = true;
					selectee.startselected = true;
					that._trigger("selected", event, {
						selected: selectee.element
					});
				});
				this._trigger("stop", event);

				this.helper.remove();

				return false;
			}

		});

	})(jQuery);
	(function($, undefined) {

		$.widget("ui.sortable", $.ui.mouse, {
			version: "1.9.1",
			widgetEventPrefix: "sort",
			ready: false,
			options: {
				appendTo: "parent",
				axis: false,
				connectWith: false,
				containment: false,
				cursor: 'auto',
				cursorAt: false,
				dropOnEmpty: true,
				forcePlaceholderSize: false,
				forceHelperSize: false,
				grid: false,
				handle: false,
				helper: "original",
				items: '> *',
				opacity: false,
				placeholder: false,
				revert: false,
				scroll: true,
				scrollSensitivity: 20,
				scrollSpeed: 20,
				scope: "default",
				tolerance: "intersect",
				zIndex: 1000
			},
			_create: function() {

				var o = this.options;
				this.containerCache = {};
				this.element.addClass("ui-sortable");

				//Get the items
				this.refresh();

				//Let's determine if the items are being displayed horizontally
				this.floating = this.items.length ? o.axis === 'x' || (/left|right/).test(this.items[0].item.css('float')) || (/inline|table-cell/).test(this.items[0].item.css('display')) : false;

				//Let's determine the parent's offset
				this.offset = this.element.offset();

				//Initialize mouse events for interaction
				this._mouseInit();

				//We're ready to go
				this.ready = true

			},

			_destroy: function() {
				this.element
					.removeClass("ui-sortable ui-sortable-disabled");
				this._mouseDestroy();

				for (var i = this.items.length - 1; i >= 0; i--)
					this.items[i].item.removeData(this.widgetName + "-item");

				return this;
			},

			_setOption: function(key, value) {
				if (key === "disabled") {
					this.options[key] = value;

					this.widget().toggleClass("ui-sortable-disabled", !! value);
				} else {
					// Don't call widget base _setOption for disable as it adds ui-state-disabled class
					$.Widget.prototype._setOption.apply(this, arguments);
				}
			},

			_mouseCapture: function(event, overrideHandle) {
				var that = this;

				if (this.reverting) {
					return false;
				}

				if (this.options.disabled || this.options.type == 'static') return false;

				//We have to refresh the items data once first
				this._refreshItems(event);

				//Find out if the clicked node (or one of its parents) is a actual item in this.items
				var currentItem = null,
					nodes = $(event.target).parents().each(function() {
						if ($.data(this, that.widgetName + '-item') == that) {
							currentItem = $(this);
							return false;
						}
					});
				if ($.data(event.target, that.widgetName + '-item') == that) currentItem = $(event.target);

				if (!currentItem) return false;
				if (this.options.handle && !overrideHandle) {
					var validHandle = false;

					$(this.options.handle, currentItem).find("*").andSelf().each(function() {
						if (this == event.target) validHandle = true;
					});
					if (!validHandle) return false;
				}

				this.currentItem = currentItem;
				this._removeCurrentsFromItems();
				return true;

			},

			_mouseStart: function(event, overrideHandle, noActivation) {

				var o = this.options;
				this.currentContainer = this;

				//We only need to call refreshPositions, because the refreshItems call has been moved to mouseCapture
				this.refreshPositions();

				//Create and append the visible helper
				this.helper = this._createHelper(event);

				//Cache the helper size
				this._cacheHelperProportions();

				/*
				 * - Position generation -
				 * This block generates everything position related - it's the core of draggables.
				 */

				//Cache the margins of the original element
				this._cacheMargins();

				//Get the next scrolling parent
				this.scrollParent = this.helper.scrollParent();

				//The element's absolute position on the page minus margins
				this.offset = this.currentItem.offset();
				this.offset = {
					top: this.offset.top - this.margins.top,
					left: this.offset.left - this.margins.left
				};

				$.extend(this.offset, {
					click: { //Where the click happened, relative to the element
						left: event.pageX - this.offset.left,
						top: event.pageY - this.offset.top
					},
					parent: this._getParentOffset(),
					relative: this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
				});

				// Only after we got the offset, we can change the helper's position to absolute
				// TODO: Still need to figure out a way to make relative sorting possible
				this.helper.css("position", "absolute");
				this.cssPosition = this.helper.css("position");

				//Generate the original position
				this.originalPosition = this._generatePosition(event);
				this.originalPageX = event.pageX;
				this.originalPageY = event.pageY;

				//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
				(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

				//Cache the former DOM position
				this.domPosition = {
					prev: this.currentItem.prev()[0],
					parent: this.currentItem.parent()[0]
				};

				//If the helper is not the original, hide the original so it's not playing any role during the drag, won't cause anything bad this way
				if (this.helper[0] != this.currentItem[0]) {
					this.currentItem.hide();
				}

				//Create the placeholder
				this._createPlaceholder();

				//Set a containment if given in the options
				if (o.containment)
					this._setContainment();

				if (o.cursor) { // cursor option
					if ($('body').css("cursor")) this._storedCursor = $('body').css("cursor");
					$('body').css("cursor", o.cursor);
				}

				if (o.opacity) { // opacity option
					if (this.helper.css("opacity")) this._storedOpacity = this.helper.css("opacity");
					this.helper.css("opacity", o.opacity);
				}

				if (o.zIndex) { // zIndex option
					if (this.helper.css("zIndex")) this._storedZIndex = this.helper.css("zIndex");
					this.helper.css("zIndex", o.zIndex);
				}

				//Prepare scrolling
				if (this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML')
					this.overflowOffset = this.scrollParent.offset();

				//Call callbacks
				this._trigger("start", event, this._uiHash());

				//Recache the helper size
				if (!this._preserveHelperProportions)
					this._cacheHelperProportions();


				//Post 'activate' events to possible containers
				if (!noActivation) {
					for (var i = this.containers.length - 1; i >= 0; i--) {
						this.containers[i]._trigger("activate", event, this._uiHash(this));
					}
				}

				//Prepare possible droppables
				if ($.ui.ddmanager)
					$.ui.ddmanager.current = this;

				if ($.ui.ddmanager && !o.dropBehaviour)
					$.ui.ddmanager.prepareOffsets(this, event);

				this.dragging = true;

				this.helper.addClass("ui-sortable-helper");
				this._mouseDrag(event); //Execute the drag once - this causes the helper not to be visible before getting its correct position
				return true;

			},

			_mouseDrag: function(event) {

				//Compute the helpers position
				this.position = this._generatePosition(event);
				this.positionAbs = this._convertPositionTo("absolute");

				if (!this.lastPositionAbs) {
					this.lastPositionAbs = this.positionAbs;
				}

				//Do scrolling
				if (this.options.scroll) {
					var o = this.options,
						scrolled = false;
					if (this.scrollParent[0] != document && this.scrollParent[0].tagName != 'HTML') {

						if ((this.overflowOffset.top + this.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
							this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop + o.scrollSpeed;
						else if (event.pageY - this.overflowOffset.top < o.scrollSensitivity)
							this.scrollParent[0].scrollTop = scrolled = this.scrollParent[0].scrollTop - o.scrollSpeed;

						if ((this.overflowOffset.left + this.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
							this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft + o.scrollSpeed;
						else if (event.pageX - this.overflowOffset.left < o.scrollSensitivity)
							this.scrollParent[0].scrollLeft = scrolled = this.scrollParent[0].scrollLeft - o.scrollSpeed;

					} else {

						if (event.pageY - $(document).scrollTop() < o.scrollSensitivity)
							scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
						else if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
							scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);

						if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
							scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
						else if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
							scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);

					}

					if (scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
						$.ui.ddmanager.prepareOffsets(this, event);
				}

				//Regenerate the absolute position used for position checks
				this.positionAbs = this._convertPositionTo("absolute");

				//Set the helper position
				if (!this.options.axis || this.options.axis != "y") this.helper[0].style.left = this.position.left + 'px';
				if (!this.options.axis || this.options.axis != "x") this.helper[0].style.top = this.position.top + 'px';

				//Rearrange
				for (var i = this.items.length - 1; i >= 0; i--) {

					//Cache variables and intersection, continue if no intersection
					var item = this.items[i],
						itemElement = item.item[0],
						intersection = this._intersectsWithPointer(item);
					if (!intersection) continue;

					// Only put the placeholder inside the current Container, skip all
					// items form other containers. This works because when moving
					// an item from one container to another the
					// currentContainer is switched before the placeholder is moved.
					//
					// Without this moving items in "sub-sortables" can cause the placeholder to jitter
					// beetween the outer and inner container.
					if (item.instance !== this.currentContainer) continue;

					if (itemElement != this.currentItem[0] //cannot intersect with itself
						&& this.placeholder[intersection == 1 ? "next" : "prev"]()[0] != itemElement //no useless actions that have been done before
						&& !$.contains(this.placeholder[0], itemElement) //no action if the item moved is the parent of the item checked
						&& (this.options.type == 'semi-dynamic' ? !$.contains(this.element[0], itemElement) : true)
						//&& itemElement.parentNode == this.placeholder[0].parentNode // only rearrange items within the same container
					) {

						this.direction = intersection == 1 ? "down" : "up";

						if (this.options.tolerance == "pointer" || this._intersectsWithSides(item)) {
							this._rearrange(event, item);
						} else {
							break;
						}

						this._trigger("change", event, this._uiHash());
						break;
					}
				}

				//Post events to containers
				this._contactContainers(event);

				//Interconnect with droppables
				if ($.ui.ddmanager) $.ui.ddmanager.drag(this, event);

				//Call callbacks
				this._trigger('sort', event, this._uiHash());

				this.lastPositionAbs = this.positionAbs;
				return false;

			},

			_mouseStop: function(event, noPropagation) {

				if (!event) return;

				//If we are using droppables, inform the manager about the drop
				if ($.ui.ddmanager && !this.options.dropBehaviour)
					$.ui.ddmanager.drop(this, event);

				if (this.options.revert) {
					var that = this;
					var cur = this.placeholder.offset();

					this.reverting = true;

					$(this.helper).animate({
						left: cur.left - this.offset.parent.left - this.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft),
						top: cur.top - this.offset.parent.top - this.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)
					}, parseInt(this.options.revert, 10) || 500, function() {
						that._clear(event);
					});
				} else {
					this._clear(event, noPropagation);
				}

				return false;

			},

			cancel: function() {

				if (this.dragging) {

					this._mouseUp({
						target: null
					});

					if (this.options.helper == "original")
						this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
					else
						this.currentItem.show();

					//Post deactivating events to containers
					for (var i = this.containers.length - 1; i >= 0; i--) {
						this.containers[i]._trigger("deactivate", null, this._uiHash(this));
						if (this.containers[i].containerCache.over) {
							this.containers[i]._trigger("out", null, this._uiHash(this));
							this.containers[i].containerCache.over = 0;
						}
					}

				}

				if (this.placeholder) {
					//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
					if (this.placeholder[0].parentNode) this.placeholder[0].parentNode.removeChild(this.placeholder[0]);
					if (this.options.helper != "original" && this.helper && this.helper[0].parentNode) this.helper.remove();

					$.extend(this, {
						helper: null,
						dragging: false,
						reverting: false,
						_noFinalSort: null
					});

					if (this.domPosition.prev) {
						$(this.domPosition.prev).after(this.currentItem);
					} else {
						$(this.domPosition.parent).prepend(this.currentItem);
					}
				}

				return this;

			},

			serialize: function(o) {

				var items = this._getItemsAsjQuery(o && o.connected);
				var str = [];
				o = o || {};

				$(items).each(function() {
					var res = ($(o.item || this).attr(o.attribute || 'id') || '').match(o.expression || (/(.+)[-=_](.+)/));
					if (res) str.push((o.key || res[1] + '[]') + '=' + (o.key && o.expression ? res[1] : res[2]));
				});

				if (!str.length && o.key) {
					str.push(o.key + '=');
				}

				return str.join('&');

			},

			toArray: function(o) {

				var items = this._getItemsAsjQuery(o && o.connected);
				var ret = [];
				o = o || {};

				items.each(function() {
					ret.push($(o.item || this).attr(o.attribute || 'id') || '');
				});
				return ret;

			},

			/* Be careful with the following core functions */
			_intersectsWith: function(item) {

				var x1 = this.positionAbs.left,
					x2 = x1 + this.helperProportions.width,
					y1 = this.positionAbs.top,
					y2 = y1 + this.helperProportions.height;

				var l = item.left,
					r = l + item.width,
					t = item.top,
					b = t + item.height;

				var dyClick = this.offset.click.top,
					dxClick = this.offset.click.left;

				var isOverElement = (y1 + dyClick) > t && (y1 + dyClick) < b && (x1 + dxClick) > l && (x1 + dxClick) < r;

				if (this.options.tolerance == "pointer" || this.options.forcePointerForContainers || (this.options.tolerance != "pointer" && this.helperProportions[this.floating ? 'width' : 'height'] > item[this.floating ? 'width' : 'height'])) {
					return isOverElement;
				} else {

					return (l < x1 + (this.helperProportions.width / 2) // Right Half
						&& x2 - (this.helperProportions.width / 2) < r // Left Half
						&& t < y1 + (this.helperProportions.height / 2) // Bottom Half
						&& y2 - (this.helperProportions.height / 2) < b); // Top Half

				}
			},

			_intersectsWithPointer: function(item) {

				var isOverElementHeight = (this.options.axis === 'x') || $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top, item.height),
					isOverElementWidth = (this.options.axis === 'y') || $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left, item.width),
					isOverElement = isOverElementHeight && isOverElementWidth,
					verticalDirection = this._getDragVerticalDirection(),
					horizontalDirection = this._getDragHorizontalDirection();

				if (!isOverElement)
					return false;

				return this.floating ?
					(((horizontalDirection && horizontalDirection == "right") || verticalDirection == "down") ? 2 : 1) : (verticalDirection && (verticalDirection == "down" ? 2 : 1));

			},

			_intersectsWithSides: function(item) {

				var isOverBottomHalf = $.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, item.top + (item.height / 2), item.height),
					isOverRightHalf = $.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, item.left + (item.width / 2), item.width),
					verticalDirection = this._getDragVerticalDirection(),
					horizontalDirection = this._getDragHorizontalDirection();

				if (this.floating && horizontalDirection) {
					return ((horizontalDirection == "right" && isOverRightHalf) || (horizontalDirection == "left" && !isOverRightHalf));
				} else {
					return verticalDirection && ((verticalDirection == "down" && isOverBottomHalf) || (verticalDirection == "up" && !isOverBottomHalf));
				}

			},

			_getDragVerticalDirection: function() {
				var delta = this.positionAbs.top - this.lastPositionAbs.top;
				return delta != 0 && (delta > 0 ? "down" : "up");
			},

			_getDragHorizontalDirection: function() {
				var delta = this.positionAbs.left - this.lastPositionAbs.left;
				return delta != 0 && (delta > 0 ? "right" : "left");
			},

			refresh: function(event) {
				this._refreshItems(event);
				this.refreshPositions();
				return this;
			},

			_connectWith: function() {
				var options = this.options;
				return options.connectWith.constructor == String ? [options.connectWith] : options.connectWith;
			},

			_getItemsAsjQuery: function(connected) {

				var items = [];
				var queries = [];
				var connectWith = this._connectWith();

				if (connectWith && connected) {
					for (var i = connectWith.length - 1; i >= 0; i--) {
						var cur = $(connectWith[i]);
						for (var j = cur.length - 1; j >= 0; j--) {
							var inst = $.data(cur[j], this.widgetName);
							if (inst && inst != this && !inst.options.disabled) {
								queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element) : $(inst.options.items, inst.element).not(".ui-sortable-helper").not('.ui-sortable-placeholder'), inst]);
							}
						};
					};
				}

				queries.push([$.isFunction(this.options.items) ? this.options.items.call(this.element, null, {
					options: this.options,
					item: this.currentItem
				}) : $(this.options.items, this.element).not(".ui-sortable-helper").not('.ui-sortable-placeholder'), this]);

				for (var i = queries.length - 1; i >= 0; i--) {
					queries[i][0].each(function() {
						items.push(this);
					});
				};

				return $(items);

			},

			_removeCurrentsFromItems: function() {

				var list = this.currentItem.find(":data(" + this.widgetName + "-item)");

				this.items = $.grep(this.items, function(item) {
					for (var j = 0; j < list.length; j++) {
						if (list[j] == item.item[0])
							return false;
					};
					return true;
				});

			},

			_refreshItems: function(event) {

				this.items = [];
				this.containers = [this];
				var items = this.items;
				var queries = [
					[$.isFunction(this.options.items) ? this.options.items.call(this.element[0], event, {
						item: this.currentItem
					}) : $(this.options.items, this.element), this]
				];
				var connectWith = this._connectWith();

				if (connectWith && this.ready) { //Shouldn't be run the first time through due to massive slow-down
					for (var i = connectWith.length - 1; i >= 0; i--) {
						var cur = $(connectWith[i]);
						for (var j = cur.length - 1; j >= 0; j--) {
							var inst = $.data(cur[j], this.widgetName);
							if (inst && inst != this && !inst.options.disabled) {
								queries.push([$.isFunction(inst.options.items) ? inst.options.items.call(inst.element[0], event, {
									item: this.currentItem
								}) : $(inst.options.items, inst.element), inst]);
								this.containers.push(inst);
							}
						};
					};
				}

				for (var i = queries.length - 1; i >= 0; i--) {
					var targetData = queries[i][1];
					var _queries = queries[i][0];

					for (var j = 0, queriesLength = _queries.length; j < queriesLength; j++) {
						var item = $(_queries[j]);

						item.data(this.widgetName + '-item', targetData); // Data for target checking (mouse manager)

						items.push({
							item: item,
							instance: targetData,
							width: 0,
							height: 0,
							left: 0,
							top: 0
						});
					};
				};

			},

			refreshPositions: function(fast) {

				//This has to be redone because due to the item being moved out/into the offsetParent, the offsetParent's position will change
				if (this.offsetParent && this.helper) {
					this.offset.parent = this._getParentOffset();
				}

				for (var i = this.items.length - 1; i >= 0; i--) {
					var item = this.items[i];

					//We ignore calculating positions of all connected containers when we're not over them
					if (item.instance != this.currentContainer && this.currentContainer && item.item[0] != this.currentItem[0])
						continue;

					var t = this.options.toleranceElement ? $(this.options.toleranceElement, item.item) : item.item;

					if (!fast) {
						item.width = t.outerWidth();
						item.height = t.outerHeight();
					}

					var p = t.offset();
					item.left = p.left;
					item.top = p.top;
				};

				if (this.options.custom && this.options.custom.refreshContainers) {
					this.options.custom.refreshContainers.call(this);
				} else {
					for (var i = this.containers.length - 1; i >= 0; i--) {
						var p = this.containers[i].element.offset();
						this.containers[i].containerCache.left = p.left;
						this.containers[i].containerCache.top = p.top;
						this.containers[i].containerCache.width = this.containers[i].element.outerWidth();
						this.containers[i].containerCache.height = this.containers[i].element.outerHeight();
					};
				}

				return this;
			},

			_createPlaceholder: function(that) {
				that = that || this;
				var o = that.options;

				if (!o.placeholder || o.placeholder.constructor == String) {
					var className = o.placeholder;
					o.placeholder = {
						element: function() {

							var el = $(document.createElement(that.currentItem[0].nodeName))
								.addClass(className || that.currentItem[0].className + " ui-sortable-placeholder")
								.removeClass("ui-sortable-helper")[0];

							if (!className)
								el.style.visibility = "hidden";

							return el;
						},
						update: function(container, p) {

							// 1. If a className is set as 'placeholder option, we don't force sizes - the class is responsible for that
							// 2. The option 'forcePlaceholderSize can be enabled to force it even if a class name is specified
							if (className && !o.forcePlaceholderSize) return;

							//If the element doesn't have a actual height by itself (without styles coming from a stylesheet), it receives the inline height from the dragged item
							if (!p.height()) {
								p.height(that.currentItem.innerHeight() - parseInt(that.currentItem.css('paddingTop') || 0, 10) - parseInt(that.currentItem.css('paddingBottom') || 0, 10));
							};
							if (!p.width()) {
								p.width(that.currentItem.innerWidth() - parseInt(that.currentItem.css('paddingLeft') || 0, 10) - parseInt(that.currentItem.css('paddingRight') || 0, 10));
							};
						}
					};
				}

				//Create the placeholder
				that.placeholder = $(o.placeholder.element.call(that.element, that.currentItem));

				//Append it after the actual current item
				that.currentItem.after(that.placeholder);

				//Update the size of the placeholder (TODO: Logic to fuzzy, see line 316/317)
				o.placeholder.update(that, that.placeholder);

			},

			_contactContainers: function(event) {

				// get innermost container that intersects with item
				var innermostContainer = null,
					innermostIndex = null;


				for (var i = this.containers.length - 1; i >= 0; i--) {

					// never consider a container that's located within the item itself
					if ($.contains(this.currentItem[0], this.containers[i].element[0]))
						continue;

					if (this._intersectsWith(this.containers[i].containerCache)) {

						// if we've already found a container and it's more "inner" than this, then continue
						if (innermostContainer && $.contains(this.containers[i].element[0], innermostContainer.element[0]))
							continue;

						innermostContainer = this.containers[i];
						innermostIndex = i;

					} else {
						// container doesn't intersect. trigger "out" event if necessary
						if (this.containers[i].containerCache.over) {
							this.containers[i]._trigger("out", event, this._uiHash(this));
							this.containers[i].containerCache.over = 0;
						}
					}

				}

				// if no intersecting containers found, return
				if (!innermostContainer) return;

				// move the item into the container if it's not there already
				if (this.containers.length === 1) {
					this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
					this.containers[innermostIndex].containerCache.over = 1;
				} else {

					//When entering a new container, we will find the item with the least distance and append our item near it
					var dist = 10000;
					var itemWithLeastDistance = null;
					var posProperty = this.containers[innermostIndex].floating ? 'left' : 'top';
					var sizeProperty = this.containers[innermostIndex].floating ? 'width' : 'height';
					var base = this.positionAbs[posProperty] + this.offset.click[posProperty];
					for (var j = this.items.length - 1; j >= 0; j--) {
						if (!$.contains(this.containers[innermostIndex].element[0], this.items[j].item[0])) continue;
						if (this.items[j].item[0] == this.currentItem[0]) continue;
						var cur = this.items[j].item.offset()[posProperty];
						var nearBottom = false;
						if (Math.abs(cur - base) > Math.abs(cur + this.items[j][sizeProperty] - base)) {
							nearBottom = true;
							cur += this.items[j][sizeProperty];
						}

						if (Math.abs(cur - base) < dist) {
							dist = Math.abs(cur - base);
							itemWithLeastDistance = this.items[j];
							this.direction = nearBottom ? "up" : "down";
						}
					}

					if (!itemWithLeastDistance && !this.options.dropOnEmpty) //Check if dropOnEmpty is enabled
						return;

					this.currentContainer = this.containers[innermostIndex];
					itemWithLeastDistance ? this._rearrange(event, itemWithLeastDistance, null, true) : this._rearrange(event, null, this.containers[innermostIndex].element, true);
					this._trigger("change", event, this._uiHash());
					this.containers[innermostIndex]._trigger("change", event, this._uiHash(this));

					//Update the placeholder
					this.options.placeholder.update(this.currentContainer, this.placeholder);

					this.containers[innermostIndex]._trigger("over", event, this._uiHash(this));
					this.containers[innermostIndex].containerCache.over = 1;
				}


			},

			_createHelper: function(event) {

				var o = this.options;
				var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event, this.currentItem])) : (o.helper == 'clone' ? this.currentItem.clone() : this.currentItem);

				if (!helper.parents('body').length) //Add the helper to the DOM if that didn't happen already
					$(o.appendTo != 'parent' ? o.appendTo : this.currentItem[0].parentNode)[0].appendChild(helper[0]);

				if (helper[0] == this.currentItem[0])
					this._storedCSS = {
						width: this.currentItem[0].style.width,
						height: this.currentItem[0].style.height,
						position: this.currentItem.css("position"),
						top: this.currentItem.css("top"),
						left: this.currentItem.css("left")
					};

				if (helper[0].style.width == '' || o.forceHelperSize) helper.width(this.currentItem.width());
				if (helper[0].style.height == '' || o.forceHelperSize) helper.height(this.currentItem.height());

				return helper;

			},

			_adjustOffsetFromHelper: function(obj) {
				if (typeof obj == 'string') {
					obj = obj.split(' ');
				}
				if ($.isArray(obj)) {
					obj = {
						left: +obj[0],
						top: +obj[1] || 0
					};
				}
				if ('left' in obj) {
					this.offset.click.left = obj.left + this.margins.left;
				}
				if ('right' in obj) {
					this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
				}
				if ('top' in obj) {
					this.offset.click.top = obj.top + this.margins.top;
				}
				if ('bottom' in obj) {
					this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
				}
			},

			_getParentOffset: function() {


				//Get the offsetParent and cache its position
				this.offsetParent = this.helper.offsetParent();
				var po = this.offsetParent.offset();

				// This is a special case where we need to modify a offset calculated on start, since the following happened:
				// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
				// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
				//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
				if (this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) {
					po.left += this.scrollParent.scrollLeft();
					po.top += this.scrollParent.scrollTop();
				}

				if ((this.offsetParent[0] == document.body) //This needs to be actually done for all browsers, since pageX/pageY includes this information
					|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.ui.ie)) //Ugly IE fix
					po = {
						top: 0,
						left: 0
					};

				return {
					top: po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
					left: po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
				};

			},

			_getRelativeOffset: function() {

				if (this.cssPosition == "relative") {
					var p = this.currentItem.position();
					return {
						top: p.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
						left: p.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
					};
				} else {
					return {
						top: 0,
						left: 0
					};
				}

			},

			_cacheMargins: function() {
				this.margins = {
					left: (parseInt(this.currentItem.css("marginLeft"), 10) || 0),
					top: (parseInt(this.currentItem.css("marginTop"), 10) || 0)
				};
			},

			_cacheHelperProportions: function() {
				this.helperProportions = {
					width: this.helper.outerWidth(),
					height: this.helper.outerHeight()
				};
			},

			_setContainment: function() {

				var o = this.options;
				if (o.containment == 'parent') o.containment = this.helper[0].parentNode;
				if (o.containment == 'document' || o.containment == 'window') this.containment = [
					0 - this.offset.relative.left - this.offset.parent.left,
					0 - this.offset.relative.top - this.offset.parent.top,
					$(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left, ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top
				];

				if (!(/^(document|window|parent)$/).test(o.containment)) {
					var ce = $(o.containment)[0];
					var co = $(o.containment).offset();
					var over = ($(ce).css("overflow") != 'hidden');

					this.containment = [
						co.left + (parseInt($(ce).css("borderLeftWidth"), 10) || 0) + (parseInt($(ce).css("paddingLeft"), 10) || 0) - this.margins.left,
						co.top + (parseInt($(ce).css("borderTopWidth"), 10) || 0) + (parseInt($(ce).css("paddingTop"), 10) || 0) - this.margins.top,
						co.left + (over ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"), 10) || 0) - (parseInt($(ce).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left,
						co.top + (over ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"), 10) || 0) - (parseInt($(ce).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top
					];
				}

			},

			_convertPositionTo: function(d, pos) {

				if (!pos) pos = this.position;
				var mod = d == "absolute" ? 1 : -1;
				var o = this.options,
					scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
					scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

				return {
					top: (
						pos.top // The absolute mouse position
						+ this.offset.relative.top * mod // Only for relative positioned nodes: Relative offset from element to offset parent
						+ this.offset.parent.top * mod // The offsetParent's offset without borders (offset + border)
						- ((this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : (scrollIsRootNode ? 0 : scroll.scrollTop())) * mod)
					),
					left: (
						pos.left // The absolute mouse position
						+ this.offset.relative.left * mod // Only for relative positioned nodes: Relative offset from element to offset parent
						+ this.offset.parent.left * mod // The offsetParent's offset without borders (offset + border)
						- ((this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft()) * mod)
					)
				};

			},

			_generatePosition: function(event) {

				var o = this.options,
					scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent,
					scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

				// This is another very weird special case that only happens for relative elements:
				// 1. If the css position is relative
				// 2. and the scroll parent is the document or similar to the offset parent
				// we have to refresh the relative offset during the scroll so there are no jumps
				if (this.cssPosition == 'relative' && !(this.scrollParent[0] != document && this.scrollParent[0] != this.offsetParent[0])) {
					this.offset.relative = this._getRelativeOffset();
				}

				var pageX = event.pageX;
				var pageY = event.pageY;

				/*
				 * - Position constraining -
				 * Constrain the position to a mix of grid, containment.
				 */

				if (this.originalPosition) { //If we are not dragging yet, we won't check for options

					if (this.containment) {
						if (event.pageX - this.offset.click.left < this.containment[0]) pageX = this.containment[0] + this.offset.click.left;
						if (event.pageY - this.offset.click.top < this.containment[1]) pageY = this.containment[1] + this.offset.click.top;
						if (event.pageX - this.offset.click.left > this.containment[2]) pageX = this.containment[2] + this.offset.click.left;
						if (event.pageY - this.offset.click.top > this.containment[3]) pageY = this.containment[3] + this.offset.click.top;
					}

					if (o.grid) {
						var top = this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1];
						pageY = this.containment ? (!(top - this.offset.click.top < this.containment[1] || top - this.offset.click.top > this.containment[3]) ? top : (!(top - this.offset.click.top < this.containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

						var left = this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0];
						pageX = this.containment ? (!(left - this.offset.click.left < this.containment[0] || left - this.offset.click.left > this.containment[2]) ? left : (!(left - this.offset.click.left < this.containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
					}

				}

				return {
					top: (
						pageY // The absolute mouse position
						- this.offset.click.top // Click offset (relative to the element)
						- this.offset.relative.top // Only for relative positioned nodes: Relative offset from element to offset parent
						- this.offset.parent.top // The offsetParent's offset without borders (offset + border)
						+ ((this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : (scrollIsRootNode ? 0 : scroll.scrollTop())))
					),
					left: (
						pageX // The absolute mouse position
						- this.offset.click.left // Click offset (relative to the element)
						- this.offset.relative.left // Only for relative positioned nodes: Relative offset from element to offset parent
						- this.offset.parent.left // The offsetParent's offset without borders (offset + border)
						+ ((this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft()))
					)
				};

			},

			_rearrange: function(event, i, a, hardRefresh) {

				a ? a[0].appendChild(this.placeholder[0]) : i.item[0].parentNode.insertBefore(this.placeholder[0], (this.direction == 'down' ? i.item[0] : i.item[0].nextSibling));

				//Various things done here to improve the performance:
				// 1. we create a setTimeout, that calls refreshPositions
				// 2. on the instance, we have a counter variable, that get's higher after every append
				// 3. on the local scope, we copy the counter variable, and check in the timeout, if it's still the same
				// 4. this lets only the last addition to the timeout stack through
				this.counter = this.counter ? ++this.counter : 1;
				var counter = this.counter;

				this._delay(function() {
					if (counter == this.counter) this.refreshPositions(!hardRefresh); //Precompute after each DOM insertion, NOT on mousemove
				});

			},

			_clear: function(event, noPropagation) {

				this.reverting = false;
				// We delay all events that have to be triggered to after the point where the placeholder has been removed and
				// everything else normalized again
				var delayedTriggers = [];

				// We first have to update the dom position of the actual currentItem
				// Note: don't do it if the current item is already removed (by a user), or it gets reappended (see #4088)
				if (!this._noFinalSort && this.currentItem.parent().length) this.placeholder.before(this.currentItem);
				this._noFinalSort = null;

				if (this.helper[0] == this.currentItem[0]) {
					for (var i in this._storedCSS) {
						if (this._storedCSS[i] == 'auto' || this._storedCSS[i] == 'static') this._storedCSS[i] = '';
					}
					this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper");
				} else {
					this.currentItem.show();
				}

				if (this.fromOutside && !noPropagation) delayedTriggers.push(function(event) {
					this._trigger("receive", event, this._uiHash(this.fromOutside));
				});
				if ((this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !noPropagation) delayedTriggers.push(function(event) {
					this._trigger("update", event, this._uiHash());
				}); //Trigger update callback if the DOM position has changed

				// Check if the items Container has Changed and trigger appropriate
				// events.
				if (this !== this.currentContainer) {
					if (!noPropagation) {
						delayedTriggers.push(function(event) {
							this._trigger("remove", event, this._uiHash());
						});
						delayedTriggers.push((function(c) {
							return function(event) {
								c._trigger("receive", event, this._uiHash(this));
							};
						}).call(this, this.currentContainer));
						delayedTriggers.push((function(c) {
							return function(event) {
								c._trigger("update", event, this._uiHash(this));
							};
						}).call(this, this.currentContainer));
					}
				}


				//Post events to containers
				for (var i = this.containers.length - 1; i >= 0; i--) {
					if (!noPropagation) delayedTriggers.push((function(c) {
						return function(event) {
							c._trigger("deactivate", event, this._uiHash(this));
						};
					}).call(this, this.containers[i]));
					if (this.containers[i].containerCache.over) {
						delayedTriggers.push((function(c) {
							return function(event) {
								c._trigger("out", event, this._uiHash(this));
							};
						}).call(this, this.containers[i]));
						this.containers[i].containerCache.over = 0;
					}
				}

				//Do what was originally in plugins
				if (this._storedCursor) $('body').css("cursor", this._storedCursor); //Reset cursor
				if (this._storedOpacity) this.helper.css("opacity", this._storedOpacity); //Reset opacity
				if (this._storedZIndex) this.helper.css("zIndex", this._storedZIndex == 'auto' ? '' : this._storedZIndex); //Reset z-index

				this.dragging = false;
				if (this.cancelHelperRemoval) {
					if (!noPropagation) {
						this._trigger("beforeStop", event, this._uiHash());
						for (var i = 0; i < delayedTriggers.length; i++) {
							delayedTriggers[i].call(this, event);
						}; //Trigger all delayed events
						this._trigger("stop", event, this._uiHash());
					}

					this.fromOutside = false;
					return false;
				}

				if (!noPropagation) this._trigger("beforeStop", event, this._uiHash());

				//$(this.placeholder[0]).remove(); would have been the jQuery way - unfortunately, it unbinds ALL events from the original node!
				this.placeholder[0].parentNode.removeChild(this.placeholder[0]);

				if (this.helper[0] != this.currentItem[0]) this.helper.remove();
				this.helper = null;

				if (!noPropagation) {
					for (var i = 0; i < delayedTriggers.length; i++) {
						delayedTriggers[i].call(this, event);
					}; //Trigger all delayed events
					this._trigger("stop", event, this._uiHash());
				}

				this.fromOutside = false;
				return true;

			},

			_trigger: function() {
				if ($.Widget.prototype._trigger.apply(this, arguments) === false) {
					this.cancel();
				}
			},

			_uiHash: function(_inst) {
				var inst = _inst || this;
				return {
					helper: inst.helper,
					placeholder: inst.placeholder || $([]),
					position: inst.position,
					originalPosition: inst.originalPosition,
					offset: inst.positionAbs,
					item: inst.currentItem,
					sender: _inst ? _inst.element : null
				};
			}

		});

	})(jQuery);
	(function($, undefined) {

		// number of pages in a slider
		// (how many times can you page up/down to go through the whole range)
		var numPages = 5;

		$.widget("ui.slider", $.ui.mouse, {
			version: "1.9.1",
			widgetEventPrefix: "slide",

			options: {
				animate: false,
				distance: 0,
				max: 100,
				min: 0,
				orientation: "horizontal",
				range: false,
				step: 1,
				value: 0,
				values: null
			},

			_create: function() {
				var i, handleCount,
					o = this.options,
					existingHandles = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"),
					handle = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>",
					handles = [];

				this._keySliding = false;
				this._mouseSliding = false;
				this._animateOff = true;
				this._handleIndex = null;
				this._detectOrientation();
				this._mouseInit();

				this.element
					.addClass("ui-slider" +
						" ui-slider-" + this.orientation +
						" ui-widget" +
						" ui-widget-content" +
						" ui-corner-all" +
						(o.disabled ? " ui-slider-disabled ui-disabled" : ""));

				this.range = $([]);

				if (o.range) {
					if (o.range === true) {
						if (!o.values) {
							o.values = [this._valueMin(), this._valueMin()];
						}
						if (o.values.length && o.values.length !== 2) {
							o.values = [o.values[0], o.values[0]];
						}
					}

					this.range = $("<div></div>")
						.appendTo(this.element)
						.addClass("ui-slider-range" +
							// note: this isn't the most fittingly semantic framework class for this element,
							// but worked best visually with a variety of themes
							" ui-widget-header" +
							((o.range === "min" || o.range === "max") ? " ui-slider-range-" + o.range : ""));
				}

				handleCount = (o.values && o.values.length) || 1;

				for (i = existingHandles.length; i < handleCount; i++) {
					handles.push(handle);
				}

				this.handles = existingHandles.add($(handles.join("")).appendTo(this.element));

				this.handle = this.handles.eq(0);

				this.handles.add(this.range).filter("a")
					.click(function(event) {
						event.preventDefault();
					})
					.mouseenter(function() {
						if (!o.disabled) {
							$(this).addClass("ui-state-hover");
						}
					})
					.mouseleave(function() {
						$(this).removeClass("ui-state-hover");
					})
					.focus(function() {
						if (!o.disabled) {
							$(".ui-slider .ui-state-focus").removeClass("ui-state-focus");
							$(this).addClass("ui-state-focus");
						} else {
							$(this).blur();
						}
					})
					.blur(function() {
						$(this).removeClass("ui-state-focus");
					});

				this.handles.each(function(i) {
					$(this).data("ui-slider-handle-index", i);
				});

				this._on(this.handles, {
					keydown: function(event) {
						var allowed, curVal, newVal, step,
							index = $(event.target).data("ui-slider-handle-index");

						switch (event.keyCode) {
							case $.ui.keyCode.HOME:
							case $.ui.keyCode.END:
							case $.ui.keyCode.PAGE_UP:
							case $.ui.keyCode.PAGE_DOWN:
							case $.ui.keyCode.UP:
							case $.ui.keyCode.RIGHT:
							case $.ui.keyCode.DOWN:
							case $.ui.keyCode.LEFT:
								event.preventDefault();
								if (!this._keySliding) {
									this._keySliding = true;
									$(event.target).addClass("ui-state-active");
									allowed = this._start(event, index);
									if (allowed === false) {
										return;
									}
								}
								break;
						}

						step = this.options.step;
						if (this.options.values && this.options.values.length) {
							curVal = newVal = this.values(index);
						} else {
							curVal = newVal = this.value();
						}

						switch (event.keyCode) {
							case $.ui.keyCode.HOME:
								newVal = this._valueMin();
								break;
							case $.ui.keyCode.END:
								newVal = this._valueMax();
								break;
							case $.ui.keyCode.PAGE_UP:
								newVal = this._trimAlignValue(curVal + ((this._valueMax() - this._valueMin()) / numPages));
								break;
							case $.ui.keyCode.PAGE_DOWN:
								newVal = this._trimAlignValue(curVal - ((this._valueMax() - this._valueMin()) / numPages));
								break;
							case $.ui.keyCode.UP:
							case $.ui.keyCode.RIGHT:
								if (curVal === this._valueMax()) {
									return;
								}
								newVal = this._trimAlignValue(curVal + step);
								break;
							case $.ui.keyCode.DOWN:
							case $.ui.keyCode.LEFT:
								if (curVal === this._valueMin()) {
									return;
								}
								newVal = this._trimAlignValue(curVal - step);
								break;
						}

						this._slide(event, index, newVal);
					},
					keyup: function(event) {
						var index = $(event.target).data("ui-slider-handle-index");

						if (this._keySliding) {
							this._keySliding = false;
							this._stop(event, index);
							this._change(event, index);
							$(event.target).removeClass("ui-state-active");
						}
					}
				});

				this._refreshValue();

				this._animateOff = false;
			},

			_destroy: function() {
				this.handles.remove();
				this.range.remove();

				this.element
					.removeClass("ui-slider" +
						" ui-slider-horizontal" +
						" ui-slider-vertical" +
						" ui-slider-disabled" +
						" ui-widget" +
						" ui-widget-content" +
						" ui-corner-all");

				this._mouseDestroy();
			},

			_mouseCapture: function(event) {
				var position, normValue, distance, closestHandle, index, allowed, offset, mouseOverHandle,
					that = this,
					o = this.options;

				if (o.disabled) {
					return false;
				}

				this.elementSize = {
					width: this.element.outerWidth(),
					height: this.element.outerHeight()
				};
				this.elementOffset = this.element.offset();

				position = {
					x: event.pageX,
					y: event.pageY
				};
				normValue = this._normValueFromMouse(position);
				distance = this._valueMax() - this._valueMin() + 1;
				this.handles.each(function(i) {
					var thisDistance = Math.abs(normValue - that.values(i));
					if (distance > thisDistance) {
						distance = thisDistance;
						closestHandle = $(this);
						index = i;
					}
				});

				// workaround for bug #3736 (if both handles of a range are at 0,
				// the first is always used as the one with least distance,
				// and moving it is obviously prevented by preventing negative ranges)
				if (o.range === true && this.values(1) === o.min) {
					index += 1;
					closestHandle = $(this.handles[index]);
				}

				allowed = this._start(event, index);
				if (allowed === false) {
					return false;
				}
				this._mouseSliding = true;

				this._handleIndex = index;

				closestHandle
					.addClass("ui-state-active")
					.focus();

				offset = closestHandle.offset();
				mouseOverHandle = !$(event.target).parents().andSelf().is(".ui-slider-handle");
				this._clickOffset = mouseOverHandle ? {
					left: 0,
					top: 0
				} : {
					left: event.pageX - offset.left - (closestHandle.width() / 2),
					top: event.pageY - offset.top - (closestHandle.height() / 2) - (parseInt(closestHandle.css("borderTopWidth"), 10) || 0) - (parseInt(closestHandle.css("borderBottomWidth"), 10) || 0) + (parseInt(closestHandle.css("marginTop"), 10) || 0)
				};

				if (!this.handles.hasClass("ui-state-hover")) {
					this._slide(event, index, normValue);
				}
				this._animateOff = true;
				return true;
			},

			_mouseStart: function() {
				return true;
			},

			_mouseDrag: function(event) {
				var position = {
					x: event.pageX,
					y: event.pageY
				},
					normValue = this._normValueFromMouse(position);

				this._slide(event, this._handleIndex, normValue);

				return false;
			},

			_mouseStop: function(event) {
				this.handles.removeClass("ui-state-active");
				this._mouseSliding = false;

				this._stop(event, this._handleIndex);
				this._change(event, this._handleIndex);

				this._handleIndex = null;
				this._clickOffset = null;
				this._animateOff = false;

				return false;
			},

			_detectOrientation: function() {
				this.orientation = (this.options.orientation === "vertical") ? "vertical" : "horizontal";
			},

			_normValueFromMouse: function(position) {
				var pixelTotal,
					pixelMouse,
					percentMouse,
					valueTotal,
					valueMouse;

				if (this.orientation === "horizontal") {
					pixelTotal = this.elementSize.width;
					pixelMouse = position.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0);
				} else {
					pixelTotal = this.elementSize.height;
					pixelMouse = position.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0);
				}

				percentMouse = (pixelMouse / pixelTotal);
				if (percentMouse > 1) {
					percentMouse = 1;
				}
				if (percentMouse < 0) {
					percentMouse = 0;
				}
				if (this.orientation === "vertical") {
					percentMouse = 1 - percentMouse;
				}

				valueTotal = this._valueMax() - this._valueMin();
				valueMouse = this._valueMin() + percentMouse * valueTotal;

				return this._trimAlignValue(valueMouse);
			},

			_start: function(event, index) {
				var uiHash = {
					handle: this.handles[index],
					value: this.value()
				};
				if (this.options.values && this.options.values.length) {
					uiHash.value = this.values(index);
					uiHash.values = this.values();
				}
				return this._trigger("start", event, uiHash);
			},

			_slide: function(event, index, newVal) {
				var otherVal,
					newValues,
					allowed;

				if (this.options.values && this.options.values.length) {
					otherVal = this.values(index ? 0 : 1);

					if ((this.options.values.length === 2 && this.options.range === true) &&
						((index === 0 && newVal > otherVal) || (index === 1 && newVal < otherVal))
					) {
						newVal = otherVal;
					}

					if (newVal !== this.values(index)) {
						newValues = this.values();
						newValues[index] = newVal;
						// A slide can be canceled by returning false from the slide callback
						allowed = this._trigger("slide", event, {
							handle: this.handles[index],
							value: newVal,
							values: newValues
						});
						otherVal = this.values(index ? 0 : 1);
						if (allowed !== false) {
							this.values(index, newVal, true);
						}
					}
				} else {
					if (newVal !== this.value()) {
						// A slide can be canceled by returning false from the slide callback
						allowed = this._trigger("slide", event, {
							handle: this.handles[index],
							value: newVal
						});
						if (allowed !== false) {
							this.value(newVal);
						}
					}
				}
			},

			_stop: function(event, index) {
				var uiHash = {
					handle: this.handles[index],
					value: this.value()
				};
				if (this.options.values && this.options.values.length) {
					uiHash.value = this.values(index);
					uiHash.values = this.values();
				}

				this._trigger("stop", event, uiHash);
			},

			_change: function(event, index) {
				if (!this._keySliding && !this._mouseSliding) {
					var uiHash = {
						handle: this.handles[index],
						value: this.value()
					};
					if (this.options.values && this.options.values.length) {
						uiHash.value = this.values(index);
						uiHash.values = this.values();
					}

					this._trigger("change", event, uiHash);
				}
			},

			value: function(newValue) {
				if (arguments.length) {
					this.options.value = this._trimAlignValue(newValue);
					this._refreshValue();
					this._change(null, 0);
					return;
				}

				return this._value();
			},

			values: function(index, newValue) {
				var vals,
					newValues,
					i;

				if (arguments.length > 1) {
					this.options.values[index] = this._trimAlignValue(newValue);
					this._refreshValue();
					this._change(null, index);
					return;
				}

				if (arguments.length) {
					if ($.isArray(arguments[0])) {
						vals = this.options.values;
						newValues = arguments[0];
						for (i = 0; i < vals.length; i += 1) {
							vals[i] = this._trimAlignValue(newValues[i]);
							this._change(null, i);
						}
						this._refreshValue();
					} else {
						if (this.options.values && this.options.values.length) {
							return this._values(index);
						} else {
							return this.value();
						}
					}
				} else {
					return this._values();
				}
			},

			_setOption: function(key, value) {
				var i,
					valsLength = 0;

				if ($.isArray(this.options.values)) {
					valsLength = this.options.values.length;
				}

				$.Widget.prototype._setOption.apply(this, arguments);

				switch (key) {
					case "disabled":
						if (value) {
							this.handles.filter(".ui-state-focus").blur();
							this.handles.removeClass("ui-state-hover");
							this.handles.prop("disabled", true);
							this.element.addClass("ui-disabled");
						} else {
							this.handles.prop("disabled", false);
							this.element.removeClass("ui-disabled");
						}
						break;
					case "orientation":
						this._detectOrientation();
						this.element
							.removeClass("ui-slider-horizontal ui-slider-vertical")
							.addClass("ui-slider-" + this.orientation);
						this._refreshValue();
						break;
					case "value":
						this._animateOff = true;
						this._refreshValue();
						this._change(null, 0);
						this._animateOff = false;
						break;
					case "values":
						this._animateOff = true;
						this._refreshValue();
						for (i = 0; i < valsLength; i += 1) {
							this._change(null, i);
						}
						this._animateOff = false;
						break;
					case "min":
					case "max":
						this._animateOff = true;
						this._refreshValue();
						this._animateOff = false;
						break;
				}
			},

			//internal value getter
			// _value() returns value trimmed by min and max, aligned by step
			_value: function() {
				var val = this.options.value;
				val = this._trimAlignValue(val);

				return val;
			},

			//internal values getter
			// _values() returns array of values trimmed by min and max, aligned by step
			// _values( index ) returns single value trimmed by min and max, aligned by step
			_values: function(index) {
				var val,
					vals,
					i;

				if (arguments.length) {
					val = this.options.values[index];
					val = this._trimAlignValue(val);

					return val;
				} else {
					// .slice() creates a copy of the array
					// this copy gets trimmed by min and max and then returned
					vals = this.options.values.slice();
					for (i = 0; i < vals.length; i += 1) {
						vals[i] = this._trimAlignValue(vals[i]);
					}

					return vals;
				}
			},

			// returns the step-aligned value that val is closest to, between (inclusive) min and max
			_trimAlignValue: function(val) {
				if (val <= this._valueMin()) {
					return this._valueMin();
				}
				if (val >= this._valueMax()) {
					return this._valueMax();
				}
				var step = (this.options.step > 0) ? this.options.step : 1,
					valModStep = (val - this._valueMin()) % step,
					alignValue = val - valModStep;

				if (Math.abs(valModStep) * 2 >= step) {
					alignValue += (valModStep > 0) ? step : (-step);
				}

				// Since JavaScript has problems with large floats, round
				// the final value to 5 digits after the decimal point (see #4124)
				return parseFloat(alignValue.toFixed(5));
			},

			_valueMin: function() {
				return this.options.min;
			},

			_valueMax: function() {
				return this.options.max;
			},

			_refreshValue: function() {
				var lastValPercent, valPercent, value, valueMin, valueMax,
					oRange = this.options.range,
					o = this.options,
					that = this,
					animate = (!this._animateOff) ? o.animate : false,
					_set = {};

				if (this.options.values && this.options.values.length) {
					this.handles.each(function(i) {
						valPercent = (that.values(i) - that._valueMin()) / (that._valueMax() - that._valueMin()) * 100;
						_set[that.orientation === "horizontal" ? "left" : "bottom"] = valPercent + "%";
						$(this).stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);
						if (that.options.range === true) {
							if (that.orientation === "horizontal") {
								if (i === 0) {
									that.range.stop(1, 1)[animate ? "animate" : "css"]({
										left: valPercent + "%"
									}, o.animate);
								}
								if (i === 1) {
									that.range[animate ? "animate" : "css"]({
										width: (valPercent - lastValPercent) + "%"
									}, {
										queue: false,
										duration: o.animate
									});
								}
							} else {
								if (i === 0) {
									that.range.stop(1, 1)[animate ? "animate" : "css"]({
										bottom: (valPercent) + "%"
									}, o.animate);
								}
								if (i === 1) {
									that.range[animate ? "animate" : "css"]({
										height: (valPercent - lastValPercent) + "%"
									}, {
										queue: false,
										duration: o.animate
									});
								}
							}
						}
						lastValPercent = valPercent;
					});
				} else {
					value = this.value();
					valueMin = this._valueMin();
					valueMax = this._valueMax();
					valPercent = (valueMax !== valueMin) ?
						(value - valueMin) / (valueMax - valueMin) * 100 :
						0;
					_set[this.orientation === "horizontal" ? "left" : "bottom"] = valPercent + "%";
					this.handle.stop(1, 1)[animate ? "animate" : "css"](_set, o.animate);

					if (oRange === "min" && this.orientation === "horizontal") {
						this.range.stop(1, 1)[animate ? "animate" : "css"]({
							width: valPercent + "%"
						}, o.animate);
					}
					if (oRange === "max" && this.orientation === "horizontal") {
						this.range[animate ? "animate" : "css"]({
							width: (100 - valPercent) + "%"
						}, {
							queue: false,
							duration: o.animate
						});
					}
					if (oRange === "min" && this.orientation === "vertical") {
						this.range.stop(1, 1)[animate ? "animate" : "css"]({
							height: valPercent + "%"
						}, o.animate);
					}
					if (oRange === "max" && this.orientation === "vertical") {
						this.range[animate ? "animate" : "css"]({
							height: (100 - valPercent) + "%"
						}, {
							queue: false,
							duration: o.animate
						});
					}
				}
			}

		});

	}(jQuery));
	(function($) {

		var increments = 0;

		function addDescribedBy(elem, id) {
			var describedby = (elem.attr("aria-describedby") || "").split(/\s+/);
			describedby.push(id);
			elem
				.data("ui-tooltip-id", id)
				.attr("aria-describedby", $.trim(describedby.join(" ")));
		}

		function removeDescribedBy(elem) {
			var id = elem.data("ui-tooltip-id"),
				describedby = (elem.attr("aria-describedby") || "").split(/\s+/),
				index = $.inArray(id, describedby);
			if (index !== -1) {
				describedby.splice(index, 1);
			}

			elem.removeData("ui-tooltip-id");
			describedby = $.trim(describedby.join(" "));
			if (describedby) {
				elem.attr("aria-describedby", describedby);
			} else {
				elem.removeAttr("aria-describedby");
			}
		}

		$.widget("ui.tooltip", {
			version: "1.9.1",
			options: {
				content: function() {
					return $(this).attr("title");
				},
				hide: true,
				// Disabled elements have inconsistent behavior across browsers (#8661)
				items: "[title]:not([disabled])",
				position: {
					my: "left top+15",
					at: "left bottom",
					collision: "flipfit flipfit"
				},
				show: true,
				tooltipClass: null,
				track: false,

				// callbacks
				close: null,
				open: null
			},

			_create: function() {
				this._on({
					mouseover: "open",
					focusin: "open"
				});

				// IDs of generated tooltips, needed for destroy
				this.tooltips = {};
				// IDs of parent tooltips where we removed the title attribute
				this.parents = {};

				if (this.options.disabled) {
					this._disable();
				}
			},

			_setOption: function(key, value) {
				var that = this;

				if (key === "disabled") {
					this[value ? "_disable" : "_enable"]();
					this.options[key] = value;
					// disable element style changes
					return;
				}

				this._super(key, value);

				if (key === "content") {
					$.each(this.tooltips, function(id, element) {
						that._updateContent(element);
					});
				}
			},

			_disable: function() {
				var that = this;

				// close open tooltips
				$.each(this.tooltips, function(id, element) {
					var event = $.Event("blur");
					event.target = event.currentTarget = element[0];
					that.close(event, true);
				});

				// remove title attributes to prevent native tooltips
				this.element.find(this.options.items).andSelf().each(function() {
					var element = $(this);
					if (element.is("[title]")) {
						element
							.data("ui-tooltip-title", element.attr("title"))
							.attr("title", "");
					}
				});
			},

			_enable: function() {
				// restore title attributes
				this.element.find(this.options.items).andSelf().each(function() {
					var element = $(this);
					if (element.data("ui-tooltip-title")) {
						element.attr("title", element.data("ui-tooltip-title"));
					}
				});
			},

			open: function(event) {
				var that = this,
					target = $(event ? event.target : this.element)
					// we need closest here due to mouseover bubbling,
					// but always pointing at the same event target
					.closest(this.options.items);

				// No element to show a tooltip for
				if (!target.length) {
					return;
				}

				// If the tooltip is open and we're tracking then reposition the tooltip.
				// This makes sure that a tracking tooltip doesn't obscure a focused element
				// if the user was hovering when the element gained focused.
				if (this.options.track && target.data("ui-tooltip-id")) {
					this._find(target).position($.extend({
						of: target
					}, this.options.position));
					// Stop tracking (#8622)
					this._off(this.document, "mousemove");
					return;
				}

				if (target.attr("title")) {
					target.data("ui-tooltip-title", target.attr("title"));
				}

				target.data("tooltip-open", true);

				// kill parent tooltips, custom or native, for hover
				if (event && event.type === "mouseover") {
					target.parents().each(function() {
						var blurEvent;
						if ($(this).data("tooltip-open")) {
							blurEvent = $.Event("blur");
							blurEvent.target = blurEvent.currentTarget = this;
							that.close(blurEvent, true);
						}
						if (this.title) {
							$(this).uniqueId();
							that.parents[this.id] = {
								element: this,
								title: this.title
							};
							this.title = "";
						}
					});
				}

				this._updateContent(target, event);
			},

			_updateContent: function(target, event) {
				var content,
					contentOption = this.options.content,
					that = this;

				if (typeof contentOption === "string") {
					return this._open(event, target, contentOption);
				}

				content = contentOption.call(target[0], function(response) {
					// ignore async response if tooltip was closed already
					if (!target.data("tooltip-open")) {
						return;
					}
					// IE may instantly serve a cached response for ajax requests
					// delay this call to _open so the other call to _open runs first
					that._delay(function() {
						this._open(event, target, response);
					});
				});
				if (content) {
					this._open(event, target, content);
				}
			},

			_open: function(event, target, content) {
				var tooltip, events, delayedShow,
					positionOption = $.extend({}, this.options.position);

				if (!content) {
					return;
				}

				// Content can be updated multiple times. If the tooltip already
				// exists, then just update the content and bail.
				tooltip = this._find(target);
				if (tooltip.length) {
					tooltip.find(".ui-tooltip-content").html(content);
					return;
				}

				// if we have a title, clear it to prevent the native tooltip
				// we have to check first to avoid defining a title if none exists
				// (we don't want to cause an element to start matching [title])
				//
				// We use removeAttr only for key events, to allow IE to export the correct
				// accessible attributes. For mouse events, set to empty string to avoid
				// native tooltip showing up (happens only when removing inside mouseover).
				if (target.is("[title]")) {
					if (event && event.type === "mouseover") {
						target.attr("title", "");
					} else {
						target.removeAttr("title");
					}
				}

				tooltip = this._tooltip(target);
				addDescribedBy(target, tooltip.attr("id"));
				tooltip.find(".ui-tooltip-content").html(content);

				function position(event) {
					positionOption.of = event;
					if (tooltip.is(":hidden")) {
						return;
					}
					tooltip.position(positionOption);
				}
				if (this.options.track && event && /^mouse/.test(event.originalEvent.type)) {
					this._on(this.document, {
						mousemove: position
					});
					// trigger once to override element-relative positioning
					position(event);
				} else {
					tooltip.position($.extend({
						of: target
					}, this.options.position));
				}

				tooltip.hide();

				this._show(tooltip, this.options.show);
				// Handle tracking tooltips that are shown with a delay (#8644). As soon
				// as the tooltip is visible, position the tooltip using the most recent
				// event.
				if (this.options.show && this.options.show.delay) {
					delayedShow = setInterval(function() {
						if (tooltip.is(":visible")) {
							position(positionOption.of);
							clearInterval(delayedShow);
						}
					}, $.fx.interval);
				}

				this._trigger("open", event, {
					tooltip: tooltip
				});

				events = {
					keyup: function(event) {
						if (event.keyCode === $.ui.keyCode.ESCAPE) {
							var fakeEvent = $.Event(event);
							fakeEvent.currentTarget = target[0];
							this.close(fakeEvent, true);
						}
					},
					remove: function() {
						this._removeTooltip(tooltip);
					}
				};
				if (!event || event.type === "mouseover") {
					events.mouseleave = "close";
				}
				if (!event || event.type === "focusin") {
					events.focusout = "close";
				}
				this._on(target, events);
			},

			close: function(event) {
				var that = this,
					target = $(event ? event.currentTarget : this.element),
					tooltip = this._find(target);

				// disabling closes the tooltip, so we need to track when we're closing
				// to avoid an infinite loop in case the tooltip becomes disabled on close
				if (this.closing) {
					return;
				}

				// only set title if we had one before (see comment in _open())
				if (target.data("ui-tooltip-title")) {
					target.attr("title", target.data("ui-tooltip-title"));
				}

				removeDescribedBy(target);

				tooltip.stop(true);
				this._hide(tooltip, this.options.hide, function() {
					that._removeTooltip($(this));
				});

				target.removeData("tooltip-open");
				this._off(target, "mouseleave focusout keyup");
				// Remove 'remove' binding only on delegated targets
				if (target[0] !== this.element[0]) {
					this._off(target, "remove");
				}
				this._off(this.document, "mousemove");

				if (event && event.type === "mouseleave") {
					$.each(this.parents, function(id, parent) {
						parent.element.title = parent.title;
						delete that.parents[id];
					});
				}

				this.closing = true;
				this._trigger("close", event, {
					tooltip: tooltip
				});
				this.closing = false;
			},

			_tooltip: function(element) {
				var id = "ui-tooltip-" + increments++,
					tooltip = $("<div>")
						.attr({
							id: id,
							role: "tooltip"
						})
						.addClass("ui-tooltip ui-widget ui-corner-all ui-widget-content " +
							(this.options.tooltipClass || ""));
				$("<div>")
					.addClass("ui-tooltip-content")
					.appendTo(tooltip);
				tooltip.appendTo(this.document[0].body);
				if ($.fn.bgiframe) {
					tooltip.bgiframe();
				}
				this.tooltips[id] = element;
				return tooltip;
			},

			_find: function(target) {
				var id = target.data("ui-tooltip-id");
				return id ? $("#" + id) : $();
			},

			_removeTooltip: function(tooltip) {
				tooltip.remove();
				delete this.tooltips[tooltip.attr("id")];
			},

			_destroy: function() {
				var that = this;

				// close open tooltips
				$.each(this.tooltips, function(id, element) {
					// Delegate to close method to handle common cleanup
					var event = $.Event("blur");
					event.target = event.currentTarget = element[0];
					that.close(event, true);

					// Remove immediately; destroying an open tooltip doesn't use the
					// hide animation
					$("#" + id).remove();

					// Restore the title
					if (element.data("ui-tooltip-title")) {
						element.attr("title", element.data("ui-tooltip-title"));
						element.removeData("ui-tooltip-title");
					}
				});
			}
		});

	}(jQuery));
});
define('libraries/jquery/plugins/jquery.base64-modified',["jquery"], function(jQuery) {
  /*jslint adsafe: false, bitwise: true, browser: true, cap: false, css: false,
  debug: false, devel: true, eqeqeq: true, es5: false, evil: false,
  forin: false, fragment: false, immed: true, laxbreak: false, newcap: true,
  nomen: false, on: false, onevar: true, passfail: false, plusplus: true,
  regexp: false, rhino: true, safe: false, strict: false, sub: false,
  undef: true, white: false, widget: false, windows: false */
  /*global jQuery: false, window: false */
  //

  /*
   * Original code (c) 2010 Nick Galbreath
   * http://code.google.com/p/stringencoders/source/browse/#svn/trunk/javascript
   *
   * jQuery port (c) 2010 Carlo Zottmann
   * http://github.com/carlo/jquery-base64
   *
   * Permission is hereby granted, free of charge, to any person
   * obtaining a copy of this software and associated documentation
   * files (the "Software"), to deal in the Software without
   * restriction, including without limitation the rights to use,
   * copy, modify, merge, publish, distribute, sublicense, and/or sell
   * copies of the Software, and to permit persons to whom the
   * Software is furnished to do so, subject to the following
   * conditions:
   *
   * The above copyright notice and this permission notice shall be
   * included in all copies or substantial portions of the Software.
   *
   * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
   * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
   * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
   * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
   * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
   * WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
   * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
   * OTHER DEALINGS IN THE SOFTWARE.
   */

  /* base64 encode/decode compatible with window.btoa/atob
   *
   * window.atob/btoa is a Firefox extension to convert binary data (the "b")
   * to base64 (ascii, the "a").
   *
   * It is also found in Safari and Chrome.  It is not available in IE.
   *
   * if (!window.btoa) window.btoa = $.base64.encode
   * if (!window.atob) window.atob = $.base64.decode
   *
   * The original spec's for atob/btoa are a bit lacking
   * https://developer.mozilla.org/en/DOM/window.atob
   * https://developer.mozilla.org/en/DOM/window.btoa
   *
   * window.btoa and $.base64.encode takes a string where charCodeAt is [0,255]
   * If any character is not [0,255], then an exception is thrown.
   *
   * window.atob and $.base64.decode take a base64-encoded string
   * If the input length is not a multiple of 4, or contains invalid characters
   *   then an exception is thrown.
   */

  jQuery.base64 = (function($) {

    var _PADCHAR = "=",
      _ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
      _VERSION = "1.0";


    function _getbyte64(s, i) {
      // This is oddly fast, except on Chrome/V8.
      // Minimal or no improvement in performance by using a
      // object with properties mapping chars to value (eg. 'A': 0)

      var idx = _ALPHA.indexOf(s.charAt(i));

      if (idx === -1) {
        throw "Cannot decode base64";
      }

      return idx;
    }


    function _decode(s) {
      var pads = 0,
        i,
        b10,
        imax = s.length,
        x = [];

      s = String(s);

      if (imax === 0) {
        return s;
      }

      if (imax % 4 !== 0) {
        throw "Cannot decode base64";
      }

      if (s.charAt(imax - 1) === _PADCHAR) {
        pads = 1;

        if (s.charAt(imax - 2) === _PADCHAR) {
          pads = 2;
        }

        // either way, we want to ignore this last block
        imax -= 4;
      }

      for (i = 0; i < imax; i += 4) {
        b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12) | (_getbyte64(s, i + 2) << 6) | _getbyte64(s, i + 3);
        x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff, b10 & 0xff));
      }

      switch (pads) {
        case 1:
          b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12) | (_getbyte64(s, i + 2) << 6);
          x.push(String.fromCharCode(b10 >> 16, (b10 >> 8) & 0xff));
          break;

        case 2:
          b10 = (_getbyte64(s, i) << 18) | (_getbyte64(s, i + 1) << 12);
          x.push(String.fromCharCode(b10 >> 16));
          break;
      }

      return x.join("");
    }


    function _getbyte(s, i) {
      var x = s.charCodeAt(i);

      if (x > 255) {
        throw "INVALID_CHARACTER_ERR: DOM Exception 5";
      }

      return x;
    }


    function _encode(s) {
      if (arguments.length !== 1) {
        throw "SyntaxError: exactly one argument required";
      }

      s = String(s);

      var i,
        b10,
        x = [],
        imax = s.length - s.length % 3;

      if (s.length === 0) {
        return s;
      }

      for (i = 0; i < imax; i += 3) {
        b10 = (_getbyte(s, i) << 16) | (_getbyte(s, i + 1) << 8) | _getbyte(s, i + 2);
        x.push(_ALPHA.charAt(b10 >> 18));
        x.push(_ALPHA.charAt((b10 >> 12) & 0x3F));
        x.push(_ALPHA.charAt((b10 >> 6) & 0x3f));
        x.push(_ALPHA.charAt(b10 & 0x3f));
      }

      switch (s.length - imax) {
        case 1:
          b10 = _getbyte(s, i) << 16;
          x.push(_ALPHA.charAt(b10 >> 18) + _ALPHA.charAt((b10 >> 12) & 0x3F) + _PADCHAR + _PADCHAR);
          break;

        case 2:
          b10 = (_getbyte(s, i) << 16) | (_getbyte(s, i + 1) << 8);
          x.push(_ALPHA.charAt(b10 >> 18) + _ALPHA.charAt((b10 >> 12) & 0x3F) + _ALPHA.charAt((b10 >> 6) & 0x3f) + _PADCHAR);
          break;
      }

      return x.join("");
    }


    return {
      decode: _decode,
      encode: _encode,
      VERSION: _VERSION
    };

  }(jQuery));
});
/*
 * css.normalize.js https://raw.github.com/guybedford/require-css/master/normalize.js
 *
 * CSS Normalization
 *
 * CSS paths are normalized based on an optional basePath and the RequireJS config
 *
 * Usage:
 *   normalize(css, fromBasePath, toBasePath);
 *
 * css: the stylesheet content to normalize
 * fromBasePath: the absolute base path of the css relative to any root (but without ../ backtracking)
 * toBasePath: the absolute new base path of the css relative to the same root
 * 
 * Absolute dependencies are left untouched.
 *
 * Urls in the CSS are picked up by regular expressions.
 * These will catch all statements of the form:
 *
 * url(*)
 * url('*')
 * url("*")
 * 
 * @import '*'
 * @import "*"
 *
 * (and so also @import url(*) variations)
 *
 * For urls needing normalization
 *
 */

define('normalize',['require', 'module'], function(require, module) {
  
  // regular expression for removing double slashes
  // eg http://www.example.com//my///url/here -> http://www.example.com/my/url/here
  var slashes = /([^:])\/+/g
  var removeDoubleSlashes = function(uri) {
    return uri.replace(slashes, '$1/');
  }

  // given a relative URI, and two absolute base URIs, convert it from one base to another
  var protocolRegEx = /[^\:\/]*:\/\/([^\/])*/
  function convertURIBase(uri, fromBase, toBase) {
    if(uri.indexOf("data:") === 0)
      return uri;
    uri = removeDoubleSlashes(uri);
    // absolute urls are left in tact
    if (uri.match(/^\//) || uri.match(protocolRegEx))
      return uri;
    // if toBase specifies a protocol path, ensure this is the same protocol as fromBase, if not
    // use absolute path at fromBase
    var toBaseProtocol = toBase.match(protocolRegEx);
    var fromBaseProtocol = fromBase.match(protocolRegEx);
    if (fromBaseProtocol && (!toBaseProtocol || toBaseProtocol[1] != fromBaseProtocol[1] || toBaseProtocol[2] != fromBaseProtocol[2]))
      return absoluteURI(uri, fromBase);
    
    else {
      return relativeURI(absoluteURI(uri, fromBase), toBase);
    }
  };
  
  // given a relative URI, calculate the absolute URI
  function absoluteURI(uri, base) {
    if (uri.substr(0, 2) == './')
      uri = uri.substr(2);    
    
    var baseParts = base.split('/');
    var uriParts = uri.split('/');
    
    baseParts.pop();
    
    while (curPart = uriParts.shift())
      if (curPart == '..')
        baseParts.pop();
      else
        baseParts.push(curPart);
    
    return baseParts.join('/');
  };


  // given an absolute URI, calculate the relative URI
  function relativeURI(uri, base) {
    
    // reduce base and uri strings to just their difference string
    var baseParts = base.split('/');
    baseParts.pop();
    base = baseParts.join('/') + '/';
    i = 0;
    while (base.substr(i, 1) == uri.substr(i, 1))
      i++;
    while (base.substr(i, 1) != '/')
      i--;
    base = base.substr(i + 1);
    uri = uri.substr(i + 1);

    // each base folder difference is thus a backtrack
    baseParts = base.split('/');
    var uriParts = uri.split('/');
    out = '';
    while (baseParts.shift())
      out += '../';
    
    // finally add uri parts
    while (curPart = uriParts.shift())
      out += curPart + '/';
    
    return out.substr(0, out.length - 1);
  };
  
  var normalizeCSS = function(source, fromBase, toBase, cssBase) {

    fromBase = removeDoubleSlashes(fromBase);
    toBase = removeDoubleSlashes(toBase);

    var urlRegEx = /@import\s*("([^"]*)"|'([^']*)')|url\s*\(\s*(\s*"([^"]*)"|'([^']*)'|[^\)]*\s*)\s*\)/ig;
    var result, url, source;

    while (result = urlRegEx.exec(source)) {
      url = result[3] || result[2] || result[5] || result[6] || result[4];
      var newUrl;
      if (cssBase && url.substr(0, 1) == '/')
        newUrl = cssBase + url;
      else
        newUrl = convertURIBase(url, fromBase, toBase);
      var quoteLen = result[5] || result[6] ? 1 : 0;
      source = source.substr(0, urlRegEx.lastIndex - url.length - quoteLen - 1) + newUrl + source.substr(urlRegEx.lastIndex - quoteLen - 1);
      urlRegEx.lastIndex = urlRegEx.lastIndex + (newUrl.length - url.length);
    }
    
    return source;
  };
  
  normalizeCSS.convertURIBase = convertURIBase;
  
  return normalizeCSS;
});
/*
 * Require-CSS RequireJS css! loader plugin https://raw.github.com/guybedford/require-css/master/css.js
 * 0.0.8
 * Guy Bedford 2013
 * MIT
 */

/*
 *
 * Usage:
 *  require(['css!./mycssFile']);
 *
 * NB leave out the '.css' extension.
 *
 * - Fully supports cross origin CSS loading
 * - Works with builds
 *
 * Tested and working in (up to latest versions as of March 2013):
 * Android
 * iOS 6
 * IE 6 - 10
 * Chome 3 - 26
 * Firefox 3.5 - 19
 * Opera 10 - 12
 * 
 * browserling.com used for virtual testing environment
 *
 * Credit to B Cavalier & J Hann for the elegant IE 6 - 9 hack.
 * 
 * Sources that helped along the way:
 * - https://developer.mozilla.org/en-US/docs/Browser_detection_using_the_user_agent
 * - http://www.phpied.com/when-is-a-stylesheet-really-loaded/
 * - https://github.com/cujojs/curl/blob/master/src/curl/plugin/css.js
 *
 */

define('css',['./normalize'], function(normalize) {
  var i = 0;
  function indexOf(a, e) { for (var i=0, l=a.length; i < l; i++) if (a[i] === e) return i; return -1 }

  if (typeof window == 'undefined')
    return { load: function(n, r, load){ load() } };

  // set to true to enable test prompts for device testing
  var testing = false;
  
  var head = document.getElementsByTagName('head')[0];

  var engine = window.navigator.userAgent.match(/Trident\/([^ ;]*)|AppleWebKit\/([^ ;]*)|Opera\/([^ ;]*)|rv\:([^ ;]*)(.*?)Gecko\/([^ ;]*)|MSIE\s([^ ;]*)/);
  var hackLinks = false;

  if (!engine) {}
  else if (engine[1] || engine[7]) {
    hackLinks = parseInt(engine[1]) < 6 || parseInt(engine[7]) <= 9;
    engine = 'trident';
  }
  else if (engine[2]) {
    // unfortunately style querying still doesnt work with onload callback in webkit
    hackLinks = true;
    engine = 'webkit';
  }
  else if (engine[3]) {
    // engine = 'opera';
  }
  else if (engine[4]) {
    hackLinks = parseInt(engine[4]) < 18;
    engine = 'gecko';
  }
  else if (testing)
    alert('Engine detection failed');
  
  //main api object
  var cssAPI = {};

  var absUrlRegEx = /^\/|([^\:\/]*:)/;
  
  cssAPI.pluginBuilder = './css-builder';

  // used by layer builds to register their css buffers
  
  // the current layer buffer items (from addBuffer)
  var curBuffer = [];

  // the callbacks for buffer loads
  var onBufferLoad = {};

  // the full list of resources in the buffer
  var bufferResources = [];

  cssAPI.addBuffer = function(resourceId) {
    // just in case layer scripts are included twice, also check
    // against the previous buffers
    if (indexOf(curBuffer, resourceId) != -1)
      return;
    if (indexOf(bufferResources, resourceId) != -1)
      return;
    curBuffer.push(resourceId);
    bufferResources.push(resourceId);
  }
  cssAPI.setBuffer = function(css, isLess) {
    var pathname = window.location.pathname.split('/');
    pathname.pop();
    pathname = pathname.join('/') + '/';

    var baseParts = require.toUrl('base_url').split('/');
    baseParts.pop();
    var baseUrl = baseParts.join('/') + '/';
    baseUrl = normalize.convertURIBase(baseUrl, pathname, '/');
    if (!baseUrl.match(absUrlRegEx))
      baseUrl = '/' + baseUrl;
    if (baseUrl.substr(baseUrl.length - 1, 1) != '/')
      baseUrl = baseUrl + '/';

    cssAPI.inject(normalize(css, baseUrl, pathname));

    // set up attach callback if registered
    // clear the current buffer for the next layer
    // (just the less or css part as we have two buffers in one effectively)
    for (var i = 0; i < curBuffer.length; i++) {
      // find the resources in the less or css buffer dependening which one this is
      if ((isLess && curBuffer[i].substr(curBuffer[i].length - 5, 5) == '.less') ||
        (!isLess && curBuffer[i].substr(curBuffer[i].length - 4, 4) == '.css')) {
        (function(resourceId) {
          // mark that the onBufferLoad is about to be called (set to true if not already a callback function)
          onBufferLoad[resourceId] = onBufferLoad[resourceId] || true;

          // set a short timeout (as injection isn't instant in Chrome), then call the load
          setTimeout(function() {
            if (typeof onBufferLoad[resourceId] == 'function')
              onBufferLoad[resourceId]();
            // remove from onBufferLoad to indicate loaded
            delete onBufferLoad[resourceId];
          }, 7);
        })(curBuffer[i]);

        // remove the current resource from the buffer
        curBuffer.splice(i--, 1);
      }
    }
  }
  cssAPI.attachBuffer = function(resourceId, load) {
    // attach can happen during buffer collecting, or between injection and callback
    // we assume it is not possible to attach multiple callbacks
    // requirejs plugin load function ensures this by queueing duplicate calls

    // check if the resourceId is in the current buffer
    for (var i = 0; i < curBuffer.length; i++)
      if (curBuffer[i] == resourceId) {
        onBufferLoad[resourceId] = load;
        return true;
      }

    // check if the resourceId is waiting for injection callback
    // (onBufferLoad === true is a shortcut indicator for this)
    if (onBufferLoad[resourceId] === true) {
      onBufferLoad[resourceId] = load;
      return true;
    }

    // if it's in the full buffer list and not either of the above, its loaded already
    if (indexOf(bufferResources, resourceId) != -1) {
      load();
      return true;
    }
  }

  var webkitLoadCheck = function(link, callback) {
    setTimeout(function() {
      for (var i = 0; i < document.styleSheets.length; i++) {
        var sheet = document.styleSheets[i];
        if (sheet.href == link.href)
          return callback();
      }
      webkitLoadCheck(link, callback);
    }, 10);
  }

  var mozillaLoadCheck = function(style, callback) {
    setTimeout(function() {
      try {
        style.sheet.cssRules;
        return callback();
      } catch (e){}
      mozillaLoadCheck(style, callback);
    }, 10);
  }

  // ie link detection, as adapted from https://github.com/cujojs/curl/blob/master/src/curl/plugin/css.js
  if (engine == 'trident' && hackLinks) {
    var ieStyles = [],
      ieQueue = [],
      ieStyleCnt = 0;
    var ieLoad = function(url, callback) {
      var style;
      ieQueue.push({
        url: url,
        cb: callback
      });
      style = ieStyles.shift();
      if (!style && ieStyleCnt++ < 31) {
        style = document.createElement('style');
        head.appendChild(style);
      }
      if (style)
        ieLoadNextImport(style);
    }
    var ieLoadNextImport = function(style) {
      var curImport = ieQueue.shift();
      if (!curImport) {
        style.onload = noop;
        ieStyles.push(style);
        return;  
      }
      style.onload = function() {
        curImport.cb(curImport.ss);
        ieLoadNextImport(style);
      };
      try {
      var curSheet = style.styleSheet;
      curImport.ss = curSheet.imports[curSheet.addImport(curImport.url)];
      } catch (e) {
        alert("Got Error:" + e);
      }
    }
  }

  // uses the <link> load method
  var createLink = function(url) {
    var link = document.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    return link;
  }

  var noop = function(){}

  cssAPI.linkLoad = function(url, callback) {
    var timeout = setTimeout(function() {
      if (testing) alert('timeout');
      callback();
    }, waitSeconds * 1000 - 100);
    var _callback = function() {
      clearTimeout(timeout);
      if (link)
        link.onload = noop;
      // for style querying, a short delay still seems necessary
      setTimeout(callback, 7);
    }
    if (!hackLinks) {
      var link = createLink(url);
      link.onload = _callback;
      head.appendChild(link);
    }
    // hacks
    else {
      if (engine == 'webkit') {
        var link = createLink(url);
        webkitLoadCheck(link, _callback);
        head.appendChild(link);
      }
      else if (engine == 'gecko') {
        var style = document.createElement('style');
        style.textContent = '@import "' + url + '"';
        mozillaLoadCheck(style, _callback);
        head.appendChild(style);
      }
      else if (engine == 'trident')
        ieLoad(url, _callback);
    }
  }

  /* injection api */
  var progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'];
  var fileCache = {};
  var get = function(url, callback, errback) {
    if (fileCache[url]) {
      callback(fileCache[url]);
      return;
    }

    var xhr, i, progId;
    if (typeof XMLHttpRequest !== 'undefined')
      xhr = new XMLHttpRequest();
    else if (typeof ActiveXObject !== 'undefined')
      for (i = 0; i < 3; i += 1) {
        progId = progIds[i];
        try {
          xhr = new ActiveXObject(progId);
        }
        catch (e) {}
  
        if (xhr) {
          progIds = [progId];  // so faster next time
          break;
        }
      }
    
    xhr.open('GET', url, requirejs.inlineRequire ? false : true);
  
    xhr.onreadystatechange = function (evt) {
      var status, err;
      //Do not explicitly handle errors, those should be
      //visible via console output in the browser.
      if (xhr.readyState === 4) {
        status = xhr.status;
        if (status > 399 && status < 600) {
          //An http 4xx or 5xx error. Signal an error.
          err = new Error(url + ' HTTP status: ' + status);
          err.xhr = xhr;
          errback(err);
        }
        else {
          fileCache[url] = xhr.responseText;
          callback(xhr.responseText);
        }
      }
    };
    
    xhr.send(null);
  }
  //uses the <style> load method
  var styleCnt = 0;
  var curStyle;
  cssAPI.inject = function(css) {
    if (styleCnt < 31) {
      curStyle = document.createElement('style');
      curStyle.type = 'text/css';
      head.appendChild(curStyle);
      styleCnt++;
    }
    if (curStyle.styleSheet)
      curStyle.styleSheet.cssText += css;
    else
      curStyle.appendChild(document.createTextNode(css));
  }
  
  // NB add @media query support for media imports
  var importRegEx = /@import\s*(url)?\s*(('([^']*)'|"([^"]*)")|\(('([^']*)'|"([^"]*)"|([^\)]*))\))\s*;?/g;

  var pathname = window.location.pathname.split('/');
  pathname.pop();
  pathname = pathname.join('/') + '/';

  var loadCSS = function(fileUrl, callback, errback) {

    //make file url absolute
    if (!fileUrl.match(absUrlRegEx))
      fileUrl = '/' + normalize.convertURIBase(fileUrl, pathname, '/');

    get(fileUrl, function(css) {

      // normalize the css (except import statements)
      css = normalize(css, fileUrl, pathname);

      // detect all import statements in the css and normalize
      var importUrls = [];
      var importIndex = [];
      var importLength = [];
      var match;
      while (match = importRegEx.exec(css)) {
        var importUrl = match[4] || match[5] || match[7] || match[8] || match[9];

        importUrls.push(importUrl);
        importIndex.push(importRegEx.lastIndex - match[0].length);
        importLength.push(match[0].length);
      }

      // load the import stylesheets and substitute into the css
      var completeCnt = 0;
      for (var i = 0; i < importUrls.length; i++)
        (function(i) {
          loadCSS(importUrls[i], function(importCSS) {
            css = css.substr(0, importIndex[i]) + importCSS + css.substr(importIndex[i] + importLength[i]);
            var lenDiff = importCSS.length - importLength[i];
            for (var j = i + 1; j < importUrls.length; j++)
              importIndex[j] += lenDiff;
            completeCnt++;
            if (completeCnt == importUrls.length) {
              callback(css);
            }
          }, errback);
        })(i);

      if (importUrls.length == 0)
        callback(css);
    }, errback);
  }

  
  cssAPI.normalize = function(name, normalize) {
    if (name.substr(name.length - 4, 4) == '.css')
      name = name.substr(0, name.length - 4);
    
    return normalize(name);
  }
  
  var waitSeconds;
  var alerted = false;
  cssAPI.load = function(cssId, req, load, config, parse) {
    
    waitSeconds = waitSeconds || config.waitSeconds || 7;

    var resourceId = cssId + (!parse ? '.css' : '.less');

    // attach the load function to a buffer if there is one in registration
    // if not, we do a full injection load
    if (cssAPI.attachBuffer(resourceId, load))
      return;

    var fileUrl = req.toUrl(resourceId);
    
    if (!alerted && testing) {
      alert(hackLinks ? 'hacking links' : 'not hacking');
      alerted = true;
    }

    if (!parse) {
      cssAPI.linkLoad(fileUrl, load);
    }
    else {
      loadCSS(fileUrl, function(css) {
        // run parsing after normalization - since less is a CSS subset this works fine
        if (parse)
          css = parse(css, function(css) {
            cssAPI.inject(css);
            setTimeout(load, 7);
          });
      });
    }
  }

  if (testing)
    cssAPI.inspect = function() {
      if (stylesheet.styleSheet)
        return stylesheet.styleSheet.cssText;
      else if (stylesheet.innerHTML)
        return stylesheet.innerHTML;
    }
  
  return cssAPI;
});
requirejs.s.contexts._.nextTick = function(f){f()}; require(['css'], function(css) { css.addBuffer('resources/framework/bundle/oskariui/css/jquery-ui-1.9.1.custom.css'); }); requirejs.s.contexts._.nextTick = requirejs.nextTick;
requirejs.s.contexts._.nextTick = function(f){f()}; require(['css'], function(css) { css.addBuffer('resources/framework/bundle/oskariui/bootstrap-grid.css'); }); requirejs.s.contexts._.nextTick = requirejs.nextTick;
/**
 * @class Oskari.framework.bundle.oskariui.DomManager
 *
 
 */
Oskari.clazz.define('Oskari.framework.bundle.oskariui.DomManager',
    /**
     * @method create called automatically on construction
     * @static
     * @param {jQuery} jquery impl
     */

    function (dollar, partsMap) {
        this.$ = dollar;
        this.partsMap = partsMap || {};
        this.layout = null;
        this.layouts = [];
    }, {
        getEl: function (selector) {
            return this.$(selector);
        },
        getElForPart: function (part) {
            return this.$(this.partsMap[part]);
        },
        setElForPart: function (part, el) {
            this.partsMap[part] = this.$(el);
        },
        setElParts: function (partsMap) {
            this.partsMap = partsMap;
        },
        getElParts: function () {
            return this.partsMap;
        },
        pushLayout: function (l) {

            if (this.layout) {
                this.layout.removeLayout(this);
            }
            this.layout = l;
            this.layouts.push(l);
            l.applyLayout(this);
        },
        popLayout: function () {
            var l = this.layouts.pop();
            if (l) {
                l.removeLayout(this);
            }
            if (this.layouts.length === 0) {
                this.layout = null;
                return;
            }
            l = this.layouts[this.layouts.length - 1];
            this.layout = l;
            l.applyLayout(this);
        },
        getLayout: function () {
            return this.layout;
        }
    }, {
        /**
         * @property {String[]} protocol array of superclasses as {String}
         * @static
         */
        'protocol': ['Oskari.dom.DomManager']
    });
define("bundles/framework/bundle/oskariui/DomManager", function(){});

/**
 * @class Oskari.framework.bundle.oskariui.Layout
 *
 *
 */
Oskari.clazz.define('Oskari.framework.bundle.oskariui.Layout',
/**
 * @static constructor function
 */
function() {

}, {

	/**
	 * @method applyLayout
	 * applies this layout with given DomManager
	 */
	applyLayout : function(domManager) {

	},
	/**
	 * @method removeLayout
	 */
	removeLayout : function(domManager) {

	}
}, {
	"protocol" : ["Oskari.dom.Layout"]
});

define("bundles/framework/bundle/oskariui/Layout", function(){});

define('src/framework/oskariui/module',[
	"src/oskari/oskari",
	"jquery",
	"libraries/jquery/jquery-ui-1.9.1.custom-modified",
	"libraries/jquery/plugins/jquery.base64-modified",
	"css!resources/framework/bundle/oskariui/css/jquery-ui-1.9.1.custom",
	"css!resources/framework/bundle/oskariui/bootstrap-grid",
	"bundles/framework/bundle/oskariui/DomManager",
	"bundles/framework/bundle/oskariui/Layout"
], function(Oskari, jQuery) {
	return Oskari.bundleCls("oskariui").category({
		create: function() {
			return this;
		},
		update: function(manager, bundle, bi, info) {
		},
		start: function() {
			/* We'll add our own Dom Manager */
			var partsMap = this.conf.partsMap || {};
			var domMgr = Oskari.clazz.create('Oskari.framework.bundle.oskariui.DomManager', jQuery, partsMap);
			Oskari.setDomManager(domMgr);
		},
		stop: function() {
		}
	})
});
/*
 * PoC: API for Oskari 2.0
 *
 */
define('oskari-with-app',[
    "src/oskari/oskari",
    "src/oskari/base/module",
    "src/framework/oskariui/module"
], function(Oskari, platform) {
    Oskari.VERSION = "2.1.0"; // Overwrite

    var cs = Oskari.clazz;

    /* Simplified Application API for Oskari 2.0 */
    var App = Oskari.cls(undefined, function() {
        this.instances = {};
        this.startupSeq = [];
        this.config = Oskari.appConfig;
    }).methods({
        setConfiguration: function(c) {
            Oskari.setConfiguration(c);
            return this;
        },
        setStartupSequence: function(startup) {
            this.startupSeq = startup;
            return this;
        },
        success: function(s) {
            if (this.result)
                s(this.result);
            else
                this.successFunc = s;
            return this;
        },
        _startApplication: function(callback) {
            // start app
            var me = this,
                result = {},

                // start modules in the given startupSequence order
                startupSequence = me.startupSeq,
                startupSequenceLength = startupSequence.length,
                modules = [];


            // TODO: change startup sequense to an array of modules
            for (var i = 0; i < startupSequenceLength; i++) {
                modules.push(startupSequence[i].bundlename);
            }

//            Dynamic values cannot be optimized, change to static for optimization by listing the array values.
//            Log the modules and temporarily replace startupSequence with the console output or include all necessary modules in the build.
//            console.log('modules', modules);

            require(modules, function(item) {
                var module = null,
                    instance = null,
                    identifier = null;
                for (var i = 0, ilen = arguments.length; i < ilen; i++) {

                    module = arguments[i];
                    instance = module.start();
                    name = instance.getName();
                    
                    // store handle for observability while testing and debugging
                    me.instances[name] = instance;
                }

                if (callback) {
                    callback(result);
                }
            });

            return me;
        },
        start: function() {
            var me = this;
            var app = Oskari.app;
            me._startApplication(function(result) {
                if (me.successFunc)
                    me.successFunc(me);
                else
                    me.result = result;

            });
            return this;
        },
        stopApplication: function() {
            // nop atm
            return this;
        },
        getModuleInstances: function() {
            return this.instances;
        }
    });

    /* Generic shortcuts */

    Oskari.Application = App;

    var defaultIdentifier = 0;
    var ConfigurableModule = Oskari.cls('Oskari.Module', function() {
        console.log("CREATED CONFIGURABLE MODULE as BASE for MODULES");
    }, {
        extend: function(props) {
            // Bundles are structured to modules, however the refactoring is done gradually.
            // TODO: Change Oskari.bundleCls to Oskari.moduleClass
            var moduleClass = Oskari.bundleCls(props.identifier);

            moduleClass.category(props);
            moduleClass.category({
                create: function() {
                    console.log("CREATING MODULE INSTANCE ", this.extension, this.identifier, this.locale, this.configuration);
                    var instance =
                        this.extension.create(this.identifier || '_' + (++defaultIdentifier), this.locale);

                    var configProps = this.configuration || {};

                    for (ip in configProps) {
                        if (configProps.hasOwnProperty(ip)) {
                            instance.conf[ip] = configProps[ip];
                        }
                    }

                    console.log("- INSTANCE", instance, "post conf");
                    return instance;
                }

            });

            console.log("DECLARED MODULE CLASS", moduleClass);
            return moduleClass;
        }

    });

    Oskari.Module = ConfigurableModule.create();
    
    /* Event, Request support Classes */   
    
    
    /* Oskari.Event */
    /* example: 
     *   var evtCls = Oskari.Event.extend({ name: 'MyEvent' });
     *   var evt = evtCls.create({ 'prop': 'value' }); 
     *   Oskari.getSandbox().notifyAll(evt);  
     */ 
    var ExtendableEvent = 
     Oskari.cls('Oskari.Event', function() {
        console.log("CREATED EXTENDABLE EVENT as BASE for EVENTS");
    }, {
	extend : function(props) {
	   return Oskari.cls(props.name ? 'Oskari.event._.'+props.name: undefined,function(instanceProps) {
	        for (ip in instanceProps) {
	       	    if (instanceProps.hasOwnProperty(ip)) {
        		this[ip] = instanceProps[ip];
	            }	
        	}
	      },{
              getName : function() {
                return this.name;
              }
           },{
             protocol : ['Oskari.mapframework.event.Event']
           }).category(props);
	}
    });

    Oskari.Event = ExtendableEvent.create();
    
    /* Oskari.Request */
    /* example: 
     *   var reqCls = Oskari.Request.extend({ name: 'MyRequest'});
     *   var req = reqcls.create( { 'prop': 'value' });
     *   Oskari.getSandbox().request("MainMapModule", req);
     *    
     */ 
    var ExtendableRequest = 
     Oskari.cls('Oskari.Request', function() {
        console.log("CREATED EXTENDABLE REQUEST as BASE for REQUESTS");
    }, {
	extend : function(props) {
          return Oskari.cls(props.name ? 'Oskari.request._.'+props.name: undefined,function(instanceProps) {
            for (ip in instanceProps) {
              if (instanceProps.hasOwnProperty(ip)) {
                 this[ip] = instanceProps[ip];
              }
            }
         },{
           getName : function() {
                return this.name;
           }
         },{
           protocol : ['Oskari.mapframework.request.Request']
         }).category(props);
       }
     });

    Oskari.Request = ExtendableRequest.create();
   
    /* Object Generic class */
    /* example:
     *    // instantiate
     *    var obj = Oskari.Object.create({ 'prop' : 'value' });
     * 
     *    // extend 
     *    var objCls = Oskari.Object.extend( {
     *        funk: function() { return "obj extended "+this.prop; } 
     *   }); 
     *    // and instantiate
     *   var enhancedObj = objCls.create({ 'prop' : 'new value' });
     *   enhancedObj.funk();
     */ 
    Oskari.Object = Oskari.cls('Oskari.Object',function(instanceProps) {
        for (ip in instanceProps) {
            if (instanceProps.hasOwnProperty(ip)) {
                 this[ip] = instanceProps[ip];
            }
        }
    });
   
   
    

    return Oskari;

});

/**
 * @license RequireJS domReady 2.0.1 Copyright (c) 2010-2012, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/domReady for details
 */
/*jslint */
/*global require: false, define: false, requirejs: false,
  window: false, clearInterval: false, document: false,
  self: false, setInterval: false */


define('domReady',[],function () {
    

    var isTop, testDiv, scrollIntervalId,
        isBrowser = typeof window !== "undefined" && window.document,
        isPageLoaded = !isBrowser,
        doc = isBrowser ? document : null,
        readyCalls = [];

    function runCallbacks(callbacks) {
        var i;
        for (i = 0; i < callbacks.length; i += 1) {
            callbacks[i](doc);
        }
    }

    function callReady() {
        var callbacks = readyCalls;

        if (isPageLoaded) {
            //Call the DOM ready callbacks
            if (callbacks.length) {
                readyCalls = [];
                runCallbacks(callbacks);
            }
        }
    }

    /**
     * Sets the page as loaded.
     */
    function pageLoaded() {
        if (!isPageLoaded) {
            isPageLoaded = true;
            if (scrollIntervalId) {
                clearInterval(scrollIntervalId);
            }

            callReady();
        }
    }

    if (isBrowser) {
        if (document.addEventListener) {
            //Standards. Hooray! Assumption here that if standards based,
            //it knows about DOMContentLoaded.
            document.addEventListener("DOMContentLoaded", pageLoaded, false);
            window.addEventListener("load", pageLoaded, false);
        } else if (window.attachEvent) {
            window.attachEvent("onload", pageLoaded);

            testDiv = document.createElement('div');
            try {
                isTop = window.frameElement === null;
            } catch (e) {}

            //DOMContentLoaded approximation that uses a doScroll, as found by
            //Diego Perini: http://javascript.nwbox.com/IEContentLoaded/,
            //but modified by other contributors, including jdalton
            if (testDiv.doScroll && isTop && window.external) {
                scrollIntervalId = setInterval(function () {
                    try {
                        testDiv.doScroll();
                        pageLoaded();
                    } catch (e) {}
                }, 30);
            }
        }

        //Check if document already complete, and if so, just trigger page load
        //listeners. Latest webkit browsers also use "interactive", and
        //will fire the onDOMContentLoaded before "interactive" but not after
        //entering "interactive" or "complete". More details:
        //http://dev.w3.org/html5/spec/the-end.html#the-end
        //http://stackoverflow.com/questions/3665561/document-readystate-of-interactive-vs-ondomcontentloaded
        //Hmm, this is more complicated on further use, see "firing too early"
        //bug: https://github.com/requirejs/domReady/issues/1
        //so removing the || document.readyState === "interactive" test.
        //There is still a window.onload binding that should get fired if
        //DOMContentLoaded is missed.
        if (document.readyState === "complete") {
            pageLoaded();
        }
    }

    /** START OF PUBLIC API **/

    /**
     * Registers a callback for DOM ready. If DOM is already ready, the
     * callback is called immediately.
     * @param {Function} callback
     */
    function domReady(callback) {
        if (isPageLoaded) {
            callback(doc);
        } else {
            readyCalls.push(callback);
        }
        return domReady;
    }

    domReady.version = '2.0.1';

    /**
     * Loader Plugin API method
     */
    domReady.load = function (name, req, onLoad, config) {
        if (config.isBuild) {
            onLoad(null);
        } else {
            domReady(onLoad);
        }
    };

    /** END OF PUBLIC API **/

    return domReady;
});

require(["mainConfig"], function() {

    /* loading base requirements */
    require(["jquery", "oskari-with-app", "domReady"],
        /**
         * ... now we have jQuery and Oskari
         */

        function(jQuery, Oskari) {

            function getURLParameter(name) {
                var re = name + '=' + '([^&]*)(&|$)';
                var value = RegExp(re).exec(location.search);
                if (value && value.length && value.length > 1) {
                    value = value[1];
                }
                if (value) {
                    return decodeURI(value);
                }
                return null;
            }

            function gfiParamHandler(sandbox) {
                if (getURLParameter('showGetFeatureInfo') != 'true') {
                    return;
                }
                var lon = sandbox.getMap().getX();
                var lat = sandbox.getMap().getY();
                var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
                var px = mapModule.getMap().getViewPortPxFromLonLat({
                    lon: lon,
                    lat: lat
                });
                sandbox.postRequestByName('MapModulePlugin.GetFeatureInfoRequest', [lon, lat, px.x, px.y]);
            }

            var config = "json!applications/oskari2/leaflet/minifierAppSetup.json";
            if (window.ajaxUrl) {
                // populate url with possible control parameters
                var getAppSetupParams = "";
                if (typeof window.controlParams == 'object') {
                    for (var key in controlParams) {
                        getAppSetupParams += "&" + key + "=" + controlParams[key];
                    }
                }

                config = "json!" + window.ajaxUrl + "action_route=GetAppSetup" + getAppSetupParams;
            }

            /* loading configuration */
            require([config], function(appSetup) {

                Oskari.setLang(language);

                window.debugApp = Oskari.Application
                    .create()
                    .setStartupSequence(appSetup.startupSequence)
                    .setConfiguration(appSetup.configuration)
                    .start()
                    .success(function() { console.log("ALL DONE");});

                /* loading main map and divmanazer 
                require(["mapfull",
                    "mapmodule-plugin",
                    "src/framework/bundle/divmanazer/module"
                ], function(mapfull, mapmodule, divmanazer) {


                    /* starting to show user that something or another is happening *
//                    mapfull.start();
                    console.log('starting divmanazer');
//                    divmanazer.start();
                    console.log('divmanazer started');

                    var bundles = [];

                    for (bundle in appConfig) {
                        if ((bundle === "mapfull") || (bundle === "divmanazer") || (bundle === "openlayers-default-theme")) {
                            // already loaded
                        } else if (bundle === "statsgrid") {
                            bundles.push("bundles/statistics/bundle/" + bundle + "/module");
                        } else if (bundle === "metadataflyout") {
                            bundles.push("bundles/catalogue/bundle/" + bundle + "/module");
                        } else if (bundle === "infobox") {
                            bundles.push("src/leaflet/bundle/" + bundle + "/module");
                        } else {
                            bundles.push("bundles/framework/bundle/" + bundle + "/module");
                        }
                    }

                    //                console.log('bundles', bundles);

                    require(bundles, function() {

                        /*                require([
                    "bundles/framework/bundle/backendstatus/module",
                    "bundles/framework/bundle/guidedtour/module",
                    "bundles/framework/bundle/toolbar/module",
                    "bundles/framework/bundle/layerselection2/module",
                    "bundles/framework/bundle/userguide/module",
                    "bundles/framework/bundle/layerselector2/module",
                    "bundles/framework/bundle/personaldata/module",
                    "bundles/framework/bundle/publisher/module",
                    "bundles/framework/bundle/printout/module",
                    "bundles/framework/bundle/search/module",
                    "bundles/framework/bundle/maplegend/module",
                    "bundles/framework/bundle/featuredata/module",
                    "bundles/framework/bundle/divmanazer/module",
                    "bundles/framework/bundle/statehandler/module",
                    "bundles/framework/bundle/infobox/module",
                    "bundles/framework/bundle/coordinatedisplay/module",
                    "bundles/framework/bundle/promote/module"], function () {*
                        for (var i = 0, ilen = arguments.length; i < ilen; i++) {
//                            arguments[i].start();
                        }
                        console.log('Calling GFI Param Handler');
                        var sb = Oskari.getSandbox();
                        gfiParamHandler(sb);
                    });
                });
*/
            });
        });
});
define("applications/oskari2/leaflet/main-dev", function(){});

requirejs.s.contexts._.nextTick = function(f){f()}; require(['css'], function(css) { css.setBuffer('/*! jQuery UI - v1.9.1 - 2012-11-09\r\n* http://jqueryui.com\r\n* Includes: jquery.ui.core.css, jquery.ui.resizable.css, jquery.ui.selectable.css, jquery.ui.slider.css, jquery.ui.tooltip.css\r\n* To view and modify this theme, visit http://jqueryui.com/themeroller/?ffDefault=Segoe%20UI%2CArial%2Csans-serif&fwDefault=bold&fsDefault=1.1em&cornerRadius=6px&bgColorHeader=333333&bgTextureHeader=12_gloss_wave.png&bgImgOpacityHeader=25&borderColorHeader=333333&fcHeader=ffffff&iconColorHeader=ffffff&bgColorContent=000000&bgTextureContent=05_inset_soft.png&bgImgOpacityContent=25&borderColorContent=666666&fcContent=ffffff&iconColorContent=cccccc&bgColorDefault=555555&bgTextureDefault=02_glass.png&bgImgOpacityDefault=20&borderColorDefault=666666&fcDefault=eeeeee&iconColorDefault=cccccc&bgColorHover=0078a3&bgTextureHover=02_glass.png&bgImgOpacityHover=40&borderColorHover=59b4d4&fcHover=ffffff&iconColorHover=ffffff&bgColorActive=f58400&bgTextureActive=05_inset_soft.png&bgImgOpacityActive=30&borderColorActive=ffaf0f&fcActive=ffffff&iconColorActive=222222&bgColorHighlight=eeeeee&bgTextureHighlight=03_highlight_soft.png&bgImgOpacityHighlight=80&borderColorHighlight=cccccc&fcHighlight=2e7db2&iconColorHighlight=4b8e0b&bgColorError=ffc73d&bgTextureError=02_glass.png&bgImgOpacityError=40&borderColorError=ffb73d&fcError=111111&iconColorError=a83300&bgColorOverlay=5c5c5c&bgTextureOverlay=01_flat.png&bgImgOpacityOverlay=50&opacityOverlay=80&bgColorShadow=cccccc&bgTextureShadow=01_flat.png&bgImgOpacityShadow=30&opacityShadow=60&thicknessShadow=7px&offsetTopShadow=-7px&offsetLeftShadow=-7px&cornerRadiusShadow=8px\r\n* Copyright (c) 2012 jQuery Foundation and other contributors Licensed MIT */\r\n\r\n/* Layout helpers\r\n----------------------------------*/\r\n.oskariui .ui-helper-hidden { display: none; }\r\n.oskariui .ui-helper-hidden-accessible { position: absolute !important; clip: rect(1px,1px,1px,1px); clip: rect(1px,1px,1px,1px); }\r\n.oskariui .ui-helper-reset { margin: 0; padding: 0; border: 0; outline: 0; line-height: 1.3; text-decoration: none; font-size: 100%; list-style: none; }\r\n.oskariui .ui-helper-clearfix:before, .ui-helper-clearfix:after { content: \"\"; display: table; }\r\n.oskariui .ui-helper-clearfix:after { clear: both; }\r\n.oskariui .ui-helper-clearfix { zoom: 1; }\r\n.oskariui .ui-helper-zfix { width: 100%; height: 100%; top: 0; left: 0; position: absolute; opacity: 0; filter:Alpha(Opacity=0); }\r\n\r\n\r\n/* Interaction Cues\r\n----------------------------------*/\r\n.oskariui .ui-state-disabled { cursor: default !important; }\r\n\r\n\r\n/* Icons\r\n----------------------------------*/\r\n\r\n/* states and images */\r\n.oskariui .ui-icon { display: block; text-indent: -99999px; overflow: hidden; background-repeat: no-repeat; }\r\n\r\n\r\n/* Misc visuals\r\n----------------------------------*/\r\n\r\n/* Overlays */\r\n.oskariui .ui-widget-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; }\r\n.oskariui .ui-resizable { position: relative;}\r\n.oskariui .ui-resizable-handle { position: absolute;font-size: 0.1px; display: block; }\r\n.oskariui .ui-resizable-disabled .ui-resizable-handle, .ui-resizable-autohide .ui-resizable-handle { display: none; }\r\n.oskariui .ui-resizable-n { cursor: n-resize; height: 7px; width: 100%; top: -5px; left: 0; }\r\n.oskariui .ui-resizable-s { cursor: s-resize; height: 7px; width: 100%; bottom: -5px; left: 0; }\r\n.oskariui .ui-resizable-e { cursor: e-resize; width: 7px; right: -5px; top: 0; height: 100%; }\r\n.oskariui .ui-resizable-w { cursor: w-resize; width: 7px; left: -5px; top: 0; height: 100%; }\r\n.oskariui .ui-resizable-se { cursor: se-resize; width: 12px; height: 12px; right: 1px; bottom: 1px; }\r\n.oskariui .ui-resizable-sw { cursor: sw-resize; width: 9px; height: 9px; left: -5px; bottom: -5px; }\r\n.oskariui .ui-resizable-nw { cursor: nw-resize; width: 9px; height: 9px; left: -5px; top: -5px; }\r\n.oskariui .ui-resizable-ne { cursor: ne-resize; width: 9px; height: 9px; right: -5px; top: -5px;}.ui-selectable-helper { position: absolute; border:1px dotted black; }\r\n\r\n.oskariui .ui-slider { position: relative; text-align: left; }\r\n.oskariui .ui-slider .ui-slider-handle { position: absolute; width: 16px; height: 17px; cursor: default; }\r\n.oskariui .ui-slider .ui-slider-range { position: absolute; font-size: .7em; display: block; border: 0; background-position: 0 0; }\r\n\r\n.oskariui .ui-slider-horizontal { height: 14px; }\r\n.oskariui .ui-slider-horizontal .ui-slider-handle { background-image: url(\'/Oskari/resources/framework/bundle/oskariui/images/horizontal_handle.png\'); background-repeat: no-repeat;}\r\n\r\n.oskariui .ui-slider-horizontal .ui-slider-range { top: 0; height: 100%; }\r\n.oskariui .ui-slider-horizontal .ui-slider-range-min { left: 0; }\r\n.oskariui .ui-slider-horizontal .ui-slider-range-max { right: 0; }\r\n\r\n.oskariui .ui-slider-vertical { margin-left: 2px; width: 24px; background-image: url(\'/Oskari/resources/framework/bundle/oskariui/images/zoombar_part.png\'); background-repeat: repeat-y; }\r\n.oskariui .ui-slider-vertical .ui-slider-handle { margin-left: 0; background-image: url(\'/Oskari/resources/framework/bundle/oskariui/images/zoombar_cursor.png\'); background-repeat: no-repeat;}\r\n.oskariui .ui-slider-vertical .ui-slider-range { left: 0; width: 100%; }\r\n.oskariui .ui-slider-vertical .ui-slider-range-min { bottom: 0; }\r\n.oskariui .ui-slider-vertical .ui-slider-range-max { top: 0; }.ui-tooltip {\r\n\tpadding: 8px;\r\n\tposition: absolute;\r\n\tz-index: 9999;\r\n\tmax-width: 300px;\r\n\t-webkit-box-shadow: 0 0 5px #aaa;\r\n\tbox-shadow: 0 0 5px #aaa;\r\n}\r\n/* Fades and background-images don\'t work well together in IE6, drop the image */\r\n* html .ui-tooltip {\r\n\tbackground-image: none;\r\n}\r\nbody .oskariui .ui-tooltip { border-width: 2px; }\r\n\r\n/* Component containers\r\n----------------------------------*/\r\n.oskariui .ui-widget { font-family: Segoe UI,Arial,sans-serif; font-size: 1.1em; }\r\n.oskariui .ui-widget .ui-widget { font-size: 1em; }\r\n.oskariui .ui-widget input, .oskariui .ui-widget select, .oskariui .ui-widget textarea, .oskariui .ui-widget button { font-family: Segoe UI,Arial,sans-serif; font-size: 1em; }\r\n.oskariui .ui-widget-content {  }\r\n.oskariui .ui-widget-content a {  }\r\n.oskariui .ui-widget-header {  }\r\n.oskariui .ui-widget-header a {  }\r\n\r\n/* Interaction states\r\n----------------------------------*/\r\n.oskariui .ui-state-default, .oskariui .ui-widget-content .ui-state-default, .oskariui .ui-widget-header .ui-state-default {  }\r\n.oskariui .ui-state-default a, .oskariui .ui-state-default a:link, .oskariui .ui-state-default a:visited {  }\r\n.oskariui .ui-state-hover, .oskariui .ui-widget-content .ui-state-hover, .oskariui .ui-widget-header .ui-state-hover, .oskariui .ui-state-focus, .oskariui .ui-widget-content .ui-state-focus, .oskariui .ui-widget-header .ui-state-focus {  }\r\n.oskariui .ui-state-hover a, .oskariui .ui-state-hover a:hover, .oskariui .ui-state-hover a:link, .oskariui .ui-state-hover a:visited { }\r\n.oskariui .ui-state-active, .oskariui .ui-widget-content .ui-state-active, .oskariui .ui-widget-header .ui-state-active {  }\r\n.oskariui .ui-state-active a, .oskariui .ui-state-active a:link, .oskariui .ui-state-active a:visited {  }\r\n\r\n/* Interaction Cues\r\n----------------------------------*/\r\n.oskariui .ui-state-highlight, .oskariui .ui-widget-content .ui-state-highlight, .oskariui .ui-widget-header .ui-state-highlight  { }\r\n.oskariui .ui-state-highlight a, .oskariui .ui-widget-content .ui-state-highlight a,.oskariui .ui-widget-header .ui-state-highlight a { }\r\n.oskariui .ui-state-error, .oskariui .ui-widget-content .ui-state-error, .oskariui .ui-widget-header .ui-state-error { }\r\n.oskariui .ui-state-error a, .oskariui .ui-widget-content .ui-state-error a, .oskariui .ui-widget-header .ui-state-error a { }\r\n.oskariui .ui-state-error-text, .oskariui .ui-widget-content .ui-state-error-text, .oskariui .ui-widget-header .ui-state-error-text {  }\r\n.oskariui .ui-priority-primary, .oskariui .ui-widget-content .ui-priority-primary, .oskariui .ui-widget-header .ui-priority-primary {  }\r\n.oskariui .ui-priority-secondary, .oskariui .ui-widget-content .ui-priority-secondary,  .oskariui .ui-widget-header .ui-priority-secondary { }\r\n.oskariui .ui-state-disabled, .oskariui .ui-widget-content .ui-state-disabled, .oskariui .ui-widget-header .ui-state-disabled {  }\r\n.oskariui .ui-state-disabled .ui-icon { filter:Alpha(Opacity=35); } /* For IE8 - See #6059 */\r\n\r\n/* Icons\r\n----------------------------------*/\r\n\r\n/* states and images */\r\n.oskariui .ui-icon { width: 16px; height: 16px; }\r\n.oskariui .ui-widget-content .ui-icon { }\r\n.oskariui .ui-widget-header .ui-icon { }\r\n.oskariui .ui-state-default .ui-icon {  }\r\n.oskariui .ui-state-hover .ui-icon, .oskariui .ui-state-focus .ui-icon {}\r\n.oskariui .ui-state-active .ui-icon { }\r\n.oskariui .ui-state-highlight .ui-icon { }\r\n.oskariui .ui-state-error .ui-icon, .oskariui .ui-state-error-text .ui-icon { }\r\n\r\n\r\n/* Misc visuals\r\n----------------------------------*/\r\n\r\n/* Corner radius */\r\n.oskariui .ui-corner-all, .oskariui .ui-corner-top, .oskariui .ui-corner-left, .oskariui .ui-corner-tl { -moz-border-radius-topleft: 6px; -webkit-border-top-left-radius: 6px; -khtml-border-top-left-radius: 6px; border-top-left-radius: 6px; }\r\n.oskariui .ui-corner-all, .oskariui .ui-corner-top, .oskariui .ui-corner-right, .oskariui .ui-corner-tr { -moz-border-radius-topright: 6px; -webkit-border-top-right-radius: 6px; -khtml-border-top-right-radius: 6px; border-top-right-radius: 6px; }\r\n.oskariui .ui-corner-all, .oskariui .ui-corner-bottom, .oskariui .ui-corner-left, .oskariui .ui-corner-bl { -moz-border-radius-bottomleft: 6px; -webkit-border-bottom-left-radius: 6px; -khtml-border-bottom-left-radius: 6px; border-bottom-left-radius: 6px; }\r\n.oskariui .ui-corner-all, .oskariui .ui-corner-bottom, .oskariui .ui-corner-right, .oskariui .ui-corner-br { -moz-border-radius-bottomright: 6px; -webkit-border-bottom-right-radius: 6px; -khtml-border-bottom-right-radius: 6px; border-bottom-right-radius: 6px; }\r\n\r\n/* Overlays */\r\n.oskariui .ui-widget-overlay { background: #5c5c5c url(resources/framework/bundle/oskariui/css/images/ui-bg_flat_50_5c5c5c_40x100.png) 50% 50% repeat-x; opacity: .8;filter:Alpha(Opacity=80); }\r\n.oskariui .ui-widget-shadow { margin: -7px 0 0 -7px; padding: 7px; background: #cccccc url(resources/framework/bundle/oskariui/css/images/ui-bg_flat_30_cccccc_40x100.png) 50% 50% repeat-x; opacity: .6;filter:Alpha(Opacity=60); -moz-border-radius: 8px; -khtml-border-radius: 8px; -webkit-border-radius: 8px; border-radius: 8px; }\r\n/*!\r\n * Bootstrap v2.3.1\r\n *\r\n * Copyright 2012 Twitter, Inc\r\n * Licensed under the Apache License v2.0\r\n * http://www.apache.org/licenses/LICENSE-2.0\r\n *\r\n * Designed and built with all the love in the world @twitter by @mdo and @fat.\r\n */\r\n.oskariui .clearfix {\r\n  *zoom: 1;\r\n}\r\n.oskariui .clearfix:before,\r\n.oskariui .clearfix:after {\r\n  display: table;\r\n  content: \"\";\r\n  line-height: 0;\r\n}\r\n.oskariui .clearfix:after {\r\n  clear: both;\r\n}\r\n.oskariui .hide-text {\r\n  font: 0/0 a;\r\n  color: transparent;\r\n  text-shadow: none;\r\n  background-color: transparent;\r\n  border: 0;\r\n}\r\n.oskariui .input-block-level {\r\n  display: block;\r\n  width: 100%;\r\n  min-height: 30px;\r\n  -webkit-box-sizing: border-box;\r\n  -moz-box-sizing: border-box;\r\n  box-sizing: border-box;\r\n}\r\n.oskariui .row {\r\n  margin-left: -20px;\r\n  *zoom: 1;\r\n}\r\n.oskariui .row:before,\r\n.oskariui .row:after {\r\n  display: table;\r\n  content: \"\";\r\n  line-height: 0;\r\n}\r\n.oskariui .row:after {\r\n  clear: both;\r\n}\r\n[class*=\"span\"] {\r\n  float: left;\r\n  min-height: 1px;\r\n  margin-left: 20px;\r\n}\r\n.oskariui .container,\r\n.oskariui .navbar-static-top .container,\r\n.oskariui .navbar-fixed-top .container,\r\n.oskariui .navbar-fixed-bottom .container {\r\n  width: 940px;\r\n}\r\n.oskariui .span12 {\r\n  width: 940px;\r\n}\r\n.oskariui .span11 {\r\n  width: 860px;\r\n}\r\n.oskariui .span10 {\r\n  width: 780px;\r\n}\r\n.oskariui .span9 {\r\n  width: 700px;\r\n}\r\n.oskariui .span8 {\r\n  width: 620px;\r\n}\r\n.oskariui .span7 {\r\n  width: 540px;\r\n}\r\n.oskariui .span6 {\r\n  width: 460px;\r\n}\r\n.oskariui .span5 {\r\n  width: 380px;\r\n}\r\n.oskariui .span4 {\r\n  width: 300px;\r\n}\r\n.oskariui .span3 {\r\n  width: 220px;\r\n}\r\n.oskariui .span2 {\r\n  width: 140px;\r\n}\r\n.oskariui .span1 {\r\n  width: 60px;\r\n}\r\n.oskariui .offset12 {\r\n  margin-left: 980px;\r\n}\r\n.oskariui .offset11 {\r\n  margin-left: 900px;\r\n}\r\n.oskariui .offset10 {\r\n  margin-left: 820px;\r\n}\r\n.oskariui .offset9 {\r\n  margin-left: 740px;\r\n}\r\n.oskariui .offset8 {\r\n  margin-left: 660px;\r\n}\r\n.oskariui .offset7 {\r\n  margin-left: 580px;\r\n}\r\n.oskariui .offset6 {\r\n  margin-left: 500px;\r\n}\r\n.oskariui .offset5 {\r\n  margin-left: 420px;\r\n}\r\n.oskariui .offset4 {\r\n  margin-left: 340px;\r\n}\r\n.oskariui .offset3 {\r\n  margin-left: 260px;\r\n}\r\n.oskariui .offset2 {\r\n  margin-left: 180px;\r\n}\r\n.oskariui .offset1 {\r\n  margin-left: 100px;\r\n}\r\n.oskariui .row-fluid {\r\n  width: 100%;\r\n  *zoom: 1;\r\n}\r\n.oskariui .row-fluid:before,\r\n.oskariui .row-fluid:after {\r\n  display: table;\r\n  content: \"\";\r\n  line-height: 0;\r\n}\r\n.oskariui .row-fluid:after {\r\n  clear: both;\r\n}\r\n.oskariui .row-fluid [class*=\"span\"] {\r\n  display: block;\r\n  width: 100%;\r\n  min-height: 30px;\r\n  -webkit-box-sizing: border-box;\r\n  -moz-box-sizing: border-box;\r\n  box-sizing: border-box;\r\n  float: left;\r\n  margin-left: 2.127659574468085%;\r\n  *margin-left: 2.074468085106383%;\r\n}\r\n.oskariui .row-fluid [class*=\"span\"]:first-child {\r\n  margin-left: 0;\r\n}\r\n.oskariui .row-fluid .controls-row [class*=\"span\"] + [class*=\"span\"] {\r\n  margin-left: 2.127659574468085%;\r\n}\r\n.oskariui .row-fluid .span12 {\r\n  width: 100%;\r\n  *width: 99.94680851063829%;\r\n}\r\n.oskariui .row-fluid .span11 {\r\n  width: 91.48936170212765%;\r\n  *width: 91.43617021276594%;\r\n}\r\n.oskariui .row-fluid .span10 {\r\n  width: 82.97872340425532%;\r\n  *width: 82.92553191489361%;\r\n}\r\n.oskariui .row-fluid .span9 {\r\n  width: 74.46808510638297%;\r\n  *width: 74.41489361702126%;\r\n}\r\n.oskariui .row-fluid .span8 {\r\n  width: 65.95744680851064%;\r\n  *width: 65.90425531914893%;\r\n}\r\n.oskariui .row-fluid .span7 {\r\n  width: 57.44680851063829%;\r\n  *width: 57.39361702127659%;\r\n}\r\n.oskariui .row-fluid .span6 {\r\n  width: 48.93617021276595%;\r\n  *width: 48.88297872340425%;\r\n}\r\n.oskariui .row-fluid .span5 {\r\n  width: 40.42553191489362%;\r\n  *width: 40.37234042553192%;\r\n}\r\n.oskariui .row-fluid .span4 {\r\n  width: 31.914893617021278%;\r\n  *width: 31.861702127659576%;\r\n}\r\n.oskariui .row-fluid .span3 {\r\n  width: 23.404255319148934%;\r\n  *width: 23.351063829787233%;\r\n}\r\n.oskariui .row-fluid .span2 {\r\n  width: 14.893617021276595%;\r\n  *width: 14.840425531914894%;\r\n}\r\n.oskariui .row-fluid .span1 {\r\n  width: 6.382978723404255%;\r\n  *width: 6.329787234042553%;\r\n}\r\n.oskariui .row-fluid .offset12 {\r\n  margin-left: 104.25531914893617%;\r\n  *margin-left: 104.14893617021275%;\r\n}\r\n.oskariui .row-fluid .offset12:first-child {\r\n  margin-left: 102.12765957446808%;\r\n  *margin-left: 102.02127659574467%;\r\n}\r\n.oskariui .row-fluid .offset11 {\r\n  margin-left: 95.74468085106382%;\r\n  *margin-left: 95.6382978723404%;\r\n}\r\n.oskariui .row-fluid .offset11:first-child {\r\n  margin-left: 93.61702127659574%;\r\n  *margin-left: 93.51063829787232%;\r\n}\r\n.oskariui .row-fluid .offset10 {\r\n  margin-left: 87.23404255319149%;\r\n  *margin-left: 87.12765957446807%;\r\n}\r\n.oskariui .row-fluid .offset10:first-child {\r\n  margin-left: 85.1063829787234%;\r\n  *margin-left: 84.99999999999999%;\r\n}\r\n.oskariui .row-fluid .offset9 {\r\n  margin-left: 78.72340425531914%;\r\n  *margin-left: 78.61702127659572%;\r\n}\r\n.oskariui .row-fluid .offset9:first-child {\r\n  margin-left: 76.59574468085106%;\r\n  *margin-left: 76.48936170212764%;\r\n}\r\n.oskariui .row-fluid .offset8 {\r\n  margin-left: 70.2127659574468%;\r\n  *margin-left: 70.10638297872339%;\r\n}\r\n.oskariui .row-fluid .offset8:first-child {\r\n  margin-left: 68.08510638297872%;\r\n  *margin-left: 67.9787234042553%;\r\n}\r\n.oskariui .row-fluid .offset7 {\r\n  margin-left: 61.70212765957446%;\r\n  *margin-left: 61.59574468085106%;\r\n}\r\n.oskariui .row-fluid .offset7:first-child {\r\n  margin-left: 59.574468085106375%;\r\n  *margin-left: 59.46808510638297%;\r\n}\r\n.oskariui .row-fluid .offset6 {\r\n  margin-left: 53.191489361702125%;\r\n  *margin-left: 53.085106382978715%;\r\n}\r\n.oskariui .row-fluid .offset6:first-child {\r\n  margin-left: 51.063829787234035%;\r\n  *margin-left: 50.95744680851063%;\r\n}\r\n.oskariui .row-fluid .offset5 {\r\n  margin-left: 44.68085106382979%;\r\n  *margin-left: 44.57446808510638%;\r\n}\r\n.oskariui .row-fluid .offset5:first-child {\r\n  margin-left: 42.5531914893617%;\r\n  *margin-left: 42.4468085106383%;\r\n}\r\n.oskariui .row-fluid .offset4 {\r\n  margin-left: 36.170212765957444%;\r\n  *margin-left: 36.06382978723405%;\r\n}\r\n.oskariui .row-fluid .offset4:first-child {\r\n  margin-left: 34.04255319148936%;\r\n  *margin-left: 33.93617021276596%;\r\n}\r\n.oskariui .row-fluid .offset3 {\r\n  margin-left: 27.659574468085104%;\r\n  *margin-left: 27.5531914893617%;\r\n}\r\n.oskariui .row-fluid .offset3:first-child {\r\n  margin-left: 25.53191489361702%;\r\n  *margin-left: 25.425531914893618%;\r\n}\r\n.oskariui .row-fluid .offset2 {\r\n  margin-left: 19.148936170212764%;\r\n  *margin-left: 19.04255319148936%;\r\n}\r\n.oskariui .row-fluid .offset2:first-child {\r\n  margin-left: 17.02127659574468%;\r\n  *margin-left: 16.914893617021278%;\r\n}\r\n.oskariui .row-fluid .offset1 {\r\n  margin-left: 10.638297872340425%;\r\n  *margin-left: 10.53191489361702%;\r\n}\r\n.oskariui .row-fluid .offset1:first-child {\r\n  margin-left: 8.51063829787234%;\r\n  *margin-left: 8.404255319148938%;\r\n}\r\n[class*=\"span\"].hide,\r\n.oskariui .row-fluid [class*=\"span\"].hide {\r\n  display: none;\r\n}\r\n[class*=\"span\"].pull-right,\r\n.oskariui .row-fluid [class*=\"span\"].pull-right {\r\n  float: right;\r\n}\r\n.oskariui .container {\r\n  margin-right: auto;\r\n  margin-left: auto;\r\n  *zoom: 1;\r\n}\r\n.oskariui .container:before,\r\n.oskariui .container:after {\r\n  display: table;\r\n  content: \"\";\r\n  line-height: 0;\r\n}\r\n.oskariui .container:after {\r\n  clear: both;\r\n}\r\n.oskariui .container-fluid {\r\n  padding-right: 20px;\r\n  padding-left: 20px;\r\n  *zoom: 1;\r\n}\r\n.oskariui .container-fluid:before,\r\n.oskariui .container-fluid:after {\r\n  display: table;\r\n  content: \"\";\r\n  line-height: 0;\r\n}\r\n.oskariui .container-fluid:after {\r\n  clear: both;\r\n}\r\n'); }); requirejs.s.contexts._.nextTick = requirejs.nextTick; 