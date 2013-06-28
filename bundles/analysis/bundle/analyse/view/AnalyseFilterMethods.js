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
                '<div class="add-filter-option">+</div>' +
            '</div>',
        "addFilterOption": '<div class="add-filter-option">+</div>',
        "removeFilterOption": '<div class="remove-filter-option">-</div>',
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
     * @param {String} layer_id  layer id for to retrieve layer object,
     *              prefixed with 'oskari_analyse_layer_'.
     */
    _filterRequest : function(tools, analyse_layer_id) {
        var me = this;
        // From 'oskari_analyse_layer_{id}' to '{id}'
        var layer_id = analyse_layer_id.replace((this.id_prefix + 'layer_'), '');
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
     * Creates the filter options dialog to show to the user.
     *
     * @method _createFilterDialog
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    _createFilterDialog: function(layer) {
        var me = this,
            popup = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            closeButton = popup.createCloseButton(this.loc.buttons.cancel),
            // Update the filter values
            updateButton = Oskari.clazz.create('Oskari.userinterface.component.Button'),
            popupContent = this._getFilterDialogContent(layer),
            popupTitle = this.loc.filter.description + layer.getName();

        updateButton.setTitle(this.loc.filter.refreshButton);
        updateButton.addClass('primary');
        updateButton.setHandler(function() {
            var filterJson = me._getFilterValues(popup.getJqueryContent());
            var filterErrors = me._validateFilterValues(filterJson);
            if (filterErrors) {
                // If there were validation errors, notify the user of them
                // and prevent refreshing the filter values.
                me._displayValidationErrors(filterErrors);
            } else {
                // Else, set the filter JSON for the layer.
                console.log(filterJson, layer.getId());
                me.setFilterJson(layer.getId(), filterJson);
                popup.close();
            }
        });

        // If there's already filter values for current layer, populate the dialog with them.
        var prevJson = this.getFilterJson(layer.getId());
        if (prevJson && !jQuery.isEmptyObject(prevJson)) {
            this._fillDialogContent(popupContent, prevJson, layer);
        }

        popup.show(popupTitle, popupContent, [closeButton, updateButton]);
        popup.makeModal();
    },

    /**
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
     * Fills the dialog given with values given.
     *
     * @method _fillDialogContent
     * @param {jQuery object} dialog
     * @param {Object} values
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     */
    _fillDialogContent: function(dialog, values, layer) {
        // **************************************
        // TODO: CLEAN-UP THIS HORRIBLE MESS!!!11
        // **************************************

        // Set the BBOX value
        var bboxDiv = dialog.find('div.bbox-radio');
        if (values.bbox && !jQuery.isEmptyObject(values.bbox)) {
            // BBOX enabled
            bboxDiv.find('div.bbox-off').find('input[name=filter-bbox]').removeAttr('checked');
            bboxDiv.find('div.bbox-on').find('input[name=filter-bbox]').attr('checked', 'checked');
        } else {
            // BBOX disabled
            bboxDiv.find('div.bbox-off').find('input[name=filter-bbox]').attr('checked', 'checked');
            bboxDiv.find('div.bbox-on').find('input[name=filter-bbox]').removeAttr('checked');
        }

        // TODO: create the filter selections for all the filters found.
        if (values.filters && values.filters.length) {
            // Fill the values of the first filter already visible in the DOM.
            var filter = values.filters[0];
            var filterDiv = dialog.find('div.filter-option');
            this._fillFilterOptionsDiv(filterDiv, filter);

            for (var i = 1; values.filters && i < values.filters.length; ++i) {
                var filter = values.filters[i];

                // The boolean operator selection
                if (filter.boolean) {
                    var lastFilter = dialog.find('div.filter-option').last();
                    var boolOption = jQuery(this.__filterTemplates['filterBooleanOption']);
                    var boolPlaceHolder = this.loc.filter.values.placeholders.boolean;
                    this._appendOptionValues(boolOption, boolPlaceHolder, [
                        'AND', 'OR', 'NOT'
                    ]);
                    jQuery(boolOption).filter(function () {
                        return (jQuery(this).val() == filter.boolean); 
                    }).prop('selected', true);
                    lastFilter.find('div.add-filter-option').replaceWith(boolOption);
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

    _fillFilterOptionsDiv: function(div, analyseFilter) {
        // Set the right attribute as selected
        jQuery(div.find('select.attribute option')).filter(function () {
            return (jQuery(this).val() == analyseFilter.attribute); 
        }).prop('selected', true);

        // Set the right operator as selected
        jQuery(div.find('select.operator option')).filter(function () {
            return (jQuery(this).val() == analyseFilter.operator); 
        }).prop('selected', true);

        // Set the value of the value field ;)
        div.find('input[name=attribute-value]').val(analyseFilter.value);
    },

    /**
     * Adds an attribute based filter selection to the UI.
     *
     * @method _addAttributeFilter
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @private
     */
    _addAttributeFilter: function(layer) {
        var me = this,
            filterOption = jQuery(this.__filterTemplates['filterContentOption']),
            attrSelect = filterOption.find('select.attribute'),
            attrPlaceHolder = this.loc.filter.values.placeholders.attribute,
            opSelect = filterOption.find('select.operator'),
            opPlaceHolder = this.loc.filter.values.placeholders.operator;

        // Appends values to the attribute select.
        // TODO: get the list of layer attributes.
        var layerAttributes = me._getLayerAttributes(layer);
        this._appendOptionValues(attrSelect, attrPlaceHolder, layerAttributes);
        // Appends values to the operator select.
        this._appendOptionValues(opSelect, opPlaceHolder, [
            '=', '~=', '!=', '>', '<', '=>', '<='
        ]);

        // Placeholder to the attribute value input.
        filterOption.find('input[name=attribute-value]').
            attr('placeholder', this.loc.filter.values.placeholders['attribute-value']);

        // Bind a click event to the 'add a new filter' button.
        this._bindAddNewFilter(filterOption.find('div.add-filter-option'), layer);

        return filterOption;
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
            var elem = jQuery(this);
            me._changeAttributeFilter(elem, layer);
        });
    },

    /**
     * Removes the plus button and creates a new attribute filter,
     * combining it with the previous one with a logical operator.
     *
     * @method _changeAttributeFilter
     * @param {Jquery object} element the element that was clicked.
     * @param {Oskari.mapframework.bundle.mapwfs2.domain.WFSLayer} layer
     * @private
     */
    _changeAttributeFilter: function(element, layer) {
        var me = this;
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
        var newFilter = this._addAttributeFilter(layer);        
        var filterList = element.parents('div.analyse-filter-popup-values');
        filterList.append(newFilter);
        // Add a remove button and bind the remove event to it.
        var removeFilterOption = jQuery(this.__filterTemplates['removeFilterOption']);
        removeFilterOption.on('click', function() {
            // Replace the boolean select with an add new filter button
            // and bind the click event to it.
            var addFilterOption = jQuery(me.__filterTemplates['addFilterOption']);
            newFilter.prev().find('select.boolean').replaceWith(addFilterOption);
            me._bindAddNewFilter(addFilterOption, layer);
            newFilter.remove();
        });
        newFilter.append(removeFilterOption);
        
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
                option.attr('value', values[i].id);
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
        var bboxValue = jQuery(popupContent).find('input[name=filter-bbox]:checked').val();
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
                    filterValues.filters.push({'boolean': boolOperator});
                }
            }
        }

        // Special case when the one filter which is alway in the DOM is empty
        // --> the user didn't want a filter.
        // This is quite an ugly hack.
        var emptyFilter = filterValues.filters[0];
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
        var fields = layer.getFields() ? layer.getFields().slice(0) : [],
            locales = layer.getLocales() ? layer.getLocales().slice(0) : [],
            attributes = [];

        for (var i = 0; i < fields.length; ++i) {
            attributes.push({
                id: fields[i],
                name: (locales[i] || fields[i])
            });
        }

        return attributes;
    },

    /**
     * Validates the filter values:
     * - attribute not empty
     * - operator not empty
     * - value not empty
     * - if more than one filter, booleans not empty
     *
     * @method _validateFilterValues
     * @private
     * @param {Object} filterValues
     * @return {Object/Boolean} return an error object if there were validation errors,
     *                          false otherwise.
     */
    _validateFilterValues: function(filterValues) {
        var errors = [];

        var filters = ( filterValues ? filterValues.filters : null );
        for (var i = 0; filters && i < filters.length; ++i) {
            var filter = filters[i];
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
            popupContent = '<h4>' + loc.title + '</h4>';

        for (var i = 0; i < errors.length; ++i) {
            popupContent += '<p>' + loc[errors[i]] + '</p>';
        }

        popup.show(popupTitle, popupContent, [closeButton]);
    }
});