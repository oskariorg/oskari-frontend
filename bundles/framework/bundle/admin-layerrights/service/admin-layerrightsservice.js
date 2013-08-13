/**
 * @class Oskari.framework.bundle.admin-layerrights.service.AdminLayerRightsService
 *
 * All of the AJAX stuff for layer rights management
 */
Oskari.clazz.define('Oskari.framework.bundle.admin-layerrights.service.AdminLayerRightsService', 

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            searchUrl ajax URL to actual search implementation
 */
function(searchUrl) {

    /* searchUrl url that will give us results */
    this._searchUrl = searchUrl;
}, {
    /** @static @property __qname fully qualified name for service */
    __qname : "Oskari.framework.bundle.admin-layerrights.service.AdminLayerRightsService",
    /**
     * @method getQName
     * @return {String} fully qualified name for service
     */
    getQName : function() {
        return this.__qname;
    },
    /** @static @property __name service name */
    __name : "AdminLayerRightsService",
    /**
     * @method getName
     * @return {String} service name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method getRoles
     * 
     * Makes the actual ajax call to search service implementation
	 * @param {String}
	 *            b USER/ROLE
	 * @param {Function}
	 *            onSuccess callback method for successful search 
     */
    getRoles : function getExternalIdsAjaxRequest(idType, a) {
    ajaxRequestGoing = true;
    jQuery.getJSON(ajaxUrl, {
        cmd: "ajax.jsp",
        getExternalIds: idType
    }, function (result) {
        makeExternalIdsSelect(result, idType, a)
    })
}
    }
}, {
    /**
     * @property {String[]} protocol array of superclasses as {String}
     * @static
     */
    'protocol' : ['Oskari.framework.service.Service']
});

/* Inheritance */