
/**
 * Point
 */
export class Point {

    static readonly EARTH_RADIUS = 6378137;

    private lat: number;
    private lon: number;
    private rad_lat: number | null = null;
    private rad_lon: number | null = null

    // -------------------------------------------------------------------------
    // Constructor
    // -------------------------------------------------------------------------

    public constructor(lat: number = 0, lon: number = 0) {
        this.lat = lat;
        this.lon = lon;
    }

    public static fromDegree(lat: number = 0, lon: number = 0): Point {
        return new Point(lat, lon);
    }

    public static fromRadian(lat: number = 0, lon: number = 0): Point {
        return new Point(lat * 180 / Math.PI, lon * 180 / Math.PI);
    }

    public static fromMn95(e: number = 0, n: number = 0): Point {
        // Convertir les coordonnées de projection E (coordonnée est) 
        // et N (coordonnée nord) en MN95 
        // dans le système civil (Berne = 0 / 0) 
        // et exprimer dans l'unité [1000 km]
        let y = (e - 2600000) / 1000000;
        let x = (n - 1200000) / 1000000;

        // Calculer la longitude et la latitude dans l'unité [10000"]
        let lon_i = 2.6779094;
        lon_i += 4.728982 * y;
        lon_i += + 0.791484 * y * x;
        lon_i += 0.1306 * y * x * x;
        lon_i -= 0.0436 * y * y * y;

        let lat_i = 16.9023892;
        lat_i += 3.238272 * x;
        lat_i -= 0.270978 * y * y;
        lat_i -= 0.002528 * x * x;
        lat_i -= 0.0447 * y * y * x;
        lat_i -= 0.0140 * x * x * x;

        // Convertir la longitude et la latitude dans l'unité [°]
        let lon = lon_i * 100 / 36;
        let lat = lat_i * 100 / 36;

        return new Point(lat, lon);
    }

    // -------------------------------------------------------------------------
    // Setter
    // -------------------------------------------------------------------------

    public setLat(lat: number): Point {
        this.lat = lat;
        this.rad_lat = null;
        return this;
    }

    public setLon(lon: number): Point {
        this.lon = lon;
        this.rad_lon = null;
        return this;
    }

    // -------------------------------------------------------------------------
    // Getter
    // -------------------------------------------------------------------------

    public isNull(): boolean {
        return this.lat === 0 && this.lon === 0;
    }

    public getLat(): number {
        return this.lat;
    }

    public getLon(): number {
        return this.lon;
    }

    public getLatInt(): number {
        return Point.toInt(this.lat);
    }

    public getLonInt(): number {
        return Point.toInt(this.lon);
    }

    public getRadLat(): number {
        if (this.rad_lat === null) {
            this.rad_lat = this.lat * Math.PI / 180;
        }

        return this.rad_lat;
    }

    public getRadLon(): number {
        if (this.rad_lon === null) {
            this.rad_lon = this.lon * Math.PI / 180;
        }

        return this.rad_lon;
    }

    public latlng(): any {
        return { lat: this.lat, lng: this.lon };
    }

    public latlon(): any {
        return { lat: this.lat, lon: this.lon };
    }

    // -------------------------------------------------------------------------
    // Tools
    // -------------------------------------------------------------------------


    public distanceTo(point: Point): number {

        let tLat = this.getRadLat();
        let tLon = this.getRadLon();
        let pLat = point.getRadLat();
        let pLon = point.getRadLon();

        return Math.acos(Math.sin(tLat) * Math.sin(pLat) +
            Math.cos(tLat) * Math.cos(pLat) *
            Math.cos(tLon - pLon)) * Point.EARTH_RADIUS;
    }

    public isInside(path: any, min: Point, max: Point): boolean {

        let inside = false;

        if (min && max) {
            inside = this.getLat() >= min.getLat()
                && this.getLat() <= max.getLat()
                && this.getLon() >= min.getLon()
                && this.getLon() <= max.getLon();

            if (inside === false) return inside;
        }

        if (!path) return inside;

        if (path.outer && path.outer.length) {
            path.outer.some((outer: number[][]) => {
                inside = this.insidePoly(outer);
                return inside;
            });
        }

        if (inside && path.inner && path.inner.length) {
            path.inner.every((inner: number[][]) => {
                inside = this.insidePoly(inner);
                return inside;
            });
        }

        return inside;
    }

    public insidePoly(vertices: number[][]): boolean {
        return Point.insideVertice(this.lat, this.lon, vertices);
    }

    public insideGeoJson(geojson: any) {
        
        if(! geojson.type || ! geojson.coordinates) {
            return false;
        }

        if(geojson.type === 'Polygon') {
            return this.insideGeoCoordinates(geojson.coordinates)
        } else if(geojson.type === 'MultiPolygon') {
            for(let i = 0; i < geojson.coordinates.length; i++) {
                if(this.insideGeoCoordinates(geojson.coordinates[i])) {
                    return true;
                }
            }
        }

        return false;
    }

    private insideGeoCoordinates(coords: number[][][]) {
        if(! coords.length) {
            return false;
        }

        let inside = Point.insideVertice(this.lon, this.lat, coords[0]);

        // Holes
        if(inside && coords.length > 1) {
            for(let i = 1; i < coords.length; i++) {
                if(Point.insideVertice(this.lon, this.lat, coords[i])) {
                    return false;
                }
            }
        }

        return inside;
    }

    public static insideVertice(x: number, y: number, vertices: number[][]): boolean {
        let inside = false;

        let l = vertices.length;
        let i = 0;
        let j = l - 1;

        for (; i < l; j = i++) {

            let xi = vertices[i][0];
            let yi = vertices[i][1];
            let xj = vertices[j][0];
            let yj = vertices[j][1];

            let intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

            if (intersect) inside = !inside;
        }

        return inside;
    }

    public static toInt(val: number, precision: number = 1000000): number {
        return Math.floor(val * precision);
    }

    public static toFloat(val: number, precision: number = 1000000): number {
        return val / precision;
    }

}