/**
 * @class Oskari.mapframework.bundle.metadatacatalogue.service.SearchService
 *
 * Requests for a metadata catalogue search to be made with the given query and provides
 * callbacks
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadatacatalogue.service.MetadataSearchService',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            searchUrl ajax URL to actual metadata catalogue search implementation
 */
function(searchUrl) {

    /* searchUrl url that will give us results */
    this._searchUrl = searchUrl;
}, {
    /** @static @property __qname fully qualified name for service */
    __qname : "Oskari.catalogue.bundle.metadatacatalogue.service.MetadataSearchService",
    /**
     * @method getQName
     * @return {String} fully qualified name for service
     */
    getQName : function() {
        return this.__qname;
    },
    /** @static @property __name service name */
    __name : "SearchService",
    /**
     * @method getName
     * @return {String} service name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method doSearch
     * 
     * Makes the actual ajax call to search service implementation
	 * @param {String}
	 *            searchString the query to search with
	 * @param {Function}
	 *            onSuccess callback method for successful search 
	 * @param {Function}
	 *            onComplete callback method for search completion
     */
    doSearch : function(search, onSuccess, onError) {
        var lang = Oskari.getLang();
        var epsg = Oskari.getSandbox().getMap().getSrsName();
        jQuery.ajax({
            dataType : "json",
            type : "POST",
            beforeSend: function(x) {
              if(x && x.overrideMimeType) {
               x.overrideMimeType("application/json");
              }
             },
            url : this._searchUrl,
            data : search,
            error : onError,
            success : onSuccess
        });
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.mapframework.service.Service']
});

/* Inheritance */