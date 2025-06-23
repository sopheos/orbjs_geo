import { Point } from "./point"

/**
 * Points
 */
export class Points {

    private points: Point[] = [];

    public add(point: Point): Points {
        this.points.push(point);
        return this;
    }

    public all(): Point[] {
        return this.points;
    }

    public bounds(): Point[] {
        if (!this.points.length) return [new Point(-180, -180), new Point(180, 180)];

        let minlat = 0;
        let maxlat = 0;
        let minlon = 0;
        let maxlon = 0;
        let i = 0;

        this.points.forEach((point: Point) => {
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

    public center(): Point {
        if (!this.points.length) return new Point();
        let bounds = this.bounds();
        let lat = (bounds[0].getLat() + bounds[1].getLat()) / 2;
        let lon = (bounds[0].getLon() + bounds[1].getLon()) / 2;
        return new Point(lat, lon);
    }

    public closer(): Point {

        if (!this.points.length) return new Point();

        let center: Point = this.center();
        let min: number | null = null;
        let item: Point = new Point();;

        this.points.forEach((point: Point) => {
            let d = center.distanceTo(point);

            if (min === null || min > d) {
                min = d;
                item = point;
            }
        });

        return item;
    }
}