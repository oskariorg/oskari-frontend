/**
 * @class Oskari.userinterface.component.Bubble
 * 
 * Closable erikseen
 * 
 */
Oskari.clazz.define('Oskari.userinterface.component.Alert',

/**
 * @method create called automatically on construction
 * @static
 *
 */
function() {
	this.compiledTemplates = {};
	this.compileTemplates();
	this.ui = null;
	this.container = null;	
}, {
	templates : {
		"default" : '<div class="oskari-alert"><div class="oskari-alert-icon-close"></div></div>',
		"success" : '<div class="oskari-alert oskari-alert-success"><div class="oskari-alert-icon-close"></div></div>',
		"error" : '<div class="oskari-alert oskari-alert-error"><div class="oskari-alert-icon-close"></div></div>',
		"info" : '<div class="oskari-alert oskari-alert-info"><div class="oskari-alert-icon-close"></div></div>'
	},
	compileTemplates : function() {
		for(var p in this.templates ) {
			this.compiledTemplates[p] = jQuery(this.templates[p]);
		}
	},
	insertTo : function(container) {
		this.container = container;
	},
	setContent : function(pContent, status) {
		if( this.ui ) {
			this.ui.remove();
			this.ui = null;
		}
			
		var txtdiv = this.compiledTemplates[status || 'default'].clone();
		txtdiv.append(pContent);
		this.container.prepend(txtdiv);
		this.ui = txtdiv;
		var me = this;
		txtdiv.children('.oskari-alert-icon-close').click(function(){
			me.hide();
		});
	},
	hide : function() {
		if( this.ui)  {
			this.ui.remove();
			this.ui = null;
		}
		
	}
});
