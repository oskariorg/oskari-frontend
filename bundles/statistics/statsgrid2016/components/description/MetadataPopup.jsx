
import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { Message } from 'oskari-ui';
import { LocaleProvider } from 'oskari-ui/util';
import { MetadataCollapse } from './MetadataCollapse';

export const prepareData = (service, datasource, indicators, done) => {
    let counter = 0;
    const result = [];
    const indicatorList = Array.isArray(indicators) ? indicators : indicators ? [indicators] : [];
    const count = () => {
        counter++;
        if (counter >= indicatorList.length) {
            done(result);
        }
    };
    indicatorList.forEach(ind => {
        service.getIndicatorMetadata(datasource, ind, (err, data) => {
            if (err || !data) {
                count();
                return;
            }
            result.push({
                name: data.name,
                desc: data.description,
                source: data.source,
                metadata: data.metadata
            });
            count();
        });
        
    });  
};

export const showMedataPopup = (data = [], onClose) => {
    return showPopup(
        <Message messageKey="metadataPopup.title" bundleKey="StatsGrid" messageArgs={{indicators: data.length}}/>,
        (<LocaleProvider value={{ bundleKey: 'StatsGrid' }}>
            <MetadataCollapse data={data} />
        </LocaleProvider>), onClose);
};
