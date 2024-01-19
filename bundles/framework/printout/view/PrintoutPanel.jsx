import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, ThemeProvider } from 'oskari-ui/util';
import { Collapse, Message, Radio, Select, Option } from 'oskari-ui';
import { ButtonContainer, PrimaryButton, SecondaryButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';
import { SCALE_OPTIONS } from '../constants';
import { AdditionalSettings } from './AdditionalSettings';
import { getSizeCollapseItem } from './items/SizeCollapseItem';
import { PanelHeader } from './items/PanelHeader';
export const BUNDLE_KEY = 'Printout';

const Content = styled('div')``;

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

const getCollapseItems = (state, controller, scaleSelection, scaleOptions) => {
    const items = [];
    items.push(getSizeCollapseItem(1, state, controller));

    const basicViewSettings = {
        key: 2,
        label: <PanelHeader headerMsg='BasicView.settings.label' infoMsg='BasicView.settings.tooltip' />,
        children: <AdditionalSettings state={state} controller={controller} />
    };

//    items.push(sizeOptions);
    items.push(basicViewSettings);

    if (scaleSelection) {
        const scaleSelectionItem = {
            key: 3,
            label: <PanelHeader headerMsg='BasicView.scale.label' infoMsg='BasicView.scale.tooltip' />,
            children: <RadioGroup value={state.scaleType}
                onChange={(e) => controller.updateScaleType(e.target.value)}>
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
        };

        items.push(scaleSelectionItem);
    }

    const previewItem = {
        key: 4,
        label: <PanelHeader headerMsg='BasicView.preview.label' />,
        children: <>
            <PreviewImage src={state.previewImage} landscape={state.previewImage && state.previewImage.includes('Landscape')} />
            <Message bundleKey={BUNDLE_KEY} messageKey='BasicView.preview.notes.extent' />
        </>
    };

    items.push(previewItem);
    return items;
};

export const PrintoutPanel = ({ controller, state, onClose, scaleSelection, scaleOptions }) => {
    const [openPanels, setOpenPanels] = useState([1, 2, 3, 4]);
    return (
        <ThemeProvider>
            <Content>
                <Collapse defaultActiveKey={openPanels} onChange={setOpenPanels} items={getCollapseItems(state, controller, scaleSelection, scaleOptions)}/>
                <Actions>
                    <SecondaryButton onClick={onClose} type='cancel' />
                    <PrimaryButton onClick={() => controller.printMap()} type='print' />
                </Actions>
            </Content>
        </ThemeProvider>
    );
};

PrintoutPanel.propTypes = {
    state: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    onClose: PropTypes.func.isRequired,
    scaleSelection: PropTypes.bool,
    scaleOptions: PropTypes.array
};
