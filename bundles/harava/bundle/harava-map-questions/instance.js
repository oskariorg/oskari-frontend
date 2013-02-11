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
	this.plugin = null;
	this.started = false;
	this.requestHandlers = {};
	this.modules = null;
	this._lastfeature = null;
	this.drawLayerSubfix = 'Map Questions Layer - ';
}, {
	_currentStep: '',
	_currentStepAndQuestion: '',
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
	 * @method toggleTools
	 * Toggle map question tools 
	 */
	toggleTools: function(){
		var me = this;
		if(me._currentStep!=null){
    		var module = me.getModuleById(me._currentStep);
    		if(module!=null){
				if(jQuery(module.appendTo).prev().hasClass('harava-toolbar-hide')){
		    		me.hideTools();
		    	}
		    	else if(jQuery(module.appendTo).prev().hasClass('harava-toolbar-show')){
		    		me.showTools();
		    	}
    		}
		}
	},
	/**
	 * @method hideTools
	 * Hide map questions tools
	 */
	hideTools: function(){
		var me = this;
		if(me._currentStep!=null){
    		var module = me.getModuleById(me._currentStep);
    		if(module!=null){
    			var module = me.getModuleById(me._currentStep);    		
    			jQuery(module.appendTo).prev().removeClass('harava-toolbar-hide');
    			jQuery(module.appendTo).prev().addClass('harava-toolbar-show');
    			
    			jQuery(module.appendTo).animate({left:'-25%'},'slow');
    			jQuery(module.appendTo).prev().animate({left:'0'},'slow');
    		}
		}
	},
	/**
	 * @method showTools
	 * Show map question tools
	 * @param fast need fast drawing
	 */
	showTools: function(fast){
		var me = this;
		if(me._currentStep!=null){
    		var module = me.getModuleById(me._currentStep);
    		if(module!=null){
    			var module = me.getModuleById(me._currentStep);    		
    			jQuery(module.appendTo).prev().removeClass('harava-toolbar-show');
    			jQuery(module.appendTo).prev().addClass('harava-toolbar-hide');
    			
    			if(fast===true){
    				jQuery(module.appendTo).animate({left:'0'},'fast');
    				jQuery(module.appendTo).prev().animate({left:'25%'},'fast');
    			}
    			else {
    				jQuery(module.appendTo).animate({left:'0'},'slow');
    				jQuery(module.appendTo).prev().animate({left:'25%'},'slow');
    			}
    		}
		}	
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
        var mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
		var plugin = Oskari.clazz.create('Oskari.harava.bundle.mapquestions.plugin.HaravaQuestionsMapPlugin', conf);
		mapModule.registerPlugin(plugin);
		mapModule.startPlugin(plugin);
		this.plugin = plugin;
		
        if(conf!=null && conf.modules!=null){
        	me.modules = conf.modules;
        	var id = me.plugin.getOpenLayersDivId();
        	
        	/* Add all configured Question modules */
        	jQuery.each(me.modules, function(k, module){
        		var t = '';
        		if(module.questionTitle!=''){
        			t = '<p>'+module.questionTitle+'</p>';
        		}
        		jQuery(module.appendTo).before('<div class="harava-map-question-toggle-toolbar harava-toolbar-hide"></div>');
        		
        		jQuery(module.appendTo).prev().bind('click',function(){
        			me.toggleTools();
        		});
        		
        		jQuery(module.appendTo).append('<div class="harava-map-question-title">'+t+'</div>');
    	        jQuery(module.appendTo).append('<div id="harava-map-questions-content"></div>');
    	        
	            // Create questions
	            jQuery.each(module.questions, function(k, question){
    	        	var text = question.title;
    	        	var tooltip = '';
    	        	if(question.tooltip!=null){
    	        		tooltip = question.tooltip;
    	        	}
    	        	var html = '<div class="harava-question"><div class="harava-question-title">'+text+'</div><div id="harava-question-tool_'
    	        		+module.questionId+'_'+question.id +'" class="harava-question-tool harava-question-tool-'+module.questionId
    	        		+' harava-question-tool-'+question.type+'" qId="1" title="'+tooltip+'"></div></div>';
    	        	jQuery(module.appendTo).append(html);
    	        	jQuery('#harava-question-tool_'+module.questionId+'_'+question.id).bind('click',
        					function(){
        						me.activateControl(''+module.questionId+'',''+question.id+'');
					});
    	        });  
    	        
        	});
        	
        }
        
        me.sandbox.register(me);
    	
    	// request
    	this.requestHandlers = {
    			showQuestionStepRequest : Oskari.clazz.create('Oskari.harava.bundle.mapquestions.request.ShowQuestionStepRequestHandler', sandbox, me),
    			showQuestionToolsRequestHandler : Oskari.clazz.create('Oskari.harava.bundle.mapquestions.request.ShowQuestionToolsRequestHandler', sandbox, me),
    			hideQuestionToolsRequestHandler : Oskari.clazz.create('Oskari.harava.bundle.mapquestions.request.HideQuestionToolsRequestHandler', sandbox, me),
    			toggleQuestionToolsRequestHandler : Oskari.clazz.create('Oskari.harava.bundle.mapquestions.request.ToggleQuestionToolsRequestHandler', sandbox, me)
    	};
        me.sandbox.addRequestHandler('ShowQuestionStepRequest', this.requestHandlers.showQuestionStepRequest);
        me.sandbox.addRequestHandler('ShowQuestionToolsRequest', this.requestHandlers.showQuestionToolsRequestHandler);
        me.sandbox.addRequestHandler('HideQuestionToolsRequest', this.requestHandlers.hideQuestionToolsRequestHandler);
        me.sandbox.addRequestHandler('ToggleQuestionToolsRequest', this.requestHandlers.toggleQuestionToolsRequestHandler);
    },
    /**
     * @method getCurrentModuleFeatures
     * Get current module all features
     * @returns {Array} features
     */
    "getCurrentModuleFeatures" :function(){
    	var me = this;
    	var features = me.plugin.getCurrentModuleFeatures();
    	return features;
    },
    /**
     * @method getAllModuleFeatures
     * Get all modules all features
     * @returns {Array} features
     */
    "getAllModuleFeatures": function(){
    	var me = this;
    	var features = me.plugin.getAllModuleFeatures();
    	return features;
    },
    /**
     * @method onPopupClose
     * Close all popus and unselect all features
     * @param {OpenLayers.Event} evt
     */
    "onPopupClose" : function(evt){
    	var sandbox = Oskari.$("sandbox");
    	var me = sandbox.findRegisteredModuleInstance('HaravaMapQuestions');
    	me.plugin.onPopupClose();
    	me.showTools();
    	
    },
    /**
     * @method deActivateAll
     * Deactivate all module controls and tools
     */
    "deActivateAll" : function(){
    	var me = this;
    	jQuery('.harava-question-tool').removeClass('active');
    	jQuery('.harava-question-tool').css({
			"background-color": "transparent"
		});
    },
    /**
     * @method showStep
     * Move questions to defined step
     * @param {String} moduleId
     */
    "showStep" : function(moduleId){
    	var me = this;
    	
    	var oldmodule = me.getModuleById(me._currentStep);
		if(oldmodule!=null){
			if(jQuery(oldmodule.appendTo).prev().hasClass('harava-toolbar-show')){
	    		me.showTools();
	    	}
		}
    	
    	me.deActivateAll();
    	me.plugin.showStep(moduleId);    	
    	me._currentStep=moduleId;  	
    },
    /**
     * @method activateControl
     * Activate selected tool
     * @param {String} moduleId selected moduleid
     * @param {String} questionId selected qustion id
     */
    "activateControl" : function(moduleId, questionId){
    	var me = this;    	
    	var module = me.getModuleById(moduleId);    	
    	var isSelected = jQuery('#harava-question-tool_' + moduleId + '_' + questionId).hasClass('active');    	
    	me.deActivateAll();
    	me.plugin.activateControl(moduleId, questionId);
    	
    	if(isSelected){
    		jQuery('#harava-question-tool_' + moduleId + '_' + questionId).removeClass('active');
    		jQuery('#harava-question-tool_' + moduleId + '_' + questionId).css({
    			"background-color": "transparent"
    		});
    	} else {
    		jQuery('#harava-question-tool_' + moduleId + '_' + questionId).addClass('active');
    		jQuery('#harava-question-tool_' + moduleId + '_' + questionId).css({
    			"background-color": "#A3D4C7"
    		});
    		me._currentStepAndQuestion = '';
    	}
    	
    	if(module!=null){
    		var question = me.getQuestionById(questionId, module.questions);
    		if(question!=null){
    			me._currentStepAndQuestion = moduleId + '_' +questionId;
    		}
    	}
    },
    /**
     * @method getModuleById
     * Get module by id
     * @param {String} moduleId
     * @returns founded module if exists. If not return null.
     */
    "getModuleById" : function(moduleId){
    	var me = this;
    	var retModule = null;
    	jQuery.each(me.modules, function(k, module){
    		if(module.questionId==moduleId){
    			retModule = module;
    		}
    	});
    	return retModule;
    },
    /**
     * @method getQuestionById
     * Get question by id
     * @param {String} questionId
     * @param {Array} questions
     * @returns founded question if exists. If not return null.
     */
    "getQuestionById" : function(questionId, questions){
    	var me = this;
    	var retQuestion = null;
    	jQuery.each(questions, function(k, question){
    		if(question.id==questionId){
    			retQuestion = question;
    		}
    	});
    	return retQuestion;
    },
    /**
     * @method destroySelectedFeature
     * Destroy selected feature
     */
    "destroySelectedFeature" : function () {
    	var me = this;
    	me.plugin.destroySelectedFeature();
    },
    /**
     * @method hideSelectedFeature
     * Hide selected feature
     * @param {Boolean} notCloseTools
     */
    "hideSelectedFeature" : function (notCloseTools) {
    	var me = this;
    	me.plugin.hideSelectedFeature(notCloseTools);
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

        // request handler cleanup 
        sandbox.removeRequestHandler('ShowQuestionStepRequest', this.requestHandlers['showQuestionStepRequest']);        
        sandbox.removeRequestHandler('ShowQuestionToolsRequest', this.requestHandlers['showQuestionToolsRequestHandler']);
        sandbox.removeRequestHandler('HideQuestionToolsRequest', this.requestHandlers['hideQuestionToolsRequestHandler']);
        sandbox.removeRequestHandler('ToggleQuestionToolsRequest', this.requestHandlers['toggleQuestionToolsRequestHandler']);        
        
        var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

        sandbox.request(this, request);
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