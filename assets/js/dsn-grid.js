"use strict";
var wind = jQuery(window),
  body = jQuery("body"),
  dsnGrid = {
    isMobile: function () {
      var e =
        !(0 < arguments.length && void 0 !== arguments[0]) || arguments[0];
      return !!(
        navigator.userAgent.match(/Android/i) ||
        navigator.userAgent.match(/webOS/i) ||
        navigator.userAgent.match(/iPhone/i) ||
        navigator.userAgent.match(/iPad/i) ||
        navigator.userAgent.match(/iPod/i) ||
        navigator.userAgent.match(/BlackBerry/i) ||
        navigator.userAgent.match(/Windows Phone/i) ||
        navigator.userAgent.match(/Edge/i) ||
        navigator.userAgent.match(/MSIE 10/i) ||
        navigator.userAgent.match(/MSIE 9/i) ||
        (e && wind.width() <= 991)
      );
    },
    convertToJQuery: function (e) {
      return e instanceof jQuery == !1 ? jQuery(e) : e;
    },
    convertTextLine: function (e, t) {
      var n =
        !(2 < arguments.length && void 0 !== arguments[2]) || arguments[2];
      if (
        ((e = this.convertToJQuery(e)),
        (t = t || e),
        (t = this.convertToJQuery(t)),
        !(0 < e.find(".dsn-word-wrapper").length))
      ) {
        var o = e.text().replace(/\n/g, "").trim().split(" "),
          i = "";
        e.html("");
        var r = 0,
          a = 0,
          s = !0,
          l = !1,
          d = void 0;
        try {
          for (
            var c, u = o[Symbol.iterator]();
            !(s = (c = u.next()).done);
            s = !0
          ) {
            var f = c.value;
            if (0 !== f.length) {
              if (
                ((i +=
                  '<div class="dsn-word-wrapper" style="position: relative;display: inline-block;--word-dsn-index:' +
                  r +
                  ';">'),
                n)
              )
                for (var v = 0; v < f.length; v++)
                  (i +=
                    '<span class="dsn-chars-wrapper" style="position: relative;display: contents;--char-dsn-index:' +
                    a +
                    ';">' +
                    f.charAt(v) +
                    "</span>"),
                    a++;
              else i += f;
              (i += "</div>"), r !== o.length - 1 && (i += "&nbsp;"), r++;
            }
          }
        } catch (e) {
          (l = !0), (d = e);
        } finally {
          try {
            !s && u.return && u.return();
          } finally {
            if (l) throw d;
          }
        }
        t.append(i), (t = e = i = null);
      }
    },
    cutterHtml: function (e) {
      (e = this.convertToJQuery(e)).children().each(function (e) {
        $(this)
          .addClass("dsn-html")
          .attr(
            "style",
            "--html-dsn-index:" + e + ";" + ($(this).attr("style") || "")
          );
      }),
        (e = null);
    },
    removeAttr: function (e, t) {
      if (void 0 !== e && void 0 !== t) {
        var n = e.attr(t);
        return void 0 !== n && e.removeAttr(t), n;
      }
    },
    getData: function (e, t, n) {
      return (e = this.convertToJQuery(e)).length <= 0
        ? n
        : this.removeAttr(e, "data-dsn-" + t) || n;
    },
    tweenMaxParallax: function (i, r) {
      if (void 0 === i || null == r) return !1;
      var a = this;
      return {
        addParrlax: function (e) {
          if (void 0 === e.tween || void 0 === e.id) return !1;
          if (e.tween._totalDuration <= 0) return !1;
          var t = a.convertToJQuery(e.id),
            n = new ScrollMagic.Scene({
              triggerElement: t.get(0),
              triggerHook: e.triggerHook || 0,
              duration: e.duration || "100%",
              offset: e.offset || 0,
              reverse: e.reverse || !0,
            });
          if (
            (!1 !== e.reverse && n.setTween(e.tween),
            n.addTo(r),
            !0 === e._fixed)
          ) {
            n.setPin(t.get(0));
            var o = !1;
            n.on("enter", function () {
              o = !0;
            }),
              n.on("leave", function () {
                (o = !1), t.css("transform", "");
              }),
              i.getListener(function () {
                o &&
                  t.css(
                    "transform",
                    "translateY(" + i.getScrollbar().offset.y + "px)"
                  );
              }, !1);
          }
          return (
            !0 === e.refreshParallax &&
              i.getListener(function () {
                n.refresh();
              }, !0),
            !1 === e.reverse &&
              n.on("enter", function () {
                void 0 !== e.tween && e.tween.play(),
                  r.removeScene(n),
                  setTimeout(function () {
                    n.destroy(!0),
                      r.destroy(!0),
                      (r = n = null),
                      (e.tween = null),
                      (e = null);
                  }, 300);
              }),
            !(a = null) !== e._fixed && (t = null),
            !1 !== e.reverse && (e = null),
            n
          );
        },
      };
    },
    endAnimate: function (e, t) {
      null != t &&
        (e.one(
          "webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend",
          t
        ),
        (e = t = null));
    },
    elementHover: function (e, t, n) {
      (e = this.convertToJQuery(e)),
        (t = this.convertToJQuery(t))
          .on("mouseenter", function () {
            e.addClass(n);
          })
          .on("mouseleave", function () {
            e.removeClass(n);
          });
    },
    mouseMove: function (t, n) {
      if (!this.isMobile() && null != t) {
        t = this.convertToJQuery(t);
        var o = !1;
        body.on("mousemove", function (e) {
          TweenLite.to(t, 0.5, { left: e.clientX, top: e.clientY }),
            void 0 !== n &&
              void 0 !== n.onUpdate &&
              n.onUpdate(e, e.pageX, e.pageY, t),
            void 0 !== n &&
              void 0 !== n.onComplete &&
              ((o = !0),
              dsnGrid.endAnimate(t, function (e) {
                o && n.onComplete(e, t), (o = !1);
              }));
        });
      }
    },
    moveIcon: function (e, t) {
      (e = this.convertToJQuery(e)).off("mousemove"),
        e.on("mousemove", function (e) {
          TweenLite.to($(this).find(t), 1, {
            left: e.pageX,
            top: e.pageY - jQuery(this).offset().top,
          });
        });
    },
    numberText: function (e) {
      return e < 10 && 0 < e ? "0" + e : e;
    },
    scrollTop: function (e, t, n, o) {
      n = n || 0;
      var i = 0;
      "number" == typeof e
        ? (i = e)
        : (e = this.convertToJQuery(e)).length && (i = e.get(0).offsetTop),
        TweenLite.to(
          window.Scrollbar.get(document.querySelector("#dsn-scrollbar")) ||
            wind,
          t || 1,
          { scrollTo: { y: i + (n || 0) }, onComplete: o }
        ),
        (i = t = e = null);
    },
    pageLoad: function (e, t, n, o) {
      var i = window.performance.timing,
        r = (((-1 * (i.loadEventEnd - i.navigationStart)) / 1e3) % 50) * 10,
        a = e,
        s = e < t ? 1 : -1,
        l = Math.abs(Math.floor((r + n) / 100)),
        d = setInterval(function () {
          o((a += s)), t <= a && clearInterval(d);
        }, l);
      return d;
    },
    randomObjectArray: function (e, t) {
      return (
        (t = t || 100),
        e.sort(function () {
          return Math.round(Math.random()) * t;
        })
      );
    },
    parallaxIt: function (e, t, n, o) {
      if (t.length <= 0) e = t = n = o = null;
      else {
        var i = t[0].getBoundingClientRect(),
          r = e.pageX - i.left,
          a = e.pageY - i.top,
          s = window.pageYOffset || document.documentElement.scrollTop;
        (o = o || 0.5),
          (n = n || -1),
          TweenMax.to(t, o, {
            x: ((r - i.width / 2) / i.width) * n,
            y: ((a - i.height / 2 - s) / i.width) * n,
            ease: Power0.easeOut,
          }),
          (i = r = a = s = o = n = null);
      }
    },
    parallaxMoveElement: function (e, t, n, o, i) {
      var r = e.target || e,
        a = e.element || e.target || e;
      if (a.length) {
        (n = void 0 === n ? 0.5 : parseFloat(n)),
          (t = void 0 === t ? 20 : parseFloat(t));
        var s = $('<div class="icon-circle"></div>');
        r.append(s),
          r.off("mouseleave"),
          r.off("mouseenter"),
          r.off("mousemove"),
          r
            .on("mouseleave", function (e) {
              var t = { x: 0, y: 0, ease: Back.easeOut.config(4) };
              i && (t.scale = 1);
              var n = [a, s];
              o && n.push(o), TweenLite.to(n, 1, t), (n = t = null);
            })
            .on("mouseenter", function (e) {
              var t = { transformOrigin: "0 0" };
              i && (t.scale = "1.03"), TweenLite.to([a, s], 0.3, t), (t = null);
            })
            .on("mousemove", function (e) {
              dsnGrid.parallaxIt(e, a, t, n),
                dsnGrid.parallaxIt(e, s, 2 * t, n),
                void 0 !== o && dsnGrid.parallaxIt(e, o, -5, 0.5);
            });
      }
    },
    removeWhiteSpace: function (e) {
      (e = this.convertToJQuery(e))
        .contents()
        .filter(function () {
          return 3 === this.nodeType;
        })
        .remove(),
        (e = null);
    },
    cookie: function () {
      return {
        set: function (e, t, n) {
          var o = new Date();
          o.setTime(o.getTime() + 24 * n * 60 * 60 * 1e3);
          var i = "expires=" + o.toUTCString();
          (document.cookie = e + "=" + t + ";" + i + ";path=/"),
            (o = i = e = t = n = null);
        },
        get: function (e) {
          for (
            var t = e + "=",
              n = decodeURIComponent(document.cookie),
              o = n.split(";"),
              i = 0;
            i < o.length;
            i++
          ) {
            for (var r = o[i]; " " === r.charAt(0); ) r = r.substring(1);
            if (0 === r.indexOf(t)) {
              var a = r.substring(t.length, r.length);
              return (r = o = n = t = null), a;
            }
          }
          return (o = n = t = null), !1;
        },
        remove: function (e) {
          this.set(e, "", -1);
        },
      };
    },
    backgroundPosition: function (o, i, r) {
      var e, t, a, n, s;
      return (
        o instanceof jQuery == !1 && (o = jQuery(o)),
        (r = this.getUndefinedVal(r, {})),
        (e = this.getUndefinedVal(r.sizeX, "105%")),
        (t = this.getUndefinedVal(r.sizeY, "105%")),
        (n = this.getUndefinedVal(r.left, "-5%")),
        (s = this.getUndefinedVal(r.top, "-5%")),
        (a = this.getUndefinedVal(r.move, 100)),
        o.css({
          width: e,
          height: t,
          left: n,
          top: s,
          backgroundPositionX: "calc(50% - " + -2 * a + "px)",
          backgroundPositionY: "calc(50% - " + -2 * a + "px)",
        }),
        (i = this.getUndefinedVal(i, 1)),
        o
          .parent()
          .on("mousemove", function (e) {
            if (
              void 0 !== r.dataActive &&
              jQuery(this).find(o).hasClass(r.dataActive)
            )
              return !1;
            var t = e.clientX / jQuery(this).width() - 0.5,
              n = e.clientY / jQuery(this).height() - 0.5;
            TweenLite.to(jQuery(this).find(o), i, {
              transformPerspective: 100,
              x: a * t + a + " ",
              y: a * n + a + "",
            }),
              void 0 !== r.onEnter && r.onEnter(jQuery(this), e);
          })
          .on("mouseleave", function (e) {
            TweenMax.to(jQuery(this).find(o), i, {
              x: a,
              y: a,
              ease: Back.easeOut.config(4),
            }),
              void 0 !== r.onLeave && r.onLeave(jQuery(this), e);
          }),
        dsnGrid
      );
    },
    scaleIt: function (e, t, n) {
      if (void 0 === t) return !1;
      var o,
        i,
        r,
        a = 0;
      (a = body.hasClass("dsn-effect-scroll") ? e.scrollTop : e.scrollTop()),
        (r = this.getUndefinedVal(n.plus, 0)),
        (o = this.getUndefinedVal(n.position, !1));
      var s = t.offset();
      return (
        (i = void 0 === s || body.hasClass("dsn-effect-scroll") ? 0 : s.top),
        o && (i -= a),
        a / (t.height() + i + r)
      );
    },
    scrollerIt: function (e, t, n) {
      if (void 0 === t) return !1;
      var o,
        i,
        r,
        a = e.scrollTop();
      (r = this.getUndefinedVal(n.duration, 0)),
        (i = this.getUndefinedVal(n.plus, 0));
      var s = t.offset();
      (o = void 0 !== s ? s.top : 0), (o += r);
      var l = t.height() + o + i;
      if (o <= a && void 0 !== n.action) {
        var d = o - a,
          c = d / l,
          u = a / (t.height() + o + i);
        n.action({
          scroll: d,
          position: c,
          targetEnd: l,
          ScrollTop: a,
          num: u,
        });
      }
      return u;
    },
    setPositionMoveSection: function (e, t, n) {
      if (void 0 !== e) {
        var o = e.offset(),
          i = void 0 === o ? 0 : o.top;
        (t = dsnGrid.getUndefinedVal(t, 2)),
          (n = dsnGrid.getUndefinedVal(n, 0));
        var r = (e.innerHeight() + i + n) / 2;
        e.css({ marginBottom: (r / t) * -1 });
      }
    },
    mouseWheel: function (e, t, n) {
      e.bind("mousewheel DOMMouseScroll", function (e) {
        0 < e.originalEvent.wheelDelta || e.originalEvent.detail < 0
          ? void 0 !== n && n(e)
          : void 0 !== t && t(e);
      });
    },
    convertTextWord: function (e, t, n) {
      var o = e.html().trim().split(" "),
        i = "";
      e.html("");
      for (var r = 0; r < o.length; r++)
        if (0 < o[r].length) {
          if (((i += '<span class="dsn-wrapper">'), n)) {
            i += '<span class="dsn-word-wrapper">';
            for (var a = 0; a < o[r].length; a++)
              i +=
                '<span class="dsn-chars-wrapper">' + o[r].charAt(a) + "</span>";
            i += "</span>";
          } else i += '<span class="dsn-word-wrapper">' + o[r] + "</span>";
          i += "</span>";
        }
      t.append(i);
    },
    getRndInteger: function (e, t) {
      return Math.floor(Math.random() * (t - e)) + e;
    },
    parallaxMoveElemntCir: function (e, t, n, o, i) {
      var r = e,
        a = this;
      (n = void 0 === n ? 0.5 : parseFloat(n)),
        (t = void 0 === t ? 20 : parseFloat(t)),
        (i = void 0 !== i && i);
      var s = r.html(),
        l = $('<div class="icon-circle"></div>'),
        d = $('<div class="dsn-grid-parallax">' + s + "</div>");
      r.html(""),
        r.append(l),
        r.append(d),
        r
          .on("mouseleave", function (e) {
            TweenMax.to(r, n, { scale: 1 }),
              TweenMax.to(d, 0.3, { scale: 1, x: 0, y: 0 }),
              TweenMax.to(l, n, { scale: 1, x: 0, y: 0 });
          })
          .on("mouseenter", function (e) {
            TweenMax.to(r, n, { transformOrigin: "0 0", scale: 1 }),
              TweenMax.to(l, n, { scale: 1.2 });
          })
          .on("mousemove", function (e) {
            a.parallaxIt(e, d, t), dsnGrid.parallaxIt(e, l, t);
          });
    },
    changeSizeText: function (e, n) {
      e instanceof jQuery == !1 && (e = jQuery(e)),
        e.each(function () {
          var e = jQuery(this);
          for (var t in n)
            e.text().length >= parseInt(t) && (console.log(n[t]), e.css(n[t]));
        });
    },
    animateText: function (e, t, n, o) {
      function i() {
        t.each(function () {
          var e = $(this);
          if (!e.hasClass(r)) {
            var t = e.offset().top;
            void 0 !== t &&
              a > t - (wind.height() - 100) &&
              (e.hasClass(r) || e.addClass(r));
          }
        });
      }
      (t = this.convertToJQuery(t)).each(function () {
        var e = $(this);
        dsnGrid.convertTextWord(e, e),
          void 0 !== n && e.attr(n, "animate"),
          void 0 !== o && e.removeClass(o),
          e.addClass("dsn-has-animate-text");
      });
      var r = "dsn-animate",
        a = 0,
        s = null;
      e.getListener(function (e) {
        (a = void 0 === e.offset ? wind.scrollTop() : 0),
          s && clearTimeout(s),
          (s = setTimeout(i, 10));
      });
    },
    getBoundingClientRect: function (e) {
      var t = e.getBoundingClientRect();
      return {
        top: t.top,
        right: t.right,
        bottom: t.bottom,
        left: t.left,
        width: t.width,
        height: t.height,
        x: t.x,
        y: t.y,
      };
    },
    progressCircle: function (e) {
      var o = $('[data-dsn-grid="progress-circle"]'),
        t = this.removeAttr(o, "data-dsn-grid-stroke"),
        n = void 0 === t ? "" : 'stroke="' + t + '"';
      o.css({
        position: "fixed",
        right: "-60px",
        bottom: "60px",
        width: "52px",
        height: "52px",
        "z-index": "99999999",
      }),
        o.append(
          '<svg class="dsn-progress-circle-up" width="100%" height="100%" ' +
            n +
            ' viewBox="0 0 100 100" preserveAspectRatio="xMinYMin meet" fill="none">\n        <path class="dsn-progress-path" d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98" style="transition:  stroke-dashoffset 300ms linear 0s;stroke-dasharray: 307.919, 307.919; stroke-dashoffset: 309;"></path>    </svg>'
        );
      var i = wind;
      e.isScroller(!0) && (i = e.getScrollbar()),
        e.getListener(function (e) {
          var t = 0,
            n = $(document).height() - wind.height();
          void 0 === e.offset
            ? (t = wind.scrollTop())
            : ((t = e.offset.y),
              (n = $(document).height() - i.getSize().content.height + 100)),
            70 < t
              ? (TweenMax.to(o, 1, { ease: Back.easeOut.config(4), right: 60 }),
                o
                  .find(".dsn-progress-path")
                  .css(
                    "stroke-dashoffset",
                    300 - Math.round((300 * t) / n) + "%"
                  ))
              : TweenMax.to(o, 1, { ease: Back.easeIn.config(4), right: -60 });
        }),
        o.on("click", function () {
          e.isScroller(!0)
            ? i.scrollTo(0, 0, 600)
            : $("body,html").animate({ scrollTop: 0 }, 300);
        });
    },
  };
