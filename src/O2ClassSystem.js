
(function (o) {
    /**
     * Registers O2ClassSystem as global so Oskari can build on it
     */
    var O2ClassSystem = function () {
        this.packages = {};
        this.protocols = {};
        this.inheritance = {};
        this.aspects = {};
        this.classcache = {};
        this.globals = {};
    };

    O2ClassSystem.prototype = {

        /**
         * @public @method purge
         */
        purge: function () {
            // TODO implement & document?
            return undefined;
        },

        /**
         * @public @method protocol
         *
         * @param  {string} protocolName Protocol name
         *
         * @return {Object}              Protocol
         */
        protocol: function (protocolName) {
            if (protocolName === null || protocolName === undefined) {
                throw new TypeError('protocol(): Missing protocolName');
            }
            return this.protocols[protocolName];
        },

        /**
         * @private @method _getPackageDefinition
         *
         * @param  {string} packageName Package name
         *
         * @return {Object}             Package definition
         */
        _getPackageDefinition: function (packageName) {
            var packageDefinition = this.packages[packageName];

            if (!packageDefinition) {
                packageDefinition = {};
                this.packages[packageName] = packageDefinition;
            }
            return packageDefinition;
        },

        /**
         * @private @method _getClassQName
         *
         * @param  {string} className Class name
         *
         * @return {Object}           ClassQName
         */
        _getClassQName: function (className) {
            var parts = className.split('.');

            return {
                basePkg: parts[0],
                pkg: parts[1],
                sp: parts.slice(2).join('.')
            };
        },

        /**
         * @private @method _getClassInfo
         *
         * @param  {string} className Class name
         *
         * @return {Object}           ClassInfo
         */
        _getClassInfo: function (className) {
            var classInfo = this.classcache[className],
                classQName = this._getClassQName(className),
                packageDefinition;

            if (!classInfo) {
                packageDefinition = this._getPackageDefinition(classQName.pkg);
                classInfo = packageDefinition[classQName.sp];
                this.classcache[className] = classInfo;
            }
            return classInfo;
        },

        /**
         * @private @method _cloneProperties
         *
         * @param {Object}          from
         * @param {Object|Object[]} to
         *
         */
        _cloneProperties: function (from, to) {
            var i,
                propertyName,
                propertyValue,
                toArray = Array.isArray(to) ? to : [to];

            for (propertyName in from) {
                if (from.hasOwnProperty(propertyName)) {
                    propertyValue = from[propertyName];
                    for (i = toArray.length - 1; i >= 0; i -= 1) {
                        toArray[i][propertyName] = propertyValue;
                    }
                }
            }
        },

        /**
         * @private @method _createEmptyClassDefinition
         *
         *
         * @return {function()} Empty function with an empty prototype
         */
        _createEmptyClassDefinition: function () {
            var ret = function () {
                return undefined;
            };
            ret.prototype = {};
            return ret;
        },

        /**
         * @public @method getMetadata
         * Returns metadata for the class
         *
         * @param  {string} className Class name
         *
         * @return {Object}           Class metadata
         */
        getMetadata: function (className) {
            var classInfo;
            if (className === null || className === undefined) {
                throw new TypeError('metadata(): Missing className');
            }
            classInfo = this._getClassInfo(className);
            if (!classInfo) {
                throw 'Class ' + className + ' does not exist';
            }
            return classInfo._metadata;
        },

        /**
         * @private @method _updateMetadata
         * Updates and binds class metadata
         *
         * @param {string} basePkg   Base package
         * @param {string} pkg       Package
         * @param {string} sp
         * @param {Object} classInfo ClassInfo
         * @param {Object} classMeta Class metadata
         *
         */
        _updateMetadata: function (basePkg, pkg, sp, classInfo, classMeta) {
            var protocols,
                p,
                pt,
                className;

            if (!classInfo._metadata) {
                classInfo._metadata = {};
            }
            classInfo._metadata.meta = classMeta;
            className = [basePkg, pkg, sp].join('.');
            protocols = classMeta.protocol;
            if (protocols) {
                for (p = 0; p < protocols.length; p += 1) {
                    pt = protocols[p];
                    if (!this.protocols[pt]) {
                        this.protocols[pt] = {};
                    }
                    this.protocols[pt][className] = classInfo;
                }
            }
        },

        /**
         * @private @method _super
         *
         * @param  {string} supCat
         * @param  {string} supMet
         *
         * @return
         */
        _super: function (supCat, supMet) {
            var me = this;

            return function () {
                return me._._superCategory[supCat][supMet].apply(me, arguments);
            };
        },

        /**
         * @public @method define Creates a class definition.
         *
         * @param  {string}   className        Class name
         * @param  {function} classConstructor Class constructor function
         * @param  {Object}   prototype        A property object containing
         *                                     methods and definitions for the
         *                                     class prototype
         * @param  {Object}   metadata         Optional metadata for the class
         *
         * @return {Object}                    ClassInfo
         */
        define: function (className, classConstructor, prototype, metadata) {
            var classDefinition,
                classQName,
                composition,
                packageDefinition,
                classInfo,
                e,
                extnds,
                superClass;

            if (className === null || className === undefined) {
                throw new TypeError('define(): Missing className');
            }

            if (typeof classConstructor !== 'function') {
                throw new TypeError(
                    'define(): classConstructor is not a function'
                );
            }

            // Prototype is undefined for Oskari._.1
            if (prototype && typeof prototype !== 'object') {
                throw new TypeError('define(): Prototype is not an object');
            }

            classQName = this._getClassQName(className);
            packageDefinition = this._getPackageDefinition(classQName.pkg);
            classInfo = packageDefinition[classQName.sp];

            if (!classInfo) {
                classDefinition = this._createEmptyClassDefinition();
                composition = {
                    className: className,
                    superClass: null,
                    subClass: null
                };

                classInfo = {
                    _class: classDefinition,
                    _constructor: classConstructor,
                    _category: {},
                    _composition: composition
                };
                classDefinition.prototype._ = classInfo;
                classDefinition.prototype._super = this._super;
                this.inheritance[className] = composition;
                packageDefinition[classQName.sp] = classInfo;
            }
            // update constrcutor
            if (classConstructor) {
                classInfo._constructor = classConstructor;
            }
            // update prototype
            if (prototype) {
                this._cloneProperties(prototype, classInfo._class.prototype);
                classInfo._category[className] = prototype;
            }
            // update metadata
            if (metadata) {
                extnds = metadata.extend;
                for (e = 0; extnds && e < extnds.length; e += 1) {
                    superClass = this.lookup(extnds[e]);
                    if (!superClass._composition.subClass) {
                        superClass._composition.subClass = {};
                    }
                    superClass._composition.subClass[className] = classInfo;
                    classInfo._composition.superClass = superClass;
                }
                this._updateMetadata(
                    classQName.basePkg,
                    classQName.pkg,
                    classQName.sp,
                    classInfo,
                    metadata
                );
            }
            this._pullDown(classInfo);
            this._pushDown(classInfo);
            return classInfo;
        },

        /**
         * @public @method category
         * Adds some logical group of methods to class prototype
         * Oskari.clazz.category(
         * 'Oskari.mapframework.request.common.' +
         * 'ActivateOpenlayersMapControlRequest',
         * 'map-layer-funcs',{ "xxx": function () {} }
         * );
         *
         * @param  {string} className    Class name
         * @param  {string} categoryName Category name
         * @param  {Object} prototype    Prototype
         *
         * @return {Object}              ClassInfo
         */
        category: function (className, categoryName, prototype) {
            var classDefinition,
                classInfo,
                classQName,
                composition,
                packageDefinition,
                prot;

            if (className === null || className === undefined) {
                throw new TypeError('category(): Missing className');
            }

            classQName = this._getClassQName(className);
            packageDefinition = this._getPackageDefinition(classQName.pkg);
            classInfo = packageDefinition[classQName.sp];

            if (!classInfo) {
                classDefinition = this._createEmptyClassDefinition();
                composition = {
                    className: className,
                    superClass: null,
                    subClass: null
                };
                // TODO why do we set categoryName as constructor?
                classInfo = {
                    _class: classDefinition,
                    _constructor: categoryName,
                    _category: {},
                    _composition: composition
                };
                classDefinition.prototype._ = classInfo;
                classDefinition.prototype._super = this._super;
                this.inheritance[className] = composition;
                packageDefinition[classQName.sp] = classInfo;
            }
            prot = classInfo._class.prototype;
            this._cloneProperties(prototype, prot);
            if (prototype) {
                classInfo._category[categoryName] = prototype;
            }
            this._pullDown(classInfo);
            this._pushDown(classInfo);
            return classInfo;
        },

        /**
         * @public @method lookup
         *
         * @param  {string} className   Class name
         * @param           constructor Constructor
         *
         * @return {Object}             ClassInfo
         */
        lookup: function (className, constructor) {
            var classDefinition,
                classQName,
                composition,
                packageDefinition,
                classInfo;

            if (className === null || className === undefined) {
                throw new TypeError('lookup(): Missing className');
            }
            // TODO constructor seems to be undefined all the time?

            classQName = this._getClassQName(className);
            packageDefinition = this._getPackageDefinition(classQName.pkg);
            classInfo = packageDefinition[classQName.sp];

            if (!classInfo) {
                classDefinition = this._createEmptyClassDefinition();
                composition = {
                    className: className,
                    superClass: null,
                    subClass: null
                };
                classInfo = {
                    _class: classDefinition,
                    _constructor: constructor,
                    _category: {},
                    _composition: composition
                };
                this.inheritance[className] = composition;
                packageDefinition[classQName.sp] = classInfo;
            }
            return classInfo;
        },

        /**
         * @public @method extend
         *
         * @param  {string} subClassName   SubClass name
         * @param  {string} superClassName SuperClass name
         *
         * @return {Object}                SubClass
         */
        extend: function (subClassName, superClassName) {
            var superClass,
                subClass;

            if (subClassName === null || subClassName === undefined) {
                throw new TypeError('extend(): Missing subClassName');
            }

            if (superClassName === null || superClassName === undefined) {
                throw new TypeError('extend(): Missing superClassName');
            }

            superClass = this.lookup(superClassName);
            subClass = this.lookup(subClassName);

            if (!superClass._composition.subClass) {
                superClass._composition.subClass = {};
            }
            superClass._composition.subClass[subClassName] = subClass;
            subClass._composition.superClass = superClass;
            this._pullDown(subClass);
            return subClass;
        },

        /**
         * @private @method _pushDown
         * Force each derived class to pullDown.
         * Some overhead here if complex hierarchies are implemented.
         *
         * @param  {Object} classInfo ClassInfo
         *
         * @return {Object}           ClassInfo
         */
        _pushDown: function (classInfo) {
            var subName,
                pdefsub;

            if (classInfo === null || classInfo === undefined) {
                throw new TypeError('_pushDown(): Missing classInfo');
            }

            /* !self */
            if (!classInfo._composition.subClass) {
                return;
            }
            for (subName in classInfo._composition.subClass) {
                if (classInfo._composition.subClass.hasOwnProperty(subName)) {
                    pdefsub = classInfo._composition.subClass[subName];
                    this._pullDown(pdefsub);
                    this._pushDown(pdefsub);
                }
            }
            return classInfo;
        },

        /**
         * @private @method _pullDown
         * EACH class is responsible for it's entire hierarchy
         * no intermediate results are being consolidated
         *
         * @param  {Object} classInfo ClassInfo
         *
         * @return {Object}           ClassInfo
         */
        _pullDown: function (classInfo) {
            var i,
                category,
                clazz,
                classHierarchy,
                className,
                classConstructor,
                classMethods,
                classPrototype,
                prototype,
                superClassInfo;

            if (classInfo === null || classInfo === undefined) {
                throw new TypeError('_pullDown(): Missing classInfo');
            }

            if (!classInfo._composition.superClass) {
                // Class doesn't extend
                return;
            }
            // Class hierarchy from bottom (i.e. given class) up
            classHierarchy = [];
            classHierarchy.push(classInfo);
            superClassInfo = classInfo;
            while (true) {
                superClassInfo = superClassInfo._composition.superClass;
                if (!superClassInfo) {
                    break;
                }
                classHierarchy.push(superClassInfo);
            }

            classInfo._constructors = [];
            classInfo._superCategory = {};
            classPrototype = classInfo._class.prototype;
            // Traverse class hierarchy from topmost super to given class,
            // add found methods to class info
            for (i = classHierarchy.length - 1; i >= 0; i -= 1) {
                clazz = classHierarchy[i];
                className = clazz._composition.className;
                classConstructor = clazz._constructor;
                classInfo._constructors.push(classConstructor);
                classMethods = {};
                // TODO explain categories?
                for (category in clazz._category) {
                    if (clazz._category.hasOwnProperty(category)) {
                        prototype = clazz._category[category];
                        this._cloneProperties(
                            prototype,
                            [classPrototype, classMethods]
                        );
                    }
                }
                classInfo._superCategory[className] = classMethods;
            }
            return classInfo;
        },

        /**
         * @private @method _slicer
         */
        _slicer: Array.prototype.slice,

        /**
         * @public @method create
         * Creates a class instance
         *
         * @param  {string} className Class name
         *
         * @return {Object}           Class instance
         */
        create: function (className) {
            var classInfo,
                classInstance,
                constructors,
                i,
                instanceArguments;

            if (className === null || className === undefined) {
                throw new TypeError('create(): Missing className');
            }

            instanceArguments = this._slicer.apply(arguments, [1]);
            classInfo = this._getClassInfo(className);
            if (!classInfo) {
                // If this error is thrown,
                // the class definition is missing.
                // Ensure the file has been loaded before use
                throw 'Class "' + className + '" does not exist';
            }
            classInstance = new classInfo._class();
            constructors = classInfo._constructors;

            if (constructors) {
                // Class is extended, call super constructors first?
                for (i = 0; i < constructors.length; i += 1) {
                    // If an error occurs below, the constructor is missing.
                    // Ensure the file has been loaded before use.
                    // Note! check extends classes as well, those might also be
                    // missing.
                    if (constructors[i] === null || constructors[i] === undefined) {
                        throw new Error('Class ' + className + ' is missing super constructor ' + (i + 1) + '/' + constructors.length);
                    }
                    var returned = constructors[i].apply(classInstance, instanceArguments);
                    if (returned) {
                        classInstance = returned;
                    }
                }
            } else {
                var returned = classInfo._constructor.apply(classInstance, instanceArguments);
                if (returned) {
                    classInstance = returned;
                }
            }
            return classInstance;
        },

        /**
         * @public @method createWithClassInfo
         *
         * @param  {Object} classInfo         ClassInfo
         * @param  {[]}     instanceArguments Instance arguments
         *
         * @return {Object}                   Class instance
         */
        createWithClassInfo: function (classInfo, instanceArguments) {
            var classInstance,
                constructors,
                i;

            if (classInfo === null || classInfo === undefined) {
                throw new TypeError('createWithClassInfo(): Missing classInfo');
            }
            // TODO check instanceArguments?
            classInstance = new classInfo._class();
            constructors = classInfo._constructors;
            if (constructors) {
                for (i = 0; i < constructors.length; i += 1) {
                    if (constructors[i] === null ||
                            constructors[i] === undefined) {
                        throw new Error(
                            'createWithClassInfo(): Undefined constructor in ' +
                                'class "' + classInfo._composition.className +
                                '"'
                        );
                    }
                    constructors[i].apply(classInstance, instanceArguments);
                }
            } else {
                classInfo._constructor.apply(classInstance, instanceArguments);
            }
            return classInstance;
        },

        /**
         * @public @method builder
         * Implements Oskari frameworks support for cached class instance
         * builders.
         *
         * @param  {string}   className Class name
         *
         * @return {function}           Class builder
         */
        builder: function (className) {
            var classInfo;

            if (className === null || className === undefined) {
                throw new TypeError('builder(): Missing className');
            }

            classInfo = this._getClassInfo(className);
            if (!classInfo) {
                throw 'Class "' + className + '" does not exist';
            }
            return this.getBuilderFromClassInfo(classInfo);
        },

        /**
         * @public @method getBuilderFromClassInfo
         * Implements Oskari frameworks support for cached class instance
         * builders.
         *
         * @param  {Object}   classInfo ClassInfo
         *
         * @return {function}           Class builder
         */
        getBuilderFromClassInfo: function (classInfo) {
            if (classInfo === null || classInfo === undefined) {
                throw new TypeError(
                    'getBuilderFromClassInfo(): Missing classInfo'
                );
            }

            if (classInfo._builder) {
                return classInfo._builder;
            }
            classInfo._builder = function () {
                var classInstance = new classInfo._class(),
                    constructors = classInfo._constructors,
                    i,
                    instanceArguments = arguments;

                if (constructors) {
                    for (i = 0; i < constructors.length; i += 1) {
                        constructors[i].apply(classInstance, instanceArguments);
                    }
                } else {
                    classInfo._constructor.apply(
                        classInstance,
                        instanceArguments
                    );
                }
                return classInstance;
            };
            return classInfo._builder;
        },

        /**
         * @private @method _global
         *
         * @param {string} key   Key
         * @param          value Value
         *
         * @return
         */
        _global: function (key, value) {
            if (key === undefined) {
                return this.globals;
            }
            if (value !== undefined) {
                this.globals[key] = value;
            }
            return this.globals[key];
        }
    };
    o.clazz = new O2ClassSystem();
}(Oskari));
