(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

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

},{}],2:[function(require,module,exports){

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
var elts, update;

elts = [];

update = function() {
  var elt, _i, _len;
  for (_i = 0, _len = elts.length; _i < _len; _i++) {
    elt = elts[_i];
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


},{}],4:[function(require,module,exports){
var menu, universe;

menu = (require("./menu"))();

universe = require("./universe");

universe.create();

module.exports = {
  resize: function(hh) {
    return universe.dom.style.top = hh * .5 - 75 + "px";
  }
};


},{"./menu":6,"./universe":13}],5:[function(require,module,exports){
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


},{"./game":4}],6:[function(require,module,exports){
var menuGazValue, menuMineralsValue, menuResources, resources, updateResources;

resources = require("./resources");

updateResources = function() {
  menuMineralsValue.innerHTML = resources.minerals.value;
  return menuGazValue.innerHTML = resources.gaz.value;
};

menuResources = document.getElementById("menu__resources");

menuMineralsValue = menuResources.querySelector(".minerals .value");

menuGazValue = menuResources.querySelector(".gaz .value");

updateResources();

module.exports = function() {
  resources.minerals.on("update", updateResources);
  return resources.gaz.on("update", updateResources);
};


},{"./resources":9}],7:[function(require,module,exports){
var Planet, PlanetMenu, domify, textures;

domify = require("./components/domify");

textures = require("./textures");

PlanetMenu = require("./planet_menu");

Planet = (function() {
  Planet.prototype.cnt = null;

  Planet.prototype.menu = null;

  Planet.prototype.locked = true;

  Planet.prototype.drillingLevel = {
    minerals: 0,
    gaz: 0
  };

  function Planet(cnt) {
    this.cnt = cnt;
  }

  Planet.prototype.setTexture = function(name) {
    var dom;
    dom = domify(textures.planets[name]);
    return this.cnt.appendChild(dom);
  };

  Planet.prototype.unlock = function() {
    this.menu = new PlanetMenu(this);
    this.menu.enableDrillingMinerals();
    this.cnt.appendChild(this.menu.dom);
    return this.locked = false;
  };

  return Planet;

})();

module.exports = Planet;


},{"./components/domify":1,"./planet_menu":8,"./textures":11}],8:[function(require,module,exports){
var Emitter, PlanetMenu, PlanetMenuEntry, domify, format, resources, updateManager,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

domify = require("./components/domify");

Emitter = require("./components/emitter");

resources = require("./resources");

updateManager = require("./core/updateManager");

PlanetMenuEntry = (function(_super) {
  __extends(PlanetMenuEntry, _super);

  PlanetMenuEntry.prototype.dom = null;

  PlanetMenuEntry.prototype.resource = null;

  PlanetMenuEntry.prototype.progress = 0;

  PlanetMenuEntry.prototype.price = 0;

  PlanetMenuEntry.prototype.speed = 0;

  PlanetMenuEntry.prototype.domPrice = null;

  PlanetMenuEntry.prototype.domProgress = null;

  function PlanetMenuEntry(dom, resource, price, speed) {
    this.dom = dom;
    this.resource = resource;
    this.price = price != null ? price : 0;
    this.speed = speed != null ? speed : 0;
    this.domPrice = this.dom.querySelector(".price");
    this.domProgress = this.dom.querySelector(".progress");
    this.dom.addEventListener("click", (function(_this) {
      return function(e) {
        e.preventDefault();
        if (_this.resource.isMoreThan(_this.price)) {
          _this.resource.substract(_this.price);
          return _this.start();
        }
      };
    })(this));
    this.updatePrice();
  }

  PlanetMenuEntry.prototype.updatePrice = function() {
    return this.domPrice.innerHTML = "(cost: " + this.price + this.resource.name + ")";
  };

  PlanetMenuEntry.prototype.updateProgress = function() {
    var s;
    if (this.progress === 0) {
      return;
    }
    s = format(this.progress.toString());
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

format = function(s) {
  var i, idx, j, _i;
  idx = s.indexOf(".");
  if (idx < 0) {
    s += ".00";
  } else {
    i = s.length - idx - 1;
    for (j = _i = 0; 0 <= i ? _i <= i : _i >= i; j = 0 <= i ? ++_i : --_i) {
      s += "0";
    }
    console.log(s);
  }
  return s;
};

PlanetMenu = (function(_super) {
  __extends(PlanetMenu, _super);

  PlanetMenu.prototype.planet = null;

  PlanetMenu.prototype.dom = null;

  function PlanetMenu(planet) {
    this.planet = planet;
    this.dom = domify(require("./templates/planet_menu.html"));
  }

  PlanetMenu.prototype.enableDrillingMinerals = function() {
    var entry;
    entry = new PlanetMenuEntry(this.dom.querySelector(".drilling-minerals"), resources.minerals, 100, .25);
    entry.enable();
    return entry.on("complete", (function(_this) {
      return function() {
        _this.planet.drillingLevel.minerals = 1;
        entry.disable();
        return _this.enableDrillingGaz();
      };
    })(this));
  };

  PlanetMenu.prototype.enableDrillingGaz = function() {
    var entry;
    entry = new PlanetMenuEntry(this.dom.querySelector(".drilling-gaz"), resources.gaz, 100, 2);
    return entry.enable();
  };

  return PlanetMenu;

})(Emitter);

module.exports = PlanetMenu;


},{"./components/domify":1,"./components/emitter":2,"./core/updateManager":3,"./resources":9,"./templates/planet_menu.html":10}],9:[function(require,module,exports){
var Emitter, Resource, domGaz, domMenuResources, domMinerals, gaz, minerals,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

Emitter = require("./components/emitter");

Resource = (function(_super) {
  __extends(Resource, _super);

  Resource.prototype.name = "";

  Resource.prototype.value = 0;

  function Resource(name, dom, value) {
    this.name = name;
    this.dom = dom;
    this.value = value != null ? value : 0;
  }

  Resource.prototype.add = function(value) {
    this.value += value;
    return update();
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
    this.dom.innerHtml = this.value;
    return this.emit("update");
  };

  return Resource;

})(Emitter);

domMenuResources = document.getElementById("menu__resources");

domMinerals = domMenuResources.querySelector(".minerals .value");

domGaz = domMenuResources.querySelector(".gaz .value");

minerals = exports.minerals = new Resource("M", domMinerals, 100);

gaz = exports.gaz = new Resource("G", domGaz);


},{"./components/emitter":2}],10:[function(require,module,exports){
module.exports = "<div class=\"planet-menu\">\n  <ul>\n    <li>\n      <a class=\"on planet-menu__entry drilling-minerals\" href=\"#\"><span class=\"title\">Build drilling minerals</span><span class=\"price\">(cost: 100M)</span><span class=\"progress\"></span></a>\n    </li>\n    <li>\n      <a class=\"on planet-menu__entry drilling-gaz\" href=\"#\"><span class=\"title\">Build drilling gaz</span><span class=\"price\">100</span><span class=\"progress\"></span></a>\n    </li>\n    <li>\n      <a class=\"planet-menu__entry upgrade-drilling\" href=\"#\"><span class=\"title\">Upgrade drilling minerals</span><span class=\"price\"></span><span class=\"progress\"></span></a>\n    </li>\n    <li>\n      <a class=\"planet-menu__entry upgrade-gaz\" href=\"#\"><span class=\"title\">Upgrade drilling gaz</span><span class=\"price\"></span><span class=\"progress\"></span></a>\n    </li>\n  </ul>\n</div>\n";

},{}],11:[function(require,module,exports){
module.exports = {
  planets: {
    origin: require("./textures/planets/origin.html")
  }
};


},{"./textures/planets/origin.html":12}],12:[function(require,module,exports){
module.exports = "<table cellspacing=\"0\" cellpadding=\"0\" style=\"display: inline; width: 108px; height: 108px; white-space: pre; margin: 0px; padding: 0px; letter-spacing: -1.04px; font-family: 'courier new'; font-size: 12px; line-height: 12px; text-align: left; text-decoration: none;\"><tbody><tr><td>       .,,..      <br>   .itt;;;;;;;:   <br>  ittft;:;11tti;: <br> i11tffffftff1;;;:<br>,111tfffffft;1t1t1<br>.tffffffffftiiitf1<br> ;tttttttffffffff,<br>  ,tttffffffffft. <br>    .itttttt1;.   <br></td></tr></tbody></table>\n";

},{}],13:[function(require,module,exports){
var Planet, Universe;

Planet = require("./planet");

Universe = (function() {
  Universe.prototype.dom = null;

  Universe.prototype.planets = null;

  function Universe() {
    this.dom = document.getElementById("universe");
    this.planets = [];
  }

  Universe.prototype.create = function() {
    this.createOrigin();
    return this.createPlanets();
  };

  Universe.prototype.createOrigin = function() {
    var planet;
    planet = new Planet(document.getElementById("origin"));
    planet.setTexture("origin");
    return planet.unlock();
  };

  Universe.prototype.createPlanets = function() {};

  return Universe;

})();

module.exports = new Universe();


},{"./planet":7}]},{},[5])