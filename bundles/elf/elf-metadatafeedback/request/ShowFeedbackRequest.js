/**
 * @class Oskari.catalogue.bundle.metadatafeedback.request.ShowFeedbackRequest
 *
 *
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadatafeedback.request.ShowFeedbackRequest',

    /* constructor */
    function (metadata) {
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
         * @method getRating
         * @return {Number} feedback rating value
         */
        getRating: function () {
            return this._metadata.rating;
        },
        /**
         * @method getMetadataId
         * @return {Number} id of the metadata
         */
        getMetadataId: function () {
            return this._metadata.id;
        },
        getMetadata: function() {
            return this._metadata;
        }
    }, {
        protocol: ['Oskari.mapframework.request.Request']
    });
