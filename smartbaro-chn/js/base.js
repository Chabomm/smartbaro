/**
 *
 * @param { } [varname] [description]
 */

var $BASE = []; // global vars

/* polypills */
var console = window.console || {
    log: function() {}
};
var Modernizr = Modernizr || [];

(function($, window, document, ua) {

    'use strict';

    // quick selector
    function $$(selector, parent) {
        return $(document.getElementById(selector), parent);
    }

    $BASE = {

        /**
         * dom elements
         */
        $window: $(window),
        $document: $(document),
        $html: $('html'),
        $body: $('body'),
        $container: $$('container'),
        $wrapper: $$('wrapper'),
        $header: $$('header'),
        $inner: $$('inner'),
        $contents: $$('contents'),

        /**
         * strings
         */
        NAMESPACE: '.NAMED',
        CLASSACTIVE: 'active',
        CLASSDEACTIVE: 'deactive',
        IMGON: '_on',
        IMGOFF: '_off',
        IMGDATABLANK: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',

        HTMLINDICATOR: '<div id="indicator"></div>',

        /**
         * get classNames
         */
        bodyClass: $('body').attr('class'),

        /**
         * detect device
         */
        isChrome: /chrome/i.exec(ua),
        isAndroid: /android/i.exec(ua),
        hasTouch: 'ontouchstart' in window && !(/chrome/i.exec(ua) && !/android/i.exec(ua)),
        isMobile: ((/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(ua) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(ua.substr(0, 4)))) ? true : false,

        /**
         * detect css3 support
         * @param { } [varname] [description]
         */
        support: {
            animations: Modernizr.cssanimations,
            transforms: Modernizr.csstransforms,
            transforms3d: Modernizr.csstransforms3d,
            transitions: Modernizr.csstransitions,
            rgba: Modernizr.rgba
        },
        transitEndEventNames: {
            'WebkitTransition': 'webkitTransitionEnd',
            'OTransition': 'oTransitionEnd',
            'msTransition': 'MSTransitionEnd',
            'transition': 'transitionend'
        },
        animEndEventNames: {
            'WebkitAnimation': 'webkitAnimationEnd',
            'OAnimation': 'oAnimationEnd',
            'msAnimation': 'MSAnimationEnd',
            'animation': 'animationend'
        },
        init: function() {

            /**
             * events
             * @param { } [varname] [description]
             */
            $BASE.click = (document.ontouchstart !== null) ? 'click' + $BASE.NAMESPACE : 'touchstart' + $BASE.NAMESPACE;
            $BASE.startEvent = $BASE.hasTouch ? 'touchstart' + $BASE.NAMESPACE : 'mousedown' + $BASE.NAMESPACE;
            $BASE.stopEvent = $BASE.hasTouch ? 'touchend' + $BASE.NAMESPACE + ' touchcancel' + $BASE.NAMESPACE : 'mouseup' + $BASE.NAMESPACE + ' mouseleave' + $BASE.NAMESPACE;
            $BASE.moveEvent = $BASE.hasTouch ? 'touchmove' + $BASE.NAMESPACE : 'mousemove' + $BASE.NAMESPACE;

            /**
             * set animation end names
             * @param { } [varname] [description]
             */
            if ($BASE.support.transitions) {
                $BASE.transitEndEventName = $BASE.transitEndEventNames[Modernizr.prefixed('transition')] + $BASE.NAMESPACE;
            }
            if ($BASE.support.animations) {
                $BASE.animEndEventName = $BASE.animEndEventNames[Modernizr.prefixed('animation')] + $BASE.NAMESPACE;
            }

        }
    };

    $BASE.init();

    /**
     * detect browser
     * @param string [ua] [user agent]
     */
    $.detectBrowser = (function(ua) {
        var _vendor = {
            "android": "mobile android",
            "blackberry": "mobile blackberry",
            "windows phone": "mobile windows",
            "iphone": "mobile iphone",
            "ipad": "mobile ipad",
            "ipod": "mobile ipod",
            "msie 7": "ie ie7",
            "msie 8": "ie ie8",
            "msie 9": "ie ie9",
            "msie 10": "ie10",
            "chrome": "chrome",
            "webkit": "webkit",
            "safari": "safari",
            "firefox": "firefox"
        };
        var _userAgent = ua.toLowerCase();
        $.each(_vendor, function(key, value) {
            if (_userAgent.match(key)) {
                $('html').addClass(_vendor[key]);
            }
        });
    })(ua);

    /**
     * extend
     */
    function extend(a, b) {
        for (var key in b) {
            if (b.hasOwnProperty(key)) {
                a[key] = b[key];
            }
        }
        return a;
    }

    /****************** user selectors ***********************/
    $.extend($.expr[':'], {

        /* $('div:block'); */
        block: function(el) {
            return $(el).css('display') === 'block';
        },

        /* $('div:css(display, inline-block)'); */
        css: function(el, i, m) {
            var _key = m[3];
            if (!_key) return false;
            _key = _key.replace(" ", "").split(',');
            return $(el).css(_key[0]) === _key[1];
        },

        /* $('div:width(>200)'); $('div:width(<300):width(>100)'); */
        width: function(el, i, m) {
            var $this = $(el),
                _key = m[3];
            if (!_key || !(/^(<|>)\d+$/).test(_key)) return false;
            return _key.substr(0, 1) === '>' ? $this.width() > _key.substr(1) : $this.width() < _key.substr(1);
        },

        /* inview element, $('img:inview'); */
        inview: function(el) {
            var $el = $(el),
                _windowHeight = $BASE.$window.height(),
                _scrollTop = (document.documentElement.scrollTop || document.body.scrollTop),
                _elementHeight = parseInt($el.outerHeight() * 0.5, 10),
                _elementTop = $el.offset().top,
                _windowInnerHeight = (window.innerHeight && window.innerHeight < _windowHeight) ? window.innerHeight : _windowHeight;
            return (_elementTop + _elementHeight) > _scrollTop && (_elementHeight + _elementTop) < (_scrollTop + _windowInnerHeight);
        },

        /* $('div:data(map)'); */
        data: function(el, i, m) {
            var $el = $(el),
                element = $el.get(0),
                _key;
            if (!m[3]) {
                for (var x in element) {
                    if ((/jQuery\d+/).test(x)) {
                        return true;
                    }
                }
            } else {
                _key = m[3].split('=');
                if (_key[1]) {
                    if ((/^\/.+\/([mig]+)?$/).test(_key[1])) {
                        return (new RegExp(
                            _key[1].substr(1, _key[1].lastIndexOf('/') - 1),
                            _key[1].substr(_key[1].lastIndexOf('/') + 1))).test($el.data(_key[0]));
                    } else {
                        return $el.data(_key[0]) == _key[1];
                    }
                } else {
                    if ($el.data(_key[0])) {
                        return true;
                    } else {
                        $el.removeData(_key[0]);
                        return false;
                    }
                }
            }
            return false;
        }
    });

    /**
     * quick each loop function
     * @param { } [function] [description]
     */
    $.fn.eachQ = (function() {
        var jq = $([1]);
        return function(c) {
            var i = -1,
                el, len = this.length;
            try {
                while (++i < len && (el = jq[0] = this[i]) && c.call(jq, i, el) !== false);
            } catch (e) {
                delete jq[0];
                throw e;
            }
            delete jq[0];
            return this;
        };
    }());

    /**
     * not equal
     * @param { } [varname] [description]
     */
    $.fn.neq = function(i) {
        return this.pushStack(this.not(':eq(' + i + ')'));
    };

    /**
     * call function
     * @param { } [varname] [description]
     */
    /* call function
        $.callFunc(foo, {
            'key': value
        });
     */
    $.callFunc = function(func, param) {
        func = (typeof func == 'string') ? window[func] : func;
        param = (param === null) ? '' : param;
        if (func && $.isFunction(func)) {
            func.call(null, param);
        } else {
            alert('no exist function');
        }
    };

    /**
     * if exist element then call func
     * @param { } [varname] [description]
     */
    /*
        $('button.foo1').onLength(function(el) {
            el.css('border', 'solid 10px #000');
        });
    */
    $.fn.onLength = function(func, param) {
        param = (param === null) ? '' : param;
        if (this.length) {
            $.callFunc(func, param);
        }
    };

    /**
     * check has children element
     * @param { } [varname] [description]
     */
    $.fn.hasChild = function(el) {
        return this.find(el).length > 0 ? true : false;
    };

    /**
     *
     * @param { } [varname] [description]
     */
    $.fn.imgHover = function(options) {
        var opts = $.extend({
            off: $BASE.IMGOFF,
            on: $BASE.IMGON
        }, options);
        var $this = this;
        var _src = $this.attr('src');
        if (_src && _src.match(opts.on)) {
            $this.hover(function() {
                $this.attr('src', _src.replace(opts.on, opts.off));
            }, function() {
                $this.attr('src', _src.replace(opts.off, opts.on));
            });
        }
    };

    /**
     *
     * @param { } [varname] [description]
     */
    $.fn.imgToggle = function(options) {
        this.each(function() {
            var opts = $.extend({
                off: $BASE.IMGOFF,
                on: $BASE.IMGON
            }, options);
            var $this = $(this),
                _src = $this.attr('src'),
                _altOn = $this.data('alt-on'),
                _altOff = $this.data('alt-off');
            if (_src) {
                $this.attr('src', _src.replace(opts.off, opts.on));
            }
            // .attr('alt', _altOn)
        });
    };

    /**
     * img and text multi toggle
     * @param { } [varname] [description]
     */
    $.fn.imgTextMultiToggle = function(a, b, str) {
        var $img = this.find('img').eq(0);

        if ($img.length > 0) {
            $img.imgToggle(a, b, str);
        } else {
            this.text(str);
        }
    };

    /**
     * get css unit
     * @param { } [varname] [description]
     */
    $.fn.cssUnit = function(key) {
        var style = this.css(key),
            _val = [];

        $.each(["em", "px", "%", "pt"], function(i, unit) {
            if (style.indexOf(unit) > 0) {
                _val = [parseFloat(style), unit];
            }
        });
        return _val;
    };

    /**
     * get option from custom data
     * @param { } [varname] [description]
     */
    $.getOptsFromData = function(el, opts) {
        var _valTotal = '';
        $.each(opts, function(key, val) {
            var _key = (key.replace(/([a-z])([A-Z])/g, '$1-$2')).toLowerCase();
            var _data = el.data(_key);
            if (_data !== undefined) {
                opts[key] = _data;
            }
            _valTotal += _key + ', ';
        });
    };

    /**
     * 랜덤색상 추출
     * @param { } [varname] [description]
     */
    $.randomColor = function() {
        var colors = ('blue red green orange pink').split(' ');
        return colors[Math.floor(Math.random() * colors.length)];
    };

    /**
     * get element from custom data
     * @param { } [varname] [description]
     */
    $.getOptsFromDataKey = function(str) {
        var $this = $(this);
        if ($this.data(str) !== undefined) {
            return $this.data(str);
        } else {
            return base.opts[str];
        }
    };

    // 모달 관련 함수
    $.openPopup = function(_href, _width, _height, _scroll) {
        if (!_scroll) _scroll = 'no';
        var _left = parseInt((screen.width - _width) / 2, 10),
            _top = parseInt((screen.height - _height) / 2, 10) - 100;
        var _name = 'popup' + _left;
        var modalWin = window.open(_href, _name, 'top=' + _top + ', left=' + _left + ', width=' + _width + ', height=' + _height + ', scrollbars=' + _scroll + ', toolbar=no, menubar=no, location=no, resizable=false, status=yes');
        modalWin.focus();
    };

    /* event handlers */
    $.handlerPopup = function(e) {
        e.preventDefault();
        var $this = $(this);
        if (!$this.data('isClicked') && $this.data('size')) { // interval
            var _href = $this.attr('href'),
                _size = $this.data('size').split('x'),
                _width = _size[0],
                _height = _size[1],
                _scroll = ($this.data('scroll') === true) ? 'yes' : 'no';
            $this.data('isClicked', true);
            $.openPopup(_href, _width, _height, _scroll);
            setTimeout(function() {
                $this.removeData('isClicked');
            }, 1000);
        }
    };

    /**
     * get custom data value with default
     * @param { } [varname] [description]
     */
    $.fn.dataVal = function(el, _default) {
        var _value = this.data(el);
        if (_value === undefined) _value = _default;
        return _value;
    };

    /**
     * get what is it
     * @param { } [varname] [description]
     */
    $.fn.getElementIs = function() {
        var $this = $(this)[0];
        var _return = ($this.tagName) ? $this.tagName.toLowerCase() : '';
        _return += ($(this).attr('id')) ? '#' + $(this).attr('id') : '';
        _return += ($this.className) ? '.' + $this.className : '';
        return _return;
    };

    /**
     * callback image loaded
     * @param { } [varname] [description]
     */
    $.fn.imagesLoaded = function(callback) {
        var el = this.filter('img'),
            len = el.length,
            totalLen = 0,
            blank = $BASE.IMGDATABLANK;
        el.one('load.imgloaded', function() {
            totalLen = --len;
            if (totalLen <= 0 && this.src !== blank) {
                el.off('load.imgloaded');
                callback.call(el, this);
            }
        });
        el.each(function() {
            if (this.complete || this.complete === undefined) {
                var src = this.src; // + '?time = ' + new Date().getTime();
                this.src = blank;
                this.src = src;
            }
        });
        return this;
    };

    /**
     * active current
     * @param { } [varname] [description]
     */
    $.fn.activeCurrent = function(options) {
        var opts = $.extend({
            classActive: $BASE.CLASSACTIVE,
            classDeactive: $BASE.CLASSDEACTIVE
        }, options);
        this.addClass(opts.classActive).removeClass(opts.classDeactive);
        this.siblings().removeClass(opts.classActive).addClass(opts.classDeactive);
    };

    /**
     * toggle element
     * @param { } [varname] [description]
     */
    $.fn.toggleTarget = function(options) {
        var opts = $.extend({
            className: $BASE.CLASSACTIVE
        }, options);
        this.each(function() {
            var $this = $(this),
                $el = null;

            var _tagName = $this[0].tagName.toLowerCase(),
                _textActive = $this.data('text-active'),
                _textDeactive = $this.data('text-deactive');

            switch (_tagName) {
                case 'input':
                    // $el.toggleClass(opts.className);
                    break;
                case 'select':
                    // $el.toggleClass(opts.className);
                    break;
                default:
                    $el = (this.hash !== undefined) ? $(this.hash) : $($this.data('target'));
                    $el.toggleClass(opts.className);
                    // 버튼 텍스트 변경
                    if (_textActive !== undefined && _textDeactive !== undefined) {
                        if ($el.hasClass(opts.className)) {
                            $this.children().text(_textActive);
                        } else {
                            $this.children().text(_textDeactive);
                        }
                    }
                    break;
            }
        });
    };

    /**
     * toggle animation class
     * @param { } [varname] [description]
     */
    $.fn.toggleAnimClass = function(fxOff, fxOn, animNames, callback) {
        var $this = $(this);
        if ($this.data('animation') !== true) {
            $this.addClass('animated').data('animation', true);
            if (!$this.hasClass(fxOff)) {
                $this.removeClass(fxOn).addClass(fxOff);
            } else {
                $this.removeClass(fxOff).addClass(fxOn);
            }
            // if (typeof(callback) == 'function') {
            //     callback.call();
            //     // callback.apply();

            // }
            $.callFunc(callback);

            $this.one(animNames, function() {
                $this.data('animation', false).off(_animationEndNames);
            });
        }
    };

    /* js check all */
    $.fn.jsCheckAll = function() {
        this.each(function() {
            var $this = $(this),
                $wapper = ($this.data('wrap') !== undefined) ? $($this.data('wrap')) : null,
                $others = $wapper.find('input').not($this);

            $others.on('click', function(e) {
                if ($others.filter(':checked').length == $others.length) {
                    $this.prop('checked', true);
                } else {
                    $this.prop('checked', false);
                }
            });

            $this.on('click', function(e) {
                if ($this.is(':checked')) {
                    $others.prop('checked', true);
                } else {
                    $others.prop('checked', false);
                }
            });
        });
    };

    /**
     * remove prefixed class
     * @param { } [varname] [description]
     */
    $.fn.removePrefixedClass = function(prefix) {
        var classNames = $(this).attr('class'),
            newClassNames = [],
            className,
            i;
        classNames = (classNames !== undefined) ? classNames.split(' ') : '';
        for (i = 0; i < classNames.length; i++) {
            className = classNames[i];
            if (className.indexOf(prefix) !== 0) {
                newClassNames.push(className);
                continue;
            }
        }
        $(this).attr('class', newClassNames.join(' '));
    };

    /**
     * return prefixed class with prefix removed
     * @param { } [varname] [description]
     */
    $.fn.returnPrefixedClass = function(prefix) {
        var classNames = $(this).attr('class').split(' '),
            newClassNames = [],
            className,
            i,
            result;

        for (i = 0; i < classNames.length; i++) {
            className = classNames[i];
            if (className.indexOf(prefix) === 0) {
                result = className.replace(prefix, '');
                break;
            }
        }
        return result;
    };

    /**
     * sum css units
     * @param { } [varname] [description]
     */
    $.fn.sumCssUnit = function(propLeft, propRight) {
        var _val;

        if (this.cssUnit(propLeft)[1] == 'px' && this.cssUnit(propRight)[1] == 'px') {
            return this.cssUnit(propLeft)[0] + this.cssUnit(propRight)[0];
        }
    };

    /**
     * get elemenent group max height
     * @param { } [varname] [description]
     */
    $.fn.getGroupMaxHeight = function(prop) {
        var _val = 0;

        this.eachQ(function(i) {
            _val = Math.max(_val, $(this).outerHeight());
        });
        return _val;
    };

    /**
     *
     * @param { } [varname] [description]
     */
    $.fn.fitHeightWidthWindow = function(key) {
        var _height = isNaN(window.innerHeight) ? window.clientHeight : window.innerHeight;
        if (key == 'min-height') {
            this.css('min-height', _height);
        } else {
            this.css('height', _height);
        }
    };

    /**
     * aria hidden false
     * @param { } [varname] [description]
     */
    $.fn.showAria = function() {
        return this.removeAttr('hidden').attr('aria-hidden', 'false');
    };

    /**
     * aria hidden true
     * @param { } [varname] [description]
     */
    $.fn.hideAria = function() {
        return this.attr('hidden', 'hidden').attr('aria-hidden', 'true');
    };

    /**
     *
     * @param { } [varname] [description]
     */
    $.fn.oneClick = function() {
        return this.on($BASE.click, function() {
            $this.addClass('clicked').attr('disabled', 'true');
        }).removeClass('clicked').removeAttr('disabled');
    };

    /**
     * scroll, resize throttle
     * @param { } [varname] [description]
     */
    $.throttle = (function() {
        var _timerThrottle;
        return function(fn, delay) {
            clearTimeout(_timerThrottle);
            _timerThrottle = setTimeout(fn, delay);
        };
    })();

    /**
     * set ajax indicator
     * @param { } [varname] [description]
     */
    if ($BASE.$container.length && $BASE.HTMLINDICATOR !== undefined) {
        $.setIndicator = (function(parentEl, html) {
            var $el = $(html);
            parentEl.ajaxStart(function() {
                $el.prependTo($(this));
            }).ajaxStop(function() {
                $el.remove();
            });
        })($BASE.$container, $BASE.HTMLINDICATOR);
    }

    /**
     * copy inner class to html
     * @param { } [varname] [description]
     */
    if ($BASE.$inner.length) {
        $.copyClassToHtml = (function(el) {
            var _class;
            if (el.length) {
                _class = el.attr('class').split(' ')[0];
                $('html').addClass(_class);
            }
        })($BASE.$inner);
    }

    /**
     * active slide
     * http://docs.dev7studios.com/caroufredsel-old/configuration.php
     * @param { } [varname] [description]
     */
    $.fn.activeSlide = function(options) {

        this.eachQ(function() {

            var $this = $(this);
            var opts = $.extend({
                synchronise: null,
                items: 1,
                itemScroll: 1,
                itemNav: 1,
                direction: 'left',
                easing: 'swing',
                fx: 'swing',
                autoplay: true,
                autodur: 2000,
                duration: 700,
                classWrapper: '.swiper-wrapper',
                classButtonPrev: '.swiper-nav.prev',
                classButtonNext: '.swiper-nav.next',
                pagination: false,
                onCreate: function() {},
                onScroll: function() {},
                onBeforePrev: function() {},
                onAfterPrev: function() {},
                onBefore: function() {},
                onAfter: function() {},
                swipe: {
                    onTouch: true,
                    onMouse: true
                }
            }, options);

            var $slide = $this.find(opts.classWrapper);

            $.getOptsFromData($slide, opts);

            var $buttonPrev = $this.find(opts.classButtonPrev),
                $buttonNext = $this.find(opts.classButtonNext);

            $buttonPrev.removeClass('hidden').show();
            $buttonNext.removeClass('hidden').show();

            if (opts.pagination === true && $this.attr('id') !== undefined && $this.find('.swiper-pagination').length) {
                opts.classPagination = '#' + $this.attr('id') + ' .swiper-pagination';
            }

            if (opts.direction == 'up') {
                $slide.addClass('slide-vertical');
            }

            $slide.children('.swiper-slide').eachQ(function(i) {
                $(this).data('index', i);
            });

            $slide.carouFredSel({
                items: opts.items,
                direction: opts.direction,
                prev: {
                    items: opts.itemNav,
                    button: $buttonPrev,
                    onBefore: opts.onBeforePrev
                },
                next: {
                    items: opts.itemNav,
                    button: $buttonNext,
                    onBefore: opts.onBeforeNext
                },
                auto: {
                    timeoutDuration: opts.autodur,
                    delay: 0,
                    progress: false,
                    play: opts.autoplay
                },
                scroll: {
                    items: opts.itemScroll,
                    easing: opts.easing,
                    fx: opts.fx,
                    duration: opts.duration,
                    onBefore: opts.onBefore,
                    onAfter: opts.onAfter,
                    onEnd: opts.onEnd,
                    pauseOnHover: true,
                    conditions: null
                },
                onCreate: opts.onCreate,
                swipe: opts.swipe,
                pagination: opts.classPagination,
                // circular: false,
                // inifinite: false,
                responsive: false
            }, {
                transition: $BASE.support.transitions,
                wrapper: {
                    classname: 'swiper-container-inner'
                },
                classnames: {
                    selected: $BASE.CLASSACTIVE,
                    hidden: 'hidden',
                    disabled: 'disabled',
                    paused: 'paused',
                    stopped: 'stopped'
                }
            });
        });
    };

    /**
     * deactive slide
     * @param { } [varname] [description]
     */
    $.fn.deactiveSlide = function(options) {
        this.find('.swiper-wrapper').trigger('destroy');
    };

    /**
     * active selecter
     * @param { } [varname] [description]
     */

    $.fn.activeSelecter = function(options) {

        this.eachQ(function() {

            var $this = $(this),
                $firstChild = $this.children().eq(0),
                $selecter = null;

            var _label = null;

            var opts = $.extend({
                label: 'ttt',
                external: false,
                links: false,
                callback: $.noop
            }, options);

            $.getOptsFromData($this, opts);

            if (opts.external === true) {
                $this.removeAttr('selected');
                $firstChild.prop('selected', true);
                _label = $firstChild.text();
            }

            $this.selecter({
                external: opts.external,
                links: opts.links
            });

            $selecter = $this.parent('.selecter');

            $selecter.addClass($this.attr('class')).children('.selecter-options').css({
                'width': '-=1'
            });

            if (opts.external === true) {
                $selecter.find('.selecter-item').eq(0).remove();
            }

            $selecter.on("click.selecter", ".selecter-item", function() {
                if (opts.external === true) {
                    $selecter.find('.selecter-selected').text(_label);
                }
                if (opts.callback !== $.noop) {
                    var $selectedItem = $('.selecter-item.selected', $selecter);
                    var _value = $selectedItem.data('value'),
                        _index = $selectedItem.index(),
                        func = opts.callback;

                    $.callFunc(func, {
                        'value': _value,
                        'index': _index
                    });
                }
            });
        });
    };

    /*
    $("div").css({ // core
        'animation': 'all 0.5s ease-in-out 0.1s',
        'transition': 'all 0.5s ease-in-out 0.1s',
        'transform': 'scale(1.2) translate(200px, 0px)',
        'opacity': '1'
    }).cssCallback(function(base) { // callback
        console.log('done');
    }, function(base) { // pullback
        console.log('no support css3');
    });
    */

    /**
     *
     * @param { } [varname] [description]
     */
    $.fn.cssCallback = function(callback, pullback) {
        var base = this;
        base.el = $(this);
        base.core = function() {
            base.el.off($BASE.animEndEventName + ' ' + $BASE.transitEndEventName);
            if (typeof callback !== 'undefined') {
                callback(base);
            }
        };
        base.el.one($BASE.animEndEventName + ' ' + $BASE.transitEndEventName, function() {
            base.core();
        });
        if (!$BASE.support.transitions && typeof pullback !== 'undefined') {
            pullback(base);
        }
    };

    $.fn.cssCallback2 = (function(arg) {
        return function(arg) {
            var $this = $(this);
            $this.css('border', 'solid 10px #000');
            $this.one($BASE.animEndEventName + ' ' + $BASE.transitEndEventName, function() {
                $this.off($BASE.animEndEventName + ' ' + $BASE.transitEndEventName);
                console.log('1');
            });
            // arg.call(jq, 0, this);
            // return this;
        };
    }());

    // $("#foo").on('click', function() {
    //     $("#foo").css({ // core
    //         'animation': 'all 0.5s ease-in-out 0.1s',
    //         'transition': 'all 0.5s ease-in-out 0.1s',
    //         'transform': 'scale(1.2) translate(200px, 0px)',
    //         'opacity': '1'
    //     }).cssCallback2(function(base) { // callback
    //         console.log('done');
    //     }, function(base) { // pullback
    //         console.log('no support css3');
    //     });
    // });

    /**
     *
     * @param { } [varname] [description]
     */
    // $("ul.tab").translate({
    //     'right': '130px'
    // }, 500, function() {
    //     alert('2');
    // });
    $.fn.translate = function(args, ms, callback) {
        var base = this;
        var _defSpeed = 500;
        base.el = $(this);
        base.arg = {};
        if (typeof ms == 'function') {
            base.ms = _defSpeed;
            base.callback = ms;
        } else if (typeof ms == 'undefined') {
            base.ms = _defSpeed;
            base.callback = function() {};
        } else {
            base.ms = ms;
            base.callback = callback;
        }
        $.each(args, function(key, val) {
            var x = 0,
                y = 0,
                xy = parseInt(val, 10);
            xy = (key == 'right' || key == 'down') ? xy + 'px' : -(xy) + 'px';
            t = (key == 'left' || key == 'right') ? xy + ', ' + y : x + ', ' + xy;
            base.arg[Modernizr.prefixed('transform')] = 'translate(' + t + ')';
        });
        base.core = (function() {
            if ($BASE.support.transitions) {
                base.el.css("transition", "all " + base.ms + "ms ease-in-out 0.1s");
                base.el.css(base.arg);
                base.el.one(transitEndEventName, function() {
                    base.el.off(transitEndEventName);
                    // base.callback.call();
                    $.callFunc(base.callback);
                });
            } else {
                base.el.animate(base.arg, base.ms, base.callback);
            }
        })();
    };

    /**
     * html5 placeholder polyfill
     * @param { } [varname] [description]
     */
    $.fn.placeHolder = function(options) {

        var opts = $.extend({
            formCheck: false
        }, options);

        if (!("placeholder" in document.createElement("input"))) { // if (!Modernizr.input.placeholder)
            this.each(function() {
                var $this = $(this);
                $this.on({
                    "focus": function() {
                        if ($this.val() == $this.attr('placeholder')) {
                            $this.val('').removeClass('placeholder');
                        }
                    },
                    "blur": function() {
                        if ($this.val() === '' || $this.val() == $this.attr('placeholder')) {
                            $this.addClass('placeholder').val($this.attr('placeholder'));
                        }
                    }
                });
                if (opts.formCheck === true) {
                    $this.parents('form').submit(function() {
                        $(this).find('input[placeholder]').each(function() {
                            var $input = $(this);
                            if ($input.val() == $input.attr('placeholder')) {
                                $input.val('');
                            }
                        });
                    });
                }
            });
            this.blur();
        }
    };

})(jQuery, window, document, navigator.userAgent || navigator.vendor || window.opera);

