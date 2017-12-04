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
        }
    });
}, {
    _template: {
        container: jQuery('<div class="oskari-datacharts"><div class="chart-controls"></div><div class="chart"></div></div>')
    },
    setElement: function(el) {
        this.element = el;
    },
    getElement: function() {
        return this.element;
    },
    createUi: function() {
        if (this.getElement()) {
            // already created ui
            return;
        }
        var el = this._template.container.clone();
        // this.loc.datacharts.indicatorVar as label?
        this._indicatorSelector.render(el.find('.chart-controls'));
        // this.loc.datacharts.descColor
        // Oskari.clazz.define('Oskari.statistics.statsgrid.SelectedIndicatorsMenu');
        this._diagram.render(el.find('.chart'));
        this.setElement(el);
    }
}, {
    extend: ['Oskari.userinterface.extension.ExtraFlyout']
});