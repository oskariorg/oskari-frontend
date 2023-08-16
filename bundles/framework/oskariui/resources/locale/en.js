Oskari.registerLocalization({
    lang: 'en',
    key: 'oskariui',
    value: {
        buttons: {
            add: 'Add',
            cancel: 'Cancel',
            close: 'Close',
            delete: 'Delete',
            edit: 'Edit',
            save: 'Save',
            submit: 'Submit',
            import: 'Import',
            yes: 'Yes',
            no: 'No',
            next: 'Next',
            previous: 'Previous',
            print: 'Print',
            search: 'Search',
            reset: 'Reset',
            copy: 'Copy to clipboard',
            clear: 'Clear',
            accept: 'Accept',
            reject: 'Reject',
            info: 'Show more information'
        },
        messages: {
            confirm: 'Are you sure you want to continue?',
            confirmDelete: 'Are you sure you wish to delete?',
            copied: 'Copied'
        },
        error: {
            generic: 'Something went wrong'
        },
        table: {
            sort: {
                desc: 'Click to sort descending',
                asc: 'Click to sort ascending',
                cancel: 'Click to cancel sorting'
            },
            emptyText: 'No data.'
        },
        ColorPicker: {
            tooltip: 'Choose color',
            moreColors: 'More colors'
        },
        StyleEditor: {
            subheaders: {
                styleFormat: 'Geometry type',
                name: 'Style name',
                style: 'Style',
                pointTab: 'Point',
                lineTab: 'Line',
                areaTab: 'Area'
            },
            tooltips: {
                transparent: 'No fill',
                solid: 'Solid fill',
                thin_diagonal: 'Thin diagonal line',
                thick_diagonal: 'Thick diagonal line',
                thin_horizontal: 'Thin horizontal line',
                thick_horizontal: 'Thick horizontal line'
            },
            fill: {
                color: 'Fill colour',
                area: {
                    pattern: 'Fill pattern'
                }
            },
            image: {
                shape: 'Icon',
                size: 'Size',
                fill: {
                    color: 'Colour'
                }
            },
            stroke: {
                color: 'Colour',
                lineCap: 'Endings',
                lineDash: 'Dash',
                lineJoin: 'Corners',
                width: 'Width',
                area: {
                    color: 'Colour',
                    lineDash: 'Dash',
                    lineJoin: 'Corners',
                    width: 'Line width'
                }
            }
        },
        FileInput: {
            drag: 'Drag {maxCount, plural, one {a file} other {files}} here or select by browsing.',
            noFiles: 'No file selected.',
            error: {
                invalidType: 'File format is not allowed.',
                allowedExtensions: 'Allowed file extensions: {allowedExtensions}.',
                multipleNotAllowed: 'Only single file is allowed to be uploaded.',
                fileSize: 'The selected file is too large. It can be at most {maxSize, number} Mb.'
            }
        },
        LocalizationComponent: {
            otherLanguages: 'Other languages',
            othersTip: 'Translations will be shown when using the service in different languages',
            locale: {
                generic: 'in ({0})',
                fi: 'in Finnish',
                en: 'in English',
                sv: 'in Swedish'
            }
        },
        Spin: {
            loading: 'Loading...'
        },
        FeatureFilter: {
            single: 'Single property',
            list: 'More properties',
            range: 'Use value range',
            caseSensitive: {
                true: 'Case sensitive',
                false: 'Case insensitive'
            },
            operators: {
                value: 'is',
                in: 'in',
                notIn: 'not in',
                like: 'like',
                notLike: 'not like',
                greaterThan: 'greater than',
                atLeast: 'at least',
                lessThan: 'less than',
                atMost: 'at most'
            }
        }
    }
});
