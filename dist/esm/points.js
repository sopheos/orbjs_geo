import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
import { Point } from "./point";

/**
 * Points
 */
export var Points = /*#__PURE__*/function () {
  function Points() {
    _classCallCheck(this, Points);
    _defineProperty(this, "points", []);
  }
  return _createClass(Points, [{
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
      if (!this.points.length) return [new Point(-180, -180), new Point(180, 180)];
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
      return [new Point(minlat, minlon), new Point(maxlat, maxlon)];
    }
  }, {
    key: "center",
    value: function center() {
      if (!this.points.length) return new Point();
      var bounds = this.bounds();
      var lat = (bounds[0].getLat() + bounds[1].getLat()) / 2;
      var lon = (bounds[0].getLon() + bounds[1].getLon()) / 2;
      return new Point(lat, lon);
    }
  }, {
    key: "closer",
    value: function closer() {
      if (!this.points.length) return new Point();
      var center = this.center();
      var min = null;
      var item = new Point();
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