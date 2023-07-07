import React from 'react';
import { METADATA_BUNDLE_LOCALIZATION_ID } from '../../instance';
import { ClickableDiv, FlexRight, SearchResultRow } from './MetadataSearchResultListStyledComponents';
import { CoverageIcon } from './CoverageIcon';
import { PropTypes } from 'prop-types';

export const MetadataSearchResultListItem = (props) => {
    const { item, showMetadata } = props;
    const identificationCode = item?.identification?.code ? Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'searchResults.identificationCode.' + item.identification.code) : null;
    const identificationDate = item?.identification?.date ? item.identification.date : null;
    return <SearchResultRow>
        <ClickableDiv title={Oskari.getMsg(METADATA_BUNDLE_LOCALIZATION_ID, 'grid.info')} onClick={() => showMetadata(item.id)}>
            <span>{item.name}, {item.organization} </span>
            { identificationCode && identificationDate &&
                <span>({identificationCode}:{identificationDate})</span>
            }
        </ClickableDiv>
        <FlexRight>
            <CoverageIcon active={false}/>
        </FlexRight>
    </SearchResultRow>;
};

MetadataSearchResultListItem.propTypes = {
    item: PropTypes.object,
    showMetadata: PropTypes.func
};
