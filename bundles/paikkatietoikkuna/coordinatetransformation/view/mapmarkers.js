Oskari.clazz.define('Oskari.coordinatetransformation.view.mapmarkers',
    function (instance) {
        var me = this;
        me.instance = instance;
        me.loc = me.instance.getLocalization("flyout");
        me.dialog = null;
    }, {
        getName: function() {
            return 'Oskari.coordinatetransformation.view.mapmarkers';
        },
        setVisible: function ( visible ) {
            if(this.dialog === null  && !visible) {
                return;
            }
            if( !visible ) {
                this.dialog.close();
            } else {
                this.show();
            }
        },
        show: function() {
            var me = this;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            btn = dialog.createCloseButton(this.loc.datasourceinfo.success);
            me.dialog = dialog;

            btn.addClass('primary');


            btn.setHandler(function() {
                me.instance.toggleViews("conversion");
            });

            dialog.show('View', this.loc.datasourceinfo.mapmarkers, [btn]);
            dialog.moveTo( jQuery('.coordinatetransformation'), 'right', true);
        }
    }
);
 