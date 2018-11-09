import ManualClassificationEditor from './ManualClassificationEditor';
import equalSizeBands from '../util/equalSizeBands';

const loc = Oskari.getMsg.bind(null, 'StatsGrid');

export default class ManualClassificationHandler {
    constructor (classificationOpts) {
        if (classificationOpts.method !== 'manual') {
            return;
        }
        this.classCount = classificationOpts.count;
        this.manualBounds = classificationOpts.manualBounds;
    }
    setData (indicatorData) {
        this.indicatorData = Object.values(indicatorData);
    }
    /**
     * @method getBounds
     * @return {Number[]} bounds
     */
    getBounds () {
        return this.manualBounds;
    }

    /**
     * @method openEditor
     * @param {Function} okCallback 
     */
    openEditor (okCallback) {
        let editedBounds;

        const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');

        const okButton = Oskari.clazz.create('Oskari.userinterface.component.buttons.SaveButton');
        okButton.setHandler(() => {
            dialog.close();
            this.manualBounds = editedBounds;
            okCallback();
        });
        const buttons = [dialog.createCloseButton(), okButton];
        const content = jQuery('<div></div>');

        editedBounds = this.manualBounds || equalSizeBands(this.classCount, d3.min(this.indicatorData), d3.max(this.indicatorData));

        const editor = new ManualClassificationEditor(content.get(0), this.classCount, editedBounds, this.indicatorData, (bounds) => {
            editedBounds = bounds;
        });

        dialog.makeModal();
        dialog.show(loc('classify.editClassifyTitle'), content, buttons);
    }
}
