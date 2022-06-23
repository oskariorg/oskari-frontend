
import styled from 'styled-components';
import { red } from '@ant-design/colors'
import { getColorEffect, EFFECT } from '../../theme';
import { DeleteOutlined } from '@ant-design/icons';

export const Delete = styled(DeleteOutlined)`
    color: ${red.primary};
    cursor: pointer;
    &:hover {
        color: ${getColorEffect(red.primary, EFFECT.AUTO)};
    }
`;
