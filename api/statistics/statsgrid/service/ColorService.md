# Oskari.statistics.statsgrid.ColorService

Used to get colorset for classified data. Available options for colorsets are found in an limits-property of the service:

```javascript
limits : {
    type : ['div', 'seq', 'qual'],
    defaultType : 'div',
    name : [...list of colorset names...],
    defaultName : 'BrBG',
    count : {
        min : 2,
        max : 9
    }
}
```

## Functions

### getColorset(count, type, name)

Tries to return an array of colors where length equals count parameter. If such set is not available, returns null if array with requested count is not available. If type or name is given, tries to find closest match, but fallsback to returning the best matching colorset if specific is not found.
@param  {Number} count number of colors requested
@param  {String} type  optional type, supports 'div', 'seq' or 'qual', defaults to 'div'
@param  {String} name  optional name, defaults to 'BrBG'
@return {String[]}     array of hex-strings as colors like ["d8b365","5ab4ac"]

