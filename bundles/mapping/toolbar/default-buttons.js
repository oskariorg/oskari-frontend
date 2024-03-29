import { showResetPopup } from '../mapmodule/MapResetPopup';
import { showMapLinkPopup } from './view/MapLinkPopup';

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
            if (pGroup === 'basictools' && pId === 'zoombox') {
                // except for zoombox on mobile
                return !Oskari.util.isMobile();
            }
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
                        callback: () => me._resetClicked()
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
                        sticky: true,
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
        _resetClicked: function () {
            if (this.resetPopup) return;
            const cb = () => {
                // statehandler reset state
                const rb = Oskari.requestBuilder(
                    'StateHandler.SetStateRequest'
                );
                if (rb) {
                    this.getSandbox().request(this, rb());
                }
            };
            this.resetPopup = showResetPopup(() => cb(), () => this.clearResetPopup());
        },
        clearResetPopup: function () {
            if (this.resetPopup) {
                this.resetPopup.close();
            }
            this.resetPopup = null;
        },
        clearLinkPopup: function () {
            if (this.linkPopup) {
                this.linkPopup.close();
            }
            const sandbox = Oskari.getSandbox();
            const builder = Oskari.requestBuilder('Toolbar.SelectToolButtonRequest');
            sandbox.request(this, builder());
            this.linkPopup = null;
        },
        _createMapLinkPopup: function () {
            if (this.linkPopup) return;

            const sandbox = Oskari.getSandbox();
            const mapUrlPrefix = this.__getMapUrl();
            const linkParams = sandbox.generateMapLinkParameters({});
            const viewUuid = this._getLinkUuid();

            let guidedTour = false;
            if (Oskari.bundle('guidedtour')) {
                guidedTour = true;
            }
            const baseUrl = mapUrlPrefix + linkParams + '&uuid=' + viewUuid + '&noSavedState=true';

            this.linkPopup = showMapLinkPopup(guidedTour, baseUrl, () => this.clearLinkPopup());
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
