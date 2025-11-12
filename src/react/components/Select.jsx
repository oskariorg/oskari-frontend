import { Select as AntSelect } from 'antd';
import styled from 'styled-components';

// Wrap to styled so components can be referred in component styling.
const Select = styled(AntSelect)`
`;
Select.displayName = 'OskariUISelect';

export {
    Select
};
