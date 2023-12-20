import { controllerMixin } from 'oskari-ui/util';
import { ToolPanelHandler } from './ToolPanelHandler';
import '../tools/SwipeTool.js';

class UIHandler extends ToolPanelHandler {
    constructor (tools, sandbox, consumer) {
        // ToolPanelHandler adds tools to state so we can reference it here
        super(tools, consumer);
        this.sandbox = sandbox;
        this.updateState({
            tools: []
        });
    };

    init (data) {
        const hasTools = super.init(data);
        return hasTools;
    }

    stop () {
        const { tools } = this.getState();
        tools.forEach(tool => {
            try {
                tool.publisherTool.stop();
            } catch (e) {
                Oskari.log('Publisher.AdditionalToolsHandler')
                    .error('Error stopping publisher tool:', tool.getTool().id);
            }
        });
    }
}

const wrapped = controllerMixin(UIHandler, [
    'setToolEnabled'
]);

export { wrapped as AdditionalToolsHandler };
