/* Some helpers */

function huntDownNodeText(node) {
    var value = null;
    if(node.text) {
        value = node.text;
    } else if(node.textContent) {
        value = node.textContent;
    }
    if (!value) value = node.getAttribute("text");
    if (!value) value = node.getAttribute("#text");
    return value;
}


function parseDomFromString(raw) {
    var dom = null;
    try {
        if(window.DOMParser) {
            dom = (new DOMParser()).parseFromString(raw, "text/xml");
        } else if(window.ActiveXObject) {
            dom = new ActiveXObject('Microsoft.XMLDOM');
            dom.async = false;
            dom.loadXML(raw);
        }
    } catch (e) {
        alert(e);
    }
    return dom;
}

/**
 * TileMatrixLimits
 */
Oskari.clazz.define('Oskari.mapframework.capabilities.TileMatrixLimits', 
                    function(tileMatrixLimits) {
    this.tileMatrix = null;
    this.minTileRow = null;
    this.maxTileRow = null;
    this.minTileCol = null;
    this.maxTileCol = null;

    var children = tileMatrixLimits.childNodes;
    for (var j = 0; j < children.length; j++) {
       var child = children.item(j);
       var name = child.nodeName;
       var value = huntDownNodeText(child);
       switch (name) {
           case 'TileMatrix':
           case 'tilematrix':
               this.tileMatrix = value;
               break;
           case 'MinTileRow':
           case 'mintilerow':
               this.minTileRow = value;
               break;
           case 'MaxTileRow':
           case 'maxtilerow':
               this.maxTileRow = value;
               break;
           case 'MinTileCol':
           case 'mintilecol':
               this.minTileCol = value;
               break;
           case 'MaxTileCol':
           case 'maxtilecol':
               this.maxTileCol = value;
               break;
           }
       }
}, {
    __qname : 'Oskari.mapframework.capabilities.TileMatrixLimits',
    getQName : function() { return this.__qname; },
    __name : 'TileMatrixLimits',
    getName : function() { return this.__name; },
    getTileMatrix : function() { return this.tileMatrix; },
    getMinTileRow : function() { return this.minTileRow; },
    getMaxTileRow : function() { return this.maxTileRow; },
    getMinTileCol : function() { return this.minTileCol; },
    getMaxTileCol : function() { return this.maxTileCol; }        
});

/**
 * TileMatrix
 */
Oskari.clazz.define('Oskari.mapframework.capabilities.TileMatrix', 
                    function(tileMatrix) {
    this.identifier = null;
    this.scaleDenominator = null;
    this.topLeftCorner = null;
    this.tileWidth = null;
    this.tileHeight = null;
    this.matrixWidth = null;
    this.matrixHeight = null;

    var children = tileMatrix.childNodes;
    for (var j = 0; j < children.length; j++) {
       var child = children.item(j);
       var name = child.nodeName;
       var value = huntDownNodeText(child);
       switch (name) {
           case 'ows:Identifier':
           case 'ows:identifier':
           case 'Identifier':
           case 'identifier':
               this.identifier = value;
               break;
           case 'ScaleDenominator':
           case 'scaledenominator':
               this.scaleDenominator = value;
               break;
           case 'TopLeftCorner':
           case 'topleftcorner':
               this.topLeftCorner = value;
               break;
           case 'TileWidth':
           case 'tilewidth':
               this.tileWidth = value;
               break;
           case 'TileHeight':
           case 'tileheight':
               this.tileHeight = value;
               break;
           case 'MatrixWidth':
           case 'matrixwidth':
               this.matrixWidth = value;
               break;
           case 'MatrixHeight':
           case 'matrixheight':
               this.matrixHeight = value;
               break;
           }
       }
}, {
    __qname : 'Oskari.mapframework.capabilities.TileMatrix',
    getQName : function() { return this.__qname; },    
    __name : 'TileMatrix',
    getName : function() { return this.__name; },
    getIdentifier : function() { return this.identifier; },
    getScaleDenominator : function() { return this.scaleDenominator; },
    getTopLeftCorner : function() { return this.topLeftCorner; },
    getTileWidth : function() { return this.tileWidth; },
    getTileHeight : function() { return this.tileHeight; },
    getMatrixWidth : function() { return this.matrixWidth; },
    getMatrixHeight : function() { return this.matrixHeight; }
});


/**
 * TileMatrixSetLimits
 */
