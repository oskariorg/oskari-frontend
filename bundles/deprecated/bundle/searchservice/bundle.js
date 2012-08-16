/**
 * Bundle Instance
 */
Oskari.clazz.define("Oskari.mapframework.bundle.DefaultSearchServiceBundleInstance", function(b) {
    this.name = 'searchservice';
    this.mediator = null;
    this.sandbox = null;

    this.impl = null;

    /**
     * These should be SET BY Manifest end
     */

    this.ui = null;
},
/*
 * prototype
 */
{

    createPanel : function() {
        var me = this;
        var xt = me.libs.ext;
        var pnl = xt.create('Ext.Panel', {
            region : 'center',
            layout : 'fit',
            height : 384,
            items : []
        });

        return pnl;
    },
    /**
     * start bundle instance
     *
     */
    "start" : function() {

        if(this.mediator.getState() == "started")
            return;

        /**
         * These should be SET BY Manifest begin
         */
        this.libs = {
            ext : Oskari.$("Ext")
        };
        this.facade = Oskari.$('UI.facade');

        this.impl = Oskari.clazz.create('Oskari.mapframework.ui.module.searchservice.SearchModule');

        var pnl = this.createPanel();

        /**
         *
         * register to framework and eventHandlers
         */
        var def = this.facade.appendExtensionModule(this.impl, this.name, {}
        /* this.impl.eventHandlers */, this, 'E', {
            'fi' : {
                title : 'Haku'
            },
            'sv' : {
                title : '?'
            },
            'en' : {
                title : 'Haku'
            }

        }, pnl);
        this.def = def;
        pnl.add(def.initialisedComponent);

        this.impl.start(this.facade.getSandbox());

        this.mediator.setState("started");
        return this;
    },
    /**
     * notifications from bundle manager
     */
    "update" : function(manager, b, bi, info) {
        manager.alert("RECEIVED update notification @BUNDLE_INSTANCE: " + info);
    },
    /**
     * stop bundle instance
     */
    "stop" : function() {

        this.impl.stop();

        this.facade.removeExtensionModule(this.impl, this.name, this.impl.eventHandlers, this, this.def);
        this.def = null;
        this.impl = null;

        this.mediator.setState("stopped");

        return this;
    },
    getName : function() {
        return this.__name;
    },
    __name : "Oskari.mapframework.bundle.DefaultSearchServiceBundleInstance"

}, {
    "protocol" : ["Oskari.bundle.BundleInstance", "Oskari.mapframework.bundle.extension.Extension"]
});

/**
 * Bundle
 */
Oskari.clazz.define("Oskari.mapframework.bundle.DefaultSearchServiceBundle", function() {
}, {
    /*
     * implementation for protocol 'Oskari.bundle.Bundle'
     */
    "create" : function() {

        return Oskari.clazz.create("Oskari.mapframework.bundle.DefaultSearchServiceBundleInstance");
    },
    "update" : function(manager, bundle, bi, info) {
        manager.alert("RECEIVED update notification " + info);
    }
},

/**
 * metadata
 */
{

    "protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {

        "scripts" : [{
            "type" : "text/javascript",
            "src" : "event/SearchClearedEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "ui/module/search-module.js"
        }, {
            "type" : "text/javascript",
            "src" : "ui/module/metadata-module.js"
        }],
        "resources" : []
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "searchservice",
            "Bundle-Name" : "searchservice",
            "Bundle-Icon" : {
                "href" : "icon.png"
            },
            "Bundle-Author" : [{
                "Name" : "jjk",
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2009",
                    "End" : "2011"
                },
                "Copyleft" : {
                    "License" : {
                        "License-Name" : "EUPL",
                        "License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
                    }
                }
            }],
            "Bundle-Name-Locale" : {
                "fi" : {
                    "Name" : "Haku",
                    "Title" : "Haku"
                },
                "en" : {}
            },
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari", "Ext"]
        }
    }
});

/**
 * Install this bundle
 */
Oskari.bundle_manager.installBundleClass("searchservice", "Oskari.mapframework.bundle.DefaultSearchServiceBundle");
