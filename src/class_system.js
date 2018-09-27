(function(o) {
    var info = {};
    var protocols = {};

    var classTip = ' Use: class MyClass extends BaseClass {...}';

    function cloneProperties(source, target) {
        Object.keys(source).forEach(function(propName){
            target[propName] = source[propName];
        });
        return target;
    }

    function checkClassName(className) {
        if (typeof className !== 'string' || !className.length) {
            throw new Error('className name must be string and of length > 0.');
        }
    }

    function defineCheck(className, classConstructor) {
        checkClassName(className);
        if (typeof classConstructor !== 'function') {
            throw new Error('Class constructor must be function.');
        }
        var classInfo = ensureClassInfo(className);
        if (classInfo.classConstructor) {
            throw new Error('Class "' + className + '" already defined. Use Oskari.clazz.category(...) to add methods to existing class.');
        }
        return classInfo;
    }

    function checkFinalized(classInfo) {
        if (!classInfo.finalized) {
            throw new Error('Definitions missing for "' + classInfo.className + '"! Make sure class and its super classes are loaded.');
        }
    }

    function subClassingCheck(classInfo) {
        if (classInfo.superClass && !classInfo.superClass.allowSubClass) {
            throw new Error('Not possible to extend ES class via metadata. Check class "' + classInfo.className + '".' + classTip);
        }
    }

    function getClassInfo(className) {
        checkClassName(className)
        var classInfo = info[className];
        if (!classInfo) {
            throw new Error('No class registered with name: ' + className);
        }
        return classInfo;
    }

    function ensureClassInfo(className) {
        var classInfo = info[className];
        if (!classInfo) {
            classInfo = {
                className: className,
                classConstructor: null,
                classPrototype: {},
                metadata: null,
                superClass: null,
                subClasses: [],
                allowSubClass: true, // ES6 classes cannot be subclassed with ES5 constructors
                finalized: false // is ready to be instantiated? true, when all classes in super class chain have been registered
            }
            info[className] = classInfo;
        }
        return classInfo;
    }

    function processMetadata (classInfo, metadata) {
        if (!metadata) {
            return true;
        }
        classInfo.metadata = metadata;
        processProtocols(classInfo, metadata.protocol);
        if (!metadata.extend || !metadata.extend.length) {
            return true;
        }
        var superClassName = metadata.extend;
        if (Array.isArray(superClassName)) {
            if (superClassName.length > 1) {
                throw new Error('Invalid extend in class "' + classInfo.className + '". Only single inheritance is supported: {extend: "Super.Class.Name"}');
            } else {
                superClassName = metadata.extend[0];
            }
        }
        var superClass = ensureClassInfo(superClassName);
        superClass.subClasses.push(classInfo);
        classInfo.superClass = superClass;

        return superClass.finalized;
    }

    function processProtocols(classInfo, classProtocols) {
        if (!classProtocols) {
            return;
        }
        classProtocols.forEach(function (pt){
            if (!protocols[pt]) {
                protocols[pt] = {};
            }
            protocols[pt][classInfo.className] = classInfo;
        })
    }

    function finalize(classInfo) {
        subClassingCheck(classInfo);
        attachConstructor(classInfo);
        attachPrototype(classInfo)

        classInfo.finalized = true;

        classInfo.subClasses.forEach(finalize);
    }

    function attachConstructor(classInfo) {
        if (!classInfo.superClass) {
            return;
        }
        var originalConstructor = classInfo.classConstructor;
        var superConstructor = classInfo.superClass.classConstructor;
        classInfo.classConstructor = function () {
            var _this = superConstructor.apply(this, arguments) || this;
            return originalConstructor.apply(_this, arguments) || this;
        };
    }

    function attachPrototype(classInfo) {
        if (classInfo.superClass) {
            classInfo.classPrototype = cloneProperties(classInfo.classPrototype, Object.create(classInfo.superClass.classConstructor.prototype))
        }
        classInfo.classConstructor.prototype = classInfo.classPrototype;
    }

    function createWithClassInfo(classInfo, instanceArguments) {
        checkFinalized(classInfo);
        var instance = new (Function.prototype.bind.apply(classInfo.classConstructor, [null].concat(instanceArguments)))();
        return instance;
    }

    o.clazz = {
        /**
         * @public @method define Registers a class definition.
         *
         * @param  {string}   className        Class name
         * @param  {function} classConstructor Class constructor function
         * @param  {Object}   prototype        A property object containing
         *                                     methods and definitions for the
         *                                     class prototype
         * @param  {Object}   metadata         Optional metadata for the class
         */
        define: function(className, classConstructor, classPrototype, metadata) {
            var classInfo = defineCheck(className, classConstructor);

            classInfo.classConstructor = classConstructor;

            if (classPrototype) {
                cloneProperties(classPrototype, classInfo.classPrototype);
            }

            var isSuperChainComplete = processMetadata(classInfo, metadata);

            if (!isSuperChainComplete) {
                return; // super class will finalize this classInfo later on
            }
            finalize(classInfo);
        },
        /**
         * @public @method defineES Registers a ES6 class definition or ES5 constructor function.
         *
         * @param  {string}   className        Class name
         * @param  {function} classConstructor Class constructor function
         * @param  {Object}   metadata         Optional metadata for the class
         */
        defineES: function(className, classConstructor, metadata) {
            var classInfo = defineCheck(className, classConstructor);
            if (metadata && metadata.extend) {
                throw new Error('ES classes cannot extend via metadata. Check class "' + className + '".' + classTip);
            }
            processMetadata(classInfo, metadata);

            classInfo.classConstructor = classConstructor;
            cloneProperties(classInfo.classPrototype, classConstructor.prototype);
            classInfo.classPrototype = classConstructor.prototype;
            classInfo.finalized = true;
            classInfo.allowSubClass = false;
            classInfo.subClasses.forEach(finalize); // finalize will throw if any subClasses have been registered
        },
        /**
         * @public @method create
         * Creates a class instance
         *
         * @param  {string} className Class name
         *
         * @return {Object}           Class instance
         */
        create: function(className) {
            var instanceArguments = Array.prototype.slice.call(arguments, 1);
            var classInfo = getClassInfo(className);
            return createWithClassInfo(classInfo, instanceArguments);
        },
        /**
         * @public @method get
         * Returns the EcmaScript native constructor for Oskari class
         *
         * @param  {string} className Class name
         *
         * @return {function}         Class constructor
         */
        get: function(className) {
            var classInfo = getClassInfo(className);
            checkFinalized(classInfo);
            return classInfo.classConstructor;
        },
        /**
         * @public @method category
         * Adds a group of methods to class prototype
         *
         * @param  {string} className    Class name
         * @param  {string} categoryName Category name (not used. For backwards compatibility)
         * @param  {Object} prototype    Prototype
         */
        category: function(className, categoryName, classPrototype) {
            checkClassName(className);
            var classInfo = ensureClassInfo(className);
            cloneProperties(classPrototype, classInfo.classPrototype);
        },
        /**
         * @public @method builder
         * Returns factory function for creating class instances
         *
         * @param  {string}   className Class name
         *
         * @return {function}           Class builder
         */
        builder: function(className) {
            var classInfo = getClassInfo(className);
            return function() {
                return createWithClassInfo(classInfo, Array.prototype.slice.call(arguments));
            }
        },
        /**
         * @public @method getMetadata
         * Returns metadata for the class
         *
         * @param  {string} className Class name
         *
         * @return {Object}           Class metadata
         */
        getMetadata: function(className) {
            var classInfo = getClassInfo(className);
            return classInfo.metadata;
        },
        /**
         * @public @method protocol
         * Get list of classNames that implement given protocol
         *
         * @param  {string} protocolName Protocol name
         *
         * @return {string[]}              ClassNames implementing protocol
         */
        protocol: function(protocolName) {
            return Object.keys(protocols[protocolName] || {});
        },
        /**
         * @private @method _getClassInfo
         * Returns classInfo for the class. For use in Oskari core only!
         *
         * @param  {string} className Class name
         *
         * @return {Object}           ClassInfo
         */
        _getClassInfo: function(className) {
            return getClassInfo(className);
        }
    }
})(Oskari);
