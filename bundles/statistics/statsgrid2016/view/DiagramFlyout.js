/*
 * Creates a flyout with tabs for different ways of visualizing data
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.view.DiagramFlyout', function(title, options, instance) {
    this.sb = instance.getSandbox();
    this.loc = instance.getLocalization();
    this.element = null;
    var service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
    this._indicatorSelector = Oskari.clazz.create('Oskari.statistics.statsgrid.SelectedIndicatorsMenu', service);
    this._diagram = Oskari.clazz.create('Oskari.statistics.statsgrid.Diagram', service, this.loc);
    var me = this;
    this.on('show', function() {
        if(!me.getElement()) {
            me.createUi();
            me.addClass('statsgrid-diagram-flyout');
            me.setContent(me.getElement());
            me.scroll();
        }
    });
}, {
    _template: {
        container: jQuery('<div class="oskari-datacharts"><div class="chart-controls"></div> <div class="chart"> <div class="axisLabel"></div> </div></div>')
    },
    setElement: function(el) {
        this.element = el;
    },
    getElement: function() {
        return this.element;
    },
    scroll: function () {
        var me = this;
        var axisLabel = jQuery('.axisLabel');
        jQuery( jQuery('.statsgrid-diagram-flyout > .oskari-flyoutcontentcontainer') ).scroll(function() {
            var scrollAmount = jQuery(this).scrollTop();
            //14 is the 2% padding-bottom
            var chartControlHeight = jQuery('.chart-controls').outerHeight() + 14;
            if ( scrollAmount > 50 ) {
                axisLabel.addClass("sticky");
                axisLabel.css("margin-top", function () {
                   var el = jQuery('.statsgrid-diagram-flyout > .oskari-flyouttoolbar');
                   return scrollAmount - chartControlHeight;
                })
            }
            else  {
                if ( axisLabel.hasClass('sticky') ) {
                    axisLabel.removeClass("sticky");
                    axisLabel.css("margin-top", "");
                }
            }
        });
    },
    createUi: function() {
        if (this.getElement()) {
            // already created ui
            return;
        }
        var el = this._template.container.clone();
        // this.loc.datacharts.indicatorVar as label?
        this._indicatorSelector.render(el.find('.chart-controls'));
        this._indicatorSelector.setDropdownWidth('70%');
        this._diagram.createDataSortOption(el.find('.chart-controls .dropdown'));
        // this.loc.datacharts.descColor
        // Oskari.clazz.define('Oskari.statistics.statsgrid.SelectedIndicatorsMenu');
        this._diagram.render(el.find('.chart'));
        this.setElement(el);
    }
}, {
    extend: ['Oskari.userinterface.extension.ExtraFlyout']
});