/**
 * @class Oskari.mapframework.bundle.analyse.view.PersonalDataTab
 * Renders the analysis tab content to be shown in "personal data" bundle.
 * Also handles the delete functionality it provides in the UI.
 */
Oskari.clazz.define('Oskari.mapframework.bundle.analyse.view.PersonalDataTab',

/**
 * @method create called automatically on construction
 * @static
 * @param {Oskari.analysis.bundle.analyse.AnalyseBundleInstance}
 * instance
 * 		reference to component that created the tile
 */
function(instance, localization) {
    this.instance = instance;
    this.loc = localization;
    this.grid = undefined;
    this.container = undefined;
    
    /* templates */
    this.template = {};
    for (var p in this.__templates ) {
        this.template[p] = jQuery(this.__templates[p]);
    }
}, {
    __templates : {
        "main" : '<div class="oskari-analysis-listing-tab"></div>',
        "link" : '<a href="JavaScript:void(0);"></a>'
    },
    /**
     * Returns reference to a container that should be shown in personal data
     * @method getContent
     * @return {jQuery} container reference
     */
    getContent : function() {
        if(this.container) {
            return this.container;
        }
        // construct it
        var me = this;
        var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
        this.grid = grid;
        var sandbox = me.instance.sandbox;
        
        var addMLrequestBuilder = sandbox.getRequestBuilder('AddMapLayerRequest');
        var visibleFields = ['name', 'delete'];
        grid.setVisibleFields(visibleFields);
        // set up the link from name field
        var nameRenderer = function(name, data) {
            var link = me.template['link'].clone();
            var layer = data.layer;
            
            link.append(name);
            link.bind('click', function() {
                // add analysis layer to map on name click
                var request = addMLrequestBuilder(layer.getId(), false, layer.isBaseLayer());
                sandbox.request(me.instance, request);
                return false;
            });
            return link;
        };
        grid.setColumnValueRenderer('name', nameRenderer);
        // set up the link from edit field
        var deleteRenderer = function(name, data) {
            var link = me.template['link'].clone();
            var layer = data.layer;
            link.append(name);
            link.bind('click', function() {
                // delete analysis layer
                me._confirmDeleteAnalysis(data);
                return false;
            });
            return link;
        };
        grid.setColumnValueRenderer('delete', deleteRenderer);

        // setup localization
        for(var i=0; i < visibleFields.length; ++i) {
            var key = visibleFields[i];
            grid.setColumnUIName(key, this.loc.grid[key]);
        }

        this.container = this.template['main'].clone();
        // populate initial grid content
        this.update();
    	return this.container;
    },
    /**
     * Updates the tab content with current analysis layers listing
     * @method update
     */
    update : function() {
        var service = this.instance.sandbox.getService('Oskari.mapframework.service.MapLayerService');
        var layers = service.getAllLayersByMetaType("ANALYSIS");

        var gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
        gridModel.setIdField('id');
        
        for(var i = 0; i < layers.length; ++i) {
            gridModel.addData({
                'id': layers[i].getId(),
                'name' : layers[i].getName(),
                'layer' : layers[i],
                'delete' : this.loc.buttons['delete']
            });
        }
        this.grid.setDataModel(gridModel);
        this.container.empty();
        this.grid.renderTo(this.container);
    },
    /**
     * Confirms delete for given place and deletes it if confirmed. Also shows 
     * notification about cancel, deleted or error on delete. 
     * @method _confirmDeleteAnalysis
     * @param {Object} data grid data object for place
     * @private
     */
    _confirmDeleteAnalysis : function(data) {
    	var me = this;
        //var loc = this.loc.notification['delete'];
    	var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    	var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
    	okBtn.setTitle(this.loc.buttons['delete']);
    	okBtn.addClass('primary');

    	okBtn.setHandler(function() {
            me._deleteAnalysis(data.layer);
            dialog.close();
    	});
    	var cancelBtn = dialog.createCloseButton(this.loc.buttons.cancel);
        var confirmMsg = this.loc.confirmDeleteMsg + '"' + data.name + '"' + '?';
    	dialog.show(this.loc.title, confirmMsg, [cancelBtn, okBtn]);
    	dialog.makeModal();
    },
    /**
     * @method _deleteAnalysis
     * Request backend to delete analysis data for the layer. On success removes the layer 
     * from map and layerservice. On failure displays a notification.
     * @param {Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer} layer analysis data to be destroyed
     * @private
     */
    _deleteAnalysis : function(layer) {

        var me = this;
        var sandbox = this.instance.sandbox;

        // parse actual id from layer id
        var tokenIndex = layer.getId().lastIndexOf("_") + 1;
        var idParam = layer.getId().substring(tokenIndex); 

        jQuery.ajax({
            url : sandbox.getAjaxUrl(),
            data : {
                action_route : 'DeleteAnalysisData',
                id : idParam
            },
            type : 'POST',
            success : function(response) {
                if(response && response.result === 'success') {
                    me._deleteSuccess(layer);
                }
                else {
                    me._deleteFailure();
                }
            },
            error : function() {
                    me._deleteFailure();
            }
        });

    },
    /**
     * Success callback for backend operation.
     * @method _deleteSuccess
     * @param {Oskari.mapframework.bundle.mapanalysis.domain.AnalysisLayer} layer layer that was removed
     * @private
     */
    _deleteSuccess : function(layer) {
        var sandbox = this.instance.sandbox;
        var service = sandbox.getService('Oskari.mapframework.service.MapLayerService');
        // TODO: shouldn't maplayerservice send removelayer request by default on remove layer?
        // also we need to do it before service.remove() to avoid problems on other components
        var removeMLrequestBuilder = sandbox.getRequestBuilder('RemoveMapLayerRequest');
        var request = removeMLrequestBuilder(layer.getId());
        sandbox.request(this.instance, request);
        service.removeLayer(layer.getId());
        // show msg to user about successful removal
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        dialog.show(this.loc.notification.deletedTitle, this.loc.notification.deletedMsg);
    },
    /**
     * Failure callback for backend operation.
     * @method _deleteFailure
     * @private
     */
    _deleteFailure : function() {
        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
        var okBtn = dialog.createCloseButton(this.loc.buttons.ok);
        dialog.show(this.loc.error.title, this.loc.error.generic , [okBtn]);
    }
});
