Oskari.clazz.define('Oskari.framework.bundle.coordinateconversion.view.conversion',
    function (instance) {
        var me = this;
        me.instance = instance;
        me.loc = me.instance.getLocalization("flyout");
        me.helper = Oskari.clazz.create('Oskari.framework.bundle.coordinateconversion.helper', me.instance, me.loc);
        me.selectFromMap = false;
        me.insertWithClipboard = false;
        me.conversionContainer = null
        me._template = {
            coordinatesystem: _.template(' <div class="coordinateconversion-csystem"> </br> ' +
                                    '<h4><%= title %></h4>'+
                                    '<div class="geodetic-datum"><b class="dropdown_title"><%= geodetic_datum %></b> <a href="#"><div class="infolink"></div></a> <div class="select"></div> </div> </br> ' +
                                    '<div class="coordinate-system"><b class="dropdown_title"><%= coordinate_system %></b> <a href="#"><div class="infolink"></div></a> <div class="select"></div>  </div> </br> ' +
                                    '<div class="map-projection" style="display:none;"> <%= map_projection %> <a href="#"><div class="infolink"></div></a> <div class="select"></div> </div> </br>' +
                                    '<div class="geodetic-coordinatesystem"><b class="dropdown_title"><%= geodetic_coordinate_system %> </b> <a href="#"><div class="infolink"></div></a> <div class="select"></div> </div> </br> ' +
                                    '<div class="height-system"><b class="dropdown_title"><%= height_system %></b></div> <a href="#"><div class="infolink"></div></a> <div class="select"></div> </div>'
                                ),
            coordinatedatasource: _.template('<div class="coordinateconversion-datasource"> </br> ' +
                                            '<h4><%= title %></h4>'+
                                            '<form>'+
                                                '<input type="radio" id="clipboard" name="load" value="2"><label for="clipboard"><span></span> <%= clipboard %> </label>'+
                                                '<input type="radio" id="file" name="load" value="1"><label for="file"> <span></span> <%= file %> </label>'+
                                                '<input type="button" id="overlay-btn" class="mapselect" name="load" value="<%= map %>">'+
                                            '</form> </div>'),
            datasourceinfo: _.template('<div class="coordinateconversion-datasourceinfo" style=display:none;"></div>' +
                                    '<form method="post" action="", enctype="multipart/form-data" class="box" id="fileinput" style="display:none">'+
                                        '<div class="box__input">'+
                                            '<input type="file" name="file" id="file" class="box__file" />'+
                                            '<label>  <%= fileupload %> <label for="file" style="cursor: pointer;"> <a> <%= link %> </a> </label> </label> '+
                                        '</div>'+
                                        '<div class="box__uploading"> <%= uploading %>&hellip;</div>'+
                                        '<div class="box__success"><%= success %></div>'+
                                        '<div class="box__error"><%= error %></div>'+
                                    '</form>'+
                                    '<div class="coordinateconversion-clipboardinfo" style=display:none;">'+
                                        '<div class="clipboardinfo"> <i><%= clipboardupload %><i> </div>'+
                                    '</div>' +
                                    '<div class="coordinateconversion-mapinfo" style=display:none;">'+
                                        '<div class="mapinfo"> <i><%= mapinfo %><i> </div>'+
                                    '</div>'
                                    ),  
            conversionfield: jQuery('<div class="coordinateconversion-field"></div>'),
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
            oskari_table_header: _.template('<div class="oskari-table-header">'+
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
            conversionbutton: _.template('<div class="conversionbtn" style="display:inline-block; padding-left: 8px;">' +
                                            '<input id="convert" type="button" value="<%= convert %> >>">' +
                                         '</div>'),
            tablerow: _.template('<tr>' +
                                    '<td class="cell lon" headers="north" style=" border: 1px solid black ;"> <%= coords.lon %> </td>'+
                                    '<td class="cell lat" headers="east" style=" border: 1px solid black ;"> <%= coords.lat %> </td>'+
                                    '<td class="cell heightsystem" headers="ellipse_height" style=" border: 1px solid black;"></td>'+
                                    '<td class="cell control"> <div class="removerow"></div></td>'+
                                '</tr> '),
            utilbuttons: _.template('<div class="coordinateconversion-buttons">' +
                                        '<input id="overlay-btn" class="clear" type="button" value="<%= clear %> ">' +
                                        '<input id="overlay-btn" class="show" type="button" value="<%= show %> ">' +
                                        '<input id="overlay-btn" class="export" type="button" value="<%= fileexport %> ">' +
                                        '</div>')
        }
    }, {
        getName: function() {
            return 'Oskari.framework.bundle.coordinateconversion.view.conversion';
        },
        createUI: function(container) {
           var me = this;
           this.conversionContainer = container;
            var coordinatesystem = this._template.coordinatesystem({ title: this.loc.coordinatesystem.title,
                                                          geodetic_datum: this.loc.coordinatesystem.geodetic_datum,
                                                          coordinate_system: this.loc.coordinatesystem.coordinate_system,
                                                          map_projection: this.loc.coordinatesystem.map_projection,
                                                          geodetic_coordinate_system:this.loc.coordinatesystem.geodetic_coordinatesystem,
                                                          height_system:this.loc.coordinatesystem.heigth_system });

            var coordinatedatasource = this._template.coordinatedatasource({ title: this.loc.datasource.title, 
                                                                             file: this.loc.datasource.file,
                                                                             clipboard: this.loc.datasource.clipboard,
                                                                             map: this.loc.datasource.map,
                                                                             choose: this.loc.datasource.choose });
    
            var inputcoordinatefield = this._template.oskari_input_table_content({  input: this.loc.coordinatefield.input,
                                                                            north:this.loc.coordinatefield.north,
                                                                            east:this.loc.coordinatefield.east,
                                                                            ellipse_height: "" });

            var conversionbutton = this._template.conversionbutton({ convert: this.loc.coordinatefield.convert });

            var resultcoordinatefield = this._template.oskari_result_table_content({ result: this.loc.coordinatefield.result });

            var datasourceinfo = this._template.datasourceinfo({ fileupload: this.loc.datasourceinfo.fileupload,
                                                            link: this.loc.datasourceinfo.link,
                                                            clipboardupload: this.loc.datasourceinfo.clipboardupload,
                                                            mapinfo: this.loc.datasourceinfo.mapinfo,
                                                            uploading: this.loc.datasourceinfo.uploading,
                                                            success: this.loc.datasourceinfo.success,
                                                            error: this.loc.datasourceinfo.error });

            var utilbuttons = this._template.utilbuttons({ clear: this.loc.utils.clear,
                                                            show: this.loc.utils.show,
                                                            fileexport: this.loc.utils.export });
            jQuery(container).append(coordinatesystem);
            jQuery(container).find('.coordinateconversion-csystem').attr('id','inputcoordsystem');
            jQuery(container).append(coordinatesystem);
            jQuery(container ).find('.coordinateconversion-csystem').not('#inputcoordsystem').attr('id','targetcoordsystem');
            jQuery(container).append(coordinatedatasource);
            jQuery(container).append(datasourceinfo);

            this._template.conversionfield.append(inputcoordinatefield);
            this._template.conversionfield.append(conversionbutton);
            this._template.conversionfield.append(resultcoordinatefield);
            jQuery(container).append(this._template.conversionfield);
            jQuery(container).append(utilbuttons);

            var input_instance = me.createSelect();
            jQuery(container ).find('#inputcoordsystem').find('.select').each(function (index) {
                jQuery(this).append(input_instance.dropdowns[index]);
            });
            var target_instance = me.createSelect();
            jQuery(container ).find('#targetcoordsystem').find('.select').each(function (index) {
                jQuery(this).append(target_instance.dropdowns[index]);
            });
            var coords = {} 
            for( var i = 0; i < 8; i++ ) {
                jQuery(container).find("#oskari-coordinate-table").append(this._template.tablerow( { coords: coords } ) );
                jQuery(container).find("#oskari-coordinate-table-result").append(this._template.tablerow( { coords: coords } ) );
            }
        var inputValues = this.selectGetValue(input_instance, false);
        var targetValues = this.selectGetValue(target_instance, true);
        this.handleClipboard();
        this.handleButtons();
        this.handleRadioButtons();
         if( this.canUseAdvancedUpload() ) {
            this.handleDragAndDrop();
         }
        },
        createSelect: function() {
            var json = this.helper.getOptionsJSON();

            var selections = [];
            var dropdowns = [];
            var selectInstances = [];
            var options = {}
            jQuery.each( json, function ( key, value ) {
                var size = Object.keys(value).length;
                 jQuery.each( value, function ( key, val ) {
                    var valObject = {
                        id : val.id,
                        title : val.title,
                        cls: val.cls
                    };
                    selections.push( valObject );
                    if (key === "0") {
                        options = {
                            placeholder_text: val.title,
                            allow_single_deselect : true,
                            disable_search_threshold: 10,
                            width: '100%'
                        };
                    }
                     if (key == size -1) {
                        var select = Oskari.clazz.create('Oskari.userinterface.component.SelectList', "id");
                        var dropdown = select.create(selections, options);
                        selections = [];
                        options = {};

                        dropdown.css({width:'130px', float:'right'});
                        select.adjustChosen();
                        select.selectFirstValue();
                        // if(index > 0) {
                        //     dropdown.parent().addClass('margintop');
                        // }
                        dropdowns.push(dropdown);
                        selectInstances.push(select);
                     }
                });
            });
            return {"instances": selectInstances, "dropdowns": dropdowns};
        },
          /**
         * @method selectGetValue
         * which key corresponds to which dropdown in the array:
         * [0] = geodetic datum,
         * [1] = coordinate system
         * [2] = map projection
         * [3] = geodetic coordinate system
         * [4] = heigth system
         */
        selectGetValue: function ( instance, called ) {
            var me = this;
            var values = [];
            var rows = this.getRows();
            if( !called ) {
                jQuery( this.conversionContainer ).find('#inputcoordsystem').on("change", function() {
                    for (var i = 0; i < instance.instances.length; i++ ) {

                    instance.dropdowns[i].find('option').hide();
                    instance.dropdowns[i].find('.'+ instance.instances[0].getValue()).show();

                    // Koordinaatisto special cases
                    if( instance.instances[1].getValue() === "KOORDINAATISTO_MAANT_2D" ) {
                        instance.dropdowns[3].find('option').hide();
                        jQuery(instance.dropdowns[i].find('.'+instance.instances[0].getValue()+'.'+ instance.instances[1].getValue())).show();
        
                    }
                    if( instance.instances[1].getValue() === "KOORDINAATISTO_MAANT_3D" ) {
                        instance.dropdowns[3].find('option').hide();
                        instance.dropdowns[i].find('.'+ instance.instances[1].getValue()).show();
                    }
                    if( instance.instances[1].getValue() === "KOORDINAATISTO_SUORAK_2D" ) {
                        instance.dropdowns[3].find('option').hide();
                        instance.dropdowns[i].find('.'+ instance.instances[1].getValue()).show();
                    }
                    if( instance.instances[1].getValue() === "KOORDINAATISTO_SUORAK_3D" ) {
                        instance.dropdowns[3].find('option').hide();
                        instance.dropdowns[i].find('.'+ instance.instances[1].getValue()).show();
                    }
                    // Karttaprojektiojärjestelmä special cases
                    if( instance.instances[2].getValue() === "KKJ_KAISTA" ) {
                        instance.dropdowns[3].find('option').hide();
                        instance.dropdowns[i].find('.'+ instance.instances[2].getValue()).show();
                    }
                    if( instance.instances[2].getValue() === "TM" ) {
                        instance.dropdowns[3].find('option').hide();
                        instance.dropdowns[i].find('.'+ instance.instances[2].getValue()).show();
                    } 
                    if( instance.instances[2].getValue() === "GK" ) {
                        instance.dropdowns[3].find('option').hide();
                        instance.dropdowns[i].find('.'+ instance.instances[2].getValue()).show();
                    }
                    if( instance.instances[4].getValue() === "KORKEUSJ_DEFAULT") {
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
                        
                    if( instance.instances[1].getValue() === 'KOORDINAATISTO_SUORAK_2D' ) {
                        jQuery('.map-projection').show();
                    } else {
                        jQuery('.map-projection').hide();
                        instance.instances[2].resetToPlaceholder();
                    }

                    if( instance.instances[0].getValue() !== this.currentDatum || this.currentDatum === undefined) {
                        if( i !== 0 ) {
                            instance.instances[i].resetToPlaceholder();
                        }
                    }
                    if( instance.instances[1].getValue() !== this.currentCoordinatesystem || this.currentCoordinatesystem === undefined) {
                        if( i > 1) {
                            instance.instances[i].resetToPlaceholder();
                        }
                    }
                    values = [];
                    instance.instances[i].update();
                    for (var j = 0; j < instance.instances.length; j++ ) {
                        var vl = instance.instances[j].getValue();
                        values.push(vl);
                    }
                    if( i == instance.instances.length -1 ) {
                        me.updateTableTitle(values);
                        me.updateEditable(values);
                        this.currentDatum = instance.instances[0].getValue();
                        this.currentCoordinatesystem = instance.instances[1].getValue();
                    }
                }
                });
            } else {
                jQuery( this.conversionContainer ).find('#targetcoordsystem').on("change", function() {
                var selects = jQuery(this).find(".oskari-select");
                for (var i = 0; i < selects.length; i++ ) {
                   var vl = instance.instances[i].getValue();
                }
                });
            }
            return values;
        },
         updateEditable: function (values) {
            if(typeof values === null) {
                values = undefined;
            }
            var rows = this.getRows();
            if( !this.insertWithClipboard ) {
                rows.each( function ( row ) {
                    jQuery(this).find('td').attr("contenteditable", false);
                });
            }
            else {
                rows.each( function ( row ) {
                    jQuery(this).find('td').attr("contenteditable", true);
                });
            }
            if(values === undefined) {
                return;
            }

        },
        updateTableTitle: function (values) {
            jQuery(this.conversionContainer).find(".oskari-table-header").remove();
            var x = y = z = "";
            if( values[3].indexOf("COORDSYS_KKJ") !== -1 ) {
                x = this.loc.coordinatefield.kkjnorth
                y = this.loc.coordinatefield.kkjeast
                z = ""
            }
            if( values[3].indexOf("COORDSYS_ETRS") !== -1 ) {
                x = this.loc.coordinatefield.kkjeast
                y = this.loc.coordinatefield.kkjnorth
                z = ""
            }
            if( values[1].indexOf("KOORDINAATISTO_MAANT_2D") !== -1 ) {
                x = this.loc.coordinatefield.lon
                y = this.loc.coordinatefield.lat
                z = ""
            } else if(values[1].indexOf("KOORDINAATISTO_MAANT_3D") !== -1 ) {
                x = this.loc.coordinatefield.lon
                y = this.loc.coordinatefield.lat
                z = this.loc.coordinatefield.ellipse_height
            }
            if(values[1].indexOf("KOORDINAATISTO_SUORAK_3D") !== -1 ) {
                   x = this.loc.coordinatefield.geox
                   y = this.loc.coordinatefield.geoy
                   z = this.loc.coordinatefield.geoz
            }

            if(jQuery(this.conversionContainer).find('.rowHeader')) {
                jQuery(this.conversionContainer).find('.rowHeader').remove();
            }

            if( x !== '' && y !== '' || z !== '' ) {
            var tableHeader = this._template.oskari_table_header({  north: x,
                                                            east: y,
                                                            ellipse_height: z });
            jQuery(tableHeader).insertBefore(jQuery(this.conversionContainer).find(".oskari-table-content"));
            jQuery(tableHeader).insertBefore(jQuery(this.conversionContainer).find(".oskari-table-content-target"));
            }
        },
        /**
         * @method canUseAdvancedUpload
         *
         * Checks if the browser supports drag and drop events aswell as formdata & filereader
         * @return {boolean} true if supported 
         */
        canUseAdvancedUpload: function() {
            var div = document.createElement('div');
            return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
         },
        /**
         * @method handleClipboard
         *
         * Handles the paste event in the input table
         * example data to paste:
            lon:385000.5, lat:667500.75,
            lon:385545.5, lat:6675310.75
         * currently only works in format specified above in the example
         * https://regex101.com <- good place to test
         */
        handleClipboard: function () {
            
            var me = this;
            var cells = document.getElementsByClassName("cell");

            for(var i = 0; i < cells.length; i++ ) {
                cells[i].addEventListener('paste', function(e) {
                        // Stop data actually being pasted into div
                        e.stopPropagation();
                        e.preventDefault();

                    if( me.insertWithClipboard === false ) {
                        return;
                    }
                    var clipboardData, pastedData;

                        // Get pasted data via clipboard API
                        clipboardData = e.clipboardData || window.clipboardData;
                        pastedData = clipboardData.getData('Text');

                        var lonlat = new RegExp(/(lon|lat)[\:][0-9.]+[\,]?/g);
                        var fullLonlat = new RegExp(/(?:lon|lat)[\:][0-9.]+[\,].*,?/g);
                        var numeric = new RegExp(/[0-9.]+/);
                        
                        var jsonLonLat = {};
                        var fullLonLatMatch = pastedData.match(fullLonlat);
                        for(var i = 0; i < fullLonLatMatch.length; i++) {
                            jsonLonLat[i] = {lon:'',lat:''};
                            var lonlatMatch = fullLonLatMatch[i].match(lonlat);
                            var lonValue = lonlatMatch[0].match(numeric);
                            var latValue = lonlatMatch[1].match(numeric);
                            jsonLonLat[i].lon = lonValue[0];
                            jsonLonLat[i].lat = latValue[0];
                        }

                        me.populateTableWithData(e.target, jsonLonLat);

                });
            }
        },
        /**
         * @method populateTableWithData
         *
         * {Object} data, each key need to have property lon & lat 
         */
        populateTableWithData: function( cell, data ) {
            for (var key in data) {
                if (data.hasOwnProperty(key)) {
                    var row = this._template.tablerow( { coords: data[key] } );
                    jQuery(cell).parent().after(row);
                }
            }
        },
        /**
         * @method handleRadioButtons
         * Inits the on change listeners for the radio buttons
         * 
         */
        handleRadioButtons: function() {
            var me = this;
            var clipboardInfo = jQuery(me.conversionContainer).find('.coordinateconversion-clipboardinfo');
            var mapInfo = jQuery(me.conversionContainer).find('.coordinateconversion-mapinfo');
            var fileInput = jQuery(me.conversionContainer).find('#fileinput');

            jQuery('input[type=radio][name=load]').change(function() {
                if (this.value == '1') {
                    clipboardInfo.hide();
                    fileInput.show();
                    me.selectFromMap = false;
                    me.insertWithClipboard = false;
                }
                else if (this.value == '2') {
                    fileInput.hide();
                    me.insertWithClipboard = true;
                    clipboardInfo.show();
                    me.selectFromMap = false;
                }
                me.updateEditable();
            });

                jQuery('.mapselect').on("click", function() {
                    me.instance.plugins['Oskari.userinterface.Flyout'].shouldUpdate(me.getName());
                    me.selectFromMap = true; 
                    me.insertWithClipboard = false;                   
                });
         },
        /**
         * @method handleRadioButtons
         * Inits the on change listeners for the radio buttons
         * 
         */
        handleButtons: function () {
            var me = this;
            var helper = Oskari.clazz.create('Oskari.framework.bundle.coordinateconversion.helper', this.instance, this.loc);
            jQuery(this.conversionContainer).find('.clear').on("click", function () {
                var cells = jQuery('#oskari-coordinate-table tr .cell:not(.cell.control)');
                for(var i = 0; i < cells.length; i++) {
                    var trimmedCellValue = jQuery.trim( jQuery( cells[i] ).html());
                    if( trimmedCellValue !== "" ) {
                        jQuery(cells[i]).parent().remove();
                    }
                }
            });
            jQuery(this.conversionContainer).find('.show').on("click", function () {
                var rows = me.getRows();
                rows.each(function () {
                    var lat = jQuery(this).find('.lat').html();
                    var lon = jQuery(this).find('.lon').html();
                    if(lat != "  " && lon != "  "){
                        var coords = { lon: lon, lat: lat };
                        helper.moveToCoords(coords);
                    }
                })
                });
            // jQuery('.removerow').on('click', function () {
                
            // });
        },
        addToInputTable: function (coords) {
            var table = jQuery(this.conversionContainer).find('#oskari-coordinate-table');
            for (var i = 0; i < coords.length; i++ ) {
                var row = this._template.tablerow( { coords: coords[i] } );
                table.find('tr:first').after(row);
                //append the click event to the new rows aswell
                // jQuery('.removerow').on('click', function () {
                //     jQuery(this).parent().parent().remove();
                // }); 
            }
        },
        getRows: function () {
            var rows = jQuery(this.conversionContainer).find("#oskari-coordinate-table tr");
            return rows;
        },
        /**
         * @method handleDragAndDrop
         * Checks for drag and drop events, on submit makes ajax request
         * 
         *
         */
        handleDragAndDrop: function() {
            var me = this;
            var form = jQuery(this.conversionContainer).find('.box');
            var input = form.find('input[type="file"]');
            form.addClass('has-advanced-upload');

             var droppedFiles = false;

            form.on('drag dragstart dragend dragover dragenter dragleave drop', function(e) {
                e.preventDefault();
                e.stopPropagation();
            })
            .on('dragover dragenter', function() {
                form.addClass('is-dragover');
            })
            .on('dragleave dragend drop', function() {
                form.removeClass('is-dragover');
            })
            .on('drop', function(e) {
                droppedFiles = e.originalEvent.dataTransfer.files;
                form.trigger('submit');
            });
            

            form.on('submit', function(e) {
                if (form.hasClass('is-uploading')) return false;

                form.addClass('is-uploading').removeClass('is-error');

                e.preventDefault();

                var ajaxData = new FormData(form.get(0));

                if (droppedFiles) {
                    jQuery.each( droppedFiles, function(i, file) {
                    ajaxData.append( input.attr('name'), file );
                    });
                }

                jQuery.ajax({
                    url: form.attr('action'),
                    type: form.attr('method'),
                    data: ajaxData,
                    dataType: 'json',
                    cache: false,
                    contentType: false,
                    processData: false,
                    complete: function() {
                        form.removeClass('is-uploading');
                    },
                    success: function(data) {
                        form.addClass( data.success == true ? 'is-success' : 'is-error' );
                        if (!data.success) $errorMsg.text(data.error);
                    },
                    error: function() {
                        form.addClass('is-error').removeClass('is-uploading');
                    // Log the error, show an alert, whatever works for you
                    }
                });
            
            });
        }
    }
);
 