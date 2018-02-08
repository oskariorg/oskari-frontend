Oskari.clazz.define('Oskari.coordinatetransformation.view.mapselect',
    function (instance) {
        var me = this;
        me.instance = instance;
        me.loc = me.instance.getLocalization("flyout");
        me.helper = me.instance.helper;
        me.mapselectContainer = null;
        me.mapcoords = [];
        me.dialog = null;
    }, {
        getName: function() {
            return 'Oskari.coordinatetransformation.view.mapselect';
        },
        setVisible: function ( visible ) {
            if(this.dialog === null && !visible) {
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
            btn = dialog.createCloseButton(this.loc.datasourceinfo.success),
            cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(this.loc.datasourceinfo.cancel);
            btn.addClass('primary');
            me.dialog = dialog;

            cancelBtn.setHandler(function() {
                me.helper.removeMarkers();
                dialog.close();
                me.instance.toggleViews("transformation");
                me.instance.getViews().transformation.isMapSelect = false;
                me.mapcoords = [];
            });

            btn.setHandler(function() {
                me.instance.getViews().transformation.inputTable.addRows( me.mapcoords );
                me.instance.getViews().transformation.isMapSelect = false;
                me.instance.toggleViews("transformation");
                me.mapcoords = [];
            });

            dialog.show('Note', this.loc.datasourceinfo.mapinfo, [cancelBtn, btn]);
            dialog.moveTo( jQuery('.coordinatetransformation'), 'right', true);
            this.mapClicksListener();
        },
        getCoords: function ( coords ) {
            if( coords != null ) {
                this.mapcoords.push(coords);
            }
        },
        mapClicksListener: function() {
            var me = this;
            if( me.instance.getViews().transformation.mapselect ) {
                jQuery('#mapdiv').on("click", function () {});
            } else {
                return;
            }
        }
    }
);
 