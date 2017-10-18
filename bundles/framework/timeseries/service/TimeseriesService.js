/**
 * @class Oskari.mapframework.bundle.timeseries.TimeseriesService
 *
 * Keeps track of timeseries animation implementations & priorities
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
        _scheduleUpdate: function(){
            var me = this;
            if(this._updateScheduled) {
                return;
            }
            me._updateScheduled = true;
            setTimeout(function(){
                me._updateScheduled = false;
                var active = me.getActiveTimeseries();
                if(me._oldActive !== active) {
                    me._oldActive = active;
                    me.trigger('activeChanged', active);
                }
            }, 0);
        },
        _key: function(id, type) {
            return type + '-' + id;
        },
        registerTimeseries: function(id, type, priority, delegate, conf) {
            conf = conf || {};
            if(!id || !type || typeof priority !== 'number' || !delegate) {
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
        unregisterTimeseries: function(id, type) {
            if(!id || !type) {
                throw new Error('All arguments must be given!');
            }
            var key = this._key(id, type);
            delete this._timeseriesThings[key];
            this._scheduleUpdate();
        },
        updateTimeseriesPriority: function(id, type, priority) {
            var key = this._key(id, type);
            if(!this._timeseriesThings[key]) {
                throw new Error('No timeseries found for type "' + type + '", id "' + id + '"!');
            }
            this._timeseriesThings[key].priority = priority;
            this._scheduleUpdate();
        },
        getTimeseries: function(id, type) {
            var key = this._key(id, type);
            var thing = this._timeseriesThings[key];
            return thing;
        },
        getActiveTimeseries: function() {
            var me = this;
            var things = Object.keys(this._timeseriesThings).map(function(key){return me._timeseriesThings[key]});
            var targets = things.filter(function(thing) {
                return thing.type !== 'layer';
            });
            if(!targets.length) {
                targets = things;
            }
            var minPriority = Number.POSITIVE_INFINITY;
            var out = null;
            targets.forEach(function(t) {
                if(t.priority < minPriority) {
                    minPriority = t.priority;
                    out = t;
                }
            });
            return out;
        }
    });
