import React from 'react';
import { PublisherToolsList } from './PublisherToolsList';

export const AdditionalTools = ({ state, controller }) => {
    return (
        <PublisherToolsList state={state} controller={controller} />
    );
};
