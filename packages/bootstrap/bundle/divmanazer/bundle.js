/**
 * @class Oskari.userinterface.bundle.bootstrap.UserInterfaceBundle
 *
 *
 */
Oskari.clazz.define("Oskari.userinterface.bundle.bootstrap.UserInterfaceBundle", function() {

}, {
    /**
     * @method create creates an Oskari DIV Manager instance
     * @return {Oskari.userinterface.bundle.bootstrap.UserInterfaceBundleInstance}
     */
    "create" : function() {

        return Oskari.clazz.create("Oskari.userinterface.bundle.bootstrap.UserInterfaceBundleInstance");
    },
    /**
     * @method update called by the bundle manager to inform on changes in
     * bundlage
     */
    "update" : function(manager, bundle, bi, info) {

    }
}, {
    /**
     * @static
     * @property protocol protocols implemented by this bundle
     */
    "protocol" : ["Oskari.bundle.Bundle"],
    "source" : {
        /**
         * @static
         * @property source.scripts
         *
         */
        "scripts" : [{
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/instance.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/bootstrap/divmanazer/instance.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/request/AddExtensionRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/request/AddExtensionRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/request/RemoveExtensionRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/request/RemoveExtensionRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/request/UpdateExtensionRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/request/UpdateExtensionRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/request/ModalDialogRequest.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/request/ModalDialogRequestHandler.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/event/ExtensionUpdatedEvent.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/Accordion.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/AccordionPanel.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/TabContainer.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/TabDropdownContainer.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/TabPanel.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/Badge.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/Alert.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/Popup.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/Overlay.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/Button.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/Form.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/UIHelper.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/FormInput.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/Popover.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/Grid.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/GridModel.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/component/ProgressSpinner.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/extension/DefaultTile.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/extension/DefaultFlyout.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/extension/DefaultExtension.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/extension/DefaultView.js"
        }, {
            "type" : "text/javascript",
            "src" : "../../../../bundles/framework/divmanazer/extension/DefaultLayout.js"
        },
        {
            "type" : "text/css",
            "src" : "../../../../bundles/bootstrap/divmanazer/resources/css/divman.css"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/framework/divmanazer/resources/scss/accordion.scss"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/framework/divmanazer/resources/scss/tab.scss"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/framework/divmanazer/resources/scss/modal.scss"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/framework/divmanazer/resources/scss/badge.scss"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/framework/divmanazer/resources/scss/alert.scss"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/framework/divmanazer/resources/scss/forminput.scss"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/framework/divmanazer/resources/scss/grid.scss"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/framework/divmanazer/resources/scss/popup.scss"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/framework/divmanazer/resources/scss/button.scss"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/framework/divmanazer/resources/scss/overlay.scss"
        }, {
            "type" : "text/css",
            "src" : "../../../../bundles/framework/divmanazer/resources/scss/popover.scss"
        }]
    },
    "bundle" : {
        /**
         * @static
         * @property bundle.manifest
         */
        "manifest" : {
            "Bundle-Identifier" : "ui",
            "Bundle-Name" : "ui",
            "Bundle-Tag" : {
                "mapframework" : true
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
                    "Name" : " kpI",
                    "Title" : " kpI"
                },
                "en" : {}
            },
            "Bundle-Version" : "1.0.0",
            "Import-Namespace" : ["Oskari"],
            "Import-Bundle" : {}
        }
    }
});

Oskari.bundle_manager.installBundleClass("divmanazer", "Oskari.userinterface.bundle.bootstrap.UserInterfaceBundle");
