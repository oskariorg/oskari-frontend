/**
 * Bunch of methods dealing with user's indicators.
 * Handles fetching, creating, updating and deleting indicators.
 *
 * @class Oskari.statistics.bundle.statsgrid.UserIndicatorsService
 */
Oskari.clazz.define('Oskari.statistics.bundle.statsgrid.UserIndicatorsService',

    /**
     * @method create called automatically on construction
     * @static
     *
     */
    function (instance) {
        this.instance = instance;
        this.sandbox = instance.sandbox;
        this.eventName = 'StatsGrid.UserIndicatorEvent';
    }, {
        __name: 'StatsGrid.UserIndicatorsService',
        __qname: 'Oskari.statistics.bundle.statsgrid.UserIndicatorsService',

        getQName: function () {
            return this.__qname;
        },

        getName: function () {
            return this.__name;
        },

        /**
         * @method init
         * Initializes the service
         */
        init: function () {},

        getUserIndicators: function (successCb, errorCb) {
            var url = this.sandbox.getAjaxUrl() + 'action_route=GetUserIndicators';
            this._get(url, successCb, errorCb);
        },

        getUserIndicator: function (indicatorId, successCb, errorCb) {
            var url = this.sandbox.getAjaxUrl() +
                'action_route=GetUserIndicators&id=' + indicatorId,
                normalizeIndicator = this._normalizeIndicator,
                successWrapper = function (indicator) {
                    successCb(normalizeIndicator(indicator));
                };
            this._get(url, successWrapper, errorCb);
        },

        saveUserIndicator: function (indicator, successCb, errorCb) {
            var me = this,
                url = this.sandbox.getAjaxUrl() + 'action_route=SaveUserIndicator',
                sandbox = this.sandbox,
                eventName = this.eventName,
                cbWrapper = function (response) {
                    var eventBuilder = sandbox.getEventBuilder(eventName);
                    if (eventBuilder) {
                        var event = eventBuilder('create', me._objectifyIndicator(indicator, response));
                        sandbox.notifyAll(event);
                    }
                    successCb(response);
                };

            this._post(url, indicator, cbWrapper, errorCb);
        },

        deleteUserIndicator: function (indicatorId, successCb, errorCb) {
            var url = this.sandbox.getAjaxUrl() + 'action_route=DeleteUserIndicator&id=' + indicatorId;
            this._get(url, successCb, errorCb);
        },

        _get: function (url, successCb, errorCb) {
            this._ajax("GET", url, successCb, errorCb);
        },

        _post: function (url, data, successCb, errorCb) {
            this._ajax("POST", url, successCb, errorCb, data);
        },

        _ajax: function (method, url, successCb, errorCb, data) {
            var params = {
                url: url,
                type: method,
                dataType: 'json',
                beforeSend: function (x) {
                    if (x && x.overrideMimeType) {
                        x.overrideMimeType('application/j-son;charset=UTF-8');
                    }
                },
                success: function (response) {
                    if (typeof successCb === 'function') {
                        successCb(response);
                    }
                },
                error: function (jqXHR, textStatus) {
                    if (typeof errorCb === 'function' && jqXHR.status !== 0) {
                        errorCb(jqXHR, textStatus);
                    }
                }
            };

            if (data) {
                params.data = data;
            }

            jQuery.ajax(params);
        },
        _objectifyIndicator: function (indicator, response) {
            var retIndicator = {
                id: response.id,
                title: JSON.parse(indicator.title),
                description: JSON.parse(indicator.description),
                organization: JSON.parse(indicator.source),
                year: indicator.year
            };

            return retIndicator;
        },
        /**
         * Normalizes the indicator to be used like a sotkanet indicator in statsplugin.
         *
         * @method _normalizeIndicator
         * @param  {Object} indicator
         * @return {Object}
         */
        _normalizeIndicator: function (indicator) {
            var retIndicator = _.clone(indicator, true);

            retIndicator.ownIndicator = true;
            retIndicator.gender = 'total';
            retIndicator.organization = {
                'title': retIndicator.organization
            };
            retIndicator.meta = {
                'title': retIndicator.title
            };

            return retIndicator;
        }
    }, {
        'protocol': ['Oskari.mapframework.service.Service']
    });
