const GEOM_TYPE_MAPPING = {
    'MultiPoint': 'MultiPoint',
    'gml:MultiPointPropertyType': 'MultiPoint',

    'Point': 'Point',
    'gml:PointPropertyType': 'Point',

    'MultiLineString': 'MultiLineString',
    'gml:MultiLineStringPropertyType': 'MultiLineString',

    'MultiPolygon': 'MultiPolygon',
    'gml:MultiPolygonPropertyType': 'MultiPolygon',
    'gml:MultiSurfacePropertyType': 'MultiPolygon',

    'Polygon': 'Polygon',
    'gml:PolygonPropertyType': 'Polygon',
    'gml:SurfacePropertyType': 'Polygon',

    'gml:GeometryPropertyType': 'GeometryPropertyType',

    'geometry': 'geometry'
};

const GEOM_TYPE_GEOMETRY = 'geometry';
export const FIELD_TYPE_DATE = 'date';
export const FIELD_TYPE_DATETIME = 'datetime';
export const FIELD_TYPE_NUMBER_INT = 'int';
export const FIELD_TYPE_NUMBER_LONG = 'long';
export const FIELD_TYPE_NUMBER_DOUBLE = 'double';
export const FIELD_TYPE_BOOLEAN = 'boolean';
export const FIELD_NAME_ID = 'id';

const detectGeometryType= (type) => GEOM_TYPE_MAPPING[type] || GEOM_TYPE_MAPPING['gml:' + type];

const describeLayer = (id) => {
    // TODO: change to use DescribeLayer on 2.11+
    return fetch(Oskari.urls.getRoute('DescribeLayer', { id: id }), {
    //return fetch(Oskari.urls.getRoute('GetWFSLayerFields', { layer_id: id }), {
        method: 'GET',
        headers: {
            Accept: 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Error getting layer details');
    }).then(json => {
        /*
        {
            "geometryName":"geom",
            "types":{
                "nimi":"string",
                "numero":"number",
                "id":"number",
                "teksti":"string"
            },
            "geometryType":"MultiPointPropertyType"
        }

        NOTE! decimal number fields are only just "number". This might cause a problem
        */
        const types = {};
        json.properties
            .filter(prop => prop.type !== GEOM_TYPE_GEOMETRY)
            .forEach((prop) => {
                const rawType = (prop.rawType || '').toLowerCase();
                const isDateTime = rawType.includes(FIELD_TYPE_DATETIME);
                const isDate = !isDateTime && rawType.endsWith(FIELD_TYPE_DATE);
                if (isDateTime) {
                    types[prop.name] = FIELD_TYPE_DATETIME;
                } else if (isDate) {
                    types[prop.name] = FIELD_TYPE_DATE;
                } else if (prop.type === 'number') {
                    types[prop.name] = rawType.includes(FIELD_TYPE_NUMBER_LONG) || rawType.includes(FIELD_TYPE_NUMBER_INT) ? FIELD_TYPE_NUMBER_INT : FIELD_TYPE_NUMBER_DOUBLE;
                } else if (prop.type === 'boolean') {
                    types[prop.name] = FIELD_TYPE_BOOLEAN;
                } else {
                    types[prop.name] = prop.type;
                }
            });

        return {
            types: types,
            geometryType: GEOM_TYPE_GEOMETRY
        };
    });
};

export const Helper = {
    detectGeometryType,
    describeLayer
};
