Oskari.clazz.define('Oskari.coordinatetransformation.component.table', function( view, loc ) { //CoordinateTable
    this.transformView = view;
    this.loc = loc;
    this.container = null;
    this.defaultTableRows = 10;
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
                                    '<td class="cell lon" headers="north" style=" border: 1px solid black ;">${coords.col1}</td>'+
                                    '<td class="cell lat" headers="east" style=" border: 1px solid black ;">${coords.col2}</td>'+
                                    '<td class="cell elevation oskari-hidden" headers="ellipse_elevation" style=" border: 1px solid black;">${coords.elev}</td>'+
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
                "header": this.getContainer().find( ".oskari-table-header" )
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
                    elevationCells.addClass('oskari-hidden');
                }
            } else {
                elevationCells.attr("contenteditable", true);

                if ( elevationCells.hasClass('cell-disabled') ) {
                    elevationCells.removeClass('cell-disabled');
                } else if( !elevationCells.hasClass('oskari-hidden') ) {
                    return;
                } else {
                    elevationCells.removeClass('oskari-hidden');
                }
            }
        },
        create: function () {
            var me = this;
                var rowcounter = this.template.rowcounter({ rows: this.loc('flyout.coordinateField.rows') })
                                                                                
                var coordinatefield = this.template.table({
                    input: this.loc('flyout.coordinateField.input'),
                    north:this.loc('flyout.coordinateField.north'),
                    east:this.loc('flyout.coordinateField.east'),
                    ellipse_elevation: "" 
                });

                var table = this.template.tableWrapper();
                table = jQuery(table);
                table.append(coordinatefield);                
                table.find('.coordinatefield-table h5').append(rowcounter);

                this.setElement( table );

                this.bindRowCountListener();

                var coords = {};
                var tableRef = table.find("#oskari-coordinate-table");

                for ( var i = 0; i < this.defaultTableRows; i++ ) {
                   tableRef.append(this.template.row( { coords: coords } ) );
                }

                return this.getContainer();
        },
        /**
         * @method render
         * @param { Array } coords, array of coordinate arrays
         */
        render: function ( coords ) {
            var table = this.getElements().table;
            var row,
                rowData = {},
                coord;
            this.emptyTableCells();
            for ( var i = coords.length-1; i >= 0 ; i-- ) {
                coord = coords[i];
                rowData.col1 = coord[0];
                rowData.col2 = coord[1];
                if (coord[2]){
                    rowData.elev = coord[2];
                }
                row = this.template.row({coords:rowData});
                table.prepend(row);
            }
            this.handleTableSize(coords.length);
            table.trigger('rowCountChanged');
        },
        displayNumberOfDataRows: function ( number ) {
            this.getContainer().find("#num").text( number );
        },
        isEditable: function ( editable ) {
            var rows = this.getElements().rows;
            if( !editable ) {
                rows.each( function () {
                    jQuery(this).find('td').attr("contenteditable", false);
                });
            }
            else {
                rows.each( function () {
                    jQuery(this).find('td').attr("contenteditable", true);
                });
            }
        },
        emptyTableCells: function() {
            var isEditable = true; //TODO
            var cell;
            var rows = this.getElements().rows;
            for (var i = 0; i < rows.length; i++ ) {
                jQuery(rows[i]).find("td").each(function(){
                    cell = jQuery(this);
                    cell.text("");//empty();
                    cell.removeClass("invalid-coord");
                    if (isEditable){
                        cell.attr("contenteditable", true);
                    }
                });
            }
        },
        handleTableSize: function (dataRows) {
            var i = this.defaultTableRows;
            if (dataRows > this.defaultTableRows){
                i = dataRows;
            }
            var rows = this.getElements().rows;
            for (i; i < rows.length; i++ ) {
                var indexRow = jQuery( rows[i] );
                indexRow.remove();
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
            // TODO Refactor this
            /*var x = y = z = "";
            if ( values.projection === 'GK') {
                x = this.loc.coordinatefield.kkjnorth;
                y = this.loc.coordinatefield.kkjeast;
            }
            if ( values["geodetic-coordinate"].indexOf("KKJ") !== -1 ) {
                x = this.loc.coordinatefield.kkjnorth
                y = this.loc.coordinatefield.kkjeast
            } else if ( values["geodetic-coordinate"].indexOf("ETRS") !== -1 && values.projection !== 'GK' ) {
                x = this.loc.coordinatefield.kkjeast
                y = this.loc.coordinatefield.kkjnorth
            }
            if ( values.coordinate === "KOORDINAATISTO_MAANT_2D" ) {
                x = this.loc.coordinatefield.lon
                y = this.loc.coordinatefield.lat
            } else if ( values.coordinate === "KOORDINAATISTO_MAANT_3D" ) {
                x = this.loc.coordinatefield.lon
                y = this.loc.coordinatefield.lat
                z = this.loc.coordinatefield.ellipse_elevation
            }
            if ( values.coordinate === "KOORDINAATISTO_SUORAK_3D" ) {
                    x = this.loc.coordinatefield.geox
                    y = this.loc.coordinatefield.geoy
                    z = this.loc.coordinatefield.geoz
            }
            if( values.elevation !== 'KORKEUSJ_DEFAULT' && values.elevation !== "" ) {
                z = this.loc.coordinatefield.elevation;
            }

            if( x !== '' && y !== '' || z !== '' ) {

                var header = this.template.header({  
                    north: x,
                    east: y,
                    ellipse_elevation: z 
                });
                var header = jQuery(header);
                if (z == '') {
                   header.find('th').addClass('two');
                   header.find('#ellipse_elevation').css('display', 'none');
                } else {
                    header.find('th').addClass('three');
                }
                header.insertBefore( this.getContainer().find(".oskari-table-content") );
            }*/
        },
        handleClipboardPasteEvent: function () {
            var me = this;
            var cells = document.getElementsByClassName("cell");

            for ( var i = 0; i < cells.length; i++ ) {
                cells[i].addEventListener('paste', function( e ) {
                    e.stopPropagation();
                    e.preventDefault();

                    var clipboardData, pastedData;
                    // Get pasted data via clipboard API
                    clipboardData = e.clipboardData || window.clipboardData;
                    pastedData = clipboardData.getData('Text');

                    var dataJson = me.transformView.dataHandler.validateData( pastedData );
                    me.transformView.updateCoordinateData( "input", dataJson );
                });
            }
        }
}, {

});