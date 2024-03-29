Oskari.clazz.define('Oskari.statistics.statsgrid.SelectedIndicatorsMenu', function (service) {
    this.service = service;
    this.sb = service.getSandbox();
    this.element = null;
    this._renderState = {
        inProgress: false,
        el: null,
        repaint: false
    };
    this.addEventHandlers();
    this.locale = Oskari.getMsg.bind(null, 'StatsGrid');
}, {
    __templates: {
        select: jQuery('<div class="dropdown"></div>')
    },
    render: function (el) {
        var me = this;
        if (this.element) {
            // already rendered, just move the element to new el when needed
            if (el !== this.element.parent()) {
                this.element.detach();
                el.append(this.element);
            }
            return;
        }
        if (this._renderState.inProgress) {
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
            placeholder_text: this.locale('panels.newSearch.selectIndicatorPlaceholder'),
            allow_single_deselect: true,
            disable_search_threshold: 10,
            no_results_text: this.locale('panels.newSearch.noResults'),
            width: '100%'
        };
        this._getIndicatorUILabels(function (options) {
            var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList');
            me._select = select;
            var dropdown = select.create(options, dropdownOptions);
            me.dropdown = dropdown;
            dropdown.css({
                width: '100%',
                'max-width': '380px'
            });
            select.adjustChosen();

            var activeIndicator = me.service.getStateService().getActiveIndicator();
            if (activeIndicator) {
                activeIndicator.hash ? select.setValue(activeIndicator.hash) : select.selectFirstValue();
            }

            container.append(dropdown);
            dropdown.on('change', function (event) {
                me.service.getStateService().setActiveIndicator(select.getValue());
            });
            me._renderDone();
        });
        el.append(container);
    },
    /**
     * @method setWidth {string} width for css style
     * this function targets the whole elements width
     */
    setWidth: function (width) {
        this.element.css('width', width);
    },
    /**
     * @method setDropdownWidth {string} width for css style
     * this function targets the jQuery chosen list
     */
    setDropdownWidth: function (width) {
        this.dropdown.css('width', width);
    },
    /** **** PRIVATE METHODS ******/
    /**
     * Triggers a new render when needed (if render was called before previous was finished)
     */
    _renderDone: function () {
        var state = this._renderState;
        this._renderState = {};
        if (state.repaint) {
            this.render(state.el);
        }
    },
    _getIndicatorUILabels: function (callback) {
        var options = [];
        const service = this.service.getStateService();
        var indicators = service.getIndicators();
        if (!indicators.length) {
            // no indicators to list
            callback(options);
            return;
        }
        const { hash } = service.getActiveIndicator();
        var me = this;
        var count = 0;
        indicators.forEach(function (option) {
            me.service.getUILabels(option, function (label) {
                count++;
                options.push({
                    id: option.hash,
                    title: label.full
                });
                if (count === indicators.length) {
                    callback(options, hash);
                }
            });
        });
    },
    updateOptions: function () {
        if (!this._select) {
            return;
        }
        this._getIndicatorUILabels((options, value) => this._select.updateOptions(options, value));
    },

    addEventHandlers: function () {
        var me = this;
        this.service.on('StatsGrid.ActiveIndicatorChangedEvent', function (event) {
            var current = event.getCurrent();
            if (current && me._select) {
                me._select.setValue(current.hash);
            } else if (!current && me._select) {
                me._select.clearOptions();
            }
        });
        this.service.on('StatsGrid.IndicatorEvent', function (event) {
            if (!me._select) {
                return;
            }
            var hash = me.service.getStateService().getHash(
                event.getDatasource(),
                event.getIndicator(),
                event.getSelections(),
                event.getSeries());

            if (event.isRemoved()) {
                me._select.removeOption(hash);
                return;
            }
            // add new option
            me._getIndicatorUILabels(function (options) {
                options.forEach(function (opt) {
                    if (opt.id === hash) {
                        me._select.addOption(opt);
                    }
                });
            });
        });
        this.service.on('StatsGrid.ParameterChangedEvent', () => this.updateOptions());
        this.service.on('StatsGrid.DatasourceEvent', () => this.updateOptions());

        this.service.on('StatsGrid.StateChangedEvent', function (event) {
            if (event.isReset() && me._select) {
                me._select.clearOptions();
            }
        });
    }

});
