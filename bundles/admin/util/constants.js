export const ROLE_TYPES = {
    GUEST: 'anonymous',
    USER: 'user',
    ADMIN: 'admin'
};
export const ADDITIONAL_ROLE_TYPE = 'additional';

export const PUBLISHED = 'VIEW_PUBLISHED';
export const SYSTEM_PERMISSIONS = ['VIEW_LAYER', 'VIEW_PUBLISHED', 'PUBLISH', 'DOWNLOAD'];

export const DEFAULT_PERMISSIONS = {
    [ROLE_TYPES.GUEST]: SYSTEM_PERMISSIONS.slice(0, 2),
    [ROLE_TYPES.USER]: SYSTEM_PERMISSIONS.slice(0, 3),
    [ROLE_TYPES.ADMIN]: []
};
