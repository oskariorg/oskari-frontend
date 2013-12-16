define(["oskari", "./locale/fi", "./locale/en"], function(Oskari) {

    /* This module declares a tile, flyout and instance for a bundle */

    /* 1) */
    /* we'll use the default tile class for this sample */
    var tileCls = Oskari.cls('Oskari.userinterface.extension.DefaultTile');

    /* 2) */
    /* we'll extend the default flyout for this sample */
    var flyoutCls = Oskari.flyoutCls().methods({

		/* create some UI */
        startPlugin : function() {
            var me = this, el = me.getEl(),
            	loc = me.getLocalization(),
            	msg = loc.message;

            el.append(msg);

            var elBtn = jQuery(['<button>', loc.clickToRequest.button, '</button>'].join(''));

            elBtn.click(function() {

                var responseMsgFromHandler = me.issue('sample.SampleRequest', loc.clickToRequest.text);

                var msgEl = jQuery('<div />');
                msgEl.append(responseMsgFromHandler);
                el.append(msgEl);

            })

            el.append(elBtn);

        },

        /* add some info to ui (called from instance in this demo) */
        showMapMove : function(x, y) {
            var me = this, el = me.getEl(), loc = me.getLocalization();
            var msgEl = jQuery('<div />');
            msgEl.append([loc.mapmove, " ", x, ",", y].join(''));
            el.append(msgEl);
        },
        
        /* add some event info to ui (called from instance in this demo) */
        showEventes : function(event) {
            var me = this, el = me.getEl(), loc = me.getLocalization();

            el.append(jQuery(['<div>', loc.eventReceived, '</div>'].join('')));

        },
        
        /* cleanup resources */  
        stopPlugin : function() {
		
        }

    });

    /* 3) */
    /* we'll extend the	EnhancedExtension base class to setup this bundle's operations */

    var instanceCls = Oskari.extensionCls('Oskari.sample.bundle.requiresf.RequireBundleInstance').
    	methods({

        startPlugin : function() {

            // let's create an instance of flyout clazz and register it to the zystem
            var flyout = flyoutCls.create(this, this.getLocalization()['flyout']);
            this.setFlyout(flyout);

            // let's create an instance of tile clazz and register it to the zystem
            var tile = tileCls.create(this, this.getLocalization()['tile'])
            this.setTile(tile);

        },
        
        /* cleanup resources */  
        stopPlugin : function() {
		
        }
        
    }).events({
        /* we'll listen to some Oskari events */

        /* sent by mapmodule */
        "AfterMapMoveEvent" : function(evt) {

            this.getFlyout().showMapMove(evt.getCenterX(), evt.getCenterY());
        },

        /* we can listen to our own event also sent from flyout code. see Flyout.js */
        "sample.SampleEvent" : function(evt) {

            this.getFlyout().showEventes(evt);
        }
    });

    /* 4) */
    /* we'll register the Bundle with a bundleCls call */

    return Oskari.bundleCls('requiresf', "Oskari.sample.bundle.requiresf.RequireBundle").
    	methods({
        create : function() {

            return instanceCls.create('requiresf');

        }
    });

    /* 5) */
    /* bundle instance will be created and create method called by the application startup sequence player */

});
