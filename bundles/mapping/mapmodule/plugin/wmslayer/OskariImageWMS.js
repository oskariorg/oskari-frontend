import olSourceImageWMS from 'ol/source/ImageWMS';

export default class OskariImageWMS extends olSourceImageWMS {
    /**
     * Return currently shown image url
     */
    getImageUrl() {
        return this.image_.src_;
    }
}