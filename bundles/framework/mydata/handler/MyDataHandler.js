import { StateHandler } from 'oskari-ui/util';

class UIHandler extends StateHandler {
    constructor (consumer) {
        super();
        this.setState({
            tabs: []
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

    getName () {
        return 'MyDataHandler';
    }
}

export { UIHandler as MyDataHandler };
