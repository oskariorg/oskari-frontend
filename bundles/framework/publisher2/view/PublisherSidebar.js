import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider, LocaleProvider, Messaging } from 'oskari-ui/util';
import { Header, Button, Message } from 'oskari-ui';
import styled from 'styled-components';
import { mergeValues } from '../util/util';
import { PublisherSidebarHandler } from './PublisherSideBarHandler';
import { ButtonContainer } from './dialog/Styled';
import { SecondaryButton } from 'oskari-ui/components/buttons';
import { CollapseContent } from './CollapseContent';

const StyledHeader = styled(Header)`
    padding: 15px 15px 10px 10px;
`;

const CollapseWrapper = styled('div')`
    margin: 0.25em;
    overflow-y: auto;
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
        this.panels = [];
        this.handler = new PublisherSidebarHandler();
    }

    render (container) {
        this.mainPanel = container;
        // TODO: implement an init of somekind for publishersidebar.
        // If we do handler init in constructor bad things will happen because the whole enabling/disabling plugins roulette is still on it's way,
        // but I can see this here getting refactored out of render pretty quickly...
        this.publisherTools = this.createToolGroupings();
        this.handler.init(this.data, this.publisherTools);
        const content = <LocaleProvider value={{ bundleKey: 'Publisher2' }}>
            <ThemeProvider>
                <div className='basic_publisher'>
                    <StyledHeader
                        title={this.data.uuid ? this.localization?.titleEdit : this.localization?.title}
                        onClose={() => this.cancel()}
                    />
                    <CollapseWrapper>
                        <CollapseContent controller={this.handler}/>
                    </CollapseWrapper>
                    <ButtonContainer>
                        <SecondaryButton type='cancel' onClick={() => this.cancel()}/>
                        <Button type='primary' onClick={() => this.saveAsNew()}>
                            { this.data?.uuid ? <Message messageKey='BasicView.buttons.saveNew'/> : <Message messageKey='BasicView.buttons.save'/> }
                        </Button>
                        { this.data?.uuid && <Button type='primary' onClick={() => this.confirmReplace()}><Message messageKey='BasicView.buttons.replace'/></Button> }

                    </ButtonContainer>
                </div>
            </ThemeProvider>
        </LocaleProvider>;

        ReactDOM.render(content, container[0]);
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
     * @private @method _stopEditorPanels
     */
    stopEditorPanels () {
        this.panels.forEach(function (panel) {
            if (typeof panel.stop === 'function') {
                panel.stop();
            }
        });
        this.handler.stop();
    }

    /**
     * @method cancel
     * Closes publisher without saving
     */
    cancel () {
        this.instance.setPublishMode(false);
    }

    confirmReplace () {
        this.handler.showReplaceConfirm(() => this.save());
    }

    save () {
        const selections = this.gatherSelections();
        if (selections) {
            this.stopEditorPanels();
            this.publishMap(selections);
        }
    }

    saveAsNew () {
        if (this.data?.uuid) {
            this.data.uuid = null;
            delete this.data.uuid;
        }
        this.save();
    }

    /**
    * Gather selections.
    * @method gatherSelections
    * @private
    */
    gatherSelections () {
        const sandbox = this.instance.getSandbox();
        let errors = [];

        const mapFullState = sandbox.getStatefulComponents().mapfull.getState();
        let selections = {
            configuration: {
                mapfull: {
                    state: mapFullState
                }
            }
        };

        this.panels.forEach((panel) => {
            if (typeof panel.validate === 'function') {
                errors = errors.concat(panel.validate());
            }
            selections = mergeValues(selections, panel.getValues());
        });

        errors = errors.concat(this.handler.validate());
        selections = mergeValues(selections, this.handler.getValues());

        if (errors.length > 0) {
            this.handler.showValidationErrorMessage(errors);
            return null;
        }
        return selections;
    }

    /**
     * @private @method publishMap
     * Sends the gathered map data to the server to save them/publish the map.
     *
     * @param {Object} selections map data as returned by gatherSelections()
     *
     */
    publishMap (selections) {
        const me = this;
        const sandbox = this.instance.getSandbox();
        const errorHandler = () => {
            const dialog = Oskari.clazz.create('Oskari.userinterface.component.Popup');
            const okBtn = dialog.createCloseButton(this.localization.buttons.ok);
            dialog.show(this.localization.error.title, this.localization.error.saveFailed, [okBtn]);
        };

        // make the ajax call
        jQuery.ajax({
            url: Oskari.urls.getRoute('AppSetup'),
            type: 'POST',
            dataType: 'json',
            data: {
                publishedFrom: Oskari.app.getUuid(),
                uuid: (this.data && this.data.uuid) ? this.data.uuid : undefined,
                pubdata: JSON.stringify(selections)
            },
            success: function (response) {
                if (response.id > 0) {
                    const event = Oskari.eventBuilder(
                        'Publisher.MapPublishedEvent'
                    )(
                        response.id,
                        selections.metadata.size?.width,
                        selections.metadata.size?.height,
                        response.lang,
                        sandbox.createURL(response.url)
                    );

                    me.stopEditorPanels();
                    sandbox.notifyAll(event);
                } else {
                    errorHandler();
                }
            },
            error: errorHandler
        });
    }

    destroy () {
        // TODO: this is still jQueryish. Make it not be.
        this.mainPanel.remove();
    }
}

Oskari.clazz.defineES('Oskari.mapframework.bundle.publisher2.view.PublisherSidebar',
    PublisherSidebar
);

export { PublisherSidebar };
