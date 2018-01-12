/**
 * @class Oskari.framework.bundle.hierarchical-layerlist.view.LayerGroup
 *
 *
 */
Oskari.clazz.define(
    "Oskari.framework.bundle.hierarchical-layerlist.view.LayerGroup",
    /**
     * @method create called automatically on construction
     * @static
     */
    function (layerGroup, sandbox, localization) {
        //"use strict";
        this.layerGroup = layerGroup;
        this.layers = layerGroup.layers;
        this.sandbox = sandbox;
        this.localization = localization;
        this.backendStatus = 'UNKNOWN'; // see also 'backendstatus-ok'
        this.ui = this._createLayerGroupContainer(layerGroup);
    },
    {
        __template:
            '<div class="layer-group">'+
                '<input type="checkbox" /> ' +
                '<div class="layer-group-title"></div>' +
            '</div>',
        /**
         * @method getId
         * @return {String} layer id
         */
        getId: function () {
            //"use strict";
            return this.layerGroup.getId();
        },
        setVisible: function (bln) {
            //"use strict";
            if (bln) {
                this.ui.show();
            } else {
                this.ui.hide();
            }
        },
        setSelected: function (isSelected) {
            //"use strict";
            this.ui.find('input').attr('checked', !!isSelected);
        },
        /**
         * @method _createLayerGroupContainer
         * @private
         * Creates the layer group containers
         * @param {Oskari.framework.bundle.hierarchical-layerlist.model.LayerGroup/Object} layer group to render
         */
        _createLayerGroupContainer: function (layerGroup) {
            console.log(layerGroup);
            var me = this,
                sandbox = me.sandbox,
                // create from layer group template
                // (was clone-from-template but template was only used once so there was some overhead)
                layerGroupDiv = jQuery(this.__template)
                ;

            // setup id
            layerGroupDiv.attr('layer_group_id', layerGroup.getId());
            layerGroupDiv.find('input').attr('id', 'oskari_hierarchical-layerlist_layerlist_checkbox_layer_group_id_' + layerGroup.getId());
            layerGroupDiv.find('.layer-title').append(layerGroup.getName());
            layerGroupDiv.find('.layer-title').click(function(){
                layerGroupDiv.find('input').prop('checked', !layerGroupDiv.find('input').prop('checked')).trigger('change');
            });

            layerGroupDiv.find('input').change(function () {
                checkbox = jQuery(this);
                if (checkbox.is(':checked')) {
                    sandbox.postRequestByName('AddMapLayerGroupRequest', [layerGroup.getId()]);
                } else {
                    sandbox.postRequestByName('RemoveMapLayerGroupRequest', [layerGroup.getId()]);
                }
            });

            return layerDiv;
        },
    },
    {
        /**
         * @property {String[]} protocol
         * @static
         */
        protocol: ['Oskari.mapframework.module.Module']
    }
);