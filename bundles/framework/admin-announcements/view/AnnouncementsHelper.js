export const announcementsHelper = () => {
    const getAdminAnnouncements = (handler) => {
        if (typeof handler !== 'function') {
            return;
        }

        jQuery.ajax({
            type: 'GET',
            dataType: 'json',
            url: Oskari.urls.getRoute('GetAdminAnnouncements'),
            success: function (pResp) {
                handler(null, pResp);
            },
            error: function (jqXHR, textStatus) {
                handler('Error', []);
            }
        });
    };

    const saveAnnouncement = (data, handler) => {
        if (typeof handler !== 'function') {
            return;
        }
        jQuery.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                params: JSON.stringify(data)
            },
            url: Oskari.urls.getRoute('SaveAnnouncement'),
            success: function (pResp) {
                handler(null, pResp);
            },
            error: function (jqXHR, textStatus) {
                handler('Error', []);
            }
        });
    };

    const updateAnnouncement = (data, handler) => {
        if (typeof handler !== 'function') {
            return;
        }
        jQuery.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                params: JSON.stringify(data)
            },
            url: Oskari.urls.getRoute('UpdateAnnouncement'),
            success: function (pResp) {
                handler(null, pResp);
            },
            error: function (jqXHR, textStatus) {
                handler('Error', []);
            }
        });
    };

    const deleteAnnouncement = (data, handler) => {
        if (typeof handler !== 'function') {
            return;
        }

        jQuery.ajax({
            type: 'POST',
            dataType: 'json',
            data: {
                params: JSON.stringify(data)
            },
            url: Oskari.urls.getRoute('DeleteAnnouncement'),
            success: function (pResp) {
                handler(null, pResp);
            },
            error: function (jqXHR, textStatus) {
                handler('Error', []);
            }
        });
    };

    return {
        getAdminAnnouncements,
        saveAnnouncement,
        updateAnnouncement,
        deleteAnnouncement
    };
};
