/**
 * @class Oskari.tampere.bundle.content-editor.ContentEditorBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define("Oskari.tampere.bundle.content-editor.ContentEditorBundle", function () {

}, {
    "create": function () {
        var me = this;
        var inst = Oskari.clazz.create("Oskari.tampere.bundle.content-editor.ContentEditorBundleInstance");

        return inst;

    },
    "update": function (manager, bundle, bi, info) {

    }
}, {

    "source": {

        "scripts": [{
            "type": "text/javascript",
            "src": "../../../../bundles/tampere/content-editor/instance.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/tampere/content-editor/view/SideContentEditor.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/tampere/content-editor/request/ShowContentEditorRequest.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../bundles/tampere/content-editor/request/ShowContentEditorRequestHandler.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../libraries/datepicker/resources/locale/datepicker-fi.js"
        }, {
            "type": "text/javascript",
            "src": "../../../../libraries/datepicker/resources/locale/datepicker-en-GB.js"
        }, {
            "type": "text/css",
            "src": "../../../../bundles/tampere/content-editor/resources/css/style.css"
        }],
        "locales": [{
            "lang": "en",
            "type": "text/javascript",
            "src": "../../../../bundles/tampere/content-editor/resources/locale/en.js"
        }, {
            "lang": "fi",
            "type": "text/javascript",
            "src": "../../../../bundles/tampere/content-editor/resources/locale/fi.js"
        }]
    },
    "bundle": {
        "manifest": {
            "Bundle-Identifier": "content-editor",
            "Bundle-Name": "content-editor",
            "Bundle-Author": [{
                "Name": "jjk",
                "Organisation": "sito.fi",
                "Temporal": {
                    "Start": "2009",
                    "End": "2011"
                },
                "Copyleft": {
                    "License": {
                        "License-Name": "EUPL",
                        "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                    }
                }
            }],
            "Bundle-Name-Locale": {
                "fi": {
                    "Name": " style-1",
                    "Title": " style-1"
                },
                "en": {}
            },
            "Bundle-Version": "1.0.0",
            "Import-Namespace": ["Oskari", "jquery"],
            "Import-Bundle": {}
        }
    },

    /**
     * @static
     * @property dependencies
     */
    "dependencies": ["jquery"]

});

Oskari.bundle_manager.installBundleClass("content-editor", "Oskari.tampere.bundle.content-editor.ContentEditorBundle");
