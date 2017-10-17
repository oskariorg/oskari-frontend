Oskari.clazz.define('Oskari.coordinateconversion.view.mapmarkers',
    function (instance) {
        var me = this;
        me.instance = instance;
        me.loc = me.instance.getLocalization("flyout");
    }, {
        getName: function() {
            return 'Oskari.coordinateconversion.view.mapmarkers';
        },
        show: function() {
            var me = this;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            btn = dialog.createCloseButton(this.loc.datasourceinfo.success);

            btn.addClass('primary');


            btn.setHandler(function() {
                dialog.close();
                me.instance.toggleViews();
            });

            dialog.show('View', this.loc.datasourceinfo.mapmarkers, [btn]);
            dialog.moveTo(jQuery('.oskari-tile.coordinateconversion'), 'right', true);
        }
    }
);
 