import { Messaging } from 'oskari-ui/util';
import { VectorStyle, RUNTIME_PREFIX } from '../../mapmodule/domain/VectorStyle';
import { BUNDLE_KEY } from '../constants';

export class UserStyleService {
    constructor (sandbox) {
        this.styles = []; // server VectorStyle
        this.sandbox = sandbox;
        this.log = Oskari.log('UserStyleService');
        Oskari.makeObservable(this);
        this.fetchUserStyles();
    }

    saveUserStyle (style) {
        if (!style.name) {
            const nextVal = Oskari.getSeq(BUNDLE_KEY).nextVal();
            style.name = Oskari.getMsg(BUNDLE_KEY, 'defaultName') + ' ' + nextVal;
        }
        if (Oskari.user().isLoggedIn()) {
            if (style.id) {
                this.updateStyle(style);
            } else {
                this.saveStyle(style);
            }
        } else {
            this.storeStyle(style);
        }
    }

    removeUserStyle (id) {
        if (Oskari.user().isLoggedIn()) {
            this.deleteStyle(id);
        } else {
            this.removeFromStore(id);
        }
    }

    storeStyle (style) {
        const { id, layerId } = style;
        if (!layerId) {
            this.log.warn('Tried to store vector style without layerId. Skipping.');
            return;
        }
        // new runtime styles for guest user doesn't have id
        // use string prefixed time to get unique id and mark as runtime style
        // backend stored styles have always number (Long) id
        if (!id) {
            style.id = RUNTIME_PREFIX + Date.now().toString();
        }
        const index = this.styles.findIndex(s => s.id === id);
        if (index !== -1) {
            this.styles[index] = style;
        } else {
            this.styles.push(style);
        }
        this.applyStyleToLayer(style);
        this.notifyStyleUpdate(layerId);
    }

    removeFromStore (id) {
        const style = this.getStyleById(id);
        if (!style) {
            this.log.warn(`Tried to remove vector style: ${id} from storage. Style does not exist. Skipping.`);
            return;
        }
        this.styles = this.styles.filter(s => s.id !== id);
        this.removeStyleFromLayer(style);
        this.notifyStyleUpdate(style.layerId);
    }

    // Used for listing all styles in mydata tab
    fetchUserStyles () {
        if (!Oskari.user().isLoggedIn()) {
            return;
        }
        this.ajaxStarted();
        fetch(Oskari.urls.getRoute('VectorStyle'), {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                return Promise.reject(new Error('Fetching user vector styles failed'));
            }
            return response.json();
        }).then(json => {
            this.handleFetchResponse(json);
        }).catch(error => this.ajaxError('fetch', error));
    }

    deleteStyle (id) {
        this.ajaxStarted();
        fetch(Oskari.urls.getRoute('VectorStyle', { id }), {
            method: 'DELETE'
        }).then(response => {
            return response.ok && response;
        }).then((resp) => {
            if (resp === false) {
                throw Error('Failed to delete vector style');
            }
            this.removeFromStore(id);
            this.ajaxSuccess('delete');
        }).catch(error => this.ajaxError('delete', error));
    }

    saveStyle (style) {
        this.ajaxStarted();
        fetch(Oskari.urls.getRoute('VectorStyle'), {
            method: 'POST',
            body: JSON.stringify(style)
        }).then(response => {
            if (!response.ok) {
                return Promise.reject(new Error('Failed to save vector style'));
            }
            return response.json();
        }).then((json) => {
            this.storeStyle(json);
            this.ajaxSuccess('save');
        }).catch(error => this.ajaxError('save', error));
    }

    updateStyle (style) {
        this.ajaxStarted();
        fetch(Oskari.urls.getRoute('VectorStyle'), {
            method: 'PUT',
            body: JSON.stringify(style)
        }).then(response => {
            if (!response.ok) {
                return Promise.reject(new Error('Failed to update vector style'));
            }
            return response.json();
        }).then((json) => {
            this.storeStyle(json);
            this.ajaxSuccess('save');
        }).catch(error => this.ajaxError('save', error));
    }

    ajaxStarted () {
        this.trigger('ajax', true);
    }

    ajaxError (method, error) {
        Messaging.error(Oskari.getMsg(BUNDLE_KEY, `error.${method}`));
        this.log.error(error);
        this.trigger('ajax', false);
    }

    ajaxSuccess (method) {
        Messaging.success(Oskari.getMsg(BUNDLE_KEY, `success.${method}`));
        this.trigger('ajax', false);
    }

    handleFetchResponse (json) {
        if (!Array.isArray(json)) {
            return;
        }
        this.styles = json;
        // Don't apply styles for layers. Only notify mass update.
        this.notifyStyleUpdate();
    }

    notifyStyleUpdate (layerId) {
        this.trigger('update', layerId);
    }

    notifyLayerUpdate (layerId) {
        const event = Oskari.eventBuilder('MapLayerEvent')(layerId, 'update');
        this.sandbox.notifyAll(event);
    }

    getQName () {
        return 'Oskari.mapframework.userstyle.service.UserStyleService';
    }

    _getStyleName(style) {
        // id is used for VectorStyle name (string)
        return style?.id.toString();
    }

    getStyleNamesForLayer (layerId) {
        return this.getStylesByLayer(layerId).map(style => this._getStyleName(style));
    }

    applyStyleToLayer (style) {
        const { layerId } = style || {};
        // Users own styles are loaded (overrides) via DescribeLayer when layer is added first time on the map
        // Find layer from all available to be sure that style is added to layer
        // Note that style is selected only when layer is on the map (is selected)
        const layer = this.sandbox.findMapLayerFromAllAvailable(layerId);
        if (layer) {
            layer.addStyle(new VectorStyle(style));
            const name = this._getStyleName(style);
            layer.selectStyle(name);
            // request notifies change if layer is selected
            this.sandbox.postRequestByName('ChangeMapLayerStyleRequest', [layerId, name]);
            this.notifyLayerUpdate(layerId);
        }
    }

    removeStyleFromLayer (style) {
        const { layerId } = style || {};
        const layer = this.sandbox.findMapLayerFromAllAvailable(layerId);
        if (layer) {
            const name = this._getStyleName(style);
            layer.removeStyle(name);
            this.notifyLayerUpdate(layerId);
        }
    }

    getStyles () {
        return this.styles;
    }

    getStylesByLayer (layerId) {
        return this.styles.filter(s => s.layerId === layerId);
    }

    getStyleById (id) {
        return this.styles.find(s => s.id === id);
    }
}
