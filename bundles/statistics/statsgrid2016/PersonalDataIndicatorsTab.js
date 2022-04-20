import React from 'react';
import ReactDOM from 'react-dom';
import { MyIndicatorsList } from './MyIndicatorsList';

/**
 * @class Oskari.mapframework.bundle.statsgrid.PersonalDataIndicatorsTab
 * Renders the "personal data" statsgrid indicators tab.
 */
Oskari.clazz.define('Oskari.statistics.statsgrid.PersonalDataIndicatorsTab',
    /**
     * @method create called automatically on construction
     * @static
     * @param {Oskari.statistics.statsgrid.StatsGridBundleInstance}
     * instance reference to component that created the tile
     */
    function (instance) {
        this.instance = instance;
        this.template = jQuery('<div class="indicatorsPanel"><div class="indicatorsList volatile"></div></div>');
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.log = Oskari.log('Oskari.statistics.statsgrid.PersonalDataIndicatorsTab');
        this.service = Oskari.getSandbox().getService('Oskari.statistics.statsgrid.StatisticsService');
        this.userDsId = this.service.getUserDatasource().id;
        this.content = undefined;
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
            return this.content;
        },
        _initContent: function () {
            this.content = this.template.clone();
            this.listContainer = this.content.find('.indicatorsList');
            this._refreshIndicatorsList();
        },
        /**
         * @private @method _renderIndicatorsList
         * Renders given indicators list. Removes previous listing.
         *
         * @param {Object[]} indicators object array as returned by backend service
         */
        _renderIndicatorsList: function (indicators) {
            if (!indicators) {
                indicators = [];
            }
            this.indicatorData = indicators;

            ReactDOM.render(
                <MyIndicatorsList
                    data={indicators}
                    controller={{
                        deleteIndicator: (item) => this.deleteIndicator(item),
                        editIndicator: (item) => this.editIndicator(item),
                        addNewIndicator: () => this.addNewIndicator()
                    }}
                />
                ,
                this.listContainer[0]
            );
        },

        /**
         * @private @method _refreshIndicatorsList
         * Fetches indicators from backend and renders the response.
         */
        _refreshIndicatorsList: function () {
            var me = this;
            me.service.getIndicatorList(me.userDsId, function (err, response) {
                if (err) {
                    me.log.warn('Could not list own indicators in personal data tab');
                } else if (response && response.complete) {
                    me._renderIndicatorsList(response.indicators);
                }
            });
        },

        /**
         * @private @method _getIndicatorById
         * Finds indicator object matching given id.
         * Shows an error message if no matches found.
         *
         * @param {Number} id indicator id
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
            this._showErrorMessage(this.loc('tab.error.notfound'));
        },
        /**
         * @method deleteIndicator
         * Calls backend to delete the given indicator. Reloads the indicator listing on
         * success and shows an error message on fail
         *
         * @param {Object} indicator data object
         */
        deleteIndicator: function (indicator) {
            var me = this;
            if (me._getIndicatorById(indicator.id)) {
                this.service.deleteIndicator(me.userDsId, indicator.id, null, null, function (err, response) {
                    if (err) {
                        me._showErrorMessage(me.loc('tab.error.notdeleted'));
                    } else {
                        var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
                        dialog.show(me.loc('tab.popup.deletetitle'), me.loc('tab.popup.deleteSuccess'));
                        dialog.fadeout();
                        // Delete fires StatsGrid.DatasourceEvent -> indicator list will be refreshed if delete is successful.
                    }
                });
            }
        },
        addNewIndicator: function () {
            const me = this;
            const formFlyout = me.instance.getFlyoutManager().getFlyout('indicatorForm');
            formFlyout.showForm(me.userDsId);
        },
        editIndicator: function (data) {
            const me = this;
            const formFlyout = me.instance.getFlyoutManager().getFlyout('indicatorForm');
            formFlyout.showForm(me.userDsId, data.id);
        },
        /**
         * @private @method _showErrorMessage
         * Shows an error dialog to the user with given message
         *
         * @param {String} msg message to show on popup
         */
        _showErrorMessage: function (msg) {
            var dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            var button = dialog.createCloseButton(this.loc('tab.button.ok'));
            button.addClass('primary');
            dialog.show(this.loc('tab.error.title'), msg, [button]);
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
             * @method StatsGrid.DatasourceEvent
             */
            'StatsGrid.DatasourceEvent': function (event) {
                if (event.getDatasource() === this.userDsId) {
                    this._refreshIndicatorsList();
                }
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
