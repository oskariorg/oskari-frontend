/*
 RequireJS 2.2.0 Copyright jQuery Foundation and other contributors.
 Released under MIT license, http://github.com/requirejs/requirejs/LICENSE
*/
var requirejs,require,define;
(function(ga){function ka(b,c,d,g){return g||""}function K(b){return"[object Function]"===Q.call(b)}function L(b){return"[object Array]"===Q.call(b)}function y(b,c){if(b){var d;for(d=0;d<b.length&&(!b[d]||!c(b[d],d,b));d+=1);}}function X(b,c){if(b){var d;for(d=b.length-1;-1<d&&(!b[d]||!c(b[d],d,b));--d);}}function x(b,c){return la.call(b,c)}function e(b,c){return x(b,c)&&b[c]}function D(b,c){for(var d in b)if(x(b,d)&&c(b[d],d))break}function Y(b,c,d,g){c&&D(c,function(c,e){if(d||!x(b,e))!g||"object"!==
typeof c||!c||L(c)||K(c)||c instanceof RegExp?b[e]=c:(b[e]||(b[e]={}),Y(b[e],c,d,g))});return b}function z(b,c){return function(){return c.apply(b,arguments)}}function ha(b){throw b;}function ia(b){if(!b)return b;var c=ga;y(b.split("."),function(b){c=c[b]});return c}function F(b,c,d,g){c=Error(c+"\nhttp://requirejs.org/docs/errors.html#"+b);c.requireType=b;c.requireModules=g;d&&(c.originalError=d);return c}function ma(b){function c(a,n,b){var h,k,f,c,d,l,g,r;n=n&&n.split("/");var q=p.map,m=q&&q["*"];
if(a){a=a.split("/");k=a.length-1;p.nodeIdCompat&&U.test(a[k])&&(a[k]=a[k].replace(U,""));"."===a[0].charAt(0)&&n&&(k=n.slice(0,n.length-1),a=k.concat(a));k=a;for(f=0;f<k.length;f++)c=k[f],"."===c?(k.splice(f,1),--f):".."===c&&0!==f&&(1!==f||".."!==k[2])&&".."!==k[f-1]&&0<f&&(k.splice(f-1,2),f-=2);a=a.join("/")}if(b&&q&&(n||m)){k=a.split("/");f=k.length;a:for(;0<f;--f){d=k.slice(0,f).join("/");if(n)for(c=n.length;0<c;--c)if(b=e(q,n.slice(0,c).join("/")))if(b=e(b,d)){h=b;l=f;break a}!g&&m&&e(m,d)&&
(g=e(m,d),r=f)}!h&&g&&(h=g,l=r);h&&(k.splice(0,l,h),a=k.join("/"))}return(h=e(p.pkgs,a))?h:a}function d(a){E&&y(document.getElementsByTagName("script"),function(n){if(n.getAttribute("data-requiremodule")===a&&n.getAttribute("data-requirecontext")===l.contextName)return n.parentNode.removeChild(n),!0})}function m(a){var n=e(p.paths,a);if(n&&L(n)&&1<n.length)return n.shift(),l.require.undef(a),l.makeRequire(null,{skipMap:!0})([a]),!0}function r(a){var n,b=a?a.indexOf("!"):-1;-1<b&&(n=a.substring(0,
b),a=a.substring(b+1,a.length));return[n,a]}function q(a,n,b,h){var k,f,d=null,g=n?n.name:null,p=a,q=!0,m="";a||(q=!1,a="_@r"+(Q+=1));a=r(a);d=a[0];a=a[1];d&&(d=c(d,g,h),f=e(v,d));a&&(d?m=f&&f.normalize?f.normalize(a,function(a){return c(a,g,h)}):-1===a.indexOf("!")?c(a,g,h):a:(m=c(a,g,h),a=r(m),d=a[0],m=a[1],b=!0,k=l.nameToUrl(m)));b=!d||f||b?"":"_unnormalized"+(T+=1);return{prefix:d,name:m,parentMap:n,unnormalized:!!b,url:k,originalName:p,isDefine:q,id:(d?d+"!"+m:m)+b}}function u(a){var b=a.id,
c=e(t,b);c||(c=t[b]=new l.Module(a));return c}function w(a,b,c){var h=a.id,k=e(t,h);if(!x(v,h)||k&&!k.defineEmitComplete)if(k=u(a),k.error&&"error"===b)c(k.error);else k.on(b,c);else"defined"===b&&c(v[h])}function A(a,b){var c=a.requireModules,h=!1;if(b)b(a);else if(y(c,function(b){if(b=e(t,b))b.error=a,b.events.error&&(h=!0,b.emit("error",a))}),!h)g.onError(a)}function B(){V.length&&(y(V,function(a){var b=a[0];"string"===typeof b&&(l.defQueueMap[b]=!0);G.push(a)}),V=[])}function C(a){delete t[a];
delete Z[a]}function J(a,b,c){var h=a.map.id;a.error?a.emit("error",a.error):(b[h]=!0,y(a.depMaps,function(h,f){var d=h.id,g=e(t,d);!g||a.depMatched[f]||c[d]||(e(b,d)?(a.defineDep(f,v[d]),a.check()):J(g,b,c))}),c[h]=!0)}function H(){var a,b,c=(a=1E3*p.waitSeconds)&&l.startTime+a<(new Date).getTime(),h=[],k=[],f=!1,g=!0;if(!aa){aa=!0;D(Z,function(a){var l=a.map,e=l.id;if(a.enabled&&(l.isDefine||k.push(a),!a.error))if(!a.inited&&c)m(e)?f=b=!0:(h.push(e),d(e));else if(!a.inited&&a.fetched&&l.isDefine&&
(f=!0,!l.prefix))return g=!1});if(c&&h.length)return a=F("timeout","Load timeout for modules: "+h,null,h),a.contextName=l.contextName,A(a);g&&y(k,function(a){J(a,{},{})});c&&!b||!f||!E&&!ja||ba||(ba=setTimeout(function(){ba=0;H()},50));aa=!1}}function I(a){x(v,a[0])||u(q(a[0],null,!0)).init(a[1],a[2])}function O(a){a=a.currentTarget||a.srcElement;var b=l.onScriptLoad;a.detachEvent&&!ca?a.detachEvent("onreadystatechange",b):a.removeEventListener("load",b,!1);b=l.onScriptError;a.detachEvent&&!ca||a.removeEventListener("error",
b,!1);return{node:a,id:a&&a.getAttribute("data-requiremodule")}}function P(){var a;for(B();G.length;){a=G.shift();if(null===a[0])return A(F("mismatch","Mismatched anonymous define() module: "+a[a.length-1]));I(a)}l.defQueueMap={}}var aa,da,l,R,ba,p={waitSeconds:7,baseUrl:"./",paths:{},bundles:{},pkgs:{},shim:{},config:{}},t={},Z={},ea={},G=[],v={},W={},fa={},Q=1,T=1;R={require:function(a){return a.require?a.require:a.require=l.makeRequire(a.map)},exports:function(a){a.usingExports=!0;if(a.map.isDefine)return a.exports?
v[a.map.id]=a.exports:a.exports=v[a.map.id]={}},module:function(a){return a.module?a.module:a.module={id:a.map.id,uri:a.map.url,config:function(){return e(p.config,a.map.id)||{}},exports:a.exports||(a.exports={})}}};da=function(a){this.events=e(ea,a.id)||{};this.map=a;this.shim=e(p.shim,a.id);this.depExports=[];this.depMaps=[];this.depMatched=[];this.pluginMaps={};this.depCount=0};da.prototype={init:function(a,b,c,h){h=h||{};if(!this.inited){this.factory=b;if(c)this.on("error",c);else this.events.error&&
(c=z(this,function(a){this.emit("error",a)}));this.depMaps=a&&a.slice(0);this.errback=c;this.inited=!0;this.ignore=h.ignore;h.enabled||this.enabled?this.enable():this.check()}},defineDep:function(a,b){this.depMatched[a]||(this.depMatched[a]=!0,--this.depCount,this.depExports[a]=b)},fetch:function(){if(!this.fetched){this.fetched=!0;l.startTime=(new Date).getTime();var a=this.map;if(this.shim)l.makeRequire(this.map,{enableBuildCallback:!0})(this.shim.deps||[],z(this,function(){return a.prefix?this.callPlugin():
this.load()}));else return a.prefix?this.callPlugin():this.load()}},load:function(){var a=this.map.url;W[a]||(W[a]=!0,l.load(this.map.id,a))},check:function(){if(this.enabled&&!this.enabling){var a,b,c=this.map.id;b=this.depExports;var h=this.exports,k=this.factory;if(!this.inited)x(l.defQueueMap,c)||this.fetch();else if(this.error)this.emit("error",this.error);else if(!this.defining){this.defining=!0;if(1>this.depCount&&!this.defined){if(K(k)){if(this.events.error&&this.map.isDefine||g.onError!==
ha)try{h=l.execCb(c,k,b,h)}catch(d){a=d}else h=l.execCb(c,k,b,h);this.map.isDefine&&void 0===h&&((b=this.module)?h=b.exports:this.usingExports&&(h=this.exports));if(a)return a.requireMap=this.map,a.requireModules=this.map.isDefine?[this.map.id]:null,a.requireType=this.map.isDefine?"define":"require",A(this.error=a)}else h=k;this.exports=h;if(this.map.isDefine&&!this.ignore&&(v[c]=h,g.onResourceLoad)){var f=[];y(this.depMaps,function(a){f.push(a.normalizedMap||a)});g.onResourceLoad(l,this.map,f)}C(c);
this.defined=!0}this.defining=!1;this.defined&&!this.defineEmitted&&(this.defineEmitted=!0,this.emit("defined",this.exports),this.defineEmitComplete=!0)}}},callPlugin:function(){var a=this.map,b=a.id,d=q(a.prefix);this.depMaps.push(d);w(d,"defined",z(this,function(h){var k,f,d=e(fa,this.map.id),M=this.map.name,r=this.map.parentMap?this.map.parentMap.name:null,m=l.makeRequire(a.parentMap,{enableBuildCallback:!0});if(this.map.unnormalized){if(h.normalize&&(M=h.normalize(M,function(a){return c(a,r,!0)})||
""),f=q(a.prefix+"!"+M,this.map.parentMap),w(f,"defined",z(this,function(a){this.map.normalizedMap=f;this.init([],function(){return a},null,{enabled:!0,ignore:!0})})),h=e(t,f.id)){this.depMaps.push(f);if(this.events.error)h.on("error",z(this,function(a){this.emit("error",a)}));h.enable()}}else d?(this.map.url=l.nameToUrl(d),this.load()):(k=z(this,function(a){this.init([],function(){return a},null,{enabled:!0})}),k.error=z(this,function(a){this.inited=!0;this.error=a;a.requireModules=[b];D(t,function(a){0===
a.map.id.indexOf(b+"_unnormalized")&&C(a.map.id)});A(a)}),k.fromText=z(this,function(h,c){var d=a.name,f=q(d),M=S;c&&(h=c);M&&(S=!1);u(f);x(p.config,b)&&(p.config[d]=p.config[b]);try{g.exec(h)}catch(e){return A(F("fromtexteval","fromText eval for "+b+" failed: "+e,e,[b]))}M&&(S=!0);this.depMaps.push(f);l.completeLoad(d);m([d],k)}),h.load(a.name,m,k,p))}));l.enable(d,this);this.pluginMaps[d.id]=d},enable:function(){Z[this.map.id]=this;this.enabling=this.enabled=!0;y(this.depMaps,z(this,function(a,
b){var c,h;if("string"===typeof a){a=q(a,this.map.isDefine?this.map:this.map.parentMap,!1,!this.skipMap);this.depMaps[b]=a;if(c=e(R,a.id)){this.depExports[b]=c(this);return}this.depCount+=1;w(a,"defined",z(this,function(a){this.undefed||(this.defineDep(b,a),this.check())}));this.errback?w(a,"error",z(this,this.errback)):this.events.error&&w(a,"error",z(this,function(a){this.emit("error",a)}))}c=a.id;h=t[c];x(R,c)||!h||h.enabled||l.enable(a,this)}));D(this.pluginMaps,z(this,function(a){var b=e(t,a.id);
b&&!b.enabled&&l.enable(a,this)}));this.enabling=!1;this.check()},on:function(a,b){var c=this.events[a];c||(c=this.events[a]=[]);c.push(b)},emit:function(a,b){y(this.events[a],function(a){a(b)});"error"===a&&delete this.events[a]}};l={config:p,contextName:b,registry:t,defined:v,urlFetched:W,defQueue:G,defQueueMap:{},Module:da,makeModuleMap:q,nextTick:g.nextTick,onError:A,configure:function(a){a.baseUrl&&"/"!==a.baseUrl.charAt(a.baseUrl.length-1)&&(a.baseUrl+="/");if("string"===typeof a.urlArgs){var b=
a.urlArgs;a.urlArgs=function(a,c){return(-1===c.indexOf("?")?"?":"&")+b}}var c=p.shim,h={paths:!0,bundles:!0,config:!0,map:!0};D(a,function(a,b){h[b]?(p[b]||(p[b]={}),Y(p[b],a,!0,!0)):p[b]=a});a.bundles&&D(a.bundles,function(a,b){y(a,function(a){a!==b&&(fa[a]=b)})});a.shim&&(D(a.shim,function(a,b){L(a)&&(a={deps:a});!a.exports&&!a.init||a.exportsFn||(a.exportsFn=l.makeShimExports(a));c[b]=a}),p.shim=c);a.packages&&y(a.packages,function(a){var b;a="string"===typeof a?{name:a}:a;b=a.name;a.location&&
(p.paths[b]=a.location);p.pkgs[b]=a.name+"/"+(a.main||"main").replace(na,"").replace(U,"")});D(t,function(a,b){a.inited||a.map.unnormalized||(a.map=q(b,null,!0))});(a.deps||a.callback)&&l.require(a.deps||[],a.callback)},makeShimExports:function(a){return function(){var b;a.init&&(b=a.init.apply(ga,arguments));return b||a.exports&&ia(a.exports)}},makeRequire:function(a,n){function m(c,d,f){var e,r;n.enableBuildCallback&&d&&K(d)&&(d.__requireJsBuild=!0);if("string"===typeof c){if(K(d))return A(F("requireargs",
"Invalid require call"),f);if(a&&x(R,c))return R[c](t[a.id]);if(g.get)return g.get(l,c,a,m);e=q(c,a,!1,!0);e=e.id;return x(v,e)?v[e]:A(F("notloaded",'Module name "'+e+'" has not been loaded yet for context: '+b+(a?"":". Use require([])")))}P();l.nextTick(function(){P();r=u(q(null,a));r.skipMap=n.skipMap;r.init(c,d,f,{enabled:!0});H()});return m}n=n||{};Y(m,{isBrowser:E,toUrl:function(b){var d,f=b.lastIndexOf("."),g=b.split("/")[0];-1!==f&&("."!==g&&".."!==g||1<f)&&(d=b.substring(f,b.length),b=b.substring(0,
f));return l.nameToUrl(c(b,a&&a.id,!0),d,!0)},defined:function(b){return x(v,q(b,a,!1,!0).id)},specified:function(b){b=q(b,a,!1,!0).id;return x(v,b)||x(t,b)}});a||(m.undef=function(b){B();var c=q(b,a,!0),f=e(t,b);f.undefed=!0;d(b);delete v[b];delete W[c.url];delete ea[b];X(G,function(a,c){a[0]===b&&G.splice(c,1)});delete l.defQueueMap[b];f&&(f.events.defined&&(ea[b]=f.events),C(b))});return m},enable:function(a){e(t,a.id)&&u(a).enable()},completeLoad:function(a){var b,c,d=e(p.shim,a)||{},g=d.exports;
for(B();G.length;){c=G.shift();if(null===c[0]){c[0]=a;if(b)break;b=!0}else c[0]===a&&(b=!0);I(c)}l.defQueueMap={};c=e(t,a);if(!b&&!x(v,a)&&c&&!c.inited)if(!p.enforceDefine||g&&ia(g))I([a,d.deps||[],d.exportsFn]);else return m(a)?void 0:A(F("nodefine","No define call for "+a,null,[a]));H()},nameToUrl:function(a,b,c){var d,k,f,m;(d=e(p.pkgs,a))&&(a=d);if(d=e(fa,a))return l.nameToUrl(d,b,c);if(g.jsExtRegExp.test(a))d=a+(b||"");else{d=p.paths;k=a.split("/");for(f=k.length;0<f;--f)if(m=k.slice(0,f).join("/"),
m=e(d,m)){L(m)&&(m=m[0]);k.splice(0,f,m);break}d=k.join("/");d+=b||(/^data\:|^blob\:|\?/.test(d)||c?"":".js");d=("/"===d.charAt(0)||d.match(/^[\w\+\.\-]+:/)?"":p.baseUrl)+d}return p.urlArgs&&!/^blob\:/.test(d)?d+p.urlArgs(a,d):d},load:function(a,b){g.load(l,a,b)},execCb:function(a,b,c,d){return b.apply(d,c)},onScriptLoad:function(a){if("load"===a.type||oa.test((a.currentTarget||a.srcElement).readyState))N=null,a=O(a),l.completeLoad(a.id)},onScriptError:function(a){var b=O(a);if(!m(b.id)){var c=[];
D(t,function(a,d){0!==d.indexOf("_@r")&&y(a.depMaps,function(a){if(a.id===b.id)return c.push(d),!0})});return A(F("scripterror",'Script error for "'+b.id+(c.length?'", needed by: '+c.join(", "):'"'),a,[b.id]))}}};l.require=l.makeRequire();return l}function pa(){if(N&&"interactive"===N.readyState)return N;X(document.getElementsByTagName("script"),function(b){if("interactive"===b.readyState)return N=b});return N}var g,B,C,H,O,I,N,P,u,T,qa=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/mg,ra=/[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g,
U=/\.js$/,na=/^\.\//;B=Object.prototype;var Q=B.toString,la=B.hasOwnProperty,E=!("undefined"===typeof window||"undefined"===typeof navigator||!window.document),ja=!E&&"undefined"!==typeof importScripts,oa=E&&"PLAYSTATION 3"===navigator.platform?/^complete$/:/^(complete|loaded)$/,ca="undefined"!==typeof opera&&"[object Opera]"===opera.toString(),J={},w={},V=[],S=!1;if("undefined"===typeof define){if("undefined"!==typeof requirejs){if(K(requirejs))return;w=requirejs;requirejs=void 0}"undefined"===typeof require||
K(require)||(w=require,require=void 0);g=requirejs=function(b,c,d,m){var r,q="_";L(b)||"string"===typeof b||(r=b,L(c)?(b=c,c=d,d=m):b=[]);r&&r.context&&(q=r.context);(m=e(J,q))||(m=J[q]=g.s.newContext(q));r&&m.configure(r);return m.require(b,c,d)};g.config=function(b){return g(b)};g.nextTick="undefined"!==typeof setTimeout?function(b){setTimeout(b,4)}:function(b){b()};require||(require=g);g.version="2.2.0";g.jsExtRegExp=/^\/|:|\?|\.js$/;g.isBrowser=E;B=g.s={contexts:J,newContext:ma};g({});y(["toUrl",
"undef","defined","specified"],function(b){g[b]=function(){var c=J._;return c.require[b].apply(c,arguments)}});E&&(C=B.head=document.getElementsByTagName("head")[0],H=document.getElementsByTagName("base")[0])&&(C=B.head=H.parentNode);g.onError=ha;g.createNode=function(b,c,d){c=b.xhtml?document.createElementNS("http://www.w3.org/1999/xhtml","html:script"):document.createElement("script");c.type=b.scriptType||"text/javascript";c.charset="utf-8";c.async=!0;return c};g.load=function(b,c,d){var m=b&&b.config||
{},e;if(E){e=g.createNode(m,c,d);e.setAttribute("data-requirecontext",b.contextName);e.setAttribute("data-requiremodule",c);!e.attachEvent||e.attachEvent.toString&&0>e.attachEvent.toString().indexOf("[native code")||ca?(e.addEventListener("load",b.onScriptLoad,!1),e.addEventListener("error",b.onScriptError,!1)):(S=!0,e.attachEvent("onreadystatechange",b.onScriptLoad));e.src=d;if(m.onNodeCreated)m.onNodeCreated(e,m,c,d);P=e;H?C.insertBefore(e,H):C.appendChild(e);P=null;return e}if(ja)try{setTimeout(function(){},
0),importScripts(d),b.completeLoad(c)}catch(q){b.onError(F("importscripts","importScripts failed for "+c+" at "+d,q,[c]))}};E&&!w.skipDataMain&&X(document.getElementsByTagName("script"),function(b){C||(C=b.parentNode);if(O=b.getAttribute("data-main"))return u=O,w.baseUrl||-1!==u.indexOf("!")||(I=u.split("/"),u=I.pop(),T=I.length?I.join("/")+"/":"./",w.baseUrl=T),u=u.replace(U,""),g.jsExtRegExp.test(u)&&(u=O),w.deps=w.deps?w.deps.concat(u):[u],!0});define=function(b,c,d){var e,g;"string"!==typeof b&&
(d=c,c=b,b=null);L(c)||(d=c,c=null);!c&&K(d)&&(c=[],d.length&&(d.toString().replace(qa,ka).replace(ra,function(b,d){c.push(d)}),c=(1===d.length?["require"]:["require","exports","module"]).concat(c)));S&&(e=P||pa())&&(b||(b=e.getAttribute("data-requiremodule")),g=J[e.getAttribute("data-requirecontext")]);g?(g.defQueue.push([b,c,d]),g.defQueueMap[b]=!0):V.push([b,c,d])};define.amd={jQuery:!0};g.exec=function(b){return eval(b)};g(w)}})(this);

