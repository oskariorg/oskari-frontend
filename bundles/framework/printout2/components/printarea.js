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
       this.overlay.css({ pointerEvents: "none", width: jQuery("#mapdiv").width(), height: jQuery("#mapdiv").height(), backgroundColor:"rgba(0,0,0,0.4)", top:0, position: "absolute" });
       return this.overlay;
    },
    updateBorders: function ( element ) {
        // border-top-width: 25px !important;
        // border-left-width: 500px !important;
        // border-right-width: 500px !important;
        element.css( { "border-top-width": "25px !important", "border-left-width": "500px !important", "border-right-width": "500px !important" } );
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

       area.css( { pointerEvents: "none", width: pixelMeasures[0]+'px', height: pixelMeasures[1]+'px', border: '1px solid rgba(0,0,0,0.4)', position: 'absolute', zIndex:'10' } );
       this.updateBorders( area );
        jQuery("#mapdiv").prepend( area );
       return area;
        // return {
        //     pixelMeasures: pixelMeasures,
        //     scale: scalein,
        //     zoomLevel: zoomLevel
        // };
    }
}, {
});