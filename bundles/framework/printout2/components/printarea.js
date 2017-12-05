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
    // width, height
    sizeOptions: {
        "A4": [210, 297],
        "A4_Landscape": [297, 210],
        "A3": [297, 420],
        "A3_Landscape": [420, 297]
    },
    // width 1cm * 2, height 1,5cm * 2
    paperMargins: [20, 30],
    getPaperSize: function(size) {
        var mmMeasures = this.sizeOptions[size] || [];
        if(!mmMeasures.length) {
            throw new Error('Invalid size option: ' + size);
        }
        mmMeasures = mmMeasures.slice(0);
        // remove margins from page size
        mmMeasures[0] -= this.paperMargins[0];
        mmMeasures[1] -= this.paperMargins[1];
        return mmMeasures;
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
        var mmMeasures = this.getPaperSize(size);
        var scalein = this.mapmodule.calculateFitScale4Measures( mmMeasures );
        var pixelMeasures = this.mapmodule.calculatePixelsInScale( mmMeasures, scalein ) || [];

        var zoomLevel = 0;
        var nextScale;
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
});