Oskari.clazz.define('Oskari.coordinateconversion.view.mapselect',
    function (instance) {
        var me = this;
        me.instance = instance;
        me.loc = me.instance.getLocalization("flyout");
        me.helper = Oskari.clazz.create('Oskari.coordinateconversion.helper', me.instance, me.loc);
        me.mapselectContainer = null;
        me.mapcoords = [];
    }, {
        getName: function() {
            return 'Oskari.coordinateconversion.view.mapselect';
        },
        show: function() {
            var me = this;

            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
            btn = dialog.createCloseButton(this.loc.datasourceinfo.success),
            cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(this.loc.datasourceinfo.cancel);
            btn.addClass('primary');

            cancelBtn.setHandler(function() {
                dialog.close();
                me.instance.plugins['Oskari.userinterface.Flyout'].shouldUpdate( me.getName() );
                me.mapcoords = [];
            });

            btn.setHandler(function() {
                dialog.close();
                me.instance.plugins['Oskari.userinterface.Flyout'].getViews().conversion.table.addRows( me.mapcoords );
                me.instance.plugins['Oskari.userinterface.Flyout'].shouldUpdate(me.getName());
                me.mapcoords = [];
            });

            dialog.show('Note', this.loc.datasourceinfo.mapinfo, [cancelBtn, btn]);
            dialog.moveTo(jQuery('.oskari-tile.coordinateconversion'), 'right', true);
            this.getMapCoordinates();
        },
        getMapCoordinates: function() {
            var me = this;
            jQuery('#mapdiv').on("click", function () {
                    var coords = me.helper.getMapCoordinates();
                    if(coords != null) {
                        me.mapcoords.push(coords);
                    }
            });
        }
    }
);
 