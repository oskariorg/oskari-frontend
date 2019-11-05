import { memo } from 'react';
import { Alert as OAlert } from 'oskari-ui';
import styled from 'styled-components';

const Alert = styled(OAlert)`
    margin: 10px;
`;

const memoized = memo(Alert);
export { memoized as Alert };
