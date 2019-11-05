import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Row, Col, ColAuto, ColAutoRight } from './Grid';
import { Icon } from 'oskari-ui';
import { EyeOpen, EyeShut, DragIcon } from './CustomIcons/CustomIcons';
import { LayerInfoBox } from './LayerInfoBox';

const StyledBox = styled.div`
    min-height: 100px;
    box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.23);
    border-radius: 3px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 5px;
    border: 1px #fff solid;
    background-color: #fff;
`;

const GrayRow = styled(Row)`
    background-color: #f3f3f3;
    padding-left: 60px;
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
        layer.setOpacity(value);
        setSlider(value);
    };
    const handleDragEvent = () => {
        console.log('Drag');
    };
    const handleToggleVisibility = () => {
        console.log('Toggle visibility');
    };
    const handleOpenMenu = () => {
        console.log('Open menu');
    };
    const handleRemoveLayer = () => {
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
                        <LayerInfoBox
                            layerType={layerType}
                            slider={slider}
                            handleOpacityChange={handleOpacityChange}
                            handleOpenMenu={handleOpenMenu}
                        />
                    </GrayRow>
                </StyledBox>
            </Col>
        </Row>
    );
};

LayerBox.propTypes = {
    layer: PropTypes.object
};
