(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var Amelio, Emitter,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Emitter = require("./components/Emitter");

Amelio = (function(_super) {
  __extends(Amelio, _super);

  Amelio.prototype.value = 0;

  function Amelio() {}

  Amelio.prototype.upgrade = function() {
    this.value++;
    return this.emit("update");
  };

  return Amelio;

})(Emitter);

exports.resources = new Amelio();

exports.power = new Amelio();


},{"./components/Emitter":2}],2:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks[event] = this._callbacks[event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  var self = this;
  this._callbacks = this._callbacks || {};

  function on() {
    self.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks[event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks[event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks[event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks[event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],3:[function(require,module,exports){

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  _default: [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.text =
map.circle =
map.ellipse =
map.line =
map.path =
map.polygon =
map.polyline =
map.rect = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return the children.
 *
 * @param {String} html
 * @return {Array}
 * @api private
 */

function parse(html) {
  if ('string' != typeof html) throw new TypeError('String expected');
  
  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return document.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = document.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = document.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = document.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}

},{}],4:[function(require,module,exports){
module.exports=require(2)
},{}],5:[function(require,module,exports){
var elts, update;

elts = [];

update = function() {
  var elt, _i, _len;
  for (_i = 0, _len = elts.length; _i < _len; _i++) {
    elt = elts[_i];
    if (!elt) {
      continue;
    }
    elt.update();
  }
  return requestAnimationFrame(update);
};

update();

exports.register = function(elt) {
  return elts.push(elt);
};

exports.unregister = function(elt) {
  var idx;
  idx = elts.indexOf(elt);
  if (idx < 0) {
    return;
  }
  return elts.splice(idx, 1);
};


},{}],6:[function(require,module,exports){
var amelio, menu, resources, universe, update;

resources = require("./resources");

amelio = require("./amelio");

menu = (require("./menu"))();

universe = require("./universe");

universe.create();

update = function() {
  var planet, _i, _len, _ref;
  _ref = universe.planets;
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    planet = _ref[_i];
    if (planet.locked) {
      continue;
    }
    resources.minerals.add(planet.drillingLevel.minerals * (.8 + 5 * amelio.resources.value));
    resources.gaz.add(planet.drillingLevel.gaz * (.65 + 5 * amelio.resources.value));
  }
  return requestAnimationFrame(update);
};

update();

module.exports = {
  resize: function(hh) {
    return universe.dom.style.top = hh * .5 - 75 - 54 + "px";
  }
};


},{"./amelio":1,"./menu":9,"./resources":34,"./universe":50}],7:[function(require,module,exports){
var Lifebar, domify;

domify = require("./components/domify");

Lifebar = (function() {
  Lifebar.prototype.dom = null;

  Lifebar.prototype.domBar = null;

  Lifebar.prototype.domValue = null;

  Lifebar.prototype.lifeMax = 0;

  Lifebar.prototype.life = 0;

  function Lifebar(lifeMax) {
    this.lifeMax = lifeMax;
    this.dom = domify(require("./templates/planet_lifebar.html"));
    this.domBar = this.dom.querySelector(".bar");
    this.domValue = this.dom.querySelector(".value");
    this.life = this.lifeMax;
    this.update();
  }

  Lifebar.prototype.attack = function(value) {
    this.life -= value;
    if (this.life < 0) {
      this.life = 0;
    }
    return this.update();
  };

  Lifebar.prototype.update = function() {
    this.domBar.style.width = (this.life / this.lifeMax) * 100 + "px";
    return this.domValue.innerHTML = "(" + this.life + "/" + this.lifeMax + ")";
  };

  Lifebar.prototype.isDead = function() {
    return this.life <= 0;
  };

  return Lifebar;

})();

module.exports = Lifebar;


},{"./components/domify":3,"./templates/planet_lifebar.html":35}],8:[function(require,module,exports){
var game, onResize;

game = require("./game");

(function() {
  var browserRaf, canceled, targetTime, vendor, w, _i, _len, _ref;
  w = window;
  _ref = ['ms', 'moz', 'webkit', 'o'];
  for (_i = 0, _len = _ref.length; _i < _len; _i++) {
    vendor = _ref[_i];
    if (w.requestAnimationFrame) {
      break;
    }
    w.requestAnimationFrame = w["" + vendor + "RequestAnimationFrame"];
    w.cancelAnimationFrame = w["" + vendor + "CancelAnimationFrame"] || w["" + vendor + "CancelRequestAnimationFrame"];
  }
  if (w.requestAnimationFrame) {
    if (w.cancelAnimationFrame) {
      return;
    }
    browserRaf = w.requestAnimationFrame;
    canceled = {};
    w.requestAnimationFrame = function(callback) {
      var id;
      return id = browserRaf(function(time) {
        if (id in canceled) {
          return delete canceled[id];
        } else {
          return callback(time);
        }
      });
    };
    return w.cancelAnimationFrame = function(id) {
      return canceled[id] = true;
    };
  } else {
    targetTime = 0;
    w.requestAnimationFrame = function(callback) {
      var currentTime;
      targetTime = Math.max(targetTime + 16, currentTime = +(new Date));
      return w.setTimeout((function() {
        return callback(+(new Date));
      }), targetTime - currentTime);
    };
    return w.cancelAnimationFrame = function(id) {
      return clearTimeout(id);
    };
  }
})();

onResize = function() {
  var hh;
  hh = window.innerHeight || document.body.clientHeight;
  return game.resize(hh);
};

window.addEventListener("resize", onResize, false);

onResize();


},{"./game":6}],9:[function(require,module,exports){
var amelio, menuAmelio, menuArmy, menuBigShips, menuBigShipsValue, menuGazValue, menuMineralsValue, menuResources, menuShips, menuShipsValue, menuStats, resources, updateResources, updateShips;

resources = require("./resources");

amelio = require("./amelio");

updateResources = function() {
  menuMineralsValue.innerHTML = resources.minerals.value >> 0;
  return menuGazValue.innerHTML = resources.gaz.value >> 0;
};

updateShips = function() {
  if (resources.ships.value >= 1) {
    menuShips.style.display = "block";
  }
  menuShipsValue.innerHTML = resources.ships.value >> 0;
  if (resources.bigShips.value >= 1) {
    menuBigShips.style.display = "block";
  }
  return menuBigShipsValue.innerHTML = resources.bigShips.value >> 0;
};

menuResources = document.getElementById("menu__resources");

menuMineralsValue = menuResources.querySelector(".minerals .value");

menuGazValue = menuResources.querySelector(".gaz .value");

updateResources();

menuStats = document.getElementById("menu__stats");

menuArmy = document.getElementById("menu__stats__army");

menuShips = menuArmy.querySelector(".ships");

menuShipsValue = menuArmy.querySelector(".ships .value");

menuBigShips = menuArmy.querySelector(".big-ships");

menuBigShipsValue = menuArmy.querySelector(".big-ships .value");

menuAmelio = document.getElementById("menu__amelio");

module.exports = function() {
  resources.minerals.on("update", updateResources);
  resources.gaz.on("update", updateResources);
  resources.ships.on("update", updateShips);
  resources.bigShips.on("update", updateShips);
  return amelio.resources.on("update", function() {
    return menuAmelio.style.visibility = "visible";
  });
};


},{"./amelio":1,"./resources":34}],10:[function(require,module,exports){
var AmelioComponent, Emitter, PlanetMenuEntry, resources,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlanetMenuEntry = require("../planet_menu_entry");

Emitter = require("../../../components/emitter");

resources = require("../../../resources");

AmelioComponent = (function(_super) {
  __extends(AmelioComponent, _super);

  AmelioComponent.prototype.dom = null;

  AmelioComponent.prototype.amelio = null;

  AmelioComponent.prototype.callBack = null;

  function AmelioComponent(dom, amelio) {
    this.dom = dom;
    this.amelio = amelio;
    this.enable = __bind(this.enable, this);
  }

  AmelioComponent.prototype.enable = function() {
    var entry;
    entry = new PlanetMenuEntry(this.dom.querySelector(".amelio"), [
      {
        r: resources.minerals,
        v: 1000
      }, {
        r: resources.gaz,
        v: 4000
      }
    ], 2);
    entry.enable();
    return entry.on("complete", (function(_this) {
      return function() {
        _this.amelio.upgrade();
        entry.progress = 0;
        entry.updateProgress();
        return entry.disable();
      };
    })(this));
  };

  return AmelioComponent;

})(Emitter);

module.exports = AmelioComponent;


},{"../../../components/emitter":4,"../../../resources":34,"../planet_menu_entry":23}],11:[function(require,module,exports){
var AttackComponent, Emitter, PlanetMenuEntry, resources,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlanetMenuEntry = require("../planet_menu_entry");

Emitter = require("../../../components/emitter");

resources = require("../../../resources");

AttackComponent = (function(_super) {
  __extends(AttackComponent, _super);

  AttackComponent.prototype.callback = null;

  function AttackComponent(dom, planet) {
    this.dom = dom;
    this.planet = planet;
    this.enable = __bind(this.enable, this);
  }

  AttackComponent.prototype.enable = function() {
    var entry;
    entry = new PlanetMenuEntry(this.dom.querySelector(".attack"), null, 1);
    entry.enable();
    return entry.on("complete", (function(_this) {
      return function() {
        var i, n, _i, _j;
        n = resources.ships.value;
        for (i = _i = 0; 0 <= n ? _i < n : _i > n; i = 0 <= n ? ++_i : --_i) {
          _this.planet.lifebar.attack(1);
          resources.ships.substract(3);
          if (_this.planet.lifebar.isDead()) {
            break;
          }
        }
        if (!_this.planet.lifebar.isDead()) {
          n = resources.bigShips.value;
          for (i = _j = 0; 0 <= n ? _j < n : _j > n; i = 0 <= n ? ++_j : --_j) {
            _this.planet.lifebar.attack(20);
            resources.bigShips.substract(1);
            if (_this.planet.lifebar.isDead()) {
              break;
            }
          }
        }
        entry.progress = 0;
        entry.updateProgress();
        if (_this.planet.lifebar.isDead()) {
          _this.planet.unlock();
          entry.progress = 0;
          return entry.updateProgress();
        }
      };
    })(this));
  };

  return AttackComponent;

})(Emitter);

module.exports = AttackComponent;


},{"../../../components/emitter":4,"../../../resources":34,"../planet_menu_entry":23}],12:[function(require,module,exports){
var BigShipsComponent, Emitter, PlanetMenuEntry, resources,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlanetMenuEntry = require("../planet_menu_entry");

Emitter = require("../../../components/emitter");

resources = require("../../../resources");

BigShipsComponent = (function(_super) {
  __extends(BigShipsComponent, _super);

  BigShipsComponent.prototype.dom = null;

  BigShipsComponent.prototype.count = 0;

  BigShipsComponent.prototype.callBack = null;

  function BigShipsComponent(dom, count) {
    this.dom = dom;
    this.count = count != null ? count : 1;
    this.enable = __bind(this.enable, this);
  }

  BigShipsComponent.prototype.enable = function() {
    return this.enableCreateShip();
  };

  BigShipsComponent.prototype.enableCreateShip = function() {
    var entry;
    entry = new PlanetMenuEntry(this.dom.querySelector(".create-big-ship-" + this.count), [
      {
        r: resources.minerals,
        v: 1000 * this.count
      }, {
        r: resources.gaz,
        v: 500 * this.count
      }
    ], 1);
    entry.enable();
    return entry.on("complete", (function(_this) {
      return function() {
        resources.bigShips.add(_this.count);
        entry.progress = 0;
        return entry.updateProgress();
      };
    })(this));
  };

  return BigShipsComponent;

})(Emitter);

module.exports = BigShipsComponent;


},{"../../../components/emitter":4,"../../../resources":34,"../planet_menu_entry":23}],13:[function(require,module,exports){
var AmelioComponent, Emitter, PlanetMenuEntry, resources,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlanetMenuEntry = require("../planet_menu_entry");

Emitter = require("../../../components/emitter");

resources = require("../../../resources");

AmelioComponent = (function(_super) {
  __extends(AmelioComponent, _super);

  AmelioComponent.prototype.dom = null;

  AmelioComponent.prototype.amelio = null;

  AmelioComponent.prototype.callBack = null;

  function AmelioComponent(dom) {
    this.dom = dom;
    this.enable = __bind(this.enable, this);
  }

  AmelioComponent.prototype.enable = function() {
    var entry;
    entry = new PlanetMenuEntry(this.dom.querySelector(".end"), [
      {
        r: resources.minerals,
        v: 2000
      }, {
        r: resources.gaz,
        v: 2000
      }
    ], .25);
    entry.enable();
    return entry.on("complete", (function(_this) {
      return function() {
        var divEnd;
        divEnd = document.getElementById("ui-end");
        return divEnd.style.display = "block";
      };
    })(this));
  };

  return AmelioComponent;

})(Emitter);

module.exports = AmelioComponent;


},{"../../../components/emitter":4,"../../../resources":34,"../planet_menu_entry":23}],14:[function(require,module,exports){
var Emitter, GazComponent, PlanetMenuEntry, resources,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlanetMenuEntry = require("../planet_menu_entry");

Emitter = require("../../../components/emitter");

resources = require("../../../resources");

GazComponent = (function(_super) {
  __extends(GazComponent, _super);

  GazComponent.prototype.dom = null;

  GazComponent.prototype.planet = null;

  GazComponent.prototype.callBack = null;

  function GazComponent(dom, planet) {
    this.dom = dom;
    this.planet = planet;
    this.enable = __bind(this.enable, this);
  }

  GazComponent.prototype.enable = function() {
    return this.enableDrillingGaz();
  };

  GazComponent.prototype.enableDrillingGaz = function() {
    var entry;
    entry = new PlanetMenuEntry(this.dom.querySelector(".drilling-gaz"), [
      {
        r: resources.minerals,
        v: 50
      }, {
        r: resources.gaz,
        v: 100
      }
    ], .64);
    entry.enable();
    return entry.on("complete", (function(_this) {
      return function() {
        _this.planet.drillingLevel.gaz = 1;
        entry.disable();
        _this.enableUpgradeGaz();
        if (_this.callBack) {
          return _this.callBack.call(_this, null);
        }
      };
    })(this));
  };

  GazComponent.prototype.enableUpgradeGaz = function() {
    var entry;
    entry = new PlanetMenuEntry(this.dom.querySelector(".upgrade-gaz"), [
      {
        r: resources.minerals,
        v: 100
      }, {
        r: resources.gaz,
        v: 200
      }
    ], .5);
    entry.enable();
    return entry.on("complete", (function(_this) {
      return function() {
        _this.planet.drillingLevel.gaz += 1;
        if (_this.planet.drillingLevel.gaz === 5) {
          return entry.disable();
        } else {
          switch (_this.planet.drillingLevel.gaz) {
            case 2:
              entry.prices = [
                {
                  r: resources.minerals,
                  v: 200
                }, {
                  r: resources.gaz,
                  v: 400
                }
              ];
              break;
            case 3:
              entry.prices = [
                {
                  r: resources.minerals,
                  v: 300
                }, {
                  r: resources.gaz,
                  v: 900
                }
              ];
              break;
            case 3:
              entry.prices = [
                {
                  r: resources.minerals,
                  v: 500
                }, {
                  r: resources.gaz,
                  v: 2000
                }
              ];
              break;
            case 4:
              entry.prices = [
                {
                  r: resources.minerals,
                  v: 1000
                }, {
                  r: resources.gaz,
                  v: 5000
                }
              ];
          }
          entry.progress = 0;
          entry.updateProgress();
          return entry.updatePrice();
        }
      };
    })(this));
  };

  return GazComponent;

})(Emitter);

module.exports = GazComponent;


},{"../../../components/emitter":4,"../../../resources":34,"../planet_menu_entry":23}],15:[function(require,module,exports){
var Emitter, InvadeComponent, PlanetMenuEntry, resources,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlanetMenuEntry = require("../planet_menu_entry");

Emitter = require("../../../components/emitter");

resources = require("../../../resources");

InvadeComponent = (function(_super) {
  __extends(InvadeComponent, _super);

  InvadeComponent.prototype.dom = null;

  InvadeComponent.prototype.planet = null;

  InvadeComponent.prototype.costs = null;

  function InvadeComponent(dom, planet, costs) {
    this.dom = dom;
    this.planet = planet;
    this.costs = costs;
    this.enable = __bind(this.enable, this);
  }

  InvadeComponent.prototype.enable = function() {
    var entry;
    entry = new PlanetMenuEntry(this.dom.querySelector(".invade"), [
      {
        r: resources.ships,
        v: this.costs[0]
      }, {
        r: resources.minerals,
        v: this.costs[1]
      }, {
        r: resources.gaz,
        v: this.costs[2]
      }
    ], .5);
    entry.enable();
    return entry.on("complete", (function(_this) {
      return function() {
        _this.planet.unlock();
        entry.progress = 0;
        return entry.updateProgress();
      };
    })(this));
  };

  return InvadeComponent;

})(Emitter);

module.exports = InvadeComponent;


},{"../../../components/emitter":4,"../../../resources":34,"../planet_menu_entry":23}],16:[function(require,module,exports){
var Emitter, MineralComponent, PlanetMenuEntry, resources,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlanetMenuEntry = require("../planet_menu_entry");

Emitter = require("../../../components/emitter");

resources = require("../../../resources");

MineralComponent = (function(_super) {
  __extends(MineralComponent, _super);

  MineralComponent.prototype.dom = null;

  MineralComponent.prototype.planet = null;

  MineralComponent.prototype.callBack = null;

  function MineralComponent(dom, planet) {
    this.dom = dom;
    this.planet = planet;
    this.enable = __bind(this.enable, this);
  }

  MineralComponent.prototype.enable = function() {
    return this.enableDrillingMinerals();
  };

  MineralComponent.prototype.enableDrillingMinerals = function() {
    var entry;
    entry = new PlanetMenuEntry(this.dom.querySelector(".drilling-minerals"), [
      {
        r: resources.minerals,
        v: 100
      }
    ], .64);
    entry.enable();
    return entry.on("complete", (function(_this) {
      return function() {
        _this.planet.drillingLevel.minerals = 1;
        entry.disable();
        _this.enableUpgradeMinerals();
        if (_this.callBack) {
          return _this.callBack.call(_this, null);
        }
      };
    })(this));
  };

  MineralComponent.prototype.enableUpgradeMinerals = function() {
    var entry;
    entry = new PlanetMenuEntry(this.dom.querySelector(".upgrade-minerals"), [
      {
        r: resources.minerals,
        v: 250
      }
    ], .5);
    entry.enable();
    return entry.on("complete", (function(_this) {
      return function() {
        _this.planet.drillingLevel.minerals += 1;
        if (_this.planet.drillingLevel.minerals === 5) {
          return entry.disable();
        } else {
          switch (_this.planet.drillingLevel.minerals) {
            case 2:
              entry.prices = [
                {
                  r: resources.minerals,
                  v: 500
                }
              ];
              break;
            case 3:
              entry.prices = [
                {
                  r: resources.minerals,
                  v: 1500
                }
              ];
              break;
            case 3:
              entry.prices = [
                {
                  r: resources.minerals,
                  v: 4000
                }
              ];
              break;
            case 4:
              entry.prices = [
                {
                  r: resources.minerals,
                  v: 6750
                }
              ];
          }
          entry.progress = 0;
          entry.updateProgress();
          return entry.updatePrice();
        }
      };
    })(this));
  };

  return MineralComponent;

})(Emitter);

module.exports = MineralComponent;


},{"../../../components/emitter":4,"../../../resources":34,"../planet_menu_entry":23}],17:[function(require,module,exports){
var Emitter, PlanetMenuEntry, ShipsComponent, resources,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlanetMenuEntry = require("../planet_menu_entry");

Emitter = require("../../../components/emitter");

resources = require("../../../resources");

ShipsComponent = (function(_super) {
  __extends(ShipsComponent, _super);

  ShipsComponent.prototype.dom = null;

  ShipsComponent.prototype.callBack = null;

  function ShipsComponent(dom, count) {
    this.dom = dom;
    this.count = count != null ? count : 1;
    this.enable = __bind(this.enable, this);
  }

  ShipsComponent.prototype.enable = function() {
    return this.enableCreateShip();
  };

  ShipsComponent.prototype.enableCreateShip = function() {
    var entry;
    entry = new PlanetMenuEntry(this.dom.querySelector(".create-ship-" + this.count), [
      {
        r: resources.minerals,
        v: 100 * this.count
      }, {
        r: resources.gaz,
        v: 50 * this.count
      }
    ], 1);
    entry.enable();
    return entry.on("complete", (function(_this) {
      return function() {
        resources.ships.add(_this.count);
        entry.progress = 0;
        return entry.updateProgress();
      };
    })(this));
  };

  return ShipsComponent;

})(Emitter);

module.exports = ShipsComponent;


},{"../../../components/emitter":4,"../../../resources":34,"../planet_menu_entry":23}],18:[function(require,module,exports){
var AmelioComponent, PlanetMenuAmelio, domify;

domify = require("../../components/domify");

AmelioComponent = require("./components/amelio_component");

PlanetMenuAmelio = (function() {
  PlanetMenuAmelio.prototype.dom = null;

  PlanetMenuAmelio.prototype.amelioComponent = null;

  function PlanetMenuAmelio(domData, amelio) {
    this.dom = domify(domData);
    this.amelioComponent = new AmelioComponent(this.dom, amelio);
  }

  PlanetMenuAmelio.prototype.enable = function() {
    return this.amelioComponent.enable();
  };

  return PlanetMenuAmelio;

})();

module.exports = PlanetMenuAmelio;


},{"../../components/domify":3,"./components/amelio_component":10}],19:[function(require,module,exports){
var BigShipsComponent, PlanetMenuArmy, ShipsComponent, domify;

domify = require("../../components/domify");

ShipsComponent = require("./components/ships_component");

BigShipsComponent = require("./components/big_ships_component");

PlanetMenuArmy = (function() {
  PlanetMenuArmy.prototype.dom = null;

  function PlanetMenuArmy(domData) {
    this.dom = domify(domData);
    this.shipsComponent10 = new ShipsComponent(this.dom, 10);
    this.bigShipsComponent1 = new BigShipsComponent(this.dom);
    this.bigShipsComponent5 = new BigShipsComponent(this.dom, 5);
  }

  PlanetMenuArmy.prototype.enable = function() {
    this.shipsComponent10.enable();
    this.bigShipsComponent1.enable();
    return this.bigShipsComponent5.enable();
  };

  return PlanetMenuArmy;

})();

module.exports = PlanetMenuArmy;


},{"../../components/domify":3,"./components/big_ships_component":12,"./components/ships_component":17}],20:[function(require,module,exports){
var AttackComponent, PlanetMenuAttack, domify;

domify = require("../../components/domify");

AttackComponent = require("./components/attack_component");

PlanetMenuAttack = (function() {
  PlanetMenuAttack.prototype.planet = null;

  PlanetMenuAttack.prototype.dom = null;

  PlanetMenuAttack.prototype.attackComponent = null;

  function PlanetMenuAttack(planet, domData) {
    this.planet = planet;
    this.dom = domify(domData);
    this.attackComponent = new AttackComponent(this.dom, this.planet, null, 2);
  }

  PlanetMenuAttack.prototype.enable = function() {
    return this.attackComponent.enable();
  };

  return PlanetMenuAttack;

})();

module.exports = PlanetMenuAttack;


},{"../../components/domify":3,"./components/attack_component":11}],21:[function(require,module,exports){
var GazComponent, MineralComponent, PlanetMenuCollect, domify;

domify = require("../../components/domify");

MineralComponent = require("./components/mineral_component");

GazComponent = require("./components/gaz_component");

PlanetMenuCollect = (function() {
  PlanetMenuCollect.prototype.planet = null;

  PlanetMenuCollect.prototype.dom = null;

  PlanetMenuCollect.prototype.mineralComponent = null;

  PlanetMenuCollect.prototype.gazComponent = null;

  function PlanetMenuCollect(planet, domData) {
    this.planet = planet;
    this.dom = domify(domData);
    this.mineralComponent = new MineralComponent(this.dom, this.planet);
    this.gazComponent = new GazComponent(this.dom, this.planet);
    this.mineralComponent.callBack = this.gazComponent.enable;
  }

  PlanetMenuCollect.prototype.enable = function() {
    return this.mineralComponent.enable();
  };

  return PlanetMenuCollect;

})();

module.exports = PlanetMenuCollect;


},{"../../components/domify":3,"./components/gaz_component":14,"./components/mineral_component":16}],22:[function(require,module,exports){
var EndComponent, PlanetMenuEnd, domify;

domify = require("../../components/domify");

EndComponent = require("./components/end_component");

PlanetMenuEnd = (function() {
  PlanetMenuEnd.prototype.planet = null;

  PlanetMenuEnd.prototype.dom = null;

  PlanetMenuEnd.prototype.endComponent = null;

  function PlanetMenuEnd(planet, domData) {
    this.planet = planet;
    this.dom = domify(domData);
    this.endComponent = new EndComponent(this.dom);
  }

  PlanetMenuEnd.prototype.enable = function() {
    return this.endComponent.enable();
  };

  return PlanetMenuEnd;

})();

module.exports = PlanetMenuEnd;


},{"../../components/domify":3,"./components/end_component":13}],23:[function(require,module,exports){
var Emitter, PlanetMenuEntry, resources, updateManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

updateManager = require("../../core/updateManager");

resources = require("../../resources");

Emitter = require("../../components/emitter");

PlanetMenuEntry = (function(_super) {
  __extends(PlanetMenuEntry, _super);

  PlanetMenuEntry.prototype.dom = null;

  PlanetMenuEntry.prototype.progress = 0;

  PlanetMenuEntry.prototype.prices = 0;

  PlanetMenuEntry.prototype.speed = 0;

  PlanetMenuEntry.prototype.domPrice = null;

  PlanetMenuEntry.prototype.domProgress = null;

  function PlanetMenuEntry(dom, prices, speed) {
    this.dom = dom;
    this.prices = prices;
    this.speed = speed != null ? speed : 0;
    this.domPrice = this.dom.querySelector(".price");
    this.domProgress = this.dom.querySelector(".progress");
    this.dom.addEventListener("click", (function(_this) {
      return function(e) {
        var price, _i, _len, _ref;
        e.preventDefault();
        if (_this.prices) {
          if (_this.isResourcesAvailable()) {
            _ref = _this.prices;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              price = _ref[_i];
              price.r.substract(price.v);
            }
            return _this.start();
          }
        } else {
          console.log("start", _this.speed);
          return _this.start();
        }
      };
    })(this));
    this.updatePrice();
  }

  PlanetMenuEntry.prototype.isResourcesAvailable = function() {
    var isAvailable, price, _i, _len, _ref;
    isAvailable = true;
    _ref = this.prices;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      price = _ref[_i];
      if (!price.r.isMoreThan(price.v)) {
        isAvailable = false;
      }
    }
    return isAvailable;
  };

  PlanetMenuEntry.prototype.updatePrice = function() {
    var i, price, s, _i, _len, _ref;
    if (!this.prices) {
      return;
    }
    s = "(cost: ";
    _ref = this.prices;
    for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
      price = _ref[i];
      if (i > 0) {
        s += ", ";
      }
      s += price.v + price.r.name;
    }
    s += ")";
    return this.domPrice.innerHTML = s;
  };

  PlanetMenuEntry.prototype.updateProgress = function() {
    var s;
    if (this.progress === 0) {
      if (this.domProgress.innerHTML !== "") {
        this.domProgress.innerHTML = "";
      }
      return;
    }
    s = (this.progress >> 0).toString();
    return this.domProgress.innerHTML = s + "%";
  };

  PlanetMenuEntry.prototype.enable = function() {
    return this.dom.style.display = "block";
  };

  PlanetMenuEntry.prototype.disable = function() {
    return this.dom.style.display = "none";
  };

  PlanetMenuEntry.prototype.start = function() {
    return updateManager.register(this);
  };

  PlanetMenuEntry.prototype.update = function() {
    this.progress += this.speed;
    if (this.progress >= 100) {
      this.progress = 100;
      updateManager.unregister(this);
      this.onComplete();
    }
    return this.updateProgress();
  };

  PlanetMenuEntry.prototype.onComplete = function() {
    return this.emit("complete");
  };

  return PlanetMenuEntry;

})(Emitter);

module.exports = PlanetMenuEntry;


},{"../../components/emitter":4,"../../core/updateManager":5,"../../resources":34}],24:[function(require,module,exports){
var InvadeComponent, PlanetMenuInvade, domify;

domify = require("../../components/domify");

InvadeComponent = require("./components/invade_component");

PlanetMenuInvade = (function() {
  PlanetMenuInvade.prototype.planet = null;

  PlanetMenuInvade.prototype.dom = null;

  PlanetMenuInvade.prototype.invadeComponent = null;

  function PlanetMenuInvade(planet, domData) {
    this.planet = planet;
    this.dom = domify(domData);
    this.invadeComponent = new InvadeComponent(this.dom, this.planet, [3, 300, 150]);
  }

  PlanetMenuInvade.prototype.enable = function() {
    return this.invadeComponent.enable();
  };

  return PlanetMenuInvade;

})();

module.exports = PlanetMenuInvade;


},{"../../components/domify":3,"./components/invade_component":15}],25:[function(require,module,exports){
var PlanetMenuCollect, PlanetMenuOrigin, ShipsComponent,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlanetMenuCollect = require("./planet_menu_collect");

ShipsComponent = require("./components/ships_component");

PlanetMenuOrigin = (function(_super) {
  __extends(PlanetMenuOrigin, _super);

  PlanetMenuOrigin.prototype.shipsComponent = null;

  function PlanetMenuOrigin(planet, domData) {
    this.planet = planet;
    PlanetMenuOrigin.__super__.constructor.call(this, this.planet, domData);
    this.shipsComponent = new ShipsComponent(this.dom);
    this.gazComponent.callBack = this.shipsComponent.enable;
  }

  return PlanetMenuOrigin;

})(PlanetMenuCollect);

module.exports = PlanetMenuOrigin;


},{"./components/ships_component":17,"./planet_menu_collect":21}],26:[function(require,module,exports){
var Lifebar, Planet, domify, textures;

domify = require("../components/domify");

textures = require("../textures");

Lifebar = require("../lifebar");

Planet = (function() {
  Planet.prototype.cnt = null;

  Planet.prototype.menu = null;

  Planet.prototype.lifebar = null;

  Planet.prototype.locked = true;

  Planet.prototype.drillingLevel = null;

  Planet.prototype.canConstructShips = false;

  function Planet(cnt) {
    this.cnt = cnt;
    this.drillingLevel = {
      minerals: 0,
      gaz: 0
    };
  }

  Planet.prototype.setTexture = function(name) {
    var dom;
    dom = domify(textures.planets[name]);
    return this.cnt.appendChild(dom);
  };

  Planet.prototype.unlock = function() {
    if (this.lifebar) {
      this.cnt.removeChild(this.lifebar.dom);
    }
    this.updateMenu();
    return this.locked = false;
  };

  Planet.prototype.updateMenu = function() {
    if (this.menu) {
      this.cnt.removeChild(this.menu.dom);
    }
    this.menu = this.createMenu();
    this.menu.enable();
    return this.cnt.appendChild(this.menu.dom);
  };

  Planet.prototype.createMenu = function() {};

  Planet.prototype.addLifebar = function(life) {
    this.lifebar = new Lifebar(life);
    return this.cnt.appendChild(this.lifebar.dom);
  };

  return Planet;

})();

module.exports = Planet;


},{"../components/domify":3,"../lifebar":7,"../textures":43}],27:[function(require,module,exports){
var Planet, PlanetAmelio, PlanetMenuAmelio, PlanetMenuAttack,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlanetMenuAttack = require("./menu/planet_menu_attack");

PlanetMenuAmelio = require("./menu/planet_menu_amelio");

Planet = require("./planet");

PlanetAmelio = (function(_super) {
  __extends(PlanetAmelio, _super);

  PlanetAmelio.prototype.amelio = null;

  function PlanetAmelio(cnt, life) {
    PlanetAmelio.__super__.constructor.call(this, cnt);
    this.updateMenu();
    this.addLifebar(life);
  }

  PlanetAmelio.prototype.createMenu = function() {
    if (!this.menu) {
      return new PlanetMenuAttack(this, require("../templates/planet_menu_attack.html"));
    } else {
      return new PlanetMenuAmelio(require("../templates/planet_menu_amelio.html"), this.amelio);
    }
  };

  return PlanetAmelio;

})(Planet);

module.exports = PlanetAmelio;


},{"../templates/planet_menu_amelio.html":36,"../templates/planet_menu_attack.html":38,"./menu/planet_menu_amelio":18,"./menu/planet_menu_attack":20,"./planet":26}],28:[function(require,module,exports){
var Planet, PlanetArmy, PlanetMenuArmy, PlanetMenuInvade,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlanetMenuArmy = require("./menu/planet_menu_army");

PlanetMenuInvade = require("./menu/planet_menu_invade");

Planet = require("./planet");

PlanetArmy = (function(_super) {
  __extends(PlanetArmy, _super);

  function PlanetArmy(cnt) {
    PlanetArmy.__super__.constructor.call(this, cnt);
    this.updateMenu();
  }

  PlanetArmy.prototype.createMenu = function() {
    if (!this.menu) {
      return new PlanetMenuInvade(this, require("../templates/planet_menu_invade.html"));
    } else {
      return new PlanetMenuArmy(require("../templates/planet_menu_army.html"));
    }
  };

  return PlanetArmy;

})(Planet);

module.exports = PlanetArmy;


},{"../templates/planet_menu_army.html":37,"../templates/planet_menu_invade.html":41,"./menu/planet_menu_army":19,"./menu/planet_menu_invade":24,"./planet":26}],29:[function(require,module,exports){
var Planet, PlanetCollect, PlanetMenuCollect, PlanetMenuInvade,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlanetMenuCollect = require("./menu/planet_menu_collect");

PlanetMenuInvade = require("./menu/planet_menu_invade");

Planet = require("./planet");

PlanetCollect = (function(_super) {
  __extends(PlanetCollect, _super);

  function PlanetCollect(cnt) {
    PlanetCollect.__super__.constructor.call(this, cnt);
    this.updateMenu();
  }

  PlanetCollect.prototype.createMenu = function() {
    if (!this.menu) {
      return new PlanetMenuInvade(this, require("../templates/planet_menu_invade.html"));
    } else {
      return new PlanetMenuCollect(this, require("../templates/planet_menu_collect.html"));
    }
  };

  return PlanetCollect;

})(Planet);

module.exports = PlanetCollect;


},{"../templates/planet_menu_collect.html":39,"../templates/planet_menu_invade.html":41,"./menu/planet_menu_collect":21,"./menu/planet_menu_invade":24,"./planet":26}],30:[function(require,module,exports){
var Planet, PlanetEnd, PlanetMenuAttack, PlanetMenuEnd,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlanetMenuAttack = require("./menu/planet_menu_attack");

PlanetMenuEnd = require("./menu/planet_menu_end");

Planet = require("./planet");

PlanetEnd = (function(_super) {
  __extends(PlanetEnd, _super);

  function PlanetEnd(cnt, life) {
    PlanetEnd.__super__.constructor.call(this, cnt);
    this.updateMenu();
    this.addLifebar(life);
  }

  PlanetEnd.prototype.createMenu = function() {
    if (!this.menu) {
      return new PlanetMenuAttack(this, require("../templates/planet_menu_attack.html"));
    } else {
      return new PlanetMenuEnd(this, require("../templates/planet_menu_end.html"));
    }
  };

  return PlanetEnd;

})(Planet);

module.exports = PlanetEnd;


},{"../templates/planet_menu_attack.html":38,"../templates/planet_menu_end.html":40,"./menu/planet_menu_attack":20,"./menu/planet_menu_end":22,"./planet":26}],31:[function(require,module,exports){
var PlanetAmelio, PlanetArmy, PlanetCollect, PlanetEnd, PlanetOrigin, PlanetWar;

PlanetOrigin = require("./planet_origin");

PlanetCollect = require("./planet_collect");

PlanetArmy = require("./planet_army");

PlanetWar = require("./planet_war");

PlanetAmelio = require("./planet_amelio");

PlanetEnd = require("./planet_end");

module.exports = function(name, params) {
  var cnt, planet;
  cnt = document.getElementById(name);
  switch (name) {
    case "origin":
      planet = new PlanetOrigin(cnt, params);
      break;
    case "collect_0":
      planet = new PlanetCollect(cnt, params);
      break;
    case "army_0":
      planet = new PlanetArmy(cnt, params);
      break;
    case "war_0":
      planet = new PlanetWar(cnt, params);
      break;
    case "amelio_0":
      planet = new PlanetAmelio(cnt, params);
      break;
    case "end":
      planet = new PlanetEnd(cnt, params);
  }
  return planet;
};


},{"./planet_amelio":27,"./planet_army":28,"./planet_collect":29,"./planet_end":30,"./planet_origin":32,"./planet_war":33}],32:[function(require,module,exports){
var Planet, PlanetMenuOrigin, PlanetOrigin,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Planet = require("./planet");

PlanetMenuOrigin = require("./menu/planet_menu_origin");

PlanetOrigin = (function(_super) {
  __extends(PlanetOrigin, _super);

  function PlanetOrigin(cnt) {
    PlanetOrigin.__super__.constructor.call(this, cnt);
    this.setTexture("origin");
    this.canConstructShips = true;
  }

  PlanetOrigin.prototype.createMenu = function() {
    return new PlanetMenuOrigin(this, require("../templates/planet_menu_origin.html"));
  };

  return PlanetOrigin;

})(Planet);

module.exports = PlanetOrigin;


},{"../templates/planet_menu_origin.html":42,"./menu/planet_menu_origin":25,"./planet":26}],33:[function(require,module,exports){
var Planet, PlanetMenuAttack, PlanetMenuCollect, PlanetWar,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

PlanetMenuAttack = require("./menu/planet_menu_attack");

PlanetMenuCollect = require("./menu/planet_menu_collect");

Planet = require("./planet");

PlanetWar = (function(_super) {
  __extends(PlanetWar, _super);

  function PlanetWar(cnt, life) {
    PlanetWar.__super__.constructor.call(this, cnt);
    this.updateMenu();
    this.addLifebar(life);
  }

  PlanetWar.prototype.createMenu = function() {
    if (!this.menu) {
      return new PlanetMenuAttack(this, require("../templates/planet_menu_attack.html"));
    } else {
      return new PlanetMenuCollect(this, require("../templates/planet_menu_collect.html"));
    }
  };

  return PlanetWar;

})(Planet);

module.exports = PlanetWar;


},{"../templates/planet_menu_attack.html":38,"../templates/planet_menu_collect.html":39,"./menu/planet_menu_attack":20,"./menu/planet_menu_collect":21,"./planet":26}],34:[function(require,module,exports){
var Emitter, Resource, bigShips, gaz, minerals, ships,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Emitter = require("./components/emitter");

Resource = (function(_super) {
  __extends(Resource, _super);

  Resource.prototype.name = "";

  Resource.prototype.value = 0;

  function Resource(name, value) {
    this.name = name;
    this.value = value != null ? value : 0;
  }

  Resource.prototype.add = function(value) {
    this.value += value;
    return this.update();
  };

  Resource.prototype.substract = function(value) {
    this.value -= value;
    if (this.value < 0) {
      this.value = 0;
    }
    return this.update();
  };

  Resource.prototype.isMoreThan = function(value) {
    if (value > this.value) {
      return false;
    }
    return true;
  };

  Resource.prototype.update = function() {
    return this.emit("update");
  };

  return Resource;

})(Emitter);

minerals = exports.minerals = new Resource("M", 100);

gaz = exports.gaz = new Resource("G", 100);

ships = exports.ships = new Resource("SS", 0);

bigShips = exports.bigShips = new Resource("BS", 0);


},{"./components/emitter":4}],35:[function(require,module,exports){
module.exports = "<div class=\"planet-lifebar\"><span class=\"bar\"></span> <span class=\"value\"></span></div>\n";

},{}],36:[function(require,module,exports){
module.exports = "<div class=\"planet-menu\">\n  <ul>\n    <li>\n      <a class=\"planet-menu__entry amelio\" href=\"#\"><span class=\"title\">Research a faster drilling technology</span><span class=\"price\"></span><span class=\"progress\"></span></a>\n    </li>\n  </ul>\n</div>\n";

},{}],37:[function(require,module,exports){
module.exports = "<div class=\"planet-menu\">\n  <ul>\n    <li>\n      <a class=\"planet-menu__entry create-ship-10\" href=\"#\"><span class=\"title\">Create 10 spaceships</span><span class=\"price\"></span><span class=\"progress\"></span></a>\n    </li>\n    <li>\n      <a class=\"planet-menu__entry create-big-ship-1\" href=\"#\"><span class=\"title\">Create a big spaceship</span><span class=\"price\"></span><span class=\"progress\"></span></a>\n    </li>\n    <li>\n      <a class=\"planet-menu__entry create-big-ship-5\" href=\"#\"><span class=\"title\">Create 5 big spaceships</span><span class=\"price\"></span><span class=\"progress\"></span></a>\n    </li>\n  </ul>\n</div>\n";

},{}],38:[function(require,module,exports){
module.exports = "<div class=\"planet-menu\">\n  <ul>\n    <li>\n      <a class=\"planet-menu__entry attack\" href=\"#\"><span class=\"title\">ATTACK THE ENEMY BASE</span><span class=\"price\"></span><span class=\"progress\"></span></a>\n    </li>\n  </ul>\n</div>\n";

},{}],39:[function(require,module,exports){
module.exports = "<div class=\"planet-menu\">\n  <ul>\n    <li>\n      <a class=\"on planet-menu__entry drilling-minerals\" href=\"#\"><span class=\"title\">Build drilling minerals machine</span><span class=\"price\">(cost: 100M)</span><span class=\"progress\"></span></a>\n    </li>\n    <li>\n      <a class=\"planet-menu__entry upgrade-minerals\" href=\"#\"><span class=\"title\">Upgrade drilling minerals</span><span class=\"price\"></span><span class=\"progress\"></span></a>\n    </li>\n    <li>\n      <a class=\"on planet-menu__entry drilling-gaz\" href=\"#\"><span class=\"title\">Build drilling gaz machine</span><span class=\"price\">100</span><span class=\"progress\"></span></a>\n    </li>\n    <li>\n      <a class=\"planet-menu__entry upgrade-gaz\" href=\"#\"><span class=\"title\">Upgrade drilling gaz</span><span class=\"price\"></span><span class=\"progress\"></span></a>\n    </li>\n  </ul>\n</div>\n";

},{}],40:[function(require,module,exports){
module.exports = "<div class=\"planet-menu\">\n  <ul>\n    <li>\n      <a class=\"planet-menu__entry end\" href=\"#\"><span class=\"title\">Start drilling until there is no more resources anywhere...</span><span class=\"price\">(cost: 100M)</span><span class=\"progress\"></span></a>\n    </li>\n  </ul>\n</div>\n";

},{}],41:[function(require,module,exports){
module.exports = "<div class=\"planet-menu\">\n  <ul>\n    <li>\n      <a class=\"on planet-menu__entry invade\" href=\"#\"><span class=\"title\">Invade planet</span><span class=\"price\"></span><span class=\"progress\"></span></a>\n    </li>\n  </ul>\n</div>\n";

},{}],42:[function(require,module,exports){
module.exports = "<div class=\"planet-menu\">\n  <ul>\n    <li>\n      <a class=\"on planet-menu__entry drilling-minerals\" href=\"#\"><span class=\"title\">Build drilling minerals machine</span><span class=\"price\">(cost: 100M)</span><span class=\"progress\"></span></a>\n    </li>\n    <li>\n      <a class=\"planet-menu__entry upgrade-minerals\" href=\"#\"><span class=\"title\">Upgrade drilling minerals</span><span class=\"price\"></span><span class=\"progress\"></span></a>\n    </li>\n    <li>\n      <a class=\"on planet-menu__entry drilling-gaz\" href=\"#\"><span class=\"title\">Build drilling gaz machine</span><span class=\"price\">100</span><span class=\"progress\"></span></a>\n    </li>\n    <li>\n      <a class=\"planet-menu__entry upgrade-gaz\" href=\"#\"><span class=\"title\">Upgrade drilling gaz</span><span class=\"price\"></span><span class=\"progress\"></span></a>\n    </li>\n    <li>\n      <a class=\"planet-menu__entry create-ship-1\" href=\"#\"><span class=\"title\">Create a spaceship</span><span class=\"price\"></span><span class=\"progress\"></span></a>\n    </li>\n  </ul>\n</div>\n";

},{}],43:[function(require,module,exports){
module.exports = {
  planets: {
    origin: require("./textures/planets/origin.html"),
    collect_0: require("./textures/planets/collect_0.html"),
    army_0: require("./textures/planets/army_0.html"),
    war_0: require("./textures/planets/war_0.html"),
    amelio_0: require("./textures/planets/amelio_0.html"),
    end: require("./textures/planets/end.html")
  }
};


},{"./textures/planets/amelio_0.html":44,"./textures/planets/army_0.html":45,"./textures/planets/collect_0.html":46,"./textures/planets/end.html":47,"./textures/planets/origin.html":48,"./textures/planets/war_0.html":49}],44:[function(require,module,exports){
module.exports = "<table cellspacing=\"0\" cellpadding=\"0\" style=\"display: inline; width: 90px; height: 90px; white-space: pre; margin: 0px; padding: 0px; letter-spacing: -1.04px; font-family: 'courier new'; font-size: 12px; line-height: 12px; text-align: left; text-decoration: none;\"><tbody><tr><td>               <br>    fLOZOo;    <br>   ,FZOOOOOO?  <br>      .;?/,    <br> ?OOF?,. .;Fz. <br> /ZOOOOLozzLZ: <br>  ,L#ZollzLz.  <br>     ,??/,     <br></td></tr></tbody></table>\n";

},{}],45:[function(require,module,exports){
module.exports = "<table cellspacing=\"0\" cellpadding=\"0\" style=\"display: inline; width: 180px; height: 180px; white-space: pre; margin: 0px; padding: 0px; letter-spacing: -1.04px; font-family: 'courier new'; font-size: 12px; line-height: 12px; text-align: left; text-decoration: none;\"><tbody><tr><td>                              <br>                              <br>        ,?llllllllll/.        <br>      /lllllllllllooooo?,     <br>    :lllllllllllloooooooo?,   <br>   :lllllloooolllllllllloof,  <br>  .lllf?flooooolllllllllloo?. <br>  :f?;;:;?looooollllllllllo/. <br>  ,?;:::::/?fllooolllllllll: .<br>  .??;;:::;??fllooooooooool.  <br>   :f??/;;;/fllllooooooooo/   <br>    ,f?//?flllllooooooool,    <br>      ;lllllloooooollll;      <br>        ./lllllllllf;.        <br>                              <br></td></tr></tbody></table>\n";

},{}],46:[function(require,module,exports){
module.exports = "<table cellspacing=\"0\" cellpadding=\"0\" style=\"display: inline; width: 210px; height: 210px; white-space: pre; margin: 0px; padding: 0px; letter-spacing: -1.04px; font-family: 'courier new'; font-size: 12px; line-height: 12px; text-align: left; text-decoration: none;\"><tbody><tr><td>                                   <br>                                   <br>           ,;ttttttttt;,           <br>        :ttttttttttttttttt:        <br>      :ttttttttttttttttttttt:      <br>     1ttttt1ttttttttttttttttt1     <br>    1ttttt1ttttttttttttttttttt1    <br>   ;ttt1iii1ttttttttttttttttttt;   <br>   tti;;:;i11ttttttttttttttttttt   <br>   1;:::,,::;i11tttttttttttttttt  .<br>   ii;::,,,,,:;i1tttttttttttttt1   <br>   ,11i;;::::::::;i1ttttttttttt:   <br>    :11i;;:::::::;;itttttttttti    <br>     ,t1i;::::::;iitttttttttt,     <br>       ;ttt11i1tttttttttttt;       <br>         .ittttttttttttti.         <br>              .::;::.              <br>                                   <br></td></tr></tbody></table>\n";

},{}],47:[function(require,module,exports){
module.exports = "<table cellspacing=\"0\" cellpadding=\"0\" style=\"display: inline; width: 1200px; height: 720px; white-space: pre; margin: 0px; padding: 0px; letter-spacing: -1.04px; font-family: 'courier new'; font-size: 12px; line-height: 12px; text-align: left; text-decoration: none;\"><tbody><tr><td>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                    ,//;,                                                                                                                                                               <br>                                   :zzFzzf.                                                                                                                                                             <br>                                   ,fzzzl/                                                                                                                                                              <br>                                    .::,                                                                                                                                                                <br>                                                                                                                                                                                                        <br>                                                                                                            .,                                                                                          <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                                                                                                                                                                        <br>                                                 ,                                                                                                                                                      <br>                                                                                                                                                                         .,,..                          <br>           .;flf?:.                             .:;/;.                         .,:;/?looooFzFozFFzoFFzl?;;,,...                                                          ...                            <br>          ,lzoFFzzo;                           :/ll/;.              ,,://fzoFzzFLLLOOOOLLOLOOLOLOLOOLLoof;:,:,,,.,.......,                                                                              <br>          ,lzFFFFFzo,                                    ,,:?flFFLLZOZ#Z############################Z##LFFf??l?/?/f/;;/f?///;//::;:,.                                                                   <br>          .?zFFzzzo/.                            ..;ozLOZFZZZ###############0###Z#############################0########Z#######ZZOZOOFLFf::,..                                                          <br>           .:;/;:.                         .:/oLLFOZZZ#####0##############ZZOLLFFLOOZZ########################0#########################ZLof??;;;;:::::,.                                               <br>                                      .:/loLOOOZOZ##00002000000#OFFFzFLOZ##OLzlollFooFLLZZZZZZOZZOOOOOOOOOOOOOOZZZZ######################ZZZZOFOzFZLzLFzLlo?;:                                          <br>                                  .,;lFLOZZO##000200222020000##000000000000#ZLzoozFzFLOOZOOOOOOOOOOOLLLOLLLOOLLLOOLOOOOOOOZ##########ZZZZZZZZZZOOOOOLOOOOLLzLoll?:.                                     <br>                               :;fzlLZZZ#00002222222000002200000000000220000####ZZZZOZZOOOLOOLOOLLOLLLLLLLLLLLLLLLLLLOOLLLOOOOOZZZZZZZZZZZZOOLLLLFFLLLLLLOLOOLLOlzzff:,                 ..              <br>                           .,?ozLLLOZZ##0002022222022222222000###ZOOFzzoozzFOZZZZZZZOZZOOOOOOLLLLOLOLLLLLLLLLLLLLLLLOLLOLLLOOOLOOOOOOOLLLLLLLFFFFFzzFFzFzFFFLOOLLFLOFFlf?:           ,fzzol:            <br>             .          .:/zzLLZZZ#Z##0022222222222222000#OLLLOZZZZ###OFolzFLOZZZZZOZZOOOOOLOOLOLOOLLLLLLLLLLLLLLLLLLLOLLOOOOOOOOOOLLLLFFFFFzFzFFzFFzzzzzzzzzFFLLOOLOLLLFFof?;.      /ooof,             <br>                      ,/?LFLOZ##Z##00222222222222000#FZ####0000022020000ZOOZ##ZZZZZZZZZOOOOOOOOOOOOLLLLOOLLLLLLLLLLOLLLOOOLOOOOOOLLLLFFFzzFzzzFzzzzzzzzzzzzzzzzzFFFLOOLOOLOLzol?/,                      <br>                   .;flFFOZZZ##00#222222222220##0###0000002222222222000#OLLLZ##############ZZZZZZOOOOOOOLOOLLLFLLOOOOOOOOOOLOOOOLLFFFFzzzzzzzzzzzzzzzzzozzzzzzzzzzzzFLOOLZOFOZLFllf/,                   <br>                 ./fFLFOZ####00002222000000#Z###0000002222222220200000000#ZLFZ####################Z#ZZZZOOOLLLLFLLLLLOOOOOOLOOOLLFFFzzzzzzzzzzozzozzzzoozzzozzzzzzzzFFFLLOOZZZZzLLzzol/.                <br>               .?zzLZOZ###00000200000#ZLzFLZ#000022222222222222002022000#ZLLZ#Z######################ZZOOOOOLLLLFLFFFFLLLLLLLLOLLFFzzzzzzzzzzzozoozzozzozzzzzzzzzzzFzFFLLOOZ###ZZZOOFlFlf;.             <br>             :?zLZZ######00000020000###00002022222222222222222222222200000###################0###ZZZOZOOZLOOLLLLFFFFFFFFFLFFFFLFFFFLFzzzzzzzzzzzzozzozzozzzzzzzzzzzFFFFLLLOZZZ###OZZZZZzLol/.           <br>          ./fLOZ########00000002000000222222202222220202200002222222000000###################0##ZZZOOOOOLLLLLFFFFFLFFFFzFFFFFFFzFzFFzzFzzFzzzzzzzzzozozzzzzzzzzFFFFFFFFFFLOOOOZZZZ#Z##ZOZFFolf;.        <br>        ,?FOZ##################0000222220222222202000000000000000000000########################ZZZOOOOOLFFLLFFFFFFFFFFFFFFFFFzzFzFzzzzzzzFFFzFzzzzzzzzzzzzzzzzFFFFFFFFFFLLLLOOOOZZ######ZZOLLolf;.      <br>      ;oOZZ##################00000222200220220000000##########################################ZZZOOOOLLFLFFFLFFFFFFFLFFFFFFFzFFFzFzzzzzFFFzFFFFFLFFFFFLFzFFzzFFFFFFLLLLLLLOOOOZOZZZ#####Z##ZOLOolo/.    <br></td></tr></tbody></table>\n";

},{}],48:[function(require,module,exports){
module.exports = "<table cellspacing=\"0\" cellpadding=\"0\" style=\"display: inline; width: 108px; height: 108px; white-space: pre; margin: 0px; padding: 0px; letter-spacing: -1.04px; font-family: 'courier new'; font-size: 12px; line-height: 12px; text-align: left; text-decoration: none;\"><tbody><tr><td>       .,,..      <br>   .itt;;;;;;;:   <br>  ittft;:;11tti;: <br> i11tffffftff1;;;:<br>,111tfffffft;1t1t1<br>.tffffffffftiiitf1<br> ;tttttttffffffff,<br>  ,tttffffffffft. <br>    .itttttt1;.   <br></td></tr></tbody></table>\n";

},{}],49:[function(require,module,exports){
module.exports = "<table cellspacing=\"0\" cellpadding=\"0\" style=\"display: inline; width: 180px; height: 180px; white-space: pre; margin: 0px; padding: 0px; letter-spacing: -1.04px; font-family: 'courier new'; font-size: 12px; line-height: 12px; text-align: left; text-decoration: none;\"><tbody><tr><td>                              <br>  .:,                  ,oZZf. <br> .o/    ,:?flllf?//:.  :FLF/  <br>      ,?ooolllllozFOOLf,      <br>     /ooollllllloooozLLF?     <br>    floolooooooooooooooll?    <br>   ?llooloozzFLLLFzoooooll?   <br>  ,lllloolllllllooooooooool,  <br>  ;lllllllllooooolflloloool:  <br>  ,llzFLOOOLFoolff?flfolool,  <br>   ?lllllloooolfoZ#Zzfllll?   <br>   .flllllllf?;:;flf///fl?    <br>     ;fllllf/;::;:;///??,     <br>       :flllf/;::;??ff,   ,.  <br>          .:/???//:.    .;:.  <br></td></tr></tbody></table>\n";

},{}],50:[function(require,module,exports){
var Universe, amelio, planetFactory, resources,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

planetFactory = require("./planets/planet_factory");

resources = require("./resources");

amelio = require("./amelio");

Universe = (function() {
  Universe.prototype.dom = null;

  Universe.prototype.planets = null;

  function Universe() {
    this.createPlanets = __bind(this.createPlanets, this);
    this.dom = document.getElementById("universe");
    this.planets = [];
    resources.ships.once("update", (function(_this) {
      return function() {
        _this.dom.classList.add("expand");
        return _this.createPlanets();
      };
    })(this));
  }

  Universe.prototype.create = function() {
    return this.createOrigin();
  };

  Universe.prototype.createOrigin = function() {
    var planet;
    planet = planetFactory("origin");
    planet.unlock();
    return this.planets.push(planet);
  };

  Universe.prototype.createPlanets = function() {
    var planet;
    planet = planetFactory("collect_0");
    planet.setTexture("collect_0");
    this.planets.push(planet);
    planet = planetFactory("army_0");
    planet.setTexture("army_0");
    this.planets.push(planet);
    planet = planetFactory("war_0", 200);
    planet.setTexture("war_0");
    this.planets.push(planet);
    planet = planetFactory("amelio_0", 400);
    planet.setTexture("amelio_0");
    planet.amelio = amelio.resources;
    this.planets.push(planet);
    planet = planetFactory("end", 1500);
    planet.setTexture("end");
    return this.planets.push(planet);
  };

  return Universe;

})();

module.exports = new Universe();


},{"./amelio":1,"./planets/planet_factory":31,"./resources":34}]},{},[8])