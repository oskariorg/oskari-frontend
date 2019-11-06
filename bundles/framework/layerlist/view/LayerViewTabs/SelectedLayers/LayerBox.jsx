import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Mutator } from 'oskari-ui/util';
import { Draggable } from 'react-beautiful-dnd';
import { Row, Col, ColAuto, ColAutoRight } from './Grid';
import { Icon, Dropdown, Menu } from 'oskari-ui';
import { EyeOpen, EyeShut, DragIcon } from '../CustomIcons';
import { LayerInfoBox } from './LayerInfoBox';
import { LayerIcon } from '../LayerIcon';

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

const SelectedLayerDropdown = ({ tools }) => {
    const items = tools.map(tool => {
        return { title: tool._title ? tool._title : tool._name, action: () => true };
    });
    const menu = <Menu items={items} />;
    return (
        <Dropdown menu={menu} placement="bottomRight">
            <Icon type="menu" style={{ color: '#006ce8', fontSize: '16px', marginTop: '8px' }} />
        </Dropdown>
    );
};

SelectedLayerDropdown.propTypes = {
    tools: PropTypes.array.isRequired
};

export const LayerBox = ({ layer, index, mutator }) => {
    const [slider, setSlider] = useState(layer.getOpacity());
    const [visible, setVisible] = useState(layer.isVisible());
    const tools = layer.getTools();
    const name = layer.getName();
    const organizationName = layer.getOrganizationName();
    const layerType = layer.getLayerType();
    // const isInScale = layer.isInScale();
    // const srs = layer.isSupportedSrs();
    // Try to find this somewhere
    // const activeFeats = layer.getActiveFeatures().length;
    const handleOpacityChange = value => {
        setSlider(value);
        mutator.changeOpacity(layer, value);
    };
    const handleToggleVisibility = () => {
        setVisible(!visible);
        mutator.toggleLayerVisibility(layer);
    };
    const handleRemoveLayer = () => {
        mutator.removeLayer(layer);
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
                                        <LayerIcon style={{ marginTop: '5px' }} type={layerType} />
                                    </ColAuto>
                                    <LayerInfoBox
                                        slider={slider}
                                        handleOpacityChange={handleOpacityChange}
                                    />
                                    <ColAutoRight>
                                        <SelectedLayerDropdown tools={tools} />
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
    mutator: PropTypes.instanceOf(Mutator).isRequired
};
