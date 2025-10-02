import { Select as AntSelect } from 'antd';
import styled from 'styled-components';

// Wrap to styled so components can be referred in component styling.
const Select = styled(AntSelect)`
`;
Select.displayName = 'OskariUISelect';

const Option = styled(AntSelect.Option)``;
Option.displayName = 'OskariUIOption';
Option.__OskariTestSelector = '.ant-select-item';

export {
    Select,
    Option
};
