import React from 'react';
import PropTypes from 'prop-types';
import { List, Checkbox } from 'antd';
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
            dataSource={ Object.keys(props.layer.options.styles) }
            renderItem={ (name) => {
                return (
                    <StyledItem>
                        <Checkbox checked={ name === 'default' }>{ name }</Checkbox>
                    </StyledItem>
                );
            }}
        />
    );
};

StyleSelect.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired
};
