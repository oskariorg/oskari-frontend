import React from 'react';
import ReactDOM from 'react-dom';
import { Messaging } from 'oskari-ui/util';
import { Header } from 'oskari-ui';
import styled from 'styled-components';

const StyledHeader = styled(Header)`
    padding: 15px 15px 10px 10px;
`;

/**
 * @class Oskari.mapframework.bundle.publisher2.view.PublisherSidebar
 * Renders the publishers "publish mode" sidebar view where the user can make
 * selections regarading the map to publish.
 */
class PublisherSidebar {
    constructor (instance, localization, data) {
        this.instance = instance;
        this.localization = localization;
        this.data = data;
        this.normalMapPlugins = [];
        this.progressSpinner = Oskari.clazz.create('Oskari.userinterface.component.ProgressSpinner');
    }

    render (container) {
        const contentDOMNode = jQuery('<div>' +
            '<div class="header"></div>' +
            '<div class="content"></div>' +
        '</div>');
        container.prepend(contentDOMNode);

        const accordion = Oskari.clazz.create('Oskari.userinterface.component.Accordion');
        const generalInfoPanel = this.createGeneralInfoPanel();
        accordion.addPanel(generalInfoPanel.getPanel());
        const accordionContainerDiv = contentDOMNode.find('div.content');
        accordion.insertTo(accordionContainerDiv);

        const header = <StyledHeader
            title={this.data.uuid ? this.localization?.titleEdit : this.localization?.title}
            onClose={() => this.cancel()}
        />;

        ReactDOM.render(header, contentDOMNode.find('div.header')[0]);
    }

    /**
     * @method setEnabled
     * "Activates" the published map preview when enabled
     * and returns to normal mode on disable
     *
     * @param {Boolean} isEnabled true to enable preview, false to disable
     * preview
     *
     */
    setEnabled (isEnabled) {
        if (isEnabled) {
            this.enablePreview();
        } else {
            this.stopEditorPanels();
            this.disablePreview();
        }
    }

    /**
     * @private @method _enablePreview
     * Modifies the main map to show what the published map would look like
     *
     *
     */
    enablePreview () {
        const sandbox = this.instance.sandbox;
        const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        Object.values(mapModule.getPluginInstances())
            .filter(plugin => plugin.isShouldStopForPublisher && plugin.isShouldStopForPublisher())
            .forEach(plugin => {
                try {
                    plugin.stopPlugin(sandbox);
                    mapModule.unregisterPlugin(plugin);
                    this.normalMapPlugins.push(plugin);
                } catch (err) {
                    Oskari.log('Publisher').error('Enable preview', err);
                    Messaging.error(this.loc.error.enablePreview);
                }
            });
    }

    /**
     * @private @method _disablePreview
     * Returns the main map from preview to normal state
     *
     */
    disablePreview () {
        const sandbox = this.instance.sandbox;
        const mapModule = sandbox.findRegisteredModuleInstance('MainMapModule');
        // resume normal plugins
        this.normalMapPlugins.forEach(plugin => {
            mapModule.registerPlugin(plugin);
            plugin.startPlugin(sandbox);
            if (plugin.refresh) {
                plugin.refresh();
            }
        });
        // reset listing
        this.normalMapPlugins = [];
    }

    /**
     * @private @method _stopEditorPanels
     */
    stopEditorPanels () {
        this.panels.forEach(function (panel) {
            if (typeof panel.stop === 'function') {
                panel.stop();
            }
        });
    }

    /**
     * @method cancel
     * Closes publisher without saving
     */
    cancel () {
        this.instance.setPublishMode(false);
    }

    /**
     * @private @method _createGeneralInfoPanel
     * Creates the Location panel of publisher
     */
    createGeneralInfoPanel (data) {
        const sandbox = this.instance.getSandbox();
        const form = Oskari.clazz.create(
            'Oskari.mapframework.bundle.publisher2.view.PanelGeneralInfo',
            sandbox, this.localization
        );

        // initialize form (restore data when editing)
        form.init(this.data);
        // open generic info by default
        form.getPanel().open();
        return form;
    }
}

Oskari.clazz.defineES('Oskari.mapframework.bundle.publisher2.view.PublisherSidebar',
    PublisherSidebar
);

export { PublisherSidebar };
