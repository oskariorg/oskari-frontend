import React from 'react';
import { showPopup, getNavigationDimensions, PLACEMENTS } from 'oskari-ui/components/window';
import { ButtonContainer, SecondaryButton, PrimaryButton } from 'oskari-ui/components/buttons';
import { Message, Button, Radio, Tooltip } from 'oskari-ui';
import styled from 'styled-components';

const BUNDLE_NAME = 'FeatureData2';
const StyledContent = styled('div')`
    width: 300px;
    margin: 12px 24px 24px;
`;
const DrawOptions = styled('div')`
    display: flex;
    flex-direction: row;
    margin-bottom: 15px;
`;
const DrawOption = styled('div')`
    cursor: pointer;
`;

const PopupContent = ({ selectedTool, selectFromAll, drawTools, clearSelections, setSelectFromAll, onClose }) => {
    return (
        <StyledContent>
            <DrawOptions>
                {Object.keys(drawTools).map(key => {
                    return (
                        <Tooltip key={key} title={drawTools[key].tooltip}>
                            <DrawOption
                                className={selectedTool === key ? `${drawTools[key].iconCls} tool active` : drawTools[key].iconCls}
                                onClick={drawTools[key].callback}
                            />
                        </Tooltip>
                    );
                })}
            </DrawOptions>
            <Radio.Group
                value={selectFromAll}
                onChange={(e) => setSelectFromAll(e.target.value)}
            >
                <Radio.Choice value={false}>
                    <Message bundleKey={BUNDLE_NAME} messageKey={'selectionTools.selectFromTop'} />
                </Radio.Choice>
                <Radio.Choice value={true}>
                    <Message bundleKey={BUNDLE_NAME} messageKey={'selectionTools.selectAll'} />
                </Radio.Choice>
            </Radio.Group>
            <ButtonContainer>
                <Button
                    className='t_clearSelections'
                    onClick={clearSelections}
                >
                    <Message bundleKey={BUNDLE_NAME} messageKey='selectionTools.button.empty' />
                </Button>
                <PrimaryButton
                    type='close'
                    onClick={onClose}
                />
            </ButtonContainer>
        </StyledContent>
    );
};

export const showSelectToolPopup = (selectedTool, selectFromAll, drawTools, clearSelections, setSelectFromAll, onClose) => {
    const dimensions = getNavigationDimensions();
    let placement = PLACEMENTS.BL;
    if (dimensions?.placement === 'right') {
        placement = PLACEMENTS.BR;
    }
    const options = {
        id: 'featuredata-selection-tools',
        placement
    };
    const controls = showPopup(
        <Message bundleKey={BUNDLE_NAME} messageKey='selectionTools.title' />,
        <PopupContent
            selectedTool={selectedTool}
            selectFromAll={selectFromAll}
            drawTools={drawTools}
            clearSelections={clearSelections}
            setSelectFromAll={setSelectFromAll}
            onClose={onClose}
        />,
        onClose,
        options
    );

    return {
        ...controls,
        update: (tool, selectMode) => {
            controls.update(
                <Message bundleKey={BUNDLE_NAME} messageKey='selectionTools.title' />,
                <PopupContent
                    selectedTool={tool}
                    selectFromAll={selectMode}
                    drawTools={drawTools}
                    clearSelections={clearSelections}
                    setSelectFromAll={setSelectFromAll}
                    onClose={onClose}
                />
            )
        }
    }
};
