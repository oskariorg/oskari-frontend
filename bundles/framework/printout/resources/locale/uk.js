Oskari.registerLocalization(
{
    "lang": "uk",
    "key": "Printout",
    "value": {
        "title": "Друкувати вигляд карти",
        "flyouttitle": "Друкувати вигляд карти",
        "desc": "",
        "btnTooltip": "",
        "BasicView": {
            "title": "Друкувати вигляд карти",
            "name": {
                "label": "",
                "placeholder": "",
                "tooltip": ""
            },
            "language": {
                "label": "",
                "options": {
                    "fi": "",
                    "sv": "",
                    "en": ""
                },
                "tooltip": ""
            },
            "size": {
                "label": "Розмір",
                "tooltip": "Обрати макет друку| Попередній перегляд оновлюється відповідно",
                "options": [
                    {
                        "id": "А4",
                        "label": "А4 Книжкова",
                        "classForPreview": "preview-portrait",
                        "selected": "true"
                    },
                    {
                        "id": "A4_Landscape",
                        "label": "А4 Альбомна",
                        "classForPreview": "preview-landscape"
                    },
                    {
                        "id": "А3",
                        "label": "А3 Книжкова",
                        "classForPreview": "preview-portrait"
                    },
                    {
                        "id": "A3_Landscape",
                        "label": "А3 Альбомна",
                        "classForPreview": "preview-landscape"
                    }
                ]
            },
            "preview": {
                "label": "Попередній перегляд",
                "tooltip": "Калцніть на зображення попереднього перегляду щоб відкрити його у великому вікні",
                "pending": "Попередній перегляд зараз оновиться",
                "notes": {
                    "extent": "Використовуйте попередній перегляд щоб встановити межі друку",
                    "restriction": "Не всі шари карти відображаються у вікні попереднього перегляду"
                }
            },
            "buttons": {
                "save": "Друк",
                "ok": "ОК",
                "back": "",
                "cancel": "Скасувати"
            },
            "location": {
                "label": "Місцеположення та масштаб",
                "tooltip": "Масштаб друку співпадає з масштабом карти у вікні браузера",
                "zoomlevel": "Масштаб"
            },
            "settings": {
                "label": "Додаткові налаштування",
                "tooltip": "Додаткові налаштування такі як формат файлу, заголовок та масштаб"
            },
            "format": {
                "label": "Формат",
                "tooltip": "Оберіть формат файлу",
                "options": [
                    {
                        "id": "png",
                        "format": "image/png",
                        "label": "PNG зображення"
                    },
                    {
                        "id": "pdf",
                        "format": "application/pdf",
                        "selected": "true",
                        "label": "PDF документ"
                    }
                ]
            },
            "mapTitle": {
                "label": "Додати заголовок",
                "tooltip": "Додати заголовок на карту"
            },
            "content": {
                "options": [
                    {
                        "id": "pageLogo",
                        "label": "Додати логотип Oskari",
                        "tooltip": "Ви можете приховати логотип, якщо це необхідно",
                        "checked": "checked"
                    },
                    {
                        "id": "pageScale",
                        "label": "Додати масштаб на карту",
                        "tooltip": "Додати масштаб на карту",
                        "checked": "checked"
                    },
                    {
                        "id": "pageDate",
                        "label": "Додати дату",
                        "tooltip": "Ви можете також додати дату до роздруківки",
                        "checked": "checked"
                    }
                ]
            },
            "help": "Довідка",
            "error": {
                "title": "Помилка",
                "size": "",
                "name": "",
                "nohelp": "Немає доступних довідок",
                "saveFailed": "Друк карти не виконано| Спробуйте пізніше",
                "nameIllegalCharacters": ""
            }
        },
        "StartView": {
            "text": "Ви можете роздрукувати вигляд щойно створеної карти",
            "info": {
                "maxLayers": "За один раз можна надрукувати максимум 8 шарів",
                "printoutProcessingTime": "Підготовка до друку займає певний час якщо обрано декілька шарів"
            },
            "buttons": {
                "continue": "Продовжити",
                "cancel": "Скасувати"
            }
        }
    }
});
