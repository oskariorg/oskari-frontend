Oskari.clazz.define('Oskari.coordinatetransformation.view.CoordinateMapSelection',
    function (instance) {
        var me = this;
        me.instance = instance;
        me.loc = Oskari.getMsg.bind(null, 'coordinatetransformation');
        me.mapSelectionContainer = null;
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
            var helper = me.instance.getHelper();
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup'),
                btn = dialog.createCloseButton(this.loc('actions.done')),
                cancelBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            cancelBtn.setTitle(this.loc('actions.cancel'));
            btn.addClass('primary');
            me.dialog = dialog;

            cancelBtn.setHandler(function() {
                helper.removeMarkers();
                me.instance.toggleViews("transformation");
                me.instance.setMapSelectionMode(false);
                me.instance.addMapCoordsToInput(false);
                dialog.close();
            });

            btn.setHandler(function() {
                me.instance.setMapSelectionMode(false);
                helper.removeMarkers();
                me.instance.toggleViews("transformation");
                me.instance.addMapCoordsToInput(true);
                dialog.close();
            });

            dialog.show(this.loc('mapMarkers.select.title'), this.loc('mapMarkers.select.info'), [cancelBtn, btn]);
            dialog.moveTo( jQuery('.coordinatetransformation'), 'right', true);
        },
        /*getCoords: function ( coords ) {
            Object.keys( coords ).forEach( function ( key ) {
                coords[key] = Math.round( coords[key] );
            });
            if( coords != null ) {
                this.mapcoords.push( coords );
            }
        },*/
    }
);
