import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Mutator } from 'oskari-ui/util';
import { Draggable } from 'react-beautiful-dnd';
import { Row, Col, ColAuto, ColAutoRight } from './Grid';
import { Icon, Dropdown, Menu } from 'oskari-ui';
import { EyeOpen, EyeShut, DragIcon } from '../../CustomIcons';
import { LayerInfoBox, LayerScaleLocateBox } from './LayerInfoBox';
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
    background-color: #fff;
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

const Publishable = styled.span`
    font-style: italic;
    font-size: 14px;
    margin-left: 5px;
`;

const getTextForLayerBox = (inScale, locale) => {
    if (!inScale) {
        return locale.layer.moveToScale;
    }
    return '';
};

const SelectedLayerDropdown = ({ tools }) => {
    const items = tools.map(tool => {
        return { title: tool._title ? tool._title : tool._name, action: () => true };
    });
    const menu = <Menu items={items} />;
    return (
        <Dropdown menu={menu} placement="bottomRight">
            <Icon type="more" style={{ color: THEME_COLOR, fontSize: '24px' }} />
        </Dropdown>
    );
};

SelectedLayerDropdown.propTypes = {
    tools: PropTypes.array.isRequired
};

export const LayerBox = ({ layer, index, locale, mutator }) => {
    const [slider, setSlider] = useState(layer.getOpacity());
    const [visible, setVisible] = useState(layer.isVisible());
    console.log(layer);
    const tools = layer.getTools();
    const name = layer.getName();
    const organizationName = layer.getOrganizationName();
    const layerType = layer.getLayerType();
    const publishable = layer.getPermission('publish');
    const isInScale = layer.isInScale();
    const layerBoxText = getTextForLayerBox(isInScale, locale);
    // const srs = layer.isSupportedSrs();
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
    const handleLocateScaleLayer = () => {
        mutator.locateLayer(layer);
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
                                    <Col>
                                        <Row style={{ padding: '0px' }}>
                                            <ColAuto style={{ padding: '0px' }}>
                                                <b>{name}</b><br/>
                                                {organizationName}
                                            </ColAuto>
                                            <ColAutoRight style={{ padding: '0px', marginTop: '20px' }}>
                                                {publishable &&
                                                <>
                                                <Icon type="check" style={{ color: '#01ca79' }} />
                                                <Publishable>{locale.layer.publishable}</Publishable>
                                                </>
                                                }
                                            </ColAutoRight>
                                        </Row>
                                    </Col>
                                    <ColAutoRight>
                                        <Icon
                                            type="close"
                                            onClick={handleRemoveLayer}
                                            style={{ fontSize: '12px', marginRight: '4px' }}
                                        />
                                    </ColAutoRight>
                                </Row>
                                <GrayRow>
                                    <ColAuto>
                                        <LayerIcon type={layerType} />
                                    </ColAuto>
                                    {!isInScale &&
                                    <LayerScaleLocateBox
                                        handleClick={handleLocateScaleLayer}
                                        text={layerBoxText}
                                    />
                                    }
                                    {isInScale &&
                                    <>
                                    <LayerInfoBox
                                        slider={slider}
                                        handleOpacityChange={handleOpacityChange}
                                    />
                                    <StyleSettings
                                        layer={layer}
                                        locale={locale}
                                        mutator={mutator}
                                        onChange={styleName => mutator.changeLayerStyle(layer, styleName)}
                                    />
                                    </>
                                    }
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
    locale: PropTypes.object.isRequired,
    mutator: PropTypes.instanceOf(Mutator).isRequired
};
