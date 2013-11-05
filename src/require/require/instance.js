define(["oskari", 
    "./Flyout", /* UI */ 
    "./SampleEvent",  /* sample event to notify other bundles */
    "./SampleRequest",  /* sample request to provide API to others to call */    
    "./locale/fi", "./locale/en"], 
    
    function(Oskari, flyoutCls, sampleEventCls, sampleRequestCls) {

    /* 1) default tile implementation is sufficient */
    var tileCls = Oskari.cls('Oskari.userinterface.extension.DefaultTile');

    /* 2) Flyout declared in Flyout.js see define above */

    return Oskari.extensionCls('Oskari.sample.bundle.require.RequireBundleInstance').
  		methods({

		/* this is the placed to create (optional) components tile, flyout etc. */
        startPlugin : function() {

            var flyout = flyoutCls.create(this, this.getLocalization()['flyout']);
            this.setFlyout(flyout);

            var tile = tileCls.create(this, this.getLocalization()['tile'])
            this.setTile(tile);

        },
        
        /* cleanup resources */  
        stopPlugin : function() {
		
        }
        
    }).events({
        /* loose coupling is used for requests and events as identifiers are used to bind to implementation */
       
      	/* notification for map movement if any */
        'AfterMapMoveEvent' : function(evt) {

            this.getFlyout().showMapMove(evt.getCenterX(), evt.getCenterY());
        },

        /* we can listen to our own event also sent from flyout code. see Flyout.js */
        "sample.SampleEvent" : function(evt) {

            this.getFlyout().showEventes(evt);
        }
        
    }).requests({
    	/* loose coupling is used for requests and events as identifiers are used to bind to implementation */
    	
    	/* we'll add handler to the request declared above - request MUST be included by the handler - not the 'client' */
        "sample.SampleRequest" : function(request) {
 			var me = this, loc = me.getLocalization();
 			
            this.notify('sample.SampleEvent',loc.requestHandler.prompt);

            return [loc.requestHandler.text,' ',request.getMessage()].join('');

        }
    });
});

