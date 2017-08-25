Oskari.clazz.define('Oskari.framework.bundle.coordinateconversion.view.mapselect',
    function (instance) {
        var me = this;
        me.instance = instance;
        me.loc = me.instance.getLocalization("flyout");
        me.helper = Oskari.clazz.create('Oskari.framework.bundle.coordinateconversion.helper', me.instance, me.loc);
        me.mapselectContainer = null;
        me._template = jQuery('<div class="conversion-mapselect"></div>')
    }, {
        getName: function() {
            return 'Oskari.framework.bundle.coordinateconversion.view.mapselect';
        },
        show: function() {
            var me = this;

            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            btn = dialog.createCloseButton('OK'),
            cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

            btn.addClass('primary');

            btn.setHandler(function() {
                dialog.close();
                me.instance.plugins['Oskari.userinterface.Flyout'].shouldUpdate(me.getName());
            })

            dialog.show('Note', this.loc.datasourceinfo.mapinfo, [cancelBtn, btn]);
            this.getCoordinatesFromMap();
        },
        getCoordinatesFromMap: function() {
            var me = this;
            jQuery('#mapdiv').on("click", function () {
                    var coords = me.helper.getCoordinatesFromMap();
                    me.instance.plugins['Oskari.userinterface.Flyout'].conversionView.addToInputTable(coords);
            });
        }
    }
);
 