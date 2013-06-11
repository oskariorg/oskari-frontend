Oskari.clazz.category('Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance', 'default-buttons', {
    /**
     * @method _isButtonConfigured
     * @private
     * 
     * @param {String}
     *            pId identifier so we can manage the button with subsequent requests
     * @param {String}
     *            pGroup identifier for organizing buttons
     *
     * Checks the configuration if the button should be excluded.
     * All buttons are included by default
     */
    _isButtonConfigured : function(pId, pGroup) {
    	if (this.conf && (this.conf[pGroup] === false || (this.conf[pGroup] && this.conf[pGroup][pId] === false))) {
    		// When conf is defined and pGroup or pId false, then exclude the button
			return false;
    	} else {
    		// Without a conf, all buttons are included
    		return true;
    	}
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
        var loc = this.getLocalization('buttons');
		var reqBuilder = this.getSandbox().getRequestBuilder('ToolSelectionRequest');
		var gfiRn = 'MapModulePlugin.GetFeatureInfoActivationRequest';
		var gfiReqBuilder = this.getSandbox().getRequestBuilder(gfiRn);

		/* basic tools */
		if (this._isButtonConfigured('reset', 'history')) {
			this.addToolButton('reset', 'history', {
				iconCls : 'tool-reset',
				tooltip : loc.history.reset,
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
		}
		if (this._isButtonConfigured('history_back', 'history')) {
			this.addToolButton('history_back', 'history', {
				iconCls : 'tool-history-back',
				tooltip : loc.history.back,
				sticky : false,
				callback : function() {
					me.getSandbox().request(me, reqBuilder('map_control_tool_prev'));
				}
			});
		}
		if (this._isButtonConfigured('history_forward', 'history')) {
			this.addToolButton('history_forward', 'history', {
				iconCls : 'tool-history-forward',
				tooltip : loc.history.next,
				sticky : false,
				callback : function() {
					me.getSandbox().request(me, reqBuilder('map_control_tool_next'));
				}
			});
		}

		/* basic tools */
		if (this._isButtonConfigured('zoombox', 'basictools')) {
			this.addToolButton('zoombox', 'basictools', {
				iconCls : 'tool-zoombox',
				tooltip : loc.zoom,
				sticky : true,
				callback : function() {
					var rn = 'map_control_zoom_tool';
					me.getSandbox().request(me, gfiReqBuilder(false));
					me.getSandbox().request(me, reqBuilder(rn));
				}
			});
		}
		if (this._isButtonConfigured('select', 'basictools')) {
			this.addToolButton('select', 'basictools', {
				iconCls : 'tool-pan',
				tooltip : loc.pan,
				selected : true,
				sticky : true,
				callback : function() {
					var rn = 'map_control_navigate_tool';
					me.getSandbox().request(me, gfiReqBuilder(true));
					me.getSandbox().request(me, reqBuilder(rn));
				}
			});
		}

		/* Measurements area */
		if (this._isButtonConfigured('measureline', 'basictools')) {
			this.addToolButton('measureline', 'basictools', {
				iconCls : 'tool-measure-line',
				tooltip : loc.measure.line,
				sticky : true,
				callback : function() {
					var rn = 'map_control_measure_tool';
					me.getSandbox().request(me, gfiReqBuilder(false));
					me.getSandbox().request(me, reqBuilder(rn));
				}
			});
		}
		if (this._isButtonConfigured('measurearea', 'basictools')) {
			this.addToolButton('measurearea', 'basictools', {
				iconCls : 'tool-measure-area',
				tooltip : loc.measure.area,
				sticky : true,
				callback : function() {
					var rn = 'map_control_measure_area_tool';
					me.getSandbox().request(me, gfiReqBuilder(false));
					me.getSandbox().request(me, reqBuilder(rn));
				}
			});
		}
		
		if (this._isButtonConfigured('link', 'viewtools')) {
			this.addToolButton('link', 'viewtools', {
				iconCls : 'tool-link',
				tooltip : loc.link.tooltip,
				sticky : false,
				callback : function() {
					var linkParams = me.getSandbox().generateMapLinkParameters({showMarker : true});
					var pcn = 'Oskari.userinterface.component.Popup';
					var okcn = 'Oskari.userinterface.component.Button';
					var dialog = Oskari.clazz.create(pcn);
					dialog.addClass("no_resize");
					var okBtn = Oskari.clazz.create(okcn);
					okBtn.setTitle(loc.link.ok);
					okBtn.addClass('primary');
					okBtn.setHandler(function() {
						var rn = 'EnableMapKeyboardMovementRequest';
						dialog.close();
						me.getSandbox().postRequestByName(rn);
					});
					var linkContent = '<textarea rows="3" cols="80">' + loc.link.prefixUrl + linkParams + '</textarea>';
					var rn = 'DisableMapKeyboardMovementRequest';
					me.getSandbox().postRequestByName(rn);
					dialog.show(loc.link.title, linkContent, [okBtn]);
				}
			});
		}
		
		if (this._isButtonConfigured('print', 'viewtools')) {
			this.addToolButton('print', 'viewtools', {
				iconCls : 'tool-print',
				tooltip : loc.print.tooltip,
				sticky : false,
				callback : function() {
					var wopParm = "location=1," + "status=1," + "scrollbars=1," + "width=850," + "height=1200";
					var link = window.location.pathname + '?' + me.getSandbox().generateMapLinkParameters() + 
					    '&p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=0&p_p_state=exclusive' + 
					    '&showMarker=false&forceCache=true&mapmode=print&viewId=2';
					window.open(link, "Print", wopParm);
				}
			});
		}
		
	}
});
