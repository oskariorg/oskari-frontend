import React, { useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { LayerBoxFooter } from './LayerBoxFooter';
import { Mutator } from 'oskari-ui/util';
import { Draggable } from 'react-beautiful-dnd';
import { Row, Col, ColAuto, ColAutoRight } from './Grid';
import { Icon } from 'oskari-ui';
import { EyeOpen, EyeShut, DragIcon } from '../../CustomIcons';

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

export const LayerBox = ({ layer, index, locale, mutator, visibilityInfo }) => {
    const [visible, setVisible] = useState(layer.isVisible());
    const name = layer.getName();
    const organizationName = layer.getOrganizationName();
    const publishable = layer.getPermission('publish');
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
                                    <Col>
                                        <Row style={{ padding: '0px' }}>
                                            <ColAuto style={{ padding: '0px' }}>
                                                <b>{name}</b><br/>
                                                {organizationName}
                                            </ColAuto>
                                            <ColAutoRight style={{ padding: '0px', marginTop: '20px' }}>
                                                {publishable &&
                                                <Fragment>
                                                    <Icon type="check" style={{ color: '#01ca79' }} />
                                                    <Publishable>{locale.layer.publishable}</Publishable>
                                                </Fragment>
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
                                <LayerBoxFooter layer={layer} mutator={mutator} visibilityInfo={visibilityInfo} locale={locale} />
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
    mutator: PropTypes.instanceOf(Mutator).isRequired,
    visibilityInfo: PropTypes.object.isRequired
};
