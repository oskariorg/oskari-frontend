const wait = 1000;
const log = Oskari.log('resetRemainingSessionTime');

const resetRemainingSessionTime = Oskari.util.throttle(() => {
    
    jQuery.ajax({
        type: 'GET',
        url: Oskari.urls.getRoute('ResetRemainingSessionTime'),
        error: (jqXHR,textStatus, errorThrown) => {
            const errorText = Oskari.util.getErrorTextFromAjaxFailureObjects(jqXHR,errorThrown);
            log.error(errorText);
        },
        success: (response) => {
            log.debug(response);
        }
    });
}, wait);

jQuery(document).mousemove(() => {
    resetRemainingSessionTime();
});
