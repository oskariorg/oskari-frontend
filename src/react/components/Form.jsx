import { Form as AntForm } from 'antd';
import 'antd/es/form/style/index.js';
import styled from 'styled-components';

export const FormItem = styled(AntForm.Item)`
 > .ant-form-item-label {
     padding: 0;
 }
`;

export const Form = AntForm;
