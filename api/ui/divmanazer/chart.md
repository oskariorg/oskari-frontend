# Chart

## Description

Create barcharts or linecharts with d3

## How to use

Creates a button with label "Alert" and binds a handler to it that shows an alert when clicked. `addClass('primary')` makes it visually a "primary" button (colored blue).

```javascript
var barchart = Oskari.clazz.create('Oskari.userinterface.component.Chart', Oskari.getSandbox());
var data = [{name:"2", value:1},{name:"1", value:3},{name:"11", value:31},{name:"12", value:32},{name:"13", value:300},{name:"14", value:355},{name:"15", value:366},{name:"16", value:377}];
barchart.createBarChart(data);
jQuery('<div></div>').append(barchart);

```

Update chart with new data
```javascript
barchart.redraw(data);
```

different charts
```javascript
barchart.createBarChart(data, options);
barchart.createLineChart(data, options);
```
