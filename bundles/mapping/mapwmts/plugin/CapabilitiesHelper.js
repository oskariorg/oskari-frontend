// see https://github.com/openlayers/openlayers/blob/v6.6.1/src/ol/source/WMTS.js#L341-L588
// for how OL parses the JSON and what it expects to find in it
export const formatCapabilitiesForOpenLayers = ({
    tileMatrixSet, // server always just gives one for frontend (one matching the map srs)
    id,
    name,
    formats,
    styles = [],
    resourceUrls = []
}) => {
    return {
        Contents: {
            Layer: [{
                Identifier: id || name,
                TileMatrixSetLink: [{
                    TileMatrixSet: tileMatrixSet.identifier
                }],
                Style: styles.map(s => {
                    return {
                        Identifier: s.name
                    };
                }),
                ResourceURL: resourceUrls.map(item => {
                    const { type, ...rest } = item;
                    return {
                        ...rest,
                        resourceType: type
                    };
                }),
                Format: formats
            }],
            TileMatrixSet: [{
                Identifier: tileMatrixSet.identifier,
                SupportedCRS: tileMatrixSet.projection,
                TileMatrix: Object.values(tileMatrixSet.matrixIds).map(item => {
                    return {
                        Identifier: item.identifier,
                        MatrixWidth: item.matrixWidth,
                        MatrixHeight: item.matrixHeight,
                        ScaleDenominator: item.scaleDenominator,
                        TopLeftCorner: [item.topLeftCorner.lon, item.topLeftCorner.lat],
                        TileWidth: item.tileWidth,
                        TileHeight: item.tileHeight
                    };
                })
            }]
        }
    };
};