/**
 * @license RequireJS text 2.0.14 Copyright (c) 2010-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/requirejs/text for details
 */
/*jslint regexp: true */
/*global require, XMLHttpRequest, ActiveXObject,
  define, window, process, Packages,
  java, location, Components, FileUtils */

define('text', ['module'], function (module) {
    'use strict';

    var text, fs, Cc, Ci, xpcIsWindows,
        progIds = ['Msxml2.XMLHTTP', 'Microsoft.XMLHTTP', 'Msxml2.XMLHTTP.4.0'],
        xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im,
        bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im,
        hasLocation = typeof location !== 'undefined' && location.href,
        defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ''),
        defaultHostName = hasLocation && location.hostname,
        defaultPort = hasLocation && (location.port || undefined),
        buildMap = {},
        masterConfig = (module.config && module.config()) || {};

    text = {
        version: '2.0.14',

        strip: function (content) {
            //Strips <?xml ...?> declarations so that external SVG and XML
            //documents can be added to a document without worry. Also, if the string
            //is an HTML document, only the part inside the body tag is returned.
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                if (matches) {
                    content = matches[1];
                }
            } else {
                content = "";
            }
            return content;
        },

        jsEscape: function (content) {
            return content.replace(/(['\\])/g, '\\$1')
                .replace(/[\f]/g, "\\f")
                .replace(/[\b]/g, "\\b")
                .replace(/[\n]/g, "\\n")
                .replace(/[\t]/g, "\\t")
                .replace(/[\r]/g, "\\r")
                .replace(/[\u2028]/g, "\\u2028")
                .replace(/[\u2029]/g, "\\u2029");
        },

        createXhr: masterConfig.createXhr || function () {
            //Would love to dump the ActiveX crap in here. Need IE 6 to die first.
            var xhr, i, progId;
            if (typeof XMLHttpRequest !== "undefined") {
                return new XMLHttpRequest();
            } else if (typeof ActiveXObject !== "undefined") {
                for (i = 0; i < 3; i += 1) {
                    progId = progIds[i];
                    try {
                        xhr = new ActiveXObject(progId);
                    } catch (e) {}

                    if (xhr) {
                        progIds = [progId];  // so faster next time
                        break;
                    }
                }
            }

            return xhr;
        },

        /**
         * Parses a resource name into its component parts. Resource names
         * look like: module/name.ext!strip, where the !strip part is
         * optional.
         * @param {String} name the resource name
         * @returns {Object} with properties "moduleName", "ext" and "strip"
         * where strip is a boolean.
         */
        parseName: function (name) {
            var modName, ext, temp,
                strip = false,
                index = name.lastIndexOf("."),
                isRelative = name.indexOf('./') === 0 ||
                             name.indexOf('../') === 0;

            if (index !== -1 && (!isRelative || index > 1)) {
                modName = name.substring(0, index);
                ext = name.substring(index + 1);
            } else {
                modName = name;
            }

            temp = ext || modName;
            index = temp.indexOf("!");
            if (index !== -1) {
                //Pull off the strip arg.
                strip = temp.substring(index + 1) === "strip";
                temp = temp.substring(0, index);
                if (ext) {
                    ext = temp;
                } else {
                    modName = temp;
                }
            }

            return {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },

        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,

        /**
         * Is an URL on another domain. Only works for browser use, returns
         * false in non-browser environments. Only used to know if an
         * optimized .js version of a text resource should be loaded
         * instead.
         * @param {String} url
         * @returns Boolean
         */
        useXhr: function (url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort,
                match = text.xdRegExp.exec(url);
            if (!match) {
                return true;
            }
            uProtocol = match[2];
            uHostName = match[3];

            uHostName = uHostName.split(':');
            uPort = uHostName[1];
            uHostName = uHostName[0];

            return (!uProtocol || uProtocol === protocol) &&
                   (!uHostName || uHostName.toLowerCase() === hostname.toLowerCase()) &&
                   ((!uPort && !uHostName) || uPort === port);
        },

        finishLoad: function (name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content;
            if (masterConfig.isBuild) {
                buildMap[name] = content;
            }
            onLoad(content);
        },

        load: function (name, req, onLoad, config) {
            //Name has format: some.module.filext!strip
            //The strip part is optional.
            //if strip is present, then that means only get the string contents
            //inside a body tag in an HTML string. For XML/SVG content it means
            //removing the <?xml ...?> declarations so the content can be inserted
            //into the current doc without problems.

            // Do not bother with the work if a build and text will
            // not be inlined.
            if (config && config.isBuild && !config.inlineText) {
                onLoad();
                return;
            }

            masterConfig.isBuild = config && config.isBuild;

            var parsed = text.parseName(name),
                nonStripName = parsed.moduleName +
                    (parsed.ext ? '.' + parsed.ext : ''),
                url = req.toUrl(nonStripName),
                useXhr = (masterConfig.useXhr) ||
                         text.useXhr;

            // Do not load if it is an empty: url
            if (url.indexOf('empty:') === 0) {
                onLoad();
                return;
            }

            //Load the text. Use XHR if possible and in a browser.
            if (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort)) {
                text.get(url, function (content) {
                    text.finishLoad(name, parsed.strip, content, onLoad);
                }, function (err) {
                    if (onLoad.error) {
                        onLoad.error(err);
                    }
                });
            } else {
                //Need to fetch the resource across domains. Assume
                //the resource has been optimized into a JS module. Fetch
                //by the module name + extension, but do not include the
                //!strip part to avoid file system issues.
                req([nonStripName], function (content) {
                    text.finishLoad(parsed.moduleName + '.' + parsed.ext,
                                    parsed.strip, content, onLoad);
                });
            }
        },

        write: function (pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName,
                               "define(function () { return '" +
                                   content +
                               "';});\n");
            }
        },

        writeFile: function (pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName),
                extPart = parsed.ext ? '.' + parsed.ext : '',
                nonStripName = parsed.moduleName + extPart,
                //Use a '.js' file name so that it indicates it is a
                //script that can be loaded across domains.
                fileName = req.toUrl(parsed.moduleName + extPart) + '.js';

            //Leverage own load() method to load plugin value, but only
            //write out values that do not have the strip argument,
            //to avoid any potential issues with ! in file names.
            text.load(nonStripName, req, function (value) {
                //Use own write() method to construct full module value.
                //But need to create shell that translates writeFile's
                //write() to the right interface.
                var textWrite = function (contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function (moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                };

                text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    };

    if (masterConfig.env === 'node' || (!masterConfig.env &&
            typeof process !== "undefined" &&
            process.versions &&
            !!process.versions.node &&
            !process.versions['node-webkit'] &&
            !process.versions['atom-shell'])) {
        //Using special require.nodeRequire, something added by r.js.
        fs = require.nodeRequire('fs');

        text.get = function (url, callback, errback) {
            try {
                var file = fs.readFileSync(url, 'utf8');
                //Remove BOM (Byte Mark Order) from utf8 files if it is there.
                if (file[0] === '\uFEFF') {
                    file = file.substring(1);
                }
                callback(file);
            } catch (e) {
                if (errback) {
                    errback(e);
                }
            }
        };
    } else if (masterConfig.env === 'xhr' || (!masterConfig.env &&
            text.createXhr())) {
        text.get = function (url, callback, errback, headers) {
            var xhr = text.createXhr(), header;
            xhr.open('GET', url, true);

            //Allow plugins direct access to xhr headers
            if (headers) {
                for (header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        xhr.setRequestHeader(header.toLowerCase(), headers[header]);
                    }
                }
            }

            //Allow overrides specified in config
            if (masterConfig.onXhr) {
                masterConfig.onXhr(xhr, url);
            }

            xhr.onreadystatechange = function (evt) {
                var status, err;
                //Do not explicitly handle errors, those should be
                //visible via console output in the browser.
                if (xhr.readyState === 4) {
                    status = xhr.status || 0;
                    if (status > 399 && status < 600) {
                        //An http 4xx or 5xx error. Signal an error.
                        err = new Error(url + ' HTTP status: ' + status);
                        err.xhr = xhr;
                        if (errback) {
                            errback(err);
                        }
                    } else {
                        callback(xhr.responseText);
                    }

                    if (masterConfig.onXhrComplete) {
                        masterConfig.onXhrComplete(xhr, url);
                    }
                }
            };
            xhr.send(null);
        };
    } else if (masterConfig.env === 'rhino' || (!masterConfig.env &&
            typeof Packages !== 'undefined' && typeof java !== 'undefined')) {
        //Why Java, why is this so awkward?
        text.get = function (url, callback) {
            var stringBuffer, line,
                encoding = "utf-8",
                file = new java.io.File(url),
                lineSeparator = java.lang.System.getProperty("line.separator"),
                input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)),
                content = '';
            try {
                stringBuffer = new java.lang.StringBuffer();
                line = input.readLine();

                // Byte Order Mark (BOM) - The Unicode Standard, version 3.0, page 324
                // http://www.unicode.org/faq/utf_bom.html

                // Note that when we use utf-8, the BOM should appear as "EF BB BF", but it doesn't due to this bug in the JDK:
                // http://bugs.sun.com/bugdatabase/view_bug.do?bug_id=4508058
                if (line && line.length() && line.charAt(0) === 0xfeff) {
                    // Eat the BOM, since we've already found the encoding on this file,
                    // and we plan to concatenating this buffer with others; the BOM should
                    // only appear at the top of a file.
                    line = line.substring(1);
                }

                if (line !== null) {
                    stringBuffer.append(line);
                }

                while ((line = input.readLine()) !== null) {
                    stringBuffer.append(lineSeparator);
                    stringBuffer.append(line);
                }
                //Make sure we return a JavaScript string and not a Java string.
                content = String(stringBuffer.toString()); //String
            } finally {
                input.close();
            }
            callback(content);
        };
    } else if (masterConfig.env === 'xpconnect' || (!masterConfig.env &&
            typeof Components !== 'undefined' && Components.classes &&
            Components.interfaces)) {
        //Avert your gaze!
        Cc = Components.classes;
        Ci = Components.interfaces;
        Components.utils['import']('resource://gre/modules/FileUtils.jsm');
        xpcIsWindows = ('@mozilla.org/windows-registry-key;1' in Cc);

        text.get = function (url, callback) {
            var inStream, convertStream, fileObj,
                readData = {};

            if (xpcIsWindows) {
                url = url.replace(/\//g, '\\');
            }

            fileObj = new FileUtils.File(url);

            //XPCOM, you so crazy
            try {
                inStream = Cc['@mozilla.org/network/file-input-stream;1']
                           .createInstance(Ci.nsIFileInputStream);
                inStream.init(fileObj, 1, 0, false);

                convertStream = Cc['@mozilla.org/intl/converter-input-stream;1']
                                .createInstance(Ci.nsIConverterInputStream);
                convertStream.init(inStream, "utf-8", inStream.available(),
                Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER);

                convertStream.readString(inStream.available(), readData);
                convertStream.close();
                inStream.close();
                callback(readData.value);
            } catch (e) {
                throw new Error((fileObj && fileObj.path || '') + ': ' + e);
            }
        };
    }
    return text;
});

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}

// Define outerHtml method for jQuery since we need to give openlayers plain html
// http://stackoverflow.com/questions/2419749/get-selected-elements-outer-html
// Elements outerHtml property only works on IE and chrome
jQuery.fn.outerHTML = function (arg) {
    var ret;

    // If no items in the collection, return
    if (!this.length) {
        return typeof arg === 'undefined' ? this : null;
    }
    // Getter overload (no argument passed)
    if (!arg) {
        return this[0].outerHTML || (ret = this.wrap('<div>').parent().html(), this.unwrap(), ret);
    }
    // Setter overload
    jQuery.each(this, function (i, el) {
        var fnRet,
            pass = el,
            inOrOut = el.outerHTML ? 'outerHTML' : 'innerHTML';

        if (!el.outerHTML) {
            el = jQuery(el).wrap('<div>').parent()[0];
        }

        if (jQuery.isFunction(arg)) {
            if ((fnRet = arg.call(pass, i, el[inOrOut])) !== false) {
                el[inOrOut] = fnRet;
            }
        } else {
            el[inOrOut] = arg;
        }

        if (!el.outerHTML) {
            jQuery(el).children().unwrap();
        }
    });

    return this;
};
/**
 * @class Oskari
 *
 * Oskari
 *
 * A set of methods to support loosely coupled classes and instances for the
 * mapframework
 *
 * @to-do - class instance checks against class metadata - protocol
 *        implementation validation
 *
 * 2014-09-25 additions
 * - added documentation
 * - backported cleaned up version from O2
 * - dead code elimination
 * - linted
 * - marked private functions
 * - reordered
 * - sensible/descriptive naming
 * - added type checks to arguments
 *
 * 2012-11-30 additions
 * - dropped compatibility for pre 2010-04 classes
 * - removed fixed root package requirement 'Oskari.' - implementing namespaces
 * - inheritance with extend() or extend: [] meta
 * - inheritance implemented as a brutal copy down of super clazz methods
 * - super clazz constructors applied behind the scenes in top-down order
 * - this implementation does *not* implement native js  instanceof for class hierarchies
 * - inheritance supports pushing down new method categories applied to super classes
 * - this implementation does not provide super.func() calls - may be added at a later stage
 *
 */
