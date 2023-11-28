
export const normalizeDatasources = (ds) => {
    if (!ds) {
        // log error message
        return [];
    }
    if (Array.isArray(ds)) {
        // if(typeof ds === 'array') -> loop and add all
        return ds.map(item => normalizeSingleDatasource(item))
            .filter(item => item !== null);
    }
    return [normalizeSingleDatasource(ds)]
        .filter(item => item !== null);
};

const normalizeSingleDatasource = (ds) => {
    if (!ds) {
        // log error message
        return null;
    }
    // normalize to always have info-object (so far only holds optional description url of service with "url" key)
    return {
        ...ds,
        info: ds.info || {}
    };
};
