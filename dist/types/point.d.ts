/**
 * Point
 */
export declare class Point {
    static readonly EARTH_RADIUS = 6378137;
    private lat;
    private lon;
    private rad_lat;
    private rad_lon;
    constructor(lat?: number, lon?: number);
    static fromDegree(lat?: number, lon?: number): Point;
    static fromRadian(lat?: number, lon?: number): Point;
    static fromMn95(e?: number, n?: number): Point;
    setLat(lat: number): Point;
    setLon(lon: number): Point;
    isNull(): boolean;
    getLat(): number;
    getLon(): number;
    getLatInt(): number;
    getLonInt(): number;
    getRadLat(): number;
    getRadLon(): number;
    latlng(): any;
    latlon(): any;
    distanceTo(point: Point): number;
    isInside(path: any, min: Point, max: Point): boolean;
    insidePoly(vertices: number[][]): boolean;
    insideGeoJson(geojson: any): boolean;
    private insideGeoCoordinates;
    static insideVertice(x: number, y: number, vertices: number[][]): boolean;
    static toInt(val: number, precision?: number): number;
    static toFloat(val: number, precision?: number): number;
}
