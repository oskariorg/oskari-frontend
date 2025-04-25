import React from 'react';
import { showModal } from 'oskari-ui/components/window';
import { ValidationErrorMessage } from '../view/dialog/ValidationErrorMessage';
import { ReplaceConfirmDialogContent } from '../view//dialog/ReplaceConfirmDialogContent';
import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';

import { mergeValues } from '../util/util';
import { BUNDLE_KEY } from '../constants';

import { PanelGeneralInfoHandler } from '../handler/PanelGeneralInfoHandler';
import { PanelMapPreviewHandler, CUSTOM_MAP_SIZE_LIMITS } from '../handler/PanelMapPreviewHandler';
import { PanelMapLayersHandler } from '../handler/PanelMapLayersHandler';
import { ToolPanelHandler } from '../handler/ToolPanelHandler';
import { PanelLayoutHandler } from '../handler/PanelLayoutHandler';
import { PanelToolLayoutHandler } from '../handler/PanelToolLayoutHandler';

export const PANEL_GENERAL_INFO_ID = 'generalInfo';

// id has to be same than in localization or tool group
// Panel extra is rendered if loc.{id}.tooltip exists
// AbstractPublisherPanel getPanel returns similiar object
const PANELS = [
    { id: 'generalInfo', HandlerImpl: PanelGeneralInfoHandler },
    { id: 'mapPreview', HandlerImpl: PanelMapPreviewHandler, tooltipArgs: CUSTOM_MAP_SIZE_LIMITS },
    { id: 'layers', HandlerImpl: PanelMapLayersHandler },
    { id: 'tools', HandlerImpl: ToolPanelHandler },
    { id: 'layout', HandlerImpl: PanelLayoutHandler },
    { id: 'toolLayout', HandlerImpl: PanelToolLayoutHandler },
    { id: 'rpc', HandlerImpl: ToolPanelHandler }
];

class PublisherSidebarUIHandler extends StateHandler {
    constructor (instance) {
        super();
        this.log = Oskari.log('PublisherSidebarUIHandler');
        this.validationErrorMessageDialog = null;
        this.replaceConfirmDialog = null;
        this.sandbox = instance.getSandbox();
        this.service = instance.getService();
        this.loc = instance.loc;
        this.panels = []; // [{ id, label, tooltip, handler }]
        this.uuid = null;
    }

    getSandbox () {
        return this.sandbox;
    }

    init (data) {
        this.uuid = data.uuid;

        const toolGroups = this.service.createToolGroupings();
        const getTools = groupId => groupId === 'toolLayout' ? Object.values(toolGroups).flat() : toolGroups[groupId];

        this.panels = PANELS.map(({ id, HandlerImpl, tooltipArgs }) => {
            const handler = new HandlerImpl(this.sandbox, getTools(id));
            const label = this.loc(`BasicView.${id}.label`);
            const tooltip = this.loc(`BasicView.${id}.tooltip`, tooltipArgs, null);
            return { id, label, tooltip, handler };
        });
        const reservedGroups = PANELS.map(panel => panel.id);
        this.service.createExtraPanels().forEach(({ id, HandlerImpl, ...rest }) => {
            if (reservedGroups.includes(id)) {
                this.log.warn(`Panel for "${id}" already created. Skipping`);
                return;
            }
            const handler = new HandlerImpl(this.sandbox, getTools(id));
            this.panels.push({ id, handler, ...rest });
        });

        /* --- deprecated ---> */
        const handledGroups = this.panels.map(p => p.id);
        const extraGroups = Object.keys(toolGroups).filter(group => !handledGroups.includes(group));
        extraGroups.forEach(id => {
            this.log.warn('Creating panels for own tool group will be removed in future release. Implement panel for own tools');
            const tools = getTools(id);
            const { label, tooltip } = Oskari.getMsg(BUNDLE_KEY, `BasicView.${id}`, null, {});
            if (!label) {
                this.log.warn(`No label for "${id}" group, skipping!`);
                return;
            }
            const handler = new ToolPanelHandler(this.sandbox, tools);
            this.panels.push({ id, label, tooltip, handler });
        });
        /* <--- deprecated --- */

        this.panels.forEach(({ id, handler }) => {
            handler.init(data);
            handler.addStateListener(state => this.updateState({ [id]: state }));
            // this.updateState({ [id]: handler.getState() });
        });
        const state = this.panels.reduce((state, panel) => ({ ...state, [panel.id]: panel.handler.getState() }), {});
        this.updateState(state);
    }

