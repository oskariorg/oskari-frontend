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
         * @method _getLinkUuid
         * @private
         *
         * @return {String} current view uuid, if public view. Otherwise returns uuid of system default view with same srs as current view.
         */
        _getLinkUuid: function () {
            if (Oskari.app.isPublic()) {
                return Oskari.app.getUuid();
            }
            // not public -> get the a system appsetup with matching srs
            var srs = Oskari.getSandbox().getMap().getSrsName();
            var matchingSystemAppsetup = Oskari.app.getSystemDefaultViews().find(function (appsetup) {
                return appsetup.srsName === srs;
            });
            if (!matchingSystemAppsetup) {
                return null;
            }
            return matchingSystemAppsetup.uuid;
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
                            if (gfiReqBuilder) {
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
                            if (gfiReqBuilder) {
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
                            if (gfiReqBuilder) {
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
                            if (gfiReqBuilder) {
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
                            if (me.dialog) {
                                me.dialog.close(true);
                                me.dialog = null;
                                return;
                            }
                            me._createMapLinkPopup();
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
        _createMapLinkPopup: function () {
            var sandbox = Oskari.getSandbox();
            var loc = this.getLocalization('buttons');
            var mapUrlPrefix = this.__getMapUrl();
            var linkParams = sandbox.generateMapLinkParameters({});
            var viewUuid = this._getLinkUuid();
            var addMarkerBln = false;
            var skipInfoBln = true;
            var content = jQuery('<div class=link-wrapper></div>');
            var linkContent = jQuery('<div class="link-content"></div>');
            var options = jQuery('<div class="link-options"></div>');
            var url;

            this.dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            this.dialog.addClass('oskari-maplink');
            this.dialog.makeModal();
            sandbox.postRequestByName('DisableMapKeyboardMovementRequest');
            var closeBtn = this.dialog.createCloseButton();
            this.dialog.onClose(() => {
                sandbox.postRequestByName('EnableMapKeyboardMovementRequest');
                this.dialog = null;
            });
            if (!viewUuid) {
                this.dialog.show(loc.link.title, loc.link.cannot, [closeBtn]);
                return;
            }

            var baseUrl = mapUrlPrefix + linkParams + '&uuid=' + viewUuid;

            content.append(linkContent);
            // checkbox
            var addMarker = Oskari.clazz.create('Oskari.userinterface.component.CheckboxInput');
            addMarker.setTitle(loc.link.addMarker);
            addMarker.setChecked(addMarkerBln);
            addMarker.setHandler(checked => {
                addMarkerBln = checked;
                url = this._updateUrl(baseUrl, addMarkerBln, skipInfoBln);
                linkContent.text(url);
            });
            options.append(addMarker.getElement());
            var skipInfo = Oskari.clazz.create('Oskari.userinterface.component.CheckboxInput');
            skipInfo.setTitle(loc.link.skipInfo);
            skipInfo.setChecked(skipInfoBln);
            skipInfo.setHandler(checked => {
                skipInfoBln = checked;
                url = this._updateUrl(baseUrl, addMarkerBln, skipInfoBln);
                linkContent.text(url);
            });
            options.append(skipInfo.getElement());
            content.append(options);
            // buttons
            closeBtn.addClass('primary');
            var copyBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');
            copyBtn.setTitle(loc.link.copy);
            copyBtn.setHandler(() => {
                this.copyTextToClipboard(url);
            });
            url = this._updateUrl(baseUrl, addMarkerBln, skipInfoBln);
            linkContent.text(url);
            this.dialog.show(loc.link.title, content, [copyBtn, closeBtn]);
        },
        _updateUrl: function (baseUrl, addMarker, skipInfo) {
            var url = baseUrl;
            if (addMarker) {
                url += '&showMarker=true';
            }
            if (skipInfo) {
                url += '&showIntro=false';
            }
            return url;
        },
        copyTextToClipboard: function (text) {
            if (typeof text !== 'string') {
                return;
            }
            var input = document.createElement('input');
            document.body.appendChild(input);
            input.value = text;
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
        },
        /**
         * Returns the map url for link tool
         * @private
         * @return {String} base URL for state parameters
         */
        __getMapUrl: function () {
            var sandbox = this.getSandbox();
            var url = null;
            if (this.conf) {
                url = Oskari.getLocalized(this.conf.mapUrlPrefix);
            }

            // setup current url as base if none configured
            return sandbox.createURL(url || window.location.pathname, true);
        }

    }
);
