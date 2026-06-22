import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import styled from 'styled-components';
import { PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';

const StyledContent = styled('div')`
    margin: 12px 24px 24px;
    min-width: 300px;
`;

const DataSection = styled('div')`
    margin-bottom: 20px;
`;

const createLink = (item) => {
    if (typeof item === 'string') return item;
    if (!item || !item.name) return null;
    if (!item.url) return item.name;
    return <a href={item.url} target='_blank'>{item.name}</a>;
};

const formatSource = (item) => {
    console.log(item);
    let { source: src } = item;
    const { id = '' } = item;
    const prefixIndex = ('' + id).indexOf('_');
    let prefix = '';
    if (prefixIndex !== -1) {
        prefix = id.substring(0, prefixIndex);
    }
    let source = [];
    if (prefix) {
        // TODO: search localization for prefix (myf -> My features and wrap in a span with class to be used as selector for hiding, if localization not found, just use src as is)
        // TODO: if src is empty/null -> replace with string from localization like "Unknown"
        // TODO: if layer type is actual MyFeatures layer == we are in the geoportal -> do something different
        src = prefix + ' ' + src;
    }
    if (!src) return source;
    if (Array.isArray(src)) {
        source = src.map(s => createLink(s));
        return source;
    } else {
        source.push(createLink(src));
    }
    return source;
};

export const PopupContent = ({ dataProviders, onClose }) => {
    return (
        <StyledContent>
            {dataProviders.map(data => (
                <DataSection key={data.id}>
                    <h4>{data.name}</h4>
                    <div>
                        {data.items.map(item => (
                            <div key={item.id}>
                                {item.name} {formatSource(item).map((src, index, arr) => {
                                    if (!src) return;
                                    if (arr.length > 1 && index < (arr.length - 1)) {
                                        return <span key={index}>{index === 0 && (' - ')}{src} - </span>
                                    } else {
                                        return <span key={index}>{index === 0 && (' - ')}{src}</span>
                                    }
                                })}
                            </div>
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
    }
    return showPopup(title, <PopupContent dataProviders={dataProviders} onClose={onClose} />, onClose, options);
};
