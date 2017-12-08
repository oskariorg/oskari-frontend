Oskari.clazz.define('Oskari.statistics.statsgrid.SelectedIndicatorsMenu', function(service) {

    this.service = service;
    this.sb = service.getSandbox();
    this.element = null;
    this._renderState = {
        inProgress: false,
        el: null,
        repaint: false
    };
    this.addEventHandlers();
}, {
    __templates: {
        select: jQuery('<div class="dropdown"></div>')
    },
    render: function(el) {
        var me = this;
        if(this.element) {
            // already rendered, just move the element to new el when needed
            if(el !== this.element.parent()) {
                this.element.detach();
                el.append(this.element);
            }
            return;
        }
        if(this._renderState.inProgress) {
            // handle render being called multiple times in quick succession
            // previous render needs to end before repaint since we are doing async stuff
            this._renderState.repaint = true;
            this._renderState.el = el;
            // need to call this._renderDone(); to trigger repaint after render done
            return;
        }
        this._renderState.inProgress = true;
        var container = me.__templates.select.clone();
        this.element = container;
        var dropdownOptions = {
            placeholder_text: "",
            allow_single_deselect: true,
            disable_search_threshold: 10,
            no_results_text: "locale.panels.newSearch.noResults",
            width: '100%'
        };
        this._getIndicatorUILabels(function(options) {
            var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
            var dropdown = select.create(options, dropdownOptions);
            dropdown.css({
                width: '100%'
            });
            select.adjustChosen();
            select.selectFirstValue();
            me._select = select;

            container.append(dropdown);
            container.on('change', function(event) {
                me.service.getStateService().setActiveIndicator(select.getValue());
            });
            me._renderDone();
        });
        el.append(container);
    },
    /****** PRIVATE METHODS ******/
    /**
     * Triggers a new render when needed (if render was called before previous was finished)
     */
    _renderDone : function() {
        var state = this._renderState;
        this._renderState = {};
        if(state.repaint) {
            this.render(state.el);
        }
    },
    _getIndicatorUILabels: function(callback) {
        var options = [];
        var indicators = this.service.getStateService().getIndicators();
        if(!indicators.length) {
            // no indicators to list
            callback(options);
            return;
        }
        var me = this;
        var count = 0;
        indicators.forEach(function(option) {
            me.service.getUILabels(option, function (label) {
                count++;
                options.push({
                    id: option.hash,
                    title: label.full
                });
                if(count === indicators.length) {
                    callback(options);
                }
            });
        });
    },

    addEventHandlers: function() {
        var me = this;
        this.service.on('StatsGrid.ActiveIndicatorChangedEvent', function(event) {
            var current = event.getCurrent();
            if (current && me._select) {
                me._select.setValue(current.hash);
            }
        });
        this.service.on('StatsGrid.IndicatorEvent', function(event) {
            if(!me._select) {
                return;
            }
            var hash = me.service.getStateService().getHash(event.getDatasource(), event.getIndicator(), event.getSelections());
            if (event.isRemoved()) {
                me._select.removeOption(hash);
                return;
            }
            // add new option
            me._getIndicatorUILabels(function(options) {
                options.forEach(function(opt) {
                    if(opt.id === hash) {
                        me._select.addOption(opt);
                    }
                });
            });
        });
    }

});