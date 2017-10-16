/**
 * Adds a sequence counter to Oskari
 * Oskari.seq.nextVal(<type>)
 * @param  {String} type optional type
 * @return {Integer} next available sequence number for the type
 */
(function (o) {
    var serials = {};
    var count = 0;
    o.seq = {
        nextVal: function (type) {
            if (!type) {
                return count++;
            }
            if (!serials[type]) {
                serials[type] = 1;
            } else {
                serials[type] += 1;
            }
            return serials[type];
        }
    };
}(Oskari));
