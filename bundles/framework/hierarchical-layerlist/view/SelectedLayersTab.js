/**
 * @class Oskari.framework.bundle.hierarchical-layerlist.view.SelectedLayersTab
 *
 *
 */
Oskari.clazz.define(
    'Oskari.framework.bundle.hierarchical-layerlist.view.SelectedLayersTab',

    /**
     * @method create called automatically on construction
     * @static
     */

    function (instance) {
        this.instance = instance;
        this.locale = this.instance.getLocalization('SelectedLayersTab');
        this.sb = this.instance.getSandbox();
        this.id = 'hierarchical-layerlist-selected-layers-tab';

        this._notifierService = this.sb.getService('Oskari.framework.bundle.hierarchical-layerlist.OskariEventNotifierService');

        this.templates = {

        };
        this._createUI();
        this._bindOskariEvents();
    }, {
        getTabPanel: function () {
            return this.tabPanel;
        },

        _updateLayerCount: function(){
            var me = this;
            var selectedLayers = me.sb.findAllSelectedMapLayers();
            me.tabPanel.getHeader().find('.layers-selected').html('<div class="layer-count">' + selectedLayers.length + '</div>');
        },

        /**
         * Create UI
         * @method  @private _createUI
         *
         * @param  {String} oskarifieldId oskari field id
         */
        _createUI: function (oskarifieldId) {
            var me = this;

            me._locale = me.instance._localization;
            me.tabPanel = Oskari.clazz.create('Oskari.userinterface.component.TabPanel');
            me.tabPanel.setTitle(me.locale.title, me.id);
            me.tabPanel.setTitleIcon('layers-selected icon-bubble-right');

            me._updateLayerCount();
        },

        _bindOskariEvents: function(){
            var me = this;
            me._notifierService.on('AfterMapLayerAddEvent',function(evt) {
                me._updateLayerCount();
            });

            me._notifierService.on('AfterMapLayerRemoveEvent',function(evt){
                me._updateLayerCount();
            });
        }
    }
);
