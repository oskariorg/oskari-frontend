/*
 * PoC: API for Oskari 2.0
 *
 */
define([
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
//            FIXME: remove testmodule
            modules.push("src/framework/testmodule/module");
            console.log('modules', modules);

            require(modules, function() {
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
            var moduleClass = Oskari.bundleCls();

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
    var eventCls = Oskari.cls('Oskari.event.Event',function(instanceProps) {
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
    });
    
    Oskari.Event = eventCls;
    
    var requestCls = Oskari.cls('Oskari.request.Request',function(instanceProps) {
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
    });
    
    Oskari.Request = requestCls;
   
    /* Object Generic class */
    var objectcls = 
    Oskari.Object = Oskari.cls('Oskari.Object',function(instanceProps) {
        for (ip in instanceProps) {
            if (instanceProps.hasOwnProperty(ip)) {
                 this[ip] = instanceProps[ip];
            }
        }
    });
   
   
    

    return Oskari;

});