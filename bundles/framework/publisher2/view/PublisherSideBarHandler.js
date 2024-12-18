import React from 'react';
import { showModal } from 'oskari-ui/components/window';
import { ValidationErrorMessage } from './dialog/ValidationErrorMessage';
import { ReplaceConfirmDialogContent } from './dialog/ReplaceConfirmDialogContent';
import { StateHandler, controllerMixin } from 'oskari-ui/util';
import { GeneralInfoForm } from './form/GeneralInfoForm';
import { PanelGeneralInfoHandler } from '../handler/PanelGeneralInfoHandler';

export const PUBLISHER_BUNDLE_ID = 'Publisher2';
const PANEL_GENERAL_INFO_ID = 'panelGeneralInfo';

class PublisherSidebarUIHandler extends StateHandler {
    constructor () {
        super();
        this.validationErrorMessageDialog = null;
        this.replaceConfirmDialog = null;

        this.generalInfoPanelHandler = new PanelGeneralInfoHandler();
        this.generalInfoPanelHandler.addStateListener(() => this.updateGeneralInfoPanel());

        const collapseItems = [];

        collapseItems.push({
            key: PANEL_GENERAL_INFO_ID,
            label: Oskari.getMsg('Publisher2', 'BasicView.domain.title'),
            children: this.renderGeneralInfoPanel()
        });

        this.state = {
            collapseItems
        };
    }

    updateGeneralInfoPanel () {
        const newCollapseItems = this.getState().collapseItems.map(item => item);
        const generalInfoPanel = newCollapseItems.find(item => item.key === PANEL_GENERAL_INFO_ID);
        generalInfoPanel.children = this.renderGeneralInfoPanel();
        this.updateState({
            collapseItems: newCollapseItems
        });
    }

    renderGeneralInfoPanel () {
        return <div className={'t_generalInfo'}>
            <GeneralInfoForm
                onChange={(key, value) => this.generalInfoPanelHandler.onChange(key, value)}
                data={this.generalInfoPanelHandler.getState()}
            />
        </div>;
    }

    getCollapseItems () {
        const { collapseItems } = this.getState();
        return collapseItems;
    }

    init (data) {
        /** general info - panel */
        this.generalInfoPanelHandler.init(data);
    }

    getValues () {
        return {
            metadata: {
                ...this.generalInfoPanelHandler.getState()
            }
        };
    }

    validate () {
        let errors = [];
        errors = errors.concat(this.generalInfoPanelHandler.validate());
        return errors;
    }

    stop () {
        // TODO: stop individual panels that need stopping,
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
        const content = <ValidationErrorMessage errors={errors} closeCallback={() => this.closeValidationErrorMessage()}/>;
        this.validationErrorMessageDialog = showModal(Oskari.getMsg('Publisher2', 'BasicView.error.title'), content, () => {
            this.validationErrorMessageDialog = null;
        });
    };

    closeValidationErrorMessage () {
        if (this.validationErrorMessageDialog) {
            this.validationErrorMessageDialog.close();
            this.validationErrorMessageDialog = null;
        }
    }

    /**
     * @private @method showReplaceConfirm
     * Shows a confirm dialog for replacing published map
     *
     * @param {Function} continueCallback function to call if the user confirms
     *
     */
    showReplaceConfirm (continueCallback) {
        const content = <ReplaceConfirmDialogContent
            okCallback={() => {
                continueCallback();
                this.closeReplaceConfirm();
            }}
            closeCallback={() => this.closeReplaceConfirm()}/>;

        this.replaceConfirmDialog = showModal(Oskari.getMsg('Publisher2', 'BasicView.confirm.replace.title'), content);
    }

    closeReplaceConfirm () {
        if (this.replaceConfirmDialog) {
            this.replaceConfirmDialog.close();
            this.replaceConfirmDialog = null;
        }
    }
}

const wrapped = controllerMixin(PublisherSidebarUIHandler, [
    'showValidationErrorMessage',
    'closeValidationErrorMessage',
    'showReplaceConfirm',
    'closeReplaceConfirm',
    'validate',
    'getValues',
    'getCollapseItems',
    'stop'
]);

export { wrapped as PublisherSidebarHandler };
