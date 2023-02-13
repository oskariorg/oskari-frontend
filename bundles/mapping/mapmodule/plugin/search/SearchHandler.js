import '../../../../service/search/searchservice';
import { showResultsPopup } from './SearchResultsPopup';
import { StateHandler, controllerMixin } from 'oskari-ui/util';

const MARKER_ID = 'SEARCH_RESULT_MARKER';
class SearchHandler extends StateHandler {
    constructor (plugin) {
        super();
        this.plugin = plugin;
        this.setState({
            minimized: false,
            loading: false,
            hasOptions: false
        });
        this.popupControls = null;
        this.eventHandlers = this.createEventHandlers();
        this.service = Oskari.clazz.create('Oskari.service.search.SearchService', this.getSandbox(), plugin.getConfig().url);
    };

    clearPopup () {
        this.removeMarker();
        if (this._popupControls) {
            this._popupControls.close();
        }
        this._popupControls = null;
    }

    getMsg (key, args) {
        return Oskari.getMsg('MapModule', 'plugin.SearchPlugin.' + key, args);
    }

    showResultsPopup (results) {
        this.clearPopup();
        const { totalCount, hasMore, locations } = results;
        const msgKey = hasMore ? 'searchMoreResults' : 'searchResultCount';
        let title = this.getMsg('title');
        let description = this.getMsg(msgKey, { count: totalCount });

        if (totalCount === 0) {
            description = this.getMsg('noresults');
        } else if (totalCount === 1) {
            // only one result, show it immediately
            this.resultClicked(locations[0]);
            return;
        }
        this._popupControls = showResultsPopup(
            title,
            description,
            locations,
            (result) => this.resultClicked(result),
            () => this.clearPopup(),
            this.plugin.getLocation());
    }

    getName () {
        return 'SearchPluginHandler';
    }

    getSandbox () {
        return this.plugin.getSandbox();
    }

    setQuery (query) {
        this.setState({
            query
        });
    }

    /**
     * Uses SearchService to make the actual search and calls  #_showResults
     */
    doSearch () {
        const { loading, query } = this.getState();
        if (loading) {
            return;
        }
        this.clearPopup();
        this.setState({
            loading: true
        });
        this.service.doSearch(query, results => {
            this.setState({
                query,
                loading: false
            });
            this.showResultsPopup(results);
        }, () => {
            // on error
            this.setState({
                loading: false
            });
        });
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
        // TODO: if the user can select search channels for the query etc
        // related to state.hasOptions: false
        // hasOptions is always false for now since this has not been implemented yet
    }
}

const wrapped = controllerMixin(SearchHandler, [
    'resultClicked',
    'requestSearchUI',
    'doSearch',
    'setQuery',
    'showOptions'
]);

export { wrapped as SearchHandler };
