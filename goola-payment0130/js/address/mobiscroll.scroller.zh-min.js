/*!
 * Mobiscroll v2.16.1
 * http://mobiscroll.com
 *
 * Copyright 2010-2015, Acid Media
 * Licensed under the MIT license.
 *
 */
(function($, undefined) {
	function testProps(props) {
		var i;
		for(i in props) {
			if(mod[props[i]] !== undefined) {
				return true
			}
		}
		return false
	}

	function testPrefix() {
		var prefixes = ["Webkit", "Moz", "O", "ms"],
			p;
		for(p in prefixes) {
			if(testProps([prefixes[p] + "Transform"])) {
				return "-" + prefixes[p].toLowerCase() + "-"
			}
		}
		return ""
	}

	function init(that, options, args) {
		var ret = that;
		if(typeof options === "object") {
			return that.each(function() {
				if(instances[this.id]) {
					instances[this.id].destroy()
				}
				new $.mobiscroll.classes[options.component || "Scroller"](this, options)
			})
		}
		if(typeof options === "string") {
			that.each(function() {
				var r, inst = instances[this.id];
				if(inst && inst[options]) {
					r = inst[options].apply(this, Array.prototype.slice.call(args, 1));
					if(r !== undefined) {
						ret = r;
						return false
					}
				}
			})
		}
		return ret
	}
	var ms, id = +new Date(),
		instances = {},
		extend = $.extend,
		mod = document.createElement("modernizr").style,
		has3d = testProps(["perspectiveProperty", "WebkitPerspective", "MozPerspective", "OPerspective", "msPerspective"]),
		hasFlex = testProps(["flex", "msFlex", "WebkitBoxDirection"]),
		prefix = testPrefix(),
		pr = prefix.replace(/^\-/, "").replace(/\-$/, "").replace("moz", "Moz");
	$.fn.mobiscroll = function(method) {
		extend(this, $.mobiscroll.components);
		return init(this, method, arguments)
	};
	ms = $.mobiscroll = $.mobiscroll || {
		version: "2.16.1",
		util: {
			prefix: prefix,
			jsPrefix: pr,
			has3d: has3d,
			hasFlex: hasFlex,
			testTouch: function(e, elm) {
				if(e.type == "touchstart") {
					$(elm).attr("data-touch", "1")
				} else {
					if($(elm).attr("data-touch")) {
						$(elm).removeAttr("data-touch");
						return false
					}
				}
				return true
			},
			objectToArray: function(obj) {
				var arr = [],
					i;
				for(i in obj) {
					arr.push(obj[i])
				}
				return arr
			},
			arrayToObject: function(arr) {
				var obj = {},
					i;
				if(arr) {
					for(i = 0; i < arr.length; i++) {
						obj[arr[i]] = arr[i]
					}
				}
				return obj
			},
			isNumeric: function(a) {
				return a - parseFloat(a) >= 0
			},
			isString: function(s) {
				return typeof s === "string"
			},
			getCoord: function(e, c, client) {
				var ev = e.originalEvent || e,
					prop = (client ? "client" : "page") + c;
				return ev.changedTouches ? ev.changedTouches[0][prop] : e[prop]
			},
			getPosition: function(t, vertical) {
				var style = window.getComputedStyle ? getComputedStyle(t[0]) : t[0].style,
					matrix, px;
				if(has3d) {
					$.each(["t", "webkitT", "MozT", "OT", "msT"], function(i, v) {
						if(style[v + "ransform"] !== undefined) {
							matrix = style[v + "ransform"];
							return false
						}
					});
					matrix = matrix.split(")")[0].split(", ");
					px = vertical ? (matrix[13] || matrix[5]) : (matrix[12] || matrix[4])
				} else {
					px = vertical ? style.top.replace("px", "") : style.left.replace("px", "")
				}
				return px
			},
			constrain: function(val, min, max) {
				return Math.max(min, Math.min(val, max))
			},
			vibrate: function(time) {
				if("vibrate" in navigator) {
					navigator.vibrate(time || 50)
				}
			}
		},
		tapped: 0,
		autoTheme: "mobiscroll",
		presets: {
			scroller: {},
			numpad: {},
			listview: {},
			menustrip: {}
		},
		themes: {
			form: {},
			frame: {},
			listview: {},
			menustrip: {}
		},
		i18n: {},
		instances: instances,
		classes: {},
		components: {},
		defaults: {
			context: "body",
			mousewheel: true,
			vibrate: true
		},
		setDefaults: function(o) {
			extend(this.defaults, o)
		},
		presetShort: function(name, c, p) {
			this.components[name] = function(s) {
				return init(this, extend(s, {
					component: c,
					preset: p === false ? undefined : name
				}), arguments)
			}
		}
	};
	$.mobiscroll.classes.Base = function(el, settings) {
		var lang, preset, s, theme, themeName, defaults, ms = $.mobiscroll,
			that = this;
		that.settings = {};
		that._presetLoad = function() {};
		that._init = function(ss) {
			s = that.settings;
			extend(settings, ss);
			if(that._hasDef) {
				defaults = ms.defaults
			}
			extend(s, that._defaults, defaults, settings);
			if(that._hasTheme) {
				themeName = s.theme;
				if(themeName == "auto" || !themeName) {
					themeName = ms.autoTheme
				}
				if(themeName == "default") {
					themeName = "mobiscroll"
				}
				settings.theme = themeName;
				theme = ms.themes[that._class][themeName]
			}
			if(that._hasLang) {
				lang = ms.i18n[s.lang]
			}
			if(that._hasTheme) {
				that.trigger("onThemeLoad", [lang, settings])
			}
			extend(s, theme, lang, defaults, settings);
			if(that._hasPreset) {
				that._presetLoad(s);
				preset = ms.presets[that._class][s.preset];
				if(preset) {
					preset = preset.call(el, that);
					extend(s, preset, settings)
				}
			}
		};
		that._destroy = function() {
			that.trigger("onDestroy", []);
			delete instances[el.id];
			that = null
		};
		that.trigger = function(name, args) {
			var ret;
			args.push(that);
			$.each([defaults, theme, preset, settings], function(i, v) {
				if(v && v[name]) {
					ret = v[name].apply(el, args)
				}
			});
			return ret
		};
		that.option = function(opt, value) {
			var obj = {};
			if(typeof opt === "object") {
				obj = opt
			} else {
				obj[opt] = value
			}
			that.init(obj)
		};
		that.getInst = function() {
			return that
		};
		settings = settings || {};
		if(!el.id) {
			el.id = "mobiscroll" + (++id)
		}
		instances[el.id] = that
	};

	function preventClick(ev) {
		if(ms.tapped && !ev.tap) {
			ev.stopPropagation();
			ev.preventDefault();
			return false
		}
	}
	if(document.addEventListener) {
		$.each(["mouseover", "mousedown", "mouseup", "click"], function(i, ev) {
			document.addEventListener(ev, preventClick, true)
		})
	}
})(jQuery);
(function($, window, document, undefined) {
	var $activeElm, preventShow, ms = $.mobiscroll,
		util = ms.util,
		pr = util.jsPrefix,
		has3d = util.has3d,
		getCoord = util.getCoord,
		constrain = util.constrain,
		isString = util.isString,
		isOldAndroid = /android [1-3]/i.test(navigator.userAgent),
		isIOS8 = /(iphone|ipod|ipad).* os 8_/i.test(navigator.userAgent),
		animEnd = "webkitAnimationEnd animationend",
		empty = function() {},
		prevdef = function(ev) {
			ev.preventDefault()
		};
	ms.classes.Frame = function(el, settings, inherit) {
		var $ariaDiv, $ctx, $header, $markup, $overlay, $persp, $popup, $wnd, $wrapper, buttons, btn, doAnim, event, hasButtons, isModal, modalWidth, modalHeight, posEvents, preventPos, s, scrollLock, setReadOnly, wndWidth, wndHeight, that = this,
			$elm = $(el),
			elmList = [],
			posDebounce = {};

		function onBtnStart(ev) {
			if(btn) {
				btn.removeClass("dwb-a")
			}
			btn = $(this);
			if(!btn.hasClass("dwb-d") && !btn.hasClass("dwb-nhl")) {
				btn.addClass("dwb-a")
			}
			if(ev.type === "mousedown") {
				$(document).on("mouseup", onBtnEnd)
			}
		}

		function onBtnEnd(ev) {
			if(btn) {
				btn.removeClass("dwb-a");
				btn = null
			}
			if(ev.type === "mouseup") {
				$(document).off("mouseup", onBtnEnd)
			}
		}

		function onWndKeyDown(ev) {
			if(ev.keyCode == 13) {
				that.select()
			} else {
				if(ev.keyCode == 27) {
					that.cancel()
				}
			}
		}

		function onShow(prevFocus) {
			if(!prevFocus) {
				$popup.focus()
			}
			that.ariaMessage(s.ariaMessage)
		}

		function onHide(prevAnim) {
			var activeEl, value, type, focus = s.focusOnClose;
			that._markupRemove();
			$markup.remove();
			if($activeElm && !prevAnim) {
				setTimeout(function() {
					if(focus === undefined || focus === true) {
						preventShow = true;
						activeEl = $activeElm[0];
						type = activeEl.type;
						value = activeEl.value;
						try {
							activeEl.type = "button"
						} catch(ex) {}
						$activeElm.focus();
						activeEl.type = type;
						activeEl.value = value
					} else {
						if(focus) {
							$(focus).focus()
						}
					}
				}, 200)
			}
			that._isVisible = false;
			event("onHide", [])
		}

		function onPosition(ev) {
			clearTimeout(posDebounce[ev.type]);
			posDebounce[ev.type] = setTimeout(function() {
				var isScroll = ev.type == "scroll";
				if(isScroll && !scrollLock) {
					return
				}
				that.position(!isScroll)
			}, 200)
		}

		function onFocus(ev) {
			if(ev.target.nodeType && !$popup[0].contains(ev.target)) {
				$popup.focus()
			}
		}

		function show(beforeShow, $elm) {
			if(beforeShow) {
				beforeShow()
			}
			if($(document.activeElement).is("input,textarea")) {
				$(document.activeElement).blur()
			}
			$activeElm = $elm;
			that.show();
			setTimeout(function() {
				preventShow = false
			}, 300)
		}
		ms.classes.Base.call(this, el, settings, true);
		that.position = function(check) {
			var w, l, t, anchor, aw, ah, ap, at, al, arr, arrw, arrl, dh, scroll, sl, st, totalw = 0,
				minw = 0,
				css = {},
				nw = Math.min($wnd[0].innerWidth || $wnd.innerWidth(), $persp.width()),
				nh = $wnd[0].innerHeight || $wnd.innerHeight();
			if((wndWidth === nw && wndHeight === nh && check) || preventPos) {
				return
			}
			if(that._isFullScreen || /top|bottom/.test(s.display)) {
				$popup.width(nw)
			}
			if(event("onPosition", [$markup, nw, nh]) === false || !isModal) {
				return
			}
			sl = $wnd.scrollLeft();
			st = $wnd.scrollTop();
			anchor = s.anchor === undefined ? $elm : $(s.anchor);
			if(that._isLiquid && s.layout !== "liquid") {
				if(nw < 400) {
					$markup.addClass("dw-liq")
				} else {
					$markup.removeClass("dw-liq")
				}
			}
			if(!that._isFullScreen && /modal|bubble/.test(s.display)) {
				$wrapper.width("");
				$(".mbsc-w-p", $markup).each(function() {
					w = $(this).outerWidth(true);
					totalw += w;
					minw = (w > minw) ? w : minw
				});
				w = totalw > nw ? minw : totalw;
				$wrapper.width(w + 1).css("white-space", totalw > nw ? "" : "nowrap")
			}
			modalWidth = $popup.outerWidth();
			modalHeight = $popup.outerHeight(true);
			scrollLock = modalHeight <= nh && modalWidth <= nw;
			that.scrollLock = scrollLock;
			if(s.display == "modal") {
				l = Math.max(0, sl + (nw - modalWidth) / 2);
				t = st + (nh - modalHeight) / 2
			} else {
				if(s.display == "bubble") {
					scroll = true;
					arr = $(".dw-arrw-i", $markup);
					ap = anchor.offset();
					at = Math.abs($ctx.offset().top - ap.top);
					al = Math.abs($ctx.offset().left - ap.left);
					aw = anchor.outerWidth();
					ah = anchor.outerHeight();
					l = constrain(al - ($popup.outerWidth(true) - aw) / 2, sl + 3, sl + nw - modalWidth - 3);
					t = at - modalHeight;
					if((t < st) || (at > st + nh)) {
						$popup.removeClass("dw-bubble-top").addClass("dw-bubble-bottom");
						t = at + ah
					} else {
						$popup.removeClass("dw-bubble-bottom").addClass("dw-bubble-top")
					}
					arrw = arr.outerWidth();
					arrl = constrain(al + aw / 2 - (l + (modalWidth - arrw) / 2), 0, arrw);
					$(".dw-arr", $markup).css({
						left: arrl
					})
				} else {
					l = sl;
					if(s.display == "top") {
						t = st
					} else {
						if(s.display == "bottom") {
							t = st + nh - modalHeight
						}
					}
				}
			}
			t = t < 0 ? 0 : t;
			css.top = t;
			css.left = l;
			$popup.css(css);
			$persp.height(0);
			dh = Math.max(t + modalHeight, s.context == "body" ? $(document).height() : $ctx[0].scrollHeight);
			$persp.css({
				height: dh
			});
			if(scroll && ((t + modalHeight > st + nh) || (at > st + nh))) {
				preventPos = true;
				setTimeout(function() {
					preventPos = false
				}, 300);
				$wnd.scrollTop(Math.min(t + modalHeight - nh, dh - nh))
			}
			wndWidth = nw;
			wndHeight = nh
		};
		that.attachShow = function($elm, beforeShow) {
			elmList.push({
				readOnly: $elm.prop("readonly"),
				el: $elm
			});
			if(s.display !== "inline") {
				if(setReadOnly && $elm.is("input")) {
					$elm.prop("readonly", true).on("mousedown.dw", function(ev) {
						ev.preventDefault()
					})
				}
				if(s.showOnFocus) {
					$elm.on("focus.dw", function() {
						if(!preventShow) {
							show(beforeShow, $elm)
						}
					})
				}
				if(s.showOnTap) {
					$elm.on("keydown.dw", function(ev) {
						if(ev.keyCode == 32 || ev.keyCode == 13) {
							ev.preventDefault();
							ev.stopPropagation();
							show(beforeShow, $elm)
						}
					});
					that.tap($elm, function() {
						show(beforeShow, $elm)
					})
				}
			}
		};
		that.select = function() {
			if(!isModal || that.hide(false, "set") !== false) {
				that._fillValue();
				event("onSelect", [that._value])
			}
		};
		that.cancel = function() {
			if(!isModal || that.hide(false, "cancel") !== false) {
				event("onCancel", [that._value])
			}
		};
		that.clear = function() {
			event("onClear", [$markup]);
			if(isModal && !that.live) {
				that.hide(false, "clear")
			}
			that.setVal(null, true)
		};
		that.enable = function() {
			s.disabled = false;
			if(that._isInput) {
				$elm.prop("disabled", false)
			}
		};
		that.disable = function() {
			s.disabled = true;
			if(that._isInput) {
				$elm.prop("disabled", true)
			}
		};
		that.show = function(prevAnim, prevFocus) {
			var html;
			if(s.disabled || that._isVisible) {
				return
			}
			that._readValue();
			event("onBeforeShow", []);
			doAnim = isOldAndroid ? false : s.animate;
			if(doAnim !== false) {
				if(s.display == "top") {
					doAnim = "slidedown"
				}
				if(s.display == "bottom") {
					doAnim = "slideup"
				}
			}
			html = '<div lang="' + 'zh' + '" class="mbsc-' + s.theme + (s.baseTheme ? " mbsc-" + s.baseTheme : "") + " dw-" + s.display + " " + (s.cssClass || "") + (that._isLiquid ? " dw-liq" : "") + (isOldAndroid ? " mbsc-old" : "") + (hasButtons ? "" : " dw-nobtn") + '">' + '<div class="dw-persp">' + (isModal ? '<div class="dwo"></div>' : "") + "<div" + (isModal ? ' role="dialog" tabindex="-1"' : "") + ' class="dw' + (s.rtl ? " dw-rtl" : " dw-ltr") + '">' + (s.display === "bubble" ? '<div class="dw-arrw"><div class="dw-arrw-i"><div class="dw-arr"></div></div></div>' : "") + '<div class="dwwr">' + '<div aria-live="assertive" class="dw-aria dw-hidden"></div>' + (s.headerText ? '<div class="dwv">' + (isString(s.headerText) ? s.headerText : "") + "</div>" : "") + '<div class="dwcc">';
			html += that._generateContent();
			html += "</div>";
			if(hasButtons) {
				html += '<div class="dwbc">';
				$.each(buttons, function(i, b) {
					b = isString(b) ? that.buttons[b] : b;
					if(b.handler === "set") {
						b.parentClass = "dwb-s"
					}
					if(b.handler === "cancel") {
						b.parentClass = "dwb-c"
					}
					html += "<div" + (s.btnWidth ? ' style="width:' + (100 / buttons.length) + '%"' : "") + ' class="dwbw ' + (b.parentClass || "") + '"><div tabindex="0" role="button" class="dwb' + i + " dwb-e " + (b.cssClass === undefined ? s.btnClass : b.cssClass) + (b.icon ? " mbsc-ic mbsc-ic-" + b.icon : "") + '">' + (b.text || "") + "</div></div>"
				});
				html += "</div>"
			}
			html += "</div></div></div></div>";
			$markup = $(html);
			$persp = $(".dw-persp", $markup);
			$overlay = $(".dwo", $markup);
			$wrapper = $(".dwwr", $markup);
			$header = $(".dwv", $markup);
			$popup = $(".dw", $markup);
			$ariaDiv = $(".dw-aria", $markup);
			that._markup = $markup;
			that._header = $header;
			that._isVisible = true;
			posEvents = "orientationchange resize";
			that._markupReady($markup);
			event("onMarkupReady", [$markup]);
			if(isModal) {
				$(window).on("keydown", onWndKeyDown);
				if(s.scrollLock) {
					$markup.on("touchmove mousewheel wheel", function(ev) {
						if(scrollLock) {
							ev.preventDefault()
						}
					})
				}
				if(pr !== "Moz") {
					$("input,select,button", $ctx).each(function() {
						if(!this.disabled) {
							$(this).addClass("dwtd").prop("disabled", true)
						}
					})
				}
				if(ms.activeInstance) {
					ms.activeInstance.hide()
				}
				posEvents += " scroll";
				ms.activeInstance = that;
				$markup.appendTo($ctx);
				$wnd.on("focusin", onFocus);
				if(has3d && doAnim && !prevAnim) {
					$markup.addClass("dw-in dw-trans").on(animEnd, function() {
						$markup.off(animEnd).removeClass("dw-in dw-trans").find(".dw").removeClass("dw-" + doAnim);
						onShow(prevFocus)
					}).find(".dw").addClass("dw-" + doAnim)
				}
			} else {
				if($elm.is("div") && !that._hasContent) {
					$elm.html($markup)
				} else {
					$markup.insertAfter($elm)
				}
			}
			that._markupInserted($markup);
			event("onMarkupInserted", [$markup]);
			that.position();
			$wnd.on(posEvents, onPosition);
			$markup.on("selectstart mousedown", prevdef).on("click", ".dwb-e", prevdef).on("keydown", ".dwb-e", function(ev) {
				if(ev.keyCode == 32) {
					ev.preventDefault();
					ev.stopPropagation();
					$(this).click()
				}
			}).on("keydown", function(ev) {
				if(ev.keyCode == 32) {
					ev.preventDefault()
				} else {
					if(ev.keyCode == 9 && isModal) {
						var $focusable = $markup.find('[tabindex="0"]').filter(function() {
								return this.offsetWidth > 0 || this.offsetHeight > 0
							}),
							index = $focusable.index($(":focus", $markup)),
							i = $focusable.length - 1,
							target = 0;
						if(ev.shiftKey) {
							i = 0;
							target = -1
						}
						if(index === i) {
							$focusable.eq(target).focus();
							ev.preventDefault()
						}
					}
				}
			});
			$("input,select,textarea", $markup).on("selectstart mousedown", function(ev) {
				ev.stopPropagation()
			}).on("keydown", function(ev) {
				if(ev.keyCode == 32) {
					ev.stopPropagation()
				}
			});
			$.each(buttons, function(i, b) {
				that.tap($(".dwb" + i, $markup), function(ev) {
					b = isString(b) ? that.buttons[b] : b;
					(isString(b.handler) ? that.handlers[b.handler] : b.handler).call(this, ev, that)
				}, true)
			});
			if(s.closeOnOverlay) {
				that.tap($overlay, function() {
					that.cancel()
				})
			}
			if(isModal && !doAnim) {
				onShow(prevFocus)
			}
			$markup.on("touchstart mousedown", ".dwb-e", onBtnStart).on("touchend", ".dwb-e", onBtnEnd);
			that._attachEvents($markup);
			event("onShow", [$markup, that._tempValue])
		};
		that.hide = function(prevAnim, btn, force) {
			if(!that._isVisible || (!force && !that._isValid && btn == "set") || (!force && event("onClose", [that._tempValue, btn]) === false)) {
				return false
			}
			if($markup) {
				if(pr !== "Moz") {
					$(".dwtd", $ctx).each(function() {
						$(this).prop("disabled", false).removeClass("dwtd")
					})
				}
				if(has3d && isModal && doAnim && !prevAnim && !$markup.hasClass("dw-trans")) {
					$markup.addClass("dw-out dw-trans").find(".dw").addClass("dw-" + doAnim).on(animEnd, function() {
						onHide(prevAnim)
					})
				} else {
					onHide(prevAnim)
				}
				$wnd.off(posEvents, onPosition).off("focusin", onFocus)
			}
			if(isModal) {
				$(window).off("keydown", onWndKeyDown);
				delete ms.activeInstance
			}
		};
		that.ariaMessage = function(txt) {
			$ariaDiv.html("");
			setTimeout(function() {
				$ariaDiv.html(txt)
			}, 100)
		};
		that.isVisible = function() {
			return that._isVisible
		};
		that.setVal = empty;
		that._generateContent = empty;
		that._attachEvents = empty;
		that._readValue = empty;
		that._fillValue = empty;
		that._markupReady = empty;
		that._markupInserted = empty;
		that._markupRemove = empty;
		that._processSettings = empty;
		that._presetLoad = function(s) {
			s.buttons = s.buttons || (s.display !== "inline" ? ["set", "cancel"] : []);
			s.headerText = s.headerText === undefined ? (s.display !== "inline" ? "{value}" : false) : s.headerText
		};
		that.tap = function(el, handler, prevent) {
			var startX, startY, moved;
			if(s.tap) {
				el.on("touchstart.dw", function(ev) {
					if(prevent) {
						ev.preventDefault()
					}
					startX = getCoord(ev, "X");
					startY = getCoord(ev, "Y");
					moved = false
				}).on("touchmove.dw", function(ev) {
					if(!moved && Math.abs(getCoord(ev, "X") - startX) > 20 || Math.abs(getCoord(ev, "Y") - startY) > 20) {
						moved = true
					}
				}).on("touchend.dw", function(ev) {
					var that = this;
					if(!moved) {
						ev.preventDefault();
						handler.call(that, ev)
					}
					ms.tapped++;
					setTimeout(function() {
						ms.tapped--
					}, 500)
				})
			}
			el.on("click.dw", function(ev) {
				ev.preventDefault();
				handler.call(this, ev)
			})
		};
		that.destroy = function() {
			that.hide(true, false, true);
			$.each(elmList, function(i, v) {
				v.el.off(".dw").prop("readonly", v.readOnly)
			});
			that._destroy()
		};
		that.init = function(ss) {
			that._init(ss);
			that._isLiquid = (s.layout || (/top|bottom/.test(s.display) ? "liquid" : "")) === "liquid";
			that._processSettings();
			$elm.off(".dw");
			buttons = s.buttons || [];
			isModal = s.display !== "inline";
			setReadOnly = s.showOnFocus || s.showOnTap;
			$wnd = $(s.context == "body" ? window : s.context);
			$ctx = $(s.context);
			that.context = $wnd;
			that.live = true;
			$.each(buttons, function(i, b) {
				if(b == "ok" || b == "set" || b.handler == "set") {
					that.live = false;
					return false
				}
			});
			that.buttons.set = {
				text: s.setText,
				handler: "set"
			};
			that.buttons.cancel = {
				text: (that.live) ? s.closeText : s.cancelText,
				handler: "cancel"
			};
			that.buttons.clear = {
				text: s.clearText,
				handler: "clear"
			};
			that._isInput = $elm.is("input");
			hasButtons = buttons.length > 0;
			if(that._isVisible) {
				that.hide(true, false, true)
			}
			event("onInit", []);
			if(isModal) {
				that._readValue();
				if(!that._hasContent) {
					that.attachShow($elm)
				}
			} else {
				that.show()
			}
			$elm.on("change.dw", function() {
				if(!that._preventChange) {
					that.setVal($elm.val(), true, false)
				}
				that._preventChange = false
			})
		};
		that.buttons = {};
		that.handlers = {
			set: that.select,
			cancel: that.cancel,
			clear: that.clear
		};
		that._value = null;
		that._isValid = true;
		that._isVisible = false;
		s = that.settings;
		event = that.trigger;
		if(!inherit) {
			that.init(settings)
		}
	};
	ms.classes.Frame.prototype._defaults = {
		lang: "en",
		setText: "Set",
		selectedText: "Selected",
		closeText: "Close",
		cancelText: "Cancel",
		clearText: "Clear",
		disabled: false,
		closeOnOverlay: true,
		showOnFocus: false,
		showOnTap: true,
		display: "modal",
		scrollLock: true,
		tap: true,
		btnClass: "dwb",
		btnWidth: true,
		focusOnClose: !isIOS8
	};
	ms.themes.frame.mobiscroll = {
		rows: 5,
		showLabel: false,
		headerText: false,
		btnWidth: false,
		selectedLineHeight: true,
		selectedLineBorder: 1,
		dateOrder: "MMddyy",
		weekDays: "min",
		checkIcon: "ion-ios7-checkmark-empty",
		btnPlusClass: "mbsc-ic mbsc-ic-arrow-down5",
		btnMinusClass: "mbsc-ic mbsc-ic-arrow-up5",
		btnCalPrevClass: "mbsc-ic mbsc-ic-arrow-left5",
		btnCalNextClass: "mbsc-ic mbsc-ic-arrow-right5"
	};
	$(window).on("focus", function() {
		if($activeElm) {
			preventShow = true
		}
	})
})(jQuery, window, document);
(function($, window, document, undefined) {
	var move, ms = $.mobiscroll,
		classes = ms.classes,
		util = ms.util,
		pr = util.jsPrefix,
		has3d = util.has3d,
		hasFlex = util.hasFlex,
		getCoord = util.getCoord,
		constrain = util.constrain,
		testTouch = util.testTouch;
	ms.presetShort("scroller", "Scroller", false);
	classes.Scroller = function(el, settings, inherit) {
		var $markup, btn, isScrollable, itemHeight, multiple, s, scrollDebounce, trigger, click, moved, start, startTime, stop, p, min, max, target, index, lines, timer, that = this,
			$elm = $(el),
			iv = {},
			pos = {},
			pixels = {},
			wheels = [];

		function onStart(ev) {
			if(testTouch(ev, this) && !move && !click && !btn && !isReadOnly(this)) {
				ev.preventDefault();
				ev.stopPropagation();
				move = true;
				isScrollable = s.mode != "clickpick";
				target = $(".dw-ul", this);
				setGlobals(target);
				moved = iv[index] !== undefined;
				p = moved ? getCurrentPosition(target) : pos[index];
				start = getCoord(ev, "Y");
				startTime = new Date();
				stop = start;
				scroll(target, index, p, 0.001);
				if(isScrollable) {
					target.closest(".dwwl").addClass("dwa")
				}
				if(ev.type === "mousedown") {
					$(document).on("mousemove", onMove).on("mouseup", onEnd)
				}
			}
		}

		function onMove(ev) {
			if(move) {
				if(isScrollable) {
					ev.preventDefault();
					ev.stopPropagation();
					stop = getCoord(ev, "Y");
					if(Math.abs(stop - start) > 3 || moved) {
						scroll(target, index, constrain(p + (start - stop) / itemHeight, min - 1, max + 1));
						moved = true
					}
				}
			}
		}

		function onEnd(ev) {
			if(move) {
				var time = new Date() - startTime,
					curr = constrain(Math.round(p + (start - stop) / itemHeight), min - 1, max + 1),
					val = curr,
					speed, dist, ttop = target.offset().top;
				ev.stopPropagation();
				move = false;
				if(ev.type === "mouseup") {
					$(document).off("mousemove", onMove).off("mouseup", onEnd)
				}
				if(has3d && time < 300) {
					speed = (stop - start) / time;
					dist = (speed * speed) / s.speedUnit;
					if(stop - start < 0) {
						dist = -dist
					}
				} else {
					dist = stop - start
				}
				if(!moved) {
					var idx = Math.floor((stop - ttop) / itemHeight),
						li = $($(".dw-li", target)[idx]),
						valid = li.hasClass("dw-v"),
						hl = isScrollable;
					time = 0.1;
					if(trigger("onValueTap", [li]) !== false && valid) {
						val = idx
					} else {
						hl = true
					}
					if(hl && valid) {
						li.addClass("dw-hl");
						setTimeout(function() {
							li.removeClass("dw-hl")
						}, 100)
					}
					if(!multiple && (s.confirmOnTap === true || s.confirmOnTap[index]) && li.hasClass("dw-sel")) {
						that.select();
						return
					}
				} else {
					val = constrain(Math.round(p - dist / itemHeight), min, max);
					time = speed ? Math.max(0.1, Math.abs((val - curr) / speed) * s.timeUnit) : 0.1
				}
				if(isScrollable) {
					calc(target, index, val, 0, time, true)
				}
			}
		}

		function onBtnStart(ev) {
			btn = $(this);
			if(testTouch(ev, this)) {
				step(ev, btn.closest(".dwwl"), btn.hasClass("dwwbp") ? plus : minus)
			}
			if(ev.type === "mousedown") {
				$(document).on("mouseup", onBtnEnd)
			}
		}

		function onBtnEnd(ev) {
			btn = null;
			if(click) {
				clearInterval(timer);
				click = false
			}
			if(ev.type === "mouseup") {
				$(document).off("mouseup", onBtnEnd)
			}
		}

		function onKeyDown(ev) {
			if(ev.keyCode == 38) {
				step(ev, $(this), minus)
			} else {
				if(ev.keyCode == 40) {
					step(ev, $(this), plus)
				}
			}
		}

		function onKeyUp() {
			if(click) {
				clearInterval(timer);
				click = false
			}
		}

		function onScroll(ev) {
			if(!isReadOnly(this)) {
				ev.preventDefault();
				ev = ev.originalEvent || ev;
				var delta = ev.deltaY || ev.wheelDelta || ev.detail,
					t = $(".dw-ul", this);
				setGlobals(t);
				scroll(t, index, constrain(((delta < 0 ? -20 : 20) - pixels[index]) / itemHeight, min - 1, max + 1));
				clearTimeout(scrollDebounce);
				scrollDebounce = setTimeout(function() {
					calc(t, index, Math.round(pos[index]), delta > 0 ? 1 : 2, 0.1)
				}, 200)
			}
		}

		function step(ev, w, func) {
			ev.stopPropagation();
			ev.preventDefault();
			if(!click && !isReadOnly(w) && !w.hasClass("dwa")) {
				click = true;
				var t = w.find(".dw-ul");
				setGlobals(t);
				clearInterval(timer);
				timer = setInterval(function() {
					func(t)
				}, s.delay);
				func(t)
			}
		}

		function isReadOnly(wh) {
			if($.isArray(s.readonly)) {
				var i = $(".dwwl", $markup).index(wh);
				return s.readonly[i]
			}
			return s.readonly
		}

		function generateWheelItems(i) {
			var html = '<div class="dw-bf">',
				w = wheels[i],
				l = 1,
				labels = w.labels || [],
				values = w.values || [],
				keys = w.keys || values;
			$.each(values, function(j, v) {
				if(l % 20 === 0) {
					html += '</div><div class="dw-bf">'
				}
				html += '<div role="option" aria-selected="false" class="dw-li dw-v" data-val="' + keys[j] + '"' + (labels[j] ? ' aria-label="' + labels[j] + '"' : "") + ' style="height:' + itemHeight + "px;line-height:" + itemHeight + 'px;">' + '<div class="dw-i"' + (lines > 1 ? ' style="line-height:' + Math.round(itemHeight / lines) + "px;font-size:" + Math.round(itemHeight / lines * 0.8) + 'px;"' : "") + ">" + v + "</div></div>";
				l++
			});
			html += "</div>";
			return html
		}

		function setGlobals(t) {
			multiple = t.closest(".dwwl").hasClass("dwwms");
			min = $(".dw-li", t).index($(multiple ? ".dw-li" : ".dw-v", t).eq(0));
			max = Math.max(min, $(".dw-li", t).index($(multiple ? ".dw-li" : ".dw-v", t).eq(-1)) - (multiple ? s.rows - (s.mode == "scroller" ? 1 : 3) : 0));
			index = $(".dw-ul", $markup).index(t)
		}

		function formatHeader(v) {
			var t = s.headerText;
			return t ? (typeof t === "function" ? t.call(el, v) : t.replace(/\{value\}/i, v)) : ""
		}

		function getCurrentPosition(t) {
			return Math.round(-util.getPosition(t, true) / itemHeight)
		}

		function ready(t, i) {
			clearTimeout(iv[i]);
			delete iv[i];
			t.closest(".dwwl").removeClass("dwa")
		}

		function scroll(t, index, val, time, active) {
			var px = -val * itemHeight,
				style = t[0].style;
			if(px == pixels[index] && iv[index]) {
				return
			}
			pixels[index] = px;
			if(has3d) {
				style[pr + "Transition"] = util.prefix + "transform " + (time ? time.toFixed(3) : 0) + "s ease-out";
				style[pr + "Transform"] = "translate3d(0," + px + "px,0)"
			} else {
				style.top = px + "px"
			}
			if(iv[index]) {
				ready(t, index)
			}
			if(time && active) {
				t.closest(".dwwl").addClass("dwa");
				iv[index] = setTimeout(function() {
					ready(t, index)
				}, time * 1000)
			}
			pos[index] = val
		}

		function getValid(val, t, dir, multiple, select) {
			var selected, cell = $('.dw-li[data-val="' + val + '"]', t),
				cells = $(".dw-li", t),
				v = cells.index(cell),
				l = cells.length;
			if(multiple) {
				setGlobals(t)
			} else {
				if(!cell.hasClass("dw-v")) {
					var cell1 = cell,
						cell2 = cell,
						dist1 = 0,
						dist2 = 0;
					while(v - dist1 >= 0 && !cell1.hasClass("dw-v")) {
						dist1++;
						cell1 = cells.eq(v - dist1)
					}
					while(v + dist2 < l && !cell2.hasClass("dw-v")) {
						dist2++;
						cell2 = cells.eq(v + dist2)
					}
					if(((dist2 < dist1 && dist2 && dir !== 2) || !dist1 || (v - dist1 < 0) || dir == 1) && cell2.hasClass("dw-v")) {
						cell = cell2;
						v = v + dist2
					} else {
						cell = cell1;
						v = v - dist1
					}
				}
			}
			selected = cell.hasClass("dw-sel");
			if(select) {
				if(!multiple) {
					$(".dw-sel", t).removeAttr("aria-selected");
					cell.attr("aria-selected", "true")
				}
				$(".dw-sel", t).removeClass("dw-sel");
				cell.addClass("dw-sel")
			}
			return {
				selected: selected,
				v: multiple ? constrain(v, min, max) : v,
				val: cell.hasClass("dw-v") || multiple ? cell.attr("data-val") : null
			}
		}

		function scrollToPos(time, index, manual, dir, active) {
			if(trigger("validate", [$markup, index, time, dir]) !== false) {
				$(".dw-ul", $markup).each(function(i) {
					var t = $(this),
						multiple = t.closest(".dwwl").hasClass("dwwms"),
						sc = i == index || index === undefined,
						res = getValid(that._tempWheelArray[i], t, dir, multiple, true),
						selected = res.selected;
					if(!selected || sc) {
						that._tempWheelArray[i] = res.val;
						scroll(t, i, res.v, sc ? time : 0.1, sc ? active : false)
					}
				});
				trigger("onValidated", []);
				that._tempValue = s.formatValue(that._tempWheelArray, that);
				if(that.live) {
					that._hasValue = manual || that._hasValue;
					setValue(manual, manual, 0, true)
				}
				that._header.html(formatHeader(that._tempValue));
				if(manual) {
					trigger("onChange", [that._tempValue])
				}
			}
		}

		function calc(t, idx, val, dir, time, active) {
			val = constrain(val, min, max);
			that._tempWheelArray[idx] = $(".dw-li", t).eq(val).attr("data-val");
			scroll(t, idx, val, time, active);
			setTimeout(function() {
				scrollToPos(time, idx, true, dir, active)
			}, 10)
		}

		function plus(t) {
			var val = pos[index] + 1;
			calc(t, index, val > max ? min : val, 1, 0.1)
		}

		function minus(t) {
			var val = pos[index] - 1;
			calc(t, index, val < min ? max : val, 2, 0.1)
		}

		function setValue(fill, change, time, noscroll, temp) {
			if(that._isVisible && !noscroll) {
				scrollToPos(time)
			}
			that._tempValue = s.formatValue(that._tempWheelArray, that);
			if(!temp) {
				that._wheelArray = that._tempWheelArray.slice(0);
				that._value = that._hasValue ? that._tempValue : null
			}
			if(fill) {
				trigger("onValueFill", [that._hasValue ? that._tempValue : "", change]);
				if(that._isInput) {
					$elm.val(that._hasValue ? that._tempValue : "")
				}
				if(change) {
					that._preventChange = true;
					$elm.change()
				}
			}
		}
		classes.Frame.call(this, el, settings, true);
		that.setVal = that._setVal = function(val, fill, change, temp, time) {
			that._hasValue = val !== null && val !== undefined;
			that._tempWheelArray = $.isArray(val) ? val.slice(0) : s.parseValue.call(el, val, that) || [];
			setValue(fill, change === undefined ? fill : change, time, false, temp)
		};
		that.getVal = that._getVal = function(temp) {
			var val = that._hasValue || temp ? that[temp ? "_tempValue" : "_value"] : null;
			return util.isNumeric(val) ? +val : val
		};
		that.setArrayVal = that.setVal;
		that.getArrayVal = function(temp) {
			return temp ? that._tempWheelArray : that._wheelArray
		};
		that.setValue = function(val, fill, time, temp, change) {
			that.setVal(val, fill, change, temp, time)
		};
		that.getValue = that.getArrayVal;
		that.changeWheel = function(idx, time, manual) {
			if($markup) {
				var i = 0,
					nr = idx.length;
				$.each(s.wheels, function(j, wg) {
					$.each(wg, function(k, w) {
						if($.inArray(i, idx) > -1) {
							wheels[i] = w;
							$(".dw-ul", $markup).eq(i).html(generateWheelItems(i));
							nr--;
							if(!nr) {
								that.position();
								scrollToPos(time, undefined, manual);
								return false
							}
						}
						i++
					});
					if(!nr) {
						return false
					}
				})
			}
		};
		that.getValidCell = getValid;
		that.scroll = scroll;
		that._generateContent = function() {
			var lbl, html = "",
				l = 0;
			$.each(s.wheels, function(i, wg) {
				html += '<div class="mbsc-w-p dwc' + (s.mode != "scroller" ? " dwpm" : " dwsc") + (s.showLabel ? "" : " dwhl") + '">' + '<div class="dwwc"' + (s.maxWidth ? "" : ' style="max-width:600px;"') + ">" + (hasFlex ? "" : '<table class="dw-tbl" cellpadding="0" cellspacing="0"><tr>');
				$.each(wg, function(j, w) {
					wheels[l] = w;
					lbl = w.label !== undefined ? w.label : j;
					html += "<" + (hasFlex ? "div" : "td") + ' class="dwfl"' + ' style="' + (s.fixedWidth ? ("width:" + (s.fixedWidth[l] || s.fixedWidth) + "px;") : (s.minWidth ? ("min-width:" + (s.minWidth[l] || s.minWidth) + "px;") : "min-width:" + s.width + "px;") + (s.maxWidth ? ("max-width:" + (s.maxWidth[l] || s.maxWidth) + "px;") : "")) + '">' + '<div class="dwwl dwwl' + l + (w.multiple ? " dwwms" : "") + '">' + (s.mode != "scroller" ? '<div class="dwb-e dwwb dwwbp ' + (s.btnPlusClass || "") + '" style="height:' + itemHeight + "px;line-height:" + itemHeight + 'px;"><span>+</span></div>' + '<div class="dwb-e dwwb dwwbm ' + (s.btnMinusClass || "") + '" style="height:' + itemHeight + "px;line-height:" + itemHeight + 'px;"><span>&ndash;</span></div>' : "") + '<div class="dwl">' + lbl + "</div>" + '<div tabindex="0" aria-live="off" aria-label="' + lbl + '" role="listbox" class="dwww">' + '<div class="dww" style="height:' + (s.rows * itemHeight) + 'px;">' + '<div class="dw-ul" style="margin-top:' + (w.multiple ? (s.mode == "scroller" ? 0 : itemHeight) : s.rows / 2 * itemHeight - itemHeight / 2) + 'px;">';
					html += generateWheelItems(l) + '</div></div><div class="dwwo"></div></div><div class="dwwol"' + (s.selectedLineHeight ? ' style="height:' + itemHeight + "px;margin-top:-" + (itemHeight / 2 + (s.selectedLineBorder || 0)) + 'px;"' : "") + "></div></div>" + (hasFlex ? "</div>" : "</td>");
					l++
				});
				html += (hasFlex ? "" : "</tr></table>") + "</div></div>"
			});
			return html
		};
		that._attachEvents = function($markup) {
			$markup.on("keydown", ".dwwl", onKeyDown).on("keyup", ".dwwl", onKeyUp).on("touchstart mousedown", ".dwwl", onStart).on("touchmove", ".dwwl", onMove).on("touchend", ".dwwl", onEnd).on("touchstart mousedown", ".dwwb", onBtnStart).on("touchend", ".dwwb", onBtnEnd);
			if(s.mousewheel) {
				$markup.on("wheel mousewheel", ".dwwl", onScroll)
			}
		};
		that._markupReady = function($m) {
			$markup = $m;
			scrollToPos()
		};
		that._fillValue = function() {
			that._hasValue = true;
			setValue(true, true, 0, true)
		};
		that._readValue = function() {
			var v = $elm.val() || "";
			if(v !== "") {
				that._hasValue = true
			}
			that._tempWheelArray = that._hasValue && that._wheelArray ? that._wheelArray.slice(0) : s.parseValue.call(el, v, that) || [];
			setValue()
		};
		that._processSettings = function() {
			s = that.settings;
			trigger = that.trigger;
			itemHeight = s.height;
			lines = s.multiline;
			that._isLiquid = (s.layout || (/top|bottom/.test(s.display) && s.wheels.length == 1 ? "liquid" : "")) === "liquid";
			if(s.formatResult) {
				s.formatValue = s.formatResult
			}
			if(lines > 1) {
				s.cssClass = (s.cssClass || "") + " dw-ml"
			}
			if(s.mode != "scroller") {
				s.rows = Math.max(3, s.rows)
			}
		};
		that._selectedValues = {};
		if(!inherit) {
			that.init(settings)
		}
	};
	classes.Scroller.prototype = {
		_hasDef: true,
		_hasTheme: true,
		_hasLang: true,
		_hasPreset: true,
		_class: "scroller",
		_defaults: $.extend({}, classes.Frame.prototype._defaults, {
			minWidth: 80,
			height: 40,
			rows: 3,
			multiline: 1,
			delay: 300,
			readonly: false,
			showLabel: true,
			confirmOnTap: true,
			wheels: [],
			mode: "scroller",
			preset: "",
			speedUnit: 0.0012,
			timeUnit: 0.08,
			formatValue: function(d) {
				return d.join(" ")
			},
			parseValue: function(value, inst) {
				var val = [],
					ret = [],
					i = 0,
					found, keys;
				if(value !== null && value !== undefined) {
					val = (value + "").split(" ")
				}
				$.each(inst.settings.wheels, function(j, wg) {
					$.each(wg, function(k, w) {
						keys = w.keys || w.values;
						found = keys[0];
						$.each(keys, function(l, key) {
							if(val[i] == key) {
								found = key;
								return false
							}
						});
						ret.push(found);
						i++
					})
				});
				return ret
			}
		})
	};
	ms.themes.scroller = ms.themes.frame
})(jQuery, window, document);
(function($) {
	var themes = $.mobiscroll.themes.frame,
		theme = {
			display: "bottom",
			dateOrder: "MMdyy",
			rows: 5,
			height: 34,
			minWidth: 55,
			headerText: false,
			showLabel: false,
			btnWidth: false,
			selectedLineHeight: true,
			selectedLineBorder: 1,
			useShortLabels: true,
			deleteIcon: "backspace3",
			checkIcon: "ion-ios7-checkmark-empty",
			btnCalPrevClass: "mbsc-ic mbsc-ic-arrow-left5",
			btnCalNextClass: "mbsc-ic mbsc-ic-arrow-right5",
			btnPlusClass: "mbsc-ic mbsc-ic-arrow-down5",
			btnMinusClass: "mbsc-ic mbsc-ic-arrow-up5",
			onThemeLoad: function(lang, s) {
				if(s.theme) {
					s.theme = s.theme.replace("ios7", "ios")
				}
			}
		};
	themes.ios = theme;
	themes.ios7 = theme
})(jQuery);
(function($) {
	$.mobiscroll.i18n.zh = {
		setText: "确定",
		cancelText: "取消",
		clearText: "明确",
		selectedText: "选",
		dateFormat: "yy/mm/dd",
		dateOrder: "yymmdd",
		dayNames: ["周日", "周一", "周二", "周三", "周四", "周五", "周六"],
		dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
		dayNamesMin: ["日", "一", "二", "三", "四", "五", "六"],
		dayText: "日",
		hourText: "时",
		minuteText: "分",
		monthNames: ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"],
		monthNamesShort: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一", "十二"],
		monthText: "月",
		secText: "秒",
		timeFormat: "HH:ii",
		timeWheels: "HHii",
		yearText: "年",
		nowText: "当前",
		pmText: "下午",
		amText: "上午",
		dateText: "日",
		timeText: "时间",
		calendarText: "日历",
		closeText: "关闭",
		fromText: "开始时间",
		toText: "结束时间",
		wholeText: "合计",
		fractionText: "分数",
		unitText: "单位",
		labels: ["年", "月", "日", "小时", "分钟", "秒", ""],
		labelsShort: ["年", "月", "日", "点", "分", "秒", ""],
		startText: "开始",
		stopText: "停止",
		resetText: "重置",
		lapText: "圈",
		hideText: "隐藏",
		backText: "背部",
		undoText: "复原",
		offText: "关闭",
		onText: "开启"
	}
})(jQuery);