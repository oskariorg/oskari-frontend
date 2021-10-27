import React from 'react';
import ReactDOM from 'react-dom';
import { MetadataContent } from './MetadataContent';
import { LocaleProvider } from 'oskari-ui/util';

const Popup = Oskari.clazz.get('Oskari.userinterface.component.Popup');

export class MetadataPopup extends Popup {
    constructor () {
        super();
        this.loc = Oskari.getMsg.bind(null, 'StatsGrid');
        this.service = Oskari.getSandbox().getService('Oskari.statistics.statsgrid.StatisticsService');
        this._counter = 0;
        this.datasource = null;
        this.indicators = null;
        this._accordions = [];

        this.onClose(() => this._contentSizeChanged(false));
    }

    /**
     * @override
     * @method show
    */
    show (datasource, indicators) {
        this._counter = 0;
        this.datasource = datasource;
        this.indicators = Array.isArray(indicators) ? indicators : indicators ? [indicators] : [];
        this._accordions = [];
        if (this.indicators.length === 0 || !this.datasource) {
            return;
        }
        const createAccordion = this._createAccordion.bind(this);
        this.indicators.forEach(ind => this.service.getIndicatorMetadata(this.datasource, ind, createAccordion));
    }

    /**
     *  @method _count
     * Increases processed indicator counter.
     * Once all indicators have been processed, popup will open.
    */
    _count () {
        this._counter++;
        if (this._counter >= this.indicators.length) {
            this._openPopup();
        }
    }

    /**
     * @method _createAccordion
     * IndicatorMetadata callback function.
     * Creates Accordion from metadata's title, description and source.
     */
    _createAccordion (err, metadata) {
        if (err || !metadata) {
            this._count();
            return;
        }

        const accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
        const panel = Oskari.clazz.create('Oskari.userinterface.component.AccordionPanel');
        panel.setTitle(Oskari.getLocalized(metadata.name));
        accordion.addPanel(panel);
        this._accordions.push(accordion);
        
        ReactDOM.render(<LocaleProvider value={{ bundleKey: 'StatsGrid' }}>
            <MetadataContent
                description={metadata.description}
                source={metadata.source}
                metadata={metadata.metadata}
                 />
        </LocaleProvider>, panel.getContainer()[0]);

        panel.on('open', () => this._contentSizeChanged(true));
        panel.on('close', () => this._contentSizeChanged(false));
        this._count();
    }

    _openPopup () {
        const container = jQuery('<div>');
        if (this._accordions.length === 0) {
            container.html(this.loc('metadataPopup.noMetadata', { indicators: this.indicators.length }));
        } else {
            const content = this.getJqueryContent();
            if (!content.hasClass('indicator-metadata')) {
                content.addClass('indicator-metadata');
            };
            this._accordions.forEach(accordion => accordion.insertTo(container));
            // Open the last panel
            this._accordions[this._accordions.length - 1].getPanels()[0].open();
        }
        const btn = this.createCloseButton();
        btn.setPrimary(true);
        const title = this.loc('metadataPopup.title', { indicators: this._accordions.length });
        super.show(title, container, [btn]);
    }

    /**
     * @method _contentSizeChanged
     * Handles content height changes and centers the dialog.
     * @param {boolean} higher true, if the change makes the dialog higher
     */
    _contentSizeChanged (higher) {
        if (higher) {
            this._setReasonableHeight();
        } else {
            const contentDiv = this.getJqueryContent();
            if (contentDiv.height() > contentDiv.children().height()) {
                contentDiv.height('auto');
            }
        }
        this._centralize();
    };
};
