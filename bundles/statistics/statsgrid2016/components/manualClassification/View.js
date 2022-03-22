import { manualClassificationEditor } from './editor';
import '../../resources/scss/manualClassification.scss';

/**
 * @method openEditor
 * Open popup with manual classification editor
 * @param {Function} okCallback function that is called when user clicks ok button
 */
export const openEditor = (data, bounds, colors, okCallback) => {
    let editedBounds;

    const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

    const okButton = Oskari.clazz.create('Oskari.userinterface.component.buttons.SaveButton');
    okButton.setHandler(() => {
        dialog.close();
        okCallback(editedBounds);
    });
    const buttons = [dialog.createCloseButton(), okButton];
    const content = jQuery('<div class="manual-class-view"></div>');

    manualClassificationEditor(content.get(0), bounds, data, colors, (bounds) => {
        editedBounds = bounds;
    });

    dialog.makeModal();
    const title = Oskari.getMsg('StatsGrid', 'classify.edit.title');
    dialog.show(title, content, buttons);
    content.parent().css('margin', '10px 0');
};
