import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';
import { mapResponseForRender } from './util';

class MetadataHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.setState({
            activeTab: 'basic',
            loading: false,
            current: null, // { uuid, layerId }
            layers: [],
            showFullGraphics: false,
            metadata: {},
            identifications: []
        });
    }

    setActiveTab (activeTab) {
        this.updateState({ activeTab });
    }

    toggleShowFullGraphics () {
        const { showFullGraphics } = this.getState();
        this.updateState({ showFullGraphics: !showFullGraphics });
    }

    toggleMapLayerVisibility ({ layerId, isVisible, isSelected }) {
        const sb = this.instance.getSandbox();
        if (isSelected && isVisible) {
            sb.postRequestByName('RemoveMapLayerRequest', [layerId]);
        } else if (isSelected) {
            sb.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [layerId, true]);
        } else {
            sb.postRequestByName('AddMapLayerRequest', [layerId]);
        }
    }

    onMapLayerEvent (layer) {
        if (!layer) {
            return;
        }
        const { layers } = this.getState();
        const layerId = layer.getId();
        const isVisible = layer.isVisible();
        const isSelected = Oskari.getSandbox().isLayerAlreadySelected(layer.getId());
        this.updateState({ layers: layers.map(layer => layer.layerId === layerId ? { ...layer, isVisible, isSelected } : layer) });
    }

    onFlyoutClose () {
        this.updateState({ current: null });
    }

    fetchMetadata ({ layerId, uuid }) {
        // clear previous
        this.updateState({ loading: true, metadata: {}, identifications: [], layers: [] });

        const srs = this.instance.getSandbox().getMap().getSrsName();
        const lang = Oskari.getLang();
        const route = Oskari.urls.getRoute('GetCSWData', { layerId, uuid, lang, srs });
        fetch(route, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                Messaging.error(this.instance.loc('advancedSearch.fetchAdvancedSearchOptionsFailed'));
            }
            return response.json();
        }).then(json => {
            const { metadata, identifications } = mapResponseForRender(json);
            const layers = this._getLayers(uuid, layerId, metadata.fileIdentifier);
            const current = { layerId, uuid: uuid || metadata.fileIdentifier };
            this.updateState({ loading: false, current, metadata, layers, identifications });
        }).catch(error => {
            this.updateState({ loading: false });
            Oskari.log('MetadataHandler').error(error);
        });
    }

    _getLayers (uuid, layerId, metadataUuid) {
        const service = this.instance.getLayerService();
        if (Oskari.dom.isEmbedded() || !service) {
            return [];
        }
        const requestedUuid = uuid || service.findMapLayer(layerId)?.getMetadataIdentifier();
        const selected = Oskari.getSandbox().findAllSelectedMapLayers().map(l => l.getId());
        const layers = service.getLayersByMetadataId(requestedUuid);
        if (metadataUuid !== requestedUuid) {
            layers.push(...service.getLayersByMetadataId(metadataUuid));
        }
        return layers.map(l => ({
            layerId: l.getId(),
            isVisible: l.isVisible(),
            name: l.getName(),
            isSelected: selected.includes(l.getId())
        }));
    }
}

const wrapped = controllerMixin(MetadataHandler, [
    'setActiveTab',
    'toggleShowFullGraphics',
    'toggleMapLayerVisibility'
]);

export { wrapped as MetadataHandler };
