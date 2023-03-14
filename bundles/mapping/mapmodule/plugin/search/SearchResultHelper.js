
const MARKER_ID = 'SEARCH_RESULT_MARKER';
const RESULTS_LAYER_ID = 'SEARCH_RESULT_LAYER';

const INFOBOX_ID = 'SEARCH_RESULT_INFOBOX';
const getMsg = key => Oskari.getMsg('MapModule', key);

export class SearchResultHelper {
    constructor (sandbox, useInfobox = true) {
        this.sandbox = sandbox;
        this.useInfobox = !!useInfobox;
        this.resultActions = {};
    }
    getSandbox () {
        return this.sandbox;
    }
    addSearchResultAction (action) {
        this.resultActions[action.name] = action.callback;
    }
    removeSearchResultAction (name) {
        delete this.resultActions[name];
    }
    setMarker (result) {
        if (this.useInfobox) {
            this.showInfobox(result);
            return;
        }
        const lat = typeof result.lat !== 'number' ? parseFloat(result.lat) : result.lat;
        const lon = typeof result.lon !== 'number' ? parseFloat(result.lon) : result.lon;

        this.getSandbox().postRequestByName('MapModulePlugin.AddMarkerRequest', [{
            color: 'ffde00',
            msg: result.name,
            shape: 2,
            size: 3,
            x: lon,
            y: lat
        }, MARKER_ID]);
    }
    removeMarker () {
        this.getSandbox().postRequestByName('MapModulePlugin.RemoveMarkersRequest', [MARKER_ID]);
    }
    showResultOnMap (result) {
        this.getSandbox().postRequestByName('MapModulePlugin.AddFeaturesToMapRequest', [result.GEOMETRY, {
            layerId: RESULTS_LAYER_ID,
            attributes: {
                ...result,
                id: result.id
            }
        }]);
        this.getSandbox().postRequestByName('MapModulePlugin.ZoomToFeaturesRequest', [{
            layer: [RESULTS_LAYER_ID],
            // don't zoom too close for point features
            maxZoomLevel: 10
        }]);
    }
    removeResultFromMap (result) {
        const params = [];
        if (result) {
            // clear based on id
            // TODO: not all features have ids (only ones from wfs-search channel does)
            // assuming the searchhandler generated an id for results that don't have one
            params.push('id');
            params.push(result.id);
        } else {
            // clear all
            params.push(null);
            params.push(null);
        }
        params.push(RESULTS_LAYER_ID);
        this.getSandbox().postRequestByName('MapModulePlugin.RemoveFeaturesFromMapRequest', params);
    }
    showInfobox (result) {
        const lat = typeof result.lat !== 'number' ? parseFloat(result.lat) : result.lat;
        const lon = typeof result.lon !== 'number' ? parseFloat(result.lon) : result.lon;

        const resultActions = Object.keys(this.resultActions).map(name => {
            const actionFn = this.resultActions[name];
            return {
                name,
                type: 'link',
                action: actionFn(result),
                group: 1
            };
        });
        const sandbox = this.getSandbox();
        const closeAction = {
            name: getMsg('plugin.SearchPlugin.resultBox.close'),
            type: 'link',
            group: 1,
            action: () => sandbox.postRequestByName('InfoBox.HideInfoBoxRequest', [INFOBOX_ID])
        };
        resultActions.push(closeAction);

        const alternatives = createAlternativeNamesHTMLBlock(result);
        const contentItem = {
            html: `<h3>${Oskari.util.sanitize(result.name)}</h3>
                    ${alternatives}
                    <p>${result.region}<br/>
                    ${result.type}</p>`,
            actions: resultActions
        };
        const content = [contentItem];

        const options = {
            hidePrevious: true
        };
        sandbox.postRequestByName('InfoBox.ShowInfoBoxRequest', [
            INFOBOX_ID,
            getMsg('plugin.SearchPlugin.resultBox.title'),
            content,
            {
                lon: lon,
                lat: lat
            },
            options]);
    }
}

const createAlternativeNamesHTMLBlock = (result) => {
    if (!result || !result.localized) {
        return '';
    }
    const alternatives = result.localized
        .filter(cur => cur.name !== result.name)
        .map(cur => `${cur.name} [${cur.locale}]`)
        .sort();
    if (alternatives.length === 0) {
        return '';
    }
    const div = document.createElement('div');
    div.style.fontSize = '12px';
    const list = document.createElement('ul');
    alternatives.forEach(txt => {
        const item = document.createElement('li');
        item.append(document.createTextNode(txt));
        list.append(item);
    });
    list.style.marginTop = '5px';
    list.style.listStylePosition = 'inside';
    div.append(document.createTextNode(getMsg('plugin.SearchPlugin.resultBox.alternatives')));
    div.append(list);
    return div.outerHTML;
};
