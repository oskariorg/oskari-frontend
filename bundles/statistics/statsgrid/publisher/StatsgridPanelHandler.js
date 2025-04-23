import { controllerMixin } from 'oskari-ui/util';
import { ToolPanelHandler } from '../../../framework/publisher2/handler/ToolPanelHandler';

const STATSGRID_LAYER_ID = 'STATS_LAYER';

class UIHandler extends ToolPanelHandler {
    constructor (sandbox, tools) {
        super(sandbox, tools);
        this.sandbox = sandbox;
        this.eventHandlers = {
            /**
             * @method AfterMapLayerAddEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerAddEvent} event
             */
            AfterMapLayerAddEvent: function (event) {
                if (event.getMapLayer().getId() === STATSGRID_LAYER_ID) {
                    this.setPanelVisibility(true);
                }
            },

            /**
             * @method AfterMapLayerRemoveEvent
             * @param {Oskari.mapframework.event.common.AfterMapLayerRemoveEvent} event
             */
            AfterMapLayerRemoveEvent: function (event) {
                if (event.getMapLayer().getId() === STATSGRID_LAYER_ID) {
                    this.setPanelVisibility(false);
                }
            }

        };
    }

    init (data) {
        super.init(data);
        Object.getOwnPropertyNames(this.eventHandlers).forEach((event) => {
            this.sandbox.registerForEventByName(this, event);
        });
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
        return 'StatsGridPanelHandler';
    }
}

const wrapped = controllerMixin(UIHandler, [
    'setToolEnabled'
]);

export { wrapped as StatsgridPanelHandler };
