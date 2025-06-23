import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _defineProperty from "@babel/runtime/helpers/defineProperty";
/**
 * Point
 */
export var Point = /*#__PURE__*/function () {
  // -------------------------------------------------------------------------
  // Constructor
  // -------------------------------------------------------------------------

  function Point() {
    var lat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var lon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    _classCallCheck(this, Point);
    _defineProperty(this, "lat", void 0);
    _defineProperty(this, "lon", void 0);
    _defineProperty(this, "rad_lat", null);
    _defineProperty(this, "rad_lon", null);
    this.lat = lat;
    this.lon = lon;
  }
  return _createClass(Point, [{
    key: "setLat",
    value:
    // -------------------------------------------------------------------------
    // Setter
    // -------------------------------------------------------------------------

    function setLat(lat) {
      this.lat = lat;
      this.rad_lat = null;
      return this;
    }
  }, {
    key: "setLon",
    value: function setLon(lon) {
      this.lon = lon;
      this.rad_lon = null;
      return this;
    }

    // -------------------------------------------------------------------------
    // Getter
    // -------------------------------------------------------------------------
  }, {
    key: "isNull",
    value: function isNull() {
      return this.lat === 0 && this.lon === 0;
    }
  }, {
    key: "getLat",
    value: function getLat() {
      return this.lat;
    }
  }, {
    key: "getLon",
    value: function getLon() {
      return this.lon;
    }
  }, {
    key: "getLatInt",
    value: function getLatInt() {
      return Point.toInt(this.lat);
    }
  }, {
    key: "getLonInt",
    value: function getLonInt() {
      return Point.toInt(this.lon);
    }
  }, {
    key: "getRadLat",
    value: function getRadLat() {
      if (this.rad_lat === null) {
        this.rad_lat = this.lat * Math.PI / 180;
      }
      return this.rad_lat;
    }
  }, {
    key: "getRadLon",
    value: function getRadLon() {
      if (this.rad_lon === null) {
        this.rad_lon = this.lon * Math.PI / 180;
      }
      return this.rad_lon;
    }
  }, {
    key: "latlng",
    value: function latlng() {
      return {
        lat: this.lat,
        lng: this.lon
      };
    }
  }, {
    key: "latlon",
    value: function latlon() {
      return {
        lat: this.lat,
        lon: this.lon
      };
    }

    // -------------------------------------------------------------------------
    // Tools
    // -------------------------------------------------------------------------
  }, {
    key: "distanceTo",
    value: function distanceTo(point) {
      var tLat = this.getRadLat();
      var tLon = this.getRadLon();
      var pLat = point.getRadLat();
      var pLon = point.getRadLon();
      return Math.acos(Math.sin(tLat) * Math.sin(pLat) + Math.cos(tLat) * Math.cos(pLat) * Math.cos(tLon - pLon)) * Point.EARTH_RADIUS;
    }
  }, {
    key: "isInside",
    value: function isInside(path, min, max) {
      var _this = this;
      var inside = false;
      if (min && max) {
        inside = this.getLat() >= min.getLat() && this.getLat() <= max.getLat() && this.getLon() >= min.getLon() && this.getLon() <= max.getLon();
        if (inside === false) return inside;
      }
      if (!path) return inside;
      if (path.outer && path.outer.length) {
        path.outer.some(function (outer) {
          inside = _this.insidePoly(outer);
          return inside;
        });
      }
      if (inside && path.inner && path.inner.length) {
        path.inner.every(function (inner) {
          inside = _this.insidePoly(inner);
          return inside;
        });
      }
      return inside;
    }
  }, {
    key: "insidePoly",
    value: function insidePoly(vertices) {
      return Point.insideVertice(this.lat, this.lon, vertices);
    }
  }, {
    key: "insideGeoJson",
    value: function insideGeoJson(geojson) {
      if (!geojson.type || !geojson.coordinates) {
        return false;
      }
      if (geojson.type === 'Polygon') {
        return this.insideGeoCoordinates(geojson.coordinates);
      } else if (geojson.type === 'MultiPolygon') {
        for (var i = 0; i < geojson.coordinates.length; i++) {
          if (this.insideGeoCoordinates(geojson.coordinates[i])) {
            return true;
          }
        }
      }
      return false;
    }
  }, {
    key: "insideGeoCoordinates",
    value: function insideGeoCoordinates(coords) {
      if (!coords.length) {
        return false;
      }
      var inside = Point.insideVertice(this.lon, this.lat, coords[0]);

      // Holes
      if (inside && coords.length > 1) {
        for (var i = 1; i < coords.length; i++) {
          if (Point.insideVertice(this.lon, this.lat, coords[i])) {
            return false;
          }
        }
      }
      return inside;
    }
  }], [{
    key: "fromDegree",
    value: function fromDegree() {
      var lat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var lon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return new Point(lat, lon);
    }
  }, {
    key: "fromRadian",
    value: function fromRadian() {
      var lat = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var lon = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      return new Point(lat * 180 / Math.PI, lon * 180 / Math.PI);
    }
  }, {
    key: "fromMn95",
    value: function fromMn95() {
      var e = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
      // Convertir les coordonnées de projection E (coordonnée est) 
      // et N (coordonnée nord) en MN95 
      // dans le système civil (Berne = 0 / 0) 
      // et exprimer dans l'unité [1000 km]
      var y = (e - 2600000) / 1000000;
      var x = (n - 1200000) / 1000000;

      // Calculer la longitude et la latitude dans l'unité [10000"]
      var lon_i = 2.6779094;
      lon_i += 4.728982 * y;
      lon_i += +0.791484 * y * x;
      lon_i += 0.1306 * y * x * x;
      lon_i -= 0.0436 * y * y * y;
      var lat_i = 16.9023892;
      lat_i += 3.238272 * x;
      lat_i -= 0.270978 * y * y;
      lat_i -= 0.002528 * x * x;
      lat_i -= 0.0447 * y * y * x;
      lat_i -= 0.0140 * x * x * x;

      // Convertir la longitude et la latitude dans l'unité [°]
      var lon = lon_i * 100 / 36;
      var lat = lat_i * 100 / 36;
      return new Point(lat, lon);
    }
  }, {
    key: "insideVertice",
    value: function insideVertice(x, y, vertices) {
      var inside = false;
      var l = vertices.length;
      var i = 0;
      var j = l - 1;
      for (; i < l; j = i++) {
        var xi = vertices[i][0];
        var yi = vertices[i][1];
        var xj = vertices[j][0];
        var yj = vertices[j][1];
        var intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
      return inside;
    }
  }, {
    key: "toInt",
    value: function toInt(val) {
      var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000000;
      return Math.floor(val * precision);
    }
  }, {
    key: "toFloat",
    value: function toFloat(val) {
      var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1000000;
      return val / precision;
    }
  }]);
}();
_defineProperty(Point, "EARTH_RADIUS", 6378137);
//# sourceMappingURL=point.js.map