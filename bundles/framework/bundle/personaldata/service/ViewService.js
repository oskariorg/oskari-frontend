/**
 * @class Oskari.mapframework.bundle.personaldata.service.ViewService
 *
 * Requests for a search to be made with the given query and provides
 * callbacks
 */
Oskari.clazz.define('Oskari.mapframework.bundle.personaldata.service.ViewService',

/**
 * @method create called automatically on construction
 * @static
 *
 * @param {String}
 *            viewUrl ajax URLfor view AJAX-operations
 */
function(viewUrl) {
    this._viewUrl = viewUrl;
}, {
    /** @static @property __qname fully qualified name for service */
    __qname : "Oskari.mapframework.bundle.personaldata.service.ViewService",
    /**
     * @method getQName
     * @return {String} fully qualified name for service
     */
    getQName : function() {
        return this.__qname;
    },
    /** @static @property __name service name */
    __name : "ViewService",
    /**
     * @method getName
     * @return {String} service name
     */
    getName : function() {
        return this.__name;
    },
    /**
     * @method loadViews
     * Makes the actual ajax call to view service implementation
     * @param {String}
     *            type view type [USER | PUBLISHED]
     * @param {Function}
     *            callback callback method called when operation completes. The
     * function will receive boolean value as parameter indicating success(true)
     * or error(false). IF success, second parameter has the response.
     */
    loadViews : function(type, callback) {
        var me = this;
        if(!type) {
            type = 'USER';
        }

        jQuery.ajax({
            url : me._viewUrl + 'action_route=GetViews',
            data : {
                viewType : type
            },
            type : 'POST',
            dataType : "json",
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(response) {
                callback(true, response);
            },
            error : function() {
                callback(false);
            }
        });
    },
    /**
     * @method deleteView
     * Makes the actual ajax call to view service implementation
     * @param {Object}
     *            view object presenting a view
     * @param {Function}
     *            callback callback method called when operation completes. The
     * function will receive boolean value as parameter indicating success(true)
     * or error(false)
     */
    deleteView : function(view, callback) {
        var me = this;

        jQuery.ajax({
            url : me._viewUrl + 'action_route=DeleteView',
            data : {
                id : view.id
            },
            type : 'POST',
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(response) {
                callback(true);
            },
            error : function() {
                callback(false);
            }
        });
    },

    /**
     * @method makeViewPublic
     * Makes the actual ajax call to view service implementation
     * @param {Number}
     *            if view id
     * @param {Boolean}
     *            isPublic true to make view public, false to make view private
     * @param {Function}
     *            callback callback method called when operation completes. The
     * function will receive boolean value as parameter indicating success(true)
     * or error(false)
     */
    makeViewPublic : function(id, isPublic, callback) {
        var me = this;

        jQuery.ajax({
            url : me._viewUrl + 'action_route=AdjustViewAccess',
            data : {
                id : id,
                isPublic : isPublic
            },
            type : 'POST',
            dataType : 'json',
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(response) {
                callback(true);
            },
            error : function() {
                callback(false);
            }
        });
    },
    /**
     * @method renameView
     * Makes the actual ajax call to view service implementation
     * @param {Number}
     *            if view id
     * @param {String}
     *            name new name for the view
     * @param {Function}
     *            callback callback method called when operation completes. The
     * function will receive boolean value as parameter indicating success(true)
     * or error(false)
     */
    renameView : function(id, name, callback) {
        var me = this;

        jQuery.ajax({
            url : me._viewUrl + 'action_route=RenameView',
            type : 'POST',
            data : {
                id : id,
                newName : name
            },
            dataType : 'json',
            beforeSend : function(x) {
                if (x && x.overrideMimeType) {
                    x.overrideMimeType("application/j-son;charset=UTF-8");
                }
            },
            success : function(response) {
                callback(true);
            },
            error : function() {
                callback(false);
            }
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