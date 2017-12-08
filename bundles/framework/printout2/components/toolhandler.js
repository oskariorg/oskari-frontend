Oskari.clazz.define("Oskari.mapping.printout2.components.toolhandler",
    function ( view ) {
        this.view = view;
        this.instance = view.instance;
        this.loc = view.instance.getLocalization("BasicView");
        this.availableTools = null;
        this.toolsOnMap = {};
}, {
    templates: {
        toolContainer: jQuery('<div></div>'),
        positionSelector: jQuery('<div class="tool ">' + '<input type="radio" name="legend" />' + '<label></label></div>'),
        tool: jQuery('<div style="clear:both"> <input id="print-protocol-tool" type="checkbox" style="float:left" ></input> <label class="printout_checklabel" for="print-protocol-tool"></label> </div>')
    },
    getProtocolImplementers: function () {
        return Oskari.clazz.protocol('Oskari.mapping.printout2.Tool');
    },
    getExtendingTools: function () {
        var me = this;
        var container = jQuery('<div></div>');
        var tools = this.createExtendingTools();
        tools.forEach( function ( tool ) {
            var toolEl = me.templates.tool.clone();
            toolEl.find('input').attr("name", tool.getName);
            toolEl.bind(tool);
            toolEl.find('label').html(tool.getName());
            container.append( toolEl );
        });
        this.handleChange( container );
        return container;
    },
    handleChange: function ( element ) {
        var me = this;
        element.find( "#print-protocol-tool" ).on( 'change', function () {
            var self = this;
            if ( this.checked ) {
                me.availableTools.forEach( function ( tool ) {
                    if ( tool.getName() === self.name ) {
                        var printElement = tool.getElement();
                        if( !printElement ) {
                            return;
                        }
                        me.toolsOnMap[self.name] = printElement;
                        me.setPosition( printElement, "bottom-right" );
                        me.view.printarea.getPrintArea().prepend( printElement );
                        return;
                    }
                });
            } else {
                me.availableTools.forEach( function ( tool ) {
                    if ( tool.getName() === self.name ) {
                        var item = me.toolsOnMap[self.name];
                        me.view.printarea.getPrintArea().find( item ).remove();
                    }
                });
            }
        });
    },
    createExtendingTools: function () {
        var me = this;
        var definedTools = this.getProtocolImplementers();
        var tools = [];
        Object.keys( definedTools ).forEach( function ( tool ) {
            var tool = Oskari.clazz.create( tool );
            if ( tool.isActive() === true ) {
                tools.push(tool);
            }
        });
        this.availableTools = tools;
        return tools;
    },
    createToolsPanel: function () {
        var tools = this.getExtendingTools();
        var me = this,
            panel = Oskari.clazz.create(
                'Oskari.userinterface.component.AccordionPanel'
            );

        panel.setTitle(me.loc.tools.label);
        var contentPanel = panel.getContainer();

        var toolPanel = me.templates.toolContainer.clone();
        toolPanel.append( tools );
        contentPanel.append(toolPanel);
        return panel;
    },
    setPosition: function ( tool, radioSelection ) {
       switch( radioSelection ) {
           case "top-right" :
                tool.css( { right: 0, top: 0, position: 'absolute' } );
                break;
            case "top-left" :
                tool.css( { left: 0, top: 0, position: 'absolute' } );
                break;
            case "bottom-right" :
                tool.css( { right: 0, bottom: 0, position: 'absolute' } );
                break;
            case "bottom-left" :
                tool.css( { left: 0, bottom: 0, position: 'absolute' } );
                break;
            default:
                break;
       }
    }
}, {
});