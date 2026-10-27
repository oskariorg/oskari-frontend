import { StateHandler } from 'oskari-ui/util';

const MYFEATURES_TAB_ID = 'myfeatures';
const STATIC_TAB_IDS = ['account', 'myviews', 'publishedmaps'];

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
        const tabs = [...this.state.tabs];
        const tab = {
            id,
            title,
            component,
            handler
        };
        if (id === MYFEATURES_TAB_ID) {
            // myfeatures goes right after the static tabs, others are appended in the order they are added
            const staticCount = tabs.filter((existing) => STATIC_TAB_IDS.includes(existing.id)).length;
            tabs.splice(staticCount, 0, tab);
        } else {
            tabs.push(tab);
        }
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
