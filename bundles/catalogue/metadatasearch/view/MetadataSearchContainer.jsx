import React from 'react';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../instance';

const Description = () => {
    return <div>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'metadataSearchDescription')}</div>;
};

export const MetadataSearchContainer = () => {
    return <div><Description/></div>;
};
