Oskari.registerLocalization(
{
    "lang": "el",
    "key": "Printout",
    "value": {
        "title": "Print Map view",
        "flyouttitle": "Εκτύπωση χάρτη",
        "desc": "",
        "btnTooltip": "Εκτύπωση",
        "BasicView": {
            "title": "Εκτύπωση χάρτη",
            "name": {
                "label": "",
                "placeholder": "",
                "tooltip": ""
            },
            "language": {
                "label": "Γλώσσα",
                "options": {
                    "fi": "Φινλανδικά",
                    "sv": "Σουηδικά",
                    "en": "Αγγλικά"
                },
                "tooltip": "Επιλέξτε την γλώσσα του interface του χάρτη και των δεδομένων"
            },
            "size": {
                "label": "Μέγεθος",
                "tooltip": "Επιλέξτε διάταξη εκτύπωσης (print layout). Η προεπισκόπηση χάρτη ανανεώνεται ανάλογα.",
                "options": [
                    {
                        "id": "A4",
                        "label": "Α4 πορτρετο",
                        "classForPreview": "preview-portrait",
                        "selected": true
                    },
                    {
                        "id": "A4_Landscape",
                        "label": "A4 landscape",
                        "classForPreview": "preview-landscape"
                    },
                    {
                        "id": "A3",
                        "label": "A3 πορτρέτο",
                        "classForPreview": "preview-portrait"
                    },
                    {
                        "id": "A3_Landscape",
                        "label": "A3 landscape",
                        "classForPreview": "preview-landscape"
                    }
                ]
            },
            "preview": {
                "label": "Προεπισκόπιση",
                "tooltip": "Κάντε κλικ στην μικρή προεπισκόπιση για να ανοίξει μεγαλύτερο παράθυρο",
                "pending": "Η προεπισκόπιση θα ανανεωθεί σε λίγο",
                "notes": {
                    "extent": "Η προεπισκόπιση μπορεί να χρησιμοποιηθεί για να καθορίσετε το πλαίσια του χάρτη για εκτύπωση",
                    "restriction": "Δεν εμφανίζονται όλα τα επίπεδα χάρτη στην προεπισκόπιση"
                }
            },
            "buttons": {
                "save": "Λήψη εκτύπωσης",
                "ok": "OK",
                "back": "",
                "cancel": "Ακύρωση"
            },
            "location": {
                "label": "Τοποθεσία και επίπεδο μεγέθυνσης",
                "tooltip": "Η κλίμακα εκτύπωσης ταιριάζει με την κλίμακα του χα΄ρτη στον browser.",
                "zoomlevel": "Επίπεδο μεγέθυνσης"
            },
            "settings": {
                "label": "Περισσότερες ρυθμίσεις",
                "tooltip": "Κάντε περισσότερες ρυθμίσεις όπως format, τιτλος και κλίμακα"
            },
            "format": {
                "label": "Format",
                "tooltip": "Επιλέξτε το format του αρχείου",
                "options": [
                    {
                        "id": "png",
                        "format": "image/png",
                        "label": "PNG image"
                    },
                    {
                        "id": "pdf",
                        "format": "application/pdf",
                        "selected": true,
                        "label": "Έγγραφο PDF"
                    }
                ]
            },
            "mapTitle": {
                "label": "Πρόσθεση τίτλου",
                "tooltip": "προσθέστε τίτλο του χάρτη"
            },
            "content": {
                "options": [
                    {
                        "id": "pageLogo",
                        "label": "Προσθέστε τιο λογότυπο του OSKARI",
                        "tooltip": "Μπορείτε να αποκρύψετε το λογότυπο αν χρειαστεί",
                        "checked": "checked"
                    },
                    {
                        "id": "pageScale",
                        "label": "Προσθέστε κλίμακα στον χάρτη",
                        "tooltip": "Προσθέστε κλίμακα στον χάρτη",
                        "checked": "checked"
                    },
                    {
                        "id": "pageDate",
                        "label": "Προσθέστε ημερομηνία",
                        "tooltip": "Μπορείτε να προσθέσετε ημερομηνία στην εκτύπωση",
                        "checked": "checked"
                    }
                ]
            },
            "help": "Βοήθεια",
            "error": {
                "title": "Σφάλμα",
                "size": "",
                "name": "",
                "nohelp": "Δεν διατίθεται βοήθεια",
                "saveFailed": "Η εκτύπωση του χάρτη απέτυχε. Δοκιμάστε πάλι αργότερα.",
                "nameIllegalCharacters": ""
            }
        },
        "StartView": {
            "text": "Μπορείτε να εκτυπώσετε τον χάρτη που μόλις δημιουργήσατε.",
            "info": {
                "maxLayers": "Μπορείτε να εκτυπώσετε το μέγιστο 8 επίπεδα χάρτη κάθε φορά",
                "printoutProcessingTime": "Η εκτύπωση διαρκεί για λίγο όταν επιλέγονται πολλά επίπεδα για εκτύπωση."
            },
            "buttons": {
                "continue": "Συνέχεια",
                "cancel": "Ακύρωση"
            }
        }
    }
});
