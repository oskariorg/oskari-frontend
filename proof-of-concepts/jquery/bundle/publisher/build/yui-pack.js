/* This is a unpacked Oskari bundle (bundle script version Thu May 31 2012 11:38:01 GMT+0300 (Suomen kesäaika)) */ 
/**
 * @class Oskari.poc.jquery.bundle.FeatureInfoBundleInstance
 *
 */
Oskari.clazz.define("Oskari.poc.jquery.bundle.PublisherBundleInstance", function() {
	this.map = null;
	this.core = null;
	this.sandbox = null;
	this.mapmodule = null;
	this.started = false;
	this.template = null;
	this.plugins = {};

	/**
	 * @property injected yuilibrary property (by bundle)
	 */
	this.yuilibrary = null;

}, {
	/**
	 * @static
	 * @property __name
	 *
	 */
	__name : 'PublisherWizard',
	"getName" : function() {
		return this.__name;
	},
	/**
	 * @method getSandbox
	 *
	 */
	getSandbox : function() {
		return this.sandbox;
	},
	/**
	 * @method start
	 *
	 * implements BundleInstance start methdod
	 *
	 * Note this is async as DOJO requires are resolved and
	 * notified by callback
	 *
	 */
	"start" : function() {
		var me = this;

		if(me.started)
			return;

		me.started = true;

		var sandbox = Oskari.$("sandbox");
		me.sandbox = sandbox;
		
		this.localization = Oskari.getLocalization(this.getName());

		sandbox.register(me);
		for(p in me.eventHandlers) {
			sandbox.registerForEventByName(me, p);
		}

		/**
		 * Let's extend UI
		 */
		var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);

		sandbox.request(this, request);

		/**
		 * let's load dependencies me
		 */
		me.mediator.bundle.require(function() {
			me.refresh();
		});
	},
	"init" : function() {
		return null;
	},
	/**
	 * @method update
	 *
	 * implements bundle instance update method
	 */
	"update" : function() {

	},
	/**
	 * @method afterChangeMapLayerOpacityEvent
	 */
	afterChangeMapLayerOpacityEvent : function(event) {

	},
	/**
	 * @method onEvent
	 */
	onEvent : function(event) {

		var handler = this.eventHandlers[event.getName()];
		if(!handler)
			return;

		return handler.apply(this, [event]);

	},
	/**
	 * @property eventHandlers
	 * @static
	 *
	 */
	eventHandlers : {
		'AfterMapLayerAddEvent' : function(event) {
			//this.refresh();
		},
		/**
		 * @method AfterMapLayerRemoveEvent
		 */
		'AfterMapLayerRemoveEvent' : function(event) {
			//this.refresh();
		},
		/**
		 * @method AfterMapLayerRemoveEvent
		 */
		'AfterMapMoveEvent' : function(event) {

		},
		/**
		 * @method AfterChangeMapLayerOpacityEvent
		 */
		'AfterChangeMapLayerOpacityEvent' : function(event) {
			if(this.sandbox.getObjectCreator(event) != this.getName()) {
				/* someone changed opacity */
				this.afterChangeMapLayerOpacityEvent(event);
			}
		}
	},

	/**
	 * @method stop
	 *
	 * implements bundle instance stop method
	 */
	"stop" : function() {
		var sandbox = this.sandbox();
		for(p in this.eventHandlers) {
			sandbox.unregisterFromEventByName(this, p);
		}

		var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

		sandbox.request(this, request);

		this.sandbox.unregister(this);
		this.started = false;
	},
	setSandbox : function(sandbox) {
		this.sandbox = null;
	},
	startExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.poc.jquery.publisher.Flyout', this);
		this.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.poc.jquery.publisher.Tile', this);
	},
	stopExtension : function() {
		this.plugins['Oskari.userinterface.Flyout'] = null;
		this.plugins['Oskari.userinterface.Tile'] = null;
	},
	getTitle : function() {
		return this.localization.title;
	},
	getDescription : function() {
		return "Sample";
	},
	getPlugins : function() {
		return this.plugins;
	},
	/**
	 * @method refresh
	 *
	 * (re)creates selected layers to a hardcoded DOM div
	 * #featureinfo This
	 */
	refresh : function() {
		var me = this;

		this.plugins['Oskari.userinterface.Flyout'].refresh();
		this.plugins['Oskari.userinterface.Tile'].refresh();

	}
}, {
	"protocol" : ["Oskari.bundle.BundleInstance", 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
/**
 * @class Oskari.poc.yuilibrary.featureinfo.Flyout
 */
Oskari.clazz.define('Oskari.poc.jquery.publisher.Flyout',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance) {
	this.instance = instance;
	this.container = null;
	this.template = null;
	this.templateTab = null;
	this.tabCount = 0;
	this.currentTab = 1;
	this._widths = null;
	this.state = null;
}, {
	getName : function() {
		return 'Oskari.poc.jquery.publisher.Flyout';
	},
	setEl : function(el, width, height) {
		this.container = el[0];
		// ?
	},
	startPlugin : function() {
                
		this.template = jQuery('<div id="wizard"><div id="wizard_steps"><form></form></div><div id="wizard_navigation" style="display:none;"><ul></ul></div>');
		this.templateTab = jQuery('<fieldset class="wizard_step"></fieldset>'); // <legend></legend>
	},
	stopPlugin : function() {

	},
	getTitle : function() {
		return this.instance.localization.title;
	},
	getDescription : function() {
	},
	getOptions : function() {

	},
	setState : function(state) {
		this.state = state;
		console.log("Flyout.setState", this, state);
	},
	refresh : function() {
		var me = this;
		var sandbox = me.instance.getSandbox();
		jQuery(me.container).empty();
			
		var wrapper = jQuery('<div id="wizard"></div>');
		var stepsWrapper = jQuery('<div id="wizard_steps"></div>');
		var form = jQuery('<form id="wizard_formElem"></form>');
		var navWrapper = jQuery('<div id="wizard_navigation" style="display:none;"></div>');
		var navigation = jQuery('<ul></ul>');
		wrapper.append(navWrapper);
		wrapper.append(stepsWrapper);
		stepsWrapper.append(form);
		navWrapper.append(navigation);
		
		form.append(this.createTab(this.instance.localization.steps.step1.title,
			this.instance.localization.steps.step1.content));
		navigation.append(jQuery('<li><a href="#" class="selected">'
			+ this.instance.localization.steps.step1.tab + '</a></li>'));
		
		form.append(this.createTab(this.instance.localization.steps.step2.title,
			this.instance.localization.steps.step2.content));
		navigation.append(jQuery('<li><a href="#">'
			+ this.instance.localization.steps.step2.tab + '</a></li>'));

		
		form.append(this.createTab(this.instance.localization.steps.step3.title,
			this.instance.localization.steps.step3.content));
		navigation.append(jQuery('<li><a href="#">'
			+ this.instance.localization.steps.step3.tab + '</a></li>'));
		
		
		
		jQuery(me.container).append(wrapper);
		
		this.tabCount = 3;
		this.calculateWidths();
		this.bindNavigation();
	},
	createTab : function(name, contentText) {
		var tab = jQuery('<fieldset class="wizard_step"></fieldset>');
		tab.append(jQuery('<legend>' + name + '</legend>'));
		tab.append('<p>' + contentText +' </p>');
		return tab;
	},
	calculateWidths: function() {
		
		/*
		sum and save the widths of each one of the fieldsets
		set the final sum as the total width of the steps element
		*/
		var stepsWidth	= 0;
	    var widths 		= new Array();
		jQuery('#wizard_steps .wizard_step').each(function(i){
	        var $step 		= jQuery(this);
			widths[i]  		= stepsWidth;
	        stepsWidth	 	+= $step.width();
	    });
		jQuery('#wizard_steps').width(stepsWidth);
		this._widths = widths; 
		
		/*
		show the navigation bar
		*/
		jQuery('#wizard_navigation').show();
	},
	bindNavigation: function() {
		var me = this;
		
		/*
		when clicking on a navigation link 
		the form slides to the corresponding fieldset
		*/
	    jQuery('#wizard_navigation a').bind('click',function(e){
			var $this	= jQuery(this);
			var prev	= me.currentTab;
			$this.closest('ul').find('li').removeClass('selected');
	        $this.parent().addClass('selected');
			/*
			we store the position of the link
			in the current variable	
			*/
			me.currentTab = $this.parent().index() + 1;
			/*
			animate / slide to the next or to the corresponding
			fieldset. The order of the links in the navigation
			is the order of the fieldsets.
			Also, after sliding, we trigger the focus on the first 
			input element of the new fieldset
			If we clicked on the last link (confirmation), then we validate
			all the fieldsets, otherwise we validate the previous one
			before the form slided
			*/
	        jQuery('#wizard_steps').stop().animate({
	            marginLeft: '-' + me._widths[me.currentTab-1] + 'px'
	        },500,function(){
				jQuery('#wizard_formElem').children(':nth-child('+ parseInt(me.currentTab) +')').find(':input:first').focus();	
			});
	        e.preventDefault();
	    });
	}
}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
/*
 * @class Oskari.poc.yuilibrary.featureinfo.Tile
 */
Oskari.clazz.define('Oskari.poc.jquery.publisher.Tile',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance) {
	this.instance = instance;
	this.container = null;
	this.template = null;
}, {
	getName : function() {
		return 'Oskari.poc.jquery.publisher.Tile';
	},
	setEl : function(el, width, height) {
		this.container = $(el);
	},
	startPlugin : function() {
		this.refresh();
	},
	stopPlugin : function() {
		this.container.empty();
	},
	getTitle : function() {
		return this.instance.localization.title;
	},
	getDescription : function() {
	},
	getOptions : function() {

	},
	setState : function(state) {
		console.log("Tile.setState", this, state);
	},
	refresh : function() {
		var me = this;
		var instance = me.instance;
		var cel = this.container;
		var tpl = this.template;
		var sandbox = instance.getSandbox();
		var layers = sandbox.findAllSelectedMapLayers();

		/*var status = cel.children('.oskari-tile-status');
		 status.empty();

		 status.append('(' + layers.length + ')');*/

	}
}, {
	'protocol' : ['Oskari.userinterface.Tile']
});
