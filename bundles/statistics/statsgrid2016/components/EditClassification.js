Oskari.clazz.define('Oskari.statistics.statsgrid.EditClassification', function(instance) {
    this.instance = instance;
    this.sb = this.instance.getSandbox();
    this.service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.classificationService = this.sb.getService('Oskari.statistics.statsgrid.ClassificationService');
    this.locale = this.instance.getLocalization();
    this._bindToEvents();
    this.__templates = {
        classification: jQuery('<div class="classifications">'+
            '<div class="classification-options">'+
                '<div class="classification-method">'+
                    '<div class="label">'+ this.locale.classify.classifymethod +'</div>'+
                    '<div class="method value">'+
                        '<select class="method">'+
                            '<option value="jenks" selected="selected">'+this.locale.classify.jenks+'</option>'+
                            '<option value="quantile">'+this.locale.classify.quantile+'</option>'+
                            '<option value="equal">'+this.locale.classify.eqinterval+'</option>'+
//                            '<option value="4">'+this.locale.classify.manual+'</option>'+
                        '</select>'+
                    '</div>'+
                '</div>'+

                '<div class="classification-count">'+
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
                            '<option value="seq" selected="selected">'+ this.locale.colorset.sequential +'</option>'+
                            '<option value="qual">'+ this.locale.colorset.qualitative +'</option>'+
                            '<option value="div">'+ this.locale.colorset.divergent +'</option>'+
                        '</select>'+
                    '</div>'+
                '</div>'+

            '</div>'+

            '</div>')

    };

    this.log = Oskari.log('Oskari.statistics.statsgrid.EditClassification');

    this._colorSelect = null;
    this._notHandleColorSelect = false;
    this._element = null;
}, {
    /****** PRIVATE METHODS ******/

    /**
     * @method  @private _bindToEvents bind events
     */
    _bindToEvents : function() {
        var me = this;

        me.service.on('StatsGrid.ActiveIndicatorChangedEvent', function(event) {
            var ind = event.getCurrent();
            if(!ind) {
                // last indicator was removed -> no active indicators
                me._handleIndicatorRemoved();
            } else {
                // active indicator changed -> update map
                me._handleIndicatorChanged(ind.datasource, ind.indicator, ind.selections);
            }
        });

        me.service.on('StatsGrid.ClassificationChangedEvent', function(event) {
            me._handleClassificationChangedEvent(event.getCurrent());
        });

    },
    _handleClassificationChangedEvent: function(current){
        var me = this;
        me._initSelections(current);
    },

    /**
     * @method  @private _handleIndicatorRemoved handle indicator removed
     */
    _handleIndicatorRemoved: function(){
        var me = this;
        this._initSelections();
    },

    /**
     * @method  @private _handleIndicatorChanged handle active indicator changed
     * @return {[type]} [description]
     */
    _handleIndicatorChanged: function() {
        this._initSelections();
    },

    /**
     * @method  @private _changeColors change colors
     * @param  {Object} classification object
     */
    _changeColors: function(classification){
        var me = this;
        classification = classification || me.getSelectedValues();
        var colors = me.service.getColorService().getColors(classification.type, classification.count, classification.reverseColors);

        me._colorSelect.setColorValues(colors);
        me._notHandleColorSelect = true;
        me._colorSelect.setValue(classification.colorIndex);
        me._notHandleColorSelect = false;
    },

    /**
     * @method  @private _initSelections init selections
     * @param  {Object} classification
     */
    _initSelections: function(classification){
        var me = this;

        var state = me.service.getStateService();
        var ind = state.getActiveIndicator();
        classification = classification || state.getClassification(ind.hash);

        me._element.find('select.method').val(classification.method);

        var amountRange = me.service.getColorService().getRange(classification.type);
        var amount = me._element.find('select.amount-class');
        amount.empty();
        var option = jQuery('<option></option>');
        for(var i=amountRange.min;i<amountRange.max+1;i++) {
            var op = option.clone();
            if(i===5) {
                op.attr('selected', 'selected');
            }
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

        me._addSelectHandlers();
        me._changeColors(classification);
    },

    /**
     * @method @private _addSelectHandlers add select handlers
     */
    _addSelectHandlers: function(){
        var me = this;
        if(!me._element) {
            return;
        }

        var state = me.service.getStateService();
        var ind = state.getActiveIndicator();
        if(!ind) {
            return;
        }

        me._element.find('select').unbind('change');
        me._element.find('select').bind('change', function(event){
            event.stopPropagation();

            var state = me.service.getStateService();
            var ind = state.getActiveIndicator();
            me.service.getStateService().setClassification(ind.hash, me.getSelectedValues());
            me._changeColors();
        });

        me._element.find('button.reverse-colors').unbind('click');
        me._element.find('button.reverse-colors').bind('click', function(){
            var el = jQuery(this);
            if(el.hasClass('primary')) {
                el.removeClass('primary');
            } else {
                el.addClass('primary');
            }
            me.service.getStateService().setClassification(ind.hash, me.getSelectedValues());
        });

        me._colorSelect.refresh();
    },


    /****** PUBLIC METHODS ******/

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
            colorIndex: me._colorSelect.getValue(),
            reverseColors: me._element.find('button.reverse-colors').hasClass('primary')
        };
    },

    refresh: function(){
        var me = this;
        me._addSelectHandlers();
    },


    /**
     * @method  @public getElement  get element
     * @return {Object} jQuery element object
     */
    getElement: function(){
        var me = this;
        var service = me.service;
        if(!service) {
            // not available yet
            return;
        }

        var state = service.getStateService();
        var ind = state.getActiveIndicator();
        if(!ind) {
            return;
        }
        if(!me._element){
            me._element = me.__templates.classification.clone();
        }

        if(!me._colorSelect) {
            me._colorSelect = Oskari.clazz.create('Oskari.userinterface.component.ColorSelect');
            var el = me._colorSelect.getElement();
            me._element.find('.classification-colors.value').append(el);
        }

        me._colorSelect.setHandler(function(selected){
            if(!me._notHandleColorSelect) {
                me.service.getStateService().setClassification(ind.hash, me.getSelectedValues());
            }
        });

        me._initSelections();

        return me._element;

    },

    /**
     * @method  @public changeColors Change colors
     * @param  {Object} classification classification object
     */
    changeColors: function(classification){
        var me = this;
        classification = classification || me.getSelectedValues();
        var colors = me.service.getColorService().getColors(classification.type, classification.count, classification.reverseColors);

        me._colorSelect.setColorValues(colors);
        me._notHandleColorSelect = true;
        me._colorSelect.setValue(classification.colorIndex);
        me._notHandleColorSelect = false;
    },

    /**
     * @method  @public setEnabled set enabled
     * @param {Boolean} enabled is edit enabled or not
     */
    setEnabled: function(enabled){
        var me = this;
        if(typeof enabled !== 'boolean') {
            return;
        }
        me._element.find('select').prop('disabled', !enabled).trigger('chosen:updated');
        me._element.find('button').prop('disabled', !enabled);
        me._colorSelect.setEnabled(enabled);
    }

});