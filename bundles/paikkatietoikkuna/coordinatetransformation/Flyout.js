Oskari.clazz.define('Oskari.coordinatetransformation.Flyout',

    function( instance ) {
        var me = this;
        me.instance = instance;
        me.loc = Oskari.getMsg.bind(null, 'coordinatetransformation');
        me.container = null;
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
        setEl: function(el, width, height) {
            this.container = el[0];
            if ( !jQuery( this.container ).hasClass('coordinatetransformation-flyout') ) {
                jQuery( this.container ).addClass('coordinatetransformation-flyout');
            }
        },
        createUi: function() {
            this.instance.getViews().transformation.createUI(this.container);
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
            var elParent = this.container.parentElement.parentElement;
            jQuery( elParent ).addClass('coordinatetransformation-flyout');
        }
    }, {
        'extend': ['Oskari.userinterface.extension.DefaultFlyout']
    });
