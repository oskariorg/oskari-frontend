import React from 'react';
import PropTypes from 'prop-types';
import { List, Checkbox } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button } from 'oskari-ui';
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

export const VectorStyleSelect = ({ layer, controller, editStyleCallback }) => {
    const { styles } = layer.options;

    if (typeof styles !== 'object') {
        return null;
    }
    const sortedStyleIds = Object.keys(styles).slice()
        .sort((a, b) => Oskari.util.naturalSort(a, b));

    const canEdit = typeof editStyleCallback === 'function';
    const selectedStyle = layer.style || 'default';

    return (
        <List
            dataSource={ sortedStyleIds }
            renderItem={ (name) => {
                return (
                    <StyledItem>
                        <Checkbox onClick={ () => controller.setStyle(name) } checked={ name === selectedStyle }>{ name }</Checkbox>
                        { canEdit && <EditButton onClick={ () => editStyleCallback(name) } >
                            <EditOutlined />
                        </EditButton> }
                        <Button onClick={ () => controller.removeStyleFromLayer(name) }>
                            <DeleteOutlined />
                        </Button>
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
