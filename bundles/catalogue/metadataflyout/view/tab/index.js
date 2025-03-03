import styled from 'styled-components';

export { BasicInfoTabPane } from './BasicInfoTabPane';
export { InspireTabPane } from './InspireTabPane';
export { JHSTabPane } from './JHSTabPane';
export { QualityTabPane } from './QualityTabPane';
export { ActionsTabPane } from './ActionsTabPane';
export { Title } from './components/Title';
export { LabeledItem } from './components/LabeledItem';
export { ResponsibleParties } from './components/ResponsibleParties';
export { Images } from './components/Images';
export { DataQualities } from './components/DataQualities';
export { Label, SubLabel } from './components/Label';

export const Content = styled.article`
    display: flex;
    flex-flow: column;
`;

export const List = styled.ul`
    margin-left: 20px;
    margin-bottom: 18px;
`;

export const Paragraph = styled.p`
    margin-bottom: 18px;
`;
