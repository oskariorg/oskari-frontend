import React, { useState } from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { LocaleProvider } from 'oskari-ui/util';
import { Message, Select, Option } from 'oskari-ui';
import styled from 'styled-components';

const Content = styled('div')`
    margin: 12px 24px 24px;
    min-width: 300px;
    display: flex;
    flex-direction: column;
`;

const LegendContainer = styled('div')`
    margin-top: 10px;
`;

const Legend = styled('div')`
    display: flex;
    flex-direction: column;
`;

const SelectContainer = styled('div')`
    display: flex;
    flex-direction: column;
`;

const BUNDLE_KEY = 'maplegend';

const MapLegendPopup = ({ legends, getLegendImage }) => {
    const [selected, setSelected] = useState(legends && legends.length > 0 ? legends[0].id : null);
    const [legend, setLegend] = useState(legends && legends.length > 0 ? getLegendImage(legends[0].id) : null);
    const onChange = (value) => {
        setSelected(value);
        setLegend(getLegendImage(value));
    };
    
    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <Content>
                {legends && legends.length > 1 && (
                    <SelectContainer>
                        <Message bundleKey={BUNDLE_KEY} messageKey='infotext' />
                        <Select value={selected} onChange={onChange} className="t_legends">
                            {
                                legends.map(l =>
                                    <Option key={l.id} value={l.id}>
                                        {l.title}
                                    </Option>
                                )
                            }
                        </Select>
                    </SelectContainer>
                )}
                {!legends || legends.length === 0 && (<Message bundleKey={BUNDLE_KEY} messageKey='noLegendsText' />)}
                <LegendContainer>
                    {!legend || legend === null || legend === 'null' ? (
                        <Message bundleKey={BUNDLE_KEY} messageKey='invalidLegendUrl' />
                    ) : (
                        <Legend>
                            {legends.length === 1 && (<Message bundleKey={BUNDLE_KEY} messageKey='singleLegend' />)}
                            <a href={legend} target="_blank"><Message bundleKey={BUNDLE_KEY} messageKey='newtab' className="t_newtab" /></a>
                            <img src={legend} />
                        </Legend>
                    )}
                </LegendContainer>
            </Content>
        </LocaleProvider>
    );
};

export const showMapLegendPopup = (legends, getLegendImage, onClose) => {
    return showPopup(<Message bundleKey={BUNDLE_KEY} messageKey='title' />, <MapLegendPopup legends={legends} getLegendImage={(id) => getLegendImage(id)}/>, onClose);
};