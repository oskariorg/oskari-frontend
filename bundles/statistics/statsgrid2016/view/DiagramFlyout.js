/*
 * Creates a flyout with tabs for different ways of visualizing data
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.view.DiagramFlyout', function (title, options, instance) {
    this.sb = instance.getSandbox();
    this.loc = instance.getLocalization();
    this.uiElement = null;
    var service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
    this._indicatorSelector = Oskari.clazz.create('Oskari.statistics.statsgrid.SelectedIndicatorsMenu', service);
    this._diagram = Oskari.clazz.create('Oskari.statistics.statsgrid.Diagram', service, this.loc);
    var me = this;
    this.on('show', function () {
        if (!me.getUiElement()) {
            me.createUi();
            me.setContent(me.getUiElement());
            me.bindScroll();
        }
    });
}, {
    _template: {
        container: jQuery('<div>' +
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
    bindScroll: function () {
        var axisLabel = this.uiElement.find('.axisLabel');
        var labelMargin = parseInt(axisLabel.css('margin-top'));
        var positionTop = this.uiElement.find('.chart').position().top - 2; // top margin 2
        var chartControlHeight = positionTop + labelMargin;
        this.getElement().find('.oskari-flyoutcontentcontainer').on('scroll', function () {
            var scrollAmount = jQuery(this).scrollTop();
            if (scrollAmount > chartControlHeight) {
                axisLabel.addClass('sticky');
                axisLabel.css('margin-top', function () {
                    return scrollAmount - positionTop;
                });
            } else {
                if (axisLabel.hasClass('sticky')) {
                    axisLabel.removeClass('sticky');
                    axisLabel.css('margin-top', '');
                }
            }
        });
    },
    createUi: function () {
        if (this.getUiElement()) {
            // already created ui
            return;
        }
        var el = this._template.container.clone();
        this.addClassForContent('oskari-datacharts');
        // this.loc.datacharts.indicatorVar as label?
        this._indicatorSelector.render(el.find('.chart-controls'));
        this._indicatorSelector.setDropdownWidth('70%');
        this._diagram.createDataSortOption(el.find('.chart-controls .dropdown'));
        // this.loc.datacharts.descColor
        // Oskari.clazz.define('Oskari.statistics.statsgrid.SelectedIndicatorsMenu');
        this._diagram.render(el.find('.chart'));
        this.setUiElement(el);
    }
}, {
    extend: ['Oskari.userinterface.extension.ExtraFlyout']
});
