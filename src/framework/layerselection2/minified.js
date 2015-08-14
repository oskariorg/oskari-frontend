Oskari.clazz.define("Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance",function(){this.sandbox=null,this.started=!1,this.plugins={},this.localization=null},{__name:"LayerSelection",getName:function(){return this.__name},setSandbox:function(e){this.sandbox=e},getSandbox:function(){return this.sandbox},getLocalization:function(e){return this._localization||(this._localization=Oskari.getLocalization(this.getName())),e?this._localization[e]:this._localization},start:function(){var e=this;if(e.started)return;e.started=!0;var t=this.conf,n=(t?t.sandbox:null)||"sandbox",r=Oskari.getSandbox(n);e.sandbox=r,this.localization=Oskari.getLocalization(this.getName()),r.register(e);for(p in e.eventHandlers)r.registerForEventByName(e,p);var i=r.getRequestBuilder("userinterface.AddExtensionRequest")(this);r.request(this,i),e.createUi()},init:function(){return null},update:function(){},onEvent:function(e){var t=this.eventHandlers[e.getName()];if(!t)return;return t.apply(this,[e])},eventHandlers:{AfterMapLayerRemoveEvent:function(e){this.plugins["Oskari.userinterface.Tile"].refresh(),this.plugins["Oskari.userinterface.Flyout"].handleLayerSelectionChanged(e.getMapLayer(),!1)},AfterMapLayerAddEvent:function(e){this.plugins["Oskari.userinterface.Tile"].refresh(),this.plugins["Oskari.userinterface.Flyout"].handleLayerSelectionChanged(e.getMapLayer(),!0,e.getKeepLayersOrder())},MapLayerEvent:function(e){var t=this.sandbox.getService("Oskari.mapframework.service.MapLayerService"),n=e.getLayerId();if(e.getOperation()==="update"){var r=t.findMapLayer(n);this.plugins["Oskari.userinterface.Flyout"].handleLayerModified(r)}else if(e.getOperation()==="sticky"){var r=t.findMapLayer(n);this.plugins["Oskari.userinterface.Flyout"].handleLayerSticky(r)}},MapLayerVisibilityChangedEvent:function(e){this.plugins["Oskari.userinterface.Flyout"].handleLayerVisibilityChanged(e.getMapLayer(),e.isInScale(),e.isGeometryMatch())},AfterChangeMapLayerOpacityEvent:function(e){e._creator!=this.getName()&&this.plugins["Oskari.userinterface.Flyout"].handleLayerOpacityChanged(e.getMapLayer())},AfterChangeMapLayerStyleEvent:function(e){e._creator!=this.getName()&&this.plugins["Oskari.userinterface.Flyout"].handleLayerStyleChanged(e.getMapLayer())},"userinterface.ExtensionUpdatedEvent":function(e){var t=this;if(e.getExtension().getName()!=t.getName())return;var n=e.getViewState()!="close"}},stop:function(){var e=this.sandbox;for(p in this.eventHandlers)e.unregisterFromEventByName(this,p);var t=e.getRequestBuilder("userinterface.RemoveExtensionRequest")(this);e.request(this,t),this.sandbox.unregister(this),this.started=!1},startExtension:function(){this.plugins["Oskari.userinterface.Flyout"]=Oskari.clazz.create("Oskari.mapframework.bundle.layerselection2.Flyout",this),this.plugins["Oskari.userinterface.Tile"]=Oskari.clazz.create("Oskari.mapframework.bundle.layerselection2.Tile",this)},stopExtension:function(){this.plugins["Oskari.userinterface.Flyout"]=null,this.plugins["Oskari.userinterface.Tile"]=null},getPlugins:function(){return this.plugins},getTitle:function(){return this.getLocalization("title")},getDescription:function(){return this.getLocalization("desc")},createUi:function(){var e=this;this.plugins["Oskari.userinterface.Flyout"].createUi(),this.plugins["Oskari.userinterface.Tile"].refresh()}},{protocol:["Oskari.bundle.BundleInstance","Oskari.mapframework.module.Module","Oskari.userinterface.Extension"]}),define("bundles/framework/bundle/layerselection2/instance",function(){}),define("src/framework/layerselection2/Flyout",["jquery"],function(e){Oskari.clazz.define("Oskari.mapframework.bundle.layerselection2.Flyout",function(e){this.instance=e,this.container=null,this.state=null,this.template=null,this.templateLayer=null,this.templateLayerTools=null,this.templateLayerOutOfScale=null,this.templateLayerOutOfContentArea=null,this.sortableBinded=!1,this._sliders={}},{getName:function(){return"Oskari.mapframework.bundle.layerselection2.Flyout"},setEl:function(t,n,r){this.container=t[0],e(this.container).hasClass("layerselection2")||e(this.container).addClass("layerselection2")},startPlugin:function(){var t=this.instance.getLocalization("layer");this.template=e('<ul class="selectedLayersList sortable" data-sortable=\'{itemCss: "li.layer.selected", handleCss: "div.layer-title" }\'></ul>'),this.templateLayer=e('<li class="layer selected"><div class="layer-info"><div class="layer-icon"></div><div class="layer-tool-remove"></div><div class="layer-title"><h4></h4></div></div><div class="stylesel"><label for="style">'+t.style+"</label>"+'<select name="style"></select></div>'+'<div class="layer-tools volatile">'+"</div>"+"</li>"),this.templateLayerFooterTools=e('<div class="left-tools"><div class="layer-visibility"><a href="JavaScript:void(0);">'+t.hide+"</a>"+"&nbsp;"+'<span class="temphidden" '+'style="display: none;">'+t.hidden+"</span>"+"</div>"+'<div class="oskariui layer-opacity">'+'<div class="layout-slider" id="layout-slider">'+"</div> "+'<div class="opacity-slider" style="display:inline-block">'+'<input type="text" name="opacity-slider" class="opacity-slider opacity" id="opacity-slider" />%</div>'+"</div>"+"</div>"+'<div class="right-tools">'+'<div class="layer-rights"></div>'+'<div class="object-data"></div>'+'<div class="layer-description">'+'<div class="icon-info"></div>'+"</div></div>"),this.templateLayerFooterHidden=e('<p class="layer-msg"><a href="JavaScript:void(0);">'+t.show+"</a> "+t.hidden+"</p>"),this.templateLayerFooterOutOfScale=e('<p class="layer-msg">'+t["out-of-scale"]+' <a href="JavaScript:void(0);">'+t["move-to-scale"]+"</a></p>"),this.templateLayerFooterOutOfContentArea=e('<p class="layer-msg">'+t["out-of-content-area"]+' <a href="JavaScript:void(0);">'+t["move-to-content-area"]+"</a></p>")},stopPlugin:function(){},getTitle:function(){return this.instance.getLocalization("title")},getDescription:function(){return this.instance.getLocalization("desc")},getOptions:function(){},setState:function(e){this.state=e},createUi:function(){var t=this,n=e(this.container);n.empty();var r=this.template.clone();n.append(r);var i=t.instance.getSandbox(),s=i.findAllSelectedMapLayers(),o=i.getMap().getScale(),u,a,f;for(u=s.length-1;u>=0;--u)a=s[u],f=this._createLayerContainer(a),r.append(f),this._appendLayerFooter(f,a,a.isInScale(o),!0);r.sortable({stop:function(e,n){var r=n.item;t._layerOrderChanged(r)}}),this.sortableBinded||(this.sortableBinded=!0)},_appendLayerFooter:function(e,t,n,r){var i=e.find("div.layer-tools"),s=this._createLayerFooter(t,e);if(!t.isVisible())i.addClass("hidden-layer"),s.css("display","none"),i.append(this._createLayerFooterHidden(t));else if(!n){var o=this._createLayerFooterOutOfScale(t);i.addClass("out-of-scale"),s.css("display","none"),i.append(o)}else if(!r){var u=this._createLayerFooterOutOfContentArea(t);i.addClass("out-of-content"),s.css("display","none"),i.append(u)}else s.css("display","");i.append(s);var a=this._addSlider(t,e),f=e.find("div.layer-opacity input.opacity");f.attr("value",t.getOpacity())},_addSlider:function(e,t){var n=this,r=e.getId(),i=e.getOpacity(),s=t.find(".layout-slider"),o=s.slider({min:0,max:100,value:i,slide:function(t,r){n._layerOpacityChanged(e,r.value)},stop:function(t,r){n._layerOpacityChanged(e,r.value)}});return n._sliders[r]=o,o},_layerOrderChanged:function(t){var n=e(this.container).find(".selectedLayersList li"),r=t.attr("layer_id"),i=-1;n.each(function(t,n){return e(this).attr("layer_id")==r?(i=t,!1):!0});if(i>-1){i=n.length-1-i;var s=this.instance.getSandbox(),o="RearrangeSelectedMapLayerRequest",u=s.getRequestBuilder(o),a=u(r,i);s.request(this.instance.getName(),a)}},_updateStyles:function(t,n){var r=this,i=r.instance.getSandbox(),s=n.find("div.stylesel");s.hide();if(t.getStyles&&t.getStyles().length>1){var o=!1,u=t.getStyles(),a=s.find("select");a.empty();for(var f=0;f<u.length;f++)if(u[f].getName()){var l=e('<option value="'+u[f].getName()+'">'+u[f].getTitle()+"</option>");a.append(l),o=!0}a.hasClass("binded")||(a.change(function(e){var n=a.find("option:selected").val();t.selectStyle(n);var s=i.getRequestBuilder("ChangeMapLayerStyleRequest"),o=s(t.getId(),n);i.request(r.instance.getName(),o)}),a.addClass("binded")),o&&(t.getCurrentStyle()&&a.val(t.getCurrentStyle().getName()),a.trigger("change"),s.show())}},_createLayerContainer:function(e){var t=this,n=t.instance.getSandbox(),r="ChangeMapLayerOpacityRequest",i=n.getRequestBuilder(r),s=e.getId(),o=e.getOpacity(),u=this.templateLayer.clone();u.attr("layer_id",s),u.find("div.layer-title h4").append(e.getName()),u.find("div.layer-title").append(e.getDescription()),this._updateStyles(e,u);var a=this.instance.getLocalization("layer").tooltip,f=u.find("div.layer-icon");return f.addClass(e.getIconClassname()),e.isBaseLayer()?f.attr("title",a["type-base"]):e.isLayerOfType("WMS")?f.attr("title",a["type-wms"]):e.isLayerOfType("WMTS")?f.attr("title",a["type-wms"]):e.isLayerOfType("WFS")?f.attr("title",a["type-wfs"]):e.isLayerOfType("VECTOR")&&f.attr("title",a["type-wms"]),e.isSticky()||(u.find("div.layer-tool-remove").addClass("icon-close"),u.find("div.layer-tool-remove").bind("click",function(){var r="RemoveMapLayerRequest",i=n.getRequestBuilder(r),s=i(e.getId());n.request(t.instance.getName(),s)})),u},handleLayerVisibilityChanged:function(t,n,r){var i=this,s=i.instance.getSandbox(),o="li.layer.selected[layer_id="+t.getId()+"]",u=e(this.container).find(o),a=this.instance.getLocalization("layer"),f=u.find("div.layer-tools");f.empty(),u.removeClass("hidden-layer"),u.removeClass("out-of-scale"),u.removeClass("out-of-content"),this._sliders[t.getId()]=null,this._appendLayerFooter(u,t,n,r)},_layerOpacityChanged:function(t,n){var r=this.instance.getSandbox(),i="ChangeMapLayerOpacityRequest",s=r.getRequestBuilder(i),o=s(t.getId(),n);r.request(this.instance.getName(),o);var u="li.layer.selected[layer_id="+t.getId()+"]",a=e(this.container).find(u),f=a.find("div.layer-opacity input.opacity");f.attr("value",t.getOpacity())},handleLayerOpacityChanged:function(e){this._sliders[e.getId()]&&this._sliders[e.getId()].slider("value",e.getOpacity())},handleLayerStyleChanged:function(t){var n="li.layer.selected[layer_id="+t.getId()+"]",r=e(this.container).find(n),i=r.find("div.stylesel select");i.val(t.getCurrentStyle().getName())},_createLayerFooterOutOfScale:function(e){var t=this,n=t.instance.getSandbox(),r=this.templateLayerFooterOutOfScale.clone();r.addClass("layer-msg-for-outofscale");var i="MapModulePlugin.MapMoveByLayerContentRequest",s=n.getRequestBuilder(i);return r.find("a").bind("click",function(){var r=s(e.getId());return n.request(t.instance.getName(),r),!1}),r},_createLayerFooterHidden:function(e){var t=this,n=t.instance.getSandbox(),r=this.templateLayerFooterHidden.clone();r.addClass("layer-msg-for-hidden");var i="MapModulePlugin.MapLayerVisibilityRequest",s=n.getRequestBuilder(i);return r.find("a").bind("click",function(){var r=s(e.getId(),!0);return n.request(t.instance.getName(),r),!1}),r},_createLayerFooterOutOfContentArea:function(e){var t=this,n=t.instance.getSandbox(),r=this.templateLayerFooterOutOfContentArea.clone();r.addClass("layer-msg-for-outofcontentarea");var i="MapModulePlugin.MapMoveByLayerContentRequest",s=n.getRequestBuilder(i);return r.find("a").bind("click",function(){var r=s(e.getId());return n.request(t.instance.getName(),r),!1}),r},_createLayerFooter:function(t,n){var r=this,i=r.instance.getSandbox(),s=this.templateLayerFooterTools.clone(),o=this.instance.getLocalization("layer"),u="MapModulePlugin.MapLayerVisibilityRequest",a=i.getRequestBuilder(u);s.find("div.layer-visibility a").bind("click",function(){var e=a(t.getId(),!1);return i.request(r.instance.getName(),e),!1}),subLmeta=!1;if(!t.getMetadataIdentifier()){subLayers=t.getSubLayers();if(subLayers&&subLayers.length>0){subLmeta=!0;for(c=0;c<subLayers.length;c+=1){subUuid=subLayers[c].getMetadataIdentifier();if(!subUuid||subUuid==""){subLmeta=!1;break}}}subLmeta||s.find("div.layer-description").hide()}(t.getMetadataIdentifier()||subLmeta)&&s.find("div.icon-info").bind("click",function(){var e="catalogue.ShowMetadataRequest",n=t.getMetadataIdentifier(),r=[],s={};s[n]=!0;var o=t.getSubLayers();if(o&&o.length>0)for(var u=0;u<o.length;u++){var a=o[u].getMetadataIdentifier();a&&a!=""&&!s[a]&&(s[a]=!0,r.push({uuid:a}))}i.postRequestByName(e,[{uuid:n},r])});var f=function(e){return function(){return e.getCallback()(),!1}},l=t.getTools();for(var c=0;c<l.length;c++){var h=l[c];if(h)if(h.getIconCls()){var p=e("<div></div>");p.addClass(h.getIconCls()),p.attr("title",h.getTooltip()),s.find("div.object-data").append(p),p.bind("click",f(h))}else{var p=e('<a href="JavaScript:void(0);"></a>');p.append(h.getTitle()),s.find("div.object-data").append(p),p.bind("click",f(h))}}return this._updatePublishPermissionText(t,s),s},_updatePublishPermissionText:function(e,t){var n=this.instance.getSandbox(),r=this.instance.getLocalization("layer"),i=e.getPermission("publish");i=="publication_permission_ok"&&n.getUser().isLoggedIn()&&(t.find("div.layer-rights").html(r.rights.can_be_published_map_user.label),t.find("div.layer-rights").attr("title",r.rights.can_be_published_map_user.tooltip))},handleLayerSelectionChanged:function(t,n,r){if(n==1){var i=this,s=i.instance.getSandbox(),o=s.getMap().getScale(),u=e("ul.selectedLayersList"),a=this._createLayerContainer(t),f=a.find("div.layer-tools"),l=[];t.isBaseLayer()&&r!=1?l=u.find("li[layer_id^=base_]"):l=u.find(".layer.selected"),l.length>0?t.isBaseLayer()&&r!=1?l.last().after(a):l.first().before(a):u.append(a),this._appendLayerFooter(a,t,t.isInScale(o),!0)}else{var c=e(this.container).find("li[layer_id="+t.getId()+"]");c&&(this._sliders[t.getId()]=null,c.remove())}},handleLayerModified:function(t){var n=this,r=e(this.container).find("li[layer_id="+t.getId()+"]");e(r).find(".layer-title h4").html(t.getName()),this._updateStyles(t,r);var i=r.find("div.layer-tools");this._updatePublishPermissionText(t,i)},handleLayerSticky:function(t){var n=this,r=e(this.container).find("li[layer_id="+t.getId()+"]");r.find("div.layer-tool-remove").removeClass("icon-close")},refresh:function(){var e=this,t=e.instance.getSandbox(),n=t.findAllSelectedMapLayers();for(var r=n.length-1;r>=0;--r){var i=n[r];this.handleLayerOpacityChanged(i)}}},{protocol:["Oskari.userinterface.Flyout"]})}),Oskari.clazz.define("Oskari.mapframework.bundle.layerselection2.Tile",function(e){this.instance=e,this.container=null,this.template=null,this.shownLayerCount=null},{getName:function(){return"Oskari.mapframework.bundle.layerselection2.Tile"},setEl:function(e,t,n){this.container=jQuery(e)},startPlugin:function(){this.refresh()},stopPlugin:function(){this.container.empty()},getTitle:function(){return this.instance.getLocalization("title")},getDescription:function(){return this.instance.getLocalization("desc")},getOptions:function(){},setState:function(e){},notifyUser:function(){var e=this,t=this.container.children(".oskari-tile-status");t.stop(),this._blink(t,2)},_blink:function(e,t){var n=this;if(!e)return;t||(t=1),e.animate({opacity:.25},500,function(){e.animate({opacity:1},500,function(){t>1&&n._blink(e,--t)})})},refresh:function(){var e=this,t=e.instance,n=this.container,r=this.template,i=t.getSandbox(),s=i.findAllSelectedMapLayers(),o=s.length,u=this.container.children(".oskari-tile-status");u.addClass("icon-bubble-right"),u.html(o),this.notifyUser()}},{protocol:["Oskari.userinterface.Tile"]}),define("bundles/framework/bundle/layerselection2/Tile",function(){}),define("normalize",["require","module"],function(e,t){function o(e,t,n){if(e.indexOf("data:")===0)return e;e=r(e);if(e.match(/^\//)||e.match(s))return e;var i=n.match(s),o=t.match(s);return o&&(!i||i[1]!=o[1]||i[2]!=o[2])?u(e,t):a(u(e,t),n)}function u(e,t){e.substr(0,2)=="./"&&(e=e.substr(2));var n=t.split("/"),r=e.split("/");n.pop();while(curPart=r.shift())curPart==".."?n.pop():n.push(curPart);return n.join("/")}function a(e,t){var n=t.split("/");n.pop(),t=n.join("/")+"/",i=0;while(t.substr(i,1)==e.substr(i,1))i++;while(t.substr(i,1)!="/")i--;t=t.substr(i+1),e=e.substr(i+1),n=t.split("/");var r=e.split("/");out="";while(n.shift())out+="../";while(curPart=r.shift())out+=curPart+"/";return out.substr(0,out.length-1)}var n=/([^:])\/+/g,r=function(e){return e.replace(n,"$1/")},s=/[^\:\/]*:\/\/([^\/])*/,f=function(e,t,n,i){t=r(t),n=r(n);var s=/@import\s*("([^"]*)"|'([^']*)')|url\s*\(\s*(\s*"([^"]*)"|'([^']*)'|[^\)]*\s*)\s*\)/ig,u,a,e;while(u=s.exec(e)){a=u[3]||u[2]||u[5]||u[6]||u[4];var f;i&&a.substr(0,1)=="/"?f=i+a:f=o(a,t,n);var l=u[5]||u[6]?1:0;e=e.substr(0,s.lastIndex-a.length-l-1)+f+e.substr(s.lastIndex-l-1),s.lastIndex=s.lastIndex+(f.length-a.length)}return e};return f.convertURIBase=o,f}),define("css",["./normalize"],function(e){function n(e,t){for(var n=0,r=e.length;n<r;n++)if(e[n]===t)return n;return-1}var t=0;if(typeof window=="undefined")return{load:function(e,t,n){n()}};var r=!1,i=document.getElementsByTagName("head")[0],s=window.navigator.userAgent.match(/Trident\/([^ ;]*)|AppleWebKit\/([^ ;]*)|Opera\/([^ ;]*)|rv\:([^ ;]*)(.*?)Gecko\/([^ ;]*)|MSIE\s([^ ;]*)/),o=!1;!s||(s[1]||s[7]?(o=parseInt(s[1])<6||parseInt(s[7])<=9,s="trident"):s[2]?(o=!0,s="webkit"):s[3]||(s[4]?(o=parseInt(s[4])<18,s="gecko"):r&&alert("Engine detection failed")));var u={},a=/^\/|([^\:\/]*:)/;u.pluginBuilder="./css-builder";var f=[],l={},c=[];u.addBuffer=function(e){if(n(f,e)!=-1)return;if(n(c,e)!=-1)return;f.push(e),c.push(e)},u.setBuffer=function(t,n){var r=window.location.pathname.split("/");r.pop(),r=r.join("/")+"/";var i=require.toUrl("base_url").split("/");i.pop();var s=i.join("/")+"/";s=e.convertURIBase(s,r,"/"),s.match(a)||(s="/"+s),s.substr(s.length-1,1)!="/"&&(s+="/"),u.inject(e(t,s,r));for(var o=0;o<f.length;o++)(n&&f[o].substr(f[o].length-5,5)==".less"||!n&&f[o].substr(f[o].length-4,4)==".css")&&(function(e){l[e]=l[e]||!0,setTimeout(function(){typeof l[e]=="function"&&l[e](),delete l[e]},7)}(f[o]),f.splice(o--,1))},u.attachBuffer=function(e,t){for(var r=0;r<f.length;r++)if(f[r]==e)return l[e]=t,!0;if(l[e]===!0)return l[e]=t,!0;if(n(c,e)!=-1)return t(),!0};var h=function(e,t){setTimeout(function(){for(var n=0;n<document.styleSheets.length;n++){var r=document.styleSheets[n];if(r.href==e.href)return t()}h(e,t)},10)},p=function(e,t){setTimeout(function(){try{return e.sheet.cssRules,t()}catch(n){}p(e,t)},10)};if(s=="trident"&&o)var d=[],v=[],m=0,g=function(e,t){var n;v.push({url:e,cb:t}),n=d.shift(),!n&&m++<31&&(n=document.createElement("style"),i.appendChild(n)),n&&y(n)},y=function(e){var t=v.shift();if(!t){e.onload=w,d.push(e);return}e.onload=function(){t.cb(t.ss),y(e)};try{var n=e.styleSheet;t.ss=n.imports[n.addImport(t.url)]}catch(r){alert("Got Error:"+r)}};var b=function(e){var t=document.createElement("link");return t.type="text/css",t.rel="stylesheet",t.href=e,t},w=function(){};u.linkLoad=function(e,t){var n=setTimeout(function(){r&&alert("timeout"),t()},A*1e3-100),u=function(){clearTimeout(n),a&&(a.onload=w),setTimeout(t,7)};if(!o){var a=b(e);a.onload=u,i.appendChild(a)}else if(s=="webkit"){var a=b(e);h(a,u),i.appendChild(a)}else if(s=="gecko"){var f=document.createElement("style");f.textContent='@import "'+e+'"',p(f,u),i.appendChild(f)}else s=="trident"&&g(e,u)};var E=["Msxml2.XMLHTTP","Microsoft.XMLHTTP","Msxml2.XMLHTTP.4.0"],S={},x=function(e,t,n){if(S[e]){t(S[e]);return}var r,i,s;if(typeof XMLHttpRequest!="undefined")r=new XMLHttpRequest;else if(typeof ActiveXObject!="undefined")for(i=0;i<3;i+=1){s=E[i];try{r=new ActiveXObject(s)}catch(o){}if(r){E=[s];break}}r.open("GET",e,requirejs.inlineRequire?!1:!0),r.onreadystatechange=function(i){var s,o;r.readyState===4&&(s=r.status,s>399&&s<600?(o=new Error(e+" HTTP status: "+s),o.xhr=r,n(o)):(S[e]=r.responseText,t(r.responseText)))},r.send(null)},T=0,N;u.inject=function(e){T<31&&(N=document.createElement("style"),N.type="text/css",i.appendChild(N),T++),N.styleSheet?N.styleSheet.cssText+=e:N.appendChild(document.createTextNode(e))};var C=/@import\s*(url)?\s*(('([^']*)'|"([^"]*)")|\(('([^']*)'|"([^"]*)"|([^\)]*))\))\s*;?/g,k=window.location.pathname.split("/");k.pop(),k=k.join("/")+"/";var L=function(t,n,r){t.match(a)||(t="/"+e.convertURIBase(t,k,"/")),x(t,function(i){i=e(i,t,k);var s=[],o=[],u=[],a;while(a=C.exec(i)){var f=a[4]||a[5]||a[7]||a[8]||a[9];s.push(f),o.push(C.lastIndex-a[0].length),u.push(a[0].length)}var l=0;for(var c=0;c<s.length;c++)(function(e){L(s[e],function(t){i=i.substr(0,o[e])+t+i.substr(o[e]+u[e]);var r=t.length-u[e];for(var a=e+1;a<s.length;a++)o[a]+=r;l++,l==s.length&&n(i)},r)})(c);s.length==0&&n(i)},r)};u.normalize=function(e,t){return e.substr(e.length-4,4)==".css"&&(e=e.substr(0,e.length-4)),t(e)};var A,O=!1;return u.load=function(e,t,n,i,s){A=A||i.waitSeconds||7;var a=e+(s?".less":".css");if(u.attachBuffer(a,n))return;var f=t.toUrl(a);!O&&r&&(alert(o?"hacking links":"not hacking"),O=!0),s?L(f,function(e){s&&(e=s(e,function(e){u.inject(e),setTimeout(n,7)}))}):u.linkLoad(f,n)},r&&(u.inspect=function(){if(stylesheet.styleSheet)return stylesheet.styleSheet.cssText;if(stylesheet.innerHTML)return stylesheet.innerHTML}),u}),requirejs.s.contexts._.nextTick=function(e){e()},require(["css"],function(e){e.addBuffer("resources/framework/bundle/layerselection2/css/style.css")}),requirejs.s.contexts._.nextTick=requirejs.nextTick,Oskari.registerLocalization({lang:"fi",key:"LayerSelection",value:{title:"Valitut tasot",desc:"",layer:{style:"Tyyli",show:"Näytä",hide:"Piilota",hidden:"Karttataso on tilapäisesti piilotettu.","out-of-scale":"Tämän karttatason aineistoa ei voida näyttää valitulla mittakaavatasolla.","move-to-scale":"Siirry sopivalle mittakaavatasolle","out-of-content-area":"Tällä karttatasolla ei ole aineistoa tässä sijainnissa","move-to-content-area":"Siirry kattavuusalueen keskipisteeseen",description:"Kuvaus","object-data":"Kohdetiedot",rights:{notavailable:"Ei julkaistavissa",guest:"Kirjaudu sisään julkaistaksesi karttatason",loggedin:"Julkaistavissa",official:"Viranomaiskäyttöön julkaistavissa","need-login":"Vaatii kirjautumisen",can_be_published_by_provider:{label:"Tiedontuottajana julkaistavissa",tooltip:"Karttatason julkaisemiseen tarvitaan tiedontuottajan oikeudet. Mikäli olet tiedontuottaja, ota yhteyttä Paikkatietoikkunan tukipalveluun ja pyydä julkaisuoikeuksia."},can_be_published:{label:"Julkaistavissa",tooltip:"Karttatason voi julkaista upotetussa karttaikkunassa ilman käyttömäärärajoitusta."},can_be_published_map_user:{label:"Julkaistavissa",tooltip:"Karttatason voi julkaista upotetussa karttaikkunassa. Viikoittainen käyttömäärä voi olla rajoitettu."},no_publication_permission:{label:"Ei julkaistavissa",tooltip:"Karttatason julkaisemiseen upotetussa karttaikkunassa ei ole tiedontuottajan lupaa."},can_be_published_by_authority:{label:"Julkaistavissa",tooltip:"Karttatason voi julkaista upotetussa karttaikkunassa ilman käyttömäärärajoitusta."}},tooltip:{"type-base":"Taustakartta","type-wms":"Karttataso","type-wfs":"Tietotuote"}}}}),define("bundles/framework/bundle/layerselection2/locale/fi",function(){}),Oskari.registerLocalization({lang:"sv",key:"LayerSelection",value:{title:"Valda kartlager",desc:"",layer:{style:"Stil",show:"Visa",hide:"Göm",hidden:"Kartan är tillfälligt gömd.","out-of-scale":"Data som ingår i detta kartlager kan inte visas på den valda skalnivån.","move-to-scale":"Gå till en lämplig skalnivå.","out-of-content-area":"Detta kartlager saknar innehåll vid dessa koordinater.","move-to-content-area":"Gå till täckningsområdets mittpunkt.",description:"Beskrivning","object-data":"Objektuppgifter",rights:{notavailable:"Får inte publiceras.",guest:"Logga in för att avskilja och inbädda detta kartlager.",loggedin:"Får publiceras",official:"Får publiceras för myndighetsbruk.","need-login":"Du måste logga in.",can_be_published_by_provider:{label:"Får publiceras av dataproducenter",tooltip:"För att publicera detta kartlager krävs dataproducenträttigheter. Om du är dataproducent, kontakta Paikkatietoikkunas stödtjänst och be om publiceringsrättigheter."},can_be_published:{label:"Får publiceras",tooltip:"Kartlagret får publiceras i ett inbäddat kartfönster utan att begränsa antalet användare."},can_be_published_map_user:{label:"Får publiceras",tooltip:"Kartlagret får publiceras i ett inbäddat kartfönster. Antalet användare per vecka kan vara begränsat."},no_publication_permission:{label:"Får inte publiceras.",tooltip:"Dataproducenten har inte beviljat tillstånd att publicera kartlagret i ett inbäddat kartfönster."},can_be_published_by_authority:{label:"Får publiceras",tooltip:"Kartlagret får publiceras i ett inbäddat kartfönster utan användningsbegränsningar."}},tooltip:{"type-base":"Bakgrundskarta","type-wms":"Kartlager","type-wfs":"Dataprodukt"}}}}),define("bundles/framework/bundle/layerselection2/locale/sv",function(){}),Oskari.registerLocalization({lang:"en",key:"LayerSelection",value:{title:"Selected layers",desc:"",layer:{style:"Style",show:"Show",hide:"Hide",hidden:"The map has been temporarily hidden.","out-of-scale":"Data in this map layer cannot be shown at the selected scale level.","move-to-scale":"Go to a suitable scale level.","out-of-content-area":"The map layer contais no data at this location.","move-to-content-area":"Move to the centre of the content area.",description:"Description","object-data":"Object data",rights:{notavailable:"Publication prohibited.",guest:"Log in to publish this map layer.",loggedin:"Publication permitted",official:"Publication permitted for use by authorities.","need-login":"You must log in.",can_be_published_by_provider:{label:"Publication permitted for data providers.",tooltip:"Data provider rights are required to publish this map layer. If you are a data provider, please contact the support service of Paikkatietoikkuna and request rights to publish."},can_be_published:{label:"Publication permitted",tooltip:"The map layer can be published in an embedded map window without limiting the number of users."},can_be_published_map_user:{label:"Publication permitted",tooltip:"The map layer can be published in an embedded map window and the number of users per week may be limited."},no_publication_permission:{label:"Publication prohibited.",tooltip:"The data provider has not granted permission to publish this map layer in an embedded map window."},can_be_published_by_authority:{label:"Publication permitted",tooltip:"The map layer can be published in an embedded map window without usage limits."}},tooltip:{"type-base":"Background map","type-wms":"Map layer","type-wfs":"Data product"}}}}),define("bundles/framework/bundle/layerselection2/locale/en",function(){}),Oskari.registerLocalization({lang:"cs",key:"LayerSelection",value:{title:"Vybrané vrstvy",desc:"",layer:{style:"Styl",show:"Zobrazit",hide:"Skrýt",hidden:"Mapa byla dočasně skryta.","out-of-scale":"Data této mapové vrstvy nemohou být zobrazena ve zvolené úrovni měřítka.","move-to-scale":"Přibliž do vhodné úrovně měřítka.","out-of-content-area":"V této lokalitě neobsahuje mapová vrstva žádná data.","move-to-content-area":"Přesuň do středu plochy rozsahu.",description:"Popis","object-data":"Objektová data",rights:{notavailable:"Publikace zakázána",guest:"Pro publikaci této mapové vrstvy se přihlaste.",loggedin:"Publikace povolena",official:"Publikace povolena pro použití úřady.","need-login":"Musíte se přihlásit.",can_be_published_by_provider:{label:"Publikace povolena pro poskytovatele dat.",tooltip:"Pro publikaci této mapové vrstvy potřebujete práva poskytovatelů dat. Pokud jste poskytovatel dat, kontaktujte prosím podporu a požadujte práva pro publikaci."},can_be_published:{label:"Publikace povolena",tooltip:"Mapová vrstva může být publikována ve vloženém mapovém okně bez omezení počtu uživatelů."},can_be_published_map_user:{label:"Publikace povolena",tooltip:"Mapová vrstva může být publikována ve vloženém mapovém okně a počet uživatelů za týden může být omezen."},no_publication_permission:{label:"Publikace zakázána",tooltip:"Poskytovatel dat nepovolil publikaci této mapové vrstvy ve vloženém mapovém okně."},can_be_published_by_authority:{label:"Publikace povolena",tooltip:"Mapová vrstva může být publikována ve vloženém mapovém okně bez omezení."}},tooltip:{"type-base":"Mapa pozadí","type-wms":"Mapová vrstva","type-wfs":"Datový produkt"}}}}),define("bundles/framework/bundle/layerselection2/locale/cs",function(){}),Oskari.registerLocalization({lang:"de",key:"LayerSelection",value:{title:"Ausgewählte Ebenen",desc:"",layer:{style:"Ansicht",show:"Zeige",hide:"Verberge",hidden:"Diese Karte wurde vorübergehend ausgeblendet.","out-of-scale":"Die Daten der Kartenebenen können in diesem Maßstab nicht angezeigt werden.","move-to-scale":"Zu einem geeigneten Maßstab wechseln.","out-of-content-area":"Die Kartenebene enthält an dieser Position keine Daten.","move-to-content-area":"Direkt zum Mittelpunkt der Daten begeben.",description:"Beschreibung","object-data":"Objektdaten",rights:{notavailable:"Veröffentlichung untersagt.",guest:"Melden Sie sich an, um diese Kartenebene zu veröffentlichen.",loggedin:"Veröffentlichung erlaubt",official:"Veröffentlichung für die Nutzung durch Behörden zulässig.","need-login":"Sie müssen sich anmelden.",can_be_published_by_provider:{label:"Veröffentlichung erlaubt für Datenanbieter.",tooltip:"Es werden Datenanbieter-Rechte benötigt, um diese Kartenebene zu veröffentlichen. Sollten Sie ein Datenanbieter sein, kontaktieren Sie bitte den Support-Service und fordern Sie die Veröffentlichungsrechte an."},can_be_published:{label:"Veröffentlichung erlaubt",tooltip:"Die Kartenebene darf ohne eine Begrenzung der Nutzeranzahl in einem eingebundenen Kartenfenster veröffentlicht werden."},can_be_published_map_user:{label:"Veröffentlichung erlaubt",tooltip:"Die Kartenebene darf mit einer eventuellen Begrenzung der Nutzeranzahl pro Woche in einem eingebundenen Kartenfenster veröffentlicht werden."},no_publication_permission:{label:"Veröffentlichung untersagt",tooltip:"Der Datenanbieter hat keine Genehmigung zur Veröffentlichung der Kartenebene in einem eingebundenen Kartenfenster gegeben."},can_be_published_by_authority:{label:"Veröffentlichung erlaubt",tooltip:"Die Kartenebene darf in einem eingebundenen Kartenfenster ohne Nutzungsbeschränkungen veröffentlicht werden."}},tooltip:{"type-base":"Hintergrundkarte","type-wms":"Kartenebene","type-wfs":"Datenprodukt"}}}}),define("bundles/framework/bundle/layerselection2/locale/de",function(){}),Oskari.registerLocalization({lang:"es",key:"LayerSelection",value:{title:"Capas seleccionadas",desc:"",layer:{style:"Estilo",show:"Mostrar",hide:"Ocultar",hidden:"Se ha ocultado el mapa temporalmente.","out-of-scale":"No pueden mostrarse los datos de esta capa a la escala seleccionada.","move-to-scale":"Ir a un nivel de escala adecuado.","out-of-content-area":"La capa no contiene datos para esta localización.","move-to-content-area":"Moverse al centro del área del contenido.",description:"Descripción","object-data":"Datos del objeto",rights:{notavailable:"Publicación no permitida",guest:"Identificarse para publicar esta capa.",loggedin:"Publicación permitida",official:"Publicación permitida para el uso mediante autorización.","need-login":"Debe identificarse.",can_be_published_by_provider:{label:"Publicación permitida para proveedores de datos.",tooltip:"Se requieren derechos de proveedor de datos para publicar esta capa. Si es un proveedor de datos, por favor, contacte con el servicio de soporte y solicite los derechos para publicar."},can_be_published:{label:"Publicación permitida",tooltip:"La capa puede publicarse en un visualizador incorporado sin límite en el número de usuarios."},can_be_published_map_user:{label:"Publicación permitida",tooltip:"La capa puede publicarse en un visualizador incorporado y el número de usuarios semanales puede limitarse."},no_publication_permission:{label:"Publicación no permitida",tooltip:"El proveedor de datos no ha concedido el permiso para publicar esta capa en un visualizador incorporado."},can_be_published_by_authority:{label:"Publicación permitida",tooltip:"La capa puede publicarse en un visualizador incrustado sin limitaciones de uso."}},tooltip:{"type-base":"Mapa de fondo","type-wms":"Capa","type-wfs":"Producto"}}}}),define("bundles/framework/bundle/layerselection2/locale/es",function(){}),define("src/framework/layerselection2/module",["oskari","jquery","bundles/framework/bundle/layerselection2/instance","./Flyout","bundles/framework/bundle/layerselection2/Tile","css!resources/framework/bundle/layerselection2/css/style.css","bundles/framework/bundle/layerselection2/locale/fi","bundles/framework/bundle/layerselection2/locale/sv","bundles/framework/bundle/layerselection2/locale/en","bundles/framework/bundle/layerselection2/locale/cs","bundles/framework/bundle/layerselection2/locale/de","bundles/framework/bundle/layerselection2/locale/es"],function(e,t){return e.bundleCls("layerselection2").category({create:function(){var t=this,n=e.clazz.create("Oskari.mapframework.bundle.layerselection2.LayerSelectionBundleInstance");return n},update:function(e,t,n,r){}})}),requirejs.s.contexts._.nextTick=function(e){e()},require(["css"],function(e){e.setBuffer("div.layerselection2 .layer.selected {\r\n  border: 1pt solid #c0d0e0;\r\n  margin: 0 5px 5px 0;\r\n  height: 70px9;\r\n  /*IE9 */ }\r\n  div.layerselection2 .layer.selected.out-of-scale, div.layerselection2 .layer.selected.out-of-content, div.layerselection2 .layer.selected.hidden {\r\n    color: #909090; }\r\n  div.layerselection2 .layer.selected div.layer-info {\r\n    background-color: #FFF;\r\n    padding: 5px; }\r\n    div.layerselection2 .layer.selected div.layer-info div.layer-icon {\r\n      float: left;\r\n      height: 20px;\r\n      margin-top: 5px;\r\n      margin-left: 20px;\r\n      margin-right: 20px;\r\n      width: 16px;\r\n      background-repeat: no-repeat; }\r\n    div.layerselection2 .layer.selected div.layer-info div.layer-title {\r\n      display: inline; }\r\n      div.layerselection2 .layer.selected div.layer-info div.layer-title h4 {\r\n        font: 14pt Arial, sans-serif;\r\n        padding: 0; }\r\n    div.layerselection2 .layer.selected div.layer-info div.layer-tool-remove {\r\n      float: right; }\r\n  div.layerselection2 .layer.selected div.layer-tools {\r\n    background-color: #f3f3f3;\r\n    padding: 7px; }\r\n    div.layerselection2 .layer.selected div.layer-tools div.layout-slider {\r\n      width: 140px;\r\n      display: inline-block;\r\n      margin-right: 16px; }\r\n    div.layerselection2 .layer.selected div.layer-tools div.left-tools {\r\n      display: inline-block; }\r\n      div.layerselection2 .layer.selected div.layer-tools div.left-tools div.layer-visibility {\r\n        padding-right: 5px;\r\n        display: inline-block; }\r\n      div.layerselection2 .layer.selected div.layer-tools div.left-tools div.layer-opacity {\r\n        display: inline-block;\r\n        background-image: url('/Oskari/resources/framework/bundle/layerselection2/images/opacity_slider.png');\r\n        background-repeat: no-repeat; }\r\n        div.layerselection2 .layer.selected div.layer-tools div.left-tools div.layer-opacity input.opacity {\r\n          padding: 1px;\r\n          width: 25px; }\r\n    div.layerselection2 .layer.selected div.layer-tools div.right-tools {\r\n      padding-top: 5px;\r\n      float: right; }\r\n      div.layerselection2 .layer.selected div.layer-tools div.right-tools div {\r\n        float: left;\r\n        margin-right: 5px; }\r\n        div.layerselection2 .layer.selected div.layer-tools div.right-tools div.layer-rights, div.layerselection2 .layer.selected div.layer-tools div.right-tools div.object-data {\r\n          padding-top: 2px; }\r\n        div.layerselection2 .layer.selected div.layer-tools div.right-tools div.object-data a {\r\n          padding-left: 5px; }\r\n  div.layerselection2 .layer.selected div.stylesel label {\r\n    padding: 7px; }\r\ndiv.layerselection2 ul.selectedLayersList {\r\n  height: 100%;\r\n  width: 100%;\r\n  overflow: auto;\r\n  list-style-type: none;\r\n  padding: 0;\r\n  margin: 0; }\r\n  div.layerselection2 ul.selectedLayersList span {\r\n    position: absolute;\r\n    margin-left: -1.3em; }\r\n")}),requirejs.s.contexts._.nextTick=requirejs.nextTick;