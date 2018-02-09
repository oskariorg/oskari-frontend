Oskari.clazz.define('Oskari.coordinatetransformation.component.table', function( instance, loc ) {
    this.instance = instance;
    this.loc = loc;
    this.container = null;
    this.template = {
            tableWrapper: _.template('<div class="table"></div>'),
            rowcounter: _.template('<div class="rowcount"><span id="num"></span> ${rows} </div>'),
            header: _.template('<div class="oskari-table-header">'+
                                        '<table id="oskari-tbl-header" cellpadding="0" cellspacing="0" border="0">'+
                                            '<thead>'+
                                                '<tr>' +
                                                    '<th id="nort">${north}</th>'+
                                                    '<th id="east">${east}</th>'+
                                                    '<th id="ellipse_elevation" >${ellipse_elevation}</th>'+
                                                '</tr>'+
                                             '</thead>'+
                                        ' </table>'+
                                     '</div>'),
            row: _.template('<tr>' +
                                    '<td class="cell lon" headers="north" style=" border: 1px solid black ;">${coords.lon}</td>'+
                                    '<td class="cell lat" headers="east" style=" border: 1px solid black ;">${coords.lat}</td>'+
                                    '<td class="cell elevation oskari-hidden" headers="ellipse_elevation" style=" border: 1px solid black;"></td>'+
                                    '<td class="cell control"> <div class="removerow"></div></td>'+
                                '</tr> '),
            table:_.template('<div class="coordinatefield-table" style="display:inline-block;">' +
                                        '<h5> <%= input %> </h5>' +
                                        '<div class="oskari-table-content">'+
                                         '<div style="width:100%; overflow:auto;">'+
                                            '<table class="hoverable" id="oskari-coordinate-table" style="border: 1px solid black;" cellpadding="0" cellspacing="0" border="0">'+
                                                '<tbody></tbody'+
                                            '</table>'+
                                         '</div>'+
                                        '</div>'+
                                    '</div>')
    }
},  {   
        getContainer: function () {
            return jQuery(this.container);
        },
        getElements: function () {
            var elements = {
                "table": this.getContainer().find( '#oskari-coordinate-table' ),
                "rows": this.getContainer().find( "#oskari-coordinate-table tr" ),
                "header": this.getContainer().find( ".oskari-table-header" ),

            }
        return elements;
        },
        setElement: function ( el ) {
            this.container = el;
        },
         /**
         * @method displayTableElevationRow
         * @param {boolean} display - true - display the row, false - hide or grey out depending if there is data in the row
         * @desc handle hiding and showing the elevation row in the table
         */
        handleDisplayingElevationRows: function ( display ) {
            var me = this;
            var isEmpty = true;
            var elevationCells = me.getElements().rows.find('.elevation');
            if ( !display ) {
                elevationCells.attr("contenteditable", false);
                //check if elevationcells have value, if true don't hide but grey out
                elevationCells.each( function (key, val) {
                    var element = jQuery( val );
                    element.html().trim();
                    if ( !element.is(':empty') ) {
                        isEmpty = false;
                    }
                });
                if ( !isEmpty ) {
                    elevationCells.addClass('cell-disabled');
                } else {
                    me.toggleElevationRows();
                }
            } else {
                elevationCells.attr("contenteditable", true);

                if ( elevationCells.hasClass('cell-disabled') ) {
                    elevationCells.removeClass('cell-disabled');
                } else if( !elevationCells.hasClass('oskari-hidden') ) {
                    return;
                } else {
                    me.toggleElevationRows();
                }
            }
        },
        toggleElevationRows: function () {
            var elevationRows = this.getElements().rows.find('.elevation');
            if ( elevationRows.hasClass('oskari-hidden') ) {
                elevationRows.removeClass('oskari-hidden');
            } else {
                elevationRows.addClass('oskari-hidden');
            }
        },
        
        create: function () {
            var me = this;
                var rowcounter = this.template.rowcounter({ rows: this.loc.utils.rows })
                                                                                
                var coordinatefield = this.template.table({
                    input: this.loc.coordinatefield.input,
                    north:this.loc.coordinatefield.north,
                    east:this.loc.coordinatefield.east,
                    ellipse_elevation: "" 
                });

                var table = this.template.tableWrapper();
                table = jQuery(table);
                table.append(coordinatefield);                
                table.find('.coordinatefield-table h5').append(rowcounter);

                this.setElement( table );

                this.bindRowCountListener();

                var coords = {};
                for( var i = 0; i < 10; i++ ) {
                    table.find("#oskari-coordinate-table").append(this.template.row( { coords: coords } ) );
                }

                return this.getContainer();
        },
        displayNumberOfDataRows: function ( number ) {
            this.getContainer().find("#num").text( number );
        },
        isEditable: function ( editable ) {
            var rows = this.getElements().rows;
            if( !editable ) {
                rows.each( function ( row ) {
                    jQuery(this).find('td').attr("contenteditable", false);
                });
            }
            else {
                rows.each( function ( row ) {
                    jQuery(this).find('td').attr("contenteditable", true);
                });
            }
        },
        /**
         * @method addRows
         *
         * {Object} coords, each key needs to have property lon & lat 
         */
        addRows: function (coords) {
            var table = this.getElements().table;
            for ( var key in coords ) {
                if ( coords.hasOwnProperty( key ) ) {
                    var row = this.template.row( { coords: coords[key] } );
                    table.prepend(row);
                }
            }
            table.trigger('rowCountChanged');
        },
        clearRows: function () {
            var rows = this.getElements().rows;
            for ( var i = 0; i < rows.length; i++ ) {
                var indexRow = jQuery( rows[i] );
                if ( indexRow.children().first().html() !== ""  ) {
                    indexRow.remove();
                }
            }
            this.getElements().table.trigger('rowCountChanged');
        },
        bindRowCountListener: function () {
            var me = this;
            var table = this.getElements().table;
            table.bind('rowCountChanged', function (evt) {
                var rows = jQuery(evt.currentTarget).find('tr');
                var number = 0;
                for ( var i = 0; i < rows.length; i++ ) {
                    var indexRow = jQuery( rows[i] );
                    if ( indexRow.children().first().html() !== "" ) {
                        number++;
                    }
                }
                me.displayNumberOfDataRows( number );
            });
        },
        updateTitle: function (values) {
            this.getElements().header.remove();
            
            var x = y = z = "";
            if ( values.coordinatesystem === "COORDSYS_KKJ" ) {
                x = this.loc.coordinatefield.kkjnorth
                y = this.loc.coordinatefield.kkjeast
                z = ""
            } else if ( values.coordinatesystem === "COORDSYS_ETRS" ) {
                x = this.loc.coordinatefield.kkjeast
                y = this.loc.coordinatefield.kkjnorth
                z = ""
            }
            if ( values.dimension === "KOORDINAATISTO_MAANT_2D" ) {
                x = this.loc.coordinatefield.lon
                y = this.loc.coordinatefield.lat
                z = ""
            } else if ( values.dimension === "KOORDINAATISTO_MAANT_3D" ) {
                x = this.loc.coordinatefield.lon
                y = this.loc.coordinatefield.lat
                z = this.loc.coordinatefield.ellipse_elevation
            }
            if ( values.dimension === "KOORDINAATISTO_SUORAK_3D" ) {
                    x = this.loc.coordinatefield.geox
                    y = this.loc.coordinatefield.geoy
                    z = this.loc.coordinatefield.geoz
            }

            if( x !== '' && y !== '' || z !== '' ) {

                var header = this.template.header({  
                    north: x,
                    east: y,
                    ellipse_elevation: z 
                });

                jQuery( header ).insertBefore( jQuery( this.getContainer() ).find(".oskari-table-content") );
            }
    }
}, {

});