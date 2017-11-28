/*
 * Creates a flyout with tabs for different ways of visualizing data
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.view.DiagramVisualizer', function(instance) {
    this.sb = instance.getSandbox();
    this.loc = instance.getLocalization();
    this.container = null;
    this._isOpen = false;
    var service = this.sb.getService('Oskari.statistics.statsgrid.StatisticsService');
    this._indicatorSelector = Oskari.clazz.create('Oskari.statistics.statsgrid.SelectedIndicatorsMenu', service);
    this._diagram = Oskari.clazz.create('Oskari.statistics.statsgrid.Diagram', service, this.loc);
}, {
    _template: {
        container: jQuery('<div class="oskari-datacharts"><div class="chart-controls"></div></div>')
    },
    setElement: function(el) {
        this.container = el;
    },
    getElement: function() {
        return this.container;
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
        this._diagram.render(el);
        this.setElement(el);
    },
    isVisible: function() {
        return this._isOpen;
    }
}, {
    extend: ['Oskari.userinterface.extension.DefaultView']
});