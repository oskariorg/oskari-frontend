Oskari.registerLocalization({
    "lang" : "fi",
    "key" : "Publisher",
    "value" : {
      "title" : "Julkaise kartta",
      "desc" : "",
      "BasicView" : {
          "domain" : {
              "label" : "Sivusto, jolla kartta julkaistaan",
              "placeholder" : "ilman http- tai www-etuliitteitä",
              "tooltip" : "tooltip"
          },
          "name" : {
              "label" : "Kartan nimi",
              "placeholder" : "pakollinen",
              "tooltip" : "tooltip"
          },
          "language" : {
              "label": "Kieli",
              "options" : {
                  "fi" : "Suomi",
                  "sv" : "Ruotsi",
                  "en" : "Englanti"
              },
              "tooltip" : "tooltip"
          },
          "size" : {
              "label" : "Koko",
              "tooltip" : "tooltip"
          },
          "tools" : {
              "label" : "Näytettävät työkalut",
              "tooltip" : "tooltip",
              "Oskari.mapframework.bundle.mapmodule.plugin.ScaleBarPlugin" : "Mittakaavajana",
              "Oskari.mapframework.bundle.mapmodule.plugin.IndexMapPlugin" : "Indeksikartta",
              "Oskari.mapframework.bundle.mapmodule.plugin.Portti2Zoombar" : "Mittakaavan säätö",
              "Oskari.mapframework.bundle.mapmodule.plugin.SearchPlugin" : "Osoite- ja paikannimihaku",
              "Oskari.mapframework.mapmodule.GetInfoPlugin" : "Kohdetieto"
          },
          "layers" : {
              "label" : "Karttatasot",
              "defaultLayer" : "(Oletusvalinta)",
              "useAsDefaultLayer" : "Käytä oletuksena"
          },
          "sizes" : {
              "small" : "Pieni",
              "medium" : "Keskikokoinen",
              "large" : "Suuri",
              "custom" : "Määritä oma koko",
              "width" : "leveys",
              "height" : "korkeus"
          },
          "buttons" : {
              "save" : "Tallenna",
              "cancel" : "Peruuta"
          },
          "layerselection" : {
              "label" : "Näytä karttatasot valikossa",
              "info" : "Valitse karttapohjat. Voit tehdä oletusvalinnan esikatselunäkymästä.",
              "tooltip" : "tooltip",
              "promote" : "Haluatko näyttää myös ilmakuvia?"
          },
          "preview" : "Julkaistavan kartan esikatselu",
          "location" : "Sijainti ja mittakaavataso",
          "zoomlevel" : "Mittakaavataso",
          "error" : {
              "size"  : "Virhe kokomäärityksissä",
              "domain" : "Sivusto on pakollinen tieto",
              "domainStart" : "Anna sivusto ilman http- tai www-etuliitteitä",
              "name" : "Nimi on pakollinen tieto"
          }
      },
      "NotLoggedView" : {
          "text" : "Rekisteröityneenä käyttäjänä löydät Omista tiedoista tallentamasi karttanäkymät, paikka-, reitti- ja aluemuotoiset omat karttakohteet, ja esim. Omalla tai yrityksesi sivustolla julkaisemasi kartat.",
          "signup" : "Kirjaudu sisään",
          "signupUrl" : "/web/fi/login",
          "register" : "Registeröidy",
          "registerUrl" : "/web/fi/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
      }
    }
});
