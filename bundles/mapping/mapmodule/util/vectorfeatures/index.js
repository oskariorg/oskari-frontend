import { WFS_ID_KEY, WFS_FTR_ID_KEY } from '../../domain/constants';

export const getFeatureId = feature => feature.id || feature.properties[WFS_ID_KEY] || feature.properties[WFS_FTR_ID_KEY];
