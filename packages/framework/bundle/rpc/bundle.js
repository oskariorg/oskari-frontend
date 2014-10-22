/**
 * @class Oskari.mapframework.bundle.rpc.RemoteProcedureCallBundle
 *
 * Definition for bundle. See source for details.
 */
Oskari.clazz.define(
    "Oskari.mapframework.bundle.rpc.RemoteProcedureCallBundle",
    function () {}, {
        create: function () {
            return Oskari.clazz.create(
                "Oskari.mapframework.bundle.rpc.RemoteProcedureCallBundleInstance"
            );
        },
        update: function (manager, bundle, bi, info) {}
    }, {
        protocol: [
            "Oskari.bundle.Bundle",
            "Oskari.mapframework.bundle.extension.ExtensionBundle"
        ],
        "source": {
            "scripts": [{
                // NOTE! EXTERNAL LIBRARY!
                "type": "text/javascript",
                "src": "../../../../libraries/JSChannel/jschannel.js"
            }, {
                "type": "text/javascript",
                "src": "../../../../bundles/framework/bundle/rpc/instance.js"
            }]
        },
        bundle: {
            manifest: {
                "Bundle-Identifier": "rpc",
                "Bundle-Name": "rpc",
                "Bundle-Author": [{
                    "Name": "tm",
                    "Organisation": "nls.fi",
                    "Temporal": {
                        "Start": "2014",
                        "End": "2020"
                    },
                    "Copyleft": {
                        "License": {
                            "License-Name": "EUPL",
                            "License-Online-Resource": "http://www.paikkatietoikkuna.fi/license"
                        }
                    }
                }],
                "Bundle-Version": "1.0.0",
                "Import-Namespace": ["Oskari"]
            }
        }
    }
);

Oskari.bundle_manager.installBundleClass(
    "rpc",
    "Oskari.mapframework.bundle.rpc.RemoteProcedureCallBundle"
);
