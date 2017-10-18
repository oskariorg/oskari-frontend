Oskari.clazz.define('Oskari.coordinateconversion.component.select',
    function ( instance ) {
        var me = this;
        me.instance = instance;
        me.selects = [];
        me.dropdowns = [];
    }, {
        getSelect: function () {
            return this.selects;
        },
        getDropdown: function () {
            return this.dropdowns;
        },
        create: function () {
            var json = this.instance.helper.getOptionsJSON();

            var selections = [];
            var dropdowns = [];
            var selects = [];
            var options = {}
            jQuery.each( json, function ( key, value ) {
                var size = Object.keys( value ).length;
                 jQuery.each( value, function ( key, val ) {
                    var valObject = {
                        id : val.id,
                        title : val.title,
                        cls: val.cls
                    };
                    selections.push( valObject );
                    if ( key === "0" ) {
                        options = {
                            placeholder_text: val.title,
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

                        dropdown.css( { width:'170px', float:'right' } );
                        select.adjustChosen();
                        select.selectFirstValue();

                        selects.push(select);
                        dropdowns.push(dropdown);
                     }
                });
            });
                this.dropdowns = dropdowns;
                this.selects = selects;
        },
        /**
         * @method handleSelectionChanged
         * which key corresponds to which dropdown in the array:
         * [0] = geodetic datum,
         * [1] = coordinate system
         * [2] = map projection
         * [3] = geodetic coordinate system
         * [4] = heigth system
         */
        handleSelectionChanged: function ( element ) {
            var me = this;
            var values = [];
            var instances = this.getSelect();
            var dropdowns = this.getDropdown();
            var rows = me.instance.inputTable.getElements().rows;
                element.on( "change", function() {
                    for (var i = 0; i < instances.length; i++ ) {

                    dropdowns[i].find('option').hide();
                    dropdowns[i].find('.'+ instances[0].getValue()).show();

                    // Koordinaatisto special cases
                    if( instances[1].getValue() === "KOORDINAATISTO_MAANT_2D" ) {
                        dropdowns[3].find('option').hide();
                        jQuery(dropdowns[i].find('.'+instances[0].getValue()+'.'+ instances[1].getValue())).show();
        
                    }
                    if( instances[1].getValue() === "KOORDINAATISTO_MAANT_3D" ) {
                        dropdowns[3].find('option').hide();
                        dropdowns[i].find('.'+ instances[1].getValue()).show();
                    }
                    if( instances[1].getValue() === "KOORDINAATISTO_SUORAK_2D" ) {
                        dropdowns[3].find('option').hide();
                        dropdowns[i].find('.'+ instances[1].getValue()).show();
                    }
                    if( instances[1].getValue() === "KOORDINAATISTO_SUORAK_3D" ) {
                        dropdowns[3].find('option').hide();
                        dropdowns[i].find('.'+ instances[1].getValue()).show();
                    }
                    // Karttaprojektiojärjestelmä special cases
                    if( instances[2].getValue() === "KKJ_KAISTA" ) {
                        dropdowns[3].find('option').hide();
                        dropdowns[i].find('.'+ instances[2].getValue()).show();
                    }
                    if( instances[2].getValue() === "TM" ) {
                        dropdowns[3].find('option').hide();
                        dropdowns[i].find('.'+ instances[2].getValue()).show();
                    } 
                    if( instances[2].getValue() === "GK" ) {
                        dropdowns[3].find('option').hide();
                        dropdowns[i].find('.'+ instances[2].getValue()).show();
                    }
                    if( instances[3].getValue() !== "COORDSYS_DEFAULT" ) {
                        me.instance.startingSystem = true;
                    } else {
                        me.instance.startingSystem = true;
                    }
                    if( instances[4].getValue() === "KORKEUSJ_DEFAULT") {
                        rows.each( function ( idx, row ) {
                            var lastCell = jQuery(this).find('td:nth-last-child(2)');
                            if( !lastCell.hasClass('heightsystem' )) {
                                lastCell.addClass('heightsystem');
                            }
                        });
                    } else {
                        rows.each( function ( idx, row ) {
                            var lastCell = jQuery(this).find('td:nth-last-child(2)');
                            lastCell.attr("contenteditable", false);
                            lastCell.removeClass('heightsystem');
                        })
                    }
                        
                    if( instances[1].getValue() === 'KOORDINAATISTO_SUORAK_2D' ) {
                        jQuery('.map-projection').show();
                    } else {
                        jQuery('.map-projection').hide();
                        instances[2].resetToPlaceholder();
                    }

                    if( instances[0].getValue() !== me.instance.currentDatum ||me.instance.currentDatum === undefined ) {
                        if( i !== 0 ) {
                            instances[i].resetToPlaceholder();
                        }
                    }
                    if( instances[1].getValue() !== me.instance.currentCoordinatesystem ||me.instance.currentCoordinatesystem === undefined ) {
                        if( i > 1) {
                            instances[i].resetToPlaceholder();
                        }
                    }
                    values = [];
                    instances[i].update();
                    for ( var j = 0; j < instances.length; j++ ) {
                        var vl = instances[j].getValue();
                        values.push( vl );
                    }
                    if( i == instances.length -1 ) {
                        if( this.id === 'inputcoordsystem' ) {
                            me.instance.inputTable.updateTitle( values );
                            me.instance.inputTable.isEditable( me.instance.clipboardInsert );
                        } else if( this.id === 'targetcoordsystem' ) {
                            me.instance.outputTable.updateTitle( values );
                        }
                        me.instance.currentDatum = instances[0].getValue();
                        me.instance.currentCoordinatesystem = instances[1].getValue();
                    }
                }
            });
            
            return values;
        },
    }
);
 