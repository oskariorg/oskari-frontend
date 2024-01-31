import React from 'react';
import { AdvancedSearchInputLabel, AdvancedSearchRowContainer } from './AdvancedSearchStyledComponents';
import { Button } from 'oskari-ui/components/Button';
import { SecondaryButton } from 'oskari-ui/components/buttons';

import PropTypes from 'prop-types';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';
export const AdvancedSearchCoverage = (props) => {
    const { startDrawing, cancelDrawing, drawing, coverageFeature } = props;
    return <AdvancedSearchRowContainer>
        <AdvancedSearchInputLabel>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.searchArea')}</AdvancedSearchInputLabel>
        { !drawing && !coverageFeature && <Button onClick={startDrawing} type='primary'>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.delimitArea')}</Button>}
        { drawing && !coverageFeature && <SecondaryButton onClick={cancelDrawing} type='cancel'/>}
        { coverageFeature && <Button onClick={cancelDrawing} type='primary'>{Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'advancedSearch.deleteArea')}</Button>}
    </AdvancedSearchRowContainer>;
};

AdvancedSearchCoverage.propTypes = {
    title: PropTypes.string,
    startDrawing: PropTypes.func,
    cancelDrawing: PropTypes.func,
    coverageFeature: PropTypes.string,
    drawing: PropTypes.bool
};
