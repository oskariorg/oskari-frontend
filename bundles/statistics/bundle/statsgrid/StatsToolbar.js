/**
 * @class Oskari.statistics.bundle.statsgrid.StatsToolbar
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.StatsToolbar',
    /**
     * @static constructor function
     * @param {Object} localization
     * @param {Oskari.statistics.bundle.statsgrid.StatsGridBundleInstance} instance
     */

    function (localization, instance) {
        this.toolbarId = 'statsgrid';
        this.instance = instance;
        this.localization = localization;
        this._createUI();
    }, {
        show: function (isShown) {
            var showHide = isShown ? 'show' : 'hide';
            var sandbox = this.instance.getSandbox();
            sandbox.requestByName(this.instance, 'Toolbar.ToolbarRequest', [this.toolbarId, showHide]);
        },
        destroy: function () {
            var sandbox = this.instance.getSandbox();
            sandbox.requestByName(this.instance, 'Toolbar.ToolbarRequest', [this.toolbarId, 'remove']);
        },
        changeName: function (title) {
            var sandbox = this.instance.getSandbox();
            sandbox.requestByName(this.instance, 'Toolbar.ToolbarRequest', [this.toolbarId, 'changeName', title]);
        },
        /**
         * @method _createUI
         * sample toolbar for statistics functionality
         */
        _createUI: function () {

            var view = this.instance.plugins['Oskari.userinterface.View'];
            var me = this;
            var sandbox = this.instance.getSandbox();
            sandbox.requestByName(this.instance, 'Toolbar.ToolbarRequest', [this.toolbarId, 'add', {
                title: me.localization.title,
                show: false,
                closeBoxCallback: function () {
                    view.prepareMode(false);
                }
            }]);

            var buttonGroup = 'statsgrid-tools';
            var buttons = {
                'selectAreas': {
                    toolbarid: me.toolbarId,
                    iconCls: 'selection-square',
                    tooltip: this.instance._localization.showSelected,
                    sticky: false,
                    toggleSelection: true,
                    callback: function () {

                        var statsgrid = view.instance.gridPlugin;
                        var mode = statsgrid.toggleSelectMunicipalitiesMode(),
                            eventBuilder,
                            evt;
                        // if mode is on, unselect all unhilighted areas and notify other plugins
                        if (mode) {
                            // unselect all areas except hilighted
                            statsgrid.unselectAllAreas(true);

                            // tell statsLayerPlugin to hilight all areas which are selected by clicking
                            eventBuilder = me.instance.getSandbox().getEventBuilder('StatsGrid.SelectHilightsModeEvent');
                            if (eventBuilder) {
                                evt = eventBuilder(statsgrid.selectedMunicipalities);
                                me.instance.getSandbox().notifyAll(evt);
                            }
                            //otherwise, clear hilights
                        } else {
                            statsgrid.grid.scrollRowToTop(0);
                            eventBuilder = me.instance.getSandbox().getEventBuilder('StatsGrid.ClearHilightsEvent');
                            if (eventBuilder) {
                                evt = eventBuilder(me.isVisible);
                                me.instance.getSandbox().notifyAll(evt);
                            }
                        }
                    }
                }
            };

            var requester = this.instance;
            var reqBuilder = sandbox.getRequestBuilder('Toolbar.AddToolButtonRequest'),
                tool;

            for (tool in buttons) {
                if (buttons.hasOwnProperty(tool)) {
                    sandbox.request(requester, reqBuilder(tool, buttonGroup, buttons[tool]));
                }
            }


        }
    });