import { Messaging } from 'oskari-ui/util';
import { VectorStyle } from '../../mapmodule/domain/VectorStyle';
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
            this.saveRuntimeStyle(style);
        }
        // Style is saved from selected layer so add saved style to layer
        this.applyStyleToLayer(style.id);
    }

    removeUserStyle (id) {
        this.removeStyleFromLayer(id);
        if (Oskari.user().isLoggedIn()) {
            this.deleteStyle();
        } else {
            this.styles = this.styles.filter(s => s.id !== id);
            this.notifyStyleUpdate();
        }
    }

    saveRuntimeStyle (style) {
        const { id, layerId } = style;
        if (layerId) {
            this.log.warn('Tried to add runtime vector style without layerId. Skipping.');
            return;
        }
        if (!id) {
            // styles are stored only for runtime, use time to get unique id
            // use string (backend stored styles have number/Long)
            style.id = 's_' + Date.now().toString();
        }
        const index = this.styles.findIndex(s => s.id === id);
        if (index !== -1) {
            this.styles[index] = style;
        } else {
            this.styles.push(style);
        }
        this.applyStyleToLayer(style);
        this.notifyStyleUpdate();
    }

    // Used for listing styles in mydata tab
    // Don't apply styles here for layrs. LayersPlugin handles
    fetchUserStyles () {
        if (!Oskari.user().isLoggedIn()) {
            return;
        }
        this.ajaxStarted();
        fetch(Oskari.urls.getRoute('VectorStyle'), {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
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
            this.ajaxSuccess('delete');
        }).catch(error => this.ajaxError('delete', error));
    }

    saveStyle (style) {
        this.ajaxStarted();
        fetch(Oskari.urls.getRoute('VectorStyle'), {
            method: 'POST',
            body: JSON.stringify(style)
        }).then(response => {
            return response.ok && response;
        }).then((resp) => {
            if (resp === false) {
                throw Error('Failed to save vector style');
            }
            this.ajaxSuccess('save');
        }).catch(error => this.ajaxError('save', error));
    }

    updateStyle (style) {
        this.ajaxStarted();
        fetch(Oskari.urls.getRoute('VectorStyle'), {
            method: 'PUT',
            body: JSON.stringify(style)
        }).then(response => {
            return response.ok && response;
        }).then((resp) => {
            if (resp === false) {
                throw Error('Failed to update vector style');
            }
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
        // for now loads all user styles on add, update, delete
        this.fetchUserStyles();
    }

    handleFetchResponse (json) {
        if (!Array.isArray(json)) {
            return;
        }
        this.styles = json;
        this.notifyStyleUpdate();
        // Should add style only for selected on start or Describe loaded on save/update
        // this.styles.forEach(s => this.applyStyleToLayer(s.id));
    }

    notifyStyleUpdate () {
        this.trigger('update');
    }

    notifyLayerUpdate (layerId) {
        const event = Oskari.eventBuilder('MapLayerEvent')(layerId, 'update');
        this.sandbox.notifyAll(event);
    }

    getQName () {
        return 'Oskari.mapframework.userstyle.service.UserStyleService';
    }

    applyStyleToLayer (id) {
        const style = this.getStyleById(id);
        const { layerId } = style || {};
        const layer = this.sandbox.findMapLayerFromAllAvailable(layerId);
        if (layer) {
            layer.addStyle(new VectorStyle(style));
            layer.selectStyle(id);
            this.sandbox.postRequestByName('ChangeMapLayerStyleRequest', [layerId, id]);
            this.notifyLayerUpdate(layerId);
        }
    }

    removeStyleFromLayer (id) {
        const style = this.getStyleById(id);
        const { layerId } = style || {};
        const layer = this.sandbox.findMapLayerFromAllAvailable(layerId);
        if (layer) {
            layer.removeStyle(id);
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
