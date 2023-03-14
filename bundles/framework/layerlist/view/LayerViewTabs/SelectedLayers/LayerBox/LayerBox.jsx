import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Footer } from './Footer/';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { Draggable } from 'react-beautiful-dnd';
import { Row, Col, ColAuto, ColAutoRight } from './Grid';
import { Message, Tooltip } from 'oskari-ui';
import { EyeOpen, EyeShut, DragIcon } from '../../CustomIcons';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

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

const Publishable = styled.span`
    font-style: italic;
    font-size: 14px;
    margin-left: 5px;
`;

const PublishableCol = styled(ColAutoRight)`
    padding: 0 0 0 20px;
    align-self: flex-end;
`;

const LayerBox = ({ layer, index, controller }) => {
    const organizationName = layer.getOrganizationName();
    const publishable = layer.hasPermission('publish');
    const visible = layer.isVisible();

    const handleToggleVisibility = () => {
        controller.toggleLayerVisibility(layer);
    };
    const handleRemoveLayer = () => {
        controller.removeLayer(layer);
    };
    const getName = () => {
        const field = <b>{layer.getName()}</b>;
        const description = layer.getDescription();
        if (!description) {
            return field;
        }
        return <Tooltip title={description}>{field}</Tooltip>;
    };

    return (
        <Draggable draggableId={`${layer.getId()}`} index={index}>
            { provided => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                    <Row style={{ backgroundColor: '#fafafa', padding: '0px' }}>
                        <ColAuto style={{ padding: '0px' }}>
                            <Tooltip title={<Message messageKey='layer.drag' />} getPopupContainer={(triggerNode) => triggerNode.parentElement} placement='topRight'>
                                <DragIcon style={{ marginTop: '5px' }} {...provided.dragHandleProps} />
                            </Tooltip>
                        </ColAuto>
                        <Col style={{ paddingRight: '0px' }}>
                            <StyledBox>
                                <Row>
                                    <ColAuto>
                                        {visible ? <Tooltip title={<Message messageKey='layer.hide' />}><EyeOpen onClick={handleToggleVisibility} /></Tooltip>
                                            : <Tooltip title={<Message messageKey='layer.show' />}><EyeShut onClick={handleToggleVisibility} /></Tooltip>}
                                    </ColAuto>
                                    <Col>
                                        <Row style={{ padding: '0px' }}>
                                            <ColAuto style={{ padding: '0px' }}>
                                                {getName()}
                                            </ColAuto>
                                        </Row>
                                        <Row style={{ padding: '0px', flexWrap: 'nowrap' }}>
                                            <ColAuto style={{ padding: '0px', flexShrink: 1 }}>
                                                {organizationName}
                                            </ColAuto>
                                            <PublishableCol>
                                                {publishable &&
                                                <Fragment>
                                                    <CheckOutlined style={{ color: '#01ca79' }} />
                                                    <Publishable>
                                                        <Message messageKey={'layer.publishable'} />
                                                    </Publishable>
                                                </Fragment>
                                                }
                                            </PublishableCol>
                                        </Row>
                                    </Col>
                                    <ColAutoRight>
                                        <CloseOutlined
                                            onClick={handleRemoveLayer}
                                            style={{ fontSize: '12px', marginRight: '4px' }}
                                        />
                                    </ColAutoRight>
                                </Row>
                                <Footer layer={layer} controller={controller}/>
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
    controller: PropTypes.instanceOf(Controller).isRequired
};

const wrapped = LocaleConsumer(LayerBox);
export { wrapped as LayerBox };
