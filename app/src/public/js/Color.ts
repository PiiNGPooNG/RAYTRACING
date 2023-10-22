export default class Color {
    readonly r: number;
    readonly g: number;
    readonly b: number;

    constructor(r: number, g: number, b: number) {
        this.r = Math.min(1, Math.max(0, r));
        this.g = Math.min(1, Math.max(0, g));
        this.b = Math.min(1, Math.max(0, b));
    }

    static interpolate(color1: Color, color2: Color, t: number): Color {
        return new Color(
            (1 - t) * color1.r + t * color2.r,
            (1 - t) * color1.g + t * color2.g,
            (1 - t) * color1.b + t * color2.b
        )
    }

    lightAtAngle(lightColor: Color, angle: number) {
        return new Color(
            this.r * lightColor.r * Math.cos(angle),
            this.g * lightColor.g * Math.cos(angle),
            this.b * lightColor.b * Math.cos(angle)
        );
    }
}