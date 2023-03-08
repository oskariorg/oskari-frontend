const template = jQuery(
    `<div class="oskari-crosshair">
        <div class="oskari-crosshair-vertical-bar"></div>
        <div class="oskari-crosshair-horizontal-bar"></div>
    </div>`);

let crosshairOnMap = false;

export const isCrosshairActive = () => crosshairOnMap;
/**
 * @method toggleCrosshair
 * toggles the crosshair marking the center of the map
 */
export const toggleCrosshair = (mapEl) => {
    if (isCrosshairActive()) {
        removeCrosshair(mapEl);
    } else {
        addCrosshair(mapEl);
    }
};

export const removeCrosshair = (mapEl) => {
    if (crosshairOnMap) {
        jQuery(mapEl).find('div.oskari-crosshair').remove();
        crosshairOnMap = false;
    }
};

export const addCrosshair = (mapEl) => {
    if (!crosshairOnMap) {
        jQuery(mapEl).append(template.clone());
        crosshairOnMap = true;
    }
};