Oskari.clazz.define('Oskari.mapframework.capabilities.TileMatrixSetLimits', 
                    function(tileMatrixSetLimits) {
    this.tileMatrixLimits = [];
    
    var children = tileMatrixSetLimits.childNodes;
    for(var i = 0; i < children.length; i++) {
        var child = children.item(i);
        var childName = child.nodeName;
        var value = huntDownNodeText(child);
        switch (childName) {
            case 'TileMatrixLimits':
            case 'tilematrixlimits':
                this.tileMatrixLimits =
                    Oskari.clazz.create('Oskari.mapframework.capabilities.TileMatrixLimits', 
                                        child);
                break;
        }
    }
}, {
    __qname : 'Oskari.mapframework.capabilities.TileMatrixSetLimits',
    getQName : function() { return this.__qname; },
    __name : 'TileMatrixSetLimits',
    getName : function() { return this.__name; },
    getTileMatrixLimits : function() { return this.tileMatrixLimits; }    
});


/**
 * TileMatrixSetLink
 */
Oskari.clazz.define('Oskari.mapframework.capabilities.TileMatrixSetLink', 
                    function(tileMatrixSetLink) {
    this.tileMatrixSet = null;
    this.tileMatrixSetLimits = null;
    
    var children = tileMatrixSetLink.childNodes;
    for(var i = 0; i < children.length; i++) {
        var child = children.item(i);
        var childName = child.nodeName;
        var value = huntDownNodeText(child);
        switch (childName) {
            case 'TileMatrixSet':
            case 'tilematrixset':
                this.tileMatrixSet = value;
                break;
            case 'TileMatrixSetLimits':
            case 'tilematrixsetlimits':
                this.tileMatrixSetLimits =
                    Oskari.clazz.create('Oskari.mapframework.capabilities.TileMatrixSetLimits', 
                                        child);
                break;
        }
    }
}, {
    __qname : 'Oskari.mapframework.capabilities.TileMatrixSetLink',
    getQName : function() { return this.__qname; },
    __name : 'TileMatrixSetLink',
    getName : function() { return this.__name; },
    getTileMatrixSet : function() { return this.tileMatrixSet; },
    getTileMatrixSetLimits : function() { return this.tileMatrixSetLimits; }    
});

/**
 * TileMatrixSet
 */
Oskari.clazz.define('Oskari.mapframework.capabilities.TileMatrixSet', 
                    function(tileMatrixSet) {
    this.identifier = null;
    this.supportedCrs = null;
    this.tileMatrices = [];

    var children = tileMatrixSet.childNodes;
    for(var i = 0; i < children.length; i++) {
        var child = children.item(i);
        var childName = child.nodeName;
        var value = huntDownNodeText(child);
        switch (childName) {
            case 'ows:Identifier':
            case 'ows:identifier':
            case 'Identifier':
            case 'identifier':
                this.identifier = value;
                break;
            case 'ows:SupportedCRS':
            case 'ows:supportedcrs':
            case 'SupportedCRS':
            case 'supportedcrs':
                this.supportedCrs = value;
                break;
            case 'TileMatrix':
            case 'tilematrix':            
               var tm = 
                   Oskari.clazz.create('Oskari.mapframework.capabilities.TileMatrix', 
                                       child);
               this.tileMatrices.push(tm);
        }
    }
}, {
    __qname : 'Oskari.mapframework.capabilities.TileMatrixSet',
    getQName : function() { return this.__qname; },
    __name : 'TileMatrixSet',
    getName : function() { return this.__name; },
    getIdentifier : function() { return this.identifier; },
    getSupportedCrs : function() { return this.supportedCrs; },
    getTileMatrices : function() { return this.tileMatrices; } 
});


/**
 * Style
 */
Oskari.clazz.define('Oskari.mapframework.capabilities.Style',
                    function(style) {
    this.identifier = null;
    var children = style.childNodes;
    for(var i = 0; i < children.length; i++) {
        var child = children.item(i);
        var childName = child.nodeName;
        var value = huntDownNodeText(child);
        switch (childName) {
            case 'ows:Identifier':
            case 'ows:identifier':
            case 'Identifier':
            case 'identifier':
                this.identifier = value;
                break;
        }
    }
}, {
    __qname : 'Oskari.mapframework.capabilities.Style',
    getQName : function() { return this.__qname; },
    __name : 'Style',
    getName : function() { return this.__name; },
    getIdentifier : function() { return this.identifier; }
});


/**
 * WmtsLayer
 */
