### Version 2.3.3 - June 18, 2018

- **Icon** - Several icon names have been deprecated due to incompatibility with `transition in` and `transition out` used in animations.

### Version 2.3.0 - Feb 20, 2018

- **Transition** - Adds new `glow` transition for highlighting an element on the page, and `zoom` animation for scaling elements without opacity tween.
- **Images / Transition** - Fixed issue where `ui images` would show nested images with `transition hidden` as block (Fixes sequential img animation demo in docs)

### Version 2.2.5 - October, 27, 2016

- **Progress** - Progress now includes transitionEnd failback for progress bar animations, this will prevent labels from continuing to be updated if the `transitionEnd` css callback does not fire correctly
- **Transition** - You can now specify `data-display` to specify the final display state for an animation in cases that it is detected incorrectly (you can also pass in as a setting)

### Version 2.2.3 - August 21, 2016

- **Transition** - Removed unreachable code **Thanks @basarat** [#4225](https://github.com/Semantic-Org/Semantic-UI/issues/4225)

### Version 2.2.0 - June 26, 2016

- **Image** - `transition hidden image` now shows correctly as `visibility: hidden;` and not `display: none`. This will allow `offset` with `visibility` and `sticky` to work more seamlessly. `hidden image` will still remain `display: none;`

### Version 2.1.7 - Dec 19, 2015

- **Transition** - Fixes `noAnimation` error to more reasonably announce that the element is "not in the DOM" [#3040](https://github.com/Semantic-Org/Semantic-UI/issues/3040)

### Version 2.1.5 - Nov 1, 2015

- **Transition** - Fixed bug where static transitions (those that dont animate in/out of view) would not fire `onComplete` event

#### Bugs

- **Transition** - Transition callbacks now all have the correct `this` set. [#2758](https://github.com/Semantic-Org/Semantic-UI/issues/2758)

### Version 2.0.4 - July 17, 2015

- **Transition** - Fixed issue where animating same element in its own `onComplete` would fail because animation had not yet called `force visible/hidden` [#2583](https://github.com/Semantic-Org/Semantic-UI/issues/2583)

### Version 2.0.3 - July 8, 2015

- **Transition** - Fixes `get current animation` erroring when `module cache` is cleared. [#2469](https://github.com/Semantic-Org/Semantic-UI/issues/2469)

### Version 2.0.0 - June 30, 2015

- **Transition** - Fallback javascript animations have been removed from UI components like dropdown and popup to increase performance. This removes need for expensive pseudo selectors like `:visible`, `:animated` and `:hidden` and reduces filesize.
- **Transition** - Transition code has been optimized to increase performance. 100% improvement on first animation, and 40% improvement on subsequent animations.
- **Modal** - Modal now uses an adjusted `scale in` transition in the default theme, that should be more subtle and work better with long modal content.
- **Site** - Fixed mixed globals `@defaultDuration` and `@transitionDuration` usage to use a single variable across all UI `@defaultDuration`, the same for `@defaultEasing` and `@transitionEasing`
- **Transition** - Adjusting `style` or `class` during a transition, will no longer reset the change after transition completes.
- **Transition** - Transition will no longer force visible/hidden with inline styles if `onComplete` callback sets visibility.
- **All Modules/Transition** - Transitions no longer use `rotateZ(0deg)` to trigger GPU display of visible state. This causes issues with `transform` creating new stacking context that can disrupt `z-index`.
- **Dropdown** - Dropdowns with `transition: none` now work correctly.
- **Sticky** - Fix issue with sticky content scroll css transition causing element to scroll too slowly when cannot fit on screen.
- **Transition** - Fixed bug where transition out would cause unwanted focus event in IE if element has focus
- **Transition** - Calling an `out` animation during an `in` animation with `queue: false` now correctly calls the `complete` event of the original animation
- **Transition** - Fixed bug where transition could sometimes not occur when an element was determined to always be hidden
- **Rating** - Rating styles have been adjusted to use subtle transitions and tweaked color values.
- **Transition** - Transition no longer checks for vendor prefixed `animation-name` css property. This was introduced in jQuery `1.8`
- **Transition** - Some transition have been modified so that the `in` animation is more telegraphed than the `out` animation, which may now recede more gently.

### Version 1.11.0 - March 3, 2015

- **Transition** - Added more reasonable default durations for each animation
- **Transition** - Added `toggle` behavior and docs for `show` and `hide`
- **Transition** - transition now has `stop`, `stop all`, and `clear queue` for removing transitions, (undocumented method `stop`, and `start` renamed to `enable` and `disable`)
- **Transition** - Fixes `swing out` animations not working correctly
- **Transition** - Fixed display state other than `block` not determined when using `show` and `hide` without an animation
- **Transition** - Fix bug in `remove looping` causing next animation to use same duration
- **Transition** - Adds examples of `hide, `show`, `toggle`, `stop`, `stop all`, and `clear queue`

### Version 1.10.0 - February 23, 2015

- **Transition** - Transitions now have `interval` to allow grouped elements to animate one by one with a delay between each animation. Grouped animations determine order based on transition direction to avoid reflows, or can manually be reversed by using <code>reverse: true</code> [See Examples](http://www.semantic-ui.com/modules/transition.html#grouped-transitions) for more details.
- **Transition** - Webkit `failSafe` used for [Chromium Bug #437860](https://code.google.com/p/chromium/issues/detail?id=437860) now also works for queued animations
-**Transition** - `useFailSafe` was incorrectly shown as `false` by default

### UI Changes

- **Transition** - Fixes bug where `moduleNamespace` was being omitted
- **Transition** - Transitions with direction now use word order dependency to prevent conflict with component directions, for example `bottom left popup slide down in transition

### Version 1.8.1 - January 26, 2015

- **Popup** - Popup `hide all` will now use transition set in `settings.transition` when closing other popups

### Version 1.8.0 - January 23, 2015

- **Transition** - Added many new transitions, and new directions for existing transitions **Thanks @ph7vc**
- **Transition** - Transition duration now defaults to what is specified in `css`, to set custom duration you can still pass at run-time as a different value. Animation duration no longer set by default during animation.
- **Transition** - Transition will now prevent repeated animations when using an inferred direction i.e. animation without `in` or `out` specified. When `queue: true` only animations with explicit direction, e.g. `fade in`, will be ignored when called repeatedly.
- **Transition** - Fixed bug with animations that contain the strings 'in' or 'out' as part of their names, for example "swing"

### Version 1.7.0 - January 14, 2015

- **Dropdown** - New `upward dropdown` variation, which opens its menu upward. Default animation now uses ``settings.transition = 'auto'` and determines direction of animation based on menu direction

### Version 1.6.1 - January 05, 2015

- **Accordion** - Accordion now uses ``useFailSafe: true`` to avoid callbacks not occurring because of race conditions with `transitionend` in webkit

### Version 1.6.0 - January 05, 2015

- **Accordion** - Child element animations now use ``$.fn.transition`` and css animations by default (if available)

### Version 1.1.0 - December 02, 2014

- **Transition** - Transition's caching of final display state and animation existence now has improved performance.
- **Transition** now has ``useFailSafe`` parameter (off by default) to ensure transition callback fires even if native ``onAnimationEnd`` event does not fire due to element visibility. [Chromium Bug Report by Product Manager @ Mozilla](https://code.google.com/p/chromium/issues/detail?id=135350#c2) and [this open issue](https://code.google.com/p/chromium/issues/detail?id=437860)
- **Transition** - Transition now correctly detects missing animations, errors do not cause future image transitions to break

### Version 1.0.1 - November 28, 2014

- **Transition** - Fix vertical flip not working due to css typo **Thanks cgroner**
- **Table** - Fixes table cell transition animating all properties

### Version 1.0.0 - November 24, 2014

- **Transition** - Complete, and Start callbacks are now ``onComplete`` and ``onStart``
- **Transition** - Transition will now keep block position of elements hidden with visibility hidden
- **Transition** - Transitions now will handle multiple display types more consistently
- **Transition** - Transition now has a new ``start`` callback, before animation starts
- **Transition** - Complete callback now does not occur if animation is interrupted before completing
- **Transition** - You can now specify the final displayType of a transitioning element in metadata or settings (not just automatically detected)

### Version 0.19.0 - July 3, 2014

- **Transition** - Adds "fade in left/right" variations to match "fade up/down" **Thanks AdamMaras**

### Version 0.16.1 - April 22, 2014

- **Transition** - Fixes bug where transition could accidentally hide element on show due to error when determining original display type

### Version 0.16.0 - April 22, 2014

- **Transition** - Fixes issue where transition hidden was sometimes overwritten by UI styles causing the element to stay visible

### Version 0.15.3 - April 04, 2014

- **Transition** - CSS Transitions now work in legacy FF (FF > 12)

### Version 0.15.0 - Mar 14, 2014

- **Modal** - Modal onShow and onHide occurs before transition starts, allowing for class name changes not to be reset

### Version 0.12.5 - Feb 04, 2014

- **Modal** - Fixes modal throwing an error when transition is not included *Thanks robertoles*

### Version 0.12.0 - Jan 06, 2014

- **Transition** - Transitions will now, by default, prevent the current animation from being queued while it is actively animating the same animation

### Merry Christmas!

-**Transition**: Transition has been completely rewritten, performance should be about 10x after first animation due to caching and use of request animation frame

-**Transition**: Transitions now work with **any display type** not just display: block, meaning transitions can be used on buttons and other inline elements without affecting display

-**Transition**: Fixes typo in "horizontal flip out" causing opacity to be fading in

### Version 0.10.2 - Dec 13, 2013

- **Dropdown** - Fixes missing easing equations for dropdown javascript animations. Would cause an error when no css transitions were included and jquery easing was not available.

### Version 0.9.4 - Nov 24, 2013

- **Transition** - Fixes transition exists function from not being called

### Version 0.8.5 - Nov 2, 2013

- **Modal** - Fixed issue with modals not working in 0.8.4 due to mistake in transition invoke

### Version 0.8.4 - Nov 1, 2013

- **Modules** - Adds CSS transition support detection to all modules using css transitions to allow for graceful degradation for IE8

### Version 0.7.0 - Oct 22, 2013

- **Transition** - onShow and onHide callbacks for visibility changing transitions
- **Shape** - Transition duration can now be set programmatically

### Version 0.3.4 - Oct 2, 2013

- Transitions now work in Safari versions that do not support animation-direction

### Version 0.2.1 - Sep 28, 2013

- Transition now forces browser repaint after animation

### Version 0.1.0 - Sep 25, 2013

- Updated documentation for sidebar, transition, and form validation