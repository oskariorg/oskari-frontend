# Oskari.statistics.statsgrid.ClassificationService

Used to classifify data. Limits as to how the classification can be done are found in an limits-property of the service:

```javascript
limits : {
    count : {
        min : 2,
        max : 9,
        def : 5
    },
    method : ['jenks', 'quantile', 'equal'],
    mode : ['distinct', 'discontinuous']
}
```

## Functions

### getClassification(indicatorData, options)

Classifies given dataset. Expects data as object like:
 {
	key1 : 1,
	key2 : 3,
	key3 : 2
 }

Options can include:
  {
     count : <number between 2-9 - defaults to 5>,
     method : <one of 'jenks', 'quantile', 'equal' - defaults to 'jenks'>,
     mode : <one of 'distinct', 'discontinuous' - defaults to 'distinct'>,
     precission : <undefined or integer between 0-20 - defaults to undefined>
  }


Returns an object like:
 {
      bounds : [<classification bounds as numbers like [0,2,5,6]>],
      ranges : [<classification ranges as strings ["0-2", "2-5", "5-6"]>],
      stats : {
          min : <min value in data>,
          max : <max value in data>,
          ...
          mean : <mean value in data>
      },
      getGroups : <function to return keys in data grouped by value ranges, takes an optional param index to get just one group>,
      getIndex : <function to return a group index for data - TODO: is this needed since we have getGroups?>,
      createLegend : <function to create html-legend for ranges, takes colorset and optional title as params>
  }

```javascript
var data = {
	key1 : 1,
	key2 : 3,
	key3 : 2
 };
var result = service.getClassification(data, {count : 2});

var groups = result.getGroups(); // returns [[key1, key3], [key2]]
var firstGroup = result.getGroups(0) // returns [key1, key3]
var theseMatch = groups[0] === firstGroup; // true

// using the index, we can get group of keys in the same classification group
var groupIndexForKey2 = result.getIndex(data[key2]) // returns 1
var groupWithKey2 = result.getGroups(groupIndexForKey2) -> returns [key2]
var theseMatchAlso = groups[groupIndexForKey2] === groupWithKey2; // true
```