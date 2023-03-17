import React from 'react';
import PropTypes from 'prop-types';
import { InfoCircleOutlined } from '@ant-design/icons';
import styled from 'styled-components';


const StyledMetadataIcon = styled(InfoCircleOutlined)`
    cursor: pointer;
    color: #0290ff;
    border-radius: 50%;
    &:hover {
        background-color: rgba(24,144,255, 0.25);
    }
`;

/**
 * @param {Number} metadataId Metadata ID
 * @param {Number} size Font size in pixels
 * @param {Object} style Additional styles
 * @returns 
 */
export const Metadata = ({ metadataId, size = 16, style }) => {

    if (!metadataId) return null;

    const onClick = () => {
        Oskari.getSandbox().postRequestByName('catalogue.ShowMetadataRequest', [
            {uuid: metadataId}
    ]);
    };

    return (
        <StyledMetadataIcon
            className='t_icon t_metadata'
            style={{ fontSize: `${size}px`, ...style }}
            onClick={onClick}
        />
    );
};

Metadata.propTypes = {
    metadataId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    size: PropTypes.number,
    style: PropTypes.object
};
