/**
 * @class Oskari.mapframework.bundle.analyse.view.PersonalDataTab
 * Renders the analysis tab content to be shown in "personal data" bundle.
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
    
    this.linkTemplate = jQuery('<a href="JavaScript:void(0);"></a>');
}, {
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
            var link = me.linkTemplate.clone();
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
            var link = me.linkTemplate.clone();
            var layer = data.layer;
            link.append(name);
            link.bind('click', function() {
                // delete analysis layer
                me._deleteAnalysis(data);
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

        this.container = jQuery('<div></div>');
        // populate initial grid content
        this.update();
    	return this.container;
    },
    /**
     * Updates the tab content with current analysis layers listing
     * @method redraw
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
     * @method _deleteAnalysis
     * Confirms delete for given place and deletes it if confirmed. Also shows 
     * notification about cancel, deleted or error on delete. 
     * @param {Object} data grid data object for place
     * @private
     */
    _deleteAnalysis : function(data) {
    	var me = this;
    	var sandbox = this.instance.sandbox;
        //var loc = this.loc.notification['delete'];
    	var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
    	var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
    	okBtn.setTitle(this.loc.buttons['delete']);
    	okBtn.addClass('primary');
    	var service = sandbox.getService('Oskari.mapframework.service.MapLayerService');

    	okBtn.setHandler(function() {
        	// TODO: shouldn't maplayerservice send removelayer request by default on remove layer?!?!?
        	var removeMLrequestBuilder = sandbox.getRequestBuilder('RemoveMapLayerRequest');
	        var request = removeMLrequestBuilder(data.layer.getId());
	        sandbox.request(me.instance, request);
            // TODO: call server to delete analysis
        	service.removeLayer(data.layer.getId());
			dialog.close();
    	});
    	var cancelBtn = dialog.createCloseButton(this.loc.buttons.cancel);
        var confirmMsg = this.loc.confirmDeleteMsg + '"' + data.name + '"' + '?';
    	dialog.show(this.loc.title, confirmMsg, [cancelBtn, okBtn]);
    	dialog.makeModal();
    }
});
