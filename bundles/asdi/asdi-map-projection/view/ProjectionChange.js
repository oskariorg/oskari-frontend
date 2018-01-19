/*
 * Creates a flyout with tabs for different ways of visualizing data
 */
Oskari.clazz.define('Oskari.map.projection.view.ProjectionChange', function(title, options, instance) {
    this.sb = instance.getSandbox();
    this.loc = instance.getLocalization();
    this.element = null;
    var me = this;
    this.on('show', function() {
        if(!me.getElement()) {
            me.createUi();
        }
    });
}, {
    _template: {
        container: jQuery('<div class="oskari-map-projection">asddddddd</div>')
    },
    setElement: function(el) {
        this.element = el;
    },
    getElement: function() {
        return this.element;
    },
    createUi: function() {
        if (this.getElement()) {
            return;
        }
        var el = this._template.container.clone();

        this.setElement(el);
    }
}, {
});