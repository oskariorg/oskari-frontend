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
export const groupLayers = (layers, method, tools, allGroups = [], allDataProviders = [], noGroupTitle) => {
    const groupList = [];
    let group = null;
    let groupForOrphans = null;

    const determineGroupId = (layerGroups = [], layerAdmin) => {
        let groupId;
        if (method === 'getInspireName') {
            if (layerGroups.length) {
                groupId = layerGroups[0] ? layerGroups[0].id : undefined;
            } else {
                groupId = -1;
            }
        } else {
            groupId = layerAdmin ? layerAdmin.organizationId : undefined;
        }
        // My map layers, my places, own analysis and 'orphan' groups don't have id so use negated random number
        // as unique Id (with positive id group is interpret as editable and group tools are shown in layer list).
        return typeof groupId === 'number' ? groupId : -Math.random();
    };

    // sort layers by grouping & name
    layers.sort((a, b) => comparator(a, b, method))
        .filter(layer => !layer.getMetaType || layer.getMetaType() !== 'published')
        .forEach(layer => {
            let groupAttr = layer[method]();
            let groupId = determineGroupId(layer.getGroups(), layer.admin);

            // If grouping can be determined, create group if already not created
            if (!group || (typeof groupAttr !== 'undefined' && groupAttr !== '' && group.getTitle() !== groupAttr)) {
                group = Oskari.clazz.create(
                    'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                    groupId, method, groupAttr
                );
                groupList.push(group);
            }
            // Add layer and tools to group if grouping can be determined
            if (groupAttr) {
                group.addLayer(layer);
                group.setTools(tools);
            }
            // Create group for orphan layers if not already created and add layer to it
            if (!groupAttr) {
                if (!groupForOrphans) {
                    groupForOrphans = Oskari.clazz.create(
                        'Oskari.mapframework.bundle.layerselector2.model.LayerGroup',
                        groupId, method, '(' + noGroupTitle + ')'
                    );
                }
                groupForOrphans.addLayer(layer);
            }
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
    return groupForOrphans ? [groupForOrphans, ...groupsWithoutLayers, ...groupList] : [...groupsWithoutLayers, ...groupList];
};
