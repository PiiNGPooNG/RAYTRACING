import Ray from "./Ray";
import Matrix from "./Matrix";

export interface Camera {
    readonly viewMatrix: Matrix;
    getRay(x: number, y: number, width: number, height: number): Ray;
}