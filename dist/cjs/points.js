"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Points = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _point = require("./point");
/**
 * Points
 */
var Points = exports.Points = /*#__PURE__*/function () {
  function Points() {
    (0, _classCallCheck2.default)(this, Points);
    (0, _defineProperty2.default)(this, "points", []);
  }
  return (0, _createClass2.default)(Points, [{
    key: "add",
    value: function add(point) {
      this.points.push(point);
      return this;
    }
  }, {
    key: "all",
    value: function all() {
      return this.points;
    }
  }, {
    key: "bounds",
    value: function bounds() {
      if (!this.points.length) return [new _point.Point(-180, -180), new _point.Point(180, 180)];
      var minlat = 0;
      var maxlat = 0;
      var minlon = 0;
      var maxlon = 0;
      var i = 0;
      this.points.forEach(function (point) {
        if (i === 0) {
          minlat = point.getLat();
          maxlat = point.getLat();
          minlon = point.getLon();
          maxlon = point.getLon();
        } else {
          if (minlat > point.getLat()) minlat = point.getLat();
          if (maxlat < point.getLat()) maxlat = point.getLat();
          if (minlon > point.getLon()) minlon = point.getLon();
          if (maxlon < point.getLon()) maxlon = point.getLon();
        }
        i++;
      });
      return [new _point.Point(minlat, minlon), new _point.Point(maxlat, maxlon)];
    }
  }, {
    key: "center",
    value: function center() {
      if (!this.points.length) return new _point.Point();
      var bounds = this.bounds();
      var lat = (bounds[0].getLat() + bounds[1].getLat()) / 2;
      var lon = (bounds[0].getLon() + bounds[1].getLon()) / 2;
      return new _point.Point(lat, lon);
    }
  }, {
    key: "closer",
    value: function closer() {
      if (!this.points.length) return new _point.Point();
      var center = this.center();
      var min = null;
      var item = new _point.Point();
      ;
      this.points.forEach(function (point) {
        var d = center.distanceTo(point);
        if (min === null || min > d) {
          min = d;
          item = point;
        }
      });
      return item;
    }
  }]);
}();
//# sourceMappingURL=points.js.map