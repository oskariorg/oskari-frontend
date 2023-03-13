import React from 'react';
import PropTypes from 'prop-types';
import { List, Radio, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, BgColorsOutlined } from '@ant-design/icons';
import { Button, Message } from 'oskari-ui';
import { Controller } from 'oskari-ui/util';
import styled from 'styled-components';

const StyledItem = styled(List.Item)`
    & {
        background: #ffffff;
        line-height: 30px;
        padding: 4px 11px;
    }
`;

const ButtonContainer = styled.div`
    margin-left: auto;
    Button {
        margin-left: 10px;
    }
`;

const EmptySelect = styled.div`
    background: #ffffff;
    line-height: 30px;
    padding: 4px 11px;
    width: 100%;
`;

const StyledText = styled.span`
    font-style: italic;
    font-size: 0.875em;
    padding-right: 10px;
    color: ${props => props.color}
`;

const renderStatus = (status) => {
    const color = status === 'DELETED' ? '#FF0000' : null;
    return (
        <StyledText color={color}>
            ({status})
        </StyledText>
    );
};

export const VectorStyleSelect = ({ layer, controller, editStyle }) => {
    const { vectorStyles = [], vectorStyleStatus = {} } = layer;

    if (vectorStyles.length === 0) {
        return (
            <EmptySelect>
                <Message messageKey='styles.vector.validation.noStyles' />
            </EmptySelect>
        );
    }

    const sortedStyles = vectorStyles.slice()
        .sort((a, b) => Oskari.util.naturalSort(a.name, b.name));

    const selectedStyle = layer.style;

    return (
        <List
            dataSource={ sortedStyles }
            renderItem={ (style) => {
                const status = vectorStyleStatus[style.id];
                const disabled = status === 'DELETED';
                return (
                    <StyledItem>
                        <Tooltip title={ <Message messageKey='styles.vector.selectDefault' /> }>
                            <Radio onClick={ () => controller.setStyle(style.id) } checked={ style.id === selectedStyle }>{ style.name || style.id }</Radio>
                        </Tooltip>

                        <StyledText>
                            ({style.type})
                        </StyledText>
                        { style.id === selectedStyle &&
                            <StyledText>
                                (<Message messageKey='styles.default' />)
                            </StyledText>
                        }
                        { status && renderStatus(status) }
                        <ButtonContainer>
                            { style.type === 'oskari' &&
                                <Tooltip title={ <Message messageKey='styles.vector.edit.editor' /> }>
                                    <Button disabled={disabled} onClick={ () => editStyle('editor', style) } >
                                        <BgColorsOutlined />
                                    </Button>
                                </Tooltip>
                            }
                            <Tooltip title={ <Message messageKey='styles.vector.edit.json' /> }>
                                <Button disabled={disabled} onClick={ () => editStyle('json', style) } >
                                    <EditOutlined />
                                </Button>
                            </Tooltip>
                            <Tooltip title={ <Message messageKey='styles.vector.deleteStyle' /> }>
                                <Button disabled={disabled} onClick={ () => controller.removeVectorStyleFromLayer(style.id) }>
                                    <DeleteOutlined />
                                </Button>
                            </Tooltip>
                        </ButtonContainer>
                    </StyledItem>
                );
            }}
        />
    );
};

VectorStyleSelect.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    editStyle: PropTypes.func
};
