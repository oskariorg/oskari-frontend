const PROTOCOL = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
const WWW = /(^|[^/])(www\.[\S]+(\b|$))/gim;

const loc = Oskari.getMsg.bind(null, 'catalogue.metadata');
let langLoc = null;

const getLocalizedLanguage = lang => {
    if (langLoc) {
        return langLoc[lang] || lang;
    }
    langLoc = Oskari.getMsg('DivManazer', 'LanguageSelect.languages');
    if (typeof langLoc === 'string') {
        Oskari.log('MetadataHandler').warn('Failed to get localization object for languages.');
    }
    return getLocalizedLanguage(lang);
};

const prettifyString = value => typeof value === 'string' ? value.split('\n').filter(notEmpty => notEmpty).map(str => linkify(str)) : '';

const prettifyList = value => Array.isArray(value) ? value.map(prettifyString).flat() : [];

const getTypedString = (value, type) => type ? `${value} (${type})` : value;

const getRangeList = (list = []) => {
    return list.map(obj => {
        const { begin, end } = obj || {};
        if (!begin && !end) {
            return '';
        }
        return `${begin} - ${end}`;
    }).filter(notEmpty => notEmpty);
};

const getParties = (parties = []) => {
    return parties.map(p => ({ label: p.organisationName, items: p.electronicMailAddresses }));
};

const getCodes = (codes = [], type) => {
    const locCodes = loc(`codes.${type}`);
    return codes.map(code => locCodes[code] || { label: code });
};

const getCitationDate = citation => {
    const { date, dateType } = citation?.date || {};
    const formatted = Oskari.util.formatDate(date);
    const { label, description } = loc(`codes.gmd:CI_DateTypeCode.${dateType}`) || {};
    return { label: getTypedString(formatted, label), description };
};

const linkify = value => {
    const parts = [];
    // some metadata has a-tags inside content
    const aTagStart = value.indexOf('<a');
    if (aTagStart !== -1) {
        const end = value.indexOf('</a>') + 4;
        const content = value.substring(aTagStart, end);
        const label = content.substring(content.indexOf('>') + 1, content.lastIndexOf('<'));
        const url = content.match(PROTOCOL)[0] || content.match(WWW)[0];
        if (aTagStart > 0) {
            parts.push(value.substring(0, aTagStart));
        }
        parts.push({ label, url });
        const rest = value.substring(end);
        if (rest) {
            parts.push(rest);
        }
        return parts;
    }

    const url = (value.match(PROTOCOL) || value.match(WWW))?.[0];
    if (url) {
        if (url.length === value.length) {
            return { url };
        }
        const start = value.indexOf(url);
        const end = start + url.length;
        if (start > 0) {
            parts.push(value.substring(0, start));
        }
        parts.push({ url });
        const rest = value.substring(end);
        if (rest) {
            parts.push(rest);
        }
        return parts;
    }
    return value;
};

export const mapResponseForRender = response => {
    const mapIdentification = ide => ({
        abstractText: prettifyString(ide.abstractText),
        accessConstraints: getCodes(ide.accessConstraints, 'gmd:MD_RestrictionCode'),
        browseGraphics: ide.browseGraphics,
        citation: {
            ...ide.citation,
            date: getCitationDate(ide.citation),
            resourceIdentifiers: ide.citation.resourceIdentifiers?.map(ind => `${ind.codeSpace}.${ind.code}`)
        },
        classifications: getCodes(ide.classifications, 'gmd:MD_ClassificationCode'),
        descriptiveKeywords: prettifyList(ide.descriptiveKeywords),
        languages: ide.languages?.map(getLocalizedLanguage),
        operatesOn: ide.operatesOn,
        otherConstraints: prettifyList(ide.otherConstraints),
        responsibleParties: getParties(ide.responsibleParties),
        serviceType: getTypedString(ide.serviceType, ide.serviceTypeVersion),
        spatialRepresentationTypes: getCodes(ide.spatialRepresentationTypes, 'gmd:MD_SpatialRepresentationTypeCode'),
        spatialResolutions: ide.spatialResolutions?.map(res => `1:${res}`),
        temporalExtents: getRangeList(ide.temporalExtents),
        topicCategories: getCodes(ide.topicCategories, 'gmd:MD_TopicCategoryCode'),
        type: ide.type,
        useLimitations: prettifyList(ide.useLimitations)
    });

    const {
        identifications = [],
        scopeCodes,
        metadataCharacterSet,
        metadataResponsibleParties,
        distributionFormats,
        lineageStatements,
        metadataDateStamp,
        metadataLanguage,
        ...noNeedToModify
    } = response;

    const metadata = {
        ...noNeedToModify,
        scopeCodes: getCodes(scopeCodes, 'gmd:MD_ScopeCode'),
        lineageStatements: prettifyList(lineageStatements),
        metadataDateStamp: Oskari.util.formatDate(metadataDateStamp),
        metadataLanguage: getLocalizedLanguage(metadataLanguage),
        distributionFormats: distributionFormats?.map(format => getTypedString(format.name, format.version)),
        metadataCharacterSet: loc('codes.gmd:MD_CharacterSetCode')[metadataCharacterSet] || metadataCharacterSet,
        metadataResponsibleParties: getParties(metadataResponsibleParties)
    };
    return { identifications: identifications.map(mapIdentification), metadata };
};
