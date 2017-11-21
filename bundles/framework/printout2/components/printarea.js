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
    createOverlay: function () {
       this.overlay = this.templates.overlay.clone();
       this.overlay.css({ pointerEvents: "none", width: jQuery("#mapdiv").width(), height: jQuery("#mapdiv").height(), backgroundColor:"rgba(0,0,0,0.7)", top:0, position: "absolute" });
       return this.overlay;
    },
    calculateDistanceToMapEdges: function ( element ) {
        var mapdiv = jQuery("#mapdiv");
        var mapoffset = mapdiv.offset();

        var printarea = element.offset();

        var topDistance = mapoffset.top - printarea.top;
        var leftDistance = printarea.left - mapoffset.left;
        var rightDistance = mapdiv.width() - element.width() - leftDistance;
        var bottomDistance ;
        return {
            top: topDistance,
            left: leftDistance,
            right: rightDistance,
            bottom: bottomDistance
        }
    },
    updateBorders: function ( element ) {

        var distances = this.calculateDistanceToMapEdges( element );
        element.css( { "borderTopWidth": "25px !important", "borderLeftWidth": distances.left + 'px', "borderRightWidth": distances.right + 'px' } );
    },
    plotPrintAreaOnMap: function ( size ) {
        // if ( !this.overlay ) {
        //     jQuery("#mapdiv").append( this.createOverlay() );
        // }
        var mmMeasures = [];
       switch( size ) {
            case "A4" :
                mmMeasures = [210, 297];
                break;
            case "A4_Landscape" :
                mmMeasures = [];
                break;
            case "A3" :
                mmMeasures = [420, 297];
                break;
            case "A4_Landscape" :
                mmMeasures = [];
                break;
            default:
                break;
       }
        var scalein = undefined,
        pixelMeasures = [],
        zoomLevel = 0,
        nextScale;

        if(mmMeasures && mmMeasures.constructor === Array){
            if(!scalein){
                scalein = this.mapmodule.calculateFitScale4Measures(mmMeasures);
            }
            pixelMeasures =  this.mapmodule.calculatePixelsInScale(mmMeasures, scalein);
        }

        var scales =  this.mapmodule.getScaleArray();
        scales.forEach(function(sc, index) {
            if ((!nextScale || nextScale > sc) && sc > scalein) {
                nextScale = sc;
                zoomLevel = index;
            }
        });
       var area = this.templates.printarea.clone();

       area.css( { pointerEvents: "none", width: pixelMeasures[0]+'px', height: pixelMeasures[1]+'px', border: '1px solid rgba(0,0,0,0.7)', position: 'absolute', zIndex:'10' } );
        jQuery("#mapdiv").prepend( area );
        this.updateBorders( area );
       return area;
        // return {
        //     pixelMeasures: pixelMeasures,
        //     scale: scalein,
        //     zoomLevel: zoomLevel
        // };
    }
}, {
});