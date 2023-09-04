import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { FilterOutlined, BgColorsOutlined } from '@ant-design/icons';
import { Message, List, ListItem, Radio, Tooltip, Badge } from 'oskari-ui';
import { IconButton } from 'oskari-ui/components/buttons';
import { Controller } from 'oskari-ui/util';
import styled from 'styled-components';

const StyledItem = styled(ListItem)`
    & {
        background: #ffffff;
        line-height: 30px;
        padding: 4px 11px;
    }
`;

const ButtonContainer = styled.div`
    margin-left: auto;
    display: flex;
    Button {
        margin-left: 10px;
    }
`;

const EmptySelect = styled.div`
    background: #ffffff;
    line-height: 30px;
    padding: 4px 11px;
    width: 100%;
`;

const StyledText = styled.span`
    font-style: italic;
    font-size: 0.875em;
    padding-right: 10px;
    color: ${props => props.color}
`;

const renderStatus = (status) => {
    const color = status === 'DELETED' ? '#FF0000' : null;
    return (
        <StyledText color={color}>
            ({status})
        </StyledText>
    );
};

export const VectorStyleSelect = ({ layer, controller, editStyle, editOptional }) => {
    const { vectorStyles = [], vectorStyleStatus = {} } = layer;

    if (vectorStyles.length === 0) {
        return (
            <EmptySelect>
                <Message messageKey='styles.vector.validation.noStyles' />
            </EmptySelect>
        );
    }

    const sortedStyles = vectorStyles.slice()
        .sort((a, b) => Oskari.util.naturalSort(a.name, b.name));

    const selectedStyle = layer.style;

    return (
        <List
            dataSource={ sortedStyles }
            renderItem={ (style) => {
                const status = vectorStyleStatus[style.id];
                const btnProps = {
                    disabled: status === 'DELETED',
                    bordered: true
                };
                return (
                    <StyledItem>
                        <Tooltip title={ <Message messageKey='styles.vector.selectDefault' /> }>
                            <Radio.Choice onClick={ () => controller.setStyle(style.id) } checked={ style.id === selectedStyle }>{ style.name || style.id }</Radio.Choice>
                        </Tooltip>

                        <StyledText>
                            ({style.type})
                        </StyledText>
                        { style.id === selectedStyle &&
                            <StyledText>
                                (<Message messageKey='styles.default' />)
                            </StyledText>
                        }
                        { status && renderStatus(status) }
                        <ButtonContainer>
                            { style.type === 'oskari' && (
                                <Fragment>
                                    <Badge themed count={style.style.optionalStyles?.length || 0} showZero={false}>
                                        <IconButton { ...btnProps } icon={<FilterOutlined />}
                                            title={ <Message messageKey='styles.vector.optionalStyles' /> }
                                            onClick={ () => editOptional(style) } />
                                    </Badge>
                                    <IconButton { ...btnProps } icon={<BgColorsOutlined />}
                                        title={ <Message messageKey='styles.vector.edit.editor' /> }
                                        onClick={ () => editStyle('editor', style) } />
                                </Fragment>)
                            }
                            <IconButton type='edit' { ...btnProps }
                                title={ <Message messageKey='styles.vector.edit.json' /> }
                                onClick={ () => editStyle('json', style) } />
                            <IconButton type='delete' { ...btnProps }
                                onClick={ () => controller.removeVectorStyleFromLayer(style.id) } />
                        </ButtonContainer>
                    </StyledItem>
                );
            }}
        />
    );
};

VectorStyleSelect.propTypes = {
    layer: PropTypes.object.isRequired,
    controller: PropTypes.instanceOf(Controller).isRequired,
    editStyle: PropTypes.func.isRequired,
    editOptional: PropTypes.func
};
