import React from 'react';
import { Message } from 'oskari-ui';
import { PublisherSidebarHandler } from '../handler/PublisherSidebarHandler';
import { PublisherPanel } from './PublisherPanel';
import { showSidePanel } from 'oskari-ui/components/window';
import { BUNDLE_KEY } from '../constants';

const PANEL_OPTIONS = {
    id: BUNDLE_KEY,
    width: 382
};

/**
 * @class Oskari.mapframework.bundle.publisher2.view.PublisherSidebar
 * Renders the publishers "publish mode" sidebar view where the user can make
 * selections regarading the map to publish.
 */
class PublisherSidebar {
    constructor (instance) {
        this.instance = instance;
        this.normalMapPlugins = [];
        this.panels = [];
        this.handler = new PublisherSidebarHandler(instance);
        this.handler.addStateListener(state => this.panelControls?.update(state));
        this.panelControls = null;
    }

    showPanel () {
        if (this.panelControls) {
            return;
        }

        const statesById = this.handler.getState();
        const controller = this.handler.getController();
        const isEdit = this.handler.isEdit();
        const panels = this.handler.getPanels();
        const title = <Message bundleKey={BUNDLE_KEY} messageKey={`BasicView.${isEdit ? 'titleEdit' : 'title'}`} />;
        const onClose = () => this.cancel();
        // TODO: don't spread state ??
        const controls = showSidePanel(
            title,
            <PublisherPanel {...statesById} panels={panels} isEdit={isEdit} controller={controller} onClose={ onClose } />,
            onClose,
            PANEL_OPTIONS
        );

        this.panelControls = {
            ...controls,
            update: statesById => controls.update(title, <PublisherPanel {...statesById} panels={panels} isEdit={isEdit} controller={controller} onClose={ onClose } />)
        };
    }

    /**
     * @method setPublishModeImpl
     * "Activates" the published map preview when enabled
     * and returns to normal mode on disable
     *
     * @param {Boolean} isEnabled true to enable preview, false to disable preview
     * @param {Object} data publisher data
     *
     */
    setPublishModeImpl (isEnabled, data) {
        if (isEnabled) {
            this.handler.init(data);
            this.showPanel();
            // deprecated, store data for backwards compatibility
            this.data = data;
        } else {
            this.handler.stop();
            this.panelControls?.close();
            this.panelControls = null;
        }
    }

    /**
     * @method cancel
     * Closes publisher without saving
     */
    cancel () {
        this.instance.setPublishMode(false);
    }

    /**
    * Gather selections.
    * @method gatherSelections
    * @private
    */
    gatherSelections () {
        Oskari.log('PublisherSidebar').deprecated('gatherSelections', 'Please use instance.getAppSetupToPublish(blnValidate) instead.');
        return this.instance.getAppSetupToPublish(true);
    }
}

Oskari.clazz.defineES('Oskari.mapframework.bundle.publisher2.view.PublisherSidebar',
    PublisherSidebar
);

export { PublisherSidebar };
