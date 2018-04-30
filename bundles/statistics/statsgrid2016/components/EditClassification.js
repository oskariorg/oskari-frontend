Oskari.clazz.define('Oskari.statistics.statsgrid.EditClassification', function (sandbox, locale) {
    this.sb = sandbox;
    this.LAYER_ID = 'STATS_LAYER';
    this.service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.classificationService = this.sb.getService('Oskari.statistics.statsgrid.ClassificationService');
    this.locale = locale;
    var me = this;
    me.service.on('StatsGrid.ClassificationChangedEvent', function (event) {
        me.setValues(event.getCurrent());
    });
    me.service.on('AfterChangeMapLayerOpacityEvent', function (event) {
        me.setLayerOpacityValue(event.getMapLayer());
    });
    this.__templates = {
        classification: jQuery('<div class="classifications">'+
            '<div class="classification-options">'+
                // map style
                '<div class="classification-map-style visible-map-style-choropleth visible-map-style-points visible-on-vector">'+
                    '<div class="label">'+ this.locale('classify.map.mapStyle') +'</div>'+
                    '<div class="map-style value">'+
                        '<select class="map-style">'+
                            '<option value="choropleth" selected="selected">'+this.locale('classify.map.choropleth')+'</option>'+
                            '<option value="points">'+this.locale('classify.map.points')+'</option>'+
                        '</select>'+
                    '</div>'+
                '</div>'+

                // method
                '<div class="classification-method visible-map-style-choropleth visible-map-style-points">'+
                    '<div class="label">'+ this.locale('classify.classifymethod') +'</div>'+
                    '<div class="method value">'+
                        '<select class="method">'+
                            // FIXME: use classificationService.getAvailableMethods()
                            '<option value="jenks" selected="selected">'+this.locale('classify.methods.jenks')+'</option>'+
                            '<option value="quantile">'+this.locale('classify.methods.quantile')+'</option>'+
                            '<option value="equal">'+this.locale('classify.methods.equal')+'</option>'+
                        '</select>'+
                    '</div>'+
                '</div>'+

                // classes
                '<div class="classification-count visible-map-style-choropleth visible-map-style-points">'+
                    // use colorService.getOptionsForType()
                    '<div class="label">'+ this.locale('classify.classes') +'</div>'+
                    '<div class="amount-class value">'+
                        '<select class="amount-class">'+
                        '</select>'+
                    '</div>'+
                '</div>'+

                // classify mode
                '<div class="classification-mode visible-map-style-choropleth visible-map-style-points">'+
                    '<div class="label">'+ this.locale('classify.mode') +'</div>'+
                    '<div class="classify-mode value">'+
                        '<select class="classify-mode">'+
                            // FIXME: use classificationService.getAvailableModes()
                            '<option value="distinct" selected="selected">'+ this.locale('classify.modes.distinct') +'</option>'+
                            '<option value="discontinuous">'+ this.locale('classify.modes.discontinuous') +'</option>'+
                        '</select>'+
                    '</div>'+
                '</div>'+

                // points size
                '<div class="point-size oskariui visible-map-style-points visible-on-vector">'+
                    '<div class="label">'+ this.locale('classify.map.pointSize') +'</div>'+
                    '<div class="minmaxlabels"><div class="min">'+ this.locale('classify.map.min') +'</div><div class="max">'+ this.locale('classify.map.max') +'</div><div class="clear"></div></div>' +
                    '<div class="point-range value">'+
                    '</div>'+
                '</div>'+

                // numeric value
                '<div class="numeric-value visible-map-style-points visible-on-vector">'+
                '</div>'+

                // colors
                '<div class="classification-colors visible-map-style-choropleth visible-map-style-points">'+
                    '<div class="label visible-map-style-choropleth">'+ this.locale('colorset.button') +'</div>'+
                    '<div class="label visible-map-style-points">'+ this.locale('classify.map.color') +'</div>'+
                    '<div class="classification-colors value">'+

                    '</div>'+
                    '<span class="visible-map-style-choropleth flip-colors"><input id="legend-flip-colors" type="checkbox"/><label for="legend-flip-colors">'+this.locale('colorset.flipButton')+'<label></span>'+
                '</div>'+

                // transparency
                '<div class="point-transparency visible-map-style-points visible-on-vector">'+
                    '<div class="label">'+ this.locale('classify.map.transparency') +'</div>'+
                    '<div class="transparency-value value">'+
                        '<select class="transparency-value">'+
                        '</select>'+
                    '</div>'+
                '</div>'+

                '<div class="classification-color-set visible-map-style-choropleth">'+
                    '<div class="label">'+ this.locale('colorset.setselection') +'</div>'+
                    '<div class="color-set value">'+
                        '<select class="color-set">'+
                            // FIXME: use colorService getAvailableTypes()
                            '<option value="seq" selected="selected">'+ this.locale('colorset.seq') +'</option>'+
                            '<option value="qual">'+ this.locale('colorset.qual') +'</option>'+
                            '<option value="div">'+ this.locale('colorset.div') +'</option>'+
                        '</select>'+
                    '</div>'+
                '</div>'+
            '</div>'+
            '</div>')

    };

    var transparencyEl = this.__templates.classification.find('select.transparency-value');
    for (var i = 100; i >= 30; i -= 10) {
        transparencyEl.append('<option value="' + i + '">' + i + ' %</option>');
    }
    this.__templates.classification.find('select.transparency-value option[value=100]').attr('selected', 'selected');

    this.log = Oskari.log('Oskari.statistics.statsgrid.EditClassification');

    this._colorSelect = null;
    this._element = null;
    this._rangeSlider = {
        min: 10,
        max: 120,
        defaultValues: [10,60],
        step: 5,
        element: null
    };
    this._showNumericValueCheckButton = null;
}, {
    _toggleMapStyle: function (mapStyle) {
        var me = this;
        var style = mapStyle || 'choropleth';
        me._element.find('.visible-map-style-points').hide();
        me._element.find('.visible-map-style-choropleth').hide();
        me._element.find('.visible-map-style-' + style).show();
    },
    setLayerOpacityValue: function (layer) {
        var me = this;
        if (me.hasSelectChange) {
            me.hasSelectChange = false;
            return;
        }
        if (layer.getId() === me.LAYER_ID) {
            var transparencyEl = me._element.find('select.transparency-value');
            transparencyEl.find('option#hiddenvalue').remove();
            var hiddenOption = jQuery('<option id="hiddenvalue" disabled hidden>' + layer.getOpacity() + ' %' +'</option>');
            hiddenOption.attr('value', layer.getOpacity());
            hiddenOption.hide();
            hiddenOption.attr('selected', 'selected');
            transparencyEl.append(hiddenOption);
            transparencyEl.trigger('chosen:updated');

        }
    },
    /**
     * @method setValues init selections
     * @param  {Object} classification options. Defaults to current active indicator options
     */
    setValues: function (classification) {
        var me = this;

        if (!this._element) {
            // not rendered yet
            return;
        }
        var service = me.service;
        var state = service.getStateService();
        var ind = state.getActiveIndicator();
        if (!ind) {
            // no active indicator
            return;
        }
        classification = classification || state.getClassificationOpts(ind.hash);

        me._element.find('select.map-style').bind('change', function () {
            var el = jQuery(this);
            var value = el.val();
            me._toggleMapStyle(value);
        });

        var mapStyle = classification.mapStyle || 'choropleth';
        me._element.find('select.map-style').val(mapStyle);
        me._toggleMapStyle(mapStyle);

        me._element.find('select.method').val(classification.method);

        var amountRange = service.getColorService().getRange(classification.type, mapStyle);
        // TODO: handle missing data: if we have data for 3 regions count can be 2.
        // If we have data for 2 regions, no classification can be done.
        var amount = me._element.find('select.amount-class');
        amount.empty();
        var option = jQuery('<option></option>');
        for (var i = amountRange.min; i < amountRange.max + 1; i++) {
            var op = option.clone();
            op.html(i);
            op.attr('value', i);
            amount.append(op);
        }
        me._element.find('select.amount-class').val(classification.count);

        me._element.find('select.classify-mode').val(classification.mode);
        me._element.find('select.color-set').val(classification.type);
        me._element.find('#legend-flip-colors').attr('checked', classification.reverseColors);
        // update color selection values
        var colors = service.getColorService().getDefaultSimpleColors();
        if (mapStyle === 'choropleth') {
            colors = service.getColorService().getOptionsForType(classification.type, classification.count, classification.reverseColors);
        }

        me._colorSelect.setColorValues(colors);
        me._colorSelect.setValue(classification.name, true, true);
        me._colorSelect.refresh();

        // disable invalid choices
        service.getIndicatorData(ind.datasource, ind.indicator, ind.selections, state.getRegionset(), function (err, data) {
            if (err) {
                // propably nothing to tell the user at this point. There will be some invalid choices available on the form
                return;
            }
            var validOptions = service.getClassificationService().getAvailableOptions(data);
            if (validOptions.maxCount) {
                var options = amount.find('option');
                options.each(function (index, opt) {
                    opt = jQuery(opt);
                    if (opt.val() > validOptions.maxCount) {
                        opt.attr('disabled', true);
                    }
                });
            }

        });
        var min = classification.min || me._rangeSlider.defaultValues[0];
        var max = classification.max || me._rangeSlider.defaultValues[1];
        var updateClassification = false;

        if (max - min < classification.count * (me._rangeSlider.step || 1)) {
            min = me._rangeSlider.defaultValues[0];
            max = me._rangeSlider.defaultValues[1];
            updateClassification = true;
        }
        me._rangeSlider.element.slider('values', [min, max]);
        me._rangeSlider.element.attr('data-count', classification.count || amountRange[0]);
        me._showNumericValueCheckButton.setChecked((typeof classification.showValues === 'boolean') ? classification.showValues : false);

        if (updateClassification) {
            state.setClassification(ind.hash, me.getSelectedValues(), true);
        }

        if (classification.transparency) {
            me.sb.postRequestByName('ChangeMapLayerOpacityRequest', [me.LAYER_ID, classification.transparency]);
        }
    },

    /**
     * @method  @public getSelectedValues gets selected values
     * @return {Object} selected values object
     */
    getSelectedValues: function () {
        var me = this;
        var range = me._rangeSlider.element.slider('values');
        var values = {
            method: me._element.find('select.method').val(),
            count: parseFloat(me._element.find('select.amount-class').val()),
            mode: me._element.find('select.classify-mode').val(),
            type: me._element.find('select.color-set').val(),
            name: me._colorSelect.getValue(),
            reverseColors: me._element.find('#legend-flip-colors').is(':checked'),
            mapStyle: me._element.find('select.map-style').val(),
            // only used for points vector
            min: range[0],
            max: range[1],
            transparency: me._element.find('select.transparency-value').val(),
            showValues: (me._showNumericValueCheckButton.getValue() === 'on')
        };

        if (values.mapStyle !== 'points') {
            delete values.min;
            delete values.max;
            delete values.transparency;
        } else {
            delete values.type;
        }

        return values;
    },

    /**
     * @method  @public getElement  get element
     * @return {Object} jQuery element object
     */
    getElement: function () {
        var me = this;
        var service = me.service;
        if (!service) {
            // not available yet
            return;
        }
        if (me._element) {
            return me._element;
        }
        me._element = me.__templates.classification.clone();

        if (!service.hasMapMode('vector')) {
            me._element.find('.visible-on-vector').remove();
        }
        if (!me._colorSelect) {
            me._colorSelect = Oskari.clazz.create('Oskari.userinterface.component.ColorSelect');
        }
        me._element.find('.classification-colors.value').append(me._colorSelect.getElement());

        var stateService = me.service.getStateService();
        var updateClassification = function () {
            me.hasSelectChange = true;
            stateService.setClassification(stateService.getActiveIndicator().hash, me.getSelectedValues());
        };

        if (!me._rangeSlider.element) {
            me._rangeSlider.element = me._element.find('.point-range');

            me._rangeSlider.element.slider({
                min: me._rangeSlider.min,
                max: me._rangeSlider.max,
                step: me._rangeSlider.step,
                range: true,
                values: [me._rangeSlider.defaultValues[0], me._rangeSlider.defaultValues[1]],
                slide: function (event, ui) {
                    var min = ui.values[0];
                    var max = ui.values[1];
                    var el = jQuery(this);
                    var count = (!isNaN(el.attr('data-count'))) ? parseFloat(el.attr('data-count')) : 2;
                    if (max - min >= count * (me._rangeSlider.step || 1)) {
                        return true;
                    }
                    return false;
                },
                stop: function () {
                    updateClassification();
                }
            });
        }

        if (!me._showNumericValueCheckButton) {
            me._showNumericValueCheckButton = Oskari.clazz.create('Oskari.userinterface.component.CheckboxInput');
            me._showNumericValueCheckButton.setTitle(me.locale('classify.map.showValues'));
            me._showNumericValueCheckButton.setHandler(function () {
                updateClassification();
            });
            me._element.find('.numeric-value').append(me._showNumericValueCheckButton.getElement());
        }

        // setup initial values
        me.setValues();
        // might have been set before render
        this.setEnabled(this.__enabled);

        me._colorSelect.setHandler(updateClassification);
        me._element.find('select').on('change', updateClassification);

        me._element.find('#legend-flip-colors').on('change', function () {
            updateClassification();
        });
        return me._element;
    },
    /**
     * @method  @public setEnabled set enabled
     * @param {Boolean} enabled is edit enabled or not
     */
    setEnabled: function (enabled) {
        var me = this;
        if (typeof enabled !== 'boolean') {
            return;
        }
        this.__enabled = !!enabled;
        if (!this._element) {
            // not rendered yet
            return;
        }
        me._element.find('select').prop('disabled', !enabled).trigger('chosen:updated');
        me._element.find('button').prop('disabled', !enabled);
        me._colorSelect.setEnabled(enabled);
        me._element.find('.point-range').slider('option','disabled', !enabled);
    }
});
