/**
 * @class Oskari.catalogue.bundle.metadatafeedback.request.ShowFeedbackRequest
 *
 *
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadatafeedback.request.ShowFeedbackRequest',

    /* constructor */
    function (score, metadataId, metadata) {
        this._score = score;
        this._metadataId = metadataId;
        this._metadata = metadata;
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
         * @method getMetadataId
         * @return {String} metadataid
         */
        getMetadataId: function () {
            return this._metadataId;
        },
        /**
         * @method getMetadata
         * @return {Object} metadata object
         */
        getMetadata: function () {
            return this._metadata;
        },

    }, {
        protocol: ['Oskari.mapframework.request.Request']
    });
