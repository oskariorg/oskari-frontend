import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Graphic = styled.div`
    float: left;
    margin-bottom: 6px;
    margin-left: 6px;
`;

const Image = styled.img`
    max-height: ${props => props.fullSize ? '100%' : '200px'};
    cursor: ${props => props.fullSize ? 'zoom-out' : 'zoom-in'};
`;

export const Images = ({ source = [], toggle, fullSize }) => {
    if (!source.length) {
        return null;
    }
    return (
        <Fragment>
            {source.map(({ fileName }, i) => (
                <Graphic key={`graph-${i}`} onClick={() => toggle()}>
                    <Image
                        src={fileName}
                        fullSize={fullSize} />
                </Graphic>
            ))}
        </Fragment>
    );
};

Images.propTypes = {
    source: PropTypes.array,
    toggle: PropTypes.func.isRequired,
    fullSize: PropTypes.bool.isRequired
};