Oskari = (function () {
    var oskariVersion = "1.36.0";

    var isDebug = false,
        isConsole = window.console && window.console.debug,
        logMsg = function (msg) {
            if (!isDebug) {
                return;
            }

            if (!isConsole) {
                return;
            }
            window.console.debug(msg);

        };

    /**
     * @class Oskari.Bundle_locale
     * A localisation registry
     */
    var Bundle_locale = function () {
        this.lang = null;
        this.localizations = {};
        this.supportedLocales = null;
    };

    Bundle_locale.prototype = {

        /**
         * @public @method getLocalization
         *
         * @param  {string} key Key
         *
         * @param  {string} lang Lang
         *
         * @param  {boolean} fallbackToDefault whether to fall back to Oskari Default language in case localization is not found for given lang
         *
         * @return {string}     Localized value for key
         */
        getLocalization: function (key, lang, fallbackToDefault) {
            var l = lang || this.lang;
            if (key === null || key === undefined) {
                throw new TypeError(
                    'getLocalization(): Missing key'
                );
            }
            if (!this.localizations) {
                return null;
            }
            if(this.localizations[l] && this.localizations[l][key]) {
                return this.localizations[l][key];
            } else {
                if (fallbackToDefault && this.localizations[Oskari.getDefaultLanguage()] && this.localizations[Oskari.getDefaultLanguage()][key]) {
                    return this.localizations[Oskari.getDefaultLanguage()][key];
                } else {
                    return null;
                }
            }
        },

        /**
         * @public @method setLocalization
         *
         * @param {string}  lang  Language
         * @param {string}  key   Key
         * @param {string=} value Value
         *
         */
        setLocalization: function (lang, key, value) {
            if (lang === null || lang === undefined) {
                throw new TypeError(
                    'setLocalization(): Missing lang'
                );
            }
            if (key === null || key === undefined) {
                throw new TypeError(
                    'setLocalization(): Missing key'
                );
            }
            if (!this.localizations[lang]) {
                this.localizations[lang] = {};
            }
            this.localizations[lang][key] = value;
        },

        /**
         * @public @method getLang
         *
         *
         * @return {string} Language
         */
        getLang: function () {
            return this.lang;
        },

        /**
         * @public @method setLang
         *
         * @param {string} lang Language
         *
         */
        setLang: function (lang) {
            if (lang === null || lang === undefined) {
                throw new TypeError(
                    'setLang(): Missing lang'
                );
            }
            this.lang = lang;
        },

        /**
         * @public @method getDecimalSeparator
         *
         *
         * @return {string} Decimal separator
         */
        getDecimalSeparator: function () {
            var me = this,
                lang = me.getLang(),
                locales = me.getSupportedLocales().filter(
                    function (locale){
                        return locale.indexOf(lang) === 0;
                    }
                ),
                separators = locales.map(function (locale) {
                        return me.getDecimalSeparators()[locale];
                    }
                );

            if (separators.length > 1 &&console && console.warn) {
                console.warn(
                    'Found more than one separator for ' + this.getLang()
                );
            }

            if (separators.length && separators[0]) {
                return separators[0];
            }
            return ','; // Most common separator
        },


        getDecimalSeparators: function () {
            return this.decimalSeparators;
        },

        /**
         * @public @method setDecimalSeparators
         *
         * @param {Object} decimalSeparators Decimal separators
         *
         */
        setDecimalSeparators: function (decimalSeparators) {
            this.decimalSeparators = decimalSeparators;
        },

        /**
         * @public @method getSupportedLanguages
         *
         *
         * @return {string[]} Supported languages
         */
        getSupportedLanguages: function () {
            var langs = [],
                supported = this.getSupportedLocales(),
                locale,
                i;

            for (i = 0; i < supported.length; i += 1) {
                locale = supported[i];
                // FIXME what do if indexOf === -1?
                langs.push(locale.substring(0, locale.indexOf('_')));
            }
            return langs;
        },

        /**
         * @public @method getSupportedLocales
         *
         *
         * @return {string[]} Supported locales
         */
        getSupportedLocales: function () {
            return this.supportedLocales || [];
        },

        /**
         * @public @method setSupportedLocales
         *
         * @param {string[]} locales Locales array
         *
         */
        setSupportedLocales: function (locales) {
            if (locales === null || locales === undefined) {
                throw new TypeError(
                    'setSupportedLocales(): Missing locales'
                );
            }
            if (!Array.isArray(locales)) {
                throw new TypeError(
                    'setSupportedLocales(): locales is not an array'
                );
            }
            this.supportedLocales = locales;
        },

        /**
         * @public @method getDefaultLanguage
         *
         *
         * @return {string} Default language
         */
        getDefaultLanguage: function () {
            var supported = this.getSupportedLocales();

            if(supported.length === 0) {
                // supported locales not set, use current
                if (console && console.warn) {
                    console.warn(
                        'Supported locales not set, using current language ' + this.getLang()
                    );
                }
                return this.getLang();
            }
            var locale = supported[0];

            if (locale.indexOf('_') !== -1) {
                return locale.substring(0, locale.indexOf('_'));
            }
            return this.getLang();
        }
    };

    /**
     * singleton localisation registry instance
     */
    var blocale = new Bundle_locale();

    /**
     * 'dev' adds ?ts=<instTs> parameter to js loads 'default' does not add
     * 'static' assumes srcs are already loaded <any-other> is assumed as a
     * request to load built js packs using this path pattern
     * .../<bundles-path>/<bundle-name>/build/<any-other>.js
     */
    var supportBundleAsync = false,
        mode = 'default',
        // 'static' / 'dynamic'
        instTs = new Date().getTime(),
        basePathForBundles = null,
        pathBuilders = {

            /**
             * @public @method default
             *
             * @param  {string}  fileName File name
             * @param  {string=} basePath Base path (unused)
             *
             * @return {string}
             */
            'default': function (fileName, basePath) {
                if (basePathForBundles) {
                    return basePathForBundles + fileName;
                }
                return fileName;
            },

            /**
             * @public @method dev
             *
             * @param  {string}  fileName File name
             * @param  {string=} basePath Base path (unused)
             *
             * @return {string}
             */
            dev: function (fileName, basePath) {
                if (basePathForBundles) {
                    return basePathForBundles + fileName;
                }
                return fileName;
            }
        };


    /**
     * @private @method _buildPathForLoaderMode
     *
     * @param  {string}  fileName File name
     * @param  {string=} basePath Base path
     *
     * @return {string}
     */
    function _buildPathForLoaderMode(fileName, basePath) {
        var pathBuilder = pathBuilders[mode];
        if (!pathBuilder) {
            if (basePathForBundles) {
                return basePathForBundles + fileName;
            }
            return fileName;
        }

        return pathBuilder(fileName, basePath);
    }

    /**
     * @private @property _isNotPackMode
     */
    var _isNotPackMode = {
            dev: true,
            'default': true,
            'static': true
        };

    /**
     * @private @property _preloaded
     */
    var _preloaded = false;

    /**
     * @private @method _isPackedMode
     *
     *
     * @return {boolean}
     */
    function _isPackedMode() {
        return !_isNotPackMode[mode];
    }

    /**
     * @private @method _isPreloaded
     *
     *
     * @return {boolean}
     */
    function _isPreloaded() {
        return _preloaded;
    }

    /**
     * @private @method _buildPathForPackedMode
     *
     * @param  {string} basePath Base path
     *
     * @return {string}          Build path for packed mode
     */
    function _buildPathForPackedMode(basePath) {
        return basePath + '/build/' + mode + '.js';
    }

    /**
     * @private @method _buildBundlePathForPackedMode
     *
     * @param  {string} basePath Base path
     *
     * @return {string}          Bundle path for packed mode
     */
    function _buildBundlePathForPackedMode(basePath) {
        return basePath + '/build/bundle-' + mode + '.js';
    }

    /**
     * @private @method _buildLocalePathForPackedMode
     *
     * @param  {string} basePath Base path
     *
     * @return {string}          Locale path for packed mode
     */
    function _buildLocalePathForPackedMode(basePath) {
        return basePath + '/build/' + mode + '-locale-' + blocale.getLang() +
            '.js';
    }

    /**
     *
     */
    var O2ClassSystem = function () {
        this.packages = {};
        this.protocols = {};
        this.inheritance = {};
        this.aspects = {};
        this.classcache = {};
        this.globals = {};
    };

    O2ClassSystem.prototype = {

        /**
         * @public @method purge
         */
        purge: function () {
            // TODO implement & document?
            return undefined;
        },

        /**
         * @public @method protocol
         *
         * @param  {string} protocolName Protocol name
         *
         * @return {Object}              Protocol
         */
        protocol: function (protocolName) {
            if (protocolName === null || protocolName === undefined) {
                throw new TypeError('protocol(): Missing protocolName');
            }
            return this.protocols[protocolName];
        },

        /**
         * @private @method _getPackageDefinition
         *
         * @param  {string} packageName Package name
         *
         * @return {Object}             Package definition
         */
        _getPackageDefinition: function (packageName) {
            var packageDefinition = this.packages[packageName];

            if (!packageDefinition) {
                packageDefinition = {};
                this.packages[packageName] = packageDefinition;
            }
            return packageDefinition;
        },

        /**
         * @private @method _getClassQName
         *
         * @param  {string} className Class name
         *
         * @return {Object}           ClassQName
         */
        _getClassQName: function (className) {
            var parts = className.split('.');

            return {
                basePkg: parts[0],
                pkg: parts[1],
                sp: parts.slice(2).join('.')
            };
        },

        /**
         * @private @method _getClassInfo
         *
         * @param  {string} className Class name
         *
         * @return {Object}           ClassInfo
         */
        _getClassInfo: function (className) {
            var classInfo = this.classcache[className],
                classQName = this._getClassQName(className),
                packageDefinition;

            if (!classInfo) {
                packageDefinition = this._getPackageDefinition(classQName.pkg);
                classInfo = packageDefinition[classQName.sp];
                this.classcache[className] = classInfo;
            }
            return classInfo;
        },

        /**
         * @private @method _cloneProperties
         *
         * @param {Object}          from
         * @param {Object|Object[]} to
         *
         */
        _cloneProperties: function (from, to) {
            var i,
                propertyName,
                propertyValue,
                toArray = Array.isArray(to) ? to : [to];

            for (propertyName in from) {
                if (from.hasOwnProperty(propertyName)) {
                    propertyValue = from[propertyName];
                    for (i = toArray.length - 1; i >= 0; i -= 1) {
                        toArray[i][propertyName] = propertyValue;
                    }
                }
            }
        },

        /**
         * @private @method _createEmptyClassDefinition
         *
         *
         * @return {function()} Empty function with an empty prototype
         */
        _createEmptyClassDefinition: function () {
            var ret = function () {
                return undefined;
            };
            ret.prototype = {};
            return ret;
        },

        /**
         * @public @method getMetadata
         * Returns metadata for the class
         *
         * @param  {string} className Class name
         *
         * @return {Object}           Class metadata
         */
        getMetadata: function (className) {
            var classInfo;
            if (className === null || className === undefined) {
                throw new TypeError('metadata(): Missing className');
            }
            classInfo = this._getClassInfo(className);
            if (!classInfo) {
                throw 'Class ' + className + ' does not exist';
            }
            return classInfo._metadata;
        },

        /**
         * @private @method _updateMetadata
         * Updates and binds class metadata
         *
         * @param {string} basePkg   Base package
         * @param {string} pkg       Package
         * @param {string} sp
         * @param {Object} classInfo ClassInfo
         * @param {Object} classMeta Class metadata
         *
         */
        _updateMetadata: function (basePkg, pkg, sp, classInfo, classMeta) {
            var protocols,
                p,
                pt,
                className;

            if (!classInfo._metadata) {
                classInfo._metadata = {};
            }
            classInfo._metadata.meta = classMeta;
            className = [basePkg, pkg, sp].join('.');
            protocols = classMeta.protocol;
            if (protocols) {
                for (p = 0; p < protocols.length; p += 1) {
                    pt = protocols[p];
                    if (!this.protocols[pt]) {
                        this.protocols[pt] = {};
                    }
                    this.protocols[pt][className] = classInfo;
                }
            }
        },

        /**
         * @private @method _super
         *
         * @param  {string} supCat
         * @param  {string} supMet
         *
         * @return
         */
        _super: function (supCat, supMet) {
            var me = this;

            return function () {
                return me._._superCategory[supCat][supMet].apply(me, arguments);
            };
        },

        /**
         * @public @method define Creates a class definition.
         *
         * @param  {string}   className        Class name
         * @param  {function} classConstructor Class constructor function
         * @param  {Object}   prototype        A property object containing
         *                                     methods and definitions for the
         *                                     class prototype
         * @param  {Object}   metadata         Optional metadata for the class
         *
         * @return {Object}                    ClassInfo
         */
        define: function (className, classConstructor, prototype, metadata) {
            var classDefinition,
                classQName,
                composition,
                packageDefinition,
                classInfo,
                e,
                extnds,
                superClass;

            if (className === null || className === undefined) {
                throw new TypeError('define(): Missing className');
            }

            if (typeof classConstructor !== 'function') {
                throw new TypeError(
                    'define(): classConstructor is not a function'
                );
            }

            // Prototype is undefined for Oskari._.1
            if (prototype && typeof prototype !== 'object') {
                throw new TypeError('define(): Prototype is not an object');
            }

            classQName = this._getClassQName(className);
            packageDefinition = this._getPackageDefinition(classQName.pkg);
            classInfo = packageDefinition[classQName.sp];

            if (!classInfo) {
                classDefinition = this._createEmptyClassDefinition();
                composition = {
                    className: className,
                    superClass: null,
                    subClass: null
                };

                classInfo = {
                    _class: classDefinition,
                    _constructor: classConstructor,
                    _category: {},
                    _composition: composition
                };
                classDefinition.prototype._ = classInfo;
                classDefinition.prototype._super = this._super;
                this.inheritance[className] = composition;
                packageDefinition[classQName.sp] = classInfo;
            }
            // update constrcutor
            if (classConstructor) {
                classInfo._constructor = classConstructor;
            }
            // update prototype
            if (prototype) {
                this._cloneProperties(prototype, classInfo._class.prototype);
                classInfo._category[className] = prototype;
            }
            // update metadata
            if (metadata) {
                extnds = metadata.extend;
                for (e = 0; extnds && e < extnds.length; e += 1) {
                    superClass = this.lookup(extnds[e]);
                    if (!superClass._composition.subClass) {
                        superClass._composition.subClass = {};
                    }
                    superClass._composition.subClass[className] = classInfo;
                    classInfo._composition.superClass = superClass;
                }
                this._updateMetadata(
                    classQName.basePkg,
                    classQName.pkg,
                    classQName.sp,
                    classInfo,
                    metadata
                );
            }
            this._pullDown(classInfo);
            this._pushDown(classInfo);
            return classInfo;
        },

        /**
         * @public @method category
         * Adds some logical group of methods to class prototype
         * Oskari.clazz.category(
         * 'Oskari.mapframework.request.common.' +
         * 'ActivateOpenlayersMapControlRequest',
         * 'map-layer-funcs',{ "xxx": function () {} }
         * );
         *
         * @param  {string} className    Class name
         * @param  {string} categoryName Category name
         * @param  {Object} prototype    Prototype
         *
         * @return {Object}              ClassInfo
         */
        category: function (className, categoryName, prototype) {
            var classDefinition,
                classInfo,
                classQName,
                composition,
                packageDefinition,
                prot;

            if (className === null || className === undefined) {
                throw new TypeError('category(): Missing className');
            }

            classQName = this._getClassQName(className);
            packageDefinition = this._getPackageDefinition(classQName.pkg);
            classInfo = packageDefinition[classQName.sp];

            if (!classInfo) {
                classDefinition = this._createEmptyClassDefinition();
                composition = {
                    className: className,
                    superClass: null,
                    subClass: null
                };
                // TODO why do we set categoryName as constructor?
                classInfo = {
                    _class: classDefinition,
                    _constructor: categoryName,
                    _category: {},
                    _composition: composition
                };
                classDefinition.prototype._ = classInfo;
                classDefinition.prototype._super = this._super;
                this.inheritance[className] = composition;
                packageDefinition[classQName.sp] = classInfo;
            }
            prot = classInfo._class.prototype;
            this._cloneProperties(prototype, prot);
            if (prototype) {
                classInfo._category[categoryName] = prototype;
            }
            this._pullDown(classInfo);
            this._pushDown(classInfo);
            return classInfo;
        },

        /**
         * @public @method lookup
         *
         * @param  {string} className   Class name
         * @param           constructor Constructor
         *
         * @return {Object}             ClassInfo
         */
        lookup: function (className, constructor) {
            var classDefinition,
                classQName,
                composition,
                packageDefinition,
                classInfo;

            if (className === null || className === undefined) {
                throw new TypeError('lookup(): Missing className');
            }
            // TODO constructor seems to be undefined all the time?

            classQName = this._getClassQName(className);
            packageDefinition = this._getPackageDefinition(classQName.pkg);
            classInfo = packageDefinition[classQName.sp];

            if (!classInfo) {
                classDefinition = this._createEmptyClassDefinition();
                composition = {
                    className: className,
                    superClass: null,
                    subClass: null
                };
                classInfo = {
                    _class: classDefinition,
                    _constructor: constructor,
                    _category: {},
                    _composition: composition
                };
                this.inheritance[className] = composition;
                packageDefinition[classQName.sp] = classInfo;
            }
            return classInfo;
        },

        /**
         * @public @method extend
         *
         * @param  {string} subClassName   SubClass name
         * @param  {string} superClassName SuperClass name
         *
         * @return {Object}                SubClass
         */
        extend: function (subClassName, superClassName) {
            var superClass,
                subClass;

            if (subClassName === null || subClassName === undefined) {
                throw new TypeError('extend(): Missing subClassName');
            }

            if (superClassName === null || superClassName === undefined) {
                throw new TypeError('extend(): Missing superClassName');
            }

            superClass = this.lookup(superClassName);
            subClass = this.lookup(subClassName);

            if (!superClass._composition.subClass) {
                superClass._composition.subClass = {};
            }
            superClass._composition.subClass[subClassName] = subClass;
            subClass._composition.superClass = superClass;
            this._pullDown(subClass);
            return subClass;
        },

        /**
         * @private @method _pushDown
         * Force each derived class to pullDown.
         * Some overhead here if complex hierarchies are implemented.
         *
         * @param  {Object} classInfo ClassInfo
         *
         * @return {Object}           ClassInfo
         */
        _pushDown: function (classInfo) {
            var subName,
                pdefsub;

            if (classInfo === null || classInfo === undefined) {
                throw new TypeError('_pushDown(): Missing classInfo');
            }

            /* !self */
            if (!classInfo._composition.subClass) {
                return;
            }
            for (subName in classInfo._composition.subClass) {
                if (classInfo._composition.subClass.hasOwnProperty(subName)) {
                    pdefsub = classInfo._composition.subClass[subName];
                    this._pullDown(pdefsub);
                    this._pushDown(pdefsub);
                }
            }
            return classInfo;
        },

        /**
         * @private @method _pullDown
         * EACH class is responsible for it's entire hierarchy
         * no intermediate results are being consolidated
         *
         * @param  {Object} classInfo ClassInfo
         *
         * @return {Object}           ClassInfo
         */
        _pullDown: function (classInfo) {
            var i,
                category,
                clazz,
                classHierarchy,
                className,
                classConstructor,
                classMethods,
                classPrototype,
                prototype,
                superClassInfo;

            if (classInfo === null || classInfo === undefined) {
                throw new TypeError('_pullDown(): Missing classInfo');
            }

            if (!classInfo._composition.superClass) {
                // Class doesn't extend
                return;
            }
            // Class hierarchy from bottom (i.e. given class) up
            classHierarchy = [];
            classHierarchy.push(classInfo);
            superClassInfo = classInfo;
            while (true) {
                superClassInfo = superClassInfo._composition.superClass;
                if (!superClassInfo) {
                    break;
                }
                classHierarchy.push(superClassInfo);
            }

            classInfo._constructors = [];
            classInfo._superCategory = {};
            classPrototype = classInfo._class.prototype;
            // Traverse class hierarchy from topmost super to given class,
            // add found methods to class info
            for (i = classHierarchy.length - 1; i >= 0; i -= 1) {
                clazz = classHierarchy[i];
                className = clazz._composition.className;
                classConstructor = clazz._constructor;
                classInfo._constructors.push(classConstructor);
                classMethods = {};
                // TODO explain categories?
                for (category in clazz._category) {
                    if (clazz._category.hasOwnProperty(category)) {
                        prototype = clazz._category[category];
                        this._cloneProperties(
                            prototype,
                            [classPrototype, classMethods]
                        );
                    }
                }
                classInfo._superCategory[className] = classMethods;
            }
            return classInfo;
        },

        /**
         * @private @method _slicer
         */
        _slicer: Array.prototype.slice,

        /**
         * @public @method create
         * Creates a class instance
         *
         * @param  {string} className Class name
         *
         * @return {Object}           Class instance
         */
        create: function (className) {
            var classInfo,
                classInstance,
                constructors,
                i,
                instanceArguments;

            if (className === null || className === undefined) {
                throw new TypeError('create(): Missing className');
            }

            instanceArguments = this._slicer.apply(arguments, [1]);
            classInfo = this._getClassInfo(className);
            if (!classInfo) {
                // If this error is thrown,
                // the class definition is missing.
                // Ensure the file has been loaded before use
                throw 'Class "' + className + '" does not exist';
            }
            classInstance = new classInfo._class();
            constructors = classInfo._constructors;

            if (constructors) {
                // Class is extended, call super constructors first?
                for (i = 0; i < constructors.length; i += 1) {
                    // If an error occurs below, the constructor is missing.
                    // Ensure the file has been loaded before use.
                    // Note! check extends classes as well, those might also be
                    // missing.
                    if (constructors[i] === null || constructors[i] === undefined) {
                        throw new Error('Class ' + className + ' is missing super constructor ' + (i + 1) + '/' + constructors.length);
                    }
                    var returned = constructors[i].apply(classInstance, instanceArguments);
                    if(returned) {
                        classInstance = returned;
                    }
                }
            } else {
                var returned = classInfo._constructor.apply(classInstance, instanceArguments);
                if(returned) {
                    classInstance = returned;
                }
            }
            return classInstance;
        },

        /**
         * @public @method createWithClassInfo
         *
         * @param  {Object} classInfo         ClassInfo
         * @param  {[]}     instanceArguments Instance arguments
         *
         * @return {Object}                   Class instance
         */
        createWithClassInfo: function (classInfo, instanceArguments) {
            var classInstance,
                constructors,
                i;

            if (classInfo === null || classInfo === undefined) {
                throw new TypeError('createWithClassInfo(): Missing classInfo');
            }
            // TODO check instanceArguments?
            classInstance = new classInfo._class();
            constructors = classInfo._constructors;
            if (constructors) {
                for (i = 0; i < constructors.length; i += 1) {
                    if (constructors[i] === null ||
                            constructors[i] === undefined) {
                        throw new Error(
                            'createWithClassInfo(): Undefined constructor in ' +
                                'class "' + classInfo._composition.className +
                                '"'
                        );
                    }
                    constructors[i].apply(classInstance, instanceArguments);
                }
            } else {
                classInfo._constructor.apply(classInstance, instanceArguments);
            }
            return classInstance;
        },

        /**
         * @public @method builder
         * Implements Oskari frameworks support for cached class instance
         * builders.
         *
         * @param  {string}   className Class name
         *
         * @return {function}           Class builder
         */
        builder: function (className) {
            var classInfo;

            if (className === null || className === undefined) {
                throw new TypeError('builder(): Missing className');
            }

            classInfo = this._getClassInfo(className);
            if (!classInfo) {
                throw 'Class "' + className + '" does not exist';
            }
            return this.getBuilderFromClassInfo(classInfo);
        },

        /**
         * @public @method getBuilderFromClassInfo
         * Implements Oskari frameworks support for cached class instance
         * builders.
         *
         * @param  {Object}   classInfo ClassInfo
         *
         * @return {function}           Class builder
         */
        getBuilderFromClassInfo: function (classInfo) {
            if (classInfo === null || classInfo === undefined) {
                throw new TypeError(
                    'getBuilderFromClassInfo(): Missing classInfo'
                );
            }

            if (classInfo._builder) {
                return classInfo._builder;
            }
            classInfo._builder = function () {
                var classInstance = new classInfo._class(),
                    constructors = classInfo._constructors,
                    i,
                    instanceArguments = arguments;

                if (constructors) {
                    for (i = 0; i < constructors.length; i += 1) {
                        constructors[i].apply(classInstance, instanceArguments);
                    }
                } else {
                    classInfo._constructor.apply(
                        classInstance,
                        instanceArguments
                    );
                }
                return classInstance;
            };
            return classInfo._builder;
        },

        /**
         * @private @method _global
         *
         * @param {string} key   Key
         * @param          value Value
         *
         * @return
         */
        _global: function (key, value) {
            if (key === undefined) {
                return this.globals;
            }
            if (value !== undefined) {
                this.globals[key] = value;
            }
            return this.globals[key];
        }
    };

    /**
     * singleton instance of the class system
     *
     */
    var class_singleton = new O2ClassSystem(),
        cs = class_singleton;

    /* Legacy loader */

    var bundle_loader_id = 0;

    /**
     * @class Oskari.bundle_loader
     * Bundle loader class that may be used with Oskari framework Inspired by
     * various javascript loaders (Ext, ...)
     *
     * @param {Bundle_manager} manager  Bundle manager
     * @param {function()}     callback Callback function
     *
     */
    var Bundle_loader = function (manager, callback) {
        bundle_loader_id += 1;
        this.loader_identifier = bundle_loader_id;
        this.manager = manager;
        this.callback = callback;

        this.filesRequested = 0;
        this.filesLoaded = 0;
        this.files = [];
        this.fileList = [];
        this.metadata = {};
    };

    Bundle_loader.prototype = {

        /**
         * @public @method add
         * Adds a script loading request
         *
         * @param {string}  fn   File name
         * @param {Object=} pdef
         *
         */
        add: function (fn, pdef) {
            var me = this,
                def;

            var matches = me.files.filter(function(item){
                return item.fn === fn;
            });
            if (matches.length == 0) {
                def = {
                    src: fn,
                    type: pdef && pdef.type ? pdef.type : 'text/javascript',
                    id: pdef ? pdef.id : null,
                    state: false

                };
                me.files.push({
                    fn: fn,
                    def: def
                });

                if ('text/javascript' === def.type) {
                    me.filesRequested += 1;
                }
                me.fileList.push(def);
            }
        },

        /**
         * @public @method getState
         *
         *
         * @return {number} Files loaded / Files requested
         */
        getState: function () {
            if (this.filesRequested === 0) {
                return 1;
            }

            return (this.filesLoaded / this.filesRequested);
        },

        /**
         * @public @method commit
         * Commits any script loading requests
         */
        commit: function () {
            var fragment = document.createDocumentFragment(),
                me = this,
                numFiles = me.filesRequested,
                onFileLoaded,
                f,
                n,
                def,
                fn,
                st;

            if (me.head === undefined) {
                me.head = document.head;
            }
            if (numFiles === 0 || _isPreloaded()) {
                me.callback();
                me.manager.notifyLoaderStateChanged(me, true);
                return;
            }

            /**
             * @private @method onFileLoaded
             */
            onFileLoaded = function () {
                me.filesLoaded += 1;
                me.manager.log('Files loaded ' + me.filesLoaded + '/' +
                    me.filesRequested);

                if (numFiles === me.filesLoaded) {
                    me.callback();
                    me.manager.notifyLoaderStateChanged(me, true);
                } else {
                    me.manager.notifyLoaderStateChanged(me, false);
                }
            };
            f = false;
            me.fileList.forEach(function(def) {
                fn = def.src;
                st = me._buildScriptTag(fn, onFileLoaded, def.type, def.id);
                if (st) {
                    // If this breaks something, revert to using method 1
                    if (_isPreloaded()) {
                        onFileLoaded();
                    } else {
                        fragment.appendChild(st);
                        f = true;
                    }
                }
            });
            if (f) {
                me.head.appendChild(fragment);
            }
        },

        /**
         * @private @method _buildScriptTag
         * Builds a script tag to be applied to document head assumes UTF-8
         *
         * @param  {string}     filename    File name
         * @param  {function()} callback    Callback function
         * @param  {string}     elementType Element type
         * @param  {Object=}    elementId   Element ID
         *
         * @return {Element}
         */
        _buildScriptTag: function (filename, callback, elementType, elementId) {
            var script = document.createElement('script');

            if (elementId) {
                script.id = elementId;
            }
            script.type = elementType; //||'text/javascript';
            script.charset = 'utf-8';

            if (_isPreloaded()) {
                // This should be redundant, see "If this..." in commit() above
                script.src = '/Oskari/empty.js';
            } else {
                script.src = filename;
            }

            /*
             * IE has a different way of handling &lt;script&gt; loads, so we //
             * need to check for it here
             */
            if (script.readyState) {
                script.onreadystatechange = function () {
                    if (script.readyState === 'loaded' ||
                            script.readyState === 'complete') {
                        script.onreadystatechange = null;
                        callback();
                    }
                };
            } else {
                script.onload = callback;
            }

            return script;
        }
    };

    /**
     * @class Oskari.Bundle_mediator
     * A mediator class to support bundle to/from bundle manager communication
     * and initialisation as well as bundle state management
     *
     * @param {Object} options Options
     *
     */
    var Bundle_mediator = function (options) {
        var p;
        this.manager = null;

        for (p in options) {
            if (options.hasOwnProperty(p)) {
                this[p] = options[p];
            }
        }
    };

    Bundle_mediator.prototype = {

        /**
         * @public @method setState
         *
         * @param  {string} state State
         *
         * @return {string}       State
         */
        setState: function (state) {
            this.state = state;
            this.manager.postChange(this.bundle, this.instance, this.state);
            return this.state;
        },

        /**
         * @public @method getState
         *
         *
         * @return {string} State
         */
        getState: function () {
            return this.state;
        }
    };

    /**
     * @class Oskari.Bundle_trigger
     *
     * @param {Object}                   config   Config
     * @param {function(Bundle_manager)} callback Callback function
     * @param {string}                   info     Info
     *
     */
    var Bundle_trigger = function (config, callback, info) {
        this.config = config;
        this.callback = callback;
        this.fired = false;
        this.info = info;
    };

    Bundle_trigger.prototype = {

        /**
         * @public @method execute
         * Executes a trigger callback based on bundle state
         *
         * @param {Bundle_manager} manager        Bundle manager
         * @param {Object}         bundle         Bundle
         * @param {Object}         bundleInstance Bundle instance
         * @param {string}         info           Info
         *
         */
        execute: function (manager, bundle, bundleInstance, info) {
            var me = this,
                p,
                srcState,
                callback;

            if (me.fired) {
                return;
            }

            for (p in me.config['Import-Bundle']) {
                if (me.config['Import-Bundle'].hasOwnProperty(p)) {
                    srcState = manager.bundleSourceStates[p];
                    if (!srcState || srcState.state !== 1) {
                        manager.log(
                            'Trigger not fired due ' + p + ' for ' +
                                info || this.info
                        );
                        return;
                    }
                }
            }
            me.fired = true;
            manager.log('Posting trigger');
            callback = this.callback;

            window.setTimeout(function () {
                callback(manager);
            }, 0);
        }
    };

    /* legacy Bundle_manager */

    /**
     * @singleton @class Oskari.Bundle_manager
     */
    var Bundle_manager = function () {
        var me = this;
        me.serial = 0;
        me.bundleDefinitions = {};
        me.sources = {};
        me.bundleInstances = {};
        me.bundles = {};

        /*
         * CACHE for lookups state management
         */
        me.bundleDefinitionStates = {};

        me.bundleSourceStates = {};

        /* CACHE for statuses */
        me.bundleStates = {};

        me.triggers = [];

        me.loaderStateListeners = [];
    };

    Bundle_manager.prototype = {

        /**
         * @private @method _getSerial
         *
         *
         * @return {number}
         */
        _getSerial: function () {
            this.serial += 1;
            return this.serial;
        },

        /**
         * @private @method _purge
         */
        _purge: function () {
            var p,
                me = this;

            for (p in me.sources) {
                if (me.sources.hasOwnProperty(p)) {
                    delete me.sources[p];
                }
            }
            for (p in me.bundleDefinitionStates) {
                if (me.bundleDefinitionStates.hasOwnProperty(p)) {
                    delete me.bundleDefinitionStates[p].loader;
                }
            }
            for (p in me.bundleSourceStates) {
                if (me.bundleSourceStates.hasOwnProperty(p)) {
                    delete me.bundleSourceStates[p].loader;
                }
            }
        },

        /**
         * @public @method notifyLoaderStateChanged
         *
         * @param {Bundle_loader} bundleLoader Bundle loader
         * @param {boolean}       finished     Finished
         *
         */
        notifyLoaderStateChanged: function (bundleLoader, finished) {
            var i,
                callback;

            if (this.loaderStateListeners.length === 0) {
                return;
            }
            for (i = 0; i < this.loaderStateListeners.length; i += 1) {
                callback = this.loaderStateListeners[i];
                callback(bundleLoader, finished);
            }
        },

        /**
         * @public @method registerLoaderStateListener
         *
         * @param {function(Bundle_loader, boolean)} callback Callback function
         *
         */
        registerLoaderStateListener: function (callback) {
            this.loaderStateListeners.push(callback);
        },

        /**
         * @public @method alert
         * A logging and debugging function
         *
         * @param {string} message Message
         *
         */
        alert: function (message) {
            logMsg(message);
        },

        /**
         * @public @method log
         * A logging and debugging function
         *
         * @param {string} message Message
         *
         */
        log: function (message) {
            logMsg(message);

        },

        /**
         * @private @method _loadCss
         *
         * @param {string}   scriptSrc Contains css style url
         * @param {function} callback  Not implemented
         *
         */
        _loadCss: function (scriptSrc, callback) {
            this.log('Loading CSS ' + scriptSrc);
            var cssParentElement = document.head || document.body,
                styles,
                linkElement,
                xhr;

            if (!_isPreloaded()) {
                /* See if browser <= IE9, IE10 can handle a whole bunch of
                 * stylesheets and rules.
                 * IE has document.all, but versions up to 9 lack window.atob */
                if (document.all && !window.atob) {
                    /* IE has a limitation of 31 stylesheets.
                     * It can be increased to 31*31 by using import in the
                     * stylesheets, but import should be avoided due to
                     * performance issues.
                     * Instead we retrieve the css files with xhr and
                     * concatenate the styles into a single inline style
                     * declaration. */
                    xhr = new XMLHttpRequest();
                    xhr.onreadystatechange = function () {
                        // TODO check xhr.status?
                        if (xhr.readyState === XMLHttpRequest.DONE) {
                            if (xhr.status !== 200) {
                                throw new Error(xhr.statusText);
                            }
                            styles = document.getElementById('concatenated');
                            if (!styles) {
                                // styles was not found, create new element
                                styles = document.createElement('style');
                                styles.setAttribute('type', 'text/css');
                                styles.id = 'concatenated';
                                cssParentElement.appendChild(styles);
                            }
                            styles.styleSheet.cssText += xhr.response;
                        }
                    };
                    xhr.open('GET', scriptSrc, true);
                    xhr.responseType = 'text';
                    xhr.send();
                } else {
                    linkElement = document.createElement('link');
                    linkElement.type = 'text/css';
                    linkElement.rel = 'stylesheet';
                    linkElement.href = scriptSrc;
                    cssParentElement.appendChild(linkElement);
                }
            }
        },

        /**
         * @private @method _loadLink
         *
         * @param {string}   rel type
         * @param {string}   href Contains import url
         *
         */
        _loadLink: function (rel, href) {
            this.log('Loading link ' + rel + ": " + href);
            var importParentElement = document.head || document.body,
                linkElement;

            linkElement = document.createElement('link');
            linkElement.rel = rel;
            linkElement.href = href;
            importParentElement.appendChild(linkElement);
        },

        /**
         * @private @method _self
         *
         *
         * @return {Bundle_manager}
         */
        _self: function () {
            return this;
        },

        /**
         * @private @method _install
         * installs bundle
         * DOES not INSTANTIATE only register bundleDefinition as function
         * declares any additional sources required
         *
         * @param {string}   biid             Bundle implementation id
         * @param {function} bundleDefinition Bundle registration function
         * @param {Object}   srcFiles         Source files
         * @param {Object}   bundleMetadata   Bundle metadata
         *
         */
        _install: function (biid, bundleDefinition, srcFiles, bundleMetadata) {
            var me = this,
                defState = me.bundleDefinitionStates[biid],
                srcState;

            if (defState) {
                defState.state = 1;
                me.log('SETTING STATE FOR BUNDLEDEF ' + biid +
                    ' existing state to ' + defState.state);
            } else {
                defState = {
                    state: 1
                };

                me.bundleDefinitionStates[biid] = defState;
                me.log('SETTING STATE FOR BUNDLEDEF ' + biid +
                    ' NEW state to ' + defState.state);
            }
            defState.metadata = bundleMetadata;

            me.bundleDefinitions[biid] = bundleDefinition;
            me.sources[biid] = srcFiles;

            srcState = me.bundleSourceStates[biid];
            if (srcState) {
                if (srcState.state === -1) {
                    me.log('Triggering loadBundleSources for ' +
                        biid + ' at loadBundleDefinition');
                    window.setTimeout(function () {
                        me.loadBundleSources(biid);
                    }, 0);
                } else {
                    me.log('Source state for ' + biid +
                        ' at loadBundleDefinition is ' + srcState.state);
                }
            }
            me.postChange(null, null, 'bundle_definition_loaded');
        },

        /**
         * @public @method installBundleClass
         * Installs a bundle defined as Oskari native Class.
         *
         * @param {string} biid      Bundle implementation ID
         * @param {string} className Class name
         *
         */
        installBundleClass: function (biid, className) {
            var clazz = Oskari.clazz.create(className);
            if(clazz) {
            	// Oskari.bundle is the new registry for requirejs loader
                Oskari.bundle(biid, {
                    clazz : clazz,
                    metadata : cs.getMetadata(className).meta
                });
                this.installBundleClassOld(biid, className);
            }
        },
        /**
         * @public @method installBundleClass
         * Installs a bundle defined as Oskari native Class.
         *
         * @param {string} biid      Bundle implementation ID
         * @param {string} className Class name
         *
         */
        installBundleClassOld: function (biid, className) {
            var classmeta = cs.getMetadata(className),
                bundleDefinition = cs.builder(className),
                sourceFiles = classmeta.meta.source,
                bundleMetadata = classmeta.meta.bundle;

            this._install(
                biid,
                bundleDefinition,
                sourceFiles,
                bundleMetadata
            );
        },

        /**
         * @public @method installBundleClassInfo
         * Installs a bundle defined as Oskari native Class
         *
         * @param {string} biid      Bundle implementation ID
         * @param {Object} classInfo ClassInfo
         *
         */
        installBundleClassInfo: function (biid, classInfo) {
            var bundleDefinition = cs.getBuilderFromClassInfo(classInfo),
                bundleMetadata = classInfo._metadata,
                sourceFiles = {};

            if (biid === null || biid === undefined) {
                throw new TypeError('installBundleClassInfo(): Missing biid');
            }

            if (classInfo === null || classInfo === undefined) {
                throw new TypeError(
                    'installBundleClassInfo(): Missing classInfo'
                );
            }

            this._install(
                biid,
                bundleDefinition,
                sourceFiles,
                bundleMetadata
            );
        },

        /**
         * @public @method loadBundleDefinition
         * Loads Bundle Definition from JavaScript file JavaScript shall contain
         * install or installBundleClass call.
         *
         * @param {string} biid        Bundle implementation ID
         * @param {string} bundleSrc   Bundle source path
         * @param {string} pbundlePath Bundle path
         *
         */
        loadBundleDefinition: function (biid, bundleSrc, pbundlePath) {
            var me = this,
                defState = me.bundleDefinitionStates[biid],
                bundlePath,
                bl;

            me.log('loadBundleDefinition called with ' + biid);
            if (defState) {
                if (defState.state === 1) {
                    me.log('Bundle definition already loaded for ' + biid);
                    me.postChange(null, null, 'bundle_definition_loaded');
                    return;
                }
                me.log('Bundle definition already loaded OR WHAT?' + biid +
                    ' ' + defState.state);
                return;
            }
            defState = {
                state: -1
            };
            me.bundleDefinitionStates[biid] = defState;
            me.log('Set NEW state for DEFINITION ' + biid + ' to ' +
                defState.state);

            defState.bundleSrcPath = bundleSrc;
            bundlePath =
                pbundlePath ||
                    (bundleSrc.substring(0, bundleSrc.lastIndexOf('/')));
            defState.bundlePath = bundlePath;

            bl = new Bundle_loader(this, function () {
                me.log('bundle_def_loaded_callback');
            });
            bl.metadata.context = 'bundleDefinition';

            defState.loader = bl;

            bl.add(bundleSrc);
            bl.commit();
        },

        /**
         * @private @method _handleSourceFiles
         *
         * @param {Object}   srcFiles          Bundle source files object
         * @param {string}   bundlePath        Bundle path
         * @param {Object}   sourceDefinitions Bundle source definitions object
         *
         */
        _handleSourceFiles: function (srcFiles, bundlePath, sourceDefinitions) {
            var def,
                fn,
                fnWithPath,
                n,
                p;

            sourceDefinitions = sourceDefinitions || {};
            // linter doesn't recognize the filter expression
            /*jshint forin: false*/
            if (sourceDefinitions.links) {
                Array.prototype.push.apply(srcFiles.links, sourceDefinitions.links);
            }
            Object.keys(sourceDefinitions).forEach(function (p) {
                if (p === 'scripts' || p === 'locales') {
                    for (n = 0; n < sourceDefinitions[p].length; n += 1) {
                        def = sourceDefinitions[p][n];
                        if (def.type === 'text/css') {
                            fn = def.src;
                            fnWithPath = fn;
                            if (fn.indexOf('http') === -1) {
                                fnWithPath = bundlePath + '/' + fn;
                            }
                            // TODO: Order these like the files.
                            srcFiles.css[fnWithPath] = def;
                        } else if (def.type) {
                            srcFiles.count += 1;
                            fn =
                                _buildPathForLoaderMode(def.src, bundlePath);
                            fnWithPath = fn;
                            if (fn.indexOf('http') === -1) {
                                fnWithPath = bundlePath + '/' + fn;
                            }
                            // Don't load unneeded locale files if we're not in
                            // packed mode
                            if (p !== 'locales' || _isPackedMode() ||
                                    def.lang === undefined ||
                                    Oskari.getLang() === def.lang) {
                                var def = {
                                        p: p,
                                        n: n,
                                        def: sourceDefinitions[p][n]
                                };
                                srcFiles.files.push({
                                    fn: fnWithPath,
                                    def: def
                                });
                            }
                        }
                    }
                }
            });
        },

        /**
         * @private @method _feedCSSLoader
         *
         * @param {function} callback   Callback function
         * @param {string}   biid       Bundle implementation ID
         * @param {string}   bundlePath Bundle path
         * @param {Object}   srcFiles   Bundle source files object
         *
         */
        _feedCSSLoader: function (callback, biid, bundlePath, srcFiles) {
            var fn,
                defSrc,
                src;
            /**
             * def.src is requested / src is adjusted path
             */
            for (src in srcFiles.css) {
                if (srcFiles.css.hasOwnProperty(src)) {
                    // var def = srcFiles.css[src];
                    defSrc = src;
                    fn = _buildPathForLoaderMode(defSrc, bundlePath);
                    this._loadCss(fn, callback);
                    this.log('- added css source ' + fn + ' for ' + biid);
                }
            }
        },

        /**
         * @private @method _feedLinkLoader
         *
         * @param {string}   biid       Bundle implementation ID
         * @param {string}   bundlePath Bundle path
         * @param {Object}   srcFiles   Bundle source files object
         *
         */
        _feedLinkLoader: function (biid, bundlePath, srcFiles) {
            var me = this;
            if (!_isPreloaded() && srcFiles.links) {
                srcFiles.links.forEach(function (src) {
                    var href = _buildPathForLoaderMode(src.href, bundlePath);
                    me._loadLink(src.rel, href);
                    me.log('- added link source ' + href + ", for: " + biid);
                });
            }
        },

        /**
         * @private @method _feedBundleLoader
         *
         * @param {function()} cb         Callback function
         * @param {string}     biid       Bundle implementation ID
         * @param {string}     bundlePath Bundle path
         * @param {Object}     srcFiles   Bundle source files object
         * @param {Object}     srcState   Source state object
         *
         */
        _feedBundleLoader: function (cb, biid, bundlePath, srcFiles, srcState) {
            var me = this,
                bl,
                fileCount,
                js,
                srcsFn,
                localesFn;

            bl = new Bundle_loader(me, cb);
            bl.metadata.context = 'bundleSources';
            bl.metadata.bundleImpl = biid;
            srcState.loader = bl;

            /**
             * if using compiled javascript
             */
            if (_isPackedMode()) {
                fileCount = srcFiles.files.length;
                if (fileCount > 0) {
                    srcsFn = _buildPathForPackedMode(bundlePath);
                    bl.add(srcsFn, 'text/javascript');
                    me.log('- added PACKED javascript source ' + srcsFn +
                        ' for ' + biid);

                    localesFn = _buildLocalePathForPackedMode(bundlePath);
                    bl.add(localesFn, 'text/javascript');
                    me.log('- added PACKED locale javascript source ' +
                        localesFn + ' for ' + biid);
                }

                /**
                 * else load any files
                 */
            } else {
                srcFiles.files.forEach(function (def) {
                    bl.add(def.fn, def.def);
                    me.log('- added script source ' + js + ' for ' + biid);
                });
            }

            bl.commit();
        },

        /**
         * @public @method loadBundleSources
         * Registers and commits JavaScript load request from bundle manifest.
         * A trigger is fired after all JavaScript files have been loaded.
         *
         * @param {string} biid Bundle implementation ID
         *
         */
        loadBundleSources: function (biid) {
            // load any JavaScripts for bundle
            // MUST be done before createBundle
            var me = this,
                bundleDefinitionState,
                srcFiles,
                srcState,
                callback,
                bundlePath,
                srcs;

            me.log('loadBundleSources called with ' + biid);

            if (biid === null || biid === undefined) {
                throw new TypeError('loadBundleSources(): Missing biid');
            }

            bundleDefinitionState = me.bundleDefinitionStates[biid];

            if (!bundleDefinitionState) {
                throw new Error('loadBundleSources(): INVALID_STATE: bundle ' +
                    'definition load not requested for ' + biid
                    );
            }

            me.log('- definition STATE for ' + biid + ' at load sources ' +
                bundleDefinitionState.state
                );

            if (mode === 'static') {
                me.postChange(null, null, 'bundle_definition_loaded');
                return;
            }

            srcState = me.bundleSourceStates[biid];

            if (srcState) {
                if (srcState.state === 1) {
                    me.log('Already loaded sources for : ' + biid);
                    return;
                }
                if (srcState.state === -1) {
                    me.log('Loading previously pending sources for ' + biid +
                        ' ' + srcState.state + ' or what?'
                        );
                } else {
                    throw new Error('loadBundleSources(): INVALID_STATE: at ' +
                        biid
                        );
                }
            } else {
                srcState = {
                    state: -1
                };
                me.bundleSourceStates[biid] = srcState;
                me.log('Setting STATE for sources ' + biid + ' to ' +
                    srcState.state
                    );
            }

            srcFiles = {
                    count: 0,
                    loaded: 0,
                    files: [],
                    css: {},
                    links: []
                };

            srcs = me.sources[biid];
            bundlePath = bundleDefinitionState.bundlePath;
            me._handleSourceFiles(srcFiles, bundlePath, srcs);

            if (_isPreloaded() && biid === "statsgrid") {
                // This is only used for the vulcanized Polymer bundles.
                // In a perfect world we would get srcFiles.vulcanizedHtml information from packages/.../bundle.js
                // but this is no such a world. So, for now, this is hardcoded here.
                // me._loadLink(srcFiles.vulcanizedHtml.rel, srcFiles.vulcanizedHtml.href);
                // From bundle.js:
                //   "rel": "import",
                //   "href": "/Oskari/bundles/statistics/statsgrid/vulcanized.html"
                // FIXME: We need a generic way of telling these kind of things. Something in startupsequence fragment perhaps or in packages/*/bundle.js
                //me._loadLink("import", "/Oskari/bundles/statistics/statsgrid.polymer/vulcanized.html");
            }
            if (bundleDefinitionState.state !== 1) {
                me.log('Pending DEFINITION at sources for ' + biid + ' to ' +
                    bundleDefinitionState.state + ' -> postponed'
                    );
                return;
            }

            me.log('STARTING load for sources ' + biid);

            callback = function () {
                me.log('Finished loading ' + srcFiles.count + ' files for ' +
                    biid + '.');
                me.bundleSourceStates[biid].state = 1;
                me.log('Set NEW state post source load for ' + biid + ' to ' +
                    me.bundleSourceStates[biid].state
                    );

                me.postChange(null, null, 'bundle_sources_loaded');
            };

            me._feedCSSLoader(
                callback,
                biid,
                bundlePath,
                srcFiles
            );
            me._feedLinkLoader(
                biid,
                bundlePath,
                srcFiles
            );
            me._feedBundleLoader(
                callback,
                biid,
                bundlePath,
                srcFiles,
                srcState
            );
        },

        /**
         * @public @method postChange
         * Posts a notification to bundles and bundle instances.
         *
         * @param {Object=} bundle         Bundle
         * @param {Object=} bundleInstance Bundle instance
         * @param {string}  info           Info
         *
         */
        postChange: function (bundle, bundleInstance, info) {
            var me = this,
                i,
                instance,
                bndl;

            if (info === null || info === undefined) {
                throw new TypeError('postChange(): Missing info');
            }

            me._update(bundle, bundleInstance, info);
            // bundles
            for (i in me.bundles) {
                if (me.bundles.hasOwnProperty(i)) {
                    bndl = me.bundles[i];
                    bndl.update(me, bundle, bundleInstance, info);
                }
            }
            // and instances
            for (i in me.bundleInstances) {
                if (me.bundleInstances.hasOwnProperty(i)) {
                    instance = me.bundleInstances[i];
                    if (instance) {
                        instance.update(me, bundle, bundleInstance, info);
                    }
                }
            }
        },

        /**
         * @public @method createBundle
         * Creates a Bundle (NOTE NOT an instance of bundle)
         * implid, bundleid most likely same value
         *
         * @param  {string} biid Bundle implementation ID
         * @param  {string} bid  Bundle ID
         *
         * @return {Object}      Bundle
         */
        createBundle: function (biid, bid) {
            var bundle,
                bundleDefinition,
                me = this,
                bundleDefinitionState;

            if (biid === null || biid === undefined) {
                throw new TypeError('createBundle(): Missing biid');
            }

            if (bid === null || bid === undefined) {
                throw new TypeError('createBundle(): Missing bid');
            }

            bundleDefinitionState =
                me.bundleDefinitionStates[biid];

            if (!bundleDefinitionState) {
                throw new Error(
                    'createBundle(): Couldn\'t find a definition for' +
                        ' bundle ' + biid + '/' + bid +
                        ', check spelling and that the bundle has been' +
                        ' installed.'
                );
            }
            bundleDefinition = this.bundleDefinitions[biid];
            // FIXME no alerts please. Throw something or log something.
            if (!bundleDefinition) {
                alert('this.bundleDefinitions[' + biid + '] is null!');
                return;
            }
            bundle = bundleDefinition(bundleDefinitionState);
            this.bundles[bid] = bundle;
            this.bundleStates[bid] = {
                state: true,
                bundlImpl: biid
            };
            this.postChange(bundle, null, 'bundle_created');
            return bundle;
        },

        /**
         * @private @method _update
         * Fires any pending bundle or bundle instance triggers
         *
         * @param {Object} bundle         Bundle
         * @param {Object} bundleInstance Bundle instance
         * @param {string} info           Info
         *
         */
        _update: function (bundle, bundleInstance, info) {
            // resolves any bundle dependencies
            // this must be done before any starts
            // TO-DO
            // - bind package exports and imports
            // - bind event imports and exports
            // - bind request exports ( and imports)
            // - bind any Namespaces (== Globals imported )
            // - fire any pending triggers
            var me = this,
                n,
                t;

            me.log('Update called with info ' + info);

            for (n = 0; n < me.triggers.length; n += 1) {
                t = me.triggers[n];
                t.execute(me);
            }
        },

        /**
         * @public @method createInstance
         * Creates a bundle instance for previously installed and created bundle
         *
         * @param  {string} bid Bundle ID
         *
         * @return {Object}     Bundle instance
         */
        createInstance: function (bid) {
            // creates a bundle_instance
            // any configuration and setup IS BUNDLE / BUNDLE INSTANCE specific
            // create / config / start / process / stop / destroy ...
            var me = this,
                bundle,
                bundleInstance,
                bundleInstanceId;

            if (bid === null || bid === undefined) {
                throw new TypeError('createInstance(): Missing bid');
            }

            if (!me.bundleStates[bid] ||
                    !me.bundleStates[bid].state) {
                throw new Error(
                    'createInstance(): Couldn\'t find a definition for' +
                        ' bundle ' + bid + ', check spelling' +
                        ' and that the bundle has been installed.'
                );
            }

            bundle = this.bundles[bid];
            if (bundle === null || bundle === undefined) {
                // TODO find out how this could happen, offer a solution
                throw new Error(
                    'createInstance(): Couldn\'t find bundle with id' + bid
                );
            }

            bundleInstance = bundle.create();
            if (bundleInstance === null || bundleInstance === undefined) {
                throw new Error(
                    'createInstance(): Couldn\'t create bundle ' + bid +
                        ' instance. Make sure your bundle\'s create function' +
                        ' returns the instance.'
                );
            }
            bundleInstanceId = me._getSerial().toString();
            bundleInstance.mediator = new Bundle_mediator({
                bundleId: bid,
                instanceid: bundleInstanceId,
                state: 'initial',
                bundle: bundle,
                instance: bundleInstance,
                manager: this,
                clazz: class_singleton,
                requestMediator: {}
            });

            this.bundleInstances[bundleInstanceId] = bundleInstance;

            this.postChange(bundle, bundleInstance, 'instance_created');
            return bundleInstance;
        },

        /**
         * @private @method _destroyInstance
         * Destroys and unregisters bundle instance
         *
         * @param {string} biid Bundle instance ID
         *
         * @return
         */
        _destroyInstance: function (biid) {
            var bundleInstance,
                mediator;

            if (biid === null || biid === undefined) {
                throw new TypeError('_destroyInstance(): Missing biid');
            }

            bundleInstance = this.bundleInstances[biid];
            mediator = bundleInstance.mediator;

            mediator.bundle = null;
            mediator.manager = null;
            mediator.clazz = null;

            bundleInstance.mediator = null;

            this.bundleInstances[biid] = null;
            bundleInstance = null;

            return bundleInstance;
        },

        /**
         * @public @method on
         * Trigger registration
         *
         * @param {Object}                   config
         * @param {function(Bundle_manager)} callback Callback function
         * @param {string}                   info
         *
         */
        on: function (config, callback, info) {
            this.triggers.push(new Bundle_trigger(config, callback, info));
        }
    };

    /* legacy Bundle_facade */
    /**
     * @class Oskari.Bundle_facade
     * Highlevel interface to bundle management Work in progress
     *
     * @param {} bundleManager
     *
     */
    var Bundle_facade = function (bundleManager) {
        this.manager = bundleManager;
        this.bundles = {};

        /**
         * @property bundleInstances
         * logical bundle instance identifiers
         * (physical are used by manager and start from '1' on)
         */
        this.bundleInstances = {};
        this.bundlePath = '../src/mapframework/bundle/';

        /**
         * @property appSetup
         * application startup sequence
         */
        this.appSetup = null;

        /**
         * @property appConfig
         * application configuration (state) for instances
         * this is injected to instances before 'start' is called
         *
         */
        this.appConfig = {};
    };

    /**
     * FACADE will have only a couple of methods which trigger alotta operations
     */
    Bundle_facade.prototype = {

        /**
         * @public @method getBundleInstanceByName
         * Returns bundle_instance by bundleinstancename defined in player json
         *
         * @param  {string} biid Bundle instance ID
         *
         * @return {Object}      Bundle instance
         */
        getBundleInstanceByName: function (biid) {
            return this.bundleInstances[biid];
        },

        /**
         * @public @method getBundleInstanceConfigurationByName
         * Returns configuration for instance by bundleinstancename
         *
         * @param  {string} biid Bundle instance ID
         *
         * @return {Object}      Bundle instance configuration
         */
        getBundleInstanceConfigurationByName: function (biid) {
            return this.appConfig[biid];
        },

        /**
         * @public @method requireBundle
         * Executes callback after bundle sources have been loaded and bundle
         * has been created.
         *
         * @param {string}                           biid     Bundle
         *                                                    implementation ID
         * @param {string}                           bid      Bundle ID
         * @param {function(Bundle_manager, Object)} callback Callback function
         *
         */
        requireBundle: function (biid, bid, callback) {
            var me = this,
                bundle;

            if (biid === null || biid === undefined) {
                throw new TypeError('requireBundle(): Missing biid');
            }

            if (bid === null || bid === undefined) {
                throw new TypeError('requireBundle(): Missing bid');
            }

            if (callback === null || callback === undefined) {
                throw new TypeError('requireBundle(): Missing callback');
            }

            bundle = me.manager.createBundle(biid, bid);

            callback(me.manager, bundle);
        },

        /**
         * @public @method require
         * Executes callback after any requirements in bundle manifest have been
         * met. (Work In Progress)
         *
         * @param {Object}                   config   Config
         * @param {function(Bundle_manager)} callback Callback function
         * @param {string}                   info     Info
         *
         */
        require: function (config, callback, info) {
            var me = this,
                bundleDefFilename,
                bundlePath,
                def,
                p,
                pp,
                imports,
                packedBundleFn;

            if (config === null || config === undefined) {
                throw new TypeError('require(): Missing config');
            }

            if (callback === null || callback === undefined) {
                throw new TypeError('require(): Missing callback');
            }

            me.manager.on(config, callback, info);
            imports = config['Import-Bundle'];

            for (p in imports) {
                if (imports.hasOwnProperty(p)) {
                    pp = p;
                    def = imports[p];
                    bundlePath = def.bundlePath || me.bundlePath;

                    if (_isPackedMode()) {
                        packedBundleFn =
                            _buildBundlePathForPackedMode(bundlePath + pp);
                        bundleDefFilename =
                            _buildPathForLoaderMode(packedBundleFn, bundlePath);
                    } else {
                        bundleDefFilename = _buildPathForLoaderMode(bundlePath +
                            pp + '/bundle.js', bundlePath);
                    }
                    me.manager.log(
                        'FACADE requesting load for ' + pp + 'from' +
                            bundleDefFilename
                    );
                    me.manager.loadBundleDefinition(
                        pp,
                        bundleDefFilename,
                        bundlePath + pp
                    );
                    me.manager.loadBundleSources(pp);
                }
            }
        },

        /**
         * @public @method setBundlePath
         *
         * @param {string} path Bundle path
         *
         */
        setBundlePath: function (path) {
            this.bundlePath = path;
        },

        /**
         * @private @method _loadBundleDeps
         *
         * @param {Object}                   deps     Dependencies
         * @param {function(Bundle_manager)} callback Callback function
         * @param {Bundle_manager}           manager  Bundle manager
         * @param {string}                   info     Info
         *
         */
        _loadBundleDeps: function (deps, callback, manager, info) {
            var me = this,
                bdep = deps['Import-Bundle'],
                depslist = [],
                hasPhase = false,
                p,
                name,
                def;

            for (p in bdep) {
                if (bdep.hasOwnProperty(p)) {
                    name = p;
                    def = bdep[p];
                    depslist.push({
                        name: name,
                        def: def,
                        phase: def.phase
                    });
                    hasPhase = hasPhase || def.phase;
                }
            }

            depslist.sort(function (a, b) {
                if (!a.phase && !b.phase) {
                    return 0;
                }
                if (!a.phase) {
                    return 1;
                }
                if (!b.phase) {
                    return -1;
                }
                return a.phase < b.phase ? -1 : 1;
            });

            if (hasPhase || !supportBundleAsync) {
                me._loadBundleDep(depslist, callback, manager, info);
            } else {
                me._loadBundleDepAsync(deps, callback, manager, info);
            }
        },

        /**
         * @private @method _loadBundleDep
         * Maintains some a sort of order in loading.
         *
         * @param {Object}                   depslist Dependencies
         * @param {function(Bundle_manager)} callback Callback function
         * @param {Bundle_manager}           manager  Bundle Manager
         * @param {string}                   info     Info
         *
         */
        _loadBundleDep: function (depslist, callback, manager, info) {
            var me = this,
                bundledef = depslist.pop(),
                def,
                bundlename,
                fcd,
                bdep;

            if (!bundledef) {
                callback(manager);
                return;
            }

            def = bundledef.def;
            bundlename = bundledef.name;

            fcd = this;
            bdep = {
                'Import-Bundle': {}
            };
            bdep['Import-Bundle'][bundlename] = def;
            fcd.require(bdep, function (manager) {
                me._loadBundleDep(depslist, callback, manager, info);
            }, info);
        },

        /**
         * @private @method _loadBundleDepAsync
         * Load bundles regardless of order.
         *
         * @param {Object}                   depslist Dependencies
         * @param {function(Bundle_manager)} callback Callback function
         * @param {Bundle_manager}           manager  Bundle manager
         * @param {string}                   info     Info
         *
         */
        _loadBundleDepAsync: function (depslist, callback, manager, info) {
            this.require(depslist, callback, info);
        },

        /**
         * @public @method playBundle
         * Plays a bundle player JSON object by instantiating any required
         * bundle instances.
         *
         * @param {Object}           recData  Bundle player JSON
         * @param {function(Object)} callback Callback function
         *
         */
        playBundle: function (recData, callback) {
            var metas,
                bundlename,
                bundleinstancename,
                isSingleton,
                fcd = this,
                me = this,
                instanceRequirements,
                instanceProps,
                r,
                implInfo,
                implInfoIsObj,
                implid,
                bundleid,
                bundle,
                bundleInstance,
                configProps,
                newBundleInstance;

            if (recData === null || recData === undefined) {
                throw new TypeError('playBundle(): Missing recData');
            }

            metas = recData.metadata;
            bundlename = recData.bundlename;
            bundleinstancename = recData.bundleinstancename;
            instanceRequirements = metas['Require-Bundle-Instance'] || [];
            instanceProps = recData.instanceProp;
            isSingleton = metas.Singleton;

            if (!recData.hasOwnProperty('bundleinstancename')) {
                // Bundle is missing bundleinstancename, using bundlename in its place.
                bundleinstancename = bundlename;
            }

            me._loadBundleDeps(metas, function (manager) {
                var ip;

                for (r = 0; r < instanceRequirements.length; r += 1) {
                    implInfo = instanceRequirements[r];
                    implInfoIsObj = typeof implInfo === 'object';
                    /* implname */
                    implid =
                        implInfoIsObj ? implInfo.bundlename : implInfo;
                    /* bundlename */
                    bundleid =
                        implInfoIsObj ? implInfo.bundleinstancename :
                                implInfo + 'Instance';
                    bundle = me.bundles[implid];
                    if (!bundle) {
                        bundle = manager.createBundle(implid, bundleid);
                        me.bundles[implid] = bundle;
                    }

                    bundleInstance = me.bundleInstances[bundleid];
                    if (!bundleInstance || !isSingleton) {
                        bundleInstance = manager.createInstance(bundleid);
                        me.bundleInstances[bundleid] = bundleInstance;

                        configProps =
                            me.getBundleInstanceConfigurationByName(bundleid);
                        if (configProps) {
                            for (ip in configProps) {
                                if (configProps.hasOwnProperty(ip)) {
                                    bundleInstance[ip] = configProps[ip];
                                }
                            }
                        }
                        bundleInstance.start();
                    }
                }

                fcd.requireBundle(bundlename, bundleinstancename, function () {
                    var prop;
                    newBundleInstance =
                        manager.createInstance(bundleinstancename);

                    for (prop in instanceProps) {
                        if (instanceProps.hasOwnProperty(prop)) {
                            newBundleInstance[prop] = instanceProps[prop];
                        }
                    }

                    configProps = me.getBundleInstanceConfigurationByName(
                        bundleinstancename
                    );
                    if (configProps) {
                        for (prop in configProps) {
                            if (configProps.hasOwnProperty(prop)) {
                                newBundleInstance[prop] = configProps[prop];
                            }
                        }
                    }

                    newBundleInstance.start();
                    me.bundleInstances[bundleinstancename] = newBundleInstance;

                    callback(newBundleInstance);
                });
            }, fcd.manager, bundlename);
        },

        /**
         * @public @method setApplicationSetup
         * Each bundledef is of kind playable by method playBundle. callback:
         * property may be set to receive some feedback - as well as
         * registerLoaderStateListener
         *
         * @param {Object} setup JSON application setup {
         * startupSequence: [ <bundledef1>, <bundledef2>, <bundledef3>, ] }
         *
         */
        setApplicationSetup: function (setup) {
            this.appSetup = setup;
        },

        /**
         * @public @method getApplicationSetup
         *
         *
         * @return {Object} Application setup
         */
        getApplicationSetup: function () {
            return this.appSetup;
        },

        /**
         * @public @method setConfiguration
         *
         * @param {Object} config Config
         *
         */
        setConfiguration: function (config) {
            this.appConfig = config;
        },

        /**
         * @public @method getConfiguration
         *
         *
         * @return {Object}
         */
        getConfiguration: function () {
            return this.appConfig;
        },

	    startApplication: function (callback) {
	        var loader = Oskari.loader(this.appSetup.startupSequence, this.appConfig);
	        loader.processSequence(callback);
	    },

        /**
         * @public @method startApplication
         * Starts JSON setup (set with setApplicationSetup)
         *
         * @param {function(Object)} callback Callback function
         *
         */
        startApplicationOld: function (callback) {
            var me = this,
                appConfig = this.appConfig,
                seq = this.appSetup.startupSequence.slice(0),
                startupInfo = {
                    bundlesInstanceConfigurations: appConfig,
                    bundlesInstanceInfos: {}
                };

            /**
             * Let's shift and playBundle until all done
             */
            var mediator = {
                facade: me,
                startupSequence: seq,
                bundleStartInfo: null,
                player: null,
                startupInfo: startupInfo
            };

            function schedule() {
                window.setTimeout(mediator.player, 0);
            }


            mediator.player = function () {
                mediator.bundleStartInfo = mediator.startupSequence.shift();
                if (!mediator.bundleStartInfo) {
                    if (callback) {
                        callback(startupInfo);
                    }
                    return;
                }

                mediator.facade.playBundle(
                    mediator.bundleStartInfo,
                    function (bundleInstance) {
                        var bName = mediator.bundleStartInfo.bundlename,
                            biName =
                                mediator.bundleStartInfo.bundleinstancename;

                        mediator.startupInfo.bundlesInstanceInfos[biName] =
                            {
                                bundlename: bName,
                                bundleinstancename: biName,
                                bundleInstance: bundleInstance
                            };

                        // TODO apparently none of ours has a callback?
                        if (mediator.bundleStartInfo.callback) {
                            if (typeof mediator.bundleStartInfo.callback ===
                                    'string') {
                                // FIXME no eval please
                                eval(mediator.bundleStartInfo.callback);
                            }
                            mediator.bndl.callback.apply(
                                this,
                                [bundleInstance, mediator.bundleStartInfo]
                            );
                        }
                        schedule();
                    }
                );
            };
            schedule();

        },

        /**
         * @method stopApplication
         * Might stop app if/when all stops implemented
         */
        stopApplication: function () {
            throw 'NYI';
        }
    };

    /**
     * Singleton instance of Oskari.BundleManager manages lifecycle for bundles
     * and bundle instances.
     */
    var bm = new Bundle_manager();
    bm.clazz = cs;

    /**
     * @class Oskari.BundleFacade
     * Pluggable DOM manager. This is the no-op default implementation.
     */
    var fcd = new Bundle_facade(bm),
        ga = cs._global;

    cs.define('Oskari.DomManager', function (dollar) {
        this.$ = dollar;
    }, {

        /**
         * @public @method getEl
         *
         * @param {string} selector Selector
         *
         * @return
         */
        getEl: function (selector) {
            return this.$(selector);
        },

        /**
         * @public @method getElForPart
         *
         * @param {} part Part
         *
         */
        getElForPart: function (part) {
            throw 'N/A';
        },

        /**
         * @public @method setElForPart
         *
         * @param part Part
         * @param el   Element
         *
         */
        setElForPart: function (part, el) {
            throw 'N/A';
        },

        /**
         * @public @method setElParts
         *
         * @param partsMap Parts map
         *
         */
        setElParts: function (partsMap) {
            throw 'N/A';
        },

        /**
         * @public @method getElParts
         */
        getElParts: function () {
            throw 'N/A';
        },

        /**
         * @public @method pushLayout
         *
         * @param s
         *
         */
        pushLayout: function (s) {
            throw 'N/A';
        },

        /**
         * @public @method popLayout
         *
         * @param s
         *
         */
        popLayout: function (s) {
            throw 'N/A';
        },

        /**
         * @public @method getLayout
         */
        getLayout: function () {
            throw 'N/A';
        }
    });
    // FIXME no jQuery in core
    var domMgr = cs.create('Oskari.DomManager', jQuery);

    fcd.bundle_dom_manager = domMgr;

    // Oskari1API

    /**
     * @static @property Oskari
     */
    var Oskari1LegacyAPI = {
        bundle_manager: bm,
        /* */
        bundle_facade: fcd,
        bundle_locale: blocale,
        app: fcd,
        /* */
        clazz: cs,
        VERSION : oskariVersion,
        markers: [],

        /**
         * @public @method Oskari.$
         *
         *
         * @return {}
         */
        '$': function () {
            return ga.apply(cs, arguments);
        },

        /**
         * @public @static @method Oskari.setLoaderMode
         *
         * @param {string} m Loader mode
         *
         */
        setLoaderMode: function (m) {
            if (typeof m !== 'string') {
                throw new TypeError(
                    'setLoaderMode(): m is not a string'
                );
            }
            mode = m;
        },

        /**
         * @public @method Oskari.getLoaderMode
         *
         *
         * @return {string} Loader mode
         */
        getLoaderMode: function () {
            return mode;
        },

        /**
         * @public @method Oskari.setDebugMode
         *
         * @param {boolean} d Debug mode on/off
         *
         */
        setDebugMode: function (d) {
            if (typeof d !== 'boolean') {
                throw new TypeError(
                    'setDebugMode(): d is not a boolean'
                );
            }
            isDebug = d;
        },

        /**
         * @public @method Oskari.setSupportBundleAsync
         *
         * @param {boolean} sba Support async on/off
         *
         */
        setSupportBundleAsync: function (sba) {
            if (typeof sba !== 'boolean') {
                throw new TypeError(
                    'setSupportBundleAsync(): sba is not a boolean'
                );
            }
            supportBundleAsync = sba;
        },

        /**
         * @public @method Oskari.getSupportBundleAsync
         *
         *
         * @return {boolean} Support async on/off
         */
        getSupportBundleAsync: function () {
            return supportBundleAsync;
        },

        /**
         * @public @method Oskari.setBundleBasePath
         *
         * @param {string} bp Bundle base path
         *
         */
        setBundleBasePath: function (bp) {
            if (typeof bp !== 'string') {
                throw new TypeError(
                    'setBundleBasePath(): bp is not a string'
                );
            }
            basePathForBundles = bp;
        },

        /**
         * @public @method Oskari.getBundleBasePath
         *
         *
         * @return {string} Bundle base path
         */
        getBundleBasePath: function () {
            return basePathForBundles;
        },

        /**
         * @public @method Oskari.setPreloaded
         *
         * @param {boolean} usep Preloaded on/off
         *
         */
        setPreloaded: function (usep) {
            if (typeof usep !== 'boolean') {
                throw new TypeError(
                    'setPreloaded(): usep is not a boolean'
                );
            }
            _preloaded = usep;
        },

        /**
         * @public @method Oskari.setInstTs
         *
         * @param {} x
         *
         */
        setInstTs: function (x) {
            instTs = x;
        },

        /**
         * @public @static @method Oskari.registerLocalization
         *
         * @param {Object|Object[]} props Properties
         * @param {Boolean} override override languages
         *
         */
        registerLocalization: function (props, override) {
            var p,
                pp,
                loc;

            if (props === null || props === undefined) {
                throw new TypeError('registerLocalization(): Missing props');
            }

            if (props.length) {
                for (p = 0; p < props.length; p += 1) {
                    pp = props[p];

                    if(override && override === true){
                        if(pp.key && pp.lang){
                            loc = Oskari.getLocalization(pp.key, pp.lang);
                        }

                        if(loc && loc !== null){
                            pp.value = jQuery.extend(true, {}, loc, pp.value);
                        }

                    } else {
                        if(pp.key && pp.lang){
                            loc = Oskari.getLocalization(pp.key, pp.lang);
                        }

                        if(loc && loc !== null){
                            pp.value = jQuery.extend(true, {}, pp.value, loc);
                        }
                    }

                    blocale.setLocalization(pp.lang, pp.key, pp.value);
                }

            } else {
                if(override && override === true){
                    if(props.key && props.lang){
                        loc = Oskari.getLocalization(props.key, props.lang);
                    }

                    if(loc && loc !== null){
                        props.value = jQuery.extend(true, {}, loc, props.value);
                    }

                } else {
                    if(props.key && props.lang){
                        loc = Oskari.getLocalization(props.key, props.lang);
                    }

                    if(loc && loc !== null){
                        props.value = jQuery.extend(true, {}, props.value, loc);
                    }
                }
                blocale.setLocalization(props.lang,props.key,props.value);

            }
        },

        /**
         * @public @static @method Oskari.getLocalization
         *
         * @param  {string} key Key
         *
         * @return {string}
         */
        getLocalization: function (key, lang, fallbackToDefault) {
            return blocale.getLocalization(key, lang, fallbackToDefault);
        },

        /**
         * @public @static @method Oskari.getLang
         *
         *
         * @return {string} Language
         */
        getLang: function () {
            return blocale.getLang();
        },

        /**
         * @public @static @method Oskari.setLang
         *
         * @param  {string} lang Language
         *
         */
        setLang: function (lang) {
            return blocale.setLang(lang);
        },

        /**
         * @public @static @method Oskari.setSupportedLocales
         *
         * @param  {string[]} locales Locales array
         *
         */
        setSupportedLocales: function (locales) {
            return blocale.setSupportedLocales(locales);
        },

        /**
         * @public @static @method Oskari.getSupportedLocales
         *
         *
         * @return {string[]} Supported locales
         */
        getSupportedLocales: function () {
            return blocale.getSupportedLocales();
        },

        /**
         * @public @static @method Oskari.getDefaultLanguage
         *
         *
         * @return {string} Default language
         */
        getDefaultLanguage: function () {
            return blocale.getDefaultLanguage();
        },

        /**
         * @public @static @method Oskari.getSupportedLanguages
         *
         *
         * @return {string[]} Supported languages
         */
        getSupportedLanguages: function () {
            return blocale.getSupportedLanguages();
        },

        /**
         * @public @static @method Oskari.getDecimalSeparator
         *
         *
         * @return {string} Active locale's decimal separator
         */
        getDecimalSeparator: function () {
            return blocale.getDecimalSeparator();
        },

        /**
         * @public @static @method Oskari.setDecimalSeparators
         *
         * @param  {Object} decimalSeparators Decimal separators
         *
         */
        setDecimalSeparators: function (decimalSeparators) {
            return blocale.setDecimalSeparators(decimalSeparators);
        },

        /**
         * @public @static @method Oskari.purge
         */
        purge: function () {
            bm.purge();
            cs.purge('Oskari');
        },

        /**
         * @public @static @method Oskari.getDomManager
         *
         *
         * @return DOM Manager
         */
        getDomManager: function () {
            return domMgr;
        },

        /**
         * @public @static @method Oskari.setDomManager
         *
         * @param dm DOM Manager
         *
         */
        setDomManager: function (dm) {
            domMgr = dm;
        },

        /**
         * @public @static @method Oskari.getSandbox
         *
         * @param  {string=} sandboxName Sandbox name
         *
         * @return {Object}              Sandbox
         */
        getSandbox: function (sandboxName) {
            return ga.apply(cs, [sandboxName || 'sandbox']);
        },

        /**
         * @public @static @method Oskari.setSandbox
         *
         * @param  {string=} sandboxName Sandbox name
         * @param  {Object}  sandbox     Sandbox
         *
         * @return
         */
        setSandbox: function (sandboxName, sandbox) {
            return ga.apply(cs, [sandboxName || 'sandbox', sandbox]);
        },

        /**
         * @public @static @method Oskari.setMarkers
         * @param {Array} markers markers
         */
        setMarkers: function(markers) {
            this.markers = markers;
        },
        /**
         * @public @static @method Oskari.getMarkers
         * @return {Array} markers markers
         */
        getMarkers: function() {
            return this.markers || [];
        },
    };

    /* Oskari1BuilderAPI */

    /* Oskari1Builder class module  */

    var oskari1BuilderSerial = (function () {
        var serials = {};
        return {
            get: function (type) {
                if (!serials[type]) {
                    serials[type] = 1;
                } else {
                    serials[type] += 1;
                }
                return serials[type];
            }
        };
    }());

    /* @class Oskari.ModuleSpec
     * Helper class instance of which is returned from oskari 2.0 api
     * Returned class instance may be used to chain class definition calls.
     *
     * @param {Object} classInfo ClassInfo
     * @param {string} className Class name
     *
     */
    cs.define('Oskari.ModuleSpec', function (classInfo, className) {
        this.cs = cs;
        this.classInfo = classInfo;
        this.className = className;

    }, {

        /**
         * @private @method _slicer
         */
        _slicer: Array.prototype.slice,

        /**
         * @method category
         * Adds a set of methods to class
         *
         * @param  {Object}            prototype    Prototype
         * @param  {string}            categoryName Category name
         *
         * @return {Oskari.ModuleSpec}              this
         */
        category: function (prototype, categoryName) {
            var classInfo = cs.category(
                this.className,
                categoryName ||
                    (['__', oskari1BuilderSerial.get('Category')].join('_')),
                prototype
            );
            this.classInfo = classInfo;
            return this;
        },

        /**
         * @method methods
         * Adds a set of methods to class - alias to category
         *
         * @param  {}                  prototype    Prototype
         * @param  {string}            categoryName Category name
         *
         * @return {Oskari.ModuleSpec}              this
         */
        methods: function (prototype, categoryName) {
            var classInfo = cs.category(
                this.className,
                categoryName ||
                    (['__', oskari1BuilderSerial.get('Category')].join('_')),
                prototype
            );
            this.classInfo = classInfo;
            return this;
        },

        /**
         * @method extend
         * Adds inheritance from a base class.
         * Base class can be declared later but must be defined before
         * instantiation.
         *
         * @param  {Object|Object[]}   clazz Class or an array of classes
         *
         * @return {Oskari.ModuleSpec}       this
         */
        extend: function (clazz) {
            var classInfo;

            if (clazz === null || clazz === undefined) {
                throw new TypeError('extend(): Missing clazz');
            }

            classInfo = cs.extend(
                this.className,
                clazz.length ? clazz : [clazz]
            );
            this.classInfo = classInfo;
            return this;
        },

        /**
         * @method create
         * Creates an instance of this clazz
         *
         *
         * @return {Object} Class instance
         */
        create: function () {
            return cs.createWithClassInfo(this.classInfo, arguments);
        },

        /**
         * @method nam
         * Returns the class name
         *
         *
         * @return {string} Class name
         */
        name: function () {
            return this.className;
        },

        /**
         * @method metadata
         * Returns class metadata
         *
         *
         * @return {Object} Class metadata
         */
        metadata: function () {
            return cs.getMetadata(this.className);
        },

        /**
         * @method events
         * Adds a set of event handlers to class
         *
         * @param  {Object}            events Eventhandlers map
         *
         * @return {Oskari.ModuleSpec}        this
         */
        events: function (events) {
            var orgmodspec = this;
            orgmodspec.category({
                eventHandlers: events,
                onEvent: function (event) {
                    var handler = this.eventHandlers[event.getName()];
                    if (!handler) {
                        return;
                    }

                    return handler.apply(this, [event]);
                }
            }, '___events');
            return orgmodspec;
        },

        /**
         * @method requests
         *
         * @param  {Object}            requests Requesthandlers map
         *
         * @return {Oskari.ModuleSpec}          this
         */
        requests: function (requests) {
            var orgmodspec = this;
            orgmodspec.category({
                requestHandlers: requests,
                onRequest: function (request) {
                    var handler = this.requestHandlers[request.getName()];
                    return handler ? handler.apply(this, [request]) : undefined;
                }
            }, '___requests');
            return orgmodspec;
        },

        /**
         * @method builder
         *
         *
         * @return {function}
         */
        builder: function () {
            return cs.getBuilderFromClassInfo(this.classInfo);
        }


    });

    var Oskari1BuilderAPI = Oskari1LegacyAPI;

    /**
     * @public @method cls
     * Entry point to new class API.
     * @see Oskari.ModuleSpec above.
     *
     * @param  {string}   className   Class name
     * @param  {function} constructor Constructor
     * @param  {Object}   proto       Prototype
     * @param  {Object}   metas       Metadata
     *
     * @return {Object}               Class instance
     */
    Oskari1BuilderAPI.cls = function (className, constructor, proto, metas) {
        var classInfo;

        if (!className) {
            className = [
                'Oskari',
                '_',
                oskari1BuilderSerial.get('Class')
            ].join('.');
        } else {
            classInfo = cs.lookup(className);
        }

        if (!(classInfo && classInfo._constructor && !constructor)) {
            classInfo = cs.define(
                className,
                constructor || function () {},
                proto,
                metas || {}
            );
        }

        return cs.create('Oskari.ModuleSpec', classInfo, className);

    };

    /**
     * @public @method loc
     * Oskari1Builder helper to register localisation
     */
    Oskari1BuilderAPI.loc = function () {
        return this.registerLocalization.apply(Oskari1BuilderAPI, arguments);
    };

    /**
     * @public @static @method Oskari.eventCls
     * O2 api for event class
     *
     * @param  {string}   eventName   Event name
     * @param  {function} constructor Constructor
     * @param  {Object}   proto       Prototype
     *
     * @return
     */
    Oskari1BuilderAPI.eventCls = function (eventName, constructor, proto) {
        var className,
            rv;

        if (eventName === null || eventName === undefined) {
            throw new TypeError('eventCls(): Missing eventName');
        }

        className = 'Oskari.event.registry.' + eventName;
        rv = Oskari1BuilderAPI.cls(
            className,
            constructor,
            proto,
            {protocol: ['Oskari.mapframework.event.Event']}
        );

        rv.category({
            getName: function () {
                return eventName;
            }
        }, '___event');

        rv.eventName = eventName;

        return rv;
    };

    /**
     * @public @static @method Oskari.requestCls
     * O2 api for request class
     *
     * @param  {string}   className   Class name
     * @param  {function} constructor Constructor
     * @param  {Object}   proto       Prototype
     *
     * @return {Object}
     */
    Oskari1BuilderAPI.requestCls = function (requestName, constructor, proto) {
        var className,
            rv;

        if (requestName === null || requestName === undefined) {
            throw new TypeError('requestCls(): Missing requestName');
        }

        className = 'Oskari.request.registry.' + requestName;
        rv = Oskari1BuilderAPI.cls(
            className,
            constructor,
            proto,
            {protocol: ['Oskari.mapframework.request.Request']}
        );

        rv.category({
            getName: function () {
                return requestName;
            }
        }, '___request');

        rv.requestName = requestName;

        return rv;
    };

    Oskari1BuilderAPI._baseClassFor = {
        extension: 'Oskari.userinterface.extension.EnhancedExtension',
        bundle: 'Oskari.mapframework.bundle.extension.ExtensionBundle',
        tile: 'Oskari.userinterface.extension.EnhancedTile',
        flyout: 'Oskari.userinterface.extension.EnhancedFlyout',
        view: 'Oskari.userinterface.extension.EnhancedView'
    };

    /**
     * @public @static @method Oskari.extensionCls O2 api for extension classes
     *
     * @param  {string} className Class name
     *
     * @return
     */
    Oskari1BuilderAPI.extensionCls = function (className) {
        if (className === null || className === undefined) {
            throw new TypeError('extensionCls(): Missing className');
        }

        return Oskari1BuilderAPI.cls(className).extend(
            this._baseClassFor.extension
        );
    };

    /**
     * @public @static @method Oskari.bundleCls O2 api for bundle classes
     *
     * @param  {string} bundleId  Bundle ID
     * @param  {string} className Class name
     *
     * @return {Object}           Bundle instance
     */
    Oskari1BuilderAPI.bundleCls = function (bundleId, className) {
        var rv;

        if (className === null || className === undefined) {
            throw new TypeError('bundleCls(): Missing className');
        }

        if (!bundleId) {
            bundleId = (['__', oskari1BuilderSerial.get('Bundle')].join('_'));
        }

        rv = Oskari1BuilderAPI.cls(className, function () {}, {
            update: function () {}
        }, {
            protocol: ['Oskari.bundle.Bundle', this._baseClassFor.bundle],
            manifest: {
                'Bundle-Identifier': bundleId
            }
        });
        bm.installBundleClassInfo(bundleId, rv.classInfo);

        rv.___bundleIdentifier = bundleId;

        rv.loc = function (properties) {
            properties.key = this.___bundleIdentifier;
            Oskari1BuilderAPI.registerLocalization(properties);
            return rv;
        };

        // FIXME instanceId isn't used for anything?
        rv.start = function (instanceId) {
            var bid = this.___bundleIdentifier,
                bundle,
                bundleInstance,
                configProps,
                ip;

            if (!fcd.bundles[bid]) {
                bundle = bm.createBundle(bid, bid);
                fcd.bundles[bid] = bundle;
            }

            bundleInstance = bm.createInstance(bid);
            fcd.bundleInstances[bid] = bundleInstance;

            configProps = fcd.getBundleInstanceConfigurationByName(bid);
            if (configProps) {
                for (ip in configProps) {
                    if (configProps.hasOwnProperty(ip)) {
                        bundleInstance[ip] = configProps[ip];
                    }
                }
            }
            bundleInstance.start();
            return bundleInstance;
        };
        rv.stop = function () {
            var bundleInstance = fcd.bundleInstances[this.___bundleIdentifier];

            return bundleInstance.stop();
        };
        return rv;
    };

    /**
     * @static @method Oskari.flyoutCls
     *
     * @param  {string} className Class name
     *
     * @return
     */
    Oskari1BuilderAPI.flyoutCls = function (className) {
        if (className === null || className === undefined) {
            throw new TypeError('flyoutCls(): Missing className');
        }

        return Oskari1BuilderAPI.cls(className).extend(
            this._baseClassFor.flyout
        );
    };

    /**
     * @static @method Oskari.tileCls
     *
     * @param  {string} className Class name
     *
     * @return
     */
    Oskari1BuilderAPI.tileCls = function (className) {
        if (className === null || className === undefined) {
            throw new TypeError('tileCls(): Missing className');
        }

        return Oskari1BuilderAPI.cls(className).extend(this._baseClassFor.tile);
    };

    /**
     * @static @method Oskari.viewCls
     *
     * @param  {string} className Class name
     *
     * @return
     */
    Oskari1BuilderAPI.viewCls = function (className) {
        if (className === null || className === undefined) {
            throw new TypeError('viewCls(): Missing className');
        }

        return Oskari1BuilderAPI.cls(className).extend(this._baseClassFor.view);
    };

    /**
     * Let's register Oskari as a Oskari global
     */
    ga.apply(cs, ['Oskari', Oskari1LegacyAPI]);

    /*
     * window.bundle = Oskari1LegacyAPI; window.Oskari = Oskari1LegacyAPI;
     */
    return Oskari1LegacyAPI;
}());



