/**
 * @class Oskari.mapframework.bundle.myplacesimport.UserLayersTab
 */
Oskari.clazz.define('Oskari.lupapiste.bundle.shpimport.UserLayersTab',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.mapframework.bundle.myplacesimport.MyPlacesImportBundleInstance} instance
     *      reference to the myplacesimport instance
     * @param {Object} localization
     *      instance's localization
     */
    function(instance, localization) {
        this.instance = instance;
        this.loc = localization;
        this.layerMetaType = 'USERLAYER';
        this.visibleFields = [
            'name', 'description', 'source', 'filename'
        ];
        this.grid = undefined;
        this.container = undefined;
        this.data = [];
        this.nextId = 1;

        // templates
        this.template = {};
        for (p in this.__templates) {
            if (this.__templates.hasOwnProperty(p)) {
                this.template[p] = jQuery(this.__templates[p]);
            }
        }
    }, {
    __templates: {
        "main": '<div class="oskari-user-layers-tab"></div>',
        "link": '<a href="JavaScript:void(0);"></a>'
    },
    /**
     * Returns reference to a container that should be shown in personal data
     * 
     * @method getContent
     * @return {jQuery} container reference
     */
    getContent: function () {
        var me = this;
        var sandbox = me.instance.getSandbox();
        var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
        //var addMLrequestBuilder = sandbox.getRequestBuilder('AddMapLayerRequest');

        grid.setVisibleFields(this.visibleFields);
        // set up the link from name field
//        grid.setColumnValueRenderer('name', function (name, data) {
//            var link = me.template.link.clone();
//
//            link.append(name).bind('click', function () {
//                // add myplacesimport layer to map on name click
//                var request = addMLrequestBuilder(data.id, false, data.isBase);
//                sandbox.request(me.instance, request);
//                return false;
//            });
//            return link;
//        });
        // setup localization
        _.each(this.visibleFields, function(field) {
            grid.setColumnUIName(field, me.loc.grid[field]);
        });

        this.container = this.template.main.clone();
        this.grid = grid;
        // populate initial grid content
        this.refresh();
        return this.container;
    },
    addRow: function (features, values) {
        values.id = this.nextId;
        this.nextId++;
        this.data.push(values);
    },
    refresh: function() {
        this.container.empty();
        this.grid.setDataModel(this._getGridModel());
        this.grid.renderTo(this.container);
    },
    /**
     * Renders current user layers to a grid model and returns it.
     * 
     * @method _getGridModel
     * @private
     * @param {jQuery} container
     */
    _getGridModel: function (container) {
        var gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');

        gridModel.setIdField('id');

        _.each(this.data, function(data) {
            gridModel.addData({
                'id': data.id,
                'name': data.name,
                'description': data.desc,
                'source': data.source,
                'filename': data.filename,
                'isBase': true
            });
        });

        return gridModel;
    }
});