    getPanels () {
        return this.panels;
    }

    isEdit () {
        return !!this.uuid;
    }

    getAppSetupToPublish () {
        const { mapfull } = this.sandbox.getStatefulComponents();
        const appSetup = {
            configuration: {
                mapfull: {
                    state: mapfull.getState()
                }
            }
        };
        return this.panels
            .filter(({ handler }) => typeof handler.getValues === 'function')
            .reduce((values, { handler }) => mergeValues(values, handler.getValues()), appSetup);
    }

    validate () {
        return this.panels
            .filter(({ handler }) => typeof handler.validate === 'function')
            .map(({ handler }) => handler.validate())
            .flat();
    }

    stop () {
        this.panels
            .filter(({ handler }) => typeof handler.stop === 'function')
            .forEach(({ handler }) => handler.stop());
    }

    /**
     * @private @method showValidationErrorMessage
     * Takes an error array as defined by Oskari.userinterface.component.FormInput validate() and
     * shows the errors on a  Oskari.userinterface.component.Popup
     *
     * @param {Object[]} errors validation error objects to show
     *
     */
    showValidationErrorMessage (errors = []) {
        const title = this.loc('BasicView.error.title');
        const onClose = () => this.closeValidationErrorMessage();
        // TODO: move to jsx
        const content = <ValidationErrorMessage errors={errors} closeCallback={onClose}/>;
        this.validationErrorMessageDialog = showModal(title, content, onClose);
    };

    closeValidationErrorMessage () {
        if (this.validationErrorMessageDialog) {
            this.validationErrorMessageDialog.close();
        }
        this.validationErrorMessageDialog = null;
    }

    /**
     * @private @method showReplaceConfirm
     * Shows a confirm dialog for replacing published map
     *
     */
    showReplaceConfirm () {
        const title = this.loc('BasicView.confirm.replace.title');
        // TODO: move to jsx
        const content = <ReplaceConfirmDialogContent
            okCallback={() => {
                this.publishMap(false);
                this.closeReplaceConfirm();
            }}
            closeCallback={() => this.closeReplaceConfirm()}/>;

        this.replaceConfirmDialog = showModal(title, content);
    }

    closeReplaceConfirm () {
        if (this.replaceConfirmDialog) {
            this.replaceConfirmDialog.close();
        }
        this.replaceConfirmDialog = null;
    }

    save (asNew) {
        const errors = this.validate();
        if (errors.length) {
            this.showValidationErrorMessage(errors);
            return;
        }
        if (this.uuid && !asNew) {
            this.showReplaceConfirm();
            return;
        }
        this.publishMap(asNew);
    }

    publishMap (asNew) {
        const appSetup = this.getAppSetupToPublish();
        const payload = {
            publishedFrom: Oskari.app.getUuid(),
            pubdata: JSON.stringify(appSetup)
        };
        if (this.uuid && !asNew) {
            payload.uuid = this.uuid;
        }

        fetch(Oskari.urls.getRoute('AppSetup'), {
            method: 'POST',
            headers: {
                Accept: 'application/json'
            },
            body: new URLSearchParams(payload)
        }).then(response => {
            if (!response.ok) {
                throw new Error(response.statusText);
            }
            return response.json();
        }).then(response => {
            this.notifyPublished(response, appSetup);
        }).catch(() => {
            Messaging.error(this.loc('BasicView.error.saveFailed'));
        });
    }

    notifyPublished (response, appSetup) {
        const { id, lang, url } = response;
        const { width, height } = appSetup.metadata.size || {};
        const builder = Oskari.eventBuilder('Publisher.MapPublishedEvent');
        const event = builder(id, width, height, lang, url);
        this.sandbox.notifyAll(event);
    }
}

const wrapped = controllerMixin(PublisherSidebarUIHandler, [
    'showValidationErrorMessage',
    'closeValidationErrorMessage',
    'showReplaceConfirm',
    'closeReplaceConfirm',
    'save'
]);

export { wrapped as PublisherSidebarHandler };
