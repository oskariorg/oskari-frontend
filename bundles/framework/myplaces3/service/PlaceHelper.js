export const createPlace = (feature, mapmodule) => {
    const place = Oskari.clazz.create('Oskari.mapframework.bundle.myplaces3.model.MyPlace');
    const { properties, geometry, id } = feature;
    place.setId(id);
    place.setUuid(properties.uuid);
    place.setName(Oskari.util.sanitize(properties.name));
    place.setDescription(properties.place_desc);
    place.setAttentionText(Oskari.util.sanitize(properties.attention_text));
    place.setLink(Oskari.util.sanitize(properties.link));
    place.setImageLink(Oskari.util.sanitize(properties.image_url));
    place.setCategoryId(properties.category_id);
    place.setCreateDate(properties.created);
    place.setUpdateDate(properties.updated);
    place.setGeometry(geometry);
    place.setDrawMode(getDrawModeFromGeometry(geometry));
    place.setMeasurement(mapmodule.getMeasurementResult(geometry, true));
    return place;
};

export const createFeature = (place) => {
    return {
        id: place.getId(),
        type: place.getType(),
        geometry: place.getGeometry(),
        category_id: place.getCategoryId(),
        properties: {
            name: place.getName(),
            place_desc: place.getDescription(),
            attention_text: place.getAttentionText(),
            link: place.getLink(),
            image_url: place.getImageLink()
        }
    };
};

const getDrawModeFromGeometry = (geometry) => {
    if (geometry === null) {
        return null;
    }
    const type = geometry.type;
    if (type === 'MultiPoint' || type === 'Point') {
        return 'point';
    } else if (type === 'MultiLineString' || type === 'LineString') {
        return 'line';
    } else if (type === 'MultiPolygon' || type === 'Polygon') {
        return 'area';
    }
    return null;
}