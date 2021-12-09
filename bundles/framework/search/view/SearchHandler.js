import React from 'react';
import { Message } from 'oskari-ui';
import { StateHandler, Messaging, controllerMixin } from 'oskari-ui/util';

const showMessage = (key, args, defaultMsg = key) => Messaging.error(<Message messageKey={key} messageArgs={args} defaultMsg={defaultMsg} bundleKey='Search' />);

class UIHandler extends StateHandler {
    constructor (sandbox, consumer) {
        super();
        this.sandbox = sandbox;
        this.log = Oskari.log('SearchHandler');
        this.loadingCount = 0;
        this.setState({
            query: '',
            autocomplete: [],
            result: {},
            loading: false
        });
        this.addStateListener(consumer);
        this.eventHandlers = this._createEventHandlers();
    }
    triggerSearch (query) {
        console.log('searching for:', query);

        this.updateState({ query });
        if (query === '') {
            return;
        }
        if (!this._validateSearchKey(query)) {
            return;
        }
        this.updateState({
            loading: true,
            result: {},
            autocomplete: []
        });

        this.sandbox.postRequestByName('SearchRequest', [query]);
    }
    autocomplete (query) {
        this.updateState({ query });
    }

    _validateSearchKey (key) {
        // empty string
        if (key === null || key === undefined || key.trim().length === 0) {
            showMessage('cannot_be_empty');
            return false;
        }
        const query = key.trim();
        const nonWildcardQuery = query.replaceAll('*', '').replaceAll('?', '');
        if (!nonWildcardQuery.length) {
            // only stars/wildcards
            showMessage('too_many_stars');
            return false;
        }
        return true;
    }
    handleResult (success, result, query) {
        this.updateState({
            loading: false,
            result: result,
            query,
            autocomplete: []
        });
        // error handling
        if (!success) {
            const genericErrorKey = 'searchservice_search_not_found_anything_text';
            const errorKey = result ? result.responseText : null;
            showMessage(errorKey || genericErrorKey, null, genericErrorKey);
        }
    }

    /// Oskari event handling ////////////////////////////////////////////////////////////

    /**
     * "Module" name for event handling
     */
     getName () {
        return 'LayerViewTabsHandler';
    }
    /**
    * @method onEvent
    * @param {Oskari.mapframework.event.Event} event a Oskari event object
    * Event is handled forwarded to correct #eventHandlers if found or discarded if not.
    */
    onEvent (event) {
        const handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    }

    _createEventHandlers () {
        const handlers = {
            'SearchResultEvent': event => {
                var params = event.getRequestParameters();
                if (typeof params === 'object') {
                    params = params.searchKey;
                }
                this.handleResult(event.getSuccess(), event.getResult(), params);
            }
        };
        Object.getOwnPropertyNames(handlers).forEach(p => this.sandbox.registerForEventByName(this, p));
        return handlers;
    }

}

const wrapped = controllerMixin(UIHandler, [
    'triggerSearch',
    'autocomplete',
    'resultClicked'
]);
export { wrapped as SearchHandler };
