var requirejs, require, define;

!function(ga) {
    function ka(b, c, d, g) {
        return g || "";
    }
    function K(b) {
        return "[object Function]" === Q.call(b);
    }
    function L(b) {
        return "[object Array]" === Q.call(b);
    }
    function y(b, c) {
        if (b) {
            var d;
            for (d = 0; d < b.length && (!b[d] || !c(b[d], d, b)); d += 1) ;
        }
    }
    function X(b, c) {
        if (b) {
            var d;
            for (d = b.length - 1; d > -1 && (!b[d] || !c(b[d], d, b)); --d) ;
        }
    }
    function x(b, c) {
        return la.call(b, c);
    }
    function e(b, c) {
        return x(b, c) && b[c];
    }
    function D(b, c) {
        for (var d in b) if (x(b, d) && c(b[d], d)) break;
    }
    function Y(b, c, d, g) {
        return c && D(c, function(c, e) {
            !d && x(b, e) || (!g || "object" != typeof c || !c || L(c) || K(c) || c instanceof RegExp ? b[e] = c : (b[e] || (b[e] = {}), 
            Y(b[e], c, d, g)));
        }), b;
    }
    function z(b, c) {
        return function() {
            return c.apply(b, arguments);
        };
    }
    function ha(b) {
        throw b;
    }
    function ia(b) {
        if (!b) return b;
        var c = ga;
        return y(b.split("."), function(b) {
            c = c[b];
        }), c;
    }
    function F(b, c, d, g) {
        return c = Error(c + "\nhttp://requirejs.org/docs/errors.html#" + b), c.requireType = b, 
        c.requireModules = g, d && (c.originalError = d), c;
    }
    function ma(b) {
        function c(a, n, b) {
            var h, k, f, c, d, l, g, r;
            n = n && n.split("/");
            var q = p.map, m = q && q["*"];
            if (a) {
                for (a = a.split("/"), k = a.length - 1, p.nodeIdCompat && U.test(a[k]) && (a[k] = a[k].replace(U, "")), 
                "." === a[0].charAt(0) && n && (k = n.slice(0, n.length - 1), a = k.concat(a)), 
                k = a, f = 0; f < k.length; f++) c = k[f], "." === c ? (k.splice(f, 1), --f) : ".." === c && 0 !== f && (1 !== f || ".." !== k[2]) && ".." !== k[f - 1] && f > 0 && (k.splice(f - 1, 2), 
                f -= 2);
                a = a.join("/");
            }
            if (b && q && (n || m)) {
                k = a.split("/"), f = k.length;
                a: for (;f > 0; --f) {
                    if (d = k.slice(0, f).join("/"), n) for (c = n.length; c > 0; --c) if ((b = e(q, n.slice(0, c).join("/"))) && (b = e(b, d))) {
                        h = b, l = f;
                        break a;
                    }
                    !g && m && e(m, d) && (g = e(m, d), r = f);
                }
                !h && g && (h = g, l = r), h && (k.splice(0, l, h), a = k.join("/"));
            }
            return (h = e(p.pkgs, a)) ? h : a;
        }
        function d(a) {
            E && y(document.getElementsByTagName("script"), function(n) {
                return n.getAttribute("data-requiremodule") === a && n.getAttribute("data-requirecontext") === l.contextName ? (n.parentNode.removeChild(n), 
                !0) : void 0;
            });
        }
        function m(a) {
            var n = e(p.paths, a);
            return n && L(n) && 1 < n.length ? (n.shift(), l.require.undef(a), l.makeRequire(null, {
                skipMap: !0
            })([ a ]), !0) : void 0;
        }
        function r(a) {
            var n, b = a ? a.indexOf("!") : -1;
            return b > -1 && (n = a.substring(0, b), a = a.substring(b + 1, a.length)), [ n, a ];
        }
        function q(a, n, b, h) {
            var k, f, d = null, g = n ? n.name : null, p = a, q = !0, m = "";
            return a || (q = !1, a = "_@r" + (Q += 1)), a = r(a), d = a[0], a = a[1], d && (d = c(d, g, h), 
            f = e(v, d)), a && (d ? m = f && f.normalize ? f.normalize(a, function(a) {
                return c(a, g, h);
            }) : -1 === a.indexOf("!") ? c(a, g, h) : a : (m = c(a, g, h), a = r(m), d = a[0], 
            m = a[1], b = !0, k = l.nameToUrl(m))), b = !d || f || b ? "" : "_unnormalized" + (T += 1), 
            {
                prefix: d,
                name: m,
                parentMap: n,
                unnormalized: !!b,
                url: k,
                originalName: p,
                isDefine: q,
                id: (d ? d + "!" + m : m) + b
            };
        }
        function u(a) {
            var b = a.id, c = e(t, b);
            return c || (c = t[b] = new l.Module(a)), c;
        }
        function w(a, b, c) {
            var h = a.id, k = e(t, h);
            !x(v, h) || k && !k.defineEmitComplete ? (k = u(a), k.error && "error" === b ? c(k.error) : k.on(b, c)) : "defined" === b && c(v[h]);
        }
        function A(a, b) {
            var c = a.requireModules, h = !1;
            b ? b(a) : (y(c, function(b) {
                (b = e(t, b)) && (b.error = a, b.events.error && (h = !0, b.emit("error", a)));
            }), h || g.onError(a));
        }
        function B() {
            V.length && (y(V, function(a) {
                var b = a[0];
                "string" == typeof b && (l.defQueueMap[b] = !0), G.push(a);
            }), V = []);
        }
        function C(a) {
            delete t[a], delete Z[a];
        }
        function J(a, b, c) {
            var h = a.map.id;
            a.error ? a.emit("error", a.error) : (b[h] = !0, y(a.depMaps, function(h, f) {
                var d = h.id, g = e(t, d);
                !g || a.depMatched[f] || c[d] || (e(b, d) ? (a.defineDep(f, v[d]), a.check()) : J(g, b, c));
            }), c[h] = !0);
        }
        function H() {
            var a, b, c = (a = 1e3 * p.waitSeconds) && l.startTime + a < new Date().getTime(), h = [], k = [], f = !1, g = !0;
            if (!aa) {
                if (aa = !0, D(Z, function(a) {
                    var l = a.map, e = l.id;
                    if (a.enabled && (l.isDefine || k.push(a), !a.error)) if (!a.inited && c) m(e) ? f = b = !0 : (h.push(e), 
                    d(e)); else if (!a.inited && a.fetched && l.isDefine && (f = !0, !l.prefix)) return g = !1;
                }), c && h.length) return a = F("timeout", "Load timeout for modules: " + h, null, h), 
                a.contextName = l.contextName, A(a);
                g && y(k, function(a) {
                    J(a, {}, {});
                }), c && !b || !f || !E && !ja || ba || (ba = setTimeout(function() {
                    ba = 0, H();
                }, 50)), aa = !1;
            }
        }
        function I(a) {
            x(v, a[0]) || u(q(a[0], null, !0)).init(a[1], a[2]);
        }
        function O(a) {
            a = a.currentTarget || a.srcElement;
            var b = l.onScriptLoad;
            return a.detachEvent && !ca ? a.detachEvent("onreadystatechange", b) : a.removeEventListener("load", b, !1), 
            b = l.onScriptError, a.detachEvent && !ca || a.removeEventListener("error", b, !1), 
            {
                node: a,
                id: a && a.getAttribute("data-requiremodule")
            };
        }
        function P() {
            var a;
            for (B(); G.length; ) {
                if (a = G.shift(), null === a[0]) return A(F("mismatch", "Mismatched anonymous define() module: " + a[a.length - 1]));
                I(a);
            }
            l.defQueueMap = {};
        }
        var aa, da, l, R, ba, p = {
            waitSeconds: 7,
            baseUrl: "./",
            paths: {},
            bundles: {},
            pkgs: {},
            shim: {},
            config: {}
        }, t = {}, Z = {}, ea = {}, G = [], v = {}, W = {}, fa = {}, Q = 1, T = 1;
        return R = {
            require: function(a) {
                return a.require ? a.require : a.require = l.makeRequire(a.map);
            },
            exports: function(a) {
                return a.usingExports = !0, a.map.isDefine ? a.exports ? v[a.map.id] = a.exports : a.exports = v[a.map.id] = {} : void 0;
            },
            module: function(a) {
                return a.module ? a.module : a.module = {
                    id: a.map.id,
                    uri: a.map.url,
                    config: function() {
                        return e(p.config, a.map.id) || {};
                    },
                    exports: a.exports || (a.exports = {})
                };
            }
        }, da = function(a) {
            this.events = e(ea, a.id) || {}, this.map = a, this.shim = e(p.shim, a.id), this.depExports = [], 
            this.depMaps = [], this.depMatched = [], this.pluginMaps = {}, this.depCount = 0;
        }, da.prototype = {
            init: function(a, b, c, h) {
                h = h || {}, this.inited || (this.factory = b, c ? this.on("error", c) : this.events.error && (c = z(this, function(a) {
                    this.emit("error", a);
                })), this.depMaps = a && a.slice(0), this.errback = c, this.inited = !0, this.ignore = h.ignore, 
                h.enabled || this.enabled ? this.enable() : this.check());
            },
            defineDep: function(a, b) {
                this.depMatched[a] || (this.depMatched[a] = !0, --this.depCount, this.depExports[a] = b);
            },
            fetch: function() {
                if (!this.fetched) {
                    this.fetched = !0, l.startTime = new Date().getTime();
                    var a = this.map;
                    if (!this.shim) return a.prefix ? this.callPlugin() : this.load();
                    l.makeRequire(this.map, {
                        enableBuildCallback: !0
                    })(this.shim.deps || [], z(this, function() {
                        return a.prefix ? this.callPlugin() : this.load();
                    }));
                }
            },
            load: function() {
                var a = this.map.url;
                W[a] || (W[a] = !0, l.load(this.map.id, a));
            },
            check: function() {
                if (this.enabled && !this.enabling) {
                    var a, b, c = this.map.id;
                    b = this.depExports;
                    var h = this.exports, k = this.factory;
                    if (this.inited) {
                        if (this.error) this.emit("error", this.error); else if (!this.defining) {
                            if (this.defining = !0, 1 > this.depCount && !this.defined) {
                                if (K(k)) {
                                    if (this.events.error && this.map.isDefine || g.onError !== ha) try {
                                        h = l.execCb(c, k, b, h);
                                    } catch (d) {
                                        a = d;
                                    } else h = l.execCb(c, k, b, h);
                                    if (this.map.isDefine && void 0 === h && ((b = this.module) ? h = b.exports : this.usingExports && (h = this.exports)), 
                                    a) return a.requireMap = this.map, a.requireModules = this.map.isDefine ? [ this.map.id ] : null, 
                                    a.requireType = this.map.isDefine ? "define" : "require", A(this.error = a);
                                } else h = k;
                                if (this.exports = h, this.map.isDefine && !this.ignore && (v[c] = h, g.onResourceLoad)) {
                                    var f = [];
                                    y(this.depMaps, function(a) {
                                        f.push(a.normalizedMap || a);
                                    }), g.onResourceLoad(l, this.map, f);
                                }
                                C(c), this.defined = !0;
                            }
                            this.defining = !1, this.defined && !this.defineEmitted && (this.defineEmitted = !0, 
                            this.emit("defined", this.exports), this.defineEmitComplete = !0);
                        }
                    } else x(l.defQueueMap, c) || this.fetch();
                }
            },
            callPlugin: function() {
                var a = this.map, b = a.id, d = q(a.prefix);
                this.depMaps.push(d), w(d, "defined", z(this, function(h) {
                    var k, f, d = e(fa, this.map.id), M = this.map.name, r = this.map.parentMap ? this.map.parentMap.name : null, m = l.makeRequire(a.parentMap, {
                        enableBuildCallback: !0
                    });
                    this.map.unnormalized ? (h.normalize && (M = h.normalize(M, function(a) {
                        return c(a, r, !0);
                    }) || ""), f = q(a.prefix + "!" + M, this.map.parentMap), w(f, "defined", z(this, function(a) {
                        this.map.normalizedMap = f, this.init([], function() {
                            return a;
                        }, null, {
                            enabled: !0,
                            ignore: !0
                        });
                    })), (h = e(t, f.id)) && (this.depMaps.push(f), this.events.error && h.on("error", z(this, function(a) {
                        this.emit("error", a);
                    })), h.enable())) : d ? (this.map.url = l.nameToUrl(d), this.load()) : (k = z(this, function(a) {
                        this.init([], function() {
                            return a;
                        }, null, {
                            enabled: !0
                        });
                    }), k.error = z(this, function(a) {
                        this.inited = !0, this.error = a, a.requireModules = [ b ], D(t, function(a) {
                            0 === a.map.id.indexOf(b + "_unnormalized") && C(a.map.id);
                        }), A(a);
                    }), k.fromText = z(this, function(h, c) {
                        var d = a.name, f = q(d), M = S;
                        c && (h = c), M && (S = !1), u(f), x(p.config, b) && (p.config[d] = p.config[b]);
                        try {
                            g.exec(h);
                        } catch (e) {
                            return A(F("fromtexteval", "fromText eval for " + b + " failed: " + e, e, [ b ]));
                        }
                        M && (S = !0), this.depMaps.push(f), l.completeLoad(d), m([ d ], k);
                    }), h.load(a.name, m, k, p));
                })), l.enable(d, this), this.pluginMaps[d.id] = d;
            },
            enable: function() {
                Z[this.map.id] = this, this.enabling = this.enabled = !0, y(this.depMaps, z(this, function(a, b) {
                    var c, h;
                    if ("string" == typeof a) {
                        if (a = q(a, this.map.isDefine ? this.map : this.map.parentMap, !1, !this.skipMap), 
                        this.depMaps[b] = a, c = e(R, a.id)) return void (this.depExports[b] = c(this));
                        this.depCount += 1, w(a, "defined", z(this, function(a) {
                            this.undefed || (this.defineDep(b, a), this.check());
                        })), this.errback ? w(a, "error", z(this, this.errback)) : this.events.error && w(a, "error", z(this, function(a) {
                            this.emit("error", a);
                        }));
                    }
                    c = a.id, h = t[c], x(R, c) || !h || h.enabled || l.enable(a, this);
                })), D(this.pluginMaps, z(this, function(a) {
                    var b = e(t, a.id);
                    b && !b.enabled && l.enable(a, this);
                })), this.enabling = !1, this.check();
            },
            on: function(a, b) {
                var c = this.events[a];
                c || (c = this.events[a] = []), c.push(b);
            },
            emit: function(a, b) {
                y(this.events[a], function(a) {
                    a(b);
                }), "error" === a && delete this.events[a];
            }
        }, l = {
            config: p,
            contextName: b,
            registry: t,
            defined: v,
            urlFetched: W,
            defQueue: G,
            defQueueMap: {},
            Module: da,
            makeModuleMap: q,
            nextTick: g.nextTick,
            onError: A,
            configure: function(a) {
                if (a.baseUrl && "/" !== a.baseUrl.charAt(a.baseUrl.length - 1) && (a.baseUrl += "/"), 
                "string" == typeof a.urlArgs) {
                    var b = a.urlArgs;
                    a.urlArgs = function(a, c) {
                        return (-1 === c.indexOf("?") ? "?" : "&") + b;
                    };
                }
                var c = p.shim, h = {
                    paths: !0,
                    bundles: !0,
                    config: !0,
                    map: !0
                };
                D(a, function(a, b) {
                    h[b] ? (p[b] || (p[b] = {}), Y(p[b], a, !0, !0)) : p[b] = a;
                }), a.bundles && D(a.bundles, function(a, b) {
                    y(a, function(a) {
                        a !== b && (fa[a] = b);
                    });
                }), a.shim && (D(a.shim, function(a, b) {
                    L(a) && (a = {
                        deps: a
                    }), !a.exports && !a.init || a.exportsFn || (a.exportsFn = l.makeShimExports(a)), 
                    c[b] = a;
                }), p.shim = c), a.packages && y(a.packages, function(a) {
                    var b;
                    a = "string" == typeof a ? {
                        name: a
                    } : a, b = a.name, a.location && (p.paths[b] = a.location), p.pkgs[b] = a.name + "/" + (a.main || "main").replace(na, "").replace(U, "");
                }), D(t, function(a, b) {
                    a.inited || a.map.unnormalized || (a.map = q(b, null, !0));
                }), (a.deps || a.callback) && l.require(a.deps || [], a.callback);
            },
            makeShimExports: function(a) {
                return function() {
                    var b;
                    return a.init && (b = a.init.apply(ga, arguments)), b || a.exports && ia(a.exports);
                };
            },
            makeRequire: function(a, n) {
                function m(c, d, f) {
                    var e, r;
                    return n.enableBuildCallback && d && K(d) && (d.__requireJsBuild = !0), "string" == typeof c ? K(d) ? A(F("requireargs", "Invalid require call"), f) : a && x(R, c) ? R[c](t[a.id]) : g.get ? g.get(l, c, a, m) : (e = q(c, a, !1, !0), 
                    e = e.id, x(v, e) ? v[e] : A(F("notloaded", 'Module name "' + e + '" has not been loaded yet for context: ' + b + (a ? "" : ". Use require([])")))) : (P(), 
                    l.nextTick(function() {
                        P(), r = u(q(null, a)), r.skipMap = n.skipMap, r.init(c, d, f, {
                            enabled: !0
                        }), H();
                    }), m);
                }
                return n = n || {}, Y(m, {
                    isBrowser: E,
                    toUrl: function(b) {
                        var d, f = b.lastIndexOf("."), g = b.split("/")[0];
                        return -1 !== f && ("." !== g && ".." !== g || f > 1) && (d = b.substring(f, b.length), 
                        b = b.substring(0, f)), l.nameToUrl(c(b, a && a.id, !0), d, !0);
                    },
                    defined: function(b) {
                        return x(v, q(b, a, !1, !0).id);
                    },
                    specified: function(b) {
                        return b = q(b, a, !1, !0).id, x(v, b) || x(t, b);
                    }
                }), a || (m.undef = function(b) {
                    B();
                    var c = q(b, a, !0), f = e(t, b);
                    f.undefed = !0, d(b), delete v[b], delete W[c.url], delete ea[b], X(G, function(a, c) {
                        a[0] === b && G.splice(c, 1);
                    }), delete l.defQueueMap[b], f && (f.events.defined && (ea[b] = f.events), C(b));
                }), m;
            },
            enable: function(a) {
                e(t, a.id) && u(a).enable();
            },
            completeLoad: function(a) {
                var b, c, d = e(p.shim, a) || {}, g = d.exports;
                for (B(); G.length; ) {
                    if (c = G.shift(), null === c[0]) {
                        if (c[0] = a, b) break;
                        b = !0;
                    } else c[0] === a && (b = !0);
                    I(c);
                }
                if (l.defQueueMap = {}, c = e(t, a), !b && !x(v, a) && c && !c.inited) {
                    if (!(!p.enforceDefine || g && ia(g))) return m(a) ? void 0 : A(F("nodefine", "No define call for " + a, null, [ a ]));
                    I([ a, d.deps || [], d.exportsFn ]);
                }
                H();
            },
            nameToUrl: function(a, b, c) {
                var d, k, f, m;
                if ((d = e(p.pkgs, a)) && (a = d), d = e(fa, a)) return l.nameToUrl(d, b, c);
                if (g.jsExtRegExp.test(a)) d = a + (b || ""); else {
                    for (d = p.paths, k = a.split("/"), f = k.length; f > 0; --f) if (m = k.slice(0, f).join("/"), 
                    m = e(d, m)) {
                        L(m) && (m = m[0]), k.splice(0, f, m);
                        break;
                    }
                    d = k.join("/"), d += b || (/^data\:|^blob\:|\?/.test(d) || c ? "" : ".js"), d = ("/" === d.charAt(0) || d.match(/^[\w\+\.\-]+:/) ? "" : p.baseUrl) + d;
                }
                return p.urlArgs && !/^blob\:/.test(d) ? d + p.urlArgs(a, d) : d;
            },
            load: function(a, b) {
                g.load(l, a, b);
            },
            execCb: function(a, b, c, d) {
                return b.apply(d, c);
            },
            onScriptLoad: function(a) {
                ("load" === a.type || oa.test((a.currentTarget || a.srcElement).readyState)) && (N = null, 
                a = O(a), l.completeLoad(a.id));
            },
            onScriptError: function(a) {
                var b = O(a);
                if (!m(b.id)) {
                    var c = [];
                    return D(t, function(a, d) {
                        0 !== d.indexOf("_@r") && y(a.depMaps, function(a) {
                            return a.id === b.id ? (c.push(d), !0) : void 0;
                        });
                    }), A(F("scripterror", 'Script error for "' + b.id + (c.length ? '", needed by: ' + c.join(", ") : '"'), a, [ b.id ]));
                }
            }
        }, l.require = l.makeRequire(), l;
    }
    function pa() {
        return N && "interactive" === N.readyState ? N : (X(document.getElementsByTagName("script"), function(b) {
            return "interactive" === b.readyState ? N = b : void 0;
        }), N);
    }
    var g, B, C, H, O, I, N, P, u, T, qa = /(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm, ra = /[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g, U = /\.js$/, na = /^\.\//;
    B = Object.prototype;
    var Q = B.toString, la = B.hasOwnProperty, E = !("undefined" == typeof window || "undefined" == typeof navigator || !window.document), ja = !E && "undefined" != typeof importScripts, oa = E && "PLAYSTATION 3" === navigator.platform ? /^complete$/ : /^(complete|loaded)$/, ca = "undefined" != typeof opera && "[object Opera]" === opera.toString(), J = {}, w = {}, V = [], S = !1;
    if ("undefined" == typeof define) {
        if ("undefined" != typeof requirejs) {
            if (K(requirejs)) return;
            w = requirejs, requirejs = void 0;
        }
        "undefined" == typeof require || K(require) || (w = require, require = void 0), 
        g = requirejs = function(b, c, d, m) {
            var r, q = "_";
            return L(b) || "string" == typeof b || (r = b, L(c) ? (b = c, c = d, d = m) : b = []), 
            r && r.context && (q = r.context), (m = e(J, q)) || (m = J[q] = g.s.newContext(q)), 
            r && m.configure(r), m.require(b, c, d);
        }, g.config = function(b) {
            return g(b);
        }, g.nextTick = "undefined" != typeof setTimeout ? function(b) {
            setTimeout(b, 4);
        } : function(b) {
            b();
        }, require || (require = g), g.version = "2.2.0", g.jsExtRegExp = /^\/|:|\?|\.js$/, 
        g.isBrowser = E, B = g.s = {
            contexts: J,
            newContext: ma
        }, g({}), y([ "toUrl", "undef", "defined", "specified" ], function(b) {
            g[b] = function() {
                var c = J._;
                return c.require[b].apply(c, arguments);
            };
        }), E && (C = B.head = document.getElementsByTagName("head")[0], H = document.getElementsByTagName("base")[0]) && (C = B.head = H.parentNode), 
        g.onError = ha, g.createNode = function(b, c, d) {
            return c = b.xhtml ? document.createElementNS("http://www.w3.org/1999/xhtml", "html:script") : document.createElement("script"), 
            c.type = b.scriptType || "text/javascript", c.charset = "utf-8", c.async = !0, c;
        }, g.load = function(b, c, d) {
            var e, m = b && b.config || {};
            if (E) return e = g.createNode(m, c, d), e.setAttribute("data-requirecontext", b.contextName), 
            e.setAttribute("data-requiremodule", c), !e.attachEvent || e.attachEvent.toString && 0 > e.attachEvent.toString().indexOf("[native code") || ca ? (e.addEventListener("load", b.onScriptLoad, !1), 
            e.addEventListener("error", b.onScriptError, !1)) : (S = !0, e.attachEvent("onreadystatechange", b.onScriptLoad)), 
            e.src = d, m.onNodeCreated && m.onNodeCreated(e, m, c, d), P = e, H ? C.insertBefore(e, H) : C.appendChild(e), 
            P = null, e;
            if (ja) try {
                setTimeout(function() {}, 0), importScripts(d), b.completeLoad(c);
            } catch (q) {
                b.onError(F("importscripts", "importScripts failed for " + c + " at " + d, q, [ c ]));
            }
        }, E && !w.skipDataMain && X(document.getElementsByTagName("script"), function(b) {
            return C || (C = b.parentNode), (O = b.getAttribute("data-main")) ? (u = O, w.baseUrl || -1 !== u.indexOf("!") || (I = u.split("/"), 
            u = I.pop(), T = I.length ? I.join("/") + "/" : "./", w.baseUrl = T), u = u.replace(U, ""), 
            g.jsExtRegExp.test(u) && (u = O), w.deps = w.deps ? w.deps.concat(u) : [ u ], !0) : void 0;
        }), define = function(b, c, d) {
            var e, g;
            "string" != typeof b && (d = c, c = b, b = null), L(c) || (d = c, c = null), !c && K(d) && (c = [], 
            d.length && (d.toString().replace(qa, ka).replace(ra, function(b, d) {
                c.push(d);
            }), c = (1 === d.length ? [ "require" ] : [ "require", "exports", "module" ]).concat(c))), 
            S && (e = P || pa()) && (b || (b = e.getAttribute("data-requiremodule")), g = J[e.getAttribute("data-requirecontext")]), 
            g ? (g.defQueue.push([ b, c, d ]), g.defQueueMap[b] = !0) : V.push([ b, c, d ]);
        }, define.amd = {
            jQuery: !0
        }, g.exec = function(b) {
            return eval(b);
        }, g(w);
    }
}(this), define("text", [ "module" ], function(module) {
    "use strict";
    var text, fs, Cc, Ci, xpcIsWindows, progIds = [ "Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml2.XMLHTTP.4.0" ], xmlRegExp = /^\s*<\?xml(\s)+version=[\'\"](\d)*.(\d)*[\'\"](\s)*\?>/im, bodyRegExp = /<body[^>]*>\s*([\s\S]+)\s*<\/body>/im, hasLocation = "undefined" != typeof location && location.href, defaultProtocol = hasLocation && location.protocol && location.protocol.replace(/\:/, ""), defaultHostName = hasLocation && location.hostname, defaultPort = hasLocation && (location.port || void 0), buildMap = {}, masterConfig = module.config && module.config() || {};
    return text = {
        version: "2.0.14",
        strip: function(content) {
            if (content) {
                content = content.replace(xmlRegExp, "");
                var matches = content.match(bodyRegExp);
                matches && (content = matches[1]);
            } else content = "";
            return content;
        },
        jsEscape: function(content) {
            return content.replace(/(['\\])/g, "\\$1").replace(/[\f]/g, "\\f").replace(/[\b]/g, "\\b").replace(/[\n]/g, "\\n").replace(/[\t]/g, "\\t").replace(/[\r]/g, "\\r").replace(/[\u2028]/g, "\\u2028").replace(/[\u2029]/g, "\\u2029");
        },
        createXhr: masterConfig.createXhr || function() {
            var xhr, i, progId;
            if ("undefined" != typeof XMLHttpRequest) return new XMLHttpRequest();
            if ("undefined" != typeof ActiveXObject) for (i = 0; 3 > i; i += 1) {
                progId = progIds[i];
                try {
                    xhr = new ActiveXObject(progId);
                } catch (e) {}
                if (xhr) {
                    progIds = [ progId ];
                    break;
                }
            }
            return xhr;
        },
        parseName: function(name) {
            var modName, ext, temp, strip = !1, index = name.lastIndexOf("."), isRelative = 0 === name.indexOf("./") || 0 === name.indexOf("../");
            return -1 !== index && (!isRelative || index > 1) ? (modName = name.substring(0, index), 
            ext = name.substring(index + 1)) : modName = name, temp = ext || modName, index = temp.indexOf("!"), 
            -1 !== index && (strip = "strip" === temp.substring(index + 1), temp = temp.substring(0, index), 
            ext ? ext = temp : modName = temp), {
                moduleName: modName,
                ext: ext,
                strip: strip
            };
        },
        xdRegExp: /^((\w+)\:)?\/\/([^\/\\]+)/,
        useXhr: function(url, protocol, hostname, port) {
            var uProtocol, uHostName, uPort, match = text.xdRegExp.exec(url);
            return match ? (uProtocol = match[2], uHostName = match[3], uHostName = uHostName.split(":"), 
            uPort = uHostName[1], uHostName = uHostName[0], !(uProtocol && uProtocol !== protocol || uHostName && uHostName.toLowerCase() !== hostname.toLowerCase() || (uPort || uHostName) && uPort !== port)) : !0;
        },
        finishLoad: function(name, strip, content, onLoad) {
            content = strip ? text.strip(content) : content, masterConfig.isBuild && (buildMap[name] = content), 
            onLoad(content);
        },
        load: function(name, req, onLoad, config) {
            if (config && config.isBuild && !config.inlineText) return void onLoad();
            masterConfig.isBuild = config && config.isBuild;
            var parsed = text.parseName(name), nonStripName = parsed.moduleName + (parsed.ext ? "." + parsed.ext : ""), url = req.toUrl(nonStripName), useXhr = masterConfig.useXhr || text.useXhr;
            return 0 === url.indexOf("empty:") ? void onLoad() : void (!hasLocation || useXhr(url, defaultProtocol, defaultHostName, defaultPort) ? text.get(url, function(content) {
                text.finishLoad(name, parsed.strip, content, onLoad);
            }, function(err) {
                onLoad.error && onLoad.error(err);
            }) : req([ nonStripName ], function(content) {
                text.finishLoad(parsed.moduleName + "." + parsed.ext, parsed.strip, content, onLoad);
            }));
        },
        write: function(pluginName, moduleName, write, config) {
            if (buildMap.hasOwnProperty(moduleName)) {
                var content = text.jsEscape(buildMap[moduleName]);
                write.asModule(pluginName + "!" + moduleName, "define(function () { return '" + content + "';});\n");
            }
        },
        writeFile: function(pluginName, moduleName, req, write, config) {
            var parsed = text.parseName(moduleName), extPart = parsed.ext ? "." + parsed.ext : "", nonStripName = parsed.moduleName + extPart, fileName = req.toUrl(parsed.moduleName + extPart) + ".js";
            text.load(nonStripName, req, function(value) {
                var textWrite = function(contents) {
                    return write(fileName, contents);
                };
                textWrite.asModule = function(moduleName, contents) {
                    return write.asModule(moduleName, fileName, contents);
                }, text.write(pluginName, nonStripName, textWrite, config);
            }, config);
        }
    }, "node" === masterConfig.env || !masterConfig.env && "undefined" != typeof process && process.versions && process.versions.node && !process.versions["node-webkit"] && !process.versions["atom-shell"] ? (fs = require.nodeRequire("fs"), 
    text.get = function(url, callback, errback) {
        try {
            var file = fs.readFileSync(url, "utf8");
            "\ufeff" === file[0] && (file = file.substring(1)), callback(file);
        } catch (e) {
            errback && errback(e);
        }
    }) : "xhr" === masterConfig.env || !masterConfig.env && text.createXhr() ? text.get = function(url, callback, errback, headers) {
        var header, xhr = text.createXhr();
        if (xhr.open("GET", url, !0), headers) for (header in headers) headers.hasOwnProperty(header) && xhr.setRequestHeader(header.toLowerCase(), headers[header]);
        masterConfig.onXhr && masterConfig.onXhr(xhr, url), xhr.onreadystatechange = function(evt) {
            var status, err;
            4 === xhr.readyState && (status = xhr.status || 0, status > 399 && 600 > status ? (err = new Error(url + " HTTP status: " + status), 
            err.xhr = xhr, errback && errback(err)) : callback(xhr.responseText), masterConfig.onXhrComplete && masterConfig.onXhrComplete(xhr, url));
        }, xhr.send(null);
    } : "rhino" === masterConfig.env || !masterConfig.env && "undefined" != typeof Packages && "undefined" != typeof java ? text.get = function(url, callback) {
        var stringBuffer, line, encoding = "utf-8", file = new java.io.File(url), lineSeparator = java.lang.System.getProperty("line.separator"), input = new java.io.BufferedReader(new java.io.InputStreamReader(new java.io.FileInputStream(file), encoding)), content = "";
        try {
            for (stringBuffer = new java.lang.StringBuffer(), line = input.readLine(), line && line.length() && 65279 === line.charAt(0) && (line = line.substring(1)), 
            null !== line && stringBuffer.append(line); null !== (line = input.readLine()); ) stringBuffer.append(lineSeparator), 
            stringBuffer.append(line);
            content = String(stringBuffer.toString());
        } finally {
            input.close();
        }
        callback(content);
    } : ("xpconnect" === masterConfig.env || !masterConfig.env && "undefined" != typeof Components && Components.classes && Components.interfaces) && (Cc = Components.classes, 
    Ci = Components.interfaces, Components.utils["import"]("resource://gre/modules/FileUtils.jsm"), 
    xpcIsWindows = "@mozilla.org/windows-registry-key;1" in Cc, text.get = function(url, callback) {
        var inStream, convertStream, fileObj, readData = {};
        xpcIsWindows && (url = url.replace(/\//g, "\\")), fileObj = new FileUtils.File(url);
        try {
            inStream = Cc["@mozilla.org/network/file-input-stream;1"].createInstance(Ci.nsIFileInputStream), 
            inStream.init(fileObj, 1, 0, !1), convertStream = Cc["@mozilla.org/intl/converter-input-stream;1"].createInstance(Ci.nsIConverterInputStream), 
            convertStream.init(inStream, "utf-8", inStream.available(), Ci.nsIConverterInputStream.DEFAULT_REPLACEMENT_CHARACTER), 
            convertStream.readString(inStream.available(), readData), convertStream.close(), 
            inStream.close(), callback(readData.value);
        } catch (e) {
            throw new Error((fileObj && fileObj.path || "") + ": " + e);
        }
    }), text;
}), function(define, undefined) {
    define(function() {
        "use strict";
        function equalIC(a, b) {
            return null != a && null != b && a.toLowerCase() === b.toLowerCase();
        }
        function containsIC(array, value) {
            var valueLC, i, len = array.length;
            if (!len || !value) return !1;
            for (valueLC = value.toLowerCase(), i = 0; len > i; ++i) if (valueLC === array[i].toLowerCase()) return !0;
            return !1;
        }
        function convertPropsToRegExp(object) {
            for (var key in object) hasOwnProp.call(object, key) && (object[key] = new RegExp(object[key], "i"));
        }
        function MobileDetect(userAgent, maxPhoneWidth) {
            this.ua = userAgent || "", this._cache = {}, this.maxPhoneWidth = maxPhoneWidth || 600;
        }
        var impl = {};
        impl.mobileDetectRules = {
            phones: {
                iPhone: "\\biPhone\\b|\\biPod\\b",
                BlackBerry: "BlackBerry|\\bBB10\\b|rim[0-9]+",
                HTC: "HTC|HTC.*(Sensation|Evo|Vision|Explorer|6800|8100|8900|A7272|S510e|C110e|Legend|Desire|T8282)|APX515CKT|Qtek9090|APA9292KT|HD_mini|Sensation.*Z710e|PG86100|Z715e|Desire.*(A8181|HD)|ADR6200|ADR6400L|ADR6425|001HT|Inspire 4G|Android.*\\bEVO\\b|T-Mobile G1|Z520m",
                Nexus: "Nexus One|Nexus S|Galaxy.*Nexus|Android.*Nexus.*Mobile|Nexus 4|Nexus 5|Nexus 6",
                Dell: "Dell.*Streak|Dell.*Aero|Dell.*Venue|DELL.*Venue Pro|Dell Flash|Dell Smoke|Dell Mini 3iX|XCD28|XCD35|\\b001DL\\b|\\b101DL\\b|\\bGS01\\b",
                Motorola: "Motorola|DROIDX|DROID BIONIC|\\bDroid\\b.*Build|Android.*Xoom|HRI39|MOT-|A1260|A1680|A555|A853|A855|A953|A955|A956|Motorola.*ELECTRIFY|Motorola.*i1|i867|i940|MB200|MB300|MB501|MB502|MB508|MB511|MB520|MB525|MB526|MB611|MB612|MB632|MB810|MB855|MB860|MB861|MB865|MB870|ME501|ME502|ME511|ME525|ME600|ME632|ME722|ME811|ME860|ME863|ME865|MT620|MT710|MT716|MT720|MT810|MT870|MT917|Motorola.*TITANIUM|WX435|WX445|XT300|XT301|XT311|XT316|XT317|XT319|XT320|XT390|XT502|XT530|XT531|XT532|XT535|XT603|XT610|XT611|XT615|XT681|XT701|XT702|XT711|XT720|XT800|XT806|XT860|XT862|XT875|XT882|XT883|XT894|XT901|XT907|XT909|XT910|XT912|XT928|XT926|XT915|XT919|XT925|XT1021|\\bMoto E\\b",
                Samsung: "Samsung|SM-G9250|GT-19300|SGH-I337|BGT-S5230|GT-B2100|GT-B2700|GT-B2710|GT-B3210|GT-B3310|GT-B3410|GT-B3730|GT-B3740|GT-B5510|GT-B5512|GT-B5722|GT-B6520|GT-B7300|GT-B7320|GT-B7330|GT-B7350|GT-B7510|GT-B7722|GT-B7800|GT-C3010|GT-C3011|GT-C3060|GT-C3200|GT-C3212|GT-C3212I|GT-C3262|GT-C3222|GT-C3300|GT-C3300K|GT-C3303|GT-C3303K|GT-C3310|GT-C3322|GT-C3330|GT-C3350|GT-C3500|GT-C3510|GT-C3530|GT-C3630|GT-C3780|GT-C5010|GT-C5212|GT-C6620|GT-C6625|GT-C6712|GT-E1050|GT-E1070|GT-E1075|GT-E1080|GT-E1081|GT-E1085|GT-E1087|GT-E1100|GT-E1107|GT-E1110|GT-E1120|GT-E1125|GT-E1130|GT-E1160|GT-E1170|GT-E1175|GT-E1180|GT-E1182|GT-E1200|GT-E1210|GT-E1225|GT-E1230|GT-E1390|GT-E2100|GT-E2120|GT-E2121|GT-E2152|GT-E2220|GT-E2222|GT-E2230|GT-E2232|GT-E2250|GT-E2370|GT-E2550|GT-E2652|GT-E3210|GT-E3213|GT-I5500|GT-I5503|GT-I5700|GT-I5800|GT-I5801|GT-I6410|GT-I6420|GT-I7110|GT-I7410|GT-I7500|GT-I8000|GT-I8150|GT-I8160|GT-I8190|GT-I8320|GT-I8330|GT-I8350|GT-I8530|GT-I8700|GT-I8703|GT-I8910|GT-I9000|GT-I9001|GT-I9003|GT-I9010|GT-I9020|GT-I9023|GT-I9070|GT-I9082|GT-I9100|GT-I9103|GT-I9220|GT-I9250|GT-I9300|GT-I9305|GT-I9500|GT-I9505|GT-M3510|GT-M5650|GT-M7500|GT-M7600|GT-M7603|GT-M8800|GT-M8910|GT-N7000|GT-S3110|GT-S3310|GT-S3350|GT-S3353|GT-S3370|GT-S3650|GT-S3653|GT-S3770|GT-S3850|GT-S5210|GT-S5220|GT-S5229|GT-S5230|GT-S5233|GT-S5250|GT-S5253|GT-S5260|GT-S5263|GT-S5270|GT-S5300|GT-S5330|GT-S5350|GT-S5360|GT-S5363|GT-S5369|GT-S5380|GT-S5380D|GT-S5560|GT-S5570|GT-S5600|GT-S5603|GT-S5610|GT-S5620|GT-S5660|GT-S5670|GT-S5690|GT-S5750|GT-S5780|GT-S5830|GT-S5839|GT-S6102|GT-S6500|GT-S7070|GT-S7200|GT-S7220|GT-S7230|GT-S7233|GT-S7250|GT-S7500|GT-S7530|GT-S7550|GT-S7562|GT-S7710|GT-S8000|GT-S8003|GT-S8500|GT-S8530|GT-S8600|SCH-A310|SCH-A530|SCH-A570|SCH-A610|SCH-A630|SCH-A650|SCH-A790|SCH-A795|SCH-A850|SCH-A870|SCH-A890|SCH-A930|SCH-A950|SCH-A970|SCH-A990|SCH-I100|SCH-I110|SCH-I400|SCH-I405|SCH-I500|SCH-I510|SCH-I515|SCH-I600|SCH-I730|SCH-I760|SCH-I770|SCH-I830|SCH-I910|SCH-I920|SCH-I959|SCH-LC11|SCH-N150|SCH-N300|SCH-R100|SCH-R300|SCH-R351|SCH-R400|SCH-R410|SCH-T300|SCH-U310|SCH-U320|SCH-U350|SCH-U360|SCH-U365|SCH-U370|SCH-U380|SCH-U410|SCH-U430|SCH-U450|SCH-U460|SCH-U470|SCH-U490|SCH-U540|SCH-U550|SCH-U620|SCH-U640|SCH-U650|SCH-U660|SCH-U700|SCH-U740|SCH-U750|SCH-U810|SCH-U820|SCH-U900|SCH-U940|SCH-U960|SCS-26UC|SGH-A107|SGH-A117|SGH-A127|SGH-A137|SGH-A157|SGH-A167|SGH-A177|SGH-A187|SGH-A197|SGH-A227|SGH-A237|SGH-A257|SGH-A437|SGH-A517|SGH-A597|SGH-A637|SGH-A657|SGH-A667|SGH-A687|SGH-A697|SGH-A707|SGH-A717|SGH-A727|SGH-A737|SGH-A747|SGH-A767|SGH-A777|SGH-A797|SGH-A817|SGH-A827|SGH-A837|SGH-A847|SGH-A867|SGH-A877|SGH-A887|SGH-A897|SGH-A927|SGH-B100|SGH-B130|SGH-B200|SGH-B220|SGH-C100|SGH-C110|SGH-C120|SGH-C130|SGH-C140|SGH-C160|SGH-C170|SGH-C180|SGH-C200|SGH-C207|SGH-C210|SGH-C225|SGH-C230|SGH-C417|SGH-C450|SGH-D307|SGH-D347|SGH-D357|SGH-D407|SGH-D415|SGH-D780|SGH-D807|SGH-D980|SGH-E105|SGH-E200|SGH-E315|SGH-E316|SGH-E317|SGH-E335|SGH-E590|SGH-E635|SGH-E715|SGH-E890|SGH-F300|SGH-F480|SGH-I200|SGH-I300|SGH-I320|SGH-I550|SGH-I577|SGH-I600|SGH-I607|SGH-I617|SGH-I627|SGH-I637|SGH-I677|SGH-I700|SGH-I717|SGH-I727|SGH-i747M|SGH-I777|SGH-I780|SGH-I827|SGH-I847|SGH-I857|SGH-I896|SGH-I897|SGH-I900|SGH-I907|SGH-I917|SGH-I927|SGH-I937|SGH-I997|SGH-J150|SGH-J200|SGH-L170|SGH-L700|SGH-M110|SGH-M150|SGH-M200|SGH-N105|SGH-N500|SGH-N600|SGH-N620|SGH-N625|SGH-N700|SGH-N710|SGH-P107|SGH-P207|SGH-P300|SGH-P310|SGH-P520|SGH-P735|SGH-P777|SGH-Q105|SGH-R210|SGH-R220|SGH-R225|SGH-S105|SGH-S307|SGH-T109|SGH-T119|SGH-T139|SGH-T209|SGH-T219|SGH-T229|SGH-T239|SGH-T249|SGH-T259|SGH-T309|SGH-T319|SGH-T329|SGH-T339|SGH-T349|SGH-T359|SGH-T369|SGH-T379|SGH-T409|SGH-T429|SGH-T439|SGH-T459|SGH-T469|SGH-T479|SGH-T499|SGH-T509|SGH-T519|SGH-T539|SGH-T559|SGH-T589|SGH-T609|SGH-T619|SGH-T629|SGH-T639|SGH-T659|SGH-T669|SGH-T679|SGH-T709|SGH-T719|SGH-T729|SGH-T739|SGH-T746|SGH-T749|SGH-T759|SGH-T769|SGH-T809|SGH-T819|SGH-T839|SGH-T919|SGH-T929|SGH-T939|SGH-T959|SGH-T989|SGH-U100|SGH-U200|SGH-U800|SGH-V205|SGH-V206|SGH-X100|SGH-X105|SGH-X120|SGH-X140|SGH-X426|SGH-X427|SGH-X475|SGH-X495|SGH-X497|SGH-X507|SGH-X600|SGH-X610|SGH-X620|SGH-X630|SGH-X700|SGH-X820|SGH-X890|SGH-Z130|SGH-Z150|SGH-Z170|SGH-ZX10|SGH-ZX20|SHW-M110|SPH-A120|SPH-A400|SPH-A420|SPH-A460|SPH-A500|SPH-A560|SPH-A600|SPH-A620|SPH-A660|SPH-A700|SPH-A740|SPH-A760|SPH-A790|SPH-A800|SPH-A820|SPH-A840|SPH-A880|SPH-A900|SPH-A940|SPH-A960|SPH-D600|SPH-D700|SPH-D710|SPH-D720|SPH-I300|SPH-I325|SPH-I330|SPH-I350|SPH-I500|SPH-I600|SPH-I700|SPH-L700|SPH-M100|SPH-M220|SPH-M240|SPH-M300|SPH-M305|SPH-M320|SPH-M330|SPH-M350|SPH-M360|SPH-M370|SPH-M380|SPH-M510|SPH-M540|SPH-M550|SPH-M560|SPH-M570|SPH-M580|SPH-M610|SPH-M620|SPH-M630|SPH-M800|SPH-M810|SPH-M850|SPH-M900|SPH-M910|SPH-M920|SPH-M930|SPH-N100|SPH-N200|SPH-N240|SPH-N300|SPH-N400|SPH-Z400|SWC-E100|SCH-i909|GT-N7100|GT-N7105|SCH-I535|SM-N900A|SGH-I317|SGH-T999L|GT-S5360B|GT-I8262|GT-S6802|GT-S6312|GT-S6310|GT-S5312|GT-S5310|GT-I9105|GT-I8510|GT-S6790N|SM-G7105|SM-N9005|GT-S5301|GT-I9295|GT-I9195|SM-C101|GT-S7392|GT-S7560|GT-B7610|GT-I5510|GT-S7582|GT-S7530E|GT-I8750|SM-G9006V|SM-G9008V|SM-G9009D|SM-G900A|SM-G900D|SM-G900F|SM-G900H|SM-G900I|SM-G900J|SM-G900K|SM-G900L|SM-G900M|SM-G900P|SM-G900R4|SM-G900S|SM-G900T|SM-G900V|SM-G900W8|SHV-E160K|SCH-P709|SCH-P729|SM-T2558|GT-I9205|SM-G9350",
                LG: "\\bLG\\b;|LG[- ]?(C800|C900|E400|E610|E900|E-900|F160|F180K|F180L|F180S|730|855|L160|LS740|LS840|LS970|LU6200|MS690|MS695|MS770|MS840|MS870|MS910|P500|P700|P705|VM696|AS680|AS695|AX840|C729|E970|GS505|272|C395|E739BK|E960|L55C|L75C|LS696|LS860|P769BK|P350|P500|P509|P870|UN272|US730|VS840|VS950|LN272|LN510|LS670|LS855|LW690|MN270|MN510|P509|P769|P930|UN200|UN270|UN510|UN610|US670|US740|US760|UX265|UX840|VN271|VN530|VS660|VS700|VS740|VS750|VS910|VS920|VS930|VX9200|VX11000|AX840A|LW770|P506|P925|P999|E612|D955|D802|MS323)",
                Sony: "SonyST|SonyLT|SonyEricsson|SonyEricssonLT15iv|LT18i|E10i|LT28h|LT26w|SonyEricssonMT27i|C5303|C6902|C6903|C6906|C6943|D2533",
                Asus: "Asus.*Galaxy|PadFone.*Mobile",
                Micromax: "Micromax.*\\b(A210|A92|A88|A72|A111|A110Q|A115|A116|A110|A90S|A26|A51|A35|A54|A25|A27|A89|A68|A65|A57|A90)\\b",
                Palm: "PalmSource|Palm",
                Vertu: "Vertu|Vertu.*Ltd|Vertu.*Ascent|Vertu.*Ayxta|Vertu.*Constellation(F|Quest)?|Vertu.*Monika|Vertu.*Signature",
                Pantech: "PANTECH|IM-A850S|IM-A840S|IM-A830L|IM-A830K|IM-A830S|IM-A820L|IM-A810K|IM-A810S|IM-A800S|IM-T100K|IM-A725L|IM-A780L|IM-A775C|IM-A770K|IM-A760S|IM-A750K|IM-A740S|IM-A730S|IM-A720L|IM-A710K|IM-A690L|IM-A690S|IM-A650S|IM-A630K|IM-A600S|VEGA PTL21|PT003|P8010|ADR910L|P6030|P6020|P9070|P4100|P9060|P5000|CDM8992|TXT8045|ADR8995|IS11PT|P2030|P6010|P8000|PT002|IS06|CDM8999|P9050|PT001|TXT8040|P2020|P9020|P2000|P7040|P7000|C790",
                Fly: "IQ230|IQ444|IQ450|IQ440|IQ442|IQ441|IQ245|IQ256|IQ236|IQ255|IQ235|IQ245|IQ275|IQ240|IQ285|IQ280|IQ270|IQ260|IQ250",
                Wiko: "KITE 4G|HIGHWAY|GETAWAY|STAIRWAY|DARKSIDE|DARKFULL|DARKNIGHT|DARKMOON|SLIDE|WAX 4G|RAINBOW|BLOOM|SUNSET|GOA|LENNY|BARRY|IGGY|OZZY|CINK FIVE|CINK PEAX|CINK PEAX 2|CINK SLIM|CINK SLIM 2|CINK +|CINK KING|CINK PEAX|CINK SLIM|SUBLIM",
                iMobile: "i-mobile (IQ|i-STYLE|idea|ZAA|Hitz)",
                SimValley: "\\b(SP-80|XT-930|SX-340|XT-930|SX-310|SP-360|SP60|SPT-800|SP-120|SPT-800|SP-140|SPX-5|SPX-8|SP-100|SPX-8|SPX-12)\\b",
                Wolfgang: "AT-B24D|AT-AS50HD|AT-AS40W|AT-AS55HD|AT-AS45q2|AT-B26D|AT-AS50Q",
                Alcatel: "Alcatel",
                Nintendo: "Nintendo 3DS",
                Amoi: "Amoi",
                INQ: "INQ",
                GenericPhone: "Tapatalk|PDA;|SAGEM|\\bmmp\\b|pocket|\\bpsp\\b|symbian|Smartphone|smartfon|treo|up.browser|up.link|vodafone|\\bwap\\b|nokia|Series40|Series60|S60|SonyEricsson|N900|MAUI.*WAP.*Browser"
            },
            tablets: {
                iPad: "iPad|iPad.*Mobile",
                NexusTablet: "Android.*Nexus[\\s]+(7|9|10)",
                SamsungTablet: "SAMSUNG.*Tablet|Galaxy.*Tab|SC-01C|GT-P1000|GT-P1003|GT-P1010|GT-P3105|GT-P6210|GT-P6800|GT-P6810|GT-P7100|GT-P7300|GT-P7310|GT-P7500|GT-P7510|SCH-I800|SCH-I815|SCH-I905|SGH-I957|SGH-I987|SGH-T849|SGH-T859|SGH-T869|SPH-P100|GT-P3100|GT-P3108|GT-P3110|GT-P5100|GT-P5110|GT-P6200|GT-P7320|GT-P7511|GT-N8000|GT-P8510|SGH-I497|SPH-P500|SGH-T779|SCH-I705|SCH-I915|GT-N8013|GT-P3113|GT-P5113|GT-P8110|GT-N8010|GT-N8005|GT-N8020|GT-P1013|GT-P6201|GT-P7501|GT-N5100|GT-N5105|GT-N5110|SHV-E140K|SHV-E140L|SHV-E140S|SHV-E150S|SHV-E230K|SHV-E230L|SHV-E230S|SHW-M180K|SHW-M180L|SHW-M180S|SHW-M180W|SHW-M300W|SHW-M305W|SHW-M380K|SHW-M380S|SHW-M380W|SHW-M430W|SHW-M480K|SHW-M480S|SHW-M480W|SHW-M485W|SHW-M486W|SHW-M500W|GT-I9228|SCH-P739|SCH-I925|GT-I9200|GT-P5200|GT-P5210|GT-P5210X|SM-T311|SM-T310|SM-T310X|SM-T210|SM-T210R|SM-T211|SM-P600|SM-P601|SM-P605|SM-P900|SM-P901|SM-T217|SM-T217A|SM-T217S|SM-P6000|SM-T3100|SGH-I467|XE500|SM-T110|GT-P5220|GT-I9200X|GT-N5110X|GT-N5120|SM-P905|SM-T111|SM-T2105|SM-T315|SM-T320|SM-T320X|SM-T321|SM-T520|SM-T525|SM-T530NU|SM-T230NU|SM-T330NU|SM-T900|XE500T1C|SM-P605V|SM-P905V|SM-T337V|SM-T537V|SM-T707V|SM-T807V|SM-P600X|SM-P900X|SM-T210X|SM-T230|SM-T230X|SM-T325|GT-P7503|SM-T531|SM-T330|SM-T530|SM-T705|SM-T705C|SM-T535|SM-T331|SM-T800|SM-T700|SM-T537|SM-T807|SM-P907A|SM-T337A|SM-T537A|SM-T707A|SM-T807A|SM-T237|SM-T807P|SM-P607T|SM-T217T|SM-T337T|SM-T807T|SM-T116NQ|SM-P550|SM-T350|SM-T550|SM-T9000|SM-P9000|SM-T705Y|SM-T805|GT-P3113|SM-T710|SM-T810|SM-T815|SM-T360|SM-T533|SM-T113|SM-T335|SM-T715|SM-T560|SM-T670|SM-T677|SM-T377|SM-T567|SM-T357T|SM-T555|SM-T561",
                Kindle: "Kindle|Silk.*Accelerated|Android.*\\b(KFOT|KFTT|KFJWI|KFJWA|KFOTE|KFSOWI|KFTHWI|KFTHWA|KFAPWI|KFAPWA|WFJWAE|KFSAWA|KFSAWI|KFASWI)\\b",
                SurfaceTablet: "Windows NT [0-9.]+; ARM;.*(Tablet|ARMBJS)",
                HPTablet: "HP Slate (7|8|10)|HP ElitePad 900|hp-tablet|EliteBook.*Touch|HP 8|Slate 21|HP SlateBook 10",
                AsusTablet: "^.*PadFone((?!Mobile).)*$|Transformer|TF101|TF101G|TF300T|TF300TG|TF300TL|TF700T|TF700KL|TF701T|TF810C|ME171|ME301T|ME302C|ME371MG|ME370T|ME372MG|ME172V|ME173X|ME400C|Slider SL101|\\bK00F\\b|\\bK00C\\b|\\bK00E\\b|\\bK00L\\b|TX201LA|ME176C|ME102A|\\bM80TA\\b|ME372CL|ME560CG|ME372CG|ME302KL| K010 | K017 |ME572C|ME103K|ME170C|ME171C|\\bME70C\\b|ME581C|ME581CL|ME8510C|ME181C",
                BlackBerryTablet: "PlayBook|RIM Tablet",
                HTCtablet: "HTC_Flyer_P512|HTC Flyer|HTC Jetstream|HTC-P715a|HTC EVO View 4G|PG41200|PG09410",
                MotorolaTablet: "xoom|sholest|MZ615|MZ605|MZ505|MZ601|MZ602|MZ603|MZ604|MZ606|MZ607|MZ608|MZ609|MZ615|MZ616|MZ617",
                NookTablet: "Android.*Nook|NookColor|nook browser|BNRV200|BNRV200A|BNTV250|BNTV250A|BNTV400|BNTV600|LogicPD Zoom2",
                AcerTablet: "Android.*; \\b(A100|A101|A110|A200|A210|A211|A500|A501|A510|A511|A700|A701|W500|W500P|W501|W501P|W510|W511|W700|G100|G100W|B1-A71|B1-710|B1-711|A1-810|A1-811|A1-830)\\b|W3-810|\\bA3-A10\\b|\\bA3-A11\\b",
                ToshibaTablet: "Android.*(AT100|AT105|AT200|AT205|AT270|AT275|AT300|AT305|AT1S5|AT500|AT570|AT700|AT830)|TOSHIBA.*FOLIO",
                LGTablet: "\\bL-06C|LG-V909|LG-V900|LG-V700|LG-V510|LG-V500|LG-V410|LG-V400|LG-VK810\\b",
                FujitsuTablet: "Android.*\\b(F-01D|F-02F|F-05E|F-10D|M532|Q572)\\b",
                PrestigioTablet: "PMP3170B|PMP3270B|PMP3470B|PMP7170B|PMP3370B|PMP3570C|PMP5870C|PMP3670B|PMP5570C|PMP5770D|PMP3970B|PMP3870C|PMP5580C|PMP5880D|PMP5780D|PMP5588C|PMP7280C|PMP7280C3G|PMP7280|PMP7880D|PMP5597D|PMP5597|PMP7100D|PER3464|PER3274|PER3574|PER3884|PER5274|PER5474|PMP5097CPRO|PMP5097|PMP7380D|PMP5297C|PMP5297C_QUAD|PMP812E|PMP812E3G|PMP812F|PMP810E|PMP880TD|PMT3017|PMT3037|PMT3047|PMT3057|PMT7008|PMT5887|PMT5001|PMT5002",
                LenovoTablet: "Lenovo TAB|Idea(Tab|Pad)( A1|A10| K1|)|ThinkPad([ ]+)?Tablet|Lenovo.*(S2109|S2110|S5000|S6000|K3011|A3000|A3500|A1000|A2107|A2109|A1107|A5500|A7600|B6000|B8000|B8080)(-|)(FL|F|HV|H|)",
                DellTablet: "Venue 11|Venue 8|Venue 7|Dell Streak 10|Dell Streak 7",
                YarvikTablet: "Android.*\\b(TAB210|TAB211|TAB224|TAB250|TAB260|TAB264|TAB310|TAB360|TAB364|TAB410|TAB411|TAB420|TAB424|TAB450|TAB460|TAB461|TAB464|TAB465|TAB467|TAB468|TAB07-100|TAB07-101|TAB07-150|TAB07-151|TAB07-152|TAB07-200|TAB07-201-3G|TAB07-210|TAB07-211|TAB07-212|TAB07-214|TAB07-220|TAB07-400|TAB07-485|TAB08-150|TAB08-200|TAB08-201-3G|TAB08-201-30|TAB09-100|TAB09-211|TAB09-410|TAB10-150|TAB10-201|TAB10-211|TAB10-400|TAB10-410|TAB13-201|TAB274EUK|TAB275EUK|TAB374EUK|TAB462EUK|TAB474EUK|TAB9-200)\\b",
                MedionTablet: "Android.*\\bOYO\\b|LIFE.*(P9212|P9514|P9516|S9512)|LIFETAB",
                ArnovaTablet: "AN10G2|AN7bG3|AN7fG3|AN8G3|AN8cG3|AN7G3|AN9G3|AN7dG3|AN7dG3ST|AN7dG3ChildPad|AN10bG3|AN10bG3DT|AN9G2",
                IntensoTablet: "INM8002KP|INM1010FP|INM805ND|Intenso Tab|TAB1004",
                IRUTablet: "M702pro",
                MegafonTablet: "MegaFon V9|\\bZTE V9\\b|Android.*\\bMT7A\\b",
                EbodaTablet: "E-Boda (Supreme|Impresspeed|Izzycomm|Essential)",
                AllViewTablet: "Allview.*(Viva|Alldro|City|Speed|All TV|Frenzy|Quasar|Shine|TX1|AX1|AX2)",
                ArchosTablet: "\\b(101G9|80G9|A101IT)\\b|Qilive 97R|Archos5|\\bARCHOS (70|79|80|90|97|101|FAMILYPAD|)(b|)(G10| Cobalt| TITANIUM(HD|)| Xenon| Neon|XSK| 2| XS 2| PLATINUM| CARBON|GAMEPAD)\\b",
                AinolTablet: "NOVO7|NOVO8|NOVO10|Novo7Aurora|Novo7Basic|NOVO7PALADIN|novo9-Spark",
                SonyTablet: "Sony.*Tablet|Xperia Tablet|Sony Tablet S|SO-03E|SGPT12|SGPT13|SGPT114|SGPT121|SGPT122|SGPT123|SGPT111|SGPT112|SGPT113|SGPT131|SGPT132|SGPT133|SGPT211|SGPT212|SGPT213|SGP311|SGP312|SGP321|EBRD1101|EBRD1102|EBRD1201|SGP351|SGP341|SGP511|SGP512|SGP521|SGP541|SGP551|SGP621|SGP612|SOT31",
                PhilipsTablet: "\\b(PI2010|PI3000|PI3100|PI3105|PI3110|PI3205|PI3210|PI3900|PI4010|PI7000|PI7100)\\b",
                CubeTablet: "Android.*(K8GT|U9GT|U10GT|U16GT|U17GT|U18GT|U19GT|U20GT|U23GT|U30GT)|CUBE U8GT",
                CobyTablet: "MID1042|MID1045|MID1125|MID1126|MID7012|MID7014|MID7015|MID7034|MID7035|MID7036|MID7042|MID7048|MID7127|MID8042|MID8048|MID8127|MID9042|MID9740|MID9742|MID7022|MID7010",
                MIDTablet: "M9701|M9000|M9100|M806|M1052|M806|T703|MID701|MID713|MID710|MID727|MID760|MID830|MID728|MID933|MID125|MID810|MID732|MID120|MID930|MID800|MID731|MID900|MID100|MID820|MID735|MID980|MID130|MID833|MID737|MID960|MID135|MID860|MID736|MID140|MID930|MID835|MID733|MID4X10",
                MSITablet: "MSI \\b(Primo 73K|Primo 73L|Primo 81L|Primo 77|Primo 93|Primo 75|Primo 76|Primo 73|Primo 81|Primo 91|Primo 90|Enjoy 71|Enjoy 7|Enjoy 10)\\b",
                SMiTTablet: "Android.*(\\bMID\\b|MID-560|MTV-T1200|MTV-PND531|MTV-P1101|MTV-PND530)",
                RockChipTablet: "Android.*(RK2818|RK2808A|RK2918|RK3066)|RK2738|RK2808A",
                FlyTablet: "IQ310|Fly Vision",
                bqTablet: "Android.*(bq)?.*(Elcano|Curie|Edison|Maxwell|Kepler|Pascal|Tesla|Hypatia|Platon|Newton|Livingstone|Cervantes|Avant|Aquaris E10)|Maxwell.*Lite|Maxwell.*Plus",
                HuaweiTablet: "MediaPad|MediaPad 7 Youth|IDEOS S7|S7-201c|S7-202u|S7-101|S7-103|S7-104|S7-105|S7-106|S7-201|S7-Slim",
                NecTablet: "\\bN-06D|\\bN-08D",
                PantechTablet: "Pantech.*P4100",
                BronchoTablet: "Broncho.*(N701|N708|N802|a710)",
                VersusTablet: "TOUCHPAD.*[78910]|\\bTOUCHTAB\\b",
                ZyncTablet: "z1000|Z99 2G|z99|z930|z999|z990|z909|Z919|z900",
                PositivoTablet: "TB07STA|TB10STA|TB07FTA|TB10FTA",
                NabiTablet: "Android.*\\bNabi",
                KoboTablet: "Kobo Touch|\\bK080\\b|\\bVox\\b Build|\\bArc\\b Build",
                DanewTablet: "DSlide.*\\b(700|701R|702|703R|704|802|970|971|972|973|974|1010|1012)\\b",
                TexetTablet: "NaviPad|TB-772A|TM-7045|TM-7055|TM-9750|TM-7016|TM-7024|TM-7026|TM-7041|TM-7043|TM-7047|TM-8041|TM-9741|TM-9747|TM-9748|TM-9751|TM-7022|TM-7021|TM-7020|TM-7011|TM-7010|TM-7023|TM-7025|TM-7037W|TM-7038W|TM-7027W|TM-9720|TM-9725|TM-9737W|TM-1020|TM-9738W|TM-9740|TM-9743W|TB-807A|TB-771A|TB-727A|TB-725A|TB-719A|TB-823A|TB-805A|TB-723A|TB-715A|TB-707A|TB-705A|TB-709A|TB-711A|TB-890HD|TB-880HD|TB-790HD|TB-780HD|TB-770HD|TB-721HD|TB-710HD|TB-434HD|TB-860HD|TB-840HD|TB-760HD|TB-750HD|TB-740HD|TB-730HD|TB-722HD|TB-720HD|TB-700HD|TB-500HD|TB-470HD|TB-431HD|TB-430HD|TB-506|TB-504|TB-446|TB-436|TB-416|TB-146SE|TB-126SE",
                PlaystationTablet: "Playstation.*(Portable|Vita)",
                TrekstorTablet: "ST10416-1|VT10416-1|ST70408-1|ST702xx-1|ST702xx-2|ST80208|ST97216|ST70104-2|VT10416-2|ST10216-2A|SurfTab",
                PyleAudioTablet: "\\b(PTBL10CEU|PTBL10C|PTBL72BC|PTBL72BCEU|PTBL7CEU|PTBL7C|PTBL92BC|PTBL92BCEU|PTBL9CEU|PTBL9CUK|PTBL9C)\\b",
                AdvanTablet: "Android.* \\b(E3A|T3X|T5C|T5B|T3E|T3C|T3B|T1J|T1F|T2A|T1H|T1i|E1C|T1-E|T5-A|T4|E1-B|T2Ci|T1-B|T1-D|O1-A|E1-A|T1-A|T3A|T4i)\\b ",
                DanyTechTablet: "Genius Tab G3|Genius Tab S2|Genius Tab Q3|Genius Tab G4|Genius Tab Q4|Genius Tab G-II|Genius TAB GII|Genius TAB GIII|Genius Tab S1",
                GalapadTablet: "Android.*\\bG1\\b",
                MicromaxTablet: "Funbook|Micromax.*\\b(P250|P560|P360|P362|P600|P300|P350|P500|P275)\\b",
                KarbonnTablet: "Android.*\\b(A39|A37|A34|ST8|ST10|ST7|Smart Tab3|Smart Tab2)\\b",
                AllFineTablet: "Fine7 Genius|Fine7 Shine|Fine7 Air|Fine8 Style|Fine9 More|Fine10 Joy|Fine11 Wide",
                PROSCANTablet: "\\b(PEM63|PLT1023G|PLT1041|PLT1044|PLT1044G|PLT1091|PLT4311|PLT4311PL|PLT4315|PLT7030|PLT7033|PLT7033D|PLT7035|PLT7035D|PLT7044K|PLT7045K|PLT7045KB|PLT7071KG|PLT7072|PLT7223G|PLT7225G|PLT7777G|PLT7810K|PLT7849G|PLT7851G|PLT7852G|PLT8015|PLT8031|PLT8034|PLT8036|PLT8080K|PLT8082|PLT8088|PLT8223G|PLT8234G|PLT8235G|PLT8816K|PLT9011|PLT9045K|PLT9233G|PLT9735|PLT9760G|PLT9770G)\\b",
                YONESTablet: "BQ1078|BC1003|BC1077|RK9702|BC9730|BC9001|IT9001|BC7008|BC7010|BC708|BC728|BC7012|BC7030|BC7027|BC7026",
                ChangJiaTablet: "TPC7102|TPC7103|TPC7105|TPC7106|TPC7107|TPC7201|TPC7203|TPC7205|TPC7210|TPC7708|TPC7709|TPC7712|TPC7110|TPC8101|TPC8103|TPC8105|TPC8106|TPC8203|TPC8205|TPC8503|TPC9106|TPC9701|TPC97101|TPC97103|TPC97105|TPC97106|TPC97111|TPC97113|TPC97203|TPC97603|TPC97809|TPC97205|TPC10101|TPC10103|TPC10106|TPC10111|TPC10203|TPC10205|TPC10503",
                GUTablet: "TX-A1301|TX-M9002|Q702|kf026",
                PointOfViewTablet: "TAB-P506|TAB-navi-7-3G-M|TAB-P517|TAB-P-527|TAB-P701|TAB-P703|TAB-P721|TAB-P731N|TAB-P741|TAB-P825|TAB-P905|TAB-P925|TAB-PR945|TAB-PL1015|TAB-P1025|TAB-PI1045|TAB-P1325|TAB-PROTAB[0-9]+|TAB-PROTAB25|TAB-PROTAB26|TAB-PROTAB27|TAB-PROTAB26XL|TAB-PROTAB2-IPS9|TAB-PROTAB30-IPS9|TAB-PROTAB25XXL|TAB-PROTAB26-IPS10|TAB-PROTAB30-IPS10",
                OvermaxTablet: "OV-(SteelCore|NewBase|Basecore|Baseone|Exellen|Quattor|EduTab|Solution|ACTION|BasicTab|TeddyTab|MagicTab|Stream|TB-08|TB-09)",
                HCLTablet: "HCL.*Tablet|Connect-3G-2.0|Connect-2G-2.0|ME Tablet U1|ME Tablet U2|ME Tablet G1|ME Tablet X1|ME Tablet Y2|ME Tablet Sync",
                DPSTablet: "DPS Dream 9|DPS Dual 7",
                VistureTablet: "V97 HD|i75 3G|Visture V4( HD)?|Visture V5( HD)?|Visture V10",
                CrestaTablet: "CTP(-)?810|CTP(-)?818|CTP(-)?828|CTP(-)?838|CTP(-)?888|CTP(-)?978|CTP(-)?980|CTP(-)?987|CTP(-)?988|CTP(-)?989",
                MediatekTablet: "\\bMT8125|MT8389|MT8135|MT8377\\b",
                ConcordeTablet: "Concorde([ ]+)?Tab|ConCorde ReadMan",
                GoCleverTablet: "GOCLEVER TAB|A7GOCLEVER|M1042|M7841|M742|R1042BK|R1041|TAB A975|TAB A7842|TAB A741|TAB A741L|TAB M723G|TAB M721|TAB A1021|TAB I921|TAB R721|TAB I720|TAB T76|TAB R70|TAB R76.2|TAB R106|TAB R83.2|TAB M813G|TAB I721|GCTA722|TAB I70|TAB I71|TAB S73|TAB R73|TAB R74|TAB R93|TAB R75|TAB R76.1|TAB A73|TAB A93|TAB A93.2|TAB T72|TAB R83|TAB R974|TAB R973|TAB A101|TAB A103|TAB A104|TAB A104.2|R105BK|M713G|A972BK|TAB A971|TAB R974.2|TAB R104|TAB R83.3|TAB A1042",
                ModecomTablet: "FreeTAB 9000|FreeTAB 7.4|FreeTAB 7004|FreeTAB 7800|FreeTAB 2096|FreeTAB 7.5|FreeTAB 1014|FreeTAB 1001 |FreeTAB 8001|FreeTAB 9706|FreeTAB 9702|FreeTAB 7003|FreeTAB 7002|FreeTAB 1002|FreeTAB 7801|FreeTAB 1331|FreeTAB 1004|FreeTAB 8002|FreeTAB 8014|FreeTAB 9704|FreeTAB 1003",
                VoninoTablet: "\\b(Argus[ _]?S|Diamond[ _]?79HD|Emerald[ _]?78E|Luna[ _]?70C|Onyx[ _]?S|Onyx[ _]?Z|Orin[ _]?HD|Orin[ _]?S|Otis[ _]?S|SpeedStar[ _]?S|Magnet[ _]?M9|Primus[ _]?94[ _]?3G|Primus[ _]?94HD|Primus[ _]?QS|Android.*\\bQ8\\b|Sirius[ _]?EVO[ _]?QS|Sirius[ _]?QS|Spirit[ _]?S)\\b",
                ECSTablet: "V07OT2|TM105A|S10OT1|TR10CS1",
                StorexTablet: "eZee[_']?(Tab|Go)[0-9]+|TabLC7|Looney Tunes Tab",
                VodafoneTablet: "SmartTab([ ]+)?[0-9]+|SmartTabII10|SmartTabII7",
                EssentielBTablet: "Smart[ ']?TAB[ ]+?[0-9]+|Family[ ']?TAB2",
                RossMoorTablet: "RM-790|RM-997|RMD-878G|RMD-974R|RMT-705A|RMT-701|RME-601|RMT-501|RMT-711",
                iMobileTablet: "i-mobile i-note",
                TolinoTablet: "tolino tab [0-9.]+|tolino shine",
                AudioSonicTablet: "\\bC-22Q|T7-QC|T-17B|T-17P\\b",
                AMPETablet: "Android.* A78 ",
                SkkTablet: "Android.* (SKYPAD|PHOENIX|CYCLOPS)",
                TecnoTablet: "TECNO P9",
                JXDTablet: "Android.* \\b(F3000|A3300|JXD5000|JXD3000|JXD2000|JXD300B|JXD300|S5800|S7800|S602b|S5110b|S7300|S5300|S602|S603|S5100|S5110|S601|S7100a|P3000F|P3000s|P101|P200s|P1000m|P200m|P9100|P1000s|S6600b|S908|P1000|P300|S18|S6600|S9100)\\b",
                iJoyTablet: "Tablet (Spirit 7|Essentia|Galatea|Fusion|Onix 7|Landa|Titan|Scooby|Deox|Stella|Themis|Argon|Unique 7|Sygnus|Hexen|Finity 7|Cream|Cream X2|Jade|Neon 7|Neron 7|Kandy|Scape|Saphyr 7|Rebel|Biox|Rebel|Rebel 8GB|Myst|Draco 7|Myst|Tab7-004|Myst|Tadeo Jones|Tablet Boing|Arrow|Draco Dual Cam|Aurix|Mint|Amity|Revolution|Finity 9|Neon 9|T9w|Amity 4GB Dual Cam|Stone 4GB|Stone 8GB|Andromeda|Silken|X2|Andromeda II|Halley|Flame|Saphyr 9,7|Touch 8|Planet|Triton|Unique 10|Hexen 10|Memphis 4GB|Memphis 8GB|Onix 10)",
                FX2Tablet: "FX2 PAD7|FX2 PAD10",
                XoroTablet: "KidsPAD 701|PAD[ ]?712|PAD[ ]?714|PAD[ ]?716|PAD[ ]?717|PAD[ ]?718|PAD[ ]?720|PAD[ ]?721|PAD[ ]?722|PAD[ ]?790|PAD[ ]?792|PAD[ ]?900|PAD[ ]?9715D|PAD[ ]?9716DR|PAD[ ]?9718DR|PAD[ ]?9719QR|PAD[ ]?9720QR|TelePAD1030|Telepad1032|TelePAD730|TelePAD731|TelePAD732|TelePAD735Q|TelePAD830|TelePAD9730|TelePAD795|MegaPAD 1331|MegaPAD 1851|MegaPAD 2151",
                ViewsonicTablet: "ViewPad 10pi|ViewPad 10e|ViewPad 10s|ViewPad E72|ViewPad7|ViewPad E100|ViewPad 7e|ViewSonic VB733|VB100a",
                OdysTablet: "LOOX|XENO10|ODYS[ -](Space|EVO|Xpress|NOON)|\\bXELIO\\b|Xelio10Pro|XELIO7PHONETAB|XELIO10EXTREME|XELIOPT2|NEO_QUAD10",
                CaptivaTablet: "CAPTIVA PAD",
                IconbitTablet: "NetTAB|NT-3702|NT-3702S|NT-3702S|NT-3603P|NT-3603P|NT-0704S|NT-0704S|NT-3805C|NT-3805C|NT-0806C|NT-0806C|NT-0909T|NT-0909T|NT-0907S|NT-0907S|NT-0902S|NT-0902S",
                TeclastTablet: "T98 4G|\\bP80\\b|\\bX90HD\\b|X98 Air|X98 Air 3G|\\bX89\\b|P80 3G|\\bX80h\\b|P98 Air|\\bX89HD\\b|P98 3G|\\bP90HD\\b|P89 3G|X98 3G|\\bP70h\\b|P79HD 3G|G18d 3G|\\bP79HD\\b|\\bP89s\\b|\\bA88\\b|\\bP10HD\\b|\\bP19HD\\b|G18 3G|\\bP78HD\\b|\\bA78\\b|\\bP75\\b|G17s 3G|G17h 3G|\\bP85t\\b|\\bP90\\b|\\bP11\\b|\\bP98t\\b|\\bP98HD\\b|\\bG18d\\b|\\bP85s\\b|\\bP11HD\\b|\\bP88s\\b|\\bA80HD\\b|\\bA80se\\b|\\bA10h\\b|\\bP89\\b|\\bP78s\\b|\\bG18\\b|\\bP85\\b|\\bA70h\\b|\\bA70\\b|\\bG17\\b|\\bP18\\b|\\bA80s\\b|\\bA11s\\b|\\bP88HD\\b|\\bA80h\\b|\\bP76s\\b|\\bP76h\\b|\\bP98\\b|\\bA10HD\\b|\\bP78\\b|\\bP88\\b|\\bA11\\b|\\bA10t\\b|\\bP76a\\b|\\bP76t\\b|\\bP76e\\b|\\bP85HD\\b|\\bP85a\\b|\\bP86\\b|\\bP75HD\\b|\\bP76v\\b|\\bA12\\b|\\bP75a\\b|\\bA15\\b|\\bP76Ti\\b|\\bP81HD\\b|\\bA10\\b|\\bT760VE\\b|\\bT720HD\\b|\\bP76\\b|\\bP73\\b|\\bP71\\b|\\bP72\\b|\\bT720SE\\b|\\bC520Ti\\b|\\bT760\\b|\\bT720VE\\b|T720-3GE|T720-WiFi",
                OndaTablet: "\\b(V975i|Vi30|VX530|V701|Vi60|V701s|Vi50|V801s|V719|Vx610w|VX610W|V819i|Vi10|VX580W|Vi10|V711s|V813|V811|V820w|V820|Vi20|V711|VI30W|V712|V891w|V972|V819w|V820w|Vi60|V820w|V711|V813s|V801|V819|V975s|V801|V819|V819|V818|V811|V712|V975m|V101w|V961w|V812|V818|V971|V971s|V919|V989|V116w|V102w|V973|Vi40)\\b[\\s]+",
                JaytechTablet: "TPC-PA762",
                BlaupunktTablet: "Endeavour 800NG|Endeavour 1010",
                DigmaTablet: "\\b(iDx10|iDx9|iDx8|iDx7|iDxD7|iDxD8|iDsQ8|iDsQ7|iDsQ8|iDsD10|iDnD7|3TS804H|iDsQ11|iDj7|iDs10)\\b",
                EvolioTablet: "ARIA_Mini_wifi|Aria[ _]Mini|Evolio X10|Evolio X7|Evolio X8|\\bEvotab\\b|\\bNeura\\b",
                LavaTablet: "QPAD E704|\\bIvoryS\\b|E-TAB IVORY|\\bE-TAB\\b",
                AocTablet: "MW0811|MW0812|MW0922|MTK8382",
                MpmanTablet: "MP11 OCTA|MP10 OCTA|MPQC1114|MPQC1004|MPQC994|MPQC974|MPQC973|MPQC804|MPQC784|MPQC780|\\bMPG7\\b|MPDCG75|MPDCG71|MPDC1006|MP101DC|MPDC9000|MPDC905|MPDC706HD|MPDC706|MPDC705|MPDC110|MPDC100|MPDC99|MPDC97|MPDC88|MPDC8|MPDC77|MP709|MID701|MID711|MID170|MPDC703|MPQC1010",
                CelkonTablet: "CT695|CT888|CT[\\s]?910|CT7 Tab|CT9 Tab|CT3 Tab|CT2 Tab|CT1 Tab|C820|C720|\\bCT-1\\b",
                WolderTablet: "miTab \\b(DIAMOND|SPACE|BROOKLYN|NEO|FLY|MANHATTAN|FUNK|EVOLUTION|SKY|GOCAR|IRON|GENIUS|POP|MINT|EPSILON|BROADWAY|JUMP|HOP|LEGEND|NEW AGE|LINE|ADVANCE|FEEL|FOLLOW|LIKE|LINK|LIVE|THINK|FREEDOM|CHICAGO|CLEVELAND|BALTIMORE-GH|IOWA|BOSTON|SEATTLE|PHOENIX|DALLAS|IN 101|MasterChef)\\b",
                MiTablet: "\\bMI PAD\\b|\\bHM NOTE 1W\\b",
                NibiruTablet: "Nibiru M1|Nibiru Jupiter One",
                NexoTablet: "NEXO NOVA|NEXO 10|NEXO AVIO|NEXO FREE|NEXO GO|NEXO EVO|NEXO 3G|NEXO SMART|NEXO KIDDO|NEXO MOBI",
                LeaderTablet: "TBLT10Q|TBLT10I|TBL-10WDKB|TBL-10WDKBO2013|TBL-W230V2|TBL-W450|TBL-W500|SV572|TBLT7I|TBA-AC7-8G|TBLT79|TBL-8W16|TBL-10W32|TBL-10WKB|TBL-W100",
                UbislateTablet: "UbiSlate[\\s]?7C",
                PocketBookTablet: "Pocketbook",
                Hudl: "Hudl HT7S3|Hudl 2",
                TelstraTablet: "T-Hub2",
                GenericTablet: "Android.*\\b97D\\b|Tablet(?!.*PC)|BNTV250A|MID-WCDMA|LogicPD Zoom2|\\bA7EB\\b|CatNova8|A1_07|CT704|CT1002|\\bM721\\b|rk30sdk|\\bEVOTAB\\b|M758A|ET904|ALUMIUM10|Smartfren Tab|Endeavour 1010|Tablet-PC-4|Tagi Tab|\\bM6pro\\b|CT1020W|arc 10HD|\\bJolla\\b|\\bTP750\\b"
            },
            oss: {
                AndroidOS: "Android",
                BlackBerryOS: "blackberry|\\bBB10\\b|rim tablet os",
                PalmOS: "PalmOS|avantgo|blazer|elaine|hiptop|palm|plucker|xiino",
                SymbianOS: "Symbian|SymbOS|Series60|Series40|SYB-[0-9]+|\\bS60\\b",
                WindowsMobileOS: "Windows CE.*(PPC|Smartphone|Mobile|[0-9]{3}x[0-9]{3})|Window Mobile|Windows Phone [0-9.]+|WCE;",
                WindowsPhoneOS: "Windows Phone 10.0|Windows Phone 8.1|Windows Phone 8.0|Windows Phone OS|XBLWP7|ZuneWP7|Windows NT 6.[23]; ARM;",
                iOS: "\\biPhone.*Mobile|\\biPod|\\biPad",
                MeeGoOS: "MeeGo",
                MaemoOS: "Maemo",
                JavaOS: "J2ME/|\\bMIDP\\b|\\bCLDC\\b",
                webOS: "webOS|hpwOS",
                badaOS: "\\bBada\\b",
                BREWOS: "BREW"
            },
            uas: {
                Chrome: "\\bCrMo\\b|CriOS|Android.*Chrome/[.0-9]* (Mobile)?",
                Dolfin: "\\bDolfin\\b",
                Opera: "Opera.*Mini|Opera.*Mobi|Android.*Opera|Mobile.*OPR/[0-9.]+|Coast/[0-9.]+",
                Skyfire: "Skyfire",
                IE: "IEMobile|MSIEMobile",
                Firefox: "fennec|firefox.*maemo|(Mobile|Tablet).*Firefox|Firefox.*Mobile",
                Bolt: "bolt",
                TeaShark: "teashark",
                Blazer: "Blazer",
                Safari: "Version.*Mobile.*Safari|Safari.*Mobile|MobileSafari",
                Tizen: "Tizen",
                UCBrowser: "UC.*Browser|UCWEB",
                baiduboxapp: "baiduboxapp",
                baidubrowser: "baidubrowser",
                DiigoBrowser: "DiigoBrowser",
                Puffin: "Puffin",
                Mercury: "\\bMercury\\b",
                ObigoBrowser: "Obigo",
                NetFront: "NF-Browser",
                GenericBrowser: "NokiaBrowser|OviBrowser|OneBrowser|TwonkyBeamBrowser|SEMC.*Browser|FlyFlow|Minimo|NetFront|Novarra-Vision|MQQBrowser|MicroMessenger"
            },
            props: {
                Mobile: "Mobile/[VER]",
                Build: "Build/[VER]",
                Version: "Version/[VER]",
                VendorID: "VendorID/[VER]",
                iPad: "iPad.*CPU[a-z ]+[VER]",
                iPhone: "iPhone.*CPU[a-z ]+[VER]",
                iPod: "iPod.*CPU[a-z ]+[VER]",
                Kindle: "Kindle/[VER]",
                Chrome: [ "Chrome/[VER]", "CriOS/[VER]", "CrMo/[VER]" ],
                Coast: [ "Coast/[VER]" ],
                Dolfin: "Dolfin/[VER]",
                Firefox: "Firefox/[VER]",
                Fennec: "Fennec/[VER]",
                IE: [ "IEMobile/[VER];", "IEMobile [VER]", "MSIE [VER];", "Trident/[0-9.]+;.*rv:[VER]" ],
                NetFront: "NetFront/[VER]",
                NokiaBrowser: "NokiaBrowser/[VER]",
                Opera: [ " OPR/[VER]", "Opera Mini/[VER]", "Version/[VER]" ],
                "Opera Mini": "Opera Mini/[VER]",
                "Opera Mobi": "Version/[VER]",
                "UC Browser": "UC Browser[VER]",
                MQQBrowser: "MQQBrowser/[VER]",
                MicroMessenger: "MicroMessenger/[VER]",
                baiduboxapp: "baiduboxapp/[VER]",
                baidubrowser: "baidubrowser/[VER]",
                Iron: "Iron/[VER]",
                Safari: [ "Version/[VER]", "Safari/[VER]" ],
                Skyfire: "Skyfire/[VER]",
                Tizen: "Tizen/[VER]",
                Webkit: "webkit[ /][VER]",
                Gecko: "Gecko/[VER]",
                Trident: "Trident/[VER]",
                Presto: "Presto/[VER]",
                iOS: " \\bi?OS\\b [VER][ ;]{1}",
                Android: "Android [VER]",
                BlackBerry: [ "BlackBerry[\\w]+/[VER]", "BlackBerry.*Version/[VER]", "Version/[VER]" ],
                BREW: "BREW [VER]",
                Java: "Java/[VER]",
                "Windows Phone OS": [ "Windows Phone OS [VER]", "Windows Phone [VER]" ],
                "Windows Phone": "Windows Phone [VER]",
                "Windows CE": "Windows CE/[VER]",
                "Windows NT": "Windows NT [VER]",
                Symbian: [ "SymbianOS/[VER]", "Symbian/[VER]" ],
                webOS: [ "webOS/[VER]", "hpwOS/[VER];" ]
            },
            utils: {
                Bot: "Googlebot|facebookexternalhit|AdsBot-Google|Google Keyword Suggestion|Facebot|YandexBot|bingbot|ia_archiver|AhrefsBot|Ezooms|GSLFbot|WBSearchBot|Twitterbot|TweetmemeBot|Twikle|PaperLiBot|Wotbox|UnwindFetchor|Exabot|MJ12bot|YandexImages|TurnitinBot|Pingdom",
                MobileBot: "Googlebot-Mobile|AdsBot-Google-Mobile|YahooSeeker/M1A1-R2D2",
                DesktopMode: "WPDesktop",
                TV: "SonyDTV|HbbTV",
                WebKit: "(webkit)[ /]([\\w.]+)",
                Console: "\\b(Nintendo|Nintendo WiiU|Nintendo 3DS|PLAYSTATION|Xbox)\\b",
                Watch: "SM-V700"
            }
        }, impl.detectMobileBrowsers = {
            fullPattern: /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i,
            shortPattern: /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i,
            tabletPattern: /android|ipad|playbook|silk/i
        };
        var isArray, hasOwnProp = Object.prototype.hasOwnProperty;
        return impl.FALLBACK_PHONE = "UnknownPhone", impl.FALLBACK_TABLET = "UnknownTablet", 
        impl.FALLBACK_MOBILE = "UnknownMobile", isArray = "isArray" in Array ? Array.isArray : function(value) {
            return "[object Array]" === Object.prototype.toString.call(value);
        }, function() {
            var key, values, value, i, len, verPos, mobileDetectRules = impl.mobileDetectRules;
            for (key in mobileDetectRules.props) if (hasOwnProp.call(mobileDetectRules.props, key)) {
                for (values = mobileDetectRules.props[key], isArray(values) || (values = [ values ]), 
                len = values.length, i = 0; len > i; ++i) value = values[i], verPos = value.indexOf("[VER]"), 
                verPos >= 0 && (value = value.substring(0, verPos) + "([\\w._\\+]+)" + value.substring(verPos + 5)), 
                values[i] = new RegExp(value, "i");
                mobileDetectRules.props[key] = values;
            }
            convertPropsToRegExp(mobileDetectRules.oss), convertPropsToRegExp(mobileDetectRules.phones), 
            convertPropsToRegExp(mobileDetectRules.tablets), convertPropsToRegExp(mobileDetectRules.uas), 
            convertPropsToRegExp(mobileDetectRules.utils), mobileDetectRules.oss0 = {
                WindowsPhoneOS: mobileDetectRules.oss.WindowsPhoneOS,
                WindowsMobileOS: mobileDetectRules.oss.WindowsMobileOS
            };
        }(), impl.findMatch = function(rules, userAgent) {
            for (var key in rules) if (hasOwnProp.call(rules, key) && rules[key].test(userAgent)) return key;
            return null;
        }, impl.findMatches = function(rules, userAgent) {
            var result = [];
            for (var key in rules) hasOwnProp.call(rules, key) && rules[key].test(userAgent) && result.push(key);
            return result;
        }, impl.getVersionStr = function(propertyName, userAgent) {
            var patterns, i, len, match, props = impl.mobileDetectRules.props;
            if (hasOwnProp.call(props, propertyName)) for (patterns = props[propertyName], len = patterns.length, 
            i = 0; len > i; ++i) if (match = patterns[i].exec(userAgent), null !== match) return match[1];
            return null;
        }, impl.getVersion = function(propertyName, userAgent) {
            var version = impl.getVersionStr(propertyName, userAgent);
            return version ? impl.prepareVersionNo(version) : NaN;
        }, impl.prepareVersionNo = function(version) {
            var numbers;
            return numbers = version.split(/[a-z._ \/\-]/i), 1 === numbers.length && (version = numbers[0]), 
            numbers.length > 1 && (version = numbers[0] + ".", numbers.shift(), version += numbers.join("")), 
            Number(version);
        }, impl.isMobileFallback = function(userAgent) {
            return impl.detectMobileBrowsers.fullPattern.test(userAgent) || impl.detectMobileBrowsers.shortPattern.test(userAgent.substr(0, 4));
        }, impl.isTabletFallback = function(userAgent) {
            return impl.detectMobileBrowsers.tabletPattern.test(userAgent);
        }, impl.prepareDetectionCache = function(cache, userAgent, maxPhoneWidth) {
            if (cache.mobile === undefined) {
                var phone, tablet, phoneSized;
                return (tablet = impl.findMatch(impl.mobileDetectRules.tablets, userAgent)) ? (cache.mobile = cache.tablet = tablet, 
                void (cache.phone = null)) : (phone = impl.findMatch(impl.mobileDetectRules.phones, userAgent)) ? (cache.mobile = cache.phone = phone, 
                void (cache.tablet = null)) : void (impl.isMobileFallback(userAgent) ? (phoneSized = MobileDetect.isPhoneSized(maxPhoneWidth), 
                phoneSized === undefined ? (cache.mobile = impl.FALLBACK_MOBILE, cache.tablet = cache.phone = null) : phoneSized ? (cache.mobile = cache.phone = impl.FALLBACK_PHONE, 
                cache.tablet = null) : (cache.mobile = cache.tablet = impl.FALLBACK_TABLET, cache.phone = null)) : impl.isTabletFallback(userAgent) ? (cache.mobile = cache.tablet = impl.FALLBACK_TABLET, 
                cache.phone = null) : cache.mobile = cache.tablet = cache.phone = null);
            }
        }, impl.mobileGrade = function(t) {
            var $isMobile = null !== t.mobile();
            return t.os("iOS") && t.version("iPad") >= 4.3 || t.os("iOS") && t.version("iPhone") >= 3.1 || t.os("iOS") && t.version("iPod") >= 3.1 || t.version("Android") > 2.1 && t.is("Webkit") || t.version("Windows Phone OS") >= 7 || t.is("BlackBerry") && t.version("BlackBerry") >= 6 || t.match("Playbook.*Tablet") || t.version("webOS") >= 1.4 && t.match("Palm|Pre|Pixi") || t.match("hp.*TouchPad") || t.is("Firefox") && t.version("Firefox") >= 12 || t.is("Chrome") && t.is("AndroidOS") && t.version("Android") >= 4 || t.is("Skyfire") && t.version("Skyfire") >= 4.1 && t.is("AndroidOS") && t.version("Android") >= 2.3 || t.is("Opera") && t.version("Opera Mobi") > 11 && t.is("AndroidOS") || t.is("MeeGoOS") || t.is("Tizen") || t.is("Dolfin") && t.version("Bada") >= 2 || (t.is("UC Browser") || t.is("Dolfin")) && t.version("Android") >= 2.3 || t.match("Kindle Fire") || t.is("Kindle") && t.version("Kindle") >= 3 || t.is("AndroidOS") && t.is("NookTablet") || t.version("Chrome") >= 11 && !$isMobile || t.version("Safari") >= 5 && !$isMobile || t.version("Firefox") >= 4 && !$isMobile || t.version("MSIE") >= 7 && !$isMobile || t.version("Opera") >= 10 && !$isMobile ? "A" : t.os("iOS") && t.version("iPad") < 4.3 || t.os("iOS") && t.version("iPhone") < 3.1 || t.os("iOS") && t.version("iPod") < 3.1 || t.is("Blackberry") && t.version("BlackBerry") >= 5 && t.version("BlackBerry") < 6 || t.version("Opera Mini") >= 5 && t.version("Opera Mini") <= 6.5 && (t.version("Android") >= 2.3 || t.is("iOS")) || t.match("NokiaN8|NokiaC7|N97.*Series60|Symbian/3") || t.version("Opera Mobi") >= 11 && t.is("SymbianOS") ? "B" : (t.version("BlackBerry") < 5 || t.match("MSIEMobile|Windows CE.*Mobile") || t.version("Windows Mobile") <= 5.2, 
            "C");
        }, impl.detectOS = function(ua) {
            return impl.findMatch(impl.mobileDetectRules.oss0, ua) || impl.findMatch(impl.mobileDetectRules.oss, ua);
        }, impl.getDeviceSmallerSide = function() {
            return window.screen.width < window.screen.height ? window.screen.width : window.screen.height;
        }, MobileDetect.prototype = {
            constructor: MobileDetect,
            mobile: function() {
                return impl.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth), this._cache.mobile;
            },
            phone: function() {
                return impl.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth), this._cache.phone;
            },
            tablet: function() {
                return impl.prepareDetectionCache(this._cache, this.ua, this.maxPhoneWidth), this._cache.tablet;
            },
            userAgent: function() {
                return this._cache.userAgent === undefined && (this._cache.userAgent = impl.findMatch(impl.mobileDetectRules.uas, this.ua)), 
                this._cache.userAgent;
            },
            userAgents: function() {
                return this._cache.userAgents === undefined && (this._cache.userAgents = impl.findMatches(impl.mobileDetectRules.uas, this.ua)), 
                this._cache.userAgents;
            },
            os: function() {
                return this._cache.os === undefined && (this._cache.os = impl.detectOS(this.ua)), 
                this._cache.os;
            },
            version: function(key) {
                return impl.getVersion(key, this.ua);
            },
            versionStr: function(key) {
                return impl.getVersionStr(key, this.ua);
            },
            is: function(key) {
                return containsIC(this.userAgents(), key) || equalIC(key, this.os()) || equalIC(key, this.phone()) || equalIC(key, this.tablet()) || containsIC(impl.findMatches(impl.mobileDetectRules.utils, this.ua), key);
            },
            match: function(pattern) {
                return pattern instanceof RegExp || (pattern = new RegExp(pattern, "i")), pattern.test(this.ua);
            },
            isPhoneSized: function(maxPhoneWidth) {
                return MobileDetect.isPhoneSized(maxPhoneWidth || this.maxPhoneWidth);
            },
            mobileGrade: function() {
                return this._cache.grade === undefined && (this._cache.grade = impl.mobileGrade(this)), 
                this._cache.grade;
            }
        }, "undefined" != typeof window && window.screen ? MobileDetect.isPhoneSized = function(maxPhoneWidth) {
            return 0 > maxPhoneWidth ? undefined : impl.getDeviceSmallerSide() <= maxPhoneWidth;
        } : MobileDetect.isPhoneSized = function() {}, MobileDetect._impl = impl, MobileDetect;
    });
}(function(undefined) {
    return function(factory) {
        window.MobileDetect = factory();
    };
}()), function(e) {
    "use strict";
    var t = "undefined" == typeof window ? null : window;
    "undefined" != typeof module ? module.exports = e(t) : t.DOMPurify = e(t);
}(function e(t) {
    "use strict";
    var r = function(t) {
        return e(t);
    };
    if (r.version = "0.8.0", r.removed = [], !t || !t.document || 9 !== t.document.nodeType) return r.isSupported = !1, 
    r;
    var n = t.document, a = n, i = t.DocumentFragment, o = t.HTMLTemplateElement, l = t.NodeFilter, s = t.NamedNodeMap || t.MozNamedAttrMap, f = t.Text, c = t.Comment, u = t.DOMParser;
    if ("function" == typeof o) {
        var d = n.createElement("template");
        d.content && d.content.ownerDocument && (n = d.content.ownerDocument);
    }
    var m = n.implementation, p = n.createNodeIterator, h = n.getElementsByTagName, v = n.createDocumentFragment, g = a.importNode, y = {};
    r.isSupported = "undefined" != typeof m.createHTMLDocument && 9 !== n.documentMode;
    var b = function(e, t) {
        for (var r = t.length; r--; ) "string" == typeof t[r] && (t[r] = t[r].toLowerCase()), 
        e[t[r]] = !0;
        return e;
    }, T = function(e) {
        var r, t = {};
        for (r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
        return t;
    }, x = null, k = b({}, [ "a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "svg", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feMerge", "feMergeNode", "feMorphology", "feOffset", "feSpecularLighting", "feTile", "feTurbulence", "math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmuliscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mpspace", "msqrt", "mystyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "#text" ]), A = null, w = b({}, [ "accept", "action", "align", "alt", "autocomplete", "background", "bgcolor", "border", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "coords", "datetime", "default", "dir", "disabled", "download", "enctype", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "ismap", "label", "lang", "list", "loop", "low", "max", "maxlength", "media", "method", "min", "multiple", "name", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "span", "srclang", "start", "src", "step", "style", "summary", "tabindex", "title", "type", "usemap", "valign", "value", "width", "xmlns", "accent-height", "accumulate", "additivive", "alignment-baseline", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "clip", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "fill", "fill-opacity", "fill-rule", "filter", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "image-rendering", "in", "in2", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "mode", "min", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "specularconstant", "specularexponent", "spreadmethod", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "surfacescale", "targetx", "targety", "transform", "text-anchor", "text-decoration", "text-rendering", "textlength", "u1", "u2", "unicode", "values", "viewbox", "visibility", "vert-adv-y", "vert-origin-x", "vert-origin-y", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "y", "y1", "y2", "z", "zoomandpan", "accent", "accentunder", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "display", "displaystyle", "fence", "frame", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink" ]), E = null, S = null, M = !0, O = !1, L = !1, N = !1, D = /\{\{[\s\S]*|[\s\S]*\}\}/gm, _ = /<%[\s\S]*|[\s\S]*%>/gm, C = !1, z = !1, R = !1, F = !1, H = !0, B = !0, W = b({}, [ "audio", "head", "math", "script", "style", "svg", "video" ]), j = b({}, [ "audio", "video", "img", "source" ]), G = b({}, [ "alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "summary", "title", "value", "style", "xmlns" ]), I = null, q = n.createElement("form"), P = function(e) {
        "object" != typeof e && (e = {}), x = "ALLOWED_TAGS" in e ? b({}, e.ALLOWED_TAGS) : k, 
        A = "ALLOWED_ATTR" in e ? b({}, e.ALLOWED_ATTR) : w, E = "FORBID_TAGS" in e ? b({}, e.FORBID_TAGS) : {}, 
        S = "FORBID_ATTR" in e ? b({}, e.FORBID_ATTR) : {}, M = e.ALLOW_DATA_ATTR !== !1, 
        O = e.ALLOW_UNKNOWN_PROTOCOLS || !1, L = e.SAFE_FOR_JQUERY || !1, N = e.SAFE_FOR_TEMPLATES || !1, 
        C = e.WHOLE_DOCUMENT || !1, z = e.RETURN_DOM || !1, R = e.RETURN_DOM_FRAGMENT || !1, 
        F = e.RETURN_DOM_IMPORT || !1, H = e.SANITIZE_DOM !== !1, B = e.KEEP_CONTENT !== !1, 
        N && (M = !1), R && (z = !0), e.ADD_TAGS && (x === k && (x = T(x)), b(x, e.ADD_TAGS)), 
        e.ADD_ATTR && (A === w && (A = T(A)), b(A, e.ADD_ATTR)), B && (x["#text"] = !0), 
        Object && "freeze" in Object && Object.freeze(e), I = e;
    }, U = function(e) {
        r.removed.push({
            element: e
        });
        try {
            e.parentNode.removeChild(e);
        } catch (t) {
            e.outerHTML = "";
        }
    }, V = function(e, t) {
        r.removed.push({
            attribute: t.getAttributeNode(e),
            from: t
        }), t.removeAttribute(e);
    }, K = function(e) {
        var t, r;
        try {
            t = new u().parseFromString(e, "text/html");
        } catch (n) {}
        return t && t.documentElement || (t = m.createHTMLDocument(""), r = t.body, r.parentNode.removeChild(r.parentNode.firstElementChild), 
        r.outerHTML = e), "function" == typeof t.getElementsByTagName ? t.getElementsByTagName(C ? "html" : "body")[0] : h.call(t, C ? "html" : "body")[0];
    }, J = function(e) {
        return p.call(e.ownerDocument || e, e, l.SHOW_ELEMENT | l.SHOW_COMMENT | l.SHOW_TEXT, function() {
            return l.FILTER_ACCEPT;
        }, !1);
    }, Q = function(e) {
        return e instanceof f || e instanceof c ? !1 : !("string" == typeof e.nodeName && "string" == typeof e.textContent && "function" == typeof e.removeChild && e.attributes instanceof s && "function" == typeof e.removeAttribute && "function" == typeof e.setAttribute);
    }, X = function(e) {
        var t, r;
        if (ne("beforeSanitizeElements", e, null), Q(e)) return U(e), !0;
        if (t = e.nodeName.toLowerCase(), ne("uponSanitizeElement", e, {
            tagName: t
        }), !x[t] || E[t]) {
            if (B && !W[t] && "function" == typeof e.insertAdjacentHTML) try {
                e.insertAdjacentHTML("AfterEnd", e.innerHTML);
            } catch (n) {}
            return U(e), !0;
        }
        return !L || e.firstElementChild || e.content && e.content.firstElementChild || (e.innerHTML = e.textContent.replace(/</g, "&lt;")), 
        N && 3 === e.nodeType && (r = e.textContent, r = r.replace(D, " "), r = r.replace(_, " "), 
        e.textContent = r), ne("afterSanitizeElements", e, null), !1;
    }, Y = /^data-[\-\w.\u00B7-\uFFFF]/, Z = /^(?:(?:(?:f|ht)tps?|mailto|tel):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i, $ = /^(?:\w+script|data):/i, ee = /[\x00-\x20\xA0\u1680\u180E\u2000-\u2029\u205f\u3000]/g, te = function(e) {
        var r, a, i, o, l, s, f, c;
        if (ne("beforeSanitizeAttributes", e, null), s = e.attributes) {
            for (f = {
                attrName: "",
                attrValue: "",
                keepAttr: !0
            }, c = s.length; c--; ) if (r = s[c], a = r.name, i = r.value, o = a.toLowerCase(), 
            f.attrName = o, f.attrValue = i, f.keepAttr = !0, ne("uponSanitizeAttribute", e, f), 
            i = f.attrValue, "name" === o && "IMG" === e.nodeName && s.id ? (l = s.id, s = Array.prototype.slice.apply(s), 
            V("id", e), V(a, e), s.indexOf(l) > c && e.setAttribute("id", l.value)) : ("id" === a && e.setAttribute(a, ""), 
            V(a, e)), f.keepAttr && (!H || "id" !== o && "name" !== o || !(i in t || i in n || i in q)) && (N && (i = i.replace(D, " "), 
            i = i.replace(_, " ")), A[o] && !S[o] && (G[o] || Z.test(i.replace(ee, "")) || "src" === o && 0 === i.indexOf("data:") && j[e.nodeName.toLowerCase()]) || M && Y.test(o) || O && !$.test(i.replace(ee, "")))) try {
                e.setAttribute(a, i);
            } catch (u) {}
            ne("afterSanitizeAttributes", e, null);
        }
    }, re = function(e) {
        var t, r = J(e);
        for (ne("beforeSanitizeShadowDOM", e, null); t = r.nextNode(); ) ne("uponSanitizeShadowNode", t, null), 
        X(t) || (t.content instanceof i && re(t.content), te(t));
        ne("afterSanitizeShadowDOM", e, null);
    }, ne = function(e, t, n) {
        y[e] && y[e].forEach(function(e) {
            e.call(r, t, n, I);
        });
    };
    return r.sanitize = function(e, n) {
        var o, l, s, f, c;
        if (e || (e = ""), "string" != typeof e) {
            if ("function" != typeof e.toString) throw new TypeError("toString is not a function");
            e = e.toString();
        }
        if (!r.isSupported) return "object" == typeof t.toStaticHTML || "function" == typeof t.toStaticHTML ? t.toStaticHTML(e) : e;
        if (P(n), r.removed = [], !z && !C && -1 === e.indexOf("<")) return e;
        if (o = K(e), !o) return z ? null : "";
        for (f = J(o); l = f.nextNode(); ) 3 === l.nodeType && l === s || X(l) || (l.content instanceof i && re(l.content), 
        te(l), s = l);
        if (z) {
            if (R) for (c = v.call(o.ownerDocument); o.firstChild; ) c.appendChild(o.firstChild); else c = o;
            return F && (c = g.call(a, c, !0)), c;
        }
        return C ? o.outerHTML : o.innerHTML;
    }, r.addHook = function(e, t) {
        "function" == typeof t && (y[e] = y[e] || [], y[e].push(t));
    }, r.removeHook = function(e) {
        y[e] && y[e].pop();
    }, r.removeHooks = function(e) {
        y[e] && (y[e] = []);
    }, r.removeAllHooks = function() {
        y = [];
    }, r;
}), String.prototype.endsWith || (String.prototype.endsWith = function(searchString, position) {
    var subjectString = this.toString();
    ("number" != typeof position || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) && (position = subjectString.length), 
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return -1 !== lastIndex && lastIndex === position;
}), jQuery.fn.outerHTML = function(arg) {
    var ret;
    return this.length ? arg ? (jQuery.each(this, function(i, el) {
        var fnRet, pass = el, inOrOut = el.outerHTML ? "outerHTML" : "innerHTML";
        el.outerHTML || (el = jQuery(el).wrap("<div>").parent()[0]), jQuery.isFunction(arg) ? (fnRet = arg.call(pass, i, el[inOrOut])) !== !1 && (el[inOrOut] = fnRet) : el[inOrOut] = arg, 
        el.outerHTML || jQuery(el).children().unwrap();
    }), this) : this[0].outerHTML || (ret = this.wrap("<div>").parent().html(), this.unwrap(), 
    ret) : "undefined" == typeof arg ? this : null;
}, Oskari = function() {
    var isDebug = !1, _markers = [];
    return {
        VERSION: "1.41.0",
        setDebugMode: function(d) {
            isDebug = !!d;
        },
        isDebug: function() {
            return isDebug;
        },
        setMarkers: function(markers) {
            _markers = markers || [];
        },
        getMarkers: function() {
            return _markers;
        },
        getDefaultMarker: function() {
            return _markers.length >= 3 ? _markers[2] : _markers[0];
        }
    };
}(), function(o) {
    var serials = {}, count = 0;
    o.seq = {
        nextVal: function(type) {
            return type ? (serials[type] ? serials[type] += 1 : serials[type] = 1, serials[type]) : count++;
        }
    };
}(Oskari), function() {
    var hasConsole = window.console, inclTimestamp = !1, _logMsg = function(args) {
        var level = args.shift();
        hasConsole && window.console[level] && window.console[level].apply && window.console[level].apply(window.console, args);
    }, _unshift = function(addToFirst, list) {
        var args = Array.prototype.slice.call(list);
        return args.unshift(addToFirst), args;
    }, ts = function() {
        if (!inclTimestamp) return "";
        var date = new Date();
        return date.toLocaleTimeString() + "." + date.getUTCMilliseconds() + " ";
    }, _doLogging = function(logName, logLevel, logMessages, includeCaller, callee) {
        var header = ts() + logName + ":", newArgs = _unshift(header, logMessages);
        newArgs = _unshift(logLevel, newArgs), includeCaller && callee && callee.caller && newArgs.push(callee.caller), 
        _logMsg(newArgs, callee);
    }, Logger = function(name, enableDebug, inclCaller) {
        this.name = name || "Logger", this.isDebug = !!enableDebug, this.includeCaller = !!inclCaller;
    };
    Logger.prototype.setInclCaller = function(bln) {
        this.includeCaller = !!bln;
    }, Logger.prototype.enableDebug = function(bln) {
        this.isDebug = !!bln;
    }, Logger.prototype.debug = function() {
        this.isDebug && _doLogging(this.name, "debug", arguments, this.includeCaller, arguments.callee);
    }, Logger.prototype.info = function() {
        _doLogging(this.name, "log", arguments, this.includeCaller, arguments.callee);
    }, Logger.prototype.warn = function() {
        _doLogging(this.name, "warn", arguments, this.includeCaller, arguments.callee);
    }, Logger.prototype.error = function() {
        _doLogging(this.name, "error", arguments, this.includeCaller, arguments.callee);
    };
    var loggers = {};
    Oskari.log = function(logName) {
        if (logName = logName || "Oskari", loggers[logName]) return loggers[logName];
        var log = new Logger(logName);
        return loggers[logName] = log, log;
    };
}(), function(o) {
    var noop = function() {
        return !0;
    }, setterGetter = function(collection, key, value, defaultValue, validator) {
        if (collection) {
            if (key && value) {
                var currentValue = collection[key];
                return validator(value, currentValue) ? (collection[key] = value, !0) : !1;
            }
            if (key) return collection[key] || (collection[key] = defaultValue(key)), collection[key];
            var result = [];
            for (var prop in collection) result.push(prop);
            return result;
        }
    }, Storage = function(methodName, options) {
        "string" != typeof methodName && (options = methodName, methodName = null), methodName = methodName || "data", 
        "object" != typeof options && (options = {});
        var _collection = {}, _me = {
            reset: function(key) {
                key ? delete _collection[key] : _collection = {};
            }
        }, defaultValue = options.defaultValue;
        "function" != typeof defaultValue && (defaultValue = noop);
        var validator = options.validator;
        return "function" != typeof validator && (validator = noop), _me[methodName] = function(key, value) {
            return setterGetter(_collection, key, value, defaultValue, validator);
        }, _me;
    };
    o.createStore = function(methodName, options) {
        return new Storage(methodName, options);
    };
}(Oskari), function(o) {
    if (o && !o.on) {
        var log = Oskari.log("Events"), EventBus = function() {
            var store = o.createStore("subscribers", {
                defaultValue: function() {
                    return [];
                }
            });
            return {
                on: function(event, handlerFn) {
                    if ("function" != typeof handlerFn) return !1;
                    var list = store.subscribers(event);
                    return list.push(handlerFn), log.debug("Subscriber added for " + event), store.subscribers(event, list);
                },
                off: function(event, handlerFn) {
                    for (var currentSubs = store.subscribers(event), success = !1, n = 0; n < currentSubs.length; n++) if (currentSubs[n] === handlerFn) {
                        currentSubs.splice(n, 1), success = !0;
                        break;
                    }
                    return log.debug("Subscriber removed for " + event), success;
                },
                trigger: function(event, data) {
                    var currentSubs = store.subscribers(event), count = 0;
                    return currentSubs.forEach(function(sub) {
                        try {
                            sub(data, event), count++;
                        } catch (e) {
                            log.warn("Error notifying about " + event, e);
                        }
                    }), log.debug("Triggered " + event + " - subscribers: " + count), count;
                }
            };
        };
        o.makeObservable = function(target) {
            var bus = new EventBus();
            return target ? (target.on = bus.on, target.off = bus.off, target.trigger = bus.trigger, 
            target) : bus;
        }, o.makeObservable(o);
    }
}(Oskari), Oskari.util = function() {
    function isLeadingZero(value) {
        return "string" == typeof value && value.length > 0 && "0" === value[0] ? !(util.isDecimal(value) && value.length > 1 && "." === value[1]) : !1;
    }
    var log = Oskari.log("Oskari.util"), util = {};
    util.isNumber = function(value, keepLeadingZero) {
        if (null === value) return !1;
        var i, reg = new RegExp("^[-+]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$"), isNumber = !0;
        if ("object" == typeof value) for (i = 0; i < value.length; i++) {
            if (keepLeadingZero && keepLeadingZero === !0 && isLeadingZero(value[i] + "")) {
                isNumber = !1;
                break;
            }
            if (reg.test(value[i]) === !1) {
                isNumber = !1;
                break;
            }
        } else isNumber = keepLeadingZero && keepLeadingZero === !0 && isLeadingZero(value + "") ? !1 : reg.test(value);
        return isNumber;
    }, util.isDecimal = function(value) {
        var i, s, val, isDecimal = !0;
        if (!value || null === value || "" === value) return !1;
        if ("object" == typeof value) for (i = 0; i < value.length && (val = String(value[i]), 
        s = val.split("."), isDecimal = !(2 !== s.length || isLeadingZero(val) || isNaN(s[0]) || isNaN(s[1])), 
        isDecimal !== !1); i++) ; else val = value + "", s = val.split("."), isDecimal = 2 === s.length && !isNaN(s[0]) && !isNaN(s[1]) && (isLeadingZero(s[0]) && 1 == s[0].length || !isLeadingZero(s[0]));
        return isDecimal;
    }, util.decimals = function(value) {
        var val, maxDecimals = 0;
        if (!value || null === value || "" === value || isNaN(value) && "object" != typeof value) return null;
        if ("object" == typeof value) {
            for (i = 0; i < value.length; i++) val = value[i] + "", val = val.split("."), 2 === val.length && maxDecimals < val[1].length && (maxDecimals = val[1].length);
            return maxDecimals;
        }
        return val = value + "", val = val.split("."), 2 === val.length ? val[1].length : 0;
    }, util.hexToRgb = function(hex) {
        var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }, util.rgbToHex = function(rgb) {
        if ("#" === rgb.charAt(0)) return rgb.substring(1);
        var j, parts = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        for (delete parts[0], j = 1; 3 >= j; j += 1) parts[j] = parseInt(parts[j], 10).toString(16), 
        1 === parts[j].length && (parts[j] = "0" + parts[j]);
        return parts.join("");
    }, util.keyExists = function(obj, keypath) {
        for (var tmpObj = obj, cnt = 0, splits = keypath.split("."), i = 0; tmpObj && i < splits.length; i++) splits[i] in tmpObj && (tmpObj = tmpObj[splits[i]], 
        cnt++);
        return cnt === splits.length;
    }, util.naturalSort = function(valueA, valueB, descending) {
        var oFxNcL, oFyNcL, re = /(^([+\-]?(?:\d*)(?:\.\d*)?(?:[eE][+\-]?\d+)?)?$|^0x[\da-fA-F]+$|\d+)/g, sre = /^\s+|\s+$/g, snre = /\s+/g, dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/, hre = /^0x[0-9a-f]+$/i, ore = /^0/, i = function(s) {
            return ("" + s).toLowerCase().replace(sre, "");
        }, x = i(valueA) || "", y = i(valueB) || "", xN = x.replace(re, "\x00$1\x00").replace(/\0$/, "").replace(/^\0/, "").split("\x00"), yN = y.replace(re, "\x00$1\x00").replace(/\0$/, "").replace(/^\0/, "").split("\x00"), xD = parseInt(x.match(hre), 16) || 1 !== xN.length && Date.parse(x), yD = parseInt(y.match(hre), 16) || xD && y.match(dre) && Date.parse(y) || null, normChunk = function(s, l) {
            return (!s.match(ore) || 1 == l) && parseFloat(s) || s.replace(snre, " ").replace(sre, "") || 0;
        }, sortFunc = function(oFxNcL, oFyNcL) {
            return isNaN(oFxNcL) !== isNaN(oFyNcL) ? (retValue = isNaN(oFxNcL) ? 1 : -1, !0) : (typeof oFxNcL != typeof oFyNcL && (oFxNcL += "", 
            oFyNcL += ""), oFyNcL > oFxNcL ? (retValue = -1, !0) : oFxNcL > oFyNcL ? (retValue = 1, 
            !0) : void 0);
        }, retValue = 0, sortCompleted = !1;
        if (yD && (yD > xD ? (retValue = -1, sortCompleted = !0) : xD > yD && (retValue = 1, 
        sortCompleted = !0)), !sortCompleted) for (var cLoc = 0, xNl = xN.length, yNl = yN.length, numS = Math.max(xNl, yNl); numS > cLoc && (oFxNcL = normChunk(xN[cLoc] || "", xNl), 
        oFyNcL = normChunk(yN[cLoc] || "", yNl), !(sortCompleted = sortFunc(oFxNcL, oFyNcL))); cLoc++) ;
        return descending && (retValue = -1 * retValue), retValue;
    }, util.getColorBrightness = function(color) {
        var r, g, b, brightness;
        return color.match(/^rgb/) ? (color = color.match(/rgba?\(([^)]+)\)/)[1], color = color.split(/ *, */).map(Number), 
        r = color[0], g = color[1], b = color[2]) : "#" == color[0] && 7 == color.length ? (r = parseInt(color.slice(1, 3), 16), 
        g = parseInt(color.slice(3, 5), 16), b = parseInt(color.slice(5, 7), 16)) : "#" == color[0] && 4 == color.length && (r = parseInt(color[1] + color[1], 16), 
        g = parseInt(color[2] + color[2], 16), b = parseInt(color[3] + color[3], 16)), brightness = (299 * r + 587 * g + 114 * b) / 1e3, 
        125 > brightness ? "dark" : "light";
    }, util.isDarkColor = function(color) {
        return "dark" === this.getColorBrightness(color);
    }, util.isLightColor = function(color) {
        return "light" === this.getColorBrightness(color);
    }, util.isMobile = function() {
        var md = new MobileDetect(window.navigator.userAgent), mobileDefs = {
            width: 500,
            height: 400
        }, size = {
            height: jQuery(window).height(),
            width: jQuery(window).width()
        }, isSizeMobile = !1;
        (size.width <= mobileDefs.width || size.height <= mobileDefs.height) && (isSizeMobile = !0);
        var isMobile = null !== md.mobile() ? !0 : isSizeMobile;
        return isMobile;
    }, util.sanitize = function(content) {
        return DOMPurify.sanitize(content, {
            SAFE_FOR_JQUERY: !0,
            ADD_ATTR: [ "target" ]
        });
    };
    var validCoordinates = function(point) {
        return point || "object" == typeof point || !isNaN(point.length) || 2 === point.length;
    }, coordChars = {
        CHAR_DEG: "°",
        CHAR_MIN: "'",
        CHAR_SEC: '"',
        CHAR_SEP: " "
    }, coordinateDMSDecode = function(value) {
        "number" == typeof value && (value = "" + value), value = value.replace(Oskari.getDecimalSeparator(), "."), 
        value = value.replace(",", ".");
        var patterns = {
            "DDMMSS.s": "(-?\\d+)[" + coordChars.CHAR_DEG + "d]\\s*(\\d+)" + coordChars.CHAR_MIN + "\\s*(\\d+(?:\\.\\d+)?)" + coordChars.CHAR_SEC,
            "DDMM.mmm 1": "(-?\\d+)[" + coordChars.CHAR_DEG + "d]\\s*(\\d+(?:\\.\\d+)?)[" + coordChars.CHAR_MIN + "]\\s*",
            "DDMM.mmm 2": "(-?\\d+)[" + coordChars.CHAR_DEG + "d]\\s*(\\d+(?:\\.\\d+)?)\\s*",
            "DD.ddddd": "(\\d+(?:\\.\\d+)?)[" + coordChars.CHAR_DEG + "d]\\s*"
        };
        for (var key in patterns) if (patterns.hasOwnProperty(key) && value.match(new RegExp(patterns[key]))) return log.debug("Coordinate match to pattern " + key), 
        value.match(new RegExp(patterns[key]));
        return log.debug("Coordinate not match to any patterns"), null;
    };
    return util.coordinateMetricToDegrees = function(point, decimals) {
        var roundToDecimals = decimals || 0;
        if (roundToDecimals > 20 && (roundToDecimals = 20), validCoordinates(point)) {
            var dms1 = NaN;
            if (coordinateDMSDecode(point[0])) dms1 = point[0]; else {
                var p1 = parseFloat(point[0]), d1 = 0 | p1, m1 = 60 * (p1 - d1) | 0, s1 = 3600 * (p1 - d1 - m1 / 60);
                s1 = parseFloat(s1).toFixed(roundToDecimals), s1 = "" + s1, s1 = s1.replace(".", Oskari.getDecimalSeparator()), 
                dms1 = d1 + coordChars.CHAR_DEG + coordChars.CHAR_SEP + m1 + coordChars.CHAR_MIN + coordChars.CHAR_SEP + s1 + coordChars.CHAR_SEC;
            }
            var dms2 = NaN;
            if (coordinateDMSDecode(point[1])) dms2 = point[1]; else {
                var p2 = parseFloat(point[1]), d2 = 0 | p2, m2 = 60 * (p2 - d2) | 0, s2 = 3600 * (p2 - d2 - m2 / 60);
                s2 = parseFloat(s2).toFixed(roundToDecimals), s2 = "" + s2, s2 = s2.replace(".", Oskari.getDecimalSeparator()), 
                dms2 = d2 + coordChars.CHAR_DEG + coordChars.CHAR_SEP + m2 + coordChars.CHAR_MIN + coordChars.CHAR_SEP + s2 + coordChars.CHAR_SEC;
            }
            return [ dms1, dms2 ];
        }
        return [ NaN, NaN ];
    }, util.coordinateDegreesToMetric = function(point, decimals) {
        var roundToDecimals = decimals || 0;
        if (roundToDecimals > 20 && (roundToDecimals = 20), validCoordinates(point)) {
            var dd1 = NaN, matches1 = coordinateDMSDecode(point[0]);
            if (matches1) {
                var d1 = parseFloat(matches1[1]), m1 = parseFloat(matches1[2]), s1 = parseFloat(matches1[3]);
                isNaN(d1) || isNaN(m1) || isNaN(s1) ? isNaN(d1) || isNaN(m1) ? isNaN(d1) || (dd1 = parseFloat(d1).toFixed(roundToDecimals)) : dd1 = parseFloat(d1 + m1 / 60).toFixed(roundToDecimals) : dd1 = parseFloat(d1 + m1 / 60 + s1 / 3600).toFixed(roundToDecimals);
            }
            var dd2 = NaN, matches2 = coordinateDMSDecode(point[1]);
            if (matches2) {
                var d2 = parseFloat(matches2[1]), m2 = parseFloat(matches2[2]), s2 = parseFloat(matches2[3]);
                isNaN(d2) || isNaN(m2) || isNaN(s2) ? isNaN(d2) || isNaN(m2) ? isNaN(d2) || (dd2 = parseFloat(d2).toFixed(roundToDecimals)) : dd2 = parseFloat(d2 + m2 / 60).toFixed(roundToDecimals) : dd2 = parseFloat(d2 + m2 / 60 + s2 / 3600).toFixed(roundToDecimals);
            }
            return [ dd1, dd2 ];
        }
        return [ NaN, NaN ];
    }, util.coordinateIsDegrees = function(point) {
        var matches1 = coordinateDMSDecode(point[0]), matches2 = coordinateDMSDecode(point[1]);
        return matches1 && matches2;
    }, util.getRequestParam = function(name, defaultValue) {
        var query = location.search.substr(1), result = {};
        return query.split("&").forEach(function(part) {
            var item = part.split("=");
            result[item[0]] = decodeURIComponent(item[1]);
        }), result[name] || defaultValue;
    }, util.isNumberBetween = function(num, start, stop) {
        return "number" != typeof num ? !1 : num >= start && stop >= num;
    }, util.arrayMove = function(array, from, to) {
        if (!array || !array.length || !array.splice) return !1;
        if (util.isNumberBetween(from, 0, array.length - 1) || (from = array.length - 1), 
        util.isNumberBetween(to, 0, array.length - 1) || (to = array.length - 1), from === to) return !1;
        if (Math.abs(from - to) > 60) array.splice(to, 0, array.splice(from, 1)[0]); else {
            for (var target = array[from], inc = (to - from) / Math.abs(to - from), current = from; current != to; current += inc) array[current] = array[current + inc];
            array[to] = target;
        }
        return !0;
    }, util;
}(), function(O) {
    var oskariLang = "en", localizations = {}, supportedLocales = null;
    O.setSupportedLocales = function(locales) {
        if (locales) {
            if (!Array.isArray(locales)) throw new TypeError("setSupportedLocales(): locales is not an array");
            supportedLocales = locales;
        }
    }, O.getSupportedLocales = function() {
        return supportedLocales || [];
    }, O.setLang = function(lang) {
        lang && (oskariLang = lang);
    }, O.getLang = function() {
        return oskariLang || "en";
    }, O.getSupportedLanguages = function() {
        var locale, i, langs = [], supported = O.getSupportedLocales();
        for (i = 0; i < supported.length; i += 1) locale = supported[i], langs.push(locale.substring(0, locale.indexOf("_")));
        return langs;
    }, O.getDefaultLanguage = function() {
        var supported = O.getSupportedLocales();
        if (0 === supported.length) return this.getLang();
        var locale = supported[0];
        return -1 !== locale.indexOf("_") ? locale.substring(0, locale.indexOf("_")) : this.getLang();
    };
    var setLocalization = function(lang, key, value) {
        if (null === lang || void 0 === lang) throw new TypeError("setLocalization(): Missing lang");
        if (null === key || void 0 === key) throw new TypeError("setLocalization(): Missing key");
        localizations[lang] || (localizations[lang] = {}), localizations[lang][key] = value;
    };
    O.getLocalization = function(key, lang, fallbackToDefault) {
        var l = lang || oskariLang;
        if (null === key || void 0 === key) throw new TypeError("getLocalization(): Missing key");
        if (!localizations) return null;
        if (localizations[l] && localizations[l][key]) return localizations[l][key];
        var defaultLang = O.getDefaultLanguage();
        return fallbackToDefault && localizations[defaultLang] && localizations[defaultLang][key] ? localizations[defaultLang][key] : null;
    }, O.registerLocalization = function(props, override) {
        var p, pp, loc;
        if (null === props || void 0 === props) throw new TypeError("registerLocalization(): Missing props");
        if (props.length) for (p = 0; p < props.length; p += 1) pp = props[p], override && override === !0 ? (pp.key && pp.lang && (loc = O.getLocalization(pp.key, pp.lang)), 
        loc && null !== loc && (pp.value = jQuery.extend(!0, {}, loc, pp.value))) : (pp.key && pp.lang && (loc = O.getLocalization(pp.key, pp.lang)), 
        loc && null !== loc && (pp.value = jQuery.extend(!0, {}, pp.value, loc))), setLocalization(pp.lang, pp.key, pp.value); else override && override === !0 ? (props.key && props.lang && (loc = O.getLocalization(props.key, props.lang)), 
        loc && null !== loc && (props.value = jQuery.extend(!0, {}, loc, props.value))) : (props.key && props.lang && (loc = O.getLocalization(props.key, props.lang)), 
        loc && null !== loc && (props.value = jQuery.extend(!0, {}, props.value, loc))), 
        setLocalization(props.lang, props.key, props.value);
    };
    var decimalSeparator;
    O.setDecimalSeparator = function(separator) {
        separator && (decimalSeparator = separator);
    }, O.getDecimalSeparator = function() {
        return decimalSeparator || ",";
    }, O.getLocalized = function(locale, lang) {
        if ("object" != typeof locale) return locale;
        lang || (lang = Oskari.getLang());
        var value = locale[lang];
        if (value || (value = locale[Oskari.getDefaultLanguage()]), !value) for (var key in locale) if (locale[key]) return locale[key];
        return value;
    };
}(Oskari), function(o) {
    function getClazzByNameAndType(name, type) {
        var typeNames = clazzes[type];
        if (typeNames || (clazzes[type] = {}, typeNames = clazzes[type]), typeNames[name]) return typeNames[name];
        log.debug("Updating metadata for " + type);
        var allKnownClassesOfType = Oskari.clazz.protocol(type);
        for (var clazzName in allKnownClassesOfType) if (allKnownClassesOfType.hasOwnProperty(clazzName)) {
            var clazzDefinition = allKnownClassesOfType[clazzName], requestName = clazzDefinition._class.prototype.getName();
            typeNames[requestName] = clazzName;
        }
        return log.debug("Finished updating metadata for " + type), typeNames[name];
    }
    if (o && !o.requestBuilder) {
        var log = Oskari.log("Messages"), clazzes = {};
        o.requestBuilder = function(name) {
            var qname = getClazzByNameAndType(name, "Oskari.mapframework.request.Request");
            return qname ? o.getSandbox().hasHandler(name) ? Oskari.clazz.builder(qname) : void log.warn("Request " + name + " defined, but handler not registered. Perhaps timing issue?") : void log.warn("No builder found for", name);
        }, o.eventBuilder = function(name) {
            var qname = getClazzByNameAndType(name, "Oskari.mapframework.event.Event");
            return qname ? Oskari.clazz.builder(qname) : void log.warn("No builder found for", name);
        };
    }
}(Oskari), function(o) {
    var O2ClassSystem = function() {
        this.packages = {}, this.protocols = {}, this.inheritance = {}, this.aspects = {}, 
        this.classcache = {}, this.globals = {};
    };
    O2ClassSystem.prototype = {
        purge: function() {},
        protocol: function(protocolName) {
            if (null === protocolName || void 0 === protocolName) throw new TypeError("protocol(): Missing protocolName");
            return this.protocols[protocolName];
        },
        _getPackageDefinition: function(packageName) {
            var packageDefinition = this.packages[packageName];
            return packageDefinition || (packageDefinition = {}, this.packages[packageName] = packageDefinition), 
            packageDefinition;
        },
        _getClassQName: function(className) {
            var parts = className.split(".");
            return {
                basePkg: parts[0],
                pkg: parts[1],
                sp: parts.slice(2).join(".")
            };
        },
        _getClassInfo: function(className) {
            var packageDefinition, classInfo = this.classcache[className], classQName = this._getClassQName(className);
            return classInfo || (packageDefinition = this._getPackageDefinition(classQName.pkg), 
            classInfo = packageDefinition[classQName.sp], this.classcache[className] = classInfo), 
            classInfo;
        },
        _cloneProperties: function(from, to) {
            var i, propertyName, propertyValue, toArray = Array.isArray(to) ? to : [ to ];
            for (propertyName in from) if (from.hasOwnProperty(propertyName)) for (propertyValue = from[propertyName], 
            i = toArray.length - 1; i >= 0; i -= 1) toArray[i][propertyName] = propertyValue;
        },
        _createEmptyClassDefinition: function() {
            var ret = function() {};
            return ret.prototype = {}, ret;
        },
        getMetadata: function(className) {
            var classInfo;
            if (null === className || void 0 === className) throw new TypeError("metadata(): Missing className");
            if (classInfo = this._getClassInfo(className), !classInfo) throw "Class " + className + " does not exist";
            return classInfo._metadata;
        },
        _updateMetadata: function(basePkg, pkg, sp, classInfo, classMeta) {
            var protocols, p, pt, className;
            if (classInfo._metadata || (classInfo._metadata = {}), classInfo._metadata.meta = classMeta, 
            className = [ basePkg, pkg, sp ].join("."), protocols = classMeta.protocol) for (p = 0; p < protocols.length; p += 1) pt = protocols[p], 
            this.protocols[pt] || (this.protocols[pt] = {}), this.protocols[pt][className] = classInfo;
        },
        _super: function(supCat, supMet) {
            var me = this;
            return function() {
                return me._._superCategory[supCat][supMet].apply(me, arguments);
            };
        },
        define: function(className, classConstructor, prototype, metadata) {
            var classDefinition, classQName, composition, packageDefinition, classInfo, e, extnds, superClass;
            if (null === className || void 0 === className) throw new TypeError("define(): Missing className");
            if ("function" != typeof classConstructor) throw new TypeError("define(): classConstructor is not a function");
            if (prototype && "object" != typeof prototype) throw new TypeError("define(): Prototype is not an object");
            if (classQName = this._getClassQName(className), packageDefinition = this._getPackageDefinition(classQName.pkg), 
            classInfo = packageDefinition[classQName.sp], classInfo || (classDefinition = this._createEmptyClassDefinition(), 
            composition = {
                className: className,
                superClass: null,
                subClass: null
            }, classInfo = {
                _class: classDefinition,
                _constructor: classConstructor,
                _category: {},
                _composition: composition
            }, classDefinition.prototype._ = classInfo, classDefinition.prototype._super = this._super, 
            this.inheritance[className] = composition, packageDefinition[classQName.sp] = classInfo), 
            classConstructor && (classInfo._constructor = classConstructor), prototype && (this._cloneProperties(prototype, classInfo._class.prototype), 
            classInfo._category[className] = prototype), metadata) {
                for (extnds = metadata.extend, e = 0; extnds && e < extnds.length; e += 1) superClass = this.lookup(extnds[e]), 
                superClass._composition.subClass || (superClass._composition.subClass = {}), superClass._composition.subClass[className] = classInfo, 
                classInfo._composition.superClass = superClass;
                this._updateMetadata(classQName.basePkg, classQName.pkg, classQName.sp, classInfo, metadata);
            }
            return this._pullDown(classInfo), this._pushDown(classInfo), classInfo;
        },
        category: function(className, categoryName, prototype) {
            var classDefinition, classInfo, classQName, composition, packageDefinition, prot;
            if (null === className || void 0 === className) throw new TypeError("category(): Missing className");
            return classQName = this._getClassQName(className), packageDefinition = this._getPackageDefinition(classQName.pkg), 
            classInfo = packageDefinition[classQName.sp], classInfo || (classDefinition = this._createEmptyClassDefinition(), 
            composition = {
                className: className,
                superClass: null,
                subClass: null
            }, classInfo = {
                _class: classDefinition,
                _constructor: categoryName,
                _category: {},
                _composition: composition
            }, classDefinition.prototype._ = classInfo, classDefinition.prototype._super = this._super, 
            this.inheritance[className] = composition, packageDefinition[classQName.sp] = classInfo), 
            prot = classInfo._class.prototype, this._cloneProperties(prototype, prot), prototype && (classInfo._category[categoryName] = prototype), 
            this._pullDown(classInfo), this._pushDown(classInfo), classInfo;
        },
        lookup: function(className, constructor) {
            var classDefinition, classQName, composition, packageDefinition, classInfo;
            if (null === className || void 0 === className) throw new TypeError("lookup(): Missing className");
            return classQName = this._getClassQName(className), packageDefinition = this._getPackageDefinition(classQName.pkg), 
            classInfo = packageDefinition[classQName.sp], classInfo || (classDefinition = this._createEmptyClassDefinition(), 
            composition = {
                className: className,
                superClass: null,
                subClass: null
            }, classInfo = {
                _class: classDefinition,
                _constructor: constructor,
                _category: {},
                _composition: composition
            }, this.inheritance[className] = composition, packageDefinition[classQName.sp] = classInfo), 
            classInfo;
        },
        extend: function(subClassName, superClassName) {
            var superClass, subClass;
            if (null === subClassName || void 0 === subClassName) throw new TypeError("extend(): Missing subClassName");
            if (null === superClassName || void 0 === superClassName) throw new TypeError("extend(): Missing superClassName");
            return superClass = this.lookup(superClassName), subClass = this.lookup(subClassName), 
            superClass._composition.subClass || (superClass._composition.subClass = {}), superClass._composition.subClass[subClassName] = subClass, 
            subClass._composition.superClass = superClass, this._pullDown(subClass), subClass;
        },
        _pushDown: function(classInfo) {
            var subName, pdefsub;
            if (null === classInfo || void 0 === classInfo) throw new TypeError("_pushDown(): Missing classInfo");
            if (classInfo._composition.subClass) {
                for (subName in classInfo._composition.subClass) classInfo._composition.subClass.hasOwnProperty(subName) && (pdefsub = classInfo._composition.subClass[subName], 
                this._pullDown(pdefsub), this._pushDown(pdefsub));
                return classInfo;
            }
        },
        _pullDown: function(classInfo) {
            var i, category, clazz, classHierarchy, className, classConstructor, classMethods, classPrototype, prototype, superClassInfo;
            if (null === classInfo || void 0 === classInfo) throw new TypeError("_pullDown(): Missing classInfo");
            if (classInfo._composition.superClass) {
                for (classHierarchy = [], classHierarchy.push(classInfo), superClassInfo = classInfo; ;) {
                    if (superClassInfo = superClassInfo._composition.superClass, !superClassInfo) break;
                    classHierarchy.push(superClassInfo);
                }
                for (classInfo._constructors = [], classInfo._superCategory = {}, classPrototype = classInfo._class.prototype, 
                i = classHierarchy.length - 1; i >= 0; i -= 1) {
                    clazz = classHierarchy[i], className = clazz._composition.className, classConstructor = clazz._constructor, 
                    classInfo._constructors.push(classConstructor), classMethods = {};
                    for (category in clazz._category) clazz._category.hasOwnProperty(category) && (prototype = clazz._category[category], 
                    this._cloneProperties(prototype, [ classPrototype, classMethods ]));
                    classInfo._superCategory[className] = classMethods;
                }
                return classInfo;
            }
        },
        _slicer: Array.prototype.slice,
        create: function(className) {
            var classInfo, classInstance, constructors, i, instanceArguments;
            if (null === className || void 0 === className) throw new TypeError("create(): Missing className");
            if (instanceArguments = this._slicer.apply(arguments, [ 1 ]), classInfo = this._getClassInfo(className), 
            !classInfo) throw 'Class "' + className + '" does not exist';
            if (classInstance = new classInfo._class(), constructors = classInfo._constructors) for (i = 0; i < constructors.length; i += 1) {
                if (null === constructors[i] || void 0 === constructors[i]) throw new Error("Class " + className + " is missing super constructor " + (i + 1) + "/" + constructors.length);
                var returned = constructors[i].apply(classInstance, instanceArguments);
                returned && (classInstance = returned);
            } else {
                var returned = classInfo._constructor.apply(classInstance, instanceArguments);
                returned && (classInstance = returned);
            }
            return classInstance;
        },
        createWithClassInfo: function(classInfo, instanceArguments) {
            var classInstance, constructors, i;
            if (null === classInfo || void 0 === classInfo) throw new TypeError("createWithClassInfo(): Missing classInfo");
            if (classInstance = new classInfo._class(), constructors = classInfo._constructors) for (i = 0; i < constructors.length; i += 1) {
                if (null === constructors[i] || void 0 === constructors[i]) throw new Error('createWithClassInfo(): Undefined constructor in class "' + classInfo._composition.className + '"');
                constructors[i].apply(classInstance, instanceArguments);
            } else classInfo._constructor.apply(classInstance, instanceArguments);
            return classInstance;
        },
        builder: function(className) {
            var classInfo;
            if (null === className || void 0 === className) throw new TypeError("builder(): Missing className");
            if (classInfo = this._getClassInfo(className), !classInfo) throw 'Class "' + className + '" does not exist';
            return this.getBuilderFromClassInfo(classInfo);
        },
        getBuilderFromClassInfo: function(classInfo) {
            if (null === classInfo || void 0 === classInfo) throw new TypeError("getBuilderFromClassInfo(): Missing classInfo");
            return classInfo._builder ? classInfo._builder : (classInfo._builder = function() {
                var i, classInstance = new classInfo._class(), constructors = classInfo._constructors, instanceArguments = arguments;
                if (constructors) for (i = 0; i < constructors.length; i += 1) constructors[i].apply(classInstance, instanceArguments); else classInfo._constructor.apply(classInstance, instanceArguments);
                return classInstance;
            }, classInfo._builder);
        },
        _global: function(key, value) {
            return void 0 === key ? this.globals : (void 0 !== value && (this.globals[key] = value), 
            this.globals[key]);
        }
    }, o.clazz = new O2ClassSystem();
}(Oskari), function(o) {
    if (o && o.clazz) {
        var log = Oskari.log("Oskari.bundle_manager"), class_singleton = o.clazz, cs = class_singleton, Bundle_manager = function() {
            this.clazz = o.clazz;
            var me = this;
            me.serial = 0, me.bundleDefinitions = {}, me.sources = {}, me.bundleInstances = {}, 
            me.bundles = {}, me.bundleDefinitionStates = {}, me.bundleSourceStates = {}, me.bundleStates = {}, 
            me.loaderStateListeners = [];
        };
        Bundle_manager.prototype = {
            _getSerial: function() {
                return this.serial += 1, this.serial;
            },
            _purge: function() {
                var p, me = this;
                for (p in me.sources) me.sources.hasOwnProperty(p) && delete me.sources[p];
                for (p in me.bundleDefinitionStates) me.bundleDefinitionStates.hasOwnProperty(p) && delete me.bundleDefinitionStates[p].loader;
                for (p in me.bundleSourceStates) me.bundleSourceStates.hasOwnProperty(p) && delete me.bundleSourceStates[p].loader;
            },
            _install: function(biid, bundleDefinition, srcFiles, bundleMetadata) {
                var me = this, defState = me.bundleDefinitionStates[biid];
                defState ? (defState.state = 1, log.debug("SETTING STATE FOR BUNDLEDEF " + biid + " existing state to " + defState.state)) : (defState = {
                    state: 1
                }, me.bundleDefinitionStates[biid] = defState, log.debug("SETTING STATE FOR BUNDLEDEF " + biid + " NEW state to " + defState.state)), 
                defState.metadata = bundleMetadata, me.bundleDefinitions[biid] = bundleDefinition, 
                me.sources[biid] = srcFiles;
            },
            installBundleClass: function(biid, className) {
                var clazz = Oskari.clazz.create(className);
                clazz && Oskari.bundle(biid, {
                    clazz: clazz,
                    metadata: cs.getMetadata(className).meta
                });
            },
            installBundleClassInfo: function(biid, classInfo) {
                var bundleDefinition = cs.getBuilderFromClassInfo(classInfo), bundleMetadata = classInfo._metadata, sourceFiles = {};
                if (null === biid || void 0 === biid) throw new TypeError("installBundleClassInfo(): Missing biid");
                if (null === classInfo || void 0 === classInfo) throw new TypeError("installBundleClassInfo(): Missing classInfo");
                this._install(biid, bundleDefinition, sourceFiles, bundleMetadata);
            },
            createBundle: function(biid, bid) {
                var bundle, bundleDefinition, bundleDefinitionState, me = this;
                if (null === biid || void 0 === biid) throw new TypeError("createBundle(): Missing biid");
                if (null === bid || void 0 === bid) throw new TypeError("createBundle(): Missing bid");
                if (bundleDefinitionState = me.bundleDefinitionStates[biid], !bundleDefinitionState) throw new Error("createBundle(): Couldn't find a definition for bundle " + biid + "/" + bid + ", check spelling and that the bundle has been installed.");
                return (bundleDefinition = this.bundleDefinitions[biid]) ? (bundle = bundleDefinition(bundleDefinitionState), 
                this.bundles[bid] = bundle, this.bundleStates[bid] = {
                    state: !0,
                    bundlImpl: biid
                }, bundle) : void alert("this.bundleDefinitions[" + biid + "] is null!");
            },
            createInstance: function(bid) {
                var bundle, bundleInstance, bundleInstanceId, me = this;
                if (null === bid || void 0 === bid) throw new TypeError("createInstance(): Missing bid");
                if (!me.bundleStates[bid] || !me.bundleStates[bid].state) throw new Error("createInstance(): Couldn't find a definition for bundle " + bid + ", check spelling and that the bundle has been installed.");
                if (bundle = this.bundles[bid], null === bundle || void 0 === bundle) throw new Error("createInstance(): Couldn't find bundle with id" + bid);
                if (bundleInstance = bundle.create(), null === bundleInstance || void 0 === bundleInstance) throw new Error("createInstance(): Couldn't create bundle " + bid + " instance. Make sure your bundle's create function returns the instance.");
                return bundleInstanceId = me._getSerial().toString(), this.bundleInstances[bundleInstanceId] = bundleInstance, 
                bundleInstance;
            },
            _destroyInstance: function(biid) {
                var bundleInstance;
                if (null === biid || void 0 === biid) throw new TypeError("_destroyInstance(): Missing biid");
                return bundleInstance = this.bundleInstances[biid], this.bundleInstances[biid] = null, 
                bundleInstance = null;
            }
        }, o.bundle_manager = new Bundle_manager();
    }
}(Oskari), Oskari.clazz.define("Oskari.mapframework.domain.User", function(userData) {
    this._loggedIn = !1, this._roles = [], userData && (this._firstName = userData.firstName, 
    this._lastName = userData.lastName, this._nickName = userData.nickName, this._email = userData.email || userData.loginName, 
    this._uuid = userData.userUUID, this._roles = userData.roles || [], userData.userUUID && (this._loggedIn = !0), 
    this._apiKey = userData.apikey);
}, {
    getName: function() {
        return this._firstName + " " + this._lastName;
    },
    getFirstName: function() {
        return this._firstName;
    },
    getLastName: function() {
        return this._lastName;
    },
    getNickName: function() {
        return this._nickName;
    },
    getLoginName: function() {
        return this.getEmail();
    },
    getEmail: function() {
        return this._email;
    },
    getUuid: function() {
        return this._uuid;
    },
    getAPIkey: function() {
        return this._apiKey;
    },
    isLoggedIn: function() {
        return this._loggedIn;
    },
    getRoles: function() {
        return this._roles;
    },
    hasRole: function(idList) {
        if ("number" == typeof idList && (idList = [ idList ]), !idList || "function" != typeof idList.forEach) return !1;
        var found = !1, userRoles = this.getRoles();
        return userRoles.forEach(function(role) {
            -1 !== idList.indexOf(role.id) && (found = !0);
        }), found;
    }
}), function(o) {
    if (o) {
        var defaultName = "sandbox", getName = function(name) {
            return name || defaultName;
        }, sandboxStore = o.createStore({
            defaultValue: function(sandboxName) {
                var sb = o.clazz.create("Oskari.Sandbox", getName(sandboxName));
                return sb;
            }
        });
        o.getSandbox = function(name) {
            return sandboxStore.data(getName(name));
        };
    }
}(Oskari), function(Oskari) {
    var user, ajaxUrl, log, services = {}, requestHandlers = {}, isDebugMode = !1;
    Oskari.clazz.define("Oskari.Sandbox", function(name) {
        var postFix = "";
        "sandbox" !== name && (postFix = "." + name), log = Oskari.log("Sandbox" + postFix);
        var me = this;
        this._map = Oskari.clazz.create("Oskari.mapframework.domain.Map", this), this.handleMapLinkParams(), 
        me._listeners = [], me._modules = [], me._modulesByName = {}, me._statefuls = {}, 
        me.requestEventLog = [], me.requestEventStack = [], me.maxGatheredRequestsAndEvents = 4096, 
        me.requestAndEventGather = [], me._eventLoopGuard = 0;
    }, {
        getLog: function() {
            return log;
        },
        hasHandler: function(requestName) {
            return !!requestHandlers[requestName];
        },
        debug: function(setDebug) {
            return "undefined" == typeof setDebug ? isDebugMode : (isDebugMode = !!setDebug, 
            log.enableDebug(isDebugMode), isDebugMode);
        },
        setUser: function(userData) {
            user = Oskari.clazz.create("Oskari.mapframework.domain.User", userData);
        },
        getUser: function() {
            return user || this.setUser(), user;
        },
        setAjaxUrl: function(pUrl) {
            ajaxUrl = pUrl;
        },
        getAjaxUrl: function(route) {
            return route ? ajaxUrl + "action_route=" + route : ajaxUrl;
        },
        registerService: function(service) {
            services[service.getQName()] = service;
        },
        getService: function(type) {
            return services[type];
        },
        registerAsStateful: function(pBundleId, pInstance) {
            this._statefuls[pBundleId] = pInstance;
        },
        unregisterStateful: function(pBundleId) {
            this._statefuls[pBundleId] = null, delete this._statefuls[pBundleId];
        },
        getStatefulComponents: function() {
            return this._statefuls;
        },
        register: function(module) {
            return this._modules.push(module), this._modulesByName[module.getName()] = module, 
            module.init(this);
        },
        unregister: function(module) {
            var m, me = this, remainingModules = [];
            for (m = 0; m < me._modules.length; m += 1) module !== me._modules[m] && remainingModules.push(me._modules[m]);
            me._modules = remainingModules, me._modulesByName[module.getName()] = void 0, delete me._modulesByName[module.getName()];
        },
        registerForEventByName: function(module, eventName) {
            log.debug("#*#*#* Sandbox is registering module '" + module.getName() + "' to event '" + eventName + "'");
            var oldListeners = this._listeners[eventName];
            null !== oldListeners && void 0 !== oldListeners || (oldListeners = [], this._listeners[eventName] = oldListeners), 
            oldListeners.push(module), log.debug("There are currently " + oldListeners.length + " listeners for event '" + eventName + "'");
        },
        unregisterFromEventByName: function(module, eventName) {
            log.debug("Sandbox is unregistering module '" + module.getName() + "' from event '" + eventName + "'");
            var d, oldListeners = this._listeners[eventName], deleteIndex = -1;
            if (null === oldListeners || void 0 === oldListeners) return void log.debug("Module does not listen to that event, skipping.");
            for (d = 0; d < oldListeners.length; d += 1) if (oldListeners[d] === module) {
                deleteIndex = d;
                break;
            }
            deleteIndex > -1 ? (oldListeners.splice(deleteIndex, 1), log.debug("Module unregistered successfully from event")) : log.debug("Module does not listen to that event, skipping.");
        },
        request: function(creator, request) {
            var creatorComponent, creatorName = null, rv = null;
            if (null === creator || void 0 === creator) throw new TypeError("sandbox.request(): missing creator.");
            if (creatorName = null !== creator.getName && void 0 !== creator.getName ? creator.getName() : creator, 
            creatorComponent = this.findRegisteredModuleInstance(creatorName), null === creatorComponent || void 0 === creatorComponent) throw "Attempt to create request with unknown component '" + creator + "' as creator";
            return request._creator = creatorName, this.debug() && this._pushRequestAndEventGather(creatorName + "->Sandbox: ", request.getName()), 
            this._debugPushRequest(creatorName, request), rv = this.processRequest(request), 
            this._debugPopRequest(), rv;
        },
        processRequest: function(request) {
            var requestName = request.getName(), handlerClsInstance = this.requestHandler(requestName);
            return handlerClsInstance && "function" == typeof handlerClsInstance.handleRequest ? void handlerClsInstance.handleRequest.apply(handlerClsInstance, [ void 0, request ]) : void log.warn("No handler for request", requestName);
        },
        requestByName: function(creator, requestName, requestArgs) {
            log.debug("#!#!#! --------------> requestByName " + requestName);
            var requestBuilder = Oskari.requestBuilder(requestName), request = requestBuilder.apply(this, requestArgs || []);
            return this.request(creator, request);
        },
        postMasterComponent: "postmaster",
        postRequestByName: function(requestName, requestArgs) {
            var me = this, requestBuilder = Oskari.requestBuilder(requestName);
            return requestBuilder && this.hasHandler(requestName) ? void window.setTimeout(function() {
                var request = requestBuilder.apply(me, requestArgs || []), creatorComponent = me.postMasterComponent, rv = null;
                request._creator = creatorComponent, me.debug() && me._pushRequestAndEventGather(creatorComponent + "->Sandbox: ", request.getName()), 
                me.debug() && me._debugPushRequest(creatorComponent, request), rv = me.processRequest(request), 
                me.debug() && me._debugPopRequest();
            }, 0) : void log.warn("Trying to post request", requestName, "that is undefined or missing a handler. Skipping!");
        },
        _findModulesInterestedIn: function(event) {
            var eventName = event.getName(), currentListeners = this._listeners[eventName];
            return currentListeners ? currentListeners : [];
        },
        notifyAll: function(event, retainEvent) {
            var eventName;
            retainEvent || (eventName = event.getName(), log.debug("Sandbox received notifyall for event '" + eventName + "'"));
            var i, module, modules = this._findModulesInterestedIn(event);
            for (retainEvent || log.debug("Found " + modules.length + " interested modules"), 
            i = 0; i < modules.length; i += 1) module = modules[i], retainEvent || (log.debug("Notifying module '" + module.getName() + "'."), 
            this.debug() && this._pushRequestAndEventGather("Sandbox->" + module.getName() + ":", eventName)), 
            this._debugPushEvent(event._creator || "NA", module, event), module.onEvent(event), 
            this._debugPopEvent();
            retainEvent || delete event;
        },
        findRegisteredModuleInstance: function(name) {
            return name ? this._modulesByName[name] : this._modulesByName;
        },
        getBrowserWindowSize: function() {
            var width = jQuery(window).width(), size = {};
            return size.height = jQuery(window).height(), size.width = width, log.debug("Got browser window size is: width: " + size.width + " px, height:" + size.height + " px."), 
            size;
        },
        requestHandler: function(requestName, handler) {
            return "undefined" == typeof handler ? requestHandlers[requestName] : (requestHandlers[requestName] && null !== handler && log.warn("Overwriting request handler!!"), 
            void (requestHandlers[requestName] = handler));
        },
        _debugPushRequest: function(creator, req) {
            if (this.debug()) {
                var reqLog = {
                    from: creator,
                    reqName: req.getName()
                };
                this.requestEventStack.push(reqLog), this.requestEventLog.push(reqLog), this.requestEventLog.length > 64 && this.requestEventLog.shift();
            }
        },
        _debugPopRequest: function() {
            this.debug() && this.requestEventStack.pop();
        },
        _debugPushEvent: function(creator, target, evt) {
            if (this.debug()) {
                if (this._eventLoopGuard += 1, this._eventLoopGuard > 64) throw "Events Looped?";
                var evtLog = {
                    from: creator,
                    to: target.getName(),
                    evtName: evt.getName()
                };
                this.requestEventStack.push(evtLog), this.requestEventLog.push(evtLog), this.requestEventLog.length > 64 && this.requestEventLog.shift();
            }
        },
        _debugPopEvent: function() {
            this.debug() && (this._eventLoopGuard -= 1, this.requestEventStack.pop());
        },
        _pushRequestAndEventGather: function(name, request) {
            var module = {};
            module.name = name, module.request = request, this.requestAndEventGather.push(module), 
            this.requestAndEventGather.length > this.maxGatheredRequestsAndEvents && this.requestAndEventGather.shift();
        },
        popUpSeqDiagram: function() {
            var openedWindow, x, seq_html = '<html>  <head></head>  <body>    <div class="wsd" wsd_style="modern-blue">      <pre>', seq_commands = "";
            for (x in this.requestAndEventGather) this.requestAndEventGather.hasOwnProperty(x) && (seq_commands += this.requestAndEventGather[x].name + this.requestAndEventGather[x].request + "\n");
            "" !== seq_commands ? (seq_html += seq_commands + '</pre>\n    </div>    <script type="text/javascript"> /* This part of code getted in here: http://www.websequencediagrams.com/service.js */ (function(){// The script locationvar ScriptSrc = (function() {var src;var i;var scripts = document.getElementsByTagName("script"),script = scripts[scripts.length - 1];if (script.getAttribute.length !== undefined) {src = script.src;} else {src = script.getAttribute("src", -1);}return src;}());function GetScriptHostname(){// Returns script protocol, hostname and port.var regex = /(https?://[^/]+)/;var m = regex.exec(ScriptSrc);if ( m && m.length > 1 ) {return m[1];} else {return "error";}}function BitWriter(){// encodes as URL-BASE64this.str = "";this.partial = 0;this.partialSize = 0;this.table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";this.addBits = function( bits, size ){this.partial = (this.partial << size) | bits;this.partialSize += size;while ( this.partialSize >= 6 ) {this.str += this.table.charAt((this.partial >>(this.partialSize - 6)) & 0x3f);this.partialSize -= 6;}};this.finish = function() {if ( this.partialSize ) {this.str += this.table.charAt(( this.partial << ( 6 - this.partialSize ) ) & 0x3f );this.partialSize = 0;this.partial = 0;}};}function encodeBase64(str){var writer = new BitWriter();for (var n = 0; n < str.length; n++) {writer.addBits( str.charCodeAt( n ), 8 );}writer.finish();return writer.str;}function encodeUtf8(string) {// fronm http://www.webtoolkit.info/string = string.replace(/\r\n/g,"\n");var utftext = "";for (var n = 0; n < string.length; n++) {var c = string.charCodeAt(n);if (c < 128) {utftext += String.fromCharCode(c);}else if((c > 127) && (c < 2048)) {utftext += String.fromCharCode((c >> 6) | 192);utftext += String.fromCharCode((c & 63) | 128);}else {utftext += String.fromCharCode((c >> 12) | 224);utftext += String.fromCharCode(((c >> 6) & 63) | 128);utftext += String.fromCharCode((c & 63) | 128);}}return utftext;}function encodeNumber(num){// encodes a number in only as many bytes as required, 7 bits at a time.// bit 8 is used to indicate whether another byte follows.if ( num >= 0x3FFF ) {return String.fromCharCode( 0x80 | ( (num >> 14) & 0x7f ) ) +String.fromCharCode( 0x80 | ( (num >>  7) & 0x7f ) ) +String.fromCharCode( num & 0x7f );} else if ( num >= 0x7F ) {return String.fromCharCode( 0x80 | ( (num >>  7) & 0x7f ) ) +String.fromCharCode( num & 0x7f );} else {return String.fromCharCode( num );}}function encodeLz77( input ){var MinStringLength = 4;var output = "";var pos = 0;var hash = {};// set last pos to just after the last chunk.var lastPos = input.length - MinStringLength;for ( var i = MinStringLength; i < input.length; i++ ) {var subs = input.substr(i-MinStringLength, MinStringLength);if ( hash[subs] === undefined ) {hash[subs] = [];}hash[subs].push( i-MinStringLength );//document.write("subs[" + subs + "]=" + (pos - MinStringLength) + "<br>");}// loop until pos reaches the last chunk.while (pos < lastPos) {// search start is the current position minus the window size, capped// at the beginning of the string.var matchLength = MinStringLength;var foundMatch = false;var bestMatch = {distance: 0, length: 0};var prefix = input.substr(pos, MinStringLength);var matches = hash[prefix];// loop until the end of the matched region reaches the current// position.//while ((searchStart + matchLength) < pos) {if ( matches !== undefined ) {for ( var i = 0; i < matches.length; i++ ) {var searchStart = matches[i];if ( searchStart + matchLength >= pos ) {break;}while( searchStart + matchLength < pos ) {// check if string matches.var isValidMatch = ((input.substr(searchStart, matchLength) == input.substr(pos, matchLength)));if (isValidMatch) {// we found at least one match. try for a larger one.var realMatchLength = matchLength;matchLength++;if (foundMatch && (realMatchLength > bestMatch.length)) {bestMatch.distance = pos - searchStart - realMatchLength;bestMatch.length = realMatchLength;}foundMatch = true;} else {break;}}}}if (bestMatch.length) {output += String.fromCharCode( 0 ) +encodeNumber(bestMatch.distance) +encodeNumber(bestMatch.length);pos += bestMatch.length;} else {if (input.charCodeAt(pos) !== 0) {output += input.charAt(pos);} else {output += String.fromCharCode( 0 ) +String.fromCharCode( 0 );}pos++;}}return output + input.slice(pos).replace(/\x00/g, "\x00\x00");}function getText( node ){var text = "";for( var i = 0; i < node.childNodes.length; i++ ) {var child = node.childNodes[i];if ( child.nodeType == 3 ) {text += child.data;} else {text += getText( child );}}return text;}function process(divs) {var hostname = GetScriptHostname();for ( var i = 0; i < divs.length; i++ ) {if ( divs[i].className == "wsd" && !divs[i].wsd_processed ) {divs[i].wsd_processed = true;var style = "";if ( divs[i].attributes["wsd_style"] ) {style = "&s=" + divs[i].attributes["wsd_style"].value;}var text = encodeBase64( encodeLz77( encodeUtf8( getText( divs[i] ) ) ) );var str = hostname + "/cgi-bin/cdraw?" +"lz=" + text + style;if ( true || str.length < 2048 ) {for( var j = divs[i].childNodes.length-1; j >= 0; j-- ) {divs[i].removeChild( divs[i].childNodes[j] );}var img = document.createElement("img");img.setAttribute("src", str);divs[i].appendChild( img );} else {divs[i].insertBefore( document.createTextNode("Diagram too large for web service."), divs[i].firstChild );}}}}process( document.getElementsByTagName("div") );process( document.getElementsByTagName("span") );})();    </script>  </body></html>', 
            openedWindow = window.open(), openedWindow.document.write(seq_html), this.requestAndEventGather = []) : alert("No requests in queue");
        },
        getLocalizedProperty: function(property, lang) {
            var ret, supportedLocales, i, language = lang || Oskari.getLang();
            if (null === property || void 0 === property) return null;
            if ("object" == typeof property) {
                if (ret = property[language], null === ret) for (supportedLocales = Oskari.getSupportedLocales(), 
                i = 0; i < supportedLocales.length && !(ret = property[supportedLocales[i]]); i += 1) ;
                return ret;
            }
            return property;
        },
        createURL: function(baseUrl, prepQueryString) {
            if (!baseUrl) return null;
            var url = this.__constructUrl(baseUrl);
            return prepQueryString && (url = this.__prepareQueryString(url)), url;
        },
        __constructUrl: function(baseUrl) {
            if (-1 !== baseUrl.indexOf("://")) return baseUrl;
            if (0 === baseUrl.indexOf("//")) return window.location.protocol + baseUrl;
            var serverUrl = window.location.protocol + "//" + window.location.host;
            return 0 === baseUrl.indexOf("/") ? serverUrl + baseUrl : serverUrl + window.location.pathname + "/" + baseUrl;
        },
        __prepareQueryString: function(url) {
            if (!url) return null;
            -1 === url.indexOf("?") && (url += "?");
            var lastChar = url.charAt(url.length - 1);
            return "&" !== lastChar && "?" !== lastChar && (url += "&"), url;
        }
    });
}(Oskari), Oskari.clazz.category("Oskari.Sandbox", "state-methods", {
    registerAsStateful: function(pBundleId, pInstance) {
        this._statefuls[pBundleId] = pInstance;
    },
    unregisterStateful: function(pBundleId) {
        this._statefuls[pBundleId] = null, delete this._statefuls[pBundleId];
    },
    getStatefulComponents: function() {
        return this._statefuls;
    },
    getCurrentState: function() {
        var bundleid, state = {}, components = this.getStatefulComponents();
        for (bundleid in components) components.hasOwnProperty(bundleid) && (components[bundleid].getState ? state[bundleid] = {
            state: components[bundleid].getState()
        } : Oskari.log("Sandbox").warn("Stateful component " + bundleid + " doesnt have getState()"));
        return state;
    },
    resetState: function() {
        this.useState(Oskari.app.getConfiguration());
    },
    useState: function(initialConf) {
        var bundleState, bundle, bundleid, newStateConfig = jQuery.extend(!0, {}, initialConf), components = this.getStatefulComponents();
        for (bundleid in components) components.hasOwnProperty(bundleid) && (bundle = components[bundleid], 
        bundle.setState && (bundleState = newStateConfig[bundleid] ? newStateConfig[bundleid].state : {}, 
        bundle.setState(bundleState)));
    },
    setSessionExpiring: function(minutes, callback) {
        if ("number" == typeof minutes && "function" == typeof callback) {
            var milliSeconds = 6e4 * minutes;
            setTimeout(function() {
                callback();
            }, milliSeconds);
        }
    },
    extendSession: function(errorCallback) {
        var url = this.getAjaxUrl() + "action_route=GetCurrentUser", currentUuid = this.getUser().getUuid(), successCallback = function(res, textStatus, jqXHR) {
            var resUuid = jqXHR.getResponseHeader("currentUserUid");
            resUuid !== currentUuid && errorCallback();
        };
        this.ajax(url, successCallback, errorCallback);
    }
}), Oskari.clazz.category("Oskari.Sandbox", "map-layer-methods", {
    findMapLayerFromAllAvailable: function(id, name) {
        return this.getService("Oskari.mapframework.service.MapLayerService").findMapLayer(id);
    },
    findAllSelectedMapLayers: function() {
        var layersList = this.getMap().getLayers();
        return layersList.slice(0);
    },
    findAllHighlightedLayers: function() {
        var layersList = this.getMap().getActivatedLayers();
        return layersList.slice(0);
    },
    findMapLayerFromSelectedMapLayers: function(layerId) {
        return this.getMap().getSelectedLayer(layerId);
    },
    isLayerAlreadySelected: function(id) {
        return this.getMap().isLayerSelected(id);
    },
    isMapLayerHighLighted: function(id) {
        return this.getMap().isLayerActivated(id);
    },
    allowMultipleHighlightLayers: function(allow) {
        this.getMap().allowMultipleActivatedLayers(allow);
    },
    removeMapLayer: function(layerId) {
        this.getMap().removeLayer(layerId);
    }
}), Oskari.clazz.category("Oskari.Sandbox", "map-methods", {
    getMap: function() {
        return this._map;
    },
    syncMapState: function(blnInitialMove, mapModule) {
        var mapDomain = this.getMap(), zoom = mapDomain.getZoom(), maxZoom = 13;
        mapModule && (maxZoom = mapModule.getMaxZoomLevel()), blnInitialMove === !0 && zoom == maxZoom && this.postRequestByName("MapMoveRequest", [ mapDomain.getX(), mapDomain.getY(), 0 ]), 
        this.postRequestByName("MapMoveRequest", [ mapDomain.getX(), mapDomain.getY(), zoom ]);
    },
    generateMapLinkParameters: function(options) {
        var components = this.getStatefulComponents(), iterator = null, component = null, optionsLinkParameterArray = [], componentLinkParameterArray = [];
        for (iterator in components) if (components.hasOwnProperty(iterator) && (component = components[iterator], 
        component.getStateParameters && "function" == typeof component.getStateParameters)) {
            var params = component.getStateParameters();
            params && componentLinkParameterArray.push(params);
        }
        options = options || {
            showMarker: !1,
            forceCache: !1,
            noSavedState: !1
        };
        for (iterator in options) options.hasOwnProperty(iterator) && optionsLinkParameterArray.push(iterator + "=" + (options[iterator] !== !1));
        return componentLinkParameterArray.concat(optionsLinkParameterArray).join("&") || null;
    }
}), Oskari.clazz.category("Oskari.Sandbox", "abstraction-methods", {
    domSelector: function(arg) {
        return jQuery(arg);
    },
    ajax: function(url, success, failure, data, complete) {
        var userIsLoggedIn = this.getUser().isLoggedIn();
        if (jQuery && jQuery.ajax) {
            var failureWrapper = function(jqXHR, textStatus, err) {
                403 === jqXHR.status && userIsLoggedIn ? alert("Session expired. Please log in again.") : failure(jqXHR, textStatus, err);
            }, type = "GET";
            data && (type = "POST"), jQuery.ajax({
                type: type,
                url: url,
                beforeSend: function(x) {
                    x && x.overrideMimeType && x.overrideMimeType("application/j-son;charset=UTF-8");
                },
                data: data,
                success: success,
                error: failureWrapper
            });
        } else failure();
    },
    getDefer: function() {
        var ret;
        return ret = window.Q && window.Q.defer ? window.Q.defer() : void 0;
    }
}), function(o) {
    if (o) {
        var _bundleRegistry = {};
        o.bundle = function(bundleId, value) {
            return value && (_bundleRegistry[bundleId] = value), _bundleRegistry[bundleId];
        };
    }
}(Oskari), function(o) {
    if (o) {
        o.loader;
        var log = Oskari.log("Loader"), linkFile = function(href, rel, type) {
            var importParentElement = document.head || document.body, linkElement = document.createElement("link");
            linkElement.rel = rel || "stylesheet", linkElement.type = type || "text/css", linkElement.href = href, 
            importParentElement.appendChild(linkElement);
        }, absolute = function(base, relative) {
            var stack = base.split("/"), parts = relative.split("/");
            stack.pop();
            for (var i = 0; i < parts.length; i++) "." != parts[i] && (".." == parts[i] ? stack.pop() : stack.push(parts[i]));
            return stack.join("/");
        }, getPath = function(base, src) {
            var path = src;
            return 0 !== src.indexOf("/") && (path = absolute(base, src)), path.split("//").join("/");
        }, loader = function(startupSequence, config) {
            var sequence = [];
            startupSequence && "function" == typeof startupSequence.slice ? sequence = startupSequence.slice(0) : log.warn("No startupsequence given to loader or sequence is not an array");
            var appConfig = config || {}, globalExpose = {}, result = {
                bundles: [],
                errors: []
            };
            return o.on("bundle.start", function(details) {
                result.bundles.push(details.id);
            }), o.on("bundle.err", function(details) {
                result.errors.push(details);
            }), {
                processSequence: function(done) {
                    var me = this;
                    if (0 === sequence.length) return "function" == typeof done && done(result), void o.trigger("app.start", result);
                    var seqToLoad = sequence.shift();
                    if ("object" != typeof seqToLoad) return log.warn("StartupSequence item is a " + typeof seqToLoad + " instead of object. Skipping"), 
                    void this.processSequence(done);
                    if ("object" != typeof seqToLoad.metadata || "object" != typeof seqToLoad.metadata["Import-Bundle"]) return log.warn('StartupSequence item doesn\'t contain the structure item.metadata["Import-Bundle"]. Skipping ', seqToLoad), 
                    void this.processSequence(done);
                    var bundleToStart = seqToLoad.bundlename;
                    if (!bundleToStart) return log.warn("StartupSequence item doesn't contain bundlename. Skipping ", seqToLoad), 
                    void this.processSequence(done);
                    var configId = seqToLoad.bundleinstancename || bundleToStart, config = appConfig[configId] || {}, bundlesToBeLoaded = seqToLoad.metadata["Import-Bundle"], paths = [], bundles = [];
                    for (var id in bundlesToBeLoaded) {
                        var value = bundlesToBeLoaded[id];
                        if ("object" == typeof value && "string" == typeof value.bundlePath) {
                            var basepath = value.bundlePath + "/" + id, path = basepath + "/bundle.js";
                            paths.push(path.split("//").join("/")), bundles.push({
                                id: id,
                                path: basepath
                            });
                        } else log.warn("StartupSequence import doesn't contain bundlePath. Skipping! Item is " + bundleToStart + " import is " + id);
                    }
                    return Oskari.bundle(bundleToStart) ? (log.debug("Bundle preloaded " + bundleToStart), 
                    me.startBundle(bundleToStart, config, configId), void this.processSequence(done)) : void require(paths, function() {
                        for (var i = 0; i < arguments.length; ++i) "undefined" != typeof arguments[i] && log.warn("Support for AMD-bundles is not yet implemented", arguments[i]);
                        log.debug("Loaded bundles", bundles), me.processBundleJS(bundles, function() {
                            me.startBundle(bundleToStart, config, configId), me.processSequence(done);
                        });
                    }, function(err) {
                        log.error("Error loading bundles for " + bundleToStart, err), me.processSequence(done);
                    });
                },
                startBundle: function(bundleId, config, instanceId) {
                    var bundle = Oskari.bundle(bundleId);
                    if (!bundle) throw new Error("Bundle not loaded " + bundleId);
                    var instance = bundle.clazz.create();
                    if (!instance) throw new Error("Couldn't create an instance of bundle " + bundleId);
                    instance.mediator = {
                        bundleId: bundleId,
                        instanceId: instanceId
                    };
                    for (var key in config) instance[key] = config[key];
                    log.debug("Starting bundle " + bundleId);
                    try {
                        instance.start(), Oskari.trigger("bundle.start", {
                            id: bundleId
                        });
                    } catch (err) {
                        throw Oskari.trigger("bundle.err", {
                            id: bundleId,
                            error: err
                        }), log.error("Couldn't start bundle with id " + bundleId + ". Error was: ", err), 
                        err;
                    }
                },
                processBundleJS: function(bundles, callback) {
                    var me = this, loading = [], done = function(id) {
                        var index = loading.indexOf(id);
                        loading.splice(index, 1), 0 === loading.length && callback();
                    };
                    bundles.forEach(function(item) {
                        var bundle = Oskari.bundle(item.id);
                        bundle.clazz && bundle.metadata && bundle.metadata.source && (loading.push(item.id), 
                        me.handleBundleLoad(item.path, bundle.metadata.source, function() {
                            done(item.id);
                        }));
                    });
                },
                handleBundleLoad: function(basePath, src, callback) {
                    var files = [];
                    src.locales && src.locales.forEach(function(file) {
                        if ((!file.lang || file.lang === Oskari.getLang()) && file.src.endsWith(".js")) {
                            var path = getPath(basePath, file.src);
                            files.push(path), file.expose && (globalExpose[path] = file.expose);
                        }
                    }), src.resources && src.resources.forEach(function(file) {
                        file.src.endsWith(".js") && files.push(getPath(basePath, file.src));
                    }), src.scripts && src.scripts.forEach(function(file) {
                        var path = getPath(basePath, file.src);
                        file.src.endsWith(".js") ? (files.push(path), file.expose && (globalExpose[path] = file.expose)) : file.src.endsWith(".css") && linkFile(path);
                    }), src.links && src.links.forEach(function(file) {
                        "import" === file.rel.toLowerCase() && linkFile(getPath(basePath, file.href), file.rel, "text/html");
                    }), require(files, function() {
                        for (var i = 0; i < arguments.length; ++i) if ("undefined" != typeof arguments[i]) {
                            var key = globalExpose[files[i]];
                            key ? window[key] = arguments[i] : log.warn('Support for AMD-files is not yet implemented. Bundles need to have an "expose" statement in bundle.js to register libs as globals.', files[i]);
                        }
                        callback();
                    }, function(err) {
                        log.error("Error loading files", files, err), callback();
                    });
                }
            };
        };
        loader.log = log, loader.linkFile = linkFile, o.loader = loader;
    }
}(Oskari), jQuery.ajaxSetup({
    cache: !1
}), function(o) {
    if (o) {
        var Bundle_facade = function() {
            this.appSetup = null, this.appConfig = {};
        };
        Bundle_facade.prototype = {
            getBundleInstanceConfigurationByName: function(biid) {
                return this.appConfig[biid];
            },
            playBundle: function(recData, config, callback) {
                if ("object" != typeof recData) throw new Error("Bundle def is not an object");
                if ("function" == typeof config && (callback = config, config = void 0), config) {
                    var configName = recData.bundleinstancename || recData.bundlename, tmp = {};
                    tmp[configName] = config, config = tmp;
                } else config = this.appConfig;
                var loader = Oskari.loader([ recData ], config);
                loader.processSequence(callback);
            },
            loadAppSetup: function(url, params, errorCB, successCB, modifyCB) {
                var me = this;
                jQuery.ajax({
                    type: "GET",
                    dataType: "json",
                    data: params || {},
                    url: url,
                    success: function(setup) {
                        "function" == typeof modifyCB && modifyCB(setup), me.setApplicationSetup(setup), 
                        me.startApplication(successCB);
                    },
                    error: function(jqXHR) {
                        "function" == typeof errorCB && errorCB(jqXHR);
                    }
                });
            },
            setApplicationSetup: function(setup) {
                this.appSetup = setup, setup.configuration && this.setConfiguration(setup.configuration), 
                setup.env = setup.env || {}, "function" == typeof Oskari.setLang && Oskari.setLang(setup.env.lang || window.language), 
                "function" == typeof Oskari.setSupportedLocales && Oskari.setSupportedLocales(setup.env.locales), 
                "function" == typeof Oskari.setDecimalSeparator && Oskari.setDecimalSeparator(setup.env.decimalSeparator), 
                "function" == typeof Oskari.setMarkers && Oskari.setMarkers(setup.env.svgMarkers || []);
            },
            getApplicationSetup: function() {
                return this.appSetup;
            },
            setConfiguration: function(config) {
                this.appConfig = config;
            },
            getConfiguration: function() {
                return this.appConfig;
            },
            startApplication: function(callback) {
                var loader = Oskari.loader(this.appSetup.startupSequence, this.appConfig);
                loader.processSequence(callback);
            },
            stopApplication: function() {
                throw new Error("Not supported");
            }
        }, o.app = new Bundle_facade();
    }
}(Oskari), function(o) {
    var cs = o.clazz;
    cs.define("Oskari.ModuleSpec", function(classInfo, className) {
        this.cs = cs, this.classInfo = classInfo, this.className = className;
    }, {
        _slicer: Array.prototype.slice,
        category: function(prototype, categoryName) {
            var classInfo = cs.category(this.className, categoryName || [ "__", o.seq.nextVal("Category") ].join("_"), prototype);
            return this.classInfo = classInfo, this;
        },
        methods: function(prototype, categoryName) {
            var classInfo = cs.category(this.className, categoryName || [ "__", o.seq.nextVal("Category") ].join("_"), prototype);
            return this.classInfo = classInfo, this;
        },
        extend: function(clazz) {
            var classInfo;
            if (null === clazz || void 0 === clazz) throw new TypeError("extend(): Missing clazz");
            return classInfo = cs.extend(this.className, clazz.length ? clazz : [ clazz ]), 
            this.classInfo = classInfo, this;
        },
        create: function() {
            return cs.createWithClassInfo(this.classInfo, arguments);
        },
        name: function() {
            return this.className;
        },
        metadata: function() {
            return cs.getMetadata(this.className);
        },
        events: function(events) {
            var orgmodspec = this;
            return orgmodspec.category({
                eventHandlers: events,
                onEvent: function(event) {
                    var handler = this.eventHandlers[event.getName()];
                    if (handler) return handler.apply(this, [ event ]);
                }
            }, "___events"), orgmodspec;
        },
        requests: function(requests) {
            var orgmodspec = this;
            return orgmodspec.category({
                requestHandlers: requests,
                onRequest: function(request) {
                    var handler = this.requestHandlers[request.getName()];
                    return handler ? handler.apply(this, [ request ]) : void 0;
                }
            }, "___requests"), orgmodspec;
        },
        builder: function() {
            return cs.getBuilderFromClassInfo(this.classInfo);
        }
    });
}(Oskari), function(o) {
    if (o) {
        var _baseClassFor = {
            extension: "Oskari.userinterface.extension.EnhancedExtension",
            bundle: "Oskari.mapframework.bundle.extension.ExtensionBundle",
            tile: "Oskari.userinterface.extension.EnhancedTile",
            flyout: "Oskari.userinterface.extension.EnhancedFlyout",
            view: "Oskari.userinterface.extension.EnhancedView"
        }, bundleInstances = {};
        o.cls = function(className, constructor, proto, metas) {
            var classInfo;
            return className ? classInfo = o.clazz.lookup(className) : className = [ "Oskari", "_", o.seq.nextVal("Class") ].join("."), 
            classInfo && classInfo._constructor && !constructor || (classInfo = o.clazz.define(className, constructor || function() {}, proto, metas || {})), 
            o.clazz.create("Oskari.ModuleSpec", classInfo, className);
        }, o.loc = function() {
            return o.registerLocalization.apply(o, arguments);
        }, o.eventCls = function(eventName, constructor, proto) {
            var className, rv;
            if (null === eventName || void 0 === eventName) throw new TypeError("eventCls(): Missing eventName");
            return className = "Oskari.event.registry." + eventName, rv = o.cls(className, constructor, proto, {
                protocol: [ "Oskari.mapframework.event.Event" ]
            }), rv.category({
                getName: function() {
                    return eventName;
                }
            }, "___event"), rv.eventName = eventName, rv;
        }, o.requestCls = function(requestName, constructor, proto) {
            var className, rv;
            if (null === requestName || void 0 === requestName) throw new TypeError("requestCls(): Missing requestName");
            return className = "Oskari.request.registry." + requestName, rv = o.cls(className, constructor, proto, {
                protocol: [ "Oskari.mapframework.request.Request" ]
            }), rv.category({
                getName: function() {
                    return requestName;
                }
            }, "___request"), rv.requestName = requestName, rv;
        }, o.extensionCls = function(className) {
            if (null === className || void 0 === className) throw new TypeError("extensionCls(): Missing className");
            return o.cls(className).extend(_baseClassFor.extension);
        }, o.bundleCls = function(bundleId, className) {
            var rv;
            if (null === className || void 0 === className) throw new TypeError("bundleCls(): Missing className");
            return bundleId || (bundleId = [ "__", o.seq.nextVal("Bundle") ].join("_")), rv = o.cls(className, function() {}, {
                update: function() {}
            }, {
                protocol: [ "Oskari.bundle.Bundle", _baseClassFor.bundle ],
                manifest: {
                    "Bundle-Identifier": bundleId
                }
            }), bm.installBundleClassInfo(bundleId, rv.classInfo), rv.___bundleIdentifier = bundleId, 
            rv.loc = function(properties) {
                return properties.key = this.___bundleIdentifier, o.registerLocalization(properties), 
                rv;
            }, rv.start = function(instanceId) {
                var bundle, bundleInstance, configProps, ip, bid = this.___bundleIdentifier;
                if (o.app.bundles[bid] || (bundle = bm.createBundle(bid, bid), o.bundle(bid, bundle)), 
                bundleInstance = bm.createInstance(bid), bundleInstances[bid] = bundleInstance, 
                configProps = o.app.getBundleInstanceConfigurationByName(bid)) for (ip in configProps) configProps.hasOwnProperty(ip) && (bundleInstance[ip] = configProps[ip]);
                return bundleInstance.start(), bundleInstance;
            }, rv.stop = function() {
                var bundleInstance = bundleInstances[this.___bundleIdentifier];
                return bundleInstance.stop();
            }, rv;
        }, o.flyoutCls = function(className) {
            if (null === className || void 0 === className) throw new TypeError("flyoutCls(): Missing className");
            return o.cls(className).extend(_baseClassFor.flyout);
        }, o.tileCls = function(className) {
            if (null === className || void 0 === className) throw new TypeError("tileCls(): Missing className");
            return o.cls(className).extend(_baseClassFor.tile);
        }, o.viewCls = function(className) {
            if (null === className || void 0 === className) throw new TypeError("viewCls(): Missing className");
            return o.cls(className).extend(_baseClassFor.view);
        };
    }
}(Oskari), function(o) {
    var domMgr, log = Oskari.log("Oskari.deprecated"), warnMessagesSent = {}, warn = function(name) {
        warnMessagesSent[name] || (warnMessagesSent[name] = 0), warnMessagesSent[name]++, 
        warnMessagesSent[name] < 3 && log.warn("Oskari." + name + "() will be removed in future release. Remove calls to it.");
    }, mode = "default", dollarStore = o.createStore(), _ctrlKeyDown = !1, funcs = {
        setLoaderMode: function(m) {
            mode = m;
        },
        getLoaderMode: function() {
            return mode;
        },
        setPreloaded: function() {},
        purge: function() {},
        getDomManager: function() {
            return domMgr;
        },
        setDomManager: function(dm) {
            domMgr = dm;
        },
        $: function(name, value) {
            return dollarStore.data(name, value);
        },
        setSandbox: function(name, sandbox) {},
        ctrlKeyDown: function(isDown) {
            return "undefined" == typeof isDown ? _ctrlKeyDown : void (_ctrlKeyDown = !!isDown);
        }
    }, attachWarning = function(name) {
        return function() {
            return warn(name), funcs[name].apply(o, arguments);
        };
    };
    for (var key in funcs) o[key] = attachWarning(key);
}(Oskari), function(o) {
    var log = o.log("Sandbox.deprecated"), extraInfo = {
        addRequestHandler: "Use Sandbox.requestHandler(requestName, handlerInstance) instead.",
        removeRequestHandler: "Use Sandbox.requestHandler(requestName, null) instead.",
        isCtrlKeyDown: "It works on Openlayers 2 only.",
        getEventBuilder: "Use Oskari.eventBuilder() instead.",
        getRequestBuilder: "Use Oskari.requestBuilder() instead.",
        printDebug: "Use Oskari.log() instead.",
        printWarn: "Use Oskari.log() instead.",
        printError: "Use Oskari.log() instead."
    }, warnMessagesSent = {}, warn = function(name) {
        warnMessagesSent[name] || (warnMessagesSent[name] = 0), warnMessagesSent[name]++, 
        warnMessagesSent[name] < 3 && log.warn("Sandbox." + name + "() will be removed in future release.", extraInfo[name] || "Remove calls to it.");
    };
    Oskari.clazz.category("Oskari.Sandbox", "deprecated-sb-methods", {
        handleMapLinkParams: function() {
            warn("handleMapLinkParams"), log.debug("Checking if map is started with link...");
            var coord = o.util.getRequestParam("coord", null), zoomLevel = o.util.getRequestParam("zoomLevel", null);
            if (null !== coord && null !== zoomLevel) {
                var splittedCoord;
                if (coord.indexOf("_") >= 0) splittedCoord = coord.split("_"); else {
                    if (!(coord.indexOf("%20") >= 0)) return;
                    splittedCoord = coord.split("%20");
                }
                var longitude = splittedCoord[0], latitude = splittedCoord[1];
                if (null === longitude || null === latitude) return void log.debug("Could not parse link location. Skipping.");
                log.debug("This is startup by link, moving map..."), this.getMap().moveTo(longitude, latitude, zoomLevel);
            }
        },
        addRequestHandler: function(requestName, handlerInstance) {
            warn("addRequestHandler"), this.requestHandler(requestName, handlerInstance);
        },
        removeRequestHandler: function(requestName, handlerInstance) {
            warn("removeRequestHandler"), this.requestHandler(requestName, null);
        },
        isCtrlKeyDown: function() {
            return warn("isCtrlKeyDown"), Oskari.ctrlKeyDown();
        },
        getRequestBuilder: function(name) {
            return warn("getRequestBuilder"), Oskari.requestBuilder(name);
        },
        getEventBuilder: function(name) {
            return warn("getEventBuilder"), Oskari.eventBuilder(name);
        },
        printDebug: function() {
            warn("printDebug"), log.debug.apply(log, arguments);
        },
        printWarn: function() {
            warn("printWarn"), log.warn.apply(log, arguments);
        },
        printError: function() {
            warn("printError"), log.error.apply(log, arguments);
        }
    });
}(Oskari);
//# sourceMappingURL=bundle.js.map