Oskari.clazz.define('Oskari.statistics.statsgrid.view.IndicatorFormFlyout', function (service, locale, datasource) {
    this.element = null;
    this.myIndicatorForm = Oskari.clazz.create('Oskari.statistics.statsgrid.IndicatorForm', this, service, locale, datasource);
    var me = this;
    this.on('show', function () {
        if (!me.getElement()) {
            me.createUi();
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
    createUi: function () {
        this.clearUi();
        this.setElement(jQuery('<div class="statsgrid-user-indicator-container"></div>'));
        this.myIndicatorForm.render(this.getElement());
    }
}, {
    extend: ['Oskari.userinterface.extension.ExtraFlyout']
});
