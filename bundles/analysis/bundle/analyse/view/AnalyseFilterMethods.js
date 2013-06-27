/**
 * @class Oskari.analysis.bundle.analyse.view.StartAnalyse.filterMethods
 * 
 * Adds filter methods to the StartAnalyse class.
 */
Oskari.clazz.category('Oskari.analysis.bundle.analyse.view.StartAnalyse',
    'filter-methods', {

    __filterTemplates: {
        "filterContent" : '<div class="analyse-filter-popup-content">' +
                //'<div class="analyse-filter filter-title"></div>' +
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
     * Sets the filter JSON object for a given layer.
     *
     * @method setFilterJson
     * @param {String} layer_id
     * @param {JSON} filterJson
     */
    setFilterJson: function(layer_id, filterJson) {
        this._filterJsons[layer_id] = filterJson;
    },

    /**
     * Removes the filter JSON object for a given layer.
     *
     * @method removeFilterJson
     * @param {String} layer_id
     */
    removeFilterJson: function(layer_id) {
        delete this._filterJsons[layer_id];
    },

    /**
     * Returns filter JSON object for a given layer.
     *
     * @method getFilterJson
     * @param {String} layer_id
     * @return {JSON}
     */
    getFilterJson: function(layer_id) {
        return this._filterJsons[layer_id];
    },

    /**
     * Open a pop-up to select filter parameters.
     *
     * @method _filterRequest
     * @private
     * @param {jQuery} tools  table div where filter icon is located
     * @param {int} layer_id  layer id for to retrieve layer object,
     *              prefixed with 'oskari_analyse_layer_'.
     */
    _filterRequest : function(tools, analyse_layer_id) {
        var me = this;
        // From 'oskari_analyse_layer_{id}' to '{id}'
        var layer_id = analyse_layer_id.replace((this.id_prefix + 'layer_'), '');

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
            me.setFilterJson(layer_id, filterJson);
        });

        popup.show(popupTitle, popupContent, [closeButton, updateButton]);
        popup.makeModal();
    },

    /**
     * @method _getFilterDialogContent
     */
    _getFilterDialogContent: function(layer_id) {
        var content = jQuery(this.__filterTemplates['filterContent']),
            bboxSelection = jQuery(this.__filterTemplates['filterContentBBOX']),
            valuesSelection = jQuery(this.__filterTemplates['filterContentValues']),
            filterOption;

        if (this._filterDialogContents[layer_id]) {
            return this._filterDialogContents[layer_id];
        }


        // The BBOX filter selection
        bboxSelection.find('div.bbox-title').html('<h4>' + this.loc.filter.bbox.title + '</h4>');
        bboxSelection.find('div.bbox-on').find('label').html(this.loc.filter.bbox.on);
        bboxSelection.find('div.bbox-off').find('label').html(this.loc.filter.bbox.off);
        content.append(bboxSelection);

        // Filter values selection
        valuesSelection.find('div.values-title').html('<h4>' + this.loc.filter.values.title + '</h4>');

        // Add a filter
        filterOption = this._addAttributeFilter();
        valuesSelection.append(filterOption);

        content.append(valuesSelection);

        this._filterDialogContents[layer_id] = content;
        return content;
    },

    /**
     * Adds an attribute based filter selection to the UI.
     *
     * @method _addAttributeFilter
     * @private
     */
    _addAttributeFilter: function() {
        var me = this,
            filterOption = jQuery(this.__filterTemplates['filterContentOption']),
            attrSelect = filterOption.find('select.attribute'),
            attrPlaceHolder = this.loc.filter.values.placeholders.attribute,
            opSelect = filterOption.find('select.operator'),
            opPlaceHolder = this.loc.filter.values.placeholders.operator;

        // Appends values to the attribute select.
        // TODO: get the list of layer attributes.
        this._appendOptionValues(attrSelect, attrPlaceHolder);
        // Appends values to the operator select.
        this._appendOptionValues(opSelect, opPlaceHolder, [
            '=', '!=', '>', '<', '=>', '<='
        ]);

        // Placeholder to the attribute value input.
        filterOption.find('input[name=attribute-value]').
            attr('placeholder', this.loc.filter.values.placeholders['attribute-value']);

        // Bind a click event to the 'add a new filter' button.
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
     * @param {Jquery object} element the element that was clicked.
     * @private
     */
    _changeAttributeFilter: function(element) {
        // Create a boolean operator selection that glues the filters together.
        var boolOption = jQuery(this.__filterTemplates['filterBooleanOption']);
        var boolPlaceHolder = this.loc.filter.values.placeholders.boolean;
        this._appendOptionValues(boolOption, boolPlaceHolder, [
            'AND', 'OR', 'NOT'
        ]);

        // Append the boolean selection to the DOM.
        var parent = element.parent();
        parent.append(boolOption);

        // Create another filter selection and add it to the DOM.
        var filterList = element.parents('div.analyse-filter-popup-values');
        var newFilter = this._addAttributeFilter();
        filterList.append(newFilter);
        
        // Remove the plus link.
        element.remove();
    },

    /**
     * Appends option values to the given select element.
     *
     * @method _appendOptionValues
     * @private
     * @param {jQuery object} select the select element where the options are to be applied
     * @param {String} placeHolder the first dummy option with no value (optional).
     * @param {Array[Object]/Array[String]} values the values that are to be applied to the select.
     *          Should have 'id' and 'name' keys if an array of objects (optional).
     */
    _appendOptionValues: function(select, placeHolder, values) {
        // Append the first, empty value to work as a placeholder
        if (placeHolder) {
            var option = jQuery(this.__filterTemplates['option']);
            option.attr('value', '');
            option.html(placeHolder);
            select.append(option);
        }

        // Iterate the list of given values
        for (var i = 0; values && i < values.length; ++i) {
            option = jQuery(this.__filterTemplates['option']);
            // Array of strings.
            if (typeof values[i] === 'string') {
                option.attr('value', values[i]);
                option.html(values[i]);
            }
            // Otherwise we're assuming an array of objects.
            else {
                option.attr('value', values[i].val);
                option.html(values[i].name);
            }
            select.append(option);
        }
    },

    /**
     * Retrieves the filter values from the popup content.
     *
     * @method _getFilterValues
     * @param {Object} popupContent the content of the popup.
     */
    _getFilterValues: function(popupContent) {
        var filterValues = {};

        // Get the map window bbox if chosen.
        var bboxValue = jQuery(popupContent).find('input[name=filter-bbox]').val();
        if ("true" === bboxValue) {
            filterValues.bbox = this.instance.getSandbox().getMap().getBbox();
        }

        // Get the actual filters.
        var domFilters = jQuery(popupContent).find('div.filter-option');
        if (domFilters && domFilters.length) {
            filterValues.filters = [];

            for (var i = 0; i < domFilters.length; ++i) {
                var domFilter = jQuery(domFilters[i]);

                var filter = {};
                filter.attribute = domFilter.find('select.attribute').val();
                filter.operator = domFilter.find('select.operator').val();
                filter.value = domFilter.find('input[name=attribute-value]').val();
                filterValues.filters.push(filter);

                var boolOperator = domFilter.find('select.boolean').val();
                if (boolOperator) {
                    filterValues.filters.push(boolOperator);
                }
            }
        }

        return filterValues;
    }
});