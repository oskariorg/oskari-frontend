import { MapLayerBase } from '../domain/MapLayerBase';

export const parseLayerListing = (json) => {
    const { groups = [], layers = [], providers = {} } = json;

    const response = {
        groups: parseGroups(groups),
        providers: parseProviders(providers)
    };
    response.groupsById = listToDictionary(flattenGroups(response.groups));
    response.providersById = listToDictionary(response.providers);
    response.layersById = parseLayers(layers, response.groupsById);
    return response;
};

const parseGroups = (groups = []) => {
    return groups.map(group => Oskari.clazz.create('Oskari.mapframework.domain.MaplayerGroup', group));
};

const parseProviders = (providers = {}) => {
    return Object.values(providers).map(json => {
        return {
            id: Number(json.id),
            name: json.name,
            desc: json.desc
        };
    });
};

const flattenGroups = (groupsStructure = [], flatGroups = []) => {
    groupsStructure.forEach((group) => {
        flatGroups.push(group);
        flattenGroups(group.getGroups(), flatGroups);
    });
    return flatGroups;
};

// list to object with id as key and list item as value
const listToDictionary = (list) => {
    return list.reduce((returnValue, current) => {
        return {
            ...returnValue,
            [current.getId()]: current
        };
    }, {});
};

const parseLayers = (layers = [], groupsById = {}) => {
    const layersById = {};
    layers.forEach(json => {
        const id = '' + json.id;
        if (!layersById[id]) {
            try {
                layersById[id] = parserRegister.parseLayerTypeJson(json);
            } catch (err) {
                Oskari.log('LayerParser').warn('Unable to parse layer from', json);
            }
        }
    });
    // layers are expected to have reference to groups they are in -> injecting groups to layer
    Object.values(groupsById).forEach(group => {
        group.getLayerIdList().forEach(id => {
            const layer = layersById['' + id];
            if (layer) {
                layer.addGroup(group.getId());
            }
        });
    });
    return layersById;
};

const parseLayerJson = ({ id, type, name, created, ...json }) => {
    /*
      "id": "4",
      "type": "wmslayer",
      "name": "NLS FI background map",
      "dataproviderId": 2,
      "created": 1759759082716
    */
    const layer = new MapLayerBase(id, type, name, created);
    // layer.setDataProvider(json.dataproviderId)
    return layer;
};

class MapLayerParserRegister {
    constructor () {
        this._layerTypeParser = {};
    }

    addParser (type, parser) {
        const parserType = typeof parser;
        if (!type) {
            throw new Error(`Can't register parser without a type`);
        }
        if (parserType !== 'function') {
            throw new Error(`Type [${type}] requires function as parser. Tried to pass ${parserType}`);
        }
        this._layerTypeParser[type] = parser;
        // composingModels?
    }

    parseLayerTypeJson (json) {
        // probably need to get class from parser?
        const layer = parseLayerJson(json);
        const parserFn = this._layerTypeParser[layer.getType()];
        if (parserFn) {
            parserFn(layer, json);
        }
        return layer;
    }
};
export const parserRegister = new MapLayerParserRegister();
