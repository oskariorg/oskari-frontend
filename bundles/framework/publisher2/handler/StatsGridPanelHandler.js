import { controllerMixin } from 'oskari-ui/util';
import { ToolPanelHandler } from './ToolPanelHandler';
const STATSGRID_LAYER_ID = 'STATS_LAYER';
class UIHandler extends ToolPanelHandler {
    constructor (tools, sandbox, toggleStatsGridPanel) {
        super(tools);
        this.sandbox = sandbox;
        this.eventHandlers = {
            /**
             * @method AfterMapLayerAddEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
             */
            AfterMapLayerAddEvent: function (event) {
                if (!!toggleStatsGridPanel && event.getMapLayer().getId() === STATSGRID_LAYER_ID) {
                    toggleStatsGridPanel(true);
                }
            },

            /**
             * @method AfterMapLayerRemoveEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
             */
            AfterMapLayerRemoveEvent: function (event) {
                if (!!toggleStatsGridPanel && event.getMapLayer().getId() === STATSGRID_LAYER_ID) {
                    toggleStatsGridPanel(false);
                }
            }

        };
    }

    initTools () {
        const hasTools = super.init(this.data, true);
        return hasTools;
    }

    init (data) {
        this.data = data;
        Object.getOwnPropertyNames(this.eventHandlers).forEach((event) => {
            this.sandbox.registerForEventByName(this, event);
        });

        return this.initTools();
    }

    stop () {
        super.stop();
        Object.getOwnPropertyNames(this.eventHandlers).forEach(event => this.sandbox.unregisterFromEventByName(this, event));
    }

    onEvent (event) {
        const handler = this.eventHandlers[event.getName()];
        if (!handler) {
            return;
        }
        return handler.apply(this, [event]);
    }

    getName () {
        return 'Oskari.mapframework.bundle.publisher2.handler.StatsGridPanelHandler';
    }
}

const wrapped = controllerMixin(UIHandler, [
    'setToolEnabled'
]);

export { wrapped as StatsGridPanelHandler };
