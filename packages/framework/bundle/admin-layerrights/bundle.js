/**
 * @class Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundle",
/**
 * @method create called automatically on construction
 * @static
 */ 
function() {

}, {
    "create" : function() {
        var me = this;
        
        /* this would be enough when only flyout will be implemented */
        /*
        var inst = Oskari.clazz.create("Oskari.userinterface.extension.DefaultExtension",
            'helloworld',
            "Oskari.sample.bundle.helloworld.HelloWorldFlyout"
            );
        */

        /* or this if you want to tailor instance also */
        var inst = Oskari.clazz.create("Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundleInstance",
            'admin-layerrights',
            "Oskari.framework.bundle.admin-layerrights.AdminLayerRightsFlyout"
            );

        return inst;

    },
    "update" : function(manager, bundle, bi, info) {

    }
}, {

    "protocol" : ["Oskari.bundle.Bundle", "Oskari.mapframework.bundle.extension.ExtensionBundle"],
    "source" : {

        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/admin-layerrights/instance.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/admin-layerrights/Flyout.js"
        },{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/admin-layerrights/Tile.js"
        }, {
            "type" : "text/css",
            "src" : "../../../../libraries/slickgrid/css/slick-default-theme.css"
        },{
            "src" : "../../../../libraries/jquery/jquery.event.drag-2.0.min.js",
            "type" : "text/javascript"
        },{
            "src" : "../../../../libraries/slickgrid/slick.core.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/slick.formatters.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/slick.editors.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.cellrangedecorator.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.cellrangeselector.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.cellselectionmodel.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.headermenu2.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.headermenu2.css",
            "type" : "text/css"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.rowselectionmodel.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/plugins/slick.checkboxselectcolumn2.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/slick.grid.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/slick.groupitemmetadataprovider.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/slick.dataview.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/controls/slick.pager.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/slickgrid/controls/slick.columnpicker.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/chosen/chosen.jquery.js",
            "type" : "text/javascript"
        }, {
            "src" : "../../../../libraries/chosen/chosen.css",
            "type" : "text/css"
        }],

        "locales" : [{
            "lang" : "fi",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/admin-layerrights/locale/fi.js"
        }, {
            "lang" : "sv",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/admin-layerrights/locale/sv.js"
        }, {
            "lang" : "en",
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/bundle/admin-layerrights/locale/en.js"
        }]
    },
    "bundle" : {
        "manifest" : {
            "Bundle-Identifier" : "admin-layerrights",
            "Bundle-Name" : "admin-layerrights",
            "Bundle-Author" : [{
                "Name" : "ev",
                "Organisation" : "nls.fi",
                "Temporal" : {
                    "Start" : "2013",
                    "End" : "2013"
                },
                "Copyleft" : {
                    "License" : {
                        "License-Name" : "EUPL",
                        "License-Online-Resource" : "http://www.paikkatietoikkuna.fi/license"
                    }
                }
            }],        
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari"],
            "Import-Bundle" : {}

        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies" : ["jquery"]

});

Oskari.bundle_manager.installBundleClass("admin-layerrights", "Oskari.framework.bundle.admin-layerrights.AdminLayerRightsBundle");
