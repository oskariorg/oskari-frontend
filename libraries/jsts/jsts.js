/*
  javascript.util is a port of selected parts of java.util to JavaScript which
  main purpose is to ease porting Java code to JavaScript.

  The MIT License (MIT)

  Copyright (C) 2011,2012 by The Authors

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
(function(){var e=function(t,n){var r=e.resolve(t,n||"/"),i=e.modules[r];if(!i)throw new Error("Failed to resolve module "+t+", tried "+r);var s=e.cache[r],o=s?s.exports:i();return o};e.paths=[],e.modules={},e.cache={},e.extensions=[".js",".coffee",".json"],e._core={assert:!0,events:!0,fs:!0,path:!0,vm:!0},e.resolve=function(){return function(t,n){function u(t){t=r.normalize(t);if(e.modules[t])return t;for(var n=0;n<e.extensions.length;n++){var i=e.extensions[n];if(e.modules[t+i])return t+i}}function a(t){t=t.replace(/\/+$/,"");var n=r.normalize(t+"/package.json");if(e.modules[n]){var i=e.modules[n](),s=i.browserify;if(typeof s=="object"&&s.main){var o=u(r.resolve(t,s.main));if(o)return o}else if(typeof s=="string"){var o=u(r.resolve(t,s));if(o)return o}else if(i.main){var o=u(r.resolve(t,i.main));if(o)return o}}return u(t+"/index")}function f(e,t){var n=l(t);for(var r=0;r<n.length;r++){var i=n[r],s=u(i+"/"+e);if(s)return s;var o=a(i+"/"+e);if(o)return o}var s=u(e);if(s)return s}function l(e){var t;e==="/"?t=[""]:t=r.normalize(e).split("/");var n=[];for(var i=t.length-1;i>=0;i--){if(t[i]==="node_modules")continue;var s=t.slice(0,i+1).join("/")+"/node_modules";n.push(s)}return n}n||(n="/");if(e._core[t])return t;var r=e.modules.path();n=r.resolve("/",n);var i=n||"/";if(t.match(/^(?:\.\.?\/|\/)/)){var s=u(r.resolve(i,t))||a(r.resolve(i,t));if(s)return s}var o=f(t,i);if(o)return o;throw new Error("Cannot find module '"+t+"'")}}(),e.alias=function(t,n){var r=e.modules.path(),i=null;try{i=e.resolve(t+"/package.json","/")}catch(s){i=e.resolve(t,"/")}var o=r.dirname(i),u=(Object.keys||function(e){var t=[];for(var n in e)t.push(n);return t})(e.modules);for(var a=0;a<u.length;a++){var f=u[a];if(f.slice(0,o.length+1)===o+"/"){var l=f.slice(o.length);e.modules[n+l]=e.modules[o+l]}else f===o&&(e.modules[n]=e.modules[o])}},function(){var t={},n=typeof window!="undefined"?window:{},r=!1;e.define=function(i,s){!r&&e.modules.__browserify_process&&(t=e.modules.__browserify_process(),r=!0);var o=e._core[i]?"":e.modules.path().dirname(i),u=function(t){var n=e(t,o),r=e.cache[e.resolve(t,o)];return r&&r.parent===null&&(r.parent=a),n};u.resolve=function(t){return e.resolve(t,o)},u.modules=e.modules,u.define=e.define,u.cache=e.cache;var a={id:i,filename:i,exports:{},loaded:!1,parent:null};e.modules[i]=function(){return e.cache[i]=a,s.call(a.exports,u,a,a.exports,o,i,t,n),a.loaded=!0,a.exports}}}(),e.define("path",function(e,t,n,r,i,s,o){function u(e,t){var n=[];for(var r=0;r<e.length;r++)t(e[r],r,e)&&n.push(e[r]);return n}function a(e,t){var n=0;for(var r=e.length;r>=0;r--){var i=e[r];i=="."?e.splice(r,1):i===".."?(e.splice(r,1),n++):n&&(e.splice(r,1),n--)}if(t)for(;n--;n)e.unshift("..");return e}var f=/^(.+\/(?!$)|\/)?((?:.+?)?(\.[^.]*)?)$/;n.resolve=function(){var e="",t=!1;for(var n=arguments.length;n>=-1&&!t;n--){var r=n>=0?arguments[n]:s.cwd();if(typeof r!="string"||!r)continue;e=r+"/"+e,t=r.charAt(0)==="/"}return e=a(u(e.split("/"),function(e){return!!e}),!t).join("/"),(t?"/":"")+e||"."},n.normalize=function(e){var t=e.charAt(0)==="/",n=e.slice(-1)==="/";return e=a(u(e.split("/"),function(e){return!!e}),!t).join("/"),!e&&!t&&(e="."),e&&n&&(e+="/"),(t?"/":"")+e},n.join=function(){var e=Array.prototype.slice.call(arguments,0);return n.normalize(u(e,function(e,t){return e&&typeof e=="string"}).join("/"))},n.dirname=function(e){var t=f.exec(e)[1]||"",n=!1;return t?t.length===1||n&&t.length<=3&&t.charAt(1)===":"?t:t.substring(0,t.length-1):"."},n.basename=function(e,t){var n=f.exec(e)[2]||"";return t&&n.substr(-1*t.length)===t&&(n=n.substr(0,n.length-t.length)),n},n.extname=function(e){return f.exec(e)[3]||""}}),e.define("__browserify_process",function(e,t,n,r,i,s,o){var s=t.exports={};s.nextTick=function(){var e=typeof window!="undefined"&&window.setImmediate,t=typeof window!="undefined"&&window.postMessage&&window.addEventListener;if(e)return window.setImmediate;if(t){var n=[];return window.addEventListener("message",function(e){if(e.source===window&&e.data==="browserify-tick"){e.stopPropagation();if(n.length>0){var t=n.shift();t()}}},!0),function(t){n.push(t),window.postMessage("browserify-tick","*")}}return function(t){setTimeout(t,0)}}(),s.title="browser",s.browser=!0,s.env={},s.argv=[],s.binding=function(t){if(t==="evals")return e("vm");throw new Error("No such module. (Possibly not yet loaded)")},function(){var t="/",n;s.cwd=function(){return t},s.chdir=function(r){n||(n=e("path")),t=n.resolve(r,t)}}()}),e.define("/ArrayList.js",function(e,t,n,r,i,s,o){function h(){this.array=[],arguments[0]instanceof u&&this.addAll(arguments[0])}var u=e("./Collection"),a=e("./List"),f=e("./IndexOutOfBoundsException"),l=e("./NoSuchElementException"),c=e("./OperationNotSupported");h.prototype=new a,h.prototype.array=null,h.prototype.add=function(e){return this.array.push(e),!0},h.prototype.addAll=function(e){for(var t=e.iterator();t.hasNext();)this.add(t.next());return!0},h.prototype.set=function(e,t){var n=this.array[e];return this.array[e]=t,n},h.prototype.iterator=function(){return new h.Iterator(this)},h.prototype.get=function(e){if(e<0||e>=this.size())throw new f;return this.array[e]},h.prototype.isEmpty=function(){return this.array.length===0},h.prototype.size=function(){return this.array.length},h.prototype.toArray=function(){var e=[];for(var t=0,n=this.array.length;t<n;t++)e.push(this.array[t]);return e},h.prototype.remove=function(e){var t=!1;for(var n=0,r=this.array.length;n<r;n++)if(this.array[n]===e){this.array.splice(n,1),t=!0;break}return t},h.Iterator=function(e){this.arrayList=e},h.Iterator.prototype.arrayList=null,h.Iterator.prototype.position=0,h.Iterator.prototype.next=function(){if(this.position===this.arrayList.size())throw new l;return this.arrayList.get(this.position++)},h.Iterator.prototype.hasNext=function(){return this.position<this.arrayList.size()?!0:!1},h.Iterator.prototype.remove=function(){throw new c},t.exports=h}),e.define("/Collection.js",function(e,t,n,r,i,s,o){function a(){}var u=e("./Iterator");a.prototype.add=function(e){},a.prototype.addAll=function(e){},a.prototype.isEmpty=function(){},a.prototype.iterator=function(){},a.prototype.size=function(){},a.prototype.toArray=function(){},a.prototype.remove=function(e){},t.exports=a}),e.define("/Iterator.js",function(e,t,n,r,i,s,o){function u(){}u.prototype.hasNext=function(){},u.prototype.next=function(){},u.prototype.remove=function(){},t.exports=u}),e.define("/List.js",function(e,t,n,r,i,s,o){function a(){}var u=e("./Collection");a.prototype=new u,a.prototype.get=function(e){},a.prototype.set=function(e,t){},a.prototype.isEmpty=function(){},t.exports=a}),e.define("/IndexOutOfBoundsException.js",function(e,t,n,r,i,s,o){function u(e){this.message=e||""}u.prototype=new Error,u.prototype.name="IndexOutOfBoundsException",t.exports=u}),e.define("/NoSuchElementException.js",function(e,t,n,r,i,s,o){function u(e){this.message=e||""}u.prototype=new Error,u.prototype.name="NoSuchElementException",t.exports=u}),e.define("/OperationNotSupported.js",function(e,t,n,r,i,s,o){function u(e){this.message=e||""}u.prototype=new Error,u.prototype.name="OperationNotSupported",t.exports=u}),e.define("/Arrays.js",function(e,t,n,r,i,s,o){function u(){}u.sort=function(){var e=arguments[0],t,n,r,i;if(arguments.length===1){e.sort();return}if(arguments.length===2)r=arguments[1],i=function(e,t){return r.compare(e,t)},e.sort(i);else{if(arguments.length===3){n=e.slice(arguments[1],arguments[2]),n.sort();var s=e.slice(0,arguments[1]).concat(n,e.slice(arguments[2],e.length));e.splice(0,e.length);for(t=0;t<s.length;t++)e.push(s[t]);return}if(arguments.length===4){n=e.slice(arguments[1],arguments[2]),r=arguments[3],i=function(e,t){return r.compare(e,t)},n.sort(i),s=e.slice(0,arguments[1]).concat(n,e.slice(arguments[2],e.length)),e.splice(0,e.length);for(t=0;t<s.length;t++)e.push(s[t]);return}}},u.asList=function(e){var t=new javascript.util.ArrayList;for(var n=0,r=e.length;n<r;n++)t.add(e[n]);return t},t.exports=u}),e.define("/EmptyStackException.js",function(e,t,n,r,i,s,o){function u(e){this.message=e||""}u.prototype=new Error,u.prototype.name="EmptyStackException",t.exports=u}),e.define("/HashMap.js",function(e,t,n,r,i,s,o){function f(){this.object={}}var u=e("./Map"),a=e("./ArrayList");f.prototype=new u,f.prototype.object=null,f.prototype.get=function(e){return this.object[e]||null},f.prototype.put=function(e,t){return this.object[e]=t,t},f.prototype.values=function(){var e=new javascript.util.ArrayList;for(var t in this.object)this.object.hasOwnProperty(t)&&e.add(this.object[t]);return e},f.prototype.size=function(){return this.values().size()},t.exports=f}),e.define("/Map.js",function(e,t,n,r,i,s,o){function u(){}u.prototype.get=function(e){},u.prototype.put=function(e,t){},u.prototype.size=function(){},u.prototype.values=function(){},t.exports=u}),e.define("/Set.js",function(e,t,n,r,i,s,o){function a(){}var u=e("./Collection");a.prototype=new u,a.prototype.contains=function(e){},t.exports=a}),e.define("/HashSet.js",function(e,t,n,r,i,s,o){function c(){this.array=[],arguments[0]instanceof u&&this.addAll(arguments[0])}var u=e("./Collection"),a=e("./Set"),f=e("./OperationNotSupported"),l=e("./NoSuchElementException");c.prototype=new a,c.prototype.array=null,c.prototype.contains=function(e){for(var t=0,n=this.array.length;t<n;t++){var r=this.array[t];if(r===e)return!0}return!1},c.prototype.add=function(e){return this.contains(e)?!1:(this.array.push(e),!0)},c.prototype.addAll=function(e){for(var t=e.iterator();t.hasNext();)this.add(t.next());return!0},c.prototype.remove=function(e){throw new f},c.prototype.size=function(){return this.array.length},c.prototype.isEmpty=function(){return this.array.length===0},c.prototype.toArray=function(){var e=[];for(var t=0,n=this.array.length;t<n;t++)e.push(this.array[t]);return e},c.prototype.iterator=function(){return new c.Iterator(this)},c.Iterator=function(e){this.hashSet=e},c.Iterator.prototype.hashSet=null,c.Iterator.prototype.position=0,c.Iterator.prototype.next=function(){if(this.position===this.hashSet.size())throw new l;return this.hashSet.array[this.position++]},c.Iterator.prototype.hasNext=function(){return this.position<this.hashSet.size()?!0:!1},c.Iterator.prototype.remove=function(){throw new javascript.util.OperationNotSupported},t.exports=c}),e.define("/SortedMap.js",function(e,t,n,r,i,s,o){function a(){}var u=e("./Map");a.prototype=new u,t.exports=a}),e.define("/SortedSet.js",function(e,t,n,r,i,s,o){function a(){}var u=e("./Set");a.prototype=new u,t.exports=a}),e.define("/Stack.js",function(e,t,n,r,i,s,o){function f(){this.array=[]}var u=e("./List"),a=e("./EmptyStackException");f.prototype=new u,f.prototype.array=null,f.prototype.push=function(e){return this.array.push(e),e},f.prototype.pop=function(e){if(this.array.length===0)throw new a;return this.array.pop()},f.prototype.peek=function(){if(this.array.length===0)throw new a;return this.array[this.array.length-1]},f.prototype.empty=function(e){return this.array.length===0?!0:!1},f.prototype.isEmpty=function(){return this.empty()},f.prototype.search=function(e){return this.array.indexOf(e)},f.prototype.size=function(){return this.array.length},f.prototype.toArray=function(){var e=[];for(var t=0,n=this.array.length;t<n;t++)e.push(this.array[t]);return e},t.exports=f}),e.define("/TreeMap.js",function(e,t,n,r,i,s,o){function l(){this.array=[]}var u=e("./Map"),a=e("./SortedMap"),f=e("./ArrayList");l.prototype=new u,l.prototype.array=null,l.prototype.get=function(e){for(var t=0,n=this.array.length;t<n;t++){var r=this.array[t];if(r.key.compareTo(e)===0)return r.value}return null},l.prototype.put=function(e,t){var n=this.get(e);if(n){var r=n.value;return n.value=t,r}var i={key:e,value:t};for(var s=0,o=this.array.length;s<o;s++){n=this.array[s];if(n.key.compareTo(e)===1)return this.array.splice(s,0,i),null}return this.array.push({key:e,value:t}),null},l.prototype.values=function(){var e=new javascript.util.ArrayList;for(var t=0,n=this.array.length;t<n;t++)e.add(this.array[t].value);return e},l.prototype.size=function(){return this.values().size()},t.exports=l}),e.define("/TreeSet.js",function(e,t,n,r,i,s,o){function c(){this.array=[],arguments[0]instanceof u&&this.addAll(arguments[0])}var u=e("./Collection"),a=e("./SortedSet"),f=e("./OperationNotSupported"),l=e("./NoSuchElementException");c.prototype=new a,c.prototype.array=null,c.prototype.contains=function(e){for(var t=0,n=this.array.length;t<n;t++){var r=this.array[t];if(r.compareTo(e)===0)return!0}return!1},c.prototype.add=function(e){if(this.contains(e))return!1;for(var t=0,n=this.array.length;t<n;t++){var r=this.array[t];if(r.compareTo(e)===1)return this.array.splice(t,0,e),!0}return this.array.push(e),!0},c.prototype.addAll=function(e){for(var t=e.iterator();t.hasNext();)this.add(t.next());return!0},c.prototype.remove=function(e){throw new f},c.prototype.size=function(){return this.array.length},c.prototype.isEmpty=function(){return this.array.length===0},c.prototype.toArray=function(){var e=[];for(var t=0,n=this.array.length;t<n;t++)e.push(this.array[t]);return e},c.prototype.iterator=function(){return new c.Iterator(this)},c.Iterator=function(e){this.treeSet=e},c.Iterator.prototype.treeSet=null,c.Iterator.prototype.position=0,c.Iterator.prototype.next=function(){if(this.position===this.treeSet.size())throw new l;return this.treeSet.array[this.position++]},c.Iterator.prototype.hasNext=function(){return this.position<this.treeSet.size()?!0:!1},c.Iterator.prototype.remove=function(){throw new javascript.util.OperationNotSupported},t.exports=c}),e.define("/javascript.util.js",function(e,t,n,r,i,s,o){var u={};u.util={},u.util.version="0.10.0",u.util.ArrayList=e("./ArrayList"),u.util.Arrays=e("./Arrays"),u.util.Collection=e("./Collection"),u.util.EmptyStackException=e("./EmptyStackException"),u.util.HashMap=e("./HashMap"),u.util.IndexOutOfBoundsException=e("./IndexOutOfBoundsException"),u.util.Iterator=e("./Iterator"),u.util.List=e("./List"),u.util.Map=e("./Map"),u.util.NoSuchElementException=e("./NoSuchElementException"),u.util.OperationNotSupported=e("./OperationNotSupported"),u.util.Set=e("./Set"),u.util.HashSet=e("./HashSet"),u.util.SortedMap=e("./SortedMap"),u.util.SortedSet=e("./SortedSet"),u.util.Stack=e("./Stack"),u.util.TreeMap=e("./TreeMap"),u.util.TreeSet=e("./TreeSet"),this.javascript=u;var a;typeof window!="undefined"?a=window:a=o,a.javascript=u}),e("/javascript.util.js")})();

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */
/** @namespace */
jsts = {
  version: '0.13.4',
  /** @namespace */
  algorithm: {
    /** @namespace */
    distance: {},
    /** @namespace */
    locate: {}
  },
  /** @namespace */
  error: {},
  /** @namespace */
  geom: {
    /** @namespace */
    util: {}
  },
  /** @namespace */
  geomgraph: {
    /** @namespace */
    index: {}
  },
  /** @namespace */
  index: {
    /** @namespace */
    bintree: {},
    /** @namespace */
    chain: {},
    /** @namespace */
    kdtree: {},
    /** @namespace */
    quadtree: {},
    /** @namespace */
    strtree: {}
  },
  /** @namespace */
  io: {},
  /** @namespace */
  noding: {
    /** @namespace */
    snapround: {}
  },
  /** @namespace */
  operation: {
    /** @namespace */
    buffer: {},
    /** @namespace */
    distance: {},
    /** @namespace */
    overlay: {
      /** @namespace */
      snap: {}
    },
    /** @namespace */
    polygonize: {},
    /** @namespace */
    relate: {},
    /** @namespace */
    union: {},
    /** @namespace */
    valid: {}
  },
  /** @namespace */
  planargraph: {},
  /** @namespace */
  simplify: {},
  /** @namespace */
  triangulate: {
    /** @namespace */
    quadedge: {}
  },
  /** @namespace */
  util: {}
};

/**
 * Implement String.trim if native support is missing.
 */
if(typeof String.prototype.trim !== 'function') {
  String.prototype.trim = function() {
    return this.replace(/^\s+|\s+$/g, ''); 
  };
}

/**
 * Global function intended for use as a generic abstract method.
 * @private
 */
jsts.abstractFunc = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};

jsts.error = {};



/**
 * @constructor
 */
jsts.error.IllegalArgumentError = function(message) {
  this.name = 'IllegalArgumentError';
  this.message = message;
};
jsts.error.IllegalArgumentError.prototype = new Error();



/**
 * @constructor
 */
jsts.error.TopologyError = function(message, pt) {
  this.name = 'TopologyError';
  this.message = pt ? message + ' [ ' + pt + ' ]' : message;
};
jsts.error.TopologyError.prototype = new Error();



/**
 * @constructor
 */
jsts.error.AbstractMethodInvocationError = function() {
  this.name = 'AbstractMethodInvocationError';
  this.message = 'Abstract method called, should be implemented in subclass.';
};
jsts.error.AbstractMethodInvocationError.prototype = new Error();



/**
 * @constructor
 */
jsts.error.NotImplementedError = function() {
  this.name = 'NotImplementedError';
  this.message = 'This method has not yet been implemented.';
};
jsts.error.NotImplementedError.prototype = new Error();



/**
 * @constructor
 */
jsts.error.NotRepresentableError = function(message) {
  this.name = 'NotRepresentableError';
  this.message = message;
};
jsts.error.NotRepresentableError.prototype = new Error();



/**
 * @constructor message
 */
jsts.error.LocateFailureError = function(message) {
  this.name = 'LocateFailureError';
  this.message = message;
};
jsts.error.LocateFailureError.prototype = new Error();

if (typeof module !== "undefined") module.exports = jsts;


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 *
 * This file incorporates work covered by the following copyright and
 * permission notice:
 *
 * Copyright (c) 2006-2011 by OpenLayers Contributors (see authors.txt for
 * full list of contributors). Published under the Clear BSD license.
 * See http://svn.openlayers.org/trunk/openlayers/license.txt for the
 * full text of the license.
 */

/**
 * Class for reading and writing Well-Known Text.
 *
 * NOTE: Adapted from OpenLayers 2.11 implementation.
 */

/**
 * Create a new parser for WKT
 *
 * @param {}
 *          geometryFactory
 * @return An instance of WKTParser.
 */
jsts.io.WKTParser = function(geometryFactory) {
  this.geometryFactory = geometryFactory || new jsts.geom.GeometryFactory();

  this.regExes = {
    'typeStr': /^\s*(\w+)\s*\(\s*(.*)\s*\)\s*$/,
    'emptyTypeStr': /^\s*(\w+)\s*EMPTY\s*$/,
    'spaces': /\s+/,
    'parenComma': /\)\s*,\s*\(/,
    'doubleParenComma': /\)\s*\)\s*,\s*\(\s*\(/, // can't use {2} here
    'trimParens': /^\s*\(?(.*?)\)?\s*$/
  };
};


/**
 * Deserialize a WKT string and return a geometry. Supports WKT for POINT,
 * MULTIPOINT, LINESTRING, LINEARRING, MULTILINESTRING, POLYGON, MULTIPOLYGON,
 * and GEOMETRYCOLLECTION.
 *
 * @param {String}
 *          wkt A WKT string.
 * @return {jsts.geom.Geometry} A geometry instance.
 */
jsts.io.WKTParser.prototype.read = function(wkt) {
  var geometry, type, str;
  wkt = wkt.replace(/[\n\r]/g, ' ');
  var matches = this.regExes.typeStr.exec(wkt);
  if (wkt.search('EMPTY') !== -1) {
    matches = this.regExes.emptyTypeStr.exec(wkt);
    matches[2] = undefined;
  }
  if (matches) {
    type = matches[1].toLowerCase();
    str = matches[2];
    if (this.parse[type]) {
      geometry = this.parse[type].apply(this, [str]);
    }
  }

  if (geometry === undefined)
    throw new Error('Could not parse WKT ' + wkt);

  return geometry;
};

/**
 * Serialize a geometry into a WKT string.
 *
 * @param {jsts.geom.Geometry}
 *          geometry A feature or array of features.
 * @return {String} The WKT string representation of the input geometries.
 */
jsts.io.WKTParser.prototype.write = function(geometry) {
  return this.extractGeometry(geometry);
};

/**
 * Entry point to construct the WKT for a single Geometry object.
 *
 * @param {jsts.geom.Geometry}
 *          geometry
 *
 * @return {String} A WKT string of representing the geometry.
 */
jsts.io.WKTParser.prototype.extractGeometry = function(geometry) {
  var type = geometry.CLASS_NAME.split('.')[2].toLowerCase();
  if (!this.extract[type]) {
    return null;
  }
  var wktType = type.toUpperCase();
  var data;
  if (geometry.isEmpty()) {
    data = wktType + ' EMPTY';
  } else {
    data = wktType + '(' + this.extract[type].apply(this, [geometry]) + ')';
  }
  return data;
};

/**
 * Object with properties corresponding to the geometry types. Property values
 * are functions that do the actual data extraction.
 */
jsts.io.WKTParser.prototype.extract = {
  'coordinate': function(coordinate) {
    return coordinate.x + ' ' + coordinate.y;
  },

  /**
   * Return a space delimited string of point coordinates.
   *
   * @param {jsts.geom.Point}
   *          point
   * @return {String} A string of coordinates representing the point.
   */
  'point': function(point) {
    return point.coordinate.x + ' ' + point.coordinate.y;
  },

  /**
   * Return a comma delimited string of point coordinates from a multipoint.
   *
   * @param {jsts.geom.MultiPoint>}
   *          multipoint
   * @return {String} A string of point coordinate strings representing the
   *         multipoint.
   */
  'multipoint': function(multipoint) {
    var array = [];
    for ( var i = 0, len = multipoint.geometries.length; i < len; ++i) {
      array.push('(' +
          this.extract.point.apply(this, [multipoint.geometries[i]]) + ')');
    }
    return array.join(',');
  },

  /**
   * Return a comma delimited string of point coordinates from a line.
   *
   * @param {jsts.geom.LineString>}
   *          linestring
   * @return {String} A string of point coordinate strings representing the
   *         linestring.
   */
  'linestring': function(linestring) {
    var array = [];
    for ( var i = 0, len = linestring.points.length; i < len; ++i) {
      array.push(this.extract.coordinate.apply(this, [linestring.points[i]]));
    }
    return array.join(',');
  },

  /**
   * Return a comma delimited string of linestring strings from a
   * multilinestring.
   *
   * @param {jsts.geom.MultiLineString>}
   *          multilinestring
   * @return {String} A string of of linestring strings representing the
   *         multilinestring.
   */
  'multilinestring': function(multilinestring) {
    var array = [];
    for ( var i = 0, len = multilinestring.geometries.length; i < len; ++i) {
      array.push('(' +
          this.extract.linestring.apply(this, [multilinestring.geometries[i]]) +
          ')');
    }
    return array.join(',');
  },

  /**
   * Return a comma delimited string of linear ring arrays from a polygon.
   *
   * @param {jsts.geom.Polygon>}
   *          polygon
   * @return {String} An array of linear ring arrays representing the polygon.
   */
  'polygon': function(polygon) {
    var array = [];
    array.push('(' + this.extract.linestring.apply(this, [polygon.shell]) + ')');
    for ( var i = 0, len = polygon.holes.length; i < len; ++i) {
      array.push('(' + this.extract.linestring.apply(this, [polygon.holes[i]]) + ')');
    }
    return array.join(',');
  },

  /**
   * Return an array of polygon arrays from a multipolygon.
   *
   * @param {jsts.geom.MultiPolygon>}
   *          multipolygon
   * @return {String} An array of polygon arrays representing the multipolygon.
   */
  'multipolygon': function(multipolygon) {
    var array = [];
    for ( var i = 0, len = multipolygon.geometries.length; i < len; ++i) {
      array.push('(' + this.extract.polygon.apply(this, [multipolygon.geometries[i]]) + ')');
    }
    return array.join(',');
  },

  /**
   * Return the WKT portion between 'GEOMETRYCOLLECTION(' and ')' for an
   * geometrycollection.
   *
   * @param {jsts.geom.GeometryCollection>}
   *          collection
   * @return {String} internal WKT representation of the collection.
   */
  'geometrycollection': function(collection) {
    var array = [];
    for ( var i = 0, len = collection.geometries.length; i < len; ++i) {
      array.push(this.extractGeometry.apply(this, [collection.geometries[i]]));
    }
    return array.join(',');
  }

};

/**
 * Object with properties corresponding to the geometry types. Property values
 * are functions that do the actual parsing.
 */
jsts.io.WKTParser.prototype.parse = {
  /**
   * Return point geometry given a point WKT fragment.
   *
   * @param {String}
   *          str A WKT fragment representing the point.
   * @return {jsts.geom.Point} A point geometry.
   * @private
   */
  'point': function(str) {
    if (str === undefined) {
      return this.geometryFactory.createPoint(null);
    }

    var coords = str.trim().split(this.regExes.spaces);
    return this.geometryFactory.createPoint(new jsts.geom.Coordinate(coords[0],
        coords[1]));
  },

  /**
   * Return a multipoint geometry given a multipoint WKT fragment.
   *
   * @param {String}
   *          A WKT fragment representing the multipoint.
   * @return {jsts.geom.Point} A multipoint feature.
   * @private
   */
  'multipoint': function(str) {
    if (str === undefined) {
      return this.geometryFactory.createMultiPoint(null);
    }

    var point;
    var points = str.trim().split(',');
    var components = [];
    for ( var i = 0, len = points.length; i < len; ++i) {
      point = points[i].replace(this.regExes.trimParens, '$1');
      components.push(this.parse.point.apply(this, [point]));
    }
    return this.geometryFactory.createMultiPoint(components);
  },

  /**
   * Return a linestring geometry given a linestring WKT fragment.
   *
   * @param {String}
   *          A WKT fragment representing the linestring.
   * @return {jsts.geom.LineString} A linestring geometry.
   * @private
   */
  'linestring': function(str) {
    if (str === undefined) {
      return this.geometryFactory.createLineString(null);
    }

    var points = str.trim().split(',');
    var components = [];
    var coords;
    for ( var i = 0, len = points.length; i < len; ++i) {
      coords = points[i].trim().split(this.regExes.spaces);
      components.push(new jsts.geom.Coordinate(coords[0], coords[1]));
    }
    return this.geometryFactory.createLineString(components);
  },

  /**
   * Return a linearring geometry given a linearring WKT fragment.
   *
   * @param {String}
   *          A WKT fragment representing the linearring.
   * @return {jsts.geom.LinearRing} A linearring geometry.
   * @private
   */
  'linearring': function(str) {
    if (str === undefined) {
      return this.geometryFactory.createLinearRing(null);
    }

    var points = str.trim().split(',');
    var components = [];
    var coords;
    for ( var i = 0, len = points.length; i < len; ++i) {
      coords = points[i].trim().split(this.regExes.spaces);
      components.push(new jsts.geom.Coordinate(coords[0], coords[1]));
    }
    return this.geometryFactory.createLinearRing(components);
  },

  /**
   * Return a multilinestring geometry given a multilinestring WKT fragment.
   *
   * @param {String}
   *          A WKT fragment representing the multilinestring.
   * @return {jsts.geom.MultiLineString} A multilinestring geometry.
   * @private
   */
  'multilinestring': function(str) {
    if (str === undefined) {
      return this.geometryFactory.createMultiLineString(null);
    }

    var line;
    var lines = str.trim().split(this.regExes.parenComma);
    var components = [];
    for ( var i = 0, len = lines.length; i < len; ++i) {
      line = lines[i].replace(this.regExes.trimParens, '$1');
      components.push(this.parse.linestring.apply(this, [line]));
    }
    return this.geometryFactory.createMultiLineString(components);
  },

  /**
   * Return a polygon geometry given a polygon WKT fragment.
   *
   * @param {String}
   *          A WKT fragment representing the polygon.
   * @return {jsts.geom.Polygon} A polygon geometry.
   * @private
   */
  'polygon': function(str) {
    if (str === undefined) {
      return this.geometryFactory.createPolygon(null);
    }

    var ring, linestring, linearring;
    var rings = str.trim().split(this.regExes.parenComma);
    var shell;
    var holes = [];
    for ( var i = 0, len = rings.length; i < len; ++i) {
      ring = rings[i].replace(this.regExes.trimParens, '$1');
      linestring = this.parse.linestring.apply(this, [ring]);
      linearring = this.geometryFactory.createLinearRing(linestring.points);
      if (i === 0) {
        shell = linearring;
      } else {
        holes.push(linearring);
      }

    }
    return this.geometryFactory.createPolygon(shell, holes);
  },

  /**
   * Return a multipolygon geometry given a multipolygon WKT fragment.
   *
   * @param {String}
   *          A WKT fragment representing the multipolygon.
   * @return {jsts.geom.MultiPolygon} A multipolygon geometry.
   * @private
   */
  'multipolygon': function(str) {
    if (str === undefined) {
      return this.geometryFactory.createMultiPolygon(null);
    }

    var polygon;
    var polygons = str.trim().split(this.regExes.doubleParenComma);
    var components = [];
    for ( var i = 0, len = polygons.length; i < len; ++i) {
      polygon = polygons[i].replace(this.regExes.trimParens, '$1');
      components.push(this.parse.polygon.apply(this, [polygon]));
    }
    return this.geometryFactory.createMultiPolygon(components);
  },

  /**
   * Return a geometrycollection given a geometrycollection WKT fragment.
   *
   * @param {String}
   *          A WKT fragment representing the geometrycollection.
   * @return {jsts.geom.GeometryCollection}
   * @private
   */
  'geometrycollection': function(str) {
    if (str === undefined) {
      return this.geometryFactory.createGeometryCollection(null);
    }

    // separate components of the collection with |
    str = str.replace(/,\s*([A-Za-z])/g, '|$1');
    var wktArray = str.trim().split('|');
    var components = [];
    for ( var i = 0, len = wktArray.length; i < len; ++i) {
      components.push(jsts.io.WKTParser.prototype.read.apply(this,
          [wktArray[i]]));
    }
    return this.geometryFactory.createGeometryCollection(components);
  }

};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Writes the Well-Known Text representation of a {@link Geometry}. The
 * Well-Known Text format is defined in the <A
 * HREF="http://www.opengis.org/techno/specs.htm"> OGC Simple Features
 * Specification for SQL</A>.
 * <p>
 * The <code>WKTWriter</code> outputs coordinates rounded to the precision
 * model. Only the maximum number of decimal places necessary to represent the
 * ordinates to the required precision will be output.
 * <p>
 * The SFS WKT spec does not define a special tag for {@link LinearRing}s.
 * Under the spec, rings are output as <code>LINESTRING</code>s.
 *
 * @see WKTReader
 * @constructor
 */
jsts.io.WKTWriter = function() {
  this.parser = new jsts.io.WKTParser(this.geometryFactory);
};


/**
 * Converts a <code>Geometry</code> to its Well-known Text representation.
 *
 * @param {jsts.geom.Geometry}
 *          geometry a <code>Geometry</code> to process.
 * @return {string} a <Geometry Tagged Text> string (see the OpenGIS Simple
 *         Features Specification).
 */
jsts.io.WKTWriter.prototype.write = function(geometry) {
  var wkt = this.parser.write(geometry);

  return wkt;
};

/**
 * Generates the WKT for a <tt>LINESTRING</tt> specified by two
 * {@link Coordinate}s.
 *
 * @param p0
 *          the first coordinate.
 * @param p1
 *          the second coordinate.
 *
 * @return the WKT.
 */
jsts.io.WKTWriter.toLineString = function(p0, p1) {
  if (arguments.length !== 2) {
    throw new jsts.error.NotImplementedError();
  }

  return 'LINESTRING ( ' + p0.x + ' ' + p0.y + ', ' + p1.x + ' ' + p1.y + ' )';
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * A LineIntersector is an algorithm that can both test whether two line
 * segments intersect and compute the intersection point if they do. The
 * intersection point may be computed in a precise or non-precise manner.
 * Computing it precisely involves rounding it to an integer. (This assumes that
 * the input coordinates have been made precise by scaling them to an integer
 * grid.)
 *
 * @constructor
 */
jsts.algorithm.LineIntersector = function() {
  this.inputLines = [[], []];
  this.intPt = [null, null];
  // alias the intersection points for ease of reference
  this.pa = this.intPt[0];
  this.pb = this.intPt[1];
  this.result = jsts.algorithm.LineIntersector.NO_INTERSECTION;
};


/**
 * Indicates that line segments do not intersect
 *
 * @type {int}
 */
jsts.algorithm.LineIntersector.NO_INTERSECTION = 0;


/**
 * Indicates that line segments intersect in a single point
 *
 * @type {int}
 */
jsts.algorithm.LineIntersector.POINT_INTERSECTION = 1;


/**
 * Indicates that line segments intersect in a line segment
 *
 * @type {int}
 */
jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION = 2;


/**
 * Force computed intersection to be rounded to a given precision model. No
 * getter is provided, because the precision model is not required to be
 * specified.
 *
 * @param precisionModel
 */
jsts.algorithm.LineIntersector.prototype.setPrecisionModel = function(
    precisionModel) {
  this.precisionModel = precisionModel;
};


/**
 * Gets an endpoint of an input segment.
 *
 * @param segmentIndex
 *          the index of the input segment (0 or 1).
 * @param ptIndex
 *          the index of the endpoint (0 or 1).
 * @return the specified endpoint.
 */
jsts.algorithm.LineIntersector.prototype.getEndpoint = function(segmentIndex,
    ptIndex) {
  return this.inputLines[segmentIndex][ptIndex];
};


/**
 * Computes the "edge distance" of an intersection point p along a segment. The
 * edge distance is a metric of the point along the edge. The metric used is a
 * robust and easy to compute metric function. It is <b>not</b> equivalent to
 * the usual Euclidean metric. It relies on the fact that either the x or the y
 * ordinates of the points in the edge are unique, depending on whether the edge
 * is longer in the horizontal or vertical direction.
 * <p>
 * NOTE: This function may produce incorrect distances for inputs where p is not
 * precisely on p1-p2 (E.g. p = (139,9) p1 = (139,10), p2 = (280,1) produces
 * distanct 0.0, which is incorrect.
 * <p>
 * My hypothesis is that the function is safe to use for points which are the
 * result of <b>rounding</b> points which lie on the line, but not safe to use
 * for <b>truncated</b> points.
 *
 * @param {Coordinate}
 *          p
 * @param {Coordinate}
 *          p0
 * @param {Coordinate}
 *          p1
 * @return {double}
 */
jsts.algorithm.LineIntersector.computeEdgeDistance = function(p, p0, p1) {
  var dx = Math.abs(p1.x - p0.x);
  var dy = Math.abs(p1.y - p0.y);

  var dist = -1.0; // sentinel value
  if (p.equals(p0)) {
    dist = 0.0;
  } else if (p.equals(p1)) {
    if (dx > dy) {
      dist = dx;
    } else {
      dist = dy;
    }
  } else {
    var pdx = Math.abs(p.x - p0.x);
    var pdy = Math.abs(p.y - p0.y);
    if (dx > dy) {
      dist = pdx;
    } else {
      dist = pdy;
    }
    // <FIX>
    // hack to ensure that non-endpoints always have a non-zero distance
    if (dist === 0.0 && !p.equals(p0)) {
      dist = Math.max(pdx, pdy);
    }
  }
  if (dist === 0.0 && !p.equals(p0)) {
    throw new jsts.error.IllegalArgumentError('Bad distance calculation');
  }
  return dist;
};


/**
 * This function is non-robust, since it may compute the square of large
 * numbers. Currently not sure how to improve this.
 *
 * @param {Coordinate}
 *          p
 * @param {Coordinate}
 *          p0
 * @param {Coordinate}
 *          p1
 * @return {double}
 */
jsts.algorithm.LineIntersector.nonRobustComputeEdgeDistance = function(p, p1,
    p2) {
  var dx = p.x - p1.x;
  var dy = p.y - p1.y;
  var dist = Math.sqrt(dx * dx + dy * dy); // dummy value
  if (!(dist === 0.0 && !p.equals(p1))) {
    throw new jsts.error.IllegalArgumentError('Invalid distance calculation');
  }
  return dist;
};


/**
 * @protected
 * @type {int}
 */
jsts.algorithm.LineIntersector.prototype.result = null;


/**
 * @protected
 * @type {Coordinate[][] }
 */
jsts.algorithm.LineIntersector.prototype.inputLines = null;


/**
 * @protected
 * @type {Coordinate[]}
 */
jsts.algorithm.LineIntersector.prototype.intPt = null;


/**
 * The indexes of the endpoints of the intersection lines, in order along the
 * corresponding line
 */
/**
 * @protected
 * @type {int[][]}
 */
jsts.algorithm.LineIntersector.prototype.intLineIndex = null;


/**
 * @protected
 * @type {boolean}
 */
jsts.algorithm.LineIntersector.prototype._isProper = null;


/**
 * @protected
 * @type {Coordinate}
 */
jsts.algorithm.LineIntersector.prototype.pa = null;


/**
 * @protected
 * @type {Coordinate}
 */
jsts.algorithm.LineIntersector.prototype.pb = null;


/**
 * @protected
 * @type {PrecisionModel}
 */
jsts.algorithm.LineIntersector.prototype.precisionModel = null;


/**
 * Compute the intersection of a point p and the line p1-p2. This function
 * computes the boolean value of the hasIntersection test. The actual value of
 * the intersection (if there is one) is equal to the value of <code>p</code>.
 *
 * @param {Coordinate}
 *          p
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 */
jsts.algorithm.LineIntersector.prototype.computeIntersection = function(p, p1,
    p2) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * @return {boolean}
 * @protected
 */
jsts.algorithm.LineIntersector.prototype.isCollinear = function() {
  return this.result === jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
};


/**
 * Computes the intersection of the lines p1-p2 and p3-p4. This function
 * computes both the boolean value of the hasIntersection test and the
 * (approximate) value of the intersection point itself (if there is one).
 *
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 * @param {Coordinate}
 *          p3
 * @param {Coordinate}
 *          p4
 */
jsts.algorithm.LineIntersector.prototype.computeIntersection = function(p1, p2,
    p3, p4) {
  this.inputLines[0][0] = p1;
  this.inputLines[0][1] = p2;
  this.inputLines[1][0] = p3;
  this.inputLines[1][1] = p4;
  this.result = this.computeIntersect(p1, p2, p3, p4);
};


/**
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 * @param {Coordinate}
 *          q1
 * @param {Coordinate}
 *          q2
 * @return {int}
 * @protected
 */
jsts.algorithm.LineIntersector.prototype.computeIntersect = function(p1, p2,
    q1, q2) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * @return {boolean}
 * @protected
 */
jsts.algorithm.LineIntersector.prototype.isEndPoint = function() {
  return this.hasIntersection() && !this._isProper;
};


/**
 * Tests whether the input geometries intersect.
 *
 * @return {boolean} true if the input geometries intersect.
 */
jsts.algorithm.LineIntersector.prototype.hasIntersection = function() {
  return this.result !== jsts.algorithm.LineIntersector.NO_INTERSECTION;
};


/**
 * Returns the number of intersection points found. This will be either 0, 1 or
 * 2.
 *
 * @return {int}
 */
jsts.algorithm.LineIntersector.prototype.getIntersectionNum = function() {
  return this.result;
};


/**
 * Returns the intIndex'th intersection point
 *
 * @param {int}
 *          intIndex is 0 or 1.
 *
 * @return {Coordinate} the intIndex'th intersection point.
 */
jsts.algorithm.LineIntersector.prototype.getIntersection = function(intIndex) {
  return this.intPt[intIndex];
};


/**
 * @protected
 */
jsts.algorithm.LineIntersector.prototype.computeIntLineIndex = function() {
  if (this.intLineIndex === null) {
    this.intLineIndex = [[], []];
    this.computeIntLineIndex(0);
    this.computeIntLineIndex(1);
  }
};


/**
 * Test whether a point is a intersection point of two line segments. Note that
 * if the intersection is a line segment, this method only tests for equality
 * with the endpoints of the intersection segment. It does <b>not</b> return
 * true if the input point is internal to the intersection segment.
 *
 * @param {Coordinate}
 *          pt
 * @return {boolean} true if the input point is one of the intersection points.
 */
jsts.algorithm.LineIntersector.prototype.isIntersection = function(pt) {
  var i;
  for (i = 0; i < this.result; i++) {
    if (this.intPt[i].equals2D(pt)) {
      return true;
    }
  }
  return false;
};


/**
 * Tests whether either intersection point is an interior point of one of the
 * input segments.
 *
 * @return {boolean} <code>true</code> if either intersection point is in the
 *         interior of one of the input segments.
 */
jsts.algorithm.LineIntersector.prototype.isInteriorIntersection = function() {
  if (arguments.length === 1) {
    return this.isInteriorIntersection2.apply(this, arguments);
  }

  if (this.isInteriorIntersection(0)) {
    return true;
  }
  if (this.isInteriorIntersection(1)) {
    return true;
  }
  return false;
};


/**
 * Tests whether either intersection point is an interior point of the specified
 * input segment.
 *
 * @param {[]} inputLineIndex
 * @return {boolean} <code>true</code> if either intersection point is in the
 *         interior of the input segment.
 */
jsts.algorithm.LineIntersector.prototype.isInteriorIntersection2 = function(
    inputLineIndex) {
  var i;
  for (i = 0; i < this.result; i++) {
    if (!(this.intPt[i].equals2D(this.inputLines[inputLineIndex][0]) || this.intPt[i]
        .equals2D(this.inputLines[inputLineIndex][1]))) {
      return true;
    }
  }
  return false;
};


/**
 * Tests whether an intersection is proper. <br>
 * The intersection between two line segments is considered proper if they
 * intersect in a single point in the interior of both segments (e.g. the
 * intersection is a single point and is not equal to any of the endpoints).
 * <p>
 * The intersection between a point and a line segment is considered proper if
 * the point lies in the interior of the segment (e.g. is not equal to either of
 * the endpoints).
 *
 * @return {boolean} true if the intersection is proper.
 */
jsts.algorithm.LineIntersector.prototype.isProper = function() {
  return this.hasIntersection() && this._isProper;
};


/**
 * Computes the intIndex'th intersection point in the direction of a specified
 * input line segment
 *
 * @param {int}
 *          segmentIndex is 0 or 1.
 * @param {int}
 *          intIndex is 0 or 1.
 *
 * @return {Coordinate} the intIndex'th intersection point in the direction of
 *         the specified input line segment.
 */
jsts.algorithm.LineIntersector.prototype.getIntersectionAlongSegment = function(
    segmentIndex, intIndex) {
  // lazily compute int line array
  this.computeIntLineIndex();
  return this.intPt[intLineIndex[segmentIndex][intIndex]];
};


/**
 * Computes the index of the intIndex'th intersection point in the direction of
 * a specified input line segment
 *
 * @param {int}
 *          segmentIndex is 0 or 1.
 * @param {int}
 *          intIndex is 0 or 1.
 *
 * @return {int} the index of the intersection point along the segment (0 or 1).
 */
jsts.algorithm.LineIntersector.prototype.getIndexAlongSegment = function(
    segmentIndex, intIndex) {
  this.computeIntLineIndex();
  return this.intLineIndex[segmentIndex][intIndex];
};


/**
 * @param {int}
 *          segmentIndex
 * @protected
 */
jsts.algorithm.LineIntersector.prototype.computeIntLineIndex = function(
    segmentIndex) {
  var dist0 = this.getEdgeDistance(segmentIndex, 0);
  var dist1 = this.getEdgeDistance(segmentIndex, 1);
  if (dist0 > dist1) {
    this.intLineIndex[segmentIndex][0] = 0;
    this.intLineIndex[segmentIndex][1] = 1;
  } else {
    this.intLineIndex[segmentIndex][0] = 1;
    this.intLineIndex[segmentIndex][1] = 0;
  }
};


/**
 * Computes the "edge distance" of an intersection point along the specified
 * input line segment.
 *
 * @param {int}
 *          segmentIndex is 0 or 1.
 * @param {int}
 *          intIndex is 0 or 1.
 *
 * @return {double} the edge distance of the intersection point.
 */
jsts.algorithm.LineIntersector.prototype.getEdgeDistance = function(
    segmentIndex, intIndex) {
  var dist = jsts.algorithm.LineIntersector.computeEdgeDistance(
      this.intPt[intIndex], this.inputLines[segmentIndex][0],
      this.inputLines[segmentIndex][1]);
  return dist;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Represents a homogeneous coordinate in a 2-D coordinate space. In JTS
 * {@link HCoordinate}s are used as a clean way of computing intersections
 * between line segments.
 *
 * Will call correct init* function depending on argument.
 *
 * @constructor
 */
jsts.algorithm.HCoordinate = function() {
  this.x = 0.0;
  this.y = 0.0;
  this.w = 1.0;

  if (arguments.length === 1) {
    this.initFrom1Coordinate(arguments[0]);
  } else if (arguments.length === 2 &&
      arguments[0] instanceof jsts.geom.Coordinate) {
    this.initFrom2Coordinates(arguments[0], arguments[1]);
  } else if (arguments.length === 2 &&
      arguments[0] instanceof jsts.algorithm.HCoordinate) {
    this.initFrom2HCoordinates(arguments[0], arguments[1]);
  } else if (arguments.length === 2) {
    this.initFromXY(arguments[0], arguments[1]);
  } else if (arguments.length === 3) {
    this.initFromXYW(arguments[0], arguments[1], arguments[2]);
  } else if (arguments.length === 4) {
    this.initFromXYW(arguments[0], arguments[1], arguments[2], arguments[3]);
  }
};


/**
 * Computes the (approximate) intersection point between two line segments using
 * homogeneous coordinates.
 * <p>
 * Note that this algorithm is not numerically stable; i.e. it can produce
 * intersection points which lie outside the envelope of the line segments
 * themselves. In order to increase the precision of the calculation input
 * points should be normalized before passing them to this routine.
 *
 * @param {jsts.geom.Coordinate}
 *          p1 first coordinate for the first line.
 * @param {jsts.geom.Coordinate}
 *          p2 second coordinate for the first line.
 * @param {jsts.geom.Coordinate}
 *          q1 first coordinate for the second line.
 * @param {jsts.geom.Coordinate}
 *          q2 second coordinate for the second line.
 * @return {jsts.geom.Coordinate} The coordinate of the intersection.
 */
jsts.algorithm.HCoordinate.intersection = function(p1, p2, q1, q2) {
  var px, py, pw, qx, qy, qw, x, y, w, xInt, yInt;

  // unrolled computation
  px = p1.y - p2.y;
  py = p2.x - p1.x;
  pw = p1.x * p2.y - p2.x * p1.y;

  qx = q1.y - q2.y;
  qy = q2.x - q1.x;
  qw = q1.x * q2.y - q2.x * q1.y;

  x = py * qw - qy * pw;
  y = qx * pw - px * qw;
  w = px * qy - qx * py;

  xInt = x / w;
  yInt = y / w;

  if (!isFinite(xInt) || !isFinite(yInt)) {
    throw new jsts.error.NotRepresentableError();
  }

  return new jsts.geom.Coordinate(xInt, yInt);
};


/**
 * Initializes a new HCoordinate from 1 Coordinate
 *
 * @param {jsts.geom.Coordinate}
 *          p the coordinate.
 */
jsts.algorithm.HCoordinate.prototype.initFrom1Coordinate = function(p) {
  this.x = p.x;
  this.y = p.y;
  this.w = 1.0;
};


/**
 * Constructs a homogeneous coordinate which is the intersection of the lines
 * define by the homogenous coordinates represented by two {@link Coordinate}s.
 *
 * @param {jsts.geom.Coordinate}
 *          p1 the first coordinate.
 * @param {jsts.geom.Coordinate}
 *          p2 the second coordinate.
 */
jsts.algorithm.HCoordinate.prototype.initFrom2Coordinates = function(p1, p2) {
  // optimization when it is known that w = 1
  this.x = p1.y - p2.y;
  this.y = p2.x - p1.x;
  this.w = p1.x * p2.y - p2.x * p1.y;
};


/**
 * Initializes from 2 HCoordinates
 *
 * @param {jsts.algorithm.HCoordinate}
 *          p1 the first HCoordinate.
 * @param {jsts.algorithm.HCoordinate}
 *          p2 the second HCoordinate.
 */
jsts.algorithm.HCoordinate.prototype.initFrom2HCoordinates = function(p1, p2) {
  this.x = p1.y * p2.w - p2.y * p1.w;
  this.y = p2.x * p1.w - p1.x * p2.w;
  this.w = p1.x * p2.y - p2.x * p1.y;
};


/**
 * Initializes from x,y,w
 *
 * @param {Number}
 *          x the x-value.
 * @param {Number}
 *          y the y-value.
 * @param {Number}
 *          w the w-value.
 */
jsts.algorithm.HCoordinate.prototype.initFromXYW = function(x, y, w) {
  this.x = x;
  this.y = y;
  this.w = w;
};


/**
 * Initializes from x,y
 *
 * @param {Number}
 *          x the x-value.
 * @param {Number}
 *          y the y-value.
 */
jsts.algorithm.HCoordinate.prototype.initFromXY = function(x, y) {
  this.x = x;
  this.y = y;
  this.w = 1.0;
};


/**
 * Initializes from 4 Coordinates
 *
 * @param {jsts.geom.Coordinate}
 *          p1 the first coordinate.
 * @param {jsts.geom.Coordinate}
 *          p2 the second coordinate.
 * @param {jsts.geom.Coordinate}
 *          q1 the first coordinate.
 * @param {jsts.geom.Coordinate}
 *          q2 the second coordinate.
 */
jsts.algorithm.HCoordinate.prototype.initFrom4Coordinates = function(p1, p2,
    q1, q2) {
  var px, py, pw, qx, qy, qw;
  // unrolled computation
  px = p1.y - p2.y;
  py = p2.x - p1.x;
  pw = p1.x * p2.y - p2.x * p1.y;

  qx = q1.y - q2.y;
  qy = q2.x - q1.x;
  qw = q1.x * q2.y - q2.x * q1.y;

  this.x = py * qw - qy * pw;
  this.y = qx * pw - px * qw;
  this.w = px * qy - qx * py;
};


/**
 * Gets x/w
 *
 * @return {Number} x/w.
 */
jsts.algorithm.HCoordinate.prototype.getX = function() {
  var a = this.x / this.w;

  if (!isFinite(a)) {
    throw new jsts.error.NotRepresentableError();
  }
  return a;
};


/**
 * Gets y/w
 *
 * @return {Number} y/w.
 */
jsts.algorithm.HCoordinate.prototype.getY = function() {
  var a = this.y / this.w;

  if (!isFinite(a)) {
    throw new jsts.error.NotRepresentableError();
  }
  return a;
};


/**
 * Gets a coordinate represented by this HCoordinate
 *
 * @return {jst.geom.Coordinate} The coordinate.
 */
jsts.algorithm.HCoordinate.prototype.getCoordinate = function() {
  var p = new jsts.geom.Coordinate();
  p.x = this.getX();
  p.y = this.getY();
  return p;
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * @requires jsts/algorithm/LineIntersector.js
 */



/**
 * A robust version of {@LineIntersector}.
 *
 * @constructor
 * @augments jsts.algorithm.LineIntersector
 */
jsts.algorithm.RobustLineIntersector = function() {
  jsts.algorithm.RobustLineIntersector.prototype.constructor.call(this);
};

jsts.algorithm.RobustLineIntersector.prototype = new jsts.algorithm.LineIntersector();


/**
 * @param {Coordinate}
 *          p
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 */
jsts.algorithm.RobustLineIntersector.prototype.computeIntersection = function(
    p, p1, p2) {

  if (arguments.length === 4) {
    jsts.algorithm.LineIntersector.prototype.computeIntersection.apply(this, arguments);
    return;
  }

  this._isProper = false;
  // do between check first, since it is faster than the orientation test
  if (jsts.geom.Envelope.intersects(p1, p2, p)) {
    if ((jsts.algorithm.CGAlgorithms.orientationIndex(p1, p2, p) === 0) &&
        (jsts.algorithm.CGAlgorithms.orientationIndex(p2, p1, p) === 0)) {
      this._isProper = true;
      if (p.equals(p1) || p.equals(p2)) {
        this._isProper = false;
      }
      this.result = jsts.algorithm.LineIntersector.POINT_INTERSECTION;
      return;
    }
  }
  this.result = jsts.algorithm.LineIntersector.NO_INTERSECTION;
};


/**
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 * @param {Coordinate}
 *          q1
 * @param {Coordinate}
 *          q2
 * @return {Number}
 * @protected
 */
jsts.algorithm.RobustLineIntersector.prototype.computeIntersect = function(p1,
    p2, q1, q2) {
  this._isProper = false;

  // first try a fast test to see if the envelopes of the lines intersect
  if (!jsts.geom.Envelope.intersects(p1, p2, q1, q2)) {
    return jsts.algorithm.LineIntersector.NO_INTERSECTION;
  }

  // for each endpoint, compute which side of the other segment it lies
  // if both endpoints lie on the same side of the other segment,
  // the segments do not intersect
  var Pq1 = jsts.algorithm.CGAlgorithms.orientationIndex(p1, p2, q1);
  var Pq2 = jsts.algorithm.CGAlgorithms.orientationIndex(p1, p2, q2);

  if ((Pq1 > 0 && Pq2 > 0) || (Pq1 < 0 && Pq2 < 0)) {
    return jsts.algorithm.LineIntersector.NO_INTERSECTION;
  }

  var Qp1 = jsts.algorithm.CGAlgorithms.orientationIndex(q1, q2, p1);
  var Qp2 = jsts.algorithm.CGAlgorithms.orientationIndex(q1, q2, p2);

  if ((Qp1 > 0 && Qp2 > 0) || (Qp1 < 0 && Qp2 < 0)) {
    return jsts.algorithm.LineIntersector.NO_INTERSECTION;
  }

  var collinear = Pq1 === 0 && Pq2 === 0 && Qp1 === 0 && Qp2 === 0;
  if (collinear) {
    return this.computeCollinearIntersection(p1, p2, q1, q2);
  }

  /**
   * At this point we know that there is a single intersection point (since the
   * lines are not collinear).
   */

  /**
   * Check if the intersection is an endpoint. If it is, copy the endpoint as
   * the intersection point. Copying the point rather than computing it ensures
   * the point has the exact value, which is important for robustness. It is
   * sufficient to simply check for an endpoint which is on the other line,
   * since at this point we know that the inputLines must intersect.
   */
  if (Pq1 === 0 || Pq2 === 0 || Qp1 === 0 || Qp2 === 0) {
    this._isProper = false;

    /**
     * Check for two equal endpoints. This is done explicitly rather than by the
     * orientation tests below in order to improve robustness.
     *
     * [An example where the orientation tests fail to be consistent is the
     * following (where the true intersection is at the shared endpoint POINT
     * (19.850257749638203 46.29709338043669)
     *
     * LINESTRING ( 19.850257749638203 46.29709338043669, 20.31970698357233
     * 46.76654261437082 ) and LINESTRING ( -48.51001596420236
     * -22.063180333403878, 19.850257749638203 46.29709338043669 )
     *
     * which used to produce the INCORRECT result: (20.31970698357233,
     * 46.76654261437082, NaN)
     *
     */
    if (p1.equals2D(q1) || p1.equals2D(q2)) {
      this.intPt[0] = p1;
    } else if (p2.equals2D(q1) || p2.equals2D(q2)) {
      this.intPt[0] = p2;
    }

    /**
     * Now check to see if any endpoint lies on the interior of the other
     * segment.
     */
    else if (Pq1 === 0) {
      this.intPt[0] = new jsts.geom.Coordinate(q1);
    } else if (Pq2 === 0) {
      this.intPt[0] = new jsts.geom.Coordinate(q2);
    } else if (Qp1 === 0) {
      this.intPt[0] = new jsts.geom.Coordinate(p1);
    } else if (Qp2 === 0) {
      this.intPt[0] = new jsts.geom.Coordinate(p2);
    }
  } else {
    this._isProper = true;
    this.intPt[0] = this.intersection(p1, p2, q1, q2);
  }
  return jsts.algorithm.LineIntersector.POINT_INTERSECTION;
};


/**
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 * @param {Coordinate}
 *          q1
 * @param {Coordinate}
 *          q2
 * @return {Number}
 * @private
 */
jsts.algorithm.RobustLineIntersector.prototype.computeCollinearIntersection = function(
    p1, p2, q1, q2) {
  var p1q1p2 = jsts.geom.Envelope.intersects(p1, p2, q1);
  var p1q2p2 = jsts.geom.Envelope.intersects(p1, p2, q2);
  var q1p1q2 = jsts.geom.Envelope.intersects(q1, q2, p1);
  var q1p2q2 = jsts.geom.Envelope.intersects(q1, q2, p2);

  if (p1q1p2 && p1q2p2) {
    this.intPt[0] = q1;
    this.intPt[1] = q2;
    return jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
  }
  if (q1p1q2 && q1p2q2) {
    this.intPt[0] = p1;
    this.intPt[1] = p2;
    return jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
  }
  if (p1q1p2 && q1p1q2) {
    this.intPt[0] = q1;
    this.intPt[1] = p1;
    return q1.equals(p1) && !p1q2p2 && !q1p2q2 ? jsts.algorithm.LineIntersector.POINT_INTERSECTION
        : jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
  }
  if (p1q1p2 && q1p2q2) {
    this.intPt[0] = q1;
    this.intPt[1] = p2;
    return q1.equals(p2) && !p1q2p2 && !q1p1q2 ? jsts.algorithm.LineIntersector.POINT_INTERSECTION
        : jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
  }
  if (p1q2p2 && q1p1q2) {
    this.intPt[0] = q2;
    this.intPt[1] = p1;
    return q2.equals(p1) && !p1q1p2 && !q1p2q2 ? jsts.algorithm.LineIntersector.POINT_INTERSECTION
        : jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
  }
  if (p1q2p2 && q1p2q2) {
    this.intPt[0] = q2;
    this.intPt[1] = p2;
    return q2.equals(p2) && !p1q1p2 && !q1p1q2 ? jsts.algorithm.LineIntersector.POINT_INTERSECTION
        : jsts.algorithm.LineIntersector.COLLINEAR_INTERSECTION;
  }
  return jsts.algorithm.LineIntersector.NO_INTERSECTION;
};


/**
 * This method computes the actual value of the intersection point. To obtain
 * the maximum precision from the intersection calculation, the coordinates are
 * normalized by subtracting the minimum ordinate values (in absolute value).
 * This has the effect of removing common significant digits from the
 * calculation to maintain more bits of precision.
 *
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 * @param {Coordinate}
 *          q1
 * @param {Coordinate}
 *          q2
 * @return {Coordinate}
 * @private
 */
jsts.algorithm.RobustLineIntersector.prototype.intersection = function(p1, p2,
    q1, q2) {
  var intPt = this.intersectionWithNormalization(p1, p2, q1, q2);

  /**
   * Due to rounding it can happen that the computed intersection is outside the
   * envelopes of the input segments. Clearly this is inconsistent. This code
   * checks this condition and forces a more reasonable answer
   *
   * MD - May 4 2005 - This is still a problem. Here is a failure case:
   *
   * LINESTRING (2089426.5233462777 1180182.3877339689, 2085646.6891757075
   * 1195618.7333999649) LINESTRING (1889281.8148903656 1997547.0560044837,
   * 2259977.3672235999 483675.17050843034) int point =
   * (2097408.2633752143,1144595.8008114607)
   *
   * MD - Dec 14 2006 - This does not seem to be a failure case any longer
   */
  if (!this.isInSegmentEnvelopes(intPt)) {
    // System.out.println("Intersection outside segment envelopes: " + intPt);
    // System.out.println("Segments: " + this);
    // compute a safer result
    intPt = jsts.algorithm.CentralEndpointIntersector.getIntersection(p1, p2, q1, q2);
    // System.out.println("Snapped to " + intPt);
  }

  if (this.precisionModel !== null) {
    this.precisionModel.makePrecise(intPt);
  }

  return intPt;
};


/**
 * @param {Coordinate}
 *          p1
 * @param {Coordinate}
 *          p2
 * @param {Coordinate}
 *          q1
 * @param {Coordinate}
 *          q2
 * @return {Coordinate}
 * @private
 */
jsts.algorithm.RobustLineIntersector.prototype.intersectionWithNormalization = function(
    p1, p2, q1, q2) {
  var n1 = new jsts.geom.Coordinate(p1);
  var n2 = new jsts.geom.Coordinate(p2);
  var n3 = new jsts.geom.Coordinate(q1);
  var n4 = new jsts.geom.Coordinate(q2);
  var normPt = new jsts.geom.Coordinate();
  this.normalizeToEnvCentre(n1, n2, n3, n4, normPt);

  var intPt = this.safeHCoordinateIntersection(n1, n2, n3, n4);

  intPt.x += normPt.x;
  intPt.y += normPt.y;

  return intPt;
};


/**
 * Computes a segment intersection using homogeneous coordinates. Round-off
 * error can cause the raw computation to fail, (usually due to the segments
 * being approximately parallel). If this happens, a reasonable approximation is
 * computed instead.
 *
 * @param {Coordinate}
 *          p1 a segment endpoint.
 * @param {Coordinate}
 *          p2 a segment endpoint.
 * @param {Coordinate}
 *          q1 a segment endpoint.
 * @param {Coordinate}
 *          q2 a segment endpoint.
 * @return {Coordinate} the computed intersection point.
 * @private
 */
jsts.algorithm.RobustLineIntersector.prototype.safeHCoordinateIntersection = function(
    p1, p2, q1, q2) {
  var intPt = null;
  try {
    intPt = jsts.algorithm.HCoordinate.intersection(p1, p2, q1, q2);
  } catch (e) {
    if (e instanceof jsts.error.NotRepresentableError) {
      // System.out.println("Not calculable: " + this);
      // compute an approximate result
      intPt = jsts.algorithm.CentralEndpointIntersector.getIntersection(p1, p2,
          q1, q2);
      // System.out.println("Snapped to " + intPt);
    } else {
      throw e;
    }
  }

  return intPt;
};


/**
 * Normalize the supplied coordinates so that their minimum ordinate values lie
 * at the origin. NOTE: this normalization technique appears to cause large
 * errors in the position of the intersection point for some cases.
 *
 * @param {Coordinate}
 *          n1
 * @param {Coordinate}
 *          n2
 * @param {Coordinate}
 *          n3
 * @param {Coordinate}
 *          n4
 * @param {Coordinate}
 *          normPt
 */
jsts.algorithm.RobustLineIntersector.prototype.normalizeToMinimum = function(
    n1, n2, n3, n4, normPt) {
  normPt.x = this.smallestInAbsValue(n1.x, n2.x, n3.x, n4.x);
  normPt.y = this.smallestInAbsValue(n1.y, n2.y, n3.y, n4.y);
  n1.x -= normPt.x;
  n1.y -= normPt.y;
  n2.x -= normPt.x;
  n2.y -= normPt.y;
  n3.x -= normPt.x;
  n3.y -= normPt.y;
  n4.x -= normPt.x;
  n4.y -= normPt.y;
};


/**
 * Normalize the supplied coordinates to so that the midpoint of their
 * intersection envelope lies at the origin.
 *
 * @param {Coordinate}
 *          n00
 * @param {Coordinate}
 *          n01
 * @param {Coordinate}
 *          n10
 * @param {Coordinate}
 *          n11
 * @param {Coordinate}
 *          normPt
 */
jsts.algorithm.RobustLineIntersector.prototype.normalizeToEnvCentre = function(
    n00, n01, n10, n11, normPt) {
  var minX0 = n00.x < n01.x ? n00.x : n01.x;
  var minY0 = n00.y < n01.y ? n00.y : n01.y;
  var maxX0 = n00.x > n01.x ? n00.x : n01.x;
  var maxY0 = n00.y > n01.y ? n00.y : n01.y;

  var minX1 = n10.x < n11.x ? n10.x : n11.x;
  var minY1 = n10.y < n11.y ? n10.y : n11.y;
  var maxX1 = n10.x > n11.x ? n10.x : n11.x;
  var maxY1 = n10.y > n11.y ? n10.y : n11.y;

  var intMinX = minX0 > minX1 ? minX0 : minX1;
  var intMaxX = maxX0 < maxX1 ? maxX0 : maxX1;
  var intMinY = minY0 > minY1 ? minY0 : minY1;
  var intMaxY = maxY0 < maxY1 ? maxY0 : maxY1;

  var intMidX = (intMinX + intMaxX) / 2.0;
  var intMidY = (intMinY + intMaxY) / 2.0;
  normPt.x = intMidX;
  normPt.y = intMidY;

  /*
  // equilavalent code using more modular but slower method
  Envelope env0 = new Envelope(n00, n01);
  Envelope env1 = new Envelope(n10, n11);
  Envelope intEnv = env0.intersection(env1);
  Coordinate intMidPt = intEnv.centre();

  normPt.x = intMidPt.x;
  normPt.y = intMidPt.y;
  */

  n00.x -= normPt.x;
  n00.y -= normPt.y;
  n01.x -= normPt.x;
  n01.y -= normPt.y;
  n10.x -= normPt.x;
  n10.y -= normPt.y;
  n11.x -= normPt.x;
  n11.y -= normPt.y;
};


/**
 * @param {double}
 *          x1
 * @param {double}
 *          x2
 * @param {double}
 *          x3
 * @param {double}
 *          x4
 * @return {double}
 */
jsts.algorithm.RobustLineIntersector.prototype.smallestInAbsValue = function(
    x1, x2, x3, x4) {
  var x = x1;
  var xabs = Math.abs(x);
  if (Math.abs(x2) < xabs) {
    x = x2;
    xabs = Math.abs(x2);
  }
  if (Math.abs(x3) < xabs) {
    x = x3;
    xabs = Math.abs(x3);
  }
  if (Math.abs(x4) < xabs) {
    x = x4;
  }
  return x;
};


/**
 * Test whether a point lies in the envelopes of both input segments. A
 * correctly computed intersection point should return <code>true</code> for
 * this test. Since this test is for debugging purposes only, no attempt is made
 * to optimize the envelope test.
 *
 * @param {Coordinate}
 *          intPt
 * @return {boolean} <code>true</code> if the input point lies within both
 *         input segment envelopes.
 * @private
 */
jsts.algorithm.RobustLineIntersector.prototype.isInSegmentEnvelopes = function(
    intPt) {
  var env0 = new jsts.geom.Envelope(this.inputLines[0][0],
      this.inputLines[0][1]);
  var env1 = new jsts.geom.Envelope(this.inputLines[1][0],
      this.inputLines[1][1]);
  return env0.contains(intPt) && env1.contains(intPt);
};



/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * The base class for operations that require {@link GeometryGraph}s.
 *
 * @param {Geometry}
 *          g0
 * @param {Geometry}
 *          g1
 * @param {BoundaryNodeRule}
 *          boundaryNodeRule
 * @constructor
 */
jsts.operation.GeometryGraphOperation = function(g0, g1, boundaryNodeRule) {
  this.li = new jsts.algorithm.RobustLineIntersector();
  this.arg = [];

  if (g0 === undefined) {
    return;
  }

  if (g1 === undefined) {
    this.setComputationPrecision(g0.getPrecisionModel());

    this.arg[0] = new jsts.geomgraph.GeometryGraph(0, g0);
    return;
  }

  boundaryNodeRule = boundaryNodeRule ||
      jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE;

  // use the most precise model for the result
  if (g0.getPrecisionModel().compareTo(g1.getPrecisionModel()) >= 0)
    this.setComputationPrecision(g0.getPrecisionModel());
  else
    this.setComputationPrecision(g1.getPrecisionModel());

  this.arg[0] = new jsts.geomgraph.GeometryGraph(0, g0, boundaryNodeRule);
  this.arg[1] = new jsts.geomgraph.GeometryGraph(1, g1, boundaryNodeRule);
};


/**
 * @type {LineIntersector}
 * @protected
 */
jsts.operation.GeometryGraphOperation.prototype.li = null;


/**
 * @type {PrecisionModel}
 * @protected
 */
jsts.operation.GeometryGraphOperation.prototype.resultPrecisionModel = null;


/**
 * The operation args into an array so they can be accessed by index
 *
 * @type {GeometryGraph[]}
 * @protected
 */
jsts.operation.GeometryGraphOperation.prototype.arg = null;


/**
 * @param {int}
 *          i
 * @return {Geometry}
 */
jsts.operation.GeometryGraphOperation.prototype.getArgGeometry = function(i) {
  return arg[i].getGeometry();
};


/**
 * @param {PrecisionModel}
 *          pm
 * @protected
 */
jsts.operation.GeometryGraphOperation.prototype.setComputationPrecision = function(pm) {
  this.resultPrecisionModel = pm;
  this.li.setPrecisionModel(this.resultPrecisionModel);
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Computes the topological ({@link Location}) of a single point to a
 * {@link Geometry}. A {@link BoundaryNodeRule} may be specified to control the
 * evaluation of whether the point lies on the boundary or not The default rule
 * is to use the the <i>SFS Boundary Determination Rule</i>
 * <p>
 * Notes:
 * <ul>
 * <li>{@link LinearRing}s do not enclose any area - points inside the ring
 * are still in the EXTERIOR of the ring.
 * </ul>
 * Instances of this class are not reentrant.
 *
 * @constructor
 */
jsts.algorithm.PointLocator = function(boundaryRule) {
  this.boundaryRule = boundaryRule ? boundaryRule
      : jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE;
};


/**
 * default is to use OGC SFS rule
 *
 * @type {BoundaryNodeRule}
 * @private
 */
jsts.algorithm.PointLocator.prototype.boundaryRule = null;


/**
 * true if the point lies in or on any Geometry element
 *
 * @type {boolean}
 * @private
 */
jsts.algorithm.PointLocator.prototype.isIn = null;


/**
 * the number of sub-elements whose boundaries the point lies in
 *
 * @type {int}
 * @private
 */
jsts.algorithm.PointLocator.prototype.numBoundaries = null;


/**
 * Convenience method to test a point for intersection with a Geometry
 *
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {Geometry}
 *          geom the Geometry to test.
 * @return {boolean} <code>true</code> if the point is in the interior or
 *         boundary of the Geometry.
 */
jsts.algorithm.PointLocator.prototype.intersects = function(p, geom) {
  return this.locate(p, geom) !== jsts.geom.Location.EXTERIOR;
};


/**
 * Computes the topological relationship ({@link Location}) of a single point
 * to a Geometry. It handles both single-element and multi-element Geometries.
 * The algorithm for multi-part Geometries takes into account the SFS Boundary
 * Determination Rule.
 *
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {Geometry}
 *          geom the Geometry to test.
 * @return {int} the {@link Location} of the point relative to the input
 *         Geometry.
 */
jsts.algorithm.PointLocator.prototype.locate = function(p, geom) {
  if (geom.isEmpty())
    return jsts.geom.Location.EXTERIOR;

  if (geom instanceof jsts.geom.Point) {
    return this.locate2(p, geom);
  } else if (geom instanceof jsts.geom.LineString) {
    return this.locate3(p, geom);
  } else if (geom instanceof jsts.geom.Polygon) {
    return this.locate4(p, geom);
  }

  this.isIn = false;
  this.numBoundaries = 0;
  this.computeLocation(p, geom);
  if (this.boundaryRule.isInBoundary(this.numBoundaries))
    return jsts.geom.Location.BOUNDARY;
  if (this.numBoundaries > 0 || this.isIn)
    return jsts.geom.Location.INTERIOR;

  return jsts.geom.Location.EXTERIOR;
};


/**
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {Geometry}
 *          geom the Geometry to test.
 * @private
 */
jsts.algorithm.PointLocator.prototype.computeLocation = function(p, geom) {
  if (geom instanceof jsts.geom.Point || geom instanceof jsts.geom.LineString ||
      geom instanceof jsts.geom.Polygon) {
    this.updateLocationInfo(this.locate(p, geom));
  } else if (geom instanceof jsts.geom.MultiLineString) {
    var ml = geom;
    for (var i = 0; i < ml.getNumGeometries(); i++) {
      var l = ml.getGeometryN(i);
      this.updateLocationInfo(this.locate(p, l));
    }
  } else if (geom instanceof jsts.geom.MultiPolygon) {
    var mpoly = geom;
    for (var i = 0; i < mpoly.getNumGeometries(); i++) {
      var poly = mpoly.getGeometryN(i);
      this.updateLocationInfo(this.locate(p, poly));
    }
  } else if (geom instanceof jsts.geom.MultiPoint || geom instanceof jsts.geom.GeometryCollection) {
    for (var i = 0; i < geom.getNumGeometries(); i++) {
      var part = geom.getGeometryN(i);
      if (part !== geom) {
        this.computeLocation(p, part);
      }
    }
  }
};


/**
 * @param {int}
 *          loc
 * @return {int}
 * @private
 */
jsts.algorithm.PointLocator.prototype.updateLocationInfo = function(loc) {
  if (loc === jsts.geom.Location.INTERIOR)
    this.isIn = true;
  if (loc === jsts.geom.Location.BOUNDARY)
    this.numBoundaries++;
};


/**
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {Point}
 *          pt the Point to test.
 * @return {int}
 * @private
 */
jsts.algorithm.PointLocator.prototype.locate2 = function(p, pt) {
  // no point in doing envelope test, since equality test is just as fast

  var ptCoord = pt.getCoordinate();
  if (ptCoord.equals2D(p))
    return jsts.geom.Location.INTERIOR;
  return jsts.geom.Location.EXTERIOR;
};


/**
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {LineString}
 *          l the LineString to test.
 * @return {int}
 * @private
 */
jsts.algorithm.PointLocator.prototype.locate3 = function(p, l) {
  // bounding-box check
  if (!l.getEnvelopeInternal().intersects(p))
    return jsts.geom.Location.EXTERIOR;

  var pt = l.getCoordinates();
  if (!l.isClosed()) {
    if (p.equals(pt[0]) || p.equals(pt[pt.length - 1])) {
      return jsts.geom.Location.BOUNDARY;
    }
  }
  if (jsts.algorithm.CGAlgorithms.isOnLine(p, pt))
    return jsts.geom.Location.INTERIOR;
  return jsts.geom.Location.EXTERIOR;
};


/**
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {LinearRing}
 *          ring the LinearRing to test.
 * @return {int}
 * @private
 */
jsts.algorithm.PointLocator.prototype.locateInPolygonRing = function(p, ring) {
  // bounding-box check
  if (!ring.getEnvelopeInternal().intersects(p))
    return jsts.geom.Location.EXTERIOR;

  return jsts.algorithm.CGAlgorithms
      .locatePointInRing(p, ring.getCoordinates());
};


/**
 * @param {Coordinate}
 *          p the coordinate to test.
 * @param {Polygon}
 *          poly the LinearRing to test.
 * @return {int}
 * @private
 */
jsts.algorithm.PointLocator.prototype.locate4 = function(p, poly) {
  if (poly.isEmpty())
    return jsts.geom.Location.EXTERIOR;

  var shell = poly.getExteriorRing();

  var shellLoc = this.locateInPolygonRing(p, shell);
  if (shellLoc === jsts.geom.Location.EXTERIOR)
    return jsts.geom.Location.EXTERIOR;
  if (shellLoc === jsts.geom.Location.BOUNDARY)
    return jsts.geom.Location.BOUNDARY;
  // now test if the point lies in or on the holes
  for (var i = 0; i < poly.getNumInteriorRing(); i++) {
    var hole = poly.getInteriorRingN(i);
    var holeLoc = this.locateInPolygonRing(p, hole);
    if (holeLoc === jsts.geom.Location.INTERIOR)
      return jsts.geom.Location.EXTERIOR;
    if (holeLoc === jsts.geom.Location.BOUNDARY)
      return jsts.geom.Location.BOUNDARY;
  }
  return jsts.geom.Location.INTERIOR;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * Allows comparing {@link Coordinate} arrays in an orientation-independent way.
 *
 * Creates a new {@link OrientedCoordinateArray} for the given
 * {@link Coordinate} array.
 *
 * @param pts
 *          the coordinates to orient.
 */
jsts.noding.OrientedCoordinateArray = function(pts) {
  this.pts = pts;
  this._orientation = jsts.noding.OrientedCoordinateArray.orientation(pts);
};


/**
 * @type {Array.<Coordinate>}
 * @private
 */
jsts.noding.OrientedCoordinateArray.prototype.pts = null;


/**
 * @type {boolean}
 * @private
 */
jsts.noding.OrientedCoordinateArray.prototype._orientation = undefined;


/**
 * Computes the canonical orientation for a coordinate array.
 *
 * @param {Array.
 *          <Coordinate>} pts the array to test.
 * @return <code>true</code> if the points are oriented forwards.
 * @return <code>false</code if the points are oriented in reverse.
 * @private
 */
jsts.noding.OrientedCoordinateArray.orientation = function(pts) {
  return jsts.geom.CoordinateArrays.increasingDirection(pts) === 1;
};

/**
 * Compares two {@link OrientedCoordinateArray}s for their relative order
 *
 * @return -1 this one is smaller.
 * @return 0 the two objects are equal.
 * @return 1 this one is greater.
 */

jsts.noding.OrientedCoordinateArray.prototype.compareTo = function(o1) {
  var oca = o1;
  var comp = jsts.noding.OrientedCoordinateArray.compareOriented(this.pts,
      this._orientation, oca.pts, oca._orientation);
  return comp;
};


/**
 * @private
 */
jsts.noding.OrientedCoordinateArray.compareOriented = function(pts1,
    orientation1, pts2, orientation2) {
  var dir1 = orientation1 ? 1 : -1;
  var dir2 = orientation2 ? 1 : -1;
  var limit1 = orientation1 ? pts1.length : -1;
  var limit2 = orientation2 ? pts2.length : -1;

  var i1 = orientation1 ? 0 : pts1.length - 1;
  var i2 = orientation2 ? 0 : pts2.length - 1;
  var comp = 0;
  while (true) {
    var compPt = pts1[i1].compareTo(pts2[i2]);
    if (compPt !== 0)
      return compPt;
    i1 += dir1;
    i2 += dir2;
    var done1 = i1 === limit1;
    var done2 = i2 === limit2;
    if (done1 && !done2)
      return -1;
    if (!done1 && done2)
      return 1;
    if (done1 && done2)
      return 0;
  }
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


(function() {

  /**
   * @requires jsts/util/Assert.js
   */

  var ArrayList = javascript.util.ArrayList;
  var TreeMap = javascript.util.TreeMap;

  /**
   * A EdgeList is a list of Edges. It supports locating edges that are
   * pointwise equals to a target edge.
   *
   * @constructor
   */
  jsts.geomgraph.EdgeList = function() {
    this.edges = new ArrayList();
    this.ocaMap = new TreeMap();
  };


  /**
   * @type {javascript.util.ArrayList}
   * @private
   */
  jsts.geomgraph.EdgeList.prototype.edges = null;


  /**
   * An index of the edges, for fast lookup.
   *
   * @type {javascript.util.HashMap}
   * @private
   */
  jsts.geomgraph.EdgeList.prototype.ocaMap = null;


  /**
   * Insert an edge unless it is already in the list
   */
  jsts.geomgraph.EdgeList.prototype.add = function(e) {
    this.edges.add(e);
    var oca = new jsts.noding.OrientedCoordinateArray(e.getCoordinates());
    this.ocaMap.put(oca, e);
  };

  jsts.geomgraph.EdgeList.prototype.addAll = function(edgeColl) {
    for (var i = edgeColl.iterator(); i.hasNext();) {
      this.add(i.next());
    }
  };


  /**
   * @return {javascript.util.List}
   */
  jsts.geomgraph.EdgeList.prototype.getEdges = function() {
    return this.edges;
  };


  /**
   * If there is an edge equal to e already in the list, return it. Otherwise
   * return null.
   *
   * @param {Edge}
   *          e
   * @return {Edge} equal edge, if there is one already in the list null
   *         otherwise.
   */
  jsts.geomgraph.EdgeList.prototype.findEqualEdge = function(e) {
    var oca = new jsts.noding.OrientedCoordinateArray(e.getCoordinates());
    // will return null if no edge matches
    var matchEdge = this.ocaMap.get(oca);
    return matchEdge;
  };

  jsts.geomgraph.EdgeList.prototype.getEdges = function() {
    return this.edges;
  };

  jsts.geomgraph.EdgeList.prototype.iterator = function() {
    return this.edges.iterator();
  };

  jsts.geomgraph.EdgeList.prototype.get = function(i) {
    return this.edges.get(i);
  };


  /**
   * If the edge e is already in the list, return its index.
   *
   * @return {Number} index, if e is already in the list -1 otherwise.
   */
  jsts.geomgraph.EdgeList.prototype.findEdgeIndex = function(e) {
    for (var i = 0; i < this.edges.size(); i++) {
      if (this.edges.get(i).equals(e))
        return i;
    }
    return -1;
  };

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @constructor
 */
jsts.geomgraph.NodeFactory = function() {

};


/**
 * The basic node constructor does not allow for incident edges
 */
jsts.geomgraph.NodeFactory.prototype.createNode = function(coord) {
  return new jsts.geomgraph.Node(coord, null);
};



/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/NodeFactory.js
 */

/**
 * Creates nodes for use in the {@link PlanarGraph}s constructed during overlay
 * operations.
 *
 * @constructor
 * @extends jsts.geomgraph.NodeFactory
 */
jsts.operation.overlay.OverlayNodeFactory = function() {

};
jsts.operation.overlay.OverlayNodeFactory.prototype = new jsts.geomgraph.NodeFactory();
jsts.operation.overlay.OverlayNodeFactory.constructor = jsts.operation.overlay.OverlayNodeFactory;

jsts.operation.overlay.OverlayNodeFactory.prototype.createNode = function(coord) {
  return new jsts.geomgraph.Node(coord, new jsts.geomgraph.DirectedEdgeStar());
};



/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/NodeMap.js
 * @requires jsts/geomgraph/NodeFactory.js
 */

(function() {

  var ArrayList = javascript.util.ArrayList;

  /**
   * The computation of the <code>IntersectionMatrix</code> relies on the use
   * of a structure called a "topology graph". The topology graph contains nodes
   * and edges corresponding to the nodes and line segments of a
   * <code>Geometry</code>. Each node and edge in the graph is labeled with
   * its topological location relative to the source geometry.
   * <P>
   * Note that there is no requirement that points of self-intersection be a
   * vertex. Thus to obtain a correct topology graph, <code>Geometry</code>s
   * must be self-noded before constructing their graphs.
   * <P>
   * Two fundamental operations are supported by topology graphs:
   * <UL>
   * <LI>Computing the intersections between all the edges and nodes of a
   * single graph
   * <LI>Computing the intersections between the edges and nodes of two
   * different graphs
   * </UL>
   *
   * @constructor
   */
  jsts.geomgraph.PlanarGraph = function(nodeFactory) {
    this.edges = new ArrayList();
    this.edgeEndList = new ArrayList();
    this.nodes = new jsts.geomgraph.NodeMap(nodeFactory ||
        new jsts.geomgraph.NodeFactory());
  };


  /**
   * @type {javascript.util.ArrayList}
   * @protected
   */
  jsts.geomgraph.PlanarGraph.prototype.edges = null;


  /**
   * @type {jsts.geomgraph.NodeMap}
   * @protected
   */
  jsts.geomgraph.PlanarGraph.prototype.nodes = null;
  /**
   * @type {javascript.util.ArrayList}
   * @protected
   */
  jsts.geomgraph.PlanarGraph.prototype.edgeEndList = null;

  /**
   * For nodes in the Collection, link the DirectedEdges at the node that are in
   * the result. This allows clients to link only a subset of nodes in the
   * graph, for efficiency (because they know that only a subset is of
   * interest).
   */
  jsts.geomgraph.PlanarGraph.linkResultDirectedEdges = function(nodes) {
    for (var nodeit = nodes.iterator(); nodeit.hasNext();) {
      var node = nodeit.next();
      node.getEdges().linkResultDirectedEdges();
    }
  };


  jsts.geomgraph.PlanarGraph.prototype.getEdgeIterator = function() {
    return this.edges.iterator();
  };
  jsts.geomgraph.PlanarGraph.prototype.getEdgeEnds = function() {
    return this.edgeEndList;
  };

  jsts.geomgraph.PlanarGraph.prototype.isBoundaryNode = function(geomIndex,
      coord) {
    var node = this.nodes.find(coord);
    if (node === null)
      return false;
    var label = node.getLabel();
    if (label !== null &&
        label.getLocation(geomIndex) === jsts.geom.Location.BOUNDARY)
      return true;
    return false;
  };

  jsts.geomgraph.PlanarGraph.prototype.insertEdge = function(e) {
    this.edges.add(e);
  };

  jsts.geomgraph.PlanarGraph.prototype.add = function(e) {
    this.nodes.add(e);
    this.edgeEndList.add(e);
  };

  /**
   * @return {javascript.util.Iterator}
   */
  jsts.geomgraph.PlanarGraph.prototype.getNodeIterator = function() {
    return this.nodes.iterator();
  };

  /**
   * @return {javascript.util.Collection}
   */
  jsts.geomgraph.PlanarGraph.prototype.getNodes = function() {
    return this.nodes.values();
  };

  jsts.geomgraph.PlanarGraph.prototype.addNode = function(node) {
    return this.nodes.addNode(node);
  };

  /**
   * Add a set of edges to the graph. For each edge two DirectedEdges will be
   * created. DirectedEdges are NOT linked by this method.
   *
   * @param {javascript.util.List}
   *          edgedToAdd
   */
  jsts.geomgraph.PlanarGraph.prototype.addEdges = function(edgesToAdd) {
    // create all the nodes for the edges
    for (var it = edgesToAdd.iterator(); it.hasNext();) {
      var e = it.next();
      this.edges.add(e);

      var de1 = new jsts.geomgraph.DirectedEdge(e, true);
      var de2 = new jsts.geomgraph.DirectedEdge(e, false);
      de1.setSym(de2);
      de2.setSym(de1);

      this.add(de1);
      this.add(de2);
    }
  };

  jsts.geomgraph.PlanarGraph.prototype.linkResultDirectedEdges = function() {
    for (var nodeit = this.nodes.iterator(); nodeit.hasNext();) {
      var node = nodeit.next();
      node.getEdges().linkResultDirectedEdges();
    }
  };

  /**
   * Returns the edge which starts at p0 and whose first segment is parallel to
   * p1
   *
   * @return the edge, if found <code>null</code> if the edge was not found.
   */
  jsts.geomgraph.PlanarGraph.prototype.findEdgeInSameDirection = function(p0,
      p1) {
    var i = 0, il = this.edges.size(), e, eCoord;
    for (i; i < il; i++) {
      e = this.edges.get(i);
      eCoord = e.getCoordinates();

      if (this.matchInSameDirection(p0, p1, eCoord[0], eCoord[1])) {
        return e;
      }

      if (this.matchInSameDirection(p0, p1, eCoord[eCoord.length - 1],
          eCoord[eCoord.length - 2])) {
        return e;
      }
    }
    return null;
  };

  /**
   * The coordinate pairs match if they define line segments lying in the same
   * direction. E.g. the segments are parallel and in the same quadrant (as
   * opposed to parallel and opposite!).
   */
  jsts.geomgraph.PlanarGraph.prototype.matchInSameDirection = function(p0, p1,
      ep0, ep1) {
    if (!p0.equals(ep0)) {
      return false;
    }

    if (jsts.algorithm.CGAlgorithms.computeOrientation(p0, p1, ep1) === jsts.algorithm.CGAlgorithms.COLLINEAR &&
        jsts.geomgraph.Quadrant.quadrant(p0, p1) === jsts.geomgraph.Quadrant
            .quadrant(ep0, ep1)) {
      return true;
    }
    return false;
  };

  /**
   * Returns the EdgeEnd which has edge e as its base edge (MD 18 Feb 2002 -
   * this should return a pair of edges)
   *
   * @return the edge, if found <code>null</code> if the edge was not found.
   */
  jsts.geomgraph.PlanarGraph.prototype.findEdgeEnd = function(e) {
    for (var i = this.getEdgeEnds().iterator(); i.hasNext();) {
      var ee = i.next();
      if (ee.getEdge() === e) {
        return ee;
      }
    }
    return null;
  };
})();

// TODO: port rest of class

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * An interface for classes which represent a sequence of contiguous line
 * segments. SegmentStrings can carry a context object, which is useful for
 * preserving topological or parentage information.
 *
 * @interface
 */
jsts.noding.SegmentString = function() {

};


/**
 * Gets the user-defined data for this segment string.
 *
 * @return {Object} the user-defined data.
 */
jsts.noding.SegmentString.prototype.getData = jsts.abstractFunc;


/**
 * Sets the user-defined data for this segment string.
 *
 * @param {Object}
 *          data an Object containing user-defined data.
 */
jsts.noding.SegmentString.prototype.setData = jsts.abstractFunc;


/**
 * @return {number}
 */
jsts.noding.SegmentString.prototype.size = jsts.abstractFunc;


/**
 * @param {number}
 *          i
 * @return {jsts.geom.Coordinate}
 */
jsts.noding.SegmentString.prototype.getCoordinate = jsts.abstractFunc;


/**
 * @return {Array.<jsts.geom.Coordinate>}
 */
jsts.noding.SegmentString.prototype.getCoordinates = jsts.abstractFunc;


/**
 * @return {boolean}
 */
jsts.noding.SegmentString.prototype.isClosed = jsts.abstractFunc;


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * Represents a list of contiguous line segments, and supports noding the
   * segments. The line segments are represented by an array of
   * {@link Coordinate}s. Intended to optimize the noding of contiguous
   * segments by reducing the number of allocated objects. SegmentStrings can
   * carry a context object, which is useful for preserving topological or
   * parentage information. All noded substrings are initialized with the same
   * context object.
   *
   * Creates a new segment string from a list of vertices.
   *
   * @param pts
   *          the vertices of the segment string.
   * @param data
   *          the user-defined data of this segment string (may be null).
   * @constructor
   */
  jsts.noding.BasicSegmentString = function(pts, data) {
    this.pts = pts;
    this.data = data;
  };
  jsts.noding.BasicSegmentString.prototype = new jsts.noding.SegmentString();


  jsts.noding.BasicSegmentString.prototype.pts = null;
  jsts.noding.BasicSegmentString.prototype.data = null;


  /**
   * Gets the user-defined data for this segment string.
   *
   * @return the user-defined data.
   */
  jsts.noding.BasicSegmentString.prototype.getData = function() {
    return this.data;
  }

  /**
   * Sets the user-defined data for this segment string.
   *
   * @param data
   *          an Object containing user-defined data.
   */
  jsts.noding.BasicSegmentString.prototype.setData = function(data) {
    this.data = data;
  };

  jsts.noding.BasicSegmentString.prototype.size = function() {
    return this.pts.length;
  };

  jsts.noding.BasicSegmentString.prototype.getCoordinate = function(i) {
    return this.pts[i];
  };

  jsts.noding.BasicSegmentString.prototype.getCoordinates = function() {
    return this.pts;
  };

  jsts.noding.BasicSegmentString.prototype.isClosed = function() {
    return this.pts[0].equals(this.pts[this.pts.length - 1]);
  };

  /**
   * Gets the octant of the segment starting at vertex <code>index</code>.
   *
   * @param index
   *          the index of the vertex starting the segment. Must not be the last
   *          index in the vertex list.
   * @return the octant of the segment at the vertex.
   */
  jsts.noding.BasicSegmentString.prototype.getSegmentOctant = function(index) {
    if (index == this.pts.length - 1)
      return -1;
    return jsts.noding.Octant.octant(this.getCoordinate(index), this
        .getCoordinate(index + 1));
  };

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Processes possible intersections detected by a {@link Noder}. The
 * {@link SegmentIntersector} is passed to a {@link Noder}. The
 * {@link addIntersections} method is called whenever the {@link Noder} detects
 * that two SegmentStrings <i>might</i> intersect. This class may be used
 * either to find all intersections, or to detect the presence of an
 * intersection. In the latter case, Noders may choose to short-circuit their
 * computation by calling the {@link isDone} method. This class is an example of
 * the <i>Strategy</i> pattern.
 *
 * @interface
 */
jsts.noding.SegmentIntersector = function() {

};

/**
 * This method is called by clients of the {@link SegmentIntersector} interface
 * to process intersections for two segments of the {@link SegmentString}s
 * being intersected.
 *
 * @param {SegmentString}
 *          e0
 * @param {number}
 *          segIndex0
 * @param {SegmentString}
 *          e1
 * @param {number}
 *          segIndex0
 */
jsts.noding.SegmentIntersector.prototype.processIntersections = jsts.abstractFunc;

/**
 * Reports whether the client of this class needs to continue testing all
 * intersections in an arrangement.
 *
 * @return {boolean} true if there is no need to continue testing segments.
 */
jsts.noding.SegmentIntersector.prototype.isDone = jsts.abstractFunc;


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/noding/SegmentIntersector.js
   */

  var SegmentIntersector = jsts.noding.SegmentIntersector;
  var ArrayList = javascript.util.ArrayList;

  /**
   * Finds an interior intersection in a set of {@link SegmentString}s, if one
   * exists. Only the first intersection found is reported.
   *
   * Creates an intersection finder which finds an interior intersection if one
   * exists
   *
   * @param li
   *          the LineIntersector to use.
   * @constructor
   */
  jsts.noding.InteriorIntersectionFinder = function(li) {
    this.li = li;
    this.intersections = new ArrayList();
    this.interiorIntersection = null;
  };

  jsts.noding.InteriorIntersectionFinder.prototype = new SegmentIntersector();
  jsts.noding.InteriorIntersectionFinder.constructor = jsts.noding.InteriorIntersectionFinder;

  jsts.noding.InteriorIntersectionFinder.prototype.findAllIntersections = false;
  jsts.noding.InteriorIntersectionFinder.prototype.isCheckEndSegmentsOnly = false;
  jsts.noding.InteriorIntersectionFinder.prototype.li = null;
  jsts.noding.InteriorIntersectionFinder.prototype.interiorIntersection = null;
  jsts.noding.InteriorIntersectionFinder.prototype.intSegments = null;
  jsts.noding.InteriorIntersectionFinder.prototype.intersections = null;


  jsts.noding.InteriorIntersectionFinder.prototype.setFindAllIntersections = function(
      findAllIntersections) {
    this.findAllIntersections = findAllIntersections;
  };

  jsts.noding.InteriorIntersectionFinder.prototype.getIntersections = function() {
    return intersections;
  };

  /**
   * Sets whether only end segments should be tested for interior intersection.
   * This is a performance optimization that may be used if the segments have
   * been previously noded by an appropriate algorithm. It may be known that any
   * potential noding failures will occur only in end segments.
   *
   * @param isCheckEndSegmentsOnly
   *          whether to test only end segments.
   */
  jsts.noding.InteriorIntersectionFinder.prototype.setCheckEndSegmentsOnly = function(
      isCheckEndSegmentsOnly) {
    this.isCheckEndSegmentsOnly = isCheckEndSegmentsOnly;
  }

  /**
   * Tests whether an intersection was found.
   *
   * @return true if an intersection was found.
   */
  jsts.noding.InteriorIntersectionFinder.prototype.hasIntersection = function() {
    return this.interiorIntersection != null;
  };

  /**
   * Gets the computed location of the intersection. Due to round-off, the
   * location may not be exact.
   *
   * @return the coordinate for the intersection location.
   */
  jsts.noding.InteriorIntersectionFinder.prototype.getInteriorIntersection = function() {
    return this.interiorIntersection;
  };

  /**
   * Gets the endpoints of the intersecting segments.
   *
   * @return an array of the segment endpoints (p00, p01, p10, p11).
   */
  jsts.noding.InteriorIntersectionFinder.prototype.getIntersectionSegments = function() {
    return this.intSegments;
  };

  /**
   * This method is called by clients of the {@link SegmentIntersector} class to
   * process intersections for two segments of the {@link SegmentString}s being
   * intersected. Note that some clients (such as {@link MonotoneChain}s) may
   * optimize away this call for segment pairs which they have determined do not
   * intersect (e.g. by an disjoint envelope test).
   */
  jsts.noding.InteriorIntersectionFinder.prototype.processIntersections = function(
      e0, segIndex0, e1, segIndex1) {
    // short-circuit if intersection already found
    if (this.hasIntersection())
      return;

    // don't bother intersecting a segment with itself
    if (e0 == e1 && segIndex0 == segIndex1)
      return;

    /**
     * If enabled, only test end segments (on either segString).
     *
     */
    if (this.isCheckEndSegmentsOnly) {
      var isEndSegPresent = this.isEndSegment(e0, segIndex0) ||
          isEndSegment(e1, segIndex1);
      if (!isEndSegPresent)
        return;
    }

    var p00 = e0.getCoordinates()[segIndex0];
    var p01 = e0.getCoordinates()[segIndex0 + 1];
    var p10 = e1.getCoordinates()[segIndex1];
    var p11 = e1.getCoordinates()[segIndex1 + 1];

    this.li.computeIntersection(p00, p01, p10, p11);
    // if (li.hasIntersection() && li.isProper()) Debug.println(li);

    if (this.li.hasIntersection()) {
      if (this.li.isInteriorIntersection()) {
        this.intSegments = [];
        this.intSegments[0] = p00;
        this.intSegments[1] = p01;
        this.intSegments[2] = p10;
        this.intSegments[3] = p11;

        this.interiorIntersection = this.li.getIntersection(0);
        this.intersections.add(this.interiorIntersection);
      }
    }
  };

  /**
   * Tests whether a segment in a {@link SegmentString} is an end segment.
   * (either the first or last).
   *
   * @param segStr
   *          a segment string.
   * @param index
   *          the index of a segment in the segment string.
   * @return true if the segment is an end segment.
   * @private
   */
  jsts.noding.InteriorIntersectionFinder.prototype.isEndSegment = function(
      segStr, index) {
    if (index == 0)
      return true;
    if (index >= segStr.size() - 2)
      return true;
    return false;
  };

  jsts.noding.InteriorIntersectionFinder.prototype.isDone = function() {
    if (this.findAllIntersections)
      return false;
    return this.interiorIntersection != null;
  };

})();

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * A lightweight class used to store coordinates on the 2-dimensional
   * Cartesian plane. It is distinct from {@link Point}, which is a subclass of
   * {@link Geometry}. Unlike objects of type {@link Point} (which contain
   * additional information such as an envelope, a precision model, and spatial
   * reference system information), a <code>Coordinate</code> only contains
   * coordinate values and accessor methods.
   *
   * @requires jsts/geom/Geometry.js
   */



  /**
   * @constructor
   */
  jsts.geom.Coordinate = function(x, y) {
    if (typeof x === 'number') {
      this.x = x;
      this.y = y;
    } else if (x instanceof jsts.geom.Coordinate) {
      this.x = parseFloat(x.x);
      this.y = parseFloat(x.y);
    } else if (x === undefined || x === null) {
      this.x = 0;
      this.y = 0;
    } else if (typeof x === 'string') {
      this.x = parseFloat(x);
      this.y = parseFloat(y);
    }
  };

  /**
   * Sets this <code>Coordinate</code>s (x,y,z) values to that of
   * <code>other</code>.
   *
   * @param {Coordinate}
   *          other the <code>Coordinate</code> to copy.
   */
  jsts.geom.Coordinate.prototype.setCoordinate = function(other) {
    this.x = other.x;
    this.y = other.y;
  };


  /**
   * Clones this instance.
   *
   * @return {Coordinate} A point instance cloned from this.
   */
  jsts.geom.Coordinate.prototype.clone = function() {
    return new jsts.geom.Coordinate(this.x, this.y);
  };


  /**
   * Computes the 2-dimensional Euclidean distance to another location. The
   * Z-ordinate is ignored.
   *
   * @param {Coordinate}
   *          p a point.
   * @return {number} the 2-dimensional Euclidean distance between the
   *         locations.
   */
  jsts.geom.Coordinate.prototype.distance = function(p) {
    var dx = this.x - p.x;
    var dy = this.y - p.y;

    return Math.sqrt(dx * dx + dy * dy);
  };

  /**
   * Returns whether the planar projections of the two <code>Coordinate</code>s
   * are equal.
   *
   * @param {Coordinate}
   *          other a <code>Coordinate</code> with which to do the 2D
   *          comparison.
   * @return {boolean} <code>true</code> if the x- and y-coordinates are
   *         equal; the z-coordinates do not have to be equal.
   */
  jsts.geom.Coordinate.prototype.equals2D = function(other) {
    if (this.x !== other.x) {
      return false;
    }

    if (this.y !== other.y) {
      return false;
    }

    return true;
  };

  /**
   * Returns <code>true</code> if <code>other</code> has the same values for
   * the x and y ordinates. Since Coordinates are 2.5D, this routine ignores the
   * z value when making the comparison.
   *
   * @param {Coordinate}
   *          other a <code>Coordinate</code> with which to do the comparison.
   * @return {boolean} <code>true</code> if <code>other</code> is a
   *         <code>Coordinate</code> with the same values for the x and y
   *         ordinates.
   */
  jsts.geom.Coordinate.prototype.equals = function(other) {
    if (!other instanceof jsts.geom.Coordinate || other === undefined) {
      return false;
    }
    return this.equals2D(other);
  };

  /**
   * Compares this {@link Coordinate} with the specified {@link Coordinate} for
   * order. This method ignores the z value when making the comparison. Returns:
   * <UL>
   * <LI> -1 : this.x < other.x || ((this.x == other.x) && (this.y < other.y))
   * <LI> 0 : this.x == other.x && this.y = other.y
   * <LI> 1 : this.x > other.x || ((this.x == other.x) && (this.y > other.y))
   *
   * </UL>
   * Note: This method assumes that ordinate values are valid numbers. NaN
   * values are not handled correctly.
   *
   * @param {Coordinate}
   *          other the <code>Coordinate</code> with which this
   *          <code>Coordinate</code> is being compared.
   * @return {number} -1, zero, or 1 as explained above.
   */
  jsts.geom.Coordinate.prototype.compareTo = function(other) {
    if (this.x < other.x) {
      return -1;
    }
    if (this.x > other.x) {
      return 1;
    }
    if (this.y < other.y) {
      return -1;
    }
    if (this.y > other.y) {
      return 1;
    }

    return 0;
  };

  jsts.geom.Coordinate.prototype.toString = function() {
    return '(' + this.x + ', ' + this.y + ')';
  };

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/Coordinate.js
 */

/**
 * Defines a rectangular region of the 2D coordinate plane. It is often used to
 * represent the bounding box of a {@link Geometry}, e.g. the minimum and
 * maximum x and y values of the {@link Coordinate}s.
 * <p>
 * Note that Envelopes support infinite or half-infinite regions, by using the
 * values of <code>Double.POSITIVE_INFINITY</code> and
 * <code>Double.NEGATIVE_INFINITY</code>.
 * <p>
 * When Envelope objects are created or initialized, the supplies extent values
 * are automatically sorted into the correct order.
 */



/**
 * Creates an <code>Envelope</code> for a region defined by maximum and
 * minimum values.
 *
 * @constructor
 */
jsts.geom.Envelope = function() {
  jsts.geom.Envelope.prototype.init.apply(this, arguments);
};


/**
 * the minimum x-coordinate
 *
 * @type {?number}
 */
jsts.geom.Envelope.prototype.minx = null;


/**
 * the maximum x-coordinate
 *
 * @type {?number}
 */
jsts.geom.Envelope.prototype.maxx = null;


/**
 * the minimum y-coordinate
 *
 * @type {?number}
 */
jsts.geom.Envelope.prototype.miny = null;


/**
 * the maximum y-coordinate
 *
 * @type {?number}
 */
jsts.geom.Envelope.prototype.maxy = null;


/**
 * Creates an <code>Envelope</code> for a region defined by maximum and
 * minimum values.
 *
 * Will call appropriate init* method depending on arguments.
 */
jsts.geom.Envelope.prototype.init = function() {
  if (typeof arguments[0] === 'number' && arguments.length === 4) {
    this.initFromValues(arguments[0], arguments[1], arguments[2], arguments[3]);
  } else if (arguments[0] instanceof jsts.geom.Coordinate &&
      arguments.length === 1) {
    this.initFromCoordinate(arguments[0]);
  } else if (arguments[0] instanceof jsts.geom.Coordinate &&
      arguments.length === 2) {
    this.initFromCoordinates(arguments[0], arguments[1]);
  } else if (arguments[0] instanceof jsts.geom.Envelope &&
      arguments.length === 1) {
    this.initFromEnvelope(arguments[0]);
  } else {
    this.setToNull();
  }
};


/**
 * Initialize an <code>Envelope</code> for a region defined by maximum and
 * minimum values.
 *
 * @param {number}
 *          x1 the first x-value.
 * @param {number}
 *          x2 the second x-value.
 * @param {number}
 *          y1 the first y-value.
 * @param {number}
 *          y2 the second y-value.
 */
jsts.geom.Envelope.prototype.initFromValues = function(x1, x2, y1, y2) {
  if (x1 < x2) {
    this.minx = x1;
    this.maxx = x2;
  } else {
    this.minx = x2;
    this.maxx = x1;
  }
  if (y1 < y2) {
    this.miny = y1;
    this.maxy = y2;
  } else {
    this.miny = y2;
    this.maxy = y1;
  }
};


/**
 * Initialize an <code>Envelope</code> to a region defined by two Coordinates.
 *
 * @param {jsts.geom.Coordinate}
 *          p1 the first Coordinate.
 * @param {jsts.geom.Coordinate}
 *          p2 the second Coordinate.
 */
jsts.geom.Envelope.prototype.initFromCoordinates = function(p1, p2) {
  this.initFromValues(p1.x, p2.x, p1.y, p2.y);
};


/**
 * Initialize an <code>Envelope</code> to a region defined by a single
 * Coordinate.
 *
 * @param {jsts.geom.Coordinate}
 *          p the Coordinate.
 */
jsts.geom.Envelope.prototype.initFromCoordinate = function(p) {
  this.initFromValues(p.x, p.x, p.y, p.y);
};


/**
 * Initialize an <code>Envelope</code> from an existing Envelope.
 *
 * @param {jsts.geom.Envelope}
 *          env the Envelope to initialize from.
 */
jsts.geom.Envelope.prototype.initFromEnvelope = function(env) {
  this.minx = env.minx;
  this.maxx = env.maxx;
  this.miny = env.miny;
  this.maxy = env.maxy;
};


/**
 * Makes this <code>Envelope</code> a "null" envelope, that is, the envelope
 * of the empty geometry.
 */
jsts.geom.Envelope.prototype.setToNull = function() {
  this.minx = 0;
  this.maxx = -1;
  this.miny = 0;
  this.maxy = -1;
};


/**
 * Returns <code>true</code> if this <code>Envelope</code> is a "null"
 * envelope.
 *
 * @return {boolean} <code>true</code> if this <code>Envelope</code> is
 *         uninitialized or is the envelope of the empty geometry.
 */
jsts.geom.Envelope.prototype.isNull = function() {
  return this.maxx < this.minx;
};


/**
 * Returns the difference between the maximum and minimum y values.
 *
 * @return {number} max y - min y, or 0 if this is a null <code>Envelope.</code>
 */
jsts.geom.Envelope.prototype.getHeight = function() {
  if (this.isNull()) {
    return 0;
  }
  return this.maxy - this.miny;
};


/**
 * Returns the difference between the maximum and minimum x values.
 *
 * @return {number} max x - min x, or 0 if this is a null <code>Envelope.</code>
 */
jsts.geom.Envelope.prototype.getWidth = function() {
  if (this.isNull()) {
    return 0;
  }
  return this.maxx - this.minx;
};


/**
 * Returns the <code>Envelope</code>s minimum x-value. min x > max x
 * indicates that this is a null <code>Envelope</code>.
 *
 * @return {number} the minimum x-coordinate.
 */
jsts.geom.Envelope.prototype.getMinX = function() {
  return this.minx;
};


/**
 * Returns the <code>Envelope</code>s maximum x-value. min x > max x
 * indicates that this is a null <code>Envelope</code>.
 *
 * @return {number} the maximum x-coordinate.
 */
jsts.geom.Envelope.prototype.getMaxX = function() {
  return this.maxx;
};


/**
 * Returns the <code>Envelope</code>s minimum y-value. min y > max y
 * indicates that this is a null <code>Envelope</code>.
 *
 * @return {number} the minimum y-coordinate.
 */
jsts.geom.Envelope.prototype.getMinY = function() {
  return this.miny;
};


/**
 * Returns the <code>Envelope</code>s maximum y-value. min y > max y
 * indicates that this is a null <code>Envelope</code>.
 *
 * @return {number} the maximum y-coordinate.
 */
jsts.geom.Envelope.prototype.getMaxY = function() {
  return this.maxy;
};


/**
 * Gets the area of this envelope.
 *
 * @return {number} the area of the envelope, 0.0 if the envelope is null.
 */
jsts.geom.Envelope.prototype.getArea = function() {
  return this.getWidth() * this.getHeight();
};


/**
 * Enlarges this <code>Envelope</code>
 *
 * Will call appropriate expandToInclude* depending on arguments.
 */
jsts.geom.Envelope.prototype.expandToInclude = function() {
  if (arguments[0] instanceof jsts.geom.Coordinate) {
    this.expandToIncludeCoordinate(arguments[0]);
  } else if (arguments[0] instanceof jsts.geom.Envelope) {
    this.expandToIncludeEnvelope(arguments[0]);
  } else {
    this.expandToIncludeValues(arguments[0], arguments[1]);
  }
};


/**
 * Enlarges this <code>Envelope</code> so that it contains the given
 * {@link Coordinate}. Has no effect if the point is already on or within the
 * envelope.
 *
 * @param {jsts.geom.Coordinate}
 *          p the Coordinate to expand to include.
 */
jsts.geom.Envelope.prototype.expandToIncludeCoordinate = function(p) {
  this.expandToIncludeValues(p.x, p.y);
};


/**
 * Enlarges this <code>Envelope</code> so that it contains the given point.
 * Has no effect if the point is already on or within the envelope.
 *
 * @param {number}
 *          x the value to lower the minimum x to or to raise the maximum x to.
 * @param {number}
 *          y the value to lower the minimum y to or to raise the maximum y to.
 */
jsts.geom.Envelope.prototype.expandToIncludeValues = function(x, y) {
  if (this.isNull()) {
    this.minx = x;
    this.maxx = x;
    this.miny = y;
    this.maxy = y;
  } else {
    if (x < this.minx) {
      this.minx = x;
    }
    if (x > this.maxx) {
      this.maxx = x;
    }
    if (y < this.miny) {
      this.miny = y;
    }
    if (y > this.maxy) {
      this.maxy = y;
    }
  }
};


/**
 * Enlarges this <code>Envelope</code> so that it contains the
 * <code>other</code> Envelope. Has no effect if <code>other</code> is
 * wholly on or within the envelope.
 *
 * @param {jsts.geom.Envelope}
 *          other the <code>Envelope</code> to expand to include.
 */
jsts.geom.Envelope.prototype.expandToIncludeEnvelope = function(other) {
  if (other.isNull()) {
    return;
  }
  if (this.isNull()) {
    this.minx = other.getMinX();
    this.maxx = other.getMaxX();
    this.miny = other.getMinY();
    this.maxy = other.getMaxY();
  } else {
    if (other.minx < this.minx) {
      this.minx = other.minx;
    }
    if (other.maxx > this.maxx) {
      this.maxx = other.maxx;
    }
    if (other.miny < this.miny) {
      this.miny = other.miny;
    }
    if (other.maxy > this.maxy) {
      this.maxy = other.maxy;
    }
  }
};


/**
 * Enlarges this <code>Envelope</code>
 *
 * Will call appropriate expandBy* depending on arguments.
 */
jsts.geom.Envelope.prototype.expandBy = function() {
  if (arguments.length === 1) {
    this.expandByDistance(arguments[0]);
  } else {
    this.expandByDistances(arguments[0], arguments[1]);
  }
};


/**
 * Expands this envelope by a given distance in all directions. Both positive
 * and negative distances are supported.
 *
 * @param {number}
 *          distance the distance to expand the envelope.
 */
jsts.geom.Envelope.prototype.expandByDistance = function(distance) {
  this.expandByDistances(distance, distance);
};


/**
 * Expands this envelope by a given distance in all directions. Both positive
 * and negative distances are supported.
 *
 * @param {number}
 *          deltaX the distance to expand the envelope along the the X axis.
 * @param {number}
 *          deltaY the distance to expand the envelope along the the Y axis.
 */
jsts.geom.Envelope.prototype.expandByDistances = function(deltaX, deltaY) {
  if (this.isNull()) {
    return;
  }

  this.minx -= deltaX;
  this.maxx += deltaX;
  this.miny -= deltaY;
  this.maxy += deltaY;

  // check for envelope disappearing
  if (this.minx > this.maxx || this.miny > this.maxy) {
    this.setToNull();
  }
};


/**
 * Translates this envelope by given amounts in the X and Y direction.
 *
 * @param {number}
 *          transX the amount to translate along the X axis.
 * @param {number}
 *          transY the amount to translate along the Y axis.
 */
jsts.geom.Envelope.prototype.translate = function(transX, transY) {
  if (this.isNull()) {
    return;
  }
  this.init(this.minx + transX, this.maxx + transX, this.miny + transY,
      this.maxy + transY);
};


/**
 * Computes the coordinate of the centre of this envelope (as long as it is
 * non-null
 *
 * @return {jsts.geom.Coordinate} the centre coordinate of this envelope <code>null</code>
 *         if the envelope is null.
 */
jsts.geom.Envelope.prototype.centre = function() {
  if (this.isNull()) {
    return null;
  }
  return new jsts.geom.Coordinate((this.minx + this.maxx) / 2.0,
      (this.miny + this.maxy) / 2.0);
};


/**
 * Computes the intersection of two {@link Envelopes}
 *
 * @param {jsts.geom.Envelope}
 *          env the envelope to intersect with.
 * @return {jsts.geom.Envelope} a new Envelope representing the intersection of
 *         the envelopes (this will be the null envelope if either argument is
 *         null, or they do not intersect.
 */
jsts.geom.Envelope.prototype.intersection = function(env) {
  if (this.isNull() || env.isNull() || !this.intersects(env)) {
    return new jsts.geom.Envelope();
  }

  var intMinX = this.minx > env.minx ? this.minx : env.minx;
  var intMinY = this.miny > env.miny ? this.miny : env.miny;
  var intMaxX = this.maxx < env.maxx ? this.maxx : env.maxx;
  var intMaxY = this.maxy < env.maxy ? this.maxy : env.maxy;

  return new jsts.geom.Envelope(intMinX, intMaxX, intMinY, intMaxY);
};


/**
 * Check if the region defined by input overlaps (intersects) the region of this
 * <code>Envelope</code>.
 *
 * Will call appropriate intersects* depending on arguments.
 *
 * @return {boolean} <code>true</code> if an overlap is found.
 */
jsts.geom.Envelope.prototype.intersects = function() {
  if (arguments[0] instanceof jsts.geom.Envelope) {
    return this.intersectsEnvelope(arguments[0]);
  } else if (arguments[0] instanceof jsts.geom.Coordinate) {
    return this.intersectsCoordinate(arguments[0]);
  } else {
    return this.intersectsValues(arguments[0], arguments[1]);
  }
};


/**
 * Check if the region defined by <code>other</code> overlaps (intersects) the
 * region of this <code>Envelope</code>.
 *
 * @param {jsts.geom.Envelope}
 *          other the <code>Envelope</code> which this <code>Envelope</code>
 *          is being checked for overlapping.
 * @return {boolean} <code>true</code> if the <code>Envelope</code>s
 *         overlap.
 */
jsts.geom.Envelope.prototype.intersectsEnvelope = function(other) {
  if (this.isNull() || other.isNull()) {
    return false;
  }

  var result = !(other.minx > this.maxx || other.maxx < this.minx ||
      other.miny > this.maxy || other.maxy < this.miny);
  return result;
};


/**
 * Check if the point <code>p</code> overlaps (lies inside) the region of this
 * <code>Envelope</code>.
 *
 * @param {jsts.geom.Coordinate}
 *          p the <code>Coordinate</code> to be tested.
 * @return {boolean} <code>true</code> if the point overlaps this
 *         <code>Envelope.</code>
 */
jsts.geom.Envelope.prototype.intersectsCoordinate = function(p) {
  return this.intersectsValues(p.x, p.y);
};


/**
 * Check if the point <code>(x, y)</code> overlaps (lies inside) the region of
 * this <code>Envelope</code>.
 *
 * @param {number}
 *          x the x-ordinate of the point.
 * @param {number}
 *          y the y-ordinate of the point.
 * @return {boolean} <code>true</code> if the point overlaps this
 *         <code>Envelope.</code>
 */
jsts.geom.Envelope.prototype.intersectsValues = function(x, y) {
  if (this.isNull()) {
    return false;
  }

  return !(x > this.maxx || x < this.minx || y > this.maxy || y < this.miny);
};


/**
 * Tests if the input lies wholely inside this <code>Envelope</code>
 * (inclusive of the boundary).
 *
 * Will call appropriate contains* depending on arguments.
 *
 * @return {boolean} true if input is contained in this <code>Envelope.</code>
 */
jsts.geom.Envelope.prototype.contains = function() {
  if (arguments[0] instanceof jsts.geom.Envelope) {
    return this.containsEnvelope(arguments[0]);
  } else if (arguments[0] instanceof jsts.geom.Coordinate) {
    return this.containsCoordinate(arguments[0]);
  } else {
    return this.containsValues(arguments[0], arguments[1]);
  }
};


/**
 * Tests if the <code>Envelope other</code> lies wholely inside this
 * <code>Envelope</code> (inclusive of the boundary).
 * <p>
 * Note that this is <b>not</b> the same definition as the SFS
 * <tt>contains</tt>, which would exclude the envelope boundary.
 *
 * @param {jsts.geom.Envelope}
 *          other the <code>Envelope</code> to check.
 * @return {boolean} true if <code>other</code> is contained in this
 *         <code>Envelope.</code>
 *
 * @see covers(Envelope)
 */
jsts.geom.Envelope.prototype.containsEnvelope = function(other) {
  return this.coversEnvelope(other);
};


/**
 * Tests if the given point lies in or on the envelope.
 * <p>
 * Note that this is <b>not</b> the same definition as the SFS
 * <tt>contains</tt>, which would exclude the envelope boundary.
 *
 * @param {jsts.geom.Coordinate}
 *          p the point which this <code>Envelope</code> is being checked for
 *          containing.
 * @return {boolean} <code>true</code> if the point lies in the interior or on
 *         the boundary of this <code>Envelope</code>.
 *
 * @see covers(Coordinate)
 */
jsts.geom.Envelope.prototype.containsCoordinate = function(p) {
  return this.coversCoordinate(p);
};


/**
 * Tests if the given point lies in or on the envelope.
 * <p>
 * Note that this is <b>not</b> the same definition as the SFS
 * <tt>contains</tt>, which would exclude the envelope boundary.
 *
 * @param {number}
 *          x the x-coordinate of the point which this <code>Envelope</code>
 *          is being checked for containing.
 * @param {number}
 *          y the y-coordinate of the point which this <code>Envelope</code>
 *          is being checked for containing.
 * @return {boolean} <code>true</code> if <code>(x, y)</code> lies in the
 *         interior or on the boundary of this <code>Envelope</code>.
 *
 * @see covers(double, double)
 */
jsts.geom.Envelope.prototype.containsValues = function(x, y) {
  return this.coversValues(x, y);
};


/**
 * Tests if the given point lies in or on the envelope.
 *
 * Will call appropriate contains* depending on arguments.
 */
jsts.geom.Envelope.prototype.covers = function() {
  if (arguments[0] instanceof jsts.geom.Envelope) {
    this.coversEnvelope(arguments[0]);
  } else if (arguments[0] instanceof jsts.geom.Coordinate) {
    this.coversCoordinate(arguments[0]);
  } else {
    this.coversValues(arguments[0], arguments[1]);
  }
};


/**
 * Tests if the given point lies in or on the envelope.
 *
 * @param {number}
 *          x the x-coordinate of the point which this <code>Envelope</code>
 *          is being checked for containing.
 * @param {number}
 *          y the y-coordinate of the point which this <code>Envelope</code>
 *          is being checked for containing.
 * @return {boolean} <code>true</code> if <code>(x, y)</code> lies in the
 *         interior or on the boundary of this <code>Envelope</code>.
 */
jsts.geom.Envelope.prototype.coversValues = function(x, y) {
  if (this.isNull()) {
    return false;
  }
  return x >= this.minx && x <= this.maxx && y >= this.miny && y <= this.maxy;
};


/**
 * Tests if the given point lies in or on the envelope.
 *
 * @param {jsts.geom.Coordinate}
 *          p the point which this <code>Envelope</code> is being checked for
 *          containing.
 * @return {boolean} <code>true</code> if the point lies in the interior or on
 *         the boundary of this <code>Envelope</code>.
 */
jsts.geom.Envelope.prototype.coversCoordinate = function(p) {
  return this.coversValues(p.x, p.y);
};


/**
 * Tests if the <code>Envelope other</code> lies wholely inside this
 * <code>Envelope</code> (inclusive of the boundary).
 *
 * @param {jsts.geom.Envelope}
 *          other the <code>Envelope</code> to check.
 * @return {boolean} true if this <code>Envelope</code> covers the
 *         <code>other.</code>
 */
jsts.geom.Envelope.prototype.coversEnvelope = function(other) {
  if (this.isNull() || other.isNull()) {
    return false;
  }
  return other.minx >= this.minx && other.maxx <= this.maxx &&
      other.miny >= this.miny && other.maxy <= this.maxy;
};


/**
 * Computes the distance between this and another <code>Envelope</code>.
 *
 * @param {jsts.geom.Envelope}
 *          env The <code>Envelope</code> to test this <code>Envelope</code>
 *          against.
 * @return {number} The distance between overlapping Envelopes is 0. Otherwise,
 *         the distance is the Euclidean distance between the closest points.
 */
jsts.geom.Envelope.prototype.distance = function(env) {
  if (this.intersects(env)) {
    return 0;
  }
  var dx = 0.0;
  if (this.maxx < env.minx) {
    dx = env.minx - this.maxx;
  }
  if (this.minx > env.maxx) {
    dx = this.minx - env.maxx;
  }

  var dy = 0.0;
  if (this.maxy < env.miny) {
    dy = env.miny - this.maxy;
  }
  if (this.miny > env.maxy) {
    dy = this.miny - env.maxy;
  }

  // if either is zero, the envelopes overlap either vertically or horizontally
  if (dx === 0.0) {
    return dy;
  }
  if (dy === 0.0) {
    return dx;
  }
  return Math.sqrt(dx * dx + dy * dy);
};


/**
 * @param {jsts.geom.Envelope}
 *          other the <code>Envelope</code> to check against.
 * @return {boolean} true if envelopes are equal.
 */
jsts.geom.Envelope.prototype.equals = function(other) {
  if (this.isNull()) {
    return other.isNull();
  }
  return this.maxx === other.maxx && this.maxy === other.maxy &&
      this.minx === other.minx && this.miny === other.miny;
};


/**
 * @return {string} String representation of this <code>Envelope.</code>
 */
jsts.geom.Envelope.prototype.toString = function() {
  return 'Env[' + this.minx + ' : ' + this.maxx + ', ' + this.miny + ' : ' +
      this.maxy + ']';
};


/**
 * Test the point q to see whether it intersects the Envelope defined by p1-p2
 *
 * NOTE: calls intersectsEnvelope if four arguments are given to simulate
 * overloaded function
 *
 * @param {jsts.geom.Coordinate}
 *          p1 one extremal point of the envelope.
 * @param {jsts.geom.Coordinate}
 *          p2 another extremal point of the envelope.
 * @param {jsts.geom.Coordinate}
 *          q the point to test for intersection.
 * @return {boolean} <code>true</code> if q intersects the envelope p1-p2.
 */
jsts.geom.Envelope.intersects = function(p1, p2, q) {
  if (arguments.length === 4) {
    return jsts.geom.Envelope.intersectsEnvelope(arguments[0], arguments[1],
        arguments[2], arguments[3]);
  }

  var xc1 = p1.x < p2.x ? p1.x : p2.x;
  var xc2 = p1.x > p2.x ? p1.x : p2.x;
  var yc1 = p1.y < p2.y ? p1.y : p2.y;
  var yc2 = p1.y > p2.y ? p1.y : p2.y;

  if (((q.x >= xc1) && (q.x <= xc2)) && ((q.y >= yc1) && (q.y <= yc2))) {
    return true;
  }
  return false;
};


/**
 * Test the envelope defined by p1-p2 for intersection with the envelope defined
 * by q1-q2
 *
 * @param {jsts.geom.Coordinate}
 *          p1 one extremal point of the envelope P.
 * @param {jsts.geom.Coordinate}
 *          p2 another extremal point of the envelope P.
 * @param {jsts.geom.Coordinate}
 *          q1 one extremal point of the envelope Q.
 * @param {jsts.geom.Coordinate}
 *          q2 another extremal point of the envelope Q.
 * @return {boolean} <code>true</code> if Q intersects P.
 */
jsts.geom.Envelope.intersectsEnvelope = function(p1, p2, q1, q2) {
  var minq = Math.min(q1.x, q2.x);
  var maxq = Math.max(q1.x, q2.x);
  var minp = Math.min(p1.x, p2.x);
  var maxp = Math.max(p1.x, p2.x);

  if (minp > maxq) {
    return false;
  }
  if (maxp < minq) {
    return false;
  }

  minq = Math.min(q1.y, q2.y);
  maxq = Math.max(q1.y, q2.y);
  minp = Math.min(p1.y, p2.y);
  maxp = Math.max(p1.y, p2.y);

  if (minp > maxq) {
    return false;
  }
  if (maxp < minq) {
    return false;
  }
  return true;
};


/**
 * @return {jsts.geom.Envelope} A new instance copied from this.
 */
jsts.geom.Envelope.prototype.clone = function() {
  return new jsts.geom.Envelope(this.minx, this.maxx, this.miny, this.maxy);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/Coordinate.js
 * @requires jsts/algorithm/CGAlgorithms.js
 * @requires jsts/algorithm/RobustLineIntersector.js
 * @requires jsts/algorithm/HCoordinate.js
 */

/**
 * Represents a line segment defined by two {@link Coordinate}s. Provides
 * methods to compute various geometric properties and relationships of line
 * segments.
 * <p>
 * This class is designed to be easily mutable (to the extent of having its
 * contained points public). This supports a common pattern of reusing a single
 * LineSegment object as a way of computing segment properties on the segments
 * defined by arrays or lists of {@link Coordinate}s.
 *
 * @param {Coordinate}
 *          p0
 * @param {Coordinate}
 *          p1
 * @constructor
 */
jsts.geom.LineSegment = function () {
    if (arguments.length === 0) {
        this.p0 = new jsts.geom.Coordinate();
        this.p1 = new jsts.geom.Coordinate();
    } else if (arguments.length === 1) {
        this.p0 = arguments[0].p0;
        this.p1 = arguments[0].p1;
    } else if (arguments.length === 2) {
        this.p0 = arguments[0];
        this.p1 = arguments[1];
    } else if (arguments.length === 4) {
        this.p0 = new jsts.geom.Coordinate(arguments[0], arguments[1]);
        this.p1 = new jsts.geom.Coordinate(arguments[2], arguments[3]);
    }
};

/**
 * @type {Coordinate}
 */
jsts.geom.LineSegment.prototype.p0 = null;


/**
 * @type {Coordinate}
 */
jsts.geom.LineSegment.prototype.p1 = null;

/**
 * Computes the midpoint of a segment
 *
 * @param {jsts.geom.Coordinate} p0
 * @param {jsts.geom.Coordinate} p1
 * @return {jsts.geom.Coordinate} the midpoint of the segment
 */
jsts.geom.LineSegment.midPoint = function (p0, p1) {
    return new jsts.geom.Coordinate((p0.x + p1.x) / 2, (p0.y + p1.y) / 2);
};

/**
 * @param {number} i
 * @return {jsts.geom.Coordinate}
 */
jsts.geom.LineSegment.prototype.getCoordinate = function (i) {
    if (i === 0) return this.p0;
    return this.p1;
};

/**
 * Computes the length of the line segment.
 *
 * @return {number} the length of the line segment.
 */
jsts.geom.LineSegment.prototype.getLength = function () {
    return this.p0.distance(this.p1);
};

/**
 * Tests whether the segment is horizontal.
 *
 * @return {boolean} <code>true</code> if the segment is horizontal.
 */
jsts.geom.LineSegment.prototype.isHorizontal = function () {
    return this.p0.y === this.p1.y;
};
/**
 * Tests whether the segment is vertical.
 *
 * @return {boolean} <code>true</code> if the segment is vertical.
 */
jsts.geom.LineSegment.prototype.isVertical = function () {
    return this.p0.x === this.p1.x;
};

jsts.geom.LineSegment.prototype.orientationIndex = function (arg) {
    if (arg instanceof jsts.geom.LineSegment) {
        return this.orientationIndex1(arg);
    } else if (arg instanceof jsts.geom.Coordinate) {
        return this.orientationIndex2(arg);
    }
};

/**
  * Determines the orientation of a LineSegment relative to this segment.
  * The concept of orientation is specified as follows:
  * Given two line segments A and L,
  * <ul>
  * <li>A is to the left of a segment L if A lies wholly in the
  * closed half-plane lying to the left of L
  * <li>A is to the right of a segment L if A lies wholly in the
  * closed half-plane lying to the right of L
  * <li>otherwise, A has indeterminate orientation relative to L. This
  * happens if A is collinear with L or if A crosses the line determined by L.
  * </ul>
  *
  * @param {jsts.geom.LineSegment} seg the LineSegment to compare
  *
  * @return 1 if <code>seg</code> is to the left of this segment<br />
  * -1 if <code>seg</code> is to the right of this segment<br />
  * 0 if <code>seg</code> has indeterminate orientation relative to this segment
  */
jsts.geom.LineSegment.prototype.orientationIndex1 = function (seg) {
    var orient0 = jsts.algorithm.CGAlgorithms.orientationIndex(this.p0, this.p1, seg.p0);
    var orient1 = jsts.algorithm.CGAlgorithms.orientationIndex(this.p0, this.p1, seg.p1);
    // this handles the case where the points are L or collinear
    if (orient0 >= 0 && orient1 >= 0) {
        return Math.max(orient0, orient1);
    }
    // this handles the case where the points are R or collinear
    if (orient0 <= 0 && orient1 <= 0) {
        return Math.max(orient0, orient1);
    }
    // points lie on opposite sides ==> indeterminate orientation
    return 0;
};

/**
 * Determines the orientation index of a {@link Coordinate} relative to this segment.
 * The orientation index is as defined in {@link CGAlgorithms#computeOrientation}.
 *
 * @param {jsts.geom.Coordinate} p the coordinate to compare
 *
 * @return 1 (LEFT) if <code>p</code> is to the left of this segment
 * @return -1 (RIGHT) if <code>p</code> is to the right of this segment
 * @return 0 (COLLINEAR) if <code>p</code> is collinear with this segment
 *
 * @see CGAlgorithms#computeOrientation(Coordinate, Coordinate, Coordinate)
 */
jsts.geom.LineSegment.prototype.orientationIndex2 = function (p) {
    return jsts.algorithm.CGAlgorithms.orientationIndex(this.p0, this.p1, p);
};

/**
 * Reverses the direction of the line segment.
 */
jsts.geom.LineSegment.prototype.reverse = function () {
    var temp = this.p0;
    this.p0 = this.p1;
    this.p1 = temp;
};

/**
 * Puts the line segment into a normalized form.
 * This is useful for using line segments in maps and indexes when
 * topological equality rather than exact equality is desired.
 * A segment in normalized form has the first point smaller
 * than the second (according to the standard ordering on {@link Coordinate}).
 */
jsts.geom.LineSegment.prototype.normalize = function () {
    if (this.p1.compareTo(this.p0) < 0) this.reverse();
};

/**
 * Computes the angle that the vector defined by this segment
 * makes with the X-axis.
 * The angle will be in the range [ -PI, PI ] radians.
 *
 * @return {number} the angle this segment makes with the X-axis (in radians)
 */
jsts.geom.LineSegment.prototype.angle = function () {
    return Math.atan2(this.p1.y - this.p0.y, this.p1.x - this.p0.x);
};

/**
 * Computes the midpoint of the segment
 *
 * @return {jsts.geom.Coordinate} the midpoint of the segment
 */
jsts.geom.LineSegment.prototype.midPoint = function () {
    return jsts.geom.LineSegment.midPoint(this.p0, this.p1);
};

jsts.geom.LineSegment.prototype.distance = function (arg) {
    if (arg instanceof jsts.geom.LineSegment) {
        return this.distance1(arg);
    } else if (arg instanceof jsts.geom.Coordinate) {
        return this.distance2(arg);
    }
};

/**
 * Computes the distance between this line segment and another segment.
 *
 * @param {jsts.geom.LineSegment} ls
 * @return {number} the distance to the other segment
 */
jsts.geom.LineSegment.prototype.distance1 = function (ls) {
    return jsts.algorithm.CGAlgorithms.distanceLineLine(this.p0, this.p1, ls.p0, ls.p1);
};

/**
 * Computes the distance between this line segment and a given point.
 *
 * @param {jsts.geom.Coordinate}
 *          p the coordinate.
 * @return {number}
 *          the distance from this segment to the given point.
 */
jsts.geom.LineSegment.prototype.distance2 = function (p) {
    return jsts.algorithm.CGAlgorithms.distancePointLine(p, this.p0, this.p1);
};

/**
 * Computes the {@link Coordinate} that lies a given
 * fraction along the line defined by this segment.
 * A fraction of <code>0.0</code> returns the start point of the segment;
 * a fraction of <code>1.0</code> returns the end point of the segment.
 * If the fraction is < 0.0 or > 1.0 the point returned
 * will lie before the start or beyond the end of the segment.
 *
 * @param {number} segmentLengthFraction the fraction of the segment length along the line
 * @return {jsts.geom.Coordinate} the point at that distance
 */
jsts.geom.LineSegment.prototype.pointAlong = function (segmentLengthFraction) {
    var coord = new jsts.geom.Coordinate();
    coord.x = this.p0.x + segmentLengthFraction * (this.p1.x - this.p0.x);
    coord.y = this.p0.y + segmentLengthFraction * (this.p1.y - this.p0.y);
    return coord;
};

/**
 * Computes the {@link Coordinate} that lies a given
 * fraction along the line defined by this segment and offset from
 * the segment by a given distance.
 * A fraction of <code>0.0</code> offsets from the start point of the segment;
 * a fraction of <code>1.0</code> offsets from the end point of the segment.
 * The computed point is offset to the left of the line if the offset distance is
 * positive, to the right if negative.
 *
 * @param {number} segmentLengthFraction the fraction of the segment length along the line
 * @param {number} offsetDistance the distance the point is offset from the segment
 *    (positive is to the left, negative is to the right)
 * @return {jsts.geom.Coordinate} the point at that distance and offset
 */
jsts.geom.LineSegment.prototype.pointAlongOffset = function (segmentLengthFraction, offsetDistance) {
    // the point on the segment line
    var segx = this.p0.x + segmentLengthFraction * (this.p1.x - this.p0.x);
    var segy = this.p0.y + segmentLengthFraction * (this.p1.y - this.p0.y);

    var dx = this.p1.x - this.p0.x;
    var dy = this.p1.y - this.p0.y;
    var len = Math.sqrt(dx * dx + dy * dy);
    var ux = 0;
    var uy = 0;
    if (offsetDistance !== 0) {
        if (len <= 0) {
            throw "Cannot compute offset from zero-length line segment";
        }

        // u is the vector that is the length of the offset, in the direction of the segment
        ux = offsetDistance * dx / len;
        uy = offsetDistance * dy / len;
    }

    // the offset point is the seg point plus the offset vector rotated 90 degrees CCW
    var offsetx = segx - uy;
    var offsety = segy + ux;

    var coord = new jsts.geom.Coordinate(offsetx, offsety);
    return coord;
};

/**
 * Computes the Projection Factor for the projection of the point p onto this
 * LineSegment. The Projection Factor is the constant r by which the vector for
 * this segment must be multiplied to equal the vector for the projection of
 * <tt>p<//t> on the line
 * defined by this segment.
 * <p>
 * The projection factor returned will be in the range <tt>(-inf, +inf)</tt>.
 *
 * @param {Coordinate} p the point to compute the factor for.
 * @return {double} the projection factor for the point.
 */
jsts.geom.LineSegment.prototype.projectionFactor = function (p) {
    if (p.equals(this.p0))
        return 0.0;
    if (p.equals(this.p1))
        return 1.0;
    // Otherwise, use comp.graphics.algorithms Frequently Asked Questions method
    /*            AC dot AB
                   r = ---------
                         ||AB||^2
                r has the following meaning:
                r=0 P = A
                r=1 P = B
                r<0 P is on the backward extension of AB
                r>1 P is on the forward extension of AB
                0<r<1 P is interior to AB
        */
    var dx = this.p1.x - this.p0.x;
    var dy = this.p1.y - this.p0.y;
    var len2 = dx * dx + dy * dy;
    var r = ((p.x - this.p0.x) * dx + (p.y - this.p0.y) * dy) / len2;
    return r;
};

/**
 * Computes the fraction of distance (in <tt>[0.0, 1.0]</tt>)
 * that the projection of a point occurs along this line segment.
 * If the point is beyond either ends of the line segment,
 * the closest fractional value (<tt>0.0</tt> or <tt>1.0</tt>) is returned.
 * <p>
 * Essentially, this is the {@link #projectionFactor} clamped to
 * the range <tt>[0.0, 1.0]</tt>.
 * If the segment has zero length, 1.0 is returned.
 *
 * @param {jsts.geom.Coordinate} inputPt the point
 * @return {number} the fraction along the line segment the projection of the point occurs
 */
jsts.geom.LineSegment.prototype.segmentFraction = function (inputPt) {
    var segFrac = this.projectionFactor(inputPt);
    if (segFrac < 0) {
        segFrac = 0;
    } else if (segFrac > 1 || isNaN(segFrac)) {
        segFrac = 1;
    }
    return segFrac;
};

jsts.geom.LineSegment.prototype.project = function (arg) {
    if (arg instanceof jsts.geom.Coordinate) {
        return this.project1(arg);
    } else if (arg instanceof jsts.geom.LineSegment) {
        return this.project2(arg);
    }
};

/**
 * Compute the projection of a point onto the line determined
 * by this line segment.
 * <p>
 * Note that the projected point
 * may lie outside the line segment.  If this is the case,
 * the projection factor will lie outside the range [0.0, 1.0].
 * @param {jsts.geom.Coordinate} p
 * @return {jsts.geom.Coordinate}
 */
jsts.geom.LineSegment.prototype.project1 = function (p) {
    if (p.equals(this.p0) || p.equals(this.p1)) {
        return new jsts.geom.Coordinate(p);
    }

    var r = this.projectionFactor(p);
    var coord = new jsts.geom.Coordinate();
    coord.x = this.p0.x + r * (this.p1.x - this.p0.x);
    coord.y = this.p0.y + r * (this.p1.y - this.p0.y);
    return coord;
};

/**
 * Project a line segment onto this line segment and return the resulting
 * line segment.  The returned line segment will be a subset of
 * the target line line segment.  This subset may be null, if
 * the segments are oriented in such a way that there is no projection.
 * <p>
 * Note that the returned line may have zero length (i.e. the same endpoints).
 * This can happen for instance if the lines are perpendicular to one another.
 *
 * @param {jsts.geom.LineSegment} seg the line segment to project
 * @return {jsts.geom.LineSegment} the projected line segment, or <code>null</code> if there is no overlap
 */
jsts.geom.LineSegment.prototype.project2 = function (seg) {
    var pf0 = this.projectionFactor(seg.p0);
    var pf1 = this.projectionFactor(seg.p1);
    // check if segment projects at all
    if (pf0 >= 1 && pf1 >= 1) return null;
    if (pf0 <= 0 && pf1 <= 0) return null;

    var newp0 = this.project(seg.p0);
    if (pf0 < 0) newp0 = p0;
    if (pf0 > 1) newp0 = p1;

    var newp1 = this.project(seg.p1);
    if (pf1 < 0.0) newp1 = p0;
    if (pf1 > 1.0) newp1 = p1;

    return new jsts.geom.LineSegment(newp0, newp1);
};

/**
 * Computes the closest point on this line segment to another point.
 *
 * @param {Coordinate}
 *          p the point to find the closest point to.
 * @return {Coordinate} a Coordinate which is the closest point on the line
 *         segment to the point p.
 */
jsts.geom.LineSegment.prototype.closestPoint = function (p) {
    var factor = this.projectionFactor(p);
    if (factor > 0 && factor < 1) {
        return this.project(p);
    }
    var dist0 = this.p0.distance(p);
    var dist1 = this.p1.distance(p);
    if (dist0 < dist1)
        return this.p0;
    return this.p1;
};


/**
 * Computes the closest points on two line segments.
 *
 * @param {LineSegment}
 *          line the segment to find the closest point to.
 * @return {[]} a pair of Coordinates which are the closest points on the line
 *         segments.
 */
jsts.geom.LineSegment.prototype.closestPoints = function (line) {
    // test for intersection
    var intPt = this.intersection(line);
    if (intPt !== null) {
        return [intPt, intPt];
    }

    /**
     * if no intersection closest pair contains at least one endpoint. Test each
     * endpoint in turn.
     */
    var closestPt = [];
    var minDistance = Number.MAX_VALUE;
    var dist;

    var close00 = this.closestPoint(line.p0);
    minDistance = close00.distance(line.p0);
    closestPt[0] = close00;
    closestPt[1] = line.p0;

    var close01 = this.closestPoint(line.p1);
    dist = close01.distance(line.p1);
    if (dist < minDistance) {
        minDistance = dist;
        closestPt[0] = close01;
        closestPt[1] = line.p1;
    }

    var close10 = line.closestPoint(this.p0);
    dist = close10.distance(this.p0);
    if (dist < minDistance) {
        minDistance = dist;
        closestPt[0] = this.p0;
        closestPt[1] = close10;
    }

    var close11 = line.closestPoint(this.p1);
    dist = close11.distance(this.p1);
    if (dist < minDistance) {
        minDistance = dist;
        closestPt[0] = this.p1;
        closestPt[1] = close11;
    }

    return closestPt;
};


/**
 * Computes an intersection point between two line segments, if there is one.
 * There may be 0, 1 or many intersection points between two segments. If there
 * are 0, null is returned. If there is 1 or more, exactly one of them is
 * returned (chosen at the discretion of the algorithm). If more information is
 * required about the details of the intersection, the
 * {@link RobustLineIntersector} class should be used.
 *
 * @param {LineSegment}
 *          line a line segment.
 * @return {Coordinate} an intersection point, or <code>null</code> if there
 *         is none.
 *
 * @see RobustLineIntersector
 */
jsts.geom.LineSegment.prototype.intersection = function (line) {
    var li = new jsts.algorithm.RobustLineIntersector();
    li.computeIntersection(this.p0, this.p1, line.p0, line.p1);
    if (li.hasIntersection())
        return li.getIntersection(0);
    return null;
};

jsts.geom.LineSegment.prototype.setCoordinates = function (ls) {
    if (ls instanceof jsts.geom.Coordinate) {
        this.setCoordinates2.apply(this, arguments);
        return;
    }

    this.setCoordinates2(ls.p0, ls.p1);
};

jsts.geom.LineSegment.prototype.setCoordinates2 = function (p0, p1) {
    this.p0.x = p0.x;
    this.p0.y = p0.y;
    this.p1.x = p1.x;
    this.p1.y = p1.y;
};

/**
 * Computes the perpendicular distance between the (infinite) line defined
 * by this line segment and a point.
 *
 * @param {jsts.geom.Coordinate} p the coordinate
 * @return {number} the perpendicular distance between the defined line and the given point
 */
jsts.geom.LineSegment.prototype.distancePerpendicular = function (p) {
    return jsts.algorithm.CGAlgorithms.distancePointLinePerpendicular(p, this.p0, this.p1);
};

/**
 * Computes the intersection point of the lines of infinite extent defined
 * by two line segments (if there is one).
 * There may be 0, 1 or an infinite number of intersection points
 * between two lines.
 * If there is a unique intersection point, it is returned.
 * Otherwise, <tt>null</tt> is returned.
 * If more information is required about the details of the intersection,
 * the {@link RobustLineIntersector} class should be used.
 *
 * @param {jsts.geom.LineSegment} line a line segment defining an straight line with infinite extent
 * @return {jsts.geom.Coordinate} an intersection point,
 * or <code>null</code> if there is no point of intersection
 * or an infinite number of intersection points
 *
 * @see RobustLineIntersector
 */
jsts.geom.LineSegment.prototype.lineIntersection = function (line) {
    try {
        var intPt = jsts.algorithm.HCoordinate.intersection(this.p0, this.p1, line.p0, line.p1);
        return intPt;
    } catch (ex) {
        // eat this exception, and return null;
    }
    return null;
};

/**
 * Creates a LineString with the same coordinates as this segment
 *
 * @param {jsts.geom.GeometryFactory} geomFactory the geometery factory to use
 * @return {jsts.geom.LineString} a LineString with the same geometry as this segment
 */
jsts.geom.LineSegment.prototype.toGeometry = function (geomFactory) {
    return geomFactory.createLineString([this.p0, this.p1]);
};

/**
 *  Returns <code>true</code> if <code>other</code> has the same values for
 *  its points.
 *
 * @param {Object} o a <code>LineSegment</code> with which to do the comparison.
 * @return {boolean} <code>true</code> if <code>other</code> is a <code>LineSegment</code>
 *      with the same values for the x and y ordinates.
 */
jsts.geom.LineSegment.prototype.equals = function (o) {
    if (!(o instanceof jsts.geom.LineSegment)) {
        return false;
    }
    return this.p0.equals(o.p0) && this.p1.equals(o.p1);
};

/**
 *  Compares this object with the specified object for order.
 *  Uses the standard lexicographic ordering for the points in the LineSegment.
 *
 *@param {Object} o  the <code>LineSegment</code> with which this <code>LineSegment</code>
 *      is being compared
 *@return {number} a negative integer, zero, or a positive integer as this <code>LineSegment</code>
 *      is less than, equal to, or greater than the specified <code>LineSegment</code>
 */
jsts.geom.LineSegment.prototype.compareTo = function (o) {
    var comp0 = this.p0.compareTo(o.p0);
    if (comp0 !== 0) return comp0;
    return this.p1.compareTo(o.p1);
};

/**
 *  Returns <code>true</code> if <code>other</code> is
 *  topologically equal to this LineSegment (e.g. irrespective
 *  of orientation).
 *
 * @param {jsts.geom.LineSegment} other  a <code>LineSegment</code> with which to do the comparison.
 * @return {boolean} <code>true</code> if <code>other</code> is a <code>LineSegment</code>
 *      with the same values for the x and y ordinates.
 */
jsts.geom.LineSegment.prototype.equalsTopo = function (other) {
    return this.p0.equals(other.p0) && this.p1.equals(other.p1)
        || this.p0.equals(other.p1) && this.p1.equals(other.p0);
};

jsts.geom.LineSegment.prototype.toString = function () {
    return "LINESTRING(" +
        this.p0.x + " " + this.p0.y
        + ", " +
        this.p1.x + " " + this.p1.y + ")";
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/Envelope.js
 * @requires jsts/geom/LineSegment.js
 */

/**
 * The action for the internal iterator for performing overlap queries on a
 * MonotoneChain
 *
 * @constructor
 */
jsts.index.chain.MonotoneChainOverlapAction = function() {
  this.tempEnv1 = new jsts.geom.Envelope();
  this.tempEnv2 = new jsts.geom.Envelope();
  this.overlapSeg1 = new jsts.geom.LineSegment();
  this.overlapSeg2 = new jsts.geom.LineSegment();
};

// these envelopes are used during the MonotoneChain search process
jsts.index.chain.MonotoneChainOverlapAction.prototype.tempEnv1 = null;
jsts.index.chain.MonotoneChainOverlapAction.prototype.tempEnv2 = null;

jsts.index.chain.MonotoneChainOverlapAction.prototype.overlapSeg1 = null;
jsts.index.chain.MonotoneChainOverlapAction.prototype.overlapSeg2 = null;

/**
 * This function can be overridden if the original chains are needed
 *
 * @param start1
 *          the index of the start of the overlapping segment from mc1.
 * @param start2
 *          the index of the start of the overlapping segment from mc2.
 */
jsts.index.chain.MonotoneChainOverlapAction.prototype.overlap = function(mc1,
    start1, mc2, start2) {
  this.mc1.getLineSegment(start1, this.overlapSeg1);
  this.mc2.getLineSegment(start2, this.overlapSeg2);
  this.overlap2(this.overlapSeg1, this.overlapSeg2);
};

/**
 * This is a convenience function which can be overridden to obtain the actual
 * line segments which overlap
 *
 * @param seg1
 * @param seg2
 */
jsts.index.chain.MonotoneChainOverlapAction.prototype.overlap2 = function(seg1,
    seg2) {
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * Computes all intersections between segments in a set of
   * {@link SegmentString}s. Intersections found are represented as
   * {@link SegmentNode}s and added to the {@link SegmentString}s in which
   * they occur. As a final step in the noding a new set of segment strings
   * split at the nodes may be returned.
   *
   * @interface
   */
  jsts.noding.Noder = function() {

  };


  /**
   * Computes the noding for a collection of {@link SegmentString}s. Some
   * Noders may add all these nodes to the input SegmentStrings; others may only
   * add some or none at all.
   *
   * @param {Array}
   *          segStrings a collection of {@link SegmentString}s to node.
   */
  jsts.noding.Noder.prototype.computeNodes = jsts.abstractFunc;

  /**
   * Returns a {@link Collection} of fully noded {@link SegmentString}s. The
   * SegmentStrings have the same context as their parent.
   *
   * @return {Array} a Collection of SegmentStrings.
   */
  jsts.noding.Noder.prototype.getNodedSubstrings = jsts.abstractFunc;

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/noding/Noder.js
   */

  var Noder = jsts.noding.Noder;


  /**
   * Base class for {@link Noder}s which make a single pass to find
   * intersections. This allows using a custom {@link SegmentIntersector} (which
   * for instance may simply identify intersections, rather than insert them).
   *
   * @interface
   */
  jsts.noding.SinglePassNoder = function() {

  };


  jsts.noding.SinglePassNoder.prototype = new Noder();
  jsts.noding.SinglePassNoder.constructor = jsts.noding.SinglePassNoder;


  /**
   * @type {SegmentIntersector}
   * @protected
   */
  jsts.noding.SinglePassNoder.prototype.segInt = null;

  /**
   * Sets the SegmentIntersector to use with this noder. A SegmentIntersector
   * will normally add intersection nodes to the input segment strings, but it
   * may not - it may simply record the presence of intersections. However, some
   * Noders may require that intersections be added.
   *
   * @param {SegmentIntersector}
   *          segInt
   */
  jsts.noding.SinglePassNoder.prototype.setSegmentIntersector = function(segInt) {
    this.segInt = segInt;
  };

})();

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * A spatial object in an AbstractSTRtree.
 *
 * @version 1.7
 */



/**
 * @constructor
 * @interface
 */
jsts.index.strtree.Boundable = function() {

};


/**
 * Returns a representation of space that encloses this Boundable, preferably
 * not much bigger than this Boundable's boundary yet fast to test for intersection
 * with the bounds of other Boundables. The class of object returned depends
 * on the subclass of AbstractSTRtree.
 *
 * @return {Object} an Envelope (for STRtrees), an Interval (for SIRtrees), or other object
 * (for other subclasses of AbstractSTRtree).
 * @see jsts.index.strtree.AbstractSTRtree.IntersectsOp
 * @public
 */
jsts.index.strtree.Boundable.prototype.getBounds = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Boundable wrapper for a non-Boundable spatial object. Used internally by
 * AbstractSTRtree.
 *
 * @requires jsts/index/strtree/Boundable.js
 */



/**
 * @param {Object} bounds
 * @param {Object} item
 * @extends {jsts.index.strtree.Boundable}
 * @constructor
 */
jsts.index.strtree.ItemBoundable = function(bounds, item) {
  this.bounds = bounds;
  this.item = item;
};

jsts.index.strtree.ItemBoundable.prototype = new jsts.index.strtree.Boundable();
jsts.index.strtree.ItemBoundable.constructor = jsts.index.strtree.ItemBoundable;


/**
 * @type {Object}
 * @private
 */
jsts.index.strtree.ItemBoundable.prototype.bounds = null;


/**
 * @type {Object}
 * @private
 */
jsts.index.strtree.ItemBoundable.prototype.item = null;


/**
 * @return {Object}
 * @public
 */
jsts.index.strtree.ItemBoundable.prototype.getBounds = function() {
  return this.bounds;
};


/**
 * @return {Object}
 * @public
 */
jsts.index.strtree.ItemBoundable.prototype.getItem = function() {
  return this.item;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Base class for STRtree and SIRtree. STR-packed R-trees are described in:
 * P. Rigaux, Michel Scholl and Agnes Voisard. Spatial Databases With
 * Application To GIS. Morgan Kaufmann, San Francisco, 2002.
 * <p>
 * This implementation is based on Boundables rather than just AbstractNodes,
 * because the STR algorithm operates on both nodes and
 * data, both of which are treated here as Boundables.
 *
 * @see STRtree
 * @see SIRtree
 */



/**
 * Constructs an AbstractSTRtree with the specified maximum number of child
 * nodes that a node may have
 *
 * @param {Integer}
 *          nodeCapacity
 *
 * @constuctor
 */
jsts.index.strtree.AbstractSTRtree = function(nodeCapacity) {
  if (nodeCapacity === undefined)
    return;

  this.itemBoundables = [];

  jsts.util.Assert.isTrue(nodeCapacity > 1, 'Node capacity must be greater than 1');
  this.nodeCapacity = nodeCapacity;
};



/**
 * A test for intersection between two bounds, necessary because subclasses of
 * AbstractSTRtree have different implementations of bounds.
 *
 * @interface
 * @constructor
 * @public
 */
jsts.index.strtree.AbstractSTRtree.IntersectsOp = function() {

};


/**
 * For STRtrees, the bounds will be Envelopes; for SIRtrees, Intervals; for
 * other subclasses of AbstractSTRtree, some other class.
 *
 * @param {Object}
 *          aBounds the bounds of one spatial object.
 * @param {Object}
 *          bBounds the bounds of another spatial object.
 * @return {boolean} whether the two bounds intersect.
 */
jsts.index.strtree.AbstractSTRtree.IntersectsOp.prototype.intersects = function(
    aBounds, bBounds) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * @type {jsts.index.strtree.AbstractNode}
 * @protected
 */
jsts.index.strtree.AbstractSTRtree.prototype.root = null;


/**
 * @type {boolean}
 * @private
 */
jsts.index.strtree.AbstractSTRtree.prototype.built = false;


/**
 * @type {Array}
 * @private
 */
jsts.index.strtree.AbstractSTRtree.prototype.itemBoundables = null;


/**
 * @type {number}
 * @private
 */
jsts.index.strtree.AbstractSTRtree.prototype.nodeCapacity = null;


/**
 * Creates parent nodes, grandparent nodes, and so forth up to the root node,
 * for the data that has been inserted into the tree. Can only be called once,
 * and thus can be called only after all of the data has been inserted into the
 * tree.
 */
jsts.index.strtree.AbstractSTRtree.prototype.build = function() {
  jsts.util.Assert.isTrue(!this.built);
  this.root = this.itemBoundables.length === 0 ? this.createNode(0) : this
      .createHigherLevels(this.itemBoundables, -1);
  this.built = true;
};


/**
 * @param {number}
 *          level
 * @return {jsts.index.strtree.AbstractNode}
 */
jsts.index.strtree.AbstractSTRtree.prototype.createNode = function(level) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Sorts the childBoundables then divides them into groups of size M, where M is
 * the node capacity.
 */
jsts.index.strtree.AbstractSTRtree.prototype.createParentBoundables = function(
    childBoundables, newLevel) {
  jsts.util.Assert.isTrue(!(childBoundables.length === 0));
  var parentBoundables = [];
  parentBoundables.push(this.createNode(newLevel));
  var sortedChildBoundables = [];
  for (var i = 0; i < childBoundables.length; i++) {
    sortedChildBoundables.push(childBoundables[i]);
  }
  sortedChildBoundables.sort(this.getComparator());
  for (var i = 0; i < sortedChildBoundables.length; i++) {
    var childBoundable = sortedChildBoundables[i];
    if (this.lastNode(parentBoundables).getChildBoundables().length === this
        .getNodeCapacity()) {
      parentBoundables.push(this.createNode(newLevel));
    }
    this.lastNode(parentBoundables).addChildBoundable(childBoundable);
  }
  return parentBoundables;
};


/**
 * @param {Array}
 *          nodes
 * @return {jsts.index.strtree.AbstractNode}
 */
jsts.index.strtree.AbstractSTRtree.prototype.lastNode = function(nodes) {
  return nodes[nodes.length - 1];
};


/**
 * @param {number}
 *          a
 * @param {number}
 *          b
 * @return {number}
 */
jsts.index.strtree.AbstractSTRtree.prototype.compareDoubles = function(a, b) {
  return a > b ? 1 : a < b ? -1 : 0;
};


/**
 * Creates the levels higher than the given level
 *
 * @param {Array}
 *          boundablesOfALevel the level to build on.
 * @param {number}
 *          level the level of the Boundables, or -1 if the boundables are item
 *          boundables (that is, below level 0).
 * @return {jsts.index.strtree.AbstractNode} the root, which may be a ParentNode
 *         or a LeafNode.
 * @private
 */
jsts.index.strtree.AbstractSTRtree.prototype.createHigherLevels = function(
    boundablesOfALevel, level) {
  jsts.util.Assert.isTrue(!(boundablesOfALevel.length === 0));
  var parentBoundables = this.createParentBoundables(boundablesOfALevel,
      level + 1);
  if (parentBoundables.length === 1) {
    return parentBoundables[0];
  }
  return this.createHigherLevels(parentBoundables, level + 1);
};


/**
 * @return {jsts.index.strtree.AbstractNode}
 */
jsts.index.strtree.AbstractSTRtree.prototype.getRoot = function() {
  if (!this.built)
    this.build();
  return this.root;
};


/**
 * Returns the maximum number of child nodes that a node may have
 *
 * return {number}
 */
jsts.index.strtree.AbstractSTRtree.prototype.getNodeCapacity = function() {
  return this.nodeCapacity;
};


/**
 * @return {number}
 */
jsts.index.strtree.AbstractSTRtree.prototype.size = function() {
  if (arguments.length === 1) {
    return this.size2(arguments[0]);
  }

  if (!this.built) {
    this.build();
  }
  if (this.itemBoundables.length === 0) {
    return 0;
  }
  return this.size2(root);
};

/**
 * @param {jsts.index.strtree.AbstractNode=}
 *          [node].
 * @return {number}
 */
jsts.index.strtree.AbstractSTRtree.prototype.size2 = function(node) {
  var size = 0;
  var childBoundables = node.getChildBoundables();
  for (var i = 0; i < childBoundables.length; i++) {
    var childBoundable = childBoundables[i];
    if (childBoundable instanceof jsts.index.strtree.AbstractNode) {
      size += this.size(childBoundable);
    } else if (childBoundable instanceof jsts.index.strtree.ItemBoundable) {
      size += 1;
    }
  }
  return size;
};


/**
 * @return {number}
 */
jsts.index.strtree.AbstractSTRtree.prototype.depth = function() {
  if (arguments.length === 1) {
    return this.depth2(arguments[0]);
  }

  if (!this.built) {
    this.build();
  }
  if (this.itemBoundables.length === 0) {
    return 0;
  }
  return this.depth2(root);
};

/**
 * @param {jsts.index.strtree.AbstractNode}
 *          [node].
 * @return {number}
 */
jsts.index.strtree.AbstractSTRtree.prototype.depth2 = function() {
  var maxChildDepth = 0;
  var childBoundables = node.getChildBoundables();
  for (var i = 0; i < childBoundables.length; i++) {
    var childBoundable = childBoundables[i];
    if (childBoundable instanceof jsts.index.strtree.AbstractNode) {
      var childDepth = this.depth(childBoundable);
      if (childDepth > maxChildDepth)
        maxChildDepth = childDepth;
    }
  }
  return maxChildDepth + 1;
};


/**
 *
 * @param {Object}
 *          bounds
 * @param {Object}
 *          item
 */
jsts.index.strtree.AbstractSTRtree.prototype.insert = function(bounds, item) {
  jsts.util.Assert.isTrue(!this.built, 'Cannot insert items into an STR packed R-tree after it has been built.');
  this.itemBoundables.push(new jsts.index.strtree.ItemBoundable(bounds, item));
};

/**
 * Also builds the tree, if necessary.
 *
 * @param {Object}
 *          searchBounds
 * @param {jsts.index.ItemVisitor}
 *          [visitor].
 * @param {jsts.index.strtree.AbstractNode}
 *          [node].
 * @param {Array}
 *          [matches].
 * @return {Array}
 */
jsts.index.strtree.AbstractSTRtree.prototype.query = function(searchBounds) {
  if (arguments.length > 1) {
    this.query2.apply(this, arguments);
  }

  if (!this.built) {
    this.build();
  }
  var matches = [];
  if (this.itemBoundables.length === 0) {
    jsts.util.Assert.isTrue(this.root.getBounds() === null);
    return matches;
  }
  if (this.getIntersectsOp().intersects(this.root.getBounds(), searchBounds)) {
    this.query3(searchBounds, this.root, matches);
  }
  return matches;
};

jsts.index.strtree.AbstractSTRtree.prototype.query2 = function(searchBounds,
    visitor) {
  if (arguments.length > 2) {
    this.query3.apply(this, arguments);
  }

  if (!this.built) {
    this.build();
  }
  if (this.itemBoundables.length === 0) {
    jsts.util.Assert.isTrue(this.root.getBounds() === null);
  }
  if (this.getIntersectsOp().intersects(this.root.getBounds(), searchBounds)) {
    this.query4(searchBounds, this.root, visitor);
  }
};

/**
 * @private
 */
jsts.index.strtree.AbstractSTRtree.prototype.query3 = function(searchBounds,
    node, matches) {
  if (!(arguments[2] instanceof Array)) {
    this.query4.apply(this, arguments);
  }

  var childBoundables = node.getChildBoundables();
  for (var i = 0; i < childBoundables.length; i++) {
    var childBoundable = childBoundables[i];
    if (!this.getIntersectsOp().intersects(childBoundable.getBounds(),
        searchBounds)) {
      continue;
    }
    if (childBoundable instanceof jsts.index.strtree.AbstractNode) {
      this.query3(searchBounds, childBoundable, matches);
    } else if (childBoundable instanceof jsts.index.strtree.ItemBoundable) {
      matches.push(childBoundable.getItem());
    } else {
      jsts.util.Assert.shouldNeverReachHere();
    }
  }
};

/**
 * @private
 */
jsts.index.strtree.AbstractSTRtree.prototype.query4 = function(searchBounds,
    node, visitor) {
  var childBoundables = node.getChildBoundables();
  for (var i = 0; i < childBoundables.length; i++) {
    var childBoundable = childBoundables[i];
    if (!this.getIntersectsOp().intersects(childBoundable.getBounds(),
        searchBounds)) {
      continue;
    }
    if (childBoundable instanceof jsts.index.strtree.AbstractNode) {
      this.query4(searchBounds, childBoundable, visitor);
    } else if (childBoundable instanceof jsts.index.strtree.ItemBoundable) {
      visitor.visitItem(childBoundable.getItem());
    } else {
      jsts.util.Assert.shouldNeverReachHere();
    }
  }
};

/**
 * @return {jsts.index.strtree.AbstractSTRtree.IntersectOp}
 */
jsts.index.strtree.AbstractSTRtree.prototype.getIntersectsOp = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};

// TODO: port rest

/**
 * Gets a tree structure (as a nested list) corresponding to the structure of
 * the items and nodes in this tree.
 * <p>
 * The returned {@link List}s contain either {@link Object} items, or Lists
 * which correspond to subtrees of the tree Subtrees which do not contain any
 * items are not included.
 * <p>
 * Builds the tree if necessary.
 *
 * @return {Array} a List of items and/or Lists.
 */
jsts.index.strtree.AbstractSTRtree.prototype.itemsTree = function() {
  if (arguments.length === 1) {
    return this.itemsTree2.apply(this, arguments);
  }

  if (!this.built) {
    this.build();
  }

  var valuesTree = this.itemsTree2(this.root);
  if (valuesTree === null)
    return [];
  return valuesTree;
};

jsts.index.strtree.AbstractSTRtree.prototype.itemsTree2 = function(node) {
  var valuesTreeForNode = [];
  var childBoundables = node.getChildBoundables();
  for (var i = 0; i < childBoundables.length; i++) {
    var childBoundable = childBoundables[i];
    if (childBoundable instanceof jsts.index.strtree.AbstractNode) {
      var valuesTreeForChild = this.itemsTree(childBoundable);
      // only add if not null (which indicates an item somewhere in this tree
      if (valuesTreeForChild != null)
        valuesTreeForNode.push(valuesTreeForChild);
    } else if (childBoundable instanceof jsts.index.strtree.ItemBoundable) {
      valuesTreeForNode.push(childBoundable.getItem());
    } else {
      jsts.util.Assert.shouldNeverReachHere();
    }
  }
  if (valuesTreeForNode.length <= 0)
    return null;
  return valuesTreeForNode;
};

/**
 * Removes an item from the tree. (Builds the tree, if necessary.)
 *
 * @param {Object}
 *          searchBounds
 * @param {jsts.index.strtree.AbstractNode}
 *          [node].
 * @param {Object]
 *          item}
 * @return {boolean}
 */
jsts.index.strtree.AbstractSTRtree.prototype.remove = function(searchBounds,
    item) {
  // TODO: argument switch


  if (!this.built) {
    this.build();
  }
  if (this.itemBoundables.length === 0) {
    jsts.util.Assert.isTrue(this.root.getBounds() == null);
  }
  if (this.getIntersectsOp().intersects(this.root.getBounds(), searchBounds)) {
    return this.remove2(searchBounds, this.root, item);
  }
  return false;
};

jsts.index.strtree.AbstractSTRtree.prototype.remove2 = function(searchBounds,
    node, item) {
  // first try removing item from this node
  var found = this.removeItem(node, item);
  if (found)
    return true;

  var childToPrune = null;
  // next try removing item from lower nodes
  var childBoundables = node.getChildBoundables();
  for (var i = 0; i < childBoundables.length; i++) {
    var childBoundable = childBoundables[i];
    if (!this.getIntersectsOp().intersects(childBoundable.getBounds(),
        searchBounds)) {
      continue;
    }
    if (childBoundable instanceof jsts.index.strtree.AbstractNode) {
      found = this.remove(searchBounds, childBoundable, item);
      // if found, record child for pruning and exit
      if (found) {
        childToPrune = childBoundable;
        break;
      }
    }
  }
  // prune child if possible
  if (childToPrune != null) {
    if (childToPrune.getChildBoundables().length === 0) {
      childBoundables.splice(childBoundables.indexOf(childToPrune), 1);
    }
  }
  return found;
};



/**
 *
 * @param {jsts.index.strtree.AbstractNode}
 *          node
 * @param {Object}
 *          item
 * @return {boolean}
 */
jsts.index.strtree.AbstractSTRtree.prototype.removeItem = function(node, item) {
  var childToRemove = null;
  var childBoundables = node.getChildBoundables();
  for (var i = 0; i < childBoundables.length; i++) {
    var childBoundable = childBoundables[i];
    if (childBoundable instanceof jsts.index.strtree.ItemBoundable) {
      if (childBoundable.getItem() === item)
        childToRemove = childBoundable;
    }
  }
  if (childToRemove !== null) {
    childBoundables.splice(childBoundables.indexOf(childToRemove), 1);
    return true;
  }
  return false;
};


jsts.index.strtree.AbstractSTRtree.prototype.boundablesAtLevel = function(level) {
  if (arguments.length > 1) {
    this.boundablesAtLevel2.apply(this, arguments);
    return;
  }

  var boundables = [];
  this.boundablesAtLevel2(level, this.root, boundables);
  return boundables;
};

/**
 * @param {number}
 *          level
 * @param {jsts.index.strtree.AbstractNode}
 *          [top].
 * @param {Array}
 *          [boundables].
 * @return {?Array}
 */
jsts.index.strtree.AbstractSTRtree.prototype.boundablesAtLevel2 = function(
    level, top, boundables) {
  jsts.util.Assert.isTrue(level > -2);
  if (top.getLevel() === level) {
    boundables.add(top);
    return;
  }
  var childBoundables = node.getChildBoundables();
  for (var i = 0; i < childBoundables.length; i++) {
    var boundable = childBoundables[i];
    if (boundable instanceof jsts.index.strtree.AbstractNode) {
      this.boundablesAtLevel(level, boundable, boundables);
    } else {
      jsts.util.Assert.isTrue(boundable instanceof jsts.index.strtree.ItemBoundable);
      if (level === -1) {
        boundables.add(boundable);
      }
    }
  }
  return;
};


/**
 * @return {Comparator}
 */
jsts.index.strtree.AbstractSTRtree.prototype.getComparator = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * A node of the STR tree. The children of this node are either more nodes
 * (AbstractNodes) or real data (ItemBoundables). If this node contains real data
 * (rather than nodes), then we say that this node is a "leaf node".
 *
 * @requires jsts/index/strtree/Boundable.js
 */



/**
 * Constructs an AbstractNode at the given level in the tree
 * @param {Integer} level 0 if this node is a leaf, 1 if a parent of a leaf, and so on; the
 * root node will have the highest level.
 *
 * @extends {Boundable}
 * @constructor
 * @interface
 */
jsts.index.strtree.AbstractNode = function(level) {
  this.level = level;
  this.childBoundables = [];
};

jsts.index.strtree.AbstractNode.prototype = new jsts.index.strtree.Boundable();
jsts.index.strtree.AbstractNode.constructor = jsts.index.strtree.AbstractNode;

/**
 * @type {Array}
 * @private
 */
jsts.index.strtree.AbstractNode.prototype.childBoundables = null;


/**
 * @type {Object}
 * @private
 */
jsts.index.strtree.AbstractNode.prototype.bounds = null;


/**
 * @type {number}
 * @private
 */
jsts.index.strtree.AbstractNode.prototype.level = null;


/**
 * Returns either child {@link AbstractNodes}, or if this is a leaf node, real data (wrapped
 * in {@link ItemBoundables}).
 *
 * @return {Array}
 */
jsts.index.strtree.AbstractNode.prototype.getChildBoundables = function() {
  return this.childBoundables;
};


/**
 * Returns a representation of space that encloses this Boundable,
 * preferably not much bigger than this Boundable's boundary yet fast to
 * test for intersection with the bounds of other Boundables. The class of
 * object returned depends on the subclass of AbstractSTRtree.
 *
 * @return an Envelope (for STRtrees), an Interval (for SIRtrees), or other
 *         object (for other subclasses of AbstractSTRtree).
 * @see AbstractSTRtree.IntersectsOp
 */
jsts.index.strtree.AbstractNode.prototype.computeBounds = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};

jsts.index.strtree.AbstractNode.prototype.getBounds = function() {
  if (this.bounds === null) {
    this.bounds = this.computeBounds();
  }
  return this.bounds;
};


/**
 * Returns 0 if this node is a leaf, 1 if a parent of a leaf, and so on; the
 * root node will have the highest level
 *
 * @return {number}
 */
jsts.index.strtree.AbstractNode.prototype.getLevel = function() {
  return this.level;
};


/**
 * Adds either an AbstractNode, or if this is a leaf node, a data object
 * (wrapped in an ItemBoundable)
 *
 * @param {jsts.index.strtree.Boundable} childBoundable
 */
jsts.index.strtree.AbstractNode.prototype.addChildBoundable = function(childBoundable) {
  this.childBoundables.push(childBoundable);
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 *  A query-only R-tree created using the Sort-Tile-Recursive (STR) algorithm.
 *  For two-dimensional spatial data.
 * <P>
 *  The STR packed R-tree is simple to implement and maximizes space
 *  utilization; that is, as many leaves as possible are filled to capacity.
 *  Overlap between nodes is far less than in a basic R-tree. However, once the
 *  tree has been built (explicitly or on the first call to #query), items may
 *  not be added or removed.
 * <P>
 * Described in: P. Rigaux, Michel Scholl and Agnes Voisard.
 * <i>Spatial Databases With Application To GIS</i>.
 * Morgan Kaufmann, San Francisco, 2002.
 *
 * @requires jsts/index/SpatialIndex.js
 * @requires jsts/index/strtree/STRtree.js
 * @requires jsts/index/strtree/AbstractSTRtree.js
 */



/**
 * Constructs an STRtree with the default node capacity or with the given
 * maximum number of child nodes that a node may have.
 * <p>
 * The minimum recommended capacity setting is 4.
 *
 *
 * @param {number}
 *          [nodeCapacity].
 * @extends {jsts.index.strtree.AbstractSTRtree}
 * @extends {jsts.index.SpatialIndex}
 * @constructor
 */
jsts.index.strtree.STRtree = function(nodeCapacity) {
  nodeCapacity = nodeCapacity ||
      jsts.index.strtree.STRtree.DEFAULT_NODE_CAPACITY;
  jsts.index.strtree.AbstractSTRtree.call(this, nodeCapacity);
};

jsts.index.strtree.STRtree.prototype = new jsts.index.strtree.AbstractSTRtree();
jsts.index.strtree.STRtree.constructor = jsts.index.strtree.STRtree;

/**
 * @type {Object} implements function for comparison
 * @private
 */
jsts.index.strtree.STRtree.prototype.xComparator = function(o1, o2) {
  return jsts.index.strtree.AbstractSTRtree.prototype.compareDoubles(
      jsts.index.strtree.STRtree.prototype.centreX(o1.getBounds()),
      jsts.index.strtree.STRtree.prototype.centreX(o2.getBounds()));
};


/**
 * @type {Object} implements function for comparison
 * @private
 */
jsts.index.strtree.STRtree.prototype.yComparator = function(o1, o2) {
  return jsts.index.strtree.AbstractSTRtree.prototype.compareDoubles(
      jsts.index.strtree.STRtree.prototype.centreY(o1.getBounds()),
      jsts.index.strtree.STRtree.prototype.centreY(o2.getBounds()));
};


/**
 * @param {jsts.geom.Envelope}
 *          e
 * @return {number}
 */
jsts.index.strtree.STRtree.prototype.centreX = function(e) {
  return jsts.index.strtree.STRtree.prototype.avg(e.getMinX(), e.getMaxX());
};


/**
 * @param {jsts.geom.Envelope}
 *          e
 * @return {number}
 */
jsts.index.strtree.STRtree.prototype.centreY = function(e) {
  return jsts.index.strtree.STRtree.prototype.avg(e.getMinY(), e.getMaxY());
};


/**
 * @param {number}
 *          a
 * @param {number}
 *          b
 * @return {number}
 */
jsts.index.strtree.STRtree.prototype.avg = function(a, b) {
  return (a + b) / 2.0;
};


/**
 * @type {Object}
 * @extends {jsts.index.strtree.AbstractSTRtree.IntersectsOp}
 * @private
 */
jsts.index.strtree.STRtree.prototype.intersectsOp = {
  intersects: function(aBounds, bBounds) {
    return aBounds.intersects(bBounds);
  }
};


/**
 * Creates the parent level for the given child level. First, orders the items
 * by the x-values of the midpoints, and groups them into vertical slices. For
 * each slice, orders the items by the y-values of the midpoints, and group them
 * into runs of size M (the node capacity). For each run, creates a new (parent)
 * node.
 *
 * @param {Array}
 *          childBoundables
 * @param {number}
 *          newLevel
 * @return {Array}
 * @protected
 */
jsts.index.strtree.STRtree.prototype.createParentBoundables = function(
    childBoundables, newLevel) {
  jsts.util.Assert.isTrue(!(childBoundables.length === 0));
  var minLeafCount = Math.ceil(childBoundables.length / this.getNodeCapacity());
  var sortedChildBoundables = [];
  for (var i = 0; i < childBoundables.length; i++) {
    sortedChildBoundables.push(childBoundables[i]);
  }
  sortedChildBoundables.sort(this.xComparator);
  var verticalSlices = this.verticalSlices(sortedChildBoundables, Math
      .ceil(Math.sqrt(minLeafCount)));
  return this
      .createParentBoundablesFromVerticalSlices(verticalSlices, newLevel);
};


/**
 *
 * @param {Array.
 *          <Array>} verticalSlices
 * @param {number}
 *          newLevel
 * @return {Array.<Array>}
 * @private
 */
jsts.index.strtree.STRtree.prototype.createParentBoundablesFromVerticalSlices = function(
    verticalSlices, newLevel) {
  jsts.util.Assert.isTrue(verticalSlices.length > 0);
  var parentBoundables = [];
  for (var i = 0; i < verticalSlices.length; i++) {
    parentBoundables = parentBoundables.concat(this.createParentBoundablesFromVerticalSlice(
        verticalSlices[i], newLevel));
  }
  return parentBoundables;
};


/**
 *
 * @param {Array}
 *          childBoundables
 * @param {number}
 *          newLevel
 * @return {Array}
 * @protected
 */
jsts.index.strtree.STRtree.prototype.createParentBoundablesFromVerticalSlice = function(
    childBoundables, newLevel) {
  return jsts.index.strtree.AbstractSTRtree.prototype.createParentBoundables
      .call(this, childBoundables, newLevel);
};


/**
 *
 * @param {Array}
 *          childBoundables
 * @param {number}
 *          sliceCount
 * @return {Array.<Array>}
 * @protected
 */
jsts.index.strtree.STRtree.prototype.verticalSlices = function(childBoundables,
    sliceCount) {
  var sliceCapacity = Math.ceil(childBoundables.length / sliceCount);
  var slices = [];

  var i = 0, boundablesAddedToSlice, childBoundable;

  for (var j = 0; j < sliceCount; j++) {
    slices[j] = [];
    boundablesAddedToSlice = 0;
    while (i < childBoundables.length && boundablesAddedToSlice < sliceCapacity) {
      childBoundable = childBoundables[i++];
      slices[j].push(childBoundable);
      boundablesAddedToSlice++;
    }
  }

  return slices;
};


/**
 * @type {number}
 * @const
 * @private
 */
jsts.index.strtree.STRtree.DEFAULT_NODE_CAPACITY = 10;


/**
 * @param {number}
 *          level
 * @return {jsts.index.strtree.AbstractNode}
 * @protected
 */
jsts.index.strtree.STRtree.prototype.createNode = function(level) {
  var abstractNode = new jsts.index.strtree.AbstractNode(level);

  abstractNode.computeBounds = function() {
    var bounds = null;
    var childBoundables = this.getChildBoundables();
    for (var i = 0; i < childBoundables.length; i++) {
      var childBoundable = childBoundables[i];
      if (bounds === null) {
        bounds = new jsts.geom.Envelope(childBoundable.getBounds());
      } else {
        bounds.expandToInclude(childBoundable.getBounds());
      }
    }
    return bounds;
  };

  return abstractNode;
};


/**
 * @return {jsts.index.strtree.AbstractSTRtree.IntersectsOp}
 * @protected
 */
jsts.index.strtree.STRtree.prototype.getIntersectsOp = function() {
  return this.intersectsOp;
};


/**
 * Inserts an item having the given bounds into the tree.
 *
 * @param {jsts.geom.Envelope}
 *          itemEnv
 * @param {Object}
 *          item
 * @public
 */
jsts.index.strtree.STRtree.prototype.insert = function(itemEnv, item) {
  if (itemEnv.isNull()) {
    return;
  }
  jsts.index.strtree.AbstractSTRtree.prototype.insert.call(this, itemEnv, item);
};


/**
 * Returns items whose bounds intersect the given envelope.
 *
 * @param {jsts.geom.Envelope}
 *          searchEnv
 * @param {jsts.index.ItemVisitor}
 *          visitor
 * @return {Array}
 * @public
 */
jsts.index.strtree.STRtree.prototype.query = function(searchEnv, visitor) {
  // Yes this method does something. It specifies that the bounds is an
  // Envelope. super.query takes an Object, not an Envelope. [Jon Aquino
  // 10/24/2003]
  return jsts.index.strtree.AbstractSTRtree.prototype.query.apply(this,
      arguments);
};


/**
 * Removes a single item from the tree.
 *
 * @param {jsts.geom.Envelope}
 *          itemEnv the Envelope of the item to remove.
 * @param {Object}
 *          item the item to remove.
 * @return {boolean} <code>true</code> if the item was found.
 * @public
 */
jsts.index.strtree.STRtree.prototype.remove = function(itemEnv, item) {
  return jsts.index.strtree.AbstractSTRtree.prototype.remove.call(this,
      itemEnv, item);
};


/**
 * Returns the number of items in the tree.
 *
 * @return {number} the number of items in the tree.
 * @public
 */
jsts.index.strtree.STRtree.prototype.size = function() {
  return jsts.index.strtree.AbstractSTRtree.prototype.size.call(this);
};


/**
 * Returns the number of items in the tree.
 *
 * @return {number} the number of items in the tree.
 * @public
 */
jsts.index.strtree.STRtree.prototype.depth = function() {
  return jsts.index.strtree.AbstractSTRtree.prototype.depth.call(this);
};


/**
 * @return {Object}
 * @protected
 */
jsts.index.strtree.STRtree.prototype.getComparator = function() {
  return this.yComparator;
};

/**
 * Finds the two nearest items in the tree, using {@link ItemDistance} as the
 * distance metric. A Branch-and-Bound tree traversal algorithm is used to
 * provide an efficient search.
 *
 * @param {ItemDistance}
 *          itemDist a distance metric applicable to the items in this tree.
 * @return {Object[]} the pair of the nearest items.
 */
jsts.index.strtree.STRtree.prototype.nearestNeighbour = function(itemDist) {
  var bp = new jsts.index.strtree.BoundablePair(this.getRoot(), this.getRoot(),
      itemDist);
  return this.nearestNeighbour4(bp);
};

/**
 * Finds the nearest item to the given object in this tree, using
 * {@link ItemDistance} as the distance metric. A Branch-and-Bound tree
 * traversal algorithm is used to provide an efficient search.
 *
 * @param {Envelope}
 *          env the envelope of the query item.
 * @param {Object}
 *          item the item to find the nearest neighbour of.
 * @param {ItemDistance}
 *          itemDist a distance metric applicable to the items in this tree and
 *          the query item.
 * @return {Object[]} the nearest item in this tree.
 */
jsts.index.strtree.STRtree.prototype.nearestNeighbour2 = function(env, item,
    itemDist) {
  var bnd = new jsts.index.strtree.ItemBoundable(env, item);
  var bp = new jsts.index.strtree.BoundablePair(this.getRoot(), bnd, itemDist);
  return this.nearestNeighbour4(bp)[0];
};

/**
 * Finds the two nearest items from this tree and another tree, using
 * {@link ItemDistance} as the distance metric. A Branch-and-Bound tree
 * traversal algorithm is used to provide an efficient search. The result value
 * is a pair of items, the first from this tree and the second from the argument
 * tree.
 *
 * @param {STRtree}
 *          tree another tree.
 * @param {ItemDistance}
 *          itemDist a distance metric applicable to the items in the trees.
 * @return {Object[]} the pair of the nearest items, one from each tree.
 */
jsts.index.strtree.STRtree.prototype.nearestNeighbour3 = function(tree,
    itemDist) {
  var bp = new jsts.index.strtree.BoundablePair(this.getRoot(), tree.getRoot(),
      itemDist);
  return this.nearestNeighbour4(bp);
};

jsts.index.strtree.STRtree.prototype.nearestNeighbour4 = function(initBndPair) {
  return this.nearestNeighbour5(initBndPair, Double.POSITIVE_INFINITY);
};

/**
 * NOTE: PriorityQueue replaces by js array
 *
 * @param initBndPair
 * @param maxDistance
 * @return {Array}
 */
jsts.index.strtree.STRtree.prototype.nearestNeighbour5 = function(initBndPair,
    maxDistance) {
  var distanceLowerBound = maxDistance;
  var minPair = null;

  // initialize internal structures
  var priQ = [];

  // initialize queue
  priQ.push(initBndPair);

  while (!priQ.isEmpty() && distanceLowerBound > 0.0) {
    // pop head of queue and expand one side of pair
    var bndPair = priQ.pop();
    var currentDistance = bndPair.getDistance();

    /**
     * If the distance for the first node in the queue is >= the current minimum
     * distance, all other nodes in the queue must also have a greater distance.
     * So the current minDistance must be the true minimum, and we are done.
     */
    if (currentDistance >= distanceLowerBound)
      break;

    /**
     * If the pair members are leaves then their distance is the exact lower
     * bound. Update the distanceLowerBound to reflect this (which must be
     * smaller, due to the test immediately prior to this).
     */
    if (bndPair.isLeaves()) {
      // assert: currentDistance < minimumDistanceFound
      distanceLowerBound = currentDistance;
      minPair = bndPair;
    } else {
      /**
       * Otherwise, expand one side of the pair, (the choice of which side to
       * expand is heuristically determined) and insert the new expanded pairs
       * into the queue
       */
      bndPair.expandToQueue(priQ, distanceLowerBound);
    }
  }
  // done - return items with min distance
  return [minPair.getBoundable(0).getItem(), minPair.getBoundable(1).getItem()];
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Constructs {@link MonotoneChain}s for sequences of {@link Coordinate}s.
 *
 * @constructor
 */
jsts.index.chain.MonotoneChainBuilder = function() {

};

jsts.index.chain.MonotoneChainBuilder.toIntArray = function(list) {
  var array = [];
  for (var i = 0; i < list.length; i++) {
    array[i] = list[i];
  }
  return array;
};

jsts.index.chain.MonotoneChainBuilder.getChains = function(pts) {
  if (arguments.length === 2) {
    return jsts.index.chain.MonotoneChainBuilder.getChains2.apply(this, arguments);
  }

  return jsts.index.chain.MonotoneChainBuilder.getChains2(pts, null);
};

/**
 * Return a list of the {@link MonotoneChain}s for the given list of
 * coordinates.
 */
jsts.index.chain.MonotoneChainBuilder.getChains2 = function(pts, context) {
  var mcList = [];
  var startIndex = jsts.index.chain.MonotoneChainBuilder
      .getChainStartIndices(pts);
  for (var i = 0; i < startIndex.length - 1; i++) {
    var mc = new jsts.index.chain.MonotoneChain(pts, startIndex[i],
        startIndex[i + 1], context);
    mcList.push(mc);
  }
  return mcList;
};

/**
 * Return an array containing lists of start/end indexes of the monotone chains
 * for the given list of coordinates. The last entry in the array points to the
 * end point of the point array, for use as a sentinel.
 */
jsts.index.chain.MonotoneChainBuilder.getChainStartIndices = function(pts) {
  // find the startpoint (and endpoints) of all monotone chains in this edge
  var start = 0;
  var startIndexList = [];
  startIndexList.push(start);
  do {
    var last = jsts.index.chain.MonotoneChainBuilder.findChainEnd(pts, start);
    startIndexList.push(last);
    start = last;
  } while (start < pts.length - 1);
  // copy list to an array of ints, for efficiency
  var startIndex = jsts.index.chain.MonotoneChainBuilder
      .toIntArray(startIndexList);
  return startIndex;
};

/**
 * Finds the index of the last point in a monotone chain starting at a given
 * point. Any repeated points (0-length segments) will be included in the
 * monotone chain returned.
 *
 * @return the index of the last point in the monotone chain starting at
 *         <code>start</code>.
 * @private
 */
jsts.index.chain.MonotoneChainBuilder.findChainEnd = function(pts, start) {
  var safeStart = start;
  // skip any zero-length segments at the start of the sequence
  // (since they cannot be used to establish a quadrant)
  while (safeStart < pts.length - 1 &&
      pts[safeStart].equals2D(pts[safeStart + 1])) {
    safeStart++;
  }
  // check if there are NO non-zero-length segments
  if (safeStart >= pts.length - 1) {
    return pts.length - 1;
  }
  // determine overall quadrant for chain (which is the starting quadrant)
  var chainQuad = jsts.geomgraph.Quadrant.quadrant(pts[safeStart],
      pts[safeStart + 1]);
  var last = start + 1;
  while (last < pts.length) {
    // skip zero-length segments, but include them in the chain
    if (!pts[last - 1].equals2D(pts[last])) {
      // compute quadrant for next possible segment in chain
      var quad = jsts.geomgraph.Quadrant.quadrant(pts[last - 1],
          pts[last]);
      if (quad !== chainQuad)
        break;
    }
    last++;
  }
  return last - 1;
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/noding/SinglePassNoder.js
   * @requires jsts/index/strtree/STRtree.js
   * @requires jsts/noding/NodedSegmentString.js
   * @requires jsts/index/chain/MonotoneChainBuilder.js
   * @requires jsts/index/chain/MonotoneChainOverlapAction.js
   */

  var MonotoneChainOverlapAction = jsts.index.chain.MonotoneChainOverlapAction;
  var SinglePassNoder = jsts.noding.SinglePassNoder;
  var STRtree = jsts.index.strtree.STRtree;
  var NodedSegmentString = jsts.noding.NodedSegmentString;
  var MonotoneChainBuilder = jsts.index.chain.MonotoneChainBuilder;

  /**
   * @constructor
   * @private
   */
  var SegmentOverlapAction = function(si) {
    this.si = si;

  };
  SegmentOverlapAction.prototype = new MonotoneChainOverlapAction();
  SegmentOverlapAction.constructor = SegmentOverlapAction;

  /**
   * @type {SegmentIntersector}
   * @private
   */
  SegmentOverlapAction.prototype.si = null;

  SegmentOverlapAction.prototype.overlap = function(mc1, start1, mc2, start2) {
    var ss1 = mc1.getContext();
    var ss2 = mc2.getContext();
    this.si.processIntersections(ss1, start1, ss2, start2);
  };

  /**
   * @constructor
   */
  jsts.noding.MCIndexNoder = function() {
    this.monoChains = [];
    this.index = new STRtree();
  };

  jsts.noding.MCIndexNoder.prototype = new SinglePassNoder();
  jsts.noding.MCIndexNoder.constructor = jsts.noding.MCIndexNoder;

  /**
   * @type {Array}
   * @private
   */
  jsts.noding.MCIndexNoder.prototype.monoChains = null;
  /**
   * @type {SpatialIndex}
   * @private
   */
  jsts.noding.MCIndexNoder.prototype.index = null;
  /**
   * @type {number}
   * @private
   */
  jsts.noding.MCIndexNoder.prototype.idCounter = 0;

  /**
   * @type {Array}
   * @private
   */
  jsts.noding.MCIndexNoder.prototype.nodedSegStrings = null;
  /**
   * statistics
   *
   * @type {number}
   * @private
   */
  jsts.noding.MCIndexNoder.prototype.nOverlaps = 0;


  jsts.noding.MCIndexNoder.prototype.getMonotoneChains = function() {
    return this.monoChains;
  };

  jsts.noding.MCIndexNoder.prototype.getIndex = function() {
    return this.index;
  };

  jsts.noding.MCIndexNoder.prototype.getNodedSubstrings = function() {
    return NodedSegmentString.getNodedSubstrings(this.nodedSegStrings);
  };

  jsts.noding.MCIndexNoder.prototype.computeNodes = function(inputSegStrings) {
    this.nodedSegStrings = inputSegStrings;
    for (var i = inputSegStrings.iterator(); i.hasNext(); ) {
      this.add(i.next());
    }
    this.intersectChains();
  };

  /**
   * @private
   */
  jsts.noding.MCIndexNoder.prototype.intersectChains = function() {
    var overlapAction = new SegmentOverlapAction(this.segInt);

    for (var i = 0; i < this.monoChains.length; i++) {
      var queryChain = this.monoChains[i];
      var overlapChains = this.index.query(queryChain.getEnvelope());
      for (var j = 0; j < overlapChains.length; j++) {
        var testChain = overlapChains[j];
        /**
         * following test makes sure we only compare each pair of chains once
         * and that we don't compare a chain to itself
         */
        if (testChain.getId() > queryChain.getId()) {
          queryChain.computeOverlaps(testChain, overlapAction);
          this.nOverlaps++;
        }
        // short-circuit if possible
        if (this.segInt.isDone())
          return;
      }
    }
  };

  /**
   * @private
   */
  jsts.noding.MCIndexNoder.prototype.add = function(segStr) {
    var segChains = MonotoneChainBuilder.getChains(segStr.getCoordinates(),
        segStr);
    for (var i = 0; i < segChains.length; i++) {
      var mc = segChains[i];
      mc.setId(this.idCounter++);
      this.index.insert(mc.getEnvelope(), mc);
      this.monoChains.push(mc);
    }
  };

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/algorithm/RobustLineIntersector.js
   * @requires jsts/noding/InteriorIntersectionFinder.js
   * @requires jsts/noding/MCIndexNoder.js
   */

  var RobustLineIntersector = jsts.algorithm.RobustLineIntersector;
  var InteriorIntersectionFinder = jsts.noding.InteriorIntersectionFinder;
  var MCIndexNoder = jsts.noding.MCIndexNoder;

  /**
   * Validates that a collection of {@link SegmentString}s is correctly noded.
   * Indexing is used to improve performance. In the most common use case,
   * validation stops after a single non-noded intersection is detected. Does
   * NOT check a-b-a collapse situations. Also does not check for
   * endpoint-interior vertex intersections. This should not be a problem, since
   * the noders should be able to compute intersections between vertices
   * correctly.
   * <p>
   * The client may either test the {@link #isValid} condition, or request that
   * a suitable {@link TopologyException} be thrown.
   *
   * Creates a new noding validator for a given set of linework.
   *
   * @param segStrings
   *          a collection of {@link SegmentString} s.
   */
  jsts.noding.FastNodingValidator = function(segStrings) {
    this.li = new RobustLineIntersector();

    this.segStrings = segStrings;
  };

  jsts.noding.FastNodingValidator.prototype.li = null;

  jsts.noding.FastNodingValidator.prototype.segStrings = null;
  jsts.noding.FastNodingValidator.prototype.findAllIntersections = false;
  jsts.noding.FastNodingValidator.prototype.segInt = null;
  jsts.noding.FastNodingValidator.prototype._isValid = true;

  jsts.noding.FastNodingValidator.prototype.setFindAllIntersections = function(
      findAllIntersections) {
    this.findAllIntersections = findAllIntersections;
  };

  jsts.noding.FastNodingValidator.prototype.getIntersections = function() {
    return segInt.getIntersections();
  };

  /**
   * Checks for an intersection and reports if one is found.
   *
   * @return true if the arrangement contains an interior intersection.
   */
  jsts.noding.FastNodingValidator.prototype.isValid = function() {
    this.execute();
    return this._isValid;
  };

  /**
   * Returns an error message indicating the segments containing the
   * intersection.
   *
   * @return an error message documenting the intersection location.
   */
  jsts.noding.FastNodingValidator.prototype.getErrorMessage = function() {
    if (this._isValid)
      return 'no intersections found';

    var intSegs = this.segInt.getIntersectionSegments();
    return 'found non-noded intersection between ' +
        jsts.io.WKTWriter.toLineString(intSegs[0], intSegs[1]) + ' and ' +
        jsts.io.WKTWriter.toLineString(intSegs[2], intSegs[3]);
  };

  /**
   * Checks for an intersection and throws a TopologyException if one is found.
   *
   * @throws TopologyException
   *           if an intersection is found
   */
  jsts.noding.FastNodingValidator.prototype.checkValid = function() {
    this.execute();
    if (!this._isValid)
      throw new jsts.error.TopologyError(this.getErrorMessage(), this.segInt
          .getInteriorIntersection());
  };

  /**
   * @private
   */
  jsts.noding.FastNodingValidator.prototype.execute = function() {
    if (this.segInt != null)
      return;
    this.checkInteriorIntersections();
  };

  /**
   * @private
   */
  jsts.noding.FastNodingValidator.prototype.checkInteriorIntersections = function() {
    /**
     * MD - It may even be reliable to simply check whether end segments (of
     * SegmentStrings) have an interior intersection, since noding should have
     * split any true interior intersections already.
     */
    this._isValid = true;
    this.segInt = new InteriorIntersectionFinder(this.li);
    this.segInt.setFindAllIntersections(this.findAllIntersections);
    var noder = new MCIndexNoder();
    noder.setSegmentIntersector(this.segInt);
    noder.computeNodes(this.segStrings);
    if (this.segInt.hasIntersection()) {
      this._isValid = false;
      return;
    }
  };

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/noding/FastNodingValidator.js
   * @requires jsts/noding/BasicSegmentString.js
   */

  var FastNodingValidator = jsts.noding.FastNodingValidator;
  var BasicSegmentString = jsts.noding.BasicSegmentString;
  var ArrayList = javascript.util.ArrayList;

  /**
   * Validates that a collection of {@link Edge}s is correctly noded. Throws an
   * appropriate exception if an noding error is found.
   *
   * Creates a new validator for the given collection of {@link Edge}s.
   *
   * @param edges
   *          a collection of Edges.
   */
  jsts.geomgraph.EdgeNodingValidator = function(edges) {
    this.nv = new FastNodingValidator(jsts.geomgraph.EdgeNodingValidator
        .toSegmentStrings(edges));
  };

  /**
   * Checks whether the supplied {@link Edge}s are correctly noded. Throws a
   * {@link TopologyException} if they are not.
   *
   * @param edges
   *          a collection of Edges.
   * @throws TopologyException
   *           if the SegmentStrings are not correctly noded
   *
   */
  jsts.geomgraph.EdgeNodingValidator.checkValid = function(edges) {
    var validator = new jsts.geomgraph.EdgeNodingValidator(edges);
    validator.checkValid();
  };

  jsts.geomgraph.EdgeNodingValidator.toSegmentStrings = function(edges) {
    // convert Edges to SegmentStrings
    var segStrings = new ArrayList();
    for (var i = edges.iterator(); i.hasNext();) {
      var e = i.next();
      segStrings.add(new BasicSegmentString(e.getCoordinates(), e));
    }
    return segStrings;
  };

  /**
   * @type {jsts.noding.FastNodingValidator}
   * @private
   */
  jsts.geomgraph.EdgeNodingValidator.prototype.nv = null;


  /**
   * Checks whether the supplied edges are correctly noded. Throws an exception
   * if they are not.
   *
   * @throws TopologyException
   *           if the SegmentStrings are not correctly noded
   *
   */
  jsts.geomgraph.EdgeNodingValidator.prototype.checkValid = function() {
    this.nv.checkValid();
  };

})();

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Forms {@link Polygon}s out of a graph of {@link DirectedEdge}s. The edges
 * to use are marked as being in the result Area.
 * <p>
 */
jsts.operation.overlay.PolygonBuilder = function(geometryFactory) {
  this.shellList = [];
  this.geometryFactory = geometryFactory;
};

/**
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.geometryFactory = null;

/**
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.shellList = null;


/**
 * Add a complete graph. The graph is assumed to contain one or more polygons,
 * possibly with holes.
 *
 * @param {jsts.geomgraph.PlanarGraph}
 *          graph
 */
jsts.operation.overlay.PolygonBuilder.prototype.add = function(graph) {
  if (arguments.length === 2) {
    this.add2.apply(this, arguments);
    return;
  }

  this.add2(graph.getEdgeEnds(), graph.getNodes());
};

/**
 * Add a set of edges and nodes, which form a graph. The graph is assumed to
 * contain one or more polygons, possibly with holes.
 */
jsts.operation.overlay.PolygonBuilder.prototype.add2 = function(dirEdges, nodes) {
  jsts.geomgraph.PlanarGraph.linkResultDirectedEdges(nodes);
  var maxEdgeRings = this.buildMaximalEdgeRings(dirEdges);
  var freeHoleList = [];
  var edgeRings = this.buildMinimalEdgeRings(maxEdgeRings, this.shellList,
      freeHoleList);
  this.sortShellsAndHoles(edgeRings, this.shellList, freeHoleList);
  this.placeFreeHoles(this.shellList, freeHoleList);
};

jsts.operation.overlay.PolygonBuilder.prototype.getPolygons = function() {
  var resultPolyList = this.computePolygons(this.shellList);
  return resultPolyList;
};


/**
 * for all DirectedEdges in result, form them into MaximalEdgeRings
 *
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.buildMaximalEdgeRings = function(
    dirEdges) {
  var maxEdgeRings = [];
  for (var it = dirEdges.iterator(); it.hasNext(); ) {
    var de = it.next();
    if (de.isInResult() && de.getLabel().isArea()) {
      // if this edge has not yet been processed
      if (de.getEdgeRing() == null) {
        var er = new jsts.operation.overlay.MaximalEdgeRing(de, this.geometryFactory);
        maxEdgeRings.push(er);
        er.setInResult();
        // System.out.println("max node degree = " + er.getMaxDegree());
      }
    }
  }
  return maxEdgeRings;
};

/**
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.buildMinimalEdgeRings = function(
    maxEdgeRings, shellList, freeHoleList) {
  var edgeRings = [];
  for (var i = 0; i < maxEdgeRings.length; i++) {
    var er = maxEdgeRings[i];
    if (er.getMaxNodeDegree() > 2) {
      er.linkDirectedEdgesForMinimalEdgeRings();
      var minEdgeRings = er.buildMinimalRings();
      // at this point we can go ahead and attempt to place holes, if this
      // EdgeRing is a polygon
      var shell = this.findShell(minEdgeRings);
      if (shell !== null) {
        this.placePolygonHoles(shell, minEdgeRings);
        shellList.push(shell);
      } else {
        freeHoleList = freeHoleList.concat(minEdgeRings);
      }
    } else {
      edgeRings.push(er);
    }
  }
  return edgeRings;
};

/**
 * This method takes a list of MinimalEdgeRings derived from a MaximalEdgeRing,
 * and tests whether they form a Polygon. This is the case if there is a single
 * shell in the list. In this case the shell is returned. The other possibility
 * is that they are a series of connected holes, in which case no shell is
 * returned.
 *
 * @return {EdgeRing} the shell EdgeRing, if there is one or null, if all the
 *         rings are holes.
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.findShell = function(
    minEdgeRings) {
  var shellCount = 0;
  var shell = null;
  for (var i = 0; i < minEdgeRings.length; i++) {
    var er = minEdgeRings[i];
    if (!er.isHole()) {
      shell = er;
      shellCount++;
    }
  }
  jsts.util.Assert.isTrue(shellCount <= 1, 'found two shells in MinimalEdgeRing list');
  return shell;
};
/**
 * This method assigns the holes for a Polygon (formed from a list of
 * MinimalEdgeRings) to its shell. Determining the holes for a MinimalEdgeRing
 * polygon serves two purposes:
 * <ul>
 * <li>it is faster than using a point-in-polygon check later on.
 * <li>it ensures correctness, since if the PIP test was used the point chosen
 * might lie on the shell, which might return an incorrect result from the PIP
 * test
 * </ul>
 *
 * @param {EdgeRing}
 *          shell
 * @param {Array}
 *          minEdgeRings
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.placePolygonHoles = function(
    shell, minEdgeRings) {
  for (var i = 0; i < minEdgeRings.length; i++) {
    var er = minEdgeRings[i];
    if (er.isHole()) {
      er.setShell(shell);
    }
  }
};
/**
 * For all rings in the input list, determine whether the ring is a shell or a
 * hole and add it to the appropriate list. Due to the way the DirectedEdges
 * were linked, a ring is a shell if it is oriented CW, a hole otherwise.
 *
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.sortShellsAndHoles = function(
    edgeRings, shellList, freeHoleList) {
  for (var i = 0; i < edgeRings.length; i++) {
    var er = edgeRings[i];
    if (er.isHole()) {
      freeHoleList.push(er);
    } else {
      shellList.push(er);
    }
  }
};
/**
 * This method determines finds a containing shell for all holes which have not
 * yet been assigned to a shell. These "free" holes should all be <b>properly</b>
 * contained in their parent shells, so it is safe to use the
 * <code>findEdgeRingContaining</code> method. (This is the case because any
 * holes which are NOT properly contained (i.e. are connected to their parent
 * shell) would have formed part of a MaximalEdgeRing and been handled in a
 * previous step).
 *
 * @throws TopologyException
 *           if a hole cannot be assigned to a shell
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.placeFreeHoles = function(
    shellList, freeHoleList) {
  for (var i = 0; i < freeHoleList.length; i++) {
    var hole = freeHoleList[i];
    // only place this hole if it doesn't yet have a shell
    if (hole.getShell() == null) {
      var shell = this.findEdgeRingContaining(hole, shellList);
      if (shell === null)
        throw new jsts.error.TopologyError('unable to assign hole to a shell',
            hole.getCoordinate(0));
      hole.setShell(shell);
    }
  }
};

/**
 * Find the innermost enclosing shell EdgeRing containing the argument EdgeRing,
 * if any. The innermost enclosing ring is the <i>smallest</i> enclosing ring.
 * The algorithm used depends on the fact that: <br>
 * ring A contains ring B iff envelope(ring A) contains envelope(ring B) <br>
 * This routine is only safe to use if the chosen point of the hole is known to
 * be properly contained in a shell (which is guaranteed to be the case if the
 * hole does not touch its shell)
 *
 * @return containing EdgeRing, if there is one.
 * @return null if no containing EdgeRing is found.
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.findEdgeRingContaining = function(
    testEr, shellList) {
  var testRing = testEr.getLinearRing();
  var testEnv = testRing.getEnvelopeInternal();
  var testPt = testRing.getCoordinateN(0);

  var minShell = null;
  var minEnv = null;
  for (var i = 0; i < shellList.length; i++) {
    var tryShell = shellList[i];
    var tryRing = tryShell.getLinearRing();
    var tryEnv = tryRing.getEnvelopeInternal();
    if (minShell !== null)
      minEnv = minShell.getLinearRing().getEnvelopeInternal();
    var isContained = false;
    if (tryEnv.contains(testEnv) &&
        jsts.algorithm.CGAlgorithms.isPointInRing(testPt, tryRing
            .getCoordinates()))
      isContained = true;
    // check if this new containing ring is smaller than the current minimum
    // ring
    if (isContained) {
      if (minShell == null || minEnv.contains(tryEnv)) {
        minShell = tryShell;
      }
    }
  }
  return minShell;
};

/**
 * @private
 */
jsts.operation.overlay.PolygonBuilder.prototype.computePolygons = function(
    shellList) {
  var resultPolyList = new javascript.util.ArrayList();
  // add Polygons for all shells
  for (var i = 0; i < shellList.length; i++) {
    var er = shellList[i];
    var poly = er.toPolygon(this.geometryFactory);
    resultPolyList.add(poly);
  }
  return resultPolyList;
};

/**
 * Checks the current set of shells (with their associated holes) to see if any
 * of them contain the point.
 *
 * @return {boolean}
 */
jsts.operation.overlay.PolygonBuilder.prototype.containsPoint = function(p) {
  for (var i = 0; i < this.shellList.length; i++) {
    var er = this.shellList[i];
    if (er.containsPoint(p))
      return true;
  }
  return false;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/util/Assert.js
   */

  var Assert = jsts.util.Assert;
  var ArrayList = javascript.util.ArrayList;


  /**
   * Forms JTS LineStrings out of a the graph of {@link DirectedEdge}s created
   * by an {@link OverlayOp}.
   */
  var LineBuilder = function(op, geometryFactory, ptLocator) {
    this.lineEdgesList = new ArrayList();
    this.resultLineList = new ArrayList();

    this.op = op;
    this.geometryFactory = geometryFactory;
    this.ptLocator = ptLocator;
  };

  LineBuilder.prototype.op = null;
  LineBuilder.prototype.geometryFactory = null;
  LineBuilder.prototype.ptLocator = null;

  LineBuilder.prototype.lineEdgesList = null;
  LineBuilder.prototype.resultLineList = null;

  /**
   * @return a list of the LineStrings in the result of the specified overlay
   *         operation.
   */
  LineBuilder.prototype.build = function(opCode) {
    this.findCoveredLineEdges();
    this.collectLines(opCode);
    this.buildLines(opCode);
    return this.resultLineList;
  };
  /**
   * Find and mark L edges which are "covered" by the result area (if any). L
   * edges at nodes which also have A edges can be checked by checking their
   * depth at that node. L edges at nodes which do not have A edges can be
   * checked by doing a point-in-polygon test with the previously computed
   * result areas.
   *
   * @private
   */
  LineBuilder.prototype.findCoveredLineEdges = function() {
    // first set covered for all L edges at nodes which have A edges too
    for (var nodeit = this.op.getGraph().getNodes().iterator(); nodeit
        .hasNext();) {
      var node = nodeit.next();
      node.getEdges().findCoveredLineEdges();
    }

    /**
     * For all L edges which weren't handled by the above, use a point-in-poly
     * test to determine whether they are covered
     */
    for (var it = this.op.getGraph().getEdgeEnds().iterator(); it.hasNext();) {
      var de = it.next();
      var e = de.getEdge();
      if (de.isLineEdge() && !e.isCoveredSet()) {
        var isCovered = this.op.isCoveredByA(de.getCoordinate());
        e.setCovered(isCovered);
      }
    }
  };

  /**
   * @private
   */
  LineBuilder.prototype.collectLines = function(opCode) {
    for (var it = this.op.getGraph().getEdgeEnds().iterator(); it.hasNext();) {
      var de = it.next();
      this.collectLineEdge(de, opCode, this.lineEdgesList);
      this.collectBoundaryTouchEdge(de, opCode, this.lineEdgesList);
    }
  };

  /**
   * Collect line edges which are in the result. Line edges are in the result if
   * they are not part of an area boundary, if they are in the result of the
   * overlay operation, and if they are not covered by a result area.
   *
   * @param de
   *          the directed edge to test.
   * @param opCode
   *          the overlap operation.
   * @param edges
   *          the list of included line edges.
   * @private
   */
  LineBuilder.prototype.collectLineEdge = function(de, opCode, edges) {
    var label = de.getLabel();
    var e = de.getEdge();
    // include L edges which are in the result
    if (de.isLineEdge()) {
      if (!de.isVisited() && jsts.operation.overlay.OverlayOp.isResultOfOp(label, opCode) &&
          !e.isCovered()) {

        edges.add(e);
        de.setVisitedEdge(true);
      }
    }
  };

  /**
   * Collect edges from Area inputs which should be in the result but which have
   * not been included in a result area. This happens ONLY:
   * <ul>
   * <li>during an intersection when the boundaries of two areas touch in a
   * line segment
   * <li> OR as a result of a dimensional collapse.
   * </ul>
   *
   * @private
   */
  LineBuilder.prototype.collectBoundaryTouchEdge = function(de, opCode, edges) {
    var label = de.getLabel();
    if (de.isLineEdge())
      return; // only interested in area edges
    if (de.isVisited())
      return; // already processed
    if (de.isInteriorAreaEdge())
      return; // added to handle dimensional collapses
    if (de.getEdge().isInResult())
      return; // if the edge linework is already included, don't include it
    // again

    // sanity check for labelling of result edgerings
    Assert.isTrue(!(de.isInResult() || de.getSym().isInResult()) ||
        !de.getEdge().isInResult());

    // include the linework if it's in the result of the operation
    if (jsts.operation.overlay.OverlayOp.isResultOfOp(label, opCode) &&
        opCode === jsts.operation.overlay.OverlayOp.INTERSECTION) {
      edges.add(de.getEdge());
      de.setVisitedEdge(true);
    }
  };

  /**
   * @private
   */
  LineBuilder.prototype.buildLines = function(opCode) {
    for (var it = this.lineEdgesList.iterator(); it.hasNext();) {
      var e = it.next();
      var label = e.getLabel();
      var line = this.geometryFactory.createLineString(e.getCoordinates());
      this.resultLineList.add(line);
      e.setInResult(true);
    }
  };

  /**
   * @private
   */
  LineBuilder.prototype.labelIsolatedLines = function(edgesList) {
    for (var it = edgesList.iterator(); it.hasNext();) {
      var e = it.next();
      var label = e.getLabel();
      // n.print(System.out);
      if (e.isIsolated()) {
        if (label.isNull(0))
          this.labelIsolatedLine(e, 0);
        else
          this.labelIsolatedLine(e, 1);
      }
    }
  };

  /**
   * Label an isolated node with its relationship to the target geometry.
   *
   * @private
   */
  LineBuilder.prototype.labelIsolatedLine = function(e, targetIndex) {
    var loc = ptLocator.locate(e.getCoordinate(), op
        .getArgGeometry(targetIndex));
    e.getLabel().setLocation(targetIndex, loc);
  };

  jsts.operation.overlay.LineBuilder = LineBuilder;

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Constants representing the different topological locations which can occur in
 * a {@link Geometry}. The constants are also used as the row and column
 * indices of DE-9IM {@link IntersectionMatrix}es.
 *
 * @constructor
 */
jsts.geom.Location = function() {
};


/**
 * The location value for the interior of a geometry. Also, DE-9IM row index of
 * the interior of the first geometry and column index of the interior of the
 * second geometry.
 *
 * @const
 * @type {number}
 */
jsts.geom.Location.INTERIOR = 0;


/**
 * The location value for the boundary of a geometry. Also, DE-9IM row index of
 * the boundary of the first geometry and column index of the boundary of the
 * second geometry.
 *
 * @const
 * @type {number}
 */
jsts.geom.Location.BOUNDARY = 1;


/**
 * The location value for the exterior of a geometry. Also, DE-9IM row index of
 * the exterior of the first geometry and column index of the exterior of the
 * second geometry.
 *
 * @const
 * @type {number}
 */
jsts.geom.Location.EXTERIOR = 2;


/**
 * Used for uninitialized location values.
 *
 * @const
 * @type {number}
 */
jsts.geom.Location.NONE = -1;


/**
 * Converts the location value to a location symbol, for example,
 * <code>EXTERIOR => 'e'</code> .
 *
 * @param {number}
 *          locationValue either EXTERIOR, BOUNDARY, INTERIOR or NONE.
 * @return {string} either 'e', 'b', 'i' or '-'.
 */
jsts.geom.Location.toLocationSymbol = function(locationValue) {
  switch (locationValue) {
    case jsts.geom.Location.EXTERIOR:
      return 'e';
    case jsts.geom.Location.BOUNDARY:
      return 'b';
    case jsts.geom.Location.INTERIOR:
      return 'i';
    case jsts.geom.Location.NONE:
      return '-';
  }
  throw new jsts.IllegalArgumentError('Unknown location value: ' +
      locationValue);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  var ArrayList = javascript.util.ArrayList;

  /**
   * Constructs {@link Point}s from the nodes of an overlay graph.
   */
  var PointBuilder = function(op, geometryFactory, ptLocator) {
    this.resultPointList = new ArrayList();

    this.op = op;
    this.geometryFactory = geometryFactory;
  };

  PointBuilder.prototype.op = null;
  PointBuilder.prototype.geometryFactory = null;

  PointBuilder.prototype.resultPointList = null;

  /**
   * Computes the Point geometries which will appear in the result, given the
   * specified overlay operation.
   *
   * @return a list of the Points objects in the result.
   */
  PointBuilder.prototype.build = function(opCode) {
    this.extractNonCoveredResultNodes(opCode);
    /**
     * It can happen that connected result nodes are still covered by result
     * geometries, so must perform this filter. (For instance, this can happen
     * during topology collapse).
     */
    return this.resultPointList;
  };

  /**
   * Determines nodes which are in the result, and creates {@link Point}s for
   * them.
   *
   * This method determines nodes which are candidates for the result via their
   * labelling and their graph topology.
   *
   * @param opCode
   *          the overlay operation.
   * @private
   */
  PointBuilder.prototype.extractNonCoveredResultNodes = function(opCode) {
    // testing only
    // if (true) return resultNodeList;

    for (var nodeit = this.op.getGraph().getNodes().iterator(); nodeit
        .hasNext();) {
      var n = nodeit.next();

      // filter out nodes which are known to be in the result
      if (n.isInResult())
        continue;
      // if an incident edge is in the result, then the node coordinate is
      // included already
      if (n.isIncidentEdgeInResult())
        continue;
      if (n.getEdges().getDegree() === 0 || opCode === jsts.operation.overlay.OverlayOp.INTERSECTION) {

        /**
         * For nodes on edges, only INTERSECTION can result in edge nodes being
         * included even if none of their incident edges are included
         */
        var label = n.getLabel();
        if (jsts.operation.overlay.OverlayOp.isResultOfOp(label, opCode)) {
          this.filterCoveredNodeToPoint(n);
        }
      }
    }
  };

  /**
   * Converts non-covered nodes to Point objects and adds them to the result.
   *
   * A node is covered if it is contained in another element Geometry with
   * higher dimension (e.g. a node point might be contained in a polygon, in
   * which case the point can be eliminated from the result).
   *
   * @param n
   *          the node to test.
   * @private
   */
  PointBuilder.prototype.filterCoveredNodeToPoint = function(n) {
    var coord = n.getCoordinate();
    if (!this.op.isCoveredByLA(coord)) {
      var pt = this.geometryFactory.createPoint(coord);
      this.resultPointList.add(pt);
    }
  };

  jsts.operation.overlay.PointBuilder = PointBuilder;

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/algorithm/PointLocator.js
   * @requires jsts/geom/Location.js
   * @requires jsts/geomgraph/EdgeList.js
   * @requires jsts/geomgraph/Label.js
   * @requires jsts/geomgraph/PlanarGraph.js
   * @requires jsts/geomgraph/Position.js
   * @requires jsts/geomgraph/EdgeNodingValidator.js
   * @requires jsts/operation/GeometryGraphOperation.js
   * @requires jsts/operation/overlay/OverlayNodeFactory.js
   * @requires jsts/operation/overlay/PolygonBuilder.js
   * @requires jsts/operation/overlay/LineBuilder.js
   * @requires jsts/operation/overlay/PointBuilder.js
   * @requires jsts/util/Assert.js
   */

  var PointLocator = jsts.algorithm.PointLocator;
  var Location = jsts.geom.Location;
  var EdgeList = jsts.geomgraph.EdgeList;
  var Label = jsts.geomgraph.Label;
  var PlanarGraph = jsts.geomgraph.PlanarGraph;
  var Position = jsts.geomgraph.Position;
  var EdgeNodingValidator = jsts.geomgraph.EdgeNodingValidator;
  var GeometryGraphOperation = jsts.operation.GeometryGraphOperation;
  var OverlayNodeFactory = jsts.operation.overlay.OverlayNodeFactory;
  var PolygonBuilder = jsts.operation.overlay.PolygonBuilder;
  var LineBuilder = jsts.operation.overlay.LineBuilder;
  var PointBuilder = jsts.operation.overlay.PointBuilder;
  var Assert = jsts.util.Assert;
  var ArrayList = javascript.util.ArrayList;

  /**
   * Computes the overlay of two {@link Geometry}s. The overlay can be used to
   * determine any boolean combination of the geometries.
   */
  jsts.operation.overlay.OverlayOp = function(g0, g1) {
    this.ptLocator = new PointLocator();
    this.edgeList = new EdgeList();
    this.resultPolyList = new ArrayList();
    this.resultLineList = new ArrayList();
    this.resultPointList = new ArrayList();

    GeometryGraphOperation.call(this, g0, g1);
    this.graph = new PlanarGraph(new OverlayNodeFactory());
    /**
     * Use factory of primary geometry. Note that this does NOT handle
     * mixed-precision arguments where the second arg has greater precision than
     * the first.
     */
    this.geomFact = g0.getFactory();
  };
  jsts.operation.overlay.OverlayOp.prototype = new GeometryGraphOperation();
  jsts.operation.overlay.OverlayOp.constructor = jsts.operation.overlay.OverlayOp;

  /**
   * The spatial functions supported by this class. These operations implement
   * various boolean combinations of the resultants of the overlay.
   */
  jsts.operation.overlay.OverlayOp.INTERSECTION = 1;
  jsts.operation.overlay.OverlayOp.UNION = 2;
  jsts.operation.overlay.OverlayOp.DIFFERENCE = 3;
  jsts.operation.overlay.OverlayOp.SYMDIFFERENCE = 4;

  jsts.operation.overlay.OverlayOp.overlayOp = function(geom0, geom1, opCode) {
    var gov = new jsts.operation.overlay.OverlayOp(geom0, geom1);
    var geomOv = gov.getResultGeometry(opCode);
    return geomOv;
  }

  jsts.operation.overlay.OverlayOp.isResultOfOp = function(label, opCode) {
    if (arguments.length === 3) {
      return jsts.operation.overlay.OverlayOp.isResultOfOp2.apply(this,
          arguments);
    }
    var loc0 = label.getLocation(0);
    var loc1 = label.getLocation(1);
    return jsts.operation.overlay.OverlayOp.isResultOfOp2(loc0, loc1, opCode);
  }

  /**
   * This method will handle arguments of Location.NONE correctly
   *
   * @return true if the locations correspond to the opCode.
   */
  jsts.operation.overlay.OverlayOp.isResultOfOp2 = function(loc0, loc1, opCode) {
    if (loc0 == Location.BOUNDARY)
      loc0 = Location.INTERIOR;
    if (loc1 == Location.BOUNDARY)
      loc1 = Location.INTERIOR;
    switch (opCode) {
    case jsts.operation.overlay.OverlayOp.INTERSECTION:
      return loc0 == Location.INTERIOR && loc1 == Location.INTERIOR;
    case jsts.operation.overlay.OverlayOp.UNION:
      return loc0 == Location.INTERIOR || loc1 == Location.INTERIOR;
    case jsts.operation.overlay.OverlayOp.DIFFERENCE:
      return loc0 == Location.INTERIOR && loc1 != Location.INTERIOR;
    case jsts.operation.overlay.OverlayOp.SYMDIFFERENCE:
      return (loc0 == Location.INTERIOR && loc1 != Location.INTERIOR) ||
          (loc0 != Location.INTERIOR && loc1 == Location.INTERIOR);
    }
    return false;
  }

  jsts.operation.overlay.OverlayOp.prototype.ptLocator = null;
  jsts.operation.overlay.OverlayOp.prototype.geomFact = null;
  jsts.operation.overlay.OverlayOp.prototype.resultGeom = null;

  jsts.operation.overlay.OverlayOp.prototype.graph = null;
  jsts.operation.overlay.OverlayOp.prototype.edgeList = null;

  jsts.operation.overlay.OverlayOp.prototype.resultPolyList = null;
  jsts.operation.overlay.OverlayOp.prototype.resultLineList = null;
  jsts.operation.overlay.OverlayOp.prototype.resultPointList = null;


  jsts.operation.overlay.OverlayOp.prototype.getResultGeometry = function(
      funcCode) {
    this.computeOverlay(funcCode);
    return this.resultGeom;
  }

  jsts.operation.overlay.OverlayOp.prototype.getGraph = function() {
    return this.graph;
  }

  /**
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.computeOverlay = function(opCode) {
    // copy points from input Geometries.
    // This ensures that any Point geometries
    // in the input are considered for inclusion in the result set
    this.copyPoints(0);
    this.copyPoints(1);

    // node the input Geometries
    this.arg[0].computeSelfNodes(this.li, false);
    this.arg[1].computeSelfNodes(this.li, false);

    // compute intersections between edges of the two input geometries
    this.arg[0].computeEdgeIntersections(this.arg[1], this.li, true);

    var baseSplitEdges = new ArrayList();
    this.arg[0].computeSplitEdges(baseSplitEdges);
    this.arg[1].computeSplitEdges(baseSplitEdges);
    var splitEdges = baseSplitEdges;
    // add the noded edges to this result graph
    this.insertUniqueEdges(baseSplitEdges);

    this.computeLabelsFromDepths();
    this.replaceCollapsedEdges();

    /**
     * Check that the noding completed correctly.
     *
     * This test is slow, but necessary in order to catch robustness failure
     * situations. If an exception is thrown because of a noding failure, then
     * snapping will be performed, which will hopefully avoid the problem. In
     * the future hopefully a faster check can be developed.
     *
     */
    EdgeNodingValidator.checkValid(this.edgeList.getEdges());

    this.graph.addEdges(this.edgeList.getEdges());
    this.computeLabelling();
    this.labelIncompleteNodes();

    /**
     * The ordering of building the result Geometries is important. Areas must
     * be built before lines, which must be built before points. This is so that
     * lines which are covered by areas are not included explicitly, and
     * similarly for points.
     */
    this.findResultAreaEdges(opCode);
    this.cancelDuplicateResultEdges();

    var polyBuilder = new PolygonBuilder(this.geomFact);
    polyBuilder.add(this.graph);
    this.resultPolyList = polyBuilder.getPolygons();

    var lineBuilder = new LineBuilder(this, this.geomFact, this.ptLocator);
    this.resultLineList = lineBuilder.build(opCode);

    var pointBuilder = new PointBuilder(this, this.geomFact, this.ptLocator);
    this.resultPointList = pointBuilder.build(opCode);

    // gather the results from all calculations into a single Geometry for the
    // result set
    this.resultGeom = this.computeGeometry(this.resultPointList,
        this.resultLineList, this.resultPolyList, opCode);
  }

  /**
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.insertUniqueEdges = function(edges) {
    for (var i = edges.iterator(); i.hasNext();) {
      var e = i.next();
      this.insertUniqueEdge(e);
    }
  }
  /**
   * Insert an edge from one of the noded input graphs. Checks edges that are
   * inserted to see if an identical edge already exists. If so, the edge is not
   * inserted, but its label is merged with the existing edge.
   *
   * @protected
   */
  jsts.operation.overlay.OverlayOp.prototype.insertUniqueEdge = function(e) {
    // <FIX> MD 8 Oct 03 speed up identical edge lookup
    // fast lookup
    var existingEdge = this.edgeList.findEqualEdge(e);

    // If an identical edge already exists, simply update its label
    if (existingEdge !== null) {
      var existingLabel = existingEdge.getLabel();

      var labelToMerge = e.getLabel();
      // check if new edge is in reverse direction to existing edge
      // if so, must flip the label before merging it
      if (!existingEdge.isPointwiseEqual(e)) {
        labelToMerge = new Label(e.getLabel());
        labelToMerge.flip();
      }
      var depth = existingEdge.getDepth();
      // if this is the first duplicate found for this edge, initialize the
      // depths
      // /*
      if (depth.isNull()) {
        depth.add(existingLabel);
      }
      // */
      depth.add(labelToMerge);
      existingLabel.merge(labelToMerge);

    } else { // no matching existing edge was found
      // add this new edge to the list of edges in this graph
      // e.setName(name + edges.size());
      // e.getDepth().add(e.getLabel());
      this.edgeList.add(e);
    }
  };


  /**
   * Update the labels for edges according to their depths. For each edge, the
   * depths are first normalized. Then, if the depths for the edge are equal,
   * this edge must have collapsed into a line edge. If the depths are not
   * equal, update the label with the locations corresponding to the depths
   * (i.e. a depth of 0 corresponds to a Location of EXTERIOR, a depth of 1
   * corresponds to INTERIOR)
   *
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.computeLabelsFromDepths = function() {
    for (var it = this.edgeList.iterator(); it.hasNext();) {
      var e = it.next();
      var lbl = e.getLabel();
      var depth = e.getDepth();
      /**
       * Only check edges for which there were duplicates, since these are the
       * only ones which might be the result of dimensional collapses.
       */
      if (!depth.isNull()) {
        depth.normalize();
        for (var i = 0; i < 2; i++) {
          if (!lbl.isNull(i) && lbl.isArea() && !depth.isNull(i)) {
            /**
             * if the depths are equal, this edge is the result of the
             * dimensional collapse of two or more edges. It has the same
             * location on both sides of the edge, so it has collapsed to a
             * line.
             */
            if (depth.getDelta(i) == 0) {
              lbl.toLine(i);
            } else {
              /**
               * This edge may be the result of a dimensional collapse, but it
               * still has different locations on both sides. The label of the
               * edge must be updated to reflect the resultant side locations
               * indicated by the depth values.
               */
              Assert.isTrue(!depth.isNull(i, Position.LEFT),
                  'depth of LEFT side has not been initialized');
              lbl.setLocation(i, Position.LEFT, depth.getLocation(i,
                  Position.LEFT));
              Assert.isTrue(!depth.isNull(i, Position.RIGHT),
                  'depth of RIGHT side has not been initialized');
              lbl.setLocation(i, Position.RIGHT, depth.getLocation(i,
                  Position.RIGHT));
            }
          }
        }
      }
    }
  }
  /**
   * If edges which have undergone dimensional collapse are found, replace them
   * with a new edge which is a L edge
   *
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.replaceCollapsedEdges = function() {
    var newEdges = new ArrayList();
    for (var it = this.edgeList.iterator(); it.hasNext();) {
      var e = it.next();
      if (e.isCollapsed()) {
        it.remove();
        newEdges.add(e.getCollapsedEdge());
      }
    }
    this.edgeList.addAll(newEdges);
  }
  /**
   * Copy all nodes from an arg geometry into this graph. The node label in the
   * arg geometry overrides any previously computed label for that argIndex.
   * (E.g. a node may be an intersection node with a previously computed label
   * of BOUNDARY, but in the original arg Geometry it is actually in the
   * interior due to the Boundary Determination Rule)
   *
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.copyPoints = function(argIndex) {
    for (var i = this.arg[argIndex].getNodeIterator(); i.hasNext();) {
      var graphNode = i.next();
      var newNode = this.graph.addNode(graphNode.getCoordinate());
      newNode.setLabel(argIndex, graphNode.getLabel().getLocation(argIndex));
    }
  }

  /**
   * Compute initial labelling for all DirectedEdges at each node. In this step,
   * DirectedEdges will acquire a complete labelling (i.e. one with labels for
   * both Geometries) only if they are incident on a node which has edges for
   * both Geometries
   *
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.computeLabelling = function() {
    for (var nodeit = this.graph.getNodes().iterator(); nodeit.hasNext();) {
      var node = nodeit.next();
      node.getEdges().computeLabelling(this.arg);
    }
    this.mergeSymLabels();
    this.updateNodeLabelling();
  }
  /**
   * For nodes which have edges from only one Geometry incident on them, the
   * previous step will have left their dirEdges with no labelling for the other
   * Geometry. However, the sym dirEdge may have a labelling for the other
   * Geometry, so merge the two labels.
   *
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.mergeSymLabels = function() {
    for (var nodeit = this.graph.getNodes().iterator(); nodeit.hasNext();) {
      var node = nodeit.next();
      node.getEdges().mergeSymLabels();
    }
  }

  /**
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.updateNodeLabelling = function() {
    // update the labels for nodes
    // The label for a node is updated from the edges incident on it
    // (Note that a node may have already been labelled
    // because it is a point in one of the input geometries)
    for (var nodeit = this.graph.getNodes().iterator(); nodeit.hasNext();) {
      var node = nodeit.next();
      var lbl = node.getEdges().getLabel();
      node.getLabel().merge(lbl);
    }
  }

  /**
   * Incomplete nodes are nodes whose labels are incomplete. (e.g. the location
   * for one Geometry is null). These are either isolated nodes, or nodes which
   * have edges from only a single Geometry incident on them.
   *
   * Isolated nodes are found because nodes in one graph which don't intersect
   * nodes in the other are not completely labelled by the initial process of
   * adding nodes to the nodeList. To complete the labelling we need to check
   * for nodes that lie in the interior of edges, and in the interior of areas.
   * <p>
   * When each node labelling is completed, the labelling of the incident edges
   * is updated, to complete their labelling as well.
   *
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.labelIncompleteNodes = function() {
    var nodeCount = 0;
    for (var ni = this.graph.getNodes().iterator(); ni.hasNext();) {
      var n = ni.next();
      var label = n.getLabel();
      if (n.isIsolated()) {
        nodeCount++;
        if (label.isNull(0))
          this.labelIncompleteNode(n, 0);
        else
          this.labelIncompleteNode(n, 1);
      }
      // now update the labelling for the DirectedEdges incident on this node
      n.getEdges().updateLabelling(label);
    }
  };

  /**
   * Label an isolated node with its relationship to the target geometry.
   *
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.labelIncompleteNode = function(n,
      targetIndex) {
    var loc = this.ptLocator.locate(n.getCoordinate(), this.arg[targetIndex]
        .getGeometry());

    // MD - 2008-10-24 - experimental for now
    // int loc = arg[targetIndex].locate(n.getCoordinate());
    n.getLabel().setLocation(targetIndex, loc);
  };

  /**
   * Find all edges whose label indicates that they are in the result area(s),
   * according to the operation being performed. Since we want polygon shells to
   * be oriented CW, choose dirEdges with the interior of the result on the RHS.
   * Mark them as being in the result. Interior Area edges are the result of
   * dimensional collapses. They do not form part of the result area boundary.
   *
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.findResultAreaEdges = function(
      opCode) {
    for (var it = this.graph.getEdgeEnds().iterator(); it.hasNext();) {
      var de = it.next();
      // mark all dirEdges with the appropriate label
      var label = de.getLabel();
      if (label.isArea() &&
          !de.isInteriorAreaEdge() &&
          jsts.operation.overlay.OverlayOp.isResultOfOp(label.getLocation(0,
              Position.RIGHT), label.getLocation(1, Position.RIGHT), opCode)) {
        de.setInResult(true);
      }
    }
  };
  /**
   * If both a dirEdge and its sym are marked as being in the result, cancel
   * them out.
   *
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.cancelDuplicateResultEdges = function() {
    // remove any dirEdges whose sym is also included
    // (they "cancel each other out")
    for (var it = this.graph.getEdgeEnds().iterator(); it.hasNext();) {
      var de = it.next();
      var sym = de.getSym();
      if (de.isInResult() && sym.isInResult()) {
        de.setInResult(false);
        sym.setInResult(false);
      }
    }
  };
  /**
   * This method is used to decide if a point node should be included in the
   * result or not.
   *
   * @return {boolean} true if the coord point is covered by a result Line or
   *         Area geometry.
   */
  jsts.operation.overlay.OverlayOp.prototype.isCoveredByLA = function(coord) {
    if (this.isCovered(coord, this.resultLineList))
      return true;
    if (this.isCovered(coord, this.resultPolyList))
      return true;
    return false;
  };
  /**
   * This method is used to decide if an L edge should be included in the result
   * or not.
   *
   * @return true if the coord point is covered by a result Area geometry.
   */
  jsts.operation.overlay.OverlayOp.prototype.isCoveredByA = function(coord) {
    if (this.isCovered(coord, this.resultPolyList))
      return true;
    return false;
  };
  /**
   * @return true if the coord is located in the interior or boundary of a
   *         geometry in the list.
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.isCovered = function(coord,
      geomList) {
    for (var it = geomList.iterator(); it.hasNext();) {
      var geom = it.next();
      var loc = this.ptLocator.locate(coord, geom);
      if (loc != Location.EXTERIOR)
        return true;
    }
    return false;
  };

  /**
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.computeGeometry = function(
      resultPointList, resultLineList, resultPolyList, opcode) {
    var geomList = new ArrayList();
    // element geometries of the result are always in the order P,L,A
    geomList.addAll(resultPointList);
    geomList.addAll(resultLineList);
    geomList.addAll(resultPolyList);

    /*
    if (geomList.isEmpty())
      return createEmptyResult(opcode);
    */

    // build the most specific geometry possible
    return this.geomFact.buildGeometry(geomList);
  };

  /**
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.createEmptyResult = function(
      opCode) {
    var result = null;
    switch (resultDimension(opCode, this.arg[0].getGeometry(), this.arg[1]
        .getGeometry())) {
    case -1:
      result = geomFact.createGeometryCollection();
      break;
    case 0:
      result = geomFact.createPoint(null);
      break;
    case 1:
      result = geomFact.createLineString(null);
      break;
    case 2:
      result = geomFact.createPolygon(null, null);
      break;
    }
    return result;
  };

  /**
   * @private
   */
  jsts.operation.overlay.OverlayOp.prototype.resultDimension = function(opCode,
      g0, g1) {
    var dim0 = g0.getDimension();
    var dim1 = g1.getDimension();

    var resultDimension = -1;
    switch (opCode) {
    case jsts.operation.overlay.OverlayOp.INTERSECTION:
      resultDimension = Math.min(dim0, dim1);
      break;
    case jsts.operation.overlay.OverlayOp.UNION:
      resultDimension = Math.max(dim0, dim1);
      break;
    case jsts.operation.overlay.OverlayOp.DIFFERENCE:
      resultDimension = dim0;
      break;
    case jsts.operation.overlay.OverlayOp.SYMDIFFERENCE:
      resultDimension = Math.max(dim0, dim1);
      break;
    }
    return resultDimension;
  };

})();



/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/operation/overlay/OverlayOp.js
   * @requires jsts/operation/overlay/snap/SnapOverlayOp.js
   */

  var OverlayOp = jsts.operation.overlay.OverlayOp;
  var SnapOverlayOp = jsts.operation.overlay.snap.SnapOverlayOp;

  /**
   * Performs an overlay operation using snapping and enhanced precision to
   * improve the robustness of the result. This class only uses snapping if an
   * error is detected when running the standard JTS overlay code. Errors
   * detected include thrown exceptions (in particular,
   * {@link TopologyException}) and invalid overlay computations.
   */
  var SnapIfNeededOverlayOp = function(g1, g2) {
    this.geom = [];
    this.geom[0] = g1;
    this.geom[1] = g2;
  };

  SnapIfNeededOverlayOp.overlayOp = function(g0, g1, opCode) {
    var op = new SnapIfNeededOverlayOp(g0, g1);
    return op.getResultGeometry(opCode);
  };

  SnapIfNeededOverlayOp.intersection = function(g0, g1) {
    return overlayOp(g0, g1, OverlayOp.INTERSECTION);
  };

  SnapIfNeededOverlayOp.union = function(g0, g1) {
    return overlayOp(g0, g1, OverlayOp.UNION);
  };

  SnapIfNeededOverlayOp.difference = function(g0, g1) {
    return overlayOp(g0, g1, OverlayOp.DIFFERENCE);
  };

  SnapIfNeededOverlayOp.symDifference = function(g0, g1) {
    return overlayOp(g0, g1, OverlayOp.SYMDIFFERENCE);
  };

  /**
   * @private
   * @type {Array.<jsts.geom.Geometry}
   */
  SnapIfNeededOverlayOp.prototype.geom = null;


  SnapIfNeededOverlayOp.prototype.getResultGeometry = function(opCode) {
    var result = null;
    var isSuccess = false;
    var savedException = null;
    try {
      result = OverlayOp.overlayOp(this.geom[0], this.geom[1], opCode);
      var isValid = true;
      if (isValid)
        isSuccess = true;

    } catch (ex) {
      savedException = ex;
    }
    if (!isSuccess) {
      // this may still throw an exception
      // if so, throw the original exception since it has the input coordinates
      try {
        result = SnapOverlayOp.overlayOp(this.geom[0], this.geom[1], opCode);
      } catch (ex) {
        throw savedException;
      }
    }
    return result;
  };

  jsts.operation.overlay.snap.SnapIfNeededOverlayOp = SnapIfNeededOverlayOp;

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * The base class for all geometric objects.
 *
 *  <H3>Binary Predicates</H3>
 * Because it is not clear at this time
 * what semantics for spatial
 *  analysis methods involving <code>GeometryCollection</code>s would be useful,
 *  <code>GeometryCollection</code>s are not supported as arguments to binary
 *  predicates (other than <code>convexHull</code>) or the <code>relate</code>
 *  method.
 *
 *  <H3>Set-Theoretic Methods</H3>
 *
 *  The spatial analysis methods will
 *  return the most specific class possible to represent the result. If the
 *  result is homogeneous, a <code>Point</code>, <code>LineString</code>, or
 *  <code>Polygon</code> will be returned if the result contains a single
 *  element; otherwise, a <code>MultiPoint</code>, <code>MultiLineString</code>,
 *  or <code>MultiPolygon</code> will be returned. If the result is
 *  heterogeneous a <code>GeometryCollection</code> will be returned. <P>
 *
 *  Because it is not clear at this time what semantics for set-theoretic
 *  methods involving <code>GeometryCollection</code>s would be useful,
 * <code>GeometryCollections</code>
 *  are not supported as arguments to the set-theoretic methods.
 *
 *  <H4>Representation of Computed Geometries </H4>
 *
 *  The SFS states that the result
 *  of a set-theoretic method is the "point-set" result of the usual
 *  set-theoretic definition of the operation (SFS 3.2.21.1). However, there are
 *  sometimes many ways of representing a point set as a <code>Geometry</code>.
 *  <P>
 *
 *  The SFS does not specify an unambiguous representation of a given point set
 *  returned from a spatial analysis method. One goal of JTS is to make this
 *  specification precise and unambiguous. JTS will use a canonical form for
 *  <code>Geometry</code>s returned from spatial analysis methods. The canonical
 *  form is a <code>Geometry</code> which is simple and noded:
 *  <UL>
 *    <LI> Simple means that the Geometry returned will be simple according to
 *    the JTS definition of <code>isSimple</code>.
 *    <LI> Noded applies only to overlays involving <code>LineString</code>s. It
 *    means that all intersection points on <code>LineString</code>s will be
 *    present as endpoints of <code>LineString</code>s in the result.
 *  </UL>
 *  This definition implies that non-simple geometries which are arguments to
 *  spatial analysis methods must be subjected to a line-dissolve process to
 *  ensure that the results are simple.
 *
 *  <H4> Constructed Points And The Precision Model </H4>
 *
 *  The results computed by the set-theoretic methods may contain constructed
 *  points which are not present in the input <code>Geometry</code>.
 *  These new points arise from intersections between line segments in the
 *  edges of the input <code>Geometry</code>s. In the general case it is not
 *  possible to represent constructed points exactly. This is due to the fact
 *  that the coordinates of an intersection point may contain twice as many bits
 *  of precision as the coordinates of the input line segments. In order to
 *  represent these constructed points explicitly, JTS must truncate them to fit
 *  the <code>PrecisionModel</code>.
 *
 *  Unfortunately, truncating coordinates moves them slightly. Line segments
 *  which would not be coincident in the exact result may become coincident in
 *  the truncated representation. This in turn leads to "topology collapses" --
 *  situations where a computed element has a lower dimension than it would in
 *  the exact result.
 *
 *  When JTS detects topology collapses during the computation of spatial
 *  analysis methods, it will throw an exception. If possible the exception will
 *  report the location of the collapse.
 *
 *  #equals(Object) and #hashCode are not overridden, so that when two
 *  topologically equal Geometries are added to HashMaps and HashSets, they
 *  remain distinct. This behaviour is desired in many cases.
 */

/**
 * Creates a new <tt>Geometry</tt> via the specified GeometryFactory.
 *
 * @constructor
 */
jsts.geom.Geometry = function(factory) {
  this.factory = factory;
};


/**
 * The bounding box of this <code>Geometry</code>.
 */
jsts.geom.Geometry.prototype.envelope = null;

/**
 * The {@link GeometryFactory} used to create this Geometry
 *
 * @protected
 */
jsts.geom.Geometry.prototype.factory = null;


/**
 * Returns the name of this object's <code>com.vivid.jts.geom</code>
 * interface.
 *
 * @return {string} the name of this <code>Geometry</code>s most specific
 *         <code>jsts.geom</code> interface.
 */
jsts.geom.Geometry.prototype.getGeometryType = function() {
  return 'Geometry';
};


/**
 * Returns true if the array contains any non-empty <code>Geometry</code>s.
 *
 * @param {Geometry[]}
 *          geometries an array of <code>Geometry</code>s; no elements may be
 *          <code>null.</code>
 * @return {boolean} <code>true</code> if any of the <code>Geometry</code>s
 *         <code>isEmpty</code> methods return <code>false.</code>
 */
jsts.geom.Geometry.hasNonEmptyElements = function(geometries) {
  var i;
  for (i = 0; i < geometries.length; i++) {
    if (!geometries[i].isEmpty()) {
      return true;
    }
  }
  return false;
};


/**
 * Returns true if the array contains any <code>null</code> elements.
 *
 * @param {Object[]}
 *          array an array to validate.
 * @return {boolean} <code>true</code> if any of <code>array</code>s
 *         elements are <code>null.</code>
 */
jsts.geom.Geometry.hasNullElements = function(array) {
  var i;
  for (i = 0; i < array.length; i++) {
    if (array[i] === null) {
      return true;
    }
  }
  return false;
};


/**
 * Gets the factory which contains the context in which this geometry was
 * created.
 *
 * @return {jsts.geom.GeometryFactory} the factory for this geometry.
 */
jsts.geom.Geometry.prototype.getFactory = function() {
  // NOTE: Geometry could be created without JSTS constructor so need to check
  // for member data
  // TODO: above should not happen
  if (this.factory === null || this.factory === undefined) {
    this.factory = new jsts.geom.GeometryFactory();
  }

  return this.factory;
};


/**
 * Returns the number of {@link Geometry}s in a {@link GeometryCollection} (or
 * 1, if the geometry is not a collection).
 *
 * @return {number} the number of geometries contained in this geometry.
 */
jsts.geom.Geometry.prototype.getNumGeometries = function() {
  return 1;
};


/**
 * Returns an element {@link Geometry} from a {@link GeometryCollection} (or
 * <code>this</code>, if the geometry is not a collection).
 *
 * @param {number}
 *          n the index of the geometry element.
 * @return {Geometry} the n'th geometry contained in this geometry.
 */
jsts.geom.Geometry.prototype.getGeometryN = function(n) {
  return this;
};


/**
 * Returns the <code>PrecisionModel</code> used by the <code>Geometry</code>.
 *
 * @return {PrecisionModel} the specification of the grid of allowable points,
 *         for this <code>Geometry</code> and all other <code>Geometry</code>s.
 */
jsts.geom.Geometry.prototype.getPrecisionModel = function() {
  return this.getFactory().getPrecisionModel();
};



/**
 * Returns a vertex of this <code>Geometry</code> (usually, but not
 * necessarily, the first one). The returned coordinate should not be assumed to
 * be an actual Coordinate object used in the internal representation.
 *
 * @return {Coordinate} a {@link Coordinate} which is a vertex of this
 *         <code>Geometry</code>. null if this Geometry is empty.
 */
jsts.geom.Geometry.prototype.getCoordinate = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns an array containing the values of all the vertices for this geometry.
 * If the geometry is a composite, the array will contain all the vertices for
 * the components, in the order in which the components occur in the geometry.
 * <p>
 * In general, the array cannot be assumed to be the actual internal storage for
 * the vertices. Thus modifying the array may not modify the geometry itself.
 * Use the {@link CoordinateSequence#setOrdinate} method (possibly on the
 * components) to modify the underlying data. If the coordinates are modified,
 * {@link #geometryChanged} must be called afterwards.
 *
 * @return {Coordinate[]} the vertices of this <code>Geometry.</code>
 * @see geometryChanged
 * @see CoordinateSequence#setOrdinate
 */
jsts.geom.Geometry.prototype.getCoordinates = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns the count of this <code>Geometry</code>s vertices. The
 * <code>Geometry</code> s contained by composite <code>Geometry</code>s
 * must be Geometry's; that is, they must implement <code>getNumPoints</code>
 *
 * @return {number} the number of vertices in this <code>Geometry.</code>
 */
jsts.geom.Geometry.prototype.getNumPoints = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Tests whether this {@link Geometry} is simple. In general, the SFS
 * specification of simplicity follows the rule:
 * <UL>
 * <LI> A Geometry is simple iff the only self-intersections are at boundary
 * points.
 * </UL>
 * Simplicity is defined for each {@link Geometry} subclass as follows:
 * <ul>
 * <li>Valid polygonal geometries are simple by definition, so
 * <code>isSimple</code> trivially returns true.
 * <li>Linear geometries are simple iff they do not self-intersect at points
 * other than boundary points.
 * <li>Zero-dimensional geometries (points) are simple iff they have no
 * repeated points.
 * <li>Empty <code>Geometry</code>s are always simple
 * <ul>
 *
 * @return {boolean} <code>true</code> if this <code>Geometry</code> has any
 *         points of self-tangency, self-intersection or other anomalous points.
 * @see #isValid
 */
jsts.geom.Geometry.prototype.isSimple = function() {
  this.checkNotGeometryCollection(this);
  var op = new jsts.operation.IsSimpleOp(this);
  return op.isSimple();
};


/**
 * Tests the validity of this <code>Geometry</code>. Subclasses provide their
 * own definition of "valid".
 *
 * @return {boolean} <code>true</code> if this <code>Geometry</code> is
 *         valid.
 *
 * @see IsValidOp
 */
jsts.geom.Geometry.prototype.isValid = function() {
  var isValidOp = new jsts.operation.valid.IsValidOp(this);
  return isValidOp.isValid();
};


/**
 * Returns whether or not the set of points in this <code>Geometry</code> is
 * empty.
 *
 * @return {boolean} <code>true</code> if this <code>Geometry</code> equals
 *         the empty geometry.
 */
jsts.geom.Geometry.prototype.isEmpty = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns the minimum distance between this <code>Geometry</code> and the
 * <code>Geometry</code> g
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> from which to compute the distance.
 * @return {number} the distance between the geometries. 0 if either input
 *         geometry is empty.
 * @throws IllegalArgumentException
 *           if g is null
 */
jsts.geom.Geometry.prototype.distance = function(g) {
  return jsts.operation.distance.DistanceOp.distance(this, g);
};


/**
 * Tests whether the distance from this <code>Geometry</code> to another is
 * less than or equal to a specified value.
 *
 * @param {Geometry}
 *          geom the Geometry to check the distance to.
 * @param {number}
 *          distance the distance value to compare.
 * @return {boolean} <code>true</code> if the geometries are less than
 *         <code>distance</code> apart.
 */
jsts.geom.Geometry.prototype.isWithinDistance = function(geom, distance) {
  var envDist = this.getEnvelopeInternal().distance(geom.getEnvelopeInternal());
  if (envDist > distance) {
    return false;
  }
  return DistanceOp.isWithinDistance(this, geom, distance);
};

jsts.geom.Geometry.prototype.isRectangle = function() {
  // Polygon overrides to check for actual rectangle
  return false;
};

/**
 * Returns the area of this <code>Geometry</code>. Areal Geometries have a
 * non-zero area. They override this function to compute the area. Others return
 * 0.0
 *
 * @return the area of the Geometry.
 */
jsts.geom.Geometry.prototype.getArea = function() {
  return 0.0;
};

/**
 * Returns the length of this <code>Geometry</code>. Linear geometries return
 * their length. Areal geometries return their perimeter. They override this
 * function to compute the area. Others return 0.0
 *
 * @return the length of the Geometry.
 */
jsts.geom.Geometry.prototype.getLength = function() {
  return 0.0;
};

/**
 * Computes the centroid of this <code>Geometry</code>. The centroid is equal
 * to the centroid of the set of component Geometries of highest dimension
 * (since the lower-dimension geometries contribute zero "weight" to the
 * centroid)
 *
 * @return a {@link Point} which is the centroid of this Geometry.
 */
jsts.geom.Geometry.prototype.getCentroid = function() {
  if (this.isEmpty()) {
    return null;
  }
  var cent;
  var centPt = null;
  var dim = this.getDimension();
  if (dim === 0) {
    cent = new jsts.algorithm.CentroidPoint();
    cent.add(this);
    centPt = cent.getCentroid();
  } else if (dim === 1) {
    cent = new jsts.algorithm.CentroidLine();
    cent.add(this);
    centPt = cent.getCentroid();
  } else {
    cent = new jsts.algorithm.CentroidArea();
    cent.add(this);
    centPt = cent.getCentroid();
  }
  return this.createPointFromInternalCoord(centPt, this);

};


/**
 * Computes an interior point of this <code>Geometry</code>. An interior
 * point is guaranteed to lie in the interior of the Geometry, if it possible to
 * calculate such a point exactly. Otherwise, the point may lie on the boundary
 * of the geometry.
 *
 * @return {Point} a {@link Point} which is in the interior of this Geometry.
 */
jsts.geom.Geometry.prototype.getInteriorPoint = function() {
  var intPt;
  var interiorPt = null;
  var dim = this.getDimension();
  if (dim === 0) {
    intPt = new jsts.algorithm.InteriorPointPoint(this);
    interiorPt = intPt.getInteriorPoint();
  } else if (dim === 1) {
    intPt = new jsts.algorithm.InteriorPointLine(this);
    interiorPt = intPt.getInteriorPoint();
  } else {
    intPt = new jsts.algorithm.InteriorPointArea(this);
    interiorPt = intPt.getInteriorPoint();
  }
  return this.createPointFromInternalCoord(interiorPt, this);
};


/**
 * Returns the dimension of this geometry. The dimension of a geometry is is the
 * topological dimension of its embedding in the 2-D Euclidean plane. In the JTS
 * spatial model, dimension values are in the set {0,1,2}.
 * <p>
 * Note that this is a different concept to the dimension of the vertex
 * {@link Coordinate}s. The geometry dimension can never be greater than the
 * coordinate dimension. For example, a 0-dimensional geometry (e.g. a Point)
 * may have a coordinate dimension of 3 (X,Y,Z).
 *
 * @return {number} the topological dimension of this geometry.
 */
jsts.geom.Geometry.prototype.getDimension = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns the boundary, or an empty geometry of appropriate dimension if this
 * <code>Geometry</code> is empty. (In the case of zero-dimensional
 * geometries, ' an empty GeometryCollection is returned.) For a discussion of
 * this function, see the OpenGIS Simple Features Specification. As stated in
 * SFS Section 2.1.13.1, "the boundary of a Geometry is a set of Geometries of
 * the next lower dimension."
 *
 * @return {Geometry} the closure of the combinatorial boundary of this
 *         <code>Geometry.</code>
 */
jsts.geom.Geometry.prototype.getBoundary = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns the dimension of this <code>Geometry</code>s inherent boundary.
 *
 * @return {number} the dimension of the boundary of the class implementing this
 *         interface, whether or not this object is the empty geometry. Returns
 *         <code>Dimension.FALSE</code> if the boundary is the empty geometry.
 */
jsts.geom.Geometry.prototype.getBoundaryDimension = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns this <code>Geometry</code>s bounding box. If this
 * <code>Geometry</code> is the empty geometry, returns an empty
 * <code>Point</code>. If the <code>Geometry</code> is a point, returns a
 * non-empty <code>Point</code>. Otherwise, returns a <code>Polygon</code>
 * whose points are (minx, miny), (maxx, miny), (maxx, maxy), (minx, maxy),
 * (minx, miny).
 *
 * @return {Geometry} an empty <code>Point</code> (for empty
 *         <code>Geometry</code>s), a <code>Point</code> (for
 *         <code>Point</code>s) or a <code>Polygon</code> (in all other
 *         cases).
 */
jsts.geom.Geometry.prototype.getEnvelope = function() {
  return this.getFactory().toGeometry(this.getEnvelopeInternal());
};


/**
 * Returns the minimum and maximum x and y values in this <code>Geometry</code>,
 * or a null <code>Envelope</code> if this <code>Geometry</code> is empty.
 *
 * @return {Envelope} this <code>Geometry</code>s bounding box; if the
 *         <code>Geometry</code> is empty, <code>Envelope#isNull</code> will
 *         return <code>true.</code>
 */
jsts.geom.Geometry.prototype.getEnvelopeInternal = function() {
  if (this.envelope === null) {
    this.envelope = this.computeEnvelopeInternal();
  }
  return this.envelope;
};


/**
 * Tests whether this geometry is disjoint from the specified geometry.
 * <p>
 * The <code>disjoint</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The two geometries have no point in common
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[FF*FF****]</code>
 * <li><code>! g.intersects(this)</code> (<code>disjoint</code> is the
 * inverse of <code>intersects</code>)
 * </ul>
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         are disjoint.
 *
 * @see Geometry#intersects
 */
jsts.geom.Geometry.prototype.disjoint = function(g) {
  return !this.intersects(g);
};


/**
 * Tests whether this geometry touches the specified geometry.
 * <p>
 * The <code>touches</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The geometries have at least one point in common, but their interiors do
 * not intersect.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[FT*******]</code> or <code>[F**T*****]</code> or
 * <code>[F***T****]</code>
 * </ul>
 * If both geometries have dimension 0, this predicate returns
 * <code>false</code>
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         touch; Returns <code>false</code> if both <code>Geometry</code>s
 *         are points.
 */
jsts.geom.Geometry.prototype.touches = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())) {
    return false;
  }
  return this.relate(g).isTouches(this.getDimension(), g.getDimension());
};


/**
 * Tests whether this geometry intersects the specified geometry.
 * <p>
 * The <code>intersects</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The two geometries have at least one point in common
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[T********]</code> or <code>[*T*******]</code> or
 * <code>[***T*****]</code> or <code>[****T****]</code>
 * <li><code>! g.disjoint(this)</code> (<code>intersects</code> is the
 * inverse of <code>disjoint</code>)
 * </ul>
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         intersect.
 *
 * @see Geometry#disjoint
 */
jsts.geom.Geometry.prototype.intersects = function(g) {

  // short-circuit envelope test
  if (!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())) {
    return false;
  }

  // optimization for rectangle arguments
  if (this.isRectangle()) {
    return RectangleIntersects.intersects(this, g);
  }
  if (g.isRectangle()) {
    return RectangleIntersects.intersects(g, this);
  }
  // general case
  return this.relate(g).isIntersects();
};


/**
 * Tests whether this geometry crosses the specified geometry.
 * <p>
 * The <code>crosses</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The geometries have some but not all interior points in common.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <ul>
 * <li><code>[T*T******]</code> (for P/L, P/A, and L/A situations)
 * <li><code>[T*****T**]</code> (for L/P, A/P, and A/L situations)
 * <li><code>[0********]</code> (for L/L situations)
 * </ul>
 * </ul>
 * For any other combination of dimensions this predicate returns
 * <code>false</code>.
 * <p>
 * The SFS defined this predicate only for P/L, P/A, L/L, and L/A situations.
 * JTS extends the definition to apply to L/P, A/P and A/L situations as well,
 * in order to make the relation symmetric.
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         cross.
 */
jsts.geom.Geometry.prototype.crosses = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())) {
    return false;
  }
  return this.relate(g).isCrosses(this.getDimension(), g.getDimension());
};


/**
 * Tests whether this geometry is within the specified geometry.
 * <p>
 * The <code>within</code> predicate has the following equivalent definitions:
 * <ul>
 * <li>Every point of this geometry is a point of the other geometry, and the
 * interiors of the two geometries have at least one point in common.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[T*F**F***]</code>
 * <li><code>g.contains(this)</code> (<code>within</code> is the converse
 * of <code>contains</code>)
 * </ul>
 * An implication of the definition is that "The boundary of a Geometry is not
 * within the Geometry". In other words, if a geometry A is a subset of the
 * points in the boundary of a geomtry B, <code>A.within(B) = false</code>
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if this <code>Geometry</code> is
 *         within <code>other.</code>
 *
 * @see Geometry#contains
 */
jsts.geom.Geometry.prototype.within = function(g) {
  return g.contains(this);
};


/**
 * Tests whether this geometry contains the specified geometry.
 * <p>
 * The <code>contains</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>Every point of the other geometry is a point of this geometry, and the
 * interiors of the two geometries have at least one point in common.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[T*****FF*]</code>
 * <li><code>g.within(this)</code> (<code>contains</code> is the converse
 * of <code>within</code>)
 * </ul>
 * An implication of the definition is that "Geometries do not contain their
 * boundary". In other words, if a geometry A is a subset of the points in the
 * boundary of a geometry B, <code>B.contains(A) = false</code>
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if this <code>Geometry</code>
 *         contains <code>g.</code>
 *
 * @see Geometry#within
 */
jsts.geom.Geometry.prototype.contains = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().contains(g.getEnvelopeInternal())) {
    return false;
  }
  // optimization for rectangle arguments
  if (this.isRectangle()) {
    return RectangleContains.contains(this, g);
  }
  // general case
  return this.relate(g).isContains();
};


/**
 * Tests whether this geometry overlaps the specified geometry.
 * <p>
 * The <code>overlaps</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The geometries have at least one point each not shared by the other (or
 * equivalently neither covers the other), they have the same dimension, and the
 * intersection of the interiors of the two geometries has the same dimension as
 * the geometries themselves.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[T*T***T**]</code> (for two points or two surfaces) or
 * <code>[1*T***T**]</code> (for two curves)
 * </ul>
 * If the geometries are of different dimension this predicate returns
 * <code>false</code>.
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         overlap.
 */
jsts.geom.Geometry.prototype.overlaps = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().intersects(g.getEnvelopeInternal())) {
    return false;
  }
  return this.relate(g).isOverlaps(this.getDimension(), g.getDimension());
};


/**
 * Tests whether this geometry covers the specified geometry.
 * <p>
 * The <code>covers</code> predicate has the following equivalent definitions:
 * <ul>
 * <li>Every point of the other geometry is a point of this geometry.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[T*****FF*]</code> or <code>[*T****FF*]</code> or
 * <code>[***T**FF*]</code> or <code>[****T*FF*]</code>
 * <li><code>g.coveredBy(this)</code> (<code>covers</code> is the converse
 * of <code>coveredBy</code>)
 * </ul>
 * If either geometry is empty, the value of this predicate is <tt>false</tt>.
 * <p>
 * This predicate is similar to {@link #contains}, but is more inclusive (i.e.
 * returns <tt>true</tt> for more cases). In particular, unlike
 * <code>contains</code> it does not distinguish between points in the
 * boundary and in the interior of geometries. For most situations,
 * <code>covers</code> should be used in preference to <code>contains</code>.
 * As an added benefit, <code>covers</code> is more amenable to optimization,
 * and hence should be more performant.
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if this <code>Geometry</code> covers
 *         <code>g.</code>
 *
 * @see Geometry#contains
 * @see Geometry#coveredBy
 */
jsts.geom.Geometry.prototype.covers = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().covers(g.getEnvelopeInternal())) {
    return false;
  }
  // optimization for rectangle arguments
  if (this.isRectangle()) {
    // since we have already tested that the test envelope is covered
    return true;
  }
  return this.relate(g).isCovers();
};


/**
 * Tests whether this geometry is covered by the specified geometry.
 * <p>
 * The <code>coveredBy</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>Every point of this geometry is a point of the other geometry.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches
 * <code>[T*F**F***]</code> or <code>[*TF**F***]</code> or
 * <code>[**FT*F***]</code> or <code>[**F*TF***]</code>
 * <li><code>g.covers(this)</code> (<code>coveredBy</code> is the converse
 * of <code>covers</code>)
 * </ul>
 * If either geometry is empty, the value of this predicate is <tt>false</tt>.
 * <p>
 * This predicate is similar to {@link #within}, but is more inclusive (i.e.
 * returns <tt>true</tt> for more cases).
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if this <code>Geometry</code> is
 *         covered by <code>g.</code>
 *
 * @see Geometry#within
 * @see Geometry#covers
 */
jsts.geom.Geometry.prototype.coveredBy = function(g) {
  return g.covers(this);
};


/**
 * Tests whether the elements in the DE-9IM {@link IntersectionMatrix} for the
 * two <code>Geometry</code>s match the elements in
 * <code>intersectionPattern</code>. The pattern is a 9-character string,
 * with symbols drawn from the following set:
 * <UL>
 * <LI> 0 (dimension 0)
 * <LI> 1 (dimension 1)
 * <LI> 2 (dimension 2)
 * <LI> T ( matches 0, 1 or 2)
 * <LI> F ( matches FALSE)
 * <LI> * ( matches any value)
 * </UL>
 * For more information on the DE-9IM, see the <i>OpenGIS Simple Features
 * Specification</i>.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @param {string}
 *          intersectionPattern the pattern against which to check the
 *          intersection matrix for the two <code>Geometry</code>s.
 * @return {boolean} <code>true</code> if the DE-9IM intersection matrix for
 *         the two <code>Geometry</code>s match
 *         <code>intersectionPattern.</code>
 * @see IntersectionMatrix
 */
jsts.geom.Geometry.prototype.relate = function(g, intersectionPattern) {
  if (arguments.length === 1) {
    return this.relate2.apply(this, arguments);
  }

  return this.relate2(g).matches(intersectionPattern);
};


/**
 * Returns the DE-9IM {@link IntersectionMatrix} for the two
 * <code>Geometry</code>s.
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {IntersectionMatrix} an {@link IntersectionMatrix} describing the
 *         intersections of the interiors, boundaries and exteriors of the two
 *         <code>Geometry</code>s.
 */
jsts.geom.Geometry.prototype.relate2 = function(g) {
  this.checkNotGeometryCollection(this);
  this.checkNotGeometryCollection(g);
  return jsts.operation.relate.RelateOp.relate(this, g);
};


/**
 * Tests whether this geometry is topologically equal to the argument geometry
 * as defined by the SFS <tt>equals</tt> predicate.
 * <p>
 * The SFS <code>equals</code> predicate has the following equivalent
 * definitions:
 * <ul>
 * <li>The two geometries have at least one point in common, and no point of
 * either geometry lies in the exterior of the other geometry.
 * <li>The DE-9IM Intersection Matrix for the two geometries matches the
 * pattern <tt>T*F**FFF*</tt>
 * <pre>
 * T*F
 * **F
 * FF*
 * </pre>
 *
 * </ul>
 * <b>Note</b> that this method computes <b>topologically equality</b>. For
 * structural equality, see {@link #equalsExact(Geometry)}.
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {boolean} <code>true</code> if the two <code>Geometry</code>s
 *         are topologically equal.
 *
 * @see #equalsExact(Geometry)
 */
jsts.geom.Geometry.prototype.equalsTopo = function(g) {
  // short-circuit test
  if (!this.getEnvelopeInternal().equals(g.getEnvelopeInternal())) {
    return false;
  }
  return this.relate(g).isEquals(this.getDimension(), g.getDimension());
};


/**
 * Tests whether this geometry is structurally and numerically equal to a given
 * <tt>Object</tt>. If the argument <tt>Object</tt> is not a
 * <tt>Geometry</tt>, the result is <tt>false</tt>. Otherwise, the result
 * is computed using {@link #equalsExact(Geometry)}.
 * <p>
 * This method is provided to fulfill the Java contract for value-based object
 * equality. In conjunction with {@link #hashCode()} it provides semantics which
 * are most useful for using <tt>Geometry</tt>s as keys and values in Java
 * collections.
 * <p>
 * Note that to produce the expected result the input geometries should be in
 * normal form. It is the caller's responsibility to perform this where required
 * (using {@link Geometry#norm() or {@link #normalize()} as appropriate).
 *
 * @param {Object}
 *          o the Object to compare.
 * @return {boolean} true if this geometry is exactly equal to the argument.
 *
 * @see #equalsExact(Geometry)
 * @see #hashCode()
 * @see #norm()
 * @see #normalize()
 */
jsts.geom.Geometry.prototype.equals = function(o) {
  if (o instanceof jsts.geom.Geometry || o instanceof jsts.geom.LinearRing ||
      o instanceof jsts.geom.Polygon ||
      o instanceof jsts.geom.GeometryCollection ||
      o instanceof jsts.geom.MultiPoint ||
      o instanceof jsts.geom.MultiLineString ||
      o instanceof jsts.geom.MultiPolygon) {
    return this.equalsExact(o);
  }
  return false;
};

/**
 * Computes a buffer area around this geometry having the given width and with a
 * specified accuracy of approximation for circular arcs, and using a specified
 * end cap style.
 * <p>
 * Mathematically-exact buffer area boundaries can contain circular arcs. To
 * represent these arcs using linear geometry they must be approximated with
 * line segments. The <code>quadrantSegments</code> argument allows
 * controlling the accuracy of the approximation by specifying the number of
 * line segments used to represent a quadrant of a circle
 * <p>
 * The end cap style specifies the buffer geometry that will be created at the
 * ends of linestrings. The styles provided are:
 * <ul>
 * <li><tt>BufferOp.CAP_ROUND</tt> - (default) a semi-circle
 * <li><tt>BufferOp.CAP_BUTT</tt> - a straight line perpendicular to the end
 * segment
 * <li><tt>BufferOp.CAP_SQUARE</tt> - a half-square
 * </ul>
 * <p>
 * The buffer operation always returns a polygonal result. The negative or
 * zero-distance buffer of lines and points is always an empty {@link Polygon}.
 * This is also the result for the buffers of degenerate (zero-area) polygons.
 *
 * @param {number}
 *          distance the width of the buffer (may be positive, negative or 0).
 * @param {number}
 *          quadrantSegments the number of line segments used to represent a
 *          quadrant of a circle.
 * @param {number}
 *          endCapStyle the end cap style to use.
 * @return {Geometry} a polygonal geometry representing the buffer region (which
 *         may be empty).
 *
 * @throws TopologyException
 *           if a robustness error occurs
 *
 * @see #buffer(double)
 * @see #buffer(double, int)
 * @see BufferOp
 */
jsts.geom.Geometry.prototype.buffer = function(distance, quadrantSegments, endCapStyle) {
  var params = new jsts.operation.buffer.BufferParameters(quadrantSegments, endCapStyle)
  return jsts.operation.buffer.BufferOp.bufferOp2(this, distance, params);
};


/**
 * Computes the smallest convex <code>Polygon</code> that contains all the
 * points in the <code>Geometry</code>. This obviously applies only to
 * <code>Geometry</code> s which contain 3 or more points; the results for
 * degenerate cases are specified as follows: <TABLE>
 * <TR>
 * <TH> Number of <code>Point</code>s in argument <code>Geometry</code>
 * </TH>
 * <TH> <code>Geometry</code> class of result </TH>
 * </TR>
 * <TR>
 * <TD> 0 </TD>
 * <TD> empty <code>GeometryCollection</code> </TD>
 * </TR>
 * <TR>
 * <TD> 1 </TD>
 * <TD> <code>Point</code> </TD>
 * </TR>
 * <TR>
 * <TD> 2 </TD>
 * <TD> <code>LineString</code> </TD>
 * </TR>
 * <TR>
 * <TD> 3 or more </TD>
 * <TD> <code>Polygon</code> </TD>
 * </TR>
 * </TABLE>
 *
 * @return {Geometry} the minimum-area convex polygon containing this
 *         <code>Geometry</code>' s points.
 */
jsts.geom.Geometry.prototype.convexHull = function() {
  return new jsts.algorithm.ConvexHull(this).getConvexHull();
};


/**
 * Computes a <code>Geometry</code> representing the points shared by this
 * <code>Geometry</code> and <code>other</code>. {@link GeometryCollection}s
 * support intersection with homogeneous collection types, with the semantics
 * that the result is a {@link GeometryCollection} of the intersection of each
 * element of the target with the argument.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compute the
 *          intersection.
 * @return {Geometry} the points common to the two <code>Geometry</code>s.
 * @throws TopologyException
 *           if a robustness error occurs
 * @throws IllegalArgumentException
 *           if the argument is a non-empty GeometryCollection
 */
jsts.geom.Geometry.prototype.intersection = function(other) {
  /**
   * TODO: MD - add optimization for P-A case using Point-In-Polygon
   */
  // special case: if one input is empty ==> empty
  if (this.isEmpty()) {
    return this.getFactory().createGeometryCollection(null);
  }
  if (other.isEmpty()) {
    return this.getFactory().createGeometryCollection(null);
  }

  // compute for GCs
  if (this.isGeometryCollection(this)) {
    var g2 = other;
    // TODO: probably not straightforward to port...
    /*
     * return GeometryCollectionMapper.map(this, new
     * GeometryCollectionMapper.MapOp() { public Geometry map(Geometry g) {
     * return g.intersection(g2); } });
     */
  }

  this.checkNotGeometryCollection(this);
  this.checkNotGeometryCollection(other);
  return jsts.operation.overlay.snap.SnapIfNeededOverlayOp.overlayOp(this,
      other, jsts.operation.overlay.OverlayOp.INTERSECTION);
};


/**
 * Computes a <code>Geometry</code> representing all the points in this
 * <code>Geometry</code> and <code>other</code>.
 *
 * Or without arguments:
 *
 * Computes the union of all the elements of this geometry. Heterogeneous
 * {@link GeometryCollection}s are fully supported.
 *
 * The result obeys the following contract:
 * <ul>
 * <li>Unioning a set of {@link LineString}s has the effect of fully noding
 * and dissolving the linework.
 * <li>Unioning a set of {@link Polygon}s will always return a
 * {@link Polygonal} geometry (unlike {link #union(Geometry)}, which may return
 * geometrys of lower dimension if a topology collapse occurred.
 * </ul>
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compute the union.
 * @return {Geometry} a set combining the points of this <code>Geometry</code>
 *         and the points of <code>other.</code>
 * @throws TopologyException
 *           if a robustness error occurs
 * @throws IllegalArgumentException
 *           if either input is a non-empty GeometryCollection
 */
jsts.geom.Geometry.prototype.union = function(other) {
  if (arguments.length === 0) {
    return jsts.operation.union.UnaryUnionOp.union(this);
  }

  // special case: if either input is empty ==> other input
  if (this.isEmpty()) {
    return other.clone();
  }
  if (other.isEmpty()) {
    return this.clone();
  }

  // TODO: optimize if envelopes of geometries do not intersect

  this.checkNotGeometryCollection(this);
  this.checkNotGeometryCollection(other);
  return jsts.operation.overlay.snap.SnapIfNeededOverlayOp.overlayOp(this,
      other, jsts.operation.overlay.OverlayOp.UNION);
};


/**
 * Computes a <code>Geometry</code> representing the points making up this
 * <code>Geometry</code> that do not make up <code>other</code>. This
 * method returns the closure of the resultant <code>Geometry</code>.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compute the
 *          difference.
 * @return {Geometry} the point set difference of this <code>Geometry</code>
 *         with <code>other.</code>
 * @throws TopologyException
 *           if a robustness error occurs
 * @throws IllegalArgumentException
 *           if either input is a non-empty GeometryCollection
 */
jsts.geom.Geometry.prototype.difference = function(other) {
  // mod to handle empty cases better - return type of input
  // if (this.isEmpty() || other.isEmpty()) return (Geometry) clone();

  // special case: if A.isEmpty ==> empty; if B.isEmpty ==> A
  if (this.isEmpty()) {
    return this.getFactory().createGeometryCollection(null);
  }
  if (other.isEmpty()) {
    return this.clone();
  }

  this.checkNotGeometryCollection(this);
  this.checkNotGeometryCollection(other);
  return jsts.operation.overlay.snap.SnapIfNeededOverlayOp.overlayOp(this,
      other, jsts.operation.overlay.OverlayOp.DIFFERENCE);
};


/**
 * Returns a set combining the points in this <code>Geometry</code> not in
 * <code>other</code>, and the points in <code>other</code> not in this
 * <code>Geometry</code>. This method returns the closure of the resultant
 * <code>Geometry</code>.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compute the
 *          symmetric difference.
 * @return {Geometry} the point set symmetric difference of this
 *         <code>Geometry</code> with <code>other.</code>
 * @throws TopologyException
 *           if a robustness error occurs
 * @throws IllegalArgumentException
 *           if either input is a non-empty GeometryCollection
 */
jsts.geom.Geometry.prototype.symDifference = function(other) {
  // special case: if either input is empty ==> other input
  if (this.isEmpty()) {
    return other.clone();
  }
  if (other.isEmpty()) {
    return this.clone();
  }

  this.checkNotGeometryCollection(this);
  this.checkNotGeometryCollection(other);
  return jsts.operation.overlay.snap.SnapIfNeededOverlayOp.overlayOp(this,
      other, jsts.operation.overlay.OverlayOp.SYMDIFFERENCE);
};

/**
 * Returns true if the two <code>Geometry</code>s are exactly equal, up to a
 * specified distance tolerance. Two Geometries are exactly equal within a
 * distance tolerance if and only if:
 * <ul>
 * <li>they have the same class
 * <li>they have the same values for their vertices, within the given tolerance
 * distance, in exactly the same order.
 * </ul>
 * If this and the other <code>Geometry</code>s are composites and any
 * children are not <code>Geometry</code>s, returns <code>false</code>.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @param {number}
 *          tolerance distance at or below which two <code>Coordinate</code>s
 *          are considered equal.
 * @return {boolean}
 */
jsts.geom.Geometry.prototype.equalsExact = function(other, tolerance) {
  throw new jsts.error.AbstractMethodInvocationError();
};

/**
 * Tests whether two geometries are exactly equal in their normalized forms.
 * This is a convenience method which creates normalized versions of both
 * geometries before computing {@link #equalsExact(Geometry)}. This method is
 * relatively expensive to compute. For maximum performance, the client should
 * instead perform normalization itself at an appropriate point during
 * execution.
 *
 * @param {Geometry}
 *          g a Geometry.
 * @return {boolean} true if the input geometries are exactly equal in their
 *         normalized form.
 */
jsts.geom.Geometry.prototype.equalsNorm = function(g) {
  if (g === null || g === undefined)
    return false;
  return this.norm().equalsExact(g.norm());
};


/**
 * Performs an operation with or on this <code>Geometry</code> and its
 * subelement <code>Geometry</code>s (if any). Only GeometryCollections and
 * subclasses have subelement Geometry's.
 *
 * @param filter
 *          the filter to apply to this <code>Geometry</code> (and its
 *          children, if it is a <code>GeometryCollection</code>).
 */
jsts.geom.Geometry.prototype.apply = function(filter) {
  throw new jsts.error.AbstractMethodInvocationError();
};

/**
 * Creates and returns a full copy of this {@link Geometry} object (including
 * all coordinates contained by it). Subclasses are responsible for overriding
 * this method and copying their internal data. Overrides should call this
 * method first.
 *
 * @return a clone of this instance.
 */
jsts.geom.Geometry.prototype.clone = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Converts this <code>Geometry</code> to <b>normal form</b> (or <b>
 * canonical form</b> ). Normal form is a unique representation for
 * <code>Geometry</code> s. It can be used to test whether two
 * <code>Geometry</code>s are equal in a way that is independent of the
 * ordering of the coordinates within them. Normal form equality is a stronger
 * condition than topological equality, but weaker than pointwise equality. The
 * definitions for normal form use the standard lexicographical ordering for
 * coordinates. "Sorted in order of coordinates" means the obvious extension of
 * this ordering to sequences of coordinates.
 */
jsts.geom.Geometry.prototype.normalize = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};

/**
 * Creates a new Geometry which is a normalized copy of this Geometry.
 *
 * @return a normalized copy of this geometry.
 * @see #normalize()
 */
jsts.geom.Geometry.prototype.norm = function() {
  var copy = this.clone();
  copy.normalize();
  return copy;
};


/**
 * Returns whether this <code>Geometry</code> is greater than, equal to, or
 * less than another <code>Geometry</code>.
 * <P>
 *
 * If their classes are different, they are compared using the following
 * ordering:
 * <UL>
 * <LI> Point (lowest)
 * <LI> MultiPoint
 * <LI> LineString
 * <LI> LinearRing
 * <LI> MultiLineString
 * <LI> Polygon
 * <LI> MultiPolygon
 * <LI> GeometryCollection (highest)
 * </UL>
 * If the two <code>Geometry</code>s have the same class, their first
 * elements are compared. If those are the same, the second elements are
 * compared, etc.
 *
 * @param {Geometry}
 *          other a <code>Geometry</code> with which to compare this
 *          <code>Geometry.</code>
 * @return {number} a positive number, 0, or a negative number, depending on
 *         whether this object is greater than, equal to, or less than
 *         <code>o</code>, as defined in "Normal Form For Geometry" in the
 *         JTS Technical Specifications.
 */
jsts.geom.Geometry.prototype.compareTo = function(o) {
  var other = o;
  if (this.getClassSortIndex() !== other.getClassSortIndex()) {
    return this.getClassSortIndex() - other.getClassSortIndex();
  }
  if (this.isEmpty() && other.isEmpty()) {
    return 0;
  }
  if (this.isEmpty()) {
    return -1;
  }
  if (other.isEmpty()) {
    return 1;
  }
  return this.compareToSameClass(o);
};

/**
 * Returns whether the two <code>Geometry</code>s are equal, from the point
 * of view of the <code>equalsExact</code> method. Called by
 * <code>equalsExact</code> . In general, two <code>Geometry</code> classes
 * are considered to be "equivalent" only if they are the same class. An
 * exception is <code>LineString</code> , which is considered to be equivalent
 * to its subclasses.
 *
 * @param {Geometry}
 *          other the <code>Geometry</code> with which to compare this
 *          <code>Geometry</code> for equality.
 * @return {boolean} <code>true</code> if the classes of the two
 *         <code>Geometry</code> s are considered to be equal by the
 *         <code>equalsExact</code> method.
 */
jsts.geom.Geometry.prototype.isEquivalentClass = function(other) {
  if (this instanceof jsts.geom.Point && other instanceof jsts.geom.Point) {
    return true;
  } else if (this instanceof jsts.geom.LineString &&
      (other instanceof jsts.geom.LineString | other instanceof jsts.geom.LinearRing)) {
    return true;
  } else if (this instanceof jsts.geom.LinearRing &&
      (other instanceof jsts.geom.LineString | other instanceof jsts.geom.LinearRing)) {
    return true;
  } else if (this instanceof jsts.geom.Polygon &&
      (other instanceof jsts.geom.Polygon)) {
    return true;
  } else if (this instanceof jsts.geom.MultiPoint &&
      (other instanceof jsts.geom.MultiPoint)) {
    return true;
  } else if (this instanceof jsts.geom.MultiLineString &&
      (other instanceof jsts.geom.MultiLineString)) {
    return true;
  } else if (this instanceof jsts.geom.MultiPolygon &&
      (other instanceof jsts.geom.MultiPolygon)) {
    return true;
  } else if (this instanceof jsts.geom.GeometryCollection &&
      (other instanceof jsts.geom.GeometryCollection)) {
    return true;
  }

  return false;
};



/**
 * Throws an exception if <code>g</code>'s class is
 * <code>GeometryCollection</code> . (Its subclasses do not trigger an
 * exception).
 *
 * @param {Geometry}
 *          g the <code>Geometry</code> to check.
 * @throws Error
 *           if <code>g</code> is a <code>GeometryCollection</code> but not
 *           one of its subclasses
 */
jsts.geom.Geometry.prototype.checkNotGeometryCollection = function(g) {
  if (g.isGeometryCollectionBase()) {
    throw new jsts.error.IllegalArgumentError(
        'This method does not support GeometryCollection');
  }
};


/**
 *
 * @return {boolean} true if this is a GeometryCollection.
 */
jsts.geom.Geometry.prototype.isGeometryCollection = function() {
  return (this instanceof jsts.geom.GeometryCollection);
};

/**
 *
 * @return {boolean} true if this is a GeometryCollection but not subclass.
 */
jsts.geom.Geometry.prototype.isGeometryCollectionBase = function() {
  return (this.CLASS_NAME === 'jsts.geom.GeometryCollection');
};


/**
 * Returns the minimum and maximum x and y values in this <code>Geometry</code>,
 * or a null <code>Envelope</code> if this <code>Geometry</code> is empty.
 * Unlike <code>getEnvelopeInternal</code>, this method calculates the
 * <code>Envelope</code> each time it is called;
 * <code>getEnvelopeInternal</code> caches the result of this method.
 *
 * @return {Envelope} this <code>Geometry</code>s bounding box; if the
 *         <code>Geometry</code> is empty, <code>Envelope#isNull</code> will
 *         return <code>true.</code>
 */
jsts.geom.Geometry.prototype.computeEnvelopeInternal = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Returns whether this <code>Geometry</code> is greater than, equal to, or
 * less than another <code>Geometry</code> having the same class.
 *
 * @param o
 *          a <code>Geometry</code> having the same class as this
 *          <code>Geometry.</code>
 * @return a positive number, 0, or a negative number, depending on whether this
 *         object is greater than, equal to, or less than <code>o</code>, as
 *         defined in "Normal Form For Geometry" in the JTS Technical
 *         Specifications.
 */
jsts.geom.Geometry.prototype.compareToSameClass = function(o) {
  throw new jsts.error.AbstractMethodInvocationError();
};

/**
 * Returns the first non-zero result of <code>compareTo</code> encountered as
 * the two <code>Collection</code>s are iterated over. If, by the time one of
 * the iterations is complete, no non-zero result has been encountered, returns
 * 0 if the other iteration is also complete. If <code>b</code> completes
 * before <code>a</code>, a positive number is returned; if a before b, a
 * negative number.
 *
 * @param {Array}
 *          a a <code>Collection</code> of <code>Comparable</code>s.
 * @param {Array}
 *          b a <code>Collection</code> of <code>Comparable</code>s.
 * @return {number} the first non-zero <code>compareTo</code> result, if any;
 *         otherwise, zero.
 */
jsts.geom.Geometry.prototype.compare = function(a, b) {
  var i = a.iterator();
  var j = b.iterator();
  while (i.hasNext() && j.hasNext()) {
    var aElement = i.next();
    var bElement = j.next();
    var comparison = aElement.compareTo(bElement);
    if (comparison !== 0) {
      return comparison;
    }
  }
  if (i.hasNext()) {
    return 1;
  }
  if (j.hasNext()) {
    return -1;
  }
  return 0;
};


/**
 * @param {jsts.geom.Coordinate}
 *          a first Coordinate to compare.
 * @param {jsts.geom.Coordinate}
 *          b second Coordinate to compare.
 * @param {number}
 *          tolerance tolerance when comparing.
 * @return {boolean} true if equal.
 */
jsts.geom.Geometry.prototype.equal = function(a, b, tolerance) {
  if (tolerance === undefined || tolerance === null || tolerance === 0) {
    return a.equals(b);
  }
  return a.distance(b) <= tolerance;
};

/**
 * @private
 */
jsts.geom.Geometry.prototype.getClassSortIndex = function() {
  var sortedClasses = [jsts.geom.Point, jsts.geom.MultiPoint,
      jsts.geom.LineString, jsts.geom.LinearRing, jsts.geom.MultiLineString,
      jsts.geom.Polygon, jsts.geom.MultiPolygon, jsts.geom.GeometryCollection];

  for (var i = 0; i < sortedClasses.length; i++) {
    if (this instanceof sortedClasses[i])
      return i;
  }
  jsts.util.Assert.shouldNeverReachHere('Class not supported: ' + this);
  return -1;
};

jsts.geom.Geometry.prototype.toString = function() {
  return new jsts.io.WKTWriter().write(this);
};

/**
 * @return {Point}
 * @private
 */
jsts.geom.Geometry.prototype.createPointFromInternalCoord = function(coord,
    exemplar) {
  exemplar.getPrecisionModel().makePrecise(coord);
  return exemplar.getFactory().createPoint(coord);
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * @requires jsts/geom/Coordinate.js
 * @requires jsts/geom/Geometry.js
 */



/**
 * @constructor
 * @extends jsts.geom.Geometry
 */
jsts.geom.Point = function(coordinate, factory) {
  this.factory = factory;

  if (coordinate === undefined)
    return;

  this.coordinate = coordinate;
};

jsts.geom.Point.prototype = new jsts.geom.Geometry();
jsts.geom.Point.constructor = jsts.geom.Point;


jsts.geom.Point.CLASS_NAME = 'jsts.geom.Point';


jsts.geom.Point.prototype.coordinate = null;


/**
 * @return {number} x-axis value of this Point.
 */
jsts.geom.Point.prototype.getX = function() {
  return this.coordinate.x;
};


/**
 * @return {number} y-axis value of this Point.
 */
jsts.geom.Point.prototype.getY = function() {
  return this.coordinate.y;
};

jsts.geom.Point.prototype.getCoordinate = function() {
  return this.coordinate;
};


/**
 * @return {Coordinate[]} this Point as coordinate array.
 */
jsts.geom.Point.prototype.getCoordinates = function() {
  return this.isEmpty() ? [] : [this.coordinate];
};

jsts.geom.Point.prototype.isEmpty = function() {
  return this.coordinate === null;
};

jsts.geom.Point.prototype.equalsExact = function(other, tolerance) {
  if (!this.isEquivalentClass(other)) {
    return false;
  }
  if (this.isEmpty() && other.isEmpty()) {
    return true;
  }
  return this.equal(other.getCoordinate(), this.getCoordinate(), tolerance);
};


/**
 * @return {number} number of coordinates (0 or 1).
 */
jsts.geom.Point.prototype.getNumPoints = function() {
  return this.isEmpty() ? 0 : 1;
};


/**
 * @return {boolean} Point is always simple.
 */
jsts.geom.Point.prototype.isSimple = function() {
  return true;
};


/**
 * Gets the boundary of this geometry. Zero-dimensional geometries have no
 * boundary by definition, so an empty GeometryCollection is returned.
 *
 * @return {GeometryCollection} an empty GeometryCollection.
 * @see Geometry#getBoundary
 */
jsts.geom.Point.prototype.getBoundary = function() {
  return new jsts.geom.GeometryCollection(null);
};


/**
 * @return {Envelope} Envelope of this point.
 */
jsts.geom.Point.prototype.computeEnvelopeInternal = function() {
  if (this.isEmpty()) {
    return new jsts.geom.Envelope();
  }
  return new jsts.geom.Envelope(this.coordinate);
};

jsts.geom.Point.prototype.apply = function(filter) {
  if (filter instanceof jsts.geom.GeometryFilter || filter instanceof jsts.geom.GeometryComponentFilter) {
    filter.filter(this);
  } else if (filter instanceof jsts.geom.CoordinateFilter) {
    if (this.isEmpty()) { return; }
    filter.filter(this.getCoordinate());
  }

};

jsts.geom.Point.prototype.clone = function() {
  return new jsts.geom.Point(this.coordinate.clone(), this.factory);
};

/**
 * @return {number} Always 0.
 */
jsts.geom.Point.prototype.getDimension = function() {
  return 0;
};


/**
 * @return {number} Always Dimension.FALSE.
 */
jsts.geom.Point.prototype.getBoundaryDimension = function() {
  return jsts.geom.Dimension.FALSE;
};


/**
 * @return {Point} Reversed point is a cloned point.
 */
jsts.geom.Point.prototype.reverse = function() {
  return this.clone();
};


/**
 * A Point is valid iff:
 * <ul>
 * <li>the coordinate which defines it is a valid coordinate (i.e does not have
 * an NaN X or Y ordinate)
 * </ul>
 *
 * @return {boolean} true iff the Point is valid.
 */
jsts.geom.Point.prototype.isValid = function() {
  if (!jsts.operation.valid.IsValidOp.isValid(this.getCoordinate())) {
    return false;
  }
  return true;
};


/**
 *
 */
jsts.geom.Point.prototype.normalize = function() {
  // a Point is always in normalized form
};

jsts.geom.Point.prototype.compareToSameClass = function(other) {
  var point = other;
  return this.getCoordinate().compareTo(point.getCoordinate());
};

/**
 * @return {string} String representation of Point type.
 */
jsts.geom.Point.prototype.getGeometryType = function() {
  return 'Point';
};

jsts.geom.Point.prototype.hashCode = function() {
  return 'Point_' + this.coordinate.hashCode();
};

jsts.geom.Point.prototype.CLASS_NAME = 'jsts.geom.Point';

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Specifies the precision model of the {@link Coordinate}s in a
 * {@link Geometry}. In other words, specifies the grid of allowable points for
 * all <code>Geometry</code>s.
 * <p>
 * The {@link makePrecise} method allows rounding a coordinate to a "precise"
 * value; that is, one whose precision is known exactly.
 * <p>
 * Coordinates are assumed to be precise in geometries. That is, the coordinates
 * are assumed to be rounded to the precision model given for the geometry. JTS
 * input routines automatically round coordinates to the precision model before
 * creating Geometries. All internal operations assume that coordinates are
 * rounded to the precision model. Constructive methods (such as boolean
 * operations) always round computed coordinates to the appropriate precision
 * model.
 * <p>
 * Currently one type of precision model are supported:
 * <ul>
 * <li>FLOATING - represents full double precision floating point.
 * <p>
 * Coordinates are represented internally as Java double-precision values. Since
 * Java uses the IEEE-754 floating point standard, this provides 53 bits of
 * precision.
 * <p>
 * JSTS methods currently do not handle inputs with different precision models.
 *
 * @constructor
 */
jsts.geom.PrecisionModel = function(modelType) {
  if (typeof modelType === 'number') {
    this.modelType = jsts.geom.PrecisionModel.FIXED;
    this.scale = modelType;
    return;
  }

  this.modelType = modelType || jsts.geom.PrecisionModel.FLOATING;

  if (this.modelType === jsts.geom.PrecisionModel.FIXED) {
    this.scale = 1.0;
  }
};


/**
 * @type {string}
 */
jsts.geom.PrecisionModel.FLOATING = 'FLOATING';


/**
 * @type {string}
 */
jsts.geom.PrecisionModel.FIXED = 'FIXED';


/**
 * @type {string}
 */
jsts.geom.PrecisionModel.FLOATING_SINGLE = 'FLOATING_SINGLE';

jsts.geom.PrecisionModel.prototype.scale = null;
jsts.geom.PrecisionModel.prototype.modelType = null;


/**
 * Tests whether the precision model supports floating point
 *
 * @return {boolean} if the precision model supports floating point.
 */
jsts.geom.PrecisionModel.prototype.isFloating = function() {
  return this.modelType === jsts.geom.PrecisionModel.FLOATING ||
      this.modelType === jsts.geom.PrecisionModel.FLOATING_SINLGE;
};

/**
 * Returns the scale factor used to specify a fixed precision model. The number
 * of decimal places of precision is equal to the base-10 logarithm of the scale
 * factor. Non-integral and negative scale factors are supported. Negative scale
 * factors indicate that the places of precision is to the left of the decimal
 * point.
 *
 * @return the scale factor for the fixed precision model.
 */
jsts.geom.PrecisionModel.prototype.getScale = function() {
  return this.scale;
};

/**
 * @return {string} always jsts.geom.PrecisionModel.FLOATING.
 */
jsts.geom.PrecisionModel.prototype.getType = function() {
  return this.modelType;
};

jsts.geom.PrecisionModel.prototype.equals = function(other) {
  return true;

  if (!(other instanceof jsts.geom.PrecisionModel)) {
    return false;
  }
  var otherPrecisionModel = other;
  return this.modelType === otherPrecisionModel.modelType &&
      this.scale === otherPrecisionModel.scale;
};


/**
 * Rounds a numeric value to the PrecisionModel grid. Asymmetric Arithmetic
 * Rounding is used, to provide uniform rounding behaviour no matter where the
 * number is on the number line.
 * <p>
 * This method has no effect on NaN values.
 * <p>
 * <b>Note:</b> Java's <code>Math#rint</code> uses the "Banker's Rounding"
 * algorithm, which is not suitable for precision operations elsewhere in JTS.
 */
jsts.geom.PrecisionModel.prototype.makePrecise = function(val) {
  if (val instanceof jsts.geom.Coordinate) {
    this.makePrecise2(val);
    return;
  }

  // don't change NaN values
  if (isNaN(val))
    return val;

  // TODO: support single precision?
  /*if (this.modelType == FLOATING_SINGLE) {
    float floatSingleVal = (float) val;
    return (double) floatSingleVal;
  }*/
  if (this.modelType === jsts.geom.PrecisionModel.FIXED) {
    return Math.round(val * this.scale) / this.scale;
  }
  // modelType == FLOATING - no rounding necessary
  return val;
};


/**
 * Rounds a Coordinate to the PrecisionModel grid.
 */
jsts.geom.PrecisionModel.prototype.makePrecise2 = function(coord) {
  // optimization for full precision
  if (this.modelType === jsts.geom.PrecisionModel.FLOATING)
    return;

  coord.x = this.makePrecise(coord.x);
  coord.y = this.makePrecise(coord.y);
  // MD says it's OK that we're not makePrecise'ing the z [Jon Aquino]
};


/**
 * Compares this {@link PrecisionModel} object with the specified object for
 * order. A PrecisionModel is greater than another if it provides greater
 * precision. The comparison is based on the value returned by the
 * {@link #getMaximumSignificantDigits} method. This comparison is not strictly
 * accurate when comparing floating precision models to fixed models; however,
 * it is correct when both models are either floating or fixed.
 *
 * @param o
 *          the <code>PrecisionModel</code> with which this
 *          <code>PrecisionModel</code> is being compared.
 * @return a negative integer, zero, or a positive integer as this
 *         <code>PrecisionModel</code> is less than, equal to, or greater than
 *         the specified <code>PrecisionModel.</code>
 */
jsts.geom.PrecisionModel.prototype.compareTo = function(o) {
  var other = o;

  // TODO: needs to be ported for fixed precision

  // var sigDigits = this.getMaximumSignificantDigits();
  // var otherSigDigits = other.getMaximumSignificantDigits();
  // return (new Integer(sigDigits)).compareTo(new Integer(otherSigDigits));

  return 0;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * <code>GeometryCollection</code> classes support the concept of applying a
 * <code>GeometryFilter</code> to the <code>Geometry</code>. The filter is
 * applied to every element <code>Geometry</code>. A
 * <code>GeometryFilter</code> can either record information about the
 * <code>Geometry</code> or change the <code>Geometry</code> in some way.
 * <code>GeometryFilter</code> is an example of the Gang-of-Four Visitor
 * pattern.
 */
jsts.geom.GeometryFilter = function() {
};


/**
 * Performs an operation with or on <code>geom</code>.
 *
 * @param {Geometry}
 *          geom a <code>Geometry</code> to which the filter is applied.
 */
jsts.geom.GeometryFilter.prototype.filter = function(geom) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/Geometry.js
   */

  var Geometry = jsts.geom.Geometry;
  var TreeSet = javascript.util.TreeSet;
  var Arrays = javascript.util.Arrays;

  /**
   * @constructor
   * @extends jsts.geom.Geometry
   */
  jsts.geom.GeometryCollection = function(geometries, factory) {
    this.geometries = geometries || [];
    this.factory = factory;
  };

  jsts.geom.GeometryCollection.prototype = new Geometry();
  jsts.geom.GeometryCollection.constructor = jsts.geom.GeometryCollection;

  /**
   * @return {boolean}
   */
  jsts.geom.GeometryCollection.prototype.isEmpty = function() {
    for (var i = 0, len = this.geometries.length; i < len; i++) {
      var geometry = this.getGeometryN(i);

      if (!geometry.isEmpty()) {
        return false;
      }
    }
    return true;
  };

  jsts.geom.Geometry.prototype.getArea = function() {
    var area = 0.0;

    for (var i = 0, len = this.geometries.length; i < len; i++) {
      area += this.getGeometryN(i).getArea();
    }

    return area;
  };

  jsts.geom.Geometry.prototype.getLength = function() {
    var length = 0.0;

    for (var i = 0, len = this.geometries.length; i < len; i++) {
      length += this.getGeometryN(i).getLength();
    }

    return length;
  };


  /**
   * @return {Coordinate}
   */
  jsts.geom.GeometryCollection.prototype.getCoordinate = function() {
    if (this.isEmpty())
      return null;

    return this.getGeometryN(0).getCoordinate();
  };


  /**
   * Collects all coordinates of all subgeometries into an Array.
   *
   * Note that while changes to the coordinate objects themselves may modify the
   * Geometries in place, the returned Array as such is only a temporary
   * container which is not synchronized back.
   *
   * @return {Coordinate[]} the collected coordinates.
   */
  jsts.geom.GeometryCollection.prototype.getCoordinates = function() {
    var coordinates = [];
    var k = -1;
    for (var i = 0, len = this.geometries.length; i < len; i++) {
      var geometry = this.getGeometryN(i);

      var childCoordinates = geometry.getCoordinates();
      for (var j = 0; j < childCoordinates.length; j++) {
        k++;
        coordinates[k] = childCoordinates[j];
      }
    }
    return coordinates;
  };


  /**
   * @return {int}
   */
  jsts.geom.GeometryCollection.prototype.getNumGeometries = function() {
    return this.geometries.length;
  };


  /**
   * @param {int}
   *          n
   * @return {Geometry}
   */
  jsts.geom.GeometryCollection.prototype.getGeometryN = function(n) {
    var geometry = this.geometries[n];
    if (geometry instanceof jsts.geom.Coordinate) {
      geometry = new jsts.geom.Point(geometry);
    }
    return geometry;
  };

  /**
   * @return {number}
   */
  jsts.geom.GeometryCollection.prototype.getNumPoints = function(n) {
    var numPoints = 0;
    for (var i = 0; i < this.geometries.length; i++) {
      numPoints += this.geometries[i].getNumPoints();
    }
    return numPoints;
  }

  /**
   * @param {Geometry}
   *          other
   * @param {double}
   *          tolerance
   * @return {boolean}
   */
  jsts.geom.GeometryCollection.prototype.equalsExact = function(other,
      tolerance) {
    if (!this.isEquivalentClass(other)) {
      return false;
    }
    if (this.geometries.length !== other.geometries.length) {
      return false;
    }
    for (var i = 0, len = this.geometries.length; i < len; i++) {
      var geometry = this.getGeometryN(i);

      if (!geometry.equalsExact(other.getGeometryN(i), tolerance)) {
        return false;
      }
    }
    return true;
  };

  /**
   * Creates and returns a full copy of this {@link GeometryCollection} object.
   * (including all coordinates contained by it).
   *
   * @return a clone of this instance.
   */
  jsts.geom.GeometryCollection.prototype.clone = function() {
    var geometries = [];
    for (var i = 0, len = this.geometries.length; i < len; i++) {
      geometries.push(this.geometries[i].clone());
    }
    return this.factory.createGeometryCollection(geometries);
  };

  jsts.geom.GeometryCollection.prototype.normalize = function() {
    for (var i = 0, len = this.geometries.length; i < len; i++) {
      this.getGeometryN(i).normalize();
    }
    // TODO: might need to supply comparison function
    this.geometries.sort();
  };

  jsts.geom.GeometryCollection.prototype.compareToSameClass = function(o) {
    var theseElements = new TreeSet(Arrays.asList(this.geometries));
    var otherElements = new TreeSet(Arrays.asList(o.geometries));
    return this.compare(theseElements, otherElements);
  };

  jsts.geom.GeometryCollection.prototype.apply = function(filter) {
    if (filter instanceof jsts.geom.GeometryFilter ||
        filter instanceof jsts.geom.GeometryComponentFilter) {
      filter.filter(this);
      for (var i = 0, len = this.geometries.length; i < len; i++) {
        this.getGeometryN(i).apply(filter);
      }
    } else if (filter instanceof jsts.geom.CoordinateFilter) {
      for (var i = 0, len = this.geometries.length; i < len; i++) {
        this.getGeometryN(i).apply(filter);
      }
    } else if (filter instanceof jsts.geom.CoordinateSequenceFilter) {
      this.apply2.apply(this, arguments);
    }
  };

  jsts.geom.GeometryCollection.prototype.apply2 = function(filter) {
    if (this.geometries.length == 0)
      return;
    for (var i = 0; i < this.geometries.length; i++) {
      this.geometries[i].apply(filter);
      if (filter.isDone()) {
        break;
      }
    }
    if (filter.isGeometryChanged()) {
      // TODO: call this.geometryChanged(); when ported
    }
  };

  jsts.geom.GeometryCollection.prototype.getDimension = function() {
    var dimension = jsts.geom.Dimension.FALSE;
    for (var i = 0, len = this.geometries.length; i < len; i++) {
      var geometry = this.getGeometryN(i);
      dimension = Math.max(dimension, geometry.getDimension());
    }
    return dimension;
  };

  /**
   * @protected
   */
  jsts.geom.GeometryCollection.prototype.computeEnvelopeInternal = function() {
    var envelope = new jsts.geom.Envelope();
    for (var i = 0, len = this.geometries.length; i < len; i++) {
      var geometry = this.getGeometryN(i);
      envelope.expandToInclude(geometry.getEnvelopeInternal());
    }
    return envelope;
  };

  jsts.geom.GeometryCollection.prototype.CLASS_NAME = 'jsts.geom.GeometryCollection';

})();

// TODO: port rest


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/GeometryCollection.js
 */

(function() {

  /**
   * @requires jsts/geom/GeometryCollection.js
   */

  /**
   * @constructor
   * @extends jsts.geom.GeometryCollection
   */
  jsts.geom.MultiPoint = function(points, factory) {
    this.geometries = points || [];
    this.factory = factory;
  };

  jsts.geom.MultiPoint.prototype = new jsts.geom.GeometryCollection();
  jsts.geom.MultiPoint.constructor = jsts.geom.MultiPoint;



  /**
   * Gets the boundary of this geometry. Zero-dimensional geometries have no
   * boundary by definition, so an empty GeometryCollection is returned.
   *
   * @return {Geometry} an empty GeometryCollection.
   * @see Geometry#getBoundary
   */
  jsts.geom.MultiPoint.prototype.getBoundary = function() {
    return this.getFactory().createGeometryCollection(null);
  };

  jsts.geom.MultiPoint.prototype.getGeometryN = function(n) {
    return this.geometries[n];
  };


  /**
   * @param {Geometry}
   *          other
   * @param {double}
   *          tolerance
   * @return {boolean}
   */
  jsts.geom.MultiPoint.prototype.equalsExact = function(other, tolerance) {
    if (!this.isEquivalentClass(other)) {
      return false;
    }
    return jsts.geom.GeometryCollection.prototype.equalsExact.call(this, other,
        tolerance);
  };

  jsts.geom.MultiPoint.prototype.CLASS_NAME = 'jsts.geom.MultiPoint';

})();

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/util/Assert.js
   */

  var Assert = jsts.util.Assert;

  /**
   * A GraphComponent is the parent class for the objects' that form a graph.
   * Each GraphComponent can carry a Label.
   *
   * @constructor
   */
  jsts.geomgraph.GraphComponent = function(label) {
    this.label = label;
  };


  /**
   * @type {Label}
   * @protected
   */
  jsts.geomgraph.GraphComponent.prototype.label = null;


  /**
   * isInResult indicates if this component has already been included in the
   * result
   *
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.GraphComponent.prototype._isInResult = false;


  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.GraphComponent.prototype._isCovered = false;


  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.GraphComponent.prototype._isCoveredSet = false;


  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.GraphComponent.prototype._isVisited = false;

  jsts.geomgraph.GraphComponent.prototype.getLabel = function() {
    return this.label;
  };
  jsts.geomgraph.GraphComponent.prototype.setLabel = function(label) {
    if (arguments.length === 2) {
      this.setLabel2.apply(this, arguments);
      return;
    }

    this.label = label;
  };


  /**
   * @param {boolean}
   *          isInResult
   */
  jsts.geomgraph.GraphComponent.prototype.setInResult = function(isInResult) {
    this._isInResult = isInResult;
  };


  /**
   * @return {boolean}
   */
  jsts.geomgraph.GraphComponent.prototype.isInResult = function() {
    return this._isInResult;
  };


  /**
   * @param {boolean}
   *          isCovered
   */
  jsts.geomgraph.GraphComponent.prototype.setCovered = function(isCovered) {
    this._isCovered = isCovered;
    this._isCoveredSet = true;
  };


  /**
   * @return {boolean}
   */
  jsts.geomgraph.GraphComponent.prototype.isCovered = function() {
    return this._isCovered;
  };


  /**
   * @return {boolean}
   */
  jsts.geomgraph.GraphComponent.prototype.isCoveredSet = function() {
    return this._isCoveredSet;
  };


  /**
   * @return {boolean}
   */
  jsts.geomgraph.GraphComponent.prototype.isVisited = function() {
    return this._isVisited;
  };


  /**
   * @param {boolean}
   *          isVisited
   */
  jsts.geomgraph.GraphComponent.prototype.setVisited = function(isVisited) {
    this._isVisited = isVisited;
  };


  /**
   * @return {Coordinate} a coordinate in this component (or null, if there are
   *         none).
   */
  jsts.geomgraph.GraphComponent.prototype.getCoordinate = function() {
    throw new jsts.error.AbstractMethodInvocationError();
  };


  /**
   * compute the contribution to an IM for this component
   *
   * @param {IntersectionMatrix}
   *          im
   * @protected
   */
  jsts.geomgraph.GraphComponent.prototype.computeIM = function(im) {
    throw new jsts.error.AbstractMethodInvocationError();
  };


  /**
   * An isolated component is one that does not intersect or touch any other
   * component. This is the case if the label has valid locations for only a
   * single Geometry.
   *
   * @return true if this component is isolated.
   */
  jsts.geomgraph.GraphComponent.prototype.isIsolated = function() {
    throw new jsts.error.AbstractMethodInvocationError();
  };


  /**
   * Update the IM with the contribution for this component. A component only
   * contributes if it has a labelling for both parent geometries
   *
   * @param {IntersectionMatrix}
   *          im
   */
  jsts.geomgraph.GraphComponent.prototype.updateIM = function(im) {
    Assert.isTrue(this.label.getGeometryCount() >= 2, 'found partial label');
    this.computeIM(im);
  };

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


(function() {

  /**
   * A Position indicates the position of a Location relative to a graph
   * component (Node, Edge, or Area).
   *
   * @constructor
   */
  jsts.geomgraph.Position = function() {

  };


  /**
   * An indicator that a Location is <i>on</i> a GraphComponent
   *
   * @type {int}
   */
  jsts.geomgraph.Position.ON = 0;


  /**
   * An indicator that a Location is to the <i>left</i> of a GraphComponent
   *
   * @type {int}
   */
  jsts.geomgraph.Position.LEFT = 1;


  /**
   * An indicator that a Location is to the <i>right</i> of a GraphComponent
   *
   * @type {int}
   */
  jsts.geomgraph.Position.RIGHT = 2;


  /**
   * Returns LEFT if the position is RIGHT, RIGHT if the position is LEFT, or
   * the position otherwise.
   *
   * @param {int}
   *          position
   * @return {int}
   */
  jsts.geomgraph.Position.opposite = function(position) {
    if (position === jsts.geomgraph.Position.LEFT) {
      return jsts.geomgraph.Position.RIGHT;
    }
    if (position === jsts.geomgraph.Position.RIGHT) {
      return jsts.geomgraph.Position.LEFT;
    }
    return position;
  };

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/Position.js
 */

/**
 * A TopologyLocation is the labelling of a GraphComponent's topological
 * relationship to a single Geometry.
 * <p>
 * If the parent component is an area edge, each side and the edge itself have a
 * topological location. These locations are named
 * <ul>
 * <li> ON: on the edge
 * <li> LEFT: left-hand side of the edge
 * <li> RIGHT: right-hand side
 * </ul>
 * If the parent component is a line edge or node, there is a single topological
 * relationship attribute, ON.
 * <p>
 * The possible values of a topological location are {Location.NONE,
 * Location.EXTERIOR, Location.BOUNDARY, Location.INTERIOR}
 * <p>
 * The labelling is stored in an array location[j] where where j has the values
 * ON, LEFT, RIGHT
 *
 * @constructor
 */
jsts.geomgraph.TopologyLocation = function() {
  this.location = [];

  if (arguments.length === 3) {
    var on = arguments[0];
    var left = arguments[1];
    var right = arguments[2];
    this.init(3);
    this.location[jsts.geomgraph.Position.ON] = on;
    this.location[jsts.geomgraph.Position.LEFT] = left;
    this.location[jsts.geomgraph.Position.RIGHT] = right;
  } else if (arguments[0] instanceof jsts.geomgraph.TopologyLocation) {
    var gl = arguments[0];
    this.init(gl.location.length);
    if (gl != null) {
      for (var i = 0; i < this.location.length; i++) {
        this.location[i] = gl.location[i];
      }
    }
  } else if (typeof arguments[0] === 'number') {
    var on = arguments[0];
    this.init(1);
    this.location[jsts.geomgraph.Position.ON] = on;
  } else if (arguments[0] instanceof Array) {
    var location = arguments[0];
    this.init(location.length);
  }
};


/**
 * @private
 */
jsts.geomgraph.TopologyLocation.prototype.location = null;


/**
 * @param {int}
 *          size
 * @private
 */
jsts.geomgraph.TopologyLocation.prototype.init = function(size) {
  this.location[size - 1] = null;
  this.setAllLocations(jsts.geom.Location.NONE);
};


/**
 * @param {int}
 *          posIndex
 * @return {int}
 */
jsts.geomgraph.TopologyLocation.prototype.get = function(posIndex) {
  if (posIndex < this.location.length)
    return this.location[posIndex];
  return jsts.geom.Location.NONE;
};


/**
 * @return {boolean} true if all locations are NULL.
 */
jsts.geomgraph.TopologyLocation.prototype.isNull = function() {
  for (var i = 0; i < this.location.length; i++) {
    if (this.location[i] !== jsts.geom.Location.NONE)
      return false;
  }
  return true;
};


/**
 * @return {boolean} true if any locations are NULL.
 */
jsts.geomgraph.TopologyLocation.prototype.isAnyNull = function() {
  for (var i = 0; i < this.location.length; i++) {
    if (this.location[i] === jsts.geom.Location.NONE)
      return true;
  }
  return false;
};


/**
 * @param {TopologyLocation}
 *          le
 * @param {int}
 *          locIndex
 * @return {boolean}
 */
jsts.geomgraph.TopologyLocation.prototype.isEqualOnSide = function(le, locIndex) {
  return this.location[locIndex] == le.location[locIndex];
};


/**
 * @return {boolean}
 */
jsts.geomgraph.TopologyLocation.prototype.isArea = function() {
  return this.location.length > 1;
};


/**
 * @return {boolean}
 */
jsts.geomgraph.TopologyLocation.prototype.isLine = function() {
  return this.location.length === 1;
};

jsts.geomgraph.TopologyLocation.prototype.flip = function() {
  if (this.location.length <= 1)
    return;
  var temp = this.location[jsts.geomgraph.Position.LEFT];
  this.location[jsts.geomgraph.Position.LEFT] = this.location[jsts.geomgraph.Position.RIGHT];
  this.location[jsts.geomgraph.Position.RIGHT] = temp;
};


/**
 * @param {int}
 *          locValue
 */
jsts.geomgraph.TopologyLocation.prototype.setAllLocations = function(locValue) {
  for (var i = 0; i < this.location.length; i++) {
    this.location[i] = locValue;
  }
};


/**
 * @param {int}
 *          locValue
 */
jsts.geomgraph.TopologyLocation.prototype.setAllLocationsIfNull = function(
    locValue) {
  for (var i = 0; i < this.location.length; i++) {
    if (this.location[i] === jsts.geom.Location.NONE)
      this.location[i] = locValue;
  }
};


/**
 * @param {int}
 *          locIndex
 * @param {int}
 *          locValue
 */
jsts.geomgraph.TopologyLocation.prototype.setLocation = function(locIndex,
    locValue) {
  if (locValue !== undefined) {
    this.location[locIndex] = locValue;
  } else {
    this.setLocation(jsts.geomgraph.Position.ON, locIndex);
  }
};


/**
 * @return {int[]}
 */
jsts.geomgraph.TopologyLocation.prototype.getLocations = function() {
  return location;
};


/**
 * @param {int}
 *          on
 * @param {int}
 *          left
 * @param {int}
 *          right
 */
jsts.geomgraph.TopologyLocation.prototype.setLocations = function(on, left,
    right) {
  this.location[jsts.geomgraph.Position.ON] = on;
  this.location[jsts.geomgraph.Position.LEFT] = left;
  this.location[jsts.geomgraph.Position.RIGHT] = right;
};


/**
 * @param {int}
 *          loc
 * @return {boolean}
 */
jsts.geomgraph.TopologyLocation.prototype.allPositionsEqual = function(loc) {
  for (var i = 0; i < this.location.length; i++) {
    if (this.location[i] !== loc)
      return false;
  }
  return true;
};


/**
 * merge updates only the NULL attributes of this object with the attributes of
 * another.
 *
 * @param {TopologyLocation}
 *          gl
 */
jsts.geomgraph.TopologyLocation.prototype.merge = function(gl) {
  // if the src is an Area label & and the dest is not, increase the dest to be
  // an Area
  if (gl.location.length > this.location.length) {
    var newLoc = [];
    newLoc[jsts.geomgraph.Position.ON] = this.location[jsts.geomgraph.Position.ON];
    newLoc[jsts.geomgraph.Position.LEFT] = jsts.geom.Location.NONE;
    newLoc[jsts.geomgraph.Position.RIGHT] = jsts.geom.Location.NONE;
    this.location = newLoc;
  }
  for (var i = 0; i < this.location.length; i++) {
    if (this.location[i] === jsts.geom.Location.NONE && i < gl.location.length)
      this.location[i] = gl.location[i];
  }
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/TopologyLocation.js
 */

/**
 * A <code>Label</code> indicates the topological relationship of a component
 * of a topology graph to a given <code>Geometry</code>. This class supports
 * labels for relationships to two <code>Geometry</code>s, which is
 * sufficient for algorithms for binary operations.
 * <P>
 * Topology graphs support the concept of labeling nodes and edges in the graph.
 * The label of a node or edge specifies its topological relationship to one or
 * more geometries. (In fact, since JTS operations have only two arguments
 * labels are required for only two geometries). A label for a node or edge has
 * one or two elements, depending on whether the node or edge occurs in one or
 * both of the input <code>Geometry</code>s. Elements contain attributes
 * which categorize the topological location of the node or edge relative to the
 * parent <code>Geometry</code>; that is, whether the node or edge is in the
 * interior, boundary or exterior of the <code>Geometry</code>. Attributes
 * have a value from the set <code>{Interior, Boundary, Exterior}</code>. In
 * a node each element has a single attribute <code>&lt;On&gt;</code>. For an
 * edge each element has a triplet of attributes
 * <code>&lt;Left, On, Right&gt;</code>.
 * <P>
 * It is up to the client code to associate the 0 and 1
 * <code>TopologyLocation</code>s with specific geometries.
 *
 * @constructor
 */
jsts.geomgraph.Label = function() {
  this.elt = [];

  var geomIndex, onLoc, leftLoc, lbl, rightLoc;
  if (arguments.length === 4) {
    geomIndex = arguments[0];
    onLoc = arguments[1];
    leftLoc = arguments[2];
    rightLoc = arguments[3];
    this.elt[0] = new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE,
        jsts.geom.Location.NONE, jsts.geom.Location.NONE);
    this.elt[1] = new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE,
        jsts.geom.Location.NONE, jsts.geom.Location.NONE);
    this.elt[geomIndex].setLocations(onLoc, leftLoc, rightLoc);
  } else if (arguments.length === 3) {
    onLoc = arguments[0];
    leftLoc = arguments[1];
    rightLoc = arguments[2];
    this.elt[0] = new jsts.geomgraph.TopologyLocation(onLoc, leftLoc, rightLoc);
    this.elt[1] = new jsts.geomgraph.TopologyLocation(onLoc, leftLoc, rightLoc);
  } else if (arguments.length === 2) {
    geomIndex = arguments[0];
    onLoc = arguments[1];
    this.elt[0] = new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE);
    this.elt[1] = new jsts.geomgraph.TopologyLocation(jsts.geom.Location.NONE);
    this.elt[geomIndex].setLocation(onLoc);
  } else if (arguments[0] instanceof jsts.geomgraph.Label) {
    lbl = arguments[0];
    this.elt[0] = new jsts.geomgraph.TopologyLocation(lbl.elt[0]);
    this.elt[1] = new jsts.geomgraph.TopologyLocation(lbl.elt[1]);
  } else if (typeof arguments[0] === 'number') {
    onLoc = arguments[0];
    this.elt[0] = new jsts.geomgraph.TopologyLocation(onLoc);
    this.elt[1] = new jsts.geomgraph.TopologyLocation(onLoc);
  }
};


/**
 * converts a Label to a Line label (that is, one with no side Locations)
 *
 * @param {label}
 *          label
 * @return {Label}
 */
jsts.geomgraph.Label.toLineLabel = function(label) {
  var i, lineLabel = new jsts.geomgraph.Label(jsts.geom.Location.NONE);
  for (i = 0; i < 2; i++) {
    lineLabel.setLocation(i, label.getLocation(i));
  }
  return lineLabel;
};


/**
 * @type {TopologyLocation[]}
 * @private
 */
jsts.geomgraph.Label.prototype.elt = null;

jsts.geomgraph.Label.prototype.flip = function() {
  this.elt[0].flip();
  this.elt[1].flip();
};


/**
 * @param {int}
 *          geomIndex
 * @param {int}
 *          posIndex
 * @return {int}
 */
jsts.geomgraph.Label.prototype.getLocation = function(geomIndex, posIndex) {
  if (arguments.length == 1) {
    return this.getLocation2.apply(this, arguments);
  }
  return this.elt[geomIndex].get(posIndex);
};


/**
 * @param {int}
 *          geomIndex
 * @return {int}
 */
jsts.geomgraph.Label.prototype.getLocation2 = function(geomIndex) {
  return this.elt[geomIndex].get(jsts.geomgraph.Position.ON);
};


/**
 * @param {int}
 *          geomIndex
 * @param {int}
 *          posIndex
 * @param {int}
 *          location
 */
jsts.geomgraph.Label.prototype.setLocation = function(geomIndex, posIndex,
    location) {
  if (arguments.length == 2) {
    this.setLocation2.apply(this, arguments);
    return;
  }

  this.elt[geomIndex].setLocation(posIndex, location);
};


/**
 * @param {int}
 *          geomIndex
 * @param {int}
 *          location
 */
jsts.geomgraph.Label.prototype.setLocation2 = function(geomIndex, location) {
  this.elt[geomIndex].setLocation(jsts.geomgraph.Position.ON, location);
};


/**
 * @param {int}
 *          geomIndex
 * @param {int}
 *          location
 */
jsts.geomgraph.Label.prototype.setAllLocations = function(geomIndex, location) {
  this.elt[geomIndex].setAllLocations(location);
};


/**
 * @param {int}
 *          geomIndex
 * @param {int}
 *          location
 */
jsts.geomgraph.Label.prototype.setAllLocationsIfNull = function(geomIndex,
    location) {
  if (arguments.length == 1) {
    this.setAllLocationsIfNull2.apply(this, arguments);
    return;
  }

  this.elt[geomIndex].setAllLocationsIfNull(location);
};


/**
 * @param {int}
 *          location
 */
jsts.geomgraph.Label.prototype.setAllLocationsIfNull2 = function(location) {
  this.setAllLocationsIfNull(0, location);
  this.setAllLocationsIfNull(1, location);
};


/**
 * Merge this label with another one. Merging updates any null attributes of
 * this label with the attributes from lbl
 *
 * @param {Label}
 *          lbl
 */
jsts.geomgraph.Label.prototype.merge = function(lbl) {
  var i;
  for (i = 0; i < 2; i++) {
    if (this.elt[i] === null && lbl.elt[i] !== null) {
      this.elt[i] = new jsts.geomgraph.TopologyLocation(lbl.elt[i]);
    } else {
      this.elt[i].merge(lbl.elt[i]);
    }
  }
};


/**
 * @return {int}
 */
jsts.geomgraph.Label.prototype.getGeometryCount = function() {
  var count = 0;
  if (!this.elt[0].isNull()) {
    count++;
  }
  if (!this.elt[1].isNull()) {
    count++;
  }
  return count;
};


/**
 * @param {int}
 *          geomIndex
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.isNull = function(geomIndex) {
  return this.elt[geomIndex].isNull();
};


/**
 * @param {int}
 *          geomIndex
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.isAnyNull = function(geomIndex) {
  return this.elt[geomIndex].isAnyNull();
};


/**
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.isArea = function() {
  if (arguments.length == 1) {
    return this.isArea2(arguments[0]);
  }

  return this.elt[0].isArea() || this.elt[1].isArea();
};


/**
 * @param {int}
 *          geomIndex
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.isArea2 = function(geomIndex) {
  return this.elt[geomIndex].isArea();
};


/**
 * @param {int}
 *          geomIndex
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.isLine = function(geomIndex) {
  return this.elt[geomIndex].isLine();
};


/**
 * @param {Label}
 *          lbl
 * @param {int}
 *          side
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.isEqualOnSide = function(lbl, side) {
  return this.elt[0].isEqualOnSide(lbl.elt[0], side) &&
      this.elt[1].isEqualOnSide(lbl.elt[1], side);
};


/**
 * @param {int}
 *          geomIndex
 * @param {int}
 *          loc
 * @return {boolean}
 */
jsts.geomgraph.Label.prototype.allPositionsEqual = function(geomIndex, loc) {
  return this.elt[geomIndex].allPositionsEqual(loc);
};


/**
 * Converts one GeometryLocation to a Line location
 *
 * @param {int}
 *          geomIndex
 */
jsts.geomgraph.Label.prototype.toLine = function(geomIndex) {
  if (this.elt[geomIndex].isArea()) {
    this.elt[geomIndex] = new jsts.geomgraph.TopologyLocation(this.elt[geomIndex].location[0]);
  }
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/GraphComponent.js
 */



/**
 * @constructor
 * @param {jsts.geom.Coordinate}
 *          coord
 * @param {jsts.geom.EdgeEndStar}
 *          edges
 * @augments jsts.geomgraph.GraphComponent
 */
jsts.geomgraph.Node = function(coord, edges) {
  this.coord = coord;
  this.edges = edges;
  this.label = new jsts.geomgraph.Label(0, jsts.geom.Location.NONE);
};

jsts.geomgraph.Node.prototype = new jsts.geomgraph.GraphComponent();


/**
 * only non-null if this node is precise
 */
jsts.geomgraph.Node.prototype.coord = null;
jsts.geomgraph.Node.prototype.edges = null;

jsts.geomgraph.Node.prototype.isIsolated = function() {
  return (this.label.getGeometryCount() == 1);
};

jsts.geomgraph.Node.prototype.setLabel2 = function(argIndex, onLocation) {
  if (this.label === null) {
    this.label = new jsts.geomgraph.Label(argIndex, onLocation);
  } else
    this.label.setLocation(argIndex, onLocation);
};


/**
 * Updates the label of a node to BOUNDARY, obeying the mod-2
 * boundaryDetermination rule.
 */
jsts.geomgraph.Node.prototype.setLabelBoundary = function(argIndex) {
  // determine the current location for the point (if any)
  var loc = jsts.geom.Location.NONE;
  if (this.label !== null)
    loc = this.label.getLocation(argIndex);
  // flip the loc
  var newLoc;
  switch (loc) {
  case jsts.geom.Location.BOUNDARY:
    newLoc = jsts.geom.Location.INTERIOR;
    break;
  case jsts.geom.Location.INTERIOR:
    newLoc = jsts.geom.Location.BOUNDARY;
    break;
  default:
    newLoc = jsts.geom.Location.BOUNDARY;
    break;
  }
  this.label.setLocation(argIndex, newLoc);
};


/**
 * Add the edge to the list of edges at this node
 */
jsts.geomgraph.Node.prototype.add = function(e) {
  this.edges.insert(e);
  e.setNode(this);
};

jsts.geomgraph.Node.prototype.getCoordinate = function() {
  return this.coord;
};
jsts.geomgraph.Node.prototype.getEdges = function() {
  return this.edges;
};

/**
 * Tests whether any incident edge is flagged as being in the result. This test
 * can be used to determine if the node is in the result, since if any incident
 * edge is in the result, the node must be in the result as well.
 *
 * @return <code>true</code> if any indicident edge in the in the result.
 */
jsts.geomgraph.Node.prototype.isIncidentEdgeInResult = function() {
  for (var it = this.getEdges().getEdges().iterator(); it.hasNext();) {
    var de = it.next();
    if (de.getEdge().isInResult())
      return true;
  }
  return false;
};

// TODO: port rest


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/Location.js
   */

  var Location = jsts.geom.Location;
  var ArrayList = javascript.util.ArrayList;
  var TreeMap = javascript.util.TreeMap;

  /**
   * A map of nodes, indexed by the coordinate of the node.
   *
   * @constructor
   */
  jsts.geomgraph.NodeMap = function(nodeFactory) {
    this.nodeMap = new TreeMap();
    this.nodeFact = nodeFactory;
  };


  /**
   * NOTE: Seems like the index isn't functionally important, so in JSTS a JS
   * object replaces TreeMap. Sorting is done when needed.
   *
   * @type {javascript.util.HashMap}
   */
  jsts.geomgraph.NodeMap.prototype.nodeMap = null;

  jsts.geomgraph.NodeMap.prototype.nodeFact = null;


  /**
   * This method expects that a node has a coordinate value.
   *
   * In JSTS this replaces multiple overloaded methods from JTS.
   *
   * @param {jsts.geom.Coordinate/jsts.geomgraph.Node}
   *          arg
   * @return {jsts.geomgraph.Node}
   */
  jsts.geomgraph.NodeMap.prototype.addNode = function(arg) {
    var node, coord;

    if (arg instanceof jsts.geom.Coordinate) {
      coord = arg;
      node = this.nodeMap.get(coord);
      if (node === null) {
        node = this.nodeFact.createNode(coord);
        this.nodeMap.put(coord, node);
      }
      return node;
    } else if (arg instanceof jsts.geomgraph.Node) {
      var n = arg;
      coord = n.getCoordinate();
      node = this.nodeMap.get(coord);
      if (node === null) {
        this.nodeMap.put(coord, n);
        return n;
      }
      node.mergeLabel(n);
      return node;
    }
  };

  /**
   * Adds a node for the start point of this EdgeEnd (if one does not already
   * exist in this map). Adds the EdgeEnd to the (possibly new) node.
   *
   * @param {jsts.geomgraph.EdgeEnd}
   *          e
   */
  jsts.geomgraph.NodeMap.prototype.add = function(e) {
    var p = e.getCoordinate();
    var n = this.addNode(p);
    n.add(e);
  };

  /**
   * @param {jsts.geom.Coordinate}
   *          coord
   * @return {jsts.geomgraph.Node} the node if found; null otherwise.
   */
  jsts.geomgraph.NodeMap.prototype.find = function(coord) {
    return this.nodeMap.get(coord);
  };


  /**
   * @return {javascript.util.Collection}
   */
  jsts.geomgraph.NodeMap.prototype.values = function() {
    return this.nodeMap.values();
  };

  /**
   * @return {javascript.util.Collection}
   */
  jsts.geomgraph.NodeMap.prototype.iterator = function() {
    return this.values().iterator();
  };


  /**
   * @param {number}
   *          geomIndex
   * @return {Array.<Node>}
   */
  jsts.geomgraph.NodeMap.prototype.getBoundaryNodes = function(geomIndex) {
    var bdyNodes = new ArrayList();
    for (var i = this.iterator(); i.hasNext();) {
      var node = i.next();
      if (node.getLabel().getLocation(geomIndex) === Location.BOUNDARY) {
        bdyNodes.add(node);
      }
    }
    return bdyNodes;
  };

})();

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/util/AssertionFailedException.js
   */

  var AssertionFailedException = jsts.util.AssertionFailedException;

  /**
   * A utility for making programming assertions.
   *
   * @constructor
   * @name jsts.util.Assert
   */
  jsts.util.Assert = function() {};

  /**
   * Throws an <code>AssertionFailedException</code> with the given message if
   * the given assertion is not true.
   *
   * @param {boolean}
   *          assertion a condition that is supposed to be true.
   * @param {String=}
   *          message a description of the assertion.
   * @throws AssertionFailedException
   *           if the condition is false
   */
  jsts.util.Assert.isTrue = function(assertion, message) {
    if (!assertion) {
      if (message === null) {
        throw new AssertionFailedException();
      } else {
        throw new AssertionFailedException(message);
      }
    }
  };

  /**
   * Throws an <code>AssertionFailedException</code> with the given message if
   * the given objects are not equal, according to the <code>equals</code>
   * method.
   *
   * @param expectedValue
   *          the correct value.
   * @param actualValue
   *          the value being checked.
   * @param {string=}
   *          message a description of the assertion.
   * @throws AssertionFailedException
   *           if the two objects are not equal
   */
  jsts.util.Assert.equals = function(expectedValue, actualValue, message) {
    if (!actualValue.equals(expectedValue)) {
      throw new AssertionFailedException('Expected ' + expectedValue +
          ' but encountered ' + actualValue +
          (message != null ? ': ' + message : ''));
    }
  };

  /**
   * Always throws an <code>AssertionFailedException</code> with the given
   * message.
   *
   * @param {string=}
   *          message a description of the assertion.
   * @throws AssertionFailedException
   *           thrown always
   */
  jsts.util.Assert.shouldNeverReachHere = function(message) {
    throw new AssertionFailedException('Should never reach here' +
        (message != null ? ': ' + message : ''));
  };

})();




/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/util/Assert.js
   */

  var Assert = jsts.util.Assert;

  /**
   * Models the end of an edge incident on a node. EdgeEnds have a direction
   * determined by the direction of the ray from the initial point to the next
   * point. EdgeEnds are comparable under the ordering "a has a greater angle
   * with the x-axis than b". This ordering is used to sort EdgeEnds around a
   * node.
   *
   * @param {Edge}
   *          edge
   * @param {Coordinate}
   *          p0
   * @param {Coordinate}
   *          p1
   * @param {Label}
   *          label
   * @constructor
   */
  jsts.geomgraph.EdgeEnd = function(edge, p0, p1, label) {
    this.edge = edge;
    if (p0 && p1) {
      this.init(p0, p1);
    }
    if (label) {
      this.label = label || null;
    }
  };

  /**
   * the parent edge of this edge end
   *
   * @type {Edge}
   * @protected
   */
  jsts.geomgraph.EdgeEnd.prototype.edge = null;


  /**
   * @type {Label}
   * @protected
   */
  jsts.geomgraph.EdgeEnd.prototype.label = null;


  /**
   * the node this edge end originates at
   *
   * @type {Node}
   * @private
   */
  jsts.geomgraph.EdgeEnd.prototype.node = null;


  /**
   * points of initial line segment
   *
   * @type {Coordinate}
   * @private
   */
  jsts.geomgraph.EdgeEnd.prototype.p0 = null;
  jsts.geomgraph.EdgeEnd.prototype.p1 = null;


  /**
   * the direction vector for this edge from its starting point
   *
   * @type {double}
   * @private
   */
  jsts.geomgraph.EdgeEnd.prototype.dx = null;
  jsts.geomgraph.EdgeEnd.prototype.dy = null;


  /**
   * @type {int}
   * @private
   */
  jsts.geomgraph.EdgeEnd.prototype.quadrant = null;


  /**
   * @param {Coordinate}
   *          p0
   * @param {Coordinate}
   *          p1
   * @protected
   */
  jsts.geomgraph.EdgeEnd.prototype.init = function(p0, p1) {
    this.p0 = p0;
    this.p1 = p1;
    this.dx = p1.x - p0.x;
    this.dy = p1.y - p0.y;
    this.quadrant = jsts.geomgraph.Quadrant.quadrant(this.dx, this.dy);
    Assert.isTrue(!(this.dx === 0 && this.dy === 0),
        'EdgeEnd with identical endpoints found');
  };

  jsts.geomgraph.EdgeEnd.prototype.getEdge = function() {
    return this.edge;
  };

  jsts.geomgraph.EdgeEnd.prototype.getLabel = function() {
    return this.label;
  };

  jsts.geomgraph.EdgeEnd.prototype.getCoordinate = function() {
    return this.p0;
  };

  jsts.geomgraph.EdgeEnd.prototype.getDirectedCoordinate = function() {
    return this.p1;
  };

  jsts.geomgraph.EdgeEnd.prototype.getQuadrant = function() {
    return this.quadrant;
  };

  jsts.geomgraph.EdgeEnd.prototype.getDx = function() {
    return this.dx;
  };

  jsts.geomgraph.EdgeEnd.prototype.getDy = function() {
    return this.dy;
  };


  jsts.geomgraph.EdgeEnd.prototype.setNode = function(node) {
    this.node = node;
  };

  jsts.geomgraph.EdgeEnd.prototype.getNode = function() {
    return this.node;
  };

  jsts.geomgraph.EdgeEnd.prototype.compareTo = function(e) {
    return this.compareDirection(e);
  };


  /**
   * Implements the total order relation:
   * <p>
   * a has a greater angle with the positive x-axis than b
   * <p>
   * Using the obvious algorithm of simply computing the angle is not robust,
   * since the angle calculation is obviously susceptible to roundoff. A robust
   * algorithm is: - first compare the quadrant. If the quadrants are different,
   * it it trivial to determine which vector is "greater". - if the vectors lie
   * in the same quadrant, the computeOrientation function can be used to decide
   * the relative orientation of the vectors.
   *
   * @param {EdgeEnd}
   *          e
   * @return {number}
   */
  jsts.geomgraph.EdgeEnd.prototype.compareDirection = function(e) {
    if (this.dx === e.dx && this.dy === e.dy)
      return 0;
    // if the rays are in different quadrants, determining the ordering is
    // trivial
    if (this.quadrant > e.quadrant)
      return 1;
    if (this.quadrant < e.quadrant)
      return -1;
    // vectors are in the same quadrant - check relative orientation of
    // direction vectors
    // this is > e if it is CCW of e
    return jsts.algorithm.CGAlgorithms.computeOrientation(e.p0, e.p1, this.p1);
  };

  jsts.geomgraph.EdgeEnd.prototype.computeLabel = function(boundaryNodeRule) {
  // subclasses should override this if they are using labels
  };

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/Location.js
   * @requires jsts/geomgraph/Position.js
   * @requires jsts/geomgraph/EdgeEnd.js
   */

  var Location = jsts.geom.Location;
  var Position = jsts.geomgraph.Position;
  var EdgeEnd = jsts.geomgraph.EdgeEnd;


  /**
   * @constructor
   * @extends jsts.geomgraph.EdgeEnd
   */
  jsts.geomgraph.DirectedEdge = function(edge, isForward) {
    EdgeEnd.call(this, edge);

    this.depth = [0, -999, -999];

    this._isForward = isForward;
    if (isForward) {
      this.init(edge.getCoordinate(0), edge.getCoordinate(1));
    } else {
      var n = edge.getNumPoints() - 1;
      this.init(edge.getCoordinate(n), edge.getCoordinate(n - 1));
    }
    this.computeDirectedLabel();

  };
  jsts.geomgraph.DirectedEdge.prototype = new EdgeEnd();
  jsts.geomgraph.DirectedEdge.constructor = jsts.geomgraph.DirectedEdge;


  /**
   * Computes the factor for the change in depth when moving from one location
   * to another. E.g. if crossing from the INTERIOR to the EXTERIOR the depth
   * decreases, so the factor is -1
   */
  jsts.geomgraph.DirectedEdge.depthFactor = function(currLocation, nextLocation) {
    if (currLocation === Location.EXTERIOR &&
        nextLocation === Location.INTERIOR)
      return 1;
    else if (currLocation === Location.INTERIOR &&
        nextLocation === Location.EXTERIOR)
      return -1;
    return 0;
  };

  /**
   * @type {boolean}
   * @protected
   */
  jsts.geomgraph.DirectedEdge.prototype._isForward = null;
  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.DirectedEdge.prototype._isInResult = false;
  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.DirectedEdge.prototype._isVisited = false;

  /**
   * the symmetric edge
   *
   * @type {DirectedEdge}
   * @private
   */
  jsts.geomgraph.DirectedEdge.prototype.sym = null;
  /**
   * the next edge in the edge ring for the polygon containing this edge
   *
   * @type {DirectedEdge}
   * @private
   */
  jsts.geomgraph.DirectedEdge.prototype.next = null;
  /**
   * the next edge in the MinimalEdgeRing that contains this edge
   *
   * @type {DirectedEdge}
   * @private
   */
  jsts.geomgraph.DirectedEdge.prototype.nextMin = null;
  /**
   * the EdgeRing that this edge is part of
   *
   * @type {EdgeRing}
   * @private
   */
  jsts.geomgraph.DirectedEdge.prototype.edgeRing = null;
  /**
   * the MinimalEdgeRing that this edge is part of
   *
   * @type {EdgeRing}
   * @private
   */
  jsts.geomgraph.DirectedEdge.prototype.minEdgeRing = null;
  /**
   * The depth of each side (position) of this edge. The 0 element of the array
   * is never used.
   *
   * @type {Array.<number>}
   */
  jsts.geomgraph.DirectedEdge.prototype.depth = null;

  jsts.geomgraph.DirectedEdge.prototype.getEdge = function() {
    return this.edge;
  };
  jsts.geomgraph.DirectedEdge.prototype.setInResult = function(isInResult) {
    this._isInResult = isInResult;
  };
  jsts.geomgraph.DirectedEdge.prototype.isInResult = function() {
    return this._isInResult;
  };
  jsts.geomgraph.DirectedEdge.prototype.isVisited = function() {
    return this._isVisited;
  };
  jsts.geomgraph.DirectedEdge.prototype.setVisited = function(isVisited) {
    this._isVisited = isVisited;
  };
  jsts.geomgraph.DirectedEdge.prototype.setEdgeRing = function(edgeRing) {
    this.edgeRing = edgeRing;
  };
  jsts.geomgraph.DirectedEdge.prototype.getEdgeRing = function() {
    return this.edgeRing;
  };
  jsts.geomgraph.DirectedEdge.prototype.setMinEdgeRing = function(minEdgeRing) {
    this.minEdgeRing = minEdgeRing;
  };
  jsts.geomgraph.DirectedEdge.prototype.getMinEdgeRing = function() { return this.minEdgeRing; };
  jsts.geomgraph.DirectedEdge.prototype.getDepth = function(position) {
    return this.depth[position];
  };

  jsts.geomgraph.DirectedEdge.prototype.setDepth = function(position, depthVal) {
    if (this.depth[position] !== -999) {
      if (this.depth[position] !== depthVal)
        throw new jsts.error.TopologyError('assigned depths do not match', this
            .getCoordinate());
    }
    this.depth[position] = depthVal;
  };

  jsts.geomgraph.DirectedEdge.prototype.getDepthDelta = function() {
    var depthDelta = this.edge.getDepthDelta();
    if (!this._isForward)
      depthDelta = -depthDelta;
    return depthDelta;
  };

  /**
   * setVisitedEdge marks both DirectedEdges attached to a given Edge. This is
   * used for edges corresponding to lines, which will only appear oriented in a
   * single direction in the result.
   */
  jsts.geomgraph.DirectedEdge.prototype.setVisitedEdge = function(isVisited) {
    this.setVisited(isVisited);
    this.sym.setVisited(isVisited);
  };
  /**
   * Each Edge gives rise to a pair of symmetric DirectedEdges, in opposite
   * directions.
   *
   * @return the DirectedEdge for the same Edge but in the opposite direction.
   */
  jsts.geomgraph.DirectedEdge.prototype.getSym = function() {
    return this.sym;
  };
  jsts.geomgraph.DirectedEdge.prototype.isForward = function() {
    return this._isForward;
  };
  jsts.geomgraph.DirectedEdge.prototype.setSym = function(de) {
    this.sym = de;
  };
  jsts.geomgraph.DirectedEdge.prototype.getNext = function() {
    return this.next;
  };
  jsts.geomgraph.DirectedEdge.prototype.setNext = function(next) {
    this.next = next;
  };
  jsts.geomgraph.DirectedEdge.prototype.getNextMin = function() {
    return this.nextMin;
  };
  jsts.geomgraph.DirectedEdge.prototype.setNextMin = function(nextMin) {
    this.nextMin = nextMin;
  };

  /**
   * This edge is a line edge if
   * <ul>
   * <li> at least one of the labels is a line label
   * <li> any labels which are not line labels have all Locations = EXTERIOR
   * </ul>
   */
  jsts.geomgraph.DirectedEdge.prototype.isLineEdge = function() {
    var isLine = this.label.isLine(0) || this.label.isLine(1);
    var isExteriorIfArea0 = !this.label.isArea(0) ||
        this.label.allPositionsEqual(0, Location.EXTERIOR);
    var isExteriorIfArea1 = !this.label.isArea(1) ||
        this.label.allPositionsEqual(1, Location.EXTERIOR);

    return isLine && isExteriorIfArea0 && isExteriorIfArea1;
  };
  /**
   * This is an interior Area edge if
   * <ul>
   * <li> its label is an Area label for both Geometries
   * <li> and for each Geometry both sides are in the interior.
   * </ul>
   *
   * @return true if this is an interior Area edge.
   */
  jsts.geomgraph.DirectedEdge.prototype.isInteriorAreaEdge = function() {
    var isInteriorAreaEdge = true;
    for (var i = 0; i < 2; i++) {
      if (!(this.label.isArea(i) &&
          this.label.getLocation(i, Position.LEFT) === Location.INTERIOR && this.label
          .getLocation(i, Position.RIGHT) === Location.INTERIOR)) {
        isInteriorAreaEdge = false;
      }
    }
    return isInteriorAreaEdge;
  };

  /**
   * Compute the label in the appropriate orientation for this DirEdge
   *
   * @private
   */
  jsts.geomgraph.DirectedEdge.prototype.computeDirectedLabel = function() {
    this.label = new jsts.geomgraph.Label(this.edge.getLabel());
    if (!this._isForward)
      this.label.flip();
  };

  /**
   * Set both edge depths. One depth for a given side is provided. The other is
   * computed depending on the Location transition and the depthDelta of the
   * edge.
   */
  jsts.geomgraph.DirectedEdge.prototype.setEdgeDepths = function(position, depth) {
    // get the depth transition delta from R to L for this directed Edge
    var depthDelta = this.getEdge().getDepthDelta();
    if (!this._isForward)
      depthDelta = -depthDelta;

    // if moving from L to R instead of R to L must change sign of delta
    var directionFactor = 1;
    if (position === Position.LEFT)
      directionFactor = -1;

    var oppositePos = Position.opposite(position);
    var delta = depthDelta * directionFactor;
    var oppositeDepth = depth + delta;
    this.setDepth(position, depth);
    this.setDepth(oppositePos, oppositeDepth);
  };

})();



/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * An interface for rules which determine whether node points which are in
 * boundaries of {@link Lineal} geometry components are in the boundary of the
 * parent geometry collection. The SFS specifies a single kind of boundary node
 * rule, the {@link Mod2BoundaryNodeRule} rule. However, other kinds of Boundary
 * Node Rules are appropriate in specific situations (for instance, linear
 * network topology usually follows the {@link EndPointBoundaryNodeRule}.) Some
 * JTS operations allow the BoundaryNodeRule to be specified, and respect this
 * rule when computing the results of the operation.
 *
 * @see RelateOp
 * @see IsSimpleOp
 * @see PointLocator
 * @constructor
 */
jsts.algorithm.BoundaryNodeRule = function() {

};


/**
 * Tests whether a point that lies in <tt>boundaryCount</tt> geometry
 * component boundaries is considered to form part of the boundary of the parent
 * geometry.
 *
 * @param {int}
 *          boundaryCount the number of component boundaries that this point
 *          occurs in.
 * @return {boolean} true if points in this number of boundaries lie in the
 *         parent boundary.
 */
jsts.algorithm.BoundaryNodeRule.prototype.isInBoundary = function(boundaryCount) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * A {@link BoundaryNodeRule} specifies that points are in the boundary of a
 * lineal geometry iff the point lies on the boundary of an odd number of
 * components. Under this rule {@link LinearRing}s and closed
 * {@link LineString}s have an empty boundary.
 * <p>
 * This is the rule specified by the <i>OGC SFS</i>, and is the default rule
 * used in JTS.
 */
jsts.algorithm.Mod2BoundaryNodeRule = function() {

};

jsts.algorithm.Mod2BoundaryNodeRule.prototype = new jsts.algorithm.BoundaryNodeRule();

jsts.algorithm.Mod2BoundaryNodeRule.prototype.isInBoundary = function(
    boundaryCount) {
  // the "Mod-2 Rule"
  return boundaryCount % 2 === 1;
};

jsts.algorithm.BoundaryNodeRule.MOD2_BOUNDARY_RULE = new jsts.algorithm.Mod2BoundaryNodeRule();
jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE = jsts.algorithm.BoundaryNodeRule.MOD2_BOUNDARY_RULE;


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/GeometryCollection.js
   */

  /**
   * @constructor
   * @extends jsts.geom.GeometryCollection
   */
  jsts.geom.MultiPolygon = function(geometries, factory) {
    this.geometries = geometries || [];
    this.factory = factory;
  };

  jsts.geom.MultiPolygon.prototype = new jsts.geom.GeometryCollection();
  jsts.geom.MultiPolygon.constructor = jsts.geom.MultiPolygon;

  /**
   * Computes the boundary of this geometry
   *
   * @return {Geometry} a lineal geometry (which may be empty).
   * @see Geometry#getBoundary
   */
  jsts.geom.MultiPolygon.prototype.getBoundary = function() {
    if (this.isEmpty()) {
      return this.getFactory().createMultiLineString(null);
    }
    var allRings = [];
    for (var i = 0; i < this.geometries.length; i++) {
      var polygon = this.geometries[i];
      var rings = polygon.getBoundary();
      for (var j = 0; j < rings.getNumGeometries(); j++) {
        allRings.push(rings.getGeometryN(j));
      }
    }
    return this.getFactory().createMultiLineString(allRings);
  };


  /**
   * @param {Geometry}
   *          other
   * @param {double}
   *          tolerance
   * @return {boolean}
   */
  jsts.geom.MultiPolygon.prototype.equalsExact = function(other, tolerance) {
    if (!this.isEquivalentClass(other)) {
      return false;
    }
    return jsts.geom.GeometryCollection.prototype.equalsExact.call(this, other,
        tolerance);
  };

  jsts.geom.MultiPolygon.prototype.CLASS_NAME = 'jsts.geom.MultiPolygon';

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * @param {Coordinate}
 *          coord
 * @param {int}
 *          segmentIndex
 * @param {double}
 *          dist
 * @constructor
 */
jsts.geomgraph.EdgeIntersection = function(coord, segmentIndex, dist) {
  this.coord = new jsts.geom.Coordinate(coord);
  this.segmentIndex = segmentIndex;
  this.dist = dist;
};


/**
 * the point of intersection
 *
 * @type {Coordinate}
 */
jsts.geomgraph.EdgeIntersection.prototype.coord = null;


/**
 * the index of the containing line segment in the parent edge
 *
 * @type {int}
 */
jsts.geomgraph.EdgeIntersection.prototype.segmentIndex = null;


/**
 * the edge distance of this point along the containing line segment
 *
 * @type {double}
 */
jsts.geomgraph.EdgeIntersection.prototype.dist = null;


/**
 * @return {Coordinate}
 */
jsts.geomgraph.EdgeIntersection.prototype.getCoordinate = function() {
  return this.coord;
};


/**
 * @return {int}
 */
jsts.geomgraph.EdgeIntersection.prototype.getSegmentIndex = function() {
  return this.segmentIndex;
};


/**
 * @return {double}
 */
jsts.geomgraph.EdgeIntersection.prototype.getDistance = function() {
  return this.dist;
};


/**
 * @param {EdgeIntersection}
 *          other
 * @return {int}
 */
jsts.geomgraph.EdgeIntersection.prototype.compareTo = function(other) {
  return this.compare(other.segmentIndex, other.dist);
};


/**
 * @param {int}
 *          segmentIndex
 * @param {double}
 *          dist
 * @return {int} -1 this EdgeIntersection is located before the argument
 *         location.
 * @return {int} 0 this EdgeIntersection is at the argument location.
 * @return {int} 1 this EdgeIntersection is located after the argument location.
 */
jsts.geomgraph.EdgeIntersection.prototype.compare = function(segmentIndex, dist) {
  if (this.segmentIndex < segmentIndex)
    return -1;
  if (this.segmentIndex > segmentIndex)
    return 1;
  if (this.dist < dist)
    return -1;
  if (this.dist > dist)
    return 1;
  return 0;
};


/**
 * @param {int}
 *          maxSegmentIndex
 * @return {boolean}
 */
jsts.geomgraph.EdgeIntersection.prototype.isEndPoint = function(maxSegmentIndex) {
  if (this.segmentIndex === 0 && this.dist === 0.0)
    return true;
  if (this.segmentIndex === maxSegmentIndex)
    return true;
  return false;
};

jsts.geomgraph.EdgeIntersection.prototype.toString = function() {
  return '' + this.segmentIndex + this.dist;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geomgraph/EdgeIntersection.js
   */

  var EdgeIntersection = jsts.geomgraph.EdgeIntersection;
  var TreeMap = javascript.util.TreeMap;

  /**
   * @constructor
   * @name jsts.geomgraph.EdgeIntersectionList
   */
  jsts.geomgraph.EdgeIntersectionList = function(edge) {
    this.nodeMap = new TreeMap();
    this.edge = edge;
  };



  /**
   * @type {javascript.util.Map}
   * @private
   */
  jsts.geomgraph.EdgeIntersectionList.prototype.nodeMap = null;


  /**
   * the parent edge
   *
   * @type {Edge}
   */
  jsts.geomgraph.EdgeIntersectionList.prototype.edge = null;

  jsts.geomgraph.EdgeIntersectionList.prototype.isIntersection = function(pt) {
    for (var it = this.iterator(); it.hasNext(); ) {
      var ei = it.next();
      if (ei.coord.equals(pt)) {
       return true;
      }
    }
    return false;
  };


  /**
   * Adds an intersection into the list, if it isn't already there. The input
   * segmentIndex and dist are expected to be normalized.
   *
   * @param {Coordinate}
   *          intPt
   * @param {int}
   *          segmentIndex
   * @param {double}
   *          dist
   * @return {EdgeIntersection} the EdgeIntersection found or added.
   */
  jsts.geomgraph.EdgeIntersectionList.prototype.add = function(intPt, segmentIndex, dist) {
    var eiNew = new EdgeIntersection(intPt, segmentIndex, dist);
    var ei = this.nodeMap.get(eiNew);
    if (ei !== null) {
      return ei;
    }
    this.nodeMap.put(eiNew, eiNew);
    return eiNew;
  };

  /**
   * Returns an iterator of {@link EdgeIntersection}s
   *
   * @return an Iterator of EdgeIntersections.
   */
  jsts.geomgraph.EdgeIntersectionList.prototype.iterator = function() {
    return this.nodeMap.values().iterator();
  };


  /**
   * Adds entries for the first and last points of the edge to the list
   */
  jsts.geomgraph.EdgeIntersectionList.prototype.addEndpoints = function() {
    var maxSegIndex = this.edge.pts.length - 1;
    this.add(this.edge.pts[0], 0, 0.0);
    this.add(this.edge.pts[maxSegIndex], maxSegIndex, 0.0);
  };

  /**
   * Creates new edges for all the edges that the intersections in this
   * list split the parent edge into.
   * Adds the edges to the input list (this is so a single list
   * can be used to accumulate all split edges for a Geometry).
   *
   * @param edgeList a list of EdgeIntersections.
   */
  jsts.geomgraph.EdgeIntersectionList.prototype.addSplitEdges = function(edgeList)
  {
    // ensure that the list has entries for the first and last point of the edge
    this.addEndpoints();

    var it = this.iterator();
    // there should always be at least two entries in the list
    var eiPrev = it.next();
    while (it.hasNext()) {
      var ei = it.next();
      var newEdge = this.createSplitEdge(eiPrev, ei);
      edgeList.add(newEdge);

      eiPrev = ei;
    }
  };
  /**
   * Create a new "split edge" with the section of points between
   * (and including) the two intersections.
   * The label for the new edge is the same as the label for the parent edge.
   */
  jsts.geomgraph.EdgeIntersectionList.prototype.createSplitEdge = function(ei0,  ei1)  {
    var npts = ei1.segmentIndex - ei0.segmentIndex + 2;

    var lastSegStartPt = this.edge.pts[ei1.segmentIndex];
    // if the last intersection point is not equal to the its segment start pt,
    // add it to the points list as well.
    // (This check is needed because the distance metric is not totally reliable!)
    // The check for point equality is 2D only - Z values are ignored
    var useIntPt1 = ei1.dist > 0.0 || ! ei1.coord.equals2D(lastSegStartPt);
    if (! useIntPt1) {
      npts--;
    }

    var pts = [];
    var ipt = 0;
    pts[ipt++] = new jsts.geom.Coordinate(ei0.coord);
    for (var i = ei0.segmentIndex + 1; i <= ei1.segmentIndex; i++) {
      pts[ipt++] = this.edge.pts[i];
    }
    if (useIntPt1) pts[ipt] = ei1.coord;
    return new jsts.geomgraph.Edge(pts, new jsts.geomgraph.Label(this.edge.label));
  };

})();

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/Location.js
   * @requires jsts/geomgraph/Position.js
   */

  var Location = jsts.geom.Location;
  var Position = jsts.geomgraph.Position;

  /**
   * A Depth object records the topological depth of the sides of an Edge for up
   * to two Geometries.
   *
   * @constructor
   */
  jsts.geomgraph.Depth = function() {
    // initialize depth array to a sentinel value
    this.depth = [[], []];
    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 3; j++) {
        this.depth[i][j] = jsts.geomgraph.Depth.NULL_VALUE;
      }
    }
  };

  jsts.geomgraph.Depth.NULL_VALUE = -1;

  jsts.geomgraph.Depth.depthAtLocation = function(location) {
    if (location === Location.EXTERIOR)
      return 0;
    if (location === Location.INTERIOR)
      return 1;
    return jsts.geomgraph.Depth.NULL_VALUE;
  };

  jsts.geomgraph.Depth.prototype.depth = null;


  jsts.geomgraph.Depth.prototype.getDepth = function(geomIndex, posIndex) {
    return this.depth[geomIndex][posIndex];
  };

  jsts.geomgraph.Depth.prototype.setDepth = function(geomIndex, posIndex,
      depthValue) {
    this.depth[geomIndex][posIndex] = depthValue;
  };

  jsts.geomgraph.Depth.prototype.getLocation = function(geomIndex, posIndex) {
    if (this.depth[geomIndex][posIndex] <= 0)
      return Location.EXTERIOR;
    return Location.INTERIOR;
  };

  jsts.geomgraph.Depth.prototype.add = function(geomIndex, posIndex, location) {
    if (location === Location.INTERIOR)
      this.depth[geomIndex][posIndex]++;
  };

  /**
   * A Depth object is null (has never been initialized) if all depths are null.
   */
  jsts.geomgraph.Depth.prototype.isNull = function() {
    if (arguments.length > 0) {
      return this.isNull2.apply(this, arguments);
    }

    for (var i = 0; i < 2; i++) {
      for (var j = 0; j < 3; j++) {
        if (this.depth[i][j] !== jsts.geomgraph.Depth.NULL_VALUE)
          return false;
      }
    }
    return true;
  };

  jsts.geomgraph.Depth.prototype.isNull2 = function(geomIndex) {
    if (arguments.length > 1) {
      return this.isNull3.apply(this, arguments);
    }

    return this.depth[geomIndex][1] == jsts.geomgraph.Depth.NULL_VALUE;
  };

  jsts.geomgraph.Depth.prototype.isNull3 = function(geomIndex, posIndex) {
    return this.depth[geomIndex][posIndex] == jsts.geomgraph.Depth.NULL_VALUE;
  };

  jsts.geomgraph.Depth.prototype.add = function(lbl) {
    for (var i = 0; i < 2; i++) {
      for (var j = 1; j < 3; j++) {
        var loc = lbl.getLocation(i, j);
        if (loc === Location.EXTERIOR || loc === Location.INTERIOR) {
          // initialize depth if it is null, otherwise add this location value
          if (this.isNull(i, j)) {
            this.depth[i][j] = jsts.geomgraph.Depth.depthAtLocation(loc);
          } else
            this.depth[i][j] += jsts.geomgraph.Depth.depthAtLocation(loc);
        }
      }
    }
  };

  jsts.geomgraph.Depth.prototype.getDelta = function(geomIndex) {
    return this.depth[geomIndex][Position.RIGHT] -
        this.depth[geomIndex][Position.LEFT];
  };

  /**
   * Normalize the depths for each geometry, if they are non-null. A normalized
   * depth has depth values in the set { 0, 1 }. Normalizing the depths involves
   * reducing the depths by the same amount so that at least one of them is 0.
   * If the remaining value is > 0, it is set to 1.
   */
  jsts.geomgraph.Depth.prototype.normalize = function() {
    for (var i = 0; i < 2; i++) {
      if (!this.isNull(i)) {
        var minDepth = this.depth[i][1];
        if (this.depth[i][2] < minDepth)
          minDepth = this.depth[i][2];

        if (minDepth < 0)
          minDepth = 0;
        for (var j = 1; j < 3; j++) {
          var newValue = 0;
          if (this.depth[i][j] > minDepth)
            newValue = 1;
          this.depth[i][j] = newValue;
        }
      }
    }
  };

  jsts.geomgraph.Depth.prototype.toString = function() {
    return 'A: ' + this.depth[0][1] + ',' + this.depth[0][2] + ' B: ' +
        this.depth[1][1] + ',' + this.depth[1][2];
  };

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Utility functions for working with quadrants, which are numbered as follows:
 *
 * <pre>
 * 1 | 0
 * --+--
 * 2 | 3
 * &lt;pre&gt;
 * @constructor
 *
 */
jsts.geomgraph.Quadrant = function() {

};

jsts.geomgraph.Quadrant.NE = 0;
jsts.geomgraph.Quadrant.NW = 1;
jsts.geomgraph.Quadrant.SW = 2;
jsts.geomgraph.Quadrant.SE = 3;


/**
 * Returns the quadrant of a directed line segment (specified as x and y
 * displacements, which cannot both be 0).
 *
 * @throws IllegalArgumentException
 *           if the displacements are both 0
 */
jsts.geomgraph.Quadrant.quadrant = function(dx, dy) {
  if (dx instanceof jsts.geom.Coordinate) {
    return jsts.geomgraph.Quadrant.quadrant2.apply(this, arguments);
  }

  if (dx === 0.0 && dy === 0.0)
    throw new jsts.error.IllegalArgumentError(
        'Cannot compute the quadrant for point ( ' + dx + ', ' + dy + ' )');
  if (dx >= 0.0) {
    if (dy >= 0.0)
      return jsts.geomgraph.Quadrant.NE;
    else
      return jsts.geomgraph.Quadrant.SE;
  } else {
    if (dy >= 0.0)
      return jsts.geomgraph.Quadrant.NW;
    else
      return jsts.geomgraph.Quadrant.SW;
  }
};


/**
 * Returns the quadrant of a directed line segment from p0 to p1.
 *
 * @throws IllegalArgumentException
 *           if the points are equal
 */
jsts.geomgraph.Quadrant.quadrant2 = function(p0, p1) {
  if (p1.x === p0.x && p1.y === p0.y)
    throw new jsts.error.IllegalArgumentError(
        'Cannot compute the quadrant for two identical points ' + p0);

  if (p1.x >= p0.x) {
    if (p1.y >= p0.y)
      return jsts.geomgraph.Quadrant.NE;
    else
      return jsts.geomgraph.Quadrant.SE;
  } else {
    if (p1.y >= p0.y)
      return jsts.geomgraph.Quadrant.NW;
    else
      return jsts.geomgraph.Quadrant.SW;
  }
};


/**
 * Returns true if the quadrants are 1 and 3, or 2 and 4
 */
jsts.geomgraph.Quadrant.isOpposite = function(quad1, quad2) {
  if (quad1 === quad2)
    return false;
  var diff = (quad1 - quad2 + 4) % 4;
  // if quadrants are not adjacent, they are opposite
  if (diff === 2)
    return true;
  return false;
};


/**
 * Returns the right-hand quadrant of the halfplane defined by the two
 * quadrants, or -1 if the quadrants are opposite, or the quadrant if they are
 * identical.
 */
jsts.geomgraph.Quadrant.commonHalfPlane = function(quad1, quad2) {
  // if quadrants are the same they do not determine a unique common halfplane.
  // Simply return one of the two possibilities
  if (quad1 === quad2)
    return quad1;
  var diff = (quad1 - quad2 + 4) % 4;
  // if quadrants are not adjacent, they do not share a common halfplane
  if (diff === 2)
    return -1;
  //
  var min = (quad1 < quad2) ? quad1 : quad2;
  var max = (quad1 > quad2) ? quad1 : quad2;
  // for this one case, the righthand plane is NOT the minimum index;
  if (min === 0 && max === 3)
    return 3;
  // in general, the halfplane index is the minimum of the two adjacent
  // quadrants
  return min;
};


/**
 * Returns whether the given quadrant lies within the given halfplane (specified
 * by its right-hand quadrant).
 */
jsts.geomgraph.Quadrant.isInHalfPlane = function(quad, halfPlane) {
  if (halfPlane === jsts.geomgraph.Quadrant.SE) {
    return quad === jsts.geomgraph.Quadrant.SE ||
        quad === jsts.geomgraph.Quadrant.SW;
  }
  return quad === halfPlane || quad === halfPlane + 1;
};


/**
 * Returns true if the given quadrant is 0 or 1.
 */
jsts.geomgraph.Quadrant.isNorthern = function(quad) {
  return quad === jsts.geomgraph.Quadrant.NE ||
      quad === jsts.geomgraph.Quadrant.NW;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * MonotoneChains are a way of partitioning the segments of an edge to
 * allow for fast searching of intersections.
 * Specifically, a sequence of contiguous line segments
 * is a monotone chain iff all the vectors defined by the oriented segments
 * lies in the same quadrant.
 * <p>
 * Monotone Chains have the following useful properties:
 * <ol>
 * <li>the segments within a monotone chain will never intersect each other
 * <li>the envelope of any contiguous subset of the segments in a monotone chain
 * is simply the envelope of the endpoints of the subset.
 * </ol>
 * Property 1 means that there is no need to test pairs of segments from within
 * the same monotone chain for intersection.
 * Property 2 allows
 * binary search to be used to find the intersection points of two monotone chains.
 * For many types of real-world data, these properties eliminate a large number of
 * segment comparisons, producing substantial speed gains.
 *
 * @constructor
 */
jsts.geomgraph.index.MonotoneChainIndexer = function() {

};

/**
 * @param {javascript.util.List}
 *          list
 * @return {int[]}
 */
jsts.geomgraph.index.MonotoneChainIndexer.toIntArray = function(
    list) {
  var array = [];
  for (var i = list.iterator(); i.hasNext(); ) {
    var element = i.next();
    array.push(element);
  }
  return array;
};

/**
 * @param {Coordinate[]}
 *          pts
 * @return {int[]}
 */
jsts.geomgraph.index.MonotoneChainIndexer.prototype.getChainStartIndices = function(
    pts) {
  // find the startpoint (and endpoints) of all monotone chains in this edge
  var start = 0;
  var startIndexList = new javascript.util.ArrayList();
  startIndexList.add(start);
  do {
    var last = this.findChainEnd(pts, start);
    startIndexList.add(last);
    start = last;
  } while (start < pts.length - 1);

  // copy list to an array of ints, for efficiency
  var startIndex = jsts.geomgraph.index.MonotoneChainIndexer.toIntArray(startIndexList);
  return startIndex;
};

/**
 * return the index of the last point in the monotone chain
 *
 * @param {Coordinate[]}
 *          pts
 * @param {int}
 *          start
 * @return {int}
 */
jsts.geomgraph.index.MonotoneChainIndexer.prototype.findChainEnd = function(
    pts, start) {
  // determine quadrant for chain
  var chainQuad = jsts.geomgraph.Quadrant.quadrant(pts[start], pts[start + 1]);
  var last = start + 1;
  while (last < pts.length) {
    // compute quadrant for next possible segment in chain
    var quad = jsts.geomgraph.Quadrant.quadrant(pts[last - 1], pts[last]);
    if (quad != chainQuad) {
      break;
    }
    last++;
  }
  return last - 1;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * MonotoneChains are a way of partitioning the segments of an edge to
 * allow for fast searching of intersections.
 * They have the following properties:
 * <ol>
 * <li>the segments within a monotone chain will never intersect each other
 * <li>the envelope of any contiguous subset of the segments in a monotone chain
 * is simply the envelope of the endpoints of the subset.
 * </ol>
 * Property 1 means that there is no need to test pairs of segments from
 * the same monotone chain for intersection.
 * Property 2 allows
 * binary search to be used to find the intersection points of two monotone chains.
 * For many types of real-world data, these properties eliminate a large number of
 * segment comparisons, producing substantial speed gains.
 */

/**
 * @param {Edge}
 *          e
 * @constructor
 */
jsts.geomgraph.index.MonotoneChainEdge = function(e) {
  this.e = e;
  this.pts = e.getCoordinates();
  var mcb = new jsts.geomgraph.index.MonotoneChainIndexer();
  this.startIndex = mcb.getChainStartIndices(this.pts);
};

/**
 * @type {Edge}
 */
jsts.geomgraph.index.MonotoneChainEdge.prototype.e = null;

/**
 * cache a reference to the coord array, for efficiency
 *
 * @type {Coordinate[]}
 */
jsts.geomgraph.index.MonotoneChainEdge.prototype.pts = null;

/**
 * the lists of start/end indexes of the monotone chains.
 * Includes the end point of the edge as a sentinel
 *
 * @type {int[]}
 */
jsts.geomgraph.index.MonotoneChainEdge.prototype.startIndex = null;

/**
 * these envelopes are created once and reused
 *
 * @type {Envelope}
 */
jsts.geomgraph.index.MonotoneChainEdge.prototype.env1 = new jsts.geom.Envelope();
jsts.geomgraph.index.MonotoneChainEdge.prototype.env2 = new jsts.geom.Envelope();

jsts.geomgraph.index.MonotoneChainEdge.prototype.getCoordinates = function() {
	return this.pts;
};

jsts.geomgraph.index.MonotoneChainEdge.prototype.getStartIndexes = function() {
	return this.startIndex;
};

/**
 * @param {int}
 *          chainIndex
 * @return {double}
 */
jsts.geomgraph.index.MonotoneChainEdge.prototype.getMinX = function(
    chainIndex) {
  var x1 = this.pts[this.startIndex[chainIndex]].x;
  var x2 = this.pts[this.startIndex[chainIndex + 1]].x;
  if (x1 < x2) {
  	return x1;
  }
  return x2;
};

/**
 * @param {int}
 *          chainIndex
 * @return {double}
 */
jsts.geomgraph.index.MonotoneChainEdge.prototype.getMaxX = function(
    chainIndex) {
  var x1 = this.pts[this.startIndex[chainIndex]].x;
  var x2 = this.pts[this.startIndex[chainIndex + 1]].x;
  if (x1 > x2) {
  	return x1;
  }
  return x2;
};

/**
 * @param {MonotoneChainEdge}
 *          mce
 * @param {SegmentIntersector}
 *          si
 */
jsts.geomgraph.index.MonotoneChainEdge.prototype.computeIntersects = function(
    mce, si) {
  for (var i = 0; i < this.startIndex.length - 1; i++) {
    for (var j = 0; j < mce.startIndex.length - 1; j++) {
    	this.computeIntersectsForChain(i, mce, j, si);
    }
  }
};

/**
 * @param {int}
 *          chainIndex0
 * @param {MonotoneChainEdge}
 *          mce
 * @param {int}
 *          chainIndex1
 * @param {SegmentIntersector}
 *          si
 */
jsts.geomgraph.index.MonotoneChainEdge.prototype.computeIntersectsForChain = function(
    chainIndex0, mce, chainIndex1, si) {
  this.computeIntersectsForChain2(this.startIndex[chainIndex0], this.startIndex[chainIndex0 + 1],
                                  mce,
                                  mce.startIndex[chainIndex1], mce.startIndex[chainIndex1 + 1],
                                  si);
};

/**
 * @param {int}
 *          start0
 * @param {int}
 *          end0
 * @param {MonotoneChainEdge}
 *          mce
 * @param {int}
 *          start1
 * @param {int}
 *          end1
 * @param {SegmentIntersector}
 *          ei
 */
jsts.geomgraph.index.MonotoneChainEdge.prototype.computeIntersectsForChain2 = function(
    start0, end0, mce, start1, end1, ei) {
  var p00 = this.pts[start0];
  var p01 = this.pts[end0];
  var p10 = mce.pts[start1];
  var p11 = mce.pts[end1];

  //console.log("computeIntersectsForChain2:" + p00 + p01 + p10 + p11);
  // terminating condition for the recursion
  if (end0 - start0 == 1 && end1 - start1 == 1) {
    ei.addIntersections(this.e, start0, mce.e, start1);
    return;
  }

  // nothing to do if the envelopes of these chains don't overlap
  this.env1.init(p00, p01);
  this.env2.init(p10, p11);
  if (!this.env1.intersects(this.env2)) {
    return;
  }

  // the chains overlap, so split each in half and iterate (binary search)
  var mid0 = Math.floor((start0 + end0) / 2);
  var mid1 = Math.floor((start1 + end1) / 2);

  // Assert: mid != start or end (since we checked above for end - start <= 1)
  // check terminating conditions before recursing
  if (start0 < mid0) {
    if (start1 < mid1) {
      this.computeIntersectsForChain2(start0, mid0, mce, start1, mid1, ei);
    }
    if (mid1 < end1) {
      this.computeIntersectsForChain2(start0, mid0, mce, mid1, end1, ei);
    }
  }
  if (mid0 < end0) {
    if (start1 < mid1) {
      this.computeIntersectsForChain2(mid0, end0, mce, start1, mid1, ei);
    }
    if (mid1 < end1) {
      this.computeIntersectsForChain2(mid0, end0, mce, mid1, end1, ei);
    }
  }
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/GraphComponent.js
 */

/**
 * @param {Coordinate[]}
 *          pts
 * @param {Label}
 *          label
 * @augments jsts.geomgraph.GraphComponent
 * @constructor
 */
jsts.geomgraph.Edge = function(pts, label) {
  this.pts = pts;
  this.label = label;
  this.eiList = new jsts.geomgraph.EdgeIntersectionList(this);
  this.depth = new jsts.geomgraph.Depth();
};

jsts.geomgraph.Edge.prototype = new jsts.geomgraph.GraphComponent();
jsts.geomgraph.Edge.constructor = jsts.geomgraph.Edge;

/**
 * Updates an IM from the label for an edge. Handles edges from both L and A
 * geometries.
 */
jsts.geomgraph.Edge.updateIM = function(label, im) {
  im.setAtLeastIfValid(label.getLocation(0, jsts.geomgraph.Position.ON), label
      .getLocation(1, jsts.geomgraph.Position.ON), 1);
  if (label.isArea()) {
    im.setAtLeastIfValid(label.getLocation(0, jsts.geomgraph.Position.LEFT),
        label.getLocation(1, jsts.geomgraph.Position.LEFT), 2);
    im.setAtLeastIfValid(label.getLocation(0, jsts.geomgraph.Position.RIGHT),
        label.getLocation(1, jsts.geomgraph.Position.RIGHT), 2);
  }
};


/**
 * @private
 */
jsts.geomgraph.Edge.prototype.pts = null;


/**
 * @private
 */
jsts.geomgraph.Edge.prototype.env = null;


/**
 * @private
 */
jsts.geomgraph.Edge.prototype.name = null;


/**
 * @type {MonotoneChainEdge}
 * @private
 */
jsts.geomgraph.Edge.prototype.mce = null;


/**
 * @private
 */
jsts.geomgraph.Edge.prototype._isIsolated = true;


/**
 * @type {Depth}
 * @private
 */
jsts.geomgraph.Edge.prototype.depth = null;


/**
 * // the change in area depth from the R to L side of this edge
 */
jsts.geomgraph.Edge.prototype.depthDelta = 0;


/**
 * @type {jsts.geomgraph.EdgeIntersectionList}
 * @private
 */
jsts.geomgraph.Edge.prototype.eiList = null;


/**
 * @return {int}
 */
jsts.geomgraph.Edge.prototype.getNumPoints = function() {
  return this.pts.length;
};


jsts.geomgraph.Edge.prototype.getEnvelope = function() {
  // compute envelope lazily
  if (this.env === null) {
    this.env = new jsts.geom.Envelope();
    for (var i = 0; i < this.pts.length; i++) {
      this.env.expandToInclude(pts[i]);
    }
  }
  return env;
};

jsts.geomgraph.Edge.prototype.getDepth = function() {
  return this.depth;
};

/**
 * The depthDelta is the change in depth as an edge is crossed from R to L
 *
 * @return the change in depth as the edge is crossed from R to L.
 */
jsts.geomgraph.Edge.prototype.getDepthDelta = function() {
  return this.depthDelta;
};
jsts.geomgraph.Edge.prototype.setDepthDelta = function(depthDelta) {
  this.depthDelta = depthDelta;
};

/**
 * @return {Coordinate[]}
 */
jsts.geomgraph.Edge.prototype.getCoordinates = function() {
  return this.pts;
};


/**
 * @param {int}
 *          i
 * @return {Coordinate}
 */
jsts.geomgraph.Edge.prototype.getCoordinate = function(i) {
  if (i === undefined) {
    if (this.pts.length > 0) {
      return this.pts[0];
    } else {
      return null;
    }
  }

  return this.pts[i];
};


/**
 * @return {boolean}
 */
jsts.geomgraph.Edge.prototype.isClosed = function() {
  return this.pts[0].equals(this.pts[this.pts.length - 1]);
};


jsts.geomgraph.Edge.prototype.setIsolated = function(isIsolated) {
  this._isIsolated = isIsolated;
};
jsts.geomgraph.Edge.prototype.isIsolated = function() {
  return this._isIsolated;
};


/**
 * Adds EdgeIntersections for one or both intersections found for a segment of
 * an edge to the edge intersection list.
 *
 * @param {LineIntersector}
 *          li
 * @param {int}
 *          segmentIndex
 * @param {int}
 *          geomIndex
 */
jsts.geomgraph.Edge.prototype.addIntersections = function(li, segmentIndex,
    geomIndex) {
  for (var i = 0; i < li.getIntersectionNum(); i++) {
    this.addIntersection(li, segmentIndex, geomIndex, i);
  }
};


/**
 * Add an EdgeIntersection for intersection intIndex. An intersection that falls
 * exactly on a vertex of the edge is normalized to use the higher of the two
 * possible segmentIndexes
 *
 * @param {LineIntersector}
 *          li
 * @param {int}
 *          segmentIndex
 * @param {int}
 *          geomIndex
 * @param {int}
 *          intIndex
 */
jsts.geomgraph.Edge.prototype.addIntersection = function(li, segmentIndex,
    geomIndex, intIndex) {
  var intPt = new jsts.geom.Coordinate(li.getIntersection(intIndex));
  var normalizedSegmentIndex = segmentIndex;
  var dist = li.getEdgeDistance(geomIndex, intIndex);
  // normalize the intersection point location
  var nextSegIndex = normalizedSegmentIndex + 1;
  if (nextSegIndex < this.pts.length) {
    var nextPt = this.pts[nextSegIndex];

    // Normalize segment index if intPt falls on vertex
    // The check for point equality is 2D only - Z values are ignored
    if (intPt.equals2D(nextPt)) {
      normalizedSegmentIndex = nextSegIndex;
      dist = 0.0;
    }
  }
  /**
   * Add the intersection point to edge intersection list.
   */
  var ei = this.eiList.add(intPt, normalizedSegmentIndex, dist);
};


/**
 * @return {int}
 */
jsts.geomgraph.Edge.prototype.getMaximumSegmentIndex = function() {
  return this.pts.length - 1;
};

jsts.geomgraph.Edge.prototype.getEdgeIntersectionList = function() {
  return this.eiList;
};

jsts.geomgraph.Edge.prototype.getMonotoneChainEdge = function() {
  if (this.mce == null) {
    this.mce = new jsts.geomgraph.index.MonotoneChainEdge(this);
  }
  return this.mce;
};

jsts.geomgraph.Edge.prototype.isClosed = function()
{
  return this.pts[0].equals(this.pts[this.pts.length - 1]);
};
/**
 * An Edge is collapsed if it is an Area edge and it consists of
 * two segments which are equal and opposite (eg a zero-width V).
 */
jsts.geomgraph.Edge.prototype.isCollapsed = function()
{
  if (! this.label.isArea()) return false;
  if (this.pts.length != 3) return false;
  if (this.pts[0].equals(this.pts[2])) return true;
  return false;
};
jsts.geomgraph.Edge.prototype.getCollapsedEdge = function()
{
  var newPts = [];
  newPts[0] = this.pts[0];
  newPts[1] = this.pts[1];
  var newe = new jsts.geomgraph.Edge(newPts, jsts.geomgraph.Label.toLineLabel(this.label));
  return newe;
};


/**
 * Update the IM with the contribution for this component. A component only
 * contributes if it has a labelling for both parent geometries
 */
jsts.geomgraph.Edge.prototype.computeIM = function(im) {
  jsts.geomgraph.Edge.updateIM(this.label, im);
};

/**
 * @return true if the coordinate sequences of the Edges are identical.
 */
jsts.geomgraph.Edge.prototype.isPointwiseEqual = function(e)
{
  if (this.pts.length != e.pts.length) return false;

  for (var i = 0; i < this.pts.length; i++) {
    if (! this.pts[i].equals2D(e.pts[i])) {
       return false;
    }
  }
  return true;
};

// TODO: port rest..

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  var ArrayList = javascript.util.ArrayList;

  /**
   * Computes the intersection of line segments, and adds the intersection to
   * the edges containing the segments.
   *
   * @param {LineIntersector}
   *          li
   * @param {boolean}
   *          includeProper
   * @param {boolean}
   *          recordIsolated
   * @constructor
   */
  jsts.geomgraph.index.SegmentIntersector = function(li, includeProper, recordIsolated) {
    this.li = li;
    this.includeProper = includeProper;
    this.recordIsolated = recordIsolated;
  };


  /**
   * @param {number}
   *          i1
   * @param {number}
   *          i2
   * @return {boolean}
   */
  jsts.geomgraph.index.SegmentIntersector.isAdjacentSegments = function(i1, i2) {
    return Math.abs(i1 - i2) === 1;
  };


  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype._hasIntersection = false;


  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.hasProper = false;


  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.hasProperInterior = false;


  /**
   * the proper intersection point found
   *
   * @type {Coordinate}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.properIntersectionPoint = null;


  /**
   * @type {LineIntersector}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.li = null;


  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.includeProper = null;


  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.recordIsolated = null;


  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.isSelfIntersection = null;


  /**
   * @type {number}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.numIntersections = 0;


  /**
   * testing only
   *
   * @type {number}
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.numTests = 0;


  /**
   * @type {Array.<javascript.util.Collection>}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.bdyNodes = null;


  /**
   * @param {javascript.util.Collection}
   *          bdyNodes0
   * @param {javascript.util.Collection}
   *          bdyNodes1
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.setBoundaryNodes = function(bdyNodes0, bdyNodes1) {
    this.bdyNodes = [];
    this.bdyNodes[0] = bdyNodes0;
    this.bdyNodes[1] = bdyNodes1;
  };


  /**
   * @return {Coordinate} the proper intersection point, or <code>null</code>
   *         if none was found.
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.getProperIntersectionPoint = function() {
    return this.properIntersectionPoint;
  };


  /**
   * @return {boolean}
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.hasIntersection = function() {
    return this._hasIntersection;
  };


  /**
   * A proper intersection is an intersection which is interior to at least two
   * line segments. Note that a proper intersection is not necessarily in the
   * interior of the entire Geometry, since another edge may have an endpoint
   * equal to the intersection, which according to SFS semantics can result in
   * the point being on the Boundary of the Geometry.
   *
   * @return {boolean}
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.hasProperIntersection = function() {
    return this.hasProper;
  };


  /**
   * A proper interior intersection is a proper intersection which is <b>not</b>
   * contained in the set of boundary nodes set for this jsts.geomgraph.index.SegmentIntersector.
   *
   * @return {boolean}
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.hasProperInteriorIntersection = function() {
    return this.hasProperInterior;
  };


  /**
   * A trivial intersection is an apparent self-intersection which in fact is
   * simply the point shared by adjacent line segments. Note that closed edges
   * require a special check for the point shared by the beginning and end
   * segments.
   *
   * @param {Edge}
   *          e0
   * @param {int}
   *          segIndex0
   * @param {Edge}
   *          e1
   * @param {int}
   *          segIndex1
   * @return {boolean}
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.isTrivialIntersection = function(e0, segIndex0,
      e1, segIndex1) {
    if (e0 === e1) {
      if (this.li.getIntersectionNum() === 1) {
        if (jsts.geomgraph.index.SegmentIntersector.isAdjacentSegments(segIndex0, segIndex1))
          return true;
        if (e0.isClosed()) {
          var maxSegIndex = e0.getNumPoints() - 1;
          if ((segIndex0 === 0 && segIndex1 === maxSegIndex) ||
              (segIndex1 === 0 && segIndex0 === maxSegIndex)) {
            return true;
          }
        }
      }
    }
    return false;
  };


  /**
   * This method is called by clients of the EdgeIntersector class to test for
   * and add intersections for two segments of the edges being intersected. Note
   * that clients (such as MonotoneChainEdges) may choose not to intersect
   * certain pairs of segments for efficiency reasons.
   *
   * @param {Edge}
   *          e0
   * @param {int}
   *          segIndex0
   * @param {Edge}
   *          e1
   * @param {int}
   *          segIndex1
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.addIntersections = function(e0, segIndex0, e1,
      segIndex1) {
    if (e0 === e1 && segIndex0 === segIndex1)
      return;
    this.numTests++;
    var p00 = e0.getCoordinates()[segIndex0];
    var p01 = e0.getCoordinates()[segIndex0 + 1];
    var p10 = e1.getCoordinates()[segIndex1];
    var p11 = e1.getCoordinates()[segIndex1 + 1];

    this.li.computeIntersection(p00, p01, p10, p11);
    /**
     * Always record any non-proper intersections. If includeProper is true,
     * record any proper intersections as well.
     */
    if (this.li.hasIntersection()) {
      if (this.recordIsolated) {
        e0.setIsolated(false);
        e1.setIsolated(false);
      }
      this.numIntersections++;
      // if the segments are adjacent they have at least one trivial
      // intersection,
      // the shared endpoint. Don't bother adding it if it is the
      // only intersection.
      if (!this.isTrivialIntersection(e0, segIndex0, e1, segIndex1)) {
        this._hasIntersection = true;
        if (this.includeProper || !this.li.isProper()) {
          e0.addIntersections(this.li, segIndex0, 0);
          e1.addIntersections(this.li, segIndex1, 1);
        }
        if (this.li.isProper()) {
          this.properIntersectionPoint = this.li.getIntersection(0).clone();
          this.hasProper = true;
          if (!this.isBoundaryPoint(this.li, this.bdyNodes))
            this.hasProperInterior = true;
        }
      }
    }
  };


  /**
   * @param {LineIntersector}
   *          li
   * @param {Array.<javascript.util.Collection>|javascript.util.Collection}
   *          bdyNodes
   * @return {boolean}
   * @private
   */
  jsts.geomgraph.index.SegmentIntersector.prototype.isBoundaryPoint = function(li, bdyNodes) {
    if (bdyNodes === null)
      return false;

    if (bdyNodes instanceof Array) {
      if (this.isBoundaryPoint(li, bdyNodes[0]))
        return true;
      if (this.isBoundaryPoint(li, bdyNodes[1]))
        return true;
      return false;
    } else {
      for (var i = bdyNodes.iterator(); i.hasNext();) {
        var node = i.next();
        var pt = node.getCoordinate();
        if (li.isIntersection(pt))
          return true;
      }
      return false;
    }
  };

})();

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * @constructor
 */
jsts.geomgraph.index.EdgeSetIntersector = function() {

};


/**
 * Computes all self-intersections between edges in a set of edges, allowing
 * client to choose whether self-intersections are computed.
 *
 * @param {javascript.util.List}
 *          edges a list of edges to test for intersections.
 * @param {SegmentIntersector}
 *          si the SegmentIntersector to use.
 * @param {boolean}
 *          testAllSegments true if self-intersections are to be tested as well.
 */
jsts.geomgraph.index.EdgeSetIntersector.prototype.computeIntersections = function(
    edges, si, testAllSegments) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Computes all mutual intersections between two sets of edges.
 *
 * @param {javascript.util.List}
 *          edges0 a list of edges to test for intersections.
 * @param {javascript.util.List}
 *          edges1 a list of edges to test for intersections.
 * @param {SegmentIntersector}
 *          si the SegmentIntersector to use.
 */
jsts.geomgraph.index.EdgeSetIntersector.prototype.computeIntersections2 = function(
    edges0, edges1, si) {
  throw new jsts.error.AbstractMethodInvocationError();
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @param {double}
 *          x
 * @param {Object}
 *          obj
 * @param {Object}
 *          label
 * @constructor
 */
jsts.geomgraph.index.SweepLineEvent = function(
    x, obj, label) {
  // label can be null, so check object to handle overloading
  if (!(obj instanceof jsts.geomgraph.index.SweepLineEvent)) {
    this.eventType = jsts.geomgraph.index.SweepLineEvent.INSERT;
    this.label = label;
    this.xValue = x;
    this.obj = obj;
    return;
  }

  this.eventType = jsts.geomgraph.index.SweepLineEvent.DELETE;
  this.xValue = x;
  this.insertEvent = obj;
};

/**
 * @type {int}
 */
jsts.geomgraph.index.SweepLineEvent.INSERT = 1;

/**
 * @type {int}
 */
jsts.geomgraph.index.SweepLineEvent.DELETE = 2;

/**
 * used for red-blue intersection detection
 *
 * @type {Object}
 */
jsts.geomgraph.index.SweepLineEvent.prototype.label = null;

/**
 * @type {double}
 */
jsts.geomgraph.index.SweepLineEvent.prototype.xValue = null;

/**
 * @type {int}
 */
jsts.geomgraph.index.SweepLineEvent.prototype.eventType = null;

/**
 * null if this is an INSERT event
 *
 * @type {SweepLineEvent}
 */
jsts.geomgraph.index.SweepLineEvent.prototype.insertEvent = null;

/**
 * @type {int}
 */
jsts.geomgraph.index.SweepLineEvent.prototype.deleteEventIndex = null;

/**
 * @type {Object}
 */
jsts.geomgraph.index.SweepLineEvent.prototype.obj = null;

/**
 * @return {boolean}
 */
jsts.geomgraph.index.SweepLineEvent.prototype.isInsert = function() {
  return this.eventType == jsts.geomgraph.index.SweepLineEvent.INSERT;
};

/**
 * @return {boolean}
 */
jsts.geomgraph.index.SweepLineEvent.prototype.isDelete = function() {
  return this.eventType == jsts.geomgraph.index.SweepLineEvent.DELETE;
};

/**
 * @return {SweepLineEvent}
 */
jsts.geomgraph.index.SweepLineEvent.prototype.getInsertEvent = function() {
  return this.insertEvent;
};

/**
 * @return {int}
 */
jsts.geomgraph.index.SweepLineEvent.prototype.getDeleteEventIndex = function() {
  return this.deleteEventIndex;
};

/**
 * @param {int}
 *          deleteEventIndex
 */
jsts.geomgraph.index.SweepLineEvent.prototype.setDeleteEventIndex = function(
    deleteEventIndex) {
  this.deleteEventIndex = deleteEventIndex;
};

/**
 * @return {Object}
 */
jsts.geomgraph.index.SweepLineEvent.prototype.getObject = function() {
  return this.obj;
};

/**
 * @param {SweepLineEvent}
 *          ev
 * @return {boolean}
 */
jsts.geomgraph.index.SweepLineEvent.prototype.isSameLabel = function(
    ev) {
  // no label set indicates single group
  if (this.label == null) {
    return false;
  }
  return this.label == ev.label;
};

/**
 * Events are ordered first by their x-value, and then by their eventType.
 * Insert events are sorted before Delete events, so that
 * items whose Insert and Delete events occur at the same x-value will be
 * correctly handled.
 *
 * @param {Object}
 *          o
 * @return {SweepLineEvent}
 */
jsts.geomgraph.index.SweepLineEvent.prototype.compareTo = function(
    pe) {
  if (this.xValue < pe.xValue) {
    return -1;
  }
  if (this.xValue > pe.xValue) {
    return 1;
  }
  if (this.eventType < pe.eventType) {
    return -1;
  }
  if (this.eventType > pe.eventType) {
    return 1;
  }
  return 0;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @param {MonotoneChainEdge}
 *          mce
 * @param {int}
 *          chainIndex
 */
jsts.geomgraph.index.MonotoneChain = function(mce, chainIndex) {
  this.mce = mce;
  this.chainIndex = chainIndex;
};

/**
 * @type {MonotoneChainEdge}
 */
jsts.geomgraph.index.MonotoneChain.prototype.mce = null;

/**
 * @type {int}
 */
jsts.geomgraph.index.MonotoneChain.prototype.chainIndex = null;

jsts.geomgraph.index.MonotoneChain.prototype.computeIntersections = function(
    mc, si) {
  this.mce.computeIntersectsForChain(this.chainIndex, mc.mce, mc.chainIndex, si);
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/index/EdgeSetIntersector.js
 */



/**
 * Finds all intersections in one or two sets of edges,
 * using an x-axis sweepline algorithm in conjunction with Monotone Chains.
 * While still O(n^2) in the worst case, this algorithm
 * drastically improves the average-case time.
 * The use of MonotoneChains as the items in the index
 * seems to offer an improvement in performance over a sweep-line alone.
 *
 * A SimpleMCSweepLineIntersector creates monotone chains from the edges
 * and compares them using a simple sweep-line along the x-axis.
 * @constructor
 */
jsts.geomgraph.index.SimpleMCSweepLineIntersector = function() {
  this.events = [];
};


jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype = new jsts.geomgraph.index.EdgeSetIntersector();


/**
 * @type {array}
 */
jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.events = null;

/**
 * statistics information
 *
 * @type {int}
 */
jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.nOverlaps = 0;

/**
 * @param {javascript.util.List}
 *          edges
 * @param {SegmentIntersector}
 *          si
 * @param {boolean}
 *          testAllSegments
 */
jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.computeIntersections = function(
    edges, si, testAllSegments) {

  if (si instanceof javascript.util.List) {
  	this.computeIntersections2.apply(this, arguments);
  	return;
  }

  if (testAllSegments) {
  	this.addList2(edges, null);
  } else {
  	this.addList(edges);
  }
  this.computeIntersections3(si);
};

/**
 * @param {javascript.util.List}
 *          edges0
 * @param {javascript.util.List}
 *          edges1
 * @param {SegmentIntersector}
 *          si
 */
jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.computeIntersections2 = function(
    edges0, edges1, si) {
  this.addList2(edges0, edges0);
  this.addList2(edges1, edges1);
  this.computeIntersections3(si);
};

/**
 * @param {Edge}
 *          edge
 * @param {Object}
 *          edgeSet
 */
jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.add = function(
    edge, edgeSet) {

  if (edge instanceof javascript.util.List) {
  	this.addList.apply(this, arguments);
  	return;
  }

  var mce = edge.getMonotoneChainEdge();
  var startIndex = mce.getStartIndexes();
  for (var i = 0; i < startIndex.length - 1; i++) {
    var mc = new jsts.geomgraph.index.MonotoneChain(mce, i);
    var insertEvent = new jsts.geomgraph.index.SweepLineEvent(mce.getMinX(i), mc, edgeSet);
    this.events.push(insertEvent);
    this.events.push(new jsts.geomgraph.index.SweepLineEvent(mce.getMaxX(i), insertEvent));
  }
};

/**
 * @param {javascript.util.List}
 *          edges
 * @param {Object}
 *          edgeSet
 */
jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.addList = function(
    edges) {
  for (var i = edges.iterator(); i.hasNext(); ) {
    var edge = i.next();
    this.add(edge, edge);
  }
};
/**
 * @param {javascript.util.List}
 *          edges
 * @param {Object}
 *          edgeSet
 */
jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.addList2 = function(
    edges, edgeSet) {
  for (var i = edges.iterator(); i.hasNext(); ) {
    var edge = i.next();
    this.add(edge, edgeSet);
  }
};

/**
 * Because Delete Events have a link to their corresponding Insert event,
 * it is possible to compute exactly the range of events which must be
 * compared to a given Insert event object.
 */
jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.prepareEvents = function() {
  this.events.sort(function(a,b) {
    return a.compareTo(b);
  });

  // set DELETE event indexes
  for (var i = 0; i < this.events.length; i++) {
    var ev = this.events[i];
    if (ev.isDelete()) {
      ev.getInsertEvent().setDeleteEventIndex(i);
    }
  }
};

/**
 * @param {SegmentIntersector}
 *          si
 */
jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.computeIntersections3 = function(
    si) {
  this.nOverlaps = 0;
  this.prepareEvents();

  for (var i = 0; i < this.events.length; i++) {
  	var ev = this.events[i];
  	if (ev.isInsert()) {
  	  this.processOverlaps(i, ev.getDeleteEventIndex(), ev, si);
  	}
  }
};

/**
 * @param {int}
 *          start
 * @param {int}
 *          end
 * @param {SweepLineEvent}
 *          ev0
 * @param {SegmentIntersector}
 *          si
 */
jsts.geomgraph.index.SimpleMCSweepLineIntersector.prototype.processOverlaps = function(
    start, end, ev0, si) {
  var mc0 = ev0.getObject();

  /**
   * Since we might need to test for self-intersections,
   * include current INSERT event object in list of event objects to test.
   * Last index can be skipped, because it must be a Delete event.
   */
  for (var i = start; i < end; i++) {
    var ev1 = this.events[i];
    if (ev1.isInsert()) {
      var mc1 = ev1.getObject();
      // don't compare edges in same group, if labels are present
      if (!ev0.isSameLabel(ev1)) {
        mc0.computeIntersections(mc1, si);
        this.nOverlaps++;
      }
    }
  }
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/Location.js
   * @requires jsts/geomgraph/Position.js
   * @requires jsts/geomgraph/PlanarGraph.js
   * @requires jsts/util/Assert.js
   */

  var Location = jsts.geom.Location;
  var Position = jsts.geomgraph.Position;
  var Assert = jsts.util.Assert;



  /**
   * A GeometryGraph is a graph that models a given Geometry
   *
   * @param {int}
   *          argIndex
   * @param {Geometry}
   *          parentGeom
   * @param {BoundaryNodeRule}
   *          boundaryNodeRule
   * @augments jsts.planargraph.PlanarGraph
   */
  jsts.geomgraph.GeometryGraph = function(argIndex, parentGeom,
      boundaryNodeRule) {
    jsts.geomgraph.PlanarGraph.call(this);

    this.lineEdgeMap = new javascript.util.HashMap();

    this.ptLocator = new jsts.algorithm.PointLocator();

    this.argIndex = argIndex;
    this.parentGeom = parentGeom;
    this.boundaryNodeRule = boundaryNodeRule ||
        jsts.algorithm.BoundaryNodeRule.OGC_SFS_BOUNDARY_RULE;
    if (parentGeom !== null) {
      this.add(parentGeom);
    }
  };

  jsts.geomgraph.GeometryGraph.prototype = new jsts.geomgraph.PlanarGraph();
  jsts.geomgraph.GeometryGraph.constructor = jsts.geomgraph.GeometryGraph;

  /**
   * @return {EdgeSetIntersector}
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.createEdgeSetIntersector = function() {
    //return new jsts.geomgraph.index.SimpleEdgeSetIntersector();
    // TODO: use optimized version when ported
    return new jsts.geomgraph.index.SimpleMCSweepLineIntersector();
    //return new jsts.geomgraph.index.SimpleSweepLineIntersector();
  };

  /**
   * @param {BoundaryNodeRule}
   *          boundaryNodeRule
   * @param {int}
   *          boundaryCount
   * @return {int}
   */
  jsts.geomgraph.GeometryGraph.determineBoundary = function(boundaryNodeRule,
      boundaryCount) {
    return boundaryNodeRule.isInBoundary(boundaryCount) ? Location.BOUNDARY
        : Location.INTERIOR;
  };


  /**
   * @type {Geometry}
   */
  jsts.geomgraph.GeometryGraph.prototype.parentGeom = null;


  /**
   * The lineEdgeMap is a map of the linestring components of the parentGeometry
   * to the edges which are derived from them. This is used to efficiently
   * perform findEdge queries
   *
   * @type {Object}
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.lineEdgeMap = null;


  /**
   * @type {BoundaryNodeRule}
   */
  jsts.geomgraph.GeometryGraph.prototype.boundaryNodeRule = null;


  /**
   * If this flag is true, the Boundary Determination Rule will used when
   * deciding whether nodes are in the boundary or not
   */
  /**
   * @type {boolean}
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.useBoundaryDeterminationRule = true;


  /**
   * the index of this geometry as an argument to a spatial function (used for
   * labelling)
   *
   * @type {number}
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.argIndex = null;


  /**
   * @type {javascript.util.Collection}
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.boundaryNodes = null;


  /**
   * @type {Coordinate}
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.hasTooFewPoints = false;


  /**
   * @type {Coordinate}
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.invalidPoint = null;


  /**
   * @type {PointOnGeometryLocator}
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.areaPtLocator = null;


  /**
   * for use if geometry is not Polygonal
   *
   * @type {PointLocator}
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.ptLocator = null;


  jsts.geomgraph.GeometryGraph.prototype.getGeometry = function() {
    return this.parentGeom;
  };

  jsts.geomgraph.GeometryGraph.prototype.getBoundaryNodes = function() {
    if (this.boundaryNodes === null)
      this.boundaryNodes = this.nodes.getBoundaryNodes(this.argIndex);
    return this.boundaryNodes;
  };

  jsts.geomgraph.GeometryGraph.prototype.getBoundaryNodeRule = function() {
    return this.boundaryNodeRule;
  };



  jsts.geomgraph.GeometryGraph.prototype.findEdge = function(line) {
    return this.lineEdgeMap.get(line);
  };

  jsts.geomgraph.GeometryGraph.prototype.computeSplitEdges = function(edgelist) {
    for (var i = this.edges.iterator(); i.hasNext();) {
      var e = i.next();
      e.eiList.addSplitEdges(edgelist);
    }
  }

  /**
   * @param {Geometry}
   *          g
   */
  jsts.geomgraph.GeometryGraph.prototype.add = function(g) {
    if (g.isEmpty()) {
      return;
    }

    // check if this Geometry should obey the Boundary Determination Rule
    // all collections except MultiPolygons obey the rule
    if (g instanceof jsts.geom.MultiPolygon)
      this.useBoundaryDeterminationRule = false;

    if (g instanceof jsts.geom.Polygon)
      this.addPolygon(g);
    // LineString also handles LinearRings
    else if (g instanceof jsts.geom.LineString)
      this.addLineString(g);
    else if (g instanceof jsts.geom.Point)
      this.addPoint(g);
    else if (g instanceof jsts.geom.MultiPoint)
      this.addCollection(g);
    else if (g instanceof jsts.geom.MultiLineString)
      this.addCollection(g);
    else if (g instanceof jsts.geom.MultiPolygon)
      this.addCollection(g);
    else if (g instanceof jsts.geom.GeometryCollection)
      this.addCollection(g);
    else
      throw new jsts.error.IllegalArgumentError('Geometry type not supported.');
  };


  /**
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.addCollection = function(gc) {
    for (var i = 0; i < gc.getNumGeometries(); i++) {
      var g = gc.getGeometryN(i);
      this.add(g);
    }
  };


  /**
   * Add an Edge computed externally. The label on the Edge is assumed to be
   * correct.
   */
  jsts.geomgraph.GeometryGraph.prototype.addEdge = function(e) {
    this.insertEdge(e);
    var coord = e.getCoordinates();
    // insert the endpoint as a node, to mark that it is on the boundary
    this.insertPoint(this.argIndex, coord[0], Location.BOUNDARY);
    this.insertPoint(this.argIndex, coord[coord.length - 1], Location.BOUNDARY);
  };


  /**
   * Add a Point to the graph.
   */
  jsts.geomgraph.GeometryGraph.prototype.addPoint = function(p) {
    var coord = p.getCoordinate();
    this.insertPoint(this.argIndex, coord, Location.INTERIOR);
  };


  /**
   * @param {LineString}
   *          line
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.addLineString = function(line) {
    var coord = jsts.geom.CoordinateArrays.removeRepeatedPoints(line
        .getCoordinates());

    if (coord.length < 2) {
      this.hasTooFewPoints = true;
      this.invalidPoint = coords[0];
      return;
    }

    // add the edge for the LineString
    // line edges do not have locations for their left and right sides
    var e = new jsts.geomgraph.Edge(coord, new jsts.geomgraph.Label(
        this.argIndex, Location.INTERIOR));
    this.lineEdgeMap.put(line, e);
    this.insertEdge(e);
    /**
     * Add the boundary points of the LineString, if any. Even if the LineString
     * is closed, add both points as if they were endpoints. This allows for the
     * case that the node already exists and is a boundary point.
     */
    Assert.isTrue(coord.length >= 2, 'found LineString with single point');
    this.insertBoundaryPoint(this.argIndex, coord[0]);
    this.insertBoundaryPoint(this.argIndex, coord[coord.length - 1]);
  };


  /**
   * Adds a polygon ring to the graph. Empty rings are ignored.
   *
   * The left and right topological location arguments assume that the ring is
   * oriented CW. If the ring is in the opposite orientation, the left and right
   * locations must be interchanged.
   *
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.addPolygonRing = function(lr, cwLeft,
      cwRight) {
    // don't bother adding empty holes
    if (lr.isEmpty())
      return;

    var coord = jsts.geom.CoordinateArrays.removeRepeatedPoints(lr
        .getCoordinates());

    if (coord.length < 4) {
      this.hasTooFewPoints = true;
      this.invalidPoint = coord[0];
      return;
    }

    var left = cwLeft;
    var right = cwRight;
    if (jsts.algorithm.CGAlgorithms.isCCW(coord)) {
      left = cwRight;
      right = cwLeft;
    }
    var e = new jsts.geomgraph.Edge(coord, new jsts.geomgraph.Label(
        this.argIndex, Location.BOUNDARY, left, right));
    this.lineEdgeMap.put(lr, e);

    this.insertEdge(e);
    // insert the endpoint as a node, to mark that it is on the boundary
    this.insertPoint(this.argIndex, coord[0], Location.BOUNDARY);
  };


  /**
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.addPolygon = function(p) {
    this.addPolygonRing(p.getExteriorRing(), Location.EXTERIOR,
        Location.INTERIOR);

    for (var i = 0; i < p.getNumInteriorRing(); i++) {
      var hole = p.getInteriorRingN(i);

      // Holes are topologically labelled opposite to the shell, since
      // the interior of the polygon lies on their opposite side
      // (on the left, if the hole is oriented CW)
      this.addPolygonRing(hole, Location.INTERIOR, Location.EXTERIOR);
    }
  };


  jsts.geomgraph.GeometryGraph.prototype.computeEdgeIntersections = function(g,
      li, includeProper) {
    var si = new jsts.geomgraph.index.SegmentIntersector(li, includeProper,
        true);
    si.setBoundaryNodes(this.getBoundaryNodes(), g.getBoundaryNodes());

    var esi = this.createEdgeSetIntersector();
    esi.computeIntersections(this.edges, g.edges, si);

    return si;
  };


  /**
   * Compute self-nodes, taking advantage of the Geometry type to minimize the
   * number of intersection tests. (E.g. rings are not tested for
   * self-intersection, since they are assumed to be valid).
   *
   * @param {LineIntersector}
   *          li the LineIntersector to use.
   * @param {boolean}
   *          computeRingSelfNodes if <false>, intersection checks are optimized
   *          to not test rings for self-intersection.
   * @return {SegmentIntersector} the SegmentIntersector used, containing
   *         information about the intersections found.
   */
  jsts.geomgraph.GeometryGraph.prototype.computeSelfNodes = function(li,
      computeRingSelfNodes) {
    var si = new jsts.geomgraph.index.SegmentIntersector(li, true, false);
    var esi = this.createEdgeSetIntersector();
    // optimized test for Polygons and Rings
    if (!computeRingSelfNodes &&
        (this.parentGeom instanceof jsts.geom.LinearRing ||
            this.parentGeom instanceof jsts.geom.Polygon || this.parentGeom instanceof jsts.geom.MultiPolygon)) {
      esi.computeIntersections(this.edges, si, false);
    } else {
      esi.computeIntersections(this.edges, si, true);
    }
    this.addSelfIntersectionNodes(this.argIndex);
    return si;
  };


  /**
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.insertPoint = function(argIndex,
      coord, onLocation) {
    var n = this.nodes.addNode(coord);
    var lbl = n.getLabel();
    if (lbl == null) {
      n.label = new jsts.geomgraph.Label(argIndex, onLocation);
    } else
      lbl.setLocation(argIndex, onLocation);
  };


  /**
   * Adds candidate boundary points using the current {@link BoundaryNodeRule}.
   * This is used to add the boundary points of dim-1 geometries
   * (Curves/MultiCurves).
   */
  jsts.geomgraph.GeometryGraph.prototype.insertBoundaryPoint = function(
      argIndex, coord) {
    var n = this.nodes.addNode(coord);
    var lbl = n.getLabel();
    // the new point to insert is on a boundary
    var boundaryCount = 1;
    // determine the current location for the point (if any)
    var loc = Location.NONE;
    if (lbl !== null)
      loc = lbl.getLocation(argIndex, Position.ON);
    if (loc === Location.BOUNDARY)
      boundaryCount++;

    // determine the boundary status of the point according to the Boundary
    // Determination Rule
    var newLoc = jsts.geomgraph.GeometryGraph.determineBoundary(
        this.boundaryNodeRule, boundaryCount);
    lbl.setLocation(argIndex, newLoc);
  };


  /**
   * add edge intersections as self intersections from each edge intersection
   * list
   *
   * @param argIndex
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.addSelfIntersectionNodes = function(
      argIndex) {
    for (var i = this.edges.iterator(); i.hasNext();) {
      var e = i.next();
      var eLoc = e.getLabel().getLocation(argIndex);
      for (var eiIt = e.eiList.iterator(); eiIt.hasNext();) {
        var ei = eiIt.next();
        this.addSelfIntersectionNode(argIndex, ei.coord, eLoc);
      }
    }
  };


  /**
   * Add a node for a self-intersection. If the node is a potential boundary
   * node (e.g. came from an edge which is a boundary) then insert it as a
   * potential boundary node. Otherwise, just add it as a regular node.
   *
   * @private
   */
  jsts.geomgraph.GeometryGraph.prototype.addSelfIntersectionNode = function(
      argIndex, coord, loc) {
    // if this node is already a boundary node, don't change it
    if (this.isBoundaryNode(argIndex, coord))
      return;
    if (loc === Location.BOUNDARY && this.useBoundaryDeterminationRule)
      this.insertBoundaryPoint(argIndex, coord);
    else
      this.insertPoint(argIndex, coord, loc);
  };

  jsts.geomgraph.GeometryGraph.prototype.getInvalidPoint = function() {
    return this.invalidPoint;
  };

})();

// TODO: port rest of class

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/GeometryCollection.js
   */

  /**
   * @constructor
   * @extends jsts.geom.GeometryCollection
   */
  jsts.geom.MultiLineString = function(geometries, factory) {
    this.geometries = geometries || [];
    this.factory = factory;
  };

  jsts.geom.MultiLineString.prototype = new jsts.geom.GeometryCollection();
  jsts.geom.MultiLineString.constructor = jsts.geom.MultiLineString;

  jsts.geom.MultiLineString.prototype.getBoundary = function() {
    return (new jsts.operation.BoundaryOp(this)).getBoundary();
  };


  /**
   * @param {Geometry}
   *          other
   * @param {double}
   *          tolerance
   * @return {boolean}
   */
  jsts.geom.MultiLineString.prototype.equalsExact = function(other, tolerance) {
    if (!this.isEquivalentClass(other)) {
      return false;
    }
    return jsts.geom.GeometryCollection.prototype.equalsExact.call(this, other,
        tolerance);
  };

  jsts.geom.MultiLineString.prototype.CLASS_NAME = 'jsts.geom.MultiLineString';

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Computes the location of points relative to a {@link Polygonal}
 * {@link Geometry}, using a simple O(n) algorithm. This algorithm is suitable
 * for use in cases where only one or a few points will be tested against a
 * given area.
 * <p>
 * The algorithm used is only guaranteed to return correct results for points
 * which are <b>not</b> on the boundary of the Geometry.
 *
 * @constructor
 * @augments {PointOnGeometryLocator}
 */
jsts.algorithm.locate.SimplePointInAreaLocator = function(geom) {
  this.geom = geom;
};


/**
 * Determines the {@link Location} of a point in an areal {@link Geometry}.
 * Currently this will never return a value of BOUNDARY.
 *
 * @param p
 *          the point to test.
 * @param geom
 *          the areal geometry to test.
 * @return the Location of the point in the geometry.
 */
jsts.algorithm.locate.SimplePointInAreaLocator.locate = function(p, geom) {
  if (geom.isEmpty())
    return jsts.geom.Location.EXTERIOR;

  if (jsts.algorithm.locate.SimplePointInAreaLocator.containsPoint(p, geom))
    return jsts.geom.Location.INTERIOR;
  return jsts.geom.Location.EXTERIOR;
};

jsts.algorithm.locate.SimplePointInAreaLocator.containsPoint = function(p, geom) {
  if (geom instanceof jsts.geom.Polygon) {
    return jsts.algorithm.locate.SimplePointInAreaLocator
        .containsPointInPolygon(p, geom);
  } else if (geom instanceof jsts.geom.GeometryCollection ||
      geom instanceof jsts.geom.MultiPoint ||
      geom instanceof jsts.geom.MultiLineString ||
      geom instanceof jsts.geom.MultiPolygon) {
    for (var i = 0; i < geom.geometries.length; i++) {
      var g2 = geom.geometries[i];
      if (g2 !== geom)
        if (jsts.algorithm.locate.SimplePointInAreaLocator.containsPoint(p, g2))
          return true;
    }
  }
  return false;
};

jsts.algorithm.locate.SimplePointInAreaLocator.containsPointInPolygon = function(
    p, poly) {
  if (poly.isEmpty())
    return false;
  var shell = poly.getExteriorRing();
  if (!jsts.algorithm.locate.SimplePointInAreaLocator.isPointInRing(p, shell))
    return false;
  // now test if the point lies in or on the holes
  for (var i = 0; i < poly.getNumInteriorRing(); i++) {
    var hole = poly.getInteriorRingN(i);
    if (jsts.algorithm.locate.SimplePointInAreaLocator.isPointInRing(p, hole))
      return false;
  }
  return true;
};


/**
 * Determines whether a point lies in a LinearRing, using the ring envelope to
 * short-circuit if possible.
 *
 * @param p
 *          the point to test.
 * @param ring
 *          a linear ring.
 * @return true if the point lies inside the ring.
 */
jsts.algorithm.locate.SimplePointInAreaLocator.isPointInRing = function(p, ring) {
  // short-circuit if point is not in ring envelope
  if (!ring.getEnvelopeInternal().intersects(p))
    return false;
  return jsts.algorithm.CGAlgorithms.isPointInRing(p, ring.getCoordinates());
};

jsts.algorithm.locate.SimplePointInAreaLocator.prototype.geom = null;


jsts.algorithm.locate.SimplePointInAreaLocator.prototype.locate = function(p) {
  return jsts.algorithm.locate.SimplePointInAreaLocator.locate(p, geom);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/Location.js
 */



/**
 * A EdgeEndStar is an ordered list of EdgeEnds around a node. They are
 * maintained in CCW order (starting with the positive x-axis) around the node
 * for efficient lookup and topology building.
 *
 * @constructor
 */
jsts.geomgraph.EdgeEndStar = function() {
  this.edgeMap = new javascript.util.TreeMap();
  this.edgeList = null;
  this.ptInAreaLocation = [jsts.geom.Location.NONE, jsts.geom.Location.NONE];
};


/**
 * A map which maintains the edges in sorted order around the node
 *
 * NOTE: In In JSTS a JS object replaces TreeMap. Sorting is done when needed.
 *
 * @protected
 */
jsts.geomgraph.EdgeEndStar.prototype.edgeMap = null;


/**
 * A list of all outgoing edges in the result, in CCW order
 *
 * @protected
 */
jsts.geomgraph.EdgeEndStar.prototype.edgeList = null;


/**
 * The location of the point for this star in Geometry i Areas
 *
 * @private
 */
jsts.geomgraph.EdgeEndStar.prototype.ptInAreaLocation = null;


/**
 * Insert a EdgeEnd into this EdgeEndStar
 */
jsts.geomgraph.EdgeEndStar.prototype.insert = function(e) {
  throw new jsts.error.AbstractMethodInvocationError();
};


/**
 * Insert an EdgeEnd into the map, and clear the edgeList cache, since the list
 * of edges has now changed
 *
 * @protected
 */
jsts.geomgraph.EdgeEndStar.prototype.insertEdgeEnd = function(e, obj) {
  this.edgeMap.put(e, obj);
  this.edgeList = null; // edge list has changed - clear the cache
};


/**
 * @return the coordinate for the node this star is based at.
 */
jsts.geomgraph.EdgeEndStar.prototype.getCoordinate = function() {
  var it = this.iterator();
  if (!it.hasNext())
    return null;
  var e = it.next();
  return e.getCoordinate();
};
jsts.geomgraph.EdgeEndStar.prototype.getDegree = function() {
  return this.edgeMap.size();
};


/**
 * Iterator access to the ordered list of edges is optimized by copying the map
 * collection to a list. (This assumes that once an iterator is requested, it is
 * likely that insertion into the map is complete).
 */
jsts.geomgraph.EdgeEndStar.prototype.iterator = function() {
  return this.getEdges().iterator();
};

jsts.geomgraph.EdgeEndStar.prototype.getEdges = function() {
  if (this.edgeList === null) {
    this.edgeList = new javascript.util.ArrayList(this.edgeMap.values());
  }
  return this.edgeList;
};

jsts.geomgraph.EdgeEndStar.prototype.getNextCW = function(ee) {
  this.getEdges();
  var i = this.edgeList.indexOf(ee);
  var iNextCW = i - 1;
  if (i === 0)
    iNextCW = this.edgeList.length - 1;
  return this.edgeList[iNextCW];
};

jsts.geomgraph.EdgeEndStar.prototype.computeLabelling = function(geomGraph) {
  this.computeEdgeEndLabels(geomGraph[0].getBoundaryNodeRule());
  this.propagateSideLabels(0);
  this.propagateSideLabels(1);

  /**
   * If there are edges that still have null labels for a geometry this must be
   * because there are no area edges for that geometry incident on this node. In
   * this case, to label the edge for that geometry we must test whether the
   * edge is in the interior of the geometry. To do this it suffices to
   * determine whether the node for the edge is in the interior of an area. If
   * so, the edge has location INTERIOR for the geometry. In all other cases
   * (e.g. the node is on a line, on a point, or not on the geometry at all) the
   * edge has the location EXTERIOR for the geometry.
   * <p>
   * Note that the edge cannot be on the BOUNDARY of the geometry, since then
   * there would have been a parallel edge from the Geometry at this node also
   * labelled BOUNDARY and this edge would have been labelled in the previous
   * step.
   * <p>
   * This code causes a problem when dimensional collapses are present, since it
   * may try and determine the location of a node where a dimensional collapse
   * has occurred. The point should be considered to be on the EXTERIOR of the
   * polygon, but locate() will return INTERIOR, since it is passed the original
   * Geometry, not the collapsed version.
   *
   * If there are incident edges which are Line edges labelled BOUNDARY, then
   * they must be edges resulting from dimensional collapses. In this case the
   * other edges can be labelled EXTERIOR for this Geometry.
   *
   * MD 8/11/01 - NOT TRUE! The collapsed edges may in fact be in the interior
   * of the Geometry, which means the other edges should be labelled INTERIOR
   * for this Geometry. Not sure how solve this... Possibly labelling needs to
   * be split into several phases: area label propagation, symLabel merging,
   * then finally null label resolution.
   */
  var hasDimensionalCollapseEdge = [false, false];
  for (var it = this.iterator(); it.hasNext();) {
    var e = it.next();
    var label = e.getLabel();
    for (var geomi = 0; geomi < 2; geomi++) {
      if (label.isLine(geomi) &&
          label.getLocation(geomi) === jsts.geom.Location.BOUNDARY)
        hasDimensionalCollapseEdge[geomi] = true;
    }
  }
  for (var it = this.iterator(); it.hasNext();) {
    var e = it.next();
    var label = e.getLabel();
    for (var geomi = 0; geomi < 2; geomi++) {
      if (label.isAnyNull(geomi)) {
        var loc = jsts.geom.Location.NONE;
        if (hasDimensionalCollapseEdge[geomi]) {
          loc = jsts.geom.Location.EXTERIOR;
        } else {
          var p = e.getCoordinate();
          loc = this.getLocation(geomi, p, geomGraph);
        }
        label.setAllLocationsIfNull(geomi, loc);
      }
    }
  }
};


/**
 * @private
 */
jsts.geomgraph.EdgeEndStar.prototype.computeEdgeEndLabels = function(
    boundaryNodeRule) {
  // Compute edge label for each EdgeEnd
  for (var it = this.iterator(); it.hasNext();) {
    var ee = it.next();
    ee.computeLabel(boundaryNodeRule);
  }
};


/**
 * @private
 */
jsts.geomgraph.EdgeEndStar.prototype.getLocation = function(geomIndex, p, geom) {
  // compute location only on demand
  if (this.ptInAreaLocation[geomIndex] === jsts.geom.Location.NONE) {
    this.ptInAreaLocation[geomIndex] = jsts.algorithm.locate.SimplePointInAreaLocator
        .locate(p, geom[geomIndex].getGeometry());
  }
  return this.ptInAreaLocation[geomIndex];
};

jsts.geomgraph.EdgeEndStar.prototype.isAreaLabelsConsistent = function(
    geomGraph) {
  this.computeEdgeEndLabels(geomGraph.getBoundaryNodeRule());
  return this.checkAreaLabelsConsistent(0);
};


/**
 * @private
 */
jsts.geomgraph.EdgeEndStar.prototype.checkAreaLabelsConsistent = function(
    geomIndex) {
  // Since edges are stored in CCW order around the node,
  // As we move around the ring we move from the right to the left side of the
  // edge
  var edges = this.getEdges();
  // if no edges, trivially consistent
  if (edges.size() <= 0)
    return true;
  // initialize startLoc to location of last L side (if any)
  var lastEdgeIndex = edges.size() - 1;
  var startLabel = edges.get(lastEdgeIndex).getLabel();
  var startLoc = startLabel
      .getLocation(geomIndex, jsts.geomgraph.Position.LEFT);
  jsts.util.Assert.isTrue(startLoc != jsts.geom.Location.NONE,
      'Found unlabelled area edge');

  var currLoc = startLoc;
  for (var it = this.iterator(); it.hasNext();) {
    var e = it.next();
    var label = e.getLabel();
    // we assume that we are only checking a area
    jsts.util.Assert.isTrue(label.isArea(geomIndex), 'Found non-area edge');
    var leftLoc = label.getLocation(geomIndex, jsts.geomgraph.Position.LEFT);
    var rightLoc = label.getLocation(geomIndex, jsts.geomgraph.Position.RIGHT);
    // check that edge is really a boundary between inside and outside!
    if (leftLoc === rightLoc) {
      return false;
    }

    if (rightLoc !== currLoc) {
      return false;
    }
    currLoc = leftLoc;
  }
  return true;
};


/**
 * @private
 */
jsts.geomgraph.EdgeEndStar.prototype.propagateSideLabels = function(geomIndex) {
  // Since edges are stored in CCW order around the node,
  // As we move around the ring we move from the right to the left side of the
  // edge
  var startLoc = jsts.geom.Location.NONE;

  // initialize loc to location of last L side (if any)
  for (var it = this.iterator(); it.hasNext();) {
    var e = it.next();
    var label = e.getLabel();
    if (label.isArea(geomIndex) &&
        label.getLocation(geomIndex, jsts.geomgraph.Position.LEFT) !== jsts.geom.Location.NONE)
      startLoc = label.getLocation(geomIndex, jsts.geomgraph.Position.LEFT);
  }

  // no labelled sides found, so no labels to propagate
  if (startLoc === jsts.geom.Location.NONE)
    return;

  var currLoc = startLoc;
  for (var it = this.iterator(); it.hasNext();) {
    var e = it.next();
    var label = e.getLabel();
    // set null ON values to be in current location
    if (label.getLocation(geomIndex, jsts.geomgraph.Position.ON) === jsts.geom.Location.NONE)
      label.setLocation(geomIndex, jsts.geomgraph.Position.ON, currLoc);
    // set side labels (if any)
    if (label.isArea(geomIndex)) {
      var leftLoc = label.getLocation(geomIndex, jsts.geomgraph.Position.LEFT);
      var rightLoc = label
          .getLocation(geomIndex, jsts.geomgraph.Position.RIGHT);
      // if there is a right location, that is the next location to propagate
      if (rightLoc !== jsts.geom.Location.NONE) {
        if (rightLoc !== currLoc)
          throw new jsts.error.TopologyError('side location conflict', e
              .getCoordinate());
        if (leftLoc === jsts.geom.Location.NONE) {
          jsts.util.Assert.shouldNeverReachHere('found single null side (at ' +
              e.getCoordinate() + ')');
        }
        currLoc = leftLoc;
      } else {
        /**
         * RHS is null - LHS must be null too. This must be an edge from the
         * other geometry, which has no location labelling for this geometry.
         * This edge must lie wholly inside or outside the other geometry (which
         * is determined by the current location). Assign both sides to be the
         * current location.
         */
        jsts.util.Assert.isTrue(label.getLocation(geomIndex,
            jsts.geomgraph.Position.LEFT) === jsts.geom.Location.NONE,
            'found single null side');
        label.setLocation(geomIndex, jsts.geomgraph.Position.RIGHT, currLoc);
        label.setLocation(geomIndex, jsts.geomgraph.Position.LEFT, currLoc);
      }
    }
  }
};

jsts.geomgraph.EdgeEndStar.prototype.findIndex = function(eSearch) {
  this.iterator(); // force edgelist to be computed
  for (var i = 0; i < this.edgeList.size(); i++) {
    var e = this.edgeList.get(i);
    if (e === eSearch)
      return i;
  }
  return -1;
};




/* Copyright (c) 2011 by The Authors.

/**
 * @requires jsts/geomgraph/EdgeEnd.js
 */



/**
 * A collection of {@link EdgeEnd}s which obey the following invariant:
 * They originate at the same node and have the same direction.
 *
 * @augments {jsts.geomgraph.EdgeEnd}
 * @constructor
 */
jsts.operation.relate.EdgeEndBundle = function() {
  this.edgeEnds = [];

  var e = arguments[0] instanceof jsts.geomgraph.EdgeEnd ? arguments[0] : arguments[1];

  var edge = e.getEdge();
  var coord = e.getCoordinate();
  var dirCoord = e.getDirectedCoordinate();
  var label = new jsts.geomgraph.Label(e.getLabel());

  jsts.geomgraph.EdgeEnd.call(this, edge, coord,
      dirCoord, label);

  this.insert(e);
};

jsts.operation.relate.EdgeEndBundle.prototype = new jsts.geomgraph.EdgeEnd();


/**
 * @private
 */
jsts.operation.relate.EdgeEndBundle.prototype.edgeEnds = null;



jsts.operation.relate.EdgeEndBundle.prototype.getLabel = function() {
  return this.label;
};
jsts.operation.relate.EdgeEndBundle.prototype.getEdgeEnds = function() {
  return this.edgeEnds;
};

jsts.operation.relate.EdgeEndBundle.prototype.insert = function(e) {
  // Assert: start point is the same
  // Assert: direction is the same
  this.edgeEnds.push(e);
};


/**
 * This computes the overall edge label for the set of edges in this
 * EdgeStubBundle. It essentially merges the ON and side labels for each edge.
 * These labels must be compatible
 */
jsts.operation.relate.EdgeEndBundle.prototype.computeLabel = function(
    boundaryNodeRule) {
  // create the label. If any of the edges belong to areas,
  // the label must be an area label
  var isArea = false;
  for (var i = 0; i < this.edgeEnds.length; i++) {
    var e = this.edgeEnds[i];
    if (e.getLabel().isArea())
      isArea = true;
  }
  if (isArea)
    this.label = new jsts.geomgraph.Label(jsts.geom.Location.NONE, jsts.geom.Location.NONE,
        jsts.geom.Location.NONE);
  else
    this.label = new jsts.geomgraph.Label(jsts.geom.Location.NONE);

  // compute the On label, and the side labels if present
  for (var i = 0; i < 2; i++) {
    this.computeLabelOn(i, boundaryNodeRule);
    if (isArea)
      this.computeLabelSides(i);
  }
};


/**
 * Compute the overall ON location for the list of EdgeStubs. (This is
 * essentially equivalent to computing the self-overlay of a single Geometry)
 * edgeStubs can be either on the boundary (eg Polygon edge) OR in the interior
 * (e.g. segment of a LineString) of their parent Geometry. In addition,
 * GeometryCollections use a {@link BoundaryNodeRule} to determine whether a
 * segment is on the boundary or not. Finally, in GeometryCollections it can
 * occur that an edge is both on the boundary and in the interior (e.g. a
 * LineString segment lying on top of a Polygon edge.) In this case the Boundary
 * is given precendence. <br>
 * These observations result in the following rules for computing the ON
 * location:
 * <ul>
 * <li> if there are an odd number of Bdy edges, the attribute is Bdy
 * <li> if there are an even number >= 2 of Bdy edges, the attribute is Int
 * <li> if there are any Int edges, the attribute is Int
 * <li> otherwise, the attribute is NULL.
 * </ul>
 *
 * @private
 */
jsts.operation.relate.EdgeEndBundle.prototype.computeLabelOn = function(
    geomIndex, boundaryNodeRule) {
  // compute the ON location value
  var boundaryCount = 0;
  var foundInterior = false;

  for (var i = 0; i < this.edgeEnds.length; i++) {
    var e = this.edgeEnds[i];
    var loc = e.getLabel().getLocation(geomIndex);
    if (loc == jsts.geom.Location.BOUNDARY)
      boundaryCount++;
    if (loc == jsts.geom.Location.INTERIOR)
      foundInterior = true;
  }
  var loc = jsts.geom.Location.NONE;
  if (foundInterior)
    loc = jsts.geom.Location.INTERIOR;
  if (boundaryCount > 0) {
    loc = jsts.geomgraph.GeometryGraph.determineBoundary(boundaryNodeRule,
        boundaryCount);
  }
  this.label.setLocation(geomIndex, loc);

};


/**
 * Compute the labelling for each side
 *
 * @private
 */
jsts.operation.relate.EdgeEndBundle.prototype.computeLabelSides = function(
    geomIndex) {
  this.computeLabelSide(geomIndex, jsts.geomgraph.Position.LEFT);
  this.computeLabelSide(geomIndex, jsts.geomgraph.Position.RIGHT);
};


/**
 * To compute the summary label for a side, the algorithm is: FOR all edges IF
 * any edge's location is INTERIOR for the side, side location = INTERIOR ELSE
 * IF there is at least one EXTERIOR attribute, side location = EXTERIOR ELSE
 * side location = NULL <br>
 * Note that it is possible for two sides to have apparently contradictory
 * information i.e. one edge side may indicate that it is in the interior of a
 * geometry, while another edge side may indicate the exterior of the same
 * geometry. This is not an incompatibility - GeometryCollections may contain
 * two Polygons that touch along an edge. This is the reason for
 * Interior-primacy rule above - it results in the summary label having the
 * Geometry interior on <b>both</b> sides.
 *
 * @private
 */
jsts.operation.relate.EdgeEndBundle.prototype.computeLabelSide = function(
    geomIndex, side) {
  for (var i = 0; i < this.edgeEnds.length; i++) {
    var e = this.edgeEnds[i];
    if (e.getLabel().isArea()) {
      var loc = e.getLabel().getLocation(geomIndex, side);
      if (loc === jsts.geom.Location.INTERIOR) {
        this.label.setLocation(geomIndex, side, jsts.geom.Location.INTERIOR);
        return;
      } else if (loc === jsts.geom.Location.EXTERIOR)
        this.label.setLocation(geomIndex, side, jsts.geom.Location.EXTERIOR);
    }
  }
};


/**
 * Update the IM with the contribution for the computed label for the EdgeStubs.
 *
 * @private
 */
jsts.operation.relate.EdgeEndBundle.prototype.updateIM = function(im) {
  jsts.geomgraph.Edge.updateIM(this.label, im);
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/Node.js
 */



/**
 * A RelateNode is a Node that maintains a list of EdgeStubs for the edges that
 * are incident on it.
 *
 * Represents a node in the topological graph used to compute spatial
 * relationships.
 *
 * @augments {Node}
 * @constructor
 */
jsts.operation.relate.RelateNode = function(coord, edges) {
  jsts.geomgraph.Node.apply(this, arguments);
};

jsts.operation.relate.RelateNode.prototype = new jsts.geomgraph.Node();


/**
 * Update the IM with the contribution for this component. A component only
 * contributes if it has a labelling for both parent geometries
 *
 * @protected
 */
jsts.operation.relate.RelateNode.prototype.computeIM = function(im) {
  im.setAtLeastIfValid(this.label.getLocation(0), this.label.getLocation(1), 0);
};


/**
 * Update the IM with the contribution for the EdgeEnds incident on this node.
 */
jsts.operation.relate.RelateNode.prototype.updateIMFromEdges = function(im) {
  this.edges.updateIM(im);
};

/* Copyright (c) 2011 by The Authors.

/**
 * @requires jsts/geomgraph/EdgeEndStar.js
 */



/**
 * An ordered list of {@link EdgeEndBundle}s around a {@link RelateNode}.
 * They are maintained in CCW order (starting with the positive x-axis) around the node
 * for efficient lookup and topology building.
 *
 * @constructor
 */
jsts.operation.relate.EdgeEndBundleStar = function() {
  jsts.geomgraph.EdgeEndStar.apply(this, arguments);
};

jsts.operation.relate.EdgeEndBundleStar.prototype = new jsts.geomgraph.EdgeEndStar();


/**
 * Insert a EdgeEnd in order in the list. If there is an existing EdgeStubBundle
 * which is parallel, the EdgeEnd is added to the bundle. Otherwise, a new
 * EdgeEndBundle is created to contain the EdgeEnd. <br>
 */
jsts.operation.relate.EdgeEndBundleStar.prototype.insert = function(e) {
  var eb = this.edgeMap.get(e);
  if (eb === null) {
    eb = new jsts.operation.relate.EdgeEndBundle(e);
    this.insertEdgeEnd(e, eb);
  }
  else {
    eb.insert(e);
  }
};


/**
 * Update the IM with the contribution for the EdgeStubs around the node.
 */
jsts.operation.relate.EdgeEndBundleStar.prototype.updateIM = function(im) {
  for (var it = this.iterator(); it.hasNext(); ) {
    var esb = it.next();
    esb.updateIM(im);
  }
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Used by the {@link NodeMap} in a {@link RelateNodeGraph} to create
 * {@link RelateNode}s.
 *
 * @augments {jsts.geomgraph.NodeFactory}
 * @constructor
 */
jsts.operation.relate.RelateNodeFactory = function() {

};

jsts.operation.relate.RelateNodeFactory.prototype = new jsts.geomgraph.NodeFactory();

jsts.operation.relate.RelateNodeFactory.prototype.createNode = function(coord) {
  return new jsts.operation.relate.RelateNode(coord,
      new jsts.operation.relate.EdgeEndBundleStar());
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/util/Assert.js
   */

  var ArrayList = javascript.util.ArrayList;


  /**
   * An EdgeEndBuilder creates EdgeEnds for all the "split edges" created by the
   * intersections determined for an Edge.
   *
   * Computes the {@link EdgeEnd}s which arise from a noded {@link Edge}.
   *
   * @constructor
   */
  jsts.operation.relate.EdgeEndBuilder = function() {

  };


  jsts.operation.relate.EdgeEndBuilder.prototype.computeEdgeEnds = function(edges) {
    if (arguments.length == 2) {
      this.computeEdgeEnds2.apply(this, arguments);
      return;
    }

    var l = new ArrayList();
    for (var i = edges; i.hasNext();) {
      var e = i.next();
      this.computeEdgeEnds2(e, l);
    }
    return l;
  };


  /**
   * Creates stub edges for all the intersections in this Edge (if any) and
   * inserts them into the graph.
   */
  jsts.operation.relate.EdgeEndBuilder.prototype.computeEdgeEnds2 = function(edge, l) {
    var eiList = edge.getEdgeIntersectionList();
    // ensure that the list has entries for the first and last point of the edge
    eiList.addEndpoints();

    var it = eiList.iterator();
    var eiPrev = null;
    var eiCurr = null;
    // no intersections, so there is nothing to do
    if (!it.hasNext())
      return;
    var eiNext = it.next();
    do {
      eiPrev = eiCurr;
      eiCurr = eiNext;
      eiNext = null;
      if (it.hasNext())
        eiNext = it.next();

      if (eiCurr !== null) {
        this.createEdgeEndForPrev(edge, l, eiCurr, eiPrev);
        this.createEdgeEndForNext(edge, l, eiCurr, eiNext);
      }

    } while (eiCurr !== null);
  };


  /**
   * Create a EdgeStub for the edge before the intersection eiCurr. The previous
   * intersection is provided in case it is the endpoint for the stub edge.
   * Otherwise, the previous point from the parent edge will be the endpoint.
   * <br>
   * eiCurr will always be an EdgeIntersection, but eiPrev may be null.
   *
   * @private
   */
  jsts.operation.relate.EdgeEndBuilder.prototype.createEdgeEndForPrev = function(edge, l, eiCurr,
      eiPrev) {

    var iPrev = eiCurr.segmentIndex;
    if (eiCurr.dist === 0.0) {
      // if at the start of the edge there is no previous edge
      if (iPrev === 0)
        return;
      iPrev--;
    }
    var pPrev = edge.getCoordinate(iPrev);
    // if prev intersection is past the previous vertex, use it instead
    if (eiPrev !== null && eiPrev.segmentIndex >= iPrev)
      pPrev = eiPrev.coord;

    var label = new jsts.geomgraph.Label(edge.getLabel());
    // since edgeStub is oriented opposite to it's parent edge, have to flip
    // sides
    // for edge label
    label.flip();
    var e = new jsts.geomgraph.EdgeEnd(edge, eiCurr.coord, pPrev, label);
    // e.print(System.out); System.out.println();
    l.add(e);
  };


  /**
   * Create a StubEdge for the edge after the intersection eiCurr. The next
   * intersection is provided in case it is the endpoint for the stub edge.
   * Otherwise, the next point from the parent edge will be the endpoint. <br>
   * eiCurr will always be an EdgeIntersection, but eiNext may be null.
   *
   * @private
   */
  jsts.operation.relate.EdgeEndBuilder.prototype.createEdgeEndForNext = function(edge, l, eiCurr,
      eiNext) {

    var iNext = eiCurr.segmentIndex + 1;
    // if there is no next edge there is nothing to do
    if (iNext >= edge.getNumPoints() && eiNext === null)
      return;

    var pNext = edge.getCoordinate(iNext);

    // if the next intersection is in the same segment as the current, use it as
    // the endpoint
    if (eiNext !== null && eiNext.segmentIndex === eiCurr.segmentIndex)
      pNext = eiNext.coord;

    var e = new jsts.geomgraph.EdgeEnd(edge, eiCurr.coord, pNext,
        new jsts.geomgraph.Label(edge.getLabel()));
    l.add(e);
  };


})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/Location.js
   * @requires jsts/util/Assert.js
   */

  var Location = jsts.geom.Location;

  /**
   * Implements the simple graph of Nodes and EdgeEnd which is all that is
   * required to determine topological relationships between Geometries. Also
   * supports building a topological graph of a single Geometry, to allow
   * verification of valid topology.
   * <p>
   * It is <b>not</b> necessary to create a fully linked PlanarGraph to
   * determine relationships, since it is sufficient to know how the Geometries
   * interact locally around the nodes. In fact, this is not even feasible,
   * since it is not possible to compute exact intersection points, and hence
   * the topology around those nodes cannot be computed robustly. The only Nodes
   * that are created are for improper intersections; that is, nodes which occur
   * at existing vertices of the Geometries. Proper intersections (e.g. ones
   * which occur between the interior of line segments) have their topology
   * determined implicitly, without creating a Node object to represent them.
   *
   * @constructor
   */
  jsts.operation.relate.RelateNodeGraph = function() {
    this.nodes = new jsts.geomgraph.NodeMap(
        new jsts.operation.relate.RelateNodeFactory());
  };


  /**
   * @private
   */
  jsts.operation.relate.RelateNodeGraph.prototype.nodes = null;


  jsts.operation.relate.RelateNodeGraph.prototype.build = function(geomGraph) {
    // compute nodes for intersections between previously noded edges
    this.computeIntersectionNodes(geomGraph, 0);
    /**
     * Copy the labelling for the nodes in the parent Geometry. These override
     * any labels determined by intersections.
     */
    this.copyNodesAndLabels(geomGraph, 0);

    /**
     * Build EdgeEnds for all intersections.
     */
    var eeBuilder = new jsts.operation.relate.EdgeEndBuilder();
    var eeList = eeBuilder.computeEdgeEnds(geomGraph.getEdgeIterator());
    this.insertEdgeEnds(eeList);
  };


  /**
   * Insert nodes for all intersections on the edges of a Geometry. Label the
   * created nodes the same as the edge label if they do not already have a
   * label. This allows nodes created by either self-intersections or mutual
   * intersections to be labelled. Endpoint nodes will already be labelled from
   * when they were inserted.
   * <p>
   * Precondition: edge intersections have been computed.
   */
  jsts.operation.relate.RelateNodeGraph.prototype.computeIntersectionNodes = function(geomGraph,
      argIndex) {
    for (var edgeIt = geomGraph.getEdgeIterator(); edgeIt.hasNext();) {
      var e = edgeIt.next();
      var eLoc = e.getLabel().getLocation(argIndex);
      for (var eiIt = e.getEdgeIntersectionList().iterator(); eiIt.hasNext();) {
        var ei = eiIt.next();
        var n = this.nodes.addNode(ei.coord);
        if (eLoc === Location.BOUNDARY)
          n.setLabelBoundary(argIndex);
        else {
          if (n.getLabel().isNull(argIndex))
            n.setLabel(argIndex, Location.INTERIOR);
        }
      }
    }
  };


  /**
   * Copy all nodes from an arg geometry into this graph. The node label in the
   * arg geometry overrides any previously computed label for that argIndex.
   * (E.g. a node may be an intersection node with a computed label of BOUNDARY,
   * but in the original arg Geometry it is actually in the interior due to the
   * Boundary Determination Rule)
   */
  jsts.operation.relate.RelateNodeGraph.prototype.copyNodesAndLabels = function(geomGraph, argIndex) {
    for (var nodeIt = geomGraph.getNodeIterator(); nodeIt.hasNext();) {
      var graphNode = nodeIt.next();
      var newNode = this.nodes.addNode(graphNode.getCoordinate());
      newNode.setLabel(argIndex, graphNode.getLabel().getLocation(argIndex));
    }
  };

  jsts.operation.relate.RelateNodeGraph.prototype.insertEdgeEnds = function(ee) {
    for (var i = ee.iterator(); i.hasNext();) {
      var e = i.next();
      this.nodes.add(e);
    }
  };

  jsts.operation.relate.RelateNodeGraph.prototype.getNodeIterator = function() {
    return this.nodes.iterator();
  };

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Checks that a {@link GeometryGraph} representing an area
 * (a {@link Polygon} or {@link MultiPolygon} )
 * has consistent semantics for area geometries.
 * This check is required for any reasonable polygonal model
 * (including the OGC-SFS model, as well as models which allow ring self-intersection at single points)
 * <p>
 * Checks include:
 * <ul>
 * <li>test for rings which properly intersect
 * (but not for ring self-intersection, or intersections at vertices)
 * <li>test for consistent labelling at all node points
 * (this detects vertex intersections with invalid topology,
 * i.e. where the exterior side of an edge lies in the interior of the area)
 * <li>test for duplicate rings
 * </ul>
 * If an inconsistency is found the location of the problem
 * is recorded and is available to the caller.
 *
 * @version 1.7
 */


/**
 *
 * Creates a new tester for consistent areas.
 *
 *
 *
 * @param geomGraph
 *          the topology graph of the area geometry.
 *
 */
jsts.operation.valid.ConsistentAreaTester = function(geomGraph) {
  this.geomGraph = geomGraph;
  this.li = new jsts.algorithm.RobustLineIntersector();
  this.nodeGraph = new jsts.operation.relate.RelateNodeGraph();
  this.invalidPoint = null;
};

/**
 *
 * @return the intersection point, or <code>null</code> if none was found.
 *
 */
jsts.operation.valid.ConsistentAreaTester.prototype.getInvalidPoint = function() {
  return this.invalidPoint;
};

/**
 *
 * Check all nodes to see if their labels are consistent with area topology.
 *
 * @return <code>true</code> if this area has a consistent node labelling.
 *
 */
jsts.operation.valid.ConsistentAreaTester.prototype.isNodeConsistentArea = function() {
  /**
   *
   * To fully check validity, it is necessary to compute ALL intersections,
   * including self-intersections within a single edge.
   *
   */
  var intersector = this.geomGraph.computeSelfNodes(this.li, true);
  if (intersector.hasProperIntersection()) {
    this.invalidPoint = intersector.getProperIntersectionPoint();
    return false;
  }

  this.nodeGraph.build(this.geomGraph);
  return this.isNodeEdgeAreaLabelsConsistent();
};

/**
 *
 * Check all nodes to see if their labels are consistent. If any are not, return
 * false
 *
 * @return <code>true</code> if the edge area labels are consistent at this
 *         node.
 *
 */
jsts.operation.valid.ConsistentAreaTester.prototype.isNodeEdgeAreaLabelsConsistent = function() {
  for (var nodeIt = this.nodeGraph.getNodeIterator(); nodeIt.hasNext();) {
    var node = nodeIt.next();
    if (!node.getEdges().isAreaLabelsConsistent(this.geomGraph)) {
      this.invalidPoint = node.getCoordinate().clone();
      return false;
    }
  }
  return true;
};

/**
 *
 * Checks for two duplicate rings in an area. Duplicate rings are rings that are
 * topologically equal (that is, which have the same sequence of points up to
 * point order). If the area is topologically consistent (determined by calling
 * the <code>isNodeConsistentArea</code>, duplicate rings can be found by
 * checking for EdgeBundles which contain more than one EdgeEnd. (This is
 * because topologically consistent areas cannot have two rings sharing the same
 * line segment, unless the rings are equal). The start point of one of the
 * equal rings will be placed in invalidPoint.
 *
 * @return true if this area Geometry is topologically consistent but has two
 *         duplicate rings.
 *
 */
jsts.operation.valid.ConsistentAreaTester.prototype.hasDuplicateRings = function() {
  for (var nodeIt = this.nodeGraph.getNodeIterator(); nodeIt.hasNext();) {
    var node = nodeIt.next();
    for (var i = node.getEdges().iterator(); i.hasNext();) {
      var eeb = i.next();
      if (eeb.getEdgeEnds().length > 1) {
        invalidPoint = eeb.getEdge().getCoordinate(0);
        return true;
      }
    }
  }
  return false;
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geom/Envelope.js
 * @requires jsts/geom/LineSegment.js
 */

/**
 * The action for the internal iterator for performing envelope select queries
 * on a MonotoneChain
 *
 * @constructor
 */
jsts.index.chain.MonotoneChainSelectAction = function() {
  this.tempEnv1 = new jsts.geom.Envelope();
  this.selectedSegment = new jsts.geom.LineSegment();
};



jsts.index.chain.MonotoneChainSelectAction.prototype.tempEnv1 = null;

jsts.index.chain.MonotoneChainSelectAction.prototype.selectedSegment = null;

/**
 * This function can be overridden if the original chain is needed.
 */
jsts.index.chain.MonotoneChainSelectAction.prototype.select = function(mc,
    start) {
  mc.getLineSegment(start, this.selectedSegment);
  this.select2(this.selectedSegment);
};

/**
 * This is a convenience function which can be overridden to obtain the actual
 * line segment which is selected.
 *
 * @param seg
 */
jsts.index.chain.MonotoneChainSelectAction.prototype.select2 = function(seg) {};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Represents an (1-dimensional) closed interval on the Real number line.
 *
 */
(function() {
  /**
   * Constructs a new Interval and initializes it if arguments is provided
   *
   * @constructor
   * @param {None}
   *          If no argument is specified, it will be initialized with 0.0, 0.0.
   * @param {Number},
   *          { Number } min, max It can be initialized with min <-> max.
   * @param {jsts.index.bintree.Interval}
   *          It can also be initialized with another interval.
   */
  var Interval = function() {
    this.min = 0.0;
    this.max = 0.0;

    if (arguments.length === 1) {
      var interval = arguments[0];
      this.init(interval.min, interval.max);
    }else if (arguments.length === 2) {
      this.init(arguments[0], arguments[1]);
    }
  };

  /**
   * Initializes the interval
   *
   * @param {Number}
   *          min
   * @param {Number}
   *          max
   */
  Interval.prototype.init = function(min, max) {
    this.min = min;
    this.max = max;
    if (min > max) {
      this.min = max;
      this.max = min;
    }
  };

  Interval.prototype.getMin = function() {
    return this.min;
  };

  Interval.prototype.getMax = function() {
    return this.max;
  };

  Interval.prototype.getWidth = function() {
    return (this.max - this.min);
  };

  /**
   * Expands this interval to include another interval
   *
   * @param {jsts.index.bintree.Interval}
   *          interval the interval to include.
   */
  Interval.prototype.expandToInclude = function(interval) {
    if (interval.max > this.max) {
      this.max = interval.max;
    }
    if (interval.min < this.min) {
      this.min = interval.min;
    }
  };

  /**
   * Checks if this interval overlaps. Calls correct overlaps- function based on
   * arguments
   *
   * @return {Boolean} true if the interval overlaps.
   */
  Interval.prototype.overlaps = function() {
    if (arguments.length === 1) {
      return this.overlapsInterval.apply(this, arguments);
    }else {
      return this.overlapsMinMax.apply(this, arguments);
    }
  };

  /**
   * Checks if this inteval overlaps another interval
   *
   * @param {jsts.index.bintree.Interval}
   *          interval the interval to check.
   * @return {Boolean} true if the interval overlaps.
   */
  Interval.prototype.overlapsInterval = function(interval) {
    return this.overlaps(interval.min, interval.max);
  };

  /**
   * Checks if this inteval overlaps the specified min/max values
   *
   * @param {Number}
   *          min minimum.
   * @param {Number}
   *          max maximum.
   * @return {Boolean} true if the interval overlaps.
   */
  Interval.prototype.overlapsMinMax = function(min, max) {
    if (this.min > max || this.max < min) {
      return false;
    }
    return true;
  };

  /**
   * Checks if this interval contains an interval, min -max pair or a point
   *
   * @return {Boolean} true if this interval contains the specified argument.
   */
  Interval.prototype.contains = function() {
    var interval;
    if (arguments[0] instanceof jsts.index.bintree.Interval) {
      interval = arguments[0];
      return this.containsMinMax(interval.min, interval.max);
    }else if (arguments.length === 1) {
      return this.containsPoint(arguments[0]);
    }else {
      return this.containsMinMax(arguments[0], arguments[1]);
    }
  };

  /**
   * Checks if this interval contains the min- and max-point provided
   *
   * @param {Number}
   *          min the minpoint.
   * @param {Number}
   *          max the maxpoint.
   */
  Interval.prototype.containsMinMax = function(min, max) {
    return (min >= this.min && max <= this.max);
  };

  /**
   * Checks if this interval contains the specified point
   *
   * @param {Number}
   *          p the point to check.
   */
  Interval.prototype.containsPoint = function(p) {
    return (p >= this.min && p <= this.max);
  };

  jsts.index.bintree.Interval = Interval;
})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * The base class for nodes in a {@link Bintree}.
 */
(function() {

  /**
   * Constructs a new NodeBase
   *
   * @constructor
   */
  var NodeBase = function() {
    this.items = new javascript.util.ArrayList();

    /**
     * subnodes are numbered as follows:
     *
     * 0 | 1
     */
    this.subnode = [null, null];
  };

  /**
   * Returns the index of the subnode that wholely contains the given interval.
   * If none does, returns -1.
   *
   * @param {jsts.index.bintree.Interval}
   *          interval the interval.
   * @param {Number}
   *          centre
   */
  NodeBase.getSubnodeIndex = function(interval, centre) {
    var subnodeIndex = -1;
    if (interval.min >= centre) {
      subnodeIndex = 1;
    }
    if (interval.max <= centre) {
      subnodeIndex = 0;
    }
    return subnodeIndex;
  };

  /**
   * Gets the items
   *
   * @return {javascript.util.ArrayList}
   */
  NodeBase.prototype.getItems = function() {
    return this.items;
  };

  /**
   * Adds an item
   *
   * @param {Object}
   *          item the item to add.
   */
  NodeBase.prototype.add = function(item) {
    this.items.add(item);
  };

  /**
   * Adds all items from this tree to the provided items
   *
   * @param {javascript.util.ArrayList}
   *          items the list to add to.
   * @return {javscript.util.ArrayList} the input list filled with items.
   */
  NodeBase.prototype.addAllItems = function(items) {
    // TODO: Check if addAll really takes an ordinary javascript array
    items.addAll(this.items);
    var i = 0, il = 2;
    for (i; i < il; i++) {
      if (this.subnode[i] !== null) {
        this.subnode[i].addAllItems(items);
      }
    }
    return items;
  };

  /**
   * Adds items in the tree which potentially overlap the query interval to the
   * given collection. If the query interval is <tt>null</tt>, add all items
   * in the tree.
   *
   * @param {jsts.index.bintree.Interval}
   *          interval a query nterval, or null.
   * @param {javascript.util.Collection}
   *          resultItems the candidate items found.
   */
  NodeBase.prototype.addAllItemsFromOverlapping = function(interval,
      resultItems) {
    if (interval !== null && !this.isSearchMatch(interval)) {
      return;
    }

    // some of these may not actually overlap - this is allowed by the bintree
    // contract
    resultItems.addAll(this.items);

    if (this.subnode[0] !== null) {
      this.subnode[0].addAllItemsFromOverlapping(interval, resultItems);
    }

    if (this.subnode[1] !== null) {
      this.subnode[1].addAllItemsFromOverlapping(interval, resultItems);
    }
  };

  /**
   * Removes a single item from this subtree.
   *
   * @param {jsts.index.bintree.Interval}
   *          itemInterval the envelope containing the item.
   * @param {Object}
   *          item the item to remove.
   * @return <code>true</code> if the item was found and removed.
   */
  NodeBase.prototype.remove = function(itemInterval, item) {
    if (!this.isSearchMatch(itemInterval)) {
      return false;
    }

    var found = false, i = 0, il = 2;
    for (i; i < il; i++) {
      if (this.subnode[i] !== null) {
        found = this.subnode[i].remove(itemInterval, item);
        if (found) {
          // trim subtree if empty
          if (this.subnode[i].isPrunable()) {
            this.subnode[i] = null;
          }
          break;
        }
      }
    }

    // if item was found lower down, don't need to search for it here
    if (found) {
      return found;
    }

    // otherwise, try and remove the item from the list of items in this node
    found = this.items.remove(item);
    return found;
  };

  /**
   * Checks if this tree has any children or items
   *
   * @return {Boolean} true if it has children or items (or both).
   */
  NodeBase.prototype.isPrunable = function() {
    return !(this.hasChildren() || this.hasItems());
  };

  /**
   * Checks if this tree has any children
   *
   * @return {Boolean} true if it has children.
   */
  NodeBase.prototype.hasChildren = function() {
    var i = 0, il = 2;
    for (i; i < il; i++) {
      if (this.subnode[i] !== null) {
        return true;
      }
    }
    return false;
  };

  /**
   * Checks i this node has any items
   *
   * @return {Boolean} true if it has items.
   */
  NodeBase.prototype.hasItems = function() {
    return !this.items.isEmpty();
  };

  NodeBase.prototype.depth = function() {
    var maxSubDepth = 0, i = 0, il = 2, sqd;
    for (i; i < il; i++) {
      if (this.subnode[i] !== null) {
        sqd = this.subnode[i].depth();
        if (sqd > maxSubDepth) {
          maxSubDepth = sqd;
        }
      }
    }
    return maxSubDepth + 1;
  };

  NodeBase.prototype.size = function() {
    var subSize = 0, i = 0, il = 2;
    for (i; i < il; i++) {
      if (this.subnode[i] !== null) {
        subSize += this.subnode[i].size();
      }
    }
    return subSize + this.items.size();
  };

  NodeBase.prototype.nodeSize = function() {
    var subSize = 0, i = 0, il = 2;
    for (i; i < il; i++) {
      if (this.subnode[i] !== null) {
        subSize += this.subnode[i].nodeSize();
      }
    }
    return subSize + 1;
  };

  jsts.index.bintree.NodeBase = NodeBase;
})();

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * DoubleBits manipulates Double numbers by using bit manipulation and bit-field
 * extraction. For some operations (such as determining the exponent) this is
 * more accurate than using mathematical operations (which suffer from round-off
 * error).
 * <p>
 * The algorithms and constants in this class apply only to IEEE-754
 * double-precision floating point format.
 *
 * NOTE: Since the only numberformat in JavaScript is IEEE-754 the code in
 * DoubleBits could not be easily ported.
 *
 * Instead, using algorithms found here:
 * http://www.merlyn.demon.co.uk/js-exact.htm
 *
 * @constructor
 */
jsts.index.DoubleBits = function() {

};


/**
 * Calculates the power of two for a number
 *
 * @param {Number}
 *          exp value to pow.
 * @return {Number} the pow'ed value.
 */
jsts.index.DoubleBits.powerOf2 = function(exp) {
  // TODO: Make sure the accuracy of this is sufficient (why else would JTS have
  // this in DoubleBits?)
  return Math.pow(2, exp);
};


/**
 * Calculates the exponent-part of the bit-pattern for a number
 *
 * @param {Number}
 *          d the IEEE-754-value to calculate the exponent for.
 * @return {Number} the exponent part of the bit-mask.
 */
jsts.index.DoubleBits.exponent = function(d) {
  return jsts.index.DoubleBits.CVTFWD(64, d) - 1023;
};


/**
 * Calculates the exponent of the bit-pattern for a number. Uses code from:
 * http://www.merlyn.demon.co.uk/js-exact.htm
 *
 * @param {Number}
 *          NumW 32 or 64 to denote the number of bits.
 * @param {Number}
 *          Qty the number to calculate the bit pattern for.
 * @return {Number} The integer value of the exponent.
 */
jsts.index.DoubleBits.CVTFWD = function(NumW, Qty) {
  var Sign, Expo, Mant, Bin, nb01 = ''; // , OutW = NumW/4
  var Inf = {
    32: {
      d: 0x7F,
      c: 0x80,
      b: 0,
      a: 0
    },
    64: {
      d: 0x7FF0,
      c: 0,
      b: 0,
      a: 0
    }
  };
  var ExW = {
    32: 8,
    64: 11
  }[NumW], MtW = NumW - ExW - 1;

  if (!Bin) {
    Sign = Qty < 0 || 1 / Qty < 0; // OK for +-0
    if (!isFinite(Qty)) {
      Bin = Inf[NumW];
      if (Sign) {
        Bin.d += 1 << (NumW / 4 - 1);
      }
      Expo = Math.pow(2, ExW) - 1;
      Mant = 0;
    }
  }

  if (!Bin) {
    Expo = {
      32: 127,
      64: 1023
    }[NumW];
    Mant = Math.abs(Qty);
    while (Mant >= 2) {
      Expo++;
      Mant /= 2;
    }
    while (Mant < 1 && Expo > 0) {
      Expo--;
      Mant *= 2;
    }
    if (Expo <= 0) {
      Mant /= 2;
      nb01 = 'Zero or Denormal';
    }
    if (NumW === 32 && Expo > 254) {
      nb01 = 'Too big for Single';
      Bin = {
        d: Sign ? 0xFF : 0x7F,
        c: 0x80,
        b: 0,
        a: 0
      };
      Expo = Math.pow(2, ExW) - 1;
      Mant = 0;
    }
  }

  return Expo;
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * A Key is a unique identifier for a node in a tree. It contains a lower-left
 * point and a level number. The level number is the power of two for the size
 * of the node envelope
 */
(function() {

  /**
   * @requires jsts/index/bintree/Interval.js
   * @requires jsts/index/DoubleBits.js
   */

  var DoubleBits = jsts.index.DoubleBits;
  var Interval = jsts.index.bintree.Interval;

  /**
   * Constructs a new Key
   *
   * @constructor
   * @param {jsts.index.bintree.Interval}
   *          interval the interval to compute the key from.
   */
  var Key = function(interval) {
    this.pt = 0.0;
    this.level = 0;

    this.computeKey(interval);
  };

  /**
   * Computes the level for an interval
   *
   * @param {jsts.index.bintree.Interval}
   *          interval the interval.
   * @results {Number} the calculated level
   */
  Key.computeLevel = function(interval) {
    var dx = interval.getWidth(), level;

    level = DoubleBits.exponent(dx) + 1;
    return level;
  };

  /**
   * Returns the point
   *
   * @return {Number} point.
   */
  Key.prototype.getPoint = function() {
    return this.pt;
  };

  /**
   * Returns the level
   *
   * @return {Number} level.
   */
  Key.prototype.getLevel = function() {
    return this.level;
  };

  /**
   * Returns the interval
   *
   * @return {jsts.index.bintree.Interval}
   */
  Key.prototype.getInterval = function() {
    return this.interval;
  };

  /**
   * Calculates the key
   *
   * @param {jsts.index.bintree.Interval}
   *          itemInterval the interval.
   */
  Key.prototype.computeKey = function(itemInterval) {
    this.level = Key.computeLevel(itemInterval);
    this.interval = new Interval();
    this.computeInterval(this.level, itemInterval);
    // MD - would be nice to have a non-iterative form of this algorithm
    while (!this.interval.contains(itemInterval)) {
      this.level += 1;
      this.computeInterval(this.level, itemInterval);
    }
  };

  /**
   * Computes the interval
   *
   * @param {Number}
   *          level the level.
   * @param {jsts.index.bintree.Interval}
   *          itemInterval an interval.
   */
  Key.prototype.computeInterval = function(level, itemInterval) {
    var size = DoubleBits.powerOf2(level);

    this.pt = Math.floor(itemInterval.getMin() / size) * size;
    this.interval.init(this.pt, this.pt + size);
  };

  jsts.index.bintree.Key = Key;
})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * A node of a {@link Bintree}.
 */
(function() {

  /**
   * @requires jsts/index/bintree/NodeBase.js
   * @requires jsts/index/bintree/Interval.js
   * @requires jsts/index/bintree/Key.js
   */

  var NodeBase = jsts.index.bintree.NodeBase;
  var Key = jsts.index.bintree.Key;
  var Interval = jsts.index.bintree.Interval;

  /**
   * Constructs a new Node
   *
   * @constructor
   */
  var Node = function(interval, level) {
    /**
     * subnodes are numbered as follows:
     *
     * 0 | 1
     */
    this.items = new javascript.util.ArrayList();
    this.subnode = [null, null];
    this.interval = interval;
    this.level = level;
    this.centre = (interval.getMin() + interval.getMax()) / 2;
  };
  Node.prototype = new NodeBase();
  Node.constructor = Node;

  /**
   * Creates a node from a specified interval
   *
   * @param {jsts.index.bintree.Interval}
   *          itemInterval the interval.
   * @return {jsts.index.bintree.Node} the created node.
   */
  Node.createNode = function(itemInterval) {
    var key, node;

    key = new Key(itemInterval);
    node = new Node(key.getInterval(), key.getLevel());
    return node;
  };

  /**
   * Creates an expanded node
   *
   * @param {jsts.index.bintree.Node}
   *          node the node.
   * @param {jsts.index.bintree.Interval}
   *          addInterval the interval to add.
   * @return {jsts.index.bintree.Node} the expanded node.
   */
  Node.createExpanded = function(node, addInterval) {
    var expandInt, largerNode;
    expandInt = new Interval(addInterval);
    if (node !== null) {
      expandInt.expandToInclude(node.interval);
    }

    largerNode = Node.createNode(expandInt);

    if (node !== null) {
      largerNode.insert(node);
    }

    return largerNode;
  };

  Node.prototype.getInterval = function() {
    return this.interval;
  };

  /**
   * Checks if the input interval matches any items in this node
   *
   * @return {Boolean} true if there is a search match.
   */
  Node.prototype.isSearchMatch = function(itemInterval) {
    return itemInterval.overlaps(this.interval);
  };

  /**
   * Returns the subnode containing the envelope. Creates the node if it does
   * not already exist.
   *
   * @param {jsts.index.bintree.Interval}
   *          serachInterval the interval.
   * @return {jsts.index.bintree.Node} the node.
   */
  Node.prototype.getNode = function(searchInterval) {
    var subnodeIndex = NodeBase.getSubnodeIndex(searchInterval, this.centre), node;
    // if index is -1 searchEnv is not contained in a subnode
    if (subnodeIndex != -1) {
      // create the node if it does not exist
      node = this.getSubnode(subnodeIndex);
      // recursively search the found/created node
      return node.getNode(searchInterval);
    } else {
      return this;
    }
  };

  /**
   * Returns the smallest <i>existing</i> node containing the envelope.
   *
   * @param {jsts.index.bintree.Interval}
   *          searchInterval the interval.
   * @return {jsts.index.bintree.Node} the smallest node contained.
   */
  Node.prototype.find = function(searchInterval) {
    var subnodeIndex = NodeBase.getSubnodeIndex(searchInterval, this.centre), node;
    if (subnodeIndex === -1) {
      return this;
    }

    if (this.subnode[subnodeIndex] !== null) {
      // query lies in subnode, so search it
      node = this.subnode[subnodeIndex];
      return node.find(searchInterval);
    }
    // no existing subnode, so return this one anyway
    return this;
  };

  /**
   * Inserts a node as a child node (at some level) in this node
   *
   * @param {jsts.index.bintree.Node}
   *          node the node to insert.
   */
  Node.prototype.insert = function(node) {
    //Assert.isTrue(interval == null || interval.contains(node.interval));

    var index = NodeBase.getSubnodeIndex(node.interval, this.centre), childNode;
    if (node.level === this.level - 1) {
      this.subnode[index] = node;
    } else {
      // the node is not a direct child, so make a new child node to contain it
      // and recursively insert the node
      childNode = this.createSubnode(index);
      childNode.insert(node);
      this.subnode[index] = childNode;
    }
  };

  /**
   * get the subnode for the index. If it doesn't exist, create it
   *
   * @param {Number}
   *          index
   * @return {jsts.index.bintree.Node} the found or created node.
   */
  Node.prototype.getSubnode = function(index) {
    if (this.subnode[index] === null) {
      this.subnode[index] = this.createSubnode(index);
    }
    return this.subnode[index];
  };

  /**
   * Creates a subnode
   *
   * @param {Number}
   *          index the index to create the subnode at.
   * @return {jsts.index.bintree.Node} the created node.
   */
  Node.prototype.createSubnode = function(index) {
    // create a new subnode in the appropriate interval

    var min, max, subInt, node;

    min = 0.0;
    max = 0.0;

    switch (index) {
    case 0:
      min = this.interval.getMin();
      max = this.centre;
      break;
    case 1:
      min = this.centre;
      max = this.interval.getMax();
      break;
    }
    subInt = new Interval(min, max);
    node = new Node(subInt, this.level - 1);
    return node;
  };

  jsts.index.bintree.Node = Node;
})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
*/



/**
 * Provides a test for whether an interval is so small it should be considered
 * as zero for the purposes of inserting it into a binary tree. The reason this
 * check is necessary is that round-off error can cause the algorithm used to
 * subdivide an interval to fail, by computing a midpoint value which does not
 * lie strictly between the endpoints.
 *
 * @constructor
 */
jsts.index.IntervalSize = function() {

};


/**
 * This value is chosen to be a few powers of 2 less than the number of bits
 * available in the double representation (i.e. 53). This should allow enough
 * extra precision for simple computations to be correct, at least for
 * comparison purposes.
 */
jsts.index.IntervalSize.MIN_BINARY_EXPONENT = -50;


/**
 * Computes whether the interval [min, max] is effectively zero width. I.e. the
 * width of the interval is so much less than the location of the interval that
 * the midpoint of the interval cannot be represented precisely.
 *
 * @param {Number}
 *          min the min-value in the interval.
 * @param {Number}
 *          max the max-value in the interval.
 * @return {Boolean} true if the interval should be considered zero.
 */
jsts.index.IntervalSize.isZeroWidth = function(min, max) {
  var width = max - min;
  if (width === 0.0) {
    return true;
  }

  var maxAbs, scaledInterval, level;
  maxAbs = Math.max(Math.abs(min), Math.abs(max));
  scaledInterval = width / maxAbs;

  level = jsts.index.DoubleBits.exponent(scaledInterval);
  return level <= jsts.index.IntervalSize.MIN_BINARY_EXPONENT;
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * The root node of a single {@link Bintree}. It is centred at the origin, and
 * does not have a defined extent.
 */
(function() {

  /**
   * @requires jsts/index/bintree/NodeBase.js
   * @requires jsts/index/bintree/Node.js
   */

  var Node = jsts.index.bintree.Node;
  var NodeBase = jsts.index.bintree.NodeBase;

  /**
   * Constructs a new Root
   *
   * @constructor
   */
  var Root = function() {
    /**
     * subnodes are numbered as follows:
     *
     * 0 | 1
     */
    this.subnode = [null, null];
    this.items = new javascript.util.ArrayList();
  };
  Root.prototype = new jsts.index.bintree.NodeBase();
  Root.constructor = Root;

  // the singleton root node is centred at the origin.
  Root.origin = 0.0;

  /**
   * Insert an item into the tree this is the root of.
   *
   * @param {jsts.index.bintree.Interval}
   *          itemInterval the interval of the item.
   * @param {Object}
   *          item the item to insert.
   */
  Root.prototype.insert = function(itemInterval, item) {
    var index = NodeBase.getSubnodeIndex(itemInterval, Root.origin), node, largerNode;
    // if index is -1, itemEnv must contain the origin.
    if (index === -1) {
      this.add(item);
      return;
    }

    /**
     * the item must be contained in one interval, so insert it into the tree
     * for that interval (which may not yet exist)
     */
    node = this.subnode[index];

    /**
     * If the subnode doesn't exist or this item is not contained in it, have to
     * expand the tree upward to contain the item.
     */

    if (node === null || !node.getInterval().contains(itemInterval)) {
      largerNode = Node.createExpanded(node, itemInterval);
      this.subnode[index] = largerNode;
    }

    /**
     * At this point we have a subnode which exists and must contain contains
     * the env for the item. Insert the item into the tree.
     */
    this.insertContained(this.subnode[index], itemInterval, item);
  };

  /**
   * insert an item which is known to be contained in the tree rooted at the
   * given Node. Lower levels of the tree will be created if necessary to hold
   * the item.
   *
   * @param {jsts.index.bintree.Node}
   *          tree the subtree.
   * @param {jsts.index.bintree.Interval}
   *          itemInterval the interval.
   * @param {Object}
   *          item the item to insert.
   */
  Root.prototype.insertContained = function(tree, itemInterval, item) {
    var isZeroArea, node;
    /**
     * Do NOT create a new node for zero-area intervals - this would lead to
     * infinite recursion. Instead, use a heuristic of simply returning the
     * smallest existing node containing the query
     */
    isZeroArea = jsts.index.IntervalSize.isZeroWidth(itemInterval
        .getMin(), itemInterval.getMax());
    node = isZeroArea ? tree.find(itemInterval) : tree.getNode(itemInterval);
    node.add(item);
  };

  /**
   * The root node matches all searches
   */
  Root.prototype.isSearchMatch = function(interval) {
    return true;
  };

  jsts.index.bintree.Root = Root;
})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * An <code>BinTree</code> (or "Binary Interval Tree") is a 1-dimensional
 * version of a quadtree. It indexes 1-dimensional intervals (which may be the
 * projection of 2-D objects on an axis). It supports range searching (where the
 * range may be a single point). This structure is dynamic - new items can be
 * added at any time, and it will support deletion of items (although this is
 * not currently implemented).
 * <p>
 * This implementation does not require specifying the extent of the inserted
 * items beforehand. It will automatically expand to accomodate any extent of
 * dataset.
 * <p>
 * The bintree structure is used to provide a primary filter for interval
 * queries. The query() method returns a list of all objects which <i>may</i>
 * intersect the query interval. Note that it may return objects which do not in
 * fact intersect. A secondary filter is required to test for exact
 * intersection. Of course, this secondary filter may consist of other tests
 * besides intersection, such as testing other kinds of spatial relationships.
 * <p>
 * This index is different to the Interval Tree of Edelsbrunner or the Segment
 * Tree of Bentley.
 */
(function() {

  /**
   * @requires jsts/index/bintree/Root.js
   * @requires jsts/index/bintree/Interval.js
   */

  var Interval = jsts.index.bintree.Interval;
  var Root = jsts.index.bintree.Root;

  /**
   * Constructs a new Bintree
   *
   * @constructor
   */
  var Bintree = function() {
    this.root = new Root();

    /**
     * Statistics
     *
     * minExtent is the minimum extent of all items inserted into the tree so
     * far. It is used as a heuristic value to construct non-zero extents for
     * features with zero extent. Start with a non-zero extent, in case the
     * first feature inserted has a zero extent in both directions. This value
     * may be non-optimal, but only one feature will be inserted with this
     * value.
     */
    this.minExtent = 1.0;
  };

  /**
   * Ensure that the Interval for the inserted item has non-zero extents. Use
   * the current minExtent to pad it, if necessary
   *
   * @param {jsts.index.bintree.Interval}
   *          itemInterval the interval.
   * @param {Number}
   *          minExtent used to pad the extent if necessary.
   */
  Bintree.ensureExtent = function(itemInterval, minExtent) {
    var min, max;

    min = itemInterval.getMin();
    max = itemInterval.getMax();

    // has a non-zero extent
    if (min !== max) {
      return itemInterval;
    }

    // pad extent
    if (min === max) {
      min = min - (minExtent / 2.0);
      max = min + (minExtent / 2.0);
    }

    return new Interval(min, max);
  };

  /**
   * Calculates the depth of the tree
   *
   * @return {Number} the depth.
   */
  Bintree.prototype.depth = function() {
    if (this.root !== null) {
      return this.root.depth();
    }
    return 0;
  };

  /**
   * Calculates the size of the tree
   *
   * @return {Number} the size.
   */
  Bintree.prototype.size = function() {
    if (this.root !== null) {
      return this.root.size();
    }
    return 0;
  };


  /**
   * Compute the total number of nodes in the tree
   *
   * @return {Number} the number of nodes in the tree.
   */
  Bintree.prototype.nodeSize = function() {
    if (this.root !== null) {
      return this.root.nodeSize();
    }
    return 0;
  };

  /**
   * Inserts an object in the tree
   *
   * @param {jsts.index.bintree.Interval}
   *          itemInterval the interval for the item.
   * @param {Object}
   *          item the item to insert.
   */
  Bintree.prototype.insert = function(itemInterval, item) {
    this.collectStats(itemInterval);
    var insertInterval = Bintree.ensureExtent(itemInterval, this.minExtent);
    this.root.insert(insertInterval, item);
  };

  /**
   * Removes a single item from the tree.
   *
   * @param {jsts.index.bintree.Interval}
   *          itemInterval the Interval of the item to be removed.
   * @param {Object}
   *          item the item to remove.
   * @return {Boolean} <code>true</code> if the item was found (and thus
   *         removed).
   */
  Bintree.prototype.remove = function(itemInterval, item) {
    var insertInterval = Bintree.ensureExtent(itemInterval, this.minExtent);
    return this.root.remove(insertInterval, item);
  };

  Bintree.prototype.iterator = function() {
    var foundItems = new javascript.util.ArrayList();
    this.root.addAllItems(foundItems);
    return foundItems.iterator();
  };

  /**
   * Queries the tree by Interval or number
   *
   * @param {Number}
   *          x OR {jsts.index.bintree.Interval} x.
   * @return {javascript.util.ArrayList} the found items.
   */
  Bintree.prototype.query = function() {
    if (arguments.length === 2) {
      this.queryAndAdd(arguments[0], arguments[1]);
    } else {
      var x = arguments[0];
      if (!x instanceof Interval) {
        x = new Interval(x, x);
      }

      return this.queryInterval(x);
    }
  };

  /**
   * Queries the tree to find all candidate items which may overlap the query
   * interval. If the query interval is <tt>null</tt>, all items in the tree
   * are found.
   *
   * min and max may be the same value
   *
   * @param {jsts.index.bintree.Interval}
   *          interval the interval to query by.
   */
  Bintree.prototype.queryInterval = function(interval) {
    /**
     * the items that are matched are all items in intervals which overlap the
     * query interval
     */
    var foundItems = new javascript.util.ArrayList();
    this.query(interval, foundItems);
    return foundItems;
  };

  /**
   * Adds items in the tree which potentially overlap the query interval to the
   * given collection. If the query interval is <tt>null</tt>, add all items
   * in the tree.
   *
   * @param {jsts.index.bintree.Interval}
   *          interval a query nterval, or null.
   * @param {javascript.util.ArrayList}
   *          resultItems the candidate items found.
   */
  Bintree.prototype.queryAndAdd = function(interval, foundItems) {
    this.root.addAllItemsFromOverlapping(interval, foundItems);
  };

  Bintree.prototype.collectStats = function(interval) {
    var del = interval.getWidth();
    if (del < this.minExtent && del > 0.0) {
      this.minExtent = del;
    }
  };

  jsts.index.bintree.Bintree = Bintree;
})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Monotone Chains are a way of partitioning the segments of a linestring to
 * allow for fast searching of intersections. They have the following
 * properties:
 * <ol>
 * <li>the segments within a monotone chain never intersect each other
 * <li>the envelope of any contiguous subset of the segments in a monotone
 * chain is equal to the envelope of the endpoints of the subset.
 * </ol>
 * Property 1 means that there is no need to test pairs of segments from within
 * the same monotone chain for intersection.
 * <p>
 * Property 2 allows an efficient binary search to be used to find the
 * intersection points of two monotone chains. For many types of real-world
 * data, these properties eliminate a large number of segment comparisons,
 * producing substantial speed gains.
 * <p>
 * One of the goals of this implementation of MonotoneChains is to be as space
 * and time efficient as possible. One design choice that aids this is that a
 * MonotoneChain is based on a subarray of a list of points. This means that new
 * arrays of points (potentially very large) do not have to be allocated.
 * <p>
 *
 * MonotoneChains support the following kinds of queries:
 * <ul>
 * <li>Envelope select: determine all the segments in the chain which intersect
 * a given envelope
 * <li>Overlap: determine all the pairs of segments in two chains whose
 * envelopes overlap
 * </ul>
 *
 * This implementation of MonotoneChains uses the concept of internal iterators
 * to return the resultsets for the above queries. This has time and space
 * advantages, since it is not necessary to build lists of instantiated objects
 * to represent the segments returned by the query. However, it does mean that
 * the queries are not thread-safe.
 *
 * @constructor
 */
jsts.index.chain.MonotoneChain = function(pts, start, end, context) {
  this.pts = pts;
  this.start = start;
  this.end = end;
  this.context = context;
};

/**
 * @type {Array.<jsts.geom.Coordinate>}
 * @private
 */
jsts.index.chain.MonotoneChain.prototype.pts = null;
/**
 * @type {number}
 * @private
 */
jsts.index.chain.MonotoneChain.prototype.start = null;
/**
 * @type {number}
 * @private
 */
jsts.index.chain.MonotoneChain.prototype.end = null;
/**
 * @type {Envelope}
 * @private
 */
jsts.index.chain.MonotoneChain.prototype.env = null;
/**
 * user-defined information
 *
 * @type {Object}
 * @private
 */
jsts.index.chain.MonotoneChain.prototype.context = null;
/**
 * useful for optimizing chain comparisons
 *
 * @type {number}
 * @private
 */
jsts.index.chain.MonotoneChain.prototype.id = null;

jsts.index.chain.MonotoneChain.prototype.setId = function(id) {
  this.id = id;
};
jsts.index.chain.MonotoneChain.prototype.getId = function() {
  return this.id;
};

jsts.index.chain.MonotoneChain.prototype.getContext = function() {
  return this.context;
};

jsts.index.chain.MonotoneChain.prototype.getEnvelope = function() {
  if (this.env == null) {
    var p0 = this.pts[this.start];
    var p1 = this.pts[this.end];
    this.env = new jsts.geom.Envelope(p0, p1);
  }
  return this.env;
};

jsts.index.chain.MonotoneChain.prototype.getStartIndex = function() {
  return this.start;
};
jsts.index.chain.MonotoneChain.prototype.getEndIndex = function() {
  return this.end;
};

jsts.index.chain.MonotoneChain.prototype.getLineSegment = function(index, ls) {
  ls.p0 = this.pts[index];
  ls.p1 = this.pts[index + 1];
};
/**
 * Return the subsequence of coordinates forming this chain. Allocates a new
 * array to hold the Coordinates
 */
jsts.index.chain.MonotoneChain.prototype.getCoordinates = function() {
  var coord = [];
  var index = 0;
  for (var i = this.start; i <= this.end; i++) {
    coord[index++] = this.pts[i];
  }
  return coord;
};

/**
 * Determine all the line segments in the chain whose envelopes overlap the
 * searchEnvelope, and process them.
 * <p>
 * The monotone chain search algorithm attempts to optimize performance by not
 * calling the select action on chain segments which it can determine are not in
 * the search envelope. However, it *may* call the select action on segments
 * which do not intersect the search envelope. This saves on the overhead of
 * checking envelope intersection each time, since clients may be able to do
 * this more efficiently.
 *
 * @param {Envelope}
 *          searchEnv the search envelope.
 * @param {MonotoneChainSelectAction}
 *          mcs the select action to execute on selected segments.
 */
jsts.index.chain.MonotoneChain.prototype.select = function(searchEnv, mcs) {
  this.computeSelect2(searchEnv, this.start, this.end, mcs);
};

/**
 * @private
 */
jsts.index.chain.MonotoneChain.prototype.computeSelect2 = function(searchEnv,
    start0, end0, mcs) {
  var p0 = this.pts[start0];
  var p1 = this.pts[end0];
  mcs.tempEnv1.init(p0, p1);

  // terminating condition for the recursion
  if (end0 - start0 === 1) {
    mcs.select(this, start0);
    return;
  }
  // nothing to do if the envelopes don't overlap
  if (!searchEnv.intersects(mcs.tempEnv1))
    return;

  // the chains overlap, so split each in half and iterate (binary search)
  var mid = parseInt((start0 + end0) / 2);

  // Assert: mid != start or end (since we checked above for end - start <= 1)
  // check terminating conditions before recursing
  if (start0 < mid) {
    this.computeSelect2(searchEnv, start0, mid, mcs);
  }
  if (mid < end0) {
    this.computeSelect2(searchEnv, mid, end0, mcs);
  }
};

/**
 * Determine all the line segments in two chains which may overlap, and process
 * them.
 * <p>
 * The monotone chain search algorithm attempts to optimize performance by not
 * calling the overlap action on chain segments which it can determine do not
 * overlap. However, it *may* call the overlap action on segments which do not
 * actually interact. This saves on the overhead of checking intersection each
 * time, since clients may be able to do this more efficiently.
 *
 * @param {MonotoneChain}
 *          searchEnv the search envelope.
 * @param {MonotoneChainOverlapAction}
 *          mco the overlap action to execute on selected segments.
 */
jsts.index.chain.MonotoneChain.prototype.computeOverlaps = function(mc, mco) {
  if (arguments.length === 6) {
    return this.computeOverlaps2.apply(this, arguments);
  }
  this.computeOverlaps2(this.start, this.end, mc, mc.start, mc.end, mco);
};

/**
 * @private
 */
jsts.index.chain.MonotoneChain.prototype.computeOverlaps2 = function(start0,
    end0, mc, start1, end1, mco) {
  var p00 = this.pts[start0];
  var p01 = this.pts[end0];
  var p10 = mc.pts[start1];
  var p11 = mc.pts[end1];
  // Debug.println("computeIntersectsForChain:" + p00 + p01 + p10 + p11);
  // terminating condition for the recursion
  if (end0 - start0 === 1 && end1 - start1 === 1) {
    mco.overlap(this, start0, mc, start1);
    return;
  }
  // nothing to do if the envelopes of these chains don't overlap
  mco.tempEnv1.init(p00, p01);
  mco.tempEnv2.init(p10, p11);
  if (!mco.tempEnv1.intersects(mco.tempEnv2))
    return;

  // the chains overlap, so split each in half and iterate (binary search)
  var mid0 = parseInt((start0 + end0) / 2);
  var mid1 = parseInt((start1 + end1) / 2);

  // Assert: mid != start or end (since we checked above for end - start <= 1)
  // check terminating conditions before recursing
  if (start0 < mid0) {
    if (start1 < mid1)
      this.computeOverlaps2(start0, mid0, mc, start1, mid1, mco);
    if (mid1 < end1)
      this.computeOverlaps2(start0, mid0, mc, mid1, end1, mco);
  }
  if (mid0 < end0) {
    if (start1 < mid1)
      this.computeOverlaps2(mid0, end0, mc, start1, mid1, mco);
    if (mid1 < end1)
      this.computeOverlaps2(mid0, end0, mc, mid1, end1, mco);
  }
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/index/chain/MonotoneChainSelectAction.js
 */

/**
 * Implements {@link PointInRing} using {@link MonotoneChain}s and a
 * {@link Bintree} index to increase performance.
 *
 * @see IndexedPointInAreaLocator for more general functionality
 */
jsts.algorithm.MCPointInRing = function(ring) {
  this.ring = ring;
  this.tree = null;
  this.crossings = 0;
  this.interval = new jsts.index.bintree.Interval();
  this.buildIndex();
};

/**
 *
 * @param {jsts.geom.Coordinate}
 *          p the input coordinate.
 * @return {jsts.algorithm.MCPointInRing.MCSelecter}
 * @constructor
 */
jsts.algorithm.MCPointInRing.MCSelecter = function(p,parent) {
  this.parent = parent; //To be used instead of inner-class function calls
  this.p = p;
};

jsts.algorithm.MCPointInRing.MCSelecter.prototype = new jsts.index.chain.MonotoneChainSelectAction;
jsts.algorithm.MCPointInRing.MCSelecter.prototype.constructor = jsts.algorithm.MCPointInRing.MCSelecter;

jsts.algorithm.MCPointInRing.MCSelecter.prototype.select2 = function(ls) {
  this.parent.testLineSegment.apply(this.parent, [this.p, ls]);
  //this.testLineSegment(this.p, ls);
};

jsts.algorithm.MCPointInRing.prototype.buildIndex = function() {
  this.tree = new jsts.index.bintree.Bintree();

  var pts = jsts.geom.CoordinateArrays.removeRepeatedPoints(this.ring
      .getCoordinates());

  var mcList = jsts.index.chain.MonotoneChainBuilder.getChains(pts);

  for (var i = 0; i < mcList.length; i++) {
    var mc = mcList[i];
    var mcEnv = mc.getEnvelope();
    this.interval.min = mcEnv.getMinY();
    this.interval.max = mcEnv.getMaxY();
    this.tree.insert(this.interval, mc);
  }
};

jsts.algorithm.MCPointInRing.prototype.isInside = function(pt) {
  this.crossings = 0;

  // test all segments intersected by ray from pt in positive x direction
  var rayEnv = new jsts.geom.Envelope(-Number.MAX_VALUE, Number.MAX_VALUE, pt.y,
      pt.y);

  this.interval.min = pt.y;
  this.interval.max = pt.y;

  var segs = this.tree.query(this.interval);

  var mcSelecter = new jsts.algorithm.MCPointInRing.MCSelecter(pt, this);

  for (var i = segs.iterator(); i.hasNext();) {
    var mc = i.next();
    this.testMonotoneChain(rayEnv, mcSelecter, mc);
  }

  /*
   *  p is inside if number of crossings is odd.
   */
  if ((this.crossings % 2) == 1) {
    return true;
  }
  return false;

};

jsts.algorithm.MCPointInRing.prototype.testMonotoneChain = function(rayEnv,
    mcSelecter, mc) {
  mc.select(rayEnv, mcSelecter);
};

jsts.algorithm.MCPointInRing.prototype.testLineSegment = function(p, seg) {
  var xInt, x1, y1, x2, y2, p1, p2;

  /*
   *  Test if segment crosses ray from test point in positive x direction.
   */
  p1 = seg.p0;
  p2 = seg.p1;

  x1 = p1.x - p.x;
  y1 = p1.y - p.y;
  x2 = p2.x - p.x;
  y2 = p2.y - p.y;

  if (((y1 > 0) && (y2 <= 0)) || ((y2 > 0) && (y1 <= 0))) {
    /*
     *  segment straddles x axis, so compute intersection.
     */
    xInt = jsts.algorithm.RobustDeterminant.signOfDet2x2(x1, y1, x2, y2) /
        (y2 - y1);
    // xsave = xInt;
    /*
     *  crosses ray if strictly positive intersection.
     */
    if (0.0 < xInt) {
      this.crossings++;
    }
  }
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 *
 * Tests whether any of a set of {@link LinearRing}s are nested inside another
 * ring in the set, using a spatial index to speed up the comparisons.
 *
 * @version 1.7
 */

jsts.operation.valid.IndexedNestedRingTester = function(graph) {
  this.graph = graph;
  this.rings = new javascript.util.ArrayList();
  this.totalEnv = new jsts.geom.Envelope();
  this.index = null;
  this.nestedPt = null;
};

jsts.operation.valid.IndexedNestedRingTester.prototype.getNestedPoint = function() {
  return this.nestedPt;
};

jsts.operation.valid.IndexedNestedRingTester.prototype.add = function(ring) {
  this.rings.add(ring);
  this.totalEnv.expandToInclude(ring.getEnvelopeInternal());
};

jsts.operation.valid.IndexedNestedRingTester.prototype.isNonNested = function() {
  this.buildIndex();
  for (var i = 0; i < this.rings.size(); i++) {
    var innerRing = this.rings.get(i);
    var innerRingPts = innerRing.getCoordinates();
    var results = this.index.query(innerRing.getEnvelopeInternal());

    for (var j = 0; j < results.length; j++) {
      var searchRing = results[j];
      var searchRingPts = searchRing.getCoordinates();

      if (innerRing == searchRing) {
        continue;
      }

      if (!innerRing.getEnvelopeInternal().intersects(
          searchRing.getEnvelopeInternal())) {
        continue;
      }

      var innerRingPt = jsts.operation.valid.IsValidOp.findPtNotNode(
          innerRingPts, searchRing, this.graph);

      /**
       *
       * If no non-node pts can be found, this means that the searchRing touches
       * ALL of the innerRing vertices. This indicates an invalid polygon, since
       * either the two holes create a disconnected interior, or they touch in
       * an infinite number of points (i.e. along a line segment). Both of these
       * cases are caught by other tests, so it is safe to simply skip this
       * situation here.
       */

      if (innerRingPt == null) {
        continue;
      }

      var isInside = jsts.algorithm.CGAlgorithms.isPointInRing(innerRingPt,
          searchRingPts);

      if (isInside) {
        this.nestedPt = innerRingPt;
        return false;
      }
    }
  }
  return true;
};

jsts.operation.valid.IndexedNestedRingTester.prototype.buildIndex = function() {
  this.index = new jsts.index.strtree.STRtree();

  for (var i = 0; i < this.rings.size(); i++) {
    var ring = this.rings.get(i);
    var env = ring.getEnvelopeInternal();
    this.index.insert(env, ring);
  }
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * @requires jsts/geom/Location.js
   * @requires jsts/geomgraph/Position.js
   * @requires jsts/geomgraph/EdgeEndStar.js
   * @requires jsts/util/Assert.js
   */

  var Location = jsts.geom.Location;
  var Position = jsts.geomgraph.Position;
  var EdgeEndStar = jsts.geomgraph.EdgeEndStar;
  var Assert = jsts.util.Assert;


  /**
   * A DirectedEdgeStar is an ordered list of <b>outgoing</b> DirectedEdges
   * around a node. It supports labelling the edges as well as linking the edges
   * to form both MaximalEdgeRings and MinimalEdgeRings.
   *
   * @constructor
   * @extends jsts.geomgraph.EdgeEnd
   */
  jsts.geomgraph.DirectedEdgeStar = function() {
    jsts.geomgraph.EdgeEndStar.call(this);
  };
  jsts.geomgraph.DirectedEdgeStar.prototype = new EdgeEndStar();
  jsts.geomgraph.DirectedEdgeStar.constructor = jsts.geomgraph.DirectedEdgeStar;


  /**
   * A list of all outgoing edges in the result, in CCW order
   *
   * @private
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.resultAreaEdgeList = null;
  jsts.geomgraph.DirectedEdgeStar.prototype.label = null;

  /**
   * Insert a directed edge in the list
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.insert = function(ee) {
    var de = ee;
    this.insertEdgeEnd(de, de);
  };

  jsts.geomgraph.DirectedEdgeStar.prototype.getLabel = function() {
    return this.label;
  };

  jsts.geomgraph.DirectedEdgeStar.prototype.getOutgoingDegree = function() {
    var degree = 0;
    for (var it = this.iterator(); it.hasNext();) {
      var de = it.next();
      if (de.isInResult())
        degree++;
    }
    return degree;
  };
  jsts.geomgraph.DirectedEdgeStar.prototype.getOutgoingDegree = function(er) {
    var degree = 0;
    for (var it = this.iterator(); it.hasNext();) {
      var de = it.next();
      if (de.getEdgeRing() === er)
        degree++;
    }
    return degree;
  };

  jsts.geomgraph.DirectedEdgeStar.prototype.getRightmostEdge = function() {
    var edges = this.getEdges();
    var size = edges.size();
    if (size < 1)
      return null;
    var de0 = edges.get(0);
    if (size == 1)
      return de0;
    var deLast = edges.get(size - 1);

    var quad0 = de0.getQuadrant();
    var quad1 = deLast.getQuadrant();
    if (jsts.geomgraph.Quadrant.isNorthern(quad0) &&
        jsts.geomgraph.Quadrant.isNorthern(quad1))
      return de0;
    else if (!jsts.geomgraph.Quadrant.isNorthern(quad0) &&
        !jsts.geomgraph.Quadrant.isNorthern(quad1))
      return deLast;
    else {
      // edges are in different hemispheres - make sure we return one that is
      // non-horizontal
      var nonHorizontalEdge = null;
      if (de0.getDy() != 0)
        return de0;
      else if (deLast.getDy() != 0)
        return deLast;
    }
    Assert.shouldNeverReachHere('found two horizontal edges incident on node');
    return null;
  };
  /**
   * Compute the labelling for all dirEdges in this star, as well as the overall
   * labelling
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.computeLabelling = function(geom) {
    EdgeEndStar.prototype.computeLabelling.call(this, geom);

    // determine the overall labelling for this DirectedEdgeStar
    // (i.e. for the node it is based at)
    this.label = new jsts.geomgraph.Label(Location.NONE);
    for (var it = this.iterator(); it.hasNext();) {
      var ee = it.next();
      var e = ee.getEdge();
      var eLabel = e.getLabel();
      for (var i = 0; i < 2; i++) {
        var eLoc = eLabel.getLocation(i);
        if (eLoc === Location.INTERIOR || eLoc === Location.BOUNDARY)
          this.label.setLocation(i, Location.INTERIOR);
      }
    }
  };

  /**
   * For each dirEdge in the star, merge the label from the sym dirEdge into the
   * label
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.mergeSymLabels = function() {
    for (var it = this.iterator(); it.hasNext();) {
      var de = it.next();
      var label = de.getLabel();
      label.merge(de.getSym().getLabel());
    }
  };

  /**
   * Update incomplete dirEdge labels from the labelling for the node
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.updateLabelling = function(nodeLabel) {
    for (var it = this.iterator(); it.hasNext();) {
      var de = it.next();
      var label = de.getLabel();
      label.setAllLocationsIfNull(0, nodeLabel.getLocation(0));
      label.setAllLocationsIfNull(1, nodeLabel.getLocation(1));
    }
  };

  /**
   * @private
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.getResultAreaEdges = function() {
    if (this.resultAreaEdgeList !== null)
      return this.resultAreaEdgeList;
    this.resultAreaEdgeList = new javascript.util.ArrayList();
    for (var it = this.iterator(); it.hasNext();) {
      var de = it.next();
      if (de.isInResult() || de.getSym().isInResult())
        this.resultAreaEdgeList.add(de);
    }
    return this.resultAreaEdgeList;

  };

  /**
   * @private
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.SCANNING_FOR_INCOMING = 1;
  /**
   * @private
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.LINKING_TO_OUTGOING = 2;
  /**
   * Traverse the star of DirectedEdges, linking the included edges together. To
   * link two dirEdges, the <next> pointer for an incoming dirEdge is set to the
   * next outgoing edge.
   * <p>
   * DirEdges are only linked if:
   * <ul>
   * <li>they belong to an area (i.e. they have sides)
   * <li>they are marked as being in the result
   * </ul>
   * <p>
   * Edges are linked in CCW order (the order they are stored). This means that
   * rings have their face on the Right (in other words, the topological
   * location of the face is given by the RHS label of the DirectedEdge)
   * <p>
   * PRECONDITION: No pair of dirEdges are both marked as being in the result
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.linkResultDirectedEdges = function() {
    // make sure edges are copied to resultAreaEdges list
    this.getResultAreaEdges();
    // find first area edge (if any) to start linking at
    var firstOut = null;
    var incoming = null;
    var state = this.SCANNING_FOR_INCOMING;
    // link edges in CCW order
    for (var i = 0; i < this.resultAreaEdgeList.size(); i++) {
      var nextOut = this.resultAreaEdgeList.get(i);
      var nextIn = nextOut.getSym();

      // skip de's that we're not interested in
      if (!nextOut.getLabel().isArea())
        continue;

      // record first outgoing edge, in order to link the last incoming edge
      if (firstOut === null && nextOut.isInResult())
        firstOut = nextOut;
      // assert: sym.isInResult() == false, since pairs of dirEdges should have
      // been removed already

      switch (state) {
      case this.SCANNING_FOR_INCOMING:
        if (!nextIn.isInResult())
          continue;
        incoming = nextIn;
        state = this.LINKING_TO_OUTGOING;
        break;
      case this.LINKING_TO_OUTGOING:
        if (!nextOut.isInResult())
          continue;
        incoming.setNext(nextOut);
        state = this.SCANNING_FOR_INCOMING;
        break;
      }
    }
    if (state === this.LINKING_TO_OUTGOING) {
      if (firstOut === null)
        throw new jsts.error.TopologyError('no outgoing dirEdge found', this
            .getCoordinate());
      Assert.isTrue(firstOut.isInResult(),
          'unable to link last incoming dirEdge');
      incoming.setNext(firstOut);
    }
  };
  jsts.geomgraph.DirectedEdgeStar.prototype.linkMinimalDirectedEdges = function(er) {
    // find first area edge (if any) to start linking at
    var firstOut = null;
    var incoming = null;
    var state = this.SCANNING_FOR_INCOMING;
    // link edges in CW order
    for (var i = this.resultAreaEdgeList.size() - 1; i >= 0; i--) {
      var nextOut = this.resultAreaEdgeList.get(i);
      var nextIn = nextOut.getSym();

      // record first outgoing edge, in order to link the last incoming edge
      if (firstOut === null && nextOut.getEdgeRing() === er)
        firstOut = nextOut;

      switch (state) {
      case this.SCANNING_FOR_INCOMING:
        if (nextIn.getEdgeRing() != er)
          continue;
        incoming = nextIn;
        state = this.LINKING_TO_OUTGOING;
        break;
      case this.LINKING_TO_OUTGOING:
        if (nextOut.getEdgeRing() !== er)
          continue;
        incoming.setNextMin(nextOut);
        state = this.SCANNING_FOR_INCOMING;
        break;
      }
    }
    if (state === this.LINKING_TO_OUTGOING) {
      Assert.isTrue(firstOut !== null, 'found null for first outgoing dirEdge');
      Assert.isTrue(firstOut.getEdgeRing() === er,
          'unable to link last incoming dirEdge');
      incoming.setNextMin(firstOut);
    }
  };
  jsts.geomgraph.DirectedEdgeStar.prototype.linkAllDirectedEdges = function() {
    this.getEdges();
    // find first area edge (if any) to start linking at
    var prevOut = null;
    var firstIn = null;
    // link edges in CW order
    for (var i = this.edgeList.size() - 1; i >= 0; i--) {
      var nextOut = this.edgeList.get(i);
      var nextIn = nextOut.getSym();
      if (firstIn === null)
        firstIn = nextIn;
      if (prevOut !== null)
        nextIn.setNext(prevOut);
      // record outgoing edge, in order to link the last incoming edge
      prevOut = nextOut;
    }
    firstIn.setNext(prevOut);
  };

  /**
   * Traverse the star of edges, maintaing the current location in the result
   * area at this node (if any). If any L edges are found in the interior of the
   * result, mark them as covered.
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.findCoveredLineEdges = function() {
    // Since edges are stored in CCW order around the node,
    // as we move around the ring we move from the right to the left side of the
    // edge

    /**
     * Find first DirectedEdge of result area (if any). The interior of the
     * result is on the RHS of the edge, so the start location will be: -
     * INTERIOR if the edge is outgoing - EXTERIOR if the edge is incoming
     */
    var startLoc = Location.NONE;
    for (var it = this.iterator(); it.hasNext();) {
      var nextOut = it.next();
      var nextIn = nextOut.getSym();
      if (!nextOut.isLineEdge()) {
        if (nextOut.isInResult()) {
          startLoc = Location.INTERIOR;
          break;
        }
        if (nextIn.isInResult()) {
          startLoc = Location.EXTERIOR;
          break;
        }
      }
    }
    // no A edges found, so can't determine if L edges are covered or not
    if (startLoc === Location.NONE)
      return;

    /**
     * move around ring, keeping track of the current location (Interior or
     * Exterior) for the result area. If L edges are found, mark them as covered
     * if they are in the interior
     */
    var currLoc = startLoc;

    for (var it = this.iterator(); it.hasNext();) {
      var nextOut = it.next();
      var nextIn = nextOut.getSym();
      if (nextOut.isLineEdge()) {
        nextOut.getEdge().setCovered(currLoc === Location.INTERIOR);
      } else { // edge is an Area edge
        if (nextOut.isInResult())
          currLoc = Location.EXTERIOR;
        if (nextIn.isInResult())
          currLoc = Location.INTERIOR;
      }
    }
  };

  jsts.geomgraph.DirectedEdgeStar.prototype.computeDepths = function(de) {
    if (arguments.length === 2) {
      this.computeDepths2.apply(this, arguments);
      // NOTE: intentional, this function returns void
      return;
    }

    var edgeIndex = this.findIndex(de);
    var label = de.getLabel();
    var startDepth = de.getDepth(Position.LEFT);
    var targetLastDepth = de.getDepth(Position.RIGHT);
    // compute the depths from this edge up to the end of the edge array
    var nextDepth = this.computeDepths2(edgeIndex + 1, this.edgeList.size(),
        startDepth);
    // compute the depths for the initial part of the array
    var lastDepth = this.computeDepths2(0, edgeIndex, nextDepth);
    if (lastDepth != targetLastDepth)
      throw new jsts.error.TopologyError('depth mismatch at ' +
          de.getCoordinate());
  };

  /**
   * Compute the DirectedEdge depths for a subsequence of the edge array.
   *
   * @return the last depth assigned (from the R side of the last edge visited).
   * @private
   */
  jsts.geomgraph.DirectedEdgeStar.prototype.computeDepths2 = function(startIndex, endIndex,
      startDepth) {
    var currDepth = startDepth;
    for (var i = startIndex; i < endIndex; i++) {
      var nextDe = this.edgeList.get(i);
      var label = nextDe.getLabel();
      nextDe.setEdgeDepths(Position.RIGHT, currDepth);
      currDepth = nextDe.getDepth(Position.LEFT);
    }
    return currDepth;
  };

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/Label.js
 */

/**
 * Port source: com.vividsolutions.jts.geomgraph.EdgeRing r6
 *
 * @constructor
 */
jsts.geomgraph.EdgeRing = function(start, geometryFactory) {
  this.edges = [];
  this.pts = [];
  this.holes = [];
  this.label = new jsts.geomgraph.Label(jsts.geom.Location.NONE);

  this.geometryFactory = geometryFactory;

  if (start) {
    this.computePoints(start);
    this.computeRing();
  }
};

jsts.geomgraph.EdgeRing.prototype.startDe = null; // the directed edge which
                                                  // starts the list of edges
                                                  // for this EdgeRing
jsts.geomgraph.EdgeRing.prototype.maxNodeDegree = -1;
jsts.geomgraph.EdgeRing.prototype.edges = null; // the DirectedEdges making up
                                                // this EdgeRing
jsts.geomgraph.EdgeRing.prototype.pts = null;
jsts.geomgraph.EdgeRing.prototype.label = null; // label stores the locations of
                                                // each geometry on the face
                                                // surrounded by this ring
jsts.geomgraph.EdgeRing.prototype.ring = null; // the ring created for this
                                                // EdgeRing
jsts.geomgraph.EdgeRing.prototype._isHole = null;
jsts.geomgraph.EdgeRing.prototype.shell = null; // if non-null, the ring is a
                                                // hole and this EdgeRing is its
                                                // containing shell
jsts.geomgraph.EdgeRing.prototype.holes = null; // a list of EdgeRings which are
                                                // holes in this EdgeRing

jsts.geomgraph.EdgeRing.prototype.geometryFactory = null;

jsts.geomgraph.EdgeRing.prototype.isIsolated = function() {
  return (this.label.getGeometryCount() == 1);
};
jsts.geomgraph.EdgeRing.prototype.isHole = function() {
  return this._isHole;
};

jsts.geomgraph.EdgeRing.prototype.getCoordinate = function(i) {
  return this.pts[i];
};
jsts.geomgraph.EdgeRing.prototype.getLinearRing = function() { return this.ring; };
jsts.geomgraph.EdgeRing.prototype.getLabel = function() {
  return this.label;
};
jsts.geomgraph.EdgeRing.prototype.isShell = function() {
  return this.shell === null;
};
jsts.geomgraph.EdgeRing.prototype.getShell = function() {
  return this.shell;
};
jsts.geomgraph.EdgeRing.prototype.setShell = function(shell) {
  this.shell = shell;
  if (shell !== null)
    shell.addHole(this);
};
jsts.geomgraph.EdgeRing.prototype.addHole = function(ring) {
  this.holes.push(ring);
};

jsts.geomgraph.EdgeRing.prototype.toPolygon = function(geometryFactory) {
  var holeLR = [];
  for (var i = 0; i < this.holes.length; i++) {
    holeLR[i] = this.holes[i].getLinearRing();
  }
  var poly = this.geometryFactory.createPolygon(this.getLinearRing(), holeLR);
  return poly;
};
/**
 * Compute a LinearRing from the point list previously collected. Test if the
 * ring is a hole (i.e. if it is CCW) and set the hole flag accordingly.
 */
jsts.geomgraph.EdgeRing.prototype.computeRing = function() {
  if (this.ring !== null)
    return; // don't compute more than once
  var coord = [];
  for (var i = 0; i < this.pts.length; i++) {
    coord[i] = this.pts[i];
  }
  this.ring = this.geometryFactory.createLinearRing(coord);
  this._isHole = jsts.algorithm.CGAlgorithms.isCCW(this.ring.getCoordinates());
};
jsts.geomgraph.EdgeRing.prototype.getNext = function(de) {
  throw new jsts.error.AbstractInvocationError();
};
jsts.geomgraph.EdgeRing.prototype.setEdgeRing = function(de, er) {
  throw new jsts.error.AbstractInvocationError();
};
/**
 * Returns the list of DirectedEdges that make up this EdgeRing
 */
jsts.geomgraph.EdgeRing.prototype.getEdges = function() {
  return this.edges;
};

/**
 * Collect all the points from the DirectedEdges of this ring into a contiguous
 * list
 */
jsts.geomgraph.EdgeRing.prototype.computePoints = function(start) {
  this.startDe = start;
  var de = start;
  var isFirstEdge = true;
  do {
    if (de === null)
      throw new jsts.error.TopologyError('Found null DirectedEdge');
    if (de.getEdgeRing() === this)
      throw new jsts.error.TopologyError(
          'Directed Edge visited twice during ring-building at ' +
              de.getCoordinate());

    this.edges.push(de);
    var label = de.getLabel();
    jsts.util.Assert.isTrue(label.isArea());
    this.mergeLabel(label);
    this.addPoints(de.getEdge(), de.isForward(), isFirstEdge);
    isFirstEdge = false;
    this.setEdgeRing(de, this);
    de = this.getNext(de);
  } while (de !== this.startDe);
};

jsts.geomgraph.EdgeRing.prototype.getMaxNodeDegree = function() {
  if (this.maxNodeDegree < 0)
    this.computeMaxNodeDegree();
  return this.maxNodeDegree;
};

jsts.geomgraph.EdgeRing.prototype.computeMaxNodeDegree = function() {
  this.maxNodeDegree = 0;
  var de = this.startDe;
  do {
    var node = de.getNode();
    var degree = node.getEdges().getOutgoingDegree(this);
    if (degree > this.maxNodeDegree)
      this.maxNodeDegree = degree;
    de = this.getNext(de);
  } while (de !== this.startDe);
  this.maxNodeDegree *= 2;
};


jsts.geomgraph.EdgeRing.prototype.setInResult = function() {
  var de = this.startDe;
  do {
    de.getEdge().setInResult(true);
    de = de.getNext();
  } while (de != this.startDe);
};

jsts.geomgraph.EdgeRing.prototype.mergeLabel = function(deLabel) {
  this.mergeLabel2(deLabel, 0);
  this.mergeLabel2(deLabel, 1);
};
/**
 * Merge the RHS label from a DirectedEdge into the label for this EdgeRing. The
 * DirectedEdge label may be null. This is acceptable - it results from a node
 * which is NOT an intersection node between the Geometries (e.g. the end node
 * of a LinearRing). In this case the DirectedEdge label does not contribute any
 * information to the overall labelling, and is simply skipped.
 */
jsts.geomgraph.EdgeRing.prototype.mergeLabel2 = function(deLabel, geomIndex) {
  var loc = deLabel.getLocation(geomIndex, jsts.geomgraph.Position.RIGHT);
  // no information to be had from this label
  if (loc == jsts.geom.Location.NONE)
    return;
  // if there is no current RHS value, set it
  if (this.label.getLocation(geomIndex) === jsts.geom.Location.NONE) {
    this.label.setLocation(geomIndex, loc);
    return;
  }
};
jsts.geomgraph.EdgeRing.prototype.addPoints = function(edge, isForward,
    isFirstEdge) {
  var edgePts = edge.getCoordinates();
  if (isForward) {
    var startIndex = 1;
    if (isFirstEdge)
      startIndex = 0;
    for (var i = startIndex; i < edgePts.length; i++) {
      this.pts.push(edgePts[i]);
    }
  } else { // is backward
    var startIndex = edgePts.length - 2;
    if (isFirstEdge)
      startIndex = edgePts.length - 1;
    for (var i = startIndex; i >= 0; i--) {
      this.pts.push(edgePts[i]);
    }
  }
};

/**
 * This method will cause the ring to be computed. It will also check any holes,
 * if they have been assigned.
 */
jsts.geomgraph.EdgeRing.prototype.containsPoint = function(p) {
  var shell = this.getLinearRing();
  var env = shell.getEnvelopeInternal();
  if (!env.contains(p))
    return false;
  if (!jsts.algorithm.CGAlgorithms.isPointInRing(p, shell.getCoordinates()))
    return false;

  for (var i = 0; i < this.holes.length; i++) {
    var hole = this.holes[i];
    if (hole.containsPoint(p))
      return false;
  }
  return true;
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/EdgeRing.js
 */

/**
 * A ring of {@link Edge}s with the property that no node has degree greater
 * than 2. These are the form of rings required to represent polygons under the
 * OGC SFS spatial data model.
 *
 * Port source: com.vividsolutions.jts.operation.overlay.MinimalEdgeRing r6
 *
 * @extends jsts.geomgraph.EdgeRing
 * @constructor
 */
jsts.operation.overlay.MinimalEdgeRing = function(start, geometryFactory) {
  jsts.geomgraph.EdgeRing.call(this, start, geometryFactory);

};
jsts.operation.overlay.MinimalEdgeRing.prototype = new jsts.geomgraph.EdgeRing();
jsts.operation.overlay.MinimalEdgeRing.constructor = jsts.operation.overlay.MinimalEdgeRing;

jsts.operation.overlay.MinimalEdgeRing.prototype.getNext = function(de) {
  return de.getNextMin();
};
jsts.operation.overlay.MinimalEdgeRing.prototype.setEdgeRing = function(de, er) {
  de.setMinEdgeRing(er);
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * @requires jsts/geomgraph/EdgeRing.js
 */

/**
 * A ring of {@link DirectedEdge}s which may contain nodes of degree > 2.
 * A <tt>MaximalEdgeRing</tt> may represent two different spatial entities:
 * <ul>
 * <li>a single polygon possibly containing inversions (if the ring is oriented CW)
 * <li>a single hole possibly containing exversions (if the ring is oriented CCW)
 * </ul>
 * If the MaximalEdgeRing represents a polygon,
 * the interior of the polygon is strongly connected.
 * <p>
 * These are the form of rings used to define polygons under some spatial data models.
 * However, under the OGC SFS model, {@link MinimalEdgeRing}s are required.
 * A MaximalEdgeRing can be converted to a list of MinimalEdgeRings using the
 * {@link #buildMinimalRings() } method.
 *
 * @extends jsts.geomgraph.EdgeRing
 * @constructor
 */
jsts.operation.overlay.MaximalEdgeRing = function(start, geometryFactory) {
  jsts.geomgraph.EdgeRing.call(this, start, geometryFactory);

};
jsts.operation.overlay.MaximalEdgeRing.prototype = new jsts.geomgraph.EdgeRing();
jsts.operation.overlay.MaximalEdgeRing.constructor = jsts.operation.overlay.MaximalEdgeRing;


jsts.operation.overlay.MaximalEdgeRing.prototype.getNext = function(de)
  {
    return de.getNext();
  };
jsts.operation.overlay.MaximalEdgeRing.prototype.setEdgeRing = function(de, er)
  {
    de.setEdgeRing(er);
  };

  /**
   * For all nodes in this EdgeRing,
   * link the DirectedEdges at the node to form minimalEdgeRings
   */
jsts.operation.overlay.MaximalEdgeRing.prototype.linkDirectedEdgesForMinimalEdgeRings = function()
  {
    var de = this.startDe;
    do {
      var node = de.getNode();
      node.getEdges().linkMinimalDirectedEdges(this);
      de = de.getNext();
    } while (de != this.startDe);
  };

jsts.operation.overlay.MaximalEdgeRing.prototype.buildMinimalRings = function()
  {
    var minEdgeRings = [];
    var de = this.startDe;
    do {
      if (de.getMinEdgeRing() === null) {
        var minEr = new jsts.operation.overlay.MinimalEdgeRing(de, this.geometryFactory);
        minEdgeRings.push(minEr);
      }
      de = de.getNext();
    } while (de != this.startDe);
    return minEdgeRings;
  };


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * This class tests that the interior of an area {@link Geometry} (
 * {@link Polygon} or {@link MultiPolygon} ) is connected. This can happen if:
 * <ul>
 * <li>a shell self-intersects
 * <li>one or more holes form a connected chain touching a shell at two
 * different points
 * <li>one or more holes form a ring around a subset of the interior
 * </ul>
 * If a disconnected situation is found the location of the problem is recorded.
 *
 * @version 1.7
 * @constructor
 */
jsts.operation.valid.ConnectedInteriorTester = function(geomGraph) {
  this.geomGraph = geomGraph;
  this.geometryFactory = new jsts.geom.GeometryFactory();

  // save a coordinate for any disconnected interior found
  // the coordinate will be somewhere on the ring surrounding the disconnected
  // interior
  this.disconnectedRingcoord = null;
};

/**
 * @param {jsts.geom.Coordinate[]}
 *          coord A coordinate array.
 * @param {jsts.geom.Coordinate}
 *          pt
 * @return {jsts.geom.Coordinate}
 */
jsts.operation.valid.ConnectedInteriorTester.findDifferentPoint = function(
    coord, pt) {
  var i = 0, il = coord.length;
  for (i; i < il; i++) {
    if (!coord[i].equals(pt))
      return coord[i];
  }
  return null;
};

/**
 * Returns the coordinate for a disconnected interior
 *
 * @return {jsts.geom.Coordinate} the coordinate.
 */
jsts.operation.valid.ConnectedInteriorTester.prototype.getCoordinate = function() {
  return this.disconnectedRingcoord;
};

/**
 * @return {Boolean}
 */
jsts.operation.valid.ConnectedInteriorTester.prototype.isInteriorsConnected = function() {
  // node the edges, in case holes touch the shell
  var splitEdges = new javascript.util.ArrayList();
  this.geomGraph.computeSplitEdges(splitEdges);

  // form the edges into rings
  var graph = new jsts.geomgraph.PlanarGraph(
      new jsts.operation.overlay.OverlayNodeFactory());
  graph.addEdges(splitEdges);

  this.setInteriorEdgesInResult(graph);
  graph.linkResultDirectedEdges();

  var edgeRings = this.buildEdgeRings(graph.getEdgeEnds());

  /**
   *
   * Mark all the edges for the edgeRings corresponding to the shells
   *
   * of the input polygons. Note only ONE ring gets marked for each shell.
   *
   */

  this.visitShellInteriors(this.geomGraph.getGeometry(), graph);


  /**
   *
   * If there are any unvisited shell edges
   *
   * (i.e. a ring which is not a hole and which has the interior
   *
   * of the parent area on the RHS)
   *
   * this means that one or more holes must have split the interior of the
   *
   * polygon into at least two pieces. The polygon is thus invalid.
   *
   */

  return !this.hasUnvisitedShellEdge(edgeRings);
};

jsts.operation.valid.ConnectedInteriorTester.prototype.setInteriorEdgesInResult = function(
    graph) {
  var it = graph.getEdgeEnds().iterator(), de;

  while (it.hasNext()) {
    de = it.next();
    if (de.getLabel().getLocation(0, jsts.geomgraph.Position.RIGHT) == jsts.geom.Location.INTERIOR) {
      de.setInResult(true);
    }
  }
};

/**
 *
 * Form DirectedEdges in graph into Minimal EdgeRings. (Minimal Edgerings must
 * be used, because only they are guaranteed to provide a correct isHole
 * computation)
 *
 */
jsts.operation.valid.ConnectedInteriorTester.prototype.buildEdgeRings = function(
    dirEdges) {
  var edgeRings = new javascript.util.ArrayList();
  for (var it = dirEdges.iterator(); it.hasNext();) {

    var de = it.next();

    // if this edge has not yet been processed
    if (de.isInResult()

    && de.getEdgeRing() == null) {

      var er = new jsts.operation.overlay.MaximalEdgeRing(de,
          this.geometryFactory);
      er.linkDirectedEdgesForMinimalEdgeRings();

      var minEdgeRings = er.buildMinimalRings();

      var i = 0, il = minEdgeRings.length;
      for (i; i < il; i++) {
        edgeRings.add(minEdgeRings[i]);
      }
    }
  }

  return edgeRings;
};

/**
 *
 * Mark all the edges for the edgeRings corresponding to the shells of the input
 * polygons. Only ONE ring gets marked for each shell - if there are others
 * which remain unmarked this indicates a disconnected interior.
 *
 */
jsts.operation.valid.ConnectedInteriorTester.prototype.visitShellInteriors = function(
    g, graph) {
  if (g instanceof jsts.geom.Polygon) {
    var p = g;
    this.visitInteriorRing(p.getExteriorRing(), graph);
  }

  if (g instanceof jsts.geom.MultiPolygon) {
    var mp = g;
    for (var i = 0; i < mp.getNumGeometries(); i++) {
      var p = mp.getGeometryN(i);
      this.visitInteriorRing(p.getExteriorRing(), graph);
    }
  }
};

jsts.operation.valid.ConnectedInteriorTester.prototype.visitInteriorRing = function(
    ring, graph) {

  var pts = ring.getCoordinates();
  var pt0 = pts[0];

  /**
   *
   * Find first point in coord list different to initial point. Need special
   * check since the first point may be repeated.
   *
   */
  var pt1 = jsts.operation.valid.ConnectedInteriorTester.findDifferentPoint(
      pts, pt0);
  var e = graph.findEdgeInSameDirection(pt0, pt1);
  var de = graph.findEdgeEnd(e);
  var intDe = null;

  if (de.getLabel().getLocation(0, jsts.geomgraph.Position.RIGHT) == jsts.geom.Location.INTERIOR) {
    intDe = de;
  } else if (de.getSym().getLabel().getLocation(0,
      jsts.geomgraph.Position.RIGHT) == jsts.geom.Location.INTERIOR) {
    intDe = de.getSym();
  }

  this.visitLinkedDirectedEdges(intDe);
};

jsts.operation.valid.ConnectedInteriorTester.prototype.visitLinkedDirectedEdges = function(
    start) {
  var startDe = start;
  var de = start;
  do {
    de.setVisited(true);
    de = de.getNext();
  } while (de != startDe);
};

/**
 *
 * Check if any shell ring has an unvisited edge. A shell ring is a ring which
 * is not a hole and which has the interior of the parent area on the RHS. (Note
 * that there may be non-hole rings with the interior on the LHS, since the
 * interior of holes will also be polygonized into CW rings by the
 * linkAllDirectedEdges() step)
 *
 * @return {Boolean} true if there is an unvisited edge in a non-hole ring.
 */

jsts.operation.valid.ConnectedInteriorTester.prototype.hasUnvisitedShellEdge = function(
    edgeRings) {
  for (var i = 0; i < edgeRings.size(); i++) {
    var er = edgeRings.get(i);

    // don't check hole rings
    if (er.isHole()) {
      continue;
    }

    var edges = er.getEdges();
    var de = edges[0];

    // don't check CW rings which are holes
    // (MD - this check may now be irrelevant)
    if (de.getLabel().getLocation(0, jsts.geomgraph.Position.RIGHT) != jsts.geom.Location.INTERIOR) {
      continue;
    }

    /**
     *
     * the edgeRing is CW ring which surrounds the INT of the area, so check all
     *
     * edges have been visited. If any are unvisited, this is a disconnected
     * part of the interior
     *
     */

    for (var j = 0; j < edges.length; j++) {
      de = edges[j];
      if (!de.isVisited()) {
        disconnectedRingcoord = de.getCoordinate();
        return true;
      }
    }
  }
  return false;
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Implements the algorithms required to compute the <code>isValid()</code>
 * method for {@link Geometry}s. See the documentation for the various geometry
 * types for a specification of validity.
 *
 * @version 1.7
 * @constructor
 */

jsts.operation.valid.IsValidOp = function(parentGeometry) {
  this.parentGeometry = parentGeometry;
  this.isSelfTouchingRingFormingHoleValid = false;
  this.validErr = null;
};

/**
 * Tests whether a {@link Geometry} is valid.
 *
 * @param geom
 *          the Geometry to test.
 * @return true if the geometry is valid.
 */
jsts.operation.valid.IsValidOp.isValid = function(arg) {
  if (arguments[0] instanceof jsts.geom.Coordinate) {
    if (isNaN(arg.x)) {
      return false;
    }
    if (!isFinite(arg.x) && !isNaN(arg.x)) {
      return false;
    }
    if (isNaN(arg.y)) {
      return false;
    }
    if (!isFinite(arg.y) && !isNaN(arg.y)) {
      return false;
    }
    return true;
  } else {
    var isValidOp = new jsts.operation.valid.IsValidOp(arg);
    return isValidOp.isValid();
  }
};

/**
 * Find a point from the list of testCoords that is NOT a node in the edge for
 * the list of searchCoords
 *
 * @return the point found, or <code>null</code> if none found.
 */
jsts.operation.valid.IsValidOp.findPtNotNode = function(testCoords, searchRing,
    graph) {
  // find edge corresponding to searchRing.
  var searchEdge = graph.findEdge(searchRing);
  // find a point in the testCoords which is not a node of the searchRing
  var eiList = searchEdge.getEdgeIntersectionList();
  // somewhat inefficient - is there a better way? (Use a node map, for
  // instance?)
  for (var i = 0; i < testCoords.length; i++) {
    var pt = testCoords[i];
    if (!eiList.isIntersection(pt)) {
      return pt;
    }
  }
  return null;
};

/**
 * Sets whether polygons using <b>Self-Touching Rings</b> to form holes are
 * reported as valid. If this flag is set, the following Self-Touching
 * conditions are treated as being valid:
 * <ul>
 * <li>the shell ring self-touches to create a hole touching the shell
 * <li>a hole ring self-touches to create two holes touching at a point
 * </ul>
 * <p>
 * The default (following the OGC SFS standard) is that this condition is <b>not</b>
 * valid (<code>false</code>).
 * <p>
 * This does not affect whether Self-Touching Rings disconnecting the polygon
 * interior are considered valid (these are considered to be <b>invalid</b>
 * under the SFS, and many other spatial models as well). This includes
 * "bow-tie" shells, which self-touch at a single point causing the interior to
 * be disconnected, and "C-shaped" holes which self-touch at a single point
 * causing an island to be formed.
 *
 * @param isValid
 *          states whether geometry with this condition is valid.
 */
jsts.operation.valid.IsValidOp.prototype.setSelfTouchingRingFormingHoleValid = function(
    isValid) {
  this.isSelfTouchingRingFormingHoleValid = isValid;
};

jsts.operation.valid.IsValidOp.prototype.isValid = function() {
  this.checkValid(this.parentGeometry);
  return this.validErr == null;
};

jsts.operation.valid.IsValidOp.prototype.getValidationError = function() {
  this.checkValid(this.parentGeometry);
  return this.validErr;
};

jsts.operation.valid.IsValidOp.prototype.checkValid = function(g) {
  this.validErr = null;

  // empty geometries are always valid!
  if (g.isEmpty()) {
    return;
  }

  if (g instanceof jsts.geom.Point) {
    this.checkValidPoint(g);
  } else if (g instanceof jsts.geom.MultiPoint) {
    this.checkValidMultiPoint(g);
    // LineString also handles LinearRings
  } else if (g instanceof jsts.geom.LinearRing) {
    this.checkValidLinearRing(g);
  } else if (g instanceof jsts.geom.LineString) {
    this.checkValidLineString(g);
  } else if (g instanceof jsts.geom.Polygon) {
    this.checkValidPolygon(g);
  } else if (g instanceof jsts.geom.MultiPolygon) {
    this.checkValidMultiPolygon(g);
  } else if (g instanceof jsts.geom.GeometryCollection) {
    this.checkValidGeometryCollection(g);
  } else {
    throw g.constructor;
  }
};

/**
 * Checks validity of a Point.
 */
jsts.operation.valid.IsValidOp.prototype.checkValidPoint = function(g) {
  this.checkInvalidCoordinates(g.getCoordinates());
};
/**
 * Checks validity of a MultiPoint.
 */
jsts.operation.valid.IsValidOp.prototype.checkValidMultiPoint = function(g) {
  this.checkInvalidCoordinates(g.getCoordinates());
};

/**
 * Checks validity of a LineString. Almost anything goes for linestrings!
 */
jsts.operation.valid.IsValidOp.prototype.checkValidLineString = function(g) {
  this.checkInvalidCoordinates(g.getCoordinates());
  if (this.validErr != null) {
    return;
  }
  var graph = new jsts.geomgraph.GeometryGraph(0, g);
  this.checkTooFewPoints(graph);
};
/**
 * Checks validity of a LinearRing.
 */
jsts.operation.valid.IsValidOp.prototype.checkValidLinearRing = function(g) {
  this.checkInvalidCoordinates(g.getCoordinates());
  if (this.validErr != null) {
    return;
  }
  this.checkClosedRing(g);
  if (this.validErr != null) {
    return;
  }
  var graph = new jsts.geomgraph.GeometryGraph(0, g);
  this.checkTooFewPoints(graph);
  if (this.validErr != null) {
    return;
  }
  var li = new jsts.algorithm.RobustLineIntersector();
  graph.computeSelfNodes(li, true);
  this.checkNoSelfIntersectingRings(graph);
};

/**
 * Checks the validity of a polygon. Sets the validErr flag.
 */
jsts.operation.valid.IsValidOp.prototype.checkValidPolygon = function(g) {
  this.checkInvalidCoordinates(g);
  if (this.validErr != null) {
    return;
  }
  this.checkClosedRings(g);
  if (this.validErr != null) {
    return;
  }

  var graph = new jsts.geomgraph.GeometryGraph(0, g);

  this.checkTooFewPoints(graph);
  if (this.validErr != null) {
    return;
  }
  this.checkConsistentArea(graph);
  if (this.validErr != null) {
    return;
  }

  if (!this.isSelfTouchingRingFormingHoleValid) {
    this.checkNoSelfIntersectingRings(graph);
    if (this.validErr != null) {
      return;
    }
  }
  this.checkHolesInShell(g, graph);
  if (this.validErr != null) {
    return;
  }
  // SLOWcheckHolesNotNested(g);
  this.checkHolesNotNested(g, graph);
  if (this.validErr != null) {
    return;
  }
  this.checkConnectedInteriors(graph);
};

jsts.operation.valid.IsValidOp.prototype.checkValidMultiPolygon = function(g) {
  var il = g.getNumGeometries();
  for (var i = 0; i < il; i++) {
    var p = g.getGeometryN(i);
    this.checkInvalidCoordinates(p);
    if (this.validErr != null) {
      return;
    }
    this.checkClosedRings(p);
    if (this.validErr != null) {
      return;
    }
  }
  // Add this
  var graph = new jsts.geomgraph.GeometryGraph(0, g);

  this.checkTooFewPoints(graph);
  if (this.validErr != null) {
    return;
  }
  this.checkConsistentArea(graph);
  if (this.validErr != null) {
    return;
  }
  if (!this.isSelfTouchingRingFormingHoleValid) {
    this.checkNoSelfIntersectingRings(graph);
    if (this.validErr != null) {
      return;
    }
  }
  for (var i = 0; i < g.getNumGeometries(); i++) {
    var p = g.getGeometryN(i);
    this.checkHolesInShell(p, graph);
    if (this.validErr != null) {
      return;
    }
  }
  for (var i = 0; i < g.getNumGeometries(); i++) {
    var p = g.getGeometryN(i);
    this.checkHolesNotNested(p, graph);
    if (this.validErr != null) {
      return;
    }
  }
  this.checkShellsNotNested(g, graph);
  if (this.validErr != null) {
    return;
  }
  this.checkConnectedInteriors(graph);
};

jsts.operation.valid.IsValidOp.prototype.checkValidGeometryCollection = function(
    gc) {
  for (var i = 0; i < gc.getNumGeometries(); i++) {
    var g = gc.getGeometryN(i);
    this.checkValid(g);
    if (this.validErr != null) {
      return;
    }
  }
};

jsts.operation.valid.IsValidOp.prototype.checkInvalidCoordinates = function(
    arg) {
  if (arg instanceof jsts.geom.Polygon) {
    var poly = arg;
    this.checkInvalidCoordinates(poly.getExteriorRing().getCoordinates());
    if (this.validErr != null) {
      return;
    }
    for (var i = 0; i < poly.getNumInteriorRing(); i++) {
      this.checkInvalidCoordinates(poly.getInteriorRingN(i).getCoordinates());
      if (this.validErr != null) {
        return;
      }
    }
  } else {
    var coords = arg;
    for (var i = 0; i < coords.length; i++) {
      if (!jsts.operation.valid.IsValidOp.isValid(coords[i])) {
        this.validErr = new jsts.operation.valid.TopologyValidationError(
            jsts.operation.valid.TopologyValidationError.INVALID_COORDINATE,
            coords[i]);
        return;
      }
    }
  }
};

jsts.operation.valid.IsValidOp.prototype.checkClosedRings = function(poly) {
  // checkClosedRing((LinearRing) poly.getExteriorRing());
  this.checkClosedRing(poly.getExteriorRing());
  if (this.validErr != null) {
    return;
  }
  for (var i = 0; i < poly.getNumInteriorRing(); i++) {
    // checkClosedRing((LinearRing) poly.getInteriorRingN(i));
    this.checkClosedRing(poly.getInteriorRingN(i));
    if (this.validErr != null) {
      return;
    }
  }
};

jsts.operation.valid.IsValidOp.prototype.checkClosedRing = function(ring) {
  if (!ring.isClosed()) {
    var pt = null;
    if (ring.getNumPoints() >= 1) {
      pt = ring.getCoordinateN(0);
    }
    this.validErr = new jsts.operation.valid.TopologyValidationError(
        jsts.operation.valid.TopologyValidationError.RING_NOT_CLOSED, pt);
  }
};

jsts.operation.valid.IsValidOp.prototype.checkTooFewPoints = function(graph) {
  if (graph.hasTooFewPoints) {
    this.validErr = new jsts.operation.valid.TopologyValidationError(
        jsts.operation.valid.TopologyValidationError.TOO_FEW_POINTS, graph
            .getInvalidPoint());
    return;
  }
};

/**
 * Checks that the arrangement of edges in a polygonal geometry graph forms a
 * consistent area.
 *
 * @param graph
 *
 * @see ConsistentAreaTester
 */
jsts.operation.valid.IsValidOp.prototype.checkConsistentArea = function(graph) {
  var cat = new jsts.operation.valid.ConsistentAreaTester(graph);
  var isValidArea = cat.isNodeConsistentArea();
  if (!isValidArea) {
    this.validErr = new jsts.operation.valid.TopologyValidationError(
        jsts.operation.valid.TopologyValidationError.SELF_INTERSECTION, cat
            .getInvalidPoint());
    return;
  }
  if (cat.hasDuplicateRings()) {
    this.validErr = new jsts.operation.valid.TopologyValidationError(
        jsts.operation.valid.TopologyValidationError.DUPLICATE_RINGS, cat
            .getInvalidPoint());
  }
};

/**
 * Check that there is no ring which self-intersects (except of course at its
 * endpoints). This is required by OGC topology rules (but not by other models
 * such as ESRI SDE, which allow inverted shells and exverted holes).
 *
 * @param graph
 *          the topology graph of the geometry.
 */
jsts.operation.valid.IsValidOp.prototype.checkNoSelfIntersectingRings = function(
    graph) {
  for (var i = graph.getEdgeIterator(); i.hasNext();) {
    var e = i.next();
    this.checkNoSelfIntersectingRing(e.getEdgeIntersectionList());
    if (this.validErr != null) {
      return;
    }
  }
};

/**
 * Check that a ring does not self-intersect, except at its endpoints. Algorithm
 * is to count the number of times each node along edge occurs. If any occur
 * more than once, that must be a self-intersection.
 */
jsts.operation.valid.IsValidOp.prototype.checkNoSelfIntersectingRing = function(
    eiList) {
  var nodeSet = [];
  var isFirst = true;
  for (var i = eiList.iterator(); i.hasNext();) {
    var ei = i.next();
    if (isFirst) {
      isFirst = false;
      continue;
    }
    if (nodeSet.indexOf(ei.coord) >= 0) {
      this.validErr = new jsts.operation.valid.TopologyValidationError(
          jsts.operation.valid.TopologyValidationError.RING_SELF_INTERSECTION,
          ei.coord);
      return;
    } else {
      nodeSet.push(ei.coord);
    }
  }
};

/**
 * Tests that each hole is inside the polygon shell. This routine assumes that
 * the holes have previously been tested to ensure that all vertices lie on the
 * shell oon the same side of it (i.e that the hole rings do not cross the shell
 * ring). In other words, this test is only correct if the ConsistentArea test
 * is passed first. Given this, a simple point-in-polygon test of a single point
 * in the hole can be used, provided the point is chosen such that it does not
 * lie on the shell.
 *
 * @param p
 *          the polygon to be tested for hole inclusion.
 * @param graph
 *          a GeometryGraph incorporating the polygon.
 */
jsts.operation.valid.IsValidOp.prototype.checkHolesInShell = function(p, graph) {
  var shell = p.getExteriorRing();

  // PointInRing pir = new SimplePointInRing(shell);
  // PointInRing pir = new SIRtreePointInRing(shell);

  var pir = new jsts.algorithm.MCPointInRing(shell);

  for (var i = 0; i < p.getNumInteriorRing(); i++) {

    var hole = p.getInteriorRingN(i); // Cast?
    var holePt = jsts.operation.valid.IsValidOp.findPtNotNode(hole.getCoordinates(), shell, graph);
    /**
     * If no non-node hole vertex can be found, the hole must split the polygon
     * into disconnected interiors. This will be caught by a subsequent check.
     */
    if (holePt == null) {
      return;
    }

    var outside = !pir.isInside(holePt);
    if (outside) {
      this.validErr = new jsts.operation.valid.TopologyValidationError(
          jsts.operation.valid.TopologyValidationError.HOLE_OUTSIDE_SHELL,
          holePt);
      return;
    }
  }
};

/**
 * Tests that no hole is nested inside another hole. This routine assumes that
 * the holes are disjoint. To ensure this, holes have previously been tested to
 * ensure that:
 * <ul>
 * <li>they do not partially overlap (checked by
 * <code>checkRelateConsistency</code>)
 * <li>they are not identical (checked by <code>checkRelateConsistency</code>)
 * </ul>
 */
jsts.operation.valid.IsValidOp.prototype.checkHolesNotNested = function(p,
    graph) {
  var nestedTester = new jsts.operation.valid.IndexedNestedRingTester(graph);
  // SimpleNestedRingTester nestedTester = new SimpleNestedRingTester(arg[0]);
  // SweeplineNestedRingTester nestedTester = new
  // SweeplineNestedRingTester(arg[0]);

  for (var i = 0; i < p.getNumInteriorRing(); i++) {
    var innerHole = p.getInteriorRingN(i);
    nestedTester.add(innerHole);
  }
  var isNonNested = nestedTester.isNonNested();
  if (!isNonNested) {
    this.validErr = new jsts.operation.valid.TopologyValidationError(
        jsts.operation.valid.TopologyValidationError.NESTED_HOLES, nestedTester
            .getNestedPoint());
  }
};

/**
 * Tests that no element polygon is wholly in the interior of another element
 * polygon.
 * <p>
 * Preconditions:
 * <ul>
 * <li>shells do not partially overlap
 * <li>shells do not touch along an edge
 * <li>no duplicate rings exist
 * </ul>
 * This routine relies on the fact that while polygon shells may touch at one or
 * more vertices, they cannot touch at ALL vertices.
 */
jsts.operation.valid.IsValidOp.prototype.checkShellsNotNested = function(mp,
    graph) {
  for (var i = 0; i < mp.getNumGeometries(); i++) {
    var p = mp.getGeometryN(i);
    var shell = p.getExteriorRing();
    for (var j = 0; j < mp.getNumGeometries(); j++) {
      if (i == j) {
        continue;
      }
      var p2 = mp.getGeometryN(j);
      this.checkShellNotNested(shell, p2, graph);
      if (this.validErr != null) {
        return;
      }
    }
  }
};

/**
 * Check if a shell is incorrectly nested within a polygon. This is the case if
 * the shell is inside the polygon shell, but not inside a polygon hole. (If the
 * shell is inside a polygon hole, the nesting is valid.)
 * <p>
 * The algorithm used relies on the fact that the rings must be properly
 * contained. E.g. they cannot partially overlap (this has been previously
 * checked by <code>checkRelateConsistency</code> )
 */
jsts.operation.valid.IsValidOp.prototype.checkShellNotNested = function(shell,
    p, graph) {
  var shellPts = shell.getCoordinates();
  // test if shell is inside polygon shell
  var polyShell = p.getExteriorRing();
  var polyPts = polyShell.getCoordinates();
  var shellPt = jsts.operation.valid.IsValidOp.findPtNotNode(shellPts, polyShell, graph);
  // if no point could be found, we can assume that the shell is outside the
  // polygon
  if (shellPt == null) {
    return;
  }
  var insidePolyShell = jsts.algorithm.CGAlgorithms.isPointInRing(shellPt, polyPts);
  if (!insidePolyShell) {
    return;
  }

  // if no holes, this is an error!
  if (p.getNumInteriorRing() <= 0) {
    this.validErr = new jsts.operation.valid.TopologyValidationError(
        jsts.operation.valid.TopologyValidationError.NESTED_SHELLS, shellPt);
    return;
  }

  /**
   * Check if the shell is inside one of the holes. This is the case if one of
   * the calls to checkShellInsideHole returns a null coordinate. Otherwise, the
   * shell is not properly contained in a hole, which is an error.
   */
  var badNestedPt = null;
  for (var i = 0; i < p.getNumInteriorRing(); i++) {
    var hole = p.getInteriorRingN(i);
    badNestedPt = this.checkShellInsideHole(shell, hole, graph);
    if (badNestedPt == null) {
      return;
    }
  }
  this.validErr = new jsts.operation.valid.TopologyValidationError(
      jsts.operation.valid.TopologyValidationError.NESTED_SHELLS, badNestedPt);
};

/**
 * This routine checks to see if a shell is properly contained in a hole. It
 * assumes that the edges of the shell and hole do not properly intersect.
 *
 * @return <code>null</code> if the shell is properly contained, or a
 *         Coordinate which is not inside the hole if it is not.
 *
 */
jsts.operation.valid.IsValidOp.prototype.checkShellInsideHole = function(shell,
    hole, graph) {
  var shellPts = shell.getCoordinates();
  var holePts = hole.getCoordinates();
  // TODO: improve performance of this - by sorting pointlists for instance?
  var shellPt = jsts.operation.valid.IsValidOp.findPtNotNode(shellPts, hole, graph);
  // if point is on shell but not hole, check that the shell is inside the
  // hole
  if (shellPt != null) {
    var insideHole = jsts.algorithm.CGAlgorithms.isPointInRing(shellPt, holePts);
    if (!insideHole) {
      return shellPt;
    }
  }
  var holePt = jsts.operation.valid.IsValidOp.findPtNotNode(holePts, shell, graph);
  // if point is on hole but not shell, check that the hole is outside the
  // shell
  if (holePt != null) {
    var insideShell = jsts.algorithm.CGAlgorithms.isPointInRing(holePt, shellPts);
    if (insideShell) {
      return holePt;
    }
    return null;
  }
  jsts.util.Assert
      .shouldNeverReachHere('points in shell and hole appear to be equal');
  return null;
};

jsts.operation.valid.IsValidOp.prototype.checkConnectedInteriors = function(
    graph) {
  var cit = new jsts.operation.valid.ConnectedInteriorTester(graph);
  if (!cit.isInteriorsConnected()) {
    this.validErr = new jsts.operation.valid.TopologyValidationError(
        jsts.operation.valid.TopologyValidationError.DISCONNECTED_INTERIOR, cit
            .getCoordinate());
  }

};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */
(function() {

  /**
   * @requires jsts/geom/Geometry.js
   * @requires jsts/geom/Dimension.js
   */

  var Dimension = jsts.geom.Dimension;

  /**
   * @extends jsts.geom.Geometry
   * @constructor
   */
  jsts.geom.LineString = function(points, factory) {
    this.factory = factory;
    this.points = points || [];
  };

  jsts.geom.LineString.prototype = new jsts.geom.Geometry();
  jsts.geom.LineString.constructor = jsts.geom.LineString;

  /**
   * @type {jsts.geom.Coordinate[]}
   * @private
   */
  jsts.geom.LineString.prototype.points = null;

  /**
   * @return {jsts.geom.Coordinate[]} this LineString's internal coordinate
   *         array.
   */
  jsts.geom.LineString.prototype.getCoordinates = function() {
    return this.points;
  };

  jsts.geom.LineString.prototype.getCoordinateSequence = function() {
    return this.points;
  };


  /**
   * @return {jsts.geom.Coordinate} The n'th coordinate of this
   *         jsts.geom.LineString.
   * @param {int}
   *          n index.
   */
  jsts.geom.LineString.prototype.getCoordinateN = function(n) {
    return this.points[n];
  };


  /**
   * @return {jsts.geom.Coordinate} The first coordinate of this LineString or
   *         null if empty.
   */
  jsts.geom.LineString.prototype.getCoordinate = function() {
    if (this.isEmpty()) {
      return null;
    }
    return this.getCoordinateN(0);
  };


  /**
   * @return {number} LineStrings are always 1-dimensional.
   */
  jsts.geom.LineString.prototype.getDimension = function() {
    return 1;
  };


  /**
   * @return {number} dimension of the boundary of this jsts.geom.LineString.
   */
  jsts.geom.LineString.prototype.getBoundaryDimension = function() {
    if (this.isClosed()) {
      return Dimension.FALSE;
    }
    return 0;
  };


  /**
   * @return {Boolean} true if empty.
   */
  jsts.geom.LineString.prototype.isEmpty = function() {
    return this.points.length === 0;
  };

  jsts.geom.LineString.prototype.getNumPoints = function() {
    return this.points.length;
  };

  jsts.geom.LineString.prototype.getPointN = function(n) {
    return this.getFactory().createPoint(this.points[n]);
  };


  jsts.geom.LineString.prototype.getStartPoint = function() {
    if (this.isEmpty()) {
      return null;
    }
    return this.getPointN(0);
  };

  jsts.geom.LineString.prototype.getEndPoint = function() {
    if (this.isEmpty()) {
      return null;
    }
    return this.getPointN(this.getNumPoints() - 1);
  };


  /**
   * @return {Boolean} true if LineString is Closed.
   */
  jsts.geom.LineString.prototype.isClosed = function() {
    if (this.isEmpty()) {
      return false;
    }
    return this.getCoordinateN(0).equals2D(
        this.getCoordinateN(this.points.length - 1));
  };


  /**
   * @return {Boolean} true if LineString is a Ring.
   */
  jsts.geom.LineString.prototype.isRing = function() {
    return this.isClosed() && this.isSimple();
  };


  /**
   * @return {String} String representation of LineString type.
   */
  jsts.geom.LineString.prototype.getGeometryType = function() {
    return 'LineString';
  };


  /**
   * Returns the length of this <code>LineString</code>
   *
   * @return the length of the linestring.
   */
  jsts.geom.LineString.prototype.getLength = function() {
    return jsts.algorithm.CGAlgorithms.computeLength(this.points);
  };

  /**
   * Gets the boundary of this geometry. The boundary of a lineal geometry is
   * always a zero-dimensional geometry (which may be empty).
   *
   * @return {Geometry} the boundary geometry.
   * @see Geometry#getBoundary
   */
  jsts.geom.LineString.prototype.getBoundary = function() {
    return (new jsts.operation.BoundaryOp(this)).getBoundary();
  };


  jsts.geom.LineString.prototype.computeEnvelopeInternal = function() {
    if (this.isEmpty()) {
      return new jsts.geom.Envelope();
    }

    var env = new jsts.geom.Envelope();
    this.points.forEach(function(component) {
      env.expandToInclude(component);
    });

    return env;
  };


  /**
   * @param {Geometry}
   *          other Geometry to compare this LineString to.
   * @param {double}
   *          tolerance Tolerance.
   * @return {Boolean} true if equal.
   */
  jsts.geom.LineString.prototype.equalsExact = function(other, tolerance) {
    if (!this.isEquivalentClass(other)) {
      return false;
    }

    if (this.points.length !== other.points.length) {
      return false;
    }

    if (this.isEmpty() && other.isEmpty()) {
      return true;
    }

    return this.points
        .reduce(function(equal, point, i) {
          return equal &&
              jsts.geom.Geometry.prototype.equal(point, other.points[i],
                  tolerance);
        });
  };

  jsts.geom.LineString.prototype.isEquivalentClass = function(other) {
    return other instanceof jsts.geom.LineString;
  };

  jsts.geom.LineString.prototype.compareToSameClass = function(o) {
    var line = o;
    // MD - optimized implementation
    var i = 0, il = this.points.length;
    var j = 0, jl = line.points.length;
    while (i < il && j < jl) {
      var comparison = this.points[i].compareTo(line.points[j]);
      if (comparison !== 0) {
        return comparison;
      }
      i++;
      j++;
    }
    if (i < il) {
      return 1;
    }
    if (j < jl) {
      return -1;
    }
    return 0;
  };

  jsts.geom.LineString.prototype.apply = function(filter) {
    if (filter instanceof jsts.geom.GeometryFilter ||
        filter instanceof jsts.geom.GeometryComponentFilter) {
      filter.filter(this);
    } else if (filter instanceof jsts.geom.CoordinateFilter) {
      for (var i = 0, len = this.points.length; i < len; i++) {
        filter.filter(this.points[i]);
      }
    } else if (filter instanceof jsts.geom.CoordinateSequenceFilter) {
      this.apply2.apply(this, arguments);
    }
  };

  jsts.geom.LineString.prototype.apply2 = function(filter) {
    if (this.points.length === 0)
      return;
    for (var i = 0; i < this.points.length; i++) {
      filter.filter(this.points, i);
      if (filter.isDone())
        break;
    }
    if (filter.isGeometryChanged()) {
      // TODO: call geometryChanged(); when ported
    }
  };

  jsts.geom.LineString.prototype.clone = function() {
    var points = [];

    for (var i = 0, len = this.points.length; i < len; i++) {
      points.push(this.points[i].clone());
    }

    return this.factory.createLineString(points);
  };

  /**
   * Normalizes a LineString. A normalized linestring has the first point which
   * is not equal to it's reflected point less than the reflected point.
   */
  jsts.geom.LineString.prototype.normalize = function() {
    var i, il, j, ci, cj, len;

    len = this.points.length;
    il = parseInt(len / 2);

    for (i = 0; i < il; i++) {
      j = len - 1 - i;
      // skip equal points on both ends
      ci = this.points[i];
      cj = this.points[j];
      if (!ci.equals(cj)) {
        if (ci.compareTo(cj) > 0) {
          this.points.reverse();
        }
        return;
      }
    }
  };

  jsts.geom.LineString.prototype.CLASS_NAME = 'jsts.geom.LineString';

})();

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */
(function() {

  /**
   * Models an OGC SFS <code>LinearRing</code>. A LinearRing is a LineString
   * which is both closed and simple. In other words, the first and last
   * coordinate in the ring must be equal, and the interior of the ring must not
   * self-intersect. Either orientation of the ring is allowed.
   * <p>
   * A ring must have either 0 or 4 or more points. The first and last points
   * must be equal (in 2D). If these conditions are not met, the constructors
   * throw an {@link IllegalArgumentException}
   *
   * @requires jsts/geom/LineString.js
   */

  /**
   * @extends jsts.geom.LineString
   * @constructor
   */
  jsts.geom.LinearRing = function(points, factory) {
    jsts.geom.LineString.apply(this, arguments);
  };
  jsts.geom.LinearRing.prototype = new jsts.geom.LineString();
  jsts.geom.LinearRing.constructor = jsts.geom.LinearRing;


  /**
   * Returns <code>Dimension.FALSE</code>, since by definition LinearRings do
   * not have a boundary.
   *
   * @return {int} Dimension.FALSE.
   */
  jsts.geom.LinearRing.prototype.getBoundaryDimension = function() {
    return jsts.geom.Dimension.FALSE;
  };


  /**
   * Returns <code>true</code>, since by definition LinearRings are always
   * simple.
   *
   * @return {Boolean} <code>true.</code>
   *
   * @see Geometry#isSimple
   */
  jsts.geom.LinearRing.prototype.isSimple = function() {
    return true;
  };


  /**
   * @return {String} String representation of LinearRing type.
   */
  jsts.geom.LinearRing.prototype.getGeometryType = function() {
    return 'LinearRing';
  };

  jsts.geom.LinearRing.MINIMUM_VALID_SIZE = 4;

  jsts.geom.LinearRing.prototype.CLASS_NAME = 'jsts.geom.LinearRing';

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

(function() {

  /**
   * Represents a linear polygon, which may include holes. The shell and holes
   * of the polygon are represented by {@link LinearRing}s. In a valid polygon,
   * holes may touch the shell or other holes at a single point. However, no
   * sequence of touching holes may split the polygon into two pieces. The
   * orientation of the rings in the polygon does not matter.
   *
   * The shell and holes must conform to the assertions specified in the <A
   * HREF="http://www.opengis.org/techno/specs.htm">OpenGIS Simple Features
   * Specification for SQL</A>.
   */


  /**
   * @requires jsts/geom/Geometry.js
   */

  /**
   * @extends {jsts.geom.Geometry}
   * @constructor
   */
  jsts.geom.Polygon = function(shell, holes, factory) {
    this.shell = shell || factory.createLinearRing(null);
    this.holes = holes || [];
    this.factory = factory;
  };

  jsts.geom.Polygon.prototype = new jsts.geom.Geometry();
  jsts.geom.Polygon.constructor = jsts.geom.Polygon;

  jsts.geom.Polygon.prototype.getCoordinate = function() {
    return this.shell.getCoordinate();
  };

  jsts.geom.Polygon.prototype.getCoordinates = function() {
    if (this.isEmpty()) {
      return [];
    }
    var coordinates = [];
    var k = -1;
    var shellCoordinates = this.shell.getCoordinates();
    for (var x = 0; x < shellCoordinates.length; x++) {
      k++;
      coordinates[k] = shellCoordinates[x];
    }
    for (var i = 0; i < this.holes.length; i++) {
      var childCoordinates = this.holes[i].getCoordinates();
      for (var j = 0; j < childCoordinates.length; j++) {
        k++;
        coordinates[k] = childCoordinates[j];
      }
    }
    return coordinates;
  };

  /**
   * @return {number}
   */
  jsts.geom.Polygon.prototype.getNumPoints = function() {
    var numPoints = this.shell.getNumPoints();
    for (var i = 0; i < this.holes.length; i++) {
      numPoints += this.holes[i].getNumPoints();
    }
    return numPoints;
  };

  /**
   * @return {boolean}
   */
  jsts.geom.Polygon.prototype.isEmpty = function() {
    return this.shell.isEmpty();
  };

  jsts.geom.Polygon.prototype.getExteriorRing = function() {
    return this.shell;
  };

  jsts.geom.Polygon.prototype.getInteriorRingN = function(n) {
    return this.holes[n];
  };

  jsts.geom.Polygon.prototype.getNumInteriorRing = function() {
    return this.holes.length;
  };

  /**
   * Returns the area of this <code>Polygon</code>
   *
   * @return the area of the polygon.
   */
  jsts.geom.Polygon.prototype.getArea = function() {
    var area = 0.0;
    area += Math.abs(jsts.algorithm.CGAlgorithms.signedArea(this.shell
        .getCoordinateSequence()));
    for (var i = 0; i < this.holes.length; i++) {
      area -= Math.abs(jsts.algorithm.CGAlgorithms.signedArea(this.holes[i]
          .getCoordinateSequence()));
    }
    return area;
  };

  /**
   * Returns the perimeter of this <code>Polygon</code>
   *
   * @return the perimeter of the polygon.
   */
  jsts.geom.Polygon.prototype.getLength = function() {
    var len = 0.0;
    len += this.shell.getLength();
    for (var i = 0; i < this.holes.length; i++) {
      len += this.holes[i].getLength();
    }
    return len;
  };

  /**
   * Computes the boundary of this geometry
   *
   * @return {Geometry} a lineal geometry (which may be empty).
   * @see Geometry#getBoundary
   */
  jsts.geom.Polygon.prototype.getBoundary = function() {
    if (this.isEmpty()) {
      return this.getFactory().createMultiLineString(null);
    }
    var rings = [];
    rings[0] = this.shell.clone();
    for (var i = 0, len = this.holes.length; i < len; i++) {
      rings[i + 1] = this.holes[i].clone();
    }
    // create LineString or MultiLineString as appropriate
    if (rings.length <= 1)
      return rings[0];
    return this.getFactory().createMultiLineString(rings);
  };

  jsts.geom.Polygon.prototype.computeEnvelopeInternal = function() {
    return this.shell.getEnvelopeInternal();
  };

  jsts.geom.Polygon.prototype.getDimension = function() {
    return 2;
  };

  jsts.geom.Polygon.prototype.getBoundaryDimension = function() {
    return 1;
  };


  /**
   * @param {Geometry}
   *          other
   * @param {number}
   *          tolerance
   * @return {boolean}
   */
  jsts.geom.Polygon.prototype.equalsExact = function(other, tolerance) {
    if (!this.isEquivalentClass(other)) {
      return false;
    }
    if (this.isEmpty() && other.isEmpty()) {
      return true;
    }
    if (this.isEmpty() !== other.isEmpty()) {
      return false;
    }

    if (!this.shell.equalsExact(other.shell, tolerance)) {
      return false;
    }
    if (this.holes.length !== other.holes.length) {
      return false;
    }
    if (this.holes.length !== other.holes.length) {
      return false;
    }
    for (var i = 0; i < this.holes.length; i++) {
      if (!(this.holes[i]).equalsExact(other.holes[i], tolerance)) {
        return false;
      }
    }
    return true;
  };

  jsts.geom.Polygon.prototype.compareToSameClass = function(o) {
    return this.shell.compareToSameClass(o.shell);
  };

  jsts.geom.Polygon.prototype.apply = function(filter) {
    if (filter instanceof jsts.geom.GeometryComponentFilter) {
      filter.filter(this);
      this.shell.apply(filter);
      for (var i = 0, len = this.holes.length; i < len; i++) {
        this.holes[i].apply(filter);
      }
    } else if (filter instanceof jsts.geom.GeometryFilter) {
      filter.filter(this);
    } else if (filter instanceof jsts.geom.CoordinateFilter) {
      this.shell.apply(filter);
      for (var i = 0, len = this.holes.length; i < len; i++) {
        this.holes[i].apply(filter);
      }
    } else if (filter instanceof jsts.geom.CoordinateSequenceFilter) {
      this.apply2.apply(this, arguments);
    }
  };

  jsts.geom.Polygon.prototype.apply2 = function(filter) {
    this.shell.apply(filter);
    if (!filter.isDone()) {
      for (var i = 0; i < this.holes.length; i++) {
        this.holes[i].apply(filter);
        if (filter.isDone())
          break;
      }
    }
    if (filter.isGeometryChanged()) {
      // TODO: call this.geometryChanged(); when ported
    }
  };

  /**
   * Creates and returns a full copy of this {@link Polygon} object. (including
   * all coordinates contained by it).
   *
   * @return a clone of this instance.
   */
  jsts.geom.Polygon.prototype.clone = function() {
    var holes = [];

    for (var i = 0, len = this.holes.length; i < len; i++) {
      holes.push(this.holes[i].clone());
    }

    return this.factory.createPolygon(this.shell.clone(), holes);
  };

  jsts.geom.Polygon.prototype.normalize = function() {
    this.normalize2(this.shell, true);
    for (var i = 0, len = this.holes.length; i < len; i++) {
      this.normalize2(this.holes[i], false);
    }
    // TODO: might need to supply comparison function
    this.holes.sort();
  };

  /**
   * @private
   */
  jsts.geom.Polygon.prototype.normalize2 = function(ring, clockwise) {
    if (ring.isEmpty()) {
      return;
    }
    var uniqueCoordinates = ring.points.slice(0, ring.points.length - 1);
    var minCoordinate = jsts.geom.CoordinateArrays.minCoordinate(ring.points);
    jsts.geom.CoordinateArrays.scroll(uniqueCoordinates, minCoordinate);
    ring.points = uniqueCoordinates.concat();
    ring.points[uniqueCoordinates.length] = uniqueCoordinates[0];
    if (jsts.algorithm.CGAlgorithms.isCCW(ring.points) === clockwise) {
      ring.points.reverse();
    }
  };

  /**
   * @return {String} String representation of Polygon type.
   */
  jsts.geom.Polygon.prototype.getGeometryType = function() {
    return 'Polygon';
  };

  jsts.geom.Polygon.prototype.CLASS_NAME = 'jsts.geom.Polygon';

})();

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Supplies a set of utility methods for building Geometry objects from lists
 * of Coordinates.
 *
 * Note that the factory constructor methods do <b>not</b> change the input
 * coordinates in any way.
 *
 * In particular, they are not rounded to the supplied <tt>PrecisionModel</tt>.
 * It is assumed that input Coordinates meet the given precision.
 */

/**
 * @requires jsts/geom/PrecisionModel.js
 */

/**
 * Constructs a GeometryFactory that generates Geometries having a floating
 * PrecisionModel and a spatial-reference ID of 0.
 *
 * @constructor
 */
jsts.geom.GeometryFactory = function(precisionModel) {
  this.precisionModel = precisionModel || new jsts.geom.PrecisionModel();
};

jsts.geom.GeometryFactory.prototype.precisionModel = null;

jsts.geom.GeometryFactory.prototype.getPrecisionModel = function() {
  return this.precisionModel;
};


/**
 * Creates a Point using the given Coordinate; a null Coordinate will create an
 * empty Geometry.
 *
 * @param {Coordinate}
 *          coordinate Coordinate to base this Point on.
 * @return {Point} A new Point.
 */
jsts.geom.GeometryFactory.prototype.createPoint = function(coordinate) {
  var point = new jsts.geom.Point(coordinate, this);

  return point;
};


/**
 * Creates a LineString using the given Coordinates; a null or empty array will
 * create an empty LineString. Consecutive points must not be equal.
 *
 * @param {Coordinate[]}
 *          coordinates an array without null elements, or an empty array, or
 *          null.
 * @return {LineString} A new LineString.
 */
jsts.geom.GeometryFactory.prototype.createLineString = function(coordinates) {
  var lineString = new jsts.geom.LineString(coordinates, this);

  return lineString;
};


/**
 * Creates a LinearRing using the given Coordinates; a null or empty array will
 * create an empty LinearRing. The points must form a closed and simple
 * linestring. Consecutive points must not be equal.
 *
 * @param {Coordinate[]}
 *          coordinates an array without null elements, or an empty array, or
 *          null.
 * @return {LinearRing} A new LinearRing.
 */
jsts.geom.GeometryFactory.prototype.createLinearRing = function(coordinates) {
  var linearRing = new jsts.geom.LinearRing(coordinates, this);

  return linearRing;
};


/**
 * Constructs a <code>Polygon</code> with the given exterior boundary and
 * interior boundaries.
 *
 * @param {LinearRing}
 *          shell the outer boundary of the new <code>Polygon</code>, or
 *          <code>null</code> or an empty <code>LinearRing</code> if the
 *          empty geometry is to be created.
 * @param {LinearRing[]}
 *          holes the inner boundaries of the new <code>Polygon</code>, or
 *          <code>null</code> or empty <code>LinearRing</code> s if the
 *          empty geometry is to be created.
 * @return {Polygon} A new Polygon.
 */
jsts.geom.GeometryFactory.prototype.createPolygon = function(shell, holes) {
  var polygon = new jsts.geom.Polygon(shell, holes, this);

  return polygon;
};


jsts.geom.GeometryFactory.prototype.createMultiPoint = function(points) {
  if (points && points[0] instanceof jsts.geom.Coordinate) {
    var converted = [];
    var i;
    for (i = 0; i < points.length; i++) {
      converted.push(this.createPoint(points[i]));
    }
    points = converted;
  }

  return new jsts.geom.MultiPoint(points, this);
};

jsts.geom.GeometryFactory.prototype.createMultiLineString = function(
    lineStrings) {
  return new jsts.geom.MultiLineString(lineStrings, this);
};

jsts.geom.GeometryFactory.prototype.createMultiPolygon = function(polygons) {
  return new jsts.geom.MultiPolygon(polygons, this);
};


/**
 * Build an appropriate <code>Geometry</code>, <code>MultiGeometry</code>,
 * or <code>GeometryCollection</code> to contain the <code>Geometry</code>s
 * in it. For example:<br>
 *
 * <ul>
 * <li> If <code>geomList</code> contains a single <code>Polygon</code>,
 * the <code>Polygon</code> is returned.
 * <li> If <code>geomList</code> contains several <code>Polygon</code>s, a
 * <code>MultiPolygon</code> is returned.
 * <li> If <code>geomList</code> contains some <code>Polygon</code>s and
 * some <code>LineString</code>s, a <code>GeometryCollection</code> is
 * returned.
 * <li> If <code>geomList</code> is empty, an empty
 * <code>GeometryCollection</code> is returned
 * </ul>
 *
 * Note that this method does not "flatten" Geometries in the input, and hence
 * if any MultiGeometries are contained in the input a GeometryCollection
 * containing them will be returned.
 *
 * @param geomList
 *          the <code>Geometry</code>s to combine.
 * @return {Geometry} a <code>Geometry</code> of the "smallest", "most
 *         type-specific" class that can contain the elements of
 *         <code>geomList</code> .
 */
jsts.geom.GeometryFactory.prototype.buildGeometry = function(geomList) {

  /**
   * Determine some facts about the geometries in the list
   */
  var geomClass = null;
  var isHeterogeneous = false;
  var hasGeometryCollection = false;
  for (var i = geomList.iterator(); i.hasNext();) {
    var geom = i.next();

    var partClass = geom.CLASS_NAME;

    if (geomClass === null) {
      geomClass = partClass;
    }
    if (!(partClass === geomClass)) {
      isHeterogeneous = true;
    }
    if (geom.isGeometryCollectionBase())
      hasGeometryCollection = true;
  }

  /**
   * Now construct an appropriate geometry to return
   */
  // for the empty geometry, return an empty GeometryCollection
  if (geomClass === null) {
    return this.createGeometryCollection(null);
  }
  if (isHeterogeneous || hasGeometryCollection) {
    return this.createGeometryCollection(geomList.toArray());
  }
  // at this point we know the collection is hetereogenous.
  // Determine the type of the result from the first Geometry in the list
  // this should always return a geometry, since otherwise an empty collection
  // would have already been returned
  var geom0 = geomList.get(0);
  var isCollection = geomList.size() > 1;
  if (isCollection) {
    if (geom0 instanceof jsts.geom.Polygon) {
      return this.createMultiPolygon(geomList.toArray());
    } else if (geom0 instanceof jsts.geom.LineString) {
      return this.createMultiLineString(geomList.toArray());
    } else if (geom0 instanceof jsts.geom.Point) {
      return this.createMultiPoint(geomList.toArray());
    }
    jsts.util.Assert.shouldNeverReachHere('Unhandled class: ' + geom0);
  }
  return geom0;
};

jsts.geom.GeometryFactory.prototype.createGeometryCollection = function(
    geometries) {
  return new jsts.geom.GeometryCollection(geometries, this);
};

/**
 * Creates a {@link Geometry} with the same extent as the given envelope. The
 * Geometry returned is guaranteed to be valid. To provide this behaviour, the
 * following cases occur:
 * <p>
 * If the <code>Envelope</code> is:
 * <ul>
 * <li>null : returns an empty {@link Point}
 * <li>a point : returns a non-empty {@link Point}
 * <li>a line : returns a two-point {@link LineString}
 * <li>a rectangle : returns a {@link Polygon}> whose points are (minx, miny),
 * (minx, maxy), (maxx, maxy), (maxx, miny), (minx, miny).
 * </ul>
 *
 * @param {jsts.geom.Envelope}
 *          envelope the <code>Envelope</code> to convert.
 * @return {jsts.geom.Geometry} an empty <code>Point</code> (for null
 *         <code>Envelope</code>s), a <code>Point</code> (when min x = max
 *         x and min y = max y) or a <code>Polygon</code> (in all other cases).
 */
jsts.geom.GeometryFactory.prototype.toGeometry = function(envelope) {
  // null envelope - return empty point geometry
  if (envelope.isNull()) {
    return this.createPoint(null);
  }

  // point?
  if (envelope.getMinX() === envelope.getMaxX() &&
      envelope.getMinY() === envelope.getMaxY()) {
    return this.createPoint(new jsts.geom.Coordinate(envelope.getMinX(),
        envelope.getMinY()));
  }

  // vertical or horizontal line?
  if (envelope.getMinX() === envelope.getMaxX() ||
      envelope.getMinY() === envelope.getMaxY()) {
    return this.createLineString([
        new jsts.geom.Coordinate(envelope.getMinX(), envelope.getMinY()),
        new jsts.geom.Coordinate(envelope.getMaxX(), envelope.getMaxY())]);
  }

  // create a CW ring for the polygon
  return this.createPolygon(this.createLinearRing([
      new jsts.geom.Coordinate(envelope.getMinX(), envelope.getMinY()),
      new jsts.geom.Coordinate(envelope.getMinX(), envelope.getMaxY()),
      new jsts.geom.Coordinate(envelope.getMaxX(), envelope.getMaxY()),
      new jsts.geom.Coordinate(envelope.getMaxX(), envelope.getMinY()),
      new jsts.geom.Coordinate(envelope.getMinX(), envelope.getMinY())]), null);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Constructs a new list from an array of Coordinates, allowing caller to
 * specify if repeated points are to be removed.
 *
 * @param {Array.<jsts.geom.Coordinate>}
 *          coord the array of coordinates to load into the list.
 * @param {boolean}
 *          allowRepeated if <code>false</code>, repeated points are removed.
 *
 * @constructor
 */
jsts.geom.CoordinateList = function(coord, allowRepeated) {
  javascript.util.ArrayList.apply(this, arguments);

  allowRepeated = (allowRepeated === undefined) ? true : allowRepeated;

  if (coord !== undefined) {
    this.add(coord, allowRepeated);
  }
};

jsts.geom.CoordinateList.prototype = new javascript.util.ArrayList();


// simulate overloaded methods...
jsts.geom.CoordinateList.prototype.add = function() {
    if (arguments.length>1) {
        return this.addCoordinates.apply(this, arguments);
    } else {
        return javascript.util.ArrayList.prototype.add.apply(this, arguments);
    }
};

/**
 * Adds an array of coordinates to the list.
 *
 * @param {Array.<jsts.geom.Coordinate>}
 *          coord The coordinates.
 * @param {boolean}
 *          allowRepeated if set to false, repeated coordinates are collapsed.
 * @param {boolean}
 *          direction if false, the array is added in reverse order.
 * @return {boolean} true (as by general collection contract).
 */
jsts.geom.CoordinateList.prototype.addCoordinates = function(coord, allowRepeated,
    direction) {
  if (coord instanceof jsts.geom.Coordinate) {
    return this.addCoordinate.apply(this, arguments);
  } else if (typeof coord === 'number') {
    return this.insertCoordinate.apply(this, arguments);
  }

  direction = direction || true;

  if (direction) {
    for (var i = 0; i < coord.length; i++) {
      this.addCoordinate(coord[i], allowRepeated);
    }
  } else {
    for (var i = coord.length - 1; i >= 0; i--) {
      this.addCoordinate(coord[i], allowRepeated);
    }
  }
  return true;
};


/**
 * Adds a coordinate to the end of the list.
 *
 * @param {Coordinate}
 *          coord The coordinates.
 * @param {boolean}
 *          allowRepeated if set to false, repeated coordinates are collapsed.
 */
jsts.geom.CoordinateList.prototype.addCoordinate = function(coord,
    allowRepeated) {
  // don't add duplicate coordinates
  if (!allowRepeated) {
    if (this.size() >= 1) {
      var last = this.get(this.size() - 1);
      if (last.equals2D(coord)) return;
    }
  }
  this.add(coord);
};

/**
 * Inserts a coordinate at the specified place in the list
 *
 * @param {Number}
 *          index The index where to insert the coordinate.
 * @param {Coordinate}
 *          coord The coordinate.
 * @param {boolean}
 *          allowRepeated if set to false, repeated coordinates are collapsed.
 */
jsts.geom.CoordinateList.prototype.insertCoordinate = function(index, coord,
    allowRepeated) {
  // don't add duplicate coordinates
  if (!allowRepeated) {
    var before = index > 0 ? index - 1 : -1;
    if (before !== -1 && this.get(before).equals2D(coord)) {
      return;
    }

    var after = index < this.size() - 1 ? index + 1 : -1;
    if (after !== -1 && this.get(after).equals2D(coord)) {
      return;
    }
  }
  this.array.splice(index, 0, coord);
};

/**
 * Ensure this coordList is a ring, by adding the start point if necessary
 */
jsts.geom.CoordinateList.prototype.closeRing = function() {
  if (this.size() > 0) {
    this.addCoordinate(new jsts.geom.Coordinate(this.get(0)), false);
  }
};

/**
 * Creates a standard javascript-array from the contents of this list
 *
 * @return {Array}
 *            the created array.
 */
jsts.geom.CoordinateList.prototype.toArray = function() {
  var i, il, arr;
  i = 0, il = this.size(), arr = [];

  for (i; i < il; i++) {
    arr[i] = this.get(i);
  }

  return arr;
};

/** Returns the Coordinates in this collection.
*
* @return the coordinates.
*/
jsts.geom.CoordinateList.prototype.toCoordinateArray = function() {
  return this.toArray();
};

// TODO: port rest?


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * @constructor
 */
jsts.geom.CoordinateArrays = function() {
  throw new jsts.error.AbstractMethodInvocationError();
};

jsts.geom.CoordinateArrays.copyDeep = function () {
    if (arguments.length === 1) {
        return jsts.geom.CoordinateArrays.copyDeep1(arguments[0]);
    } else if (arguments.length === 5) {
        jsts.geom.CoordinateArrays.copyDeep2(
            arguments[0], arguments[1], arguments[2], arguments[3], arguments[4]);
    }
};

/**
 * Creates a deep copy of the argument {@link Coordinate} array.
 *
 * @param {jsts.geom.Coordinate[]} coordinates an array of Coordinates
 * @return {jsts.geom.Coordinate[]} a deep copy of the input
 */
jsts.geom.CoordinateArrays.copyDeep1 = function (coordinates) {
    var copy = [];
    for (var i = 0; i < coordinates.length; i++) {
        copy[i] = new jsts.geom.Coordinate(coordinates[i]);
    }
    return copy;
};

/**
 * Creates a deep copy of a given section of a source {@link Coordinate} array
 * into a destination Coordinate array.
 * The destination array must be an appropriate size to receive
 * the copied coordinates.
 *
 * @param {jsts.geom.Coordinate[]} src an array of Coordinates
 * @param {number} srcStart the index to start copying from
 * @param {jsts.geom.Coordinate[]} dest the
 * @param {number} destStart the destination index to start copying to
 * @param {number} length the number of items to copy
 */
jsts.geom.CoordinateArrays.copyDeep2 = function (src, srcStart, dest, destStart, length) {
    for (var i = 0; i < length; i++) {
        dest[destStart + i] = new jsts.geom.Coordinate(src[srcStart + i]);
    }
};

/**
 * If the coordinate array argument has repeated points, constructs a new array
 * containing no repeated points. Otherwise, returns the argument.
 *
 * @return {Coordinate[]}
 * @see #hasRepeatedPoints(Coordinate[])
 */
jsts.geom.CoordinateArrays.removeRepeatedPoints = function(coord) {
  var coordList;
  if (!this.hasRepeatedPoints(coord)) {
    return coord;
  }
  coordList = new jsts.geom.CoordinateList(coord, false);
  return coordList.toCoordinateArray();
};


/**
 * Returns whether #equals returns true for any two consecutive Coordinates in
 * the given array.
 *
 * @param {Coordinate[]}
 *          coord
 * @return {boolean}
 */
jsts.geom.CoordinateArrays.hasRepeatedPoints = function(coord) {
  var i;
  for (i = 1; i < coord.length; i++) {
    if (coord[i - 1].equals(coord[i])) {
      return true;
    }
  }
  return false;
};

/**
 * Finds a point in a list of points which is not contained in another list of points
 * @param testPts the {@link Coordinate} s to test.
 * @param pts an array of {@link Coordinate} s to test the input points against.
 * @return a {@link Coordinate} from <code>testPts</code> which is not in <code>pts</code>, '
 * or <code>null.</code>
 */
jsts.geom.CoordinateArrays.ptNotInList = function(testPts, pts) {
  for (var i = 0; i < testPts.length; i++) {
    var testPt = testPts[i];
    if (jsts.geom.CoordinateArrays.indexOf(testPt, pts) < 0)
        return testPt;
  }
  return null;
};

/**
 * Determines which orientation of the {@link Coordinate} array is (overall)
 * increasing. In other words, determines which end of the array is "smaller"
 * (using the standard ordering on {@link Coordinate}). Returns an integer
 * indicating the increasing direction. If the sequence is a palindrome, it is
 * defined to be oriented in a positive direction.
 *
 * @param pts
 *          the array of Coordinates to test.
 * @return <code>1</code> if the array is smaller at the start or is a
 *         palindrome, <code>-1</code> if smaller at the end.
 */
jsts.geom.CoordinateArrays.increasingDirection = function(pts) {
  for (var i = 0; i < parseInt(pts.length / 2); i++) {
    var j = pts.length - 1 - i;
    // skip equal points on both ends
    var comp = pts[i].compareTo(pts[j]);
    if (comp != 0)
      return comp;
  }
  // array must be a palindrome - defined to be in positive direction
  return 1;
};

/**
 * Returns the minimum coordinate, using the usual lexicographic comparison.
 *
 * @param coordinates
 *          the array to search.
 * @return the minimum coordinate in the array, found using
 *         <code>compareTo.</code>
 * @see Coordinate#compareTo(Object)
 */
jsts.geom.CoordinateArrays.minCoordinate = function(coordinates) {
  var minCoord = null;
  for (var i = 0; i < coordinates.length; i++) {
    if (minCoord === null || minCoord.compareTo(coordinates[i]) > 0) {
      minCoord = coordinates[i];
    }
  }
  return minCoord;
};

/**
 * Shifts the positions of the coordinates until <code>firstCoordinate</code>
 * is first.
 *
 * @param coordinates
 *          the array to rearrange.
 * @param firstCoordinate
 *          the coordinate to make first.
 */
jsts.geom.CoordinateArrays.scroll = function(coordinates, firstCoordinate) {
  var i = jsts.geom.CoordinateArrays.indexOf(firstCoordinate, coordinates);
  if (i < 0)
    return;

  var newCoordinates = coordinates.slice(i).concat(coordinates.slice(0, i));
  for (i = 0; i < newCoordinates.length; i++) {
    coordinates[i] = newCoordinates[i];
  }
};

/**
 * Returns the index of <code>coordinate</code> in <code>coordinates</code>.
 * The first position is 0; the second, 1; etc.
 *
 * @param coordinate
 *          the <code>Coordinate</code> to search for.
 * @param coordinates
 *          the array to search.
 * @return the position of <code>coordinate</code>, or -1 if it is not found.
 */
jsts.geom.CoordinateArrays.indexOf = function(coordinate, coordinates) {
  for (var i = 0; i < coordinates.length; i++) {
    if (coordinate.equals(coordinates[i])) {
      return i;
    }
  }
  return -1;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

jsts.io.OpenLayersParser = function(geometryFactory) {
  this.geometryFactory = geometryFactory || new jsts.geom.GeometryFactory();
};

/**
 * @param geometry
 *          {OpenLayers.Geometry}
 * @return {jsts.geom.Geometry}
 */
jsts.io.OpenLayersParser.prototype.read = function(geometry) {
  if (geometry.CLASS_NAME === 'OpenLayers.Geometry.Point') {
    return this.convertFromPoint(geometry);
  } else if (geometry.CLASS_NAME === 'OpenLayers.Geometry.LineString') {
    return this.convertFromLineString(geometry);
  } else if (geometry.CLASS_NAME === 'OpenLayers.Geometry.LinearRing') {
    return this.convertFromLinearRing(geometry);
  } else if (geometry.CLASS_NAME === 'OpenLayers.Geometry.Polygon') {
    return this.convertFromPolygon(geometry);
  } else if (geometry.CLASS_NAME === 'OpenLayers.Geometry.MultiPoint') {
    return this.convertFromMultiPoint(geometry);
  } else if (geometry.CLASS_NAME === 'OpenLayers.Geometry.MultiLineString') {
    return this.convertFromMultiLineString(geometry);
  } else if (geometry.CLASS_NAME === 'OpenLayers.Geometry.MultiPolygon') {
    return this.convertFromMultiPolygon(geometry);
  } else if (geometry.CLASS_NAME === 'OpenLayers.Geometry.Collection') {
    return this.convertFromCollection(geometry);
  }
};

jsts.io.OpenLayersParser.prototype.convertFromPoint = function(point) {
  return this.geometryFactory.createPoint(new jsts.geom.Coordinate(point.x,
      point.y));
};

jsts.io.OpenLayersParser.prototype.convertFromLineString = function(lineString) {
  var i;
  var coordinates = [];

  for (i = 0; i < lineString.components.length; i++) {
    coordinates.push(new jsts.geom.Coordinate(lineString.components[i].x,
        lineString.components[i].y));
  }

  return this.geometryFactory.createLineString(coordinates);
};

jsts.io.OpenLayersParser.prototype.convertFromLinearRing = function(linearRing) {
  var i;
  var coordinates = [];

  for (i = 0; i < linearRing.components.length; i++) {
    coordinates.push(new jsts.geom.Coordinate(linearRing.components[i].x,
        linearRing.components[i].y));
  }

  return this.geometryFactory.createLinearRing(coordinates);
};

jsts.io.OpenLayersParser.prototype.convertFromPolygon = function(polygon) {
  var i;
  var shell = null;
  var holes = [];

  for (i = 0; i < polygon.components.length; i++) {
    var linearRing = this.convertFromLinearRing(polygon.components[i]);

    if (i === 0) {
      shell = linearRing;
    } else {
      holes.push(linearRing);
    }
  }

  return this.geometryFactory.createPolygon(shell, holes);
};

jsts.io.OpenLayersParser.prototype.convertFromMultiPoint = function(multiPoint) {
  var i;
  var points = [];

  for (i = 0; i < multiPoint.components.length; i++) {
    points.push(this.convertFromPoint(multiPoint.components[i]));
  }

  return this.geometryFactory.createMultiPoint(points);
};

jsts.io.OpenLayersParser.prototype.convertFromMultiLineString = function(
    multiLineString) {
  var i;
  var lineStrings = [];

  for (i = 0; i < multiLineString.components.length; i++) {
    lineStrings.push(this.convertFromLineString(multiLineString.components[i]));
  }

  return this.geometryFactory.createMultiLineString(lineStrings);
};

jsts.io.OpenLayersParser.prototype.convertFromMultiPolygon = function(
    multiPolygon) {
  var i;
  var polygons = [];

  for (i = 0; i < multiPolygon.components.length; i++) {
    polygons.push(this.convertFromPolygon(multiPolygon.components[i]));
  }

  return this.geometryFactory.createMultiPolygon(polygons);
};

jsts.io.OpenLayersParser.prototype.convertFromCollection = function(collection) {
  var i;
  var geometries = [];

  for (i = 0; i < collection.components.length; i++) {
    geometries.push(this.read(collection.components[i]));
  }

  return this.geometryFactory.createGeometryCollection(geometries);
};

/**
 * @param geometry
 *          {jsts.geom.Geometry}
 * @return {OpenLayers.Geometry}
 */
jsts.io.OpenLayersParser.prototype.write = function(geometry) {
  if (geometry.CLASS_NAME === 'jsts.geom.Point') {
    return this.convertToPoint(geometry.coordinate);
  } else if (geometry.CLASS_NAME === 'jsts.geom.LineString') {
    return this.convertToLineString(geometry);
  } else if (geometry.CLASS_NAME === 'jsts.geom.LinearRing') {
    return this.convertToLinearRing(geometry);
  } else if (geometry.CLASS_NAME === 'jsts.geom.Polygon') {
    return this.convertToPolygon(geometry);
  } else if (geometry.CLASS_NAME === 'jsts.geom.MultiPoint') {
    return this.convertToMultiPoint(geometry);
  } else if (geometry.CLASS_NAME === 'jsts.geom.MultiLineString') {
    return this.convertToMultiLineString(geometry);
  } else if (geometry.CLASS_NAME === 'jsts.geom.MultiPolygon') {
    return this.convertToMultiPolygon(geometry);
  } else if (geometry.CLASS_NAME === 'jsts.geom.GeometryCollection') {
    return this.convertToCollection(geometry);
  }
};

jsts.io.OpenLayersParser.prototype.convertToPoint = function(coordinate) {
  return new OpenLayers.Geometry.Point(coordinate.x, coordinate.y);
};

jsts.io.OpenLayersParser.prototype.convertToLineString = function(lineString) {
  var i;
  var points = [];

  for (i = 0; i < lineString.points.length; i++) {
    var coordinate = lineString.points[i];
    points.push(this.convertToPoint(coordinate));
  }

  return new OpenLayers.Geometry.LineString(points);
};

jsts.io.OpenLayersParser.prototype.convertToLinearRing = function(linearRing) {
  var i;
  var points = [];

  for (i = 0; i < linearRing.points.length; i++) {
    var coordinate = linearRing.points[i];
    points.push(this.convertToPoint(coordinate));
  }

  return new OpenLayers.Geometry.LinearRing(points);
};

jsts.io.OpenLayersParser.prototype.convertToPolygon = function(polygon) {
  var i;
  var rings = [];

  rings.push(this.convertToLinearRing(polygon.shell));

  for (i = 0; i < polygon.holes.length; i++) {
    var ring = polygon.holes[i];
    rings.push(this.convertToLinearRing(ring));
  }

  return new OpenLayers.Geometry.Polygon(rings);
};

jsts.io.OpenLayersParser.prototype.convertToMultiPoint = function(multiPoint) {
  var i;
  var points = [];

  for (i = 0; i < multiPoint.geometries.length; i++) {
    var coordinate = multiPoint.geometries[i].coordinate;
    points.push(new OpenLayers.Geometry.Point(coordinate.x, coordinate.y));
  }

  return new OpenLayers.Geometry.MultiPoint(points);
};

jsts.io.OpenLayersParser.prototype.convertToMultiLineString = function(
    multiLineString) {
  var i;
  var lineStrings = [];

  for (i = 0; i < multiLineString.geometries.length; i++) {
    lineStrings.push(this.convertToLineString(multiLineString.geometries[i]));
  }

  return new OpenLayers.Geometry.MultiLineString(lineStrings);
};

jsts.io.OpenLayersParser.prototype.convertToMultiPolygon = function(
    multiPolygon) {
  var i;
  var polygons = [];

  for (i = 0; i < multiPolygon.geometries.length; i++) {
    polygons.push(this.convertToPolygon(multiPolygon.geometries[i]));
  }

  return new OpenLayers.Geometry.MultiPolygon(polygons);
};

jsts.io.OpenLayersParser.prototype.convertToCollection = function(
    geometryCollection) {
  var i;
  var geometries = [];

  for (i = 0; i < geometryCollection.geometries.length; i++) {
    var geometry = geometryCollection.geometries[i];
    var geometryOpenLayers = this.write(geometry);

    geometries.push(geometryOpenLayers);
  }

  return new OpenLayers.Geometry.Collection(geometries);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/algorithm/RobustDeterminant.java
 * Revision: 626
 */

/**
 * Implements an algorithm to compute the
 * sign of a 2x2 determinant for double precision values robustly.
 * It is a direct translation of code developed by Olivier Devillers.
 * <p>
 * The original code carries the following copyright notice:
 *
 * <pre>
 *************************************************************************
 * Author : Olivier Devillers
 * Olivier.Devillers@sophia.inria.fr
 * http:/www.inria.fr:/prisme/personnel/devillers/anglais/determinant.html
 *
 * Olivier Devillers has allowed the code to be distributed under
 * the LGPL (2012-02-16) saying "It is ok for LGPL distribution."
 *
 **************************************************************************
 *
 **************************************************************************
 *              Copyright (c) 1995  by  INRIA Prisme Project
 *                  BP 93 06902 Sophia Antipolis Cedex, France.
 *                           All rights reserved
 **************************************************************************
 * </pre>
 * @constructor
 */
jsts.algorithm.RobustDeterminant = function() {

};


/**
 * Computes the sign of the determinant of the 2x2 matrix
 * with the given entries, in a robust way.
 *
 * @param {Number}
 *        x1 X-1.
 * @param {Number}
 *        y1 Y-1.
 * @param {Number}
 *        x2 X-2.
 * @param {Number}
 *        y2 Y-1.
 *
 * @return {Number}
 *         -1 if the determinant is negative,.
 * @return {Number}
 *         1 if the determinant is positive,.
 * @return {Number}
 *         0 if the determinant is 0.
 */
jsts.algorithm.RobustDeterminant.signOfDet2x2 = function(x1, y1, x2, y2) {
  //returns -1 if the determinant is negative,
  // returns  1 if the determinant is positive,
  // returns  0 if the determinant is null.
  var sign, swap, k, count;
  count = 0;

  sign = 1;

  /*
   *  testing null entries
   */
  if ((x1 === 0.0) || (y2 === 0.0)) {
    if ((y1 === 0.0) || (x2 === 0.0)) {
      return 0;
    }
    else if (y1 > 0) {
      if (x2 > 0) {
        return -sign;
      }
      else {
        return sign;
      }
    }
    else {
      if (x2 > 0) {
        return sign;
      }
      else {
        return -sign;
      }
    }
  }
  if ((y1 === 0.0) || (x2 === 0.0)) {
    if (y2 > 0) {
      if (x1 > 0) {
        return sign;
      }
      else {
        return -sign;
      }
    }
    else {
      if (x1 > 0) {
        return -sign;
      }
      else {
        return sign;
      }
    }
  }

  /*
   *  making y coordinates positive and permuting the entries
   */
  /*
   *  so that y2 is the biggest one
   */
  if (0.0 < y1) {
    if (0.0 < y2) {
      if (y1 > y2) {
        sign = -sign;
        swap = x1;
        x1 = x2;
        x2 = swap;
        swap = y1;
        y1 = y2;
        y2 = swap;
      }
    }
    else {
      if (y1 <= -y2) {
        sign = -sign;
        x2 = -x2;
        y2 = -y2;
      }
      else {
        swap = x1;
        x1 = -x2;
        x2 = swap;
        swap = y1;
        y1 = -y2;
        y2 = swap;
      }
    }
  }
  else {
    if (0.0 < y2) {
      if (-y1 <= y2) {
        sign = -sign;
        x1 = -x1;
        y1 = -y1;
      }
      else {
        swap = -x1;
        x1 = x2;
        x2 = swap;
        swap = -y1;
        y1 = y2;
        y2 = swap;
      }
    }
    else {
      if (y1 >= y2) {
        x1 = -x1;
        y1 = -y1;
        x2 = -x2;
        y2 = -y2;
      }
      else {
        sign = -sign;
        swap = -x1;
        x1 = -x2;
        x2 = swap;
        swap = -y1;
        y1 = -y2;
        y2 = swap;
      }
    }
  }

  /*
   *  making x coordinates positive
   */
  /*
   *  if |x2| < |x1| one can conclude
   */
  if (0.0 < x1) {
    if (0.0 < x2) {
      if (x1 > x2) {
        return sign;
      }
    }
    else {
      return sign;
    }
  }
  else {
    if (0.0 < x2) {
      return -sign;
    }
    else {
      if (x1 >= x2) {
        sign = -sign;
        x1 = -x1;
        x2 = -x2;
      }
      else {
        return -sign;
      }
    }
  }

  /*
   *  all entries strictly positive   x1 <= x2 and y1 <= y2
   */
  while (true) {
    count = count + 1;
    k = Math.floor(x2 / x1);
    x2 = x2 - k * x1;
    y2 = y2 - k * y1;

    /*
     *  testing if R (new U2) is in U1 rectangle
     */
    if (y2 < 0.0) {
      return -sign;
    }
    if (y2 > y1) {
      return sign;
    }

    /*
     *  finding R'
     */
    if (x1 > x2 + x2) {
      if (y1 < y2 + y2) {
        return sign;
      }
    }
    else {
      if (y1 > y2 + y2) {
        return -sign;
      }
      else {
        x2 = x1 - x2;
        y2 = y1 - y2;
        sign = -sign;
      }
    }
    if (y2 === 0.0) {
      if (x2 === 0.0) {
        return 0;
      }
      else {
        return -sign;
      }
    }
    if (x2 === 0.0) {
      return sign;
    }

    /*
     *  exchange 1 and 2 role.
     */
    k = Math.floor(x1 / x2);
    x1 = x1 - k * x2;
    y1 = y1 - k * y2;

    /*
     *  testing if R (new U1) is in U2 rectangle
     */
    if (y1 < 0.0) {
      return sign;
    }
    if (y1 > y2) {
      return -sign;
    }

    /*
     *  finding R'
     */
    if (x2 > x1 + x1) {
      if (y2 < y1 + y1) {
        return -sign;
      }
    }
    else {
      if (y2 > y1 + y1) {
        return sign;
      }
      else {
        x1 = x2 - x1;
        y1 = y2 - y1;
        sign = -sign;
      }
    }
    if (y1 === 0.0) {
      if (x1 === 0.0) {
        return 0;
      }
      else {
        return sign;
      }
    }
    if (x1 === 0.0) {
      return -sign;
    }
  }
};


/**
 * Returns the index of the direction of the point <code>q</code> relative to
 * a vector specified by <code>p1-p2</code>.
 *
 * @param p1 the origin point of the vector
 * @param p2 the final point of the vector
 * @param q the point to compute the direction to
 *
 * @return 1 if q is counter-clockwise (left) from p1-p2
 * @return -1 if q is clockwise (right) from p1-p2
 * @return 0 if q is collinear with p1-p2
 */
jsts.algorithm.RobustDeterminant.orientationIndex = function(p1, p2, q) {
  /**
   * MD - 9 Aug 2010 It seems that the basic algorithm is slightly orientation
   * dependent, when computing the orientation of a point very close to a
   * line. This is possibly due to the arithmetic in the translation to the
   * origin.
   *
   * For instance, the following situation produces identical results in spite
   * of the inverse orientation of the line segment:
   *
   * Coordinate p0 = new Coordinate(219.3649559090992, 140.84159161824724);
   * Coordinate p1 = new Coordinate(168.9018919682399, -5.713787599646864);
   *
   * Coordinate p = new Coordinate(186.80814046338352, 46.28973405831556); int
   * orient = orientationIndex(p0, p1, p); int orientInv =
   * orientationIndex(p1, p0, p);
   *
   *
   */

  var dx1 = p2.x - p1.x;
  var dy1 = p2.y - p1.y;
  var dx2 = q.x - p2.x;
  var dy2 = q.y - p2.y;
  return jsts.algorithm.RobustDeterminant.signOfDet2x2(dx1, dy1, dx2, dy2);
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Counts the number of segments crossed by a horizontal ray extending to the
 * right from a given point, in an incremental fashion. This can be used to
 * determine whether a point lies in a {@link Polygonal} geometry. The class
 * determines the situation where the point lies exactly on a segment. When
 * being used for Point-In-Polygon determination, this case allows
 * short-circuiting the evaluation.
 * <p>
 * This class handles polygonal geometries with any number of shells and holes.
 * The orientation of the shell and hole rings is unimportant. In order to
 * compute a correct location for a given polygonal geometry, it is essential
 * that <b>all</b> segments are counted which
 * <ul>
 * <li>touch the ray
 * <li>lie in in any ring which may contain the point
 * </ul>
 * The only exception is when the point-on-segment situation is detected, in
 * which case no further processing is required. The implication of the above
 * rule is that segments which can be a priori determined to <i>not</i> touch
 * the ray (i.e. by a test of their bounding box or Y-extent) do not need to be
 * counted. This allows for optimization by indexing.
 *
 * @constructor
 */
jsts.algorithm.RayCrossingCounter = function(p) {
  this.p = p;
};


/**
 * Determines the {@link Location} of a point in a ring. This method is an
 * exemplar of how to use this class.
 *
 * @param {Coordinate}
 *          p the point to test.
 * @param {Coordinate[]}
 *          ring an array of Coordinates forming a ring.
 * @return {int} the location of the point in the ring.
 */
jsts.algorithm.RayCrossingCounter.locatePointInRing = function(p, ring) {
  var counter = new jsts.algorithm.RayCrossingCounter(p);

  for (var i = 1; i < ring.length; i++) {
    var p1 = ring[i];
    var p2 = ring[i - 1];
    counter.countSegment(p1, p2);
    if (counter.isOnSegment())
      return counter.getLocation();
  }
  return counter.getLocation();
};


/**
 * @type {Coordinate}
 * @private
 */
jsts.algorithm.RayCrossingCounter.prototype.p = null;


/**
 * @type {int}
 * @private
 */
jsts.algorithm.RayCrossingCounter.prototype.crossingCount = 0;


/**
 * true if the test point lies on an input segment
 *
 * @type {boolean}
 * @private
 */
jsts.algorithm.RayCrossingCounter.prototype.isPointOnSegment = false;


/**
 * Counts a segment
 *
 * @param {Coordinate}
 *          p1 an endpoint of the segment.
 * @param {Coordinate}
 *          p2 another endpoint of the segment.
 */
jsts.algorithm.RayCrossingCounter.prototype.countSegment = function(p1, p2) {
  /**
   * For each segment, check if it crosses a horizontal ray running from the
   * test point in the positive x direction.
   */

  // check if the segment is strictly to the left of the test point
  if (p1.x < this.p.x && p2.x < this.p.x)
    return;

  // check if the point is equal to the current ring vertex
  if (this.p.x == p2.x && this.p.y === p2.y) {
    this.isPointOnSegment = true;
    return;
  }
  /**
   * For horizontal segments, check if the point is on the segment. Otherwise,
   * horizontal segments are not counted.
   */
  if (p1.y === this.p.y && p2.y === this.p.y) {
    var minx = p1.x;
    var maxx = p2.x;
    if (minx > maxx) {
      minx = p2.x;
      maxx = p1.x;
    }
    if (this.p.x >= minx && this.p.x <= maxx) {
      this.isPointOnSegment = true;
    }
    return;
  }
  /**
   * Evaluate all non-horizontal segments which cross a horizontal ray to the
   * right of the test pt. To avoid double-counting shared vertices, we use the
   * convention that
   * <ul>
   * <li>an upward edge includes its starting endpoint, and excludes its final
   * endpoint
   * <li>a downward edge excludes its starting endpoint, and includes its final
   * endpoint
   * </ul>
   */
  if (((p1.y > this.p.y) && (p2.y <= this.p.y)) || ((p2.y > this.p.y) && (p1.y <= this.p.y))) {
    // translate the segment so that the test point lies on the origin
    var x1 = p1.x - this.p.x;
    var y1 = p1.y - this.p.y;
    var x2 = p2.x - this.p.x;
    var y2 = p2.y - this.p.y;

    /**
     * The translated segment straddles the x-axis. Compute the sign of the
     * ordinate of intersection with the x-axis. (y2 != y1, so denominator will
     * never be 0.0)
     */
    // double xIntSign = RobustDeterminant.signOfDet2x2(x1, y1, x2, y2) / (y2
    // - y1);
    // MD - faster & more robust computation?
    var xIntSign = jsts.algorithm.RobustDeterminant.signOfDet2x2(x1, y1, x2, y2);
    if (xIntSign === 0.0) {
      this.isPointOnSegment = true;
      return;
    }
    if (y2 < y1)
      xIntSign = -xIntSign;
    // xsave = xInt;

    // System.out.println("xIntSign(" + x1 + ", " + y1 + ", " + x2 + ", " + y2
    // + " = " + xIntSign);
    // The segment crosses the ray if the sign is strictly positive.
    if (xIntSign > 0.0) {
      this.crossingCount++;
    }
  }
};


/**
 * Reports whether the point lies exactly on one of the supplied segments. This
 * method may be called at any time as segments are processed. If the result of
 * this method is <tt>true</tt>, no further segments need be supplied, since
 * the result will never change again.
 *
 * @return {boolean} true if the point lies exactly on a segment.
 */
jsts.algorithm.RayCrossingCounter.prototype.isOnSegment = function() {
  return jsts.geom.isPointOnSegment;
};


/**
 * Gets the {@link Location} of the point relative to the ring, polygon or
 * multipolygon from which the processed segments were provided.
 * <p>
 * This method only determines the correct location if <b>all</b> relevant
 * segments must have been processed.
 *
 * @return {int} the Location of the point.
 */
jsts.algorithm.RayCrossingCounter.prototype.getLocation = function() {
  if (this.isPointOnSegment)
    return jsts.geom.Location.BOUNDARY;

  // The point is in the interior of the ring if the number of X-crossings is
  // odd.
  if ((this.crossingCount % 2) === 1) {
    return jsts.geom.Location.INTERIOR;
  }
  return jsts.geom.Location.EXTERIOR;
};


/**
 * Tests whether the point lies in or on the ring, polygon or multipolygon from
 * which the processed segments were provided.
 * <p>
 * This method only determines the correct location if <b>all</b> relevant
 * segments must have been processed.
 *
 * @return {boolean} true if the point lies in or on the supplied polygon.
 */
jsts.algorithm.RayCrossingCounter.prototype.isPointInPolygon = function() {
  return this.getLocation() !== jsts.geom.Location.EXTERIOR;
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */



/**
 * Specifies and implements various fundamental Computational Geometric
 * algorithms. The algorithms supplied in this class are robust for
 * double-precision floating point.
 *
 * @constructor
 */
jsts.algorithm.CGAlgorithms = function() {

};


/**
 * A value that indicates an orientation of clockwise, or a right turn.
 */
jsts.algorithm.CGAlgorithms.CLOCKWISE = -1;


/**
 * A value that indicates an orientation of clockwise, or a right turn.
 */
jsts.algorithm.CGAlgorithms.RIGHT = jsts.algorithm.CGAlgorithms.CLOCKWISE;


/**
 * A value that indicates an orientation of counterclockwise, or a left turn.
 */
jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE = 1;


/**
 * A value that indicates an orientation of counterclockwise, or a left turn.
 */
jsts.algorithm.CGAlgorithms.LEFT = jsts.algorithm.CGAlgorithms.COUNTERCLOCKWISE;


/**
 * A value that indicates an orientation of collinear, or no turn (straight).
 */
jsts.algorithm.CGAlgorithms.COLLINEAR = 0;


/**
 * A value that indicates an orientation of collinear, or no turn (straight).
 */
jsts.algorithm.CGAlgorithms.STRAIGHT = jsts.algorithm.CGAlgorithms.COLLINEAR;


/**
 * Returns the index of the direction of the point <code>q</code> relative to
 * a vector specified by <code>p1-p2</code>.
 *
 * @param {jsts.geom.Coordinate}
 *          p1 the origin point of the vector.
 * @param {jsts.geom.Coordinate}
 *          p2 the final point of the vector.
 * @param {jsts.geom.Coordinate}
 *          q the point to compute the direction to.
 *
 * @return {Number} 1 if q is counter-clockwise (left) from p1-p2.
 * @return {Number} -1 if q is clockwise (right) from p1-p2.
 * @return {Number} 0 if q is collinear with p1-p2.
 */
jsts.algorithm.CGAlgorithms.orientationIndex = function(p1, p2, q) {
  /**
   * MD - 9 Aug 2010 It seems that the basic algorithm is slightly orientation
   * dependent, when computing the orientation of a point very close to a line.
   * This is possibly due to the arithmetic in the translation to the origin.
   *
   * For instance, the following situation produces identical results in spite
   * of the inverse orientation of the line segment:
   *
   * Coordinate p0 = new Coordinate(219.3649559090992, 140.84159161824724);
   * Coordinate p1 = new Coordinate(168.9018919682399, -5.713787599646864);
   *
   * Coordinate p = new Coordinate(186.80814046338352, 46.28973405831556); int
   * orient = orientationIndex(p0, p1, p); int orientInv = orientationIndex(p1,
   * p0, p);
   *
   * A way to force consistent results is to normalize the orientation of the
   * vector using the following code. However, this may make the results of
   * orientationIndex inconsistent through the triangle of points, so it's not
   * clear this is an appropriate patch.
   *
   */

  var dx1, dy1, dx2, dy2;
  dx1 = p2.x - p1.x;
  dy1 = p2.y - p1.y;
  dx2 = q.x - p2.x;
  dy2 = q.y - p2.y;

  return jsts.algorithm.RobustDeterminant.signOfDet2x2(dx1, dy1, dx2, dy2);
};


/**
 * Tests whether a point lies inside or on a ring. The ring may be oriented in
 * either direction. A point lying exactly on the ring boundary is considered to
 * be inside the ring.
 * <p>
 * This method does <i>not</i> first check the point against the envelope of
 * the ring.
 *
 * @param {jsts.geom.Coordinate}
 *          p point to check for ring inclusion.
 * @param {Array{jsts.geom.Coordinate}}
 *          ring an array of coordinates representing the ring (which must have
 *          first point identical to last point)
 * @return {Boolean} true if p is inside ring.
 *
 * @see locatePointInRing
 */
jsts.algorithm.CGAlgorithms.isPointInRing = function(p, ring) {
  return jsts.algorithm.CGAlgorithms.locatePointInRing(p, ring) !== jsts.geom.Location.EXTERIOR;
};


/**
 * Determines whether a point lies in the interior, on the boundary, or in the
 * exterior of a ring. The ring may be oriented in either direction.
 * <p>
 * This method does <i>not</i> first check the point against the envelope of
 * the ring.
 *
 * @param {jsts.geom.Coordinate}
 *          p point to check for ring inclusion.
 * @param {Array{jsts.geom.Coordinate}}
 *          ring an array of coordinates representing the ring (which must have
 *          first point identical to last point)
 * @return {jsts.geom.Location} the {@link Location} of p relative to the ring.
 */
jsts.algorithm.CGAlgorithms.locatePointInRing = function(p, ring) {
  return jsts.algorithm.RayCrossingCounter.locatePointInRing(p, ring);
};


/**
 * Tests whether a point lies on the line segments defined by a list of
 * coordinates.
 *
 * @param {jsts.geom.Coordinate}
 *          p the coordinate to test.
 * @param {Array{jsts.geom.Coordinate}}
 *          pt An array of coordinates defining line segments
 * @return {Boolean} true if the point is a vertex of the line or lies in the
 *         interior of a line segment in the linestring.
 */
jsts.algorithm.CGAlgorithms.isOnLine = function(p, pt) {
  var lineIntersector, i, il, p0, p1;
  lineIntersector = new jsts.algorithm.RobustLineIntersector();

  for (i = 1, il = pt.length; i < il; i++) {
    p0 = pt[i - 1];
    p1 = pt[i];
    lineIntersector.computeIntersection(p, p0, p1);

    if (lineIntersector.hasIntersection()) {
      return true;
    }
  }
  return false;
};


/**
 * Computes whether a ring defined by an array of {@link Coordinate}s is
 * oriented counter-clockwise.
 * <ul>
 * <li>The list of points is assumed to have the first and last points equal.
 * <li>This will handle coordinate lists which contain repeated points.
 * </ul>
 * This algorithm is <b>only</b> guaranteed to work with valid rings. If the
 * ring is invalid (e.g. self-crosses or touches), the computed result may not
 * be correct.
 *
 * @param {Array{jsts.geom.Coordinate}}
 *          ring an array of Coordinates forming a ring
 * @return {Boolean} true if the ring is oriented counter-clockwise.
 * @throws IllegalArgumentException
 *           if there are too few points to determine orientation (< 3)
 */
jsts.algorithm.CGAlgorithms.isCCW = function(ring) {
  var nPts, hiPt, hiIndex, p, iPrev, iNext, prev, next, i, disc, isCCW;

  // # of points without closing endpoint
  nPts = ring.length - 1;

  // sanity check
  if (nPts < 3) {
    throw new jsts.IllegalArgumentError(
        'Ring has fewer than 3 points, so orientation cannot be determined');
  }

  // find highets point
  hiPt = ring[0];
  hiIndex = 0;

  i = 1;
  for (i; i <= nPts; i++) {
    p = ring[i];
    if (p.y > hiPt.y) {
      hiPt = p;
      hiIndex = i;
    }
  }

  // find distinct point before highest point
  iPrev = hiIndex;
  do {
    iPrev = iPrev - 1;
    if (iPrev < 0) {
      iPrev = nPts;
    }
  } while (ring[iPrev].equals2D(hiPt) && iPrev !== hiIndex);

  // find distinct point after highest point
  iNext = hiIndex;
  do {
    iNext = (iNext + 1) % nPts;
  } while (ring[iNext].equals2D(hiPt) && iNext !== hiIndex);

  prev = ring[iPrev];
  next = ring[iNext];

  /**
   * This check catches cases where the ring contains an A-B-A configuration of
   * points. This can happen if the ring does not contain 3 distinct points
   * (including the case where the input array has fewer than 4 elements), or it
   * contains coincident line segments.
   */
  if (prev.equals2D(hiPt) || next.equals2D(hiPt) || prev.equals2D(next)) {
    return false;
  }

  disc = jsts.algorithm.CGAlgorithms.computeOrientation(prev, hiPt, next);

  /**
   * If disc is exactly 0, lines are collinear. There are two possible cases:
   * (1) the lines lie along the x axis in opposite directions (2) the lines lie
   * on top of one another
   *
   * (1) is handled by checking if next is left of prev ==> CCW (2) will never
   * happen if the ring is valid, so don't check for it (Might want to assert
   * this)
   */
  isCCW = false;
  if (disc === 0) {
    // poly is CCW if prev x is right of next x
    isCCW = (prev.x > next.x);
  } else {
    // if area is positive, points are ordered CCW
    isCCW = (disc > 0);
  }

  return isCCW;
};


/**
 * Computes the orientation of a point q to the directed line segment p1-p2. The
 * orientation of a point relative to a directed line segment indicates which
 * way you turn to get to q after travelling from p1 to p2.
 *
 * @param {jsts.geom.Coordinate}
 *          p1 First coordinate of the linesegment.
 * @param {jsts.geom.Coordinate}
 *          p2 Second coordinate of the linesegment.
 * @param {jsts.geom.Coordinate}
 *          q The point to calculate orientation of.
 *
 * @return {Number} 1 if q is counter-clockwise from p1-p2.
 * @return {Number} -1 if q is clockwise from p1-p2.
 * @return {Number} 0 if q is collinear with p1-p2.
 */
jsts.algorithm.CGAlgorithms.computeOrientation = function(p1, p2, q) {
  return jsts.algorithm.CGAlgorithms.orientationIndex(p1, p2, q);
};


/**
 * Computes the distance from a point p to a line segment AB
 *
 * Note: NON-ROBUST!
 *
 * @param {jsts.geom.Coordinate}
 *          p the point to compute the distance for.
 * @param {jsts.geom.Coordinate}
 *          A one point of the line.
 * @param {jsts.geom.Coordinate}
 *          B another point of the line (must be different to A).
 * @return {Number} the distance from p to line segment AB.
 */
jsts.algorithm.CGAlgorithms.distancePointLine = function(p, A, B) {
  if (!(A instanceof jsts.geom.Coordinate)) {
    jsts.algorithm.CGAlgorithms.distancePointLine2.apply(this, arguments);
  }

  // if start = end, then just compute distance to one of the endpoints
  if (A.x === B.x && A.y === B.y) {
    return p.distance(A);
  }
  // otherwise use comp.graphics.algorithms Frequently Asked Questions method
  /*(1)             AC dot AB
                   r = ---------
                         ||AB||^2
    r has the following meaning:
    r=0 P = A
    r=1 P = B
    r<0 P is on the backward extension of AB
    r>1 P is on the forward extension of AB
    0<r<1 P is interior to AB
  */
  var r, s;
  r = ((p.x - A.x) * (B.x - A.x) + (p.y - A.y) * (B.y - A.y)) /
      ((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));

  if (r <= 0.0) {
    return p.distance(A);
  }
  if (r >= 1.0) {
    return p.distance(B);
  }

  /*(2)
    (Ay-Cy)(Bx-Ax)-(Ax-Cx)(By-Ay)
  s = -----------------------------
             L^2

  Then the distance from C to P = |s|*L.
  */

  s = ((A.y - p.y) * (B.x - A.x) - (A.x - p.x) * (B.y - A.y)) /
      ((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));

  return Math.abs(s) *
      Math.sqrt(((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y)));
};


/**
 * Computes the perpendicular distance from a point p to the (infinite) line
 * containing the points AB
 *
 * @param {jsts.geom.Coordinate}
 *          p the point to compute the distance for.
 * @param {jsts.geom.Coordinate}
 *          A one point of the line.
 * @param {jsts.geom.Coordinate}
 *          B another point of the line (must be different to A).
 * @return {Number} the distance from p to line AB.
 */
jsts.algorithm.CGAlgorithms.distancePointLinePerpendicular = function(p, A, B) {
  // use comp.graphics.algorithms Frequently Asked Questions method
  /*(2)
                   (Ay-Cy)(Bx-Ax)-(Ax-Cx)(By-Ay)
              s = -----------------------------
                                   L^2

              Then the distance from C to P = |s|*L.
  */
  var s = ((A.y - p.y) * (B.x - A.x) - (A.x - p.x) * (B.y - A.y)) /
      ((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y));

  return Math.abs(s) *
      Math.sqrt(((B.x - A.x) * (B.x - A.x) + (B.y - A.y) * (B.y - A.y)));
};


/**
 * Computes the distance from a point to a sequence of line segments.
 *
 * @param {jsts.geom.Coordinate}
 *          p a point.
 * @param {Array{jsts.geom.Coordinate}}
 *          line a sequence of contiguous line segments defined by their
 *          vertices
 * @return {Number} the minimum distance between the point and the line
 *         segments.
 */
jsts.algorithm.CGAlgorithms.distancePointLine2 = function(p, line) {
  var minDistance, i, il, dist;
  if (line.length === 0) {
    throw new jsts.error.IllegalArgumentError(
        'Line array must contain at least one vertex');
  }
  minDistance = p.distance(line[0]);
  for (i = 0, il = line.length - 1; i < il; i++) {
    dist = jsts.algorithm.CGAlgorithms.distancePointLine(p, line[i],
        line[i + 1]);
    if (dist < minDistance) {
      minDistance = dist;
    }
  }
  return minDistance;
};

/**
 * Computes the distance from a line segment AB to a line segment CD
 *
 * Note: NON-ROBUST!
 *
 * @param {jsts.geom.Coordinate}
 *          A a point of one line.
 * @param {jsts.geom.Coordinate}
 *          B the second point of (must be different to A).
 * @param {jsts.geom.Coordinate}
 *          C one point of the line.
 * @param {jsts.geom.Coordinate}
 *          D another point of the line (must be different to A).
 * @return {Number} the distance.
 */

jsts.algorithm.CGAlgorithms.distanceLineLine = function(A, B, C, D) {
  // check for zero-length segments
  if (A.equals(B)) {
    return jsts.algorithm.CGAlgorithms.distancePointLine(A, C, D);
  }
  if (C.equals(D)) {
    return jsts.algorithm.CGAlgorithms.distancePointLine(D, A, B);
  }

  // AB and CD are line segments
  /* from comp.graphics.algo

  Solving the above for r and s yields
        (Ay-Cy)(Dx-Cx)-(Ax-Cx)(Dy-Cy)
             r = ----------------------------- (eqn 1)
        (Bx-Ax)(Dy-Cy)-(By-Ay)(Dx-Cx)

      (Ay-Cy)(Bx-Ax)-(Ax-Cx)(By-Ay)
    s = ----------------------------- (eqn 2)
      (Bx-Ax)(Dy-Cy)-(By-Ay)(Dx-Cx)
  Let P be the position vector of the intersection point, then
    P=A+r(B-A) or
    Px=Ax+r(Bx-Ax)
    Py=Ay+r(By-Ay)
  By examining the values of r & s, you can also determine some other
  limiting conditions:
    If 0<=r<=1 & 0<=s<=1, intersection exists
    r<0 or r>1 or s<0 or s>1 line segments do not intersect
    If the denominator in eqn 1 is zero, AB & CD are parallel
    If the numerator in eqn 1 is also zero, AB & CD are collinear.

  */
  var r_top, r_bot, s_top, s_bot, s, r;
  r_top = (A.y - C.y) * (D.x - C.x) - (A.x - C.x) * (D.y - C.y);
  r_bot = (B.x - A.x) * (D.y - C.y) - (B.y - A.y) * (D.x - C.x);

  s_top = (A.y - C.y) * (B.x - A.x) - (A.x - C.x) * (B.y - A.y);
  s_bot = (B.x - A.x) * (D.y - C.y) - (B.y - A.y) * (D.x - C.x);


  if ((r_bot === 0) || (s_bot === 0)) {
    return Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(A, C, D),
        Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(B, C, D), Math
            .min(jsts.algorithm.CGAlgorithms.distancePointLine(C, A, B),
                jsts.algorithm.CGAlgorithms.distancePointLine(D, A, B))));
  }

  s = s_top / s_bot;
  r = r_top / r_bot;
  if ((r < 0) || (r > 1) || (s < 0) || (s > 1)) {
    // no intersection
    return Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(A, C, D),
        Math.min(jsts.algorithm.CGAlgorithms.distancePointLine(B, C, D), Math
            .min(jsts.algorithm.CGAlgorithms.distancePointLine(C, A, B),
                jsts.algorithm.CGAlgorithms.distancePointLine(D, A, B))));
  }

  return 0.0; // intersection exists
};


/**
 * Computes the signed area for a ring. The signed area is positive if the ring
 * is oriented CW, negative if the ring is oriented CCW, and zero if the ring is
 * degenerate or flat.
 *
 * @param {Array{jsts.geom.Coordinate}}
 *          ring the coordinates forming the ring
 * @return {Number} the signed area of the ring.
 */
jsts.algorithm.CGAlgorithms.signedArea = function(ring) {
  if (ring.length < 3) {
    return 0.0;
  }
  var sum, i, il, bx, by, cx, cy;

  sum = 0.0;

  for (i = 0, il = ring.length - 1; i < il; i++) {
    bx = ring[i].x;
    by = ring[i].y;
    cx = ring[i + 1].x;
    cy = ring[i + 1].y;
    sum += (bx + cx) * (cy - by);
  }

  return -sum / 2.0;
};


/**
 * Computes the signed area for a ring. The signed area is:
 * <ul>
 * <li>positive if the ring is oriented CW
 * <li>negative if the ring is oriented CCW
 * <li>zero if the ring is degenerate or flat
 * </ul>
 *
 * @param {Array{jsts.geom.Coordinate}}
 *          ring the coordinates forming the ring
 * @return {Number} the signed area of the ring.
 */
jsts.algorithm.CGAlgorithms.signedArea = function(ring) {
  var n, sum, p, bx, by, i, cx, cy;

  n = ring.length;
  if (n < 3) {
    return 0.0;
  }

  sum = 0.0;
  p = ring[0];

  bx = p.x;
  by = p.y;

  for (i = 1; i < n; i++) {
    p = ring[i];
    cx = p.x;
    cy = p.y;
    sum += (bx + cx) * (cy - by);
    bx = cx;
    by = cy;
  }

  return -sum / 2.0;
};

/**
 * Computes the length of a linestring specified by a sequence of points.
 *
 * NOTE: This is renamed from length() to computeLength() because 'length' is a
 * reserved keyword in javascript.
 *
 * @param {Array{jsts.geom.Coordinate}}
 *          pts the points specifying the linestring
 * @return {Number} the length of the linestring.
 */
jsts.algorithm.CGAlgorithms.computeLength = function(pts) {
  // optimized for processing CoordinateSequences
  var n = pts.length, len, x0, y0, x1, y1, dx, dy, p, i, il;
  if (n <= 1) {
    return 0.0;
  }

  len = 0.0;

  p = pts[0];

  x0 = p.x;
  y0 = p.y;

  i = 1, il = n;
  for (i; i < n; i++) {
    p = pts[i];

    x1 = p.x;
    y1 = p.y;
    dx = x1 - x0;
    dy = y1 - y0;

    len += Math.sqrt(dx * dx + dy * dy);

    x0 = x1;
    y0 = y1;
  }
  return len;
};

/**
 * @see {jsts.algorithm.CGAlgorithms.computeLength} Since 'length' is a reserved
 *      keyword in javascript this function does not act as a function. Please
 *      use 'computeLength' instead.
 */
jsts.algorithm.CGAlgorithms.length = function() {};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/operation/polygonize/EdgeRing.java
 * Revision: 109
 */

(function() {

  /**
   * Represents a ring of {@link PolygonizeDirectedEdge}s which form a ring of
   * a polygon. The ring may be either an outer shell or a hole.
   */
  var EdgeRing = function(factory) {
    this.deList = new javascript.util.ArrayList();

    this.factory = factory;
  };



  /**
   * Find the innermost enclosing shell EdgeRing containing the argument
   * EdgeRing, if any. The innermost enclosing ring is the <i>smallest</i>
   * enclosing ring. The algorithm used depends on the fact that: <br>
   * ring A contains ring B iff envelope(ring A) contains envelope(ring B) <br>
   * This routine is only safe to use if the chosen point of the hole is known
   * to be properly contained in a shell (which is guaranteed to be the case if
   * the hole does not touch its shell)
   *
   * @param {EdgeRing}
   *          testEr
   * @param {List}
   *          shellList
   *
   * @return containing EdgeRing, if there is one.
   * @return null if no containing EdgeRing is found.
   */
  EdgeRing.findEdgeRingContaining = function(testEr, shellList) {
    var testRing = testEr.getRing();
    var testEnv = testRing.getEnvelopeInternal();
    var testPt = testRing.getCoordinateN(0);

    var minShell = null;
    var minEnv = null;
    for (var it = shellList.iterator(); it.hasNext();) {
      var tryShell = it.next();
      var tryRing = tryShell.getRing();
      var tryEnv = tryRing.getEnvelopeInternal();
      if (minShell != null)
        minEnv = minShell.getRing().getEnvelopeInternal();
      var isContained = false;
      // the hole envelope cannot equal the shell envelope
      if (tryEnv.equals(testEnv))
        continue;

      testPt = jsts.geom.CoordinateArrays.ptNotInList(
          testRing.getCoordinates(), tryRing.getCoordinates());
      if (tryEnv.contains(testEnv) &&
          jsts.algorithm.CGAlgorithms.isPointInRing(testPt, tryRing
              .getCoordinates()))
        isContained = true;
      // check if this new containing ring is smaller than the current minimum
      // ring
      if (isContained) {
        if (minShell == null || minEnv.contains(tryEnv)) {
          minShell = tryShell;
        }
      }
    }
    return minShell;
  };

  /**
   * Finds a point in a list of points which is not contained in another list of
   * points
   *
   * @param {Coordinate[]}
   *          testPts the {@link Coordinate}s to test.
   * @param {Coordinate[]}
   *          pts an array of {@link Coordinate}s to test the input points
   *          against.
   * @return a {@link Coordinate} from <code>testPts</code> which is not in
   *         <code>pts</code>,.
   * @return null if there is no coordinate not in the list.
   */
  EdgeRing.ptNotInList = function(testPts, pts) {
    for (var i = 0; i < testPts.length; i++) {
      var testPt = testPts[i];
      if (!isInList(testPt, pts))
        return testPt;
    }
    return null;
  };

  /**
   * Tests whether a given point is in an array of points. Uses a value-based
   * test.
   *
   * @param {Coordinate}
   *          pt a {@link Coordinate} for the test point.
   * @param {Coordinate[]}
   *          pts an array of {@link Coordinate}s to test.
   * @return <code>true</code> if the point is in the array.
   */
  EdgeRing.isInList = function(pt, pts) {
    for (var i = 0; i < pts.length; i++) {
      if (pt.equals(pts[i]))
        return true;
    }
    return false;
  }

  EdgeRing.prototype.factory = null;

  EdgeRing.prototype.deList = null;

  // cache the following data for efficiency
  EdgeRing.prototype.ring = null;

  EdgeRing.prototype.ringPts = null;
  EdgeRing.prototype.holes = null;

  /**
   * Adds a {@link DirectedEdge} which is known to form part of this ring.
   *
   * @param de
   *          the {@link DirectedEdge} to add.
   */
  EdgeRing.prototype.add = function(de) {
    this.deList.add(de);
  };

  /**
   * Tests whether this ring is a hole. Due to the way the edges in the
   * polyongization graph are linked, a ring is a hole if it is oriented
   * counter-clockwise.
   *
   * @return <code>true</code> if this ring is a hole.
   */
  EdgeRing.prototype.isHole = function() {
    var ring = this.getRing();
    return jsts.algorithm.CGAlgorithms.isCCW(ring.getCoordinates());
  };

  /**
   * Adds a hole to the polygon formed by this ring.
   *
   * @param hole
   *          the {@link LinearRing} forming the hole.
   */
  EdgeRing.prototype.addHole = function(hole) {
    if (this.holes == null)
      this.holes = new javascript.util.ArrayList();
    this.holes.add(hole);
  };

  /**
   * Computes the {@link Polygon} formed by this ring and any contained holes.
   *
   * @return the {@link Polygon} formed by this ring and its holes.
   */
  EdgeRing.prototype.getPolygon = function() {
    var holeLR = null;
    if (this.holes != null) {
      holeLR = [];
      for (var i = 0; i < this.holes.size(); i++) {
        holeLR[i] = this.holes.get(i);
      }
    }
    var poly = this.factory.createPolygon(this.ring, holeLR);
    return poly;
  };

  /**
   * Tests if the {@link LinearRing} ring formed by this edge ring is
   * topologically valid.
   *
   * @return true if the ring is valid.
   */
  EdgeRing.prototype.isValid = function() {
    this.getCoordinates();
    if (this.ringPts.length <= 3)
      return false;
    this.getRing();
    return this.ring.isValid();
  };

  /**
   * Computes the list of coordinates which are contained in this ring. The
   * coordinatea are computed once only and cached.
   *
   * @return an array of the {@link Coordinate} s in this ring.
   */
  EdgeRing.prototype.getCoordinates = function() {
    if (this.ringPts == null) {
      var coordList = new jsts.geom.CoordinateList();
      for (var i = this.deList.iterator(); i.hasNext();) {
        var de = i.next();
        var edge = de.getEdge();
        EdgeRing.addEdge(edge.getLine().getCoordinates(), de.getEdgeDirection(),
            coordList);
      }
      this.ringPts = coordList.toCoordinateArray();
    }
    return this.ringPts;
  };

  /**
   * Gets the coordinates for this ring as a {@link LineString}. Used to return
   * the coordinates in this ring as a valid geometry, when it has been detected
   * that the ring is topologically invalid.
   *
   * @return a {@link LineString} containing the coordinates in this ring.
   */
  EdgeRing.prototype.getLineString = function() {
    this.getCoordinates();
    return this.factory.createLineString(this.ringPts);
  };

  /**
   * Returns this ring as a {@link LinearRing}, or null if an Exception occurs
   * while creating it (such as a topology problem). Details of problems are
   * written to standard output.
   */
  EdgeRing.prototype.getRing = function() {
    if (this.ring != null)
      return this.ring;
    this.getCoordinates();
    if (this.ringPts.length < 3)
      console.log(this.ringPts);
    try {
      this.ring = this.factory.createLinearRing(this.ringPts);
    } catch (ex) {
      console.log(this.ringPts);
    }
    return this.ring;
  };

  EdgeRing.addEdge = function(coords, isForward, coordList) {
    if (isForward) {
      for (var i = 0; i < coords.length; i++) {
        coordList.add(coords[i], false);
      }
    } else {
      for (var i = coords.length - 1; i >= 0; i--) {
        coordList.add(coords[i], false);
      }
    }
  };

  jsts.operation.polygonize.EdgeRing = EdgeRing;

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */


/**
 * <code>Geometry</code> classes support the concept of applying a
 * <code>GeometryComponentFilter</code> filter to the <code>Geometry</code>.
 * The filter is applied to every component of the <code>Geometry</code> which
 * is itself a <code>Geometry</code> and which does not itself contain any
 * components. (For instance, all the {@link LinearRing}s in {@link Polygon}s
 * are visited, but in a {@link MultiPolygon} the {@link Polygon}s themselves
 * are not visited.) Thus the only classes of Geometry which must be handled as
 * arguments to {@link #filter} are {@link LineString}s, {@link LinearRing}s
 * and {@link Point}s.
 * <p>
 * A <code>GeometryComponentFilter</code> filter can either record information
 * about the <code>Geometry</code> or change the <code>Geometry</code> in
 * some way. <code>GeometryComponentFilter</code> is an example of the
 * Gang-of-Four Visitor pattern.
 */
jsts.geom.GeometryComponentFilter = function() {
};


/**
 * Performs an operation with or on <code>geom</code>.
 *
 * @param {Geometry}
 *          geom a <code>Geometry</code> to which the filter is applied.
 */
jsts.geom.GeometryComponentFilter.prototype.filter = function(geom) {
  throw new jsts.error.AbstractMethodInvocationError();
};

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/planargraph/NodeMap.java
 * Revision: 6
 */

/**
 * @requires jsts/geom/Coordinate.js
 * @requires jsts/planargraph/Node.js
 */

(function() {

  /**
   * A map of {@link Node}s, indexed by the coordinate of the node.
   *
   * Constructs a NodeMap without any Nodes.
   */
  var NodeMap = function() {
    this.nodeMap = new javascript.util.TreeMap();
  };


  NodeMap.prototype.nodeMap = null;


  /**
   * Adds a node to the map, replacing any that is already at that location.
   *
   * @return the added node.
   */
  NodeMap.prototype.add = function(n) {
    this.nodeMap.put(n.getCoordinate(), n);
    return n;
  };

  /**
   * Removes the Node at the given location, and returns it (or null if no Node
   * was there).
   */
  NodeMap.prototype.remove = function(pt) {
    return this.nodeMap.remove(pt);
  };

  /**
   * Returns the Node at the given location, or null if no Node was there.
   */
  NodeMap.prototype.find = function(coord) {
    return this.nodeMap.get(coord);
  };

  /**
   * Returns an Iterator over the Nodes in this NodeMap, sorted in ascending
   * order by angle with the positive x-axis.
   */
  NodeMap.prototype.iterator = function() {
    return this.nodeMap.values().iterator();
  };

  /**
   * Returns the Nodes in this NodeMap, sorted in ascending order by angle with
   * the positive x-axis.
   */
  NodeMap.prototype.values = function() {
    return this.nodeMap.values();
  };

  jsts.planargraph.NodeMap = NodeMap;

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/planargraph/GraphComponent.java
 * Revision: 6
 */

(function() {

  /**
   * The base class for all graph component classes. Maintains flags of use in
   * generic graph algorithms. Provides two flags:
   * <ul>
   * <li><b>marked</b> - typically this is used to indicate a state that
   * persists for the course of the graph's lifetime. For instance, it can be
   * used to indicate that a component has been logically deleted from the
   * graph.
   * <li><b>visited</b> - this is used to indicate that a component has been
   * processed or visited by an single graph algorithm. For instance, a
   * breadth-first traversal of the graph might use this to indicate that a node
   * has already been traversed. The visited flag may be set and cleared many
   * times during the lifetime of a graph.
   *
   * <p>
   * Graph components support storing user context data. This will typically be
   * used by client algorithms which use planar graphs.
   */
  var GraphComponent = function() {

  };

  /**
   * Sets the Visited state for all {@link GraphComponent}s in an
   * {@link Iterator}
   *
   * @param i
   *          the Iterator to scan.
   * @param visited
   *          the state to set the visited flag to.
   */
  GraphComponent.setVisited = function(i, visited) {
    while (i.hasNext()) {
      var comp = i.next();
      comp.setVisited(visited);
    }
  };

  /**
   * Sets the Marked state for all {@link GraphComponent}s in an
   * {@link Iterator}
   *
   * @param i
   *          the Iterator to scan.
   * @param marked
   *          the state to set the Marked flag to.
   */
  GraphComponent.setMarked = function(i, marked) {
    while (i.hasNext()) {
      var comp = i.next();
      comp.setMarked(marked);
    }
  };

  /**
   * Finds the first {@link GraphComponent} in a {@link Iterator} set which has
   * the specified visited state.
   *
   * @param i
   *          an Iterator of GraphComponents.
   * @param visitedState
   *          the visited state to test.
   * @return the first component found, or <code>null</code> if none found.
   */
  GraphComponent.getComponentWithVisitedState = function(i, visitedState) {
    while (i.hasNext()) {
      var comp = i.next();
      if (comp.isVisited() == visitedState)
        return comp;
    }
    return null;
  };

  GraphComponent.prototype._isMarked = false;
  GraphComponent.prototype._isVisited = false;
  GraphComponent.prototype.data;


  /**
   * Tests if a component has been visited during the course of a graph
   * algorithm
   *
   * @return <code>true</code> if the component has been visited.
   */
  GraphComponent.prototype.isVisited = function() {
    return this._isVisited;
  };

  /**
   * Sets the visited flag for this component.
   *
   * @param isVisited
   *          the desired value of the visited flag.
   */
  GraphComponent.prototype.setVisited = function(isVisited) {
    this._isVisited = isVisited;
  };

  /**
   * Tests if a component has been marked at some point during the processing
   * involving this graph.
   *
   * @return <code>true</code> if the component has been marked.
   */
  GraphComponent.prototype.isMarked = function() {
    return this._isMarked;
  };

  /**
   * Sets the marked flag for this component.
   *
   * @param isMarked
   *          the desired value of the marked flag.
   */
  GraphComponent.prototype.setMarked = function(isMarked) {
    this._isMarked = isMarked;
  };

  /**
   * Sets the user-defined data for this component.
   *
   * @param data
   *          an Object containing user-defined data.
   */
  GraphComponent.prototype.setContext = function(data) {
    this.data = data;
  };

  /**
   * Gets the user-defined data for this component.
   *
   * @return the user-defined data.
   */
  GraphComponent.prototype.getContext = function() {
    return data;
  };

  /**
   * Sets the user-defined data for this component.
   *
   * @param data
   *          an Object containing user-defined data.
   */
  GraphComponent.prototype.setData = function(data) {
    this.data = data;
  };

  /**
   * Gets the user-defined data for this component.
   *
   * @return the user-defined data.
   */
  GraphComponent.prototype.getData = function() {
    return data;
  };

  /**
   * Tests whether this component has been removed from its containing graph
   *
   * @return <code>true</code> if this component is removed.
   */
  GraphComponent.prototype.isRemoved = function() {
    throw new jsts.error.AbstractMethodInvocationError();
  };

  jsts.planargraph.GraphComponent = GraphComponent;

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/planargraph/Edge.java
 * Revision: 6
 */

/**
 * @requires jsts/planargraph/GraphComponent.js
 */

(function() {

  var GraphComponent = jsts.planargraph.GraphComponent;

  /**
   * Represents an undirected edge of a {@link PlanarGraph}. An undirected edge
   * in fact simply acts as a central point of reference for two opposite
   * {@link DirectedEdge}s.
   * <p>
   * Usually a client using a <code>PlanarGraph</code> will subclass
   * <code>Edge</code> to add its own application-specific data and methods.
   *
   * Constructs an Edge initialized with the given DirectedEdges, and for each
   * DirectedEdge: sets the Edge, sets the symmetric DirectedEdge, and adds this
   * Edge to its from-Node.
   */
  var Edge = function(de0, de1) {
    if (de0 === undefined) {
      return;
    }
    this.setDirectedEdges(de0, de1);
  };

  Edge.prototype = new GraphComponent();


  /**
   * The two DirectedEdges associated with this Edge. Index 0 is forward, 1 is
   * reverse.
   */
  Edge.prototype.dirEdge = null;

  /**
   * Initializes this Edge's two DirectedEdges, and for each DirectedEdge: sets
   * the Edge, sets the symmetric DirectedEdge, and adds this Edge to its
   * from-Node.
   */
  Edge.prototype.setDirectedEdges = function(de0, de1) {
    this.dirEdge = [de0, de1];
    de0.setEdge(this);
    de1.setEdge(this);
    de0.setSym(de1);
    de1.setSym(de0);
    de0.getFromNode().addOutEdge(de0);
    de1.getFromNode().addOutEdge(de1);
  };

  /**
   * Returns one of the DirectedEdges associated with this Edge.
   *
   * @param i
   *          0 or 1. 0 returns the forward directed edge, 1 returns the reverse.
   */
  Edge.prototype.getDirEdge = function(i) {
    if (i instanceof jsts.planargraph.Node) {
      this.getDirEdge2(i);
    }

    return this.dirEdge[i];
  };

  /**
   * Returns the {@link DirectedEdge} that starts from the given node, or null
   * if the node is not one of the two nodes associated with this Edge.
   */
  Edge.prototype.getDirEdge2 = function(fromNode) {
    if (this.dirEdge[0].getFromNode() == fromNode)
      return this.dirEdge[0];
    if (this.dirEdge[1].getFromNode() == fromNode)
      return this.dirEdge[1];
    // node not found
    // possibly should throw an exception here?
    return null;
  };

  /**
   * If <code>node</code> is one of the two nodes associated with this Edge,
   * returns the other node; otherwise returns null.
   */
  Edge.prototype.getOppositeNode = function(node) {
    if (this.dirEdge[0].getFromNode() == node)
      return this.dirEdge[0].getToNode();
    if (this.dirEdge[1].getFromNode() == node)
      return this.dirEdge[1].getToNode();
    // node not found
    // possibly should throw an exception here?
    return null;
  };

  /**
   * Removes this edge from its containing graph.
   */
  Edge.prototype.remove = function() {
    this.dirEdge = null;
  };

  /**
   * Tests whether this edge has been removed from its containing graph
   *
   * @return <code>true</code> if this edge is removed.
   */
  Edge.prototype.isRemoved = function() {
    return dirEdge == null;
  };

  jsts.planargraph.Edge = Edge;

})();

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/planargraph/DirectedEdge.java
 * Revision: 6
 */

/**
 * @requires jsts/planargraph/GraphComponent.js
 */

(function() {

  var ArrayList = javascript.util.ArrayList;
  var GraphComponent = jsts.planargraph.GraphComponent;

  /**
   * Represents a directed edge in a {@link PlanarGraph}. A DirectedEdge may or
   * may not have a reference to a parent {@link Edge} (some applications of
   * planar graphs may not require explicit Edge objects to be created). Usually
   * a client using a <code>PlanarGraph</code> will subclass
   * <code>DirectedEdge</code> to add its own application-specific data and
   * methods.
   *
   * Constructs a DirectedEdge connecting the <code>from</code> node to the
   * <code>to</code> node.
   *
   * @param directionPt
   *          specifies this DirectedEdge's direction vector (determined by the
   *          vector from the <code>from</code> node to
   *          <code>directionPt</code>).
   * @param edgeDirection
   *          whether this DirectedEdge's direction is the same as or opposite
   *          to that of the parent Edge (if any).
   */
  var DirectedEdge = function(from, to, directionPt, edgeDirection) {
    if (from === undefined) {
      return;
    }

    this.from = from;
    this.to = to;
    this.edgeDirection = edgeDirection;
    this.p0 = from.getCoordinate();
    this.p1 = directionPt;
    var dx = this.p1.x - this.p0.x;
    var dy = this.p1.y - this.p0.y;
    this.quadrant = jsts.geomgraph.Quadrant.quadrant(dx, dy);
    this.angle = Math.atan2(dy, dx);
  };

  DirectedEdge.prototype = new GraphComponent();

  /**
   * Returns a List containing the parent Edge (possibly null) for each of the
   * given DirectedEdges.
   */
  DirectedEdge.toEdges = function(dirEdges) {
    var edges = new ArrayList();
    for (var i = dirEdges.iterator(); i.hasNext();) {
      edges.add((i.next()).parentEdge);
    }
    return edges;
  };

  DirectedEdge.prototype.parentEdge = null;
  DirectedEdge.prototype.from = null;
  DirectedEdge.prototype.to = null;
  DirectedEdge.prototype.p0 = null;
  DirectedEdge.prototype.p1 = null;
  DirectedEdge.prototype.sym = null; // optional
  DirectedEdge.prototype.edgeDirection = null;
  DirectedEdge.prototype.quadrant = null;
  DirectedEdge.prototype.angle = null;

  /**
   * Returns this DirectedEdge's parent Edge, or null if it has none.
   */
  DirectedEdge.prototype.getEdge = function() {
    return this.parentEdge;
  };

  /**
   * Associates this DirectedEdge with an Edge (possibly null, indicating no
   * associated Edge).
   */
  DirectedEdge.prototype.setEdge = function(parentEdge) {
    this.parentEdge = parentEdge;
  };

  /**
   * Returns 0, 1, 2, or 3, indicating the quadrant in which this DirectedEdge's
   * orientation lies.
   */
  DirectedEdge.prototype.getQuadrant = function() {
    return this.quadrant;
  };

  /**
   * Returns a point to which an imaginary line is drawn from the from-node to
   * specify this DirectedEdge's orientation.
   */
  DirectedEdge.prototype.getDirectionPt = function() {
    return this.p1;
  };

  /**
   * Returns whether the direction of the parent Edge (if any) is the same as
   * that of this Directed Edge.
   */
  DirectedEdge.prototype.getEdgeDirection = function() {
    return this.edgeDirection;
  };

  /**
   * Returns the node from which this DirectedEdge leaves.
   */
  DirectedEdge.prototype.getFromNode = function() {
    return this.from;
  };

  /**
   * Returns the node to which this DirectedEdge goes.
   */
  DirectedEdge.prototype.getToNode = function() {
    return this.to;
  };

  /**
   * Returns the coordinate of the from-node.
   */
  DirectedEdge.prototype.getCoordinate = function() {
    return this.from.getCoordinate();
  };

  /**
   * Returns the angle that the start of this DirectedEdge makes with the
   * positive x-axis, in radians.
   */
  DirectedEdge.prototype.getAngle = function() {
    return this.angle;
  };

  /**
   * Returns the symmetric DirectedEdge -- the other DirectedEdge associated
   * with this DirectedEdge's parent Edge.
   */
  DirectedEdge.prototype.getSym = function() {
    return this.sym;
  };

  /**
   * Sets this DirectedEdge's symmetric DirectedEdge, which runs in the opposite
   * direction.
   */
  DirectedEdge.prototype.setSym = function(sym) {
    this.sym = sym;
  };

  /**
   * Removes this directed edge from its containing graph.
   */
  DirectedEdge.prototype.remove = function() {
    this.sym = null;
    this.parentEdge = null;
  };

  /**
   * Tests whether this directed edge has been removed from its containing graph
   *
   * @return <code>true</code> if this directed edge is removed.
   */
  DirectedEdge.prototype.isRemoved = function() {
    return this.parentEdge == null;
  };

  /**
   * Returns 1 if this DirectedEdge has a greater angle with the positive x-axis
   * than b", 0 if the DirectedEdges are collinear, and -1 otherwise.
   * <p>
   * Using the obvious algorithm of simply computing the angle is not robust,
   * since the angle calculation is susceptible to roundoff. A robust algorithm
   * is:
   * <ul>
   * <li>first compare the quadrants. If the quadrants are different, it it
   * trivial to determine which vector is "greater".
   * <li>if the vectors lie in the same quadrant, the robust
   * {@link CGAlgorithms#computeOrientation(Coordinate, Coordinate, Coordinate)}
   * function can be used to decide the relative orientation of the vectors.
   * </ul>
   */
  DirectedEdge.prototype.compareTo = function(obj) {
    var de = obj;
    return this.compareDirection(de);
  };

  /**
   * Returns 1 if this DirectedEdge has a greater angle with the positive x-axis
   * than b", 0 if the DirectedEdges are collinear, and -1 otherwise.
   * <p>
   * Using the obvious algorithm of simply computing the angle is not robust,
   * since the angle calculation is susceptible to roundoff. A robust algorithm
   * is:
   * <ul>
   * <li>first compare the quadrants. If the quadrants are different, it it
   * trivial to determine which vector is "greater".
   * <li>if the vectors lie in the same quadrant, the robust
   * {@link CGAlgorithms#computeOrientation(Coordinate, Coordinate, Coordinate)}
   * function can be used to decide the relative orientation of the vectors.
   * </ul>
   */
  DirectedEdge.prototype.compareDirection = function(e) {
    // if the rays are in different quadrants, determining the ordering is
    // trivial
    if (this.quadrant > e.quadrant)
      return 1;
    if (this.quadrant < e.quadrant)
      return -1;
    // vectors are in the same quadrant - check relative orientation of
    // direction vectors
    // this is > e if it is CCW of e
    return jsts.algorithm.CGAlgorithms.computeOrientation(e.p0, e.p1, this.p1);
  };

  jsts.planargraph.DirectedEdge = DirectedEdge;

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/planargraph/PlanarGraph.java
 * Revision: 107
 */

/**
 * @requires jsts/planargraph/NodeMap.js
 */

(function() {

  var ArrayList = javascript.util.ArrayList;


  /**
   * Represents a directed graph which is embeddable in a planar surface.
   * <p>
   * This class and the other classes in this package serve as a framework for
   * building planar graphs for specific algorithms. This class must be
   * subclassed to expose appropriate methods to construct the graph. This
   * allows controlling the types of graph components ({@link DirectedEdge}s,
   * {@link Edge}s and {@link Node}s) which can be added to the graph. An
   * application which uses the graph framework will almost always provide
   * subclasses for one or more graph components, which hold
   * application-specific data and graph algorithms.
   *
   * Constructs a empty graph.
   */
  var PlanarGraph = function() {
    this.edges = new javascript.util.HashSet();
    this.dirEdges = new javascript.util.HashSet();
    this.nodeMap = new jsts.planargraph.NodeMap();
  };


  PlanarGraph.prototype.edges = null;
  PlanarGraph.prototype.dirEdges = null;
  PlanarGraph.prototype.nodeMap = null;


  /**
   * Returns the {@link Node} at the given location, or null if no {@link Node}
   * was there.
   *
   * @param pt
   *          the location to query.
   * @return the node found.
   * @return <code>null</code> if this graph contains no node at the location.
   */
  PlanarGraph.prototype.findNode = function(pt) {
    return this.nodeMap.find(pt);
  };

  /**
   * Adds a node to the map, replacing any that is already at that location.
   * Only subclasses can add Nodes, to ensure Nodes are of the right type.
   *
   * @param node
   *          the node to add.
   */
  PlanarGraph.prototype.add = function(node) {
    if (node instanceof jsts.planargraph.Edge) {
      return this.add2(node);
    } else if (node instanceof jsts.planargraph.DirectedEdge) {
      return this.add3(node);
    }

    this.nodeMap.add(node);
  };

  /**
   * Adds the Edge and its DirectedEdges with this PlanarGraph. Assumes that the
   * Edge has already been created with its associated DirectEdges. Only
   * subclasses can add Edges, to ensure the edges added are of the right class.
   */
  PlanarGraph.prototype.add2 = function(edge) {
    this.edges.add(edge);
    this.add(edge.getDirEdge(0));
    this.add(edge.getDirEdge(1));
  };

  /**
   * Adds the Edge to this PlanarGraph; only subclasses can add DirectedEdges,
   * to ensure the edges added are of the right class.
   */
  PlanarGraph.prototype.add3 = function(dirEdge) {
    this.dirEdges.add(dirEdge);
  };

  /**
   * Returns an Iterator over the Nodes in this PlanarGraph.
   */
  PlanarGraph.prototype.nodeIterator = function() {
    return this.nodeMap.iterator();
  };

  /**
   * Returns the Nodes in this PlanarGraph.
   */

  /**
   * Tests whether this graph contains the given {@link Edge}
   *
   * @param e
   *          the edge to query.
   * @return <code>true</code> if the graph contains the edge.
   */
  PlanarGraph.prototype.contains = function(e) {
    if (e instanceof jsts.planargraph.DirectedEdge) {
      return this.contains2(e);
    }

    return this.edges.contains(e);
  };

  /**
   * Tests whether this graph contains the given {@link DirectedEdge}
   *
   * @param de
   *          the directed edge to query.
   * @return <code>true</code> if the graph contains the directed edge.
   */
  PlanarGraph.prototype.contains2 = function(de) {
    return this.dirEdges.contains(de);
  };

  PlanarGraph.prototype.getNodes = function() {
    return this.nodeMap.values();
  };

  /**
   * Returns an Iterator over the DirectedEdges in this PlanarGraph, in the
   * order in which they were added.
   *
   * @see #add(Edge)
   * @see #add(DirectedEdge)
   */
  PlanarGraph.prototype.dirEdgeIterator = function() {
    return this.dirEdges.iterator();
  };
  /**
   * Returns an Iterator over the Edges in this PlanarGraph, in the order in
   * which they were added.
   *
   * @see #add(Edge)
   */
  PlanarGraph.prototype.edgeIterator = function() {
    return this.edges.iterator();
  };

  /**
   * Returns the Edges that have been added to this PlanarGraph
   *
   * @see #add(Edge)
   */
  PlanarGraph.prototype.getEdges = function() {
    return this.edges;
  };

  /**
   * Removes an {@link Edge} and its associated {@link DirectedEdge}s from
   * their from-Nodes and from the graph. Note: This method does not remove the
   * {@link Node}s associated with the {@link Edge}, even if the removal of
   * the {@link Edge} reduces the degree of a {@link Node} to zero.
   */
  PlanarGraph.prototype.remove = function(edge) {
    if (edge instanceof jsts.planargraph.DirectedEdge) {
      return this.remove2(edge);
    }

    this.remove(edge.getDirEdge(0));
    this.remove(edge.getDirEdge(1));
    this.edges.remove(edge);
    this.edge.remove();
  };

  /**
   * Removes a {@link DirectedEdge} from its from-{@link Node} and from this
   * graph. This method does not remove the {@link Node}s associated with the
   * DirectedEdge, even if the removal of the DirectedEdge reduces the degree of
   * a Node to zero.
   */
  PlanarGraph.prototype.remove2 = function(de) {
    if (de instanceof jsts.planargraph.Node) {
      return this.remove3(de);
    }

    var sym = de.getSym();
    if (sym != null)
      sym.setSym(null);

    de.getFromNode().remove(de);
    de.remove();
    this.dirEdges.remove(de);
  };

  /**
   * Removes a node from the graph, along with any associated DirectedEdges and
   * Edges.
   */
  PlanarGraph.prototype.remove3 = function(node) {
    // unhook all directed edges
    var outEdges = node.getOutEdges().getEdges();
    for (var i = outEdges.iterator(); i.hasNext();) {
      var de = i.next();
      var sym = de.getSym();
      // remove the diredge that points to this node
      if (sym != null)
        this.remove(sym);
      // remove this diredge from the graph collection
      this.dirEdges.remove(de);

      var edge = de.getEdge();
      if (edge != null) {
        this.edges.remove(edge);
      }

    }
    // remove the node from the graph
    this.nodeMap.remove(node.getCoordinate());
    node.remove();
  };

  /**
   * Returns all Nodes with the given number of Edges around it.
   */
  PlanarGraph.prototype.findNodesOfDegree = function(degree) {
    var nodesFound = new ArrayList();
    for (var i = this.nodeIterator(); i.hasNext();) {
      var node = i.next();
      if (node.getDegree() == degree)
        nodesFound.add(node);
    }
    return nodesFound;
  };

  jsts.planargraph.PlanarGraph = PlanarGraph;

})();

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/planargraph/DirectedEdge.java
 * Revision: 6
 */


(function() {

  var ArrayList = javascript.util.ArrayList;

  /**
   * A sorted collection of {@link DirectedEdge}s which leave a {@link Node} in
   * a {@link PlanarGraph}.
   *
   * Constructs a DirectedEdgeStar with no edges.
   */
  var DirectedEdgeStar = function() {
    this.outEdges = new ArrayList();
  };


  /**
   * The underlying list of outgoing DirectedEdges
   */
  DirectedEdgeStar.prototype.outEdges = null;

  DirectedEdgeStar.prototype.sorted = false;

  /**
   * Adds a new member to this DirectedEdgeStar.
   */
  DirectedEdgeStar.prototype.add = function(de) {
    this.outEdges.add(de);
    this.sorted = false;
  };
  /**
   * Drops a member of this DirectedEdgeStar.
   */
  DirectedEdgeStar.prototype.remove = function(de) {
    this.outEdges.remove(de);
  };
  /**
   * Returns an Iterator over the DirectedEdges, in ascending order by angle
   * with the positive x-axis.
   */
  DirectedEdgeStar.prototype.iterator = function() {
    this.sortEdges();
    return this.outEdges.iterator();
  };

  /**
   * Returns the number of edges around the Node associated with this
   * DirectedEdgeStar.
   */
  DirectedEdgeStar.prototype.getDegree = function() {
    return this.outEdges.size();
  };

  /**
   * Returns the coordinate for the node at wich this star is based
   */
  DirectedEdgeStar.prototype.getCoordinate = function() {
    var it = iterator();
    if (!it.hasNext())
      return null;
    var e = it.next();
    return e.getCoordinate();
  };

  /**
   * Returns the DirectedEdges, in ascending order by angle with the positive
   * x-axis.
   */
  DirectedEdgeStar.prototype.getEdges = function() {
    this.sortEdges();
    return this.outEdges;
  };

  /**
   * @private
   */
  DirectedEdgeStar.prototype.sortEdges = function() {
    if (!this.sorted) {
      var array = this.outEdges.toArray();
      array.sort(function(a,b) { return a.compareTo(b);});
      this.outEdges = javascript.util.Arrays.asList(array);
      this.sorted = true;
    }
  };

  /**
   * Returns the zero-based index of the given Edge, after sorting in ascending
   * order by angle with the positive x-axis.
   */
  DirectedEdgeStar.prototype.getIndex = function(edge) {
    if (edge instanceof jsts.planargraph.DirectedEdge) {
      return this.getIndex2(edge);
    } else if (typeof (edge) === 'number') {
      return this.getIndex3(edge);
    }

    this.sortEdges();
    for (var i = 0; i < this.outEdges.size(); i++) {
      var de = this.outEdges.get(i);
      if (de.getEdge() == edge)
        return i;
    }
    return -1;
  };

  /**
   * Returns the zero-based index of the given DirectedEdge, after sorting in
   * ascending order by angle with the positive x-axis.
   */
  DirectedEdgeStar.prototype.getIndex2 = function(dirEdge) {
    this.sortEdges();
    for (var i = 0; i < this.outEdges.size(); i++) {
      var de = this.outEdges.get(i);
      if (de == dirEdge)
        return i;
    }
    return -1;
  };

  /**
   * Returns value of i modulo the number of edges in this DirectedEdgeStar
   * (i.e. the remainder when i is divided by the number of edges)
   *
   * @param i
   *          an integer (positive, negative or zero).
   */
  DirectedEdgeStar.prototype.getIndex3 = function(i) {
    var modi = toInt(i % this.outEdges.size());
    // I don't think modi can be 0 (assuming i is positive) [Jon Aquino
    // 10/28/2003]
    if (modi < 0)
      modi += this.outEdges.size();
    return modi;
  };

  /**
   * Returns the {@link DirectedEdge} on the left-hand (CCW) side of the given
   * {@link DirectedEdge} (which must be a member of this DirectedEdgeStar).
   */
  DirectedEdgeStar.prototype.getNextEdge = function(dirEdge) {
    var i = this.getIndex(dirEdge);
    return this.outEdges.get(getIndex(i + 1));
  };

  /**
   * Returns the {@link DirectedEdge} on the right-hand (CW) side of the given
   * {@link DirectedEdge} (which must be a member of this DirectedEdgeStar).
   */
  DirectedEdgeStar.prototype.getNextCWEdge = function(dirEdge) {
    var i = this.getIndex(dirEdge);
    return this.outEdges.get(getIndex(i - 1));
  };

  jsts.planargraph.DirectedEdgeStar = DirectedEdgeStar;

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/planargraph/Node.java
 * Revision: 6
 */

/**
 * @requires jsts/planargraph/GraphComponent.js
 * @requires jsts/planargraph/DirectedEdgeStar.js
 */

(function() {

  var GraphComponent = jsts.planargraph.GraphComponent;
  var DirectedEdgeStar = jsts.planargraph.DirectedEdgeStar;

  /**
   * A node in a {@link PlanarGraph}is a location where 0 or more {@link Edge}s
   * meet. A node is connected to each of its incident Edges via an outgoing
   * DirectedEdge. Some clients using a <code>PlanarGraph</code> may want to
   * subclass <code>Node</code> to add their own application-specific data and
   * methods.
   *
   * Constructs a Node with the given location and collection of outgoing
   * DirectedEdges.
   */
  var Node = function(pt, deStar) {
    this.pt = pt;
    this.deStar = deStar || new DirectedEdgeStar();
  };


  Node.prototype = new GraphComponent();


  /**
   * Returns all Edges that connect the two nodes (which are assumed to be
   * different).
   */
  Node.getEdgesBetween = function(node0, node1) {
    var edges0 = DirectedEdge.toEdges(node0.getOutEdges().getEdges());
    var commonEdges = new javascript.util.HashSet(edges0);
    var edges1 = DirectedEdge.toEdges(node1.getOutEdges().getEdges());
    commonEdges.retainAll(edges1);
    return commonEdges;
  };

  /** The location of this Node */
  Node.prototype.pt = null;

  /** The collection of DirectedEdges that leave this Node */
  Node.prototype.deStar = null;

  /**
   * Returns the location of this Node.
   */
  Node.prototype.getCoordinate = function() {
    return this.pt;
  };

  /**
   * Adds an outgoing DirectedEdge to this Node.
   */
  Node.prototype.addOutEdge = function(de) {
    this.deStar.add(de);
  };

  /**
   * Returns the collection of DirectedEdges that leave this Node.
   */
  Node.prototype.getOutEdges = function() {
    return this.deStar;
  };

  /**
   * Returns the number of edges around this Node.
   */
  Node.prototype.getDegree = function() {
    return this.deStar.getDegree();
  };

  /**
   * Returns the zero-based index of the given Edge, after sorting in ascending
   * order by angle with the positive x-axis.
   */
  Node.prototype.getIndex = function(edge) {
    return this.deStar.getIndex(edge);
  };

  /**
   * Removes a {@link DirectedEdge} incident on this node. Does not change the
   * state of the directed edge.
   */
  Node.prototype.remove = function(de) {
    if (de === undefined) {
      return this.remove2();
    }

    this.deStar.remove(de);
  };

  /**
   * Removes this node from its containing graph.
   */
  Node.prototype.remove2 = function() {
    this.pt = null;
  };


  /**
   * Tests whether this node has been removed from its containing graph
   *
   * @return <code>true</code> if this node is removed.
   */
  Node.prototype.isRemoved = function() {
    return this.pt == null;
  };

  jsts.planargraph.Node = Node;

})();

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/operation/polygonize/PolygonizeDirectedEdge.java
 * Revision: 6
 */

/**
 * @requires jsts/planargraph/DirectedEdge.js
 */

(function() {

  var DirectedEdge = jsts.planargraph.DirectedEdge;

  /**
   * A {@link DirectedEdge} of a {@link PolygonizeGraph}, which represents an
   * edge of a polygon formed by the graph. May be logically deleted from the
   * graph by setting the <code>marked</code> flag.
   *
   * Constructs a directed edge connecting the <code>from</code> node to the
   * <code>to</code> node.
   *
   * @param directionPt
   *          specifies this DirectedEdge's direction (given by an imaginary
   *          line from the <code>from</code> node to <code>directionPt</code>).
   * @param edgeDirection
   *          whether this DirectedEdge's direction is the same as or opposite
   *          to that of the parent Edge (if any).
   */
  var PolygonizeDirectedEdge = function(from, to, directionPt, edgeDirection) {
    DirectedEdge.apply(this, arguments);
  };

  PolygonizeDirectedEdge.prototype = new DirectedEdge();

  PolygonizeDirectedEdge.prototype.edgeRing = null;
  PolygonizeDirectedEdge.prototype.next = null;
  PolygonizeDirectedEdge.prototype.label = -1;

  /**
   * Returns the identifier attached to this directed edge.
   */
  PolygonizeDirectedEdge.prototype.getLabel = function() {
    return this.label;
  };
  /**
   * Attaches an identifier to this directed edge.
   */
  PolygonizeDirectedEdge.prototype.setLabel = function(label) {
    this.label = label;
  };

  /**
   * Returns the next directed edge in the EdgeRing that this directed edge is a
   * member of.
   */
  PolygonizeDirectedEdge.prototype.getNext = function() {
    return this.next;
  };

  /**
   * Sets the next directed edge in the EdgeRing that this directed edge is a
   * member of.
   */
  PolygonizeDirectedEdge.prototype.setNext = function(next) {
    this.next = next;
  };

  /**
   * Returns the ring of directed edges that this directed edge is a member of,
   * or null if the ring has not been set.
   *
   * @see #setRing(EdgeRing)
   */
  PolygonizeDirectedEdge.prototype.isInRing = function() {
    return this.edgeRing != null;
  };

  /**
   * Sets the ring of directed edges that this directed edge is a member of.
   */
  PolygonizeDirectedEdge.prototype.setRing = function(edgeRing) {
    this.edgeRing = edgeRing;
  };

  jsts.operation.polygonize.PolygonizeDirectedEdge = PolygonizeDirectedEdge;

})();

/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/operation/polygonize/PolygonizeEdge.java
 * Revision: 6
 */

/**
 * @requires jsts/planargraph/Edge.js
 */


/**
 * An edge of a polygonization graph.
 */
jsts.operation.polygonize.PolygonizeEdge = function(line) {
  this.line = line;
};

jsts.operation.polygonize.PolygonizeEdge.prototype = new jsts.planargraph.Edge();

jsts.operation.polygonize.PolygonizeEdge.prototype.line = null;

jsts.operation.polygonize.PolygonizeEdge.prototype.getLine = function() {
  return this.line;
};


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/operation/polygonize/PolygonizeDirectedEdge.java
 * Revision: 6
 */

/**
 * @requires jsts/operation/polygonize/EdgeRing.js
 * @requires jsts/operation/polygonize/PolygonizeEdge.js
 * @requires jsts/operation/polygonize/PolygonizeDirectedEdge.js
 * @requires jsts/geom/Coordinate.js
 * @requires jsts/planargraph/PlanarGraph.js
 * @requires jsts/planargraph/Node.js
 */

(function() {

  var ArrayList = javascript.util.ArrayList;
  var Stack = javascript.util.Stack;
  var HashSet = javascript.util.HashSet;
  var Assert = jsts.util.Assert;
  var EdgeRing = jsts.operation.polygonize.EdgeRing;
  var PolygonizeEdge = jsts.operation.polygonize.PolygonizeEdge;
  var PolygonizeDirectedEdge = jsts.operation.polygonize.PolygonizeDirectedEdge;
  var PlanarGraph = jsts.planargraph.PlanarGraph;
  var Node = jsts.planargraph.Node;

  /**
   * Represents a planar graph of edges that can be used to compute a
   * polygonization, and implements the algorithms to compute the
   * {@link EdgeRings} formed by the graph.
   * <p>
   * The marked flag on {@link DirectedEdge}s is used to indicate that a
   * directed edge has be logically deleted from the graph.
   *
   * Create a new polygonization graph.
   */
  var PolygonizeGraph = function(factory) {
    PlanarGraph.apply(this);

    this.factory = factory;
  };

  PolygonizeGraph.prototype = new PlanarGraph();

  /**
   * @private
   */
  PolygonizeGraph.getDegreeNonDeleted = function(node) {
    var edges = node.getOutEdges().getEdges();
    var degree = 0;
    for (var i = edges.iterator(); i.hasNext();) {
      var de = i.next();
      if (!de.isMarked())
        degree++;
    }
    return degree;
  };

  /**
   * @private
   */
  PolygonizeGraph.getDegree = function(node, label) {
    var edges = node.getOutEdges().getEdges();
    var degree = 0;
    for (var i = edges.iterator(); i.hasNext();) {
      var de = i.next();
      if (de.getLabel() == label)
        degree++;
    }
    return degree;
  };

  /**
   * Deletes all edges at a node
   *
   * @private
   */
  PolygonizeGraph.deleteAllEdges = function(node) {
    var edges = node.getOutEdges().getEdges();
    for (var i = edges.iterator(); i.hasNext();) {
      var de = i.next();
      de.setMarked(true);
      var sym = de.getSym();
      if (sym != null)
        sym.setMarked(true);
    }
  };


  PolygonizeGraph.prototype.factory = null;


  /**
   * Add a {@link LineString} forming an edge of the polygon graph.
   *
   * @param line
   *          the line to add.
   */
  PolygonizeGraph.prototype.addEdge = function(line) {
    if (line.isEmpty()) {
      return;
    }
    var linePts = jsts.geom.CoordinateArrays.removeRepeatedPoints(line.getCoordinates());

    if (linePts.length < 2) {
      return;
    }

    var startPt = linePts[0];
    var endPt = linePts[linePts.length - 1];

    var nStart = this.getNode(startPt);
    var nEnd = this.getNode(endPt);

    var de0 = new PolygonizeDirectedEdge(nStart, nEnd, linePts[1], true);
    var de1 = new PolygonizeDirectedEdge(nEnd, nStart,
        linePts[linePts.length - 2], false);
    var edge = new PolygonizeEdge(line);
    edge.setDirectedEdges(de0, de1);
    this.add(edge);
  };

  /**
   * @private
   */
  PolygonizeGraph.prototype.getNode = function(pt) {
    var node = this.findNode(pt);
    if (node == null) {
      node = new Node(pt);
      // ensure node is only added once to graph
      this.add(node);
    }
    return node;
  };

  /**
   * @private
   */
  PolygonizeGraph.prototype.computeNextCWEdges = function() {
    // set the next pointers for the edges around each node
    for (var iNode = this.nodeIterator(); iNode.hasNext();) {
      var node = iNode.next();
      PolygonizeGraph.computeNextCWEdges(node);
    }
  };

  /**
   * Convert the maximal edge rings found by the initial graph traversal into
   * the minimal edge rings required by JTS polygon topology rules.
   *
   * @param ringEdges
   *          the list of start edges for the edgeRings to convert.
   * @private
   */
  PolygonizeGraph.prototype.convertMaximalToMinimalEdgeRings = function(
      ringEdges) {
    for (var i = ringEdges.iterator(); i.hasNext();) {
      var de = i.next();
      var label = de.getLabel();
      var intNodes = PolygonizeGraph.findIntersectionNodes(de, label);

      if (intNodes == null)
        continue;
      // flip the next pointers on the intersection nodes to create minimal edge
      // rings
      for (var iNode = intNodes.iterator(); iNode.hasNext();) {
        var node = iNode.next();
        PolygonizeGraph.computeNextCCWEdges(node, label);
      }
    }
  };

  /**
   * Finds all nodes in a maximal edgering which are self-intersection nodes
   *
   * @param startDE
   * @param label
   * @return the list of intersection nodes found, or <code>null</code> if no
   *         intersection nodes were found.
   * @private
   */
  PolygonizeGraph.findIntersectionNodes = function(startDE, label) {
    var de = startDE;
    var intNodes = null;
    do {
      var node = de.getFromNode();
      if (PolygonizeGraph.getDegree(node, label) > 1) {
        if (intNodes == null)
          intNodes = new ArrayList();
        intNodes.add(node);
      }

      de = de.getNext();
      Assert.isTrue(de != null, 'found null DE in ring');
      Assert
          .isTrue(de == startDE || !de.isInRing(), 'found DE already in ring');
    } while (de != startDE);

    return intNodes;
  };

  /**
   * Computes the minimal EdgeRings formed by the edges in this graph.
   *
   * @return a list of the {@link EdgeRing} s found by the polygonization
   *         process.
   *
   */
  PolygonizeGraph.prototype.getEdgeRings = function() {
    // maybe could optimize this, since most of these pointers should be set
    // correctly already
    // by deleteCutEdges()
    this.computeNextCWEdges();
    // clear labels of all edges in graph
    PolygonizeGraph.label(this.dirEdges, -1);
    var maximalRings = PolygonizeGraph.findLabeledEdgeRings(this.dirEdges);
    this.convertMaximalToMinimalEdgeRings(maximalRings);

    // find all edgerings (which will now be minimal ones, as required)
    var edgeRingList = new ArrayList();
    for (var i = this.dirEdges.iterator(); i.hasNext();) {
      var de = i.next();
      if (de.isMarked())
        continue;
      if (de.isInRing())
        continue;

      var er = this.findEdgeRing(de);
      edgeRingList.add(er);
    }
    return edgeRingList;
  };

  /**
   * Finds and labels all edgerings in the graph. The edge rings are labelling
   * with unique integers. The labelling allows detecting cut edges.
   *
   * @param dirEdges
   *          a List of the DirectedEdges in the graph.
   * @return a List of DirectedEdges, one for each edge ring found.
   * @private
   */
  PolygonizeGraph.findLabeledEdgeRings = function(dirEdges) {
    var edgeRingStarts = new ArrayList();
    // label the edge rings formed
    var currLabel = 1;
    for (var i = dirEdges.iterator(); i.hasNext();) {
      var de = i.next();
      if (de.isMarked())
        continue;
      if (de.getLabel() >= 0)
        continue;

      edgeRingStarts.add(de);
      var edges = PolygonizeGraph.findDirEdgesInRing(de);

      PolygonizeGraph.label(edges, currLabel);
      currLabel++;
    }
    return edgeRingStarts;
  };

  /**
   * Finds and removes all cut edges from the graph.
   *
   * @return a list of the {@link LineString} s forming the removed cut edges.
   */
  PolygonizeGraph.prototype.deleteCutEdges = function() {
    this.computeNextCWEdges();
    // label the current set of edgerings
    PolygonizeGraph.findLabeledEdgeRings(this.dirEdges);

    /**
     * Cut Edges are edges where both dirEdges have the same label. Delete them,
     * and record them
     */
    var cutLines = new ArrayList();
    for (var i = this.dirEdges.iterator(); i.hasNext();) {
      var de = i.next();
      if (de.isMarked())
        continue;

      var sym = de.getSym();

      if (de.getLabel() == sym.getLabel()) {
        de.setMarked(true);
        sym.setMarked(true);

        // save the line as a cut edge
        var e = de.getEdge();
        cutLines.add(e.getLine());
      }
    }
    return cutLines;
  };

  /**
   * @private
   */
  PolygonizeGraph.label = function(dirEdges, label) {
    for (var i = dirEdges.iterator(); i.hasNext();) {
      var de = i.next();
      de.setLabel(label);
    }
  };

  /**
   * @private
   */
  PolygonizeGraph.computeNextCWEdges = function(node) {
    var deStar = node.getOutEdges();
    var startDE = null;
    var prevDE = null;

    // the edges are stored in CCW order around the star
    for (var i = deStar.getEdges().iterator(); i.hasNext();) {
      var outDE = i.next();
      if (outDE.isMarked())
        continue;

      if (startDE == null)
        startDE = outDE;
      if (prevDE != null) {
        var sym = prevDE.getSym();
        sym.setNext(outDE);
      }
      prevDE = outDE;
    }
    if (prevDE != null) {
      var sym = prevDE.getSym();
      sym.setNext(startDE);
    }
  };

  /**
   * Computes the next edge pointers going CCW around the given node, for the
   * given edgering label. This algorithm has the effect of converting maximal
   * edgerings into minimal edgerings
   *
   * @private
   *
   */
  PolygonizeGraph.computeNextCCWEdges = function(node, label) {
    var deStar = node.getOutEdges();
    // PolyDirectedEdge lastInDE = null;
    var firstOutDE = null;
    var prevInDE = null;

    // the edges are stored in CCW order around the star
    var edges = deStar.getEdges();
    // for (Iterator i = deStar.getEdges().iterator(); i.hasNext(); ) {
    for (var i = edges.size() - 1; i >= 0; i--) {
      var de = edges.get(i);
      var sym = de.getSym();

      var outDE = null;
      if (de.getLabel() == label)
        outDE = de;
      var inDE = null;
      if (sym.getLabel() == label)
        inDE = sym;

      if (outDE == null && inDE == null)
        continue; // this edge is not in edgering

      if (inDE != null) {
        prevInDE = inDE;
      }

      if (outDE != null) {
        if (prevInDE != null) {
          prevInDE.setNext(outDE);
          prevInDE = null;
        }
        if (firstOutDE == null)
          firstOutDE = outDE;
      }
    }
    if (prevInDE != null) {
      Assert.isTrue(firstOutDE != null);
      prevInDE.setNext(firstOutDE);
    }
  };

  /**
   * Traverses a ring of DirectedEdges, accumulating them into a list. This
   * assumes that all dangling directed edges have been removed from the graph,
   * so that there is always a next dirEdge.
   *
   * @param startDE
   *          the DirectedEdge to start traversing at.
   * @return a List of DirectedEdges that form a ring.
   * @private
   */
  PolygonizeGraph.findDirEdgesInRing = function(startDE) {
    var de = startDE;
    var edges = new ArrayList();
    do {
      edges.add(de);
      de = de.getNext();
      Assert.isTrue(de != null, 'found null DE in ring');
      Assert
          .isTrue(de == startDE || !de.isInRing(), 'found DE already in ring');
    } while (de != startDE);

    return edges;
  };

  /**
   * @private
   */
  PolygonizeGraph.prototype.findEdgeRing = function(startDE) {
    var de = startDE;
    var er = new EdgeRing(this.factory);
    do {
      er.add(de);
      de.setRing(er);
      de = de.getNext();
      Assert.isTrue(de != null, 'found null DE in ring');
      Assert
          .isTrue(de == startDE || !de.isInRing(), 'found DE already in ring');
    } while (de != startDE);

    return er;
  };

  /**
   * Marks all edges from the graph which are "dangles". Dangles are which are
   * incident on a node with degree 1. This process is recursive, since removing
   * a dangling edge may result in another edge becoming a dangle. In order to
   * handle large recursion depths efficiently, an explicit recursion stack is
   * used
   *
   * @return a List containing the {@link LineStrings} that formed dangles.
   */
  PolygonizeGraph.prototype.deleteDangles = function() {
    var nodesToRemove = this.findNodesOfDegree(1);
    var dangleLines = new HashSet();

    var nodeStack = new Stack();
    for (var i = nodesToRemove.iterator(); i.hasNext();) {
      nodeStack.push(i.next());
    }

    while (!nodeStack.isEmpty()) {
      var node = nodeStack.pop();

      PolygonizeGraph.deleteAllEdges(node);
      var nodeOutEdges = node.getOutEdges().getEdges();
      for (var i = nodeOutEdges.iterator(); i.hasNext();) {
        var de = i.next();
        // delete this edge and its sym
        de.setMarked(true);
        var sym = de.getSym();
        if (sym != null)
          sym.setMarked(true);

        // save the line as a dangle
        var e = de.getEdge();
        dangleLines.add(e.getLine());

        var toNode = de.getToNode();
        // add the toNode to the list to be processed, if it is now a dangle
        if (PolygonizeGraph.getDegreeNonDeleted(toNode) == 1)
          nodeStack.push(toNode);
      }
    }
    return dangleLines;
  };

  /**
   * Traverses the polygonized edge rings in the graph and computes the depth
   * parity (odd or even) relative to the exterior of the graph. If the client
   * has requested that the output be polygonally valid, only odd polygons will
   * be constructed.
   *
   */
  PolygonizeGraph.prototype.computeDepthParity = function() {
    while (true) {
      var de = null;
      if (de == null)
        return;
      this.computeDepthParity(de);
    }
  };

  /**
   * Traverses all connected edges, computing the depth parity of the associated
   * polygons.
   *
   * @param de
   * @private
   */
  PolygonizeGraph.prototype.computeDepthParity = function(de) {

  };

  jsts.operation.polygonize.PolygonizeGraph = PolygonizeGraph;

})();


/* Copyright (c) 2011 by The Authors.
 * Published under the LGPL 2.1 license.
 * See /license-notice.txt for the full text of the license notice.
 * See /license.txt for the full text of the license.
 */

/**
 * Port source:
 * /jts/jts/java/src/com/vividsolutions/jts/operation/polygonize/Polygonizer.java
 * Revision: 6
 */

/**
 * @requires jsts/geom/GeometryComponentFilter.js
 * @requires jsts/geom/LineString.js
 * @requires jsts/operation/polygonize/EdgeRing.js
 * @requires jsts/operation/polygonize/PolygonizeGraph.js
 */

(function() {

  var ArrayList = javascript.util.ArrayList;
  var GeometryComponentFilter = jsts.geom.GeometryComponentFilter;
  var LineString = jsts.geom.LineString;
  var EdgeRing = jsts.operation.polygonize.EdgeRing;
  var PolygonizeGraph = jsts.operation.polygonize.PolygonizeGraph;


  /**
   * Polygonizes a set of {@link Geometry}s which contain linework that
   * represents the edges of a planar graph. All types of Geometry are accepted
   * as input; the constituent linework is extracted as the edges to be
   * polygonized. The processed edges must be correctly noded; that is, they
   * must only meet at their endpoints. The Polygonizer will run on incorrectly
   * noded input but will not form polygons from non-noded edges, and will
   * report them as errors.
   * <p>
   * The Polygonizer reports the follow kinds of errors:
   * <ul>
   * <li><b>Dangles</b> - edges which have one or both ends which are not
   * incident on another edge endpoint
   * <li><b>Cut Edges</b> - edges which are connected at both ends but which
   * do not form part of polygon
   * <li><b>Invalid Ring Lines</b> - edges which form rings which are invalid
   * (e.g. the component lines contain a self-intersection)
   * </ul>
   *
   * Create a polygonizer with the same {@link GeometryFactory} as the input
   * {@link Geometry}s
   */
  var Polygonizer = function() {
    var that = this;

    /**
     * Adds every linear element in a {@link Geometry} into the polygonizer graph.
     */
    var LineStringAdder = function() {

    };

    LineStringAdder.prototype = new GeometryComponentFilter();

    LineStringAdder.prototype.filter = function(g) {
      if (g instanceof LineString)
        that.add(g);
    };

    this.lineStringAdder = new LineStringAdder();
    this.dangles = new ArrayList();
    this.cutEdges = new ArrayList();
    this.invalidRingLines = new ArrayList();
  };



  // default factory
  Polygonizer.prototype.lineStringAdder = null;

  Polygonizer.prototype.graph = null;
  // initialize with empty collections, in case nothing is computed
  Polygonizer.prototype.dangles = null;
  Polygonizer.prototype.cutEdges = null;
  Polygonizer.prototype.invalidRingLines = null;

  Polygonizer.prototype.holeList = null;
  Polygonizer.prototype.shellList = null;
  Polygonizer.prototype.polyList = null;


  /**
   * Adds a collection of geometries to the edges to be polygonized. May be
   * called multiple times. Any dimension of Geometry may be added; the
   * constituent linework will be extracted and used.
   *
   * @param geomList
   *          a list of {@link Geometry} s with linework to be polygonized.
   */
  Polygonizer.prototype.add = function(geomList) {
    if (geomList instanceof jsts.geom.LineString) {
      return this.add3(geomList);
    } else if (geomList instanceof jsts.geom.Geometry) {
      return this.add2(geomList);
    }

    for (var i = geomList.iterator(); i.hasNext();) {
      var geometry = i.next();
      this.add2(geometry);
    }
  };

  /**
   * Add a {@link Geometry} to the edges to be polygonized. May be called
   * multiple times. Any dimension of Geometry may be added; the constituent
   * linework will be extracted and used
   *
   * @param g
   *          a {@link Geometry} with linework to be polygonized.
   */
  Polygonizer.prototype.add2 = function(g) {
    g.apply(this.lineStringAdder);
  };

  /**
   * Adds a linestring to the graph of polygon edges.
   *
   * @param line
   *          the {@link LineString} to add.
   */
  Polygonizer.prototype.add3 = function(line) {
    // create a new graph using the factory from the input Geometry
    if (this.graph == null)
      this.graph = new PolygonizeGraph(line.getFactory());
    this.graph.addEdge(line);
  };

  /**
   * Gets the list of polygons formed by the polygonization.
   *
   * @return a collection of {@link Polygon} s.
   */
  Polygonizer.prototype.getPolygons = function() {
    this.polygonize();
    return this.polyList;
  };

  /**
   * Gets the list of dangling lines found during polygonization.
   *
   * @return a collection of the input {@link LineString} s which are dangles.
   */
  Polygonizer.prototype.getDangles = function() {
    this.polygonize();
    return this.dangles;
  };

  /**
   * Gets the list of cut edges found during polygonization.
   *
   * @return a collection of the input {@link LineString} s which are cut edges.
   */
  Polygonizer.prototype.getCutEdges = function() {
    this.polygonize();
    return this.cutEdges;
  };

  /**
   * Gets the list of lines forming invalid rings found during polygonization.
   *
   * @return a collection of the input {@link LineString} s which form invalid
   *         rings.
   */
  Polygonizer.prototype.getInvalidRingLines = function() {
    this.polygonize();
    return this.invalidRingLines;
  };

  /**
   * Performs the polygonization, if it has not already been carried out.
   */
  Polygonizer.prototype.polygonize = function() {
    // check if already computed
    if (this.polyList != null)
      return;
    this.polyList = new ArrayList();

    // if no geometries were supplied it's possible that graph is null
    if (this.graph == null)
      return;

    this.dangles = this.graph.deleteDangles();
    this.cutEdges = this.graph.deleteCutEdges();
    var edgeRingList = this.graph.getEdgeRings();

    var validEdgeRingList = new ArrayList();
    this.invalidRingLines = new ArrayList();
    this.findValidRings(edgeRingList, validEdgeRingList, this.invalidRingLines);

    this.findShellsAndHoles(validEdgeRingList);
    Polygonizer.assignHolesToShells(this.holeList, this.shellList);

    this.polyList = new ArrayList();
    for (var i = this.shellList.iterator(); i.hasNext();) {
      var er = i.next();
      this.polyList.add(er.getPolygon());
    }
  };

  /**
   * @private
   */
  Polygonizer.prototype.findValidRings = function(edgeRingList,
      validEdgeRingList, invalidRingList) {
    for (var i = edgeRingList.iterator(); i.hasNext();) {
      var er = i.next();
      if (er.isValid())
        validEdgeRingList.add(er);
      else
        invalidRingList.add(er.getLineString());
    }
  };

  /**
   * @private
   */
  Polygonizer.prototype.findShellsAndHoles = function(edgeRingList) {
    this.holeList = new ArrayList();
    this.shellList = new ArrayList();
    for (var i = edgeRingList.iterator(); i.hasNext();) {
      var er = i.next();
      if (er.isHole())
        this.holeList.add(er);
      else
        this.shellList.add(er);
    }
  };

  /**
   * @private
   */
  Polygonizer.assignHolesToShells = function(holeList, shellList) {
    for (var i = holeList.iterator(); i.hasNext();) {
      var holeER = i.next();
      Polygonizer.assignHoleToShell(holeER, shellList);
    }
  };

  /**
   * @private
   */
  Polygonizer.assignHoleToShell = function(holeER, shellList) {
    var shell = EdgeRing.findEdgeRingContaining(holeER, shellList);
    if (shell != null)
      shell.addHole(holeER.getRing());
  };


  jsts.operation.polygonize.Polygonizer = Polygonizer;

})();


