import styled from 'styled-components';

export const Row = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    padding: 10px;
    flex-wrap: wrap;
`;

export const Col = styled.div`
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
    position: relative;
    padding-right: 10px;
    padding-left: 10px;
`;

export const ColAuto = styled.div`
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
    position: relative;
    padding-right: 10px;
    padding-left: 10px;
`;

export const ColAutoRight = styled.div`
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
    position: relative;
    padding-right: 10px;
    padding-left: 10px;
    margin-left: auto;
`;
