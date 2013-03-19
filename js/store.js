// ============================================
// Store - localStorage
// ============================================

app.store = (function(m){

  var _this = {};

  _this.set = function(name, value) {
    return (m.localstorage) ? (localStorage.setItem(name, value) || true) : false;
  }

  _this.get = function(name) {
    return (m.localstorage) ? localStorage.getItem(name) : false;
  }

  _this.setJson = function(name, json) {
    var val = a_.isString(val) ? val : JSON.stringify(json)
    return (val) ? _this.set(name, val) : false;
  }

  _this.getJson = function(name, json) {
    var val = _this.get(name)
    return (val) ? a_.toJson(val) : false;
  }

  _this.remove = function(name) {
    return (m.localstorage) ? (localStorage.removeItem(name) && true) : false;
  }

  return _this;
})(Modernizr);