/*
* @class Oskari.util
* Util class instance for static methods what may be used to for checks values.
* For example check at value is number or how many decimals this value have.
*
*/
Oskari.util = (function () {
    var util = {};

    /**
    * Checks at if value has leading zeros.
    * @private @method isLeadingZero
    *
    * @param {Object} value checked value
    */
    function isLeadingZero(value){
        var i;

        if(typeof value === 'string' && value.length>0 && value[0] === '0') {
            if(util.isDecimal(value) && value.length>1 && value[1] === '.') {
                return false;
            } else {
                return true;
            }
        }
        return false;
    };

    /**
    * Checks at if value is number.
    * @static @method Oskari.util.isNumber
    *
    * @param {Object} value checked value
    * @param {Boolean} keepLeadingZero, need keep leading zero
    */
    util.isNumber = function(value, keepLeadingZero) {
        var reg = new RegExp('^[-+]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$'),
            isNumber = true,
            i;

        if(typeof value === 'object') {
            for(i=0; i<value.length; i++) {
                if(keepLeadingZero && keepLeadingZero === true && isLeadingZero(value[i] + '')) {
                   isNumber = false;
                   break;
                }
                if(reg.test(value[i]) === false) {
                    isNumber = false;
                    break;
                }
            }
        } else {
            if(keepLeadingZero && keepLeadingZero === true && isLeadingZero(value + '')) {
                isNumber = false;
            } else {
                isNumber = reg.test(value);
            }
        }
        return isNumber;
    };

    /**
    * Checks at if value is decimal.
    * @static @method Oskari.util.isDecimal
    *
    * @param {Object} value checked value
    */
    util.isDecimal = function(value){
        var isDecimal = true,
            i,
            s,
            val;

        if(!value || value === null || value === '') {
            return false;
        }

        if(typeof value === 'object') {
             for(i=0; i<value.length; i++) {
                val = String(value[i]);
                s = val.split('.');
                if(s.length === 2 && !isLeadingZero(val) && !isNaN(s[0]) && !isNaN(s[1])){
                    isDecimal = true;
                } else {
                    isDecimal = false;
                }
                if(isDecimal === false) {
                    break;
                }
             }
        } else {
            val = value+'';
            s = val.split('.');

            if(s.length === 2 && !isNaN(s[0]) && !isNaN(s[1]) &&
                ((isLeadingZero(s[0]) && s[0].length==1) || !isLeadingZero(s[0]))
                ){
                isDecimal = true;
            } else {
                isDecimal = false;
            }
        }
        return isDecimal;
    };

    /**
    * Calculates the amount of decimals in value or maximum number of decimals in numbers of an array.
    * @static @method Oskari.util.decimals
    *
    * @param {Object} value checked value
    */
    util.decimals = function(value){
        var val,
            maxDecimals = 0;

        if(!value || value === null || value === '' || (isNaN(value) && typeof value !== 'object')) {
            return null;
        }
        if(typeof value === 'object') {
            for(i=0; i<value.length; i++) {
                val = value[i] + '';
                val = val.split('.');
                if(val.length===2 && maxDecimals<val[1].length) {
                    maxDecimals = val[1].length;
                }
            }
            return maxDecimals;
        } else {
            val = value + '';
            val = val.split('.');
            return val.length === 2 ? val[1].length : 0;
        }
    };

    /**
     * Converts hexadecimal color values to decimal values (255,255,255)
     * Green: hexToRgb("#0033ff").g
     * http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
     *
     * @method hex
     * hexadecimal color value e.g. '#00ff99'
     */
    util.hexToRgb = function(hex) {
        // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function (m, r, g, b) {
            return r + r + g + g + b + b;
        });

        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    /**
     * Convert rgb values to hexadecimal color values
     *
     * @method rgbToHex
     * @param {String} rgb decimal color values e.g. 'rgb(255,0,0)'
     */
    util.rgbToHex = function (rgb) {
        if (rgb.charAt(0) === '#') {
            return rgb.substring(1);
        }
        var parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/),
            j;

        delete(parts[0]);
        for (j = 1; j <= 3; j += 1) {
            parts[j] = parseInt(parts[j], 10).toString(16);
            if (parts[j].length === 1) {
                parts[j] = '0' + parts[j];
            }
        }
        return parts.join('');
    };

   /**
    * Check, if nested key exists
    * @method keyExists
    * @params {Object}  object to check { "test" : { "this" : true }}
    * @params String object path "test.this"
    * @public
    *
    * @returns {Boolean}: true if nested key exists
    */
    util.keyExists = function(obj, keypath) {
        var tmpObj = obj,
            cnt = 0,
            splits = keypath.split('.');

        for (var i=0; tmpObj && i < splits.length; i++) {
            if (splits[i] in tmpObj) {
                tmpObj = tmpObj[splits[i]];
                cnt++;
            }
        }
        return cnt === splits.length;
    };

    /**
     * Natural array sort
     * @method  naturalSort
     * @param  {String|Integer|Double} valueA     sorted value a
     * @param  {String|Integer|Double} valueB     soted value b
     * @param  {Boolean} descending is descending
     * @return {Integer}            sort number
     */
    util.naturalSort = function(valueA, valueB, descending) {
        var re = /(^([+\-]?(?:\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[\da-fA-F]+$|\d+)/g,
            sre = /^\s+|\s+$/g,   // trim pre-post whitespace
            snre = /\s+/g,        // normalize all whitespace to single ' ' character
            dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/,
            hre = /^0x[0-9a-f]+$/i,
            ore = /^0/,
            i = function(s) {
                return ('' + s).toLowerCase().replace(sre, '');
            },
            // convert all to strings strip whitespace
            x = i(valueA) || '',
            y = i(valueB) || '',
            // chunk/tokenize
            xN = x.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
            yN = y.replace(re, '\0$1\0').replace(/\0$/,'').replace(/^\0/,'').split('\0'),
            // numeric, hex or date detection
            xD = parseInt(x.match(hre), 16) || (xN.length !== 1 && Date.parse(x)),
            yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null,
            normChunk = function(s, l) {
                // normalize spaces; find floats not starting with '0', string or 0 if not defined (Clint Priest)
                return (!s.match(ore) || l == 1) && parseFloat(s) || s.replace(snre, ' ').replace(sre, '') || 0;
            },
            sortFunc = function(oFxNcL, oFyNcL){
                // handle numeric vs string comparison - number < string - (Kyle Adams)
                if (isNaN(oFxNcL) !== isNaN(oFyNcL)) {
                    retValue = (isNaN(oFxNcL)) ? 1 : -1;
                    return true;
                }
                // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
                else if (typeof oFxNcL !== typeof oFyNcL) {
                    oFxNcL += '';
                    oFyNcL += '';
                }

                if (oFxNcL < oFyNcL) {
                    retValue = -1;
                    return true;
                }
                if (oFxNcL > oFyNcL) {
                    retValue = 1;
                    return true;
                }
            },
            oFxNcL, oFyNcL,
            retValue = 0,
            sortCompleted = false;

        // first try and sort Hex codes or Dates
        if (yD) {
            if ( xD < yD ) {
                retValue = -1;
                sortCompleted = true;
            }
            else if ( xD > yD ) {
                retValue = 1;
                sortCompleted = true;
            }
        }

        if(!sortCompleted) {
            // natural sorting through split numeric strings and default strings
            for(var cLoc=0, xNl = xN.length, yNl = yN.length, numS=Math.max(xNl, yNl); cLoc < numS; cLoc++) {
                oFxNcL = normChunk(xN[cLoc] || '', xNl);
                oFyNcL = normChunk(yN[cLoc] || '', yNl);

                sortCompleted = sortFunc(oFxNcL, oFyNcL);

                if(sortCompleted) {
                    break;
                }
            }
        }
        if (descending) {
            retValue =  -1 * retValue;
        }
        return retValue;
    };


    return util;
}());

