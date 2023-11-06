import Color from "./Color.js";

export default class Material {
    constructor(readonly color: Color, readonly reflectivity: number, readonly transparency: number, readonly ior: number) {
    }
}