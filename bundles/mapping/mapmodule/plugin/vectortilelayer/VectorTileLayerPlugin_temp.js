
import olSourceVectorTile from 'ol/source/VectorTile';
import olLayerVectorTile from 'ol/layer/VectorTile';
import olFormatMVT from 'ol/format/MVT';
import TileGrid from 'ol/tilegrid/TileGrid';


setTimeout(() => {
    const gridOpts = {
        origin: [-548576, 8388608],
        resolutions: [8192, 4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25],
        tileSize: [256, 256]
    }

    const buildings = new olLayerVectorTile({
        opacity: 0.7,
        maxResolution: 8,
        renderMode: 'hybrid',
        source: new olSourceVectorTile({
            tileGrid: new TileGrid(gridOpts),
            format: new olFormatMVT(),
            url: 'https://beta-karttakuva.maanmittauslaitos.fi/vectortiles/wmts/1.0.0/buildings/default/EPSG:3067/{z}/{y}/{x}.pbf'
        })
    });

    Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule').getMap().addLayer(buildings);
}, 5000);