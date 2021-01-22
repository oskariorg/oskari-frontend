import React from 'react';
import PropTypes from 'prop-types';
import { List, Checkbox } from 'antd';
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
            dataSource={ props.styleList }
            renderItem={ (item) => {
                return (
                    <StyledItem>
                        <Checkbox checked={ item.isDefault }>{ item.name }</Checkbox>
                    </StyledItem>
                );
            }}
        />
    );
};

StyleSelect.propTypes = {
    styleList: PropTypes.array
};
