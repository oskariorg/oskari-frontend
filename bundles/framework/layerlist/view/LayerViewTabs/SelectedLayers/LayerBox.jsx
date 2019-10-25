import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Slider, Icon, NumberInput } from 'oskari-ui';
import { EyeOpen, EyeShut, DataLayerIcon, ImageLayerIcon, DragIcon } from './CustomIcons/CustomIcons';

const StyledBox = styled.div`
    min-height: 120px;
    box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.23);
    border-radius: 3px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 5px;
`;

const Row = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    padding: 10px;
    flex-wrap: wrap;
`;

const GrayRow = styled.div`
    background-color: #f3f3f3;
    display: flex;
    flex-flow: row wrap;
    padding: 10px;
    padding-left: 60px;
    flex-wrap: wrap;
`;

const Col = styled.div`
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
    position: relative;
    padding-right: 10px;
    padding-left: 10px;
`;

const ColAuto = styled.div`
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
    position: relative;
    padding-right: 10px;
    padding-left: 10px;
`;

const ColAutoRight = styled.div`
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
    position: relative;
    padding-right: 10px;
    padding-left: 10px;
    margin-left: auto;
`;

const StyledSlider = styled.div`
    border: solid 2px #d9d9d9;
    border-radius: 4px;
    width: 150px;
    padding-left: 5px;
    padding-right: 5px;
`;

const StyledNumberInput = styled(NumberInput)`
    width: 70px !important;
    height: 40px !important;
    line-height: 40px !important;
`;

const LayerIcon = ({ type }) => {
    if (type === 'wmts') {
        return (
            <ImageLayerIcon style={{ marginTop: '10px' }} />
        );
    }
    return (
        <DataLayerIcon style={{ marginTop: '10px' }} />
    );
};

LayerIcon.propTypes = {
    type: PropTypes.string
};

export const LayerBox = ({ layer }) => {
    const [slider, setSlider] = useState(layer.getOpacity());
    const name = layer.getName();
    const organizationName = layer.getOrganizationName();
    const visible = layer.isVisible();
    const layerType = layer.getLayerType();
    // const isInScale = layer.isInScale();
    // const srs = layer.isSupportedSrs();
    const handleOpacityChange = value => {
        // TODO send event instead of manipulating layer
        layer.setOpacity(value);
        setSlider(value);
    };
    // Try to find this somewhere
    // const activeFeats = layer.getActiveFeatures().length;
    return (
        <Row style={{ backgroundColor: '#fafafa', padding: '0px' }}>
            <ColAuto style={{ padding: '0px' }}>
                <DragIcon style={{ marginTop: '5px' }} />
            </ColAuto>
            <Col>
                <StyledBox>
                    <Row>
                        <ColAuto>{visible ? <EyeOpen /> : <EyeShut />}</ColAuto>
                        <Col><b>{name}</b><br/>{organizationName}</Col>
                        <ColAutoRight>
                            <Icon type="close" style={{ marginTop: '10px', fontSize: '12px' }} />
                        </ColAutoRight>
                    </Row>
                    <GrayRow>
                        <ColAuto>
                            <LayerIcon type={layerType} />
                        </ColAuto>
                        <ColAuto>
                            <StyledSlider>
                                <Slider value={slider} onChange={handleOpacityChange} />
                            </StyledSlider>
                        </ColAuto>
                        <ColAuto>
                            <StyledNumberInput min={0} max={100} value={slider} onChange={handleOpacityChange} />
                        </ColAuto>
                        <ColAutoRight>
                            <Icon type="menu" style={{ color: '#006ce8', fontSize: '20px', marginTop: '10px' }} />
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
