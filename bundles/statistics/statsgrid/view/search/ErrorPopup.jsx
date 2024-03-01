import React from 'react';
import styled from 'styled-components';
import { showPopup } from 'oskari-ui/components/window';
import { Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { BUNDLE_KEY } from '../../constants';

const POPUP_OPTIONS = {
    id: BUNDLE_KEY + '-search-error'
};

const Content = styled.div`
    padding: 20px;
`;

const Popup = ({errors}) => {
    // TODO: show reason for error if available => errorLoc[indicator.error]
    return (
        <Content>
            {errors.map((indicator,i) => {
                const { name, partialSeries, selections } = indicator;
                const selection = partialSeries
                    ? getInvalidSerie(partialSeries)
                    : getSelection(selections);
                return <div key={i}>{`${name} (${selection})`}</div>
            })}
        </Content>
    );
};

export const showSearchErrorPopup = (errors, isPartial) => {
    // no need to update
    const titleKey = isPartial ? 'errors.onlyPartialDataForIndicators' : 'errors.noDataForIndicators';
    showPopup(
        <Message messageKey={titleKey} bundleKey={BUNDLE_KEY} messageArgs={{indicators: errors.length}}/>,
        (<LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <Popup errors={errors}/>
        </LocaleProvider>), () => {}, POPUP_OPTIONS);
};
const getSelection = selections => Object.values(selections).join(' / ');

const getInvalidSerie = ({ invalids, all }) => {
    if (!Array.isArray(invalids) || !Array.isArray(all)) {
        return '';
    }
    let start;
    let end;
    let rangeCounter = 0;

    const reset = () => {
        start = null;
        end = null;
        rangeCounter = 0;
    };

    const addRange = () => {
        if (!rangeCounter) {
            return 0;
        }
        if (rangeCounter >= 3) {
            invalidRanges.push(start + ' - ' + end);
            return;
        }
        invalidRanges.push(start);
        if (start !== end) {
            invalidRanges.push(end);
        }
    };

    const invalidRanges = [];
    all.sort();
    all.forEach(val => {
        if (!invalids.includes(val)) {
            addRange();
            reset();
            return;
        }
        start = start || val;
        end = val;
        rangeCounter++;
    });
    if (rangeCounter !== 0) {
        addRange();
    }
    return invalidRanges.join(', ');
};