Oskari.bundle = function(bundleId, value) {
    if(!Oskari.samiRegistry) {
        Oskari.samiRegistry = {};
    }
    if(value) {
        Oskari.samiRegistry[bundleId] = value;
    }
    return Oskari.samiRegistry[bundleId];
};
/**
 * Loader
 * @param  {[type]} startupSequence [description]
 * @param  {[type]} config          [description]
 * @return {[type]}                 [description]
 */
Oskari.loader = function(startupSequence, config) {
    var sequence = startupSequence.slice(0);
    var appConfig = config;

    return {
        /**
         * {
                "bundleinstancename": "openlayers-default-theme",
                "bundlename": "openlayers-default-theme",
                "metadata": {
                    "Import-Bundle": {
                        "openlayers-default-theme": {
                            "bundlePath": "../../../packages/openlayers/bundle/"
                        },
                        "openlayers-full-map": {
                            "bundlePath": "../../../packages/openlayers/bundle/"
                        }
                    }
                }
            }
         * @param  {[type]} sequence [description]
         * @return {[type]}          [description]
         */
        processSequence : function(done) {
            var me = this;
            if(sequence.length === 0) {
                // everything has been loaded
                done();
                return;
            }
            var seqToLoad = sequence.shift();
            if(typeof seqToLoad !== 'object') {
                // log error: block not object
                // iterate to next
                this.processSequence(done);
                return;
            }
            if(typeof seqToLoad.metadata !== 'object' ||
                typeof seqToLoad.metadata['Import-Bundle']  !== 'object') {
                // log error: "Nothing to load"
                // iterate to next
                this.processSequence(done);
                return;
            }

            var bundleToStart = seqToLoad.bundlename;
            // if bundleinstancename is missing, use bundlename for config key.
            var configId = seqToLoad.bundleinstancename || bundleToStart;
            var config = appConfig[configId] || {};
            var bundlesToBeLoaded = seqToLoad.metadata['Import-Bundle'];
            var paths = [];
            var bundles = [];
            for(var id in bundlesToBeLoaded) {
                var value = bundlesToBeLoaded[id];
                if(typeof value !== 'object' ||
                    typeof value.bundlePath !== 'string') {
                    // log error: bundle object not defined
                    continue;
                }
                var basepath = value.bundlePath + '/' + id;
                var path = basepath + '/bundle.js';
                paths.push(path.split('//').join('/'));
                bundles.push({
                    id : id,
                    path : basepath
                });
            }
            if(Oskari.bundle(bundleToStart)) {
                console.log('Bundle preloaded ' + bundleToStart);
                me.startBundle(bundleToStart, config);
                this.processSequence(done);
                return;
            }
            console.log('Loading bundles');
            // load all bundlePaths mentioned in sequence-block
            require(paths, function() {
                // if loaded undefined - find from Oskari.instalBundle register with id
                for(var i = 0; i < arguments.length; ++i) {
                    if(typeof arguments[i] !== 'undefined') {
                        // this would be a bundle.js with amd support
                        debugger;
                    }
                }
                console.log('Loaded bundles', bundles);
                // the loaded files have resulted in calls to
                // Oskari.bundle_manager.installBundleClass(id, "Oskari.mapframework.domain.Bundle");
                // TODO: loop all bundles and require sources from installs
                me.processBundleJS(bundles, function() {
                    me.startBundle(bundleToStart, config);
                    me.processSequence(done);
                });
            });
        },
        startBundle : function(bundleId, config) {
            var bundle = Oskari.bundle(bundleId);
            if(!bundle) {
                throw new Error('Bundle not loaded ' + bundleId);
            }
            var instance = bundle.clazz.create();
            if(!instance) {
                throw new Error('Couldnt start bundle with id ' + bundleId);
            }
            instance.mediator = {
                bundleId : bundleId
            }
            // quick'n'dirty property injection
            for(var key in config) {
                instance[key] = config[key];
            }
            console.log('Starting bundle ' + bundleId);
            try {
                instance.start();
            } catch(err) {
                throw new Error('Couldnt start bundle with id ' + bundleId);
            }
        },
        processBundleJS : function(bundles, callback) {
            var me = this;
            var loading = [];
            var done = function(id) {
                // remove id from loading array
                var index = loading.indexOf(id);
                loading.splice(index, 1);
                // once loading is empty - call callback
                if(loading.length === 0) {
                    callback();
                }

            };
            bundles.forEach(function(item) {
                var bundle = Oskari.bundle(item.id);
                if(!bundle.clazz || !bundle.metadata || !bundle.metadata.source) {
                    return;
                }
                loading.push(item.id);
                me.handleBundleLoad(item.path, bundle.metadata.source, function() {
                    done(item.id);
                });
            });
        },
        handleBundleLoad : function(basePath, src, callback) {
            var me = this;
            var files = [];

            // http://stackoverflow.com/questions/14780350/convert-relative-path-to-absolute-using-javascript
            var absolute = function(base, relative) {
                var stack = base.split("/"),
                    parts = relative.split("/");
                stack.pop(); // remove current file name (or empty string)
                             // (omit if "base" is the current folder without trailing slash)
                for (var i=0; i<parts.length; i++) {
                    if (parts[i] == ".")
                        continue;
                    if (parts[i] == "..")
                        stack.pop();
                    else
                        stack.push(parts[i]);
                }
                return stack.join("/");
            }

            var getPath = function(base, src) {
                // handle case where src start with /
                var path = src;
                // handle relative ../../ case with src
                if (src.indexOf('/') !== 0) {
                    path = absolute(base, src);
                }
                return path.split('//').join('/');

            };
            // src.locales
            if(src.locales) {
                src.locales.forEach(function(file) {
                    if(file.src.endsWith('.js')) {
                        files.push(getPath(basePath, file.src));
                    }
                });
            }
            // src.resources
            if(src.resources) {
                src.resources.forEach(function(file) {
                    if(file.src.endsWith('.js')) {
                        files.push(getPath(basePath, file.src));
                    }
                });
            }
            // src.scripts
            if(src.scripts) {
                src.scripts.forEach(function(file) {

                    if(file.src.endsWith('.js')) {
                        files.push(getPath(basePath, file.src));
                    }
                    else if (file.src.endsWith('.css')) {
                        me.linkFile(getPath(basePath, file.src));
                    }
                });
            }

            // src.links
            if(src.links) {
                src.links.forEach(function(file) {
                    if(file.rel.toLowerCase() === 'import') {
                        me.linkFile(getPath(basePath, file.href), file.rel, 'text/html');
                    }
                });
            }
            require(files, function() {
                callback();
            });
        },
        linkFile : function(href, rel, type) {
            var importParentElement = document.head || document.body;
            var linkElement = document.createElement('link');
            linkElement.rel = rel || 'stylesheet';
            linkElement.type = type || 'text/css';
            linkElement.href = href;
            importParentElement.appendChild(linkElement);
        }

    }
    return loader;
};