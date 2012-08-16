Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.MyPlacesDrawControls', {
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
        config.category = null;

        config.module = this.oskariConfig.module;
        config.mainPanel = this.oskariConfig.mainPanel;

        // build panel
        this._buildItems(config);

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        this.callParent(arguments);
    },
    /**
     * @method setDrawMode
     * Modifies the ui texts and functionality to match the current draw mode
     * @param mode as in StartDrawRequest
     */
    setDrawMode : function(mode) {
		this.uiItems.drawHelp.update(this.oskariConfig.localizationSet.mainpanel.drawHelp[mode]);
		if('point' === mode) {
			this.uiItems.btnFinishDraw.hide();
		} 
		else {
			// only relevant if doing line or area
			this.uiItems.btnFinishDraw.show();
		}
    },
    /**
     * @method _buildItems
     * Internal method to build main ui
     */
    _buildItems : function(config) {
        var me = this;


        var drawHelp = Ext.create('Ext.form.Label');
        config.uiItems.drawHelp = drawHelp;

        var btnCancelDraw = Ext.create('Ext.Button', {
            text : this.oskariConfig.localizationSet.mainpanel.btnCancelDraw,
            //disabled : true,
            scale : 'medium',
            iconCls : 'myplaces_draw_cancel',
            handler : function() {
                me.module.closeWizard();
                me.mainPanel.sendStopDrawRequest();
            }
        });
        var cancelButtonsPanel = Ext.create('Ext.panel.Panel', {
            border : false,
            frame : false,
            bodyPadding : 5,
            layout: 'fit',
            items : [btnCancelDraw]
        });
        
        var btnFinishDraw = Ext.create('Ext.Button', {
            text : this.oskariConfig.localizationSet.mainpanel.btnFinishDraw,
            //disabled : true,
            scale : 'medium',
            //iconCls : 'myplaces_draw_cancel',
            handler : function() {
                me.mainPanel.sendStopDrawRequest(true);
            }
        });
        config.uiItems.btnFinishDraw = btnFinishDraw;
        
        var finishButtonsPanel = Ext.create('Ext.panel.Panel', {
            border : false,
            frame : false,
            bodyPadding : 5,
            layout: 'fit',
            items : [btnFinishDraw]
        });
        
        config.items = [drawHelp, finishButtonsPanel, cancelButtonsPanel];
    }
});
