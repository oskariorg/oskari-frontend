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
        padding: 0 11px;
    }
`;

export const StyleSelect = (props) => {
    return (
        <List
            dataSource={ Object.keys(props.layer.options.styles).sort((a, b) => Oskari.util.naturalSort(a, b)) }
            renderItem={ (name) => {
                return (
                    <StyledItem>
                        <Checkbox onClick={ () => props.controller.setStyle(name) } checked={ name === (props.layer.style || 'default') }>{ name }</Checkbox>
                        <Button onClick={ () => props.editStyleCallback(name) } >
                            <EditOutlined />
                        </Button>
                        <Button onClick={ () => props.controller.removeStyleFromLayer(name) }>
                            <DeleteOutlined />
                        </Button>
                    </StyledItem>
                );
            }}
        />
    );
};

StyleSelect.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    editStyleCallback: PropTypes.func
};
