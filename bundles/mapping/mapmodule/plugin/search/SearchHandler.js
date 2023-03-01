import '../../../../service/search/searchservice';
import { showResultsPopup } from './SearchResultsPopup';
import { showOptionsPopup } from './SearchOptionsPopup';
import { Messaging, StateHandler, controllerMixin } from 'oskari-ui/util';

const MARKER_ID = 'SEARCH_RESULT_MARKER';

// sort channel in alphabetical order but have defaults on top
const channelSortFunction = (a, b) => {
    if (a.isDefault && b.isDefault) {
        return Oskari.util.naturalSort(a.locale?.name, b.locale?.name);
    } else if (a.isDefault) {
        return -1;
    } else if (b.isDefault) {
        return 1;
    }
    return Oskari.util.naturalSort(a.locale?.name, b.locale?.name);
};

class SearchHandler extends StateHandler {
    constructor (plugin) {
        super();
        this.plugin = plugin;
        this.setState({
            minimized: false,
            loading: [],
            hasOptions: false,
            selectedChannels: []
        });
        this._popupControlsResult = null;
        this.eventHandlers = this.createEventHandlers();
        this.service = Oskari.clazz.create('Oskari.service.search.SearchService', this.getSandbox(), plugin.getConfig().url);
        this.fetchChannels();
    };

    teardown () {
        this.clearResultPopup();
        this.clearOptionsPopup();
    }

    clearResultPopup () {
        this.removeMarker();
        if (this._popupControlsResult) {
            this._popupControlsResult.close();
        }
        this._popupControlsResult = null;
    }

    getMsg (key, args) {
        return Oskari.getMsg('MapModule', 'plugin.SearchPlugin.' + key, args);
    }

    updateResultsPopup () {
        const { results = {}, loading, channels } = this.getState();
        if (!loading.length) {
            // we have all results
            // check if we didn't find anything OR if we found just one
            const currentChannels = Object.keys(results).filter(chan => !!results[chan]);
            if (!currentChannels.length) {
                // previous search result cleared
                return;
            }
            const combined = currentChannels.reduce((accumulator, currentValue) => {
                const channelResults = results[currentValue];
                if (!channelResults) {
                    return accumulator;
                }
                accumulator.push(...channelResults.locations);
                return accumulator;
            },
            []);

            if (combined.length === 0) {
                Messaging.error(this.getMsg('noresults'));
                return;
            } else if (combined.length === 1) {
                // only one result, show it immediately
                this.resultClicked(locations[0]);
                return;
            }
        }
        if (this._popupControlsResult) {
            this._popupControlsResult.update(results, channels);
            return;
        }

        this._popupControlsResult = showResultsPopup(
            results,
            channels,
            (result) => this.resultClicked(result),
            () => this.clearResultPopup(),
            this.plugin.getLocation());
    }

    getName () {
        return 'SearchPluginHandler';
    }

    getSandbox () {
        return this.plugin.getSandbox();
    }

    setQuery (query) {
        this.updateState({
            query
        });
    }

    /**
     * Uses SearchService to make the actual search and calls  #_showResults
     */
    doSearch () {
        const { loading, query = '', selectedChannels = [], channels } = this.getState();
        if (loading.length || query.length === 0) {
            return;
        }
        this.clearResultPopup();
        // TODO: cleanup
        const currentChannels = [...(new Set(loading.concat(selectedChannels)))];

        this.updateState({
            loading: currentChannels
        });
        currentChannels.forEach(channel => this.triggerSearchForChannel(channel, query));
    }

    triggerSearchForChannel (channel, query) {
        const updateResults = (results) => {
            const { results:prevResults = {}, loading } = this.getState();
            this.updateState({
                loading: results ? loading.filter(item => item !== channel) : loading,
                results: {
                    ...prevResults,
                    [channel]: results
                }
            });
            this.updateResultsPopup();
        };
        // clear previous results
        updateResults();
        this.service.doSearch(query, results => {
            updateResults(results);
        }, () => {
            // on error
            updateResults();
        }, undefined,
        channel);
    }

    resultClicked (result) {
        var zoom = result.zoomLevel;
        if (result.zoomScale) {
            zoom = { scale: result.zoomScale };
        }
        this.getSandbox().postRequestByName('MapMoveRequest', [result.lon, result.lat, zoom]);
        this.setMarker(result);
    }

    setMarker (result) {
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

    /** Restore from minimized state */
    requestSearchUI () {
        this.updateState({
            minimized: false
        });
    }

    createEventHandlers () {
        const handlers = {
            /** Minimize search bar on map click */
            'MapClickedEvent': () => {
                this.updateState({
                    minimized: true
                });
            }
        };
        const sandbox = this.getSandbox();
        Object.getOwnPropertyNames(handlers).forEach(p => sandbox.registerForEventByName(this, p));
        return handlers;
    }

    onEvent (e) {
        var handler = this.eventHandlers[e.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [e]);
    }

    showOptions () {
        this.clearOptionsPopup();
        const title = this.getMsg('options.title');
        const controller = this.getController();
        this._popupControlsOptions = showOptionsPopup(
            title,
            this.getState(),
            controller,
            () => this.clearResultPopup(),
            this.plugin.getLocation());
        // TODO: if the user can select search channels for the query etc
        // related to state.hasOptions: false
        // hasOptions is always false for now since this has not been implemented yet
    }
    fetchChannels () {
        fetch(Oskari.urls.getRoute('SearchOptions')).then(response => {
            if (!response.ok) {
                throw Error(response.statusText);
            }
            return response.json();
        }).then(json => {
            const { channels } = json;
            if (!channels) {
                throw Error('Unexpected response for search channels');
            }
            const sortedChannels = channels.sort(channelSortFunction);
            // we will change the value of selectedChannels when state changes to keep track if we should update the options popup
            let selectedChannels = channels.filter(c => c.isDefault).map(c => c.id);
            this.updateState({
                channels: sortedChannels,
                hasOptions: channels.length > 1,
                defaultChannels: [...selectedChannels],
                selectedChannels: [...selectedChannels]
            });
            this.addStateListener((state) => {
                if (!this._popupControlsOptions) {
                    // popup not open
                    return;
                }
                if (selectedChannels.length !== state.selectedChannels.length) {
                    // selected channels changed -> trigger popup update
                    this._popupControlsOptions.update(state);
                    // make a copy to compare on next update
                    selectedChannels = [...state.selectedChannels];
                }
            });
        }).catch(error => {
            throw Error(error);
        });
    }

    setChannelEnabled (channelId, enabled) {
        let { selectedChannels } = this.getState();
        if (enabled) {
            selectedChannels.push(channelId);
        } else {
            selectedChannels = selectedChannels.filter(id => id !== channelId);
        }

        this.updateState({
            selectedChannels
        });
    }
    clearOptionsPopup () {
        if (this._popupControlsOptions) {
            this._popupControlsOptions.close();
        }
        this._popupControlsOptions = null;
    }
};

const wrapped = controllerMixin(SearchHandler, [
    'resultClicked',
    'requestSearchUI',
    'doSearch',
    'setQuery',
    'showOptions',
    'setChannelEnabled'
]);

export { wrapped as SearchHandler };
