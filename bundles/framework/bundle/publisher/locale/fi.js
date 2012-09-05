Oskari.registerLocalization({
    "lang" : "fi",
    "key" : "Publisher",
    "value" : {
      "title" : "Julkaise kartta",
      "flyouttitle" : "Siirry julkaisemaan",
      "desc" : "",
      "published" : {
      	"title" : "Kartta julkaistu",
      	"desc" : "Voit viittaa siihen alla olevalla urlilla"
      },
      "BasicView" : {
      	  "title" : "Julkaise kartta",
          "domain" : {
          	  "title" : "Julkaisupaikka",
              "label" : "Sivusto, jolla kartta julkaistaan",
              "placeholder" : "ilman http- tai www-etuliitteitä",
              "tooltip" : "Kirjoita sivuston www-osoite eli domain-nimi ilman http- ja www-etuliitteitä, tai alasivun osoitetta. Esimerkiksi omakotisivu.com."
          },
          "name" : {
              "label" : "Kartan nimi",
              "placeholder" : "pakollinen",
              "tooltip" : "Anna kartelle kuvaileva nimi. Huomioi kieli valintaa tehdessäsi."
          },
          "language" : {
              "label": "Kieli",
              "options" : {
                  "fi" : "Suomi",
                  "sv" : "Ruotsi",
                  "en" : "Englanti"
              },
              "tooltip" : "Valitse kartan käyttöliittymän ja aineiston kieli."
          },
          "size" : {
              "label" : "Koko",
              "tooltip" : "Valitse tai määrittele kartalle koko, jossa haluat esittää sen sivuillasi. Näet vaikutuksen esikatselukartassa."
          },
          "tools" : {
              "label" : "Näytettävät työkalut",
              "tooltip" : "Valitse kartalla näytettävät työkalut. Näet niiden sijoittelun esikatselukartassa.",
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
              "ok" : "OK",
              "cancel" : "Peruuta"
          },
          "layerselection" : {
              "label" : "Näytä karttatasot valikossa",
              "info" : "Valitse karttapohjat. Voit tehdä oletusvalinnan esikatselunäkymästä.",
              "tooltip" : "Karttapohja näkyy kartan alimmaisena kerroksena. Kun valitset karttatasoja karttapohjaksi, vain yksi valituista tasoista näkyy kerralla ja käyttäjä voi vaihdella niiden välillä. Oletusvalinnan voit tehdä esikatselukartassa.",
              "promote" : "Haluatko näyttää myös ilmakuvia?"
          },
          "preview" : "Julkaistavan kartan esikatselu",
          "location" : "Sijainti ja mittakaavataso",
          "zoomlevel" : "Mittakaavataso",
          "help" : "Ohje",
          "error" : {
              "title"  : "Virhe!",
              "size"  : "Virhe kokomäärityksissä",
              "domain" : "Sivusto on pakollinen tieto",
              "domainStart" : "Anna sivusto ilman http- tai www-etuliitteitä",
              "name" : "Nimi on pakollinen tieto",
	      	  "nohelp" : "Ohjetta ei löytynyt",
              "saveFailed" : "Kartan julkaisu epäonnistui, yritä myöhemmin uudelleen"
          }
      },
      "NotLoggedView" : {
          "text" : "Rekisteröityneenä käyttäjänä löydät Omista tiedoista tallentamasi karttanäkymät, paikka-, reitti- ja aluemuotoiset omat karttakohteet, ja esim. Omalla tai yrityksesi sivustolla julkaisemasi kartat.",
          "signup" : "Kirjaudu sisään",
          "signupUrl" : "/web/fi/login",
          "register" : "Registeröidy",
          "registerUrl" : "/web/fi/login?p_p_id=58&p_p_lifecycle=1&p_p_state=maximized&p_p_mode=view&p_p_col_id=column-1&p_p_col_count=1&saveLastPath=0&_58_struts_action=%2Flogin%2Fcreate_account"
      },
      "StartView" : {
          "text" : "Voit julkaista tässä tekemäsi karttanäkymän osana esim. omaa tai yrityksesi sivustoa.",
          "layerlist_title" : "Julkaistavissa olevat karttatasot",
          "layerlist_empty" : "Valitsemiasi karttatasoja ei voida julkaista. Valitut karttatasot -valikosta näet, voiko karttatason julkaista.",
          "layerlist_denied" : "Ei julkaistavissa",
          "denied_tooltip" : "Kartta-aineiston tuottaja ei ole antanut oikeuksia julkaista kaikkia valitsemistasi tasoista",
          "buttons" : {
          	"continue" : "Jatka",
          	"cancel" : "Peruuta"
          }
      }
    }
});
