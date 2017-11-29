# Chart

## Description

Create bar or line charts with d3.

## How to use

Creates instance of chart class, pass it data in very specific form (array with objects, ie: [{ name: "", value: Number }]).
Chart returns a div that can be appended where you desire.
```javascript
var barchart = Oskari.clazz.create('Oskari.userinterface.component.Chart', Oskari.getSandbox());
var data = [{name:"2", value:1},{name:"1", value:3},{name:"11", value:31},{name:"12", value:32},{name:"13", value:300},{name:"14", value:355},{name:"15", value:366},{name:"16", value:377}];
var options = {
    colors: ['#ff0000', '#00ff00'] // also support to use one color --> colors: '#ff0000'
};
barchart.createBarChart(data, options);
jQuery('<div></div>').append(barchart);

```

Update chart with new data:
```javascript
barchart.redraw(data, options);
```

Different charts:
```javascript
// bar chart
barchart.createBarChart(data, options);
// line chart
barchart.createLineChart(data, options);
```
