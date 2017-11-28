Oskari.clazz.define("Oskari.mapping.printout2.components.printarea",
    function ( view ) {
        this.view = view;
        this.instance = view.instance;
        this.loc = view.instance._localization["BasicView"];
        this.mapmodule = this.instance._mapmodule;
}, {
    templates: {
        printarea: jQuery('<div class="oskari-map-print-area"></div>'),
        overlay: jQuery('<div class="oskari-map-print-overlay"></div>')
    },
    calculateDistanceToMapEdges: function ( element ) {
        var mapdiv = jQuery("#mapdiv");
        var maptools = jQuery("#maptools").offset()
        var mapoffset = mapdiv.offset();

        var printarea = element.offset();

        // var topDistance = mapoffset.top - printarea.top;
        // var leftDistance = mapoffset.left - maptools.left;
        // var rightDistance = mapdiv.width() - element.width() - leftDistance;
        // var bottomDistance ;
        // return {
        //     top: topDistance,
        //     left: leftDistance,
        //     right: rightDistance,
        //     bottom: 30
        // }
        var topDistance = mapoffset.top - printarea.top;
        var leftDistance = mapdiv.width() / 4 - mapoffset.left;
        var rightDistance = mapdiv.width() - element.width() - leftDistance;
        var bottomDistance ;
        return {
            top: 30,
            left: 438,
            right: rightDistance,
            bottom: 30
        }
    },
    updateBorders: function ( element ) {
        var mapdiv = jQuery("#mapdiv"); 
        var distances = this.calculateDistanceToMapEdges( element );
        element.css( { "margin-left": -distances.left, "borderTopWidth": distances.top, "borderBottomWidth": distances.bottom, "borderLeftWidth": distances.left + 'px', "borderRightWidth": distances.right + 'px', left: mapdiv.width() / 4 +'px' } );
    },
    getMeasuresForAreaPlot: function ( size ) {
        var mmMeasures = [];
       switch( size ) {
            case "A4" :
                mmMeasures = [210, 297];
                break;
            case "A4_Landscape" :
                mmMeasures = [297, 210];
                break;
            case "A3" :
                mmMeasures = [297, 420];
                break;
            case "A3_Landscape" :
                mmMeasures = [420, 297];
                break;
            default:
                break;
       }
        var scalein = undefined,
        pixelMeasures = [],
        zoomLevel = 0,
        nextScale;

        if ( mmMeasures && mmMeasures.constructor === Array ) {
            if ( !scalein ) {
                scalein = this.mapmodule.calculateFitScale4Measures( mmMeasures );
            }
            pixelMeasures =  this.mapmodule.calculatePixelsInScale( mmMeasures, scalein );
        }

        var scales =  this.mapmodule.getScaleArray();
        scales.forEach( function ( sc, index ) {
            if ( ( !nextScale || nextScale > sc ) && sc > scalein ) {
                nextScale = sc;
                zoomLevel = index;
            }
        });

        return {
            pixelMeasures: pixelMeasures,
            scale: scalein,
            zoomLevel: zoomLevel
        };
    },
    createPlotArea: function ( size ) {
        if( this.area ) {
            this.destroy();
        }
        var measures = this.getMeasuresForAreaPlot( size );
        this.area = this.templates.printarea.clone();
        this.area.css( {  pointerEvents: "none", width: measures.pixelMeasures[0]+'px', height: measures.pixelMeasures[1]+'px', border: '1px solid rgba(0,0,0,0.7)', position: 'absolute', zIndex:'10' } );
        this.updateBorders( this.area );
        jQuery("#mapdiv").prepend( this.area );
    },
    getPrintArea: function () {
        return this.area;
    },
    destroy: function () {
        this.area = null;
        jQuery("#mapdiv").find( ".oskari-map-print-area" ).remove();
    }
}, {
});