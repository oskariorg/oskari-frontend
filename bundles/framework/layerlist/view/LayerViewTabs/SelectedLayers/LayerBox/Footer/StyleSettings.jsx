import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { Select, Option, InputGroup, Button, Message } from 'oskari-ui';
import { LocaleConsumer } from 'oskari-ui/util';
import { THEME_COLOR } from '..';
import { EditOutlined } from '@ant-design/icons';
import { Row, Col } from '../Grid';

const StyledSelect = styled(Select)`
    width: 120px;
`;
const Label = styled('div')`
    width: 40px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-right: 5px;
`;

const handleOwnStyleClick = ownStyleCallback => {
    if (typeof ownStyleCallback === 'function') {
        ownStyleCallback();
    }
};

const getOption = (style) => (
    <Option key={style.getName()} value={style.getName()}>
        {style.getTitle()}
    </Option>
);

export const StyleSettings = LocaleConsumer(({ layer, onChange }) => {
    const styles = layer.getStyles();

    /**
     * ownStyle = wfs layers (added in WfsLayerModelBuilder)
     * editStyle = myplaces & userlayers (added in MyPlacesLayerModelBuilder)
     */
    const ownStyle = layer.getTool('ownStyle');
    const editStyle = layer.getTool('editStyle');

    const styleTool = ownStyle || editStyle;
    const currentStyle = layer.getCurrentStyle();

    if (!styleTool && styles.length < 2) {
        return null;
    }

    return (
        <Fragment>
            <Row>
                {!editStyle && (
                    <Message messageKey={'layer.styles.title'} LabelComponent={Label} />
                )}
                <Col>
                    <InputGroup>
                        {!editStyle && (
                            <StyledSelect
                                value={currentStyle.getName()}
                                disabled={styles.length < 2}
                                onChange={onChange}
                                popupMatchSelectWidth={false}
                            >
                                { styles.length < 2 &&
                                    getOption(currentStyle)
                                }
                                { styles.length >= 2 &&
                                    styles.map(getOption)
                                }
                            </StyledSelect>
                        )}
                        { styleTool &&
                            <Button style={{ paddingLeft: '5px', paddingRight: '5px' }}
                                onClick={() => handleOwnStyleClick(styleTool.getCallback())}>
                                <EditOutlined style={{ color: THEME_COLOR, fontSize: '16px' }}/>
                            </Button>
                        }
                    </InputGroup>
                </Col>
            </Row>
        </Fragment>
    );
});
StyleSettings.propTypes = {
    layer: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
};
