import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Controller, ThemeProvider } from 'oskari-ui/util';
import { Collapse, Radio } from 'oskari-ui';
import { ButtonContainer, PrimaryButton, SecondaryButton } from 'oskari-ui/components/buttons';
import styled from 'styled-components';
import { getSizeCollapseItem } from './items/SizeCollapseItem';
import { getBasicViewCollapseItem } from './items/BasicViewSettingsCollapseItem';
import { getScaleSelectionItem } from './items/ScaleSelectionCollapseItem';
import { getPreviewCollapseItem } from './items/PreviewCollapseItem';

export const BUNDLE_KEY = 'Printout';

export const RadioGroup = styled(Radio.Group)`
    display: flex;
    flex-direction: column;
`;

const Content = styled('div')``;

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

    items.push(getPreviewCollapseItem(4, state));
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
