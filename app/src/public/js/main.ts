import {Canvas, Color, Vector3, Triangle, Ray} from "./renderer.js";

let canvasEl = document.querySelector("canvas");

let canvas = new Canvas(canvasEl, 500, 500);

let triangles = [];

triangles.push(new Triangle(
    new Vector3(93, 298, 294),
    new Vector3(38, 182, 141),
    new Vector3(152, 34, 272),
    new Color(255, 0, 0)
));

triangles.push(new Triangle(
  new Vector3(50, 67, 120),
  new Vector3(203, 123, 156),
  new Vector3(80, 200, 300),
  new Color(0, 255, 0)
));

for (let x = 0; x < canvas.width; x++) {
    for (let y = 0; y < canvas.height; y++) {
        let ray = new Ray(new Vector3(x, y, -100), new Vector3(0, 0 ,1));
        triangles.forEach((triangle) => {
           ray.calcIntersection(triangle);
        });
        let intersection = ray.intersection;
        if (intersection) {
            let color = ray.intersectedTriangle.color;
            canvas.pixel(x, y, color);
        }
    }
}