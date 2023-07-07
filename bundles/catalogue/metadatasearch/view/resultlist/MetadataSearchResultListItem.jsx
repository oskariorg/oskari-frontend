import React from 'react';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';
import { FlexRight, SearchResultRow } from './MetadataSearchResultListStyledComponents';
import { CoverageIcon } from './CoverageIcon';
import { PropTypes } from 'prop-types';

export const MetadataSearchResultListItem = (props) => {
    const { item } = props;
    const identificationCode = item?.identification?.code ? Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'searchResults.identificationCode.' + item.identification.code) : null;
    const identificationDate = item?.identification?.date ? item.identification.date : null;
    return <SearchResultRow>
        <div>
            <span>{item.name}, {item.organization} </span>
            { identificationCode && identificationDate &&
                <span>({identificationCode}:{identificationDate})</span>
            }
        </div>
        <FlexRight>
            <CoverageIcon active={false}/>
        </FlexRight>
    </SearchResultRow>;
};

MetadataSearchResultListItem.propTypes = {
    item: PropTypes.object
};
