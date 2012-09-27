Oskari.clazz
    .category(
        'Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance', 
        'default-buttons', 
        {
            l : function(key) {
                var karr = key.split('.');                
                var val = this.getLocalization('buttons');
                if (!(val && val.length)) {
                    return '<missing_localisation>';
                }
                for (var i = karr.length ; --i >= 0; ) {
                    val = val[karr[i]];
                }
                if (typeof val !== 'string') {
                    return '<missing_localisation>';
                }
                return val;                
            },
	    /**
	     * @method _addDefaultButtons
	     * @private
	     * 
	     * Adds default map window controls to toolbar.
	     * TODO: check if we really want to do this here instead of 
             * mapfull start()
	     */
	    _addDefaultButtons : function() {
	        var me = this;
                var reqBuilder = 
                    this
                    .getSandbox()
                    .getRequestBuilder('ToolSelectionRequest');
                var gfiRn =
                    'MapModulePlugin.GetFeatureInfoActivationRequest';
                var gfiReqBuilder = 
                    this
                    .getSandbox()
                    .getRequestBuilder(gfiRn);
                
                /* basic tools */
                this.addToolButton(
                    'reset', 'history', {
                        iconCls : 'tool-history-forward',
                        tooltip: this.l('history.next'),
                        sticky: false,
                        callback : function() {
                            var rn = 'map_control_tool_next';
                            me.getSandbox().request(me, reqBuilder(rn));
                        }
                    });
                
                /* basic tools */
                this.addToolButton(
                    'zoombox', 'basictools', {
                        iconCls : 'tool-zoombox',
                        tooltip: this.l('zoom'),
                        sticky: true,
                        callback : function() {
                            var rn = 'map_control_zoom_tool';
                            me.getSandbox().request(me, gfiReqBuilder(false));
                            me.getSandbox().request(me, reqBuilder(rn));
                        }
                    });
                this.addToolButton(
                    'select', 'basictools', {
                        iconCls : 'tool-pan',
                        tooltip: this.l('pan'),
                        selected : true,
                        sticky: true,
                        callback : function() {
                            var rn = 'map_control_navigate_tool';
                            me.getSandbox().request(me, gfiReqBuilder(true));
                            me.getSandbox().request(me, reqBuilder(rn));
                        }
                    });
                
                /* Measurements area */
                this.addToolButton(
                    'measureline', 'basictools', {
                        iconCls : 'tool-measure-line',
                        tooltip: this.l('measure.line'),
                        sticky: true,
                        callback : function() {
                            var rn = 'map_control_measure_tool';
                            me.getSandbox().request(me, gfiReqBuilder(false));
                            me.getSandbox().request(me, reqBuilder(rn));
                        }
                    });
                
                this.addToolButton(
                    'measurearea', 'basictools', {
                        iconCls : 'tool-measure-area',
                        tooltip: this.l('measure.area'),
                        sticky: true,
                        callback : function() {
                            var rn = 'map_control_measure_area_tool';
                            me.getSandbox().request(me, gfiReqBuilder(false));
                            me.getSandbox().request(me, reqBuilder(rn));
                        }
                    });
                                
                this.addToolButton(
                    'link', 'viewtools', {
                        iconCls : 'tool-link',
                        tooltip: this.l('link.tooltip'),
                        sticky: false,
                        callback : function() {
			    var linkParams = 
                                me.getSandbox().generateMapLinkParameters();
                            var pcn = 'Oskari.userinterface.component.Popup';
                            var okcn = 'Oskari.userinterface.component.Button';
		    	    var dialog = Oskari.clazz.create(pcn);
		    	    var okBtn = Oskari.clazz.create(okcn);
		    	    okBtn.setTitle(this.l('link.ok'));
		    	    okBtn.addClass('primary');
		    	    okBtn.setHandler(
                                function() {
                                    var rn = 
                                        'EnableMapKeyboardMovementRequest';
		                    dialog.close();
                                    me.getSandbox()
                                        .postRequestByName(rn);
		    	        });
		    	                   
		    	    var linkContent = 
				'<textarea rows="3" cols="80">' +
				this.l('link.prefixUrl') + 
				linkParams +
				'</textarea>';
                            var rn = 'DisableMapKeyboardMovementRequest';
                            me.getSandbox().postRequestByName(rn);
		    	    dialog.show(this.l('link.title'), 
                                        linkContent, 
                                        [okBtn]);
                        }
                    });
                
                this.addToolButton(
                    'print', 'viewtools', {
                        iconCls : 'tool-print',
                        tooltip: this.l('print.tooltip'),
                        sticky: false,
                        callback : function() {
                            var wopParm =
                                "location=1," + 
                                "status=1," + 
                                "scrollbars=1," + 
                                "width=850," + 
                                "height=1200";
                            var link =
                                window.location.pathname + 
                                '?' +
                                me.getSandbox().generateMapLinkParameters() +
                                '&p_p_id=Portti2Map_WAR_portti2mapportlet' + 
                                '&p_p_lifecycle=0' + 
                                '&p_p_state=exclusive'+ 
                                '&showMarker=false' + 
                                '&forceCache=true' + 
                                '&mapmode=print' + 
                                '&viewId=2';
			    window.open(link, "Print", wopParm);
			}
                    });
	    }
            
        });

