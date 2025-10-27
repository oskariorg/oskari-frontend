import { handleMyFeaturesLayers, parseLayerData } from './layerHandling';
import { MyFeaturesImportError } from './MyFeaturesImportError';
import { DESCRIBE_LAYER } from '../../../mapping/mapmodule/domain/constants';

export class MyFeaturesService {
    constructor (sandbox, mapLayerService, getMsg) {
        this.mapLayerService = mapLayerService;
        this.sandbox = sandbox;
        this.srs = this.sandbox.getMap().getSrsName();
        this.log = Oskari.log('MyFeaturesService');
        Oskari.makeObservable(this);
        const { group, dataProviderId } = handleMyFeaturesLayers(
            sandbox,
            mapLayerService,
            getMsg);
        this._group = group;
        this._dataProviderId = dataProviderId;
    }

    getQName () {
        return 'Oskari.mapframework.bundle.myfeatures.MyFeaturesService';
    }

    getName () {
        return 'MyFeatures.MyFeaturesService';
    }

    async loadLayers () {
        return fetch(Oskari.urls.getRoute('MyFeaturesLayer' /*, { srs: this.srs } */), {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(layers => {
            layers.forEach((layerJson) => {
                this.addLayerToService(layerJson, true);
            });
            const layerCount = layers.length;
            if (layerCount > 0) {
                const event = Oskari.eventBuilder('MapLayerEvent')(layerCount > 1 ? null : layers[0].id, 'add'); // null as id triggers mass update
                this.sandbox.notifyAll(event);
                // this.notifyUpdate(); // do we need to notify this??
            }
            return layerCount;
        });
    }

    addLayerToService (layerJson, skipEvent) {
        const mapLayerService = this.mapLayerService;

        // Create the layer model
        const mapLayer = mapLayerService.createMapLayer({
            ...layerJson,
            groups: [this._group],
            dataproviderId: this._dataProviderId,
            permissions: {
                publish: true
            }
        });
        // mark that this has been added by this bundle.
        // There might be other userlayer typed layers in maplayerservice from link parameters that might NOT be this users layers.
        // This is used to filter out other users shared layers when listing layers on the My Data functionality.
        mapLayer.markAsInternalDownloadSource();
        // Add the layer to the map layer service
        mapLayerService.addLayer(mapLayer, skipEvent);
        return mapLayer;
    }

    async importFile (file, locale, style, sourceSrs) {
        //const { sourceSrs, locale, style, file } = values;
        const formData = new FormData();
        formData.append('locale', JSON.stringify(locale));
        formData.append('style', JSON.stringify(style));
        formData.append('file', file);

        const params = {
            srs: this.srs
        };
        if (sourceSrs) {
            params.sourceEpsg = `EPSG:${sourceSrs}`;
        }
        const url =  Oskari.urls.getRoute('ImportMyFeatures', params);
        return fetch(url, {
            method: 'POST',
            body: formData,
            headers: {
                Accept: 'application/json'
            }
        }).then(response => {
            // NOTE!! http 400 is used for special error handling
            if (!response.ok && response.status !== 400) {
                // if bad request try to dig error code from json
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(json => {
            const { error, info, warning, layer } = json;
            if (error) {
                // server responds with 400 and stuff like this when
                //   we can handle show some nicer message than generic one
                /*
                {
                    "error": "sourceCRS must be known!",
                    "info": {
                        "parser": "shp",
                        "cause": "unknown_projection",
                        "files": [
                            "shape_no_prj/uusitaso.shx",
                            "shape_no_prj/uusitaso.dbf",
                            "shape_no_prj/uusitaso.shp"
                        ],
                        "error": "parser_error"
                    }
                }
                */
                throw new MyFeaturesImportError(error, undefined, {
                    error,
                    info
                });

                /*{
                    error: 'sourceCRS must be known!',
                    info: {
                        parser: 'shp',
                        cause: 'unknown_projection',
                        files: [
                            'shape_no_prj/uusitaso.shx',
                            'shape_no_prj/uusitaso.dbf',
                            'shape_no_prj/uusitaso.shp'
                        ],
                        error: 'parser_error'
                    }
                });*/
            }
            const maplayer = this.addLayerToService(json.layer);
            // this.notifyUpdate();
            return {
                id: maplayer.getId(),
                featureCount: layer?.featureCount,
                warning
            };
        });
    }

    async getLayerForEdit (id) {
        return await fetch(Oskari.urls.getRoute('MyFeaturesLayer', { id }), {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        });
    }

    async updateLayer (layerId, values) {
        return fetch(Oskari.urls.getRoute('MyFeaturesLayer'), {
            method: 'PUT',
            // id is required as part of payload
            body: JSON.stringify({
                ...values,
                id: layerId
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(json => {
            this.updateLayerInMapLayerService(json);
            return true;
        });
    }

    updateLayerInMapLayerService (updatedLayer) {
        const { id } = updatedLayer;
        const layer = this.mapLayerService.findMapLayer(id);
        if (!layer) {
            this.log.error('Could not find layer for update with id:' + id);
            return;
        }
        const localeForLang = Oskari.getLocalized(updatedLayer?.locale);
        this.mapLayerService.updateLayer(id, {
            name: localeForLang?.name,
            subtitle: localeForLang?.desc
        });
        // for some reason, modelbuilders are not called in mapLayerService.updateLayer()
        parseLayerData(layer, updatedLayer);
        // force mapmodule to reload a style when the layer is added/refreshed on the map
        layer.setDescribeLayerStatus(DESCRIBE_LAYER.UNDEFINED);
        if (this.sandbox.isLayerAlreadySelected(id)) {
            // update layer on map
            // TODO: shouldn't this be part of the maplayerService.updateLayer() impl?
            this.sandbox.postRequestByName('MapModulePlugin.MapLayerUpdateRequest', [id, true]);
            this.sandbox.postRequestByName('ChangeMapLayerStyleRequest', [layer.getId()]);
        }
    }

    async deleteLayer (layerId) {
        return fetch(Oskari.urls.getRoute('MyFeaturesLayer', { id: layerId }), {
            method: 'DELETE'
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            this.mapLayerService.removeLayer(layerId);
            this.sandbox.postRequestByName('RemoveMapLayerRequest', [layerId]);
            // this.notifyUpdate();
            return true;
        });
    }
};
