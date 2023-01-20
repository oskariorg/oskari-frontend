import React from 'react';
import { SidePanel } from 'oskari-ui/components/SidePanel';
import { Collapse, CollapsePanel, Message, Radio, TextInput, Checkbox } from 'oskari-ui';
import { ButtonContainer, PrimaryButton, SecondaryButton } from 'oskari-ui/components/buttons';
import { InfoIcon } from 'oskari-ui/components/icons';
import styled from 'styled-components';
import { SIZE_OPTIONS, FORMAT_OPTIONS, PAGE_OPTIONS, SCALE_OPTIONS, TIME_OPTION, WINDOW_SIZE, PARAMS } from '../constants';

const BUNDLE_KEY = 'Printout';

const StyledPanelHeader = styled('div')`
    display: inline-flex;
    flex-direction: row;
`;

const RadioGroup = styled(Radio.Group)`
    display: flex;
    flex-direction: column;
`;

const MapTitle = styled('div')`
    display: flex;
    flex-direction: column;
`;

const Info = styled('div')`
    margin-left: 10px;
`;

const Checkboxes = styled('div')`
    display: flex;
    flex-direction: column;
    margin-top: 5px;
`;

const PreviewImage = styled('img')`
    margin: 8px;
    padding: 5px;
    background-color: white;
    border-bottom-color: #C0D0E0;
    border-bottom-style: solid;
    border-bottom-width: 1pt;
    border-top-color: #C0D0E0;
    border-top-style: solid;
    border-top-width: 1pt;
    @include box-shadow(0 0 8px #D0D0D0);
    height: ${props => props.landscape ? '140px' : '290px'};
    width: 200px;
`;

const Actions = styled(ButtonContainer)`
    padding-right: 15px;
`;

const PanelHeader = ({ headerMsg, infoMsg }) => {
    return (
        <StyledPanelHeader>
            <Message bundleKey={BUNDLE_KEY} messageKey={headerMsg} />
            {infoMsg && (
                <Info>  
                    <InfoIcon title={<Message bundleKey={BUNDLE_KEY} messageKey={infoMsg} />} />
                </Info>
            )}
        </StyledPanelHeader>
    );
}

export const PrintoutPanel = ({ controller, state }) => {
    return (
        <SidePanel
            onClose={() => controller.closePanel()}
            title={<Message bundleKey={BUNDLE_KEY} messageKey='BasicView.title' />}
            loading={state.loading}
        >
            <Collapse>
                <CollapsePanel header={<PanelHeader headerMsg='BasicView.size.label' infoMsg='BasicView.size.tooltip' />}>
                    <RadioGroup
                        value={state.size}
                        onChange={(e) => controller.updateField('size', e.target.value)}
                    >
                        {SIZE_OPTIONS?.map(option => (
                            <Radio.Choice value={option.value} key={option.value}>
                                <Message bundleKey={BUNDLE_KEY} messageKey={`BasicView.size.options.${option.value}`} />
                            </Radio.Choice>
                        ))}
                    </RadioGroup>
                </CollapsePanel>
                <CollapsePanel header={<PanelHeader headerMsg='BasicView.settings.label' infoMsg='BasicView.settings.tooltip' />}>
                    <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.format.label' />
                    <RadioGroup
                        value={state.format}
                        onChange={(e) => controller.updateField('format', e.target.value)}
                    >
                        {FORMAT_OPTIONS?.map(option => (
                            <Radio.Choice value={option.mime} key={option.mime}>
                                <Message bundleKey={BUNDLE_KEY} messageKey={`BasicView.format.options.${option.name}`} />
                            </Radio.Choice>
                        ))}
                    </RadioGroup>
                    <MapTitle>
                        <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.content.label' />
                        <TextInput
                            type='text'
                            placeholder={Oskari.getMsg(BUNDLE_KEY, 'BasicView.content.mapTitle.placeholder')}
                            value={state.mapTitle}
                            onChange={(e) => controller.updateField('mapTitle', e.target.value)}
                            disabled={state.format !== 'application/pdf'}
                        />
                    </MapTitle>
                    <Checkboxes>
                        <Checkbox
                            checked={state.showScale}
                            onChange={(e) => controller.updateField('showScale', e.target.checked)}
                            disabled={state.format !== 'application/pdf'}
                        >
                            <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.content.pageScale.label' />
                        </Checkbox>
                        <Checkbox
                            checked={state.showDate}
                            onChange={(e) => controller.updateField('showDate', e.target.checked)}
                            disabled={state.format !== 'application/pdf'}
                        >
                            <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.content.pageDate.label' />
                        </Checkbox>
                    </Checkboxes>
                </CollapsePanel>
                <CollapsePanel header={<PanelHeader headerMsg='BasicView.preview.label' />}>
                    <PreviewImage src={state.previewImage} landscape={state.previewImage && state.previewImage.includes('Landscape')} />
                    <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.preview.notes.extent' />
                </CollapsePanel>
            </Collapse>
            <Actions>
                <SecondaryButton onClick={() => controller.closePanel()} type='cancel' />
                <PrimaryButton onClick={() => controller.printMap()} type='print' />
            </Actions>
        </SidePanel>
    );
};
