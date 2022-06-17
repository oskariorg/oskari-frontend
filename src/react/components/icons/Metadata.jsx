import React from 'react';
import PropTypes from 'prop-types';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Tooltip } from 'oskari-ui';
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
 * @param {Array} subMetadataIds
 * @param {String} title Icon tooltip
 * @param {Number} size Font size in pixels
 * @param {Object} style Additional styles
 * @returns 
 */
export const Metadata = ({ metadataId, subMetadataIds, title, size = 16, style }) => {

    if (!metadataId) return null;

    const onClick = () => {
        const subMetadata = [];
        if (subMetadataIds && subMetadataIds.length > 0) {
            subMetadataIds.map(sub => ({uuid: sub}));
        }
        Oskari.getSandbox().postRequestByName('catalogue.ShowMetadataRequest', [
            {uuid: metadataId},
            subMetadata
    ]);
    };

    return (
        <Tooltip title={title}>
            <StyledMetadataIcon
                className='t_icon t_metadata'
                style={{ fontSize: `${size}px`, ...style }}
                onClick={onClick}
            />
        </Tooltip>
    );
};

Metadata.propTypes = {
    metadataId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    subMetadataIds: PropTypes.array,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    size: PropTypes.number,
    style: PropTypes.object
};
