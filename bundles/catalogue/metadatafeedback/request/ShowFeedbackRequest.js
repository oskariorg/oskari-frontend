/**
 * @class Oskari.catalogue.bundle.metadatafeedback.request.ShowFeedbackRequest
 *
 *
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadatafeedback.request.ShowFeedbackRequest',

    /* constructor */
    function (score, metadataId) {
        this._score = score;
        this._metadataId = metadataId;
    }, {
        __name: 'catalogue.ShowFeedbackRequest',
        /**
         * @method getName
         * @return {String} request name
         */
        getName: function () {
            return this.__name;
        },
        /**
         * @method getScore
         * @return {Number} feedback score value
         */
        getScore: function () {
            return this._score;
        },
        /**
         * @method getScore
         * @return {Number} feedback score value
         */
        getMetadataId: function () {
            return this._metadataId;
        }
    }, {
        protocol: ['Oskari.mapframework.request.Request']
    });
