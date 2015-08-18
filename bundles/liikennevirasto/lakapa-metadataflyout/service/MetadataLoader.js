/**
 * @class Oskari.catalogue.bundle.metadataflyout.service.MetadataLoader
 *
 * Class to load metadata content from backend
 *
 */
Oskari.clazz.define("Oskari.catalogue.bundle.metadataflyout.service.MetadataLoader", function (urls, sandbox) {
    this.urls = urls;
    this.sandbox = sandbox;
    this.dev = false;
    this.timer = null;
}, {

    /**
     * @method getURLForView
     *
     * builds backend URL URI or whatever it's called n
     */
    getURLForView: function (subsetId, uuid, RS_Identifier_Code, RS_Identifier_CodeSpace, cb, dataType) {
        var url = this.urls[subsetId],
            uri = url + "uuid=" + uuid;

        /*dev only */
        if (this.dev) {
            var devuri = {
                'abstract': 'abstract',
                'jhs': 'jhs158',
                'inspire': 'inspire',
                'json': 'json'
            }[subsetId];

            if (devuri !== null && devuri !== undefined) {
                uri = devuri;
            }

        }

        return uri;
    },
    /**
     * @method loadMetadata
     *
     * loads metadata from backend
     *
     */
    loadMetadata: function (subsetId, uuid, RS_Identifier_Code, RS_Identifier_CodeSpace, cb, dataType) {
        var me = this;
        var uri = this.getURLForView(subsetId, uuid, RS_Identifier_Code, RS_Identifier_CodeSpace);

        var ajaxUrl = me.sandbox.getAjaxUrl() +'action_route=GetMetadata';

        me.sandbox.printDebug("loadMetadata " + uri);

        if (uri === null || uri === undefined) {
            return;
        }

        jQuery.ajax({
            url: ajaxUrl,
            type : 'POST',
            data : {
                dataType : dataType || 'xml',
                lang: Oskari.getLang(),
                uri: uri,
                uuid: uuid
            },
            dataType: dataType || 'xml',
            beforeSend: function (x) {
                if (x && x.overrideMimeType) {
                    if (dataType && dataType === 'json') {
                        x.overrideMimeType("application/json");
                    } else {
                        x.overrideMimeType("text/html");
                    }
                }
            },
            success: function (data, textStatus) {
                cb(data, true);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                cb(null, false);

            }
        });

    },
    /**
     * Helper to circumvent jQuery ajax html hassles
     */
    loadGeonetworkAjaxHTML: function (handler, viewId, metadata_uuid, metadata_RS_Identifier_Code, metadata_RS_Identifier_CodeSpace) {
        var me = this;

        var uri = this.getURLForView(viewId, metadata_uuid, metadata_RS_Identifier_Code, metadata_RS_Identifier_CodeSpace);

        var ajaxUrl = me.sandbox.getAjaxUrl() +'action_route=GetMetadata';

        if (uri === null || uri === undefined) {
            return;
        }


        var dataType = 'json';
        clearTimeout(me.timer);
        me.timer = setTimeout(
                function(){
                    jQuery.ajax({
                        url: ajaxUrl,
                        type : 'POST',
                        data : {
                            dataType : dataType || 'xml',
                            lang: Oskari.getLang(),
                            uri: uri,
                            uuid: metadata_uuid
                        },
                        dataType: dataType || 'xml',
                        beforeSend: function (x) {
                            if (x && x.overrideMimeType) {
                                if (dataType && dataType === 'json') {
                                    x.overrideMimeType("application/json");
                                } else {
                                    x.overrideMimeType("text/html");
                                }
                            }
                        },
                        success: function (data, textStatus) {
                            handler(data);
                        },
                        error: function (jqXHR, textStatus, errorThrown) {
                            handler();
                        }
                    });
                }, 500);
    },
    /**
     * @method openMetadata
     *
     * opens metadata from backend to new window
     *
     */
    openMetadata: function (subsetId, uuid, RS_Identifier_Code, RS_Identifier_CodeSpace, cb, dataType, target) {
        var uri = this.getURLForView(subsetId, uuid, RS_Identifier_Code, RS_Identifier_CodeSpace);

        this.sandbox.printDebug("openMetadata " + uri);

        var win = window.open(uri, target, "resizable=yes,scrollbars=yes,status=yes");

    }
});
