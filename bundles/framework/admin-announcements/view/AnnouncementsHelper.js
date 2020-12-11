export const announcementsHelper = () => {
    const getAdminAnnouncements = (handler) => {
        if (typeof handler !== 'function') {
            return;
        }

        jQuery.ajax({
            type: 'GET',
            dataType: 'json',
            url: Oskari.urls.getRoute('Announcements'),
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
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(data),
            url: Oskari.urls.getRoute('Announcements'),
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
            type: 'PUT',
            dataType: 'json',
            contentType: 'application/json; charset=UTF-8',
            data: JSON.stringify(data),
            url: Oskari.urls.getRoute('Announcements'),
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
            type: 'DELETE',
            dataType: 'json',
            data: JSON.stringify(data),
            url: Oskari.urls.getRoute('Announcements'),
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
