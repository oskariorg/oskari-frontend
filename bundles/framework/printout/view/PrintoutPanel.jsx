import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, ThemeProvider } from 'oskari-ui/util';
import { Collapse, Message, Radio, Select, Option } from 'oskari-ui';
import { ButtonContainer, PrimaryButton, SecondaryButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';
import { PanelHeader } from './items/PanelHeader';
import { getSizeCollapseItem } from './items/SizeCollapseItem';
import { getBasicViewCollapseItem } from './items/BasicViewSettingsCollapseItem';
import { getScaleSelectionItem } from './items/ScaleSelectionCollapseItem';

export const BUNDLE_KEY = 'Printout';

export const RadioGroup = styled(Radio.Group)`
    display: flex;
    flex-direction: column;
`;

const Content = styled('div')``;

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
    items.push(getBasicViewCollapseItem(2, state, controller));

    if (scaleSelection) {
        items.push(getScaleSelectionItem(3, state, controller, scaleOptions));
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
