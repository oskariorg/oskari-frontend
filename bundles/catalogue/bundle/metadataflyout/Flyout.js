/**
 * @class Oskari.catalogue.bundle.metadataflyout.Flyout
 *
 *
 * This hosts metadata content loaded via ajax from
 * Geonetwork
 *
 * Embeds preformatted (unstyled) tables of metadata information.
 *
 * Style will be forced with CLASS manipulation ?
 *
 * TBD this does way too much logic - logic to be moved to instance
 *
 *
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadataflyout.Flyout',

/**
 * @method create called automatically on construction
 * @static
 *
 * Always extend this class, never use as is.
 */
function(instance, locale, loader) {

	/* @property instance bundle instance */
	this.instance = instance;

	/* @property locale locale for this */
	this.locale = locale;

	/* @property container the DIV element */
	this.container = null;

	/* element references */
	this.views = {};
	this.titles = {};
	this.tabs = {};
	this.browseGraphic = null;

	/* @Alert for some notifications */
	this.compileTemplates();
	this.alert = Oskari.clazz.create('Oskari.userinterface.component.Alert');

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

	/**
	 * @property contentState
	 * what is shown and how
	 */
	this.contentState = {
		metadata : {
			uuid : null,
			RS_Identifier_Code : null,
			RS_Identifier_CodeSpace : null
		},
		view : 'abstract'

	};

}, {
	compileTemplates : function() {

	},
	/**
	 * @property template HTML templates for the User Interface
	 * @static
	 */
	templates : {
		content : "<div class='metadataflyout_content'></div>",
		browseGraphic : "<div class='metadataflyout_content_browseGraphic'><img /></div>",
		viewTabs : "<div class='metadataflyout_content_tabs'></div>",
		viewTab : "<div class='metadataflyout_content_tab'></div>",
		titles : {
			"abstract" : "<div class='metadataflyout_content_abstract_title'></div>",
			"jhs" : "<div class='metadataflyout_content_jhs_title'></div>",
			"inspire" : "<div class='metadataflyout_content_inspire_title'></div>"

		},
		views : {
			"abstract" : "<div class='metadataflyout_content_abstract'></div>",
			"jhs" : "<div class='metadataflyout_content_jhs'></div>",
			"inspire" : "<div class='metadataflyout_content_inspire'></div>"
		}
	},
	getName : function() {
		return 'Oskari.catalogue.bundle.metadataflyout.Flyout';
	},
	setEl : function(el, width, height) {
		this.container = jQuery(el);
	},
	startPlugin : function() {
		var locale = this.locale;
		var content = jQuery(this.templates.content);

		var me = this;

		/* let's create view selector tabs - and hide them all */

		var viewTabs = jQuery(this.templates.viewTabs);
		var viewTab = jQuery(this.templates.viewTab);

		for(var v in this.templates.views ) {
			var tabs = viewTabs.clone();
			var tabTexts = locale.tabs[v];

			for(var t in tabTexts ) {
				var tab = viewTab.clone();

				if( typeof tabTexts[t] === "string") {

					tab.append(tabTexts[t]);
					tabs.append(tab);
					if(t != v) {

						tab.click({
							viewId : t
						}, function(arg) {
							var data = arg.data;
							me.showMetadataView(data.viewId);
						});
					}
				} else {
					var text = tabTexts[t].text;
					var target = tabTexts[t].target;

					tab.append(text);
					tabs.append(tab);

					tab.click({
						viewId : t,
						target : target
					}, function(arg) {
						var data = arg.data;
						me.openMetadataView(data.viewId, data.target);
					});
				}
			}

			tabs.hide();

			this.tabs[v] = tabs;
			content.append(tabs);
		}

		/*placeholder for browseGrpahics */
		var browseGraphic = jQuery(this.templates.browseGraphic);
		this.browseGraphic = browseGraphic;
		content.append(browseGraphic);

		/*
		 * let's create views - and hide them also
		 */
		for(var v in this.templates.views ) {

			/*
			 * view tabs
			 */

			/*
			 * views
			 */
			this.titles[v] = jQuery(this.templates.titles[v]);
			this.titles[v].append(this.locale[v]);
			this.views[v] = jQuery(this.templates.views[v]);

			content.append(this.titles[v]);
			content.append(this.views[v]);

		}

		/* special handling */
		/* let's add placeholder for browseGraphics */
		content.append(viewTabs);

		this.alert.insertTo(this.container);

		this.container.append(content);

	},
	stopPlugin : function() {
		this.container.empty();
	},
	getTitle : function() {
		return "Metadata";
	},
	getDescription : function() {
	},
	getOptions : function() {

	},
	setState : function(state) {
		this.state = state;

	},
	/**
	 * @method openMetadataView
	 *
	 * opens a view in new window. this will not change state.
	 */
	openMetadataView : function(viewId, target) {
		var me = this;
		if( !this.contentState) {
			return;
		}
		var metadata = this.contentState.metadata;

		this.instance.getLoader().openMetadata(viewId, metadata.uuid, metadata.RS_Identifier_Code, metadata.RS_Identifier_CodeSpace, function(data) {
		}, null, target);
	},
	/**
	 * @method showMetadataView
	 *
	 * shows metadata subset view. this changes state.
	 */
	showMetadataView : function(viewId, target) {
		this.instance.getSandbox().printDebug("ShowMetadataView " + viewId);
		var tabs = this.tabs;
		var views = this.views;
		var titles = this.titles;

		for(var v in views ) {
			if(v != viewId) {
				tabs[v].hide();
				titles[v].hide();
				views[v].hide();
			} else {
				tabs[v].show();
				titles[v].show();
				views[v].hide();
			}

		}

		this.contentState.view = viewId;

		this.loadMetadataForState();

	},
	/**
	 * @method loadMetadataForState
	 */
	loadMetadataForState : function() {
		var me = this;
		var views = this.views;
		
		if(!this.contentState || !this.contentState.metadata || !this.contentState.metadata.uuid) {
			return false;
		}
		
		var viewId = this.contentState.view;
		var metadata = this.contentState.metadata;

		function handler(request) {
			views[viewId].html(request.responseText);
			
			 /* HACK BEGIN */
            /* Let's fix HREFs to click events */
            var links = views[viewId].find("a[href]");

            jQuery.each(links, function(index, ahref) {

                var el = jQuery(ahref);
                var href = el.attr('href');
                if(!href) {
                    return;
                }
                if(!href[0] == '?') {
                    return;
                }

                var splits = href.split("&");
                var argMap = {};
                jQuery.each(splits, function(index, part) {
                    var keyVal = part.split("=");
                    argMap[keyVal[0]] = keyVal[1];
                });

                el.attr('href', null);
                el.click({
                    viewId : viewId,
                    uuid : argMap['uuid']
                }, function(arg) {
                    var data = arg.data;
                    var uuid = data.uuid;

                    me.showMetadata(uuid);
                });
            });

			/* HACK END */
			
			views[viewId].css("display", "");
			
			
			
		}

		me.instance.getLoader().loadGeonetworkAjaxHTML(handler,viewId, metadata.uuid, metadata.RS_Identifier_Code, metadata.RS_Identifier_CodeSpace);

	},
	/**
	 * @method loadMetadataJSONForState
	 */
	loadMetadataJSONForState : function() {

		var me = this;
		if(!this.contentState || !this.contentState.metadata || !this.contentState.metadata.uuid) {
			return false;
		}
		var metadata = this.contentState.metadata;

		this.instance.getLoader().loadMetadata('json', metadata.uuid, metadata.RS_Identifier_Code, metadata.RS_Identifier_CodeSpace, function(data) {
			if( !data  || !data.mdcs || !data.mdcs.length || data.mdcs.length == 0 ) {
				return;
			}
			var metadataJson = data.mdcs[0];
			me.processJSON(metadataJson);
		}, 'json');
		return true;
	},
	/**
	 * @method processJSON
	 */
	processJSON : function(metadataJson) {
		var browseGraphicUrl = metadataJson.browseGraphic;
		var extentEnvelope = metadataJson.env;

		/*
		 * Let's display the browse graphic image
		 */
		if(browseGraphicUrl) {
			var img = jQuery(this.browseGraphic).children('img');

			if(this.instance.getLoader().dev) {
				img.attr('src', 'espoo_johtokartta_s.png');
			} else {
				img.attr('src', browseGraphicUrl);
			}

		}

		/*
		 * Let's post Envelope to some layer
		 */
		if(extentEnvelope) {
			this.instance.showExtentOnMap(this.contentState.metadata.uuid, extentEnvelope, metadataJson);
		}

	},
	/**
	 * @method showMetadata
	 *
	 * Launches Ajax requestst to embed metadata descriptions
	 * for requested metadata
	 *
	 * Backend provides HTML setups that will be embedded and
	 * styled with bundled CSS.
	 */
	showMetadata : function(uuid, RS_Identifier_Code, RS_Identifier_CodeSpace) {
		this.resetContentState();
		
		this.contentState.metadata.uuid = uuid;
		this.contentState.metadata.RS_Identifier_Code = RS_Identifier_Code;
		this.contentState.metadata.RS_Identifier_CodeSpace = RS_Identifier_CodeSpace;
		this.instance.getSandbox().printDebug("showMetadata { uuid=" + uuid + ", view=" + this.contentState.view + "}");
		this.loadMetadataJSONForState();
		this.showMetadataView(this.contentState.view);
	},
	/**
	 * @method scheduleShowMetadata
	 *
	 * this 'schedules' asyncronous loading
	 * ( calls directly now )
	 * Used to buffer excess calls
	 *
	 */
	scheduleShowMetadata : function(uuid, RS_Identifier_Code, RS_Identifier_CodeSpace) {
		this.showMetadata(uuid, RS_Identifier_Code, RS_Identifier_CodeSpace);
	},
	/**
	 * @method setContentState

	 * restore state from store
	 */
	setContentState : function(contentState) {
		if( !contentState) {
			this.resetContentState();
			return;
		}
		this.contentState = contentState;
		if(this.loadMetadataJSONForState()) {
			this.showMetadataView(this.contentState.view);
		}
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
		this.contentState = {
			metadata : {
				uuid : null,
				RS_Identifier_Code : null,
				RS_Identifier_CodeSpace : null
			},
			view : 'abstract'

		};
	}


}, {
	'protocol' : ['Oskari.userinterface.Flyout']
});
