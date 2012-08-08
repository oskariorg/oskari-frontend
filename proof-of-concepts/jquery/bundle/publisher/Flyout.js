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
