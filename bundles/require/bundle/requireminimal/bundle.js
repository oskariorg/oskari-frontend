/* attempt to break any conventions and rules to reduce code */
/* using anonymous classes, builders, in place inheritance, instantiations within method calls, eating the stack with nested call hiearchy etc */

define(["oskari", "./locale/fi", "./locale/en"], function(Oskari) {

    /* This module declares a bundle, a bundle instance with tile, flyout */
    /* 1) bundle */
    return Oskari.bundleCls('requireminimal', "Oskari.sample.bundle.requireminimal.RequireBundle").methods({
        /* this is the required method that will fire up bundle with creating a bundle instance */
        create : function() {

            /* 2) bundle instance */
            return Oskari.extensionCls().methods({

                startPlugin : function() {

                    /* 3) flyout - let's create an instance of flyout clazz and register it to the zystem */
                    this.setFlyout(Oskari.flyoutCls().methods({

                        /* create some UI */
                        startPlugin : function() {
                            var me = this, el = me.getEl(), loc = me.getLocalization(), msg = loc.message;
                            el.append(msg);

                        }
                    }).create(this, this.getLocalization('flyout')));

                    /* 4) let's create an instance of tile clazz and register it to the zystem */
                    this.setTile(Oskari.cls('Oskari.userinterface.extension.DefaultTile').create(this, this.getLocalization('tile')));

                }
            }).create('requireminimal');

        }
    });

    /* 5) */
    /* bundle instance will be created and create method called by the application startup sequence player */

});
