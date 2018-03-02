Oskari.clazz.define('Oskari.coordinatetransformation.view.CoordinateMapSelection',
    function (instance) {
        var me = this;
        me.instance = instance;
        me.loc = me.instance.getLocalization("flyout");
        me.helper = me.instance.helper;
        me.mapSelectionContainer = null;
        me.mapcoords = [];
        me.dialog = null;
    }, {
        getName: function() {
            return 'Oskari.coordinatetransformation.view.CoordinateMapSelection';
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
                me.removeMapClickListener();
                me.instance.toggleViews("transformation");
                me.instance.getViews().transformation.isMapSelection = false;
                me.mapcoords = [];
            });

            btn.setHandler(function() {
                me.instance.getViews().transformation.updateCoordinateData( 'input', me.mapcoords );
                me.instance.getViews().transformation.isMapSelection = false;
                me.removeMapClickListener();
                me.instance.getViews().transformation.selectMapProjectionValues();
                me.instance.toggleViews("transformation");
                me.mapcoords = [];
            });

            dialog.show('Note', this.loc.datasourceinfo.mapinfo, [cancelBtn, btn]);
            dialog.moveTo( jQuery('.coordinatetransformation'), 'right', true);
            this.mapClicksListener();
        },
        getCoords: function ( coords ) {
            Object.keys( coords ).forEach( function ( key ) {
                coords[key] = Math.round( coords[key] );
            });
            if( coords != null ) {
                this.mapcoords.push( coords );
            }
        },
        removeMapClickListener: function () {
            jQuery('#mapdiv').off('click');
        },
        mapClicksListener: function() {
            var me = this;
            if( me.instance.isMapSelectionMode() ) {
                jQuery('#mapdiv').on("click", function () {});
            } else {
                return;
            }
        }
    }
);
 