import { Messaging } from 'oskari-ui/util';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../instance';

export class MetadataSearchService {
    constructor (searchAjaxUrl) {
        this.searchAjaxUrl = searchAjaxUrl;
    }

    doSearch (params, onSuccess) {
        const epsg = Oskari.getSandbox().getMap().getSrsName();
        if (!params.srs) {
            params.srs = epsg;
        }
        // create POST payload from params
        const payload = Object.keys(params)
            .filter(key => typeof params[key] !== 'undefined')
            .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
            .join('&');

        return fetch(this.searchAjaxUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
                'Accept': 'application/json'
            },
            body: payload
        }).then(response => {
            if (!response.ok) {
                Messaging.error(Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.metadataSearchserviceError'));
            }
            return response.json();
        }).then(json => {
            if (onSuccess) {
                onSuccess(json);
            }
        });
    }
}
