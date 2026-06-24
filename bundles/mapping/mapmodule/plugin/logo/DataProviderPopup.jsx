import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import { styled } from 'styled-components';
import { PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';

const StyledContent = styled('div')`
    margin: 12px 24px 24px;
    min-width: 300px;
`;

const DataSection = styled('div')`
    margin-bottom: 20px;
`;

// id can be number like 801 or a string like:
// - 'STATS_LAYER' as ref to thematic map layer
// - myf_[uuid] as ref to myfeatures layer
// - 1_7 as ref to statistic indicator from datasource 1 and indicator 7
const getIdPrefix = id => {
    if (typeof id !== 'string') {
        // number
        return null;
    }
    const prefixIndex = id.indexOf('_');
    if (prefixIndex === -1) {
        return null;
    }
    return id.substring(0, prefixIndex);
};

const SourcePrefix = ({ itemId }) => {
    const prefix = getIdPrefix(itemId);
    if (!prefix) {
        return null;
    }
    // search localization for prefix (myf -> My features)
    // if we found a localization -> add the localization wrapped in a span with class to be used as selector for hiding
    // if localization not found, don't add anything to the UI
    // TODO: if layer type is actual MyFeatures layer == we are in the geoportal -> do something different (now we get layer name<span> - Own datasets</span> - Own datasets (from organization))
    const localeString = Oskari.getMsg('MapModule', `plugin.LogoPlugin.layerPrefix.${prefix}`, null, null);
    if (localeString) {
        return <span className={'logoplugin-dataprovider-prefix-' + prefix}> - { localeString } </span>;
    }
    return null;
};

const createLink = (item) => {
    if (!item && !item.name) {
        // missing src replaced with string from localization like "Unknown"
        return Oskari.getMsg('MapModule', `plugin.LogoPlugin.unknownSource`, null, null);
    }
    if (typeof item === 'string') {
        return item;
    }
    if (!item.url) {
        return item.name;
    }
    return <a href={item.url} rel='noreferrer' target='_blank'>{item.name}</a>;
};

const formatSource = (source) => {
    if (!source) {
        return [Oskari.getMsg('MapModule', `plugin.LogoPlugin.unknownSource`, null, null)];
    }
    if (Array.isArray(source)) {
        return source.map(s => createLink(s));
    }
    return [createLink(source)];
};

const DataProviderSource = ({item}) => {
    const sources = formatSource(item.source).filter(item => item !== null);
    if (!sources.length) {
        return null;
    }
    return (<React.Fragment><SourcePrefix itemId={item.id} /> {sources.map((src, index) => {
        return (<React.Fragment key={index}> - {src}</React.Fragment>);
    })}</React.Fragment>);
};

export const PopupContent = ({ dataProviders, onClose }) => {
    return (
        <StyledContent>
            {dataProviders.map(data => (
                <DataSection key={data.id}>
                    <h4>{data.name}</h4>
                    <div>
                        {data.items.map(item => (
                            <div key={item.id}>{item.name}<DataProviderSource item={item} /></div>
                        ))}
                    </div>
                </DataSection>
            ))}
            <ButtonContainer>
                <PrimaryButton type="close" onClick={onClose} />
            </ButtonContainer>
        </StyledContent>
    );
};

export const showDataProviderPopup = (title, dataProviders, onClose) => {
    const mapModule = Oskari.getSandbox().findRegisteredModuleInstance('MainMapModule');
    const options = {
        id: 'dataProviders',
        theme: mapModule.getMapTheme()
    };
    return showPopup(title, <PopupContent dataProviders={dataProviders} onClose={onClose} />, onClose, options);
};
