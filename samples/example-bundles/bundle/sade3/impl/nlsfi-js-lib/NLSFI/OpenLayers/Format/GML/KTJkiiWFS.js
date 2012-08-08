/**
	
	2009-09 janne.korhonen<at>maanmittauslaitos.fi
	
	\LICENSE
	
	Class: NLSFI.OpenLayers.Format.GML.KTJkiiWFS

	Tämä luokka käsittelee WFS palvelun vastauksen.
	
	- Kiertää OpenLayers boundedBy projektiomuunnottomuus bugin
	- Lisää OpenLayersiin puuttuvan Arc käsittelyn, joka
		toteutetaan ensin Deegreen puuttuvan Arc käsittelyn vuoksi
			ns. proprietary extensiona eli hakkeroidaan
			
	TILAPÄINEN!		
	
	TÄMÄ KIERTÄÄ BUGIA 
	
**/

 // TEMP tän voi varmaan lopulta poistaa koko luokan
 // TEMP muuttuja tämä voi laittaa namespacesiin kohta
 var ktjkiiWfsNs = "http://xml.nls.fi/ktjkiiwfs/2010/02";
 var ktjkiiWfsNsPrefix = "ktjkiiwfs";
 
 

 Oskari
	.$('Oskari.NLSFI.OpenLayers.Format.GML.KTJkiiWFS', OpenLayers.Class(OpenLayers.Format.GML.v3, 
 {
 	arcInterPoints: null,
 	alerted: true, // let's not
 	
 	stats: {},
 	
 	featureTypeSchema: null,
 	otherFeatureTypes: null,
 	knownFeatureTypes: {},
 	
    namespaces : {
        gml: "http://www.opengis.net/gml",
        xlink: "http://www.w3.org/1999/xlink",
        xsi: "http://www.w3.org/2001/XMLSchema-instance",
	    wfs: "http://www.opengis.net/wfs" 
    },

    initialize: function(options) {
        OpenLayers.Format.GML.v3.prototype.initialize.apply(this, [options]);
		
	  this.singleFeatureType = false;

	  this.namespaces[ktjkiiWfsNsPrefix] = ktjkiiWfsNs;
	  this.namespaceAlias[ktjkiiWfsNs] = ktjkiiWfsNsPrefix;
	  
	  //this.setNamespace("feature", ktjkiiWfsNs)
	  this.arcInterPoints = new (Oskari.$('Oskari.NLSFI.OpenLayers.Format.GML.ArcInterPoints'))();
	  
	  this.featureTypeSchema = options.featureTypeSchema;
	  this.otherFeatureTypes = options.otherFeatureTypes;
	  
	  if( this.featureTypeSchema != null )
		  this.knownFeatureTypes[this.featureTypeSchema.typeName] = this.featureTypeSchema;
	  if(	  this.otherFeatureTypes != null ) { 
		  for( var n = 0 ; n < 	  this.otherFeatureTypes.length ; n++ ) {
		  	 var ftSchema = this.otherFeatureTypes[n] ;
		  	 this.knownFeatureTypes[ftSchema.typeName] = ftSchema;
		  }
	  }
	  /*
	  var msg = "";
	  for( p in this.knownFeatureTypes ) {
	  	msg += p + " = "+this.knownFeatureTypes[p]+"\n";
	  }
	  window.alert(msg);
	  */
	  
    }, 
    readers: {
        "gml": OpenLayers.Util.applyDefaults({
                
     	"Curve": function(node, container) {
                var obj = {points: []};
                
					
                this.readChildNodes(node, obj);
                if(!container.components) {
                    container.components = [];
                }	
				
				if( container.interpolate == "circularArc3Points" ) {
				    if( !this.alerted )  {
						this.alerted = true;
						window.alert(
						"OpenLayers 2.8 does not implement Curve Segment interpolation: "+container.interpolate);
					}
				
					// onkohan oikea, mutta kokeillaan
					
					// lasketaan pisteitä, jotta näyttää nätiltä
					// tarvittaisiin Weight tieto. ei jatketa tätä tän enempää
					var arcPoints = 
							obj.points; 
							//this.arcInterPoints.arcInterPointsFromPosList(obj.points );
					
					
	                container.components.push(
    	                new OpenLayers.Geometry.LineString(arcPoints)
                	);
				
				} else if( container.interpolate == "linear" ) {
	                container.components.push(
    	                new OpenLayers.Geometry.LineString(obj.points)
                	);
                }
         },
	      "*": function(node, obj) {
               this.readChildNodes(node, obj);
            }
        }, OpenLayers.Format.GML.v3.prototype.readers["gml"]),            
        "feature": OpenLayers.Format.GML.Base.prototype.readers["feature"],
        "wfs": OpenLayers.Util.applyDefaults({
            
/*            "*": function(node, obj) {
               this.readChildNodes(node, obj);
            }*/
        }, OpenLayers.Format.GML.v3.prototype.readers["wfs"]),
	  "ktjkiiwfs": {

	  		 
			
			"_feature": 
			function(node,obj) {
				 var container = {
                 	interpolate: "linear",
                 	components: [], 
                 	attributes: {},
                 	features: obj.features,
                 	featSchema: obj.featSchema,
                 	featType: obj.featType
                 	
                 	};            
                               
//                 this.readKnownProperties(node, container);
                 this.readChildNodes(node, container);

                 // look for common gml namespaced elements
                 if(container.name) {
                     container.attributes.name = container.name;
                 }
                 
                 container.attributes.featType = obj.featType;
                 
	             var feature = new OpenLayers.Feature.Vector(
                     container.components[0], container.attributes
                 );
                 if (!this.singleFeatureType) {
                     feature.type = node.nodeName.split(":").pop();
                     feature.namespace = node.namespaceURI;
                 }
                 
                 var fid = node.getAttribute("fid") ||
                     this.getAttributeNS(node, this.namespaces["gml"], "id");
                 if(fid) {
                     feature.fid = fid;
                 }

                 if(container.bounds && feature.geometry ) {
                     feature.geometry.bounds = container.bounds;
                 }

                 if(this.internalProjection && this.externalProjection && feature.geometry) {
                     feature.geometry.transform(
		                this.externalProjection, this.internalProjection
                     );
                 }
                 
                 if( feature.geometry ) {
                 var statsKey = "geometry";
                 if( this.stats[statsKey] == null )
						this.stats[statsKey] = 1;
				 else 
					this.stats[statsKey] += 1;
                 }
                 
                 obj.features.push(feature);
			},

            "*": function(node, obj) {
                      
 	            var local = node.localName || node.nodeName.split(":").pop();
 	            var ns = node.namespaceURI;
 	            
				if( ns == this.featureNS ) {
					if( this.stats[local] == null )
						this.stats[local] = 1;
					else
						this.stats[local] += 1;
				}
 	            
 	            if( ns == this.featureNS && local == this.featureType ) {
					obj.featType = local ;
 	            	obj.featSchema = this.knownFeatureTypes[local];
 	            	this.readers["ktjkiiwfs"]["_feature"].apply(this,[node,obj]);
 	            
 	            } else if( ns == this.featureNS && this.knownFeatureTypes[local] != null) {
 	            
 	            	var statsKey = "HACK_"+local;
 	            	if( this.stats[statsKey] == null )
						this.stats[statsKey] = 1;
					else
						this.stats[statsKey] += 1;

					obj.featType = local ;
 	            	obj.featSchema = this.knownFeatureTypes[local];
 	            	this.readers["ktjkiiwfs"]["_feature"].apply(this,[node,obj]);
 	            
 	            } else if( ns == this.featureNS && local == "RekisteriyksikonPalstanTietoja" ) {
 	            
 	            	var statsKey = "HACK_"+local;
 	            	if( this.stats[statsKey] == null )
						this.stats[statsKey] = 1;
					else
						this.stats[statsKey] += 1;
 	            
 	            	this.readers["ktjkiiwfs"]["_feature"].apply(this,[node,obj]);
 	            
 	            } else {
					 // Assume attribute elements have one child node and that the child
                    // is a text node.  Otherwise assume it is a geometry node.
                    if(node.childNodes.length == 0 ||
                       (node.childNodes.length == 1 && node.firstChild.nodeType == 3)) {
                        if(this.extractAttributes) {
    			            var value = this.getChildValue(node);
    			            if( obj.attributes != null )
	                			obj.attributes[local] = value;
                        }
                    } 	            
 	            }
        	  
	            this.readChildNodes(node, obj);
            }
        }

    },
    
    
/*    readKnownProperties: function(node,obj) {
    
    	var atts = obj.attributes ;
    	var featSchema = obj.featSchema;
    	
    	var featSchemaProps = featSchema.properties;
    	
    	for( var n = 0 ; n < featSchemaProps
   	
    
    },
*/

    // DEBUG ONLY
    readNode: function(node, obj) {
        if(!obj) {
            obj = {};
        }
	  var nsAlias = this.namespaceAlias[node.namespaceURI];
        var group = this.readers[nsAlias];

           var local = node.localName || node.nodeName.split(":").pop();
        if(group) {

            var reader = group[local] || group["*"];
            if(reader) {
                reader.apply(this, [node, obj]);
            }
        }
        return obj;
    },
	
    read:  function(data) {

        if(typeof data == "string") { 
            data = OpenLayers.Format.XML.prototype.read.apply(this, [data]);
        }
        if(data && data.nodeType == 9) {
            data = data.documentElement;
        }
        
        
        this.stats = {};
        
        var features = [];
        this.readNode(data, {features: features});
        if(features.length == 0) {
            // look for gml:featureMember elements
            var elements = this.getElementsByTagNameNS(
                data, this.namespaces.gml, "featureMember"
            );
            if(elements.length) {
                for(var i=0, len=elements.length; i<len; ++i) {
                    this.readNode(elements[i], {features: features});
                }
            } else {
                // look for gml:featureMembers elements (this is v3, but does no harm here)
                var elements = this.getElementsByTagNameNS(
                    data, this.namespaces.gml, "featureMembers"
                );
                if(elements.length) {
                    // there can be only one
                    this.readNode(elements[0], {features: features});
                }
            }
        }

        return features;
    },

    CLASS_NAME: "NLSFI.OpenLayers.Format.GML.KTJkiiWFS"


    
  }));





