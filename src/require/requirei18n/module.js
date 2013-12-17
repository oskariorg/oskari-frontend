/* attempt to break any conventions and rules to reduce code */
/* using anonymous classes, builders, in place inheritance, instantiations within method calls, eating the stack with nested call hiearchy etc */

define(["oskari", "i18n!./nls/locale"], function(Oskari, locale) {

    /* This module declares a bundle, a bundle instance with tile, flyout */
    /* 1) bundle */
    return Oskari.bundleCls().methods({
        /* this is the required method that will fire up bundle with creating a bundle instance */
        create : function() {

            /* 2) bundle instance */
            var extensionInstance = Oskari.extensionCls().methods({

                startPlugin : function() {
                	                	
                    /* 3) flyout - let's create an instance of flyout clazz and register it to the zystem */               	
                	var flyout = 
                		Oskari.flyoutCls().
                    		methods({

                        	/* create some UI */
                        	startPlugin : function() {
                            	var el = this.getEl(), 
                            		msg = this.getLocalization().message
                            	
                            	el.append(msg);

                        	}
                    	}).create(this, locale.flyout); /* instance and locale as parameter to constructor */
                		

                    this.setFlyout(flyout);

                    /* 4) let's create an instance of default tile with helper */
                    this.setDefaultTile(locale.tile.title);

                }
            }).create('i18nextension',locale);/* instancename, locale as parameter to constructor */
            
            extensionInstance.setLocalization(locale);
            
            return extensionInstance;

        }
    });

    /* 5) */
    /* bundle instance will be created and create method called by the application startup sequence player */

});
