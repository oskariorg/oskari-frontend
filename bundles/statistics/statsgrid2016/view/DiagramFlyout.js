/*
 * Creates a flyout with tabs for different ways of visualizing data
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.view.DiagramFlyout', function (title, options, instance) {
    this.sb = instance.getSandbox();
    this.loc = instance.getLocalization();
    this.uiElement = null;
    this.service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
    this._indicatorSelector = Oskari.clazz.create('Oskari.statistics.statsgrid.SelectedIndicatorsMenu', this.service);
    this._diagram = Oskari.clazz.create('Oskari.statistics.statsgrid.Diagram', this.service, this.loc);
    var me = this;
    this.on('show', function () {
        if (!me.getUiElement()) {
            me.createUi();
            me.setContent(me.getUiElement());
        }
    });
    this.on('resize', function (size) {
        const diagramSize = me.calculateDiagramSize(size);
        me._diagram.resizeUI(diagramSize);
    });
    this.events();
}, {
    _template: {
        container: jQuery('<div class="stats-diagram-holder">' +
            '   <div class="chart-controls"></div>' +
            '   <div class="chart">' +
            '       <div class="axisLabel"></div>' +
            '   </div>' +
            '</div>')
    },
    setUiElement: function (el) {
        this.uiElement = el;
    },
    getUiElement: function () {
        return this.uiElement;
    },
    createUi: function () {
        if (this.getUiElement()) {
            // already created ui
            return;
        }
        var el = this._template.container.clone();
        this.addClassForContent('oskari-datacharts');
        // this.loc.datacharts.indicatorVar as label?
        const controls = el.find('.chart-controls');
        this._indicatorSelector.render(controls);
        this._indicatorSelector.setDropdownWidth('70%');
        this._diagram.createDataSortOption(el.find('.chart-controls .dropdown'));
        // this.loc.datacharts.descColor
        // Oskari.clazz.define('Oskari.statistics.statsgrid.SelectedIndicatorsMenu');
        const diagramSize = this.calculateDiagramSize();
        this._diagram.render(el.find('.chart'), diagramSize);
        this.setUiElement(el);
        this.setSortingDisabled();
    },
    /**
     * @method calculateDiagramSize
     * @param  {Object} size flyout size
     * Calculates height for diagram and width for chart
     * if flyout size isn't given then uses window height
     */
    calculateDiagramSize: function (size) {
        const height = size ? size.height : window.innerHeight - 100;
        const width = size ? size.width : this.getSize().width;
        return {
            maxHeight: this.calculateHeightForContent(height),
            width: width - 20
        };
    },
    calculateHeightForContent: function (height) {
        const el = this.getElement();
        const controls = el.find('.chart-controls').outerHeight() || 73;
        const toolbar = el.find('.oskari-flyouttoolbar').outerHeight() || 57;
        return height - controls - toolbar;
    },
    setSortingDisabled: function () {
        const indicator = this.service.getStateService().getActiveIndicator();
        if (!this.getUiElement()) return;
        const el = this.getUiElement().find('.sort-options');
        if (!indicator) {
            if (el) {
                el.css('pointer-events', 'none');
                el.css('cursor', 'not-allowed');
            }
        } else {
            if (el) {
                el.css('pointer-events', 'auto');
                el.css('cursor', 'auto');
            }
        }
    },
    events: function () {
        const me = this;
        this.service.on('StatsGrid.ActiveIndicatorChangedEvent', function (event) {
            if (event.getCurrent()) {
                me.setSortingDisabled();
            }
        });
        this.service.on('StatsGrid.IndicatorEvent', function (event) {
            if (event.isRemoved() && !me.hasIndicators()) {
                me.setSortingDisabled();
            }
        });
        this.service.on('StatsGrid.RegionsetChangedEvent', function () {
            me.setSortingDisabled();
        });
        this.service.on('StatsGrid.ParameterChangedEvent', function () {
            me.setSortingDisabled();
        });
        this.service.on('StatsGrid.StateChangedEvent', function (event) {
            if (event.isReset()) {
                me.setSortingDisabled();
            }
        });
        this.service.on('StatsGrid.ClassificationChangedEvent', function () {
            me.setSortingDisabled();
        });
    }
}, {
    extend: ['Oskari.userinterface.extension.ExtraFlyout']
});
