/**
 * TabPanel that lists default views in the system and can be used to modify them.
 * @param  {Object} locale [description]
 * @param  {Oskari.admin.bundle.admin.GenericAdminBundleInstance} parent reference to instance to get sandbox etc
 */
Oskari.clazz.define('Oskari.admin.bundle.admin.DefaultViews', function(locale, parent) {
    this.instance = parent;
    this.locale = locale;
    this.setTitle(locale.title);
    this.setContent(this.createUI());
}, {
    templates: {
        'main': _.template('<div>${ msg }<div class="grid-placeholder"></div></div>'),
        'link': _.template('<a href="javascript:void(0);" onClick="return false;">${ msg }</a>'),
        'errorGuest' : _.template('<div>${listTitle}<ul>${list}</ul></div>'),
        'listItem': _.template('<li>${ msg }</li>')
    },
    /**
     * Create the UI for this tab panel
     * @return {jQuery} returns the created DOM
     */
    createUI: function() {
        var me = this,
            grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
        grid.setVisibleFields(['name', 'action']);
        grid.setColumnUIName('name', me.locale.headerName);
        grid.setColumnUIName('action', ' ');
        grid.setColumnValueRenderer('action', function(value, rowData) {
            var link = jQuery(me.templates.link({
                msg: value
            }));
            link.click(function() {
                me.__modifyView(rowData.id);
            });
            return link;
        });

        var content = jQuery(this.templates.main({
            msg: me.locale.desc
        }));
        // action_route=SystemViews
        this.getDefaultViews(function(data) {
            var model = me.__getGridModel(data);
            model.setIdField('id');
            grid.setDataModel(model);
            grid.renderTo(content.find('div.grid-placeholder'));
        });
        return content;
    },
    /**
     * Loads list of default views defined for Oskari instance and 
     * calls the given callback when finished.
     * @param  {Function} callback [description]
     */
    getDefaultViews: function(callback) {
        var me = this,
            sb = me.instance.getSandbox();

        jQuery.ajax({
            type: 'GET',
            dataType: 'json',
            data: {
                action_route: 'SystemViews'
            },
            url: sb.getAjaxUrl(),
            success: function(data) {
                callback(data);
            },
            error : function() {
                me.instance.showMessage(
                    me.locale.notifications.errorTitle, 
                    me.locale.notifications.errorLoadingFailed);
            }
        });
    },
    /**
     * Collects current map state and calls backend to update the given view 
     * with new location and default layers
     * @param  {String}  id     view id to update
     * @param  {Boolean} force  true to update even if server warns about layers
     */
    __modifyView: function(id, force) {
        var me = this,
            sb = me.instance.getSandbox();
        // setup route and location
        var selectedLayers = [];
        var data = {
            action_route: 'SystemViews',
            id: id,
            north: sb.getMap().getY(),
            east: sb.getMap().getX(),
            zoom: sb.getMap().getZoom(),
            srs : sb.getMap().getSrsName(),
            selectedLayers: '[]',
            force : !!force
        };
        // setup layers
        var layers = sb.findAllSelectedMapLayers();
        _.each(layers, function(layer) {
            // backend assumes id is in string format
            selectedLayers.push({ id : '' + layer.getId() });
        });
        // backend assumes selectedLayers is stringified JSON
        data.selectedLayers = JSON.stringify(selectedLayers);


        jQuery.ajax({
            type: 'POST',
            dataType: 'json',
            data: data,
            url: sb.getAjaxUrl(),
            success: function(response) {
                me.__viewSaved(id, response);
            },
            error : function(xhr) {
                me.__parseError(xhr, id);
            }
        });
    },
    __parseError: function(xhr, id) {
        var sb = this.instance.getSandbox();
        if(!xhr || !xhr.responseText) {
            this.__showGenericErrorSave(id);
            return;
        }
        try {
            var resp = JSON.parse(xhr.responseText);
            if(resp.error) {
                sb.printWarn(resp.error);
            }
            if(resp.info) {
                var code = resp.info.code;
                var handler = this.errorHandlers[code];
                if(handler) {
                    handler.apply(this, [resp.info, id]);
                    return;
                }
            }

        } catch(err) { }
        this.__showGenericErrorSave(id);
    },
    errorHandlers : {
        'guest_not_available' : function(data, id) {
            var me = this,
                sb = me.instance.getSandbox(),
                problemLayers = data.selectedLayers;
            if(problemLayers && problemLayers.length > 0) {
                // construct a list of problematic layers to show
                var list = [];
                _.each(problemLayers, function(layerId) {
                    var layer = sb.findMapLayerFromAllAvailable(layerId),
                        msg = 'Layer ID ' + layerId;
                    if(layer) {
                        msg = layer.getName(); 
                    }
                    list.push(me.templates.listItem({ msg : msg }));
                });

                var msg = this.templates.errorGuest( {
                    listTitle : this.locale.notifications.listTitle,
                    list : list.join(' ')
                });
                // buttons
                var okButton = Oskari.clazz.create('Oskari.userinterface.component.buttons.CancelButton');
                okButton.setPrimary(true);
                okButton.setHandler(function() {
                    me.instance.closeDialog();
                });
                var forceButton = Oskari.clazz.create('Oskari.userinterface.component.Button');
                forceButton.setTitle(this.locale.forceButton);
                forceButton.setHandler(function() {
                    me.__modifyView(id, true);
                    me.instance.closeDialog();
                });
                this.instance.showMessage(this.locale.notifications.warningTitle, msg, [okButton, forceButton]);
            }
        }
    },

    __showGenericErrorSave: function(id) {
        this.instance.showMessage(
            this.locale.notifications.errorTitle, 
            _.template(this.locale.notifications.errorUpdating)({id : id}));
    },

    __viewSaved: function(id, data) {
        this.instance.showMessage(
            this.locale.notifications.successTitle, 
            _.template(this.locale.notifications.viewUpdated)({id : id}));
    },

    /**
     * Wraps the default views listing json in a GridModel
     * @param  {Object} data json
     * @return {Oskari.userinterface.component.GridModel}      model
     */
    __getGridModel: function(data) {
        var me = this,
            model = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
        model.addData({
            id: data.viewId,
            name: me.locale.globalViewTitle,
            action: me.locale.setButton
        });
        
        _.each(data.roles, function(role) {
            if (!role.viewId) {
                return;
            }
            model.addData({
                id: role.viewId,
                roleid: role.id,
                name: role.name,
                action: me.locale.setButton
            });
        });
        return model;
    }

}, {
    extend: ['Oskari.userinterface.component.TabPanel']
});