
/**
 * @class Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequest
 * 
 * A Class that may be used as a request to show metadata for the given
 * metadata uuid or RS_Identifier Code / RS_Identifier CodeSpace
 *   
 */
Oskari.clazz
        .define(
                'Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequest',
                function(config) {
                    this._creator = null;
                    
					this._uuid = config.uuid;
					this._RS_Identifier_Code = config._RS_Identifier_Code;
					this._RS_Identifier_CodeSpace = config._RS_Identifier_CodeSpace;
                    
                    
                }, {
                    __name : "catalogue.ShowMetadataRequest",
                    getName : function() {
                        return this.__name;
                    },

                    getUuid : function() {
                        return this._uuid;
                    },
                    
                    getRS_Identifier_Code : function() {
                        return this._RS_Identifier_Code;
                    },
                    getRS_Identifier_CodeSpace : function() {
                        return this._RS_Identifier_CodeSpace;
                    }
                },
                
                
                {
                    'protocol' : ['Oskari.mapframework.request.Request']
                });

/* Inheritance */
