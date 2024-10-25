/**
 * @class Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequest
 *
 * A Class that may be used as a request to show metadata for the given
 * metadata uuid or layerId
 *
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadata.request.ShowMetadataRequest',

    /* constructor */
    function (data) {
        this._data = data || {};
    }, {
        __name: 'catalogue.ShowMetadataRequest',

        getName: function () {
            return this.__name;
        },

        getLayerId: function () {
            return this._data.layerId;
        },

        getUuid: function () {
            return this._data.uuid;
        },

        getData: function () {
            return this._data;
        }
    }, {
        protocol: ['Oskari.mapframework.request.Request']
    });
