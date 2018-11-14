import manualClassificationEditor from './editor';
import '../../resources/scss/manualClassification.scss';

const loc = Oskari.getMsg.bind(null, 'StatsGrid');

export default class ManualClassificationView {
    constructor (classificationService, colorService, classificationOpts) {
        this.classificationService = classificationService;
        this.colorService = colorService;
        if (classificationOpts.method !== 'manual') {
            return;
        }
        this.classificationOpts = classificationOpts;
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
        const content = jQuery('<div class="manual-class-view"></div>');
        const count = this.classificationOpts.count;

        editedBounds = this.classificationService.getBoundsFallback(this.manualBounds, count, d3.min(this.indicatorData), d3.max(this.indicatorData));

        const colorSet = this.colorService.getColorsForClassification(this.classificationOpts);

        manualClassificationEditor(content.get(0), editedBounds, this.indicatorData, colorSet, (bounds) => {
            editedBounds = bounds;
        });

        dialog.makeModal();
        dialog.show(loc('classify.editClassifyTitle'), content, buttons);
        content.parent().css('margin', '10px 0');
    }
}
