(function(o) {
    var info = {};
    var protocols = {};

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

    function checkFinalized(classInfo) {
        if (!classInfo.finalized) {
            throw new Error('Definitions missing for "' + className + '"! Make sure class and its super classes are loaded.');
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
                finalized: false // is ready to be instantiated? true, when all classes in super class chain have been registered
            }
            info[className] = classInfo;
        }
        return classInfo;
    }

    function processMetadata(classInfo, metadata) {
        if (!metadata) {
            return true;
        }
        classInfo.metadata = metadata;
        processProtocols(classInfo, metadata.protocol);
        if (!metadata.extend) {
            return true;
        }
        if (!Array.isArray(metadata.extend) || metadata.extend.length > 1) {
            throw new Error('Invalid extend. Only single inheritance is supported: {extend: ["Super.Cass.Name"]}');
        }
        var superClass = ensureClassInfo(metadata.extend[0]);
        superClass.subClasses.push(classInfo);
        classInfo.superClass = superClass;

        return superClass.finalized;
    }

    function processProtocols(classInfo, classProtocols) {
        if (!classProtocols) {
            return;
        }
        classProtocols.forEach(function(pt){
            if (!protocols[pt]) {
                protocols[pt] = {};
            }
            protocols[pt][classInfo.className] = {_class:{get prototype(){return classInfo.classPrototype;}}};
        })
    }

    function finalize(classInfo) {
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
        var instance = Object.create(classInfo.classPrototype);
        var returned = classInfo.classConstructor.apply(instance, instanceArguments);
        return returned || instance;
    }

    o.clazz = {
        define: function(className, classConstructor, classPrototype, metadata) {
            checkClassName(className);
            if (typeof classConstructor !== 'function') {
                throw new Error('Class constructor must be function.');
            }

            var classInfo = ensureClassInfo(className);
            
            if (classInfo.classConstructor) {
                throw new Error('Class "' + className + '" already defined. Use Oskari.clazz.category(...) to add methods to existing class.');
            }
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
        create: function(className) {
            var instanceArguments = Array.prototype.slice.call(arguments, 1);
            var classInfo = getClassInfo(className);
            return createWithClassInfo(classInfo, instanceArguments);
        },
        get: function(className) {
            var classInfo = getClassInfo(className);
            checkFinalized(classInfo);
            return classInfo.classConstructor;
        },
        category: function (className, categoryName, classPrototype) {
            checkClassName(className);
            var classInfo = ensureClassInfo(className);
            cloneProperties(classPrototype, classInfo.classPrototype);
            debugger;
        },
        builder: function (className) {
            var classInfo = getClassInfo(className);
            return function(){
                return createWithClassInfo(classInfo, arguments);
            }
        },
        getMetadata: function(className) {
            var classInfo = getClassInfo(className);
            return {meta: classInfo.metadata};
        },
        protocol: function (protocolName) {
            return protocols[protocolName];
        },
    }
})(Oskari);
