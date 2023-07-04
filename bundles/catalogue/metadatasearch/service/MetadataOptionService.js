import { Messaging } from 'oskari-ui/util';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../instance';

export class MetadataOptionService {
    constructor (optionsAjaxUrl) {
        this.optionsAjaxUrl = optionsAjaxUrl;
    }

    async getOptions (onSuccess) {
        const epsg = Oskari.getSandbox().getMap().getSrsName();
        const urlSearchParams = new URLSearchParams({ srs: epsg });
        return fetch(this.optionsAjaxUrl + '&' + urlSearchParams, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                Messaging.error(Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.fetchAdvancedSearchOptionsFailed'));
            }
            return response.json();
        }).then(json => {
            if (onSuccess) {
                onSuccess(json);
            }
        });
    }
}
