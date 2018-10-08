Oskari.clazz.define('Oskari.statistics.statsgrid.view.SearchFlyout', function (title, options, instance) {
    this.instance = instance;
    this.uiElement = null;
    this.sandbox = this.instance.getSandbox();
    this.service = this.sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
    var me = this;
    this.on('show', function () {
        if (!me.getUiElement()) {
            me.createUi();
            me.setContent(me.getUiElement());
        }
    });
}, {
    setUiElement: function (el) {
        this.uiElement = el;
    },
    getUiElement: function () {
        return this.uiElement;
    },
    clearUi: function () {
        if (this.uiElement === null) {
            return;
        }
        this.uiElement.empty();
    },
    /**
     * @method lazyRender
     * Called when flyout is opened (by instance)
     * Creates the UI for a fresh start.
     */
    createUi: function (isEmbedded) {
        var locale = this.instance.getLocalization();
        // empties all
        this.clearUi();
        this.addClassForContent('statsgrid-search-container');
        var title = locale.flyout.title;
        var flyout = this.getElement();
        if (isEmbedded) {
            // Remove close button from published
            flyout.find('.oskari-flyouttools').hide();
        } else {
            // resume defaults (important if user used publisher)
            flyout.find('.oskari-flyouttools').show();
        }
        this.addContent(isEmbedded);
    },
    addContent: function (isEmbedded) {
        if (isEmbedded) {
            // no search for embedded map
            return;
        }
        this.setUiElement(this.getNewSearchElement());
    },
    getNewSearchElement: function () {
        var me = this;
        var container = jQuery('<div></div>');
        var locale = this.instance.getLocalization();

        var selectionComponent = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorSelection', me.instance, me.sandbox);
        container.append(selectionComponent.getPanelContent());

        var btn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        btn.addClass('margintopLarge');
        btn.setPrimary(true);
        btn.setTitle(locale.panels.newSearch.addButtonTitle);
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
        clearBtn.setTitle(locale.panels.newSearch.clearButtonTitle);
        clearBtn.insertTo(container);

        clearBtn.setHandler(function (event) {
            event.stopPropagation();
            selectionComponent.clearSelections();
        });

        selectionComponent.on('indicator.changed', function (enabled) {
            btn.setEnabled(enabled);
        });

        return container;
    }
}, {
    extend: ['Oskari.userinterface.extension.ExtraFlyout']
});
