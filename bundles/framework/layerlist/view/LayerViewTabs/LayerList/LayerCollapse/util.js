/**
 * If both layers have same group, they are ordered by layer.getName()
 * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} a comparable layer 1
 * @param {Oskari.mapframework.domain.WmsLayer/Oskari.mapframework.domain.WfsLayer/Oskari.mapframework.domain.VectorLayer/Object} b comparable layer 2
 * @param {String} method layer method name to sort by
 */
const comparator = (a, b, method) => {
    var nameA = a[method]().toLowerCase();
    var nameB = b[method]().toLowerCase();
    if (nameA === nameB && (a.getName() && b.getName())) {
        nameA = a.getName().toLowerCase();
        nameB = b.getName().toLowerCase();
    }
    return Oskari.util.naturalSort(nameA, nameB);
};

/**
 * Function to construct layer groups based on information included in layers and given grouping method.
 * Possible empty groups are included if allGroups and / or allDataProviders parameters are provided.
 *
 * @param {Oskari.mapframework.domain.AbstractLayer[]} layers layers to group
 * @param {String} method layer method name to sort by
 * @param {Oskari.mapframework.domain.Tool[]} tools tools to group
 * @param {Oskari.mapframework.domain.MaplayerGroup[]} allGroups all user groups available in Oskari
 * @param {Object[]} allDataProviders all dataproviders available in Oskari
 */
export const groupLayers = (layers, method, tools, allGroups = [], allDataProviders = []) => {
    const groupList = [];
    let group = null;

    // sort layers by grouping & name
    layers.sort((a, b) => comparator(a, b, method))
        .filter(layer => !layer.getMetaType || layer.getMetaType() !== 'published')
        .forEach(layer => {
            const groupAttr = layer[method]();

            let groupId;
            if (method === 'getInspireName') {
                groupId = layer._groups[0] ? layer._groups[0].id : undefined;
                // Analysis and myplaces layers don't have numeric id.
                if (typeof groupId !== 'number') {
                    groupId = undefined;
                }
            } else {
                // Analysis and myplaces layers don't have admin information.
                groupId = layer.admin ? layer.admin.organizationId : undefined;
            }

            if (!group || group.getTitle() !== groupAttr) {
                group = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                    groupId, method, groupAttr
                );
                groupList.push(group);
            }
            group.addLayer(layer);
            group.setTools(tools);
        });

    let groupsWithoutLayers;
    const lang = Oskari.getLang();
    if (method === 'getInspireName') {
        groupsWithoutLayers = allGroups.filter(t => groupList.filter(g => g.id === t.id).length === 0).map(t => {
            const group = Oskari.clazz.create(
                'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                t.id, method, t.name[lang]
            );
            group.setTools(tools);
            return group;
        });
    } else {
        groupsWithoutLayers = allDataProviders.filter(t => groupList.filter(g => g.id === t.id).length === 0).map(d => {
            const group = Oskari.clazz.create(
                'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                d.id, method, d.name
            );
            group.setTools(tools);
            return group;
        });
    }
    groupsWithoutLayers = groupsWithoutLayers.sort((a, b) => Oskari.util.naturalSort(a.name, b.name));
    return [...groupsWithoutLayers, ...groupList];
};
