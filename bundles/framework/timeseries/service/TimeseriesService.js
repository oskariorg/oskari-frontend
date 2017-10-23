/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesService
 *
 * Keeps track of timeseries animation implementations & priorities.
 */
Oskari.clazz.define(
    'Oskari.mapframework.bundle.timeseries.TimeseriesService',

    /**
     * @method create called automatically on construction
     * @static
     *
     * @param {Oskari.Sandbox} sandbox
     *          reference to application sandbox
     */

    function () {
        this._timeseriesThings = {};
        this._updateScheduled = false;
        this._oldActive = null;
        Oskari.makeObservable(this);
    }, {
        /** @static @property __qname fully qualified name for service */
        __qname: "Oskari.mapframework.bundle.timeseries.TimeseriesService",
        /**
         * @method getQName
         * @return {String} fully qualified name for service
         */
        getQName: function () {
            return this.__qname;
        },
        /** @static @property __name service name */
        __name: "TimeseriesService",
        /**
         * @method getName
         * @return {String} service name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method _scheduleUpdate
         * @private
         * Schedule update on next tick (in order to do only one update after repeated changes) 
         */
        _scheduleUpdate: function () {
            var me = this;
            if (this._updateScheduled) {
                return;
            }
            me._updateScheduled = true;
            setTimeout(function () {
                me._updateScheduled = false;
                var active = me.getActiveTimeseries();
                if (me._oldActive !== active) {
                    me._oldActive = active;
                    me.trigger('activeChanged', active);
                }
            }, 0);
        },
        /**
         * @method _key
         * @private
         * Construct key
         * @param {String} id id timeseries
         * @param {String} type type of timeseries
         * @return {String} the key
         */
        _key: function (id, type) {
            return type + '-' + id;
        },
        /**
         * @method registerTimeseries
         * Register new timeseries enabled thing that should get control UI
         * @param {String} id id of timeseries. Should be unique within "type"
         * @param {String} type type of timeseries, could e.g. be bundle name
         * @param {Number} priority priority of thing. Lowest non-layer thing will be get UI shown
         * @param {Oskari.mapframework.bundle.timeseries.TimeseriesDelegateProtocol} delegate object that connects control UI to timeseries implementation
         * @param {Object} conf configuration given to TimeseriesControlPlugin
         */
        registerTimeseries: function (id, type, priority, delegate, conf) {
            conf = conf || {};
            if (!id || !type || typeof priority !== 'number' || !delegate) {
                throw new Error('All arguments must be given!');
            }
            var key = this._key(id, type);
            this._timeseriesThings[key] = {
                id: id,
                type: type,
                priority: priority,
                delegate: delegate,
                conf: conf
            }
            this._scheduleUpdate();
        },
        /**
         * @method unregisterTimeseries
         * Remove timeseries enabled thing (to remove UI from view)
         * @param {String} id id of timeseries
         * @param {String} type type of timeseries
         */
        unregisterTimeseries: function (id, type) {
            if (!id || !type) {
                throw new Error('All arguments must be given!');
            }
            var key = this._key(id, type);
            var series = this._timeseriesThings[key];
            if (series) {
                delete this._timeseriesThings[key];
                this._scheduleUpdate();
            }
            return series;
        },
        /**
         * @method updateTimeseriesPriority
         * Change priority of already registered timeseries
         * @param {String} id id of target timeseries
         * @param {String} type type of target timeseries
         * @param {Number} priority new priority of target timeseries
         */
        updateTimeseriesPriority: function (id, type, priority) {
            var key = this._key(id, type);
            if (!this._timeseriesThings[key]) {
                throw new Error('No timeseries found for type "' + type + '", id "' + id + '"!');
            }
            this._timeseriesThings[key].priority = priority;
            this._scheduleUpdate();
        },
        /**
         * @method getTimeseries
         * Get previously registered timeseries
         * @param {String} id id of timeseries
         * @param {String} type type of timeseries
         * @return {Object/undefined} timeseries config or undefined
         */
        getTimeseries: function (id, type) {
            var key = this._key(id, type);
            var thing = this._timeseriesThings[key];
            return thing;
        },
        /**
         * @method getActiveTimeseries
         * Get timeseries that should have UI visible (has lowest priority)
         * @return {Object/undefined} timeseries config or undefined
         */
        getActiveTimeseries: function () {
            var me = this;
            var things = Object.keys(this._timeseriesThings).map(function (key) { return me._timeseriesThings[key] });
            var targets = things.filter(function (thing) {
                return thing.type !== 'layer';
            });
            if (!targets.length) {
                targets = things;
            }
            var minPriority = Number.POSITIVE_INFINITY;
            var out;
            targets.forEach(function (t) {
                if (t.priority < minPriority) {
                    minPriority = t.priority;
                    out = t;
                }
            });
            return out;
        },
        /**
         * @method getCountByType
         * Get number of registered timeseries of "type"
         * @param {String} type type of timeseries
         * @return {Number} count
         */
        getCountByType: function (type) {
            var me = this;
            return Object.keys(this._timeseriesThings).filter(function (key) {
                return me._timeseriesThings[key].type === type;
            }).length;
        }
    });
