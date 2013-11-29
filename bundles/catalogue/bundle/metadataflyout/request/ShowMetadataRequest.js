/**
 * @class Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequest
 *
 * A Class that may be used as a request to show metadata for the given
 * metadata uuid or RS_Identifier Code / RS_Identifier CodeSpace
 *
 * additionalMetadata is used to show some related metadata in addition to the main metadata
 *
 */
Oskari.clazz.define('Oskari.catalogue.bundle.metadataflyout.request.ShowMetadataRequest',

    /* constructor */

    function (config, additionalMetadata) {
        this._creator = null;

        this._uuid = config.uuid;
        this._RS_Identifier_Code = config.RS_Identifier_Code;
        this._RS_Identifier_CodeSpace = config.RS_Identifier_CodeSpace;
        this._additionalMetadata = additionalMetadata;

        this._allMetadata = [];
        this._allMetadata.push(config);
        if (additionalMetadata) {
            this._additionalMetadata = additionalMetadata;
            var n;
            for (n = 0; n < additionalMetadata.length; n++) {
                this._allMetadata.push(additionalMetadata[n]);
            }
        }
    }, {
        __name: "catalogue.ShowMetadataRequest",
        getName: function () {
            return this.__name;
        },
        getUuid: function () {
            return this._uuid;
        },
        getRS_Identifier_Code: function () {
            return this._RS_Identifier_Code;
        },
        getRS_Identifier_CodeSpace: function () {
            return this._RS_Identifier_CodeSpace;
        },
        getAdditionalMetadata: function () {
            return this._additionalMetadata;
        },
        getAllMetadata: function () {
            return this._allMetadata;
        }
    }, {
        'protocol': ['Oskari.mapframework.request.Request']
    });

/* Inheritance */