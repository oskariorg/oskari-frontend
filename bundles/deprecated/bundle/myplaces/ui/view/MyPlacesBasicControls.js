Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesBasicControls', {
    extend : 'Ext.panel.Panel',
    layout : 'anchor',
    border : false,
    frame : false,

    /**
     * Initialize the component
     */
    initComponent : function() {

        // create config object
        var config = {};
        config.uiItems = {};

        config.mainPanel = this.oskariConfig.mainPanel;

        // build panel
        this._buildItems(config);

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        this.callParent(arguments);
    },
    /**
     * @method _buildItems
     * Internal method to build main ui
     */
    _buildItems : function(config) {
        var me = this;

        var myPlacesDesc = Ext.create('Ext.form.Label', {
            text : this.oskariConfig.localizationSet.mainpanel.myPlacesDesc
        });

        var btnPoint = Ext.create('Ext.Button', {
            tooltip : this.oskariConfig.localizationSet.mainpanel.btnPoint,
            cls : 'x-btn-icon',
            //flex : 1,
            scale : 'large',
            flex : 1,
            iconCls : 'myplaces_draw_point',
            handler : function() {
                me.mainPanel.startNewDrawing({
                    drawMode : 'point'
                });
            }
        });
        var btnLine = Ext.create('Ext.Button', {
            tooltip : this.oskariConfig.localizationSet.mainpanel.btnLine,
            cls : 'x-btn-icon',
            scale : 'large',
            flex : 1,
            iconCls : 'myplaces_draw_line',
            handler : function() {
                me.mainPanel.startNewDrawing({
                    drawMode : 'line'
                });
            }
        });
        var btnArea = Ext.create('Ext.Button', {
            tooltip : this.oskariConfig.localizationSet.mainpanel.btnArea,
            cls : 'x-btn-icon',
            scale : 'large',
            flex : 1,
            iconCls : 'myplaces_draw_area',
            handler : function() {
                me.mainPanel.startNewDrawing({
                    drawMode : 'area'
                });
            }
        });
        config.uiItems.btnPoint = btnPoint;
        config.uiItems.btnLine = btnLine;
        config.uiItems.btnArea = btnArea;

        var drawButtonsPanel = Ext.create('Ext.panel.Panel', {
            border : false,
            frame : false,
            layout: 'anchor',
            bodyPadding : '5 25',
            items : [btnPoint, btnLine, btnArea]
        });
        
        var selectionHelp = Ext.create('Ext.form.Label', {
            text : this.oskariConfig.localizationSet.mainpanel.selectionHelp
        });
        
        config.items = [myPlacesDesc, drawButtonsPanel, selectionHelp];
    }
});
