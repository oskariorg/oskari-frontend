Oskari.clazz.define('Oskari.statistics.statsgrid.EditClassification', function(sandbox, locale) {
    this.sb = sandbox;
    this.service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.classificationService = this.sb.getService('Oskari.statistics.statsgrid.ClassificationService');
    this.locale = locale;
    var me = this;
    me.service.on('StatsGrid.ClassificationChangedEvent', function(event) {
        me.setValues(event.getCurrent());
    });
    this.__templates = {
        classification: jQuery('<div class="classifications">'+
            '<div class="classification-options">'+
                '<div class="classification-method">'+
                    '<div class="label">'+ this.locale.classify.classifymethod +'</div>'+
                    '<div class="method value">'+
                        '<select class="method">'+
                            // FIXME: use classificationService.getAvailableMethods()
                            '<option value="jenks" selected="selected">'+this.locale.classify.methods.jenks+'</option>'+
                            '<option value="quantile">'+this.locale.classify.methods.quantile+'</option>'+
                            '<option value="equal">'+this.locale.classify.methods.equal+'</option>'+
                        '</select>'+
                    '</div>'+
                '</div>'+

                '<div class="classification-count">'+
                    // use colorService.getOptionsForType()
                    '<div class="label">'+ this.locale.classify.classes +'</div>'+
                    '<div class="amount-class value">'+
                        '<select class="amount-class">'+
                        '</select>'+
                    '</div>'+
                '</div>'+

                '<div class="classification-mode">'+
                    '<div class="label">'+ this.locale.classify.mode +'</div>'+
                    '<div class="classify-mode value">'+
                        '<select class="classify-mode">'+
                            // FIXME: use classificationService.getAvailableModes()
                            '<option value="distinct" selected="selected">'+ this.locale.classify.modes.distinct +'</option>'+
                            '<option value="discontinuous">'+ this.locale.classify.modes.discontinuous +'</option>'+
                        '</select>'+
                    '</div>'+
                '</div>'+

                '<div class="classification-colors">'+
                    '<div class="label">'+ this.locale.colorset.button +'</div>'+
                    '<div class="classification-colors value">'+

                    '</div>'+
                    '<button class="reverse-colors">'+this.locale.colorset.flipButton+'</button>'+
                '</div>'+

                '<div class="classification-color-set">'+
                    '<div class="label">'+ this.locale.colorset.setselection +'</div>'+
                    '<div class="color-set value">'+
                        '<select class="color-set">'+
                            // FIXME: use colorService getAvailableTypes()
                            '<option value="seq" selected="selected">'+ this.locale.colorset.seq +'</option>'+
                            '<option value="qual">'+ this.locale.colorset.qual +'</option>'+
                            '<option value="div">'+ this.locale.colorset.div +'</option>'+
                        '</select>'+
                    '</div>'+
                '</div>'+

            '</div>'+

            '</div>')

    };

    this.log = Oskari.log('Oskari.statistics.statsgrid.EditClassification');

    this._colorSelect = null;
    this._element = null;
}, {
    /**
     * @method setValues init selections
     * @param  {Object} classification options. Defaults to current active indicator options
     */
    setValues: function(classification){
        var me = this;

        if(!this._element) {
            // not rendered yet
            return;
        }
        var service = me.service;
        var state = service.getStateService();
        var ind = state.getActiveIndicator();
        if(!ind) {
            // no active indicator
            return;
        }
        classification = classification || state.getClassificationOpts(ind.hash);
        me._element.find('select.method').val(classification.method);

        var amountRange = service.getColorService().getRange(classification.type);
        // TODO: handle missing data: if we have data for 3 regions count can be 2.
        // If we have data for 2 regions, no classification can be done.
        var amount = me._element.find('select.amount-class');
        amount.empty();
        var option = jQuery('<option></option>');
        for(var i=amountRange.min;i<amountRange.max+1;i++) {
            var op = option.clone();
            op.html(i);
            op.attr('value', i);
            amount.append(op);
        }
        me._element.find('select.amount-class').val(classification.count);
        me._element.find('select.classify-mode').val(classification.mode);
        me._element.find('select.color-set').val(classification.type);
        if(classification.reverseColors) {
            me._element.find('button.reverse-colors').addClass('primary');
        } else {
            me._element.find('button.reverse-colors').removeClass('primary');
        }
        // update color selection values
        var colors = service.getColorService().getOptionsForType(classification.type, classification.count, classification.reverseColors);
        me._colorSelect.setColorValues(colors);
        me._colorSelect.setValue(classification.name, true, true);
        me._colorSelect.refresh();

        // disable invalid choices
        service.getIndicatorData(ind.datasource, ind.indicator, ind.selections, state.getRegionset(), function(err, data) {
            if(err) {
                // propably nothing to tell the user at this point. There will be some invalid choices available on the form
                return;
            }
            var validOptions = service.getClassificationService().getAvailableOptions(data);
            if(validOptions.maxCount) {
                var options = amount.find('option');
                options.each(function(index, opt) {
                    opt = jQuery(opt);
                    if(opt.val() > validOptions.maxCount) {
                        opt.attr('disabled', true);
                    }
                });
            }

        });
    },

    /**
     * @method  @public getSelectedValues gets selected values
     * @return {Object} selected values object
     */
    getSelectedValues: function(){
        var me = this;
        return {
            method: me._element.find('select.method').val(),
            count: parseFloat(me._element.find('select.amount-class').val()),
            mode: me._element.find('select.classify-mode').val(),
            type: me._element.find('select.color-set').val(),
            name: me._colorSelect.getValue(),
            reverseColors: me._element.find('button.reverse-colors').hasClass('primary')
        };
    },

    /**
     * @method  @public getElement  get element
     * @return {Object} jQuery element object
     */
    getElement: function() {
        var me = this;
        var service = me.service;
        if(!service) {
            // not available yet
            return;
        }
        if(me._element) {
            return me._element;
        }
        me._element = me.__templates.classification.clone();
        me._colorSelect = Oskari.clazz.create('Oskari.userinterface.component.ColorSelect');
        me._element.find('.classification-colors.value').append(me._colorSelect.getElement());

        // setup initial values
        me.setValues();
        // might have been set before render
        this.setEnabled(this.__enabled);

        var stateService = me.service.getStateService();
        var updateClassification = function() {
            stateService.setClassification(stateService.getActiveIndicator().hash, me.getSelectedValues());
        };
        me._colorSelect.setHandler(updateClassification);
        me._element.find('select').bind('change', updateClassification);

        me._element.find('button.reverse-colors').bind('click', function(){
            var el = jQuery(this);
            if(el.hasClass('primary')) {
                el.removeClass('primary');
            } else {
                el.addClass('primary');
            }
            updateClassification();
        });
        return me._element;

    },
    /**
     * @method  @public setEnabled set enabled
     * @param {Boolean} enabled is edit enabled or not
     */
    setEnabled: function(enabled) {
        var me = this;
        if(typeof enabled !== 'boolean') {
            return;
        }
        this.__enabled = !!enabled;
        if(!this._element) {
            // not rendered yet
            return;
        }
        me._element.find('select').prop('disabled', !enabled).trigger('chosen:updated');
        me._element.find('button').prop('disabled', !enabled);
        me._colorSelect.setEnabled(enabled);
    }

});