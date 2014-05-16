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
Oskari = (function () {

    var isDebug = false,
        isConsole = window.console && window.console.debug,
        logMsg = function (msg) {
            if (!isDebug) {
                return;
            }

            if (!isConsole) {
                return;
            }
            window.console.debug(msg);

        },
        /**
         * @class Oskari.bundle_locale
         */
        bundle_locale = function () {
            this.lang = null;
            this.localizations = {};
            this.supportedLocales = null;
        };

    bundle_locale.prototype = {
        setLocalization: function (lang, key, value) {
            if (!this.localizations[lang]) {
                this.localizations[lang] = {};
            }
            this.localizations[lang][key] = value;
        },
        setLang: function (lang) {
            this.lang = lang;
        },
        setSupportedLocales: function (locales) {
            this.supportedLocales = locales;
        },
        getLang: function () {
            return this.lang;
        },
        getLocalization: function (key) {
            return this.localizations[this.lang][key];
        },
        getSupportedLocales: function () {
            if (this.supportedLocales) {
                return this.supportedLocales;
            }
            return [];
        },
        getDefaultLanguage: function () {
            var locale = this.supportedLocales[0];
            return locale.substring(0, locale.indexOf("_"));
        },
        getSupportedLanguages: function () {
            var langs = [],
                locale,
                i;
            for (i = 0; i < this.supportedLocales.length; i += 1) {
                locale = this.supportedLocales[i];
                langs.push(locale.substring(0, locale.indexOf("_")));
            }
            return langs;
        }
    };

    /**
     * let's create locale support
     */
    var blocale = new bundle_locale(),
        localesURL = null;

    /*
     * 'dev' adds ?ts=<instTs> parameter to js loads 'default' does not add
     * 'static' assumes srcs are already loaded <any-other> is assumed as a
     * request to load built js packs using this path pattern .../<bundles-path>/<bundle-name>/build/<any-ohther>.js
     */
    var supportBundleAsync = false,
        mode = "dev",
        // 'static' / 'dynamic'
        instTs = new Date().getTime(),
        basePathForBundles = null,
        pathBuilders = {
            "default": function (fn, bpath) {
                if (basePathForBundles) {
                    return basePathForBundles + fn;
                }
                return fn;
            },
            "dev": function (fn, bpath) {
                if (basePathForBundles) {
                    return basePathForBundles + fn + "?ts=" + instTs;
                }
                return fn + "?ts=" + instTs;
            }
        };

    function buildPathForLoaderMode(fn, bpath) {
        var pathBuilder = pathBuilders[mode];
        if (!pathBuilder) {
            if (basePathForBundles) {
                return basePathForBundles + fn;
            }
            return fn;
        }

        return pathBuilder(fn, bpath);
    }

    var isNotPackMode = {
        "dev": true,
        "default": true,
        "static": true
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
    var clazzadapter = function (i, md) {
        var p;
        this.impl = i;

        /* set overridden methods intentionally to instance */
        for (p in md) {
            if (md.hasOwnProperty(p)) {
                this[p] = md[p];
            }
        }
    };
    clazzadapter.prototype = {
        /**
         * @method define
         */
        "define": function () {
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
        "category": function () {
            throw "category not supported for this adapter " + this.impl;
        },
        /**
         * @method create
         *
         * Creates an class instance initialized with constructors varargs
         */
        "create": function () {
            throw "create not supported for this adapter " + this.impl;

        },
        /**
         * @method construct
         *
         * Constructs an object initialised with a property object
         */
        "construct": function () {
            throw "construct not supported for this adapter " + this.impl;

        },
        /**
         * @method global
         *
         * Accesses or sets a global (in this context) variable value
         */
        "global": function () {
            throw "global not supported for this adapter " + this.impl;

        },
        /**
         * @method metadata
         *
         * Provides access to class metadata
         *
         */
        "metadata": function () {
            throw "metadata not supported for this adapter " + this.impl;

        },
        /**
         * @method protocol
         *
         * Provides access to all classes that implement queried protocol
         */
        "protocol": function () {
            throw "protocol not supported for this adapter " + this.impl;

        },
        "purge": function () {
            throw "purge not supported for this adapter " + this.impl;
        }
    };

    /**
     * @class Oskari.clazzdef
     *
     * A Container for any Oskari class definitions
     */
    var clazzdef = function () {

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

        "purge": function () {

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
        "protocol": function () {
            var args = arguments;
            if (args.length === 0) {
                throw "missing arguments";
            }

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
        "metadata": function () {
            var args = arguments,
                cdef,
                pdefsp,
                bp = null,
                pp = null,
                sp = null,
                parts,
                pdef;
            if (args.length === 0) {
                throw "missing arguments";
            }

            cdef = args[0];

            pdefsp = this.impl.clazzcache[cdef];

            if (!pdefsp) {
                parts = cdef.split('.');
                bp = parts[0];
                pp = parts[1];
                sp = parts.slice(2).join('.');

                pdef = this.impl.packages[pp];
                if (!pdef) {
                    pdef = {};
                    this.impl.packages[pp] = pdef;
                }
                pdefsp = pdef[sp];
                this.impl.clazzcache[cdef] = pdefsp;

            }

            if (!pdefsp) {
                throw "clazz " + sp + " does not exist in package " + pp + " bundle " + bp;
            }

            return pdefsp._metadata;

        },
        /**
         * @method updateMetadata
         * @private
         *
         * Updates and binds class metadata
         */
        "updateMetadata": function (bp, pp, sp, pdefsp, classMeta) {
            var protocols,
                p,
                pt,
                cn;
            if (!pdefsp._metadata) {
                pdefsp._metadata = {};
            }

            pdefsp._metadata.meta = classMeta;

            protocols = classMeta.protocol;
            if (protocols) {
                for (p = 0; p < protocols.length; p += 1) {
                    pt = protocols[p];

                    if (!this.impl.protocols[pt]) {
                        this.impl.protocols[pt] = {};
                    }

                    cn = bp + "." + pp + "." + sp;

                    this.impl.protocols[pt][cn] = pdefsp;
                }
            }

        },
        _super: function () {
            var supCat = arguments[0],
                supMet = arguments[1],
                me = this;
            return function () {
                return me._._superCategory[supCat][supMet].apply(me, arguments);
            };
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
        define: function () {
            var args = arguments,
                cdef,
                parts,
                bp,
                pp,
                sp,
                pdef,
                pdefsp,
                catFuncs,
                prot,
                pi,
                catName,
                extnds,
                e,
                p,
                superClazz,
                cd,
                compo;
            if (args.length === 0) {
                throw "missing arguments";
            }

            cdef = args[0];
            parts = cdef.split('.');

            /*
             * bp base part pp package part sp rest
             */
            bp = parts[0];

            pp = parts[1];

            sp = parts.slice(2).join('.');

            pdef = this.impl.packages[pp];
            if (!pdef) {
                pdef = {};
                this.impl.packages[pp] = pdef;
            }

            pdefsp = pdef[sp];

            if (pdefsp) {
                // update constrcutor
                pdefsp._constructor = args[1];

                // update prototype
                catFuncs = args[2];
                prot = pdefsp._class.prototype;

                for (p in catFuncs) {
                    if (catFuncs.hasOwnProperty(p)) {
                        pi = catFuncs[p];
                        prot[p] = pi;
                    }
                }
                catName = cdef;
                pdefsp._category[catName] = catFuncs;
                if (args.length > 3) {

                    extnds = args[3].extend;
                    for (e = 0; extnds && e < extnds.length; e += 1) {
                        superClazz = this.lookup(extnds[e]);
                        if (!superClazz._composition.subClazz) {
                            superClazz._composition.subClazz = {};
                        }
                        superClazz._composition.subClazz[extnds[e]] = pdefsp;
                        pdefsp._composition.superClazz = superClazz;
                    }

                    this.updateMetadata(bp, pp, sp, pdefsp, args[3]);
                }

                this.pullDown(pdefsp);
                this.pushDown(pdefsp);

                return pdefsp;
            }

            cd = function () {};
            compo = {
                clazzName: cdef,
                superClazz: null,
                subClazz: null
            };
            cd.prototype = {};
            //args[2];
            pdefsp = {
                _class: cd,
                _constructor: args[1],
                _category: {},
                _composition: compo
            };
            cd.prototype._ = pdefsp;
            cd.prototype._super = this._super;

            // update prototype
            catFuncs = args[2];
            prot = cd.prototype;

            for (p in catFuncs) {
                if (catFuncs.hasOwnProperty(p)) {
                    pi = catFuncs[p];
                    prot[p] = pi;
                }
            }
            catName = cdef;
            pdefsp._category[catName] = catFuncs;

            this.impl.inheritance[cdef] = compo;
            pdef[sp] = pdefsp;

            catName = cdef;
            pdefsp._category[catName] = args[2];

            if (args.length > 3) {

                extnds = args[3].extend;
                for (e = 0; extnds && e < extnds.length; e += 1) {
                    superClazz = this.lookup(extnds[e]);
                    if (!superClazz._composition.subClazz) {
                        superClazz._composition.subClazz = {};
                    }
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
        category: function () {
            var args = arguments,
                cdef,
                parts,
                bp,
                pp,
                sp,
                pdef,
                pdefsp,
                cd,
                compo,
                catName,
                catFuncs,
                prot,
                pi,
                p;
            if (args.length === 0) {
                throw "missing arguments";
            }

            cdef = args[0];
            parts = cdef.split('.');
            /*
             * bp base part pp package part sp rest
             */
            bp = parts[0];

            pp = parts[1];

            sp = parts.slice(2).join('.');

            pdef = this.impl.packages[pp];
            if (!pdef) {
                pdef = {};
                this.impl.packages[pp] = pdef;
            }
            pdefsp = pdef[sp];

            if (!pdefsp) {
                cd = function () {};
                compo = {
                    clazzName: cdef,
                    superClazz: null,
                    subClazz: null
                };
                cd.prototype = {};
                pdefsp = {
                    _class: cd,
                    _constructor: args[1],
                    _category: {},
                    _composition: compo
                };
                cd.prototype._ = pdefsp;
                cd.prototype._super = this._super;
                this.impl.inheritance[cdef] = compo;
                pdef[sp] = pdefsp;

            }

            catName = args[1];
            catFuncs = args[2];
            prot = pdefsp._class.prototype;

            for (p in catFuncs) {
                if (catFuncs.hasOwnProperty(p)) {
                    pi = catFuncs[p];
                    prot[p] = pi;
                }
            }

            pdefsp._category[catName] = catFuncs;

            this.pullDown(pdefsp);
            this.pushDown(pdefsp);

            return pdefsp;
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
        lookup: function () {
            var args = arguments,
                cdef,
                parts,
                bp,
                pp,
                sp,
                pdef,
                pdefsp,
                cd,
                compo;
            if (args.length === 0) {
                throw "missing arguments";
            }

            cdef = args[0];
            parts = cdef.split('.');
            /*
             * bp base part pp package part sp rest
             */
            bp = parts[0];

            pp = parts[1];

            sp = parts.slice(2).join('.');

            pdef = this.impl.packages[pp];
            if (!pdef) {
                pdef = {};
                this.impl.packages[pp] = pdef;
            }
            pdefsp = pdef[sp];

            if (!pdefsp) {
                cd = function () {};
                cd.prototype = {};
                compo = {
                    clazzName: cdef,
                    superClazz: null,
                    subClazz: null
                };
                pdefsp = {
                    _class: cd,
                    _constructor: args[1],
                    _category: {},
                    _composition: compo
                };
                this.impl.inheritance[cdef] = compo;
                pdef[sp] = pdefsp;

            }

            return pdefsp;
        },
        extend: function () {
            var args = arguments,
                superClazz = this.lookup(args[1]),
                subClazz = this.lookup(args[0]);
            if (!superClazz._composition.subClazz) {
                superClazz._composition.subClazz = {};
            }
            superClazz._composition.subClazz[args[0]] = subClazz;
            subClazz._composition.superClazz = superClazz;
            this.pullDown(subClazz);
            return subClazz;
        },
        composition: function () {
            var cdef = arguments[0],
                pdefsp = this.impl.clazzcache[cdef],
                bp = null,
                pp = null,
                sp = null,
                parts,
                pdef;
            if (!pdefsp) {
                parts = cdef.split('.');
                bp = parts[0];
                pp = parts[1];
                sp = parts.slice(2).join('.');

                pdef = this.impl.packages[pp];
                if (!pdef) {
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
        pushDown: function (pdefsp) {
            var sub,
                pdefsub;
            /* !self */
            if (!pdefsp._composition.subClazz) {
                return;
            }
            for (sub in pdefsp._composition.subClazz) {
                if (pdefsp._composition.subClazz.hasOwnProperty(sub)) {
                    pdefsub = pdefsp._composition.subClazz[sub];
                    this.pullDown(pdefsub);
                    this.pushDown(pdefsub);
                }
            }
        },
        /**
         * @method pullDown
         *
         * EACH class is responsible for it's entire hierarchy
         * no intermediate results are being consolidated
         *
         */
        pullDown: function (pdefsp) {
            var clazzHierarchy = [],
                funcs = {},
                spr,
                prot,
                constructors = [],
                superClazzMethodCats = {},
                s,
                cn,
                ctor,
                superClazzMetCat,
                c,
                catName,
                catFuncs,
                p,
                pi;
            if (!pdefsp._composition.superClazz) {
                return;
            }
            clazzHierarchy.push(pdefsp);
            spr = pdefsp;
            while (true) {
                spr = spr._composition.superClazz;
                if (!spr) {
                    break;
                }
                clazzHierarchy.push(spr);
            }

            prot = pdefsp._class.prototype;
            for (s = clazzHierarchy.length - 1; s >= 0; s -= 1) {
                cn = clazzHierarchy[s]._composition.clazzName;

                ctor = clazzHierarchy[s]._constructor;
                constructors.push(ctor);

                superClazzMetCat = {};
                for (c in clazzHierarchy[s]._category) {
                    if (clazzHierarchy[s]._category.hasOwnProperty(c)) {
                        catName = cn + "#" + c;
                        catFuncs = clazzHierarchy[s]._category[c];
                        for (p in catFuncs) {
                            if (catFuncs.hasOwnProperty(p)) {
                                pi = catFuncs[p];
                                prot[p] = pi;
                                superClazzMetCat[p] = pi;
                            }
                        }
                    }
                }
                superClazzMethodCats[cn] = superClazzMetCat;
            }
            pdefsp._constructors = constructors;
            pdefsp._superCategory = superClazzMethodCats;
            // FIXME clazz is undefined
            return clazz;
        },
        /**
         * @method printAncestry
         * prints class inheritance to console
         */
        printAncestry: function () {
            var pdefsp = this.lookup.apply(this, arguments),
                clazzHierarchy = [],
                spr,
                s;
            if (!pdefsp._composition.superClazz) {
                return;
            }

            clazzHierarchy.push(pdefsp);

            spr = pdefsp;
            while (true) {
                spr = spr._composition.superClazz;
                if (!spr) {
                    break;
                }
                clazzHierarchy.push(spr);
            }
            for (s = clazzHierarchy.length - 1; s >= 0; s -= 1) {
                if (console && console.log) {
                    console.log("                 ".substring(0, clazzHierarchy.length - s) + "|_ " + clazzHierarchy[s]._composition.clazzName);
                }
            }
        },
        /**
         * @method printHierarchy
         * print subclasses to console
         */
        printHierarchy: function () {
            var pdefsp = this.lookup.apply(this, arguments),
                clazzHierarchy = [],
                taskList = [],
                task,
                pdefc,
                pdefsub,
                p,
                s;
            if (!pdefsp._composition.subClazz) {
                return;
            }


            taskList.push({
                c: null,
                sub: pdefsp,
                level: 0
            });

            while (true) {
                task = taskList.shift();
                if (!task) {
                    break;
                }
                /*clazzHierarchy.push({ level: task.level, sub: task.sub });*/
                clazzHierarchy.push("                 ".substring(0, task.level) + "|_ " + task.sub._composition.clazzName);

                pdefc = task.c;
                pdefsub = task.sub;
                if (!pdefsub._composition.subClazz) {
                    continue;
                }

                for (p in pdefsub._composition.subClazz) {
                    if (pdefsub._composition.subClazz.hasOwnProperty(p)) {
                        taskList.push({
                            c: pdefc,
                            sub: pdefsub._composition.subClazz[p],
                            level: task.level + 1
                        });
                    }
                }
            }

            for (s = 0; s < clazzHierarchy.length; s += 1) {
                if (console && console.log) {
                    console.log(clazzHierarchy[s]);
                }
            }

        },
        /**
         * @method apropos
         */
        apropos: function () {
            var pdefsp = this.lookup.apply(this, arguments),
                p;

            for (p in pdefsp._category[arguments[0]]) {
                if (pdefsp._category[arguments[0]].hasOwnProperty(p)) {
                    if (console && console.log) {
                        console.log(p);
                    }
                }
            }
        },
        slicer: Array.prototype.slice,

        /*
         * @method create
         *
         * creates a class instance THIS is for compatibility mode only
         * construct should be used for new classes
         *
         * var x =
         * Oskari.clazz.create('Oskari.mapframework.request.common.ActivateOpenlayersMapControlRequest','12313');
         */
        create: function () {
            var args = arguments,
                instargs,
                cdef,
                pdef,
                pdefsp,
                bp,
                pp,
                sp,
                parts,
                inst,
                ctors,
                c;
            if (args.length === 0) {
                throw "missing arguments";
            }
            instargs = this.slicer.apply(arguments, [1]);
            /*[];
             for(var n = 1; n < args.length; n++)
             instargs.push(args[n]);*/

            cdef = args[0];

            pdefsp = this.impl.clazzcache[cdef];

            bp = null;
            pp = null;
            sp = null;
            if (!pdefsp) {
                parts = cdef.split('.');
                bp = parts[0];
                pp = parts[1];
                sp = parts.slice(2).join('.');

                pdef = this.impl.packages[pp];
                if (!pdef) {
                    pdef = {};
                    this.impl.packages[pp] = pdef;
                }
                pdefsp = pdef[sp];
                this.impl.clazzcache[cdef] = pdefsp;

            }

            if (!pdefsp) {
                throw "clazz " + sp + " does not exist in package " + pp + " bundle " + bp;
            }

            inst = new pdefsp._class();
            ctors = pdefsp._constructors;
            if (ctors) {
                for (c = 0; c < ctors.length; c += 1) {
                    ctors[c].apply(inst, instargs);
                }
            } else {
                pdefsp._constructor.apply(inst, instargs);
            }
            return inst;
        },
        createWithPdefsp: function () {
            var args = arguments,
                instargs,
                pdefsp,
                inst,
                ctors,
                c;
            if (args.length === 0) {
                throw "missing arguments";
            }
            instargs = arguments[1];
            pdefsp = args[0];
            if (!pdefsp) {
                throw "clazz does not exist ";
            }

            inst = new pdefsp._class();
            ctors = pdefsp._constructors;
            if (ctors) {
                for (c = 0; c < ctors.length; c += 1) {
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
        construct: function () {
            var args = arguments,
                cdef,
                instprops,
                pdefsp,
                bp = null,
                pp = null,
                sp = null,
                parts,
                pdef,
                inst;
            if (args.length !== 2) {
                throw "missing arguments";
            }

            cdef = args[0];
            instprops = args[1];

            pdefsp = this.impl.clazzcache[cdef];

            if (!pdefsp) {
                parts = cdef.split('.');
                bp = parts[0];
                pp = parts[1];
                sp = parts.slice(2).join('.');

                pdef = this.impl.packages[pp];
                if (!pdef) {
                    pdef = {};
                    this.impl.packages[pp] = pdef;
                }
                pdefsp = pdef[sp];
                this.impl.clazzcache[cdef] = pdefsp;

            }

            if (!pdefsp) {
                throw "clazz " + sp + " does not exist in package " + pp + " bundle " + bp;
            }

            inst = new pdefsp._class();
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
        builder: function () {
            var args = arguments,
                cdef,
                pdefsp,
                bp = null,
                pp = null,
                sp = null,
                parts,
                pdef,
                instargs,
                inst,
                ctors,
                c;
            if (args.length === 0) {
                throw "missing arguments";
            }

            cdef = args[0];
            pdefsp = this.impl.clazzcache[cdef];

            if (!pdefsp) {
                parts = cdef.split('.');
                bp = parts[0];
                pp = parts[1];
                sp = parts.slice(2).join('.');

                pdef = this.impl.packages[pp];
                if (!pdef) {
                    pdef = {};
                    this.impl.packages[pp] = pdef;
                }
                pdefsp = pdef[sp];
                this.impl.clazzcache[cdef] = pdefsp;

            }

            if (!pdefsp) {
                throw "clazz " + sp + " does not exist in package " + pp + " bundle " + bp;
            }

            if (pdefsp._builder) {
                return pdefsp._builder;
            }

            pdefsp._builder = function () {
                instargs = arguments;
                inst = new pdefsp._class();
                ctors = pdefsp._constructors;
                if (ctors) {
                    for (c = 0; c < ctors.length; c += 1) {
                        ctors[c].apply(inst, instargs);
                    }
                }
                pdefsp._constructor.apply(inst, instargs);
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
        builderFromPdefsp: function () {
            var args = arguments,
                pdefsp,
                instargs,
                inst,
                ctors,
                c;
            if (args.length === 0) {
                throw "missing arguments";
            }

            pdefsp = args[0];

            if (!pdefsp) {
                throw "pdefsp not defined.";
            }

            if (pdefsp._builder) {
                return pdefsp._builder;
            }

            pdefsp._builder = function () {
                instargs = arguments;
                inst = new pdefsp._class();
                ctors = pdefsp._constructors;
                if (ctors) {
                    for (c = 0; c < ctors.length; c += 1) {
                        ctors[c].apply(inst, instargs);
                    }
                } else {
                    pdefsp._constructor.apply(inst, instargs);
                }
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
    var clazz = function (regExp, adapter) {
        this.defRex = new RegExp(regExp);
        this.def = adapter;
        this.hasOtherNs = false;
        this.ns = {};
        this.alias = {};

        this.globals = {};
    };

    clazz.prototype = {

        get: function () {
            var args = arguments,
                parts,
                bp,
                ai;
            if (!this.hasOtherNs || this.defRex.test(args[0])) {
                return this.def;
            }

            parts = args[0].split('.');
            bp = parts[0];
            ai = this.ns[bp];
            if (!ai) {
                throw "clazz: ns NOT bound " + bp;
            }
            return ai;
        },
        /*
         * @method self @param adapter identifier
         *
         * returns class adapter for the given class libray
         *
         */
        self: function (bp) {
            var ai = this.ns[bp];
            if (!ai) {
                throw "clazz: ns NOT bound " + bp;
            }

            return ai.self;
        },
        /**
         * @method adapt
         *
         * registers an adapter to the class system
         */
        adapt: function (base, adapter) {
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
        define: function () {
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
        category: function () {
            var ai = this.get.apply(this, arguments);

            return ai.category.apply(ai, arguments);

        },
        composition: function () {
            var ai = this.get.apply(this, arguments);

            return ai.composition.apply(ai, arguments);

        },
        extend: function () {
            var ai = this.get.apply(this, arguments);

            return ai.extend.apply(ai, arguments);

        },
        /**
         * @method create Creates a class instance
         * @param classname
         *            Parameters differ for different class adapters
         *
         */
        create: function () {
            var ai = this.get.apply(this, arguments);

            return ai.create.apply(ai, arguments);

        },
        createWithPdefsp: function () {
            var ai = this.get.apply(this, arguments);
            return ai.createWithPdefsp.apply(ai, arguments);
        },
        /**
         * @method construct
         * @param classname
         *            Parameters differ for different class adapters
         *
         * Constructs an instance with a property object
         */
        construct: function () {
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
        createArrArgs: function (args) {
            var ai = this.get.apply(this, arguments);
            return ai.create.apply(ai, args);

        },
        /**
         * @method builder
         * @param classname
         *            returns a class instance builder that can be reused
         */
        builder: function () {
            var ai = this.get.apply(this, arguments);

            return ai.builder.apply(ai, arguments);
        },
        builderFromPdefsp: function () {
            var ai = this.get.apply(this, arguments);

            return ai.builderFromPdefsp.apply(ai, arguments);
        },
        /**
         * @method global
         * @param variable
         *            name
         * @param optional
         *            value gets or sets a global variable for Oskari context
         */
        global: function () {
            var name;
            if (arguments.length === 0) {
                return this.globals;
            }
            name = arguments[0];
            if (arguments.length === 2) {
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
        "metadata": function () {
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
        "protocol": function () {
            var ai = this.get.apply(this, arguments);

            return ai.protocol.apply(ai, arguments);
        },
        "purge": function () {
            var ai = this.get.apply(this, arguments);

            return ai.purge.apply(ai, arguments);

        },
        "printAncestry": function () {
            var ai = this.get.apply(this, arguments);
            return ai.printAncestry.apply(ai, arguments);

        },
        "printHierarchy": function () {
            var ai = this.get.apply(this, arguments);
            return ai.printHierarchy.apply(ai, arguments);

        },
        "apropos": function () {
            var ai = this.get.apply(this, arguments);
            return ai.apropos.apply(ai, arguments);

        },
        "lookup": function () {
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
    var bundle_loader = function (manager, cb) {
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
        "add": function (fn, pdef) {
            var me = this,
                def;
            if (!me.files[fn]) {
                def = {
                    src: fn,
                    type: (pdef ? pdef.type : null) || "text/javascript",
                    id: pdef ? pdef.id : null,
                    state: false

                };
                me.files[fn] = def;

                if ("text/javascript" === def.type) {
                    me.filesRequested += 1;
                }
                me.fileList.push(def);
            }
        },
        getState: function () {
            if (this.filesRequested === 0) {
                return 1;
            }

            return (this.filesLoaded / this.filesRequested);
        },
        /**
         * @method commit
         *
         * commits any script loading requests
         */
        "commit": function () {
            var head = document.getElementsByTagName("head")[0],
                fragment = document.createDocumentFragment(),
                me = this,
                numFiles = me.filesRequested,
                onFileLoaded,
                f,
                n,
                def,
                fn,
                st;
            if (numFiles === 0) {
                me.callback();
                me.manager.notifyLoaderStateChanged(me, true);
                return;
            }
            if (preloaded()) {
                me.callback();
                me.manager.notifyLoaderStateChanged(me, true);
                return;
            }

            onFileLoaded = function () {
                me.filesLoaded += 1;
                me.manager.log("Files loaded " + me.filesLoaded + "/" + me.filesRequested);

                if (numFiles === me.filesLoaded) {
                    me.callback();
                    me.manager.notifyLoaderStateChanged(me, true);
                } else {
                    me.manager.notifyLoaderStateChanged(me, false);
                }
            };
            f = false;
            for (n = 0; n < me.fileList.length; n += 1) {
                def = me.fileList[n];
                fn = def.src;
                st = me.buildScriptTag(fn, onFileLoaded, def.type, def.id);
                if (st) {
                    // If this breaks something, revert to using method 1
                    if (preloaded()) {
                        onFileLoaded();
                    } else {
                        fragment.appendChild(st);
                        f = true;
                    }
                }
            }
            if (f) {
                head.appendChild(fragment);
            }
        },
        /**
         * @method buildScriptTag
         * @private
         *
         * builds a script tag to be applied to document head assumes UTF-8
         */
        "buildScriptTag": function (filename, callback, elementtype, elementId) {
            var me = this,
                script = document.createElement('script');
            if (elementId) {
                script.id = elementId;
            }
            script.type = elementtype; //||'text/javascript';
            script.charset = 'utf-8';

            if (preloaded()) {
                // This should be redundant, see "If this..." in commit() above
                script.src = '/Oskari/empty.js';
            } else {
                script.src = filename;
            }

            /*
             * IE has a different way of handling &lt;script&gt; loads, so we //
             * need to check for it here
             */
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState === "loaded" || script.readyState === "complete") {
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
    var bundle_mediator = function (opts) {
        var p;
        this.manager = null;

        for (p in opts) {
            if (opts.hasOwnProperty(p)) {
                this[p] = opts[p];
            }
        }
    };
    bundle_mediator.prototype = {
        /**
         * @method setState
         * @param state
         * @returns
         */
        "setState": function (state) {
            this.state = state;
            this.manager.postChange(this.bundle, this.instance, this.state);
            return this.state;
        },
        /**
         * @method getState
         * @returns
         */
        "getState": function () {

            return this.state;
        }
    };

    /**
     * @class Oskari.bundle_trigger
     */
    var bundle_trigger = function (btc, cb, info) {
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
        "execute": function (manager, b, bi, info) {
            var me = this,
                p,
                srcState,
                cb;
            if (me.fired) {
                //manager.log("trigger already fired " + info || this.info);
                return;
            }

            for (p in me.config["Import-Bundle"]) {
                if (me.config["Import-Bundle"].hasOwnProperty(p)) {
                    srcState = manager.stateForBundleSources[p];
                    if (!srcState || srcState.state !== 1) {
                        manager.log("trigger not fired due " + p + " for " + info || this.info);
                        return;
                    }
                }
            }
            me.fired = true;
            manager.log("posting trigger");
            cb = this.callback;

            window.setTimeout(function () {
                cb(manager);
            }, 0);
        }
    };

    /**
     * @class Oskari.bundle_manager
     * @singleton
     */
    var bundle_manager = function () {
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
            sources: {},
            sinks: {}
        };

        this.triggers = [];

        this.loaderStateListeners = [];
    };

    bundle_manager.prototype = {
        purge: function () {
            var p,
                me = this;
            for (p in me.sources) {
                if (me.sources.hasOwnProperty(p)) {
                    delete me.sources[p];
                }
            }
            for (p in me.stateForBundleDefinitions) {
                if (me.stateForBundleDefinitions.hasOwnProperty(p)) {
                    delete me.stateForBundleDefinitions[p].loader;
                }
            }
            for (p in me.stateForBundleSources) {
                if (me.stateForBundleSources.hasOwnProperty(p)) {
                    delete me.stateForBundleSources[p].loader;
                }
            }
        },
        /**
         * @
         */
        notifyLoaderStateChanged: function (bl, finished) {
            var l,
                cb;
            if (this.loaderStateListeners.length === 0) {
                return;
            }
            for (l = 0; l < this.loaderStateListeners.length; l += 1) {
                cb = this.loaderStateListeners[l];
                cb(bl, finished);
            }
        },
        registerLoaderStateListener: function (cb) {
            this.loaderStateListeners.push(cb);
        },
        /**
         * @method alert
         * @param what
         *
         * a loggin and debugging function
         */
        "alert": function (what) {
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
        "log": function (what) {
            logMsg(what);

        },
        /**
         * @method loadCss
         * @param sScriptSrc contains css style url
         * @param oCallback not implemented
         */
        "loadCss": function (sScriptSrc, oCallback) {
            this.log("loading CSS " + sScriptSrc);
            var cssParentElement = document.getElementsByTagName("head").length ? document.getElementsByTagName("head")[0] : document.body,
                styles,
                linkElement;
            if (!preloaded()) {
                // FIXME jQuery.browser is deprecated
                if (jQuery.browser.msie) {
                    // IE has a limitation of 31 stylesheets.
                    // It can be increased to 31*31 by using import in the stylesheets,
                    // but import should be avoided due to performance issues.
                    // Instead we retrieve the css files with xhr and
                    // concatenates the styles into a single inline style declaration.
                    jQuery.ajax({
                        url: sScriptSrc,
                        dataType: "text"
                    }).done(function (css) {
                        styles = document.getElementById("concatenated");
                        if (styles) {
                            // styles found, append
                            styles.styleSheet.cssText += css;
                        } else {
                            // styles was not found, create new style element
                            styles = document.createElement('style');
                            cssParentElement.appendChild(styles);
                            styles.setAttribute('type', 'text/css');
                            styles.styleSheet.cssText = css;
                            styles.id = "concatenated";
                        }
                        return css;
                    });
                } else {
                    linkElement = document.createElement("link");
                    linkElement.type = "text/css";
                    linkElement.rel = "stylesheet";
                    linkElement.href = sScriptSrc;
                    cssParentElement.appendChild(linkElement);
                }
            }
        },
        /**
         * @method self
         * @returns {bundle_manager}
         */
        "self": function () {
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
        "install": function (implid, bp, srcs, metadata) {
            // installs bundle
            // DOES not INSTANTIATE only register bp as function
            // declares any additional sources required

            var me = this,
                bundleImpl = implid,
                defState = me.stateForBundleDefinitions[bundleImpl],
                srcState;
            if (defState) {
                defState.state = 1;
                me.log("SETTING STATE FOR BUNDLEDEF " + bundleImpl + " existing state to " + defState.state);
            } else {
                defState = {
                    state: 1
                };

                me.stateForBundleDefinitions[bundleImpl] = defState;
                me.log("SETTING STATE FOR BUNDLEDEF " + bundleImpl + " NEW state to " + defState.state);
            }
            defState.metadata = metadata;

            me.impls[bundleImpl] = bp;
            me.sources[bundleImpl] = srcs;

            srcState = me.stateForBundleSources[bundleImpl];
            if (srcState) {
                if (srcState.state === -1) {
                    me.log("triggering loadBundleSources for " + bundleImpl + " at loadBundleDefinition");
                    window.setTimeout(function () {
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
        "installBundleClass": function (implid, clazzName) {
            var cs = clazz.prototype.singleton,
                classmeta = cs.metadata(clazzName),
                bp = cs.builder(clazzName),
                srcs = classmeta.meta.source,
                bundleMetadata = classmeta.meta.bundle;

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
        installBundlePdefsp: function (implid, pdefsp) {
            var cs = clazz.prototype.singleton,
                bp = cs.builderFromPdefsp(pdefsp),
                bundleMetadata = pdefsp._metadata,
                srcs = {};

            this.install(implid, bp, srcs, bundleMetadata);

        },
        /**
         * @method impl
         * @param implid
         * @returns bundle implemenation
         *
         */
        "impl": function (implid) {
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
        "loadBundleDefinition": function (implid, bundleSrc, pbundlePath) {
            var me = this,
                bundleImpl = implid,
                defState = me.stateForBundleDefinitions[bundleImpl],
                bundlePath,
                bl;
            me.log("loadBundleDefinition called with " + bundleImpl);
            if (defState) {
                if (defState.state === 1) {
                    me.log("bundle definition already loaded for " + bundleImpl);
                    me.postChange(null, null, "bundle_definition_loaded");
                    return;
                }
                me.log("bundle definition already loaded OR WHAT?" + bundleImpl + " " + defState.state);
                return;
            } else {
                defState = {
                    state: -1
                };
                me.stateForBundleDefinitions[bundleImpl] = defState;
                me.log("set NEW state for DEFINITION " + bundleImpl + " to " + defState.state);
            }

            defState.bundleSrcPath = bundleSrc;
            bundlePath = pbundlePath || (bundleSrc.substring(0, bundleSrc.lastIndexOf('/')));
            defState.bundlePath = bundlePath;

            bl = new bundle_loader(this, function () {
                me.log("bundle_def_loaded_callback");
            });
            bl.metadata.context = 'bundleDefinition';

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
        "loadBundleSources": function (implid) {
            // load any JavaScripts for bundle
            // MUST be done before createBundle
            var me = this,
                bundleImpl = implid,
                defState = me.stateForBundleDefinitions[bundleImpl],
                srcFiles,
                srcState,
                callback,
                bundlePath,
                srcs,
                p,
                def,
                defs,
                defSrc,
                src,
                n,
                fn,
                fnWithPath,
                requiredLocale;
            me.log("loadBundleSources called with " + bundleImpl);
            // log(defState);

            if (!defState) {
                throw "INVALID_STATE: bundle definition load not requested for " + bundleImpl;
            }
            if (defState) {
                me.log("- definition STATE for " + bundleImpl + " at load sources " + defState.state);
            }

            if (mode === 'static') {
                me.postChange(null, null, "bundle_definition_loaded");
                return;
            }

            srcState = me.stateForBundleSources[bundleImpl];

            if (srcState) {
                if (srcState.state === 1) {
                    me.log("already loaded sources for : " + bundleImpl);
                    return;
                } else if (srcState.state === -1) {
                    me.log("loading previously pending sources for " + bundleImpl + " " + srcState.state + " or what?");
                } else {
                    throw "INVALID_STATE: at " + bundleImpl;
                }
            } else {
                srcState = {
                    state: -1
                };
                me.stateForBundleSources[bundleImpl] = srcState;
                me.log("setting STATE for sources " + bundleImpl + " to " + srcState.state);
            }

            if (defState.state !== 1) {
                me.log("pending DEFINITION at sources for " + bundleImpl + " to " + defState.state + " -> postponed");

                return;
            }

            me.log("STARTING load for sources " + bundleImpl);

            srcFiles = {
                count: 0,
                loaded: 0,
                files: {},
                css: {}
            };
            callback = function () {
                me.log("finished loading " + srcFiles.count + " files for " + bundleImpl + ".");
                me.stateForBundleSources[bundleImpl].state = 1;
                me.log("set NEW state post source load for " + bundleImpl + " to " + me.stateForBundleSources[bundleImpl].state);

                me.postChange(null, null, "bundle_sources_loaded");
            };
            bundlePath = defState.bundlePath;

            srcs = me.sources[bundleImpl];

            if (srcs) {

                me.log("got sources for " + bundleImpl);

                for (p in srcs) {
                    if (p === 'scripts') {

                        defs = srcs[p];

                        for (n = 0; n < defs.length; n += 1) {
                            def = defs[n];
                            if (def.type === "text/css") {

                                fn = def.src;
                                fnWithPath = null;
                                if (fn.indexOf('http') !== -1) {
                                    fnWithPath = fn;
                                } else {
                                    fnWithPath = bundlePath + '/' + fn;
                                }

                                srcFiles.css[fnWithPath] = def;

                            } else if (def.type) {
                                srcFiles.count += 1;
                                /* var fn = def.src + "?ts=" + instTs; */
                                fn = buildPathForLoaderMode(def.src, bundlePath);

                                fnWithPath = null;
                                if (fn.indexOf('http') !== -1) {
                                    fnWithPath = fn;
                                } else {
                                    fnWithPath = bundlePath + '/' + fn;
                                }

                                srcFiles.files[fnWithPath] = def;
                            }

                        }
                    } else if (p === 'locales') {
                        requiredLocale = blocale.getLang();
                        defs = srcs[p];

                        /*console.log("locales",defs);*/
                        for (n = 0; n < defs.length; n += 1) {
                            def = defs[n];

                            /*console.log("locale",def,requiredLocale);*/
                            /*
                            if (requiredLocale && def.lang && def.lang !== requiredLocale) {
                                //console.log("locale",def,def.lang,requiredLocale, "NO MATCH?");
                                continue;
                            }*/

                            if (def.type === "text/css") {

                                fn = def.src;
                                fnWithPath = null;
                                if (fn.indexOf('http') !== -1) {
                                    fnWithPath = fn;
                                } else {
                                    fnWithPath = bundlePath + '/' + fn;
                                }

                                srcFiles.css[fnWithPath] = def;

                            } else if (def.type) {
                                srcFiles.count += 1;
                                /* var fn = def.src + "?ts=" + instTs; */
                                fn = buildPathForLoaderMode(def.src, bundlePath);

                                fnWithPath = null;
                                if (fn.indexOf('http') !== -1) {
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
            for (src in srcFiles.css) {
                if (srcFiles.css.hasOwnProperty(src)) {
                    // var def = srcFiles.css[src];
                    defSrc = src;
                    fn = buildPathForLoaderMode(defSrc, bundlePath);
                    me.loadCss(fn, callback);
                    me.log("- added css source " + fn + " for " + bundleImpl);
                }
            }

            /*
             * for (js in srcFiles.files) { var def = srcFiles.files[js];
             * me.log("triggering load for " + bundleImpl + " " + def.src);
             * me.loadSrc(def.src, callback); }
             */
            var bl = new bundle_loader(this, callback),
                js;
            bl.metadata.context = 'bundleSources';
            bl.metadata.bundleImpl = bundleImpl;
            srcState.loader = bl;

            /**
             * if using compiled javascript
             */
            if (isPackedMode()) {

                var fileCount = 0;
                for (js in srcFiles.files) {
                    if (srcFiles.files.hasOwnProperty(js)) {
                        fileCount += 1;
                    }
                }
                if (fileCount > 0) {

                    var srcsFn = buildPathForPackedMode(bundlePath);
                    bl.add(srcsFn, "text/javascript");
                    me.log("- added PACKED javascript source " + srcsFn + " for " + bundleImpl);

                    var localesFn = buildLocalePathForPackedMode(bundlePath);
                    bl.add(localesFn, "text/javascript");
                    me.log("- added PACKED locale javascript source " + localesFn + " for " + bundleImpl);
                }

                /**
                 * else load any files
                 */
            } else {
                for (js in srcFiles.files) {
                    if (srcFiles.files.hasOwnProperty(js)) {
                        bl.add(js, srcFiles.files[js]);
                        me.log("- added script source " + js + " for " + bundleImpl);
                    }
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
        "postChange": function (b, bi, info) {
            // self
            var me = this,
                bid,
                o,
                i;
            me.update(b, bi, info);

            // bundles
            for (bid in me.bundles) {
                if (me.bundles.hasOwnProperty(bid)) {
                    o = me.bundles[bid];
                    /* if (o != b) { */
                    o.update(me, b, bi, info);
                    // }
                }
            }
            // and instances
            for (i in me.instances) {
                if (me.instances.hasOwnProperty(i)) {
                    o = me.instances[i];
                    if (!o) {
                        continue;
                    }
                    // stopped are null here
                    // if (!bi || o != bi) {
                    o.update(me, b, bi, info);
                    // }
                }
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
        "createBundle": function (implid, bundleid) {
            // sets up bundle runs the registered func to instantiate bundle
            // this enables 'late binding'
            var bundlImpl = implid,
                me = this,
                defState = me.stateForBundleDefinitions[bundlImpl],
                bp,
                b;
            if (!defState) {
                throw "INVALID_STATE: for createBundle / " + "definition not loaded " + implid + "/" + bundleid;
            }

            bp = this.impls[implid];
            if (!bp) {
                alert("this.impls[" + implid + "] is null!");
                return;
            }
            b = bp(defState);

            this.bundles[bundleid] = b;
            this.stateForBundles[bundleid] = {
                state: true,
                bundlImpl: bundlImpl
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
        "bindImportedPackages": function () {
            // TBD
        },
        /**
         * @method bindImportedNamespaces
         *
         * NYI. Shall bind any imported namespaces to bundle mediator
         */
        "bindImportedNamespaces": function () {
            // TBD
        },
        /**
         * @method bindImportedEvents
         * @deprecated
         *
         * not needed. registrations will be based on actual event handlers.
         */
        "bindImportedEvents": function () {

        },
        /**
         * @method bindExportedPackages
         *
         * NYI. Shall support publishing a package from bundle
         */
        "bindExportedPackages": function () {
            // TBD
        },
        /**
         * @method bindExportedNamespaces NYI. Shall support publishing namespaces
         *         from bundle
         */
        "bindExportedNamespaces": function () {
            // TBD
        },
        /**
         * @methdod bindExportedRequests
         * @deprecated
         */
        "bindExportedRequests": function () {

        },
        /**
         * @method update
         * @param bundleid
         * @returns
         *
         * fires any pending bundle or bundle instance triggers
         *
         */
        "update": function (b, bi, info) {
            // resolves any bundle dependencies
            // this must be done before any starts
            // TO-DO
            // - bind package exports and imports
            // - bidn event imports and exports
            // - bind request exports ( and imports)
            // - bind any Namespaces (== Globals imported )
            // - fire any pending triggers

            var me = this,
                n,
                t;
            me.log("update called with info " + info);

            for (n = 0; n < me.triggers.length; n += 1) {
                t = me.triggers[n];
                t.execute(me);
            }
        },
        /**
         * @method bundle
         * @param bundleid
         * @returns bundle
         */
        "bundle": function (bundleid) {
            return this.bundles[bundleid];
        },
        /**
         * @method destroyBundle
         * @param bundleid
         *
         * NYI. Shall DESTROY bundle definition
         */
        "destroyBundle": function (bundleid) {
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
        "uninstall": function (implid) {
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
        "createInstance": function (bundleid) {
            // creates a bundle_instance
            // any configuration and setup IS BUNDLE / BUNDLE INSTANCE specific
            // create / config / start / process / stop / destroy ...

            var me = this;
            if (!me.stateForBundles[bundleid] || !me.stateForBundles[bundleid].state) {
                throw "INVALID_STATE: for createInstance / " + "definition not loaded " + bundleid;
            }

            var s = "" + (++this.serial);

            var b = this.bundles[bundleid];
            var bi = b.create();

            bi.mediator = new bundle_mediator({
                "bundleId": bundleid,
                "instanceid": s,
                "state": "initial",
                "bundle": b,
                "instance": bi,
                "manager": this,
                "clazz": clazz.prototype.singleton,
                "requestMediator": {}
            });

            this.instances[s] = bi;
            this.stateForBundleInstances[s] = {
                state: true,
                bundleid: bundleid
            };

            this.postChange(b, bi, "instance_created");
            return bi;
        },
        /**
         * @method instance
         * @param instanceid
         * @returns bundle instance
         */
        "instance": function (instanceid) {

            return this.instances[instanceid];
        },
        /**
         * @method destroyInstance
         * @param instanceid
         * @returns
         *
         * destroys and unregisters bundle instance
         */
        "destroyInstance": function (instanceid) {

            var bi = this.instances[instanceid],
                mediator = bi.mediator;
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
        "on": function (cfg, cb, info) {
            this.triggers.push(new bundle_trigger(cfg, cb, info));
        }
    };

    /*
     * @class Oskari.bundle_facade
     *
     * highlevel interface to bundle management Work in progress
     */
    var bundle_facade = function (bm) {
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
        getBundleInstanceByName: function (bundleinstancename) {
            var me = this;
            return me.bundleInstances[bundleinstancename];
        },
        /**
         * @method getBundleInstanceConfigurationByName
         *
         * returns configuration for instance by bundleinstancename
         */
        getBundleInstanceConfigurationByName: function (bundleinstancename) {
            var me = this;
            return me.appConfig[bundleinstancename];
        },
        /*
         * @method requireBundle executes callback after bundle sources have
         * been loaded an d bundle has been created
         *
         */
        requireBundle: function (implid, bundleid, cb) {
            var me = this,
                b = me.manager.createBundle(implid, bundleid);

            cb(me.manager, b);

        },
        /**
         * @method require executes callback after any requirements in bundle
         *         manifest have been met Work In Progress
         *
         */
        require: function (config, cb, info) {

            var me = this;
            me.manager.on(config, cb, info);
            var imports = config['Import-Bundle'],
                p;
            for (p in imports) {
                if (imports.hasOwnProperty(p)) {
                    var pp = p,
                        def = imports[p],
                        bundlePath = def.bundlePath || me.bundlePath;
                    /*
                     * var bundleDefFilename = bundlePath + pp + "/bundle.js?ts=" +
                     * (new Date().getTime());
                     */
                    var bundleDefFilename;
                    if (isPackedMode()) {
                        var packedBundleFn = buildBundlePathForPackedMode(bundlePath + pp);
                        bundleDefFilename = buildPathForLoaderMode(packedBundleFn, bundlePath);
                    } else {
                        bundleDefFilename = buildPathForLoaderMode(bundlePath + pp + "/bundle.js", bundlePath);
                    }
                    me.manager.log("FACADE requesting load for " + pp + " from " + bundleDefFilename);
                    me.manager.loadBundleDefinition(pp, bundleDefFilename, bundlePath + pp);
                    me.manager.loadBundleSources(pp);
                }
            }
        },
        setBundlePath: function (p) {
            this.bundlePath = p;
        },
        /*
         * @method loadBundleDeps
         */
        loadBundleDeps: function (deps, callback, manager, info) {
            var me = this,
                bdep = deps["Import-Bundle"],
                depslist = [],
                hasPhase = false,
                p,
                name,
                def;

            for (p in bdep) {
                if (bdep.hasOwnProperty(p)) {
                    name = p;
                    def = bdep[p];
                    depslist.push({
                        name: name,
                        def: def,
                        phase: def.phase
                    });
                    hasPhase = hasPhase || def.phase;
                }
            }

            depslist.sort(function (a, b) {
                if (!a.phase && !b.phase) {
                    return 0;
                }
                if (!a.phase) {
                    return 1;
                }
                if (!b.phase) {
                    return -1;
                }
                return a.phase < b.phase ? -1 : 1;
            });
            /*
             * console.log("!#!#! Built LIST OF DEPS"); for( var d = 0 ; d <
             * depslist.length ; d++ ) console.log(" - - - - -- - >
             * "+depslist[d].name);
             */

            if (hasPhase || !supportBundleAsync) {
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
        loadBundleDep: function (depslist, callback, manager, info) {
            var me = this,
                bundledef = depslist.pop(),
                def,
                bundlename,
                fcd,
                bdep;
            if (!bundledef) {
                callback(manager);
                return;
            }

            def = bundledef.def;
            bundlename = bundledef.name;

            fcd = this;
            bdep = {
                "Import-Bundle": {}
            };
            bdep["Import-Bundle"][bundlename] = def;
            fcd.require(bdep, function (manager) {
                me.loadBundleDep(depslist, callback, manager, info);
            }, info);
        },
        /**
         * @method loadBundleDep
         *
         * load bundles regardless of order
         */
        loadBundleDepAsync: function (deps, callback, manager, info) {
            this.require(deps, callback, info);
        },
        /**
         * @method playBundle
         *
         * plays a bundle player JSON object by instantiating any
         * required bundle instances
         *
         */
        playBundle: function (recData, cb) {

            // alert(bundleRec.get('title'));
            var metas = recData.metadata,
                bundlename = recData.bundlename,
                bundleinstancename = recData.bundleinstancename,
                isSingleton = metas.Singleton,
                fcd = this,
                me = this,
                instanceRequirements = metas["Require-Bundle-Instance"] || [],
                instanceProps = recData.instanceProp,
                r,
                implInfo,
                implid,
                bundleid,
                b,
                bi,
                configProps,
                yy;

            if (!recData.hasOwnProperty("bundleinstancename")) {
                if (console && console.warn) {
                    console.warn("Bundle is missing bundleinstancename, using bundlename in its place.", recData);
                }
                bundleinstancename = bundlename;
            }

            me.loadBundleDeps(metas, function (manager) {
                var ip;
                for (r = 0; r < instanceRequirements.length; r += 1) {
                    implInfo = instanceRequirements[r];
                    /* implname */
                    implid = (typeof (implInfo) === 'object') ? implInfo.bundlename : implInfo;
                    /* bundlename */
                    bundleid = (typeof (implInfo) === 'object') ? implInfo.bundleinstancename : implInfo + "Instance";
                    b = me.bundles[implid];
                    if (!b) {
                        b = manager.createBundle(implid, bundleid);
                        me.bundles[implid] = b;
                    }

                    bi = me.bundleInstances[bundleid];
                    if (!bi || !isSingleton) {
                        bi = manager.createInstance(bundleid);
                        me.bundleInstances[bundleid] = bi;

                        configProps = me.getBundleInstanceConfigurationByName(bundleid);
                        if (configProps) {
                            for (ip in configProps) {
                                if (configProps.hasOwnProperty(ip)) {
                                    bi[ip] = configProps[ip];
                                }
                            }
                        }
                        bi.start();
                    }
                }

                fcd.requireBundle(bundlename, bundleinstancename, function () {
                    var ip;
                    yy = manager.createInstance(bundleinstancename);

                    for (ip in instanceProps) {
                        if (instanceProps.hasOwnProperty(ip)) {
                            yy[ip] = instanceProps[ip];
                        }
                    }

                    configProps = me.getBundleInstanceConfigurationByName(bundleinstancename);
                    if (configProps) {
                        for (ip in configProps) {
                            if (configProps.hasOwnProperty(ip)) {
                                yy[ip] = configProps[ip];
                            }
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
        setApplicationSetup: function (setup) {
            this.appSetup = setup;
        },
        /**
         * @method getApplicationSetup
         * @return JSON application setup
         */
        getApplicationSetup: function () {
            return this.appSetup;
        },
        setConfiguration: function (config) {
            this.appConfig = config;
        },
        getConfiguration: function () {
            return this.appConfig;
        },
        /**
         * @method startApplication
         *
         * Starts JSON setup (set with setApplicationSetup)
         *
         */
        startApplication: function (cb) {
            var me = this,
                appSetup = this.appSetup,
                appConfig = this.appConfig,
                seq = this.appSetup.startupSequence.slice(0),
                seqLen = seq.length,
                startupInfo = {
                    bundlesInstanceConfigurations: appConfig,
                    bundlesInstanceInfos: {}
                };

            /**
             * Let's shift and playBundle until all done
             */

            var mediator = {
                facade: me,
                seq: seq,
                bndl: null,
                player: null,
                startupInfo: startupInfo
            };

            function schedule() {
                window.setTimeout(mediator.player, 0);
            }


            mediator.player = function () {

                /*console.log("BUNDLEPLAYER","shifting",mediator.seq);*/
                mediator.bndl = mediator.seq.shift();
                if (!mediator.bndl) {
                    /*console.log("BUNDLEPLAYER","finished");*/
                    if (cb) {
                        cb(startupInfo);
                    }
                    return;
                }

                /*console.log("BUNDLEPLAYER","playing",mediator.bndl.title,mediator.bndl);*/

                mediator.facade.playBundle(mediator.bndl, function (bi) {

                    var bndlName = mediator.bndl.bundlename,
                        bndlInstanceName = mediator.bndl.bundleinstancename;

                    mediator.startupInfo.bundlesInstanceInfos[bndlInstanceName] = {
                        bundlename: bndlName,
                        bundleinstancename: bndlInstanceName,
                        bundleInstance: bi
                    };
                    if (mediator.bndl.callback) {
                        if (typeof mediator.bndl.callback === "string") {
                            // FIXME no eval please
                            eval(mediator.bndl.callback);
                        }
                        mediator.bndl.callback.apply(this, [bi, mediator.bndl]);
                    }
                    schedule();
                });
            };
            schedule();

        },
        /**
         * @method stopApplication Might stop application if all stops implemented
         */
        stopApplication: function () {
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
    var fcd = new bundle_facade(bm),
        ga = cs.global,
        bundle_dom_manager = function (dollar) {
            this.$ = dollar;
        };

    bundle_dom_manager.prototype = {
        getEl: function (selector) {
            return this.$(selector);
        },
        getElForPart: function (part) {
            throw "N/A";
        },
        setElForPart: function (part, el) {
            throw "N/A";
        },
        setElParts: function (partsMap) {
            throw "N/A";
        },
        getElParts: function () {
            throw "N/A";
        },
        pushLayout: function (s) {
            throw "N/A";
        },
        popLayout: function (s) {
            throw "N/A";
        },
        getLayout: function () {
            throw "N/A";
        }
    };


    var domMgr = new bundle_dom_manager(jQuery);


    /* Oskari 2.x backport begin */

    /* o2 clazz module  */
    var o2anonclass = 0,
        o2anoncategory = 0,
        o2anonbundle = 0;

    /* this is Oskari 2 modulespec prototype which provides a leaner API  */

    /* @class Oskari.ModuleSpec 
     *
     * helper class instance of which is returned from oskari 2.0 api
     * Returned class instance may be used to chain class definition calls.
     */
    cs.define('Oskari.ModuleSpec', function (clazzInfo, clazzName) {
        this.cs = cs;
        this.clazzInfo = clazzInfo;
        this.clazzName = clazzName;

    }, {

        slicer: Array.prototype.slice,

        /* @method category 
         * adds a set of methods to class
         */
        category: function (protoProps, traitsName) {
            var clazzInfo = cs.category(this.clazzName, traitsName || (['__', (++o2anoncategory)].join('_')), protoProps);
            this.clazzInfo = clazzInfo;
            return this;
        },
        /* @method methods
         * adds a set of methods to class - alias to category
         */
        methods: function (protoProps, traitsName) {
            var clazzInfo = cs.category(this.clazzName, traitsName || (['__', (++o2anoncategory)].join('_')), protoProps);
            this.clazzInfo = clazzInfo;
            return this;
        },

        /* @method extend
         * adds inheritance from  a base class
         * base class can be declared later but must be defined before instantiation
         */
        extend: function (clsss) {
            var clazzInfo = cs.extend(this.clazzName, clsss.length ? clsss : [clsss]);
            this.clazzInfo = clazzInfo;
            return this;
        },
        /* @method create
         * creates an instance of this class
         */
        create: function () {
            return cs.createWithPdefsp(this.clazzInfo, arguments);
        },

        /*
         * @method returns the class name
         */
        name: function () {
            return this.clazzName;
        },

        /*
         * @method returns class metadata
         */
        metadata: function () {
            return cs.metadata(this.clazzName);
        },

        /*
         * @method events
         * adds a set of event handlers to class
         */
        events: function (events) {
            var orgmodspec = this;
            orgmodspec.category({
                eventHandlers: events,
                onEvent: function (event) {
                    var handler = this.eventHandlers[event.getName()];
                    if (!handler) {
                        return;
                    }

                    return handler.apply(this, [event]);
                }
            }, '___events');
            return orgmodspec;
        },
        requests: function (requests) {
            var orgmodspec = this;
            orgmodspec.category({
                requestHandlers: requests,
                onRequest: function (request) {
                    var handler = this.requestHandlers[request.getName()];
                    if (!handler) {
                        return;
                    }

                    return handler.apply(this, [request]);
                }
            }, '___requests');
            return orgmodspec;
        },
        builder: function () {
            return cs.builderFromPdefsp(this.clazzInfo);
        }


    });
    /* Oskari 2.x backport end */


    /**
     * @static
     * @property Oskari
     */
    var bndl = {
        bundle_manager: bm,
        /* */
        bundle_facade: fcd,
        bundle_locale: blocale,
        app: fcd,
        /* */
        clazz: cs,

        /**
         * @method Oskari.$
         */
        "$": function () {
            return ga.apply(cs, arguments);
        },
        /** @static
         *  @property Oskari.clazzadapter
         *  prototype for a class namespace adapter class
         */
        clazzadapter: clazzadapter,

        run: function (func) {
            func();
        },
        /**
         * @static
         * @method Oskari.setLoaderMode
         */
        setLoaderMode: function (m) {
            mode = m;
        },
        getLoaderMode: function () {
            return mode;
        },
        setDebugMode: function (d) {
            isDebug = d;
        },
        setSupportBundleAsync: function (a) {
            supportBundleAsync = a;
        },
        getSupportBundleAsync: function () {
            return supportBundleAsync;
        },
        setBundleBasePath: function (bp) {
            basePathForBundles = bp;
        },
        getBundleBasePath: function () {
            return basePathForBundles;
        },
        setPreloaded: function (usep) {
            _preloaded = usep;
        },
        setInstTs: function (x) {
            instTs = x;
        },
        /**
         * @static
         * @method Oskari.registerLocalization
         */
        registerLocalization: function (props) {
            var p,
                pp;
            /*console.log("registerLocalization",props);*/
            if (props.length) {
                for (p = 0; p < props.length; p += 1) {
                    pp = props[p];
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
        getLocalization: function (key) {
            return blocale.getLocalization(key);
        },
        /**
         * @static
         * @method Oskari.getLang
         */
        getLang: function () {
            return blocale.getLang();
        },
        /**
         * @static
         * @method Oskari.setLang
         */
        setLang: function (lang) {
            return blocale.setLang(lang);
        },
        /**
         * @static
         * @method Oskari.setSupportedLocales
         */
        setSupportedLocales: function (locales) {
            return blocale.setSupportedLocales(locales);
        },
        /**
         * @static
         * @method Oskari.getSupportedLocales
         */
        getSupportedLocales: function () {
            return blocale.getSupportedLocales();
        },
        /**
         * @static
         * @method Oskari.getDefaultLanguage
         */
        getDefaultLanguage: function () {
            return blocale.getDefaultLanguage();
        },
        /**
         * @static
         * @method Oskari.getSupportedLanguages
         */
        getSupportedLanguages: function () {
            return blocale.getSupportedLanguages();
        },
        /**
         * @static
         * @method Oskari.purge
         */
        purge: function () {
            bm.purge();
            cs.purge("Oskari");
        },

        /**
         * @static
         * @method Oskari.getDomManager
         */
        getDomManager: function () {
            return domMgr;
        },
        /**
         * @static
         * @method Oskari.setDomManager
         */
        setDomManager: function (dm) {
            domMgr = dm;
        },

        /**
         * @static
         * @method getSandbox
         */
        getSandbox: function (sandboxName) {
            return ga.apply(cs, [sandboxName || 'sandbox']);
        },
        /**
         * @static
         * @method setSandbox
         */
        setSandbox: function (sandboxName, sandbox) {
            return ga.apply(cs, [sandboxName || 'sandbox', sandbox]);
        },

        /* Oskari 2.x backport begin */
        /* Oskari 2.x backport end */

        /* entry point to new class API see Oskari.ModuleSpec above */
        cls: function (clazzName, ctor, protoProps, metas) {

            var clazzInfo;

            if (!clazzName) {
                clazzName = ['Oskari', '_', (++o2anonclass)].join('.');
            } else {
                clazzInfo = cs.lookup(clazzName);
            }

            if (!(clazzInfo && clazzInfo._constructor && !ctor)) {
                clazzInfo = cs.define(clazzName, ctor ||
                    function () {}, protoProps, metas || {});
            }

            return cs.create('Oskari.ModuleSpec', clazzInfo, clazzName);

        },

        /* o2 helper to access sandbox */
        sandbox: function (sandboxName) {
            var sandboxref = {
                sandbox: ga.apply(cs, [sandboxName || 'sandbox'])
            };

            sandboxref.on = function (instance) {
                var me = this,
                    p,
                    r;
                if (instance.eventHandlers) {
                    for (p in instance.eventHandlers) {
                        if (instance.eventHandlers.hasOwnProperty(p)) {
                            me.sandbox.registerForEventByName(instance, p);
                        }
                    }
                }
                if (instance.requestHandlers) {
                    for (r in instance.requestHandlers) {
                        if (instance.requestHandlers.hasOwnProperty(r)) {
                            me.sandbox.addRequestHandler(r, reqHandlers[r]);
                        }
                    }
                }
            };
            sandboxref.off = function (instance) {
                var me = this,
                    p,
                    r;
                if (instance.eventHandlers) {
                    for (p in instance.eventHandlers) {
                        if (instance.eventHandlers.hasOwnProperty(p)) {
                            me.sandbox.unregisterFromEventByName(instance, p);
                        }
                    }
                }
                if (instance.requestHandlers) {
                    for (r in instance.requestHandlers) {
                        if (instance.requestHandlers.hasOwnProperty(r)) {
                            me.sandbox.removeRequestHandler(r, reqHandlers[r]);
                        }
                    }
                }
            };
            sandboxref.slicer = Array.prototype.slice;
            sandboxref.notify = function (eventName) {
                var me = this,
                    sandbox = me.sandbox,
                    builder = me.sandbox.getEventBuilder(eventName),
                    args = me.slicer.apply(arguments, [1]),
                    eventObj = builder.apply(builder, args);
                return sandbox.notifyAll(eventObj);
            };

            return sandboxref;

        },

        /* o2 helper to register localisation */
        loc: function () {
            return o2main.registerLocalization.apply(o2main, arguments);
        }


    };

    /* Oskari 2.x backport begin */
    var o2main = bndl;
    /* o2 api for event class */

    o2main.eventCls = function (eventName, constructor, protoProps) {
        var clazzName = ['Oskari', 'event', 'registry', eventName].join('.'),
            rv = o2main.cls(clazzName, constructor, protoProps, {
                protocol: ['Oskari.mapframework.event.Event']
            });

        rv.category({
            getName: function () {
                return eventName;
            }
        }, '___event');

        rv.eventName = eventName;

        return rv;
    };

    /* o2 api for request class */
    o2main.requestCls = function (requestName, constructor, protoProps) {
        var clazzName = ['Oskari', 'request', 'registry', requestName].join('.'),
            rv = o2main.cls(clazzName, constructor, protoProps, {
                protocol: ['Oskari.mapframework.request.Request']
            });

        rv.category({
            getName: function () {
                return requestName;
            }
        }, '___request');

        rv.requestName = requestName;

        return rv;
    };


    o2main._baseClassFor = {
        'extension': "Oskari.userinterface.extension.EnhancedExtension",
        'bundle': "Oskari.mapframework.bundle.extension.ExtensionBundle",
        'tile': "Oskari.userinterface.extension.EnhancedTile",
        'flyout': "Oskari.userinterface.extension.EnhancedFlyout",
        'view': "Oskari.userinterface.extension.EnhancedView"
    };


    /* o2 api for bundle classes */

    /* @static @method Oskari.extensionCls
     *
     */
    o2main.extensionCls = function (clazzName) {
        return o2main.cls(clazzName).extend(this._baseClassFor.extension);
        /* @static @method Oskari.bundleCls 
         *
         */
    };
    o2main.bundleCls = function (bnldId, clazzName) {

        if (!bnldId) {
            bnldId = (['__', (++o2anonbundle)].join('_'));
        }

        var rv = o2main.cls(clazzName, function () {}, {
            update: function () {}
        }, {
            "protocol": ["Oskari.bundle.Bundle", this._baseClassFor.bundle],
            "manifest": {
                "Bundle-Identifier": bnldId
            }
        });
        bm.installBundlePdefsp(bnldId, rv.clazzInfo);

        rv.___bundleIdentifier = bnldId;
        rv.loc = function (props) {
            props.key = this.___bundleIdentifier;
            o2main.registerLocalization(props);
            return rv;
        };
        rv.start = function (instanceid) {
            var bundleid = this.___bundleIdentifier;

            if (!fcd.bundles[bundleid]) {
                var b = bm.createBundle(bundleid, bundleid);
                fcd.bundles[bundleid] = b;
            }

            var bi = bm.createInstance(bundleid);
            fcd.bundleInstances[bundleid] = bi;

            var configProps = fcd.getBundleInstanceConfigurationByName(bundleid),
                ip;
            if (configProps) {
                for (ip in configProps) {
                    if (configProps.hasOwnProperty(ip)) {
                        bi[ip] = configProps[ip];
                    }
                }
            }
            bi.start();

            return bi;
        };
        rv.stop = function () {
            var bundleid = this.___bundleIdentifier,
                bi = fcd.bundleInstances[bundleid];
            return bi.stop();
        };
        return rv;
    };
    /**
     * @static @method flyoutCls
     */
    o2main.flyoutCls = function (clazzName) {
        return o2main.cls(clazzName).extend(this._baseClassFor.flyout);
    };
    /* @static @method Oskari.tileCls 
     *
     */
    o2main.tileCls = function (clazzName) {
        return o2main.cls(clazzName).extend(this._baseClassFor.tile);
    };
    /* @static @method Oskari.bundleCls 
     *
     */
    o2main.viewCls = function (clazzName) {
        return o2main.cls(clazzName).extend(this._baseClassFor.view);
    };
    /* Oskari 2.x backport end */

    /**
     * Let's register Oskari as a Oskari global
     */
    ga.apply(cs, ['Oskari', bndl]);

    /*
     * window.bundle = bndl; window.Oskari = bndl;
     */

    return bndl;
})();
