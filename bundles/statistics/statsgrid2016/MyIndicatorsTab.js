/**
 * @class Oskari.mapframework.bundle.statsgrid.MyIndicatorsTab
 * Renders the "personal data" statsgrid indicators tab.
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.MyIndicatorsTab',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.statistics.statsgrid.StatsGridBundleInstance}
     * instance
     *      reference to component that created the tile
     */
    function (instance) {
        this.instance = instance;
        this.template = jQuery('<div class="indicatorsList volatile"></div>');
        this.templateLink = jQuery('<a href="JavaScript:void(0);"></a>');
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.listContainer = undefined;
    }, {
        /**
         * @method getName
         * @return {String} name of the component
         * (needed because we fake to be module for listening to
         * events (getName and onEvent methods are needed for this))
         */
        getName: function () {
            return 'StatsGrid.MyIndicators';
        },
        getTitle: function () {
            return this.loc('tab.title');
        },
        getId: function () {
            return 'indicators';
        },
        getContent: function () {
            return this.listContainer;
        },
        initContent: function () {
            this.listContainer = this.template.clone();
            this._refreshIndicatorsList();
        },
        /**
         * @private @method _renderIndicatorsList
         * Renders given indicators list. Removes previous listing.
         *
         * @param {Object[]} indicators object array as returned by backend service
         *
         */
        _renderIndicatorsList: function (indicators) {
            if (!indicators) {
                indicators = [];
            }
            this.listContainer.empty();
            this.indicatorData = indicators;
            var model = this._getGridModel(indicators);
            var grid = this._getGrid(model);
            grid.renderTo(this.listContainer);
        },

        /**
         * @private @method _refreshIndicatorsList
         * Fetches indicators from backend and renders the response.
         * Shows an error message on failure
         */
        _refreshIndicatorsList: function () {
            var me = this,
                service = me.instance.getStatisticsService();
            this._renderIndicatorsList();
            /*
            service.loadIndicators('UserStats', function (isSuccess, response) {
                if (isSuccess) {
                    me._renderIndicatorsList(response.indicators);
                } else {
                    me._showErrorMessage(me.loc('tab.error.loadfailed'));
                }
            });
            */
        },

        /**
         * @private @method _getIndicatorById
         * Finds indicator object matching given id.
         * Shows an error message if no matches found.
         *
         * @param {Number} id indicator id
         *
         * @return {Object} matching indicator object or undefined if not found
         */
        _getIndicatorById: function (id) {
            var me = this,
                i;
            for (i = 0; i < me.indicatorData.length; i += 1) {
                if (me.indicatorData[i].id === id) {
                    // found what we were looking for
                    return me.indicatorData[i];
                }
            }
            // couldn't find indicator -> show an error
            me._showErrorMessage(me.loc('tab.error.generic'));
        },
        /**
         * Shows a confirmation dialog on deleting a indicator
         *
         * @method _confirmDelete
         * @param {Object} indicator data object for the indicator to delete
         * @private
         */
        _confirmDelete: function (indicator) {
            var me = this,
                dialog = Oskari.clazz.create(
                    'Oskari.userinterface.component.Popup'
                ),
                okBtn = Oskari.clazz.create(
                    'Oskari.userinterface.component.Button'
                ),
                sandbox = me.instance.sandbox;

            okBtn.setTitle(me.loc('tab.delete'));
            okBtn.addClass('primary');
            okBtn.setHandler(function () {
                me._deleteIndicator(indicator);
                dialog.close();
            });
            var cancelBtn = dialog.createCloseButton(me.loc('tab.button.cancel'));
            dialog.onClose(function () {
                me.popupOpen = false;
            });
            dialog.show(
                me.loc('tab.popup.deletetitle'),
                me.loc('tab.popup.deletemsg', {name: indicator.name}),
                [cancelBtn, okBtn]
            );
            me.popupOpen = true;
            dialog.makeModal();
        },

        /**
         * @private @method _deleteIndicator
         * Calls backend to delete the given indicator. Reloads the indicator listing on
         * success and shows an error message on fail
         *
         * @param {Object} indicator data object
         *
         */
        _deleteIndicator: function (indicator) {
            var me = this,
                service = me.instance.getViewService();
            service.deleteView(indicator, function (isSuccess) {
                if (isSuccess) {
                    me._refreshIndicatorsList();
                } else {
                    me._showErrorMessage(me.loc('tab.error.notdeleted'));
                }
            });
        },

        /**
         * @private @method _showErrorMessage
         * Shows an error dialog to the user with given message
         *
         * @param {String} msg message to show on popup
         *
         */
        _showErrorMessage: function (msg) {
            var dialog = Oskari.clazz.create(
                'Oskari.userinterface.component.Popup'
            );
            // delete failed
            var button = dialog.createCloseButton(this.loc('tab.button.ok'));
            button.addClass('primary');
            dialog.show(this.loc('tab.error.title'), msg, [button]);
        },

        /**
         * @private @method _getGridModel
         * Wraps backends indicators object data array to
         * Oskari.userinterface.component.GridModel
         *
         * @param {Object[]} indicators
         * Array of indicator data objects as returned by backend
         *
         * @return {Oskari.userinterface.component.GridModel}
         */
        _getGridModel: function (indicators) {
            var gridModel = Oskari.clazz.create(
                    'Oskari.userinterface.component.GridModel'
                ),
                i,
                indicator,
                data;
            gridModel.setIdField('id');
            for (i = 0; i < indicators.length; i += 1) {
                indicator = indicators[i];
                data = {
                    'id': indicator.id,
                    'name': Oskari.util.sanitize(indicator.name),
                    'edit': this.loc('tabs.indicator.edit'),
                    'delete': this.loc('tab.delete')
                };
                gridModel.addData(data);
            }
            return gridModel;
        },
        /**
         * @private @method _getGrid
         * Creates Oskari.userinterface.component.Grid and populates it with
         * given model
         *
         * @param {Oskari.userinterface.component.GridModel}
         * Model to populate the grid with
         *
         * @return {Oskari.userinterface.component.Grid}
         */
        _getGrid: function (model) {
            var me = this,
                instance = this.instance,
                sandbox = instance.getSandbox(),
                visibleFields = [
                    'name',
                    'edit',
                    'delete'
                ],
                grid = Oskari.clazz.create(
                    'Oskari.userinterface.component.Grid'
                );
            grid.setDataModel(model);
            grid.setVisibleFields(visibleFields);

            // set up the link from name field
            var nameRenderer = function (name, data) {
                var url = sandbox.createURL(data.url);
                if (!url) {
                    // no url, no link just plain text
                    return name;
                }
                // create link
                var link = me.templateLink.clone();
                link.text(name);
                link.bind('click', function () {
                    if (!me.popupOpen) {
                        // TODO show statslayer?
                        return false;
                    }
                });
                return link;
            };
            grid.setColumnValueRenderer('name', nameRenderer);

            var editRenderer = function (name, data) {
                var link = me.templateLink.clone();
                link.text(name);
                link.bind('click', function () {
                    if (!me.popupOpen) {
                        //TODO open edit flyout
                        return false;
                    }
                });
                return link;
            };
            grid.setColumnValueRenderer('edit', editRenderer);

            // set up the link from delete field
            var deleteRenderer = function (name, data) {
                var link = me.templateLink.clone();
                link.text(name);
                link.bind('click', function () {
                    var indicator = me._getIndicatorById(data.id);
                    if (indicator && !me.popupOpen) {
                        me._confirmDelete(indicator);
                    }
                    return false;
                });
                return link;
            };
            grid.setColumnValueRenderer('delete', deleteRenderer);

            // setup localization
            var i,
                key,
                path,
                coluiname;

            for (i = 0; i < visibleFields.length; ++i) {
                key = visibleFields[i];
                path = 'tab.grid.' + key;
                coluiname = this.loc(path);
                grid.setColumnUIName(key, coluiname || path);
            }

            return grid;
        },

        /**
         * @method bindEvents
         * Register tab as eventlistener
         */
        bindEvents: function () {
            var instance = this.instance,
                sandbox = instance.getSandbox(),
                p;
            // faking to be module with getName/onEvent methods
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.registerForEventByName(this, p);
                }
            }
        },

        /**
         * @method unbindEvents
         * Unregister tab as eventlistener
         */
        unbindEvents: function () {
            var instance = this.instance,
                sandbox = instance.getSandbox(),
                p;
            // faking to be module with getName/onEvent methods
            for (p in this.eventHandlers) {
                if (this.eventHandlers.hasOwnProperty(p)) {
                    sandbox.unregisterFromEventByName(this, p);
                }
            }
        },

        /**
         * @static @property {Object} eventHandlers
         */
        eventHandlers: {
            /**
             * @method StatsGrid.IndicatorEvent
             */
            'StatsGrid.IndicatorEvent': function (event) {
                this._refreshIndicatorsList();
            }
        },

        /**
         * @method onEvent
         *
         * @param {Oskari.mapframework.event.Event} event a Oskari event object
         * Event is handled forwarded to correct #eventHandlers if found or
         * discarded if not.
         *
         */
        onEvent: function (event) {
            var handler = this.eventHandlers[event.getName()];
            if (!handler) {
                return;
            }

            return handler.apply(this, [event]);
        }
    });
