export class PublisherService {
    constructor (sandbox) {
        this.sandbox = sandbox;
        this.isActive = false;
    }

    getName () {
        return 'PublisherService';
    }

    getQName () {
        return 'Oskari.mapframework.bundle.publisher2.PublisherService';
    }

    /**
     * @method getLayersWithoutPublishRights
     * Checks currently selected layers and returns a subset of the list
     * that has the layers that can't be published. If all selected
     * layers can be published, returns an empty list.
     * @return {Oskari.mapframework.domain.AbstractLayer[]} list of layers that can't be published.
     */
    getLayersWithoutPublishRights () {
        const selectedLayers = this.__sandbox.findAllSelectedMapLayers();
        return selectedLayers.filter(layer => !this.hasPublishRight(layer));
    }

    /**
     * @method hasPublishRight
     * Checks if the layer can be published.
     * @param
     * {Oskari.mapframework.domain.AbstractLayer} layer layer to check
     * @return {Boolean} true if the layer can be published
     */
    hasPublishRight (layer) {
        // permission might be "no_publication_permission"
        // or nothing at all
        return layer.hasPermission('publish');
    }

    /**
     * Stores references to layers that are not available for publishing
     * @param {Oskari.mapframework.domain.AbstractLayer[]} deniedList
     */
    setNonPublisherLayers (deniedList) {
        this.disabledLayers = deniedList;
    }

    /**
     * Returns layers that are not available for publishing
     * @return {Oskari.mapframework.domain.AbstractLayer[]}
     */
    getNonPublisherLayers () {
        if (!this.disabledLayers) {
            return [];
        }
        return this.disabledLayers;
    }

    /**
     * @method setIsActive
     * Sets publisher into active mode
     * @param {Boolean} isActive
     */
    setIsActive (isActive) {
        this.isActive = isActive;
    }

    /**
     * @method getIsActive
     * Get publisher active state
     * @return {Boolean}
     */
    getIsActive () {
        return this.isActive;
    }

    /**
     * @method addLayers
     * Adds temporarily removed layers to map
     */
    addLayers () {
        var sandbox = this.__sandbox;
        this.getNonPublisherLayers().forEach(layer => {
            sandbox.postRequestByName('AddMapLayerRequest', [layer.getId()]);
        });
    }

    /**
     * @method removeLayers
     * Removes temporarily layers from map that the user can't publish
     */
    removeLayers () {
        var sandbox = this.__sandbox;
        this.getNonPublisherLayers().forEach(layer => {
            sandbox.postRequestByName('RemoveMapLayerRequest', [layer.getId()]);
        });
    }

    checkTouAccepted (callback) {
        fetch(Oskari.urls.getRoute('HasAcceptedPublishedTermsOfUse'), {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(json => {
            callback(json);
        }).catch(error => {
            Oskari.log(this.getName()).warn('Failed to check publish terms of use acceptance', error);
            // respone with boolean value to accept tou & continue to publisher
            const tou = false;
            callback(tou);
        });
    }

    markTouAccepted (cb) {
        fetch(Oskari.urls.getRoute('AcceptPublishedTermsOfUse'), {
            method: 'POST'
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(json => {
            cb(json);
        // use null to try again at next time
        }).catch(() => cb(null));
    }

    getTouArticle (cb) {
        const tags = 'termsofuse, mappublication, ' + Oskari.getLang();
        fetch(Oskari.urls.getRoute('GetArticlesByTag', { tags }), {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(json => {
            const { content } = json.articles?.[0] || {};
            cb(content);
        }).catch(() => cb(null));
    }

    getAppSetup (uuid, cb) {
        if (!uuid) {
            // messaging error? log error?
            return;
        }
        fetch(Oskari.urls.getRoute('AppSetup', { uuid }), {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(json => {
            const view = { ...json, uuid };
            cb(view);
        }).catch(() => {}); // messaging error
    }
};
