
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

export const normalizeRegionsets = (regionset) => {
    if (!regionset) {
        // log error message
        return [];
    }
    let missingRegionsetNamesCount = 0;
    const emptyNameGenerator = () => {
        return `${Oskari.getMsg('StatsGrid', 'missing.regionsetName')} ${++missingRegionsetNamesCount}`;
    };

    if (Array.isArray(regionset)) {
        // if(typeof ds === 'array') -> loop and add all
        return regionset.map(item => normalizeSingleRegionset(item, emptyNameGenerator))
            .filter(item => item !== null);
    }
    return [normalizeSingleRegionset(regionset, emptyNameGenerator)]
        .filter(item => item !== null);
};

const normalizeSingleRegionset = (regionset, emptyNameGenerator) => {
    if (!regionset) {
        // log error message
        return null;
    }
    if (!regionset.id) {
        console.warn('Ignoring regionset without id:', regionset);
        return null;
    }
    // normalize to always have name
    return {
        ...regionset,
        name: regionset.name || emptyNameGenerator()
    };
};
