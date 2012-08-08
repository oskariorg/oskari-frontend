Ext.define('Oskari.mapframework.bundle.myplaces.ui.view.ConfirmWindow', {
    extend : 'Ext.window.Window',
//    height : 200,
    modal: true,
    // 400 should be enough for large buttons
    width : 400,
    layout : 'fit',
    cls: Ext.baseCSSPrefix + 'message-box',

    /**
     * Initialize the component
     */
    initComponent : function() {
        // create config object
        var config = {};
        config.uiItems = {};
        //config.html = this.message;

        // build panel confs
        this._buildItems(config);
        this._buildDockedButtons(config);

        Ext.apply(this, Ext.apply(this.initialConfig, config));

        // call parent
        this.callParent(arguments);
    },
    /**
     * @method _createButton
     * Internal method create toolbar button
     */
    _createButton : function(btnConf) {
		var me = this;
        var btn = Ext.create('Ext.Button', {
            text : btnConf.text,
            handler : function() {
            	me.destroy();
            	if(btnConf.handler) {
            		btnConf.handler();
            	}
            }
        });
        return btn;
    },
    /**
     * @method _buildItems
     * Internal method to build main ui
     */
    _buildItems : function(config) {
        var me = this;
        // pretty much copypasted from Ext.MessageBox
        me.topContainer = Ext.create('Ext.container.Container', {
            anchor: '100%',
            style: {
                padding: '10px',
                overflow: 'hidden'
            },
            items: [
                me.iconComponent = Ext.create('Ext.Component', {
                    cls: 'ext-mb-icon ' + Ext.Msg.QUESTION, 
                    width: 50,
                    height: 35,
                    style: {
                        'float': 'left'
                    }
                }),
                me.promptContainer = Ext.create('Ext.container.Container', {
                    layout: {
                        type: 'anchor'
                    },
                    items: [
                        me.msg = Ext.create('Ext.Component', {
                            autoEl: { tag: 'span' },
                            cls: 'ext-mb-text',
                            html: me.message
                        })
                    ]
                })
            ]
        });
        config.items = [me.topContainer];
       
    },
    /**
     * @method _buildDockedButtons
     * Internal method to build bottom toolbar
     */
    _buildDockedButtons : function(config) {
        var me = this;

		var buttonItems = [];
		for(var index in this.dialogButtons) {
			var btnConf = this.dialogButtons[index];
			if(btnConf == 'break') {
        		 buttonItems.push({xtype : 'tbfill'});
			}
			else {
				var btn = this._createButton(btnConf);
				buttonItems.push(btn);
			}
		}
        // BOTTOM TOOLBAR
        config.dockedItems = [
        {
            xtype : 'toolbar',
            ui: 'footer',
            dock : 'bottom',
            items : buttonItems
        }];
    }
});
