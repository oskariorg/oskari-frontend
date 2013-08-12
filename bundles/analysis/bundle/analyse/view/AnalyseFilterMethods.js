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
                        '<input id="analyse-filter-bbox-off" type="radio" name="filter-bbox" value="false" checked="checked" />' +
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
            '</div>',
        "manageFilterOption": '<div class="manage-filter-option">' +
                '<div class="add-filter-option">+</div>' +
                '<div class="remove-filter-option">-</div>' +
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
     * @param {jQuery} tools table div where filter icon is located
     * @param {String} analyse_layer_id  layer id for to retrieve layer object,
     *                 prefixed with 'oskari_analyse_layer_'.
     */
    _filterRequest : function(tools, analyse_layer_id) {
        var me = this,
            // From 'oskari_analyse_layer_{id}' to '{id}'
            layer_id = analyse_layer_id.replace((this.id_prefix + 'layer_'), ''),
            layer = this.instance.mapLayerService.findMapLayer(layer_id);

        // <remove this>
        tools.find('div.filter').css({
            'height': '16px',
            'width': '16px',
            'background': 'url("/Oskari/resources/analysis/bundle/analyse/icons/icon-funnel.png")'
        });
        // </remove this>

        tools.find('div.filter').bind('click', function() {
            me._createFilterDialog(layer);
        });
    },

    /**
     * Creates the filter options dialog and displays it to the user.
     *
     * @method _createFilterDialog
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    _createFilterDialog: function(layer) {
        var me = this,
            popup = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            closeButton = popup.createCloseButton(this.loc.buttons.cancel),
            // Clears the filter values
            clearButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
            // Updates the filter values
            updateButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
            popupContent = this._getFilterDialogContent(layer),
            popupTitle = this.loc.filter.description + layer.getName(),
            filterJson, filterErrors, prevJson;

        closeButton.addClass('analyse-close-filter');

        clearButton.setTitle(this.loc.filter.clearButton);
        clearButton.addClass('analyse-clear-filter');
        clearButton.setHandler(function() {
            // Sets the dialog content to its original state
            popup.setContent(me._getFilterDialogContent(layer));
            // Removes the filter for the layer
            me.removeFilterJson(layer.getId());
        });

        updateButton.setTitle(this.loc.filter.refreshButton);
        updateButton.addClass('primary');
        updateButton.addClass('analyse-update-filter');
        updateButton.setHandler(function() {
            // Get the filter values from the dialog
            filterJson = me._getFilterValues(popup.getJqueryContent());
            // Validate the values for errors
            filterErrors = me._validateFilterValues(filterJson);
            if (filterErrors) {
                // If there were validation errors, notify the user of them
                // and prevent refreshing the filter values.
                me._displayValidationErrors(filterErrors);
            } else {
                // Else, set the filter JSON for the layer
                // and close the dialog
                me.setFilterJson(layer.getId(), filterJson);
                popup.close();
            }
        });

        // If there's already filter values for current layer, populate the dialog with them.
        prevJson = this.getFilterJson(layer.getId());
        if (prevJson && !jQuery.isEmptyObject(prevJson)) {
            this._fillDialogContent(popupContent, prevJson, layer);
        }

        popup.show(popupTitle, popupContent, [closeButton, clearButton, updateButton]);
        popup.makeModal();
    },

    /**
     * Creates the content for the filter dialog popup.
     *
     * @method _getFilterDialogContent
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    _getFilterDialogContent: function(layer) {
        var content = jQuery(this.__filterTemplates['filterContent']),
            bboxSelection = jQuery(this.__filterTemplates['filterContentBBOX']),
            valuesSelection = jQuery(this.__filterTemplates['filterContentValues']),
            filterOption;

        // The BBOX filter selection
        bboxSelection.find('div.bbox-title').html('<h4>' + this.loc.filter.bbox.title + '</h4>');
        bboxSelection.find('div.bbox-on').find('label').html(this.loc.filter.bbox.on);
        bboxSelection.find('div.bbox-off').find('label').html(this.loc.filter.bbox.off);
        content.append(bboxSelection);

        // Filter values selection
        valuesSelection.find('div.values-title').html('<h4>' + this.loc.filter.values.title + '</h4>');
        // Add a filter
        filterOption = this._addAttributeFilter(layer);
        valuesSelection.append(filterOption);

        content.append(valuesSelection);

        return content;
    },

    /**
     * Fills the dialog with filter values.
     *
     * @method _fillDialogContent
     * @private
     * @param {jQuery object} dialog
     * @param {Object} values
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    _fillDialogContent: function(dialog, values, layer) {
        var bboxDiv = dialog.find('div.bbox-radio'),
            filterDiv = dialog.find('div.filter-option'),
            filter,
            i;

        // Set the BBOX value
        if (values.bbox && !jQuery.isEmptyObject(values.bbox)) {
            // BBOX enabled
            bboxDiv.find('div.bbox-off').find('input[name=filter-bbox]').removeAttr('checked');
            bboxDiv.find('div.bbox-on').find('input[name=filter-bbox]').attr('checked', 'checked');
        } else {
            // BBOX disabled
            bboxDiv.find('div.bbox-off').find('input[name=filter-bbox]').attr('checked', 'checked');
            bboxDiv.find('div.bbox-on').find('input[name=filter-bbox]').removeAttr('checked');
        }

        if (values.filters && values.filters.length) {
            // Fill the values of the first filter already visible in the DOM.
            filter = values.filters[0];
            this._fillFilterOptionsDiv(filterDiv, filter);

            // Create the rest of the filters and fill the values.
            for (i = 1; values.filters && i < values.filters.length; ++i) {
                filter = values.filters[i];

                // The boolean operator selection
                if (filter.boolean) {
                    var lastFilter = dialog.find('div.filter-option').last();
                    var boolSelect = this._createBooleanSelect();

                    jQuery(boolSelect.find('option')).filter(function () {
                        return (jQuery(this).val() == filter.boolean); 
                    }).prop('selected', 'selected');

                    lastFilter.find('div.manage-filter-option').replaceWith(boolSelect);
                }
                // A normal filter
                else {                
                    var newFilterDiv = this._addAttributeFilter(layer);
                    this._fillFilterOptionsDiv(newFilterDiv, filter);
                    dialog.find('div.analyse-filter-popup-values').append(newFilterDiv);
                }
            }
        }
    },

    /**
     * Fills the filter options div with given filter values.
     *
     * @method _fillFilterOptionsDiv
     * @private
     * @param {jQuery object} div the filter options div
     * @param {Object} analyseFilter
     */
    _fillFilterOptionsDiv: function(div, analyseFilter) {
        // Set the right attribute as selected
        jQuery(div.find('select.attribute option')).filter(function () {
            return (jQuery(this).val() == analyseFilter.attribute); 
        }).prop('selected', 'selected');

        // Set the right operator as selected
        jQuery(div.find('select.operator option')).filter(function () {
            return (jQuery(this).val() == analyseFilter.operator); 
        }).prop('selected', 'selected');

        // Set the value of the value field ;)
        div.find('input[name=attribute-value]').val(analyseFilter.value);
    },

    /**
     * Adds an attribute based filter selection to the UI.
     *
     * @method _addAttributeFilter
     * @private
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    _addAttributeFilter: function(layer) {
        var me = this,
            filterOption = jQuery(this.__filterTemplates['filterContentOption']),
            attrSelect = filterOption.find('select.attribute'),
            attrPlaceHolder = this.loc.filter.values.placeholders.attribute,
            opSelect = filterOption.find('select.operator'),
            opPlaceHolder = this.loc.filter.values.placeholders.operator,
            layerAttributes = me._getLayerAttributes(layer);

        // Appends values to the attribute select.
        this._appendOptionValues(attrSelect, attrPlaceHolder, layerAttributes);
        // Appends values to the operator select.
        this._appendOptionValues(opSelect, opPlaceHolder, [
            '=', '~=', '≠', '>', '<', '≥', '≤'
        ]);

        // Placeholder to the attribute value input.
        filterOption.find('input[name=attribute-value]').
            attr('placeholder', this.loc.filter.values.placeholders['attribute-value']);

        // Add the buttons to remove this filter and to add a new filter.
        filterOption.append(this._addManageFilterOption(layer));

        return filterOption;
    },

    /**
     * Adds a new filter option and binds actions to its 'add new filter' and
     * 'remove filter' buttons.
     *
     * @method _addManageFilterOption
     * @return {jQuery object}
     */
    _addManageFilterOption: function(layer) {
        var manageFilterOption = jQuery(this.__filterTemplates['manageFilterOption']),
            addTitle = this.loc.filter.addFilter,
            removeTitle = this.loc.filter.removeFilter;

        manageFilterOption.find('div.add-filter-option').attr('title', addTitle);
        manageFilterOption.find('div.remove-filter-option').attr('title', removeTitle);
        // Bind a click event to the 'add a new filter' button.
        this._bindAddNewFilter(manageFilterOption.find('div.add-filter-option'), layer);
        // Bind a click event to the 'remove filter' button.
        this._bindRemoveFilter(manageFilterOption.find('div.remove-filter-option'), layer);

        return manageFilterOption;
    },

    /**
     * Binds a click event to add a new filter to the element given
     *
     * @method _bindAddNewFilter
     * @param {jQuery object} element
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    _bindAddNewFilter: function(element, layer) {
        var me = this;
        element.on('click', function(e) {
            me._changeAttributeFilter(jQuery(this), layer);
        });
    },

    /**
     * Binds a click event to remove a filter.
     *
     * @method _bindRemoveFilter
     * @private
     */
    _bindRemoveFilter: function(element, layer) {
        var me = this;
        element.on('click', function(e) {
            me._removeFilter(jQuery(this), layer);
        });
    },

    /**
     * Removes the 'add new filter' and 'remove filter' buttons
     * and creates a new attribute filter combining it with
     * the previous one with a logical operator.
     *
     * @method _changeAttributeFilter
     * @private
     * @param {Jquery object} element the 'add new filter' button element
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    _changeAttributeFilter: function(element, layer) {
        var me = this,
            parent = element.parents('div.filter-option'),
            filterList = element.parents('div.analyse-filter-popup-values'),
            // Create another filter selection
            newFilter = this._addAttributeFilter(layer),
            // Create a boolean operator selection that glues the filters together
            boolSelect = this._createBooleanSelect();

        // Remove the add and remove filter buttons.
        parent.find('div.manage-filter-option').remove();
        // Append the boolean selection to the DOM.
        parent.append(boolSelect);
        // Add the new filter selection to the DOM.
        filterList.append(newFilter);
    },

    /**
     * Removes the filter selection associated with the element given as a param
     *
     * @method _removeFilter
     * @private
     * @param {jQuery object} element the 'remove filter' button element
     */
    _removeFilter: function(element, layer) {
        var parent = element.parents('div.filter-option'),
            // Previous filter selection element
            prevSibling = parent.prev('div.filter-option'),
            manageFilterOption = this._addManageFilterOption(layer);

        // Replace the boolean operator select with the 
        prevSibling.find('select.boolean').replaceWith(manageFilterOption);
        // Unless this is the last filter option, remove it.
        if (prevSibling && prevSibling.length) {
            parent.remove();
        }
    },

    /**
     * Creates a boolean operator selection.
     *
     * @method _createBooleanSelect
     * @private
     * @return {jQuery object}
     */
    _createBooleanSelect: function() {
        var boolOption = jQuery(this.__filterTemplates['filterBooleanOption']),
            boolPlaceHolder = this.loc.filter.values.placeholders.boolean;

        // Put the default boolean values to the select.
        this._appendOptionValues(boolOption, boolPlaceHolder, [
            'AND', 'OR', 'NOT'
        ]);

        return boolOption;
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
        var option = jQuery(this.__filterTemplates['option']),
            i;
        // Append the first, empty value to work as a placeholder
        if (placeHolder) {
            option.attr('value', '');
            option.html(placeHolder);
            select.append(option);
        }

        // Iterate the list of given values
        for (i = 0; values && i < values.length; ++i) {
            option = jQuery(this.__filterTemplates['option']);
            // Array of strings.
            if (typeof values[i] === 'string') {
                option.attr('value', values[i]);
                option.html(values[i]);
            }
            // Otherwise we're assuming an array of objects.
            else {
                option.attr('value', values[i].id);
                option.html(values[i].name);
            }
            select.append(option);
        }
    },

    /**
     * Retrieves the filter values from the popup content.
     * Returns an object with 0..2 keys:
     *   - 'bbox' {Object} the current map window bbox
     *   - 'filters' {Array[Object]} where even valued items
     *     are the actual filter objects, with keys:
     *     'attribute', 'operator' and 'value'
     *     and odd valued items are the logical operators
     *     combining the filters with only one key: 'boolean'
     *     Because of this filters.length is always
     *     (at least it should be) odd valued.
     *
     * @method _getFilterValues
     * @private
     * @param {Object} popupContent the content of the popup.
     * @return {Object}
     */
    _getFilterValues: function(popupContent) {
        var filterValues = {},
            bboxValue, domFilters, domFilter, filter, boolOperator, emptyFilter, i;

        // Get the map window bbox if chosen.
        bboxValue = jQuery(popupContent).find('input[name=filter-bbox]:checked').val();
        if ("true" === bboxValue) {
            filterValues.bbox = this.instance.getSandbox().getMap().getBbox();
        }

        // Get the actual filters.
        domFilters = jQuery(popupContent).find('div.filter-option');
        if (domFilters && domFilters.length) {
            filterValues.filters = [];

            for (i = 0; i < domFilters.length; ++i) {
                domFilter = jQuery(domFilters[i]);

                filter = {};
                filter.attribute = domFilter.find('select.attribute').val();
                filter.operator = domFilter.find('select.operator').val();
                filter.value = domFilter.find('input[name=attribute-value]').val();
                filterValues.filters.push(filter);

                boolOperator = domFilter.find('select.boolean').val();
                if (boolOperator) {
                    filterValues.filters.push({'boolean': boolOperator});
                }
            }
        }

        // Special case when the one filter which is always in the DOM is empty
        // --> the user didn't want a filter but just the bbox perhaps.
        // NOTE! This is quite an ugly hack, used so that we don't send empty filters to backend.
        emptyFilter = filterValues.filters[0];
        if (domFilters.length === 1 &&
            (!emptyFilter.attribute && !emptyFilter.operator && !emptyFilter.value)) {
            delete filterValues.filters;
        }

        return filterValues;
    },

    /**
     * Reads the layer attributes and returns an object with
     * keys from the fields array and values from the locales array.
     *
     * @method _getLayerAttributes
     * @private
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    _getLayerAttributes: function(layer) {
        // Make copies of fields and locales
        var fields = (layer.getFields && layer.getFields()) ? layer.getFields().slice(0) : [],
            locales = (layer.getLocales && layer.getLocales()) ? layer.getLocales().slice(0) : [],
            attributes = [],
            i;

        for (i = 0; i < fields.length; ++i) {
            // Get only the fields which originate from the service,
            // that is, exclude those which are added by Oskari (starts with '__').
            if (!fields[i].match(/^__/)) {
                attributes.push({
                    id: fields[i],
                    name: (locales[i] || fields[i])
                });
            }
        }

        return attributes;
    },

    /**
     * Validates the filter values:
     * - attribute not empty
     * - operator not empty
     * - value not empty
     * - if more than one filter, booleans not empty
     *   and that every other value is a boolean, every other a filter.
     *
     * @method _validateFilterValues
     * @private
     * @param {Object} filterValues
     * @return {Object/Boolean} return an error object if there were
     *                          validation errors, false otherwise.
     */
    _validateFilterValues: function(filterValues) {
        var errors = [],
            filters = ( filterValues ? filterValues.filters : null ),
            filter, i;

        for (i = 0; filters && i < filters.length; ++i) {
            filter = filters[i];
            // These are the filter objects
            if (i % 2 === 0) {
                if (filter.boolean)    errors.push('boolean_operator_missing');
                if (!filter.attribute) errors.push('attribute_missing');
                if (!filter.operator)  errors.push('operator_missing');
                if (!filter.value)     errors.push('value_missing');
            }
            // These are the boolean operators combining the filters
            else {
                if (!filter.boolean) errors.push('boolean_operator_missing');
            }
        }

        // If no errors found, set the errors variable to false
        if (!errors.length) {
            errors = false;
        }
        return errors;
    },

    /**
     * Displays validation error messages to the user.
     *
     * @method _displayValidationErrors
     * @param {Object} errors
     */
    _displayValidationErrors: function(errors) {
        var loc = this.loc.filter.validation,
            popup = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            closeButton = popup.createCloseButton(this.loc.buttons.ok),
            popupTitle = this.loc.error.title,
            popupContent = '<h4>' + loc.title + '</h4>',
            i;

        for (i = 0; i < errors.length; ++i) {
            popupContent += '<p>' + loc[errors[i]] + '</p>';
        }

        popup.show(popupTitle, popupContent, [closeButton]);
    }
});