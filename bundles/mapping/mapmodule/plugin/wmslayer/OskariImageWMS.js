import olSourceImageWMS from 'ol/source/ImageWMS';

export class OskariImageWMS extends olSourceImageWMS {
    /**
     * Return currently shown image url
     */
    getImageUrl () {
        return this.image_.src_;
    }
}
