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
    _isButtonConfigured: function (pId, pGroup) {
        if (this.conf && (this.conf[pGroup] === false || (this.conf[pGroup] && this.conf[pGroup][pId] === false))) {
            // When conf is defined and pGroup or pId false, then exclude the button
            return false;
        }
        // Without a conf, all buttons are included
        return true;
    },

    /**
     * @method _addDefaultButtons
     * @private
     *
     * Adds default map window controls to toolbar.
     * TODO: check if we really want to do this here instead of
     * mapfull start()
     */
    _addDefaultButtons: function () {
        var me = this,
            loc = this.getLocalization('buttons'),
            reqBuilder = this.getSandbox().getRequestBuilder('ToolSelectionRequest'),
            gfiRn = 'MapModulePlugin.GetFeatureInfoActivationRequest',
            gfiReqBuilder = this.getSandbox().getRequestBuilder(gfiRn),
            rb,
            rn,
            req,
            linkParams,
            pcn,
            okcn,
            dialog,
            okBtn,
            linkContent,
            wopParm,
            link,
            mapUrlPrefix = null;

        /* basic tools */
        if (this._isButtonConfigured('reset', 'history')) {
            this.addToolButton('reset', 'history', {
                iconCls: 'tool-reset',
                tooltip: loc.history.reset,
                sticky: false,
                callback: function () {
                    // statehandler reset state
                    rb = me.getSandbox().getRequestBuilder('StateHandler.SetStateRequest');
                    if (rb) {
                        me.getSandbox().request(me, rb());
                    }
                    // clear history
                    req = me.getSandbox().getRequestBuilder('ClearHistoryRequest')();
                    me.getSandbox().request(me, req);
                }
            });
        }
        if (me._isButtonConfigured('history_back', 'history')) {
            me.addToolButton('history_back', 'history', {
                iconCls: 'tool-history-back',
                tooltip: loc.history.back,
                sticky: false,
                callback: function () {
                    me.getSandbox().request(me, reqBuilder('map_control_tool_prev'));
                }
            });
        }
        if (me._isButtonConfigured('history_forward', 'history')) {
            me.addToolButton('history_forward', 'history', {
                iconCls: 'tool-history-forward',
                tooltip: loc.history.next,
                sticky: false,
                callback: function () {
                    me.getSandbox().request(me, reqBuilder('map_control_tool_next'));
                }
            });
        }

        /* basic tools */
        if (me._isButtonConfigured('zoombox', 'basictools')) {
            me.addToolButton('zoombox', 'basictools', {
                iconCls: 'tool-zoombox',
                tooltip: loc.zoom,
                sticky: true,
                callback: function () {
                    rn = 'map_control_zoom_tool';
                    me.getSandbox().request(me, gfiReqBuilder(false));
                    me.getSandbox().request(me, reqBuilder(rn));
                }
            });
        }
        if (me._isButtonConfigured('select', 'basictools')) {
            me.addToolButton('select', 'basictools', {
                iconCls: 'tool-pan',
                tooltip: loc.pan,
                selected: true,
                sticky: true,
                callback: function () {
                    rn = 'map_control_navigate_tool';
                    me.getSandbox().request(me, gfiReqBuilder(true));
                    me.getSandbox().request(me, reqBuilder(rn));
                }
            });
        }

        /* Measurements area */
        if (me._isButtonConfigured('measureline', 'basictools')) {
            me.addToolButton('measureline', 'basictools', {
                iconCls: 'tool-measure-line',
                tooltip: loc.measure.line,
                sticky: true,
                callback: function () {
                    rn = 'map_control_measure_tool';
                    me.getSandbox().request(me, gfiReqBuilder(false));
                    me.getSandbox().request(me, reqBuilder(rn));
                }
            });
        }
        if (me._isButtonConfigured('measurearea', 'basictools')) {
            me.addToolButton('measurearea', 'basictools', {
                iconCls: 'tool-measure-area',
                tooltip: loc.measure.area,
                sticky: true,
                callback: function () {
                    rn = 'map_control_measure_area_tool';
                    me.getSandbox().request(me, gfiReqBuilder(false));
                    me.getSandbox().request(me, reqBuilder(rn));
                }
            });
        }

        if (me.conf) {
            mapUrlPrefix = me.getSandbox().getLocalizedProperty(me.conf.mapUrlPrefix);
        }
        if (me._isButtonConfigured('link', 'viewtools') && mapUrlPrefix) {
            me.addToolButton('link', 'viewtools', {
                iconCls: 'tool-link',
                tooltip: loc.link.tooltip,
                sticky: false,
                callback: function () {
                    linkParams = me.getSandbox().generateMapLinkParameters({
                        showMarker: true
                    });
                    pcn = 'Oskari.userinterface.component.Popup';
                    okcn = 'Oskari.userinterface.component.Button';
                    dialog = Oskari.clazz.create(pcn);
                    dialog.addClass("no_resize");
                    okBtn = Oskari.clazz.create(okcn);
                    okBtn.setTitle(loc.link.ok);
                    okBtn.addClass('primary');
                    okBtn.setHandler(function () {
                        rn = 'EnableMapKeyboardMovementRequest';
                        dialog.close();
                        me.getSandbox().postRequestByName(rn);
                    });

                    linkContent = '<textarea rows="3" cols="80">' + mapUrlPrefix + linkParams + '</textarea>';
                    rn = 'DisableMapKeyboardMovementRequest';
                    me.getSandbox().postRequestByName(rn);
                    dialog.show(loc.link.title, linkContent, [okBtn]);
                }
            });
        }

        if (me._isButtonConfigured('print', 'viewtools')) {
            me.addToolButton('print', 'viewtools', {
                iconCls: 'tool-print',
                tooltip: loc.print.tooltip,
                sticky: false,
                callback: function () {
                    wopParm = "location=1," + "status=1," + "scrollbars=1," + "width=850," + "height=1200";
                    link = window.location.pathname + '?' + me.getSandbox().generateMapLinkParameters() +
                        '&p_p_id=Portti2Map_WAR_portti2mapportlet&p_p_lifecycle=0&p_p_state=exclusive' +
                        '&showMarker=false&forceCache=true&mapmode=print&viewId=2';
                    window.open(link, "Print", wopParm);
                }
            });
        }

    }
});