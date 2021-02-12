import React from 'react';
import PropTypes from 'prop-types';
import { List, Checkbox, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
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

const EditButton = styled(Button)`
    & {
        margin: auto 10px auto auto;
    }
`;

const EmptySelect = styled.div`
    background: #ffffff;
    line-height: 30px;
    padding: 4px 11px;
    width: 100%;
`;

const DefaultStyleText = styled.span`
    font-style: italic;
    font-size: 0.875em;
`;

export const VectorStyleSelect = ({ layer, controller, editStyleCallback }) => {
    const { styles } = layer.options;

    if (typeof styles !== 'object' || Object.keys(styles).length === 0) {
        return (
            <EmptySelect>
                <Message messageKey='styles.vector.validation.noStyles' />
            </EmptySelect>
        );
    }

    const sortedStyleIds = Object.keys(styles).slice()
        .sort((a, b) => Oskari.util.naturalSort(styles[a].title, styles[b].title));

    const canEdit = typeof editStyleCallback === 'function';
    const selectedStyle = layer.style || 'default';

    return (
        <List
            dataSource={ sortedStyleIds }
            renderItem={ (styleId) => {
                return (
                    <StyledItem>
                        <Tooltip title={ <Message messageKey='styles.vector.selectDefault' /> }>
                            <Checkbox onClick={ () => controller.setStyle(styleId) } checked={ styleId === selectedStyle }>{ styles[styleId].title }</Checkbox>
                        </Tooltip>

                        { styleId === selectedStyle &&
                            <DefaultStyleText>
                                (<Message messageKey='styles.default' />)
                            </DefaultStyleText>
                        }

                        { canEdit && <EditButton onClick={ () => editStyleCallback(styleId) } >
                            <EditOutlined />
                        </EditButton> }

                        <Tooltip title={ <Message messageKey='styles.vector.deleteStyle' /> }>
                            <Button onClick={ () => controller.removeStyleFromLayer(styleId) }>
                                <DeleteOutlined />
                            </Button>
                        </Tooltip>
                    </StyledItem>
                );
            }}
        />
    );
};

VectorStyleSelect.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    editStyleCallback: PropTypes.func
};
