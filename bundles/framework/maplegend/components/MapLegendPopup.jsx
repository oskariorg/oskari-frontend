import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { showPopup } from 'oskari-ui/components/window';
import { LocaleProvider } from 'oskari-ui/util';
import { Message } from 'oskari-ui';
import styled from 'styled-components';
import { LegendSelect } from './LegendSelect';
import { LegendImage } from './LegendImage';

const BUNDLE_KEY = 'maplegend';

const Content = styled('div')`
    margin: 12px 24px 24px;
    min-width: 200px;
    display: flex;
    flex-direction: column;
`;

const Margin = styled('div')`
    margin-top: 10px;
`;

const MapLegendPopup = ({ legends, getLegendImage }) => {
    const [selected, setSelected] = useState(legends.length > 0 ? legends[0].id : null);
    const [legend, setLegend] = useState(legends.length > 0 ? getLegendImage(legends[0].id) : null);
    const onChange = (value) => {
        setSelected(value);
        setLegend(getLegendImage(value));
    };
    return (
        <LocaleProvider value={{ bundleKey: BUNDLE_KEY }}>
            <Content>
                <LegendSelect
                    legends={legends}
                    selected={selected}
                    onChange={onChange} />
                <Margin />
                <LegendImage url={legend} />
            </Content>
        </LocaleProvider>
    );
};

MapLegendPopup.propTypes = {
    legends: PropTypes.array.isRequired,
    getLegendImage: PropTypes.func.isRequired
};

export const showMapLegendPopup = (legends, getLegendImage, onClose) => {
    const mapModule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
    const options = {
        id: BUNDLE_KEY,
        theme: mapModule.getMapTheme()
    };
    return showPopup(<Message bundleKey={BUNDLE_KEY} messageKey='title' />, <MapLegendPopup legends={legends} getLegendImage={(id) => getLegendImage(id)}/>, onClose, options);
};