// do
$(function() {

    /**
     *
     * @param { } [varname] [description]
     */
    $.onResizeWindow = function() {
        console.log('resized');
    };
    $BASE.$window.on('resize.NAMED orientationchange.NAMED', function() {
        $.throttle(function() {
            $.onResizeWindow();
        }, 300);
    });

    /**
     * scroll to
     */
    $('a.js-scrollTo').on($BASE.click, function(e) {
        e.preventDefault();
        var $target = this.hash ? $(this.hash).eq(0) : null;
        var _top = null;
        if ($target.length) {
            _top = parseInt($target.offset().top, 10);
            $('html, body').animate({
                scrollTop: _top
            }, 50);
            // 페이지 처음일때 아래 기능 추가할 것
            // $('#skipNavigation').attr('tabindex','0').focus();
        }
    });

    /**
     * active selecter
     */
    $(".js-select").activeSelecter();

    /**
     * active selecter
     */
    $(".js-select-link").activeSelecter({
        links: true
    });

    /**
     * header slide
     * @param string [direction] [방향]
     * @param string [fx] [효과]
     */
    $('#slideHeader').activeSlide({
        direction: 'up',
        fx: 'cover-fade'
    });

});

/*!
 * easing functions
 * based on easing equations from Robert Penner (http://www.robertpenner.com/easing)
 */
(function() {

    // easing defaults
    $.easing.def = "easeInOutQuad";

    var baseEasings = {};

    $.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function(i, name) {
        baseEasings[name] = function(p) {
            return Math.pow(p, i + 2);
        };
    });

    $.extend(baseEasings, {
        Circ: function(p) {
            return 1 - Math.sqrt(1 - p * p);
        },
        Elastic: function(p) {
            return p === 0 || p === 1 ? p : -Math.pow(2, 8 * (p - 1)) * Math.sin(((p - 1) * 80 - 7.5) * Math.PI / 15);
        },
        Back: function(p) {
            return p * p * (3 * p - 2);
        }
    });

    $.each(baseEasings, function(name, easeIn) {
        $.easing["easeIn" + name] = easeIn;
        $.easing["easeOut" + name] = function(p) {
            return 1 - easeIn(1 - p);
        };
        $.easing["easeInOut" + name] = function(p) {
            return p < 0.5 ?
                easeIn(p * 2) / 2 :
                1 - easeIn(p * -2 + 2) / 2;
        };
    });
})();