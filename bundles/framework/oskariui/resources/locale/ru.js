Oskari.registerLocalization({
    lang: 'ru',
    key: 'oskariui',
    value: {
        buttons: {
            add: 'Добавить',
            cancel: 'Отменить',
            close: 'Закрыть',
            delete: 'Удалить',
            edit: 'Редактировать',
            save: 'Сохранить',
            yes: 'Да',
            no: 'Нет',
            next: 'Следующий',
            previous: 'Предыдущий',
            print: 'Распечатать',
            search: 'Поиск',
            reset: 'Очистить',
            copy: 'Скопировать в буфер обмена',
            clear: 'Очистить',
            accept: 'Принять',
            reject: 'Отклонить',
            info: 'Показать больше информации'
        },
        table: {
            sort: {
                desc: 'Сортировать по убыванию',
                asc: 'Сортировать по возрастанию'
            }
        },
        StyleEditor: {
            subheaders: {},
            fill: {
                color: 'Цвет заливки',
                area: {
                    pattern: 'Образец заливки'
                }
            },
            image: {
                shape: 'Иконка',
                size: 'Размер',
                fill: {
                    color: 'Цвет'
                }
            },
            stroke: {
                color: 'Цвет',
                lineCap: 'Окончания',
                lineDash: 'Тире',
                lineJoin: 'Углы',
                width: 'Ширина',
                area: {
                    color: 'Цвет линии',
                    lineDash: 'Линии, черточки',
                    lineJoin: 'Углы линии',
                    width: 'Ширина линии'
                }
            }
        },
        FileInput: {
            drag: 'Перетащить {maxCount, plural, one {файл} other {файлы}} сюда или ыбрать путем просмотра.',
            noFiles: 'Файл не выбран.',
            error: {
                invalidType: 'Формат файла не разрешен.',
                multipleNotAllowed: 'Разрешается загружать только один файл.',
                fileSize: 'Выбранный файл слишком велик. Файл не может превышать {maxSize, number} Мб'
            }
        },
        Spin: {
            loading: 'Загрузка...'
        },
        coordinates: {
            lon: "Долгота",
            lat: "Широта",
            n: "N",
            e: "E",
            p: "N",
            i: "E", 
            crs: {
              'EPSG:3067': "Координаты ETRS89-TM35FIN",
              'EPSG:3575': "Координаты в азимутальной равновеликой проекции Ламберта Северного полюса (Европа)",
              'EPSG:3857': "WGS 84 / Pseudo-Mercator координаты",
              default: "{crs} координаты"
          },
        }
    }
});
