/**
    Provides INFORMATION on available WFS services.
    Provides INFORMATION on WFS services XMLSchemas.
    MIGHT use HTML5 local datastore if available.
    author janne.korhonen at maanmittauslaitos.fi (c) nls.fi
*/

NLSFI.Store.WebFeatureServiceStore = OpenLayers.Class({

    /* we MUST support some form of proxy to enable browser to wfs access */
    wfsProxy: null,

    /** list of wfs URLs known to this 'system' */
    wfsGetCapsURLs: [],

    /** list of processed WFS caps infos */
    wfsServiceInfos: {},

    /* wfs loaded schemas for schema awareness */
    /* we SHALL support multiple Schema Contexts to support different WFS/XMLSchema versions */
    schemas: null,
	
    /* returns xmljs */
    getXmlJs: function() { return schemas.xmljs; },

    /* setup xmljs to support loading of xmlschemas */
    initialize: function() {
        var xmljs = new XMLJS();
        xmljs.formats = {
            html: new HTMLElementFormat(document)
        };
        var loader = new XSDLoader(xmljs,function(props,pct) {});
        this.schemas = {
            xmljs: xmljs,
            loader: loader,
            args: {
                processDescFeats: true,
                schemaFunc: function(schemaRef) {
                    loader.pushSchemaRequest(schemaRef);
                }
            }
        };
    },

    /* accessor for service defs */
    getServices: function() { return this.wfsServiceInfos; },

    /* add WFS url for later processing */
    addService: function(url) {
        this.wfsGetCapsURLs.push( url );
    },
	
    /* called by WFS inspector */
    readWFSLayersCallback: function(wfsCaps,wfsUrl) {

        if( wfsCaps != null && wfsCaps.caps != null) {
            var wfsServiceInfo = this.buildWFSServiceInfo(wfsCaps,wfsUrl);            
            this.wfsServiceInfos[wfsUrl] = wfsServiceInfo;        
        }
        
        var self = this;
        if( this.wfsGetCapsURLs.length != 0  ) {
            setTimeout(function() { self.loadServicesGetCaps(); },500);
    	} else if( this.callbacks.finished ) {
            this.callbacks.finished(this.getServices());
    	}
    },
	
    callbacks: {
        finished: null,
        status: null
    },
	
    /* register callbacks */
    setCallbacks: function(funcs) {
        if( funcs  ) {
            for( p in funcs ) {
                this.callbacks[p] = funcs[p];
            }
        } else {
            this.callbacks = {
                finished: null,
                status: null
            };
        }
    },
	
	
    /* start loading WFS get caps for services */
    loadServicesGetCaps: function() {
        if( this.wfsGetCapsURLs.length == 0  ) {
            if( this.callbacks.finished )
                this.callbacks.finished(this.getServices());
                return;
            }

            var wfsUrl = this.wfsGetCapsURLs.shift();
            var self = this;
	
            // haetaan KTJkiiWFS palvelusta tasot käyttöliittymään
            setTimeout(function() {
                // tasot WFS GetCapabilities pohjalta
                var wfsInspector = new NLSFI.OpenLayers.Format.WFS.WFSInspector({
                    url: wfsUrl
                });

                var n = 0;

                wfsInspector.read(
                    function(wfsCaps) {
            			// wfsUrl pitäisi kaivaa wfsCapsista (KOHTA)
                    	self.readWFSLayersCallback(wfsCaps,wfsUrl);
                    },
                    self.callbacks.status,
	        	self.schemas.args
                );

            },1000);
	
    },

    /** build service info structure */
    buildWFSServiceInfo: function(wfsCaps,wfsUrl) {
	
        var wfsServiceInfo = {
            wfsCaps: wfsCaps,
            wfsUrl: wfsUrl,
            getCapsUrl: wfsCaps.getCapsUrl,
            wfsLayersAndWorkers: {}
        };
	
        return wfsServiceInfo;
    },
	
	
    CLASS_NAME: "NLSFI.Store.WebFeatureServiceStore"
});
