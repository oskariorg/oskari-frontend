/**
 * @class Oskari.social.bundle.mapshare.MapShareBundleInstance
 *
 *
 * PoC Map Share timeline bundle
 *
 *
 *
 *
 * Add this to startupsequence to get this bundle started
 {
 title : 'mapshare',
 fi : 'mapshare',
 sv : '?',
 en : '?',
 bundlename : 'mapshare',
 bundleinstancename : 'mapshare',
 metadata : {
 "Import-Bundle" : {
 "mapshare" : {
 bundlePath : '/<path to>/packages/social/bundle/'
 }
 },
 "Require-Bundle-Instance" : []
 },
 instanceProps : {}
 }
 */
Oskari.clazz.define("Oskari.social.bundle.mapshare.MapShareBundleInstance",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    this.buttonGroup = 'mapshare-tools';
    this.sandbox = null;
    this.plugins = {};
    this._localization = null;

    this._timer = null;
    this._prevState = null;

    this._data = {
        "root" : "Paikkatietoikkuna",
        "name" : "userx",
        "promotionsTimeline" : [],
        "promotions" : {},
        "promotionDetails" : {},
        "promotionLinks" : {},
        "refTime" : null    // TÄMÄ PITÄÄ VALITA VIIMEISIMMÄN OBJECTIN timestampin PERUSTEELLA / locale ongelmia, jotka estävät js timestamp vs. backend timestmap
    };

}, {
    /*
     * @static
     * @property conf
     * default configuration which may be overriden
     */

    conf : {
        "ajaxBase" : "http://viljonkkake01.nls.fi:8182/graphs/agraph/tp/gremlin?script=",
        "ajaxTemplates" : {
            "promotions" : "g.V('name','{0}').next().outE('promotes').filter{it.timestamp%20%3E{1}}.inV",
            "promotionLinks" : "g.v({0}).inE",
            "published" : "g.V('name','{0}').next().outE('published')",
            "publishedDetails" : "g.v({0}",
            "addMapVertex" : "g.addVertex(null,[name:'{0}',type:'maplink',href:'{1}',thumbnail:'{2}'])",
            "publishMap" : "g.addEdge(g.V('name','{0}').next(),g.v({1}),'published',[message:'{2}',type:'maplink',timestamp:new Date().getTime()])",
            "promoteMap" : "g.addEdge(g.V('name','{0}').next(),g.v({1}),'promotes',[message:'{2}',type:'maplink',timestamp:new Date().getTime()])",
            "userDetails" : "g.V('name','{0}')",
            "addUser" : "g.addVertex([name:'{0}'])"
        },
        "formatProducers" : {
            "application/pdf" : "http://wps.paikkatietoikkuna.fi/dataset/map/process/imaging/service/thumbnail/maplink.pdf?",
            "image/png" : "http://wps.paikkatietoikkuna.fi/dataset/map/process/imaging/service/thumbnail/maplink.png?"
        }
    },

    format : function(pattern, args) {
        return pattern.replace(/{(\d+)}/g, function(match, number) {
            return typeof args[number] != 'undefined' ? args[number] : match;
        });
    },
    getData : function() {
        return this._data;
    },
    /*
     * @static
     * @property __name
     */
    __name : 'MapShare',

    /**
     * @method getName
     * Module protocol method
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getTitle
     * Extension protocol method
     * @return {String} localized text for the title of the component
     */
    getTitle : function() {
        return this.getLocalization('title');
    },
    /**
     * @method getDescription
     * Extension protocol method
     * @return {String} localized text for the description of the component
     */
    getDescription : function() {
        return this.getLocalization('desc');
    },
    /**
     * @method getSandbox
     * Convenience method to call from Tile and Flyout
     * @return {Oskari.mapframework.sandbox.Sandbox}
     */
    getSandbox : function() {
        return this.sandbox;
    },
    /**
     * @method update
     * BundleInstance protocol method
     */
    update : function() {
    },
    /**
     * @method getLocalization
     * Convenience method to call from Tile and Flyout
     * Returns JSON presentation of bundles localization data for current language.
     * If key-parameter is not given, returns the whole localization data.
     *
     * @param {String} key (optional) if given, returns the value for key
     * @return {String/Object} returns single localization string or
     *      JSON object for complete data depending on localization
     *      structure and if parameter key is given
     */
    getLocalization : function(key) {
        if(!this._localization) {
            this._localization = Oskari.getLocalization(this.getName());
        }
        if(key) {
            return this._localization[key];
        }
        return this._localization;
    },
    responseProcessors : {
        
        "promotions" : function(response) {
            var me = this;
            console.log("PROMOTIONS", response);
            var newContent = [];

            jQuery.each(response.results, function(index, value) {
                me._data.promotionsTimeline.unshift(value);
                newContent.unshift(value);
                me._data.promotions[value._id] = value;
                me._loadAjax('promotionLinks', me._getAjaxUrl('promotionLinks', [value._id]));
                me.pushContent(me._data, value);
            });
        },
        "promotionLinks" : function(response) {
            var me = this;
            console.log("PROMOTION LINKS", response);

            jQuery.each(response.results, function(index, value) {
                me._data.promotionLinks[value._id] = value;

                if(!me._data.refTime) {
                    me._data.refTime = value.timestamp;
                } else if(value.timestamp) {
                    if(value.timestamp > me._data.refTime) {
                        me._data.refTime = value.timestamp;
                    }
                }

                me.amendContent(me._data, value, 'promotionLinks');

            });
        }
    },

    /**
     * @method start
     * BundleInstance protocol method
     */
    start : function() {
        var me = this;
        	var conf = me.conf ;
		var sandboxName = ( conf ? conf.sandbox : null ) || 'sandbox' ;
		var sandbox = Oskari.getSandbox(sandboxName);

        me.sandbox = sandbox;
        sandbox.register(this);

        for(p in this.eventHandlers) {
            sandbox.registerForEventByName(this, p);
        }

        var request = sandbox.getRequestBuilder('userinterface.AddExtensionRequest')(this);

        sandbox.request(me, request);

        /* btn to toolbar - should create some kind of icon */
        var addBtnRequestBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest');
        var btns = {
            'link' : {
                iconCls : 'tool-link',
                tooltip : 'Share',
                sticky : true,
                callback : function() {
                    me.shareMapView();
                }
            }
        };
        for(var tool in btns) {
            sandbox.request(this, addBtnRequestBuilder(tool, this.buttonGroup, btns[tool]));
        }

        /* stateful */
        sandbox.registerAsStateful(this.mediator.bundleId, this);

        /* add user if not there / might ask */
        var user = sandbox.getUser();
        if(user && user.isLoggedIn() && user.getNickName()) {
            me._data.name = user.getNickName();
            me.shareUser(me._data.name,{});
        }
    
    },
    
    /**
     * @property
     * ajax responseprocessors 
     */
    shareProcessors : {
        "addMapVertex" : function(data) {
            var me = this;

            var map = data.results[0]._id;
            var root = me._data.root;
            var user = me._data.name;
            var msg = '' + user + ' published map ' + map;

            var urlBase = this.conf.formatProducers['image/png'];

            var uriPublished = me._getAjaxUrl('publishMap', [user, map, msg]);

            jQuery.ajax({
                url : uriPublished,
                dataType : 'json',
                success : function(data, textStatus) {
                    console.log(data);
                },
                error : function(jqXHR, textStatus, errorThrown) {

                }
            });

            var uriPromoted = me._getAjaxUrl('promoteMap', [root, map, msg]);
            jQuery.ajax({
                url : uriPromoted,
                dataType : 'json',
                success : function(data, textStatus) {
                    console.log(data);

                },
                error : function(jqXHR, textStatus, errorThrown) {

                }
            });
        },
        "addAuthored" : function(data) {

        },
        "addPromoted" : function(data) {

        },      
        "userDetails" : function(response, userName, isAddUser) {
            var me = this;

            if(response.results.length != 0) {
                return;
            }
            if(!isAddUser) {
                return;
            }

            var uriAddUser = me._getAjaxUrl('addUser', [userName]);
            jQuery.ajax({
                url : uriAddUser,
                dataType : 'json',
                success : function(data, textStatus) {
                    console.log("ADDED USER " + userName);
                },
                error : function(jqXHR, textStatus, errorThrown) {

                }
            });
        }
    },
    
    /**
     * @method shareMapView
     * 
     */
    shareMapView : function() {
        var me = this;
        var sandbox = this.getSandbox();
        var maplinkArgs = sandbox.generateMapLinkParameters();

        var urlBase = this.conf.formatProducers['image/png'];
        var pageSizeArgs = "&pageSize=" + 'A4_Landscape';
        var previewScaleArgs = "&scaledWidth=256"
        var url = urlBase + maplinkArgs + pageSizeArgs + previewScaleArgs;

        var name = me._data.name + "_" + ((new Date()).getTime());

        var thumbnail = encodeURI(url).replace(/&/g, "%26");
        var href = encodeURI(maplinkArgs).replace(/&/g, "%26");

        var uri = me._getAjaxUrl('addMapVertex', [name, href, thumbnail]);

        jQuery.ajax({
            url : uri,
            dataType : 'json',
            success : function(data, textStatus) {

                me.shareProcessors.addMapVertex.apply(me, [data]);
            },
            error : function(jqXHR, textStatus, errorThrown) {

            }
        });

    },
    
    /**
     * @method shareUser
     */
    shareUser : function(userName,details) {

        /* let's add when needed */
        var me = this; 
        var addUser = true;
        var uriUserDetails = me._getAjaxUrl('userDetails', [userName]);
        jQuery.ajax({
            url : uriUserDetails,
            dataType : 'json',
            success : function(data, textStatus) {
                me.shareProcessors.userDetails.apply(me, [data, userName, addUser]);
            },
            error : function(jqXHR, textStatus, errorThrown) {

            }
        });

    },
    
    /**
     * @method loadTimeline
     */
    loadTimeline : function() {
        var me = this;
        var forWhom = me._data.root;
        var ref = null;
        if(!me._data.refTime) {
            var now = new Date().getTime();
            ref = 0;

            console.log(ref);
            me._data.refTime = ref;
        } else {
            ref = me._data.refTime;
        }

        me._loadAjax('promotions', me._getAjaxUrl('promotions', [forWhom, ref]));

    },
    _getAjaxUrl : function(context, args) {
        var me = this;
        return me.conf.ajaxBase + me.format(me.conf.ajaxTemplates[context], args);
    },
    _loadAjax : function(context, uri) {
        var me = this;
        var dataType = 'json';
        var cb = function(response, sucs) {
            /*me.processResponse(context,response,sucs)*/
            me.responseProcessors[context].apply(me, [response]);
        }

        jQuery.ajax({
            url : uri,
            dataType : dataType || 'xml',
            beforeSend : function(x) {
                if(x && x.overrideMimeType) {
                    if(dataType && dataType == 'json')
                        x.overrideMimeType("application/json");
                    else
                        x.overrideMimeType("text/html");
                }
            },
            success : function(data, textStatus) {

                cb(data, true);
            },
            error : function(jqXHR, textStatus, errorThrown) {
                cb(null, false);

            }
        });

    },
    pushContent : function(data, value) {
        var me = this;
        me.plugins['Oskari.userinterface.Flyout'].pushContent(data, value);
    },
    amendContent : function(data, value, context) {
        var me = this;
        me.plugins['Oskari.userinterface.Flyout'].amendContent(data, value, context);
    },
    /**
     * @method stop
     * BundleInstance protocol method
     */
    stop : function() {
        var sandbox = this.sandbox;

        /* sandbox cleanup */

        for(p in this.eventHandlers) {
            sandbox.unregisterFromEventByName(this, p);
        }

        var request = sandbox.getRequestBuilder('userinterface.RemoveExtensionRequest')(this);

        sandbox.request(this, request);

        sandbox.unregisterStateful(this.mediator.bundleId);
        sandbox.unregister(this);
        this.sandbox = null;
        this.started = false;
    },
    /**
     * @method startExtension
     * Extension protocol method
     */
    startExtension : function() {
        var me = this;

        me.plugins['Oskari.userinterface.Flyout'] = Oskari.clazz.create('Oskari.social.bundle.mapshare.Flyout', me, me.getLocalization('flyout'), me.getData());
        me.plugins['Oskari.userinterface.Tile'] = Oskari.clazz.create('Oskari.social.bundle.mapshare.Tile', me, me.getLocalization('tile'));
    },
    /**
     * @method stopExtension
     * Extension protocol method
     */
    stopExtension : function() {
        var me = this;
        for(var pluginType in me.plugins) {
            if(pluginType) {
                me.plugins[pluginType] = null;
            }
        }
    },
    /**
     * @method getPlugins
     * Extension protocol method
     */
    getPlugins : function() {
        return this.plugins;
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
        /**
         * @method userinterface.ExtensionUpdatedEvent
         */
        'userinterface.ExtensionUpdatedEvent' : function(event) {

            var me = this;

            if(event.getExtension().getName() != me.getName()) {
                // not me -> do nothing
                return;
            }

            var viewState = event.getViewState();
            if(!me._prevState || me._prevState != viewState) {
                var isOpen = viewState != "close";

                me.displayContent(isOpen);
                if(isOpen && !me._timer) {
                    me._timer = window.setInterval(function() {
                        me.loadTimeline();
                    }, 2000);
                }
            }

            if(viewState == "close" && me._timer) {
                window.clearInterval(me._timer);
                me._timer = null;
            }

            me._prevState = viewState;

        }
    },

    displayContent : function(isOpen) {
        if(!isOpen) {
            return;
        }
        var me = this;
        me.loadTimeline();
    },
    "init" : function() {
        return null;
    }
}, {
    protocol : ['Oskari.bundle.BundleInstance', 'Oskari.mapframework.module.Module', 'Oskari.userinterface.Extension']
});
