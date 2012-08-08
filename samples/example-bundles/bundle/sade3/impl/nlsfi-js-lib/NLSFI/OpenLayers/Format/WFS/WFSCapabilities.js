/**

        /LICENSE


	WFSCapabilities
	
	lukee namespaces sisältävät WFS GetCapabilityt
	
	Kerätään rakenne, joka mukailee WFS_Capabilities rakennetta
	ja käsitteitä.
	
        Tuetaan taaksepäin yhteensopivasti OpenLayersin
        oletus WFSCapabilities Formaatin palauttamaa rakennetta.

        Tämä lukee myös osan ows formaatista ja ymmärtää nimiavaruudet
        toisin kuin OpenLayers oletustoteutus.
	
	
	Toimii myös IE6,7,8 kun vähennettiin rekursiota XML tulkitsemisessa.
	
	
**/

Oskari
		.$('Oskari.NLSFI.OpenLayers.Format.WFS.WFSCapabilities',OpenLayers.Class(OpenLayers.Format.XML, {
    
    statsFunc: null,
    
    /**
     * Property: namespaces
     * {Object} Mapping of namespace aliases to namespace URIs.
     */
    namespaces: {
        gml: "http://www.opengis.net/gml",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
        wfs: "http://www.opengis.net/wfs", // this is a convenience for reading wfs:FeatureCollection
        ogc: "http://www.opengis.net/ogc",
        xlink: "http://www.w3.org/1999/xlink",
        ows: "http://www.opengis.net/ows"
    },
    
    /**
     * Property: defaultPrefix
     */
    defaultPrefix: "wfs",
    
	 regExes: {
        trimSpace: (/^\s*|\s*$/g),
        removeSpace: (/\s*/g),
        splitSpace: (/\s+/),
        trimComma: (/\s*,\s*/g)
    },
    
    /**
     * Method: getChildValue
     *
     * Parameters:
     * node - {DOMElement}
     * nsuri - {String} Child node namespace uri ("*" for any).
     * name - {String} Child node name.
     * def - {String} Optional string default to return if no child found.
     *
     * Returns:
     * {String} The value of the first child with the given tag name.  Returns
     *     default value or empty string if none found.
     */
    getChildValue: function(node, nsuri, name, def) {
        var value;
        var eles = this.getElementsByTagNameNS(node, nsuri, name);
        if(eles && eles[0] && eles[0].firstChild
            && eles[0].firstChild.nodeValue) {
            value = eles[0].firstChild.nodeValue;
        } else {
            value = (def == undefined) ? "" : def;
        }
        return value;
    },
    
    getChildValueAsString: function(node, def) {
        var value = def || "";
        if(node) {
            for(var child=node.firstChild; child; child=child.nextSibling) {
                switch(child.nodeType) {
                    case 3: // text node
                    case 4: // cdata section
                        value += child.nodeValue;
                }
            }
        }
        return value;
    },
    

    /**
    */
    initialize: function(options) {
        OpenLayers.Format.XML.prototype.initialize.apply(this, [options]);

        
    },    
  

    /*
     * Method: read
     *
     * Parameters:
     * data - {DOMElement}
     *
     * Returns:
     * {Array(<OpenLayers.Feature.Vector>)} An array of features.
     */
    read: function(data) {
    
        if(typeof data == "string") { 
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        if(data && data.nodeType == 9) {
            data = data.documentElement;
        }
        var result = {capabilities:null};
        this.readNode(data, result);     
        return result.capabilities;
    },    
    
	readNode: function(node,obj) {
		
        var local = node.localName || node.nodeName.split(":").pop();		
        
		if( this.statsFunc ) 
			this.statsFunc(local);

		// alotta garbaccio 
	    if(!obj) 
            obj = {};

        var group = this.readers[node.namespaceURI ? 
        	this.namespaceAlias[node.namespaceURI]: this.defaultPrefix];
        if(!group) 
        	return obj;

		var reader = group[local] || group["*"];
        if(!reader) 
        	return obj;
 		
 		reader.apply(this, [node, obj]);

        return obj;
	
	},
	
	readChildNodes: function(node, obj) {
        if(!obj) {
            obj = {};
        }
        var children = node.childNodes;
        var child;
        for(var i=0, len=children.length; i<len; ++i) {
            child = children[i];
            if(child.nodeType != 1) 
            	continue;

	        var group = this.readers[child.namespaceURI ? 
	        	this.namespaceAlias[child.namespaceURI]: this.defaultPrefix];
	        
		    if(!group) 
		    	continue;
		        
	        var local = child.localName || child.nodeName.split(":").pop();		
        	var reader = group[local] || group["*"];
		    if(!reader) 
		    	continue;

            reader.apply(this, [child, obj]);
        }

        return obj;
    },	
    
       /**
     * Property: readers
     * Contains public functions, grouped by namespace prefix, that will
     *     be applied when a namespaced node is found matching the function
     *     name.  The function will be applied in the scope of this parser
     *     with two arguments: the node being read and a context object passed
     *     from the parent.
     */
    readers: {
    	"ows": {
        	// SHOULD GENERATE THIS FROM SCHEMA...
        	    	
        	"*": function(node,obj) {
        		this.readChildNodes(node, obj);
        	},
    	
    		"ServiceProvider": function(node, obj) {    	
    			var providerName = this.getChildValue(node,this.namespaces.ows,"ProviderName",null);
    			var elProviderSite  = this.getChildValue(node,this.namespaces.ows,"ProviderSite",null);  
    			var ProviderSiteHRef = elProviderSite ? 
    				 this.getAttributeNS(elProviderSite, this.namespaces.xlink,"href"): null;
    			var ProviderSiteLinkType = elProviderSite ? 
    				 this.getAttributeNS(elProviderSite, this.namespaces.xlink,"type"): null;
    				
    			if( !obj.ows ) 
    				obj.ows = {};
    				
    			obj.ows['ServiceProvider'] = {    			
    				'ProviderName': providerName,
    				'ProviderSite': { 
	    				linkHref: ProviderSiteHRef,
    					linkType: ProviderSiteLinkType
    				}
    			};
    		},
    		
    		
    		// ServiceIdentification
    		"ServiceIdentification": function(node, obj) {

    			var serviceTitle = this.getChildValue(node,this.namespaces.ows,"Title",null);
    			var serviceAbstract = this.getChildValue(node,this.namespaces.ows,"Abstract",null);  
    				
    			if( !obj.ows ) 
    				obj.ows = {};
    				
    			obj.ows['ServiceIdentification'] = {
    				"Title": serviceTitle,
    				"Abstract": serviceAbstract
				};  			
    		},
    		"OperationsMetadata": function(node,obj) {
    		
    		//	<ows:OperationsMetadata xmlns:ows="http://www.opengis.net/ows">
    		},
    		"Operation": function(node,obj) {
    		},
    		"DCP": function(node,obj) {
    		
    		},
    		"Get": function(node,obj) {
    		},
    		"Post": function(node,obj) {
    		
    		},
    		"Parameter": function(node,obj) {

    		},
    		"Value": function(node,obj) {
    		},
    		"Constraint": function(node,obj) {
    		
    		}
    	},
        "gml": OpenLayers.Format.GML.v3.prototype.readers["gml"],
        "wfs": {
        	// SHOULD GENERATE THIS FROM SCHEMA...
        	        
        	"*": function(node,obj) {
        		this.readChildNodes(node, obj);
        	},
            "WFS_Capabilities": function(node, obj) {
            	var capabilities = {};
            	
            	// luetaan jotain tietoja
            	var version = node.getAttribute("version");
            	var updateSequence = node.getAttribute("updateSequence");            	
            	
            	capabilities.version = version;
            	capabilities.updateSequence = updateSequence;
            
                this.readChildNodes(node, capabilities);
                
                obj.capabilities = capabilities;
            },
            
            "FeatureTypeList": function(node,obj) {
            	var featureTypeList = {
	            	 featureTypes: []
            	};
            	
                this.readChildNodes(node, featureTypeList);
                
                obj.featureTypeList = featureTypeList;                
            },
            "FeatureType": function(node,obj) {
            
            	var featureTypes = obj.featureTypes;
            	var wfsNs = this.namespaces.wfs;
            	var featureTypeName = this.getChildValue(node,wfsNs,"Name");
            	var featureTypeTitle = this.getChildValue(node,wfsNs,"Title");
            	var featureTypeAbstract = this.getChildValue(node,wfsNs,"Abstract");
            	var defaultSRS = this.getChildValue(node,wfsNs,"DefaultSRS");
            	
            	
            	var parts = featureTypeName.split(":");

				var featureName = parts[1];
                var featurePrefix = parts[0];
                var featureNS = this.lookupNamespaceURI(node,featurePrefix);
           	           	
            	// wfs:otherSRS
            	// ows:KeyWords/ows:Keyword
            	// wfs:outputFormats/wfs:Format

            	var featureType = {

            		// from Schema
            		'Name': featureTypeName,
					'Title': featureTypeTitle,            		            		
					'DefaultSRS': defaultSRS,

					// Backwards compatibility
            		'name': featureTypeName,
            		'title': featureTypeTitle,
            		'abstract': featureTypeAbstract,

            		// Extensions
            		'featureTypeName': featureTypeName,
            		'featureName': featureName,    		
            		'featurePrefix': featurePrefix,            		
            		'featureNS': featureNS         		            		
            	};
            	
            	featureTypes.push(featureType);
            }
            
        },
        "ogc": {
        	// SHOULD GENERATE THIS FROM SCHEMA...
        	
        	"Id_Capabilities": function(node,obj) {

        	},
        	"Spatial_Capabilities": function(node,obj) {
        		var spatialCapabilities = {};        		
        		this.readChildNodes(node, spatialCapabilities);
        		obj['Spatial_Capabilities'] = spatialCapabilities;
        	},        	
        	"GeometryOperands": function(node,obj) {
				var geometryOperands = {};        		
				// NOP
        		obj['GeometryOperands'] = geometryOperands;        	        	
        	},
        	"SpatialOperator": function(node,obj) {
       	
            	var operatorName = node.getAttribute("name");            
        		// OpenLayers.Filter.Spatial on vähän kehno...
        		// Sieltä puuttuu suurin osa toiminnoista ja
        		// loputkaan ei toimi..., joten pitää miettiä
        		// mitä tässä oikein laitetaan talteen
        		// periaatteessa vois laittaa talteen jonkun luokan
        		// jonka vois instansoida, mutta ei se tuollaisena
        		// toimi nyt
        		obj[operatorName] = operatorName;        		
        	},        	
        	"SpatialOperators": function(node,obj) {
				var spatialOperators = {};        		
        		this.readChildNodes(node, spatialOperators);
        		obj['SpatialOperators'] = spatialOperators;        	
        	
        	},
        	"Filter_Capabilities": function(node,obj) {        	
        		var filterCapabilities = {};      		
        		this.readChildNodes(node, filterCapabilities);       		        		
        		
        		
        		if( !obj.ogc )
        			obj.ogc = {};
        		
        		obj.ogc['Filter_Capabilities'] = filterCapabilities;
        		
                /*  WORK IN PROGRESS
        	
        	<ogc:Filter_Capabilities>
- <ogc:Spatial_Capabilities>
- <ogc:GeometryOperands>
  <ogc:GeometryOperand>gml:Envelope</ogc:GeometryOperand> 
  <ogc:GeometryOperand>gml:Point</ogc:GeometryOperand> 
  <ogc:GeometryOperand>gml:LineString</ogc:GeometryOperand> 
  <ogc:GeometryOperand>gml:Polygon</ogc:GeometryOperand> 
  </ogc:GeometryOperands>
- <ogc:SpatialOperators>
  <ogc:SpatialOperator name="Within" /> 
  <ogc:SpatialOperator name="Intersects" /> 
  <ogc:SpatialOperator name="Overlaps" /> 
  <ogc:SpatialOperator name="BBOX" /> 
  <ogc:SpatialOperator name="DWithin" /> 
  <ogc:SpatialOperator name="Contains" /> 
  <ogc:SpatialOperator name="Equals" /> 
  <ogc:SpatialOperator name="Touches" /> 
  </ogc:SpatialOperators>
  </ogc:Spatial_Capabilities>
- <ogc:Scalar_Capabilities>
- <ogc:ComparisonOperators>
  <ogc:ComparisonOperator>EqualTo</ogc:ComparisonOperator> 
  </ogc:ComparisonOperators>
- <ogc:ArithmeticOperators>
  <ogc:SimpleArithmetic /> 
  </ogc:ArithmeticOperators>
  </ogc:Scalar_Capabilities>
- <ogc:Id_Capabilities>
  <ogc:EID /> 
  <ogc:FID /> 
  </ogc:Id_Capabilities>
  </ogc:Filter_Capabilities>
        	
        	*/
        	
        	
        	
        	
        	},
            "*": function(node, obj) {
                this.readChildNodes(node, obj);
            }
        }
    },
    
    CLASS_NAME: "NLSFI.OpenLayers.Format.WFS.WFSCapabilities"
}));
