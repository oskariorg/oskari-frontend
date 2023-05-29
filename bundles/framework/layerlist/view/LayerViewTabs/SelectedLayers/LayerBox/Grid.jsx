import styled from 'styled-components';

export const Row = styled.div`
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
`;

export const Col = styled.div`
    flex-basis: 0;
    flex-grow: 1;
    max-width: 100%;
    position: relative;
`;

export const ColAuto = styled.div`
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
    position: relative;
`;

export const ColAutoRight = styled.div`
    flex: 0 0 auto;
    width: auto;
    max-width: 100%;
    position: relative;
    margin-left: auto;
    margin-right: 5px;
`;
