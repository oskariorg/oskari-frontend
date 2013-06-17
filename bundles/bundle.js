/**
 * @class Oskari
 *
 * Oskari
 *
 * A set of metdhods to support loosely coupled classes and instances for the
 * mapframework
 *
 * @to-do - class instance checks against class metadata - protocol
 *        implementation validation
 *
 * 2012-11-30 additions
 * - dropped compatibility for pre 2010-04 classes
 * - removed fixed root package requirement 'Oskari.' - implementing namespaces
 * - inheritance with extend() or extend: [] meta
 * - inheritance implemented as a brutal copy down of super clazz methods
 * - super clazz constructors applied behind the scenes in top-down order
 * - this implementation does *not* implement native js  instanceof for class hierarchies
 * - inheritance supports pushing down new method categories applied to super classes
 * - this implementation does not provide super.func() calls - may be added at a later stage
 *
 */
Oskari = (function() {

    var isDebug = false;
    var isConsole = window.console != null && window.console.debug;

    var logMsg = function(msg) {
        if(!isDebug) {
            return;
        }

        if(!isConsole) {
            return;
        }
        window.console.debug(msg);

    }
    /**
     * @class Oskari.bundle_locale
     */
    var bundle_locale = function() {
        this.lang = null;
        this.localizations = {};

    };

    bundle_locale.prototype = {
        setLocalization : function(lang, key, value) {
            if(!this.localizations[lang])
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
     * let's create locale support
     */
    var blocale = new bundle_locale();

    /*
     * 'dev' adds ?ts=<instTs> parameter to js loads 'default' does not add
     * 'static' assumes srcs are already loaded <any-other> is assumed as a
     * request to load built js packs using this path pattern .../<bundles-path>/<bundle-name>/build/<any-ohther>.js
     */
    var supportBundleAsync = false;
    var mode = 'dev';
    // 'static' / 'dynamic'
    var instTs = new Date().getTime();

    var basePathForBundles = null;

    var pathBuilders = {
        'default' : function(fn, bpath) {
            if(basePathForBundles) {
                return basePathForBundles + fn;
            }
            return fn;
        },
        'dev' : function(fn, bpath) {
            if(basePathForBundles) {
                return basePathForBundles + fn + "?ts=" + instTs;
            }
            return fn + "?ts=" + instTs;
        }
    };

    function buildPathForLoaderMode(fn, bpath) {
        var pathBuilder = pathBuilders[mode];
        if(!pathBuilder) {
            if(basePathForBundles) {
                return basePathForBundles + fn;
            }
            return fn;
        }

        return pathBuilder(fn, bpath);
    }

    var isNotPackMode = {
        'dev' : true,
        'default' : true,
        'static' : true
    };

    function isPackedMode() {
        return !isNotPackMode[mode];
    }

    var _preloaded = false;
    function preloaded() {
        return _preloaded;
    }

    function buildPathForPackedMode(bpath) {
        return bpath + "/build/" + mode + ".js";
    }

    function buildBundlePathForPackedMode(bpath) {
        return bpath + "/build/bundle-" + mode + ".js";
    }

    function buildLocalePathForPackedMode(bpath) {
        return bpath + "/build/" + mode + "-locale-" + blocale.getLang() + ".js";
    }

    /**
     * @clazz Oskari.clazzadapter
     *
     * This is an adapter class template that should not be used directly
     */
    var clazzadapter = function(i, md) {
        this.impl = i;

        /* set overridden methods intentionally to instance */
        for(p in md) {
            this[p] = md[p];
        }
    };
    clazzadapter.prototype = {
        /**
         * @method define
         */
        "define" : function() {
            throw "define not supported for this adapter " + this.impl;
        },
        /**
         * @method category
         *
         * Adds a set of methods to classs prototype
         *
         * If no class definition exists this shall create a basic class
         * definition as a placeholder for the actual class definition. This is
         * required to support asynchronous javascript loading.
         *
         */
        "category" : function() {
            throw "category not supported for this adapter " + this.impl;
        },
        /**
         * @method create
         *
         * Creates an class instance initialized with constructors varargs
         */
        "create" : function() {
            throw "create not supported for this adapter " + this.impl;

        },
        /**
         * @method construct
         *
         * Constructs an object initialised with a property object
         */
        "construct" : function() {
            throw "construct not supported for this adapter " + this.impl;

        },
        /**
         * @method global
         *
         * Accesses or sets a global (in this context) variable value
         */
        "global" : function() {
            throw "global not supported for this adapter " + this.impl;

        },
        /**
         * @method metadata
         *
         * Provides access to class metadata
         *
         */
        "metadata" : function() {
            throw "metadata not supported for this adapter " + this.impl;

        },
        /**
         * @method protocol
         *
         * Provides access to all classes that implement queried protocol
         */
        "protocol" : function() {
            throw "protocol not supported for this adapter " + this.impl;

        },
        "purge" : function() {
            throw "purge not supported for this adapter " + this.impl;
        }
    };

    /**
     * @class Oskari.clazzdef
     *
     * A Container for any Oskari class definitions
     */
    var clazzdef = function() {

        this.packages = {};
        this.protocols = {};
        this.inheritance = {};
        this.aspects = {};
        this.clazzcache = {};

    };
    /**
     * @class Oskari.nativeadapter
     *
     * An Adapter to support Oskari class system
     *
     */
    var nativeadapter = new clazzadapter(new clazzdef(), {

        "purge" : function() {

        },
        /**
         * @method protocol
         *
         * Returns a property object with classes implementing queried protocol
         *
         * @param protocol
         *            the name of the protocol as string
         *
         */
        "protocol" : function() {
            var args = arguments;
            if(args.length == 0)
                throw "missing arguments";

            // var cdef = args[0];

            return this.impl.protocols[args[0]];

        },
        /**
         * @method metadata
         *
         * Returns metadata for the class
         *
         * @param classname
         *            the name of the class as string
         */
        "metadata" : function() {
            var args = arguments;
            if(args.length == 0)
                throw "missing arguments";

            var cdef = args[0];

            var pdefsp = this.impl.clazzcache[cdef];

            var bp = null;
            var pp = null;
            var sp = null;
            if(!pdefsp) {
                var parts = cdef.split('.');
                bp = parts[0];
                pp = parts[1];
                sp = parts.slice(2).join('.');

                var pdef = this.impl.packages[pp];
                if(!pdef) {
                    pdef = {};
                    this.impl.packages[pp] = pdef;
                }
                pdefsp = pdef[sp];
                this.impl.clazzcache[cdef] = pdefsp;

            }

            if(!pdefsp)
                throw "clazz " + sp + " does not exist in package " + pp + " bundle " + bp;

            return pdefsp._metadata;

        },
        /**
         * @method updateMetadata
         * @private
         *
         * Updates and binds class metadata
         */
        "updateMetadata" : function(bp, pp, sp, pdefsp, classMeta) {
            if(!pdefsp._metadata)
                pdefsp._metadata = {};

            pdefsp._metadata['meta'] = classMeta;

            var protocols = classMeta['protocol'];
            if(protocols) {
                for(var p = 0; p < protocols.length; p++) {
                    var pt = protocols[p];

                    if(!this.impl.protocols[pt]) {
                        this.impl.protocols[pt] = {};
                    }

                    var cn = bp + "." + pp + "." + sp;

                    this.impl.protocols[pt][cn] = pdefsp;
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
            if(args.length == 0)
                throw "missing arguments";

            var cdef = args[0];
            var parts = cdef.split('.');

            /*
             * bp base part pp package part sp rest
             */
            var bp = parts[0];

            var pp = parts[1];

            var sp = parts.slice(2).join('.');

            var pdef = this.impl.packages[pp];
            if(!pdef) {
                pdef = {};
                this.impl.packages[pp] = pdef;
            }

            var pdefsp = pdef[sp];

            if(pdefsp) {
                // update constrcutor
                pdefsp._constructor = args[1];

                // update prototype
                var catFuncs = args[2];
                var prot = pdefsp._class.prototype;

                for(p in catFuncs) {
                    var pi = catFuncs[p];

                    prot[p] = pi;
                }
                var catName = cdef;
                pdefsp._category[catName] = catFuncs;
                if(args.length > 3) {

                    var extnds = args[3].extend;
                    for(var e = 0; extnds && e < extnds.length; e++) {
                        var superClazz = this.lookup(extnds[e]);
                        if(!superClazz._composition.subClazz)
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

            for(p in catFuncs) {
                var pi = catFuncs[p];

                prot[p] = pi;
            }
            var catName = cdef;
            pdefsp._category[catName] = catFuncs;

            this.impl.inheritance[cdef] = compo;
            pdef[sp] = pdefsp;

            var catName = cdef;
            pdefsp._category[catName] = args[2];

            if(args.length > 3) {

                var extnds = args[3].extend;
                for(var e = 0; extnds && e < extnds.length; e++) {
                    var superClazz = this.lookup(extnds[e]);
                    if(!superClazz._composition.subClazz)
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
            if(args.length == 0)
                throw "missing arguments";

            var cdef = args[0];
            var parts = cdef.split('.');
            /*
             * bp base part pp package part sp rest
             */
            var bp = parts[0];

            var pp = parts[1];

            var sp = parts.slice(2).join('.');

            var pdef = this.impl.packages[pp];
            if(!pdef) {
                pdef = {};
                this.impl.packages[pp] = pdef;
            }
            var pdefsp = pdef[sp];

            if(!pdefsp) {
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
                this.impl.inheritance[cdef] = compo;
                pdef[sp] = pdefsp;

            }

            var catName = args[1];
            var catFuncs = args[2];
            var prot = pdefsp._class.prototype;

            for(p in catFuncs) {
                var pi = catFuncs[p];

                prot[p] = pi;
            }

            pdefsp._category[catName] = catFuncs;

            this.pullDown(pdefsp);
            this.pushDown(pdefsp);
        },
        /**
         * @method inherit
         *
         * adds impl from super class to class prototype
         *
         * THIS is done as follows
         * -
         *
         */
        lookup : function() {
            var args = arguments;
            if(args.length == 0)
                throw "missing arguments";

            var cdef = args[0];
            var parts = cdef.split('.');
            /*
             * bp base part pp package part sp rest
             */
            var bp = parts[0];

            var pp = parts[1];

            var sp = parts.slice(2).join('.');

            var pdef = this.impl.packages[pp];
            if(!pdef) {
                pdef = {};
                this.impl.packages[pp] = pdef;
            }
            var pdefsp = pdef[sp];

            if(!pdefsp) {
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
                this.impl.inheritance[cdef] = compo;
                pdef[sp] = pdefsp;

            }

            return pdefsp;
        },
        extend : function() {
            var args = arguments;
            var superClazz = this.lookup(args[1]);
            var subClazz = this.lookup(args[0]);
            if(!superClazz._composition.subClazz)
                superClazz._composition.subClazz = {};
            superClazz._composition.subClazz[args[0]] = subClazz;
            subClazz._composition.superClazz = superClazz;
            this.pullDown(subClazz);
        },
        composition : function() {
            var cdef = arguments[0];

            var pdefsp = this.impl.clazzcache[cdef];

            var bp = null;
            var pp = null;
            var sp = null;
            if(!pdefsp) {
                var parts = cdef.split('.');
                bp = parts[0];
                pp = parts[1];
                sp = parts.slice(2).join('.');

                var pdef = this.impl.packages[pp];
                if(!pdef) {
                    pdef = {};
                    this.impl.packages[pp] = pdef;
                }
                pdefsp = pdef[sp];
                this.impl.clazzcache[cdef] = pdefsp;

            }

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
            if(!pdefsp._composition.subClazz) {
                return;
            }
            for(var sub in pdefsp._composition.subClazz) {
                var pdefsub = pdefsp._composition.subClazz[sub];
                this.pullDown(pdefsub);
                this.pushDown(pdefsub);
            }
        },
        /**
         * @method pullDown
         *
         * EACH class is responsible for it's entire hierarchy
         * no intermediate results are being consolidated
         *
         */
        pullDown : function(pdefsp) {
            if(!pdefsp._composition.superClazz) {
                return;
            }

            var clazzHierarchy = [];
            clazzHierarchy.push(pdefsp);

            var funcs = {};
            var spr = pdefsp;
            while(true) {
                spr = spr._composition.superClazz;
                if(!spr) {
                    break;
                }
                clazzHierarchy.push(spr);
            }

            var prot = pdefsp._class.prototype;
            var constructors = [];
            var superClazzMethodCats = {};
            for(var s = clazzHierarchy.length - 1; s >= 0; s--) {
                var cn = clazzHierarchy[s]._composition.clazzName;

                var ctor = clazzHierarchy[s]._constructor;
                constructors.push(ctor);

                var superClazzMetCat = {};
                for(var c in clazzHierarchy[s]._category ) {

                    var catName = cn + "#" + c;
                    var catFuncs = clazzHierarchy[s]._category[c];
                    for(p in catFuncs) {
                        var pi = catFuncs[p];
                        prot[p] = pi;
                        superClazzMetCat[p] = pi;
                    }
                }
                superClazzMethodCats[cn] = superClazzMetCat;
            }
            pdefsp._constructors = constructors;
            pdefsp._superCategory = superClazzMethodCats;

            return clazz;
        },
        /**
         * @method printAncestry
         * prints class inheritance to console
         */
        printAncestry : function() {
            var pdefsp = this.lookup.apply(this, arguments);
            if(!pdefsp._composition.superClazz) {
                return;
            }

            var clazzHierarchy = [];
            clazzHierarchy.push(pdefsp);

            var spr = pdefsp;
            while(true) {
                spr = spr._composition.superClazz;
                if(!spr) {
                    break;
                }
                clazzHierarchy.push(spr);
            }
            for(var s = clazzHierarchy.length - 1; s >= 0; s--) {
				if (console && console.log) {
					console.log("                 ".substring(0, clazzHierarchy.length - s) + "|_ " + clazzHierarchy[s]._composition.clazzName);
				}
            }
        },
        /**
         * @method printHierarchy
         * print subclasses to console
         */
        printHierarchy : function() {
            var pdefsp = this.lookup.apply(this, arguments);
            if(!pdefsp._composition.subClazz) {
                return;
            }
            var clazzHierarchy = [];
            var taskList = [];

            taskList.push({
                c : null,
                sub : pdefsp,
                level : 0
            });

            while(true) {
                var task = taskList.shift();
                if(!task) {
                    break;

                }
                /*clazzHierarchy.push({ level: task.level, sub: task.sub });*/
                clazzHierarchy.push("                 ".substring(0, task.level) + "|_ " + task.sub._composition.clazzName);

                var pdefc = task.c;
                var pdefsub = task.sub;
                if(!pdefsub._composition.subClazz)
                    continue;

                for(var p in pdefsub._composition.subClazz ) {
                    taskList.push({
                        c : pdefc,
                        sub : pdefsub._composition.subClazz[p],
                        level : task.level + 1
                    });
                }
            }

            for(var s = 0; s < clazzHierarchy.length; s++) {
				if (console && console.log) {
					console.log(clazzHierarchy[s]);
				}
            }

        },
        /**
         * @method apropos
         */
        apropos : function() {
            var pdefsp = this.lookup.apply(this, arguments);

            for(p in pdefsp._category[arguments[0]]) {
				if (console && console.log) {
					console.log(p);
				}
            }
        },
        slicer : Array.prototype.slice,

        /*
         * @method create
         *
         * creates a class instance THIS is for compatibility mode only
         * construct should be used for new classes
         *
         * var x =
         * Oskari.clazz.create('Oskari.mapframework.request.common.ActivateOpenlayersMapControlRequest','12313');
         */
        create : function() {
            var args = arguments;
            if(args.length == 0)
                throw "missing arguments";
            var instargs = this.slicer.apply(arguments, [1])/*[];
             for(var n = 1; n < args.length; n++)
             instargs.push(args[n]);*/

            var cdef = args[0];

            var pdefsp = this.impl.clazzcache[cdef];

            var bp = null;
            var pp = null;
            var sp = null;
            if(!pdefsp) {
                var parts = cdef.split('.');
                bp = parts[0];
                pp = parts[1];
                sp = parts.slice(2).join('.');

                var pdef = this.impl.packages[pp];
                if(!pdef) {
                    pdef = {};
                    this.impl.packages[pp] = pdef;
                }
                pdefsp = pdef[sp];
                this.impl.clazzcache[cdef] = pdefsp;

            }

            if(!pdefsp)
                throw "clazz " + sp + " does not exist in package " + pp + " bundle " + bp;

            var inst = new pdefsp._class();
            var ctors = pdefsp._constructors;
            if(ctors) {
                for(var c = 0; c < ctors.length; c++) {
                    ctors[c].apply(inst, instargs);
                }
            } else {
                pdefsp._constructor.apply(inst, instargs);
            }
            return inst;
        },
        /**
         * @method construct
         *
         * constructs class instance assuming props as single argument to
         * constructor
         *
         *
         */
        construct : function() {
            var args = arguments;
            if(args.length != 2)
                throw "missing arguments";

            var cdef = args[0];
            var instprops = args[1];

            var pdefsp = this.impl.clazzcache[cdef];

            var bp = null;
            var pp = null;
            var sp = null;
            if(!pdefsp) {
                var parts = cdef.split('.');
                bp = parts[0];
                pp = parts[1];
                sp = parts.slice(2).join('.');

                var pdef = this.impl.packages[pp];
                if(!pdef) {
                    pdef = {};
                    this.impl.packages[pp] = pdef;
                }
                pdefsp = pdef[sp];
                this.impl.clazzcache[cdef] = pdefsp;

            }

            if(!pdefsp)
                throw "clazz " + sp + " does not exist in package " + pp + " bundle " + bp;

            var inst = new pdefsp._class();
            pdefsp._constructor.apply(inst, [instprops]);
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
            if(args.length == 0)
                throw "missing arguments";

            var cdef = args[0];

            var pdefsp = this.impl.clazzcache[cdef];

            var bp = null;
            var pp = null;
            var sp = null;

            if(!pdefsp) {
                var parts = cdef.split('.');
                bp = parts[0];
                pp = parts[1];
                sp = parts.slice(2).join('.');

                var pdef = this.impl.packages[pp];
                if(!pdef) {
                    pdef = {};
                    this.impl.packages[pp] = pdef;
                }
                pdefsp = pdef[sp];
                this.impl.clazzcache[cdef] = pdefsp;

            }

            if(!pdefsp)
                throw "clazz " + sp + " does not exist in package " + pp + " bundle " + bp;

            if(pdefsp._builder)
                return pdefsp._builder;

            pdefsp._builder = function() {
                var instargs = arguments;
                var inst = new pdefsp._class();
                var ctors = pdefsp._constructors;
                if(ctors) {
                    for(var c = 0; c < ctors.length; c++) {
                        ctors[c].apply(inst, instargs);
                    }
                }
                pdefsp._constructor.apply(inst, instargs);
                return inst;
            };
            return pdefsp._builder;

        }
    });

    /**
     * @class Oskari.clazz
     * @singleton
     *
     * Container for Oskari's class definitions Supports multiple adapters for
     * different class libraries
     *
     */
    var clazz = function(regExp, adapter) {
        this.defRex = new RegExp(regExp);
        this.def = adapter;
        this.hasOtherNs = false;
        this.ns = {};
        this.alias = {};

        this.globals = {};
    };

    clazz.prototype = {

        get : function() {
            var args = arguments;
            if(!this.hasOtherNs || this.defRex.test(args[0])) {
                return this.def;
            }

            var parts = args[0].split('.');
            var bp = parts[0];

            var ai = this.ns[bp];
            if(!ai)
                throw "clazz: ns NOT bound " + bp;
            return ai;
        },
        /*
         * @method self @param adapter identifier
         *
         * returns class adapter for the given class libray
         *
         */
        self : function(bp) {
            var ai = this.ns[bp];
            if(!ai)
                throw "clazz: ns NOT bound " + bp;

            return ai.self;
        },
        /**
         * @method adapt
         *
         * registers an adapter to the class system
         */
        adapt : function(base, adapter) {
            this.ns[base] = adapter;
            this.hasOtherNs = true;
        },
        /**
         * @method define
         * @param class
         *            name
         *
         * defines a class using the first part as class system identifier
         *
         * Parameters differ for different class adapters
         */
        define : function() {
            var ai = this.get.apply(this, arguments);

            return ai.define.apply(ai, arguments);

        },
        /**
         * @method category
         *
         * registers a set of methods to a class
         * @param classname
         *            Parameters differ for different class adapters
         */
        category : function() {
            var ai = this.get.apply(this, arguments);

            return ai.category.apply(ai, arguments);

        },
        composition : function() {
            var ai = this.get.apply(this, arguments);

            return ai.composition.apply(ai, arguments);

        },
        extend : function() {
            var ai = this.get.apply(this, arguments);

            return ai.extend.apply(ai, arguments);

        },
        /**
         * @method create Creates a class instance
         * @param classname
         *            Parameters differ for different class adapters
         *
         */
        create : function() {
            var ai = this.get.apply(this, arguments);

            return ai.create.apply(ai, arguments);

        },
        /**
         * @method construct
         * @param classname
         *            Parameters differ for different class adapters
         *
         * Constructs an instance with a property object
         */
        construct : function() {
            var ai = this.get.apply(this, arguments);

            return ai.construct.apply(ai, arguments);

        },
        /**
         * @method createArrArgs
         * @param array
         *            of arguments for the constructor with class name as first
         *            element in array
         *
         */
        createArrArgs : function(args) {
            var ai = this.get.apply(this, arguments);
            return ai.create.apply(ai, args);

        },
        /**
         * @method builder
         * @param classname
         *            returns a class instance builder that can be reused
         */
        builder : function() {
            var ai = this.get.apply(this, arguments);

            return ai.builder.apply(ai, arguments);
        },
        /**
         * @method global
         * @param variable
         *            name
         * @param optional
         *            value gets or sets a global variable for Oskari context
         */
        global : function() {
            if(arguments.length == 0)
                return this.globals;
            var name = arguments[0];
            if(arguments.length == 2) {
                this.globals[name] = arguments[1];
            }
            return this.globals[name];

        },
        /**
         * @method metadata
         *
         * returns class metadata if available
         * @param classname
         */
        "metadata" : function() {
            var ai = this.get.apply(this, arguments);

            return ai.metadata.apply(ai, arguments);
        },
        /**
         * @method protocol
         *
         * appends or overrides a set of methods to class prototype If no class
         * definition is present, creates a template class definition
         *
         */
        "protocol" : function() {
            var ai = this.get.apply(this, arguments);

            return ai.protocol.apply(ai, arguments);
        },
        "purge" : function() {
            var ai = this.get.apply(this, arguments);

            return ai.purge.apply(ai, arguments);

        },
        "printAncestry" : function() {
            var ai = this.get.apply(this, arguments);
            return ai.printAncestry.apply(ai, arguments);

        },
        "printHierarchy" : function() {
            var ai = this.get.apply(this, arguments);
            return ai.printHierarchy.apply(ai, arguments);

        },
        "apropos" : function() {
            var ai = this.get.apply(this, arguments);
            return ai.apropos.apply(ai, arguments);

        },
        "lookup" : function() {
            var ai = this.get.apply(this, arguments);
            return ai.lookup.apply(ai, arguments);
        }
    };

    clazz.prototype.singleton = new clazz('^Oskari(.*)', nativeadapter);

    /*
     * registers the default native class adapter for Oskari
     */
    /*clazz.prototype.singleton.adapt('Oskari', nativeadapter);*/

    var bundle_loader_id = 0;
    /**
     * @class Oskari.bundle_loader
     *
     * Bundle loader class that may be used with Oskari framework Inspired by
     * various javascript loaders (Ext, ...)
     *
     */
    var bundle_loader = function(manager, cb) {
        this.loader_identifier = ++bundle_loader_id;
        this.manager = manager;
        this.callback = cb;

        this.filesRequested = 0;
        this.filesLoaded = 0;
        this.files = {};
        this.fileList = [];
        this.metadata = {};
    };

    bundle_loader.prototype = {
        /**
         * @method adds a script loading request
         */
        "add" : function(fn,pdef) {
            var me = this;
            if(!me.files[fn]) {
                var def = {
                    src : fn,
                    type: ( pdef ? pdef.type : null ) ||"text/javascript",
                    id: pdef ? pdef.id : null,
                    state: false
                    
                };
                me.files[fn] = def;
                
                if( "text/javascript" === def.type) {
                	me.filesRequested++;
                }
                me.fileList.push(def);
            }
        },
        getState : function() {
            if(this.filesRequested == 0)
                return 1;

            return (this.filesLoaded / this.filesRequested);
        },
        /**
         * @method commit
         *
         * commits any script loading requests
         */
        "commit" : function() {
            var head = document.getElementsByTagName("head")[0];
            var fragment = document.createDocumentFragment();
            var me = this;
            var numFiles = this.filesRequested;
            if(numFiles == 0) {
                me.callback();
                me.manager.notifyLoaderStateChanged(me, true);
                return;
            }
            if(preloaded()) {
                me.callback();
                me.manager.notifyLoaderStateChanged(me, true);
                return;
            }

            var onFileLoaded = function() {
                me.filesLoaded++;
                me.manager.log("Files loaded " + me.filesLoaded + "/" + me.filesRequested);

                if(numFiles == me.filesLoaded) {
                    me.callback();
                    me.manager.notifyLoaderStateChanged(me, true);
                } else {
                    me.manager.notifyLoaderStateChanged(me, false);
                }
            };
            var f = false;
            for(var n = 0; n < me.fileList.length; n++) {
				var def = me.fileList[n];
                var fn = def.src;
                var st = me.buildScriptTag(fn, onFileLoaded,def.type,def.id);
                if(st) {
                    // If this breaks something, revert to using method 1
                    if(preloaded()) {
                        onFileLoaded();
                    } else {
                        fragment.appendChild(st);
                        f = true;
                    }
                }
            }
            if(f) {
                head.appendChild(fragment);
            }
        },
        /**
         * @method buildScriptTag
         * @private
         *
         * builds a script tag to be applied to document head assumes UTF-8
         */
        "buildScriptTag" : function(filename, callback,elementtype,elementId) {
            var me = this;
            var script = document.createElement('script');
            if( elementId )
            	script.id = elementId;
            script.type = elementtype;//||'text/javascript';
            script.charset = 'utf-8';

            if(preloaded()) {
                // This should be redundant, see "If this..." in commit() above
                script.src = '/Oskari/empty.js'
            } else {
                script.src = filename;
            }

            /*
             * IE has a different way of handling &lt;script&gt; loads, so we //
             * need to check for it here
             */
            if(script.readyState) {
                script.onreadystatechange = function() {
                    if(script.readyState == "loaded" || script.readyState == "complete") {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {
                script.onload = callback;
            }

            return script;
        }
    };

    /**
     * @class Oskari.bundle_mediator
     *
     * A mediator class to support bundle to/from bundle manager communication
     * and initialisation as well as bundle state management
     *
     */
    var bundle_mediator = function(opts) {
        this.manager = null;

        for(p in opts) {
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
            if(me.fired) {
                //manager.log("trigger already fired " + info || this.info);
                return;
            }

            for(p in me.config["Import-Bundle"]) {
                var srcState = manager.stateForBundleSources[p];
                if(!srcState || srcState.state != 1) {
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
     * @class Oskari.bundle_manager
     * @singleton
     */
    var bundle_manager = function() {
        this.serial = 0;
        this.impls = {};
        this.sources = {};
        this.instances = {};
        this.bundles = {};

        /*
         * CACHE for lookups state management
         */
        this.stateForBundleDefinitions = {

        };
        this.stateForBundleSources = {

        };

        /* CACHE for statuses */
        this.stateForBundles = {

        };
        this.stateForBundleInstances = {

        };

        /* CACHE for binding packages/request/events */

        this.stateForPackages = {
            sources : {},
            sinks : {}
        };

        this.triggers = [];

        this.loaderStateListeners = [];
    };

    bundle_manager.prototype = {
        purge : function() {
            for(var p in this.sources ) {
                delete this.sources[p];
            }
            for(var p in this.stateForBundleDefinitions ) {
                delete this.stateForBundleDefinitions[p].loader;
            }
            for(var p in this.stateForBundleSources ) {
                delete this.stateForBundleSources[p].loader;
            }
        },
        /**
         * @
         */
        notifyLoaderStateChanged : function(bl, finished) {
            if(this.loaderStateListeners.length == 0)
                return;
            for(var l = 0; l < this.loaderStateListeners.length; l++) {
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
        "alert" : function(what) {
            // log(what);
            /*
             * var d = document.createElement('div');
             * d.appendChild(document.createTextNode(what)); var del =
             * document.getElementById("debug"); if (!del) return;
             * del.appendChild(d);
             */
            logMsg(what);
        },
        /**
         * @method log a loggin and debuggin function
         *
         */
        "log" : function(what) {
            logMsg(what);

        },
        /**
         * @method loadCss
         * @param sScriptSrc contains css style url
         * @param oCallback not implemented
         */
        "loadCss" : function(sScriptSrc, oCallback) {
            this.log("loading CSS " + sScriptSrc);
            var h = document.getElementsByTagName("head").length ? document
            .getElementsByTagName("head")[0] : document.body;
            if(!preloaded()) {
                if(jQuery.browser.msie) {
                    // IE has a limitation of 31 stylesheets.
                    // It can be increased to 31*31 by using import in the stylesheets,
                    // but import should be avoided due to performance issues.
                    // Instead we retrieve the css files with xhr and
                    // concatenates the styles into a single inline style declaration.
                    jQuery.ajax({
                        url : sScriptSrc,
                        dataType : "text"
                    }).done(function(css) {
                        var styles = document.getElementById("concatenated");
                        if(styles) {
                            // styles found, append
                            styles.styleSheet.cssText += css;
                        } else {
                            // styles was not found, create new style element
                            var styles = document.createElement('style');
                            h.appendChild(styles);
                            styles.setAttribute('type', 'text/css');
                            styles.styleSheet.cssText = css;
                            styles.id = "concatenated";
                        }
                        return css;
                    });
                } else {
                    var s = document.createElement("link");
                    s.type = "text/css";
                    s.rel = "stylesheet";
                    s.href = sScriptSrc;
                    h.appendChild(s);
                }
            }
        },
        /**
         * @method self
         * @returns {bundle_manager}
         */
        "self" : function() {
            return this;
        },
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
        "install" : function(implid, bp, srcs, metadata) {
            // installs bundle
            // DOES not INSTANTIATE only register bp as function
            // declares any additional sources required

            var me = this;
            var bundleImpl = implid;
            var defState = me.stateForBundleDefinitions[bundleImpl];
            if(defState) {
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
            if(srcState) {
                if(srcState.state == -1) {
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
        "installBundleClass" : function(implid, clazzName) {
            var cs = clazz.prototype.singleton;

            var classmeta = cs.metadata(clazzName);
            var bp = cs.builder(clazzName);
            var srcs = classmeta.meta.source;
            var bundleMetadata = classmeta.meta.bundle;

            this.install(implid, bp, srcs, bundleMetadata);

        },
        /**
         * @method impl
         * @param implid
         * @returns bundle implemenation
         *
         */
        "impl" : function(implid) {
            return this.impls[implid];
        },
        /**
         * @method loadBundleDefinition
         * @param implid
         * @param bundleSrc
         * @param c
         *
         * Loads Bundle Definition from JavaScript file JavaScript shall contain
         * install or installBundleClass call.
         */
        "loadBundleDefinition" : function(implid, bundleSrc, pbundlePath) {
            var me = this;
            var bundleImpl = implid;
            me.log("loadBundleDefinition called with " + bundleImpl);
            var defState = me.stateForBundleDefinitions[bundleImpl];
            if(defState) {
                if(defState.state == 1) {
                    me.log("bundle definition already loaded for " + bundleImpl);
                    me.postChange(null, null, "bundle_definition_loaded");
                    return;
                } else {
                    me.log("bundle definition already loaded OR WHAT?" + bundleImpl + " " + defState.state);
                    return;
                }

            } else {
                defState = {
                    state : -1
                };
                me.stateForBundleDefinitions[bundleImpl] = defState;
                me.log("set NEW state for DEFINITION " + bundleImpl + " to " + defState.state);
            }

            defState.bundleSrcPath = bundleSrc;
            var bundlePath = pbundlePath || (bundleSrc.substring(0, bundleSrc.lastIndexOf('/')));
            defState.bundlePath = bundlePath;

            var bl = new bundle_loader(this, function() {
                me.log("bundle_def_loaded_callback");
            });
            bl.metadata['context'] = 'bundleDefinition';

            defState.loader = bl;

            bl.add(bundleSrc);
            bl.commit();
        },
        /**
         * @method loadBundleSources
         * @param implid
         * @param c
         *
         * Registers and commits JavaScript load request from bundle manifesst A
         * trigger is fired after all JavaScript files have been loaded.
         */
        "loadBundleSources" : function(implid) {
            // load any JavaScripts for bundle
            // MUST be done before createBundle
            var me = this;
            var bundleImpl = implid;

            me.log("loadBundleSources called with " + bundleImpl);
            var defState = me.stateForBundleDefinitions[bundleImpl];
            // log(defState);

            if(!defState) {
                throw "INVALID_STATE: bundle definition load not requested for " + bundleImpl;
            }
            if(defState) {
                me.log("- definition STATE for " + bundleImpl + " at load sources " + defState.state);
            }

            if(mode == 'static') {
                me.postChange(null, null, "bundle_definition_loaded");
                return;
            }

            var srcState = me.stateForBundleSources[bundleImpl];

            if(srcState) {
                if(srcState.state == 1) {
                    me.log("already loaded sources for : " + bundleImpl);
                    return;
                } else if(srcState.state == -1) {
                    me.log("loading previously pending sources for " + bundleImpl + " " + srcState.state + " or what?");
                } else {
                    throw "INVALID_STATE: at " + bundleImpl;
                }
            } else {
                srcState = {
                    state : -1
                };
                me.stateForBundleSources[bundleImpl] = srcState;
                me.log("setting STATE for sources " + bundleImpl + " to " + srcState.state);
            }

            if(defState.state != 1) {
                me.log("pending DEFINITION at sources for " + bundleImpl + " to " + defState.state + " -> postponed");

                return;
            }

            me.log("STARTING load for sources " + bundleImpl);

            var srcFiles = {
                count : 0,
                loaded : 0,
                files : {},
                css : {}
            };
            var me = this;
            var callback = function() {
                me.log("finished loading " + srcFiles.count + " files for " + bundleImpl + ".");
                me.stateForBundleSources[bundleImpl].state = 1;
                me.log("set NEW state post source load for " + bundleImpl + " to " + me.stateForBundleSources[bundleImpl].state);

                me.postChange(null, null, "bundle_sources_loaded");
            };
            var bundlePath = defState.bundlePath;

            var srcs = me.sources[bundleImpl];

            if(srcs) {

                me.log("got sources for " + bundleImpl);

                for(p in srcs) {
                    if(p == 'scripts') {

                        var defs = srcs[p];

                        for(var n = 0; n < defs.length; n++) {
                            var def = defs[n];
                            if(def.type == "text/css") {

                                var fn = def.src;
                                var fnWithPath = null;
                                if(fn.indexOf('http') != -1) {
                                    fnWithPath = fn;
                                } else {
                                    fnWithPath = bundlePath + '/' + fn;
                                }

                                srcFiles.css[fnWithPath] = def;

                            } else if(def.type ) {
                                srcFiles.count++;
                                /* var fn = def.src + "?ts=" + instTs; */
                                var fn = buildPathForLoaderMode(def.src, bundlePath);

                                var fnWithPath = null;
                                if(fn.indexOf('http') != -1) {
                                    fnWithPath = fn;
                                } else {
                                    fnWithPath = bundlePath + '/' + fn;
                                }

                                srcFiles.files[fnWithPath] = def;
                            }  

                        }
                    } else if(p == 'locales') {
                        var requiredLocale = blocale.getLang();
                        var defs = srcs[p];

                        /*console.log("locales",defs);*/
                        for(var n = 0; n < defs.length; n++) {
                            var def = defs[n];

                            /*console.log("locale",def,requiredLocale);*/

                            if(requiredLocale && def.lang && def.lang != requiredLocale) {
                                /*console.log("locale",def,def.lang,requiredLocale, "NO MATCH?");*/
                                continue;
                            }

                            if(def.type == "text/css") {

                                var fn = def.src;
                                var fnWithPath = null;
                                if(fn.indexOf('http') != -1) {
                                    fnWithPath = fn;
                                } else {
                                    fnWithPath = bundlePath + '/' + fn;
                                }

                                srcFiles.css[fnWithPath] = def;

                            } else if(def.type ) {
                                srcFiles.count++;
                                /* var fn = def.src + "?ts=" + instTs; */
                                var fn = buildPathForLoaderMode(def.src, bundlePath);

                                var fnWithPath = null;
                                if(fn.indexOf('http') != -1) {
                                    fnWithPath = fn;
                                } else {
                                    fnWithPath = bundlePath + '/' + fn;
                                }

                                srcFiles.files[fnWithPath] = def;
                            }

                        }

                    }
                }
            } else {
                me.log("NO sources for " + bundleImpl);

            }

            /**
             * def.src is requested / src is adjusted path
             */
            for(src in srcFiles.css) {
                // var def = srcFiles.css[src];
                var defSrc = src;
                var fn = buildPathForLoaderMode(defSrc, bundlePath);
                me.loadCss(fn, callback);
                me.log("- added css source " + fn + " for " + bundleImpl);
            }

            /*
             * for (js in srcFiles.files) { var def = srcFiles.files[js];
             * me.log("triggering load for " + bundleImpl + " " + def.src);
             * me.loadSrc(def.src, callback); }
             */
            var bl = new bundle_loader(this, callback);
            bl.metadata['context'] = 'bundleSources';
            bl.metadata['bundleImpl'] = bundleImpl;
            srcState.loader = bl;

            /**
             * if using compiled javascript
             */
            if(isPackedMode()) {

                var fileCount = 0;
                for(js in srcFiles.files) {
                    fileCount++;
                }
                if(fileCount > 0) {

                    var srcsFn = buildPathForPackedMode(bundlePath);
                    bl.add(srcsFn,"text/javascript");
                    me.log("- added PACKED javascript source " + srcsFn + " for " + bundleImpl);

                    var localesFn = buildLocalePathForPackedMode(bundlePath);
                    bl.add(localesFn,"text/javascript");
                    me.log("- added PACKED locale javascript source " + localesFn + " for " + bundleImpl);
                }

                /**
                 * else load any files
                 */
            } else {
                for(js in srcFiles.files) {
                    bl.add(js,srcFiles.files[js]);
                    me.log("- added script source " + js + " for " + bundleImpl);

                }
            }

            bl.commit();

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
        "postChange" : function(b, bi, info) {
            // self
            var me = this;
            me.update(b, bi, info);

            // bundles
            for(var bid in me.bundles) {
                var o = me.bundles[bid];
                /* if (o != b) { */
                o.update(me, b, bi, info);
                // }
            }
            // and instances
            for(var i in me.instances) {
                var o = me.instances[i];
                if(!o)
                    continue;
                // stopped are null here
                // if (!bi || o != bi) {
                o.update(me, b, bi, info);
                // }
            }

        },
        /**
         * @method createBundle
         * @param implid
         * @param bundleid
         * @param env
         * @returns
         *
         * Creates a Bundle
         */
        "createBundle" : function(implid, bundleid) {
            // sets up bundle runs the registered func to instantiate bundle
            // this enables 'late binding'
            var bundlImpl = implid;
            var me = this;
            var defState = me.stateForBundleDefinitions[bundlImpl];
            if(!defState) {
                throw "INVALID_STATE: for createBundle / " + "definition not loaded " + implid + "/" + bundleid;
            }

            var bp = this.impls[implid];
            if(!bp) {
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
         * @method bindImportedPackages
         *
         * NYI. Shall bind any imported packages to bundle mediator
         *
         */
        "bindImportedPackages" : function() {
            // TBD
        },
        /**
         * @method bindImportedNamespaces
         *
         * NYI. Shall bind any imported namespaces to bundle mediator
         */
        "bindImportedNamespaces" : function() {
            // TBD
        },
        /**
         * @method bindImportedEvents
         * @deprecated
         *
         * not needed. registrations will be based on actual event handlers.
         */
        "bindImportedEvents" : function() {

        },
        /**
         * @method bindExportedPackages
         *
         * NYI. Shall support publishing a package from bundle
         */
        "bindExportedPackages" : function() {
            // TBD
        },
        /**
         * @method bindExportedNamespaces NYI. Shall support publishing namespaces
         *         from bundle
         */
        "bindExportedNamespaces" : function() {
            // TBD
        },
        /**
         * @methdod bindExportedRequests
         * @deprecated
         */
        "bindExportedRequests" : function() {

        },
        /**
         * @method update
         * @param bundleid
         * @returns
         *
         * fires any pending bundle or bundle instance triggers
         *
         */
        "update" : function(b, bi, info) {
            // resolves any bundle dependencies
            // this must be done before any starts
            // TO-DO
            // - bind package exports and imports
            // - bidn event imports and exports
            // - bind request exports ( and imports)
            // - bind any Namespaces (== Globals imported )
            // - fire any pending triggers

            var me = this;
            me.log("update called with info " + info);

            for(var n = 0; n < me.triggers.length; n++) {
                var t = me.triggers[n];
                t.execute(me);
            }
        },
        /**
         * @method bundle
         * @param bundleid
         * @returns bundle
         */
        "bundle" : function(bundleid) {
            return this.bundles[bundleid];
        },
        /**
         * @method destroyBundle
         * @param bundleid
         *
         * NYI. Shall DESTROY bundle definition
         */
        "destroyBundle" : function(bundleid) {
            // var bi = this.impls[bundleid];
        },
        /**
         * @method uninsttall
         * @param implid
         * @returns
         *
         * removes bundle definition from manager Does NOT remove bundles or bundle
         * instances currently.
         */
        "uninstall" : function(implid) {
            var bp = this.impls[implid];
            return bp;
        },
        /**
         * @method createInstance
         * @param bundleid
         * @returns {___bi2}
         *
         * creates a bundle instance for previously installed and created bundle
         */
        "createInstance" : function(bundleid) {
            // creates a bundle_instance
            // any configuration and setup IS BUNDLE / BUNDLE INSTANCE specific
            // create / config / start / process / stop / destroy ...

            var me = this;
            if(!me.stateForBundles[bundleid] || !me.stateForBundles[bundleid].state) {
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
                "clazz" : clazz.prototype.singleton,
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
        "instance" : function(instanceid) {

            return this.instances[instanceid];
        },
        /**
         * @method destroyInstance
         * @param instanceid
         * @returns
         *
         * destroys and unregisters bundle instance
         */
        "destroyInstance" : function(instanceid) {

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
        "on" : function(cfg, cb, info) {
            this.triggers.push(new bundle_trigger(cfg, cb, info));
        }
    };

    /*
     * @class Oskari.bundle_facade
     *
     * highlevel interface to bundle management Work in progress
     */
    var bundle_facade = function(bm) {
        this.manager = bm;

        this.bundles = {};

        /**
         * @property bundleInstances
         * logical bundle instance identifiers
         * (physical are used by manager and start from '1' on)
         */
        this.bundleInstances = {};
        this.bundlePath = "../src/mapframework/bundle/";

        /**
         * @property appSetup
         * application startup sequence
         */
        this.appSetup = null;

        /**
         * @property appConfig
         * application configuration (state) for instances
         * this is injected to instances before 'start' is called
         *
         */
        this.appConfig = {};
    };
    /**
     * FACADE will have only a couple of methods which trigger alotta operations
     */
    bundle_facade.prototype = {

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
        /*
         * @method requireBundle executes callback after bundle sources have
         * been loaded an d bundle has been created
         *
         */
        requireBundle : function(implid, bundleid, cb) {
            var me = this;
            var b = me.manager.createBundle(implid, bundleid);

            cb(me.manager, b);

        },
        /**
         * @method require executes callback after any requirements in bundle
         *         manifest have been met Work In Progress
         *
         */
        require : function(config, cb, info) {

            var me = this;
            me.manager.on(config, cb, info);
            var imports = config['Import-Bundle'];
            for(p in imports) {
                var pp = p;
                var def = imports[p];

                var bundlePath = def.bundlePath || me.bundlePath;
                /*
                 * var bundleDefFilename = bundlePath + pp + "/bundle.js?ts=" +
                 * (new Date().getTime());
                 */
                if(isPackedMode()) {
                    var packedBundleFn = buildBundlePathForPackedMode(bundlePath + pp);
                    bundleDefFilename = buildPathForLoaderMode(packedBundleFn, bundlePath);
                } else {
                    bundleDefFilename = buildPathForLoaderMode(bundlePath + pp + "/bundle.js", bundlePath);
                }
                me.manager.log("FACADE requesting load for " + pp + " from " + bundleDefFilename);
                me.manager.loadBundleDefinition(pp, bundleDefFilename, bundlePath + pp);
                me.manager.loadBundleSources(pp);
            }
        },
        setBundlePath : function(p) {
            this.bundlePath = p;
        },
        /*
         * @method loadBundleDeps
         */
        loadBundleDeps : function(deps, callback, manager, info) {
            var me = this;
            var bdep = deps["Import-Bundle"];
            var depslist = [];

            var hasPhase = false;

            for(p in bdep) {
                var name = p;
                var def = bdep[p];
                depslist.push({
                    name : name,
                    def : def,
                    phase : def.phase
                });
                hasPhase = hasPhase || def.phase;
            }

            depslist.sort(function(a, b) {
                if(!a.phase && !b.phase)
                    return 0;
                if(!a.phase)
                    return 1;
                if(!b.phase)
                    return -1;
                return a.phase < b.phase ? -1 : 1;
            });
            /*
             * console.log("!#!#! Built LIST OF DEPS"); for( var d = 0 ; d <
             * depslist.length ; d++ ) console.log(" - - - - -- - >
             * "+depslist[d].name);
             */

            if(hasPhase || !supportBundleAsync) {
                me.loadBundleDep(depslist, callback, manager, info);
            } else {
                me.loadBundleDepAsync(deps, callback, manager, info);
            }
        },
        /**
         * @method loadBundleDep
         *
         * maintains some a sort of order in loading
         */
        loadBundleDep : function(depslist, callback, manager, info) {
            var me = this;
            var bundledef = depslist.pop();
            if(!bundledef) {
                callback(manager);
                return;
            }

            var def = bundledef.def;
            var bundlename = bundledef.name;

            var fcd = this;
            var bdep = {
                "Import-Bundle" : {}
            };
            bdep["Import-Bundle"][bundlename] = def;
            fcd.require(bdep, function(manager) {
                me.loadBundleDep(depslist, callback, manager, info);
            }, info);
        },
        /**
         * @method loadBundleDep
         *
         * load bundles regardless of order
         */
        loadBundleDepAsync : function(deps, callback, manager, info) {

            var me = this;
            var fcd = this;

            fcd.require(deps, callback, info);
        },
        /**
         * @method playBundle
         *
         * plays a bundle player JSON object by instantiating any
         * required bundle instances
         *
         */
        playBundle : function(recData, cb) {

            // alert(bundleRec.get('title'));
            var metas = recData['metadata'];
            var bundlename = recData['bundlename'];
            var bundleinstancename = recData['bundleinstancename'];
            var isSingleton = metas["Singleton"];
            var fcd = this;
            var me = this;
            var instanceRequirements = metas["Require-Bundle-Instance"] || [];
            var instanceProps = recData.instanceProps;

            me.loadBundleDeps(metas, function(manager) {
                for(var r = 0; r < instanceRequirements.length; r++) {
                    var implInfo = instanceRequirements[r];
                    /* implname */
                    var implid = ( typeof (implInfo) === 'object' ) ? implInfo.bundlename : implInfo;
                    /* bundlename */
                    var bundleid = ( typeof (implInfo) === 'object' ) ? implInfo.bundleinstancename : implInfo + "Instance";
                    var b = me.bundles[implid];
                    if(!b) {
                        b = manager.createBundle(implid, bundleid);
                        me.bundles[implid] = b;
                    }

                    var bi = me.bundleInstances[bundleid];
                    if(!bi || !isSingleton) {
                        bi = manager.createInstance(bundleid);
                        me.bundleInstances[bundleid] = bi;

                        var configProps = me.getBundleInstanceConfigurationByName(bundleid);
                        if(configProps) {
                            for(ip in configProps) {
                                bi[ip] = configProps[ip];
                            }
                        }
                        bi.start();
                    }
                }

                fcd.requireBundle(bundlename, bundleinstancename, function() {
                    var yy = manager.createInstance(bundleinstancename);

                    for(ip in instanceProps) {
                        yy[ip] = instanceProps[ip];
                    }

                    var configProps = me.getBundleInstanceConfigurationByName(bundleinstancename);
                    if(configProps) {
                        for(ip in configProps) {
                            yy[ip] = configProps[ip];
                        }
                    }

                    yy.start();
                    me.bundleInstances[bundleinstancename] = yy;

                    cb(yy);
                });
            }, fcd.manager, bundlename);
        },
        /*
         * @method setApplicationSetup @param setup JSON application setup {
         * startupSequence: [ <bundledef1>, <bundledef2>, <bundledef3>, ] }
         *
         * Each bundledef is of kind playable by method playBundle. callback:
         * property may be set to receive some feedback - as well as
         * registerLoaderStateListener
         */
        setApplicationSetup : function(setup) {
            this.appSetup = setup;
        },
        /**
         * @method getApplicationSetup
         * @return JSON application setup
         */
        getApplicationSetup : function() {
            return this.appSetup;
        },
        setConfiguration : function(config) {
            this.appConfig = config;
        },
        getConfiguration : function() {
            return this.appConfig;
        },
        /**
         * @method startApplication
         *
         * Starts JSON setup (set with setApplicationSetup)
         *
         */
        startApplication : function(cb) {
            var me = this;
            var appSetup = this.appSetup;
            var appConfig = this.appConfig;
            var seq = this.appSetup.startupSequence.slice(0);
            var seqLen = seq.length;

            var startupInfo = {
                bundlesInstanceConfigurations : appConfig,
                bundlesInstanceInfos : {}
            };

            /**
             * Let's shift and playBundle until all done
             */

            var mediator = {
                facade : me,
                seq : seq,
                bndl : null,
                player : null,
                startupInfo : startupInfo
            };

            function schedule() {
                window.setTimeout(mediator.player, 0);
            }


            mediator.player = function() {

                /*console.log("BUNDLEPLAYER","shifting",mediator.seq);*/
                mediator.bndl = mediator.seq.shift();
                if(mediator.bndl == null) {
                    /*console.log("BUNDLEPLAYER","finished");*/
                    if(cb) {
                        cb(startupInfo);
                    }
                    return;
                }

                /*console.log("BUNDLEPLAYER","playing",mediator.bndl.title,mediator.bndl);*/

                mediator.facade.playBundle(mediator.bndl, function(bi) {

                    var bndlName = mediator.bndl.bundlename;
                    var bndlInstanceName = mediator.bndl.bundleinstancename;

                    mediator.startupInfo
                    .bundlesInstanceInfos[bndlInstanceName] = {
                        bundlename : bndlName,
                        bundleinstancename : bndlInstanceName,
                        bundleInstance : bi
                    };
                    if(mediator.bndl.callback) {
                        if( typeof mediator.bndl.callback === "string") {
                            eval(mediator.bndl.callback);
                        }
                        mediator.bndl.callback.apply(this, [bi, bndl]);
                    }
                    schedule();
                });
            };
            schedule();

        },
        /**
         * @method stopApplication Might stop application if all stops implemented
         */
        stopApplication : function() {
            throw "NYI";
        }
    };

    /**
     *
     */

    var cs = clazz.prototype.singleton;

    /**
     * let's create bundle manager singleton
     */
    var bm = new bundle_manager();
    bm.clazz = cs;

    /**
     * let's create bundle facade for bundle manager
     */
    var fcd = new bundle_facade(bm);
    var ga = cs.global;

	
	var bundle_dom_manager = function(dollar) {
		this.$ = dollar;
	};
	bundle_dom_manager.prototype = {
		getEl: function(selector) {
			return this.$(selector);
		},
		getElForPart : function(part) {
			throw "N/A";
		},
		setElForPart : function(part,el) {
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
	};
	
	
	var domMgr = new bundle_dom_manager(jQuery);

    /**
     * @static
     * @property Oskari
     */
    var bndl = {
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
        clazzadapter : clazzadapter,

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
        /**
         * @static
         * @method Oskari.registerLocalization
         */
        registerLocalization : function(props) {
            /*console.log("registerLocalization",props);*/
            if(props.length) {
                for(var p = 0; p < props.length; p++) {
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
        getSandbox: function(sandboxName)  {
        	return ga.apply(cs, [sandboxName||'sandbox'])
        },
        /**
         * @static
         * @method setSandbox
         */
        setSandbox: function(sandboxName,sandbox) {
        	return ga.apply(cs, [sandboxName||'sandbox',sandbox])
        }
        
    };

    /**
     * Let's register Oskari as a Oskari global
     */
    ga.apply(cs, ['Oskari', bndl]);

    /*
     * window.bundle = bndl; window.Oskari = bndl;
     */

    return bndl;
})();
