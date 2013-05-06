/**
 * @class Oskari.mapframework.gridcalc.TileQueue
 *
 * This is a class to manage a set of
 * Oskari.mapframework.gridcalc.QueuedTile objects
 */
Oskari.clazz.define("Oskari.mapframework.bundle.mapwfs2.domain.TileQueue",

/**
 * @method create called automatically on construction
 * @static
 */
function() {
    /** @property {Oskari.mapframework.gridcalc.QueuedTile[]} queue
     *  	tile queue
     */
    this.queue = [];
}, {

    /**
     * @method getQueue
     * Returns the queue
     *
     * @return {Array}
     *            array of Oskari.mapframework.gridcalc.QueuedTile objects
     */
    getQueue : function() {
        return this.queue;
    },
    /**
     * @method getLength
     * Returns the queue size
     *
     * @return {Number}
     *            queue size
     */
    getLength : function() {
        return this.queue.length;
    },
    /**
     * @method popJob
     * Pop a job from mid queue or from top if queue size is less than 4
     *
     * @return {Oskari.mapframework.gridcalc.QueuedTile/Object}
     *            popped tile
     */
    popJob : function() {
        var q = this.queue;
        var qLength = q.length;
        if(qLength === 0) {
            return null;
        }

        if(qLength < 4) {
            return q.shift(-1);
        }

        var tdef = null;
        var qIndex = Math.floor(qLength / 2);
        tdef = q[qIndex];
        this.queue = q.slice(0, qIndex).concat(q.slice(qIndex + 1));

        return tdef;
    },
    /**
     * @method pushJob
     * push a job as Oskari.mapframework.gridcalc.QueuedTile
     * or a json object to queue
     *
     * @param {Oskari.mapframework.gridcalc.QueuedTile/Object} obj
     *            tile to push into queue
     */
    pushJob : function(obj) {
        this.queue.push(obj);
    },
    /**
     * @method flushQueue
     * replace queue with an empty one
     */
    flushQueue : function() {
        this.queue = [];
    }
});
