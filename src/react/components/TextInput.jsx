import styled from 'styled-components';
import { Input } from 'antd';
import 'antd/es/input/style/index.js';
import React, { useState } from 'react';


const StyledWrapper = styled(Input)``;

export const TextInput = React.forwardRef((props, ref) => {
    const [val, setVal] = useState(props.value);
    const handleChange = (evt) => {
        // https://dev.to/kwirke/solving-caret-jumping-in-react-inputs-36ic
        // first do the sync setvalue to avoid caret jumping.
        setVal(evt.currentTarget.value);
        // then do the (duplicate) state update which might / might not be async.
        props.onChange(evt);
    }
    return <StyledWrapper {...props} value={val} onChange={handleChange}/>
});
