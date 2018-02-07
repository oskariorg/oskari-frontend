Oskari.clazz.define('Oskari.coordinatetransformation.component.select',
    function ( instance ) {
        var me = this;
        me.instance = instance;
        me.selectInstances = {};
        me.dropdowns = {};
    }, {
        getSelectInstances: function () {
            return this.selectInstances;
        },
        getDropdowns: function () {
            return this.dropdowns;
        },
        create: function () {
            var json = this.instance.helper.getOptionsJSON();

            var selections = [];
            var dropdowns = {};
            var selects = {};
            var options = {}
            Object.keys( json ).forEach( function ( key ) {
                var instanceKey = key;
                var value = json[key];
                var size = Object.keys( value ).length;
                Object.keys( value ).forEach( function ( key ) {
                    var obj = value[key];
                    var valObject = {
                        id : obj.id,
                        title : obj.title,
                        cls: obj.cls
                    };
                    selections.push( valObject );
                    // First element, set placeholder
                    if ( key === "0" ) {
                        options = {
                            placeholder_text: obj.title,
                            allow_single_deselect : true,
                            disable_search_threshold: 10,
                            width: '100%'
                        };
                    }
                     if ( key == size -1 ) {
                        var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList', "id");
                        var dropdown = select.create(selections, options);
                        selections = [];
                        options = {};
                        var id = obj.id;
                        dropdown.css( { width:'170px', float:'right' } );
                        select.adjustChosen();
                        select.selectFirstValue();
                        selects[instanceKey] = select;
                        dropdowns[instanceKey] = dropdown;  
                     }
                });
            });
            this.dropdowns = dropdowns;
            this.selectInstances = selects;
        },
        /**
         * @method handleSelectionChanged
         */
        handleSelectionChanged: function ( element ) {
            var me = this;
            var values = {};
            var instances = this.getSelectInstances();
            var dropdowns = this.getDropdowns();
            var rows = me.instance.inputTable.getElements().rows;

            element.on( "change", function() {
                var self = this;
                Object.keys( instances ).forEach( function ( key ) {
                    var instanceLength = Object.keys(instances).length;
                    dropdowns[key].find( 'option' ).hide();
                    dropdowns[key].find( '.' + instances.datum.getValue() ).show();

                    if ( instances.dimension.getValue() === "KOORDINAATISTO_MAANT_2D" ) {
                        dropdowns.coordinatesystem.find('option').hide();
                        dropdowns[key].find( '.' + instances.datum.getValue()+'.'+ instances.dimension.getValue() ).show();
                    }
                    if ( instances.dimension.getValue() === "KOORDINAATISTO_MAANT_3D" ) {
                        dropdowns.coordinatesystem.find('option').hide();
                        dropdowns[key].find( '.' + instances.dimension.getValue() ).show();
                    }
                    if ( instances.dimension.getValue() === "KOORDINAATISTO_SUORAK_2D" ) {
                        dropdowns.coordinatesystem.find('option').hide();
                        dropdowns[key].find( '.' + instances.dimension.getValue() ).show();
                    }
                    if ( instances.dimension.getValue() === "KOORDINAATISTO_SUORAK_3D" ) {
                        dropdowns.coordinatesystem.find('option').hide();
                        dropdowns[key].find( '.' + instances.dimension.getValue() ).show();
                    }
                    // Karttaprojektiojärjestelmä special cases
                    if ( instances.projection.getValue() === "KKJ_KAISTA" ) {
                        dropdowns.coordinatesystem.find('option').hide();
                        dropdowns[key].find('.'+ instances.projection.getValue()).show();
                    }
                    if ( instances.projection.getValue() === "TM" ) {
                        dropdowns.coordinatesystem.find('option').hide();
                        dropdowns[key].find('.'+ instances.projection.getValue()).show();
                    } 
                    if ( instances.projection.getValue() === "GK" ) {
                        dropdowns.coordinatesystem.find('option').hide();
                        dropdowns[key].find('.'+ instances.projection.getValue()).show();
                    }
                    if ( instances.coordinatesystem.getValue() !== "COORDSYS_DEFAULT" ) {
                        me.instance.startingSystem = true;
                    } else {
                        me.instance.startingSystem = true;
                    }
                    if ( instances.heigthsystem.getValue() === "KORKEUSJ_DEFAULT") {
                        var isEmpty = true;
                        var elevationCells = me.instance.inputTable.getElements().rows.find('.elevation');
                        elevationCells.attr("contenteditable", false);
                        //check if elevationcells have value, if true don't hide but grey out
                        jQuery.each( elevationCells, function (key, val) {
                            jQuery(val).html().trim();
                            if ( !jQuery( val ).is(':empty') ) {
                                isEmpty = false;
                            }
                        });
                        if ( !isEmpty ) {
                            elevationCells.addClass('disabled');
                        } else {
                            me.instance.inputTable.toggleElevationRows();
                        }
                    } else {
                        var elevationCells = me.instance.inputTable.getElements().rows.find('.elevation');
                        elevationCells.attr("contenteditable", true);

                        if ( elevationCells.hasClass('disabled') ) {
                            elevationCells.removeClass('disabled');
                        } else if( !elevationCells.hasClass('oskari-hidden') ) {
                            return;
                        } else {
                            me.instance.inputTable.toggleElevationRows();   
                        }             
                    }
                    // show the hidden select
                    if ( instances.dimension.getValue() === 'KOORDINAATISTO_SUORAK_2D' ) {
                        dropdowns.projection.parent().parent().show();
                    } else {
                        dropdowns.projection.parent().parent().hide();
                        instances.projection.resetToPlaceholder();
                    }

                    if ( instances.datum.getValue() !== me.instance.currentDatum || me.instance.currentDatum === undefined ) {
                        if ( key !== 'datum' ) {
                            instances[key].resetToPlaceholder();
                        }
                    }
                    values = {};
                    instances[key].update();
                    // get value of each select
                    for ( var j = 0; j < instanceLength; j++ ) {
                        var vl = instances[ Object.keys( instances) [j] ].getValue();
                        values[ Object.keys( instances) [j] ] = vl;
                    }
                    // last key update stuff
                        if( self.id === 'inputcoordsystem' ) {
                            me.instance.inputTable.updateTitle( values );
                            me.instance.inputTable.isEditable( me.instance.clipboardInsert );
                        } else if( self.id === 'targetcoordsystem' ) {
                            me.instance.outputTable.updateTitle( values );
                        }
                        me.instance.currentDatum = instances.datum.getValue();
                });
            });
            
            return values;
        }
});
 