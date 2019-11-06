import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Draggable } from 'react-beautiful-dnd';
import { Row, Col, ColAuto, ColAutoRight } from './Grid';
import { Slider, Icon, NumberInput, InputGroup } from 'oskari-ui';
import { Mutator } from 'oskari-ui/util';
import { EyeOpen, EyeShut, DragIcon } from '../../CustomIcons';
import { LayerIcon } from '../../LayerIcon';
import { StyleSettings } from './StyleSettings';
import { THEME_COLOR } from '.';

const StyledBox = styled.div`
    min-height: 100px;
    box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.23);
    border-radius: 3px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 5px;
    border: 1px #fff solid;
`;

const GrayRow = styled(Row)`
    background-color: #f3f3f3;
    padding-left: 60px;
    justify-content: flex-start;
    ${ColAuto}, ${ColAutoRight} {
        display: flex;
        align-items: center;
        padding-left: 0;
        > :not(:last-child) {
            margin-right: 5px;
        }
    }
`;

const StyledSlider = styled.div`
    border: solid 2px #d9d9d9;
    border-radius: 4px;
    width: 120px;
    padding: 8px 15px;
`;

const StyledNumberInput = styled(NumberInput)`
    width: 60px !important;
    font-size: 15px;
    box-shadow: inset 1px 1px 4px 0 rgba(87, 87, 87, 0.26);
`;

export const LayerBox = ({ layer, index, locale, mutator }) => {
    const [slider, setSlider] = useState(layer.getOpacity());
    const name = layer.getName();
    const organizationName = layer.getOrganizationName();
    const visible = layer.isVisible();
    const layerType = layer.getLayerType();

    // const isInScale = layer.isInScale();
    // const srs = layer.isSupportedSrs();
    // Try to find this somewhere
    // const activeFeats = layer.getActiveFeatures().length;
    const handleOpacityChange = value => {
        // TODO send event instead of manipulating layer
        layer.setOpacity(value);
        setSlider(value);
    };
    const handleToggleVisibility = () => {
        // TODO
        console.log('Toggle visibility');
    };
    const handleOpenMenu = () => {
        // TODO
        console.log('Open menu');
    };
    const handleRemoveLayer = () => {
        // TODO
        console.log('Remove layer');
    };
    return (
        <Draggable draggableId={`${layer.getId()}`} index={index}>
            { provided => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                    <Row style={{ backgroundColor: '#fafafa', padding: '0px' }}>
                        <ColAuto style={{ padding: '0px' }}>
                            <DragIcon style={{ marginTop: '5px' }} {...provided.dragHandleProps} />
                        </ColAuto>
                        <Col style={{ paddingRight: '0px' }}>
                            <StyledBox>
                                <Row>
                                    <ColAuto>
                                        {visible ? <EyeOpen onClick={handleToggleVisibility} />
                                            : <EyeShut onClick={handleToggleVisibility} />}
                                    </ColAuto>
                                    <Col><b>{name}</b><br/>{organizationName}</Col>
                                    <ColAutoRight>
                                        <Icon
                                            type="close"
                                            onClick={handleRemoveLayer}
                                            style={{ marginTop: '10px', fontSize: '12px', marginRight: '4px' }}
                                        />
                                    </ColAutoRight>
                                </Row>
                                <GrayRow>
                                    <ColAuto>
                                        <LayerIcon type={layerType} />
                                    </ColAuto>
                                    <ColAuto>
                                        <InputGroup compact>
                                            <StyledSlider>
                                                <Slider
                                                    value={slider}
                                                    onChange={handleOpacityChange}
                                                    style={{ margin: '0px' }}
                                                />
                                            </StyledSlider>
                                            <StyledNumberInput
                                                min={0}
                                                max={100}
                                                value={slider}
                                                onChange={handleOpacityChange}
                                                formatter={value => `${value} %`}
                                            />
                                        </InputGroup>
                                    </ColAuto>
                                    <StyleSettings
                                        layer={layer}
                                        locale={locale}
                                        mutator={mutator}
                                        onChange={styleName => mutator.changeLayerStyle(layer, styleName)}/>
                                    <ColAutoRight>
                                        <Icon
                                            type="menu"
                                            onClick={handleOpenMenu}
                                            style={{ color: THEME_COLOR, fontSize: '16px' }}
                                        />
                                    </ColAutoRight>
                                </GrayRow>
                            </StyledBox>
                        </Col>
                    </Row>
                </div>
            )}
        </Draggable>
    );
};

LayerBox.propTypes = {
    layer: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    locale: PropTypes.object.isRequired,
    mutator: PropTypes.instanceOf(Mutator).isRequired
};
