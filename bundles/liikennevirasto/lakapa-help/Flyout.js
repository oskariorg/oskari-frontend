/**
 * @class Oskari.liikennevirasto.bundle.lakapa.help.Flyout
 *
 *
 * Embeds preformatted (unstyled) tables of metadata information.
 *
 * Style will be forced with CLASS manipulation ?
 *
 * TBD this does way too much logic - logic to be moved to instance
 *
 *
 */
Oskari.clazz.define('Oskari.liikennevirasto.bundle.lakapa.help.Flyout',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance, locale, conf) {
	/* @property instance bundle instance */
	this.instance = instance;

	/* @property locale locale for this */
	this.locale = locale;
	
	/* @property conf conf for this */
	this.conf = conf;

	/* @property container the DIV element */
	this.container = null;

	this.menuSelectors = [];
	this.scrollToTimer = null;
	this.templateTransportSelector = jQuery('<div id="lakapa-help-transport-selector"></div>');
	this.templateLayerSelector = jQuery('<div id="lakapa-help-layer-selector"></div>');
	this.templateLayerDataSelector = jQuery('<div id="lakapa-help-layer-data-selector"></div>');
	this.templateCroppingSelector = jQuery('<div id="lakapa-help-cropping-selector"></div>');
	this.templateAddBasketSelector = jQuery('<div id="lakapa-help-add-basket-selector"></div>');
	this.templateBasketDownloadSelector = jQuery('<div id="lakapa-help-basket-download-selector"></div>');
	this.templateStepTitle = jQuery('<li class="lakapa-help-step-title lakapa-help-step"></li>');
	this.templateStephtml = jQuery('<div class="lakapa-help-step-content lakapa-help-step"></div>');

	/**
	 * @property contentState
	 * what is shown and how
	 */
	this.contentState = {};
	
	/**
	 * @property showQueue
	 * request queue to enable postponing ajax loads (TBD)
	 *
	 */
	this.showQueue = [];

	/**
	 * @property state
	 */
	this.state = null;

}, {
	compileTemplates : function() {

	},
	/**
	 * @property template HTML templates for the User Interface
	 * @static
	 */
	templates : {
		content : "<div class='metadataflyout_content'></div>"
	},
	getName : function() {
		return 'Oskari.liikenenvirasto.bundle.lakapa.help.Flyout';
	},
	setEl : function(el, width, height) {
		this.container = jQuery(el);
	},
	startPlugin : function() {
		var me = this;
		var locale = this.locale;
		var content = jQuery(me.templates.content);
		
		me.container.addClass('lakapa-help-flyout');
		me.createUI('road');
	},
	/**
	 * @method _clearHighlighs
	 * @private
	 */
	_clearHighlighs: function(){
		var me = this;
		jQuery.each(me.menuSelectors,function(index,selector){
			jQuery(selector).removeClass('lakapa-help-menu-highlight');
		});
		jQuery('.lakapa-help-list li').find('.lakapa-help-step-title-div').removeClass('lakapa-help-menu-highlight');
		jQuery('.lakapa-help-list li').find('.lakapa-help-step-content').removeClass('lakapa-help-menu-highlight');
	},
	/**
	 * Create help ui
	 * @method createUI
	 * @public
	 * @param {String} transport selected transport
	 */
	createUI: function(transport){
		var me = this;
		me.menuSelectors = [];
		me._clearHighlighs();
		me.container.empty();
		me.container.append('<ul class="lakapa-help-list">');
		var stepNumber = 1;
		jQuery.each(me.conf.steps.fi,function(index, step){
			if(jQuery.inArray(step.menulink, me.menuSelectors) == -1){
				me.menuSelectors.push(step.menulink);
			}
			var title = me.templateStepTitle.clone();			
			title.attr('data-linktomenu', step.menulink);
			title.html('<div class="lakapa-help-step-title-div"><span class="lakapa-help-step-title-span">' + stepNumber + '.</span><p class="lakapa-help-step-title-p"> ' + step.title + '</p><span class="lakapa-help-step-title-clear"></span></div>');
			
			if(stepNumber>1){
				title.addClass('upmargin');
			}
			
			var html = me.templateStephtml.clone();
			
			html.html(step.html);
						
			var selected = jQuery.grep(step.visible, function(item,index){ return item==transport;});
			if(selected.length>0){
				me.container.find('.lakapa-help-list').append(title);
				title.append(html);
				
				title.append('<div class="lakapa-help-step-title-clear"></div>');
				stepNumber++;
			}
		});
		
		jQuery('.lakapa-help-hide-'+transport).hide();
		me.container.append('</ul>');
		
		jQuery('.lakapa-help-flyout').first().ScrollTo();
		me._addJQueryListeners();
	},
	/**
	 * @method _addJQueryListeners
	 * @private
	 */
	_addJQueryListeners: function(){
		var me = this;
		me._removeJQueryListeners();
		jQuery('.lakapa-help-list li').mouseover(function(){
			me._clearHighlighs();
			var selector = jQuery(this).attr('data-linktomenu');
			jQuery(selector).addClass('lakapa-help-menu-highlight');
			var attrSelector = jQuery(this).attr('data-linktomenu');
			
			var elements = jQuery('.lakapa-help-list li[data-linktomenu="'+attrSelector+'"]');
			elements.find('.lakapa-help-step-title-div').addClass('lakapa-help-menu-highlight');
			elements.find('.lakapa-help-step-content').addClass('lakapa-help-menu-highlight');
		});
		
		jQuery('.lakapa-help-list').mouseout(function(){
			me._clearHighlighs();
		});
		
		jQuery.each(me.menuSelectors,function(index,selector){
			jQuery(selector).mouseover(function(){
				if(me._isVisible()){
					jQuery(this).addClass('lakapa-help-menu-highlight');
					me._scrollToAndHighLight(selector);
				}	
			});
			jQuery(selector).mouseout(function(){
				clearTimeout(me.scrollToTimer);
				me._clearHighlighs();
			});
		});
		
	},
	/**
	 * @method _scrollToAndHighLight
	 * @private
	 * @param selector
	 */
	_scrollToAndHighLight: function(selector){
		var me = this;
		clearTimeout(me.scrollToTimer);
		me.scrollToTimer = setTimeout(function(){
			var elements = jQuery('.lakapa-help-list li[data-linktomenu="'+selector+'"]');
			elements.ScrollTo();
			//elements.first().ScrollTo();
			elements.find('.lakapa-help-step-title-div').addClass('lakapa-help-menu-highlight');
			elements.find('.lakapa-help-step-content').addClass('lakapa-help-menu-highlight');
		}, 100);
	},
	/**
	 * @method _removeJQueryListeners
	 * @private
	 */
	_removeJQueryListeners: function(){
		var me = this;
		jQuery('.lakapa-help-list li').unbind('mouseenter').unbind('mouseleave');
		jQuery('.lakapa-help-list').unbind('mouseenter').unbind('mouseleave');
	},
	/**
	 * @method _isVisible
	 * @private
	 * @returns is visible
	 */
	_isVisible: function(){
		var me = this;
		var flyout = me.container.parent().parent();
		var isVisible = flyout.hasClass('oskari-detached');
		return isVisible;
		
	},
	stopPlugin : function() {
		this.container.empty();
	},
	getTitle : function() {
		return this.locale.title;
	},
	getDescription : function() {
		
	},
	getOptions : function() {

	},
	setState : function(state) {
		this.state = state;

	},
	/**
	 * @method showHelp
	 */
	showHelp: function(){
		jQuery('.lakapa-help-flyout').first().ScrollTo();
	},
	/**
	 * @method setContentState

	 * restore state from store
	 */
	setContentState : function(contentState) {
		var me = this;
		var parent = me.container.parents('.oskari-flyout');
        if(parent.hasClass('oskari-detached')){
            parent.find('.oskari-flyouttool-close').trigger('click');
        }
		this.contentState = contentState;
	},
	/**
	 * @method getContentState
	 *
	 * get state for store
	 */
	getContentState : function() {
		return this.contentState;
	},
	resetContentState : function() {
		this.contentState = {};
	}


}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
