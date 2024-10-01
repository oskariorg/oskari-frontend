import { StateHandler, controllerMixin, Messaging } from 'oskari-ui/util';

class MetadataHandler extends StateHandler {
    constructor (instance) {
        super();
        this.instance = instance;
        this.setState({
            activeTab: 'basic',
            loading: false,
            layers: [],
            showFullGraphics: false,
            hideMetadataXMLLink: !!instance.conf?.hideMetadataXMLLink,
            isEmbedded: Oskari.dom.isEmbedded(),
            metadata: {},
            identifications: []
        });
    }

    setActiveTab (activeTab) {
        this.updateState({ activeTab });
    }

    toggleShowFullGraphics () {
        const { showFullGraphics } = this.getState();
        this.updateState({ showFullGraphics: !showFullGraphics });
    }

    toggleMapLayerVisibility ({ layerId, isVisible, isSelected }) {
        const sb = this.instance.getSandbox();
        if (isSelected && isVisible) {
            sb.postRequestByName('RemoveMapLayerRequest', [layerId]);
        } else if (isSelected) {
            sb.postRequestByName('MapModulePlugin.MapLayerVisibilityRequest', [layerId, true]);
        } else {
            sb.postRequestByName('AddMapLayerRequest', [layerId]);
        }
    }

    onMapLayerEvent (layer) {
        if (!layer) {
            return;
        }
        const { layers } = this.getState();
        const layerId = layer.getId();
        const isVisible = layer.isVisible();
        const isSelected = Oskari.getSandbox().isLayerAlreadySelected(layer.getId());
        this.updateState({ layers: layers.map(layer => layer.layerId === layerId ? { ...layer, isVisible, isSelected } : layer) });
    }

    fetchMetadata ({ layerId, uuid }) {
        this.updateState({ loading: true, metadata: {}, identifications: [], layers: [] });

        const srs = this.instance.getSandbox().getMap().getSrsName();
        const lang = Oskari.getLang();
        const route = Oskari.urls.getRoute('GetCSWData', { layerId, uuid, lang, srs });
        fetch(route, {
            method: 'GET',
            headers: {
                Accept: 'application/json'
            }
        }).then(response => {
            if (!response.ok) {
                Messaging.error(this.instance.loc('advancedSearch.fetchAdvancedSearchOptionsFailed'));
            }
            return response.json();
        }).then(json => {
            const { metadata, identifications } = this._mapResponseForRender(json);
            const layers = this._getLayers(uuid || metadata.fileIdentifier);
            this.updateState({ loading: false, metadata, layers, identifications });
        }).catch(error => {
            this.updateState({ loading: false });
            Oskari.log('MetadataHandler').error(error);
        });
    }

    _getLayers(uuid) {
        if (Oskari.dom.isEmbedded()) {
            return [];
        }
        const selected = Oskari.getSandbox().findAllSelectedMapLayers().map(l => l.getId());
        return this.instance.getLayerService()?.getLayersByMetadataId(uuid).map(l => ({
            layerId: l.getId(),
            isVisible: l.isVisible(),
            name: l.getName(),
            isSelected: selected.includes(l.getId())
        })) || [];
    }

    _mapResponseForRender (response) {
        let langLoc = Oskari.getMsg('DivManazer', 'LanguageSelect.languages');
        if (typeof langLoc === 'string') {
            langLoc = {};
            Oskari.log('MetadataHandler').warn('Failed to get localization for languages.');
        }
        const prettifyString = value => typeof value === 'string' ? value.split('\n').filter(notEmpty => notEmpty) : '';
        const prettifyList = value => Array.isArray(value) ? value.map(prettifyString).flat() : [];
        const linkify = value => {
            const separator = value.indexOf('://');
            if (separator === -1) {
                // TODO: how to mark url inside paragraph
                // linkifyjs or replace with a tag doesn't work with react (without dangerous insert)
                // splitting to [...p, { url, label }, p...] => handle list of lists (new tag on for parent list)
            }
        };
        const getCodes = (codes = [], type) => {
            const locCodes = this.instance.loc(`codes.${type}`);
            return codes.map(code => locCodes[code] || { label: code });
        };
        const getTypedString = (value, type) => type ? `${value} (${type})` : value;

        const getCitationDate = citation => {
            const { date, dateType } = citation?.date || {};
            const formatted = Oskari.util.formatDate(date);
            const { label, description } = this.instance.loc(`codes.gmd:CI_DateTypeCode.${dateType}`) || {};
            return { label: getTypedString(formatted, label), description };
        };

        const mapIdentification = ide => ({
            ...ide,
            abstractText: prettifyString(ide.abstractText),
            languages: ide.languages?.map(lang => langLoc[lang] || lang),
            otherConstraints: prettifyList(ide.otherConstraints),
            useLimitations: prettifyList(ide.useLimitations),
            topicCategories: getCodes(ide.topicCategories, 'gmd:MD_TopicCategoryCode'),
            temporalExtents: ide.temporalExtents.map(ext => `${ext.begin} - ${ext.end}`),
            spatialResolutions: ide.spatialResolutions.map(res => `1:${res}`),
            citation: {
                ...ide.citation,
                date: getCitationDate(ide.citation),
                resourceIdentifiers: ide.citation.resourceIdentifiers.map(ind => `${ind.codeSpace}.${ind.code}`)
            },
            serviceType: getTypedString(ide.serviceType, ide.serviceTypeVersion),
            accessConstraints: getCodes(ide.accessConstraints, 'gmd:MD_RestrictionCode'),
            classifications: getCodes(ide.classifications, 'gmd:MD_ClassificationCode'),
            spatialRepresentationTypes: getCodes(ide.spatialRepresentationTypes, 'gmd:MD_SpatialRepresentationTypeCode'),
            responsibleParties: ide.responsibleParties.map(p => ({ label: p.organisationName, items: p.electronicMailAddresses }))
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
            metadataLanguage: langLoc[metadataLanguage] || metadataLanguage,
            distributionFormats: distributionFormats.map(format => getTypedString(format.name, format.version)),
            metadataCharacterSet: this.instance.loc('codes.gmd:MD_CharacterSetCode')[metadataCharacterSet] || metadataCharacterSet,
            metadataResponsibleParties: metadataResponsibleParties.map(p => ({ label: p.organisationName, items: p.electronicMailAddresses }))
        };
        return { identifications: identifications.map(mapIdentification), metadata };
    }
}

const wrapped = controllerMixin(MetadataHandler, [
    'setActiveTab',
    'toggleShowFullGraphics',
    'toggleMapLayerVisibility'
]);

export { wrapped as MetadataHandler };
