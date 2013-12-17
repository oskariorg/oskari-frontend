define(["oskari", "jquery"], function(Oskari, jQuery, sampleRequestCls) {

    return Oskari.flyoutCls().
    	methods({

        /* set up the 'ui' in given element */
        startPlugin : function() {

            var me = this, el = me.getEl(), loc = me.getLocalization(), msg = loc.message ;
            
            el.append(msg);

            /* let's send a sample request - to self this time */
            var elBtn = jQuery(['<button>', loc.clickToRequest.button, '</button>'].join(''));
            elBtn.click(function() {
            	
            	/* this issues a request which is handled in request handler */
            	/* note: this makes sense as demo only in this context - request are mainly to cross bundle comm */ 
                var responseMsgFromHandler = 
                	me.issue('sample.SampleRequest', loc.clickToRequest.text);

				/* let's append the response from request handler to the UI */
                var msgEl = jQuery('<div />');
                msgEl.append(responseMsgFromHandler ? responseMsgFromHandler : 'N/A');
                el.append(msgEl);

            })
            el.append(elBtn);
            el.append(jQuery('<div />'));


            /* let's send a ui changing request to the zystem */
            var elDetach = jQuery(['<button>', loc.ui.detach.button, '</button>'].join(''));
            elDetach.click(function() {
            	/* this request is handled by divmanazer bundle currently */
                me.issue('userinterface.UpdateExtensionRequest', me.getExtension(), 'detach');
            });

            el.append(elDetach);
        },

        /* add some info to ui (called from instance in this demo) */
        showMapMove : function(x, y) {
            var me = this, el = me.getEl(), loc = me.getLocalization();
            var msgEl = jQuery('<div />');
            msgEl.append([loc.mapmove, " ", x, ",", y].join(''));
            this.getEl().append(msgEl);
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

})