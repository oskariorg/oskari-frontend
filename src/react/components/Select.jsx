import React from 'react';
import { Select as AntSelect } from 'antd';
import styled from 'styled-components';

// Wrap to styled so components can be referred in component styling.

const SelectWrapper = (props) => {

    const { options } = props;
    const newOptions = options.map((option) => ({
        ...option,
        'data-value': option['data-value'] ? option['data-value'] : option.value
    }));

    return <AntSelect
        {...props}
        options = { newOptions }
    />;

}

const Select = styled(SelectWrapper)`
`;
Select.displayName = 'OskariUISelect';

export {
    Select
};
