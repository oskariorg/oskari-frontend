Oskari.clazz.define('Oskari.coordinatetransformation.view.CoordinateMapSelection',
    function (instance) {
        var me = this;
        me.instance = instance;
        me.loc = Oskari.getMsg.bind(null, 'coordinatetransformation');
        //me.mapSelectionContainer = null;
        me.dialog = null;
        this._template = jQuery(
                '<div class="coordinateSelectionPopup coordinatetransformation-flyout">' +
                '   <div class="coordinateSelectionContent"></div>' +
                '   <div class="coordinateSelectionOptions">' +
                '       <input id="add-coordinate-to-map" type="radio" name="coordinate-map-select" value="add" checked/>' +
                '       <label for="add-coordinate-to-map" class="source-select">' +
                '           <span/>' +
                '       </label>' +
                '       <input id="remove-coordinate-from-map" type="radio" name="coordinate-map-select" value="remove"/>' +
                '       <label for="remove-coordinate-from-map" class="source-select">' +
                '            <span/>' +
                '       </label>' +
                '    </div>' +
                '</div>'
            );
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
                me.instance.toggleViews('transformation');
                me.instance.setMapSelectionMode(false);
                me.instance.addMapCoordsToInput(false);
                dialog.close();
            });

            btn.setHandler(function() {
                me.instance.setMapSelectionMode(false);
                helper.removeMarkers();
                me.instance.toggleViews('transformation');
                me.instance.addMapCoordsToInput(true);
                dialog.close();
            });
            var content = this._template.clone();
            content.find('.coordinateSelectionContent').append(this.loc('mapMarkers.select.info'));
            content.find('label[for=add-coordinate-to-map]').append(this.loc('mapMarkers.select.add'));
            content.find('label[for=remove-coordinate-from-map]').append(this.loc('mapMarkers.select.remove'));

            me.instance.setRemoveMarkers(false); //add markers radio button is pre-checked

            content.find('input[type=radio]').on('change', function(evt) {
                var value = this.value;
                if (value === 'remove'){
                    me.instance.setRemoveMarkers(true);
                } else {
                    me.instance.setRemoveMarkers(false);
                }
            });

            dialog.makeDraggable();
            dialog.show(this.loc('mapMarkers.select.title'), content, [cancelBtn, btn]);
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