Oskari.clazz.define('Oskari.mapframework.capabilities.WmtsLayer', 
                    function(wmtsLayer) {
    this.title = null;
    this.abstrakt = null;
    this.wgs84BoundingBox = null;
    this.identifier = null;
    this.styles = [];
    this.formats = [];
    this.infoFormats = [];
    this.tileMatrixSetLinks = [];
    
    var children = wmtsLayer.childNodes;
    for(var i = 0; i < children.length; i++) {
        var child = children.item(i);
        var childName = child.nodeName;
        var value = huntDownNodeText(child);
        switch (childName) {
            case 'ows:Title':
            case 'ows:title':
            case 'Title':
            case 'title':
                this.title = value;
                break;
            case 'ows:Abstract':
            case 'ows:abstract':
            case 'Abstract':
            case 'abstract':
                this.abstrakt = value;
                break;
            case 'ows:WGS84BoundingBox':
            case 'ows:wgs84boundingbox':
            case 'WGS84BoundingBox':
            case 'wgs84boundingbox':
                this.wgs84BoundingBox = value;
                break;
            case 'Style':
            case 'style':
                var style = 
                    Oskari.clazz.create('Oskari.mapframework.capabilities.Style', 
                                        child);
                this.styles.push(style);
                break;
            case 'Format':
            case 'format':
                this.formats.push(value);
                break;
            case 'InfoFormat':
            case 'infoformat':
                this.infoFormats.push(value);
                break;
            case 'TileMatrixSetLink':
            case 'tilematrixsetlink':
                var tmsl = 
                    Oskari.clazz.create('Oskari.mapframework.capabilities.TileMatrixSetLink',
                                        child);
                this.tileMatrixSetLinks.push(tmsl);
                break;
        }
    }   
}, {
    __qname : 'Oskari.mapframework.capabilities.WmtsLayer',
    getQName : function() { return this.__qname; },   
    __name : 'WmtsLayer',
    getName : function() { return this.__name; },
    getTitle : function() { return this.title; },
    getWgs84BoundingBox : function() { return this.getWgs84BoundingBox; },
    getIdentifier : function() { return this.identifier; },
    getStyles : function() { return this.styles; },
    getFormats : function() { return this.formats; },
    getInfoFormats : function() { return this.infoFormats; },
    getTileMatrixSetLinks : function() { return this.tileMatrixSetLinks; }
});


/**
 * WmtsContents
 */
Oskari.clazz.define('Oskari.mapframework.capabilities.WmtsContents', 
                    function(contents) {
    this.wmtsLayers = [];
    this.tileMatrixSets = [];
    
    var children = contents.childNodes;
    for(var i = 0; i < children.length; i++) {
        var child = children.item(i);
        var childName = child.nodeName;
        var value = huntDownNodeText(child);
        switch (childName) {
            case 'Layer':
            case 'layer':
                var layer = 
                    Oskari.clazz.create('Oskari.mapframework.capabilities.WmtsLayer',
                                        child);
                this.wmtsLayers.push(layer);
                break;
            case 'TileMatrixSet':
            case 'tilematrixset':
                var tms = 
                    Oskari.clazz.create('Oskari.mapframework.capabilities.TileMatrixSet',
                                        child);
                break;
        }
    }
}, {
    __qname : 'Oskari.mapframework.capabilities.WmtsContents',
    getQName : function() { return this.__qname; },
    __name : 'WmtsContents',
    getName : function() { return this.__name; },
    getWmtsLayers : function() { return this.wmtsLayers; },
    getTileMatrixSets : function() { return this.tileMatrixSets; }
});


/* Helper */
function getFirstNamedNodeFromChildren(name, node) {
    var children = node.childNodes;
    if (!children) return null;
    for (var i = 0; i < children.length; i++) {
        var child = children.item(i);
        if (!child) { continue; }
        var childName = children.item(i).nodeName;
        if (!childName) { continue; }                   
        if (childName === name || childName === name.toLowerCase()) {
            return child;
        }
    }
    return null;
}

/**
 * CapabilitiesService
 */
Oskari.clazz.define('Oskari.mapframework.service.CapabilitiesService', 
                    function() {
}, {
    __qname : 'Oskari.mapframework.service.CapabilitiesService',
    getQName : function() { return this.__qname; },
    __name : 'CapabilitiesService',
    getName : function() { return this.__name; },
    getWmtsContents : function(url, contentCallback) {
        var qIdx = url.indexOf('?');
        if(qIdx < 0) { url += '?'; }
        qIdx = url.indexOf('?');
        if (qIdx == url.length - 1) {
            url += "service=WMTS" + "&request=GetCapabilities" + "&version=1.0.0";
        }
        var conn = new Ext.data.Connection;
        conn.request({
            url : url,
            callback : function(options, success, response) {
                var contents = null;
                var dom = parseDomFromString(response.responseText);
                var capabilitiesNode = getFirstNamedNodeFromChildren('Capabilities', dom);
                var contentsNode = null;
                if (capabilitiesNode) {
                    contentsNode = getFirstNamedNodeFromChildren('Contents', capabilitiesNode);
                }
                if (contentsNode) {
                    contents = 
                        Oskari.clazz.create('Oskari.mapframework.capabilities.WmtsContents',
                                            contentsNode);
                }            
                contentCallback(contents);
            }
        });
    }
});
