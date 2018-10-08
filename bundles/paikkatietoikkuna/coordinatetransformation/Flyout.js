Oskari.clazz.define('Oskari.coordinatetransformation.Flyout',

    function( instance ) {
        this.instance = instance;
        this.loc = Oskari.getMsg.bind(null, 'coordinatetransformation');
        this.container = null;
        this.flyout = null;
    }, {
        getName: function() {
            return 'Oskari.coordinatetransformation.Flyout';
        },
        getTitle: function() {
            return this.loc('flyout.title');
        },
        getViews: function () {
            return this.views;
        },
        setEl: function(el, flyout, width, height) {
            this.container = jQuery(el[0]);
            this.flyout = flyout;
            if ( !this.container.hasClass('coordinatetransformation') ) {
                this.container.addClass('coordinatetransformation');
            }
            if (!this.flyout.hasClass('coordinatetransformation')) {
                this.flyout.addClass('coordinatetransformation');
            }
        },
        createUi: function() {
            var view = this.instance.getViews().transformation.createUI(this.container);
        },
        toggleFlyout: function ( visible ) {
            if( !visible ) {
                jQuery( this.container ).parent().parent().hide();
            } else {
                jQuery( this.container ).parent().parent().show();
            }
        },
        startPlugin: function() {
            this.template = jQuery();
        }
    }, {
        "extend": ["Oskari.userinterface.extension.DefaultFlyout"]
    });
