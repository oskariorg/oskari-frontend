import React from 'react';
import styled from 'styled-components';

const NonIconLink = styled('div')`
    display: inline-block;
    margin: 5px;
`;

const Link = styled('div')`
    display: inline-block;
`;

const Container = styled('div')`
    display: flex;
`;

const StyledLogo = styled('img')`
    display: inline-block;
    width: 25px;
    height: 25px;
    cursor: pointer;
`;

export const Links = ({ links }) => {
    const labels = [];
    links.forEach(link => {
        const callback = typeof link.options.callback === 'function' ? link.options.callback : null;
        if (link.options.id !== 'icon') {
            labels.push(
                <NonIconLink key={link.options.id} className={link.options.id && link.options.id.toLowerCase()}><a onClick={callback ? callback : null}>{link.title}</a></NonIconLink>
            );
        } else {
            if (link.options.src) {
                // additional classes:
                // - icon (link.options.id) for compatibility for overrides <2.10
                // - logo for an additional identifier and override enabler for 2.10+
                labels.push(
                    <StyledLogo key={link.options.id} className={link.options.id + ' logo'} src={link.options.src} onClick={callback ? callback : null} />
                );
            } else {
                labels.push(
                    <Link key={link.options.id} className={link.options.id && link.options.id.toLowerCase()}><a onClick={callback ? callback : null}>{link.title}</a></Link>
                )
            }
        }
    });
    return (
        <Container>
            {labels}
        </Container>
    );
};
