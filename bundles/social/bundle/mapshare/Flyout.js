/**
 * @class Oskari.social.bundle.mapshare.Flyout
 *
 *
 *
 * PoC Flyout to show map share timeline kind of information
 *
 */
Oskari.clazz.define('Oskari.social.bundle.mapshare.Flyout',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance,locale, data) {
	
	this.instance = instance;
	
	this.data = data;
	
	this.els = {}; 

	/* @property locale locale for this */
	this.locale = locale;

	/* @property container the DIV element */
	this.container = null;
	
	this.counter = 0;

	this.alert = Oskari.clazz.create('Oskari.userinterface.component.Alert');

	
	

}, {
	templates: {
		tweet : '<div class="mapshare_tweet"><div class="mapshare_text"><span></span></div><div class="mapshare_commentary"></div></div>',
		tweetPic : '<div class="mapshare_tweet"><div class="mapshare_text"><a href="javascript:void(0);"><img /></a><div><span></span></div></div><div class="mapshare_commentary"></div></div>',
		comment : '<div class="mapshare_comment"><span></span></div>',
		commentEntryBox : '<div class="mapshare_comment_entrybox"><input type="text"></input></div>'
	},
	
	getName : function() {
		return 'Oskari.social.bundle.mapshare.Flyout';
	},
	setEl : function(el, width, height) {
		this.container = jQuery(el);
	},
	startPlugin : function() {
		var locale = this.locale;

		var me = this;
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
	 * @method setContentState

	 * restore state from store
	 */
	setContentState : function(contentState) {
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
	},
	pushContent: function(data,value) {
			
		

		var me = this;
		
		var valueId = value._id ;
		
		/*
		if( me.els[valueId] ) {
			return;
		}
		*/
		
		
		me.counter++;
		
		var el = value.thumbnail ? 
			jQuery(me.templates.tweetPic) :
			jQuery(me.templates.tweet) 
			;
		me.els[valueId] = el;
		
		el.find('span').append('['+me.counter+']...');
		
		el.css("display","hidden");
		
		if( value.thumbnail ) {
			var thumbnail = value.thumbnail;
			thumbnail = thumbnail.replace(/&amp;/g,'&');
			thumbnail = thumbnail.replace(/ /g,'+');			
			
			el.find('img').attr('src',thumbnail);
		}
		me.container.prepend(el);
		el.fadeIn('slow');
		
		
//		console.log("PUSHCONTENT",value,me.container,el);
		
		/* entrybox */
				var txt = jQuery(me.templates.commentEntryBox);
				var s = txt.find('span');
				s.append(''+value.message);
				el.find('.mapshare_commentary').append(txt);		
	},
	amendContent: function(data,value,context) {
		var me = this;
//		console.log("AMEND",data,value,context);
		
		
		if( context == 'promotionLinks') {
			if( value._label == 'promotes') {
				var el = me.els[value._inV];
				var s = el.find('.mapshare_text span');
				s.empty();
				s.append(''+value.message);
			} else if( value._label = 'commented' ){
				var el = me.els[value._inV].find('.mapshare_commentary');
				var txt = jQuery(me.templates.comment);
				var s = txt.find('span');
				s.append(''+value.message);
				el.append(txt);
				
			}
		}
	}
}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
