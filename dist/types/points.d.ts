import { Point } from "./point";
/**
 * Points
 */
export declare class Points {
    private points;
    add(point: Point): Points;
    all(): Point[];
    bounds(): Point[];
    center(): Point;
    closer(): Point;
}
