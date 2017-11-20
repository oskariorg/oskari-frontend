Oskari.clazz.define("Oskari.mapping.printout2.components.toolholder",
    function ( view ) {
        this.view = view;
        this.instance = view.instance;
        this.loc = view.instance._localization["BasicView"];
}, {
    templates: {
        toolContainer: jQuery('<div></div>'),
        positionSelector: jQuery('<div class="tool ">' + '<input type="radio" name="legend" />' + '<label></label></div>'),
    },
    setPosition: function ( tool, radioSelection ) {
       switch( radioSelection ) {
           case "top-right" :
                tool.css( { right: 0, top: 0 } );
                break;
            case "top-left" :
                tool.css( { left: 0, top: 0 } );
                break;
            case "bottom-right" :
                tool.css( { right: 0, bottom: 0 } );
                break;
            case "bottom-left" :
                tool.css( { left: 0, bottom: 0 } );
                break;
            default:
                break;
       }
    }
}, {
});