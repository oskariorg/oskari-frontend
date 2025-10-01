import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Footer } from './Footer/';
import { Controller, LocaleConsumer } from 'oskari-ui/util';
import { Draggable } from '@hello-pangea/dnd';
import { Row, Col, ColAuto, ColAutoRight } from './Grid';
import { Message, Tooltip } from 'oskari-ui';
import { EyeOpen, EyeShut, DragIcon } from 'oskari-ui/components/icons';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

const Container = styled.div`
    display: ${props => props.$isMobile ? 'block' : 'flex'};
`;
const Content = styled.div`
    padding: 10px;
    display: flex;
    flex-direction: row;

`;
const StyledBox = styled.div`
    min-height: 100px;
    box-shadow: 1px 1px 3px 0 rgba(0, 0, 0, 0.23);
    border-radius: 3px;
    margin-bottom: 10px;
    margin-left: 5px;
    margin-right: 5px;
    border: 1px #fff solid;
    background-color: #fff;
    width: 100%;
`;
const Publishable = styled.span`
    font-style: italic;
    font-size: 14px;
    margin-left: 5px;
`;
const PublishableCol = styled(ColAutoRight)`
    align-self: flex-end;
`;
const VisibilityIcon = styled('div')`
    margin-right: 15px;
    margin-left: 10px;
`;
const DragContainer = styled('div')`
    margin-top: 10px;
    margin-right: 10px;
`;

/**
 * Fixes tooltip on disappearing after letting go of the drag handle
 */
const StyledDragIcon = styled(DragIcon)`
    pointer-events: none;
`;
const DragWrapper = styled('div')`
    cursor: grab;
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
    const isMobile = Oskari.util.isMobile();
    return (
        <Draggable draggableId={`${layer.getId()}`} index={index}>
            { provided => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                    <Container $isMobile={isMobile} style={{ backgroundColor: '#fafafa' }}>
                        <DragContainer>
                            <Tooltip title={<Message messageKey='layer.drag' />} getPopupContainer={(triggerNode) => triggerNode.parentElement} placement='topRight'>
                                <DragWrapper {...provided.dragHandleProps}>
                                    <StyledDragIcon />
                                </DragWrapper>
                            </Tooltip>
                        </DragContainer>
                        <Col>
                            <StyledBox>
                                <Content>
                                    <VisibilityIcon>
                                        <ColAuto>
                                            {visible ? <Tooltip title={<Message messageKey='layer.hide' />}><EyeOpen onClick={handleToggleVisibility} /></Tooltip>
                                                : <Tooltip title={<Message messageKey='layer.show' />}><EyeShut onClick={handleToggleVisibility} /></Tooltip>}
                                        </ColAuto>
                                    </VisibilityIcon>
                                    <Col>
                                        <Row>
                                            <ColAuto>
                                                {getName()}
                                            </ColAuto>
                                        </Row>
                                        <Row>
                                            <ColAuto>
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
                                            style={{ fontSize: '12px' }}
                                        />
                                    </ColAutoRight>
                                </Content>
                                <Footer layer={layer} controller={controller}/>
                            </StyledBox>
                        </Col>
                    </Container>
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
