import styled from 'styled-components';

export const Content = styled('div')`
    margin: 12px 24px 24px;
    display: flex;
    width: 270px;
    flex-direction: column;
`;

export const CoordinateFields = styled('div')`
    display: flex;
    flex-direction: column;
    margin-top: 10px;
`;

export const CoordinateField = styled('div')`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 10px;
`;

export const DegreeContainer = styled('div')`
    display: flex;
    flex-direction: column;
    margin-left: 59px;
    margin-bottom: 10px;
`;

export const CoordinateLabel = styled('div')`
    margin-right: 5px;
    width: 40px;
    display: flex;
    flex-direction: row;
`;

export const SelectField = styled('div')`
    margin-bottom: 10px;
    display: flex;
    flex-direction: column;
`;

export const EmergencyInfo = styled('div')`
    margin-top: 10px;
`;

export const SelectLabel = styled('div')`
    font-size: 12px;
    margin-top: 5px;
    opacity: 0.8;
`;

export const ReverseGeoCodes = styled('div')`
    display: flex;
    flex-direction: column;
    margin-top: 5px;
`;

export const Approximation = styled('span')`
    width: 12px;
    font-size: 14px;
`;