Oskari.clazz.category('Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance', 'default-buttons', {
	l : function(key) {
		var karr = key.split('.');
		var val = this.getLocalization('buttons');
		if(!(val && val.length)) {
		    return '!' + key + '!';
		}
                var pts = 'buttons';
		for(var i = 0; i < karr.length; i++ ) {
                    val = val[karr[i]];
                    pts += '.' + karr[i];
		}
		if( typeof val !== 'string') {
		    return pts;
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
		var reqBuilder = this.getSandbox().getRequestBuilder('ToolSelectionRequest');
		var gfiRn = 'MapModulePlugin.GetFeatureInfoActivationRequest';
		var gfiReqBuilder = this.getSandbox().getRequestBuilder(gfiRn);

		/* basic tools */
		this.addToolButton('reset', 'history', {
			iconCls : 'tool-reset',
			tooltip : me.l('history.reset'),
			sticky : false,
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
			tooltip : me.l('history.back'),
			sticky : false,
			callback : function() {
				me.getSandbox().request(me, reqBuilder('map_control_tool_prev'));
			}
		});
		this.addToolButton('history_forward', 'history', {
			iconCls : 'tool-history-forward',
			tooltip : me.l('history.next'),
			sticky : false,
			callback : function() {
				me.getSandbox().request(me, reqBuilder('map_control_tool_next'));
			}
		});

		/* basic tools */
		this.addToolButton('zoombox', 'basictools', {
			iconCls : 'tool-zoombox',
			tooltip : me.l('zoom'),
			sticky : true,
			callback : function() {
				var rn = 'map_control_zoom_tool';
				me.getSandbox().request(me, gfiReqBuilder(false));
				me.getSandbox().request(me, reqBuilder(rn));
			}
		});
		this.addToolButton('select', 'basictools', {
			iconCls : 'tool-pan',
			tooltip : me.l('pan'),
			selected : true,
			sticky : true,
			callback : function() {
				var rn = 'map_control_navigate_tool';
				me.getSandbox().request(me, gfiReqBuilder(true));
				me.getSandbox().request(me, reqBuilder(rn));
			}
		});

		/* Measurements area */
		this.addToolButton('measureline', 'basictools', {
			iconCls : 'tool-measure-line',
			tooltip : me.l('measure.line'),
			sticky : true,
			callback : function() {
				var rn = 'map_control_measure_tool';
				me.getSandbox().request(me, gfiReqBuilder(false));
				me.getSandbox().request(me, reqBuilder(rn));
			}
		});

		this.addToolButton('measurearea', 'basictools', {
			iconCls : 'tool-measure-area',
			tooltip : me.l('measure.area'),
			sticky : true,
			callback : function() {
				var rn = 'map_control_measure_area_tool';
				me.getSandbox().request(me, gfiReqBuilder(false));
				me.getSandbox().request(me, reqBuilder(rn));
			}
		});

		this.addToolButton('link', 'viewtools', {
			iconCls : 'tool-link',
			tooltip : me.l('link.tooltip'),
			sticky : false,
			callback : function() {
				var linkParams = me.getSandbox().generateMapLinkParameters();
				var pcn = 'Oskari.userinterface.component.Popup';
				var okcn = 'Oskari.userinterface.component.Button';
				var dialog = Oskari.clazz.create(pcn);
				var okBtn = Oskari.clazz.create(okcn);
				okBtn.setTitle(me.l('link.ok'));
				okBtn.addClass('primary');
				okBtn.setHandler(function() {
					var rn = 'EnableMapKeyboardMovementRequest';
					dialog.close();
					me.getSandbox().postRequestByName(rn);
				});
				var linkContent = '<textarea rows="3" cols="80">' + me.l('link.prefixUrl') + linkParams + '</textarea>';
				var rn = 'DisableMapKeyboardMovementRequest';
				me.getSandbox().postRequestByName(rn);
				dialog.show(me.l('link.title'), linkContent, [okBtn]);
			}
		});

		this.addToolButton('print', 'viewtools', {
			iconCls : 'tool-print',
			tooltip : me.l('print.tooltip'),
			sticky : false,
			callback : function() {
				var wopParm = "location=1," + "status=1," + "scrollbars=1," + "width=850," + "height=1200";
				var link = window.location.pathname + '?' + me.getSandbox().generateMapLinkParameters() + '&p_p_id=Portti2Map_WAR_portti2mapportlet' + '&p_p_lifecycle=0' + '&p_p_state=exclusive' + '&showMarker=false' + '&forceCache=true' + '&mapmode=print' + '&viewId=2';
				window.open(link, "Print", wopParm);
			}
		});
	}
});
