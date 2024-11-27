import olSourceImageWMS from 'ol/source/ImageWMS';

export class OskariImageWMS extends olSourceImageWMS {
    /**
     * Return currently shown image url
     */
    getImageUrl () {
        // WMSLayerPlugin sets up the load function that injects this value to image on updateLayerParams()
        return this.image?._oskariGetMapUrl;
    }
}
