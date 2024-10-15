const PROTOCOL = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gim;
const WWW = /(^|[^/])(www\.[\S]+(\b|$))/gim;

const loc = Oskari.getMsg.bind(null, 'catalogue.metadata');
let langLoc = null;

export const getUrl = content => {
    if (typeof content !== 'string') {
        return '';
    }
    const url = content.match(PROTOCOL);
    if (url && url.length) {
        return url[0];
    }
    const www = content.match(WWW);
    if (www && www.length) {
        return 'http://' + www[0];
    }
    return '';
};

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

export const prettifyParagraph = (value, linkify) => {
    if (typeof value !== 'string') {
        return '';
    }
    // Paragraphs are rendered to own elements => trim and remove empty
    let splitted = value.split('\n').map(p => p.trim()).filter(notEmpty => notEmpty);
    if (linkify !== false) {
        splitted = splitted.map(p => linkifyParagraph(p));
    }
    return splitted.length === 1 ? splitted[0] : splitted;
};

const prettifyList = value => Array.isArray(value) ? value.map(prettifyParagraph).flat() : [];

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

export const linkifyParagraph = value => {
    const parseATags = (value) => {
        const start = typeof value === 'string' ? value.indexOf('<a') : -1;
        if (start === -1) {
            return value;
        }
        const end = value.indexOf('</a>') + 4;
        const content = value.substring(start, end);
        const label = content.substring(content.indexOf('>') + 1, content.lastIndexOf('<'));
        const url = getUrl(content);
        const parts = [];
        if (start > 0) {
            parts.push(value.substring(0, start));
        }
        parts.push({ label, url });
        const rest = value.substring(end);
        if (rest) {
            const parsed = parseATags(rest);
            if (Array.isArray(parsed)) {
                parts.push(...parsed);
            } else {
                parts.push(parsed);
            }
        }
        return parts;
    };
    const parseUrls = (value) => {
        const url = typeof value === 'string' ? getUrl(value) : null;
        if (!url) {
            return value;
        }
        const start = value.indexOf(url);
        const end = start + url.length;
        const parts = [];
        if (start > 0) {
            parts.push(value.substring(0, start));
        }
        parts.push({ url });
        const rest = value.substring(end);
        if (rest) {
            const parsed = parseUrls(rest);
            if (Array.isArray(parsed)) {
                parts.push(...parsed);
            } else {
                parts.push(parsed);
            }
        }
        return parts;
    };
    // some metadata has a-tags inside content
    // parse first a-tags as them contains urls
    let parsed = parseATags(value);
    parsed = Array.isArray(parsed)
        ? parsed.map(parseUrls).flat()
        : parseUrls(parsed);
    return Array.isArray(parsed) && parsed.length === 1 ? parsed[0] : parsed;
};

export const mapResponseForRender = response => {
    const mapIdentification = ide => ({
        abstractText: prettifyParagraph(ide.abstractText),
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
        responsibleParties: ide.responsibleParties,
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
        metadataCharacterSet: loc('codes.gmd:MD_CharacterSetCode')[metadataCharacterSet] || metadataCharacterSet
    };
    return { identifications: identifications.map(mapIdentification), metadata };
};
