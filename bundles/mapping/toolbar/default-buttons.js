Oskari.clazz.category(
    'Oskari.mapframework.bundle.toolbar.ToolbarBundleInstance',
    'default-buttons', {
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
            this.dialog = null;
            var me = this,
                loc = this.getLocalization('buttons'),
                sandbox = this.getSandbox(),
                reqBuilder = Oskari.requestBuilder('ToolSelectionRequest'),
                gfiRn = 'MapModulePlugin.GetFeatureInfoActivationRequest',
                gfiReqBuilder = Oskari.requestBuilder(gfiRn),
                group;

            var buttonGroups = [{
                    'name': 'history',
                    'buttons': {
                        'reset': {
                            iconCls: 'tool-reset',
                            tooltip: loc.history.reset,
                            sticky: false,
                            callback: function () {
                                // statehandler reset state
                                var rb = Oskari.requestBuilder(
                                    'StateHandler.SetStateRequest'
                                );
                                if (rb) {
                                    me.getSandbox().request(me, rb());
                                }
                            }
                        },
                        'history_back': {
                            iconCls: 'tool-history-back',
                            tooltip: loc.history.back,
                            sticky: false,
                            callback: function () {
                                me.getSandbox().request(
                                    me,
                                    reqBuilder('map_control_tool_prev')
                                );
                            }
                        },
                        'history_forward': {
                            iconCls: 'tool-history-forward',
                            tooltip: loc.history.next,
                            sticky: false,
                            callback: function () {
                                me.getSandbox().request(
                                    me,
                                    reqBuilder('map_control_tool_next')
                                );
                            }
                        }
                    }
                }, {
                    'name': 'basictools',
                    'buttons': {
                        'zoombox': {
                            iconCls: 'tool-zoombox',
                            tooltip: loc.zoom,
                            sticky: true,
                            callback: function () {
                                var toolname = 'map_control_zoom_tool';
                                if(gfiReqBuilder) {
                                    me.getSandbox().request(
                                        me,
                                        gfiReqBuilder(false)
                                    );
                                }
                                me.getSandbox().request(me, reqBuilder(toolname));
                            }
                        },
                        'select': {
                            iconCls: 'tool-pan',
                            tooltip: loc.pan,
                            selected: true,
                            sticky: true,
                            callback: function () {
                                var toolname = 'map_control_navigate_tool';
                                if(gfiReqBuilder) {
                                    me.getSandbox().request(
                                        me,
                                        gfiReqBuilder(true)
                                    );
                                }
                                me.getSandbox().request(me, reqBuilder(toolname));
                            }
                        },
                        'measureline': {
                            iconCls: 'tool-measure-line',
                            tooltip: loc.measure.line,
                            sticky: true,
                            callback: function () {
                                var toolname = 'map_control_measure_tool';
                                if(gfiReqBuilder) {
                                    me.getSandbox().request(
                                        me,
                                        gfiReqBuilder(false)
                                    );
                                }
                                me.getSandbox().request(me, reqBuilder(toolname));
                            }
                        },
                        'measurearea': {
                            iconCls: 'tool-measure-area',
                            tooltip: loc.measure.area,
                            sticky: true,
                            callback: function () {
                                var toolname = 'map_control_measure_area_tool';
                                if(gfiReqBuilder) {
                                    me.getSandbox().request(
                                        me,
                                        gfiReqBuilder(false)
                                    );
                                }
                                me.getSandbox().request(me, reqBuilder(toolname));
                            }
                        }
                    }
                }, {
                    'name': 'viewtools',
                    'buttons': {
                        'link': {
                            iconCls: 'tool-link',
                            tooltip: loc.link.tooltip,
                            sticky: false,
                            callback: function () {
                              if( me.dialog ){
                                me.dialog.close(true);
                                me.dialog = null;
                                return;
                              }
                                me.dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                                me.dialog.onClose(function(){
                                  me.dialog = null;
                                });
                                var mapUrlPrefix = me.__getMapUrl();
                                var linkParams = me.getSandbox().generateMapLinkParameters({});
                                // This is kinda ugly...
                                // Only show marker if there's no markers.
                                if (linkParams.indexOf('&markers=') === -1) {
                                    linkParams += '&showMarker=true';
                                }
                                me.dialog.addClass('no_resize');
                                var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
                                okBtn.setTitle(loc.link.ok);
                                okBtn.addClass('primary');
                                okBtn.setHandler(function () {
                                    me.dialog.close();
                                    me.getSandbox().postRequestByName('EnableMapKeyboardMovementRequest');
                                });

                                var linkContent = '<div class="linkcontent">' +
                                    mapUrlPrefix + linkParams + '</div>';
                                me.getSandbox().postRequestByName('DisableMapKeyboardMovementRequest');
                                me.dialog.show(loc.link.title, linkContent, [okBtn]);
                            }
                        }
                    }
                }];

            for (group in buttonGroups) {
                if (buttonGroups.hasOwnProperty(group)) {
                    var buttonGroup = buttonGroups[group],
                        tool;
                    for (tool in buttonGroup.buttons) {
                        if (this._isButtonConfigured(tool, buttonGroup.name)) {
                            this.addToolButton(tool, buttonGroup.name, buttonGroup.buttons[tool]);
                        }
                    }
                }
            }
        },
        /**
         * Returns the map url for link tool
         * @private
         * @return {String} base URL for state parameters
         */
        __getMapUrl : function() {
            var sandbox = this.getSandbox();
            var url = null;
            if(this.conf) {
                url = sandbox.getLocalizedProperty(this.conf.mapUrlPrefix);
            }

            // setup current url as base if none configured
            return sandbox.createURL(url || window.location.pathname, true);
        }

    }
);
