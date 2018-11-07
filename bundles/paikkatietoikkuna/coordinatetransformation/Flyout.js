Oskari.clazz.define('Oskari.coordinatetransformation.Flyout',

    function (instance) {
        var me = this;
        me.instance = instance;
        me.loc = Oskari.getMsg.bind(null, 'coordinatetransformation');
        me.container = null;
        me.flyout = null;
    }, {
        getName: function () {
            return 'Oskari.coordinatetransformation.Flyout';
        },
        getTitle: function () {
            return this.loc('flyout.title');
        },
        getViews: function () {
            return this.views;
        },
        setEl: function (el, width, height) {
            this.container = el[0];
            if (!jQuery(this.container).hasClass('coordinatetransformation-flyout')) {
                jQuery(this.container).addClass('coordinatetransformation-flyout');
            }
        },
        createUi: function () {
            this.instance.getViews().transformation.createUI(this.container);
        },
        startPlugin: function () {
            this.template = jQuery();
            this.flyout = jQuery(this.container.parentElement.parentElement);
            this.flyout.addClass('coordinatetransformation-flyout');
            this.setContainerMaxHeight(Oskari.getSandbox().getMap().getHeight());
        },
        setContainerMaxHeight: function (mapHeight) {
            // calculate max-height based on map size
            var container = this.flyout.find('.oskari-flyoutcontentcontainer');
            var toolbarHeight = this.flyout.find('.oskari-flyouttoolbar').outerHeight(true);
            var maxHeight = mapHeight - toolbarHeight;
            if (container) {
                container.css('max-height', maxHeight + 'px');
            }
            if (container.outerHeight(true) >= maxHeight) {
                this.flyout.css('top', '0px');
            }
        }
    }, {
        'extend': ['Oskari.userinterface.extension.DefaultFlyout']
    });
