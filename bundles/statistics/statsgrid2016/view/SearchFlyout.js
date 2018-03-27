Oskari.clazz.define('Oskari.statistics.statsgrid.view.SearchFlyout', function (title, options, instance) {
    this.instance = instance;
    this.element = null;
    this.sandbox = this.instance.getSandbox();
    this.service = this.sandbox.getService('Oskari.statistics.statsgrid.StatisticsService');
    this._extraFeatures = Oskari.clazz.create('Oskari.statistics.statsgrid.ExtraFeatures',
        this.instance.getSandbox(), this.instance.getLocalization().panels.extraFeatures, this);
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
    getExtraFeatures: function () {
        return this._extraFeatures;
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
        this.setElement(jQuery('<div class="statsgrid-search-container"></div>'));
        var title = locale.flyout.title;
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
        el.append(this.getExtraFeaturesElement());
    },
    getNewSearchElement: function () {
        var me = this;
        var container = jQuery('<div></div>');
        var locale = this.instance.getLocalization();

        var selectionComponent = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorSelection', me.instance, me.sandbox);
        container.append(selectionComponent.getPanelContent());

        var btn = Oskari.clazz.create('Oskari.userinterface.component.Button');
        btn.addClass('margintopLarge');
        btn.setTitle(locale.panels.newSearch.addButtonTitle);
        btn.setEnabled(false);
        btn.insertTo(container);

        btn.setHandler(function (event) {
            event.stopPropagation();
            var values = selectionComponent.getValues();

            var added = me.service.getStateService().addIndicator(values.datasource, values.indicator, values.selections);
            if (added === false) {
                // already added, set as active instead
                var hash = me.service.getStateService().getHash(values.datasource, values.indicator.selections);
                me.service.getStateService().setActiveIndicator(hash);
            }
            me.service.getStateService().setRegionset(values.regionset);

            var extraValues = me.getExtraFeatures().getValues();

            if (extraValues.openTable) {
                me.instance.getFlyoutManager().open('table');
            }
            if (extraValues.openDiagram) {
                me.instance.getFlyoutManager().open('diagram');
            }
        });

        selectionComponent.on('indicator.changed', function (enabled) {
            btn.setEnabled(enabled);
        });

        return container;
    },
    getExtraFeaturesElement: function () {
        var container = jQuery('<div class="extrafeatures"><div class="title"></div><div class="content"></div></div>');
        var locale = this.instance.getLocalization();

        container.find('.title').html(locale.panels.extraFeatures.title);
        container.find('.content').append(this._extraFeatures.getPanelContent());
        return container;
    }
}, {
    extend: ['Oskari.userinterface.extension.ExtraFlyout']
});
