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
                '<div class="bbox-radio">' +
                    '<div class="bbox-on">' +
                        '<input id="analyse-filter-bbox-on" type="radio" name="filter-bbox" value="true" />' +
                        '<label for="analyse-filter-bbox-on"></label>' +
                    '</div>' +
                    '<div class="bbox-off">' +
                        '<input id="analyse-filter-bbox-off" type="radio" name="filter-bbox" value="false" />' +
                        '<label for="analyse-filter-bbox-off"></label>' +
                    '</div>' +
                '</div>' +
            '</div>',
        "filterContentValues": '<div class="analyse-filter analyse-filter-popup-values">' +
                '<div class="values-title"></div>' +
            '</div>',
        "filterContentOption": '<div class="filter-option">' +
                '<select class="attribute"></select>' +
                '<select class="operator"></select>' +
                '<input name="attribute-value" type="text"></input>' +
                '<div class="add-filter-option">+</div>' +
            '</div>',
        "filterBooleanOption": '<select class="boolean"></select>',
        "option": '<option></option>'
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
            closeButton = popup.createCloseButton(this.loc.buttons.cancel),
            // Update the filter values
            updateButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
            popupContent = this._getFilterDialogContent(layer_id),
            popupTitle = this.loc.filter.description + layer_id;

        updateButton.setTitle(this.loc.filter.refreshButton);
        updateButton.addClass('primary');
        updateButton.setHandler(function() {
            popup.close();
            var filterJson = me._getFilterValues(popup.getJqueryContent());
            me.setFilterJson(filterJson);
        });

        popup.show(popupTitle, popupContent, [closeButton, updateButton]);
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

        // The BBOX filter selection
        var bboxSelection = jQuery(this.__filterTemplates['filterContentBBOX']);
        bboxSelection.find('div.bbox-title').html('<h4>' + this.loc.filter.bbox.title + '</h4>');
        bboxSelection.find('div.bbox-on').find('label').html(this.loc.filter.bbox.on);
        bboxSelection.find('div.bbox-off').find('label').html(this.loc.filter.bbox.off);
        content.append(bboxSelection);

        // Filter values selection
        var valuesSelection = jQuery(this.__filterTemplates['filterContentValues']);
        valuesSelection.find('div.values-title').html('<h4>' + this.loc.filter.values.title + '</h4>');

        // Add a filter
        var filterOption = this._addAttributeFilter();
        valuesSelection.append(filterOption);

        content.append(valuesSelection);

        this._filterDialogContent = content;
        return content;
    },

    /**
     * Adds an attribute based filter selection to the UI.
     *
     * @method _addAttributeFilter
     * @private
     */
    _addAttributeFilter: function() {
        var me = this;

        var filterOption = jQuery(this.__filterTemplates['filterContentOption']);

        var attrSelect = filterOption.find('select.attribute');
        var attrPlaceHolder = this.loc.filter.values.placeholders.attribute;
        this._appendOptionValues(attrSelect, attrPlaceHolder);

        var opSelect = filterOption.find('select.operator');
        var opPlaceHolder = this.loc.filter.values.placeholders.operator;
        this._appendOptionValues(opSelect, opPlaceHolder);

        filterOption.find('input[name=attribute-value]').
            attr('placeholder', this.loc.filter.values.placeholders['attribute-value']);

        filterOption.find('div.add-filter-option').on('click', function(e) {
            var elem = jQuery(this);
            me._changeAttributeFilter(elem);
        })

        return filterOption;
    },

    /**
     * Removes the plus button and creates a new attribute filter,
     * combining it with the previous one with a logical operator.
     *
     * @method _changeAttributeFilter
     * @private
     */
    _changeAttributeFilter: function(element) {
        var boolOption = jQuery(this.__filterTemplates['filterBooleanOption']);
        var boolPlaceHolder = this.loc.filter.values.placeholders.boolean;
        this._appendOptionValues(boolOption, boolPlaceHolder);

        var parent = element.parent();
        parent.append(boolOption);

        var filterList = element.parents('div.analyse-filter-popup-values');
        var newFilter = this._addAttributeFilter();
        filterList.append(newFilter);
        
        element.remove();
    },

    /**
     * Appends option values to the given select element.
     *
     * @method _appendOptionValues
     * @private
     * @param {jQuery object} select the select element where the options are to be applied
     * @param {String} placeHolder the first dummy option with no value
     * @param {Array[Object]} values the values that are to be applied to the select.
     *          Should have 'id' and 'name' keys (optional).
     */
    _appendOptionValues: function(select, placeHolder, values) {
        // Append the first, empty value to work as a placeholder
        var option = jQuery(this.__filterTemplates['option']);
        option.attr('value', '');
        option.html(placeHolder);
        select.append(option);

        // Iterate the list of given values
        for (var i = 0; values && i < values.length; ++i) {
            option = jQuery(this.__filterTemplates['option']);
            option.attr('value', values[i].val);
            option.html(values[i].name);
            select.append(option);
        }
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