Oskari.clazz.define('Oskari.coordinateconversion.component.table', function( instance, loc ) {
    this.instance = instance;
    this.loc = loc;
    this.numrows = 1;
    this.container = null;
    this.template = {
            tableWrapper: jQuery('<div class="table"></div>'),
            rowcounter: _.template('<div class="rowcount"><span id="num"></span> <%= rows %> </div>'),
            header: _.template('<div class="oskari-table-header">'+
                                        '<table id="oskari-tbl-header" cellpadding="0" cellspacing="0" border="0">'+
                                            '<thead>'+
                                                '<tr>' +
                                                    '<th id="nort"><%= north %></th>'+
                                                    '<th id="east"><%= east %></th>'+
                                                    '<th id="ellipse_height" ><%= ellipse_height %></th>'+
                                                '</tr>'+
                                             '</thead>'+
                                        ' </table>'+
                                     '</div>'),
            row: _.template('<tr>' +
                                    '<td class="cell lon" headers="north" style=" border: 1px solid black ;"> <%= coords.lon %> </td>'+
                                    '<td class="cell lat" headers="east" style=" border: 1px solid black ;"> <%= coords.lat %> </td>'+
                                    '<td class="cell height" headers="ellipse_height" style=" border: 1px solid black;"></td>'+
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
        create: function () {
            var me = this;
                var rowcounter = this.template.rowcounter({ rows: this.loc.utils.rows })
                                                                                
                var coordinatefield = this.template.table({  input: this.loc.coordinatefield.input,
                                                                north:this.loc.coordinatefield.north,
                                                                east:this.loc.coordinatefield.east,
                                                                ellipse_height: "" });

                var table = this.template.tableWrapper.clone();

                table.append(coordinatefield);                

                table.find('.coordinatefield-table h5').append(rowcounter);

                this.setElement( table );


                var coords = {};
                for( var i = 0; i < 10; i++ ) {
                    table.find("#oskari-coordinate-table").append(this.template.row( { coords: coords } ) );
                    me.incrementNumRows();
                }

                return this.getContainer();
        },
        incrementNumRows: function () {
                this.getContainer().find("#num").text( this.numrows++ );
        },
        decrementNumRows: function () {
                this.getContainer().find("#num").text( this.numrows-- );
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
        removeRow: function () {
            this.getElements().rows.first().remove();
            this.decrementNumRows();
        },
        /**
         * @method populate
         *
         * {Object} data, each key need to have property lon & lat 
         */
        populate: function( cell, data ) {
            var table = this.getElements().table;
            var i = 0;
            for ( var key in data ) {
                if ( i === 9 ) {
                    if ( data.hasOwnProperty( key ) ) {
                        var row = this.template.row( { coords: data[key] } );
                        jQuery( cell ).parent().after( row );
                        this.incrementNumRows();
                        i++;
                    }
                }
            }
            table.trigger('rowCountChanged');
        },
        addRows: function (coords) {
            var table = this.getElements().table;
            for (var i = 0; i < coords.length; i++ ) {
                var row = this.template.row( { coords: coords[i] } );
                table.find('tr:first').after(row);
                this.incrementNumRows();
            }
            table.trigger('rowCountChanged');
        },
        clearRows: function () {
            var cells = this.getContainer().find('tr .cell:not(.cell.control)');
            for(var i = 0; i < cells.length; i++) {
                var trimmedCellValue = jQuery.trim( jQuery( cells[i] ).html() );
                if( trimmedCellValue !== "" ) {
                    jQuery( cells[i] ).parent().remove();
                    this.decrementNumRows();
                }
            }
        },
        displayNumOfRows: function () {
            var me = this;
            var table = this.getElements().table;
            table.bind('rowCountChanged', function (evt) {
                var rows = me.getElements().rows;
                    if( rows.length >= 1000 ) {
                        rows.slice(1000).css('display', 'none');
                    }
                });
        },
        updateTitle: function (values) {
            this.getElements().header.remove();
            
            var x = y = z = "";
            if( values[3].indexOf("COORDSYS_KKJ" ) !== -1 ) {
                x = this.loc.coordinatefield.kkjnorth
                y = this.loc.coordinatefield.kkjeast
                z = ""
            }
            if( values[3].indexOf("COORDSYS_ETRS" ) !== -1 ) {
                x = this.loc.coordinatefield.kkjeast
                y = this.loc.coordinatefield.kkjnorth
                z = ""
            }
            if( values[1].indexOf("KOORDINAATISTO_MAANT_2D" ) !== -1 ) {
                x = this.loc.coordinatefield.lon
                y = this.loc.coordinatefield.lat
                z = ""
            } else if( values[1].indexOf("KOORDINAATISTO_MAANT_3D" ) !== -1 ) {
                x = this.loc.coordinatefield.lon
                y = this.loc.coordinatefield.lat
                z = this.loc.coordinatefield.ellipse_height
            }
            if( values[1].indexOf("KOORDINAATISTO_SUORAK_3D" ) !== -1 ) {
                    x = this.loc.coordinatefield.geox
                    y = this.loc.coordinatefield.geoy
                    z = this.loc.coordinatefield.geoz
            }

            if( x !== '' && y !== '' || z !== '' ) {

                var header = this.template.header({  north: x,
                                                     east: y,
                                                     ellipse_height: z });

                jQuery( header ).insertBefore( jQuery( this.getContainer() ).find(".oskari-table-content") );
            }
    }
}, {

});