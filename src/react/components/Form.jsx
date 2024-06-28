import { Form as AntForm } from 'antd';

import styled from 'styled-components';

export const FormItem = styled(AntForm.Item)`
 > .ant-form-item-label {
     padding: 0;
 }
`;

export const Form = AntForm;
