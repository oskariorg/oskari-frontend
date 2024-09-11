import React from 'react';
import PropTypes from 'prop-types';
import { showPopup, getNavigationDimensions, PLACEMENTS } from 'oskari-ui/components/window';
import { ButtonContainer, PrimaryButton } from 'oskari-ui/components/buttons';
import { Message, Button, Radio, Tooltip } from 'oskari-ui';
import styled from 'styled-components';
import { DRAW_TOOLS, SELECT_ALL_ID } from './SelectToolPopupHandler';
import { LocaleProvider } from 'oskari-ui/util';

const BUNDLE_NAME = 'FeatureData';

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
    cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
`;

const Info = styled.div`
    margin-top: 15px;
    font-style: italic;
    font-size: 12px;
`;

const PopupContent = ({ tool, layerId, vectorLayerIds, controller, onClose }) => {
    const layerCount = vectorLayerIds.length;
    const topId = vectorLayerIds[layerCount - 1];
    const disabled = layerCount === 0;
    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_NAME }}>
            <StyledContent>
                <DrawOptions>
                    {DRAW_TOOLS.map(key => {
                        const iconCls = `selection-${key}`;
                        return (
                            <Tooltip key={key} title={<Message messageKey={`selectionTools.tools.${key}.tooltip`}/> }>
                                <DrawOption disabled={disabled}
                                    className={tool === key ? `${iconCls} tool active` : iconCls}
                                    onClick={() => disabled || controller.setTool(key)}
                                />
                            </Tooltip>
                        );
                    })}
                </DrawOptions>
                <Radio.Group
                    value={layerId}
                    onChange={(e) => controller.setLayerId(e.target.value)}
                >
                    <Radio.Choice value={topId} disabled={disabled}>
                        <Message messageKey={'selectionTools.selectFromTop'} />
                    </Radio.Choice>
                    <Radio.Choice value={SELECT_ALL_ID} disabled={layerCount < 2}>
                        <Message messageKey={'selectionTools.selectAll'} />
                    </Radio.Choice>
                </Radio.Group>
                <Info>
                    <Message messageKey='selectionTools.instructions' />
                </Info>
                <ButtonContainer>
                    <Button
                        className='t_clearSelections'
                        onClick={() => controller.clearSelections()}
                    >
                        <Message messageKey='selectionTools.button.empty' />
                    </Button>
                    <PrimaryButton
                        type='close'
                        onClick={() => onClose()}
                    />
                </ButtonContainer>
            </StyledContent>
        </LocaleProvider>
    );
};

PopupContent.propTypes = {
    tool: PropTypes.string,
    layerId: PropTypes.any,
    vectorLayerIds: PropTypes.array.isRequired,
    controller: PropTypes.object,
    onClose: PropTypes.func
};

export const showSelectToolPopup = (state, controller, onClose) => {
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
        <PopupContent { ...state } controller={controller} onClose={onClose} />,
        onClose,
        options
    );

    return {
        ...controls,
        update: (state) => {
            controls.update(
                <Message bundleKey={BUNDLE_NAME} messageKey='selectionTools.title' />,
                <PopupContent { ...state } controller={controller} onClose={onClose} />
            );
        }
    };
};
