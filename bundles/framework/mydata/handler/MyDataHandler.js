import { StateHandler } from 'oskari-ui/util';

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
        this.updateState({
            tabs: [
                ...this.state.tabs,
                {
                    id,
                    title,
                    component,
                    handler
                }
            ]
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
