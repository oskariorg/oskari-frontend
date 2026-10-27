import { StateHandler } from 'oskari-ui/util';

const UNSORTED = Number.MAX_SAFE_INTEGER;

class UIHandler extends StateHandler {
    constructor (consumer) {
        super();
        this.setState({
            tabs: [],
            activeTab: undefined
        });
        this.addStateListener(consumer);
    }

    addTab (id, title, component, handler) {
        // tab component may declare static tabSortOrder, tabs without it go last
        const sortOrder = component.tabSortOrder ?? UNSORTED;
        const tabs = [
            ...this.state.tabs,
            {
                id,
                title,
                component,
                handler,
                sortOrder
            }
        ];
        tabs.sort((a, b) => a.sortOrder - b.sortOrder);
        this.updateState({
            tabs
        });
    }

    setActiveTab (tab) {
        this.updateState({
            activeTab: tab
        });
    }

    getName () {
        return 'MyDataHandler';
    }
}

export { UIHandler as MyDataHandler };
