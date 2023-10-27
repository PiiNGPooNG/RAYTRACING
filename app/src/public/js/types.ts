import Ray from "./Ray";
import Matrix from "./Matrix";
import Vector3 from "./Vector3";
import Color from "./Color";

export interface Camera {
    readonly viewMatrix: Matrix;
    getRay(x: number, y: number, width: number, height: number): Ray;
}

export interface Light {
    color: Color;
    transform(transform: Matrix): void;
    getRay(from: Vector3): Ray;
}