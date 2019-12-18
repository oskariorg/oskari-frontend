import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { List, ListItem, Icon, Message } from 'oskari-ui';
import { LocaleConsumer } from 'oskari-ui/util';
import { UserStyleRow } from './UserStyles/UserStyleRow';

// TODO: Fix this once style accessible smarter way
const secondaryColor = '#006ce8';

const Header = styled.div`
    display: flex;
    margin-bottom: 10px;
`;

const HeaderText = styled.div`
    padding-top: 10px;
    font-weight: bold;
    flex: 0 0 300px;
`;

const AddStyle = styled.div`
    font-weight: bold;
    text-align: center;
    flex-grow: 1;
    background-color: #ffffff;
    padding: 10px;
    cursor: pointer;
    color: ${secondaryColor};
`;

const AddStyleText = styled.div`
    display: inline-block;
`;

const StyledListItem = styled(ListItem)`
    &:nth-child(even) {
        background-color: #f3f3f3;
    }
    &:nth-child(odd) {
        background-color: #ffffff;
    }
    border-style: solid;
    border-width: 0.5px;
    border-color: #d9d9d9;
`;

const AddStyleIcon = styled(Icon)`
    margin-right: 10px;
`;

const showVisualizationForm = (layerId, styleId, isCreateNew) => {
    Oskari.getSandbox().postRequestByName('ShowOwnStyleRequest', [layerId, styleId, isCreateNew]);
};

const UserStyles = ({ layerId, styles, removeUserStyleHandler }) => {
    return (
        <div>
            <Header>
                <Message messageKey='styles' LabelComponent={HeaderText} />
                <AddStyle onClick={() => showVisualizationForm(layerId, undefined, true)}>
                    <AddStyleIcon type="plus"/>
                    <Message messageKey='add-style' LabelComponent={AddStyleText}/>
                </AddStyle>
            </Header>
            { styles && styles.length > 0 &&
            <List bordered={false} dataSource={styles} renderItem={styleWithMetadata => {
                return (
                    <StyledListItem>
                        <UserStyleRow styleName={styleWithMetadata.name}
                            editUserStyleHandler={() => showVisualizationForm(layerId, styleWithMetadata.style.id, false)}
                            removeUserStyleHandler={() => removeUserStyleHandler(layerId, styleWithMetadata.style.id)}/>
                    </StyledListItem>
                );
            }}/>
            }
        </div>
    );
};

UserStyles.propTypes = {
    layerId: PropTypes.number.isRequired,
    styles: PropTypes.array.isRequired,
    removeUserStyleHandler: PropTypes.func.isRequired
};

const contextWrap = LocaleConsumer(UserStyles);
export { contextWrap as UserStyles };
