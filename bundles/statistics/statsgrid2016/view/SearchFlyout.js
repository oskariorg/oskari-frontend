Oskari.clazz.define('Oskari.statistics.statsgrid.view.SearchFlyout', function (title, options, instance) {
    this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
    this.instance = instance;
    this.element = null;
    this.sandbox = this.instance.getSandbox();
    this.service = this.sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
    var me = this;
    this.on('show', function () {
        if (!me.getElement()) {
            me.createUi();
            me.addClass('statsgrid-search-flyout');
            me.setContent(me.getElement());
        }
    });
}, {
    setElement: function (el) {
        this.element = el;
    },
    getElement: function () {
        return this.element;
    },
    clearUi: function () {
        if (this.element === null) {
            return;
        }
        this.element.empty();
    },
    /**
     * @method lazyRender
     * Called when flyout is opened (by instance)
     * Creates the UI for a fresh start.
     */
    createUi: function (isEmbedded) {
        // empties all
        this.clearUi();
        this.setElement(jQuery('<div class="statsgrid-search-container"></div>'));
        var title = this.loc('flyout.title');
        var parent = this.getElement().parent().parent();
        if (isEmbedded) {
            parent.find('.oskari-flyout-title p').html(title);
            // Remove close button from published
            parent.find('.oskari-flyouttools').hide();
        } else {
            // resume defaults (important if user used publisher)
            parent.find('.oskari-flyout-title p').html(title);
            parent.find('.oskari-flyouttools').show();
        }
        this.addContent(this.getElement(), isEmbedded);
    },
    addContent: function (el, isEmbedded) {
        if (isEmbedded) {
            // no search for embedded map
            return;
        }
        el.append(this.getNewSearchElement());
    },
    getNewSearchElement: function () {
        var me = this;
        var container = jQuery('<div></div>');

        var selectionComponent = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorSelection', me.instance, me.sandbox);
        container.append(selectionComponent.getPanelContent());

        var btn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        btn.addClass('margintopLarge');
        btn.setPrimary(true);
        btn.setTitle(this.loc('panels.newSearch.addButtonTitle'));
        btn.setEnabled(false);
        btn.insertTo(container);

        btn.setHandler(function (event) {
            event.stopPropagation();
            var values = selectionComponent.getValues();
            var selectedIndicators = values.indicator;
            // indicator loop check Array.isArray
            if (!Array.isArray(values.indicator)) {
                selectedIndicators = [values.indicator];
            }

            var newActiveIndicator = false;
            var activeSelections = values.selections;

            selectedIndicators.forEach(function (indicator) {
                if (indicator === '') {
                    return;
                }
                var added;
                var hasMultiselectValues = false;
                if (!values.series) {
                    // Multiselect selections are not supported for series layer
                    Object.keys(values.selections).forEach(function (key) {
                        var selection = values.selections[key];
                        if (Array.isArray(selection)) {
                            hasMultiselectValues = true;
                            if (selection.length === 0) {
                                return;
                            }
                            selection.forEach(function (item) {
                                var current = jQuery.extend(true, {}, values.selections);
                                current[key] = item;
                                var newlyAdded = me.service.getStateService().addIndicator(values.datasource, indicator, current);
                                if (newlyAdded) {
                                    added = newlyAdded;
                                    activeSelections = current;
                                }
                            });
                        }
                    });
                }
                if (!hasMultiselectValues) {
                    added = me.service.getStateService().addIndicator(values.datasource, indicator, activeSelections, values.series);
                }
                if (added) {
                    newActiveIndicator = indicator;
                }
            });

            if (newActiveIndicator !== false) {
                // already added, set as active instead
                var hash = me.service.getStateService().getHash(values.datasource, newActiveIndicator, activeSelections, values.series);
                me.service.getStateService().setActiveIndicator(hash);
            }
            me.service.getStateService().setRegionset(values.regionset);
        });

        var clearBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        clearBtn.addClass('margintopLarge');
        clearBtn.setTitle(this.loc('panels.newSearch.clearButtonTitle'));
        clearBtn.insertTo(container);

        clearBtn.setHandler(function (event) {
            event.stopPropagation();
            selectionComponent.clearSelections();
        });

        selectionComponent.on('indicator.changed', enabled => btn.setEnabled(enabled));
        selectionComponent.on('indicator.parameter.changed', enabled => btn.setEnabled(enabled));

        // Create accordion and add indicator list to its panel
        var indicatorListAccordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
        var indicatorListAccordionPanel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        var indicatorList = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorList', this.service);

        indicatorListAccordionPanel.setTitle(this.loc('indicatorList.title'));
        indicatorListAccordionPanel.setContent(indicatorList.getElement());
        indicatorListAccordion.addPanel(indicatorListAccordionPanel);

        indicatorListAccordion.insertTo(container);

        return container;
    }
}, {
    extend: ['Oskari.userinterface.extension.ExtraFlyout']
});
