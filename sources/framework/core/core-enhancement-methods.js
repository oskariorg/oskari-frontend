/**
 * @class Oskari.mapframework.core.Core.enhancementMethods
 *
 * This category class adds enhancement methods to Oskari core as they were in
 * the class itself.
 */
Oskari.clazz.category(
    'Oskari.mapframework.core.Core',
    'enhancement-methods',
    {
        /**
         * @method _doEnhancements
         * Runs all given enhancements (calls enhance method)
         *
         * @param {Oskari.mapframework.enhancement.Enhancement[]} enhancements array of enhancements to run
         * @private
         */
        _doEnhancements: function (enhancements) {
            var i;
            for (i = 0; i < enhancements.length; i++) {
                enhancements[i].enhance(this);
            }
        }
    }
);