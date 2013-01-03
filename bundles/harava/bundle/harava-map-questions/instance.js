/**
 * @class Oskari.mapframework.bundle.coordinatedisplay.MapQuestionsBundleInstance
 *
 * Registers and starts the
 * Oskari.mapframework.bundle.coordinatedisplay.MapQuestions bundle
 */
Oskari.clazz.define("Oskari.harava.bundle.MapQuestionsBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
	this.sandbox = null;
	this.started = false;
	this.requestHandlers = {};
	this.modules = null;
}, {
	/**
	 * @static
	 * @property __name
	 */
	__name : 'HaravaMapQuestions',

	/**
	 * @method getName
	 * @return {String} the name for the component 
	 */
	getName : function() {
		return this.__name;
	},
	/**
	 * @method setSandbox
	 * @param {Oskari.mapframework.sandbox.Sandbox} sandbox
	 * Sets the sandbox reference to this component
	 */
	setSandbox : function(sbx) {
		this.sandbox = sbx;
	},
	/**
	 * @method getSandbox
	 * @return {Oskari.mapframework.sandbox.Sandbox}
	 */
	getSandbox : function() {
		return this.sandbox;
	},
    /**
     * @method start
     * BundleInstance protocol method
     */
    "start" : function() {
    	var me = this;
    	if(me.started){
    		return;
    	}
    	
    	me.started = true;
    	
    	var sandbox = Oskari.$("sandbox");
        me.sandbox = sandbox;
        
        var conf = me.conf;
        console.dir(conf);
        
        if(conf!=null && conf.modules!=null){
        	me.modules = conf.modules;
        	var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        	var opMap = mapModule.getMap();
        	var id = opMap.div.id;
        	
        	jQuery('#'+id).append('<div id="harava-map-questions"></div>');
        	
        	var html = '';
        	$.each(me.modules, function(k, module){        	
        		jQuery('#harava-map-questions').append('<div class="harava-map-question-title"><p>'+module.questionTitle+'</p></div>');
    	        jQuery('#harava-map-questions').append('<div id="harava-map-questions-content"></div>');
    	        $.each(module.questions, function(k, question){
    	        	var text = question.title;
    	        	html += '<div class="harava-question"><div class="harava-question-title">'+text+'</div><div id="harava-question-tool-'+question.id
    	        		+'" class="harava-question-tool harava-question-tool-'+question.type+'" title="'+text+'"></div></div>';
    	        });  
    	        
        	});
        	jQuery('#harava-map-questions-content').append(html);
        }        
        
        jQuery('#harava-map-questions').css({
    		"width": "250px",
    		"max-height": "367px",
    		"background-color" : "#009999",
    		"left": "0",
    		"top": "0",
    		"z-index":"1030",
    		"position": "absolute",
    		"overflow" : "auto",
    		"overflow-x" : "hidden"
    	});
        
        jQuery('.harava-question').css({
        	"width":"100%",
        	"overflow":"hidden",
        	"border-bottom":"1px solid #ffffff"
        });        
        
        jQuery('.harava-question-title').css({
        	"width":"190px",
        	"overflow":"hidden",
        	"min-height":"32px",
        	"float":"left",
        	"margin":"5px"
        });
        
        jQuery('.harava-question-tool').css({
        	"width":"50px",
        	"float":"right",
        	"cursor":"pointer",
        	"width":"32px",
        	"height":"32px",
        	"margin-top":"5px"
        });
        
        jQuery('.harava-question-tool-point').css({        	
        	"background":"url(\'http://www.eharava.fi/HaravaProto/css/icons/icons.png\') repeat scroll -544px 0 transparent"        	
        });
        
        jQuery('.harava-question-tool-line').css({
        	"background":"url(\'http://www.eharava.fi/HaravaProto/css/icons/icons.png\') repeat scroll -512px 0 transparent"
        });
        
        jQuery('.harava-question-tool-area').css({
        	"background":"url(\'http://www.eharava.fi/HaravaProto/css/icons/icons.png\') repeat scroll -480px 0 transparent"
        });
        
        jQuery('.harava-map-question-title').css({
        	"border-bottom":"1px solid #ffffff"
        });
        
        
        jQuery('.harava-map-question').css({
        	"width":"100%",
        	//"height":"50px",
        	"border-bottom": "1px solid #ffffff"
        });
        
        jQuery('.harava-map-question div').css({
        	"padding":"5px"
        });
        
        jQuery('.harava-question-tool').live("click",function(){
        	var isClass = jQuery(this).hasClass('active');
        	jQuery('.harava-question-tool').removeClass('active');
        	jQuery('.harava-question-tool').css({
    			"background-color": "transparent"
    		});
        	
        	if(isClass){
        		jQuery(this).removeClass('active');
        		jQuery(this).css({
        			"background-color": "transparent"
        		});
        	} else {
        		jQuery(this).addClass('active');
        		jQuery(this).css({
        			"background-color": "#A3D4C7"
        		});
        		console.info('active ' + jQuery(this)[0].id);
        	}
        	
        	
        	
        	
        });
        
        sandbox.register(me);
    	
    	// request
        /*
    	var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
    	this.requestHandlers = {
    			updateMapRequest : Oskari.clazz.create('Oskari.harava.bundle.mapmodule.request.UpdateMapRequestHandler', sandbox, mapModule),
    			addControlToMapRequest : Oskari.clazz.create('Oskari.harava.bundle.mapmodule.request.AddControlToMapRequestHandler', sandbox, mapModule)
    	};

        sandbox.addRequestHandler('UpdateMapRequest', this.requestHandlers.updateMapRequest);
        sandbox.addRequestHandler('AddControlToMapRequest', this.requestHandlers.addControlToMapRequest);
        */
    },

    /**
     * @method stop
     * BundleInstance protocol method
     */
    "stop" : function() {

    	var sandbox = this.sandbox();
        for(p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }
        /*

        // request handler cleanup 
        sandbox.removeRequestHandler('UpdateMapRequest', this.requestHandlers['updateMapRequest']);
        sandbox.removeRequestHandler('AddControlToMapRequest', this.requestHandlers['addControlToMapRequest']);
*/
        var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

        sandbox.request(this, request);

        //this.sandbox.unregisterStateful(this.mediator.bundleId);
        this.sandbox.unregister(this);
        this.started = false;
    },
    /**
	 * @method init
	 * implements Module protocol init method - initializes request handlers
	 */
	"init" : function() {
		
	},
    /**
     * @method update
     * BundleInstance protocol method
     */
    "update" : function() {
    }
}, {
	/**
     * @property {String[]} protocol
     * @static 
     */
    "protocol" : ['Oskari.bundle.BundleInstance']
});