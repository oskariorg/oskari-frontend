Oskari.registerLocalization({
  "lang": "sv",
  "key": "LayerSelection",
  "value": {
    "title": "Valda kartlager",
    "desc": "",
    "layer": {
      "style": "Stil",
      "show": "Visa",
      "hide": "Göm",
      "hidden": "Kartan är tillfälligt gömd.",
      "out-of-scale": "Data som ingår i detta kartlager kan inte visas på den valda skalnivån.",
      "move-to-scale": "Gå till en lämplig skalnivå.",
      "out-of-content-area": "Detta kartlager saknar innehåll vid dessa koordinater.",
      "move-to-content-area": "Lokalisera",
      "description": "Beskrivning",
      "object-data": "Objektuppgifter",
      "rights": {
        "notavailable": "Får inte publiceras.",
        "guest": "Logga in för att avskilja och inbädda detta kartlager.",
        "loggedin": "Får publiceras",
        "official": "Får publiceras för myndighetsbruk.",
        "need-login": "Du måste logga in.",
        "can_be_published_by_provider": {
          "label": "Får publiceras av dataproducenter",
          "tooltip": "För att publicera detta kartlager krävs dataproducenträttigheter. Om du är dataproducent, kontakta Paikkatietoikkunas stödtjänst och be om publiceringsrättigheter."
        },
        "can_be_published": {
          "label": "Får publiceras",
          "tooltip": "Kartlagret får publiceras i ett inbäddat kartfönster utan att begränsa antalet användare."
        },
        "can_be_published_map_user": {
          "label": "Får publiceras",
          "tooltip": "Kartlagret får publiceras i ett inbäddat kartfönster. Antalet användare per vecka kan vara begränsat."
        },
        "no_publication_permission": {
          "label": "Får inte publiceras.",
          "tooltip": "Dataproducenten har inte beviljat tillstånd att publicera kartlagret i ett inbäddat kartfönster."
        },
        "can_be_published_by_authority": {
          "label": "Får publiceras",
          "tooltip": "Kartlagret får publiceras i ett inbäddat kartfönster utan användningsbegränsningar."
        }
      },
      "tooltip": {
        "type-base": "Bakgrundskarta",
        "type-wms": "Kartlager",
        "type-wfs": "Dataprodukt"
      },
      "filter": {
        "title": "Filter",
        "description": "Välj objekt från analyslager:",
        "cancelButton": "Avbryt",
        "clearButton": "Töm filter",
        "refreshButton": "Uppdatera filter",
        "addFilter": "Tilllägg en ny filter",
        "removeFilter": "Ta bort en filter",
        "bbox": { 
          "title": "Filter på grund av kartvyn", 
          "on": "Ta med endast objekt som syns på kartvyn.", 
          "off": "Ta med alla objekt." 
        },
        "clickedFeatures": { 
          "title": "Filter på grund av objektval", 
          "label": "Ta med endast objekt utvalda på kartan." 
        },
        "values": {
          "title": "Filter på grund av attribut",
          "placeholders": { 
            "case-sensitive": "Bokstavsstorlek verkar på val.", 
            "attribute": "Attribut", 
            "boolean": "Logisk operator", 
            "operator": "Operator", 
            "attribute-value": "Värde" 
          },
          "equals": "är lika med",
          "like": "är ungefär lika med",
          "notEquals": "är inte lika med",
          "notLike": "är inte ungefär lika med",
          "greaterThan": "är större än",
          "lessThan": "är mindre än",
          "greaterThanOrEqualTo": "är större än eller lika med",
          "lessThanOrEqualTo": "är mindre än eller lika med"
        },
        "aggregateAnalysisFilter": { 
          "addAggregateFilter": "Välj ett statistiskt mått.", 
          "aggregateValueSelectTitle": "Använd ett statistiskt mått på analys", 
          "selectAggregateAnalyse": "Välj en analys för statistiska mått", 
          "selectIndicator": "Välj en indikator", 
          "selectReadyButton": "Färdig", 
          "getAggregateAnalysisFailed": "Statistiska måttet kunde inte hitttas.", 
          "noAggregateAnalysisPopupTitle": "Analyslager kunde inte hittas.", 
          "noAggregateAnalysisPopupContent": "Du har gjort inga analys för statistiska mått. Du kan göra dem med analys funktion och efter det använda det med filter." 
        },
        "validation": { 
          "title": "Uppdatering av filter misslyckades beroende av följande orsaker: ", 
          "attribute_missing": "The attribut finns inte.", 
          "operator_missing": "Operator finns inte.", 
          "value_missing": "Värde finns inte.", 
          "boolean_operator_missing": "Logisk operator finns inte." 
        }
      }
    }
  }
});