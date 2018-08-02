### Version 2.3.2 - June 18, 2018

- **Dropdown** Fixed bug that could cause dropdown to recursively trigger network requests specifically when using `apiSettings` with a url that returns valid response but with no results when clicking directly on the `dropdown icon`. **Thanks @vpeti** [#5231](https://github.com/Semantic-Org/Semantic-UI/issues/5231) [#5809](https://github.com/Semantic-Org/Semantic-UI/issues/5809)

### Version 2.3.1 - Mar 18, 2018

- **Dropdown** - Fixed issue in `2.3.0` that could cause multiselect dropdowns initialized by converting `<select>` to not add initial selected options. [#6123](https://github.com/Semantic-Org/Semantic-UI/issues/6123)
- **Dropdown** - Fixed `onChange` missing `text` from callback when dropdown is set to `action: 'select'` **Thanks @martinduparc**  [#4183](https://github.com/Semantic-Org/Semantic-UI/issues/4183) [#4510](https://github.com/Semantic-Org/Semantic-UI/issues/4510)

### Version 2.3.0 - Feb 20, 2018

- **Search** - Category results now has `exact` setting matching dropdown for `fullTextSearch` preventing fuzzy search

### Version 2.2.14 - Jan 29, 2018

- **Dropdown** - Added new setting `ignoreCase` (defaults to false) that will prevent values from being added that match existing values (case insensitive). This is particularly useful when using allowAdditions for tagging to not allow case insensitive matches.
- **Dropdown** - Fixed issue where dropdowns could incorrectly open upward and leftward opening when using `context` setting due to an incorrect offset calculation. **Thanks @dannyBies** [#5974](https://github.com/Semantic-Org/Semantic-UI/issues/5974) [#5366](https://github.com/Semantic-Org/Semantic-UI/issues/5366)
- **Dropdown** - Fixes issue where dropdowns might accidentally animate closed two times when quickly tabbing through fields
- **Dropdown** - Fixed issue where using `ui input` in a dropdown menu could cause the input to be too wide in some cases **Thanks @banandrew** [#5085](https://github.com/Semantic-Org/Semantic-UI/issues/5085)

### Version 2.2.12 - Aug 07, 2017

- **Dropdown** - Dropdown can now have `values` specified in javascript when initializing.This should simplify cases where dropdown contents are contingent on other fields, for example listing sub categories. You can see some [examples here](https://jsfiddle.net/Lb7c5dkz/) and in the [usage section of dropdown docs](https://www.semantic-ui.com/modules/dropdown.html#initializing-with-javascript-only)
- **Dropdown** - Fixed regression that caused sub menu `dropdown` inside `ui menu` to always appear on left edge of dropdown introduced `2.2.11` [#5542](https://github.com/Semantic-Org/Semantic-UI/issues/5542)
- **Dropdown** - Dropdown mutation observers now watch to see if the entire `<select>` DOM node is replaced with a different select, and not just if new `<option>` are added
- **Dropdown** - Fixed an issue where css rule for `focused default text` was not being applied for multiselects [#5633](https://github.com/Semantic-Org/Semantic-UI/issues/5633)
- **Dropdown** - Calling dropdown methods on `<select>` will now work when using `setting` behavior to set settings after load [#3744](https://github.com/Semantic-Org/Semantic-UI/issues/3744)

### Version 2.2.11 - July 11, 2017

- **Dropdown** - Fixed issue where using `down` key to re-open dropdown when using `search selection dropdown` would start at the top element instead of jumping to selected element [#4506](https://github.com/Semantic-Org/Semantic-UI/issues/4506)
- **Dropdown** - Dropdowns will automatically detect when they are offscreen to the right and will open leftward instead **Thanks @Graveheart** [#4211](https://github.com/Semantic-Org/Semantic-UI/issues/4211)
- **Dropdown** - Improved spacing on `image` inside `menu item` and for selected `text`
- **Dropdown** - Fix dropdown arrow being slightly off center due to em calculation being incorrect due to differences in relative em
- **Dropdown** - Fix `loading dropdown` icon position being slightly offset
- **Dropdown** - Fixed issue where `search selection dropdown` would reset list to top after selection when re-opening dropdown [#4506](https://github.com/Semantic-Org/Semantic-UI/issues/4506)

### Version 2.2.10 - March 28, 2017

- **Dropdown** - Fix search input inside dropdown menu causing dropdown to close before selection when selecting an item #5113
- **Dropdown** - (IE11 Only) Fixed issue where dropdown re-opens immediately after closing when using a `search` inside menu. #4237
- **Dropdown** - Fixes an issue where dropdown would not correctly open `upward` at bottom edge of the screen when using a `context` with `overflow-x` or `overflow-y` set to `auto`

#### Dropdown
`multiple selection dropdown` no longer automatically adds the currently selected value when you "alt-tab" or blur the field, even when `forceSelection: true` is set.

- **Dropdown** - Added new setting `filterRemoteData`, when set to `true` API will be expected to return the complete result set, which will then be filtered clientside to only display matching results. **Thanks @enix223** [#4815](https://github.com/Semantic-Org/Semantic-UI/pull/4815)
- **Dropdown** - Fixed issue where using some usage of special characters like `\` could cause dropdowns to not work. [#4688](https://github.com/Semantic-Org/Semantic-UI/pull/4688) [#4692](https://github.com/Semantic-Org/Semantic-UI/pull/4692)
- **Dropdown** - `forceSelection` setting will no longer cause highlighted value in multiselect to be selected on blur when using a `multiple selection dropdown` [#4041](https://github.com/Semantic-Org/Semantic-UI/pull/4041) [#4516](https://github.com/Semantic-Org/Semantic-UI/pull/4516)
- **Dropdown** - Dropdown using search input inside of menu are now tabbable [#4490](https://github.com/Semantic-Org/Semantic-UI/pull/4490)
- **Dropdown** - Fixed bug where clicking on a dropdown's `dropdown icon` when using remote data would not open menu [#4041](https://github.com/Semantic-Org/Semantic-UI/pull/4041)
- **Dropdown/Search/Checkbox** - Removes use of deprecated `dispatchEvent` DOM APIs for generating simulated events
- **Dropdown** - Fixes issue where `left pointing dropdown` and `right pointing dropdown` appear styled incorrectly when opening `upward` [#4896](https://github.com/Semantic-Org/Semantic-UI/pull/4896)
- **Dropdown** - Fixed issue where using `fullTextSearch: 'exact'` would still fuzzy search on value **Thanks @ rminnett** [#4651](https://github.com/Semantic-Org/Semantic-UI/pull/4651) [#3424](https://github.com/Semantic-Org/Semantic-UI/pull/3424)
- **Dropdown** - Fix bug where `scrolling menu` or `scrolling dropdown` would have excessive right padding by removing scrollbar width from calculation (no longer necessary in modern browsers)
- **Dropdown** - Fixed issue where `selectOnKeydown` with `html` content would cause only non html content to display in `text` until blur
- **Input/Dropdown** - Fixed rounding error causing vertical alignment of `dropdown`, `search`, `input` to sometimes appear off by 1 pixel [#4279](https://github.com/Semantic-Org/Semantic-UI/pull/4279)

### Version 2.2.3 - August 21, 2016

- **Dropdown** - Using `search selection` with `selectOnKeydown` will now highlight the partial search matching the currently keyboard selected value
- **Button/Dropdown** - Fixed issue where `ui dropdown button` could have incorrect spacing for dropdown icon **Thanks @ilanus** [#4408](https://github.com/Semantic-Org/Semantic-UI/issues/4408)
- **Menu** - Fixed issue where `dropdown` in `vertical menu` would not correctly open `upward` when no space below **Thanks @gdaunton** [#4150 [#4156](https://github.com/Semantic-Org/Semantic-UI/issues/4156)
- **Dropdown** - Using `search selection with `selectOnKeydown` and text content that includes html, will not apply html content (like images) to the text until dropdown blur, making sure that content can align correctly with the partial search content of the search input (which cannot include HTML)
- **Dropdown** - Fixed issue where dropdown `clear` would not remove active state when `useLabels: true` and multiple dropdown **Thanks vinh123456789** [#4275](https://github.com/Semantic-Org/Semantic-UI/issues/4275) [#4366](https://github.com/Semantic-Org/Semantic-UI/issues/89**)
- **Dropdown** - `dropdown icon` no longer relies on stopping event propagation. This means using the dropdown icon will now cause other dropdowns to correctly hide. [#3998](https://github.com/Semantic-Org/Semantic-UI/issues/3998)
- **Dropdown** - Fixes `action: select` not working correctly since `2.2` due to incorrect use of new function signature. [#4183](https://github.com/Semantic-Org/Semantic-UI/issues/4183)
- **Dropdown** - Fixed typo causing selectObserver mutation observer not to disconnect **Thanks @Paklausk** [#4311](https://github.com/Semantic-Org/Semantic-UI/issues/4311)

### Version 2.2.2 - July 07, 2016

- **Dropdown** - Fixed "pointer" cursor appearing in hitbox above search input in `search selection`, now all input area will appear with "text" input cursor

### Version 2.2.1 - June 27, 2016

- **Dropdown** - Fixed issue where using both `<select>` and `allowAdditions: true` would cause dropdown selection to fail

### Version 2.2.0 - June 26, 2016

- **Dropdown** - All dropdowns, not just `selection dropdown`, will now select the first `menu item` that starts with a pressed keyboard key, for example "N" will select "New"
- **Dropdown** - Dropdown now changes user selection on keyboard shortcuts immediately, this will save the extra `enter` key press to confirm selection in most cases. To enable previous pre `2.2` selection style use the setting `selectOnKeydown: false`
- **Dropdown** - Dropdown will now automatically focus on `search` inside of a dropdown menu after it is opened.
- **Dropdown** - Multiple select dropdown now sizes current dropdown input based on rendered width of a hidden element, not using an estimate based on character count. This means search will never break to a second line earlier than would normally fit in current line.
- **Dropdown** - Added `fullSearchSearch: 'exact'` setting, which requires exact matches for dropdown values [#3085](https://github.com/Semantic-Org/Semantic-UI/issues/3085) [#3994](https://github.com/Semantic-Org/Semantic-UI/issues/3994) **Thanks @ShawnCholeva**
- **Dropdown** - Added new setting for search selection `hideAdditions` this will remove showing user additions inside the menu, making for a more intuitive adding process. Dropdowns now have a new state `empty` which will format an active dropdown with empty results. [#3791](https://github.com/Semantic-Org/Semantic-UI/issues/3791)
- **Dropdown** - Adds new `allowReselection` option to trigger `onChange` events even when reselecting same value
- **Dropdown** - Adds new setting `minCharacters` which sets the minimum number of characters required to start filtering results [#3886](https://github.com/Semantic-Org/Semantic-UI/issues/3886)
- **Dropdown** - Added new convenience method `restore placeholder text`
- **Dropdown** - `forceSelection` will now automatically select values with multi dropdowns. When using `userAdditions` setting it will now automatically tokenize the current entered value
- **Dropdown** - `search selection` would not let you move back in an entered search string with left arrow [#3596](https://github.com/Semantic-Org/Semantic-UI/issues/3596) **Thanks @Sanjo**
- **Dropdown** - Fixed issue where value set using javascript DOM metadata would be cleared when a message or user addition triggered `refresh` [#3879](https://github.com/Semantic-Org/Semantic-UI/issues/3879) [#3622](https://github.com/Semantic-Org/Semantic-UI/issues/3622) **Thanks @mdehoog**
- **Form Validation / Dropdown** - Using "enter" key in a `search dropdown` could cause a form to be submitted [#3676](https://github.com/Semantic-Org/Semantic-UI/issues/3676)
- **Button/Dropdown** - Button dropdowns using `default text` no longer receive incorrect font styling for placeholder text
- **Dropdown** - `apiSettings` was not defaulting to use `cache: 'local'` as specified in the docs
- **Dropdown** - `get value` would not return correct value when value was blank [#3766](https://github.com/Semantic-Org/Semantic-UI/issues/3766)
- **Dropdown** - Added `1px` offset for current text so that the blinking text position cursor does not overlap first pixel of underlayed text.
- **Dropdown** - Dropdown would open when an label delete x was clicked when not using `search selection` [#3789](https://github.com/Semantic-Org/Semantic-UI/issues/3789)
- **Dropdown** - Dropdowns no longer re-open on selection when nested inside of a `<label>` [#3917](https://github.com/Semantic-Org/Semantic-UI/issues/3917)
- **Dropdown** - Dropdowns with sub-menus would not properly activate on mobile [#3183](https://github.com/Semantic-Org/Semantic-UI/issues/3183)
- **Dropdown** - Fixed bug where using `action: 'hide'` could cause `text` value not to be passed to `onChange` callback
- **Dropdown** - Fixed issue where values with `"` (double quotes) would not work with a dropdown using a select, because value would not be encoded as html entities
- **Dropdown** - Long dropdown text entry with `allowAdditions` would cause input to mistakingly drop to next line early [#3743](https://github.com/Semantic-Org/Semantic-UI/issues/3743)
- **Dropdown** - Regenerated dropdown will no longer ignore `disabled` property [#4010](https://github.com/Semantic-Org/Semantic-UI/issues/4010) **Thanks @eymengunay!**
- **Dropdown** - Search selection would lose search input focus when clicking on a choice [#3790](https://github.com/Semantic-Org/Semantic-UI/issues/3790)
- **Input** - Fixes issue with `dropdown` or button on the left side of an `action` input not properly rounding

### Version 2.1.7 - Dec 19, 2015

- **Sidebar** - Sidebar no longer includes `transform` rules on child elements, this was causing layout issues in some cases (for example dropdowns in sidebars) [#3306](https://github.com/Semantic-Org/Semantic-UI/issues/3306)

### Version 2.1.6 - Nov 6, 2015

- **Checkbox/Dropdown/Search** - Fixed issue where dropdown/checkbox `change` events were not bubbling. (Dispatched events were swapped to use native `document.creatEvent` in `2.1.5` unfortunately the flag to bubble events was mistakenly off.)

### Version 2.1.5 - Nov 1, 2015

- **Dropdown** - Added `onLabelRemove` callback that allows value removal to be cancelled by callback **Thanks @goloveychuk**
- **Checkbox/Dropdown/Search** - Fixed issue where using `.trigger('change')` would not fire native `change` event. Only triggering event handlers attached with jQuery [#3108](https://github.com/Semantic-Org/Semantic-UI/issues/3108)
- **Dropdown** - Fixed condition where focusing on dropdown would show a blank menu when "no results" was reached and the dropdown was refocused
- **Dropdown** - Search dropdowns will now correctly filter by current search term on re-focus
- **Dropdown** - Fixed issue where tabindex was being removed incorrectly with `selection dropdown` in some cases. [#3002](https://github.com/Semantic-Org/Semantic-UI/issues/3002)
- **Dropdown** - Added `remoteValues` as a possible `field` setting. Allowing users to return API results using arbitrary JSON object groupings. [#3080](https://github.com/Semantic-Org/Semantic-UI/issues/3080)
- **Dropdown** - Added ability to pass in `keys` as a setting, to avoid issues with languages where comma delimiter may be a different keycode [#3016](https://github.com/Semantic-Org/Semantic-UI/issues/3016)
- **Dropdown** - `search dropdown` will now initialize with `autocomplete="off"` to avoid triggering native autocomplete menu

### Version 2.1.4 - Sep 13, 2015

- **Dropdown** - Fixed issue with ',' key not being allowed in dropdown due to user tagging shortcut key [#3016](https://github.com/Semantic-Org/Semantic-UI/issues/3016)

#### Features

- **Dropdown**  - Dropdown using remote data, can now customize the property names returned by api call using `fields` (similar to search).
- **Dropdown** - Dropdown will now automatically update selected values when hidden input value changes (so long as `change` event is triggered) [#2626](https://github.com/Semantic-Org/Semantic-UI/issues/2626)
- **Dropdown** - Dropdown with user additions now will use custom templated messages to distinguish added choice from preselected choice [#2923](https://github.com/Semantic-Org/Semantic-UI/issues/2923)
- **Dropdown** - Added `get default text` and `get placeholder text` behaviors for returning text values.
- **Dropdown** - Pointing dropdown (dropdown with arrows) now support `upward`, and will automatically move pointer arrows when appearing upward [#2733](https://github.com/Semantic-Org/Semantic-UI/issues/2733)
- **Dropdown** - Dropdown `show` and `hide` are now cancellable by returning `false` from `onShow` or `onHide` callbacks.

#### Bugs

- **Dropdown** - `forceSelection` no longer sets current value in search selection when current query is blank [#2058](https://github.com/Semantic-Org/Semantic-UI/issues/2058)
- **Dropdown** - Dropdown `@arrowSize` will now automatically reposition itself if size is changed with variable
- **Dropdown** - Dropdown arrow now has a variable `@dropdownArrowSize`, and is slightly smaller than previously
- **Dropdown** - Fix `left menu` inside `ui menu` appearing horizontally [#2778](https://github.com/Semantic-Org/Semantic-UI/issues/2778)
- **Dropdown** - Fixed error where menu would disappear when entering spaced words using `allowAdditions: true` caused by value matching its own whitespace-trimed value [#2853](https://github.com/Semantic-Org/Semantic-UI/issues/2853)
- **Dropdown** - Fixed issue where "no results" message would be still be visible before search query on input focus [#2824](https://github.com/Semantic-Org/Semantic-UI/issues/2824)
- **Dropdown** - Fixed issue where `onChange` would not fire when using `action: 'hide'`. [#2818](https://github.com/Semantic-Org/Semantic-UI/issues/2818)
- **Dropdown** - Fixed issue where selected item would not be shown when being re-shown after filtering with single search selection [#2824](https://github.com/Semantic-Org/Semantic-UI/issues/2824)
- **Dropdown** - Fixes issues with setting "" (empty quote) values when `placeholder: false` is used. Fixes issues with using `clear` and `restore defaults` without placeholders. [#2637](https://github.com/Semantic-Org/Semantic-UI/issues/2637)
- **Dropdown** - Remove use of `trim` which causes issues IE 11 and below [#2806](https://github.com/Semantic-Org/Semantic-UI/issues/2806)
- **Form** - `disabled field(s)` now remove `pointer-events` allowing it to disable checkbox and dropdown functionality  [#555](https://github.com/Semantic-Org/Semantic-UI/issues/#555)
- **Dropdown** - Fixed issue where label could not be removed when using a numeric value due to mismatched types [#2754 [#2755 **Thanks @dgurkaynak**](https://github.com/Semantic-Org/Semantic-UI/issues/ak**)
- **Dropdown** - Dropdown will no longer fire native `onchange` event on hidden input when setting value during initial load (unless `fireOnInit: true`) #2795 **Thanks @lauri-elevant**
- **Dropdown** - Fixed issue where `forceSelection` would not occur when `pageLostFocus` (clicked into another tab and back)
- **Dropdown** - Fixed issue where using the specific value `value="false"` would cause an option to not be removable from a multiple select
- **Dropdown** - When `useLabels: false` placeholder text will now show up when 0 items selected, instead of the text "0 items selected"
- **Dropdown/Tab** - Fixed an instance where `metadata` was not referencing settings metadata value
- **Form** - Dropdown in `inline field` now use auto width instead of 100%
- **Menu** - Fix text align on `dropdown item` inside `icon menu`

### Version 2.0.7 - July 23, 2015

- **Dropdown** - Fixed border radius on `circular labeled icon button`  [#2700](https://github.com/Semantic-Org/Semantic-UI/issues/2700)
- **Dropdown** - Fixed issue where dropdown nested inside `label` would not open. [#2711](https://github.com/Semantic-Org/Semantic-UI/issues/2711)

### Version 2.0.6 - July 22, 2015

- **Dropdown** - Fixed issue where `disabled` dropdown would still receive focus [#2699](https://github.com/Semantic-Org/Semantic-UI/issues/2699)
- **Dropdown** - Fixed `restore value` sometimes now working correctly due to "animating out" label still being mistaken for selected. [#2690](https://github.com/Semantic-Org/Semantic-UI/issues/2690)
- **Dropdown** - Added `set exactly` to remedy confusion of `set selected` not removing current selections with multiple [#2689](https://github.com/Semantic-Org/Semantic-UI/issues/2689)
- **Dropdown** - Fixed issue where using text labels, `useLabels: false`, would cause selection count to appear incorrect.
- **Dropdown** - Text labels, `useLabels: false`, now works correctly with `maxSelections`, and receives special UX considerations

### Version 2.0.5 - July 20, 2015

- **Dropdown** - Fixed issue causing `multiple search dropdown` using [`search` inside menu](http://www.semantic-ui.com/modules/dropdown.html#search-in-menu) to break when multiple [#2666](https://github.com/Semantic-Org/Semantic-UI/issues/2666)
- **Dropdown** - `<select>` dropdowns initialized without `multiple` property set on `<select>` will now produce an error to alert users selection will not be preserved correctly. Related [#2573](https://github.com/Semantic-Org/Semantic-UI/issues/2573)
- **Dropdown** - Dropdown `<option>` added with `userAddition` now receive class name `addition` to distinguish from original `<select>` options. [#2573](https://github.com/Semantic-Org/Semantic-UI/issues/2573)
- **Dropdown** - User additions now have their `<option>` removed if a user deselects an addition. [#2573](https://github.com/Semantic-Org/Semantic-UI/issues/2573)

### Version 2.0.4 - July 17, 2015

- **Dropdown** - Fixed `search selection` appearing incorrectly inside menu (default text would not disappear) [#2624](https://github.com/Semantic-Org/Semantic-UI/issues/2624)

### Version 2.0.3 - July 8, 2015

- **Dropdown** - Dropdown using `<select>` and `apiSettings` will now correctly add new `<option>` value when selections are made [#2573](https://github.com/Semantic-Org/Semantic-UI/issues/2573)

### Version 2.0.2 - July 7, 2015

- **Dropdown** - Fixed regression in `2.0.1` causing search dropdown not to clear values correctly [#2533](https://github.com/Semantic-Org/Semantic-UI/issues/2533)
- **Dropdown** - Dropdown icon will now always toggle menu visibility [#2510](https://github.com/Semantic-Org/Semantic-UI/issues/2510)
- **Dropdown** -  Pressing same key on dropdown with multiple choices with same first letter will now cycle selections. For example "California" then "Colorado" when pressing C [#2516](https://github.com/Semantic-Org/Semantic-UI/issues/2516)
- **Dropdown** - Dropdown now changes text before calling `onChange` callback so that callback reflects new dropdown conditions [#2539](https://github.com/Semantic-Org/Semantic-UI/issues/2539)
- **Dropdown** - Clicking on label, or deleting a label will no longer trigger dropdown menu toggling
- **Dropdown** - Multiselect that do use text labels (e.g. "5 selected") will now remove filters on selection and scroll to last selected value

### Version 2.0.1 - July 6, 2015

- **Dropdown** - Fixed transparent tap color not being set correctly. Removed toggle behavior from touch events on multiple dropdown. [#2524](https://github.com/Semantic-Org/Semantic-UI/issues/2524)
- **Dropdown** - `restore defaults` in dropdown when used with multiple will now correctly clear other values selected that were not there on page load.
- **Dropdown** - Removes accidental console.log statement in dropdown
- **Dropdown** - Dropdown no longer closes after max selections reached and enter key used for selection.
- **Dropdown** - Dropdown will now show correctly when menu only includes a message with no other items

### Version 2.0.0 - June 30, 2015

- **Dropdown** - Dropdowns will now change opening directions automatically based on available screen space. If you need  to force a dropdown direction use `dropdown({ direction: 'upward'})`
- **Dropdown** - Dropdown item `description` now are floated in default theme and should be included before other `item` content
- **Multiselect** - New `multiple` dropdown types have been added. Many new dropdown improvements have been added including tagging/tokenizing features and loading data through API requests.
- **Dropdown** - Added remote API integration with dropdown, to allow `search selection` to query against a remote dataset.
- **Dropdown** - Dropdowns now automatically observe changes in `menu` and will update selector cache with new additions
- **Dropdowns** - Added ability to add custom choices to all search selection dropdowns (multi/single) using `allowAdditions: true` setting. Search now displays error messages on no results in all cases.
- **Dropdown** - Keyboard shortcuts have been added for selecting dropdown choices, for example "N" will scroll to "New York" in a state selection list, similar to native `<select>` behavior.
- **Dropdown** - Added new dropdown variation `scrolling dropdown` and `scrolling menu`, this can be used to include a scrollable section inside a dropdown menu.
- **Dropdown** - Dropdown will automatically animate upward if there is not enough space to appear below.
- **Dropdown** - Using `page up` and `page down` keys will now scroll menus by a page at a time
- **Transition** - Fallback javascript animations have been removed from UI components like dropdown and popup to increase performance. This removes need for expensive pseudo selectors like `:visible`, `:animated` and `:hidden` and reduces filesize.
- **Dropdown** - Nested `scrolling` menus now support keyboard selection, e.g. pressing "A" for apple, and keyboard scrolling.
- **Dropdown** - Dropdowns now have `match` setting to specify whether to match on `text`, `value` or `both`
- **Dropdown** - Multi select dropdowns now have new settings for specifying maximum selection count
- **Dropdown** - Dropdown has new `placeholder` setting for setting placeholder text in javascript
- **Dropdown** - Added `showOnFocus` option that lets you specify whether dropdown menu should show on focus
- **Dropdown** - `fullTextSearch: true` now uses fuzzy search (same as `ui search`)
- **Dropdown** - Page down and page up now works with dropdown menus
- **Dropdown** - Dropdown initialized with `disabled` prop on an `option` will now correctly appear disabled
- **Dropdown** - Added `disabled item` state, disabled items will automatically be skipped with keyboard selection
- **Form** - Fix `errored field` dropdown keyboard selection color
- **Input** - Action input now supports multiple buttons, and dropdown
- **Menu** - Fixed several inheritance issues for `dropdown item` inside `menu` appearing as `menu item`.
- **Menu** - The hover/active state of `dropdown item` have been adjusted to match `item`. Dropdown styles can be themed specifically inside `menu`.
- **Menu** - Vertical dropdown menus are no longer 100% `min-width`
- **Checkbox** - Fixes nested `dropdown` inside `checkbox` causing issues
- **Dropdown** - `focus` after changing tabs will no longer cause menu to re-open **Thanks @trevorharwell**
- **Dropdown** - Fix issue with search dropdown refocusing on self the first time after "tabbing" away in Chrome
- **Dropdown** - Fixes issue with headers disappearing inside of `ui dropdown` when nested in `ui menu`
- **Dropdown** - Fixes `onChange` to fire when input value changes, not just when menu UI changes
- **Dropdown** - Dropdowns with `transition: none` now work correctly.
- **Dropdown** - Fixed issue where `sortSelect` was relying on object key enumeration order which is browser dependent and unreliable. It now uses a sort function which functions the same in all browsers
- **Dropdown** - Fixed issue with `search selection` not changing text when reselecting same value from list
- **Dropdown** - Fixed `min-width` issues causing background to not appear behind unwrapped text with `white-space: nowrap`
- **Dropdown** - Dropdown `menu` now use same font size as dropdown
- **Dropdown** - Fixed dropdown `metadata` attribute caching causing issues with React integration
- **Dropdown** - Fixed border radius on `sub menu` when aligned `left`
- **Dropdown** - Fixed `inline dropdown` icon not aligning with content
- **Dropdown** - Fixed behaviors called on `<select>` after initialization not being correctly applied to `ui dropdown`
- **Dropdown** - Fixed issue with matching boolean values, and using `set selected` with `true` or `false`
- **Dropdown** - Fixed `search dropdown` submitting parent form when enter shortcut pressed
- **Dropdown** - Fixed dropdown menu items should not center inside of a center aligned container.
- **Dropdown** - Fixed some cases where onChange would not occur for values matching equality against '', for example `0`
- **Form** - Fixed autocompleted `ui selection dropdown` having dropdown icon z-index issues
- **Menu** - `dropdown menu` in a `secondary pointing menu` or `tabular menu` now receive distinct active styling from other `active item`
- **Menu** - Fix issue with `pointing` arrow having too high a `z-index` and appearing above `ui dropdown menu`
- **Dropdown** - Dropdown padding values now resolve to exact pixel values from em
- **Dropdown** - `item` `description` is now floated by default

### Version 1.12.2 - May 4, 2015

- **Dropdown** - Fixed `left` and `right` arrow does not move input cursor with `visible selection dropdown`. Event accidentally prevented by `sub menu` shortcut keys.

### Version 1.12.1 - April 26, 2015

- **Dropdown** - Fixes issue with chained dropdown methods used on a `<select>` not applying to the generated `ui dropdown` **Backport from 2.0**

### Version 1.11.6 - March 27, 2015

- **Menu/Dropdown** - Fix dropdown headers disappearing inside menus
- **Dropdown** - Fix unescaped character in css property causing css validation errors

### Version 1.11.5 - March 23, 2015

- **Dropdown** - `onChange` no longer fires when reselecting same value
- **Dropdown** - Fix bug where element will not blur on tab key when search selection and no selection made
- **Dropdown** - Dropdown init on `select` now returns `ui dropdown` created for chaining
- **Dropdown** - Dropdown `focus` color has been adjusted to match forms more closely
- **Dropdown** - Fixes IE10 scrollbar width in menu (calc was being precompiled in LESS) **Thanks @gabormeszoly**

### Version 1.11.2 - March 6, 2015

- **Dropdown** - Fix issue in `setup reference` (added in `1.11.1`) where chaining would not return `ui dropdown` immediately after initialization

### Version 1.11.1 - March 5, 2015

- **Dropdown** - Calling behaviors on a dropdown `select` will now automatically route them to the appropriate parent `ui dropdown`
- **Dropdown** - Added select styles for elements before they are initialized instead of FOIC (Flash of invisible content)

### Version 1.11.0 - March 3, 2015

- **Dropdown** - Fixes issue where dropdown would not open after restoring previous value on failed `search dropdown` search
- **Dropdown** - Fixes issue where dropdown would not open after restoring previous value on failed `search dropdown` search

### Version 1.10.3 - February 27, 2015

- **Menu** - Fixes dropdown menu item not having a hover state inside inverted menu

### Version 1.10.0 - February 23, 2015

- **Menu** - Fixes pointing menu displaying under dropdown menu

### UI Changes

- **Input** - Input with dropdowns is now much easier, see docs. `action input` and `labeled input` now use `display: flex`. `ui action input` now supports `<button>` tag usage (!) which support `flex` but not `table-cell`
- **Dropdown** - `search selection dropdown` will now close the menu when a `dropdown icon` is clicked
- **Dropdown** - Added new dropdown setting, `forceSelection` which forces `search selection` to a selected value on blur. Defaults to `true`.
- **Form Validation** - Dropdown and checkbox will now validate after interaction with `on: 'blur'`
- **Form** - Lightened error dropdown hover text color to be more legible
- **Dropdown** - Upward dropdown now has upward arrow icon

### Version 1.8.1 - January 26, 2015

- **Input** - `ui labeled input` now uses  `flex` added example in ui docs with dropdown

### Version 1.8.0 - January 23, 2015

- **Dropdown** - Dropdown now stores `placeholder text` (prompt text) as separate from `default text` (text set on page load). You can now reset placeholder conditions using `$('.ui.dropdown').dropdown('clear');``
- **Dropdown** - Keyboard navigation will now allow opening of sub menus with right/left arrow. Enter will open sub-menus on an unselectable category (`allowCategorySelection: false`) as well.
- **Dropdown** - Mutation observers will now observe changed in `<select>` values after initialization, and will automatically update dropdown menu when changed
- **Dropdown** - Dropdown behavior `set selected` will now also call `set value` automatically, so you do not have to invoke two behaviors to update a `selection dropdown` **Thanks @mktm**
- **Dropdown** - Dropdown no longer will not show menu when no `item` are present in menu. Dropdown will now only filter results for `ui search dropdown` #1632 **Thanks PSyton**.
- **Dropdown** - Dropdown will now produce an error if behaviors on an initialized `<select>` are not invoked on `ui dropdown`
- **Dropdown** - Fixed bug where link items would not open in sub-menus due to `event.preventDefault`
- **Label** - Fixed `ui corner label` appearing on-top of `ui dropdown` menu due to issue in z-index hierarchy

### Version 1.7.0 - January 14, 2015

- **Dropdown** - Javascript Dropdown can now be disabled by adding ``disabled` class. No need to call `destroy`. **Thanks Psyton**
- **Dropdown** - Search dropdown input can now have backgrounds. Fixes issues with autocompleted search dropdowns which have forced yellow "autocompleted" bg.
- **Dropdown** - Fix issue with search selection not correctly matching when values are not strings
- **Dropdown** - New `upward dropdown` variation, which opens its menu upward. Default animation now uses ``settings.transition = 'auto'` and determines direction of animation based on menu direction
- **Dropdown** - Dropdown matching fields without values now trims whitespace by default
- **Dropdown** - `restore defaults` will now set placeholder styling and remove active element. Added example in docs.
- **Dropdown** - Fixed bug where sub menus may sometimes have dropdown icon overlap text
- **Dropdown** - Fixes dropdown search input from filtering text values when input is inside menu, i.e "In-Menu Search"
- **Dropdown** - Fix issue with search selection not correctly creating RegExp when select values are not strings **Thanks @alufers**
- **Dropdown** - Fix issue with `left floated` and `right floated` content sometimes not applying correctly

### Version 1.6.0 - January 05, 2015

- **Form** - ``ui search dropdown`` inside a form has incorrect focus style

### Version 1.5.0 - December 30, 2014

- **Dropdown** - New setting ``allowCategorySelection`` lets menu items with sub menus be selected. Added example in docs.
- **Dropdown/Search** - Fixed issues with ``ui search`` and ``ui search dropdown`` using ``RegExp test`` which [advances pointer on match](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/test) causing results to display incorrectly

### Version 1.4.1 - December 23, 2014

- **Dropdown** - ``<select>`` elements will now preserve original ``<option>`` order by default. Added ``sortSelect`` setting (disabled by default) to automatically sort ``<option>`` on initialization
- **Button** - Fixes issue with ``will-change`` property added to ``ui button`` causing layout z-indexing issues (dropdown button)

### Version 1.4.0 - December 22, 2014

- **Menu** - Fix border radius of dropdown menu inside `ui vertical menu`
- **Menu** - Fix formatting of ``ui selection dropdown`` inside ``menu``

### Version 1.3.0 - December 17, 2014

- **Dropdown** - Dropdown can now specify which direction a menu should appear left/right, dropdown icons can also appear on the left
- **Dropdown** - Full text search now defaults to ``false``, meaning search terms will return only results beginning with letters
- **Dropdown** - Search Dropdown is now much more responsive, js improvements and input throttling added.Throttling defaults to `50ms` and can be modified with settings ``delay.search``
- **Dropdown** - Search Dropdown now correctly replaces placeholder text when backspacing to empty value
- **Dropdown** - Search Dropdown now has a callback when all results filtered ``onNoResults``
- **Dropdown** - Search dropdown will now strip html before searching values when searching html
- **Dropdown** - Search now has keyboard shortcut to open dropdown on arrow down
- **Dropdown** - Dropdown now always scrolls to active element on menu open, calculates position with new ``loading`` class
- **Dropdown** - Fix bug in position of sub menus with ``floating dropdown``
- **All UI** - Adds error message when triggering an invalid module behavior i.e. typos ``$('.dropdown').dropdown('hid');``

### Version 1.2.0 - December 08, 2014

- **Dropdown** - Fixes bug with dropdown converted from ``select`` that use ``<option`` values with capital letters not being selectable
- Fixed documentation on dropdown actions, form field widths, form validation types, and many odds & ends

### Version 1.1.0 - December 02, 2014

- **Dropdown** - Dropdown ``onChange`` callback now fires when calling ``setSelected`` programmatically.
- **Dropdown** - Fix ``action input`` used inside ``ui dropdown`` to appear correctly **Thanks ordepdev**

### Version 1.0.0 - November 24, 2014

- **Dropdown** - Sub menus inside dropdowns now need a wrapping div **text** around sub-menu descriptions
- **Dropdown** - New dropdown type, searchable selection for large lists of choices
- **Dropdown** - Dropdowns can now be initialized directly on a ``<select>`` element without any html
- **Dropdown** - New action combo will change text of adjacent button, select will select element but not change text
- **Dropdown** - Many new content types now work inside dropdowns, headers, dividers, images, inputs, labels and more
- **Form** - Inputs now use 1em font size and correctly match selection dropdown height

### Version 0.18.0 - June 6, 2014

- **Dropdown** - Fixes dropdown 'is animating' with dropdowns when CSS animations were not included **Thanks nathankot**

### Version 0.17.0 - May 9, 2014

- **Dropdown** - Dropdowns can now receive focus and be navigated with a keyboard **Thanks Musatov**

### Version 0.15.1 - Mar 14, 2014

- **Dropdown** - Typo in dropdown css was causing selection dropdowns not to appear

### Version 0.15.0 - Mar 14, 2014

- **Form** - Forms, Dropdowns, and Inputs now have matching padding size, and use 1em font size to appear same size as surrounding text
- **Form Validation** - Form validation now automatically revalidates a selection dropdown on change when invalid
- **Dropdown** - Element's with numeric ``data-text`` values were erroring when selected
- **Dropdown** - Default selection text was not appearing when a dropdown had a value that was ``false`` or ``0``

### Version 0.14.0 - Mar 03, 2014

- **Dropdown** - Dropdown now has error state **Thanks Musatov**
- **Form** - Form fields with errors will now properly style dropdown elements **Thanks Musatov**

### Version 0.13.0 - Feb 20, 2014

- **Menu** - Fixes dropdown formatting when used **inside* a menu item

### Version 0.12.0 - Jan 06, 2014

- **Dropdown** - Fixes dropdowns links not working on touch devices
- **Dropdown** - Default value is now stored on init, and can be restored using 'restore defaults' behavior
- **Dropdown** - Fixes touchmove event not clearing on touch devices causing unnecessary overhead
- **Dropdown** - Fixes issue where last match was returned, not prioritizing value over text

### Version 0.10.3 - Dec 22, 2013

- **Dropdown** - Fixes issue where dropdown animation does not occur sometimes (Thanks MohammadYounes)

### Version 0.10.2 - Dec 13, 2013

- **Dropdown** - Fixes missing easing equations for dropdown javascript animations. Would cause an error when no css transitions were included and jquery easing was not available.

### Version 0.10.0 - Dec 05, 2013

- **Dropdown** - Value can be retrieved even in instances where forms arent used

### Version 0.9.4 - Nov 24, 2013

- **Dropdown** - Fixes issue where falsy value (i.e. 0) could not be selected

### Version 0.9.3 - Nov 17, 2013

- **Dropdown** - Fixes "falsy" values (like 0) not being processed correctly
- **Button** - Fixes improper active/visible state due to :not specificity (most noticeable in mousedown on a dropdown button)

### Version 0.9.0 - Nov 5, 2013

- **Dropdown** - Dropdown now always receives pointer cursor in all types
- **Menu** - Dropdown position inside secondary menus should be more precise
- **Menu** - Floating dropdown menus now work inside menus

### Version 0.8.2 - Oct 28, 2013

- **Menu** - Fixes arrow direction on vertical menu dropdown

### Version 0.8.0 - Oct 25, 2013

- **Dropdown** - Fixes border radius on non-selection dropdowns from changing on activation

### Version 0.7.1 - Oct 23, 2013

- **Dropdown** - Fixes issue with dropdown icon position in chrome

### Version 0.7.0 - Oct 22, 2013

- **Dropdown** - Dropdown cannot display inside item image
- **Dropdown** - Dropdown links were being prevented by event.preventDefault used for touch devices
- **Dropdown** - Fixes issue with borders on selection dropdown
- **Dropdown** - Fixes pointing dropdown to appear correctly in menu
- **Popup** - Popup no-longer receives class name 'visible' on show, this allows popups to be used on dropdowns and other elements with a visible state

### Version 0.6.5 - Oct 18, 2013

- Fixes issue where browser default action, like link clicking, was prevented on dropdown item click

### Version 0.6.4 - Oct 16, 2013

- Fixes issue where browser default action, like link clicking, was prevented on dropdown item click

### Version 0.6.3 - Oct 15, 2013

- Dropdown changeText and updateForm have been deprecated and will be removed in 1.0
- Dropdown hide no longer selects current item as active (useful for menus)
- Simplified possible dropdown actions changeText and updateForm are now consolidated into activate which is the new default

### Version 0.6.2 - Oct 15, 2013

- Fixes touch+mouse like touchscreen laptops to work with dropdowns
- Dropdown vastly improved for touch, now can scroll with touch without closing dropdown
- Dropdown active style now slightly more noticable

### Version 0.6.1 - Oct 15, 2013

- Dropdowns in vertical menu automatically receive proper triangle pointer direction
- Fixed shadow overlap on dropdown in menus

### Version 0.4.3 - Oct 10, 2013

- Updates dropdown to include proper invoke

### Version 0.4.2 - Oct 9, 2013

- Fixes issue with event bubbling being cancelled on dropdown item click

### Version 0.3.6 - Oct 7, 2013

- Dropdown action default is now automatically determined based on type of dropdown, select dropdowns now will update form fields with default options

### Version 0.3.2 - Oct 2, 2013

- Dropdown now formats top and right arrow icons automatically with icon coupling with sub menus
- Fixes position of menu dropdowns in some cases

### Version 0.2.5 - Sep 28, 2013

- Fixes dropdown to now set active item to whatever hidden input field is when using action updateForm

### Version 0.2.2 - Sep 28, 2013

- Fixes invoke returning found function instead of results of found function in dropdown, modal

### Version 0.2.0 - Sep 28, 2013

- Swaps modal and dropdown to use same variable naming pattern as rest of modules

### Version 0.1.0 - Sep 25, 2013

- Adds dropdown icon sexiness to accordions, now with rotating pointing arrows