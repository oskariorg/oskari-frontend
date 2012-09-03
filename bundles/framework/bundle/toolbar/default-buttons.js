Oskari.clazz.category('Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance', 'default-buttons', {
    
	/**
	 * @method _addDefaultButtons
	 * @private
	 * 
	 * Adds default map window controls to toolbar.
	 * TODO: check if we really want to do this here instead of mapfull start()
	 */
	_addDefaultButtons : function() {
	    var me = this;
        var reqBuilder = this.getSandbox().getRequestBuilder('ToolSelectionRequest');
        var locales = me.getLocalization('buttons');
        
        /* basic tools */
        this.addToolButton('reset', 'history', {
            iconCls : 'tool-reset',
            tooltip: 'Paluu aloitusnäkymään',
            sticky: false,
            callback : function() {                
                // statehandler reset state
                var rb = me.getSandbox().getRequestBuilder('StateHandler.SetStateRequest');
                if(rb) {
                    me.getSandbox().request(me, rb());
                }
                // clear history
                var req = me.getSandbox().getRequestBuilder('ClearHistoryRequest')();
                me.getSandbox().request(me, req);
            }
        });
        this.addToolButton('history_back', 'history', {
            iconCls : 'tool-history-back',
            tooltip: 'Taaksepäin historiassa',
            sticky: false,
            callback : function() {
                me.getSandbox().request(me, reqBuilder('map_control_tool_prev'));
            }
        });
        this.addToolButton('history_forward', 'history', {
            iconCls : 'tool-history-forward',
            tooltip: 'Eteenpäin historiassa',
            sticky: false,
            callback : function() {
                me.getSandbox().request(me, reqBuilder('map_control_tool_next'));
            }
        });
        
        /* basic tools */
        this.addToolButton('zoombox', 'basictools', {
            iconCls : 'tool-zoombox',
            tooltip: 'Zoom',
            sticky: true,
            callback : function() {
                me.getSandbox().request(me, reqBuilder('map_control_zoom_tool'));
            }
        });
        this.addToolButton('select', 'basictools', {
            iconCls : 'tool-pan',
            tooltip: 'Pan',
            selected : true,
            sticky: true,
            callback : function() {
                me.getSandbox().request(me, reqBuilder('map_control_navigate_tool'));
            }
        });
        
        /* Measurements area */
        this.addToolButton('measureline', 'measuretools', {
            iconCls : 'tool-measure-line',
            tooltip: 'Measure line',
            sticky: true,
            callback : function() {
                me.getSandbox().request(me, reqBuilder('map_control_measure_tool'));
            }
        });
        
        this.addToolButton('measurearea', 'measuretools', {
            iconCls : 'tool-measure-area',
            tooltip: 'Measure area',
            sticky: true,
            callback : function() {
                me.getSandbox().request(me, reqBuilder('map_control_measure_area_tool'));
            }
        });
        
        
        this.addToolButton('link', 'viewtools', {
            iconCls : 'tool-link',
            tooltip: locales.link.tooltip,
            sticky: false,
            callback : function() {
				var linkParams = me.getSandbox().generateMapLinkParameters();
				
		    	var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
		    	var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
		    	okBtn.setTitle(locales.link.ok);
		    	okBtn.addClass('primary');
		    	okBtn.setHandler(function() {
		            dialog.close();
		    	});
		    	
		    	var linkContent = 
					'<textarea rows="3" cols="80">' +
					locales.link.prefixUrl + 
					linkParams +
					'</textarea>';
		    	dialog.show(locales.link.title, linkContent, [okBtn]);
            }
        });
        
        this.addToolButton('print', 'viewtools', {
            iconCls : 'tool-print',
            tooltip: locales.print.tooltip,
            sticky: false,
            callback : function() {
				var linkParams = me.getSandbox().generateMapLinkParameters();
				linkParams += '&p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=0&p_p_state=exclusive&showMarker=false&forceCache=true&mapmode=print&viewId=2';
				var link = window.location.pathname + '?' + linkParams;
				window.open (link,"Print", "location=1,status=1,scrollbars=yes,width=850,height=800");
			}
        });
        
        
        
	}
    
});

	