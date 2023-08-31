import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller } from 'oskari-ui/util';
import { Collapse, CollapsePanel, Message, Radio, Select, Option } from 'oskari-ui';
import { ButtonContainer, PrimaryButton, SecondaryButton } from 'oskari-ui/components/buttons';
import { InfoIcon } from 'oskari-ui/components/icons';
import styled from 'styled-components';
import { SIZE_OPTIONS, SCALE_OPTIONS } from '../constants';
import { AdditionalSettings } from './AdditionalSettings';

const BUNDLE_KEY = 'Printout';

const Content = styled('div')``;

const StyledPanelHeader = styled('div')`
    display: inline-flex;
    flex-direction: row;
    font-weight: bold;
`;

const RadioGroup = styled(Radio.Group)`
    display: flex;
    flex-direction: column;
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
    box-shadow: 0 0 8px #D0D0D0;
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
            {infoMsg && <InfoIcon title={<Message bundleKey={BUNDLE_KEY} messageKey={infoMsg} />} /> }
        </StyledPanelHeader>
    );
}

export const PrintoutPanel = ({ controller, state, onClose, scaleSelection, scaleOptions }) => {
    const [openPanels, setOpenPanels] = useState([1, 2, 3, 4]);
    return (
        <Content>
            <Collapse defaultActiveKey={openPanels} onChange={setOpenPanels}>
                <CollapsePanel header={<PanelHeader headerMsg='BasicView.size.label' infoMsg='BasicView.size.tooltip' />} key={1}>
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
                <CollapsePanel header={<PanelHeader headerMsg='BasicView.settings.label' infoMsg='BasicView.settings.tooltip' />} key={2}>
                    <AdditionalSettings state={state} controller={controller} />
                </CollapsePanel>
                {scaleSelection && (
                    <CollapsePanel header={<PanelHeader headerMsg='BasicView.scale.label' infoMsg='BasicView.scale.tooltip' />} key={3}>
                        <RadioGroup
                            value={state.scaleType}
                            onChange={(e) => controller.updateScaleType(e.target.value)}
                        >
                            {SCALE_OPTIONS?.map(option => (
                                <Radio.Choice value={option} key={option}>
                                    <Message bundleKey={BUNDLE_KEY} messageKey={`BasicView.scale.${option}`} />
                                </Radio.Choice>
                            ))}
                            {state.scaleType === 'configured' && (
                                <Select
                                    value={state.scale}
                                    onChange={(val) => controller.updateField('scale', val)}
                                >
                                    {scaleOptions?.map(option => (
                                        <Option value={option} key={option}>
                                            {`1:${option}`}
                                        </Option>
                                    ))}
                                </Select>
                            )}
                        </RadioGroup>
                    </CollapsePanel>
                )}
                <CollapsePanel header={<PanelHeader headerMsg='BasicView.preview.label' />} key={4}>
                    <PreviewImage src={state.previewImage} landscape={state.previewImage && state.previewImage.includes('Landscape')} />
                    <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.preview.notes.extent' />
                </CollapsePanel>
            </Collapse>
            <Actions>
                <SecondaryButton onClick={onClose} type='cancel' />
                <PrimaryButton onClick={() => controller.printMap()} type='print' />
            </Actions>
        </Content>
    );
};

PrintoutPanel.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    onClose: PropTypes.func.isRequired,
    scaleSelection: PropTypes.bool,
    scaleOptions: PropTypes.array
};
