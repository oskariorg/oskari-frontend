Oskari.clazz.define("Oskari.mapframework.bundle.mapwfs2.plugin.TileCache",
    function () {
        this.data = {};
        this.ts = {};
    }, {
        mget: function (layerId, style, bbox) {
            var dataByLayerId = this.data[layerId];
            if (!dataByLayerId) {
                return;
            }

            var dataByStyle = dataByLayerId[style];
            if (!dataByStyle) {
                return;
            }

            return dataByStyle[bbox];
        },

        mput: function (layerId, style, bbox, data) {
            var dataByLayerId = this.data[layerId];
            if (!dataByLayerId) {
                dataByLayerId = {};
                this.data[layerId] = dataByLayerId;
            }

            var dataByStyle = dataByLayerId[style];
            if (!dataByStyle) {
                dataByStyle = {};
                dataByLayerId[style] = dataByStyle;
            }
            dataByStyle[bbox] = data;

            var tsByLayerId = this.ts[layerId];
            if (!tsByLayerId) {
                tsByLayerId = {};
                this.ts[layerId] = tsByLayerId;
            }

            var tsByStyle = tsByLayerId[style];
            if (!tsByStyle) {
                tsByStyle = {};
                tsByLayerId[style] = tsByStyle;
            }
            tsByStyle[bbox] = new Date().getTime();
        },

        mdel: function (layerId, style, bbox) {
            var dataByLayerId = this.data[layerId];
            if (!dataByLayerId) {
                return;
            }
            if(style === undefined) {
                this.data[layerId] = null;
                delete this.data[layerId];
            }
            var dataByStyle = dataByLayerId[style];
            if (!dataByStyle) {
                return;
            }

            if (bbox === null || bbox === undefined) {
                dataByStyle = undefined;
                delete dataByLayerId[style];
                return;
            }

            var dataByBbox = dataByStyle[bbox];
            if (!dataByBbox) {
                return;
            }

            dataByBbox = undefined;
            delete dataByStyle[bbox];
        },

        purgeOffset: function (offset) {
            var ref = new Date().getTime() - offset;
            for (var layerId in this.data) {
                for (var style in this.data[layerId]) {
                    for (var bbox in this.data[layerId][style]) {
                        if (this.ts[layerId][style][bbox] < ref) {
                            delete this.data[layerId][style][bbox];
                            delete this.ts[layerId][style][bbox];
                        }
                    }
                }
            }
        }
    });
