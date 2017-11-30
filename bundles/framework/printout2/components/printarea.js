Oskari.clazz.define("Oskari.mapping.printout2.components.printarea",
    function ( view ) {
        this.view = view;
        this.instance = view.instance;
        this.loc = view.instance._localization["BasicView"];
        this.mapmodule = this.instance._mapmodule;
        this.size = null;
}, {
    templates: {
        printarea: jQuery('<div class="oskari-map-print-area"></div>'),
        overlay: jQuery('<div class="oskari-map-print-overlay"></div>')
    },
    calculateDistanceToMapEdges: function ( element ) {
        var mapdiv = jQuery("#mapdiv");

        var verticalDistance = ( mapdiv.width() - element.width() ) / 2;
        var horizontalDistance = ( mapdiv.height() - element.height() ) / 2;
        return {
            horizontal: horizontalDistance,
            vertical: verticalDistance
        }
    },
    updateBorders: function ( element ) {
        var mapdiv = jQuery("#mapdiv"); 
        var distances = this.calculateDistanceToMapEdges( element );
        element.css( { "margin-left": -distances.vertical,
                       "borderTopWidth": distances.horizontal,
                       "borderBottomWidth": distances.horizontal,
                       "borderLeftWidth": distances.vertical,
                       "borderRightWidth": distances.vertical,
                       "left": distances.vertical } );
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
        this.size = size;
        if( this.area ) {
            this.destroy();
        }
        var measures = this.getMeasuresForAreaPlot( size );
        this.area = this.templates.printarea.clone();
        this.area.css( {  pointerEvents: "none", width: measures.pixelMeasures[0]+'px', height: measures.pixelMeasures[1]+'px', border: '1px solid rgba(0,0,0,0.7)', position: 'absolute', zIndex:'10' } );
        jQuery("#mapdiv").prepend( this.area );
        this.updateBorders( this.area );
    },
    getPrintArea: function () {
        return this.area;
    },
    refresh: function () {
        this.createPlotArea( this.size );
    },
    destroy: function () {
        this.area = null;
        jQuery("#mapdiv").find( ".oskari-map-print-area" ).remove();
    }
}, {
});