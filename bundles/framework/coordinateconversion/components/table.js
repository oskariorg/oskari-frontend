Oskari.clazz.define('Oskari.coordinateconversion.component.table', function( instance, loc ) {
    this.instance = instance;
    this.loc = loc;
    this.numrows = 1;
    this.template = {
            inputWrapper: jQuery('<div class="table-input"></div>'),
            outputWrapper: jQuery('<div class="table-output"></div>'),
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
                                    '<td class="cell heightsystem" headers="ellipse_height" style=" border: 1px solid black;"></td>'+
                                    '<td class="cell control"> <div class="removerow"></div></td>'+
                                '</tr> '),
            oskari_input_table_content: _.template('<div class="coordinatefield-input" style="display:inline-block;">' +
                                        '<h5> <%= input %> </h5>' +
                                        '<div class="oskari-table-content">'+
                                         '<div style="width:100%;height:98%; overflow:auto;">'+
                                            '<table class="hoverable" id="oskari-coordinate-table" style="border: 1px solid black;" cellpadding="0" cellspacing="0" border="0">'+
                                                '<tbody></tbody'+
                                            '</table>'+
                                         '</div>'+
                                        '</div>'+
                                    '</div>'),
            oskari_result_table_content: _.template('<div class="coordinatefield-result" style="display:inline-block; padding-left:8px;">' +
                                        '<h5> <%= result %> </h5>' +
                                        '<div class="oskari-table-content-target">'+
                                         '<div style="width:100%;height:98%; overflow:auto;">'+
                                            '<table class="hoverable" id="oskari-coordinate-table-result" style="border: 1px solid black;" cellpadding="0" cellspacing="0" border="0">'+
                                                '<tbody></tbody'+
                                            '</table>'+
                                         '</div>'+
                                        '</div>'+
                                    '</div>'),
    }
},  {
        create: function () {
            var me = this;
                var rowcounter = this.template.rowcounter({ rows: this.loc.utils.rows })
                var resultcoordinatefield = this.template.oskari_result_table_content({ result: this.loc.coordinatefield.result });
                var inputcoordinatefield = this.template.oskari_input_table_content({  input: this.loc.coordinatefield.input,
                                                                                north:this.loc.coordinatefield.north,
                                                                                east:this.loc.coordinatefield.east,
                                                                                ellipse_height: "" });

                var input = this.template.inputWrapper.clone();
                var output = this.template.outputWrapper.clone();

                input.append(inputcoordinatefield);
                output.append(resultcoordinatefield);

                input.find('.coordinatefield-input h5').append(rowcounter);

                var coords = {};
                for( var i = 0; i < 6; i++ ) {
                    input.find("#oskari-coordinate-table").append(this.template.row( { coords: coords } ) );
                    output.find("#oskari-coordinate-table-result").append(this.template.row( { coords: coords } ) );
                    me.updateRowCount();
                }
                return { input: input, output: output }

        },
        updateRowCount: function () {
                jQuery(this.instance.getContainer()).find("#num").text( this.numrows++ );
        },
        /**
         * @method populateTableWithData
         *
         * {Object} data, each key need to have property lon & lat 
         */
        populateTableWithData: function( cell, data ) {
            var table = this.getElements().table;
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var row = this.template.row( { coords: data[key] } );
                    jQuery(cell).parent().after(row);
                    this.updateRowCount();
                }
            }
            table.trigger('rowCountChanged');
        },
        addToInputTable: function (coords) {
            var table = this.getElements().table;
            for (var i = 0; i < coords.length; i++ ) {
                var row = this.template.row( { coords: coords[i] } );
                table.find('tr:first').after(row);
                this.updateRowCount();
            }
            table.trigger('rowCountChanged');
        },
        tableDisplayNumOfRows: function () {
            var me = this;
            var table = this.getElements().table;
            table.bind('rowCountChanged', function (evt) {
                var rows = me.getElements().rows;
                    if( rows.length >= 1000 ) {
                        rows.slice(1000).css('display', 'none');
                    }
                });
        },
        updateTableTitle: function (values) {
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

                jQuery(header).insertBefore( jQuery( this.instance.getContainer() ).find(".oskari-table-content") );
                jQuery(header).insertBefore( jQuery( this.instance.getContainer() ).find(".oskari-table-content-target") );
            }
    },
    getElements: function () {
        var elements = {
            "table": jQuery( this.instance.getContainer() ).find( '#oskari-coordinate-table' ),
            "rows": jQuery( this.instance.getContainer() ).find( "#oskari-coordinate-table tr" ),
            "header": jQuery( this.instance.getContainer() ).find( ".oskari-table-header" )
        }
        return elements;
    }
}, {

});