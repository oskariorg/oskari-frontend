Oskari.registerLocalization(
    {
        "lang": "es",
        "key": "Publisher",
        "value": {
            "title": "Crear mapa",
            "flyouttitle": "Crear mapa",
            "desc": "",
            "published": {
                "title": "Se ha creado su mapa",
                "desc": "Incorpore su mapa añadiendo el siguiente código HTML a tu portal web."
            },
            "edit" : {
              "popup" : {
                  "title": "Editando el mapa incorporado",
                  "msg": "Se están actualizando los datos de un mapa incorporado anteriormente"
              } 
            },
            "BasicView": {
                "title": "Mapa incorporado",
                "titleEdit" : "Editar mapa incorporado",
                "domain": {
                    "title": "Página web donde se incorporará el mapa",
                    "label": "Portal web donde se incorporará el mapa",
                    "placeholder": "sin los prefijos http o www",
                    "tooltip": "Escribe el nombre de la página inicial de tu portal web, es decir, su dominio sin los prefijos http o www, o la dirección de una subpágina. Ejemplo: mipaginainicial.com"
                },
                "name": {
                    "label": "El nombre del mapa",
                    "placeholder": "required",
                    "tooltip": "Asigne a su mapa un nombre descriptivo. Por favor, tenga en cuenta el idioma de la interfaz de usuario."
                },
                "language": {
                    "label": "Idioma",
                    "options": {
                        "fi": "Finlandés",
                        "sv": "Sueco",
                        "en": "Inglés",
                        "de" : "Alemán",
                        "es" : "Español",
                        "cs" : "Checo"
                    },
                    "tooltip": "Seleccione el idioma de la interfaz y de los datos del mapa."
                },
                "size": {
                    "label": "Tamaño",
                    "tooltip": "Seleccione o defina el tamaño del mapa que se incorporará en su portal web. La previsualización del mapa se mostrará en el tamaño seleccionado."
                },
                "tools": {
                    "label": "Herramientas",
                    "tooltip": "Seleccione las herramientras que se mostrarán en el mapa. Su ubicación se mostrará en la previsualización del mapa.",
                    "ScaleBarPlugin": "Escala",
                    "IndexMapPlugin": "Mapa índice",
                    "PanButtons" : "Herramienta de desplazamiento",
                    "Portti2Zoombar": "Barra de escala",
                    "ControlsPlugin": "Desplazamiento",
                    "SearchPlugin": "Búsqueda de sitios y direcciones",
                    "GetInfoPlugin": "Herramienta de consulta para los datos de sitios"
                },
                "data": {
                    "label": "Statistics",
                    "tooltip": "Show the data related to map.",
                    "grid" : "Show statistic grid"
                },
                "layers": {
                    "label": "Capas",
                    "defaultLayer": "(Capa por defecto)",
                    "useAsDefaultLayer": "Usar como capa por defecto"
                },
                "sizes": {
                    "small": "Pequeño",
                    "medium": "Mediano",
                    "large": "Grande",
                    "custom": "Tamaño personalizado",
                    "width": "ancho",
                    "height": "alto"
                },
                "buttons": {
                    "save": "Guardar",
                    "saveNew": "Guardar nuevo",
                    "ok": "Hecho",
                    "replace": "Reemplazar",
                    "cancel": "Cancelar"
                },
                "confirm" : {
                    "replace" : {
                        "title" : "¿Desea reemplazar el mapa incorporado?",
                        "msg" : "Use reemplazar para mostrar instantáneamente los cambios en el mapa incorporado. No es necesario añadir de nuevo el código html a su portal web."
                    }
                }, 
                "layerselection": {
                    "label": "Mostrar las capas en el menú",
                    "info": "Seleccione los mapas de fondo. Puede configurar el mapa de fondo en la ventana de previsualización del mapa.",
                    "tooltip": "El mapa de fondo se muestra como la capa de fondo del mapa. Cuando seleccione las capas que va a utilizar como fondo, sólo una es visible cada vez, pudiendo intercambiarlas. Puede configurar el mapa de fondo por defecto en la previsualización del mapa.",
                    "promote": "¿Mostrar imágenes por defecto?"
                },
                "preview": "Previsualización del mapa a incorporar.",
                "location": "Localización y nivel de zoom",
                "zoomlevel": "Nivel de zoom",
                "help": "Ayuda",
                "error": {
                    "title": "¡Error!",
                    "size": "Error en la definición del tamaño",
                    "domain": "Es necesaria la información del portal web",
                    "domainStart": "Omitir los prefijos http o www en el nombre del portal web",
                    "name": "Es necesaria la información del nombre",
                    "nohelp": "No hay ayuda disponible",
                    "saveFailed": "Fallo en la publicación del mapa. Inténtelo más tarde.",
                    "nameIllegalCharacters": "El nombre contiene caracteres no permitidos. Los caracteres permitidos son las letras entre a-z, los números, los espacios en blanco y los guiones.",
                    "domainIllegalCharacters": "El nombre del portal web contiene caracteres no permitidos. Los caracteres permitidos son las letras entre a-z, los números, los espacios en blanco y los guiones."
                }
            },
            "NotLoggedView": {
                "text": "Necesitas identificarte antes de utilizar las funciones de incrustación.",
                "signup": "Acceder",
                "signupUrl": "/web/en/login",
                "register": "Registrarse",
                "registerUrl": "/web/en/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
            },
            "StartView": {
                "text": "Puede incorporar la vista que acaba de crear en su propio portal web o en el portal de su empresa.",
                "touLink": "Mostrar los términos de uso para los mapas incrustados",
                "layerlist_title": "Capas incorporables",
                "layerlist_empty": "Las capas que ha seleccionado no pueden incorporarse. El menú Capas seleccionadas muestra si una capa puede o no puede incorporarse.",
                "layerlist_denied": "No puede incorporarse",
                "denied_tooltip": "Los proveedores de los datos del mapa no han concedido el permiso para publicar este material en otros portales web. Comprueba los derechos de publicación en el menú Capas seleccionadas antes de la incorporación.",
                "buttons": {
                    "continue": "Continuar",
                    "continueAndAccept": "Aceptar los términos de uso y continuar",
                    "cancel": "Cancelar",
                    "close" : "Cerrar"
                },
                "tou" : {
                    "notfound" : "No se puede encontrar los términos de uso",
                    "reject" : "Rechazar",
                    "accept" : "Aceptar"
                }
            }
        }
    });