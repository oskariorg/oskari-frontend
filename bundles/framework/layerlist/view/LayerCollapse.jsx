import React from 'react';
import PropTypes from 'prop-types';
import { Collapse } from '../../../admin/admin-layereditor/components/Collapse';
import { Alert } from '../../../admin/admin-layereditor/components/Alert';
import { LayerCollapsePanel } from './LayerCollapse/LayerCollapsePanel';
import styled from 'styled-components';

const StyledCollapse = styled(Collapse)`
    border-radius: 0 !important;
    &>div {
        border-radius: 0 !important;
    }
`;
const StyledAlert = styled(Alert)`
    margin: 10px;
`;

const getNoResultsProps = locale => {
    const alertProps = {
        description: locale.errors.noResults,
        type: 'info',
        showIcon: true
    };
    return alertProps;
};

export const LayerCollapse = ({ locale, groups, openGroupTitles, filtered, mutator, ...rest }) => {
    if (!Array.isArray(groups) || groups.length === 0 || (filtered && filtered.length === 0)) {
        return <StyledAlert {...getNoResultsProps(locale)}/>;
    }
    const panels = (filtered || groups).map(cur => ({
        group: cur.group || cur,
        showLayers: cur.layers || cur.getLayers()
    }));
    return (
        <StyledCollapse bordered activeKey={openGroupTitles} onChange={keys => mutator.updateOpenGroupTitles(keys)}>
            {
                panels.map(pnlProps =>
                    <LayerCollapsePanel key={pnlProps.group.getTitle()}
                        mutator={mutator}
                        locale={locale}
                        {...pnlProps}
                        {...rest}/>
                )
            }
        </StyledCollapse>
    );
};

LayerCollapse.propTypes = {
    locale: PropTypes.any.isRequired,
    mutator: PropTypes.any.isRequired,
    groups: PropTypes.array,
    openGroupTitles: PropTypes.array,
    filtered: PropTypes.array
};
