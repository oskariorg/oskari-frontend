Oskari.clazz.define('Oskari.statistics.statsgrid.Legend', function(instance) {
    this.instance = instance;
    this.sb = this.instance.getSandbox();
    this.service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
    this.classificationService = this.sb.getService('Oskari.statistics.statsgrid.ClassificationService');
    this.spinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
    this.locale = this.instance.getLocalization();
    this._bindToEvents();
    this.__templates = {
        legendContainer: jQuery('<div class="statsgrid-legend-container"></div>'),
        noActiveSelection: jQuery('<div class="legend-noactive">'+this.locale.legend.noActive+'</div>'),
        noEnoughData: jQuery('<div class="legend-noactive">'+this.locale.legend.noEnough+'</div>'),
        classifications: jQuery('<div class="classifications">'+
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
    this.__legendElement = this.__templates.legendContainer.clone();
    this.log = Oskari.log('Oskari.statistics.statsgrid.Legend');
    this._panel = null;
    this._accordion = null;
    this._container = jQuery('<div class="accordion-theming"></div>');
    this._colorSelect = null;
    this._selectedColorIndex = 0;
    this._notHandleColorSelect = false;
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

        me.service.on('StatsGrid.RegionsetChangedEvent', function (event) {
            me._handleRegionsetChanged(event.getRegionset());
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
		me.__legendElement.html(me.__templates.noActiveSelection.clone());
        this._initSelections();
	},

    /**
     * @method  @private _handleIndicatorChanged handle active indicator changed
     * @return {[type]} [description]
     */
	_handleIndicatorChanged: function() {
		this._renderActiveIndicator();
        this._initSelections();
	},

    /**
     * @method  @private _renderActiveIndicator render active indicator changed
     */
    _renderActiveIndicator: function(){
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

        me.__legendElement.empty();

        service.getIndicatorData(ind.datasource, ind.indicator, ind.selections, state.getRegionset(), function(err, data) {
            if(err) {
                me.log.warn('Error getting indicator data', ind.datasource, ind.indicator, ind.selections, state.getRegionset());
                me.__legendElement.html(me.__templates.noEnoughData.clone());
                return;
            }
            var classify = service.getClassificationService().getClassification(data);

            if(!classify) {
                me.log.warn('Error getting indicator classification', data);
                me.__legendElement.html(me.__templates.noEnoughData.clone());
                return;
            }

            // format regions to groups for url
            var regiongroups = classify.getGroups();
            var classes = [];
            regiongroups.forEach(function(group) {
                // make each group a string separated with comma
                classes.push(group.join());
            });

            var colorsWithoutHash = service.getColorService().getColorset(regiongroups.length);
            var colors = [];
            colorsWithoutHash.forEach(function(color) {
                colors.push('#' + color);
            });

            var stateService = service.getStateService();

            service.getIndicatorMetadata(ind.datasource, ind.indicator, function(err, indicator) {
                if(err) {
                    me.log.warn('Error getting indicator metadata', ind.datasource, ind.indicator);
                    return;
                }

                service.getSelectionsText(ind, me.instance.getLocalization().panels.newSearch, function(text){
                    var legend = classify.createLegend(colors, me.locale.statsgrid.source + ' ' + stateService.getIndicatorIndex(ind.hash) + ': ' + Oskari.getLocalized(indicator.name) + text);
                    var jQueryLegend = jQuery(legend);
                    var isAccordion = true;

                    if(!me._accordion) {
                        me._accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');

                        me._panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
                        me._panel.setVisible(true);
                        me._panel.setTitle(me.locale.classify.editClassifyTitle);
                        me._panel.setContent(me._getEditClassifyContent());
                        me._accordion.addPanel(me._panel);
                        me._accordion.insertTo(me._container);
                        isAccordion = false;
                    }

                    if(!me._colorSelect) {
                        me._colorSelect = Oskari.clazz.create('Oskari.userinterface.component.ColorSelect');

                        me._colorSelect.setHandler(function(selected){
                            if(!me._notHandleColorSelect) {
                                me._selectedColorIndex = selected;
                                me.service.getStateService().setClassification(ind.hash, me._getSelections());
                            }
                        });

                        var el = me._colorSelect.getElement();
                        me._container.find('.classification-colors.value').append(el);
                    }
                    me._container.insertAfter(jQueryLegend.find('.geostats-legend-title'));

                    me.__legendElement.append(jQueryLegend);

                    // FIXME some timing issue when showing classification second or more times
                    // the accordion header clicks not handlet correctly. Thats why we add custom click handler.
                    if(isAccordion) {
                        setTimeout(function(){
                            me.addEditHandlers();
                        }, 200);
                    } else {
                         setTimeout(function(){
                            me._initSelections();
                        }, 200);
                    }

                    setTimeout(function(){
                        me.addSelectHandlers();
                    }, 200);

                });

            });
        });
    },

    _getEditClassifyContent: function(){
        var me = this;
        var classifyOptions = me.__templates.classifications.clone();
        return classifyOptions;
    },

    _changeColors: function(classification){
        var me = this;
        me._selectedColorIndex = 0;
        if(classification && typeof classification.colorIndex ==='number') {
            me._selectedColorIndex = classification.colorIndex;
        }
        classification = classification || me._getSelections();

        me._colorSelect.setColorValues(me.service.getColorService().getColors(classification.type, classification.count));
        me._notHandleColorSelect = true;
        me._colorSelect.setValue(classification.colorIndex);
        me._notHandleColorSelect = false;
    },

    // Do when state changed or initialized
    _initSelections: function(classification){
        var me = this;

        var state = me.service.getStateService();
        var ind = state.getActiveIndicator();
        classification = classification || state.getClassification(ind.hash);

        me._container.find('select.method').val(classification.method);

        var amountRange = me.service.getColorService().getRange(classification.type);
        var amount = me._container.find('select.amount-class');
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
        me._container.find('select.amount-class').val(classification.count);
        me._container.find('select.classify-mode').val(classification.mode);
        me._container.find('select.color-set').val(classification.type);
        me._changeColors(classification.colorIndex);
    },

    _getSelections: function(){
        var me = this;
        return {
            method: me._container.find('select.method').val(),
            count: parseFloat(me._container.find('select.amount-class').val()),
            mode: me._container.find('select.classify-mode').val(),
            type: me._container.find('select.color-set').val(),
            colorIndex: parseFloat(me._selectedColorIndex)
        };
    },

    /****** PUBLIC METHODS ******/

    /**
     * @method  @public getClassification get classification element
     * @return {Object} jQuery element of classification
     */
    getClassification: function(){
        var me = this;
        me.__legendElement.html(me.__templates.noActiveSelection.clone());
        me._renderActiveIndicator();
        return me.__legendElement;
    },

    addEditHandlers: function(){
        var me = this;
        if(!me.__legendElement || !me._panel) {
            return;
        }
        me.__legendElement.find('.accordion_panel').click(function(){
            var el = jQuery(this);

            if(el.hasClass('open')) {
                me._panel.close();
            } else {
                me._panel.open();
            }
        });

    },

    addSelectHandlers: function(){
        var me = this;
        if(!me.__legendElement || !me._panel) {
            return;
        }
        me.__legendElement.find('select').unbind('click');
        me.__legendElement.find('select').bind('click', function(event){
            event.stopPropagation();
        });
        me.__legendElement.find('select').unbind('change');
        me.__legendElement.find('select').bind('change', function(event){
            event.stopPropagation();
            me._changeColors();

            var state = me.service.getStateService();
            var ind = state.getActiveIndicator();
            me.service.getStateService().setClassification(ind.hash, me._getSelections());
        });
    }

});