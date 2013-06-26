/**
 * @class Oskari.analysis.bundle.analyse.view.StartAnalyse.filterMethods
 * 
 * Adds filter methods to the StartAnalyse class.
 */
Oskari.clazz.category('Oskari.analysis.bundle.analyse.view.StartAnalyse',
    'filter-methods', {

    __filterTemplates: {
        "filterContent" : '<div class="analyse-filter-popup-content">' +
                '<div class="analyse-filter filter-title"></div>' +
            '</div>',
        "filterContentBBOX" : '<div class="analyse-filter analyse-filter-popup-bbox">' +
                '<div class="bbox-title"></div>' +
                '<div class="bbox-radio bbox-on">' +
                    '<input id="analyse-filter-bbox-on" type="radio" name="filter-bbox" value="true" />' +
                    '<label for="analyse-filter-bbox-on"></label>' +
                '</div>' +
                '<div class="bbox-radio bbox-off">' +
                    '<input id="analyse-filter-bbox-off" type="radio" name="filter-bbox" value="false" />' +
                    '<label for="analyse-filter-bbox-off"></label>' +
                '</div>' +
            '</div>'
    },

    /**
     * Sets the filter JSON object.
     *
     * @method setFilterJson
     * @param {JSON} filterJson
     */
    setFilterJson: function(filterJson) {
        this._filterJson = filterJson;
    },

    /**
     * Returns filter JSON object.
     *
     * @method getFilterJson
     * @return {JSON}
     */
    getFilterJson: function() {
        return this._filterJson;
    },

    /**
     * Open a pop-up to select filter parameters.
     *
     * @method _filterRequest
     * @private
     * @param {jQuery} tools  table div where filter icon is located
     * @param {int} layer_id  layer id for to retreave layer object
     */
    _filterRequest : function(tools, layer_id) {
        var me = this;

        // <remove this>
        tools.find('div.filter').css({
            'height': '16px',
            'width': '16px',
            'background': 'url("/Oskari/resources/analysis/bundle/analyse/icons/icon-funnel.png")'
        });
        // </remove this>

        tools.find('div.filter').bind('click', function() {
            me._createFilterDialog(layer_id);
        });
    },

    /**
     * @method _createFilterDialog
     */
    _createFilterDialog: function(layer_id) {
        var me = this,
            popup = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            closeButton = popup.createCloseButton(this.loc.buttons.cancel);
            updateButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
            popupContent = this._getFilterDialogContent(layer_id);

        updateButton.setTitle(this.loc.filter.refreshButton);
        updateButton.addClass('primary');
        updateButton.setHandler(function() {
            popup.close();
            var filterJson = me._getFilterValues(popup.getJqueryContent());
            me.setFilterJson(filterJson);
        });

        popup.show(this.loc.filter.title, popupContent, [closeButton, updateButton]);
        popup.makeModal();
    },

    /**
     * @method _getFilterDialogContent
     */
    _getFilterDialogContent: function(layer_id) {
        if (this._filterDialogContent) {
            return this._filterDialogContent;
        }

        var content = jQuery(this.__filterTemplates['filterContent']);
        content.find('div.filter-title').html('<h4>' + this.loc.filter.description + layer_id + '</h4>');

        var bboxSelection = jQuery(this.__filterTemplates['filterContentBBOX']);
        bboxSelection.find('div.bbox-title').html('<h4>' + this.loc.filter.bbox.title + '</h4>');
        bboxSelection.find('div.bbox-on').find('label').html(this.loc.filter.bbox.on);
        bboxSelection.find('div.bbox-off').find('label').html(this.loc.filter.bbox.off);
        content.append(bboxSelection);

        this._filterDialogContent = content;

        return content;
    },

    /**
     * @method _getFilterValues
     */
    _getFilterValues: function(popupContent) {
        var filterValues = {};

        var bboxValue = jQuery(popupContent).find('input[name=filter-bbox]').val();
        if ("true" === bboxValue) {
            filterValues.bbox = this.instance.getSandbox().getMap().getBbox();
        }

        return filterValues;
    }
});