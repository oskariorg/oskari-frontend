import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col, ColAuto, ColAutoRight } from './Grid';
import { Slider, Icon, NumberInput } from 'oskari-ui';
import { EyeOpen, EyeShut, DragIcon } from '../CustomIcons';
import { LayerIcon } from '../LayerIcon';

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
`;

const StyledSlider = styled.div`
    border: solid 2px #d9d9d9;
    border-radius: 4px;
    width: 150px;
    padding: 8px 15px;
`;

const StyledNumberInput = styled(NumberInput)`
    width: 70px !important;
    font-size: 15px;
    box-shadow: inset 1px 1px 4px 0 rgba(87, 87, 87, 0.26);
`;

export const LayerBox = ({ layer }) => {
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
    const handleDragEvent = () => {
        // TODO
        console.log('Drag');
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
        <Row style={{ backgroundColor: '#fafafa', padding: '0px' }}>
            <ColAuto style={{ padding: '0px' }}>
                <DragIcon style={{ marginTop: '5px' }} onClick={handleDragEvent} />
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
                            <LayerIcon style={{ marginTop: '5px' }} type={layerType} />
                        </ColAuto>
                        <ColAuto>
                            <StyledSlider>
                                <Slider
                                    value={slider}
                                    onChange={handleOpacityChange}
                                    style={{ margin: '0px' }}
                                />
                            </StyledSlider>
                        </ColAuto>
                        <ColAuto>
                            <StyledNumberInput
                                min={0}
                                max={100}
                                value={slider}
                                onChange={handleOpacityChange}
                                formatter={value => `${value} %`}
                            />
                        </ColAuto>
                        <ColAutoRight>
                            <Icon
                                type="menu"
                                onClick={handleOpenMenu}
                                style={{ color: '#006ce8', fontSize: '16px', marginTop: '8px' }}
                            />
                        </ColAutoRight>
                    </GrayRow>
                </StyledBox>
            </Col>
        </Row>
    );
};

LayerBox.propTypes = {
    layer: PropTypes.object
};
