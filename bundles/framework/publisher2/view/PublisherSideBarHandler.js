import React from 'react';
import { showModal } from 'oskari-ui/components/window';
import { ValidationErrorMessage } from './dialog/ValidationErrorMessage';
import { ReplaceConfirmDialogContent } from './dialog/ReplaceConfirmDialogContent';
import { StateHandler, controllerMixin } from 'oskari-ui/util';

class PublisherSidebarUIHandler extends StateHandler {
    constructor () {
        super();
        this.validationErrorMessageDialog = null;
        this.replaceConfirmDialog = null;
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
    'closeReplaceConfirm'
]);

export { wrapped as PublisherSidebarHandler };
