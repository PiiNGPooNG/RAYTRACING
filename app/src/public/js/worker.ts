import Vector3 from "./Vector3.js";
import {stlFileToTriangles} from './stlparser.js';
import Renderer2 from "./Renderer2.js";

self.onmessage = async (message) => {
    console.log("ok");
    const data = message.data;
    let renderer = new Renderer2(500, 500, 300, data.buffer);
    let triangles = await stlFileToTriangles('/3d/wuerfel.stl', new Vector3(250, 250, 180));
    renderer.addTriangles(triangles);
    renderer.render(data.x, data.y, data.width, data.height);
}
