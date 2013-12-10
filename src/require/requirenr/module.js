/* attempt to break any conventions and rules to reduce code */
/* using anonymous classes, builders, in place inheritance, instantiations within method calls, eating the stack with nested call hiearchy etc */
/* result is a non-localized bundle with bundle instance providing a flyout and a tile. */

define(["oskari"], function(Oskari) {

    /* This module declares a bundle, a bundle instance with tile, flyout */
    /* 1) bundle */
    return Oskari.bundleCls('requirenr', "Oskari.sample.bundle.requirenr.RequireBundle").methods({
        /* this is the required method that will fire up bundle with creating a bundle instance */
        create : function() {

            /* 2) bundle instance */
            return Oskari.extensionCls().methods({

                startPlugin : function() {

                    /* 3) flyout - let's create an instance of flyout clazz and register it to the zystem */
                    this.setFlyout(Oskari.flyoutCls().methods({

                        /* create some UI */
                        startPlugin : function() {
                            this.getEl().append("require based 'extreme' implementation with no vars and nested anonymous classes");

                        }
                    }).create(this, {
                        "title" : "require (no-rules)",
                        "message" : "require based 'extreme' implementation with no vars and nested anonymous classes"
                    }));

                    /* 4) let's create an instance of tile clazz and register it to the zystem */
                    this.setTile(Oskari.cls('Oskari.userinterface.extension.DefaultTile').create(this, {
                        "title" : "require-nr"
                    }));

                }
            }).create('requirenr');

        }
    })

    /* 5) */
    /* bundle instance will be created and create method called by the application startup sequence player */

});
