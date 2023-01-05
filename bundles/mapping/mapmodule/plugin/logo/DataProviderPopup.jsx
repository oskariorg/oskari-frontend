import React from 'react';
import { showPopup } from 'oskari-ui/components/window';
import styled from 'styled-components';
import { PrimaryButton, ButtonContainer } from 'oskari-ui/components/buttons';

const StyledContent = styled('div')`
    margin: 12px 24px 24px;
    min-width: 300px;
`;

const createLink = (item) => {
    if (typeof item === 'string') return item;
    if (!item.url) return item.name;
    const link = <a href={item.url} target='_blank'>{item.name}</a>
    return link;
};

const formatSource = (src) => {
    if (!src) return '';
    let source;
    if (Array.isArray(src)) {
        source = src.map(s => createLink(s));
        return source.join(' - ')
    } else {
        return createLink(src);

    }
};

export const PopupContent = ({ dataProviders, onClose }) => {
    return (
        <StyledContent>
            {dataProviders.map(data => (
                <div key={data.id}>
                    <h4>{data.name}</h4>
                    <div>
                        {data.items.map(item => (
                            <div key={item.id}>
                                {item.name} - {formatSource(item.source)}
                            </div>
                        ))}
                    </div>
                </div>
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
