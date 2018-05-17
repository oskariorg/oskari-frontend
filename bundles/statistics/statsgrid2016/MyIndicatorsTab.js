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
        this.log = Oskari.log('Oskari.statistics.statsgrid.MyIndicatorsTab');
        this.listContainer = undefined;
        this._initContent();
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
        _initContent: function () {
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
                indicators = [{name: "Test indicator"}];
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
            var me = this;
            var service = me.instance.getStatisticsService();
            var datasources = service.getDatasource();
            var indicators = [];

            if (datasources) {
                datasources.forEach(function (ds) {
                //    if (ds.type === 'USER') {
                        service.getIndicatorList(ds.id, function (err, result) {
                            if (err) {
                                me.log.warn('Could not list own indicators for datasource with id: ' + ds.id);
                            } else if (result) {
                                indicators.push(result);
                            }
                        });
                //    }
                });
            }
            this._renderIndicatorsList(indicators);
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
            var matches = this.indicatorData.filter(function (indicator) {
                return indicator.id === id;
            });
            if (matches.length > 0) {
                return matches[0];
            }
            // couldn't find indicator -> show an error
            this._showErrorMessage(this.loc('tab.error.generic'));
        },
        /**
         * Shows a confirmation dialog on deleting a indicator
         *
         * @method _confirmDelete
         * @param {Object} indicator data object for the indicator to delete
         * @private
         */
        _confirmDelete: function (indicator) {
            var me = this;
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var okBtn = Oskari.clazz.create('Oskari.userinterface.component.Button');

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
            var me = this;
            var service = me.instance.getStatisticsService();
            service.deleteIndicator(indicator, function (isSuccess) {
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
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
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
            var me = this;
            var gridModel = Oskari.clazz.create('Oskari.userinterface.component.GridModel');
            gridModel.setIdField('id');
            indicators.forEach(function (indicator) {
                var data = {
                    'id': indicator.id,
                    'name': Oskari.util.sanitize(indicator.name),
                    'edit': me.loc('tab.edit'),
                    'delete': me.loc('tab.delete')
                };
                gridModel.addData(data);
            });
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
            var me = this;
            var visibleFields = [
                'name',
                'edit',
                'delete'
            ];
            var grid = Oskari.clazz.create('Oskari.userinterface.component.Grid');
            grid.setDataModel(model);
            grid.setVisibleFields(visibleFields);

            var editRenderer = function (name, data) {
                var link = me.templateLink.clone();
                link.text(name);
                link.bind('click', function () {
                    if (!me.popupOpen) {
                        // TODO open edit flyout
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
            visibleFields.forEach(function (field) {
                var path = 'tab.grid.' + field;
                var columnUIName = me.loc(path);
                grid.setColumnUIName(field, columnUIName || path);
            });
            return grid;
        },

        /**
         * @method bindEvents
         * Register tab as eventlistener
         */
        bindEvents: function () {
            var sandbox = this.instance.getSandbox();
            var p;
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
            var sandbox = this.instance.getSandbox();
            var p;
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
